# 🎟️ Ticketa

> A **full-stack event management & ticketing platform** with secure authentication, **QR code validation**, and **role-based access control**.

---

## 🚀 Features

### 👨‍💼 Organiser

* Create, update, delete, and manage events (CRUD).
* Track all events created.

### 🙋 Attendee

* Browse and explore events.
* Purchase tickets for events.
* Generate unique QR codes for each ticket.

### 👷 Staff

* Access event details.
* Verify tickets using **QR scanner** or manual validation.

---

## 🛠️ Tech Stack

### 🔹 Backend

* **Spring Boot** – REST APIs
* **PostgreSQL** – Database
* **Keycloak (JWT Auth)** – Authentication & Authorization
* **MapStruct** – DTO mapping
* **ZXing** – QR Code generation & validation

### 🔹 Frontend

* **React.js** – SPA frontend
* **Axios** – API integration
* **React Router** – Routing
* **Tailwind CSS 4.1** – Styling (dark futuristic UI ✨)

---

## 📂 Project Structure

```
ticketa/
│── backend/         # Spring Boot backend (REST APIs + Keycloak Security)
│   ├── src/main/java/com/ticketa/...
│   ├── src/main/resources/
│   └── pom.xml
│
│── frontend/        # React.js frontend (dark futuristic UI)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/ticketa.git
cd ticketa
```

### 2️⃣ Backend Setup

```bash
cd backend
# Configure PostgreSQL & Keycloak in application.yml
./mvnw spring-boot:run
```

* Runs on: `http://localhost:8080`
* Keycloak Realm: **Ticketa**
* Roles: `ORGANISER`, `ATTENDEE`, `STAFF`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

* Runs on: `http://localhost:5173`

---

## 🔑 Authentication (via Keycloak)

* **Client ID**: `ticketa-app`
* **Grant Type**: `password`
* Example Users:

  * `organiser / password`
  * `attendee / password`
  * `staff / password`

---

## 🧑‍💻 Author

Created by **Lakshay Jain** ✨
(📺 Inspired by devtiro )

---

## 📜 License

This project is licensed under the **MIT License**.
