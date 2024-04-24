const normalizedSubjects = {
  MATEMATICA: "Matemática",
  PORTUGUES: "Português",
  HISTORIA: "História",
  GEOGRAFIA: "Geografia",
  BIOLOGIA: "Biologia",
  QUIMICA: "Química",
  FISICA: "Física",
  SOCIOLOGIA: "Sociologia",
  FILOSOFIA: "Filosofia",
  INGLES: "Inglês",
  ESPANHOL: "Espanhol",
  ARTE: "Arte",
  EDUCACAO_FISICA: "Educação Física",
};

export function normalizeSubject(subject) {
  return normalizedSubjects[subject];
}
