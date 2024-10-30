function initialize() {
    const JSONDATA = "./data/40jf8Ikk - conversation-squad.json";
    getData(JSONDATA).then((data) => {
        const info = processData(data);
        console.log(info);
    })
}

async function getData(jsonFile) {
    const response = await fetch(jsonFile);
    const data = await response.json()
    return data;
}

function processData(data) {
    // console.log(data)
    const dataLists = data.lists;
    const dataCards = data.cards;
    const dataChecklists = data.checklists;
    const lists = []
    for (const list of dataLists) {
        const obj = {
            name: list.name
        };
        obj.cards = getCards(list.id, dataCards, dataChecklists);
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

initialize();