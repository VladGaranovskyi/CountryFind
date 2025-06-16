# Country Similarity Backend

Backend API for the Country Similarity application using AI embeddings to find similar countries.

## Features

- RESTful API for country data management
- Vector similarity search using AI embeddings
- World Bank data integration
- Authentication and authorization
- Admin dashboard support
- Chat functionality for country insights

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `GET /api/countries` - Get all countries
- `GET /api/countries/:id` - Get country by ID
- `POST /api/similarity/find` - Find similar countries
- `GET /api/admin/stats` - Get admin statistics

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data