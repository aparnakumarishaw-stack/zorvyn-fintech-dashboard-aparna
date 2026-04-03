#Smart Finance Dashboard | Zorvyn Internship Assignment
A professional-grade, highly interactive finance management interface built for the Zorvyn Frontend Developer Intern screening. This project demonstrates modern React patterns, state management, and role-based access control.

=> Live Demo: [Insert Your Vercel/Lovable Link Here]

=> Candidate: Aparna Kumari Shaw

+>Reference ID: TE41A4Z3
# LIVE DEMO :https://zorvyn-fintech-dashboard-aparna.vercel.app/

# Key Features
1. Multi-Role Interface (RBAC)
Admin Mode: Full access to create, edit, and delete financial transactions via a validated modal form.

Viewer Mode: A read-only experience that preserves data integrity by disabling all mutation actions.

State Persistence: Role selection and transaction data persist across page refreshes using localStorage.

2. Intelligent Data Visualization
Dynamic Summary: Real-time calculation of Total Balance, Income, and Expenses based on the current transaction set.

Interactive Charts: Utilizes Recharts for a high-fidelity Area Chart (Balance Trends) and Donut Chart (Spending Breakdown).

Smart Forecast: A custom logic layer that projects month-end spending based on current daily averages—highlighting a data-driven approach to UI.

3. Advanced Data Management
Fuzzy Search & Filters: Instant search by description and category-based filtering with "Empty State" handling.

Data Portability: One-click Export to CSV functionality for external financial reporting.

Sorting: Column-based sorting for dates and amounts to help users find critical data quickly.

#Technical Stack
Framework: React 18 (Vite)

Language: TypeScript / JavaScript

Styling: Tailwind CSS (Mobile-first, Responsive)

State Management: Zustand (Chosen for its lightweight footprint and high performance compared to Redux).

Components: Shadcn UI & Lucide React (For accessible, industry-standard interface elements).

Animations: Framer Motion (Subtle micro-interactions for a premium feel).

#Architectural Decisions
Component Modularity: The project follows a strict separation of concerns. Charts, Tables, and Modals are isolated components to ensure scalability.

Custom Hooks: Business logic (like the Smart Forecast calculations) is decoupled from the UI to maintain clean code.

UX Design: Implemented a Dark Mode toggle and custom scrollbars to align with modern FinTech aesthetic standards.

# Local Setup
To run this project locally:

Clone the repository:

Bash
git clone https://github.com/aparnakumarishaw-stack/zorvyn-fintech-dashboard-aparna.git
Install dependencies:npm install

-Bash
npm install
Run the development server:npm run dev

-Bash
npm run dev
-Engineering Insights (AI/ML Perspective)
As a Computer Science student specializing in AI/ML at Graphic Era Hill University, I approached this dashboard as more than just a UI. I implemented a Forecasting Logic that mimics a basic predictive model, providing users with actionable intelligence rather than just historical data.

Final Submission Checklist
:)Functional Admin/Viewer Role Toggle

:) Responsive Mobile View

:) Search & Filtering Logic

:) Dark Mode Support

:) CSV Export Feature

:)Dynamic Insights Calculation

Contact: aparna.kumari.shaw@gmail.com
