var storageSharedAccessKey = --STORAGE_SHARED_ACCESS_KEY--;

var groupBy = function(array, property) {
    return array.reduce((acc, obj) => {
        const key = obj[property];
        if(!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(obj);
        return acc;
    }, {});
};

function genRequest(uri) {
    var date = (new Date()).toUTCString();
    var strToSign = date + "\n/hw1storage/deviceData()";
    var secret = CryptoJS.enc.Base64.parse(storageSharedAccessKey);
    var hash = CryptoJS.HmacSHA256(strToSign, secret);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    var auth = "SharedKeyLite hw1storage:" + hashInBase64;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.setRequestHeader("Accept", "application/json;odata=nometadata");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-ms-date", date);
    xhr.setRequestHeader("x-ms-version", "2019-07-07");
    xhr.setRequestHeader("Authorization", auth);
    return xhr;

}

function f1() {
    
    var uri = "https://hw1storage.table.core.windows.net/deviceData()?$filter=env_station%20eq%20'"+document.getElementById("env_station").value+"'%20";
    var xhr = genRequest(uri);
    xhr.onreadystatechange = f1_display;
    xhr.send();
    
}

function f1_display(e) {
    if(e.target.status == 200 && e.target.readyState == XMLHttpRequest.DONE) {
        //console.log(e.target.responseText);
        var table = document.getElementById("tab1");
        table.innerHTML = "";
        table.innerHTML += "<tr><th>Parameter</th><th>Env. Station</th><th>Value</th><th>Timestamp</th></tr>";
        var entries = JSON.parse(e.target.responseText).value;  //[{...},{...},...,{...}]
        //console.log(entries);
        var grouped = groupBy(entries, 'parameter');   //{temp: [...], hum: [...], ...}
        for(var param in grouped) {
            var paramValues = grouped[param];   //[{...},...,{...}]
            var latest = paramValues.reduce((prev, cur) => (prev.RowKey > cur.RowKey) ? prev : cur);                       
            table.innerHTML += "<tr><td>"+latest.parameter+"</td><td>"+latest.env_station+"</td><td>"+latest.value+"</td><td>"+latest.Timestamp+"</td></tr>";
        }    
    }
}

function f2() {
    var uri = "https://hw1storage.table.core.windows.net/deviceData()?$filter=parameter%20eq%20'"+document.getElementById("sensor").value+"'%20";
    var xhr = genRequest(uri);
    xhr.onreadystatechange = f2_display;
    xhr.send();
}

function f2_display(e) {
    if(e.target.status == 200 && e.target.readyState == XMLHttpRequest.DONE) {
        var table = document.getElementById("tab2");
        table.innerHTML = "";
        table.innerHTML += "<tr><th>Parameter</th><th>Env. Station</th><th>Value</th><th>Timestamp</th></tr>";
        var entries = JSON.parse(e.target.responseText).value;
        //console.log(entries);
        var curDate = Date.now();
        entries.forEach(e => {
            if(parseInt(e.RowKey) + 3600000 >= curDate)
                table.innerHTML += "<tr><td>"+e.parameter+"</td><td>"+e.env_station+"</td><td>"+e.value+"</td><td>"+e.Timestamp+"</td></tr>";
        });
    }
}
