"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findStation = exports.getNsData = void 0;

var _config = _interopRequireDefault(require("config"));

var _axios = _interopRequireDefault(require("axios"));

var _stations = _interopRequireDefault(require("./stations"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var levenshteinDistance = function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  var matrix = []; // increment along the first column of each row

  for (var i = 0; i <= b.length; i += 1) {
    matrix[i] = [i];
  } // increment each column in the first row


  for (var j = 0; j <= a.length; j += 1) {
    matrix[0][j] = j;
  } // Fill in the rest of the matrix


  for (var _i = 1; _i <= b.length; _i += 1) {
    for (var _j = 1; _j <= a.length; _j += 1) {
      if (b.charAt(_i - 1) === a.charAt(_j - 1)) {
        matrix[_i][_j] = matrix[_i - 1][_j - 1];
      } else {
        matrix[_i][_j] = Math.min(matrix[_i - 1][_j - 1] + 1, // substitution
        Math.min(matrix[_i][_j - 1] + 1, // insertion
        matrix[_i - 1][_j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};

var getNsData =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(station) {
    var apiDataResult;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _axios["default"].get(_config["default"].get('ns_api_url'), {
              params: {
                station: station.tpa
              },
              headers: {
                'Ocp-Apim-Subscription-Key': _config["default"].get('ns.api_key')
              }
            });

          case 3:
            apiDataResult = _context.sent;
            return _context.abrupt("return", apiDataResult.data.payload.departures);

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);

            _utils.log.error(_context.t0);

            return _context.abrupt("return", false);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function getNsData(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getNsData = getNsData;

var findStation = function findStation(str) {
  var resultsArr = [];

  for (var i = 0; i < _stations["default"].length; i += 1) {
    var currentDifference = levenshteinDistance(str, _stations["default"][i].label);
    resultsArr.push({
      diff: currentDifference,
      location: i,
      label: _stations["default"][i].label,
      uicCode: _stations["default"][i].uicCode,
      tpa: _stations["default"][i].tpa
    });
  }

  return resultsArr.reduce(function (acc, loc) {
    return acc.diff < loc.diff ? acc : loc;
  });
};

exports.findStation = findStation;