import { useState, useRef } from "react"
import Image from "next/image";


const MainPage = ({styles, Name, SetName, sendJsonMessage}) => {

    const [DropDownOpen, SetDropDownOpen] = useState(false)
    const [EditName, SetEditName] = useState(false)
    const [CanvasStream, SetCanvasStream] = useState(null)
    const editNameRef = useRef(null)
    const roomCodeRef = useRef(null)

    return (
        <div className={styles.page}>
            <div className={styles.navbar}>
                <div className={styles.top_text}>MediVision</div>
                {/* <div className={styles.account_circle} onClick={()=>{
                SetDropDownOpen(!DropDownOpen)
                }}><Image alt="user_profile" src={'/icons/account_circle_FILL0_wght400_GRAD0_opsz24.svg'} width={30} height={30} /></div>
                <div className={styles.drop_down} style={{height: !DropDownOpen ? '0px' : '40px'}}>
                {
                    DropDownOpen && 
                    <div className={styles.drop_down_content}>
                    {!EditName ? <input type="text" defaultValue={Name} disabled/> : <input ref={editNameRef} type="text" defaultValue={Name} /> }
                    <Image onClick={()=>{
                        if(!EditName)
                        SetEditName(true)
                        else{
                        SetName(editNameRef.current.value)
                        sendJsonMessage({
                            type: "editName",
                            data: {
                            name: editNameRef.current.value
                            }
                        })
                        SetEditName(false)
                        }
                    }} alt="edit" src={'/icons/edit_FILL0_wght400_GRAD0_opsz24.svg'} width={20} height={20} />
                    </div>
                    
                }
                </div> */}
            </div>
            <div className={styles.main_content}>
                <div className={styles.title}>
                    <div className={styles.title_cont}>
                    <div className={styles.catchphrase}>AR learning platform for everyone</div>
                    <div className={styles.desc}>Transform medical education with immersive AR for dynamic anatomy exploration and seamless virtual meetings!</div>
                    </div>
                </div>
                <div className={styles.center}>
                    <div className={styles.connect}>
                        <div className={styles.image_container}><Image src={'/icons/ar-image.png'} width={300} height={300} alt="VR_IMAGE" /></div>
                            <div className={styles.user_data}>
                                <div>
                                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        {!EditName ? <div className={styles.user_name}>{Name}</div> : <input className={styles.user_field} ref={editNameRef} type="text" defaultValue={Name} />}
                                        <Image style={{filter: 'invert(0.9)', cursor: 'pointer'}} onClick={()=>{
                                            if(!EditName)
                                            SetEditName(true)
                                            else{
                                            SetName(editNameRef.current.value)
                                            sendJsonMessage({
                                                type: "editName",
                                                data: {
                                                name: editNameRef.current.value
                                                }
                                            })
                                            SetEditName(false)
                                            }
                                        }} alt="edit" src={'/icons/edit_FILL0_wght400_GRAD0_opsz24.svg'} width={20} height={20} />
                                    </div>
                                    <input placeholder="Room Code" ref={roomCodeRef} style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '15px'}} type="text" className={styles.room_code} />
                                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '15px'}}>
                                    <div className={styles.connect_button} onClick={()=>{
                                    sendJsonMessage({type: "createRoom"})
                                    }}>CREATE</div>
                                    <div className={styles.connect_button} onClick={()=>{
                                    sendJsonMessage({type: "joinRoom", data: {roomCode: roomCodeRef.current.value}})
                                    }}>JOIN</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <div className={styles.page}>
        //     <div className={styles.connect}>
        //     <div className={styles.welcome}>
        //         Hello {Name}
        //     </div>
        //     <div className={styles.connect_form}>
        //         <input ref={roomCodeRef} className={styles.name_input} type="text" placeholder={'ROOM CODE'} /><br />
        //         <input className={styles.button} type="submit" onClick={()=>{
        //         sendJsonMessage({type: "joinRoom", data: {roomCode: roomCodeRef.current.value}})
        //         }} value={"JOIN"} />
        //         <input className={styles.button} type="submit" onClick={()=>{
        //         sendJsonMessage({type: "createRoom"})
        //         }} value={"CREATE"} />
        //     </div>
        //     </div>
        //     <div className={styles.right_div}>
        //     <div className={styles.navbar}>
        //         <div className={styles.top_text}>Home Page</div>
        //         <div className={styles.account_circle} onClick={()=>{
        //         SetDropDownOpen(!DropDownOpen)
        //         }}><Image alt="user_profile" src={'/icons/account_circle_FILL0_wght400_GRAD0_opsz24.svg'} width={30} height={30} /></div>
        //         <div className={styles.drop_down} style={{height: !DropDownOpen ? '0px' : '40px'}}>
        //         {
        //             DropDownOpen && 
        //             <div className={styles.drop_down_content}>
        //             {!EditName ? <input type="text" defaultValue={Name} disabled/> : <input ref={editNameRef} type="text" defaultValue={Name} /> }
        //             <Image onClick={()=>{
        //                 if(!EditName)
        //                 SetEditName(true)
        //                 else{
        //                 SetName(editNameRef.current.value)
        //                 sendJsonMessage({
        //                     type: "editName",
        //                     data: {
        //                     name: editNameRef.current.value
        //                     }
        //                 })
        //                 SetEditName(false)
        //                 }
        //             }} alt="edit" src={'/icons/edit_FILL0_wght400_GRAD0_opsz24.svg'} width={20} height={20} />
        //             </div>
                    
        //         }
        //         </div>
        //     </div>
        //     <div className={styles.content}>
        //         <div className={styles.intro}>
        //         <div className={styles.main_text}>MEDIVISION</div>
        //         <div className={styles.main_para}>Step into the future of medical education with Medivision! Connect, collaborate, and explore anatomy like never before. Our online platform blends seamless meetings with cutting-edge augmented reality for an immersive learning experience. Dive into 3D models of the human body and organs, making every study session dynamic and engaging. Elevate your medical journey with Medivision – where innovation meets education.</div>
        //         </div>
        //     </div>
        //     </div>
        // </div>
    )
}

export default MainPage