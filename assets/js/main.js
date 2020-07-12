$(window).keydown(function(event) {
  if(event.ctrlKey && event.keyCode == 84) { 
    console.log("Hey! Ctrl+T event captured!");
    event.preventDefault(); 
  }
  if(event.ctrlKey && event.keyCode == 83) { 
    console.log("Hey! Ctrl+S event captured!");
    event.preventDefault(); 
  }
});


$(window).on('beforeunload', function() {
    console.log("Loading...");
});

// jQuery
$.getScript('https://cdn.jsdelivr.net/npm/@widgetbot/crate@3', function()
{
    new Crate({
        server: '717245773854801951',
        channel: '728413259396284436'
    })
});

(function($) {

    skel.breakpoints({
        xlarge:	'(max-width: 1680px)',
        large:	'(max-width: 1280px)',
        medium:	'(max-width: 980px)',
        small:	'(max-width: 736px)',
        xsmall:	'(max-width: 480px)'
    });

    $(function() {

        var	$window = $(window),
            $body = $('body'),
            $header = $('#header'),
            $banner = $('#banner');

        // Disable animations/transitions until the page has loaded.
            $body.addClass('is-loading');
            			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

        // Prioritize "important" elements on medium.
            skel.on('+medium -medium', function() {
                $.prioritize(
                    '.important\\28 medium\\29',
                    skel.breakpoint('medium').active
                );
            });

        // Fix: Placeholder polyfill.
            $('form').placeholder();

        // Header.
            if (skel.vars.IEVersion < 9)
                $header.removeClass('alt');

            if ($banner.length > 0
            &&	$header.hasClass('alt')) {

                $window.on('resize', function() { $window.trigger('scroll'); });

                $banner.scrollex({
                    bottom:		$header.outerHeight(),
                    terminate:	function() { $header.removeClass('alt'); },
                    enter:		function() { $header.addClass('alt'); },
                    leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
                });

            }

        // Banner.

            if ($banner.length > 0) {

                // IE fix.
                    if (skel.vars.IEVersion < 12) {

                        $window.on('resize', function() {

                            var wh = $window.height() * 0.60,
                                bh = $banner.height();

                            $banner.css('height', 'auto');

                            window.setTimeout(function() {

                                if (bh < wh)
                                    $banner.css('height', wh + 'px');

                            }, 0);

                        });

                        $window.on('load', function() {
                            $window.triggerHandler('resize');
                        });

                    }

                // Video check.
                    var video = $banner.data('video');

                    if (video)
                        $window.on('load.one', function() {
                            // Disable banner load event (so it doesn't fire again).
                                $window.off('load.banner');
                        });

                // More button.
                    $banner.find('.more')
                        .addClass('scrolly');

            }

        // Scrolly.
            if ( $( ".scrolly" ).length ) {

                var $height = $('#header').height() * 0.95;

                $('.scrolly').scrolly({
                    offset: $height
                });
            }

        // Menu.
            $('#menu')
                .append('<a href="#menu" class="close"></a>')
                .appendTo($body)
                .panel({
                    delay: 500,
                    hideOnClick: true,
                    hideOnSwipe: true,
                    resetScroll: true,
                    resetForms: true,
                    side: 'right'
                });

    });

})(jQuery);

if (document.addEventListener) {
  document.addEventListener('contextmenu', function(e) {
    // alert("You've tried to open context menu"); //here you draw your own menu
    e.preventDefault();
  }, false);
} else {
  document.attachEvent('oncontextmenu', function() {
    window.event.returnValue = false;
  });
}