//Using "Transition" from "Transit". If not Transit, use "animate"
if (typeof jQuery === "undefined") {
  throw "This widget requires jquery module to be loaded";
}
(function($){
  var listSlideObj = {
      options: {
        liWidth: 100, //should be width of your li's
        offsetVal: 0, //if the liwidth needs tweaking use this
        liSelector: 'li',
        ulSelector: 'ul',
        filmstripSelector: '.filmstrip',
        duplicateListClass: 'duplicateList',
        automate: true,
        pauseInterval: 3000, //time in millisecionds between slides
        slideSpeed: 800 //speed in milliseconds the slider moves
    },
    //**********************//
    //    PRIVATE METHODS    //
    //**********************//
    _create: function () {
    },
    _init: function() {
      var self = this,
        $window = $( window );
      this.currentLI = 0; //start the list at 0
      this.listPosArr = []; //array to cache filmstrip positions. need to redo if those LIs have flexible width
      this.$filmStrip = this.element.find(this.options.filmstripSelector);  //store the filmstrip
      this.ulEl = this.$filmStrip.find(this.options.ulSelector); //store the ul
      this.liArr = this.ulEl.find(this.options.liSelector); //cache the lis in an array
      this.slideTimer = null; //timer to move playhead
      this.isEnabled = false; //track if the slider is enabled
      this.isSliding = false; //track if the slider is actively sliding
      this.userStopped = false; //track if the user asked the slider to stop (so it doesn't reenable on resize by accident)
      this.ulElWidth = (this.options.liWidth + this.options.offsetVal) * this.liArr.length; //store the ul's width for quicker size checking, again, assuming this isn't dynamic
      this.$clone = ''; //store a value for the cloned ul element
      this._duplicateList( this.ulEl ); //for seamless restart
      this._populatePosArr(this.liArr); //populate array of move values
      console.log(this.ulElWidth);

      //bind resize event that only fires once on resize end.
      //this does require ben allmans jquery-throttle-debounce plugin
      $window.on('resize', $.debounce( 250, function () {
        self.sizeCheck();
      } ));

      //if set to automate start the loop
      if (this.options.automate && !this._checkSize() ) {
        this._slideStart();
      }
    },
    _duplicateList: function ($list) {
      this.$clone = $list.clone().addClass( this.options.duplicateListClass );
      this.$cloneTwo = this.$clone.clone();
      if (this._checkSize()) {
        this.$clone.hide();
        this.$cloneTwo.hide();
      }
      this.$filmStrip.append(this.$clone).append(this.$cloneTwo);
    },
    _populatePosArr: function (liArr) {
      var i = 0,
        lSize = this.options.liWidth,
        arrLen = liArr.length * 2;
      for (; i<arrLen; i++) {
        this.listPosArr.push( - ( i * ( lSize + this.options.offsetVal ) ) );
      }
    },
    _getIttr: function () {
      var elWidth = this.element.width(),
      moveVal = Math.floor( elWidth / this.options.liWidth ) - 1;
      return moveVal;
    },
    _slideStart: function () {
      var self = this;
      self.slideTimer = window.setInterval( function() {
        self.slideListContainer();
      }, self.options.pauseInterval );
      self.isEnabled = true;
    },
    _slideStop: function () {
      window.clearInterval( this.slideTimer );
      this.isEnabled = false;
    },
    _checkSize: function () {
      return this.element.width() >= this.ulElWidth;
    },
    //**********************//
    //    PUBLIC METHODS    //
    //**********************//
    slideListContainer: function (v) {
      // if v doesn't exist calc it based on window width
      var self = this,
        toMove = (v) ? v : this._getIttr(),
        lookupVal = this.currentLI + toMove; // move margin-left to that value

      this.$filmStrip.transition( {"margin-left": this.listPosArr[lookupVal]}, this.options.slideSpeed, function () {
        //if we moved into the duplicate array rewind the playhead
        if (lookupVal >= self.liArr.length) {
          var newval = lookupVal - self.liArr.length;
          self.$filmStrip.css("margin-left", self.listPosArr[newval]);
          self.currentLI = newval;
        } else {
          // set new current frame
          self.currentLI += toMove;
        }
      });
    },
    startSliding: function () {
      this._slideStart();
      this.userStopped = false;
    },
    stopSliding: function () {
      this._slideStop();
      this.userStopped = true;
    },
    sizeCheck: function () {
      if ( this._checkSize() ) {
        // is enabled? if so disable
        if (this.isEnabled) {
          this._slideStop();
          this.$filmStrip.stop(true).transition({'margin-left': 0}, 200);
          this.$clone.hide();
          this.$cloneTwo.hide();
        }
      } else {
        // is disabled? if so enable
        if (!this.isEnabled && !this.userStopped) {
          this._slideStart();
          this.$clone.css("display", "inline-block");
          this.$cloneTwo.css("display", "inline-block");
        }
      }
    }
  };

  $.widget( 'ui.listslide', listSlideObj );
  /**
  * Example
  * $( '#myID' ).listslide();
  **/
})(jQuery);
