const form = document.getElementById("vendorForm");
const statusEl = document.getElementById("formStatus");
const submitButton = document.getElementById("submitButton");
document.getElementById("year").textContent = new Date().getFullYear();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "";
  statusEl.className = "form-status";
  submitButton.disabled = true;
  submitButton.textContent = "Submitting…";

  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());
  payload.consent = data.get("consent") === "on";

  try {
    const response = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Submission failed.");
    statusEl.textContent = result.message;
    statusEl.classList.add("success");
    form.reset();
  } catch (error) {
    statusEl.textContent = error.message || "Unable to submit. Please try again.";
    statusEl.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Submit application <span>→</span>';
  }
});
