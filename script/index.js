function mainContent() {
    document.title = TITLE_INDEX;
    document.getElementById("title").innerText = TITLE_INDEX;
    loadJson(JSONDATA).then(processData);
}

function processData(data) {
    data.sort((a, b) => { return a.title.localeCompare(b.title) });
    const contentTag = document.getElementById("main");
    const listGroup = createDiv(contentTag);
    listGroup.className = "list-group my-4";
    for (let website of data) {
        createListItem(listGroup, website);
    }
}

function createListItem(parent, data) {
    let txt = data.title;
    if (data.beta) txt += `<small class="ms-4 text-muted">Beta</small>`;
    const link = createLink(parent, data.url, txt);
    link.className = "list-group-item list-group-item-action";
    if (!data.completed) link.classList.add("disabled");
}