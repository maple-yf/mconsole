/*
 * Created by maple.yf
 * Created time:  2017-01-09 19:45:26
 */

;

(function(window) {
    var maple = {
        /**
         * 输出调试信息
         * @param {string|obj} msg 可选 调试参数，为空时捕获js错误
         * @param {string} position 可选 调试信息的位置 top:顶部;bottom:底部
         */
        debugInfo: function(msg, position) {
            // if (this.isPublic()) return;
            if (!position) position = 'bottom';
            if ('[object Object]' === Object.prototype.toString.call(msg)) {
                msg = JSON.stringify(msg);
            }
            var lineNumber, test, stack;
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
            msg = msg + lineNumber;
            var $debugInfo = $('#debugInfo');
            if ($debugInfo.length > 0) {
                $debugInfo.append('<div class="debuginfo-list">' + msg + '</div>');
            } else {
                var style = 'color:#0f89f5;position:fixed;left:0;width:100%;overflow:scroll;background-color:rgba(255,255,255,0.7);z-index:999;padding:10px;';
                if (position == 'bottom') {
                    style += 'bottom:0';
                } else {
                    style += 'top:0';
                }
                $('body').append('<div id="debugInfo" style="' + style + '"></div>');
                $debugInfo = $('#debugInfo');
                $debugInfo.append('<div class="debuginfo-list">' + msg + '</div>');
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
        var substring = "script error";
        if (string.indexOf(substring) > -1) {
            alert('Script Error: See Browser Console for Detail');
        } else {
            var message = [
                'Message: ' + msg,
                'URL: ' + url,
                'Line: ' + lineNo,
                'Error object: ' + JSON.stringify(error)
            ].join('<br>');
            maple.debugInfo(message);
            $('#debugInfo').css('color', '#c7254e');
            $('#debugInfo label').hide();
        }
    }
})(window);