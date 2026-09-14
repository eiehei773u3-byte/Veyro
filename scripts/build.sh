#!/bin/bash
set -e

# 1. Определяем базовые директории
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_DIR="$PROJECT_DIR/src"
BUILD_DIR="$PROJECT_DIR/build"
CONFIG_FILE="$SRC_DIR/sources.txt"

# Проверяем, существует ли файл конфигурации
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Ошибка: Файл конфигурации $CONFIG_FILE не найден!"
    exit 1
fi

echo "=== Сборка операционной системы Veyro ==="

# 2. Сборка низкоуровневого ASM загрузчика (он собирается всегда первым)
echo "[ASM] Сборка boot.asm..."
mkdir -p "$BUILD_DIR"
nasm -f elf32 "$SRC_DIR/boot.asm" -o "$BUILD_DIR/boot.o"

# Флаги компиляции C++23
FLAGS="-m32 -c -std=c++23 -ffreestanding -O2 -Wall -Wextra -fno-exceptions -fno-rtti -fno-pic -fno-pie -no-pie -fno-threadsafe-statics"

# Начинаем список объектов с ассемблерного файла
OBJECTS=("$BUILD_DIR/boot.o")

echo "[C++] Сборка файлов из конфигурации sources.txt..."

# 3. Чтение файлов из конфигурации, создание папок и компиляция
while read -r rel_path || [ -n "$rel_path" ]; do
    # Удаляем пробелы в начале/конце строки
    rel_path=$(echo "$rel_path" | xargs)
    
    # Игнорируем пустые строки и комментарии, начинающиеся с #
    if [[ -z "$rel_path" || "$rel_path" == \#* ]]; then
        continue
    fi

    cpp_file="$SRC_DIR/$rel_path"
    obj_file="$BUILD_DIR/${rel_path%.cpp}.o"
    
    # Автоматически создаем подпапку в build перед компиляцией файла
    obj_dir=$(dirname "$obj_file")
    mkdir -p "$obj_dir"

    echo "    Компиляция: src/$rel_path -> build/${rel_path%.cpp}.o"
    
    # Компилируем конкретный файл
    g++ $FLAGS "$cpp_file" -o "$obj_file"
    
    # Добавляем в список для линковщика
    OBJECTS+=("$obj_file")

done < "$CONFIG_FILE"

# 4. Линковка (автоматически склеивает только файлы из sources.txt + boot.o)
echo "[LD] Линковка ядра kernel.bin..."
ld -m elf_i386 -b elf32-i386 -T "$SRC_DIR/linker.ld" "${OBJECTS[@]}" -o "$BUILD_DIR/kernel.bin"

echo "=== Сборка успешно завершена! ==="
echo "=== Запуск Veyro OS в QEMU... ==="

# 5. Запуск в QEMU
qemu-system-x86_64 -kernel "$BUILD_DIR/kernel.bin"
