# Backend Integration Notes

Endpoints expected by the frontend (prefix from NG_APP_API_BASE):
- POST /chat
  Body: { message: string, conversationId?: string }
  Returns: { conversationId: string, messages: [{ id, role, content, timestamp }] }

- GET /products
  Query: q?: string, page?: number, pageSize?: number
  Returns: Product[]

- GET /products/:id
  Returns: Product

- POST /checkout
  Body: CheckoutRequest
  Returns: CheckoutResponse

Use NG_APP_API_BASE to configure the base URL. In local dev, default is http://localhost:8000/api.
