export type TopicId = "math" | "history";

export type LessonContent = {
  title: string;
  type: "text" | "visual";
  intro: string;
  /** Optional image path (e.g. "/Fraction_pizza.png") shown after intro, before body */
  image?: string;
  body: string[];
  tip?: string;
};

export const LESSONS: Record<TopicId, LessonContent> = {
  math: {
    title: "What is a fraction?",
    type: "visual",
    intro: "A fraction shows how much of something you have.",
    image: "/Fraction_pizza.png",
    body: [
      "Imagine a pizza cut into 4 equal slices.",
      "If you take 1 slice, you have 1 out of 4.",
      "We write that as 1/4.",
    ],
    tip: "When you see a fraction, picture something split into that many parts (pizza, bar, or circle).",
  },
  history: {
    title: "Why did the Roman Empire fall?",
    type: "visual",
    intro: "3 Main Reasons:",
    image: "/Rome.jpeg",
    body: [
      "⚔️ Invasions – Outside tribes attacked Rome.",
      "💰 Economic problems – Money became unstable.",
      "🏛 Political chaos – Leaders changed often.",
      "In 476 AD, the Western Roman Empire fell.",
    ],
  },
};
