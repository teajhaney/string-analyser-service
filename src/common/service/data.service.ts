import { IStringDocument, IStringFilter, IParsedFilters } from '@/types';

// Key: SHA-256 hash, Value: IStringDocument
const inMemoryStore = new Map<string, IStringDocument>();

//save a string and its properties to the in-memory store
export const saveString = (document: IStringDocument): IStringDocument => {
  if (inMemoryStore.has(document.id)) {
    throw new Error(`String with ID ${document.id} already exists`);
  }
  inMemoryStore.set(document.id, document);
  return document;
};

//retrieve a string and its properties from the in-memory store
export const findById = (id: string): IStringDocument => {
  const document = inMemoryStore.get(id);
  if (!document) {
    throw new Error(`String with hash ID ${id} not found`);
  }
  return document;
};

//delete a string and its properties from the in-memory store
export const deleteString = (id: string): void => {
  if (!inMemoryStore.has(id)) {
    throw new Error(`String with hash ID ${id} not found`);
  }
  inMemoryStore.delete(id);
};

//search for strings based on the provided filters
export const searchDocument = (
  filters: IStringFilter | IParsedFilters
): IStringDocument[] => {
  const allStrings = Array.from(inMemoryStore.values());

  return allStrings.filter(doc => {
    const props = doc.properties;

    // 1. is_palindrome filter
    if (filters.is_palindrome !== undefined) {
      if (props.is_palindrome !== filters.is_palindrome) return false;
    }

    // 2. min_length filter
    if (filters.min_length !== undefined) {
      if (props.length < filters.min_length) return false;
    }

    // 3. max_length filter
    if (filters.max_length !== undefined) {
      if (props.length > filters.max_length) return false;
    }

    // 4. word_count filter
    if (filters.word_count !== undefined) {
      if (props.word_count !== filters.word_count) return false;
    }

    // 5. contains_character filter
    if (filters.contains_character !== undefined) {
      const char = filters.contains_character;
      // Case-insensitive check for character presence
      if (!doc.value.toLowerCase().includes(char.toLowerCase())) return false;
    }

    return true;
  });
};
