//NOTICE: form => input data => create new todo => {id, createdAt, title, isCompleted}
//NOTICE: const todos => todos.push(todo)

//Variables
// let todos = [];
let filterValue = "all";

const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todolist");
const selectFilter = document.querySelector(".filter-todos");

//get all localstorages each time loading the page
document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  addTodosToDOM(todos);
});

//Create Todo(s)
todoForm.addEventListener("submit", addNewTodo);

function addNewTodo(event) {
  event.preventDefault();

  if (!todoInput.value) return null;

  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };
  // todos.push(newTodo);
  //   console.log(todos);
  saveAllTodos(newTodo);
  FilterTodos();
}

//Add todos to the DOM
function addTodosToDOM(todos) {
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
      <p class="todo__title ${todo.isCompleted && "completed"}">${
      todo.title
    }</p>
      <span class="todo__createdAt ${
        todo.isCompleted && "completed"
      }">${new Date(todo.createdAt).toLocaleDateString("fa-IR")}</span>
      <button class="todo__check" data-todo-id = ${
        todo.id
      }><i class="far fa-check-square"></i></button>
      <button class = "todo__remove" data-todo-id = ${
        todo.id
      }><i class="far fa-trash-alt"></i></button>
    </li>`;
  });
  todoList.innerHTML = result;
  todoInput.value = "";

  //Remove Todo
  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((removeBtn) =>
    removeBtn.addEventListener("click", removeTodo)
  );

  const checkBtns = document.querySelectorAll(".todo__check");
  checkBtns.forEach((checkBtn) =>
    checkBtn.addEventListener("click", checkTodos)
  );
}

//Filter Todos
selectFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  FilterTodos();
});

function FilterTodos() {
  const filter = filterValue;
  // console.log(filter);
  const todos = getAllTodos();
  switch (filter) {
    case "all": {
      addTodosToDOM(todos);
      break;
    }
    case "completed": {
      const selectedFilter = todos.filter((todo) => todo.isCompleted);
      addTodosToDOM(selectedFilter);
      break;
    }
    case "uncompleted": {
      const selectedFilter = todos.filter((todo) => !todo.isCompleted);
      addTodosToDOM(selectedFilter);
      break;
    }
    default: {
      addTodosToDOM(todos);
    }
  }
}

//Remove Todos Function
function removeTodo(e) {
  let todos = getAllTodos();
  const todoDatasetId = Number(e.target.dataset.todoId);
  //filters the list and remove the selected todo via dataset Ids
  todos = todos.filter((todo) => todo.id !== todoDatasetId);

  //save to LocalStorage
  localStorage.setItem("todos", JSON.stringify(todos));
  //updates the DOM
  FilterTodos();
}

//Check(un) Todos Function
function checkTodos(e) {
  let todos = getAllTodos();
  const todoDatasetId = Number(e.target.dataset.todoId);
  const todo = todos.find((todo) => todo.id === todoDatasetId);
  todo.isCompleted = !todo.isCompleted;

  //save to LocalStorage
  localStorage.setItem("todos", JSON.stringify(todos));
  //updates the DOM
  FilterTodos();
}

// LocalStorage => Web API
function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveAllTodos(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}
