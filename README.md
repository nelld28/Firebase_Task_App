# GetChiDa - Gamify Your Chores

**GetChiDa** (from "Get Chi Done") is a web application inspired by the world of *Avatar: The Last Airbender*. It turns household chores into a fun, gamified experience where housemates can earn "Chi" (experience points), track their progress, and receive encouragement from an AI-powered motivational bot.

## ✨ Features

*   **Housemate Profiles:** Create unique profiles for each housemate, complete with a name, avatar, and a special elemental affinity (Air, Water, Earth, or Fire).
*   **Gamified Chore System:**
    *   Create chores with descriptions, due dates, and an elemental category.
    *   Assign chores to different housemates.
    *   Mark chores as complete to earn Chi points for the assignee.
    *   Filter chores by their elemental category.
*   **Chi Meter:** A visual dashboard component that tracks a user's Chi, showing their progress towards weekly goals.
*   **Motivational Bending Bot:** An AI-powered coach that provides personalized motivational messages based on a user's elemental affinity and their self-reported progress on a task.
*   **Responsive Design:** A clean, modern interface that works seamlessly across desktop and mobile devices.
*   **Real-time Updates:** Data is synchronized in real-time with Firebase Firestore, so changes are reflected instantly across the app.

## 🚀 Tech Stack

This application is built with a modern, robust, and scalable tech stack.

### Frontend

*   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://react.dev/)
*   **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
*   **Icons:** [Lucide React](https://lucide.dev/)

### Backend & Services

*   **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore) (NoSQL, real-time)
*   **Backend Logic:** [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
*   **AI/Generative:** [Genkit](https://firebase.google.com/docs/genkit) (powered by Google's Gemini models)
*   **Hosting:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 📦 Project Structure

The codebase is organized to be clean and maintainable, following Next.js App Router conventions.

```
src
├── ai/                    # Genkit flows and AI logic
├── app/
│   ├── (main)/            # Main application routes (Dashboard, Chores, Profiles)
│   ├── actions/           # Next.js Server Actions for data mutations
│   ├── globals.css        # Global and Tailwind CSS theme styles
│   └── layout.tsx         # Root application layout
├── components/
│   ├── chores/            # Components specific to the Chores feature
│   ├── dashboard/         # Components for the main Dashboard
│   ├── layout/            # Layout components (Header, Sidebar)
│   ├── profiles/          # Components for the Profiles feature
│   └── ui/                # Reusable ShadCN UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Shared libraries, types, and utility functions
│   ├── firebase.ts        # Firebase initialization and helper functions
│   ├── types.ts           # Core TypeScript type definitions
│   └── utils.ts           # Utility functions like cn() for classnames
└── ...
```

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or another package manager
*   A Firebase project with Firestore enabled.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/getchida.git
    cd getchida
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Firebase project configuration. You can get these from your Firebase project settings.
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

    # For Genkit (AI features)
    GEMINI_API_KEY=your_google_ai_studio_api_key
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application should now be running on [http://localhost:9002](http://localhost:9002).
