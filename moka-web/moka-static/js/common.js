


$(document).ready(function() {

    //header stiky
    if ($(this).scrollTop() > 0) {
        // $('.header').addClass('sticky_top');
        // $('.section_header_wrap').addClass('sticky_top');
    }
    $(window).scroll(function () {
        var headerHeight = $(".section_header_wrap").outerHeight(true);
        // alert(headerHeight);
        if ($(this).scrollTop() > headerHeight) {
            // $('.header').addClass('sticky_top');
            // $('.section_header_wrap').addClass('sticky_top');
            $("body").css("margin-top",headerHeight+"px");
        } else {
            // $('.header').removeClass('sticky_top');
            // $('.section_header_wrap').removeClass('sticky_top');
            $("body").css("margin-top","0px");
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
    
    //레이어팝업 닫기
    btnCloseModal();

    //탭
    if($.tabs){
        $.tabs.init();
    }


    //swiper
    // - mobile 전용
    if($(".scroll_sm_wrap").length > 0){
        mobileSwiper();
    }

        /* datepicker */
    if($("#datepicker").length > 0){
        $( "#datepicker" ).datepicker({
            showOn:'button',
            buttonImageOnly: true,
            
        });
        $('#datepicker').datepicker('setDate', 'today');
    }

    $(".btn_subscribe").on("click", function(){
        alert("111");
        $(this).toggleClass("active");
        
        if($(this).hasClass("active")){
            $(this).text("구독중");
        }
        else {
            $(this).text("구독");
        };
    });

   
});

/* 임시 레이어팝업 */
function toggleOpenLayer(obj){
	$(obj).toggleClass("active");
}

function toggleOpen(obj){
	$(obj).parent().toggleClass("open");
}

function openLayer(obj){
	$(obj).addClass("active");
}

function closeLayer($btnCk){
	$btnCk.parents(".layer_popup.active").removeClass("active");
	$btnCk.parents(".layer_comment.active").removeClass("active");
	$btnCk.parents(".layer_ticker.active").removeClass("active");
}

function btnCloseModal(){
	$(".btn_close").off().on("click", function(){
        $btnCk= $(this);
		closeLayer($btnCk);
    });
}

/* list to slider  */
function changeToSlider($target, slickOptions){
    if(typeof slickOptions === "undefined"){
        slickOptions = {
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots:true,
            arrows:false
        };
    }
    
    $target.not('.slick-initialized').slick(slickOptions);
    if(window.innerWidth >= BREAKPOINT_LARGE) {
        $target.slick('unslick');
    };
}

/* mobile swiper */
function mobileSwiper() {
    var swiper = new Swiper('.scroll_sm_wrap', {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 30,
        // allowTouchMove:true,
        // centeredSlidesBounds: true,
        // freeMode: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: "progressbar",
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },

        breakpoints:{
            768:{
                allowTouchMove:true,
                slidesPerView: 2,
            },
            500:{
                allowTouchMove:true,
                slidesPerView: 1.2,
                spaceBetween: 10,
            },
        }
    });
};