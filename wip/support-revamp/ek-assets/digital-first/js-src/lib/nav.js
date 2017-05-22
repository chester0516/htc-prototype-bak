/*global commonSetting, TweenLite, TimelineMax, TimelineLite, Power2*/
var nav = (function() {
    'use strict';
    var speed = 500,
        easing = 'easeOutCubic';
    var nav = {
        init: function() {
            nav.stopOnSingleContent();
            nav.superCategoryClick();
            nav.subCategoryClick();
        },
        getHeight: function(inputLi) {
            var paddingTop = parseInt(inputLi.css('padding-top').replace('px', ''), 10),
                paddingBottom = parseInt(inputLi.css('padding-bottom').replace('px', ''), 10);
            return inputLi.height() + paddingTop + paddingBottom;
        },
        superCategoryClick: function() {
            $('.nav > li > a').on('click', function() {
                if (typeof $(this).attr('href') === 'undefined') {
                    nav.removeBoldClass();
                    var openedCategory = $('.nav li.selected'),
                        openedMenu = openedCategory.find('.nav-sub'),
                        expandCategory = $(this).parent('li'),
                        expandMenu = $(this).siblings('.nav-sub');
                    if (!expandCategory.hasClass('selected')) {
                        expandMenu.removeClass('no-border');
                        openedCategory.removeClass('selected');
                        expandCategory.addClass('selected');
                        nav.expandSubMenu(expandMenu, openedMenu, function() {
                            nav.closeAllSubCategory();
                        });
                    } else {
                        openedCategory.removeClass('selected');
                        nav.collapseSelf(openedMenu, function() {
                            nav.closeAllSubCategory();
                        });
                    }
                }
            });
        },
        collapseSelf: function(element, callback) {
            var timeLineObj = new TimelineMax({
                onComplete: callback
            });
            timeLineObj.fromTo($(element), 0.5, {
                height: 'auto'
            }, {
                height: 0
            });
            timeLineObj.play();
        },
        expandSubMenu: function(element, opendElement, callback) {
            var timeLineObj = new TimelineLite({
                    onComplete: callback
                }),
                headerHeight = 70,
                expandHeight = 0,
                collapseHeight = 0,
                newPosition = $(element).parent().offset().top;
            //expand
            timeLineObj.add(TweenLite.set($(element), {
                height: "auto"
            }));
            timeLineObj.add(TweenLite.from($(element), 0.4, {
                height: 0
            }));
            //collapse
            if (opendElement) {
                expandHeight = $(element).height();
                collapseHeight = $(opendElement).height();
                if (element.parent('li').index() > opendElement.parent('li').index()) {
                    newPosition = $(element).parent().offset().top + expandHeight - collapseHeight;
                }
                timeLineObj.fromTo($(opendElement), 0.4, {
                    height: 'auto'
                }, {
                    height: 0
                }, '-=0.4');
            }
            //scroll to super category
            // timeLineObj.add(TweenLite.to(window, 0.5, {
            //     scrollTo: {
            //         y: newPosition,
            //         offsetY: headerHeight
            //     }
            // },'-=0.5'));
            // 
            timeLineObj.to(window, 0.5, {
                scrollTo: {
                    y: newPosition,
                    offsetY: headerHeight
                }
            }, '-=0.4');
            //timeLineObj.play();
        },
        closeAllSubCategory: function() {
            $('.nav-sub li').removeClass('selected');
            $('.nav-sub-sub').css({
                'max-height': 0
            });
        },
        subCategoryClick: function() {
            $('.nav-sub > li > a').on('click', function() {
                nav.removeBoldClass();
                var subNani = $(this).siblings('.nav-sub-sub'),
                    parentLi = $(this).parent('li');
                if (!parentLi.hasClass('selected')) {
                    //update parent .nav-sub max-height
                    // $(this).parents('.nav-sub').css({
                    //     'max-height': 3000
                    // });
                    subNani.removeClass('selected');
                    if (subNani.length > 0) {
                        subNani.each(function(index, val) {
                            /* iterate through array or object */
                            var ulHeight = 0;
                            $(this).find('li').each(function() {
                                ulHeight += nav.getHeight($(this));
                            });
                            $(this).css({
                                'max-height': ulHeight
                            });
                        });
                    }
                    $(this).parents('.nav-sub').addClass('no-border');
                    parentLi.addClass('selected');
                } else {
                    subNani.css({
                        'max-height': 0
                    }).removeClass('selected');
                    parentLi.removeClass('selected');
                }
                if ($(this).parents('.nav-sub').find('>li.selected').length < 1) {
                    $(this).parents('.nav-sub').removeClass('no-border');
                }
            });
        },
        scrollAnimate: function(element) {
            setTimeout(function() {
                var offset = $(element).first().offset();
                $("body, html").animate({
                    scrollTop: offset.top - 100
                }, speed);
            }, 1);
            return false;
        },
        removeBoldClass: function() {
            $('.nav a').removeClass('bold');
            // $('.nav ul').removeClass('open');
        },
        removeTopArticleSelected: function() {
            var boldLink = $('.nav > li.selected');
            if (boldLink.length > 0) {
                //remove top artiles super category
                boldLink.first().removeClass('selected');
                boldLink.first().find('a').removeClass('bold');
            }
        },
        stopOnSingleContent: function() {
            var currentUrlPath = $.url().attr('path');
            // console.log('currentUrl=' + currentUrlPath);
            $.each($('.nav li'), function(index, val) {
                /* iterate through array or object */
                var insideLink = $(this).find('a').attr('href');
                // console.log('insideLink = ' + insideLink);
                if (typeof insideLink !== 'undefined') {
                    var insidePath = $.url(insideLink).attr('path');
                    if (insidePath !== '' && currentUrlPath.indexOf(insidePath) > -1) {
                        $(this).parents('ul').addClass('no-border').addClass('open');
                        $(this).addClass('selected');
                        $(this).parents('li').addClass('selected');
                        $(this).parent().siblings().addClass('open');
                        $(this).parents('ul').siblings('a').addClass('bold');
                        $(this).find('a').addClass('bold');
                    }
                }
            });
            if (commonSetting.isMobile() && $('body').hasClass('m-landing-page')) {
                $('.nav li a').removeClass('bold');
                if ($('body').hasClass('product-content-page-init')) {
                    nav.removeTopArticleSelected();
                }
            }
            if ($('body').hasClass('m-content-page')) {
                nav.removeTopArticleSelected();
            }
        }
    };
    return nav;
}());