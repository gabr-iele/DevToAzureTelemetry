# DevToAzureTelemetry
Send virtual telemetry data from device to Azure IoT cloud-based backend

How to test:

1) Fill the variable <code>storageSharedAccessKey</code> in the <code>/web/script.js</code> file and the variable <code>hubSharedAccessKey</code> in the <code>/main/sensors.py</code> file with appropriate values
2) Open a terminal in <code>/main</code> folder and run <code>python sensors.py</code> to start sending telemetry data to the Hub
3) Open the <code>index.html</code> file in the <code>/web</code> folder to execute query operations

Hands-on guide: https://www.hackster.io/gabriele-ursini/send-virtual-telemetry-to-azure-iot-cloud-based-backend-f29b95
Demonstration video: https://youtu.be/VLKDo83KOdA

IMPORTANT: in order to work, the application needs two secret keys to access the Hub and the Storage. In this repository they're omitted for security reasons. 
