/*
 * Created by maple.yf
 * Created time:  2017-01-09 19:45:26
 */

;

(function(window) {
    var maple = {
        /**
         * 获取对象类型
         * @param  {[type]} obj [description]
         * @return {[string]}     获取对象类型
         */
        _getObjectType: function(obj){
            return Object.prototype.toString.call(obj);
        },
        /**
         * html元素转换成字符串
         * @param  {[HTML Object]} s [description]
         * @return {[string]}  html元素转换成字符串
         */
        _htmlencode: function(s){  
            var div = document.createElement('div');  
            div.appendChild(document.createTextNode(s));  
            return div.innerHTML;  
        },
        /**
         * 格式化object为字符串
         * @param  {[obj|string]} arg 
         * @return {[string]}     格式化object为字符串
         */
        _formateMSG: function(arg){
            var consoleMsg = '';
            for(var i=0; i<arg.length; i++){
                if ('[object Object]' === maple._getObjectType(arg[i])) {
                    consoleMsg += JSON.stringify(arg[i], null, 4) + '<br>';
                }else if('[object Array]' === maple._getObjectType(arg[i])){
                    var _array = arg[i]
                    consoleMsg += _array.length + '<br>[<br>';
                    for(var j = 0, length1 = _array.length; j < length1; j++){
                        if(maple._getObjectType(_array[j]).indexOf('HTML') >0){
                            consoleMsg += maple._htmlencode(_array[j].outerHTML);
                        }else{
                            consoleMsg += JSON.stringify(_array[j], null, 4);
                        }
                    }
                    consoleMsg += '<br>]<br>';
                }else{
                    consoleMsg += arg[i] + '<br>';
                }
            }
            return consoleMsg;
        },
        /**
         * 获取行号
         * @return {[string]} 描述行号的字符串
         */
        _getLineNumber: function(){
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
            return lineNumber;
        },
        /**
         * 渲染调试信息
         * @param  {[string]} msg 格式化后的信息
         */
        _renderDebugInfo: function(msg){
            var $debugInfo = $('#debugInfo');
            if ($debugInfo.length > 0) {
                $debugInfo.append('<div class="debuginfo-list"><pre>' + msg + '</pre></div>');
            } else {
                var style = 'bottom:0;font-size:14px;color:#0f89f5;box-sizing:border-box;position:fixed;left:0;width:100%;overflow:scroll;background-color:rgba(255,255,255,0.7);z-index:999;padding:10px;';
                $('body').append('<div id="debugInfo" style="' + style + '"></div>');
                $debugInfo = $('#debugInfo');
                $debugInfo.append('<div class="debuginfo-list"><pre>' + msg + '</pre></div>');
            }
            if ($debugInfo.height() > 150) {
                $debugInfo.css('height', '150px')
            }
        },

        /**
         * 输出调试信息
         * @param {string|obj} msg  调试参数，支持同时输出多个参数，逗号隔开
         */
        debugInfo: function(msg) {
            // console.log(arguments)
            var consoleMsg = '';
            consoleMsg += maple._formateMSG(arguments);
            consoleMsg += maple._getLineNumber();
            maple._renderDebugInfo(consoleMsg);
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