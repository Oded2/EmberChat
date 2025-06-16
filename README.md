# EmberChat

[![Netlify Status](https://api.netlify.com/api/v1/badges/338f0093-11d1-4675-8703-e7098d9c5dfc/deploy-status)](https://app.netlify.com/projects/emberchat/deploys)

EmberChat is a minimal, zero-complexity chat application built with [SvelteKit](https://kit.svelte.dev/), [Firebase](https://firebase.google.com/), [Tailwind CSS](https://tailwindcss.com/), and [DaisyUI](https://daisyui.com/). It features authentication, real-time global chat, and user profile management.

## Features

- 🔥 Real-time global chat using Firebase Firestore
- 🔐 User authentication (sign up, login, email verification)
- 👤 User profile management (display name, email)
- 🎨 Responsive UI with Tailwind CSS and DaisyUI
- ⚡ Fast, modern SvelteKit app structure

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Firebase Project](https://console.firebase.google.com/) with Authentication and Firestore enabled

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Oded2/emberchat.git
   cd emberchat
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up Firebase:**

   - Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and Authentication (Email/Password) in the Firebase Console.
   - Create a `.env` file in the root of the project and add your Firebase config:

     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the development server:**

   ```sh
   npm run dev
   ```

   Open your browser and go to `http://localhost:5173` (or the URL shown in the terminal).

## Usage

- **Sign up / Log in:** Use the authentication form to sign up or log in.
- **Global chat:** Access the global chat from the navigation menu.
- **User profile:** Manage your profile and view other users' profiles.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made by [Oded](https://github.com/Oded2)
