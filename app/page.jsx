'use client'
import styles from './styles.module.css';
import Link from "next/link"; // importamos el componente link
import CreateRoom from '@/app/components/JoinCreateRoom/createRoom';
import JoinRoom from '@/app/components/JoinCreateRoom/joinRoom';
import { Toaster, toast } from 'react-hot-toast';
import Loading from './loading';
import { Suspense } from 'react';

export default function Home() {

  return (
    <main className={styles.background}>
      <div className={styles.menu}>
          <Suspense fallback={ <Loading/> }>
            <JoinRoom/>
            <h4>or</h4>
            <CreateRoom/>
          </Suspense>
          <Link className={styles.Button} id='offline' href={'/offline'}>Play Offline</Link>
      </div>
    <Toaster position="bottom-center"/>

    </main>
  )
}
