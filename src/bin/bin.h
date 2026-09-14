#pragma once

// Объявляем функции команд из соседних файлов
void cmd_help();
void cmd_hello();
void cmd_clear();

// Функция сравнения строк
inline bool string_compare(const char* str1, const char* str2) {
    int i = 0;
    while (str1[i] != '\0' && str2[i] != '\0') {
        if (str1[i] != str2[i]) return false;
        i++;
    }
    return str1[i] == str2[i];
}

// Диспетчер команд (наш простейший загрузчик из /bin)
inline void execute_command(const char* command) {
    auto& term = Terminal::instance();

    if (string_compare(command, "help")) {
        cmd_help();
    } else if (string_compare(command, "hello")) {
        cmd_hello();
    } else if (string_compare(command, "clear")) {
        cmd_clear();
    } else if (string_compare(command, "")) {
        // Если просто нажали Enter, ничего не делаем
    } else {
        term.set_color(Color::LightRed);
        term.print("Veyro Shell: /bin/");
        term.print(command);
        term.print_line(" not found.");
        term.set_color(Color::White);
    }
}
