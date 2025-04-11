
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export const quizQuestions: Question[] = [
  {
    id: 1,
    text: "Which of the following is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Object"],
    correctAnswer: 2
  },
  {
    id: 2,
    text: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets", 
      "Creative Style System", 
      "Computer Style Sheets", 
      "Colorful Style Sheets"
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    text: "Which HTML tag is used to define an internal style sheet?",
    options: ["<script>", "<css>", "<style>", "<link>"],
    correctAnswer: 2
  },
  {
    id: 4,
    text: "In React, what is used to pass data to a component from outside?",
    options: ["setState", "render", "props", "elements"],
    correctAnswer: 2
  },
  {
    id: 5,
    text: "Which of the following companies developed TypeScript?",
    options: ["Google", "Microsoft", "Facebook", "Apple"],
    correctAnswer: 1
  },
  {
    id: 6,
    text: "What is the correct way to declare a variable in JavaScript?",
    options: ["var name;", "variable name;", "v name;", "int name;"],
    correctAnswer: 0
  },
  {
    id: 7,
    text: "Which CSS property is used to change the text color of an element?",
    options: ["text-color", "color", "font-color", "text-style"],
    correctAnswer: 1
  },
  {
    id: 8,
    text: "Which HTML attribute is used to define inline styles?",
    options: ["class", "styles", "style", "font"],
    correctAnswer: 2
  },
  {
    id: 9,
    text: "What does API stand for?",
    options: [
      "Application Programming Interface", 
      "Application Process Integration", 
      "Automated Programming Interface", 
      "Application Protocol Interface"
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    text: "Which of the following is not a front-end framework?",
    options: ["React", "Angular", "Vue", "Express"],
    correctAnswer: 3
  }
];
