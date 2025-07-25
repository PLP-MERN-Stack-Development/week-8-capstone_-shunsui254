# MyBudgeteer

A modern, responsive budget management application built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 **Dashboard Overview**: Get a comprehensive view of your financial status
- 💰 **Transaction Management**: Track income and expenses with detailed categorization
- 📈 **Budget Planning**: Set and monitor budgets across different categories
- 📊 **Analytics & Reports**: Visualize spending patterns with interactive charts
- 🌍 **Multi-Currency Support**: Handle multiple currencies with real-time conversion
- 🌙 **Dark/Light Theme**: Toggle between dark and light modes
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts for data visualization
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mybudgeteer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

### Build for Production

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── Analytics.tsx   # Analytics and reporting
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Header.tsx      # Application header
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── styles/             # CSS files
```

## Key Components

- **Dashboard**: Main overview with stats, charts, and quick actions
- **Transaction Management**: Add, edit, and categorize transactions
- **Budget Overview**: Set and track budget limits
- **Analytics**: Detailed spending analysis with charts
- **Currency Support**: Multi-currency handling with conversion

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Use proper component typing
- Maintain consistent code formatting with ESLint
- Write meaningful commit messages
- Test components thoroughly

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the excellent UI component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Recharts](https://recharts.org/) for beautiful, responsive charts
- [Lucide](https://lucide.dev/) for the clean, customizable icons
