#include "../terminal/terminal.h"

void cmd_hello() {
    auto& term = Terminal::instance();
    term.set_color(Color::Pink, Color::Blue);
    term.print_line("Hello from Veyro OS subfolder /bin!");
    term.set_color(Color::White, Color::Blue);
}
