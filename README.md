# 🛡️ EPLQ: Efficient Privacy-Preserving Location-Based Query on Encrypted Data

A secure and privacy-focused **location-based query system** designed to enable users to **search nearby Points of Interest (POIs)** without revealing their actual location. This solution addresses the privacy risks associated with Location-Based Services (LBS) by implementing **encrypted spatial range queries** and an optimized privacy-preserving index structure.


## 🧠 Problem Statement

LBS systems like Google Maps or food delivery apps use your current location to offer suggestions. However, such location tracking raises **serious privacy concerns**.

This project introduces **EPLQ**, a privacy-preserving solution using:
- Encrypted spatial range queries
- Secure tree-index structures
- Modular backend logic with JWT-based authentication
- Data encryption using AES (CryptoJS)

EPLQ ensures:
- Your location stays **private**
- POI queries are **efficient** and fast (~0.9s query time on mobile)
- **No raw data exposure**, even to the server

---

## 🛠️ Tech Stack

### 🔹 Frontend
- 📦 **React (Vite)**
- 💨 **TailwindCSS**
- 🎨 **DaisyUI**
- 🔗 **Axios**
- 🗺️ **Geolocation API**
- 📍 **Google Maps Integration**

### 🔸 Backend
- 🟢 **Node.js**
- 🚀 **Express.js**
- 🧩 **MongoDB (Mongoose)**
- 🔐 **JWT Authentication**
- 🧪 **CryptoJS (AES Encryption)**
- 🔐 **Bcrypt for hashing**
- 🌱 **dotenv**
- 🔎 **Haversine Algorithm** (for distance calculation)

### 🔸 Firebase
- Used for optional cloud-based deployment or auth (if integrated)

---

## 👥 System Modules

- **Admin**
  - Upload new POIs (encrypted)
  - Manage categories and data integrity
- **User**
  - Register & log in
  - Search for nearby encrypted POIs
  - View decrypted results client-side securely

---

## ✨ Key Features

- 🔐 **Privacy-Preserving Queries**
- 📌 **Encrypted POI Storage (AES)**
- 🌍 **Nearby POIs Search using Geolocation + Radius**
- 📚 **Recent Search History**
- 🧭 **Google Maps Integration**
- 💡 **Intelligent UI with Toast Notifications**
- ✅ **Secure Upload (Admin Only)**
- ⚙️ **Modular, Maintainable Codebase**
- ⚡ **Optimized for Fast Responses**

---

## 🧩 Folder Structure

eplq-location-app/
│
├── backend/
│ ├── routes/
│ │ └── poiRoutes.js
│ ├── middleware/
│ ├── models/
│ ├── utils/
│ └── server.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ └── App.jsx
│ └── main.jsx
│
├── .env
├── README.md
└── package.json

✅ Development Principles
🔐 Safe: Data is encrypted; no plaintext exposure

🧪 Testable: Code organized in testable units

🔧 Maintainable: Clean, modular structure

💻 Portable: Runs in any OS with Node.js & MongoDB

🙌 Acknowledgments
Thanks to:

Open-source community (React, Express, MongoDB, Tailwind)

Research papers on encrypted location queries

Inspiration from real-world LBS privacy concerns
