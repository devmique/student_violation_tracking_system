

# 📚 Student Violation Tracking System

A full-stack web application for managing and monitoring student violations.  
The system allows administrators to record and view student violations while providing a detailed profile for each student.  

---

## 🚀 Features

- **Student Management**  
  - View detailed student profiles with picture, course, program, year level, and email.  
  - Automatically calculates total violations.  

- **Violation Tracking**  
  - Add and view student violations.  
  - Displays violation history with severity levels (Major / Minor).  
  - Shows latest violation with a special highlight.  

- **Search & Filtering**  
  - Quickly search for students and view their violation records.  

- **Role-Based Access (Optional)**  
  - Admins can add violations.   

- **Responsive UI**  
  - Built with React + TypeScript  
  - Uses shadcn/ui components and lucide-react icons  
  - Works across desktop and mobile  

---

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/devmique/student_violation_tracking_system

# Step 2: Navigate to the project directory.
cd student_violation_tracking_system

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

# In /server/.env, set:
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=5000
VITE_API_BASE_URL=http://localhost:5000/api
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Node.js + Express  
- MongoDB (Mongoose ORM)  

**Other Tools**  
- JWT Authentication  
- Vite (for frontend build)  
- ESLint + Prettier (code formatting)  

# student_violation_tracking_system
