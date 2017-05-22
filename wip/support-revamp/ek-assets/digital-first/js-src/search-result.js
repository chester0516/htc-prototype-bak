/*global searchData, tmpl, _ajaxCall, commonSetting, History*/
var selCount = 1;

var searchResult = (function() {
    'use strict';

    var setting = {
        'clsNameHiddenSearchContentType': 'hidden-search-content-type',
        'clsNameHiddenSearchContentTypeDisplay': 'hidden-search-content-type-display',
        'clsNameHiddenSearchProductNameId': 'hidden-search-product-name-id',
        'clsNameHiddenSearchProductNameIdDisplay': 'hidden-search-product-name-id-display'
    };

    var searchResult = {
        init: function() {
            var url = $.url(),
                searchTerm;
            if (typeof url.param('q') !== 'undefined') {
                $('.search-box input').val(url.param('q'));
                searchResult.storeUrlParams();
            } else {
                //resultList.hideLoader();
                location.href += '?q=htc';
            }
        },
        storeUrlParams: function() {
            var url = $.url();
            if (typeof url.param('content_type') !== 'undefined') {
                $('.' + setting.clsNameHiddenSearchContentType).val(url.param('content_type'));
            }
            if (typeof url.param('content_type_display') !== 'undefined') {
                $('.' + setting.clsNameHiddenSearchContentTypeDisplay).val(url.param('content_type_display'));
            }
            if (typeof url.param('product_name_id') !== 'undefined') {
                $('.' + setting.clsNameHiddenSearchProductNameId).val(url.param('product_name_id'));
            }
            if (typeof url.param('product_name_id_display') !== 'undefined') {
                $('.' + setting.clsNameHiddenSearchProductNameIdDisplay).val(url.param('product_name_id_display'));
            }

        },
        scrollToTop: function() {
            $('body').scrollTop(0);
        }

    };

    return searchResult;
}());

var resultList = (function() {
    'use strict';

    var _hiddenQ,
        _hiddenPagination,
        setting = {
            'maxPagintionTotal': 990, //GSA limitation: the value of the num parameter cannot exceed 1,000
            'resultsPerRequest': 10,
            'clsNameGetHelp': 'get-help',
            'clsNameLoader': 'loader-container',
            'clsNameHasResult': 'has-result',
            'clsNameNoResult': 'no-result',
            'clsNameResultContainer': 'search-result-info',
            'clsNamePaginationContainer': 'pagination-container',
            'claNameAmountContaner': 'amount',
            'clsNameHiddenParamQ': 'hidden-param-q',
            'clsNameHiddenParamPagination': 'hidden-param-pagination'
        };

    var resultList = {
        init: function() {

        },

        stripHTML: function(html) {
            var tmp = document.createElement("div");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText;
        },
        showGetHelp: function() {
            $('.' + setting.clsNameGetHelp).addClass('active');
        },
        hideGetHelp: function() {
            $('.' + setting.clsNameGetHelp).removeClass('active');
        },
        showLoader: function() {
            $('.' + setting.clsNameLoader).show();
        },
        hideLoader: function() {
            $('.' + setting.clsNameLoader).hide();
        },
        hasResultSetting: function() {
            $('.' + setting.clsNameHasResult).removeClass('hidden');
            resultList.hideLoader();
        },
        noResultSetting: function() {
            $('.' + setting.clsNameNoResult).removeClass('hidden');
            resultList.hideLoader();
        },
        hideAllWhenAjax: function() {
            $('.' + setting.clsNameHasResult).addClass('hidden');
            $('.' + setting.clsNameNoResult).addClass('hidden');
            resultList.showLoader();
            resultList.clearResult();
        },
        clearResult: function() {
            $('.' + setting.clsNameResultContainer).html('');
        },
        setupAmountSpan: function(totalCount) {
            $('.' + setting.claNameAmountContaner).text(totalCount);
        },
        setupPagination: function(totalCount, pageNumber) {
            if (totalCount > setting.maxPagintionTotal) {
                totalCount = setting.maxPagintionTotal;
            }
            $('.' + setting.clsNamePaginationContainer).pagination({
                dataSource: function(done) {
                    var result = [];
                    for (var i = 1; i <= totalCount; i++) {
                        result.push(i);
                    }
                    done(result);
                },
                pageNumber: parseInt(pageNumber, 10),
                pageRange: 2,
                afterPageOnClick: function(data, pagination) {
                    _hiddenPagination.val(pagination);
                    resultList.pushParams();
                },
                afterPreviousOnClick: function(data, pagination) {
                    _hiddenPagination.val(pagination);
                    resultList.pushParams();
                },
                afterNextOnClick: function(data, pagination) {
                    _hiddenPagination.val(pagination);
                    resultList.pushParams();
                },
                callback: function() {
                    resultList.updatePaginationSize();
                    searchResult.scrollToTop();
                }
            });
        },
        updatePaginationSize: function() {
            var paginationObj = $('.paginationjs');
            if (paginationObj.length > 0) {
                if ($(window).width() <= commonSetting.mobileMaxReserlution()) {
                    paginationObj.addClass('paginationjs-small');
                } else {
                    paginationObj.removeClass('paginationjs-small');
                }
            }
        },
        // search and get json data
        loadResults: function(pageNumber) {

            var ajaxSetting = searchData.setupAjaxCall(pageNumber, setting.resultsPerRequest);
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
                beforeSend: function() {
                    resultList.hideGetHelp();
                    resultList.hideAllWhenAjax();
                },
                success: function(data) {
                    // get responce array
                    var resultListDiv = $('.' + setting.clsNameResultContainer);

                    searchData.buildResultTemplate(data, resultListDiv, function(totalCount) {
                        if (totalCount > 0) {
                            if (totalCount > setting.resultsPerRequest) {
                                // console.log('totalCount = ' + totalCount);
                                // console.log('pageNumber = ' + pageNumber);
                                resultList.setupPagination(totalCount, pageNumber);
                            }
                            resultList.hasResultSetting();
                            resultList.setupAmountSpan(totalCount);
                        } else {
                            resultList.noResultSetting();
                        }
                    });
                    resultList.showGetHelp();
                },
                error: function(responce) {
                    // console.log('error');
                    resultList.noResultSetting();
                }
            });
        },
        //stateUPdate
        initObj: function() {
            _hiddenQ = $('.' + setting.clsNameHiddenParamQ);
            _hiddenPagination = $('.' + setting.clsNameHiddenParamPagination);
        },
        updateHiddenInput: function(callback) {
            var url = $.url(),
                paramQ = url.param('q'),
                paramPagination = url.param('pagination');

            resultList.initObj();

            _hiddenQ.val('');
            //default pagination value = 1;
            _hiddenPagination.val(1);

            if (typeof paramQ !== 'undefined') {
                _hiddenQ.val(paramQ);
                if (typeof paramPagination !== 'undefined') {
                    _hiddenPagination.val(paramPagination);
                }
            }
            //update hidden iputs and then
            callback();
        },
        pushParams: function() {
            var selectedQ = _hiddenQ.val(),
                selectedPagination = _hiddenPagination.val(),
                urlPath = '';
            if (typeof selectedQ !== 'undefined' && selectedQ.length > 0) {
                urlPath += '&q=' + selectedQ;
            }
            if (typeof selectedPagination !== 'undefined' && selectedPagination.length > 0) {
                urlPath += '&pagination=' + selectedPagination;
            }

            if (urlPath.length > 0) {
                urlPath = '?' + urlPath.substring(1, urlPath.length);
            }

            History.pushState({ rand: Math.random(), q: selectedQ, pagination: selectedPagination }, document.title, urlPath);
        },
        restorePageStatus: function(initial) {
            searchResult.init();
            resultList.loadResults(_hiddenPagination.val());
        }
    };

    return resultList;
}());

var filter = (function() {
    'use strict';
    var filter = {
        init: function() {
            $('.filter').find('.btn-filter').click(function() {
                if ($('.btn-filter').parents('.filter-amount-area').hasClass('open')) {
                    $('.btn-filter').parents('.filter-amount-area').removeClass('open');
                } else {
                    $('.btn-filter').parents('.filter-amount-area').addClass('open');
                }
            });
            filter.select();
        },
        setSelectListWidth: function() {
            var tdWidth = 0;
            tdWidth = $('.filter-select').find('.td:nth-of-type(1)').width();
            $('.btn-filter').width(tdWidth);
            $('.filter-list').width($('.filter').width() - $('.btn-filter').width() - 26);
        },
        select: function() {
            var selIndex = 0,
                selCategory = '',
                selValue = '';
            $('.filter-select').find('li').click(function() {
                if (!$(this).hasClass('chosen') && !$(this).parent('ul').find('li.chosen').length) {
                    $(this).parent('ul').find('li').css({ 'cursor': 'default' });
                    $(this).addClass('chosen');
                    selIndex = $(this).index() + 1;
                    selCategory = $(this).parent('ul').attr('class');
                    selValue = $(this).html();
                    var data = {
                        'category': selCategory,
                        "index": selIndex,
                        "value": selValue
                    };
                    $('.filter-list').find('ul').append(tmpl("filter-chosen-list", data));
                    filter.removeSelect(selCount);
                    selCount++;
                }
            });
        },
        removeSelect: function(index) {
            $('.filter-list').find('li:nth-of-type(' + index + ')').click(function() {
                var removeIndex = 0,
                    removeCategory = '';
                removeCategory = $(this).attr('class').split(' ')[0];
                removeIndex = $(this).attr('class').split(' ')[1];
                if (!$('.btn-filter').parents('.filter-amount-area').hasClass('open')) {
                    $('.btn-filter').parents('.filter-amount-area').addClass('open');
                }
                $('.' + removeCategory).find('li:nth-of-type(' + removeIndex + ')').removeClass('chosen');
                $('.' + removeCategory).find('li').css({ 'cursor': 'pointer' });
                $(this).unbind('click');
                $(this).remove();
                selCount--;
            });
        }
    };
    return filter;
}());

$(document).ready(function() {
    'use strict';

});

$(window).resize(function() {
    'use strict';
    resultList.updatePaginationSize();
});

(function(window, undefined) {
    'use strict';
    // Check Location
    if (document.location.protocol === 'file:') {
        alert('The HTML5 History API (and thus History.js) do not work on files, please upload it to a server.');
    }

    resultList.updateHiddenInput(function() {
        resultList.restorePageStatus(true);
    });

    History.Adapter.bind(window, 'statechange', function() { // Note: We are using statechange instead of popstate
        var State = History.getState();

        resultList.updateHiddenInput(function() {
            resultList.restorePageStatus(false);
        });
    });

})(window);