# Detect AI

AI-powered visual defect inspection and quality intelligence platform built with TanStack Start, React 19, Vite, Tailwind CSS v4, and Firebase.

## 🚀 Technologies Used

- **Framework:** TanStack Start (SSR)
- **Frontend:** React 19, TypeScript
- **UI & Styling:** Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Framer Motion
- **Routing & State:** TanStack React Router & TanStack React Query
- **AI & Computer Vision:** Gemini API integration for visual defect detection and analysis
- **Database & Auth:** Firebase / Cloud Firestore
- **Reporting:** jsPDF & html2canvas automated PDF inspection export
- **Build Tool:** Vite 7

## 📦 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or bun

### Installation

1. Clone the repository:
   \ash
   git clone https://github.com/dhawalshende/detect-ai.git
   cd detect-ai
   \\n
2. Install dependencies:
   \ash
   npm install
   \\n
3. Set up environment variables:
   Create a .env file in the project root with your Firebase and Gemini credentials:
   \env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   \\n
4. Start the development server:
   \ash
   npm run dev
   \\n
5. Open your browser at http://localhost:3000.

## 🛠️ Production Build

To build the client and SSR application for production:

\ash
npm run build
\\n
To preview the production build locally:

\ash
npm run preview
\\n
## 📄 License

MIT License
