/**
 * Generate age-appropriate welcome message for Matti
 */
export function generateWelcomeMessage(name: string, age: number): string {
  // Age-appropriate greetings
  const greetings12_14 = [
    `Hoi ${name}, chill dat je er bent! 😊`,
    `Hey ${name}, leuk dat je er bent! ✨`,
    `Yo ${name}, wat fijn dat je er bent! 👋`,
  ];

  const greetings15_17 = [
    `Hey ${name}, goed je te zien!`,
    `Hoi ${name}, chill dat je er bent! 😊`,
    `Yo ${name}, wat leuk dat je er bent!`,
  ];

  const greetings18_21 = [
    `Hoi ${name}, welkom!`,
    `Hey ${name}, fijn dat je er bent!`,
    `Hallo ${name}, goed je te zien!`,
  ];

  // Age-appropriate follow-up questions
  const questions12_14 = [
    "Waar wil je het over hebben?",
    "Wat kan ik voor je doen?",
    "Waar kan ik je mee helpen?",
  ];

  const questions15_17 = [
    "Waar kan ik je mee helpen?",
    "Wat houdt je bezig?",
    "Waar wil je over praten?",
  ];

  const questions18_21 = [
    "Vertel, wat houdt je bezig?",
    "Waar kan ik je mee helpen?",
    "Wat wil je bespreken?",
  ];

  // Select appropriate arrays based on age
  let greetings: string[];
  let questions: string[];

  if (age >= 12 && age <= 14) {
    greetings = greetings12_14;
    questions = questions12_14;
  } else if (age >= 15 && age <= 17) {
    greetings = greetings15_17;
    questions = questions15_17;
  } else {
    // 18-21 or fallback
    greetings = greetings18_21;
    questions = questions18_21;
  }

  // Random selection
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  const question = questions[Math.floor(Math.random() * questions.length)];

  return `${greeting}\n\n${question}`;
}
