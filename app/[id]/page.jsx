"use client";
import styles from './../styles.module.css';
import { useEffect, useState} from "react";
import io from "socket.io-client";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ButtonBlock from '../components/Multiplayer/ButtonBlock';
import SetUsername from '../components/Multiplayer/SetUsername';
import Lobby from '../components/Multiplayer/Lobby';
import Game from '../components/Multiplayer/Game';

const Main = ({ params }) => {
    const { id } = params;
    const router = useRouter()

    const [ socket, setSocket ] = useState(null);
    const [ room, setRoom ] = useState({});
    const [ name, setName ] = useState();
    const [ error, setError ] = useState();
    const [ turn, setTurn ] = useState();
    const [ playerList, setPlayerList ] = useState([]);
    const [ reload, setReload ] = useState(10);
    const [ grid, setGrid ] = useState([]);
    const [ endGame, setEndGame ] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setName(user);
        }

        // this will be called twice because next comes with react strict mode on
        fetch("/api/socket", {
            next: {
                revalidate: 3,
            },
        }).finally(async () => {
            const user = localStorage.getItem('user');
            const _socket = io(); // here i will use this so i dont have that awfull warning

            _socket.emit('connect-room', id)
            _socket.emit('check-winner', id)

            _socket.on("connect", () => {
                setName(user);

                if (user) {
                    _socket.emit('set-player', user, id);
                } else {
                    _socket.emit('check-room', id);
                }
            });

            _socket.on('joined player', (_room) => {
                let list = []
                _room.players.forEach(player => list.push(JSON.parse(JSON.parse(player))))
                if (list != playerList) {
                    setPlayerList(list)
                }
            })

            _socket.on('return-room', (_room) => {
                setRoom(_room);
                let list = [];
                _room.players.forEach(player => list.push(JSON.parse(player)));
                if (list != playerList) {
                    setPlayerList(list);
                }
                if (_room.players.length > 0) {
                    setTurn(JSON.parse(_room.players[_room.moveNumber % 2]));
                }
                setGrid(_room.playerGrid);
            });

            _socket.on('error', (error) => {
                // tengo que permitir que hayan errores
                setError(error);
            })

            _socket.on('player-turn', (returnedPlayer) => {
                setTurn(JSON.parse(returnedPlayer))
            })

            _socket.on('update-grid', (grid) => {
                setRoom(grid);
                setGrid(grid.playerGrid)
                _socket.emit('get-turn', grid.id)
            })

            _socket.on('return-winner', (winner) => {
                if (winner) {
                    setEndGame(winner);
                }
            })

            _socket.on('restarted', () => {
                setEndGame();
            })

            setSocket(_socket)
        });

        return () => {

        };
    }, []);

    

    if (error) {
        return (<main className={styles.background}>
            <h4>Ups: {error}</h4>
        </main>)
    }
    
    return (
        <main>
            <SetUsername name={name} error={error}/>
            <Lobby name={name} error={error} playerList={playerList} roomId={id}/>
            <Game playerList={playerList} endGame={endGame} socket={socket} room={room} turn={turn}/>
        </main>)


    if (playerList.length == 2 && endGame == null) {
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
    } else if (endGame != null) {
        let message = <></>
        if (endGame == 'draw') {
            message = <h2>Game Draw</h2>
        } else {
            if (name == JSON.parse(endGame)) {
                message = <h2 className={styles.winner}>You Won!!!</h2>
            } else {
                message = <h2 className={styles.looser}>You Loose!!!</h2>
            }
        }
        return (<main className={styles.background}>
            <Link href="/" className={styles.backButton}>
                <Image src='/BackButton.svg' alt='Ups' fill="true"></Image>
            </Link>
            <div className={styles.menuRoom}>
                {message}
                <button className={styles.Button} onClick={() => {
                    socket.emit('restart', id)
                }}>Restart</button>
            </div>
        </main>);
    }
}

export default Main;
