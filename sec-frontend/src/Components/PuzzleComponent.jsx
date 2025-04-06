import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { DoubleArrow } from "@mui/icons-material";

const PuzzleSlider = ({ onPuzzleSolved }) => {
  const [currentShape, setCurrentShape] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [puzzlePieceLeft, setPuzzlePieceLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const sliderRef = useRef(null);
  const drawerRef = useRef(null);
  const navigate = useNavigate();

  const puzzlePieceWidth = 80;
  const puzzlePieceHeight = 80;
  const puzzleGapPosition = 250;
  const sliderHeight = 220;
  const sliderWidth = 350;
  const drawerHeight = 40;
  const snapTolerance = 10;

  const natureImages = [
    "/assets/banners/n1.jpg",
    "/assets/banners/n2.jpg",
    "/assets/banners/n3.jpg",
    "/assets/banners/n4.jpg",
    "/assets/banners/n5.jpg",
  ];

const puzzleShapes = [
    // Top-left corner piece
    `M50,0c-3.4,0-6,2.6-6,6v2h-12v10c0,3.4-2.6,6-6,6s-6-2.6-6-6V16H8c-4.4,0-8,3.6-8,8v44c0,4.4,3.6,8,8,8h44c4.4,0,8-3.6,8-8v-12c0-1.4-1.6-2.2-2.8-1.4c-2,1.2-4.4,1.8-7,1.2c-4-0.8-7.2-3.8-8-7.6c-1.4-6.2,3.6-11.6,10-11.6c2,0,3.6,0.6,5.2,1.4c1.2,0.8,2.8,0,2.8-1.4V8c0-4.4-3.6-8-8-8H50z`,

    // Top-right corner piece
    `M32.5,22.5c0.728,0,1.408,0.29,1.968,0.782c1.098,0.664,1.532-0.068,1.532-0.782v-14c0-4.4-3.6-8-8-8h-14c-0.712,0-1.448,0.432-0.782,1.532c0.492,0.56,0.782,0.272,0.782,1.968c0,3.314-2.686,6-6,6c-0.728,0-1.408-0.29-1.97-0.782C4.932,8.554,4.5,9.286,4.5,10v14c0,4.4,3.6,8,8,8h14c0.782,0,1.524-0.508,0.486-1.854C24.69,29.652,24.5,29.1,24.5,28.5c0-3.314,2.686-6,6-6z`,

    // Center piece
    `M40,0c-3.4,0-6,2.6-6,6v2h-12v10c0,3.4-2.6,6-6,6s-6-2.6-6-6V16H0v28c0,3.4,2.6,6,6,6h2v12c0,3.4,2.6,6,6,6s6-2.6,6-6v-2h12v-10c0-3.4,2.6-6,6-6s6,2.6,6,6v10h12v-12c0-3.4,2.6-6,6-6s6,2.6,6-6V16h-10c-3.4,0-6-2.6-6-6s2.6-6,6-6h10V0H40z`,

    // Bottom-left corner piece
    `M8,28c-4.4,0-8,3.6-8,8v44c0,4.4,3.6,8,8,8h44c4.4,0,8-3.6,8-8v-12c0-1.4-1.6-2.2-2.8-1.4c-2,1.2-4.4,1.8-7,1.2c-4-0.8-7.2-3.8-8-7.6c-1.4-6.2,3.6-11.6,10-11.6c2,0,3.6,0.6,5.2,1.4c1.2,0.8,2.8,0,2.8-1.4v-12c0-4.4-3.6-8-8-8H8z`,

    // Bottom-right corner piece
    `M52,48c-6.4,0-11.4,5.6-10,11.8c0.8,4,3.8,7.2,7.6,8c2.6,0.6,5,0,7-1.2c1.2-0.8,2.8,0,2.8,1.4v12c0,4.4-3.6,8-8,8h-44c-4.4,0-8-3.6-8-8v-44c0-4.4,3.6-8,8-8h12c1.4,0,2.2-1.6,1.4-2.8c-0.8-1.6-1.4-3.2-0.8-5.2c0.8-4,3.8-7.2,7.6-8c6.8-1.4,12.4,2.8,12.4,9.8c0,2-0.6,3.6-1.4,5.2c-0.8,1.2,0,2.8,1.4,2.8h12c4.4,0,8,3.6,8,8v12z`,
];
  const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };
  const [imageLoaded, setImageLoaded] = useState(false);

  const generateRandomPattern = useCallback(() => {
    setImageLoaded(false); // Reset loading state
    const newImage = getRandomItem(natureImages);
    const newShape = getRandomItem(puzzleShapes);

    // Preload image
    const img = new Image();
    img.onload = () => {
      setBackgroundImage(newImage);
      setCurrentShape(newShape);
      setImageLoaded(true);
    };
    img.onerror = () => {
      // If image fails, try another one
      generateRandomPattern();
    };
    img.src = newImage;
  }, []);

  useEffect(() => {
    generateRandomPattern();
  }, [generateRandomPattern]);

  useEffect(() => {
    if (puzzleSolved) {
      onPuzzleSolved();
    }
  }, [puzzleSolved, onPuzzleSolved]);

  const startDragging = (e) => {
    setIsDragging(true);
    if (drawerRef.current) {
      drawerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const stopDragging = () => {
    setIsDragging(false);
    if (Math.abs(puzzlePieceLeft - puzzleGapPosition) < snapTolerance) {
      setPuzzlePieceLeft(puzzleGapPosition);
      setPuzzleSolved(true);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 2000);
    }
  };

  const handleDragging = (e) => {
    if (!isDragging) return;

    const drawerRect = drawerRef.current.getBoundingClientRect();
    const newLeft = e.clientX - drawerRect.left - puzzlePieceWidth / 2;

    if (newLeft >= 0 && newLeft <= sliderWidth - puzzlePieceWidth) {
      setPuzzlePieceLeft(newLeft);
    }
  };

  return (
    <div
      style={{
        width: `${sliderWidth}px`,
        margin: "0 auto",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        ref={sliderRef}
        style={{
          width: `${sliderWidth}px`,
          height: `${sliderHeight}px`,
          position: "relative",
          backgroundImage: imageLoaded ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <svg
          width={puzzlePieceWidth}
          height={puzzlePieceHeight}
          style={{
            position: "absolute",
            bottom: "70px",
            left: `${puzzleGapPosition}px`,
            zIndex: 1,
          }}
        >
          <path
            d={currentShape}
            fill="rgba(0, 0, 0, 0.4)"
            stroke="#fff"
            strokeWidth="2"
          />
        </svg>

        <svg
          width={puzzlePieceWidth}
          height={puzzlePieceHeight}
          style={{
            position: "absolute",
            bottom: "70px",
            left: `${puzzlePieceLeft}px`,
            zIndex: 3,
            filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.3))",
            transition: isDragging ? "none" : "left 0.2s ease-out",
          }}
        >
          <defs>
            <clipPath id="puzzlePieceClip">
              <path d={currentShape} />
            </clipPath>
          </defs>
          <image
            x="0"
            y="0"
            width={sliderWidth}
            height={sliderHeight}
            href={imageLoaded ? backgroundImage : ""}
            clipPath="url(#puzzlePieceClip)"
            style={{
              transform: `translate(-${puzzleGapPosition}px, -${
                sliderHeight - puzzlePieceHeight - 30
              }px)`,
              filter: "brightness(1.2)",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          />
          <path
            d={currentShape}
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            style={{
              filter:
                Math.abs(puzzlePieceLeft - puzzleGapPosition) < snapTolerance
                  ? "drop-shadow(0 0 5px #F95959)"
                  : "none",
            }}
          />
        </svg>
      </div>

      <div
        ref={drawerRef}
        onPointerDown={startDragging}
        onPointerMove={handleDragging}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        style={{
          width: "348px",
          height: `${drawerHeight}px`,
          position: "relative",
          backgroundColor: "#f0f0f0",
          marginTop: "-2px",
          cursor: "pointer",
          touchAction: "none",
          border: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Tooltip title="Drag to slide the puzzle piece" placement="top">
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#666",
              fontWeight: 400,
              zIndex: 2,
              fontSize: "13px",
              animation: "slideText 2s linear infinite",
              WebkitAnimation: "slideText 2s linear infinite",
            }}
          >
            <style>
              {`
        @keyframes slideText {
          0% { transform: translate(-80%, -50%); }
          50% { transform: translate(-20%, -50%); }
          100% { transform: translate(-80%, -50%); }
        }
        @-webkit-keyframes slideText {
          0% { transform: translate(-80%, -50%); }
          50% { transform: translate(-20%, -50%); }
          100% { transform: translate(-80%, -50%); }
        }
      `}
            </style>
            <div>Hold and Slide</div>
          </div>
        </Tooltip>

        <div
          style={{
            width: `${puzzlePieceLeft + puzzlePieceWidth / 2}px`,
            height: "100%",
            background: "linear-gradient(90deg, #F95959, #F95959)",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            transition: isDragging ? "none" : "width 0.2s ease-out",
          }}
        />

        <div
          style={{
            width: `${puzzlePieceWidth}px`,
            height: "100%",
            backgroundColor: "#ffffff",
            position: "absolute",
            left: `${puzzlePieceLeft}px`,
            transition: isDragging ? "none" : "left 0.2s ease-out",
            boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DoubleArrow style={{ fontSize: 24, color: "#666" }} />
        </div>
      </div>

     

      <button
        onClick={generateRandomPattern}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "350px",
          height: `${drawerHeight}px`,
          margin: "-1px auto 0 auto",
          backgroundColor: "rgb(255,255,255)",
          border: "1px solid rgb(255,255,255)",
          cursor: "pointer",
          color: "#666",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          transition: "all 0.2s ease",
          
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "rgb(255,255,255)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "rgb(255,255,255)";
        }}
      >
        Reload
      </button>

      {puzzleSolved && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: `${sliderHeight + drawerHeight}px`,
            background:
              "linear-gradient(45deg, #F95959, #F95959)",
            borderRadius: "10px",
            zIndex: 4,
          }}
        />
      )}
    </div>
  );
};

export default PuzzleSlider;
