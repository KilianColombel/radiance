import { useState, useRef, useEffect, useCallback } from 'react';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currSongID, setCurrSongID] = useState<number>(1);
  const [currTime, setCurrentTime] = useState(0);
  const [currVolume, setCurrVolume] = useState(() => Number(localStorage.getItem("volume")) || 0.5);
  
  // TODO need these infos
  const [currTrack, setCurrTrack] = useState("");
  const [currArtist, setCurrArtist] = useState("");
  const [currDuration, setDuration] = useState(200);
  const [currCoverPath, setCurrCoverPath] = useState("")

  useEffect(() => {
    if (currSongID && audioRef.current) {
      audioRef.current.onloadeddata = () => {
        if (isPlaying) {
          audioRef.current?.play();
        }
      };
    }
  }, [currSongID, isPlaying]);

  useEffect(() => {
    let intervalId: number;
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
    return () => clearInterval(intervalId);
  }, [isPlaying, currTime, currDuration]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currVolume;
      localStorage.setItem("volume", JSON.stringify(currVolume));
    }
  }, [currVolume]);
  
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleTrackSelection = useCallback((id: number) => {
    if (id === currSongID) {
      togglePlayPause();
    } else {
      setIsPlaying(true);
      setCurrentTime(0);
      setCurrSongID(id);
    }
  }, [currSongID, togglePlayPause]);

  const handleProgressChange = useCallback((newTime: number) => {
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setCurrVolume(newVolume);
  }, []);

  const handleSkipStart = useCallback(() => {
    handleProgressChange(0)
  }, [handleProgressChange]);

  const handleSkipEnd = useCallback(() =>{
    handleProgressChange(currDuration)
  }, [currDuration, handleProgressChange]);

  return {
    audioRef,
    controls: {
        isPlaying,
        currTime,
        currDuration,
        currVolume,
        currTrack,
        currArtist,
        handleTrackSelection,
        togglePlayPause,
        handleProgressChange,
        handleVolumeChange,
        handleSkipStart,
        handleSkipEnd,
        setCurrTrack,
        setCurrArtist,
        setCurrCoverPath
    },
    currSongID
  };
}
