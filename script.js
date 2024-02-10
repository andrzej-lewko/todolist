const date = document.getElementById('date');
const time = document.getElementById('time');

function updateDateTime() {
    const now = new Date();
    
    const dateFormatter = new Intl.DateTimeFormat('pl-PL', {dateStyle: 'full'})
    const timeFormatter = new Intl.DateTimeFormat('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })

    date.textContent = `${dateFormatter.format(now)}`;
    time.textContent = `Godzina: ${timeFormatter.format(now)}`
}

setInterval(updateDateTime, 1000);
updateDateTime();