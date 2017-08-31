(function () {
    var animateEffect = {
        linear: function (t, b, c, d) {
            return t / d * c + b;
        }
    };

    function animate(options) {
        var _default = {
            curEle: null,
            target: null,
            duration: 500,
            effect: animateEffect.linear,
            callBack: null
        };
        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    _default[key] = options[key];
                }
            }
        }

        var curEle = _default.curEle,
            target = _default.target,
            duration = _default.duration,
            effect = _default.effect,
            callBack = _default.callBack;

        var time = 0, begin = {}, change = {};
        if (target) {
            for (var attr in target) {
                if (target.hasOwnProperty(attr)) {
                    begin[attr] = utils.css(curEle,attr);
                    change[attr] = target[attr] - begin[attr];
                }
            }
        }

        window.clearInterval(curEle.timer);
        curEle.timer = window.setInterval(function(){
            if(time>=duration){
                window.clearInterval(curEle.timer);
                utils.css(curEle,target);
                callBack&&callBack.call(curEle);
                return;
            }
            time+=17;
            var current = {};
            if(target){
                for (var attr in target) {
                    if(target.hasOwnProperty(attr)){
                        current[attr] = effect(time,begin[attr],change[attr],duration);
                    }
                }
            }
            utils.css(curEle,current);
        },17)
    }

    window.myAnimate = animate;
})();