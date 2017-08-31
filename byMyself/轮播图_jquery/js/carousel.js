var bannerRender = (function () {
    var banner = document.getElementById("box"),
        imgBox = utils.byClass("imgBox", banner)[0],
        focusBox = utils.byClass("focusBox", banner)[0],
        bannerLeft = utils.byClass("bannerLeft", banner)[0],
        bannerRight = utils.byClass("bannerRight", banner)[0];

    var divList = imgBox.getElementsByTagName("div"),
        imgList = imgBox.getElementsByTagName("img"),
        focusList = focusBox.getElementsByTagName("span");

    var step = 0, jsonData = null;

    var timer = null;

    function queryData() {
        var xhr = new XMLHttpRequest;
        xhr.open('get', 'json/banner.json', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                jsonData = utils.toJSON(xhr.responseText);
            }
        };
        xhr.send(null);
    }

    function bindData() {
        var str = '', focusStr = '';
        if (jsonData) {
            for (var i = 0; i < jsonData.length; i++) {
                var curData = jsonData[i];
                str += '<li>'
                    + '<a href="' + curData.link + '">'
                    + '<div>'
                    + '<img class="select" src="" data-src="' + curData.img + '" alt="' + curData.desc + '">'
                    + '</div>'
                    + '</a>'
                    + '</li>';
                focusStr += i == 0 ? '<span class="select"></span>' : '<span></span>';
            }
            imgBox.innerHTML = str;
            focusBox.innerHTML = focusStr;
        }
}

    function lazyImg(oImg) {
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
    }

    function autoPlay() {
        if (step >= jsonData.length - 1) {
            step = -1;
        }
        step++;
        setBanner();
    }

    function setBanner(){
        for (var k = 0; k < divList.length; k++) {
            k == step ? utils.css(divList[k], "zIndex", 1) : utils.css(divList[k], "zIndex", 0);
        }
        myAnimate({
            curEle: divList[step],
            target: {"opacity": 1},
            duration: 500,
            callBack: function () {
                for (var j = 0; j < divList.length; j++) {
                    j !== step ? utils.css(divList[j], "opacity", 0) : null;
                }
            }
        });
        changeTip();
    }

    function changeTip(){
        for (var f = 0; f < focusList.length; f++) {
            var curFocus = focusList[f];
            f==step?utils.addClass(curFocus,"select"):utils.removeClass(curFocus,"select");
        }
    }

    function mouse(){
        banner.onmouseenter = function(){
            window.clearInterval(timer);
            utils.css(bannerLeft,"display","block");
            utils.css(bannerRight,"display","block");
        };
        banner.onmouseleave = function(){
            timer = window.setInterval(autoPlay, 1000);
            utils.css(bannerLeft,"display","none");
            utils.css(bannerRight,"display","none");
        }
    }

    function clickTip(){
        for (var i = 0; i < focusList.length; i++) {
            var curFoc = focusList[i];
            curFoc.index = i;
            curFoc.onclick = function(){
                step = this.index;
                setBanner();
            }

        }
    }

    function arrow(){
        bannerRight.onclick = autoPlay;
        bannerLeft.onclick = function(){
            if(step == 0){
                step = jsonData.length;
            }
            step--;
            setBanner();
        }
    }

    return {
        init: function () {
            queryData();
            bindData();
            for (var i = 0; i < imgList.length; i++) {
                var curImg = imgList[i];
                curImg.index = i;
                lazyImg(curImg);
            }
            timer = window.setInterval(autoPlay, 1000);
            mouse();
            clickTip();
            arrow();
        }
    }
})();

bannerRender.init();
