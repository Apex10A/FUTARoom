export type HowItWorksStep = {
  number: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

export const HOW_IT_WORKS = {
  title: "The FUTARoom Path",
  subtitle:
    "Finding a lodge near FUTA shouldn't mean scrolling through fifty WhatsApp statuses.",
  steps: [
    {
      number: "01",
      title: "Start with your search",
      description:
        "Pick your area, set your budget, and filter by room type. Browse verified lodges around South Gate, West Gate, Ibule, and more — all in one place.",
      imageUrl:
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Map with location pin for planning where to stay",
    },
    {
      number: "02",
      title: "Compare and choose",
      description:
        "See multiple agent offers for the same lodge, check amenities, watch video tours, and pick the price that fits your budget before you reach out.",
      imageUrl:
        "https://images.unsplash.com/photo-1560448204-e02f11c45730?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Bright apartment interior for comparing accommodation options",
    },
  ] satisfies HowItWorksStep[],
} as const;
