'use client'
import styles from './../../styles.module.css';
import Link from "next/link"
import { use, useState } from "react"
import { useRouter } from 'next/navigation';


const CreateRoom = () => {
  const router = useRouter()
  const [ loading, setLoading ] = useState(false);
  const [ URL, setURL ] = useState('')

  const handleClick = async () => {
    await fetch('http://localhost:3000/api/room', {
      method: 'POST',
      cache: 'no-store'
    }).then(setLoading(true))
    .then((response) => {
      return response.json()})
    .then((json) => router.push(json.id))
  }

  if (!loading) {
    return (<button className={styles.Button} onClick={handleClick}>Create Room</button>)
  } else {
    return (<div className={styles.Loading}>Loading...</div>);
  }
}

export default CreateRoom