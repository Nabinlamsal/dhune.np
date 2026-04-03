import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does Dhune.np choose the best laundry option for users?",
    answer:
      "Users receive offers from multiple verified vendors, then compare price, turnaround date, and service notes before confirming the best fit.",
  },
  {
    question: "Can businesses use the platform for bulk or recurring laundry?",
    answer:
      "Yes. Dhune.np is designed for households and organizations, so businesses can use the same request-and-offer flow for larger or repeat laundry needs.",
  },
  {
    question: "What happens after a user accepts an offer?",
    answer:
      "The accepted offer becomes an active order. From there, pickup, cleaning progress, and delivery can be tracked in a structured workflow.",
  },
  {
    question: "Why is this better than contacting vendors one by one?",
    answer:
      "The platform removes manual back-and-forth by collecting offers in one place, making comparison faster and the final decision more transparent.",
  },
];

export default function FaqSection() {
  return (
    <section className="mx-5 my-10 rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-10 shadow-sm sm:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-bold tracking-wide text-[#040947]">/ Help Section</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            FAQ and quick help for first-time users
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            A few direct answers are enough here. This keeps the landing page clear
            while addressing the core questions users and vendors usually ask first.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#fff7d6] px-4 py-3 text-sm font-semibold text-slate-700">
            <HelpCircle className="h-5 w-5 text-[#8a6d00]" />
            Clear process, fewer support questions.
          </div>
        </div>

        <div className="w-full max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-[#040947]/20 open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-slate-900">
                <span>{faq.question}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#040947] text-xl text-white transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 pr-12 text-sm leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
