import './App.css';
import Gameboard from './Gameboard';
import io from "socket.io-client";
import { useState} from 'react';

const socket=io.connect("http://localhost:3002");

function App() {
  const [room,setRoom]=useState("");
  const [userName,setUserName]=useState("");
  const [code,setCode]=useState("");
  const [showGameBoard,setShowGameBoard]=useState(false);

  function createGame()
  {
    let characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let char='';
    for(let i=0;i<5;i++)
    {
      const randomIndex=Math.floor(Math.random()*characters.length)
      char+=characters.charAt(randomIndex);
    }
    setCode(char);
    socket.emit("join_room",code);
    setShowGameBoard(true);
  }

  const joinRoom=()=>{
    if(userName!=="" && room!=="")
    {
      socket.emit("join_room",room);
      setShowGameBoard(true);
    }
  };

  return (
    <div className="App">
      {!showGameBoard?(
        <div>
          <input className="user-name-input" type="text" placeholder="Enter user name" onChange={(event)=>{setUserName(event.target.value);}}/><br/>
          <button className="create-game-button" onClick={createGame}>CREATE GAME</button>
          <p>OR</p>
          <input className="user-name-input" type="text" placeholder="Enter user name" onChange={(event)=>{setUserName(event.target.value);}}/><br/>
          <input className="room-code-input" type="text" placeholder="Enter room code" onChange={(event)=>{setRoom(event.target.value);}}/><br/>
          <button className="join-game-button" onClick={joinRoom}>JOIN GAME</button>
        </div>):
        (<Gameboard socket={socket} code={code}/>)}
    </div>
  );
}

export default App;
