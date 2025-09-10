// Keys for localStorage
const K_DOLLAR = "votes_dollar";
const K_HASH   = "votes_hash";
const K_VOTED  = "has_voted";

// Get elements
const btnDollar  = document.getElementById("btnDollar");
const btnHash    = document.getElementById("btnHash");
const pctDollar  = document.getElementById("pctDollar");
const pctHash    = document.getElementById("pctHash");
const totalVotes = document.getElementById("totalVotes");

// Read numbers safely
function getNum(key, fallback = 0) {
  const n = Number(localStorage.getItem(key));
  return Number.isFinite(n) ? n : fallback;
}

// Write + render
function render() {
  const d = getNum(K_DOLLAR);
  const h = getNum(K_HASH);
  const total = d + h;

  const pD = total ? Math.round((d / total) * 100) : 0;
  const pH = total ? Math.round((h / total) * 100) : 0;

  pctDollar.textContent = `${pD}%`;
  pctHash.textContent   = `${pH}%`;
  totalVotes.textContent = total.toString();

  // Optional: visually “select” after voting
  const voted = localStorage.getItem(K_VOTED);
  [btnDollar, btnHash].forEach(b => b.disabled = !!voted);
}

function vote(kind) {
  if (localStorage.getItem(K_VOTED)) return; // one vote per browser

  if (kind === "dollar") {
    localStorage.setItem(K_DOLLAR, getNum(K_DOLLAR) + 1);
  } else {
    localStorage.setItem(K_HASH, getNum(K_HASH) + 1);
  }
  localStorage.setItem(K_VOTED, "yes");
  render();
}

// Wire up events
btnDollar?.addEventListener("click", () => vote("dollar"));
btnHash?.addEventListener("click",   () => vote("hash"));

// First paint
render();

// Dev helper (you can remove later): reset by typing resetPoll() in console
window.resetPoll = function() {
  localStorage.removeItem(K_DOLLAR);
  localStorage.removeItem(K_HASH);
  localStorage.removeItem(K_VOTED);
  render();
  console.log("Poll reset.");
};
