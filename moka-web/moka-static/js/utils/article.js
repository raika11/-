
$(document).ready(function() {
    $('.dropdown .dropdown_toggle').on('click', function(){
        $(this).parent().toggleClass('open');
    });

    btnCloseModal();
    /* 스크롤 인디케이터 */
    const scrollIndicator = document.getElementById("scroll_indicator");
    window.addEventListener("scroll", (e) => {
        // clientHeight : 웹 브라우저 창의 높이
        // scrollTop : 현재 스크롤된 부분의 맨 위의 높이
        // scrollHeight : 문서의 총 높이 (= 스크롤의 총 높이)
        // contentHeight : 전체 총 높이에서 클라이언트 높이를 뺀 것
        
        const { scrollTop, scrollHeight, clientHeight } = e.target.scrollingElement;
        const contentHeight = scrollHeight - clientHeight;
        const percentage = (scrollTop / contentHeight) * 100;

        scrollIndicator.style.transform = `translateX(-${100 - percentage}%)`; // -100% ~ 0%
        scrollIndicator.style.transition = `transform 0.5 ease-out`; // 부드러운 애니메이션
    });

    /* article mobile sticky_menu */
    $(window).scroll(function(){
        var scrollT = $(this).scrollTop();
        var bodyTop = $('.article_body').offset().top;
        var bodyH = $('.article_body').outerHeight(true);
        var bodyBottom = $('.article_body').position().top + $('.article_body').outerHeight(true);
        
        if( scrollT > bodyTop && scrollT < bodyBottom) {
            $('.sticky_menu').addClass('fixed');
        } else {
            $('.sticky_menu').removeClass('fixed');
        }
    });

    /* 화면 크기에 따른 기자 목록 */
    bylineControl(window.innerWidth);
    $(window).resize(function(e){
        bylineControl(window.innerWidth);
    })

    /* 기자 더보기(외○명) 클릭 */
    $(".btn_byline_more").click(function(){
        $this = $(this);
        var width = window.innerWidth;
        $this.addClass("active");
        if($this.hasClass("active")){
            if(width >= BREAKPOINT_LARGE){
                $(".byline > a").removeClass("hide");
                $this.addClass("hide");
            } else {
                setBylinePopPos();
                $(".layer_byline").toggleClass("active");
                
            }
        }
    });

    /* byline popup close event */
    $(".layer_byline .btn_close").click(function(){
        $(".btn_byline_more").removeClass("active");
        bylineControl(window.innerWidth);
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

/* 화면 크기에 따른 기자 노출 수 조정*/
function bylineControl(width){
    var maxReporterNum = MAX_MEDIUM_REPORTER_NUM;
    if(width >= BREAKPOINT_LARGE){
        maxReporterNum = MAX_LARGE_REPORTER_NUM;   
    }

    var $byline = $(".byline > a");
    var $bylineMore = $(".btn_byline_more");
    var $bylinePop = $(".layer_byline");
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
            if(width >= BREAKPOINT_LARGE){
                $byline.removeClass("hide");
                $bylineMore.addClass("hide");
                $bylinePop.removeClass("active");
            } else {
                $bylinePop.addClass("active");
            }
        } 
    } else {
        $bylineMore.addClass("hide")
    }
    setBylinePopPos();
}

/* set byline popup position */
function setBylinePopPos(){
    var $bylinePop = $(".layer_byline");
    var $bylineMore = $(".btn_byline_more");
    var bylinePopleft = $bylineMore.position().left+$bylineMore.width() - $bylinePop.outerWidth() +5;
    $bylinePop.css("left",bylinePopleft+"px");
}