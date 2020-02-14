"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _utils = require("./utils");

var _utils2 = require("./slack/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = new _express["default"].Router();
router.post('/slack/commands/ns',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var payload;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            payload = req.body;
            _context.next = 4;
            return (0, _utils2.handleCommand)(payload);

          case 4:
            return _context.abrupt("return", res.status(200).json());

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);

            _utils.log.error(_context.t0);

            return _context.abrupt("return", res.status(500).send('Something blew up. We\'re looking into it.'));

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/slack/actions',
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var payload, user, _payload$actions, actions;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            payload = JSON.parse(req.body.payload);
            _context2.next = 4;
            return (0, _utils.findUser)(payload.user.id);

          case 4:
            user = _context2.sent;

            if (!(payload.type === 'block_actions')) {
              _context2.next = 16;
              break;
            }

            _payload$actions = _slicedToArray(payload.actions, 1), actions = _payload$actions[0];

            if (!(actions.action_id === 'updateDefaultStation')) {
              _context2.next = 10;
              break;
            }

            _context2.next = 10;
            return (0, _utils2.updateDefaultStation)(payload, user);

          case 10:
            if (!(actions.action_id === 'updateNotifications')) {
              _context2.next = 13;
              break;
            }

            _context2.next = 13;
            return (0, _utils2.updateNotifications)(payload, user);

          case 13:
            if (!(actions.action_id === 'clearNotifications')) {
              _context2.next = 16;
              break;
            }

            _context2.next = 16;
            return (0, _utils2.clearNotifications)(payload, user);

          case 16:
            if (!(payload.type === 'view_submission')) {
              _context2.next = 19;
              break;
            }

            _context2.next = 19;
            return (0, _utils2.handleViewSubmission)(payload, user);

          case 19:
            return _context2.abrupt("return", res.status(200).json());

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](0);

            _utils.log.error(_context2.t0);

            return _context2.abrupt("return", res.status(500).send('Something blew up. We\'re looking into it.'));

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 22]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;