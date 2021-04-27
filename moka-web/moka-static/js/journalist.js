$(document).ready(function() {
    var swiper_highlight = new Swiper('.swiper-container.swiper_highlight_list', {
        autoHeight: true,
        spaceBetween: 1,
        touchRatio: 1,
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpointsInverse: true,
        breakpoints: {
            1024: {
                touchRatio: 0
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

    btnCloseModal();
    
});



