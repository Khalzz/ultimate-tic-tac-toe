"use client";
import styles from './../styles.module.css';
import { useEffect, useState, useRef, Component} from "react";
import io from "socket.io-client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ButtonBlock from '../components/Multiplayer/ButtonBlock';

const Main = ({ params }) => {
    const { id } = params;
    const router = useRouter()

    const [ socket, setSocket ] = useState(null);
    const [ room, setRoom ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ name, setName ] = useState();
    const [ error, setError ] = useState();
    const [ turn, setTurn ] = useState();
    const [ playerList, setPlayerList ] = useState([]);
    const [ reload, setReload ] = useState(10);
    const [ grid, setGrid ] = useState([]);
    const [ endGame, setEndGame ] = useState(null);

    useEffect(() => {
        // this will be called twice because next comes with react strict mode on
        fetch("/api/socket", {
            next: {
                revalidate: 3,
            },
        }).finally(() => {
            const user = localStorage.getItem('user');
            const _socket = io(); // here i will use this so i dont have that awfull warning
            _socket.emit('connect-room', id)
            _socket.emit('check-winner', id)
            _socket.on("connect", () => {
                setName(user);
                if (user) {
                    _socket.emit('set-player', user, id);
                    console.log('you have a name');
                } else {
                    _socket.emit('check-room', id);
                    console.log('you dont have a name');
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
                _room.players.forEach(player => list.push(JSON.parse(JSON.parse(player))));
                if (list != playerList) {
                    setPlayerList(list);
                }
                setTurn(JSON.parse(_room.players[_room.moveNumber % 2]));
                setGrid(_room.playerGrid);
                setLoading(false);
            });

            _socket.on('error', (error) => {
                // tengo que permitir que hayan errores
                setError(error);
                setLoading(false);
                console.log(error);
            })

            _socket.on('player-turn', (returnedPlayer) => {
                console.log(returnedPlayer)
                setTurn(JSON.parse(returnedPlayer))
            })

            _socket.on('update-grid', (grid) => {
                setRoom(grid);
                setGrid(grid.playerGrid)
                _socket.emit('get-turn', grid.id)
                console.log(grid)
            })

            _socket.on('return-winner', (winner) => {
                console.log('the winner is:', winner)
                if (winner) {
                    setEndGame(winner);
                }
            })

            setSocket(_socket)
        });
      
        return () => {

        };
    }, []);

    let tempUsername;
    if (!loading) {
        if (error) {
            return (<main className={styles.background}>
                <h4>Ups: {error}</h4>
            </main>)
        }
        if (!name && !error) {
            return (
                <main className={styles.background}>
                    <form className={styles.menu}>
                        <h3 className={styles.text}>set your Username</h3>
                        <input className={styles.textInput} placeholder='ID' name="id" onChange={e => tempUsername = e.target.value}></input>
                        <button className={styles.Button} onClick={() => {
                            setLoading(true);
                            setName(tempUsername);
                            const user = {
                                'username': tempUsername,
                                'identifier': Math.random()
                            }
                            localStorage.setItem('user', JSON.stringify(user));
                            location.reload();
                        }}>Join Room</button>
                    </form>
                </main>)
        } else if (name && !error && playerList.length < 2) {
            return (<main className={styles.background}>
                <div className={styles.menuRoom}>
                    <h5 className={styles.titleRoom}>send this to your friend</h5>
                    <h4 className={styles.roomId}>{id}</h4>
                    
                    <ul className={styles.list}>
                        {   playerList.length === 1 ? (
                            playerList.map(({ username, identifier }) => {
                                return ( <li key={identifier} className={styles.nolist}>
                                    <div className={styles.player} key={identifier}>{username} (ready)</div>
                                    <div className={styles.waiting} key="0">Waiting...</div>
                                </li>)
                            })
                        ) : playerList.length === 2 ? (
                            playerList.map(({ username, identifier }) => {
                                return (<li className={styles.player} key={identifier}>{username} (ready)</li>)
                            })
                        ) : (
                           <li className={styles.waiting} key="0">Waiting Players...</li>
                        )}
                    </ul>
                </div>

            </main>)
        } else if (playerList.length == 2 && endGame == null) {
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
            if (endGame == 'draw') {
                return (<main className={styles.background}>
                    <h2>Game Draw</h2>
                </main>);
            } else {
                return (<main className={styles.background}>
                    <h2>{JSON.parse(JSON.parse(endGame)).username} won!!!</h2>
                </main>);
            }
        }
    } else {
        return (<main className={styles.background}>
            <h2>Loading...</h2>
        </main>);
    }
} 


export default Main;
