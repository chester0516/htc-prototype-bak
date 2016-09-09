var earPhone = (function() {
    'use strict';

    var scrollIntoAction = {},
        timeoutObj,
        isComplete = false;
    scrollIntoAction.list = [];
    scrollIntoAction.margin = ~~(($(window).height() / 18) * 4);

    var earPhone = {
        init: function() {
            earPhone.scrollAction();
        },
        scrollAction: function() {
            if (!isComplete) {


                $('.earphone[data-action="animate"]').each(function(i, el) {
                    var p = $(el).parents('section'),
                        y = ~~p.offset().top;
                    scrollIntoAction.list = [];
                    scrollIntoAction.list.push({
                        y: y,
                        offset: ~~(y + p.innerHeight()),
                        type: $(el).data('action'),
                        el: el
                    });
                });

                console.log('scrollIntoAction.list.length=' + scrollIntoAction.list.length);
                var l, top, offset,
                    i = scrollIntoAction.list.length;

                if (i === 0) {
                    return;
                }

                l = scrollIntoAction.list;
                top = $(window).scrollTop();
                offset = top + scrollIntoAction.margin;

                while (i--) {
                    var o = l[i];

                    if (o && (!(o.y > offset || o.offset < top))) {
                        switch (o.type) {
                            case 'animate':
                                $(o.el).addClass('on');
                                break;
                            case 'video':
                                o.el.play();
                                break;
                        }

                        l[i] = null;
                        //COMPLETE
                        console.log('COMPLETE');
                        isComplete = true;
                        earPhone.showHotSpot();
                    } else {
                        console.log('test');
                    }
                }

                i = l.length;

                while (i--) {
                    if (!l[i]) {
                        l.splice(i, 1);
                    }
                }
                console.log('test2');
            }
        },
        onScroll: function() {
            console.log('onScroll');
            clearTimeout(timeoutObj);
            timeoutObj = setTimeout(function() {
                console.log('setTimeout');
                earPhone.scrollAction();
            }, 10);
        },
        showHotSpot: function(){
            var dotBlock = $('.hotspot-block .dot-block');
            dotBlock.addClass('show').hover(function(){
                $(this).parent().toggleClass('hover');
            })
        }
    };

    return earPhone;
}());

$(document).ready(function() {
    'use strict';
    if ($('div.main').hasClass('template_2016')) {
        earPhone.init();
    }
});

$(window).scroll(function(event) {
    'use strict';
    /* Act on the event */
    earPhone.onScroll();
});
