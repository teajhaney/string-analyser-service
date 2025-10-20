

/**
 * Interfaces for the String Analyzer Service data models and request types.
 */

// A map of characters to their occurrence count
export type CharacterFrequencyMap = {
    [key: string]: number;
};

// The computed properties of an analyzed string
export interface IStringProperties {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: CharacterFrequencyMap;
}

// The complete document stored in the database
export interface IStringDocument {
    id: string; // The SHA-256 hash acts as the ID
    value: string;
    properties: IStringProperties;
    created_at: string; // ISO 8601 string
}

// Request body for POST /strings
export interface IAnalyzeRequest {
    value: string;
}

// Query parameters for GET /strings
export interface IStringFilter {
    is_palindrome?: boolean;
    min_length?: number;
    max_length?: number;
    word_count?: number;
    contains_character?: string;
}

// Interpreted filters from Natural Language Query
export interface IParsedFilters {
    word_count?: number;
    is_palindrome?: boolean;
    min_length?: number;
    max_length?: number;
    contains_character?: string;
}
