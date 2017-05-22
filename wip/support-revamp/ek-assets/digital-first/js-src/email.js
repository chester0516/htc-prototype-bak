/*global commonSetting, ajaxGetVCode, setupValidate, disableLink, popupLoading, trackSubmit, strleft*/
$(document).ready(function() {
    'use strict';
    emailSupport.init();
});


var emailSupport = (function() {
    'use strict';
    var emailSupport = {
        init: function() {
            emailSupport.buildTopicIssue();
            emailSupport.productionSetup();
            emailSupport.countrySelection();
            emailSupport.sendBtnClick();
            emailSupport.setupPrintClick();
            emailSupport.updateFileName();
        },
        buildTopicIssue: function() {
            var url = $.url(),
                showTopicIssueDiv = false,
                paramProductName = url.param('pname'),
                paramProductNameId = url.param('pname_id'),
                paramCategoryName = url.param('category_name'),
                paramCategoryId = url.param('category_id'),
                topicIssueBlock = $('.email-topic-issue'),
                topicBlock = topicIssueBlock.find('.topic-block'),
                issueBlock = topicIssueBlock.find('.issue-block'),
                hiddenProductNameId = $('.hidden-pname-id'),
                hiddenCategoryId = $('.hidden-category-id');

            if (topicIssueBlock.length > 0) {
                if (typeof paramProductName !== 'undefined' && typeof paramProductNameId !== 'undefined') {
                    //build topic div
                    var wordingBlock = topicBlock.find('.wording'),
                        newWording = wordingBlock.data('default-wording').replace(/{product-name}/i, paramProductName);
                    topicBlock.find('.wording').text(newWording);
                    hiddenProductNameId.val(paramProductNameId);
                    topicBlock.addClass('show');
                    showTopicIssueDiv = true;

                    if (typeof paramCategoryName !== 'undefined' && typeof paramCategoryId !== 'undefined' && $.trim(paramCategoryName).length > 0 && $.trim(paramCategoryId).length > 0) {
                        issueBlock.find('.wording').text(paramCategoryName);
                        hiddenCategoryId.val(paramCategoryId);
                        issueBlock.addClass('show');
                    }
                }
                if (showTopicIssueDiv) {
                    topicIssueBlock.addClass('show');
                }
            }
        },
        countrySelection: function() {
            $('.select-country').on('change', function() {
                $('.cuntry-code-block').text($(this).find('option:selected').val());
            });
        },
        setupPrintClick: function(){
            $('.btn-print').on('click', function(){
                window.print();
            });
        },
        sendBtnClick: function() {
            if (commonSetting.isPrototypeHost()) {
                //initial form 
                var validator = $('.email-form').validate({
                    errorClass: 'error up',
                    errorPlacement: function(error, element) {
                        //Custom position: first name
                        if (element.attr('name') === 'input_phone') {
                            error.insertAfter('.email-input-notice');
                        } else {
                            error.insertAfter(element);
                        }
                    }
                });

                $('.btn-send').click(function() {
                    // validate
                    if ($('.email-form').valid()) {
                        $('.email-support').addClass('email-preview-open');
                    }
                });
                
                // test thank you
                // $('.email-support').addClass('email-preview-open');
            } else {


                $('#submitbtn').on('click', function(e) {
                    e.preventDefault();
                    if ($('#aspnetForm').valid() === false) {
                        console.log("validate:fail");
                        return false;
                    } else {
                        $('#btnsubmit').removeClass('button');
                        $('#btnsubmit').bind('click', disableLink);
                        $('#btnsubmit').addClass('button_gray');
                        popupLoading();
                        try { trackSubmit(); } catch (err) {}
                        setTimeout("Submit()", 1000);
                    }
                });
            }
        },
        productionSetup: function() {
            if (!commonSetting.isPrototypeHost()) {
                var url = window.location.href.split("/");
                //$('#aspnetForm').get(0).setAttribute('action', "/" + url[3].toLowerCase() + "/support/ContactMail.aspx");
                $('#ctl00_ContentPlaceHolder1_sCountry').append($('.country_option').html());
                ajaxGetVCode();
                var SetupValidate = setupValidate();
                $("#ctl00_ContentPlaceHolder1_txt_sDesx").maxlength({
                    maxCharacters: 1000,
                    statusText: strleft,
                    slider: true
                });
            }
        },
        updateFileName: function(){
            $('.input-file').on('change', function(event) {
                event.preventDefault();
                /* Act on the event */
                var fileName = event.target.files[0].name;
                $('.file-name').text(fileName);
            });
        }
    };

    return emailSupport;
}());