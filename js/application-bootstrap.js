$(document).ready(initializeApplication);

//initializeApplication
//initialize html5 application when document ready
//params:
//return:
function initializeApplication()
{
    console.log('initializeApplication', arguments);

    // Delegate .transition() calls to .animate()
    // if the browser can't do CSS transitions.
    if (!$.support.transition) {
        $.fn.transition = $.fn.animate;
    }
    //setup list slide
    $('.listslide').listslide({
      pauseInterval: 2000,
      slideSpeed: 1000
    });
}
