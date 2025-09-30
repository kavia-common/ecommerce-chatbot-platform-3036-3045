# OceanShop Angular Frontend

Modern Angular 19 app implementing an ecommerce chatbot experience with the Ocean Professional theme.

Features:
- Chat interface with AI assistant
- Product browsing with responsive grid
- Product detail modal
- Shopping cart drawer
- Checkout and confirmation flows
- Responsive, modern UI with blue (primary) and amber (secondary) accents

Run locally:
1) Install dependencies
   npm install
2) Set backend API base URL (optional, defaults to http://localhost:8000/api)
   export NG_APP_API_BASE="http://localhost:8000/api"
3) Start the dev server
   npm start
   Open http://localhost:3000

Build:
   NG_APP_API_BASE="https://your-backend.example.com/api" npm run build

Environment variables:
- NG_APP_API_BASE: Base URL for backend REST API (chat, products, checkout)

Backend API expectations (placeholders; integrate with your backend):
- POST   /api/chat           -> ChatResponse
- GET    /api/products       -> Product[]
- GET    /api/products/:id   -> Product
- POST   /api/checkout       -> CheckoutResponse

Styling:
- See src/app/README_THEME.md for theme details.
