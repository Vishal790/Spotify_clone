import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";

const SongList = ({
  songs,
  onViewChange,
  searchTerm,
  onSearchChange,
  onSelectSong,
  selectedSong,
  view,
  setIsSidebarOpen,
}) => {
  const [songDurations, setSongDurations] = useState({});

  useEffect(() => {
    songs.forEach((song) => {
      if (!songDurations[song.id]) {
        const audio = new Audio(song.url);
        audio.addEventListener("loadedmetadata", () => {
          setSongDurations((prevDurations) => ({
            ...prevDurations,
            [song.id]: audio.duration,
          }));
        });
      }
    });
  }, [songs]);

  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, translateY: -20 }, 
    visible: { opacity: 1, translateY: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full h-full py-6 lg:flex flex-col gap-y-3">
      {/* Tabs */}
      <div className="flex space-x-8 mb-4">
        <button
          onClick={() => onViewChange("forYou")}
          className={`${
            view === "forYou" ? "text-white" : " text-white text-opacity-50"
          } font-bold text-lg lg:text-2xl  `}
        >
          For You
        </button>
        <button
          onClick={() => onViewChange("topTracks")}
          className={`${
            view === "topTracks" ? "text-white" : " text-white text-opacity-50"
          } font-bold text-lg lg:text-2xl  `}
        >
          Top Tracks
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search Song, Artist"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-[100%] p-2 rounded-md pr-10 text-white text-opacity-90 bg-white outline-none bg-opacity-10"
        />
        <span className="absolute top-1/2 transform -translate-x-10 -translate-y-1/2 text-xl font-bold text-gray-400">
          <CiSearch />
        </span>
      </div>

      {/* Song List */}
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4 mt-3"
      >
        {songs.map((song) => (
          <motion.li
            key={song.id}
            className={`${
              selectedSong === song && " bg-white bg-opacity-10 rounded-lg "
            } w-full  flex justify-between items-center cursor-pointer hover:bg-white hover:bg-opacity-5 hover:rounded-lg  `}
            onClick={() => {
              onSelectSong(song);
            }}
            variants={listItemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between w-full p-2 px-3 ">
              <div className="flex gap-x-3">
                <img
                  src={`https://cms.samespace.com/assets/${song.cover}`}
                  alt={song.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-white text-opacity-90">
                    {song.name}
                  </h4>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
              <h2 className="text-gray-400">
                {formatDuration(songDurations[song.id])}
              </h2>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default SongList;
