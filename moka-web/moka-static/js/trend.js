$(document).ready(function() {
    topSwiper();

    var timer;
    $(window).resize(function(){
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(topSwiper, 10);
    });    
});

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

