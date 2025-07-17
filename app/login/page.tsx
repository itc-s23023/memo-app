"use client";
import { useState } from "react";
import { signUp, login, loginWithGoogle, logout } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Memo App - Auth Demo</h1>

      {user ? (
        <>
          <p>ログイン中: {user.email}</p>
          <button onClick={logout}>ログアウト</button>
        </>
      ) : (
        <>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
          />
          <div>
            <button onClick={() => signUp(email, password, name)}>新規登録</button>
            <button onClick={() => login(email, password)}>ログイン</button>
            <button onClick={loginWithGoogle}>Googleでログイン</button>
          </div>
        </>
      )}
    </div>
  );
}
