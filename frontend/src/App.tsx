import { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import './App.css'

function App() {

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
        <Panel className='side-panel' collapsible={true} collapsedSize={3} defaultSize={25} minSize={10} maxSize={35}>
          left
        </Panel>
        <PanelResizeHandle className='resize-handle' style={{width: "6px"}}/>
        <Panel className="main-container" defaultSize={75} minSize={65}>
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
