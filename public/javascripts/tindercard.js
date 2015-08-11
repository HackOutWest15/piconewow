/*jslint browser: true*/
/*global console, Hammer, $*/

/**
 * Tindercards.js
 *
 * @author www.timo-ernst.net
 * @module Tindercardsjs
 * License: MIT
 */
var Tindercardsjs = Tindercardsjs || {};

Tindercardsjs = (function () {
  'use strict';
  
  var exports = {};
  
  /**
   * Represents one card
   *
   * @memberof module:Tindercardsjs
   * @class
   */
  exports.card = function (cardid, showId, artist, stage, startTime, artistBio, artistImgPath) { //cardid, title,genre,rating,runningTime,release, desc, imgpath,trailerpath,actors
    var jqo;
    /**
     * Returns a jQuery representation of this card
     *
     * @method
     * @public
     * @return {object} A jQuery representation of this card
     */
    this.tojQuery = function () {
      if (!jqo) {
        var str  = '<section class="Show-main"><div class="u-center-vertical-wrap"><div class="u-center-vertical"><div class="Show"> <div class="flip-container" style="pointer:cursor;"> <div class="flipper">'; 
        str +='<section class="Show-cover front""><section class="Artist-img"><img src="'+artistImgPath+'"></section>!-- .Artist-img -->';
        str +='<section ="artist-box"><div><h3>'+artist+'</h3><p>'+stage+\t+startTime+'</p></section><!-- .artist-box --> <section class="Show-info back">';
        str+='<section class="Artist-details"> <p class="truncate"> '+artistBio+'</p> </section> <!-- .Artist-details -->';
        str+='"</section> <!-- .Artist-info --> </div> <!-- .flipper --> </div> <!-- .flip-container --> </div></div></div></section>';
  
        //jqo = $('<div class="tc-card">').attr('data-cardid', cardid).html('<div class="tc-card-img-cont"><img src="' + imgpath + '" class="tc-card-img"><div class="tc-card-body"><h2 class="tc-card-name">' + title + '</h2><span class="tc-card-desc">' + desc + '</span></div></div>');
        jqo = $('<div class="tc-card">').attr('data-cardid', cardid).html(str);

      }
      return jqo;
    };

  };
  
  /**
   * Initializes swipe
   *
   * @private
   * @function
   */
   var $card;
   var onSwiped;
  function initSwipe(ons,animation) {
    var $topcard = $('.tc-card'),
      deltaX = 0;
      onSwiped =ons;

    $topcard.each(function () {

      $card = $(this);

      (new Hammer(this)).on("panleft panright panend panup pandown", function (ev) {
        var transform,
          yfactor = ev.deltaX >= 0 ? -1 : 1;

        if (ev.type === 'panend') {
          panned(deltaX, yfactor);
        } else if (ev.type === 'panup' || ev.type === 'pandown') {
          // No vertical scroll
          ev.preventDefault();
        } else {
          deltaX = ev.deltaX;

          transform = 'translate3d(' + deltaX + 'px, ' + (yfactor * 0.15 * deltaX) + 'px, 0)';

          $card.css({
            '-webkit-transform': transform + ' rotate(' + ((1 * deltaX) / 10) + 'deg)',
            '-moz-transform': transform + ' rotate(' + ((1 * deltaX) / 10) + 'deg)',
            'transform': transform + ' rotate(' + ((1 * deltaX) / 10) + 'deg)',
          });
          if(deltaX>0){
              var bg = $('#feedback-yes'); 
              bg.css({'opacity':deltaX/300});
          }else{
            var bg = $('#feedback-no'); 
            bg.css({'opacity':-deltaX/300});
          }
        }
      });
    });
  }
  
  
  function panned(deltaX){
    var resultEvent = {};
    //hide feedback
    $('#feedback-yes').fadeTo(300,0);
    $('#feedback-no').fadeTo(300,0);
    
    var  yfactor = deltaX >= 0 ? -1 : 1;
    if (deltaX > 100 || deltaX < -100) {
      var transform = 'translate3d(' + (5 * deltaX) + 'px, ' + (yfactor * 1.5 * deltaX) + 'px, 0)';
      $card.css({
        '-webkit-transition': '-webkit-transform 0.5s',
        '-moz-transition': '-moz-transform 0.5s',
        'transition': 'transform 0.5s',
        '-webkit-transform': transform + ' rotate(' + ((5 * deltaX) / 10) + 'deg)',
        '-moz-transform': transform + ' rotate(' + ((5 * deltaX) / 10) + 'deg)',
        'transform': transform + ' rotate(' + ((5 * deltaX) / 10) + 'deg)'

      });
      animation((deltaX > 100)?"right":"left");
      setTimeout(function () {
        $card.css({
          'display': 'none'
        });
        if (typeof onSwiped === 'function') {
          resultEvent.cardid = $card.attr('data-cardid');
          resultEvent.card = $card;
          if (deltaX > 100) {
            resultEvent.direction = 'right';
          } else {
            resultEvent.direction = 'left';
          }
          onSwiped(resultEvent);
        } else {
          console.warn('onSwipe callback does not exist!');
        }
      }, 500);
    } else {
      var transform = 'translate3d(0px, 0, 0)';
      $card.css({
        '-webkit-transition': '-webkit-transform 0.3s',
        'transition': 'transform 0.3s',
        '-moz-transition': '-moz-transform 0.3s',
        '-webkit-transform': transform + ' rotate(0deg)',
        '-moz-transform': transform + ' rotate(0deg)',
        'transform': transform + ' rotate(0deg)'
      });
      setTimeout(function () {
        $card.css({
          '-webkit-transition': '-webkit-transform 0s',
          '-moz-transition': '-moz-transform 0s',
          'transition': 'transform 0s'
        });
      }, 300);
    }
  }
  exports.pan = panned;
  
  /**
   * Renders the given cards
   *
   * @param {array} cards The cards (must be instanceof Tindercardsjs.card)
   * @param {jQuery} $target The container in which the cards should be rendered into
   * @param {function} onSwiped Callback when a card was swiped
   * @example Tindercardsjs.render(cards, $('#main'));
   * @method
   * @public
   * @memberof module:Tindercardsjs
   */
  exports.render = function (cards, $target, onSwiped,animation) {
    var i,
      $card;
    
    if (cards) {
      $target.find('.tc-card').remove();
      for (i = 0; i < cards.length; i = i + 1) {
        $card = cards[i].tojQuery().prependTo($target).css({
          'padding-top': '0',
        });
        $('#load').hide();
        $('.truncate').succinct({size:350});
        $('.truncate').on('click',expandPlot);
      }
      
      initSwipe(onSwiped,animation);
      
    } else {
      console.warn('tindercards array empty, no cards will be displayed');
    }
  };
  function expandPlot(evt){
    //DAVID HÄR
  }
  
  return exports;
  
}());