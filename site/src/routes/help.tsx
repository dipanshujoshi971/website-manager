import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { FadeUp, HoverCard, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives";
import { usePage } from "@/lib/content-context";
import { getIcon } from "@/lib/icon-map";
import supportImg from "@/assets/support.jpg";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & FAQ — We're here to help | GoNex" },
      { name: "description", content: "Get answers to common questions about riding and driving with GoNex. 24/7 support whenever you need it." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const page = usePage("help");

  return (
    <SiteLayout>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} subtitle={page.hero.subtitle} />

      {/* Contact channels */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid gap-6 md:grid-cols-3">
            {page.channels.map((c) => {
              const Icon = getIcon(c.icon);
              return (
                <HoverCard key={c.title} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                </HoverCard>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <FaqColumn title="Riders FAQ" items={page.riderFaqs} />
            <FaqColumn title="Drivers FAQ" items={page.driverFaqs} />
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FadeUp className="overflow-hidden rounded-3xl shadow-soft">
            <img src={page.support.image || supportImg} alt="Support" className="h-full w-full object-cover" loading="lazy" />
          </FadeUp>
          <FadeUp delay={0.15}>
            <h2 className="text-3xl font-bold text-foreground">{page.support.title}</h2>
            <p className="mt-4 text-muted-foreground">{page.support.subtitle}</p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft">
              Contact us
            </Link>
          </FadeUp>
        </div>
      </section>
    </SiteLayout>
  );
}

function FaqColumn({ title, items }: { title: string; items: { question: string; answer: string }[] }) {
  return (
    <FadeUp>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <Stagger className="mt-6 space-y-3" stagger={0.05}>
        {items.map((it, i) => (
          <StaggerItem key={i}>
            <FaqItem q={it.question} a={it.answer} />
          </StaggerItem>
        ))}
      </Stagger>
    </FadeUp>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-semibold text-foreground">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
