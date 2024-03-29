const collage = document.querySelector('.collage_with_dogs');
const modalWindow = document.querySelector('.modal_window');
const modalImg = document.querySelector('.modal_window_img');
const buttonClose = document.querySelector('.button_close');
const buttonDwnld = document.querySelector('.button_dwnld');
const url = "https://dog.ceo/api/breeds/image/random";
let images = []; //пути изображений
let timer;
let numberImg = 12;

//Получаем изображения через зарос рандомно по одному
function getImage() {
    fetch(url)
        .then(response => { return response.json(); })
        .then(data => {
            images.unshift(data.message.toString()); //добавляем сразу в массив с путями изображений
        })
        .catch(error => {
            console.error(error);
        })
}

//Добавляем изображения в коллаж
function addNewImageToCollage() {
    getImage(); //Получаем изображение
    if (images.length > numberImg) { //Изображения будут меняться по часовой стрелки за счёт удаления последнего
        images.pop();
    }
    collage.innerHTML = '';
    images.forEach((imgSrc) => {
        const img = document.createElement('img');
        img.classList.add("img_collage");
        img.src = imgSrc;
        //Ширину изображения получаем рандомно, высота через css auto, чтобы сохранить пропорции
        let imgWidth = parseInt(Math.random() * 450);
        img.width = `${imgWidth}`;
        collage.appendChild(img);
        setTimeout(() => img.classList.add("animate"), 100); // Плавное появление
    });
};

//Обновление коллажа срабатывает с интервалом в 3 секунды
document.addEventListener("DOMContentLoaded", () => {
    timer = setInterval(function () {
        addNewImageToCollage();
    }, 3000);
});

/* Появление модального окна с изображением (останавливаем обновление галлереи), для скачивания используем тэг a с downoload, в 
src, которого вставляем полученный путь картинки*/
collage.addEventListener('click', event => {
    if (event.target.tagName === 'IMG') {
        const imgModal = document.createElement('img');
        imgModal.src = event.target.src;
        buttonDwnld.href = event.target.src;
        modalImg.appendChild(imgModal);
        modalWindow.style.display = "flex";
        clearInterval(timer);
    }
});

//Закрвтие модального окна и возобновление работы коллажа
buttonClose.addEventListener('click', event => {
    modalWindow.style.display = "none";
    modalImg.innerHTML = '';
    timer = setInterval(function () { addNewImageToCollage(); }, 3000);
});