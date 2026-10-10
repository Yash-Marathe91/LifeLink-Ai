# LifeLink AI - NDRF Tactical Dashboard & Mobile Client

LifeLink AI is a unified emergency management system comprising two core components:
1. **LIFELINK_AI**: A Flutter application acting as both the Citizen App (Mobile) and the NDRF Tactical Dashboard (Web/Tablet).
2. **backend**: A FastAPI server powered by AI agents to perform triage, severity analysis, and resource allocation.

The project has been streamlined into exactly two directories to ensure a clean architecture.

## 📂 Project Structure

```text
LifeLink_AI/
├── backend/              # Python FastAPI Server (Deploy on Render)
│   ├── app/              # Core logic, AI agents, and models
│   ├── requirements.txt  # Python dependencies
│   └── .env.example      # Backend environment variables
├── LIFELINK_AI/          # Flutter Frontend (Deploy on Vercel/Netlify/Firebase)
│   ├── lib/              # Flutter UI and logic (Citizen screens + Dashboard)
│   ├── pubspec.yaml      # Flutter dependencies
│   └── .env.example      # Frontend environment variables
├── render.yaml           # Deployment config for Render (Backend)
└── SUPABASE_SETUP.sql    # Relational Database & Storage setup for Supabase
```

## 🚀 How to View and Run the Prototype

To run the full prototype locally on a single machine:

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and paste the contents of `SUPABASE_SETUP.sql` and run it. This will create all the necessary tables (Relational Incident mapping, SOS signals, Disaster Reports) and the Storage Buckets for Media (photos and voice notes).
3. Retrieve your `Project URL` and `anon key` from Project Settings -> API.

### 2. Environment Configurations (`.env`)
You need to maintain two separate environments for the two components.

**Backend Env (`backend/.env`):**
Copy `backend/.env.example` to `backend/.env` and fill in the values:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_pooled_connection_string
OPENAI_API_KEY=your_key
```

**Frontend Env (`LIFELINK_AI/.env`):**
Copy `LIFELINK_AI/.env.example` to `LIFELINK_AI/.env` and fill in the values:
```env
BACKEND_BASE_URL=http://localhost:8000  # For local testing
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run the Backend Server
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
The backend will be running at `http://localhost:8000`.

### 4. Run the Flutter App & Dashboard
The Flutter app contains both the citizen interface and the NDRF Tactical Command Dashboard.
```bash
cd LIFELINK_AI
flutter pub get
# To run as a mobile app (Citizen View)
flutter run -d android 
# To run as a Web Dashboard (NDRF Tactical View)
flutter run -d chrome 
```
*Note: In the citizen app's main menu, scroll down to find the "NDRF Dashboard" button to access the analytical view.*

## 🌍 Deployment Strategy

The user requested to deploy the backend on Render and the frontend "on Supabase". Note that Supabase handles Database/Auth/Storage but does not provide direct static web hosting. You should deploy the Flutter Web build to a static host (like Vercel, Firebase Hosting, or Render).

### Deploying Backend to Render
A `render.yaml` file is provided in the root directory.
1. Push this repository to GitHub.
2. Go to [Render](https://render.com) -> New -> Blueprint.
3. Connect your repository. Render will automatically read `render.yaml` and deploy the FastAPI backend.
4. Add the required environment variables in the Render dashboard.

### Deploying Frontend Dashboard (Flutter Web)
1. Build the Flutter web app:
   ```bash
   cd LIFELINK_AI
   flutter build web --release
   ```
2. The output will be inside `LIFELINK_AI/build/web/`.
3. You can deploy this folder directly to any static hosting provider. For example, using Vercel:
   ```bash
   npm i -g vercel
   cd build/web
   vercel deploy --prod
   ```

## 📊 Analytical Dashboard Features
- **Geohash Tactical Radar:** View live BLE mesh relay paths, SOS clusters, and deployed rescue teams on a unified radar view.
- **AI Triage Integration:** Real-time visibility into the multi-agent AI consensus (Severity, Medical, Vulnerability).
- **Relational Data Linkage:** Connect raw SOS signals and Citizen Photo Reports to generated AI Incidents.
- **Live Team Dispatch:** Assign rescue units directly to incidents and monitor their capacity.
