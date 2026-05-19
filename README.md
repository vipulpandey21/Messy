````md
# Messo - Mess Management System

## Overview

Messo is a full-stack mess management platform designed to streamline and digitize institutional mess hall operations. The system enables efficient management of menus, complaints, announcements, subscriptions, and administrative workflows through a modern web interface and scalable backend architecture.

Built using the MERN stack, Messo focuses on improving operational efficiency, user communication, and centralized management for hostels and institutional cafeterias.

---

## Features

### Authentication & Authorization
- Secure user authentication using JSON Web Tokens (JWT)
- Role-Based Access Control (RBAC) for admins and users
- Protected API routes and session handling

### Menu Management
- Daily and weekly mess menu updates
- Admin-controlled menu publishing system
- Dynamic menu rendering for users

### Complaint Management
- Complaint submission and tracking system
- Structured complaint resolution workflow
- Complaint categorization and status handling

### Announcement System
- Broadcast important notices and updates
- Real-time visibility for all users
- Centralized communication platform

### User & Subscription Management
- User registration and profile management
- Subscription and mess plan handling
- User-specific dashboard functionality

### Deployment & Scalability
- Dockerized application setup
- Nginx-based reverse proxy configuration
- Scalable backend deployment architecture

---

## Technologies Used

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Tokens)
- bcrypt.js

### DevOps & Deployment
- Docker
- Nginx

---

## Getting Started

### Prerequisites

Make sure the following are installed on your system:

- Node.js
- npm
- MongoDB
- Docker (optional)

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/vipulpandey21/Messo.git
cd Messo
````

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend/mess-management
npm install
```

---

## Environment Variables

Create a `.env` file inside the backend directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend/mess-management
npm start
```

The application will run on:

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:5000`

---

## Docker Setup

Run the application using Docker:

```bash
docker-compose up --build
```

---

## Project Structure

```bash
Messo/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   └── mess-management/
│       ├── src/
│       ├── public/
│       └── components/
│
└── README.md
```

---

## API Endpoints

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

### Menu

* `GET /api/menu`
* `POST /api/menu`

### Complaints

* `POST /api/complaints`
* `GET /api/complaints`

### Announcements

* `GET /api/announcements`
* `POST /api/announcements`

---

## Future Improvements

* Real-time notifications
* Payment gateway integration
* Attendance tracking system
* Analytics dashboard
* Mobile responsive optimization

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Contact

**Vipul Pandey**

* GitHub: [https://github.com/vipulpandey21](https://github.com/vipulpandey21)
* LinkedIn: [https://linkedin.com/in/21vip](https://linkedin.com/in/21vip)

```
```
