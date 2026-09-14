bits 32                         ; Загрузчик QEMU передает управление в 32-битном режиме

; Константы для Multiboot
MULTIBOOT_MAGIC    equ 0x1BADB002
MULTIBOOT_FLAGS    equ 0x00000003  ; Выравнивание модулей + информация о памяти
MULTIBOOT_CHECKSUM equ -(MULTIBOOT_MAGIC + MULTIBOOT_FLAGS)

section .multiboot
align 4
    dd MULTIBOOT_MAGIC
    dd MULTIBOOT_FLAGS
    dd MULTIBOOT_CHECKSUM

section .text
global _start
extern kernel_main

_start:
    ; Отключаем прерывания на время настройки
    cli

    ; В реальном 64-битном ядре здесь настраиваются таблицы страниц (Paging) 
    ; и происходит переход в Long Mode. Но для первого теста и вывода 
    ; на экран мы можем сразу вызвать нашу C++ функцию.
    
    mov esp, stack_top         ; Настраиваем временный 32-битный стек
    call kernel_main           ; Вызываем C++

.hang:
    hlt
    jmp .hang

section .bss
align 16
stack_bottom:
    resb 16384
stack_top:
