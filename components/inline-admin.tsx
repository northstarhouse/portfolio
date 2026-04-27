"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdminMode } from "@/components/admin-mode-provider";
import { SafeImage } from "@/components/safe-image";

type InlineEditableTextProps = {
  as?: "span" | "p" | "h1" | "h2" | "h3" | "cite" | "blockquote";
  className?: string;
  multiline?: boolean;
  value: string;
  onChange: (value: string) => void;
};

type InlineEditableImageProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  badgeLabel?: string;
  emptyLabel?: string;
  onChange: (file: File) => void;
};

type InlineEditToolbarProps = {
  dirty: boolean;
  pending?: boolean;
  status?: string;
  onSave: () => void;
};

export function InlineEditableText({
  as = "span",
  className,
  multiline = false,
  value,
  onChange
}: InlineEditableTextProps) {
  const { enabled } = useAdminMode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const Tag = as;

  function startEditing() {
    if (!enabled) {
      return;
    }

    setDraft(value);
    setEditing(true);
  }

  function commit() {
    onChange(draft);
    setEditing(false);
  }

  if (editing) {
    if (multiline) {
      return (
        <textarea
          className={`inline-editable__input inline-editable__input--multiline ${className ?? ""}`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          autoFocus
        />
      );
    }

    return (
      <input
        className={`inline-editable__input ${className ?? ""}`}
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
    );
  }

  return (
    <Tag
      className={`${className ?? ""}${enabled ? " inline-editable" : ""}`}
      onDoubleClick={startEditing}
      onClick={enabled ? startEditing : undefined}
      style={multiline ? { whiteSpace: "pre-line" } : undefined}
    >
      {value}
    </Tag>
  );
}

export function InlineEditableImage({
  src,
  alt,
  className,
  wrapperClassName,
  badgeLabel = "Replace image",
  emptyLabel = "Upload image",
  onChange
}: InlineEditableImageProps) {
  const { enabled } = useAdminMode();

  return (
    <label
      className={`${wrapperClassName ?? ""}${enabled ? " inline-editable-image" : ""}`}
    >
      {src ? (
        <SafeImage
          className={className}
          fallbackClassName={`${className ?? ""} inline-editable-image__placeholder`}
          fallbackLabel={emptyLabel}
          src={src}
          alt={alt}
        />
      ) : (
        <div className={`${className ?? ""} inline-editable-image__placeholder`}>
          <span>{emptyLabel}</span>
        </div>
      )}
      {enabled ? (
        <>
          <span className="inline-editable-image__badge">{badgeLabel}</span>
          <input
            className="admin-hidden-input"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                onChange(file);
              }
            }}
          />
        </>
      ) : null}
    </label>
  );
}

export function InlineEditToolbar({
  dirty,
  pending = false,
  status,
  onSave
}: InlineEditToolbarProps) {
  const { enabled, lock } = useAdminMode();

  if (!enabled) {
    return null;
  }

  return (
    <div className="inline-edit-toolbar">
      <div className="inline-edit-toolbar__meta">
        <strong>Edit mode</strong>
        <span>{status || (dirty ? "Unsaved changes" : "Live page editing enabled")}</span>
      </div>
      <div className="inline-edit-toolbar__actions">
        <Link className="button-secondary" href="/admin/dashboard">
          Manage Photos
        </Link>
        <button className="button" type="button" disabled={!dirty || pending} onClick={onSave}>
          {pending ? "Saving..." : "Save"}
        </button>
        <button className="button-secondary" type="button" onClick={lock}>
          Exit Edit Mode
        </button>
      </div>
    </div>
  );
}
