const API_URL = import.meta.env.VITE_API_URL || "/api";
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
const DEMO_CATEGORIES = [
  { id: 1, name: "Pizza" },
  { id: 2, name: "Pasta" },
  { id: 3, name: "Wine" },
];
const DEMO_PRODUCTS = [
  { id: 1, name: "Margherita", description: "Tomato sauce, mozzarella", price: 7.11, imageUrl: "", isAvailable: true, categoryId: 1, categoryName: "Pizza" },
  { id: 2, name: "Quattro Formaggi", description: "Tomato sauce, four cheeses", price: 9.05, imageUrl: "", isAvailable: true, categoryId: 1, categoryName: "Pizza" },
  { id: 3, name: "Diavolo", description: "Tomato, mozzarella, spicy salami, chili, garlic", price: 8.79, imageUrl: "", isAvailable: true, categoryId: 1, categoryName: "Pizza" },
  { id: 4, name: "Spaghetti alla Carbonara", description: "Cream, ham, egg, parmesan", price: 8.44, imageUrl: "", isAvailable: true, categoryId: 2, categoryName: "Pasta" },
  { id: 5, name: "Tagliatelle al Salmone", description: "Salmon, mushroom, garlic, cream, tomato", price: 10.79, imageUrl: "", isAvailable: true, categoryId: 2, categoryName: "Pasta" },
  { id: 6, name: "Lasagne al Forno", description: "Beef ragù, béchamel, gouda", price: 9.31, imageUrl: "", isAvailable: true, categoryId: 2, categoryName: "Pasta" },
  { id: 7, name: "Castra Rubra Rosé", description: "750ml · 8.7% vol", price: 19.94, imageUrl: "", isAvailable: true, categoryId: 3, categoryName: "Wine" },
  { id: 8, name: "Santa Cristina Rosato", description: "750ml · 8.7% vol", price: 34.26, imageUrl: "", isAvailable: true, categoryId: 3, categoryName: "Wine" },
];

function getDemoResponse(endpoint, method) {
  if (endpoint === "/categories" && method === "GET") return DEMO_CATEGORIES;
  if (endpoint.startsWith("/products") && method === "GET") {
    const categoryId = new URLSearchParams(endpoint.split("?")[1] || "").get("categoryId");
    return categoryId ? DEMO_PRODUCTS.filter((product) => String(product.categoryId) === categoryId) : DEMO_PRODUCTS;
  }
  if (endpoint === "/orders" && method === "POST") return { id: "demo-order", status: "Simulated" };

  if (endpoint === "/auth/me" && method === "GET") {
    if (!localStorage.getItem("auth_token")) {
      throw new Error("Sign in to the portfolio demo to continue.");
    }
    return { user: { id: 1, name: "Demo Guest", email: "guest@example.com", role: "Customer", isEmailVerified: true } };
  }

  if (endpoint === "/auth/login" || endpoint === "/auth/register") {
    return {
      token: "portfolio-demo-session",
      user: { id: 1, name: "Demo Guest", email: "guest@example.com", role: "Customer", isEmailVerified: true },
    };
  }

  if (["/auth/forgot-password", "/auth/reset-password"].includes(endpoint)) {
    return { message: "This portfolio demo simulates account actions; no email or account data is sent." };
  }

  throw new Error("This feature is unavailable in the portfolio demo.");
}

async function request(endpoint, options = {}) {
  if (DEMO_MODE) {
    return getDemoResponse(endpoint, options.method || "GET");
  }

  const token = localStorage.getItem("auth_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const validationMessages = data?.errors && typeof data.errors === "object"
      ? Object.values(data.errors).flat().filter((message) => typeof message === "string")
      : [];
    const message =
      data?.message ||
      data?.error ||
      validationMessages.join(" ") ||
      data?.detail ||
      data?.title ||
      `Request failed with status ${response.status}`;

    const error = new Error(message);
    error.status = response.status;
    if (response.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    throw error;
  }

  return data;
}

export const apiClient = {
  get(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};

export default apiClient;
