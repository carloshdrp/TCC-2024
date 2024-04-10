import { Breadcrumb, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import LayoutComponent from "./layout/LayoutComponent.jsx";
import { useNavigate } from "react-router-dom";
import { ForumNavigator } from "../components/Forum/ForumNavigator.jsx";
import { ForumArticle } from "../components/Forum/ForumArticle.jsx";
import { useSelector } from "react-redux";
import { getSelectedTab } from "../redux/slices/forumNavigatorSlice.js";
import { ForumAchievements } from "../components/Forum/ForumAchievements.jsx";
import { ForumTrendingTopics } from "../components/Forum/ForumTrendingTopics.jsx";
import { ForumStatisticWidgets } from "../components/Forum/ForumStatisticWidgets.jsx";
import { selectCurrentUser } from "../redux/slices/authSlice.js";

function Forum() {
  const navigate = useNavigate();
  const selectedTab = useSelector(getSelectedTab);
  const userState = useSelector(selectCurrentUser);

  const topMenu = [
    {
      onClick: () => navigate("/"),
      href: null,
      title: <HomeOutlined />,
    },
    {
      onClick: () => navigate("/forum"),
      href: null,
      title: "Fórum",
    },
    {
      href: null,
      title: selectedTab,
    },
  ];
  return (
    <LayoutComponent>
      <div className="grid grid-flow-row grid-cols-4 gap-5 grid-auto-rows">
        <Breadcrumb items={topMenu} className="col-span-4" />
        <div className="flex flex-col w-full col-span-3 row-span-3 gap-5 min-h-[calc(100vh-180px)]">
          <ForumNavigator />
          {userState && (
            <Button
              type="primary"
              onClick={() => navigate("ask")}
              style={
                userState.points > 1
                  ? { background: "rgb(255, 64, 129, 1)" }
                  : true
              }
              className="font-medium"
              disabled={userState.points > 1 ? false : true}
            >
              Criar uma pergunta
            </Button>
          )}

          <ForumArticle />
          <ForumArticle />
        </div>
        <div className="flex flex-col h-full row-span-3 gap-5">
          {userState && <ForumAchievements />}
          <ForumTrendingTopics />
          <ForumStatisticWidgets />
        </div>
      </div>
    </LayoutComponent>
  );
}

export default Forum;
