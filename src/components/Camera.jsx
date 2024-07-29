import React, { useEffect, useRef, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import '../styles/Camera.css';
import 'react-resizable/css/styles.css'; 

const Camera = ({ turnOff }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
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
    if (e.target.classList.contains('resize-handle')) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
      setMouseStart({ x: e.clientX, y: e.clientY });
    }
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
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  return (
    <div
      ref={containerRef}
      className="camera-container"
      style={{ top: position.top, left: position.left, width: size.width, height: size.height }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={handleMouseDown}
    >
      <ResizableBox
        width={size.width}
        height={size.height}
        minConstraints={[100, 100]}
        maxConstraints={[800, 800]}
        onResize={(e, data) => {
          setSize({ width: data.size.width, height: data.size.height });
        }}
        handle={<span className="resize-handle" />}
        resizeHandles={['se']}
      >
        <video ref={videoRef} autoPlay className="camera-video" />
      </ResizableBox>
    </div>
  );
};

export default Camera;