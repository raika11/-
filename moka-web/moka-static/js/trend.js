$(document).ready(function() {
    //header stiky
    $(window).scroll(function () {
        if($("#trend_sticky").length>0){
            setSticky(stickyHeight);
        }
    });

    topSwiper();

    var timer;
    $(window).resize(function(){
        if($("#trend_sticky").length>0){
            $("#trend_sticky").removeClass("sticky_top");
            stickyHeight = $("#trend_sticky").outerHeight(); 
            setSticky(stickyHeight);
        }

        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(topSwiper, 10);
    }); 
    
    if($("#trend_sticky").length>0){
        var stickyHeight = $("#trend_sticky").outerHeight(); 
        setSticky(stickyHeight);
    }

});

function setSticky(stickyHeight){
    if ($(window).scrollTop() > stickyHeight) {
        $('#trend_sticky').addClass('sticky_top');
        $("main").css("margin-top",stickyHeight + "px");
    } else {
        $('#trend_sticky').removeClass('sticky_top');
        $("main").css("margin-top","0px");
    }
}

function topSwiper() {
    $(".top_history_list .swiper-container").each(function(index, element){
        var $this = $(this);
        $this.addClass('list' + index);
    
        var swiper = new Swiper('.list' + index, {
            slidesPerView : 4,
            spaceBetween: 30,
            navigation: {
                nextEl: $('.list' + index).siblings('.swiper-button-next'),
                prevEl: $('.list' + index).siblings('.swiper-button-prev'),
            },
        });
        
        if ( $(window).width() < 1024 ) {
            if (swiper) {
                swiper.destroy();
            }
        }
    });
}


