let runningCount = 0;
let bankroll = CONFIG.bankroll;
let saldo = bankroll;

let stats = {
  hands: 0,
  wins: 0,
  losses: 0,
  push: 0,
  bust: 0
};

let playerHands = [[]];
let dealerHand = [];
let log = [];

function updateUI() {
  document.getElementById("count").innerText = runningCount;
  document.getElementById("bet").innerText = calculateBet(runningCount);
  document.getElementById("bankroll").innerText = bankroll;
  document.getElementById("saldo").innerText = saldo;
  document.getElementById("roi").innerText =
    (((saldo - bankroll) / bankroll) * 100).toFixed(2);

  document.getElementById("hands").innerText = stats.hands;
  document.getElementById("wins").innerText = stats.wins;
  document.getElementById("losses").innerText = stats.losses;
  document.getElementById("push").innerText = stats.push;
  document.getElementById("bust").innerText = stats.bust;

  document.getElementById("insurance")
    .classList.toggle("active", insuranceSuggested(runningCount));

  document.getElementById("bustit")
    .classList.toggle("active", bustItSuggested(runningCount, dealerHand[0]));

  renderHands();
}

function renderHands() {
  const ph = document.getElementById("playerHands");
  const dh = document.getElementById("dealerHand");
  ph.innerHTML = "";
  dh.innerHTML = dealerHand.join(" ");

  playerHands.forEach((hand, i) => {
    const div = document.createElement("div");
    div.innerText = `Mano ${i+1}: ${hand.join(" ")} (${handValue(hand)})`;
    ph.appendChild(div);
  });

  if (playerHands[0].length >= 2 && dealerHand.length > 0) {
    document.getElementById("decisionText").innerText =
      decisionEngine(playerHands[0], dealerHand[0], runningCount);
  }
}

function addCard(card) {
  runningCount += countValue(card);
  if (playerHands[0].length <= dealerHand.length)
    playerHands[0].push(card);
  else
    dealerHand.push(card);
  log.push(card);
  updateUI();
}

function addOther(card) {
  runningCount += countValue(card);
  updateUI();
}

function undo() {
  const card = log.pop();
  if (!card) return;
  runningCount -= countValue(card);
  updateUI();
}

function splitHand() {
  if (playerHands[0].length === 2 &&
      playerHands[0][0] === playerHands[0][1]) {
    playerHands = [
      [playerHands[0][0]],
      [playerHands[0][1]]
    ];
    updateUI();
  }
}

function endHand() {
  stats.hands++;
  saldo += calculateBet(runningCount); // simulazione risultato
  updateUI();
  playerHands = [[]];
  dealerHand = [];
}
