import { useState } from 'react'
import './App.css'
import { CardDeck } from './CardDeck.js'

function App() {
  const [gameDeck, setGameDeck] = useState(CardDeck);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  //const [dealerScore, setDealerScore] = useState(0);
  const [playerStand, setPlayerStand] = useState(false);
  const [gameoverMessage,setGameOverMessage] = useState("");
  const [disableHitBtn,setDisableHitBtn] = useState(false);
  // console.log(gameDeck);


  // Get random card from the deck and remove it from deck
  const drawCardFromDeck = (currentDeck) => {
    const randomIndex = Math.floor(Math.random() * currentDeck.length);
    const card = currentDeck.splice(randomIndex,1)[0]
    return card;
  };

  //score handler
  // This function can be expanded to calculate scores based on Blackjack rules
  function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    hand.forEach(card => {
      if (typeof card.value === 'number') {
        score += card.value;
      } else if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
        score += 10;
      }else if (card.value === 'A') {
        aces += 1;
        score += 11; // Initially treat Ace as 11
      }
      while (score > 21 && aces > 0) {
        score -= 10; // If score exceeds 21, treat Ace as 1
        aces -= 1;
      }
    });
    return score;
  }

  // Deal initial hands
  const dealInitialHands = () => {
    console.log("NEW GAME STARTED");
    let currentDeck = [...CardDeck]

    console.log("Dealing starting cards...");

    //cards for player
    const playerCards = [drawCardFromDeck(currentDeck), drawCardFromDeck(currentDeck)];
    //cards for dealer
    const dealerCards = [drawCardFromDeck(currentDeck), drawCardFromDeck(currentDeck)];

    const calculatedPlayerScore = calculateScore(playerCards);
    const calculatedDealerScore = calculateScore(dealerCards);

    console.log("Dealer Hand:", dealerCards);
    console.log("Player Hand:", playerCards);
    console.log("Player Score:", calculatedPlayerScore);
    console.log("Dealer Score:", calculatedDealerScore);

    //save all changes
    console.log("Saving changes...")
    setPlayerHand(playerCards)
    setDealerHand(dealerCards)
    setPlayerScore(calculatedPlayerScore);
    setDealerScore(calculatedDealerScore);
    setGameDeck(currentDeck)
  };

  //Reset game
  const resetRound = () => {
    setPlayerHand([]);
    setDealerHand([]);
    //setDealerScore(0);
    setPlayerScore(0);
    setPlayerStand(false);
    setGameOverMessage("")
    setDisableHitBtn(false)
    console.log("Game has been reset.");
    dealInitialHands();
  };

  // Hit function for player
  function executeHit() {
    const currentGameDeck = [...gameDeck]
    const playerCards = [...playerHand]
    if (currentGameDeck.length > 0) {
      const newCard = drawCardFromDeck(currentGameDeck);
      const updatedHand = [...playerCards, newCard];
      const playerActualScore = calculateScore(updatedHand);

      //early end
      if (playerActualScore > 21) {
        setGameOverMessage("Instantní prohra hřáč překočil 21! - Player BUST")
        setDisableHitBtn(true)
      }
      setPlayerHand(updatedHand);
      setPlayerScore(playerActualScore);
      setGameDeck(currentGameDeck)
    }

  }
  
  // Stand function for player

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function executeStand() {
    console.log("Player stands. Dealer's turn to play.");
    let currentGameDeck = [...gameDeck]
    setPlayerStand(true);

    let currentDealerHand = [...dealerHand];
    let currentPlayerScore = calculateScore(playerHand)

    while (calculateScore(currentDealerHand) < 17 && currentGameDeck.length > 0) {
      await wait(500); // počkej 500 ms

      const newCard = drawCardFromDeck(currentGameDeck);
      currentDealerHand = [...currentDealerHand, newCard];

      setDealerHand(currentDealerHand);
    }
    
    const actualDealerScore = calculateScore(currentDealerHand);
    setDealerScore(actualDealerScore);
    console.log(`Dealer´s score is ${actualDealerScore}`);
    console.log("Dealer's final hand:", currentDealerHand);
    console.log("Player's final hand:", playerHand);
    setGameDeck(currentGameDeck)
    gameOver(currentPlayerScore,actualDealerScore);
  }

  function gameOver(playerScore, dealerScore) {
    if (dealerScore > 21) {
      setGameOverMessage("Player wins! Dealer score is higher than 21 - DEALER BUST")
    } else if (playerScore === 21) {
      setGameOverMessage(`Blackjack! Player wins with a score of ${playerScore}.`)
    } else if (dealerScore === 21) {
      setGameOverMessage(`Dealer has Blackjack! Dealer wins with a score of ${dealerScore}.`)
    } else if (playerScore > dealerScore) {
      setGameOverMessage(`Player wins! With a score of ${playerScore} against dealer's ${dealerScore}.`)
    } else if (dealerScore > playerScore) {
      setGameOverMessage(`Dealer wins with a score of ${dealerScore} against player's ${playerScore}.`)
    } else {
      setGameOverMessage(`It's a tie! Player have score:${playerScore} and dealer score: ${dealerScore}.`)
    }
  }


  return (
    <div>
      <h1>Blackjack the GAME</h1>
      {/* <button onClick={dealInitialHands}>Deal Initial Hands</button> */}
      <h3>Dealer Hand:</h3>
      {/* Display dealer's hand, hiding the second card initially */}
      <ul>
        {dealerHand.map((card, index) => (
          <li key={index}>
            {playerStand === false && index === 1 ? 'Hidden Card' : `${card.value} of ${card.suit}`}
          </li>
        ))}
      </ul>
      <h3>Player Hand:</h3>
      <h4>Player´s score: {playerScore}</h4>
      <ul>
        {playerHand.map((card, index) => (
          <li key={index}>{card.value} of {card.suit}</li>
        ))}
      </ul>
      <button onClick={executeHit} id="hit-button" disabled={disableHitBtn}>Hit</button>
      <button onClick={executeStand} id="stand-button">Stand</button>
      <p>Remaining Cards in Deck: {gameDeck.length}</p>
      <button onClick={resetRound} id="reset-button">Reset Game</button>
      {gameoverMessage !== "" &&(
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>Konec hry!</h2>
          <p>{gameoverMessage}</p>
          <button onClick={resetRound}>Začít novou hru</button>
        </div>
      </div>
      )}
    </div>
  )
}

export default App
