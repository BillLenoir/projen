"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var url_1 = require("url");
var __dirname = (0, path_1.dirname)((0, url_1.fileURLToPath)(import.meta.url));
exports.typeDefs = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '..', '..', 'schema.graphql'), 'utf8');
