import "./chunk-WDMUDEB6.js";

// node_modules/positioning/dist/positioning.js
var Positioning = (
  /** @class */
  function() {
    function Positioning2() {
    }
    Positioning2.prototype.getAllStyles = function(element) {
      return window.getComputedStyle(element);
    };
    Positioning2.prototype.getStyle = function(element, prop) {
      return this.getAllStyles(element)[prop];
    };
    Positioning2.prototype.isStaticPositioned = function(element) {
      return (this.getStyle(element, "position") || "static") === "static";
    };
    Positioning2.prototype.offsetParent = function(element) {
      var offsetParentEl = element.offsetParent || document.documentElement;
      while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
        offsetParentEl = offsetParentEl.offsetParent;
      }
      return offsetParentEl || document.documentElement;
    };
    Positioning2.prototype.position = function(element, round) {
      if (round === void 0) {
        round = true;
      }
      var elPosition;
      var parentOffset = {
        width: 0,
        height: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      };
      if (this.getStyle(element, "position") === "fixed") {
        elPosition = element.getBoundingClientRect();
        elPosition = {
          top: elPosition.top,
          bottom: elPosition.bottom,
          left: elPosition.left,
          right: elPosition.right,
          height: elPosition.height,
          width: elPosition.width
        };
      } else {
        var offsetParentEl = this.offsetParent(element);
        elPosition = this.offset(element, false);
        if (offsetParentEl !== document.documentElement) {
          parentOffset = this.offset(offsetParentEl, false);
        }
        parentOffset.top += offsetParentEl.clientTop;
        parentOffset.left += offsetParentEl.clientLeft;
      }
      elPosition.top -= parentOffset.top;
      elPosition.bottom -= parentOffset.top;
      elPosition.left -= parentOffset.left;
      elPosition.right -= parentOffset.left;
      if (round) {
        elPosition.top = Math.round(elPosition.top);
        elPosition.bottom = Math.round(elPosition.bottom);
        elPosition.left = Math.round(elPosition.left);
        elPosition.right = Math.round(elPosition.right);
      }
      return elPosition;
    };
    Positioning2.prototype.offset = function(element, round) {
      if (round === void 0) {
        round = true;
      }
      var elBcr = element.getBoundingClientRect();
      var viewportOffset = {
        top: window.pageYOffset - document.documentElement.clientTop,
        left: window.pageXOffset - document.documentElement.clientLeft
      };
      var elOffset = {
        height: elBcr.height || element.offsetHeight,
        width: elBcr.width || element.offsetWidth,
        top: elBcr.top + viewportOffset.top,
        bottom: elBcr.bottom + viewportOffset.top,
        left: elBcr.left + viewportOffset.left,
        right: elBcr.right + viewportOffset.left
      };
      if (round) {
        elOffset.height = Math.round(elOffset.height);
        elOffset.width = Math.round(elOffset.width);
        elOffset.top = Math.round(elOffset.top);
        elOffset.bottom = Math.round(elOffset.bottom);
        elOffset.left = Math.round(elOffset.left);
        elOffset.right = Math.round(elOffset.right);
      }
      return elOffset;
    };
    Positioning2.prototype.positionElements = function(hostElement, targetElement, placement, appendToBody) {
      var _a = placement.split("-"), _b = _a[0], placementPrimary = _b === void 0 ? "top" : _b, _c = _a[1], placementSecondary = _c === void 0 ? "center" : _c;
      var hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
      var targetElStyles = this.getAllStyles(targetElement);
      var marginTop = parseFloat(targetElStyles.marginTop);
      var marginBottom = parseFloat(targetElStyles.marginBottom);
      var marginLeft = parseFloat(targetElStyles.marginLeft);
      var marginRight = parseFloat(targetElStyles.marginRight);
      var topPosition = 0;
      var leftPosition = 0;
      switch (placementPrimary) {
        case "top":
          topPosition = hostElPosition.top - (targetElement.offsetHeight + marginTop + marginBottom);
          break;
        case "bottom":
          topPosition = hostElPosition.top + hostElPosition.height;
          break;
        case "left":
          leftPosition = hostElPosition.left - (targetElement.offsetWidth + marginLeft + marginRight);
          break;
        case "right":
          leftPosition = hostElPosition.left + hostElPosition.width;
          break;
      }
      switch (placementSecondary) {
        case "top":
          topPosition = hostElPosition.top;
          break;
        case "bottom":
          topPosition = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
          break;
        case "left":
          leftPosition = hostElPosition.left;
          break;
        case "right":
          leftPosition = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
          break;
        case "center":
          if (placementPrimary === "top" || placementPrimary === "bottom") {
            leftPosition = hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2;
          } else {
            topPosition = hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2;
          }
          break;
      }
      targetElement.style.transform = "translate(" + Math.round(leftPosition) + "px, " + Math.round(topPosition) + "px)";
      var targetElBCR = targetElement.getBoundingClientRect();
      var html = document.documentElement;
      var windowHeight = window.innerHeight || html.clientHeight;
      var windowWidth = window.innerWidth || html.clientWidth;
      return targetElBCR.left >= 0 && targetElBCR.top >= 0 && targetElBCR.right <= windowWidth && targetElBCR.bottom <= windowHeight;
    };
    return Positioning2;
  }()
);
var placementSeparator = /\s+/;
var positionService = new Positioning();
function positionElements(hostElement, targetElement, placement, appendToBody, baseClass) {
  var placementVals = Array.isArray(placement) ? placement : placement.split(placementSeparator);
  var allowedPlacements = ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right", "left-top", "left-bottom", "right-top", "right-bottom"];
  var classList = targetElement.classList;
  var addClassesToTarget = function(targetPlacement) {
    var _a = targetPlacement.split("-"), primary = _a[0], secondary = _a[1];
    var classes = [];
    if (baseClass) {
      classes.push(baseClass + "-" + primary);
      if (secondary) {
        classes.push(baseClass + "-" + primary + "-" + secondary);
      }
      classes.forEach(function(classname) {
        classList.add(classname);
      });
    }
    return classes;
  };
  if (baseClass) {
    allowedPlacements.forEach(function(placementToRemove) {
      classList.remove(baseClass + "-" + placementToRemove);
    });
  }
  var hasAuto = placementVals.findIndex(function(val) {
    return val === "auto";
  });
  if (hasAuto >= 0) {
    allowedPlacements.forEach(function(obj) {
      if (placementVals.find(function(val) {
        return val.search("^" + obj) !== -1;
      }) == null) {
        placementVals.splice(hasAuto++, 1, obj);
      }
    });
  }
  var style = targetElement.style;
  style.position = "absolute";
  style.top = "0";
  style.left = "0";
  style["will-change"] = "transform";
  var testPlacement;
  var isInViewport = false;
  for (var _i = 0, placementVals_1 = placementVals; _i < placementVals_1.length; _i++) {
    testPlacement = placementVals_1[_i];
    var addedClasses = addClassesToTarget(testPlacement);
    if (positionService.positionElements(hostElement, targetElement, testPlacement, appendToBody)) {
      isInViewport = true;
      break;
    }
    if (baseClass) {
      addedClasses.forEach(function(classname) {
        classList.remove(classname);
      });
    }
  }
  if (!isInViewport) {
    testPlacement = placementVals[0];
    addClassesToTarget(testPlacement);
    positionService.positionElements(hostElement, targetElement, testPlacement, appendToBody);
  }
  return testPlacement;
}
export {
  positionElements
};
//# sourceMappingURL=positioning.js.map
