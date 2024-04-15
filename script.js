const date = document.getElementById('date');
const time = document.getElementById('time');
const container = document.getElementById('container'); // Upewnij się, że masz taki element w HTML.
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

next.addEventListener("click", nextMonth);
prev.addEventListener("click", prevMonth);
add.addEventListener("click", openForm);
addTask.addEventListener("click", function (event) {
    event.preventDefault();
    createTask()
});
cancel.addEventListener("click", closeForm);

function updateDateTime() {
    const now = new Date();
    
    const dateFormatter = new Intl.DateTimeFormat('pl-PL', { dateStyle: 'full' });
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
    firstDay = firstDay === 0 ? 6 : firstDay -1;
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
        if(currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate())
        {
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

function closeForm() {
    taskForm.style.display = 'none';
}

function generateUniqueId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function displayTasks(tag) {
    console.log(tag)
    console.log(tasks)
    const tasksContainer = document.getElementById('tasksContainer'); // Upewnij się, że taki element istnieje w HTML
    tasksContainer.innerHTML = ''; // Wyczyść aktualne zadania

    const filteredDate = tasks.filter(function(element) {
        return element.date === tag})
        console.log(filteredDate)

        filteredDate.sort((a, b) => a.time.localeCompare(b.time));

        console.log(filteredDate)

        for(let i = 0; i < filteredDate.length; i++) {
            const taskElement = document.createElement('div'); // Utwórz element <p> dla każdego zadania
            taskElement.className = "taskDisplay"
            tasksContainer.appendChild(taskElement); // Dodaj element <p> do kontenera

            const taskContent = document.createElement('div');
            taskContent.className = "taskContent";
            taskContent.textContent = `ID: ${filteredDate[i].time}, Opis: ${filteredDate[i].date}`;
            taskElement.appendChild(taskContent);

            const toolbox = document.createElement('div');
            toolbox.className = "toolbox"
            taskElement.appendChild(toolbox);

            const edit = document.createElement('i');
            edit.className = "fa-solid fa-file-pen";
            toolbox.appendChild(edit);

            const check = document.createElement('i');
            check.className = "fa-solid fa-circle-check";
            toolbox.appendChild(check);

            const trashIcon = document.createElement('i');
            trashIcon.className = "fa-solid fa-trash";
            toolbox.appendChild(trashIcon);


        }
        
    };

function handleDayClick(event) {
    let dayNumber = event.target.textContent;

    const clickedDate = new Date(currentYear, currentMonth, dayNumber)

    const dateFormatter = new Intl.DateTimeFormat('pl-PL', {day: 'numeric', month: 'numeric', year: 'numeric'});
    let formattedDate = dateFormatter.format(clickedDate);

    if(formattedDate.length < 10) {
        formattedDate = "0" + formattedDate
    }
    
    const newFormattedDate = formattedDate.replace(/\./g, "-");
    let reverseDate = newFormattedDate.split("-").reverse().join("-");

    displayTasks(reverseDate);
}

function createTask() {
    let id = generateUniqueId();
    let dateValue = document.getElementById('dateTask').value;
    let timeValue = document.getElementById('timeTask').value;
    let taskContent = document.getElementById('content').value;
    
    let newTask  = {
        id : id, 
        date: dateValue, 
        time : timeValue, 
        taskDescr : taskContent
    };
    
    tasks.push(newTask)


    document.getElementById('dateTask').value = '';
    document.getElementById('timeTask').value = '';
    document.getElementById('content').value = '';
    
    closeForm();

    
}




setInterval(() => updateDateTime(), 1000);
updateDateTime();
updateCalendar();
