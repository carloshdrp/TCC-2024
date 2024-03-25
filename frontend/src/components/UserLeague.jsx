import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import topaz from "../assets/Leagues/topaz.png";
import ruby from "../assets/Leagues/ruby.png";
import emerald from "../assets/Leagues/emerald.png";
import ametist from "../assets/Leagues/ametist.png";
import diamond from "../assets/Leagues/diamond.png";

export default function UserLeague() {
  const user = useSelector(selectCurrentUser);

  let image;
  let color;
  switch (user.league) {
    default:
      image = topaz;
      color = "bg-orange-200";
      break;
    case "Rubi":
      image = ruby;
      color = "bg-red-200";
      break;
    case "Esmeralda":
      image = emerald;
      color = "bg-green-200";
      break;
    case "Ametista":
      image = ametist;
      color = "bg-purple-200";
      break;
    case "Diamante":
      image = diamond;
      color = "bg-cyan-200";
      break;
  }

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 ${color} w-fit rounded-xl`}
    >
      <img src={image} alt={user.league} className="w-5 h-5" />
      <p>{user.league}</p>
    </div>
  );
}