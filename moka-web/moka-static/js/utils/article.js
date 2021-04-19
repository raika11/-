
$(document).ready(function() {
    btnCloseModal();
});

function openLayer(obj, btn){
	// 이벤트 버블링 방지
	// obj.stopPropagation();
	// (obj.stopPropagation)? obj.stopPropagation () : obj.cancelBubble = true;
	$(obj).addClass("active").focus();
}
function closeLayer($btnCk){
	$btnCk.parents(".layer_popup.active").removeClass("active");
}
function btnCloseModal(){
	$(".btn_close").off().on("click", function(){
        $btnCk= $(this);
		closeLayer($btnCk);
    });
}
