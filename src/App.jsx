import './App.css';
import vdo from './assets/onepiece.mp4';
import { useRef,useEffect } from 'react';
import {PiSpeakerSlashFill , PiSpeakerLowFill, PiSpeakerHighFill, PiDiceFourDuotone} from 'react-icons/pi';
import {RiFullscreenFill , RiFullscreenExitLine} from 'react-icons/ri';
import {BsBoxArrowInDownRight , BsBoxArrowInUpRight} from 'react-icons/bs';
import {FaPlay, FaPause} from 'react-icons/fa'
import {AiOutlineStepBackward, AiOutlineStepForward , AiOutlineFullscreenExit, AiOutlineFullscreen} from 'react-icons/ai';

const App = () => {
    const videoRef = useRef(null); 
    const perviewVideoRef = useRef(null);
    const inputRef = useRef(null);
    const videoLinkRef = useRef(null);
    const togglePlay = (e)=>{
        e.stopPropagation();
        videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    }
 // handle video file input
    const handleFileInputChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        const videoPlayer = videoRef.current;
        const videoSource = URL.createObjectURL(selectedFile); 
        videoPlayer.src = videoSource;
        perviewVideoRef.current.src = videoSource;
        videoPlayer.load();
        videoPlayer.play(); 
      }
    };

    const handleVideoLinkInput = ()=>{
           if(videoLinkRef.current.value){
           videoRef.current.src = videoLinkRef.current.value;
           perviewVideoRef.current.src = videoLinkRef.current.value;
           }
           else{
             alert("please enter a link first");
           }
    }
    const handleVolumeChange = (e)=>{
        e.stopPropagation();
        console.log(e.target.value)
        videoRef.current.volume = e.target.value;   
    }
    const handleToogleMute = (e)=>{
         e.stopPropagation();
         if(videoRef.current.volume===0) {
               videoRef.current.volume=1;
               inputRef.current.value= 1;
         }
        else {
             videoRef.current.volume = 0;
             inputRef.current.value = 0;
        }
    }

    const handleSkip = (v)=>{
         videoRef.current.currentTime  += v;
    }
   useEffect(()=>{
       const video_container = document.querySelector(".videoplayer-container");
       const video = document.querySelector("video");
       const timestatus = document.querySelector(".timestatus")
       const playBackRate = document.querySelector(".speed");
       const fullScreen = document.querySelector(".screen");
       const miniplayer = document.querySelector(".toggle-mini-player");
       const timeline_container = document.querySelector(".timeline-container");
       const preview_video = document.querySelector(".preview-video")
       const video_fill = document.querySelector(".video-fill");

       // erron handling
        video.onerror = ()=>{
            alert("this video is not playable");
            video.src =  vdo;
            preview_video.src = vdo;
        }

       // play/pause toogle
       video.addEventListener("pause" , ()=> video_container.classList.add("paused"));
       video.addEventListener("play" , ()=> video_container.classList.remove("paused"));
       // volume chnaging 
       video.addEventListener("volumechange" , ()=>{
          const volume = video.volume;
          console.log(volume);
         video_container.classList.remove("muted","high","low");
        if(volume===0) video_container.classList.add("muted");
        else  if(volume>0.5) video_container.classList.add("high");
         else    video_container.classList.add("low");
       })

       // timeline
       function addMouseEvents() {
        timeline_container.addEventListener("mousemove", handleTimelineUpdate);
        timeline_container.addEventListener("mousedown", toggleScrubbing);
        
        document.addEventListener("mouseup", e => {
          if (isScrubbing) toggleScrubbing(e);
        });
      
        document.addEventListener("mousemove", e => {
          if (isScrubbing) handleTimelineUpdate(e);
        });
      }
      
      let timeoutPointer
      function addTouchEvents() {
        
        video_container.addEventListener("touchstart" , ()=>{ 
          clearTimeout(timeoutPointer);
          video_container.classList.add("showControls")
        })
        video_container.addEventListener("touchend" , ()=>{
           timeoutPointer =  setTimeout( ()=>video_container.classList.remove("showControls") , 3000)
        })
        timeline_container.addEventListener('touchmove', handleTimelineUpdate);
        timeline_container.addEventListener("touchstart", toggleScrubbing);
        
        timeline_container.addEventListener("touchend", e => {
          if (isScrubbing) toggleScrubbing(e);
        });
      
        timeline_container.addEventListener("touchmove", e => {
          if (isScrubbing) handleTimelineUpdate(e);
        });
      }
      
      if (window.innerWidth > 900) {
        addMouseEvents();
      } else {
        addTouchEvents();
      }
      
      let isScrubbing = false
      let wasPaused

      function toggleScrubbing(e) {
        let x;
        if(e.x) x = e.x;
        else if(e.changedTouches[e.changedTouches.length - 1]){
         let touch = e.changedTouches[e.changedTouches.length - 1]
          x = touch.clientX
        }
        else{  
          let touch = e.touches[0];   x = touch.clientX; }
        const rect = timeline_container.getBoundingClientRect()
        const percent = Math.min(Math.max(0, x - rect.x), rect.width) / rect.width
        if(window.innerWidth<900)
             isScrubbing = (e.touches.length & 1) === 1
        else
            isScrubbing = (e.buttons & 1) ===1
        video_container.classList.toggle("scrubbing", isScrubbing)
        if (isScrubbing) {
          wasPaused = video.paused
          video.pause()
        } else {
          video.currentTime = percent * video.duration
          if (!wasPaused) video.play()
        }
      
        handleTimelineUpdate(e)
      }
      
      function handleTimelineUpdate(e) {
        const rect = timeline_container.getBoundingClientRect()
        let x;
        if(e.x){
           x = e.x;
        }
        else if(e.changedTouches[e.changedTouches.length - 1]){
        let  touch = e.changedTouches[e.changedTouches.length - 1]
          x = touch.clientX
       }
        else{
        let touch = e.touches[0];
         x = touch.clientX; 
        }
        const percent = Math.min(Math.max(0, x - rect.x), rect.width) / rect.width
        preview_video.currentTime = preview_video.duration*percent;
        // const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`
        // previewImg.src = previewImgSrc
        timeline_container.style.setProperty("--preview-position", percent)
      
        if ( isScrubbing) {
             
          // thumbnailImg.src = previewImgSrc
          timeline_container.style.setProperty("--progress-position", percent)
        }
        if (window.innerWidth<900)
           video.currentTime = percent * video.duration
      }

       // timeupdate events
       video.addEventListener("timeupdate", ()=>{
           let currentTime = formateTime(video.currentTime)
           let duration = formateTime(video.duration)
           const time =  `${currentTime}/${duration}`;
           timestatus.innerHTML = time;
           let percent = video.currentTime/video.duration;
           timeline_container.style.setProperty("--progress-position", percent)
       })
       video.addEventListener("loadeddata", ()=>{
           let currentTime = formateTime(video.currentTime)
           let duration = formateTime(video.duration)
           const time =  `${currentTime}/${duration}`;
            timestatus.innerHTML = time;
       }) 

       const formateTime = (TimeInSec)=>{
        let Timeformate;
        let Time = Math.floor(TimeInSec);
        let sec = (Time%60).toLocaleString('en-US', { minimumIntegerDigits: 2 });
        let min =  ((Math.floor(Time/60)) %60).toLocaleString('en-US', { minimumIntegerDigits: 2 });
        let hour = (Math.floor((Time/3600))%60).toLocaleString('en-US', { minimumIntegerDigits: 2 });
        if(hour==="00")   Timeformate = `${min}:${sec}`;
        else         Timeformate = `${hour}:${min}:${sec}`;
        return Timeformate;
       };

       // playbackrate 
       let speed = 1;
       playBackRate.addEventListener("click" , (e)=>{
          e.stopPropagation();
            speed += 0.25;
           if(speed>2) {speed = 1;}
             video.playbackRate = speed;
            playBackRate.innerHTML  = `${speed}x`;
            console.log(video.playbackRate);
       })
       
       // view
      
       video_fill.addEventListener("click", (e)=>{
               e.stopPropagation();
               video_container.classList.toggle("fill-vdo");
       })

       fullScreen.addEventListener("click" , (e)=>{
          e.stopPropagation();
          if (document.fullscreenElement == null) {
            video_container.requestFullscreen()
            video_container.classList.add("full-screen");
          } else {
            document.exitFullscreen()
            video_container.classList.remove("full-screen");
          }
       })
       
       // fullscreenextit for mobile by backbutton
       document.addEventListener("fullscreenchange", ()=> {
            if(document.fullscreenElement==null){ 
              console.log("remove full-screen")  
             video_container.classList.remove("full-screen")}
            }
            );

       miniplayer.addEventListener("click" , (e)=>{
          e.stopPropagation();
        if (video_container.classList.contains("mini-player")) {
             document.exitPictureInPicture()
          } else {
            if(document.fullscreenElement){
              document.exitFullscreen()
              video_container.classList.remove("full-screen");  
            } 
            video.requestPictureInPicture()
          }
       })

       video.addEventListener("enterpictureinpicture", () => {
        video_container.classList.add("mini-player")
      })
      
      video.addEventListener("leavepictureinpicture", () => {
        video_container.classList.remove("mini-player")
      })
    
   },[]);
  return (
    <div>
        <div className={`videoplayer-container max-w-[1900px] mx-auto min-[801px]:w-[800px] w-full paused high `}> 
              <div onClick={togglePlay} className="videoplayer  relative">
                  <video ref={videoRef} className='w-full h-full video'>
                      <source src={vdo} type='video/mp4' />
                  </video>
                  <div className="video-controls pb-3 px-2 absolute bottom-0 left-0 right-0
                  flex-col"> 
                      <div className='timeline-container w-[98%] h-[7px] flexCenter py-2 mx-auto cursor-pointer'  onClick={(e)=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()}>
                            <div className="preview-img">
                               <video ref={perviewVideoRef} className='preview-video w-full h-full'>
                                <source src={vdo} />
                               </video>
                            </div>
                        <div className='timeline w-full h-[5px] bg-slate-500 relative'>
                              <div className='thumbnail-indicator'></div>
                            </div>
                        </div>
                     <div className='flexCenter'>
                        <button className='max-[500px]:hidden block'>
                           <AiOutlineStepBackward className='btn' onClick={(e)=>{ e.stopPropagation();handleSkip(-10)}}/>
                        </button>
                        <button className="btn toogle_play flex" onClick={togglePlay}>
                          <FaPause className='play'/> 
                          <FaPlay className='pause'/>
                          </button>
                          <button className='max-[500px]:hidden block'>
                            <AiOutlineStepForward className='btn' onClick={(e)=>{ e.stopPropagation();handleSkip(10)}}/>
                          </button>
                         <button className="btn sound" onClick={handleToogleMute}>
                          <PiSpeakerSlashFill className='muted'/>
                          <PiSpeakerHighFill className=' high' />
                          <PiSpeakerLowFill className='low'/>
                          </button>
                          <input ref={inputRef} type="range" max="1" min="0" defaultValue="1" step={0.1} onClick={(e)=>e.stopPropagation()}  onChange={handleVolumeChange} />
                         <div className='timestatus flex-1 text-[13px] text-white'>0:0/1:0</div>
                           
                         <button className='btn video-fill'>
                            <AiOutlineFullscreen className='fill-video'/>
                            <AiOutlineFullscreenExit className='fill-video-exit'/>
                          </button>  
                         <button className="btn speed text-white">1x</button>
                         <button className='btn toggle-mini-player'>
                             <BsBoxArrowInDownRight className='mini-player-enter'/>
                             <BsBoxArrowInUpRight className='mini-player-leave'/>
                             </button>
                         <button className='btn screen'>
                           <RiFullscreenFill className='full-screen-enter'/>
                           <RiFullscreenExitLine className='full-screen-exit'/>
                          </button>
                        </div>
                  </div>
              </div>
        </div>

        <div className='features flex flex-col gap-y-5'>
            <div className='max-auto flexCenter mt-10'>
            <input
                type="file"
                accept="video/*" 
                onChange={(e) => handleFileInputChange(e)}
                className='bg-black text-white'
                />
               </div>
             
             <div className='flexCenter'>
                <input ref={videoLinkRef} type="link" placeholder='video download link' className='border-2 border-gray-400 pl-2 rounded-sm min-w-0 max-w-[200px]' />
                <button className='bg-black text-white rounded-full px-4 py-1 font-bold ml-3'
                   onClick={handleVideoLinkInput}
                   >Play</button>
             </div>
         </div>

    </div>
  )
}

export default App

