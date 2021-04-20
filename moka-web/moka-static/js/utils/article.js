
$(document).ready(function() {
    btnCloseModal();
    /* 스크롤 인디케이터 */
    const scrollIndicator = document.getElementById("scrollIndicator");
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
	$btnCk.parents(".side_popup.active").removeClass("active");
}
function btnCloseModal(){
	$(".btn_close").off().on("click", function(){
        $btnCk= $(this);
		closeLayer($btnCk);
    });
}

