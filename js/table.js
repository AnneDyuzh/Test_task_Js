let pageTableNumber = document.querySelector('.number-page-table');
let postsPerUser = document.querySelector('.user-posts');
let arrowNext = document.querySelector('.arrow-next');
let arrowPrev = document.querySelector('.arrow-prev');
let closeSideBar = document.querySelector('.button_close_sideBar');
const urlUser = 'https://dummyjson.com/users';
let limitRows = 20; // лимит записей о пользователях на странице таблицы
let skipRows = 0; // количество записей, которые нужно пропустить при получении данных
let usersData = []; // данные пользователей
let userPosts = []; // данные о постах пользователя
let currentPageTable = 1; //текущая страница таблицы
let totalUsers; //общее количество пользователей
let totalPagesTable; //общее количество страниц таблицы


/* Получаем данные пользователей по запросу, отбираем только те, которые нас интересуют по заданию.
skip - сколько записей требуется пропустить, limit - сколько записей требуется взять
Также через запрос узнаем общее количество пользователей для подсчёта страниц
Возращает список пользователей
*/
async function getUsersData() {
    await fetch(`${urlUser}?skip=${skipRows}&limit=${limitRows}`)
        .then(response => response.json())
        .then(data => {
            usersData = data.users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
                birthDate: user.birthDate,
                height: user.height,
                ip: user.ip
            }));
            totalUsers = data.total
        });
    return usersData;
};

/**
 * Функция для отображения данных пользователя в таблицу
 * @param users - данные пользователей
 */
function displayUsersRows(users) {
    bodyTable.innerHTML = '';
    users.forEach(user => {
        const fullName = `${user.lastName} ${user.firstName}`;
        const bodyTable = document.getElementById('bodyTable');
        bodyTable.innerHTML += `
            <tr onclick="showSideBar(${user.id})">
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${fullName}</td>
                <td>${user.birthDate}</td>
                <td>${user.height}</td>
                <td>${user.ip}</td>
            </tr>
        `;
    });
};

/**
 * Функция для отображения пользователей на каждой странице
 * @param page  - страница таблицы, на которой будут размещены данные
 */
async function displayUsersPerPage(page) {
    //Фиксируется текущая страница
    currentPageTable = page;
    const usersPerData = await getUsersData();
    displayUsersRows(usersPerData);
    totalPagesTable = Math.ceil(totalUsers / limitRows);
};

/*Для перехода на следующую страницу, меняются значения текущей страницы 
и количество записей, которые нужно пропустить*/
arrowNext.addEventListener('click', event => {
    if (currentPageTable < totalPagesTable) {
        currentPageTable++;
        pageTableNumber.innerText = (currentPageTable);
        skipRows += limitRows;
        displayUsersPerPage(currentPageTable);
    }
});

/*Для перехода на предыдущую страницу, меняются значения текущей страницы 
и количество записей, которые нужно пропустить*/
arrowPrev.addEventListener('click', event => {
    if (currentPageTable > 1) {
        currentPageTable--;
        pageTableNumber.innerText = (currentPageTable);
        skipRows -= limitRows;
        displayUsersPerPage(currentPageTable);
    }
});

//Сортировка чисел по возрастанию
const sortByField = (field, a, b) => a[field] - b[field];
//Сортировка строк по возрастанию
const sortByFieldString = (field, a, b) => a[field].localeCompare(b[field]);
//Сортировка даты по возрастанию
const sortByFieldDate = (field, a, b) => new Date(a[field]) - new Date(b[field]);
//Сортировка ip-адреса
const sortByFieldIpAddress = (field, a, b) => {
    const ipToNumber = ip => ip.split('.').reduce((acc, num, idx) => acc + parseInt(num) * Math.pow(256, 3 - idx), 0);
    return ipToNumber(a[field]) - ipToNumber(b[field]);
};

//Параметры сортировки
const parametrsSort = {
    'id': (a, b) => sortByField('id', a, b),
    'username': (a, b) => sortByFieldString('username', a, b),
    'email': (a, b) => sortByFieldString('email', a, b),
    'fullName': (a, b) => sortByFieldString('lastName', a, b),
    'birthDate': (a, b) => sortByFieldDate('birthDate', a, b),
    'height': (a, b) => sortByField('height', a, b),
    'ip': (a, b) => sortByFieldIpAddress('ip', a, b),
};

//Сортировка
const sort = (field) => displayUsersRows(usersData.sort((a, b) => parametrsSort[field](a, b)));

/**
 * Получаем данные о постах пользователя по запросу, отбираем только те, которые нас интересуют по заданию.
 * Возращает список постов
 * @param id  - идентификатов пользователя
 */
async function getUserPosts(id) {
    console.log(`${urlUser}/${id}/posts`);
    await fetch(`${urlUser}/${id}/posts`)
        .then(response => response.json())
        .then(data => {
            userPosts = data.posts.map(post => ({
                title: post.title,
                body: post.body
            }));
        });
    return userPosts;
};

/**
 * Функция для отображения боковой панели и получения списка постов для дальнейшего отображения
 * @param id  - идентификатор пользователя, по которому достаются посты 
 */
async function showSideBar(id) {
    const perUserPosts = await getUserPosts(id);
    displayUsersPosts(perUserPosts);
    const sideBar = document.getElementById('sideBar');
    sideBar.classList.add("active");
    console.log(perUserPosts);
}

/**
 * Функция для отображения постов пользователя
 * @param posts  - данные о пользователях
 */
function displayUsersPosts(posts) {
    posts.forEach(post => {
        postsPerUser.innerHTML += `
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
            </div>
        `;
    });
}

// Скрытие боковой панели
closeSideBar.addEventListener('click', event => {
    sideBar.classList.remove("active");
    postsPerUser.innerHTML = '';
});

// Инициализация отображения на первой странице
displayUsersPerPage(currentPageTable);
