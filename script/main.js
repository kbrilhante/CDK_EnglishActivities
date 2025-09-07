function initialize() {
    controlButtons();
    mainContent();
    if (typeof startup === "function") startup();
}

function controlButtons() {
    const controlButtonsTag = document.getElementById("controlButtons");
    controlButtonsTag.hidden = false;
    const btnTheme = createButton(controlButtonsTag, ICON_LIGHT_THEME, () => {
        if (document.documentElement.getAttribute("data-bs-theme") === "dark") {
            document.documentElement.setAttribute("data-bs-theme", "light");
            btnTheme.innerHTML = ICON_DARK_THEME;
            btnTheme.title = "Change to dark mode";
        } else {
            document.documentElement.setAttribute("data-bs-theme", "dark");
            btnTheme.innerHTML = ICON_LIGHT_THEME;
            btnTheme.title = "Change to light mode";
        }
    });
    btnTheme.title = "Change to light mode";
}


