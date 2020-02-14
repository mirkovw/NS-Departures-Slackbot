"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeSettingsMsg = exports.composeUpdateDefaultConfirmMsg = exports.composeUpdateDefaultMsg = exports.composeDeparturesMsg = exports.composeNotificationsModal = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var composeNotificationsModal = function composeNotificationsModal(user) {
  var blocksArr = [];
  var dayOptionsArr = [];
  var initialDayOptionsArr = [];
  var hourOptionsArr = [];
  var minuteOptionsArr = [];
  var initialHourOptionObj;
  var initialMinuteOptionObj;
  var blocksContent = [{
    labelText: 'days',
    type: 'multi_static_select',
    action_id: 'days_select'
  }, {
    labelText: 'hour',
    type: 'static_select',
    action_id: 'hour_select'
  }, {
    labelText: 'minute',
    type: 'static_select',
    action_id: 'minute_select'
  }];
  var daysArr = [{
    dayCode: '0',
    dayName: 'Monday'
  }, {
    dayCode: '1',
    dayName: 'Tuesday'
  }, {
    dayCode: '2',
    dayName: 'Wednesday'
  }, {
    dayCode: '3',
    dayName: 'Thursday'
  }, {
    dayCode: '4',
    dayName: 'Friday'
  }, {
    dayCode: '5',
    dayName: 'Saturday'
  }, {
    dayCode: '6',
    dayName: 'Sunday'
  }];
  var view = {
    type: 'modal',
    callback_id: 'notifications_view',
    title: {
      type: 'plain_text',
      text: 'Notifications',
      emoji: true
    },
    submit: {
      type: 'plain_text',
      text: 'Submit',
      emoji: true
    },
    close: {
      type: 'plain_text',
      text: 'Cancel',
      emoji: true
    }
  };

  for (var block = 0; block < 3; block += 1) {
    var tempBlock = {
      type: 'input',
      block_id: blocksContent[block].action_id,
      label: {
        type: 'plain_text',
        text: "Which ".concat(blocksContent[block].labelText, " would you like to receive a notification?"),
        emoji: true
      },
      element: {
        type: blocksContent[block].type,
        action_id: "".concat(blocksContent[block].action_id, "_value"),
        placeholder: {
          type: 'plain_text',
          text: 'Choose an option...',
          emoji: true
        }
      }
    };
    blocksArr.push(tempBlock);
  }

  for (var day = 0; day < daysArr.length; day += 1) {
    var dayObj = {
      text: {
        type: 'plain_text',
        text: daysArr[day].dayName,
        emoji: true
      },
      value: daysArr[day].dayCode
    };
    dayOptionsArr.push(dayObj);
    if (user.notifications.days.indexOf(dayObj.value) !== -1) initialDayOptionsArr.push(dayObj);
  }

  for (var hour = 0; hour < 24; hour += 1) {
    var hourObj = {
      text: {
        type: 'plain_text',
        text: hour.toString(),
        emoji: true
      },
      value: hour.toString()
    };
    hourOptionsArr.push(hourObj);
    if (user.notifications.time.hour === hour.toString()) initialHourOptionObj = hourObj;
  }

  for (var minute = 0; minute < 60; minute += 1) {
    var minuteObj = {
      text: {
        type: 'plain_text',
        text: minute.toString(),
        emoji: true
      },
      value: minute.toString()
    };
    minuteOptionsArr.push(minuteObj);

    if (user.notifications.time.minute === minute.toString()) {
      initialMinuteOptionObj = minuteObj;
    }
  }

  view.blocks = blocksArr; // Days

  view.blocks[0].element.options = dayOptionsArr; // add day options array to message blocks

  if (initialDayOptionsArr.length > 0) {
    view.blocks[0].element.initial_options = initialDayOptionsArr;
  } // add initial selected options if applicable
  // Hours


  view.blocks[1].element.options = hourOptionsArr; // add day options array to message blocks

  if (initialHourOptionObj) view.blocks[1].element.initial_option = initialHourOptionObj; // Minutes

  view.blocks[2].element.options = minuteOptionsArr; // add day options array to message blocks

  if (initialMinuteOptionObj) view.blocks[2].element.initial_option = initialMinuteOptionObj;
  return view;
};

exports.composeNotificationsModal = composeNotificationsModal;

var composeDeparturesMsg =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(user, station, departures) {
    var msgFieldsArray, i, direction, plannedDateTime, actualDateTime, plannedTrack, actualTrack, cancelled, warnings, directionStr, dateStr, trackStr, warningStr, p, msgFieldsArrayValue;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            msgFieldsArray = [];

            for (i = 0; i < departures.length && i <= 9; i += 1) {
              // limit to 10 entries
              direction = departures[i].direction;
              plannedDateTime = departures[i].plannedDateTime.substr(11, 5);
              actualDateTime = departures[i].actualDateTime.substr(11, 5);
              plannedTrack = departures[i].plannedTrack;
              actualTrack = departures[i].actualTrack;
              cancelled = departures[i].cancelled;
              warnings = departures[i].messages;
              directionStr = '';
              dateStr = '';
              trackStr = '';
              warningStr = ''; // find if train was cancelled

              if (!cancelled) {
                directionStr = "*".concat(direction, "*");
              } else {
                directionStr = "*~".concat(direction, "~* `Cancelled`"); // console.log('Train cancelled. Adding to message.')
              } // find if train is leaving on time


              if (actualDateTime === plannedDateTime) {
                dateStr = "\n".concat(actualDateTime);
              } else {
                dateStr = "\n~".concat(plannedDateTime, "~ `").concat(actualDateTime, "`"); // console.log('Train delay detected. Adjusting message.')
              } // find potential platform change


              if (actualTrack === undefined) {
                trackStr = "\nPlatform ".concat(plannedTrack);
              } else {
                trackStr = "\n~Platform ".concat(plannedTrack, "~ `Platform ").concat(actualTrack, "`");
              } // find potential warning


              if (warnings !== undefined) {
                for (p = 0; p < warnings.length; p += 1) {
                  if (warnings[p].style === 'WARNING') {
                    warningStr += '\n_'.concat(warnings[p].message, "_");
                  }
                }
              } // compose new addition to fields value


              msgFieldsArrayValue = {
                type: 'mrkdwn',
                text: "".concat(directionStr + dateStr + trackStr + warningStr, "\n")
              }; // append to fields array, which will be inserted into blocks message below

              msgFieldsArray.push(msgFieldsArrayValue);
            } // construct and return message


            return _context.abrupt("return", {
              blocks: [{
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: "<@".concat(user.userId, ">, here are the upcoming train departures from *").concat(station.label, "*:")
                }
              }, {
                type: 'section',
                fields: msgFieldsArray
              }]
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function composeDeparturesMsg(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.composeDeparturesMsg = composeDeparturesMsg;

var composeUpdateDefaultMsg = function composeUpdateDefaultMsg(user, station) {
  return (// construct and return message
    {
      blocks: [{
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: "Your current default station is *".concat(user.station, "*. Would you like to update this to *").concat(station.label, "*?")
        }]
      }, {
        type: 'actions',
        elements: [{
          type: 'button',
          style: 'primary',
          action_id: 'updateDefaultStation',
          text: {
            type: 'plain_text',
            text: 'Update',
            emoji: true
          },
          value: station.label
        }]
      }]
    }
  );
};

exports.composeUpdateDefaultMsg = composeUpdateDefaultMsg;

var composeUpdateDefaultConfirmMsg = function composeUpdateDefaultConfirmMsg(station) {
  return (// construct and return message
    {
      blocks: [{
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: "Updated default station to: *".concat(station.label, "*")
        }]
      }]
    }
  );
};

exports.composeUpdateDefaultConfirmMsg = composeUpdateDefaultConfirmMsg;

var composeSettingsMsg =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(user) {
    var settingsBlock, extraBtn, daysArr, daysStr, i, hourStr, minuteStr, contextBlock;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            settingsBlock = {
              blocks: [{
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: ':gear: Manage Default Station & Notifications'
                }
              }, {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: "Default Station: *".concat(user.station, "*\n_You can set your default station easily when you use this bot for the first time: _`/ns [station]`")
                }
              }, {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: "Notifications: *".concat(user.notifications.enabled ? 'ON' : 'OFF', "*\n_Once you have set your default station, you can have the bot send you a notification at a time of your choosing, for example 10 minutes before you usually leave work._")
                }
              }, {
                type: 'actions',
                elements: [{
                  type: 'button',
                  style: user.notifications.enabled ? 'danger' : 'primary',
                  action_id: user.notifications.enabled ? 'clearNotifications' : 'updateNotifications',
                  text: {
                    type: 'plain_text',
                    text: user.notifications.enabled ? 'Turn Off' : 'Turn On',
                    emoji: true
                  },
                  value: 'click_me_hue'
                }]
              }]
            };
            extraBtn = {
              type: 'button',
              style: 'primary',
              action_id: 'updateNotifications',
              text: {
                type: 'plain_text',
                text: 'Update Notifications',
                emoji: true
              },
              value: 'click_me_hue'
            };
            daysArr = [{
              dayCode: '0',
              dayName: 'Monday'
            }, {
              dayCode: '1',
              dayName: 'Tuesday'
            }, {
              dayCode: '2',
              dayName: 'Wednesday'
            }, {
              dayCode: '3',
              dayName: 'Thursday'
            }, {
              dayCode: '4',
              dayName: 'Friday'
            }, {
              dayCode: '5',
              dayName: 'Saturday'
            }, {
              dayCode: '6',
              dayName: 'Sunday'
            }];
            daysStr = '';

            for (i = 0; i < user.notifications.days.length; i += 1) {
              daysStr += i < user.notifications.days.length - 1 ? "".concat(daysArr[user.notifications.days[i]].dayName, ", ") : daysArr[user.notifications.days[i]].dayName;
            }

            hourStr = user.notifications.time.hour < 10 ? "0".concat(user.notifications.time.hour) : user.notifications.time.hour;
            minuteStr = user.notifications.time.minute < 10 ? "0".concat(user.notifications.time.minute) : user.notifications.time.minute;
            contextBlock = {
              type: 'context',
              elements: [{
                type: 'mrkdwn',
                text: "Notifications will be sent on *".concat(daysStr, "* at *").concat(hourStr, ":").concat(minuteStr, "*.")
              }]
            };

            if (user.notifications.enabled) {
              settingsBlock.blocks[3].elements.push(extraBtn);
              settingsBlock.blocks.push(contextBlock);
            }

            return _context2.abrupt("return", settingsBlock);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function composeSettingsMsg(_x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.composeSettingsMsg = composeSettingsMsg;