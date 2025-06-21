# 🛡️ ResQ

**ResQ** is a full-stack platform to **report**, **visualize**, **analyze**, and **respond** to crimes or suspicious activity. It fosters community engagement with a modern map-based UI and includes a chatbot assistant **Kavach** for interactive queries.

---

## 🚀 Features

### 🌐 Frontend (Next.js + Tailwind CSS + Leaflet)
- **📍 Interactive Map View**: View crime pins dynamically plotted on a map.
- **📝 Crime Reporting Form**: 
  - Location
  - Description
  - Category selection
  - Photo upload
  - Contact info
- **📅 Smart Filters**:
  - Date range selection
  - Filter by crime category
- **📊 Trends Dashboard**:
  - Visual analytics of crimes (by time, category, zone)
  - Powered by Chart.js and Recharts
- **🧠 Kavach Chatbot**:
  - Ask crime-related questions via a chatbot interface
  - Provides insights based on reported data

---

### 🧩 Backend (NestJS + Prisma + PostgreSQL)
- **🧾 Report Management**:
  - Create, retrieve, update, delete reports
  - Verify or flag reports (admin functionality)
- **🔍 Advanced Search & Filters**:
  - Search by category, location, or date range
- **🛠 Admin Dashboard**:
  - Secure login via JWT authentication
  - Verify/delete/flag reports
  - Moderate user submissions
- **🔐 Auth**:
  - JWT-based authentication for admins

---

## 📊 Data & Visualization Tools
- **Clustering**: Leaflet cluster layer for high-density areas
- **Filtering**: Based on category, location, and time
- **Trends & Charts**: Weekly, zone-wise, and category-wise crime analytics
- **Prisma ORM**:
  - Includes `status` field for moderation (`pending`, `verified`, `false`)

---

## 📁 Tech Stack

| Layer      | Tech Used                         |
|------------|-----------------------------------|
| Frontend   | Next.js, Tailwind CSS, Leaflet    |
| Backend    | NestJS, TypeScript, Prisma, PostgreSQL        |
| Analytics  | Chart.js, Recharts               |
| Auth       | JWT                               |
| AI Assistant | Google Gemini API   |

---

## ⚙️ Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone https://github.com/AnishkaR10/ResQ.git
   cd ResQ
   ```

2. **Install dependencies**  
   - For frontend:  
     ```bash
     cd frontend
     npm install
     ```
   - For backend:  
     ```bash
     cd backend
     npm install
     ```

3. **Set up PostgreSQL and .env**  
   - Create a `.env` file in the backend with your DB credentials  
   - Run Prisma migrations:  
     ```bash
     npx prisma migrate dev
     ```

4. **Start the development servers**  
   - Frontend: `npm run dev`  
   - Backend: `npm run start:dev`

---



> Made with ❤️ by [Anishka Raghuwanshi](https://github.com/AnishkaR10), [S Paresh Kumar](https://github.com/SPareshKumar)
