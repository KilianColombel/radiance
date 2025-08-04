function TrackHeader() {
  return (
    <div className='track-container sort-container'>
      <div></div>
      <div className='sort-title'><i className="bi bi-chevron-down"></i><i className="bi bi-chevron-up"></i>title</div>
      <div className="sort-artist"><i className="bi bi-chevron-down"></i><i className="bi bi-chevron-up"></i>artist</div>
      <div className="sort-album"><i className="bi bi-chevron-down"></i><i className="bi bi-chevron-up"></i>album</div>
      <div className="sort-duration"><i className="bi bi-chevron-down"></i><i className="bi bi-chevron-up"></i><i className="bi bi-clock"></i></div>
    </div>
  );
};

export default TrackHeader;