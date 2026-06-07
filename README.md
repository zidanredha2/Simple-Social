# 📸🚀 Simple Social: Photo & Video Sharing Platform

A modern, streamlined full-stack social media application designed for seamless photo and video sharing. This platform features a high-performance **FastAPI** backend utilizing **FastAPI Users (JWT)** for robust authentication, **ImageKit.io** for real-time asset optimization, and a responsive, immersive dark-themed **React + Bootstrap** single-page application (SPA) frontend.

---

## 🏛️ System Architecture & Workflow

The platform follows a clean separation of concerns using a decoupled client-server architecture:

* **Frontend (Port 5000):** Built with React, compiled via Vite, and styled with Bootstrap 5 Dark Mode. It communicates with the backend asynchronously using Axios.
* **Backend (Port 8000):** Built with FastAPI and powered by Uvicorn. It exposes a JSON REST API, enforces JWT token validation, and communicates securely with ImageKit.
* **Media Storage Layer:** Files never permanently sit on the local server. They are streamed directly to ImageKit cloud buckets, where dynamic cropping, optimization, and blur transformations are handled on-the-fly via URL parameters.

---

## 📁 Repository Structure

This codebase uses a unified monorepo layout to manage deployment configurations, frontend code, and backend services alongside each other:

```text
my-fullstack-app/
├── README.md
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # Authentication & Feed Routing Endpoints
│   │   ├── core/             # JWT Security Configurations
│   │   ├── models/           # Data & Asset Schemas
│   │   ├── services/         # ImageKit Cloud Interfaces
│   │   └── main.py           # Core FastAPI API Entrypoint
│   ├── requirements.txt      # Python Environment Dependencies
│   └── .env                  # Backend Secrets (Private)
│
└── frontend/                 # React SPA (Vite + Bootstrap)
    ├── package.json          # Node Modules & Tooling Scripts
    ├── vite.config.js        # Port 5000 & Asset Server Definitions
    └── src/
        ├── main.jsx          # Framework Render Mounting Point
        ├── App.jsx           # Global State Routing Coordinator
        ├── components/       # Pages (LoginPage, FeedPage, UploadPage)
        ├── utils/            # ImageKit URL String Transforms
        └── assets/           # Global Vendor CSS Overrides

```

---

## 🛠️ Tech Stack

### Backend

* **Core:** FastAPI (Python 3.10+)
* **Server Engine:** Uvicorn
* **Auth Layer:** FastAPI Users with JSON Web Tokens (JWT)
* **Cloud CDN Integrations:** ImageKit.io SDK / HTTP REST clients

### Frontend

* **Core Module:** React 18+ (Functional Components & Hooks)
* **Build Utility:** Vite
* **UI System:** Bootstrap 5 (`react-bootstrap`)
* **Design Paradigm:** Native Browser Component Dark Mode
* **Network Client:** Axios

---

## 🚀 Step-by-Step Installation & Setup

### 1. Prerequisites

Ensure you have the following software runtimes installed on your local machine:

* [Python 3.10+](https://www.python.org/)
* [Node.js 18+](https://nodejs.org/)

### 2. Backend Installation & Configurations

Navigate to the backend directory, spin up a clean Python virtual environment, and pull in required dependencies:

```bash
cd backend
python -m venv venv

# On Windows (cmd/PowerShell)
venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

```

Create a `.env` file in the root of your `backend/` directory to safely initialize application environment parameters:

```env
IMAGEKIT_PUBLIC_KEY="your_public_imagekit_key"
IMAGEKIT_PRIVATE_KEY="your_private_imagekit_key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_endpoint_id/"
JWT_SECRET="generate_a_secure_long_random_string_here"

```

Start your backend server via Uvicorn:

```bash
uvicorn app.main:app --reload

```

The documentation dashboard will now be live and accessible at `http://localhost:8000/docs`.

### 3. Frontend Installation & Configurations

Open a separate terminal shell, navigate into the frontend environment directory, and execute the clean-install sequence:

```bash
cd frontend
npm install

```

Verify that your `vite.config.js` is mapped explicitly to force-launch on network port `5000`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    strictPort: true,
  }
})

```

Launch the frontend environment local server instance:

```bash
npm run dev

```

Open your browser and navigate to `http://localhost:5000` to interact with your running application!

---

## 📡 API Reference Endpoint Overview

| HTTP Method | Endpoint | Authorization | Description |
| --- | --- | --- | --- |
| **POST** | `/auth/register` | Open Access | Registers a new user account with an Email and Password. |
| **POST** | `/auth/jwt/login` | Open Access | Validates credentials (Form-Data) and returns a Bearer Access Token. |
| **GET** | `/users/me` | Bearer Token | Fetches profile context specifications for the active session user. |
| **GET** | `/feed` | Bearer Token | Pulls down global chronological post metadata array. |
| **POST** | `/upload` | Bearer Token | Accepts multi-part form-data binary structures payload for cloud ingestion. |
| **DELETE** | `/posts/{id}` | Owner Restrict | Triggers cloud data purging loops for targeting specified items. |

---

## 🔐 Core Security & CORS Alignment

To keep communication secure, Cross-Origin Resource Sharing (CORS) rules must be configured inside your FastAPI orchestration layers. In `backend/app/main.py`, make sure **Port 5000** is white-listed to avoid browser network rejections:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5000", # Secure access token validation path
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

```

---

## 💡 Key Implementations

### Dynamic On-the-Fly Video Optimization

Videos uploaded through the platform are automatically adjusted to fit uniform dimensions without stretching or warping. This is done serverless-side via custom filters built inside the utility string helper mapping layer (`frontend/src/utils/imagekit.js`):

```javascript
// Automatically handles padding and applies blurred borders on mismatching aspect ratios
const videoUrl = createTransformedUrl(post.url, "w-400,h-200,cm-pad_resize,bg-blurred");

```

### Decoupled Captions Layout

Captions are decoupled from the image files to make text selection clean and keep layouts consistent across different media types:

* **Images:** Rendered via native `<img>` layout nodes wrapped seamlessly with standard dark semantic context styling hooks.
* **Videos:** Handled via custom HTML5 media structures overlay elements.
* **Typography:** Formatted using a standard `<div className="text-muted mt-2 small">` component block directly beneath the post media element.
