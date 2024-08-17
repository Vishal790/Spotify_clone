import { Drawer } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { IoIosMore } from "react-icons/io";

const MusicPlayer = ({
  song = { name: "", artist: "", cover: "", url: "" },
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1); 
  const [isDragging, setIsDragging] = useState(false); 

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, song]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = () => {
    if (!isDragging) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleSeek = (event) => {
    const width = event.target.clientWidth;
    const clickX = event.nativeEvent.offsetX;
    const duration = audioRef.current.duration;
    audioRef.current.currentTime = (clickX / width) * duration;
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    handleSeek(event);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      handleSeek(event);
    }
  };

  const handleLoadedMetadata = () => {
    setProgress(0);
  };

  const toggleVolume = () => {
    setVolume((prevVolume) => (prevVolume > 0 ? 0 : 1));
  };
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="  lg:w-[40%] w-10/12 mx-auto  lg:p-6 flex flex-col mt-16">
      <div className="text-white mb-6">
        <h2 className="text-3xl mb-2 font-bold">
          {song.name ? song.name : "Loading Songs..."}
        </h2>
        <p className="text-sm text-gray-400">{song.artist}</p>
      </div>

      {song.cover ? (
        <img
          src={`https://cms.samespace.com/assets/${song.cover}`}
          alt={song.name}
          className=" h-[300px] lg:h-auto lg:w-full   lg:aspect-[11/12] object-cover rounded-lg mb-6"
        />
      ) : (
        <div className=" flex items-center justify-center min-h-[300px] lg:h-auto lg:w-full   lg:aspect-[11/12] object-cover rounded-lg mb-6">
          <div className="spinner"></div>
        </div>
      )}

      <div
        className="relative w-full h-1 bg-gray-600 rounded-lg cursor-pointer mb-4"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClick={handleSeek}
      >
        <div
          className="absolute top-0 left-0 h-full bg-white rounded-lg"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center w-full mb-4 text-gray-400">
        <IoIosMore className="text-4xl font-bold p-2 bg-white bg-opacity-5 rounded-full text-white" />

        <div className="flex gap-x-5 items-center">
          <FaBackward onClick={onPrevious} className="cursor-pointer text-xl" />
          <button
            onClick={onPlayPause}
            className="text-black bg-white rounded-full p-3 text-xl"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <FaForward onClick={onNext} className="cursor-pointer text-xl" />
        </div>
        <div className="flex items-center gap-x-3">
          <button
            onClick={toggleVolume}
            className="text-xl p-2 font-bold bg-white bg-opacity-5 rounded-full text-white"
          >
            {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};

export default MusicPlayer;
