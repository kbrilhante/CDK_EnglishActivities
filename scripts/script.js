function initialize() {
    const JSONDATA = "./data/activities.json";
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






initialize();