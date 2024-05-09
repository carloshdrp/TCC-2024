import {
  clearQuestion,
  clearQuiz,
  setEditing,
  setStep,
} from "../../redux/slices/quizCreateSlice.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export function useHandleCancel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return function handleCancel() {
    dispatch(setStep(0));
    dispatch(clearQuiz());
    dispatch(clearQuestion());
    dispatch(setEditing(false));
    navigate("/exercises");
  };
}
