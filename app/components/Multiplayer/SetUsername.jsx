import styles from '../../styles.module.css';

const SetUsername = ({ name, error }) => {
    if (name || error) {
        return null
    }

    let tempUsername

    const SetNameAndJoin = () => {
        const user = {
            'username': tempUsername,
            'identifier': Math.random()
        }
        window !== "undefined" ? localStorage.setItem('user', JSON.stringify(user)) : undefined
        setName(tempUsername);
        location.reload()
    }

    return (
        <main className={styles.background}>
            <form className={styles.menu}>
                <h3 className={styles.text}>set your Username</h3>
                <input className={styles.textInput} placeholder='Name' name="id" onChange={e => tempUsername = e.target.value}></input>
                <button className={styles.Button} onClick={SetNameAndJoin}>Join Room</button>
            </form>
        </main>)
}


export default SetUsername;