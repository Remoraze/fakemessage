const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const chatContainer = document.getElementById("chat-container");
const errorMsg = document.getElementById("error-msg");

const senderSelect = document.getElementById("sender-select");
const messageTextInput = document.getElementById("message-text-input");
const addMessageBtn = document.getElementById("add-message-btn");
const messagesListDiv = document.getElementById("messages-list");

let messages = [];

// Helper: get initials from sender name (for avatar)
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Render chat messages in the chat container
function renderMessages(messagesArray) {
  chatContainer.innerHTML = ""; // Clear previous

  messagesArray.forEach(({ sender, text }) => {
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
      messageEl.appendChild(contentEl);
      messageEl.appendChild(avatarEl);
    } else {
      messageEl.appendChild(avatarEl);
      messageEl.appendChild(contentEl);
    }

    chatContainer.appendChild(messageEl);
  });
}

// Render messages list in the input section with remove buttons
function renderMessagesList() {
  messagesListDiv.innerHTML = "";

  if (messages.length === 0) {
    messagesListDiv.textContent = "No messages added yet.";
    generateBtn.disabled = true;
    downloadBtn.disabled = true;
    chatContainer.innerHTML = "";
    return;
  }

  messages.forEach((msg, i) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "message-list-item";

    const senderSpan = document.createElement("span");
    senderSpan.className = "message-list-sender";
    senderSpan.textContent = msg.sender;

    const textSpan = document.createElement("span");
    textSpan.className = "message-list-text";
    textSpan.textContent = msg.text;

    const removeBtn = document.createElement("button");
    removeBtn.className = "message-list-remove-btn";
    removeBtn.textContent = "×";
    removeBtn.title = "Remove message";
    removeBtn.onclick = () => {
      messages.splice(i, 1);
      renderMessagesList();
    };

    itemDiv.appendChild(senderSpan);
    itemDiv.appendChild(textSpan);
    itemDiv.appendChild(removeBtn);

    messagesListDiv.appendChild(itemDiv);
  });

  generateBtn.disabled = false;
  downloadBtn.disabled = true;
  chatContainer.innerHTML = "";
  errorMsg.textContent = "";
}

// Add message button handler
addMessageBtn.addEventListener("click", () => {
  const sender = senderSelect.value.trim();
  const text = messageTextInput.value.trim();

  if (!text) {
    errorMsg.textContent = "Message text cannot be empty.";
    return;
  }

  messages.push({ sender, text });
  messageTextInput.value = "";
  errorMsg.textContent = "";
  renderMessagesList();
});

// Generate chat button handler
generateBtn.addEventListener("click", () => {
  if (messages.length === 0) {
    errorMsg.textContent = "Add some messages first.";
    return;
  }
  errorMsg.textContent = "";
  renderMessages(messages);
  downloadBtn.disabled = false;
});

// Download chat image button handler
downloadBtn.addEventListener("click", () => {
  html2canvas(chatContainer).then((canvas) => {
    const link = document.createElement("a");
    link.download = "fake-discord-chat.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

// Initial state
renderMessagesList();

