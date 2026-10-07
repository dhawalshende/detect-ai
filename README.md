# Detect AI

Detect AI is a modern web application built with [TanStack Start](https://tanstack.com/start) and React.

## 🚀 Technologies Used

- **Framework:** TanStack Start
- **UI & Styling:** Tailwind CSS v4, Radix UI Primitives, Framer Motion
- **State Management & Data Fetching:** TanStack React Query & React Router
- **Backend & Database:** Firebase (Firestore)
- **Build Tool:** Vite

## 🛠️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dhawalshende/detect-ai.git
   cd detect-ai
   ```

2. Install dependencies (the project uses Bun, but npm/yarn work too):
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your Firebase credentials.
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` (or the port Vite provides) to see the app in action!

## 📦 Building for Production

To build the application for production, run:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📄 License

This project is licensed under the MIT License.
