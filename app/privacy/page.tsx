import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-3xl px-5 py-16 text-white sm:px-8">
      <p className="text-xs uppercase tracking-[.18em] text-violet-200/70">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold">Privacy</h1>
      <p className="mt-6 text-sm leading-7 text-white/60">
        Theme Studio stores the account details you provide and the design themes you choose to save so they can appear in your private workspace. Passwords are stored as salted hashes; session tokens are held in secure, HTTP-only cookies. We do not sell personal information. You may request account or data deletion from the service operator.
      </p>
      <p className="mt-4 text-xs text-white/35">This project privacy notice is a starting point and should be reviewed for your deployment and jurisdiction.</p>
    </main>
  );
}
