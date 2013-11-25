/**
 * 
 * @type {Object}
 */
onus = function(){
    /**
     * The URL to send the data back to 
     * @type String - http://www.example/com/onuserver
     */
    this.serverurl = null;

    /**
     * Driver for the current page
     * @type {[type]}
     */
    this.driver   = null;


    /**
     * Specifies all of the driver currently supported
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
     * Initialize the settings 
     * @param  {String} serverurl
     * @return {void}
     */
    init : function(serverurl){
        this.serverurl = serverurl;
    },

    /**
     * Determines the correct driver and use it to collect the data
     * @return {[type]}
     */
    gather : function(){

        var data = window.bowser.chrome ? onus.drivers.chrome.getData() : (
            window.bowser.firefox ?  onus.drivers.firefox.getData() : (
                window.bowser.msie ?  onus.drivers.msie.getData() : null
            )
        );

        return {data: data, bowser: window.bowser};
    }
}

window.onus = new onus();