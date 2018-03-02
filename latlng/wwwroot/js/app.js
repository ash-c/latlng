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

                _this.latIndex = _this.addressIndex + 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUEyQzs7OztBQUNWOzs7O0FBU2pDOzs7Ozs7Ozs7Ozs7SUFBYTs7O0FBVVQsb0JBQXFCO0FBQ1o7O29IQUFROztBQXdEUCxjQUFRLFdBQUcsVUFBK0M7QUFDN0QsZ0JBQUssU0FBVSxNQUFPLE9BQU0sU0FBUSxTQUFVLE1BQU8sT0FBTSxNQUFJLElBQUU7QUFDNUQsc0JBQVUsWUFBRyxJQUFXO0FBQ3hCLHNCQUFTLFdBQVEsTUFBTyxPQUFNLE1BQUcsR0FBTTtBQUN2QyxvQ0FBTSxNQUFNLE1BQU8sT0FBTSxNQUFHO0FBQ3BCLDhCQUFNLE1BRXRCO0FBSHNDO0FBSTFDO0FBQUM7QUFFUyxjQUFlLGtCQUFHLFVBQThCO0FBQ25ELGdCQUFLLFNBQVksUUFBSyxRQUFLLElBQVUsUUFBSyxLQUFRO0FBQ1A7QUFEUzs7Ozs7QUFFOUMseUNBQXFCLFFBQUssS0FBSTtBQUFFLDRCQUF0Qjs7QUFDUiw0QkFBQyxDQUFFLElBQW1CLEtBQWMsY0FBUSxRQUFZLFlBQUU7QUFDckQsa0NBQWEsZUFBVSxRQUFLLEtBQUcsR0FBUSxRQUFPO0FBRXREO0FBQ0o7QUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQUVHLHNCQUFTLFdBQU8sTUFBYSxlQUFLO0FBQ2xDLHNCQUFTLFdBQU8sTUFBUyxXQUFLO0FBQzNCLHdCQUFLLEtBQUcsR0FBSyxNQUFVLFlBQWM7QUFDckMsd0JBQUssS0FBRyxHQUFLLE1BQVUsWUFBZTtBQUV6QyxzQkFBUSxVQUFVLFFBQU07QUFFbEIsMkJBQUssTUFBWSxhQUFNLE1BQVUsV0FBTSxNQUFRLFFBQUcsR0FBSyxNQUNyRTtBQUNKO0FBQUM7QUFFTyxjQUFXLGNBQUcsVUFBZ0I7Z0JBQUUsbUZBQWtDOztBQUNuRSxnQkFBSyxTQUFTLE1BQVMsU0FBRTtBQUNwQixzQkFBUSxVQUFHLElBQVUsT0FBSyxLQUNsQztBQUFDO0FBRWtDO0FB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O3NCQUFVLFdBQ1Y7QUFJaEI7OztBQTBGSDs7OztFQTNKeUIsZ0JBQTJCOztBQTZKckQsSUFBWSxTQUErQixTQUFlLGVBQVc7QUFFbEUsSUFBSyxTQUFZLFFBQUU7QUFDVix1QkFBTyxPQUNYLDhCQUFVLGVBR2xCO0FBQUMsQyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ2hhbmdlRXZlbnQgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcclxuXHJcbmltcG9ydCBQYXBhIGZyb20gXCJwYXBhcGFyc2VcIjtcclxuXHJcbmludGVyZmFjZSBMYXRMbmdTdGF0ZSB7XHJcbiAgICBub3RGb3VuZDogc3RyaW5nW107XHJcbiAgICBjb21wbGV0ZWQ6IG51bWJlcjtcclxufVxyXG5cclxuY2xhc3MgTGF0TG5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHt9LCBMYXRMbmdTdGF0ZT4ge1xyXG4gICAgcHJpdmF0ZSBnZW9jb2RlOiBnb29nbGUubWFwcy5HZW9jb2RlciB8IG51bGw7XHJcbiAgICBwcml2YXRlIGNzdkRhdGE6IGFueVtdO1xyXG4gICAgcHJpdmF0ZSBzdGFydFRpbWU6IERhdGU7XHJcbiAgICBwcml2YXRlIGZpbGVOYW1lOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHRpbWVEZWxheTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBhZGRyZXNzSW5kZXg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgbGF0SW5kZXg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgbG5nSW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczoge30pIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG5vdEZvdW5kOiBbXSxcclxuICAgICAgICAgICAgY29tcGxldGVkOiAwLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ2VvY29kZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50aW1lRGVsYXkgPSAxMDAwO1xyXG4gICAgICAgIHRoaXMuYWRkcmVzc0luZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5sYXRJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMubG5nSW5kZXggPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCk6IFJlYWN0LlJlYWN0RnJhZ21lbnQge1xyXG5cclxuICAgICAgICBsZXQgcHJvZ3Jlc3M6IEpTWC5FbGVtZW50ID0gPHNwYW4gLz47XHJcblxyXG4gICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSB0aGUgbGVuZ3RoLCB0byBhY2NvdW50IGZvciB0aGUgaGVhZGVyIGxpbmUuXHJcbiAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gdGhpcy5jc3ZEYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV0YTogRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGV0YS5zZXRUaW1lKGV0YS5nZXRUaW1lKCkgKyAodGhpcy5jc3ZEYXRhLmxlbmd0aCAtIDEgLSB0aGlzLnN0YXRlLmNvbXBsZXRlZCkgKiB0aGlzLnRpbWVEZWxheSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50RG93bjogRGF0ZSA9IG5ldyBEYXRlKGV0YS5nZXRUaW1lKCkgLSBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XHJcblxyXG4gICAgICAgICAgICBwcm9ncmVzcyA9IChcclxuICAgICAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IG14LWF1dG8gbWItMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9ncmVzczoge3RoaXMuc3RhdGUuY29tcGxldGVkfS97dGhpcy5jc3ZEYXRhLmxlbmd0aCAtIDF9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOCBteC1hdXRvIG1iLTVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQ291bnRkb3duOiB7Y291bnREb3duLmdldE1pbnV0ZXMoKX06e2NvdW50RG93bi5nZXRTZWNvbmRzKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgbm90Rm91bmQ6IEpTWC5FbGVtZW50W10gPSB0aGlzLnN0YXRlLm5vdEZvdW5kLm1hcCgodmFsdWU6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKDxkaXYga2V5PXtpbmRleH0+e3ZhbHVlfTwvZGl2Pik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJtYWluVGV4dFwiIGNsYXNzTmFtZT1cImNvbC1zbS04IG14LWF1dG8gbWItNVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIFVwbG9hZCBhIENTViBmaWxlIHdpdGggYSBmaWVsZCBjYWxsZWQgXCJBZGRyZXNzXCIsIHRvIHJldHJlaXZlIHRoZSBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlIG9mIGFsbCB0aGUgYWRkcmVzc2VzLiBBZGRyZXNzZXMgdGhhdCBjYW4ndCBiZSBmb3VuZCB3aWxsIGJlIGxpc3RlZCBiZWxvdy5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOCBteC1hdXRvIG1iLTNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCIqLmNzdlwiIG9uQ2hhbmdlPXt0aGlzLm9uVXBsb2FkfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7cHJvZ3Jlc3N9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IG14LWF1dG9cIj5cclxuICAgICAgICAgICAgICAgICAgICB7bm90Rm91bmR9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvblVwbG9hZCA9IChldmVudDogQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAobnVsbCAhPT0gZXZlbnQudGFyZ2V0LmZpbGVzICYmIG51bGwgIT09IGV2ZW50LnRhcmdldC5maWxlc1swXSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsZU5hbWUgPSBldmVudC50YXJnZXQuZmlsZXNbMF0ubmFtZTtcclxuICAgICAgICAgICAgUGFwYS5wYXJzZShldmVudC50YXJnZXQuZmlsZXNbMF0sIHtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiB0aGlzLm9uUGFyc2VDb21wbGV0ZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvblBhcnNlQ29tcGxldGUgPSAocmVzdWx0czogUGFwYS5QYXJzZVJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChudWxsICE9PSByZXN1bHRzLmRhdGEgJiYgMCA8IHJlc3VsdHMuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gSWRlbnRpZnkgd2hpY2ggaW5kZXggaG9sZHMgdGhlIGFkZHJlc3MuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZGF0YSBvZiByZXN1bHRzLmRhdGFbMF0pIHtcclxuICAgICAgICAgICAgICAgIGlmICgtMSA8IChkYXRhIGFzIHN0cmluZykudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiYWRkcmVzc1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkcmVzc0luZGV4ID0gcmVzdWx0cy5kYXRhWzBdLmluZGV4T2YoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubGF0SW5kZXggPSB0aGlzLmFkZHJlc3NJbmRleCArIDE7XHJcbiAgICAgICAgICAgIHRoaXMubG5nSW5kZXggPSB0aGlzLmxhdEluZGV4ICsgMTtcclxuICAgICAgICAgICAgcmVzdWx0cy5kYXRhWzBdW3RoaXMubGF0SW5kZXhdID0gXCJMYXRpdHVkZVwiO1xyXG4gICAgICAgICAgICByZXN1bHRzLmRhdGFbMF1bdGhpcy5sbmdJbmRleF0gPSBcIkxvbmdpdHVkZVwiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jc3ZEYXRhID0gcmVzdWx0cy5kYXRhO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLmdldExvY2F0aW9uLCB0aGlzLnRpbWVEZWxheSwgdGhpcy5jc3ZEYXRhWzFdW3RoaXMuYWRkcmVzc0luZGV4XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0TG9jYXRpb24gPSAoYWRkcmVzczogc3RyaW5nLCBjdXJyZW50SW5kZXg6IG51bWJlciA9IDEpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAobnVsbCA9PT0gdGhpcy5nZW9jb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VvY29kZSA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgdGhhdCBhZGRyZXNzIGhhcyBhIGxlbmd0aC5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIkFkZHJlc3M6ICVzLCBJbmRleDogJWksIERhdGE6ICVvXCIsIGFkZHJlc3MsIGN1cnJlbnRJbmRleCwgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF0pO1xyXG5cclxuICAgICAgICB0aGlzLmdlb2NvZGUuZ2VvY29kZSh7XHJcbiAgICAgICAgICAgIGFkZHJlc3MsXHJcbiAgICAgICAgfSwgKGdlb2NvZGVSZXN1bHRzOiBnb29nbGUubWFwcy5HZW9jb2RlclJlc3VsdFtdLCBzdGF0dXM6IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1RBVFVTOiAlc1wiLCBzdGF0dXMpO1xyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PSykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jc3ZEYXRhW2N1cnJlbnRJbmRleF1bdGhpcy5sYXRJbmRleF0gPSBnZW9jb2RlUmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMubG5nSW5kZXhdID0gZ2VvY29kZVJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY29tcGxldGVkOiBjdXJyZW50SW5kZXggfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5aRVJPX1JFU1VMVFMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMubGF0SW5kZXhdID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMubG5nSW5kZXhdID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubm90Rm91bmQucHVzaCh0aGlzLmNzdkRhdGFbY3VycmVudEluZGV4XVt0aGlzLmFkZHJlc3NJbmRleF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbXBsZXRlZDogY3VycmVudEluZGV4LCBub3RGb3VuZDogdGhpcy5zdGF0ZS5ub3RGb3VuZCB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9WRVJfUVVFUllfTElNSVQgfHwgc3RhdHVzID09PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5VTktOT1dOX0VSUk9SKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBBVVNFRFwiKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5nZXRMb2NhdGlvbiwgMTAwMDAsIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMuYWRkcmVzc0luZGV4XSwgY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudEluZGV4ICs9IDE7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudEluZGV4ID49IHRoaXMuY3N2RGF0YS5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZJTklTSEVEXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gU3Vycm91bmQgc3RyaW5ncyBpbiBxdW90ZXMsIGFuZCBhZGQgbGluZSBicmVha3MgdG8gdGhlIGVuZCBvZiBlYWNoIHJvdy5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGE6IHN0cmluZyA9IHRoaXMuY3N2RGF0YS5tYXAoKHZhbHVlOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5tYXAoKHZhbDogc3RyaW5nIHwgbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcXFwiXCIgKyB2YWwgKyBcIlxcXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KS5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICAgICAgIH0pLmpvaW4oXCJcXHJcXG5cIik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IFwiZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgbGluay5pbm5lclRleHQgPSBcIkNsaWNrIHRvIGRvd25sb2FkLlwiO1xyXG4gICAgICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoXCJkb3dubG9hZFwiLCB0aGlzLmZpbGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYWluOiBIVE1MRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5UZXh0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChudWxsICE9PSBtYWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbi5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5nZXRMb2NhdGlvbiwgdGhpcy50aW1lRGVsYXksIHRoaXMuY3N2RGF0YVtjdXJyZW50SW5kZXhdW3RoaXMuYWRkcmVzc0luZGV4XSwgY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBsYXRsbmc6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGF0bG5nXCIpO1xyXG5cclxuaWYgKG51bGwgIT09IGxhdGxuZykge1xyXG4gICAgUmVhY3RET00ucmVuZGVyKFxyXG4gICAgICAgIDxMYXRMbmcgLz4sXHJcbiAgICAgICAgbGF0bG5nLFxyXG4gICAgKTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlciEuL3NyYy9pbmRleC50c3giXSwic291cmNlUm9vdCI6IiJ9