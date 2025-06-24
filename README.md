# Chitter – A Full-Stack Microblogging Platform

Chitter is a full-stack web application modeled after Twitter, enabling users to create, interact with, and manage short text-based posts called *chits*. Unlike a frontend-only clone, Chitter features a fully integrated backend with real-time data persistence, user authentication, and media handling. It supports user registration, secure login, chit creation and deletion, liking functionality, profile management, and image uploads using Cloudinary. The frontend and backend are deployed independently using Render, with secure API communication and environment-based configuration.

## Features

- **User Authentication**
  - Secure login and signup functionality using JSON Web Tokens (JWT).
  - Authenticated routes on both frontend and backend for protected actions.

- **Microblogging (Chits)**
  - Users can create, read, update, and delete text-based posts.
  - Posts (chits) can be liked and are displayed in reverse chronological order.
  - Filtering by "For You" (global feed) and "Following" (followed users only).

- **Profile Management**
  - Users can view and edit their profile information: name, username, date of birth, and location.
  - Fully responsive profile and account edit pages.

- **Profile Picture Upload (Cloudinary Integration)**
  - Upload profile pictures through a dedicated form.
  - Images are stored in Cloudinary and persist across sessions and deployments.
  - Default profile picture (`pfp.png`) assigned on registration.

- **Following System**
  - Users can follow or unfollow other users.
  - The "Following" tab shows only chits from followed users.
  - Real-time updates to follower/following counts.

- **Frontend**
  - Built with **React** and **Tailwind CSS** for a clean, responsive UI.
  - Routes and navigation handled using `react-router-dom`.

- **Backend**
  - REST API built using **Node.js** and **Express.js**.
  - MongoDB is used as the database, interfaced via **Mongoose**.
  - Middleware for JWT verification and file handling (via `multer`).

- **Deployment**
  - Frontend and backend deployed separately on [Render](https://render.com).
  - Environment variables configured securely to handle API URLs and secret keys.
  - CORS policy explicitly configured to allow frontend-backend communication across domains.

## Tech Stack

**Frontend**: React, Tailwind CSS, React Router  
**Backend**: Node.js, Express.js, MongoDB, Mongoose  
**Authentication**: JSON Web Tokens (JWT)  
**Image Hosting**: Cloudinary  
**File Upload**: Multer  
**Deployment**: Render  
**State Management**: Context API + useReducer

## Deployment Links

- **Frontend**: [https://chitter-app-frontend.onrender.com](https://chitter-app-frontend.onrender.com)
- **Backend API**: [https://chitter-app-backend.onrender.com](https://chitter-app-backend.onrender.com)
