$(document).ready(initializeApplication);

function initializeApplication()
{
    // Delegate .transition() calls to .animate()
    // if the browser can't do CSS transitions.
    if (!$.support.transition) {
        $.fn.transition = $.fn.animate;
    }
    //setup list slide
    $('.listslide').listslide({
      pauseInterval: 3000,
      slideSpeed: 1000
    });
}
