import { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import './App.css'

function App() {

  return (
    <div className='app-container'>
      <div>search bar</div>
        <PanelGroup className='center-container' direction="horizontal">
          <Panel className='side-panel' defaultSize={25} minSize={15} maxSize={35}>
            right
          </Panel>
          <PanelResizeHandle style={{width: "5px"}}/>
          <Panel className="main-container" defaultSize={75} minSize={65}>
            left
          </Panel>
        </PanelGroup>
      <div >player</div>
    </div>
  )
}

export default App
