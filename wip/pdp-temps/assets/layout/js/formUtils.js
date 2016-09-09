/*
   Filename: formUtils.js
   Description: This file contains all the methods used for form field validation
*/


/* ==== Forms validation ==== */
function validatePhone(data) {
	var regex = /^[\s(\.)+-]*([0-9][\s(\.)+-]*){6,20}(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;

	return regex.test(data);
} // END: validatePhone

function isEmail(data) {
    var regex = XRegExp("^[\\p{L}0-9\\p{Devanagari}.!#$%&'*+/=?^_`{|}~-]+@[\\p{L}0-9\\p{Devanagari}]+[\.]+[\\p{L}0-9\\p{Devanagari}]+(?:[\.][\\p{L}0-9\\p{Devanagari}]{0,61}[\\p{L}0-9\\p{Devanagari}])?(?:[\\p{L}0-9\\p{Devanagari}](?:[\\p{L}0-9\\p{Devanagari}]{0,61}[\\p{L}0-9\\p{Devanagari}])?)*$");

	return regex.test(data);
} // END: isEmail


function validateUrl(data) {
	var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

	return regex.test(data);
} // END: validateUrl


function validateCaptcha(captchaData, userData) {
    if (captchaData.toUpperCase() == userData.toUpperCase()) {
        return true;
    }

    return false;
} // END: validateCaptcha


// function: iPad detector
function isiPad() {
    //return (navigator.platform.indexOf('iPad') != -1);
    return ( navigator.userAgent.match(/iPad/i) || (navigator.platform.indexOf('iPad') != -1) );
}

// function: iPhone detector
function isiPhone() {
    return ( navigator.userAgent.match(/iPhone/i) || (navigator.platform.indexOf('iPhone') != -1) || (navigator.platform.indexOf("iPod") != -1) );
}

// function: iOS detector 
function isiOS() {
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) { return true; } else { return false; }
}

// function: Mobile safari detector 
function isMobileSafari() {
    if (navigator.userAgent.match(/(Safari)/) && isiOS() ) { return true; } else { return false; }
}

// function: Android detector 
function isAndroid() {
    if (navigator.userAgent.match(/(Android)/)) { return true; } else { return false; }
}

// function: isRecaptchaSupported detector 
function isRecaptchaSupported() {
    if (!isMobileSafari() && !isAndroid() && !isIE9()) { return true; } else { return false; }
}

// function: isIE9 NATIVE detector
function isIE9() {
    if ( navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.indexOf('MSIE 9') > 0 ) {
        return true;
    }

    return false;
}

// function: mobile view detector
function isMobile() {
    var viewportWidth = $(window).width();
    if (viewportWidth <= 720) { return true; } else { return false; }
}