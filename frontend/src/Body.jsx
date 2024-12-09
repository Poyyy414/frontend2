
import React, { useState, useRef, useEffect } from 'react';
import './Body.css';
import dharman from './assets/dharman.mp4';
import kisapmataSolo from './assets/kisapmata-solo.mp4';
import heart from './assets/heart.png';
import comment from './assets/comment.png';
import favorite from './assets/bookmark.png';
import share from './assets/share.png';

export function Body() {
  const [videoState, setVideoState] = useState({
    video1State: {
      isPlaying: false,
      likeCount: 0,
      commentCount: 0,
    },
    video2State: {
      isPlaying: false,
      likeCount: 0,
      commentCount: 0,
    },
  });

  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  // Function to handle play/pause toggling and pause other videos
  const handlePlayPause = (videoNumber) => {
    if (videoNumber === 1 && videoState.video2State.isPlaying) {
      videoRef2.current.pause();
      setVideoState((prevState) => ({
        ...prevState,
        video2State: { ...prevState.video2State, isPlaying: false },
      }));
    } else if (videoNumber === 2 && videoState.video1State.isPlaying) {
      videoRef1.current.pause();
      setVideoState((prevState) => ({
        ...prevState,
        video1State: { ...prevState.video1State, isPlaying: false },
      }));
    }

    // Toggle the video clicked
    if (videoNumber === 1) {
      const newState = !videoState.video1State.isPlaying;
      setVideoState((prevState) => ({
        ...prevState,
        video1State: { ...prevState.video1State, isPlaying: newState },
      }));
      if (newState) videoRef1.current.play();
      else videoRef1.current.pause();
    } else if (videoNumber === 2) {
      const newState = !videoState.video2State.isPlaying;
      setVideoState((prevState) => ({
        ...prevState,
        video2State: { ...prevState.video2State, isPlaying: newState },
      }));
      if (newState) videoRef2.current.play();
      else videoRef2.current.pause();
    }
  };

  // Observer function to detect when videos enter/exit the viewport
  const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      const videoRef = entry.target === videoRef1.current ? videoRef1 : videoRef2;
      const videoKey = entry.target === videoRef1.current ? 'video1State' : 'video2State';

      if (entry.isIntersecting && !videoState[videoKey].isPlaying) {
        videoRef.current.play();
        setVideoState((prevState) => ({
          ...prevState,
          [videoKey]: { ...prevState[videoKey], isPlaying: true },
        }));
      } else if (!entry.isIntersecting && videoState[videoKey].isPlaying) {
        videoRef.current.pause();
        setVideoState((prevState) => ({
          ...prevState,
          [videoKey]: { ...prevState[videoKey], isPlaying: false },
        }));
      }
    });
  };

  // Set up the IntersectionObserver when component mounts
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // 50% of the video must be visible to be considered in view
    });

    // Start observing the videos
    if (videoRef1.current) observer.observe(videoRef1.current);
    if (videoRef2.current) observer.observe(videoRef2.current);

    // Clean up observer on component unmount
    return () => {
      if (videoRef1.current) observer.unobserve(videoRef1.current);
      if (videoRef2.current) observer.unobserve(videoRef2.current);
    };
  }, [videoState]);

  // Handle like button click
  const handleLike = (videoState, setVideoState) => {
    setVideoState((prevState) => ({
      ...prevState,
      [videoState]: { ...prevState[videoState], likeCount: prevState[videoState].likeCount + 1 },
    }));
  };

  // Handle comment button click
  const handleCommentToggle = (videoState, setVideoState) => {
    setVideoState((prevState) => ({
      ...prevState,
      [videoState]: { ...prevState[videoState], commentCount: prevState[videoState].commentCount + 1 },
    }));
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Home</h2>
        <h2>Explore</h2>
        <h2>Messages</h2>
        <h2>Notifications</h2>
        <h2>Settings</h2>
        <div className="logout-btn">
          <button>Logout</button>
        </div>
      </div>

      {/* Main Content with Scrollable Section */}
      <div className="main-content">
        {/* Video Section 1 */}
        <div className="video-section">
          <div className="video-container">
            <video ref={videoRef1} loop onClick={() => handlePlayPause(1)}>
              <source src={dharman} type="video/mp4" />
            </video>
            <div className="video-controls">
              <div className="control-icon">
                <img
                  src={heart}
                  alt="Like"
                  onClick={() => handleLike('video1State', setVideoState)}
                />
                <span>{videoState.video1State.likeCount}</span>
              </div>
              <div className="control-icon">
                <img
                  src={comment}
                  alt="Comment"
                  onClick={() => handleCommentToggle('video1State', setVideoState)}
                />
                <span>{videoState.video1State.commentCount}</span>
              </div>
              <div className="control-icon">
                <img src={favorite} alt="Bookmark" />
              </div>
              <div className="control-icon">
                <img src={share} alt="Share" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Section 2 */}
        <div className="video-section">
          <div className="video-container">
            <video ref={videoRef2} loop onClick={() => handlePlayPause(2)}>
              <source src={kisapmataSolo} type="video/mp4" />
            </video>
            <div className="video-controls">
              <div className="control-icon">
                <img
                  src={heart}
                  alt="Like"
                  onClick={() => handleLike('video2State', setVideoState)}
                />
                <span>{videoState.video2State.likeCount}</span>
              </div>
              <div className="control-icon">
                <img
                  src={comment}
                  alt="Comment"
                  onClick={() => handleCommentToggle('video2State', setVideoState)}
                />
                <span>{videoState.video2State.commentCount}</span>
              </div>
              <div className="control-icon">
                <img src={favorite} alt="Bookmark" />
              </div>
              <div className="control-icon">
                <img src={share} alt="Share" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
