# Contact Manager (Node.js + TypeScript + React)

A simple full-stack **Contact Manager** application built with **Express + TypeScript** on the backend and **React + Vite** on the frontend.  
Supports full CRUD operations (Create, Read, Update, Delete) with local JSON file storage.

## Features
- REST API with Express (GET, POST, PUT/PATCH, DELETE)
- Type-safe backend and frontend (TypeScript)
- React frontend with form to add, edit, and delete contacts
- CORS enabled for frontend-backend communication
- Easy to run locally and deployable to Render/Vercel

## Project Structure

. ├─ src/ # Backend (Express + TS) ├─ client/ # Frontend (React + Vite + TS) ├─ data/contacts.json # Local storage └─ README.md

## Getting Started

### Backend
```bash
npm install
npm run serve # runs on http://localhost:3000

Frontend

cd client
npm install
# create client/.env file:
# VITE_API_URL=http://localhost:3000
npm run dev # runs on http://localhost:5173

API Endpoints

GET /contacts → get all contacts

POST /contacts → create a new contact

PUT /contacts/:id → update a contact

DELETE /contacts/:id → delete a contact


Deployment

Backend: Render (Build: npm run build, Start: npm start)

Frontend: Vercel or Netlify (base folder client, build npm run build, output dist)

Environment: VITE_API_URL=https://ts-contact-manager.onrender.com

