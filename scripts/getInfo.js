function initialize() {
    const JSONDATA = "./data/40jf8Ikk - conversation-squad.json";
    getData(JSONDATA).then((data) => {
        const info = processData(data);
        createSelector(info);
    });
    document.getElementById("btnCopy").onclick = copyText;
    document.getElementById("btnDownload").onclick = downloadText;
}

async function getData(jsonFile) {
    const response = await fetch(jsonFile);
    const data = await response.json()
    return data;
}

function processData(data) {
    const dataLists = data.lists;
    const dataCards = data.cards;
    const dataChecklists = data.checklists;
    const lists = []
    for (const list of dataLists) {
        const obj = {
            name: list.name
        };
        obj.topics = getCards(list.id, dataCards, dataChecklists);
        lists.push(obj)
    }
    return lists;
}

function getCards(listId, dataCards, dataChecklists) {
    const cards = [];
    for (const card of dataCards) {
        const cardListId = card.idList
        if (cardListId == listId) {
            const obj = {
                name: card.name,
                shortUrl: card.shortUrl,
                url: card.url,
            }
            const checklistId = card.idChecklists
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
    select.id = "selActivity"
    for (let i = 0; i < info.length; i++) {
        const list = info[i];
        select.appendChild(createOption(list.name, i));
    }
    select.appendChild(createOption("Select Activity"));
    select.onchange = () => {
        changeActivity(info);
    }
    document.getElementById("selector").appendChild(select);
}

function createOption(text, value) {
    const opt = document.createElement('option');
    opt.textContent = text;
    if (value == undefined) {
        opt.selected = true;
        opt.disabled = true;
        opt.hidden = true;
    } else {
        opt.value = value;
    }
    return opt;
}

function changeActivity(info) {
    const index = document.getElementById("selActivity").value;
    const output = document.getElementById("output");
    const txtFileName = document.getElementById("txtFileName");
    const txtOutput = document.getElementById("txtOutput")

    info = info[index]

    let fileName = info.name.replaceAll(" ", "");
    fileName += ".json";
    txtFileName.value = fileName;
    txtOutput.value = JSON.stringify(info);
    output.hidden = false;
}

function copyText() {
    const text = document.getElementById("txtOutput").value;
    navigator.clipboard.writeText(text).then(
        success => {
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