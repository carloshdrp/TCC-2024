import RegisterComponent from "../components/RegisterComponent.jsx";
import LayoutComponent from "./layout/LayoutComponent.jsx";
import { Link } from "react-router-dom";
import foguete from "../assets/foguete.png";

function Register() {
  return (
    <LayoutComponent>
      <div
        className={`min-h-[calc(100vh-200px)] py-[30px] flex flex-col items-center justify-center text-white background-opacity2`}
      >
        <div className="z-10 text-center bg-white text-text flex flex-col items-center gap-[20px] rounded-[25px] px-5 min-w-[510px] border-solid border-[#D9D9D9] border-2">
          <img className="m-0 mt-[25px]  w-16 h-16" src={foguete} alt="logo" />
          <p className="m-0 text-3xl font-semibold">Vamos começar!</p>
          <p className="m-0 ">Informe os seus dados nos campos abaixo</p>
          <RegisterComponent />
        </div>
        <Link to="/login" className="z-10 mt-2 ">
          Já tem uma conta? Entre aqui!
        </Link>
      </div>
    </LayoutComponent>
  );
}

export default Register;
