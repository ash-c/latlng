webpackJsonp([0],{

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(24);


/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _papaparse = __webpack_require__(17);

var _papaparse2 = _interopRequireDefault(_papaparse);

var _ajax = __webpack_require__(58);

var _ajax2 = _interopRequireDefault(_ajax);

var _logging = __webpack_require__(57);

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
                            break;
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

            _ajax2.default.get("api/geocode?address=" + address).then(function (result) {
                var status = result.data.status;
                var geocodeResults = result.data.results;
                _logging2.default.log("STATUS: %s", status);
                if (status === google.maps.GeocoderStatus.OK) {
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
        _this.latIndex = -1;
        _this.lngIndex = -1;
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

/***/ 56:
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

/***/ 57:
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

/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = __webpack_require__(37);

var _axios2 = _interopRequireDefault(_axios);

var _debug = __webpack_require__(56);

var _logging = __webpack_require__(57);

var _logging2 = _interopRequireDefault(_logging);

var _mock = __webpack_require__(59);

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

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = __webpack_require__(56);

var _logging = __webpack_require__(57);

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

/***/ })

},[23]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHN4Iiwid2VicGFjazovLy8uL3NyYy9jb25maWdzL2RlYnVnLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvbG9nZ2luZy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2FqYXgudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9tb2NrLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkM7Ozs7QUFDVjs7OztBQUVKOzs7O0FBRUM7Ozs7QUFROUI7Ozs7Ozs7Ozs7OztJQUFhOzs7QUFTVCxvQkFBcUI7QUFDWjs7b0hBQVE7O0FBdURQLGNBQVEsV0FBRyxVQUErQztBQUM3RCxnQkFBSyxTQUFVLE1BQU8sT0FBTSxTQUFRLFNBQVUsTUFBTyxPQUFNLE1BQUksSUFBRTtBQUM1RCxzQkFBVSxZQUFHLElBQVc7QUFDeEIsc0JBQVMsV0FBUSxNQUFPLE9BQU0sTUFBRyxHQUFNO0FBQ3ZDLG9DQUFNLE1BQU0sTUFBTyxPQUFNLE1BQUc7QUFDcEIsOEJBQU0sTUFFdEI7QUFIc0M7QUFJMUM7QUFBQztBQUVTLGNBQWUsa0JBQUcsVUFBOEI7QUFDbkQsZ0JBQUssU0FBWSxRQUFLLFFBQUssSUFBVSxRQUFLLEtBQVE7QUFDUDtBQURTOzs7OztBQUU5Qyx5Q0FBcUIsUUFBSyxLQUFJO0FBQUUsNEJBQXRCOztBQUNSLDRCQUFDLENBQUUsSUFBbUIsS0FBYyxjQUFRLFFBQVksWUFBRTtBQUNyRCxrQ0FBYSxlQUFVLFFBQUssS0FBRyxHQUFRLFFBQU87QUFFdEQ7QUFDSjtBQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUcsc0JBQVMsV0FBVyxRQUFLLEtBQVcsR0FBUTtBQUM1QyxzQkFBUyxXQUFPLE1BQVMsV0FBSztBQUMzQix3QkFBSyxLQUFHLEdBQUssTUFBVSxZQUFjO0FBQ3JDLHdCQUFLLEtBQUcsR0FBSyxNQUFVLFlBQWU7QUFFekMsc0JBQVEsVUFBVSxRQUFNO0FBRWxCLDJCQUFLLE1BQVksYUFBTSxNQUFVLFdBQU0sTUFBUSxRQUFHLEdBQUssTUFDckU7QUFDSjtBQUFDO0FBRU8sY0FBVyxjQUFHLFVBQWdCO2dCQUFFLG1GQUFrQzs7QUFDbEUsMkJBQUksSUFBdUIseUJBQVcsU0FDakMsS0FBQyxVQUF1QjtBQUN6QixvQkFBWSxTQUFxQyxPQUFLLEtBQVE7QUFDOUQsb0JBQW9CLGlCQUF1QyxPQUFLLEtBQVM7QUFDbEUsa0NBQUksSUFBYSxjQUFVO0FBQy9CLG9CQUFPLFdBQVcsT0FBSyxLQUFlLGVBQUksSUFBRTtBQUN2QywwQkFBUSxRQUFjLGNBQUssTUFBVSxZQUFpQixlQUFHLEdBQVMsU0FBUyxTQUFLO0FBQ2hGLDBCQUFRLFFBQWMsY0FBSyxNQUFVLFlBQWlCLGVBQUcsR0FBUyxTQUFTLFNBQUs7QUFDaEYsMEJBQVMsU0FBQyxFQUFXLFdBQzdCO0FBQU0sMkJBQVcsV0FBVyxPQUFLLEtBQWUsZUFBYyxjQUFFO0FBQ3hELDBCQUFRLFFBQWMsY0FBSyxNQUFVLFlBQUs7QUFDMUMsMEJBQVEsUUFBYyxjQUFLLE1BQVUsWUFBSztBQUMxQywwQkFBTSxNQUFTLFNBQUssS0FBSyxNQUFRLFFBQWMsY0FBSyxNQUFnQjtBQUNwRSwwQkFBUyxTQUFDLEVBQVcsV0FBYyxjQUFVLFVBQU0sTUFBTSxNQUNqRTtBQUFNLGlCQUxJLE1BS0EsSUFBTyxXQUFXLE9BQUssS0FBZSxlQUFpQixvQkFBVSxXQUFXLE9BQUssS0FBZSxlQUFlLGVBQUU7QUFDaEgsc0NBQUksSUFBVztBQUNaLCtCQUFLLE1BQVksYUFBTyxPQUFNLE1BQVEsUUFBYyxjQUFLLE1BQWMsZUFBZ0I7QUFFckc7QUFBQztBQUNXLGdDQUFNO0FBRWYsb0JBQWEsZ0JBQVEsTUFBUSxRQUFPLFNBQUssR0FBRTtBQUNuQyxzQ0FBSSxJQUFhO0FBQ2tEO0FBQzFFLHdCQUFVLGFBQXVCLFFBQUksSUFBQyxVQUFpQjtBQUM3QyxxQ0FBVSxJQUFDLFVBQXlCO0FBQ25DLGdDQUFDLE9BQVUsUUFBYyxVQUFFO0FBQ3BCLHVDQUFLLE9BQU0sTUFDckI7QUFBTSxtQ0FBRTtBQUNFLHVDQUNWO0FBQ0o7QUFBRSx5QkFOVSxFQU1MLEtBQ1g7QUFBRSxxQkFSdUIsRUFRbEIsS0FBUztBQUVoQix3QkFBVSxPQUFXLFNBQWMsY0FBTTtBQUNyQyx5QkFBSyxPQUFpQyxpQ0FBcUIsbUJBQU87QUFDbEUseUJBQVUsWUFBd0I7QUFDbEMseUJBQWEsYUFBVyxZQUFNLE1BQVc7QUFFN0Msd0JBQVUsT0FBK0IsU0FBZSxlQUFhO0FBRWxFLHdCQUFLLFNBQVUsTUFBRTtBQUNaLDZCQUFZLFlBQ3BCO0FBQ0o7QUFBTSx1QkFBRTtBQUNNLCtCQUFLLE1BQVksYUFBTSxNQUFVLFlBQU8sS0FBUyxVQUFNLE1BQVEsUUFBYyxjQUFLLE1BQWMsZUFDOUc7QUFDSjtBQUNSO0FBQUM7QUFySU8sY0FBTTtBQUNFLHNCQUFJO0FBQ0gsdUJBQ1g7QUFIVztBQUtULGNBQVUsWUFBTTtBQUNoQixjQUFhLGVBQUcsQ0FBRztBQUNuQixjQUFTLFdBQUcsQ0FBRztBQUNmLGNBQVMsV0FBRyxDQUNwQjs7QUFFYTs7Ozs7QUFFVCxnQkFBWSxXQUF5QjtBQUV5QjtBQUMzRCxnQkFBVSxjQUFTLEtBQVMsU0FBRTtBQUM3QixvQkFBUyxNQUFTLElBQVc7QUFDMUIsb0JBQVEsUUFBSSxJQUFVLFlBQUcsQ0FBSyxLQUFRLFFBQU8sU0FBSSxJQUFPLEtBQU0sTUFBVyxhQUFPLEtBQVk7QUFDL0Ysb0JBQWUsWUFBUyxJQUFRLEtBQUksSUFBVSxZQUFHLElBQVUsT0FBWTtBQUU1RDtBQUNELG9DQUNGOztBQUFJOzswQkFBVSxXQUNBOztBQUFLLDZCQUFNLE1BQVk7O0FBQUssNkJBQVEsUUFBTyxTQUV6RDs7QUFBSTs7MEJBQVUsV0FDQzs7QUFBVSxrQ0FBZTs7QUFBVSxrQ0FJOUQ7OztBQUFDO0FBRUQsZ0JBQWMsZ0JBQTRCLE1BQVMsU0FBSSxJQUFDLFVBQWMsT0FBbUI7QUFDOUU7QUFBSztzQkFBSyxLQUFRO0FBQzdCOztBQUFHLGFBRmlDO0FBSTdCO0FBQ0csZ0NBQ0Y7O0FBQUk7O3NCQUFHLElBQVcsWUFBVSxXQUc1Qjs7O0FBQUk7O3NCQUFVLFdBQ1Y7QUFBTSw2REFBSyxNQUFPLFFBQU8sUUFBUSxTQUFVLFVBQUssS0FFcEQ7O0FBQ0E7QUFBSTs7c0JBQVUsV0FDVjtBQUloQjs7O0FBbUZIOzs7O0VBbEp5QixnQkFBMkI7O0FBb0pyRCxJQUFZLFNBQStCLFNBQWUsZUFBVztBQUVsRSxJQUFLLFNBQVksUUFBRTtBQUNWLHVCQUFPLE9BQ1gsOEJBQVUsZUFHbEI7QUFBQyxDOzs7Ozs7Ozs7Ozs7O0FDcEtLOzs7QUFBQyxJQUFXO0FBQ2E7QUFDeEIsU0FBTSxJQUFKLElBQ1A7QUFIbUI7QUFRZjs7O0FBQUMsSUFBWTtBQUNZO0FBQ3hCLFNBQU0sSUFBSixJQUNQO0FBSG9CO0FBUWhCOzs7QUFBQyxJQUFVO0FBQ2M7QUFDeEIsU0FBTSxJQUFKLElBQXFCO0FBQ3lEO0FBQ2hGLFNBQU0sSUFBSixJQUFzQjtBQUNpQjtBQUNyQyxhQUNUO0FBUGtCO0FBWWQ7OztBQUFDLElBQVU7QUFDYztBQUN4QixTQUFNLElBQUosSUFBcUI7QUFDWDtBQUNWLFdBQ1A7QUFMa0I7QUFVZDs7O0FBQUMsSUFBVTtBQUNjO0FBQ3hCLFNBQU0sSUFBSixJQUFxQjtBQUN3RTtBQUNsRjtBQUNMLGlCQUNiO0FBTmtCLEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JDTjs7O0lBQ087Ozs7Ozs7NEJBQWU7OztBQUN6QixnQkFBQyxLQUFhLEVBQUU7QUFFbkI7QUFBQzs7O0FBSHlDOzs7QUFLbkMsaUNBQUssc0JBQU8sYUFDdkI7QUFFa0I7Ozs2QkFBZTs7O0FBQzFCLGdCQUFDLEtBQWEsRUFBRTtBQUVuQjtBQUFDOzs7QUFIMEM7OztBQUtwQyxrQ0FBSyx1QkFBTyxhQUN2QjtBQUVtQjs7OzhCQUFlOzs7O0FBQWM7OztBQUN5QjtBQUM5RCxrQ0FBTSx3QkFBTyxhQUN4QjtBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUJ5Qjs7OztBQUdxQjs7QUFDWDs7OztBQUNOOzs7Ozs7OztBQUtoQjs7Ozs7Ozs7Ozs7QUFPUTs7Ozs7OzZCQUFhLE1BQVc7QUFDaEMsdUJBQVksUUFBQyxVQUFhLFNBQWlCO0FBQ3pDLHFCQUFJLElBQTZCLDhCQUFNLE1BQVE7QUFDaEQsb0JBQU8sWUFBSyxLQUFFO0FBQ0gsK0JBQU07QUFDUix1Q0FBSyxLQUFNLE1BQ04sS0FBQyxVQUF1QjtBQUNyQixpQ0FBSSxJQUF1Qyx3Q0FBTSxNQUFVO0FBQ3hELG9DQUNYO0FBQUUsMkJBQ0ksTUFBQyxVQUFpQjtBQUNiLDhDQUFNLE1BQTZCLDhCQUFNLE1BQVM7QUFDbkQsbUNBQ1Y7QUFDUjtBQUFDLHVCQUFRLFlBQ2I7QUFBTSx1QkFBRTtBQUNDLG9DQUFLLEtBQUssTUFBTyxNQUNiLEtBQUMsVUFBdUI7QUFDckIsNkJBQUksSUFBbUMsb0NBQU0sTUFBVTtBQUNwRCxnQ0FDWDtBQUFFLHVCQUFNLE1BQUMsVUFBaUI7QUFDZiwwQ0FBTSxNQUF5QiwwQkFBTSxNQUFTO0FBQy9DLCtCQUNWO0FBQ1I7QUFDSjtBQUNKLGFBekJXO0FBeUJWO0FBT2dCOzs7Ozs7Ozs0QkFBYSxNQUFZO0FBQ2hDLHVCQUFZLFFBQUMsVUFBYSxTQUFpQjtBQUN6QyxxQkFBSSxJQUFrQixtQkFBUTtBQUMvQixvQkFBTyxZQUFLLEtBQUU7QUFDSCwrQkFBTTtBQUNSLHVDQUFJLElBQU0sTUFDTCxLQUFDLFVBQXVCO0FBQ3JCLGlDQUFJLElBQXNDLHVDQUFNLE1BQVU7QUFDdkQsb0NBQ1g7QUFBRSwyQkFDSSxNQUFDLFVBQWlCO0FBQ2IsOENBQU0sTUFBNEIsNkJBQU0sTUFBUztBQUNsRCxtQ0FDVjtBQUNSO0FBQUMsdUJBQVEsWUFDYjtBQUFNLHVCQUFFO0FBQ0Msb0NBQUksSUFBTSxNQUNOLEtBQUMsVUFBdUI7QUFDckIsNkJBQUksSUFBa0MsbUNBQU0sTUFBVTtBQUNuRCxnQ0FDWDtBQUFFLHVCQUNJLE1BQUMsVUFBaUI7QUFDYiwwQ0FBTSxNQUF3Qix5QkFBTSxNQUFTO0FBQzlDLCtCQUNWO0FBQ1I7QUFDSjtBQUNKLGFBMUJXO0FBMEJWO0FBT21COzs7Ozs7Ozs0QkFBa0I7QUFDL0IsZ0JBQU8sWUFBSztBQUFFO0FBRCtCOzs7QUFFckMsa0NBQUksOEJBQVUsZ0JBQ3pCO0FBQ0o7QUFDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pGOEM7O0FBRVg7Ozs7Ozs7O0FBRXBDLElBQWUsWUFBRyxFQUFNLE1BQVMsU0FBUyxTQUEwQiwwQkFBTyxPQUFlO0FBTzVFOzs7Ozs7Ozs7Ozs7OztBQU1ROzs7Ozs2QkFBYTtBQUMzQixnQkFBWTtBQUNKLHNCQUFNO0FBQ0osd0JBQUs7QUFDRCw0QkFDWjtBQUp5QjtBQU12QixpQkFBSSxJQUFvQixxQkFBUTtBQUU3QixvQkFBUTtBQUNYO0FBQ1UsMkJBQUssT0FBMkI7QUFFN0M7O0FBRUssdUJBQVksUUFBQyxVQUFRLFNBQVk7QUFDaEMsb0JBQU8sWUFBTyxPQUFFO0FBQ1gseUJBQUksSUFBdUMsd0NBQU0sTUFBYTtBQUM1RCwyQkFDVjtBQUFNLHVCQUFFO0FBQ0EseUJBQUksSUFBdUMsd0NBQU0sTUFBVTtBQUN4RCw0QkFDWDtBQUNKO0FBQ0osYUFUVztBQVNWO0FBT2dCOzs7Ozs7Ozs0QkFBYTtBQUMxQixnQkFBWTtBQUNKLHNCQUFNO0FBQ0osd0JBQUs7QUFDRCw0QkFDWjtBQUp5QjtBQU12QixpQkFBSSxJQUFtQixvQkFBUTtBQUU1QixvQkFBUTtBQUNYO0FBQVU7QUFDRiw2QkFBSSxJQUE4QiwrQkFBUTtBQUN4QywrQkFBSyxPQUEwQjtBQUV6QztBQUNIOztBQUVLLHVCQUFZLFFBQUMsVUFBUSxTQUFZO0FBQ2hDLG9CQUFPLFlBQU8sT0FBRTtBQUNYLHlCQUFJLElBQXNDLHVDQUFNLE1BQWE7QUFDM0QsMkJBQ1Y7QUFBTSx1QkFBRTtBQUNBLHlCQUFJLElBQXNDLHVDQUFNLE1BQVU7QUFDdkQsNEJBQ1g7QUFDSjtBQUNKLGFBVFc7QUFXUzs7OzRCQUFrQjtBQUMvQixnQkFBTyxZQUFLO0FBQUU7QUFEK0I7OztBQUVyQyxrQ0FBSSw4QkFBVSxnQkFDekI7QUFDSjtBQUNIIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDaGFuZ2VFdmVudCB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xyXG5cclxuaW1wb3J0IFBhcGEgZnJvbSBcInBhcGFwYXJzZVwiO1xyXG5cclxuaW1wb3J0IEFqYXggZnJvbSBcInV0aWxzL2FqYXhcIjtcclxuaW1wb3J0IExvZ2dpbmcgZnJvbSBcInV0aWxzL2xvZ2dpbmdcIjtcclxuXHJcbmludGVyZmFjZSBMYXRMbmdTdGF0ZSB7XHJcbiAgICBub3RGb3VuZDogc3RyaW5nW107XHJcbiAgICBjb21wbGV0ZWQ6IG51bWJlcjtcclxufVxyXG5cclxuY2xhc3MgTGF0TG5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHt9LCBMYXRMbmdTdGF0ZT4ge1xyXG4gICAgcHJpdmF0ZSBjc3ZEYXRhOiBhbnlbXTtcclxuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBEYXRlO1xyXG4gICAgcHJpdmF0ZSBmaWxlTmFtZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSB0aW1lRGVsYXk6IG51bWJlcjtcclxuICAgIHByaXZhdGUgYWRkcmVzc0luZGV4OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGxhdEluZGV4OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGxuZ0luZGV4OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IHt9KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBub3RGb3VuZDogW10sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZDogMCxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnRpbWVEZWxheSA9IDUwO1xyXG4gICAgICAgIHRoaXMuYWRkcmVzc0luZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5sYXRJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMubG5nSW5kZXggPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCk6IFJlYWN0LlJlYWN0RnJhZ21lbnQge1xyXG5cclxuICAgICAgICBsZXQgcHJvZ3Jlc3M6IEpTWC5FbGVtZW50ID0gPHNwYW4gLz47XHJcblxyXG4gICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSB0aGUgbGVuZ3RoLCB0byBhY2NvdW50IGZvciB0aGUgaGVhZGVyIGxpbmUuXHJcbiAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gdGhpcy5jc3ZEYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV0YTogRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGV0YS5zZXRUaW1lKGV0YS5nZXRUaW1lKCkgKyAodGhpcy5jc3ZEYXRhLmxlbmd0aCAtIDEgLSB0aGlzLnN0YXRlLmNvbXBsZXRlZCkgKiB0aGlzLnRpbWVEZWxheSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50RG93bjogRGF0ZSA9IG5ldyBEYXRlKGV0YS5nZXRUaW1lKCkgLSBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XHJcblxyXG4gICAgICAgICAgICBwcm9ncmVzcyA9IChcclxuICAgICAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IG14LWF1dG8gbWItMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9ncmVzczoge3RoaXMuc3RhdGUuY29tcGxldGVkfS97dGhpcy5jc3ZEYXRhLmxlbmd0aCAtIDF9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOCBteC1hdXRvIG1iLTVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQ291bnRkb3duOiB7Y291bnREb3duLmdldE1pbnV0ZXMoKX06e2NvdW50RG93bi5nZXRTZWNvbmRzKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgbm90Rm91bmQ6IEpTWC5FbGVtZW50W10gPSB0aGlzLnN0YXRlLm5vdEZvdW5kLm1hcCgodmFsdWU6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKDxkaXYga2V5PXtpbmRleH0+e3ZhbHVlfTwvZGl2Pik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJtYWluVGV4dFwiIGNsYXNzTmFtZT1cImNvbC1zbS04IG14LWF1dG8gbWItNVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIFVwbG9hZCBhIENTViBmaWxlIHdpdGggYSBmaWVsZCBjYWxsZWQgXCJBZGRyZXNzXCIsIHRvIHJldHJlaXZlIHRoZSBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlIG9mIGFsbCB0aGUgYWRkcmVzc2VzLiBBZGRyZXNzZXMgdGhhdCBjYW4ndCBiZSBmb3VuZCB3aWxsIGJlIGxpc3RlZCBiZWxvdy5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOCBteC1hdXRvIG1iLTNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCIqLmNzdlwiIG9uQ2hhbmdlPXt0aGlzLm9uVXBsb2FkfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7cHJvZ3Jlc3N9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IG14LWF1dG9cIj5cclxuICAgICAgICAgICAgICAgICAgICB7bm90Rm91bmR9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvblVwbG9hZCA9IChldmVudDogQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAobnVsbCAhPT0gZXZlbnQudGFyZ2V0LmZpbGVzICYmIG51bGwgIT09IGV2ZW50LnRhcmdldC5maWxlc1swXSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsZU5hbWUgPSBldmVudC50YXJnZXQuZmlsZXNbMF0ubmFtZTtcclxuICAgICAgICAgICAgUGFwYS5wYXJzZShldmVudC50YXJnZXQuZmlsZXNbMF0sIHtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiB0aGlzLm9uUGFyc2VDb21wbGV0ZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvblBhcnNlQ29tcGxldGUgPSAocmVzdWx0czogUGFwYS5QYXJzZVJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChudWxsICE9PSByZXN1bHRzLmRhdGEgJiYgMCA8IHJlc3VsdHMuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gSWRlbnRpZnkgd2hpY2ggaW5kZXggaG9sZHMgdGhlIGFkZHJlc3MuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZGF0YSBvZiByZXN1bHRzLmRhdGFbMF0pIHtcclxuICAgICAgICAgICAgICAgIGlmICgtMSA8IChkYXRhIGFzIHN0cmluZykudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiYWRkcmVzc1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkcmVzc0luZGV4ID0gcmVzdWx0cy5kYXRhWzBdLmluZGV4T2YoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubGF0SW5kZXggPSAocmVzdWx0cy5kYXRhWzBdIGFzIGFueSkubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLmxuZ0luZGV4ID0gdGhpcy5sYXRJbmRleCArIDE7XHJcbiAgICAgICAgICAgIHJlc3VsdHMuZGF0YVswXVt0aGlzLmxhdEluZGV4XSA9IFwiTGF0aXR1ZGVcIjtcclxuICAgICAgICAgICAgcmVzdWx0cy5kYXRhWzBdW3RoaXMubG5nSW5kZXhdID0gXCJMb25naXR1ZGVcIjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3N2RGF0YSA9IHJlc3VsdHMuZGF0YTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5nZXRMb2NhdGlvbiwgdGhpcy50aW1lRGVsYXksIHRoaXMuY3N2RGF0YVsxXVt0aGlzLmFkZHJlc3NJbmRleF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldExvY2F0aW9uID0gKGFkZHJlc3M6IHN0cmluZywgY3VycmVudEluZGV4OiBudW1iZXIgPSAxKTogdm9pZCA9PiB7XHJcbiAgICAgICAgQWpheC5nZXQoXCJhcGkvZ2VvY29kZT9hZGRyZXNzPVwiICsgYWRkcmVzcylcclxuICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogSnNvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzOiBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cyA9IHJlc3VsdC5kYXRhLnN0YXR1cztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdlb2NvZGVSZXN1bHRzOiBnb29nbGUubWFwcy5HZW9jb2RlclJlc3VsdFtdID0gcmVzdWx0LmRhdGEucmVzdWx0cztcclxuICAgICAgICAgICAgICAgIExvZ2dpbmcubG9nKFwiU1RBVFVTOiAlc1wiLCBzdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT0spIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmxuZ0luZGV4XSA9IGdlb2NvZGVSZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxuZztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmxhdEluZGV4XSA9IGdlb2NvZGVSZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY29tcGxldGVkOiBjdXJyZW50SW5kZXggfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuWkVST19SRVNVTFRTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5sYXRJbmRleF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMubG5nSW5kZXhdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLm5vdEZvdW5kLnB1c2godGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5hZGRyZXNzSW5kZXhdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY29tcGxldGVkOiBjdXJyZW50SW5kZXgsIG5vdEZvdW5kOiB0aGlzLnN0YXRlLm5vdEZvdW5kIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9WRVJfUVVFUllfTElNSVQgfHwgc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5VTktOT1dOX0VSUk9SKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2luZy5sb2coXCJQQVVTRURcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLmdldExvY2F0aW9uLCA1MDAwMCwgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5hZGRyZXNzSW5kZXhdLCBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCArPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5kZXggPj0gdGhpcy5jc3ZEYXRhLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBMb2dnaW5nLmxvZyhcIkZJTklTSEVEXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFN1cnJvdW5kIHN0cmluZ3MgaW4gcXVvdGVzLCBhbmQgYWRkIGxpbmUgYnJlYWtzIHRvIHRoZSBlbmQgb2YgZWFjaCByb3cuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YTogc3RyaW5nID0gdGhpcy5jc3ZEYXRhLm1hcCgodmFsdWU6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5tYXAoKHZhbDogc3RyaW5nIHwgbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlxcXCJcIiArIHZhbCArIFwiXFxcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KS5qb2luKFwiXFxyXFxuXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluay5ocmVmID0gXCJkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXCIgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluay5pbm5lclRleHQgPSBcIkNsaWNrIHRvIGRvd25sb2FkLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKFwiZG93bmxvYWRcIiwgdGhpcy5maWxlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1haW46IEhUTUxFbGVtZW50IHwgbnVsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblRleHRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9PSBtYWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW4uYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuZ2V0TG9jYXRpb24sIHRoaXMudGltZURlbGF5ICogTWF0aC5yYW5kb20oKSwgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5hZGRyZXNzSW5kZXhdLCBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbGF0bG5nOiBIVE1MRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdGxuZ1wiKTtcclxuXHJcbmlmIChudWxsICE9PSBsYXRsbmcpIHtcclxuICAgIFJlYWN0RE9NLnJlbmRlcihcclxuICAgICAgICA8TGF0TG5nIC8+LFxyXG4gICAgICAgIGxhdGxuZyxcclxuICAgICk7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXIhLi9zcmMvaW5kZXgudHN4IiwiXHJcbi8qKlxyXG4gKiBDb25maWcgc2V0dGluZ3MgZm9yIGdlbmVyaWMgdXRpbGl0eSBmdW5jdGlvbnMuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgdXRpbHMgPSB7XHJcbiAgICAvLyBTaG91bGQgbG9nIGFsbCBtZXNzYWdlcy5cclxuICAgIGxvZzogKEFQUC5FTlYuREVWKSAmJiB0cnVlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbmZpZyBzZXR0aW5ncyBmb3IgdGhlIHByZS1sb2FkZXIuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbG9hZGVyID0ge1xyXG4gICAgLy8gU2hvdWxkIGxvZyBhbGwgbWVzc2FnZXMuXHJcbiAgICBsb2c6IChBUFAuRU5WLkRFVikgJiYgdHJ1ZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb25maWcgc2V0dGluZ3MgZm9yIHV0aWxzL2FqYXguXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYWpheCA9IHtcclxuICAgIC8vIFNob3VsZCBsb2cgYWxsIG1lc3NhZ2VzLlxyXG4gICAgbG9nOiAoQVBQLkVOVi5ERVYpICYmIHRydWUsXHJcbiAgICAvLyBTaG91bGQgYmUgaW4gZGV2IG1vZGUsIGFuZCBtb2NrIHJlcXVlc3RzIHJhdGhlciB0aGFuIHNlbmRpbmcgdGhlbSB0byB0aGUgc2VydmVyLlxyXG4gICAgZGV2OiAoQVBQLkVOVi5ERVYpICYmIGZhbHNlLFxyXG4gICAgLy8gVGltZW91dCBwZXJpb2QgZm9yIHJlcXVlc3RzIGZvciBkZXYgbW9kZS5cclxuICAgIHRpbWVvdXQ6IDI1MDAsXHJcbn07XHJcblxyXG4vKipcclxuICogQ29uZmlnIHNldHRpbmdzIGZvciB1dGlscy9tb2NrLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG1vY2sgPSB7XHJcbiAgICAvLyBTaG91bGQgbG9nIGFsbCBtZXNzYWdlcy5cclxuICAgIGxvZzogKEFQUC5FTlYuREVWKSAmJiB0cnVlLFxyXG4gICAgLy8gU2hvdWxkIGZhaWwuXHJcbiAgICBlcnJvcjogZmFsc2UsXHJcbn07XHJcblxyXG4vKipcclxuICogQ29uZmlnIHNldHRpbmdzIGZvciBmb3Jtcy5cclxuICovXHJcbmV4cG9ydCBjb25zdCBmb3JtID0ge1xyXG4gICAgLy8gU2hvdWxkIGxvZyBhbGwgbWVzc2FnZXMuXHJcbiAgICBsb2c6IChBUFAuRU5WLkRFVikgJiYgdHJ1ZSxcclxuICAgIC8vIFNob3VsZCBzdG9wIG9uIGZpZWxkIHZhbGlkYXRpb24gZXJyb3IuIFNldCB0byBmYWxzZSB0byBzdWJtaXQgZm9ybSBldmVuIHdpdGggdmFsaWRhdGlvbiBlcnJvcnMuXHJcbiAgICAvLyBURVNUSU5HIE9OTFkuXHJcbiAgICBzdG9wT25FcnJvcjogdHJ1ZSxcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXIhLi9zcmMvY29uZmlncy9kZWJ1Zy50c3giLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcblxyXG4vKipcclxuICogVXRpbCBjbGFzcyBmb3IgcHJldmVudGluZyBjb25zb2xlIG1lc3NhZ2VzIG9uIHByb2R1Y3Rpb24gZW52aXJvbm1lbnQuXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dnaW5nIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9nKHRleHQ6IHN0cmluZywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIUFQUC5FTlYuREVWKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUuaW5mbyh0ZXh0LCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHdhcm4odGV4dDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgICAgIGlmICghQVBQLkVOVi5ERVYpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS53YXJuKHRleHQsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IodGV4dDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgICAgIC8vIGVycm9yIG1lc3NhZ2VzIHNob3VsZCBhbHdheXMgYmUgbG9nZ2VkLCByZWdhcmRsZXNzIG9mIGVudmlyb25tZW50LlxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGV4dCwgLi4uYXJncyk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXIhLi9zcmMvdXRpbHMvbG9nZ2luZy50c3giLCJpbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XHJcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmltcG9ydCB7IGFqYXggYXMgQ29uZmlnIH0gZnJvbSBcImNvbmZpZ3MvZGVidWdcIjtcclxuaW1wb3J0IExvZ2dpbmcgZnJvbSBcInV0aWxzL2xvZ2dpbmdcIjtcclxuaW1wb3J0IE1vY2sgZnJvbSBcInV0aWxzL21vY2tcIjtcclxuXHJcbi8qKlxyXG4gKiBVdGlsaXR5IGNsYXNzIGZvciBoYW5kbGluZyBhamF4IHJlcXVlc3RzLlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWpheCB7XHJcbiAgICAvKipcclxuICAgICAqIFN0YXRpYyBmdW5jdGlvbiBmb3Igc2VuZGluZyBQT1NUIHJlcXVlc3RzLlxyXG4gICAgICogQHBhcmFtIHBhdGggUGF0aCB0byBQT1NUIGRhdGEgdG8uXHJcbiAgICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHNlbmQuXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcG9zdChwYXRoOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIEFqYXgubG9nKFwiU2VuZGluZyBQT1NUOiAlcywgZGF0YTogJW9cIiwgcGF0aCwgZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChDb25maWcuZGV2KSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBNb2NrLnBvc3QocGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogSnNvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWpheC5sb2coXCJDb21wbGV0ZWQgREVWIFBPU1Q6ICVzLCByZXNwb25zZTogJW9cIiwgcGF0aCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dpbmcuZXJyb3IoXCJDb21wbGV0ZWQgREVWIFBPU1Q6ICVzLCAlb1wiLCBwYXRoLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sIENvbmZpZy50aW1lb3V0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIEF4aW9zLnBvc3QocGF0aCwgZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0OiBKc29uUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFqYXgubG9nKFwiQ29tcGxldGVkIFBPU1Q6ICVzLCByZXNwb25zZTogJW9cIiwgcGF0aCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2luZy5lcnJvcihcIkNvbXBsZXRlZCBQT1NUOiAlcywgJW9cIiwgcGF0aCwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdGF0aWMgZnVuY3Rpb24gZm9yIHNlbmRpbmcgR0VUIHJlcXVlc3RzLlxyXG4gICAgICogQHBhcmFtIHBhdGggUGF0aCB0byBzZW5kIEdFVCByZXF1ZXN0IHRvLlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9IFJldHVybnMgYSBQcm9taXNlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldChwYXRoOiBzdHJpbmcsIGRhdGE/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBBamF4LmxvZyhcIlNlbmRpbmcgR0VUOiAlc1wiLCBwYXRoKTtcclxuICAgICAgICAgICAgaWYgKENvbmZpZy5kZXYpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIE1vY2suZ2V0KHBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEpzb25SZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFqYXgubG9nKFwiQ29tcGxldGVkIERFViBHRVQ6ICVzLCByZXNwb25zZTogJW9cIiwgcGF0aCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dpbmcuZXJyb3IoXCJDb21wbGV0ZWQgREVWIEdFVDogJXMsICVvXCIsIHBhdGgsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgQ29uZmlnLnRpbWVvdXQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgQXhpb3MuZ2V0KHBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogSnNvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBamF4LmxvZyhcIkNvbXBsZXRlZCBHRVQ6ICVzLCByZXNwb25zZTogJW9cIiwgcGF0aCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2luZy5lcnJvcihcIkNvbXBsZXRlZCBHRVQ6ICVzLCAlb1wiLCBwYXRoLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEludGVybmFsIGZ1bmN0aW9uIGZvciBsb2dnaW5nLiBBbGxvd3MgZWFzeSBlbmFibGUvZGlzYWJsZSBvZiBhbGwgc3RhbmRhcmQgbG9nZ2luZy5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdG8gbG9nLlxyXG4gICAgICogQHBhcmFtIGFyZ3MgQXJndW1lbnRzIHRvIGluY2x1ZGUgaW4gdGhlIG1lc3NhZ2UuXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgbG9nKG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoQ29uZmlnLmxvZykge1xyXG4gICAgICAgICAgICBMb2dnaW5nLmxvZyhtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXIhLi9zcmMvdXRpbHMvYWpheC50c3giLCJpbXBvcnQgeyBtb2NrIGFzIENvbmZpZyB9IGZyb20gXCJjb25maWdzL2RlYnVnXCI7XHJcbmltcG9ydCB7IGFwaSBhcyBQYXRocyB9IGZyb20gXCJjb25maWdzL3BhdGhzXCI7XHJcbmltcG9ydCBMb2dnaW5nIGZyb20gXCJ1dGlscy9sb2dnaW5nXCI7XHJcblxyXG5jb25zdCBlcnJvck1vY2sgPSB7IG5hbWU6IFwiRXJyb3JcIiwgbWVzc2FnZTogXCJNb2NraW5nIGVycm9yIHRlc3RpbmcuXCIsIHN0YWNrOiBcIm1vY2sudHN4XCIgfTtcclxuXHJcbi8qKlxyXG4gKiBVdGlsaXR5IGNsYXNzIHRvIG1vY2sgb3V0IGFwaSByZXF1ZXN0cyB3aXRob3V0IGFjdHVhbGx5IHRhbGtpbmcgdG8gdGhlIHNlcnZlci5cclxuICpcclxuICogVXNlZCBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5LlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9jayB7XHJcbiAgICAvKipcclxuICAgICAqIE1vY2sgYSBQT1NUIHJlcXVlc3QuXHJcbiAgICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCB0byBtb2NrLlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9IFJldHVybnMgYSBQcm9taXNlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHBvc3QocGF0aDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IEpzb25SZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIGRhdGE6IG51bGwsXHJcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxyXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiBcIk9LXCIsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgTW9jay5sb2coXCJNb2NraW5nIFBPU1Q6ICVzLlwiLCBwYXRoKTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuZGF0YSA9IFwiUE9TVDogTW9ja2VkIHJlcXVlc3QuXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChDb25maWcuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIE1vY2subG9nKFwiTW9ja2luZyBQT1NUOiAlcywgcmVqZWN0aW5nIHdpdGggJW8uXCIsIHBhdGgsIGVycm9yTW9jayk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3JNb2NrKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIE1vY2subG9nKFwiTW9ja2luZyBQT1NUOiAlcywgcmVzb2x2aW5nIHdpdGggJW8uXCIsIHBhdGgsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vY2sgYSBHRVQgcmVxdWVzdC5cclxuICAgICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIG1vY2suXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmV0dXJucyBhIFByb21pc2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0KHBhdGg6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBKc29uUmVzdWx0ID0ge1xyXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxyXG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgc3RhdHVzVGV4dDogXCJPS1wiLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIE1vY2subG9nKFwiTW9ja2luZyBHRVQ6ICVzLlwiLCBwYXRoKTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgIE1vY2subG9nKFwiTW9ja2luZyBHRVQ6ICVzLCBub3QgZm91bmQuXCIsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmRhdGEgPSBcIkdFVDogTW9ja2VkIHJlcXVlc3QuXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKENvbmZpZy5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgTW9jay5sb2coXCJNb2NraW5nIEdFVDogJXMsIHJlamVjdGluZyB3aXRoICVvLlwiLCBwYXRoLCBlcnJvck1vY2spO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yTW9jayk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBNb2NrLmxvZyhcIk1vY2tpbmcgR0VUOiAlcywgcmVzb2x2aW5nIHdpdGggJW8uXCIsIHBhdGgsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGxvZyhtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKENvbmZpZy5sb2cpIHtcclxuICAgICAgICAgICAgTG9nZ2luZy5sb2cobWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyIS4vc3JjL3V0aWxzL21vY2sudHN4Il0sInNvdXJjZVJvb3QiOiIifQ==