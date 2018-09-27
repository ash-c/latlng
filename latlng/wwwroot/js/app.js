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
                setTimeout(_this.getLocation, _this.timeDelay);
            }
        };
        _this.getLocation = function () {
            var currentIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            _this.csvData[currentIndex][_this.addressIndex] += ", " + _this.csvData[currentIndex][_this.cityIndex] + ", " + _this.csvData[currentIndex][_this.stateIndex] + " " + _this.csvData[currentIndex][_this.zipIndex];
            var address = _this.csvData[currentIndex][_this.addressIndex];
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
                    setTimeout(_this.getLocation, _this.timeDelay, currentIndex);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29uZmlncy9kZWJ1Zy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvYWpheC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL21vY2sudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9sb2dnaW5nLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUlNOzs7QUFBQyxJQUFXO0FBQ2E7QUFDeEIsU0FBTSxJQUFKLElBQ1A7QUFIbUI7QUFRZjs7O0FBQUMsSUFBWTtBQUNZO0FBQ3hCLFNBQU0sSUFBSixJQUNQO0FBSG9CO0FBUWhCOzs7QUFBQyxJQUFVO0FBQ2M7QUFDeEIsU0FBTSxJQUFKLElBQXFCO0FBQ3lEO0FBQ2hGLFNBQU0sSUFBSixJQUFzQjtBQUNpQjtBQUNyQyxhQUNUO0FBUGtCO0FBWWQ7OztBQUFDLElBQVU7QUFDYztBQUN4QixTQUFNLElBQUosSUFBcUI7QUFDWDtBQUNWLFdBQ1A7QUFMa0I7QUFVZDs7O0FBQUMsSUFBVTtBQUNjO0FBQ3hCLFNBQU0sSUFBSixJQUFxQjtBQUN3RTtBQUNsRjtBQUNMLGlCQUNiO0FBTmtCLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUN1Qjs7OztBQUNWOzs7O0FBRUo7Ozs7QUFFQzs7OztBQVE5Qjs7Ozs7Ozs7Ozs7O0lBQWE7OztBQVlULG9CQUFxQjtBQUNaOztvSEFBUTs7QUE2RFAsY0FBUSxXQUFHLFVBQStDO0FBQzdELGdCQUFLLFNBQVUsTUFBTyxPQUFNLFNBQVEsU0FBVSxNQUFPLE9BQU0sTUFBSSxJQUFFO0FBQzVELHNCQUFVLFlBQUcsSUFBVztBQUN4QixzQkFBUyxXQUFRLE1BQU8sT0FBTSxNQUFHLEdBQU07QUFDdkMsb0NBQU0sTUFBTSxNQUFPLE9BQU0sTUFBRztBQUNwQiw4QkFBTSxNQUV0QjtBQUhzQztBQUkxQztBQUFDO0FBRVMsY0FBZSxrQkFBRyxVQUE4QjtBQUNuRCxn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T0FBMEI7QUFFekM7QUFDSDs7QUFFSyx1QkFBWSxRQUFDLFVBQVEsU0FBWTtBQUNoQyxvQkFBTyxZQUFPLE9BQUU7QUFDWCx5QkFBSSxJQUFzQyx1Q0FBTSxNQUFhO0FBQzNELDJCQUNWO0FBQU0sdUJBQUU7QUFDQSx5QkFBSSxJQUFzQyx1Q0FBTSxNQUFVO0FBQ3ZELDRCQUNYO0FBQ0o7QUFDSixhQVRXO0FBV1M7Ozs0QkFBa0I7QUFDL0IsZ0JBQU8sWUFBSztBQUFFO0FBRCtCOzs7QUFFckMsa0NBQUksOEJBQVUsZ0JBQ3pCO0FBQ0o7QUFDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUVhOzs7SUFDTzs7Ozs7Ozs0QkFBZTs7O0FBQ3pCLGdCQUFDLEtBQWEsRUFBRTtBQUVuQjtBQUFDOzs7QUFIeUM7OztBQUtuQyxpQ0FBSyxzQkFBTyxhQUN2QjtBQUVrQjs7OzZCQUFlOzs7QUFDMUIsZ0JBQUMsS0FBYSxFQUFFO0FBRW5CO0FBQUM7OztBQUgwQzs7O0FBS3BDLGtDQUFLLHVCQUFPLGFBQ3ZCO0FBRW1COzs7OEJBQWU7Ozs7QUFBYzs7O0FBQ3lCO0FBQzlELGtDQUFNLHdCQUFPLGFBQ3hCO0FBQ0giLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qKlxyXG4gKiBDb25maWcgc2V0dGluZ3MgZm9yIGdlbmVyaWMgdXRpbGl0eSBmdW5jdGlvbnMuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgdXRpbHMgPSB7XHJcbiAgICAvLyBTaG91bGQgbG9nIGFsbCBtZXNzYWdlcy5cclxuICAgIGxvZzogKEFQUC5FTlYuREVWKSAmJiB0cnVlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbmZpZyBzZXR0aW5ncyBmb3IgdGhlIHByZS1sb2FkZXIuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbG9hZGVyID0ge1xyXG4gICAgLy8gU2hvdWxkIGxvZyBhbGwgbWVzc2FnZXMuXHJcbiAgICBsb2c6IChBUFAuRU5WLkRFVikgJiYgdHJ1ZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb25maWcgc2V0dGluZ3MgZm9yIHV0aWxzL2FqYXguXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYWpheCA9IHtcclxuICAgIC8vIFNob3VsZCBsb2cgYWxsIG1lc3NhZ2VzLlxyXG4gICAgbG9nOiAoQVBQLkVOVi5ERVYpICYmIHRydWUsXHJcbiAgICAvLyBTaG91bGQgYmUgaW4gZGV2IG1vZGUsIGFuZCBtb2NrIHJlcXVlc3RzIHJhdGhlciB0aGFuIHNlbmRpbmcgdGhlbSB0byB0aGUgc2VydmVyLlxyXG4gICAgZGV2OiAoQVBQLkVOVi5ERVYpICYmIGZhbHNlLFxyXG4gICAgLy8gVGltZW91dCBwZXJpb2QgZm9yIHJlcXVlc3RzIGZvciBkZXYgbW9kZS5cclxuICAgIHRpbWVvdXQ6IDI1MDAsXHJcbn07XHJcblxyXG4vKipcclxuICogQ29uZmlnIHNldHRpbmdzIGZvciB1dGlscy9tb2NrLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG1vY2sgPSB7XHJcbiAgICAvLyBTaG91bGQgbG9nIGFsbCBtZXNzYWdlcy5cclxuICAgIGxvZzogKEFQUC5FTlYuREVWKSAmJiB0cnVlLFxyXG4gICAgLy8gU2hvdWxkIGZhaWwuXHJcbiAgICBlcnJvcjogZmFsc2UsXHJcbn07XHJcblxyXG4vKipcclxuICogQ29uZmlnIHNldHRpbmdzIGZvciBmb3Jtcy5cclxuICovXHJcbmV4cG9ydCBjb25zdCBmb3JtID0ge1xyXG4gICAgLy8gU2hvdWxkIGxvZyBhbGwgbWVzc2FnZXMuXHJcbiAgICBsb2c6IChBUFAuRU5WLkRFVikgJiYgdHJ1ZSxcclxuICAgIC8vIFNob3VsZCBzdG9wIG9uIGZpZWxkIHZhbGlkYXRpb24gZXJyb3IuIFNldCB0byBmYWxzZSB0byBzdWJtaXQgZm9ybSBldmVuIHdpdGggdmFsaWRhdGlvbiBlcnJvcnMuXHJcbiAgICAvLyBURVNUSU5HIE9OTFkuXHJcbiAgICBzdG9wT25FcnJvcjogdHJ1ZSxcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXIhLi9zcmMvY29uZmlncy9kZWJ1Zy50c3giLCJpbXBvcnQgUmVhY3QsIHsgQ2hhbmdlRXZlbnQgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcclxuXHJcbmltcG9ydCBQYXBhIGZyb20gXCJwYXBhcGFyc2VcIjtcclxuXHJcbmltcG9ydCBBamF4IGZyb20gXCJ1dGlscy9hamF4XCI7XHJcbmltcG9ydCBMb2dnaW5nIGZyb20gXCJ1dGlscy9sb2dnaW5nXCI7XHJcblxyXG5pbnRlcmZhY2UgTGF0TG5nU3RhdGUge1xyXG4gICAgbm90Rm91bmQ6IHN0cmluZ1tdO1xyXG4gICAgY29tcGxldGVkOiBudW1iZXI7XHJcbn1cclxuXHJcbmNsYXNzIExhdExuZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDx7fSwgTGF0TG5nU3RhdGU+IHtcclxuICAgIHByaXZhdGUgY3N2RGF0YTogYW55W107XHJcbiAgICBwcml2YXRlIHN0YXJ0VGltZTogRGF0ZTtcclxuICAgIHByaXZhdGUgZmlsZU5hbWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgdGltZURlbGF5OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGFkZHJlc3NJbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBjaXR5SW5kZXg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgc3RhdGVJbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSB6aXBJbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBsYXRJbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBsbmdJbmRleDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiB7fSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgbm90Rm91bmQ6IFtdLFxyXG4gICAgICAgICAgICBjb21wbGV0ZWQ6IDAsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy50aW1lRGVsYXkgPSA1MDtcclxuICAgICAgICB0aGlzLmFkZHJlc3NJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMuY2l0eUluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5zdGF0ZUluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy56aXBJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMubGF0SW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLmxuZ0luZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5jc3ZEYXRhID0gW107XHJcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKTogUmVhY3QuUmVhY3RGcmFnbWVudCB7XHJcblxyXG4gICAgICAgIGxldCBwcm9ncmVzczogSlNYLkVsZW1lbnQgPSA8c3BhbiAvPjtcclxuXHJcbiAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIHRoZSBsZW5ndGgsIHRvIGFjY291bnQgZm9yIHRoZSBoZWFkZXIgbGluZS5cclxuICAgICAgICBpZiAodW5kZWZpbmVkICE9PSB0aGlzLmNzdkRhdGEpIHtcclxuICAgICAgICAgICAgY29uc3QgZXRhOiBEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgZXRhLnNldFRpbWUoZXRhLmdldFRpbWUoKSArICh0aGlzLmNzdkRhdGEubGVuZ3RoIC0gMSAtIHRoaXMuc3RhdGUuY29tcGxldGVkKSAqIHRoaXMudGltZURlbGF5KTtcclxuICAgICAgICAgICAgY29uc3QgY291bnREb3duOiBEYXRlID0gbmV3IERhdGUoZXRhLmdldFRpbWUoKSAtIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgICAgIHByb2dyZXNzID0gKFxyXG4gICAgICAgICAgICAgICAgPFJlYWN0LkZyYWdtZW50PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTggbXgtYXV0byBtYi0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb2dyZXNzOiB7dGhpcy5zdGF0ZS5jb21wbGV0ZWR9L3t0aGlzLmNzdkRhdGEubGVuZ3RoIC0gMX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IG14LWF1dG8gbWItNVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDb3VudGRvd246IHtjb3VudERvd24uZ2V0TWludXRlcygpfTp7Y291bnREb3duLmdldFNlY29uZHMoKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBub3RGb3VuZDogSlNYLkVsZW1lbnRbXSA9IHRoaXMuc3RhdGUubm90Rm91bmQubWFwKCh2YWx1ZTogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoPGRpdiBrZXk9e2luZGV4fT57dmFsdWV9PC9kaXY+KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPFJlYWN0LkZyYWdtZW50PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cIm1haW5UZXh0XCIgY2xhc3NOYW1lPVwiY29sLXNtLTggbXgtYXV0byBtYi01XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgVXBsb2FkIGEgQ1NWIGZpbGUgd2l0aCBhIGZpZWxkIGNhbGxlZCBcIkFkZHJlc3NcIiwgdG8gcmV0cmVpdmUgdGhlIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgb2YgYWxsIHRoZSBhZGRyZXNzZXMuIEFkZHJlc3NlcyB0aGF0IGNhbid0IGJlIGZvdW5kIHdpbGwgYmUgbGlzdGVkIGJlbG93LlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IG14LWF1dG8gbWItM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cIiouY3N2XCIgb25DaGFuZ2U9e3RoaXMub25VcGxvYWR9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHtwcm9ncmVzc31cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTggbXgtYXV0b1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtub3RGb3VuZH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uVXBsb2FkID0gKGV2ZW50OiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50Pik6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmIChudWxsICE9PSBldmVudC50YXJnZXQuZmlsZXMgJiYgbnVsbCAhPT0gZXZlbnQudGFyZ2V0LmZpbGVzWzBdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5maWxlTmFtZSA9IGV2ZW50LnRhcmdldC5maWxlc1swXS5uYW1lO1xyXG4gICAgICAgICAgICBQYXBhLnBhcnNlKGV2ZW50LnRhcmdldC5maWxlc1swXSwge1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IHRoaXMub25QYXJzZUNvbXBsZXRlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uUGFyc2VDb21wbGV0ZSA9IChyZXN1bHRzOiBQYXBhLlBhcnNlUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKG51bGwgIT09IHJlc3VsdHMuZGF0YSAmJiAwIDwgcmVzdWx0cy5kYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBJZGVudGlmeSB3aGljaCBpbmRleCBob2xkcyB0aGUgYWRkcmVzcy5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBkYXRhIG9mIHJlc3VsdHMuZGF0YVswXSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKC0xIDwgKGRhdGEgYXMgc3RyaW5nKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJhZGRyZXNzXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRyZXNzSW5kZXggPSByZXN1bHRzLmRhdGFbMF0uaW5kZXhPZihkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgtMSA8IChkYXRhIGFzIHN0cmluZykudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiY2l0eVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eUluZGV4ID0gcmVzdWx0cy5kYXRhWzBdLmluZGV4T2YoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoLTEgPCAoZGF0YSBhcyBzdHJpbmcpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcInN0YXRlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUluZGV4ID0gcmVzdWx0cy5kYXRhWzBdLmluZGV4T2YoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoLTEgPCAoZGF0YSBhcyBzdHJpbmcpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcInppcFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuemlwSW5kZXggPSByZXN1bHRzLmRhdGFbMF0uaW5kZXhPZihkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5sYXRJbmRleCA9IChyZXN1bHRzLmRhdGFbMF0gYXMgYW55KS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMubG5nSW5kZXggPSB0aGlzLmxhdEluZGV4ICsgMTtcclxuICAgICAgICAgICAgcmVzdWx0cy5kYXRhWzBdW3RoaXMubGF0SW5kZXhdID0gXCJMYXRpdHVkZVwiO1xyXG4gICAgICAgICAgICByZXN1bHRzLmRhdGFbMF1bdGhpcy5sbmdJbmRleF0gPSBcIkxvbmdpdHVkZVwiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jc3ZEYXRhID0gcmVzdWx0cy5kYXRhO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLmdldExvY2F0aW9uLCB0aGlzLnRpbWVEZWxheSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0TG9jYXRpb24gPSAoY3VycmVudEluZGV4OiBudW1iZXIgPSAxKTogdm9pZCA9PiB7XHJcbiAgICAgICAgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5hZGRyZXNzSW5kZXhdICs9IFwiLCBcIiArIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMuY2l0eUluZGV4XSArIFwiLCBcIiArIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMuc3RhdGVJbmRleF0gKyBcIiBcIiArIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMuemlwSW5kZXhdO1xyXG4gICAgICAgIGNvbnN0IGFkZHJlc3M6IHN0cmluZyA9IHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMuYWRkcmVzc0luZGV4XTtcclxuICAgICAgICBBamF4LmdldChcImFwaS9nZW9jb2RlP2FkZHJlc3M9XCIgKyBhZGRyZXNzICsgXCIsIFwiICsgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5jaXR5SW5kZXhdKVxyXG4gICAgICAgICAgICAudGhlbigocmVzdWx0OiBKc29uUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0dXM6IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzID0gcmVzdWx0LmRhdGEuc3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2VvY29kZVJlc3VsdHM6IGdvb2dsZS5tYXBzLkdlb2NvZGVyUmVzdWx0W10gPSByZXN1bHQuZGF0YS5yZXN1bHRzO1xyXG4gICAgICAgICAgICAgICAgTG9nZ2luZy5sb2coXCJTVEFUVVM6ICVzXCIsIHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5SRVFVRVNUX0RFTklFRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIExvZ2dpbmcubG9nKFwiU1RPUFBJTkcuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PSykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMubG5nSW5kZXhdID0gZ2VvY29kZVJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMubGF0SW5kZXhdID0gZ2VvY29kZVJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubGF0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb21wbGV0ZWQ6IGN1cnJlbnRJbmRleCB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5aRVJPX1JFU1VMVFMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmxhdEluZGV4XSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5sbmdJbmRleF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubm90Rm91bmQucHVzaCh0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmFkZHJlc3NJbmRleF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb21wbGV0ZWQ6IGN1cnJlbnRJbmRleCwgbm90Rm91bmQ6IHRoaXMuc3RhdGUubm90Rm91bmQgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT1ZFUl9RVUVSWV9MSU1JVCB8fCBzdGF0dXMgPT09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLlVOS05PV05fRVJST1IpIHtcclxuICAgICAgICAgICAgICAgICAgICBMb2dnaW5nLmxvZyhcIlBBVVNFRFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuZ2V0TG9jYXRpb24sIDUwMDAwLCB0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmFkZHJlc3NJbmRleF0sIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCArPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5kZXggPj0gdGhpcy5jc3ZEYXRhLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBMb2dnaW5nLmxvZyhcIkZJTklTSEVEXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFN1cnJvdW5kIHN0cmluZ3MgaW4gcXVvdGVzLCBhbmQgYWRkIGxpbmUgYnJlYWtzIHRvIHRoZSBlbmQgb2YgZWFjaCByb3cuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YTogc3RyaW5nID0gdGhpcy5jc3ZEYXRhLm1hcCgodmFsdWU6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5tYXAoKHZhbDogc3RyaW5nIHwgbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlxcXCJcIiArIHZhbCArIFwiXFxcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KS5qb2luKFwiXFxyXFxuXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluay5ocmVmID0gXCJkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXCIgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluay5pbm5lclRleHQgPSBcIkNsaWNrIHRvIGRvd25sb2FkLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKFwiZG93bmxvYWRcIiwgdGhpcy5maWxlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1haW46IEhUTUxFbGVtZW50IHwgbnVsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblRleHRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9PSBtYWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW4uYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuZ2V0TG9jYXRpb24sIHRoaXMudGltZURlbGF5LCBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbGF0bG5nOiBIVE1MRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdGxuZ1wiKTtcclxuXHJcbmlmIChudWxsICE9PSBsYXRsbmcpIHtcclxuICAgIFJlYWN0RE9NLnJlbmRlcihcclxuICAgICAgICA8TGF0TG5nIC8+LFxyXG4gICAgICAgIGxhdGxuZyxcclxuICAgICk7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXIhLi9zcmMvaW5kZXgudHN4IiwiaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcblxyXG5pbXBvcnQgeyBhamF4IGFzIENvbmZpZyB9IGZyb20gXCJjb25maWdzL2RlYnVnXCI7XHJcbmltcG9ydCBMb2dnaW5nIGZyb20gXCJ1dGlscy9sb2dnaW5nXCI7XHJcbmltcG9ydCBNb2NrIGZyb20gXCJ1dGlscy9tb2NrXCI7XHJcblxyXG4vKipcclxuICogVXRpbGl0eSBjbGFzcyBmb3IgaGFuZGxpbmcgYWpheCByZXF1ZXN0cy5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFqYXgge1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdGF0aWMgZnVuY3Rpb24gZm9yIHNlbmRpbmcgUE9TVCByZXF1ZXN0cy5cclxuICAgICAqIEBwYXJhbSBwYXRoIFBhdGggdG8gUE9TVCBkYXRhIHRvLlxyXG4gICAgICogQHBhcmFtIGRhdGEgRGF0YSB0byBzZW5kLlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHBvc3QocGF0aDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBBamF4LmxvZyhcIlNlbmRpbmcgUE9TVDogJXMsIGRhdGE6ICVvXCIsIHBhdGgsIGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoQ29uZmlnLmRldikge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgTW9jay5wb3N0KHBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEpzb25SZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFqYXgubG9nKFwiQ29tcGxldGVkIERFViBQT1NUOiAlcywgcmVzcG9uc2U6ICVvXCIsIHBhdGgsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3I6IEVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBMb2dnaW5nLmVycm9yKFwiQ29tcGxldGVkIERFViBQT1NUOiAlcywgJW9cIiwgcGF0aCwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCBDb25maWcudGltZW91dCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBBeGlvcy5wb3N0KHBhdGgsIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogSnNvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBamF4LmxvZyhcIkNvbXBsZXRlZCBQT1NUOiAlcywgcmVzcG9uc2U6ICVvXCIsIHBhdGgsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3I6IEVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dpbmcuZXJyb3IoXCJDb21wbGV0ZWQgUE9TVDogJXMsICVvXCIsIHBhdGgsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3RhdGljIGZ1bmN0aW9uIGZvciBzZW5kaW5nIEdFVCByZXF1ZXN0cy5cclxuICAgICAqIEBwYXJhbSBwYXRoIFBhdGggdG8gc2VuZCBHRVQgcmVxdWVzdCB0by5cclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXR1cm5zIGEgUHJvbWlzZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQocGF0aDogc3RyaW5nLCBkYXRhPzogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgQWpheC5sb2coXCJTZW5kaW5nIEdFVDogJXNcIiwgcGF0aCk7XHJcbiAgICAgICAgICAgIGlmIChDb25maWcuZGV2KSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBNb2NrLmdldChwYXRoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0OiBKc29uUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBamF4LmxvZyhcIkNvbXBsZXRlZCBERVYgR0VUOiAlcywgcmVzcG9uc2U6ICVvXCIsIHBhdGgsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3I6IEVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBMb2dnaW5nLmVycm9yKFwiQ29tcGxldGVkIERFViBHRVQ6ICVzLCAlb1wiLCBwYXRoLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sIENvbmZpZy50aW1lb3V0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIEF4aW9zLmdldChwYXRoKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEpzb25SZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWpheC5sb2coXCJDb21wbGV0ZWQgR0VUOiAlcywgcmVzcG9uc2U6ICVvXCIsIHBhdGgsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3I6IEVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dpbmcuZXJyb3IoXCJDb21wbGV0ZWQgR0VUOiAlcywgJW9cIiwgcGF0aCwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnRlcm5hbCBmdW5jdGlvbiBmb3IgbG9nZ2luZy4gQWxsb3dzIGVhc3kgZW5hYmxlL2Rpc2FibGUgb2YgYWxsIHN0YW5kYXJkIGxvZ2dpbmcuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBNZXNzYWdlIHRvIGxvZy5cclxuICAgICAqIEBwYXJhbSBhcmdzIEFyZ3VtZW50cyB0byBpbmNsdWRlIGluIHRoZSBtZXNzYWdlLlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGxvZyhtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKENvbmZpZy5sb2cpIHtcclxuICAgICAgICAgICAgTG9nZ2luZy5sb2cobWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyIS4vc3JjL3V0aWxzL2FqYXgudHN4IiwiaW1wb3J0IHsgbW9jayBhcyBDb25maWcgfSBmcm9tIFwiY29uZmlncy9kZWJ1Z1wiO1xyXG5pbXBvcnQgeyBhcGkgYXMgUGF0aHMgfSBmcm9tIFwiY29uZmlncy9wYXRoc1wiO1xyXG5pbXBvcnQgTG9nZ2luZyBmcm9tIFwidXRpbHMvbG9nZ2luZ1wiO1xyXG5cclxuY29uc3QgZXJyb3JNb2NrID0geyBuYW1lOiBcIkVycm9yXCIsIG1lc3NhZ2U6IFwiTW9ja2luZyBlcnJvciB0ZXN0aW5nLlwiLCBzdGFjazogXCJtb2NrLnRzeFwiIH07XHJcblxyXG4vKipcclxuICogVXRpbGl0eSBjbGFzcyB0byBtb2NrIG91dCBhcGkgcmVxdWVzdHMgd2l0aG91dCBhY3R1YWxseSB0YWxraW5nIHRvIHRoZSBzZXJ2ZXIuXHJcbiAqXHJcbiAqIFVzZWQgZm9yIHRlc3RpbmcgcHVycG9zZXMgb25seS5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vY2sge1xyXG4gICAgLyoqXHJcbiAgICAgKiBNb2NrIGEgUE9TVCByZXF1ZXN0LlxyXG4gICAgICogQHBhcmFtIHBhdGggVGhlIHBhdGggdG8gbW9jay5cclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXR1cm5zIGEgUHJvbWlzZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwb3N0KHBhdGg6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBKc29uUmVzdWx0ID0ge1xyXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxyXG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgc3RhdHVzVGV4dDogXCJPS1wiLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIE1vY2subG9nKFwiTW9ja2luZyBQT1NUOiAlcy5cIiwgcGF0aCk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAocGF0aCkge1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmRhdGEgPSBcIlBPU1Q6IE1vY2tlZCByZXF1ZXN0LlwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoQ29uZmlnLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBNb2NrLmxvZyhcIk1vY2tpbmcgUE9TVDogJXMsIHJlamVjdGluZyB3aXRoICVvLlwiLCBwYXRoLCBlcnJvck1vY2spO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yTW9jayk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBNb2NrLmxvZyhcIk1vY2tpbmcgUE9TVDogJXMsIHJlc29sdmluZyB3aXRoICVvLlwiLCBwYXRoLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNb2NrIGEgR0VUIHJlcXVlc3QuXHJcbiAgICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCB0byBtb2NrLlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9IFJldHVybnMgYSBQcm9taXNlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogSnNvblJlc3VsdCA9IHtcclxuICAgICAgICAgICAgZGF0YTogbnVsbCxcclxuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXHJcbiAgICAgICAgICAgIHN0YXR1c1RleHQ6IFwiT0tcIixcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBNb2NrLmxvZyhcIk1vY2tpbmcgR0VUOiAlcy5cIiwgcGF0aCk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAocGF0aCkge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBNb2NrLmxvZyhcIk1vY2tpbmcgR0VUOiAlcywgbm90IGZvdW5kLlwiLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhID0gXCJHRVQ6IE1vY2tlZCByZXF1ZXN0LlwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChDb25maWcuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIE1vY2subG9nKFwiTW9ja2luZyBHRVQ6ICVzLCByZWplY3Rpbmcgd2l0aCAlby5cIiwgcGF0aCwgZXJyb3JNb2NrKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvck1vY2spO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgTW9jay5sb2coXCJNb2NraW5nIEdFVDogJXMsIHJlc29sdmluZyB3aXRoICVvLlwiLCBwYXRoLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBsb2cobWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgICAgIGlmIChDb25maWcubG9nKSB7XHJcbiAgICAgICAgICAgIExvZ2dpbmcubG9nKG1lc3NhZ2UsIC4uLmFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlciEuL3NyYy91dGlscy9tb2NrLnRzeCIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuXHJcbi8qKlxyXG4gKiBVdGlsIGNsYXNzIGZvciBwcmV2ZW50aW5nIGNvbnNvbGUgbWVzc2FnZXMgb24gcHJvZHVjdGlvbiBlbnZpcm9ubWVudC5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dpbmcge1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2codGV4dDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgICAgIGlmICghQVBQLkVOVi5ERVYpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5pbmZvKHRleHQsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgd2Fybih0ZXh0OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFBUFAuRU5WLkRFVikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLndhcm4odGV4dCwgLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBlcnJvcih0ZXh0OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgLy8gZXJyb3IgbWVzc2FnZXMgc2hvdWxkIGFsd2F5cyBiZSBsb2dnZWQsIHJlZ2FyZGxlc3Mgb2YgZW52aXJvbm1lbnQuXHJcbiAgICAgICAgY29uc29sZS5lcnJvcih0ZXh0LCAuLi5hcmdzKTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlciEuL3NyYy91dGlscy9sb2dnaW5nLnRzeCJdLCJzb3VyY2VSb290IjoiIn0=