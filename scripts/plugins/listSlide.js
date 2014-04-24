//TODO
// - redo "getIttr" function for actual calcs
// - remove options.liwidth
// - add nav buttons


//Using "Transition" from "Transit". If not Transit, use "animate"
if (typeof jQuery === "undefined") {
  throw "This widget requires jquery module to be loaded";
}
(function($){
  var listSlideObj = {
      options: {
        liWidth: 105, //should be width of your li's - calc this
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
      // -- Store variables -- //
      this.currentLI = 0; //start the list at 0
      this.calcOffsetVal = 0; //store a value to use for the inline-block offset
      this.slideTimer = null; //timer to move playhead
      this.$clone = null; //store a value for the cloned ul element
      this.isEnabled = false; //track if the slider is enabled
      this.isSliding = false; //track if the slider is actively sliding
      this.userStopped = false; //track if the user asked the slider to stop (so it doesn't reenable on resize by accident)
      this.listPosArrNew = []; //array to cache filmstrip positions. need to redo if those LIs have flexible width
      this.$filmStrip = this.element.find(this.options.filmstripSelector);  //store the filmstrip
      this.$ulEl = this.$filmStrip.find(this.options.ulSelector); //store the ul
      this.ulElWidth = this.$ulEl.outerWidth(); //store the ul's width for quicker size checking, again, assuming this isn't dynamic

      //cache the lis in an array
      this.$liArr = [];
      this.liSizeArr = [];
      $(this.options.liSelector, this.$ulEl).each( function () {
        self.$liArr.push($(this));
      });

      this._calcSizes();
      this._duplicateList( this.$ulEl ); //for seamless restart

      // -- Bind Events -- //
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
    _calcSizes: function () {
      var liSize = 0,
        len = this.$liArr.length,
        tmpSize = 0,
        tmpArrVal = 0,
        tmpIndexVal = 0,
        tmpSizeArr = [0];
      // calc li widths
      for (var i=0; i<len; i++) {
        tmpSize = this.$liArr[i].outerWidth();
        liSize += tmpSize;
        tmpSizeArr.push(tmpSize);
      }
      // use actual ul with to determine offset
      this.calcOffsetVal = - Math.round((this.ulElWidth - liSize) / (this.$liArr.length - 1)) + 'px';
      // assign the offset val to close the gaps
      for (var j=1; j<len; j++) {
        this.$liArr[j].css('margin-left', this.calcOffsetVal);
      }
      // calc positional array
      for (var k=0; k<(len * 2); k++) {
        tmpIndexVal = (k>len) ? k - len : k;
        this.listPosArrNew.push(tmpArrVal - tmpSizeArr[tmpIndexVal]);
        tmpArrVal = this.listPosArrNew[k];
      }
    },
    _duplicateList: function ($list) {
      this.$clone = $list.clone().addClass( this.options.duplicateListClass ).css('margin-left', this.calcOffsetVal);
      this.$cloneTwo = this.$clone.clone().css('margin-left', 0);
      if (this._checkSize()) {
        this.$clone.hide();
        this.$cloneTwo.hide();
      }
      this.$filmStrip.append(this.$clone).append(this.$cloneTwo);
    },
    _getIttr: function () {
      // how far will we moved based on the number of elements fitting on the screen.

      //how big is the main element?
      // take current position, find in width array, keep adding values of array items and add to counter until hit element width
      // return final counter val
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

      this.$filmStrip.transition( {"margin-left": this.listPosArrNew[lookupVal]}, this.options.slideSpeed, function () {
        //if we moved into the duplicate array rewind the playhead
        if (lookupVal >= self.$liArr.length) {
          var newval = lookupVal - self.$liArr.length;
          self.$filmStrip.css("margin-left", self.listPosArrNew[newval]);
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
