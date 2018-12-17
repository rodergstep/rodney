$('#mainMenuToggler').click(function() {
  $(this).toggleClass('is-open');
  const windowWidth = $(window).width();
  if (windowWidth > 1200) {
    $('#mainMenu > .nav-item:lt(5)').toggleClass('opened');
  } else {
    $('#mainMenu').animate({ opacity: 'toggle', width: '100%', height: 'toggle' }, 400, () => {
      // Animation complete.
    });
  }
});
$(document).ready(() => {
  //activate wow.js
  if (document.querySelector('.wow')) {
    new WOW().init();
  }
  // sticky nav
  var nav = document.querySelector('.header');
  var topofNav = +nav.offsetHeight;
  function fixNav() {
    if (window.scrollY >= 50) {
      document.body.classList.add('header-bg-white');
    } else {
      document.body.classList.remove('header-bg-white');
    }
  }
  window.addEventListener('scroll', fixNav);
  // filter
  $('.filter__nav-btn').click(function() {
    var $filter = this.closest('.filter');
    var $filterDataValue = $(this).data('filter');
    $($filter).find('.is-current').removeClass('is-current');
    $(this).addClass('is-current');
    if ($filterDataValue === 'all') {
      $($filter).find('.filter__block').show();
    } else {
      $($filter).find('.filter__block:not([data-filter=' + $filterDataValue + '])').hide();
      $($filter).find('.filter__block[data-filter=' + $filterDataValue + ']').show();
    }
  });
  // end filter
  // Block reveal effects
  // Helper vars and functions.
  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  function createDOMEl(type, className, content) {
    var el = document.createElement(type);
    el.className = className || '';
    el.innerHTML = content || '';
    return el;
  }

  /**
	 * RevealFx obj.
	 */
  function RevealFx(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);
    this._init();
  }

  /**
	 * RevealFx options.
	 */
  RevealFx.prototype.options = {
    // If true, then the content will be hidden until it´s "revealed".
    isContentHidden: true,
    // The animation/reveal settings. This can be set initially or passed when calling the reveal method.
    revealSettings: {
      // Animation direction: left right (lr) || right left (rl) || top bottom (tb) || bottom top (bt).
      direction: 'lr',
      // Revealer´s background color.
      bgcolor: '#f0f0f0',
      // Animation speed. This is the speed to "cover" and also "uncover" the element (seperately, not the total time).
      duration: 500,
      // Animation easing. This is the easing to "cover" and also "uncover" the element.
      easing: 'easeInOutQuint',
      // percentage-based value representing how much of the area should be left covered.
      coverArea: 0,
      // Callback for when the revealer is covering the element (halfway through of the whole animation).
      onCover: function(contentEl, revealerEl) {
        return false;
      },
      // Callback for when the animation starts (animation start).
      onStart: function(contentEl, revealerEl) {
        return false;
      },
      // Callback for when the revealer has completed uncovering (animation end).
      onComplete: function(contentEl, revealerEl) {
        return false;
      },
    },
  };

  /**
	 * Init.
	 */
  RevealFx.prototype._init = function() {
    this._layout();
  };

  /**
	 * Build the necessary structure.
	 */
  RevealFx.prototype._layout = function() {
    var position = getComputedStyle(this.el).position;
    if (position !== 'fixed' && position !== 'absolute' && position !== 'relative') {
      this.el.style.position = 'relative';
    }
    // Content element.
    this.content = createDOMEl('div', 'block-revealer__content', this.el.innerHTML);
    if (this.options.isContentHidden) {
      this.content.style.opacity = 0;
    }
    // Revealer element (the one that animates)
    this.revealer = createDOMEl('div', 'block-revealer__element');
    this.el.classList.add('block-revealer');
    this.el.innerHTML = '';
    this.el.appendChild(this.content);
    this.el.appendChild(this.revealer);
  };

  /**
	 * Gets the revealer element´s transform and transform origin.
	 */
  RevealFx.prototype._getTransformSettings = function(direction) {
    var val, origin, origin_2;

    switch (direction) {
      case 'lr':
        val = 'scale3d(0,1,1)';
        origin = '0 50%';
        origin_2 = '100% 50%';
        break;
      case 'rl':
        val = 'scale3d(0,1,1)';
        origin = '100% 50%';
        origin_2 = '0 50%';
        break;
      case 'tb':
        val = 'scale3d(1,0,1)';
        origin = '50% 0';
        origin_2 = '50% 100%';
        break;
      case 'bt':
        val = 'scale3d(1,0,1)';
        origin = '50% 100%';
        origin_2 = '50% 0';
        break;
      default:
        val = 'scale3d(0,1,1)';
        origin = '0 50%';
        origin_2 = '100% 50%';
        break;
    }

    return {
      // transform value.
      val: val,
      // initial and halfway/final transform origin.
      origin: { initial: origin, halfway: origin_2 },
    };
  };

  /**
	 * Reveal animation. If revealSettings is passed, then it will overwrite the options.revealSettings.
	 */
  RevealFx.prototype.reveal = function(revealSettings) {
    // Do nothing if currently animating.
    if (this.isAnimating) {
      return false;
    }
    this.isAnimating = true;

    // Set the revealer element´s transform and transform origin.
    var defaults = {
      // In case revealSettings is incomplete, its properties deafault to:
      duration: 500,
      easing: 'easeInOutQuint',
      delay: 0,
      bgcolor: '#f0f0f0',
      direction: 'lr',
      coverArea: 0,
    },
      revealSettings = revealSettings || this.options.revealSettings,
      direction = revealSettings.direction || defaults.direction,
      transformSettings = this._getTransformSettings(direction);

    this.revealer.style.WebkitTransform = this.revealer.style.transform = transformSettings.val;
    this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin = transformSettings.origin.initial;

    // Set the Revealer´s background color.
    this.revealer.style.backgroundColor = revealSettings.bgcolor || defaults.bgcolor;

    // Show it. By default the revealer element has opacity = 0 (CSS).
    this.revealer.style.opacity = 1;

    // Animate it.
    var self = this,
      // Second animation step.
      animationSettings_2 = {
        complete: function() {
          self.isAnimating = false;
          if (typeof revealSettings.onComplete === 'function') {
            revealSettings.onComplete(self.content, self.revealer);
          }
        },
      },
      // First animation step.
      animationSettings = {
        delay: revealSettings.delay || defaults.delay,
        complete: function() {
          self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway;
          if (typeof revealSettings.onCover === 'function') {
            revealSettings.onCover(self.content, self.revealer);
          }
          anime(animationSettings_2);
        },
      };

    animationSettings.targets = animationSettings_2.targets = this.revealer;
    animationSettings.duration = animationSettings_2.duration = revealSettings.duration ||
      defaults.duration;
    animationSettings.easing = animationSettings_2.easing = revealSettings.easing ||
      defaults.easing;

    var coverArea = revealSettings.coverArea || defaults.coverArea;
    if (direction === 'lr' || direction === 'rl') {
      animationSettings.scaleX = [ 0, 1 ];
      animationSettings_2.scaleX = [ 1, coverArea / 100 ];
    } else {
      animationSettings.scaleY = [ 0, 1 ];
      animationSettings_2.scaleY = [ 1, coverArea / 100 ];
    }

    if (typeof revealSettings.onStart === 'function') {
      revealSettings.onStart(self.content, self.revealer);
    }
    anime(animationSettings);
  };

  window.RevealFx = RevealFx;
  // end Block reveal effects
  var watcher = [];
  var reveal = [];
  $('.rev-effect').each(function(i) {
    watcher[i] = scrollMonitor.create($(this)[0], -300);
    var direction = $(this).hasClass('rev-effect--rl') ? 'rl' : 'lr';
    reveal[i] = new RevealFx($(this)[0], {
      revealSettings: {
        bgcolor: 'grey',
        direction: direction,
        onCover: function(contentEl, revealerEl) {
          contentEl.style.opacity = 1;
        },
      },
    });
    watcher[i].enterViewport(function() {
      reveal[i].reveal();
      watcher[i].destroy();
    });
  });
  // Google Map
  let googleMapsLoaded = false;
  var locations = [
    [ 'Bondi Beach', -33.890542, 151.274856, 4 ],
    [ 'Coogee Beach', -33.923036, 151.259052, 5 ],
    [ 'Cronulla Beach', -34.028249, 151.157507, 3 ],
    [ 'Manly Beach', -33.80010128657071, 151.28747820854187, 2 ],
    [ 'Maroubra Beach', -33.950198, 151.259302, 1 ],
  ];
  window.initMaps = function() {
    const $maps = $('.map-canvas');
    if ($maps.length) {
      if (!googleMapsLoaded) {
        const key = 'AIzaSyDe4WeeWQ8_mWVwzL0Z9j3S4MpM6Of17wo';
        $
          .getScript(`https://maps.google.com/maps/api/js?sensor=true&key=${key}`)
          .done((script, textStatus) => {
            googleMapsLoaded = true;
            createMaps($maps);
          })
          .fail((jqxhr, settings, ex) => {
          });
      } else {
        createMaps($maps);
      }
    }
  };

  window.createMaps = function($maps) {
    $maps.each(function() {
      let latitude = this.getAttribute('data-latitude');
      let longitude = this.getAttribute('data-longitude');
      if (!latitude && !longitude) {
        latitude = '-34.028249';
        longitude = '151.157507';
      }
      const mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(latitude, longitude),
        marker: true,
        scrollwheel: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [ { saturation: 36 }, { color: '#d5d5d5' }, { lightness: 40 } ],
          },
          {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [ { visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 } ],
          },
          { featureType: 'all', elementType: 'labels.icon', stylers: [ { visibility: 'off' } ] },
          { featureType: 'administrative', elementType: 'all', stylers: [ { visibility: 'off' } ] },
          {
            featureType: 'administrative',
            elementType: 'geometry.fill',
            stylers: [ { color: '#fefefe' }, { lightness: 20 } ],
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [ { color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 } ],
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [ { lightness: 20 }, { color: '#ececec' } ],
          },
          {
            featureType: 'landscape.man_made',
            elementType: 'all',
            stylers: [ { visibility: 'on' }, { color: '#fafafa' } ],
          },
          {
            featureType: 'landscape.man_made',
            elementType: 'geometry.fill',
            stylers: [ { visibility: 'on' }, { color: '#fafafa' } ],
          },
          {
            featureType: 'landscape.man_made',
            elementType: 'geometry.stroke',
            stylers: [ { visibility: 'on' }, { color: '#eaeaea' } ],
          },
          {
            featureType: 'landscape.natural',
            elementType: 'all',
            stylers: [ { visibility: 'on' }, { color: '#ececec' } ],
          },
          { featureType: 'poi', elementType: 'all', stylers: [ { visibility: 'on' } ] },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [ { lightness: 21 }, { visibility: 'off' } ],
          },
          {
            featureType: 'poi',
            elementType: 'geometry.fill',
            stylers: [ { visibility: 'on' }, { color: '#eaeaea' } ],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [ { color: '#d5d5d5' } ],
          },
          { featureType: 'poi', elementType: 'labels.icon', stylers: [ { saturation: '-100' } ] },
          { featureType: 'poi.attraction', elementType: 'all', stylers: [ { visibility: 'on' } ] },
          { featureType: 'poi.business', elementType: 'all', stylers: [ { visibility: 'on' } ] },
          { featureType: 'poi.government', elementType: 'all', stylers: [ { visibility: 'on' } ] },
          { featureType: 'poi.medical', elementType: 'all', stylers: [ { visibility: 'on' } ] },
          { featureType: 'poi.park', elementType: 'all', stylers: [ { visibility: 'on' } ] },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [ { color: '#dedede' }, { lightness: 21 } ],
          },
          {
            featureType: 'poi.place_of_worship',
            elementType: 'all',
            stylers: [ { visibility: 'on' } ],
          },
          { featureType: 'poi.school', elementType: 'all', stylers: [ { visibility: 'on' } ] },
          {
            featureType: 'poi.school',
            elementType: 'geometry.stroke',
            stylers: [ { lightness: '-61' }, { gamma: '0.00' }, { visibility: 'off' } ],
          },
          {
            featureType: 'poi.sports_complex',
            elementType: 'all',
            stylers: [ { visibility: 'on' } ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [ { color: '#ffffff' }, { lightness: 17 } ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [ { color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 } ],
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [ { color: '#ffffff' }, { lightness: 18 } ],
          },
          {
            featureType: 'road.local',
            elementType: 'geometry',
            stylers: [ { color: '#ffffff' }, { lightness: 16 } ],
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [ { color: '#f2f2f2' }, { lightness: 19 } ],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [ { color: '#eaeaea' }, { lightness: 17 } ],
          },
        ],
      };
      const mapCanvas = $(this).get(0);
      const map = new google.maps.Map(mapCanvas, mapOptions);
      const myLatLong = new google.maps.LatLng(latitude, longitude);
      // mapOptions.center = myLatLong;
      var infowindow = new google.maps.InfoWindow();
      var marker, i;

      for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          map: map,
          icon: {
            url: "data:image/svg+xml;charset=utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='21' height='23' viewBox='0 0 32 32'%3E%3Cpath d='M15.938 32c0 0-9.938-14.062-9.938-20.062 0-11.813 9.938-11.938 9.938-11.938s10.062 0.125 10.062 11.875c0 6.187-10.062 20.125-10.062 20.125zM16 6c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z'%3E%3C/path%3E%3C/svg%3E",
          },
        });

        google.maps.event.addListener(
          marker,
          'click',
          (function(marker, i) {
            return function() {
              infowindow.setContent(locations[i][0]);
              infowindow.open(map, marker);
            };
          })(marker, i),
        );
      }
    });
  };
  initMaps();
  // Custom select
  let x, i, j, selElmnt, a, b, c;
  /* look for any elements with the class "select-custom": */
  x = document.getElementsByClassName('select-custom');
  for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName('select')[0];
    /* for each element, create a new DIV that will act as the selected item: */
    a = document.createElement('DIV');
    a.setAttribute('class', 'select-selected');
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* for each element, create a new DIV that will contain the option list: */
    b = document.createElement('DIV');
    b.setAttribute('class', 'select-items select-hide');
    for (j = 1; j < selElmnt.length; j++) {
      /* for each option in the original select element,
    create a new DIV that will act as an option item: */
      c = document.createElement('DIV');
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener('click', function(e) {
        /* when an item is clicked, update the original select box,
        and the selected item: */
        let y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName('select')[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName('same-as-selected');
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute('class');
            }
            this.setAttribute('class', 'same-as-selected');
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener('click', function(e) {
      /* when the select box is clicked, close any other select boxes,
      and open/close the current select box: */
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle('select-hide');
      this.classList.toggle('select-arrow-active');
    });
  }
  function closeAllSelect(elmnt) {
    /* a function that will close all select boxes in the document,
  except the current select box: */
    let x, y, i, arrNo = [];
    x = document.getElementsByClassName('select-items');
    y = document.getElementsByClassName('select-selected');
    for (i = 0; i < y.length; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove('select-arrow-active');
      }
    }
    for (i = 0; i < x.length; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('select-hide');
      }
    }
  }
  /* if the user clicks anywhere outside the select box,
then close all select boxes: */
  document.addEventListener('click', closeAllSelect);
});

// Smooth scroll
var $window = $(window);
//Window object
var scrollTime = 0.3;
//Scroll time
var scrollDistance = 120;

//Distance. Use smaller value for shorter scroll and greater value for longer scroll
$window.on('mousewheel DOMMouseScroll', function(event) {
  event.preventDefault();

  var delta = event.originalEvent.wheelDelta / 120 || (-event.originalEvent.detail) / 3;
  var scrollTop = $window.scrollTop();
  var finalScroll = scrollTop - parseInt(delta * scrollDistance);

  TweenMax.to($window, scrollTime, {
    scrollTo: { y: finalScroll, autoKill: true },
    ease: Power1.easeOut,
    //For more easing functions see https://api.greensock.com/js/com/greensock/easing/package-detail.html
    autoKill: true,
    overwrite: 5,
  });
});
// Smooth scroll
// Parallax
var item = document.querySelector('.parallax-item');
if (item) {
  var size = document.body.clientHeight;

  var animation = TweenLite.to('.parallax-target', 1, {
    yPercent: -25,
    ease: Linear.easeNone,
    paused: true,
  });

  window.addEventListener('load', function() {
    TweenLite.ticker.addEventListener('tick', update);
  });

  function update() {
    var min = item.offsetTop - size;
    var max = item.offsetTop + item.offsetHeight;

    var norm = clamp(normalize(window.pageYOffset, min, max), 0, 1);

    animation.progress(norm);
  }

  function normalize(value, min, max) {
    return (value - min) / (max - min);
  }

  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }
}
// Parallax
// Video from youtube
function findVideos() {
  let videos = document.querySelectorAll('.video');

  for (let i = 0; i < videos.length; i++) {
    setupVideo(videos[i]);
  }
}

function setupVideo(video) {
  let link = video.querySelector('.video__link');
  let media = video.querySelector('.video__media');
  let button = video.querySelector('.video__button');
  let id = parseMediaURL(media);

  video.addEventListener('click', () => {
    let iframe = createIframe(id);

    link.remove();
    button.remove();
    video.appendChild(iframe);
  });

  link.removeAttribute('href');
  video.classList.add('video--enabled');
}

function parseMediaURL(media) {
  let regexp = /https:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\/maxresdefault\.jpg/i;
  let url = media.src;
  let match = url.match(regexp);

  return match[1];
}

function createIframe(id) {
  let iframe = document.createElement('iframe');

  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay');
  iframe.setAttribute('src', generateURL(id));
  iframe.classList.add('video__media');

  return iframe;
}

function generateURL(id) {
  let query = '?rel=0&showinfo=0&autoplay=1';

  return 'https://www.youtube.com/embed/' + id + query;
}

findVideos();
// edn Video from youtube

//# sourceMappingURL=app.js.map
