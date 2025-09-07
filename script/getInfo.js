function mainContent() {
    document.title = TITLE_GET_INFO;
    document.getElementById("title").innerText = TITLE_GET_INFO;
    document.getElementById("btnCopy").onclick = copyText;
    document.getElementById("btnDownload").onclick = downloadText;
    loadJson(GET_INFO_DATA).then(data => {
        const processedData = processData(data);
        buildSelector(processedData);
    });
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

function buildSelector(data) {
    let options = ["Select Activity"];
    let values = [-1];
    for (let i = 0; i < data.length; i++) {
        let list = data[i];
        options.push(list.activityName);
        values.push(i);
    }
    const select = createSelect(document.getElementById("selector"), "selActivity", options, values);
    select.onchange = () => {
        changeActivity(data);
    }
    document.getElementById("selType").onchange = () => {
        if (select.value != -1) {
            changeActivity(data);
        }
    }
}

function changeActivity(data) {
    const index = document.getElementById("selActivity").value;
    const type = document.getElementById("selType").value;
    const output = document.getElementById("output");
    const txtFileName = document.getElementById("txtFileName");
    const txtOutput = document.getElementById("txtOutput");

    data = data[index];

    let fileName = data.activityName.replaceAll(" ", "");
    fileName += FILE_TYPES[type].extension;
    txtFileName.value = fileName;
    txtOutput.value = getText(data, type);
    output.hidden = false;
}

function getText(data, type) {
    switch (type) {
        case "json":
            return JSON.stringify(data, null, 2);
        case "txt":
            let txt = [];
            for (let topic of data.topics) {
                txt.push(topic.topicTitle.trim());
            }
            return txt.join("\n");
        case "csv":
            let csv = [];
            const headers = Object.keys(data.topics[0]);
            const index = headers.indexOf("checklist");
            if (index >= 0) headers.splice(index, 1);
            headers.unshift("activityName");
            csv.push(headers.join(","));
            for (let topic of data.topics) {
                let line = [`\"${data.activityName}\"`];
                for (let i = 1; i < headers.length; i++) {
                    let header = headers[i];
                    line.push(`\"${topic[header]}\"`);
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
            console.log("copied to clipboard");
            alert("copied to clipboard");
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