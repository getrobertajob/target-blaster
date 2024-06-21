import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// To define sound files for each click mode
const soundFiles = {
  1: "../gun-shot.mp3",
  2: "../machine-gun-shot.mp3",
  3: "../fire-shot.mp3",
  4: "../bomb-shot.mp3",
};

// To define the hit types for each click mode
const hitTypes = {
  1: "hit-hand-gun",
  2: "hit-machine-gun",
  3: "hit-fire",
  4: "hit-bomb",
};

// To define bullet hole types for each click mode
const bulletHoleTypes = {
  1: "bullet-hole-hand-gun",
  2: "bullet-hole-machine-gun",
  3: "bullet-hole-fire",
  4: "bullet-hole-bomb",
};

// To define scores for each click mode
const clickModeScores = {
  1: 1,
  2: 2,
  3: 3,
  4: 5,
};

function Game() {
  const [animationKey, setAnimationKey] = useState(0);
  const [animationData, setAnimationData] = useState({ startY: 0, endY: 0, direction: "left-to-right" });
  const [hits, setHits] = useState([]);
  const [score, setScore] = useState(0);
  const [clickMode, setClickMode] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isStarted, setIsStarted] = useState(false);
  const [missCounter, setMissCounter] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const lastClickRef = useRef(Date.now()); // used to store the previous mouse position
  const autoClickRef = useRef(null); // used for the rapid fire for the machine gun

  const clickModeRef = useRef(clickMode);
  const animationDuration = 5000;

  useEffect(() => {
    clickModeRef.current = clickMode;
  }, [clickMode]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  const startGame = () => {
    setIsStarted(true);
    handleAnimation();
  };

  const stopGame = () => {
    setIsStarted(false);
    clearTimeout(intervalRef.current);
  };

  const handleKeyDown = (e) => {
    const mode = parseInt(e.key, 10);
    if (mode >= 1 && mode <= 4) {
      setClickMode(mode);
    }
  };

  const startAnimation = () => {
    setAnimationData({
      startY: Math.random() * window.innerHeight,
      endY: Math.random() * window.innerHeight,
      direction: Math.random() < 0.5 ? "left-to-right" : "right-to-left",
    });
    setAnimationKey((prevKey) => prevKey + 1);
  };

  const handleAnimation = () => {
    if (!isStarted) return;
    startAnimation();
    intervalRef.current = setTimeout(() => {
      incrementMissCount();
      handleAnimation();
    }, animationDuration);
  };

  const incrementMissCount = () => {
    setMissCounter((prevMissCounter) => {
      const newMissCounter = prevMissCounter + 1;
      if (newMissCounter >= 3) {
        stopGame();
        navigate(`/gameover/${score}`);
      }
      return newMissCounter;
    });
  };

  const handleMouseDown = (e) => {
    if (!isStarted) return;
    if (clickModeRef.current === 1 || clickModeRef.current === 3 || clickModeRef.current === 4) {
      handleClick(e);
    } else if (clickModeRef.current === 2) {
      startAutoClick();
    }
    window.addEventListener("mousemove", handleMouseMove);
  };

  const handleClick = (e, clientX, clientY) => {
    if (!isStarted) return;
    const x = e ? e.clientX - 50 : clientX - 50;
    const y = e ? e.clientY - 50 : clientY - 50;
    const soundFile = soundFiles[clickModeRef.current];
    const audio = new Audio(soundFile);
    if (clickModeRef.current === 1 || clickModeRef.current === 2 || clickModeRef.current === 3) {
      audio.play();
    }

    const target = document.elementFromPoint(x + 50, y + 50)?.closest(".scrolling-image");
    const hitId = Date.now();

    if (target) {
      if (clickModeRef.current === 1 || clickModeRef.current === 2 || clickModeRef.current === 3) {
        const hitType = hitTypes[clickModeRef.current];
        const scoreIncrement = clickModeScores[clickModeRef.current];
        setScore((prevScore) => prevScore + scoreIncrement);

        setHits((prevHits) => [...prevHits, { x, y, type: hitType, id: hitId }]);
        clearTimeout(intervalRef.current);
        handleAnimation();
        if (hitType === "hit-fire") {
          handleFireHit(hitId, x, y);
        }
      }
    } else {
      const bulletHoleType = bulletHoleTypes[clickModeRef.current];
      setHits((prevHits) => [...prevHits, { x, y, type: bulletHoleType, id: hitId }]);

      if (clickModeRef.current === 4) {
        setTimeout(() => {
          setHits((prevHits) =>
            prevHits.map((hit) =>
              hit.id === hitId
                ? { ...hit, type: "bullet-hole-bomb-explosion", width: 400, height: 400 }
                : hit
            )
          );
          audio.play();
          handleExplosion({ x, y, type: "bullet-hole-bomb-explosion" });
        }, 1000);
      }
    }
  };

  const handleFireHit = (hitId, x, y) => {
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      setScore((prevScore) => prevScore + 1);
      if (counter >= 5) {
        clearInterval(interval);
        setHits((prevHits) => prevHits.filter((hit) => hit.id !== hitId && hit.id !== `text-${hitId}`));
      }
    }, 1000);
    setHits((prevHits) => [...prevHits, { x, y, type: "hit-fire-text", id: `text-${hitId}` }]);
    setTimeout(() => clearInterval(interval), 5000);
  };

  const throttle = (func, limit) => {
    return function (...args) {
      const now = Date.now();
      if (now - lastClickRef.current >= limit) {
        lastClickRef.current = now;
        func(...args);
      }
    };
  };

  const handleMouseMove = throttle((e) => {
    const newMousePos = { x: e.clientX, y: e.clientY };
    setMousePos(newMousePos);
    if (clickModeRef.current === 2 && autoClickRef.current) {
      handleClick(null, e.clientX, e.clientY);
    }
  }, 200);

  const startAutoClick = () => {
    stopAutoClick();
    autoClickRef.current = setInterval(() => handleClick(null, mousePos.x, mousePos.y), 500);
  };

  const stopAutoClick = () => {
    if (autoClickRef.current) {
      clearInterval(autoClickRef.current);
      autoClickRef.current = null;
    }
  };

  const handleMouseUp = () => {
    stopAutoClick();
    window.removeEventListener("mousemove", handleMouseMove);
  };

  const handleExplosion = (hit) => {
    if (hit.type === "bullet-hole-bomb-explosion") {
      const targetPos = document.querySelector(".scrolling-image img").getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(hit.x - targetPos.x, 2) + Math.pow(hit.y - targetPos.y, 2)
      );
      if (distance <= 500) {
        setScore((prevScore) => prevScore + 5);
        clearTimeout(intervalRef.current);
        handleAnimation();
      }
    }
  };

  const getClickModeClassName = () => {
    switch (clickMode) {
      case 1:
        return "hand-gun";
      case 2:
        return "machine-gun";
      case 3:
        return "fire";
      case 4:
        return "bomb";
      default:
        return "";
    }
  };

  const getImageSrc = (type) => {
    const images = {
      "hit-hand-gun": "../hit-hand-gun.png",
      "bullet-hole-hand-gun": "../bullet-hole-hand-gun.png",
      "hit-machine-gun": "../hit-machine-gun.png",
      "bullet-hole-machine-gun": "../bullet-hole-machine-gun.png",
      "hit-fire": "../hit-fire.png",
      "bullet-hole-fire": "../bullet-hole-fire.png",
      "hit-bomb": "../hit-bomb.png",
      "bullet-hole-bomb": "../bullet-hole-bomb.png",
      "bullet-hole-bomb-explosion": "../bullet-hole-bomb-explosion.png",
      "hit-fire-text": ""
    };
    return `/target-blaster/${images[type]}`;
  };

  return (
    <div className="App" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div className="scoreContainerTop">
        <p className="score">Score: <input type="number" id="scoreDisplay" value={score} readOnly /></p>
        <p className={`click-mode ${getClickModeClassName()}`}>
          {clickMode === 1
            ? "Hand Gun"
            : clickMode === 2
            ? "Machine Gun"
            : clickMode === 3
            ? "Fire"
            : "Bomb"}
        </p>
        <p className="missBox" >{new Array(missCounter).fill("❌").join(' ')}</p>
      </div>
      {!isStarted && ( // Conditionally render the start button
        <div className="centered-button">
          <button className="start-button" onClick={startGame}>Start Game</button>
        </div>
      )}
      <Link to="/" className="back-linkMainMenu">Main Menu</Link>
      <div className="optionsPanel" onClick={(e) => e.stopPropagation()}>
        <div className="bottomPanel">
          <p>press [1] for Hand Gun</p>
          <p>press [2] for Machine Gun</p>
          <p>press [3] for Fire</p>
          <p>press [4] for Bomb</p>
        </div>
      </div>
      {isStarted && (
        <div
          className={`scrolling-image ${animationData.direction}`}
          style={{
            top: `${animationData.startY}px`,
            "--startY": `${animationData.startY}px`,
            "--endY": `${animationData.endY}px`,
          }}
          key={animationKey}
        >
          <img draggable="false" src={"../target.png"} alt="Target" />
        </div>
      )}
      {hits.map((hit, index) => (
        <div key={hit.id} className="hit-container" style={{ position: "absolute", left: `${hit.x}px`, top: `${hit.y}px` }}>
          {hit.type === "hit-fire-text" && (
            <div className="hit-fire-text">-1</div>
          )}
          {hit.type !== "hit-fire-text" && (
            <img
              src={getImageSrc(hit.type)}
              alt={hit.type}
              style={{
                width:
                  hit.type === "hit-bomb" || hit.type === "bullet-hole-bomb-explosion"
                    ? "400px"
                    : "100px",
                height:
                  hit.type === "hit-bomb" || hit.type === "bullet-hole-bomb-explosion"
                    ? "400px"
                    : "100px",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Game;
