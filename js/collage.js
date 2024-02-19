const collage = document.querySelector('.collage_with_dogs');
const modalWindow = document.querySelector('.modal_window');
const modalImg = document.querySelector('.modal_window_img');
const buttonClose = document.querySelector('.button_close');
const buttonDwnld = document.querySelector('.button_dwnld');
const url = "https://dog.ceo/api/breeds/image/random";
let images = [];
let timer;
let numberImg = 12;

function getImage() {
    fetch(url)
        .then(response => { return response.json(); })
        .then(data => {
            images.unshift(data.message.toString());
        })
        .catch(error => {
            console.error(error);
        })
}

//добавляет  фотки в коллаж
function addNewImageToCollage() {
    getImage();
    if (images.length > numberImg) {
        images.pop();
    }
    collage.innerHTML = '';
    images.forEach((imgSrc) => {
        const img = document.createElement('img');
        img.classList.add("img_collage");
        img.src = imgSrc;
        let imgWidth = parseInt(Math.random() * 450);
        img.width = `${imgWidth}`;
        collage.appendChild(img);
        setTimeout(() => img.classList.add("animate"), 100); // Плавное появление
    });
};

document.addEventListener("DOMContentLoaded", () => {
    timer = setInterval(function () {
        addNewImageToCollage();
    }, 3000);
});

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

buttonClose.addEventListener('click', event => {
    modalWindow.style.display = "none";
    modalImg.innerHTML = '';
    timer = setInterval(function () { addNewImageToCollage(); }, 3000);
});