// Keep simple one-vote-per-browser behavior + small niceties
const K_VOTED = "has_voted_simple_poll";
const $ = (sel) => document.querySelector(sel);

const btnDollar = $("#btnDollar");
const btnHash   = $("#btnHash");
const thanks    = $("#thanks");

// Sticky year in footer
$("#y").textContent = new Date().getFullYear();

function render(){
  const voted = localStorage.getItem(K_VOTED) === "yes";
  [btnDollar, btnHash].forEach(b => b.disabled = voted);
  thanks.classList.toggle("hidden", !voted);
}

function vote(){
  if (localStorage.getItem(K_VOTED) === "yes") return;
  localStorage.setItem(K_VOTED, "yes");
  render();
}

btnDollar.addEventListener("click", vote);
btnHash.addEventListener("click", vote);
render();
