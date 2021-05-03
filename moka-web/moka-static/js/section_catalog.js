$(document).ready(function() {
    var showcase= new Swiper('.showcase_swiper .swiper-container', {
        autoplay: {
            delay: 3000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            1023: {
                autoplay: false,
            }
        },
    });
    showcase.autoplay.stop();
    $(".swiper-button-pause").click(function(){
        showcase.autoplay.stop();
    });
    $(".swiper-button-play").click(function(){
        showcase.autoplay.start();
    });

    $(window).resize(function(){
        if ( $(window).width() < 1024 ) {
            showcase.autoplay.stop();
        } else {
            showcase.autoplay.start();
        }
    });
    
});


