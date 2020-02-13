"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("../utils");

var _utils2 = require("../ns/utils");

var _blocks = require("../slack/blocks");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(payload) {
    var msg, msgUpdate, user, isSettings, station, departures;
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
              _context.next = 38;
              break;
            }

            isSettings = payload.text.toLocaleLowerCase() === 'settings' || payload.text === '' && user.station === 'NONE';

            if (!isSettings) {
              _context.next = 23;
              break;
            }

            _utils.log.info("".concat(user.userName, " request settings"));

            _context.next = 20;
            return (0, _blocks.composeSettingsMsg)(user);

          case 20:
            msg = _context.sent;
            _context.next = 32;
            break;

          case 23:
            station = payload.text !== '' ? (0, _utils2.findStation)(payload.text) : (0, _utils2.findStation)(user.station);

            _utils.log.info("".concat(user.userName, " REQUEST DEPARTURES FOR ").concat(station.label.toUpperCase()));

            _context.next = 27;
            return (0, _utils2.getNsData)(station);

          case 27:
            departures = _context.sent;
            _context.next = 30;
            return (0, _blocks.composeDeparturesMsg)(user, station, departures);

          case 30:
            msg = _context.sent;

            if (station.label !== user.station) {
              msgUpdate = (0, _blocks.composeUpdateDefaultMsg)(user, station);
            }

          case 32:
            _context.next = 34;
            return (0, _utils.respondCustom)(payload.response_url, {
              response_type: isSettings ? 'ephemeral' : 'in_channel',
              blocks: msg.blocks
            });

          case 34:
            if (!msgUpdate) {
              _context.next = 37;
              break;
            }

            _context.next = 37;
            return (0, _utils.respondCustom)(payload.response_url, {
              response_type: 'ephemeral',
              blocks: msgUpdate.blocks
            });

          case 37:
            return _context.abrupt("return", true);

          case 38:
            return _context.abrupt("return", false);

          case 39:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;