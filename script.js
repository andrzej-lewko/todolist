let users = JSON.parse(localStorage.getItem('user')) || [];

console.log("Current URL:", window.location.href);

if (window.location.href.includes('login.html')) {
    console.log("Login page detected");
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;
        
        const userIndex = checkCredentials(username);
        if (userIndex !== -1 && users[userIndex].pass === password) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('currentUser', username);
            console.log("Login successful, redirecting to index.html");
            window.location.href = 'index.html';
        } else {
            alert('Nieprawidłowe dane logowania');
        }
    });
} else if (window.location.href.includes('register.html')) {
    console.log("Register page detected");
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = registerForm.username.value;
        const password = registerForm.password.value;
        
        if (users.some(user => user.user === username)) {
            alert("Taka nazwa użytkownika już istnieje");
        } else {
            const registeredUser = { user: username, pass: password };
            users.push(registeredUser);
            localStorage.setItem('user', JSON.stringify(users));
            console.log("Registration successful, redirecting to login.html");
            window.location.href = 'login.html';
        }
    });
} else if (window.location.href.includes('index.html')) {
    if (localStorage.getItem('loggedIn')) {
        initializeApp();
    } else {
        console.log("User not logged in, redirecting to login.html");
        window.location.href = 'login.html';
    }
} else {
    if (!window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
        console.log("Redirecting to login.html");
        window.location.href = 'login.html';
    }
}

function checkCredentials(username) {
    return users.findIndex(user => user.user === username);
}


function initializeApp() {
    console.log("Initializing application");

    let alertDiv = document.getElementById('alert');
    if (!alertDiv) {
        console.error("Element alertDiv nie został znaleziony w DOM.");
        return;
    }

    const date = document.getElementById('date');
    const time = document.getElementById('time');
    const container = document.getElementById('container');
    const monthName = document.getElementById('monthName');
    const yearNumber = document.getElementById('yearNumber');
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const taskForm = document.getElementById('taskForm');
    const addTask = document.getElementById('addTask');
    const cancel = document.getElementById('cancel');
    const search = document.getElementById('search');
    const name = document.getElementById('name');
    const logoutButton = document.getElementById('logout');
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column');
    const leftBottom = document.querySelector('.bottom');
    const calendarDiv = document.querySelector('#toCalendar');
    const iconCalendar = document.createElement('i');
    const addButton = document.querySelector('.add-header');
    addButton.addEventListener('click', openForm);

    iconCalendar.classList.add('fa-regular', 'fa-calendar-days');
    iconCalendar.addEventListener('click', showCalendar);

    logoutButton.addEventListener('click', logout);

    const currentUser = localStorage.getItem('currentUser');
    let tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
    let searchedText = "";

    name.textContent = ` ${currentUser}`;

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    search.addEventListener('keyup', searchTask);
    next.addEventListener("click", nextMonth);
    prev.addEventListener("click", prevMonth);
    addTask.addEventListener("click", function (event) {
        event.preventDefault();
        checkTask(event.target.value, document.getElementById("addTask").getAttribute('data-task-id'));
    });
    cancel.addEventListener("click", closeForm);

    function showLeft() {
        const width = window.innerWidth;
        if (width <= 768) {
            rightColumn.classList.add('right');
            leftBottom.classList.add('leftDown');
            leftColumn.classList.add('left');
            alertDiv.style.display = 'flex';

            if (!calendarDiv.contains(iconCalendar)) {
                calendarDiv.appendChild(iconCalendar);
            }

            calendarDiv.style.display = 'block';
            iconCalendar.style.display = 'block';
            console.log('showLeft');
        }
    }

    function recoverRight() {
        const width = window.innerWidth;
        if (width > 768) {
            rightColumn.classList.remove('right');
            leftBottom.classList.remove('leftDown');
            leftColumn.classList.remove('left');

            if (calendarDiv.contains(iconCalendar)) {
                calendarDiv.removeChild(iconCalendar);
            }

            iconCalendar.style.display = 'none';
        } else {
            if (!leftColumn.classList.contains('left')) {
                iconCalendar.style.display = 'none';
            } else {
                iconCalendar.style.display = 'block';
            }
        }
    }

    function showCalendar() {
        leftColumn.classList.remove('left');
        leftBottom.classList.remove('leftDown');
        rightColumn.classList.remove('right');
        iconCalendar.style.display = 'none';
    }

    function logout() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    function searchTask(e) {
        searchedText = e.target.value;
        let results = tasks.filter(task => task.taskDescr.toLowerCase().includes(searchedText.toLowerCase()));
        if (searchedText) {
            displayTasks(results);
            alertDiv.style.display = 'block';
        }
    }

    function resumeDisplay(text) {
        let results = tasks.filter(task => task.taskDescr.toLowerCase().includes(searchedText.toLowerCase()));
        displayTasks(results);
    }

    function displayTasks(tag) {
        const tasksContainer = document.getElementById('tasksContainer');
        tasksContainer.innerHTML = '';
        let filteredTasks = [];

        if (typeof tag === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(tag)) {
            filteredTasks = tasks.filter(element => element.date === tag);
            filteredTasks.sort((a, b) => a.time.localeCompare(b.time));

            filteredTasks.forEach(task => appendTaskToContainer(task, tasksContainer));
        } else if (Array.isArray(tag)) {
            filteredTasks = tag;
            filteredTasks.sort((a, b) => {
                if (a.date === b.date) {
                    return a.time.localeCompare(b.time);
                } else {
                    return a.date.localeCompare(b.date);
                }
            });
            filteredTasks.forEach(task => appendTaskToContainer(task, tasksContainer));
        }

        if (alertDiv) {
            if (filteredTasks.length < 1) {
                tasksContainer.appendChild(alertDiv);
                alertDiv.style.display = "flex";
            } else {
                alertDiv.style.display = "none";
            }
        } else {
            console.error("Element alertDiv nie został znaleziony w DOM.");
        }
    }

    function appendTaskToContainer(task, container) {
        const taskElement = document.createElement('div');
        taskElement.className = "taskDisplay";
        taskElement.setAttribute("data-id", task.id);
        if (task.completed) taskElement.classList.add('taskDone');
        container.appendChild(taskElement);

        const taskContent = document.createElement('div');
        taskContent.className = "taskContent";
        taskContent.textContent = `${task.date}, ${task.time}, \u00A0\u00A0 ${task.taskDescr}`;
        taskElement.appendChild(taskContent);

        const toolbox = document.createElement('div');
        toolbox.className = "toolbox";
        taskElement.appendChild(toolbox);

        const edit = document.createElement('i');
        edit.className = "fa-solid fa-file-pen";
        edit.addEventListener('click', () => changeTask(task.id));
        toolbox.appendChild(edit);

        const check = document.createElement('i');
        check.className = "fa-solid fa-circle-check";
        check.addEventListener('click', () => completedTask(task.id));
        toolbox.appendChild(check);

        const trashIcon = document.createElement('i');
        trashIcon.className = "fa-solid fa-trash";
        trashIcon.addEventListener('click', () => removeTask(task.id));
        toolbox.appendChild(trashIcon);

        markDaysWithTasks();
    }

    function markDaysWithTasks() {
        const allDays = document.querySelectorAll('.day');
        allDays.forEach(day => {
            const dayNumber = day.textContent;
            const dateToCheck = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${dayNumber.padStart(2, '0')}`;

            const tasksForDay = tasks.filter(task => task.date === dateToCheck);
            if (tasksForDay.length > 0) {
                const allCompleted = tasksForDay.every(task => task.completed);
                const anyNotCompleted = tasksForDay.some(task => !task.completed);

                if (allCompleted) {
                    day.classList.remove('has-tasks');
                    day.classList.add('tasks-completed');
                } else if (anyNotCompleted) {
                    day.classList.add('has-tasks');
                }
            }
        });
    }

    function removeTask(id) {
        let index = tasks.findIndex(obj => obj.id === id);
        if (index !== -1) {
            tasks.splice(index, 1);
        }
        resumeDisplay(searchedText);
        updateCalendar();
    }

    function completedTask(id) {
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        if (taskElement) {
            taskElement.classList.toggle('taskDone');
        }

        const elToUpdate = tasks.find(task => task.id === id);
        elToUpdate.completed = !elToUpdate.completed;

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
        let dateFormatter;
        const width = window.innerWidth;

        if (width <= 768) {
            dateFormatter = new Intl.DateTimeFormat('pl-PL', { dateStyle: 'short' });
        } else {
            dateFormatter = new Intl.DateTimeFormat('pl-PL', { dateStyle: 'full' });
        }

        const timeFormatter = new Intl.DateTimeFormat('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        date.textContent = dateFormatter.format(now);

        if (width <= 768) {
            time.textContent = `${timeFormatter.format(now)}`;
        } else {
            time.textContent = `Godzina: ${timeFormatter.format(now)}`;
        }
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
        displayTasksForMonth();
    }

    function displayTasksForMonth() {
        const monthStart = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`;
        const monthEnd = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${new Date(currentYear, currentMonth + 1, 0).getDate()}`;

        let tasksForMonth = tasks.filter(task => task.date >= monthStart && task.date <= monthEnd);
        displayTasks(tasksForMonth);
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

        const getTask = tasks.find(element => element.id === ID);
        document.getElementById("dateTask").value = getTask.date;
        document.getElementById("timeTask").value = getTask.time;
        document.getElementById("content").value = getTask.taskDescr;
    }

    function closeForm() {
        taskForm.style.display = 'none';
        localStorage.setItem(currentUser, JSON.stringify(tasks));
    }

    function generateUniqueId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    function handleDayClick(event) {
        showLeft();
        let dayNumber = event.target.textContent;
        const clickedDate = new Date(currentYear, currentMonth, dayNumber);
        const dateFormatter = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'numeric', year: 'numeric' });
        let formattedDate = dateFormatter.format(clickedDate);

        if (formattedDate.length < 10) {
            formattedDate = "0" + formattedDate;
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

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

        const formDate = dateValue + " " + timeValue;

        if (formattedDateTime > formDate) {
            alert("Wybrana data lub godzina leżą w przeszłości!")
            return;
        }

        if (!dateValue || !timeValue || !taskContent) {
            alert("Wypełnij wszystkie pola!");
            return;
        }

        if (isEdit) {
            id = ID;
            let newData = tasks.find(element => element.id === ID);
            newData.date = dateValue;
            newData.time = timeValue;
            newData.taskDescr = taskContent;
            console.log("Updated Task:", newData);
        } else {
            id = generateUniqueId();
            let newTask = { id, date: dateValue, time: timeValue, taskDescr: taskContent, completed: false };
            tasks.push(newTask);
            console.log("New Task Added:", newTask);
        }

        localStorage.setItem(currentUser, JSON.stringify(tasks));
        console.log("Tasks saved to localStorage:", tasks);

        document.getElementById('dateTask').value = '';
        document.getElementById('timeTask').value = '';
        document.getElementById('content').value = '';

        closeForm();
        displayTasks(dateValue);
    }

    window.addEventListener('resize', recoverRight);
    window.addEventListener('load', recoverRight);

    setInterval(() => updateDateTime(), 1000);
    updateDateTime();
    updateCalendar();
}