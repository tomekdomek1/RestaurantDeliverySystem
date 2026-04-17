# Projekt zespołowy

### Instalacja i uruchomienie (monorepo)
Projekt został skonfigurowany tak, aby całą aplikację można było uruchomić z poziomu katalogu głównego.

1.  **Klonowanie repozytorium i przejście do folderu głównego:**
    ```powershell
    git clone https://github.com/tomekdomek1/RestaurantDeliverySystem.git
    cd RestaurantDeliverySystem
    ```

2.  **Instalacja narzędzi pomocniczych:**
    ```bash
    npm install
    ```

3.  **Konfiguracja projektów:**
    Zainstaluje zależności dla Reacta oraz przywróci pakiety NuGet dla .NET.
    ```bash
    npm run setup
    ```

4.  **Uruchomienie aplikacji:**
    Uruchamia jednocześnie serwer API oraz Frontend.
    ```bash
    npm start
    ```

---

## Główne funkcjonalności

### Panel Klienta:
* Rejestracja/logowanie,
* przeglądanie menu,
* koszyk i składanie zamówienia
* historia zamówień,
* powiadomienia (np. o zmianie statusu).
* Systemy ocen i recenzji.
### Panel Restauracji:
* Zarządzanie menu (dodawanie/edycja dań),
* obsługa zamówień (przyjmowanie/odrzucanie),
* powiadomienia o nowych zamówieniach.
* Generowanie raportów z danego okresu
### Panel Dostawcy:
* Rejestracja,
* dostępność online/oƯline,
* przyjmowanie zleceń,
* przeglądanie szczegółów zamówienia,
* potwierdzenie odbioru i dostawy 


---

## Tech Stack

- **Backend**: C#, ASP.NET Core 6, 
- **Frontend**: 
- **Baza danych**: 
- **Autoryzacja**: 
- **Płatności**: 
- **Logowanie**: 

---

## Konfiguracja BitBucket i utworzenie repozytorium
 Konfiguracja BitBucket i klonowanie repozytorium:
  1. git config --global user.name "Imie i nazwisko z polskimi znakami"
  2. git config --global user.email "MailUczelniany"
  3. cd C:\
  4. mkdir VSProjects 
  5. cd VSProjects
  6. mkdir PZ_UberEats
  7. cd PZ_UberEats
  7. git clone https://devtools.wi.pb.edu.pl/bitbucket/scm/mkub/pz_ubereats.git 
  8. Podajemy login typu: wi****** i hasło takie jakie ustawiliśmy
## Uruchomienie lokalne projektu
   ```bash
   cd C:\VSProjects\PZ_UberEats\pz_ubereats\UberEats\UberEats.WebApi\
   dotnet run
   Aplikacja będzie dostępna pod adresem: "http://localhost:5122/swagger",

