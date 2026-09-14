ENTRY(_start)

SECTIONS
{
    /* Адрес загрузки по стандарту Multiboot */
    . = 0x100000;

    .text : ALIGN(4K) {
        *(.multiboot)    /* Сначала идет заголовок Multiboot */
        *(.text)
    }

    .rodata : ALIGN(4K) {
        *(.rodata*)
    }

    .data : ALIGN(4K) {
        *(.data)
    }

    .bss : ALIGN(4K) {
        *(COMMON)
        *(.bss)
    }
}
