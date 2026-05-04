import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { ContactForm } from "@/components/ContactForm";
import { Counter, FadeUp, HoverCard, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives";
import { usePage } from "@/lib/content-context";
import { getIcon } from "@/lib/icon-map";
import teamImg from "@/assets/team.jpg";
import cityImg from "@/assets/city-streets.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About GoNex — Moving people forward" },
      { name: "description", content: "GoNex is on a mission to make safe, affordable rides available to everyone. Learn our story and get in touch." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const page = usePage("about");
  const visible = (key: string) => (page as any).sectionsVisible?.[key] !== false;

  return (
    <SiteLayout>
      {visible('hero') && (
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle} />
      )}

      {/* Mission */}
      {visible('mission') && (
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{page.mission.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{page.mission.body}</p>
          </FadeUp>
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
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      {/* Team */}
      {visible('team') && (
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FadeUp className="overflow-hidden rounded-3xl shadow-soft">
            <img src={page.team.image || teamImg} alt="Team" className="h-full w-full object-cover" loading="lazy" />
          </FadeUp>
          <FadeUp delay={0.15}>
            <h2 className="text-3xl font-bold text-foreground">{page.team.title}</h2>
            <p className="mt-4 text-muted-foreground">{page.team.body}</p>
            <p className="mt-4 text-muted-foreground">{page.team.body2}</p>
          </FadeUp>
        </div>
      </section>
      )}

      {/* Values */}
      {visible('values') && (
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground">{page.values.title}</h2>
          </FadeUp>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {page.values.items.map((v) => {
              const Icon = getIcon(v.icon);
              return (
                <HoverCard key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                </HoverCard>
              );
            })}
          </Stagger>
        </div>
      </section>
      )}

      {/* Timeline */}
      {visible('timeline') && (
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground">{page.timeline.title}</h2>
          </FadeUp>
          <Stagger className="mt-12 space-y-8 border-l-2 border-primary/20 pl-8">
            {page.timeline.items.map((t) => (
              <StaggerItem key={t.year}>
                <div className="relative">
                  <span className="absolute -left-[37px] flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                  <div className="text-sm font-semibold uppercase tracking-wider text-primary">{t.year}</div>
                  <div className="mt-1 text-xl font-semibold text-foreground">{t.title}</div>
                  <p className="mt-2 text-muted-foreground">{t.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      {/* City banner */}
      {visible('cityBanner') && (
      <section className="relative overflow-hidden">
        <img src={page.cityBanner.image || cityImg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.15_0.04_255/0.92)] to-[oklch(0.2_0.06_255/0.55)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeUp className="max-w-2xl text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">{page.cityBanner.title}</h2>
            <p className="mt-4 text-white/80">{page.cityBanner.subtitle}</p>
          </FadeUp>
        </div>
      </section>
      )}

      {/* Contact */}
      {visible('contact') && (
      <section id="contact" className="bg-muted py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{page.contact.title}</h2>
            <p className="mt-4 text-muted-foreground">{page.contact.subtitle}</p>
            <div className="mt-8 space-y-4 text-sm">
              {page.contact.emails.map((e, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-28 shrink-0 text-muted-foreground">{e.label}</span>
                  <span className="font-medium text-foreground">{e.email}</span>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <ContactForm />
          </FadeUp>
        </div>
      </section>
      )}
    </SiteLayout>
  );
}
