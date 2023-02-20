import styles from './styles.module.css';
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={styles.body}>{children}</body>
    </html>
  )
}
