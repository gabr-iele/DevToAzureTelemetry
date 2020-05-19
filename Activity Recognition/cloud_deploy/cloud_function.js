'use strict';

// This function is triggered each time a message is revieved in the IoTHub.
// The message payload is persisted in an Azure Storage Table

module.exports = function (context, iotHubMessage) {
 context.log('Message received: ' + JSON.stringify(iotHubMessage));
 iotHubMessage.forEach(m => {
    var x = JSON.parse(m).x;
    var y = JSON.parse(m).y;
    var z = JSON.parse(m).z;
    var date = JSON.parse(m).ts;  // used to compute partition key and row key
    // recognition model
    var res = Math.sqrt(x*x + y*y + z*z);
    var activity = res > 1.2 ? "Moving" : "Still";
    // save new entry to Table storage
    context.bindings.outputTable = {
        "partitionKey": Math.floor(date / (24 * 60 * 60 * 1000)) + '',
        "rowKey": date + '',
        "x": x,
        "y": y,
        "z": z,
        "activity": activity
    };
 });

 context.done();
};
