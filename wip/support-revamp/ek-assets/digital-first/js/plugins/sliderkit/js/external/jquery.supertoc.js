!function(e){e.fn.superToc=function(a){var r={headings:"h1,h2,h3"},c=function(e){var a=e.toLowerCase();return a=a.replace(/\s/g,""),a=a.replace(/[������]/g,"a"),a=a.replace(/�/g,"ae"),a=a.replace(/�/g,"c"),a=a.replace(/[����]/g,"e"),a=a.replace(/[����]/g,"i"),a=a.replace(/�/g,"n"),a=a.replace(/[�����]/g,"o"),a=a.replace(/�/g,"oe"),a=a.replace(/[����]/g,"u"),a=a.replace(/[��]/g,"y"),a=a.replace(/\W/g,""),a=a.replace(/\W/g,"")};return this.each(function(){a&&e.extend(r,a);var t=e(this),l="";e(r.headings,t).each(function(){var a=e(this),r=a.attr("id"),t=a.text(),n=a.get(0).tagName.toLowerCase();r||(r="TOC"+c(t),a.attr("id",r)),l+='<li class="toc-'+n+'"><a href="#'+r+'">'+t+"</a></li>"}),t.prepend('<div class="supertoc"><ul>'+l+"</ul></div>")})}}(jQuery);