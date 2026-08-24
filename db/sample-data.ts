interface Testimonial {
  id: number;
  name: string;
  quote: string;
  image: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mostafizur Rahman",
    quote: "Great sound and solid build quality.",
    image: "/images/testimonials/man1.webp",
  },
  {
    id: 2,
    name: "Rick Aqua",
    quote: "For the best and most affordable gadgets, Gajitto is all you need.",
    image: "/images/testimonials/man2.webp",
  },
  {
    id: 3,
    name: "Thomas Enock",
    quote: "Comfortable fit with impressive battery life.",
    image: "/images/testimonials/man3.webp",
  },
  {
    id: 4,
    name: "Fisayo Fosudo",
    quote: "For the best and most affordable gadgets, Gajitto is all you need.",
    image: "/images/testimonials/man4.webp",
  },
  {
    id: 5,
    name: "Toufik Khan",
    quote: "For the best and most affordable gadgets, Gajitto is all you need.",
    image: "/images/testimonials/man5.webp",
  },
];

export const TIMELINE: TimelineItem[] = [
  {
    year: "2024",
    title: "Exploring New Horizons for a Smarter Lifestyle",
    description:
      "We expanded into home appliances, forged global partnerships and won prestigious awards. From innovative products to cross-industry collaborations, we keep enhancing everyday experiences with quality and excellence.",
    image: "/images/about/2024.png",
  },
  {
    year: "2023",
    title: "A Year of Triumph and Innovation",
    description:
      "Our open audio products received major acclaim from global media and users. We also introduced new charging technologies tailored for multi-device users and their fast-paced lives.",
    image: "/images/about/2023.jpg",
  },
  {
    year: "2022",
    title: "Partnering with a Grammy Award-Winning Artist",
    description:
      "An international superstar joined us to co-create audio products tuned for African music, helping Gajitto become the top choice across the region.",
    image: "/images/about/2022.png",
  },
  {
    year: "2021",
    title: "Innovating with Harman and Expanding Our World",
    description:
      "We worked with Harman R&D and launched HavyBass™ sound technology to deliver an elevated African music experience, while introducing new products for gamers and creators.",
    image: "/images/about/2021.png",
  },
  {
    year: "2020",
    title: "Going Digital with the Gajitto e-Shop",
    description:
      "We launched our official e-commerce platform, making it easier than ever for users to access their favorite gadgets and gear directly from Gajitto.",
    image: "/images/about/2020.png",
  },
  {
    year: "2019",
    title: "Harmonizing Beats with Africa",
    description:
      "Collaborations with local artists and ambassadors helped us fine-tune sound for African music, expanding into new regions and new listeners.",
    image: "/images/about/2019.png",
  },
  {
    year: "2018",
    title: "Unleashing Freedom with FreePods",
    description:
      "We stepped into the true-wireless era with FreePods, giving users a completely cable-free audio experience.",
    image: "/images/about/2018.png",
  },
  {
    year: "2017",
    title: "Innovating with Insight",
    description:
      "We focused on research and local insight, designing technology and accessories that genuinely resonate with our users’ needs and aspirations.",
    image: "/images/about/2021.png",
  },
];
