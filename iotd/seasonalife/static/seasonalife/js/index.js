$(function () {
    $('#home-carousel')
        .carousel({
            pause: true,
            interval: false,
        })
        .on('slide.bs.carousel', function (e) {
            var next = $(e.relatedTarget);
            $(this).find('li')
                .removeClass('active')
                .eq(next.index())
                .addClass('active');
        })
        .on('swiperight',function(){
            $(this).carousel('prev');
        })
        .on('swipeleft',function(){
            $(this).carousel('next');
        });

    $('.home-carousel-tab-list > li').on('mouseenter taphold tap', function () {
        $(this).click();
    });

    $('.icon-compare-xs, .hover-floating-sm-up, .providers-icon').on('taphold',function(el){
        classie.toggle(el,'hover');
    });
});