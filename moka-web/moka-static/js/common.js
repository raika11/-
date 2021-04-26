$(document).ready(function() {

    //header stiky
    if ($(this).scrollTop() > 10) {
        $('.header').addClass('sticky_top');
    }
    $(window).scroll(function () {
        if ($(this).scrollTop() > 10) {
            $('.header').addClass('sticky_top');
        } else {
            $('.header').removeClass('sticky_top');
        }
    });

    //li형 select box
    $(".dropdown_toggle").on("click", function(){
        $(this).parent(".dropdown").toggleClass("open");
    });
    $(".dropdown_item a").on("click", function(){
        $(this).parents().siblings().removeClass("active");
        $(this).parents().addClass("active");
        $(this).parents(".dropdown").toggleClass("open");
    });

    $(document).mouseup(function (e){// 외부영역 클릭 시 팝업 닫기
        var LayerPopup = $(".dropdown");
        if(LayerPopup.has(e.target).length === 0){
            LayerPopup.removeClass("open");
        }
    });




    /****
        * slick  group
        * -----------------------------------------------------
        */
    /* list to slider  */
    var $slider = $('#slider_div');
    changeToSlid($slider);

    $(window).resize(function(e){
        bylineControl(window.innerWidth);
        /* scroll indicator */
        scrollIndicator();
        /* list to slider */
        changeToSlid($slider);
    })
    
});