const senderInput = document.getElementById("sender-input");
const avatarFileInput = document.getElementById("avatar-file-input");
const avatarUrlInput = document.getElementById("avatar-url-input");
const messageTextInput = document.getElementById("message-text-input");
const addMessageBtn = document.getElementById("add-message-btn");
const messagesListDiv = document.getElementById("messages-list");
const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const chatContainer = document.getElementById("chat-container");
const errorMsg = document.getElementById("error-msg");

let messages = [];

// Helper: Convert file input to base64 URL
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Helper: Get initials if no avatar
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Render the list of added messages with remove buttons
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

// Render the chat messages in Discord style
function renderChat(messagesArray) {
  chatContainer.innerHTML = ""; // Clear previous

  messagesArray.forEach(({ sender, text, avatar }) => {
    const isYou = sender.toLowerCase() === "you";

    const messageEl = document.createElement("div");
    messageEl.className = "message " + (isYou ? "you" : "them");

    // Avatar container
    const avatarEl = document.createElement("div");
    avatarEl.className = "avatar";

    if (avatar) {
      const img = document.createElement("img");
      img.src = avatar;
      img.alt = `${sender}'s avatar`;
      img.onerror = () => {
        avatarEl.textContent = getInitials(sender);
      };
      avatarEl.appendChild(img);
    } else {
      avatarEl.textContent = getInitials(sender);
    }

    // Message content
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

// Add message event handler
addMessageBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const sender = senderInput.value.trim();
  const text = messageTextInput.value.trim();
  const avatarFile = avatarFileInput.files[0];
  const avatarUrl = avatarUrlInput.value.trim();

  if (!sender) {
    errorMsg.textContent = "Sender name cannot be empty.";
    return;
  }
  if (!text) {
    errorMsg.textContent = "Message text cannot be empty.";
    return;
  }

  errorMsg.textContent = "";

  let avatar = null;

  if (avatarFile) {
    try {
      avatar = await fileToDataURL(avatarFile);
    } catch (e) {
      errorMsg.textContent = "Failed to load avatar image file.";
      return;
    }
  } else if (avatarUrl) {
    avatar = avatarUrl;
  }

  messages.push({ sender, text, avatar });

  // Clear inputs (but keep avatar URL for convenience)
  senderInput.value = "";
  messageTextInput.value = "";
  avatarFileInput.value = "";

  renderMessagesList();
});

// Generate chat button event handler
generateBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (messages.length === 0) {
    errorMsg.textContent = "Add some messages first.";
    return;
  }
  errorMsg.textContent = "";
  renderChat(messages);
  downloadBtn.disabled = false;
});

// Download chat image event handler
downloadBtn.addEventListener("click", (e) => {
  e.preventDefault();

  html2canvas(chatContainer, { backgroundColor: null }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "fake-discord-chat.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

// Initialize
renderMessagesList();
