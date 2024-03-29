const date = document.getElementById('date');
const time = document.getElementById('time');
const container = document.getElementById('container'); // Upewnij się, że masz taki element w HTML.
const monthName = document.getElementById('monthName');
const yearNumber = document.getElementById('yearNumber');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const add = document.querySelector('.add');
let tasks = [];

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

next.addEventListener("click", nextMonth);
prev.addEventListener("click", prevMonth);
add.addEventListener("click", openForm);

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



    for (let i = 0; i < firstDay; i++) {
        let emtpyCell = document.createElement('div');
        emtpyCell.className = "day empty";
        container.appendChild(emtpyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dayElement = document.createElement('div');
        dayElement.className = "day";
        dayElement.textContent = day;
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
    const form = document.createElement('form');
    console.log(form)
}

setInterval(() => updateDateTime(), 1000);
updateDateTime();
updateCalendar();
