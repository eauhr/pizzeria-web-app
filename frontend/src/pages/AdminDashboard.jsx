import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Archive, Loader2, Pencil, Plus, RefreshCw, Save, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "@/lib/apiClient";
import { formatPrice } from "@/lib/formatPrice";
import { useAuth } from "@/contexts/AuthContext";

const emptyProduct = { name: "", description: "", price: "", imageUrl: "", categoryId: "", isAvailable: true };
const orderStatuses = ["Pending", "Preparing", "Ready", "Completed", "Cancelled"];
const fieldClass = "w-full rounded border border-border bg-background px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";
const buttonClass = "inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

function ErrorNotice({ children }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("menu");
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [notice, setNotice] = useState("");

  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: () => apiClient.get("/categories") });
  const productsQuery = useQuery({ queryKey: ["products", "admin"], queryFn: () => apiClient.get("/products?includeUnavailable=true") });
  const ordersQuery = useQuery({ queryKey: ["orders", "admin"], queryFn: () => apiClient.get("/orders"), enabled: activeTab === "orders" });

  const refreshCatalog = async () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["categories"] }),
    queryClient.invalidateQueries({ queryKey: ["products"] }),
  ]);
  const categoryMutation = useMutation({
    mutationFn: ({ id, name }) => id ? apiClient.put(`/categories/${id}`, { name }) : apiClient.post("/categories", { name }),
    onSuccess: async () => {
      setCategoryName("");
      setEditingCategory(null);
      setNotice("Category saved.");
      await refreshCatalog();
    },
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/categories/${id}`),
    onSuccess: async () => { setNotice("Category deleted."); await refreshCatalog(); },
  });
  const productMutation = useMutation({
    mutationFn: ({ id, ...product }) => id ? apiClient.put(`/products/${id}`, product) : apiClient.post("/products", product),
    onSuccess: async () => {
      setProductForm(emptyProduct);
      setEditingProductId(null);
      setNotice("Product saved.");
      await refreshCatalog();
    },
  });
  const archiveProductMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/products/${id}`),
    onSuccess: async () => { setNotice("Product marked unavailable. Past order history is preserved."); await refreshCatalog(); },
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => apiClient.patch(`/orders/${id}/status`, { status }),
    onSuccess: async () => {
      setNotice("Order status updated.");
      await queryClient.invalidateQueries({ queryKey: ["orders", "admin"] });
    },
  });

  const mutationError = categoryMutation.error || deleteCategoryMutation.error || productMutation.error || archiveProductMutation.error || statusMutation.error;
  const queryError = categoriesQuery.error || productsQuery.error || (activeTab === "orders" ? ordersQuery.error : null);
  const categories = categoriesQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const orders = ordersQuery.data ?? [];

  const startEditingProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl ?? "",
      categoryId: String(product.categoryId),
      isAvailable: product.isAvailable,
    });
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const saveProduct = (event) => {
    event.preventDefault();
    setNotice("");
    productMutation.mutate({
      ...(editingProductId ? { id: editingProductId } : {}),
      ...productForm,
      price: Number(productForm.price),
      categoryId: Number(productForm.categoryId),
      imageUrl: productForm.imageUrl.trim(),
    });
  };

  return (
    <section className="min-h-screen bg-background px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-script text-xl text-secondary">Picantino operations</p>
            <h1 className="display text-4xl text-primary md:text-5xl">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-foreground/70">Signed in as {user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="inline-flex items-center rounded border border-border px-4 py-2 text-sm font-semibold hover:bg-card">View site</Link>
            <button className={buttonClass} onClick={() => { setNotice(""); void queryClient.invalidateQueries(); }}>
              <RefreshCw className="h-4 w-4" /> Refresh data
            </button>
            <button className="rounded border border-border px-4 py-2 text-sm font-semibold hover:bg-card" onClick={() => { logout(); navigate("/login", { replace: true }); }}>Sign out</button>
          </div>
        </div>

        <div className="mb-6 flex gap-2 border-b border-border" role="tablist" aria-label="Admin sections">
          <button role="tab" aria-selected={activeTab === "menu"} onClick={() => setActiveTab("menu")} className={`px-4 py-3 text-sm font-semibold ${activeTab === "menu" ? "border-b-2 border-secondary text-primary" : "text-foreground/60"}`}>
            Menu management
          </button>
          <button role="tab" aria-selected={activeTab === "orders"} aria-controls="admin-orders" onClick={() => setActiveTab("orders")} className={`px-4 py-3 text-sm font-semibold ${activeTab === "orders" ? "border-b-2 border-secondary text-primary" : "text-foreground/60"}`}>
            Orders ({orders.length})
          </button>
        </div>

        {notice && <p className="mb-4 rounded bg-primary/10 p-3 text-sm text-primary" role="status">{notice}</p>}
        {mutationError && <div className="mb-4"><ErrorNotice>{mutationError.message}</ErrorNotice></div>}
        {queryError && <div className="mb-4"><ErrorNotice>{queryError.message}. Check that the API and database are running.</ErrorNotice></div>}

        {activeTab === "menu" ? (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div className="space-y-6">
              <form className="space-y-4 rounded border border-border bg-card p-5" onSubmit={(event) => {
                event.preventDefault();
                categoryMutation.mutate({ id: editingCategory?.id, name: categoryName.trim() });
              }}>
                <div className="flex items-center justify-between">
                  <h2 className="display text-2xl text-primary">{editingCategory ? "Edit category" : "Add category"}</h2>
                  {editingCategory && <button type="button" onClick={() => { setEditingCategory(null); setCategoryName(""); }} aria-label="Cancel category edit"><X className="h-5 w-5" /></button>}
                </div>
                <label className="block text-sm font-medium" htmlFor="category-name">Category name</label>
                <input id="category-name" className={fieldClass} value={categoryName} onChange={(event) => setCategoryName(event.target.value)} maxLength={80} required />
                <button className={buttonClass} disabled={categoryMutation.isPending}>
                  {categoryMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save category
                </button>
                {categoriesQuery.isLoading ? <p className="text-sm text-foreground/60">Loading categories…</p> : (
                  <ul className="divide-y divide-border">
                    {categories.map((category) => (
                      <li key={category.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                        <span>{category.name}</span>
                        <span className="flex gap-2">
                          <button type="button" className="rounded p-2 hover:bg-background" aria-label={`Edit ${category.name}`} onClick={() => { setEditingCategory(category); setCategoryName(category.name); }}><Pencil className="h-4 w-4" /></button>
                          <button type="button" className="rounded p-2 text-destructive hover:bg-destructive/10" aria-label={`Delete ${category.name}`} onClick={() => deleteCategoryMutation.mutate(category.id)}><X className="h-4 w-4" /></button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </form>

              <form className="space-y-4 rounded border border-border bg-card p-5" onSubmit={saveProduct}>
                <div className="flex items-center justify-between">
                  <h2 className="display text-2xl text-primary">{editingProductId ? "Edit product" : "Add product"}</h2>
                  {editingProductId && <button type="button" onClick={() => { setEditingProductId(null); setProductForm(emptyProduct); }} aria-label="Cancel product edit"><X className="h-5 w-5" /></button>}
                </div>
                <label className="block text-sm font-medium" htmlFor="product-name">Name</label>
                <input id="product-name" className={fieldClass} value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} maxLength={120} required />
                <label className="block text-sm font-medium" htmlFor="product-description">Description</label>
                <textarea id="product-description" className={fieldClass} rows={3} value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} maxLength={1000} required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor="product-price">Price (€)</label>
                    <input id="product-price" className={fieldClass} type="number" min="0.01" max="10000" step="0.01" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor="product-category">Category</label>
                    <select id="product-category" className={fieldClass} value={productForm.categoryId} onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })} required>
                      <option value="">Select category</option>
                      {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                  </div>
                </div>
                <label className="block text-sm font-medium" htmlFor="product-image">Image URL (optional)</label>
                <input id="product-image" className={fieldClass} type="url" value={productForm.imageUrl} onChange={(event) => setProductForm({ ...productForm, imageUrl: event.target.value })} placeholder="https://…" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={productForm.isAvailable} onChange={(event) => setProductForm({ ...productForm, isAvailable: event.target.checked })} />
                  Available on the public menu
                </label>
                <button className={buttonClass} disabled={productMutation.isPending || categories.length === 0}>
                  {productMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : editingProductId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingProductId ? "Save product" : "Add product"}
                </button>
              </form>
            </div>

            <div className="overflow-hidden rounded border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h2 className="display text-2xl text-primary">Products</h2>
                <span className="text-sm text-foreground/60">{products.length} total</span>
              </div>
              {productsQuery.isLoading ? <div className="p-8 text-center" role="status">Loading products…</div> : products.length === 0 ? <p className="p-8 text-center text-sm text-foreground/60">No products yet. Add one using the form.</p> : (
                <div className="divide-y divide-border">
                  {products.map((product) => (
                    <article key={product.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-primary">{product.name}</h3>
                        <p className="text-sm text-foreground/65">{product.categoryName} · {formatPrice(product.price)} · {product.isAvailable ? "Available" : "Unavailable"}</p>
                        <p className="mt-1 truncate text-xs text-foreground/55">{product.description}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button className="rounded border border-border px-3 py-2 text-sm hover:bg-background" onClick={() => startEditingProduct(product)}><Pencil className="mr-1 inline h-4 w-4" />Edit</button>
                        {product.isAvailable && <button className="rounded border border-border px-3 py-2 text-sm text-destructive hover:bg-destructive/10" disabled={archiveProductMutation.isPending} onClick={() => archiveProductMutation.mutate(product.id)}><Archive className="mr-1 inline h-4 w-4" />Hide</button>}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div id="admin-orders" className="overflow-x-auto rounded border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="display text-2xl text-primary">Recent orders</h2>
              <span className="text-sm text-foreground/60">{orders.length} total</span>
            </div>
            {ordersQuery.isLoading ? <div className="p-8 text-center" role="status">Loading orders…</div> : orders.length === 0 ? <p className="p-8 text-center text-sm text-foreground/60">No orders have been placed yet.</p> : (
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-primary/5 text-xs uppercase tracking-wide text-foreground/60">
                  <tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4">Placed</th><th className="p-4">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="p-4 font-semibold">#{order.id}</td>
                      <td className="p-4">{order.userName || `Customer #${order.userId}`}</td>
                      <td className="max-w-64 p-4">{order.items.map((item) => `${item.quantity} × ${item.productName}`).join(", ")}</td>
                      <td className="p-4 font-semibold">{formatPrice(order.totalPrice)}</td>
                      <td className="whitespace-nowrap p-4">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="p-4">
                        <select className={`${fieldClass} min-w-36`} aria-label={`Status for order ${order.id}`} value={order.status} disabled={statusMutation.isPending} onChange={(event) => statusMutation.mutate({ id: order.id, status: event.target.value })}>
                          {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
