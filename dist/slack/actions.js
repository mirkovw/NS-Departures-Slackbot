"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearNotifications = exports.handleViewSubmission = exports.updateNotifications = exports.updateDefaultStation = void 0;

var _config = _interopRequireDefault(require("config"));

var _utils = require("../ns/utils");

var _utils2 = require("../utils");

var _blocks = require("../slack/blocks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var updateDefaultStation =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(payload, userParam) {
    var user, station;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = userParam;
            station = (0, _utils.findStation)(payload.actions[0].value);
            user.station = station.label; // update default station in user object

            _context.next = 5;
            return (0, _utils2.writeUser)(user);

          case 5:
            // write user object to json
            _utils2.log.info("UPDATED DEFAULT STATION TO ".concat(station.label.toUpperCase()));

            return _context.abrupt("return", (0, _utils2.respondCustom)(payload.response_url, {
              replace_original: true,
              blocks: (0, _blocks.composeUpdateDefaultConfirmMsg)(station).blocks
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function updateDefaultStation(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateDefaultStation = updateDefaultStation;

var updateNotifications =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(payload, userParam) {
    var user, view;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            user = userParam;
            user.updateSettings.channelId = payload.container.channel_id;
            user.updateSettings.ts = payload.container.message_ts;
            user.updateSettings.responseUrl = payload.response_url;
            _context2.next = 6;
            return (0, _utils2.writeUser)(user);

          case 6:
            user = _context2.sent;

            _utils2.log.info("UPDATE NOTIFICATIONS FOR ".concat(user.userName));

            view = (0, _blocks.composeNotificationsModal)(user);
            return _context2.abrupt("return", (0, _utils2.respondCustom)('https://slack.com/api/views.open', {
              trigger_id: payload.trigger_id,
              view: view
            }, {
              headers: {
                Authorization: "Bearer ".concat(_config["default"].get('slack.botToken'))
              }
            }));

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function updateNotifications(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateNotifications = updateNotifications;

var handleViewSubmission =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(payload, userParam) {
    var user, values, i, blocks;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            user = userParam;
            values = payload.view.state.values;
            user.notifications.enabled = true;
            user.notifications.days = [];

            for (i = 0; i < values.days_select.days_select_value.selected_options.length; i += 1) {
              user.notifications.days.push(values.days_select.days_select_value.selected_options[i].value);
            }

            user.notifications.time.hour = values.hour_select.hour_select_value.selected_option.value;
            user.notifications.time.minute = values.minute_select.minute_select_value.selected_option.value;
            _context3.next = 9;
            return (0, _utils2.writeUser)(user);

          case 9:
            user = _context3.sent;
            _context3.next = 12;
            return (0, _blocks.composeSettingsMsg)(user);

          case 12:
            blocks = _context3.sent;

            _utils2.log.info("NOTIFICATIONS UPDATED FOR ".concat(user.userName));

            return _context3.abrupt("return", (0, _utils2.respondCustom)(user.updateSettings.responseUrl, {
              replace_original: true,
              blocks: blocks.blocks
            }));

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function handleViewSubmission(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.handleViewSubmission = handleViewSubmission;

var clearNotifications =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(payload, userParam) {
    var user, blocks;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            user = userParam;
            user.notifications.enabled = false;
            _context4.next = 4;
            return (0, _utils2.writeUser)(user);

          case 4:
            user = _context4.sent;
            _context4.next = 7;
            return (0, _blocks.composeSettingsMsg)(user);

          case 7:
            blocks = _context4.sent;

            _utils2.log.info("NOTIFICATIONS OFF FOR ".concat(user.userName));

            return _context4.abrupt("return", (0, _utils2.respondCustom)(payload.response_url, {
              replace_original: true,
              blocks: blocks.blocks
            }));

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function clearNotifications(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.clearNotifications = clearNotifications;