import { Link } from "react-router-dom";
import { useGetUserAchievementQuery } from "../../api/slices/achievementApiSlice.js";
import { API_AVATAR } from "../../config/index.js";

export const ForumAchievements = ({ userId }) => {
  const { data, error, isLoading } = useGetUserAchievementQuery(userId, {
    skip: !userId,
  });

  if (isLoading) {
    return <p>Carregando conquistas...</p>;
  }

  if (error) {
    return <p>Erro ao carregar conquistas</p>;
  }

  const lockedAchievements = data?.locked.slice(0, 3);

  const renderAchievement = (achievement) => (
    <div
      key={achievement.id}
      className="flex gap-2 h-fit items-center hover:bg-background rounded"
    >
      <img
        src={API_AVATAR + achievement.imagePath}
        alt={achievement.title}
        className="w-[70px] h-[70px] rounded-[5px] opacity-50"
        style={{
          filter: "grayscale(100%)",
        }}
      />
      <div className="flex flex-col opacity-50">
        <p className="text-xl font-medium">{achievement.title}</p>
        <p>{achievement.description}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white w-full h-fit p-[10px] rounded-[10px] flex flex-col gap-[10px]">
      <div className="flex items-center justify-between text-text">
        <p className="text-3xl font-medium mb-[10px]">Missões pendentes</p>
        <Link to="/profile/#conquistas" className="text-text">
          Ver todas
        </Link>
      </div>

      {lockedAchievements?.length > 0 ? (
        lockedAchievements.map((achievement) => renderAchievement(achievement))
      ) : (
        <p className="text-center text-lg font-medium text-text">
          Parabéns! Você já desbloqueou todas as conquistas!
        </p>
      )}
    </div>
  );
};
