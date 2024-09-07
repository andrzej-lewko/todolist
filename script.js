let users = JSON.parse(localStorage.getItem('user')) || []; // Pobranie listy użytkowników z localStorage

console.log("Current URL:", window.location.href);

// Sekcja odpowiedzialna za logowanie użytkownika
if (window.location.href.includes('login.html')) {
    console.log("Login page detected");
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;
        
        const userIndex = checkCredentials(username); // Sprawdzenie danych logowania
        if (userIndex !== -1 && users[userIndex].pass === password) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('currentUser', username);
            console.log("Login successful, redirecting to index.html");
            window.location.href = 'index.html'; // Przekierowanie na stronę główną po zalogowaniu
        } else {
            alert('Nieprawidłowe dane logowania');
        }
    });
} else if (window.location.href.includes('register.html')) {
    // Sekcja odpowiedzialna za rejestrację użytkownika
    console.log("Register page detected");
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = registerForm.username.value;
        const password = registerForm.password.value;
        
        // Sprawdzenie, czy użytkownik o tej nazwie już istnieje
        if (users.some(user => user.user === username)) {
            alert("Taka nazwa użytkownika już istnieje");
        } else {
            const registeredUser = { user: username, pass: password };
            users.push(registeredUser);
            localStorage.setItem('user', JSON.stringify(users));
            console.log("Registration successful, redirecting to login.html");
            window.location.href = 'login.html'; // Przekierowanie na stronę logowania po rejestracji
        }
    });
} else if (window.location.href.includes('index.html')) {
    // Sekcja odpowiedzialna za sprawdzanie, czy użytkownik jest zalogowany
    if (localStorage.getItem('loggedIn')) {
        initializeApp(); // Inicjalizacja aplikacji
    } else {
        console.log("User not logged in, redirecting to login.html");
        window.location.href = 'login.html'; // Przekierowanie na stronę logowania, jeśli użytkownik nie jest zalogowany
    }
} else {
    // Domyślne przekierowanie na stronę logowania, jeśli strona nie jest stroną logowania lub rejestracji
    if (!window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
        console.log("Redirecting to login.html");
        window.location.href = 'login.html';
    }
}

// Funkcja sprawdzająca dane logowania użytkownika
function checkCredentials(username) {
    return users.findIndex(user => user.user === username); // Zwraca indeks użytkownika, jeśli istnieje, lub -1
}

// Inicjalizacja aplikacji
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
    const viewSwitch = document.getElementById('viewSwitch');
    const addButton = document.querySelector('.add-header');
    const width = window.innerWidth;

    let isInputFocused = false;  // Zmienna śledząca fokus w polu input

    search.addEventListener('focus', function () {
        if (width <= 768) {  // Sprawdzam, czy ekran jest mały
            isInputFocused = true;
        }
    });

    search.addEventListener('blur', function () {
    if (window.innerWidth <= 768) {
        isInputFocused = false;
    }
});

    

    addButton.addEventListener('click', openForm); // Otwieranie formularza dodawania zadania
    logoutButton.addEventListener('click', logout); // Wylogowywanie użytkownika

    const currentUser = localStorage.getItem('currentUser'); // Pobieranie aktualnie zalogowanego użytkownika
    let tasks = JSON.parse(localStorage.getItem(currentUser)) || []; // Pobieranie zadań zalogowanego użytkownika
    let searchedText = "";

    name.textContent = ` ${currentUser}`;

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    search.addEventListener('keyup', searchTask); // Funkcja wyszukiwania zadań
    

    next.addEventListener("click", nextMonth); // Przejście do następnego miesiąca
    prev.addEventListener("click", prevMonth); // Przejście do poprzedniego miesiąca
    addTask.addEventListener("click", function (event) {
        event.preventDefault();
        checkTask(event.target.value, document.getElementById("addTask").getAttribute('data-task-id')); // Dodanie lub zmiana zadania
    });
    cancel.addEventListener("click", closeForm); // Zamknięcie formularza dodawania/zadania

    // Funkcja wyświetlająca lewy panel na urządzeniach mobilnych
    function showLeft() {
    
        rightColumn.classList.add('right');
        leftBottom.classList.add('leftDown');
        leftColumn.classList.add('left');
        alertDiv.style.display = 'flex';
        calendarDiv.style.display = 'block';
        viewSwitch.style.display = 'block';
        viewSwitch.classList.remove('fa-solid', 'fa-list-check');
        viewSwitch.classList.add('fa-regular', 'fa-calendar-days');
        viewSwitch.addEventListener('click', showCalendar);
        
        console.log('showLeft');
    }

    // Funkcja przywracająca widok prawego panelu
    function recoverRight() {
        
        if (isInputFocused) {
            
            return;
        }

        rightColumn.classList.remove('right');
        leftBottom.classList.remove('leftDown');
        leftColumn.classList.remove('left');
        viewSwitch.classList.remove('fa-regular', 'fa-calendar-days');
        viewSwitch.classList.add('fa-solid', 'fa-list-check');
        viewSwitch.removeEventListener('click', showCalendar);
        viewSwitch.addEventListener('click', showLeft);
        
    }

    // Funkcja wyświetlająca kalendarz w prawym panelu
    function showCalendar() {
        leftColumn.classList.remove('left');
        leftBottom.classList.remove('leftDown');
        rightColumn.classList.remove('right');
        recoverRight();
    }

    // Funkcja wylogowująca użytkownika
    function logout() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html'; // Przekierowanie na stronę logowania
    }

    // Funkcja wyszukująca zadania
    function searchTask(e) {
        searchedText = e.target.value;
        let results = tasks.filter(task => task.taskDescr.toLowerCase().includes(searchedText.toLowerCase()));
        if (searchedText) {
            displayTasks(results);
            alertDiv.style.display = 'block';
        }
    }

    // Funkcja wyświetlająca wyniki wyszukiwania
    function resumeDisplay(text) {
        let results = tasks.filter(task => task.taskDescr.toLowerCase().includes(searchedText.toLowerCase()));
        displayTasks(results);
    }

    // Funkcja wyświetlająca zadania
    function displayTasks(tag) {
        const tasksContainer = document.getElementById('tasksContainer');
        tasksContainer.innerHTML = '';
        let filteredTasks = [];

        // Filtrowanie zadań według daty lub wyników wyszukiwania
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

        // Wyświetlanie informacji o braku zadań, jeśli lista jest pusta
        if (alertDiv) {
            if (filteredTasks.length < 1) {
                tasksContainer.appendChild(alertDiv);
                alertDiv.style.display = "flex";
            } else {
                alertDiv.style.display = "none";
            }
        } 
    }

    // Funkcja dodająca zadanie do kontenera
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
        edit.addEventListener('click', () => changeTask(task.id)); // Edytowanie zadania
        toolbox.appendChild(edit);

        const check = document.createElement('i');
        check.className = "fa-solid fa-circle-check";
        check.addEventListener('click', () => completedTask(task.id)); // Oznaczanie zadania jako wykonane
        toolbox.appendChild(check);

        const trashIcon = document.createElement('i');
        trashIcon.className = "fa-solid fa-trash";
        trashIcon.addEventListener('click', () => removeTask(task.id)); // Usuwanie zadania
        toolbox.appendChild(trashIcon);

        markDaysWithTasks(); // Oznaczanie dni z zadaniami
    }

    // Funkcja oznaczająca dni z zadaniami
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
                    day.classList.add('tasks-completed'); // Oznaczanie wszystkich zadań jako ukończonych
                } else if (anyNotCompleted) {
                    day.classList.add('has-tasks'); // Oznaczanie dnia, w którym są zadania do wykonania
                }
            }
        });
    }

    // Funkcja usuwająca zadanie
    function removeTask(id) {
        let index = tasks.findIndex(obj => obj.id === id);
        if (index !== -1) {
            tasks.splice(index, 1);
        }
        resumeDisplay(searchedText); // Wyświetlanie zadań po usunięciu
        updateCalendar();
    }

    // Funkcja oznaczająca zadanie jako ukończone
    function completedTask(id) {
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        if (taskElement) {
            taskElement.classList.toggle('taskDone');
        }

        const elToUpdate = tasks.find(task => task.id === id);
        elToUpdate.completed = !elToUpdate.completed;

        markDaysWithTasks(); // Oznaczanie dni z zadaniami po zmianie statusu
    }

    // Funkcja sprawdzająca, czy zadanie ma być dodane czy zmienione
    function checkTask(e, ID) {
        if (e === "Dodaj") {
            manageTask(false, null); // Dodawanie nowego zadania
        } else if (e === "Zmień") {
            manageTask(true, ID); // Zmiana istniejącego zadania
        }
    }

    // Funkcja aktualizująca datę i czas na stronie
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

    // Funkcja przechodzenia do następnego miesiąca
    function nextMonth() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar(); // Aktualizacja kalendarza po zmianie miesiąca
    }

    // Funkcja przechodzenia do poprzedniego miesiąca
    function prevMonth() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar(); // Aktualizacja kalendarza po zmianie miesiąca
    }

    // Funkcja aktualizująca kalendarz
    function updateCalendar() {
        clearCalendar();
        showMonth();
        dayName();
        generateCalendar();
        markDaysWithTasks(); // Oznaczanie dni z zadaniami
        displayTasksForMonth(); // Wyświetlanie zadań na dany miesiąc
    }

    // Funkcja wyświetlająca zadania na dany miesiąc
    function displayTasksForMonth() {
        const monthStart = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`;
        const monthEnd = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${new Date(currentYear, currentMonth + 1, 0).getDate()}`;

        let tasksForMonth = tasks.filter(task => task.date >= monthStart && task.date <= monthEnd);
        displayTasks(tasksForMonth); // Wyświetlanie zadań
    }

    // Funkcja czyszcząca kalendarz
    function clearCalendar() {
        container.innerHTML = "";
    }

    // Funkcja wyświetlająca nazwę miesiąca
    function showMonth() {
        const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
        monthName.textContent = months[currentMonth];
        yearNumber.textContent = currentYear;
    }

    // Funkcja generująca kalendarz
    function generateCalendar() {
        let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        let firstDay = new Date(currentYear, currentMonth).getDay();
        firstDay = firstDay === 0 ? 6 : firstDay - 1;
        let today = new Date();

        for (let i = 0; i < firstDay; i++) {
            let emptyCell = document.createElement('div');
            emptyCell.className = "day empty";
            container.appendChild(emptyCell); // Dodawanie pustych dni do kalendarza na początku miesiąca
        }

        for (let day = 1; day <= daysInMonth; day++) {
            let dayElement = document.createElement('div');
            dayElement.className = "day";
            dayElement.textContent = day;
            if (currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate()) {
                dayElement.classList.add("current-day"); // Oznaczanie bieżącego dnia
            }
            dayElement.addEventListener('click', handleDayClick); // Obsługa kliknięcia dnia w kalendarzu
            container.appendChild(dayElement);
        }
    }

    // Funkcja wyświetlająca dni tygodnia w kalendarzu
    function dayName() {
        const days = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];
        days.forEach(day => {
            let dayOfWeek = document.createElement('div');
            dayOfWeek.className = "weekDay";
            dayOfWeek.textContent = day;
            container.appendChild(dayOfWeek);
        });
    }

    // Funkcja otwierająca formularz dodawania zadania
    function openForm() {
        taskForm.style.display = 'flex';
    }

    // Funkcja zmieniająca zadanie
    function changeTask(ID) {
        openForm();
        document.getElementById("nameForm").textContent = 'Zmień zadanie';
        document.getElementById("addTask").textContent = 'Zmień';
        document.getElementById("addTask").value = "Zmień";
        document.getElementById("addTask").setAttribute('data-task-id', ID);

        const getTask = tasks.find(element => element.id === ID); // Znalezienie zadania do zmiany
        document.getElementById("dateTask").value = getTask.date;
        document.getElementById("timeTask").value = getTask.time;
        document.getElementById("content").value = getTask.taskDescr;
    }

    // Funkcja zamykająca formularz
    function closeForm() {
        document.getElementById("nameForm").textContent = 'Zaplanuj zadanie';
        document.getElementById("addTask").textContent = 'Dodaj';
        document.getElementById("addTask").value = "Dodaj";
        document.getElementById("addTask").removeAttribute('data-task-id');
        taskForm.style.display = 'none';
        localStorage.setItem(currentUser, JSON.stringify(tasks)); // Zapisanie zadań do localStorage po zamknięciu formularza
        
    }

    // Funkcja generująca unikalne ID dla zadania
    function generateUniqueId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // Funkcja obsługująca kliknięcie dnia w kalendarzu
    function handleDayClick(event) {
        if (width <= 768) {
            showLeft(); // Wyświetlanie lewego panelu na urządzeniach mobilnych
        }
        console.log(event);
        let dayNumber = event.target.textContent;
        const clickedDate = new Date(currentYear, currentMonth, dayNumber);
        const dateFormatter = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'numeric', year: 'numeric' });
        let formattedDate = dateFormatter.format(clickedDate);

        if (formattedDate.length < 10) {
            formattedDate = "0" + formattedDate;
        }

        const newFormattedDate = formattedDate.replace(/\./g, "-");
        let reversedDate = newFormattedDate.split("-").reverse().join("-");
        displayTasks(reversedDate); // Wyświetlanie zadań dla wybranego dnia
    }

    // Funkcja zarządzająca dodawaniem lub edycją zadania
    function manageTask(isEdit, ID) {
        let id;
        let dateValue = document.getElementById('dateTask').value;
        let timeValue = document.getElementById('timeTask').value;
        let taskContent = document.getElementById('content').value;

        console.log('data: ' + dateValue + ' time: ' + timeValue + ' task: ' + taskContent);

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

        const formDate = dateValue + " " + timeValue;

        if (formattedDateTime > formDate) {
            alert("Data lub godzina leżą w przeszłości!");
            return;
        }

        if (!dateValue || !timeValue || !taskContent) {
            alert("Wypełnij wszystkie pola!");
            return;
        }

        if (isEdit) {
            id = ID;
            let newData = tasks.find(element => element.id === ID); // Znalezienie zadania do edycji
            newData.date = dateValue;
            newData.time = timeValue;
            newData.taskDescr = taskContent;
            console.log("Updated Task:", newData);
        } else {
            id = generateUniqueId();
            let newTask = { id, date: dateValue, time: timeValue, taskDescr: taskContent, completed: false }; // Dodanie nowego zadania
            tasks.push(newTask);
            console.log("New Task Added:", newTask);
        }

        localStorage.setItem(currentUser, JSON.stringify(tasks)); // Zapisanie zadań do localStorage

        document.getElementById('dateTask').value = '';
        document.getElementById('timeTask').value = '';
        document.getElementById('content').value = '';

        closeForm(); // Zamknięcie formularza po dodaniu/edycji zadania
        displayTasks(dateValue); // Wyświetlenie zadań po dodaniu/edycji
    }

    window.addEventListener('resize', recoverRight); // Obsługa zmiany rozmiaru okna
    window.addEventListener('load', recoverRight); // Obsługa ładowania strony

    setInterval(() => updateDateTime(), 1000); // Aktualizacja daty i czasu co sekundę
    updateDateTime(); // Inicjalna aktualizacja daty i czasu
    updateCalendar(); // Inicjalna aktualizacja kalendarza
}
