import './App.css'
import './Blackjack.jsx'
import {useState} from "react";
import Blackjack from "./Blackjack.jsx";
function App() {
  const [gameStarted,setGameStarted] = useState(false);

  function btnClicked(){
    setGameStarted(true)
  }
  function startGame(){
    if(gameStarted){
      return <Blackjack/>
    }else{
      return<div>
        <h1>Welcome in small Blackjack game!</h1>
        <button id="reset-button" onClick={btnClicked}>Start game</button>
      </div>
    }
  }
  return (
     <>
       {startGame()}
     </>
  )
}

export default App
