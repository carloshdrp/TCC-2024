import { Card, Spin } from "antd";
import { useGetUserAchievementQuery } from "../../api/slices/achievementApiSlice.js";
import { API_AVATAR } from "../../config/index.js";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect } from "react";

const { Meta } = Card;

const Achievements = ({ userId }) => {
  const { data, error, isLoading, refetch } =
    useGetUserAchievementQuery(userId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <Spin tip="Carregando dados..." className="bg-white rounded-lg">
        <div className="h-20 " />
      </Spin>
    );
  }

  if (error) {
    return <p>Ocorreu um erro ao carregar as conquistas</p>;
  }

  const renderAchievements = (achievements) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            cover={
              <img
                alt="icon"
                src={API_AVATAR + achievement.imagePath}
                style={{
                  width: "100px",
                  margin: "10px auto",
                  opacity: achievement.isClaimed ? 1 : 0.5,
                  filter: achievement.isClaimed ? "none" : "grayscale(100%)",
                }}
              />
            }
            className={`w-[180px] 2xl:w-[200px] hover:scale-105 hover:shadow-xl transition-all ${
              achievement.isClaimed ? "bg-white" : "border-gray-300"
            }`}
            style={{
              opacity: achievement.isClaimed ? 1 : 0.7,
              cursor: achievement.isClaimed ? "default" : "not-allowed",
            }}
            styles={{
              body: { padding: "12px" },
            }}
          >
            <Meta
              title={
                <div
                  style={{
                    whiteSpace: "normal",
                    lineHeight: "1.2",
                    textAlign: "center",
                  }}
                >
                  {achievement.title}
                </div>
              }
              className="mt-0"
              description={
                <>
                  <p className="text-xs">{achievement.description}</p>
                  {achievement.isClaimed && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(achievement.unlockedAt), {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </>
              }
            />
          </Card>
        ))}
      </div>
    );
  };

  const allAchievements = [
    ...data.claimed.map((c) => ({
      ...c.achievement,
      unlockedAt: c.unlockedAt,
      isClaimed: true,
    })),
    ...data.locked.map((l) => ({ ...l, isClaimed: false })),
  ];

  allAchievements.sort((a, b) => (b.isClaimed ? 1 : -1));

  return <div>{renderAchievements(allAchievements)}</div>;
};

export default Achievements;
