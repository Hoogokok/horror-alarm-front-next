'use client';
import { logout } from "../auth/lib/actions";

export default function Page() {
  return (
    <div>
      <form action={logout}>
            <button type="submit">로그아웃</button>
      </form>
    </div>
  );
}