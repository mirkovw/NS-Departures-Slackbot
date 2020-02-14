"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendNotification = exports.clearNotifications = exports.handleViewSubmission = exports.updateNotifications = exports.updateDefaultStation = exports.handleCommand = void 0;

var _config = _interopRequireDefault(require("config"));

var _utils = require("../utils");

var _utils2 = require("../ns/utils");

var _blocks = require("./blocks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var handleCommand =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(payload) {
    var msg, msgUpdate, user, isSettings, responseType, station, departures;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.findUser)(payload.user_id);

          case 2:
            _context.t0 = _context.sent;
            _context.t1 = undefined;

            if (!(_context.t0 !== _context.t1)) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return (0, _utils.findUser)(payload.user_id);

          case 7:
            _context.t2 = _context.sent;
            _context.next = 13;
            break;

          case 10:
            _context.next = 12;
            return (0, _utils.writeUser)((0, _utils.newUser)(payload));

          case 12:
            _context.t2 = _context.sent;

          case 13:
            user = _context.t2;

            if (!(payload.command === '/ns')) {
              _context.next = 37;
              break;
            }

            isSettings = payload.text.toLocaleLowerCase() === 'settings' || payload.text === '' && user.station === 'NONE';
            responseType = isSettings ? 'ephemeral' : 'in_channel';

            if (!isSettings) {
              _context.next = 24;
              break;
            }

            _utils.log.info("".concat(user.userName, " request settings"));

            _context.next = 21;
            return (0, _blocks.composeSettingsMsg)(user);

          case 21:
            msg = _context.sent;
            _context.next = 33;
            break;

          case 24:
            station = payload.text !== '' ? (0, _utils2.findStation)(payload.text) : (0, _utils2.findStation)(user.station);

            _utils.log.info("".concat(user.userName, " REQUEST DEPARTURES FOR ").concat(station.label.toUpperCase()));

            _context.next = 28;
            return (0, _utils2.getNsData)(station);

          case 28:
            departures = _context.sent;
            _context.next = 31;
            return (0, _blocks.composeDeparturesMsg)(user, station, departures);

          case 31:
            msg = _context.sent;

            if (station.label !== user.station) {
              msgUpdate = (0, _blocks.composeUpdateDefaultMsg)(user, station);
            }

          case 33:
            if (!msgUpdate) {
              _context.next = 36;
              break;
            }

            _context.next = 36;
            return (0, _utils.respondCustom)(payload.response_url, {
              response_type: 'ephemeral',
              blocks: msgUpdate.blocks
            });

          case 36:
            return _context.abrupt("return", {
              response_type: responseType,
              replace_original: false,
              blocks: msg.blocks
            });

          case 37:
            return _context.abrupt("return", false);

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleCommand(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.handleCommand = handleCommand;

var updateDefaultStation =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(payload, userParam) {
    var user, station;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            user = userParam;
            station = (0, _utils2.findStation)(payload.actions[0].value);
            user.station = station.label; // update default station in user object

            _context2.next = 5;
            return (0, _utils.writeUser)(user);

          case 5:
            // write user object to json
            _utils.log.info("UPDATED DEFAULT STATION TO ".concat(station.label.toUpperCase()));

            return _context2.abrupt("return", (0, _utils.respondCustom)(payload.response_url, {
              replace_original: true,
              blocks: (0, _blocks.composeUpdateDefaultConfirmMsg)(station).blocks
            }));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function updateDefaultStation(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateDefaultStation = updateDefaultStation;

var updateNotifications =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(payload, userParam) {
    var user, view;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            user = userParam;
            user.updateSettings.channelId = payload.container.channel_id;
            user.updateSettings.ts = payload.container.message_ts;
            user.updateSettings.responseUrl = payload.response_url;
            _context3.next = 6;
            return (0, _utils.writeUser)(user);

          case 6:
            user = _context3.sent;

            _utils.log.info("UPDATE NOTIFICATIONS FOR ".concat(user.userName));

            view = (0, _blocks.composeNotificationsModal)(user);
            return _context3.abrupt("return", (0, _utils.respondCustom)('https://slack.com/api/views.open', {
              trigger_id: payload.trigger_id,
              view: view
            }, {
              headers: {
                Authorization: "Bearer ".concat(_config["default"].get('slack.botToken'))
              }
            }));

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function updateNotifications(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateNotifications = updateNotifications;

var handleViewSubmission =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(payload, userParam) {
    var user, values, i, blocks;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
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
            _context4.next = 9;
            return (0, _utils.writeUser)(user);

          case 9:
            user = _context4.sent;
            _context4.next = 12;
            return (0, _blocks.composeSettingsMsg)(user);

          case 12:
            blocks = _context4.sent;

            _utils.log.info("NOTIFICATIONS UPDATED FOR ".concat(user.userName));

            return _context4.abrupt("return", (0, _utils.respondCustom)(user.updateSettings.responseUrl, {
              replace_original: true,
              blocks: blocks.blocks
            }));

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function handleViewSubmission(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

exports.handleViewSubmission = handleViewSubmission;

var clearNotifications =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(payload, userParam) {
    var user, blocks;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            user = userParam;
            user.notifications.enabled = false;
            _context5.next = 4;
            return (0, _utils.writeUser)(user);

          case 4:
            user = _context5.sent;
            _context5.next = 7;
            return (0, _blocks.composeSettingsMsg)(user);

          case 7:
            blocks = _context5.sent;

            _utils.log.info("NOTIFICATIONS OFF FOR ".concat(user.userName));

            return _context5.abrupt("return", (0, _utils.respondCustom)(payload.response_url, {
              replace_original: true,
              blocks: blocks.blocks
            }));

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function clearNotifications(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

exports.clearNotifications = clearNotifications;

var sendNotification =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(user) {
    var station, departures, msg;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _utils.log.info("Sending notification to ".concat(user.userName));

            station = (0, _utils2.findStation)(user.station);
            _context6.next = 4;
            return (0, _utils2.getNsData)(station);

          case 4:
            departures = _context6.sent;
            _context6.next = 7;
            return (0, _blocks.composeDeparturesMsg)(user, station, departures);

          case 7:
            msg = _context6.sent;
            _context6.prev = 8;
            _context6.next = 11;
            return (0, _utils.respondCustom)('https://slack.com/api/chat.postMessage', {
              channel: user.userId,
              text: 'Your daily NS Departures notification is ready to view.',
              blocks: msg.blocks
            }, {
              headers: {
                Authorization: "Bearer ".concat(_config["default"].get('slack.botToken'))
              }
            });

          case 11:
            _context6.next = 16;
            break;

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6["catch"](8);

            _utils.log.error(_context6.t0);

          case 16:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[8, 13]]);
  }));

  return function sendNotification(_x10) {
    return _ref6.apply(this, arguments);
  };
}();

exports.sendNotification = sendNotification;