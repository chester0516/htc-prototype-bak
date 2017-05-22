/* global searchData, nav, History, commonSetting */
var carrierPopup = (function() {
    'use strict';
    var _mainPopup,
        _fakeDropdown;
    var carrierPopup = {
        init: function() {
            _mainPopup = $('.carrier-popup');
            _fakeDropdown = $('.carrier-fake-dropdown');
            if (_mainPopup.length > 0 && _fakeDropdown.length > 0) {
                carrierPopup.selectDefault();
                carrierPopup.openPopupWindow();
                carrierPopup.closeBtnClick();
                carrierPopup.popupListClick();
            }
        },
        openPopupWindow: function() {
            _fakeDropdown.click(function() {
                _mainPopup.addClass('show');
                $('body').addClass('support-popup-fixed');
            });
        },
        closeBtnClick: function() {
            _mainPopup.find('.btn-close').click(function() {
                _mainPopup.removeClass('show');
                $('body').removeClass('support-popup-fixed');
            });
        },
        popupListClick: function() {
            var value = '';
            _mainPopup.find('.popup-list > li').click(function() {
                location.href = $(this).data('url');
            });
        },
        selectDefault: function() {
            $.each(_mainPopup.find('.popup-list > li'), function(index, val) {
                /* iterate through array or object */
                if (location.href.indexOf($(this).data('url')) > -1) {
                    _fakeDropdown.text($(this).text());
                    return false;
                }
            });
        }
    };
    return carrierPopup;
}());
var userGuidePopup = (function() {
    'use strict';
    var _mainPopup,
        _fakeDropdown;
    var userGuidePopup = {
        init: function() {
            _mainPopup = $('.user-guide-popup');
            _fakeDropdown = $('.user-guide-fake-dropdown');
            if (_mainPopup.length > 0 && _fakeDropdown.length > 0) {
                userGuidePopup.openPopupWindow();
                userGuidePopup.closeBtnClick();
            }
        },
        openPopupWindow: function() {
            _fakeDropdown.click(function() {
                _mainPopup.addClass('show');
                $('body').addClass('support-popup-fixed');
            });
        },
        closeBtnClick: function() {
            _mainPopup.find('.btn-close').click(function() {
                _mainPopup.removeClass('show');
                $('body').removeClass('support-popup-fixed');
            });
        }
    };
    return userGuidePopup;
}());
var articleList = (function() {
    'use strict';
    var articleList = {
        init: function() {
            articleList.showMoreClick();
        },
        showMoreClick: function() {
            var lists = $('.article-area article'),
                showMoreBtn = $('.btn-show-more-articles');
            if (lists.length > 0 && showMoreBtn.length > 0) {
                showMoreBtn.on('click', function() {
                    $(this).toggleClass('showed');
                    lists.toggleClass('showed');
                    if ($(this).hasClass('showed')) {
                        $(this).find('span').text($(this).data('show-less'));
                    } else {
                        $(this).find('span').text($(this).data('show-more'));
                    }
                });
            }
        }
    };
    return articleList;
}());
var video = (function() {
    'use strict';
    var _showMaxVideo;
    var video = {
        init: function() {
            if ($('.video-area').length > 0) {
                video.resetMaxVideos();
                video.updateDisplayVideoItems();
                video.setupDisplayVideoItems();
                video.videoListInit();
                video.videoMaskInit();
                video.showMoreVideoClick();
                video.trimVideoName();
            }
        },
        trimVideoName: function() {
            //required jquery.dotdotdot.min.js
            $('.video-name').dotdotdot({
                ellipsis: '...',
                wrap: 'word',
                height: 52,
                tolerance: 8
            });
        },
        resetMaxVideos: function() {
            var windowSize = $(window).width();
            if (windowSize > commonSetting.mobileMaxReserlution()) {
                _showMaxVideo = 5;
            } else if (windowSize <= commonSetting.mobileMaxReserlution() && windowSize > 480) {
                _showMaxVideo = 3;
            } else {
                _showMaxVideo = 2;
            }
        },
        updateDisplayVideoItems: function() {
            var showMoreVideoBtn = $('.btn-show-more-video'),
                videoContainer = $('.video-list'),
                videoListItems = $('.video-list li').not('.buffer-item');
            videoContainer.removeClass('show-2-video').removeClass('show-3-video').removeClass('show-5-video');
            videoContainer.addClass('show-' + _showMaxVideo + '-video');
            // console.log('_showMaxVideo=' + _showMaxVideo);
            //Reset
            showMoreVideoBtn.removeClass('showed');
            video.resetShowMoreVideoText($(this));
            $.each(videoListItems, function(index, val) {
                /* iterate through array or object */
                $(this).addClass('hidden');
                if (index < _showMaxVideo) {
                    $(this).removeClass('hidden');
                }
            });
            if (videoListItems.length > _showMaxVideo) {
                showMoreVideoBtn.removeClass('disabled');
            } else {
                showMoreVideoBtn.addClass('disabled');
            }
        },
        setupDisplayVideoItems: function() {
            if (commonSetting.switchResolution()) {
                video.resetMaxVideos();
                video.updateDisplayVideoItems();
            }
        },
        resetShowMoreVideoText: function(targetObj) {
            if ($(targetObj).hasClass('showed')) {
                $(targetObj).find('span').text($(targetObj).data('show-less'));
            } else {
                $(targetObj).find('span').text($(targetObj).data('show-more'));
            }
        },
        showMoreVideoClick: function() {
            $('.btn-show-more-video').off('click').on('click', function() {
                var videoListItems = $('.video-list li').not('.buffer-item');
                $(this).toggleClass('showed');
                video.resetShowMoreVideoText($(this));
                $.each(videoListItems, function(index, val) {
                    /* iterate through array or object */
                    if (index >= _showMaxVideo) {
                        $(this).toggleClass('hidden');
                    }
                });
                if (videoListItems.length > _showMaxVideo) {
                    $(this).removeClass('disabled');
                } else {
                    $(this).addClass('disabled');
                }
            });
        },
        videoMaskInit: function() {
            $('.video-mask').click(function() {
                // deault: the first video is ready to play
                var videoId = $('.video-list').find('li:nth-of-type(1)').attr('id');
                $('iframe').attr('src', 'http://www.youtube.com/embed/' + videoId + '?rel=0&autoplay=1');
                $('.video-iframe').show();
                $(this).addClass('hidden');
                $(this).hide();
            });
        },
        videoListInit: function() {
            var videoId = '';
            $('.video-list').find('li').click(function() {
                if (!$(this).hasClass('play')) {
                    $('li.play').removeClass('play');
                    $(this).addClass('play');
                    videoId = $(this).attr('id');
                    $('.video-iframe').show();
                    $('.video-mask').addClass('hidden');
                    $('iframe').attr('src', 'http://www.youtube.com/embed/' + videoId + '?rel=0&autoplay=1');
                }
            });
        }
    };
    return video;
}());
var ratingArticle = (function() {
    'use strict';
    var _ratingContainer,
        _buttonYes,
        _buttonNo,
        _buttonSubmit,
        _blockQuestion,
        _blockFeedback,
        _blockThankyou,
        _pagetype,
        _targetid,
        _site,
        _siteid,
        _pid,
        _pname,
        _value,
        _sloturl,
        _textareaComment;
    var ratingArticle = {
        init: function() {
            _ratingContainer = $('.rating-container');
            if (typeof _ratingContainer !== 'undefined') {
                _buttonYes = _ratingContainer.find('.btn-yes');
                _buttonNo = _ratingContainer.find('.btn-no');
                _buttonSubmit = _ratingContainer.find('.btn-submit');
                _blockQuestion = _ratingContainer.find('.question-block');
                _blockFeedback = _ratingContainer.find('.feedback-block');
                _blockThankyou = _ratingContainer.find('.thank-you-block');
                _textareaComment = _ratingContainer.find('.txt-comment');
                _pagetype = _ratingContainer.data('type');
                if (_pagetype === 'howto') {
                    _pagetype = "ditahowto";
                }
                _targetid = _ratingContainer.data('id');
                _site = _ratingContainer.data('site');
                _siteid = _ratingContainer.data('siteid');
                _pid = _ratingContainer.data('pid');
                _pname = _ratingContainer.data('pname');
                ratingArticle.buttonYesSetup();
                ratingArticle.buttonNoSetup();
                ratingArticle.buttonSubmitSetup();
            }
        },
        buttonYesSetup: function() {
            _buttonYes.on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                _blockQuestion.addClass('hidden');
                var act = 'up';
                _value = "1";
                _sloturl = '/' + _site + '/support/SupportViewCountAdd.aspx?act=' + act + '&type=' + _pagetype + '&id=' + _targetid + '&siteid=' + _siteid + '&p_id=' + _pid + '&p_name=' + _pname + '&value=' + _value + '&cmt=';
                //console.log(_sloturl);
                $.ajax({
                    url: _sloturl,
                    dataType: 'html',
                    type: 'POST',
                    error: function(response) {
                        _blockThankyou.removeClass('hidden');
                    },
                    success: function(response) {
                        _blockThankyou.removeClass('hidden');
                    }
                });
            });
        },
        buttonNoSetup: function() {
            _buttonNo.on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                _blockQuestion.addClass('hidden');
                setTimeout(function() {
                    _blockFeedback.removeClass('hidden');
                }, 600);
            });
        },
        buttonSubmitSetup: function() {
            _buttonSubmit.on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                var txtFeedback = _textareaComment.val();
                if (txtFeedback.length > 0) {
                    _blockFeedback.addClass('hidden');
                    var act = 'down';
                    _value = "0";
                    _sloturl = '/' + _site + '/support/SupportViewCountAdd.aspx?act=' + act + '&type=' + _pagetype + '&id=' + _targetid + '&siteid=' + _siteid + '&p_id=' + _pid + '&p_name=' + _pname + '&value=' + _value + '&cmt=' + txtFeedback;
                    //console.log(_sloturl);
                    $.ajax({
                        url: _sloturl,
                        dataType: 'html',
                        type: 'POST',
                        error: function(response) {
                            _blockThankyou.removeClass('hidden');
                        },
                        success: function(response) {
                            _blockThankyou.removeClass('hidden');
                        }
                    });
                }
            });
        }
    };
    return ratingArticle;
}());
var singleContentPage = (function() {
    'use strict';
    var singleContentPage = {
        resetTitle: function() {
            if ($('.product-content-page').length > 0 && $('.video-area').length > 0) {
                //hide title in gcm_content
                var cloneTitle = $('.topictitle1').clone().addClass('appendTitle');
                $('.topictitle1').hide();
                $('.video-area').prepend(cloneTitle).addClass('appendToContent');
            }
        }
    };
    return singleContentPage;
}());
var relateContent = (function() {
    'use strict';
    var relateContent = {
        init: function() {
            //Add related article
            var originalRelatedDiv = $('.relinfo');
            var relatedTitle = $('.relatedTitle');
            if (originalRelatedDiv !== null && originalRelatedDiv.length > 0) {
                $('.related-howtos-wrapper').empty();
                $('.related-howtos-wrapper').append(originalRelatedDiv.html());
                $('.related-howtos-wrapper').addClass('show');
                originalRelatedDiv.empty();
                $(".related-links-wrapper").find("strong").html(relatedTitle.html());
            }
        }
    };
    return relateContent;
}());
var productLanding = (function() {
    'use strict';
    var productLanding = {
        init: function() {
            productLanding.scrollToAnchor();
        },
        scrollToAnchor: function() {
            var hashAnchor = $(location).attr('hash'),
                scrollHeight;
            if (hashAnchor !== '') {
                scrollHeight = $(hashAnchor).offset().top - 70;
                $('html,body').animate({
                    scrollTop: scrollHeight
                }, 'slow');
            }
        }
    };
    return productLanding;
}());
$(document).ready(function() {
    'use strict';
    productLanding.init();
    nav.init();
    carrierPopup.init();
    userGuidePopup.init();
    articleList.init();
    ratingArticle.init();
    video.init();
    singleContentPage.resetTitle();
    relateContent.init();
});