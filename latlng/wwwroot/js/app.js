webpackJsonp([0],{

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Config settings for generic utility functions.
 */
var utils = exports.utils = {
    // Should log all messages.
    log: true && true
};
/**
 * Config settings for the pre-loader.
 */
var loader = exports.loader = {
    // Should log all messages.
    log: true && true
};
/**
 * Config settings for utils/ajax.
 */
var ajax = exports.ajax = {
    // Should log all messages.
    log: true && true,
    // Should be in dev mode, and mock requests rather than sending them to the server.
    dev: true && false,
    // Timeout period for requests for dev mode.
    timeout: 2500
};
/**
 * Config settings for utils/mock.
 */
var mock = exports.mock = {
    // Should log all messages.
    log: true && true,
    // Should fail.
    error: false
};
/**
 * Config settings for forms.
 */
var form = exports.form = {
    // Should log all messages.
    log: true && true,
    // Should stop on field validation error. Set to false to submit form even with validation errors.
    // TESTING ONLY.
    stopOnError: true
};

/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(27);


/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(11);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _papaparse = __webpack_require__(18);

var _papaparse2 = _interopRequireDefault(_papaparse);

var _ajax = __webpack_require__(39);

var _ajax2 = _interopRequireDefault(_ajax);

var _logging = __webpack_require__(9);

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LatLng = function (_React$Component) {
    _inherits(LatLng, _React$Component);

    function LatLng(props) {
        _classCallCheck(this, LatLng);

        var _this = _possibleConstructorReturn(this, (LatLng.__proto__ || Object.getPrototypeOf(LatLng)).call(this, props));

        _this.onUpload = function (event) {
            if (null !== event.target.files && null !== event.target.files[0]) {
                _this.startTime = new Date();
                _this.fileName = event.target.files[0].name;
                _papaparse2.default.parse(event.target.files[0], {
                    complete: _this.onParseComplete
                });
            }
        };
        _this.onParseComplete = function (results) {
            if (null !== results.data && 0 < results.data.length) {
                // Identify which index holds the address.
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = results.data[0][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var data = _step.value;

                        if (-1 < data.toLowerCase().indexOf("address")) {
                            _this.addressIndex = results.data[0].indexOf(data);
                        }
                        if (-1 < data.toLowerCase().indexOf("city")) {
                            _this.cityIndex = results.data[0].indexOf(data);
                        }
                        if (-1 < data.toLowerCase().indexOf("state")) {
                            _this.stateIndex = results.data[0].indexOf(data);
                        }
                        if (-1 < data.toLowerCase().indexOf("zip")) {
                            _this.zipIndex = results.data[0].indexOf(data);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                _this.latIndex = results.data[0].length;
                _this.lngIndex = _this.latIndex + 1;
                results.data[0][_this.latIndex] = "Latitude";
                results.data[0][_this.lngIndex] = "Longitude";
                _this.csvData = results.data;
                setTimeout(_this.getLocation, _this.timeDelay, _this.csvData[1][_this.addressIndex]);
            }
        };
        _this.getLocation = function (address) {
            var currentIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            _ajax2.default.get("api/geocode?address=" + address + ", " + _this.csvData[currentIndex][_this.cityIndex]).then(function (result) {
                var status = result.data.status;
                var geocodeResults = result.data.results;
                _logging2.default.log("STATUS: %s", status);
                if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
                    _logging2.default.log("STOPPING.");
                    return;
                } else if (status === google.maps.GeocoderStatus.OK) {
                    _this.csvData[currentIndex][_this.lngIndex] = geocodeResults[0].geometry.location.lng;
                    _this.csvData[currentIndex][_this.latIndex] = geocodeResults[0].geometry.location.lat;
                    _this.setState({ completed: currentIndex });
                } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                    _this.csvData[currentIndex][_this.latIndex] = 0;
                    _this.csvData[currentIndex][_this.lngIndex] = 0;
                    _this.state.notFound.push(_this.csvData[currentIndex][_this.addressIndex]);
                    _this.setState({ completed: currentIndex, notFound: _this.state.notFound });
                } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT || status === google.maps.GeocoderStatus.UNKNOWN_ERROR) {
                    _logging2.default.log("PAUSED");
                    setTimeout(_this.getLocation, 50000, _this.csvData[currentIndex][_this.addressIndex], currentIndex);
                    return;
                }
                _this.csvData[currentIndex][_this.addressIndex] += ", " + _this.csvData[currentIndex][_this.cityIndex] + ", " + _this.csvData[currentIndex][_this.stateIndex] + " " + _this.csvData[currentIndex][_this.zipIndex];
                currentIndex += 1;
                if (currentIndex >= _this.csvData.length - 1) {
                    _logging2.default.log("FINISHED");
                    // Surround strings in quotes, and add line breaks to the end of each row.
                    var data = _this.csvData.map(function (value) {
                        return value.map(function (val) {
                            if (typeof val === "string") {
                                return "\"" + val + "\"";
                            } else {
                                return val;
                            }
                        }).join(",");
                    }).join("\r\n");
                    var link = document.createElement("a");
                    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(data);
                    link.innerText = "Click to download.";
                    link.setAttribute("download", _this.fileName);
                    var main = document.getElementById("mainText");
                    if (null !== main) {
                        main.appendChild(link);
                    }
                } else {
                    setTimeout(_this.getLocation, _this.timeDelay * Math.random(), _this.csvData[currentIndex][_this.addressIndex], currentIndex);
                }
            });
        };
        _this.state = {
            notFound: [],
            completed: 0
        };
        _this.timeDelay = 50;
        _this.addressIndex = -1;
        _this.cityIndex = -1;
        _this.stateIndex = -1;
        _this.zipIndex = -1;
        _this.latIndex = -1;
        _this.lngIndex = -1;
        _this.csvData = [];
        _this.startTime = new Date();
        _this.fileName = "";
        return _this;
    }

    _createClass(LatLng, [{
        key: "render",
        value: function render() {
            var progress = _react2.default.createElement("span", null);
            // Subtract 1 from the length, to account for the header line.
            if (undefined !== this.csvData) {
                var eta = new Date();
                eta.setTime(eta.getTime() + (this.csvData.length - 1 - this.state.completed) * this.timeDelay);
                var countDown = new Date(eta.getTime() - new Date().getTime());
                progress = _react2.default.createElement(
                    _react2.default.Fragment,
                    null,
                    _react2.default.createElement(
                        "div",
                        { className: "col-sm-8 mx-auto mb-2" },
                        "Progress: ",
                        this.state.completed,
                        "/",
                        this.csvData.length - 1
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "col-sm-8 mx-auto mb-5" },
                        "Countdown: ",
                        countDown.getMinutes(),
                        ":",
                        countDown.getSeconds()
                    )
                );
            }
            var notFound = this.state.notFound.map(function (value, index) {
                return _react2.default.createElement(
                    "div",
                    { key: index },
                    value
                );
            });
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                    "div",
                    { id: "mainText", className: "col-sm-8 mx-auto mb-5" },
                    "Upload a CSV file with a field called \"Address\", to retreive the latitude and longitude of all the addresses. Addresses that can't be found will be listed below."
                ),
                _react2.default.createElement(
                    "div",
                    { className: "col-sm-8 mx-auto mb-3" },
                    _react2.default.createElement("input", { type: "file", accept: "*.csv", onChange: this.onUpload })
                ),
                progress,
                _react2.default.createElement(
                    "div",
                    { className: "col-sm-8 mx-auto" },
                    notFound
                )
            );
        }
    }]);

    return LatLng;
}(_react2.default.Component);

var latlng = document.getElementById("latlng");
if (null !== latlng) {
    _reactDom2.default.render(_react2.default.createElement(LatLng, null), latlng);
}

/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = __webpack_require__(19);

var _axios2 = _interopRequireDefault(_axios);

var _debug = __webpack_require__(25);

var _logging = __webpack_require__(9);

var _logging2 = _interopRequireDefault(_logging);

var _mock = __webpack_require__(58);

var _mock2 = _interopRequireDefault(_mock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Utility class for handling ajax requests.
 */
var Ajax = function () {
    function Ajax() {
        _classCallCheck(this, Ajax);
    }

    _createClass(Ajax, null, [{
        key: "post",

        /**
         * Static function for sending POST requests.
         * @param path Path to POST data to.
         * @param data Data to send.
         * @returns {Promise} Returns a promise.
         */
        value: function post(path, data) {
            return new Promise(function (resolve, reject) {
                Ajax.log("Sending POST: %s, data: %o", path, data);
                if (_debug.ajax.dev) {
                    setTimeout(function () {
                        _mock2.default.post(path).then(function (result) {
                            Ajax.log("Completed DEV POST: %s, response: %o", path, result);
                            resolve(result);
                        }).catch(function (error) {
                            _logging2.default.error("Completed DEV POST: %s, %o", path, error);
                            reject(error);
                        });
                    }, _debug.ajax.timeout);
                } else {
                    _axios2.default.post(path, data).then(function (result) {
                        Ajax.log("Completed POST: %s, response: %o", path, result);
                        resolve(result);
                    }).catch(function (error) {
                        _logging2.default.error("Completed POST: %s, %o", path, error);
                        reject(error);
                    });
                }
            });
        }
        /**
         * Static function for sending GET requests.
         * @param path Path to send GET request to.
         * @returns {Promise} Returns a Promise.
         */

    }, {
        key: "get",
        value: function get(path, data) {
            return new Promise(function (resolve, reject) {
                Ajax.log("Sending GET: %s", path);
                if (_debug.ajax.dev) {
                    setTimeout(function () {
                        _mock2.default.get(path).then(function (result) {
                            Ajax.log("Completed DEV GET: %s, response: %o", path, result);
                            resolve(result);
                        }).catch(function (error) {
                            _logging2.default.error("Completed DEV GET: %s, %o", path, error);
                            reject(error);
                        });
                    }, _debug.ajax.timeout);
                } else {
                    _axios2.default.get(path).then(function (result) {
                        Ajax.log("Completed GET: %s, response: %o", path, result);
                        resolve(result);
                    }).catch(function (error) {
                        _logging2.default.error("Completed GET: %s, %o", path, error);
                        reject(error);
                    });
                }
            });
        }
        /**
         * Internal function for logging. Allows easy enable/disable of all standard logging.
         * @param message Message to log.
         * @param args Arguments to include in the message.
         */

    }, {
        key: "log",
        value: function log(message) {
            if (_debug.ajax.log) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                _logging2.default.log.apply(_logging2.default, [message].concat(args));
            }
        }
    }]);

    return Ajax;
}();

exports.default = Ajax;

/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = __webpack_require__(25);

var _logging = __webpack_require__(9);

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var errorMock = { name: "Error", message: "Mocking error testing.", stack: "mock.tsx" };
/**
 * Utility class to mock out api requests without actually talking to the server.
 *
 * Used for testing purposes only.
 */

var Mock = function () {
    function Mock() {
        _classCallCheck(this, Mock);
    }

    _createClass(Mock, null, [{
        key: "post",

        /**
         * Mock a POST request.
         * @param path The path to mock.
         * @returns {Promise} Returns a Promise.
         */
        value: function post(path) {
            var result = {
                data: null,
                status: 200,
                statusText: "OK"
            };
            Mock.log("Mocking POST: %s.", path);
            switch (path) {
                default:
                    result.data = "POST: Mocked request.";
                    break;
            }
            return new Promise(function (resolve, reject) {
                if (_debug.mock.error) {
                    Mock.log("Mocking POST: %s, rejecting with %o.", path, errorMock);
                    reject(errorMock);
                } else {
                    Mock.log("Mocking POST: %s, resolving with %o.", path, result);
                    resolve(result);
                }
            });
        }
        /**
         * Mock a GET request.
         * @param path The path to mock.
         * @returns {Promise} Returns a Promise.
         */

    }, {
        key: "get",
        value: function get(path) {
            var result = {
                data: null,
                status: 200,
                statusText: "OK"
            };
            Mock.log("Mocking GET: %s.", path);
            switch (path) {
                default:
                    {
                        Mock.log("Mocking GET: %s, not found.", path);
                        result.data = "GET: Mocked request.";
                        break;
                    }
            }
            return new Promise(function (resolve, reject) {
                if (_debug.mock.error) {
                    Mock.log("Mocking GET: %s, rejecting with %o.", path, errorMock);
                    reject(errorMock);
                } else {
                    Mock.log("Mocking GET: %s, resolving with %o.", path, result);
                    resolve(result);
                }
            });
        }
    }, {
        key: "log",
        value: function log(message) {
            if (_debug.mock.log) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                _logging2.default.log.apply(_logging2.default, [message].concat(args));
            }
        }
    }]);

    return Mock;
}();

exports.default = Mock;

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Util class for preventing console messages on production environment.
 */
var Logging = function () {
    function Logging() {
        _classCallCheck(this, Logging);
    }

    _createClass(Logging, null, [{
        key: "log",
        value: function log(text) {
            var _console;

            if (false) {
                return;
            }

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            (_console = console).info.apply(_console, [text].concat(args));
        }
    }, {
        key: "warn",
        value: function warn(text) {
            var _console2;

            if (false) {
                return;
            }

            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            (_console2 = console).warn.apply(_console2, [text].concat(args));
        }
    }, {
        key: "error",
        value: function error(text) {
            var _console3;

            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            // error messages should always be logged, regardless of environment.
            (_console3 = console).error.apply(_console3, [text].concat(args));
        }
    }]);

    return Logging;
}();

exports.default = Logging;

/***/ })

},[26]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29uZmlncy9kZWJ1Zy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvYWpheC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL21vY2sudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9sb2dnaW5nLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUlNOzs7QUFBQyxJQUFXO0FBQ2E7QUFDeEIsU0FBTSxJQUFKLElBQ1A7QUFIbUI7QUFRZjs7O0FBQUMsSUFBWTtBQUNZO0FBQ3hCLFNBQU0sSUFBSixJQUNQO0FBSG9CO0FBUWhCOzs7QUFBQyxJQUFVO0FBQ2M7QUFDeEIsU0FBTSxJQUFKLElBQXFCO0FBQ3lEO0FBQ2hGLFNBQU0sSUFBSixJQUFzQjtBQUNpQjtBQUNyQyxhQUNUO0FBUGtCO0FBWWQ7OztBQUFDLElBQVU7QUFDYztBQUN4QixTQUFNLElBQUosSUFBcUI7QUFDWDtBQUNWLFdBQ1A7QUFMa0I7QUFVZDs7O0FBQUMsSUFBVTtBQUNjO0FBQ3hCLFNBQU0sSUFBSixJQUFxQjtBQUN3RTtBQUNsRjtBQUNMLGlCQUNiO0FBTmtCLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUN1Qjs7OztBQUNWOzs7O0FBRUo7Ozs7QUFFQzs7OztBQVE5Qjs7Ozs7Ozs7Ozs7O0lBQWE7OztBQVlULG9CQUFxQjtBQUNaOztvSEFBUTs7QUE2RFAsY0FBUSxXQUFHLFVBQStDO0FBQzdELGdCQUFLLFNBQVUsTUFBTyxPQUFNLFNBQVEsU0FBVSxNQUFPLE9BQU0sTUFBSSxJQUFFO0FBQzVELHNCQUFVLFlBQUcsSUFBVztBQUN4QixzQkFBUyxXQUFRLE1BQU8sT0FBTSxNQUFHLEdBQU07QUFDdkMsb0NBQU0sTUFBTSxNQUFPLE9BQU0sTUFBRztBQUNwQiw4QkFBTSxNQUV0QjtBQUhzQztBQUkxQztBQUFDO0FBRVMsY0FBZSxrQkFBRyxVQUE4QjtBQUNuRCxn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QkFBSSxJQUE4QiwrQkFBUTtBQUN4QywrQkFBSyxPQUEwQjtBQUV6QztBQUNIOztBQUVLLHVCQUFZLFFBQUMsVUFBUSxTQUFZO0FBQ2hDLG9CQUFPLFlBQU8sT0FBRTtBQUNYLHlCQUFJLElBQXNDLHVDQUFNLE1BQWE7QUFDM0QsMkJBQ1Y7QUFBTSx1QkFBRTtBQUNBLHlCQUFJLElBQXNDLHVDQUFNLE1BQVU7QUFDdkQsNEJBQ1g7QUFDSjtBQUNKLGFBVFc7QUFXUzs7OzRCQUFrQjtBQUMvQixnQkFBTyxZQUFLO0FBQUU7QUFEK0I7OztBQUVyQyxrQ0FBSSw4QkFBVSxnQkFDekI7QUFDSjtBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1RWE7OztJQUNPOzs7Ozs7OzRCQUFlOzs7QUFDekIsZ0JBQUMsS0FBYSxFQUFFO0FBRW5CO0FBQUM7OztBQUh5Qzs7O0FBS25DLGlDQUFLLHNCQUFPLGFBQ3ZCO0FBRWtCOzs7NkJBQWU7OztBQUMxQixnQkFBQyxLQUFhLEVBQUU7QUFFbkI7QUFBQzs7O0FBSDBDOzs7QUFLcEMsa0NBQUssdUJBQU8sYUFDdkI7QUFFbUI7Ozs4QkFBZTs7OztBQUFjOzs7QUFDeUI7QUFDOUQsa0NBQU0sd0JBQU8sYUFDeEI7QUFDSCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIENvbmZpZyBzZXR0aW5ncyBmb3IgZ2VuZXJpYyB1dGlsaXR5IGZ1bmN0aW9ucy5cclxuICovXHJcbmV4cG9ydCBjb25zdCB1dGlscyA9IHtcclxuICAgIC8vIFNob3VsZCBsb2cgYWxsIG1lc3NhZ2VzLlxyXG4gICAgbG9nOiAoQVBQLkVOVi5ERVYpICYmIHRydWUsXHJcbn07XHJcblxyXG4vKipcclxuICogQ29uZmlnIHNldHRpbmdzIGZvciB0aGUgcHJlLWxvYWRlci5cclxuICovXHJcbmV4cG9ydCBjb25zdCBsb2FkZXIgPSB7XHJcbiAgICAvLyBTaG91bGQgbG9nIGFsbCBtZXNzYWdlcy5cclxuICAgIGxvZzogKEFQUC5FTlYuREVWKSAmJiB0cnVlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbmZpZyBzZXR0aW5ncyBmb3IgdXRpbHMvYWpheC5cclxuICovXHJcbmV4cG9ydCBjb25zdCBhamF4ID0ge1xyXG4gICAgLy8gU2hvdWxkIGxvZyBhbGwgbWVzc2FnZXMuXHJcbiAgICBsb2c6IChBUFAuRU5WLkRFVikgJiYgdHJ1ZSxcclxuICAgIC8vIFNob3VsZCBiZSBpbiBkZXYgbW9kZSwgYW5kIG1vY2sgcmVxdWVzdHMgcmF0aGVyIHRoYW4gc2VuZGluZyB0aGVtIHRvIHRoZSBzZXJ2ZXIuXHJcbiAgICBkZXY6IChBUFAuRU5WLkRFVikgJiYgZmFsc2UsXHJcbiAgICAvLyBUaW1lb3V0IHBlcmlvZCBmb3IgcmVxdWVzdHMgZm9yIGRldiBtb2RlLlxyXG4gICAgdGltZW91dDogMjUwMCxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb25maWcgc2V0dGluZ3MgZm9yIHV0aWxzL21vY2suXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbW9jayA9IHtcclxuICAgIC8vIFNob3VsZCBsb2cgYWxsIG1lc3NhZ2VzLlxyXG4gICAgbG9nOiAoQVBQLkVOVi5ERVYpICYmIHRydWUsXHJcbiAgICAvLyBTaG91bGQgZmFpbC5cclxuICAgIGVycm9yOiBmYWxzZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb25maWcgc2V0dGluZ3MgZm9yIGZvcm1zLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZvcm0gPSB7XHJcbiAgICAvLyBTaG91bGQgbG9nIGFsbCBtZXNzYWdlcy5cclxuICAgIGxvZzogKEFQUC5FTlYuREVWKSAmJiB0cnVlLFxyXG4gICAgLy8gU2hvdWxkIHN0b3Agb24gZmllbGQgdmFsaWRhdGlvbiBlcnJvci4gU2V0IHRvIGZhbHNlIHRvIHN1Ym1pdCBmb3JtIGV2ZW4gd2l0aCB2YWxpZGF0aW9uIGVycm9ycy5cclxuICAgIC8vIFRFU1RJTkcgT05MWS5cclxuICAgIHN0b3BPbkVycm9yOiB0cnVlLFxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlciEuL3NyYy9jb25maWdzL2RlYnVnLnRzeCIsImltcG9ydCBSZWFjdCwgeyBDaGFuZ2VFdmVudCB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xyXG5cclxuaW1wb3J0IFBhcGEgZnJvbSBcInBhcGFwYXJzZVwiO1xyXG5cclxuaW1wb3J0IEFqYXggZnJvbSBcInV0aWxzL2FqYXhcIjtcclxuaW1wb3J0IExvZ2dpbmcgZnJvbSBcInV0aWxzL2xvZ2dpbmdcIjtcclxuXHJcbmludGVyZmFjZSBMYXRMbmdTdGF0ZSB7XHJcbiAgICBub3RGb3VuZDogc3RyaW5nW107XHJcbiAgICBjb21wbGV0ZWQ6IG51bWJlcjtcclxufVxyXG5cclxuY2xhc3MgTGF0TG5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHt9LCBMYXRMbmdTdGF0ZT4ge1xyXG4gICAgcHJpdmF0ZSBjc3ZEYXRhOiBhbnlbXTtcclxuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBEYXRlO1xyXG4gICAgcHJpdmF0ZSBmaWxlTmFtZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSB0aW1lRGVsYXk6IG51bWJlcjtcclxuICAgIHByaXZhdGUgYWRkcmVzc0luZGV4OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGNpdHlJbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBzdGF0ZUluZGV4OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHppcEluZGV4OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGxhdEluZGV4OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGxuZ0luZGV4OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IHt9KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBub3RGb3VuZDogW10sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZDogMCxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnRpbWVEZWxheSA9IDUwO1xyXG4gICAgICAgIHRoaXMuYWRkcmVzc0luZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5jaXR5SW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLnN0YXRlSW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLnppcEluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5sYXRJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMubG5nSW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLmNzdkRhdGEgPSBbXTtcclxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5maWxlTmFtZSA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcigpOiBSZWFjdC5SZWFjdEZyYWdtZW50IHtcclxuXHJcbiAgICAgICAgbGV0IHByb2dyZXNzOiBKU1guRWxlbWVudCA9IDxzcGFuIC8+O1xyXG5cclxuICAgICAgICAvLyBTdWJ0cmFjdCAxIGZyb20gdGhlIGxlbmd0aCwgdG8gYWNjb3VudCBmb3IgdGhlIGhlYWRlciBsaW5lLlxyXG4gICAgICAgIGlmICh1bmRlZmluZWQgIT09IHRoaXMuY3N2RGF0YSkge1xyXG4gICAgICAgICAgICBjb25zdCBldGE6IERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBldGEuc2V0VGltZShldGEuZ2V0VGltZSgpICsgKHRoaXMuY3N2RGF0YS5sZW5ndGggLSAxIC0gdGhpcy5zdGF0ZS5jb21wbGV0ZWQpICogdGhpcy50aW1lRGVsYXkpO1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudERvd246IERhdGUgPSBuZXcgRGF0ZShldGEuZ2V0VGltZSgpIC0gbmV3IERhdGUoKS5nZXRUaW1lKCkpO1xyXG5cclxuICAgICAgICAgICAgcHJvZ3Jlc3MgPSAoXHJcbiAgICAgICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOCBteC1hdXRvIG1iLTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvZ3Jlc3M6IHt0aGlzLnN0YXRlLmNvbXBsZXRlZH0ve3RoaXMuY3N2RGF0YS5sZW5ndGggLSAxfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTggbXgtYXV0byBtYi01XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENvdW50ZG93bjoge2NvdW50RG93bi5nZXRNaW51dGVzKCl9Ontjb3VudERvd24uZ2V0U2Vjb25kcygpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5vdEZvdW5kOiBKU1guRWxlbWVudFtdID0gdGhpcy5zdGF0ZS5ub3RGb3VuZC5tYXAoKHZhbHVlOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICg8ZGl2IGtleT17aW5kZXh9Pnt2YWx1ZX08L2Rpdj4pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibWFpblRleHRcIiBjbGFzc05hbWU9XCJjb2wtc20tOCBteC1hdXRvIG1iLTVcIj5cclxuICAgICAgICAgICAgICAgICAgICBVcGxvYWQgYSBDU1YgZmlsZSB3aXRoIGEgZmllbGQgY2FsbGVkIFwiQWRkcmVzc1wiLCB0byByZXRyZWl2ZSB0aGUgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZSBvZiBhbGwgdGhlIGFkZHJlc3Nlcy4gQWRkcmVzc2VzIHRoYXQgY2FuJ3QgYmUgZm91bmQgd2lsbCBiZSBsaXN0ZWQgYmVsb3cuXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTggbXgtYXV0byBtYi0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiKi5jc3ZcIiBvbkNoYW5nZT17dGhpcy5vblVwbG9hZH0gLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAge3Byb2dyZXNzfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOCBteC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge25vdEZvdW5kfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25VcGxvYWQgPSAoZXZlbnQ6IENoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KTogdm9pZCA9PiB7XHJcbiAgICAgICAgaWYgKG51bGwgIT09IGV2ZW50LnRhcmdldC5maWxlcyAmJiBudWxsICE9PSBldmVudC50YXJnZXQuZmlsZXNbMF0pIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmZpbGVOYW1lID0gZXZlbnQudGFyZ2V0LmZpbGVzWzBdLm5hbWU7XHJcbiAgICAgICAgICAgIFBhcGEucGFyc2UoZXZlbnQudGFyZ2V0LmZpbGVzWzBdLCB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogdGhpcy5vblBhcnNlQ29tcGxldGUsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25QYXJzZUNvbXBsZXRlID0gKHJlc3VsdHM6IFBhcGEuUGFyc2VSZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAobnVsbCAhPT0gcmVzdWx0cy5kYXRhICYmIDAgPCByZXN1bHRzLmRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vIElkZW50aWZ5IHdoaWNoIGluZGV4IGhvbGRzIHRoZSBhZGRyZXNzLlxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRhdGEgb2YgcmVzdWx0cy5kYXRhWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoLTEgPCAoZGF0YSBhcyBzdHJpbmcpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImFkZHJlc3NcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZHJlc3NJbmRleCA9IHJlc3VsdHMuZGF0YVswXS5pbmRleE9mKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKC0xIDwgKGRhdGEgYXMgc3RyaW5nKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJjaXR5XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5SW5kZXggPSByZXN1bHRzLmRhdGFbMF0uaW5kZXhPZihkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgtMSA8IChkYXRhIGFzIHN0cmluZykudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwic3RhdGVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlSW5kZXggPSByZXN1bHRzLmRhdGFbMF0uaW5kZXhPZihkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgtMSA8IChkYXRhIGFzIHN0cmluZykudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiemlwXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy56aXBJbmRleCA9IHJlc3VsdHMuZGF0YVswXS5pbmRleE9mKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxhdEluZGV4ID0gKHJlc3VsdHMuZGF0YVswXSBhcyBhbnkpLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5sbmdJbmRleCA9IHRoaXMubGF0SW5kZXggKyAxO1xyXG4gICAgICAgICAgICByZXN1bHRzLmRhdGFbMF1bdGhpcy5sYXRJbmRleF0gPSBcIkxhdGl0dWRlXCI7XHJcbiAgICAgICAgICAgIHJlc3VsdHMuZGF0YVswXVt0aGlzLmxuZ0luZGV4XSA9IFwiTG9uZ2l0dWRlXCI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNzdkRhdGEgPSByZXN1bHRzLmRhdGE7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuZ2V0TG9jYXRpb24sIHRoaXMudGltZURlbGF5LCB0aGlzLmNzdkRhdGFbMV1bdGhpcy5hZGRyZXNzSW5kZXhdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRMb2NhdGlvbiA9IChhZGRyZXNzOiBzdHJpbmcsIGN1cnJlbnRJbmRleDogbnVtYmVyID0gMSk6IHZvaWQgPT4ge1xyXG4gICAgICAgIEFqYXguZ2V0KFwiYXBpL2dlb2NvZGU/YWRkcmVzcz1cIiArIGFkZHJlc3MgKyBcIiwgXCIgKyB0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmNpdHlJbmRleF0pXHJcbiAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEpzb25SZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1czogZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMgPSByZXN1bHQuZGF0YS5zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnZW9jb2RlUmVzdWx0czogZ29vZ2xlLm1hcHMuR2VvY29kZXJSZXN1bHRbXSA9IHJlc3VsdC5kYXRhLnJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICBMb2dnaW5nLmxvZyhcIlNUQVRVUzogJXNcIiwgc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLlJFUVVFU1RfREVOSUVEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2luZy5sb2coXCJTVE9QUElORy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9LKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5sbmdJbmRleF0gPSBnZW9jb2RlUmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5sYXRJbmRleF0gPSBnZW9jb2RlUmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbXBsZXRlZDogY3VycmVudEluZGV4IH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLlpFUk9fUkVTVUxUUykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMubGF0SW5kZXhdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmxuZ0luZGV4XSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5ub3RGb3VuZC5wdXNoKHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMuYWRkcmVzc0luZGV4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbXBsZXRlZDogY3VycmVudEluZGV4LCBub3RGb3VuZDogdGhpcy5zdGF0ZS5ub3RGb3VuZCB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PVkVSX1FVRVJZX0xJTUlUIHx8IHN0YXR1cyA9PT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuVU5LTk9XTl9FUlJPUikge1xyXG4gICAgICAgICAgICAgICAgICAgIExvZ2dpbmcubG9nKFwiUEFVU0VEXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5nZXRMb2NhdGlvbiwgNTAwMDAsIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMuYWRkcmVzc0luZGV4XSwgY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmFkZHJlc3NJbmRleF0gKz0gXCIsIFwiICsgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5jaXR5SW5kZXhdICsgXCIsIFwiICsgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5zdGF0ZUluZGV4XSArIFwiIFwiICsgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy56aXBJbmRleF07XHJcblxyXG4gICAgICAgICAgICAgICAgY3VycmVudEluZGV4ICs9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA+PSB0aGlzLmNzdkRhdGEubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIExvZ2dpbmcubG9nKFwiRklOSVNIRURcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU3Vycm91bmQgc3RyaW5ncyBpbiBxdW90ZXMsIGFuZCBhZGQgbGluZSBicmVha3MgdG8gdGhlIGVuZCBvZiBlYWNoIHJvdy5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhOiBzdHJpbmcgPSB0aGlzLmNzdkRhdGEubWFwKCh2YWx1ZTogYW55W10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLm1hcCgodmFsOiBzdHJpbmcgfCBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXFxcIlwiICsgdmFsICsgXCJcXFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmpvaW4oXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLmpvaW4oXCJcXHJcXG5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBcImRhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcIiArIGVuY29kZVVSSUNvbXBvbmVudChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rLmlubmVyVGV4dCA9IFwiQ2xpY2sgdG8gZG93bmxvYWQuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoXCJkb3dubG9hZFwiLCB0aGlzLmZpbGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFpbjogSFRNTEVsZW1lbnQgfCBudWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluVGV4dFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT09IG1haW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFpbi5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5nZXRMb2NhdGlvbiwgdGhpcy50aW1lRGVsYXkgKiBNYXRoLnJhbmRvbSgpLCB0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmFkZHJlc3NJbmRleF0sIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBsYXRsbmc6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGF0bG5nXCIpO1xyXG5cclxuaWYgKG51bGwgIT09IGxhdGxuZykge1xyXG4gICAgUmVhY3RET00ucmVuZGVyKFxyXG4gICAgICAgIDxMYXRMbmcgLz4sXHJcbiAgICAgICAgbGF0bG5nLFxyXG4gICAgKTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlciEuL3NyYy9pbmRleC50c3giLCJpbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XHJcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmltcG9ydCB7IGFqYXggYXMgQ29uZmlnIH0gZnJvbSBcImNvbmZpZ3MvZGVidWdcIjtcclxuaW1wb3J0IExvZ2dpbmcgZnJvbSBcInV0aWxzL2xvZ2dpbmdcIjtcclxuaW1wb3J0IE1vY2sgZnJvbSBcInV0aWxzL21vY2tcIjtcclxuXHJcbi8qKlxyXG4gKiBVdGlsaXR5IGNsYXNzIGZvciBoYW5kbGluZyBhamF4IHJlcXVlc3RzLlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWpheCB7XHJcbiAgICAvKipcclxuICAgICAqIFN0YXRpYyBmdW5jdGlvbiBmb3Igc2VuZGluZyBQT1NUIHJlcXVlc3RzLlxyXG4gICAgICogQHBhcmFtIHBhdGggUGF0aCB0byBQT1NUIGRhdGEgdG8uXHJcbiAgICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHNlbmQuXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcG9zdChwYXRoOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIEFqYXgubG9nKFwiU2VuZGluZyBQT1NUOiAlcywgZGF0YTogJW9cIiwgcGF0aCwgZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChDb25maWcuZGV2KSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBNb2NrLnBvc3QocGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogSnNvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWpheC5sb2coXCJDb21wbGV0ZWQgREVWIFBPU1Q6ICVzLCByZXNwb25zZTogJW9cIiwgcGF0aCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dpbmcuZXJyb3IoXCJDb21wbGV0ZWQgREVWIFBPU1Q6ICVzLCAlb1wiLCBwYXRoLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sIENvbmZpZy50aW1lb3V0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIEF4aW9zLnBvc3QocGF0aCwgZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0OiBKc29uUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFqYXgubG9nKFwiQ29tcGxldGVkIFBPU1Q6ICVzLCByZXNwb25zZTogJW9cIiwgcGF0aCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2luZy5lcnJvcihcIkNvbXBsZXRlZCBQT1NUOiAlcywgJW9cIiwgcGF0aCwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdGF0aWMgZnVuY3Rpb24gZm9yIHNlbmRpbmcgR0VUIHJlcXVlc3RzLlxyXG4gICAgICogQHBhcmFtIHBhdGggUGF0aCB0byBzZW5kIEdFVCByZXF1ZXN0IHRvLlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9IFJldHVybnMgYSBQcm9taXNlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldChwYXRoOiBzdHJpbmcsIGRhdGE/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBBamF4LmxvZyhcIlNlbmRpbmcgR0VUOiAlc1wiLCBwYXRoKTtcclxuICAgICAgICAgICAgaWYgKENvbmZpZy5kZXYpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIE1vY2suZ2V0KHBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEpzb25SZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFqYXgubG9nKFwiQ29tcGxldGVkIERFViBHRVQ6ICVzLCByZXNwb25zZTogJW9cIiwgcGF0aCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dpbmcuZXJyb3IoXCJDb21wbGV0ZWQgREVWIEdFVDogJXMsICVvXCIsIHBhdGgsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgQ29uZmlnLnRpbWVvdXQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgQXhpb3MuZ2V0KHBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogSnNvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBamF4LmxvZyhcIkNvbXBsZXRlZCBHRVQ6ICVzLCByZXNwb25zZTogJW9cIiwgcGF0aCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2luZy5lcnJvcihcIkNvbXBsZXRlZCBHRVQ6ICVzLCAlb1wiLCBwYXRoLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEludGVybmFsIGZ1bmN0aW9uIGZvciBsb2dnaW5nLiBBbGxvd3MgZWFzeSBlbmFibGUvZGlzYWJsZSBvZiBhbGwgc3RhbmRhcmQgbG9nZ2luZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdG8gbG9nLlxyXG4gICAgICogQHBhcmFtIGFyZ3MgQXJndW1lbnRzIHRvIGluY2x1ZGUgaW4gdGhlIG1lc3NhZ2UuXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgbG9nKG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoQ29uZmlnLmxvZykge1xyXG4gICAgICAgICAgICBMb2dnaW5nLmxvZyhtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXIhLi9zcmMvdXRpbHMvYWpheC50c3giLCJpbXBvcnQgeyBtb2NrIGFzIENvbmZpZyB9IGZyb20gXCJjb25maWdzL2RlYnVnXCI7XHJcbmltcG9ydCB7IGFwaSBhcyBQYXRocyB9IGZyb20gXCJjb25maWdzL3BhdGhzXCI7XHJcbmltcG9ydCBMb2dnaW5nIGZyb20gXCJ1dGlscy9sb2dnaW5nXCI7XHJcblxyXG5jb25zdCBlcnJvck1vY2sgPSB7IG5hbWU6IFwiRXJyb3JcIiwgbWVzc2FnZTogXCJNb2NraW5nIGVycm9yIHRlc3RpbmcuXCIsIHN0YWNrOiBcIm1vY2sudHN4XCIgfTtcclxuXHJcbi8qKlxyXG4gKiBVdGlsaXR5IGNsYXNzIHRvIG1vY2sgb3V0IGFwaSByZXF1ZXN0cyB3aXRob3V0IGFjdHVhbGx5IHRhbGtpbmcgdG8gdGhlIHNlcnZlci5cclxuICpcclxuICogVXNlZCBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5LlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9jayB7XHJcbiAgICAvKipcclxuICAgICAqIE1vY2sgYSBQT1NUIHJlcXVlc3QuXHJcbiAgICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCB0byBtb2NrLlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9IFJldHVybnMgYSBQcm9taXNlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHBvc3QocGF0aDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IEpzb25SZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIGRhdGE6IG51bGwsXHJcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxyXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiBcIk9LXCIsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgTW9jay5sb2coXCJNb2NraW5nIFBPU1Q6ICVzLlwiLCBwYXRoKTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuZGF0YSA9IFwiUE9TVDogTW9ja2VkIHJlcXVlc3QuXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChDb25maWcuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIE1vY2subG9nKFwiTW9ja2luZyBQT1NUOiAlcywgcmVqZWN0aW5nIHdpdGggJW8uXCIsIHBhdGgsIGVycm9yTW9jayk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3JNb2NrKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIE1vY2subG9nKFwiTW9ja2luZyBQT1NUOiAlcywgcmVzb2x2aW5nIHdpdGggJW8uXCIsIHBhdGgsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vY2sgYSBHRVQgcmVxdWVzdC5cclxuICAgICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIG1vY2suXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmV0dXJucyBhIFByb21pc2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0KHBhdGg6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBKc29uUmVzdWx0ID0ge1xyXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxyXG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgc3RhdHVzVGV4dDogXCJPS1wiLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIE1vY2subG9nKFwiTW9ja2luZyBHRVQ6ICVzLlwiLCBwYXRoKTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgIE1vY2subG9nKFwiTW9ja2luZyBHRVQ6ICVzLCBub3QgZm91bmQuXCIsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmRhdGEgPSBcIkdFVDogTW9ja2VkIHJlcXVlc3QuXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKENvbmZpZy5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgTW9jay5sb2coXCJNb2NraW5nIEdFVDogJXMsIHJlamVjdGluZyB3aXRoICVvLlwiLCBwYXRoLCBlcnJvck1vY2spO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yTW9jayk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBNb2NrLmxvZyhcIk1vY2tpbmcgR0VUOiAlcywgcmVzb2x2aW5nIHdpdGggJW8uXCIsIHBhdGgsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGxvZyhtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKENvbmZpZy5sb2cpIHtcclxuICAgICAgICAgICAgTG9nZ2luZy5sb2cobWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyIS4vc3JjL3V0aWxzL21vY2sudHN4IiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuLyoqXHJcbiAqIFV0aWwgY2xhc3MgZm9yIHByZXZlbnRpbmcgY29uc29sZSBtZXNzYWdlcyBvbiBwcm9kdWN0aW9uIGVudmlyb25tZW50LlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2luZyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvZyh0ZXh0OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFBUFAuRU5WLkRFVikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmluZm8odGV4dCwgLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB3YXJuKHRleHQ6IHN0cmluZywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIUFQUC5FTlYuREVWKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUud2Fybih0ZXh0LCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGVycm9yKHRleHQ6IHN0cmluZywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcclxuICAgICAgICAvLyBlcnJvciBtZXNzYWdlcyBzaG91bGQgYWx3YXlzIGJlIGxvZ2dlZCwgcmVnYXJkbGVzcyBvZiBlbnZpcm9ubWVudC5cclxuICAgICAgICBjb25zb2xlLmVycm9yKHRleHQsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyIS4vc3JjL3V0aWxzL2xvZ2dpbmcudHN4Il0sInNvdXJjZVJvb3QiOiIifQ==