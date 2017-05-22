/*global region_init, BMap, __doPostBack, BMAP_NAVIGATION_CONTROL_LARGE*/
/*region_init() in vipcard.cn.province.js*/
var vcode = "";
$("#ServiceType").val("home");

$("#ctl00_ContentPlaceHolder1_lb_submit").click(function () {
    'use strict';
    $("#addressprovince").val($('#select_province :selected').text());
    $("#addresscity").val($('#select_city :selected').text());
    $("#addressdistrict").val($('#select_area :selected').text());
});

var vipCardService = (function () {
    'use strict';

    var vipCardService = {
        init: function () {
            vipCardService.setupAppointmentButton();
            vipCardService.setupGetPhoneButton();
            vipCardService.setupVcodeFunction();
            vipCardService.setupVoiceVcodeFunction();
            vipCardService.initCardValidate();
            vipCardService.setupCardSubmit();
            vipCardService.setupDataSubmit();
            new ReflashValidateImage();
        },
        setupAppointmentButton: function() {
            $('.appointment-btn.in-home').on('click', function(event) {
                event.preventDefault();
                $("#ServiceType").val("home");
                $('.steps-vip-card-info').show(100, function() {
                    //scroll to final step
                    var ob = $(this);
                    $('html, body').animate({
                        scrollTop: ob.offset().top - $('.d-header').height()
                    }, 300);
                });

            });
        },
        setupGetPhoneButton: function() {

            $('.appointment-btn.get-phone').on('click', function (event) {
                event.preventDefault();
                $("#ServiceType").val("store");
                $('.steps-vip-card-info').show(100, function() {
                    //scroll to final step
                    var ob = $(this);
                    $('html, body').animate({
                        scrollTop: ob.offset().top - $('.d-header').height()
                    }, 300);
                });

            });
            $("#ctl00_ContentPlaceHolder1_dlAllCity option").each(function () {
                if ($(this).val().indexOf("[44]") >= 0) {
                    $("<option />", {
                        val: this.value,
                        text: this.text
                    }).appendTo($('#ctl00_ContentPlaceHolder1_sCity'));
                }
            });

            //add sCity action
            $("#ctl00_ContentPlaceHolder1_sCity").change(function () {
                if ($(this).val() !== "--") {
                    $('#shoparea').show();
                    $('input[name=rdShop]:checked').prop('checked', false);
                    var selectedCity = $(this).find('option:selected').text();
                    var ccc = 0;
                    $('.shoplist').each(function () {
                        if ($(this).attr('id') === selectedCity) {
                            if (ccc === 0) {
                                $(this).children('label').children('input').prop('checked', true);
                                //alert($(this).attr('id'));
                                $('.shoplist').removeClass('selected');
                                $(this).addClass('selected');
                            }
                            $(this).children('label').children('.eng-title').html(new GetABC(ccc));
                            $(this).addClass('show');
                            ccc = ccc + 1;

                        }
                        else{

                            $(this).removeClass('show');
                        }
                    });
                    //resetMapHeight(ccc);
                    //GetTimeSlot();
                    $('#map').show();
                    new BuildMap();
                }
            });

            //shoplist bind click function
            $(".shoplist").click(function (e) {
                e.preventDefault();
                //remove original selected
                $(".shoplist").removeClass('selected');
                //Add new selected
                $(this).addClass('selected');
                $(this).children("label").children("input[type=radio]").attr('checked', 'checked');
                $('#map').show();
                new BuildMap();
            });

            //Bind next step for date selection
            $("#btnNextInputData").click(function (e) {
                e.preventDefault();
                $('.steps-enter-user-info').show(100, function () {
                    //scroll to final step
                    var ob = $(this);
                    $('html, body').animate({
                        scrollTop: ob.offset().top - $('.d-header').height()
                    }, 300);
                });
            });







        },
        setupVcodeFunction: function () {
            //init the image
            $.ajax({
                url: "/cn/support/captcahimg.aspx?act=ref&res=v",
                dataType: 'html',
                type: 'POST',
                error: function () {
                    // ErrorReservation();
                },
                success: function (response) {
                    vcode = response;
                    $("#ctl00_ContentPlaceHolder1_Image1").attr("src", "/cn/support/captcahimg.aspx?" + Math.random());
                }
            });
            //bind the reflash button
            $('#reloadicon').on('click', function () {
                $.ajax({
                    url: "/cn/support/captcahimg.aspx?act=ref&res=v",
                    dataType: 'html',
                    type: 'POST',
                    error: function () {
                        // ErrorReservation();
                    },
                    success: function (response) {
                        vcode = response;
                        $("#ctl00_ContentPlaceHolder1_Image1").attr("src", "/cn/support/captcahimg.aspx?" + Math.random());
                    }
                });
            });
        },
        setupVoiceVcodeFunction: function() {
            $('#speaker').on('click', function () {
                $('#voicecaptcha').attr("src", "/cn/support/captcahvoice.aspx?vcode=" + vcode);
                var sound = $("#voicecaptcha")[0];
                sound.load();
                sound.play();
                return false;
            });
            $('#voicecaptcha').bind("play", function () {
                $('.speaker-icon-area').hide();
                $('.loading-spin.captcha-play').css({ 'display': 'inline-block' });
            });
            $('#voicecaptcha').bind("ended", function () {
                $('.loading-spin.captcha-play').hide();
                $('.speaker-icon-area').show();
            });
        },
        setupDescCheck: function() {
            $("#ctl00_ContentPlaceHolder1_txt_sDesx").maxlength({
                maxCharacters: 1000,
                statusText: "剩餘字元",
                slider: true
            });
        },
        setupCardSubmit: function() {
            $('.validate-card-submit').on('click', function(event) {
                event.preventDefault();
                if ($('#aspnetForm').valid() === false) {
                    return false;
                } else {
                    var imei_sn = $("#ctl00_ContentPlaceHolder1_txt_IMEI_SN").val();
                    var imei = "";
                    var sn = "";
                    if (imei_sn.length > 12){
                        imei = imei_sn;
                    }
                    else{
                        sn = imei_sn;
                    }
                    ajaxVipCheck('/cn/support/vipreservationws.aspx?imei=' + imei + "&sn=" + sn + "&card=" + $("#ctl00_ContentPlaceHolder1_txtVipCardNumber").val());
                }
            });
        },
        setupDataSubmit: function() {
            $('#ctl00_ContentPlaceHolder1_lb_submit').on('click', function (event) {
                event.preventDefault();
                if ($('#aspnetForm').valid() === false) {
                    return false;
                } else {
                    $('#ctl00_ContentPlaceHolder1_lb_submit').removeClass('button');
                    $('#ctl00_ContentPlaceHolder1_lb_submit').bind('click', disableLink);
                    $('#ctl00_ContentPlaceHolder1_lb_submit').addClass('button_gray');
                    popupLoading();
                    //try { trackSubmit(); } catch (err) { }
                    //setTimeout("Submit()", 1000);
                    __doPostBack('ctl00$ContentPlaceHolder1$lb_submit', '');
                }
            });
        },
        initCardValidate: function () {
            var VcodeName = 'ctl00$ContentPlaceHolder1$VCode';
            $.validator.addMethod("vcodevalidate", function (value, element) {
                return (element.value.toLowerCase() === vcode.toLowerCase());
            });

            $.validator.addMethod("vipcard", function (value, element) {
                var key = value;
                var regex = /^(?:[A-Za-z0-9]{11})$/;
                if (!regex.test(key)) {
                    return false;
                }
                return true;
            });
            jQuery.validator.addMethod("emailformat", function (value, element) {
                if (this.optional(element)){
                    return true;
                }
                var emails = value.split(/[;,]+/); // split element by , and ;
                var valid = true;
                for (var i = 0; i < emails.length; i++) {
                    var singleEmail = emails[i];
                    valid = valid && jQuery.validator.methods.email.call(this, $.trim(singleEmail), element);
                }
                return valid;
            },

               jQuery.validator.messages.multiemails
            );
            $.validator.addMethod("specialchars", function (value, element) {
                var key = value;
                var regex = /[`~!@#$%^&*\(\)-\+=\^\[\]\{\}"?\/:;,]+/;
                if (regex.test(key)) {
                    return false;
                }
                return true;
            });
            $.validator.addMethod("specialcharsaddress", function (value, element) {
                var key = value;
                var regex = /[`~!@#$%^&*\+=\^\[\]\{\}"?\/:;]+/;
                if (regex.test(key)) {
                    return false;
                }
                return true;
            });
            $.validator.addMethod("imei", function (value, element) {
                var key = value;
                var regex = /^(?:[0-9]{14}|[0-9]{15}|[A-Za-z0-9]{12}|)$/;
                if (!regex.test(key)) {
                    return false;
                }
                return true;
            });
            $.validator.addMethod("numberonly", function (value, element) {
                var key = value;
                var regex = /^(\s*|[0-9\-#()+])+$/;
                if (!regex.test(key)) {
                    return false;
                }
                return true;
            });
            $('#aspnetForm').validate({
                errorClass: 'error up',
                // errorPlacement: function (error, element) {
                //     // switch ($(element).attr('name')) {
                //     //     case VcodeName:
                //     //         error.insertAfter($('.captcha > .email-input'));
                //     //         break;
                //     //     default:
                //     //         error.insertAfter(element);
                //     //         break;
                //     // }
                // }
            });
        }
    };

    return vipCardService;
}());

$(document).ready(function () {
    'use strict';
    vipCardService.init();
    region_init("select_province", "select_city", "select_area");
});

$(window).resize(function() {

});

function addValidateRule() {
    'use strict';
    $('[id*=txt_sNAME]').rules('add', { required: true });
    $('[id*=txt_sNAME]').rules('add', { specialchars: true });
    $('[id*=txt_sPhoneNum]').rules('add', { required: true });
    $('[id*=txt_sPhoneNum]').rules('add', { numberonly: true });
    $('[id*=txt_sEamil]').rules('add', { required: true });
    $('[id*=txt_sEamil]').rules('add', { emailformat: true });
    $('[id*=txt_Address]').rules('add', { required: true });
    $('[id*=txt_Address]').rules('add', { specialcharsaddress: true });
    $('[id*=txt_sDesx]').rules('add', { required: true });
}

function ReflashValidateImage() {
    'use strict';
    ajaxGetVCode();
}
function ajaxGetVCode() {
    'use strict';
    $.ajax({
        url: "/cn/support/captcahimg.aspx?act=ref&res=v",
        dataType: 'html',
        type: 'POST',
        error: function () {
            //ErrorReservation();
        },
        success: function (response) {
            vcode = response;
            $("#ctl00_ContentPlaceHolder1_Image1").attr("src", "/cn/support/captcahimg.aspx");
        }
    });
}

function popupMsg(msg) {
    'use strict';
    $.confirm({
        'title': "",
        'message': msg,
        'buttons': {
            'OK': {
                'class':'blue-button',
                'text': 'OK'
            }
        }
    });
}

function popupMsgReload(msg) {
    'use strict';
    $.confirm({
        'title': "",
        'message': msg,
        'buttons': {
            'OK': {
                'class': 'blue-button',
                'text': 'OK',
                'action': function () {
                    location.href = location.href;
                }
            }
        }
    });
}

function popupAlertMsg(title, msg) {
    'use strict';
    $.confirm({
        'title': title,
        'message': msg,
        'buttons': {
            'OK': {
                'class':'blue-button',
                'text': 'OK'
            }
        }
    });
}

function popupLoading() {
    'use strict';
    $.confirm({
        'title': "",
        'message': "<img src='/ek-assets/responsive/img/ajax-loader.gif' style='display: block;margin-left: auto;margin-right: auto;' /><br>资料传送中......"

    });
}

function CheckInput() {
    'use strict';
    var str = document.getElementById("ctl00_ContentPlaceHolder1_txt_sDesx").innerHTML;
    document.getElementById("ctl00_ContentPlaceHolder1_txt_sDesx").innerHTML = str.replace(/<[^>].*?>/g, '');
}

function ajaxVipCheck(SlotUrl) {
    'use strict';
    $('.validate-card-submit').css({ 'display': 'none' });
    $('.loading-spin.vip-check').css({ 'display': 'inline-block' });
    //Ajax time slot
    $.ajax({
        url: SlotUrl,
        dataType: 'html',
        type: 'POST',
        error: function () {
            new ErrorVipChecking();
            $('.validate-card-submit').css({ 'display': 'inline-block' });
            $('.loading-spin.vip-check').hide();
        },
        success: function (response) {
            
            var Slot = response;
            var res = Slot.split(",");
            if (Slot === "Error") {
                //Show Booking Error msg, reload the timeslot
                new ErrorVipChecking();
                $('.validate-card-submit').css({ 'display': 'inline-block' });
                $('.loading-spin.vip-check').hide();
            }
            else {
                if (res[0] === "0") {
                    popupAlertMsg("验证失败", "您的卡号验证失败，如需服务请洽<a href='http://www.htc.com/cn/contact/email/'>客服人员</a> ");
                    $('.validate-card-submit').css({ 'display': 'inline-block' });
                    $('.loading-spin.vip-check').hide();
                }
                else {
                    if (res[1] === "0") {
                        $('.checkbox').hide();
                        $('.needactivate').show();
                    }
                    else {
                        $('.checkbox').show();
                        $('.needactivate').hide();
                    }
                    //disable textbox prevent txt update
                    $("#ctl00_ContentPlaceHolder1_txtVipCardNumber").attr("readonly", "readonly");
                    $("#ctl00_ContentPlaceHolder1_txt_IMEI_SN").attr("readonly", "readonly");
                    $("#ctl00_ContentPlaceHolder1_VCode").attr("readonly", "readonly");

                    
                    if ($("#ServiceType").val() === "home") {
                        if (res[2] === "H") {
                            popupAlertMsg("验证失败", "亲，乐享版不适应于快递上门取送机服务哦^_^，请选择<br/>到店维修");
                            $('.validate-card-submit').css({ 'display': 'inline-block' });
                            $('.loading-spin.vip-check').hide();
                        }
                        else {
                            $('.appointment-btn.get-phone').hide();
                            $(".four-steps-address").show();
                            //add province selection
                            region_init("select_province", "select_city", "select_area");
                            $("#addressprovince").val($('#select_province :selected').text());
                            $("#addresscity").val($('#select_city :selected').text());
                            $("#addressdistrict").val($('#select_area :selected').text());

                            //add sCity action
                            $("#select_province").change(function () {
                                $("#addressprovince").val($('#select_province :selected').text());
                            });
                            $("#select_city").change(function () {
                                $("#addresscity").val($('#select_city :selected').text());
                            });
                            $("#select_area").change(function () {
                                $("#addressdistrict").val($('#select_area :selected').text());
                            });

                            $('.steps-enter-user-info').show(100, function () {
                                //scroll to final step
                                var ob = $(this);
                                $('html, body').animate({
                                    scrollTop: ob.offset().top - $('.d-header').height()
                                }, 300);
                            });
                            popupAlertMsg("验证成功", "请继续填入您的收件资料");
                        }
                    }
                    else {
                        $('.appointment-btn.in-home').hide();
                        $(".four-steps-address").hide();
                        popupAlertMsg("验证成功", "请选择离您最近的网点");

                        var cityid = $("#ctl00_ContentPlaceHolder1_sCity").find('option:selected').text();
                        $('#shoparea').show();
                        var ccc = 0;
                        $('.shoplist').each(function () {
                            if ($(this).attr('id') === cityid) {
                                if (ccc === 0) {
                                    $('.shoplist').removeClass('selected');
                                    $(this).children('label').children('input').prop('checked', true);
                                    $(this).addClass('selected');
                                }
                                $(this).addClass('show');
                                $(this).children('label').children('.eng-title').html(new GetABC(ccc));
                                ccc = ccc + 1;
                            }
                            else{
                                $(this).removeClass('show');
                            }
                        });

                        $('#map').show();
                        new BuildMap();

                        $('.steps-select-store-info').show(100, function () {
                            //scroll to final step
                            var ob = $(this);
                            $('html, body').animate({
                                scrollTop: ob.offset().top - $('.d-header').height()
                            }, 300);
                        });
                    }
                    $('.loading-spin.vip-check').hide();

                    //add next form validation
                    addValidateRule();
                }
            }
        }
    });
}

function ErrorVipChecking() {
    'use strict';
    popupAlertMsg("验证错误", "目前VIP验证机制暂时无法使用，我们正在全力修復中请，如需紧急服务请洽<a href='http://www.htc.com/cn/contact/email/'>客服人员</a> ");
}

function Submit() {
    'use strict';
    __doPostBack('ctl00_ContentPlaceHolder1_lb_submit', '');
}

function disableLink(e) {
    'use strict';
    // cancels the event
    e.preventDefault();
    return false;
}

function GetABC(index) {
    'use strict';
    var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    return arr[index];
}

function BuildMap() {
    'use strict';
    var countryid = "44";
    var ShopId = $('input[name=rdShop]:checked').val();
    $("#shopid").val(ShopId);
    var storeInfo = $("#shop" + ShopId).text().replace(" - ", "#");
    var infos = storeInfo.split("#");
    var storename = $("#shop" + ShopId).children("div .location-title").html();
    var address = $("#shop" + ShopId).children("div .location-text").html();
    //if is China, use baidu map, else use google map
    if (countryid === "44") {
        // var map api
        var map = new BMap.Map("map");
        map.reset();
        var opts = { type: BMAP_NAVIGATION_CONTROL_LARGE };
        map.addControl(new BMap.NavigationControl(opts));
        // create address translater instance
        var myGeo = new BMap.Geocoder();
        myGeo.getPoint(address, function (point) {
            if (point) {
                map.centerAndZoom(point, 16);
                var marker = new BMap.Marker(point);
                map.addOverlay(marker);
                var label = new BMap.Label(storename, { offset: new BMap.Size(-17, -40) });
                marker.setLabel(label);
            }
        }, "");
    }
}
