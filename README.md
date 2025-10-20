# 🚀 Express.js TypeScript API Boilerplate

## Overview
This project provides a robust, production-ready starter template for building high-performance APIs with **Node.js**, **Express.js**, and **TypeScript**. It incorporates essential security, logging, and error handling best practices to accelerate development of scalable backend services.

## Features
- **TypeScript**: Ensures type safety and improves code maintainability.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **Helmet**: Secures Express apps by setting various HTTP headers.
- **CORS**: Enables Cross-Origin Resource Sharing for flexible API access.
- **Express Rate Limit**: Protects against brute-force attacks and denial-of-service by limiting repeated requests.
- **Winston Logger**: Comprehensive and customizable logging for debugging and monitoring.
- **Custom Error Handling**: Centralized error management with an `AppError` class for consistent API responses.
- **Async Handler**: Simplifies asynchronous route handling, automatically catching and forwarding errors.
- **Centralized Configuration**: Manages environment variables for different deployment stages.
- **Nodemon**: Automatically restarts the server during development for a smoother workflow.

## Getting Started

To get this API boilerplate up and running on your local machine, follow these steps:

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/teajhaney/express-typescript-template.git
    cd express-typescript-template
    ```

2.  **Install Dependencies**:
    Install all required packages using npm or yarn.
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables
Before running the application, you need to set up your environment variables. Create a `.env` file in the root of the project and add the following:

```env
PORT=3000
NODE_ENV=development
```

-   `PORT`: The port number on which the Express server will listen.
-   `NODE_ENV`: The environment (e.g., `development`, `production`). This affects logging levels.

### Usage

1.  **Development Mode**:
    To run the server in development mode with `nodemon`, which automatically restarts the server on file changes:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The server will be accessible at `http://localhost:3000` (or your specified `PORT`).

2.  **Build and Start Production**:
    First, compile the TypeScript code:
    ```bash
    npm run build
    # or
    yarn build
    ```
    Then, start the server using the compiled JavaScript:
    ```bash
    npm start
    # or
    yarn start
    ```
    The production server will be accessible at `http://localhost:3000` (or your specified `PORT`).

3.  **Clean Build Artifacts**:
    To remove the `dist` folder containing compiled JavaScript files:
    ```bash
    npm run clean
    # or
    yarn clean
    ```

## API Documentation

This project provides a foundational boilerplate for an API. It sets up middleware for security, logging, error handling, and rate limiting but does not include application-specific endpoints by default. You can extend it by adding your routes and controllers in the `src/routes` and `src/controllers` directories (which you would create).

### Base URL
The base URL will depend on your environment:
-   **Development**: `http://localhost:PORT` (e.g., `http://localhost:3000`)
-   **Production**: `Your_Deployed_Domain`

### Endpoints
While there are no custom application routes defined in this boilerplate, the following system-level behaviors are handled:

#### `ANY /<undefined-route>`
This applies to any route that does not match a defined endpoint.
**Request**:
```
No specific payload.
```
**Response**:
```json
{
  "success": false,
  "message": "Route /api/v1/nonexistent not found"
}
```
**Errors**:
-   `404 Not Found`: Occurs when a requested route does not exist.

#### `ANY /<any-route>` (Rate Limited)
Applies to any endpoint when the rate limit is exceeded.
**Request**:
```
No specific payload.
```
**Response**:
```json
{
  "success": false,
  "message": "Too many requests"
}
```
**Errors**:
-   `429 Too Many Requests`: Triggered when the client exceeds the allowed request limit (50 requests per minute by default).

#### `ANY /<any-route>` (Internal Server Error)
Applies to any endpoint when an unhandled server-side error occurs.
**Request**:
```
No specific payload.
```
**Response**:
```json
{
  "success": false,
  "message": "Internal server error"
}
```
**Errors**:
-   `500 Internal Server Error`: Generic server error.
-   Custom errors defined using `AppError` will return their specific `statusCode` and `message`.

## Technologies Used

| Technology         | Description                                     | Link                                                            |
| :----------------- | :---------------------------------------------- | :-------------------------------------------------------------- |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) | Typed superset of JavaScript that compiles to plain JavaScript. | [TypeScript](https://www.typescriptlang.org/)                   |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) | JavaScript runtime built on Chrome's V8 JavaScript engine.      | [Node.js](https://nodejs.org/en/)                               |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | Fast, unopinionated, minimalist web framework for Node.js.      | [Express.js](https://expressjs.com/)                            |
| ![Winston](https://img.shields.io/badge/Winston-orange?style=for-the-badge&logo=winston&logoColor=white) | A versatile logging library for Node.js.                        | [Winston](https://github.com/winstonjs/winston)                 |
| ![Helmet](https://img.shields.io/badge/Helmet-white?style=for-the-badge&logo=helmet&logoColor=black) | Secures Express apps by setting various HTTP headers.           | [Helmet](https://helmetjs.github.io/)                           |
| ![CORS](https://img.shields.io/badge/CORS-gray?style=for-the-badge) | Middleware for enabling Cross-Origin Resource Sharing.          | [CORS](https://github.com/expressjs/cors)                       |
| ![dotenv](https://img.shields.io/badge/dotenv-black?style=for-the-badge&logo=dotenv&logoColor=white) | Loads environment variables from a `.env` file.                 | [dotenv](https://github.com/motdotla/dotenv)                    |
| ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white) | Utility that monitors for changes and automatically restarts.   | [Nodemon](https://nodemon.io/)                                  |

## Contributing
We welcome contributions to enhance this boilerplate! If you'd like to contribute, please follow these guidelines:

1.  🍴 **Fork the Repository**: Start by forking this repository to your GitHub account.
2.  🌳 **Create a New Branch**: Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b fix/bug-description
    ```
3.  ✨ **Implement Your Changes**: Make your changes and ensure your code adheres to the existing style and quality.
4.  🧪 **Test Your Changes**: If applicable, add or update tests to cover your changes.
5.  ➕ **Commit Your Changes**: Commit your changes with a clear and concise message.
    ```bash
    git commit -m "feat: Add new awesome feature"
    # or
    git commit -m "fix: Resolve critical bug in module X"
    ```
6.  ⬆️ **Push to Your Fork**: Push your branch to your forked repository.
    ```bash
    git push origin feature/your-feature-name
    ```
7.  🤝 **Open a Pull Request**: Submit a pull request to the `main` branch of this repository. Provide a detailed description of your changes.

## License
This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) file for details.

## Author Info
Developed with passion by Yusuf Tijani Olatunde.

-   **LinkedIn**: [Your_LinkedIn_Profile]
-   **Twitter**: [Your_Twitter_Handle]
-   **Portfolio**: [Your_Portfolio_Website]

---

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)
![Winston](https://img.shields.io/badge/Winston-orange?style=for-the-badge&logo=winston&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-white?style=for-the-badge&logo=helmet&logoColor=black)
![CORS](https://img.shields.io/badge/CORS-gray?style=for-the-badge)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)