import React, { useState, useEffect } from "react";
import GameRoom from "./components/GameRoom";
import Home from "./components/Home";
import jwtDecode from "jwt-decode";

function App() {
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("jwtToken");
      } else {
        setGameId(decodedToken.id);
        setName(decodedToken.name);
      }
      //does decoded token also include user information?
    }
  }, []);

  const join = (playerData) => {
    localStorage.setItem("jwtToken", playerData.token);
    setGameId(playerData.gameId);
    setName(playerData.name);
  };

  const quit = () => {
    localStorage.removeItem("jwtToken");
    setGameId("");
    setName("");
  };

  if (gameId && name)
    return <GameRoom gameId={gameId} name={name} quit={quit} />;
  return <Home join={join} quit={quit} />;
}

export default App;
