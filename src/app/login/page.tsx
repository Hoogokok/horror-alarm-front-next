'use client'

import Link from 'next/link'
import { login } from '../auth/lib/actions'
import { useActionState } from 'react';
import styles from './login.module.css'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const initialState = {
    error: {
      email: undefined as string[] | undefined,
      password: undefined as string[] | undefined,
    },
    message: message || '',
  }
  const [state, formAction] = useActionState(login, initialState)
  
  return (
    <div className={styles.container}>
      <form action={formAction} className={styles.form}>
        {state.message && <p className={styles.message}>{state.message}</p>}
        <input type="email" name="email" className={styles.input} placeholder="이메일을 입력하세요" />
        {state.error.email && <p className={styles.error}>{state.error.email[0]}</p>}
        <input type="password" name="password" className={styles.input} placeholder="비밀번호를 입력하세요" />
        {state.error.password && <p className={styles.error}>{state.error.password[0]}</p>}
        <button type="submit" className={styles.button}>로그인</button>
      </form>
      <Link href="/signup" className={styles.link}>회원가입</Link>
    </div>
  )
}