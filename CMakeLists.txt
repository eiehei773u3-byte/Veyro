cmake_minimum_required(VERSION 3.15)

# --- НАСТРОЙКИ ПРОЕКТА ---
set(Veyro_NAME "Veyro")
set(Veyro_VERSION "1.0.0")

set(Veyro_WEIGHY 900)
set(Veyro_HEIGHT 600)

project(${Veyro_NAME} VERSION ${Veyro_VERSION} LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# --- ПОИСК БИБЛИОТЕК ---
find_package(SDL2 REQUIRED)
find_package(SDL2_image REQUIRED)
find_package(GLEW REQUIRED)
find_package(OpenGL REQUIRED)
find_package(X11 REQUIRED)

find_package(PkgConfig REQUIRED)
pkg_check_modules(WEBKIT REQUIRED IMPORTED_TARGET webkit2gtk-4.1)


# --- ИСПОЛНЯЕМЫЙ ФАЙЛ ---
add_executable(${Veyro_NAME}
  src/Core/Console/Console.cpp
  src/Core/Interface/Interface.cpp
  src/Core/Interface/WebView.cpp
  src/Core/Root.cpp
  src/Main.cpp
  src/Builder/Builder.cpp
)

# --- ПЕРЕДАЧА ПЕРЕМЕННЫХ В C++ ---
target_compile_definitions(${Veyro_NAME} PRIVATE
    VERSION="${Veyro_VERSION}"
    PROJECT_NAME="${Veyro_NAME}"
    PROJECT_WEIGHY=${Veyro_WEIGHY}
    PROJECT_HEIGHT=${Veyro_HEIGHT}
    WEB_ROOT_DIR="${CMAKE_CURRENT_SOURCE_DIR}/src/web"
)

# --- ПОДКЛЮЧЕНИЕ БИБЛИОТЕК ---
target_link_libraries(${Veyro_NAME} PRIVATE
    SDL2::SDL2
    SDL2_image::SDL2_image
    OpenGL::GL
)