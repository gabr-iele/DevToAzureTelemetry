'use strict';

// This function is triggered each time a message is revieved in the IoTHub.
// The message payload is persisted in an Azure Storage Table

module.exports = function (context, iotHubMessage) {
 context.log('Message received: ' + JSON.stringify(iotHubMessage));
 var date = Date.now();
 var partitionKey = Math.floor(date / (24 * 60 * 60 * 1000)) + '';
 var rowKey = date + '';
 iotHubMessage.forEach(m => {
    context.bindings.outputTable = {
        "partitionKey": partitionKey,
        "rowKey": rowKey,
        "parameter": JSON.parse(m).parameter,
        "env_station": JSON.parse(m).env_station,
        "value": JSON.parse(m).value
    };
 });

 context.done();
};
