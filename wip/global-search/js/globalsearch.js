var globalSearch = (function() {
    'use strict';

    var globalSearch = {
        myConfig: {
            baseSearchURL: '//ws.htc.com/htc-search-1.1/query/gsa',
            deviceDetectionWSBaseURL: '//rest-b.htc.com/htc-detect-1.0/detect',
            copyrightWSBaseURL: 'https://ws.htc.com/htc-copyright-1.0/',
            defaultProductListWSBaseURL: 'http://dev2-ws.htc.com/htc-content-catalog-2.5/catalog/products?display_type=listing&type=devices&published=true&sort=published_date',
            regionType: 'america',
            site: '',
            resultsPerRequest: 10,
            priority: '',
            supportPath: '',
            q: '',
            regionTitle: '',
            noImagePath: 'img/ltr/gs-no-image.png',
            noImageCssClass: 'no-product-image',
            templateNormal: '<a class="single-result" href="{{link}}"><div class="text-desc"><h3>{{title}}</h3><h4>{{description}}</h4></div></a>',
            templateVideo: '<a class="single-result" href="{{link}}"><div class="video-thumbnail"><img src="{{thumbnail}}"></div><div class="text-desc"><h3>{{title}}</h3><h4>{{description}}</h4></div></a>',
            templateProduct: '<div><a href="{{link}}"><div class="image-container"><img alt="{{title}}" title="{{title}}" class="{{no_image_class}}" src="{{thumbnail}}"></div><h4>{{title}}</h4></a></div>'
        },
        init: function() {
            this.myConfig.site = $('body').data('site');
            this.myConfig.q = decodeURIComponent(url('?q')).replace(/\+/g, ' ');

            $('.result-container.desktop').find('.support-tab').addClass('active');
            this.getUrlParameter();
            this.setupFormValidate();
            this.setupTypeaheadSuggestion();
            this.startSearch();
            this.setupDesktopTabsClick();
            this.setupMobileResultSlider();
            this.setupMobileStickyTab();
        },
        setupTypeaheadSuggestion: function() {
            //typeahead
            var typeAheadToken = []; //for avoiding duplicate suggestions
            var isProductSuggestionRendered = false;
            var isSupportSuggestionRendered = false;
            $('.htc-search-form input[name=q]').typeahead([{
                name: 'product-suggestions',
                limit: 5,
                remote: {
                    url: this.myConfig.baseSearchURL + '/suggest?q=%QUERY&client=products-' + this.myConfig.site,
                    cache: false,
                    dataType: 'jsonp',
                    filter: function(data) {
                        var retval = [];
                        for (var i = 0; i < data.results.length; i++) {
                            if (jQuery.inArray(data.results[i].name, typeAheadToken) === -1) {
                                retval.push({
                                    value: data.results[i].name,
                                    tokens: [data.results[i].name]
                                });
                                typeAheadToken.push(data.results[i].name);
                            }
                        }
                        isProductSuggestionRendered = true;
                        return retval;
                    }
                }
            }, {
                name: 'support-suggestions',
                limit: 5,
                remote: {
                    url: this.myConfig.baseSearchURL + '/suggest?q=%QUERY&client=support-' + this.myConfig.site,
                    cache: false,
                    dataType: 'jsonp',
                    filter: function(data) {
                        var retval = [];
                        for (var i = 0; i < data.results.length; i++) {
                            if (jQuery.inArray(data.results[i].name, typeAheadToken) === -1) {
                                retval.push({
                                    value: data.results[i].name,
                                    tokens: [data.results[i].name]
                                });
                                typeAheadToken.push(data.results[i].name);
                            }
                        }
                        isSupportSuggestionRendered = true;
                        return retval;
                    }
                }
            }]).on('typeahead:selected', function() {
                $('.htc-search-form .submit').trigger('click');
            });
            //re-init duplicate suggestion tracker
            $('.tt-dropdown-menu').on('typeahead:suggestionsRendered', function() {
                if (isProductSuggestionRendered && isSupportSuggestionRendered) {
                    typeAheadToken = [];
                    isProductSuggestionRendered = false;
                    isSupportSuggestionRendered = false;
                }
            });
        },
        getUrlParameter: function() {
            /*https://github.com/websanova/js-url*/
            if (url('?q') !== null) {
                $('.search-query').text(this.myConfig.q);
            }
        },
        setupFormValidate: function() {
            var searchForm = $('.htc-search-form');
            searchForm.validate();
        },
        startSearch: function() {
            //use mustache style syntax for underscoreJS templates instead of default syntax (<%= %>)
            _.templateSettings = {
                interpolate: /\{\{(.+?)\}\}/g
            };

            if (this.myConfig.q.length > 0) {
                this.resultsLoader('products', $('body.search'));
                this.resultsLoader('support', $('body.search'));
                this.resultsLoader('video', $('body.search'));
                this.resultsLoader('blog', $('body.search'));
                this.resultsLoader('more', $('body.search'));
            }
        },
        resultsLoader: function(client, $context) {
            var $loadMoreButton = $('.' + client + '-result-section .show-more-button', $context),
                $noResultDiv = $('.' + client + '-result-section .zero-results-found', $context),
                $container,
                resultTemplate,
                resultCount = 0,
                resultsUrl = this.myConfig.baseSearchURL + '/search?callback=?&output=xml_no_dtd&ie=utf8&oe=utf8&getfields=*&filter=1',
                totalCount, //total count will be determined upon first search response 
                queryParam,
                $bestContainer = $('.best', $context),
                isLoadClick = false;


            if (client === 'products') {
                $container = $('.product-carousel .owl-carousel', $context);
                resultTemplate = _.template(this.myConfig.templateProduct);
                this.myConfig.resultsPerRequest = 25;
            } else if (client === 'support' || client === 'blog' || client === 'more') {
                $container = $('.' + client + '-result-section .result-items', $context);
                resultTemplate = _.template(this.myConfig.templateNormal);
                this.myConfig.resultsPerRequest = 10;

                /*if (this.myConfig.priority.length > 0) {
                    resultsUrl = resultsUrl + '&as_sitesearch=' + this.myConfig.supportPath + '&as_dt=i';
                }*/
            } else {
                $container = $('.' + client + '-result-section .result-items', $context);
                resultTemplate = _.template(this.myConfig.templateVideo);
                this.myConfig.resultsPerRequest = 10;
            }

            String.prototype.trunc = function(n) {
                return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
            };

            function stripHTML(html) {
                var tmp = document.createElement('div');
                tmp.innerHTML = html;
                return tmp.textContent || tmp.innerText;
            }


            function init() {
                $loadMoreButton.unbind('click');
                $loadMoreButton.click(load_click);
                loadResults();
            }

            /**
             * Load More Button Click Handler
             */
            function load_click() {

                if ($loadMoreButton.attr('disabled') === 'disabled') {
                    return;
                } //don't load if currently loading

                if ($loadMoreButton.hasClass('support')) {
                    client = 'support';
                    $container = $('.' + client + '-result-section .result-items', $context);
                    resultTemplate = _.template(globalSearch.myConfig.templateNormal);
                } else if ($loadMoreButton.hasClass('blog')) {
                    client = 'blog';
                    $container = $('.' + client + '-result-section .result-items', $context);
                    resultTemplate = _.template(globalSearch.myConfig.templateNormal);
                } else if ($loadMoreButton.hasClass('more')) {
                    client = 'more';
                    $container = $('.' + client + '-result-section .result-items', $context);
                    resultTemplate = _.template(globalSearch.myConfig.templateNormal);
                } else {
                    client = 'video';
                    $container = $('.' + client + '-result-section .result-items', $context);
                    resultTemplate = _.template(globalSearch.myConfig.templateVideo);
                }

                //increment to next page
                queryParam.start += queryParam.num;
                isLoadClick = true;
                loadResults();
            }

            /**
             * Load Product default list
             */
            function loadDefaultProductList() {
                $('.no-product-result-found-wording').show();
                /**
                 *Load default product list, need Michael provide end-point   
                 **/
                var buildProductCarousel = false;
                queryParam = {
                    'site': globalSearch.myConfig.site
                };

                $.ajax({
                    type: 'GET',
                    url: globalSearch.myConfig.defaultProductListWSBaseURL,
                    data: queryParam,
                    dataType: 'json',
                    jsonp: true,
                    async: true,
                    cache: false,
                    beforeSend: function(evt) {},
                    success: function(data) {
                        //console.log(Object.keys(data.products).length);
                        if (Object.keys(data.products).length > 0) {
                            for (var i = 0; i < data.products.length; i++) {
                                var obj = data.products[i],
                                    noImageClass = '',
                                    thumbnailPath = obj.media.desktop_images[0].product_list_image;
                                if (thumbnailPath === '') {
                                    thumbnailPath = globalSearch.myConfig.noImagePath;
                                    noImageClass = globalSearch.myConfig.noImageCssClass;
                                } else {
                                    //console.log(thumbnailPath);
                                    if (thumbnailPath.indexOf('//') <= 0) {
                                        thumbnailPath = '//www.htc.com' + thumbnailPath;
                                    }
                                }
                                /*jshint validthis:true */
                                var resultObj = {
                                    title: obj.info.product_name,
                                    link: '/' + globalSearch.myConfig.site + '/' + obj.type + '/' + obj.name_id + '/',
                                    linktext: '',
                                    description: '', //get result description
                                    bazaarvoiceid: '',
                                    thumbnail: thumbnailPath,
                                    thumbnail_display: '',
                                    no_image_class: noImageClass
                                };
                                $(resultTemplate(resultObj)).appendTo($container);
                            }
                            buildProductCarousel = true;
                        }

                    },
                    error: function(data) {
                        //console.log('error');
                    },
                    complete: function() {
                        //console.log('complete');
                        if(buildProductCarousel){
                            globalSearch.setupProductCarousel();
                        }
                    }
                });

            }

            /**
             * Load results via AJAX
             */
            function loadResults() {
                /*$loadMoreButton.attr('disabled', 'disabled'); //disable 'load more' button while processing results and awaiting response

                $loadMoreButton.find('.loader').show();
                $loadMoreButton.find('.show-label').hide();*/

                // load product search results
                /*jshint validthis:true */
                queryParam = {
                    'site': 'default_collection',
                    'client': client + '-' + globalSearch.myConfig.site,
                    'q': globalSearch.myConfig.q,
                    'start': resultCount,
                    'num': globalSearch.myConfig.resultsPerRequest
                };

                $.ajax({
                    type: 'GET',
                    url: resultsUrl,
                    data: queryParam,
                    dataType: 'json',
                    jsonp: true,
                    async: true,
                    cache: false,
                    beforeSend: function(evt) {},
                    success: function(data) {
                        try {
                            if (data.GSP.RES && data.GSP.RES.M) {
                                totalCount = parseInt(data.GSP.RES.M, 10);

                                //append results
                                if (data.GSP.RES.R) {
                                    appendResults(data.GSP.RES.R);
                                }

                                //enable button
                                $loadMoreButton.removeAttr('disabled');
                                $loadMoreButton.find('.loader').hide();
                                $loadMoreButton.find('.show-label').show();
                                $loadMoreButton.addClass('show');
                                $loadMoreButton.addClass(client);

                                //console.log('resultCount=' + resultCount + '|totalCount=' + totalCount);

                                if (client === 'products') {
                                    globalSearch.setupProductCarousel();
                                } else {
                                    if (resultCount >= totalCount) {
                                        //done loading results, hide 'more' button
                                        $loadMoreButton.hide();
                                    }
                                }
                            } else {
                                showNoResult();
                            }

                        } catch (err) {
                            //console.log('err');
                            showNoResult();
                        }
                    },
                    error: function(data) {
                        //console.log('error');
                        showNoResult();
                    },
                    complete: function(){

                    }
                });
            }

            function showNoResult() {
                if (client === 'products') {
                    loadDefaultProductList();
                } else {
                    $noResultDiv.show();
                }
            }

            /**
             * loop through results and append each one to the $container
             * @param  {JSONObject} data
             */
            function appendResults(results) {
                var $results = $(results);
                $results.each(function(idx, result) {
                    appendResult(result);
                    resultCount++; //increment current result count
                });
            }

            /**
             * Append Result to $container
             * @param  {JSONObject} result
             */
            function appendResult(result) {
                var resultObj = formatResultObject(result); //get JavaScript object with result data to bind to result template
                $(resultTemplate(resultObj)).appendTo($container); //build result element from template and append to $container
            }

            /**
             * Get a JavaScript object with the result data from XML
             * @param  {JSONObject} result
             * @return {JavaScript}
             */
            function formatResultObject(result) {
                var desc = stripHTML(result.S),
                    noImageClass = '',
                    thumbnailPath = findMeta(result.MT, 'thumbnail');
                if (client === 'support' && result.U.indexOf('/howto/') > 0) {
                    desc = findMeta(result.MT, 'description') ? findMeta(result.MT, 'description') : stripHTML(result.S);
                }

                if (thumbnailPath === '') {
                    thumbnailPath = globalSearch.myConfig.noImagePath;
                    noImageClass = globalSearch.myConfig.noImageCssClass;
                } else {
                    //console.log(thumbnailPath);
                    if (thumbnailPath.indexOf('//') <= 0) {
                        thumbnailPath = '//www.htc.com' + thumbnailPath;
                    }
                }

                return {
                    /*jshint validthis:true */
                    title: stripHTML(result.T).replace(globalSearch.myConfig.regionTitle, ''), //get trimmed result title
                    link: result.U, //get result link
                    linktext: (result.U).trunc(64),
                    description: desc, //get result description
                    bazaarvoiceid: findMeta(result.MT, 'product_bvid'),
                    thumbnail: thumbnailPath,
                    thumbnail_display: findMeta(result.MT, 'thumbnail') ? '' : 'none',
                    no_image_class: noImageClass
                };
            }

            /**
             * Get a JavaScript object with the result data from XML
             * @param  {JSONArray} meta
             * @return {String}
             */
            function findMeta(meta, metaName) {
                var $meta = $(meta);
                var value = '';
                $meta.each(function(idx, obj) {
                    if (obj.N === metaName) {
                        value = obj.V;
                        return; //this is just a loop break
                    }
                });
                return value;
            }

            init();
        },
        setupProductCarousel: function() {
            var owl = $('.owl-carousel');

            owl.owlCarousel({
                items: 6,
                itemsCustom: false,
                itemsDesktop: [1200, 5],
                itemsDesktopSmall: [1000, 4],
                itemsTablet: [720, 3],
                itemsTabletSmall: false,
                itemsMobile: [480, 2],
                singleItem: false,
                itemsScaleUp: false,
                pagination: false,
                navigation: true,
                navigationText: false,
                scrollPerPage: true,
                rewindNav: false,
                afterAction: function() {
                    if (this.itemsAmount > this.visibleItems.length) {
                        $('.owl-next').removeClass('disabled');
                        $('.owl-prev').removeClass('disabled');
                        if (this.currentItem === 0) {
                            $('.owl-prev').addClass('disabled');
                        }
                        if (this.currentItem === this.maximumItem) {
                            $('.owl-next').addClass('disabled');
                        }
                    } else {
                        $('.owl-next').hide();
                        $('.owl-prev').hide();
                    }
                }
            });

            /*FOR IE Browser*/
            $(window).load(function() {
                window.setTimeout(function() {
                    owl.data('owlCarousel').reinit();
                }, 250);
            });
        },
        setupMobileStickyTab: function() {
            $('.result-container.mobile .tabs-block').stick_in_parent({
                bottoming: false
            });
        },
        setupMobileResultSlider: function() {
            /* Tab Navigation */
            $('.result-container.mobile .slicker').slick({
                infinite: false,
                speed: 300,
                slidesToShow: 1,
                slidesToScroll: 1,
                variableWidth: true,
                focusOnSelect: true,
                prevArrow: '<div class="slick-prev"></div>',
                nextArrow: '<div class="slick-next"></div>',
                asNavFor: '.result-container.mobile .search-results-block'
            });

            /*Result slider*/
            $('.result-container.mobile .search-results-block').slick({
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                adaptiveHeight: true,
                asNavFor: '.result-container.mobile .slicker'
            });
        },
        setupDesktopTabsClick: function() {
            var resultContianer = $('.result-container.desktop');
            resultContianer.on('click', '.tab-item', function(event) {
                event.preventDefault();
                /* Act on the event */
                var ob = $(this),
                    client = '';
                if (ob.attr('class').indexOf('support') > 0) {
                    client = 'support';
                } else if (ob.attr('class').indexOf('video') > 0) {
                    client = 'video';
                } else if (ob.attr('class').indexOf('blog') > 0) {
                    client = 'blog';
                } else if (ob.attr('class').indexOf('more') > 0) {
                    client = 'more';
                }

                if (client !== '') {
                    resultContianer.find('.tab-item').removeClass('active');
                    ob.addClass('active');

                    //detect result container


                    resultContianer.find('.result-section').hide();
                    resultContianer.find('.' + client + '-result-section').show();
                }
            });
        }
    };

    return globalSearch;
}());

$(document).ready(function() {
    'use strict';
    globalSearch.init();
});
