export function showModal(modalContainer) {
  modalContainer.classList.remove("hidden");
}

export function hideModal(modalContainer) {
  modalContainer.classList.add("hidden");
}

export function insertText(text) {
  // Enviar un mensaje al contenido del script con el texto a insertar
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { action: "insertText", text: text });
  });
}

export function insertContext(context) {
  // Enviar un mensaje al contenido del script con el texto a insertar
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {
      action: "loadContext",
      text: "",
      context,
    });
  });
}
