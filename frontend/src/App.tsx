import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

// components
import Header from './header/Header.tsx';
import SidePanel from './sidepanel/SidePanel.tsx';
import TrackList from './maincontent/TrackList.tsx';
import Player from './player/Player.tsx';

// hooks
import { useCustomCursor } from './hooks/customCursor';
import { useResponsivePanels } from './hooks/responsivePanels';
import { useAudioPlayer } from './hooks/audioControls';
import { searchBar } from './hooks/searchBar.ts';

function App() {
  useCustomCursor();
  const { collapsedSizePercentage, minSizePercentage, maxSizePercentage, defaultSizePercentage } = useResponsivePanels();
  const { audioRef, controls, currSongID } = useAudioPlayer();
  const { searchText, handleSearchChange } = searchBar();

  useEffect (() => {
    controls.setCurrTrack("Test")
    controls.setCurrArtist("Artist")
    controls.setCurrCoverPath("Cover.jpg")
  }, [])
    

  return (
    <div className='app-container'>
      <audio ref={audioRef} src={`http://localhost:1234/api/audio/${currSongID}`} onEnded={() => controls.togglePlayPause()}></audio>


      <Header searchText={searchText} onSearchChange={handleSearchChange} />
      <PanelGroup className='center-container' direction="horizontal">
        {/* TODO this needs an absolute collapsedSize to keep consistency across screen sizes but the units="pixels" property isn't supported anymore it seems
            should i revert to a previous version or make it myself
         */}
        <Panel id="side-panel" collapsible={true} collapsedSize={collapsedSizePercentage} minSize={minSizePercentage} maxSize={maxSizePercentage} defaultSize={defaultSizePercentage}>
          <SidePanel></SidePanel>
        </Panel>
        <PanelResizeHandle className='resize-handle'/>
        <Panel >
          <BrowserRouter>
            <Routes>
              <Route path="/list/:id" element={<TrackList onTrackSelect={controls.handleTrackSelection} />} />
            </Routes>
          </BrowserRouter>
        </Panel>
      </PanelGroup>
      <Player
        currTitle={controls.currTrack}
        currArtist={controls.currArtist}
        currDuration={controls.currDuration}
        currTime={controls.currTime}
        currVolume={controls.currVolume}
        isPlaying={controls.isPlaying}
        onPlayPause={controls.togglePlayPause}
        onSkipStart={controls.handleSkipStart}
        onSkipEnd={controls.handleSkipEnd}
        onProgressChange={controls.handleProgressChange}
        onVolumeChange={controls.handleVolumeChange}
      />      
    </div>
  )
}

export default App
