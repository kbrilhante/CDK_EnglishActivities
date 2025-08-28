const JSONDATA = "./data/40jf8Ikk - english-convo.json";
const FILETYPES = {
    json: {
        extension: ".json",
        type: "application/json",
    },
    txt: {
        extension: ".txt",
        type: "text/plain",
    },
    csv: {
        extension: ".csv",
        type: "text/csv",
    }
}

function initialize() {
    getData(JSONDATA).then((data) => {
        const info = processData(data);
        createSelector(info);
    });
    document.getElementById("btnCopy").onclick = copyText;
    document.getElementById("btnDownload").onclick = downloadText;
}

async function getData(jsonFile) {
    const response = await fetch(jsonFile);
    const data = await response.json();
    return data;
}

function processData(data) {
    const dataLists = data.lists;
    const dataCards = data.cards;
    const dataChecklists = data.checklists;
    const lists = []
    for (const list of dataLists) {
        const obj = {
            activityName: list.name
        };
        obj.topics = getCards(list.id, dataCards, dataChecklists);
        lists.push(obj);
    }
    return lists;
}

function getCards(listId, dataCards, dataChecklists) {
    const cards = [];
    for (const card of dataCards) {
        const cardListId = card.idList;
        if (cardListId == listId) {
            const obj = {
                topicTitle: card.name,
                shortUrl: card.shortUrl,
                url: card.url,
            }
            const checklistId = card.idChecklists;
            obj.checklist = getChecklist(checklistId[0], dataChecklists);
            if (!obj.checklist) delete obj.checklist;
            cards.push(obj);
        }
    }
    return cards;
}

function getChecklist(checklistId, dataChecklists) {
    if (!checklistId) return false;
    const checklist = [];
    for (const chlst of dataChecklists) {
        if (checklistId == chlst.id) {
            for (const item of chlst.checkItems) {
                checklist.push(item.name);
            }
        }
    }
    return checklist;
}

function createSelector(info) {
    const select = document.createElement("select");
    select.className = "form-select";
    select.id = "selActivity";
    for (let i = 0; i < info.length; i++) {
        const list = info[i];
        select.appendChild(createOption(list.activityName, i));
    }
    select.appendChild(createOption("Select Activity", -1));
    select.onchange = () => {
        changeActivity(info);
    }
    document.getElementById("selector").appendChild(select);
    document.getElementById("selType").onchange = () => {
        if (select.value != -1) {
            changeActivity(info);
        }
    }
}

function createOption(text, value) {
    const opt = document.createElement('option');
    opt.textContent = text;
    if (value == -1) {
        opt.selected = true;
        opt.disabled = true;
        opt.hidden = true;
    }
    opt.value = value;
    return opt;
}

function changeActivity(info) {
    const index = document.getElementById("selActivity").value;
    const output = document.getElementById("output");
    const txtFileName = document.getElementById("txtFileName");
    const txtOutput = document.getElementById("txtOutput");
    const type = document.getElementById("selType").value;

    info = info[index];

    let fileName = info.activityName.replaceAll(" ", "");
    fileName += FILETYPES[type].extension;
    txtFileName.value = fileName;
    txtOutput.value = getText(info, type);
    output.hidden = false;
}

function getText(info, type) {
    switch (type) {
        case "json":
            return JSON.stringify(info);
        case "txt":
            let txt = [];
            for (topic of info.topics) {
                txt.push(topic.topicTitle.trim());
            }
            return txt.join("\n");
        case "csv":
            let csv = [];
            let headers = Object.keys(info.topics[0]);
            const index = headers.indexOf("checklist");
            if (index >= 0) headers.splice(index, 1);
            headers.unshift("activityName");
            csv.push(headers.join(","));
            for (const topic of info.topics) {
                let line = [info.activityName]
                for (let i = 1; i < headers.length; i++) {
                    line.push(topic[headers[i]]);
                }
                csv.push(line.join(","));
            }
            return csv.join("\n");
    }
}

function copyText() {
    const text = document.getElementById("txtOutput").value;
    navigator.clipboard.writeText(text).then(
        () => {
            console.log("copiado com sucesso");
            alert("copiado com sucesso");
        },
        err => {
            console.error(err);
        }
    );
}

function downloadText() {
    const fileName = document.getElementById("txtFileName").value;
    const text = document.getElementById("txtOutput").value;
    const blob = new Blob([text], { type: "application/json" });
    const downLink = document.createElement("a");
    downLink.download = fileName;
    if (webkitURL != null) {
        downLink.href = webkitURL.createObjectURL(blob);
    } else {
        downLink.href = URL.createObjectURL(blob);
        downLink.onclick = destroyClickedElement;
        downLink.style.display = 'none';
        document.body.appendChild(downLink);
    }
    downLink.click();
}

initialize();