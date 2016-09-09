/* Filename: subscription.js
 * Description: This is used for HTC email subscription form submission.
 */

$(document).ready(function($) {
    var app_version = $('header').data('app-version'),
        path = location.hostname,
        needMinified = (path.indexOf('local') >= 0 || (typeof app_version === 'undefined') || (app_version == undefined) ) ? '': '.min',
        versionPath = (path.indexOf('local') >= 0 || (typeof app_version === 'undefined') || (app_version == undefined) ) ? '': '/v'+ app_version;

    // import formUtils
    $('html head').prepend( '<script src="/assets/layout/js'+ versionPath +'/formUtils'+ needMinified +'.js" type="text/javascript" async></script>' );
});

function openNewsletter() {
  $('.newsletter').animate({ height: 120 }, 200, function() {
    $('.newsletter').find('.customer').show();
    $('.newsletter').find('.privacy').show();
		$(".newsletter").find('.customer input').attr('required','required');
  });
}

function closeNewsletter() {
  $('.newsletter').find('.privacy').hide();
  $('.newsletter').find('.customer').hide();
	$(".newsletter").find('.customer input').removeAttr('required','required');
  $('.newsletter').animate({ height: 50 }, 200, function() {
    $('.newsletter .button input').removeClass('active');
    $('.newsletter .button input').addClass('active');
  });
}


/**
 * SITE WIDE INTERACTIONS
 */

var Site = (function($) {

  // constructor
  var module = function () {

    var self = this;

	module.prototype.emailAddPDP = '';


/* IT :: comment for now  [NOT USED ?]
    // init mobile menu behavior
    $('header .nav').watch('display', function() {
    	// refresh page		
		if( $('html').hasClass('textshadow')) { //exclude older versions of IE
	        if(!$('body').hasClass('support')){
	          location.reload();
	        }else{
	          if($('html').hasClass('desktop')){
	            location.reload();
	          }
	        }
		};
    	// when transitioning both ways
    	closeMobileNavigation(); // close side menu
    	if ($('.hamburger').css('display') == 'none') { // when transitioning from mobile to desktop
	      	$('footer ul.sublinks').show(); // display all footer sublinks in desktop view      	
	    } else { // when transitioning from desktop to mobile
	      	$('footer ul.sublinks').hide(); // hide all footer sublinks in mobile view
	    }
    }); // END: watch event

    $('.hamburger').click(function(e) {
      if(isMobileNavigationOpen()) {
        closeMobileNavigation();
      } else {
        openMobileNavigation();
      }
    });

    $('#htc-site').click(function() {
      if(isMobileNavigationOpen()) {
        closeMobileNavigation();
      }
    });

    // display region selector if region=true
    regionParam = getParameterByName('region');
    if($('body').data('site') == 'us' && regionParam == "true") {
      openRegionModal();
    }

    $('#region-modal .regions a').click(function() {
      var region = $(this).data("region");
      if(typeof region != 'undefined') {
        createCookie("country_code",region,30);
      }
    });

    $('#region-modal .modal-close').click(function() {
      closeRegionModal();
    });

    // search input behavior
    $('.top .search input[name$="q"]').blur(function() {
      if($('.top .search input[name$="q"]').val().length) {
        $('.top .search input[name$="q"]').addClass('active');        
        $('#htc-mobile-menu .search input[name$="q"]').addClass('active');
      } else {
        $('.top .search input[name$="q"]').removeClass('active');        
        $('#htc-mobile-menu .search input[name$="q"]').removeClass('active');        
      }
    });

    $('#htc-mobile-menu .search input[name$="q"]').blur(function() {
      if($('#htc-mobile-menu .search input[name$="q"]').val().length) {
        $('.top .search input[name$="q"]').addClass('active');        
        $('#htc-mobile-menu .search input[name$="q"]').addClass('active');        
      } else {
        $('.top .search input[name$="q"]').removeClass('active');        
        $('#htc-mobile-menu .search input[name$="q"]').removeClass('active');        
      }
    });

    // remove search icon if search input is focused
    $('.top .search input[name$="q"]').focus(function() {
      $('.top .search input[name$="q"]').addClass('active');        
      $('#htc-mobile-menu .search input[name$="q"]').addClass('active');
    });

    $('#htc-mobile-menu .search input[name$="q"]').focus(function() {
      $('.top .search input[name$="q"]').addClass('active');        
      $('#htc-mobile-menu .search input[name$="q"]').addClass('active');        
    });

    // mobile footer links behavior
    $('.sitemap .title').click(function(e) {
      if(isMobile()) {
      	e.preventDefault();
        if($(this).next().is(":visible")) {
          $(this).next().slideUp();
        } else {
          $(this).next().slideDown();        
        }
      }
    }); // END: mobile footer  

    // keep mobile search input and top nav input in sync
    $('#htc-mobile-menu .search input[name$="q"]').bind("keyup paste", function() {
      $('.top .search input[name$="q"]').val($(this).val());
    });    

    // init subnav behavior
    $('#htc-mobile-menu .nav > ul.parent > li').each(function() {
      if($(this).has('.subnav').length) {
        // remove link for this item
        $(this).children('a').css("color", "");
        $(this).children('a').removeAttr("href");
        $(this).children('a').css("cursor", "default");
        $(this).children('a').click(function(e) {
          e.preventDefault();
        });
      }
    }); // END subnav loop

    $('header .nav > ul.parent > li').each(function() {
      if($(this).has('.submenu').length) {
        // remove link for this item
        $(this).children('a').css("color", "");
        $(this).children('a').removeAttr("href");
        $(this).children('a').css("cursor", "default");
        $(this).children('a').click(function(e) {
          e.preventDefault();
        });

        // set hover states
        var settings = {
          timeout: 500,
          over: function() {
            // display submenu
            $(this).addClass('subnav-active');
            $(this).find('.submenu').slideDown(200);

            // position subnav directly below link
            if($('header .nav .parent .subnav').length) {
              var center = $(this).position().left + ($(this).outerWidth() / 2);
              var subnavCenter = $(this).find('.subnav ul').width() / 2;
              var pos = center - subnavCenter;
              if(($('header .nav').position().right - pos) > $(this).find('.subnav ul').width()) {
                pos = $('header .nav').position().right - $(this).find('.subnav ul').width();
              }
              if(pos > 0) {
                $(this).find('.subnav ul').css({marginLeft: pos});
              }
            }
          }, // END: over
          out: function() {
            var current = $(this);
            $(this).find('.submenu').slideUp(200, function(){
              current.removeClass('subnav-active');  
            });
          } // END: out
        }; // END: setting   
        $(this).hoverIntent(settings);
      } // END: outter IF has submenu
    }); // END: loop
    
    // init h1 title subnavigation if there is an h1 with class htc-title-nav
    $('html').click(function(e) {
      if($(e.target).closest('.htc-title-nav .dropdown').length == 0) {
        if($('.htc-title-nav .dropdown').is(':visible')) {
          $('.htc-title-nav h1').toggleClass('open');
            $('.htc-title-nav .dropdown').slideUp(200);
        }
      }
    }); // END: html click


	function validateRadios(){
	  alert("Please select HTC customer status");
	  console.log("radio validation");
	}
*/


    // init newsletter signup behavior
    if($('.newsletter').length) {
    	
      $('.newsletter .email input').focus(function() {
        openNewsletter();
      });

      $('.newsletter .email input').blur(function() {
        if($('.newsletter .email input').val().length == 0) {
          $('html').click(function() {
          	closeNewsletter();
          	$('#newsletter-error-message').hide();
          	if(isMobile()) { $('.email .error-mobile').hide(); 
          	}
          });
        	$('.newsletter').click(function(e) {
          	e.stopPropagation();
          });
        }
      }); // END: blur event


      // newsletter submission
      $('#newsletter').submit(function(e) {
        if(e.preventDefault) { e.preventDefault(); }
        else { e.returnValue = false; }

        // check if email is valid
        var emailString = $('.newsletter .email input').val(),
            emailIsValid = (isEmail(emailString)) ? true : false;

        // check for email validation
        if (emailIsValid == true && $("input[name='existingCustomer']").is(':checked')) {
          $('#newsletter-error-message').hide();
          if(isMobile()) { $('.email .error-mobile').hide(); }

          self.subscriptionSubmission('newsletter');
        } else {  
          $('#newsletter-error-message').show();
          if(isMobile()) { $('.email .error-mobile').show(); }
        } 
      });

    } // END: init newsletter signup behavior 


      // function: subscriptionSubmission 
      module.prototype.subscriptionSubmission = function (comingFrom, campaignCTA, pid, pname, passedEmail) {

          var padZero = function (n) {
            return n < 10 ? '0' + n : n;
          };

          var appID        = 'htc-newsletter',
              campaignID   = 'newsletter',
              subscribeNewsletter = 'true',
              productNewsletter = 'false',
              userUrl = window.location.href,
              now = new Date(),
              ISO8601DateTimestamp = now.getUTCFullYear() + '-' +
                                     padZero(now.getUTCMonth() + 1) + '-' +
                                     padZero(now.getUTCDate()) + 'T' +
                                     padZero(now.getUTCHours()) + ':' +
                                     padZero(now.getUTCMinutes()) + ':' +
                                     padZero(now.getUTCSeconds()) + '-00:00';

          campaignCTA = (typeof campaignCTA === 'undefined') ? 'signup-footer' : campaignCTA; 
          pid = (typeof pid === 'undefined') ? '' : pid; 
          pname = (typeof pname === 'undefined') ? '' : pname; 

          var localeObject = self.getLocale();

          // for testing purpose in local
          userUrl = (userUrl.indexOf('local') < 0) ? userUrl : userUrl.replace(location.hostname+':' + location.port, 'dev-www.htc.com');

          var path = location.hostname,
              hostName = (path.indexOf('local') >= 0) ? 'dev-': location.hostname,
              servicePath = 'ws.htc.com/htc-subscription-1.6';

          // update from dev2-ws to dev-ws 
          //hostName = hostName.replace('2', '');

          var foundIndex = hostName.indexOf('-'),
              environment = (foundIndex >= 0) ? hostName.substring(0,foundIndex+1) : '',
              subscriptionWSBaseURL = 'https://' + environment + servicePath,
              urlStr = subscriptionWSBaseURL + '/profile?callback=?';


          switch (comingFrom) {
            case 'newsletter':
              var emailAdd = $('#newsletter .email input').val(),
                  newsletterExistingCustomer = $('.newsletter input[name=existingCustomer]:checked').val(),
                  newsletterSubscriptionType = (newsletterExistingCustomer == "Yes") ? 'customer' : 'prospect';
              break;

            case 'reviews':
              var emailAdd = $('.review-form input.email').val(),
                  newsletterSubscriptionType = 'customer';
              appID = 'htc-reviews';
              break;

            case 'pdp':
              var emailAdd = self.emailAddPDP,
                  newsletterSubscriptionType = 'customer';
              break;

            case 'header':
              var emailAdd = $('#HtcSignup input#emailtext').val(),
                  carrierSelection = $('#HtcSignup .custom-selector.carrier-selector .dropper'),
                  ownHtcProduct = $('#HtcSignup .btnYN.Y'),
                  newsletterSubscriptionType = (ownHtcProduct.hasClass('active')) ? 'customer' : 'prospect';

              subscribeNewsletter = $('#HtcSignup input#subscriptchecker').is(':checked');

              if (carrierSelection.hasClass('selected')) {
                  var carrierValue = carrierSelection.data('value');
              }
              var miscData = {
                  carrier: carrierValue
              };
              break;

            case 'comingsoon':
              var emailAdd = $('.signup form#signup input[name=email]').val(),
                  newsletterSubscriptionType = 'prospect';
              break;

            case 'freescroll-pdp':
              var emailAdd = $('.signup-area input[type=email]').val().trim(),
                  carrierSelection = ( $('.signup-area select').length > 0 ) ? $('.signup-area select').val().trim() : '',
                  ownHtcProduct = $('.signup-area .question .answers > div.active').attr('data-selection'),
                  newsletterSubscriptionType = (ownHtcProduct == 'yes') ? 'customer' : 'prospect';   

              var miscData = {
                carrier: carrierSelection
              };

              subscribeNewsletter = ($('.signup-area .checkbox-area').hasClass('valid')) ? 'true': 'false';
              productNewsletter = 'true';

              break;

            default:
              var emailAdd = (typeof passedEmail === 'undefined' || passedEmail == '') ? '' : passedEmail,
                  newsletterSubscriptionType = (typeof passedEmail === 'undefined') ? 'prospect' : 'customer';
              break;    
          } // END: switch


          var formData = {
            app_id : appID,
            email : emailAdd,
            lang : localeObject.languages,
            zip : '',
            country : localeObject.countrySite,
            ip : '0.0.0.0',
            date : ISO8601DateTimestamp,
            s_type : newsletterSubscriptionType,
            s_agreement : 'true',
            s_welcome : 'true',
            s_newsletter: subscribeNewsletter,
            s_product : productNewsletter,
            r_url : userUrl,
            r_campaign : campaignID,
            r_cta : campaignCTA,
            r_pid : pid,
            r_pname : pname,
            ws_echo : 'false'
          };

          if (miscData !== undefined) {
             formData['misc'] = miscData;
          }
          //console.log('SUBSCRIBE: formData: ' + formData.toSource() );

          $.ajax({
            type: 'GET',
            url : urlStr,
            data: formData,
            dataType: 'json',
            jsonp : true,
            async : true,
            success : function(data){
              if(data.status=='success'){
                switch (comingFrom) {
                  case 'newsletter':
                    closeNewsletter();
                    $('div.newsletter form').hide();
                    $('div.newsletter .success').show();
                    break;

                  case 'pdp':
                    $('.email-signup .signup-form').fadeOut(300, function() {
                        $('form.signup-form input.launch-email').removeClass('invalid');
                        $('.email-signup .error-message').hide();
                        $('.email-signup .confirmation-message').fadeIn(300);
                    });
                    break;
                  case 'freescroll-pdp':
                    $('.signup-submit').addClass('disable');
                    // simulate AJAX
                    setTimeout(function() {
                        // run the function below after AJAX completes
                        if (isMobile() == false) {
                          $('.signup-area').fadeOut(300, function() {
                              $('.signup-confirmation').fadeIn(300);
                          });
                        } else {
                          $('.signup-area').hide();
                          $('.signup-confirmation').show();
                        }
                    }, 1000);
                    break;  
                  case 'header':
                    $('.form-block').hide();
                    $('.thank-you-wrapper').show();
                    $('.thank-you-wrapper .signup-closer').on('click', function(e) {
                        if(e.preventDefault) { e.preventDefault(); }
                        else { e.returnValue = false; }

                        $('.signup-popover').removeClass('active');
                    });
                    //Setup auto close
                    signupInterval = setInterval(function() {
                        if ($('.signup-popover').hasClass('active')) {
                            $('.signup-popover').removeClass('active');
                        } else {
                            clearInterval(signupInterval);
                        }
                    }, 3000);
                    break;
                  case 'comingsoon':
                      $('.signup .error-message').hide();
                      $('form#signup').hide();
                      $('div.signup').append('<div>Thank you!</div>');
                    break;     
                  default:
                    break;
                }
              } // END: SUCCESS

              if(data.status=='failed') {
                switch (comingFrom) {
                  case 'newsletter':
                    closeNewsletter();
                    $('div.newsletter form').hide();
                    if(isMobile()) { $('.email .error-mobile').show(); }
                    else { $('div.newsletter .error').show(); }
                    break;

                  case 'pdp':
                    $('.email-signup .error-message').show();
                    $('form.signup-form input.launch-email').addClass('invalid');
                    break;

                  case 'freescroll-pdp':
                    $('.signup-confirmation').hide();
                    $('.signup-area').show();
                    $('.signup-submit').removeClass('disable');
                    $('.signup-area .error-message').show();
                    break;
                  case 'header':
                    var errormessage = $('input#emailtext').data('msg-required');

                    $('.top-item.signup .signup-popover').addClass('active');
                    $('#HtcSignup #emailtext-error').text(errormessage);
                    $('#HtcSignup #emailtext-error').show();
                    break;  
                  case 'comingsoon':
                    $('.signup .error-message').show();
                    break;
                  default:
                    break;    
                }
              } // END: ERROR
            },
            error : function(jqXHR, textStatus, errorThrown ) {
              //console.log('ERRROR :: ' + errorThrown + ', text: ' + textStatus);
             
              switch (comingFrom) {
                  case 'newsletter':
                    closeNewsletter();
                    $('div.newsletter form').hide();
                    if(isMobile()) { $('.email .error-mobile').show(); }
                    else { $('div.newsletter .error').show(); }
                  break;

                  case 'pdp':
                    $('.email-signup .error-message').show();
                    $('form.signup-form input.launch-email').addClass('invalid');
                    break;

                  case 'freescroll-pdp':
                    $('.signup-confirmation').hide();
                    $('.signup-area').show();
                    $('.signup-submit').removeClass('disable');
                    $('.signup-area .error-message').show();
                    break;

                  case 'header':
                    var errormessage = $('input#emailtext').data('msg-required');

                    $('.top-item.signup .signup-popover').addClass('active');
                    $('#HtcSignup #emailtext-error').text(errormessage);
                    $('#HtcSignup #emailtext-error').show();
                    break;  

                  case 'comingsoon':
                    $('.signup .error-message').show();
                    $('.signup .error-message').text('System Error');
                    break;
                  default:
                    break;    
              }
            }
          }); // END: AJAX
      } // END: subscriptionSubmission


      // function: getLocale :: country and language
      module.prototype.getLocale = function () {

          var path = window.location.pathname.split('/'),          
              defaultCountrySite  = 'www',  
              countrySite = defaultCountrySite,
              defaultLanguage = 'en',
              language = defaultLanguage,
              locale = window.navigator.language,
              result = {};

          if(locale != undefined && locale != null) {
            var localeParts = locale.split('_'); //e.g. en_US
            language = localeParts[0];
          }
    
          if(typeof countrySiteOverride != 'undefined' && countrySiteOverride.length > 0) {
            countrySite = countrySiteOverride;
          } else {
            countrySite = path[1];
            var countrySiteParts = countrySite.split('-');
            
            if(countrySiteParts[1] != undefined && countrySiteParts[1].length > 0){
              countrySite = countrySiteParts[0];
              language    = countrySiteParts[1]; //get language via URI path
            }
          }

          if( language == undefined || language == "" ){
            language = defaultLanguage;
          }

          result.languages = language;
          result.countrySite = countrySite;

          return result;

      } // END: getLocale
  }; // END: module constructor

  // public methods
  module.prototype = {
    constructor: module
  }

  return module; // return module

})(jQuery);
