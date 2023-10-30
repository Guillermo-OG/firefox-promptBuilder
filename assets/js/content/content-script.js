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
  // Busca el elemento con el ID 'radix-:rd:'
  const radixElement = document.querySelector('div[id^="radix-:"]');

  if (!radixElement) {
    console.log("Element with id starting with 'radix-:' not found");
    return;
  }

  // Encuentra todos los textarea dentro del elemento
  const textareas = radixElement.querySelectorAll("textarea");

  console.log(textareas);

  if (textareas.length < 2) {
    console.log("Less than two textareas found");
    return;
  }

  // Simular escritura en el primer textarea
  simulateTyping(textareas[0], context.userContext);

  // Simular escritura en el segundo textarea
  simulateTyping(textareas[1], context.howToAnswer);
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
