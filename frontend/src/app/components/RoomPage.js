import Image from "next/image"
import { useRef, useEffect,useState } from "react";

const RoomPage = ({styles, sendJsonMessage, RoomCode, Participants, UserId, IsAdmin,peer})=>{

    const videoRef = useRef();
    let stream = null;
    const findAdmin = (arr) => {
        for(let element of arr)
        {
            if(element.isHost == true) return element.pId
        }
    }
    
    useEffect(() => {        
        const enableWebcam = async () => {
        try {
            if(IsAdmin) stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
            videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
        
        peer.current.on('call' , call=>{
            console.log(call)
            call.answer(stream);
            
            call.on('error' , (err)=>{
               console.log(err)
            })
            call.on("close", () => {
                console.log('call closed')
            })
            
          })

        };

        const nonAdmin = async () => {
            console.log(findAdmin(Participants))
            console.log(peer.current.call(findAdmin(Participants) , null))
            const conn = peer.current.connect(findAdmin(Participants));
            const call  = peer.current.call(findAdmin(Participants) , null);
            call.on('error' , (err)=>{
                console.log(err)
            })
            call.on('stream' , adminStream=>{

                console.log("receive stream ")
                if (videoRef.current) {
                    videoRef.current.srcObject = adminStream;
                    }
            })
            call.on('close' , ()=>{
                console.log("user disconect")
            })
            
        }        
        enableWebcam();
        if(!IsAdmin) nonAdmin();


    return () => {        
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