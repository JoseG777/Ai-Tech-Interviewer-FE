import React, { useEffect, useRef, useState, containerRef } from 'react';
import '../styles/Camera.css';

const Camera = ({ turnOff }) => {
  const videoRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); 
  const [isResizing, setIsResizing] = useState(false); 
  const [position, setPosition] = useState({ top: 0, left: 0 }); 
  const [size, setSize] = useState({ width: 330, height: 500 }); 
  const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 }); 

  useEffect(() => {
    const getVideo = async () => {
      const constraints = {
        video: {
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          advanced: [{ zoom: { min: -10.0, ideal: -10.0, max: 10.0 } }]
        }
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera: ", err);
      }
    };

    getVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => {
          console.log(`Stopping track: ${track.kind}`);
          track.stop();
        });
      }
      console.log("Camera component unmounted and stream stopped.");
    };
  }, []);

  useEffect(() => {
    if (turnOff && videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
    }
  }, [turnOff]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setMouseStart({ x: e.clientX, y: e.clientY }); 
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - mouseStart.x;
      const deltaY = e.clientY - mouseStart.y;
      setPosition((prevPosition) => ({
        top: prevPosition.top + deltaY,
        left: prevPosition.left + deltaX
      }));
      setMouseStart({ x: e.clientX, y: e.clientY });
    } else if (isResizing) { 
      const deltaX = e.clientX - mouseStart.x;
      const deltaY = e.clientY - mouseStart.y;
      setSize((prevSize) => ({
        width: prevSize.width + deltaX,
        height: prevSize.height + deltaY
      }));
      setMouseStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false); 
    setIsResizing(false); 
  };

  useEffect(() => {
    if (turnOff && videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
    }
  }, [turnOff]);

  return (
    <div
      ref={containerRef} 
      className="camera-container"
      style={{ top: position.top, left: position.left, width: size.width, height: size.height }}
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp} 
      onMouseLeave={handleMouseUp} 
      onMouseDown={handleMouseDown} ng
    >
      <div className="resize-handle" onMouseDown={(e) => { setIsResizing(true); setMouseStart({ x: e.clientX, y: e.clientY }); }} /> 
      <video ref={videoRef} autoPlay className="camera-video" />
    </div>
  );
};

export default Camera;
