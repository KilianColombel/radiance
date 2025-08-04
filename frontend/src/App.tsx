import { useState, useLayoutEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { customizeGlobalCursorStyles, type CustomCursorStyleConfig } from "react-resizable-panels";
import './App.css'

import Header from './header/Header.tsx';
import SidePanel from './sidepanel/SidePanel.tsx';
import MainContent from './maincontent/MainContent.tsx';
import Player from './player/Player.tsx';

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


  const [searchText, setSearchText] = useState<string>('');

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  };

  return (
    <div className='app-container'>
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
          <MainContent></MainContent>
        </Panel>
      </PanelGroup>
      <Player></Player>      
    </div>
  )
}

export default App
