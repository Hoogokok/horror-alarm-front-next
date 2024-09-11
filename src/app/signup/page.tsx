'use client'

import {signup} from '../lib/actions'
import { useActionState } from 'react';
import styles from '@/app/login/login.module.css'

export default function LoginPage() {
  const initialState = {
    error: {
        email: undefined as string[] | undefined,
        password: undefined as string[] | undefined,
        name: undefined as string[] | undefined,
    },
    message: '',
  }
  const [state, formAction] = useActionState(signup, initialState)
  
  return (
    <div className={styles.container}>
      <form action={formAction} className={styles.form}>
        <input type="email" name="email" className={styles.input} placeholder="이메일을 입력하세요" />
        {state.error.email && <p className={styles.error}>{state.error.email[0]}</p>}
        <input type="password" name="password" className={styles.input} placeholder="비밀번호를 입력하세요" />
        {state.error.password && <p className={styles.error}>{state.error.password[0]}</p>}
        <input type="name" name="name" className={styles.input} placeholder="별명을 입력하세요"/>
        {state.error.name && <p className={styles.error}>{state.error.name[0]}</p>}
        <button type="submit" className={styles.button}>회원가입</button>
      </form>
    </div>
  )
}