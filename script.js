const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const messagesInput = document.getElementById("messages-input");
const chatContainer = document.getElementById("chat-container");
const errorMsg = document.getElementById("error-msg");

// Helper: get initials from sender name (for avatar)
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Render chat messages
function renderMessages(messages) {
  chatContainer.innerHTML = ""; // Clear previous

  messages.forEach(({ sender, text }) => {
    const isYou = sender.toLowerCase() === "you";

    const messageEl = document.createElement("div");
    messageEl.className = "message " + (isYou ? "you" : "them");

    const avatarEl = document.createElement("div");
    avatarEl.className = "avatar";
    avatarEl.textContent = getInitials(sender);

    const contentEl = document.createElement("div");
    contentEl.className = "message-content";

    const headerEl = document.createElement("div");
    headerEl.className = "message-header";
    headerEl.textContent = sender;

    const textEl = document.createElement("div");
    textEl.className = "message-text";
    textEl.textContent = text;

    contentEl.appendChild(headerEl);
    contentEl.appendChild(textEl);

    if (isYou) {
      // "You" message: avatar right, message left
      messageEl.appendChild(contentEl);
      messageEl.appendChild(avatarEl);
    } else {
      // "Them" message: avatar left, message right
      messageEl.appendChild(avatarEl);
      messageEl.appendChild(contentEl);
    }

    chatContainer.appendChild(messageEl);
  });
}

// Handle Generate button click
generateBtn.addEventListener("click", () => {
  errorMsg.textContent = "";
  const raw = messagesInput.value.trim();

  if (!raw) {
    errorMsg.textContent = "Please paste a message JSON array.";
    downloadBtn.disabled = true;
    chatContainer.innerHTML = "";
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error("JSON must be an array.");
    }

    // Validate each message has sender & text string
    for (const msg of parsed) {
      if (
        typeof msg.sender !== "string" ||
        typeof msg.text !== "string"
      ) {
        throw new Error(
          "Each message must be an object with string sender and text."
        );
      }
    }

    renderMessages(parsed);
    downloadBtn.disabled = false;
  } catch (e) {
    errorMsg.textContent = "Invalid JSON: " + e.message;
    downloadBtn.disabled = true;
    chatContainer.innerHTML = "";
  }
});

// Handle Download button click (using html2canvas)
downloadBtn.addEventListener("click", () => {
  html2canvas(chatContainer).then((canvas) => {
    const link = document.createElement("a");
    link.download = "fake-discord-chat.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
