import { Button } from "antd";
import { ClipboardCheck, Compass, UserRoundSearch } from "lucide-react";
import { subjects } from "../../utils/quizSubjects.jsx";
import { setMenuTab } from "../../redux/slices/quizMenuSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/slices/authSlice.js";

const ExercisesMenu = () => {
  const dispatch = useDispatch();
  const find = [
    {
      icon: <UserRoundSearch color="#333" />,
      text: "Seus questionários",
      onClick: () => dispatch(setMenuTab("Seus questionários")),
    },
    {
      icon: <ClipboardCheck color="#333" />,
      text: "Seu histórico",
      onClick: () => dispatch(setMenuTab("Seu histórico")),
    },
  ];

  const userState = useSelector(selectCurrentUser);

  return (
    <div className="col-span-3 flex-col flex gap-[10px] text-text">
      <Button
        className="flex items-center w-full gap-2 px-0 h-max"
        type="link"
        onClick={() => dispatch(setMenuTab("Descobrir"))}
      >
        <div className="h-[40px] w-[40px] flex items-center justify-center  bg-[#D9D9D9] rounded-[10px]">
          <Compass color="#333" />
        </div>
        <p className="font-medium text-text">Descobrir</p>
      </Button>
      <span className="bg-text w-full h-[1px] bg-opacity-20 rounded-full" />
      <div className="flex flex-col gap-1">
        <p className="font-medium">MATÉRIAS</p>
        {subjects.map((item, index) => (
          <Button
            key={index}
            className="flex items-center w-full gap-2 px-0 h-max"
            type="link"
            onClick={() => dispatch(setMenuTab(item.text))}
          >
            <div className="h-[40px] w-[40px] flex items-center justify-center  bg-[#D9D9D9] rounded-[10px]">
              {item.icon}
            </div>
            <p className="font-medium text-text">{item.text}</p>
          </Button>
        ))}
      </div>

      {userState && (
        <div>
          <span className="bg-text w-full h-[1px] bg-opacity-20 rounded-full" />
          <div className="flex flex-col gap-1">
            <p className="font-medium">ENCONTRAR</p>
            {find.map((item, index) => (
              <Button
                key={index}
                className="flex items-center w-full gap-2 px-0 h-max"
                type="link"
                onClick={item.onClick}
              >
                <div className="h-[40px] w-[40px] flex items-center justify-center  bg-[#D9D9D9] rounded-[10px]">
                  {item.icon}
                </div>
                <p className="font-medium text-text">{item.text}</p>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisesMenu;
