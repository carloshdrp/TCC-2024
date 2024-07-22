import React from "react";
import { Progress, Tooltip } from "antd";
import topaz from "../../assets/Leagues/topaz.png";
import ruby from "../../assets/Leagues/ruby.png";
import emerald from "../../assets/Leagues/emerald.png";
import ametist from "../../assets/Leagues/ametist.png";
import diamond from "../../assets/Leagues/diamond.png";

const LeagueProgressBar = ({ likeCount }) => {
  const leagues = [
    { name: "Topaz", threshold: 0, color: "#fdba74", image: topaz },
    { name: "Rubi", threshold: 10, color: "#fca5a5", image: ruby },
    { name: "Esmeralda", threshold: 20, color: "#86efac", image: emerald },
    { name: "Ametista", threshold: 30, color: "#d8b4fe", image: ametist },
    { name: "Diamante", threshold: 40, color: "#67e8f9", image: diamond },
  ];

  const getCurrentLeagueIndex = () => {
    for (let i = leagues.length - 1; i >= 0; i--) {
      if (likeCount >= leagues[i].threshold) {
        return i;
      }
    }
    return 0;
  };

  const currentLeagueIndex = getCurrentLeagueIndex();

  const calculateProgress = (league, nextLeague) => {
    if (!nextLeague) return 100;
    if (likeCount < league.threshold) return 0;
    const progressInCurrentLeague = likeCount - league.threshold;
    const totalProgressNeeded = nextLeague.threshold - league.threshold;
    return Math.min((progressInCurrentLeague / totalProgressNeeded) * 100, 100);
  };

  return (
    <div className="flex flex-col items-center space-y-4 my-5">
      <div className="flex items-center space-x-2">
        {leagues.map((league, index) => (
          <React.Fragment key={league.name}>
            <Tooltip title={`${league.threshold} curtidas ou mais`}>
              <div
                className="flex flex-col items-center p-2 rounded-lg"
                style={{
                  backgroundColor:
                    index === currentLeagueIndex ? league.color : "transparent",
                  opacity:
                    index === currentLeagueIndex
                      ? 1
                      : index < currentLeagueIndex
                        ? 0.7
                        : 0.5,
                }}
              >
                <img src={league.image} alt={league.name} className="w-8 h-8" />
                <span
                  className={`text-xs font-bold ${
                    index <= currentLeagueIndex
                      ? "text-gray-800"
                      : "text-gray-500"
                  }`}
                >
                  {league.name}
                </span>
              </div>
            </Tooltip>
            {index < leagues.length - 1 && (
              <Progress
                percent={calculateProgress(league, leagues[index + 1])}
                showInfo={false}
                steps="10"
                status={index === currentLeagueIndex ? "active" : "normal"}
                strokeColor={
                  index <= currentLeagueIndex ? league.color : "#f0f0f0"
                }
                trailColor="#f0f0f0"
                strokeWidth={10}
                style={{ opacity: index < currentLeagueIndex ? 0.7 : 1 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LeagueProgressBar;
