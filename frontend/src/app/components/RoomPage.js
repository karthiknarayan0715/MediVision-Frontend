import Image from "next/image"

const RoomPage = ({styles, sendJsonMessage, RoomCode, Participants, UserId})=>{

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
            </div>
        </div>
    )
}

export default RoomPage