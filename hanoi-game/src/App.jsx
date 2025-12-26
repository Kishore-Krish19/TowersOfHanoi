import { useEffect, useRef, useState } from "react";
import "./index.css";

/* ---------------- Tower Component ---------------- */
function Tower({ disks, onClick, selected, isGoal }) {
  return (
    <div
      className={`tower ${selected ? "selected" : ""} ${isGoal ? "goal" : ""}`}
      onClick={onClick}
    >
      {isGoal && <div className="goal-label">GOAL</div>}

      <div className="base" />

      {disks.map((disk) => (
        <div
          key={disk}
          className="disk"
          data-size={disk}
          style={{ width: `${30 + disk * 18}px` }}
        />
      ))}

      <div className="pole" />
    </div>
  );
}

/* ---------------- App Component ---------------- */
export default function App() {

  /* ---------- AUDIO ---------- */
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  const moveSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const restartSoundRef = useRef(null);

  useEffect(() => {
    moveSoundRef.current = new Audio("/sounds/move.mp3");
    winSoundRef.current = new Audio("/sounds/win.mp3");
    restartSoundRef.current = new Audio("/sounds/restart.mp3");

    moveSoundRef.current.preload = "auto";
    winSoundRef.current.preload = "auto";
    restartSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    const vol = muted ? 0 : volume;
    if (moveSoundRef.current) moveSoundRef.current.volume = vol;
    if (winSoundRef.current) winSoundRef.current.volume = vol;
    if (restartSoundRef.current) restartSoundRef.current.volume = vol;
  }, [volume, muted]);

  /* ---------- GAME STATE ---------- */
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

  /* ---------- MOVE LOGIC ---------- */
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

      // 🔊 MOVE SOUND (no missed moves)
      if (moveSoundRef.current) {
        const sound = moveSoundRef.current.cloneNode();
        sound.volume = muted ? 0 : volume;
        sound.play();
      }

      return copy;
    });
  };

  /* ---------- CLICK ---------- */
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

  /* ---------- MOVE COUNTER ---------- */
  useEffect(() => {
    if (!hasStarted) return;
    setMoves((m) => m + 1);
  }, [towers]);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (!hasStarted || hasWon || isSolving) return;

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [hasStarted, hasWon, isSolving]);

  /* ---------- WIN ---------- */
  useEffect(() => {
    if (towers[2].length === diskCount && moves > 0) {
      setHasWon(true);
      winSoundRef.current?.play();
    }
  }, [towers, diskCount, moves]);

  /* ---------- AUTO SOLVE ---------- */
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
      await new Promise((r) => setTimeout(r, 600));
      moveDisk(from, to);
    }

    setIsSolving(false);
  };

  /* ---------- RESTART ---------- */
  const restartGame = () => {
    restartSoundRef.current?.play();

    setIsSolving(false);
    setHasStarted(false);
    setHasWon(false);
    setMoves(0);
    setSeconds(0);
    setSelectedTower(null);
    setTowers(generateTowers(diskCount));
  };

  /* ---------- DISK CHANGE ---------- */
  const handleDiskChange = (e) => {
    const n = Number(e.target.value);
    cancelSolveRef.current = true;

    setDiskCount(n);
    setMoves(0);
    setSeconds(0);
    setHasStarted(false);
    setHasWon(false);
    setSelectedTower(null);
    setTowers(generateTowers(n));
  };

  /* ---------- UI ---------- */
  return (
    <div className={`app ${theme}`}>

      {/* TOP CONTROLS */}
      <div className="top-controls">
        <div className="volume-control">
          <span>🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>

        <button className="icon-btn" onClick={() => setMuted((m) => !m)}>
          {muted ? "🔇" : "🔊"}
        </button>

        <button
          className="icon-btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
      </div>

      {/* HEADER */}
      <div className="header">
        <h1>Tower of Hanoi</h1>

        <label className="disk-select">
          Disks:
          <select value={diskCount} onChange={handleDiskChange}>
            {[3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <p className="stats">
          Moves: <strong>{moves}</strong> | Minimum:{" "}
          <strong>{Math.pow(2, diskCount) - 1}</strong>
        </p>

        <p className="time">
          ⏱ Time: <strong>{seconds}s</strong>
        </p>

        {hasWon && <h2 className="win">🎉 Congratulations You Won!</h2>}
        <div className="controls">
          <button className="restart" onClick={restartGame}>Restart</button>
          <button
            className="restart"
            onClick={autoSolve}
            disabled={isSolving}
          >
            {isSolving ? "Solving..." : "Auto Solve"}
          </button>
        </div>
      </div>

      {/* GAME */}
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
