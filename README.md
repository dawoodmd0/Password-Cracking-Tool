# Password Cracking Tool

## Objective
The **Password Cracking Tool** is an educational, local-only cybersecurity demonstration project. It is designed to illustrate how weak password storage (specifically, unsalted SHA-256 hashes) is vulnerable to various password-recovery techniques, and to explain why modern password storage should use unique salts and dedicated hashing algorithms.

## Features
- Test account creation and login
- Unsalted SHA-256 hashing demonstration
- **Dictionary Attack**: Attempts to crack a hash using a predefined wordlist.
- **Hybrid Attack**: Combines dictionary words with predictable modifications (e.g., adding numbers or symbols).
- **Rainbow Table Attack**: Uses a small precomputed hash-to-plaintext mapping for instant lookups.
- Attack statistics and result history tracking
- Basic charts visualizing attempts and time taken (using Recharts)
- Educational modules comparing Unsalted vs. Salted hashing and modern password-storage recommendations.

## Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts, React Router, Axios
- **Backend**: Python, FastAPI, Uvicorn, SQLite (via SQLAlchemy), `hashlib`

## Installation & Setup Guide

### Prerequisites
Before starting, ensure you have the following installed on your machine:
- **Git**
- **Node.js** (v18 or higher) & **npm**
- **Python** (v3.10 or higher) & **pip**

---

### Step 1: Clone the Repository

Open your terminal or command prompt and run:
```bash
git clone https://github.com/dawoodmd0/Passoword-Cracking-Tool.git
cd "Password-Cracking-Tool"
```

---

### Step 2: Backend Setup & Execution

You will need **two terminal windows** open (one for the Backend and one for the Frontend).

#### 🪟 Windows (Command Prompt or PowerShell)

1. Open a terminal and navigate to the backend directory:
   ```cmd
   cd backend
   ```
2. Create a Python virtual environment:
   ```cmd
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Command Prompt (`cmd`)**:
     ```cmd
     venv\Scripts\activate
     ```
   - **PowerShell**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   *(Note: If PowerShell displays an Execution Policy restriction error, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first).*

4. Install backend dependencies:
   ```cmd
   pip install -r requirements.txt
   ```
5. Start the backend server:
   ```cmd
   python -m uvicorn main:app --reload
   ```
   > Backend server running at: **`http://localhost:8000`** (API Docs at `http://localhost:8000/docs`).

---

#### 🐧 Linux
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a Python virtual environment:
   ```bash
   python3 -m venv venv
   ```
   *(If `venv` is missing, install it via: `sudo apt install python3-venv` on Debian/Ubuntu).*

3. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```
4. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   > Backend server running at: **`http://localhost:8000`**

---

#### 🍏 macOS

1. Open Terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a Python virtual environment:
   ```bash
   python3 -m venv venv
   ```
3. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```
4. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   > Backend server running at: **`http://localhost:8000`**

---

### Step 3: Frontend Setup & Execution

Open a **second terminal window** to run the frontend application.

#### 🪟 Windows, 🐧 Linux & 🍏 macOS
```bash
cd "Password-Cracking-Tool"
```
1. Navigate to the `frontend` directory from the repository root:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## Usage Guide
1. Access the web application at `http://localhost:5173`.
2. Go to **Test Accounts** to register local lab accounts (e.g., username: `student1`, password: `password123`). The backend stores an unsalted SHA-256 hash in SQLite (`sql_app.db`).
3. Navigate to **Cracking Lab**, pick a test account, and choose an attack mode (**Dictionary**, **Hybrid**, or **Rainbow Table**).
4. Run the attack to view real-time statistics, execution time, and attempts count.
5. Review the **Results** page for comparative analytics and the **Security** tab for educational content on salted hashes, PBKDF2, bcrypt, and Argon2.

---

## Troubleshooting & Tips
- **Port Conflict (8000 or 5173)**: Ensure no other services are using port `8000` (FastAPI) or `5173` (Vite).
- **Environment Variables**: The backend reads configuration from `.env`. By default, `DATABASE_URL=sqlite:///./sql_app.db` is configured automatically.
- **Python Version**: Ensure Python version is 3.10+ (`python --version` or `python3 --version`).

---

## Security Disclaimer
> **⚠️ WARNING:** This application is intended **strictly for authorized educational demonstrations** using locally generated test data. It is explicitly built to demonstrate legacy security flaws. It contains no capabilities to target external servers, live authentication endpoints, or third-party web services. **Do not attempt to use security testing tools or techniques on systems without authorization.**
