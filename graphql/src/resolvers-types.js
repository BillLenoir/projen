"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sort = exports.Filter = void 0;
var Filter;
(function (Filter) {
    Filter["Own"] = "OWN";
    Filter["Prevown"] = "PREVOWN";
    Filter["Trade"] = "TRADE";
    Filter["Want"] = "WANT";
})(Filter || (exports.Filter = Filter = {}));
var Sort;
(function (Sort) {
    Sort["Id"] = "ID";
    Sort["Title"] = "TITLE";
    Sort["Yearpublished"] = "YEARPUBLISHED";
})(Sort || (exports.Sort = Sort = {}));
