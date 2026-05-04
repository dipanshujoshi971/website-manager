import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { SiteContent } from "./content-types";
import { defaultContent } from "./default-content";

interface ContentContextValue {
  content: SiteContent;
  loading: boolean;
}

const ContentContext = createContext<ContentContextValue | null>(null);

const SITE_ID = import.meta.env.VITE_SITE_ID as string;
// In dev, VITE_API_URL can be omitted — vite.config.ts proxies /api → localhost:8787
const API_BASE = (import.meta.env.VITE_API_URL as string) || "";

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!SITE_ID) {
      console.warn("VITE_SITE_ID not set — using default content");
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/sites/${SITE_ID}/content`)
      .then((r) => r.json())
      .then((row) => {
        if (row?.content) setContent(deepMerge(defaultContent, row.content as Partial<SiteContent>));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

export function usePage<K extends keyof SiteContent>(page: K): SiteContent[K] {
  const { content } = useContent();
  return content[page];
}

function deepMerge(target: SiteContent, source: Partial<SiteContent>): SiteContent;
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T;
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (sv && typeof sv === "object" && !Array.isArray(sv) && tv && typeof tv === "object" && !Array.isArray(tv)) {
      result[key] = deepMerge(tv, sv);
    } else if (sv !== undefined) {
      result[key] = sv;
    }
  }
  return result;
}
