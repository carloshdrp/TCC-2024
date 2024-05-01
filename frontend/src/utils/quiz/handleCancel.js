import {
  clearQuestion,
  clearQuiz,
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
    navigate("/exercises");
  };
}
