"use client"

import main_page_styles from "./main_page.module.css";
import room_page_styles from "./room_page.module.css";

import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket"
import MainPage from "./components/MainPage";
import RoomPage from "./components/RoomPage";

import Peer from "peerjs";


export default function Home() {
  const placeholderNames = [
    'Starlight Voyager',
    'Neon Nomad',
    'Thunderstrike Phoenix',
    'Cipher Shadow',
    'Lunar Echo',
    'Rogue Serpent',
    'Velocity Blaze',
    'Quantum Nomad',
    'Astral Phoenix',
    'Vortex Hawk',
  ];

  /*
      0 - MAIN SCREEN
      1 - JOINED ROOM
      2 - LEFT ROOM
  */

  const [Status, SetStatus] = useState(0)
  
  const InitialName = placeholderNames[parseInt(Math.random()*10)]
  const [Name, SetName] = useState()
  const [IsAdmin,SetIsAdmin] = useState(false)
  const [UserId, SetUserId] = useState(null)
  const [RoomCode, SetRoomCode] = useState(null)
  const [Participants, SetParticipants] = useState([])

  const socketRef = useRef(null)
  const peerRef = useRef(null)

  const [peerID, setPeerID] = useState(null)
  const [peerConnections, SetPeerConnections] = useState([])

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL

  useEffect(()=>{
    SetName(InitialName)
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerID(id)
      const socket = new WebSocket(WS_URL+'/?name='+InitialName+'&peerId='+id)
      // Connection opened
      socket.addEventListener("open", (event) => {
        console.log("CONNECTED TO THE WS SERVER!")
      })

      // Listen for messages
      socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data)
        console.log(message)

        switch(message.type){
          case "connection_successful":
            SetUserId(message.data.user_id)
            console.log("SERVER: CONNECTION SUCCESSFUL")
            break
          case "feedback":
            console.log("FEEDBACK: "+message.message)
            break;
          case "room_creation_successful":
            SetIsAdmin(true);
          case "room_join_successful":
            SetRoomCode(message.roomCode)
            SetParticipants(message.room_data.connections)
            SetStatus(1)
            break
          case "new_member":
            SetParticipants(message.room_data.connections)
            if(IsAdmin){
              let peerConns = message.room_data.connections.map(conn => conn.peerId);
              SetPeerConnections([...peerConns])
            }
            break
        }
      })

      socketRef.current = socket
    })
    peerRef.current = peer
  }, [])

  const sendJsonMessage = (message)=>{
    socketRef.current.send(JSON.stringify(message))
  }

  return (
    <main className={main_page_styles.main}>
      { Status == 0 ?
        <MainPage styles={main_page_styles} Name={Name} SetName={SetName} sendJsonMessage={sendJsonMessage}/> :
        <RoomPage styles={room_page_styles} sendJsonMessage={sendJsonMessage} RoomCode={RoomCode} Participants={Participants} UserId={UserId} IsAdmin={IsAdmin} peerRef={peerRef} peerConnections={peerConnections} />
      }
    </main>
  );
}
