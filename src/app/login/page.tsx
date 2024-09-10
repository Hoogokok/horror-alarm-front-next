'use client'

import Link from 'next/link'
import {login} from '../lib/actions'
import { useActionState } from 'react';
import styles from './login.module.css'

export default function LoginPage() {
  const initialState = {
    error: {
        email: undefined as string[] | undefined,
        password: undefined as string[] | undefined,
    },
    message: '',
  }
  const [state, formAction] = useActionState(login, initialState)
  
  return (
    <div className={styles.container}>
      <form action={formAction} className={styles.form}>
        <input type="email" name="email" className={styles.input} />
        {state.error.email && <p className={styles.error}>{state.error.email[0]}</p>}
        <input type="password" name="password" className={styles.input} />
        {state.error.password && <p className={styles.error}>{state.error.password[0]}</p>}
        <button type="submit" className={styles.button}>로그인</button>
      </form>
      <Link href="/signup" className={styles.link}>회원가입</Link>
    </div>
  )
}