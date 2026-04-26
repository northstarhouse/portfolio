"use client";

import { useMemo, useRef, useState } from "react";
import {
  createBrowserProduct,
  deleteBrowserProduct,
  reorderBrowserProducts,
  saveBrowserProduct,
  saveBrowserSiteContent,
  uploadBrowserImage
} from "@/lib/supabase-browser";
import { SiteContent, Product, ProductCategory } from "@/lib/types";

type AdminDashboardProps = {
  initialContent: SiteContent;
  initialProducts: Product[];
  onLogout: () => void;
};

type EditableTextProps = {
  label: string;
  value: string;
  multiline?: boolean;
  onChange: (value: string) => void;
};

const categories: ProductCategory[] = [
  "Digital Download",
  "Preset Pack",
  "Print License"
];

function EditableText({
  label,
  value,
  multiline = false,
  onChange
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    onChange(draft.trim() ? draft : value);
    setEditing(false);
  }

  return (
    <div className="editable-block">
      <div className="editable-block__label">{label}</div>
      {editing ? (
        multiline ? (
          <textarea
            className="editable-block__input editable-block__input--multiline"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            autoFocus
          />
        ) : (
          <input
            className="editable-block__input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                commit();
              }
            }}
            autoFocus
          />
        )
      ) : (
        <button
          type="button"
          className="editable-block__preview"
          onDoubleClick={() => setEditing(true)}
          onClick={() => setEditing(true)}
        >
          <span style={{ whiteSpace: "pre-line" }}>{value}</span>
        </button>
      )}
    </div>
  );
}

export function AdminDashboard({
  initialContent,
  initialProducts,
  onLogout
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"landing" | "collections">("landing");
  const [content, setContent] = useState(initialContent);
  const [products, setProducts] = useState(initialProducts);
  const [status, setStatus] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [newProductFile, setNewProductFile] = useState<File | null>(null);
  const [newProduct, setNewProduct] = useState({
    title: "",
    slug: "",
    category: "Digital Download" as ProductCategory,
    description: "",
    price: "34",
    downloadLabel: "High-resolution JPEG download",
    featured: true,
    available: true
  });
  const uploadRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const landingProducts = useMemo(() => products.slice(0, 4), [products]);

  async function saveContent(nextContent = content) {
    setPending(true);
    setStatus("");

    try {
      await saveBrowserSiteContent(nextContent);
      setPending(false);
      setStatus("Landing page saved.");
    } catch {
      setPending(false);
      setStatus("Landing page save failed.");
    }
  }

  async function saveProduct(product: Product) {
    try {
      await saveBrowserProduct(product);
      setStatus(`Saved ${product.title}.`);
    } catch {
      setStatus(`Could not save ${product.title}.`);
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
    } catch {
      setStatus("Image upload failed.");
    }
  }

  async function persistOrder(nextProducts: Product[]) {
    setProducts(nextProducts);
    try {
      await reorderBrowserProducts(nextProducts);
      setStatus("Collection order updated.");
    } catch {
      setStatus("Could not save order.");
    }
  }

  async function deleteProduct(id: string) {
    try {
      await deleteBrowserProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      setStatus("Photo removed.");
    } catch {
      setStatus("Delete failed.");
    }
  }

  async function createProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newProductFile) {
      setStatus("Choose an image before creating a product.");
      return;
    }

    try {
      const imageUrl = await uploadImage(newProductFile);
      await createBrowserProduct({
        title: newProduct.title,
        slug: newProduct.slug,
        category: newProduct.category,
        description: newProduct.description,
        price: Number(newProduct.price),
        imageUrl,
        previewUrl: imageUrl,
        downloadLabel: newProduct.downloadLabel,
        featured: newProduct.featured,
        available: newProduct.available,
        sortOrder: products.length + 1
      });
      const nextProducts = [
        ...products,
        {
          id: crypto.randomUUID(),
          title: newProduct.title,
          slug: newProduct.slug,
          category: newProduct.category,
          description: newProduct.description,
          price: Number(newProduct.price),
          imageUrl,
          previewUrl: imageUrl,
          downloadLabel: newProduct.downloadLabel,
          featured: newProduct.featured,
          available: newProduct.available,
          sortOrder: products.length + 1
        }
      ];
      setProducts(nextProducts);
      setNewProductFile(null);
      setNewProduct({
        title: "",
        slug: "",
        category: "Digital Download",
        description: "",
        price: "34",
        downloadLabel: "High-resolution JPEG download",
        featured: true,
        available: true
      });
      setStatus("New photo added.");
    } catch {
      setStatus("New photo upload failed.");
    }
  }

  return (
    <div className="admin-shell">
      <div className="admin-toolbar">
        <div>
          <div className="section-kicker">Admin Dashboard</div>
          <h1 className="admin-title">Haley Wright &amp; Co. content manager</h1>
          <p className="muted">
            Double-click text to edit. Double-click a landing photo to replace it.
          </p>
        </div>

        <div className="admin-toolbar__actions">
          <button className="button-secondary" type="button" onClick={onLogout}>
            Log out
          </button>
          <button
            className="button"
            type="button"
            disabled={pending}
            onClick={() => saveContent()}
          >
            {pending ? "Saving..." : "Save Landing Page"}
          </button>
        </div>
      </div>

      {status ? <div className="admin-status">{status}</div> : null}

      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab${activeTab === "landing" ? " is-active" : ""}`}
          onClick={() => setActiveTab("landing")}
        >
          Landing Page
        </button>
        <button
          type="button"
          className={`admin-tab${activeTab === "collections" ? " is-active" : ""}`}
          onClick={() => setActiveTab("collections")}
        >
          Collections & Photos
        </button>
      </div>

      {activeTab === "landing" ? (
        <div className="admin-grid">
          <section className="admin-panel">
            <h2>Live text editor</h2>
            <EditableText
              label="Hero Eyebrow"
              value={content.hero.eyebrow}
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  hero: { ...current.hero, eyebrow: value }
                }))
              }
            />
            <EditableText
              label="Hero Title"
              value={content.hero.title}
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  hero: { ...current.hero, title: value }
                }))
              }
            />
            <EditableText
              label="Hero Emphasis"
              value={content.hero.emphasizedTitle}
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  hero: { ...current.hero, emphasizedTitle: value }
                }))
              }
            />
            <EditableText
              label="Hero Description"
              value={content.hero.description}
              multiline
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  hero: { ...current.hero, description: value }
                }))
              }
            />
            <EditableText
              label="About Title"
              value={content.about.title}
              multiline
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  about: { ...current.about, title: value }
                }))
              }
            />
            <EditableText
              label="About Body"
              value={content.about.body}
              multiline
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  about: { ...current.about, body: value }
                }))
              }
            />
            <EditableText
              label="Collections Title"
              value={content.collections.title}
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  collections: { ...current.collections, title: value }
                }))
              }
            />
            <EditableText
              label="Shop Title"
              value={content.shop.title}
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  shop: { ...current.shop, title: value }
                }))
              }
            />
            <EditableText
              label="Shop Description"
              value={content.shop.description}
              multiline
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  shop: { ...current.shop, description: value }
                }))
              }
            />
            <EditableText
              label="Quote"
              value={content.quote.text}
              multiline
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  quote: { ...current.quote, text: value }
                }))
              }
            />
            <EditableText
              label="Quote Citation"
              value={content.quote.cite}
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  quote: { ...current.quote, cite: value }
                }))
              }
            />
          </section>

          <section className="admin-panel">
            <h2>Landing page preview</h2>
            <div className="admin-preview admin-preview--hero">
              <span className="hero-eyebrow">{content.hero.eyebrow}</span>
              <h3 className="hero-title admin-preview__title">
                {content.hero.title} <em>{content.hero.emphasizedTitle}</em>
              </h3>
              <p className="hero-sub">{content.hero.description}</p>
              <div className="admin-landing-images">
                {landingProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="admin-image-button"
                    onDoubleClick={() => uploadRefs.current[product.id]?.click()}
                    onClick={() => uploadRefs.current[product.id]?.click()}
                  >
                    <img src={product.previewUrl || product.imageUrl} alt={product.title} />
                    <span>{product.title}</span>
                    <input
                      ref={(element) => {
                        uploadRefs.current[product.id] = element;
                      }}
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
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-preview">
              <h3>{content.about.title}</h3>
              <p style={{ whiteSpace: "pre-line" }}>{content.about.body}</p>
            </div>

            <div className="admin-preview">
              <h3>{content.collections.title}</h3>
              <div className="admin-collection-copy">
                {content.collections.items.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="admin-collection-copy__item">
                    <EditableText
                      label={`Card ${index + 1} Tag`}
                      value={item.tag}
                      onChange={(value) =>
                        setContent((current) => ({
                          ...current,
                          collections: {
                            ...current.collections,
                            items: current.collections.items.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, tag: value } : entry
                            )
                          }
                        }))
                      }
                    />
                    <EditableText
                      label={`Card ${index + 1} Title`}
                      value={item.title}
                      onChange={(value) =>
                        setContent((current) => ({
                          ...current,
                          collections: {
                            ...current.collections,
                            items: current.collections.items.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, title: value } : entry
                            )
                          }
                        }))
                      }
                    />
                    <EditableText
                      label={`Card ${index + 1} Description`}
                      value={item.description}
                      multiline
                      onChange={(value) =>
                        setContent((current) => ({
                          ...current,
                          collections: {
                            ...current.collections,
                            items: current.collections.items.map((entry, entryIndex) =>
                              entryIndex === index
                                ? { ...entry, description: value }
                                : entry
                            )
                          }
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : (
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

          <section className="admin-panel">
            <h2>Add new photo</h2>
            <form className="admin-create-form" onSubmit={createProduct}>
              <label className="admin-field">
                <span>Title</span>
                <input
                  value={newProduct.title}
                  onChange={(event) =>
                    setNewProduct((current) => ({
                      ...current,
                      title: event.target.value
                    }))
                  }
                  required
                />
              </label>
              <label className="admin-field">
                <span>Slug</span>
                <input
                  value={newProduct.slug}
                  onChange={(event) =>
                    setNewProduct((current) => ({
                      ...current,
                      slug: event.target.value
                    }))
                  }
                  required
                />
              </label>
              <label className="admin-field">
                <span>Category</span>
                <select
                  value={newProduct.category}
                  onChange={(event) =>
                    setNewProduct((current) => ({
                      ...current,
                      category: event.target.value as ProductCategory
                    }))
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
                  value={newProduct.price}
                  onChange={(event) =>
                    setNewProduct((current) => ({
                      ...current,
                      price: event.target.value
                    }))
                  }
                />
              </label>
              <label className="admin-field admin-field--full">
                <span>Description</span>
                <textarea
                  value={newProduct.description}
                  onChange={(event) =>
                    setNewProduct((current) => ({
                      ...current,
                      description: event.target.value
                    }))
                  }
                  required
                />
              </label>
              <label className="admin-field admin-field--full">
                <span>Download Label</span>
                <input
                  value={newProduct.downloadLabel}
                  onChange={(event) =>
                    setNewProduct((current) => ({
                      ...current,
                      downloadLabel: event.target.value
                    }))
                  }
                />
              </label>
              <label className="admin-field admin-field--full">
                <span>Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setNewProductFile(event.target.files?.[0] ?? null)}
                  required
                />
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={newProduct.featured}
                  onChange={(event) =>
                    setNewProduct((current) => ({
                      ...current,
                      featured: event.target.checked
                    }))
                  }
                />
                <span>Featured</span>
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={newProduct.available}
                  onChange={(event) =>
                    setNewProduct((current) => ({
                      ...current,
                      available: event.target.checked
                    }))
                  }
                />
                <span>Visible</span>
              </label>
              <button className="button" type="submit">
                Add Photo
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
