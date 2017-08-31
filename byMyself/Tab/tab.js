var tabRender = (function(){
    var tab = document.getElementById("tab");
    var pages = utils.byClass("pages",tab)[0];
    var contents = utils.byClass("contents",tab)[0];

    var oLis = pages.getElementsByTagName("li");
    var oDivs = contents.getElementsByTagName("div");

    var newData = null;

    function queryData(){
        var xhr = new XMLHttpRequest;
        xhr.open('get','tab.json',false);
        xhr.onreadystatechange = function(){
            if(xhr.readyState ===4 && /^2\d{2}$/.test(xhr.status)){
                newData=utils.toJSON(xhr.responseText);
            }
        };
        xhr.send(null);
    }

    function bindData(){
        if(newData){
            var str = '',conStr = '';
            for (var i = 0; i < newData.length; i++) {
                var curData = newData[i];
                str+=i===0?'<li class="current">'+curData.title+'</li>':'<li>'+curData.title+'</li>';
                conStr+=i===0?'<div class="current">'+curData.content+'</div>':'<div>'+curData.content+'</div>';
            }
            pages.innerHTML = str;
            contents.innerHTML = conStr;
        }
    }
    function change(){
        if(oLis){
            for (var i = 0; i < oLis.length; i++) {
                var curLi = oLis[i];
                curLi.index = i;
                curLi.onclick = function(){
                    changeTab(this.index);
                }
            }
        }
    }

    function changeTab(index){
        if(oLis){
            for (var i = 0; i < oLis.length; i++) {
                i==index?utils.addClass(oLis[i],"current"):utils.removeClass(oLis[i],"current");
                i==index?utils.addClass(oDivs[i],"current"):utils.removeClass(oDivs[i],"current");
            }
        }
    }

    return {
        init:function(){
            queryData();
            bindData();
            change();
        }
    }
})();

tabRender.init();