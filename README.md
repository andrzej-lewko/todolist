# ToDoList - Aplikacja do Zarządzania Zadaniami

ToDoList to aplikacja webowa do zarządzania zadaniami, napisana przy użyciu technologii frontendowych: **HTML**, **CSS** i **JavaScript**. Aplikacja działa w pełni po stronie klienta, bez użycia backendu, co oznacza, że wszystkie dane użytkowników są przechowywane w **LocalStorage** przeglądarki.

Celem projektu jest zaprezentowanie moich umiejętności w zakresie tworzenia aplikacji webowych. Aplikacja jest responsywna i dostosowana do urządzeń mobilnych, zapewniając wygodę użytkowania na małych ekranach.

## Technologie

- **HTML5** - Struktura strony.
- **CSS3** - Stylowanie elementów oraz responsywność.
- **JavaScript (ES6)** - Logika aplikacji oraz zarządzanie danymi użytkownika w LocalStorage.

## Funkcje

1. **Rejestracja i logowanie**: Użytkownik może założyć konto oraz zalogować się przy użyciu lokalnie przechowywanych danych.
2. **Zarządzanie zadaniami**: Użytkownik może dodawać, edytować, usuwać zadania oraz oznaczać je jako ukończone.
3. **Widok kalendarza**: Zadania są przypisywane do konkretnych dni i godzin, a kalendarz wyświetla dni z przypisanymi zadaniami.
4. **Wyszukiwanie zadań**: Użytkownik może przeszukiwać zadania po wprowadzeniu tekstu.
5. **Responsywność**: Aplikacja działa zarówno na komputerach, jak i urządzeniach mobilnych, dostosowując układ do rozmiaru ekranu.

## Struktura projektu

### Pliki:

- `index.html` - Strona główna z widokiem kalendarza oraz listą zadań.
- `login.html` - Strona logowania.
- `register.html` - Strona rejestracji użytkownika.
- `styles.css` - Stylowanie interfejsu strony głównej i kalendarza.
- `style2.css` - Stylowanie stron logowania i rejestracji.
- `script.js` - Logika aplikacji: zarządzanie danymi użytkownika, zadaniami oraz interfejs użytkownika.

## Szczegóły techniczne

### Przechowywanie danych:
Należy zauważyć, że w obecnej postaci aplikacja nie jest w pełni funkcjonalna, ponieważ dane użytkowników i zadania są przechowywane w localStorage przeglądarki. Oznacza to, że:

Usunięcie danych z localStorage może prowadzić do utraty wszystkich zapisanych zadań. Użytkownik nie ma możliwości ich odzyskania po wyczyszczeniu pamięci lokalnej przeglądarki.
Aplikacja nie posiada mechanizmu backupu ani eksportu danych.

### Responsywność:
- Na mniejszych ekranach aplikacja automatycznie ukrywa niektóre elementy, takie jak kalendarz, na rzecz wyświetlania listy zadań, co ułatwia korzystanie na urządzeniach mobilnych.
- W momencie, gdy użytkownik wprowadza tekst w polu wyszukiwania, panel z wynikami jest odpowiednio dostosowywany do rozmiaru ekranu.

## Instrukcja uruchomienia

1. Aplikację można uruchomić bezpośrednio (https://andrzej-lewko.github.io/todolist/index.html).
2. Alternatywnie, można sklonować repozytorium i uruchomić aplikację lokalnie:
   - Sklonuj repozytorium:
     ```bash
     git clone https://github.com/andrzej-lewko/todolist.git
     ```
   - Otwórz plik `index.html` w przeglądarce.

> **Uwaga**: Aplikacja działa całkowicie po stronie klienta i nie wymaga backendu ani serwera.

## Potencjalne ulepszenia

- Synchronizacja danych między urządzeniami (np. za pomocą backendu i bazy danych).
- Notyfikacje przypominające o nadchodzących zadaniach.
- Import i eksport danych zadań.


