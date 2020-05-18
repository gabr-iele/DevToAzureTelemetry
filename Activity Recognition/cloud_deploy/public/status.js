var storageKey = "d3wS3RSUPztT79E5vkhYmvww/yZTBwqyQ+faEpuVRSs61bFC0v7L5TFbmrLhvuIlOc+BbM3/k0TxqrTH7i2pFw==";
var storageName = "iothwstorage";
var tableName = "cloudDeployTable";

function genRequest(uri) {
    var date = (new Date()).toUTCString();
    var strToSign = date + "\n/"+storageName+"/"+tableName+"()";
    var secret = CryptoJS.enc.Base64.parse(storageKey);
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


function retrieveStatus(ts) {
    var pkey = Math.floor(ts / (24 * 60 * 60 * 1000)) + '';
    var rkey = ts + '';
    var xhr = genRequest("https://"+storageName+".table.core.windows.net/"+tableName+"(PartitionKey='"+pkey+"',RowKey='"+rkey+"')");
    xhr.onreadystatechange = displayStatus;
    xhr.send();
}

function displayStatus(e) {
    if(e.target.status == 200 && e.target.readyState == XMLHttpRequest.DONE) {
        var activity = JSON.parse(e.target.responseText).value[0].activity;
        document.getElementById("activity").innerHTML = activity;
    }
}