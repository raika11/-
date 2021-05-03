$(document).ready(function() {
    var swiper_list = new Swiper('.swiper-container.swiper_list', {
        loop: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots:true,
        arrows:false,
        autoplay: {
            delay: 2000,
        },
        pagination : { // 페이징 설정
            el : '.swiper_list .swiper-pagination',
            clickable : true, // 페이징을 클릭하면 해당 영역으로 이동, 필요시 지정해 줘야 기능 작동
        },
    });
    //swiper autoplay start
    $('.swiper_list .swiper-button-play').on('click', function() {
        swiper_list.autoplay.start();
        $('.swiper_list .swiper-button-pause').addClass('active');
        $(this).toggleClass('active');
        return false;
      });
    //swiper autoplay stop
    $('.swiper_list .swiper-button-pause').on('click', function() {
        swiper_list.autoplay.stop();
        $('.swiper_list .swiper-button-play').addClass('active');
        $(this).toggleClass('active');
        return false;
    });
});