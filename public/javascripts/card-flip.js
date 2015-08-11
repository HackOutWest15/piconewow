$(document).ready(function () {
	popShow();
	$(".flip-container").click(function(e) {
		$(".flipper").toggleClass("is-flipped");
	});
});