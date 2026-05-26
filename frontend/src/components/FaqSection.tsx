import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does Dhune work?",
    answer:
      "Users create a laundry request in the mobile app, vendors send offers, users compare and accept one, and the accepted offer becomes a trackable order.",
  },
  {
    question: "Can users compare vendor offers?",
    answer:
      "Users receive offers from multiple verified vendors, then compare price, turnaround date, and service notes before confirming the best fit.",
  },
  {
    question: "Can businesses use Dhune?",
    answer:
      "Yes. Business users use the same core laundry features as normal users. The difference is only in registration, where business details and documents may be required.",
  },
  {
    question: "How do payments work?",
    answer:
      "Dhune supports cash and online payment records for orders. Khalti and cash support are part of the flow, and eSewa can be added as a coming payment option when enabled.",
  },
  {
    question: "What happens after a user accepts an offer?",
    answer:
      "The accepted offer becomes an active order. From there, pickup, cleaning progress, and delivery can be tracked in a structured workflow.",
  },
  {
    question: "How can users get support?",
    answer:
      "Users can use help and support flows in the app. Admins can manage disputes and support cases when an order needs review.",
  },
];

export default function FaqSection() {
  return (
    <section id="help-faq" className="section-reveal mx-4 my-10 rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-10 shadow-sm dark:border-white/10 dark:bg-[#1d1d1a]/85 sm:mx-5 sm:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-bold tracking-wide text-[#040947] dark:text-[#ebbc01]">/ Help Section</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            FAQ and quick help for first-time users
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-[#F7F5EE]/70 sm:text-base">
            Practical answers for users, vendors, and businesses before they start using Dhune.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#fff7d6] px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-[#ebbc01]/15 dark:text-[#ebbc01]">
            <HelpCircle className="h-5 w-5 text-[#8a6d00]" />
            Support: support@dhune.np
          </div>
        </div>

        <div className="w-full max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition open:border-[#040947]/20 open:shadow-md dark:border-white/10 dark:bg-[#242420] dark:open:border-[#ebbc01]/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-slate-900 dark:text-white">
                <span>{faq.question}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#040947] text-xl text-white transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 pr-0 text-sm leading-7 text-slate-600 dark:text-[#F7F5EE]/65 sm:pr-12">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
