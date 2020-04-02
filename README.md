# DevToAzureTelemetry
Collection of assignments for the Internet of Things course of the MSc in Engineering in Computer Science at Sapienza Università di Roma

Send virtual telemetry data from device to Azure IoT cloud-based backend

[![Jf2dy7.png](https://iili.io/Jf2dy7.png)](https://freeimage.host/i/schema.Jf2dy7)

**HW2: Rilevations from RIOT-OS simulated device and from real device (iot-lab)**

Hands-on guide: https://www.linkedin.com/feed/update/urn:li:activity:6651154560838615040/ <br />
Demonstration video: https://www.youtube.com/watch?v=e_nsh2R2caI

**HW1: Random rilevations from virtual device (python)**

How to test:

1) Fill the variable <code>storageSharedAccessKey</code> in the <code>/web/script.js</code> file and the variable <code>hubSharedAccessKey</code> in the <code>/main/sensors.py</code> file with appropriate values
2) Open a terminal in <code>/main</code> folder and run <code>python sensors.py</code> to start sending telemetry data to the Hub
3) Open the <code>index.html</code> file in the <code>/web</code> folder to execute query operations

Hands-on guide: https://www.hackster.io/gabriele-ursini/send-virtual-telemetry-to-azure-iot-cloud-based-backend-f29b95  Demonstration video: https://youtu.be/VLKDo83KOdA

Linkedin profile: https://www.linkedin.com/in/gabriele-ursini-08578a1a3/

IMPORTANT: in order to work, the application needs two secret keys to access the Hub and the Storage. In this repository they're omitted for security reasons. 
