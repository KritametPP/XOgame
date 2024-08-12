import React, { useState, useEffect } from "react";

const Cell = ({ value, onClick }) => {
  return (
    <button
      className={`w-20 h-20 border-2 border-gray-600 flex items-center justify-center text-2xl font-bold ${
        value === "X" ? "text-white" : value === "O" ? "text-red-600" : ""
      } bg-gray-800 hover:bg-gray-700`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

const Board = () => {
  const [cells, setCells] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isBot, setIsBot] = useState(true);

  const calculateWinner = (cells) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(cells);
  const isDraw = !winner && cells.every((cell) => cell !== null);

  const handleClick = (index) => {
    if (cells[index] || winner || (isBot && !xIsNext)) return;

    const newCells = [...cells];
    newCells[index] = xIsNext ? "X" : "O";
    setCells(newCells);
    setXIsNext(!xIsNext);
  };

  const handleBotMove = () => {
    const botMove = minimax(cells, true).index;
    if (botMove !== undefined) {
      const newCells = [...cells];
      newCells[botMove] = "O";
      setCells(newCells);
      setXIsNext(true);
    }
  };

  useEffect(() => {
    if (isBot && !xIsNext && !winner && !isDraw) {
      handleBotMove();
    }
  }, [xIsNext, cells, isBot, winner, isDraw]);

  const handleReset = () => {
    setCells(Array(9).fill(null));
    setXIsNext(true);
  };

  const minimax = (newCells, isMaximizing) => {
    const winningPlayer = calculateWinner(newCells);

    if (winningPlayer === "X") return { score: -1 };
    if (winningPlayer === "O") return { score: 1 };
    if (newCells.every((cell) => cell !== null)) return { score: 0 };

    const scores = [];
    const moves = [];

    newCells.forEach((cell, index) => {
      if (cell === null) {
        const nextCells = [...newCells];
        nextCells[index] = isMaximizing ? "O" : "X";

        const score = minimax(nextCells, !isMaximizing).score;

        scores.push(score);
        moves.push(index);
      }
    });

    if (isMaximizing) {
      const maxScoreIndex = scores.indexOf(Math.max(...scores));
      return { score: scores[maxScoreIndex], index: moves[maxScoreIndex] };
    } else {
      const minScoreIndex = scores.indexOf(Math.min(...scores));
      return { score: scores[minScoreIndex], index: moves[minScoreIndex] };
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="text-3xl font-bold mb-4">XO Game</h1>
      <div className="grid grid-cols-3 mb-4 gap-0.5">
        {cells.map((cell, index) => (
          <Cell key={index} value={cell} onClick={() => handleClick(index)} />
        ))}
      </div>
      {winner && <p className="text-xl font-bold">{winner} wins</p>}
      {isDraw && !winner && <p className="text-xl font-bold">Draw</p>}
      <button
        className="p-2 bg-blue-700 text-white rounded hover:bg-blue-600"
        onClick={handleReset}
      >
        Play Again
      </button>
      <button
        className="p-2 bg-green-700 text-white rounded hover:bg-green-600"
        onClick={() => setIsBot(!isBot)}
      >
        {isBot ? "Play with Player" : "Play with Bot"}
      </button>
    </div>
  );
};

export default Board;
