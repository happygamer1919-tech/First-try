// Keys for localStorage
const K_VOTED = "has_voted_simple_poll";

// Elements
const btnDollar = document.getElementById("btnDollar");
const btnHash   = document.getElementById("btnHash");
const thanks    = document.getElementById("thanks");

// Initial state on load
function render() {
  const voted = localStorage.getItem(K_VOTED) === "yes";
  btnDollar.disabled = voted;
  btnHash.disabled   = voted;
  thanks.classList.toggle("hidden", !voted);
}

// Vote handler
function vote() {
  if (localStorage.getItem(K_VOTED) === "yes") return;
  localStorage.setItem(K_VOTED, "yes");
  render();
}

// Wire events
btnDollar.addEventListener("click", vote);
btnHash.addEventListener("click", vote);

// First paint
render();

// Dev helper (optional): in console, run resetVote() to test again
window.resetVote = function(){
  localStorage.removeItem(K_VOTED);
  render();
  console.log("Vote reset.");
};
