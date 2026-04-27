"use client";

import { useState } from "react";
import {
  deleteBrowserProduct,
  reorderBrowserProducts,
  saveBrowserProduct,
  uploadBrowserImage
} from "@/lib/supabase-browser";
import { SiteContent, Product, ProductCategory } from "@/lib/types";

type AdminDashboardProps = {
  initialContent: SiteContent;
  initialProducts: Product[];
  onLogout: () => void;
};

const categories: ProductCategory[] = [
  "Digital Download",
  "Preset Pack",
  "Print License"
];

export function AdminDashboard({
  initialContent: _initialContent,
  initialProducts,
  onLogout
}: AdminDashboardProps) {
  const [products, setProducts] = useState(initialProducts);
  const [status, setStatus] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  async function saveProduct(product: Product) {
    try {
      await saveBrowserProduct(product);
      setStatus(`Saved ${product.title}.`);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `Could not save ${product.title}: ${error.message}`
          : `Could not save ${product.title}.`
      );
    }
  }

  async function uploadImage(file: File) {
    return uploadBrowserImage(file);
  }

  async function replaceProductImage(productId: string, file: File) {
    try {
      const publicUrl = await uploadImage(file);
      const nextProducts = products.map((product) =>
        product.id === productId
          ? {
              ...product,
              imageUrl: publicUrl,
              previewUrl: publicUrl
            }
          : product
      );

      setProducts(nextProducts);
      const updatedProduct = nextProducts.find((product) => product.id === productId);

      if (updatedProduct) {
        await saveProduct(updatedProduct);
      }
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `Image upload failed: ${error.message}`
          : "Image upload failed."
      );
    }
  }

  async function persistOrder(nextProducts: Product[]) {
    setProducts(nextProducts);
    try {
      await reorderBrowserProducts(nextProducts);
      setStatus("Collection order updated.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `Could not save order: ${error.message}`
          : "Could not save order."
      );
    }
  }

  async function deleteProduct(id: string) {
    try {
      await deleteBrowserProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      setStatus("Photo removed.");
    } catch (error) {
      setStatus(
        error instanceof Error ? `Delete failed: ${error.message}` : "Delete failed."
      );
    }
  }

  return (
    <div className="admin-shell">
      <div className="admin-toolbar">
        <div>
          <div className="section-kicker">Admin Dashboard</div>
          <h1 className="admin-title">Haley Wright &amp; Co. content manager</h1>
          <p className="muted">
            Manage collection order, titles, pricing, and image uploads.
          </p>
        </div>

        <div className="admin-toolbar__actions">
          <button className="button-secondary" type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>

      {status ? <div className="admin-status">{status}</div> : null}
      <div className="admin-grid admin-grid--collections">
        <section className="admin-panel">
          <h2>Collections manager</h2>
          <p className="muted">
            Drag cards to reorder. Edit titles, slugs, pricing, and replace or
            delete photos.
          </p>

          <div className="admin-product-list">
            {products.map((product) => (
              <article
                key={product.id}
                className="admin-product-card"
                draggable
                onDragStart={() => setDraggingId(product.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (!draggingId || draggingId === product.id) {
                    return;
                  }

                  const moving = products.find((entry) => entry.id === draggingId);

                  if (!moving) {
                    return;
                  }

                  const filtered = products.filter((entry) => entry.id !== draggingId);
                  const targetIndex = filtered.findIndex((entry) => entry.id === product.id);
                  filtered.splice(targetIndex, 0, moving);

                  void persistOrder(
                    filtered.map((entry, index) => ({
                      ...entry,
                      sortOrder: index + 1
                    }))
                  );
                }}
              >
                <div className="admin-product-card__media">
                  <img
                    src={product.previewUrl || product.imageUrl}
                    alt={product.title}
                  />
                  <label className="button-secondary admin-upload-button">
                    Replace Image
                    <input
                      className="admin-hidden-input"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          void replaceProductImage(product.id, file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="admin-product-card__fields">
                  <label className="admin-field">
                    <span>Title</span>
                    <input
                      value={product.title}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((entry) =>
                            entry.id === product.id
                              ? { ...entry, title: event.target.value }
                              : entry
                          )
                        )
                      }
                    />
                  </label>
                  <label className="admin-field">
                    <span>Slug</span>
                    <input
                      value={product.slug}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((entry) =>
                            entry.id === product.id
                              ? { ...entry, slug: event.target.value }
                              : entry
                          )
                        )
                      }
                    />
                  </label>
                  <label className="admin-field">
                    <span>Category</span>
                    <select
                      value={product.category}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((entry) =>
                            entry.id === product.id
                              ? {
                                  ...entry,
                                  category: event.target.value as ProductCategory
                                }
                              : entry
                          )
                        )
                      }
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="admin-field">
                    <span>Price</span>
                    <input
                      type="number"
                      step="0.01"
                      value={product.price}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((entry) =>
                            entry.id === product.id
                              ? { ...entry, price: Number(event.target.value) }
                              : entry
                          )
                        )
                      }
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>Description</span>
                    <textarea
                      value={product.description}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((entry) =>
                            entry.id === product.id
                              ? { ...entry, description: event.target.value }
                              : entry
                          )
                        )
                      }
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>Download Label</span>
                    <input
                      value={product.downloadLabel}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((entry) =>
                            entry.id === product.id
                              ? { ...entry, downloadLabel: event.target.value }
                              : entry
                          )
                        )
                      }
                    />
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={product.featured ?? false}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((entry) =>
                            entry.id === product.id
                              ? { ...entry, featured: event.target.checked }
                              : entry
                          )
                        )
                      }
                    />
                    <span>Featured</span>
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={product.available ?? true}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((entry) =>
                            entry.id === product.id
                              ? { ...entry, available: event.target.checked }
                              : entry
                          )
                        )
                      }
                    />
                    <span>Visible</span>
                  </label>
                </div>

                <div className="admin-product-card__actions">
                  <button
                    className="button"
                    type="button"
                    onClick={() => void saveProduct(product)}
                  >
                    Save
                  </button>
                  <button
                    className="button-secondary"
                    type="button"
                    onClick={() => void deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
