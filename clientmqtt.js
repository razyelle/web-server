var wsbroker = "me2nv7.messaging.internetofthings.ibmcloud.com";  //mqtt websocket enabled broker
var wsport = 443 // port for above

var client = new Paho.MQTT.Client(wsbroker, wsport,
    "d:me2nv7:Sewio_Devices:JakubRec");

client.onConnectionLost = function (responseObject) {
    console.log("connection lost: " + responseObject.errorMessage);
};

client.onMessageArrived = function (message) {
    console.log(message.destinationName, ' -- ', message.payloadString);
};

var options = {
    //timeout: 3,
    useSSL:true,
    userName:'use-token-auth',
    password: 'iotsewiotoken',
    keepAliveInterval: 1000,
    onSuccess: function () {
    console.log("mqtt connected");
    // Connection succeeded; subscribe to our topic, you can add multile lines of these
    client.subscribe('iot-2/#', {qos: 1});
    console.log("Test Log");


    //use the below if you want to publish to a topic on connect
    message = new Paho.MQTT.Message(JSON.stringify({"payload" : "Hello"}));
    message.destinationName = "iot-2/evt/whatever/fmt/json";
    client.send(message);

    },
    onFailure: function (message) {
    console.log("Connection failed: " + message.errorMessage);
    }
};

function init() {
    client.connect(options);
}