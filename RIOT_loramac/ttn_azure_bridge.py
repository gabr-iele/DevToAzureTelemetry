import paho.mqtt.client as mqtt
import time
import urllib.parse
import hmac
import base64
import json

# event hub compatible name
iotHubName = "[HUB_NAME].azure-devices.net"
# id of broker
device_id = "[DEVICE_ID]"
# topic cloud->broker
hubTopicSubscribe = "devices/"+device_id+"/messages/devicebound/#"
# topic broker->cloud
hubTopicPublish = "devices/"+device_id+"/messages/events/"
# secret key for auth. broker to hub
hubSharedAccessKey = "[HUB_KEY]"
# name of the application on TTN
ttn_app_name = "[TTN_APP_NAME]"
# TTN application key
ttn_app_key = "[TTN_APP_KEY]"

def gen_sas_token(uri, key, expiry=3600):
    ttl = int(time.time())+expiry
    urlToSign = urllib.parse.quote(uri, safe='')
    h = hmac.new(base64.b64decode(key), msg = "{0}\n{1}".format(urlToSign, ttl).encode('utf-8'), digestmod='sha256')
    return "SharedAccessSignature sr={0}&sig={1}&se={2}".format(urlToSign, urllib.parse.quote(base64.b64encode(h.digest()),safe=''), ttl)

def on_connect_az(client, userdata, flags, rc):
    print("Bridge connected Azure-side with result code "+str(rc))
    client_ttn.subscribe(hubTopicSubscribe)


def on_connect_ttn(client, userdata, flags, rc):
    print("Bridge connected TTN-side with result code "+str(rc))
    client_ttn.subscribe("+/devices/+/up")

def on_message_ttn(client, userdata, msg):
	payload = json.loads(msg.payload.decode('utf-8'))
	payload_raw = base64.b64decode(payload['payload_raw'])
	station_id = payload['hardware_serial']
	print("RECEIVED msg by station {0} --> {1}".format(station_id, payload_raw.decode('utf-8')))
	body = json.loads(payload_raw.decode('utf-8'))
	client_az.publish(hubTopicPublish, json.dumps({'parameter': body[0], 'env_station': station_id, 'value': body[1]}))
	print("...Forwarding to the Hub broker...")

def on_disconnect_ttn(client, userdata, rc):
    print("Bridge disconnected with result code: "+str(rc))


client_ttn = mqtt.Client()
client_ttn.on_connect = on_connect_ttn
client_ttn.on_message = on_message_ttn
client_ttn.on_disconnect = on_disconnect_ttn
client_ttn.username_pw_set(ttn_app_name, ttn_app_key)
client_ttn.connect("eu.thethings.network", 1883, 60)

client_az = mqtt.Client(device_id, mqtt.MQTTv311)
client_az.on_connect = on_connect_az
client_az.username_pw_set(iotHubName+"/"+device_id, gen_sas_token(iotHubName+"/devices/"+device_id, hubSharedAccessKey))
client_az.tls_set("./../baltimorebase64.cer")
client_az.tls_insecure_set(False)
client_az.connect(iotHubName, 8883)
client_az.loop_start()

try:
    client_ttn.loop_forever()
except KeyboardInterrupt:
    print("\nMQTT client stopped")
client_ttn.disconnect()
client_az.disconnect()
client_az.loop_stop()
