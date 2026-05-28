"use client";

import { motion } from "framer-motion";

const faqs = [
  {
    question: "What is Dhune.np?",
    answer: "Dhune.np is a smart laundry marketplace connecting customers with trusted laundry vendors in Nepal.",
  },
  {
    question: "How does the request and offer system work?",
    answer: "Customers create requests, vendors send offers, and customers accept the option that fits their price and timing.",
  },
  {
    question: "Can vendors register on Dhune.np?",
    answer: "Yes. Vendors can register, complete approval, receive requests, and send offers from the vendor portal.",
  },
  {
    question: "Which payment methods are supported?",
    answer: "The platform supports cash visibility and online payment flows including Khalti and eSewa where enabled.",
  },
  {
    question: "Is pickup and delivery included?",
    answer: "Vendors include pickup and delivery cost in the final offer price shown to customers.",
  },
  {
    question: "Is the mobile app available?",
    answer: "The Android app download section is prepared and the public download link will be available soon.",
  },
];

export default function FaqSection() {
  return (
    <motion.section
      id="faq"
      className="px-4 py-16 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-cyan-200">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Quick answers before getting started
          </h2>
        </div>

        <div className="mt-9 space-y-3">
          {faqs.map((faq, index) => (
            <motion.details
              key={faq.question}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition open:border-[#040947]/25 dark:border-white/10 dark:bg-white/[0.08] dark:open:border-cyan-300/30"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
              whileHover={{ y: -3 }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-extrabold text-slate-950 dark:text-white">
                <span>{faq.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg text-[#040947] transition group-open:rotate-45 dark:bg-white/10 dark:text-cyan-200">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                {faq.answer}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
