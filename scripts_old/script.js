const title = "English Activities";
const ICON_LIGHT_THEME = `<i class="fa-solid fa-sun"></i>`;
const ICON_DARK_THEME = `<i class="fa-solid fa-moon"></i>`;

function initialize() {
    document.title = title;
    document.getElementById("title").innerText = title;
    controlButtons();
    const JSONDATA = "./data/activities.json";
    getData(JSONDATA).then((data) => {
        processData(data);
    });
}

function controlButtons() {
    const controlButtonsTag = document.getElementById("controlButtons");
    controlButtonsTag.hidden = false;
    const btnTheme = document.createElement("button");
    btnTheme.innerHTML = ICON_LIGHT_THEME;
    btnTheme.onclick = () => {
        if (document.documentElement.getAttribute("data-bs-theme") === "dark") {
            document.documentElement.setAttribute("data-bs-theme", "light");
            btnTheme.innerHTML = ICON_DARK_THEME;
            btnTheme.title = "Change to dark mode";
        } else {
            document.documentElement.setAttribute("data-bs-theme", "dark");
            btnTheme.innerHTML = ICON_LIGHT_THEME;
            btnTheme.title = "Change to light mode";
        }
    }
    btnTheme.title = "Change to light mode";
    controlButtonsTag.appendChild(btnTheme);
}

async function getData(jsonFile) {
    const response = await fetch(jsonFile);
    const data = await response.json();
    return data;
}

function processData(data) {
    data.sort((a, b) => { return a.title.localeCompare(b.title) });
    const container = document.getElementById("lstActivities");
    const listGroup = document.createElement("div");
    listGroup.className = "list-group";
    container.appendChild(listGroup);
    for (const info of data) {
        listGroup.appendChild(listItem(info));
    }
}

function listItem(info) {
    const link = document.createElement("a");
    link.href = info.url;
    link.target = "_blank";
    link.className = "list-group-item list-group-item-action";
    let txt = info.title;
    if (info.beta) txt += '<small class="ms-4 text-muted">Beta</small>';
    if (!info.completed) {
        link.classList.add("disabled");
        // txt += '<small class="ms-4 text-muted">N/A</small>';
    }
    link.innerHTML = txt;
    return link;
}


initialize();