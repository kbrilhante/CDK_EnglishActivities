function initialize() {
    const JSONDATA = "./data/activities.json";
    getData(JSONDATA).then((data) => {
        processData(data);
    });
}

async function getData(jsonFile) {
    const response = await fetch(jsonFile);
    const data = await response.json();
    return data;
}

function processData(data) {
    const container = document.getElementById("lstActivities");
    const listGroup = document.createElement("div");
    listGroup.className = "list-group";
    container.appendChild(listGroup);
    for (const info of data) {
        listGroup.appendChild(listItem(info));
    }
}

function listItem(info) {
    console.log(info)
    const link = document.createElement("a");
    link.href = info.url;
    link.target = "_blank";
    link.className = "list-group-item list-group-item-action";
    link.innerText = info.title;
    if (!info.completed) link.classList.add("disabled")
    return link;
}


initialize();