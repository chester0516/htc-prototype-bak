// smart search
/*global tmpl, delayKeyup, commonSetting*/
(function($) {
    'use strict';
    /*jquery plugin: delay key up*/
    $.fn.delayKeyup = function(callback, ms) {
        var timer = 0;
        var el = $(this);

        $(this).keyup(function(e) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                callback(el, e);
            }, ms);
        });
        return $(this);
    };

    $.fn.scrollTo = function(elem, speed) {
        // console.log($(elem));
        $(this).animate({
            scrollTop: $(this).scrollTop() - $(this).offset().top + $(elem).offset().top - 20
        }, speed === undefined ? 400 : speed);
        return this;
    };
}(jQuery));

var _ajaxCall;

var searchData = (function() {
    'use strict';
    var setting = {
            'resultsPerRequest': 5,
            'resultPagePath': 'search-result.htm',
            'minSearchWords': '3',
            'clsNameAspDotNetForm': 'support-form',
            'clsNameForm': 'search-box',
            'clsNameInput': 'input-query',
            'clsNameButtonSubmit': 'button-submit',
            'clsNameSuggestionArea': 'smart-search-result-container',
            'clsNameSuggestionList': 'search-result',
            'clsNameCloseBtn': 'close-resulte-container-btn',
            'clsNameHiddenSearchContentType': 'hidden-search-content-type',
            'clsNameHiddenSearchContentTypeDisplay': 'hidden-search-content-type-display',
            'clsNameHiddenSearchProductNameId': 'hidden-search-product-name-id',
            'clsNameHiddenSearchProductNameIdDisplay': 'hidden-search-product-name-id-display'
        },
        init = false;

    var searchData = {
        init: function() {
            //only trigger once
            if (!init && $('.search-box').length > 0) {
                searchData.disableDefaultFromSubmit();
                searchData.detectInputKey();
                searchData.setupSubmit();
                searchData.setupShowAllResultLink();
                searchData.setupCloseResultContainerButton();
                searchData.setupOutOfSearchAreaClick();
                init = true;
            }
        },
        disableDefaultFromSubmit: function() {
            $('.' + setting.clsNameAspDotNetForm).on('submit', function(event) {
                event.preventDefault();
            });
        },
        setupOutOfSearchAreaClick: function() {
            $('body').on('click', function(event) {
                // console.log($(event.target));
                if ($(event.target).hasClass('search-box') ||
                    $(event.target).hasClass('icon-search') ||
                    $(event.target).hasClass('input-query') ||
                    $(event.target).hasClass('smart-search-result-container') ||
                    $(event.target).hasClass('border-area') ||
                    $(event.target).hasClass('show-all-result') ||
                    $(event.target).hasClass('button-submit') ||
                    $(event.target).hasClass('search-result') ||
                    $(event.target).hasClass('search-result-data') ||
                    $(event.target).hasClass('search-data-img') ||
                    $(event.target).hasClass('search-data-info') ||
                    $(event.target).hasClass('search-data-title') ||
                    $(event.target).hasClass('search-data-desc')) {
                    return;
                } else {
                    searchData.hideSuggestionList();
                }
            });
        },
        setupCloseResultContainerButton: function() {
            var closeBtn = $('.' + setting.clsNameCloseBtn);
            closeBtn.bind('click', function() {
                searchData.hideSuggestionList();
            });
        },
        showSuggestionList: function() {
            var resultContainer = $('.' + setting.clsNameSuggestionArea);
            resultContainer.addClass('show');
        },
        hideSuggestionList: function() {
            var resultContainer = $('.' + setting.clsNameSuggestionArea),
                resultList = resultContainer.find('.' + setting.clsNameSuggestionList);
            resultContainer.removeClass('show');
            resultList.html('');
        },
        validateQuery: function() {
            var result = false,
                $input = $('.' + setting.clsNameForm + ' .' + setting.clsNameInput);
            //console.log($input.val());
            if ($input.val().trim().length > 0) {
                result = true;
            }
            return result;
        },
        setupSubmit: function() {
            var $submit = $('.' + setting.clsNameForm + ' .' + setting.clsNameButtonSubmit);
            $submit.on('click', function() {
                searchData.goToResultPage();
            });
        },
        setupShowAllResultLink: function() {
            var $submit = $('.' + setting.clsNameSuggestionArea + ' .' + setting.clsNameButtonSubmit);
            $submit.on('click', function() {
                searchData.goToResultPage();
            });
        },
        detectInputKey: function() {
            var $input = $('.' + setting.clsNameForm + ' .' + setting.clsNameInput);
            $input.off('click').on('click', function() {
                $(this).select();
            });
            // .blur(function() {
            //     searchData.hideSuggestionList();
            // });
            $input.delayKeyup(function(obj, evt) {
                evt = evt || window.event;
                var charCode = evt.which || evt.keyCode;
                var charStr = String.fromCharCode(charCode);
                evt.preventDefault();
                var keyPass = false;

                // console.log('charCode=' + charCode);

                if (!commonSetting.isMobile()) {
                    if (/[a-z0-9]/i.test(charStr) || charCode === 8 || charCode === 32) {
                        /*
                         * Letter or number typed
                         * charCode == 8 --> backspace
                         * charCode == 32 --> space
                         */
                        keyPass = true;
                    }
                } else {
                    keyPass = true;
                }

                if (keyPass) {
                    var term = obj.val(),
                        result,
                        minTerms = setting.minSearchWords;

                    searchData.hideSuggestionList();
                    if (term.length >= minTerms) {
                        // console.log('getJsonData');
                        if ($('.' + setting.clsNameForm).hasClass('show-suggestion-list')) {
                            searchData.getJsonData();
                        }
                    } else {
                        searchData.cancleAjaxCall();
                    }
                }


                searchData.setupDownAndUpKeyEvent(charCode);
            });
        },
        setupDownAndUpKeyEvent: function(keyCode) {
            var hasResult = false,
                resultContainer = $('.' + setting.clsNameSuggestionArea),
                resultList = resultContainer.find('.' + setting.clsNameSuggestionList),
                totalItems = resultList.find('li').length,
                activeCount = resultList.find('li > a.active').length,
                currentIdx,
                nextIdx,
                prevIdx,
                $input = $('.' + setting.clsNameForm + ' .' + setting.clsNameInput);


            // console.log('totalItems=' + totalItems);
            // console.log('activeCount=' + activeCount);

            if (totalItems > 0) {
                hasResult = true;
            }

            /*
             * Enter key
             */
            if (keyCode === 13) {
                // console.log('keyCode=' + keyCode);

                if (hasResult && activeCount > 0) {
                    /*
                     * Go to item link
                     */
                    // console.log('go to howto');
                    location.href = resultList.find('li > a.active').attr('href');
                } else {
                    // console.log('go to search');
                    searchData.goToResultPage();
                }
            }

            /*
             * Downarrow key
             */
            if (keyCode === 40) {
                if (hasResult) {
                    currentIdx = 0;
                    if (activeCount === 0) {
                        nextIdx = 0;
                    } else {
                        currentIdx = resultList.find('li > a.active').parent().index();
                        nextIdx = currentIdx + 1;
                        if (nextIdx === totalItems) {
                            nextIdx = 0;
                        }
                    }
                    // console.log('currentIdx=' + currentIdx);
                    // console.log('nextIdx=' + nextIdx);
                    resultList.find('li > a').removeClass('active');
                    resultList.find('li').eq(nextIdx).children('a').addClass('active');
                    resultList.scrollTo(resultList.find('li > a.active'));

                }
            }
            /*
             * Uparrow key
             */
            if (keyCode === 38) {
                if (hasResult) {
                    currentIdx = 0;
                    if (resultList.find('li > a.active').length === 0) {
                        prevIdx = 0;
                    } else {
                        currentIdx = resultList.find('li > a.active').parent().index();
                        prevIdx = currentIdx - 1;
                        if (prevIdx < 0) {
                            prevIdx = (totalItems - 1);
                        }
                    }
                    // console.log('currentIdx=' + currentIdx);
                    // console.log('prevIdx=' + prevIdx);
                    resultList.find('li > a').removeClass('active');
                    resultList.find('li').eq(prevIdx).children('a').addClass('active');
                    resultList.scrollTo(resultList.find('li > a.active'));
                }
            }
        },
        setupUrlParams: function() {
            var contentType = $('.' + setting.clsNameHiddenSearchContentType),
                contentTypeDisplay = $('.' + setting.clsNameHiddenSearchContentTypeDisplay),
                productNameId = $('.' + setting.clsNameHiddenSearchProductNameId),
                productNameIdDisplay = $('.' + setting.clsNameHiddenSearchProductNameIdDisplay),
                contentTypeParam = '',
                contentTypeDisplayParam = '',
                productNameIdParam = '',
                productNameIdDisplayParam = '';
            // console.log(contentType);
            if (contentType.length > 0 && contentTypeDisplay.length > 0 && contentType.val() !== '' && contentTypeDisplay.val() !== '') {
                contentTypeParam = '&content_type=' + encodeURIComponent(contentType.val());
                contentTypeDisplayParam = '&content_type_display=' + encodeURIComponent(contentTypeDisplay.val());
            }

            if (productNameId.length > 0 && productNameIdDisplay.length > 0 && productNameId.val() !== '' && productNameIdDisplay.val() !== '') {
                productNameIdParam = '&product_name_id=' + encodeURIComponent(productNameId.val());
                productNameIdDisplayParam = '&product_name_id_display=' + encodeURIComponent(productNameIdDisplay.val());
            }

            return contentTypeParam + contentTypeDisplayParam + productNameIdParam + productNameIdDisplayParam;
        },
        goToResultPage: function() {
            if (searchData.validateQuery()) {
                var $input = $('.' + setting.clsNameForm + ' .' + setting.clsNameInput),
                    searchPagePath;

                if (commonSetting.isPrototypeHost()) {
                    searchPagePath = setting.resultPagePath;
                } else {
                    searchPagePath = '/' + $('body').data('site') + '/support/search.aspx';
                }
                location.href = searchPagePath + '?q=' + encodeURIComponent($input.val().trim()) + searchData.setupUrlParams();
            }
        },
        stripHTML: function(html) {
            var tmp = document.createElement('div');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText;
        },
        findMeta: function (meta, metaName) {
            var $meta = $(meta),
                value = '';
            $meta.each(function(idx, obj) {
                if(obj.N === metaName) {
                    value = obj.V;
                    return; //this is just a loop break
                }
            });
            return value;
        },
        cancleAjaxCall: function() {
            if (typeof _ajaxCall !== 'undefined') {
                _ajaxCall.abort();
            }
        },
        setupAjaxCall: function(pageNumber, resultsPerPage) {
            var site = $('body').data('site'),
                siteSearch = '',
                siteSearchHost = '',
                baseSearchURL,
                queryParam,
                startNumber = 0,
                priority = 'support',
                client = 'support',
                clientName = client + '-' + site,
                resultsPerRequest = setting.resultsPerRequest,
                totalCount,
                url = $.url(),
                pid = url.param('p_name'),
                $input = $('.' + setting.clsNameForm + ' .' + setting.clsNameInput),
                q = $input.val(),
                metaFilter = '',
                metaContentType = $('.' + setting.clsNameHiddenSearchContentType),
                metaProductNameId = $('.' + setting.clsNameHiddenSearchProductNameId);

            if (searchData.validateQuery()) {
                if (typeof pageNumber !== 'undefined') {
                    startNumber = (pageNumber - 1) * resultsPerRequest;
                }
                if (typeof resultsPerPage !== 'undefined') {
                    resultsPerRequest = resultsPerPage;
                }
                if (url.attr('host') === 'www.htc.com') {
                    baseSearchURL = '//ws.htc.com/htc-search-1.1/query/gsa/search';
                    siteSearchHost = '//www.htc.com';
                } else {
                    baseSearchURL = '//dev2-ws.htc.com/htc-search-1.1/query/gsa/search';
                    siteSearchHost = '//dev-www.htc.com';
                }

                //Filter meta tags
                //Reference: https://www.google.com/support/enterprise/static/gsa/docs/admin/72/gsa_doc_set/xml_reference/request_format.html#1077756
                // console.log(metaContentType);
                if (typeof metaContentType !== 'undefined' && metaContentType.length > 0 && metaContentType.val() !== '') {
                    metaFilter = 'content_type:' + metaContentType.val();
                }
                if (typeof metaProductNameId !== 'undefined' && metaProductNameId.length > 0 && metaProductNameId.val() !== '') {
                    if (metaFilter !== '') {
                        metaFilter += '.';
                    }
                    metaFilter += 'product_name_id:' + metaProductNameId.val();
                }

                // load product search results
                queryParam = {
                    'output': 'xml_no_dtd',
                    'ie': 'utf8',
                    'oe': 'utf8',
                    'getfields': '*',
                    'filter': 0,
                    'site': 'default_collection',
                    'client': clientName,
                    'q': q,
                    'start': startNumber,
                    'num': resultsPerRequest,
                    'as_dt': 'i',
                    'requiredfields': metaFilter
                };

                var settings = {
                    'baseSearchURL': baseSearchURL,
                    'queryParam': queryParam
                };

                return settings;
            } else {
                return null;
            }
        },
        // search and get json data
        getJsonData: function() {
            var ajaxSetting = searchData.setupAjaxCall();
            //if ajax is calling, cancle it first;
            searchData.cancleAjaxCall();

            //Call ajax
            _ajaxCall = $.ajax({
                type: 'GET',
                url: ajaxSetting.baseSearchURL,
                data: ajaxSetting.queryParam,
                dataType: 'json',
                jsonp: true,
                async: true,
                cache: false,
                success: function(data) {
                    // console.log('success');
                    //get responce array
                    var resultContainer = $('.' + setting.clsNameSuggestionArea),
                        resultListDiv = resultContainer.find('.' + setting.clsNameSuggestionList);

                    searchData.buildResultTemplate(data, resultListDiv, function(totalCount) {
                        if (totalCount > 0) {
                            searchData.showSuggestionList();
                        }
                    });

                },

                error: function(responce) {
                    // console.log('error');
                }
            });
        },
        buildResultTemplate: function(data, appendContainer, callback) {
            // console.log(appendContainer);
            var jArray,
                totalCount = 0,
                tmpIcon = '',
                tmpTitle = '',
                tmpDescrip = '',
                tmpUrl = '';

            if (typeof data.GSP !== 'undefined' && typeof data.GSP.RES !== 'undefined') {
                totalCount = data.GSP.RES.M;

                if (typeof data.GSP.RES.R.length !== 'undefined') {
                    jArray = data.GSP.RES.R;
                    for (var i = 0; i < jArray.length; i++) {
                        tmpIcon = searchData.findMeta(jArray[i].MT, 'content_type');
                        tmpTitle = searchData.stripHTML(jArray[i].T);
                        tmpDescrip = searchData.stripHTML(searchData.findMeta(jArray[i].MT, 'description')) ? searchData.stripHTML(searchData.findMeta(jArray[i].MT, 'description')) : searchData.stripHTML(jArray[i].S);


                        tmpUrl = jArray[i].U;

                        // console.log('tmpIcon=' + tmpIcon);
                        var resultData = {
                            'title': tmpTitle,
                            'desc': tmpDescrip,
                            'url': tmpUrl,
                            'icon': tmpIcon
                        };
                        // show data
                        appendContainer.append(tmpl('search-result-tmp', resultData));
                    }
                } else {
                    var onData = data.GSP.RES.R;
                    tmpIcon = searchData.findMeta(onData.MT, 'content_type');
                    tmpTitle = searchData.stripHTML(onData.T);
                    tmpDescrip = searchData.findMeta(onData.MT, 'description') ? searchData.findMeta(onData.MT, 'description') : searchData.stripHTML(onData.S);
                    tmpUrl = onData.U;

                    // console.log('tmpIcon=' + tmpIcon);
                    var resultOneData = {
                        'title': tmpTitle,
                        'desc': tmpDescrip,
                        'url': tmpUrl,
                        'icon': tmpIcon
                    };
                    // show data
                    appendContainer.append(tmpl('search-result-tmp', resultOneData));
                }
            }

            callback(totalCount);

        }
    };
    return searchData;
}());

$(document).ready(function() {
    'use strict';
    searchData.init();
});
