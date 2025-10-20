# String Analyzer Service API 🔬

## Overview
This is a robust RESTful API service developed with TypeScript, Node.js, and Express, designed for comprehensive string analysis and property storage. It leverages an in-memory data store for high-performance data operations and incorporates essential security middleware for production readiness.

## Features
*   **String Analysis**: Automatically computes various string properties including length, palindrome status, unique character count, word count, SHA-256 hash, and character frequency map.
*   **In-Memory Storage**: Efficiently stores and retrieves analyzed string documents using an in-memory key-value store.
*   **Flexible Filtering**: Supports retrieving strings based on a variety of technical filters such as length ranges, palindrome status, word count, and character presence.
*   **Natural Language Query**: Advanced endpoint for filtering strings using natural language descriptions, intelligently parsing user queries into concrete filters.
*   **Data Retrieval & Deletion**: Provides endpoints to fetch all stored strings, retrieve a specific string by its value, and delete strings from the system.
*   **Security & Performance**: Implements `helmet` for HTTP header security, `cors` for cross-origin resource sharing, and `express-rate-limit` to prevent abuse.
*   **Structured Logging**: Utilizes `winston` for robust and configurable logging, aiding in debugging and monitoring.
*   **Centralized Error Handling**: Features a global error handling middleware to gracefully manage application errors and provide consistent responses.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Installation
*   **Clone the Repository**:
    ```bash
    git clone https://github.com/teajhaney/string-analyser-service.git
    cd string-analyser-service
    ```
*   **Install Dependencies**:
    ```bash
    npm install
    ```
*   **Run in Development Mode**:
    ```bash
    npm run dev
    ```
    The server will start on the configured port (default: `3000`) and automatically restart on code changes.
*   **Build and Start in Production Mode**:
    ```bash
    npm run build
    npm start
    ```
    This will compile the TypeScript code to JavaScript and then start the server.

### Environment Variables
This project requires the following environment variables to be configured. Create a `.env` file in the project root directory.

*   `PORT`: The port on which the server will run.
    *   **Example**: `PORT=3000`
*   `NODE_ENV`: The environment the application is running in (e.g., `development`, `production`, `test`).
    *   **Example**: `NODE_ENV=development`

## API Documentation

### Base URL
`http://localhost:3000` (or your configured `PORT`)

### Endpoints

#### GET `/`
**Description**: Health check endpoint to verify the service is running and responsive.

**Request**:
No request body or query parameters.

**Response (200 OK)**:
```json
{
  "message": "String Analyzer Service is running ✅"
}
```

**Errors**:
- `500 Internal Server Error`: Occurs if the server fails to initialize correctly.

#### POST `/strings`
**Description**: Analyzes a given string, computes its properties (length, palindrome status, word count, character frequency, SHA-256 hash), and stores it in the system.

**Request**:
```json
{
  "value": "your string to analyze"
}
```

**Response (201 Created)**:
```json
{
  "id": "c62b489a5c8e3e4f3a0a0d0a0b0c0d0e0f0g0h0i0j0k0l0m0n0o0p0q0r0s0t0u",
  "value": "Hello World",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "c62b489a5c8e3e4f3a0a0d0a0b0c0d0e0f0g0h0i0j0k0l0m0n0o0p0q0r0s0t0u",
    "character_frequency_map": {
      "H": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "W": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2023-10-26T10:00:00.000Z"
}
```

**Errors**:
- `400 Bad Request`: Invalid request body or missing `value` field.
- `409 Conflict`: String already exists in the system (based on its SHA-256 hash).
- `422 Unprocessable Entity`: Invalid data type for `value` (e.g., not a string or an empty string).
- `500 Internal Server Error`: Generic server error.

#### GET `/strings/get`
**Description**: Retrieves all stored string documents without any filtering.

**Request**:
No request body or query parameters.

**Response (200 OK)**:
```json
{
  "count": 2,
  "data": [
    {
      "id": "c62b489a5c8e3e4f3a0a0d0a0b0c0d0e0f0g0h0i0j0k0l0m0n0o0p0q0r0s0t0u",
      "value": "Hello World",
      "properties": {
        "length": 11,
        "is_palindrome": false,
        "unique_characters": 8,
        "word_count": 2,
        "sha256_hash": "c62b489a5c8e3e4f3a0a0d0a0b0c0d0e0f0g0h0i0j0k0l0m0n0o0p0q0r0s0t0u",
        "character_frequency_map": {
          "H": 1, "e": 1, "l": 3, "o": 2, " ": 1, "W": 1, "r": 1, "d": 1
        }
      },
      "created_at": "2023-10-26T10:00:00.000Z"
    },
    {
      "id": "another_hash_here",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha256_hash": "another_hash_here",
        "character_frequency_map": { "m": 2, "a": 2, "d": 1 }
      },
      "created_at": "2023-10-26T10:05:00.000Z"
    }
  ]
}
```

**Errors**:
- `402 Payment Required`: No string documents are currently available in the system.
- `500 Internal Server Error`: Generic server error.

#### GET `/strings`
**Description**: Retrieves string documents based on specified technical filters (e.g., length, palindrome status).

**Request**:
Query parameters are used for filtering. All parameters are optional.
- `is_palindrome`: `true` or `false` (boolean)
- `min_length`: Minimum length (integer, must be non-negative)
- `max_length`: Maximum length (integer, must be non-negative)
- `word_count`: Exact word count (integer, must be non-negative)
- `contains_character`: A single character to check for presence (string, length 1)

**Example**: `GET /strings?is_palindrome=true&min_length=3`

**Response (200 OK)**:
```json
{
  "data": [
    {
      "id": "another_hash_here",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha256_hash": "another_hash_here",
        "character_frequency_map": { "m": 2, "a": 2, "d": 1 }
      },
      "created_at": "2023-10-26T10:05:00.000Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 3
  }
}
```

**Errors**:
- `400 Bad Request`: Invalid query parameter type or format for any filter.
- `500 Internal Server Error`: Generic server error.

#### GET `/strings/filter-by-natural-language`
**Description**: Retrieves string documents by interpreting natural language queries into technical filters. This endpoint can understand phrases like "strings longer than 5 characters" or "palindromic strings with a single word".

**Request**:
Query parameter `query` (string).
- `query`: A natural language string describing the desired filters.

**Example**: `GET /strings/filter-by-natural-language?query=strings%20longer%20than%205%20characters%20and%20are%20palindromic`

**Response (200 OK)**:
```json
{
  "count": 1,
  "data": [
    {
      "id": "another_hash_here",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha256_hash": "another_hash_here",
        "character_frequency_map": { "m": 2, "a": 2, "d": 1 }
      },
      "created_at": "2023-10-26T10:05:00.000Z"
    }
  ],
  "interpreted_query": {
    "original": "strings longer than 5 characters and are palindromic",
    "parsed_filters": {
      "min_length": 6,
      "is_palindrome": true
    }
  }
}
```

**Errors**:
- `400 Bad Request`: Missing, empty, or an uninterpretable `query` parameter.
- `422 Unprocessable Entity`: The natural language query resulted in conflicting filters (e.g., `min_length > max_length`).
- `500 Internal Server Error`: Generic server error.

#### GET `/strings/:stringValue`
**Description**: Retrieves a single string document by its original string value. The system internally hashes the provided `stringValue` for lookup.

**Request**:
Path parameter `stringValue` (string).
- `stringValue`: The exact string value to retrieve (e.g., `madam`).

**Example**: `GET /strings/madam`

**Response (200 OK)**:
```json
{
  "id": "another_hash_here",
  "value": "madam",
  "properties": {
    "length": 5,
    "is_palindrome": true,
    "unique_characters": 3,
    "word_count": 1,
    "sha256_hash": "another_hash_here",
    "character_frequency_map": { "m": 2, "a": 2, "d": 1 }
  },
  "created_at": "2023-10-26T10:05:00.000Z"
}
```

**Errors**:
- `400 Bad Request`: Missing or invalid `stringValue` in the path.
- `404 Not Found`: The string does not exist in the system.
- `500 Internal Server Error`: Generic server error.

#### DELETE `/strings/:stringValue`
**Description**: Deletes a string document from the system based on its original string value. The system internally hashes the provided `stringValue` for lookup.

**Request**:
Path parameter `stringValue` (string).
- `stringValue`: The exact string value to delete (e.g., `Hello%20World`).

**Example**: `DELETE /strings/Hello%20World`

**Response (204 No Content)**:
```json
{
  "message": "String value deleted successfully"
}
```

**Errors**:
- `404 Not Found`: The string does not exist in the system.
- `500 Internal Server Error`: Generic server error.

## Technologies Used

| Technology         | Description                                        | Link                                                                  |
| :----------------- | :------------------------------------------------- | :-------------------------------------------------------------------- |
| **Node.js**        | JavaScript runtime environment                     | [nodejs.org](https://nodejs.org/)                                     |
| **TypeScript**     | Superset of JavaScript with static typing          | [typescriptlang.org](https://www.typescriptlang.org/)                 |
| **Express.js**     | Fast, unopinionated, minimalist web framework      | [expressjs.com](https://expressjs.com/)                               |
| **Winston**        | Versatile logging library                          | [github.com/winstonjs/winston](https://github.com/winstonjs/winston)  |
| **Dotenv**         | Loads environment variables from a `.env` file     | [github.com/motdotla/dotenv](https://github.com/motdotla/dotenv)      |
| **Helmet**         | Secures Express apps by setting various HTTP headers | [helmetjs.github.io/](https://helmetjs.github.io/)                   |
| **CORS**           | Middleware for enabling Cross-Origin Resource Sharing | [github.com/expressjs/cors](https://github.com/expressjs/cors)        |
| **Express Rate Limit** | Basic rate-limiting middleware for Express | [npmjs.com/package/express-rate-limit](https://www.npmjs.com/package/express-rate-limit) |
| **Nodemon**        | Utility for monitoring changes and restarting Node.js app | [nodemon.io](https://nodemon.io/)                                     |

## License
This project is licensed under the MIT License.

## Author Info

👋 Yusuf Tijani Olatunde (섭이)

A passionate backend developer with a keen eye for robust and scalable solutions.

*   LinkedIn: [linkedin.com/in/your_username](https://linkedin.com/in/your_username)
*   Twitter: [twitter.com/your_username](https://twitter.com/your_username)
*   Portfolio: [your-portfolio.com](https://your-portfolio.com)

---

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue?logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/teajhaney/string-analyser-service?style=social)](https://github.com/teajhaney/string-analyser-service)
[![Repo Size](https://img.shields.io/github/repo-size/teajhaney/string-analyser-service)](https://github.com/teajhaney/string-analyser-service)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)