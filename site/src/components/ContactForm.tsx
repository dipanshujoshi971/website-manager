import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const SITE_ID = import.meta.env.VITE_SITE_ID as string;
const API_BASE = import.meta.env.VITE_API_URL as string;

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.enum([
    "General Inquiry",
    "Partnership",
    "Driver Support",
    "Rider Support",
    "Press",
  ]),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const subjects = [
  "General Inquiry",
  "Partnership",
  "Driver Support",
  "Rider Support",
  "Press",
] as const;

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      full_name: String(fd.get("full_name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: String(fd.get("subject") ?? "General Inquiry"),
      message: String(fd.get("message") ?? ""),
    };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: SITE_ID,
          fullName: parsed.data.full_name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          subject: parsed.data.subject,
          message: parsed.data.message,
        }),
      });
      if (!res.ok) throw new Error("Server error");
    } catch {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setLoading(false);
    toast.success("Thanks for reaching out! We'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" required>
          <input name="full_name" required maxLength={100} className={inputCls} placeholder="Jane Doe" />
        </Field>
        <Field label="Email Address" required>
          <input type="email" name="email" required maxLength={255} className={inputCls} placeholder="you@example.com" />
        </Field>
        <Field label="Phone Number">
          <input name="phone" maxLength={30} className={inputCls} placeholder="Optional" />
        </Field>
        <Field label="Subject" required>
          <select name="subject" required defaultValue="General Inquiry" className={inputCls}>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Message" required>
        <textarea name="message" required rows={5} maxLength={2000} className={inputCls} placeholder="How can we help?" />
      </Field>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}{required && <span className="ml-1 text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}
