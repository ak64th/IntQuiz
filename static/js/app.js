(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IntApp;

window.IntApp = IntApp = {
  AccountPageView: require('account-page'),
  BookPageView: require('book-page'),
  QuestionPageView: require('question-page')
};


},{"account-page":3,"book-page":4,"question-page":7}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
var AccountPageView, BaseCollection, BaseModel, ModalView, PaginationView, TableView, User, UserModalView, UserView, Users, UsersView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseModel = require('data/base-model');

BaseCollection = require('data/base-collection');

TableView = require('views/table-view');

PaginationView = require('views/pagination-view');

ModalView = require('views/modal-view');

User = (function(superClass) {
  extend(User, superClass);

  function User() {
    return User.__super__.constructor.apply(this, arguments);
  }

  User.prototype.urlRoot = '/api/v1/user';

  User.prototype.defaults = {
    username: '',
    password: ''
  };

  User.prototype.validation = {
    username: {
      blank: false,
      message: '用户名不能为空'
    },
    password: {
      blank: false,
      minLength: 6,
      message: '密码不能少于6位'
    }
  };

  User.prototype.activate = function() {
    var attrs;
    attrs = {
      active: true
    };
    return this.save(attrs, {
      attrs: attrs
    });
  };

  User.prototype.deactivate = function() {
    var attrs;
    attrs = {
      active: false
    };
    return this.save(attrs, {
      attrs: attrs
    });
  };

  return User;

})(BaseModel);

Users = (function(superClass) {
  extend(Users, superClass);

  function Users() {
    return Users.__super__.constructor.apply(this, arguments);
  }

  Users.prototype.url = '/api/v1/user';

  Users.prototype.model = User;

  return Users;

})(BaseCollection);

UserView = (function(superClass) {
  extend(UserView, superClass);

  function UserView() {
    return UserView.__super__.constructor.apply(this, arguments);
  }

  UserView.prototype.tagName = 'tr';

  UserView.prototype.template = require('templates/user-row');

  UserView.prototype.events = {
    'click #deactivate': function() {
      return this.model.deactivate();
    },
    'click #activate': function() {
      return this.model.activate();
    }
  };

  UserView.prototype.initialize = function() {
    this.listenTo(this.model, "sync", this.render);
    return this.listenTo(this.model, "destroy", this.remove);
  };

  UserView.prototype.render = function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  };

  return UserView;

})(Backbone.View);

UserModalView = (function(superClass) {
  extend(UserModalView, superClass);

  function UserModalView() {
    return UserModalView.__super__.constructor.apply(this, arguments);
  }

  UserModalView.prototype.bindings = {
    '#username': 'username',
    '#password': 'password'
  };

  return UserModalView;

})(ModalView);

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
    var pageNavView, userModalTemplate, userModalView, users, usersView;
    users = new Users;
    usersView = new UsersView({
      el: $('.table-container'),
      collection: users
    });
    pageNavView = new PaginationView({
      collection: users
    });
    usersView.$el.after(pageNavView.render().$el);
    userModalTemplate = require('templates/user-modal');
    $('body').append(userModalTemplate({
      id: 'userModalForm'
    }));
    userModalView = new UserModalView({
      el: $('#userModalForm'),
      collection: users
    });
    users.fetch({
      reset: true
    });
    return this;
  };

  return AccountPageView;

})(Backbone.View);


},{"data/base-collection":5,"data/base-model":6,"templates/user-modal":15,"templates/user-row":16,"views/modal-view":8,"views/pagination-view":9,"views/table-view":10}],4:[function(require,module,exports){
var BaseCollection, BaseModel, BookPageView, ModalView, PaginationView, QuizBook, QuizBookModalView, QuizBookView, QuizBooks, QuizBooksView, TableView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseModel = require('data/base-model');

BaseCollection = require('data/base-collection');

TableView = require('views/table-view');

PaginationView = require('views/pagination-view');

ModalView = require('views/modal-view');

QuizBook = (function(superClass) {
  extend(QuizBook, superClass);

  function QuizBook() {
    return QuizBook.__super__.constructor.apply(this, arguments);
  }

  QuizBook.prototype.urlRoot = '/api/v1/quizbook';

  QuizBook.prototype.validation = {
    title: {
      blank: false,
      message: '题库名不能为空'
    }
  };

  return QuizBook;

})(BaseModel);

QuizBooks = (function(superClass) {
  extend(QuizBooks, superClass);

  function QuizBooks() {
    return QuizBooks.__super__.constructor.apply(this, arguments);
  }

  QuizBooks.prototype.url = '/api/v1/quizbook';

  QuizBooks.prototype.model = QuizBook;

  return QuizBooks;

})(BaseCollection);

QuizBookView = (function(superClass) {
  extend(QuizBookView, superClass);

  function QuizBookView() {
    return QuizBookView.__super__.constructor.apply(this, arguments);
  }

  QuizBookView.prototype.tagName = 'tr';

  QuizBookView.prototype.template = require('templates/book-row');

  QuizBookView.prototype.initialize = function() {
    return this.listenTo(this.model, "sync", this.render);
  };

  QuizBookView.prototype.render = function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  };

  return QuizBookView;

})(Backbone.View);

QuizBookModalView = (function(superClass) {
  extend(QuizBookModalView, superClass);

  function QuizBookModalView() {
    return QuizBookModalView.__super__.constructor.apply(this, arguments);
  }

  QuizBookModalView.prototype.bindings = {
    '#title': 'title'
  };

  return QuizBookModalView;

})(ModalView);

QuizBooksView = (function(superClass) {
  extend(QuizBooksView, superClass);

  function QuizBooksView() {
    return QuizBooksView.__super__.constructor.apply(this, arguments);
  }

  QuizBooksView.prototype.row = function(model) {
    return new QuizBookView({
      model: model
    });
  };

  return QuizBooksView;

})(TableView);

module.exports = BookPageView = (function(superClass) {
  extend(BookPageView, superClass);

  function BookPageView() {
    return BookPageView.__super__.constructor.apply(this, arguments);
  }

  BookPageView.prototype.render = function() {
    var bookModalTemplate, pageNavView, quizBookModalView, quizBooks, quizBooksView;
    quizBooks = new QuizBooks;
    quizBooksView = new QuizBooksView({
      el: $('#quizbook-table-container'),
      collection: quizBooks
    });
    pageNavView = new PaginationView({
      collection: quizBooks
    });
    quizBooksView.$el.after(pageNavView.render().$el);
    bookModalTemplate = require('templates/book-modal');
    $('body').append(bookModalTemplate({
      id: 'bookModalForm'
    }));
    quizBookModalView = new QuizBookModalView({
      el: $('#bookModalForm'),
      collection: quizBooks
    });
    quizBooks.fetch({
      reset: true
    });
    return this;
  };

  return BookPageView;

})(Backbone.View);


},{"data/base-collection":5,"data/base-model":6,"templates/book-modal":11,"templates/book-row":12,"views/modal-view":8,"views/pagination-view":9,"views/table-view":10}],5:[function(require,module,exports){
var BaseCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseCollection = (function(superClass) {
  extend(BaseCollection, superClass);

  function BaseCollection() {
    return BaseCollection.__super__.constructor.apply(this, arguments);
  }

  BaseCollection.prototype.parse = function(data) {
    if (data && data.meta) {
      this.meta = data.meta;
    }
    return data && data.objects || data;
  };

  return BaseCollection;

})(Backbone.Collection);

module.exports = BaseCollection;


},{}],6:[function(require,module,exports){
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


},{}],7:[function(require,module,exports){
var BaseCollection, BaseModel, ModalView, PaginationView, Question, QuestionListPanelView, QuestionPageView, QuestionView, Questions, QuestionsView, TableView, char2Int, int2Char,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseModel = require('data/base-model');

BaseCollection = require('data/base-collection');

TableView = require('views/table-view');

PaginationView = require('views/pagination-view');

ModalView = require('views/modal-view');

int2Char = function(i) {
  return String.fromCharCode(64 + parseInt(i));
};

char2Int = function(c) {
  if (!!c) {
    return c.charCodeAt(0);
  } else {
    return c;
  }
};

Question = (function(superClass) {
  extend(Question, superClass);

  function Question() {
    return Question.__super__.constructor.apply(this, arguments);
  }

  Question.prototype.urlRoot = '/api/v1/question/';

  Question.prototype.defaults = {
    "option_A": "",
    "option_B": "",
    "option_C": "",
    "option_D": "",
    "option_E": "",
    "option_F": ""
  };

  Question.prototype.validation = {
    content: {
      blank: false,
      message: '题目内容不能为空'
    },
    type: {
      blank: false,
      fn: function(value) {
        return value === 1 || value === 2;
      },
      message: '题目类型必须是多选或单选'
    },
    correct_option: {
      blank: false,
      fn: function(value) {
        value = (function() {
          switch (false) {
            case !_.isArray(value):
              return value;
            case !_.isString(value):
              return value.split(',');
            default:
              return value;
          }
        })();
        console.log(value);
        if (!value || value.length > 6) {
          return false;
        }
      },
      message: '正确答案设置出错，注意对应的选项是否设置了答案'
    }
  };

  return Question;

})(BaseModel);

Questions = (function(superClass) {
  extend(Questions, superClass);

  function Questions() {
    return Questions.__super__.constructor.apply(this, arguments);
  }

  Questions.prototype.url = '/api/v1/question/';

  Questions.prototype.model = Question;

  Questions.prototype.state = {};

  Questions.prototype.fetch = function(options) {
    var data;
    options = _.extend({}, options);
    data = options.data;
    options.data = _.extend({}, this.state, data);
    return Questions.__super__.fetch.call(this, options);
  };

  return Questions;

})(BaseCollection);

QuestionView = (function(superClass) {
  extend(QuestionView, superClass);

  function QuestionView() {
    return QuestionView.__super__.constructor.apply(this, arguments);
  }

  QuestionView.prototype.tagName = 'tr';

  QuestionView.prototype.template = require('templates/question-row');

  QuestionView.prototype.initialize = function() {
    return this.listenTo(this.model, "sync", this.render);
  };

  QuestionView.prototype.render = function() {
    var correct, data;
    data = this.model.toJSON();
    correct = data['correct_option'].split(',');
    data['correct_option'] = _.map(correct, int2Char).join();
    data['type'] = (function() {
      switch (data['type']) {
        case 1:
          return '单选';
        case 2:
          return '多选';
        default:
          return '多选';
      }
    })();
    this.$el.html(this.template(data));
    return this;
  };

  return QuestionView;

})(Backbone.View);

QuestionsView = (function(superClass) {
  extend(QuestionsView, superClass);

  function QuestionsView() {
    return QuestionsView.__super__.constructor.apply(this, arguments);
  }

  QuestionsView.prototype.row = function(model) {
    return new QuestionView({
      model: model
    });
  };

  return QuestionsView;

})(TableView);

QuestionListPanelView = (function(superClass) {
  extend(QuestionListPanelView, superClass);

  function QuestionListPanelView() {
    return QuestionListPanelView.__super__.constructor.apply(this, arguments);
  }

  QuestionListPanelView.prototype.events = {
    'change #book': function() {
      return this.collection.state.book = this.$('#book').val();
    },
    'click #loadBook': function() {
      return this.collection.fetch({
        reset: true
      });
    }
  };

  return QuestionListPanelView;

})(Backbone.View);

module.exports = QuestionPageView = (function(superClass) {
  extend(QuestionPageView, superClass);

  function QuestionPageView() {
    return QuestionPageView.__super__.constructor.apply(this, arguments);
  }

  QuestionPageView.prototype.render = function(bookId) {
    var pageNavView, panelView, questions, questionsView;
    if (!bookId) {
      bookId = $('form select[name=book]').val();
    }
    questions = new Questions;
    questions.state.book = bookId;
    panelView = new QuestionListPanelView({
      el: $('.table-control'),
      collection: questions
    });
    questionsView = new QuestionsView({
      el: $('#question-table-container'),
      collection: questions
    });
    pageNavView = new PaginationView({
      collection: questions
    });
    questionsView.$el.after(pageNavView.render().$el);
    questions.fetch({
      reset: true
    }).then(function() {
      var q;
      q = questions.at(0);
      console.log(q.toJSON());
      return console.log(q.validate());
    });
    return QuestionPageView.__super__.render.call(this);
  };

  return QuestionPageView;

})(Backbone.View);


},{"data/base-collection":5,"data/base-model":6,"templates/question-row":14,"views/modal-view":8,"views/pagination-view":9,"views/table-view":10}],8:[function(require,module,exports){
var ModalView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = ModalView = (function(superClass) {
  extend(ModalView, superClass);

  function ModalView() {
    return ModalView.__super__.constructor.apply(this, arguments);
  }

  ModalView.prototype.events = {
    'show.bs.modal': 'show',
    'hidden.bs.modal': 'hidden',
    'click [type=submit]': 'save'
  };

  ModalView.prototype.show = function(e) {
    var data;
    data = $(e.relatedTarget).data();
    this.model = data.id ? this.collection.get(data.id) : new this.collection.model;
    this.stickit();
    return this.bindValidation();
  };

  ModalView.prototype.hidden = function() {
    this.unstickit();
    this.stopListening();
    return delete this.model;
  };

  ModalView.prototype.save = function(e) {
    e.preventDefault();
    return this.model.save().then(_.bind((function() {
      this.collection.add(this.model);
      return this.$el.modal('hide');
    }), this));
  };

  ModalView.prototype.onValidField = function(name, value, model) {
    var field, group;
    field = this.$("[name=" + name + "]");
    group = field.closest('.form-group');
    group.removeClass('has-error');
    return group.find('.help-block').remove();
  };

  ModalView.prototype.onInvalidField = function(name, value, errors, model) {
    var error, field, group, i, len;
    field = this.$("[name=" + name + "]");
    group = field.closest('.form-group');
    group.find('.help-block').remove();
    for (i = 0, len = errors.length; i < len; i++) {
      error = errors[i];
      field.after("<div class='help-block'>" + error + "</div>");
    }
    return group.addClass('has-error');
  };

  return ModalView;

})(Backbone.View);


},{}],9:[function(require,module,exports){
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


},{"templates/page-nav":13}],10:[function(require,module,exports){
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


},{}],11:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (id) {
buf.push("<div" + (jade.attr("id", "" + (id) + "", true, false)) + " tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"bookFormLabel\" aria-hidden=\"true\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" class=\"close\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">关闭</span></button><h4 id=\"bookFormLabel\" class=\"modal-title\">输入题库信息</h4></div><div class=\"modal-body\"><form><div class=\"form-group\"><label for=\"title\" class=\"control-label\">题库名</label><input type=\"text\" id=\"title\" placeholder=\"题库名\" name=\"title\" class=\"form-control\"/></div></form></div><div class=\"modal-footer\"><button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default\">取消</button><button id=\"save\" type=\"submit\" class=\"btn btn-primary\">保存</button></div></div></div></div>");}.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined));;return buf.join("");
};
},{"jade/runtime":17}],12:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (button, id, title, user) {
buf.push("<td>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = user.username) ? "" : jade_interp)) + "</td><td><a" + (jade.attr("href", '/quizbooks/' + (id) + '/questions', true, false)) + " class=\"btn btn-default btn-xs\">查看</a><a" + (jade.attr("type", button, true, false)) + (jade.attr("data-id", id, true, false)) + " data-toggle=\"modal\" data-target=\"#bookModalForm\" class=\"btn btn-primary btn-xs\">编辑</a></td>");}.call(this,"button" in locals_for_with?locals_for_with.button:typeof button!=="undefined"?button:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));;return buf.join("");
};
},{"jade/runtime":17}],13:[function(require,module,exports){
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
},{"jade/runtime":17}],14:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (button, content, correct_option, id, option_A, option_B, option_C, option_D, option_E, option_F, type) {
buf.push("<td>" + (jade.escape(null == (jade_interp = content) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = type) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = correct_option) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_A) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_B) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_C) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_D) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_E) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_F) ? "" : jade_interp)) + "</td><td><a" + (jade.attr("type", button, true, false)) + (jade.attr("data-id", id, true, false)) + " data-toggle=\"modal\" data-target=\"#questionModalForm\" class=\"btn btn-primary btn-xs\">编辑</a><a" + (jade.attr("type", button, true, false)) + " class=\"btn btn-danger btn-xs\">删除</a></td>");}.call(this,"button" in locals_for_with?locals_for_with.button:typeof button!=="undefined"?button:undefined,"content" in locals_for_with?locals_for_with.content:typeof content!=="undefined"?content:undefined,"correct_option" in locals_for_with?locals_for_with.correct_option:typeof correct_option!=="undefined"?correct_option:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"option_A" in locals_for_with?locals_for_with.option_A:typeof option_A!=="undefined"?option_A:undefined,"option_B" in locals_for_with?locals_for_with.option_B:typeof option_B!=="undefined"?option_B:undefined,"option_C" in locals_for_with?locals_for_with.option_C:typeof option_C!=="undefined"?option_C:undefined,"option_D" in locals_for_with?locals_for_with.option_D:typeof option_D!=="undefined"?option_D:undefined,"option_E" in locals_for_with?locals_for_with.option_E:typeof option_E!=="undefined"?option_E:undefined,"option_F" in locals_for_with?locals_for_with.option_F:typeof option_F!=="undefined"?option_F:undefined,"type" in locals_for_with?locals_for_with.type:typeof type!=="undefined"?type:undefined));;return buf.join("");
};
},{"jade/runtime":17}],15:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (id) {
jade_mixins["input"] = jade_interp = function(type,id,placeholder,label,name){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"form-group\"><label" + (jade.attr("for", "" + (id) + "", true, false)) + " class=\"col-xs-2 control-label\">" + (jade.escape((jade_interp = label) == null ? '' : jade_interp)) + "</label><div class=\"col-xs-10\"><input" + (jade.attr("type", "" + (type) + "", true, false)) + (jade.attr("id", "" + (id) + "", true, false)) + (jade.attr("placeholder", "" + (placeholder) + "", true, false)) + (jade.attr("name", "" + (name) + "", true, false)) + " class=\"form-control\"/></div></div>");
};
buf.push("<div" + (jade.attr("id", "" + (id) + "", true, false)) + " tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"userFormLabel\" aria-hidden=\"true\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" class=\"close\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">关闭</span></button><h4 id=\"userFormLabel\" class=\"modal-title\">输入用户信息</h4></div><div class=\"modal-body\"><row><form class=\"form-horizontal\">");
jade_mixins["input"]('text', 'username', '用户名', '用户名', 'username');
jade_mixins["input"]('password', 'password', '密码', '密码', 'password');
buf.push("</form></row></div><div class=\"modal-footer\"><button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default\">取消</button><button type=\"submit\" class=\"btn btn-primary\">保存</button></div></div></div></div>");}.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined));;return buf.join("");
};
},{"jade/runtime":17}],16:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (active, admin, id, username) {
buf.push("<td>" + (jade.escape(null == (jade_interp = id) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = username) ? "" : jade_interp)) + "</td><td><a type=\"button\"" + (jade.attr("data-id", id, true, false)) + " data-toggle=\"modal\" data-target=\"#userModalForm\" class=\"btn btn-default btn-xs\">修改密码</a>");
if ( !admin)
{
if ( active)
{
buf.push("<a id=\"deactivate\" type=\"button\" class=\"btn btn-danger btn-xs\">冻结帐号</a>");
}
else
{
buf.push("<a id=\"activate\" type=\"button\" class=\"btn btn-success btn-xs\">激活帐号</a>");
}
}
buf.push("</td>");}.call(this,"active" in locals_for_with?locals_for_with.active:typeof active!=="undefined"?active:undefined,"admin" in locals_for_with?locals_for_with.admin:typeof admin!=="undefined"?admin:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"username" in locals_for_with?locals_for_with.username:typeof username!=="undefined"?username:undefined));;return buf.join("");
};
},{"jade/runtime":17}],17:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvYXBwL3NjcmlwdHMvYXBwLmNvZmZlZSIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsImFwcC9zY3JpcHRzL2FjY291bnQtcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9ib29rLXBhZ2UuY29mZmVlIiwiYXBwL3NjcmlwdHMvZGF0YS9iYXNlLWNvbGxlY3Rpb24uY29mZmVlIiwiYXBwL3NjcmlwdHMvZGF0YS9iYXNlLW1vZGVsLmNvZmZlZSIsImFwcC9zY3JpcHRzL3F1ZXN0aW9uLXBhZ2UuY29mZmVlIiwiYXBwL3NjcmlwdHMvdmlld3MvbW9kYWwtdmlldy5jb2ZmZWUiLCJhcHAvc2NyaXB0cy92aWV3cy9wYWdpbmF0aW9uLXZpZXcuY29mZmVlIiwiYXBwL3NjcmlwdHMvdmlld3MvdGFibGUtdmlldy5jb2ZmZWUiLCJhcHAvdGVtcGxhdGVzL2Jvb2stbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvYm9vay1yb3cuamFkZSIsImFwcC90ZW1wbGF0ZXMvcGFnZS1uYXYuamFkZSIsImFwcC90ZW1wbGF0ZXMvcXVlc3Rpb24tcm93LmphZGUiLCJhcHAvdGVtcGxhdGVzL3VzZXItbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvdXNlci1yb3cuamFkZSIsIm5vZGVfbW9kdWxlcy9qYWRlL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgSW50QXBwO1xuXG53aW5kb3cuSW50QXBwID0gSW50QXBwID0ge1xuICBBY2NvdW50UGFnZVZpZXc6IHJlcXVpcmUoJ2FjY291bnQtcGFnZScpLFxuICBCb29rUGFnZVZpZXc6IHJlcXVpcmUoJ2Jvb2stcGFnZScpLFxuICBRdWVzdGlvblBhZ2VWaWV3OiByZXF1aXJlKCdxdWVzdGlvbi1wYWdlJylcbn07XG5cbiIsbnVsbCwidmFyIEFjY291bnRQYWdlVmlldywgQmFzZUNvbGxlY3Rpb24sIEJhc2VNb2RlbCwgTW9kYWxWaWV3LCBQYWdpbmF0aW9uVmlldywgVGFibGVWaWV3LCBVc2VyLCBVc2VyTW9kYWxWaWV3LCBVc2VyVmlldywgVXNlcnMsIFVzZXJzVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VNb2RlbCA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1tb2RlbCcpO1xuXG5CYXNlQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1jb2xsZWN0aW9uJyk7XG5cblRhYmxlVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3RhYmxlLXZpZXcnKTtcblxuUGFnaW5hdGlvblZpZXcgPSByZXF1aXJlKCd2aWV3cy9wYWdpbmF0aW9uLXZpZXcnKTtcblxuTW9kYWxWaWV3ID0gcmVxdWlyZSgndmlld3MvbW9kYWwtdmlldycpO1xuXG5Vc2VyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFVzZXIsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXIoKSB7XG4gICAgcmV0dXJuIFVzZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVc2VyLnByb3RvdHlwZS51cmxSb290ID0gJy9hcGkvdjEvdXNlcic7XG5cbiAgVXNlci5wcm90b3R5cGUuZGVmYXVsdHMgPSB7XG4gICAgdXNlcm5hbWU6ICcnLFxuICAgIHBhc3N3b3JkOiAnJ1xuICB9O1xuXG4gIFVzZXIucHJvdG90eXBlLnZhbGlkYXRpb24gPSB7XG4gICAgdXNlcm5hbWU6IHtcbiAgICAgIGJsYW5rOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2U6ICfnlKjmiLflkI3kuI3og73kuLrnqbonXG4gICAgfSxcbiAgICBwYXNzd29yZDoge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgbWluTGVuZ3RoOiA2LFxuICAgICAgbWVzc2FnZTogJ+WvhueggeS4jeiDveWwkeS6jjbkvY0nXG4gICAgfVxuICB9O1xuXG4gIFVzZXIucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF0dHJzO1xuICAgIGF0dHJzID0ge1xuICAgICAgYWN0aXZlOiB0cnVlXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5zYXZlKGF0dHJzLCB7XG4gICAgICBhdHRyczogYXR0cnNcbiAgICB9KTtcbiAgfTtcblxuICBVc2VyLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF0dHJzO1xuICAgIGF0dHJzID0ge1xuICAgICAgYWN0aXZlOiBmYWxzZVxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuc2F2ZShhdHRycywge1xuICAgICAgYXR0cnM6IGF0dHJzXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFVzZXI7XG5cbn0pKEJhc2VNb2RlbCk7XG5cblVzZXJzID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFVzZXJzLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBVc2VycygpIHtcbiAgICByZXR1cm4gVXNlcnMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVc2Vycy5wcm90b3R5cGUudXJsID0gJy9hcGkvdjEvdXNlcic7XG5cbiAgVXNlcnMucHJvdG90eXBlLm1vZGVsID0gVXNlcjtcblxuICByZXR1cm4gVXNlcnM7XG5cbn0pKEJhc2VDb2xsZWN0aW9uKTtcblxuVXNlclZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlclZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJWaWV3KCkge1xuICAgIHJldHVybiBVc2VyVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS50YWdOYW1lID0gJ3RyJztcblxuICBVc2VyVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvdXNlci1yb3cnKTtcblxuICBVc2VyVmlldy5wcm90b3R5cGUuZXZlbnRzID0ge1xuICAgICdjbGljayAjZGVhY3RpdmF0ZSc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZGVhY3RpdmF0ZSgpO1xuICAgIH0sXG4gICAgJ2NsaWNrICNhY3RpdmF0ZSc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWwuYWN0aXZhdGUoKTtcbiAgICB9XG4gIH07XG5cbiAgVXNlclZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsIFwic3luY1wiLCB0aGlzLnJlbmRlcik7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJkZXN0cm95XCIsIHRoaXMucmVtb3ZlKTtcbiAgfTtcblxuICBVc2VyVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwudG9KU09OKCkpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gVXNlclZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG5Vc2VyTW9kYWxWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFVzZXJNb2RhbFZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJNb2RhbFZpZXcoKSB7XG4gICAgcmV0dXJuIFVzZXJNb2RhbFZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVc2VyTW9kYWxWaWV3LnByb3RvdHlwZS5iaW5kaW5ncyA9IHtcbiAgICAnI3VzZXJuYW1lJzogJ3VzZXJuYW1lJyxcbiAgICAnI3Bhc3N3b3JkJzogJ3Bhc3N3b3JkJ1xuICB9O1xuXG4gIHJldHVybiBVc2VyTW9kYWxWaWV3O1xuXG59KShNb2RhbFZpZXcpO1xuXG5Vc2Vyc1ZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlcnNWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBVc2Vyc1ZpZXcoKSB7XG4gICAgcmV0dXJuIFVzZXJzVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJzVmlldy5wcm90b3R5cGUucm93ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICByZXR1cm4gbmV3IFVzZXJWaWV3KHtcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBVc2Vyc1ZpZXc7XG5cbn0pKFRhYmxlVmlldyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQWNjb3VudFBhZ2VWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjY291bnRQYWdlVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQWNjb3VudFBhZ2VWaWV3KCkge1xuICAgIHJldHVybiBBY2NvdW50UGFnZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY2NvdW50UGFnZVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYWdlTmF2VmlldywgdXNlck1vZGFsVGVtcGxhdGUsIHVzZXJNb2RhbFZpZXcsIHVzZXJzLCB1c2Vyc1ZpZXc7XG4gICAgdXNlcnMgPSBuZXcgVXNlcnM7XG4gICAgdXNlcnNWaWV3ID0gbmV3IFVzZXJzVmlldyh7XG4gICAgICBlbDogJCgnLnRhYmxlLWNvbnRhaW5lcicpLFxuICAgICAgY29sbGVjdGlvbjogdXNlcnNcbiAgICB9KTtcbiAgICBwYWdlTmF2VmlldyA9IG5ldyBQYWdpbmF0aW9uVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiB1c2Vyc1xuICAgIH0pO1xuICAgIHVzZXJzVmlldy4kZWwuYWZ0ZXIocGFnZU5hdlZpZXcucmVuZGVyKCkuJGVsKTtcbiAgICB1c2VyTW9kYWxUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy91c2VyLW1vZGFsJyk7XG4gICAgJCgnYm9keScpLmFwcGVuZCh1c2VyTW9kYWxUZW1wbGF0ZSh7XG4gICAgICBpZDogJ3VzZXJNb2RhbEZvcm0nXG4gICAgfSkpO1xuICAgIHVzZXJNb2RhbFZpZXcgPSBuZXcgVXNlck1vZGFsVmlldyh7XG4gICAgICBlbDogJCgnI3VzZXJNb2RhbEZvcm0nKSxcbiAgICAgIGNvbGxlY3Rpb246IHVzZXJzXG4gICAgfSk7XG4gICAgdXNlcnMuZmV0Y2goe1xuICAgICAgcmVzZXQ6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gQWNjb3VudFBhZ2VWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIEJhc2VDb2xsZWN0aW9uLCBCYXNlTW9kZWwsIEJvb2tQYWdlVmlldywgTW9kYWxWaWV3LCBQYWdpbmF0aW9uVmlldywgUXVpekJvb2ssIFF1aXpCb29rTW9kYWxWaWV3LCBRdWl6Qm9va1ZpZXcsIFF1aXpCb29rcywgUXVpekJvb2tzVmlldywgVGFibGVWaWV3LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZU1vZGVsID0gcmVxdWlyZSgnZGF0YS9iYXNlLW1vZGVsJyk7XG5cbkJhc2VDb2xsZWN0aW9uID0gcmVxdWlyZSgnZGF0YS9iYXNlLWNvbGxlY3Rpb24nKTtcblxuVGFibGVWaWV3ID0gcmVxdWlyZSgndmlld3MvdGFibGUtdmlldycpO1xuXG5QYWdpbmF0aW9uVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3BhZ2luYXRpb24tdmlldycpO1xuXG5Nb2RhbFZpZXcgPSByZXF1aXJlKCd2aWV3cy9tb2RhbC12aWV3Jyk7XG5cblF1aXpCb29rID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1aXpCb29rLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWl6Qm9vaygpIHtcbiAgICByZXR1cm4gUXVpekJvb2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWl6Qm9vay5wcm90b3R5cGUudXJsUm9vdCA9ICcvYXBpL3YxL3F1aXpib29rJztcblxuICBRdWl6Qm9vay5wcm90b3R5cGUudmFsaWRhdGlvbiA9IHtcbiAgICB0aXRsZToge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogJ+mimOW6k+WQjeS4jeiDveS4uuepuidcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFF1aXpCb29rO1xuXG59KShCYXNlTW9kZWwpO1xuXG5RdWl6Qm9va3MgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVpekJvb2tzLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWl6Qm9va3MoKSB7XG4gICAgcmV0dXJuIFF1aXpCb29rcy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1aXpCb29rcy5wcm90b3R5cGUudXJsID0gJy9hcGkvdjEvcXVpemJvb2snO1xuXG4gIFF1aXpCb29rcy5wcm90b3R5cGUubW9kZWwgPSBRdWl6Qm9vaztcblxuICByZXR1cm4gUXVpekJvb2tzO1xuXG59KShCYXNlQ29sbGVjdGlvbik7XG5cblF1aXpCb29rVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWl6Qm9va1ZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1aXpCb29rVmlldygpIHtcbiAgICByZXR1cm4gUXVpekJvb2tWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVpekJvb2tWaWV3LnByb3RvdHlwZS50YWdOYW1lID0gJ3RyJztcblxuICBRdWl6Qm9va1ZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL2Jvb2stcm93Jyk7XG5cbiAgUXVpekJvb2tWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJzeW5jXCIsIHRoaXMucmVuZGVyKTtcbiAgfTtcblxuICBRdWl6Qm9va1ZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIFF1aXpCb29rVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cblF1aXpCb29rTW9kYWxWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1aXpCb29rTW9kYWxWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWl6Qm9va01vZGFsVmlldygpIHtcbiAgICByZXR1cm4gUXVpekJvb2tNb2RhbFZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWl6Qm9va01vZGFsVmlldy5wcm90b3R5cGUuYmluZGluZ3MgPSB7XG4gICAgJyN0aXRsZSc6ICd0aXRsZSdcbiAgfTtcblxuICByZXR1cm4gUXVpekJvb2tNb2RhbFZpZXc7XG5cbn0pKE1vZGFsVmlldyk7XG5cblF1aXpCb29rc1ZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVpekJvb2tzVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVpekJvb2tzVmlldygpIHtcbiAgICByZXR1cm4gUXVpekJvb2tzVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1aXpCb29rc1ZpZXcucHJvdG90eXBlLnJvdyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgcmV0dXJuIG5ldyBRdWl6Qm9va1ZpZXcoe1xuICAgICAgbW9kZWw6IG1vZGVsXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFF1aXpCb29rc1ZpZXc7XG5cbn0pKFRhYmxlVmlldyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQm9va1BhZ2VWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEJvb2tQYWdlVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQm9va1BhZ2VWaWV3KCkge1xuICAgIHJldHVybiBCb29rUGFnZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCb29rUGFnZVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBib29rTW9kYWxUZW1wbGF0ZSwgcGFnZU5hdlZpZXcsIHF1aXpCb29rTW9kYWxWaWV3LCBxdWl6Qm9va3MsIHF1aXpCb29rc1ZpZXc7XG4gICAgcXVpekJvb2tzID0gbmV3IFF1aXpCb29rcztcbiAgICBxdWl6Qm9va3NWaWV3ID0gbmV3IFF1aXpCb29rc1ZpZXcoe1xuICAgICAgZWw6ICQoJyNxdWl6Ym9vay10YWJsZS1jb250YWluZXInKSxcbiAgICAgIGNvbGxlY3Rpb246IHF1aXpCb29rc1xuICAgIH0pO1xuICAgIHBhZ2VOYXZWaWV3ID0gbmV3IFBhZ2luYXRpb25WaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHF1aXpCb29rc1xuICAgIH0pO1xuICAgIHF1aXpCb29rc1ZpZXcuJGVsLmFmdGVyKHBhZ2VOYXZWaWV3LnJlbmRlcigpLiRlbCk7XG4gICAgYm9va01vZGFsVGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvYm9vay1tb2RhbCcpO1xuICAgICQoJ2JvZHknKS5hcHBlbmQoYm9va01vZGFsVGVtcGxhdGUoe1xuICAgICAgaWQ6ICdib29rTW9kYWxGb3JtJ1xuICAgIH0pKTtcbiAgICBxdWl6Qm9va01vZGFsVmlldyA9IG5ldyBRdWl6Qm9va01vZGFsVmlldyh7XG4gICAgICBlbDogJCgnI2Jvb2tNb2RhbEZvcm0nKSxcbiAgICAgIGNvbGxlY3Rpb246IHF1aXpCb29rc1xuICAgIH0pO1xuICAgIHF1aXpCb29rcy5mZXRjaCh7XG4gICAgICByZXNldDogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBCb29rUGFnZVZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgQmFzZUNvbGxlY3Rpb24sXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5CYXNlQ29sbGVjdGlvbiA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChCYXNlQ29sbGVjdGlvbiwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQmFzZUNvbGxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIEJhc2VDb2xsZWN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQmFzZUNvbGxlY3Rpb24ucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmIChkYXRhICYmIGRhdGEubWV0YSkge1xuICAgICAgdGhpcy5tZXRhID0gZGF0YS5tZXRhO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YSAmJiBkYXRhLm9iamVjdHMgfHwgZGF0YTtcbiAgfTtcblxuICByZXR1cm4gQmFzZUNvbGxlY3Rpb247XG5cbn0pKEJhY2tib25lLkNvbGxlY3Rpb24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VDb2xsZWN0aW9uO1xuXG4iLCJ2YXIgQmFzZU1vZGVsLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZU1vZGVsID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEJhc2VNb2RlbCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQmFzZU1vZGVsKCkge1xuICAgIHJldHVybiBCYXNlTW9kZWwuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCYXNlTW9kZWwucHJvdG90eXBlLnVybCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcmlnVXJsO1xuICAgIG9yaWdVcmwgPSBCYXNlTW9kZWwuX19zdXBlcl9fLnVybC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiBvcmlnVXJsICsgKG9yaWdVcmwubGVuZ3RoID4gMCAmJiBvcmlnVXJsLmNoYXJBdChvcmlnVXJsLmxlbmd0aCAtIDEpID09PSAnLycgPyAnJyA6ICcvJyk7XG4gIH07XG5cbiAgQmFzZU1vZGVsLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLm9iamVjdHMgJiYgXy5pc0FycmF5KGRhdGEub2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBkYXRhLm9iamVjdHNbMF0gfHwge307XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIHJldHVybiBCYXNlTW9kZWw7XG5cbn0pKEJhY2tib25lLk1vZGVsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlTW9kZWw7XG5cbiIsInZhciBCYXNlQ29sbGVjdGlvbiwgQmFzZU1vZGVsLCBNb2RhbFZpZXcsIFBhZ2luYXRpb25WaWV3LCBRdWVzdGlvbiwgUXVlc3Rpb25MaXN0UGFuZWxWaWV3LCBRdWVzdGlvblBhZ2VWaWV3LCBRdWVzdGlvblZpZXcsIFF1ZXN0aW9ucywgUXVlc3Rpb25zVmlldywgVGFibGVWaWV3LCBjaGFyMkludCwgaW50MkNoYXIsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5CYXNlTW9kZWwgPSByZXF1aXJlKCdkYXRhL2Jhc2UtbW9kZWwnKTtcblxuQmFzZUNvbGxlY3Rpb24gPSByZXF1aXJlKCdkYXRhL2Jhc2UtY29sbGVjdGlvbicpO1xuXG5UYWJsZVZpZXcgPSByZXF1aXJlKCd2aWV3cy90YWJsZS12aWV3Jyk7XG5cblBhZ2luYXRpb25WaWV3ID0gcmVxdWlyZSgndmlld3MvcGFnaW5hdGlvbi12aWV3Jyk7XG5cbk1vZGFsVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL21vZGFsLXZpZXcnKTtcblxuaW50MkNoYXIgPSBmdW5jdGlvbihpKSB7XG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDY0ICsgcGFyc2VJbnQoaSkpO1xufTtcblxuY2hhcjJJbnQgPSBmdW5jdGlvbihjKSB7XG4gIGlmICghIWMpIHtcbiAgICByZXR1cm4gYy5jaGFyQ29kZUF0KDApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjO1xuICB9XG59O1xuXG5RdWVzdGlvbiA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvbiwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb24oKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb24ucHJvdG90eXBlLnVybFJvb3QgPSAnL2FwaS92MS9xdWVzdGlvbi8nO1xuXG4gIFF1ZXN0aW9uLnByb3RvdHlwZS5kZWZhdWx0cyA9IHtcbiAgICBcIm9wdGlvbl9BXCI6IFwiXCIsXG4gICAgXCJvcHRpb25fQlwiOiBcIlwiLFxuICAgIFwib3B0aW9uX0NcIjogXCJcIixcbiAgICBcIm9wdGlvbl9EXCI6IFwiXCIsXG4gICAgXCJvcHRpb25fRVwiOiBcIlwiLFxuICAgIFwib3B0aW9uX0ZcIjogXCJcIlxuICB9O1xuXG4gIFF1ZXN0aW9uLnByb3RvdHlwZS52YWxpZGF0aW9uID0ge1xuICAgIGNvbnRlbnQ6IHtcbiAgICAgIGJsYW5rOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2U6ICfpopjnm67lhoXlrrnkuI3og73kuLrnqbonXG4gICAgfSxcbiAgICB0eXBlOiB7XG4gICAgICBibGFuazogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSAxIHx8IHZhbHVlID09PSAyO1xuICAgICAgfSxcbiAgICAgIG1lc3NhZ2U6ICfpopjnm67nsbvlnovlv4XpobvmmK/lpJrpgInmiJbljZXpgIknXG4gICAgfSxcbiAgICBjb3JyZWN0X29wdGlvbjoge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN3aXRjaCAoZmFsc2UpIHtcbiAgICAgICAgICAgIGNhc2UgIV8uaXNBcnJheSh2YWx1ZSk6XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgIV8uaXNTdHJpbmcodmFsdWUpOlxuICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZS5sZW5ndGggPiA2KSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbWVzc2FnZTogJ+ato+ehruetlOahiOiuvue9ruWHuumUme+8jOazqOaEj+WvueW6lOeahOmAiemhueaYr+WQpuiuvue9ruS6huetlOahiCdcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXN0aW9uO1xuXG59KShCYXNlTW9kZWwpO1xuXG5RdWVzdGlvbnMgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb25zLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvbnMoKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9ucy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9ucy5wcm90b3R5cGUudXJsID0gJy9hcGkvdjEvcXVlc3Rpb24vJztcblxuICBRdWVzdGlvbnMucHJvdG90eXBlLm1vZGVsID0gUXVlc3Rpb247XG5cbiAgUXVlc3Rpb25zLnByb3RvdHlwZS5zdGF0ZSA9IHt9O1xuXG4gIFF1ZXN0aW9ucy5wcm90b3R5cGUuZmV0Y2ggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBvcHRpb25zKTtcbiAgICBkYXRhID0gb3B0aW9ucy5kYXRhO1xuICAgIG9wdGlvbnMuZGF0YSA9IF8uZXh0ZW5kKHt9LCB0aGlzLnN0YXRlLCBkYXRhKTtcbiAgICByZXR1cm4gUXVlc3Rpb25zLl9fc3VwZXJfXy5mZXRjaC5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvbnM7XG5cbn0pKEJhc2VDb2xsZWN0aW9uKTtcblxuUXVlc3Rpb25WaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1ZXN0aW9uVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb25WaWV3KCkge1xuICAgIHJldHVybiBRdWVzdGlvblZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWVzdGlvblZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAndHInO1xuXG4gIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvcXVlc3Rpb24tcm93Jyk7XG5cbiAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJzeW5jXCIsIHRoaXMucmVuZGVyKTtcbiAgfTtcblxuICBRdWVzdGlvblZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb3JyZWN0LCBkYXRhO1xuICAgIGRhdGEgPSB0aGlzLm1vZGVsLnRvSlNPTigpO1xuICAgIGNvcnJlY3QgPSBkYXRhWydjb3JyZWN0X29wdGlvbiddLnNwbGl0KCcsJyk7XG4gICAgZGF0YVsnY29ycmVjdF9vcHRpb24nXSA9IF8ubWFwKGNvcnJlY3QsIGludDJDaGFyKS5qb2luKCk7XG4gICAgZGF0YVsndHlwZSddID0gKGZ1bmN0aW9uKCkge1xuICAgICAgc3dpdGNoIChkYXRhWyd0eXBlJ10pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHJldHVybiAn5Y2V6YCJJztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHJldHVybiAn5aSa6YCJJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gJ+WkmumAiSc7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoZGF0YSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvblZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG5RdWVzdGlvbnNWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1ZXN0aW9uc1ZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uc1ZpZXcoKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9uc1ZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWVzdGlvbnNWaWV3LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHJldHVybiBuZXcgUXVlc3Rpb25WaWV3KHtcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvbnNWaWV3O1xuXG59KShUYWJsZVZpZXcpO1xuXG5RdWVzdGlvbkxpc3RQYW5lbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb25MaXN0UGFuZWxWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvbkxpc3RQYW5lbFZpZXcoKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9uTGlzdFBhbmVsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9uTGlzdFBhbmVsVmlldy5wcm90b3R5cGUuZXZlbnRzID0ge1xuICAgICdjaGFuZ2UgI2Jvb2snOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uc3RhdGUuYm9vayA9IHRoaXMuJCgnI2Jvb2snKS52YWwoKTtcbiAgICB9LFxuICAgICdjbGljayAjbG9hZEJvb2snOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmV0Y2goe1xuICAgICAgICByZXNldDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvbkxpc3RQYW5lbFZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uUGFnZVZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb25QYWdlVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb25QYWdlVmlldygpIHtcbiAgICByZXR1cm4gUXVlc3Rpb25QYWdlVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9uUGFnZVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGJvb2tJZCkge1xuICAgIHZhciBwYWdlTmF2VmlldywgcGFuZWxWaWV3LCBxdWVzdGlvbnMsIHF1ZXN0aW9uc1ZpZXc7XG4gICAgaWYgKCFib29rSWQpIHtcbiAgICAgIGJvb2tJZCA9ICQoJ2Zvcm0gc2VsZWN0W25hbWU9Ym9va10nKS52YWwoKTtcbiAgICB9XG4gICAgcXVlc3Rpb25zID0gbmV3IFF1ZXN0aW9ucztcbiAgICBxdWVzdGlvbnMuc3RhdGUuYm9vayA9IGJvb2tJZDtcbiAgICBwYW5lbFZpZXcgPSBuZXcgUXVlc3Rpb25MaXN0UGFuZWxWaWV3KHtcbiAgICAgIGVsOiAkKCcudGFibGUtY29udHJvbCcpLFxuICAgICAgY29sbGVjdGlvbjogcXVlc3Rpb25zXG4gICAgfSk7XG4gICAgcXVlc3Rpb25zVmlldyA9IG5ldyBRdWVzdGlvbnNWaWV3KHtcbiAgICAgIGVsOiAkKCcjcXVlc3Rpb24tdGFibGUtY29udGFpbmVyJyksXG4gICAgICBjb2xsZWN0aW9uOiBxdWVzdGlvbnNcbiAgICB9KTtcbiAgICBwYWdlTmF2VmlldyA9IG5ldyBQYWdpbmF0aW9uVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiBxdWVzdGlvbnNcbiAgICB9KTtcbiAgICBxdWVzdGlvbnNWaWV3LiRlbC5hZnRlcihwYWdlTmF2Vmlldy5yZW5kZXIoKS4kZWwpO1xuICAgIHF1ZXN0aW9ucy5mZXRjaCh7XG4gICAgICByZXNldDogdHJ1ZVxuICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcTtcbiAgICAgIHEgPSBxdWVzdGlvbnMuYXQoMCk7XG4gICAgICBjb25zb2xlLmxvZyhxLnRvSlNPTigpKTtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhxLnZhbGlkYXRlKCkpO1xuICAgIH0pO1xuICAgIHJldHVybiBRdWVzdGlvblBhZ2VWaWV3Ll9fc3VwZXJfXy5yZW5kZXIuY2FsbCh0aGlzKTtcbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25QYWdlVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBNb2RhbFZpZXcsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChNb2RhbFZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIE1vZGFsVmlldygpIHtcbiAgICByZXR1cm4gTW9kYWxWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgTW9kYWxWaWV3LnByb3RvdHlwZS5ldmVudHMgPSB7XG4gICAgJ3Nob3cuYnMubW9kYWwnOiAnc2hvdycsXG4gICAgJ2hpZGRlbi5icy5tb2RhbCc6ICdoaWRkZW4nLFxuICAgICdjbGljayBbdHlwZT1zdWJtaXRdJzogJ3NhdmUnXG4gIH07XG5cbiAgTW9kYWxWaWV3LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciBkYXRhO1xuICAgIGRhdGEgPSAkKGUucmVsYXRlZFRhcmdldCkuZGF0YSgpO1xuICAgIHRoaXMubW9kZWwgPSBkYXRhLmlkID8gdGhpcy5jb2xsZWN0aW9uLmdldChkYXRhLmlkKSA6IG5ldyB0aGlzLmNvbGxlY3Rpb24ubW9kZWw7XG4gICAgdGhpcy5zdGlja2l0KCk7XG4gICAgcmV0dXJuIHRoaXMuYmluZFZhbGlkYXRpb24oKTtcbiAgfTtcblxuICBNb2RhbFZpZXcucHJvdG90eXBlLmhpZGRlbiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudW5zdGlja2l0KCk7XG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nKCk7XG4gICAgcmV0dXJuIGRlbGV0ZSB0aGlzLm1vZGVsO1xuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwuc2F2ZSgpLnRoZW4oXy5iaW5kKChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuY29sbGVjdGlvbi5hZGQodGhpcy5tb2RlbCk7XG4gICAgICByZXR1cm4gdGhpcy4kZWwubW9kYWwoJ2hpZGUnKTtcbiAgICB9KSwgdGhpcykpO1xuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUub25WYWxpZEZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIG1vZGVsKSB7XG4gICAgdmFyIGZpZWxkLCBncm91cDtcbiAgICBmaWVsZCA9IHRoaXMuJChcIltuYW1lPVwiICsgbmFtZSArIFwiXVwiKTtcbiAgICBncm91cCA9IGZpZWxkLmNsb3Nlc3QoJy5mb3JtLWdyb3VwJyk7XG4gICAgZ3JvdXAucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgIHJldHVybiBncm91cC5maW5kKCcuaGVscC1ibG9jaycpLnJlbW92ZSgpO1xuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUub25JbnZhbGlkRmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgZXJyb3JzLCBtb2RlbCkge1xuICAgIHZhciBlcnJvciwgZmllbGQsIGdyb3VwLCBpLCBsZW47XG4gICAgZmllbGQgPSB0aGlzLiQoXCJbbmFtZT1cIiArIG5hbWUgKyBcIl1cIik7XG4gICAgZ3JvdXAgPSBmaWVsZC5jbG9zZXN0KCcuZm9ybS1ncm91cCcpO1xuICAgIGdyb3VwLmZpbmQoJy5oZWxwLWJsb2NrJykucmVtb3ZlKCk7XG4gICAgZm9yIChpID0gMCwgbGVuID0gZXJyb3JzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBlcnJvciA9IGVycm9yc1tpXTtcbiAgICAgIGZpZWxkLmFmdGVyKFwiPGRpdiBjbGFzcz0naGVscC1ibG9jayc+XCIgKyBlcnJvciArIFwiPC9kaXY+XCIpO1xuICAgIH1cbiAgICByZXR1cm4gZ3JvdXAuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICB9O1xuXG4gIHJldHVybiBNb2RhbFZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgUGFnaW5hdGlvblZpZXcsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2luYXRpb25WaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFBhZ2luYXRpb25WaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBQYWdpbmF0aW9uVmlldygpIHtcbiAgICByZXR1cm4gUGFnaW5hdGlvblZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUudGFnTmFtZSA9ICduYXYnO1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS5jbGFzc05hbWUgPSAncGFnZS1uYXYnO1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9wYWdlLW5hdicpO1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS5ldmVudHMgPSB7XG4gICAgJ2NsaWNrIGFbZGF0YS1pZF0nOiAnbG9hZFBhZ2UnXG4gIH07XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICdyZXNldCcsIHRoaXMucmVuZGVyKTtcbiAgfTtcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuY29sbGVjdGlvbi5tZXRhKSB7XG4gICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUodGhpcy5jb2xsZWN0aW9uLm1ldGEpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLmxvYWRQYWdlID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciBkYXRhO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBkYXRhID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoKTtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZldGNoKHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcGFnZTogZGF0YS5pZFxuICAgICAgfSxcbiAgICAgIHJlc2V0OiB0cnVlXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFBhZ2luYXRpb25WaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIFRhYmxlVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGVWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFRhYmxlVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gVGFibGVWaWV3KCkge1xuICAgIHJldHVybiBUYWJsZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBUYWJsZVZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ2FkZCcsIHRoaXMuYWRkKTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICdyZXNldCcsIHRoaXMucmVuZGVyKTtcbiAgfTtcblxuICBUYWJsZVZpZXcucHJvdG90eXBlLnJvdyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgfTtcblxuICBUYWJsZVZpZXcucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgdmFyIHJvdztcbiAgICByb3cgPSB0aGlzLnJvdyhtb2RlbCk7XG4gICAgcm93LiRlbC5hZGRDbGFzcygnc3VjY2VzcycpO1xuICAgIHJldHVybiB0aGlzLiQoJ3RhYmxlIHRib2R5JykucHJlcGVuZChyb3cucmVuZGVyKCkuJGVsKTtcbiAgfTtcblxuICBUYWJsZVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgdGJvZHk7XG4gICAgdGJvZHkgPSB0aGlzLiQoJ3RhYmxlIHRib2R5Jyk7XG4gICAgdGJvZHkuZW1wdHkoKTtcbiAgICBjb2xsZWN0aW9uLmVhY2goKGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICByZXR1cm4gdGJvZHkuYXBwZW5kKHRoaXMucm93KG1vZGVsKS5yZW5kZXIoKS4kZWwpO1xuICAgIH0pLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gVGFibGVWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaWQpIHtcbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImlkXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIHRhYmluZGV4PVxcXCItMVxcXCIgcm9sZT1cXFwiZGlhbG9nXFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcImJvb2tGb3JtTGFiZWxcXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwibW9kYWwgZmFkZVxcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtZGlhbG9nXFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1jb250ZW50XFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1oZWFkZXJcXFwiPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBjbGFzcz1cXFwiY2xvc2VcXFwiPjxzcGFuIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj4mdGltZXM7PC9zcGFuPjxzcGFuIGNsYXNzPVxcXCJzci1vbmx5XFxcIj7lhbPpl608L3NwYW4+PC9idXR0b24+PGg0IGlkPVxcXCJib29rRm9ybUxhYmVsXFxcIiBjbGFzcz1cXFwibW9kYWwtdGl0bGVcXFwiPui+k+WFpemimOW6k+S/oeaBrzwvaDQ+PC9kaXY+PGRpdiBjbGFzcz1cXFwibW9kYWwtYm9keVxcXCI+PGZvcm0+PGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+PGxhYmVsIGZvcj1cXFwidGl0bGVcXFwiIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIj7popjlupPlkI08L2xhYmVsPjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBpZD1cXFwidGl0bGVcXFwiIHBsYWNlaG9sZGVyPVxcXCLpopjlupPlkI1cXFwiIG5hbWU9XFxcInRpdGxlXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIi8+PC9kaXY+PC9mb3JtPjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtZGlzbWlzcz1cXFwibW9kYWxcXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiPuWPlua2iDwvYnV0dG9uPjxidXR0b24gaWQ9XFxcInNhdmVcXFwiIHR5cGU9XFxcInN1Ym1pdFxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCI+5L+d5a2YPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoYnV0dG9uLCBpZCwgdGl0bGUsIHVzZXIpIHtcbmJ1Zi5wdXNoKFwiPHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdGl0bGUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdXNlci51c2VybmFtZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+PGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsICcvcXVpemJvb2tzLycgKyAoaWQpICsgJy9xdWVzdGlvbnMnLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBidG4teHNcXFwiPuafpeecizwvYT48YVwiICsgKGphZGUuYXR0cihcInR5cGVcIiwgYnV0dG9uLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgaWQsIHRydWUsIGZhbHNlKSkgKyBcIiBkYXRhLXRvZ2dsZT1cXFwibW9kYWxcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjYm9va01vZGFsRm9ybVxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBidG4teHNcXFwiPue8lui+kTwvYT48L3RkPlwiKTt9LmNhbGwodGhpcyxcImJ1dHRvblwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguYnV0dG9uOnR5cGVvZiBidXR0b24hPT1cInVuZGVmaW5lZFwiP2J1dHRvbjp1bmRlZmluZWQsXCJpZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaWQ6dHlwZW9mIGlkIT09XCJ1bmRlZmluZWRcIj9pZDp1bmRlZmluZWQsXCJ0aXRsZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudGl0bGU6dHlwZW9mIHRpdGxlIT09XCJ1bmRlZmluZWRcIj90aXRsZTp1bmRlZmluZWQsXCJ1c2VyXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51c2VyOnR5cGVvZiB1c2VyIT09XCJ1bmRlZmluZWRcIj91c2VyOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKE1hdGgsIGVuZCwgcGFnZSwgcGFnZXMsIHN0YXJ0KSB7XG5zdGFydCA9IE1hdGgubWF4KDEsIHBhZ2UgLSA1KVxuZW5kID0gTWF0aC5taW4ocGFnZXMsIHBhZ2UgKyA1KVxuYnVmLnB1c2goXCI8dWwgY2xhc3M9XFxcInBhZ2luYXRpb25cXFwiPjxsaVwiICsgKGphZGUuY2xzKFsocGFnZSA9PSAxKSA/ICdkaXNhYmxlZCcgOiAnJ10sIFt0cnVlXSkpICsgXCI+PGEgaHJlZj1cXFwiI1xcXCIgYXJpYS1sYWJlbD1cXFwiU3RhcnRcXFwiIGRhdGEtaWQ9JzEnPjxzcGFuIGFyaWEtaGlkZGVuPVxcXCJhcmlhLWhpZGRlblxcXCI+JmxhcXVvOzwvc3Bhbj48L2E+PC9saT5cIik7XG52YXIgaSA9IHN0YXJ0XG53aGlsZSAoaSA8IHBhZ2UpXG57XG5idWYucHVzaChcIjxsaT48YSBocmVmPVxcXCIjXFxcIlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgaSwgdHJ1ZSwgZmFsc2UpKSArIFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gaSsrKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2E+PC9saT5cIik7XG59XG5idWYucHVzaChcIjxsaVwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgcGFnZSwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJhY3RpdmVcXFwiPjxhIGhyZWY9XFxcIiNcXFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gcGFnZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9hPjwvbGk+XCIpO1xudmFyIGkgPSBwYWdlICsgMVxud2hpbGUgKGkgPD0gZW5kKVxue1xuYnVmLnB1c2goXCI8bGk+PGEgaHJlZj1cXFwiI1xcXCJcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIGksIHRydWUsIGZhbHNlKSkgKyBcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGkrKykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9hPjwvbGk+XCIpO1xufVxuYnVmLnB1c2goXCI8bGlcIiArIChqYWRlLmNscyhbKHBhZ2UgPT0gcGFnZXMpID8gJ2Rpc2FibGVkJyA6ICcnXSwgW3RydWVdKSkgKyBcIj48YSBocmVmPVxcXCIjXFxcIiBhcmlhLWxhYmVsPVxcXCJFbmRcXFwiXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBwYWdlcywgdHJ1ZSwgZmFsc2UpKSArIFwiPjxzcGFuIGFyaWEtaGlkZGVuPVxcXCJhcmlhLWhpZGRlblxcXCI+JnJhcXVvOzwvc3Bhbj48L2E+PC9saT48L3VsPlwiKTt9LmNhbGwodGhpcyxcIk1hdGhcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLk1hdGg6dHlwZW9mIE1hdGghPT1cInVuZGVmaW5lZFwiP01hdGg6dW5kZWZpbmVkLFwiZW5kXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5lbmQ6dHlwZW9mIGVuZCE9PVwidW5kZWZpbmVkXCI/ZW5kOnVuZGVmaW5lZCxcInBhZ2VcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnBhZ2U6dHlwZW9mIHBhZ2UhPT1cInVuZGVmaW5lZFwiP3BhZ2U6dW5kZWZpbmVkLFwicGFnZXNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnBhZ2VzOnR5cGVvZiBwYWdlcyE9PVwidW5kZWZpbmVkXCI/cGFnZXM6dW5kZWZpbmVkLFwic3RhcnRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnN0YXJ0OnR5cGVvZiBzdGFydCE9PVwidW5kZWZpbmVkXCI/c3RhcnQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoYnV0dG9uLCBjb250ZW50LCBjb3JyZWN0X29wdGlvbiwgaWQsIG9wdGlvbl9BLCBvcHRpb25fQiwgb3B0aW9uX0MsIG9wdGlvbl9ELCBvcHRpb25fRSwgb3B0aW9uX0YsIHR5cGUpIHtcbmJ1Zi5wdXNoKFwiPHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gY29udGVudCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB0eXBlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGNvcnJlY3Rfb3B0aW9uKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9BKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9CKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9DKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9EKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9FKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9GKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD48YVwiICsgKGphZGUuYXR0cihcInR5cGVcIiwgYnV0dG9uLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgaWQsIHRydWUsIGZhbHNlKSkgKyBcIiBkYXRhLXRvZ2dsZT1cXFwibW9kYWxcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjcXVlc3Rpb25Nb2RhbEZvcm1cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYnRuLXhzXFxcIj7nvJbovpE8L2E+PGFcIiArIChqYWRlLmF0dHIoXCJ0eXBlXCIsIGJ1dHRvbiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJidG4gYnRuLWRhbmdlciBidG4teHNcXFwiPuWIoOmZpDwvYT48L3RkPlwiKTt9LmNhbGwodGhpcyxcImJ1dHRvblwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguYnV0dG9uOnR5cGVvZiBidXR0b24hPT1cInVuZGVmaW5lZFwiP2J1dHRvbjp1bmRlZmluZWQsXCJjb250ZW50XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5jb250ZW50OnR5cGVvZiBjb250ZW50IT09XCJ1bmRlZmluZWRcIj9jb250ZW50OnVuZGVmaW5lZCxcImNvcnJlY3Rfb3B0aW9uXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5jb3JyZWN0X29wdGlvbjp0eXBlb2YgY29ycmVjdF9vcHRpb24hPT1cInVuZGVmaW5lZFwiP2NvcnJlY3Rfb3B0aW9uOnVuZGVmaW5lZCxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCxcIm9wdGlvbl9BXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fQTp0eXBlb2Ygb3B0aW9uX0EhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9BOnVuZGVmaW5lZCxcIm9wdGlvbl9CXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fQjp0eXBlb2Ygb3B0aW9uX0IhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9COnVuZGVmaW5lZCxcIm9wdGlvbl9DXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fQzp0eXBlb2Ygb3B0aW9uX0MhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9DOnVuZGVmaW5lZCxcIm9wdGlvbl9EXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fRDp0eXBlb2Ygb3B0aW9uX0QhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9EOnVuZGVmaW5lZCxcIm9wdGlvbl9FXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fRTp0eXBlb2Ygb3B0aW9uX0UhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9FOnVuZGVmaW5lZCxcIm9wdGlvbl9GXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fRjp0eXBlb2Ygb3B0aW9uX0YhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9GOnVuZGVmaW5lZCxcInR5cGVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnR5cGU6dHlwZW9mIHR5cGUhPT1cInVuZGVmaW5lZFwiP3R5cGU6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaWQpIHtcbmphZGVfbWl4aW5zW1wiaW5wdXRcIl0gPSBqYWRlX2ludGVycCA9IGZ1bmN0aW9uKHR5cGUsaWQscGxhY2Vob2xkZXIsbGFiZWwsbmFtZSl7XG52YXIgYmxvY2sgPSAodGhpcyAmJiB0aGlzLmJsb2NrKSwgYXR0cmlidXRlcyA9ICh0aGlzICYmIHRoaXMuYXR0cmlidXRlcykgfHwge307XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPjxsYWJlbFwiICsgKGphZGUuYXR0cihcImZvclwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiY29sLXhzLTIgY29udHJvbC1sYWJlbFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbGFiZWwpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvbGFiZWw+PGRpdiBjbGFzcz1cXFwiY29sLXhzLTEwXFxcIj48aW5wdXRcIiArIChqYWRlLmF0dHIoXCJ0eXBlXCIsIFwiXCIgKyAodHlwZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcImlkXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBcIlwiICsgKHBsYWNlaG9sZGVyKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwibmFtZVwiLCBcIlwiICsgKG5hbWUpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiLz48L2Rpdj48L2Rpdj5cIik7XG59O1xuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5hdHRyKFwiaWRcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgdGFiaW5kZXg9XFxcIi0xXFxcIiByb2xlPVxcXCJkaWFsb2dcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwidXNlckZvcm1MYWJlbFxcXCIgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGNsYXNzPVxcXCJtb2RhbCBmYWRlXFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1kaWFsb2dcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWNvbnRlbnRcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWhlYWRlclxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtZGlzbWlzcz1cXFwibW9kYWxcXFwiIGNsYXNzPVxcXCJjbG9zZVxcXCI+PHNwYW4gYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPiZ0aW1lczs8L3NwYW4+PHNwYW4gY2xhc3M9XFxcInNyLW9ubHlcXFwiPuWFs+mXrTwvc3Bhbj48L2J1dHRvbj48aDQgaWQ9XFxcInVzZXJGb3JtTGFiZWxcXFwiIGNsYXNzPVxcXCJtb2RhbC10aXRsZVxcXCI+6L6T5YWl55So5oi35L+h5oGvPC9oND48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5XFxcIj48cm93Pjxmb3JtIGNsYXNzPVxcXCJmb3JtLWhvcml6b250YWxcXFwiPlwiKTtcbmphZGVfbWl4aW5zW1wiaW5wdXRcIl0oJ3RleHQnLCAndXNlcm5hbWUnLCAn55So5oi35ZCNJywgJ+eUqOaIt+WQjScsICd1c2VybmFtZScpO1xuamFkZV9taXhpbnNbXCJpbnB1dFwiXSgncGFzc3dvcmQnLCAncGFzc3dvcmQnLCAn5a+G56CBJywgJ+WvhueggScsICdwYXNzd29yZCcpO1xuYnVmLnB1c2goXCI8L2Zvcm0+PC9yb3c+PC9kaXY+PGRpdiBjbGFzcz1cXFwibW9kYWwtZm9vdGVyXFxcIj48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdFxcXCI+5Y+W5raIPC9idXR0b24+PGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiPuS/neWtmDwvYnV0dG9uPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGFjdGl2ZSwgYWRtaW4sIGlkLCB1c2VybmFtZSkge1xuYnVmLnB1c2goXCI8dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpZCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB1c2VybmFtZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+PGEgdHlwZT1cXFwiYnV0dG9uXFxcIlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgaWQsIHRydWUsIGZhbHNlKSkgKyBcIiBkYXRhLXRvZ2dsZT1cXFwibW9kYWxcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjdXNlck1vZGFsRm9ybVxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBidG4teHNcXFwiPuS/ruaUueWvhueggTwvYT5cIik7XG5pZiAoICFhZG1pbilcbntcbmlmICggYWN0aXZlKVxue1xuYnVmLnB1c2goXCI8YSBpZD1cXFwiZGVhY3RpdmF0ZVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXFxcIj7lhrvnu5PluJDlj7c8L2E+XCIpO1xufVxuZWxzZVxue1xuYnVmLnB1c2goXCI8YSBpZD1cXFwiYWN0aXZhdGVcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tc3VjY2VzcyBidG4teHNcXFwiPua/gOa0u+W4kOWPtzwvYT5cIik7XG59XG59XG5idWYucHVzaChcIjwvdGQ+XCIpO30uY2FsbCh0aGlzLFwiYWN0aXZlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5hY3RpdmU6dHlwZW9mIGFjdGl2ZSE9PVwidW5kZWZpbmVkXCI/YWN0aXZlOnVuZGVmaW5lZCxcImFkbWluXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5hZG1pbjp0eXBlb2YgYWRtaW4hPT1cInVuZGVmaW5lZFwiP2FkbWluOnVuZGVmaW5lZCxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCxcInVzZXJuYW1lXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51c2VybmFtZTp0eXBlb2YgdXNlcm5hbWUhPT1cInVuZGVmaW5lZFwiP3VzZXJuYW1lOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbihmdW5jdGlvbihmKXtpZih0eXBlb2YgZXhwb3J0cz09PVwib2JqZWN0XCImJnR5cGVvZiBtb2R1bGUhPT1cInVuZGVmaW5lZFwiKXttb2R1bGUuZXhwb3J0cz1mKCl9ZWxzZSBpZih0eXBlb2YgZGVmaW5lPT09XCJmdW5jdGlvblwiJiZkZWZpbmUuYW1kKXtkZWZpbmUoW10sZil9ZWxzZXt2YXIgZztpZih0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIil7Zz13aW5kb3d9ZWxzZSBpZih0eXBlb2YgZ2xvYmFsIT09XCJ1bmRlZmluZWRcIil7Zz1nbG9iYWx9ZWxzZSBpZih0eXBlb2Ygc2VsZiE9PVwidW5kZWZpbmVkXCIpe2c9c2VsZn1lbHNle2c9dGhpc31nLmphZGUgPSBmKCl9fSkoZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWVyZ2UgdHdvIGF0dHJpYnV0ZSBvYmplY3RzIGdpdmluZyBwcmVjZWRlbmNlXG4gKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcbiAqIHJlc3VsdGluZyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge09iamVjdH0gYVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBtZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuICB2YXIgYWMgPSBhWydjbGFzcyddO1xuICB2YXIgYmMgPSBiWydjbGFzcyddO1xuXG4gIGlmIChhYyB8fCBiYykge1xuICAgIGFjID0gYWMgfHwgW107XG4gICAgYmMgPSBiYyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWMpKSBhYyA9IFthY107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJjKSkgYmMgPSBbYmNdO1xuICAgIGFbJ2NsYXNzJ10gPSBhYy5jb25jYXQoYmMpLmZpbHRlcihudWxscyk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgIT0gJ2NsYXNzJykge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBGaWx0ZXIgbnVsbCBgdmFsYHMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBudWxscyh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJyc7XG59XG5cbi8qKlxuICogam9pbiBhcnJheSBhcyBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuam9pbkNsYXNzZXMgPSBqb2luQ2xhc3NlcztcbmZ1bmN0aW9uIGpvaW5DbGFzc2VzKHZhbCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbC5tYXAoam9pbkNsYXNzZXMpIDpcbiAgICAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSA/IE9iamVjdC5rZXlzKHZhbCkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHZhbFtrZXldOyB9KSA6XG4gICAgW3ZhbF0pLmZpbHRlcihudWxscykuam9pbignICcpO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBjbGFzc2VzXG4gKiBAcGFyYW0ge0FycmF5LjxCb29sZWFuPn0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmNscyA9IGZ1bmN0aW9uIGNscyhjbGFzc2VzLCBlc2NhcGVkKSB7XG4gIHZhciBidWYgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGVzY2FwZWQgJiYgZXNjYXBlZFtpXSkge1xuICAgICAgYnVmLnB1c2goZXhwb3J0cy5lc2NhcGUoam9pbkNsYXNzZXMoW2NsYXNzZXNbaV1dKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWYucHVzaChqb2luQ2xhc3NlcyhjbGFzc2VzW2ldKSk7XG4gICAgfVxuICB9XG4gIHZhciB0ZXh0ID0gam9pbkNsYXNzZXMoYnVmKTtcbiAgaWYgKHRleHQubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcgY2xhc3M9XCInICsgdGV4dCArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5cbmV4cG9ydHMuc3R5bGUgPSBmdW5jdGlvbiAodmFsKSB7XG4gIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModmFsKS5tYXAoZnVuY3Rpb24gKHN0eWxlKSB7XG4gICAgICByZXR1cm4gc3R5bGUgKyAnOicgKyB2YWxbc3R5bGVdO1xuICAgIH0pLmpvaW4oJzsnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG59O1xuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVzY2FwZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdGVyc2VcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRyID0gZnVuY3Rpb24gYXR0cihrZXksIHZhbCwgZXNjYXBlZCwgdGVyc2UpIHtcbiAgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgIHZhbCA9IGV4cG9ydHMuc3R5bGUodmFsKTtcbiAgfVxuICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiB2YWwgfHwgbnVsbCA9PSB2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICByZXR1cm4gJyAnICsgKHRlcnNlID8ga2V5IDoga2V5ICsgJz1cIicgKyBrZXkgKyAnXCInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmICgwID09IGtleS5pbmRleE9mKCdkYXRhJykgJiYgJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkge1xuICAgIGlmIChKU09OLnN0cmluZ2lmeSh2YWwpLmluZGV4T2YoJyYnKSAhPT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybignU2luY2UgSmFkZSAyLjAuMCwgYW1wZXJzYW5kcyAoYCZgKSBpbiBkYXRhIGF0dHJpYnV0ZXMgJyArXG4gICAgICAgICAgICAgICAgICAgJ3dpbGwgYmUgZXNjYXBlZCB0byBgJmFtcDtgJyk7XG4gICAgfTtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIGVsaW1pbmF0ZSB0aGUgZG91YmxlIHF1b3RlcyBhcm91bmQgZGF0ZXMgaW4gJyArXG4gICAgICAgICAgICAgICAgICAgJ0lTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyBcIj0nXCIgKyBKU09OLnN0cmluZ2lmeSh2YWwpLnJlcGxhY2UoLycvZywgJyZhcG9zOycpICsgXCInXCI7XG4gIH0gZWxzZSBpZiAoZXNjYXBlZCkge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgc3RyaW5naWZ5IGRhdGVzIGluIElTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIGV4cG9ydHMuZXNjYXBlKHZhbCkgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgc3RyaW5naWZ5IGRhdGVzIGluIElTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIic7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge09iamVjdH0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHJzID0gZnVuY3Rpb24gYXR0cnMob2JqLCB0ZXJzZSl7XG4gIHZhciBidWYgPSBbXTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbiAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgICAsIHZhbCA9IG9ialtrZXldO1xuXG4gICAgICBpZiAoJ2NsYXNzJyA9PSBrZXkpIHtcbiAgICAgICAgaWYgKHZhbCA9IGpvaW5DbGFzc2VzKHZhbCkpIHtcbiAgICAgICAgICBidWYucHVzaCgnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWYucHVzaChleHBvcnRzLmF0dHIoa2V5LCB2YWwsIGZhbHNlLCB0ZXJzZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYuam9pbignJyk7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIGphZGVfZW5jb2RlX2h0bWxfcnVsZXMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7J1xufTtcbnZhciBqYWRlX21hdGNoX2h0bWwgPSAvWyY8PlwiXS9nO1xuXG5mdW5jdGlvbiBqYWRlX2VuY29kZV9jaGFyKGMpIHtcbiAgcmV0dXJuIGphZGVfZW5jb2RlX2h0bWxfcnVsZXNbY10gfHwgYztcbn1cblxuZXhwb3J0cy5lc2NhcGUgPSBqYWRlX2VzY2FwZTtcbmZ1bmN0aW9uIGphZGVfZXNjYXBlKGh0bWwpe1xuICB2YXIgcmVzdWx0ID0gU3RyaW5nKGh0bWwpLnJlcGxhY2UoamFkZV9tYXRjaF9odG1sLCBqYWRlX2VuY29kZV9jaGFyKTtcbiAgaWYgKHJlc3VsdCA9PT0gJycgKyBodG1sKSByZXR1cm4gaHRtbDtcbiAgZWxzZSByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBSZS10aHJvdyB0aGUgZ2l2ZW4gYGVycmAgaW4gY29udGV4dCB0byB0aGVcbiAqIHRoZSBqYWRlIGluIGBmaWxlbmFtZWAgYXQgdGhlIGdpdmVuIGBsaW5lbm9gLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnJldGhyb3cgPSBmdW5jdGlvbiByZXRocm93KGVyciwgZmlsZW5hbWUsIGxpbmVubywgc3RyKXtcbiAgaWYgKCEoZXJyIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBlcnI7XG4gIGlmICgodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyB8fCAhZmlsZW5hbWUpICYmICFzdHIpIHtcbiAgICBlcnIubWVzc2FnZSArPSAnIG9uIGxpbmUgJyArIGxpbmVubztcbiAgICB0aHJvdyBlcnI7XG4gIH1cbiAgdHJ5IHtcbiAgICBzdHIgPSBzdHIgfHwgcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JylcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnSmFkZScpICsgJzonICsgbGluZW5vXG4gICAgKyAnXFxuJyArIGNvbnRleHQgKyAnXFxuXFxuJyArIGVyci5tZXNzYWdlO1xuICB0aHJvdyBlcnI7XG59O1xuXG5leHBvcnRzLkRlYnVnSXRlbSA9IGZ1bmN0aW9uIERlYnVnSXRlbShsaW5lbm8sIGZpbGVuYW1lKSB7XG4gIHRoaXMubGluZW5vID0gbGluZW5vO1xuICB0aGlzLmZpbGVuYW1lID0gZmlsZW5hbWU7XG59XG5cbn0se1wiZnNcIjoyfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cbn0se31dfSx7fSxbMV0pKDEpXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIl19
