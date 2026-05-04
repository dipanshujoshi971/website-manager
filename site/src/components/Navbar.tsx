import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { usePage } from "@/lib/content-context";
import logo from "@/assets/gonex-logo.png";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const global = usePage("global");

  const navLinks = global.navbar.links;
  const darkHeroRoutes = ["/"];
  const hasDarkHero = darkHeroRoutes.includes(pathname);
  const onDark = hasDarkHero && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        onDark
          ? "bg-transparent"
          : "bg-background/85 backdrop-blur-md " +
            (scrolled ? "shadow-card border-b border-border" : "")
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src={global.logo || logo} alt={global.siteName} className="h-9 w-9 object-contain" />
          <span className={`text-lg font-bold tracking-tight ${onDark ? "text-white" : "text-foreground"}`}>
            {global.siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                onDark
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              activeProps={{
                className: `rounded-full px-4 py-2 text-sm font-semibold ${
                  onDark ? "text-white bg-white/15" : "text-foreground bg-muted"
                }`,
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href={global.navbar.ctaLink}
            className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold shadow-soft transition-transform hover:scale-[1.02] ${
              onDark ? "bg-white text-primary" : "bg-primary text-primary-foreground"
            }`}
          >
            {global.navbar.ctaText}
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center justify-center rounded-md p-2 md:hidden ${onDark ? "text-white" : "text-foreground"}`}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={global.navbar.ctaLink}
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
            >
              {global.navbar.ctaText}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
