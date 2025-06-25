<div align="center">
  <br />
  <h1 align="center">📰 Newsy</h1>
  <p align="center">
    An intelligent newsletter hub that scans your Gmail to automatically organize, read, and manage your subscriptions in one place.
  </p>
  <div align="center">
  <a href="https://news-y.vercel.app" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Live_Demo-Visit_Site-blue?style=for-the-badge&logo=rocket" alt="Live Demo"/>
  </a>
</div>
  <br />
</div>

<div align="center">
  <!-- Status Badge -->
  <img alt="Status" src="https://img.shields.io/badge/Status-Actively%20Developed-brightgreen"/>
  <!-- Tech Badges -->
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img alt="Drizzle ORM" src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black"/>
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img alt="Tauri" src="https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=tauri&logoColor=black"/>
</div>

---

### **📌 Table of Contents**
* [✨ Core Features](#-core-features)
* [🧰 Technology Stack](#-technology-stack)
* [📸 Screenshots](#-screenshots)
* [📨 Get In Touch](#-get-in-touch)

---

### **✨ Core Features**

| Feature                       | Description                                                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 🤖 **Automated Discovery**      | Connects to a user's Gmail account and intelligently scans their inbox to automatically identify and import all newsletter subscriptions.    |
| 📬 **Unified & Focused Inbox**  | Aggregates all newsletters into a single, beautiful, and clutter-free reading interface, completely separate from the main email inbox.      |
| 🚫 **One-Click Unsubscribe**    | Provides powerful tools to manage subscriptions, including the ability to unsubscribe from unwanted newsletters directly within the app.     |
| 🖥️ **Cross-Platform Desktop App** | Built with **Tauri**, allowing the entire web application to be packaged and run as a lightweight, native desktop experience on any OS.  |
| 🚀 **Guided Onboarding**        | A multi-step, user-friendly onboarding process that guides the user through connecting their account and completing the initial scan.      |
| 🗄️ **Secure & Modern Backend**  | User data and subscriptions are securely managed via a modern serverless stack, using **Drizzle ORM** with a **Neon (PostgreSQL)** database. |
| 🎨 **Polished User Interface**  | A fully responsive and accessible UI built with **Next.js 15 (App Router)** and styled with the highly-regarded **Shadcn/ui** component library. |
| 🏷️ **Tag Management System**   | Organize your subscriptions with custom tags, allowing for personalized filtering and categorization of your newsletter feed.              |

---

### **🧰 Technology Stack**

This project uses a cutting-edge, full-stack, and cross-platform technology stack.

| Category                | Technologies & Services                                                                                                                                                                                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework & UI**      | <img src="https://skillicons.dev/icons?i=nextjs" alt="Next.js" width="24" style="vertical-align: middle; margin-right: 5px;"> **Next.js 15** & <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" width="24" style="vertical-align: middle; margin-right: 5px;"> **TypeScript** for a robust, type-safe application. |
| **Database & ORM**      | <img src="https://skillicons.dev/icons?i=drizzle" alt="Drizzle ORM" width="24" style="vertical-align: middle; margin-right: 5px;"> **Drizzle ORM** for type-safe database access, connected to a <img src="https://skillicons.dev/icons?i=postgres" alt="PostgreSQL" width="24" style="vertical-align: middle; margin-right: 5px;"> **Neon (PostgreSQL)** database. |
| **Styling & Components**| <img src="https://skillicons.dev/icons?i=tailwind" alt="Tailwind CSS" width="24" style="vertical-align: middle; margin-right: 5px;"> **Tailwind CSS** and <img src="https://avatars.githubusercontent.com/u/139895814?s=200&v=4" alt="Shadcn/ui" width="24" style="vertical-align: middle; margin-right: 5px;"> **Shadcn/ui** for a modern and accessible component library. |
| **State Management**    | <img src="https://raw.githubusercontent.com/TanStack/query/beta/media/repo-header.png" alt="TanStack Query" width="24" style="vertical-align: middle; margin-right: 5px;"> **TanStack Query** for efficient server-state caching, refetching, and synchronization. |
| **Cross-Platform**      | <img src="https://skillicons.dev/icons?i=tauri" alt="Tauri" width="24" style="vertical-align: middle; margin-right: 5px;"> **Tauri** for packaging the Next.js application into a lightweight, native desktop app for Windows, macOS, and Linux. |
| **Authentication & APIs** | <img src="https://skillicons.dev/icons?i=google" alt="Google API" width="24" style="vertical-align: middle; margin-right: 5px;"> **Google API (Gmail)** for scanning emails, with user authentication managed by **Better Auth**. |
| **Tooling & Quality**   | <img src="https://skillicons.dev/icons?i=vite" alt="Vite" width="24" style="vertical-align: middle; margin-right: 5px;"> **Turbopack (via Next.js)** for a blazing-fast development experience, with <img src="https://skillicons.dev/icons?i=eslint" alt="ESLint" width="24" style="vertical-align: middle; margin-right: 5px;"> **ESLint** & <img src="https://skillicons.dev/icons?i=prettier" alt="Prettier" width="24" style="vertical-align: middle; margin-right: 5px;"> **Prettier**. |

---

### **🌟 Future Features**

While the core functionality is robust, there is a clear vision for expanding Newsy into an even more powerful and universally accessible platform.

| Feature Area                      | Planned Enhancements                                                                                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Broader Email Support**         | Expand beyond Gmail by integrating with **Outlook/Microsoft 365** and eventually adding generic **IMAP** support, making Newsy accessible to users on any email platform.                  |
| **AI & Content Intelligence**     | Introduce **AI-powered summaries** for long-form newsletters, implement automated content-based tagging for better organization, and enable powerful **full-text search** across all emails. |
| **Enhanced Reading Experience**   | Develop a "Read-It-Later" feature for saving important articles, allow for in-article highlighting and note-taking, and integrate **text-to-speech** for hands-free listening.           |
| **Platform & Ecosystem Expansion**| Create a **browser extension** for one-click subscribing on the web and develop a dedicated **mobile application** (e.g., with React Native) for a seamless on-the-go reading experience.    |

---

### **📸 Screenshots**

*(Note: Replace these placeholder links with actual paths to your screenshots in the repository.)*

<p align="center">
  <img src="./path/to/inbox_view.png" alt="Unified Inbox View" width="85%">
  <br>
  <em>The main inbox, aggregating all newsletters into a clean, unified interface.</em>
</p>
<br>
<p align="center">
  <img src="./path/to/onboarding_view.png" alt="Onboarding Scan" width="85%">
  <br>
  <em>The guided onboarding process, showing the automatic scan of a user's Gmail account.</em>
</p>

---

### **📨 Get In Touch**

Let's connect! I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.

**Walid Zakan**

-   **📧 Email**: [walid.zakan@gmail.com](mailto:walid.zakan@gmail.com)
-   **💼 LinkedIn**: [linkedin.com/in/walid-zakan](https://www.linkedin.com/in/walid-zakan)
