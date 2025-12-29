This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

This project follows a scalable folder structure designed for Next.js applications:

- **src/app**: Contains the App Router pages and layouts. This is the main entry point for routes.
- **src/components**: Stores all React components.
  - **ui**: Generic, reusable components (Buttons, Inputs, Cards).
  - **layout**: Structural components (Header, Footer, Sidebar).
  - **features**: Business-specific components (e.g., ProductList, UserProfile).
- **src/services**: Handles external API interactions.
  - **api.ts**: Centralized API client wrapper.
  - **config.ts**: Environment variables and configuration constants.
- **src/hooks**: Custom React hooks (e.g., useFetch, useAuth).
- **src/context**: React Context providers for global state management.
- **src/utils**: Utility functions and helpers.
- **src/types**: TypeScript interfaces and types shared across the application.
- **src/assets**: Static assets such as images, icons, and fonts.
- **src/styles**: Global styles and CSS modules.
