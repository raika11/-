$(document).ready(function() {
    /* 기자 홈 sticky */
    setCustomSticky();
    $(window).scroll(function () {
        setCustomSticky();
    });

    $(window).resize(function () {
        setCustomSticky();
    });
    
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
});

/* 기자 홈 sticky */
function setCustomSticky(stickyHeight){
    var stickyHeight = $(".journalist_header").height() - $(".package_list").height();;

    if ($(window).scrollTop() > stickyHeight) {
        $('.header_reporter_sticky').addClass('sticky_top');
    } else {
        $('.header_reporter_sticky').removeClass('sticky_top');
    }
}
