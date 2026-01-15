import React from "react";

const modeContent = {
  combined: {
    title: "Optimize Your Shipments",
    description:
      "Combined shipments help optimize routes and reduce costs. Review add-ons on the right to fine-tune your plan.",
    tag: "Optimized multi-leg planning",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M3 9l2-3h14l2 3M3 9v12h18V9M16 21v-4M8 21v-4" />
      </svg>
    ),
  },
  sea: {
    title: "Sea Freight Tips",
    description:
      "Manage your shipments via sea efficiently. Track containers and optimize your cargo routes with ease.",
    tag: "Maritime shipment insights",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12l2-2 2 2v8h12v-8l2-2 2 2" />
      </svg>
    ),
  },
  rail: {
    title: "Rail Shipping Guidance",
    description:
      "Optimize your rail shipments with scheduling and routing insights. Ensure timely delivery across tracks.",
    tag: "Track-based efficiency",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3zm2 16h14M6 9h12" />
      </svg>
    ),
  },
  road: {
    title: "Road Transport Tips",
    description:
      "Efficient road shipments save time and cost. Plan your routes and monitor deliveries effectively.",
    tag: "Highway logistics",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h18v8H3v-8zm2-6h14l-2 6H5l-2-6z" />
      </svg>
    ),
  },
  air: {
    title: "Air Freight Tips",
    description:
      "Air shipments are fast and reliable. Keep track of packages and optimize your air cargo for speed.",
    tag: "Fastest delivery",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 19l19-7-19-7v5l12 2-12 2v5z" />
      </svg>
    ),
  },
  ecommerce: {
    title: "E-commerce Shipments",
    description:
      "Maximize your online order deliveries. Track orders, handle returns, and ensure a smooth customer experience.",
    tag: "Online order optimization",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 6l3 12h12l3-12H3zm4 6h10" />
      </svg>
    ),
  },
};

export default function LeftColumnBanner({ mode }) {
  const content = modeContent[mode] || modeContent.combined;

  return (
    <div className="relative overflow-hidden rounded-lg border border-border p-[1px]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-emerald-500/10" />
      <div className="relative rounded-[0.6rem] bg-card/80 backdrop-blur-sm min-h-[12rem] p-5 flex items-center justify-center text-center">
        <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-indigo-400/25 to-transparent blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-tr from-emerald-400/25 to-transparent blur-3xl animate-pulse" />

        <div className="relative space-y-2">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-sm">
            {content.icon}
          </div>
          <div className="text-sm font-semibold tracking-tight text-foreground">{content.title}</div>
          <div className="text-xs leading-relaxed text-muted-foreground">{content.description}</div>
          <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-[11px] text-muted-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <span>{content.tag}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
