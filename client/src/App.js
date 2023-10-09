import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) =>
        console.error("There was an error fetching the data", error)
      );
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
    </div>
  );
}

export default App;
