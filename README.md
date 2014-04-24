# listslide
A carousel of items that is fully responsive

## Technology
The styles are compiled to CSS, but the base code was written using SASS. This allows for variables, mixins, modularized CSS, and more. You can learn more about SASS at http://sass-lang.com/.

## Dependencies
+ [Transit](http://ricostacruz.com/jquery.transit/) - Used for hardware accelerated animations that mimic the jquery animation api for callbacks
+ [Jquery](http://jquery.com/) - Cross browser compatibility
+ [JqueryUI](http://jqueryui.com/) - Used for the widget factory
+ [Throttle/Debounce](http://benalman.com/projects/jquery-throttle-debounce-plugin/) - Used to debounce window resize events. So only one event will fire at the end of a resize regardless of the browser.

## File Structure
+ **styles** - Sass and CSS files
  + **example-skin** - the skin to show the example on the index page
  + **list-slide** - code to make the list-slide work
+ **scripts** - Scripts

## Create a Build (using Terminal on a MAC)
+ Ensure you have Sass by opening terminal and typing: *sass -v*
+ Navigate to the base folder of this repo *listslide*
+ Run: *sass --watch styles:styles*

## To Do
** listslide.js **
+ redo "getIttr" function for actual calcs
+ remove options.liwidth
+ add nav buttons?

## Known Issues
+ Based on assumption that ULs and LIs won't change in size after initialization
+ Bassed on assumption UL and LIs have the same font-size.

### License
The MIT License (MIT)