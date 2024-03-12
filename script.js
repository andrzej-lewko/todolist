const date = document.getElementById('date');
const time = document.getElementById('time');
const calendar = document.getElementById('calendar');
const monthName = document.getElementById('monthName');
const yearNumber = document.getElementById('yearNumber');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const now = new Date();
let currentMonth = now.getMonth();
const currentDay = now.getDate();
let count = 0;

let showCurrentMonth = "";
next.addEventListener("click", nextMonth);
prev.addEventListener("click", prevMonth);

function nextMonth() {
    currentMonth++; 
    showMonth();
}

function prevMonth() {
    currentMonth--;
    showMonth();
}

function updateDateTime(now) {
    const dateFormatter = new Intl.DateTimeFormat('pl-PL', {dateStyle: 'full'})
    const timeFormatter = new Intl.DateTimeFormat('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })

    date.textContent = `${dateFormatter.format(now)}`;
    time.textContent = `Godzina: ${timeFormatter.format(now)}`
}

function showMonth() {
    const months = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];

    showCurrentMonth = (months[currentMonth]);
    console.log(showCurrentMonth)
    monthName.textContent = showCurrentMonth;
}

setInterval(updateDateTime, 1000);
updateDateTime();
showMonth();



function generateCalendar() {
    const showDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const lastDay1 = showDate.getDate();
    let counter = 0;

    

    for (let i = 1; i <= lastDay1; i++) {
        let dayOfMonth = document.createElement('div');
        dayOfMonth.className = "day";
        dayOfMonth.innerText = i;
        container.appendChild(dayOfMonth);
        counter++;
        if (counter % 7 === 0 && i !== lastDay1) { // Dodaj <br> po każdych 7 dniach, ale nie na końcu miesiąca
            container.appendChild(document.createElement("br"));
        }
    }
}

function dayName() {
    let counter = 0;
    const days = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];
    days.forEach(day => {
        let dayOfWeek = document.createElement('div');
        dayOfWeek.className = "weekDay";
        dayOfWeek.innerText = day;
        container.appendChild(dayOfWeek);
        counter++;
        if(counter %7 === 0){
            container.appendChild(document.createElement("br"))
        }
        
    });
}

dayName();
generateCalendar();
