import paho.mqtt.client as mqtt
import random
import time
import base64
import hmac
import urllib.parse
import json

NUM_STATIONS = 2
DELAY_TIME = 2
device_id = "pydevhw1"
hubTopicPublish = "devices/"+device_id+"/messages/events/"
iotHubName = "homework1.azure-devices.net"
hubTopicSubscribe = "devices/"+device_id+"/messages/devicebound/#"
hubSharedAccessKey = --HUB_SHARED_ACCESS_KEY--

MIN_TEMP=-50
MAX_TEMP=50
MIN_HUM=0
MAX_HUM=100
MIN_WIND_DIR=0
MAX_WIND_DIR=360
MIN_WIND_INT=0
MAX_WIND_INT=100
MIN_RAIN=0
MAX_RAIN=50


def on_connect(client, userdata, flags, rc):
    print("Connected with result code: %s" % rc)
    client.subscribe(hubTopicSubscribe)

def on_disconnect(client, userdata, rc):
    print("Disconnected with result code: %s" %rc)

def on_message(client, userdata, msg):
    print("{0} - {1} ".format(msg.topic, str(msg.payload)))

#def on_publish(client, userdata, mid):
#    print("Message {0} sent from {1}".format(str(mid), device_id))

def start_stations():

    time.sleep(1)

    while True:
        try:
            for i in range(NUM_STATIONS):        
                temp = random.random()*(MAX_TEMP-MIN_TEMP)+MIN_TEMP
                hum = random.random()*(MAX_HUM-MIN_HUM)+MIN_HUM
                wind_dir = random.random()*(MAX_WIND_DIR-MIN_WIND_DIR)+MIN_WIND_DIR
                wind_int = random.random()*(MAX_WIND_INT-MIN_WIND_INT)+MIN_WIND_INT
                rain = random.random()*(MAX_RAIN-MIN_RAIN)+MIN_RAIN
                S = "S"+str(i+1)
                

                client.publish(hubTopicPublish, json.dumps({'parameter': 'temperature', 'env_station': S, 'value': str(temp)}))
                print("Sent Temperature parameter from station "+S)
                client.publish(hubTopicPublish, json.dumps({'parameter': 'humidity', 'env_station': S, 'value': str(hum)}))
                print("Sent Humidity parameter from station "+S)
                client.publish(hubTopicPublish, json.dumps({'parameter': 'windDirection', 'env_station': S, 'value': str(wind_dir)}))
                print("Sent Wind Direction parameter from station "+S)
                client.publish(hubTopicPublish, json.dumps({'parameter': 'windIntensity', 'env_station': S, 'value': str(wind_int)}))
                print("Sent Wind Intensity parameter from station "+S)
                client.publish(hubTopicPublish, json.dumps({'parameter': 'rainHeight', 'env_station': S, 'value': str(rain)}))
                print("Sent Rain Height parameter from station "+S)
            time.sleep(DELAY_TIME)
        except KeyboardInterrupt:
            print("MQTT client stopped")
            return
        except:
            print("Unexpected error")
            time.sleep(DELAY_TIME)


def gen_sas_token(uri, key, expiry=3600):
    ttl = int(time.time())+expiry
    urlToSign = urllib.parse.quote(uri, safe='')
    h = hmac.new(base64.b64decode(key), msg = "{0}\n{1}".format(urlToSign, ttl).encode('utf-8'), digestmod='sha256')
    return "SharedAccessSignature sr={0}&sig={1}&se={2}".format(urlToSign, urllib.parse.quote(base64.b64encode(h.digest()),safe=''), ttl) 

    
client = mqtt.Client(device_id, mqtt.MQTTv311)
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_message = on_message
#client.on_publish = on_publish
client.username_pw_set(iotHubName+"/"+device_id, gen_sas_token(iotHubName+"/devices/"+device_id, hubSharedAccessKey))
client.tls_set("./../baltimorebase64.cer")
client.tls_insecure_set(False)

client.connect(iotHubName, port=8883)

client.loop_start()

start_stations()

client.disconnect()
