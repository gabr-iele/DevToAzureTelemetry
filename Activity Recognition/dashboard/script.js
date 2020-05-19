const storageName = "YOUR_STORAGE_ACCOUNT_NAME";
const storageKey = "YOUR_STORAGE_KEY";
const tab1 = "cloudDeployTable()";
const tab2 = "edgeDeployTable()";

function genRequest(uri, table) {
    var date = (new Date()).toUTCString();
    var strToSign = date + "\n/"+storageName+"/"+table;
    var secret = CryptoJS.enc.Base64.parse(storageKey);
    var hash = CryptoJS.HmacSHA256(strToSign, secret);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    var auth = "SharedKeyLite " + storageName + ":" + hashInBase64;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.setRequestHeader("Accept", "application/json;odata=nometadata");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-ms-date", date);
    xhr.setRequestHeader("x-ms-version", "2019-07-07");
    xhr.setRequestHeader("Authorization", auth);
    return xhr;

}

function cloud_query() {
    var uri = "https://"+storageName+".table.core.windows.net/"+tab1;
    var xhr = genRequest(uri, tab1);
    xhr.onreadystatechange = cloud_query_display;
    xhr.send();
}

function cloud_query_display(e) {
    if(e.target.status == 200 && e.target.readyState == XMLHttpRequest.DONE) {

        var table = document.getElementById("cloud_table1");
        table.innerHTML = "";
        table.innerHTML += "<tr><th>X</th><th>Y</th><th>Z</th><th>Activity</th><th>Timestamp</th></tr>";
        var entries = JSON.parse(e.target.responsText).value;
        var latest = entries.reduce((prev,cur) => (prev.RowKey > cur.RowKey) ? prev : cur);
        table.innerHTML += "<tr><td>"+latest.x+"</td><td>"+latest.y+"</td><td>"+latest.z+"</td><td>"+latest.activity+"</td><td>"+latest.Timestamp+"</td></tr>";

        table = document.getElementById("cloud_table2");
        table.innerHTML = "";
        table.innerHTML += "<tr><th>X</th><th>Y</th><th>Z</th><th>Activity</th><th>Timestamp</th></tr>";
        var curDate = Date.now();
        entries.foreach(e => {
            if(parseInt(e.RowKey) + 3600000 >= curDate)
                table.innerHTML += "<tr><td>"+e.x+"</td><td>"+e.y+"</td><td>"+e.z+"</td><td>"+e.activity+"</td><td>"+e.Timestamp+"</td></tr>";
        });
    }
}


function edge_query() {
    var uri = "https://"+storageName+".table.core.windows.net/"+tab2;
    var xhr = genRequest(uri, tab2);
    xhr.onreadystatechange = edge_query_display;
    xhr.send();
}

function edge_query_display(e) {
    if(e.target.status == 200 && e.target.readyState == XMLHttpRequest.DONE) {
        
        var table = document.getElementById("edge_table1");
        table.innerHTML = "";
        table.innerHTML += "<tr><th>Activity</th><th>Timestamp</th></tr>";
        var entries = JSON.parse(e.target.responseText).value;
        var latest = entries.reduce((prev,cur) => (prev.RowKey > cur.RowKey) ? prev : cur);
        table.innerHTML += "<tr><td>"+latest.activity+"</td><td>"+latest.Timestamp+"</td></tr>";

        table = document.getElementById("edge_table2");
        table.innerHTML = "";
        table.innerHTML += "<tr><th>Activity</th><th>Timestamp</th></tr>";
        var curDate = Date.now();
        entries.forEach(e => {
            if(parseInt(e.RowKey) + 3600000 >= curDate)
                table.innerHTML += "<tr><td>"+e.activity+"</td><td>"+e.Timestamp+"</td></tr>";
        });
    }
}
