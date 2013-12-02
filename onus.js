/**
 * The Onus object
 * @type {Object}
 */
onus = function(config){

    // Take this into the local scope
    var self = this;

    // This might be dangerous...
    self.cfg = config;

    // Overwrite these things
    self.cfg.reportId = null;
    self.cfg.alreadySentCount = 0;

    /**
     * Specifies all of the drivers currently supported
     * @type {Object}
     */
    self.drivers = {

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

    // Connect to the socket
    self.cfg.socket = io.connect(self.cfg.serverUrl);

    // On connection, we can run the rest of Onus
    self.cfg.socket.on('connect', function(){

        // Check the state of the load
        if(document.readyState == 'complete') self.init();
        else
            // We need to wait until all of the resources have loaded, then we can start
            window.addEventListener('load', function (){
                self.init();
            });

        // Set up some events
        self.cfg.socket.on('partum', function(id){

            // We have been given an ID! Save it for later so we can send it back to the server
            self.cfg.reportId = id;
        });

    });
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
        data.splice(0, this.cfg.alreadySentCount);

        return {data: data, bowser: window.bowser, id: this.cfg.reportId, url: document.location.toString()};
    },

    /**
     *
     * @return {[type]} [description]
     */
    report : function(){

        var report = this.gather();

        // Don't send 0 data to the server
        if(report.data.length === 0) return;

        // Now increase the sent count
        this.cfg.alreadySentCount += report.data.length;

        this.cfg.socket.emit('renuntio', report);
    },

    init: function(){

        var self = this;

        // Gather up the data and report immediately, then start a 5 second interval
        self.report();

        // Start the interval
        setInterval(function(){
            self.report();
        }, 5000);
    }
}

// Create a new instance
window.onus = new onus({
    serverUrl : 'http://127.0.0.1:1337/'
});
