/**
 * 
 * @type {Object}
 */
onus = function(serverurl){
    /**
     * The URL to send the data back to 
     * @type String - http://www.example/com/onuserver
     */
    this.serverurl = serverurl;

    this.xmlhttp = window.XMLHttpRequest ?  new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

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
     * Determines the correct driver and use it to collect the data
     * @return {[type]}
     */
    gather : function(){

        var data = window.bowser.chrome ? this.drivers.chrome.getData() : (
            window.bowser.firefox ?  this.drivers.firefox.getData() : (
                window.bowser.msie ?  this.drivers.msie.getData() : null
            )
        );

        return {data: data, bowser: window.bowser};
    },

    report : function(){

        var data = this.gather();

        this.xmlhttp.open('POST', this.serverurl, true);
        this.xmlhttp.setRequestHeader("Content-Type","application/json");
        this.xmlhttp.send(JSON.stringify(data));

    }
}

window.onus = new onus('http://127.0.0.1:1337/');
