# Employee Management System

Full-stack CRUD starter using React + Vite, Node.js + Express, and MySQL 8.

## Requirements
- Node.js 18+
- MySQL 8+
- npm

## 1. Database setup
Open MySQL Workbench or your MySQL client and run `database.sql`.

## 2. Backend setup
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and update the MySQL credentials.
```bash
npm run dev
```
Backend runs at http://localhost:5000.

## 3. Frontend setup
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually http://localhost:5173).

## API routes
- `GET /api/employees` — list employees
- `GET /api/employees/:id` — get one employee
- `POST /api/employees` — create employee
- `PUT /api/employees/:id` — update employee
- `DELETE /api/employees/:id` — delete employee

## Notes
This is a learning starter. It includes basic input validation and parameterized SQL queries. Do not commit your real `.env` file.
