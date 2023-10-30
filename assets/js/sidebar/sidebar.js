import { initEventListeners, initUI } from "/assets/js/sidebar/init/init.js";

const state = {
  currentFolderId: "0",
};

const SELECTORS = {
  breadcrumbContainer: "breadcrumb-container",
  mainContainer: "main-container",
  modalContainer: "modal-container",
  contextModalContainer: "context-modal-container",
  addTextBlockButton: "add-text-block",
  addContextBlockButton: "add-context-block",
  saveTextBlockButton: "save-text-block",
  saveContextButton: "save-context-button",
  editModeButton: "edit-mode-button",
  cancelTextBlockButton: "cancel-text-block",
  cancelContextButton: "cancel-context-button",
  folderDropdown: "folder-dropdown",
  createFolderButton: "create-folder",
  foldersList: "folders-list",
  titleInput: "title-input",
  contextTitleInput: "context-title-input",
  textArea: "text-area",
  aboutYouTextArea: "about-you-area",
  howRespondTextArea: "how-to-respond-area",
  textBlocksList: "text-blocks-list",
  contextList: "text-contexts-list",
  textBlockID: "text-block-hiddenId",
  contextID: "context-hiddenId",
};

const ClassSELECTOR = {
  tabButtonClass: ".tab-button",
  tabContentBlockClass: ".tab-content",
};

const mainContainer = document.getElementById(SELECTORS.mainContainer);
const modalContainer = document.getElementById(SELECTORS.modalContainer);
const contextModalContainer = document.getElementById(
  SELECTORS.contextModalContainer
);
const addTextBlockButton = document.getElementById(
  SELECTORS.addTextBlockButton
);
const addContextBlockButton = document.getElementById(
  SELECTORS.addContextBlockButton
);
const saveTextBlockButton = document.getElementById(
  SELECTORS.saveTextBlockButton
);
const cancelTextBlockButton = document.getElementById(
  SELECTORS.cancelTextBlockButton
);
const saveContextButton = document.getElementById(SELECTORS.saveContextButton);
const cancelContextButton = document.getElementById(
  SELECTORS.cancelContextButton
);
const folderDropdown = document.getElementById(SELECTORS.folderDropdown);
const createFolderButton = document.getElementById(
  SELECTORS.createFolderButton
);
const textBlockID = document.getElementById(SELECTORS.textBlockID);
const contextID = document.getElementById(SELECTORS.contextID);
const foldersList = document.getElementById(SELECTORS.foldersList);
const titleInput = document.getElementById(SELECTORS.titleInput);
const contextTitleInput = document.getElementById(SELECTORS.contextTitleInput);
const textArea = document.getElementById(SELECTORS.textArea);
const aboutYouTextArea = document.getElementById(SELECTORS.aboutYouTextArea);
const howRespondTextArea = document.getElementById(
  SELECTORS.howRespondTextArea
);
const textBlocksList = document.getElementById(SELECTORS.textBlocksList);
const contextList = document.getElementById(SELECTORS.contextList);
const breadcrumbContainer = document.getElementById(
  SELECTORS.breadcrumbContainer
);
const editModeButton = document.getElementById(SELECTORS.editModeButton);
const tabs = document.querySelectorAll(ClassSELECTOR.tabButtonClass);
const tabContents = document.querySelectorAll(
  ClassSELECTOR.tabContentBlockClass
);

// Llamar a las funciones de inicialización
document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  initUI();
});

export {
  mainContainer,
  modalContainer,
  contextModalContainer,
  addTextBlockButton,
  addContextBlockButton,
  saveTextBlockButton,
  cancelTextBlockButton,
  saveContextButton,
  cancelContextButton,
  folderDropdown,
  createFolderButton,
  foldersList,
  titleInput,
  contextTitleInput,
  textArea,
  aboutYouTextArea,
  howRespondTextArea,
  textBlocksList,
  contextList,
  breadcrumbContainer,
  editModeButton,
  textBlockID,
  contextID,
  tabs,
  tabContents,
  state,
};
