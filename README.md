# Visitor Pass Management System

## Project Overview

This project is a Visitor Pass Management System built using the MERN stack.
It allows organizations to manage visitors, appointments, and generate digital passes with QR codes.

---

## Features

- User Authentication (Admin, Security, Host, Visitor)
- Appointment Booking & Approval
- Visitor Pass Generation
- QR Code for Pass Verification
- PDF Pass Download
- Dashboard for managing records
- File Upload (Visitor photo)
- Email Notification (optional)

---

## Tech Stack

**Backend:**

- Express.js
- Node.js
- MongoDB (Mongoose)
- JWT Authentication
- QRCode + PDFKit

**Frontend:**

- React.js
- Axios
- React Router

---

## Folder Structure

```
Backend/
  controllers/
  models/
  middleware/
  services/
  routes/
  seed/

frontend/
  src/
    components/
    pages/
```

---

## Backend Setup

```bash
cd Backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (.env)

```
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
UPLOAD_DIR=uploads
```

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Seed Data (Important)

To insert demo data:

```bash
node seed/seed.js
```

### Demo Login Credentials

- Admin → [admin@test.com](mailto:admin@test.com) / admin123
- Security → [security@test.com](mailto:security@test.com) / security123
- Host → [host@test.com](mailto:host@test.com) / host123
- Visitor → [rahul@test.com](mailto:rahul@test.com) / visitor123

---

## API Endpoints

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`

### Visitor

- POST `/api/visitor/register`

### Appointment

- POST `/api/appointments`
- GET `/api/appointments`
- PUT `/api/appointments/:id/approve`
- PUT `/api/appointments/:id/reject`

### Pass

- POST `/api/pass`
- GET `/api/pass`
- GET `/api/pass/:code`

---

## How to Test

1. Run backend and frontend
2. Seed the database
3. Login as admin/security
4. Create a visitor
5. Book appointment
6. Approve appointment
7. Generate pass
8. Download PDF / Scan QR

---

## Notes

- JWT is used for authentication
- Role-based access control implemented
- QR code contains pass details
- PDF generated using PDFKit

---

## Future Improvements

- Email notifications
- Mobile responsiveness
- Real-time pass validation
- Analytics dashboard

---

## Author

Rahul Choudhary
