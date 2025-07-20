// Mock backend server for development testing

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "Batik Mega Mendung",
    description: "Traditional Indonesian batik with cloud pattern from Cirebon",
    short_description: "Traditional cloud pattern batik from Cirebon",
    price: 150000,
    discount_price: 120000,
    sku: "BTK-MM-001",
    stock_quantity: 10,
    category: "Traditional",
    is_active: true,
    is_featured: true,
    image_url: "/images/batik-1.jpg",
    rating: 4.8,
    reviews_count: 124
  },
  {
    id: 2,
    name: "Batik Kawung",
    description: "Classic geometric pattern batik from Central Java",
    short_description: "Classic geometric pattern from Central Java",
    price: 923000,
    discount_price: 800000,
    sku: "BTK-KW-001",
    stock_quantity: 5,
    category: "Premium",
    is_active: true,
    is_featured: true,
    image_url: "/images/batik-5.jpg",
    rating: 4.9,
    reviews_count: 89
  },
  {
    id: 3,
    name: "Batik Parang",
    description: "Classic diagonal pattern batik from Central Java",
    short_description: "Classic diagonal pattern from Central Java",
    price: 189000,
    discount_price: 150000,
    sku: "BTK-PR-001",
    stock_quantity: 20,
    category: "Classic",
    is_active: true,
    is_featured: true,
    image_url: "/images/batik2.jpg",
    rating: 4.7,
    reviews_count: 156
  }
];

const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  first_name: "Test",
  last_name: "User",
  role: "customer",
  is_active: true,
  email_verified: true
};

const mockCart = {
  id: 1,
  user_id: 1,
  items: [
    {
      id: 1,
      cart_id: 1,
      product_id: 1,
      quantity: 2,
      price: 150000,
      product: mockProducts[0]
    }
  ],
  total_amount: 300000,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Mock API responses
export const mockApiResponses: Record<string, any> = {
  // Health endpoint
  '/health': () => ({
    success: true,
    data: {
      status: "ok",
      version: "1.0.0"
    },
    message: "Batik Shop API is running"
  }),

  // Products endpoints
  '/products': () => ({
    success: true,
    data: mockProducts,
    pagination: {
      page: 1,
      per_page: 10,
      total: mockProducts.length,
      total_pages: 1,
      has_next: false,
      has_prev: false
    },
    message: "Products retrieved successfully"
  }),

  '/products/1': () => ({
    success: true,
    data: mockProducts[0],
    message: "Product retrieved successfully"
  }),

  '/products/2': () => ({
    success: true,
    data: mockProducts[1],
    message: "Product retrieved successfully"
  }),

  '/products/3': () => ({
    success: true,
    data: mockProducts[2],
    message: "Product retrieved successfully"
  }),

  // Auth endpoints
  '/auth/login': () => ({
    success: true,
    data: {
      token: "mock_jwt_token_12345",
      user: mockUser
    },
    message: "Login successful"
  }),

  '/auth/register': () => ({
    success: true,
    data: {
      token: "mock_jwt_token_67890",
      user: mockUser
    },
    message: "Registration successful"
  }),

  // Cart endpoints
  '/cart': () => ({
    success: true,
    data: mockCart,
    message: "Cart retrieved successfully"
  }),

  // Default fallback
  'default': (endpoint: string) => ({
    success: false,
    message: `Mock endpoint not found: ${endpoint}`,
    error_code: "ENDPOINT_NOT_FOUND"
  })
};

// Mock fetch function
export const mockFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  console.log(`🎭 Mock API call: ${options.method || 'GET'} ${url}`);
  
  // Extract endpoint from URL
  const urlObj = new URL(url);
  const endpoint = urlObj.pathname.replace('/api', '');
  
  // Get mock response
  const mockResponse = mockApiResponses[endpoint] || mockApiResponses['default'];
  const responseData = typeof mockResponse === 'function' 
    ? mockResponse(endpoint) 
    : mockResponse;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));

  // Create mock response
  const response = new Response(JSON.stringify(responseData), {
    status: responseData.success ? 200 : 404,
    statusText: responseData.success ? 'OK' : 'Not Found',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });

  console.log(`✅ Mock API response:`, responseData);
  return response;
};

// Enable mock mode
export const enableMockMode = () => {
  // Check if already enabled
  if ((window as any).__mockModeEnabled) {
    console.log('🎭 Mock mode already enabled');
    return;
  }

  // Override global fetch
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    
    // Check if this is an API call
    if (url.includes('/api/')) {
      console.log('🎭 Intercepting API call with mock');
      return mockFetch(url, init);
    }
    
    // Use original fetch for non-API calls
    return originalFetch(input, init);
  };
  
  // Mark as enabled
  (window as any).__mockModeEnabled = true;
  
  console.log('🎭 Mock mode enabled for API calls');
  
  // Show user notification
  showMockNotification();
  
  // Make it available globally for console access
  (window as any).mockAPI = {
    disable: disableMockMode,
    enable: enableMockMode,
    status: () => console.log('🎭 Mock mode is currently enabled')
  };
};

// Show notification to user
const showMockNotification = () => {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
  notification.innerHTML = `
    <span>🎭</span>
    <span>Mock mode enabled - Backend unavailable</span>
    <button onclick="this.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">×</button>
  `;
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
};

// Disable mock mode
export const disableMockMode = () => {
  // Reset the flag
  (window as any).__mockModeEnabled = false;
  
  // Remove global mock API
  delete (window as any).mockAPI;
  
  // This would require storing the original fetch, but for now just reload
  console.log('🎭 Mock mode disabled - please reload the page');
  
  // Show notification
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
  notification.innerHTML = `
    <span>ℹ️</span>
    <span>Please reload the page to fully disable mock mode</span>
    <button onclick="window.location.reload()" class="ml-2 bg-white text-blue-500 px-2 py-1 rounded text-sm">Reload</button>
    <button onclick="this.parentElement.remove()" class="ml-1 text-white hover:text-gray-200">×</button>
  `;
  document.body.appendChild(notification);
};
