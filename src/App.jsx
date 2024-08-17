import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SongList from "./components/SongList";
import MusicPlayer from "./components/MusicPlayer";
import { fetchSongs } from "./api";
import chroma from "chroma-js";
import { motion } from "framer-motion";
import { Drawer, IconButton } from "@mui/material";
import { MdMenu } from "react-icons/md";

function App() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [view, setView] = useState("forYou");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadSongs = async () => {
      const allSongs = await fetchSongs();
      setSongs(allSongs);
      setFilteredSongs(allSongs);
     setSelectedSong(allSongs[0]);
    
    };
    loadSongs();
  }, []);

  useEffect(() => {
    setFilteredSongs(
      songs.filter(
        (song) =>
          song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, songs]);

  const [background, setBackground] = useState({
    lightShade: "black",
    darkShade: "black",
  });

  useEffect(() => {
    if (selectedSong) {
      const lightShade = chroma(selectedSong.accent).brighten().hex();
      const darkShade = chroma(selectedSong.accent).darken(2).hex();
      setBackground({ lightShade, darkShade });
    } else {
      setBackground({ lightShade: "black", darkShade: "black" });
    }
  }, [selectedSong]);

  const handleSelectSong = (song) => {
    setSelectedSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = filteredSongs.findIndex(
      (s) => s.id === selectedSong.id
    );
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    setSelectedSong(filteredSongs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const currentIndex = filteredSongs.findIndex(
      (s) => s.id === selectedSong.id
    );
    const previousIndex =
      (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    setSelectedSong(filteredSongs[previousIndex]);
    setIsPlaying(true);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === "topTracks") {
      setFilteredSongs(songs.filter((song) => song.top_track === true));
    } else {
      setFilteredSongs(songs);
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <motion.div
      className="flex flex-col lg:flex-row min-w-[100vw] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{
        background: `linear-gradient(90deg, ${background.lightShade}, ${background.darkShade})`,
        opacity: 1,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className=" lg:w-[20vw]">
        <Sidebar />
      </div>

      {/* Sidebar Button for Small Screens */}
      <div className="lg:hidden flex justify-start px-7">
        <IconButton onClick={toggleSidebar}>
          <MdMenu className="text-white" />
        </IconButton>
      </div>

      {/* Drawer for Small Screens */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            paddingX: "10px",
            paddingTop: "2rem",
          },
        }}
      >
        <div className="w-[65vw] p-2 mt-5">
          <SongList
            songs={filteredSongs}
            onSelectSong={handleSelectSong}
            onViewChange={handleViewChange}
            selectedSong={selectedSong}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            view={view}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      </Drawer>

      <div className="lg:w-[80vw] flex flex-col lg:flex-row lg:items-start">
        {/* Main SongList and MusicPlayer */}
        <div className="w-full lg:flex lg:w-[80vw] justify-around">
          <div className="h-screen lg:w-[35%] hidden lg:block">
            <SongList
              songs={filteredSongs}
              onSelectSong={handleSelectSong}
              onViewChange={handleViewChange}
              selectedSong={selectedSong}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              view={view}
            />
          </div>
          <MusicPlayer
            song={selectedSong || { name: "Loading Songs ..." }}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default App;
