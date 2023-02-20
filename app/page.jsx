import styles from './styles.module.css';
import Link from "next/link"; // importamos el componente link
import CreateRoom from '@/app/components/JoinCreateRoom/createRoom';
import JoinRoom from '@/app/components/JoinCreateRoom/joinRoom';

export default async function Home() {

  return (
    <main className={styles.background}>
      <div className={styles.menu}>
          <JoinRoom/>
          <h4>or</h4>
          <CreateRoom/>
          <Link className={styles.Button} id='offline' href={'/offline'}>Play Offline</Link>
      </div>
    </main>
  )
}
