function getScreenSize() {
	var w = window.innerWidth;
	if (w > 1200) return "xl";
	else if (w > 992) return "lg";
	else if (w > 768) return "md";
	else if (w > 544) return "sm";
	else return "xs";
}

var lang = $('html').attr('lang');

/* From Django documentation */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

var searchString = {};
window.location.search
  .replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
    searchString[key] = value;
  });

var hashString = {};
window.location.hash
  .replace(/[#&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
    hashString[key] = value;
  });

function _ga(id) {
    // Initialize GA
	window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
	ga('create', id, 'auto');

    /* Embedding ga autotrack plugins here */
    // 1. For cleaning URL
    ga('require', 'cleanUrlTracker', {
        stripQuery: true,
        queryDimensionIndex: 1,
        trailingSlash: 'remove',
    });

    // 2. Track specific events on specific elements
    // eg: <label ga-on="click" ga-event-category="info"> on element
    ga('require', 'eventTracker', {
        events: ['click', 'auxclick', 'contextmenu'],
        hitFilter: function (model, element, event) {
            model.set('eventAction', event.type, true);
        }
    });

    // 3. Track appearance of specific elements
    // Initialize with empty list to avoid errors; customize the tracking list in each page
    ga('require', 'impressionTracker', {
        elements: []
    });

    // 4. Track maximum scroll in a page
    // maxScrollMetricIndex: send maximum scroll to custom metric 1
    ga('require', 'maxScrollTracker', {
        maxScrollMetricIndex: 1,
    });

    // 5. Track responsive properties; not in use
    //ga('require', 'mediaQueryTracker');

    // 6. Track form submission to external domain; not in use
    //ga('require', 'outboundFormTracker');

    // 7. Track traffics going to external links
    ga('require', 'outboundLinkTracker', {
        events: ['click', 'auxclick', 'contextmenu']
    });

    // 8. Track interactions with social network buttion; not in use
    //ga('require', 'socialWidgetTracker');

    // 9. Track changes on URL in single page app or with History API; not in use
    //ga('require', 'urlChangeTracker');

    // 10. Monitor session duration based on visibility
    // sendInitialPageview: this handles firing the initial pageview
    // visibleMetricIndex: send visible time to custom metric 2
    ga('require', 'pageVisibilityTracker', {
        sendInitialPageview: true,
        visibleMetricIndex: 2
    });
    /* End of ga autotrack plugins */

    // Fire pageview
	//ga('send', 'pageview');
}

$.extend({
	redirectPost: function (location, args, target) {
		var form = $("<form><input type='hidden' name='csrfmiddlewaretoken' value="+csrftoken+"></form>");
        if (typeof target === 'undefined') {target='_self'};
        form.attr("target", target);
		form.attr("method", "post");
		form.attr("action", location);
		//form.attr("target", target);
		$.each(args, function (key, value) {
			var field = $('<input></input>');

			field.attr("type", "hidden");
			field.attr("name", key);
			field.attr("value", value);

			form.append(field);
		});
		$(form).appendTo('body').submit();
	}
});

function setMenuHighlight(id){
	$('#topbar-'+id+'-top').addClass('current')
}

$(function () {
    /*
    // Collapse ibox function
    $('.collapse-link').click( function() {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        //content.slideToggle(0);
		button.find('.fa-caret-up')
			.removeClass('fa-caret-up')
			.addClass('fa-caret-down');
		button.find('.fa-caret-down')
			.removeClass('fa-caret-down')
			.addClass('fa-caret-up');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    });

    // Close ibox function
    $('.close-link').click( function() {
        var content = $(this).closest('div.ibox');
        content.remove();
    });
    */

    // Small todo handler
    $('.check-link').click( function(){
        var button = $(this).find('i');
        var label = $(this).next('span');
		button.find('.fa-check-square')
			.removeClass('fa-check-square')
			.addClass('fa-square-o');
		button.find('.fa-square-o')
			.removeClass('fa-square-o')
			.addClass('fa-check-square');
        label.toggleClass('todo-completed');
        return false;
    });
});

// IE compatibility
if (!Math.trunc) {
	Math.trunc = function (number) { return number > 0 ? Math.floor(number) : Math.ceil(number); }
}
