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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvYXBwL3NjcmlwdHMvYXBwLmNvZmZlZSIsIi9ob21lL2VsbWVyeS9QeWNoYXJtUHJvamVjdHMvSW50UXVpei93ZWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsImFwcC9zY3JpcHRzL2FjY291bnQtcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9hY3Rpdml0eS1wYWdlLmNvZmZlZSIsImFwcC9zY3JpcHRzL2Jvb2stcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9kYXRhL2Jhc2UtY29sbGVjdGlvbi5jb2ZmZWUiLCJhcHAvc2NyaXB0cy9kYXRhL2Jhc2UtbW9kZWwuY29mZmVlIiwiYXBwL3NjcmlwdHMvcXVlc3Rpb24tcGFnZS5jb2ZmZWUiLCJhcHAvc2NyaXB0cy92aWV3cy9tb2RhbC12aWV3LmNvZmZlZSIsImFwcC9zY3JpcHRzL3ZpZXdzL3BhZ2luYXRpb24tdmlldy5jb2ZmZWUiLCJhcHAvc2NyaXB0cy92aWV3cy90YWJsZS12aWV3LmNvZmZlZSIsImFwcC90ZW1wbGF0ZXMvYWN0aXZpdHktcm93LmphZGUiLCJhcHAvdGVtcGxhdGVzL2Jvb2stbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvYm9vay1yb3cuamFkZSIsImFwcC90ZW1wbGF0ZXMvcGFnZS1uYXYuamFkZSIsImFwcC90ZW1wbGF0ZXMvcXVlc3Rpb24tbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvcXVlc3Rpb24tcm93LmphZGUiLCJhcHAvdGVtcGxhdGVzL3VzZXItbW9kYWwuamFkZSIsImFwcC90ZW1wbGF0ZXMvdXNlci1yb3cuamFkZSIsIm5vZGVfbW9kdWxlcy9qYWRlL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgSW50QXBwO1xuXG53aW5kb3cuSW50QXBwID0gSW50QXBwID0ge1xuICBBY2NvdW50UGFnZVZpZXc6IHJlcXVpcmUoJ2FjY291bnQtcGFnZScpLFxuICBCb29rUGFnZVZpZXc6IHJlcXVpcmUoJ2Jvb2stcGFnZScpLFxuICBRdWVzdGlvblBhZ2VWaWV3OiByZXF1aXJlKCdxdWVzdGlvbi1wYWdlJyksXG4gIEFjdGl2aXR5UGFnZVZpZXc6IHJlcXVpcmUoJ2FjdGl2aXR5LXBhZ2UnKVxufTtcblxuIixudWxsLCJ2YXIgQWNjb3VudFBhZ2VWaWV3LCBCYXNlQ29sbGVjdGlvbiwgQmFzZU1vZGVsLCBNb2RhbFZpZXcsIFBhZ2luYXRpb25WaWV3LCBUYWJsZVZpZXcsIFVzZXIsIFVzZXJNb2RhbFZpZXcsIFVzZXJWaWV3LCBVc2VycywgVXNlcnNWaWV3LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZU1vZGVsID0gcmVxdWlyZSgnZGF0YS9iYXNlLW1vZGVsJyk7XG5cbkJhc2VDb2xsZWN0aW9uID0gcmVxdWlyZSgnZGF0YS9iYXNlLWNvbGxlY3Rpb24nKTtcblxuVGFibGVWaWV3ID0gcmVxdWlyZSgndmlld3MvdGFibGUtdmlldycpO1xuXG5QYWdpbmF0aW9uVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3BhZ2luYXRpb24tdmlldycpO1xuXG5Nb2RhbFZpZXcgPSByZXF1aXJlKCd2aWV3cy9tb2RhbC12aWV3Jyk7XG5cblVzZXIgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlciwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gVXNlcigpIHtcbiAgICByZXR1cm4gVXNlci5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXIucHJvdG90eXBlLnVybFJvb3QgPSAnL2FwaS92MS91c2VyJztcblxuICBVc2VyLnByb3RvdHlwZS5kZWZhdWx0cyA9IHtcbiAgICB1c2VybmFtZTogJycsXG4gICAgcGFzc3dvcmQ6ICcnXG4gIH07XG5cbiAgVXNlci5wcm90b3R5cGUudmFsaWRhdGlvbiA9IHtcbiAgICB1c2VybmFtZToge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogJ+eUqOaIt+WQjeS4jeiDveS4uuepuidcbiAgICB9LFxuICAgIHBhc3N3b3JkOiB7XG4gICAgICBibGFuazogZmFsc2UsXG4gICAgICBtaW5MZW5ndGg6IDYsXG4gICAgICBtZXNzYWdlOiAn5a+G56CB5LiN6IO95bCR5LqONuS9jSdcbiAgICB9XG4gIH07XG5cbiAgVXNlci5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXR0cnM7XG4gICAgYXR0cnMgPSB7XG4gICAgICBhY3RpdmU6IHRydWVcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLnNhdmUoYXR0cnMsIHtcbiAgICAgIGF0dHJzOiBhdHRyc1xuICAgIH0pO1xuICB9O1xuXG4gIFVzZXIucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXR0cnM7XG4gICAgYXR0cnMgPSB7XG4gICAgICBhY3RpdmU6IGZhbHNlXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5zYXZlKGF0dHJzLCB7XG4gICAgICBhdHRyczogYXR0cnNcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gVXNlcjtcblxufSkoQmFzZU1vZGVsKTtcblxuVXNlcnMgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlcnMsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFVzZXJzKCkge1xuICAgIHJldHVybiBVc2Vycy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJzLnByb3RvdHlwZS51cmwgPSAnL2FwaS92MS91c2VyJztcblxuICBVc2Vycy5wcm90b3R5cGUubW9kZWwgPSBVc2VyO1xuXG4gIHJldHVybiBVc2VycztcblxufSkoQmFzZUNvbGxlY3Rpb24pO1xuXG5Vc2VyVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChVc2VyVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gVXNlclZpZXcoKSB7XG4gICAgcmV0dXJuIFVzZXJWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVXNlclZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAndHInO1xuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy91c2VyLXJvdycpO1xuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS5ldmVudHMgPSB7XG4gICAgJ2NsaWNrICNkZWFjdGl2YXRlJzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbC5kZWFjdGl2YXRlKCk7XG4gICAgfSxcbiAgICAnY2xpY2sgI2FjdGl2YXRlJzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbC5hY3RpdmF0ZSgpO1xuICAgIH1cbiAgfTtcblxuICBVc2VyVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJzeW5jXCIsIHRoaXMucmVuZGVyKTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcImRlc3Ryb3lcIiwgdGhpcy5yZW1vdmUpO1xuICB9O1xuXG4gIFVzZXJWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBVc2VyVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cblVzZXJNb2RhbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlck1vZGFsVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gVXNlck1vZGFsVmlldygpIHtcbiAgICByZXR1cm4gVXNlck1vZGFsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJNb2RhbFZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL3VzZXItbW9kYWwnKTtcblxuICBVc2VyTW9kYWxWaWV3LnByb3RvdHlwZS5iaW5kaW5ncyA9IHtcbiAgICAnI3VzZXJuYW1lJzogJ3VzZXJuYW1lJyxcbiAgICAnI3Bhc3N3b3JkJzogJ3Bhc3N3b3JkJ1xuICB9O1xuXG4gIHJldHVybiBVc2VyTW9kYWxWaWV3O1xuXG59KShNb2RhbFZpZXcpO1xuXG5Vc2Vyc1ZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoVXNlcnNWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBVc2Vyc1ZpZXcoKSB7XG4gICAgcmV0dXJuIFVzZXJzVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFVzZXJzVmlldy5wcm90b3R5cGUucm93ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICByZXR1cm4gbmV3IFVzZXJWaWV3KHtcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBVc2Vyc1ZpZXc7XG5cbn0pKFRhYmxlVmlldyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQWNjb3VudFBhZ2VWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjY291bnRQYWdlVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQWNjb3VudFBhZ2VWaWV3KCkge1xuICAgIHJldHVybiBBY2NvdW50UGFnZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY2NvdW50UGFnZVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYWdlTmF2VmlldywgdXNlck1vZGFsVmlldywgdXNlcnMsIHVzZXJzVmlldztcbiAgICB1c2VycyA9IG5ldyBVc2VycztcbiAgICB1c2Vyc1ZpZXcgPSBuZXcgVXNlcnNWaWV3KHtcbiAgICAgIGVsOiAkKCcudGFibGUtY29udGFpbmVyJyksXG4gICAgICBjb2xsZWN0aW9uOiB1c2Vyc1xuICAgIH0pO1xuICAgIHBhZ2VOYXZWaWV3ID0gbmV3IFBhZ2luYXRpb25WaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHVzZXJzXG4gICAgfSk7XG4gICAgdXNlcnNWaWV3LiRlbC5hZnRlcihwYWdlTmF2Vmlldy5yZW5kZXIoKS4kZWwpO1xuICAgIHVzZXJNb2RhbFZpZXcgPSBuZXcgVXNlck1vZGFsVmlldyh7XG4gICAgICBpZDogJ3VzZXJNb2RhbEZvcm0nLFxuICAgICAgY29sbGVjdGlvbjogdXNlcnNcbiAgICB9KTtcbiAgICB1c2VyTW9kYWxWaWV3LnJlbmRlcigpO1xuICAgIHVzZXJzLmZldGNoKHtcbiAgICAgIHJlc2V0OiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIEFjY291bnRQYWdlVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBBY3Rpdml0aWVzLCBBY3Rpdml0aWVzVmlldywgQWN0aXZpdHksIEFjdGl2aXR5UGFnZVZpZXcsIEFjdGl2aXR5VmlldywgQmFzZUNvbGxlY3Rpb24sIEJhc2VNb2RlbCwgREFURVRJTUVfRk9STUFULCBNb2RhbFZpZXcsIFBhZ2luYXRpb25WaWV3LCBUYWJsZVZpZXcsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5CYXNlTW9kZWwgPSByZXF1aXJlKCdkYXRhL2Jhc2UtbW9kZWwnKTtcblxuQmFzZUNvbGxlY3Rpb24gPSByZXF1aXJlKCdkYXRhL2Jhc2UtY29sbGVjdGlvbicpO1xuXG5UYWJsZVZpZXcgPSByZXF1aXJlKCd2aWV3cy90YWJsZS12aWV3Jyk7XG5cblBhZ2luYXRpb25WaWV3ID0gcmVxdWlyZSgndmlld3MvcGFnaW5hdGlvbi12aWV3Jyk7XG5cbk1vZGFsVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL21vZGFsLXZpZXcnKTtcblxuREFURVRJTUVfRk9STUFUID0gJ1lZWVktTU0tREQgSEg6bW06c3MnO1xuXG5BY3Rpdml0eSA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChBY3Rpdml0eSwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQWN0aXZpdHkoKSB7XG4gICAgcmV0dXJuIEFjdGl2aXR5Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQWN0aXZpdHkucHJvdG90eXBlLnVybFJvb3QgPSAnL2FwaS92MS9hY3Rpdml0eS8nO1xuXG4gIEFjdGl2aXR5LnByb3RvdHlwZS5kZWZhdWx0cyA9IHtcbiAgICBcImluZm9fZmllbGRfMVwiOiBcIlwiLFxuICAgIFwiaW5mb19maWVsZF8yXCI6IFwiXCIsXG4gICAgXCJpbmZvX2ZpZWxkXzNcIjogXCJcIlxuICB9O1xuXG4gIHJldHVybiBBY3Rpdml0eTtcblxufSkoQmFzZU1vZGVsKTtcblxuQWN0aXZpdGllcyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChBY3Rpdml0aWVzLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBBY3Rpdml0aWVzKCkge1xuICAgIHJldHVybiBBY3Rpdml0aWVzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQWN0aXZpdGllcy5wcm90b3R5cGUudXJsID0gJy9hcGkvdjEvYWN0aXZpdHkvJztcblxuICBBY3Rpdml0aWVzLnByb3RvdHlwZS5tb2RlbCA9IEFjdGl2aXR5O1xuXG4gIHJldHVybiBBY3Rpdml0aWVzO1xuXG59KShCYXNlQ29sbGVjdGlvbik7XG5cbkFjdGl2aXR5VmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChBY3Rpdml0eVZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEFjdGl2aXR5VmlldygpIHtcbiAgICByZXR1cm4gQWN0aXZpdHlWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQWN0aXZpdHlWaWV3LnByb3RvdHlwZS50YWdOYW1lID0gJ3RyJztcblxuICBBY3Rpdml0eVZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL2FjdGl2aXR5LXJvdycpO1xuXG4gIEFjdGl2aXR5Vmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhdGEsIGVuZF9hdCwgZnJvbnRfaG9zdCwgbm93LCBzdGFydF9hdDtcbiAgICBmcm9udF9ob3N0ID0gd2luZG93LmZyb250X2hvc3QgfHwgJy8nO1xuICAgIGRhdGEgPSB0aGlzLm1vZGVsLnRvSlNPTigpO1xuICAgIHN0YXJ0X2F0ID0gbmV3IG1vbWVudChkYXRhLnN0YXJ0X2F0LCBEQVRFVElNRV9GT1JNQVQpO1xuICAgIGVuZF9hdCA9IG5ldyBtb21lbnQoZGF0YS5lbmRfYXQsIERBVEVUSU1FX0ZPUk1BVCk7XG4gICAgbm93ID0gbmV3IG1vbWVudCgpO1xuICAgIGRhdGFbJ3N0YXR1cyddID0gKHN0YXJ0X2F0IDwgbm93ICYmIG5vdyA8IGVuZF9hdCkgPyAn5byA5ZCvJyA6ICflhbPpl60nO1xuICAgIGRhdGFbJ3VybCddID0gXCJodHRwOi8vXCIgKyBmcm9udF9ob3N0ICsgXCIvaW5kZXguaHRtbCNcIiArIGRhdGFbJ2NvZGUnXTtcbiAgICBkYXRhWyd0eXBlJ10gPSAoZnVuY3Rpb24oKSB7XG4gICAgICBzd2l0Y2ggKGRhdGFbJ3R5cGUnXSkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgcmV0dXJuICfmma7pgJonO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgcmV0dXJuICfpmZDml7YnO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgcmV0dXJuICfmjJHmiJgnO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiAn5pyq55+lJztcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZShkYXRhKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIEFjdGl2aXR5VmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbkFjdGl2aXRpZXNWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEFjdGl2aXRpZXNWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBBY3Rpdml0aWVzVmlldygpIHtcbiAgICByZXR1cm4gQWN0aXZpdGllc1ZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBY3Rpdml0aWVzVmlldy5wcm90b3R5cGUucm93ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICByZXR1cm4gbmV3IEFjdGl2aXR5Vmlldyh7XG4gICAgICBtb2RlbDogbW9kZWxcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gQWN0aXZpdGllc1ZpZXc7XG5cbn0pKFRhYmxlVmlldyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aXZpdHlQYWdlVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChBY3Rpdml0eVBhZ2VWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBBY3Rpdml0eVBhZ2VWaWV3KCkge1xuICAgIHJldHVybiBBY3Rpdml0eVBhZ2VWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQWN0aXZpdHlQYWdlVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjdGl2aXRpZXMsIGFjdGl2aXRpZXNWaWV3LCBwYWdlTmF2VmlldztcbiAgICBhY3Rpdml0aWVzID0gbmV3IEFjdGl2aXRpZXM7XG4gICAgYWN0aXZpdGllc1ZpZXcgPSBuZXcgQWN0aXZpdGllc1ZpZXcoe1xuICAgICAgZWw6ICQoJyNhY3Rpdml0eS10YWJsZS1jb250YWluZXInKSxcbiAgICAgIGNvbGxlY3Rpb246IGFjdGl2aXRpZXNcbiAgICB9KTtcbiAgICBwYWdlTmF2VmlldyA9IG5ldyBQYWdpbmF0aW9uVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiBhY3Rpdml0aWVzXG4gICAgfSk7XG4gICAgYWN0aXZpdGllc1ZpZXcuJGVsLmFmdGVyKHBhZ2VOYXZWaWV3LnJlbmRlcigpLiRlbCk7XG4gICAgYWN0aXZpdGllcy5mZXRjaCh7XG4gICAgICByZXNldDogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBBY3Rpdml0eVBhZ2VWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIEJhc2VDb2xsZWN0aW9uLCBCYXNlTW9kZWwsIEJvb2tQYWdlVmlldywgTW9kYWxWaWV3LCBQYWdpbmF0aW9uVmlldywgUXVpekJvb2ssIFF1aXpCb29rTW9kYWxWaWV3LCBRdWl6Qm9va1ZpZXcsIFF1aXpCb29rcywgUXVpekJvb2tzVmlldywgVGFibGVWaWV3LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZU1vZGVsID0gcmVxdWlyZSgnZGF0YS9iYXNlLW1vZGVsJyk7XG5cbkJhc2VDb2xsZWN0aW9uID0gcmVxdWlyZSgnZGF0YS9iYXNlLWNvbGxlY3Rpb24nKTtcblxuVGFibGVWaWV3ID0gcmVxdWlyZSgndmlld3MvdGFibGUtdmlldycpO1xuXG5QYWdpbmF0aW9uVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3BhZ2luYXRpb24tdmlldycpO1xuXG5Nb2RhbFZpZXcgPSByZXF1aXJlKCd2aWV3cy9tb2RhbC12aWV3Jyk7XG5cblF1aXpCb29rID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1aXpCb29rLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWl6Qm9vaygpIHtcbiAgICByZXR1cm4gUXVpekJvb2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWl6Qm9vay5wcm90b3R5cGUudXJsUm9vdCA9ICcvYXBpL3YxL3F1aXpib29rJztcblxuICBRdWl6Qm9vay5wcm90b3R5cGUudmFsaWRhdGlvbiA9IHtcbiAgICB0aXRsZToge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogJ+mimOW6k+WQjeS4jeiDveS4uuepuidcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFF1aXpCb29rO1xuXG59KShCYXNlTW9kZWwpO1xuXG5RdWl6Qm9va3MgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVpekJvb2tzLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWl6Qm9va3MoKSB7XG4gICAgcmV0dXJuIFF1aXpCb29rcy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1aXpCb29rcy5wcm90b3R5cGUudXJsID0gJy9hcGkvdjEvcXVpemJvb2snO1xuXG4gIFF1aXpCb29rcy5wcm90b3R5cGUubW9kZWwgPSBRdWl6Qm9vaztcblxuICByZXR1cm4gUXVpekJvb2tzO1xuXG59KShCYXNlQ29sbGVjdGlvbik7XG5cblF1aXpCb29rVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWl6Qm9va1ZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1aXpCb29rVmlldygpIHtcbiAgICByZXR1cm4gUXVpekJvb2tWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVpekJvb2tWaWV3LnByb3RvdHlwZS50YWdOYW1lID0gJ3RyJztcblxuICBRdWl6Qm9va1ZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL2Jvb2stcm93Jyk7XG5cbiAgUXVpekJvb2tWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJzeW5jXCIsIHRoaXMucmVuZGVyKTtcbiAgfTtcblxuICBRdWl6Qm9va1ZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIFF1aXpCb29rVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cblF1aXpCb29rTW9kYWxWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1aXpCb29rTW9kYWxWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWl6Qm9va01vZGFsVmlldygpIHtcbiAgICByZXR1cm4gUXVpekJvb2tNb2RhbFZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWl6Qm9va01vZGFsVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvYm9vay1tb2RhbCcpO1xuXG4gIFF1aXpCb29rTW9kYWxWaWV3LnByb3RvdHlwZS5iaW5kaW5ncyA9IHtcbiAgICAnI3RpdGxlJzogJ3RpdGxlJ1xuICB9O1xuXG4gIHJldHVybiBRdWl6Qm9va01vZGFsVmlldztcblxufSkoTW9kYWxWaWV3KTtcblxuUXVpekJvb2tzVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWl6Qm9va3NWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWl6Qm9va3NWaWV3KCkge1xuICAgIHJldHVybiBRdWl6Qm9va3NWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVpekJvb2tzVmlldy5wcm90b3R5cGUucm93ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICByZXR1cm4gbmV3IFF1aXpCb29rVmlldyh7XG4gICAgICBtb2RlbDogbW9kZWxcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gUXVpekJvb2tzVmlldztcblxufSkoVGFibGVWaWV3KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb29rUGFnZVZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQm9va1BhZ2VWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBCb29rUGFnZVZpZXcoKSB7XG4gICAgcmV0dXJuIEJvb2tQYWdlVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEJvb2tQYWdlVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhZ2VOYXZWaWV3LCBxdWl6Qm9va01vZGFsVmlldywgcXVpekJvb2tzLCBxdWl6Qm9va3NWaWV3O1xuICAgIHF1aXpCb29rcyA9IG5ldyBRdWl6Qm9va3M7XG4gICAgcXVpekJvb2tzVmlldyA9IG5ldyBRdWl6Qm9va3NWaWV3KHtcbiAgICAgIGVsOiAkKCcjcXVpemJvb2stdGFibGUtY29udGFpbmVyJyksXG4gICAgICBjb2xsZWN0aW9uOiBxdWl6Qm9va3NcbiAgICB9KTtcbiAgICBwYWdlTmF2VmlldyA9IG5ldyBQYWdpbmF0aW9uVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiBxdWl6Qm9va3NcbiAgICB9KTtcbiAgICBxdWl6Qm9va3NWaWV3LiRlbC5hZnRlcihwYWdlTmF2Vmlldy5yZW5kZXIoKS4kZWwpO1xuICAgIHF1aXpCb29rTW9kYWxWaWV3ID0gbmV3IFF1aXpCb29rTW9kYWxWaWV3KHtcbiAgICAgIGlkOiAnYm9va01vZGFsRm9ybScsXG4gICAgICBjb2xsZWN0aW9uOiBxdWl6Qm9va3NcbiAgICB9KTtcbiAgICBxdWl6Qm9va01vZGFsVmlldy5yZW5kZXIoKTtcbiAgICBxdWl6Qm9va3MuZmV0Y2goe1xuICAgICAgcmVzZXQ6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gQm9va1BhZ2VWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIEJhc2VDb2xsZWN0aW9uLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuQmFzZUNvbGxlY3Rpb24gPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQmFzZUNvbGxlY3Rpb24sIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEJhc2VDb2xsZWN0aW9uKCkge1xuICAgIHJldHVybiBCYXNlQ29sbGVjdGlvbi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEJhc2VDb2xsZWN0aW9uLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLm1ldGEpIHtcbiAgICAgIHRoaXMubWV0YSA9IGRhdGEubWV0YTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGEgJiYgZGF0YS5vYmplY3RzIHx8IGRhdGE7XG4gIH07XG5cbiAgcmV0dXJuIEJhc2VDb2xsZWN0aW9uO1xuXG59KShCYWNrYm9uZS5Db2xsZWN0aW9uKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQ29sbGVjdGlvbjtcblxuIiwidmFyIEJhc2VNb2RlbCxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VNb2RlbCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChCYXNlTW9kZWwsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEJhc2VNb2RlbCgpIHtcbiAgICByZXR1cm4gQmFzZU1vZGVsLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQmFzZU1vZGVsLnByb3RvdHlwZS51cmwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3JpZ1VybDtcbiAgICBvcmlnVXJsID0gQmFzZU1vZGVsLl9fc3VwZXJfXy51cmwuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gb3JpZ1VybCArIChvcmlnVXJsLmxlbmd0aCA+IDAgJiYgb3JpZ1VybC5jaGFyQXQob3JpZ1VybC5sZW5ndGggLSAxKSA9PT0gJy8nID8gJycgOiAnLycpO1xuICB9O1xuXG4gIEJhc2VNb2RlbC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5vYmplY3RzICYmIF8uaXNBcnJheShkYXRhLm9iamVjdHMpKSB7XG4gICAgICByZXR1cm4gZGF0YS5vYmplY3RzWzBdIHx8IHt9O1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICByZXR1cm4gQmFzZU1vZGVsO1xuXG59KShCYWNrYm9uZS5Nb2RlbCk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZU1vZGVsO1xuXG4iLCJ2YXIgQmFzZUNvbGxlY3Rpb24sIEJhc2VNb2RlbCwgTW9kYWxWaWV3LCBQYWdpbmF0aW9uVmlldywgUXVlc3Rpb24sIFF1ZXN0aW9uTGlzdFBhbmVsVmlldywgUXVlc3Rpb25Nb2RhbFZpZXcsIFF1ZXN0aW9uUGFnZVZpZXcsIFF1ZXN0aW9uVmlldywgUXVlc3Rpb25zLCBRdWVzdGlvbnNWaWV3LCBUYWJsZVZpZXcsIGNoYXIySW50LCBpbnQyQ2hhcixcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkJhc2VNb2RlbCA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1tb2RlbCcpO1xuXG5CYXNlQ29sbGVjdGlvbiA9IHJlcXVpcmUoJ2RhdGEvYmFzZS1jb2xsZWN0aW9uJyk7XG5cblRhYmxlVmlldyA9IHJlcXVpcmUoJ3ZpZXdzL3RhYmxlLXZpZXcnKTtcblxuUGFnaW5hdGlvblZpZXcgPSByZXF1aXJlKCd2aWV3cy9wYWdpbmF0aW9uLXZpZXcnKTtcblxuTW9kYWxWaWV3ID0gcmVxdWlyZSgndmlld3MvbW9kYWwtdmlldycpO1xuXG5pbnQyQ2hhciA9IGZ1bmN0aW9uKGkpIHtcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoNjQgKyBwYXJzZUludChpKSk7XG59O1xuXG5jaGFyMkludCA9IGZ1bmN0aW9uKGMpIHtcbiAgaWYgKCEhYykge1xuICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGM7XG4gIH1cbn07XG5cblF1ZXN0aW9uID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1ZXN0aW9uLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvbigpIHtcbiAgICByZXR1cm4gUXVlc3Rpb24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWVzdGlvbi5wcm90b3R5cGUudXJsUm9vdCA9ICcvYXBpL3YxL3F1ZXN0aW9uLyc7XG5cbiAgUXVlc3Rpb24ucHJvdG90eXBlLmRlZmF1bHRzID0ge1xuICAgIFwidHlwZVwiOiAxLFxuICAgIFwiY29ycmVjdF9vcHRpb25cIjogXCIxXCIsXG4gICAgXCJvcHRpb25fQVwiOiBcIlwiLFxuICAgIFwib3B0aW9uX0JcIjogXCJcIixcbiAgICBcIm9wdGlvbl9DXCI6IFwiXCIsXG4gICAgXCJvcHRpb25fRFwiOiBcIlwiLFxuICAgIFwib3B0aW9uX0VcIjogXCJcIixcbiAgICBcIm9wdGlvbl9GXCI6IFwiXCJcbiAgfTtcblxuICBRdWVzdGlvbi5wcm90b3R5cGUudmFsaWRhdGlvbiA9IHtcbiAgICBjb250ZW50OiB7XG4gICAgICBibGFuazogZmFsc2UsXG4gICAgICBtZXNzYWdlOiAn6aKY55uu5YaF5a655LiN6IO95Li656m6J1xuICAgIH0sXG4gICAgdHlwZToge1xuICAgICAgYmxhbms6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gMSB8fCB2YWx1ZSA9PT0gMjtcbiAgICAgIH0sXG4gICAgICBtZXNzYWdlOiAn6aKY55uu57G75Z6L5b+F6aG75piv5aSa6YCJ5oiW5Y2V6YCJJ1xuICAgIH0sXG4gICAgY29ycmVjdF9vcHRpb246IHtcbiAgICAgIGJsYW5rOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB2YWx1ZSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICBzd2l0Y2ggKGZhbHNlKSB7XG4gICAgICAgICAgICBjYXNlICFfLmlzQXJyYXkodmFsdWUpOlxuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICBjYXNlICFfLmlzU3RyaW5nKHZhbHVlKTpcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm4gIShfLmlzRW1wdHkodmFsdWUpKSAmJiBfLmV2ZXJ5KHZhbHVlLCAoZnVuY3Rpb24oaSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldCgnb3B0aW9uXycgKyBpbnQyQ2hhcihpKSk7XG4gICAgICAgIH0pLCB0aGlzKTtcbiAgICAgIH0sXG4gICAgICBtZXNzYWdlOiAn5q2j56Gu562U5qGI6K6+572u5Ye66ZSZ77yM5rOo5oSP5a+55bqU55qE6YCJ6aG55piv5ZCm6K6+572u5LqG562U5qGIJ1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb247XG5cbn0pKEJhc2VNb2RlbCk7XG5cblF1ZXN0aW9ucyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvbnMsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9ucygpIHtcbiAgICByZXR1cm4gUXVlc3Rpb25zLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb25zLnByb3RvdHlwZS51cmwgPSAnL2FwaS92MS9xdWVzdGlvbi8nO1xuXG4gIFF1ZXN0aW9ucy5wcm90b3R5cGUubW9kZWwgPSBRdWVzdGlvbjtcblxuICBRdWVzdGlvbnMucHJvdG90eXBlLnN0YXRlID0ge307XG5cbiAgUXVlc3Rpb25zLnByb3RvdHlwZS5mZXRjaCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBvcHRpb25zID0gXy5leHRlbmQoe30sIG9wdGlvbnMpO1xuICAgIGRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgb3B0aW9ucy5kYXRhID0gXy5leHRlbmQoe30sIHRoaXMuc3RhdGUsIGRhdGEpO1xuICAgIHJldHVybiBRdWVzdGlvbnMuX19zdXBlcl9fLmZldGNoLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXN0aW9ucztcblxufSkoQmFzZUNvbGxlY3Rpb24pO1xuXG5RdWVzdGlvblZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUXVlc3Rpb25WaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBRdWVzdGlvblZpZXcoKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9uVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFF1ZXN0aW9uVmlldy5wcm90b3R5cGUudGFnTmFtZSA9ICd0cic7XG5cbiAgUXVlc3Rpb25WaWV3LnByb3RvdHlwZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJ3RlbXBsYXRlcy9xdWVzdGlvbi1yb3cnKTtcblxuICBRdWVzdGlvblZpZXcucHJvdG90eXBlLmV2ZW50cyA9IHtcbiAgICAnY2xpY2sgI2RlbGV0ZSc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZGVzdHJveSgpO1xuICAgIH1cbiAgfTtcblxuICBRdWVzdGlvblZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsIFwic3luY1wiLCB0aGlzLnJlbmRlcik7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJkZXN0cm95XCIsIHRoaXMucmVtb3ZlKTtcbiAgfTtcblxuICBRdWVzdGlvblZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb3JyZWN0LCBkYXRhO1xuICAgIGRhdGEgPSB0aGlzLm1vZGVsLnRvSlNPTigpO1xuICAgIGNvcnJlY3QgPSBkYXRhWydjb3JyZWN0X29wdGlvbiddLnNwbGl0KCcsJyk7XG4gICAgZGF0YVsnY29ycmVjdF9vcHRpb24nXSA9IF8ubWFwKGNvcnJlY3QsIGludDJDaGFyKS5qb2luKCk7XG4gICAgZGF0YVsndHlwZSddID0gKGZ1bmN0aW9uKCkge1xuICAgICAgc3dpdGNoIChkYXRhWyd0eXBlJ10pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHJldHVybiAn5Y2V6YCJJztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHJldHVybiAn5aSa6YCJJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gJ+WkmumAiSc7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoZGF0YSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvblZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG5RdWVzdGlvbnNWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1ZXN0aW9uc1ZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uc1ZpZXcoKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9uc1ZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWVzdGlvbnNWaWV3LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHJldHVybiBuZXcgUXVlc3Rpb25WaWV3KHtcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvbnNWaWV3O1xuXG59KShUYWJsZVZpZXcpO1xuXG5RdWVzdGlvbk1vZGFsVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChRdWVzdGlvbk1vZGFsVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb25Nb2RhbFZpZXcoKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9uTW9kYWxWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUXVlc3Rpb25Nb2RhbFZpZXcucHJvdG90eXBlLnRlbXBsYXRlID0gcmVxdWlyZSgndGVtcGxhdGVzL3F1ZXN0aW9uLW1vZGFsJyk7XG5cbiAgUXVlc3Rpb25Nb2RhbFZpZXcucHJvdG90eXBlLmJpbmRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9iaW5kaW5ncywgY29kZSwgaiwgbGVuLCByZWY7XG4gICAgX2JpbmRpbmdzID0ge1xuICAgICAgJ1tuYW1lPWNvbnRlbnRdJzogJ2NvbnRlbnQnLFxuICAgICAgJ1tuYW1lPXR5cGVdJzoge1xuICAgICAgICBvYnNlcnZlOiAndHlwZScsXG4gICAgICAgIHNlbGVjdE9wdGlvbnM6IHtcbiAgICAgICAgICBjb2xsZWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+WNlemAiScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDFcbiAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAn5aSa6YCJJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0T3B0aW9uczoge1xuICAgICAgICAgIHNpbGVudDogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdbbmFtZT1jb3JyZWN0X29wdGlvbl0nOiB7XG4gICAgICAgIG9ic2VydmU6ICdjb3JyZWN0X29wdGlvbicsXG4gICAgICAgIG9uR2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS5zcGxpdCgnLCcpO1xuICAgICAgICB9LFxuICAgICAgICBvblNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmpvaW4oJywnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgcmVmID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRiddO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgY29kZSA9IHJlZltqXTtcbiAgICAgIF9iaW5kaW5nc1tcIltuYW1lPW9wdGlvbl9cIiArIGNvZGUgKyBcIl1cIl0gPSAnb3B0aW9uXycgKyBjb2RlO1xuICAgIH1cbiAgICByZXR1cm4gX2JpbmRpbmdzO1xuICB9O1xuXG4gIFF1ZXN0aW9uTW9kYWxWaWV3LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oZSkge1xuICAgIFF1ZXN0aW9uTW9kYWxWaWV3Ll9fc3VwZXJfXy5zaG93LmNhbGwodGhpcywgZSk7XG4gICAgaWYgKHRoaXMubW9kZWwuaXNOZXcoKSkge1xuICAgICAgdGhpcy5tb2RlbC5zZXQoJ2Jvb2snLCB0aGlzLmNvbGxlY3Rpb24uc3RhdGUuYm9vayk7XG4gICAgfVxuICAgIHRoaXMuY2hhbmdlVHlwZSh0aGlzLm1vZGVsLCB0aGlzLm1vZGVsLmdldCgndHlwZScpKTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcImNoYW5nZTp0eXBlXCIsIHRoaXMuY2hhbmdlVHlwZSk7XG4gIH07XG5cbiAgUXVlc3Rpb25Nb2RhbFZpZXcucHJvdG90eXBlLmNoYW5nZVR5cGUgPSBmdW5jdGlvbihtb2RlbCwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgY3VyVmFsLCB0eXBlO1xuICAgIHR5cGUgPSB2YWx1ZSA9PT0gMSA/ICdyYWRpbycgOiAnY2hlY2tib3gnO1xuICAgIGN1clZhbCA9IG1vZGVsLmdldCgnY29ycmVjdF9vcHRpb24nKTtcbiAgICBpZiAodHlwZSA9PT0gJ3JhZGlvJyAmJiBjdXJWYWwpIHtcbiAgICAgIG1vZGVsLnNldCgnY29ycmVjdF9vcHRpb24nLCBjdXJWYWxbMF0pO1xuICAgIH1cbiAgICB0aGlzLiQoJ2lucHV0W25hbWU9Y29ycmVjdF9vcHRpb25dJykucHJvcCgndHlwZScsIHR5cGUpO1xuICAgIHJldHVybiB0aGlzLnN0aWNraXQoKTtcbiAgfTtcblxuICBRdWVzdGlvbk1vZGFsVmlldy5wcm90b3R5cGUub25JbnZhbGlkRmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgZXJyb3JzLCBtb2RlbCkge1xuICAgIHZhciBlcnJvciwgZmllbGQsIGdyb3VwLCBqLCBsZW47XG4gICAgaWYgKG5hbWUgIT09ICdjb3JyZWN0X29wdGlvbicpIHtcbiAgICAgIHJldHVybiBRdWVzdGlvbk1vZGFsVmlldy5fX3N1cGVyX18ub25JbnZhbGlkRmllbGQuY2FsbCh0aGlzLCBuYW1lLCB2YWx1ZSwgZXJyb3JzLCBtb2RlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpZWxkID0gdGhpcy4kKFwiW25hbWU9XCIgKyBuYW1lICsgXCJdXCIpO1xuICAgICAgZ3JvdXAgPSBmaWVsZC5jbG9zZXN0KCcuZm9ybS1ncm91cCcpO1xuICAgICAgZ3JvdXAuZmluZCgnLmhlbHAtYmxvY2snKS5yZW1vdmUoKTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IGVycm9ycy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBlcnJvciA9IGVycm9yc1tqXTtcbiAgICAgICAgZ3JvdXAuYXBwZW5kKFwiPGRpdiBjbGFzcz0naGVscC1ibG9jayBjb2wtc20tb2Zmc2V0LTInPlwiICsgZXJyb3IgKyBcIjwvZGl2PlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBncm91cC5hZGRDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBRdWVzdGlvbk1vZGFsVmlldztcblxufSkoTW9kYWxWaWV3KTtcblxuUXVlc3Rpb25MaXN0UGFuZWxWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1ZXN0aW9uTGlzdFBhbmVsVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUXVlc3Rpb25MaXN0UGFuZWxWaWV3KCkge1xuICAgIHJldHVybiBRdWVzdGlvbkxpc3RQYW5lbFZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWVzdGlvbkxpc3RQYW5lbFZpZXcucHJvdG90eXBlLmV2ZW50cyA9IHtcbiAgICAnY2hhbmdlICNib29rJzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLnN0YXRlLmJvb2sgPSB0aGlzLiQoJyNib29rJykudmFsKCk7XG4gICAgfSxcbiAgICAnY2xpY2sgI2xvYWRCb29rJzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZldGNoKHtcbiAgICAgICAgcmVzZXQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUXVlc3Rpb25MaXN0UGFuZWxWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvblBhZ2VWaWV3ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFF1ZXN0aW9uUGFnZVZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFF1ZXN0aW9uUGFnZVZpZXcoKSB7XG4gICAgcmV0dXJuIFF1ZXN0aW9uUGFnZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBRdWVzdGlvblBhZ2VWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihib29rSWQpIHtcbiAgICB2YXIgcGFnZU5hdlZpZXcsIHBhbmVsVmlldywgcXVlc3Rpb25Nb2RhbFZpZXcsIHF1ZXN0aW9ucywgcXVlc3Rpb25zVmlldztcbiAgICBpZiAoIWJvb2tJZCkge1xuICAgICAgYm9va0lkID0gJCgnZm9ybSBzZWxlY3RbbmFtZT1ib29rXScpLnZhbCgpO1xuICAgIH1cbiAgICBxdWVzdGlvbnMgPSBuZXcgUXVlc3Rpb25zO1xuICAgIHF1ZXN0aW9ucy5zdGF0ZS5ib29rID0gYm9va0lkO1xuICAgIHBhbmVsVmlldyA9IG5ldyBRdWVzdGlvbkxpc3RQYW5lbFZpZXcoe1xuICAgICAgZWw6ICQoJy50YWJsZS1jb250cm9sJyksXG4gICAgICBjb2xsZWN0aW9uOiBxdWVzdGlvbnNcbiAgICB9KTtcbiAgICBxdWVzdGlvbnNWaWV3ID0gbmV3IFF1ZXN0aW9uc1ZpZXcoe1xuICAgICAgZWw6ICQoJyNxdWVzdGlvbi10YWJsZS1jb250YWluZXInKSxcbiAgICAgIGNvbGxlY3Rpb246IHF1ZXN0aW9uc1xuICAgIH0pO1xuICAgIHBhZ2VOYXZWaWV3ID0gbmV3IFBhZ2luYXRpb25WaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHF1ZXN0aW9uc1xuICAgIH0pO1xuICAgIHF1ZXN0aW9uc1ZpZXcuJGVsLmFmdGVyKHBhZ2VOYXZWaWV3LnJlbmRlcigpLiRlbCk7XG4gICAgcXVlc3Rpb25Nb2RhbFZpZXcgPSBuZXcgUXVlc3Rpb25Nb2RhbFZpZXcoe1xuICAgICAgaWQ6ICdxdWVzdGlvbk1vZGFsRm9ybScsXG4gICAgICBjb2xsZWN0aW9uOiBxdWVzdGlvbnNcbiAgICB9KTtcbiAgICBxdWVzdGlvbk1vZGFsVmlldy5yZW5kZXIoKTtcbiAgICBxdWVzdGlvbnMuZmV0Y2goe1xuICAgICAgcmVzZXQ6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gUXVlc3Rpb25QYWdlVmlldy5fX3N1cGVyX18ucmVuZGVyLmNhbGwodGhpcyk7XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXN0aW9uUGFnZVZpZXc7XG5cbn0pKEJhY2tib25lLlZpZXcpO1xuXG4iLCJ2YXIgTW9kYWxWaWV3LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbFZpZXcgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoTW9kYWxWaWV3LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBNb2RhbFZpZXcoKSB7XG4gICAgcmV0dXJuIE1vZGFsVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgJCgnIycgKyB0aGlzLmlkKS5yZW1vdmUoKTtcbiAgICAkKCdib2R5JykuYXBwZW5kKHRoaXMudGVtcGxhdGUoe1xuICAgICAgaWQ6IHRoaXMuaWRcbiAgICB9KSk7XG4gICAgdGhpcy5zZXRFbGVtZW50KCQoJyMnICsgdGhpcy5pZCkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUuZXZlbnRzID0ge1xuICAgICdzaG93LmJzLm1vZGFsJzogJ3Nob3cnLFxuICAgICdoaWRkZW4uYnMubW9kYWwnOiAnaGlkZGVuJyxcbiAgICAnY2xpY2sgW3R5cGU9c3VibWl0XSc6ICdzYXZlJ1xuICB9O1xuXG4gIE1vZGFsVmlldy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0gJChlLnJlbGF0ZWRUYXJnZXQpLmRhdGEoKTtcbiAgICB0aGlzLm1vZGVsID0gZGF0YS5pZCA/IHRoaXMuY29sbGVjdGlvbi5nZXQoZGF0YS5pZCkgOiBuZXcgdGhpcy5jb2xsZWN0aW9uLm1vZGVsO1xuICAgIHRoaXMuc3RpY2tpdCgpO1xuICAgIHRoaXMuYmluZFZhbGlkYXRpb24oKTtcbiAgICBpZiAoIXRoaXMubW9kZWwuaXNOZXcoKSkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWwudmFsaWRhdGUoKTtcbiAgICB9XG4gIH07XG5cbiAgTW9kYWxWaWV3LnByb3RvdHlwZS5oaWRkZW4gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnVuc3RpY2tpdCgpO1xuICAgIHRoaXMuc3RvcExpc3RlbmluZygpO1xuICAgIHJldHVybiBkZWxldGUgdGhpcy5tb2RlbDtcbiAgfTtcblxuICBNb2RhbFZpZXcucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHhocjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgeGhyID0gdGhpcy5tb2RlbC5zYXZlKCk7XG4gICAgaWYgKHhocikge1xuICAgICAgcmV0dXJuIHhoci50aGVuKCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIF90aGlzLmNvbGxlY3Rpb24uYWRkKF90aGlzLm1vZGVsKTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuJGVsLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkpO1xuICAgIH1cbiAgfTtcblxuICBNb2RhbFZpZXcucHJvdG90eXBlLm9uVmFsaWRGaWVsZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBtb2RlbCkge1xuICAgIHZhciBmaWVsZCwgZ3JvdXA7XG4gICAgZmllbGQgPSB0aGlzLiQoXCJbbmFtZT1cIiArIG5hbWUgKyBcIl1cIik7XG4gICAgZ3JvdXAgPSBmaWVsZC5jbG9zZXN0KCcuZm9ybS1ncm91cCcpO1xuICAgIGdyb3VwLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcbiAgICByZXR1cm4gZ3JvdXAuZmluZCgnLmhlbHAtYmxvY2snKS5yZW1vdmUoKTtcbiAgfTtcblxuICBNb2RhbFZpZXcucHJvdG90eXBlLm9uSW52YWxpZEZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGVycm9ycywgbW9kZWwpIHtcbiAgICB2YXIgZXJyb3IsIGZpZWxkLCBncm91cCwgaSwgbGVuO1xuICAgIGZpZWxkID0gdGhpcy4kKFwiW25hbWU9XCIgKyBuYW1lICsgXCJdXCIpO1xuICAgIGdyb3VwID0gZmllbGQuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKTtcbiAgICBncm91cC5maW5kKCcuaGVscC1ibG9jaycpLnJlbW92ZSgpO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGVycm9ycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXJyb3IgPSBlcnJvcnNbaV07XG4gICAgICBmaWVsZC5hZnRlcihcIjxkaXYgY2xhc3M9J2hlbHAtYmxvY2snPlwiICsgZXJyb3IgKyBcIjwvZGl2PlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGdyb3VwLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcbiAgfTtcblxuICByZXR1cm4gTW9kYWxWaWV3O1xuXG59KShCYWNrYm9uZS5WaWV3KTtcblxuIiwidmFyIFBhZ2luYXRpb25WaWV3LFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYWdpbmF0aW9uVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChQYWdpbmF0aW9uVmlldywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUGFnaW5hdGlvblZpZXcoKSB7XG4gICAgcmV0dXJuIFBhZ2luYXRpb25WaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLnRhZ05hbWUgPSAnbmF2JztcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUuY2xhc3NOYW1lID0gJ3BhZ2UtbmF2JztcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUudGVtcGxhdGUgPSByZXF1aXJlKCd0ZW1wbGF0ZXMvcGFnZS1uYXYnKTtcblxuICBQYWdpbmF0aW9uVmlldy5wcm90b3R5cGUuZXZlbnRzID0ge1xuICAgICdjbGljayBhW2RhdGEtaWRdJzogJ2xvYWRQYWdlJ1xuICB9O1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLCAncmVzZXQnLCB0aGlzLnJlbmRlcik7XG4gIH07XG5cbiAgUGFnaW5hdGlvblZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmNvbGxlY3Rpb24ubWV0YSkge1xuICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMuY29sbGVjdGlvbi5tZXRhKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFBhZ2luYXRpb25WaWV3LnByb3RvdHlwZS5sb2FkUGFnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZGF0YSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCk7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5mZXRjaCh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHBhZ2U6IGRhdGEuaWRcbiAgICAgIH0sXG4gICAgICByZXNldDogdHJ1ZVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBQYWdpbmF0aW9uVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBUYWJsZVZpZXcsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlVmlldyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChUYWJsZVZpZXcsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFRhYmxlVmlldygpIHtcbiAgICByZXR1cm4gVGFibGVWaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVGFibGVWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICdhZGQnLCB0aGlzLmFkZCk7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLCAncmVzZXQnLCB0aGlzLnJlbmRlcik7XG4gIH07XG5cbiAgVGFibGVWaWV3LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gIH07XG5cbiAgVGFibGVWaWV3LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHZhciByb3c7XG4gICAgcm93ID0gdGhpcy5yb3cobW9kZWwpO1xuICAgIHJvdy4kZWwuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICByZXR1cm4gdGhpcy4kKCd0YWJsZSB0Ym9keScpLnByZXBlbmQocm93LnJlbmRlcigpLiRlbCk7XG4gIH07XG5cbiAgVGFibGVWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIHRib2R5O1xuICAgIHRib2R5ID0gdGhpcy4kKCd0YWJsZSB0Ym9keScpO1xuICAgIHRib2R5LmVtcHR5KCk7XG4gICAgY29sbGVjdGlvbi5lYWNoKChmdW5jdGlvbihtb2RlbCkge1xuICAgICAgcmV0dXJuIHRib2R5LmFwcGVuZCh0aGlzLnJvdyhtb2RlbCkucmVuZGVyKCkuJGVsKTtcbiAgICB9KSwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIFRhYmxlVmlldztcblxufSkoQmFja2JvbmUuVmlldyk7XG5cbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGJvb2ssIGNoYW5jZXMsIGVuZF9hdCwgaWQsIGluZm9fZmllbGRfMiwgaW5mb19maWVsZF8zLCBtdWx0aSwgbXVsdGlfcG9pbnRzLCBuYW1lLCBzaW5nbGUsIHNpbmdsZV9wb2ludHMsIHN0YXJ0X2F0LCBzdGF0dXMsIHRpbWVfbGltaXQsIHR5cGUsIHVybCwgdXNlciwgd2VsY29tZSkge1xuYnVmLnB1c2goXCI8dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpZCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBuYW1lKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGJvb2sudGl0bGUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdHlwZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBjaGFuY2VzKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHRpbWVfbGltaXQpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gc2luZ2xlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IG11bHRpKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHNpbmdsZV9wb2ludHMpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gbXVsdGlfcG9pbnRzKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHN0YXR1cykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBzdGFydF9hdCkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBlbmRfYXQpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKG51bGwgPT0gKGphZGVfaW50ZXJwID0gd2VsY29tZSkgPyBcIlwiIDogamFkZV9pbnRlcnApICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGluZm9fZmllbGRfMykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD48dGQ+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpbmZvX2ZpZWxkXzIpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gaW5mb19maWVsZF8zKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD48YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgdXJsLCB0cnVlLCBmYWxzZSkpICsgXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSB1cmwpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvYT48L3RkPjx0ZD48YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgXCIvYWN0aXZpdGllcy9lZGl0L1wiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi14c1xcXCI+57yW6L6RPC9hPjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gdXNlci51c2VybmFtZSkgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC90ZD5cIik7fS5jYWxsKHRoaXMsXCJib29rXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5ib29rOnR5cGVvZiBib29rIT09XCJ1bmRlZmluZWRcIj9ib29rOnVuZGVmaW5lZCxcImNoYW5jZXNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmNoYW5jZXM6dHlwZW9mIGNoYW5jZXMhPT1cInVuZGVmaW5lZFwiP2NoYW5jZXM6dW5kZWZpbmVkLFwiZW5kX2F0XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5lbmRfYXQ6dHlwZW9mIGVuZF9hdCE9PVwidW5kZWZpbmVkXCI/ZW5kX2F0OnVuZGVmaW5lZCxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCxcImluZm9fZmllbGRfMlwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaW5mb19maWVsZF8yOnR5cGVvZiBpbmZvX2ZpZWxkXzIhPT1cInVuZGVmaW5lZFwiP2luZm9fZmllbGRfMjp1bmRlZmluZWQsXCJpbmZvX2ZpZWxkXzNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmluZm9fZmllbGRfMzp0eXBlb2YgaW5mb19maWVsZF8zIT09XCJ1bmRlZmluZWRcIj9pbmZvX2ZpZWxkXzM6dW5kZWZpbmVkLFwibXVsdGlcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm11bHRpOnR5cGVvZiBtdWx0aSE9PVwidW5kZWZpbmVkXCI/bXVsdGk6dW5kZWZpbmVkLFwibXVsdGlfcG9pbnRzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5tdWx0aV9wb2ludHM6dHlwZW9mIG11bHRpX3BvaW50cyE9PVwidW5kZWZpbmVkXCI/bXVsdGlfcG9pbnRzOnVuZGVmaW5lZCxcIm5hbWVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm5hbWU6dHlwZW9mIG5hbWUhPT1cInVuZGVmaW5lZFwiP25hbWU6dW5kZWZpbmVkLFwic2luZ2xlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zaW5nbGU6dHlwZW9mIHNpbmdsZSE9PVwidW5kZWZpbmVkXCI/c2luZ2xlOnVuZGVmaW5lZCxcInNpbmdsZV9wb2ludHNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnNpbmdsZV9wb2ludHM6dHlwZW9mIHNpbmdsZV9wb2ludHMhPT1cInVuZGVmaW5lZFwiP3NpbmdsZV9wb2ludHM6dW5kZWZpbmVkLFwic3RhcnRfYXRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnN0YXJ0X2F0OnR5cGVvZiBzdGFydF9hdCE9PVwidW5kZWZpbmVkXCI/c3RhcnRfYXQ6dW5kZWZpbmVkLFwic3RhdHVzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zdGF0dXM6dHlwZW9mIHN0YXR1cyE9PVwidW5kZWZpbmVkXCI/c3RhdHVzOnVuZGVmaW5lZCxcInRpbWVfbGltaXRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnRpbWVfbGltaXQ6dHlwZW9mIHRpbWVfbGltaXQhPT1cInVuZGVmaW5lZFwiP3RpbWVfbGltaXQ6dW5kZWZpbmVkLFwidHlwZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudHlwZTp0eXBlb2YgdHlwZSE9PVwidW5kZWZpbmVkXCI/dHlwZTp1bmRlZmluZWQsXCJ1cmxcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVybDp0eXBlb2YgdXJsIT09XCJ1bmRlZmluZWRcIj91cmw6dW5kZWZpbmVkLFwidXNlclwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudXNlcjp0eXBlb2YgdXNlciE9PVwidW5kZWZpbmVkXCI/dXNlcjp1bmRlZmluZWQsXCJ3ZWxjb21lXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC53ZWxjb21lOnR5cGVvZiB3ZWxjb21lIT09XCJ1bmRlZmluZWRcIj93ZWxjb21lOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGlkKSB7XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJpZFwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB0YWJpbmRleD1cXFwiLTFcXFwiIHJvbGU9XFxcImRpYWxvZ1xcXCIgYXJpYS1sYWJlbGxlZGJ5PVxcXCJib29rRm9ybUxhYmVsXFxcIiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgY2xhc3M9XFxcIm1vZGFsIGZhZGVcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWRpYWxvZ1xcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtY29udGVudFxcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtaGVhZGVyXFxcIj48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgY2xhc3M9XFxcImNsb3NlXFxcIj48c3BhbiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCI+JnRpbWVzOzwvc3Bhbj48c3BhbiBjbGFzcz1cXFwic3Itb25seVxcXCI+5YWz6ZetPC9zcGFuPjwvYnV0dG9uPjxoNCBpZD1cXFwiYm9va0Zvcm1MYWJlbFxcXCIgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIj7ovpPlhaXpopjlupPkv6Hmga88L2g0PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1vZGFsLWJvZHlcXFwiPjxmb3JtPjxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPjxsYWJlbCBmb3I9XFxcInRpdGxlXFxcIiBjbGFzcz1cXFwiY29udHJvbC1sYWJlbFxcXCI+6aKY5bqT5ZCNPC9sYWJlbD48aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgaWQ9XFxcInRpdGxlXFxcIiBwbGFjZWhvbGRlcj1cXFwi6aKY5bqT5ZCNXFxcIiBuYW1lPVxcXCJ0aXRsZVxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIvPjwvZGl2PjwvZm9ybT48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1mb290ZXJcXFwiPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIj7lj5bmtog8L2J1dHRvbj48YnV0dG9uIGlkPVxcXCJzYXZlXFxcIiB0eXBlPVxcXCJzdWJtaXRcXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiPuS/neWtmDwvYnV0dG9uPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImlkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pZDp0eXBlb2YgaWQhPT1cInVuZGVmaW5lZFwiP2lkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGJ1dHRvbiwgaWQsIHRpdGxlLCB1c2VyKSB7XG5idWYucHVzaChcIjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHRpdGxlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHVzZXIudXNlcm5hbWUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPjxhXCIgKyAoamFkZS5hdHRyKFwiaHJlZlwiLCAnL3F1aXpib29rcy8nICsgKGlkKSArICcvcXVlc3Rpb25zJywgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXFxcIj7mn6XnnIs8L2E+PGFcIiArIChqYWRlLmF0dHIoXCJ0eXBlXCIsIGJ1dHRvbiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIGlkLCB0cnVlLCBmYWxzZSkpICsgXCIgZGF0YS10b2dnbGU9XFxcIm1vZGFsXFxcIiBkYXRhLXRhcmdldD1cXFwiI2Jvb2tNb2RhbEZvcm1cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYnRuLXhzXFxcIj7nvJbovpE8L2E+PC90ZD5cIik7fS5jYWxsKHRoaXMsXCJidXR0b25cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmJ1dHRvbjp0eXBlb2YgYnV0dG9uIT09XCJ1bmRlZmluZWRcIj9idXR0b246dW5kZWZpbmVkLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkLFwidGl0bGVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnRpdGxlOnR5cGVvZiB0aXRsZSE9PVwidW5kZWZpbmVkXCI/dGl0bGU6dW5kZWZpbmVkLFwidXNlclwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudXNlcjp0eXBlb2YgdXNlciE9PVwidW5kZWZpbmVkXCI/dXNlcjp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChNYXRoLCBlbmQsIHBhZ2UsIHBhZ2VzLCBzdGFydCkge1xuc3RhcnQgPSBNYXRoLm1heCgxLCBwYWdlIC0gNSlcbmVuZCA9IE1hdGgubWluKHBhZ2VzLCBwYWdlICsgNSlcbmJ1Zi5wdXNoKFwiPHVsIGNsYXNzPVxcXCJwYWdpbmF0aW9uXFxcIj48bGlcIiArIChqYWRlLmNscyhbKHBhZ2UgPT0gMSkgPyAnZGlzYWJsZWQnIDogJyddLCBbdHJ1ZV0pKSArIFwiPjxhIGhyZWY9XFxcIiNcXFwiIGFyaWEtbGFiZWw9XFxcIlN0YXJ0XFxcIiBkYXRhLWlkPScxJz48c3BhbiBhcmlhLWhpZGRlbj1cXFwiYXJpYS1oaWRkZW5cXFwiPiZsYXF1bzs8L3NwYW4+PC9hPjwvbGk+XCIpO1xudmFyIGkgPSBzdGFydFxud2hpbGUgKGkgPCBwYWdlKVxue1xuYnVmLnB1c2goXCI8bGk+PGEgaHJlZj1cXFwiI1xcXCJcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIGksIHRydWUsIGZhbHNlKSkgKyBcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGkrKykgPyBcIlwiIDogamFkZV9pbnRlcnApKSArIFwiPC9hPjwvbGk+XCIpO1xufVxuYnVmLnB1c2goXCI8bGlcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIHBhZ2UsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiYWN0aXZlXFxcIj48YSBocmVmPVxcXCIjXFxcIj5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHBhZ2UpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvYT48L2xpPlwiKTtcbnZhciBpID0gcGFnZSArIDFcbndoaWxlIChpIDw9IGVuZClcbntcbmJ1Zi5wdXNoKFwiPGxpPjxhIGhyZWY9XFxcIiNcXFwiXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBpLCB0cnVlLCBmYWxzZSkpICsgXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBpKyspID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvYT48L2xpPlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPGxpXCIgKyAoamFkZS5jbHMoWyhwYWdlID09IHBhZ2VzKSA/ICdkaXNhYmxlZCcgOiAnJ10sIFt0cnVlXSkpICsgXCI+PGEgaHJlZj1cXFwiI1xcXCIgYXJpYS1sYWJlbD1cXFwiRW5kXFxcIlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgcGFnZXMsIHRydWUsIGZhbHNlKSkgKyBcIj48c3BhbiBhcmlhLWhpZGRlbj1cXFwiYXJpYS1oaWRkZW5cXFwiPiZyYXF1bzs8L3NwYW4+PC9hPjwvbGk+PC91bD5cIik7fS5jYWxsKHRoaXMsXCJNYXRoXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5NYXRoOnR5cGVvZiBNYXRoIT09XCJ1bmRlZmluZWRcIj9NYXRoOnVuZGVmaW5lZCxcImVuZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguZW5kOnR5cGVvZiBlbmQhPT1cInVuZGVmaW5lZFwiP2VuZDp1bmRlZmluZWQsXCJwYWdlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5wYWdlOnR5cGVvZiBwYWdlIT09XCJ1bmRlZmluZWRcIj9wYWdlOnVuZGVmaW5lZCxcInBhZ2VzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5wYWdlczp0eXBlb2YgcGFnZXMhPT1cInVuZGVmaW5lZFwiP3BhZ2VzOnVuZGVmaW5lZCxcInN0YXJ0XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5zdGFydDp0eXBlb2Ygc3RhcnQhPT1cInVuZGVmaW5lZFwiP3N0YXJ0OnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGlkLCB1bmRlZmluZWQpIHtcbmphZGVfbWl4aW5zW1widGV4dGFyZWFcIl0gPSBqYWRlX2ludGVycCA9IGZ1bmN0aW9uKGlkLGxhYmVsLG5hbWUpe1xudmFyIGJsb2NrID0gKHRoaXMgJiYgdGhpcy5ibG9jayksIGF0dHJpYnV0ZXMgPSAodGhpcyAmJiB0aGlzLmF0dHJpYnV0ZXMpIHx8IHt9O1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj48bGFiZWxcIiArIChqYWRlLmF0dHIoXCJmb3JcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImNvbC1zbS0yIGNvbnRyb2wtbGFiZWxcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxhYmVsKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2xhYmVsPjxkaXYgY2xhc3M9XFxcImNvbC1zbS0xMFxcXCI+PHRleHRhcmVhXCIgKyAoamFkZS5hdHRyKFwiaWRcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcIm5hbWVcIiwgXCJcIiArIChuYW1lKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiByb3c9XFxcIjRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiPjwvdGV4dGFyZWE+PC9kaXY+PC9kaXY+XCIpO1xufTtcbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImlkXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIHRhYmluZGV4PVxcXCItMVxcXCIgcm9sZT1cXFwiZGlhbG9nXFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcInF1ZXN0aW9uRm9ybUxhYmVsXFxcIiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgY2xhc3M9XFxcIm1vZGFsIGZhZGVcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWRpYWxvZ1xcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtY29udGVudFxcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtaGVhZGVyXFxcIj48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgY2xhc3M9XFxcImNsb3NlXFxcIj48c3BhbiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCI+JnRpbWVzOzwvc3Bhbj48c3BhbiBjbGFzcz1cXFwic3Itb25seVxcXCI+5YWz6ZetPC9zcGFuPjwvYnV0dG9uPjxoNCBpZD1cXFwicXVlc3Rpb25Gb3JtTGFiZWxcXFwiIGNsYXNzPVxcXCJtb2RhbC10aXRsZVxcXCI+6L6T5YWl6Zeu6aKY6K+m57uG5L+h5oGvPC9oND48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5XFxcIj48Zm9ybSBjbGFzcz1cXFwiZm9ybS1ob3Jpem9udGFsXFxcIj5cIik7XG5qYWRlX21peGluc1tcInRleHRhcmVhXCJdKCdjb250ZW50JywgJ+mXrumimOWGheWuuScsICdjb250ZW50Jyk7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPjxsYWJlbCBmb3I9XFxcInR5cGVcXFwiIGNsYXNzPVxcXCJjb2wtc20tMiBjb250cm9sLWxhYmVsXFxcIj7pl67popjlhoXlrrk8L2xhYmVsPjxkaXYgY2xhc3M9XFxcImNvbC1zbS0xMFxcXCI+PHNlbGVjdCBpZD1cXFwidHlwZVxcXCIgcm93PVxcXCI0XFxcIiBuYW1lPVxcXCJ0eXBlXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sIHRleHRhcmVhXFxcIj48L3NlbGVjdD48L2Rpdj48L2Rpdj5cIik7XG52YXIgb3B0aW9ucyA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnXVxuLy8gaXRlcmF0ZSBvcHRpb25zXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IG9wdGlvbnM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG5cbiAgICBmb3IgKHZhciAkaW5kZXggPSAwLCAkJGwgPSAkJG9iai5sZW5ndGg7ICRpbmRleCA8ICQkbDsgJGluZGV4KyspIHtcbiAgICAgIHZhciBvcHRpb24gPSAkJG9ialskaW5kZXhdO1xuXG5qYWRlX21peGluc1tcInRleHRhcmVhXCJdKCdvcHRpb25fJyArIG9wdGlvbiwgXCLpgInpoblcIiArIG9wdGlvbiwgJ29wdGlvbl8nICsgb3B0aW9uKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciAkaW5kZXggaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBvcHRpb24gPSAkJG9ialskaW5kZXhdO1xuXG5qYWRlX21peGluc1tcInRleHRhcmVhXCJdKCdvcHRpb25fJyArIG9wdGlvbiwgXCLpgInpoblcIiArIG9wdGlvbiwgJ29wdGlvbl8nICsgb3B0aW9uKTtcbiAgICB9XG5cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj48bGFiZWwgY2xhc3M9XFxcImNvbC1zbS0yIGNvbnRyb2wtbGFiZWxcXFwiPuato+ehruetlOahiDwvbGFiZWw+PGRpdiBjbGFzcz1cXFwiY29sLXNtLTEwXFxcIj5cIik7XG4vLyBpdGVyYXRlIG9wdGlvbnNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gb3B0aW9ucztcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiAkJG9iai5sZW5ndGgpIHtcblxuICAgIGZvciAodmFyIGkgPSAwLCAkJGwgPSAkJG9iai5sZW5ndGg7IGkgPCAkJGw7IGkrKykge1xuICAgICAgdmFyIG9wdGlvbiA9ICQkb2JqW2ldO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImNoZWNrYm94IGNvbC14cy02IGNvbC1zbS00XFxcIj48bGFiZWw+PGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBuYW1lPVxcXCJjb3JyZWN0X29wdGlvblxcXCJcIiArIChqYWRlLmF0dHIoXCJ2YWx1ZVwiLCBpKzEsIHRydWUsIGZhbHNlKSkgKyBcIi8+6YCJ6aG5XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gb3B0aW9uKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2xhYmVsPjwvZGl2PlwiKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBpIGluICQkb2JqKSB7XG4gICAgICAkJGwrKzsgICAgICB2YXIgb3B0aW9uID0gJCRvYmpbaV07XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiY2hlY2tib3ggY29sLXhzLTYgY29sLXNtLTRcXFwiPjxsYWJlbD48aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIG5hbWU9XFxcImNvcnJlY3Rfb3B0aW9uXFxcIlwiICsgKGphZGUuYXR0cihcInZhbHVlXCIsIGkrMSwgdHJ1ZSwgZmFsc2UpKSArIFwiLz7pgInpoblcIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBvcHRpb24pID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvbGFiZWw+PC9kaXY+XCIpO1xuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5idWYucHVzaChcIjwvZGl2PjwvZGl2PjwvZm9ybT48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1mb290ZXJcXFwiPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIj7lj5bmtog8L2J1dHRvbj48YnV0dG9uIHR5cGU9XFxcInN1Ym1pdFxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCI+5L+d5a2YPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkLFwidW5kZWZpbmVkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51bmRlZmluZWQ6dHlwZW9mIHVuZGVmaW5lZCE9PVwidW5kZWZpbmVkXCI/dW5kZWZpbmVkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGJ1dHRvbiwgY29udGVudCwgY29ycmVjdF9vcHRpb24sIGlkLCBvcHRpb25fQSwgb3B0aW9uX0IsIG9wdGlvbl9DLCBvcHRpb25fRCwgb3B0aW9uX0UsIG9wdGlvbl9GLCB0eXBlKSB7XG5idWYucHVzaChcIjx0ZCBjbGFzcz1cXFwiY29udGVudFxcXCI+XCIgKyAoamFkZS5lc2NhcGUobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBjb250ZW50KSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHR5cGUpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gY29ycmVjdF9vcHRpb24pID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0EpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0IpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0MpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0QpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0UpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPlwiICsgKGphZGUuZXNjYXBlKG51bGwgPT0gKGphZGVfaW50ZXJwID0gb3B0aW9uX0YpID8gXCJcIiA6IGphZGVfaW50ZXJwKSkgKyBcIjwvdGQ+PHRkPjxhXCIgKyAoamFkZS5hdHRyKFwidHlwZVwiLCBidXR0b24sIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBpZCwgdHJ1ZSwgZmFsc2UpKSArIFwiIGRhdGEtdG9nZ2xlPVxcXCJtb2RhbFxcXCIgZGF0YS10YXJnZXQ9XFxcIiNxdWVzdGlvbk1vZGFsRm9ybVxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBidG4teHNcXFwiPue8lui+kTwvYT48YSBpZD1cXFwiZGVsZXRlXFxcIlwiICsgKGphZGUuYXR0cihcInR5cGVcIiwgYnV0dG9uLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImJ0biBidG4tZGFuZ2VyIGJ0bi14c1xcXCI+5Yig6ZmkPC9hPjwvdGQ+XCIpO30uY2FsbCh0aGlzLFwiYnV0dG9uXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5idXR0b246dHlwZW9mIGJ1dHRvbiE9PVwidW5kZWZpbmVkXCI/YnV0dG9uOnVuZGVmaW5lZCxcImNvbnRlbnRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmNvbnRlbnQ6dHlwZW9mIGNvbnRlbnQhPT1cInVuZGVmaW5lZFwiP2NvbnRlbnQ6dW5kZWZpbmVkLFwiY29ycmVjdF9vcHRpb25cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmNvcnJlY3Rfb3B0aW9uOnR5cGVvZiBjb3JyZWN0X29wdGlvbiE9PVwidW5kZWZpbmVkXCI/Y29ycmVjdF9vcHRpb246dW5kZWZpbmVkLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkLFwib3B0aW9uX0FcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9BOnR5cGVvZiBvcHRpb25fQSE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0E6dW5kZWZpbmVkLFwib3B0aW9uX0JcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9COnR5cGVvZiBvcHRpb25fQiE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0I6dW5kZWZpbmVkLFwib3B0aW9uX0NcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9DOnR5cGVvZiBvcHRpb25fQyE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0M6dW5kZWZpbmVkLFwib3B0aW9uX0RcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9EOnR5cGVvZiBvcHRpb25fRCE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0Q6dW5kZWZpbmVkLFwib3B0aW9uX0VcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9FOnR5cGVvZiBvcHRpb25fRSE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0U6dW5kZWZpbmVkLFwib3B0aW9uX0ZcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm9wdGlvbl9GOnR5cGVvZiBvcHRpb25fRiE9PVwidW5kZWZpbmVkXCI/b3B0aW9uX0Y6dW5kZWZpbmVkLFwidHlwZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudHlwZTp0eXBlb2YgdHlwZSE9PVwidW5kZWZpbmVkXCI/dHlwZTp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpZCkge1xuamFkZV9taXhpbnNbXCJpbnB1dFwiXSA9IGphZGVfaW50ZXJwID0gZnVuY3Rpb24odHlwZSxpZCxwbGFjZWhvbGRlcixsYWJlbCxuYW1lKXtcbnZhciBibG9jayA9ICh0aGlzICYmIHRoaXMuYmxvY2spLCBhdHRyaWJ1dGVzID0gKHRoaXMgJiYgdGhpcy5hdHRyaWJ1dGVzKSB8fCB7fTtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+PGxhYmVsXCIgKyAoamFkZS5hdHRyKFwiZm9yXCIsIFwiXCIgKyAoaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJjb2wteHMtMiBjb250cm9sLWxhYmVsXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBsYWJlbCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9sYWJlbD48ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTBcXFwiPjxpbnB1dFwiICsgKGphZGUuYXR0cihcInR5cGVcIiwgXCJcIiArICh0eXBlKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwiaWRcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcInBsYWNlaG9sZGVyXCIsIFwiXCIgKyAocGxhY2Vob2xkZXIpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJuYW1lXCIsIFwiXCIgKyAobmFtZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIvPjwvZGl2PjwvZGl2PlwiKTtcbn07XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJpZFwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB0YWJpbmRleD1cXFwiLTFcXFwiIHJvbGU9XFxcImRpYWxvZ1xcXCIgYXJpYS1sYWJlbGxlZGJ5PVxcXCJ1c2VyRm9ybUxhYmVsXFxcIiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgY2xhc3M9XFxcIm1vZGFsIGZhZGVcXFwiPjxkaXYgY2xhc3M9XFxcIm1vZGFsLWRpYWxvZ1xcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtY29udGVudFxcXCI+PGRpdiBjbGFzcz1cXFwibW9kYWwtaGVhZGVyXFxcIj48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgY2xhc3M9XFxcImNsb3NlXFxcIj48c3BhbiBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCI+JnRpbWVzOzwvc3Bhbj48c3BhbiBjbGFzcz1cXFwic3Itb25seVxcXCI+5YWz6ZetPC9zcGFuPjwvYnV0dG9uPjxoNCBpZD1cXFwidXNlckZvcm1MYWJlbFxcXCIgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIj7ovpPlhaXnlKjmiLfkv6Hmga88L2g0PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1vZGFsLWJvZHlcXFwiPjxyb3c+PGZvcm0gY2xhc3M9XFxcImZvcm0taG9yaXpvbnRhbFxcXCI+XCIpO1xuamFkZV9taXhpbnNbXCJpbnB1dFwiXSgndGV4dCcsICd1c2VybmFtZScsICfnlKjmiLflkI0nLCAn55So5oi35ZCNJywgJ3VzZXJuYW1lJyk7XG5qYWRlX21peGluc1tcImlucHV0XCJdKCdwYXNzd29yZCcsICdwYXNzd29yZCcsICflr4bnoIEnLCAn5a+G56CBJywgJ3Bhc3N3b3JkJyk7XG5idWYucHVzaChcIjwvZm9ybT48L3Jvdz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1mb290ZXJcXFwiPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIj7lj5bmtog8L2J1dHRvbj48YnV0dG9uIHR5cGU9XFxcInN1Ym1pdFxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCI+5L+d5a2YPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoYWN0aXZlLCBhZG1pbiwgaWQsIHVzZXJuYW1lKSB7XG5idWYucHVzaChcIjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IGlkKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD5cIiArIChqYWRlLmVzY2FwZShudWxsID09IChqYWRlX2ludGVycCA9IHVzZXJuYW1lKSA/IFwiXCIgOiBqYWRlX2ludGVycCkpICsgXCI8L3RkPjx0ZD48YSB0eXBlPVxcXCJidXR0b25cXFwiXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBpZCwgdHJ1ZSwgZmFsc2UpKSArIFwiIGRhdGEtdG9nZ2xlPVxcXCJtb2RhbFxcXCIgZGF0YS10YXJnZXQ9XFxcIiN1c2VyTW9kYWxGb3JtXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1xcXCI+5L+u5pS55a+G56CBPC9hPlwiKTtcbmlmICggIWFkbWluKVxue1xuaWYgKCBhY3RpdmUpXG57XG5idWYucHVzaChcIjxhIGlkPVxcXCJkZWFjdGl2YXRlXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRhbmdlciBidG4teHNcXFwiPuWGu+e7k+W4kOWPtzwvYT5cIik7XG59XG5lbHNlXG57XG5idWYucHVzaChcIjxhIGlkPVxcXCJhY3RpdmF0ZVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi14c1xcXCI+5r+A5rS75biQ5Y+3PC9hPlwiKTtcbn1cbn1cbmJ1Zi5wdXNoKFwiPC90ZD5cIik7fS5jYWxsKHRoaXMsXCJhY3RpdmVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmFjdGl2ZTp0eXBlb2YgYWN0aXZlIT09XCJ1bmRlZmluZWRcIj9hY3RpdmU6dW5kZWZpbmVkLFwiYWRtaW5cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmFkbWluOnR5cGVvZiBhZG1pbiE9PVwidW5kZWZpbmVkXCI/YWRtaW46dW5kZWZpbmVkLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkLFwidXNlcm5hbWVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVzZXJuYW1lOnR5cGVvZiB1c2VybmFtZSE9PVwidW5kZWZpbmVkXCI/dXNlcm5hbWU6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuKGZ1bmN0aW9uKGYpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZSE9PVwidW5kZWZpbmVkXCIpe21vZHVsZS5leHBvcnRzPWYoKX1lbHNlIGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmKX1lbHNle3ZhciBnO2lmKHR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiKXtnPXdpbmRvd31lbHNlIGlmKHR5cGVvZiBnbG9iYWwhPT1cInVuZGVmaW5lZFwiKXtnPWdsb2JhbH1lbHNlIGlmKHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIil7Zz1zZWxmfWVsc2V7Zz10aGlzfWcuamFkZSA9IGYoKX19KShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcbiAqIHRvIHZhbHVlcyBpbiBvYmplY3QgYGJgLiBDbGFzc2VzIGFyZSBzcGVjaWFsLWNhc2VkXG4gKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7T2JqZWN0fSBhXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoYSwgYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBhdHRycyA9IGFbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRycyA9IG1lcmdlKGF0dHJzLCBhW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG4gIHZhciBhYyA9IGFbJ2NsYXNzJ107XG4gIHZhciBiYyA9IGJbJ2NsYXNzJ107XG5cbiAgaWYgKGFjIHx8IGJjKSB7XG4gICAgYWMgPSBhYyB8fCBbXTtcbiAgICBiYyA9IGJjIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhYykpIGFjID0gW2FjXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYmMpKSBiYyA9IFtiY107XG4gICAgYVsnY2xhc3MnXSA9IGFjLmNvbmNhdChiYykuZmlsdGVyKG51bGxzKTtcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGtleSAhPSAnY2xhc3MnKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG4vKipcbiAqIEZpbHRlciBudWxsIGB2YWxgcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG51bGxzKHZhbCkge1xuICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsICE9PSAnJztcbn1cblxuLyoqXG4gKiBqb2luIGFycmF5IGFzIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5qb2luQ2xhc3NlcyA9IGpvaW5DbGFzc2VzO1xuZnVuY3Rpb24gam9pbkNsYXNzZXModmFsKSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLm1hcChqb2luQ2xhc3NlcykgOlxuICAgICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpID8gT2JqZWN0LmtleXModmFsKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdmFsW2tleV07IH0pIDpcbiAgICBbdmFsXSkuZmlsdGVyKG51bGxzKS5qb2luKCcgJyk7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcbiAqIEBwYXJhbSB7QXJyYXkuPEJvb2xlYW4+fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xzID0gZnVuY3Rpb24gY2xzKGNsYXNzZXMsIGVzY2FwZWQpIHtcbiAgdmFyIGJ1ZiA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZXNjYXBlZCAmJiBlc2NhcGVkW2ldKSB7XG4gICAgICBidWYucHVzaChleHBvcnRzLmVzY2FwZShqb2luQ2xhc3NlcyhbY2xhc3Nlc1tpXV0pKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5wdXNoKGpvaW5DbGFzc2VzKGNsYXNzZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgdmFyIHRleHQgPSBqb2luQ2xhc3NlcyhidWYpO1xuICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gJyBjbGFzcz1cIicgKyB0ZXh0ICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cblxuZXhwb3J0cy5zdHlsZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh2YWwpLm1hcChmdW5jdGlvbiAoc3R5bGUpIHtcbiAgICAgIHJldHVybiBzdHlsZSArICc6JyArIHZhbFtzdHlsZV07XG4gICAgfSkuam9pbignOycpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbn07XG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxuICogQHBhcmFtIHtCb29sZWFufSB0ZXJzZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHIgPSBmdW5jdGlvbiBhdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgdmFsID0gZXhwb3J0cy5zdHlsZSh2YWwpO1xuICB9XG4gIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIHZhbCB8fCBudWxsID09IHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKDAgPT0ga2V5LmluZGV4T2YoJ2RhdGEnKSAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB7XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KHZhbCkuaW5kZXhPZignJicpICE9PSAtMSkge1xuICAgICAgY29uc29sZS53YXJuKCdTaW5jZSBKYWRlIDIuMC4wLCBhbXBlcnNhbmRzIChgJmApIGluIGRhdGEgYXR0cmlidXRlcyAnICtcbiAgICAgICAgICAgICAgICAgICAnd2lsbCBiZSBlc2NhcGVkIHRvIGAmYW1wO2AnKTtcbiAgICB9O1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgZWxpbWluYXRlIHRoZSBkb3VibGUgcXVvdGVzIGFyb3VuZCBkYXRlcyBpbiAnICtcbiAgICAgICAgICAgICAgICAgICAnSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArIFwiPSdcIiArIEpTT04uc3RyaW5naWZ5KHZhbCkucmVwbGFjZSgvJy9nLCAnJmFwb3M7JykgKyBcIidcIjtcbiAgfSBlbHNlIGlmIChlc2NhcGVkKSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBzdHJpbmdpZnkgZGF0ZXMgaW4gSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgZXhwb3J0cy5lc2NhcGUodmFsKSArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBzdHJpbmdpZnkgZGF0ZXMgaW4gSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBmdW5jdGlvbiBhdHRycyhvYmosIHRlcnNlKXtcbiAgdmFyIGJ1ZiA9IFtdO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICAgICwgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09IGtleSkge1xuICAgICAgICBpZiAodmFsID0gam9pbkNsYXNzZXModmFsKSkge1xuICAgICAgICAgIGJ1Zi5wdXNoKCcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgamFkZV9lbmNvZGVfaHRtbF9ydWxlcyA9IHtcbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gICdcIic6ICcmcXVvdDsnXG59O1xudmFyIGphZGVfbWF0Y2hfaHRtbCA9IC9bJjw+XCJdL2c7XG5cbmZ1bmN0aW9uIGphZGVfZW5jb2RlX2NoYXIoYykge1xuICByZXR1cm4gamFkZV9lbmNvZGVfaHRtbF9ydWxlc1tjXSB8fCBjO1xufVxuXG5leHBvcnRzLmVzY2FwZSA9IGphZGVfZXNjYXBlO1xuZnVuY3Rpb24gamFkZV9lc2NhcGUoaHRtbCl7XG4gIHZhciByZXN1bHQgPSBTdHJpbmcoaHRtbCkucmVwbGFjZShqYWRlX21hdGNoX2h0bWwsIGphZGVfZW5jb2RlX2NoYXIpO1xuICBpZiAocmVzdWx0ID09PSAnJyArIGh0bWwpIHJldHVybiBodG1sO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIGphZGUgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lbm9cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IGZ1bmN0aW9uIHJldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9IHN0ciB8fCByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICB9IGNhdGNoIChleCkge1xuICAgIHJldGhyb3coZXJyLCBudWxsLCBsaW5lbm8pXG4gIH1cbiAgdmFyIGNvbnRleHQgPSAzXG4gICAgLCBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJylcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcbiAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdKYWRlJykgKyAnOicgKyBsaW5lbm9cbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XG4gIHRocm93IGVycjtcbn07XG5cbmV4cG9ydHMuRGVidWdJdGVtID0gZnVuY3Rpb24gRGVidWdJdGVtKGxpbmVubywgZmlsZW5hbWUpIHtcbiAgdGhpcy5saW5lbm8gPSBsaW5lbm87XG4gIHRoaXMuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbn1cblxufSx7XCJmc1wiOjJ9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblxufSx7fV19LHt9LFsxXSkoMSlcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiXX0=
