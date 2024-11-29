import styles from '../../styles.module.css';
import Link from 'next/link';
import Image from 'next/image';

// player list is not being feed so i have to check on why
const Lobby = ({ name, error, playerList, roomId }) => {
    if (!name && error && playerList.length >= 2) {
        return null
    }

    const PlayerListSetting = () => {
        if (playerList.length === 1) {
            playerList.map(({ username, identifier }) => {
                return ( <li key={identifier} className={styles.nolist}>
                    <div className={styles.player} key={identifier}>{username} (ready)</div>
                    <div className={styles.waiting} key="0">Waiting...</div>
                </li>)
            })
        } else if (playerList.length === 2) {

            playerList.map(({ username, identifier }) => {
                return (<li className={styles.player} key={identifier}>{username} (ready)</li>)
            })
        } else {
            return (<li className={styles.waiting} key="0">Waiting Players...</li>)
        }
    }

    return (<main className={styles.background}>
        <Link href="/" className={styles.backButton}>
            <Image src='/BackButton.svg' alt='Ups' fill="true"></Image>
        </Link>
        <div className={styles.menuRoom}>
            <h5 className={styles.titleRoom}>send this to your friend</h5>
            <h4 className={styles.roomId}>{roomId}</h4>
            <ul className={styles.list}><PlayerListSetting/></ul>
        </div>
    </main>)
}

export default Lobby;