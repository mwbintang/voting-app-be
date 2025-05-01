# **Voting App Backend**

This repository contains the backend for the Voting App. It is built using Node.js, Express, MongoDB, and other technologies. Below are the steps to set up and run the backend locally.

---

## **Prerequisites**

Before running the project, ensure you have the following installed on your local machine:

- **Node.js** (LTS version recommended): [Download Node.js](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas): [Set up MongoDB](https://www.mongodb.com/)
- **Git**: [Install Git](https://git-scm.com/)

---

## **Getting Started**

### 1. **Clone the Repository**

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/voting-app-backend.git
cd voting-app-backend
```

---

### 2. **Install Dependencies**

Install all the required dependencies using npm (Node Package Manager):

```bash
npm install
```

---

### 3. **Set Up Environment Variables**

Copy the `.env.example` file to `.env` and configure it with your MongoDB connection and other environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file to add your MongoDB URI and other configuration:

```
MONGODB_URI=
JWT_SECRET=
PORT=
JWT_EXPIRES_IN=
```

Make sure to replace the placeholder values with your actual configurations.

---

### 4. **Run the Application Locally**

To start the backend server locally, run:

```bash
npm start
```

This will start the application on `http://localhost:5000` (or whatever port you have set in `.env`).

---

### 5. **Run in Development Mode**

If you want to run the server in development mode with auto-reloading, use:

```bash
npm run dev
```

This will start the server using `nodemon`, so the server will automatically restart whenever there are changes to the code.

---

### 6. **Seeding the Database**

If you want to seed the database with initial data (e.g., roles, permissions), run the following command:

```bash
npm run seed
```

This will populate the database with the default data for your app (make sure the `.env` file is correctly set up for MongoDB).

---

### 7. **Run Tests**

To run all the tests for your backend, use the following command:

```bash
npm test
```

This will run your unit and integration tests (including those for controllers, middleware, and services).

---

## **API Documentation**

You can find the list of available API endpoints below:

- **POST /api/register** - Registers a new user.
- **POST /api/login** - Logs in an existing user.
- **GET /api/protected** - Example protected route that requires a valid JWT token.
  
For more information about the API, you can check the documentation or inspect the routes in the `src/routes` folder.

---

## **Error Handling**

If you encounter any errors, check the logs in the terminal where the server is running for detailed information. Common errors include missing environment variables or issues with the MongoDB connection.