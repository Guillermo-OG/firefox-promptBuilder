import textBlockManager from "/assets/js/sidebar/manager/textBlockManager.js"
import { disableEditMode } from "/assets/js/sidebar/init/init.js"

import {
  folderDropdown,
  foldersList,
  breadcrumbContainer,
  state,
} from "/assets/js/sidebar/sidebar.js"

const folderManager = {
  addFolder: function (folderName, parentId) {
    let folders = JSON.parse(localStorage.getItem("promptBuilderFolders")) || []
    parentId = parentId === "0" ? 0 : Number(parentId) // Ensure parentId is a number

    folderName = folderName.charAt(0).toUpperCase() + folderName.slice(1)

    const parentFolder = folders.find((f) => f.id === parentId)
    const level = parentId === "0" || !parentFolder ? 0 : parentFolder.level + 1

    const folder = {
      id: new Date().getTime(),
      parentId: parentId || 0,
      name: folderName,
      blocks: [],
      level: level,
    }

    // Cargar carpetas desde el almacenamiento local

    // Agregar la nueva carpeta a la lista de carpetas
    folders.push(folder)

    // Guardar la lista de carpetas actualizada en el almacenamiento local
    localStorage.setItem("promptBuilderFolders", JSON.stringify(folders))

    // Actualizar la lista desplegable de carpetas en la UI
    folderManager.updateFolderDropdown(folder)
    folderManager.updateFoldersList(folder)
    textBlockManager.updateTextBlocksList(folder)

    folderDropdown.value = folder.id
  },
  updateFoldersList: function (parentFolder) {
    foldersList.innerHTML = ""

    // Cargar carpetas desde el almacenamiento local
    let folders = JSON.parse(localStorage.getItem("promptBuilderFolders")) || []

    const parentId = parentFolder ? parentFolder.id : "0"

    const childFolders = folders.filter(
      (folder) => folder.parentId === parentId
    )

    childFolders.forEach((folder) => {
      if (folder.id !== parentId) {
        const folderElement = document.createElement("button")
        folderElement.className = "folder-button"
        folderElement.textContent = folder.name

        // Botón para eliminar carpeta
        const deleteFolderButton = document.createElement("button")
        deleteFolderButton.className = "delete-folder"
        deleteFolderButton.textContent = "X"
        deleteFolderButton.addEventListener("click", (event) => {
          event.stopPropagation() // Evita que se active el evento click del elemento de la carpeta
          folderManager.deleteFolder(folder)
        })

        folderElement.appendChild(deleteFolderButton)

        folderElement.addEventListener("click", () => {
          textBlockManager.updateTextBlocksList(folder)
          folderManager.updateFoldersList(folder)
        })

        foldersList.appendChild(folderElement)
      }
    })
    folderManager.updateBreadcrumb(parentFolder)
    disableEditMode()
    state.currentFolderId = parentId
  },
  updateFolderDropdown: function (folder) {
    const parentId = folder ? folder.parentId : "0"
    const level = folder ? folder.level : 0

    // Cargar carpetas desde el almacenamiento local
    let folders = JSON.parse(localStorage.getItem("promptBuilderFolders")) || []

    // Limpiar las opciones actuales de la lista desplegable
    folderDropdown.innerHTML = ""

    // Agregar la opción (root) al principio
    const rootOption = document.createElement("option")
    rootOption.value = 0
    rootOption.textContent = "(root)"
    folderDropdown.appendChild(rootOption)

    // Función recursiva para agregar carpetas y sus subcarpetas
    function addFolderOptions(parentId, level) {
      const childFolders = folders.filter(
        (folder) => folder.parentId === parentId
      )

      childFolders.forEach((folder) => {
        const folderOption = document.createElement("option")
        folderOption.value = folder.id
        folderOption.textContent = "-".repeat(level) + " " + folder.name

        // Establecer el atributo 'selected' si el folder es el currentFolder
        if (state.currentFolderId && folder.id === state.currentFolderId) {
          folderOption.selected = true
        }

        folderDropdown.appendChild(folderOption)

        // Llamar a la función para agregar subcarpetas si hay carpetas hijas
        const hasChildFolders = folders.some((f) => f.parentId === folder.id)
        if (hasChildFolders) {
          addFolderOptions(folder.id, level + 1)
        }
      })
    }

    // Iniciar la construcción de opciones de carpetas con el parentId dado
    addFolderOptions(Number(parentId), level) // Convert parentId to number
  },
  updateBreadcrumb(folder) {
    // Cargar carpetas desde el almacenamiento local
    let folders = JSON.parse(localStorage.getItem("promptBuilderFolders")) || []

    console.log(folder)
    breadcrumbContainer.innerHTML = ""

    const rootCrumb = document.createElement("span")
    rootCrumb.className = "breadcrumb-item"
    rootCrumb.textContent = "Root"
    rootCrumb.addEventListener("click", () => {
      folderManager.updateFoldersList({ id: "0" })
      textBlockManager.updateTextBlocksList({ id: "0" })
    })
    breadcrumbContainer.appendChild(rootCrumb)

    if (folder && folder.id !== 0) {
      let currentFolder = folder
      const breadcrumbs = [currentFolder]

      while (currentFolder.parentId !== "0") {
        currentFolder = folders.find((f) => f.id === currentFolder.parentId)
        breadcrumbs.unshift(currentFolder)
      }

      breadcrumbs.forEach((crumbFolder, index) => {
        const crumb = document.createElement("span")
        crumb.className = "breadcrumb-item"
        crumb.textContent = crumbFolder.name
        crumb.addEventListener("click", () => {
          folderManager.updateFoldersList(crumbFolder)
        })

        const separator = document.createElement("span")
        separator.className = "breadcrumb-separator"
        separator.textContent = ">"
        breadcrumbContainer.appendChild(separator)

        breadcrumbContainer.appendChild(crumb)
      })
    }
  },
  deleteFolder: function (folderToDelete) {
    // Cargar carpetas desde el almacenamiento local
    let folders = JSON.parse(localStorage.getItem("promptBuilderFolders")) || []

    // Función recursiva para eliminar carpetas y sus subcarpetas
    function deleteFolderAndSubfolders(folderId) {
      // Eliminar la carpeta actual
      folders = folders.filter((folder) => folder.id !== folderId)

      // Encontrar todas las subcarpetas de la carpeta actual
      const subfolders = folders.filter(
        (folder) => folder.parentId === folderId
      )

      // Llamar recursivamente a la función para eliminar las subcarpetas
      subfolders.forEach((subfolder) => deleteFolderAndSubfolders(subfolder.id))
    }

    // Iniciar la eliminación de carpetas con la carpeta dada
    deleteFolderAndSubfolders(folderToDelete.id)

    // Guardar la lista de carpetas actualizada en el almacenamiento local
    localStorage.setItem("promptBuilderFolders", JSON.stringify(folders))

    // Actualizar la lista de carpetas en la UI
    folderManager.updateFoldersList()
  },
}

export default folderManager
