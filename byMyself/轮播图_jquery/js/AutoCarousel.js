(function(){
    function AutoBanner(curId,dataUrl,interval){
        this.banner = document.getElementById(curId);
        this.imgBox = utils.byClass("imgBox", this.banner)[0];
        this.focusBox = utils.byClass("focusBox", this.banner)[0];
        this.bannerLeft = utils.byClass("bannerLeft", this.banner)[0];
        this.bannerRight = utils.byClass("bannerRight", this.banner)[0];

        this.divList = this.imgBox.getElementsByTagName("div");
        this.imgList = this.imgBox.getElementsByTagName("img");
        this.focusList = this.focusBox.getElementsByTagName("span");

        this.step = 0;
        this.dataUrl = dataUrl+"?="+Math.random();
        this.interval = interval||1000;
        this.jsonData = null;
        this.timer = null;
        //创建构造函数实例时，返回的是init函数的执行结果，init函数的执行结果就是这个实例
        return this.init();
    }
    AutoBanner.prototype={
        constructor:AutoBanner,
        //获取数据
        queryData:function(){
            var _this = this;
            var xhr = new XMLHttpRequest;
            xhr.open('get', this.dataUrl, false);
            xhr.onreadystatechange = function () {
                //给元素的某个行为绑定方法，方法中的this是当前元素本身
                if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                    _this.jsonData = utils.toJSON(xhr.responseText);
                }
            };
            xhr.send(null);
        },
        bindData:function(){
            var str = '', focusStr = '';
            if (this.jsonData) {
                for (var i = 0; i < this.jsonData.length; i++) {
                    var curData = this.jsonData[i];
                    str += '<li>'
                        + '<a href="' + curData.link + '">'
                        + '<div>'
                        + '<img class="select" src="" data-src="' + curData.img + '" alt="' + curData.desc + '">'
                        + '</div>'
                        + '</a>'
                        + '</li>';
                    focusStr += i == 0 ? '<span class="select"></span>' : '<span></span>';
                }
                this.imgBox.innerHTML = str;
                this.focusBox.innerHTML = focusStr;
            }
        },
        lazyImg:function(oImg){
            var tempImg = new Image;
            tempImg.onload = function () {
                utils.css(oImg.parentNode, "display", "block");
                oImg.src = this.src;
                if (oImg.index == 0) {
                    utils.css(oImg.parentNode, "zIndex", 1);
                    myAnimate({
                        curEle: oImg.parentNode,
                        target: {"opacity": 1},
                        duration: 500
                    })
                } else {
                    utils.css(oImg.parentNode, "zIndex", 0);
                    utils.css(oImg.parentNode, "opacity", 0);
                }
            };
            tempImg.src = oImg.getAttribute("data-src");
            tempImg = null;
        },
        autoPlay:function(){
            if (this.step >= this.jsonData.length - 1) {
                this.step = -1;
            }
            this.step++;
            this.setBanner();
        },
        setBanner:function(){
            var _this = this;
            for (var k = 0; k < this.divList.length; k++) {
                k == this.step ? utils.css(this.divList[k], "zIndex", 1) : utils.css(this.divList[k], "zIndex", 0);
            }
            myAnimate({
                curEle: this.divList[this.step],
                target: {"opacity": 1},
                duration: 500,
                callBack: function () {
                    //this是curEle，这个回调函数是在对应的动画的JS文件中处理过了this的指向
                    for (var j = 0; j < _this.divList.length; j++) {
                        j !== _this.step ? utils.css(_this.divList[j], "opacity", 0) : null;
                    }
                }
            });
            this.changeTip();
        },
        changeTip:function(){
            for (var f = 0; f < this.focusList.length; f++) {
                var curFocus = this.focusList[f];
                f==this.step?utils.addClass(curFocus,"select"):utils.removeClass(curFocus,"select");
            }
        },
        mouse:function(){
            var _this = this;
            this.banner.onmouseenter = function(){
                window.clearInterval(_this.timer);
                utils.css(_this.bannerLeft,"display","block");
                utils.css(_this.bannerRight,"display","block");
            };
            this.banner.onmouseleave = function(){
                _this.timer = window.setInterval(function(){
                    _this.autoPlay();
                }, 1000);
                utils.css(_this.bannerLeft,"display","none");
                utils.css(_this.bannerRight,"display","none");
            }
        },
        clickTip:function(){
            var _this = this;
            for (var i = 0; i < this.focusList.length; i++) {
                var curFoc = this.focusList[i];
                curFoc.index = i;
                curFoc.onclick = function(){
                    _this.step = this.index;
                    _this.setBanner();
                }
            }
        },
        arrow:function(){
            var _this = this;
            this.bannerRight.onclick = function(){
                _this.autoPlay();
            };
            this.bannerLeft.onclick = function(){
                if(_this.step == 0){
                    _this.step = _this.jsonData.length;
                }
                _this.step--;
                _this.setBanner();
            }
        },
        // init就相当于是这个机器的指挥官，是这个构造函数的唯一出口
        init:function(){
            this.queryData();
            this.bindData();
            for (var i = 0; i < this.imgList.length; i++) {
                var curImg = this.imgList[i];
                curImg.index = i;
                this.lazyImg(curImg);
            }
            var _this = this;
            this.timer = window.setInterval(function(){
                //这里需要改变一下autoPlay中的this的指向，如果直接使用this.timer = window.setInterval(autoPlay, 1000);autoPlay中的this指向window，所以为了改变里面的指向，需要外面再包一层匿名函数，这样就可以在匿名函数触发的时候，匿名函数包裹的函数在改变this指向的同时执行
                _this.autoPlay();
            }, this.interval);
            this.mouse();
            this.clickTip();
            this.arrow();
            return this;
        }
    };
    window.AutoBanner = AutoBanner;
})();