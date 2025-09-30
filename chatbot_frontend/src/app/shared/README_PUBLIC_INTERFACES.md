# Public interfaces

- ApiService
  - chat(request: ChatRequest): Observable<ChatResponse>
  - getProducts(query?: string, page?: number, pageSize?: number): Observable<Product[]>
  - getProduct(id: string): Observable<Product>
  - summarizeOrder(items: CartItem[], currency?: string): Observable<OrderSummary>
  - checkout(request: CheckoutRequest): Observable<CheckoutResponse>

- ProductService
  - products: Observable<Product[]>
  - search(query?: string): void
  - getProduct(id: string): Observable<Product>

- CartService
  - items$: Observable<CartItem[]>
  - add(product: Product, qty?: number): void
  - updateQuantity(productId: string, qty: number): void
  - remove(productId: string): void
  - clear(): void
  - snapshot: CartItem[]

- ChatService
  - messages$: Observable<ChatMessage[]>
  - send(message: string): Promise<void>
  - reset(): void
