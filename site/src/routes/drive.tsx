import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Counter, FadeUp, HoverCard, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives";
import { usePage } from "@/lib/content-context";
import { getIcon } from "@/lib/icon-map";
import { DownloadCta } from "./ride";
import earningsImg from "@/assets/earnings.png";
import driverPortrait from "@/assets/driver-portrait.jpg";

export const Route = createFileRoute("/drive")({
  head: () => ({
    meta: [
      { title: "Drive with GoNex — Earn on your terms" },
      { name: "description", content: "Drive with GoNex. Flexible hours, weekly payouts, and full support. Start earning on your schedule." },
    ],
  }),
  component: DrivePage,
});

function DrivePage() {
  const page = usePage("drive");

  return (
    <SiteLayout>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle}>
        <a href="#start" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft">
          Start Earning <ArrowRight className="h-4 w-4" />
        </a>
      </PageHero>

      {/* Stats */}
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

      {/* Featured */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FadeUp className="overflow-hidden rounded-3xl shadow-soft">
            <img src={page.featured.image || driverPortrait} alt="Driver" className="h-full w-full object-cover" loading="lazy" />
          </FadeUp>
          <FadeUp delay={0.15}>
            <h2 className="text-3xl font-bold text-foreground">{page.featured.title}</h2>
            <p className="mt-4 text-muted-foreground">{page.featured.subtitle}</p>
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-2" stagger={0.08}>
              {page.featured.features.map((f) => {
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

      {/* Benefits */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground">{page.benefits.title}</h2>
          </FadeUp>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {page.benefits.items.map((b) => {
              const Icon = getIcon(b.icon);
              return (
                <HoverCard key={b.title} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
                </HoverCard>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground">{page.requirements.title}</h2>
            <p className="mt-3 text-muted-foreground">{page.requirements.subtitle}</p>
            <Stagger className="mt-8 space-y-4" stagger={0.06}>
              {page.requirements.items.map((req, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground">{req}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <a id="start" href="#download" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft">
              Start Earning <ArrowRight className="h-4 w-4" />
            </a>
          </FadeUp>
          <FadeUp delay={0.15}>
            <img src={page.requirements.image || earningsImg} alt="Earnings" className="mx-auto w-full max-w-md rounded-2xl shadow-soft" loading="lazy" />
          </FadeUp>
        </div>
      </section>

      {/* Earnings */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground">{page.earnings.title}</h2>
            <p className="mt-3 text-muted-foreground">{page.earnings.subtitle}</p>
          </FadeUp>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {page.earnings.tiers.map((e) => (
              <HoverCard key={e.hours} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="text-sm font-semibold uppercase tracking-wider text-primary">{e.hours}</div>
                <div className="mt-3 text-4xl font-bold text-foreground">{e.min}<span className="text-2xl text-muted-foreground"> – {e.max}</span></div>
                <p className="mt-2 text-sm text-muted-foreground">Estimated weekly earnings range.</p>
              </HoverCard>
            ))}
          </Stagger>
        </div>
      </section>

      <DownloadCta />
    </SiteLayout>
  );
}
