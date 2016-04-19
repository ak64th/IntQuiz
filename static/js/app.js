(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IntApp;

window.IntApp = IntApp = {
  AccountPageView: require('account-page'),
  BookPageView: require('book-page'),
  QuestionPageView: require('question-page'),
  ActivityPageView: require('activity-page')
};


},{"account-page":3,"activity-page":4,"book-page":5,"question-page":8}],2:[function(require,module,exports){

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


},{"data/base-collection":6,"data/base-model":7,"templates/user-modal":18,"templates/user-row":19,"views/modal-view":9,"views/pagination-view":10,"views/table-view":11}],4:[function(require,module,exports){
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


},{"data/base-collection":6,"data/base-model":7,"templates/activity-row":12,"views/modal-view":9,"views/pagination-view":10,"views/table-view":11}],5:[function(require,module,exports){
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


},{"data/base-collection":6,"data/base-model":7,"templates/book-modal":13,"templates/book-row":14,"views/modal-view":9,"views/pagination-view":10,"views/table-view":11}],6:[function(require,module,exports){
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
      return this.model.destroy();
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


},{"data/base-collection":6,"data/base-model":7,"templates/question-modal":16,"templates/question-row":17,"views/modal-view":9,"views/pagination-view":10,"views/table-view":11}],9:[function(require,module,exports){
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


},{}],10:[function(require,module,exports){
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


},{"templates/page-nav":15}],11:[function(require,module,exports){
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


},{}],12:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (book, chances, end_at, id, info_field_2, info_field_3, multi, multi_points, name, single, single_points, start_at, status, time_limit, type, url, user, welcome) {
buf.push("<td>" + (jade.escape(null == (jade_interp = id) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = name) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = book.title) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = type) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = chances) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = time_limit) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = single) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = multi) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = single_points) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = multi_points) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = status) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = start_at) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = end_at) ? "" : jade_interp)) + "</td><td>" + (null == (jade_interp = welcome) ? "" : jade_interp) + "</td><td>" + (jade.escape(null == (jade_interp = info_field_3) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = info_field_2) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = info_field_3) ? "" : jade_interp)) + "</td><td><a" + (jade.attr("href", url, true, false)) + ">" + (jade.escape(null == (jade_interp = url) ? "" : jade_interp)) + "</a></td><td><a" + (jade.attr("href", "/activities/edit/" + (id) + "", true, false)) + " class=\"btn btn-primary btn-xs\">编辑</a></td><td>" + (jade.escape(null == (jade_interp = user.username) ? "" : jade_interp)) + "</td>");}.call(this,"book" in locals_for_with?locals_for_with.book:typeof book!=="undefined"?book:undefined,"chances" in locals_for_with?locals_for_with.chances:typeof chances!=="undefined"?chances:undefined,"end_at" in locals_for_with?locals_for_with.end_at:typeof end_at!=="undefined"?end_at:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"info_field_2" in locals_for_with?locals_for_with.info_field_2:typeof info_field_2!=="undefined"?info_field_2:undefined,"info_field_3" in locals_for_with?locals_for_with.info_field_3:typeof info_field_3!=="undefined"?info_field_3:undefined,"multi" in locals_for_with?locals_for_with.multi:typeof multi!=="undefined"?multi:undefined,"multi_points" in locals_for_with?locals_for_with.multi_points:typeof multi_points!=="undefined"?multi_points:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"single" in locals_for_with?locals_for_with.single:typeof single!=="undefined"?single:undefined,"single_points" in locals_for_with?locals_for_with.single_points:typeof single_points!=="undefined"?single_points:undefined,"start_at" in locals_for_with?locals_for_with.start_at:typeof start_at!=="undefined"?start_at:undefined,"status" in locals_for_with?locals_for_with.status:typeof status!=="undefined"?status:undefined,"time_limit" in locals_for_with?locals_for_with.time_limit:typeof time_limit!=="undefined"?time_limit:undefined,"type" in locals_for_with?locals_for_with.type:typeof type!=="undefined"?type:undefined,"url" in locals_for_with?locals_for_with.url:typeof url!=="undefined"?url:undefined,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined,"welcome" in locals_for_with?locals_for_with.welcome:typeof welcome!=="undefined"?welcome:undefined));;return buf.join("");
};
},{"jade/runtime":20}],13:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (id) {
buf.push("<div" + (jade.attr("id", "" + (id) + "", true, false)) + " tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"bookFormLabel\" aria-hidden=\"true\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" class=\"close\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">关闭</span></button><h4 id=\"bookFormLabel\" class=\"modal-title\">输入题库信息</h4></div><div class=\"modal-body\"><form><div class=\"form-group\"><label for=\"title\" class=\"control-label\">题库名</label><input type=\"text\" id=\"title\" placeholder=\"题库名\" name=\"title\" class=\"form-control\"/></div></form></div><div class=\"modal-footer\"><button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default\">取消</button><button id=\"save\" type=\"submit\" class=\"btn btn-primary\">保存</button></div></div></div></div>");}.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined));;return buf.join("");
};
},{"jade/runtime":20}],14:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (button, id, title, user) {
buf.push("<td>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = user.username) ? "" : jade_interp)) + "</td><td><a" + (jade.attr("href", '/quizbooks/' + (id) + '/questions', true, false)) + " class=\"btn btn-default btn-xs\">查看</a><a" + (jade.attr("type", button, true, false)) + (jade.attr("data-id", id, true, false)) + " data-toggle=\"modal\" data-target=\"#bookModalForm\" class=\"btn btn-primary btn-xs\">编辑</a></td>");}.call(this,"button" in locals_for_with?locals_for_with.button:typeof button!=="undefined"?button:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));;return buf.join("");
};
},{"jade/runtime":20}],15:[function(require,module,exports){
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
},{"jade/runtime":20}],16:[function(require,module,exports){
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
},{"jade/runtime":20}],17:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (button, content, correct_option, id, option_A, option_B, option_C, option_D, option_E, option_F, type) {
buf.push("<td class=\"content\">" + (jade.escape(null == (jade_interp = content) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = type) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = correct_option) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_A) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_B) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_C) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_D) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_E) ? "" : jade_interp)) + "</td><td>" + (jade.escape(null == (jade_interp = option_F) ? "" : jade_interp)) + "</td><td><a" + (jade.attr("type", button, true, false)) + (jade.attr("data-id", id, true, false)) + " data-toggle=\"modal\" data-target=\"#questionModalForm\" class=\"btn btn-primary btn-xs\">编辑</a><a id=\"delete\"" + (jade.attr("type", button, true, false)) + " class=\"btn btn-danger btn-xs\">删除</a></td>");}.call(this,"button" in locals_for_with?locals_for_with.button:typeof button!=="undefined"?button:undefined,"content" in locals_for_with?locals_for_with.content:typeof content!=="undefined"?content:undefined,"correct_option" in locals_for_with?locals_for_with.correct_option:typeof correct_option!=="undefined"?correct_option:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"option_A" in locals_for_with?locals_for_with.option_A:typeof option_A!=="undefined"?option_A:undefined,"option_B" in locals_for_with?locals_for_with.option_B:typeof option_B!=="undefined"?option_B:undefined,"option_C" in locals_for_with?locals_for_with.option_C:typeof option_C!=="undefined"?option_C:undefined,"option_D" in locals_for_with?locals_for_with.option_D:typeof option_D!=="undefined"?option_D:undefined,"option_E" in locals_for_with?locals_for_with.option_E:typeof option_E!=="undefined"?option_E:undefined,"option_F" in locals_for_with?locals_for_with.option_F:typeof option_F!=="undefined"?option_F:undefined,"type" in locals_for_with?locals_for_with.type:typeof type!=="undefined"?type:undefined));;return buf.join("");
};
},{"jade/runtime":20}],18:[function(require,module,exports){
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
},{"jade/runtime":20}],19:[function(require,module,exports){
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
},{"jade/runtime":20}],20:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvYXBwL3NjcmlwdHMvYXBwLmNvZmZlZSIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsImFwcC9zY3JpcHRzL2FjY291bnQtcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9hY3Rpdml0eS1wYWdlLmNvZmZlZSIsImFwcC9zY3JpcHRzL2Jvb2stcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9kYXRhL2Jhc2UtY29sbGVjdGlvbi5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9kYXRhL2Jhc2UtbW9kZWwuY29mZmVlIiwiYXBwL3NjcmlwdHMvcXVlc3Rpb24tcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy92aWV3cy9tb2RhbC12aWV3LmNvZmZlZSIsImFwcC9zY3JpcHRzL3ZpZXdzL3BhZ2luYXRpb24tdmlldy5jb2ZmZWUiLCJhcHAvc2NyaXB0cy92aWV3cy90YWJsZS12aWV3LmNvZmZlZSIsImFwcC90ZW1wbGF0ZXMvYWN0aXZpdHktcm93LmphZGUiLCJhcHAvdGVtcGxhdGVzL2Jvb2stbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvYm9vay1yb3cuamFkZSIsImFwcC90ZW1wbGF0ZXMvcGFnZS1uYXYuamFkZSIsImFwcC90ZW1wbGF0ZXMvcXVlc3Rpb24tbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvcXVlc3Rpb24tcm93LmphZGUiLCJhcHAvdGVtcGxhdGVzL3VzZXItbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvdXNlci1yb3cuamFkZSIsIm5vZGVfbW9kdWxlcy9qYWRlL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEludEFwcDtcblxud2luZG93LkludEFwcCA9IEludEFwcCA9IHtcbiAgQWNjb3VudFBhZ2VWaWV3OiByZXF1aXJlKCdhY2NvdW50LXBhZ2UnKSxcbiAgQm9va1BhZ2VWaWV3OiByZXF1aXJlKCdib29rLXBhZ2UnKSxcbiAgUXVlc3Rpb25QYWdlVmlldzogcmVxdWlyZSgncXVlc3Rpb24tcGFnZScpLFxuICBBY3Rpdml0eVBhZ2VWaWV3OiByZXF1aXJlKCdhY3Rpdml0eS1wYWdlJylcbn07XG5cbiIsbnVsbCwidmFyIEFjY291bnRQYWdlVmlldywgQmFzZUNvbGxlY3Rpb24sIEJhc2VNb2RlbCwgTW9kYWxWaWV3LCBQYWdpbmF0aW9uVmlldywgVGFibGVWaWV3LCBVc2VyLCBVc2VyTW9kYWxWaWV3LCBVc2VyVmlldywgVXNlcnMsIFVzZXJzVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VNb2RlbCA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1tb2RlbCcpO1xuXG5CYXNlQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1jb2xsZWN0aW9uJyk7XG5cblRhYmxlVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3RhYmxlLXZpZXcnKTtcblxuUGFnaW5hdGlvblZpZXcgPSByZXF1aXJlKCd2aWV3cy9wYWdpbmF0aW9uLXZpZXcnKTtcblxuTW9kYWxWaWV3ID0gcmVxdWlyZSgndmlld3MvbW9kYWwtdmlldycpO1xuXG5Vc2VyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFVzZXIsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXIoKSB7XG4gICAgcmV0dXJuIFVzZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVc2VyLnByb3RvdHlwZS51cmxSb290ID0gJy9hcGkvdjEvdXNlcic7XG5cbiAgVXNlci5wcm90b3R5cGUuZGVmYXVsdHMgPSB7XG4gICAgdXNlcm5hbWU6ICcnLFxuICAgIHBhc3N3b3JkOiAnJ1xuICB9O1xuXG4gIFVzZXIucHJvdG90eXBlLnZhbGlkYXRpb24gPSB7XG4gICAgdXNlcm5hbWU6IHtcbiAgICAgIGJsYW5rOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2U6ICfnlKjmiLflkI3kuI3og73kuLrnqbonXG4gICAgfSxcbiAgICBwYXNzd29yZDoge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgbWluTGVuZ3RoOiA2LFxuICAgICAgbWVzc2FnZTogJ+WvhueggeS4jeiDveWwkeS6jjbkvY0nXG4gICAgfVxuICB9O1xuXG4gIFVzZXIucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF0dHJzLCB1cmw7XG4gICAgYXR0cnMgPSB7XG4gICAgICBhY3RpdmU6IHRydWVcbiAgICB9O1xuICAgIHVybCA9IFwiL2FjY291bnRzL1wiICsgdGhpcy5pZCArIFwiL3RvZ2dsZVwiO1xuICAgIHJldHVybiB0aGlzLnNhdmUoYXR0cnMsIHtcbiAgICAgIGF0dHJzOiBhdHRycyxcbiAgICAgIHVybDogdXJsXG4gICAgfSk7XG4gIH07XG5cbiAgVXNlci5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdHRycywgdXJsO1xuICAgIGF0dHJzID0ge1xuICAgICAgYWN0aXZlOiBmYWxzZVxuICAgIH07XG4gICAgdXJsID0gXCIvYWNjb3VudHMvXCIgKyB0aGlzLmlkICsgXCIvdG9nZ2xlXCI7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZShhdHRycywge1xuICAgICAgYXR0cnM6IGF0dHJzLFxuICAgICAgdXJsOiB1cmxcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gVXNlcjtcblxufSkoQmFzZU1vZGVsKTtcblxuVXNlcnMgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlcnMsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJzKCkge1xuICAgIHJldHVybiBVc2Vycy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJzLnByb3RvdHlwZS51cmwgPSAnL2FwaS92MS91c2VyJztcblxuICBVc2Vycy5wcm90b3R5cGUubW9kZWwgPSBVc2VyO1xuXG4gIHJldHVybiBVc2VycztcblxufSkoQmFzZUNvbGxlY3Rpb24pO1xuXG5Vc2VyVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChVc2VyVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gVXNlclZpZXcoKSB7XG4gICAgcmV0dXJuIFVzZXJWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVXNlclZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAndHInO1xuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy91c2VyLXJvdycpO1xuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS5ldmVudHMgPSB7XG4gICAgJ2NsaWNrICNkZWFjdGl2YXRlJzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbC5kZWFjdGl2YXRlKCk7XG4gICAgfSxcbiAgICAnY2xpY2sgI2FjdGl2YXRlJzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbC5hY3RpdmF0ZSgpO1xuICAgIH1cbiAgfTtcblxuICBVc2VyVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJzeW5jXCIsIHRoaXMucmVuZGVyKTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcImRlc3Ryb3lcIiwgdGhpcy5yZW1vdmUpO1xuICB9O1xuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBVc2VyVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cblVzZXJNb2RhbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlck1vZGFsVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gVXNlck1vZGFsVmlldygpIHtcbiAgICByZXR1cm4gVXNlck1vZGFsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJNb2RhbFZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL3VzZXItbW9kYWwnKTtcblxuICBVc2VyTW9kYWxWaWV3LnByb3RvdHlwZS5iaW5kaW5ncyA9IHtcbiAgICAnI3VzZXJuYW1lJzogJ3VzZXJuYW1lJyxcbiAgICAnI3Bhc3N3b3JkJzogJ3Bhc3N3b3JkJ1xuICB9O1xuXG4gIFVzZXJNb2RhbFZpZXcucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHVybCwgeGhyO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB1cmwgPSB0aGlzLm1vZGVsLmlzTmV3KCkgPyBcIi9hY2NvdW50cy9jcmVhdGVcIiA6IFwiL2FjY291bnRzL1wiICsgdGhpcy5tb2RlbC5pZCArIFwiL2NoYW5nZVB3ZFwiO1xuICAgIHhociA9IHRoaXMubW9kZWwuc2F2ZShudWxsLCB7XG4gICAgICB1cmw6IHVybFxuICAgIH0pO1xuICAgIGlmICh4aHIpIHtcbiAgICAgIHJldHVybiB4aHIudGhlbigoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBfdGhpcy5jb2xsZWN0aW9uLmFkZChfdGhpcy5tb2RlbCk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLiRlbC5tb2RhbCgnaGlkZScpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFVzZXJNb2RhbFZpZXc7XG5cbn0pKE1vZGFsVmlldyk7XG5cblVzZXJzVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChVc2Vyc1ZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJzVmlldygpIHtcbiAgICByZXR1cm4gVXNlcnNWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVXNlcnNWaWV3LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHJldHVybiBuZXcgVXNlclZpZXcoe1xuICAgICAgbW9kZWw6IG1vZGVsXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFVzZXJzVmlldztcblxufSkoVGFibGVWaWV3KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBY2NvdW50UGFnZVZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQWNjb3VudFBhZ2VWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBBY2NvdW50UGFnZVZpZXcoKSB7XG4gICAgcmV0dXJuIEFjY291bnRQYWdlVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFjY291bnRQYWdlVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhZ2VOYXZWaWV3LCB1c2VyTW9kYWxWaWV3LCB1c2VycywgdXNlcnNWaWV3O1xuICAgIHVzZXJzID0gbmV3IFVzZXJzO1xuICAgIHVzZXJzVmlldyA9IG5ldyBVc2Vyc1ZpZXcoe1xuICAgICAgZWw6ICQoJy50YWJsZS1jb250YWluZXInKSxcbiAgICAgIGNvbGxlY3Rpb246IHVzZXJzXG4gICAgfSk7XG4gICAgcGFnZU5hdlZpZXcgPSBuZXcgUGFnaW5hdGlvblZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdXNlcnNcbiAgICB9KTtcbiAgICB1c2Vyc1ZpZXcuJGVsLmFmdGVyKHBhZ2VOYXZWaWV3LnJlbmRlcigpLiRlbCk7XG4gICAgdXNlck1vZGFsVmlldyA9IG5ldyBVc2VyTW9kYWxWaWV3KHtcbiAgICAgIGlkOiAndXNlck1vZGFsRm9ybScsXG4gICAgICBjb2xsZWN0aW9uOiB1c2Vyc1xuICAgIH0pO1xuICAgIHVzZXJNb2RhbFZpZXcucmVuZGVyKCk7XG4gICAgdXNlcnMuZmV0Y2goe1xuICAgICAgcmVzZXQ6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gQWNjb3VudFBhZ2VWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIEFjdGl2aXRpZXMsIEFjdGl2aXRpZXNWaWV3LCBBY3Rpdml0eSwgQWN0aXZpdHlQYWdlVmlldywgQWN0aXZpdHlWaWV3LCBCYXNlQ29sbGVjdGlvbiwgQmFzZU1vZGVsLCBEQVRFVElNRV9GT1JNQVQsIE1vZGFsVmlldywgUGFnaW5hdGlvblZpZXcsIFRhYmxlVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VNb2RlbCA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1tb2RlbCcpO1xuXG5CYXNlQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1jb2xsZWN0aW9uJyk7XG5cblRhYmxlVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3RhYmxlLXZpZXcnKTtcblxuUGFnaW5hdGlvblZpZXcgPSByZXF1aXJlKCd2aWV3cy9wYWdpbmF0aW9uLXZpZXcnKTtcblxuTW9kYWxWaWV3ID0gcmVxdWlyZSgndmlld3MvbW9kYWwtdmlldycpO1xuXG5EQVRFVElNRV9GT1JNQVQgPSAnWVlZWS1NTS1ERCBISDptbTpzcyc7XG5cbkFjdGl2aXR5ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjdGl2aXR5LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBBY3Rpdml0eSgpIHtcbiAgICByZXR1cm4gQWN0aXZpdHkuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY3Rpdml0eS5wcm90b3R5cGUudXJsUm9vdCA9ICcvYXBpL3YxL2FjdGl2aXR5Lyc7XG5cbiAgQWN0aXZpdHkucHJvdG90eXBlLmRlZmF1bHRzID0ge1xuICAgIFwiaW5mb19maWVsZF8xXCI6IFwiXCIsXG4gICAgXCJpbmZvX2ZpZWxkXzJcIjogXCJcIixcbiAgICBcImluZm9fZmllbGRfM1wiOiBcIlwiXG4gIH07XG5cbiAgcmV0dXJuIEFjdGl2aXR5O1xuXG59KShCYXNlTW9kZWwpO1xuXG5BY3Rpdml0aWVzID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjdGl2aXRpZXMsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFjdGl2aXRpZXMoKSB7XG4gICAgcmV0dXJuIEFjdGl2aXRpZXMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY3Rpdml0aWVzLnByb3RvdHlwZS51cmwgPSAnL2FwaS92MS9hY3Rpdml0eS8nO1xuXG4gIEFjdGl2aXRpZXMucHJvdG90eXBlLm1vZGVsID0gQWN0aXZpdHk7XG5cbiAgcmV0dXJuIEFjdGl2aXRpZXM7XG5cbn0pKEJhc2VDb2xsZWN0aW9uKTtcblxuQWN0aXZpdHlWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjdGl2aXR5Vmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQWN0aXZpdHlWaWV3KCkge1xuICAgIHJldHVybiBBY3Rpdml0eVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY3Rpdml0eVZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAndHInO1xuXG4gIEFjdGl2aXR5Vmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvYWN0aXZpdHktcm93Jyk7XG5cbiAgQWN0aXZpdHlWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0YSwgZW5kX2F0LCBmcm9udF9ob3N0LCBub3csIHN0YXJ0X2F0O1xuICAgIGZyb250X2hvc3QgPSB3aW5kb3cuZnJvbnRfaG9zdCB8fCAnLyc7XG4gICAgZGF0YSA9IHRoaXMubW9kZWwudG9KU09OKCk7XG4gICAgc3RhcnRfYXQgPSBuZXcgbW9tZW50KGRhdGEuc3RhcnRfYXQsIERBVEVUSU1FX0ZPUk1BVCk7XG4gICAgZW5kX2F0ID0gbmV3IG1vbWVudChkYXRhLmVuZF9hdCwgREFURVRJTUVfRk9STUFUKTtcbiAgICBub3cgPSBuZXcgbW9tZW50KCk7XG4gICAgZGF0YVsnc3RhdHVzJ10gPSAoc3RhcnRfYXQgPCBub3cgJiYgbm93IDwgZW5kX2F0KSA/ICflvIDlkK8nIDogJ+WFs+mXrSc7XG4gICAgZGF0YVsndXJsJ10gPSBcImh0dHA6Ly9cIiArIGZyb250X2hvc3QgKyBcIi9pbmRleC5odG1sI1wiICsgZGF0YVsnY29kZSddO1xuICAgIGRhdGFbJ3R5cGUnXSA9IChmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAoZGF0YVsndHlwZSddKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICByZXR1cm4gJ+aZrumAmic7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICByZXR1cm4gJ+mZkOaXtic7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICByZXR1cm4gJ+aMkeaImCc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuICfmnKrnn6UnO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKGRhdGEpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gQWN0aXZpdHlWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuQWN0aXZpdGllc1ZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQWN0aXZpdGllc1ZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFjdGl2aXRpZXNWaWV3KCkge1xuICAgIHJldHVybiBBY3Rpdml0aWVzVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFjdGl2aXRpZXNWaWV3LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHJldHVybiBuZXcgQWN0aXZpdHlWaWV3KHtcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBBY3Rpdml0aWVzVmlldztcblxufSkoVGFibGVWaWV3KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpdml0eVBhZ2VWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjdGl2aXR5UGFnZVZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFjdGl2aXR5UGFnZVZpZXcoKSB7XG4gICAgcmV0dXJuIEFjdGl2aXR5UGFnZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY3Rpdml0eVBhZ2VWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWN0aXZpdGllcywgYWN0aXZpdGllc1ZpZXcsIHBhZ2VOYXZWaWV3O1xuICAgIGFjdGl2aXRpZXMgPSBuZXcgQWN0aXZpdGllcztcbiAgICBhY3Rpdml0aWVzVmlldyA9IG5ldyBBY3Rpdml0aWVzVmlldyh7XG4gICAgICBlbDogJCgnI2FjdGl2aXR5LXRhYmxlLWNvbnRhaW5lcicpLFxuICAgICAgY29sbGVjdGlvbjogYWN0aXZpdGllc1xuICAgIH0pO1xuICAgIHBhZ2VOYXZWaWV3ID0gbmV3IFBhZ2luYXRpb25WaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IGFjdGl2aXRpZXNcbiAgICB9KTtcbiAgICBhY3Rpdml0aWVzVmlldy4kZWwuYWZ0ZXIocGFnZU5hdlZpZXcucmVuZGVyKCkuJGVsKTtcbiAgICBhY3Rpdml0aWVzLmZldGNoKHtcbiAgICAgIHJlc2V0OiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIEFjdGl2aXR5UGFnZVZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgQmFzZUNvbGxlY3Rpb24sIEJhc2VNb2RlbCwgQm9va1BhZ2VWaWV3LCBNb2RhbFZpZXcsIFBhZ2luYXRpb25WaWV3LCBRdWl6Qm9vaywgUXVpekJvb2tNb2RhbFZpZXcsIFF1aXpCb29rVmlldywgUXVpekJvb2tzLCBRdWl6Qm9va3NWaWV3LCBUYWJsZVZpZXcsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5CYXNlTW9kZWwgPSByZXF1aXJlKCdkYXRhL2Jhc2UtbW9kZWwnKTtcblxuQmFzZUNvbGxlY3Rpb24gPSByZXF1aXJlKCdkYXRhL2Jhc2UtY29sbGVjdGlvbicpO1xuXG5UYWJsZVZpZXcgPSByZXF1aXJlKCd2aWV3cy90YWJsZS12aWV3Jyk7XG5cblBhZ2luYXRpb25WaWV3ID0gcmVxdWlyZSgndmlld3MvcGFnaW5hdGlvbi12aWV3Jyk7XG5cbk1vZGFsVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL21vZGFsLXZpZXcnKTtcblxuUXVpekJvb2sgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVpekJvb2ssIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1aXpCb29rKCkge1xuICAgIHJldHVybiBRdWl6Qm9vay5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1aXpCb29rLnByb3RvdHlwZS51cmxSb290ID0gJy9hcGkvdjEvcXVpemJvb2snO1xuXG4gIFF1aXpCb29rLnByb3RvdHlwZS52YWxpZGF0aW9uID0ge1xuICAgIHRpdGxlOiB7XG4gICAgICBibGFuazogZmFsc2UsXG4gICAgICBtZXNzYWdlOiAn6aKY5bqT5ZCN5LiN6IO95Li656m6J1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUXVpekJvb2s7XG5cbn0pKEJhc2VNb2RlbCk7XG5cblF1aXpCb29rcyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWl6Qm9va3MsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1aXpCb29rcygpIHtcbiAgICByZXR1cm4gUXVpekJvb2tzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVpekJvb2tzLnByb3RvdHlwZS51cmwgPSAnL2FwaS92MS9xdWl6Ym9vayc7XG5cbiAgUXVpekJvb2tzLnByb3RvdHlwZS5tb2RlbCA9IFF1aXpCb29rO1xuXG4gIHJldHVybiBRdWl6Qm9va3M7XG5cbn0pKEJhc2VDb2xsZWN0aW9uKTtcblxuUXVpekJvb2tWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1aXpCb29rVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVpekJvb2tWaWV3KCkge1xuICAgIHJldHVybiBRdWl6Qm9va1ZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWl6Qm9va1ZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAndHInO1xuXG4gIFF1aXpCb29rVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvYm9vay1yb3cnKTtcblxuICBRdWl6Qm9va1ZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcInN5bmNcIiwgdGhpcy5yZW5kZXIpO1xuICB9O1xuXG4gIFF1aXpCb29rVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwudG9KU09OKCkpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gUXVpekJvb2tWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuUXVpekJvb2tNb2RhbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVpekJvb2tNb2RhbFZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1aXpCb29rTW9kYWxWaWV3KCkge1xuICAgIHJldHVybiBRdWl6Qm9va01vZGFsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1aXpCb29rTW9kYWxWaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9ib29rLW1vZGFsJyk7XG5cbiAgUXVpekJvb2tNb2RhbFZpZXcucHJvdG90eXBlLmJpbmRpbmdzID0ge1xuICAgICcjdGl0bGUnOiAndGl0bGUnXG4gIH07XG5cbiAgcmV0dXJuIFF1aXpCb29rTW9kYWxWaWV3O1xuXG59KShNb2RhbFZpZXcpO1xuXG5RdWl6Qm9va3NWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1aXpCb29rc1ZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1aXpCb29rc1ZpZXcoKSB7XG4gICAgcmV0dXJuIFF1aXpCb29rc1ZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWl6Qm9va3NWaWV3LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHJldHVybiBuZXcgUXVpekJvb2tWaWV3KHtcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBRdWl6Qm9va3NWaWV3O1xuXG59KShUYWJsZVZpZXcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJvb2tQYWdlVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChCb29rUGFnZVZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEJvb2tQYWdlVmlldygpIHtcbiAgICByZXR1cm4gQm9va1BhZ2VWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQm9va1BhZ2VWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFnZU5hdlZpZXcsIHF1aXpCb29rTW9kYWxWaWV3LCBxdWl6Qm9va3MsIHF1aXpCb29rc1ZpZXc7XG4gICAgcXVpekJvb2tzID0gbmV3IFF1aXpCb29rcztcbiAgICBxdWl6Qm9va3NWaWV3ID0gbmV3IFF1aXpCb29rc1ZpZXcoe1xuICAgICAgZWw6ICQoJyNxdWl6Ym9vay10YWJsZS1jb250YWluZXInKSxcbiAgICAgIGNvbGxlY3Rpb246IHF1aXpCb29rc1xuICAgIH0pO1xuICAgIHBhZ2VOYXZWaWV3ID0gbmV3IFBhZ2luYXRpb25WaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHF1aXpCb29rc1xuICAgIH0pO1xuICAgIHF1aXpCb29rc1ZpZXcuJGVsLmFmdGVyKHBhZ2VOYXZWaWV3LnJlbmRlcigpLiRlbCk7XG4gICAgcXVpekJvb2tNb2RhbFZpZXcgPSBuZXcgUXVpekJvb2tNb2RhbFZpZXcoe1xuICAgICAgaWQ6ICdib29rTW9kYWxGb3JtJyxcbiAgICAgIGNvbGxlY3Rpb246IHF1aXpCb29rc1xuICAgIH0pO1xuICAgIHF1aXpCb29rTW9kYWxWaWV3LnJlbmRlcigpO1xuICAgIHF1aXpCb29rcy5mZXRjaCh7XG4gICAgICByZXNldDogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBCb29rUGFnZVZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgQmFzZUNvbGxlY3Rpb24sXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5CYXNlQ29sbGVjdGlvbiA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChCYXNlQ29sbGVjdGlvbiwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQmFzZUNvbGxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIEJhc2VDb2xsZWN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQmFzZUNvbGxlY3Rpb24ucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmIChkYXRhICYmIGRhdGEubWV0YSkge1xuICAgICAgdGhpcy5tZXRhID0gZGF0YS5tZXRhO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YSAmJiBkYXRhLm9iamVjdHMgfHwgZGF0YTtcbiAgfTtcblxuICByZXR1cm4gQmFzZUNvbGxlY3Rpb247XG5cbn0pKEJhY2tib25lLkNvbGxlY3Rpb24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VDb2xsZWN0aW9uO1xuXG4iLCJ2YXIgQmFzZU1vZGVsLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZU1vZGVsID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEJhc2VNb2RlbCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQmFzZU1vZGVsKCkge1xuICAgIHJldHVybiBCYXNlTW9kZWwuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCYXNlTW9kZWwucHJvdG90eXBlLnVybCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcmlnVXJsO1xuICAgIG9yaWdVcmwgPSBCYXNlTW9kZWwuX19zdXBlcl9fLnVybC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiBvcmlnVXJsICsgKG9yaWdVcmwubGVuZ3RoID4gMCAmJiBvcmlnVXJsLmNoYXJBdChvcmlnVXJsLmxlbmd0aCAtIDEpID09PSAnLycgPyAnJyA6ICcvJyk7XG4gIH07XG5cbiAgQmFzZU1vZGVsLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLm9iamVjdHMgJiYgXy5pc0FycmF5KGRhdGEub2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBkYXRhLm9iamVjdHNbMF0gfHwge307XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIHJldHVybiBCYXNlTW9kZWw7XG5cbn0pKEJhY2tib25lLk1vZGVsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlTW9kZWw7XG5cbiIsInZhciBCYXNlQ29sbGVjdGlvbiwgQmFzZU1vZGVsLCBNb2RhbFZpZXcsIFBhZ2luYXRpb25WaWV3LCBRdWVzdGlvbiwgUXVlc3Rpb25MaXN0UGFuZWxWaWV3LCBRdWVzdGlvbk1vZGFsVmlldywgUXVlc3Rpb25QYWdlVmlldywgUXVlc3Rpb25WaWV3LCBRdWVzdGlvbnMsIFF1ZXN0aW9uc1ZpZXcsIFRhYmxlVmlldywgY2hhcjJJbnQsIGludDJDaGFyLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZU1vZGVsID0gcmVxdWlyZSgnZGF0YS9iYXNlLW1vZGVsJyk7XG5cbkJhc2VDb2xsZWN0aW9uID0gcmVxdWlyZSgnZGF0YS9iYXNlLWNvbGxlY3Rpb24nKTtcblxuVGFibGVWaWV3ID0gcmVxdWlyZSgndmlld3MvdGFibGUtdmlldycpO1xuXG5QYWdpbmF0aW9uVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3BhZ2luYXRpb24tdmlldycpO1xuXG5Nb2RhbFZpZXcgPSByZXF1aXJlKCd2aWV3cy9tb2RhbC12aWV3Jyk7XG5cbmludDJDaGFyID0gZnVuY3Rpb24oaSkge1xuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSg2NCArIHBhcnNlSW50KGkpKTtcbn07XG5cbmNoYXIySW50ID0gZnVuY3Rpb24oYykge1xuICBpZiAoISFjKSB7XG4gICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYztcbiAgfVxufTtcblxuUXVlc3Rpb24gPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb24sIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uKCkge1xuICAgIHJldHVybiBRdWVzdGlvbi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9uLnByb3RvdHlwZS51cmxSb290ID0gJy9hcGkvdjEvcXVlc3Rpb24vJztcblxuICBRdWVzdGlvbi5wcm90b3R5cGUuZGVmYXVsdHMgPSB7XG4gICAgXCJ0eXBlXCI6IDEsXG4gICAgXCJjb3JyZWN0X29wdGlvblwiOiBcIjFcIixcbiAgICBcIm9wdGlvbl9BXCI6IFwiXCIsXG4gICAgXCJvcHRpb25fQlwiOiBcIlwiLFxuICAgIFwib3B0aW9uX0NcIjogXCJcIixcbiAgICBcIm9wdGlvbl9EXCI6IFwiXCIsXG4gICAgXCJvcHRpb25fRVwiOiBcIlwiLFxuICAgIFwib3B0aW9uX0ZcIjogXCJcIlxuICB9O1xuXG4gIFF1ZXN0aW9uLnByb3RvdHlwZS52YWxpZGF0aW9uID0ge1xuICAgIGNvbnRlbnQ6IHtcbiAgICAgIGJsYW5rOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2U6ICfpopjnm67lhoXlrrnkuI3og73kuLrnqbonXG4gICAgfSxcbiAgICB0eXBlOiB7XG4gICAgICBibGFuazogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSAxIHx8IHZhbHVlID09PSAyO1xuICAgICAgfSxcbiAgICAgIG1lc3NhZ2U6ICfpopjnm67nsbvlnovlv4XpobvmmK/lpJrpgInmiJbljZXpgIknXG4gICAgfSxcbiAgICBjb3JyZWN0X29wdGlvbjoge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN3aXRjaCAoZmFsc2UpIHtcbiAgICAgICAgICAgIGNhc2UgIV8uaXNBcnJheSh2YWx1ZSk6XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgIV8uaXNTdHJpbmcodmFsdWUpOlxuICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiAhKF8uaXNFbXB0eSh2YWx1ZSkpICYmIF8uZXZlcnkodmFsdWUsIChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdvcHRpb25fJyArIGludDJDaGFyKGkpKTtcbiAgICAgICAgfSksIHRoaXMpO1xuICAgICAgfSxcbiAgICAgIG1lc3NhZ2U6ICfmraPnoa7nrZTmoYjorr7nva7lh7rplJnvvIzms6jmhI/lr7nlupTnmoTpgInpobnmmK/lkKborr7nva7kuobnrZTmoYgnXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvbjtcblxufSkoQmFzZU1vZGVsKTtcblxuUXVlc3Rpb25zID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1ZXN0aW9ucywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb25zKCkge1xuICAgIHJldHVybiBRdWVzdGlvbnMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWVzdGlvbnMucHJvdG90eXBlLnVybCA9ICcvYXBpL3YxL3F1ZXN0aW9uLyc7XG5cbiAgUXVlc3Rpb25zLnByb3RvdHlwZS5tb2RlbCA9IFF1ZXN0aW9uO1xuXG4gIFF1ZXN0aW9ucy5wcm90b3R5cGUuc3RhdGUgPSB7fTtcblxuICBRdWVzdGlvbnMucHJvdG90eXBlLmZldGNoID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBkYXRhO1xuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgb3B0aW9ucyk7XG4gICAgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICBvcHRpb25zLmRhdGEgPSBfLmV4dGVuZCh7fSwgdGhpcy5zdGF0ZSwgZGF0YSk7XG4gICAgcmV0dXJuIFF1ZXN0aW9ucy5fX3N1cGVyX18uZmV0Y2guY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25zO1xuXG59KShCYXNlQ29sbGVjdGlvbik7XG5cblF1ZXN0aW9uVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvblZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uVmlldygpIHtcbiAgICByZXR1cm4gUXVlc3Rpb25WaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS50YWdOYW1lID0gJ3RyJztcblxuICBRdWVzdGlvblZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL3F1ZXN0aW9uLXJvdycpO1xuXG4gIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUuZXZlbnRzID0ge1xuICAgICdjbGljayAjZGVsZXRlJzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbC5kZXN0cm95KCk7XG4gICAgfVxuICB9O1xuXG4gIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJzeW5jXCIsIHRoaXMucmVuZGVyKTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcImRlc3Ryb3lcIiwgdGhpcy5yZW1vdmUpO1xuICB9O1xuXG4gIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvcnJlY3QsIGRhdGE7XG4gICAgZGF0YSA9IHRoaXMubW9kZWwudG9KU09OKCk7XG4gICAgY29ycmVjdCA9IGRhdGFbJ2NvcnJlY3Rfb3B0aW9uJ10uc3BsaXQoJywnKTtcbiAgICBkYXRhWydjb3JyZWN0X29wdGlvbiddID0gXy5tYXAoY29ycmVjdCwgaW50MkNoYXIpLmpvaW4oKTtcbiAgICBkYXRhWyd0eXBlJ10gPSAoZnVuY3Rpb24oKSB7XG4gICAgICBzd2l0Y2ggKGRhdGFbJ3R5cGUnXSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgcmV0dXJuICfljZXpgIknO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgcmV0dXJuICflpJrpgIknO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiAn5aSa6YCJJztcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZShkYXRhKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXN0aW9uVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cblF1ZXN0aW9uc1ZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb25zVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb25zVmlldygpIHtcbiAgICByZXR1cm4gUXVlc3Rpb25zVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9uc1ZpZXcucHJvdG90eXBlLnJvdyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgcmV0dXJuIG5ldyBRdWVzdGlvblZpZXcoe1xuICAgICAgbW9kZWw6IG1vZGVsXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXN0aW9uc1ZpZXc7XG5cbn0pKFRhYmxlVmlldyk7XG5cblF1ZXN0aW9uTW9kYWxWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1ZXN0aW9uTW9kYWxWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvbk1vZGFsVmlldygpIHtcbiAgICByZXR1cm4gUXVlc3Rpb25Nb2RhbFZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWVzdGlvbk1vZGFsVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvcXVlc3Rpb24tbW9kYWwnKTtcblxuICBRdWVzdGlvbk1vZGFsVmlldy5wcm90b3R5cGUuYmluZGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgX2JpbmRpbmdzLCBjb2RlLCBqLCBsZW4sIHJlZjtcbiAgICBfYmluZGluZ3MgPSB7XG4gICAgICAnW25hbWU9Y29udGVudF0nOiAnY29udGVudCcsXG4gICAgICAnW25hbWU9dHlwZV0nOiB7XG4gICAgICAgIG9ic2VydmU6ICd0eXBlJyxcbiAgICAgICAgc2VsZWN0T3B0aW9uczoge1xuICAgICAgICAgIGNvbGxlY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAn5Y2V6YCJJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogMVxuICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICflpJrpgIknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZXRPcHRpb25zOiB7XG4gICAgICAgICAgc2lsZW50OiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ1tuYW1lPWNvcnJlY3Rfb3B0aW9uXSc6IHtcbiAgICAgICAgb2JzZXJ2ZTogJ2NvcnJlY3Rfb3B0aW9uJyxcbiAgICAgICAgb25HZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlLnNwbGl0KCcsJyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uU2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuam9pbignLCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZWYgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJ107XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBjb2RlID0gcmVmW2pdO1xuICAgICAgX2JpbmRpbmdzW1wiW25hbWU9b3B0aW9uX1wiICsgY29kZSArIFwiXVwiXSA9ICdvcHRpb25fJyArIGNvZGU7XG4gICAgfVxuICAgIHJldHVybiBfYmluZGluZ3M7XG4gIH07XG5cbiAgUXVlc3Rpb25Nb2RhbFZpZXcucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihlKSB7XG4gICAgUXVlc3Rpb25Nb2RhbFZpZXcuX19zdXBlcl9fLnNob3cuY2FsbCh0aGlzLCBlKTtcbiAgICBpZiAodGhpcy5tb2RlbC5pc05ldygpKSB7XG4gICAgICB0aGlzLm1vZGVsLnNldCgnYm9vaycsIHRoaXMuY29sbGVjdGlvbi5zdGF0ZS5ib29rKTtcbiAgICB9XG4gICAgdGhpcy5jaGFuZ2VUeXBlKHRoaXMubW9kZWwsIHRoaXMubW9kZWwuZ2V0KCd0eXBlJykpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsIFwiY2hhbmdlOnR5cGVcIiwgdGhpcy5jaGFuZ2VUeXBlKTtcbiAgfTtcblxuICBRdWVzdGlvbk1vZGFsVmlldy5wcm90b3R5cGUuY2hhbmdlVHlwZSA9IGZ1bmN0aW9uKG1vZGVsLCB2YWx1ZSwgb3B0aW9ucykge1xuICAgIHZhciBjdXJWYWwsIHR5cGU7XG4gICAgdHlwZSA9IHZhbHVlID09PSAxID8gJ3JhZGlvJyA6ICdjaGVja2JveCc7XG4gICAgY3VyVmFsID0gbW9kZWwuZ2V0KCdjb3JyZWN0X29wdGlvbicpO1xuICAgIGlmICh0eXBlID09PSAncmFkaW8nICYmIGN1clZhbCkge1xuICAgICAgbW9kZWwuc2V0KCdjb3JyZWN0X29wdGlvbicsIGN1clZhbFswXSk7XG4gICAgfVxuICAgIHRoaXMuJCgnaW5wdXRbbmFtZT1jb3JyZWN0X29wdGlvbl0nKS5wcm9wKCd0eXBlJywgdHlwZSk7XG4gICAgcmV0dXJuIHRoaXMuc3RpY2tpdCgpO1xuICB9O1xuXG4gIFF1ZXN0aW9uTW9kYWxWaWV3LnByb3RvdHlwZS5vbkludmFsaWRGaWVsZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBlcnJvcnMsIG1vZGVsKSB7XG4gICAgdmFyIGVycm9yLCBmaWVsZCwgZ3JvdXAsIGosIGxlbjtcbiAgICBpZiAobmFtZSAhPT0gJ2NvcnJlY3Rfb3B0aW9uJykge1xuICAgICAgcmV0dXJuIFF1ZXN0aW9uTW9kYWxWaWV3Ll9fc3VwZXJfXy5vbkludmFsaWRGaWVsZC5jYWxsKHRoaXMsIG5hbWUsIHZhbHVlLCBlcnJvcnMsIG1vZGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmllbGQgPSB0aGlzLiQoXCJbbmFtZT1cIiArIG5hbWUgKyBcIl1cIik7XG4gICAgICBncm91cCA9IGZpZWxkLmNsb3Nlc3QoJy5mb3JtLWdyb3VwJyk7XG4gICAgICBncm91cC5maW5kKCcuaGVscC1ibG9jaycpLnJlbW92ZSgpO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gZXJyb3JzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3JzW2pdO1xuICAgICAgICBncm91cC5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdoZWxwLWJsb2NrIGNvbC1zbS1vZmZzZXQtMic+XCIgKyBlcnJvciArIFwiPC9kaXY+XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdyb3VwLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXN0aW9uTW9kYWxWaWV3O1xuXG59KShNb2RhbFZpZXcpO1xuXG5RdWVzdGlvbkxpc3RQYW5lbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb25MaXN0UGFuZWxWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvbkxpc3RQYW5lbFZpZXcoKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9uTGlzdFBhbmVsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9uTGlzdFBhbmVsVmlldy5wcm90b3R5cGUuZXZlbnRzID0ge1xuICAgICdjaGFuZ2UgI2Jvb2snOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uc3RhdGUuYm9vayA9IHRoaXMuJCgnI2Jvb2snKS52YWwoKTtcbiAgICB9LFxuICAgICdjbGljayAjbG9hZEJvb2snOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmV0Y2goe1xuICAgICAgICByZXNldDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvbkxpc3RQYW5lbFZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uUGFnZVZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb25QYWdlVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb25QYWdlVmlldygpIHtcbiAgICByZXR1cm4gUXVlc3Rpb25QYWdlVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9uUGFnZVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGJvb2tJZCkge1xuICAgIHZhciBwYWdlTmF2VmlldywgcGFuZWxWaWV3LCBxdWVzdGlvbk1vZGFsVmlldywgcXVlc3Rpb25zLCBxdWVzdGlvbnNWaWV3O1xuICAgIGlmICghYm9va0lkKSB7XG4gICAgICBib29rSWQgPSAkKCdmb3JtIHNlbGVjdFtuYW1lPWJvb2tdJykudmFsKCk7XG4gICAgfVxuICAgIHF1ZXN0aW9ucyA9IG5ldyBRdWVzdGlvbnM7XG4gICAgcXVlc3Rpb25zLnN0YXRlLmJvb2sgPSBib29rSWQ7XG4gICAgcGFuZWxWaWV3ID0gbmV3IFF1ZXN0aW9uTGlzdFBhbmVsVmlldyh7XG4gICAgICBlbDogJCgnLnRhYmxlLWNvbnRyb2wnKSxcbiAgICAgIGNvbGxlY3Rpb246IHF1ZXN0aW9uc1xuICAgIH0pO1xuICAgIHF1ZXN0aW9uc1ZpZXcgPSBuZXcgUXVlc3Rpb25zVmlldyh7XG4gICAgICBlbDogJCgnI3F1ZXN0aW9uLXRhYmxlLWNvbnRhaW5lcicpLFxuICAgICAgY29sbGVjdGlvbjogcXVlc3Rpb25zXG4gICAgfSk7XG4gICAgcGFnZU5hdlZpZXcgPSBuZXcgUGFnaW5hdGlvblZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogcXVlc3Rpb25zXG4gICAgfSk7XG4gICAgcXVlc3Rpb25zVmlldy4kZWwuYWZ0ZXIocGFnZU5hdlZpZXcucmVuZGVyKCkuJGVsKTtcbiAgICBxdWVzdGlvbk1vZGFsVmlldyA9IG5ldyBRdWVzdGlvbk1vZGFsVmlldyh7XG4gICAgICBpZDogJ3F1ZXN0aW9uTW9kYWxGb3JtJyxcbiAgICAgIGNvbGxlY3Rpb246IHF1ZXN0aW9uc1xuICAgIH0pO1xuICAgIHF1ZXN0aW9uTW9kYWxWaWV3LnJlbmRlcigpO1xuICAgIHF1ZXN0aW9ucy5mZXRjaCh7XG4gICAgICByZXNldDogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBRdWVzdGlvblBhZ2VWaWV3Ll9fc3VwZXJfXy5yZW5kZXIuY2FsbCh0aGlzKTtcbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25QYWdlVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBNb2RhbFZpZXcsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChNb2RhbFZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIE1vZGFsVmlldygpIHtcbiAgICByZXR1cm4gTW9kYWxWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgTW9kYWxWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAkKCcjJyArIHRoaXMuaWQpLnJlbW92ZSgpO1xuICAgICQoJ2JvZHknKS5hcHBlbmQodGhpcy50ZW1wbGF0ZSh7XG4gICAgICBpZDogdGhpcy5pZFxuICAgIH0pKTtcbiAgICB0aGlzLnNldEVsZW1lbnQoJCgnIycgKyB0aGlzLmlkKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgTW9kYWxWaWV3LnByb3RvdHlwZS5ldmVudHMgPSB7XG4gICAgJ3Nob3cuYnMubW9kYWwnOiAnc2hvdycsXG4gICAgJ2hpZGRlbi5icy5tb2RhbCc6ICdoaWRkZW4nLFxuICAgICdjbGljayBbdHlwZT1zdWJtaXRdJzogJ3NhdmUnXG4gIH07XG5cbiAgTW9kYWxWaWV3LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciBkYXRhO1xuICAgIGRhdGEgPSAkKGUucmVsYXRlZFRhcmdldCkuZGF0YSgpO1xuICAgIHRoaXMubW9kZWwgPSBkYXRhLmlkID8gdGhpcy5jb2xsZWN0aW9uLmdldChkYXRhLmlkKSA6IG5ldyB0aGlzLmNvbGxlY3Rpb24ubW9kZWw7XG4gICAgdGhpcy5zdGlja2l0KCk7XG4gICAgdGhpcy5iaW5kVmFsaWRhdGlvbigpO1xuICAgIGlmICghdGhpcy5tb2RlbC5pc05ldygpKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbC52YWxpZGF0ZSgpO1xuICAgIH1cbiAgfTtcblxuICBNb2RhbFZpZXcucHJvdG90eXBlLmhpZGRlbiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudW5zdGlja2l0KCk7XG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nKCk7XG4gICAgcmV0dXJuIGRlbGV0ZSB0aGlzLm1vZGVsO1xuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgeGhyO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB4aHIgPSB0aGlzLm1vZGVsLnNhdmUoKTtcbiAgICBpZiAoeGhyKSB7XG4gICAgICByZXR1cm4geGhyLnRoZW4oKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgX3RoaXMuY29sbGVjdGlvbi5hZGQoX3RoaXMubW9kZWwpO1xuICAgICAgICAgIHJldHVybiBfdGhpcy4kZWwubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKSk7XG4gICAgfVxuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUub25WYWxpZEZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIG1vZGVsKSB7XG4gICAgdmFyIGZpZWxkLCBncm91cDtcbiAgICBmaWVsZCA9IHRoaXMuJChcIltuYW1lPVwiICsgbmFtZSArIFwiXVwiKTtcbiAgICBncm91cCA9IGZpZWxkLmNsb3Nlc3QoJy5mb3JtLWdyb3VwJyk7XG4gICAgZ3JvdXAucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgIHJldHVybiBncm91cC5maW5kKCcuaGVscC1ibG9jaycpLnJlbW92ZSgpO1xuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUub25JbnZhbGlkRmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgZXJyb3JzLCBtb2RlbCkge1xuICAgIHZhciBlcnJvciwgZmllbGQsIGdyb3VwLCBpLCBsZW47XG4gICAgZmllbGQgPSB0aGlzLiQoXCJbbmFtZT1cIiArIG5hbWUgKyBcIl1cIik7XG4gICAgZ3JvdXAgPSBmaWVsZC5jbG9zZXN0KCcuZm9ybS1ncm91cCcpO1xuICAgIGdyb3VwLmZpbmQoJy5oZWxwLWJsb2NrJykucmVtb3ZlKCk7XG4gICAgZm9yIChpID0gMCwgbGVuID0gZXJyb3JzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBlcnJvciA9IGVycm9yc1tpXTtcbiAgICAgIGZpZWxkLmFmdGVyKFwiPGRpdiBjbGFzcz0naGVscC1ibG9jayc+XCIgKyBlcnJvciArIFwiPC9kaXY+XCIpO1xuICAgIH1cbiAgICByZXR1cm4gZ3JvdXAuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICB9O1xuXG4gIHJldHVybiBNb2RhbFZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgUGFnaW5hdGlvblZpZXcsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2luYXRpb25WaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFBhZ2luYXRpb25WaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBQYWdpbmF0aW9uVmlldygpIHtcbiAgICByZXR1cm4gUGFnaW5hdGlvblZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUudGFnTmFtZSA9ICduYXYnO1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS5jbGFzc05hbWUgPSAncGFnZS1uYXYnO1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9wYWdlLW5hdicpO1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS5ldmVudHMgPSB7XG4gICAgJ2NsaWNrIGFbZGF0YS1pZF0nOiAnbG9hZFBhZ2UnXG4gIH07XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICdyZXNldCcsIHRoaXMucmVuZGVyKTtcbiAgfTtcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuY29sbGVjdGlvbi5tZXRhKSB7XG4gICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUodGhpcy5jb2xsZWN0aW9uLm1ldGEpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLmxvYWRQYWdlID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciBkYXRhO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBkYXRhID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoKTtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZldGNoKHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcGFnZTogZGF0YS5pZFxuICAgICAgfSxcbiAgICAgIHJlc2V0OiB0cnVlXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFBhZ2luYXRpb25WaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIFRhYmxlVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGVWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFRhYmxlVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gVGFibGVWaWV3KCkge1xuICAgIHJldHVybiBUYWJsZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBUYWJsZVZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ2FkZCcsIHRoaXMuYWRkKTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICdyZXNldCcsIHRoaXMucmVuZGVyKTtcbiAgfTtcblxuICBUYWJsZVZpZXcucHJvdG90eXBlLnJvdyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgfTtcblxuICBUYWJsZVZpZXcucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgdmFyIHJvdztcbiAgICByb3cgPSB0aGlzLnJvdyhtb2RlbCk7XG4gICAgcm93LiRlbC5hZGRDbGFzcygnc3VjY2VzcycpO1xuICAgIHJldHVybiB0aGlzLiQoJ3RhYmxlIHRib2R5JykucHJlcGVuZChyb3cucmVuZGVyKCkuJGVsKTtcbiAgfTtcblxuICBUYWJsZVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgdGJvZHk7XG4gICAgdGJvZHkgPSB0aGlzLiQoJ3RhYmxlIHRib2R5Jyk7XG4gICAgdGJvZHkuZW1wdHkoKTtcbiAgICBjb2xsZWN0aW9uLmVhY2goKGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICByZXR1cm4gdGJvZHkuYXBwZW5kKHRoaXMucm93KG1vZGVsKS5yZW5kZXIoKS4kZWwpO1xuICAgIH0pLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gVGFibGVWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoYm9vaywgY2hhbmNlcywgZW5kX2F0LCBpZCwgaW5mb19maWVsZF8yLCBpbmZvX2ZpZWxkXzMsIG11bHRpLCBtdWx0aV9wb2ludHMsIG5hbWUsIHNpbmdsZSwgc2luZ2xlX3BvaW50cywgc3RhcnRfYXQsIHN0YXR1cywgdGltZV9saW1pdCwgdHlwZSwgdXJsLCB1c2VyLCB3ZWxjb21lKSB7XG5idWYucHVzaChcIjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGlkKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG5hbWUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gYm9vay50aXRsZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB0eXBlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGNoYW5jZXMpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdGltZV9saW1pdCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBzaW5nbGUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gbXVsdGkpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gc2luZ2xlX3BvaW50cykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBtdWx0aV9wb2ludHMpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gc3RhdHVzKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHN0YXJ0X2F0KSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGVuZF9hdCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB3ZWxjb21lKSA/IFwiXCIgOiBqYWRlX2ludGVycCkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gaW5mb19maWVsZF8zKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGluZm9fZmllbGRfMikgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpbmZvX2ZpZWxkXzMpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPjxhXCIgKyAoamFkZS5hdHRyKFwiaHJlZlwiLCB1cmwsIHRydWUsIGZhbHNlKSkgKyBcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHVybCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9hPjwvdGQ+PHRkPjxhXCIgKyAoamFkZS5hdHRyKFwiaHJlZlwiLCBcIi9hY3Rpdml0aWVzL2VkaXQvXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYnRuLXhzXFxcIj7nvJbovpE8L2E+PC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB1c2VyLnVzZXJuYW1lKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPlwiKTt9LmNhbGwodGhpcyxcImJvb2tcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmJvb2s6dHlwZW9mIGJvb2shPT1cInVuZGVmaW5lZFwiP2Jvb2s6dW5kZWZpbmVkLFwiY2hhbmNlc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguY2hhbmNlczp0eXBlb2YgY2hhbmNlcyE9PVwidW5kZWZpbmVkXCI/Y2hhbmNlczp1bmRlZmluZWQsXCJlbmRfYXRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmVuZF9hdDp0eXBlb2YgZW5kX2F0IT09XCJ1bmRlZmluZWRcIj9lbmRfYXQ6dW5kZWZpbmVkLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkLFwiaW5mb19maWVsZF8yXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pbmZvX2ZpZWxkXzI6dHlwZW9mIGluZm9fZmllbGRfMiE9PVwidW5kZWZpbmVkXCI/aW5mb19maWVsZF8yOnVuZGVmaW5lZCxcImluZm9fZmllbGRfM1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaW5mb19maWVsZF8zOnR5cGVvZiBpbmZvX2ZpZWxkXzMhPT1cInVuZGVmaW5lZFwiP2luZm9fZmllbGRfMzp1bmRlZmluZWQsXCJtdWx0aVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubXVsdGk6dHlwZW9mIG11bHRpIT09XCJ1bmRlZmluZWRcIj9tdWx0aTp1bmRlZmluZWQsXCJtdWx0aV9wb2ludHNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm11bHRpX3BvaW50czp0eXBlb2YgbXVsdGlfcG9pbnRzIT09XCJ1bmRlZmluZWRcIj9tdWx0aV9wb2ludHM6dW5kZWZpbmVkLFwibmFtZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubmFtZTp0eXBlb2YgbmFtZSE9PVwidW5kZWZpbmVkXCI/bmFtZTp1bmRlZmluZWQsXCJzaW5nbGVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnNpbmdsZTp0eXBlb2Ygc2luZ2xlIT09XCJ1bmRlZmluZWRcIj9zaW5nbGU6dW5kZWZpbmVkLFwic2luZ2xlX3BvaW50c1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguc2luZ2xlX3BvaW50czp0eXBlb2Ygc2luZ2xlX3BvaW50cyE9PVwidW5kZWZpbmVkXCI/c2luZ2xlX3BvaW50czp1bmRlZmluZWQsXCJzdGFydF9hdFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguc3RhcnRfYXQ6dHlwZW9mIHN0YXJ0X2F0IT09XCJ1bmRlZmluZWRcIj9zdGFydF9hdDp1bmRlZmluZWQsXCJzdGF0dXNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnN0YXR1czp0eXBlb2Ygc3RhdHVzIT09XCJ1bmRlZmluZWRcIj9zdGF0dXM6dW5kZWZpbmVkLFwidGltZV9saW1pdFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudGltZV9saW1pdDp0eXBlb2YgdGltZV9saW1pdCE9PVwidW5kZWZpbmVkXCI/dGltZV9saW1pdDp1bmRlZmluZWQsXCJ0eXBlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC50eXBlOnR5cGVvZiB0eXBlIT09XCJ1bmRlZmluZWRcIj90eXBlOnVuZGVmaW5lZCxcInVybFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudXJsOnR5cGVvZiB1cmwhPT1cInVuZGVmaW5lZFwiP3VybDp1bmRlZmluZWQsXCJ1c2VyXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51c2VyOnR5cGVvZiB1c2VyIT09XCJ1bmRlZmluZWRcIj91c2VyOnVuZGVmaW5lZCxcIndlbGNvbWVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLndlbGNvbWU6dHlwZW9mIHdlbGNvbWUhPT1cInVuZGVmaW5lZFwiP3dlbGNvbWU6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaWQpIHtcbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImlkXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIHRhYmluZGV4PVxcXCItMVxcXCIgcm9sZT1cXFwiZGlhbG9nXFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcImJvb2tGb3JtTGFiZWxcXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwibW9kYWwgZmFkZVxcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtZGlhbG9nXFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1jb250ZW50XFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1oZWFkZXJcXFwiPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBjbGFzcz1cXFwiY2xvc2VcXFwiPjxzcGFuIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj4mdGltZXM7PC9zcGFuPjxzcGFuIGNsYXNzPVxcXCJzci1vbmx5XFxcIj7lhbPpl608L3NwYW4+PC9idXR0b24+PGg0IGlkPVxcXCJib29rRm9ybUxhYmVsXFxcIiBjbGFzcz1cXFwibW9kYWwtdGl0bGVcXFwiPui+k+WFpemimOW6k+S/oeaBrzwvaDQ+PC9kaXY+PGRpdiBjbGFzcz1cXFwibW9kYWwtYm9keVxcXCI+PGZvcm0+PGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+PGxhYmVsIGZvcj1cXFwidGl0bGVcXFwiIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIj7popjlupPlkI08L2xhYmVsPjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBpZD1cXFwidGl0bGVcXFwiIHBsYWNlaG9sZGVyPVxcXCLpopjlupPlkI1cXFwiIG5hbWU9XFxcInRpdGxlXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIi8+PC9kaXY+PC9mb3JtPjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtZGlzbWlzcz1cXFwibW9kYWxcXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiPuWPlua2iDwvYnV0dG9uPjxidXR0b24gaWQ9XFxcInNhdmVcXFwiIHR5cGU9XFxcInN1Ym1pdFxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCI+5L+d5a2YPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoYnV0dG9uLCBpZCwgdGl0bGUsIHVzZXIpIHtcbmJ1Zi5wdXNoKFwiPHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdGl0bGUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdXNlci51c2VybmFtZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+PGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsICcvcXVpemJvb2tzLycgKyAoaWQpICsgJy9xdWVzdGlvbnMnLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBidG4teHNcXFwiPuafpeecizwvYT48YVwiICsgKGphZGUuYXR0cihcInR5cGVcIiwgYnV0dG9uLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgaWQsIHRydWUsIGZhbHNlKSkgKyBcIiBkYXRhLXRvZ2dsZT1cXFwibW9kYWxcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjYm9va01vZGFsRm9ybVxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBidG4teHNcXFwiPue8lui+kTwvYT48L3RkPlwiKTt9LmNhbGwodGhpcyxcImJ1dHRvblwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguYnV0dG9uOnR5cGVvZiBidXR0b24hPT1cInVuZGVmaW5lZFwiP2J1dHRvbjp1bmRlZmluZWQsXCJpZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaWQ6dHlwZW9mIGlkIT09XCJ1bmRlZmluZWRcIj9pZDp1bmRlZmluZWQsXCJ0aXRsZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudGl0bGU6dHlwZW9mIHRpdGxlIT09XCJ1bmRlZmluZWRcIj90aXRsZTp1bmRlZmluZWQsXCJ1c2VyXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51c2VyOnR5cGVvZiB1c2VyIT09XCJ1bmRlZmluZWRcIj91c2VyOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKE1hdGgsIGVuZCwgcGFnZSwgcGFnZXMsIHN0YXJ0KSB7XG5zdGFydCA9IE1hdGgubWF4KDEsIHBhZ2UgLSA1KVxuZW5kID0gTWF0aC5taW4ocGFnZXMsIHBhZ2UgKyA1KVxuYnVmLnB1c2goXCI8dWwgY2xhc3M9XFxcInBhZ2luYXRpb25cXFwiPjxsaVwiICsgKGphZGUuY2xzKFsocGFnZSA9PSAxKSA/ICdkaXNhYmxlZCcgOiAnJ10sIFt0cnVlXSkpICsgXCI+PGEgaHJlZj1cXFwiI1xcXCIgYXJpYS1sYWJlbD1cXFwiU3RhcnRcXFwiIGRhdGEtaWQ9JzEnPjxzcGFuIGFyaWEtaGlkZGVuPVxcXCJhcmlhLWhpZGRlblxcXCI+JmxhcXVvOzwvc3Bhbj48L2E+PC9saT5cIik7XG52YXIgaSA9IHN0YXJ0XG53aGlsZSAoaSA8IHBhZ2UpXG57XG5idWYucHVzaChcIjxsaT48YSBocmVmPVxcXCIjXFxcIlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgaSwgdHJ1ZSwgZmFsc2UpKSArIFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gaSsrKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2E+PC9saT5cIik7XG59XG5idWYucHVzaChcIjxsaVwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgcGFnZSwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJhY3RpdmVcXFwiPjxhIGhyZWY9XFxcIiNcXFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gcGFnZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9hPjwvbGk+XCIpO1xudmFyIGkgPSBwYWdlICsgMVxud2hpbGUgKGkgPD0gZW5kKVxue1xuYnVmLnB1c2goXCI8bGk+PGEgaHJlZj1cXFwiI1xcXCJcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIGksIHRydWUsIGZhbHNlKSkgKyBcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGkrKykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9hPjwvbGk+XCIpO1xufVxuYnVmLnB1c2goXCI8bGlcIiArIChqYWRlLmNscyhbKHBhZ2UgPT0gcGFnZXMpID8gJ2Rpc2FibGVkJyA6ICcnXSwgW3RydWVdKSkgKyBcIj48YSBocmVmPVxcXCIjXFxcIiBhcmlhLWxhYmVsPVxcXCJFbmRcXFwiXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBwYWdlcywgdHJ1ZSwgZmFsc2UpKSArIFwiPjxzcGFuIGFyaWEtaGlkZGVuPVxcXCJhcmlhLWhpZGRlblxcXCI+JnJhcXVvOzwvc3Bhbj48L2E+PC9saT48L3VsPlwiKTt9LmNhbGwodGhpcyxcIk1hdGhcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLk1hdGg6dHlwZW9mIE1hdGghPT1cInVuZGVmaW5lZFwiP01hdGg6dW5kZWZpbmVkLFwiZW5kXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5lbmQ6dHlwZW9mIGVuZCE9PVwidW5kZWZpbmVkXCI/ZW5kOnVuZGVmaW5lZCxcInBhZ2VcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnBhZ2U6dHlwZW9mIHBhZ2UhPT1cInVuZGVmaW5lZFwiP3BhZ2U6dW5kZWZpbmVkLFwicGFnZXNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnBhZ2VzOnR5cGVvZiBwYWdlcyE9PVwidW5kZWZpbmVkXCI/cGFnZXM6dW5kZWZpbmVkLFwic3RhcnRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnN0YXJ0OnR5cGVvZiBzdGFydCE9PVwidW5kZWZpbmVkXCI/c3RhcnQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaWQsIHVuZGVmaW5lZCkge1xuamFkZV9taXhpbnNbXCJ0ZXh0YXJlYVwiXSA9IGphZGVfaW50ZXJwID0gZnVuY3Rpb24oaWQsbGFiZWwsbmFtZSl7XG52YXIgYmxvY2sgPSAodGhpcyAmJiB0aGlzLmJsb2NrKSwgYXR0cmlidXRlcyA9ICh0aGlzICYmIHRoaXMuYXR0cmlidXRlcykgfHwge307XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPjxsYWJlbFwiICsgKGphZGUuYXR0cihcImZvclwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiY29sLXNtLTIgY29udHJvbC1sYWJlbFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbGFiZWwpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvbGFiZWw+PGRpdiBjbGFzcz1cXFwiY29sLXNtLTEwXFxcIj48dGV4dGFyZWFcIiArIChqYWRlLmF0dHIoXCJpZFwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwibmFtZVwiLCBcIlwiICsgKG5hbWUpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIHJvdz1cXFwiNFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCI+PC90ZXh0YXJlYT48L2Rpdj48L2Rpdj5cIik7XG59O1xuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5hdHRyKFwiaWRcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgdGFiaW5kZXg9XFxcIi0xXFxcIiByb2xlPVxcXCJkaWFsb2dcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwicXVlc3Rpb25Gb3JtTGFiZWxcXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwibW9kYWwgZmFkZVxcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtZGlhbG9nXFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1jb250ZW50XFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1oZWFkZXJcXFwiPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBjbGFzcz1cXFwiY2xvc2VcXFwiPjxzcGFuIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj4mdGltZXM7PC9zcGFuPjxzcGFuIGNsYXNzPVxcXCJzci1vbmx5XFxcIj7lhbPpl608L3NwYW4+PC9idXR0b24+PGg0IGlkPVxcXCJxdWVzdGlvbkZvcm1MYWJlbFxcXCIgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIj7ovpPlhaXpl67popjor6bnu4bkv6Hmga88L2g0PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1vZGFsLWJvZHlcXFwiPjxmb3JtIGNsYXNzPVxcXCJmb3JtLWhvcml6b250YWxcXFwiPlwiKTtcbmphZGVfbWl4aW5zW1widGV4dGFyZWFcIl0oJ2NvbnRlbnQnLCAn6Zeu6aKY5YaF5a65JywgJ2NvbnRlbnQnKTtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+PGxhYmVsIGZvcj1cXFwidHlwZVxcXCIgY2xhc3M9XFxcImNvbC1zbS0yIGNvbnRyb2wtbGFiZWxcXFwiPumXrumimOWGheWuuTwvbGFiZWw+PGRpdiBjbGFzcz1cXFwiY29sLXNtLTEwXFxcIj48c2VsZWN0IGlkPVxcXCJ0eXBlXFxcIiByb3c9XFxcIjRcXFwiIG5hbWU9XFxcInR5cGVcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2wgdGV4dGFyZWFcXFwiPjwvc2VsZWN0PjwvZGl2PjwvZGl2PlwiKTtcbnZhciBvcHRpb25zID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRiddXG4vLyBpdGVyYXRlIG9wdGlvbnNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gb3B0aW9ucztcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiAkJG9iai5sZW5ndGgpIHtcblxuICAgIGZvciAodmFyICRpbmRleCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgJGluZGV4IDwgJCRsOyAkaW5kZXgrKykge1xuICAgICAgdmFyIG9wdGlvbiA9ICQkb2JqWyRpbmRleF07XG5cbmphZGVfbWl4aW5zW1widGV4dGFyZWFcIl0oJ29wdGlvbl8nICsgb3B0aW9uLCBcIumAiemhuVwiICsgb3B0aW9uLCAnb3B0aW9uXycgKyBvcHRpb24pO1xuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIHZhciAkJGwgPSAwO1xuICAgIGZvciAodmFyICRpbmRleCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7ICAgICAgdmFyIG9wdGlvbiA9ICQkb2JqWyRpbmRleF07XG5cbmphZGVfbWl4aW5zW1widGV4dGFyZWFcIl0oJ29wdGlvbl8nICsgb3B0aW9uLCBcIumAiemhuVwiICsgb3B0aW9uLCAnb3B0aW9uXycgKyBvcHRpb24pO1xuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPjxsYWJlbCBjbGFzcz1cXFwiY29sLXNtLTIgY29udHJvbC1sYWJlbFxcXCI+5q2j56Gu562U5qGIPC9sYWJlbD48ZGl2IGNsYXNzPVxcXCJjb2wtc20tMTBcXFwiPlwiKTtcbi8vIGl0ZXJhdGUgb3B0aW9uc1xuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBvcHRpb25zO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuXG4gICAgZm9yICh2YXIgaSA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgaSA8ICQkbDsgaSsrKSB7XG4gICAgICB2YXIgb3B0aW9uID0gJCRvYmpbaV07XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiY2hlY2tib3ggY29sLXhzLTYgY29sLXNtLTRcXFwiPjxsYWJlbD48aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIG5hbWU9XFxcImNvcnJlY3Rfb3B0aW9uXFxcIlwiICsgKGphZGUuYXR0cihcInZhbHVlXCIsIGkrMSwgdHJ1ZSwgZmFsc2UpKSArIFwiLz7pgInpoblcIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBvcHRpb24pID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvbGFiZWw+PC9kaXY+XCIpO1xuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIHZhciAkJGwgPSAwO1xuICAgIGZvciAodmFyIGkgaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBvcHRpb24gPSAkJG9ialtpXTtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJjaGVja2JveCBjb2wteHMtNiBjb2wtc20tNFxcXCI+PGxhYmVsPjxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgbmFtZT1cXFwiY29ycmVjdF9vcHRpb25cXFwiXCIgKyAoamFkZS5hdHRyKFwidmFsdWVcIiwgaSsxLCB0cnVlLCBmYWxzZSkpICsgXCIvPumAiemhuVwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IG9wdGlvbikgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9sYWJlbD48L2Rpdj5cIik7XG4gICAgfVxuXG4gIH1cbn0pLmNhbGwodGhpcyk7XG5cbmJ1Zi5wdXNoKFwiPC9kaXY+PC9kaXY+PC9mb3JtPjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtZGlzbWlzcz1cXFwibW9kYWxcXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiPuWPlua2iDwvYnV0dG9uPjxidXR0b24gdHlwZT1cXFwic3VibWl0XFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIj7kv53lrZg8L2J1dHRvbj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJpZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaWQ6dHlwZW9mIGlkIT09XCJ1bmRlZmluZWRcIj9pZDp1bmRlZmluZWQsXCJ1bmRlZmluZWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVuZGVmaW5lZDp0eXBlb2YgdW5kZWZpbmVkIT09XCJ1bmRlZmluZWRcIj91bmRlZmluZWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoYnV0dG9uLCBjb250ZW50LCBjb3JyZWN0X29wdGlvbiwgaWQsIG9wdGlvbl9BLCBvcHRpb25fQiwgb3B0aW9uX0MsIG9wdGlvbl9ELCBvcHRpb25fRSwgb3B0aW9uX0YsIHR5cGUpIHtcbmJ1Zi5wdXNoKFwiPHRkIGNsYXNzPVxcXCJjb250ZW50XFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGNvbnRlbnQpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdHlwZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBjb3JyZWN0X29wdGlvbikgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBvcHRpb25fQSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBvcHRpb25fQikgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBvcHRpb25fQykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBvcHRpb25fRCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBvcHRpb25fRSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBvcHRpb25fRikgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+PGFcIiArIChqYWRlLmF0dHIoXCJ0eXBlXCIsIGJ1dHRvbiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIGlkLCB0cnVlLCBmYWxzZSkpICsgXCIgZGF0YS10b2dnbGU9XFxcIm1vZGFsXFxcIiBkYXRhLXRhcmdldD1cXFwiI3F1ZXN0aW9uTW9kYWxGb3JtXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi14c1xcXCI+57yW6L6RPC9hPjxhIGlkPVxcXCJkZWxldGVcXFwiXCIgKyAoamFkZS5hdHRyKFwidHlwZVwiLCBidXR0b24sIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXFxcIj7liKDpmaQ8L2E+PC90ZD5cIik7fS5jYWxsKHRoaXMsXCJidXR0b25cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmJ1dHRvbjp0eXBlb2YgYnV0dG9uIT09XCJ1bmRlZmluZWRcIj9idXR0b246dW5kZWZpbmVkLFwiY29udGVudFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguY29udGVudDp0eXBlb2YgY29udGVudCE9PVwidW5kZWZpbmVkXCI/Y29udGVudDp1bmRlZmluZWQsXCJjb3JyZWN0X29wdGlvblwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguY29ycmVjdF9vcHRpb246dHlwZW9mIGNvcnJlY3Rfb3B0aW9uIT09XCJ1bmRlZmluZWRcIj9jb3JyZWN0X29wdGlvbjp1bmRlZmluZWQsXCJpZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaWQ6dHlwZW9mIGlkIT09XCJ1bmRlZmluZWRcIj9pZDp1bmRlZmluZWQsXCJvcHRpb25fQVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgub3B0aW9uX0E6dHlwZW9mIG9wdGlvbl9BIT09XCJ1bmRlZmluZWRcIj9vcHRpb25fQTp1bmRlZmluZWQsXCJvcHRpb25fQlwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgub3B0aW9uX0I6dHlwZW9mIG9wdGlvbl9CIT09XCJ1bmRlZmluZWRcIj9vcHRpb25fQjp1bmRlZmluZWQsXCJvcHRpb25fQ1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgub3B0aW9uX0M6dHlwZW9mIG9wdGlvbl9DIT09XCJ1bmRlZmluZWRcIj9vcHRpb25fQzp1bmRlZmluZWQsXCJvcHRpb25fRFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgub3B0aW9uX0Q6dHlwZW9mIG9wdGlvbl9EIT09XCJ1bmRlZmluZWRcIj9vcHRpb25fRDp1bmRlZmluZWQsXCJvcHRpb25fRVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgub3B0aW9uX0U6dHlwZW9mIG9wdGlvbl9FIT09XCJ1bmRlZmluZWRcIj9vcHRpb25fRTp1bmRlZmluZWQsXCJvcHRpb25fRlwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgub3B0aW9uX0Y6dHlwZW9mIG9wdGlvbl9GIT09XCJ1bmRlZmluZWRcIj9vcHRpb25fRjp1bmRlZmluZWQsXCJ0eXBlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC50eXBlOnR5cGVvZiB0eXBlIT09XCJ1bmRlZmluZWRcIj90eXBlOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGlkKSB7XG5qYWRlX21peGluc1tcImlucHV0XCJdID0gamFkZV9pbnRlcnAgPSBmdW5jdGlvbih0eXBlLGlkLHBsYWNlaG9sZGVyLGxhYmVsLG5hbWUpe1xudmFyIGJsb2NrID0gKHRoaXMgJiYgdGhpcy5ibG9jayksIGF0dHJpYnV0ZXMgPSAodGhpcyAmJiB0aGlzLmF0dHJpYnV0ZXMpIHx8IHt9O1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj48bGFiZWxcIiArIChqYWRlLmF0dHIoXCJmb3JcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImNvbC14cy0yIGNvbnRyb2wtbGFiZWxcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxhYmVsKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2xhYmVsPjxkaXYgY2xhc3M9XFxcImNvbC14cy0xMFxcXCI+PGlucHV0XCIgKyAoamFkZS5hdHRyKFwidHlwZVwiLCBcIlwiICsgKHR5cGUpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJpZFwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgXCJcIiArIChwbGFjZWhvbGRlcikgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcIm5hbWVcIiwgXCJcIiArIChuYW1lKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIi8+PC9kaXY+PC9kaXY+XCIpO1xufTtcbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImlkXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIHRhYmluZGV4PVxcXCItMVxcXCIgcm9sZT1cXFwiZGlhbG9nXFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcInVzZXJGb3JtTGFiZWxcXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwibW9kYWwgZmFkZVxcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtZGlhbG9nXFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1jb250ZW50XFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1oZWFkZXJcXFwiPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBjbGFzcz1cXFwiY2xvc2VcXFwiPjxzcGFuIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj4mdGltZXM7PC9zcGFuPjxzcGFuIGNsYXNzPVxcXCJzci1vbmx5XFxcIj7lhbPpl608L3NwYW4+PC9idXR0b24+PGg0IGlkPVxcXCJ1c2VyRm9ybUxhYmVsXFxcIiBjbGFzcz1cXFwibW9kYWwtdGl0bGVcXFwiPui+k+WFpeeUqOaIt+S/oeaBrzwvaDQ+PC9kaXY+PGRpdiBjbGFzcz1cXFwibW9kYWwtYm9keVxcXCI+PHJvdz48Zm9ybSBjbGFzcz1cXFwiZm9ybS1ob3Jpem9udGFsXFxcIj5cIik7XG5qYWRlX21peGluc1tcImlucHV0XCJdKCd0ZXh0JywgJ3VzZXJuYW1lJywgJ+eUqOaIt+WQjScsICfnlKjmiLflkI0nLCAndXNlcm5hbWUnKTtcbmphZGVfbWl4aW5zW1wiaW5wdXRcIl0oJ3Bhc3N3b3JkJywgJ3Bhc3N3b3JkJywgJ+WvhueggScsICflr4bnoIEnLCAncGFzc3dvcmQnKTtcbmJ1Zi5wdXNoKFwiPC9mb3JtPjwvcm93PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtZGlzbWlzcz1cXFwibW9kYWxcXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiPuWPlua2iDwvYnV0dG9uPjxidXR0b24gdHlwZT1cXFwic3VibWl0XFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIj7kv53lrZg8L2J1dHRvbj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJpZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaWQ6dHlwZW9mIGlkIT09XCJ1bmRlZmluZWRcIj9pZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChhY3RpdmUsIGFkbWluLCBpZCwgdXNlcm5hbWUpIHtcbmJ1Zi5wdXNoKFwiPHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gaWQpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdXNlcm5hbWUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiKTtcbmlmICggIWFkbWluKVxue1xuYnVmLnB1c2goXCI8YSB0eXBlPVxcXCJidXR0b25cXFwiXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBpZCwgdHJ1ZSwgZmFsc2UpKSArIFwiIGRhdGEtdG9nZ2xlPVxcXCJtb2RhbFxcXCIgZGF0YS10YXJnZXQ9XFxcIiN1c2VyTW9kYWxGb3JtXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1xcXCI+5L+u5pS55a+G56CBXCIpO1xuaWYgKCBhY3RpdmUpXG57XG5idWYucHVzaChcIjxhIGlkPVxcXCJkZWFjdGl2YXRlXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRhbmdlciBidG4teHNcXFwiPuWGu+e7k+W4kOWPtzwvYT5cIik7XG59XG5lbHNlXG57XG5idWYucHVzaChcIjxhIGlkPVxcXCJhY3RpdmF0ZVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi14c1xcXCI+5r+A5rS75biQ5Y+3PC9hPlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPC9hPlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPC90ZD5cIik7fS5jYWxsKHRoaXMsXCJhY3RpdmVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmFjdGl2ZTp0eXBlb2YgYWN0aXZlIT09XCJ1bmRlZmluZWRcIj9hY3RpdmU6dW5kZWZpbmVkLFwiYWRtaW5cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmFkbWluOnR5cGVvZiBhZG1pbiE9PVwidW5kZWZpbmVkXCI/YWRtaW46dW5kZWZpbmVkLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkLFwidXNlcm5hbWVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVzZXJuYW1lOnR5cGVvZiB1c2VybmFtZSE9PVwidW5kZWZpbmVkXCI/dXNlcm5hbWU6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuKGZ1bmN0aW9uKGYpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZSE9PVwidW5kZWZpbmVkXCIpe21vZHVsZS5leHBvcnRzPWYoKX1lbHNlIGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmKX1lbHNle3ZhciBnO2lmKHR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiKXtnPXdpbmRvd31lbHNlIGlmKHR5cGVvZiBnbG9iYWwhPT1cInVuZGVmaW5lZFwiKXtnPWdsb2JhbH1lbHNlIGlmKHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIil7Zz1zZWxmfWVsc2V7Zz10aGlzfWcuamFkZSA9IGYoKX19KShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcbiAqIHRvIHZhbHVlcyBpbiBvYmplY3QgYGJgLiBDbGFzc2VzIGFyZSBzcGVjaWFsLWNhc2VkXG4gKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7T2JqZWN0fSBhXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoYSwgYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBhdHRycyA9IGFbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRycyA9IG1lcmdlKGF0dHJzLCBhW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG4gIHZhciBhYyA9IGFbJ2NsYXNzJ107XG4gIHZhciBiYyA9IGJbJ2NsYXNzJ107XG5cbiAgaWYgKGFjIHx8IGJjKSB7XG4gICAgYWMgPSBhYyB8fCBbXTtcbiAgICBiYyA9IGJjIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhYykpIGFjID0gW2FjXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYmMpKSBiYyA9IFtiY107XG4gICAgYVsnY2xhc3MnXSA9IGFjLmNvbmNhdChiYykuZmlsdGVyKG51bGxzKTtcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGtleSAhPSAnY2xhc3MnKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG4vKipcbiAqIEZpbHRlciBudWxsIGB2YWxgcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG51bGxzKHZhbCkge1xuICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsICE9PSAnJztcbn1cblxuLyoqXG4gKiBqb2luIGFycmF5IGFzIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5qb2luQ2xhc3NlcyA9IGpvaW5DbGFzc2VzO1xuZnVuY3Rpb24gam9pbkNsYXNzZXModmFsKSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLm1hcChqb2luQ2xhc3NlcykgOlxuICAgICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpID8gT2JqZWN0LmtleXModmFsKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdmFsW2tleV07IH0pIDpcbiAgICBbdmFsXSkuZmlsdGVyKG51bGxzKS5qb2luKCcgJyk7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcbiAqIEBwYXJhbSB7QXJyYXkuPEJvb2xlYW4+fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xzID0gZnVuY3Rpb24gY2xzKGNsYXNzZXMsIGVzY2FwZWQpIHtcbiAgdmFyIGJ1ZiA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZXNjYXBlZCAmJiBlc2NhcGVkW2ldKSB7XG4gICAgICBidWYucHVzaChleHBvcnRzLmVzY2FwZShqb2luQ2xhc3NlcyhbY2xhc3Nlc1tpXV0pKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5wdXNoKGpvaW5DbGFzc2VzKGNsYXNzZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgdmFyIHRleHQgPSBqb2luQ2xhc3NlcyhidWYpO1xuICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gJyBjbGFzcz1cIicgKyB0ZXh0ICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cblxuZXhwb3J0cy5zdHlsZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh2YWwpLm1hcChmdW5jdGlvbiAoc3R5bGUpIHtcbiAgICAgIHJldHVybiBzdHlsZSArICc6JyArIHZhbFtzdHlsZV07XG4gICAgfSkuam9pbignOycpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbn07XG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxuICogQHBhcmFtIHtCb29sZWFufSB0ZXJzZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHIgPSBmdW5jdGlvbiBhdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgdmFsID0gZXhwb3J0cy5zdHlsZSh2YWwpO1xuICB9XG4gIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIHZhbCB8fCBudWxsID09IHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKDAgPT0ga2V5LmluZGV4T2YoJ2RhdGEnKSAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB7XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KHZhbCkuaW5kZXhPZignJicpICE9PSAtMSkge1xuICAgICAgY29uc29sZS53YXJuKCdTaW5jZSBKYWRlIDIuMC4wLCBhbXBlcnNhbmRzIChgJmApIGluIGRhdGEgYXR0cmlidXRlcyAnICtcbiAgICAgICAgICAgICAgICAgICAnd2lsbCBiZSBlc2NhcGVkIHRvIGAmYW1wO2AnKTtcbiAgICB9O1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgZWxpbWluYXRlIHRoZSBkb3VibGUgcXVvdGVzIGFyb3VuZCBkYXRlcyBpbiAnICtcbiAgICAgICAgICAgICAgICAgICAnSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArIFwiPSdcIiArIEpTT04uc3RyaW5naWZ5KHZhbCkucmVwbGFjZSgvJy9nLCAnJmFwb3M7JykgKyBcIidcIjtcbiAgfSBlbHNlIGlmIChlc2NhcGVkKSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBzdHJpbmdpZnkgZGF0ZXMgaW4gSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgZXhwb3J0cy5lc2NhcGUodmFsKSArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBzdHJpbmdpZnkgZGF0ZXMgaW4gSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBmdW5jdGlvbiBhdHRycyhvYmosIHRlcnNlKXtcbiAgdmFyIGJ1ZiA9IFtdO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICAgICwgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09IGtleSkge1xuICAgICAgICBpZiAodmFsID0gam9pbkNsYXNzZXModmFsKSkge1xuICAgICAgICAgIGJ1Zi5wdXNoKCcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgamFkZV9lbmNvZGVfaHRtbF9ydWxlcyA9IHtcbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gICdcIic6ICcmcXVvdDsnXG59O1xudmFyIGphZGVfbWF0Y2hfaHRtbCA9IC9bJjw+XCJdL2c7XG5cbmZ1bmN0aW9uIGphZGVfZW5jb2RlX2NoYXIoYykge1xuICByZXR1cm4gamFkZV9lbmNvZGVfaHRtbF9ydWxlc1tjXSB8fCBjO1xufVxuXG5leHBvcnRzLmVzY2FwZSA9IGphZGVfZXNjYXBlO1xuZnVuY3Rpb24gamFkZV9lc2NhcGUoaHRtbCl7XG4gIHZhciByZXN1bHQgPSBTdHJpbmcoaHRtbCkucmVwbGFjZShqYWRlX21hdGNoX2h0bWwsIGphZGVfZW5jb2RlX2NoYXIpO1xuICBpZiAocmVzdWx0ID09PSAnJyArIGh0bWwpIHJldHVybiBodG1sO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIGphZGUgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lbm9cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IGZ1bmN0aW9uIHJldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9IHN0ciB8fCByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICB9IGNhdGNoIChleCkge1xuICAgIHJldGhyb3coZXJyLCBudWxsLCBsaW5lbm8pXG4gIH1cbiAgdmFyIGNvbnRleHQgPSAzXG4gICAgLCBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJylcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcbiAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdKYWRlJykgKyAnOicgKyBsaW5lbm9cbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XG4gIHRocm93IGVycjtcbn07XG5cbmV4cG9ydHMuRGVidWdJdGVtID0gZnVuY3Rpb24gRGVidWdJdGVtKGxpbmVubywgZmlsZW5hbWUpIHtcbiAgdGhpcy5saW5lbm8gPSBsaW5lbm87XG4gIHRoaXMuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbn1cblxufSx7XCJmc1wiOjJ9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblxufSx7fV19LHt9LFsxXSkoMSlcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiXX0=
