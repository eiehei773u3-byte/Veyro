#include "../../terminal/terminal.h"

void cmd_help() {
    auto& term = Terminal::instance();
    term.print_line("Available commands:");
    term.print_line("  help  - Show this message");
    term.print_line("  clear - Clear the screen");
    term.print_line("  hello - Print welcome message");
}
