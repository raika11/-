
$(document).ready(function() {
    $('.dropdown .dropdown_toggle').on('click', function(){
        $(this).parent().toggleClass('open');
    });

    $(window).scroll(function(event){
        /* article mobile sticky_menu */        
        if( $(this).scrollTop() > 0) {
            $('.sticky_menu').addClass('fixed');
        } else {
            $('.sticky_menu').removeClass('fixed');
        }
        /* scroll indicator */
        scrollIndicator();
    });

    /* 화면 크기에 따른 기자 목록 */
    bylineControl(window.innerWidth);
    
    /* list to slider */
    var slickOptions = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots:true,
        arrows:false
    };
    var $slider = $('#slider_div');
    changeToSlider($slider, slickOptions);

    $(window).resize(function(e){
        bylineControl(window.innerWidth);
        /* scroll indicator */
        scrollIndicator();
        /* list to slider */
        changeToSlider($slider, slickOptions);
    })

    /* 기자 더보기(외○명) 클릭 */
    $(".btn_byline_more").click(function(){
        $this = $(this);
        var width = window.innerWidth;
        $this.addClass("active");
        if($this.hasClass("active")){
            $(".byline > a").removeClass("hide");
            $this.addClass("hide");
        }
    });

    /* byline popup close event */
    $(".layer_byline .btn_close").click(function(){
        $(".btn_byline_more").removeClass("active");
        bylineControl(window.innerWidth);
    });
});

/* scroll indicator */
function scrollIndicator(){
    var articleHeight = $(".article").height() - $(".article_footer").height()- window.innerHeight + $("header").height();
    var percentage = ($(window).scrollTop() / articleHeight) * 100;  
    percentage = (percentage > 100 ? 100 : percentage);
    $(".scroll_indicator span").css("width",percentage + "%");
}

/* 화면 크기에 따른 기자 노출 수 조정*/
function bylineControl(width){
    var maxReporterNum = MAX_MEDIUM_REPORTER_NUM;
    if(width >= BREAKPOINT_LARGE){
        maxReporterNum = MAX_LARGE_REPORTER_NUM;   
    }

    var $byline = $(".byline > a");
    var $bylineMore = $(".btn_byline_more");
    var hiddenCount = $byline.length - maxReporterNum;

    $byline.each(function(index, item){
        if(index >= maxReporterNum){
            $(item).addClass("hide");
        } else {
            $(item).removeClass("hide");
            bylineWidth = $(item).outerWidth();
        }
    });

    if(hiddenCount>0){
        $bylineMore.removeClass("hide");
        $bylineMore.find("span").text(hiddenCount)

        if($bylineMore.hasClass("active")){
            $byline.removeClass("hide");
            $bylineMore.addClass("hide");
        } 
    } else {
        $bylineMore.addClass("hide")
    }
}
