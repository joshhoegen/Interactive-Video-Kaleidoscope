jQuery(document).ready(function () {
  /* ---------------------------------------------
   For getting URL parameters
   Thanks to roshambo
   http://snipplr.com/view/799/get-url-variables/
   ------------------------------------------------*/
  function getUrlVars() {
      var vars = [], hash;
      //location.hash = '';
      var url = window.location.href.split('#')[0];
      if (url.indexOf('?') == -1) {
          vars = 0;
      } else {
          var hashes = url.slice(window.location.href.indexOf('?') + 1).split('&');
          for (var i = 0; i < hashes.length; i++) {
              hash = hashes[i].split('=');
              vars.push(hash[0]);
              vars[hash[0]] = hash[1];
          }
      }
      return vars;
  }
  var isMobile = {
      Android: function() {
          return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
          return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
          return navigator.userAgent.match(/IEMobile/i);
      },
      any: function() {
          return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
  };
  if (location.hash == '#dark') {
    jQuery('body').addClass('dark');
  }
  jQuery('nav ul.menu li a').on('click', function(e){
    	var activeLink = jQuery(this);
    	var img = activeLink.attr('href');
    	window.location.href = '#'+activeLink.text();
    	if(img.match(/jpg/g)){
        	e.preventDefault();   		
        	jQuery('body').css({backgroundImage: 'url('+img+')'});
        	jQuery('#body-kscope-wrapper > .body-kscope').attr('src', img);
        	return false;
    	} else if(img.match(/#hideContent/g)){
        	e.preventDefault();
        	jQuery('canvas.kaleidoscope').hide('fast');
        	jQuery('.row').hide();
        	activeLink.text('Show Content').attr('href','//byutifu.com/#showContent');
    		jQuery('nav ul.menu li a:contains("Kaleidovision")').text('Kaleidovision').attr('href','//byutifu.com/#kaleidovision');
        	return false;
    	} else if(img.match(/#showContent/g)){
        	e.preventDefault();
        	jQuery('canvas.kaleidoscope').hide('fast');
        	jQuery('.row').show();
        	activeLink.text('Show Background').attr('href','//byutifu.com/#hideContent');
    		jQuery('nav ul.menu li a:contains("Kaleidovision")').text('Kaleidovision').attr('href','//byutifu.com/#kaleidovision');
        	return false;
    	} else if(img.match(/#kaleidovision/g)){
    		e.preventDefault();
    		if(jQuery.kScope){
    		  jQuery('canvas.kaleidoscope').show('fast');
    		} else {
    		  loadNewKaleidoscope();
    		}
    		jQuery('.row').hide();
    		activeLink.text('Turn Off Kaleidovision').attr('href','//byutifu.com/#kVisionOff');
    		return false;
    	} else if(img.match(/#kVisionOff/g)){
    		e.preventDefault();
    		jQuery('canvas.kaleidoscope').hide('fast');
    		jQuery('.row').show();
    		activeLink.text('Kaleidovision').attr('href','//byutifu.com/#kaleidovision');
    		jQuery('nav ul.menu li a:contains("Content")').text('Show Background').attr('href','//byutifu.com/#hideContent');
    		return false;
    	}
    }).each(function(i){
    	var img = jQuery(this).attr('href');
    	var text = jQuery(this).text();
    	var re = new RegExp(text, 'g');
    	//if(!!window.HTMLCanvasElement){    jQuery(this).hide();	     } else {
    	if(text == 'Kaleidovision!' && window.location.href.match(re)){
    		//window.location.href = '#show-content';
    		var kscopeLink = jQuery(this);
    		setTimeout(function(){
    			kscopeLink.click();	
    		}, 500); 		
    	} else {
    		if(window.location.href.match(re)){
        		jQuery('body').css({backgroundImage: 'url('+img+')'});
            	jQuery('body > .body-kscope').attr('src', img);	
        	}
    	}
    });
});