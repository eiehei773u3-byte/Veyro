#pragma once
#include "io.h"

class Keyboard {
public:
    // Опрашивает клавиатуру. Возвращает 0, если клавиша не нажата, 
    // или ASCII символ, если нажата.
    static char get_char() {
        // Проверяем статус-порт клавиатуры (бит 0 должен быть равен 1, если есть данные)
        if ((inb(0x64) & 1) == 0) {
            return 0; 
        }

        unsigned char scancode = inb(0x60);
        
        // Обрабатываем только нажатия клавиш (скан-коды < 0x80)
        // Простейшая US Keymap (без Shift)
        static const char keymap[] = {
            0,  27, '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\b',
            '\t', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\n',
            0, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '`',
            0, '\\', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 0,
            '*', 0, ' '
        };

        if (scancode < sizeof(keymap)) {
            return keymap[scancode];
        }
        return 0;
    }
};
