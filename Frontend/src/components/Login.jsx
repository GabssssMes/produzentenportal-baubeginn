import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import style from "../styles/App.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Nur noch Anmelden erlaubt
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("E-Mail oder Passwort falsch.");
    }
  };

  return (
    <section className={style.container}>
      <div className={style.headerLogin}>
        <div className={style.imageLogin}></div>
      </div>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px", marginTop: "10px" }}>
          <input
            placeholder="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            placeholder="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" className={style.submitbutton}>
          Einloggen
        </button>
      </form>
    </section>
  );
}
