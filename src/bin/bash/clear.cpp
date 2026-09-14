#include "../../terminal/terminal.h"

void cmd_clear() {
    auto& term = Terminal::instance();
    term.clear(Color::Black);
}