"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _range = require("../range");

Object.keys(_range).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _range[key];
    }
  });
});