// Wild Pixels_kmv — guest photo submission
// Posts to a Google Apps Script Web App which saves the photo to Drive
// and logs the entry in the review Sheet. See README for setup.

// Paste the deployed Apps Script Web App URL here (ends in /exec).
const SUBMIT_ENDPOINT = "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guest-submit-form");
  if (!form) return;

  const statusEl = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  const showStatus = (type, msg) => {
    statusEl.className = "form-message " + type;
    statusEl.textContent = msg;
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (SUBMIT_ENDPOINT.indexOf("PASTE_") === 0) {
      showStatus("error", "Submissions aren't connected yet — please send your photo directly via WhatsApp for now.");
      return;
    }

    const file = form.photo.files[0];
    if (!file) {
      showStatus("error", "Please choose a photo.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showStatus("error", "That photo is over 8MB — please choose a smaller file.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    showStatus("loading", "Uploading your photo — this can take a moment…");

    try {
      const base64 = await fileToBase64(file);
      const payload = {
        name: form.name.value.trim(),
        tour: form.tour.value,
        category: form.category.value,
        caption: form.caption.value.trim(),
        consent: form.querySelector('input[name="consent"]:checked').value,
        filename: file.name,
        mimeType: file.type,
        fileData: base64,
      };

      const res = await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.ok) {
        showStatus("success", "Thanks! Your photo's been sent in for review — you'll hear from us if it's featured.");
        form.reset();
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      showStatus("error", "Something went wrong sending that — please try again, or send it directly via WhatsApp instead.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Photo";
    }
  });
});
