const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let pageTodos = [];
const List = document.getElementById("List");
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
    "<button class='complete' onclick='completeToDo(" +
      TodosItem.id +
      ")'>V</button>"
  );
  newLi.insertAdjacentHTML(
    "afterbegin",
    "<button class='delete' onclick='deleteToDo(" +
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
      console.log("finded: "+ i +" "+ id);
      result = i;
    }
  });
  return result;
}


function addToDo(Todo) {
  h = stripHtml(Todo);
  console.log(h)
  let localTodos = JSON.parse(localStorage.getItem("todo")) ?? [];
  console.log(localTodos[localTodos.length - 1], localTodos);
  const id = localTodos[localTodos.length - 1] ? localTodos[localTodos.length - 1].id + 1 : 1;
  localTodos.push({ id: id, title: h, checked: false });
  localStorage.setItem("todo", JSON.stringify(localTodos));
  const totalPages = Math.ceil((Todos.length+1) / ITEMS_PER_PAGE);
  renderPage(totalPages);
}
const addbutton = document.getElementById("submitbutton");
addbutton.addEventListener("click", onSubmit);
const Form = document.getElementById("name");
Form.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && Form.value != "") {
    onSubmit(event);
  }
})

function onSubmit(event) {
  event.preventDefault();
  if (Form.value != "") {
  let body = Form.value;
  addToDo(body);
  Form.value = ""; 
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

let buttchecker = true;
const ButtCheck = document.getElementById("check-all");
ButtCheck.addEventListener("click", checkAll);

function checkAll() {
    Todos.forEach(function (TodoItem) {
      TodoItem.checked = buttchecker;
    });
    localStorage.setItem("todo", JSON.stringify(Todos));

    renderPage(currentPage);
    buttchecker = !buttchecker;
 
}

const ButtDel = document.getElementById("delete-all");
ButtDel.addEventListener("click", deleteAll);

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

const FilterCh = document.getElementById("filter-checked");
FilterCh.addEventListener("click", function () {
  // Todos = JSON.parse(localStorage.getItem("todo")) ?? [];
  filter = "checked";

  renderPage(1);
});

const FilterUch = document.getElementById("filter-unchecked");
FilterUch.addEventListener("click", function () {
  // Todos = JSON.parse(localStorage.getItem("todo")) ?? [];
  filter = "unchecked";

  renderPage(1);
});

const FilterCl = document.getElementById("filter-clear");
FilterCl.addEventListener("click", function () {
  filter = "";
  // Todos = JSON.parse(localStorage.getItem("todo")) ?? [];
  renderPage(1);
});

function stripHtml(html) {
  let tmp = document.createElement('DIV');
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

  List.innerHTML = pageTodos.map(createTodoHTML).join("");

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
