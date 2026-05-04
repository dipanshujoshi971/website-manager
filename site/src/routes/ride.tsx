import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Car } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Counter, FadeUp, HoverCard, Stagger, StaggerItem, StoreBadges } from "@/components/motion/MotionPrimitives";
import { usePage } from "@/lib/content-context";
import { getIcon } from "@/lib/icon-map";
import rideImg from "@/assets/ride-illustration.png";
import riderHappy from "@/assets/rider-happy.jpg";

export const Route = createFileRoute("/ride")({
  head: () => ({
    meta: [
      { title: "Ride with GoNex — Your ride, on demand" },
      { name: "description", content: "Book a ride in seconds with GoNex. Choose Go, XL, or Premium with upfront pricing and real-time tracking." },
    ],
  }),
  component: RidePage,
});

function RidePage() {
  const page = usePage("ride");
  const visible = (key: string) => (page as any).sectionsVisible?.[key] !== false;

  return (
    <SiteLayout>
      {visible('hero') && (
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-wrap gap-3">
            <a href="#categories" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft">
              See ride options
            </a>
            <a href="#download" className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground">
              Download the app
            </a>
          </div>
          <img src={page.hero.image || rideImg} alt="Booking a ride" className="mx-auto w-full max-w-md rounded-2xl" />
        </div>
      </PageHero>
      )}

      {/* Stats */}
      {visible('stats') && (
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {page.stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="text-4xl font-bold text-foreground sm:text-5xl">
                  <Counter to={s.value} prefix={s.prefix ?? ""} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      {/* Steps */}
      {visible('steps') && (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground">{page.steps.title}</h2>
            <p className="mt-3 text-muted-foreground">{page.steps.subtitle}</p>
          </FadeUp>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-4">
            {page.steps.items.map((s, i) => {
              const Icon = getIcon(s.icon);
              return (
                <HoverCard key={i} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-xs font-semibold text-primary">0{i + 1}</div>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>
                </HoverCard>
              );
            })}
          </Stagger>
        </div>
      </section>
      )}

      {/* Fare estimate */}
      {visible('pricing') && (
      <section className="bg-muted py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground">{page.pricing.title}</h2>
            <p className="mt-4 text-muted-foreground">{page.pricing.subtitle}</p>
            <ul className="mt-6 space-y-3">
              {page.pricing.features.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
              <div className="text-sm text-muted-foreground">Estimated fare</div>
              <div className="mt-2 text-5xl font-bold text-foreground">{page.pricing.estimate.total}</div>
              <div className="mt-1 text-sm text-muted-foreground">{page.pricing.estimate.distance}</div>
              <div className="mt-6 space-y-2 text-sm">
                {page.pricing.estimate.breakdown.map((r, i) => (
                  <div key={i} className="flex justify-between text-foreground">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="font-medium">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">{page.pricing.estimate.disclaimer}</div>
            </div>
          </FadeUp>
        </div>
      </section>
      )}

      {/* Lifestyle */}
      {visible('lifestyle') && (
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FadeUp className="overflow-hidden rounded-3xl">
            <img src={page.lifestyle.image || riderHappy} alt="A happy rider" className="h-full w-full object-cover" loading="lazy" />
          </FadeUp>
          <FadeUp delay={0.15}>
            <h2 className="text-3xl font-bold text-foreground">{page.lifestyle.title}</h2>
            <p className="mt-4 text-muted-foreground">{page.lifestyle.subtitle}</p>
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-2" stagger={0.08}>
              {page.lifestyle.features.map((f) => {
                const Icon = getIcon(f.icon);
                return (
                  <HoverCard key={f.title} className="rounded-xl border border-border bg-card p-5">
                    <Icon className="h-5 w-5 text-primary" />
                    <div className="mt-3 font-semibold text-foreground">{f.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{f.description}</div>
                  </HoverCard>
                );
              })}
            </Stagger>
          </FadeUp>
        </div>
      </section>
      )}

      {/* Categories */}
      {visible('categories') && (
      <section id="categories" className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground">{page.categories.title}</h2>
            <p className="mt-3 text-muted-foreground">{page.categories.subtitle}</p>
          </FadeUp>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {page.categories.items.map((c) => (
              <HoverCard key={c.name} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-5 text-sm font-semibold text-primary">{c.price}</div>
              </HoverCard>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      <DownloadCta />
    </SiteLayout>
  );
}

export function DownloadCta() {
  return (
    <section id="download" className="bg-card py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <FadeUp>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Get the app on your phone</h2>
          <p className="mt-3 text-muted-foreground">Available on iOS and Android. Take your first ride in minutes.</p>
          <div className="mt-8">
            <StoreBadges align="center" />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
