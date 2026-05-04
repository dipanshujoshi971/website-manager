import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { SiteContent } from "./content-types";
import { defaultContent } from "./default-content";

interface ContentContextValue {
  content: SiteContent;
  loading: boolean;
}

const ContentContext = createContext<ContentContextValue | null>(null);

// siteId resolution priority (highest → lowest):
//   1. ?siteId=... query param      — used by the builder's preview iframe
//   2. VITE_SITE_ID env             — dev override on localhost
//   3. /api/sites/resolve?host=...  — production: hostname → siteId lookup
const DEV_SITE_ID = import.meta.env.VITE_SITE_ID as string | undefined;
// In dev, VITE_API_URL can be omitted — vite.config.ts proxies /api → localhost:8787
const API_BASE = (import.meta.env.VITE_API_URL as string) || "";

async function resolveSiteId(): Promise<string | null> {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("siteId");
  if (fromQuery) return fromQuery;
  if (DEV_SITE_ID) return DEV_SITE_ID;
  const host = window.location.hostname;
  const res = await fetch(`${API_BASE}/api/sites/resolve?host=${encodeURIComponent(host)}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { siteId?: string };
  return data.siteId ?? null;
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const siteId = await resolveSiteId();
      if (cancelled) return;
      if (!siteId) {
        console.warn(`No siteId resolved for host "${window.location.hostname}" — using default content`);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/sites/${siteId}/content`);
        const row = await res.json();
        if (!cancelled && row?.content) {
          setContent(deepMerge(defaultContent, row.content as Partial<SiteContent>));
        }
      } catch {
        // fall through to default content
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Live preview: when iframed by the builder, listen for unsaved-draft content
  // pushed via postMessage and render it instantly. We also announce readiness so
  // the builder can push the latest draft right after the iframe loads.
  useEffect(() => {
    if (window.parent === window) return;
    const handler = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "preview:content" && msg.content) {
        setContent(deepMerge(defaultContent, msg.content as Partial<SiteContent>));
        setLoading(false);
      }
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "preview:ready" }, "*");
    return () => window.removeEventListener("message", handler);
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
