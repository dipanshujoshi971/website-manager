import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Counter, FadeUp, HoverCard, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives";
import { usePage } from "@/lib/content-context";
import { getIcon } from "@/lib/icon-map";
import safetyImg from "@/assets/safety-map.jpg";
import safetyShield from "@/assets/safety-shield.jpg";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety — Your safety is our priority | GoNex" },
      { name: "description", content: "Real-time GPS tracking, in-app emergency button, driver verification, and 24/7 incident support keep every GoNex ride safe." },
    ],
  }),
  component: SafetyPage,
});

function SafetyPage() {
  const page = usePage("safety");
  const visible = (key: string) => (page as any).sectionsVisible?.[key] !== false;

  return (
    <SiteLayout>
      {visible('hero') && (
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle} />
      )}

      {/* Stats */}
      {visible('stats') && (
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {page.stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="text-4xl font-bold text-foreground sm:text-5xl">
                  <Counter to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      {/* Features (rider + driver + trust — each toggleable individually) */}
      {(visible('riderFeatures') || visible('driverFeatures') || visible('trust')) && (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {(visible('riderFeatures') || visible('driverFeatures')) && (
            <div className="grid gap-10 lg:grid-cols-2">
              {visible('riderFeatures') && <SafetyCol title={page.riderFeatures.title} items={page.riderFeatures.items} />}
              {visible('driverFeatures') && <SafetyCol title={page.driverFeatures.title} items={page.driverFeatures.items} />}
            </div>
          )}

          {visible('trust') && (
            <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
              <FadeUp className="overflow-hidden rounded-3xl shadow-soft">
                <img src={page.trust.image || safetyImg} alt="Safe rides" className="w-full" loading="lazy" />
              </FadeUp>
              <FadeUp delay={0.15}>
                <h2 className="text-3xl font-bold text-foreground">{page.trust.title}</h2>
                <p className="mt-4 text-muted-foreground">{page.trust.subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {page.trust.badges.map((b) => (
                    <span key={b} className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">{b}</span>
                  ))}
                </div>
                <Link to="/help" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft">
                  Report an issue
                </Link>
              </FadeUp>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Pillars */}
      {visible('pillars') && (
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{page.pillars.title}</h2>
            <p className="mt-3 text-muted-foreground">{page.pillars.subtitle}</p>
          </FadeUp>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {page.pillars.items.map((p) => {
              const Icon = getIcon(p.icon);
              return (
                <HoverCard key={p.title} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                </HoverCard>
              );
            })}
          </Stagger>
        </div>
      </section>
      )}

      {/* Emergency */}
      {visible('emergency') && (
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground">{page.emergency.title}</h2>
            <p className="mt-4 text-muted-foreground">{page.emergency.subtitle}</p>
            <Link to="/help" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft">
              Get help now
            </Link>
          </FadeUp>
          <FadeUp delay={0.15} className="overflow-hidden rounded-3xl shadow-soft">
            <img src={page.emergency.image || safetyShield} alt="Safety features" className="w-full" loading="lazy" />
          </FadeUp>
        </div>
      </section>
      )}
    </SiteLayout>
  );
}

function SafetyCol({ title, items }: { title: string; items: { icon: string; title: string; description: string }[] }) {
  return (
    <FadeUp>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <Stagger className="mt-6 space-y-4" stagger={0.06}>
        {items.map((it) => {
          const Icon = getIcon(it.icon);
          return (
            <StaggerItem key={it.title}>
              <HoverCard className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{it.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{it.description}</div>
                </div>
              </HoverCard>
            </StaggerItem>
          );
        })}
      </Stagger>
    </FadeUp>
  );
}
