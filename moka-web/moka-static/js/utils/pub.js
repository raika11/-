// JavaScript Document
$(document).ready(function() {

    //li형 select box
    $(".dropdown_toggle").on("click", function(){
		$(this).parent(".dropdown").toggleClass("open");
    });
    $(".dropdown_item a").on("click", function(){
        $(this).parents().siblings().removeClass("active");
        $(this).parents().addClass("active");
		$(this).parents(".dropdown").toggleClass("open");
    });
    

});