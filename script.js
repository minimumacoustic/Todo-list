// TODO: обернуть все в функцию
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let pageTodos = [];
const LIST = document.getElementById("List");
let Todos = JSON.parse(localStorage.getItem("todo")) ?? []; // TODO: вынести в отдельную функцию

let filter = ""; // TODO: поменять название
renderPage(1);
localStorage.setItem("todo", JSON.stringify(Todos)); // TODO: убрать

function createTodoHTML(TodosItem, key) {
    const newLi = document.createElement("div"); // TODO: поменять на <li>

    if (TodosItem.checked) {
        newLi.innerHTML = "<s>" + TodosItem.title + "</s>";
    } else {
        newLi.innerHTML = TodosItem.title; // использовать textContent
    }
    newLi.insertAdjacentHTML(
        "afterbegin",
        "<button class='complete' ondblclick='event.stopPropagation()' onclick='completeToDo(" +
        TodosItem.id +
        ")'>V</button>"
    );
    newLi.insertAdjacentHTML(
        "afterbegin",
        "<button class='delete' ondblclick='event.stopPropagation()' onclick='deleteToDo(" +
        TodosItem.id +
        ")'>x</button>"
    );
    return (
        '<div class="item" ondblclick="edit(' +
        TodosItem.id +
        ')">' +
        newLi.outerHTML +
        "</div>"
    );
}

function findTodo(id) {
    let result = null;

    Todos.forEach((item, i) => {
        console.log(i);
        if (item.id === id) {
            console.log("finded: " + i + " " + id);
            result = i;
        }
    });
    return result; // TODO: заменить на findIndex
}

function addToDo(Todo) {
    stringTodo = stripHtml(Todo);
    let localTodos = JSON.parse(localStorage.getItem("todo")) ?? [];
    console.log(localTodos[localTodos.length - 1], localTodos);
    const id = localTodos[localTodos.length - 1]
        ? localTodos[localTodos.length - 1].id + 1
        : 1; // TODO: переимновать
    localTodos.push({ id: id, title: stringTodo, checked: false });
    localStorage.setItem("todo", JSON.stringify(localTodos));  // TODO: вынести в отдельную функцию
    const totalPages = Math.ceil((Todos.length + 1) / ITEMS_PER_PAGE);
    renderPage(totalPages);
}
const addButton = document.getElementById("submitbutton");
addButton.addEventListener("click", onSubmit);
const form = document.getElementById("name");
form.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && form.value != "") {
        onSubmit(event);
    }
});

function onSubmit(event) {
    event.preventDefault();
    if (form.value != "") {
        let body = form.value;
        addToDo(body);
        form.value = "";
    }
}

function deleteToDo(id) {
    let localTodos = JSON.parse(localStorage.getItem("todo")) ?? [];

    localTodos.splice(findTodo(id), 1);
    localStorage.setItem("todo", JSON.stringify(localTodos));

    renderPage(currentPage);
    console.log(id, findTodo(id), Todos[findTodo(id)]);
}

function completeToDo(id) {
    Todos[findTodo(id)].checked = !Todos[findTodo(id)].checked;
    localStorage.setItem("todo", JSON.stringify(Todos));
    renderPage(currentPage);
}

let buttChecker = true;
const buttCheck = document.getElementById("check-all");
buttCheck.addEventListener("click", checkAll);

function checkAll() {
    Todos.forEach(function (TodoItem) {
        TodoItem.checked = buttChecker;
    });
    localStorage.setItem("todo", JSON.stringify(Todos));
    renderPage(currentPage);
    buttChecker = !buttChecker;
}

const buttDel = document.getElementById("delete-all");
buttDel.addEventListener("click", deleteAll);

function deleteAll() {
    if (Todos.length != 0) {
        let question = confirm("Уверен?");
        if (question) {
            Todos = [];
            localStorage.setItem("todo", JSON.stringify(Todos));
            renderPage(currentPage);
        }
    }
}
function edit(id) {
    let value =
        prompt("", Todos[findTodo(id)].title) ?? Todos[findTodo(id)].title; // TODO: доставать 1 раз
    console.log(value);
    Todos[findTodo(id)].title = value;
    localStorage.setItem("todo", JSON.stringify(Todos));
    renderPage(currentPage);
}

const filterCh = document.getElementById("filter-checked"); // TODO: переименовать
filterCh.addEventListener("click", function () {
    // Todos = JSON.parse(localStorage.getItem("todo")) ?? [];
    filter = "checked";

    renderPage(1);
});

const filterUch = document.getElementById("filter-unchecked");
filterUch.addEventListener("click", function () {
    // Todos = JSON.parse(localStorage.getItem("todo")) ?? [];
    filter = "unchecked";

    renderPage(1);
});

const filterCl = document.getElementById("filter-clear");
filterCl.addEventListener("click", function () {
    filter = "";
    // Todos = JSON.parse(localStorage.getItem("todo")) ?? [];
    renderPage(1);
});

function stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function renderPage(page) {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    Todos = JSON.parse(localStorage.getItem("todo")) ?? []; // TODO: убрать сайд эффект
    currentPage = page;

    switch (filter) {
        case "checked": // TODO: вынести фильтры в константы
            Todos = Todos.filter((todoItem) => {
                return todoItem.checked;
            });
            break;
        case "unchecked":
            Todos = Todos.filter((todoItem) => {
                return !todoItem.checked;
            });
            break;
    }

    pageTodos = Todos.slice(startIndex, endIndex); // TODO: убрать pageTodos, создать временную переменную внутри функции для хранения элементов, нужных для рендера

    LIST.innerHTML = pageTodos.map(createTodoHTML).join("");

    const totalPages = Math.ceil(Todos.length / ITEMS_PER_PAGE);
    pageInfo.textContent = `Page ${page} of ${totalPages}`;

    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = page === totalPages;
}

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
});

nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(Todos.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
    }
});
