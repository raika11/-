$(document).ready( function() {

$(".accordian a").click(function() {
    // alert("1");
	$(".accordian ul ul").slideUp();

	if(!$(this).next().is(":visible")) {
		$(this).next().slideDown();
	}
});

});