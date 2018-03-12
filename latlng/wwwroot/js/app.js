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

            if (null === _this.geocode) {
                _this.geocode = new google.maps.Geocoder();
            }
            // Check that address has a length.
            console.log("Address: %s, Index: %i, Data: %o", address, currentIndex, _this.csvData[currentIndex]);
            _this.geocode.geocode({
                address: address
            }, function (geocodeResults, status) {
                console.log("STATUS: %s", status);
                if (status === google.maps.GeocoderStatus.OK) {
                    _this.csvData[currentIndex][_this.latIndex] = geocodeResults[0].geometry.location.lat();
                    _this.csvData[currentIndex][_this.lngIndex] = geocodeResults[0].geometry.location.lng();
                    _this.setState({ completed: currentIndex });
                } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                    _this.csvData[currentIndex][_this.latIndex] = 0;
                    _this.csvData[currentIndex][_this.lngIndex] = 0;
                    _this.state.notFound.push(_this.csvData[currentIndex][_this.addressIndex]);
                    _this.setState({ completed: currentIndex, notFound: _this.state.notFound });
                } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT || status === google.maps.GeocoderStatus.UNKNOWN_ERROR) {
                    console.log("PAUSED");
                    setTimeout(_this.getLocation, 10000, _this.csvData[currentIndex][_this.addressIndex], currentIndex);
                    return;
                }
                currentIndex += 1;
                if (currentIndex >= _this.csvData.length - 1) {
                    console.log("FINISHED");
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
                    setTimeout(_this.getLocation, _this.timeDelay, _this.csvData[currentIndex][_this.addressIndex], currentIndex);
                }
            });
        };
        _this.state = {
            notFound: [],
            completed: 0
        };
        _this.geocode = null;
        _this.timeDelay = 1000;
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

/***/ })

},[23]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUEyQzs7OztBQUNWOzs7O0FBU2pDOzs7Ozs7Ozs7Ozs7SUFBYTs7O0FBVVQsb0JBQXFCO0FBQ1o7O29IQUFROztBQXdEUCxjQUFRLFdBQUcsVUFBK0M7QUFDN0QsZ0JBQUssU0FBVSxNQUFPLE9BQU0sU0FBUSxTQUFVLE1BQU8sT0FBTSxNQUFJLElBQUU7QUFDNUQsc0JBQVUsWUFBRyxJQUFXO0FBQ3hCLHNCQUFTLFdBQVEsTUFBTyxPQUFNLE1BQUcsR0FBTTtBQUN2QyxvQ0FBTSxNQUFNLE1BQU8sT0FBTSxNQUFHO0FBQ3BCLDhCQUFNLE1BRXRCO0FBSHNDO0FBSTFDO0FBQUM7QUFFUyxjQUFlLGtCQUFHLFVBQThCO0FBQ25ELGdCQUFLLFNBQVksUUFBSyxRQUFLLElBQVUsUUFBSyxLQUFRO0FBQ1A7QUFEUzs7Ozs7QUFFOUMseUNBQXFCLFFBQUssS0FBSTtBQUFFLDRCQUF0Qjs7QUFDUiw0QkFBQyxDQUFFLElBQW1CLEtBQWMsY0FBUSxRQUFZLFlBQUU7QUFDckQsa0NBQWEsZUFBVSxRQUFLLEtBQUcsR0FBUSxRQUFPO0FBRXREO0FBQ0o7QUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQUVHLHNCQUFTLFdBQVcsUUFBSyxLQUFXLEdBQVE7QUFDNUMsc0JBQVMsV0FBTyxNQUFTLFdBQUs7QUFDM0Isd0JBQUssS0FBRyxHQUFLLE1BQVUsWUFBYztBQUNyQyx3QkFBSyxLQUFHLEdBQUssTUFBVSxZQUFlO0FBRXpDLHNCQUFRLFVBQVUsUUFBTTtBQUVsQiwyQkFBSyxNQUFZLGFBQU0sTUFBVSxXQUFNLE1BQVEsUUFBRyxHQUFLLE1BQ3JFO0FBQ0o7QUFBQztBQUVPLGNBQVcsY0FBRyxVQUFnQjtnQkFBRSxtRkFBa0M7O0FBQ25FLGdCQUFLLFNBQVMsTUFBUyxTQUFFO0FBQ3BCLHNCQUFRLFVBQUcsSUFBVSxPQUFLLEtBQ2xDO0FBQUM7QUFF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QUFBSTs7c0JBQVUsV0FDVjtBQUloQjs7O0FBMEZIOzs7O0VBM0p5QixnQkFBMkI7O0FBNkpyRCxJQUFZLFNBQStCLFNBQWUsZUFBVztBQUVsRSxJQUFLLFNBQVksUUFBRTtBQUNWLHVCQUFPLE9BQ1gsOEJBQVUsZUFHbEI7QUFBQyxDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDaGFuZ2VFdmVudCB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xyXG5cclxuaW1wb3J0IFBhcGEgZnJvbSBcInBhcGFwYXJzZVwiO1xyXG5cclxuaW50ZXJmYWNlIExhdExuZ1N0YXRlIHtcclxuICAgIG5vdEZvdW5kOiBzdHJpbmdbXTtcclxuICAgIGNvbXBsZXRlZDogbnVtYmVyO1xyXG59XHJcblxyXG5jbGFzcyBMYXRMbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8e30sIExhdExuZ1N0YXRlPiB7XHJcbiAgICBwcml2YXRlIGdlb2NvZGU6IGdvb2dsZS5tYXBzLkdlb2NvZGVyIHwgbnVsbDtcclxuICAgIHByaXZhdGUgY3N2RGF0YTogYW55W107XHJcbiAgICBwcml2YXRlIHN0YXJ0VGltZTogRGF0ZTtcclxuICAgIHByaXZhdGUgZmlsZU5hbWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgdGltZURlbGF5OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGFkZHJlc3NJbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBsYXRJbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBsbmdJbmRleDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiB7fSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgbm90Rm91bmQ6IFtdLFxyXG4gICAgICAgICAgICBjb21wbGV0ZWQ6IDAsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nZW9jb2RlID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRpbWVEZWxheSA9IDEwMDA7XHJcbiAgICAgICAgdGhpcy5hZGRyZXNzSW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLmxhdEluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5sbmdJbmRleCA9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKTogUmVhY3QuUmVhY3RGcmFnbWVudCB7XHJcblxyXG4gICAgICAgIGxldCBwcm9ncmVzczogSlNYLkVsZW1lbnQgPSA8c3BhbiAvPjtcclxuXHJcbiAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIHRoZSBsZW5ndGgsIHRvIGFjY291bnQgZm9yIHRoZSBoZWFkZXIgbGluZS5cclxuICAgICAgICBpZiAodW5kZWZpbmVkICE9PSB0aGlzLmNzdkRhdGEpIHtcclxuICAgICAgICAgICAgY29uc3QgZXRhOiBEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgZXRhLnNldFRpbWUoZXRhLmdldFRpbWUoKSArICh0aGlzLmNzdkRhdGEubGVuZ3RoIC0gMSAtIHRoaXMuc3RhdGUuY29tcGxldGVkKSAqIHRoaXMudGltZURlbGF5KTtcclxuICAgICAgICAgICAgY29uc3QgY291bnREb3duOiBEYXRlID0gbmV3IERhdGUoZXRhLmdldFRpbWUoKSAtIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgICAgIHByb2dyZXNzID0gKFxyXG4gICAgICAgICAgICAgICAgPFJlYWN0LkZyYWdtZW50PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTggbXgtYXV0byBtYi0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb2dyZXNzOiB7dGhpcy5zdGF0ZS5jb21wbGV0ZWR9L3t0aGlzLmNzdkRhdGEubGVuZ3RoIC0gMX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IG14LWF1dG8gbWItNVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDb3VudGRvd246IHtjb3VudERvd24uZ2V0TWludXRlcygpfTp7Y291bnREb3duLmdldFNlY29uZHMoKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBub3RGb3VuZDogSlNYLkVsZW1lbnRbXSA9IHRoaXMuc3RhdGUubm90Rm91bmQubWFwKCh2YWx1ZTogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoPGRpdiBrZXk9e2luZGV4fT57dmFsdWV9PC9kaXY+KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPFJlYWN0LkZyYWdtZW50PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cIm1haW5UZXh0XCIgY2xhc3NOYW1lPVwiY29sLXNtLTggbXgtYXV0byBtYi01XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgVXBsb2FkIGEgQ1NWIGZpbGUgd2l0aCBhIGZpZWxkIGNhbGxlZCBcIkFkZHJlc3NcIiwgdG8gcmV0cmVpdmUgdGhlIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgb2YgYWxsIHRoZSBhZGRyZXNzZXMuIEFkZHJlc3NlcyB0aGF0IGNhbid0IGJlIGZvdW5kIHdpbGwgYmUgbGlzdGVkIGJlbG93LlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IG14LWF1dG8gbWItM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cIiouY3N2XCIgb25DaGFuZ2U9e3RoaXMub25VcGxvYWR9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHtwcm9ncmVzc31cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTggbXgtYXV0b1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtub3RGb3VuZH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uVXBsb2FkID0gKGV2ZW50OiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50Pik6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmIChudWxsICE9PSBldmVudC50YXJnZXQuZmlsZXMgJiYgbnVsbCAhPT0gZXZlbnQudGFyZ2V0LmZpbGVzWzBdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5maWxlTmFtZSA9IGV2ZW50LnRhcmdldC5maWxlc1swXS5uYW1lO1xyXG4gICAgICAgICAgICBQYXBhLnBhcnNlKGV2ZW50LnRhcmdldC5maWxlc1swXSwge1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IHRoaXMub25QYXJzZUNvbXBsZXRlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uUGFyc2VDb21wbGV0ZSA9IChyZXN1bHRzOiBQYXBhLlBhcnNlUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKG51bGwgIT09IHJlc3VsdHMuZGF0YSAmJiAwIDwgcmVzdWx0cy5kYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBJZGVudGlmeSB3aGljaCBpbmRleCBob2xkcyB0aGUgYWRkcmVzcy5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBkYXRhIG9mIHJlc3VsdHMuZGF0YVswXSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKC0xIDwgKGRhdGEgYXMgc3RyaW5nKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJhZGRyZXNzXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRyZXNzSW5kZXggPSByZXN1bHRzLmRhdGFbMF0uaW5kZXhPZihkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5sYXRJbmRleCA9IChyZXN1bHRzLmRhdGFbMF0gYXMgYW55KS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMubG5nSW5kZXggPSB0aGlzLmxhdEluZGV4ICsgMTtcclxuICAgICAgICAgICAgcmVzdWx0cy5kYXRhWzBdW3RoaXMubGF0SW5kZXhdID0gXCJMYXRpdHVkZVwiO1xyXG4gICAgICAgICAgICByZXN1bHRzLmRhdGFbMF1bdGhpcy5sbmdJbmRleF0gPSBcIkxvbmdpdHVkZVwiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jc3ZEYXRhID0gcmVzdWx0cy5kYXRhO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLmdldExvY2F0aW9uLCB0aGlzLnRpbWVEZWxheSwgdGhpcy5jc3ZEYXRhWzFdW3RoaXMuYWRkcmVzc0luZGV4XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0TG9jYXRpb24gPSAoYWRkcmVzczogc3RyaW5nLCBjdXJyZW50SW5kZXg6IG51bWJlciA9IDEpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAobnVsbCA9PT0gdGhpcy5nZW9jb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VvY29kZSA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgdGhhdCBhZGRyZXNzIGhhcyBhIGxlbmd0aC5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIkFkZHJlc3M6ICVzLCBJbmRleDogJWksIERhdGE6ICVvXCIsIGFkZHJlc3MsIGN1cnJlbnRJbmRleCwgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF0pO1xyXG5cclxuICAgICAgICB0aGlzLmdlb2NvZGUuZ2VvY29kZSh7XHJcbiAgICAgICAgICAgIGFkZHJlc3MsXHJcbiAgICAgICAgfSwgKGdlb2NvZGVSZXN1bHRzOiBnb29nbGUubWFwcy5HZW9jb2RlclJlc3VsdFtdLCBzdGF0dXM6IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1RBVFVTOiAlc1wiLCBzdGF0dXMpO1xyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PSykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5sYXRJbmRleF0gPSBnZW9jb2RlUmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMubG5nSW5kZXhdID0gZ2VvY29kZVJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY29tcGxldGVkOiBjdXJyZW50SW5kZXggfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5aRVJPX1JFU1VMVFMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMubGF0SW5kZXhdID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMubG5nSW5kZXhdID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubm90Rm91bmQucHVzaCh0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmFkZHJlc3NJbmRleF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbXBsZXRlZDogY3VycmVudEluZGV4LCBub3RGb3VuZDogdGhpcy5zdGF0ZS5ub3RGb3VuZCB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9WRVJfUVVFUllfTElNSVQgfHwgc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5VTktOT1dOX0VSUk9SKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBBVVNFRFwiKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5nZXRMb2NhdGlvbiwgMTAwMDAsIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMuYWRkcmVzc0luZGV4XSwgY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudEluZGV4ICs9IDE7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudEluZGV4ID49IHRoaXMuY3N2RGF0YS5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZJTklTSEVEXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gU3Vycm91bmQgc3RyaW5ncyBpbiBxdW90ZXMsIGFuZCBhZGQgbGluZSBicmVha3MgdG8gdGhlIGVuZCBvZiBlYWNoIHJvdy5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGE6IHN0cmluZyA9IHRoaXMuY3N2RGF0YS5tYXAoKHZhbHVlOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5tYXAoKHZhbDogc3RyaW5nIHwgbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcXFwiXCIgKyB2YWwgKyBcIlxcXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KS5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICAgICAgIH0pLmpvaW4oXCJcXHJcXG5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgICAgICAgICAgbGluay5ocmVmID0gXCJkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXCIgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmlubmVyVGV4dCA9IFwiQ2xpY2sgdG8gZG93bmxvYWQuXCI7XHJcbiAgICAgICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZShcImRvd25sb2FkXCIsIHRoaXMuZmlsZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG1haW46IEhUTUxFbGVtZW50IHwgbnVsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblRleHRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgIT09IG1haW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBtYWluLmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLmdldExvY2F0aW9uLCB0aGlzLnRpbWVEZWxheSwgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5hZGRyZXNzSW5kZXhdLCBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGxhdGxuZzogSFRNTEVsZW1lbnQgfCBudWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYXRsbmdcIik7XHJcblxyXG5pZiAobnVsbCAhPT0gbGF0bG5nKSB7XHJcbiAgICBSZWFjdERPTS5yZW5kZXIoXHJcbiAgICAgICAgPExhdExuZyAvPixcclxuICAgICAgICBsYXRsbmcsXHJcbiAgICApO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyIS4vc3JjL2luZGV4LnRzeCJdLCJzb3VyY2VSb290IjoiIn0=