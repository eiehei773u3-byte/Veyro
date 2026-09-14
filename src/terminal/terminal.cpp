#include "terminal.h"

Terminal::Terminal() {
    cursor_row = 0;
    cursor_col = 0;
    video_memory = reinterpret_cast<volatile uint16_t*>(0xB8000);
    set_color(Color::White, Color::Black);
}

Terminal& Terminal::instance() {
    static Terminal local_instance;
    return local_instance;
}

uint8_t Terminal::make_color(Color fg, Color bg) {
    return static_cast<uint8_t>(fg) | (static_cast<uint8_t>(bg) << 4);
}

uint16_t Terminal::make_vga_entry(char c, uint8_t color) {
    return static_cast<uint16_t>(c) | (static_cast<uint16_t>(color) << 8);
}

void Terminal::set_color(Color fg, Color bg) {
    current_color = make_color(fg, bg);
}

void Terminal::clear(Color bg) {
    uint8_t clear_color = make_color(Color::White, bg);
    uint16_t blank = make_vga_entry(' ', clear_color);
    
    for (int i = 0; i < VGA_WIDTH * VGA_HEIGHT; ++i) {
        video_memory[i] = blank;
    }
    cursor_row = 0;
    cursor_col = 0;
}

void Terminal::put_char(char c) {
    // Обработка переноса строки
    if (c == '\n') {
        cursor_col = 0;
        cursor_row++;
    } else {
        int index = cursor_row * VGA_WIDTH + cursor_col;
        video_memory[index] = make_vga_entry(c, current_color);
        cursor_col++;
    }

    // Если дошли до края строки — переносим
    if (cursor_col >= VGA_WIDTH) {
        cursor_col = 0;
        cursor_row++;
    }

    // Если экран заполнился — сбрасываем наверх (для простоты пока без скроллинга)
    if (cursor_row >= VGA_HEIGHT) {
        clear();
    }
}

void Terminal::print(const char* str) {
    for (int i = 0; str[i] != '\0'; ++i) {
        put_char(str[i]);
    }
}

void Terminal::print_line(const char* str) {
    print(str);
    put_char('\n');
}


void Terminal::backspace() {
    // Если мы в самом начале строки
    if (cursor_col == 0) {
        // Если это не самая первая строка экрана, возвращаемся на предыдущую строку в конец
        if (cursor_row > 0) {
            cursor_row--;
            cursor_col = VGA_WIDTH - 1;
        } else {
            return; // Стирать нечего, мы в координатах (0,0)
        }
    } else {
        // Обычный сдвиг курсора влево на один символ
        cursor_col--;
    }

    // Находим индекс символа в видеопамяти
    int index = cursor_row * VGA_WIDTH + cursor_col;
    
    // Затираем его пробелом с текущим цветом фона
    video_memory[index] = make_vga_entry(' ', current_color);
}

