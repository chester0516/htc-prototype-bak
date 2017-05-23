$(document).ready(function(){"use strict";emailSupport.init()});var emailSupport=function(){"use strict";var t={init:function(){t.buildTopicIssue(),t.productionSetup(),t.countrySelection(),t.sendBtnClick(),t.setupPrintClick(),t.updateFileName()},buildTopicIssue:function(){var t=$.url(),e=!1,i=t.param("pname"),n=t.param("pname_id"),o=t.param("category_name"),a=t.param("category_id"),r=$(".email-topic-issue"),l=r.find(".topic-block"),c=r.find(".issue-block"),s=$(".hidden-pname-id"),u=$(".hidden-category-id");if(r.length>0){if(void 0!==i&&void 0!==n){var d=l.find(".wording"),p=d.data("default-wording").replace(/{product-name}/i,i);l.find(".wording").text(p),s.val(n),l.addClass("show"),e=!0,void 0!==o&&void 0!==a&&$.trim(o).length>0&&$.trim(a).length>0&&(c.find(".wording").text(o),u.val(a),c.addClass("show"))}e&&r.addClass("show")}},countrySelection:function(){$(".select-country").on("change",function(){$(".cuntry-code-block").text($(this).find("option:selected").val())})},setupPrintClick:function(){$(".btn-print").on("click",function(){window.print()})},sendBtnClick:function(){if(commonSetting.isPrototypeHost()){$(".email-form").validate({errorClass:"error up",errorPlacement:function(t,e){"input_phone"===e.attr("name")?t.insertAfter(".email-input-notice"):t.insertAfter(e)}});$(".btn-send").click(function(){$(".email-form").valid()&&$(".email-support").addClass("email-preview-open")})}else $("#submitbtn").on("click",function(t){if(t.preventDefault(),!1===$("#aspnetForm").valid())return console.log("validate:fail"),!1;$("#btnsubmit").removeClass("button"),$("#btnsubmit").bind("click",disableLink),$("#btnsubmit").addClass("button_gray"),popupLoading();try{trackSubmit()}catch(t){}setTimeout("Submit()",1e3)})},productionSetup:function(){if(!commonSetting.isPrototypeHost()){window.location.href.split("/");$("#ctl00_ContentPlaceHolder1_sCountry").append($(".country_option").html());setupValidate();$("#ctl00_ContentPlaceHolder1_txt_sDesx").maxlength({maxCharacters:1e3,statusText:strleft,slider:!0})}},updateFileName:function(){$(".input-file").on("change",function(t){t.preventDefault();var e=t.target.files[0].name;$(".file-name").text(e)})}};return t}();