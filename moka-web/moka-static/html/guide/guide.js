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
	});

	// 반응형 미리보기 버튼
	$(".btn_view_color").click(function() {
		var view_width = $(this).attr('data-rel');
		$(this).parents('#num_ico').removeClass().addClass(view_width);
		
		// $(this).parents('#num_ico').addClass(view_width);
	});
});