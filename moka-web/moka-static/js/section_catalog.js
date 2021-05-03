$(document).ready(function() {
    var showcase= new Swiper('.showcase_swiper .swiper-container', {
        autoplay: {
            delay: 3000,
            disableOnInteraction: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
    
    $(".swiper-button-play").click(function(){
        showcase.autoplay.start();
        $('.swiper_list .swiper-button-pause').addClass('active');
        $(this).toggleClass('active');
        return false;
    });
    $(".swiper-button-pause").click(function(){
        showcase.autoplay.stop();
        $('.swiper_list .swiper-button-play').addClass('active');
        $(this).toggleClass('active');
        return false;
    });
 
});


