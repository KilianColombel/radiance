import LibrarySection from './LibrarySection.tsx';
import PlaylistsSection from './PlaylistsSection.tsx';
import './SidePanel.css';

function SidePanel() {
  return (
    <div className='side-panel'>
      <LibrarySection />
      <PlaylistsSection />
    </div>
  );
};

export default SidePanel;