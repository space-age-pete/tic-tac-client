import React from "react";
import "./GameBoard.css";

const s = {
  container: {
    display: "grid",
    gridTemplateColumns: "50px 50px 50px",
    gridTemplateRows: "50px 50px 50px",
    columnGap: "4px",
    rowGap: "4px",
    backgroundColor: "black",
  },
  box: {
    backgroundColor: "white",
    textAlign: "center",
    paddingTop: "15px",
  },
};

function GameBoard({ board, moveHandler }) {
  return (
    <div style={s.container}>
      {board.flat().map((mark, i) => (
        <div
          key={i}
          id={i + 1}
          style={s.box}
          className="square"
          onClick={moveHandler}
        >
          {mark || ""}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;

//possibly incorporate fancy/smart hover stuff
