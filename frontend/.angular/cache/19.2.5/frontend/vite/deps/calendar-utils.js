import "./chunk-WDMUDEB6.js";

// node_modules/calendar-utils/calendar-utils.js
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __spreadArray = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var DAYS_OF_WEEK;
(function(DAYS_OF_WEEK2) {
  DAYS_OF_WEEK2[DAYS_OF_WEEK2["SUNDAY"] = 0] = "SUNDAY";
  DAYS_OF_WEEK2[DAYS_OF_WEEK2["MONDAY"] = 1] = "MONDAY";
  DAYS_OF_WEEK2[DAYS_OF_WEEK2["TUESDAY"] = 2] = "TUESDAY";
  DAYS_OF_WEEK2[DAYS_OF_WEEK2["WEDNESDAY"] = 3] = "WEDNESDAY";
  DAYS_OF_WEEK2[DAYS_OF_WEEK2["THURSDAY"] = 4] = "THURSDAY";
  DAYS_OF_WEEK2[DAYS_OF_WEEK2["FRIDAY"] = 5] = "FRIDAY";
  DAYS_OF_WEEK2[DAYS_OF_WEEK2["SATURDAY"] = 6] = "SATURDAY";
})(DAYS_OF_WEEK || (DAYS_OF_WEEK = {}));
var DEFAULT_WEEKEND_DAYS = [DAYS_OF_WEEK.SUNDAY, DAYS_OF_WEEK.SATURDAY];
var DAYS_IN_WEEK = 7;
var HOURS_IN_DAY = 24;
var MINUTES_IN_HOUR = 60;
var SECONDS_IN_DAY = 60 * 60 * 24;
function getExcludedSeconds(dateAdapter, _a) {
  var startDate = _a.startDate, seconds = _a.seconds, excluded = _a.excluded, precision = _a.precision;
  if (excluded.length < 1) {
    return 0;
  }
  var addSeconds = dateAdapter.addSeconds, getDay = dateAdapter.getDay, addDays = dateAdapter.addDays;
  var endDate = addSeconds(startDate, seconds - 1);
  var dayStart = getDay(startDate);
  var dayEnd = getDay(endDate);
  var result = 0;
  var current = startDate;
  var _loop_1 = function() {
    var day = getDay(current);
    if (excluded.some(function(excludedDay) {
      return excludedDay === day;
    })) {
      result += calculateExcludedSeconds(dateAdapter, {
        dayStart,
        dayEnd,
        day,
        precision,
        startDate,
        endDate
      });
    }
    current = addDays(current, 1);
  };
  while (current < endDate) {
    _loop_1();
  }
  return result;
}
function calculateExcludedSeconds(dateAdapter, _a) {
  var precision = _a.precision, day = _a.day, dayStart = _a.dayStart, dayEnd = _a.dayEnd, startDate = _a.startDate, endDate = _a.endDate;
  var differenceInSeconds = dateAdapter.differenceInSeconds, endOfDay = dateAdapter.endOfDay, startOfDay = dateAdapter.startOfDay;
  if (precision === "minutes") {
    if (day === dayStart) {
      return differenceInSeconds(endOfDay(startDate), startDate) + 1;
    } else if (day === dayEnd) {
      return differenceInSeconds(endDate, startOfDay(endDate)) + 1;
    }
  }
  return SECONDS_IN_DAY;
}
function getWeekViewEventSpan(dateAdapter, _a) {
  var event = _a.event, offset = _a.offset, startOfWeekDate = _a.startOfWeekDate, excluded = _a.excluded, precision = _a.precision, totalDaysInView = _a.totalDaysInView;
  var max = dateAdapter.max, differenceInSeconds = dateAdapter.differenceInSeconds, addDays = dateAdapter.addDays, endOfDay = dateAdapter.endOfDay, differenceInDays = dateAdapter.differenceInDays;
  var span = SECONDS_IN_DAY;
  var begin = max([event.start, startOfWeekDate]);
  if (event.end) {
    switch (precision) {
      case "minutes":
        span = differenceInSeconds(event.end, begin);
        break;
      default:
        span = differenceInDays(addDays(endOfDay(event.end), 1), begin) * SECONDS_IN_DAY;
        break;
    }
  }
  var offsetSeconds = offset * SECONDS_IN_DAY;
  var totalLength = offsetSeconds + span;
  var secondsInView = totalDaysInView * SECONDS_IN_DAY;
  if (totalLength > secondsInView) {
    span = secondsInView - offsetSeconds;
  }
  span -= getExcludedSeconds(dateAdapter, {
    startDate: begin,
    seconds: span,
    excluded,
    precision
  });
  return span / SECONDS_IN_DAY;
}
function getWeekViewEventOffset(dateAdapter, _a) {
  var event = _a.event, startOfWeekDate = _a.startOfWeek, excluded = _a.excluded, precision = _a.precision;
  var differenceInDays = dateAdapter.differenceInDays, startOfDay = dateAdapter.startOfDay, differenceInSeconds = dateAdapter.differenceInSeconds;
  if (event.start < startOfWeekDate) {
    return 0;
  }
  var offset = 0;
  switch (precision) {
    case "days":
      offset = differenceInDays(startOfDay(event.start), startOfWeekDate) * SECONDS_IN_DAY;
      break;
    case "minutes":
      offset = differenceInSeconds(event.start, startOfWeekDate);
      break;
  }
  offset -= getExcludedSeconds(dateAdapter, {
    startDate: startOfWeekDate,
    seconds: offset,
    excluded,
    precision
  });
  return Math.abs(offset / SECONDS_IN_DAY);
}
function isEventIsPeriod(dateAdapter, _a) {
  var event = _a.event, periodStart = _a.periodStart, periodEnd = _a.periodEnd;
  var isSameSecond = dateAdapter.isSameSecond;
  var eventStart = event.start;
  var eventEnd = event.end || event.start;
  if (eventStart > periodStart && eventStart < periodEnd) {
    return true;
  }
  if (eventEnd > periodStart && eventEnd < periodEnd) {
    return true;
  }
  if (eventStart < periodStart && eventEnd > periodEnd) {
    return true;
  }
  if (isSameSecond(eventStart, periodStart) || isSameSecond(eventStart, periodEnd)) {
    return true;
  }
  if (isSameSecond(eventEnd, periodStart) || isSameSecond(eventEnd, periodEnd)) {
    return true;
  }
  return false;
}
function getEventsInPeriod(dateAdapter, _a) {
  var events = _a.events, periodStart = _a.periodStart, periodEnd = _a.periodEnd;
  return events.filter(function(event) {
    return isEventIsPeriod(dateAdapter, {
      event,
      periodStart,
      periodEnd
    });
  });
}
function getWeekDay(dateAdapter, _a) {
  var date = _a.date, _b = _a.weekendDays, weekendDays = _b === void 0 ? DEFAULT_WEEKEND_DAYS : _b;
  var startOfDay = dateAdapter.startOfDay, isSameDay = dateAdapter.isSameDay, getDay = dateAdapter.getDay;
  var today = startOfDay(/* @__PURE__ */ new Date());
  var day = getDay(date);
  return {
    date,
    day,
    isPast: date < today,
    isToday: isSameDay(date, today),
    isFuture: date > today,
    isWeekend: weekendDays.indexOf(day) > -1
  };
}
function getWeekViewHeader(dateAdapter, _a) {
  var viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn, _b = _a.excluded, excluded = _b === void 0 ? [] : _b, weekendDays = _a.weekendDays, _c = _a.viewStart, viewStart = _c === void 0 ? dateAdapter.startOfWeek(viewDate, {
    weekStartsOn
  }) : _c, _d = _a.viewEnd, viewEnd = _d === void 0 ? dateAdapter.addDays(viewStart, DAYS_IN_WEEK) : _d;
  var addDays = dateAdapter.addDays, getDay = dateAdapter.getDay;
  var days = [];
  var date = viewStart;
  while (date < viewEnd) {
    if (!excluded.some(function(e) {
      return getDay(date) === e;
    })) {
      days.push(getWeekDay(dateAdapter, {
        date,
        weekendDays
      }));
    }
    date = addDays(date, 1);
  }
  return days;
}
function getDifferenceInDaysWithExclusions(dateAdapter, _a) {
  var date1 = _a.date1, date2 = _a.date2, excluded = _a.excluded;
  var date = date1;
  var diff = 0;
  while (date < date2) {
    if (excluded.indexOf(dateAdapter.getDay(date)) === -1) {
      diff++;
    }
    date = dateAdapter.addDays(date, 1);
  }
  return diff;
}
function getAllDayWeekEvents(dateAdapter, _a) {
  var _b = _a.events, events = _b === void 0 ? [] : _b, _c = _a.excluded, excluded = _c === void 0 ? [] : _c, _d = _a.precision, precision = _d === void 0 ? "days" : _d, _e = _a.absolutePositionedEvents, absolutePositionedEvents = _e === void 0 ? false : _e, viewStart = _a.viewStart, viewEnd = _a.viewEnd;
  viewStart = dateAdapter.startOfDay(viewStart);
  viewEnd = dateAdapter.endOfDay(viewEnd);
  var differenceInSeconds = dateAdapter.differenceInSeconds, differenceInDays = dateAdapter.differenceInDays;
  var maxRange = getDifferenceInDaysWithExclusions(dateAdapter, {
    date1: viewStart,
    date2: viewEnd,
    excluded
  });
  var totalDaysInView = differenceInDays(viewEnd, viewStart) + 1;
  var eventsMapped = events.filter(function(event) {
    return event.allDay;
  }).map(function(event) {
    var offset = getWeekViewEventOffset(dateAdapter, {
      event,
      startOfWeek: viewStart,
      excluded,
      precision
    });
    var span = getWeekViewEventSpan(dateAdapter, {
      event,
      offset,
      startOfWeekDate: viewStart,
      excluded,
      precision,
      totalDaysInView
    });
    return {
      event,
      offset,
      span
    };
  }).filter(function(e) {
    return e.offset < maxRange;
  }).filter(function(e) {
    return e.span > 0;
  }).map(function(entry) {
    return {
      event: entry.event,
      offset: entry.offset,
      span: entry.span,
      startsBeforeWeek: entry.event.start < viewStart,
      endsAfterWeek: (entry.event.end || entry.event.start) > viewEnd
    };
  }).sort(function(itemA, itemB) {
    var startSecondsDiff = differenceInSeconds(itemA.event.start, itemB.event.start);
    if (startSecondsDiff === 0) {
      return differenceInSeconds(itemB.event.end || itemB.event.start, itemA.event.end || itemA.event.start);
    }
    return startSecondsDiff;
  });
  var allDayEventRows = [];
  var allocatedEvents = [];
  eventsMapped.forEach(function(event, index) {
    if (allocatedEvents.indexOf(event) === -1) {
      allocatedEvents.push(event);
      var rowSpan_1 = event.span + event.offset;
      var otherRowEvents = eventsMapped.slice(index + 1).filter(function(nextEvent) {
        if (nextEvent.offset >= rowSpan_1 && rowSpan_1 + nextEvent.span <= totalDaysInView && allocatedEvents.indexOf(nextEvent) === -1) {
          var nextEventOffset = nextEvent.offset - rowSpan_1;
          if (!absolutePositionedEvents) {
            nextEvent.offset = nextEventOffset;
          }
          rowSpan_1 += nextEvent.span + nextEventOffset;
          allocatedEvents.push(nextEvent);
          return true;
        }
      });
      var weekEvents = __spreadArray([event], otherRowEvents, true);
      var id = weekEvents.filter(function(weekEvent) {
        return weekEvent.event.id;
      }).map(function(weekEvent) {
        return weekEvent.event.id;
      }).join("-");
      allDayEventRows.push(__assign({
        row: weekEvents
      }, id ? {
        id
      } : {}));
    }
  });
  return allDayEventRows;
}
function getWeekViewHourGrid(dateAdapter, _a) {
  var events = _a.events, viewDate = _a.viewDate, hourSegments = _a.hourSegments, hourDuration = _a.hourDuration, dayStart = _a.dayStart, dayEnd = _a.dayEnd, weekStartsOn = _a.weekStartsOn, excluded = _a.excluded, weekendDays = _a.weekendDays, segmentHeight = _a.segmentHeight, viewStart = _a.viewStart, viewEnd = _a.viewEnd, minimumEventHeight = _a.minimumEventHeight;
  var dayViewHourGrid = getDayViewHourGrid(dateAdapter, {
    viewDate,
    hourSegments,
    hourDuration,
    dayStart,
    dayEnd
  });
  var weekDays = getWeekViewHeader(dateAdapter, {
    viewDate,
    weekStartsOn,
    excluded,
    weekendDays,
    viewStart,
    viewEnd
  });
  var setHours = dateAdapter.setHours, setMinutes = dateAdapter.setMinutes, getHours = dateAdapter.getHours, getMinutes = dateAdapter.getMinutes;
  return weekDays.map(function(day) {
    var dayView = getDayView(dateAdapter, {
      events,
      viewDate: day.date,
      hourSegments,
      dayStart,
      dayEnd,
      segmentHeight,
      eventWidth: 1,
      hourDuration,
      minimumEventHeight
    });
    var hours = dayViewHourGrid.map(function(hour) {
      var segments = hour.segments.map(function(segment) {
        var date = setMinutes(setHours(day.date, getHours(segment.date)), getMinutes(segment.date));
        return __assign(__assign({}, segment), {
          date
        });
      });
      return __assign(__assign({}, hour), {
        segments
      });
    });
    function getColumnCount(allEvents, prevOverlappingEvents) {
      var columnCount = Math.max.apply(Math, prevOverlappingEvents.map(function(iEvent) {
        return iEvent.left + 1;
      }));
      var nextOverlappingEvents = allEvents.filter(function(iEvent) {
        return iEvent.left >= columnCount;
      }).filter(function(iEvent) {
        return getOverLappingWeekViewEvents(prevOverlappingEvents, iEvent.top, iEvent.top + iEvent.height).length > 0;
      });
      if (nextOverlappingEvents.length > 0) {
        return getColumnCount(allEvents, nextOverlappingEvents);
      } else {
        return columnCount;
      }
    }
    var mappedEvents = dayView.events.map(function(event) {
      var columnCount = getColumnCount(dayView.events, getOverLappingWeekViewEvents(dayView.events, event.top, event.top + event.height));
      var width = 100 / columnCount;
      return __assign(__assign({}, event), {
        left: event.left * width,
        width
      });
    });
    return {
      hours,
      date: day.date,
      events: mappedEvents.map(function(event) {
        var overLappingEvents = getOverLappingWeekViewEvents(mappedEvents.filter(function(otherEvent) {
          return otherEvent.left > event.left;
        }), event.top, event.top + event.height);
        if (overLappingEvents.length > 0) {
          return __assign(__assign({}, event), {
            width: Math.min.apply(Math, overLappingEvents.map(function(otherEvent) {
              return otherEvent.left;
            })) - event.left
          });
        }
        return event;
      })
    };
  });
}
function getWeekView(dateAdapter, _a) {
  var _b = _a.events, events = _b === void 0 ? [] : _b, viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn, _c = _a.excluded, excluded = _c === void 0 ? [] : _c, _d = _a.precision, precision = _d === void 0 ? "days" : _d, _e = _a.absolutePositionedEvents, absolutePositionedEvents = _e === void 0 ? false : _e, hourSegments = _a.hourSegments, hourDuration = _a.hourDuration, dayStart = _a.dayStart, dayEnd = _a.dayEnd, weekendDays = _a.weekendDays, segmentHeight = _a.segmentHeight, minimumEventHeight = _a.minimumEventHeight, _f = _a.viewStart, viewStart = _f === void 0 ? dateAdapter.startOfWeek(viewDate, {
    weekStartsOn
  }) : _f, _g = _a.viewEnd, viewEnd = _g === void 0 ? dateAdapter.endOfWeek(viewDate, {
    weekStartsOn
  }) : _g;
  if (!events) {
    events = [];
  }
  var startOfDay = dateAdapter.startOfDay, endOfDay = dateAdapter.endOfDay;
  viewStart = startOfDay(viewStart);
  viewEnd = endOfDay(viewEnd);
  var eventsInPeriod = getEventsInPeriod(dateAdapter, {
    events,
    periodStart: viewStart,
    periodEnd: viewEnd
  });
  var header = getWeekViewHeader(dateAdapter, {
    viewDate,
    weekStartsOn,
    excluded,
    weekendDays,
    viewStart,
    viewEnd
  });
  return {
    allDayEventRows: getAllDayWeekEvents(dateAdapter, {
      events: eventsInPeriod,
      excluded,
      precision,
      absolutePositionedEvents,
      viewStart,
      viewEnd
    }),
    period: {
      events: eventsInPeriod,
      start: header[0].date,
      end: endOfDay(header[header.length - 1].date)
    },
    hourColumns: getWeekViewHourGrid(dateAdapter, {
      events,
      viewDate,
      hourSegments,
      hourDuration,
      dayStart,
      dayEnd,
      weekStartsOn,
      excluded,
      weekendDays,
      segmentHeight,
      viewStart,
      viewEnd,
      minimumEventHeight
    })
  };
}
function getMonthView(dateAdapter, _a) {
  var _b = _a.events, events = _b === void 0 ? [] : _b, viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn, _c = _a.excluded, excluded = _c === void 0 ? [] : _c, _d = _a.viewStart, viewStart = _d === void 0 ? dateAdapter.startOfMonth(viewDate) : _d, _e = _a.viewEnd, viewEnd = _e === void 0 ? dateAdapter.endOfMonth(viewDate) : _e, weekendDays = _a.weekendDays;
  if (!events) {
    events = [];
  }
  var startOfWeek = dateAdapter.startOfWeek, endOfWeek = dateAdapter.endOfWeek, differenceInDays = dateAdapter.differenceInDays, startOfDay = dateAdapter.startOfDay, addHours = dateAdapter.addHours, endOfDay = dateAdapter.endOfDay, isSameMonth = dateAdapter.isSameMonth, getDay = dateAdapter.getDay;
  var start = startOfWeek(viewStart, {
    weekStartsOn
  });
  var end = endOfWeek(viewEnd, {
    weekStartsOn
  });
  var eventsInMonth = getEventsInPeriod(dateAdapter, {
    events,
    periodStart: start,
    periodEnd: end
  });
  var initialViewDays = [];
  var previousDate;
  var _loop_2 = function(i2) {
    var date;
    if (previousDate) {
      date = startOfDay(addHours(previousDate, HOURS_IN_DAY));
      if (previousDate.getTime() === date.getTime()) {
        date = startOfDay(addHours(previousDate, HOURS_IN_DAY + 1));
      }
      previousDate = date;
    } else {
      date = previousDate = start;
    }
    if (!excluded.some(function(e) {
      return getDay(date) === e;
    })) {
      var day = getWeekDay(dateAdapter, {
        date,
        weekendDays
      });
      var eventsInPeriod = getEventsInPeriod(dateAdapter, {
        events: eventsInMonth,
        periodStart: startOfDay(date),
        periodEnd: endOfDay(date)
      });
      day.inMonth = isSameMonth(date, viewDate);
      day.events = eventsInPeriod;
      day.badgeTotal = eventsInPeriod.length;
      initialViewDays.push(day);
    }
  };
  for (var i = 0; i < differenceInDays(end, start) + 1; i++) {
    _loop_2(i);
  }
  var days = [];
  var totalDaysVisibleInWeek = DAYS_IN_WEEK - excluded.length;
  if (totalDaysVisibleInWeek < DAYS_IN_WEEK) {
    for (var i = 0; i < initialViewDays.length; i += totalDaysVisibleInWeek) {
      var row = initialViewDays.slice(i, i + totalDaysVisibleInWeek);
      var isRowInMonth = row.some(function(day) {
        return viewStart <= day.date && day.date < viewEnd;
      });
      if (isRowInMonth) {
        days = __spreadArray(__spreadArray([], days, true), row, true);
      }
    }
  } else {
    days = initialViewDays;
  }
  var rows = Math.floor(days.length / totalDaysVisibleInWeek);
  var rowOffsets = [];
  for (var i = 0; i < rows; i++) {
    rowOffsets.push(i * totalDaysVisibleInWeek);
  }
  return {
    rowOffsets,
    totalDaysVisibleInWeek,
    days,
    period: {
      start: days[0].date,
      end: endOfDay(days[days.length - 1].date),
      events: eventsInMonth
    }
  };
}
function getOverLappingWeekViewEvents(events, top, bottom) {
  return events.filter(function(previousEvent) {
    var previousEventTop = previousEvent.top;
    var previousEventBottom = previousEvent.top + previousEvent.height;
    if (top < previousEventBottom && previousEventBottom < bottom) {
      return true;
    } else if (top < previousEventTop && previousEventTop < bottom) {
      return true;
    } else if (previousEventTop <= top && bottom <= previousEventBottom) {
      return true;
    }
    return false;
  });
}
function getDayView(dateAdapter, _a) {
  var events = _a.events, viewDate = _a.viewDate, hourSegments = _a.hourSegments, dayStart = _a.dayStart, dayEnd = _a.dayEnd, eventWidth = _a.eventWidth, segmentHeight = _a.segmentHeight, hourDuration = _a.hourDuration, minimumEventHeight = _a.minimumEventHeight;
  var setMinutes = dateAdapter.setMinutes, setHours = dateAdapter.setHours, startOfDay = dateAdapter.startOfDay, startOfMinute = dateAdapter.startOfMinute, endOfDay = dateAdapter.endOfDay, differenceInMinutes = dateAdapter.differenceInMinutes;
  var startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
  var endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
  endOfView.setSeconds(59, 999);
  var previousDayEvents = [];
  var eventsInPeriod = getEventsInPeriod(dateAdapter, {
    events: events.filter(function(event) {
      return !event.allDay;
    }),
    periodStart: startOfView,
    periodEnd: endOfView
  });
  var dayViewEvents = eventsInPeriod.sort(function(eventA, eventB) {
    return eventA.start.valueOf() - eventB.start.valueOf();
  }).map(function(event) {
    var eventStart = event.start;
    var eventEnd = event.end || eventStart;
    var startsBeforeDay = eventStart < startOfView;
    var endsAfterDay = eventEnd > endOfView;
    var hourHeightModifier = hourSegments * segmentHeight / (hourDuration || MINUTES_IN_HOUR);
    var top = 0;
    if (eventStart > startOfView) {
      var eventOffset = dateAdapter.getTimezoneOffset(eventStart);
      var startOffset = dateAdapter.getTimezoneOffset(startOfView);
      var diff = startOffset - eventOffset;
      top += differenceInMinutes(eventStart, startOfView) + diff;
    }
    top *= hourHeightModifier;
    top = Math.floor(top);
    var startDate = startsBeforeDay ? startOfView : eventStart;
    var endDate = endsAfterDay ? endOfView : eventEnd;
    var timezoneOffset = dateAdapter.getTimezoneOffset(startDate) - dateAdapter.getTimezoneOffset(endDate);
    var height = differenceInMinutes(endDate, startDate) + timezoneOffset;
    if (!event.end) {
      height = segmentHeight;
    } else {
      height *= hourHeightModifier;
    }
    if (minimumEventHeight && height < minimumEventHeight) {
      height = minimumEventHeight;
    }
    height = Math.floor(height);
    var bottom = top + height;
    var overlappingPreviousEvents = getOverLappingWeekViewEvents(previousDayEvents, top, bottom);
    var left = 0;
    while (overlappingPreviousEvents.some(function(previousEvent) {
      return previousEvent.left === left;
    })) {
      left += eventWidth;
    }
    var dayEvent = {
      event,
      height,
      width: eventWidth,
      top,
      left,
      startsBeforeDay,
      endsAfterDay
    };
    previousDayEvents.push(dayEvent);
    return dayEvent;
  });
  var width = Math.max.apply(Math, dayViewEvents.map(function(event) {
    return event.left + event.width;
  }));
  var allDayEvents = getEventsInPeriod(dateAdapter, {
    events: events.filter(function(event) {
      return event.allDay;
    }),
    periodStart: startOfDay(startOfView),
    periodEnd: endOfDay(endOfView)
  });
  return {
    events: dayViewEvents,
    width,
    allDayEvents,
    period: {
      events: eventsInPeriod,
      start: startOfView,
      end: endOfView
    }
  };
}
function sanitiseHours(hours) {
  return Math.max(Math.min(23, hours), 0);
}
function sanitiseMinutes(minutes) {
  return Math.max(Math.min(59, minutes), 0);
}
function getDayViewHourGrid(dateAdapter, _a) {
  var viewDate = _a.viewDate, hourSegments = _a.hourSegments, hourDuration = _a.hourDuration, dayStart = _a.dayStart, dayEnd = _a.dayEnd;
  var setMinutes = dateAdapter.setMinutes, setHours = dateAdapter.setHours, startOfDay = dateAdapter.startOfDay, startOfMinute = dateAdapter.startOfMinute, endOfDay = dateAdapter.endOfDay, addMinutes = dateAdapter.addMinutes, addDays = dateAdapter.addDays;
  var hours = [];
  var startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
  var endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
  var segmentDuration = (hourDuration || MINUTES_IN_HOUR) / hourSegments;
  var startOfViewDay = startOfDay(viewDate);
  var endOfViewDay = endOfDay(viewDate);
  var dateAdjustment = function(d) {
    return d;
  };
  if (dateAdapter.getTimezoneOffset(startOfViewDay) !== dateAdapter.getTimezoneOffset(endOfViewDay)) {
    startOfViewDay = addDays(startOfViewDay, 1);
    startOfView = addDays(startOfView, 1);
    endOfView = addDays(endOfView, 1);
    dateAdjustment = function(d) {
      return addDays(d, -1);
    };
  }
  var dayDuration = hourDuration ? HOURS_IN_DAY * 60 / hourDuration : MINUTES_IN_HOUR;
  for (var i = 0; i < dayDuration; i++) {
    var segments = [];
    for (var j = 0; j < hourSegments; j++) {
      var date = addMinutes(addMinutes(startOfView, i * (hourDuration || MINUTES_IN_HOUR)), j * segmentDuration);
      if (date >= startOfView && date < endOfView) {
        segments.push({
          date: dateAdjustment(date),
          displayDate: date,
          isStart: j === 0
        });
      }
    }
    if (segments.length > 0) {
      hours.push({
        segments
      });
    }
  }
  return hours;
}
var EventValidationErrorMessage;
(function(EventValidationErrorMessage2) {
  EventValidationErrorMessage2["NotArray"] = "Events must be an array";
  EventValidationErrorMessage2["StartPropertyMissing"] = "Event is missing the `start` property";
  EventValidationErrorMessage2["StartPropertyNotDate"] = "Event `start` property should be a javascript date object. Do `new Date(event.start)` to fix it.";
  EventValidationErrorMessage2["EndPropertyNotDate"] = "Event `end` property should be a javascript date object. Do `new Date(event.end)` to fix it.";
  EventValidationErrorMessage2["EndsBeforeStart"] = "Event `start` property occurs after the `end`";
})(EventValidationErrorMessage || (EventValidationErrorMessage = {}));
function validateEvents(events, log) {
  var isValid = true;
  function isError(msg, event) {
    log(msg, event);
    isValid = false;
  }
  if (!Array.isArray(events)) {
    log(EventValidationErrorMessage.NotArray, events);
    return false;
  }
  events.forEach(function(event) {
    if (!event.start) {
      isError(EventValidationErrorMessage.StartPropertyMissing, event);
    } else if (!(event.start instanceof Date)) {
      isError(EventValidationErrorMessage.StartPropertyNotDate, event);
    }
    if (event.end) {
      if (!(event.end instanceof Date)) {
        isError(EventValidationErrorMessage.EndPropertyNotDate, event);
      }
      if (event.start > event.end) {
        isError(EventValidationErrorMessage.EndsBeforeStart, event);
      }
    }
  });
  return isValid;
}
export {
  DAYS_OF_WEEK,
  EventValidationErrorMessage,
  SECONDS_IN_DAY,
  getAllDayWeekEvents,
  getDifferenceInDaysWithExclusions,
  getEventsInPeriod,
  getMonthView,
  getWeekView,
  getWeekViewHeader,
  validateEvents
};
//# sourceMappingURL=calendar-utils.js.map
