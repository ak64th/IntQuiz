(function() {
  var UIMixin, app;

  UIMixin = {
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

  window.app = app = {
    Model: Backbone.Model.extend({
      url: function() {
        var origUrl;
        origUrl = Backbone.Model.prototype.url.call(this);
        return origUrl + (origUrl.length > 0 && origUrl.charAt(origUrl.length - 1) === '/' ? '' : '/');
      },
      parse: function(data) {
        if (data && data.objects && _.isArray(data.objects)) {
          return data.objects[0] || {};
        }
        return data;
      }
    }),
    Collection: Backbone.Collection.extend({
      parse: function(data) {
        if (data && data.meta) {
          this.meta = data.meta;
        }
        return data && data.objects || data;
      }
    })
  };

  _.extend(app, UIMixin);

  app.initUI = function() {
    this.layout.activate();
    this.pushMenu.activate();
    this.tree();
    return true;
  };

}).call(this);
