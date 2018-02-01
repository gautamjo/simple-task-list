document.querySelector("body").style.background = "#F8F9F9";

//tooltips
$.extend(Tipped.Behaviors, {
    'custom-slow': {
        fadeIn: 300,
        fadeOut: 300
    }
});

$(document).ready(function() {
    Tipped.create(".card-title", "Create, Read, Update and Delete tasks with ease", {
        position: "leftbottom",
        skin: "light",
        behavior: "custom-slow",
        title: true,
        title: "MINI TASKER",
        shadow: true,
        size: "x-large",
        hideOn: {
            element: 'mouseleave',
            tooltip: 'mouseenter'
        }
    })
});

// define ui vars
const form = document.querySelector("#task-form");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

// load all event listener
loadEventListeners();

function loadEventListeners() {
    // DOM load event
    document.addEventListener("DOMContentLoaded", getTasks);
    // add task event
    form.addEventListener("submit", addTask);
    // remove task list
    taskList.addEventListener("click", removeTask);
    // clear tasks
    clearBtn.addEventListener("click", clearTasks);
    // filter tasks
    filter.addEventListener("keyup", filterTask);
}

// load tasks from local storage
function getTasks() {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    tasks.forEach(task => {
        // create li element
        const li = document.createElement("li");
        // add class name to li
        li.className = "collection-item";
        // create text node and append to li
        li.appendChild(document.createTextNode(task));
        // create new link element
        const link = document.createElement("a");
        // add class to a tag
        link.className = "delete-item secondary-content";
        // add icon html
        link.innerHTML = `<i class="fa fa-remove"></i>`;
        // append the link to the li
        li.appendChild(link);
        // append the li to the ul
        taskList.appendChild(li);
    })
}

// add task
function addTask(e) {
    if (taskInput.value === "") {
        swal("Add a task");
    }

    if (taskInput.value !== "") {
        // create li element
        const li = document.createElement("li");
        // add class name to li
        li.className = "collection-item";
        // create text node and append to li
        li.appendChild(document.createTextNode(taskInput.value));
        // create new link element
        const link = document.createElement("a");
        // add class to a tag
        link.className = "delete-item secondary-content";
        // add icon html
        link.innerHTML = `<i class="fa fa-remove"></i>`;
        // append the link to the li
        li.appendChild(link);
        // append the li to the ul
        taskList.appendChild(li);
        // store in local storage
        storeTaskInLocalStorage(taskInput.value);
        // clear the input
        taskInput.value = "";

        //console.log(`EVENT FIRED: ${e.type}`)
    }

    e.preventDefault();
}

// store task to local storage
function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// remove task
function removeTask(e) {

    if (e.target.parentElement.classList.contains("delete-item")) {
        //console.log("Yes, this is parent element");
        swal("Are you sure?", {
            dangerMode: true,
            buttons: {
                cancel: true,
                confrim: {
                    text: "Confirm",
                    value: "delete"
                }
            },
        }).then((value) => {
            if (value === "delete") {
                e.target.parentElement.parentElement.remove();
                // remove from local storage
                removeTaskFromLocalStorage(e.target.parentElement.parentElement);

            }
        });
    }
    //console.log(e.target);
}

// remove from local storage
function removeTaskFromLocalStorage(taskItem) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.forEach(function(task, index) {
        if (taskItem.textContent === task) {
            tasks.splice(index, 1)
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks))
}

// clear tasks
function clearTasks() {
    // method 1
    //taskList.innerHTML = "";

    // method 2
    if (taskList.firstChild) {
        swal("All tasks will be removed. Do you wish to proceed?", {
            dangerMode: true,
            buttons: {
                cancel: true,
                confrim: {
                    text: "Confirm",
                    value: "delete"
                }
            },
        }).then((value) => {
            if (value === "delete") {
                while (taskList.firstChild) {
                    taskList.removeChild(taskList.firstChild);
                }
                // clear from local storage
                clearTaskFromLocalStorage();
            }
        });
    }
}

// clear tasks from local storage
function clearTaskFromLocalStorage() {
    localStorage.clear();
}

// filter tasks
function filterTask(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll("li.collection-item").forEach(task => {
        const item = task.firstChild.textContent;
        if (item.toLowerCase().indexOf(text) !== -1) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
}