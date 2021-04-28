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

	// 테마별색상 미리보기 버튼
	$(".btn_view_color").click(function() {
		var view_color = $(this).attr('data-rel');
		$(this).parents('#num_ico').removeClass().addClass(view_color);
	});

	$(".btn_view_drop").click(function() {
		var view_position = $(this).attr('data-rel');
		$(this).parent().next('.dropdown_menu').addClass(view_position);
	});
});