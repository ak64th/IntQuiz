(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var UIMixin, app;

UIMixin = require('ui-mixin');

app = {};

_.extend(app, UIMixin);

app.initUI = function() {
  this.layout.activate();
  this.pushMenu.activate();
  return this.tree();
};

$(function() {
  return app.initUI();
});


},{"ui-mixin":2}],2:[function(require,module,exports){
module.exports = {
  layout: {
    activate: function() {
      var self;
      self = this;
      self.fix();
      return $(window, ".wrapper").resize(function() {
        return self.fix();
      });
    },
    fix: function() {
      var neg, sidebar_height, window_height;
      neg = $(".main-header").outerHeight() + $(".main-footer").outerHeight();
      window_height = $(window).height();
      sidebar_height = $(".sidebar").height();
      if (window_height >= sidebar_height) {
        return $(".content-wrapper").css("min-height", window_height - neg);
      } else {
        return $(".content-wrapper").css("min-height", sidebar_height);
      }
    }
  },
  pushMenu: {
    activate: function() {
      $('#collapseToggle').on("click", function(e) {
        e.preventDefault();
        if ($(window).width() > (768 - 1)) {
          if ($("body").hasClass("sidebar-collapse")) {
            return $("body").removeClass("sidebar-collapse");
          } else {
            return $("body").addClass("sidebar-collapse");
          }
        } else {
          if ($("body").hasClass("sidebar-open")) {
            return $("body").removeClass("sidebar-open").removeClass("sidebar-collapse");
          } else {
            return $("body").addClass("sidebar-open");
          }
        }
      });
      return $(".content-wrapper").click(function() {
        if ($(window).width() <= (768 - 1) && $("body").hasClass("sidebar-open")) {
          return $("body").removeClass("sidebar-open");
        }
      });
    }
  },
  tree: function() {
    var animationSpeed, self;
    self = this;
    animationSpeed = 500;
    return $('body').on("click", ".sidebar li a", function(e) {
      var $this, checkElement, parent, parent_li, ul;
      $this = $(this);
      checkElement = $this.next();
      if ((checkElement.is(".treeview-menu")) && (checkElement.is(":visible"))) {
        checkElement.slideUp(animationSpeed, function() {
          return checkElement.removeClass("menu-open");
        });
        self.layout.fix();
        checkElement.parent("li").removeClass("active");
      } else if (checkElement.is(".treeview-menu")) {
        parent = $this.parents("ul").first();
        ul = parent.find("ul:visible").slideUp(animationSpeed);
        ul.removeClass("menu-open");
        parent_li = $this.parent("li");
        checkElement.slideDown(animationSpeed, function() {
          checkElement.addClass("menu-open");
          parent.find("li.active").removeClass("active");
          parent_li.addClass("active");
          return self.layout.fix();
        });
      }
      if (checkElement.is(".treeview-menu")) {
        return e.preventDefault();
      }
    });
  }
};


},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvYXBwL3NjcmlwdHMvaW5kZXguY29mZmVlIiwiYXBwL3NjcmlwdHMvdWktbWl4aW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVUlNaXhpbiwgYXBwO1xuXG5VSU1peGluID0gcmVxdWlyZSgndWktbWl4aW4nKTtcblxuYXBwID0ge307XG5cbl8uZXh0ZW5kKGFwcCwgVUlNaXhpbik7XG5cbmFwcC5pbml0VUkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5sYXlvdXQuYWN0aXZhdGUoKTtcbiAgdGhpcy5wdXNoTWVudS5hY3RpdmF0ZSgpO1xuICByZXR1cm4gdGhpcy50cmVlKCk7XG59O1xuXG4kKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gYXBwLmluaXRVSSgpO1xufSk7XG5cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBsYXlvdXQ6IHtcbiAgICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5maXgoKTtcbiAgICAgIHJldHVybiAkKHdpbmRvdywgXCIud3JhcHBlclwiKS5yZXNpemUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmZpeCgpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBmaXg6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5lZywgc2lkZWJhcl9oZWlnaHQsIHdpbmRvd19oZWlnaHQ7XG4gICAgICBuZWcgPSAkKFwiLm1haW4taGVhZGVyXCIpLm91dGVySGVpZ2h0KCkgKyAkKFwiLm1haW4tZm9vdGVyXCIpLm91dGVySGVpZ2h0KCk7XG4gICAgICB3aW5kb3dfaGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICAgc2lkZWJhcl9oZWlnaHQgPSAkKFwiLnNpZGViYXJcIikuaGVpZ2h0KCk7XG4gICAgICBpZiAod2luZG93X2hlaWdodCA+PSBzaWRlYmFyX2hlaWdodCkge1xuICAgICAgICByZXR1cm4gJChcIi5jb250ZW50LXdyYXBwZXJcIikuY3NzKFwibWluLWhlaWdodFwiLCB3aW5kb3dfaGVpZ2h0IC0gbmVnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNvbnRlbnQtd3JhcHBlclwiKS5jc3MoXCJtaW4taGVpZ2h0XCIsIHNpZGViYXJfaGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHB1c2hNZW51OiB7XG4gICAgYWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgJCgnI2NvbGxhcHNlVG9nZ2xlJykub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIDEpKSB7XG4gICAgICAgICAgaWYgKCQoXCJib2R5XCIpLmhhc0NsYXNzKFwic2lkZWJhci1jb2xsYXBzZVwiKSkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwic2lkZWJhci1jb2xsYXBzZVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICQoXCJib2R5XCIpLmFkZENsYXNzKFwic2lkZWJhci1jb2xsYXBzZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCQoXCJib2R5XCIpLmhhc0NsYXNzKFwic2lkZWJhci1vcGVuXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJzaWRlYmFyLW9wZW5cIikucmVtb3ZlQ2xhc3MoXCJzaWRlYmFyLWNvbGxhcHNlXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJChcImJvZHlcIikuYWRkQ2xhc3MoXCJzaWRlYmFyLW9wZW5cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAkKFwiLmNvbnRlbnQtd3JhcHBlclwiKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDw9ICg3NjggLSAxKSAmJiAkKFwiYm9keVwiKS5oYXNDbGFzcyhcInNpZGViYXItb3BlblwiKSkge1xuICAgICAgICAgIHJldHVybiAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInNpZGViYXItb3BlblwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB0cmVlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYW5pbWF0aW9uU3BlZWQsIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgYW5pbWF0aW9uU3BlZWQgPSA1MDA7XG4gICAgcmV0dXJuICQoJ2JvZHknKS5vbihcImNsaWNrXCIsIFwiLnNpZGViYXIgbGkgYVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgJHRoaXMsIGNoZWNrRWxlbWVudCwgcGFyZW50LCBwYXJlbnRfbGksIHVsO1xuICAgICAgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgY2hlY2tFbGVtZW50ID0gJHRoaXMubmV4dCgpO1xuICAgICAgaWYgKChjaGVja0VsZW1lbnQuaXMoXCIudHJlZXZpZXctbWVudVwiKSkgJiYgKGNoZWNrRWxlbWVudC5pcyhcIjp2aXNpYmxlXCIpKSkge1xuICAgICAgICBjaGVja0VsZW1lbnQuc2xpZGVVcChhbmltYXRpb25TcGVlZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGNoZWNrRWxlbWVudC5yZW1vdmVDbGFzcyhcIm1lbnUtb3BlblwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNlbGYubGF5b3V0LmZpeCgpO1xuICAgICAgICBjaGVja0VsZW1lbnQucGFyZW50KFwibGlcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICB9IGVsc2UgaWYgKGNoZWNrRWxlbWVudC5pcyhcIi50cmVldmlldy1tZW51XCIpKSB7XG4gICAgICAgIHBhcmVudCA9ICR0aGlzLnBhcmVudHMoXCJ1bFwiKS5maXJzdCgpO1xuICAgICAgICB1bCA9IHBhcmVudC5maW5kKFwidWw6dmlzaWJsZVwiKS5zbGlkZVVwKGFuaW1hdGlvblNwZWVkKTtcbiAgICAgICAgdWwucmVtb3ZlQ2xhc3MoXCJtZW51LW9wZW5cIik7XG4gICAgICAgIHBhcmVudF9saSA9ICR0aGlzLnBhcmVudChcImxpXCIpO1xuICAgICAgICBjaGVja0VsZW1lbnQuc2xpZGVEb3duKGFuaW1hdGlvblNwZWVkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjaGVja0VsZW1lbnQuYWRkQ2xhc3MoXCJtZW51LW9wZW5cIik7XG4gICAgICAgICAgcGFyZW50LmZpbmQoXCJsaS5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgcGFyZW50X2xpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgIHJldHVybiBzZWxmLmxheW91dC5maXgoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hlY2tFbGVtZW50LmlzKFwiLnRyZWV2aWV3LW1lbnVcIikpIHtcbiAgICAgICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxuIl19
