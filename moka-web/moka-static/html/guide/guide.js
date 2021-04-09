$(document).ready( function() {

	// lnb accordian
	$(".accordian a").click(function() {
		$(".accordian ul ul").slideUp();

		if(!$(this).next().is(":visible")) {
			$(this).next().slideDown();
		}
	});


	// 반응형 미리보기 버튼
	$(".btn_view").click(function() {
		var view_width = $(this).attr('data-rel');
		$(this).parents('.sample_wrap').attr('style', `width: ${view_width}`);
		// if (view_width = 0){
			// $(this).parents('.sample_wrap').attr('style', "width:" + view_width + "px;");
			
			// console.log("t1 = " + t1 + ", t2 = " + t2);
			// console.log(`t1 = ${t1}, t2 = ${t2}`);
			// $(this).parents('.sample_wrap').removeAttr("style");
		// } else {
			
		// }
	});
});