# ExperienceLive - Modern Event Ticketing System 

ExperienceLive is a full-stack web application that provides a seamless platform for event ticketing and management. Built with modern technologies, it offers a robust solution for event organizers and attendees alike.

![ExperienceLive Banner](https://via.placeholder.com/1200x400?text=ExperienceLive)

##  Features

- **User Authentication & Authorization**
  - Secure login and registration system
  - Role-based access control
  - JWT-based authentication

- **Event Management**
  - Create and manage events
  - Real-time ticket availability
  - Event analytics and reporting

- **Ticketing System**
  - Secure ticket purchasing
  - QR code generation for tickets
  - Email notifications

- **Admin Dashboard**
  - Event analytics
  - User management
  - Sales reports

## 🛠️ Tech Stack

### Frontend
- React.js
- TailwindCSS
- Framer Motion
- React Router
- Chart.js
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer
- Multer

##  Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ExperienceLive.git
cd ExperienceLive
```

2. Install dependencies
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Front-End
npm install
```

3. Environment Setup
Create a `.env` file in the Backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

4. Run the application
```bash
# Start backend server
cd Backend
npm run dev

# Start frontend development server
cd Front-End
npm start
```

##  Project Structure

```
ExperienceLive/
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── Routes/
│   ├── utils/
│   └── server.js
├── Front-End/
│   └── ticket/
└── README.md
```

##  Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- CORS protection
- Secure cookie handling
- Input validation and sanitization

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the ISC License - see the LICENSE file for details.

##  Authors
- Mazen Saed
- Mohamed AlGengeihy 
- Malak Meabed
- Zeina Abdelrahman
- Farah Sherif
##  Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community

##  Support

For support, email mazensaed04@gmaill.com or open an issue in the repository.

---
