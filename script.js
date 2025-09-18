// Simple one-vote-per-browser behavior + footer year
const K_VOTED = "has_voted_simple_poll";
const $ = (sel) => document.querySelector(sel);

const btnDollar = $("#btnDollar");
const btnHash   = $("#btnHash");
const thanks    = $("#thanks");

// Footer year
const y = $("#y");
if (y) y.textContent = new Date().getFullYear();

function render(){
  const voted = localStorage.getItem(K_VOTED) === "yes";
  [btnDollar, btnHash].forEach(b => b.disabled = voted);
  if (thanks) thanks.classList.toggle("hidden", !voted);
}

function vote(){
  if (localStorage.getItem(K_VOTED) === "yes") return;
  localStorage.setItem(K_VOTED, "yes");
  render();
}

btnDollar?.addEventListener("click", vote);
btnHash?.addEventListener("click", vote);

render();
