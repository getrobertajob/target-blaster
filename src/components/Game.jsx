import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const soundFiles = {
  1: "../gun-shot.mp3",
  2: "../machine-gun-shot.mp3",
  3: "../fire-shot.mp3",
  4: "../bomb-shot.mp3",
};

const hitTypes = {
  1: "hitHandGun",
  2: "hitMachineGun",
  3: "hitFire",
  4: "hitBomb",
};

const bulletHoleTypes = {
  1: "bulletHoleHandGun",
  2: "bulletHoleMachineGun",
  3: "bulletHoleFire",
  4: "bulletHoleBomb",
};

const clickModeScores = {
  1: 1,
  2: 2,
  3: 3,
  4: 5,
};

function Game() {
  const [animationKey, setAnimationKey] = useState(0);
  const [animationData, setAnimationData] = useState({ startY: 0, endY: 0, direction: "leftToRight" });
  const [hits, setHits] = useState([]);
  const [score, setScore] = useState(0);
  const [clickMode, setClickMode] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isStarted, setIsStarted] = useState(false);
  const [missCounter, setMissCounter] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const lastClickRef = useRef(Date.now());
  const autoClickRef = useRef(null);

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
      direction: Math.random() < 0.5 ? "leftToRight" : "rightToLeft",
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

    const target = document.elementFromPoint(x + 50, y + 50)?.closest(".scrollingImage");
    const hitId = Date.now();

    if (target) {
      if (clickModeRef.current === 1 || clickModeRef.current === 2 || clickModeRef.current === 3) {
        const hitType = hitTypes[clickModeRef.current];
        const scoreIncrement = clickModeScores[clickModeRef.current];
        setScore((prevScore) => prevScore + scoreIncrement);

        setHits((prevHits) => [...prevHits, { x, y, type: hitType, id: hitId }]);
        clearTimeout(intervalRef.current);
        handleAnimation();
        if (hitType === "hitFire") {
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
                ? { ...hit, type: "bulletHoleBombExplosion", width: 400, height: 400 }
                : hit
            )
          );
          audio.play();
          handleExplosion({ x, y, type: "bulletHoleBombExplosion" });
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
    setHits((prevHits) => [...prevHits, { x, y, type: "hitFireText", id: `text-${hitId}` }]);
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
    if (hit.type === "bulletHoleBombExplosion") {
      const targetPos = document.querySelector(".scrollingImage img").getBoundingClientRect();
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
        return "handGun";
      case 2:
        return "machineGun";
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
      "hitHandGun": "../hit-hand-gun.png",
      "bulletHoleHandGun": "../bullet-hole-hand-gun.png",
      "hitMachineGun": "../hit-machine-gun.png",
      "bulletHoleMachineGun": "../bullet-hole-machine-gun.png",
      "hitFire": "../hit-fire.png",
      "bulletHoleFire": "../bullet-hole-fire.png",
      "hitBomb": "../hit-bomb.png",
      "bulletHoleBomb": "../bullet-hole-bomb.png",
      "bulletHoleBombExplosion": "../bullet-hole-bomb-explosion.png",
      "hitFireText": ""
    };
    return `/target-blaster/${images[type]}`;
  };

  return (
    <div className="App" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div className="scoreContainerTop">
        <p className="score">Score: <input type="number" id="scoreDisplay" value={score} readOnly /></p>
        <p className={`clickMode ${getClickModeClassName()}`}>
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
      {!isStarted && (
        <div className="centeredButton">
          <button className="startButton" onClick={startGame}>Start Game</button>
        </div>
      )}
      <Link to="/" className="backLinkMainMenuBTN">Main Menu</Link>
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
          className={`scrollingImage ${animationData.direction}`}
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
        <div key={hit.id} className="hitContainer" style={{ position: "absolute", left: `${hit.x}px`, top: `${hit.y}px` }}>
          {hit.type === "hitFireText" && (
            <div className="hitFireText">-1</div>
          )}
          {hit.type !== "hitFireText" && (
            <img
              src={getImageSrc(hit.type)}
              alt={hit.type}
              style={{
                width:
                  hit.type === "hitBomb" || hit.type === "bulletHoleBombExplosion"
                    ? "400px"
                    : "100px",
                height:
                  hit.type === "hitBomb" || hit.type === "bulletHoleBombExplosion"
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
