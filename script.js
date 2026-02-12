const $ = (id) => document.getElementById(id);
function openErrorModal(items) {
  const modal = $("errorModal");
  const list = $("modalList");

  list.innerHTML = "";
  for (const msg of items) {
    const li = document.createElement("li");
    li.textContent = msg;
    list.appendChild(li);
  }

  modal.setAttribute("aria-hidden", "false");
}

function closeErrorModal() {
  $("errorModal").setAttribute("aria-hidden", "true");
}
$("modalOkBtn").addEventListener("click", closeErrorModal);
$("errorModal").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-close")) closeErrorModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeErrorModal();
});

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

$("calculateBtn").addEventListener("click", () => {
  const loanAmount = Number($("loanAmount").value);
  const downPayment = Number($("downPayment").value) || 0;
  const principal = loanAmount - downPayment;

  const apr = Number($("interestRate").value);
  const years = Number($("loanYears").value);
 const errors = [];

  if (!loanAmount) errors.push("Enter a loan amount.");
  if (loanAmount < 0) errors.push("Loan amount must be 0 or more.");
  if (downPayment < 0) errors.push("Down payment must be 0 or more.");
  if (downPayment >= loanAmount && loanAmount > 0) errors.push("Down payment must be less than the loan amount.");
  if (!apr) errors.push("Enter an interest rate.");
  if (apr <= 0) errors.push("Interest rate must be greater than 0.");
  if (!years) errors.push("Enter a loan term in years.");
  if (years <= 0) errors.push("Loan term must be greater than 0.");

  if (errors.length) {
    openErrorModal(errors);
    return;
  }

  const r = apr / 100 / 12;
  const n = years * 12;

  const monthly = (principal * r) / (1 - Math.pow(1 + r, -n));
  const totalPayment = monthly * n;
  const totalInterest = totalPayment - principal;

  $("resultSection").hidden = false;
  $("monthlyPayment").textContent = money(monthly);
  $("principal").textContent = money(principal);
  $("totalInterest").textContent = money(totalInterest);
  $("totalPayment").textContent = money(totalPayment);
});
