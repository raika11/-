$(function(){
    $(window).scroll(function () {
        if ($(this).scrollTop() > 10) {
            $('.header').addClass('sticky_top');
        } else {
            $('.header').removeClass('sticky_top');
        }
    });
});