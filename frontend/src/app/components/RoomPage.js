import { useDraw } from "../hooks/useDraw";
import { useRef, useEffect,useState } from "react";
import "aframe"
import "aframe-ar"
import Image from "next/image";

AFRAME.registerComponent('custom-controls', {
  init: function () {
    // Set initial position and rotation
    this.position = this.el.getAttribute('position');
    this.rotation = this.el.getAttribute('rotation');
    
    // Movement flags
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.rotateLeft = false
    this.rotateRight = false
    this.rotateDown = false
    this.rotateUp = false

    // Add event listeners for keydown and keyup events
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  },

  tick: function (time, delta) {
    if(
      !(this.moveForward ||
      this.moveBackward ||
      this.moveLeft ||
      this.moveRight ||
      this.moveUp ||
      this.moveDown ||
      this.rotateLeft ||
      this.rotateDown ||
      this.rotateRight ||
      this.rotateUp)) return
      // Calculate movement vector based on camera's orientation
      const movementVector = new THREE.Vector3(0, 0, 0);
      if (this.moveForward) movementVector.y -= 1;
      if (this.moveBackward) movementVector.y += 1;
      if (this.moveLeft) movementVector.x += 1;
      if (this.moveRight) movementVector.x -= 1;
      if (this.moveUp) movementVector.z -= 1;
      if (this.moveDown) movementVector.z += 1;

      // Rotate movement vector based on camera's rotation
      movementVector.applyQuaternion(this.el.object3D.quaternion);

      // Adjust the speed as needed
      movementVector.multiplyScalar(delta / 200);

      // Update position based on the adjusted movement vector
      this.position.x += movementVector.x;
      this.position.y += movementVector.y
      this.position.z += movementVector.z;

      // Apply updated position to the entity
      // this.el.setAttribute('position', this.position);
    // Handle rotation
    if (this.rotateLeft) {
      this.rotation.y += (50 * Math.PI) / 180;
    }
    if (this.rotateRight) {
      this.rotation.y -= (50 * Math.PI) / 180;
    }
    if (this.rotateUp) {
      this.rotation.x += (50 * Math.PI) / 180;
    }
    if (this.rotateDown) {
      this.rotation.x -= (50 * Math.PI) / 180;
    }

    // Apply updated rotation to the entity
    // this.el.setAttribute('rotation', this.rotation);
    
    this.el.emit('updateEntityState', {
      position: this.position,
      rotation: this.rotation,
    },)
  },

  onKeyDown: function (event) {
    switch (event.key) {
      case 'w':
        event.preventDefault()
        this.moveForward = true;
        break;
      case 's':
        this.moveBackward = true;
        break;
      case 'a':
        event.preventDefault()
        this.moveLeft = true;
        break;
      case 'd':
        this.moveRight = true;
        break;
      case 'q':
        this.moveUp = true;
        break;
      case 'e':
        this.moveDown = true;
        break;
      case 'j':
        this.rotateLeft = true;
        break;
      case 'l':
        this.rotateRight = true;
        break;
      case 'i':
        this.rotateUp = true;
        break;
      case 'k':
        this.rotateDown = true;
        break;
      default:
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
    }
  },

  onKeyUp: function (event) {    
    switch (event.key) {
      case 'w':
        this.moveForward = false;
        break;
      case 's':
        this.moveBackward = false;
        break;
      case 'a':
        this.moveLeft = false;
        break;
      case 'd':
        this.moveRight = false;
        break;
      case 'q':
        this.moveUp = false;
        break;
      case 'e':
        this.moveDown = false;
        break;
      case 'j':
        this.rotateLeft = false;
        break;
      case 'l':
        this.rotateRight = false;
        break;
      case 'i':
        this.rotateUp = false;
        break;
      case 'k':
        this.rotateDown = false;
        break;
    }
  }
});

const RoomPage = ({styles, sendJsonMessage, RoomCode, Participants, UserId, IsAdmin, peerRef})=>{

    const videoRef = useRef();
    const [entityState, setEntityState] = useState({position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}})
    const [peerConnections, SetPeerConnections] = useState({})
    
    useEffect(()=>{
      getUserMedia()
    }, [])

    useEffect(() => {
      const handleUpdateEntityState = (event) => {
        const { position, rotation } = event.detail;
        setEntityState({
          position,
          rotation,
        });
      };
  
      // Listen for the custom event
      window.addEventListener('updateEntityState', handleUpdateEntityState);
  
      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener('updateEntityState', handleUpdateEntityState);
      };
    }, []);
  
    useEffect(()=>{
      Object.keys(peerConnections).forEach(peer => {
        if(peerConnections[peer].open){
          peerConnections[peer].send(JSON.stringify({type: "state", entityState: entityState}))
        }
      })
    }, [entityState])

    const findHost = () => {
      const hostParticipant = Participants.find((participant) => participant.isHost);
      return hostParticipant ? hostParticipant.peerId : -1;
    };
    
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 905;
        canvas.height = 510;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
    }, []);

    const startDrawing = ({nativeEvent}) => {
        if(!IsAdmin) return
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        setIsDrawing(true);
        nativeEvent.preventDefault();
    };

    const draw = ({nativeEvent}) => {
        if(!isDrawing) {
            return;
        }
        
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        nativeEvent.preventDefault();
    };

    const stopDrawing = () => {
      if(peerConnections){
        Object.keys(peerConnections).forEach((peer) => {
          const data = {
            canvasData: canvasRef.current.toDataURL(),
          };
          peerConnections[peer].send(JSON.stringify({
            type: "ctx", data
          }));
        });
      }
      contextRef.current.closePath();
      setIsDrawing(false);
    };

    const setToDraw = () => {
        contextRef.current.globalCompositeOperation = 'source-over';
    };

    const setToErase = () => {
        contextRef.current.globalCompositeOperation = 'destination-out';
    };

    const saveImageToLocal = (event) => {
        let link = event.currentTarget;
        link.setAttribute('download', 'canvas.png');
        let image = canvasRef.current.toDataURL('image/png');
        link.setAttribute('href', image);
    };

    const getUserMedia = async () => {
      try {  
        if (IsAdmin) {
          var constraints = {
            audio: false,
            video: {
                width: { min: 1024, ideal: 1920, max: 1920 },
                height: { min: 576, ideal: 1080, max: 1080 },
            }
          };
          const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          peerRef.current.on('connection', (connection)=>{
            connection.on('open', ()=>{
              console.log("CONNECTED WITH PEER: "+connection.peer)
            })
            peerConnections[connection.peer] = connection
          })
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
          const videoTrack = createEmptyVideoTrack({ width:1000, height:600 });
          const mediaStream = new MediaStream([audioTrack,videoTrack]);
          const hostConnection = peerRef.current.connect(findHost())
          hostConnection.on('open', ()=>{
            console.log("CONNECTED TO THE HOST")
          })
          hostConnection.on('data', (unparseData)=>{
            const data = JSON.parse(unparseData)
            if(data.type == "state")
              setEntityState(data.entityState)
            if(data.type == "ctx")
            {
              const canvasData = data.data.canvasData;
              console.log(data)
              function isValidURL(str) {
                try {
                  new URL(str);
                  return true;
                } catch (error) {
                  return false;
                }
              }
              // Check if canvasData is a valid URL or base64-encoded data
              if (isValidURL(canvasData)) {
                const image = document.createElement("img");
                image.onload = () => {
                  const ctx = canvasRef.current.getContext('2d');
                  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                  ctx.drawImage(image, 0, 0);
                };
                image.src = canvasData;
              } else {
                console.error("Invalid canvasData:", canvasData);
              }
            }
          })
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
            <div className={styles.header}><div style={{marginRight: '10px'}}>{RoomCode}</div><Image style={{cursor: 'pointer'}} onClick={()=>{navigator.clipboard.writeText(RoomCode);}} src={'icons/content_copy_FILL0_wght400_GRAD0_opsz24.svg'} alt="copy" width={20} height={20} /></div>
            <div className={styles.main_content}>
                <div className={styles.video_container}>
                  <video ref={videoRef} className={styles.ar_video} id="ar-video" width={1000} height={510}></video>
                  {IsAdmin &&
                  <div className={styles.admin_controls}>
                    <a-scene embedded keyboard-shortcuts="enterVR: false" arjs="sourceType: 'webcam'; detectionMode: 'mono_and_matrix'; matrixCodeType: '3x3';">
                      <a-entity light="type: directional; color: #FFF; intensity: 1" position="-0.5 1 1"></a-entity>
                      <a-gltf-model draw-on-model src="/models/male_body.glb" scale="1 1 1" position={`${-entityState.position.x} ${-entityState.position.y} ${-entityState.position.z}`} rotation={`${entityState.rotation.x} ${entityState.rotation.y} ${entityState.rotation.z}`}></a-gltf-model>
                      <a-camera wasd-controls="enabled: false" custom-controls look-controls="enabled: false" user-controls="enabled: false"></a-camera>
                    </a-scene>
                  </div>}
                  <div className={styles.ar_frame}>
                    <a-scene embedded keyboard-shortcuts="enterVR: false" arjs="sourceType: 'webcam'; detectionMode: 'mono_and_matrix'; matrixCodeType: '3x3';">
                      <a-entity light="type: directional; color: #FFF; intensity: 1" position="-0.5 1 1"></a-entity>
                      <a-gltf-model draw-on-model src="/models/male_body.glb" scale="1 1 1" position={`${-entityState.position.x} ${-entityState.position.y} ${-entityState.position.z}`} rotation={`${entityState.rotation.x} ${entityState.rotation.y} ${entityState.rotation.z}`}></a-gltf-model>
                      <a-camera wasd-controls="enabled: false" look-controls="enabled: false" user-controls="enabled: false"></a-camera>
                    </a-scene>
                  </div>
                  
                  <canvas className={styles.overlay_canvas}
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}>
                </canvas>
                </div>
                <div className={styles.participants}>
                {
                    Participants.map((participant, index) => {
                        return(participant.isHost ? 
                                <div key={index} className={styles.participant}>{participant.connectionId !== UserId ? <p>{participant.name}</p> : <p><b>{participant.name}</b></p>}<img alt="ADMIN" src={'/icons/shield_person_FILL0_wght400_GRAD0_opsz24.svg'} width={20} height={20} /></div> :
                                <div key={index} className={styles.participant}>{participant.connectionId !== UserId ? <p>{participant.name}</p> : <p><b>{participant.name}</b></p>}</div>
                        )
                    })
                }
                </div>
            </div>
          </div>
    )
}

export default RoomPage

