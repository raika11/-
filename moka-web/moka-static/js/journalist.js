$(document).ready(function() {
    var swiper_highlight = new Swiper('.swiper-container.swiper_highlight_list', {
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: {
                touchRatio: 0
            },
            1024: {
                touchRatio: 1
            }
        }
    });
    var swiper_highlight_inner = new Swiper('.swiper-container.swiper_highlight_inner', {
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
    
});



