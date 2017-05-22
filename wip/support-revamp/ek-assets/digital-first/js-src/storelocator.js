/*
 * storeLocator v1.4.4 - jQuery Google Maps Store Locator Plugin
 * (c) Copyright 2013, Bjorn Holine (http://www.bjornblog.com)
 * Released under the MIT license
 * Distance calculation function by Chris Pietschmann: http://pietschsoft.com/post/2008/02/01/Calculate-Distance-Between-Geocodes-in-C-and-JavaScript.aspx
 */
//Belle Vue Lady Jamshedji Rd Wanjawadi, Mahim West, Mahim
$(document).ready(function() {
    'use strict';
    //STORE LOCATOR-----------------------------
    if ($('.store-locator-container').length > 0) {
        $('#aspnetForm').bind("keyup keypress", function(e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
                e.preventDefault();
                return false;
            }
        });

        var site = $('body').data('site'),
            defaultUnit = 'm', //=Mile
            showCountrySelecttion = false,
            isMobile = false,
            htcDefaultAddress = '',
            loadMapInBeginning = false;

        if ($('html').hasClass('mobile') || $(window).width() < 720) {
            isMobile = true;
        }

        if ($('#hidden-distance-unit').val() === '1') {
            defaultUnit = 'km';
        }

        // if ($('#hidden-default-location').length > 0) {
        //     htcDefaultAddress = $('#hidden-default-location').val();
        // }

        if (site === 'sea' || site === 'mea-sa' || site === 'mea-en') {
            showCountrySelecttion = true;
        }


        $('#map-container').storeLocator({
            'htcSite': site,
            'htcLoadMapInBeginning': loadMapInBeginning,
            'htcShowCountrySelecttion': showCountrySelecttion,
            'defaultUnit': defaultUnit,
            'isMobile': isMobile,
            'htcDefaultAddress': htcDefaultAddress
        });
    }
    //WHERE TO BUY-----------------------------
    if ($('.where-to-buy-container').length > 0) {
        document.domain = 'htc.com';
        if ($('iframe').length > 0) {
            $('iframe').on('load', function() {
                $(this).height($(this).contents().find("html").height() + 28);
                $('body').animate({
                    scrollTop: '0px'
                });
            });
            $('iframe').attr('src', '/' + $('body').data('site') + '/support/where_to_buy_iframe.aspx');
        }

    }
});

$(window).resize(function() {
    'use strict';
});

(function($) {
    'use strict';
    $.fn.storeLocator = function(options) {

        var settings = $.extend({
            'mapMainContainerDiv': 'map-container',
            'mapListDiv': 'map-loc-list',
            'mapDiv': 'map-area',
            'listMainContainerDiv': 'listview-container',
            'listListDiv': 'view-loc-list',
            'inputID': 'txt-address',
            'addressSubmitInput': 'submit-address',
            'geoIconDiv': 'geo-icon',
            'resetIconDiv': 'reset-icon',
            'switchViewDiv': 'switch-button',
            'showGeoIcon': true,
            'zoomLevel': 17,
            'dataType': 'xml',
            'dataLocation': '/support/storelocator-get.aspx',
            'bounceMarker': true,
            'autoGeocode': true,
            'fullMapStart': false,
            'loading': true,
            'loadingDiv': 'loading-map',
            'infowindowTemplatePath': '/ek-assets/templates/infowindow-description.html',
            'listTemplatePath': '/ek-assets/templates/location-list-description.html',
            'callbackBeforeSend': null,
            'callbackComplete': null,
            'callbackSuccess': null,
            'callbackModalOpen': null,
            'callbackModalClose': null,
            'jsonpCallback': null,
            'prefix': 'storeLocator',
            'htcSite': 'www',
            'htcLoadMapInBeginning': false,
            'htcShowCountrySelecttion': false,
            'htcDefaultAddress': '',
            'htcListDataLocation': '/support/storelocator-get.aspx',
            'htcListviewTemplatePath': '/ek-assets/templates/htc-listview.html',
            'htcPageViewType': 'map', //"map" view or "list" view
            'htcListViewItemPerPage': 12,
            'htcListViewMaxItem': 25,
            'htcMapViewItemPerPage': 25,
            'htcMapViewMaxItem': 25,
            'MapCurrentPage': 0,
            'ListCurrentPage': 0,
            'blankInputAlert': 'The input box was blank.',
            'addressErrorAlert': 'Unable to find address',
            'autoGeocodeErrorAlert': 'Automatic location detection failed. Please fill in your address or zip code.',
            'distanceErrorAlert': 'Whoops, we could not find you. Please check the location you entered or try again.',
            'mileLang': 'MILE',
            'milesLang': 'MILES',
            'kilometerLang': 'KM',
            'kilometersLang': 'KM',
            'htcRcDirections': 'Get Directions',
            'defaultUnit': 'm', //m=mile or km,
            'isMobile': false,
            'firstTimeRun': true
        }, options);

        var htcListViewTeamplate, listTemplate, infowindowTemplate,
            htcLocationList = [],
            htcCountry = [],
            htcStateList = [],
            htcCityList = [],
            htcFisrtTimeSearchClick = true,
            htcFisrtTimeTypeinAddressSearchClick = true,
            searchedAddressLocation;

        //LOAD Store data & Create Google MAP----------------------------------------------------------------
        $.store = {
            load_templates: function() {
                //console.log('$.store load_templates');

                //Infowindows
                $.get(settings.infowindowTemplatePath, function(template) {
                    var source = template;
                    /* global Handlebars */
                    infowindowTemplate = Handlebars.compile(source);
                });
                //Locations list
                $.get(settings.listTemplatePath, function(template) {
                    var source = template;
                    listTemplate = Handlebars.compile(source);

                    //After loading move on to the main script
                    //locator();
                });
            },
            publish: function() {
                var marker;
                var markers = [];
                if (settings.htcPageViewType === 'map') {
                    //Google maps settings
                    var myOptions = {
                        zoom: settings.zoomLevel,
                        /* global google */
                        mapTypeControl: false,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var bounds = new google.maps.LatLngBounds();
                    var map = new google.maps.Map($('#' + settings.mapDiv)[0], myOptions);
                    //Create one infowindow to fill later
                    //var infowindow = new google.maps.InfoWindow();
                    var infoBoxOptions = {
                        disableAutoPan: false,
                        alignBottom: true,
                        maxWidth: 0,
                        boxClass: "custom-infobox",
                        pixelOffset: new google.maps.Size(-81, -35),
                        zIndex: null,
                        boxStyle: {
                            'font-family': 'Avenir-Medium'
                        },
                        closeBoxMargin: "0",
                        //closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
                        infoBoxClearance: new google.maps.Size(1, 1),
                        isHidden: false,
                        pane: "floatPane",
                        enableEventPropagation: false
                    };
                    /* global InfoBox */
                    var infoBox = new InfoBox(infoBoxOptions);

                }

                $(function() {

                    var storeName,
                        storeLat,
                        storeLon,
                        storeAddress1,
                        storeAddress2,
                        storeCity,
                        storeZip,
                        storeState,
                        storePhone,
                        storeWeb,
                        storeCat,
                        storeDistance,
                        storeHours1,
                        storeHours2,
                        storeHours3;

                    var startItemIndex, endItemIndex, itemPrePage, lastItemIndex,
                        currentPage,
                        previousPage = 0,
                        nextPage = 0;

                    if (settings.htcPageViewType === 'map') {
                        itemPrePage = settings.htcMapViewItemPerPage;
                        lastItemIndex = settings.htcMapViewMaxItem;
                        currentPage = settings.MapCurrentPage;
                    } else {
                        itemPrePage = settings.htcListViewItemPerPage;
                        lastItemIndex = settings.htcListViewMaxItem;
                        currentPage = settings.ListCurrentPage;
                    }

                    startItemIndex = currentPage * itemPrePage;
                    endItemIndex = (currentPage + 1) * itemPrePage - 1;

                    previousPage = currentPage - 1;
                    nextPage = currentPage + 1;

                    if (startItemIndex < 0) {
                        startItemIndex = 0;
                    }

                    if (endItemIndex >= htcLocationList.length) {
                        endItemIndex = (htcLocationList.length - 1);
                        nextPage = -1;
                    }

                    if (endItemIndex >= (lastItemIndex - 1)) {
                        endItemIndex = (lastItemIndex - 1);
                        nextPage = -1;
                    }

                    if (settings.htcPageViewType === 'map') {
                        $.controls_page_next.setup(nextPage);
                        $.controls_page_previous.setup(previousPage);
                        $('#' + settings.mapMainContainerDiv).show();
                    } else {
                        //mobile 
                        $.controls_load_more_stores.setup(nextPage);

                        $.controls_list_page_next.setup(nextPage);
                        $.controls_list_page_previous.setup(previousPage);
                        $('#' + settings.listMainContainerDiv).show();

                        if (settings.isMobile) {
                            startItemIndex = 0;
                        }
                    }



                    //console.log('startItemIndex=' + startItemIndex + '&endItemIndex=' + endItemIndex);
                    //Add markers and infowindows loop
                    for (var y = startItemIndex; y <= endItemIndex; y++) {
                        //console.log(y + ' LAT=' + htcLocationList[y][1]);
                        var Lat = htcLocationList[y][1];
                        var Long = htcLocationList[y][2];
                        var point = new google.maps.LatLng(Lat, Long);
                        var idx = y;
                        var locationData = defineLocationData(idx);

                        createMarker(Lat, Long, idx, locationData);

                        if (settings.htcPageViewType === 'map') {
                            //Add pointer to bounds
                            if (settings.fullMapStart === true) {
                                bounds.extend(point);
                            }
                            appendStoreToMapList(locationData);
                        } else {
                            appendStoreToListView(locationData);
                        }
                    }

                    if (settings.htcPageViewType === 'map') {
                        //Center and zoom if no origin or zoom was provided
                        if (settings.fullMapStart === true) {
                            map.fitBounds(bounds);
                        }

                        //Handle clicks from the list
                        $(document).on('click.' + settings.prefix, '#' + settings.mapListDiv + ' > ul > li', function() {
                            var markerId = $(this).data('markerid');
                            var selectedMarker = markers[markerId];
                            var locationData = defineLocationData(markerId);

                            if (typeof selectedMarker !== 'undefined') {
                                map.panTo(selectedMarker.getPosition());
                                var listLoc = 'left';
                                if (settings.bounceMarker === true) {
                                    selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
                                    setTimeout(function() {
                                        selectedMarker.setAnimation(null);
                                        createInfoWindow(selectedMarker, listLoc, markerId, locationData);
                                    }, 700);
                                } else {
                                    createInfoWindow(selectedMarker, listLoc, markerId, locationData);
                                }

                                //Focus on the list
                                $('#' + settings.mapListDiv + ' li').removeClass('list-focus');
                                $('#' + settings.mapListDiv + ' li[data-markerid=' + markerId + ']').addClass('list-focus');
                                // if (markerId !== 0) {
                                //     /* global _gaq */
                                //     // _gaq.push(['_trackEvent', 'store locator', 'click', 'left list index id = ' + markerId]);
                                // }
                            }
                        });


                        //Add the list li background colors
                        $('#' + settings.mapListDiv + ' ul li:even').addClass('even');
                        $('#' + settings.mapListDiv + ' ul li:odd').addClass('odd');
                        $('#' + settings.mapListDiv + ' ul li:last').addClass('last');
                        $('#' + settings.mapListDiv + ' ul li:first').click();
                    }

                    function createMarker(Lat, Long, Idx, locationData) {
                        //console.log('createMarker Idx=' + Idx);
                        var point = new google.maps.LatLng(Lat, Long);
                        var iconBgPosition = 41 * Idx;
                        var pinImage = new google.maps.MarkerImage('http' + (/^https/.test(location.protocol) ? 's' : '') + '://www.htc.com/managed-assets/shared/desktop/where-to-buy/map-icons/sprite-marker.png',
                            new google.maps.Size(38, 36),
                            new google.maps.Point(0, iconBgPosition),
                            new google.maps.Point(2, 22));

                        marker = new google.maps.Marker({
                            position: point,
                            map: map,
                            icon: pinImage,
                            draggable: false
                        });

                        marker.set('id', Idx);
                        markers[Idx] = marker;
                        createInfoWindow(marker, '', Idx, locationData); //<-- required
                    }

                    //Infowindows

                    function createInfoWindow(marker, listLoc, idx, locationData) {
                        //console.log('createInfoWindow');
                        //Set up the infowindow template with the location data
                        var formattedAddress = infowindowTemplate(locationData);
                        //Opens the infowindow when list item is clicked
                        if (listLoc === 'left') {
                            infoBox.setContent(formattedAddress);
                            infoBox.open(map, marker);
                        }
                        //Opens the infowindow when the marker is clicked
                        else {
                            google.maps.event.addListener(marker, 'click', function() {
                                //console.log('marker click');
                                infoBox.setContent(formattedAddress);
                                infoBox.open(map, marker);
                                //Focus on the list
                                $('#' + settings.mapListDiv + ' li').removeClass('list-focus');
                                $('#' + settings.mapListDiv + ' li[data-markerid=' + idx + ']').addClass('list-focus');

                                //Scroll list to selected marker
                                var container = $('#' + settings.mapListDiv),
                                    scrollTo = $('#' + settings.mapListDiv + ' li[data-markerid=' + idx + ']');
                                $('#' + settings.mapListDiv).animate({
                                    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                                });

                                // _gaq.push(['_trackEvent', 'store locator', 'click', 'marker index id = ' + idx]);
                            });
                        }
                    }

                    function appendStoreToListView(locationData) {
                        //Set up the list template with the location data
                        var listHtml = listTemplate(locationData);
                        $('#' + settings.listListDiv + ' ul').append(listHtml);
                    }

                    function appendStoreToMapList(locationData) {
                        //Set up the list template with the location data
                        var listHtml = listTemplate(locationData);
                        $('#' + settings.mapListDiv + ' ul').append(listHtml);
                    }

                    function createLocationVariables(idx) {
                        storeName = htcLocationList[idx][0];
                        storeLat = htcLocationList[idx][1];
                        storeLon = htcLocationList[idx][2];
                        storeAddress1 = htcLocationList[idx][3];
                        storeAddress2 = htcLocationList[idx][4];
                        storeCity = htcLocationList[idx][5];
                        storeState = htcLocationList[idx][6];
                        storeZip = htcLocationList[idx][7];
                        storePhone = htcLocationList[idx][8];
                        storeWeb = htcLocationList[idx][9];
                        storeHours1 = htcLocationList[idx][10];
                        storeHours2 = htcLocationList[idx][11];
                        storeHours3 = htcLocationList[idx][12];
                        storeCat = htcLocationList[idx][13];
                        storeDistance = htcLocationList[idx][14];
                    }

                    //Define the location data for the templates

                    function defineLocationData(idx) {
                        //Set up alpha character
                        //console.log(currentMarker);
                        var markerId = idx;
                        var iconId = idx + 1;
                        createLocationVariables(markerId);

                        //setup distance
                        if (storeDistance !== '') {
                            var singularLang = settings.mileLang,
                                pluralLang = settings.milesLang;
                            //console.log(settings.defaultUnit);
                            if (settings.defaultUnit !== 'm') {
                                storeDistance = storeDistance * 1.6093;
                                singularLang = settings.kilometerLang;
                                pluralLang = settings.kilometersLang;
                            }

                            storeDistance = Math.round(storeDistance * 10) / 10;

                            if (storeDistance >= 1) {
                                storeDistance += ' ' + pluralLang;
                            } else {
                                storeDistance += ' ' + singularLang;
                            }
                        }


                        var locations = {
                            location: [{
                                'markerid': markerId,
                                'marker': markerId,
                                'iconId': iconId,
                                'name': storeName,
                                'address': storeAddress1,
                                'address2': storeAddress2,
                                'phone': storePhone,
                                'web': storeWeb,
                                'hours1': storeHours1,
                                'hours2': storeHours2,
                                'hours3': storeHours3,
                                'searchedAddressLocation': searchedAddressLocation,
                                'lat': storeLat,
                                'lon': storeLon,
                                'direction': settings.htcRcDirections,
                                'distance': storeDistance
                            }]
                        };

                        return locations;
                    }

                });
            },
            filter: function(type) { //noStartPoint or has StartPoint
                //console.log('$.store filter');
                //clear htcLocationList
                htcLocationList = [];
                settings.MapCurrentPage = 0;
                settings.ListCurrentPage = 0;
                searchedAddressLocation = "";

                var requestUrl = settings.htcListDataLocation,
                    countryId = $('#hidden-country-id').val(),
                    country3166code = $('#hidden-country-3166-code').val();
                if (type === 'noStartPoint') {
                    requestUrl += '?type=list&country=' + countryId;
                    callStoreAjax(requestUrl);
                } else {
                    var $addressTextBox = $('#' + settings.inputID),
                        address;

                    if (settings.firstTimeRun === true && settings.htcDefaultAddress !== '') {
                        address = settings.htcDefaultAddress;
                        settings.firstTimeRun = false;
                    } else {
                        address = $addressTextBox.val();
                    }


                    var g = new GoogleGeocode();
                    g.geocode(address, country3166code, function(data) {
                        //console.log('g.geocode=' + data);
                        if (data !== null) {
                            var Lng, Lat;
                            Lat = data.latitude;
                            Lng = data.longitude;

                            var url = $.url();
                            if (url.param('q') == 'r') {
                                requestUrl += '?q=r&type=map&country=' + countryId + '&lng=' + Lng + '&lat=' + Lat;
                            }
                            else {
                                requestUrl += '?type=map&country=' + countryId + '&lng=' + Lng + '&lat=' + Lat;
                            }
                            searchedAddressLocation = Lat + ',' + Lng;
                            callStoreAjax(requestUrl);
                        } else {
                            //setup default address search
                            requestUrl += '?type=map&country=' + countryId + '&address=' + encodeURIComponent(address) + '&country3166code=' + country3166code;
                            searchedAddressLocation = encodeURIComponent(address);
                        }
                    });
                }

                function callStoreAjax(requestUrl) {
                    $.ajax({
                        type: 'GET',
                        url: requestUrl,
                        dataType: settings.dataType,
                        jsonpCallback: (settings.dataType === 'jsonp' ? settings.jsonpCallback : null),
                        beforeSend: function() {
                            // Callback
                            if (settings.callbackBeforeSend) {
                                settings.callbackBeforeSend.call(this);
                            }

                            //Loading
                            //if (settings.loading === true) {
                            //$('#' + settings.formContainerDiv).append('<div id="' + settings.loadingDiv + '"><\/div>');
                            //}
                        },
                        complete: function(event, request, options) {
                            // Callback
                            if (settings.callbackComplete) {
                                settings.callbackComplete.call(this, event, request, options);
                            }
                            //Loading remove
                            //if (settings.loading === true) {
                            //$('#' + settings.loadingDiv).remove();
                            //}

                            $.store.publish();
                        },
                        success: function(data, xhr, options) {
                            //Process XML
                            //console.log('success');
                            var stateValue = $('#hidden-state').val();
                            var cityValue = $('#hidden-city').val();

                            if (settings.dataType === 'xml') {
                                var i = 0;
                                $(data).find('marker').each(function() {
                                    var name = $(this).attr('name'),
                                        lat = $(this).attr('lat'),
                                        lng = $(this).attr('lng'),
                                        address = $(this).attr('address'),
                                        address2 = $(this).attr('address2'),
                                        city = $(this).attr('city'),
                                        state = $(this).attr('state'),
                                        postal = $(this).attr('postal'),
                                        phone = $(this).attr('phone'),
                                        web = $(this).attr('web').replace('http://', '').replace('https://', ''),
                                        hours1 = $(this).attr('hours1'),
                                        hours2 = $(this).attr('hours2'),
                                        hours3 = $(this).attr('hours3'),
                                        category = $(this).attr('category'),
                                        distance = $(this).attr('distance');

                                    htcLocationList[i] = [name, lat, lng, address, address2, city, state, postal, phone, web, hours1, hours2, hours3, category, distance];
                                    i++;
                                });
                            }
                        }
                    });
                }

                //Geocode function for the origin location

                function GoogleGeocode() {
                    var geocoder = new google.maps.Geocoder();
                    this.geocode = function(address, site, callbackFunction) {
                        //console.log(address);
                        geocoder.geocode({
                            'address': address,
                            'componentRestrictions': {
                                'country': site
                            }
                        }, function(results, status) {
                            //console.log(status);
                            if (status === google.maps.GeocoderStatus.OK) {
                                var result = {};
                                result.latitude = results[0].geometry.location.lat();
                                result.longitude = results[0].geometry.location.lng();
                                //console.log('GoogleGeocode get Lat & Long');
                                callbackFunction(result);
                            } else {
                                //alert(settings.geocodeErrorAlert + status);
                                callbackFunction(null);
                            }
                        });
                    };
                }
            }
        };
        $.controls_country = {
            load: function() {
                var i = 0;
                $.ajax({
                    type: 'GET',
                    url: settings.htcListDataLocation + '?type=country',
                    dataType: settings.dataType,
                    jsonpCallback: (settings.dataType === 'jsonp' ? settings.jsonpCallback : null),
                    beforeSend: function() {
                        // Callback
                    },
                    success: function(data, xhr, options) {
                        //Process XML
                        if (settings.dataType === 'xml') {
                            $(data).find('marker').each(function() {
                                var c_id = $(this).attr('c_id');
                                var common_name = $(this).attr('common_name');
                                var site = $(this).attr('site');
                                var state = $(this).attr('state');
                                var city = $(this).attr('city');
                                var country3166code = $(this).attr('country3166code');
                                var DistanceUnit = $(this).attr('DistanceUnit');
                                var DefaultLocation = $(this).attr('DefaultLocation');
                                var ShowMapSwitch = $(this).attr('ShowMapSwitch');

                                htcCountry[i] = [c_id, common_name, site, state, city, country3166code, DistanceUnit, DefaultLocation, ShowMapSwitch];
                                i++;
                            });
                        }
                    },
                    complete: function(event, request, options) {
                        // Callback
                        $.controls_country.bind();
                    },
                });
            },
            bind: function() {
                //console.log('$.controls_country.bind');
                if (htcCountry.length > 0) {
                    if (settings.htcShowCountrySelecttion) {
                        //show country selection , ex:sea site
                        $.controls_country.showup();
                    }
                } else {
                    alert(settings.distanceErrorAlert);
                }
            },
            showup: function() {
                if (htcCountry.length > 0) {
                    var options = [];
                    for (var i = 0; i < htcCountry.length; i++) {
                        //console.log(htcCountry[i][1]);
                        options.push('<option data-showmapswitch="' + htcCountry[i][8] + '" data-defaultlocation="' + htcCountry[i][7] + '" data-distanceunit="' + htcCountry[i][6] + '" data-country3166code="' + htcCountry[i][5] + '" value="' + htcCountry[i][0] + '">' + htcCountry[i][1] + '</option>');
                    }
                    $('#country-filter').append(options);
                    $('#country-filter').on('change', function(event) {
                        var countryId = $(this).find('option:selected').val();
                        var country3166code = $(this).find('option:selected').data('country3166code');
                        var DistanceUnit = $(this).find('option:selected').data('distanceunit');
                        var DefaultLocation = $(this).find('option:selected').data('defaultlocation');
                        var ShowMapSwitch = $(this).find('option:selected').data('showmapswitch');
                        // console.log(countryId);
                        if (countryId !== '0') {
                            $('#hidden-country-id').val(countryId);
                            $('#hidden-country-3166-code').val(country3166code);
                            $('#hidden-distance-unit').val(DistanceUnit);
                            $('#hidden-default-location').val(DefaultLocation);
                            if (DistanceUnit === '1') {
                                settings.defaultUnit = 'km';
                            } else {
                                settings.defaultUnit = 'm';
                            }
                            settings.htcDefaultAddress = DefaultLocation;
                            $('.address-field.country-selection-only').removeClass('show');
                            $('.address-field.normal-selection-only').addClass('show');
                            $(this).parents('.country-selection-only').addClass('arrow-down');
                        }else{
                            $('.address-field.country-selection-only').addClass('show');
                            $('.address-field.normal-selection-only').removeClass('show');
                            $(this).parents('.country-selection-only').removeClass('arrow-down');
                        }

                    });
                    $('.country-container').show();
                }
            },
            setup: function() {
                $.controls_country.load();
            }
        };
        $.controls_switch_view = {
            init: function() {
                $('.' + settings.switchViewDiv).on('click', function(event) {
                    event.preventDefault();
                    $('.' + settings.switchViewDiv).toggleClass('active');
                    if ($('.' + settings.switchViewDiv + '.list-view').hasClass('active')) {
                        // console.log('list-view');
                        $('.result-container').addClass('auto-height');
                        $('#' + settings.mapMainContainerDiv).hide();
                        $('#' + settings.listMainContainerDiv).show();
                        settings.htcPageViewType = "list";
                        // _gaq.push(['_trackEvent', 'store locator', 'click', 'switch to list view']);
                    } else {
                        // console.log('map-view');
                        $('.result-container').removeClass('auto-height');
                        $('#' + settings.mapMainContainerDiv).show();
                        $('#' + settings.listMainContainerDiv).hide();
                        settings.htcPageViewType = "map";
                        // _gaq.push(['_trackEvent', 'store locator', 'click', 'switch to map view']);
                    }
                    $('#' + settings.mapListDiv + ' ul').empty();
                    $('#' + settings.listListDiv + ' ul').empty();
                    $.store.publish();


                });
            }
        };
        $.controls_address = {
            init: function() {
                var $addressTextBox = $('#' + settings.inputID),
                    $resetIcon = $('.' + settings.resetIconDiv),
                    $geoIcon = $('.' + settings.geoIconDiv);

                $resetIcon.on('click', function(event) {
                    event.preventDefault();
                    $addressTextBox.val('');
                    if (settings.showGeoIcon) {
                        $geoIcon.show();
                    }
                    $resetIcon.hide();
                    // _gaq.push(['_trackEvent', 'store locator', 'click', 'resetIcon']);
                });

                $geoIcon.on('click', function(event) {
                    event.preventDefault();
                    getSearchedAddressLocation();
                    // _gaq.push(['_trackEvent', 'store locator', 'click', 'geoIcon']);
                });

                if ($('html').hasClass('lt-ie8') || $('html').hasClass('ie8')) {
                    $addressTextBox.focus(function(event) {
                        /* Act on the event */
                        if ($(this).val().length > 0) {
                            $geoIcon.hide();
                            $resetIcon.show();
                        }
                    });

                    $addressTextBox.on('change', function(event) {
                        if ($(this).val().length > 0) {
                            $geoIcon.hide();
                            $resetIcon.show();
                        } else {
                            if (settings.showGeoIcon) {
                                $geoIcon.show();
                            }
                            $resetIcon.hide();
                        }
                    });
                } else {
                    $addressTextBox.on('input', function(event) {
                        event.preventDefault();

                        if ($(this).val().length > 0) {
                            $geoIcon.hide();
                            $resetIcon.show();
                        } else {
                            if (settings.showGeoIcon) {
                                $geoIcon.show();
                            }
                            $resetIcon.hide();
                        }
                    });
                }

                $addressTextBox.on('keydown', function(event) {
                    //event.preventDefault();
                    /* Act on the event */
                    if (event.keyCode === 13) {
                        // if (settings.isMobile) {
                        // }
                        this.blur();
                        $('#' + settings.addressSubmitInput).click();
                        // _gaq.push(['_trackEvent', 'store locator', 'click', 'enter key']);
                    }
                });

                function getSearchedAddressLocation() {
                    if (settings.autoGeocode === true) {
                        //console.log('click');
                        if (navigator.geolocation) {
                            //console.log(navigator.geolocation);
                            navigator.geolocation.getCurrentPosition(autoGeocode_query, autoGeocode_error);
                        }
                    }
                }

                function autoGeocode_query(position) {
                    //console.log(position);
                    if (position !== null) {
                        searchedAddressLocation = position.coords.latitude + ',' + position.coords.longitude;
                    } else {
                        //Unable to geocode
                        searchedAddressLocation = '';
                    }

                    //Setup browser address to address textbox
                    if (searchedAddressLocation !== '') {
                        //console.log('log:Setup browser address to address textbox');
                        var r = new ReverseGoogleGeocode();
                        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        r.geocode(latlng, function(data) {
                            if (data !== null) {
                                var originAddress = data.address;
                                //setup address
                                $('#' + settings.inputID).val(originAddress);
                                //console.log('originAddress=' + originAddress);
                            }
                        });
                    }
                }

                function autoGeocode_error(error) {
                    //console.log(error);
                    alert(settings.autoGeocodeErrorAlert);
                    //$('.' + settings.geoIconDiv).hide();
                    //settings.showGeoIcon = false;
                    //If automatic detection doesn't work show an error
                    searchedAddressLocation = '';
                }

                //Reverse geocode to get address for automatic options needed for directions link

                function ReverseGoogleGeocode() {
                    var geocoder = new google.maps.Geocoder();
                    this.geocode = function(latlng, callbackFunction) {
                        geocoder.geocode({
                            'latLng': latlng
                        }, function(results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    var result = {};
                                    result.address = results[0].formatted_address;
                                    callbackFunction(result);
                                }
                            } else {
                                //alert(settings.geocodeErrorAlert + status);
                                alert(settings.autoGeocodeErrorAlert);
                                callbackFunction(null);
                            }
                        });
                    };
                }
            }
        };
        $.controls_address_submit = {
            init: function() {
                var previousSearch = '',
                    $addressSubmit = $('#' + settings.addressSubmitInput),
                    $addressTextBox = $('#' + settings.inputID);
                $addressSubmit.on('click', function(event) {
                    event.preventDefault();
                    /* Act on the event */
                    if ($addressTextBox.val().trim().length > 0 && $addressTextBox.val() !== $addressTextBox.data('default') && $addressTextBox.val() !== previousSearch) {
                        //console.log('Addess Submit');
                        //Setup address to near-location div
                        htcFisrtTimeTypeinAddressSearchClick = false;
                        $('.near-address').text($addressTextBox.val());
                        $.store.filter('hasStartPoint');
                        $.page_style.reset();
                        // _gaq.push(['_trackEvent', 'store locator', 'search', $addressTextBox.val()]);
                    }
                });
            }
        };
        $.controls_load_more_stores = {
            setup: function(index) {
                var $loadMore = $('.load-more-stores');
                $loadMore.addClass('disable');
                $loadMore.unbind('click');
                if (index > 0) {
                    $loadMore.on('click', function(event) {
                        event.preventDefault();
                        settings.ListCurrentPage = index;
                        $('#' + settings.listListDiv + ' ul').empty();
                        $.store.publish();
                        // _gaq.push(['_trackEvent', 'store locator', 'click', 'load more']);
                    });
                    $loadMore.removeClass('disable');
                }
            }
        };
        $.controls_page_next = {
            setup: function(index) {
                var $pageNext = $('.next-btn');
                $pageNext.addClass('disable');
                $pageNext.unbind('click');
                if (index > 0) {
                    $pageNext.on('click', function(event) {
                        event.preventDefault();
                        settings.MapCurrentPage = index;
                        $('#' + settings.mapListDiv + ' ul').empty();
                        $.store.publish();
                    });
                    $pageNext.removeClass('disable');
                }
            }
        };
        $.controls_page_previous = {
            setup: function(index) {
                var $pagePrevious = $('.previous-btn');
                $pagePrevious.addClass('disable');
                $pagePrevious.unbind('click');
                if (index >= 0) {
                    $pagePrevious.on('click', function(event) {
                        event.preventDefault();
                        settings.MapCurrentPage = index;
                        $('#' + settings.mapListDiv + ' ul').empty();
                        $.store.publish();
                    });
                    $pagePrevious.removeClass('disable');
                }
            }
        };
        $.controls_list_page_next = {
            setup: function(index) {
                var $pageNext = $('.list-next-btn');
                $pageNext.addClass('disable');
                $pageNext.unbind('click');
                if (index > 0) {
                    $pageNext.on('click', function(event) {
                        event.preventDefault();
                        settings.ListCurrentPage = index;
                        $('#' + settings.listListDiv + ' ul').empty();
                        $.store.publish();
                        // _gaq.push(['_trackEvent', 'store locator', 'click', 'list next page index =' + index]);
                    });
                    $pageNext.removeClass('disable');
                }
            }
        };
        $.controls_list_page_previous = {
            setup: function(index) {
                var $pagePrevious = $('.list-previous-btn');
                $pagePrevious.addClass('disable');
                $pagePrevious.unbind('click');
                if (index >= 0) {
                    $pagePrevious.on('click', function(event) {
                        event.preventDefault();
                        settings.ListCurrentPage = index;
                        $('#' + settings.listListDiv + ' ul').empty();
                        $.store.publish();
                        // _gaq.push(['_trackEvent', 'store locator', 'click', 'list previous page index =' + index]);
                    });
                    $pagePrevious.removeClass('disable');
                }
            }
        };
        $.page_style = {
            reset: function() {
                //console.log('htcFisrtTimeTypeinAddressSearchClick=' + htcFisrtTimeTypeinAddressSearchClick);
                //console.log('htcLoadMapInBeginning=' + settings.htcLoadMapInBeginning);
                
                if (htcFisrtTimeTypeinAddressSearchClick && !settings.htcLoadMapInBeginning) {
                    $('.normal-selection-only').addClass('show');
                    $('.default-information-container').show();
                    $('.store-locator-container').addClass('show-bg');
                    $('body').addClass('expand-address-search-box');
                } else {
                    $('.default-information-container').hide();
                    $('.store-locator-container').removeClass('show-bg');
                    $('body').removeClass('expand-address-search-box');
                    $('.result-container').show();
                    $('#' + settings.mapDiv).remove();
                    $('#' + settings.mapMainContainerDiv).append('<div id="' + settings.mapDiv + '"></div>');
                    $('#' + settings.mapListDiv + ' ul').empty();
                    $('#' + settings.listListDiv + ' ul').empty();
                    settings.MapCurrentPage = 0;
                    settings.ListCurrentPage = 0;
                }

            },
            showCountrySelectionLayout: function() {
                $('.country-selection-only').addClass('show');
                $('.default-information-container').show();
                $('.store-locator-container').addClass('show-bg');
            },
            init: function() {
                if (settings.isMobile) {
                    settings.htcMapViewItemPerPage = 20;
                    settings.htcMapViewMaxItem = 20;
                }
                if (settings.htcShowCountrySelecttion) {
                    $.page_style.showCountrySelectionLayout();
                    $.controls_country.setup();
                } else {
                    $.page_style.reset();
                    if (settings.htcLoadMapInBeginning) {
                        if (settings.htcDefaultAddress !== '') {
                            $.store.filter('hasStartPoint');
                        } else {
                            $.store.filter('noStartPoint');
                        }
                    }
                }

                $('.help-field').addClass('show');

                if (settings.isMobile) {
                    setTimeout(function() {
                        $('body').animate({
                            scrollTop: '148px'
                        });
                    }, 2000);
                }
            }
        };

        return this.each(function() {
            settings.dataLocation = '/' + settings.htcSite + settings.dataLocation;
            settings.htcListDataLocation = '/' + settings.htcSite + settings.htcListDataLocation;

            //Start here------------------------!!!!!!
            $.store.load_templates();
            $.page_style.init();
            //---------------------------
            //setup RCs
            settings.htcRcDirections = $('#hidden-rc-htcRcDirections').val();
            settings.mileLang = $('#hidden-rc-mileLang').val();
            settings.milesLang = $('#hidden-rc-milesLang').val();
            settings.kilometerLang = $('#hidden-rc-kilometerLang').val();
            settings.kilometersLang = $('#hidden-rc-kilometersLang').val();
            settings.distanceErrorAlert = $('#hidden-rc-distanceErrorAlert').val();
            settings.autoGeocodeErrorAlert = $('#hidden-rc-autoGeocodeErrorAlert').val();
            settings.addressErrorAlert = $('#hidden-rc-addressErrorAlert').val();
            settings.blankInputAlert = $('#hidden-rc-blankInputAlert').val();

            var $listNextBtn = $('.list-next-btn'),
                $listPreviousBtn = $('.list-previous-btn');
            $listNextBtn.text($listNextBtn.text().replace('{0}', settings.htcListViewItemPerPage));
            $listPreviousBtn.text($listPreviousBtn.text().replace('{0}', settings.htcListViewItemPerPage));


            //Init controls
            $.controls_address.init();
            $.controls_address_submit.init();
            $.controls_switch_view.init();

        });
    };
})(jQuery);
