import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

import './Join.css';

export default function SignIn() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  let history = useHistory()

  return (
    <div className="login-box">
  <h2>Login</h2>
  {/* <form>
    <div className="user-box">
      <input type="text" name="" required="" onChange={(event) => setName(event.target.value)}/>
      <label>Username</label>
    </div>
    <div className="user-box">
      <input type="text" name="" required="" onChange={(event) => setRoom(event.target.value)}/>
      <label>Room</label>
    </div>
    <div>
    <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`} style={{textDecoration: "none"}}>
      <span></span>
        <span></span>
        <span></span>
        <span></span>
          <button type='submit' onSubmit={event => event.keyCode === 13}>Sign In</button>
        </Link>

    </div>
    
  </form> */}
  <form onSubmit={e => {
    e.preventDefault()
    history.push(`/chat?name=${name}&room=${room}`)
  }}>
    <div className="user-box">
      <input type="text" name="" required="" onChange={(event) => setName(event.target.value)}/>
      <label>Username</label>
    </div>
    <div className="user-box">
      <input type="text" name="" required="" onChange={(event) => setRoom(event.target.value)}/>
      <label>Room</label>
    </div>
    <button type='submit'>
      <span></span>
        <span></span>
        <span></span>
        <span></span>
          Sign In

    </button>
  </form>
</div>
  );
}
