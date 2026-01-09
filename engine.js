function countValue(card) {
  if ([2,3,4,5,6].includes(card)) return 1;
  if ([7,8,9].includes(card)) return 0;
  return -1;
}

function calculateBet(count) {
  let bet = CONFIG.baseBet;
  CONFIG.betSpread.forEach(level => {
    if (count >= level.count) bet = CONFIG.baseBet * level.mult;
  });
  return bet;
}

function handValue(cards) {
  let sum = 0;
  let aces = 0;

  cards.forEach(c => {
    if (c === 'A') {
      aces++;
      sum += 11;
    } else {
      sum += c;
    }
  });

  while (sum > 21 && aces > 0) {
    sum -= 10;
    aces--;
  }

  return sum;
}

function decisionEngine(playerCards, dealerUp, count) {
  const total = handValue(playerCards);

  if (playerCards.length === 2 && playerCards[0] === playerCards[1]) {
    if (playerCards[0] === 8) return "SPLIT";
    if (playerCards[0] === 10 && count >= 5) return "SPLIT";
  }

  if (total >= 17) return "STAND";
  if (total <= 11) return "HIT";
  if (total === 16 && dealerUp === 10)
    return count >= 0 ? "STAND" : "HIT";

  return "HIT";
}

function insuranceSuggested(count) {
  return count >= CONFIG.insuranceCount;
}

function bustItSuggested(count, dealerUp) {
  return count >= CONFIG.bustItCount && [4,5,6].includes(dealerUp);
}
