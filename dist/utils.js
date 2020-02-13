"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.respondCustom = exports.newUser = exports.writeUser = exports.findUser = exports.log = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _config = _interopRequireDefault(require("config"));

var _morgan = _interopRequireDefault(require("morgan"));

var _tracer = _interopRequireDefault(require("tracer"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var log = function () {
  var logger = _tracer["default"].colorConsole();

  logger.requestLogger = (0, _morgan["default"])('dev');
  return logger;
}();

exports.log = log;

var findUser =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(id) {
    var fileExists, user, usersData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _fs["default"].existsSync(_config["default"].get('userDataPath'));

          case 2:
            fileExists = _context.sent;

            if (fileExists) {
              _context.next = 6;
              break;
            }

            _context.next = 6;
            return _fs["default"].writeFileSync(_config["default"].get('userDataPath'), '[]');

          case 6:
            _context.prev = 6;
            _context.next = 9;
            return JSON.parse(_fs["default"].readFileSync(_config["default"].get('userDataPath')));

          case 9:
            usersData = _context.sent;
            user = usersData.find(function (_ref2) {
              var userId = _ref2.userId;
              return userId === id;
            });
            _context.next = 17;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](6);
            log.error(_context.t0);
            user = '';

          case 17:
            return _context.abrupt("return", user);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 13]]);
  }));

  return function findUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.findUser = findUser;

var writeUser =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(data) {
    var existingUsersData, isExistingUser, i, fileData;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return JSON.parse(_fs["default"].readFileSync(_config["default"].get('userDataPath')));

          case 3:
            existingUsersData = _context2.sent;
            isExistingUser = false;

            for (i = 0; i < existingUsersData.length; i += 1) {
              if (data.userId === existingUsersData[i].userId) {
                existingUsersData[i] = data;
                isExistingUser = true;
              }
            }

            if (!isExistingUser) existingUsersData.push(data);
            fileData = JSON.stringify(existingUsersData, null, 2);
            _context2.prev = 8;
            _context2.next = 11;
            return _fs["default"].writeFileSync(_config["default"].get('userDataPath'), fileData);

          case 11:
            return _context2.abrupt("return", data);

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](8);
            log.error(_context2.t0);

          case 17:
            _context2.next = 22;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t1 = _context2["catch"](0);
            log.error(_context2.t1);

          case 22:
            return _context2.abrupt("return", true);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 19], [8, 14]]);
  }));

  return function writeUser(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.writeUser = writeUser;

var newUser = function newUser(payload) {
  return {
    userId: payload.user_id,
    channelId: payload.channel_id,
    userName: payload.user_name,
    station: 'NONE',
    notifications: {
      enabled: false,
      days: [],
      time: {
        hour: '',
        minute: ''
      }
    },
    updateSettings: {
      channelId: '',
      ts: '',
      responseUrl: ''
    }
  };
};

exports.newUser = newUser;

var respondCustom =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(url, options, params) {
    var result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            log.info('POST message to responseUrl');
            _context3.prev = 1;
            _context3.next = 4;
            return _axios["default"].post(url, options, params);

          case 4:
            result = _context3.sent;
            log.info('Message Delivered');
            _context3.next = 12;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);
            log.error(_context3.t0);
            result = false;

          case 12:
            return _context3.abrupt("return", result);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 8]]);
  }));

  return function respondCustom(_x3, _x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

exports.respondCustom = respondCustom;