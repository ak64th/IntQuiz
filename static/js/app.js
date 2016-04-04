(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IntApp;

window.IntApp = IntApp = {
  AccountPageView: require('account-page')
};


},{"account-page":3}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
var AccountPageView, BaseCollection, BaseModel, PaginationView, TableView, UserView, Users, UsersView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseModel = require('data/base-model');

BaseCollection = require('data/base-collection');

TableView = require('views/table-view');

PaginationView = require('views/pagination-view');

Users = (function(superClass) {
  extend(Users, superClass);

  function Users() {
    return Users.__super__.constructor.apply(this, arguments);
  }

  Users.prototype.url = '/api/v1/user';

  return Users;

})(BaseCollection);

UserView = (function(superClass) {
  extend(UserView, superClass);

  function UserView() {
    return UserView.__super__.constructor.apply(this, arguments);
  }

  UserView.prototype.tagName = 'tr';

  UserView.prototype.template = require('templates/user-row');

  UserView.prototype.render = function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  };

  return UserView;

})(Backbone.View);

UsersView = (function(superClass) {
  extend(UsersView, superClass);

  function UsersView() {
    return UsersView.__super__.constructor.apply(this, arguments);
  }

  UsersView.prototype.row = function(model) {
    return new UserView({
      model: model
    });
  };

  return UsersView;

})(TableView);

module.exports = AccountPageView = (function(superClass) {
  extend(AccountPageView, superClass);

  function AccountPageView() {
    return AccountPageView.__super__.constructor.apply(this, arguments);
  }

  AccountPageView.prototype.render = function() {
    var pageNavView, users, usersView;
    users = new Users;
    usersView = new UsersView({
      el: $('.table-container'),
      collection: users
    });
    pageNavView = new PaginationView({
      collection: users
    });
    usersView.$el.after(pageNavView.render().$el);
    users.fetch({
      reset: true
    });
    return this;
  };

  return AccountPageView;

})(Backbone.View);


},{"data/base-collection":4,"data/base-model":5,"templates/user-row":9,"views/pagination-view":6,"views/table-view":7}],4:[function(require,module,exports){
var BaseCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseCollection = (function(superClass) {
  extend(BaseCollection, superClass);

  function BaseCollection() {
    return BaseCollection.__super__.constructor.apply(this, arguments);
  }

  BaseCollection.prototype.state = {};

  BaseCollection.prototype.parse = function(data) {
    if (data && data.meta) {
      this.meta = data.meta;
    }
    if (this.meta) {
      _.extend(this.state, _.pick(this.meta, ['page', 'pages']));
    }
    return data && data.objects || data;
  };

  BaseCollection.prototype.fetch = function(options) {
    options = _.extend({}, this.state, options);
    return BaseCollection.__super__.fetch.call(this, options);
  };

  return BaseCollection;

})(Backbone.Collection);

module.exports = BaseCollection;


},{}],5:[function(require,module,exports){
var BaseModel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseModel = (function(superClass) {
  extend(BaseModel, superClass);

  function BaseModel() {
    return BaseModel.__super__.constructor.apply(this, arguments);
  }

  BaseModel.prototype.url = function() {
    var origUrl;
    origUrl = BaseModel.__super__.url.call(this);
    return origUrl + (origUrl.length > 0 && origUrl.charAt(origUrl.length - 1) === '/' ? '' : '/');
  };

  BaseModel.prototype.parse = function(data) {
    if (data && data.objects && _.isArray(data.objects)) {
      return data.objects[0] || {};
    }
    return data;
  };

  return BaseModel;

})(Backbone.Model);

module.exports = BaseModel;


},{}],6:[function(require,module,exports){
var PaginationView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = PaginationView = (function(superClass) {
  extend(PaginationView, superClass);

  function PaginationView() {
    return PaginationView.__super__.constructor.apply(this, arguments);
  }

  PaginationView.prototype.tagName = 'nav';

  PaginationView.prototype.className = 'page-nav';

  PaginationView.prototype.template = require('templates/page-nav');

  PaginationView.prototype.events = {
    'click a[data-id]': 'loadPage'
  };

  PaginationView.prototype.initialize = function() {
    return this.listenTo(this.collection, 'reset', this.render);
  };

  PaginationView.prototype.render = function() {
    if (this.collection.meta) {
      this.$el.html(this.template(this.collection.meta));
    }
    return this;
  };

  PaginationView.prototype.loadPage = function(e) {
    var data;
    e.preventDefault();
    data = $(e.currentTarget).data();
    return this.collection.fetch({
      data: {
        page: data.id
      },
      reset: true
    });
  };

  return PaginationView;

})(Backbone.View);


},{"templates/page-nav":8}],7:[function(require,module,exports){
var TableView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = TableView = (function(superClass) {
  extend(TableView, superClass);

  function TableView() {
    return TableView.__super__.constructor.apply(this, arguments);
  }

  TableView.prototype.initialize = function() {
    this.listenTo(this.collection, 'add', this.add);
    return this.listenTo(this.collection, 'reset', this.render);
  };

  TableView.prototype.row = function(model) {
    throw new Error('Not implemented');
  };

  TableView.prototype.add = function(model) {
    var row;
    row = this.row(model);
    row.$el.addClass('success');
    return this.$('table tbody').prepend(row.render().$el);
  };

  TableView.prototype.render = function(collection) {
    var tbody;
    tbody = this.$('table tbody');
    tbody.empty();
    collection.each((function(model) {
      return tbody.append(this.row(model).render().$el);
    }), this);
    return this;
  };

  return TableView;

})(Backbone.View);


},{}],8:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (Math, end, page, pages, start) {
start = Math.max(1, page - 5)
end = Math.min(pages, page + 5)
buf.push("<ul class=\"pagination\"><li" + (jade.cls([(page == 1) ? 'disabled' : ''], [true])) + "><a href=\"#\" aria-label=\"Start\" data-id='1'><span aria-hidden=\"aria-hidden\">&laquo;</span></a></li>");
var i = start
while (i < page)
{
buf.push("<li><a href=\"#\"" + (jade.attr("data-id", i, true, false)) + ">" + (jade.escape(null == (jade_interp = i++) ? "" : jade_interp)) + "</a></li>");
}
buf.push("<li" + (jade.attr("data-id", page, true, false)) + " class=\"active\"><a href=\"#\">" + (jade.escape(null == (jade_interp = page) ? "" : jade_interp)) + "</a></li>");
var i = page + 1
while (i <= end)
{
buf.push("<li><a href=\"#\"" + (jade.attr("data-id", i, true, false)) + ">" + (jade.escape(null == (jade_interp = i++) ? "" : jade_interp)) + "</a></li>");
}
buf.push("<li" + (jade.cls([(page == pages) ? 'disabled' : ''], [true])) + "><a href=\"#\" aria-label=\"End\"" + (jade.attr("data-id", pages, true, false)) + "><span aria-hidden=\"aria-hidden\">&raquo;</span></a></li></ul>");}.call(this,"Math" in locals_for_with?locals_for_with.Math:typeof Math!=="undefined"?Math:undefined,"end" in locals_for_with?locals_for_with.end:typeof end!=="undefined"?end:undefined,"page" in locals_for_with?locals_for_with.page:typeof page!=="undefined"?page:undefined,"pages" in locals_for_with?locals_for_with.pages:typeof pages!=="undefined"?pages:undefined,"start" in locals_for_with?locals_for_with.start:typeof start!=="undefined"?start:undefined));;return buf.join("");
};
},{"jade/runtime":10}],9:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (id, username) {
buf.push("<td>" + (jade.escape(null == (jade_interp = id) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = username) ? "" : jade_interp)) + "</td><td><a type=\"button\" class=\"btn btn-default btn-xs\">修改密码</a></td>");}.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"username" in locals_for_with?locals_for_with.username:typeof username!=="undefined"?username:undefined));;return buf.join("");
};
},{"jade/runtime":10}],10:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jade = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var jade_encode_html_rules = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var jade_match_html = /[&<>"]/g;

function jade_encode_char(c) {
  return jade_encode_html_rules[c] || c;
}

exports.escape = jade_escape;
function jade_escape(html){
  var result = String(html).replace(jade_match_html, jade_encode_char);
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

exports.DebugItem = function DebugItem(lineno, filename) {
  this.lineno = lineno;
  this.filename = filename;
}

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":2}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvYXBwL3NjcmlwdHMvYXBwLmNvZmZlZSIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsImFwcC9zY3JpcHRzL2FjY291bnQtcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9kYXRhL2Jhc2UtY29sbGVjdGlvbi5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9kYXRhL2Jhc2UtbW9kZWwuY29mZmVlIiwiYXBwL3NjcmlwdHMvdmlld3MvcGFnaW5hdGlvbi12aWV3LmNvZmZlZSIsImFwcC9zY3JpcHRzL3ZpZXdzL3RhYmxlLXZpZXcuY29mZmVlIiwiYXBwL3RlbXBsYXRlcy9wYWdlLW5hdi5qYWRlIiwiYXBwL3RlbXBsYXRlcy91c2VyLXJvdy5qYWRlIiwibm9kZV9tb2R1bGVzL2phZGUvcnVudGltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEludEFwcDtcblxud2luZG93LkludEFwcCA9IEludEFwcCA9IHtcbiAgQWNjb3VudFBhZ2VWaWV3OiByZXF1aXJlKCdhY2NvdW50LXBhZ2UnKVxufTtcblxuIixudWxsLCJ2YXIgQWNjb3VudFBhZ2VWaWV3LCBCYXNlQ29sbGVjdGlvbiwgQmFzZU1vZGVsLCBQYWdpbmF0aW9uVmlldywgVGFibGVWaWV3LCBVc2VyVmlldywgVXNlcnMsIFVzZXJzVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VNb2RlbCA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1tb2RlbCcpO1xuXG5CYXNlQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1jb2xsZWN0aW9uJyk7XG5cblRhYmxlVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3RhYmxlLXZpZXcnKTtcblxuUGFnaW5hdGlvblZpZXcgPSByZXF1aXJlKCd2aWV3cy9wYWdpbmF0aW9uLXZpZXcnKTtcblxuVXNlcnMgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlcnMsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJzKCkge1xuICAgIHJldHVybiBVc2Vycy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJzLnByb3RvdHlwZS51cmwgPSAnL2FwaS92MS91c2VyJztcblxuICByZXR1cm4gVXNlcnM7XG5cbn0pKEJhc2VDb2xsZWN0aW9uKTtcblxuVXNlclZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlclZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJWaWV3KCkge1xuICAgIHJldHVybiBVc2VyVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS50YWdOYW1lID0gJ3RyJztcblxuICBVc2VyVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvdXNlci1yb3cnKTtcblxuICBVc2VyVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwudG9KU09OKCkpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gVXNlclZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG5Vc2Vyc1ZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlcnNWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBVc2Vyc1ZpZXcoKSB7XG4gICAgcmV0dXJuIFVzZXJzVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJzVmlldy5wcm90b3R5cGUucm93ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICByZXR1cm4gbmV3IFVzZXJWaWV3KHtcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBVc2Vyc1ZpZXc7XG5cbn0pKFRhYmxlVmlldyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQWNjb3VudFBhZ2VWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjY291bnRQYWdlVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQWNjb3VudFBhZ2VWaWV3KCkge1xuICAgIHJldHVybiBBY2NvdW50UGFnZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY2NvdW50UGFnZVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYWdlTmF2VmlldywgdXNlcnMsIHVzZXJzVmlldztcbiAgICB1c2VycyA9IG5ldyBVc2VycztcbiAgICB1c2Vyc1ZpZXcgPSBuZXcgVXNlcnNWaWV3KHtcbiAgICAgIGVsOiAkKCcudGFibGUtY29udGFpbmVyJyksXG4gICAgICBjb2xsZWN0aW9uOiB1c2Vyc1xuICAgIH0pO1xuICAgIHBhZ2VOYXZWaWV3ID0gbmV3IFBhZ2luYXRpb25WaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHVzZXJzXG4gICAgfSk7XG4gICAgdXNlcnNWaWV3LiRlbC5hZnRlcihwYWdlTmF2Vmlldy5yZW5kZXIoKS4kZWwpO1xuICAgIHVzZXJzLmZldGNoKHtcbiAgICAgIHJlc2V0OiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIEFjY291bnRQYWdlVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBCYXNlQ29sbGVjdGlvbixcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VDb2xsZWN0aW9uID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEJhc2VDb2xsZWN0aW9uLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBCYXNlQ29sbGVjdGlvbigpIHtcbiAgICByZXR1cm4gQmFzZUNvbGxlY3Rpb24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCYXNlQ29sbGVjdGlvbi5wcm90b3R5cGUuc3RhdGUgPSB7fTtcblxuICBCYXNlQ29sbGVjdGlvbi5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5tZXRhKSB7XG4gICAgICB0aGlzLm1ldGEgPSBkYXRhLm1ldGE7XG4gICAgfVxuICAgIGlmICh0aGlzLm1ldGEpIHtcbiAgICAgIF8uZXh0ZW5kKHRoaXMuc3RhdGUsIF8ucGljayh0aGlzLm1ldGEsIFsncGFnZScsICdwYWdlcyddKSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhICYmIGRhdGEub2JqZWN0cyB8fCBkYXRhO1xuICB9O1xuXG4gIEJhc2VDb2xsZWN0aW9uLnByb3RvdHlwZS5mZXRjaCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuc3RhdGUsIG9wdGlvbnMpO1xuICAgIHJldHVybiBCYXNlQ29sbGVjdGlvbi5fX3N1cGVyX18uZmV0Y2guY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgfTtcblxuICByZXR1cm4gQmFzZUNvbGxlY3Rpb247XG5cbn0pKEJhY2tib25lLkNvbGxlY3Rpb24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VDb2xsZWN0aW9uO1xuXG4iLCJ2YXIgQmFzZU1vZGVsLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZU1vZGVsID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEJhc2VNb2RlbCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQmFzZU1vZGVsKCkge1xuICAgIHJldHVybiBCYXNlTW9kZWwuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCYXNlTW9kZWwucHJvdG90eXBlLnVybCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcmlnVXJsO1xuICAgIG9yaWdVcmwgPSBCYXNlTW9kZWwuX19zdXBlcl9fLnVybC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiBvcmlnVXJsICsgKG9yaWdVcmwubGVuZ3RoID4gMCAmJiBvcmlnVXJsLmNoYXJBdChvcmlnVXJsLmxlbmd0aCAtIDEpID09PSAnLycgPyAnJyA6ICcvJyk7XG4gIH07XG5cbiAgQmFzZU1vZGVsLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLm9iamVjdHMgJiYgXy5pc0FycmF5KGRhdGEub2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBkYXRhLm9iamVjdHNbMF0gfHwge307XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIHJldHVybiBCYXNlTW9kZWw7XG5cbn0pKEJhY2tib25lLk1vZGVsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlTW9kZWw7XG5cbiIsInZhciBQYWdpbmF0aW9uVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGFnaW5hdGlvblZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUGFnaW5hdGlvblZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFBhZ2luYXRpb25WaWV3KCkge1xuICAgIHJldHVybiBQYWdpbmF0aW9uVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS50YWdOYW1lID0gJ25hdic7XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLmNsYXNzTmFtZSA9ICdwYWdlLW5hdic7XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL3BhZ2UtbmF2Jyk7XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLmV2ZW50cyA9IHtcbiAgICAnY2xpY2sgYVtkYXRhLWlkXSc6ICdsb2FkUGFnZSdcbiAgfTtcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ3Jlc2V0JywgdGhpcy5yZW5kZXIpO1xuICB9O1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5jb2xsZWN0aW9uLm1ldGEpIHtcbiAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0aGlzLmNvbGxlY3Rpb24ubWV0YSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUubG9hZFBhZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGRhdGEgPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgpO1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmV0Y2goe1xuICAgICAgZGF0YToge1xuICAgICAgICBwYWdlOiBkYXRhLmlkXG4gICAgICB9LFxuICAgICAgcmVzZXQ6IHRydWVcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gUGFnaW5hdGlvblZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgVGFibGVWaWV3LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZVZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVGFibGVWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBUYWJsZVZpZXcoKSB7XG4gICAgcmV0dXJuIFRhYmxlVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFRhYmxlVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLCAnYWRkJywgdGhpcy5hZGQpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ3Jlc2V0JywgdGhpcy5yZW5kZXIpO1xuICB9O1xuXG4gIFRhYmxlVmlldy5wcm90b3R5cGUucm93ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICB9O1xuXG4gIFRhYmxlVmlldy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICB2YXIgcm93O1xuICAgIHJvdyA9IHRoaXMucm93KG1vZGVsKTtcbiAgICByb3cuJGVsLmFkZENsYXNzKCdzdWNjZXNzJyk7XG4gICAgcmV0dXJuIHRoaXMuJCgndGFibGUgdGJvZHknKS5wcmVwZW5kKHJvdy5yZW5kZXIoKS4kZWwpO1xuICB9O1xuXG4gIFRhYmxlVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgIHZhciB0Ym9keTtcbiAgICB0Ym9keSA9IHRoaXMuJCgndGFibGUgdGJvZHknKTtcbiAgICB0Ym9keS5lbXB0eSgpO1xuICAgIGNvbGxlY3Rpb24uZWFjaCgoZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgIHJldHVybiB0Ym9keS5hcHBlbmQodGhpcy5yb3cobW9kZWwpLnJlbmRlcigpLiRlbCk7XG4gICAgfSksIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBUYWJsZVZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChNYXRoLCBlbmQsIHBhZ2UsIHBhZ2VzLCBzdGFydCkge1xuc3RhcnQgPSBNYXRoLm1heCgxLCBwYWdlIC0gNSlcbmVuZCA9IE1hdGgubWluKHBhZ2VzLCBwYWdlICsgNSlcbmJ1Zi5wdXNoKFwiPHVsIGNsYXNzPVxcXCJwYWdpbmF0aW9uXFxcIj48bGlcIiArIChqYWRlLmNscyhbKHBhZ2UgPT0gMSkgPyAnZGlzYWJsZWQnIDogJyddLCBbdHJ1ZV0pKSArIFwiPjxhIGhyZWY9XFxcIiNcXFwiIGFyaWEtbGFiZWw9XFxcIlN0YXJ0XFxcIiBkYXRhLWlkPScxJz48c3BhbiBhcmlhLWhpZGRlbj1cXFwiYXJpYS1oaWRkZW5cXFwiPiZsYXF1bzs8L3NwYW4+PC9hPjwvbGk+XCIpO1xudmFyIGkgPSBzdGFydFxud2hpbGUgKGkgPCBwYWdlKVxue1xuYnVmLnB1c2goXCI8bGk+PGEgaHJlZj1cXFwiI1xcXCJcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIGksIHRydWUsIGZhbHNlKSkgKyBcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGkrKykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9hPjwvbGk+XCIpO1xufVxuYnVmLnB1c2goXCI8bGlcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIHBhZ2UsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiYWN0aXZlXFxcIj48YSBocmVmPVxcXCIjXFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHBhZ2UpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvYT48L2xpPlwiKTtcbnZhciBpID0gcGFnZSArIDFcbndoaWxlIChpIDw9IGVuZClcbntcbmJ1Zi5wdXNoKFwiPGxpPjxhIGhyZWY9XFxcIiNcXFwiXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBpLCB0cnVlLCBmYWxzZSkpICsgXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpKyspID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvYT48L2xpPlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPGxpXCIgKyAoamFkZS5jbHMoWyhwYWdlID09IHBhZ2VzKSA/ICdkaXNhYmxlZCcgOiAnJ10sIFt0cnVlXSkpICsgXCI+PGEgaHJlZj1cXFwiI1xcXCIgYXJpYS1sYWJlbD1cXFwiRW5kXFxcIlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgcGFnZXMsIHRydWUsIGZhbHNlKSkgKyBcIj48c3BhbiBhcmlhLWhpZGRlbj1cXFwiYXJpYS1oaWRkZW5cXFwiPiZyYXF1bzs8L3NwYW4+PC9hPjwvbGk+PC91bD5cIik7fS5jYWxsKHRoaXMsXCJNYXRoXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5NYXRoOnR5cGVvZiBNYXRoIT09XCJ1bmRlZmluZWRcIj9NYXRoOnVuZGVmaW5lZCxcImVuZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguZW5kOnR5cGVvZiBlbmQhPT1cInVuZGVmaW5lZFwiP2VuZDp1bmRlZmluZWQsXCJwYWdlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5wYWdlOnR5cGVvZiBwYWdlIT09XCJ1bmRlZmluZWRcIj9wYWdlOnVuZGVmaW5lZCxcInBhZ2VzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5wYWdlczp0eXBlb2YgcGFnZXMhPT1cInVuZGVmaW5lZFwiP3BhZ2VzOnVuZGVmaW5lZCxcInN0YXJ0XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zdGFydDp0eXBlb2Ygc3RhcnQhPT1cInVuZGVmaW5lZFwiP3N0YXJ0OnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGlkLCB1c2VybmFtZSkge1xuYnVmLnB1c2goXCI8dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpZCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB1c2VybmFtZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+PGEgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1xcXCI+5L+u5pS55a+G56CBPC9hPjwvdGQ+XCIpO30uY2FsbCh0aGlzLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkLFwidXNlcm5hbWVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVzZXJuYW1lOnR5cGVvZiB1c2VybmFtZSE9PVwidW5kZWZpbmVkXCI/dXNlcm5hbWU6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuKGZ1bmN0aW9uKGYpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZSE9PVwidW5kZWZpbmVkXCIpe21vZHVsZS5leHBvcnRzPWYoKX1lbHNlIGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmKX1lbHNle3ZhciBnO2lmKHR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiKXtnPXdpbmRvd31lbHNlIGlmKHR5cGVvZiBnbG9iYWwhPT1cInVuZGVmaW5lZFwiKXtnPWdsb2JhbH1lbHNlIGlmKHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIil7Zz1zZWxmfWVsc2V7Zz10aGlzfWcuamFkZSA9IGYoKX19KShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcbiAqIHRvIHZhbHVlcyBpbiBvYmplY3QgYGJgLiBDbGFzc2VzIGFyZSBzcGVjaWFsLWNhc2VkXG4gKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7T2JqZWN0fSBhXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoYSwgYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBhdHRycyA9IGFbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRycyA9IG1lcmdlKGF0dHJzLCBhW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG4gIHZhciBhYyA9IGFbJ2NsYXNzJ107XG4gIHZhciBiYyA9IGJbJ2NsYXNzJ107XG5cbiAgaWYgKGFjIHx8IGJjKSB7XG4gICAgYWMgPSBhYyB8fCBbXTtcbiAgICBiYyA9IGJjIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhYykpIGFjID0gW2FjXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYmMpKSBiYyA9IFtiY107XG4gICAgYVsnY2xhc3MnXSA9IGFjLmNvbmNhdChiYykuZmlsdGVyKG51bGxzKTtcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGtleSAhPSAnY2xhc3MnKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG4vKipcbiAqIEZpbHRlciBudWxsIGB2YWxgcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG51bGxzKHZhbCkge1xuICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsICE9PSAnJztcbn1cblxuLyoqXG4gKiBqb2luIGFycmF5IGFzIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5qb2luQ2xhc3NlcyA9IGpvaW5DbGFzc2VzO1xuZnVuY3Rpb24gam9pbkNsYXNzZXModmFsKSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLm1hcChqb2luQ2xhc3NlcykgOlxuICAgICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpID8gT2JqZWN0LmtleXModmFsKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdmFsW2tleV07IH0pIDpcbiAgICBbdmFsXSkuZmlsdGVyKG51bGxzKS5qb2luKCcgJyk7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcbiAqIEBwYXJhbSB7QXJyYXkuPEJvb2xlYW4+fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xzID0gZnVuY3Rpb24gY2xzKGNsYXNzZXMsIGVzY2FwZWQpIHtcbiAgdmFyIGJ1ZiA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZXNjYXBlZCAmJiBlc2NhcGVkW2ldKSB7XG4gICAgICBidWYucHVzaChleHBvcnRzLmVzY2FwZShqb2luQ2xhc3NlcyhbY2xhc3Nlc1tpXV0pKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5wdXNoKGpvaW5DbGFzc2VzKGNsYXNzZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgdmFyIHRleHQgPSBqb2luQ2xhc3NlcyhidWYpO1xuICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gJyBjbGFzcz1cIicgKyB0ZXh0ICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cblxuZXhwb3J0cy5zdHlsZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh2YWwpLm1hcChmdW5jdGlvbiAoc3R5bGUpIHtcbiAgICAgIHJldHVybiBzdHlsZSArICc6JyArIHZhbFtzdHlsZV07XG4gICAgfSkuam9pbignOycpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbn07XG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxuICogQHBhcmFtIHtCb29sZWFufSB0ZXJzZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHIgPSBmdW5jdGlvbiBhdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgdmFsID0gZXhwb3J0cy5zdHlsZSh2YWwpO1xuICB9XG4gIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIHZhbCB8fCBudWxsID09IHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKDAgPT0ga2V5LmluZGV4T2YoJ2RhdGEnKSAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB7XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KHZhbCkuaW5kZXhPZignJicpICE9PSAtMSkge1xuICAgICAgY29uc29sZS53YXJuKCdTaW5jZSBKYWRlIDIuMC4wLCBhbXBlcnNhbmRzIChgJmApIGluIGRhdGEgYXR0cmlidXRlcyAnICtcbiAgICAgICAgICAgICAgICAgICAnd2lsbCBiZSBlc2NhcGVkIHRvIGAmYW1wO2AnKTtcbiAgICB9O1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgZWxpbWluYXRlIHRoZSBkb3VibGUgcXVvdGVzIGFyb3VuZCBkYXRlcyBpbiAnICtcbiAgICAgICAgICAgICAgICAgICAnSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArIFwiPSdcIiArIEpTT04uc3RyaW5naWZ5KHZhbCkucmVwbGFjZSgvJy9nLCAnJmFwb3M7JykgKyBcIidcIjtcbiAgfSBlbHNlIGlmIChlc2NhcGVkKSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBzdHJpbmdpZnkgZGF0ZXMgaW4gSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgZXhwb3J0cy5lc2NhcGUodmFsKSArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBzdHJpbmdpZnkgZGF0ZXMgaW4gSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBmdW5jdGlvbiBhdHRycyhvYmosIHRlcnNlKXtcbiAgdmFyIGJ1ZiA9IFtdO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICAgICwgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09IGtleSkge1xuICAgICAgICBpZiAodmFsID0gam9pbkNsYXNzZXModmFsKSkge1xuICAgICAgICAgIGJ1Zi5wdXNoKCcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgamFkZV9lbmNvZGVfaHRtbF9ydWxlcyA9IHtcbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gICdcIic6ICcmcXVvdDsnXG59O1xudmFyIGphZGVfbWF0Y2hfaHRtbCA9IC9bJjw+XCJdL2c7XG5cbmZ1bmN0aW9uIGphZGVfZW5jb2RlX2NoYXIoYykge1xuICByZXR1cm4gamFkZV9lbmNvZGVfaHRtbF9ydWxlc1tjXSB8fCBjO1xufVxuXG5leHBvcnRzLmVzY2FwZSA9IGphZGVfZXNjYXBlO1xuZnVuY3Rpb24gamFkZV9lc2NhcGUoaHRtbCl7XG4gIHZhciByZXN1bHQgPSBTdHJpbmcoaHRtbCkucmVwbGFjZShqYWRlX21hdGNoX2h0bWwsIGphZGVfZW5jb2RlX2NoYXIpO1xuICBpZiAocmVzdWx0ID09PSAnJyArIGh0bWwpIHJldHVybiBodG1sO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIGphZGUgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lbm9cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IGZ1bmN0aW9uIHJldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9IHN0ciB8fCByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICB9IGNhdGNoIChleCkge1xuICAgIHJldGhyb3coZXJyLCBudWxsLCBsaW5lbm8pXG4gIH1cbiAgdmFyIGNvbnRleHQgPSAzXG4gICAgLCBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJylcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcbiAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdKYWRlJykgKyAnOicgKyBsaW5lbm9cbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XG4gIHRocm93IGVycjtcbn07XG5cbmV4cG9ydHMuRGVidWdJdGVtID0gZnVuY3Rpb24gRGVidWdJdGVtKGxpbmVubywgZmlsZW5hbWUpIHtcbiAgdGhpcy5saW5lbm8gPSBsaW5lbm87XG4gIHRoaXMuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbn1cblxufSx7XCJmc1wiOjJ9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblxufSx7fV19LHt9LFsxXSkoMSlcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiXX0=
