import { useNavigate } from "react-router-dom";

export function SummaryView() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  return (
    <div className="summary-view-container">
      <h1>RESUMEN</h1>
      <button onClick={handleButtonClick}>Página de inicio</button>
    </div>
  );
}
