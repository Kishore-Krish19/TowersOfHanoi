import { useEffect, useRef, useState } from "react";
import "./index.css";

/* ---------------- Tower Component ---------------- */
function Tower({ disks, onClick, selected }) {
  return (
    <div
      className={`tower ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {/* Base */}
      <div className="base" />

      {/* Disks */}
      {disks.map((disk) => (
        <div
          key={disk}
          className="disk"
          data-size={disk}
          style={{ width: `${30 + disk * 18}px` }}
        />
      ))}

      {/* Pole */}
      <div className="pole" />
    </div>
  );
}

/* ---------------- App Component ---------------- */
export default function App() {
  /* ---------- helpers ---------- */
  const generateTowers = (n) => [
    Array.from({ length: n }, (_, i) => n - i),
    [],
    []
  ];

  /* ---------- state ---------- */
  const [diskCount, setDiskCount] = useState(3);
  const [towers, setTowers] = useState(generateTowers(3));
  const [selectedTower, setSelectedTower] = useState(null);

  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

  const cancelSolveRef = useRef(false);
  const firstRenderRef = useRef(true);

  /* ---------- PURE move logic (NO side-effects) ---------- */
  const moveDisk = (from, to) => {
    let didMove = false;

    setTowers((prev) => {
      if (from === to) return prev;

      const fromTower = prev[from];
      const toTower = prev[to];
      if (fromTower.length === 0) return prev;

      const disk = fromTower[fromTower.length - 1];
      const top = toTower[toTower.length - 1];
      if (top && top < disk) return prev;

      const copy = prev.map((t) => [...t]);
      copy[from].pop();
      copy[to].push(disk);

      didMove = true;
      return copy;
    });

    return didMove;
  };

  /* ---------- click handling ---------- */
  const handleTowerClick = (index) => {
    if (hasWon || isSolving) return;

    if (selectedTower === null) {
      setSelectedTower(index);
    } else {
      const moved = moveDisk(selectedTower, index);
      if (moved) {
        setHasStarted(true);
      }
      setSelectedTower(null);
    }
  };

  /* ---------- move counter (based on REAL tower change) ---------- */
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    setMoves((m) => m + 1);
  }, [towers]);

  /* ---------- start timer after first move ---------- */
  useEffect(() => {
    if (moves > 0) {
      setHasStarted(true);
    }
  }, [moves]);

  /* ---------- timer ---------- */
  useEffect(() => {
    if (!hasStarted || hasWon || isSolving) return;

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [hasStarted, hasWon, isSolving]);

  /* ---------- win condition ---------- */
  useEffect(() => {
    if (towers[2].length === diskCount && moves > 0) {
      setHasWon(true);
    }
  }, [towers, diskCount, moves]);

  /* ---------- auto solve ---------- */
  const generateMoves = (n, from, to, aux, res = []) => {
    if (n === 0) return res;
    generateMoves(n - 1, from, aux, to, res);
    res.push([from, to]);
    generateMoves(n - 1, aux, to, from, res);
    return res;
  };

  const autoSolve = async () => {
    cancelSolveRef.current = false;
    setIsSolving(true);
    setHasStarted(true);

    const list = generateMoves(diskCount, 0, 2, 1);

    for (const [from, to] of list) {
      if (cancelSolveRef.current) break;
      await new Promise((r) => setTimeout(r, 400));
      moveDisk(from, to);
    }

    setIsSolving(false);
  };

  /* ---------- restart ---------- */
  const restartGame = () => {
    cancelSolveRef.current = true;

    setIsSolving(false);
    setHasStarted(false);
    setHasWon(false);
    setMoves(0);
    setSeconds(0);
    setSelectedTower(null);

    firstRenderRef.current = true;
    setTowers(generateTowers(diskCount));
  };

  const handleDiskChange = (e) => {
    const n = Number(e.target.value);

    cancelSolveRef.current = true;
    setIsSolving(false);
    setHasStarted(false);
    setHasWon(false);
    setMoves(0);
    setSeconds(0);
    setSelectedTower(null);

    firstRenderRef.current = true;
    setDiskCount(n);
    setTowers(generateTowers(n));
  };

  /* ---------- UI ---------- */
  return (
    <div className="app">
      <div className="header">
        <h1>Tower of Hanoi</h1>

        <label>
          Disks:{" "}
          <select value={diskCount} onChange={handleDiskChange}>
            {[3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <p>
          Moves: <strong>{moves}</strong> | Minimum:{" "}
          <strong>{Math.pow(2, diskCount) - 1}</strong>
        </p>

        <p>
          ⏱ Time: <strong>{seconds}s</strong>
        </p>

        {hasWon && <h2 className="win">🎉 You Win!</h2>}
      </div>

      <div className="game">
        {towers.map((tower, i) => (
          <Tower
            key={i}
            disks={tower}
            selected={selectedTower === i}
            onClick={() => handleTowerClick(i)}
          />
        ))}
      </div>

      <div className="controls">
        <button className="restart" onClick={restartGame}>
          Restart
        </button>

        <button
          className="restart"
          onClick={autoSolve}
          disabled={isSolving}
        >
          {isSolving ? "Solving..." : "Auto Solve"}
        </button>
      </div>
    </div>
  );
}
