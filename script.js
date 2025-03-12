const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let pageTodos = [];
const LIST = document.getElementById("List");
let Todos = JSON.parse(localStorage.getItem("todo")) ?? [];

let filter = "";
renderPage(1);
localStorage.setItem("todo", JSON.stringify(Todos));

function createTodoHTML(TodosItem, key) {
  const newLi = document.createElement("div");

  if (TodosItem.checked) {
    newLi.innerHTML = "<s>" + TodosItem.title + "</s>";
  } else {
    newLi.innerHTML = TodosItem.title;
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
    if (item.id == id) {
      console.log("finded: " + i + " " + id);
      result = i;
    }
  });
  return result;
}

function addToDo(Todo) {
  stringTodo = stripHtml(Todo);
  let localTodos = JSON.parse(localStorage.getItem("todo")) ?? [];
  console.log(localTodos[localTodos.length - 1], localTodos);
  const id = localTodos[localTodos.length - 1]
    ? localTodos[localTodos.length - 1].id + 1
    : 1;
  localTodos.push({ id: id, title: stringTodo, checked: false });
  localStorage.setItem("todo", JSON.stringify(localTodos));
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
    prompt("", Todos[findTodo(id)].title) ?? Todos[findTodo(id)].title;
  console.log(value);
  Todos[findTodo(id)].title = value;
  localStorage.setItem("todo", JSON.stringify(Todos));
  renderPage(currentPage);
}

const filterCh = document.getElementById("filter-checked");
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
  Todos = JSON.parse(localStorage.getItem("todo")) ?? [];
  currentPage = page;

  switch (filter) {
    case "checked":
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

  pageTodos = Todos.slice(startIndex, endIndex);

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

const  fetchData =  () =>{
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTIwMjQwOTVmMjQ3ZTM2YTcwZWUzN2U2OTVmZGIwYyIsIm5iZiI6MTc0MTczMzU5Mi4zMTEsInN1YiI6IjY3ZDBiZWQ4NjY4OTJiYWQ2MjgxNDYyZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3DWVrrXyOWpMOlwL0LmEvqHfN1bCi1vE7eHl6you5b8'
        }
      };
      
      fetch('https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1', options)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.error(err));
   
}
addButton.addEventListener("dbclick", fetchData);
