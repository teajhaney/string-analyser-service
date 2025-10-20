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

//Simple rule-based interpretation of a natural language query into formal filters.
export const interpretQuery = (query: string): IParsedFilters => {
  const normalizedQuery = query.toLowerCase().trim();
  const filters: IParsedFilters = {};

  // palindrome filter check
  if (
    normalizedQuery.includes('palindrome') ||
    normalizedQuery.includes('palindromic')
  ) {
    filters.is_palindrome = true;
  }

  // word count filter check
  if (normalizedQuery.includes('word count')) {
    const wordCount = parseInt(normalizedQuery.split('word count')[1].trim());
    filters.word_count = wordCount;
  }

  //   const wordCountMatch = normalizedQuery.match(
  //     /(single|two|three|four|five)\s+word/
  //   );
  //   if (wordCountMatch) {
  //     const wordMap: { [key: string]: number } = {
  //       single: 1,
  //       two: 2,
  //       three: 3,
  //       four: 4,
  //       five: 5,
  //     };
  //     filters.word_count = wordMap[wordCountMatch[1]] || 1;
  //   }

  // length filter check
  if (normalizedQuery.includes('length')) {
    const length = parseInt(normalizedQuery.split('length')[1].trim());
    filters.min_length = length;
    filters.max_length = length;
  }

  // contains character filter check
  if (normalizedQuery.includes('contains')) {
    const character = normalizedQuery
      .toLocaleLowerCase()
      .split('contains')[1]
      .trim();
    filters.contains_character = character;
  }

  // If no meaningful filters were parsed, treat it as null/unparsable.
  if (Object.keys(filters).length === 0) {
    // Allow filtering for just 'all strings'
    return normalizedQuery.includes('all') ? filters : {};
  }

  return filters;
};
