import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { setMenuTab } from "../../redux/slices/quizMenuSlice.js";
import { useDispatch } from "react-redux";

export const QuickAccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-2 gap-4 mb-2 text-text">
      <Button
        type="link"
        onClick={() => {
          navigate("/forum");
          window.scrollTo(0, 0);
        }}
      >
        Fórum
      </Button>
      <Button
        type="link"
        onClick={() => {
          dispatch(setMenuTab("Seu histórico"));
          navigate("/exercises");
          window.scrollTo(0, 0);
        }}
      >
        Histórico de questionários
      </Button>
      <Button type="link" onClick={() => navigate("/forum/ask")}>
        Fazer uma pergunta
      </Button>
      <Button
        type="link"
        onClick={() => {
          dispatch(setMenuTab("Seus questionários"));
          navigate("/exercises");
          window.scrollTo(0, 0);
        }}
      >
        Seus questionários
      </Button>
    </div>
  );
};
