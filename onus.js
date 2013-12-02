/**
 * The Onus object
 * @type {Object}
 */
onus = function(config){
    /**
     * The URL to send the data back to 
     * @type String - http://www.example/com/onuserver
     */
    this.serverurl = config.serverurl;

    // Connect to the socket
    this.socket = io.connect(this.serverurl);

    // On connection, we can run the rest of Onus
    this.socket.on('connect', function(){

        // Check the state of the load
        if(document.readyState == 'complete') window.onus.init();
        else
            // We need to wait until all of the resources have loaded, then we can start
            window.addEventListener('load', function (){
                window.onus.init();
            });

        // Set up some events
        window.onus.socket.on('partum', function(id){

            // We have been given an ID! Save it for later so we can send it back to the server
            window.onus.id = id;
        });

    });

    /**
     * Keeps track of the messages already sent to the server
     * @type Number
     */
    this.alreadySentCount = 0;

    /**
     * An ID sent to us by the server. It hasn't been sent yet :(
     * @type Number
     */
    this.id = null;

    /**
     * Specifies all of the drivers currently supported
     * @type {Object}
     */
    this.drivers = {

        'chrome' : {

            /**
             * Returns all the data that chrome can
             * @return {[type]}
             */
            getData  : function(){
                return window.performance.getEntries();
            }
        },

        'msie' : {

            /**
             * Returns all the data the msie can
             * @return {[type]}
             */
            getData : function(){
                return window.performance.getEntries();
            }
        },

        'firefox' : {

            getData : function(){
                return window.performance;
            }
        }
    }
};

/**
 * Function definitions
 */
onus.prototype = {

    /**
     * Determines the correct driver and use it to collect the data
     * @return {[type]}
     */
    gather : function(){

        // TODO - make this better across all browsers.
        var data = window.bowser.chrome ? this.drivers.chrome.getData() : (
            window.bowser.firefox ?  this.drivers.firefox.getData() : (
                window.bowser.msie ?  this.drivers.msie.getData() : null
            )
        );

        // Now remove the ones we have already sent
        data.splice(0, this.alreadySentCount);

        return {data: data, bowser: window.bowser, id: this.id, url: document.location.toString()};
    },

    /**
     *  
     * @return {[type]} [description]
     */
    report : function(){

        var report = this.gather();

        // Don't send 0 data to the server
        if(report.data.length == 0) return;

        // Now increase the sent count
        this.alreadySentCount += report.data.length;

        this.socket.emit('renuntio', report);
    },

    init: function(){

        // Gather up the data and report immediately, then start a 5 second buffer
        this.report();

        // Start the timeout
        setInterval(function(){
            window.onus.report();
        }, 5000);
    }
}

// Create a new instance with the serverurl
window.onus = new onus({
    serverurl : 'http://127.0.0.1:1337/'
});
