#include "terminal/terminal.h"
#include "drivers/keyboard/keyboard.h"
#include "bin/bin.h"


extern "C" [[noreturn]] void kernel_main() {
    auto& term = Terminal::instance();
    term.clear(Color::Black);
    term.set_color(Color::Yellow);
    term.print_line("=== Veyro OS Interactive Shell ===");
    term.set_color(Color::White, Color::Black);
    term.print("root:/bin$ ");

    char command_buffer[64];
    int buffer_index = 0;

    while (true) {
        // Опрашиваем символ с клавиатуры
        char c = Keyboard::get_char();

        if (c > 0) { // Если клавиша нажата
            if (c == '\n') { // Отправка команды
                term.put_char('\n');
                command_buffer[buffer_index] = '\0'; // Закрываем строку
                
                // Выполняем команду
                execute_command(command_buffer);
                
                // Сбрасываем буфер и выводим новое приглашение
                buffer_index = 0;
                term.set_color(Color::White, Color::Black);
                term.print("root:/bin$ ");
            } 
            else if (c == '\b') { // Обработка Backspace
                if (buffer_index > 0) {
                    buffer_index--;            // Удаляем символ из буфера памяти
                    term.backspace();          // Стираем символ с экрана VGA
                }
            } 

            else { // Накопление символов в буфер команды
                if (buffer_index < 63) {
                    command_buffer[buffer_index++] = c;
                    term.put_char(c); // Отображаем вводимый символ на экране
                }
            }
        }

        // Небольшая задержка, чтобы эмулятор не грузил процессор на 100%
        for(volatile int i = 0; i < 10000; i++);
    }
}
