function simulateTyping(element, text) {
  element.focus(); // Pone el foco en el elemento

  element.value = text; // Establece el valor del elemento

  // Dispara un evento de entrada
  const inputEvent = new Event("input", {
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(inputEvent);

  // Dispara un evento de cambio
  const changeEvent = new Event("change", {
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(changeEvent);
}

function insertTextAtCursor(text) {
  const activeElement = document.activeElement;
  const start = activeElement.selectionStart;
  const end = activeElement.selectionEnd;
  const value = activeElement.value;

  if (value.length > 0 && start === end) {
    text = " " + text;
  }

  activeElement.value = value.slice(0, start) + text + value.slice(end);
  activeElement.selectionStart = start + text.length;
  activeElement.selectionEnd = start + text.length;
  activeElement.focus();

  const event = new KeyboardEvent("input", { data: text });
  activeElement.dispatchEvent(event);
}

function insertContextToWeb(context) {
  // Obtiene todos los elementos div con id que comienza con 'radix-:'
  const radixElements = document.querySelectorAll('div[id^="radix-:"]');

  for (const radixElement of radixElements) {
    // Encuentra todos los textarea dentro del elemento actual
    const textareas = radixElement.querySelectorAll("textarea");

    if (textareas.length >= 2) {
      // Si se encuentran al menos dos textareas, simula la escritura
      simulateTyping(textareas[0], context.userContext);
      simulateTyping(textareas[1], context.howToAnswer);

      return; // Sale de la función después de encontrar el primer div adecuado
    }
  }

  // Registro si no se encuentra un div adecuado con dos textareas
  console.log("No se encontró un div adecuado con dos textareas");
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("action", message.action);
  if (message.action === "insertText") {
    insertTextAtCursor(message.text);
  } else if (message.action === "loadContext") {
    insertContextToWeb(message.context); // Llama a la función modificada aquí
    console.log(message);
  }
});
