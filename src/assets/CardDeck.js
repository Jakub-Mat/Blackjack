const suits = ['♠', '♥', '♦', '♣'];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
const deck = [];

for (const suit of suits) {
  for (const value of values) {
    deck.push({ suit, value });
  }
}
export const CardDeck = deck;
