# ghg-worldbank-backend

# Backend Setup

This README provides instructions on how to set up and run the backend server on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/aptopspeed/ghg-worldbank-backend.git
   cd ghg-worldbank-backend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

## Configuration
(already exist in repository for temporary you can skip this all step):
1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` 
## Running the Server

To start the development server:

```
npm run dev
```

This command will start the server using nodemon, which allows for automatic restarting of the server when file changes are detected.

The server will be available at `http://localhost:8081`.

## API Endpoints

I prepared the postman collection with json file on my OneDrive Cloud Follow this link:
https://1drv.ms/f/s!AuuY42Jd0jKxhrcF_52CEvRkIZIirw?e=YuyCah
<br/>
FileName: `GHG-API-Collections.postman_collection.json`

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed correctly (`npm install`).
2. Check that the `.env` file is set up correctly with the right port number.
3. Make sure no other process is using port 8081.