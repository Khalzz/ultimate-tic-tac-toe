'use client'
import styles from './../../styles.module.css';
import Link from "next/link"
import { use, useState } from "react"
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

const ErrorMessage = (text) => {
  toast(
    ('' + text),  {
    duration: 1000,
    icon: '❌',
    style: {
      borderRadius: '2em',
      padding: '16px',
      color: '#171717',
      background: '#F2F2F2',
    },
  })
};

const CreateRoom = () => {
  const router = useRouter()
  const [ loading, setLoading ] = useState(false);
  const [ URL, setURL ] = useState('')

  const handleClick = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/room', {
        method: 'POST',
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`The response was not correctly getted: ${response.status}`)
      }

      const json = await response.json()

      console.log(json)
      router.push(json.id)
    } catch (error) {
      ErrorMessage(error)
      setLoading(false)
      console.error('The room creation failed:', error)
    }
  }

  if (!loading) {
    return (<button className={styles.Button} onClick={handleClick}>Create Room</button>)
  } else {
    return (<div className={styles.Loading}>Loading...</div>);
  }
}

export default CreateRoom