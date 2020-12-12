import React, { useState, useEffect } from "react";
import { useMutation, useSubscription } from "@apollo/client";
import {
  // ADD_PLAYER_MUTATION,
  GAME_SUBSCRIPTION,
  CLEAR_PLAYERS_MUTATION,
  MAKE_MOVE_MUTATION,
  REMATCH_MUTATION,
} from "../utils/graphql";

import GameBoard from "./GameBoard";

function GameRoom({ gameId, name, quit }) {
  // const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("this ran");
    if (error) setTimeout(() => setError(""), 1000);
  }, [error]);

  const [makeMove] = useMutation(MAKE_MOVE_MUTATION, {
    onError: (err) => {
      console.log(JSON.stringify(err));
      setError(err.graphQLErrors[0].message);
    },
  });

  const [clearPlayers] = useMutation(CLEAR_PLAYERS_MUTATION, {
    onCompleted: () => {
      // quit();
    },
  });

  const [rematch] = useMutation(REMATCH_MUTATION, {
    onError: (err) => {
      console.log(JSON.stringify(err));
      setError(err.graphQLErrors[0].message);
    },
  });

  const { data, loading, error: subError } = useSubscription(
    GAME_SUBSCRIPTION,
    {
      variables: { id: gameId },
      onSubscriptionData: ({ subscriptionData: { data } }) => {
        console.log("onSub", data);
        if (!data.renameGame) quit();
      },
    }
  );

  const moveHandler = (event) => {
    event.preventDefault();
    const num = event.target.id;
    const x = num > 6 ? 2 : num > 3 ? 1 : 0;
    const y = !(num % 3) ? 2 : !((num + 1) % 3) ? 1 : 0;

    makeMove({ variables: { name, x, y } });
  };

  if (subError) return <pre>{JSON.stringify(subError)}</pre>;
  if (!data) return <h4>LOADING...</h4>;

  //Is this the best way to do this? is there a way in the subscription callbacks or with an error? I just made the field nullable
  if (!data.renameGame) quit();

  let {
    renameGame: { player1, player2, turn, board, winner, code },
    renameGame,
  } = data;
  board = JSON.parse(board);

  function titleDisplay() {
    if (winner === "It's a Cat's Game!") return winner;
    if (winner) return `${winner} Wins!`;
    if (!turn) return "Waiting For Players to Join";
    if (renameGame[turn].name === name) return "Make Your Move!";
    return `It's ${renameGame[turn].name}'s Turn`;
  }

  return (
    <div style={{ textAlign: "center" }}>
      {!loading && (
        <div>
          <h3 className="codeDisplay">{code}</h3>
          <h1 style={{ marginTop: "0px", marginBottom: "50px" }}>
            {titleDisplay()}
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <div>
              <h1>X</h1>
              <h3>{player1.name || "waiting..."}</h3>
              {player1.name === name && <p>(You)</p>}
            </div>
            <GameBoard board={board} moveHandler={moveHandler} />
            <div>
              <h1>O</h1>
              <h3>{player2.name || "waiting..."}</h3>
              {player2.name === name && <p>(You)</p>}
            </div>
          </div>
          <div style={{ height: "20px", margin: "25px", color: "red" }}>
            {error}
          </div>
        </div>
      )}

      <h2>You are {name}</h2>

      {/* <div className="form">
        <label htmlFor="nameInput">Name:</label>
        <input
          name="nameInput"
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={joinGame} style={{ marginTop: "10px" }}>
          Register
        </button>
      </div> */}

      {turn && <button onClick={rematch}>Rematch</button>}
      <button onClick={clearPlayers}>Quit</button>
    </div>
  );
}

export default GameRoom;
