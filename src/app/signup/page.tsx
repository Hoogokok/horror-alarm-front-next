'use client'

import { signup } from '@/app/auth/lib/actions'
import { useActionState } from 'react';
import styles from './signup.module.css'

export default function SignupPage() {
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
      <form action={formAction} className={styles.form} role="form">
        <input type="email" name="email" className={styles.input} placeholder="이메일을 입력하세요" />
        {state.error.email && <p className={styles.error}>{state.error.email[0]}</p>}
        <input type="password" name="password" className={styles.input} placeholder="비밀번호를 입력하세요" />
        {state.error.password && <p className={styles.error}>{state.error.password[0]}</p>}
        <input type="text" name="name" className={styles.input} placeholder="별명을 입력하세요"/>
        {state.error.name && <p className={styles.error}>{state.error.name[0]}</p>}
        <button type="submit" className={styles.button} name="signup">회원가입</button>
        <div className={styles.errorContainer}>
          {state.message && <p className={styles.error}>{state.message}</p>}
        </div>
      </form>
      <a href="/login" className={styles.link}>이미 계정이 있으신가요? 로그인하기</a>
    </div>
  )
}
