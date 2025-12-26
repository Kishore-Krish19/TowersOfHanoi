import { useEffect, useRef, useState } from "react";
import "./index.css";

/* ---------------- Tower Component ---------------- */
function Tower({ disks, onClick, selected, isGoal }) {
  return (
    <div
      className={`tower ${selected ? "selected" : ""} ${isGoal ? "goal" : ""}`}
      onClick={onClick}
    >
      {/* GOAL LABEL */}
      {isGoal && <div className="goal-label">GOAL</div>}

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

  /*  ---------- Audio Setup ---------- */
  const [volume, setVolume] = useState(0.8); // default 80%
  const [muted, setMuted] = useState(false);
  const moveSound = new Audio("/sounds/move.mp3");
  const winSound = new Audio("/sounds/win.mp3");
  const restartSound = new Audio("/sounds/restart.mp3");
  useEffect(() => {
  const vol = muted ? 0 : volume;
  moveSound.volume = vol;
  winSound.volume = vol;
  restartSound.volume = vol;
}, [volume, muted]);

  /* ---------- Game State ---------- */
  const generateTowers = (n) => [
    Array.from({ length: n }, (_, i) => n - i),
    [],
    []
  ];

  const [diskCount, setDiskCount] = useState(3);
  const [towers, setTowers] = useState(() => generateTowers(3));

  const [selectedTower, setSelectedTower] = useState(null);

  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

  const [theme, setTheme] = useState("dark");

  const cancelSolveRef = useRef(false);
  const firstRenderRef = useRef(true);

  /* ---------- Pure move logic ---------- */
  const moveDisk = (from, to) => {
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

      //  MOVE SOUND
      moveSound.currentTime = 0;
      moveSound.play();

      return copy;
    });
  };

  /* ---------- Click handling ---------- */
  const handleTowerClick = (index) => {
    if (hasWon || isSolving) return;

    if (selectedTower === null) {
      setSelectedTower(index);
    } else {
      moveDisk(selectedTower, index);
      setSelectedTower(null);
      setHasStarted(true);
    }
  };


  /* ---------- Move counter ---------- */
  useEffect(() => {
    if (!hasStarted) return;

    setMoves((m) => m + 1);
  }, [towers]);


  /* ---------- Timer ---------- */
  useEffect(() => {
    if (!hasStarted || hasWon || isSolving) return;

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [hasStarted, hasWon, isSolving]);

  /* ---------- Win condition ---------- */
  useEffect(() => {
    if (towers[2].length === diskCount && moves > 0) {
      setHasWon(true);
      winSound.currentTime = 0;
      winSound.play();
    }
  }, [towers, diskCount, moves]);

  /* ---------- Auto Solve ---------- */
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

  /* ---------- Restart ---------- */
  const restartGame = () => {
    cancelSolveRef.current = true;
    restartSound.play();

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

    setDiskCount(n);
    setMoves(0);
    setSeconds(0);
    setHasStarted(false);
    setHasWon(false);
    setSelectedTower(null);
    firstRenderRef.current = true;
    setTowers(generateTowers(n));
  };

  /* ---------- UI ---------- */
  return (
    <div className={`app ${theme}`}>
      <div className="top-controls">
  {/* Volume */}
  <div className="volume-control">
    <span>🔈</span>
    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      value={volume}
      onChange={(e) => setVolume(Number(e.target.value))}
      disabled={muted}
    />
  </div>

  {/* Mute */}
  <button
    className="icon-btn"
    onClick={() => setMuted((m) => !m)}
  >
    {muted ? "🔇" : "🔊"}
  </button>

  {/* Theme Toggle */}
  <button
    className="icon-btn"
    onClick={() =>
      setTheme(theme === "dark" ? "light" : "dark")
    }
  >
    {theme === "dark" ? "🌞" : "🌙"}
  </button>
</div>

      <div className="header">
        {/* <button
          className="theme-toggle"
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button> */}

        <h1>Tower of Hanoi</h1>


        <label>
          Disks:
          <select value={diskCount} onChange={handleDiskChange}>
            {[3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <p>
          Moves: <strong>{moves}</strong> | Minimum:{" "}
          <strong>{Math.pow(2, diskCount) - 1}</strong>
        </p>

        <p>⏱ Time: <strong>{seconds}s</strong></p>

        {hasWon && <h2 className="win">🎉 Congragulations You Won!</h2>}
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

      <div className="game-card">
        <div className="game">
          {towers.map((tower, i) => (
            <Tower
              key={i}
              disks={tower}
              selected={selectedTower === i}
              isGoal={i === 2}
              onClick={() => handleTowerClick(i)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
