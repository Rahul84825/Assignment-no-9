## Backend Setup

```bash
cd Backend
npm init -y
npm install express nodemon dotenv mongoose qrcode pdfkit joi cors uuid nanoid
npm install --save-dev nodemon
```

## Frontend Setup

```bash
cd frontend
npm install axios react-router-dom @emailjs/browser
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/visitor_pass_db
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
UPLOAD_DIR=uploads
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

## Running the Application

### Backend
```bash
cd Backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api