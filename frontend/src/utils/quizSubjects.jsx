import {
  Atom,
  BookA,
  BookOpenText,
  BookType,
  Dna,
  Earth,
  FlaskConical,
  LibraryBig,
  Palette,
  SquareRadical,
  Swords,
  UsersRound,
} from "lucide-react";

export const subjects = [
  {
    icon: <SquareRadical color="#333" />,
    text: "Matemática",
    onClick: () => console.log("matematica"),
  },
  {
    icon: <BookOpenText color="#333" />,
    text: "Português",
    onClick: () => console.log("portugues"),
  },
  {
    icon: <Swords color="#333" />,
    text: "História",
    onClick: () => console.log("xx"),
  },
  {
    icon: <Earth color="#333" />,
    text: "Geografia",
    onClick: () => console.log("xx"),
  },
  {
    icon: <Dna color="#333" />,
    text: "Biologia",
    onClick: () => console.log("xxx"),
  },
  {
    icon: <FlaskConical color="#333" />,
    text: "Química",
    onClick: () => console.log("x"),
  },
  {
    icon: <Atom color="#333" />,
    text: "Física",
    onClick: () => console.log("xxx"),
  },
  {
    icon: <UsersRound color="#333" />,
    text: "Sociologia",
    onClick: () => console.log("xxx"),
  },
  {
    icon: <LibraryBig color="#333" />,
    text: "Filosofia",
    onClick: () => console.log("x"),
  },
  {
    icon: <BookA color="#333" />,
    text: "Inglês",
    onClick: () => console.log("matematica"),
  },
  {
    icon: <BookType color="#333" />,
    text: "Espanhol",
    onClick: () => console.log("matematica"),
  },
  {
    icon: <Palette color="#333" />,
    text: "Arte",
    onClick: () => console.log("matematica"),
  },
];
