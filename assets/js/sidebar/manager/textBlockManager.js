import {
  textBlocksList,
  modalContainer,
  textBlockID,
  titleInput,
  textArea,
  folderDropdown,
  contextList,
  contextModalContainer,
  contextTitleInput,
  aboutYouTextArea,
  howRespondTextArea,
  contextID,
} from "/assets/js/sidebar/sidebar.js"
import { insertText, insertContext } from "/assets/js/sidebar/utils/domUtils.js"
import folderManager from "/assets/js/sidebar/manager/folderManager.js"
import * as domUtils from "/assets/js/sidebar/utils/domUtils.js"

const textBlockManager = {
  addTextBlock: function (textBlock) {
    // Cargar carpetas desde el almacenamiento local
    let folders = JSON.parse(localStorage.getItem("promptBuilderFolders")) || []

    // Si el folderId es "root" (0), agregar el bloque de texto a un array "rootBlocks"
    if (textBlock.folderId === 0) {
      let rootBlocks = JSON.parse(localStorage.getItem("rootTextBlocks")) || []

      rootBlocks.push(textBlock)

      // Guardar la lista de bloques de texto "root" actualizada en el almacenamiento local
      localStorage.setItem("rootTextBlocks", JSON.stringify(rootBlocks))

      // Actualizar la lista de bloques de texto en la UI
      textBlockManager.updateTextBlocksList()
    } else {
      // Buscar la carpeta a la que pertenece el bloque de texto
      const folder = folders.find(
        (folder) => folder.id === parseInt(textBlock.folderId)
      )

      if (folder) {
        // Agregar el bloque de texto a la carpeta
        folder.blocks.push(textBlock)

        // Guardar la lista de carpetas actualizada en el almacenamiento local
        localStorage.setItem("promptBuilderFolders", JSON.stringify(folders))

        // Actualizar la lista de bloques de texto en la UI
        textBlockManager.updateTextBlocksList(folder)
        folderManager.updateFoldersList(folder)
      } else {
        console.error("Folder not found")
      }
    }
  },
  openEditTextBlockModal(block) {
    // Show the modal
    domUtils.showModal(modalContainer)

    // Populate the modal fields with the block data
    textBlockID.value = block.id
    titleInput.value = block.title
    textArea.value = block.text
    folderDropdown.value = parseInt(block.folderId)
  },
  updateTextBlock: function (updatedTextBlock) {
    // Cargar carpetas desde el almacenamiento local
    let folders = JSON.parse(localStorage.getItem("promptBuilderFolders")) || []

    // Buscar la carpeta a la que pertenece el bloque de texto
    const folder = folders.find(
      (folder) => folder.id === parseInt(updatedTextBlock.folderId)
    )

    if (folder) {
      // Encontrar el índice del bloque de texto a editar
      const blockIndex = folder.blocks.findIndex(
        (block) => block.id === updatedTextBlock.id
      )

      if (blockIndex >= 0) {
        // Reemplazar el bloque de texto existente con el bloque de texto actualizado
        folder.blocks[blockIndex] = updatedTextBlock

        // Guardar la lista de carpetas actualizada en el almacenamiento local
        localStorage.setItem("promptBuilderFolders", JSON.stringify(folders))

        // Actualizar la lista de bloques de texto en la UI
        textBlockManager.updateTextBlocksList(folder)
      } else {
        console.error("Text block not found")
      }
    } else {
      console.error("Folder not found")
    }
  },
  updateTextBlocksList: function (selectedFolder) {
    console.log(selectedFolder)
    textBlocksList.innerHTML = ""

    let blocksToShow = []

    // Si el folder seleccionado es "root", mostrar bloques de texto con folderId igual a null
    if (selectedFolder === 0 || !selectedFolder || selectedFolder.id === "0") {
      let rootBlocks = JSON.parse(localStorage.getItem("rootTextBlocks")) || []

      blocksToShow = rootBlocks
    } else {
      blocksToShow = selectedFolder.blocks
    }

    // Mostrar bloques de texto de la carpeta seleccionada o los bloques en el nivel de raíz
    blocksToShow.forEach((block) => {
      const textBlockElement = document.createElement("button")
      textBlockElement.className = "text-block-button"
      textBlockElement.textContent = block.title

      // Botón para editar bloque de texto
      const editTextBlockButton = document.createElement("button")
      editTextBlockButton.className = "edit-text-block"
      editTextBlockButton.textContent = "Edit"
      editTextBlockButton.addEventListener("click", (event) => {
        event.stopPropagation() // Evita que se active el evento click del elemento del bloque de texto
        textBlockManager.openEditTextBlockModal(block)
      })

      // Botón para eliminar bloque de texto
      const deleteTextBlockButton = document.createElement("button")
      deleteTextBlockButton.className = "delete-text-block"
      deleteTextBlockButton.textContent = "X"
      deleteTextBlockButton.addEventListener("click", (event) => {
        event.stopPropagation() // Evita que se active el evento click del elemento del bloque de texto
        textBlockManager.deleteTextBlock(selectedFolder, block)
      })

      textBlockElement.appendChild(editTextBlockButton)
      textBlockElement.appendChild(deleteTextBlockButton)

      textBlockElement.addEventListener("click", () => {
        textBlockManager.insertTextBlock(block)
      })

      // Add mouseover and mouseout events for hover preview:
      textBlockElement.addEventListener("mouseover", () => {
        textBlockElement.title = block.text // Set the tooltip to the block text
      })

      textBlockElement.addEventListener("mouseout", () => {
        textBlockElement.title = "" // Clear the tooltip on mouseout
      })

      textBlocksList.appendChild(textBlockElement)
    })
  },

  insertTextBlock: function (block) {
    insertText(block.text)
  },

  deleteTextBlock: function (selectedFolder, block) {
    // Cargar carpetas desde el almacenamiento local
    let folders = JSON.parse(localStorage.getItem("promptBuilderFolders")) || []

    if (!selectedFolder || selectedFolder.id === "0" || !selectedFolder.id) {
      // Eliminar bloque de la lista de bloques root
      let rootBlocks = JSON.parse(localStorage.getItem("rootTextBlocks")) || []
      rootBlocks = rootBlocks.filter((textBlock) => textBlock.id !== block.id)
      localStorage.setItem("rootTextBlocks", JSON.stringify(rootBlocks))
      textBlockManager.updateTextBlocksList()
    } else {
      const folderIndex = folders.findIndex(
        (folder) => folder.id === selectedFolder.id
      )

      if (folderIndex >= 0) {
        const selectedFolder = folders[folderIndex]
        selectedFolder.blocks = selectedFolder.blocks.filter(
          (textBlock) => textBlock.id !== block.id
        )

        // Reemplazar la carpeta existente con la carpeta actualizada
        folders[folderIndex] = selectedFolder

        // Guardar la lista de carpetas actualizada en el almacenamiento local
        localStorage.setItem("promptBuilderFolders", JSON.stringify(folders))

        // Actualizar la lista de bloques de texto en la UI
        textBlockManager.updateTextBlocksList(selectedFolder)
      } else {
        console.error("Folder not found")
      }
    }
  },

  editTextBlock: function (updatedTextBlock) {
    // Cargar carpetas desde el almacenamiento local
    let folders = JSON.parse(localStorage.getItem("promptBuilderFolders")) || []

    // Buscar la carpeta a la que pertenece el bloque de texto
    const folder = folders.find(
      (folder) => folder.id === parseInt(updatedTextBlock.folderId)
    )

    if (folder) {
      // Encontrar el índice del bloque de texto a editar
      const blockIndex = folder.blocks.findIndex(
        (block) => block.id === updatedTextBlock.id
      )

      if (blockIndex >= 0) {
        // Reemplazar el bloque de texto existente con el bloque de texto actualizado
        folder.blocks[blockIndex] = updatedTextBlock

        // Guardar la lista de carpetas actualizada en el almacenamiento local
        localStorage.setItem("promptBuilderFolders", JSON.stringify(folders))

        // Actualizar la lista de bloques de texto en la UI
        textBlockManager.updateTextBlocksList()
      } else {
        console.error("Text block not found")
      }
    } else {
      console.error("Folder not found")
    }
  },

  addContextBlock: function (contextBlock) {
    let contexts =
      JSON.parse(localStorage.getItem("promptBuilderContexts")) || []
    contexts.push(contextBlock)
    localStorage.setItem("promptBuilderContexts", JSON.stringify(contexts))
    textBlockManager.updateContextList()
  },

  updateContextBlock: function (updatedContext) {
    let contexts =
      JSON.parse(localStorage.getItem("promptBuilderContexts")) || []
    const index = contexts.findIndex(
      (context) => context.id == updatedContext.id
    )

    if (index !== -1) {
      contexts[index] = updatedContext
      localStorage.setItem("promptBuilderContexts", JSON.stringify(contexts))
      textBlockManager.updateContextList()
    }
  },

  updateContextList: function () {
    contextList.innerHTML = ""
    const contexts =
      JSON.parse(localStorage.getItem("promptBuilderContexts")) || []
    contexts.forEach((context) => {
      const contextElement = document.createElement("button")
      contextElement.className = "text-context-button"
      contextElement.textContent = context.title

      contextElement.addEventListener("click", () => {
        textBlockManager.insertContextBlock(context)
      })

      contextElement.addEventListener("mouseover", () => {
        // Show both "About You" and "How to Respond" in the tooltip
        contextElement.title = `About You:\n${context.userContext}\n\nHow to Respond:\n${context.howToAnswer}`
      })

      contextElement.addEventListener("mouseout", () => {
        contextElement.title = ""
      })
      // Botón para editar contexto
      const editContextButton = document.createElement("button")
      editContextButton.className = "edit-text-block"
      editContextButton.textContent = "Edit"
      editContextButton.addEventListener("click", (event) => {
        event.stopPropagation()

        // Abre el modal para editar el contexto y llena los campos con la información actual del contexto
        domUtils.showModal(contextModalContainer)

        contextID.value = context.id
        // Aquí se rellenan los campos con los valores del `context` actual
        contextTitleInput.value = context.title
        aboutYouTextArea.value = context.userContext
        howRespondTextArea.value = context.howToAnswer
      })

      // Botón para eliminar contexto
      const deleteContextButton = document.createElement("button")
      deleteContextButton.className = "delete-text-block"
      deleteContextButton.textContent = "X"
      deleteContextButton.addEventListener("click", (event) => {
        event.stopPropagation()
        textBlockManager.deleteContext(context)
      })

      contextElement.appendChild(editContextButton)
      contextElement.appendChild(deleteContextButton)
      contextList.appendChild(contextElement)
    })
  },

  insertContextBlock: function (context) {
    insertContext(context)
  },

  deleteContext: function (contextToDelete) {
    let contexts =
      JSON.parse(localStorage.getItem("promptBuilderContexts")) || []
    contexts = contexts.filter((context) => context.id !== contextToDelete.id)
    localStorage.setItem("promptBuilderContexts", JSON.stringify(contexts))
    textBlockManager.updateContextList()
  },
}

export default textBlockManager
