const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event){
        const { files: fileList} = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event){
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList} = input

        if ( fileList.length > uploadLimit ){
            alert(`Envie até ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value=="photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if( totalPhotos > uploadLimit){
            alert("Você ultrapassou o limite de fotos")
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles(){
        const dataTranfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTranfer.items.add(file))

        return dataTranfer.files
    },
    getContainer(image){
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())
        return div
    },
    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event){
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    }
}

function addIngredient(){
    const ingredients = document.querySelector("#ingredients")
    const fieldContainer = document.querySelectorAll(".ingredient")

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
    if (newField.children[0].value == "") return false

    newField.children[0].value = ""
    ingredients.appendChild(newField)
}

function addSteps(){
    const steps = document.querySelector("#steps")
    const fieldContainer = document.querySelectorAll(".step")

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
    if (newField.children[0].value == "") return false

    newField.children[0].value = ""
    steps.appendChild(newField)
}
document.querySelector(".add-ingredient").addEventListener("click", addIngredient)
document.querySelector(".add-step").addEventListener("click", addSteps)

