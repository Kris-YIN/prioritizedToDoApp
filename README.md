# Prioritized Todo App

A modern, prioritized todo application built with Next.js and Supabase.

## Features

- Create, read, update, and delete todo items
- Prioritize tasks for efficient task management
- Real-time updates using Supabase

## Tech Stack

- Next.js
- TypeScript
- Supabase for backend and real-time functionality
- Custom UI components

## Getting Started

1. Clone the repository
2. Install dependencies:

npm install
# or
yarn install
# or
pnpm install
# or
bun install

3. Set up your Supabase project and update the credentials in `lib/supabase.ts`

4. Run the development server:


npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



## Project Structure

- `components/ui/`: Custom UI components (Button, Input, Textarea)
- `lib/`: Utility functions and configurations
- `next.config.js`: Next.js configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
