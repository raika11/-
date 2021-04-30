$(document).ready(function() {
    var swiper_list = new Swiper('.swiper-container.swiper_list', {
        infinite: true,
        autoHeight: true,
        spaceBetween: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots:true,
        arrows:false,
        autoplay: {
            delay: 2000,
            disableOnInteraction: true // 쓸어 넘기거나 버튼 클릭 시 자동 슬라이드 정지.
        },
    });
});
    