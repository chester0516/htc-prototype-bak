
// parallax scroll
$(window).scroll(function(event) {
    var x = $(this).scrollTop();
    $('.parallax-img').css('top',  - parseInt(x/2.5) + 'px');
});
