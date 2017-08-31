// 通过jQuery选择器或者筛选的方法获取到的query对象集合是不存在dom映射机制的，之前获取到的集合之后在页面中结构调整了，集合中的内容不会跟着自动发生变化（JS获取的元素集合有DOM映射机制）
//循环时候会自动创建一个闭包
//fadeIn的原理是先手动将元素display：block;然后再讲元素的透明度从零到一开始变化，在样式中透明度的初始值要设置成1才可以

(function (jQuery) {
    jQuery.fn.extend({
        banner: banner
    });

    function banner(jsonUrl, interval) {
        var $banner = this;
        var $bannerInner = $banner.children(".bannerInner");
        var $bannerTip = $banner.children(".bannerTip");
        var $bannerLeft = $banner.children(".bannerLeft");
        var $bannerRight = $banner.children(".bannerRight");

        var $oLis = null, $divList = null, $imgList = null;

        var jsonData = null;

        //1、ajax读取数据
        jQuery.ajax({
            url: jsonUrl + '?_=' + Math.random(),
            type: "get",
            dataType: "json",
            async: false, //当前的请求是同步的
            success: function (data) {
                jsonData = data;
            }
        });

        //2、实现数据的绑定
        function bindData() {
            var str = '', str2 = '';
            if (jsonData) {
                jQuery.each(jsonData, function (index, item) {
                    str += '<div><img src="" data-src="' + item.img + '" alt=""></div>';
                    str2 += index === 0 ? '<li class="bg"></li>' : '<li></li>';
                });
                $bannerInner.html(str);
                $bannerTip.html(str2);

                //绑定完成数据后获取我们需要的集合
                $divList = $bannerInner.children("div");
                $imgList = $bannerInner.find("img");
                $oLis = $bannerTip.children("li");
            }
        }

        bindData();

        //3、实现图片的延时加载
        window.setTimeout(lazyImg, 500);
        function lazyImg() {
            $imgList.each(function () {
                var cur = $(this);
                var tempImg = new Image;
                tempImg.src = cur.attr("data-src");
                jQuery(tempImg).on("load", function () {
                    cur.css("display", "block").prop("src", this.src);
                })
            });
            $divList.eq(0).css("zIndex", 1).animate({"opacity": 1}, 300);
        }

        //封装一个轮播图切换的效果
        function changeBanner() {
            var $curDiv = $divList.eq(step);
            $curDiv.css("zIndex", 1).siblings().css("zIndex", 0);
            $curDiv.animate({"opacity": 1}, 300, function () {
                $(this).siblings().css("opacity", 0);
            });
            var $curLi = $oLis.eq(step);
            $curLi.addClass("bg").siblings().removeClass("bg");
        }

        //4、实现自动轮播
        interval = interval || 3000;
        var step = 0, autoTimer = null;
        autoTimer = window.setInterval(autoMove, interval);
        function autoMove() {
            if (step >= jsonData.length - 1) {
                step = -1;
            }
            step++;
            changeBanner();
        }

        //控制左右按钮的显示隐藏和自动轮播的开始和暂停
        $banner.on("mouseenter", function () {
            window.clearInterval(autoTimer);
            $bannerLeft.css("display", "block");
            $bannerRight.css("display", "block");
        }).on("mouseleave", function () {
            autoTimer = window.setInterval(autoMove, interval);
            $bannerLeft.css("display", "none");
            $bannerRight.css("display", "none");
        });

        //6、实现焦点切换
        $oLis.on("click", function () {
            step = jQuery(this).index();
            changeBanner();
        });

        //7、实现左右切换
        $bannerRight.on("click", autoMove);
        $bannerLeft.on("click", function () {
            if (step == 0) {
                step = jsonData.length;
            }
            step--;
            changeBanner();
        })
    }
})(jQuery);
