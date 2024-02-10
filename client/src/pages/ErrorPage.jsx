import { useNavigate } from "react-router-dom";
import "../styles/error.css";

export function ErrorPage() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  return (
    <div className="error-page">
      <div id="mainError">
        <div className="errorFont">
          <h1>Error 404</h1>
          <h2>Ooops!</h2>
          <h3>La página no existe o ha ocurrido un error</h3>
          <button onClick={handleButtonClick}>Volver al inicio</button>
        </div>
      </div>
    </div>
  );
}
