import { useState, useRef, useLayoutEffect } from 'react'
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


  // HANDLE
  const [searchText, setSearchText] = useState<string>('');
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  };

  // HANDLE AUDIO
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  function handleTrackSelection() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className='app-container'>
      <audio ref={audioRef} src={`http://localhost:1234/api/audio/${2}`} onEnded={() => setIsPlaying(false)}></audio>


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
      <Player></Player>      
    </div>
  )
}

export default App
