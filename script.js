const date = document.getElementById('date');
const time = document.getElementById('time');
const container = document.getElementById('container');
const monthName = document.getElementById('monthName');
const yearNumber = document.getElementById('yearNumber');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const add = document.querySelector('.add');
const taskForm = document.getElementById('taskForm');
const addTask = document.getElementById('addTask');
const cancel = document.getElementById('cancel');
let tasks = [];

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

let year = "";
let month = "";

next.addEventListener("click", nextMonth);
prev.addEventListener("click", prevMonth);
add.addEventListener("click", openForm);
addTask.addEventListener("click", function (event) {
    event.preventDefault();
    checkTask(event.target.value, document.getElementById("addTask").getAttribute('data-task-id'));
});
cancel.addEventListener("click", closeForm);

function markDaysWithTasks() {
    const allDays = document.querySelectorAll('.day');
    console.log("Tasks loaded:", tasks);
    allDays.forEach(day => {
        const dayNumber = day.textContent;
        const dateToCheck = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${dayNumber.padStart(2, '0')}`;
        console.log("Checking date:", dateToCheck);
        const hasTasks = tasks.some(task => {
            console.log("Task date for comparison:", task.date);
            return task.date === dateToCheck;
        });
        if (hasTasks) {
            day.classList.add('has-tasks');
        }
    });
}

    


function removeTask(id) {
    let dateOfTask = tasks.find(task => task.id === id);
    console.log(dateOfTask)
    let index = tasks.findIndex(obj => obj.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
    }
    displayTasks(dateOfTask.date);
}

function completedTask(id) {
    console.log(id);
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) {
        taskElement.classList.toggle('taskDone');
    }

    const elToUpdate = tasks.find(task => task.id === id);
    elToUpdate.completed = !elToUpdate.completed;
}

function displayTasks(tag) {
    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = ''; 

    const filteredDate = tasks.filter(function (element) {
        return element.date === tag
    })

    filteredDate.sort((a, b) => a.time.localeCompare(b.time));

    for (let i = 0; i < filteredDate.length; i++) {
        const taskElement = document.createElement('div');
        taskElement.className = "taskDisplay";
        taskElement.setAttribute("data-id", `${filteredDate[i].id}`);
        if (filteredDate[i].completed) taskElement.classList.add('taskDone');
        tasksContainer.appendChild(taskElement);

        const taskContent = document.createElement('div');
        taskContent.className = "taskContent";
        taskContent.textContent = `${filteredDate[i].date}, ${filteredDate[i].time}, Opis: ${filteredDate[i].taskDescr}`;
        taskElement.appendChild(taskContent);

        const toolbox = document.createElement('div');
        toolbox.className = "toolbox"
        taskElement.appendChild(toolbox);

        const edit = document.createElement('i');
        edit.className = "fa-solid fa-file-pen";
        edit.addEventListener('click', () => changeTask(`${filteredDate[i].id}`));
        toolbox.appendChild(edit);

        const check = document.createElement('i');
        check.className = "fa-solid fa-circle-check";
        check.addEventListener('click', () => completedTask(filteredDate[i].id));
        toolbox.appendChild(check);

        const trashIcon = document.createElement('i');
        trashIcon.className = "fa-solid fa-trash";
        trashIcon.addEventListener('click', () => removeTask(filteredDate[i].id));
        toolbox.appendChild(trashIcon);
    }
    markDaysWithTasks();
}

function checkTask(e, ID) {
    if (e === "Dodaj") {
        manageTask(false, null);
    } else if (e === "Zmień") {
        manageTask(true, ID);
    }
}

function updateDateTime() {
    const now = new Date();

    const dateFormatter = new Intl.DateTimeFormat('pl-PL', {dateStyle: 'full'});
    const timeFormatter = new Intl.DateTimeFormat('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    date.textContent = dateFormatter.format(now);
    time.textContent = `Godzina: ${timeFormatter.format(now)}`;
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}

function updateCalendar() {
    clearCalendar();
    showMonth();
    dayName();
    generateCalendar();
    markDaysWithTasks();
}

function clearCalendar() {
    container.innerHTML = "";
}

function showMonth() {
    const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    monthName.textContent = months[currentMonth];
    yearNumber.textContent = currentYear;
}

function generateCalendar() {
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let firstDay = new Date(currentYear, currentMonth).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
    let today = new Date();

    for (let i = 0; i < firstDay; i++) {
        let emptyCell = document.createElement('div');
        emptyCell.className = "day empty";
        container.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dayElement = document.createElement('div');
        dayElement.className = "day";
        if (`${year}:${month}:day` === tasks.date) {
            console.log("dupa")
        }
        dayElement.textContent = day;
        if (currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate()) {
            dayElement.classList.add("current-day");
        }
        dayElement.addEventListener('click', handleDayClick);
        container.appendChild(dayElement);
    }
}

function dayName() {
    const days = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];
    days.forEach(day => {
        let dayOfWeek = document.createElement('div');
        dayOfWeek.className = "weekDay";
        dayOfWeek.textContent = day;
        container.appendChild(dayOfWeek);
    });
}

function openForm() {
    taskForm.style.display = 'flex';
}

function changeTask(ID) {
    openForm();
    document.getElementById("nameForm").textContent = 'Zmień zadanie';
    document.getElementById("addTask").textContent = 'Zmień';
    document.getElementById("addTask").value = "Zmień";
    document.getElementById("addTask").setAttribute('data-task-id', ID);

    const getTask = tasks.find(function (element) {
        return element.id === ID
    });

    document.getElementById("dateTask").value = getTask.date;
    document.getElementById("timeTask").value = getTask.time;
    document.getElementById("content").value = getTask.taskDescr;
}

function closeForm(id) {
    taskForm.style.display = 'none';
}

function generateUniqueId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function handleDayClick(event) {
    let dayNumber = event.target.textContent;

    const clickedDate = new Date(currentYear, currentMonth, dayNumber)

    const dateFormatter = new Intl.DateTimeFormat('pl-PL', {day: 'numeric', month: 'numeric', year: 'numeric'});
    let formattedDate = dateFormatter.format(clickedDate);

    if (formattedDate.length < 10) {
        formattedDate = "0" + formattedDate
    }

    const newFormattedDate = formattedDate.replace(/\./g, "-");
    let reversedDate = newFormattedDate.split("-").reverse().join("-");

    displayTasks(reversedDate);
}

function manageTask(isEdit, ID) {
    let id;
    let dateValue = document.getElementById('dateTask').value;
    let timeValue = document.getElementById('timeTask').value;
    let taskContent = document.getElementById('content').value;

    if (isEdit) {
        id = ID;
        let newData = tasks.find(function (element) {
            return element.id === ID
        });

        newData.date = document.getElementById('dateTask').value;
        newData.time = document.getElementById('timeTask').value;
        newData.taskDescr = document.getElementById('content').value;


    } else {
        id = generateUniqueId();

        let newTask = {
            id,
            date: dateValue,
            time: timeValue,
            taskDescr: taskContent,
            completed: false
        };

        tasks.push(newTask)

    }

    document.getElementById('dateTask').value = '';
    document.getElementById('timeTask').value = '';
    document.getElementById('content').value = '';

    closeForm();
    displayTasks(dateValue);
}

setInterval(() => updateDateTime(), 1000);
updateDateTime();
updateCalendar();
