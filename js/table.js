let pageTableNumber = document.querySelector('.number-page-table');
let postsPerUser = document.querySelector('.user-posts');
let arrowNext = document.querySelector('.arrow-next');
let arrowPrev = document.querySelector('.arrow-prev');
let closeSideBar = document.querySelector('.button_close_sideBar');
const urlUser = 'https://dummyjson.com/users';
let limitRows = 20;
let skipRows = 0;
let usersData = []; // данные о пользователях
let userPosts = []; // данные о пользователях
let currentPageTable = 1;
let totalUsers;
let totalPagesTable;


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

// Функция для отображения пользователей на каждой странице
async function displayUsersPerPage(page) {
    currentPageTable = page;
    const usersPerData = await getUsersData();
    displayUsersRows(usersPerData);
    totalPagesTable = Math.ceil(totalUsers / limitRows);
};

arrowNext.addEventListener('click', event => {
    if (currentPageTable < totalPagesTable) {
        currentPageTable++;
        pageTableNumber.innerText = (currentPageTable);
        skipRows += limitRows;
        displayUsersPerPage(currentPageTable);
    }
});

arrowPrev.addEventListener('click', event => {
    if (currentPageTable > 1) {
        currentPage--;
        pageTableNumber.innerText = (currentPageTable);
        skipRows -= limitRows;
        displayUsersPerPage(currentPageTable);
    }
});

const sort = (field) => displayUsersRows(parametrsSort[field]());

const parametrsSort = {
    'id': function () { return usersData?.sort((a, b) => a.id - b.id) },
    'username': function () { return usersData?.sort((a, b) => a.username.localeCompare(b.username)) },
    'email': function () { return usersData?.sort((a, b) => a.email.localeCompare(b.email)) },
    'fullName': function () { return usersData?.sort((a, b) => a.lastName.localeCompare(b.lastName)) },
    'birthDate': function () { return usersData?.sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate)) },
    'height': function () { return usersData?.sort((a, b) => a.height - b.height) },
    'ip': function () { return usersData?.sort((a, b) => parseFloat(a.ip) - parseFloat(b.ip)) },
}

async function getUserPosts(id) {
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

async function showSideBar(id) {
    const perUserPosts = await getUserPosts(id);
    displayUsersPosts(perUserPosts);
    const sideBar = document.getElementById('sideBar');
    sideBar.classList.add("active");
    console.log(perUserPosts);
}

function displayUsersPosts(posts) {
    postsPerUser.innerHTML = '';
    posts.forEach(post => {
        postsPerUser.innerHTML += `
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
            </div>
        `;
    });
}

closeSideBar.addEventListener('click', event => {
    sideBar.classList.remove("active");
});

// Инициализация отображения на первой странице
displayUsersPerPage(currentPageTable);
