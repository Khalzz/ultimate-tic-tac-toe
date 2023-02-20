'use client'
import styles from './../../styles.module.css';
import Link from "next/link"; // importamos el componente link
import { useEffect, useState } from 'react';

const ButtonBlock = (props) => {
    const [player, setPlayer] = useState(0);
    const [itsOccupied, setOcuppied] = useState(false);
    const [x] = useState(props.x)
    const socket = props.socket;
    const room = props.room;
    const id = props.room.id;
    const [ playerState, setState ] = useState();
    const changeState = props.changer;

    useEffect(()=> {
        setState(props.state)
    }, [props.state])

    const changeStates = (x) => {
        for (let i = 0; i < 2; i++) {
            if (JSON.parse(room.players[i]) == localStorage.getItem('user')) {
                console.log(i + 1)
                changeState(x, i + 1)
            }
        }
        socket.emit('play-turn', id, JSON.stringify(localStorage.getItem('user')), x)
        console.log(x)
    }

    if (playerState === 1) {
        return (
        <div className='Box' style={props.style} >
            <div className="o"><div className="inner-o"></div></div>
        </div>);  
    } else if (playerState === 2) {
        return (
        <div className='Box' style={props.style}>
            <div className="x"><div className="first-line"></div><div className="second-line"></div></div>
        </div>
        ); 
    } else {
        return(
            <div className='Box' onClick={()=> changeStates(x, setOcuppied, setPlayer)} style={props.style}>
            <div className="circle"></div>
            </div>
        );
    }
}

export default ButtonBlock;