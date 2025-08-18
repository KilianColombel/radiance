import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { customizeGlobalCursorStyles, type CustomCursorStyleConfig } from "react-resizable-panels";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import Header from './header/Header.tsx';
import SidePanel from './sidepanel/SidePanel.tsx';
import TrackList from './maincontent/TrackList.tsx';
import Player from './player/Player.tsx';

function App() {
  // HANDLE SEPARATOR CURSOR
  useLayoutEffect(() => {
     function customCursor({ isPointerDown }: CustomCursorStyleConfig) {
       return isPointerDown ? "grabbing" : "grab";
     }
     customizeGlobalCursorStyles(customCursor);
     return () => {
       customizeGlobalCursorStyles(null);
     };
   }, []);


  // HANDLE SEARCH BAR
  const [searchText, setSearchText] = useState<string>('');
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  };

  // HANDLE AUDIO
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currSongID, setCurrSongID] = useState<number>(1);
  // triggered everytime currSongID changes
  useEffect(() => {
    if (currSongID && audioRef.current) {
        audioRef.current.onloadeddata = () => {
          if(isPlaying) {
            audioRef.current?.play();
            setIsPlaying(true);
          }
        };
    }
  }, [currSongID]);
  function togglePlayPause() {
    if (!isPlaying) {
      audioRef?.current?.play();
      setIsPlaying(true);
    }
    else {
      audioRef?.current?.pause();
      setIsPlaying(false)
    }
  }
  function handleTrackSelection(id: number) {
    if (id === currSongID) {
      togglePlayPause();
    } 
    else {
      setIsPlaying(true);
      setCurrentTime(0);
      setCurrSongID(id);
    }
  };

  // HANDLE CONTROLS
  const [currTime, setCurrentTime] = useState(0);
  const [currVolume, setCurrVolume] = useState(Number(localStorage.getItem("volume")) || 0.5);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currVolume;
      localStorage.setItem("volume", JSON.stringify(currVolume))
    }

  }, [currVolume]);

  const [currTrack, setCurrTrack] = useState("Track");
  const [currArtist, setCurrArtist] = useState("Artist");
  // TODO get the currDuration
  const [currDuration, setDuration] = useState(200);

  const handlePlayPause = useCallback(() => {
    togglePlayPause();
  }, [isPlaying]);
  const handleSkipStart = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
  }, []);
  const handleSkipEnd = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currDuration;
    }
    setCurrentTime(currDuration);
  }, [currDuration]);
  const handleProgressChange = useCallback((newTime: number) => {
    if (audioRef.current){
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  }, []);
  const handleVolumeChange = useCallback((newVolume: number) => {
    if (audioRef.current){
      audioRef.current.volume = newVolume;
    }
    setCurrVolume(newVolume);
  }, []);

  useEffect(() => {
    // this manages the timer
    let intervalId = 0;
    if (isPlaying && currTime < currDuration) {
      intervalId = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime + 1 >= currDuration) {
            setIsPlaying(false);
            return currDuration;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    // remove timers that would run in parallel
    return () => clearInterval(intervalId);
  }, [isPlaying, currTime, currDuration]);



  return (
    <div className='app-container'>
      <audio ref={audioRef} src={`http://localhost:1234/api/audio/${currSongID}`} onEnded={() => setIsPlaying(false)}></audio>


      <Header searchText={searchText} onSearchChange={handleSearchChange} />
      <PanelGroup className='center-container' direction="horizontal">
        {/* TODO this needs an absolute collapsedSize to keep consistency across screen sizes but the units="pixels" property isn't supported anymore it seems
            should i revert to a previous version or make it myself
         */}
        <Panel collapsible={true} collapsedSize={4} defaultSize={20} minSize={10} maxSize={30}>
          <SidePanel></SidePanel>
        </Panel>
        <PanelResizeHandle className='resize-handle'/>
        <Panel >
          <BrowserRouter>
            <Routes>
              <Route path="/list/:id" element={<TrackList onTrackSelect={handleTrackSelection} />} />
            </Routes>
          </BrowserRouter>
        </Panel>
      </PanelGroup>
      <Player
        currTitle={currTrack}
        currArtist={currArtist}
        currDuration={currDuration}
        currTime={currTime}
        currVolume={currVolume}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onSkipStart={handleSkipStart}
        onSkipEnd={handleSkipEnd}
        onProgressChange={handleProgressChange}
        onVolumeChange={handleVolumeChange}
      />      
    </div>
  )
}

export default App
