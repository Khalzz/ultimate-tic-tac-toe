import styles from '../../styles.module.css';
import Link from 'next/link';
import Image from 'next/image';
import ButtonBlock from '../../components/Multiplayer/ButtonBlock';

const Game = ({playerList, endGame, socket, room, turn}) => {
    if (playerList.length != 2 || endGame) {
        return null
    }

    const components = [];

    const changeState = (x, playerValue) => {
        setTurn(x);
        let fixedGrid = grid;
        fixedGrid[x] = playerValue;
        setGrid(fixedGrid);
    } 

    for (let i = 0; i < 9; i++) {
        components.push(<ButtonBlock key={i} style={{gridColumn: ((i % 3) + 1), gridRow: (Math.floor(i / 3) + 1)}} x={i} socket={socket} room={room} state={room.playerGrid[i]} changer={changeState}/>);
    }
    return (<main className={styles.background}>
        <Link href="/" className={styles.backButton}>
            <Image src='/BackButton.svg' alt='Ups' fill="true"></Image>
        </Link>
        {localStorage.getItem('user') === turn ? (
            <>
                <h2>Your Turn</h2>
                <div></div>
            </>
        ) : (
            <>
                <h2>Wait</h2>
                <div className={styles.noPlayer}></div>
            </>
        )}
        <div className='GameBox'>  
            {components.map((element) => {
                return (element)
            })}
        </div>
    </main>)
}

export default Game;