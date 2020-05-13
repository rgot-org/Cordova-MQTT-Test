// Pour obtenir une présentation du modèle Vide, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkID=397704
// Pour déboguer du code durant le chargement d'une page dans cordova-simulate ou sur les appareils/émulateurs Android, lancez votre application, définissez des points d'arrêt, 
// puis exécutez "window.location.reload()" dans la console JavaScript.
var URL_BROKER = 'broker.hivemq.com';
var PORT_BROKER = 1883;
var USER_BROKER = '';
var PASS_BROKER = '';
var TOPIC = 'ecran-jeremy_didier';
var connect = false; // variable indiquant si on est connecté au broker

(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Gérer les événements de suspension et de reprise Cordova
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova a été chargé. Effectuez l'initialisation qui nécessite Cordova ici.
        //var parentElement = document.getElementById('deviceready');
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
        console.log('ready');
        /*
        on se connecte au broker MQTT
        */
        mqttConnect();

        // gestion du clic sur le bouton
        $("#btn-envoi").click(function () {
            var message = $("#message").val();
            var topic = TOPIC;
            publish(topic,message) // publication du message

        })

    };



    // fonction permettant de se connecter au broker
    function mqttConnect() {
        /*
        definition de tous les paramètres de la connexion
        */
        let myConnection = {
            url: "tcp://" + URL_BROKER,
            port: PORT_BROKER,
            isBinaryPayload: false,
            success: function (s) {
                connect = true;
                console.log(JSON.stringify(s));
                $('#activity').html("connecté à : " + URL_BROKER + ":" + PORT_BROKER);
                $('#btn-envoi').removeClass('ui-disabled');
            },
            error: function (e) {
                connect = false;
                $('#btn-envoi').addClass('ui-disabled');
                $('#activity').html("erreur de connexion à : " + URL_BROKER + ":" + PORT_BROKER);
                clearInterval(isRun);
                //alert("err!! something is wrong. check the console")
                console.log(e);
            },
            onConnectionLost: function () {
                connect = false;
                $('#btn-envoi').addClass('ui-disabled');
                clearInterval(isRun);

            }
        }
        if (USER_BROKER != "") myConnection.username = USER_BROKER
        if (PASS_BROKER != "") myConnection.password = PASS_BROKER

        cordova.plugins.CordovaMqTTPlugin.connect(myConnection);
    };

    // fonction permettant de publier une donnée sur le topic
    function publish(topic, message) {

        var json = {}; // fabrication d'un objet json
        json.message = message; // affectation de la donnée message à une propriété de json

        console.log("topic : " + topic)
        console.log("message : " + message)
        console.log("json" + json)
        if (!connect) {
            alert("First establish connection then try to publish")
        } else {
            cordova.plugins.CordovaMqTTPlugin.publish({
                topic: topic,
                payload: json,
                qos: 0,
                retain: false,
                success: function (s) {
                    //console.log(JSON.stringify(s));
                },
                error: function (e) {
                    document.getElementById("activity").innerHTML += "--> Error: something is wrong, " + e + "<br>";
                    console.log(e);
                }
            });
        }

    };
    function onPause() {
        // TODO: cette application a été suspendue. Enregistrez l'état de l'application ici.
    };

    function onResume() {
        // TODO: cette application a été réactivée. Restaurez l'état de l'application ici.
    };
} )();