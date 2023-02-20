'use client'
import styles from './../../styles.module.css';
import Link from "next/link"; // importamos el componente link
import { useState } from 'react';

export default function JoinRoom() {
  const [ URL, setUrl ] = useState('');

  return (
    <>
        <h3 className={styles.text}>Room ID</h3>
        <input className={styles.textInput} placeholder='ID' name="id" onChange={e => setUrl('/' + e.target.value)}></input>
        <Link className={styles.Button} href={URL}>Join Room</Link>
    </>
  )
}