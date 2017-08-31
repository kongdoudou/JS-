(function () {
    function Tab(curId,dataUrl, index) {
        this.tab = document.getElementById(curId);
        this.pages = utils.byClass("pages", this.tab)[0];
        this.contents = utils.byClass("contents", this.tab)[0];

        this.oLis = this.pages.getElementsByTagName("li");
        this.oDivs = this.contents.getElementsByTagName("div");

        this.newData = null;
        this.index = index||0;
        this.dataUrl = dataUrl;
        return this.init();
    }

    Tab.prototype = {
        constructor: Tab,
        queryData: function () {
            var _this = this;
            var xhr = new XMLHttpRequest;
            xhr.open('get',this.dataUrl,false);
            xhr.onreadystatechange = function(){
                if(xhr.readyState ===4 && /^2\d{2}$/.test(xhr.status)){
                    _this.newData=utils.toJSON(xhr.responseText);
                }
            };
            xhr.send(null);
        },
        bindData: function () {
            if(this.newData){
                var str = '',conStr = '';
                for (var i = 0; i < this.newData.length; i++) {
                    var curData = this.newData[i];
                    str+=i===this.index?'<li class="current">'+curData.title+'</li>':'<li>'+curData.title+'</li>';
                    conStr+=i===this.index?'<div class="current">'+curData.content+'</div>':'<div>'+curData.content+'</div>';
                }
                this.pages.innerHTML = str;
                this.contents.innerHTML = conStr;
            }
        },
        change:function(){
            var _this = this;
            if(this.oLis){
                for (var i = 0; i < this.oLis.length; i++) {
                    var curLi = this.oLis[i];
                    curLi.index = i;
                    curLi.onclick = function(){
                        _this.changeTab(this.index);
                    }
                }
            }
        },
        changeTab:function(index){
            if(this.oLis){
                for (var i = 0; i < this.oLis.length; i++) {
                    i==index?utils.addClass(this.oLis[i],"current"):utils.removeClass(this.oLis[i],"current");
                    i==index?utils.addClass(this.oDivs[i],"current"):utils.removeClass(this.oDivs[i],"current");
                }
            }
        },
        init: function () {
            this.queryData();
            this.bindData();
            this.change();
            return this;
        }
    };
    window.Tab = Tab;
})();