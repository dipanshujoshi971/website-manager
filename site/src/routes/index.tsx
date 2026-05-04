import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Counter, FadeUp, HoverCard, Stagger, StaggerItem, StoreBadges } from "@/components/motion/MotionPrimitives";
import { usePage } from "@/lib/content-context";
import { getIcon } from "@/lib/icon-map";
import heroImg from "@/assets/hero-app.png";
import driverImg from "@/assets/driver-24h.jpg";
import heroBg from "@/assets/hero-night-road.jpg";
import cityImg from "@/assets/city-streets.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GoNex — Ready to go? Let's GoNex." },
      { name: "description", content: "Request a ride in seconds. Safe, affordable, always on time. Download GoNex on iOS and Android." },
      { property: "og:title", content: "GoNex — Ready to go? Let's GoNex." },
      { property: "og:description", content: "Request a ride in seconds. Safe, affordable, always on time." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const page = usePage("home");
  const visible = (key: string) => (page as any).sectionsVisible?.[key] !== false;

  return (
    <SiteLayout>
      {/* Hero */}
      {visible('hero') && (
      <section className="relative -mt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={page.hero.backgroundImage || heroBg} alt="" aria-hidden="true" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.05_255/0.85)] via-[oklch(0.18_0.05_255/0.7)] to-[oklch(0.12_0.04_255/0.95)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-32 sm:px-6 sm:pb-24 sm:pt-40 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-44">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
          >
            <motion.span
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-glow" /> {page.hero.badge}
            </motion.span>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              {page.hero.title}<br />
              <span className="bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">{page.hero.titleHighlight}</span>
            </motion.h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="mt-6 max-w-xl text-lg text-white/80"
            >
              {page.hero.subtitle}
            </motion.p>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {(page.hero.ctaPrimary as any).show !== false && (
                <Link to={page.hero.ctaPrimary.link} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]">
                  {page.hero.ctaPrimary.text} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {(page.hero.ctaSecondary as any).show !== false && (
                <Link to={page.hero.ctaSecondary.link} className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-primary">
                  {page.hero.ctaSecondary.text}
                </Link>
              )}
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="mt-10 flex items-center gap-6 text-sm text-white/70"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary-glow text-primary-glow" />)}
                <span className="ml-2 font-semibold text-white">{page.hero.rating}</span>
              </div>
              <span>{page.hero.ratingText}</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-full bg-primary-glow/20 blur-3xl" />
            <motion.img
              src={page.hero.phoneImage || heroImg}
              alt="App on phone"
              className="relative mx-auto w-full max-w-lg drop-shadow-2xl"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>
      )}

      {/* Stats */}
      {visible('stats') && (
      <section className="border-y border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {page.stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="text-4xl font-bold text-foreground sm:text-5xl">
                  <Counter to={s.value} prefix={s.prefix ?? ""} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      {/* How it works */}
      {visible('howItWorks') && (
      <section className="bg-muted py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.howItWorks.title}</h2>
            <p className="mt-3 text-muted-foreground">{page.howItWorks.subtitle}</p>
          </FadeUp>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {page.howItWorks.steps.map((s, i) => {
              const Icon = getIcon(s.icon);
              return (
                <HoverCard key={i} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">Step {i + 1}</div>
                  <h3 className="mt-1 text-xl font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                </HoverCard>
              );
            })}
          </Stagger>
        </div>
      </section>
      )}

      {/* Why Us */}
      {visible('whyUs') && (
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.whyUs.title}</h2>
            <p className="mt-3 text-muted-foreground">{page.whyUs.subtitle}</p>
          </FadeUp>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {page.whyUs.features.map((f, i) => {
              const Icon = getIcon(f.icon);
              return (
                <HoverCard key={i} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </HoverCard>
              );
            })}
          </Stagger>
        </div>
      </section>
      )}

      {/* Cities */}
      {visible('cities') && (
      <section className="relative overflow-hidden">
        <img src={page.cities.backgroundImage || cityImg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.15_0.04_255/0.92)] to-[oklch(0.2_0.06_255/0.7)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeUp className="max-w-2xl text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">{page.cities.title}</h2>
            <p className="mt-4 text-white/80">{page.cities.subtitle}</p>
          </FadeUp>
          <Stagger className="mt-10 flex flex-wrap gap-2">
            {page.cities.list.map((c) => (
              <StaggerItem key={c}>
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">{c}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      {/* App download */}
      {visible('download') && (
      <section id="download" className="bg-muted py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.download.title}</h2>
            <p className="mt-4 text-muted-foreground">{page.download.subtitle}</p>
            <div className="mt-8">
              <StoreBadges />
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="relative">
            <img src={page.download.image || driverImg} alt="Available 24/7" className="mx-auto w-full max-w-lg rounded-3xl shadow-soft" loading="lazy" />
          </FadeUp>
        </div>
      </section>
      )}

      {/* Testimonials */}
      {visible('testimonials') && (
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.testimonials.title}</h2>
            <p className="mt-3 text-muted-foreground">{page.testimonials.subtitle}</p>
          </FadeUp>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {page.testimonials.items.map((t, i) => (
              <HoverCard key={i} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
                </div>
                <p className="mt-4 text-foreground">"{t.quote}"</p>
                <div className="mt-5 text-sm">
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-muted-foreground">{t.city}</div>
                </div>
              </HoverCard>
            ))}
          </Stagger>
        </div>
      </section>
      )}
    </SiteLayout>
  );
}
