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
                _papaparse2.default.parse(event.target.files[0], {
                    complete: _this.onParseComplete
                });
            }
        };
        _this.onParseComplete = function (results) {
            var addressIndex = -1;
            if (null !== results.data && 0 < results.data.length) {
                // Identify which index holds the address.
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = results.data[0][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var data = _step.value;

                        if (-1 < data.toLowerCase().indexOf("address")) {
                            addressIndex = results.data[0].indexOf(data);
                            break;
                        }
                    }
                    // Now geocode all addresses.
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
            }
        };
        return _this;
    }

    _createClass(LatLng, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                    "div",
                    { className: "col-sm-8 mx-auto mb-5" },
                    "put a description in later"
                ),
                _react2.default.createElement(
                    "div",
                    { className: "col-sm-8 mx-auto" },
                    _react2.default.createElement("input", { type: "file", accept: "*.csv", onChange: this.onUpload })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUEyQzs7OztBQUNWOzs7O0FBSWpDOzs7Ozs7Ozs7Ozs7SUFBYTs7O0FBQ1Qsb0JBQXFCO0FBQ1o7O29IQUFROztBQWdCUCxjQUFRLFdBQUcsVUFBK0M7QUFDN0QsZ0JBQUssU0FBVSxNQUFPLE9BQU0sU0FBUSxTQUFVLE1BQU8sT0FBTSxNQUFJLElBQUU7QUFDNUQsb0NBQU0sTUFBTSxNQUFPLE9BQU0sTUFBRztBQUNwQiw4QkFBTSxNQUV0QjtBQUhzQztBQUkxQztBQUFDO0FBRVMsY0FBZSxrQkFBRyxVQUE4QjtBQUN0RCxnQkFBZ0IsZUFBVyxDQUFHO0FBQzNCLGdCQUFLLFNBQVksUUFBSyxRQUFLLElBQVUsUUFBSyxLQUFRO0FBQ1A7QUFEUzs7Ozs7QUFFOUMseUNBQXFCLFFBQUssS0FBSTtBQUFFLDRCQUF0Qjs7QUFDUiw0QkFBQyxDQUFFLElBQW1CLEtBQWMsY0FBUSxRQUFZLFlBQUU7QUFDN0MsMkNBQVUsUUFBSyxLQUFHLEdBQVEsUUFBTztBQUVqRDtBQUNKO0FBQUM7QUFHTDs7Ozs7Ozs7Ozs7Ozs7O0FBQ0o7QUFBQzs7QUFsQ1k7Ozs7O0FBQ0Y7QUFDRyxnQ0FDRjs7QUFBSTs7c0JBQVUsV0FHZDs7O0FBQUk7O3NCQUFVLFdBQ1Y7QUFBTSw2REFBSyxNQUFPLFFBQU8sUUFBUSxTQUFVLFVBQUssS0FJaEU7OztBQXdCSDs7OztFQXhDeUIsZ0JBQWtCOztBQTBDNUMsSUFBWSxTQUErQixTQUFlLGVBQVc7QUFFbEUsSUFBSyxTQUFZLFFBQUU7QUFDVix1QkFBTyxPQUNYLDhCQUFVLGVBR2xCO0FBQUMsQyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ2hhbmdlRXZlbnQgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcclxuXHJcbmltcG9ydCBQYXBhIGZyb20gXCJwYXBhcGFyc2VcIjtcclxuXHJcbmNsYXNzIExhdExuZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDx7fSwge30+IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiB7fSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCk6IFJlYWN0LlJlYWN0RnJhZ21lbnQge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTggbXgtYXV0byBtYi01XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgcHV0IGEgZGVzY3JpcHRpb24gaW4gbGF0ZXJcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOCBteC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiKi5jc3ZcIiBvbkNoYW5nZT17dGhpcy5vblVwbG9hZH0gLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uVXBsb2FkID0gKGV2ZW50OiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50Pik6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmIChudWxsICE9PSBldmVudC50YXJnZXQuZmlsZXMgJiYgbnVsbCAhPT0gZXZlbnQudGFyZ2V0LmZpbGVzWzBdKSB7XHJcbiAgICAgICAgICAgIFBhcGEucGFyc2UoZXZlbnQudGFyZ2V0LmZpbGVzWzBdLCB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogdGhpcy5vblBhcnNlQ29tcGxldGUsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25QYXJzZUNvbXBsZXRlID0gKHJlc3VsdHM6IFBhcGEuUGFyc2VSZXN1bHQpID0+IHtcclxuICAgICAgICBsZXQgYWRkcmVzc0luZGV4OiBudW1iZXIgPSAtMTtcclxuICAgICAgICBpZiAobnVsbCAhPT0gcmVzdWx0cy5kYXRhICYmIDAgPCByZXN1bHRzLmRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vIElkZW50aWZ5IHdoaWNoIGluZGV4IGhvbGRzIHRoZSBhZGRyZXNzLlxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRhdGEgb2YgcmVzdWx0cy5kYXRhWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoLTEgPCAoZGF0YSBhcyBzdHJpbmcpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImFkZHJlc3NcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzSW5kZXggPSByZXN1bHRzLmRhdGFbMF0uaW5kZXhPZihkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gTm93IGdlb2NvZGUgYWxsIGFkZHJlc3Nlcy5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGxhdGxuZzogSFRNTEVsZW1lbnQgfCBudWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYXRsbmdcIik7XHJcblxyXG5pZiAobnVsbCAhPT0gbGF0bG5nKSB7XHJcbiAgICBSZWFjdERPTS5yZW5kZXIoXHJcbiAgICAgICAgPExhdExuZyAvPixcclxuICAgICAgICBsYXRsbmcsXHJcbiAgICApO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyIS4vc3JjL2luZGV4LnRzeCJdLCJzb3VyY2VSb290IjoiIn0=