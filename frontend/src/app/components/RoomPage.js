import Image from "next/image"
import { useRef, useEffect,useState } from "react";

const RoomPage = ({styles, sendJsonMessage, RoomCode, Participants, UserId, IsAdmin, peerRef, peerConnections})=>{

    const videoRef = useRef();
    const [streamData, setStreamData] = useState(null)
    let stream = null;
    
    useEffect(()=>{
      getUserMedia()
    }, [])

    const findHost = () => {
      const hostParticipant = Participants.find((participant) => participant.isHost);
      return hostParticipant ? hostParticipant.peerId : -1;
    };

    const getUserMedia = async () => {
      try {  
        if (IsAdmin) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          // Host logic
          peerRef.current.on('call', (call) => {
            call.answer(mediaStream);
          });
        } else {
          // Participant logic
          const createEmptyAudioTrack = () => {
            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const dst = oscillator.connect(ctx.createMediaStreamDestination());
            oscillator.start();
            const track = dst.stream.getAudioTracks()[0];
            return Object.assign(track, { enabled: false });
          };
          
          const createEmptyVideoTrack = ({ width, height }) => {
            const canvas = Object.assign(document.createElement('canvas'), { width, height });
            canvas.getContext('2d').fillRect(0, 0, width, height);
          
            const stream = canvas.captureStream();
            const track = stream.getVideoTracks()[0];
          
            return Object.assign(track, { enabled: false });
          };
          const audioTrack = createEmptyAudioTrack();
          const videoTrack = createEmptyVideoTrack({ width:640, height:480 });
          const mediaStream = new MediaStream([audioTrack,videoTrack]);
          const call = peerRef.current.call(findHost(), mediaStream);
          call.on('stream', (remoteStream) => {
            videoRef.current.srcObject = remoteStream;
            videoRef.current.play();
          });
        }
      } catch (error) {
        console.error('Error accessing user media:', error);
      }
    };
    return (
          <div className={styles.page}>
          <div className={styles.header}>{RoomCode}</div>
          <div className={styles.main_content}>
              <div className={styles.participants}>
              {
                  Participants.map((participant, index) => {
                      console.log(Participants)
                      return(participant.isHost ? 
                              <div key={index} className={styles.participant}>{participant.connectionId !== UserId ? <p>{participant.name}</p> : <p><b>{participant.name}</b></p>}<Image alt="ADMIN" src={'/icons/shield_person_FILL0_wght400_GRAD0_opsz24.svg'} width={20} height={20} /></div> :
                              <div key={index} className={styles.participant}>{participant.connectionId !== UserId ? <p>{participant.name}</p> : <p><b>{participant.name}</b></p>}</div>
                      )
                  })
              }
              </div>
              <div className={styles.video_container}>
                <video ref={videoRef}></video>
              </div>
          </div>
      </div>
    )
}

export default RoomPage

