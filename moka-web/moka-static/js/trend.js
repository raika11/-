$(document).ready(function() {
    topSwiper();

    $(window).resize(function(){
        topSwiper();
    });
    
});

function topSwiper() {
    $(".top_history_list .swiper-container").each(function(index, element){
        var $this = $(this);
        $this.addClass('list' + index);
    
        var swiper = new Swiper('.list' + index, {
            //observer: true,
            //observeParents: true,
            slidesPerView : 4,
            navigation: {
                nextEl: $('.list' + index).siblings('.swiper-button-next'),
                prevEl: $('.list' + index).siblings('.swiper-button-prev'),
            },
            breakpoints: {
                1023: {
                    slidesPerView : 1,
                }
            },
        });
        
        if ( $(window).width() < 1024 ) {
            swiper.destroy();
        }
    });
}