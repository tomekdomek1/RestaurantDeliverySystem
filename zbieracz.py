import os

def zrzuc_caly_projekt(katalog_startowy, plik_wyjsciowy, ignorowane_foldery=None, ignorowane_rozszerzenia=None):
    # Foldery, których NIE chcemy przeszukiwać
    if ignorowane_foldery is None:
        ignorowane_foldery = {'.git', '__pycache__', 'venv', '.venv', 'env', 'node_modules', '.vscode', '.idea', 'build', 'dist'}
    
    # Rozszerzenia plików binarnych, których NIE da się sensownie zapisać jako tekst
    if ignorowane_rozszerzenia is None:
        ignorowane_rozszerzenia = {
            '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', 
            '.pdf', '.zip', '.tar', '.gz', '.7z', '.rar',
            '.mp3', '.mp4', '.wav', '.pyc', '.exe', '.dll', '.so', '.woff', '.woff2', '.ttf'
        }

    with open(plik_wyjsciowy, 'w', encoding='utf-8') as f_out:
        nazwa_glownego_folderu = os.path.basename(os.path.abspath(katalog_startowy))
        
        # --- CZĘŚĆ 1: GENEROWANIE STRUKTURY DRZEWA ---
        f_out.write(f"STRUKTURA PROJEKTU: {nazwa_glownego_folderu}\n")
        f_out.write("=" * 80 + "\n")
        
        for root, dirs, files in os.walk(katalog_startowy):
            dirs[:] = [d for d in dirs if d not in ignorowane_foldery and not d.startswith('.')]
            rel_path = os.path.relpath(root, katalog_startowy)
            level = os.path.normpath(rel_path).count(os.sep) if rel_path != '.' else 0
            if rel_path == '.':
                f_out.write(f"[{nazwa_glownego_folderu}/]\n")
            else:
                f_out.write(f"{'    ' * level}[{os.path.basename(root)}/]\n")
            
            for file in files:
                if file.startswith('.') or file == plik_wyjsciowy:
                    continue
                _, ext = os.path.splitext(file)
                if ext.lower() in ignorowane_rozszerzenia:
                    continue
                f_out.write(f"{'    ' * (level + 1)}- {file}\n")
        
        f_out.write("\n" + "#" * 80 + "\n")
        f_out.write("### ZAWARTOŚĆ PLIKÓW ###\n")
        f_out.write("#" * 80 + "\n\n")

        # --- CZĘŚĆ 2: PRZEPISYWANIE ZAWARTOŚCI PLIKÓW ---
        for root, dirs, files in os.walk(katalog_startowy):
            dirs[:] = [d for d in dirs if d not in ignorowane_foldery and not d.startswith('.')]
            
            for file in files:
                # Pomijamy pliki ukryte oraz sam plik wynikowy
                if file.startswith('.') or file == plik_wyjsciowy:
                    continue
                
                _, ext = os.path.splitext(file)
                if ext.lower() in ignorowane_rozszerzenia:
                    continue
                
                sciezka_pelna = os.path.join(root, file)
                sciezka_relatywna = os.path.relpath(sciezka_pelna, katalog_startowy)
                
                # Nagłówek informujący, jaki to plik
                f_out.write(f"{'=' * 80}\n")
                f_out.write(f"PLIK: {sciezka_relatywna}\n")
                f_out.write(f"{'=' * 80}\n\n")
                
                # Próba bezpiecznego odczytania zawartości pliku
                try:
                    # errors='replace' zabezpiecza przed wywaleniem skryptu na dziwnych znakach
                    with open(sciezka_pelna, 'r', encoding='utf-8', errors='replace') as f_in:
                        f_out.write(f_in.read())
                except Exception as e:
                    f_out.write(f"[BŁĄD: Nie można odczytać zawartości pliku. Szczegóły: {e}]\n")
                
                f_out.write("\n\n") # Odstęp po zawartości pliku

if __name__ == '__main__':
    KIERUNEK = '.'                              # Obecny folder
    PLIK_WYNIKOWY = 'pelny_kod_projektu.txt'     # Nazwa pliku końcowego
    
    print("Rozpoczynam analizę struktury i przepisywanie zawartości...")
    zrzuc_caly_projekt(KIERUNEK, PLIK_WYNIKOWY)
    print(f"Sukces! Wszystko zostało zapisane w pliku: {PLIK_WYNIKOWY}")