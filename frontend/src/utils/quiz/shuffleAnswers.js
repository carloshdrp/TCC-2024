function shuffleAnswers(question) {
  const answers = [
    { text: question.correct, isCorrect: "correct" },
    { text: question.wrong1, isCorrect: "wrong1" },
    { text: question.wrong2, isCorrect: "wrong2" },
    { text: question.wrong3, isCorrect: "wrong3" },
    { text: question.wrong4, isCorrect: "wrong4" },
  ];

  // Embaralha o array
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  return answers;
}

export default shuffleAnswers;
