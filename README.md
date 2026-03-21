# Autograb Vehicle Form Application

## Project Description

Autograb is a full-stack web application designed to capture and process vehicle details along with logbook file uploads. The application consists of two main parts:
- **Client**: A front-end application built with React, TypeScript, and Vite that provides a user-friendly form (`VechileForm`) for users to select a vehicle's make, model, and badge, and upload a logbook file (text format).
- **Server**: A back-end service built with Node.js and Express that exposes an `/upload` API endpoint. It validates the incoming vehicle data and ensures the uploaded file is in the correct format before processing the request.

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

## Steps to Run

### 1. Server Setup
The Express server needs to be running to handle the client's upload requests.

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:3000` by default):
   ```bash
   node index.js
   ```

### 2. Client Setup
The React front-end runs via Vite.

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL provided by Vite (e.g., `http://localhost:5173/`) to access the Autograb vehicle form.
