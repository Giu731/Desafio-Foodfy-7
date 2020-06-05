const receitas = document.querySelectorAll('.receita')
// const recipes = require('../')
const receitasInfo = document.querySelectorAll('.recipes-info')
const visibility = document.querySelectorAll('.visibility')
const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")   

for(item of menuItems){
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}


for(let i=0; i<visibility.length; i++){
    visibility[i].addEventListener("click", function(){
        if(receitasInfo[i].classList.contains("hidden")){
            receitasInfo[i].classList.remove("hidden")
            visibility[i].innerHTML = "ESCONDER"
        }else{
            receitasInfo[i].classList.add("hidden")
            visibility[i].innerHTML = "MOSTRAR"
        }
    })
}

for(receita of receitas){
    receita.id.addEventListener("click", function(){
        window.location.href = `/receitas/${receita.id}`
    })
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e){
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
    }
}

// for (let i=0; i < 11; i++){
//     receitas[i].addEventListener("click", function(){
//         if(i>=6){
//             let index = i - 6
//             window.location.href = `/receitas/${index}`
//         }else{
//             window.location.href = `/receitas/${i}`
//         }

//     })
// }
// Preciso arrumar o redirecionamento das páginas!!