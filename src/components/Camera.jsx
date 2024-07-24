import React, { useEffect, useRef } from 'react';
import '../styles/Camera.css';

const Camera = ({ turnOff }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const getVideo = async () => {
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

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay className="camera-video" />
    </div>
  );
};

export default Camera;
