import { useState, useLayoutEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { customizeGlobalCursorStyles, type CustomCursorStyleConfig } from "react-resizable-panels";
import './App.css'

function App() {
  useLayoutEffect(() => {
     function customCursor({ isPointerDown }: CustomCursorStyleConfig) {
       return isPointerDown ? "grabbing" : "grab";
     }
     customizeGlobalCursorStyles(customCursor);
     return () => {
       customizeGlobalCursorStyles(null);
     };
   }, []);

  return (
    <div className='app-container'>
      <div className='header-bar'>
        <div className='quick-nav'>
          <i className="bi bi-chevron-left"></i>
          <i className="bi bi-chevron-right"></i>
          <i className="bi bi-arrow-clockwise"></i>
        </div>
        <input className="search-bar" type="text" />
        <div className='user-account'>
          <i className="bi bi-person-circle"></i>
          <div>Your Name</div>
        </div>
      </div>
      <PanelGroup className='center-container' direction="horizontal">
        {/* TODO this needs an absolute collapsedSize to keep consistency across screen sizes but the units="pixels" property isn't supported anymore it seems
            should i revert to a previous version or make it myself
         */}
        <Panel collapsible={true} collapsedSize={4} defaultSize={20} minSize={10} maxSize={30}>
          <div className='side-panel'>
            <div className='library'>
              <div className='library-entry'><h1>library</h1></div>
              <div className="library-item"><i className="bi bi-disc-fill"></i><div className="item-name">albums</div></div>
              <div className="library-item"><i className="bi bi-person-fill"></i><div className="item-name">artists</div></div>
              <div className="library-item"><i className="bi bi-people-fill"></i><div className="item-name">genres</div></div>
              <div className="library-item"><i className="bi bi-music-note"></i><div className="item-name">titles</div></div>
            </div>
            <div className='playlists'>
              <div className='library-entry'><h1>playlists</h1><div className='library-separator'></div></div>
              <div className="library-item"><i className="bi bi-music-note-list"></i><div className="item-name">playlist 1</div></div>
              <div className="library-item"><i className="bi bi-music-note-list"></i><div className="item-name">playlist 2</div></div>
              <div className="library-item"><i className="bi bi-music-note-list"></i><div className="item-name">playlist 3</div></div>
              <div className="library-item"><i className="bi bi-music-note-list"></i><div className="item-name">playlist 4</div></div>
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className='resize-handle'/>
        <Panel className="main-container">
          middle
        </Panel>
      </PanelGroup>
          
      <div className='bottom-player'>
        <audio src=""></audio>
        <div className='left-infos'>
          <img src="https://ia800305.us.archive.org/15/items/mbid-f1dd454a-6705-4828-97d8-57a423451c06/mbid-f1dd454a-6705-4828-97d8-57a423451c06-35311231946_thumb500.jpg" alt="" />
          <div className='item-infos'>
            <div className='title-name'>Radiance</div>
            <div className='artist-name'>Tim Hecker</div>
          </div>
          <i className="bi bi-star"></i>
        </div>
        <div className='middle-controls'>
          <div className='controls-container'>
            <i className="bi bi-skip-start"></i>
            <i className="bi bi-play"></i>
            <i className="bi bi-skip-end"></i>
          </div>
          <div className='progress-slider'>
            <div>0:00</div>
            <input type="range" />
            <div>6:66</div>
          </div>
        </div>
        <div className='right-controls'>
          <input type="range" />
          <i className="bi bi-plus-square"></i>
        </div>
      </div>
    </div>
  )
}

export default App
