'use client';
import { logout } from "../lib/actions";

export default function Page() {
  return (
    <div>
      <form action={logout}>
            <button type="submit">로그아웃</button>
      </form>
    </div>
  );
}