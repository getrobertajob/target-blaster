// Imports
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// To define sound files for each click mode
const soundFiles = {
  1: "/target-blaster/gun-shot.mp3",
  2: "/target-blaster/machine-gun-shot.mp3",
  3: "/target-blaster/fire-shot.mp3",
  4: "/target-blaster/bomb-shot.mp3",
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
var missCounter = 0;
var scoreToGameOver = 0;
// Main App component
function Game() {
  // Initialize state variables
  const [animationKey, setAnimationKey] = useState(0); // used for key frames animation
  const [animationData, setAnimationData] = useState({ // used to store animation data
    startY: 0,
    endY: 0,
    direction: "left-to-right",
  });
  const [hits, setHits] = useState([]); // used to store coordinates at time of click
  const [score, setScore] = useState(0); // used to store the current score
  const [clickMode, setClickMode] = useState(1); // used to store which kind of weapon is selected
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // used to track the mouse position
  const [isStarted, setIsStarted] = useState(false); // used to track if the game has started
  const intervalRef = useRef(null); // used for the timers for target animation
  const autoClickRef = useRef(null); // used for the rapid fire for the machine gun
  const lastClickRef = useRef(Date.now()); // used to store the previous mouse position
  const clickModeRef = useRef(clickMode); // used to help reference the current click mode after it's been changed
  const animationDuration = 5000; // used to store the pause between next target animation
  const navigate = useNavigate();
  // const [missCounter, setMissCounter] = useState(0); // Manage miss count using state
  // var missCounter = 0;

  // To update click mode ref when click mode changes
  useEffect(() => {
    clickModeRef.current = clickMode;
  }, [clickMode]);

  // Listener for keydown event to change click mode
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  // Start the game
  const startGame = () => {
    setIsStarted(true);
    handleAnimation();
  };

  // Function for keydown event to change click mode
  const handleKeyDown = (e) => {
    const mode = parseInt(e.key, 10);
    // Added this so that it only changes click mode if it's one of the weapon buttons
    if (mode >= 1 && mode <= 4) {
      setClickMode(mode);
    }
  };

  // // Function to restart the game
  // const restartGame = () => {
  //   window.location.reload();
  // };

  // Function to start animation with random start/end coordinates for target animation
  const startAnimation = () => {
    setAnimationData({
      startY: Math.random() * window.innerHeight,
      endY: Math.random() * window.innerHeight,
      direction: Math.random() < 0.5 ? "left-to-right" : "right-to-left",
    });

    setAnimationKey((prevKey) => prevKey + 1);
  };

  // Function to handle animation loop
  const handleAnimation = () => {
    startAnimation();
    intervalRef.current = setTimeout(() => {
      incrementMissCount();
      handleAnimation();
    }, animationDuration);
  };
  
  const incrementMissCount = () => {
    missCounter++;
    console.log(missCounter);
    if (missCounter >= 3) {
      scoreToGameOver = document.getElementById("scoreDisplay").value
      console.log("this is the scoreToGameOver value: " + scoreToGameOver);
      navigate(`/gameover/${scoreToGameOver}`);
    }
  };

  // Example function to display a red "X"
  function displayMiss() {
    const missDisplay = document.getElementById('missDisplay');
    missDisplay.innerHTML += 'X'; // Appends a red X to some display element
  }


  // Function to handle mouse down event
  const handleMouseDown = (e) => {
    if (!isStarted) return; // Prevent actions if the game is not started
    // if weapon is a rapid fire one then it passes infor as an object
    if (clickModeRef.current === 1 || clickModeRef.current === 3 || clickModeRef.current === 4) {
      handleClick(e);
    } else if (clickModeRef.current === 2) {
      startAutoClick();
    }
    window.addEventListener("mousemove", handleMouseMove);
  };

  // Function to handle click event
  const handleClick = (e, clientX, clientY) => {
    console.log("inside handleClick "+missCounter);
    if (!isStarted) return; // Prevent actions if the game is not started
    // x&y variables initialized with if check because sometimes e object is not passed to this function
    const x = e ? e.clientX - 50 : clientX - 50;
    const y = e ? e.clientY - 50 : clientY - 50;
    const soundFile = soundFiles[clickModeRef.current];
    const audio = new Audio(soundFile);
    // checks if weapon type that should play sound on every click
    // since the bomb doesn't make any sounds until the bomb explodes
    if (clickModeRef.current === 1 || clickModeRef.current === 2 || clickModeRef.current === 3) {
      audio.play();
    }

    const target = document.elementFromPoint(x + 50, y + 50)?.closest(".scrolling-image");
    const hitId = Date.now();

    // checks if user clicked target directly
    if (target) {
      // checks if weapon type that should calculate damage on click
      // since the bomb doesn't calculate damage until after it explodes and only target is in range
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

      // checks if bomb weapon
      // if true than places bomb on screen, remembers coordinate, starts timer, & calls handle explosion
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

  // Function to handle bonus fire damage after initial damage
  const handleFireHit = (hitId, x, y) => {
    let counter = 0;
    const incrementScore = () => {
      counter++;
      setScore((prevScore) => prevScore + 1);
      if (counter >= 5) {
        clearInterval(interval);
        setHits((prevHits) => prevHits.filter((hit) => hit.id !== hitId && hit.id !== `text-${hitId}`));
      }
    };
    const interval = setInterval(incrementScore, 1000);
    setHits((prevHits) => [...prevHits, { x, y, type: "hit-fire-text", id: `text-${hitId}` }]);
    setTimeout(() => clearInterval(interval), 5000);
  };

  // Function to throttle mouse move event
  const throttle = (func, limit) => {
    return function (...args) {
      const now = Date.now();
      if (now - lastClickRef.current >= limit) {
        lastClickRef.current = now;
        func(...args);
      }
    };
  };

  // Function to handle mouse move event with throttling
  const handleMouseMove = throttle((e) => {
    const newMousePos = { x: e.clientX, y: e.clientY };
    setMousePos(newMousePos);
    if (clickModeRef.current === 2 && autoClickRef.current) {
      handleClick(null, e.clientX, e.clientY);
    }
  }, 200);

  // Function to start auto clicking
  const startAutoClick = () => {
    stopAutoClick();
    autoClickRef.current = setInterval(() => handleClick(null, mousePos.x, mousePos.y), 500);
  };

  // Function to stop auto clicking
  const stopAutoClick = () => {
    if (autoClickRef.current) {
      clearInterval(autoClickRef.current);
      autoClickRef.current = null;
    }
  };

  // Function to handle mouse up event
  const handleMouseUp = () => {
    stopAutoClick();
    window.removeEventListener("mousemove", handleMouseMove);
  };

  // Function to handle explosion
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

  // Function to get class name based on click mode
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

  // Function to define the image sources for each hit type
  const getImageSrc = (type) => {
    const images = {
      "hit-hand-gun": "hit-hand-gun.png",
      "bullet-hole-hand-gun": "bullet-hole-hand-gun.png",
      "hit-machine-gun": "hit-machine-gun.png",
      "bullet-hole-machine-gun": "bullet-hole-machine-gun.png",
      "hit-fire": "hit-fire.png",
      "bullet-hole-fire": "bullet-hole-fire.png",
      "hit-bomb": "hit-bomb.png",
      "bullet-hole-bomb": "bullet-hole-bomb.png",
      "bullet-hole-bomb-explosion": "bullet-hole-bomb-explosion.png",
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
