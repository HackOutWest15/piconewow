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
  exports.card = function (cardid, showId, artist, day, stage, startTime, artistBio, artistImgPath, friends) { //cardid, title,genre,rating,runningTime,release, desc, imgpath,trailerpath,actors
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
        str +='<section class="Show-cover front""><section class="Artist-img"><div class="artist-image-div" style="background: url('+artistImgPath+');"></div></section><!-- .Artist-img -->';
        str +='<section ="Artist-box"><div><h2>'+artist+'</h2><p><span style="font-weight: bold; font-size:20px;">'+day+'</span><br />Stage: \t<span style="font-weight: bold; font-size:20px;">'+stage+'</span><br />Start time:\t<span style="font-weight: bold; font-size:20px;">'+startTime+'</span></p><div class="Button Button-rounded Button-small" id="button-play"  ><div class="Button-text-center">Listen<span class="play-btn"> ►</span></div></div></section><!-- .artist-box --> </section><section class="Show-info back">';
        str+='<section class="Artist-details"><h3>Artist bio: </h3> <p class="truncate"> '+artistBio+'</p> </section> <!-- .Artist-details --><h3>Friends attending:</h3>';
 
          if(friends.length>0){
            var friendsHTML = "<div class='friends-row-wrapper'><div id='friends-row'>"
            for(var f = 0;f<friends.length;f++){
              friendsHTML +="<div class='friend-list-item'>";
              var url = "http://graph.facebook.com/" + friends[f].facebookId + "/picture?type=large";
              friendsHTML +="<div class='friend-circle' style='background-image:url("+url+")'></div>"
              friendsHTML +="<span>"+friends[f].name+"</span></div>";
            }
            friendsHTML+="</div></div>";
            str+=friendsHTML;
          }
        str+='</section> <!-- .Artist-info --> </div> <!-- .flipper --> </div> <!-- .flip-container --> </div></div></div></section>';
  
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