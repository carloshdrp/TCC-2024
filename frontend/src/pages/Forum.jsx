import { Breadcrumb, Button, Tooltip } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import LayoutComponent from "./layout/LayoutComponent.jsx";
import { useNavigate } from "react-router-dom";
import { ForumNavigator } from "../components/Forum/ForumNavigator.jsx";
import { ForumArticle } from "../components/Forum/ForumArticle.jsx";
import { useSelector } from "react-redux";
import {
  getSearch,
  getSelectedTab,
} from "../redux/slices/forumNavigatorSlice.js";
import { ForumAchievements } from "../components/Forum/ForumAchievements.jsx";
import { ForumTrendingTopics } from "../components/Forum/ForumTrendingTopics.jsx";
import { ForumStatisticWidgets } from "../components/Forum/ForumStatisticWidgets.jsx";
import {
  selectCurrentUser,
  updateUserState,
  setUser,
} from "../redux/slices/authSlice.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUsersQuery } from "../api/slices/profileApiSlice.js";

function Forum() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedTab = useSelector(getSelectedTab);
  const userState = useSelector(selectCurrentUser);
  const searchTitle = useSelector(getSearch);

  const { data: userData, refetch } = useGetUsersQuery(userState?.id);

  useEffect(() => {
    if (userState?.id) {
      refetch().then(() => {
        if (userData) {
          dispatch(updateUserState(userData));
        } else {
          dispatch(setUser(null));
        }
      });
    }
  }, [dispatch, refetch, userState?.id, userData]);

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
            <Tooltip
              title={
                userState.points < 1
                  ? "Você precisa de pelo menos 1 ponto para criar uma pergunta"
                  : ""
              }
              placement="topRight"
            >
              <Button
                type="primary"
                onClick={() => navigate("ask")}
                style={
                  userState.points >= 1
                    ? { background: "rgb(255, 64, 129, 1)" }
                    : true
                }
                className="font-medium"
                disabled={userState.points < 1}
              >
                Criar uma pergunta
              </Button>
            </Tooltip>
          )}

          <ForumArticle selectedTab={selectedTab} searchTitle={searchTitle} />
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
