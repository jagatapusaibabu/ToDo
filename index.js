
let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

saveTodoButton.onclick = function() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
};

function saveToLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value.trim();
    let prioritySelect = document.getElementById("prioritySelect");
    let priority = prioritySelect.value;

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    // Check for duplicate tasks
    let isDuplicate = todoList.some(todo => todo.text === userInputValue);
    if (isDuplicate) {
        alert("Task already exists!");
        return;
    }

    todosCount = todosCount + 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false,
        priority: priority
    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";

    saveToLocalStorage();
}

addTodoButton.onclick = function() {
    onAddTodo();
};

function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked");
    let todoObjectIndex = todoList.findIndex(function(eachtodo) {
        let eachTodoId = "todo" + eachtodo.uniqueNo;
        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });
    let todoObject = todoList[todoObjectIndex];
    if (todoObject.isChecked === true) {
        todoObject.isChecked = false;
    } else {
        todoObject.isChecked = true;
    }
    saveToLocalStorage();
}

function onDeleteTodo(todoId) {
    let confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        let todoElement = document.getElementById(todoId);
        todoItemsContainer.removeChild(todoElement);

        let deleteElementIndex = todoList.findIndex(function(eachTodo) {
            let eachTodoId = "todo" + eachTodo.uniqueNo;
            if (eachTodoId === todoId) {
                return true;
            } else {
                return false;
            }
        });

        todoList.splice(deleteElementIndex, 1);
        saveToLocalStorage();
    }
}

let clearAllButton = document.getElementById("clearAllButton");
clearAllButton.onclick = function() {
    todoList = [];
    todosCount = 0;
    todoItemsContainer.innerHTML = "";
    localStorage.removeItem("todoList");
};

function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;

    inputElement.onclick = function() {
        onTodoStatusChange(checkboxId, labelId, todoId);
    };

    inputElement.classList.add("checkbox-input");
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    if (todo.isChecked === true) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);
    labelElement.onclick = function() {
        enableEditMode(labelId, todoId);
    };

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };

    deleteIconContainer.appendChild(deleteIcon);
    let priorityElement = document.createElement("span");
    priorityElement.textContent = `Priority: ${todo.priority}`;
    priorityElement.classList.add("priority-label");
    labelContainer.appendChild(priorityElement);
}

for (let todo of todoList) {
    createAndAppendTodo(todo);
}

// Add to JavaScript
let showAllButton = document.getElementById("showAllButton");
let showCompletedButton = document.getElementById("showCompletedButton");
let showPendingButton = document.getElementById("showPendingButton");

showAllButton.onclick = function() {
    renderTodoList(todoList);
};

showCompletedButton.onclick = function() {
    let completedTasks = todoList.filter(todo => todo.isChecked);
    renderTodoList(completedTasks);
};

showPendingButton.onclick = function() {
    let pendingTasks = todoList.filter(todo => !todo.isChecked);
    renderTodoList(pendingTasks);
};

function renderTodoList(list) {
    todoItemsContainer.innerHTML = "";
    for (let todo of list) {
        createAndAppendTodo(todo);
    }
}

function enableEditMode(labelId, todoId) {
    let labelElement = document.getElementById(labelId);
    let currentText = labelElement.textContent;
    let inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = currentText;
    inputElement.classList.add("edit-input");

    // Replace label with input field
    labelElement.replaceWith(inputElement);
    inputElement.focus();

    // Save changes when input loses focus
    inputElement.addEventListener("blur", function() {
        let updatedText = inputElement.value.trim();
        if (updatedText !== "") {
            labelElement.textContent = updatedText;
            inputElement.replaceWith(labelElement);

            // Update the todoList array
            let todoObjectIndex = todoList.findIndex(function(eachtodo) {
                let eachTodoId = "todo" + eachtodo.uniqueNo;
                return eachTodoId === todoId;
            });

            todoList[todoObjectIndex].text = updatedText;
            saveToLocalStorage();
        }
    });
}
