"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _config = _interopRequireDefault(require("config"));

var _cron = require("cron");

var _utils = require("../utils");

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = new _cron.CronJob('*/5 * * * *',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var usersData, date, currentDay, currentHour, currentMinute, result1, result2, result3, userList, i;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // every 5 minutes: '*/5 * * * *'
          _utils.log.info('Checking on notifications to send');

          _context.next = 3;
          return JSON.parse(_fs["default"].readFileSync(_config["default"].get('userDataPath')));

        case 3:
          usersData = _context.sent;
          date = new Date(); // with Date().getDay, sunday is 0 and in my array, sunday is 6

          currentDay = date.getDay() !== 0 ? date.getDay() - 1 : 6; // with Date().getDay, sunday is 0 and in my array, sunday is 6

          currentHour = date.getHours() + date.getTimezoneOffset() / 60 + 1;
          currentMinute = date.getMinutes(); // filter out the users who should be receiving a notification

          result1 = usersData.filter(function (user) {
            return user.notifications.enabled === true;
          });
          result2 = result1.filter(function (user) {
            return user.notifications.days.indexOf(currentDay.toString()) !== -1;
          });
          result3 = result2.filter(function (user) {
            return user.notifications.time.hour === currentHour.toString();
          });
          userList = result3.filter(function (user) {
            return Math.abs(user.notifications.time.minute - currentMinute) <= 2;
          });

          for (i = 0; i < userList.length; i += 1) {
            (0, _utils2.sendNotification)(userList[i]);
          }

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));

exports["default"] = _default;