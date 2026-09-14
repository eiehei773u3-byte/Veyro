#pragma once

// Константы фиксированной ширины
using uint8_t = unsigned char;
using uint16_t = unsigned short;
using uint32_t = unsigned int;

// Перечисление стандартных цветов VGA
enum class Color : uint8_t {
    Black = 0,
    Blue = 1,
    Green = 2,
    Cyan = 3,
    Red = 4,
    Magenta = 5,
    Brown = 6,
    LightGray = 7,
    DarkGray = 8,
    LightBlue = 9,
    LightGreen = 10,
    LightCyan = 11,
    LightRed = 12,
    Pink = 13,
    Yellow = 14,
    White = 15
};

// Класс для управления текстовым терминалом
class Terminal {
private:
    static const int VGA_WIDTH = 80;
    static const int VGA_HEIGHT = 25;
    
    int cursor_row;
    int cursor_col;
    uint8_t current_color;
    volatile uint16_t* video_memory;

    // Закрытый конструктор (Singleton)
    Terminal();

    // Создание байта атрибута цвета (текст + фон)
    uint8_t make_color(Color fg, Color bg);
    
    // Создание 16-битного символа для видеопамяти (символ + цвет)
    uint16_t make_vga_entry(char c, uint8_t color);

public:
    // Получение единственного экземпляра терминала
    static Terminal& instance();

    // Очистить экран заданным цветом фона
    void clear(Color bg = Color::Black);

    // Изменить текущий цвет текста и фона для последующего вывода
    void set_color(Color fg, Color bg = Color::Black);

    // Вывод одиночного символа (с обработкой '\n')
    void put_char(char c);

    // Вывод строки
    void print(const char* str);

    // Вывод строки с автоматическим переходом на новую строку
    void print_line(const char* str);

    void backspace();
};
