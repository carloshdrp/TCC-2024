import { useEffect } from "react";

import { useGetLeagueQuery } from "../api/slices/profileApiSlice";
import topaz from "../assets/Leagues/topaz.png";
import ruby from "../assets/Leagues/ruby.png";
import emerald from "../assets/Leagues/emerald.png";
import ametist from "../assets/Leagues/ametist.png";
import diamond from "../assets/Leagues/diamond.png";

export default function UserLeague({ leagueSize, userId }) {
  const { data: userData, refetch, isLoading } = useGetLeagueQuery(userId);

  useEffect(() => {
    refetch();
  }, [userId, refetch]);

  const sizeToClass = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-8 w-8",
  };

  let image;
  let color;
  let content;
  if (isLoading) {
    content = <p>Carregando...</p>;
  } else if (userData) {
    switch (userData.league) {
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

    let divClass;
    if (leagueSize === "small") {
      divClass = `flex items-center gap-1 px-2  ${color} w-fit rounded-xl`;
    } else {
      divClass = `flex items-center gap-1 px-2 py-1 ${color} w-fit rounded-xl`;
    }

    content = (
      <div className={divClass}>
        <img
          src={image}
          alt={userData.league}
          className={sizeToClass[leagueSize]}
        />
        <p>{userData.league}</p>
      </div>
    );
  }
  return content;
}
