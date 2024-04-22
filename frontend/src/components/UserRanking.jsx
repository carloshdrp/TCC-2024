import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { useGetRankingQuery } from "../api/slices/profileApiSlice";

export default function UserRanking() {
  const user = useSelector(selectCurrentUser);
  const { data: ranking, isLoading } = useGetRankingQuery(user.id);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <p className="text-lg">
        <span className="font-black text-primary">#{ranking.ranking}</span>
        Posição
      </p>
    </div>
  );
}
