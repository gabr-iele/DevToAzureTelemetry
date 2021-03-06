# DevToAzureTelemetry
Collection of assignments for the Internet of Things course of the MSc in Engineering in Computer Science at Sapienza Università di Roma ([course site](http://ichatz.me/Site/InternetOfThings2020))

Send virtual telemetry data from device to Azure IoT cloud-based backend

[![Jf2dy7.png](https://iili.io/Jf2dy7.png)](https://freeimage.host/i/schema.Jf2dy7)

**HW4: Crowd-sensing application based on mobile accelerometer sensor to perform user activity recognition, in both cloud and edge deployment**

**Goal**: Operate distinction of user activity in still and moving using the mobile sensor for acceleration, exposed by the [Generic Sensor API](https://www.w3.org/TR/generic-sensor/), both in a cloud deployment scenario (the model for recognition is situated in the cloud backend) and in an edge deployment scenario (execute the model directly in the client application). In both cases persistence of measurements and computed activity is implemented by the cloud backend and displayed through a dashboard.

**Useful links**:
- [Assignment](http://ichatz.me/Site/InternetOfThings2020-Assignment4)
- [Hands-on guide](https://www.linkedin.com/pulse/crowd-sensing-application-collection-mobile-data-user-gabriele-ursini/?trackingId=RjhsH6xaQBKRIIMjOftzUw%3D%3D)
- [Demonstration video](https://youtu.be/Pu7A5wCpJNg)

**HW3: Connection of RIOT-OS node and cloud-based backend broker through LoRaWAN protocol (The Things Network)**

**Goal**: Insertion of LoRaWAN protocol in the communication between the nodes and the gateway through TTN and deployment on real hardware provided by IoT-Lab Testbed Facility ([B-L072Z-LRWAN1 LoRa kit](https://www.st.com/en/evaluation-tools/b-l072z-lrwan1.html)).

**Useful links**:
- [Assignment](http://ichatz.me/Site/InternetOfThings2020-Assignment3)
- [Hands-on guide](https://www.linkedin.com/pulse/lorawan-protocol-publishment-from-things-cloud-based-backend-ursini/)
- [Demonstration video](https://youtu.be/bO1vo2ovNTU)

**HW2: Rilevations from RIOT-OS simulated device and from real device (iot-lab)**

**Goal**: Implement a RIOT-OS application to publish simulated values through MQTT-SN protocol and a transparent bridge to the broker of the cloud infrastructure of the previous assingment, and readapt it in order to retrieve values from real sensors using the hardware provided by IoT-Lab Testbed Facility ([M3 Nodes](https://www.iot-lab.info/hardware/m3/)).

**Useful links**:
- [Assignment](http://ichatz.me/Site/InternetOfThings2020-Assignment2)
- [Hands-on guide](https://www.linkedin.com/pulse/publish-virtual-sensor-data-from-riot-os-node-azure-iot-ursini/)
- [Demonstration video](https://www.youtube.com/watch?v=e_nsh2R2caI)

**HW1: Random rilevations from virtual device (python)**

**Goal**: Generate random values simulating the behavior of an environmental station, publish them through the MQTT protocol to the built-in broker of a cloud-based backend (Azure IoT), implement persistency of received data and visualize them on a website.

**How to test**:

1) Fill the variable <code>storageSharedAccessKey</code> in the <code>/web/script.js</code> file and the variable <code>hubSharedAccessKey</code> in the <code>/main/sensors.py</code> file with appropriate values
2) Open a terminal in <code>/main</code> folder and run <code>python sensors.py</code> to start sending telemetry data to the Hub
3) Open the <code>index.html</code> file in the <code>/web</code> folder to execute query operations

**Useful links**:
- [Assignment](http://ichatz.me/Site/InternetOfThings2020-Assignment1)
- [Hands-on guide](https://www.hackster.io/gabriele-ursini/send-virtual-telemetry-to-azure-iot-cloud-based-backend-f29b95)
- [Demonstration video](https://youtu.be/VLKDo83KOdA)

**IMPORTANT**: in order to work, the application needs two secret keys to access the Hub and the Storage. In this repository they're omitted for security reasons. 
