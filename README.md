# blazor_menu

- The menu is rendered statically on the server so that its state is handled on the client avoiding network overhead;
- Submenus opend when hovered over and closed when no longer in focus;
- Menu renders depending on whether text is "Right to left" or "Left to right" (for demonstration purposes this is dependent on a "dir" attribute applied to the "body" tag);
- Events can be added to a menu without submenu through a function that accepts a menu's text.

