import React, { useState } from "react";
import { useCms } from "./CmsContext";

export function EditableText({
  page,
  section,
  field,
  as: Component = "span",
  className = "",
  style,
  children,
}: {
  page: string;
  section: string;
  field: string;
  as?: any;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const { isAdminMode, content, updateSectionField } = useCms();
  const value = content[page]?.[section]?.[field] ?? children;

  if (!isAdminMode) {
    return <Component className={className} style={style}>{value}</Component>;
  }

  return (
    <Component
      className={`${className} relative group outline-none rounded transition-all duration-200 hover:ring-2 hover:ring-[#fe9201]/70 hover:bg-[#fe9201]/10 px-1`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.innerText;
        updateSectionField(page, section, field, text);
      }}
    >
      {value}
    </Component>
  );
}

export function EditableImage({
  page,
  section,
  field,
  alt = "",
  className = "",
  fallbackSrc,
}: {
  page: string;
  section: string;
  field: string;
  alt?: string;
  className?: string;
  fallbackSrc: string;
}) {
  const { isAdminMode, content, updateSectionField, openAssetPicker } = useCms();
  const currentSrc = content[page]?.[section]?.[field] || fallbackSrc;

  if (!isAdminMode) {
    return <img src={currentSrc} alt={alt} className={className} />;
  }

  return (
    <div className="relative group overflow-hidden inline-block w-full h-full">
      <img src={currentSrc} alt={alt} className={`${className} transition-all duration-200 group-hover:brightness-75`} />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity z-10">
        <button
          type="button"
          onClick={() => {
            openAssetPicker((selectedUrl) => {
              updateSectionField(page, section, field, selectedUrl);
            });
          }}
          className="bg-[#fe9201] text-[#080300] text-xs font-extrabold uppercase px-3 py-2 rounded shadow hover:bg-white transition-colors"
        >
          Replace Image
        </button>
        <span className="text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded">
          {section} • {field}
        </span>
      </div>
    </div>
  );
}
