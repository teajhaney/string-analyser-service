import type { Request, Response } from 'express';
import type {
  IAnalyzeRequest,
  IStringDocument,
  IStringFilter,
  IParsedFilters,
} from '../types/index.ts';
import {
  deleteString,
  findById,
  saveString,
  searchDocument,
} from '../common/service/data.service.ts';
import {
  handleError,
  validateStringValue,
} from '../common/utils/handle.error.ts';
import {
  analyzeString,
  generateSha256Hash,
  interpretQuery,
} from '../common/utils/string.utils.ts';

//create/analyse string
export const createString = (
  req: Request<{}, {}, IAnalyzeRequest>,
  res: Response
) => {
  if (!req.body || !req.body.value) {
    return res
      .status(400)
      .json({ message: 'Invalid request body or missing "value" field' });
  }
  const value = validateStringValue(req.body.value);

  ///analyse string and create document
  const properties = analyzeString(value);
  const newDocument: IStringDocument = {
    id: properties.sha256_hash,
    value,
    properties,
    created_at: new Date().toISOString(),
  };

  //in memory service
  //save the document to the in-memory store
  try {
    const savedDococument = saveString(newDocument);
    // 201 Created
    return res.status(201).json(savedDococument);
  } catch (error) {
    // 409 Conflict
    if (error instanceof Error && error.message.includes('Conflict')) {
      return res
        .status(409)
        .json({ message: 'Conflict: String already exists in the system.' });
    }

    // 500 Internal Server Error
    return handleError(res, error, 'createString');
  }
};

//get specific document by string ID
export const getStringByValue = (
  req: Request<{ stringValue: string }>,
  res: Response
) => {
  try {
    const stringValue = req.params.stringValue;

    if (!stringValue || typeof stringValue !== 'string') {
      return res
        .status(400)
        .json({ message: 'Bad Request: Missing or invalid string value.' });
    }

    // Compute hash for lookup
    const hash = generateSha256Hash(stringValue);
    const document = findById(hash);

    if (!document) {
      // 404 Not Found
      return res.status(404).json({
        message: 'Not Found: String does not exist in the system.',
      });
    }

    // 200 OK
    return res.status(200).json(document);
  } catch (error) {
    return handleError(res, error, 'getStringByValue');
  }
};

//get all string with filtering
export const getAllStringsWithFiltering = (
  req: Request<{}, {}, {}, IStringFilter>,
  res: Response
) => {
  const filters: IStringFilter = {};
  const filtersApplied: { [key: string]: any } = {};

  // Helper to validate and convert query parameters
  const parseQuery = (
    key: keyof IStringFilter,
    type: 'boolean' | 'integer' | 'string',
    handler: (val: any) => any
  ) => {
    const value = req.query[key];
    if (value !== undefined) {
      try {
        const parsedValue = handler(value);
        (filters as any)[key] = parsedValue;
        filtersApplied[key] = parsedValue;
      } catch (e) {
        // 400 Bad Request
        throw new Error(
          `Invalid query parameter type for '${key}'. Expected ${type}.`
        );
      }
    }
  };

  try {
    // Parse Boolean
    parseQuery('is_palindrome', 'boolean', v => {
      const lower = String(v).toLowerCase();
      if (lower === 'true') return true;
      if (lower === 'false') return false;
      throw new Error();
    });

    // Parse Integers
    const intParser = (v: any) => {
      const num = parseInt(String(v), 10);
      if (isNaN(num) || num < 0) throw new Error();
      return num;
    };
    parseQuery('min_length', 'integer', intParser);
    parseQuery('max_length', 'integer', intParser);
    parseQuery('word_count', 'integer', intParser);

    // Parse String (single character check)
    parseQuery('contains_character', 'string', v => {
      if (typeof v === 'string' && v.length === 1) return v;
      throw new Error();
    });

    // Apply filters
    const matchingDocs = searchDocument(filters);

    // 200 OK
    return res.status(200).json({
      data: matchingDocs,
      count: matchingDocs.length,
      filters_applied: filtersApplied,
    });
  } catch (e) {
    // 400 Bad Request
    if (e instanceof Error) {
      return res.status(400).json({ message: `Bad Request: ${e.message}` });
    }

    return handleError(res, e, 'getAllStringsWithFiltering');
  }
};

//get string with natural language filter
export const filterByNaturalLanguage = (req: Request, res: Response) => {
  try {
    const query = req.query.query as string | undefined;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res
        .status(400)
        .json({ message: 'Bad Request: Missing or empty "query" parameter.' });
    }

    const parsedFilters: IParsedFilters | null = interpretQuery(query);

    if (parsedFilters === null) {
      // 400 Bad Request
      return res.status(400).json({
        message:
          'Bad Request: Unable to parse natural language query into concrete filters.',
      });
    }

    // Check for conflicting filters (e.g., min_length > max_length)
    if (
      parsedFilters.min_length !== undefined &&
      parsedFilters.max_length !== undefined &&
      parsedFilters.min_length > parsedFilters.max_length
    ) {
      // 422 Unprocessable Entity
      return res.status(422).json({
        message:
          'Unprocessable Entity: Query resulted in conflicting length filters.',
        interpreted_query: { original: query, parsed_filters: parsedFilters },
      });
    }

    // Apply filters
    const matchingDocs = searchDocument(parsedFilters);

    // 200 OK
    return res.status(200).json({
      count: matchingDocs.length,
      data: matchingDocs,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters,
      },
    });
  } catch (error) {
    return handleError(res, error, 'filterByNaturalLanguage');
  }
};

//delete specific document by string ID
export const deleteStringByValue = (
  req: Request<{ stringValue: string }>,
  res: Response
) => {
  try {
    const { stringValue } = req.params;
    const hash = generateSha256Hash(stringValue);

    const document = findById(hash);

    if (!document) {
      // 404 Not Found
      return res
        .status(404)
        .json({ message: 'Not Found: String does not exist in the system.' });
    }

    deleteString(hash);

    // 204 No Content
    return res
      .status(204)
      .json({ message: 'String value deleted succeessfully' });
  } catch (error) {
    return handleError(res, error, 'deleteStringByValue');
  }
};

//get all saved strings (no filters)
export const getAllSavedStrings = (_req: Request, res: Response) => {
  try {
    const allDocs = searchDocument({});

    if (allDocs.length === 0) {
      res.status(402).send({ message: 'No string document avaiilable' });
    }
    return res.status(200).json({
      count: allDocs.length,
      data: allDocs,
    });
  } catch (error) {
    return handleError(res, error, 'getAllSavedStrings');
  }
};
