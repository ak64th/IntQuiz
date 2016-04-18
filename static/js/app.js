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

  UserModalView.prototype.template = require('templates/user-modal');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvYXBwL3NjcmlwdHMvYXBwLmNvZmZlZSIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsImFwcC9zY3JpcHRzL2FjY291bnQtcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9hY3Rpdml0eS1wYWdlLmNvZmZlZSIsImFwcC9zY3JpcHRzL2Jvb2stcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9kYXRhL2Jhc2UtY29sbGVjdGlvbi5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9kYXRhL2Jhc2UtbW9kZWwuY29mZmVlIiwiYXBwL3NjcmlwdHMvcXVlc3Rpb24tcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy92aWV3cy9tb2RhbC12aWV3LmNvZmZlZSIsImFwcC9zY3JpcHRzL3ZpZXdzL3BhZ2luYXRpb24tdmlldy5jb2ZmZWUiLCJhcHAvc2NyaXB0cy92aWV3cy90YWJsZS12aWV3LmNvZmZlZSIsImFwcC90ZW1wbGF0ZXMvYWN0aXZpdHktcm93LmphZGUiLCJhcHAvdGVtcGxhdGVzL2Jvb2stbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvYm9vay1yb3cuamFkZSIsImFwcC90ZW1wbGF0ZXMvcGFnZS1uYXYuamFkZSIsImFwcC90ZW1wbGF0ZXMvcXVlc3Rpb24tbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvcXVlc3Rpb24tcm93LmphZGUiLCJhcHAvdGVtcGxhdGVzL3VzZXItbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvdXNlci1yb3cuamFkZSIsIm5vZGVfbW9kdWxlcy9qYWRlL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEludEFwcDtcblxud2luZG93LkludEFwcCA9IEludEFwcCA9IHtcbiAgQWNjb3VudFBhZ2VWaWV3OiByZXF1aXJlKCdhY2NvdW50LXBhZ2UnKSxcbiAgQm9va1BhZ2VWaWV3OiByZXF1aXJlKCdib29rLXBhZ2UnKSxcbiAgUXVlc3Rpb25QYWdlVmlldzogcmVxdWlyZSgncXVlc3Rpb24tcGFnZScpLFxuICBBY3Rpdml0eVBhZ2VWaWV3OiByZXF1aXJlKCdhY3Rpdml0eS1wYWdlJylcbn07XG5cbiIsbnVsbCwidmFyIEFjY291bnRQYWdlVmlldywgQmFzZUNvbGxlY3Rpb24sIEJhc2VNb2RlbCwgTW9kYWxWaWV3LCBQYWdpbmF0aW9uVmlldywgVGFibGVWaWV3LCBVc2VyLCBVc2VyTW9kYWxWaWV3LCBVc2VyVmlldywgVXNlcnMsIFVzZXJzVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VNb2RlbCA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1tb2RlbCcpO1xuXG5CYXNlQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1jb2xsZWN0aW9uJyk7XG5cblRhYmxlVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3RhYmxlLXZpZXcnKTtcblxuUGFnaW5hdGlvblZpZXcgPSByZXF1aXJlKCd2aWV3cy9wYWdpbmF0aW9uLXZpZXcnKTtcblxuTW9kYWxWaWV3ID0gcmVxdWlyZSgndmlld3MvbW9kYWwtdmlldycpO1xuXG5Vc2VyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFVzZXIsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXIoKSB7XG4gICAgcmV0dXJuIFVzZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVc2VyLnByb3RvdHlwZS51cmxSb290ID0gJy9hcGkvdjEvdXNlcic7XG5cbiAgVXNlci5wcm90b3R5cGUuZGVmYXVsdHMgPSB7XG4gICAgdXNlcm5hbWU6ICcnLFxuICAgIHBhc3N3b3JkOiAnJ1xuICB9O1xuXG4gIFVzZXIucHJvdG90eXBlLnZhbGlkYXRpb24gPSB7XG4gICAgdXNlcm5hbWU6IHtcbiAgICAgIGJsYW5rOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2U6ICfnlKjmiLflkI3kuI3og73kuLrnqbonXG4gICAgfSxcbiAgICBwYXNzd29yZDoge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgbWluTGVuZ3RoOiA2LFxuICAgICAgbWVzc2FnZTogJ+WvhueggeS4jeiDveWwkeS6jjbkvY0nXG4gICAgfVxuICB9O1xuXG4gIFVzZXIucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF0dHJzO1xuICAgIGF0dHJzID0ge1xuICAgICAgYWN0aXZlOiB0cnVlXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5zYXZlKGF0dHJzLCB7XG4gICAgICBhdHRyczogYXR0cnNcbiAgICB9KTtcbiAgfTtcblxuICBVc2VyLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF0dHJzO1xuICAgIGF0dHJzID0ge1xuICAgICAgYWN0aXZlOiBmYWxzZVxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuc2F2ZShhdHRycywge1xuICAgICAgYXR0cnM6IGF0dHJzXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFVzZXI7XG5cbn0pKEJhc2VNb2RlbCk7XG5cblVzZXJzID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFVzZXJzLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBVc2VycygpIHtcbiAgICByZXR1cm4gVXNlcnMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVc2Vycy5wcm90b3R5cGUudXJsID0gJy9hcGkvdjEvdXNlcic7XG5cbiAgVXNlcnMucHJvdG90eXBlLm1vZGVsID0gVXNlcjtcblxuICByZXR1cm4gVXNlcnM7XG5cbn0pKEJhc2VDb2xsZWN0aW9uKTtcblxuVXNlclZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlclZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJWaWV3KCkge1xuICAgIHJldHVybiBVc2VyVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS50YWdOYW1lID0gJ3RyJztcblxuICBVc2VyVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvdXNlci1yb3cnKTtcblxuICBVc2VyVmlldy5wcm90b3R5cGUuZXZlbnRzID0ge1xuICAgICdjbGljayAjZGVhY3RpdmF0ZSc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZGVhY3RpdmF0ZSgpO1xuICAgIH0sXG4gICAgJ2NsaWNrICNhY3RpdmF0ZSc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWwuYWN0aXZhdGUoKTtcbiAgICB9XG4gIH07XG5cbiAgVXNlclZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsIFwic3luY1wiLCB0aGlzLnJlbmRlcik7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJkZXN0cm95XCIsIHRoaXMucmVtb3ZlKTtcbiAgfTtcblxuICBVc2VyVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwudG9KU09OKCkpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gVXNlclZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG5Vc2VyTW9kYWxWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFVzZXJNb2RhbFZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJNb2RhbFZpZXcoKSB7XG4gICAgcmV0dXJuIFVzZXJNb2RhbFZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVc2VyTW9kYWxWaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy91c2VyLW1vZGFsJyk7XG5cbiAgVXNlck1vZGFsVmlldy5wcm90b3R5cGUuYmluZGluZ3MgPSB7XG4gICAgJyN1c2VybmFtZSc6ICd1c2VybmFtZScsXG4gICAgJyNwYXNzd29yZCc6ICdwYXNzd29yZCdcbiAgfTtcblxuICByZXR1cm4gVXNlck1vZGFsVmlldztcblxufSkoTW9kYWxWaWV3KTtcblxuVXNlcnNWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFVzZXJzVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gVXNlcnNWaWV3KCkge1xuICAgIHJldHVybiBVc2Vyc1ZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVc2Vyc1ZpZXcucHJvdG90eXBlLnJvdyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgcmV0dXJuIG5ldyBVc2VyVmlldyh7XG4gICAgICBtb2RlbDogbW9kZWxcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gVXNlcnNWaWV3O1xuXG59KShUYWJsZVZpZXcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFjY291bnRQYWdlVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChBY2NvdW50UGFnZVZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFjY291bnRQYWdlVmlldygpIHtcbiAgICByZXR1cm4gQWNjb3VudFBhZ2VWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQWNjb3VudFBhZ2VWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFnZU5hdlZpZXcsIHVzZXJNb2RhbFZpZXcsIHVzZXJzLCB1c2Vyc1ZpZXc7XG4gICAgdXNlcnMgPSBuZXcgVXNlcnM7XG4gICAgdXNlcnNWaWV3ID0gbmV3IFVzZXJzVmlldyh7XG4gICAgICBlbDogJCgnLnRhYmxlLWNvbnRhaW5lcicpLFxuICAgICAgY29sbGVjdGlvbjogdXNlcnNcbiAgICB9KTtcbiAgICBwYWdlTmF2VmlldyA9IG5ldyBQYWdpbmF0aW9uVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiB1c2Vyc1xuICAgIH0pO1xuICAgIHVzZXJzVmlldy4kZWwuYWZ0ZXIocGFnZU5hdlZpZXcucmVuZGVyKCkuJGVsKTtcbiAgICB1c2VyTW9kYWxWaWV3ID0gbmV3IFVzZXJNb2RhbFZpZXcoe1xuICAgICAgaWQ6ICd1c2VyTW9kYWxGb3JtJyxcbiAgICAgIGNvbGxlY3Rpb246IHVzZXJzXG4gICAgfSk7XG4gICAgdXNlck1vZGFsVmlldy5yZW5kZXIoKTtcbiAgICB1c2Vycy5mZXRjaCh7XG4gICAgICByZXNldDogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBBY2NvdW50UGFnZVZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgQWN0aXZpdGllcywgQWN0aXZpdGllc1ZpZXcsIEFjdGl2aXR5LCBBY3Rpdml0eVBhZ2VWaWV3LCBBY3Rpdml0eVZpZXcsIEJhc2VDb2xsZWN0aW9uLCBCYXNlTW9kZWwsIERBVEVUSU1FX0ZPUk1BVCwgTW9kYWxWaWV3LCBQYWdpbmF0aW9uVmlldywgVGFibGVWaWV3LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZU1vZGVsID0gcmVxdWlyZSgnZGF0YS9iYXNlLW1vZGVsJyk7XG5cbkJhc2VDb2xsZWN0aW9uID0gcmVxdWlyZSgnZGF0YS9iYXNlLWNvbGxlY3Rpb24nKTtcblxuVGFibGVWaWV3ID0gcmVxdWlyZSgndmlld3MvdGFibGUtdmlldycpO1xuXG5QYWdpbmF0aW9uVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3BhZ2luYXRpb24tdmlldycpO1xuXG5Nb2RhbFZpZXcgPSByZXF1aXJlKCd2aWV3cy9tb2RhbC12aWV3Jyk7XG5cbkRBVEVUSU1FX0ZPUk1BVCA9ICdZWVlZLU1NLUREIEhIOm1tOnNzJztcblxuQWN0aXZpdHkgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQWN0aXZpdHksIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFjdGl2aXR5KCkge1xuICAgIHJldHVybiBBY3Rpdml0eS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFjdGl2aXR5LnByb3RvdHlwZS51cmxSb290ID0gJy9hcGkvdjEvYWN0aXZpdHkvJztcblxuICBBY3Rpdml0eS5wcm90b3R5cGUuZGVmYXVsdHMgPSB7XG4gICAgXCJpbmZvX2ZpZWxkXzFcIjogXCJcIixcbiAgICBcImluZm9fZmllbGRfMlwiOiBcIlwiLFxuICAgIFwiaW5mb19maWVsZF8zXCI6IFwiXCJcbiAgfTtcblxuICByZXR1cm4gQWN0aXZpdHk7XG5cbn0pKEJhc2VNb2RlbCk7XG5cbkFjdGl2aXRpZXMgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQWN0aXZpdGllcywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQWN0aXZpdGllcygpIHtcbiAgICByZXR1cm4gQWN0aXZpdGllcy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFjdGl2aXRpZXMucHJvdG90eXBlLnVybCA9ICcvYXBpL3YxL2FjdGl2aXR5Lyc7XG5cbiAgQWN0aXZpdGllcy5wcm90b3R5cGUubW9kZWwgPSBBY3Rpdml0eTtcblxuICByZXR1cm4gQWN0aXZpdGllcztcblxufSkoQmFzZUNvbGxlY3Rpb24pO1xuXG5BY3Rpdml0eVZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQWN0aXZpdHlWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBBY3Rpdml0eVZpZXcoKSB7XG4gICAgcmV0dXJuIEFjdGl2aXR5Vmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFjdGl2aXR5Vmlldy5wcm90b3R5cGUudGFnTmFtZSA9ICd0cic7XG5cbiAgQWN0aXZpdHlWaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9hY3Rpdml0eS1yb3cnKTtcblxuICBBY3Rpdml0eVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhLCBlbmRfYXQsIGZyb250X2hvc3QsIG5vdywgc3RhcnRfYXQ7XG4gICAgZnJvbnRfaG9zdCA9IHdpbmRvdy5mcm9udF9ob3N0IHx8ICcvJztcbiAgICBkYXRhID0gdGhpcy5tb2RlbC50b0pTT04oKTtcbiAgICBzdGFydF9hdCA9IG5ldyBtb21lbnQoZGF0YS5zdGFydF9hdCwgREFURVRJTUVfRk9STUFUKTtcbiAgICBlbmRfYXQgPSBuZXcgbW9tZW50KGRhdGEuZW5kX2F0LCBEQVRFVElNRV9GT1JNQVQpO1xuICAgIG5vdyA9IG5ldyBtb21lbnQoKTtcbiAgICBkYXRhWydzdGF0dXMnXSA9IChzdGFydF9hdCA8IG5vdyAmJiBub3cgPCBlbmRfYXQpID8gJ+W8gOWQrycgOiAn5YWz6ZetJztcbiAgICBkYXRhWyd1cmwnXSA9IFwiaHR0cDovL1wiICsgZnJvbnRfaG9zdCArIFwiL2luZGV4Lmh0bWwjXCIgKyBkYXRhWydjb2RlJ107XG4gICAgZGF0YVsndHlwZSddID0gKGZ1bmN0aW9uKCkge1xuICAgICAgc3dpdGNoIChkYXRhWyd0eXBlJ10pIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHJldHVybiAn5pmu6YCaJztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHJldHVybiAn6ZmQ5pe2JztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHJldHVybiAn5oyR5oiYJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gJ+acquefpSc7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoZGF0YSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBBY3Rpdml0eVZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG5BY3Rpdml0aWVzVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChBY3Rpdml0aWVzVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQWN0aXZpdGllc1ZpZXcoKSB7XG4gICAgcmV0dXJuIEFjdGl2aXRpZXNWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQWN0aXZpdGllc1ZpZXcucHJvdG90eXBlLnJvdyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgcmV0dXJuIG5ldyBBY3Rpdml0eVZpZXcoe1xuICAgICAgbW9kZWw6IG1vZGVsXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIEFjdGl2aXRpZXNWaWV3O1xuXG59KShUYWJsZVZpZXcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGl2aXR5UGFnZVZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQWN0aXZpdHlQYWdlVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQWN0aXZpdHlQYWdlVmlldygpIHtcbiAgICByZXR1cm4gQWN0aXZpdHlQYWdlVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFjdGl2aXR5UGFnZVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY3Rpdml0aWVzLCBhY3Rpdml0aWVzVmlldywgcGFnZU5hdlZpZXc7XG4gICAgYWN0aXZpdGllcyA9IG5ldyBBY3Rpdml0aWVzO1xuICAgIGFjdGl2aXRpZXNWaWV3ID0gbmV3IEFjdGl2aXRpZXNWaWV3KHtcbiAgICAgIGVsOiAkKCcjYWN0aXZpdHktdGFibGUtY29udGFpbmVyJyksXG4gICAgICBjb2xsZWN0aW9uOiBhY3Rpdml0aWVzXG4gICAgfSk7XG4gICAgcGFnZU5hdlZpZXcgPSBuZXcgUGFnaW5hdGlvblZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogYWN0aXZpdGllc1xuICAgIH0pO1xuICAgIGFjdGl2aXRpZXNWaWV3LiRlbC5hZnRlcihwYWdlTmF2Vmlldy5yZW5kZXIoKS4kZWwpO1xuICAgIGFjdGl2aXRpZXMuZmV0Y2goe1xuICAgICAgcmVzZXQ6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gQWN0aXZpdHlQYWdlVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBCYXNlQ29sbGVjdGlvbiwgQmFzZU1vZGVsLCBCb29rUGFnZVZpZXcsIE1vZGFsVmlldywgUGFnaW5hdGlvblZpZXcsIFF1aXpCb29rLCBRdWl6Qm9va01vZGFsVmlldywgUXVpekJvb2tWaWV3LCBRdWl6Qm9va3MsIFF1aXpCb29rc1ZpZXcsIFRhYmxlVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VNb2RlbCA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1tb2RlbCcpO1xuXG5CYXNlQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1jb2xsZWN0aW9uJyk7XG5cblRhYmxlVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3RhYmxlLXZpZXcnKTtcblxuUGFnaW5hdGlvblZpZXcgPSByZXF1aXJlKCd2aWV3cy9wYWdpbmF0aW9uLXZpZXcnKTtcblxuTW9kYWxWaWV3ID0gcmVxdWlyZSgndmlld3MvbW9kYWwtdmlldycpO1xuXG5RdWl6Qm9vayA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWl6Qm9vaywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVpekJvb2soKSB7XG4gICAgcmV0dXJuIFF1aXpCb29rLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVpekJvb2sucHJvdG90eXBlLnVybFJvb3QgPSAnL2FwaS92MS9xdWl6Ym9vayc7XG5cbiAgUXVpekJvb2sucHJvdG90eXBlLnZhbGlkYXRpb24gPSB7XG4gICAgdGl0bGU6IHtcbiAgICAgIGJsYW5rOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2U6ICfpopjlupPlkI3kuI3og73kuLrnqbonXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBRdWl6Qm9vaztcblxufSkoQmFzZU1vZGVsKTtcblxuUXVpekJvb2tzID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1aXpCb29rcywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVpekJvb2tzKCkge1xuICAgIHJldHVybiBRdWl6Qm9va3MuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWl6Qm9va3MucHJvdG90eXBlLnVybCA9ICcvYXBpL3YxL3F1aXpib29rJztcblxuICBRdWl6Qm9va3MucHJvdG90eXBlLm1vZGVsID0gUXVpekJvb2s7XG5cbiAgcmV0dXJuIFF1aXpCb29rcztcblxufSkoQmFzZUNvbGxlY3Rpb24pO1xuXG5RdWl6Qm9va1ZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVpekJvb2tWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWl6Qm9va1ZpZXcoKSB7XG4gICAgcmV0dXJuIFF1aXpCb29rVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1aXpCb29rVmlldy5wcm90b3R5cGUudGFnTmFtZSA9ICd0cic7XG5cbiAgUXVpekJvb2tWaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9ib29rLXJvdycpO1xuXG4gIFF1aXpCb29rVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsIFwic3luY1wiLCB0aGlzLnJlbmRlcik7XG4gIH07XG5cbiAgUXVpekJvb2tWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBRdWl6Qm9va1ZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG5RdWl6Qm9va01vZGFsVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWl6Qm9va01vZGFsVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVpekJvb2tNb2RhbFZpZXcoKSB7XG4gICAgcmV0dXJuIFF1aXpCb29rTW9kYWxWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVpekJvb2tNb2RhbFZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL2Jvb2stbW9kYWwnKTtcblxuICBRdWl6Qm9va01vZGFsVmlldy5wcm90b3R5cGUuYmluZGluZ3MgPSB7XG4gICAgJyN0aXRsZSc6ICd0aXRsZSdcbiAgfTtcblxuICByZXR1cm4gUXVpekJvb2tNb2RhbFZpZXc7XG5cbn0pKE1vZGFsVmlldyk7XG5cblF1aXpCb29rc1ZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVpekJvb2tzVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVpekJvb2tzVmlldygpIHtcbiAgICByZXR1cm4gUXVpekJvb2tzVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1aXpCb29rc1ZpZXcucHJvdG90eXBlLnJvdyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgcmV0dXJuIG5ldyBRdWl6Qm9va1ZpZXcoe1xuICAgICAgbW9kZWw6IG1vZGVsXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFF1aXpCb29rc1ZpZXc7XG5cbn0pKFRhYmxlVmlldyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQm9va1BhZ2VWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEJvb2tQYWdlVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQm9va1BhZ2VWaWV3KCkge1xuICAgIHJldHVybiBCb29rUGFnZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCb29rUGFnZVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYWdlTmF2VmlldywgcXVpekJvb2tNb2RhbFZpZXcsIHF1aXpCb29rcywgcXVpekJvb2tzVmlldztcbiAgICBxdWl6Qm9va3MgPSBuZXcgUXVpekJvb2tzO1xuICAgIHF1aXpCb29rc1ZpZXcgPSBuZXcgUXVpekJvb2tzVmlldyh7XG4gICAgICBlbDogJCgnI3F1aXpib29rLXRhYmxlLWNvbnRhaW5lcicpLFxuICAgICAgY29sbGVjdGlvbjogcXVpekJvb2tzXG4gICAgfSk7XG4gICAgcGFnZU5hdlZpZXcgPSBuZXcgUGFnaW5hdGlvblZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogcXVpekJvb2tzXG4gICAgfSk7XG4gICAgcXVpekJvb2tzVmlldy4kZWwuYWZ0ZXIocGFnZU5hdlZpZXcucmVuZGVyKCkuJGVsKTtcbiAgICBxdWl6Qm9va01vZGFsVmlldyA9IG5ldyBRdWl6Qm9va01vZGFsVmlldyh7XG4gICAgICBpZDogJ2Jvb2tNb2RhbEZvcm0nLFxuICAgICAgY29sbGVjdGlvbjogcXVpekJvb2tzXG4gICAgfSk7XG4gICAgcXVpekJvb2tNb2RhbFZpZXcucmVuZGVyKCk7XG4gICAgcXVpekJvb2tzLmZldGNoKHtcbiAgICAgIHJlc2V0OiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIEJvb2tQYWdlVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBCYXNlQ29sbGVjdGlvbixcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VDb2xsZWN0aW9uID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEJhc2VDb2xsZWN0aW9uLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBCYXNlQ29sbGVjdGlvbigpIHtcbiAgICByZXR1cm4gQmFzZUNvbGxlY3Rpb24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCYXNlQ29sbGVjdGlvbi5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5tZXRhKSB7XG4gICAgICB0aGlzLm1ldGEgPSBkYXRhLm1ldGE7XG4gICAgfVxuICAgIHJldHVybiBkYXRhICYmIGRhdGEub2JqZWN0cyB8fCBkYXRhO1xuICB9O1xuXG4gIHJldHVybiBCYXNlQ29sbGVjdGlvbjtcblxufSkoQmFja2JvbmUuQ29sbGVjdGlvbik7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUNvbGxlY3Rpb247XG5cbiIsInZhciBCYXNlTW9kZWwsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5CYXNlTW9kZWwgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQmFzZU1vZGVsLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBCYXNlTW9kZWwoKSB7XG4gICAgcmV0dXJuIEJhc2VNb2RlbC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEJhc2VNb2RlbC5wcm90b3R5cGUudXJsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9yaWdVcmw7XG4gICAgb3JpZ1VybCA9IEJhc2VNb2RlbC5fX3N1cGVyX18udXJsLmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIG9yaWdVcmwgKyAob3JpZ1VybC5sZW5ndGggPiAwICYmIG9yaWdVcmwuY2hhckF0KG9yaWdVcmwubGVuZ3RoIC0gMSkgPT09ICcvJyA/ICcnIDogJy8nKTtcbiAgfTtcblxuICBCYXNlTW9kZWwucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmIChkYXRhICYmIGRhdGEub2JqZWN0cyAmJiBfLmlzQXJyYXkoZGF0YS5vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIGRhdGEub2JqZWN0c1swXSB8fCB7fTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgcmV0dXJuIEJhc2VNb2RlbDtcblxufSkoQmFja2JvbmUuTW9kZWwpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VNb2RlbDtcblxuIiwidmFyIEJhc2VDb2xsZWN0aW9uLCBCYXNlTW9kZWwsIE1vZGFsVmlldywgUGFnaW5hdGlvblZpZXcsIFF1ZXN0aW9uLCBRdWVzdGlvbkxpc3RQYW5lbFZpZXcsIFF1ZXN0aW9uTW9kYWxWaWV3LCBRdWVzdGlvblBhZ2VWaWV3LCBRdWVzdGlvblZpZXcsIFF1ZXN0aW9ucywgUXVlc3Rpb25zVmlldywgVGFibGVWaWV3LCBjaGFyMkludCwgaW50MkNoYXIsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5CYXNlTW9kZWwgPSByZXF1aXJlKCdkYXRhL2Jhc2UtbW9kZWwnKTtcblxuQmFzZUNvbGxlY3Rpb24gPSByZXF1aXJlKCdkYXRhL2Jhc2UtY29sbGVjdGlvbicpO1xuXG5UYWJsZVZpZXcgPSByZXF1aXJlKCd2aWV3cy90YWJsZS12aWV3Jyk7XG5cblBhZ2luYXRpb25WaWV3ID0gcmVxdWlyZSgndmlld3MvcGFnaW5hdGlvbi12aWV3Jyk7XG5cbk1vZGFsVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL21vZGFsLXZpZXcnKTtcblxuaW50MkNoYXIgPSBmdW5jdGlvbihpKSB7XG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDY0ICsgcGFyc2VJbnQoaSkpO1xufTtcblxuY2hhcjJJbnQgPSBmdW5jdGlvbihjKSB7XG4gIGlmICghIWMpIHtcbiAgICByZXR1cm4gYy5jaGFyQ29kZUF0KDApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjO1xuICB9XG59O1xuXG5RdWVzdGlvbiA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvbiwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb24oKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb24ucHJvdG90eXBlLnVybFJvb3QgPSAnL2FwaS92MS9xdWVzdGlvbi8nO1xuXG4gIFF1ZXN0aW9uLnByb3RvdHlwZS5kZWZhdWx0cyA9IHtcbiAgICBcInR5cGVcIjogMSxcbiAgICBcImNvcnJlY3Rfb3B0aW9uXCI6IFwiMVwiLFxuICAgIFwib3B0aW9uX0FcIjogXCJcIixcbiAgICBcIm9wdGlvbl9CXCI6IFwiXCIsXG4gICAgXCJvcHRpb25fQ1wiOiBcIlwiLFxuICAgIFwib3B0aW9uX0RcIjogXCJcIixcbiAgICBcIm9wdGlvbl9FXCI6IFwiXCIsXG4gICAgXCJvcHRpb25fRlwiOiBcIlwiXG4gIH07XG5cbiAgUXVlc3Rpb24ucHJvdG90eXBlLnZhbGlkYXRpb24gPSB7XG4gICAgY29udGVudDoge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogJ+mimOebruWGheWuueS4jeiDveS4uuepuidcbiAgICB9LFxuICAgIHR5cGU6IHtcbiAgICAgIGJsYW5rOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IDEgfHwgdmFsdWUgPT09IDI7XG4gICAgICB9LFxuICAgICAgbWVzc2FnZTogJ+mimOebruexu+Wei+W/hemhu+aYr+WkmumAieaIluWNlemAiSdcbiAgICB9LFxuICAgIGNvcnJlY3Rfb3B0aW9uOiB7XG4gICAgICBibGFuazogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3dpdGNoIChmYWxzZSkge1xuICAgICAgICAgICAgY2FzZSAhXy5pc0FycmF5KHZhbHVlKTpcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgY2FzZSAhXy5pc1N0cmluZyh2YWx1ZSk6XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuICEoXy5pc0VtcHR5KHZhbHVlKSkgJiYgXy5ldmVyeSh2YWx1ZSwgKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoJ29wdGlvbl8nICsgaW50MkNoYXIoaSkpO1xuICAgICAgICB9KSwgdGhpcyk7XG4gICAgICB9LFxuICAgICAgbWVzc2FnZTogJ+ato+ehruetlOahiOiuvue9ruWHuumUme+8jOazqOaEj+WvueW6lOeahOmAiemhueaYr+WQpuiuvue9ruS6huetlOahiCdcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXN0aW9uO1xuXG59KShCYXNlTW9kZWwpO1xuXG5RdWVzdGlvbnMgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb25zLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvbnMoKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9ucy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9ucy5wcm90b3R5cGUudXJsID0gJy9hcGkvdjEvcXVlc3Rpb24vJztcblxuICBRdWVzdGlvbnMucHJvdG90eXBlLm1vZGVsID0gUXVlc3Rpb247XG5cbiAgUXVlc3Rpb25zLnByb3RvdHlwZS5zdGF0ZSA9IHt9O1xuXG4gIFF1ZXN0aW9ucy5wcm90b3R5cGUuZmV0Y2ggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBvcHRpb25zKTtcbiAgICBkYXRhID0gb3B0aW9ucy5kYXRhO1xuICAgIG9wdGlvbnMuZGF0YSA9IF8uZXh0ZW5kKHt9LCB0aGlzLnN0YXRlLCBkYXRhKTtcbiAgICByZXR1cm4gUXVlc3Rpb25zLl9fc3VwZXJfXy5mZXRjaC5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvbnM7XG5cbn0pKEJhc2VDb2xsZWN0aW9uKTtcblxuUXVlc3Rpb25WaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1ZXN0aW9uVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb25WaWV3KCkge1xuICAgIHJldHVybiBRdWVzdGlvblZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWVzdGlvblZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAndHInO1xuXG4gIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvcXVlc3Rpb24tcm93Jyk7XG5cbiAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5ldmVudHMgPSB7XG4gICAgJ2NsaWNrICNkZWxldGUnOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vZGVsLmRlc3Ryb3koKTtcbiAgICB9XG4gIH07XG5cbiAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcInN5bmNcIiwgdGhpcy5yZW5kZXIpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsIFwiZGVzdHJveVwiLCB0aGlzLnJlbW92ZSk7XG4gIH07XG5cbiAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29ycmVjdCwgZGF0YTtcbiAgICBkYXRhID0gdGhpcy5tb2RlbC50b0pTT04oKTtcbiAgICBjb3JyZWN0ID0gZGF0YVsnY29ycmVjdF9vcHRpb24nXS5zcGxpdCgnLCcpO1xuICAgIGRhdGFbJ2NvcnJlY3Rfb3B0aW9uJ10gPSBfLm1hcChjb3JyZWN0LCBpbnQyQ2hhcikuam9pbigpO1xuICAgIGRhdGFbJ3R5cGUnXSA9IChmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAoZGF0YVsndHlwZSddKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICByZXR1cm4gJ+WNlemAiSc7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICByZXR1cm4gJ+WkmumAiSc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuICflpJrpgIknO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKGRhdGEpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25WaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuUXVlc3Rpb25zVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvbnNWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvbnNWaWV3KCkge1xuICAgIHJldHVybiBRdWVzdGlvbnNWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb25zVmlldy5wcm90b3R5cGUucm93ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICByZXR1cm4gbmV3IFF1ZXN0aW9uVmlldyh7XG4gICAgICBtb2RlbDogbW9kZWxcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25zVmlldztcblxufSkoVGFibGVWaWV3KTtcblxuUXVlc3Rpb25Nb2RhbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb25Nb2RhbFZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uTW9kYWxWaWV3KCkge1xuICAgIHJldHVybiBRdWVzdGlvbk1vZGFsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9uTW9kYWxWaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9xdWVzdGlvbi1tb2RhbCcpO1xuXG4gIFF1ZXN0aW9uTW9kYWxWaWV3LnByb3RvdHlwZS5iaW5kaW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfYmluZGluZ3MsIGNvZGUsIGosIGxlbiwgcmVmO1xuICAgIF9iaW5kaW5ncyA9IHtcbiAgICAgICdbbmFtZT1jb250ZW50XSc6ICdjb250ZW50JyxcbiAgICAgICdbbmFtZT10eXBlXSc6IHtcbiAgICAgICAgb2JzZXJ2ZTogJ3R5cGUnLFxuICAgICAgICBzZWxlY3RPcHRpb25zOiB7XG4gICAgICAgICAgY29sbGVjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfljZXpgIknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAxXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+WkmumAiScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNldE9wdGlvbnM6IHtcbiAgICAgICAgICBzaWxlbnQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnW25hbWU9Y29ycmVjdF9vcHRpb25dJzoge1xuICAgICAgICBvYnNlcnZlOiAnY29ycmVjdF9vcHRpb24nLFxuICAgICAgICBvbkdldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWUuc3BsaXQoJywnKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25TZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5qb2luKCcsJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHJlZiA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnXTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGNvZGUgPSByZWZbal07XG4gICAgICBfYmluZGluZ3NbXCJbbmFtZT1vcHRpb25fXCIgKyBjb2RlICsgXCJdXCJdID0gJ29wdGlvbl8nICsgY29kZTtcbiAgICB9XG4gICAgcmV0dXJuIF9iaW5kaW5ncztcbiAgfTtcblxuICBRdWVzdGlvbk1vZGFsVmlldy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKGUpIHtcbiAgICBRdWVzdGlvbk1vZGFsVmlldy5fX3N1cGVyX18uc2hvdy5jYWxsKHRoaXMsIGUpO1xuICAgIGlmICh0aGlzLm1vZGVsLmlzTmV3KCkpIHtcbiAgICAgIHRoaXMubW9kZWwuc2V0KCdib29rJywgdGhpcy5jb2xsZWN0aW9uLnN0YXRlLmJvb2spO1xuICAgIH1cbiAgICB0aGlzLmNoYW5nZVR5cGUodGhpcy5tb2RlbCwgdGhpcy5tb2RlbC5nZXQoJ3R5cGUnKSk7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJjaGFuZ2U6dHlwZVwiLCB0aGlzLmNoYW5nZVR5cGUpO1xuICB9O1xuXG4gIFF1ZXN0aW9uTW9kYWxWaWV3LnByb3RvdHlwZS5jaGFuZ2VUeXBlID0gZnVuY3Rpb24obW9kZWwsIHZhbHVlLCBvcHRpb25zKSB7XG4gICAgdmFyIGN1clZhbCwgdHlwZTtcbiAgICB0eXBlID0gdmFsdWUgPT09IDEgPyAncmFkaW8nIDogJ2NoZWNrYm94JztcbiAgICBjdXJWYWwgPSBtb2RlbC5nZXQoJ2NvcnJlY3Rfb3B0aW9uJyk7XG4gICAgaWYgKHR5cGUgPT09ICdyYWRpbycgJiYgY3VyVmFsKSB7XG4gICAgICBtb2RlbC5zZXQoJ2NvcnJlY3Rfb3B0aW9uJywgY3VyVmFsWzBdKTtcbiAgICB9XG4gICAgdGhpcy4kKCdpbnB1dFtuYW1lPWNvcnJlY3Rfb3B0aW9uXScpLnByb3AoJ3R5cGUnLCB0eXBlKTtcbiAgICByZXR1cm4gdGhpcy5zdGlja2l0KCk7XG4gIH07XG5cbiAgUXVlc3Rpb25Nb2RhbFZpZXcucHJvdG90eXBlLm9uSW52YWxpZEZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGVycm9ycywgbW9kZWwpIHtcbiAgICB2YXIgZXJyb3IsIGZpZWxkLCBncm91cCwgaiwgbGVuO1xuICAgIGlmIChuYW1lICE9PSAnY29ycmVjdF9vcHRpb24nKSB7XG4gICAgICByZXR1cm4gUXVlc3Rpb25Nb2RhbFZpZXcuX19zdXBlcl9fLm9uSW52YWxpZEZpZWxkLmNhbGwodGhpcywgbmFtZSwgdmFsdWUsIGVycm9ycywgbW9kZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZCA9IHRoaXMuJChcIltuYW1lPVwiICsgbmFtZSArIFwiXVwiKTtcbiAgICAgIGdyb3VwID0gZmllbGQuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKTtcbiAgICAgIGdyb3VwLmZpbmQoJy5oZWxwLWJsb2NrJykucmVtb3ZlKCk7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBlcnJvcnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcnNbal07XG4gICAgICAgIGdyb3VwLmFwcGVuZChcIjxkaXYgY2xhc3M9J2hlbHAtYmxvY2sgY29sLXNtLW9mZnNldC0yJz5cIiArIGVycm9yICsgXCI8L2Rpdj5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ3JvdXAuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25Nb2RhbFZpZXc7XG5cbn0pKE1vZGFsVmlldyk7XG5cblF1ZXN0aW9uTGlzdFBhbmVsVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvbkxpc3RQYW5lbFZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uTGlzdFBhbmVsVmlldygpIHtcbiAgICByZXR1cm4gUXVlc3Rpb25MaXN0UGFuZWxWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb25MaXN0UGFuZWxWaWV3LnByb3RvdHlwZS5ldmVudHMgPSB7XG4gICAgJ2NoYW5nZSAjYm9vayc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5zdGF0ZS5ib29rID0gdGhpcy4kKCcjYm9vaycpLnZhbCgpO1xuICAgIH0sXG4gICAgJ2NsaWNrICNsb2FkQm9vayc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5mZXRjaCh7XG4gICAgICAgIHJlc2V0OiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXN0aW9uTGlzdFBhbmVsVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25QYWdlVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvblBhZ2VWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvblBhZ2VWaWV3KCkge1xuICAgIHJldHVybiBRdWVzdGlvblBhZ2VWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb25QYWdlVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oYm9va0lkKSB7XG4gICAgdmFyIHBhZ2VOYXZWaWV3LCBwYW5lbFZpZXcsIHF1ZXN0aW9uTW9kYWxWaWV3LCBxdWVzdGlvbnMsIHF1ZXN0aW9uc1ZpZXc7XG4gICAgaWYgKCFib29rSWQpIHtcbiAgICAgIGJvb2tJZCA9ICQoJ2Zvcm0gc2VsZWN0W25hbWU9Ym9va10nKS52YWwoKTtcbiAgICB9XG4gICAgcXVlc3Rpb25zID0gbmV3IFF1ZXN0aW9ucztcbiAgICBxdWVzdGlvbnMuc3RhdGUuYm9vayA9IGJvb2tJZDtcbiAgICBwYW5lbFZpZXcgPSBuZXcgUXVlc3Rpb25MaXN0UGFuZWxWaWV3KHtcbiAgICAgIGVsOiAkKCcudGFibGUtY29udHJvbCcpLFxuICAgICAgY29sbGVjdGlvbjogcXVlc3Rpb25zXG4gICAgfSk7XG4gICAgcXVlc3Rpb25zVmlldyA9IG5ldyBRdWVzdGlvbnNWaWV3KHtcbiAgICAgIGVsOiAkKCcjcXVlc3Rpb24tdGFibGUtY29udGFpbmVyJyksXG4gICAgICBjb2xsZWN0aW9uOiBxdWVzdGlvbnNcbiAgICB9KTtcbiAgICBwYWdlTmF2VmlldyA9IG5ldyBQYWdpbmF0aW9uVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiBxdWVzdGlvbnNcbiAgICB9KTtcbiAgICBxdWVzdGlvbnNWaWV3LiRlbC5hZnRlcihwYWdlTmF2Vmlldy5yZW5kZXIoKS4kZWwpO1xuICAgIHF1ZXN0aW9uTW9kYWxWaWV3ID0gbmV3IFF1ZXN0aW9uTW9kYWxWaWV3KHtcbiAgICAgIGlkOiAncXVlc3Rpb25Nb2RhbEZvcm0nLFxuICAgICAgY29sbGVjdGlvbjogcXVlc3Rpb25zXG4gICAgfSk7XG4gICAgcXVlc3Rpb25Nb2RhbFZpZXcucmVuZGVyKCk7XG4gICAgcXVlc3Rpb25zLmZldGNoKHtcbiAgICAgIHJlc2V0OiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIFF1ZXN0aW9uUGFnZVZpZXcuX19zdXBlcl9fLnJlbmRlci5jYWxsKHRoaXMpO1xuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvblBhZ2VWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIE1vZGFsVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kYWxWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKE1vZGFsVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gTW9kYWxWaWV3KCkge1xuICAgIHJldHVybiBNb2RhbFZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBNb2RhbFZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICQoJyMnICsgdGhpcy5pZCkucmVtb3ZlKCk7XG4gICAgJCgnYm9keScpLmFwcGVuZCh0aGlzLnRlbXBsYXRlKHtcbiAgICAgIGlkOiB0aGlzLmlkXG4gICAgfSkpO1xuICAgIHRoaXMuc2V0RWxlbWVudCgkKCcjJyArIHRoaXMuaWQpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBNb2RhbFZpZXcucHJvdG90eXBlLmV2ZW50cyA9IHtcbiAgICAnc2hvdy5icy5tb2RhbCc6ICdzaG93JyxcbiAgICAnaGlkZGVuLmJzLm1vZGFsJzogJ2hpZGRlbicsXG4gICAgJ2NsaWNrIFt0eXBlPXN1Ym1pdF0nOiAnc2F2ZSdcbiAgfTtcblxuICBNb2RhbFZpZXcucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9ICQoZS5yZWxhdGVkVGFyZ2V0KS5kYXRhKCk7XG4gICAgdGhpcy5tb2RlbCA9IGRhdGEuaWQgPyB0aGlzLmNvbGxlY3Rpb24uZ2V0KGRhdGEuaWQpIDogbmV3IHRoaXMuY29sbGVjdGlvbi5tb2RlbDtcbiAgICB0aGlzLnN0aWNraXQoKTtcbiAgICB0aGlzLmJpbmRWYWxpZGF0aW9uKCk7XG4gICAgaWYgKCF0aGlzLm1vZGVsLmlzTmV3KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vZGVsLnZhbGlkYXRlKCk7XG4gICAgfVxuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUuaGlkZGVuID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy51bnN0aWNraXQoKTtcbiAgICB0aGlzLnN0b3BMaXN0ZW5pbmcoKTtcbiAgICByZXR1cm4gZGVsZXRlIHRoaXMubW9kZWw7XG4gIH07XG5cbiAgTW9kYWxWaWV3LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciB4aHI7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHhociA9IHRoaXMubW9kZWwuc2F2ZSgpO1xuICAgIGlmICh4aHIpIHtcbiAgICAgIHJldHVybiB4aHIudGhlbigoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBfdGhpcy5jb2xsZWN0aW9uLmFkZChfdGhpcy5tb2RlbCk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLiRlbC5tb2RhbCgnaGlkZScpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpKTtcbiAgICB9XG4gIH07XG5cbiAgTW9kYWxWaWV3LnByb3RvdHlwZS5vblZhbGlkRmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgbW9kZWwpIHtcbiAgICB2YXIgZmllbGQsIGdyb3VwO1xuICAgIGZpZWxkID0gdGhpcy4kKFwiW25hbWU9XCIgKyBuYW1lICsgXCJdXCIpO1xuICAgIGdyb3VwID0gZmllbGQuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKTtcbiAgICBncm91cC5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgcmV0dXJuIGdyb3VwLmZpbmQoJy5oZWxwLWJsb2NrJykucmVtb3ZlKCk7XG4gIH07XG5cbiAgTW9kYWxWaWV3LnByb3RvdHlwZS5vbkludmFsaWRGaWVsZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBlcnJvcnMsIG1vZGVsKSB7XG4gICAgdmFyIGVycm9yLCBmaWVsZCwgZ3JvdXAsIGksIGxlbjtcbiAgICBmaWVsZCA9IHRoaXMuJChcIltuYW1lPVwiICsgbmFtZSArIFwiXVwiKTtcbiAgICBncm91cCA9IGZpZWxkLmNsb3Nlc3QoJy5mb3JtLWdyb3VwJyk7XG4gICAgZ3JvdXAuZmluZCgnLmhlbHAtYmxvY2snKS5yZW1vdmUoKTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBlcnJvcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGVycm9yID0gZXJyb3JzW2ldO1xuICAgICAgZmllbGQuYWZ0ZXIoXCI8ZGl2IGNsYXNzPSdoZWxwLWJsb2NrJz5cIiArIGVycm9yICsgXCI8L2Rpdj5cIik7XG4gICAgfVxuICAgIHJldHVybiBncm91cC5hZGRDbGFzcygnaGFzLWVycm9yJyk7XG4gIH07XG5cbiAgcmV0dXJuIE1vZGFsVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBQYWdpbmF0aW9uVmlldyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGFnaW5hdGlvblZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUGFnaW5hdGlvblZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFBhZ2luYXRpb25WaWV3KCkge1xuICAgIHJldHVybiBQYWdpbmF0aW9uVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS50YWdOYW1lID0gJ25hdic7XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLmNsYXNzTmFtZSA9ICdwYWdlLW5hdic7XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL3BhZ2UtbmF2Jyk7XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLmV2ZW50cyA9IHtcbiAgICAnY2xpY2sgYVtkYXRhLWlkXSc6ICdsb2FkUGFnZSdcbiAgfTtcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ3Jlc2V0JywgdGhpcy5yZW5kZXIpO1xuICB9O1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5jb2xsZWN0aW9uLm1ldGEpIHtcbiAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0aGlzLmNvbGxlY3Rpb24ubWV0YSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUubG9hZFBhZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGRhdGEgPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgpO1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmV0Y2goe1xuICAgICAgZGF0YToge1xuICAgICAgICBwYWdlOiBkYXRhLmlkXG4gICAgICB9LFxuICAgICAgcmVzZXQ6IHRydWVcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gUGFnaW5hdGlvblZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgVGFibGVWaWV3LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZVZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVGFibGVWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBUYWJsZVZpZXcoKSB7XG4gICAgcmV0dXJuIFRhYmxlVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFRhYmxlVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLCAnYWRkJywgdGhpcy5hZGQpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ3Jlc2V0JywgdGhpcy5yZW5kZXIpO1xuICB9O1xuXG4gIFRhYmxlVmlldy5wcm90b3R5cGUucm93ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICB9O1xuXG4gIFRhYmxlVmlldy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICB2YXIgcm93O1xuICAgIHJvdyA9IHRoaXMucm93KG1vZGVsKTtcbiAgICByb3cuJGVsLmFkZENsYXNzKCdzdWNjZXNzJyk7XG4gICAgcmV0dXJuIHRoaXMuJCgndGFibGUgdGJvZHknKS5wcmVwZW5kKHJvdy5yZW5kZXIoKS4kZWwpO1xuICB9O1xuXG4gIFRhYmxlVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgIHZhciB0Ym9keTtcbiAgICB0Ym9keSA9IHRoaXMuJCgndGFibGUgdGJvZHknKTtcbiAgICB0Ym9keS5lbXB0eSgpO1xuICAgIGNvbGxlY3Rpb24uZWFjaCgoZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgIHJldHVybiB0Ym9keS5hcHBlbmQodGhpcy5yb3cobW9kZWwpLnJlbmRlcigpLiRlbCk7XG4gICAgfSksIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBUYWJsZVZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChib29rLCBjaGFuY2VzLCBlbmRfYXQsIGlkLCBpbmZvX2ZpZWxkXzIsIGluZm9fZmllbGRfMywgbXVsdGksIG11bHRpX3BvaW50cywgbmFtZSwgc2luZ2xlLCBzaW5nbGVfcG9pbnRzLCBzdGFydF9hdCwgc3RhdHVzLCB0aW1lX2xpbWl0LCB0eXBlLCB1cmwsIHVzZXIsIHdlbGNvbWUpIHtcbmJ1Zi5wdXNoKFwiPHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gaWQpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gbmFtZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBib29rLnRpdGxlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHR5cGUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gY2hhbmNlcykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB0aW1lX2xpbWl0KSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHNpbmdsZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBtdWx0aSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBzaW5nbGVfcG9pbnRzKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG11bHRpX3BvaW50cykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBzdGF0dXMpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gc3RhcnRfYXQpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gZW5kX2F0KSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChudWxsID09IChqYWRlX2ludGVycCA9IHdlbGNvbWUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpbmZvX2ZpZWxkXzMpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gaW5mb19maWVsZF8yKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGluZm9fZmllbGRfMykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+PGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIHVybCwgdHJ1ZSwgZmFsc2UpKSArIFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdXJsKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2E+PC90ZD48dGQ+PGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIFwiL2FjdGl2aXRpZXMvZWRpdC9cIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBidG4teHNcXFwiPue8lui+kTwvYT48L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHVzZXIudXNlcm5hbWUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+XCIpO30uY2FsbCh0aGlzLFwiYm9va1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguYm9vazp0eXBlb2YgYm9vayE9PVwidW5kZWZpbmVkXCI/Ym9vazp1bmRlZmluZWQsXCJjaGFuY2VzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5jaGFuY2VzOnR5cGVvZiBjaGFuY2VzIT09XCJ1bmRlZmluZWRcIj9jaGFuY2VzOnVuZGVmaW5lZCxcImVuZF9hdFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguZW5kX2F0OnR5cGVvZiBlbmRfYXQhPT1cInVuZGVmaW5lZFwiP2VuZF9hdDp1bmRlZmluZWQsXCJpZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaWQ6dHlwZW9mIGlkIT09XCJ1bmRlZmluZWRcIj9pZDp1bmRlZmluZWQsXCJpbmZvX2ZpZWxkXzJcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmluZm9fZmllbGRfMjp0eXBlb2YgaW5mb19maWVsZF8yIT09XCJ1bmRlZmluZWRcIj9pbmZvX2ZpZWxkXzI6dW5kZWZpbmVkLFwiaW5mb19maWVsZF8zXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pbmZvX2ZpZWxkXzM6dHlwZW9mIGluZm9fZmllbGRfMyE9PVwidW5kZWZpbmVkXCI/aW5mb19maWVsZF8zOnVuZGVmaW5lZCxcIm11bHRpXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5tdWx0aTp0eXBlb2YgbXVsdGkhPT1cInVuZGVmaW5lZFwiP211bHRpOnVuZGVmaW5lZCxcIm11bHRpX3BvaW50c1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubXVsdGlfcG9pbnRzOnR5cGVvZiBtdWx0aV9wb2ludHMhPT1cInVuZGVmaW5lZFwiP211bHRpX3BvaW50czp1bmRlZmluZWQsXCJuYW1lXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5uYW1lOnR5cGVvZiBuYW1lIT09XCJ1bmRlZmluZWRcIj9uYW1lOnVuZGVmaW5lZCxcInNpbmdsZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguc2luZ2xlOnR5cGVvZiBzaW5nbGUhPT1cInVuZGVmaW5lZFwiP3NpbmdsZTp1bmRlZmluZWQsXCJzaW5nbGVfcG9pbnRzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zaW5nbGVfcG9pbnRzOnR5cGVvZiBzaW5nbGVfcG9pbnRzIT09XCJ1bmRlZmluZWRcIj9zaW5nbGVfcG9pbnRzOnVuZGVmaW5lZCxcInN0YXJ0X2F0XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zdGFydF9hdDp0eXBlb2Ygc3RhcnRfYXQhPT1cInVuZGVmaW5lZFwiP3N0YXJ0X2F0OnVuZGVmaW5lZCxcInN0YXR1c1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguc3RhdHVzOnR5cGVvZiBzdGF0dXMhPT1cInVuZGVmaW5lZFwiP3N0YXR1czp1bmRlZmluZWQsXCJ0aW1lX2xpbWl0XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC50aW1lX2xpbWl0OnR5cGVvZiB0aW1lX2xpbWl0IT09XCJ1bmRlZmluZWRcIj90aW1lX2xpbWl0OnVuZGVmaW5lZCxcInR5cGVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnR5cGU6dHlwZW9mIHR5cGUhPT1cInVuZGVmaW5lZFwiP3R5cGU6dW5kZWZpbmVkLFwidXJsXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51cmw6dHlwZW9mIHVybCE9PVwidW5kZWZpbmVkXCI/dXJsOnVuZGVmaW5lZCxcInVzZXJcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVzZXI6dHlwZW9mIHVzZXIhPT1cInVuZGVmaW5lZFwiP3VzZXI6dW5kZWZpbmVkLFwid2VsY29tZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgud2VsY29tZTp0eXBlb2Ygd2VsY29tZSE9PVwidW5kZWZpbmVkXCI/d2VsY29tZTp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpZCkge1xuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5hdHRyKFwiaWRcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgdGFiaW5kZXg9XFxcIi0xXFxcIiByb2xlPVxcXCJkaWFsb2dcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwiYm9va0Zvcm1MYWJlbFxcXCIgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGNsYXNzPVxcXCJtb2RhbCBmYWRlXFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1kaWFsb2dcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWNvbnRlbnRcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWhlYWRlclxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtZGlzbWlzcz1cXFwibW9kYWxcXFwiIGNsYXNzPVxcXCJjbG9zZVxcXCI+PHNwYW4gYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPiZ0aW1lczs8L3NwYW4+PHNwYW4gY2xhc3M9XFxcInNyLW9ubHlcXFwiPuWFs+mXrTwvc3Bhbj48L2J1dHRvbj48aDQgaWQ9XFxcImJvb2tGb3JtTGFiZWxcXFwiIGNsYXNzPVxcXCJtb2RhbC10aXRsZVxcXCI+6L6T5YWl6aKY5bqT5L+h5oGvPC9oND48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5XFxcIj48Zm9ybT48ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj48bGFiZWwgZm9yPVxcXCJ0aXRsZVxcXCIgY2xhc3M9XFxcImNvbnRyb2wtbGFiZWxcXFwiPumimOW6k+WQjTwvbGFiZWw+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGlkPVxcXCJ0aXRsZVxcXCIgcGxhY2Vob2xkZXI9XFxcIumimOW6k+WQjVxcXCIgbmFtZT1cXFwidGl0bGVcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiLz48L2Rpdj48L2Zvcm0+PC9kaXY+PGRpdiBjbGFzcz1cXFwibW9kYWwtZm9vdGVyXFxcIj48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdFxcXCI+5Y+W5raIPC9idXR0b24+PGJ1dHRvbiBpZD1cXFwic2F2ZVxcXCIgdHlwZT1cXFwic3VibWl0XFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIj7kv53lrZg8L2J1dHRvbj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJpZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaWQ6dHlwZW9mIGlkIT09XCJ1bmRlZmluZWRcIj9pZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChidXR0b24sIGlkLCB0aXRsZSwgdXNlcikge1xuYnVmLnB1c2goXCI8dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB0aXRsZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB1c2VyLnVzZXJuYW1lKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD48YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgJy9xdWl6Ym9va3MvJyArIChpZCkgKyAnL3F1ZXN0aW9ucycsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1xcXCI+5p+l55yLPC9hPjxhXCIgKyAoamFkZS5hdHRyKFwidHlwZVwiLCBidXR0b24sIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBpZCwgdHJ1ZSwgZmFsc2UpKSArIFwiIGRhdGEtdG9nZ2xlPVxcXCJtb2RhbFxcXCIgZGF0YS10YXJnZXQ9XFxcIiNib29rTW9kYWxGb3JtXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi14c1xcXCI+57yW6L6RPC9hPjwvdGQ+XCIpO30uY2FsbCh0aGlzLFwiYnV0dG9uXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5idXR0b246dHlwZW9mIGJ1dHRvbiE9PVwidW5kZWZpbmVkXCI/YnV0dG9uOnVuZGVmaW5lZCxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCxcInRpdGxlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC50aXRsZTp0eXBlb2YgdGl0bGUhPT1cInVuZGVmaW5lZFwiP3RpdGxlOnVuZGVmaW5lZCxcInVzZXJcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVzZXI6dHlwZW9mIHVzZXIhPT1cInVuZGVmaW5lZFwiP3VzZXI6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoTWF0aCwgZW5kLCBwYWdlLCBwYWdlcywgc3RhcnQpIHtcbnN0YXJ0ID0gTWF0aC5tYXgoMSwgcGFnZSAtIDUpXG5lbmQgPSBNYXRoLm1pbihwYWdlcywgcGFnZSArIDUpXG5idWYucHVzaChcIjx1bCBjbGFzcz1cXFwicGFnaW5hdGlvblxcXCI+PGxpXCIgKyAoamFkZS5jbHMoWyhwYWdlID09IDEpID8gJ2Rpc2FibGVkJyA6ICcnXSwgW3RydWVdKSkgKyBcIj48YSBocmVmPVxcXCIjXFxcIiBhcmlhLWxhYmVsPVxcXCJTdGFydFxcXCIgZGF0YS1pZD0nMSc+PHNwYW4gYXJpYS1oaWRkZW49XFxcImFyaWEtaGlkZGVuXFxcIj4mbGFxdW87PC9zcGFuPjwvYT48L2xpPlwiKTtcbnZhciBpID0gc3RhcnRcbndoaWxlIChpIDwgcGFnZSlcbntcbmJ1Zi5wdXNoKFwiPGxpPjxhIGhyZWY9XFxcIiNcXFwiXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBpLCB0cnVlLCBmYWxzZSkpICsgXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpKyspID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvYT48L2xpPlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPGxpXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBwYWdlLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImFjdGl2ZVxcXCI+PGEgaHJlZj1cXFwiI1xcXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBwYWdlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2E+PC9saT5cIik7XG52YXIgaSA9IHBhZ2UgKyAxXG53aGlsZSAoaSA8PSBlbmQpXG57XG5idWYucHVzaChcIjxsaT48YSBocmVmPVxcXCIjXFxcIlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgaSwgdHJ1ZSwgZmFsc2UpKSArIFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gaSsrKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L2E+PC9saT5cIik7XG59XG5idWYucHVzaChcIjxsaVwiICsgKGphZGUuY2xzKFsocGFnZSA9PSBwYWdlcykgPyAnZGlzYWJsZWQnIDogJyddLCBbdHJ1ZV0pKSArIFwiPjxhIGhyZWY9XFxcIiNcXFwiIGFyaWEtbGFiZWw9XFxcIkVuZFxcXCJcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIHBhZ2VzLCB0cnVlLCBmYWxzZSkpICsgXCI+PHNwYW4gYXJpYS1oaWRkZW49XFxcImFyaWEtaGlkZGVuXFxcIj4mcmFxdW87PC9zcGFuPjwvYT48L2xpPjwvdWw+XCIpO30uY2FsbCh0aGlzLFwiTWF0aFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguTWF0aDp0eXBlb2YgTWF0aCE9PVwidW5kZWZpbmVkXCI/TWF0aDp1bmRlZmluZWQsXCJlbmRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmVuZDp0eXBlb2YgZW5kIT09XCJ1bmRlZmluZWRcIj9lbmQ6dW5kZWZpbmVkLFwicGFnZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgucGFnZTp0eXBlb2YgcGFnZSE9PVwidW5kZWZpbmVkXCI/cGFnZTp1bmRlZmluZWQsXCJwYWdlc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgucGFnZXM6dHlwZW9mIHBhZ2VzIT09XCJ1bmRlZmluZWRcIj9wYWdlczp1bmRlZmluZWQsXCJzdGFydFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguc3RhcnQ6dHlwZW9mIHN0YXJ0IT09XCJ1bmRlZmluZWRcIj9zdGFydDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpZCwgdW5kZWZpbmVkKSB7XG5qYWRlX21peGluc1tcInRleHRhcmVhXCJdID0gamFkZV9pbnRlcnAgPSBmdW5jdGlvbihpZCxsYWJlbCxuYW1lKXtcbnZhciBibG9jayA9ICh0aGlzICYmIHRoaXMuYmxvY2spLCBhdHRyaWJ1dGVzID0gKHRoaXMgJiYgdGhpcy5hdHRyaWJ1dGVzKSB8fCB7fTtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+PGxhYmVsXCIgKyAoamFkZS5hdHRyKFwiZm9yXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJjb2wtc20tMiBjb250cm9sLWxhYmVsXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBsYWJlbCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9sYWJlbD48ZGl2IGNsYXNzPVxcXCJjb2wtc20tMTBcXFwiPjx0ZXh0YXJlYVwiICsgKGphZGUuYXR0cihcImlkXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJuYW1lXCIsIFwiXCIgKyAobmFtZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgcm93PVxcXCI0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIj48L3RleHRhcmVhPjwvZGl2PjwvZGl2PlwiKTtcbn07XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJpZFwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB0YWJpbmRleD1cXFwiLTFcXFwiIHJvbGU9XFxcImRpYWxvZ1xcXCIgYXJpYS1sYWJlbGxlZGJ5PVxcXCJxdWVzdGlvbkZvcm1MYWJlbFxcXCIgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGNsYXNzPVxcXCJtb2RhbCBmYWRlXFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1kaWFsb2dcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWNvbnRlbnRcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWhlYWRlclxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtZGlzbWlzcz1cXFwibW9kYWxcXFwiIGNsYXNzPVxcXCJjbG9zZVxcXCI+PHNwYW4gYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPiZ0aW1lczs8L3NwYW4+PHNwYW4gY2xhc3M9XFxcInNyLW9ubHlcXFwiPuWFs+mXrTwvc3Bhbj48L2J1dHRvbj48aDQgaWQ9XFxcInF1ZXN0aW9uRm9ybUxhYmVsXFxcIiBjbGFzcz1cXFwibW9kYWwtdGl0bGVcXFwiPui+k+WFpemXrumimOivpue7huS/oeaBrzwvaDQ+PC9kaXY+PGRpdiBjbGFzcz1cXFwibW9kYWwtYm9keVxcXCI+PGZvcm0gY2xhc3M9XFxcImZvcm0taG9yaXpvbnRhbFxcXCI+XCIpO1xuamFkZV9taXhpbnNbXCJ0ZXh0YXJlYVwiXSgnY29udGVudCcsICfpl67popjlhoXlrrknLCAnY29udGVudCcpO1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj48bGFiZWwgZm9yPVxcXCJ0eXBlXFxcIiBjbGFzcz1cXFwiY29sLXNtLTIgY29udHJvbC1sYWJlbFxcXCI+6Zeu6aKY5YaF5a65PC9sYWJlbD48ZGl2IGNsYXNzPVxcXCJjb2wtc20tMTBcXFwiPjxzZWxlY3QgaWQ9XFxcInR5cGVcXFwiIHJvdz1cXFwiNFxcXCIgbmFtZT1cXFwidHlwZVxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbCB0ZXh0YXJlYVxcXCI+PC9zZWxlY3Q+PC9kaXY+PC9kaXY+XCIpO1xudmFyIG9wdGlvbnMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJ11cbi8vIGl0ZXJhdGUgb3B0aW9uc1xuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBvcHRpb25zO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuXG4gICAgZm9yICh2YXIgJGluZGV4ID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyAkaW5kZXggPCAkJGw7ICRpbmRleCsrKSB7XG4gICAgICB2YXIgb3B0aW9uID0gJCRvYmpbJGluZGV4XTtcblxuamFkZV9taXhpbnNbXCJ0ZXh0YXJlYVwiXSgnb3B0aW9uXycgKyBvcHRpb24sIFwi6YCJ6aG5XCIgKyBvcHRpb24sICdvcHRpb25fJyArIG9wdGlvbik7XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgJGluZGV4IGluICQkb2JqKSB7XG4gICAgICAkJGwrKzsgICAgICB2YXIgb3B0aW9uID0gJCRvYmpbJGluZGV4XTtcblxuamFkZV9taXhpbnNbXCJ0ZXh0YXJlYVwiXSgnb3B0aW9uXycgKyBvcHRpb24sIFwi6YCJ6aG5XCIgKyBvcHRpb24sICdvcHRpb25fJyArIG9wdGlvbik7XG4gICAgfVxuXG4gIH1cbn0pLmNhbGwodGhpcyk7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+PGxhYmVsIGNsYXNzPVxcXCJjb2wtc20tMiBjb250cm9sLWxhYmVsXFxcIj7mraPnoa7nrZTmoYg8L2xhYmVsPjxkaXYgY2xhc3M9XFxcImNvbC1zbS0xMFxcXCI+XCIpO1xuLy8gaXRlcmF0ZSBvcHRpb25zXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IG9wdGlvbnM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyBpIDwgJCRsOyBpKyspIHtcbiAgICAgIHZhciBvcHRpb24gPSAkJG9ialtpXTtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJjaGVja2JveCBjb2wteHMtNiBjb2wtc20tNFxcXCI+PGxhYmVsPjxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgbmFtZT1cXFwiY29ycmVjdF9vcHRpb25cXFwiXCIgKyAoamFkZS5hdHRyKFwidmFsdWVcIiwgaSsxLCB0cnVlLCBmYWxzZSkpICsgXCIvPumAiemhuVwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IG9wdGlvbikgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9sYWJlbD48L2Rpdj5cIik7XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgaSBpbiAkJG9iaikge1xuICAgICAgJCRsKys7ICAgICAgdmFyIG9wdGlvbiA9ICQkb2JqW2ldO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImNoZWNrYm94IGNvbC14cy02IGNvbC1zbS00XFxcIj48bGFiZWw+PGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBuYW1lPVxcXCJjb3JyZWN0X29wdGlvblxcXCJcIiArIChqYWRlLmF0dHIoXCJ2YWx1ZVwiLCBpKzEsIHRydWUsIGZhbHNlKSkgKyBcIi8+6YCJ6aG5XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gb3B0aW9uKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2xhYmVsPjwvZGl2PlwiKTtcbiAgICB9XG5cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxuYnVmLnB1c2goXCI8L2Rpdj48L2Rpdj48L2Zvcm0+PC9kaXY+PGRpdiBjbGFzcz1cXFwibW9kYWwtZm9vdGVyXFxcIj48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdFxcXCI+5Y+W5raIPC9idXR0b24+PGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiPuS/neWtmDwvYnV0dG9uPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCxcInVuZGVmaW5lZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5kZWZpbmVkOnR5cGVvZiB1bmRlZmluZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5lZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChidXR0b24sIGNvbnRlbnQsIGNvcnJlY3Rfb3B0aW9uLCBpZCwgb3B0aW9uX0EsIG9wdGlvbl9CLCBvcHRpb25fQywgb3B0aW9uX0QsIG9wdGlvbl9FLCBvcHRpb25fRiwgdHlwZSkge1xuYnVmLnB1c2goXCI8dGQgY2xhc3M9XFxcImNvbnRlbnRcXFwiPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gY29udGVudCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB0eXBlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGNvcnJlY3Rfb3B0aW9uKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9BKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9CKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9DKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9EKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9FKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG9wdGlvbl9GKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD48YVwiICsgKGphZGUuYXR0cihcInR5cGVcIiwgYnV0dG9uLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgaWQsIHRydWUsIGZhbHNlKSkgKyBcIiBkYXRhLXRvZ2dsZT1cXFwibW9kYWxcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjcXVlc3Rpb25Nb2RhbEZvcm1cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYnRuLXhzXFxcIj7nvJbovpE8L2E+PGEgaWQ9XFxcImRlbGV0ZVxcXCJcIiArIChqYWRlLmF0dHIoXCJ0eXBlXCIsIGJ1dHRvbiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJidG4gYnRuLWRhbmdlciBidG4teHNcXFwiPuWIoOmZpDwvYT48L3RkPlwiKTt9LmNhbGwodGhpcyxcImJ1dHRvblwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguYnV0dG9uOnR5cGVvZiBidXR0b24hPT1cInVuZGVmaW5lZFwiP2J1dHRvbjp1bmRlZmluZWQsXCJjb250ZW50XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5jb250ZW50OnR5cGVvZiBjb250ZW50IT09XCJ1bmRlZmluZWRcIj9jb250ZW50OnVuZGVmaW5lZCxcImNvcnJlY3Rfb3B0aW9uXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5jb3JyZWN0X29wdGlvbjp0eXBlb2YgY29ycmVjdF9vcHRpb24hPT1cInVuZGVmaW5lZFwiP2NvcnJlY3Rfb3B0aW9uOnVuZGVmaW5lZCxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCxcIm9wdGlvbl9BXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fQTp0eXBlb2Ygb3B0aW9uX0EhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9BOnVuZGVmaW5lZCxcIm9wdGlvbl9CXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fQjp0eXBlb2Ygb3B0aW9uX0IhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9COnVuZGVmaW5lZCxcIm9wdGlvbl9DXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fQzp0eXBlb2Ygb3B0aW9uX0MhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9DOnVuZGVmaW5lZCxcIm9wdGlvbl9EXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fRDp0eXBlb2Ygb3B0aW9uX0QhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9EOnVuZGVmaW5lZCxcIm9wdGlvbl9FXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fRTp0eXBlb2Ygb3B0aW9uX0UhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9FOnVuZGVmaW5lZCxcIm9wdGlvbl9GXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRpb25fRjp0eXBlb2Ygb3B0aW9uX0YhPT1cInVuZGVmaW5lZFwiP29wdGlvbl9GOnVuZGVmaW5lZCxcInR5cGVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnR5cGU6dHlwZW9mIHR5cGUhPT1cInVuZGVmaW5lZFwiP3R5cGU6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaWQpIHtcbmphZGVfbWl4aW5zW1wiaW5wdXRcIl0gPSBqYWRlX2ludGVycCA9IGZ1bmN0aW9uKHR5cGUsaWQscGxhY2Vob2xkZXIsbGFiZWwsbmFtZSl7XG52YXIgYmxvY2sgPSAodGhpcyAmJiB0aGlzLmJsb2NrKSwgYXR0cmlidXRlcyA9ICh0aGlzICYmIHRoaXMuYXR0cmlidXRlcykgfHwge307XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPjxsYWJlbFwiICsgKGphZGUuYXR0cihcImZvclwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiY29sLXhzLTIgY29udHJvbC1sYWJlbFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbGFiZWwpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvbGFiZWw+PGRpdiBjbGFzcz1cXFwiY29sLXhzLTEwXFxcIj48aW5wdXRcIiArIChqYWRlLmF0dHIoXCJ0eXBlXCIsIFwiXCIgKyAodHlwZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcImlkXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBcIlwiICsgKHBsYWNlaG9sZGVyKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwibmFtZVwiLCBcIlwiICsgKG5hbWUpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiLz48L2Rpdj48L2Rpdj5cIik7XG59O1xuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5hdHRyKFwiaWRcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgdGFiaW5kZXg9XFxcIi0xXFxcIiByb2xlPVxcXCJkaWFsb2dcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwidXNlckZvcm1MYWJlbFxcXCIgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGNsYXNzPVxcXCJtb2RhbCBmYWRlXFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1kaWFsb2dcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWNvbnRlbnRcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWhlYWRlclxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtZGlzbWlzcz1cXFwibW9kYWxcXFwiIGNsYXNzPVxcXCJjbG9zZVxcXCI+PHNwYW4gYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPiZ0aW1lczs8L3NwYW4+PHNwYW4gY2xhc3M9XFxcInNyLW9ubHlcXFwiPuWFs+mXrTwvc3Bhbj48L2J1dHRvbj48aDQgaWQ9XFxcInVzZXJGb3JtTGFiZWxcXFwiIGNsYXNzPVxcXCJtb2RhbC10aXRsZVxcXCI+6L6T5YWl55So5oi35L+h5oGvPC9oND48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5XFxcIj48cm93Pjxmb3JtIGNsYXNzPVxcXCJmb3JtLWhvcml6b250YWxcXFwiPlwiKTtcbmphZGVfbWl4aW5zW1wiaW5wdXRcIl0oJ3RleHQnLCAndXNlcm5hbWUnLCAn55So5oi35ZCNJywgJ+eUqOaIt+WQjScsICd1c2VybmFtZScpO1xuamFkZV9taXhpbnNbXCJpbnB1dFwiXSgncGFzc3dvcmQnLCAncGFzc3dvcmQnLCAn5a+G56CBJywgJ+WvhueggScsICdwYXNzd29yZCcpO1xuYnVmLnB1c2goXCI8L2Zvcm0+PC9yb3c+PC9kaXY+PGRpdiBjbGFzcz1cXFwibW9kYWwtZm9vdGVyXFxcIj48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdFxcXCI+5Y+W5raIPC9idXR0b24+PGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiPuS/neWtmDwvYnV0dG9uPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGFjdGl2ZSwgYWRtaW4sIGlkLCB1c2VybmFtZSkge1xuYnVmLnB1c2goXCI8dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpZCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB1c2VybmFtZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIpO1xuaWYgKCAhYWRtaW4pXG57XG5idWYucHVzaChcIjxhIHR5cGU9XFxcImJ1dHRvblxcXCJcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIGlkLCB0cnVlLCBmYWxzZSkpICsgXCIgZGF0YS10b2dnbGU9XFxcIm1vZGFsXFxcIiBkYXRhLXRhcmdldD1cXFwiI3VzZXJNb2RhbEZvcm1cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXFxcIj7kv67mlLnlr4bnoIFcIik7XG5pZiAoIGFjdGl2ZSlcbntcbmJ1Zi5wdXNoKFwiPGEgaWQ9XFxcImRlYWN0aXZhdGVcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGFuZ2VyIGJ0bi14c1xcXCI+5Ya757uT5biQ5Y+3PC9hPlwiKTtcbn1cbmVsc2VcbntcbmJ1Zi5wdXNoKFwiPGEgaWQ9XFxcImFjdGl2YXRlXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXN1Y2Nlc3MgYnRuLXhzXFxcIj7mv4DmtLvluJDlj7c8L2E+XCIpO1xufVxuYnVmLnB1c2goXCI8L2E+XCIpO1xufVxuYnVmLnB1c2goXCI8L3RkPlwiKTt9LmNhbGwodGhpcyxcImFjdGl2ZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguYWN0aXZlOnR5cGVvZiBhY3RpdmUhPT1cInVuZGVmaW5lZFwiP2FjdGl2ZTp1bmRlZmluZWQsXCJhZG1pblwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguYWRtaW46dHlwZW9mIGFkbWluIT09XCJ1bmRlZmluZWRcIj9hZG1pbjp1bmRlZmluZWQsXCJpZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaWQ6dHlwZW9mIGlkIT09XCJ1bmRlZmluZWRcIj9pZDp1bmRlZmluZWQsXCJ1c2VybmFtZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudXNlcm5hbWU6dHlwZW9mIHVzZXJuYW1lIT09XCJ1bmRlZmluZWRcIj91c2VybmFtZTp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4oZnVuY3Rpb24oZil7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZigpfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpfWVsc2V7dmFyIGc7aWYodHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCIpe2c9d2luZG93fWVsc2UgaWYodHlwZW9mIGdsb2JhbCE9PVwidW5kZWZpbmVkXCIpe2c9Z2xvYmFsfWVsc2UgaWYodHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiKXtnPXNlbGZ9ZWxzZXtnPXRoaXN9Zy5qYWRlID0gZigpfX0pKGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJzID0gbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbiAgdmFyIGFjID0gYVsnY2xhc3MnXTtcbiAgdmFyIGJjID0gYlsnY2xhc3MnXTtcblxuICBpZiAoYWMgfHwgYmMpIHtcbiAgICBhYyA9IGFjIHx8IFtdO1xuICAgIGJjID0gYmMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjKSkgYWMgPSBbYWNdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShiYykpIGJjID0gW2JjXTtcbiAgICBhWydjbGFzcyddID0gYWMuY29uY2F0KGJjKS5maWx0ZXIobnVsbHMpO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoa2V5ICE9ICdjbGFzcycpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogRmlsdGVyIG51bGwgYHZhbGBzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbnVsbHModmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwgIT09ICcnO1xufVxuXG4vKipcbiAqIGpvaW4gYXJyYXkgYXMgY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmpvaW5DbGFzc2VzID0gam9pbkNsYXNzZXM7XG5mdW5jdGlvbiBqb2luQ2xhc3Nlcyh2YWwpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwubWFwKGpvaW5DbGFzc2VzKSA6XG4gICAgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JykgPyBPYmplY3Qua2V5cyh2YWwpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB2YWxba2V5XTsgfSkgOlxuICAgIFt2YWxdKS5maWx0ZXIobnVsbHMpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gY2xhc3Nlc1xuICogQHBhcmFtIHtBcnJheS48Qm9vbGVhbj59IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5jbHMgPSBmdW5jdGlvbiBjbHMoY2xhc3NlcywgZXNjYXBlZCkge1xuICB2YXIgYnVmID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChlc2NhcGVkICYmIGVzY2FwZWRbaV0pIHtcbiAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuZXNjYXBlKGpvaW5DbGFzc2VzKFtjbGFzc2VzW2ldXSkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLnB1c2goam9pbkNsYXNzZXMoY2xhc3Nlc1tpXSkpO1xuICAgIH1cbiAgfVxuICB2YXIgdGV4dCA9IGpvaW5DbGFzc2VzKGJ1Zik7XG4gIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiAnIGNsYXNzPVwiJyArIHRleHQgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuXG5leHBvcnRzLnN0eWxlID0gZnVuY3Rpb24gKHZhbCkge1xuICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbCkubWFwKGZ1bmN0aW9uIChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlICsgJzonICsgdmFsW3N0eWxlXTtcbiAgICB9KS5qb2luKCc7Jyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxufTtcbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICB2YWwgPSBleHBvcnRzLnN0eWxlKHZhbCk7XG4gIH1cbiAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgdmFsIHx8IG51bGwgPT0gdmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoMCA9PSBrZXkuaW5kZXhPZignZGF0YScpICYmICdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodmFsKS5pbmRleE9mKCcmJykgIT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NpbmNlIEphZGUgMi4wLjAsIGFtcGVyc2FuZHMgKGAmYCkgaW4gZGF0YSBhdHRyaWJ1dGVzICcgK1xuICAgICAgICAgICAgICAgICAgICd3aWxsIGJlIGVzY2FwZWQgdG8gYCZhbXA7YCcpO1xuICAgIH07XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBlbGltaW5hdGUgdGhlIGRvdWJsZSBxdW90ZXMgYXJvdW5kIGRhdGVzIGluICcgK1xuICAgICAgICAgICAgICAgICAgICdJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgXCI9J1wiICsgSlNPTi5zdHJpbmdpZnkodmFsKS5yZXBsYWNlKC8nL2csICcmYXBvczsnKSArIFwiJ1wiO1xuICB9IGVsc2UgaWYgKGVzY2FwZWQpIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyBleHBvcnRzLmVzY2FwZSh2YWwpICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRycyA9IGZ1bmN0aW9uIGF0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYnVmID0gW107XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4gIGlmIChrZXlzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV1cbiAgICAgICAgLCB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT0ga2V5KSB7XG4gICAgICAgIGlmICh2YWwgPSBqb2luQ2xhc3Nlcyh2YWwpKSB7XG4gICAgICAgICAgYnVmLnB1c2goJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmLnB1c2goZXhwb3J0cy5hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIHN0cmluZyBvZiBgaHRtbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciBqYWRlX2VuY29kZV9odG1sX3J1bGVzID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90Oydcbn07XG52YXIgamFkZV9tYXRjaF9odG1sID0gL1smPD5cIl0vZztcblxuZnVuY3Rpb24gamFkZV9lbmNvZGVfY2hhcihjKSB7XG4gIHJldHVybiBqYWRlX2VuY29kZV9odG1sX3J1bGVzW2NdIHx8IGM7XG59XG5cbmV4cG9ydHMuZXNjYXBlID0gamFkZV9lc2NhcGU7XG5mdW5jdGlvbiBqYWRlX2VzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKS5yZXBsYWNlKGphZGVfbWF0Y2hfaHRtbCwgamFkZV9lbmNvZGVfY2hhcik7XG4gIGlmIChyZXN1bHQgPT09ICcnICsgaHRtbCkgcmV0dXJuIGh0bWw7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgamFkZSBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gc3RyIHx8IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgfVxuICB2YXIgY29udGV4dCA9IDNcbiAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICwgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSBjb250ZXh0LCAwKVxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcblxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ0phZGUnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxuZXhwb3J0cy5EZWJ1Z0l0ZW0gPSBmdW5jdGlvbiBEZWJ1Z0l0ZW0obGluZW5vLCBmaWxlbmFtZSkge1xuICB0aGlzLmxpbmVubyA9IGxpbmVubztcbiAgdGhpcy5maWxlbmFtZSA9IGZpbGVuYW1lO1xufVxuXG59LHtcImZzXCI6Mn1dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XX0se30sWzFdKSgxKVxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSJdfQ==
