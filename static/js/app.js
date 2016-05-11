(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IntApp, UIMixin;

UIMixin = require('ui-mixin');

window.IntApp = IntApp = {
  AccountPageView: require('account-page'),
  BookPageView: require('book-page'),
  QuestionPageView: require('question-page'),
  ActivityPageView: require('activity-page')
};

_.extend(IntApp, UIMixin);

IntApp.initUI = function() {
  this.layout.activate();
  this.pushMenu.activate();
  return this.tree();
};

$(function() {
  return IntApp.initUI();
});


},{"account-page":3,"activity-page":4,"book-page":5,"question-page":8,"ui-mixin":9}],2:[function(require,module,exports){

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
    var attrs, url;
    attrs = {
      active: true
    };
    url = "/accounts/" + this.id + "/toggle";
    return this.save(attrs, {
      attrs: attrs,
      url: url
    });
  };

  User.prototype.deactivate = function() {
    var attrs, url;
    attrs = {
      active: false
    };
    url = "/accounts/" + this.id + "/toggle";
    return this.save(attrs, {
      attrs: attrs,
      url: url
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

  UserModalView.prototype.template = require('templates/user-modal');

  UserModalView.prototype.bindings = {
    '#username': 'username',
    '#password': 'password'
  };

  UserModalView.prototype.save = function(e) {
    var url, xhr;
    e.preventDefault();
    url = this.model.isNew() ? "/accounts/create" : "/accounts/" + this.model.id + "/changePwd";
    xhr = this.model.save(null, {
      url: url
    });
    if (xhr) {
      return xhr.then(((function(_this) {
        return function() {
          _this.collection.add(_this.model);
          return _this.$el.modal('hide');
        };
      })(this)));
    }
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
    var pageNavView, userModalView, users, usersView;
    users = new Users;
    usersView = new UsersView({
      el: $('.table-container'),
      collection: users
    });
    pageNavView = new PaginationView({
      collection: users
    });
    usersView.$el.after(pageNavView.render().$el);
    userModalView = new UserModalView({
      id: 'userModalForm',
      collection: users
    });
    userModalView.render();
    users.fetch({
      reset: true
    });
    return this;
  };

  return AccountPageView;

})(Backbone.View);


},{"data/base-collection":6,"data/base-model":7,"templates/user-modal":19,"templates/user-row":20,"views/modal-view":10,"views/pagination-view":11,"views/table-view":12}],4:[function(require,module,exports){
var Activities, ActivitiesView, Activity, ActivityPageView, ActivityView, BaseCollection, BaseModel, DATETIME_FORMAT, ModalView, PaginationView, TableView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseModel = require('data/base-model');

BaseCollection = require('data/base-collection');

TableView = require('views/table-view');

PaginationView = require('views/pagination-view');

ModalView = require('views/modal-view');

DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

Activity = (function(superClass) {
  extend(Activity, superClass);

  function Activity() {
    return Activity.__super__.constructor.apply(this, arguments);
  }

  Activity.prototype.urlRoot = '/api/v1/activity/';

  Activity.prototype.defaults = {
    "info_field_1": "",
    "info_field_2": "",
    "info_field_3": ""
  };

  return Activity;

})(BaseModel);

Activities = (function(superClass) {
  extend(Activities, superClass);

  function Activities() {
    return Activities.__super__.constructor.apply(this, arguments);
  }

  Activities.prototype.url = '/api/v1/activity/';

  Activities.prototype.model = Activity;

  return Activities;

})(BaseCollection);

ActivityView = (function(superClass) {
  extend(ActivityView, superClass);

  function ActivityView() {
    return ActivityView.__super__.constructor.apply(this, arguments);
  }

  ActivityView.prototype.tagName = 'tr';

  ActivityView.prototype.template = require('templates/activity-row');

  ActivityView.prototype.render = function() {
    var data, end_at, front_host, now, start_at;
    front_host = window.front_host || '/';
    data = this.model.toJSON();
    start_at = new moment(data.start_at, DATETIME_FORMAT);
    end_at = new moment(data.end_at, DATETIME_FORMAT);
    now = new moment();
    data['status'] = (start_at < now && now < end_at) ? '开启' : '关闭';
    data['url'] = "http://" + front_host + "/index.html#" + data['code'];
    data['type'] = (function() {
      switch (data['type']) {
        case 0:
          return '普通';
        case 1:
          return '限时';
        case 2:
          return '挑战';
        default:
          return '未知';
      }
    })();
    this.$el.html(this.template(data));
    return this;
  };

  return ActivityView;

})(Backbone.View);

ActivitiesView = (function(superClass) {
  extend(ActivitiesView, superClass);

  function ActivitiesView() {
    return ActivitiesView.__super__.constructor.apply(this, arguments);
  }

  ActivitiesView.prototype.row = function(model) {
    return new ActivityView({
      model: model
    });
  };

  return ActivitiesView;

})(TableView);

module.exports = ActivityPageView = (function(superClass) {
  extend(ActivityPageView, superClass);

  function ActivityPageView() {
    return ActivityPageView.__super__.constructor.apply(this, arguments);
  }

  ActivityPageView.prototype.render = function() {
    var activities, activitiesView, pageNavView;
    activities = new Activities;
    activitiesView = new ActivitiesView({
      el: $('#activity-table-container'),
      collection: activities
    });
    pageNavView = new PaginationView({
      collection: activities
    });
    activitiesView.$el.after(pageNavView.render().$el);
    activities.fetch({
      reset: true
    });
    return this;
  };

  return ActivityPageView;

})(Backbone.View);


},{"data/base-collection":6,"data/base-model":7,"templates/activity-row":13,"views/modal-view":10,"views/pagination-view":11,"views/table-view":12}],5:[function(require,module,exports){
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

  QuizBookModalView.prototype.template = require('templates/book-modal');

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
    var pageNavView, quizBookModalView, quizBooks, quizBooksView;
    quizBooks = new QuizBooks;
    quizBooksView = new QuizBooksView({
      el: $('#quizbook-table-container'),
      collection: quizBooks
    });
    pageNavView = new PaginationView({
      collection: quizBooks
    });
    quizBooksView.$el.after(pageNavView.render().$el);
    quizBookModalView = new QuizBookModalView({
      id: 'bookModalForm',
      collection: quizBooks
    });
    quizBookModalView.render();
    quizBooks.fetch({
      reset: true
    });
    return this;
  };

  return BookPageView;

})(Backbone.View);


},{"data/base-collection":6,"data/base-model":7,"templates/book-modal":14,"templates/book-row":15,"views/modal-view":10,"views/pagination-view":11,"views/table-view":12}],6:[function(require,module,exports){
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


},{}],7:[function(require,module,exports){
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


},{}],8:[function(require,module,exports){
var BaseCollection, BaseModel, ModalView, PaginationView, Question, QuestionListPanelView, QuestionModalView, QuestionPageView, QuestionView, Questions, QuestionsView, TableView, char2Int, int2Char,
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
    "type": 1,
    "correct_option": "1",
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
              return false;
          }
        })();
        return !(_.isEmpty(value)) && _.every(value, (function(i) {
          return this.get('option_' + int2Char(i));
        }), this);
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

  QuestionView.prototype.events = {
    'click #delete': function() {
      if (window.confirm("是否删除?")) {
        return this.model.destroy();
      }
    }
  };

  QuestionView.prototype.initialize = function() {
    this.listenTo(this.model, "sync", this.render);
    return this.listenTo(this.model, "destroy", this.remove);
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

QuestionModalView = (function(superClass) {
  extend(QuestionModalView, superClass);

  function QuestionModalView() {
    return QuestionModalView.__super__.constructor.apply(this, arguments);
  }

  QuestionModalView.prototype.template = require('templates/question-modal');

  QuestionModalView.prototype.bindings = function() {
    var _bindings, code, j, len, ref;
    _bindings = {
      '[name=content]': 'content',
      '[name=type]': {
        observe: 'type',
        selectOptions: {
          collection: function() {
            return [
              {
                label: '单选',
                value: 1
              }, {
                label: '多选',
                value: 2
              }
            ];
          }
        },
        setOptions: {
          silent: false
        }
      },
      '[name=correct_option]': {
        observe: 'correct_option',
        onGet: function(value) {
          return value.split(',');
        },
        onSet: function(value) {
          if (_.isArray(value)) {
            return value.join(',');
          } else {
            return value;
          }
        }
      }
    };
    ref = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (j = 0, len = ref.length; j < len; j++) {
      code = ref[j];
      _bindings["[name=option_" + code + "]"] = 'option_' + code;
    }
    return _bindings;
  };

  QuestionModalView.prototype.show = function(e) {
    QuestionModalView.__super__.show.call(this, e);
    if (this.model.isNew()) {
      this.model.set('book', this.collection.state.book);
    }
    this.changeType(this.model, this.model.get('type'));
    return this.listenTo(this.model, "change:type", this.changeType);
  };

  QuestionModalView.prototype.changeType = function(model, value, options) {
    var curVal, type;
    type = value === 1 ? 'radio' : 'checkbox';
    curVal = model.get('correct_option');
    if (type === 'radio' && curVal) {
      model.set('correct_option', curVal[0]);
    }
    this.$('input[name=correct_option]').prop('type', type);
    return this.stickit();
  };

  QuestionModalView.prototype.onInvalidField = function(name, value, errors, model) {
    var error, field, group, j, len;
    if (name !== 'correct_option') {
      return QuestionModalView.__super__.onInvalidField.call(this, name, value, errors, model);
    } else {
      field = this.$("[name=" + name + "]");
      group = field.closest('.form-group');
      group.find('.help-block').remove();
      for (j = 0, len = errors.length; j < len; j++) {
        error = errors[j];
        group.append("<div class='help-block col-sm-offset-2'>" + error + "</div>");
      }
      return group.addClass('has-error');
    }
  };

  return QuestionModalView;

})(ModalView);

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
    var pageNavView, panelView, questionModalView, questions, questionsView;
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
    questionModalView = new QuestionModalView({
      id: 'questionModalForm',
      collection: questions
    });
    questionModalView.render();
    questions.fetch({
      reset: true
    });
    return QuestionPageView.__super__.render.call(this);
  };

  return QuestionPageView;

})(Backbone.View);


},{"data/base-collection":6,"data/base-model":7,"templates/question-modal":17,"templates/question-row":18,"views/modal-view":10,"views/pagination-view":11,"views/table-view":12}],9:[function(require,module,exports){
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


},{}],10:[function(require,module,exports){
var ModalView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = ModalView = (function(superClass) {
  extend(ModalView, superClass);

  function ModalView() {
    return ModalView.__super__.constructor.apply(this, arguments);
  }

  ModalView.prototype.render = function() {
    $('#' + this.id).remove();
    $('body').append(this.template({
      id: this.id
    }));
    this.setElement($('#' + this.id));
    return this;
  };

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
    this.bindValidation();
    if (!this.model.isNew()) {
      return this.model.validate();
    }
  };

  ModalView.prototype.hidden = function() {
    this.unstickit();
    this.stopListening();
    return delete this.model;
  };

  ModalView.prototype.save = function(e) {
    var xhr;
    e.preventDefault();
    xhr = this.model.save();
    if (xhr) {
      return xhr.then(((function(_this) {
        return function() {
          _this.collection.add(_this.model);
          return _this.$el.modal('hide');
        };
      })(this)));
    }
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


},{}],11:[function(require,module,exports){
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


},{"templates/page-nav":16}],12:[function(require,module,exports){
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


},{}],13:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (book, chances, end_at, id, info_field_2, info_field_3, multi, multi_points, name, single, single_points, start_at, status, time_limit, type, url, user, welcome) {
buf.push("<td>" + (jade.escape(null == (jade_interp = id) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = name) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = book.title) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = type) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = chances) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = time_limit) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = single) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = multi) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = single_points) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = multi_points) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = status) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = start_at) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = end_at) ? "" : jade_interp)) + "</td><td>" + (null == (jade_interp = welcome) ? "" : jade_interp) + "</td><td>" + (jade.escape(null == (jade_interp = info_field_3) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = info_field_2) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = info_field_3) ? "" : jade_interp)) + "</td><td><a" + (jade.attr("href", url, true, false)) + ">" + (jade.escape(null == (jade_interp = url) ? "" : jade_interp)) + "</a></td><td><a" + (jade.attr("href", "/activities/edit/" + (id) + "", true, false)) + " class=\"btn btn-primary btn-xs\">编辑</a></td><td>" + (jade.escape(null == (jade_interp = user.username) ? "" : jade_interp)) + "</td>");}.call(this,"book" in locals_for_with?locals_for_with.book:typeof book!=="undefined"?book:undefined,"chances" in locals_for_with?locals_for_with.chances:typeof chances!=="undefined"?chances:undefined,"end_at" in locals_for_with?locals_for_with.end_at:typeof end_at!=="undefined"?end_at:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"info_field_2" in locals_for_with?locals_for_with.info_field_2:typeof info_field_2!=="undefined"?info_field_2:undefined,"info_field_3" in locals_for_with?locals_for_with.info_field_3:typeof info_field_3!=="undefined"?info_field_3:undefined,"multi" in locals_for_with?locals_for_with.multi:typeof multi!=="undefined"?multi:undefined,"multi_points" in locals_for_with?locals_for_with.multi_points:typeof multi_points!=="undefined"?multi_points:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"single" in locals_for_with?locals_for_with.single:typeof single!=="undefined"?single:undefined,"single_points" in locals_for_with?locals_for_with.single_points:typeof single_points!=="undefined"?single_points:undefined,"start_at" in locals_for_with?locals_for_with.start_at:typeof start_at!=="undefined"?start_at:undefined,"status" in locals_for_with?locals_for_with.status:typeof status!=="undefined"?status:undefined,"time_limit" in locals_for_with?locals_for_with.time_limit:typeof time_limit!=="undefined"?time_limit:undefined,"type" in locals_for_with?locals_for_with.type:typeof type!=="undefined"?type:undefined,"url" in locals_for_with?locals_for_with.url:typeof url!=="undefined"?url:undefined,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined,"welcome" in locals_for_with?locals_for_with.welcome:typeof welcome!=="undefined"?welcome:undefined));;return buf.join("");
};
},{"jade/runtime":21}],14:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (id) {
buf.push("<div" + (jade.attr("id", "" + (id) + "", true, false)) + " tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"bookFormLabel\" aria-hidden=\"true\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" class=\"close\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">关闭</span></button><h4 id=\"bookFormLabel\" class=\"modal-title\">输入题库信息</h4></div><div class=\"modal-body\"><form><div class=\"form-group\"><label for=\"title\" class=\"control-label\">题库名</label><input type=\"text\" id=\"title\" placeholder=\"题库名\" name=\"title\" class=\"form-control\"/></div></form></div><div class=\"modal-footer\"><button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default\">取消</button><button id=\"save\" type=\"submit\" class=\"btn btn-primary\">保存</button></div></div></div></div>");}.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined));;return buf.join("");
};
},{"jade/runtime":21}],15:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (button, id, title, user) {
buf.push("<td>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = user.username) ? "" : jade_interp)) + "</td><td><a" + (jade.attr("href", '/quizbooks/' + (id) + '/questions', true, false)) + " class=\"btn btn-default btn-xs\">查看</a><a" + (jade.attr("type", button, true, false)) + (jade.attr("data-id", id, true, false)) + " data-toggle=\"modal\" data-target=\"#bookModalForm\" class=\"btn btn-primary btn-xs\">编辑</a></td>");}.call(this,"button" in locals_for_with?locals_for_with.button:typeof button!=="undefined"?button:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));;return buf.join("");
};
},{"jade/runtime":21}],16:[function(require,module,exports){
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
},{"jade/runtime":21}],17:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (id, undefined) {
jade_mixins["textarea"] = jade_interp = function(id,label,name){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"form-group\"><label" + (jade.attr("for", "" + (id) + "", true, false)) + " class=\"col-sm-2 control-label\">" + (jade.escape((jade_interp = label) == null ? '' : jade_interp)) + "</label><div class=\"col-sm-10\"><textarea" + (jade.attr("id", "" + (id) + "", true, false)) + (jade.attr("name", "" + (name) + "", true, false)) + " row=\"4\" class=\"form-control\"></textarea></div></div>");
};
buf.push("<div" + (jade.attr("id", "" + (id) + "", true, false)) + " tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"questionFormLabel\" aria-hidden=\"true\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" class=\"close\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">关闭</span></button><h4 id=\"questionFormLabel\" class=\"modal-title\">输入问题详细信息</h4></div><div class=\"modal-body\"><form class=\"form-horizontal\">");
jade_mixins["textarea"]('content', '问题内容', 'content');
buf.push("<div class=\"form-group\"><label for=\"type\" class=\"col-sm-2 control-label\">问题内容</label><div class=\"col-sm-10\"><select id=\"type\" row=\"4\" name=\"type\" class=\"form-control textarea\"></select></div></div>");
var options = ['A', 'B', 'C', 'D', 'E', 'F']
// iterate options
;(function(){
  var $$obj = options;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var option = $$obj[$index];

jade_mixins["textarea"]('option_' + option, "选项" + option, 'option_' + option);
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var option = $$obj[$index];

jade_mixins["textarea"]('option_' + option, "选项" + option, 'option_' + option);
    }

  }
}).call(this);

buf.push("<div class=\"form-group\"><label class=\"col-sm-2 control-label\">正确答案</label><div class=\"col-sm-10\">");
// iterate options
;(function(){
  var $$obj = options;
  if ('number' == typeof $$obj.length) {

    for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
      var option = $$obj[i];

buf.push("<div class=\"checkbox col-xs-6 col-sm-4\"><label><input type=\"checkbox\" name=\"correct_option\"" + (jade.attr("value", i+1, true, false)) + "/>选项" + (jade.escape((jade_interp = option) == null ? '' : jade_interp)) + "</label></div>");
    }

  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;      var option = $$obj[i];

buf.push("<div class=\"checkbox col-xs-6 col-sm-4\"><label><input type=\"checkbox\" name=\"correct_option\"" + (jade.attr("value", i+1, true, false)) + "/>选项" + (jade.escape((jade_interp = option) == null ? '' : jade_interp)) + "</label></div>");
    }

  }
}).call(this);

buf.push("</div></div></form></div><div class=\"modal-footer\"><button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default\">取消</button><button type=\"submit\" class=\"btn btn-primary\">保存</button></div></div></div></div>");}.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":21}],18:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (button, content, correct_option, id, option_A, option_B, option_C, option_D, option_E, option_F, type) {
buf.push("<td class=\"content\">" + (jade.escape(null == (jade_interp = content) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = type) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = correct_option) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_A) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_B) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_C) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_D) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_E) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_F) ? "" : jade_interp)) + "</td><td><a" + (jade.attr("type", button, true, false)) + (jade.attr("data-id", id, true, false)) + " data-toggle=\"modal\" data-target=\"#questionModalForm\" class=\"btn btn-primary btn-xs\">编辑</a><a id=\"delete\"" + (jade.attr("type", button, true, false)) + " class=\"btn btn-danger btn-xs\">删除</a></td>");}.call(this,"button" in locals_for_with?locals_for_with.button:typeof button!=="undefined"?button:undefined,"content" in locals_for_with?locals_for_with.content:typeof content!=="undefined"?content:undefined,"correct_option" in locals_for_with?locals_for_with.correct_option:typeof correct_option!=="undefined"?correct_option:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"option_A" in locals_for_with?locals_for_with.option_A:typeof option_A!=="undefined"?option_A:undefined,"option_B" in locals_for_with?locals_for_with.option_B:typeof option_B!=="undefined"?option_B:undefined,"option_C" in locals_for_with?locals_for_with.option_C:typeof option_C!=="undefined"?option_C:undefined,"option_D" in locals_for_with?locals_for_with.option_D:typeof option_D!=="undefined"?option_D:undefined,"option_E" in locals_for_with?locals_for_with.option_E:typeof option_E!=="undefined"?option_E:undefined,"option_F" in locals_for_with?locals_for_with.option_F:typeof option_F!=="undefined"?option_F:undefined,"type" in locals_for_with?locals_for_with.type:typeof type!=="undefined"?type:undefined));;return buf.join("");
};
},{"jade/runtime":21}],19:[function(require,module,exports){
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
},{"jade/runtime":21}],20:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (active, admin, id, username) {
buf.push("<td>" + (jade.escape(null == (jade_interp = id) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = username) ? "" : jade_interp)) + "</td><td>");
if ( !admin)
{
buf.push("<a type=\"button\"" + (jade.attr("data-id", id, true, false)) + " data-toggle=\"modal\" data-target=\"#userModalForm\" class=\"btn btn-default btn-xs\">修改密码");
if ( active)
{
buf.push("<a id=\"deactivate\" type=\"button\" class=\"btn btn-danger btn-xs\">冻结帐号</a>");
}
else
{
buf.push("<a id=\"activate\" type=\"button\" class=\"btn btn-success btn-xs\">激活帐号</a>");
}
buf.push("</a>");
}
buf.push("</td>");}.call(this,"active" in locals_for_with?locals_for_with.active:typeof active!=="undefined"?active:undefined,"admin" in locals_for_with?locals_for_with.admin:typeof admin!=="undefined"?admin:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"username" in locals_for_with?locals_for_with.username:typeof username!=="undefined"?username:undefined));;return buf.join("");
};
},{"jade/runtime":21}],21:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvYXBwL3NjcmlwdHMvYXBwLmNvZmZlZSIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsImFwcC9zY3JpcHRzL2FjY291bnQtcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9hY3Rpdml0eS1wYWdlLmNvZmZlZSIsImFwcC9zY3JpcHRzL2Jvb2stcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9kYXRhL2Jhc2UtY29sbGVjdGlvbi5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9kYXRhL2Jhc2UtbW9kZWwuY29mZmVlIiwiYXBwL3NjcmlwdHMvcXVlc3Rpb24tcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy91aS1taXhpbi5jb2ZmZWUiLCJhcHAvc2NyaXB0cy92aWV3cy9tb2RhbC12aWV3LmNvZmZlZSIsImFwcC9zY3JpcHRzL3ZpZXdzL3BhZ2luYXRpb24tdmlldy5jb2ZmZWUiLCJhcHAvc2NyaXB0cy92aWV3cy90YWJsZS12aWV3LmNvZmZlZSIsImFwcC90ZW1wbGF0ZXMvYWN0aXZpdHktcm93LmphZGUiLCJhcHAvdGVtcGxhdGVzL2Jvb2stbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvYm9vay1yb3cuamFkZSIsImFwcC90ZW1wbGF0ZXMvcGFnZS1uYXYuamFkZSIsImFwcC90ZW1wbGF0ZXMvcXVlc3Rpb24tbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvcXVlc3Rpb24tcm93LmphZGUiLCJhcHAvdGVtcGxhdGVzL3VzZXItbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvdXNlci1yb3cuamFkZSIsIm5vZGVfbW9kdWxlcy9qYWRlL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgSW50QXBwLCBVSU1peGluO1xuXG5VSU1peGluID0gcmVxdWlyZSgndWktbWl4aW4nKTtcblxud2luZG93LkludEFwcCA9IEludEFwcCA9IHtcbiAgQWNjb3VudFBhZ2VWaWV3OiByZXF1aXJlKCdhY2NvdW50LXBhZ2UnKSxcbiAgQm9va1BhZ2VWaWV3OiByZXF1aXJlKCdib29rLXBhZ2UnKSxcbiAgUXVlc3Rpb25QYWdlVmlldzogcmVxdWlyZSgncXVlc3Rpb24tcGFnZScpLFxuICBBY3Rpdml0eVBhZ2VWaWV3OiByZXF1aXJlKCdhY3Rpdml0eS1wYWdlJylcbn07XG5cbl8uZXh0ZW5kKEludEFwcCwgVUlNaXhpbik7XG5cbkludEFwcC5pbml0VUkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5sYXlvdXQuYWN0aXZhdGUoKTtcbiAgdGhpcy5wdXNoTWVudS5hY3RpdmF0ZSgpO1xuICByZXR1cm4gdGhpcy50cmVlKCk7XG59O1xuXG4kKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSW50QXBwLmluaXRVSSgpO1xufSk7XG5cbiIsbnVsbCwidmFyIEFjY291bnRQYWdlVmlldywgQmFzZUNvbGxlY3Rpb24sIEJhc2VNb2RlbCwgTW9kYWxWaWV3LCBQYWdpbmF0aW9uVmlldywgVGFibGVWaWV3LCBVc2VyLCBVc2VyTW9kYWxWaWV3LCBVc2VyVmlldywgVXNlcnMsIFVzZXJzVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VNb2RlbCA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1tb2RlbCcpO1xuXG5CYXNlQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1jb2xsZWN0aW9uJyk7XG5cblRhYmxlVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3RhYmxlLXZpZXcnKTtcblxuUGFnaW5hdGlvblZpZXcgPSByZXF1aXJlKCd2aWV3cy9wYWdpbmF0aW9uLXZpZXcnKTtcblxuTW9kYWxWaWV3ID0gcmVxdWlyZSgndmlld3MvbW9kYWwtdmlldycpO1xuXG5Vc2VyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFVzZXIsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXIoKSB7XG4gICAgcmV0dXJuIFVzZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVc2VyLnByb3RvdHlwZS51cmxSb290ID0gJy9hcGkvdjEvdXNlcic7XG5cbiAgVXNlci5wcm90b3R5cGUuZGVmYXVsdHMgPSB7XG4gICAgdXNlcm5hbWU6ICcnLFxuICAgIHBhc3N3b3JkOiAnJ1xuICB9O1xuXG4gIFVzZXIucHJvdG90eXBlLnZhbGlkYXRpb24gPSB7XG4gICAgdXNlcm5hbWU6IHtcbiAgICAgIGJsYW5rOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2U6ICfnlKjmiLflkI3kuI3og73kuLrnqbonXG4gICAgfSxcbiAgICBwYXNzd29yZDoge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgbWluTGVuZ3RoOiA2LFxuICAgICAgbWVzc2FnZTogJ+WvhueggeS4jeiDveWwkeS6jjbkvY0nXG4gICAgfVxuICB9O1xuXG4gIFVzZXIucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF0dHJzLCB1cmw7XG4gICAgYXR0cnMgPSB7XG4gICAgICBhY3RpdmU6IHRydWVcbiAgICB9O1xuICAgIHVybCA9IFwiL2FjY291bnRzL1wiICsgdGhpcy5pZCArIFwiL3RvZ2dsZVwiO1xuICAgIHJldHVybiB0aGlzLnNhdmUoYXR0cnMsIHtcbiAgICAgIGF0dHJzOiBhdHRycyxcbiAgICAgIHVybDogdXJsXG4gICAgfSk7XG4gIH07XG5cbiAgVXNlci5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdHRycywgdXJsO1xuICAgIGF0dHJzID0ge1xuICAgICAgYWN0aXZlOiBmYWxzZVxuICAgIH07XG4gICAgdXJsID0gXCIvYWNjb3VudHMvXCIgKyB0aGlzLmlkICsgXCIvdG9nZ2xlXCI7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZShhdHRycywge1xuICAgICAgYXR0cnM6IGF0dHJzLFxuICAgICAgdXJsOiB1cmxcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gVXNlcjtcblxufSkoQmFzZU1vZGVsKTtcblxuVXNlcnMgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlcnMsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJzKCkge1xuICAgIHJldHVybiBVc2Vycy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJzLnByb3RvdHlwZS51cmwgPSAnL2FwaS92MS91c2VyJztcblxuICBVc2Vycy5wcm90b3R5cGUubW9kZWwgPSBVc2VyO1xuXG4gIHJldHVybiBVc2VycztcblxufSkoQmFzZUNvbGxlY3Rpb24pO1xuXG5Vc2VyVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChVc2VyVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gVXNlclZpZXcoKSB7XG4gICAgcmV0dXJuIFVzZXJWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVXNlclZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAndHInO1xuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy91c2VyLXJvdycpO1xuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS5ldmVudHMgPSB7XG4gICAgJ2NsaWNrICNkZWFjdGl2YXRlJzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbC5kZWFjdGl2YXRlKCk7XG4gICAgfSxcbiAgICAnY2xpY2sgI2FjdGl2YXRlJzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbC5hY3RpdmF0ZSgpO1xuICAgIH1cbiAgfTtcblxuICBVc2VyVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJzeW5jXCIsIHRoaXMucmVuZGVyKTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcImRlc3Ryb3lcIiwgdGhpcy5yZW1vdmUpO1xuICB9O1xuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBVc2VyVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cblVzZXJNb2RhbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlck1vZGFsVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gVXNlck1vZGFsVmlldygpIHtcbiAgICByZXR1cm4gVXNlck1vZGFsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJNb2RhbFZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL3VzZXItbW9kYWwnKTtcblxuICBVc2VyTW9kYWxWaWV3LnByb3RvdHlwZS5iaW5kaW5ncyA9IHtcbiAgICAnI3VzZXJuYW1lJzogJ3VzZXJuYW1lJyxcbiAgICAnI3Bhc3N3b3JkJzogJ3Bhc3N3b3JkJ1xuICB9O1xuXG4gIFVzZXJNb2RhbFZpZXcucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHVybCwgeGhyO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB1cmwgPSB0aGlzLm1vZGVsLmlzTmV3KCkgPyBcIi9hY2NvdW50cy9jcmVhdGVcIiA6IFwiL2FjY291bnRzL1wiICsgdGhpcy5tb2RlbC5pZCArIFwiL2NoYW5nZVB3ZFwiO1xuICAgIHhociA9IHRoaXMubW9kZWwuc2F2ZShudWxsLCB7XG4gICAgICB1cmw6IHVybFxuICAgIH0pO1xuICAgIGlmICh4aHIpIHtcbiAgICAgIHJldHVybiB4aHIudGhlbigoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBfdGhpcy5jb2xsZWN0aW9uLmFkZChfdGhpcy5tb2RlbCk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLiRlbC5tb2RhbCgnaGlkZScpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFVzZXJNb2RhbFZpZXc7XG5cbn0pKE1vZGFsVmlldyk7XG5cblVzZXJzVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChVc2Vyc1ZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJzVmlldygpIHtcbiAgICByZXR1cm4gVXNlcnNWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVXNlcnNWaWV3LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHJldHVybiBuZXcgVXNlclZpZXcoe1xuICAgICAgbW9kZWw6IG1vZGVsXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFVzZXJzVmlldztcblxufSkoVGFibGVWaWV3KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBY2NvdW50UGFnZVZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQWNjb3VudFBhZ2VWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBBY2NvdW50UGFnZVZpZXcoKSB7XG4gICAgcmV0dXJuIEFjY291bnRQYWdlVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFjY291bnRQYWdlVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhZ2VOYXZWaWV3LCB1c2VyTW9kYWxWaWV3LCB1c2VycywgdXNlcnNWaWV3O1xuICAgIHVzZXJzID0gbmV3IFVzZXJzO1xuICAgIHVzZXJzVmlldyA9IG5ldyBVc2Vyc1ZpZXcoe1xuICAgICAgZWw6ICQoJy50YWJsZS1jb250YWluZXInKSxcbiAgICAgIGNvbGxlY3Rpb246IHVzZXJzXG4gICAgfSk7XG4gICAgcGFnZU5hdlZpZXcgPSBuZXcgUGFnaW5hdGlvblZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdXNlcnNcbiAgICB9KTtcbiAgICB1c2Vyc1ZpZXcuJGVsLmFmdGVyKHBhZ2VOYXZWaWV3LnJlbmRlcigpLiRlbCk7XG4gICAgdXNlck1vZGFsVmlldyA9IG5ldyBVc2VyTW9kYWxWaWV3KHtcbiAgICAgIGlkOiAndXNlck1vZGFsRm9ybScsXG4gICAgICBjb2xsZWN0aW9uOiB1c2Vyc1xuICAgIH0pO1xuICAgIHVzZXJNb2RhbFZpZXcucmVuZGVyKCk7XG4gICAgdXNlcnMuZmV0Y2goe1xuICAgICAgcmVzZXQ6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gQWNjb3VudFBhZ2VWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIEFjdGl2aXRpZXMsIEFjdGl2aXRpZXNWaWV3LCBBY3Rpdml0eSwgQWN0aXZpdHlQYWdlVmlldywgQWN0aXZpdHlWaWV3LCBCYXNlQ29sbGVjdGlvbiwgQmFzZU1vZGVsLCBEQVRFVElNRV9GT1JNQVQsIE1vZGFsVmlldywgUGFnaW5hdGlvblZpZXcsIFRhYmxlVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VNb2RlbCA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1tb2RlbCcpO1xuXG5CYXNlQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1jb2xsZWN0aW9uJyk7XG5cblRhYmxlVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3RhYmxlLXZpZXcnKTtcblxuUGFnaW5hdGlvblZpZXcgPSByZXF1aXJlKCd2aWV3cy9wYWdpbmF0aW9uLXZpZXcnKTtcblxuTW9kYWxWaWV3ID0gcmVxdWlyZSgndmlld3MvbW9kYWwtdmlldycpO1xuXG5EQVRFVElNRV9GT1JNQVQgPSAnWVlZWS1NTS1ERCBISDptbTpzcyc7XG5cbkFjdGl2aXR5ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjdGl2aXR5LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBBY3Rpdml0eSgpIHtcbiAgICByZXR1cm4gQWN0aXZpdHkuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY3Rpdml0eS5wcm90b3R5cGUudXJsUm9vdCA9ICcvYXBpL3YxL2FjdGl2aXR5Lyc7XG5cbiAgQWN0aXZpdHkucHJvdG90eXBlLmRlZmF1bHRzID0ge1xuICAgIFwiaW5mb19maWVsZF8xXCI6IFwiXCIsXG4gICAgXCJpbmZvX2ZpZWxkXzJcIjogXCJcIixcbiAgICBcImluZm9fZmllbGRfM1wiOiBcIlwiXG4gIH07XG5cbiAgcmV0dXJuIEFjdGl2aXR5O1xuXG59KShCYXNlTW9kZWwpO1xuXG5BY3Rpdml0aWVzID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjdGl2aXRpZXMsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFjdGl2aXRpZXMoKSB7XG4gICAgcmV0dXJuIEFjdGl2aXRpZXMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY3Rpdml0aWVzLnByb3RvdHlwZS51cmwgPSAnL2FwaS92MS9hY3Rpdml0eS8nO1xuXG4gIEFjdGl2aXRpZXMucHJvdG90eXBlLm1vZGVsID0gQWN0aXZpdHk7XG5cbiAgcmV0dXJuIEFjdGl2aXRpZXM7XG5cbn0pKEJhc2VDb2xsZWN0aW9uKTtcblxuQWN0aXZpdHlWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjdGl2aXR5Vmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQWN0aXZpdHlWaWV3KCkge1xuICAgIHJldHVybiBBY3Rpdml0eVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY3Rpdml0eVZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAndHInO1xuXG4gIEFjdGl2aXR5Vmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvYWN0aXZpdHktcm93Jyk7XG5cbiAgQWN0aXZpdHlWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0YSwgZW5kX2F0LCBmcm9udF9ob3N0LCBub3csIHN0YXJ0X2F0O1xuICAgIGZyb250X2hvc3QgPSB3aW5kb3cuZnJvbnRfaG9zdCB8fCAnLyc7XG4gICAgZGF0YSA9IHRoaXMubW9kZWwudG9KU09OKCk7XG4gICAgc3RhcnRfYXQgPSBuZXcgbW9tZW50KGRhdGEuc3RhcnRfYXQsIERBVEVUSU1FX0ZPUk1BVCk7XG4gICAgZW5kX2F0ID0gbmV3IG1vbWVudChkYXRhLmVuZF9hdCwgREFURVRJTUVfRk9STUFUKTtcbiAgICBub3cgPSBuZXcgbW9tZW50KCk7XG4gICAgZGF0YVsnc3RhdHVzJ10gPSAoc3RhcnRfYXQgPCBub3cgJiYgbm93IDwgZW5kX2F0KSA/ICflvIDlkK8nIDogJ+WFs+mXrSc7XG4gICAgZGF0YVsndXJsJ10gPSBcImh0dHA6Ly9cIiArIGZyb250X2hvc3QgKyBcIi9pbmRleC5odG1sI1wiICsgZGF0YVsnY29kZSddO1xuICAgIGRhdGFbJ3R5cGUnXSA9IChmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAoZGF0YVsndHlwZSddKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICByZXR1cm4gJ+aZrumAmic7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICByZXR1cm4gJ+mZkOaXtic7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICByZXR1cm4gJ+aMkeaImCc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuICfmnKrnn6UnO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKGRhdGEpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gQWN0aXZpdHlWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuQWN0aXZpdGllc1ZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQWN0aXZpdGllc1ZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFjdGl2aXRpZXNWaWV3KCkge1xuICAgIHJldHVybiBBY3Rpdml0aWVzVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFjdGl2aXRpZXNWaWV3LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHJldHVybiBuZXcgQWN0aXZpdHlWaWV3KHtcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBBY3Rpdml0aWVzVmlldztcblxufSkoVGFibGVWaWV3KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpdml0eVBhZ2VWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjdGl2aXR5UGFnZVZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFjdGl2aXR5UGFnZVZpZXcoKSB7XG4gICAgcmV0dXJuIEFjdGl2aXR5UGFnZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY3Rpdml0eVBhZ2VWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWN0aXZpdGllcywgYWN0aXZpdGllc1ZpZXcsIHBhZ2VOYXZWaWV3O1xuICAgIGFjdGl2aXRpZXMgPSBuZXcgQWN0aXZpdGllcztcbiAgICBhY3Rpdml0aWVzVmlldyA9IG5ldyBBY3Rpdml0aWVzVmlldyh7XG4gICAgICBlbDogJCgnI2FjdGl2aXR5LXRhYmxlLWNvbnRhaW5lcicpLFxuICAgICAgY29sbGVjdGlvbjogYWN0aXZpdGllc1xuICAgIH0pO1xuICAgIHBhZ2VOYXZWaWV3ID0gbmV3IFBhZ2luYXRpb25WaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IGFjdGl2aXRpZXNcbiAgICB9KTtcbiAgICBhY3Rpdml0aWVzVmlldy4kZWwuYWZ0ZXIocGFnZU5hdlZpZXcucmVuZGVyKCkuJGVsKTtcbiAgICBhY3Rpdml0aWVzLmZldGNoKHtcbiAgICAgIHJlc2V0OiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIEFjdGl2aXR5UGFnZVZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgQmFzZUNvbGxlY3Rpb24sIEJhc2VNb2RlbCwgQm9va1BhZ2VWaWV3LCBNb2RhbFZpZXcsIFBhZ2luYXRpb25WaWV3LCBRdWl6Qm9vaywgUXVpekJvb2tNb2RhbFZpZXcsIFF1aXpCb29rVmlldywgUXVpekJvb2tzLCBRdWl6Qm9va3NWaWV3LCBUYWJsZVZpZXcsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5CYXNlTW9kZWwgPSByZXF1aXJlKCdkYXRhL2Jhc2UtbW9kZWwnKTtcblxuQmFzZUNvbGxlY3Rpb24gPSByZXF1aXJlKCdkYXRhL2Jhc2UtY29sbGVjdGlvbicpO1xuXG5UYWJsZVZpZXcgPSByZXF1aXJlKCd2aWV3cy90YWJsZS12aWV3Jyk7XG5cblBhZ2luYXRpb25WaWV3ID0gcmVxdWlyZSgndmlld3MvcGFnaW5hdGlvbi12aWV3Jyk7XG5cbk1vZGFsVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL21vZGFsLXZpZXcnKTtcblxuUXVpekJvb2sgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVpekJvb2ssIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1aXpCb29rKCkge1xuICAgIHJldHVybiBRdWl6Qm9vay5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1aXpCb29rLnByb3RvdHlwZS51cmxSb290ID0gJy9hcGkvdjEvcXVpemJvb2snO1xuXG4gIFF1aXpCb29rLnByb3RvdHlwZS52YWxpZGF0aW9uID0ge1xuICAgIHRpdGxlOiB7XG4gICAgICBibGFuazogZmFsc2UsXG4gICAgICBtZXNzYWdlOiAn6aKY5bqT5ZCN5LiN6IO95Li656m6J1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUXVpekJvb2s7XG5cbn0pKEJhc2VNb2RlbCk7XG5cblF1aXpCb29rcyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWl6Qm9va3MsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1aXpCb29rcygpIHtcbiAgICByZXR1cm4gUXVpekJvb2tzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVpekJvb2tzLnByb3RvdHlwZS51cmwgPSAnL2FwaS92MS9xdWl6Ym9vayc7XG5cbiAgUXVpekJvb2tzLnByb3RvdHlwZS5tb2RlbCA9IFF1aXpCb29rO1xuXG4gIHJldHVybiBRdWl6Qm9va3M7XG5cbn0pKEJhc2VDb2xsZWN0aW9uKTtcblxuUXVpekJvb2tWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1aXpCb29rVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVpekJvb2tWaWV3KCkge1xuICAgIHJldHVybiBRdWl6Qm9va1ZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWl6Qm9va1ZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAndHInO1xuXG4gIFF1aXpCb29rVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvYm9vay1yb3cnKTtcblxuICBRdWl6Qm9va1ZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcInN5bmNcIiwgdGhpcy5yZW5kZXIpO1xuICB9O1xuXG4gIFF1aXpCb29rVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwudG9KU09OKCkpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gUXVpekJvb2tWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuUXVpekJvb2tNb2RhbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVpekJvb2tNb2RhbFZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1aXpCb29rTW9kYWxWaWV3KCkge1xuICAgIHJldHVybiBRdWl6Qm9va01vZGFsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1aXpCb29rTW9kYWxWaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9ib29rLW1vZGFsJyk7XG5cbiAgUXVpekJvb2tNb2RhbFZpZXcucHJvdG90eXBlLmJpbmRpbmdzID0ge1xuICAgICcjdGl0bGUnOiAndGl0bGUnXG4gIH07XG5cbiAgcmV0dXJuIFF1aXpCb29rTW9kYWxWaWV3O1xuXG59KShNb2RhbFZpZXcpO1xuXG5RdWl6Qm9va3NWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1aXpCb29rc1ZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1aXpCb29rc1ZpZXcoKSB7XG4gICAgcmV0dXJuIFF1aXpCb29rc1ZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWl6Qm9va3NWaWV3LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHJldHVybiBuZXcgUXVpekJvb2tWaWV3KHtcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBRdWl6Qm9va3NWaWV3O1xuXG59KShUYWJsZVZpZXcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJvb2tQYWdlVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChCb29rUGFnZVZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEJvb2tQYWdlVmlldygpIHtcbiAgICByZXR1cm4gQm9va1BhZ2VWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQm9va1BhZ2VWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFnZU5hdlZpZXcsIHF1aXpCb29rTW9kYWxWaWV3LCBxdWl6Qm9va3MsIHF1aXpCb29rc1ZpZXc7XG4gICAgcXVpekJvb2tzID0gbmV3IFF1aXpCb29rcztcbiAgICBxdWl6Qm9va3NWaWV3ID0gbmV3IFF1aXpCb29rc1ZpZXcoe1xuICAgICAgZWw6ICQoJyNxdWl6Ym9vay10YWJsZS1jb250YWluZXInKSxcbiAgICAgIGNvbGxlY3Rpb246IHF1aXpCb29rc1xuICAgIH0pO1xuICAgIHBhZ2VOYXZWaWV3ID0gbmV3IFBhZ2luYXRpb25WaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHF1aXpCb29rc1xuICAgIH0pO1xuICAgIHF1aXpCb29rc1ZpZXcuJGVsLmFmdGVyKHBhZ2VOYXZWaWV3LnJlbmRlcigpLiRlbCk7XG4gICAgcXVpekJvb2tNb2RhbFZpZXcgPSBuZXcgUXVpekJvb2tNb2RhbFZpZXcoe1xuICAgICAgaWQ6ICdib29rTW9kYWxGb3JtJyxcbiAgICAgIGNvbGxlY3Rpb246IHF1aXpCb29rc1xuICAgIH0pO1xuICAgIHF1aXpCb29rTW9kYWxWaWV3LnJlbmRlcigpO1xuICAgIHF1aXpCb29rcy5mZXRjaCh7XG4gICAgICByZXNldDogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBCb29rUGFnZVZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgQmFzZUNvbGxlY3Rpb24sXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5CYXNlQ29sbGVjdGlvbiA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChCYXNlQ29sbGVjdGlvbiwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQmFzZUNvbGxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIEJhc2VDb2xsZWN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQmFzZUNvbGxlY3Rpb24ucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmIChkYXRhICYmIGRhdGEubWV0YSkge1xuICAgICAgdGhpcy5tZXRhID0gZGF0YS5tZXRhO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YSAmJiBkYXRhLm9iamVjdHMgfHwgZGF0YTtcbiAgfTtcblxuICByZXR1cm4gQmFzZUNvbGxlY3Rpb247XG5cbn0pKEJhY2tib25lLkNvbGxlY3Rpb24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VDb2xsZWN0aW9uO1xuXG4iLCJ2YXIgQmFzZU1vZGVsLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZU1vZGVsID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEJhc2VNb2RlbCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQmFzZU1vZGVsKCkge1xuICAgIHJldHVybiBCYXNlTW9kZWwuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCYXNlTW9kZWwucHJvdG90eXBlLnVybCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcmlnVXJsO1xuICAgIG9yaWdVcmwgPSBCYXNlTW9kZWwuX19zdXBlcl9fLnVybC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiBvcmlnVXJsICsgKG9yaWdVcmwubGVuZ3RoID4gMCAmJiBvcmlnVXJsLmNoYXJBdChvcmlnVXJsLmxlbmd0aCAtIDEpID09PSAnLycgPyAnJyA6ICcvJyk7XG4gIH07XG5cbiAgQmFzZU1vZGVsLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLm9iamVjdHMgJiYgXy5pc0FycmF5KGRhdGEub2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBkYXRhLm9iamVjdHNbMF0gfHwge307XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIHJldHVybiBCYXNlTW9kZWw7XG5cbn0pKEJhY2tib25lLk1vZGVsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlTW9kZWw7XG5cbiIsInZhciBCYXNlQ29sbGVjdGlvbiwgQmFzZU1vZGVsLCBNb2RhbFZpZXcsIFBhZ2luYXRpb25WaWV3LCBRdWVzdGlvbiwgUXVlc3Rpb25MaXN0UGFuZWxWaWV3LCBRdWVzdGlvbk1vZGFsVmlldywgUXVlc3Rpb25QYWdlVmlldywgUXVlc3Rpb25WaWV3LCBRdWVzdGlvbnMsIFF1ZXN0aW9uc1ZpZXcsIFRhYmxlVmlldywgY2hhcjJJbnQsIGludDJDaGFyLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZU1vZGVsID0gcmVxdWlyZSgnZGF0YS9iYXNlLW1vZGVsJyk7XG5cbkJhc2VDb2xsZWN0aW9uID0gcmVxdWlyZSgnZGF0YS9iYXNlLWNvbGxlY3Rpb24nKTtcblxuVGFibGVWaWV3ID0gcmVxdWlyZSgndmlld3MvdGFibGUtdmlldycpO1xuXG5QYWdpbmF0aW9uVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3BhZ2luYXRpb24tdmlldycpO1xuXG5Nb2RhbFZpZXcgPSByZXF1aXJlKCd2aWV3cy9tb2RhbC12aWV3Jyk7XG5cbmludDJDaGFyID0gZnVuY3Rpb24oaSkge1xuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSg2NCArIHBhcnNlSW50KGkpKTtcbn07XG5cbmNoYXIySW50ID0gZnVuY3Rpb24oYykge1xuICBpZiAoISFjKSB7XG4gICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYztcbiAgfVxufTtcblxuUXVlc3Rpb24gPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb24sIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uKCkge1xuICAgIHJldHVybiBRdWVzdGlvbi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9uLnByb3RvdHlwZS51cmxSb290ID0gJy9hcGkvdjEvcXVlc3Rpb24vJztcblxuICBRdWVzdGlvbi5wcm90b3R5cGUuZGVmYXVsdHMgPSB7XG4gICAgXCJ0eXBlXCI6IDEsXG4gICAgXCJjb3JyZWN0X29wdGlvblwiOiBcIjFcIixcbiAgICBcIm9wdGlvbl9BXCI6IFwiXCIsXG4gICAgXCJvcHRpb25fQlwiOiBcIlwiLFxuICAgIFwib3B0aW9uX0NcIjogXCJcIixcbiAgICBcIm9wdGlvbl9EXCI6IFwiXCIsXG4gICAgXCJvcHRpb25fRVwiOiBcIlwiLFxuICAgIFwib3B0aW9uX0ZcIjogXCJcIlxuICB9O1xuXG4gIFF1ZXN0aW9uLnByb3RvdHlwZS52YWxpZGF0aW9uID0ge1xuICAgIGNvbnRlbnQ6IHtcbiAgICAgIGJsYW5rOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2U6ICfpopjnm67lhoXlrrnkuI3og73kuLrnqbonXG4gICAgfSxcbiAgICB0eXBlOiB7XG4gICAgICBibGFuazogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSAxIHx8IHZhbHVlID09PSAyO1xuICAgICAgfSxcbiAgICAgIG1lc3NhZ2U6ICfpopjnm67nsbvlnovlv4XpobvmmK/lpJrpgInmiJbljZXpgIknXG4gICAgfSxcbiAgICBjb3JyZWN0X29wdGlvbjoge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN3aXRjaCAoZmFsc2UpIHtcbiAgICAgICAgICAgIGNhc2UgIV8uaXNBcnJheSh2YWx1ZSk6XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgIV8uaXNTdHJpbmcodmFsdWUpOlxuICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiAhKF8uaXNFbXB0eSh2YWx1ZSkpICYmIF8uZXZlcnkodmFsdWUsIChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdvcHRpb25fJyArIGludDJDaGFyKGkpKTtcbiAgICAgICAgfSksIHRoaXMpO1xuICAgICAgfSxcbiAgICAgIG1lc3NhZ2U6ICfmraPnoa7nrZTmoYjorr7nva7lh7rplJnvvIzms6jmhI/lr7nlupTnmoTpgInpobnmmK/lkKborr7nva7kuobnrZTmoYgnXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvbjtcblxufSkoQmFzZU1vZGVsKTtcblxuUXVlc3Rpb25zID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1ZXN0aW9ucywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb25zKCkge1xuICAgIHJldHVybiBRdWVzdGlvbnMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWVzdGlvbnMucHJvdG90eXBlLnVybCA9ICcvYXBpL3YxL3F1ZXN0aW9uLyc7XG5cbiAgUXVlc3Rpb25zLnByb3RvdHlwZS5tb2RlbCA9IFF1ZXN0aW9uO1xuXG4gIFF1ZXN0aW9ucy5wcm90b3R5cGUuc3RhdGUgPSB7fTtcblxuICBRdWVzdGlvbnMucHJvdG90eXBlLmZldGNoID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBkYXRhO1xuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgb3B0aW9ucyk7XG4gICAgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICBvcHRpb25zLmRhdGEgPSBfLmV4dGVuZCh7fSwgdGhpcy5zdGF0ZSwgZGF0YSk7XG4gICAgcmV0dXJuIFF1ZXN0aW9ucy5fX3N1cGVyX18uZmV0Y2guY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25zO1xuXG59KShCYXNlQ29sbGVjdGlvbik7XG5cblF1ZXN0aW9uVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvblZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uVmlldygpIHtcbiAgICByZXR1cm4gUXVlc3Rpb25WaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS50YWdOYW1lID0gJ3RyJztcblxuICBRdWVzdGlvblZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL3F1ZXN0aW9uLXJvdycpO1xuXG4gIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUuZXZlbnRzID0ge1xuICAgICdjbGljayAjZGVsZXRlJzogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAod2luZG93LmNvbmZpcm0oXCLmmK/lkKbliKDpmaQ/XCIpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcInN5bmNcIiwgdGhpcy5yZW5kZXIpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsIFwiZGVzdHJveVwiLCB0aGlzLnJlbW92ZSk7XG4gIH07XG5cbiAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29ycmVjdCwgZGF0YTtcbiAgICBkYXRhID0gdGhpcy5tb2RlbC50b0pTT04oKTtcbiAgICBjb3JyZWN0ID0gZGF0YVsnY29ycmVjdF9vcHRpb24nXS5zcGxpdCgnLCcpO1xuICAgIGRhdGFbJ2NvcnJlY3Rfb3B0aW9uJ10gPSBfLm1hcChjb3JyZWN0LCBpbnQyQ2hhcikuam9pbigpO1xuICAgIGRhdGFbJ3R5cGUnXSA9IChmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAoZGF0YVsndHlwZSddKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICByZXR1cm4gJ+WNlemAiSc7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICByZXR1cm4gJ+WkmumAiSc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuICflpJrpgIknO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKGRhdGEpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25WaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuUXVlc3Rpb25zVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvbnNWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvbnNWaWV3KCkge1xuICAgIHJldHVybiBRdWVzdGlvbnNWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb25zVmlldy5wcm90b3R5cGUucm93ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICByZXR1cm4gbmV3IFF1ZXN0aW9uVmlldyh7XG4gICAgICBtb2RlbDogbW9kZWxcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25zVmlldztcblxufSkoVGFibGVWaWV3KTtcblxuUXVlc3Rpb25Nb2RhbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb25Nb2RhbFZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uTW9kYWxWaWV3KCkge1xuICAgIHJldHVybiBRdWVzdGlvbk1vZGFsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9uTW9kYWxWaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9xdWVzdGlvbi1tb2RhbCcpO1xuXG4gIFF1ZXN0aW9uTW9kYWxWaWV3LnByb3RvdHlwZS5iaW5kaW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfYmluZGluZ3MsIGNvZGUsIGosIGxlbiwgcmVmO1xuICAgIF9iaW5kaW5ncyA9IHtcbiAgICAgICdbbmFtZT1jb250ZW50XSc6ICdjb250ZW50JyxcbiAgICAgICdbbmFtZT10eXBlXSc6IHtcbiAgICAgICAgb2JzZXJ2ZTogJ3R5cGUnLFxuICAgICAgICBzZWxlY3RPcHRpb25zOiB7XG4gICAgICAgICAgY29sbGVjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfljZXpgIknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAxXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+WkmumAiScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNldE9wdGlvbnM6IHtcbiAgICAgICAgICBzaWxlbnQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnW25hbWU9Y29ycmVjdF9vcHRpb25dJzoge1xuICAgICAgICBvYnNlcnZlOiAnY29ycmVjdF9vcHRpb24nLFxuICAgICAgICBvbkdldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWUuc3BsaXQoJywnKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25TZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5qb2luKCcsJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHJlZiA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnXTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGNvZGUgPSByZWZbal07XG4gICAgICBfYmluZGluZ3NbXCJbbmFtZT1vcHRpb25fXCIgKyBjb2RlICsgXCJdXCJdID0gJ29wdGlvbl8nICsgY29kZTtcbiAgICB9XG4gICAgcmV0dXJuIF9iaW5kaW5ncztcbiAgfTtcblxuICBRdWVzdGlvbk1vZGFsVmlldy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKGUpIHtcbiAgICBRdWVzdGlvbk1vZGFsVmlldy5fX3N1cGVyX18uc2hvdy5jYWxsKHRoaXMsIGUpO1xuICAgIGlmICh0aGlzLm1vZGVsLmlzTmV3KCkpIHtcbiAgICAgIHRoaXMubW9kZWwuc2V0KCdib29rJywgdGhpcy5jb2xsZWN0aW9uLnN0YXRlLmJvb2spO1xuICAgIH1cbiAgICB0aGlzLmNoYW5nZVR5cGUodGhpcy5tb2RlbCwgdGhpcy5tb2RlbC5nZXQoJ3R5cGUnKSk7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJjaGFuZ2U6dHlwZVwiLCB0aGlzLmNoYW5nZVR5cGUpO1xuICB9O1xuXG4gIFF1ZXN0aW9uTW9kYWxWaWV3LnByb3RvdHlwZS5jaGFuZ2VUeXBlID0gZnVuY3Rpb24obW9kZWwsIHZhbHVlLCBvcHRpb25zKSB7XG4gICAgdmFyIGN1clZhbCwgdHlwZTtcbiAgICB0eXBlID0gdmFsdWUgPT09IDEgPyAncmFkaW8nIDogJ2NoZWNrYm94JztcbiAgICBjdXJWYWwgPSBtb2RlbC5nZXQoJ2NvcnJlY3Rfb3B0aW9uJyk7XG4gICAgaWYgKHR5cGUgPT09ICdyYWRpbycgJiYgY3VyVmFsKSB7XG4gICAgICBtb2RlbC5zZXQoJ2NvcnJlY3Rfb3B0aW9uJywgY3VyVmFsWzBdKTtcbiAgICB9XG4gICAgdGhpcy4kKCdpbnB1dFtuYW1lPWNvcnJlY3Rfb3B0aW9uXScpLnByb3AoJ3R5cGUnLCB0eXBlKTtcbiAgICByZXR1cm4gdGhpcy5zdGlja2l0KCk7XG4gIH07XG5cbiAgUXVlc3Rpb25Nb2RhbFZpZXcucHJvdG90eXBlLm9uSW52YWxpZEZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGVycm9ycywgbW9kZWwpIHtcbiAgICB2YXIgZXJyb3IsIGZpZWxkLCBncm91cCwgaiwgbGVuO1xuICAgIGlmIChuYW1lICE9PSAnY29ycmVjdF9vcHRpb24nKSB7XG4gICAgICByZXR1cm4gUXVlc3Rpb25Nb2RhbFZpZXcuX19zdXBlcl9fLm9uSW52YWxpZEZpZWxkLmNhbGwodGhpcywgbmFtZSwgdmFsdWUsIGVycm9ycywgbW9kZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZCA9IHRoaXMuJChcIltuYW1lPVwiICsgbmFtZSArIFwiXVwiKTtcbiAgICAgIGdyb3VwID0gZmllbGQuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKTtcbiAgICAgIGdyb3VwLmZpbmQoJy5oZWxwLWJsb2NrJykucmVtb3ZlKCk7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBlcnJvcnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcnNbal07XG4gICAgICAgIGdyb3VwLmFwcGVuZChcIjxkaXYgY2xhc3M9J2hlbHAtYmxvY2sgY29sLXNtLW9mZnNldC0yJz5cIiArIGVycm9yICsgXCI8L2Rpdj5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ3JvdXAuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25Nb2RhbFZpZXc7XG5cbn0pKE1vZGFsVmlldyk7XG5cblF1ZXN0aW9uTGlzdFBhbmVsVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvbkxpc3RQYW5lbFZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uTGlzdFBhbmVsVmlldygpIHtcbiAgICByZXR1cm4gUXVlc3Rpb25MaXN0UGFuZWxWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb25MaXN0UGFuZWxWaWV3LnByb3RvdHlwZS5ldmVudHMgPSB7XG4gICAgJ2NoYW5nZSAjYm9vayc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5zdGF0ZS5ib29rID0gdGhpcy4kKCcjYm9vaycpLnZhbCgpO1xuICAgIH0sXG4gICAgJ2NsaWNrICNsb2FkQm9vayc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5mZXRjaCh7XG4gICAgICAgIHJlc2V0OiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXN0aW9uTGlzdFBhbmVsVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25QYWdlVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvblBhZ2VWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvblBhZ2VWaWV3KCkge1xuICAgIHJldHVybiBRdWVzdGlvblBhZ2VWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb25QYWdlVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oYm9va0lkKSB7XG4gICAgdmFyIHBhZ2VOYXZWaWV3LCBwYW5lbFZpZXcsIHF1ZXN0aW9uTW9kYWxWaWV3LCBxdWVzdGlvbnMsIHF1ZXN0aW9uc1ZpZXc7XG4gICAgaWYgKCFib29rSWQpIHtcbiAgICAgIGJvb2tJZCA9ICQoJ2Zvcm0gc2VsZWN0W25hbWU9Ym9va10nKS52YWwoKTtcbiAgICB9XG4gICAgcXVlc3Rpb25zID0gbmV3IFF1ZXN0aW9ucztcbiAgICBxdWVzdGlvbnMuc3RhdGUuYm9vayA9IGJvb2tJZDtcbiAgICBwYW5lbFZpZXcgPSBuZXcgUXVlc3Rpb25MaXN0UGFuZWxWaWV3KHtcbiAgICAgIGVsOiAkKCcudGFibGUtY29udHJvbCcpLFxuICAgICAgY29sbGVjdGlvbjogcXVlc3Rpb25zXG4gICAgfSk7XG4gICAgcXVlc3Rpb25zVmlldyA9IG5ldyBRdWVzdGlvbnNWaWV3KHtcbiAgICAgIGVsOiAkKCcjcXVlc3Rpb24tdGFibGUtY29udGFpbmVyJyksXG4gICAgICBjb2xsZWN0aW9uOiBxdWVzdGlvbnNcbiAgICB9KTtcbiAgICBwYWdlTmF2VmlldyA9IG5ldyBQYWdpbmF0aW9uVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiBxdWVzdGlvbnNcbiAgICB9KTtcbiAgICBxdWVzdGlvbnNWaWV3LiRlbC5hZnRlcihwYWdlTmF2Vmlldy5yZW5kZXIoKS4kZWwpO1xuICAgIHF1ZXN0aW9uTW9kYWxWaWV3ID0gbmV3IFF1ZXN0aW9uTW9kYWxWaWV3KHtcbiAgICAgIGlkOiAncXVlc3Rpb25Nb2RhbEZvcm0nLFxuICAgICAgY29sbGVjdGlvbjogcXVlc3Rpb25zXG4gICAgfSk7XG4gICAgcXVlc3Rpb25Nb2RhbFZpZXcucmVuZGVyKCk7XG4gICAgcXVlc3Rpb25zLmZldGNoKHtcbiAgICAgIHJlc2V0OiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIFF1ZXN0aW9uUGFnZVZpZXcuX19zdXBlcl9fLnJlbmRlci5jYWxsKHRoaXMpO1xuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvblBhZ2VWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxheW91dDoge1xuICAgIGFjdGl2YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLmZpeCgpO1xuICAgICAgcmV0dXJuICQod2luZG93LCBcIi53cmFwcGVyXCIpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuZml4KCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGZpeDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbmVnLCBzaWRlYmFyX2hlaWdodCwgd2luZG93X2hlaWdodDtcbiAgICAgIG5lZyA9ICQoXCIubWFpbi1oZWFkZXJcIikub3V0ZXJIZWlnaHQoKSArICQoXCIubWFpbi1mb290ZXJcIikub3V0ZXJIZWlnaHQoKTtcbiAgICAgIHdpbmRvd19oZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICBzaWRlYmFyX2hlaWdodCA9ICQoXCIuc2lkZWJhclwiKS5oZWlnaHQoKTtcbiAgICAgIGlmICh3aW5kb3dfaGVpZ2h0ID49IHNpZGViYXJfaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNvbnRlbnQtd3JhcHBlclwiKS5jc3MoXCJtaW4taGVpZ2h0XCIsIHdpbmRvd19oZWlnaHQgLSBuZWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICQoXCIuY29udGVudC13cmFwcGVyXCIpLmNzcyhcIm1pbi1oZWlnaHRcIiwgc2lkZWJhcl9oZWlnaHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHVzaE1lbnU6IHtcbiAgICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAkKCcjY29sbGFwc2VUb2dnbGUnKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiAoNzY4IC0gMSkpIHtcbiAgICAgICAgICBpZiAoJChcImJvZHlcIikuaGFzQ2xhc3MoXCJzaWRlYmFyLWNvbGxhcHNlXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJzaWRlYmFyLWNvbGxhcHNlXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJChcImJvZHlcIikuYWRkQ2xhc3MoXCJzaWRlYmFyLWNvbGxhcHNlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoJChcImJvZHlcIikuaGFzQ2xhc3MoXCJzaWRlYmFyLW9wZW5cIikpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInNpZGViYXItb3BlblwiKS5yZW1vdmVDbGFzcyhcInNpZGViYXItY29sbGFwc2VcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiYm9keVwiKS5hZGRDbGFzcyhcInNpZGViYXItb3BlblwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuICQoXCIuY29udGVudC13cmFwcGVyXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gKDc2OCAtIDEpICYmICQoXCJib2R5XCIpLmhhc0NsYXNzKFwic2lkZWJhci1vcGVuXCIpKSB7XG4gICAgICAgICAgcmV0dXJuICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwic2lkZWJhci1vcGVuXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHRyZWU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbmltYXRpb25TcGVlZCwgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcbiAgICBhbmltYXRpb25TcGVlZCA9IDUwMDtcbiAgICByZXR1cm4gJCgnYm9keScpLm9uKFwiY2xpY2tcIiwgXCIuc2lkZWJhciBsaSBhXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciAkdGhpcywgY2hlY2tFbGVtZW50LCBwYXJlbnQsIHBhcmVudF9saSwgdWw7XG4gICAgICAkdGhpcyA9ICQodGhpcyk7XG4gICAgICBjaGVja0VsZW1lbnQgPSAkdGhpcy5uZXh0KCk7XG4gICAgICBpZiAoKGNoZWNrRWxlbWVudC5pcyhcIi50cmVldmlldy1tZW51XCIpKSAmJiAoY2hlY2tFbGVtZW50LmlzKFwiOnZpc2libGVcIikpKSB7XG4gICAgICAgIGNoZWNrRWxlbWVudC5zbGlkZVVwKGFuaW1hdGlvblNwZWVkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gY2hlY2tFbGVtZW50LnJlbW92ZUNsYXNzKFwibWVudS1vcGVuXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2VsZi5sYXlvdXQuZml4KCk7XG4gICAgICAgIGNoZWNrRWxlbWVudC5wYXJlbnQoXCJsaVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hlY2tFbGVtZW50LmlzKFwiLnRyZWV2aWV3LW1lbnVcIikpIHtcbiAgICAgICAgcGFyZW50ID0gJHRoaXMucGFyZW50cyhcInVsXCIpLmZpcnN0KCk7XG4gICAgICAgIHVsID0gcGFyZW50LmZpbmQoXCJ1bDp2aXNpYmxlXCIpLnNsaWRlVXAoYW5pbWF0aW9uU3BlZWQpO1xuICAgICAgICB1bC5yZW1vdmVDbGFzcyhcIm1lbnUtb3BlblwiKTtcbiAgICAgICAgcGFyZW50X2xpID0gJHRoaXMucGFyZW50KFwibGlcIik7XG4gICAgICAgIGNoZWNrRWxlbWVudC5zbGlkZURvd24oYW5pbWF0aW9uU3BlZWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNoZWNrRWxlbWVudC5hZGRDbGFzcyhcIm1lbnUtb3BlblwiKTtcbiAgICAgICAgICBwYXJlbnQuZmluZChcImxpLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICBwYXJlbnRfbGkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgcmV0dXJuIHNlbGYubGF5b3V0LmZpeCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGVja0VsZW1lbnQuaXMoXCIudHJlZXZpZXctbWVudVwiKSkge1xuICAgICAgICByZXR1cm4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG4iLCJ2YXIgTW9kYWxWaWV3LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoTW9kYWxWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBNb2RhbFZpZXcoKSB7XG4gICAgcmV0dXJuIE1vZGFsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgJCgnIycgKyB0aGlzLmlkKS5yZW1vdmUoKTtcbiAgICAkKCdib2R5JykuYXBwZW5kKHRoaXMudGVtcGxhdGUoe1xuICAgICAgaWQ6IHRoaXMuaWRcbiAgICB9KSk7XG4gICAgdGhpcy5zZXRFbGVtZW50KCQoJyMnICsgdGhpcy5pZCkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUuZXZlbnRzID0ge1xuICAgICdzaG93LmJzLm1vZGFsJzogJ3Nob3cnLFxuICAgICdoaWRkZW4uYnMubW9kYWwnOiAnaGlkZGVuJyxcbiAgICAnY2xpY2sgW3R5cGU9c3VibWl0XSc6ICdzYXZlJ1xuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0gJChlLnJlbGF0ZWRUYXJnZXQpLmRhdGEoKTtcbiAgICB0aGlzLm1vZGVsID0gZGF0YS5pZCA/IHRoaXMuY29sbGVjdGlvbi5nZXQoZGF0YS5pZCkgOiBuZXcgdGhpcy5jb2xsZWN0aW9uLm1vZGVsO1xuICAgIHRoaXMuc3RpY2tpdCgpO1xuICAgIHRoaXMuYmluZFZhbGlkYXRpb24oKTtcbiAgICBpZiAoIXRoaXMubW9kZWwuaXNOZXcoKSkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWwudmFsaWRhdGUoKTtcbiAgICB9XG4gIH07XG5cbiAgTW9kYWxWaWV3LnByb3RvdHlwZS5oaWRkZW4gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnVuc3RpY2tpdCgpO1xuICAgIHRoaXMuc3RvcExpc3RlbmluZygpO1xuICAgIHJldHVybiBkZWxldGUgdGhpcy5tb2RlbDtcbiAgfTtcblxuICBNb2RhbFZpZXcucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHhocjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgeGhyID0gdGhpcy5tb2RlbC5zYXZlKCk7XG4gICAgaWYgKHhocikge1xuICAgICAgcmV0dXJuIHhoci50aGVuKCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIF90aGlzLmNvbGxlY3Rpb24uYWRkKF90aGlzLm1vZGVsKTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuJGVsLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkpO1xuICAgIH1cbiAgfTtcblxuICBNb2RhbFZpZXcucHJvdG90eXBlLm9uVmFsaWRGaWVsZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBtb2RlbCkge1xuICAgIHZhciBmaWVsZCwgZ3JvdXA7XG4gICAgZmllbGQgPSB0aGlzLiQoXCJbbmFtZT1cIiArIG5hbWUgKyBcIl1cIik7XG4gICAgZ3JvdXAgPSBmaWVsZC5jbG9zZXN0KCcuZm9ybS1ncm91cCcpO1xuICAgIGdyb3VwLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcbiAgICByZXR1cm4gZ3JvdXAuZmluZCgnLmhlbHAtYmxvY2snKS5yZW1vdmUoKTtcbiAgfTtcblxuICBNb2RhbFZpZXcucHJvdG90eXBlLm9uSW52YWxpZEZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGVycm9ycywgbW9kZWwpIHtcbiAgICB2YXIgZXJyb3IsIGZpZWxkLCBncm91cCwgaSwgbGVuO1xuICAgIGZpZWxkID0gdGhpcy4kKFwiW25hbWU9XCIgKyBuYW1lICsgXCJdXCIpO1xuICAgIGdyb3VwID0gZmllbGQuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKTtcbiAgICBncm91cC5maW5kKCcuaGVscC1ibG9jaycpLnJlbW92ZSgpO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGVycm9ycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXJyb3IgPSBlcnJvcnNbaV07XG4gICAgICBmaWVsZC5hZnRlcihcIjxkaXYgY2xhc3M9J2hlbHAtYmxvY2snPlwiICsgZXJyb3IgKyBcIjwvZGl2PlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGdyb3VwLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcbiAgfTtcblxuICByZXR1cm4gTW9kYWxWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIFBhZ2luYXRpb25WaWV3LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYWdpbmF0aW9uVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChQYWdpbmF0aW9uVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUGFnaW5hdGlvblZpZXcoKSB7XG4gICAgcmV0dXJuIFBhZ2luYXRpb25WaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAnbmF2JztcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUuY2xhc3NOYW1lID0gJ3BhZ2UtbmF2JztcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvcGFnZS1uYXYnKTtcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUuZXZlbnRzID0ge1xuICAgICdjbGljayBhW2RhdGEtaWRdJzogJ2xvYWRQYWdlJ1xuICB9O1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLCAncmVzZXQnLCB0aGlzLnJlbmRlcik7XG4gIH07XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmNvbGxlY3Rpb24ubWV0YSkge1xuICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMuY29sbGVjdGlvbi5tZXRhKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS5sb2FkUGFnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZGF0YSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCk7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5mZXRjaCh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHBhZ2U6IGRhdGEuaWRcbiAgICAgIH0sXG4gICAgICByZXNldDogdHJ1ZVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBQYWdpbmF0aW9uVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBUYWJsZVZpZXcsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChUYWJsZVZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFRhYmxlVmlldygpIHtcbiAgICByZXR1cm4gVGFibGVWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVGFibGVWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICdhZGQnLCB0aGlzLmFkZCk7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLCAncmVzZXQnLCB0aGlzLnJlbmRlcik7XG4gIH07XG5cbiAgVGFibGVWaWV3LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gIH07XG5cbiAgVGFibGVWaWV3LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHZhciByb3c7XG4gICAgcm93ID0gdGhpcy5yb3cobW9kZWwpO1xuICAgIHJvdy4kZWwuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICByZXR1cm4gdGhpcy4kKCd0YWJsZSB0Ym9keScpLnByZXBlbmQocm93LnJlbmRlcigpLiRlbCk7XG4gIH07XG5cbiAgVGFibGVWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIHRib2R5O1xuICAgIHRib2R5ID0gdGhpcy4kKCd0YWJsZSB0Ym9keScpO1xuICAgIHRib2R5LmVtcHR5KCk7XG4gICAgY29sbGVjdGlvbi5lYWNoKChmdW5jdGlvbihtb2RlbCkge1xuICAgICAgcmV0dXJuIHRib2R5LmFwcGVuZCh0aGlzLnJvdyhtb2RlbCkucmVuZGVyKCkuJGVsKTtcbiAgICB9KSwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIFRhYmxlVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGJvb2ssIGNoYW5jZXMsIGVuZF9hdCwgaWQsIGluZm9fZmllbGRfMiwgaW5mb19maWVsZF8zLCBtdWx0aSwgbXVsdGlfcG9pbnRzLCBuYW1lLCBzaW5nbGUsIHNpbmdsZV9wb2ludHMsIHN0YXJ0X2F0LCBzdGF0dXMsIHRpbWVfbGltaXQsIHR5cGUsIHVybCwgdXNlciwgd2VsY29tZSkge1xuYnVmLnB1c2goXCI8dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpZCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBuYW1lKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGJvb2sudGl0bGUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdHlwZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBjaGFuY2VzKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHRpbWVfbGltaXQpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gc2luZ2xlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG11bHRpKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHNpbmdsZV9wb2ludHMpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gbXVsdGlfcG9pbnRzKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHN0YXR1cykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBzdGFydF9hdCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBlbmRfYXQpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKG51bGwgPT0gKGphZGVfaW50ZXJwID0gd2VsY29tZSkgPyBcIlwiIDogamFkZV9pbnRlcnApICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGluZm9fZmllbGRfMykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpbmZvX2ZpZWxkXzIpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gaW5mb19maWVsZF8zKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD48YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgdXJsLCB0cnVlLCBmYWxzZSkpICsgXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB1cmwpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvYT48L3RkPjx0ZD48YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgXCIvYWN0aXZpdGllcy9lZGl0L1wiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi14c1xcXCI+57yW6L6RPC9hPjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdXNlci51c2VybmFtZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD5cIik7fS5jYWxsKHRoaXMsXCJib29rXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5ib29rOnR5cGVvZiBib29rIT09XCJ1bmRlZmluZWRcIj9ib29rOnVuZGVmaW5lZCxcImNoYW5jZXNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmNoYW5jZXM6dHlwZW9mIGNoYW5jZXMhPT1cInVuZGVmaW5lZFwiP2NoYW5jZXM6dW5kZWZpbmVkLFwiZW5kX2F0XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5lbmRfYXQ6dHlwZW9mIGVuZF9hdCE9PVwidW5kZWZpbmVkXCI/ZW5kX2F0OnVuZGVmaW5lZCxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCxcImluZm9fZmllbGRfMlwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaW5mb19maWVsZF8yOnR5cGVvZiBpbmZvX2ZpZWxkXzIhPT1cInVuZGVmaW5lZFwiP2luZm9fZmllbGRfMjp1bmRlZmluZWQsXCJpbmZvX2ZpZWxkXzNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmluZm9fZmllbGRfMzp0eXBlb2YgaW5mb19maWVsZF8zIT09XCJ1bmRlZmluZWRcIj9pbmZvX2ZpZWxkXzM6dW5kZWZpbmVkLFwibXVsdGlcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm11bHRpOnR5cGVvZiBtdWx0aSE9PVwidW5kZWZpbmVkXCI/bXVsdGk6dW5kZWZpbmVkLFwibXVsdGlfcG9pbnRzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5tdWx0aV9wb2ludHM6dHlwZW9mIG11bHRpX3BvaW50cyE9PVwidW5kZWZpbmVkXCI/bXVsdGlfcG9pbnRzOnVuZGVmaW5lZCxcIm5hbWVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm5hbWU6dHlwZW9mIG5hbWUhPT1cInVuZGVmaW5lZFwiP25hbWU6dW5kZWZpbmVkLFwic2luZ2xlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zaW5nbGU6dHlwZW9mIHNpbmdsZSE9PVwidW5kZWZpbmVkXCI/c2luZ2xlOnVuZGVmaW5lZCxcInNpbmdsZV9wb2ludHNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnNpbmdsZV9wb2ludHM6dHlwZW9mIHNpbmdsZV9wb2ludHMhPT1cInVuZGVmaW5lZFwiP3NpbmdsZV9wb2ludHM6dW5kZWZpbmVkLFwic3RhcnRfYXRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnN0YXJ0X2F0OnR5cGVvZiBzdGFydF9hdCE9PVwidW5kZWZpbmVkXCI/c3RhcnRfYXQ6dW5kZWZpbmVkLFwic3RhdHVzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zdGF0dXM6dHlwZW9mIHN0YXR1cyE9PVwidW5kZWZpbmVkXCI/c3RhdHVzOnVuZGVmaW5lZCxcInRpbWVfbGltaXRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnRpbWVfbGltaXQ6dHlwZW9mIHRpbWVfbGltaXQhPT1cInVuZGVmaW5lZFwiP3RpbWVfbGltaXQ6dW5kZWZpbmVkLFwidHlwZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudHlwZTp0eXBlb2YgdHlwZSE9PVwidW5kZWZpbmVkXCI/dHlwZTp1bmRlZmluZWQsXCJ1cmxcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVybDp0eXBlb2YgdXJsIT09XCJ1bmRlZmluZWRcIj91cmw6dW5kZWZpbmVkLFwidXNlclwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudXNlcjp0eXBlb2YgdXNlciE9PVwidW5kZWZpbmVkXCI/dXNlcjp1bmRlZmluZWQsXCJ3ZWxjb21lXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC53ZWxjb21lOnR5cGVvZiB3ZWxjb21lIT09XCJ1bmRlZmluZWRcIj93ZWxjb21lOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGlkKSB7XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJpZFwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB0YWJpbmRleD1cXFwiLTFcXFwiIHJvbGU9XFxcImRpYWxvZ1xcXCIgYXJpYS1sYWJlbGxlZGJ5PVxcXCJib29rRm9ybUxhYmVsXFxcIiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgY2xhc3M9XFxcIm1vZGFsIGZhZGVcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWRpYWxvZ1xcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtY29udGVudFxcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtaGVhZGVyXFxcIj48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgY2xhc3M9XFxcImNsb3NlXFxcIj48c3BhbiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCI+JnRpbWVzOzwvc3Bhbj48c3BhbiBjbGFzcz1cXFwic3Itb25seVxcXCI+5YWz6ZetPC9zcGFuPjwvYnV0dG9uPjxoNCBpZD1cXFwiYm9va0Zvcm1MYWJlbFxcXCIgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIj7ovpPlhaXpopjlupPkv6Hmga88L2g0PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1vZGFsLWJvZHlcXFwiPjxmb3JtPjxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPjxsYWJlbCBmb3I9XFxcInRpdGxlXFxcIiBjbGFzcz1cXFwiY29udHJvbC1sYWJlbFxcXCI+6aKY5bqT5ZCNPC9sYWJlbD48aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgaWQ9XFxcInRpdGxlXFxcIiBwbGFjZWhvbGRlcj1cXFwi6aKY5bqT5ZCNXFxcIiBuYW1lPVxcXCJ0aXRsZVxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIvPjwvZGl2PjwvZm9ybT48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1mb290ZXJcXFwiPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIj7lj5bmtog8L2J1dHRvbj48YnV0dG9uIGlkPVxcXCJzYXZlXFxcIiB0eXBlPVxcXCJzdWJtaXRcXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiPuS/neWtmDwvYnV0dG9uPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGJ1dHRvbiwgaWQsIHRpdGxlLCB1c2VyKSB7XG5idWYucHVzaChcIjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHRpdGxlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHVzZXIudXNlcm5hbWUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPjxhXCIgKyAoamFkZS5hdHRyKFwiaHJlZlwiLCAnL3F1aXpib29rcy8nICsgKGlkKSArICcvcXVlc3Rpb25zJywgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXFxcIj7mn6XnnIs8L2E+PGFcIiArIChqYWRlLmF0dHIoXCJ0eXBlXCIsIGJ1dHRvbiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIGlkLCB0cnVlLCBmYWxzZSkpICsgXCIgZGF0YS10b2dnbGU9XFxcIm1vZGFsXFxcIiBkYXRhLXRhcmdldD1cXFwiI2Jvb2tNb2RhbEZvcm1cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYnRuLXhzXFxcIj7nvJbovpE8L2E+PC90ZD5cIik7fS5jYWxsKHRoaXMsXCJidXR0b25cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmJ1dHRvbjp0eXBlb2YgYnV0dG9uIT09XCJ1bmRlZmluZWRcIj9idXR0b246dW5kZWZpbmVkLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkLFwidGl0bGVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnRpdGxlOnR5cGVvZiB0aXRsZSE9PVwidW5kZWZpbmVkXCI/dGl0bGU6dW5kZWZpbmVkLFwidXNlclwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudXNlcjp0eXBlb2YgdXNlciE9PVwidW5kZWZpbmVkXCI/dXNlcjp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChNYXRoLCBlbmQsIHBhZ2UsIHBhZ2VzLCBzdGFydCkge1xuc3RhcnQgPSBNYXRoLm1heCgxLCBwYWdlIC0gNSlcbmVuZCA9IE1hdGgubWluKHBhZ2VzLCBwYWdlICsgNSlcbmJ1Zi5wdXNoKFwiPHVsIGNsYXNzPVxcXCJwYWdpbmF0aW9uXFxcIj48bGlcIiArIChqYWRlLmNscyhbKHBhZ2UgPT0gMSkgPyAnZGlzYWJsZWQnIDogJyddLCBbdHJ1ZV0pKSArIFwiPjxhIGhyZWY9XFxcIiNcXFwiIGFyaWEtbGFiZWw9XFxcIlN0YXJ0XFxcIiBkYXRhLWlkPScxJz48c3BhbiBhcmlhLWhpZGRlbj1cXFwiYXJpYS1oaWRkZW5cXFwiPiZsYXF1bzs8L3NwYW4+PC9hPjwvbGk+XCIpO1xudmFyIGkgPSBzdGFydFxud2hpbGUgKGkgPCBwYWdlKVxue1xuYnVmLnB1c2goXCI8bGk+PGEgaHJlZj1cXFwiI1xcXCJcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIGksIHRydWUsIGZhbHNlKSkgKyBcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGkrKykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9hPjwvbGk+XCIpO1xufVxuYnVmLnB1c2goXCI8bGlcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIHBhZ2UsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiYWN0aXZlXFxcIj48YSBocmVmPVxcXCIjXFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHBhZ2UpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvYT48L2xpPlwiKTtcbnZhciBpID0gcGFnZSArIDFcbndoaWxlIChpIDw9IGVuZClcbntcbmJ1Zi5wdXNoKFwiPGxpPjxhIGhyZWY9XFxcIiNcXFwiXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBpLCB0cnVlLCBmYWxzZSkpICsgXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpKyspID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvYT48L2xpPlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPGxpXCIgKyAoamFkZS5jbHMoWyhwYWdlID09IHBhZ2VzKSA/ICdkaXNhYmxlZCcgOiAnJ10sIFt0cnVlXSkpICsgXCI+PGEgaHJlZj1cXFwiI1xcXCIgYXJpYS1sYWJlbD1cXFwiRW5kXFxcIlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgcGFnZXMsIHRydWUsIGZhbHNlKSkgKyBcIj48c3BhbiBhcmlhLWhpZGRlbj1cXFwiYXJpYS1oaWRkZW5cXFwiPiZyYXF1bzs8L3NwYW4+PC9hPjwvbGk+PC91bD5cIik7fS5jYWxsKHRoaXMsXCJNYXRoXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5NYXRoOnR5cGVvZiBNYXRoIT09XCJ1bmRlZmluZWRcIj9NYXRoOnVuZGVmaW5lZCxcImVuZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguZW5kOnR5cGVvZiBlbmQhPT1cInVuZGVmaW5lZFwiP2VuZDp1bmRlZmluZWQsXCJwYWdlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5wYWdlOnR5cGVvZiBwYWdlIT09XCJ1bmRlZmluZWRcIj9wYWdlOnVuZGVmaW5lZCxcInBhZ2VzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5wYWdlczp0eXBlb2YgcGFnZXMhPT1cInVuZGVmaW5lZFwiP3BhZ2VzOnVuZGVmaW5lZCxcInN0YXJ0XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zdGFydDp0eXBlb2Ygc3RhcnQhPT1cInVuZGVmaW5lZFwiP3N0YXJ0OnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGlkLCB1bmRlZmluZWQpIHtcbmphZGVfbWl4aW5zW1widGV4dGFyZWFcIl0gPSBqYWRlX2ludGVycCA9IGZ1bmN0aW9uKGlkLGxhYmVsLG5hbWUpe1xudmFyIGJsb2NrID0gKHRoaXMgJiYgdGhpcy5ibG9jayksIGF0dHJpYnV0ZXMgPSAodGhpcyAmJiB0aGlzLmF0dHJpYnV0ZXMpIHx8IHt9O1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj48bGFiZWxcIiArIChqYWRlLmF0dHIoXCJmb3JcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImNvbC1zbS0yIGNvbnRyb2wtbGFiZWxcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxhYmVsKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2xhYmVsPjxkaXYgY2xhc3M9XFxcImNvbC1zbS0xMFxcXCI+PHRleHRhcmVhXCIgKyAoamFkZS5hdHRyKFwiaWRcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcIm5hbWVcIiwgXCJcIiArIChuYW1lKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiByb3c9XFxcIjRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiPjwvdGV4dGFyZWE+PC9kaXY+PC9kaXY+XCIpO1xufTtcbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImlkXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIHRhYmluZGV4PVxcXCItMVxcXCIgcm9sZT1cXFwiZGlhbG9nXFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcInF1ZXN0aW9uRm9ybUxhYmVsXFxcIiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgY2xhc3M9XFxcIm1vZGFsIGZhZGVcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWRpYWxvZ1xcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtY29udGVudFxcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtaGVhZGVyXFxcIj48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgY2xhc3M9XFxcImNsb3NlXFxcIj48c3BhbiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCI+JnRpbWVzOzwvc3Bhbj48c3BhbiBjbGFzcz1cXFwic3Itb25seVxcXCI+5YWz6ZetPC9zcGFuPjwvYnV0dG9uPjxoNCBpZD1cXFwicXVlc3Rpb25Gb3JtTGFiZWxcXFwiIGNsYXNzPVxcXCJtb2RhbC10aXRsZVxcXCI+6L6T5YWl6Zeu6aKY6K+m57uG5L+h5oGvPC9oND48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5XFxcIj48Zm9ybSBjbGFzcz1cXFwiZm9ybS1ob3Jpem9udGFsXFxcIj5cIik7XG5qYWRlX21peGluc1tcInRleHRhcmVhXCJdKCdjb250ZW50JywgJ+mXrumimOWGheWuuScsICdjb250ZW50Jyk7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPjxsYWJlbCBmb3I9XFxcInR5cGVcXFwiIGNsYXNzPVxcXCJjb2wtc20tMiBjb250cm9sLWxhYmVsXFxcIj7pl67popjlhoXlrrk8L2xhYmVsPjxkaXYgY2xhc3M9XFxcImNvbC1zbS0xMFxcXCI+PHNlbGVjdCBpZD1cXFwidHlwZVxcXCIgcm93PVxcXCI0XFxcIiBuYW1lPVxcXCJ0eXBlXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sIHRleHRhcmVhXFxcIj48L3NlbGVjdD48L2Rpdj48L2Rpdj5cIik7XG52YXIgb3B0aW9ucyA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnXVxuLy8gaXRlcmF0ZSBvcHRpb25zXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IG9wdGlvbnM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG5cbiAgICBmb3IgKHZhciAkaW5kZXggPSAwLCAkJGwgPSAkJG9iai5sZW5ndGg7ICRpbmRleCA8ICQkbDsgJGluZGV4KyspIHtcbiAgICAgIHZhciBvcHRpb24gPSAkJG9ialskaW5kZXhdO1xuXG5qYWRlX21peGluc1tcInRleHRhcmVhXCJdKCdvcHRpb25fJyArIG9wdGlvbiwgXCLpgInpoblcIiArIG9wdGlvbiwgJ29wdGlvbl8nICsgb3B0aW9uKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciAkaW5kZXggaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBvcHRpb24gPSAkJG9ialskaW5kZXhdO1xuXG5qYWRlX21peGluc1tcInRleHRhcmVhXCJdKCdvcHRpb25fJyArIG9wdGlvbiwgXCLpgInpoblcIiArIG9wdGlvbiwgJ29wdGlvbl8nICsgb3B0aW9uKTtcbiAgICB9XG5cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj48bGFiZWwgY2xhc3M9XFxcImNvbC1zbS0yIGNvbnRyb2wtbGFiZWxcXFwiPuato+ehruetlOahiDwvbGFiZWw+PGRpdiBjbGFzcz1cXFwiY29sLXNtLTEwXFxcIj5cIik7XG4vLyBpdGVyYXRlIG9wdGlvbnNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gb3B0aW9ucztcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiAkJG9iai5sZW5ndGgpIHtcblxuICAgIGZvciAodmFyIGkgPSAwLCAkJGwgPSAkJG9iai5sZW5ndGg7IGkgPCAkJGw7IGkrKykge1xuICAgICAgdmFyIG9wdGlvbiA9ICQkb2JqW2ldO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImNoZWNrYm94IGNvbC14cy02IGNvbC1zbS00XFxcIj48bGFiZWw+PGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBuYW1lPVxcXCJjb3JyZWN0X29wdGlvblxcXCJcIiArIChqYWRlLmF0dHIoXCJ2YWx1ZVwiLCBpKzEsIHRydWUsIGZhbHNlKSkgKyBcIi8+6YCJ6aG5XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gb3B0aW9uKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2xhYmVsPjwvZGl2PlwiKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBpIGluICQkb2JqKSB7XG4gICAgICAkJGwrKzsgICAgICB2YXIgb3B0aW9uID0gJCRvYmpbaV07XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiY2hlY2tib3ggY29sLXhzLTYgY29sLXNtLTRcXFwiPjxsYWJlbD48aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIG5hbWU9XFxcImNvcnJlY3Rfb3B0aW9uXFxcIlwiICsgKGphZGUuYXR0cihcInZhbHVlXCIsIGkrMSwgdHJ1ZSwgZmFsc2UpKSArIFwiLz7pgInpoblcIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBvcHRpb24pID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvbGFiZWw+PC9kaXY+XCIpO1xuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5idWYucHVzaChcIjwvZGl2PjwvZGl2PjwvZm9ybT48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1mb290ZXJcXFwiPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIj7lj5bmtog8L2J1dHRvbj48YnV0dG9uIHR5cGU9XFxcInN1Ym1pdFxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCI+5L+d5a2YPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkLFwidW5kZWZpbmVkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51bmRlZmluZWQ6dHlwZW9mIHVuZGVmaW5lZCE9PVwidW5kZWZpbmVkXCI/dW5kZWZpbmVkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGJ1dHRvbiwgY29udGVudCwgY29ycmVjdF9vcHRpb24sIGlkLCBvcHRpb25fQSwgb3B0aW9uX0IsIG9wdGlvbl9DLCBvcHRpb25fRCwgb3B0aW9uX0UsIG9wdGlvbl9GLCB0eXBlKSB7XG5idWYucHVzaChcIjx0ZCBjbGFzcz1cXFwiY29udGVudFxcXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBjb250ZW50KSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHR5cGUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gY29ycmVjdF9vcHRpb24pID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0EpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0IpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0MpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0QpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0UpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0YpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPjxhXCIgKyAoamFkZS5hdHRyKFwidHlwZVwiLCBidXR0b24sIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBpZCwgdHJ1ZSwgZmFsc2UpKSArIFwiIGRhdGEtdG9nZ2xlPVxcXCJtb2RhbFxcXCIgZGF0YS10YXJnZXQ9XFxcIiNxdWVzdGlvbk1vZGFsRm9ybVxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBidG4teHNcXFwiPue8lui+kTwvYT48YSBpZD1cXFwiZGVsZXRlXFxcIlwiICsgKGphZGUuYXR0cihcInR5cGVcIiwgYnV0dG9uLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImJ0biBidG4tZGFuZ2VyIGJ0bi14c1xcXCI+5Yig6ZmkPC9hPjwvdGQ+XCIpO30uY2FsbCh0aGlzLFwiYnV0dG9uXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5idXR0b246dHlwZW9mIGJ1dHRvbiE9PVwidW5kZWZpbmVkXCI/YnV0dG9uOnVuZGVmaW5lZCxcImNvbnRlbnRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmNvbnRlbnQ6dHlwZW9mIGNvbnRlbnQhPT1cInVuZGVmaW5lZFwiP2NvbnRlbnQ6dW5kZWZpbmVkLFwiY29ycmVjdF9vcHRpb25cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmNvcnJlY3Rfb3B0aW9uOnR5cGVvZiBjb3JyZWN0X29wdGlvbiE9PVwidW5kZWZpbmVkXCI/Y29ycmVjdF9vcHRpb246dW5kZWZpbmVkLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkLFwib3B0aW9uX0FcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9BOnR5cGVvZiBvcHRpb25fQSE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0E6dW5kZWZpbmVkLFwib3B0aW9uX0JcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9COnR5cGVvZiBvcHRpb25fQiE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0I6dW5kZWZpbmVkLFwib3B0aW9uX0NcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9DOnR5cGVvZiBvcHRpb25fQyE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0M6dW5kZWZpbmVkLFwib3B0aW9uX0RcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9EOnR5cGVvZiBvcHRpb25fRCE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0Q6dW5kZWZpbmVkLFwib3B0aW9uX0VcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9FOnR5cGVvZiBvcHRpb25fRSE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0U6dW5kZWZpbmVkLFwib3B0aW9uX0ZcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9GOnR5cGVvZiBvcHRpb25fRiE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0Y6dW5kZWZpbmVkLFwidHlwZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudHlwZTp0eXBlb2YgdHlwZSE9PVwidW5kZWZpbmVkXCI/dHlwZTp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpZCkge1xuamFkZV9taXhpbnNbXCJpbnB1dFwiXSA9IGphZGVfaW50ZXJwID0gZnVuY3Rpb24odHlwZSxpZCxwbGFjZWhvbGRlcixsYWJlbCxuYW1lKXtcbnZhciBibG9jayA9ICh0aGlzICYmIHRoaXMuYmxvY2spLCBhdHRyaWJ1dGVzID0gKHRoaXMgJiYgdGhpcy5hdHRyaWJ1dGVzKSB8fCB7fTtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+PGxhYmVsXCIgKyAoamFkZS5hdHRyKFwiZm9yXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJjb2wteHMtMiBjb250cm9sLWxhYmVsXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBsYWJlbCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9sYWJlbD48ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTBcXFwiPjxpbnB1dFwiICsgKGphZGUuYXR0cihcInR5cGVcIiwgXCJcIiArICh0eXBlKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwiaWRcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcInBsYWNlaG9sZGVyXCIsIFwiXCIgKyAocGxhY2Vob2xkZXIpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJuYW1lXCIsIFwiXCIgKyAobmFtZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIvPjwvZGl2PjwvZGl2PlwiKTtcbn07XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJpZFwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB0YWJpbmRleD1cXFwiLTFcXFwiIHJvbGU9XFxcImRpYWxvZ1xcXCIgYXJpYS1sYWJlbGxlZGJ5PVxcXCJ1c2VyRm9ybUxhYmVsXFxcIiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgY2xhc3M9XFxcIm1vZGFsIGZhZGVcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWRpYWxvZ1xcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtY29udGVudFxcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtaGVhZGVyXFxcIj48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgY2xhc3M9XFxcImNsb3NlXFxcIj48c3BhbiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCI+JnRpbWVzOzwvc3Bhbj48c3BhbiBjbGFzcz1cXFwic3Itb25seVxcXCI+5YWz6ZetPC9zcGFuPjwvYnV0dG9uPjxoNCBpZD1cXFwidXNlckZvcm1MYWJlbFxcXCIgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIj7ovpPlhaXnlKjmiLfkv6Hmga88L2g0PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1vZGFsLWJvZHlcXFwiPjxyb3c+PGZvcm0gY2xhc3M9XFxcImZvcm0taG9yaXpvbnRhbFxcXCI+XCIpO1xuamFkZV9taXhpbnNbXCJpbnB1dFwiXSgndGV4dCcsICd1c2VybmFtZScsICfnlKjmiLflkI0nLCAn55So5oi35ZCNJywgJ3VzZXJuYW1lJyk7XG5qYWRlX21peGluc1tcImlucHV0XCJdKCdwYXNzd29yZCcsICdwYXNzd29yZCcsICflr4bnoIEnLCAn5a+G56CBJywgJ3Bhc3N3b3JkJyk7XG5idWYucHVzaChcIjwvZm9ybT48L3Jvdz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1mb290ZXJcXFwiPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIj7lj5bmtog8L2J1dHRvbj48YnV0dG9uIHR5cGU9XFxcInN1Ym1pdFxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCI+5L+d5a2YPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoYWN0aXZlLCBhZG1pbiwgaWQsIHVzZXJuYW1lKSB7XG5idWYucHVzaChcIjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGlkKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHVzZXJuYW1lKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIik7XG5pZiAoICFhZG1pbilcbntcbmJ1Zi5wdXNoKFwiPGEgdHlwZT1cXFwiYnV0dG9uXFxcIlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgaWQsIHRydWUsIGZhbHNlKSkgKyBcIiBkYXRhLXRvZ2dsZT1cXFwibW9kYWxcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjdXNlck1vZGFsRm9ybVxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBidG4teHNcXFwiPuS/ruaUueWvhueggVwiKTtcbmlmICggYWN0aXZlKVxue1xuYnVmLnB1c2goXCI8YSBpZD1cXFwiZGVhY3RpdmF0ZVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXFxcIj7lhrvnu5PluJDlj7c8L2E+XCIpO1xufVxuZWxzZVxue1xuYnVmLnB1c2goXCI8YSBpZD1cXFwiYWN0aXZhdGVcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tc3VjY2VzcyBidG4teHNcXFwiPua/gOa0u+W4kOWPtzwvYT5cIik7XG59XG5idWYucHVzaChcIjwvYT5cIik7XG59XG5idWYucHVzaChcIjwvdGQ+XCIpO30uY2FsbCh0aGlzLFwiYWN0aXZlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5hY3RpdmU6dHlwZW9mIGFjdGl2ZSE9PVwidW5kZWZpbmVkXCI/YWN0aXZlOnVuZGVmaW5lZCxcImFkbWluXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5hZG1pbjp0eXBlb2YgYWRtaW4hPT1cInVuZGVmaW5lZFwiP2FkbWluOnVuZGVmaW5lZCxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCxcInVzZXJuYW1lXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51c2VybmFtZTp0eXBlb2YgdXNlcm5hbWUhPT1cInVuZGVmaW5lZFwiP3VzZXJuYW1lOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbihmdW5jdGlvbihmKXtpZih0eXBlb2YgZXhwb3J0cz09PVwib2JqZWN0XCImJnR5cGVvZiBtb2R1bGUhPT1cInVuZGVmaW5lZFwiKXttb2R1bGUuZXhwb3J0cz1mKCl9ZWxzZSBpZih0eXBlb2YgZGVmaW5lPT09XCJmdW5jdGlvblwiJiZkZWZpbmUuYW1kKXtkZWZpbmUoW10sZil9ZWxzZXt2YXIgZztpZih0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIil7Zz13aW5kb3d9ZWxzZSBpZih0eXBlb2YgZ2xvYmFsIT09XCJ1bmRlZmluZWRcIil7Zz1nbG9iYWx9ZWxzZSBpZih0eXBlb2Ygc2VsZiE9PVwidW5kZWZpbmVkXCIpe2c9c2VsZn1lbHNle2c9dGhpc31nLmphZGUgPSBmKCl9fSkoZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWVyZ2UgdHdvIGF0dHJpYnV0ZSBvYmplY3RzIGdpdmluZyBwcmVjZWRlbmNlXG4gKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcbiAqIHJlc3VsdGluZyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge09iamVjdH0gYVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBtZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuICB2YXIgYWMgPSBhWydjbGFzcyddO1xuICB2YXIgYmMgPSBiWydjbGFzcyddO1xuXG4gIGlmIChhYyB8fCBiYykge1xuICAgIGFjID0gYWMgfHwgW107XG4gICAgYmMgPSBiYyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWMpKSBhYyA9IFthY107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJjKSkgYmMgPSBbYmNdO1xuICAgIGFbJ2NsYXNzJ10gPSBhYy5jb25jYXQoYmMpLmZpbHRlcihudWxscyk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgIT0gJ2NsYXNzJykge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBGaWx0ZXIgbnVsbCBgdmFsYHMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBudWxscyh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJyc7XG59XG5cbi8qKlxuICogam9pbiBhcnJheSBhcyBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuam9pbkNsYXNzZXMgPSBqb2luQ2xhc3NlcztcbmZ1bmN0aW9uIGpvaW5DbGFzc2VzKHZhbCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbC5tYXAoam9pbkNsYXNzZXMpIDpcbiAgICAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSA/IE9iamVjdC5rZXlzKHZhbCkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHZhbFtrZXldOyB9KSA6XG4gICAgW3ZhbF0pLmZpbHRlcihudWxscykuam9pbignICcpO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBjbGFzc2VzXG4gKiBAcGFyYW0ge0FycmF5LjxCb29sZWFuPn0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmNscyA9IGZ1bmN0aW9uIGNscyhjbGFzc2VzLCBlc2NhcGVkKSB7XG4gIHZhciBidWYgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGVzY2FwZWQgJiYgZXNjYXBlZFtpXSkge1xuICAgICAgYnVmLnB1c2goZXhwb3J0cy5lc2NhcGUoam9pbkNsYXNzZXMoW2NsYXNzZXNbaV1dKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWYucHVzaChqb2luQ2xhc3NlcyhjbGFzc2VzW2ldKSk7XG4gICAgfVxuICB9XG4gIHZhciB0ZXh0ID0gam9pbkNsYXNzZXMoYnVmKTtcbiAgaWYgKHRleHQubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcgY2xhc3M9XCInICsgdGV4dCArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5cbmV4cG9ydHMuc3R5bGUgPSBmdW5jdGlvbiAodmFsKSB7XG4gIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModmFsKS5tYXAoZnVuY3Rpb24gKHN0eWxlKSB7XG4gICAgICByZXR1cm4gc3R5bGUgKyAnOicgKyB2YWxbc3R5bGVdO1xuICAgIH0pLmpvaW4oJzsnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG59O1xuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVzY2FwZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdGVyc2VcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRyID0gZnVuY3Rpb24gYXR0cihrZXksIHZhbCwgZXNjYXBlZCwgdGVyc2UpIHtcbiAgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgIHZhbCA9IGV4cG9ydHMuc3R5bGUodmFsKTtcbiAgfVxuICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiB2YWwgfHwgbnVsbCA9PSB2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICByZXR1cm4gJyAnICsgKHRlcnNlID8ga2V5IDoga2V5ICsgJz1cIicgKyBrZXkgKyAnXCInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmICgwID09IGtleS5pbmRleE9mKCdkYXRhJykgJiYgJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkge1xuICAgIGlmIChKU09OLnN0cmluZ2lmeSh2YWwpLmluZGV4T2YoJyYnKSAhPT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybignU2luY2UgSmFkZSAyLjAuMCwgYW1wZXJzYW5kcyAoYCZgKSBpbiBkYXRhIGF0dHJpYnV0ZXMgJyArXG4gICAgICAgICAgICAgICAgICAgJ3dpbGwgYmUgZXNjYXBlZCB0byBgJmFtcDtgJyk7XG4gICAgfTtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIGVsaW1pbmF0ZSB0aGUgZG91YmxlIHF1b3RlcyBhcm91bmQgZGF0ZXMgaW4gJyArXG4gICAgICAgICAgICAgICAgICAgJ0lTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyBcIj0nXCIgKyBKU09OLnN0cmluZ2lmeSh2YWwpLnJlcGxhY2UoLycvZywgJyZhcG9zOycpICsgXCInXCI7XG4gIH0gZWxzZSBpZiAoZXNjYXBlZCkge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgc3RyaW5naWZ5IGRhdGVzIGluIElTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIGV4cG9ydHMuZXNjYXBlKHZhbCkgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgc3RyaW5naWZ5IGRhdGVzIGluIElTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIic7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge09iamVjdH0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHJzID0gZnVuY3Rpb24gYXR0cnMob2JqLCB0ZXJzZSl7XG4gIHZhciBidWYgPSBbXTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbiAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgICAsIHZhbCA9IG9ialtrZXldO1xuXG4gICAgICBpZiAoJ2NsYXNzJyA9PSBrZXkpIHtcbiAgICAgICAgaWYgKHZhbCA9IGpvaW5DbGFzc2VzKHZhbCkpIHtcbiAgICAgICAgICBidWYucHVzaCgnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWYucHVzaChleHBvcnRzLmF0dHIoa2V5LCB2YWwsIGZhbHNlLCB0ZXJzZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYuam9pbignJyk7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIGphZGVfZW5jb2RlX2h0bWxfcnVsZXMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7J1xufTtcbnZhciBqYWRlX21hdGNoX2h0bWwgPSAvWyY8PlwiXS9nO1xuXG5mdW5jdGlvbiBqYWRlX2VuY29kZV9jaGFyKGMpIHtcbiAgcmV0dXJuIGphZGVfZW5jb2RlX2h0bWxfcnVsZXNbY10gfHwgYztcbn1cblxuZXhwb3J0cy5lc2NhcGUgPSBqYWRlX2VzY2FwZTtcbmZ1bmN0aW9uIGphZGVfZXNjYXBlKGh0bWwpe1xuICB2YXIgcmVzdWx0ID0gU3RyaW5nKGh0bWwpLnJlcGxhY2UoamFkZV9tYXRjaF9odG1sLCBqYWRlX2VuY29kZV9jaGFyKTtcbiAgaWYgKHJlc3VsdCA9PT0gJycgKyBodG1sKSByZXR1cm4gaHRtbDtcbiAgZWxzZSByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBSZS10aHJvdyB0aGUgZ2l2ZW4gYGVycmAgaW4gY29udGV4dCB0byB0aGVcbiAqIHRoZSBqYWRlIGluIGBmaWxlbmFtZWAgYXQgdGhlIGdpdmVuIGBsaW5lbm9gLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnJldGhyb3cgPSBmdW5jdGlvbiByZXRocm93KGVyciwgZmlsZW5hbWUsIGxpbmVubywgc3RyKXtcbiAgaWYgKCEoZXJyIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBlcnI7XG4gIGlmICgodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyB8fCAhZmlsZW5hbWUpICYmICFzdHIpIHtcbiAgICBlcnIubWVzc2FnZSArPSAnIG9uIGxpbmUgJyArIGxpbmVubztcbiAgICB0aHJvdyBlcnI7XG4gIH1cbiAgdHJ5IHtcbiAgICBzdHIgPSBzdHIgfHwgcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JylcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnSmFkZScpICsgJzonICsgbGluZW5vXG4gICAgKyAnXFxuJyArIGNvbnRleHQgKyAnXFxuXFxuJyArIGVyci5tZXNzYWdlO1xuICB0aHJvdyBlcnI7XG59O1xuXG5leHBvcnRzLkRlYnVnSXRlbSA9IGZ1bmN0aW9uIERlYnVnSXRlbShsaW5lbm8sIGZpbGVuYW1lKSB7XG4gIHRoaXMubGluZW5vID0gbGluZW5vO1xuICB0aGlzLmZpbGVuYW1lID0gZmlsZW5hbWU7XG59XG5cbn0se1wiZnNcIjoyfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cbn0se31dfSx7fSxbMV0pKDEpXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIl19
