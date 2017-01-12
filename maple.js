/*
 * Created by maple.yf
 * Created time:  2017-01-09 19:45:26
 */

;

(function(window) {
    var maple = {
        /**
         * 输出调试信息
         * @param {string|obj} msg  调试参数，支持同时输出多个参数，逗号隔开
         */
        debugInfo: function(msg) {
            // console.log(arguments)
            var consoleMsg = '';
            for(var i=0; i<arguments.length; i++){
                if ('[object Object]' === Object.prototype.toString.call(arguments[i])) {
                    consoleMsg += JSON.stringify(arguments[i], null, 4) + '<br>';
                }else{
                    consoleMsg += arguments[i] + '<br>';
                }
            }
            var lineNumber, stack;
            if (Error.captureStackTrace) {
                var getStackTrace = function() {
                    var obj = {};
                    Error.captureStackTrace(obj, getStackTrace);
                    return obj.stack;
                };
                lineNumber = getStackTrace().split(/\n+/)[2].replace(/(^\s+|\s+$)/, "");
                lineNumber = lineNumber.replace(/at http\:\/\/.*\//, "").replace(/\:\d+$/, "");
            } else if (stack = new Error().stack) {
                lineNumber = stack.split(/\n+/)[1].replace(/(^\s+|\s+$)/, "").replace(/(^http\:\/\/.*\/)/, "").replace(/\:\d+$/, "");
            }
            lineNumber = '<label style="color:#000;">----' + lineNumber + '</label>';
            consoleMsg = consoleMsg + lineNumber;
            var $debugInfo = $('#debugInfo');
            if ($debugInfo.length > 0) {
                $debugInfo.append('<div class="debuginfo-list"><pre>' + consoleMsg + '</pre></div>');
            } else {
                var style = 'bottom:0;font-size:14px;color:#0f89f5;box-sizing:border-box;position:fixed;left:0;width:100%;overflow:scroll;background-color:rgba(255,255,255,0.7);z-index:999;padding:10px;';
                $('body').append('<div id="debugInfo" style="' + style + '"></div>');
                $debugInfo = $('#debugInfo');
                $debugInfo.append('<div class="debuginfo-list"><pre>' + consoleMsg + '</pre></div>');
            }
            if ($debugInfo.height() > 150) {
                $debugInfo.css('height', '150px')
            }
        },
    };
    window.maple = maple;
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        var string = msg.toLowerCase();
        if (msg.indexOf('_mapview_') > -1) {
            return;
        }
        var errorMessage = '';
        var substring = "script error";
        if (string.indexOf(substring) > -1) {
            errorMessage = 'Script Error: See Browser Console for Detail';
        } else {
            errorMessage = [
                'Message: ' + msg,
                'URL: ' + url,
                'Line: ' + lineNo,
                'Error object: ' + JSON.stringify(error)
            ].join('<br>');
        }
        maple.debugInfo(errorMessage);
        $('#debugInfo').css('color', '#c7254e');
        $('#debugInfo label').hide();
    }
})(window);