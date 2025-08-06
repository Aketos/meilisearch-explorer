# Meilisearch Explorer

A comprehensive Next.js application for managing and exploring your Meilisearch data. This application provides a user-friendly interface to interact with Meilisearch indexes, documents, and settings.

![Meilisearch Explorer](https://raw.githubusercontent.com/meilisearch/meilisearch/main/assets/meilisearch-logo.svg)

## Features

- **Index Management**: Create, view, and delete Meilisearch indexes
- **Document Management**: Add, edit, and delete documents within indexes
- **Search Interface**: Perform searches across your Meilisearch indexes with a clean UI
- **Index Settings**: Configure index settings such as searchable attributes, filterable attributes, etc.
- **Server Management**: View server statistics, health, and version information

## Prerequisites

- Node.js 18.x or later
- A running Meilisearch instance (local or remote)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_MEILISEARCH_HOST=http://localhost:7700
NEXT_PUBLIC_MEILISEARCH_API_KEY=your_api_key_if_needed
```

> Note: If your Meilisearch instance doesn't require an API key, you can leave `NEXT_PUBLIC_MEILISEARCH_API_KEY` empty.

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/meilisearch-explorer.git
cd meilisearch-explorer
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Application Structure

- `/src/app`: Next.js app router pages
- `/src/components`: React components used throughout the application
- `/src/lib`: Utility functions and configuration

## Pages

- `/`: Home page with dashboard overview
- `/indexes`: List of all Meilisearch indexes
- `/indexes/[indexUid]`: Index detail page with document management and settings
- `/search`: Search interface for querying indexes
- `/management`: Server management and statistics

## Accessibility

This application is designed with accessibility in mind, featuring:

- High contrast color schemes
- Keyboard navigation support
- Screen reader friendly components
- Responsive design for all device sizes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Meilisearch](https://www.meilisearch.com/) for the powerful search engine
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
