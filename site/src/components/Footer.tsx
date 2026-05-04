import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Linkedin, Facebook, Youtube } from "lucide-react";
import { usePage } from "@/lib/content-context";
import { StoreBadges } from "./motion/MotionPrimitives";
import logo from "@/assets/gonex-logo.png";

const socialIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
};

export function Footer() {
  const global = usePage("global");

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img src={global.logo || logo} alt={global.siteName} className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-foreground">{global.siteName}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">{global.footer.description}</p>
            <div className="mt-5 flex gap-3">
              {global.footer.socials.map((s, i) => {
                const Icon = socialIcons[s.platform] || Instagram;
                return (
                  <a key={i} href={s.url} aria-label={s.platform} className="rounded-full border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {global.footer.columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-2">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-foreground">Get the {global.siteName} app</p>
          <StoreBadges />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>{global.footer.copyright}</p>
          <p>
            <Link to="/about" className="hover:text-foreground">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
