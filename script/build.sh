#!/usr/bin/env bash
LIB="../lib.txt"


echo "========================================"
echo "starting build process..."
echo "========================================"

#!/bin/bash



# Проверяем, существует ли файл
if [ ! -f "$LIB" ]; then
    echo "Файл lib.txt не найден в $LIB!"
    exit 1
fi

while IFS= read -r pkg || [ -n "$pkg" ]; do
    # Пропускаем пустые строки
    [[ -z "$pkg" ]] && continue
    
    # Проверяем статус пакета
    if dpkg -s "$pkg" &> /dev/null; then
        echo -e "\e[32m[Установлен]\e[0m $pkg"
    else
        echo -e "\e[31m[Не установлен]\e[0m $pkg"
    fi
done < "$LIB"
