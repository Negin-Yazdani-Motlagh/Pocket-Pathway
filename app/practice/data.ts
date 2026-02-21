export type TopicId = "math" | "history";

type Question = {
  id: string;
  question: string;
  options: { value: string; label: string; correct: boolean }[];
};

export const PRACTICE_BY_TOPIC: Record<TopicId, Question[]> = {
  math: [
    {
      id: "m1",
      question: "A bar is divided into 5 equal parts. 2 parts are shaded. What fraction is shaded?",
      options: [
        { value: "2/5", label: "2/5", correct: true },
        { value: "5/2", label: "5/2", correct: false },
        { value: "3/5", label: "3/5", correct: false },
      ],
    },
    {
      id: "m2",
      question: "What does 3/4 mean?",
      options: [
        { value: "3 out of 4", label: "3 out of 4 equal parts", correct: true },
        { value: "4 out of 3", label: "4 out of 3 parts", correct: false },
        { value: "3 plus 4", label: "3 plus 4", correct: false },
      ],
    },
  ],
  history: [
    {
      id: "h1",
      question: "One major reason Rome fell was:",
      options: [
        { value: "Too many libraries", label: "A) Too many libraries", correct: false },
        { value: "Economic problems", label: "B) Economic problems", correct: true },
        { value: "Too much peace", label: "C) Too much peace", correct: false },
        { value: "No army", label: "D) No army", correct: false },
      ],
    },
    {
      id: "h2",
      question: "In what year did the Western Roman Empire fall?",
      options: [
        { value: "1450", label: "A) 1450", correct: false },
        { value: "1776", label: "B) 1776", correct: false },
        { value: "476 AD", label: "C) 476 AD", correct: true },
        { value: "2024", label: "D) 2024", correct: false },
      ],
    },
  ],
};
