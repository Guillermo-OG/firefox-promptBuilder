import folderManager from "/assets/js/sidebar/manager/folderManager.js";
import textBlockManager from "/assets/js/sidebar/manager/textBlockManager.js";
import * as domUtils from "/assets/js/sidebar/utils/domUtils.js";
import {
  addTextBlockButton,
  addContextBlockButton,
  saveTextBlockButton,
  cancelTextBlockButton,
  saveContextButton,
  cancelContextButton,
  createFolderButton,
  modalContainer,
  contextModalContainer,
  editModeButton,
  titleInput,
  contextTitleInput,
  textArea,
  aboutYouTextArea,
  howRespondTextArea,
  folderDropdown,
  tabs,
  tabContents,
  contextID,
  textBlockID,
  state,
} from "/assets/js/sidebar/sidebar.js";

export function initEventListeners() {
  const folders =
    JSON.parse(localStorage.getItem("promptBuilderFolders")) || [];
  console.log("ta importando certinho");
  // Agregar eventListeners aquí
  addTextBlockButton.addEventListener("click", () => {
    domUtils.showModal(modalContainer);
    const currentFolder = folders.find(
      (folder) => folder.id === state.currentFolderId
    );
    folderManager.updateFolderDropdown(currentFolder);
  });

  addContextBlockButton.addEventListener("click", () => {
    domUtils.showModal(contextModalContainer);
  });

  saveTextBlockButton.addEventListener("click", () => {
    let title = titleInput.value.trim();
    const text = textArea.value.trim();
    const folderId = folderDropdown.value;

    if (title && text) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
      const textBlock = {
        id: new Date().getTime(),
        title: title,
        text: text,
        folderId: folderId,
      };

      textBlockManager.addTextBlock(textBlock);

      // Limpiar los campos de entrada en la UI
      titleInput.value = "";
      textArea.value = "";

      domUtils.hideModal(modalContainer);
    } else {
      alert("Please fill in both title and text fields.");
    }
  });

  saveContextButton.addEventListener("click", () => {
    let title = contextTitleInput.value.trim();
    const userContext = aboutYouTextArea.value.trim(); // Aquí puedes capturar el valor de la entrada real
    const howToAnswer = howRespondTextArea.value.trim(); // Aquí puedes capturar el valor de la entrada real
    const contextId = contextID.value.trim();
    if (title && userContext && howToAnswer) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
      const contextBlock = {
        id: contextId || new Date().getTime(),
        title: title,
        userContext: userContext,
        howToAnswer: howToAnswer,
      };

      if (contextId) {
        textBlockManager.updateContextBlock(contextBlock); // Método para actualizar
        disableEditMode();
      } else {
        textBlockManager.addContextBlock(contextBlock); // Método para agregar
      }
      // Limpiar los campos de entrada en la UI
      contextTitleInput.value = "";
      aboutYouTextArea.value = "";
      howRespondTextArea.value = "";
      // Añadir lógica para limpiar otros campos aquí

      domUtils.hideModal(contextModalContainer);
    } else {
      alert("Please fill in all fields.");
    }
  });

  editModeButton.addEventListener("click", () => {
    toggleEditMode();
  });

  cancelTextBlockButton.addEventListener("click", () => {
    domUtils.hideModal(modalContainer);
  });

  cancelContextButton.addEventListener("click", () => {
    domUtils.hideModal(contextModalContainer);
  });
  createFolderButton.addEventListener("click", () => {
    const folderName = prompt("Enter the folder name:");
    const folderId = folderDropdown.value;

    if (folderName) {
      folderManager.addFolder(folderName, folderId);
    }
  });

  manageTabs();
}

export function initUI() {
  folderManager.updateFoldersList();
  textBlockManager.updateTextBlocksList();
  textBlockManager.updateContextList();
  folderManager.updateFolderDropdown();
}

let isEditMode = false;

function toggleEditMode() {
  isEditMode = !isEditMode;

  if (isEditMode) {
    // Activar el modo de edición
    document.body.classList.add("edit-mode");
    editModeButton.classList.remove("edit-mode-button-active");
  } else {
    disableEditMode();
  }
}

function manageTabs() {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.id.replace("-tab", "-content");
      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === target) {
          content.classList.add("active");
        }
      });
    });
  });

  if (tabs.length > 0) {
    tabs[0].click();
  }
}

export function disableEditMode() {
  // Desactivar el modo de edición
  contextID.value = "";
  isEditMode = false;
  document.body.classList.remove("edit-mode");
  editModeButton.classList.add("edit-mode-button-active");
}
