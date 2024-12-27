# **Resource Management Project**

## **Introduction**

This project is a **Resource Management System** built using:

* **Backend** : NestJS with MySQL database and Prisma ORM.
* **Frontend** : Vite React with Tailwind CSS.

### **Project Features**

##### **Backend (NestJS)**

The backend is connected to a MySQL database through Prisma ORM. After creating the required schema, we implemented the following APIs to manage resources effectively:

1. **Authentication** :

* Login
* Register

1. **User Management** :

* Add User as Employee (Manager only).
* Show My Employees (Manager only).

1. **Project Management** :

* Add Project
* Edit Project
  * Add Consumed Hours
  * Change Project Status to "Closed"
* Delete Project
* Show Project

1. **User Logs** :

* Log Hours for a Specific Project (Prevention and Email Notification included).

1. **Employee Availability** :

* Add Availability
* Get My Employees' Availability

##### **Frontend (Vite React)**

The frontend uses Vite React with Tailwind CSS for building a clean and responsive user interface.

* Includes basic UI with functionality to interact with the backend APIs.
* Tailwind CSS simplifies styling with pre-configured utility classes.

---

## **Setting Up the Project**

### **Backend Setup (NestJS)**

1. **Clone the Repository** :

```bash
   git clone <repo-url>
   cd backend
```

1. **Install Dependencies** :

```bash
   npm install
```

1. **Set Up Environment Variables** :

   Create a `.env` file in the root directory with the following:

```env
   DATABASE_URL=mysql://username:password@localhost:3306/database_name
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_generated_app_password
   JWT_SECRET=your_jwt_secret
```

    **Note** :

* Replace `username`, `password`, and `database_name` with your MySQL credentials.
* For `EMAIL_PASSWORD`, generate a Google App Password as described below.

1. **Generate Google App Password** :

* Go to [Google Account - App Passwords](https://myaccount.google.com/apppasswords).
* Select **Mail** as the app and your device or **Other** for a custom name.
* Generate and copy the 16-character password.
* Use it in the `EMAIL_PASSWORD` field in `.env`.

1. **Run Migrations** :

```bash
   npx prisma migrate dev
```

1. **Start the Server** :

```bash
   npm run start:dev
```

---

### **Frontend Setup (Vite React)**

1. **Clone the Repository** :

```bash
   git clone <repo-url>
   cd frontend
```

1. **Install Dependencies** :

```bash
   npm install
```

1. **Set Up Environment Variables** :

   Create a `.env` file in the root directory with the following:

```env
   VITE_BACKEND_URL=http://localhost:3000/
```

   Replace `http://localhost:3000/` with your backend's base URL if different.

1. **Start the Frontend** :

```bash
   npm run dev
```

---

## **Technical Insights**

### **Backend Development**

NestJS simplifies the process of creating scalable and maintainable applications. Using the command `nest g [module|service|controller] [name]`, we efficiently structured the project:

* **Module** : Implements providers such as Prisma and service modules.
* **Service** : Contains business logic and reusable functions.
* **Controller** : Handles HTTP methods (GET, POST, DELETE, etc.).

### **Frontend Development**

Vite React and Tailwind CSS provide a fast development environment and streamlined styling process. We utilized Tailwind's utility classes for quick UI creation, focusing on functionality due to limited time.

---

## **Conclusion**

This Resource Management System leverages modern frameworks like NestJS, Prisma, React, and Tailwind to deliver efficient resource handling. It integrates seamlessly with MySQL, ensuring robust data storage and retrieval.

For additional information or troubleshooting, please refer to the documentation or contact the development team.

---
