import Image from "next/image"
import { useRef, useEffect,useState } from "react";
import Peer from "peerjs";
import io from 'socket.io-client';

const RoomPage = ({styles, sendJsonMessage, RoomCode, Participants, UserId, IsAdmin})=>{

    const videoRef = useRef();
    let stream = null;
    const peer = new Peer();
    const [peerConnections,SetPeerConnections] = useState({})
    useEffect(() => {

        
        const socket = io(process.env.NEXT_PUBLIC_STREAM_URL);
        

            socket.on('userJoined' , id=>{
                console.log("new user joined")
                const call  = peer.call(id , stream);
                call.on('error' , (err)=>{
                console.log(err)
                })
                call.on('close' , ()=>{
                console.log("user disconect")
                })
                let tempConnections = peerConnections
                tempConnections[call.peer] = call
                SetPeerConnections(temp)
            })
            
            socket.on('userDisconnect' , id=>{
                if(peerConnections[id]){
                peerConnections[id].close();
                }
            })
        
        
        
        const enableWebcam = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
            videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }

        peer.on('call' , call=>{
            call.answer(stream);
            
            call.on('error' , (err)=>{
               console.log(err)
            })
            call.on("close", () => {
                console.log('call closed')
            })
            let tempConnections = peerConnections
            tempConnections[call.peer] = call
            SetPeerConnections(temp)
          })

        };

        const nonAdmin = async () => {
            peer.on('call' , call=>{
                call.answer(stream);
                call.on('stream' , adminStream=>{
                    console.log("receive stream ")
                    if (videoRef.current) {
                        videoRef.current.srcObject = adminStream;
                        }
                  })
                call.on('error' , (err)=>{
                   console.log(err)
                })
                call.on("close", () => {
                    console.log('call closed')
                })
                let tempConnections = peerConnections
                tempConnections[call.peer] = call
                SetPeerConnections(temp)
              })
        }

        

        peer.on('open', id => {
        console.log('My Peer ID:', id);
        if(IsAdmin) enableWebcam();
        else nonAdmin();
        socket.emit("newUser" , id , RoomCode);
        });

        peer.on('error', error => {
        console.error('PeerJS Error:', error);
        });


    

    



    return () => {

        peer.destroy();
        socket.disconnect();
        
      // Clean up code to stop the webcam stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
    return (
    <div>
        <video ref={videoRef} autoPlay playsInline width="640" height="480"></video>
    </div>
    )
}

export default RoomPage

// <div className={styles.page}>
//             <div className={styles.header}>{RoomCode}</div>
//             <div className={styles.main_content}>
//                 <div className={styles.participants}>
//                 {
//                     Participants.map((participant, index) => {
//                         console.log(Participants)
//                         return(participant.isHost ? 
//                                 <div key={index} className={styles.participant}>{participant.connectionId !== UserId ? <p>{participant.name}</p> : <p><b>{participant.name}</b></p>}<Image alt="ADMIN" src={'/icons/shield_person_FILL0_wght400_GRAD0_opsz24.svg'} width={20} height={20} /></div> :
//                                 <div key={index} className={styles.participant}>{participant.connectionId !== UserId ? <p>{participant.name}</p> : <p><b>{participant.name}</b></p>}</div>
//                         )
//                     })
//                 }
//                 </div>
//             </div>
//         </div>