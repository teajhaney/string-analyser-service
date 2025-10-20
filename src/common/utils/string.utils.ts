import * as crypto from 'crypto';
import {
  IStringProperties,
  CharacterFrequencyMap,
  IParsedFilters,
} from '@/types';

//compute a SHA-256 for a given string
export const generateSha256Hash = (value: string): string => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

//check if a string is a palindrome
export const isPalindrome = (value: string): boolean => {
  const formattedValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = formattedValue.split('').reverse().join('');
  return formattedValue === reversed && formattedValue.length > 0;
};

//generate the character frequency of a string (case sensitive)
export const generateCharacterFrequency = (
  value: string
): CharacterFrequencyMap => {
  const frequencyMap: CharacterFrequencyMap = {};
  for (const char of value) {
    frequencyMap[char] = (frequencyMap[char] || 0) + 1;
  }
  return frequencyMap;
};

//Counts number of distinct characters in a string
export const countDistinctCharacters = (value: string): number => {
  const frequencyMap = generateCharacterFrequency(value);
  return Object.keys(frequencyMap).length;
};

// export function countUniqueCharacters(s: string): number {
//   const uniqueChars = new Set(s);
//   return uniqueChars.size;
// }

//Count the number of words in a string
export const countWords = (value: string): number => {
  const words = value
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  return words.length;
};

// analyse a string and return the properties
export const analyzeString = (value: string): IStringProperties => {
  const hash = generateSha256Hash(value);
  const properties: IStringProperties = {
    length: value.length,
    is_palindrome: isPalindrome(value),
    unique_characters: countDistinctCharacters(value),
    word_count: countWords(value),
    sha256_hash: hash,
    character_frequency_map: generateCharacterFrequency(value),
  };
  return properties;
};



export function interpretQuery(query: string): IParsedFilters | null {
  const normalizedQuery = query.toLowerCase().trim();
  const filters: IParsedFilters = {};

  //  Palindrome detection
  if (/\bpalindrom(ic|e)?\b/.test(normalizedQuery)) {
    filters.is_palindrome = true;
  }

  //  Word count detection (single, double, etc.)
  const wordCountPatterns: Record<string, number> = {
    single: 1,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
  };

  const wordMatch = normalizedQuery.match(
    /\b(single|one|two|three|four|five)\b(?:[\s-]*(word|words|string|strings))?/
  );
  if (wordMatch) {
    filters.word_count = wordCountPatterns[wordMatch[1]];
  }
  //word fallback
  if (
    normalizedQuery.includes('single') &&
    normalizedQuery.includes('string')
  ) {
    filters.word_count = 1;
  }

  // letter based filter e.g. "longer than 10", "shorter than 5", "more than 8 characters"
  const lengthMatch = normalizedQuery.match(
    /\b(longer|shorter|more|less)\s+than\s+(\d+)\b/
  );
  if (lengthMatch) {
    const operator = lengthMatch[1];
    const number = parseInt(lengthMatch[2], 10);

    if (['longer', 'more'].includes(operator)) filters.min_length = number + 1;
    else if (['shorter', 'less'].includes(operator))
      filters.max_length = number - 1;
  }

  //  Explicit "characters" phrasing
  const charLengthMatch = normalizedQuery.match(
    /(\d+)\s*(character|characters|chars)\b/
  );
  if (charLengthMatch && !filters.min_length && !filters.max_length) {
    filters.min_length = parseInt(charLengthMatch[1]);
  }

  // Handles "contains the letter z", "with letter a", "having z"
  const containsMatch = normalizedQuery.match(
    /(contain|contains|with|having|include|includes)\s+(the\s+letter\s+)?([a-z])/
  );
  if (containsMatch) {
    filters.contains_character = containsMatch[3];
  }

  //  Vowel-based filters
  if (normalizedQuery.includes('first vowel')) {
    filters.contains_character = 'a';
  } else if (normalizedQuery.includes('last vowel')) {
    filters.contains_character = 'u';
  } else if (normalizedQuery.includes('vowel')) {
    filters.contains_character = 'a'; // generic heuristic
  }

  //  Handle "all strings" or "every string" queries
  if (
    /^all\b|every\b/.test(normalizedQuery) &&
    Object.keys(filters).length === 0
  ) {
    return {};
  }

  //  Return null if nothing parsed
  if (Object.keys(filters).length === 0) {
    return null;
  }

  return filters;
}
