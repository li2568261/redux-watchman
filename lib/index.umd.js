(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory((global.index = global.index || {}, global.index.umd = global.index.umd || {}, global.index.umd.js = {})));
}(this, function (exports) { 'use strict';

  var sugarWrap = {
      addObserver: null,
      store: null
  };
  // set sugarWarp
  var activeSugar = function (addObserver, store) {
      Object.assign(sugarWrap, { addObserver: addObserver, store: store });
  };
  // call function after activeSugar
  var withActive = function (handler, key) {
      return function () {
          var arg = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              arg[_i] = arguments[_i];
          }
          if (sugarWrap.addObserver && sugarWrap.store) {
              return handler.apply(void 0, arg.concat([key ? sugarWrap[key] : undefined]));
          }
          else {
              console.error('please run');
          }
      };
  };
  // async thorw error, make every safe
  var safeBox = function (handler) {
      return handler().catch(function (e) { return e; });
  };

  var createSugar = function () {
      var sugar = {
          observer: {}
      };
      /**
       * @description check observer, if has take action resolve relative take promise;
       * @param action
       */
      var emitAction = function (action) {
          var checkResult = sugar.observer[action.type];
          if (checkResult) {
              checkResult.forEach(function (handler) { return handler(action); });
              sugar.observer[action.type] = [];
          }
          return checkResult;
      };
      /**
       * @param actionType take action, add observer
       * @param resolve take Promise'resolve function
       */
      var addObserver = function (actionType, resolve) {
          if (!sugar.observer[actionType])
              sugar.observer[actionType] = [];
          sugar.observer[actionType].push(resolve);
      };
      var run = function () {
          console.error('applymiddleware before run');
      };
      var sugarMiddleware = function (store) {
          API.run = function (handler) {
              activeSugar(addObserver, store);
              handler();
          };
          return function (next) { return function (action) {
              if (!emitAction(action))
                  next(action);
          }; };
      };
      /**
       * run handler, can asynchronous to intermediate
       * @param handler
       */
      var API = {
          sugarMiddleware: sugarMiddleware,
          run: run
      };
      return API;
  };

  var all = withActive(function (af) {
      return Promise.all(af.map(function (hd) { return hd(); }));
  });

  var put = withActive(function (action, store) {
      return new Promise(function (resolve, reject) {
          resolve(store.dispatch(action));
      });
  }, 'store');

  var select = withActive(function (handler, store) {
      return new Promise(function (resolve, reject) {
          resolve(handler(store.getState()));
      });
  }, 'store');

  var take = withActive(function (actionType, addObserver) {
      return new Promise(function (resolve, reject) {
          addObserver(actionType, resolve);
      });
  }, 'addObserver');

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  function __awaiter(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  }

  var takeEvery = withActive(function (actionType, handler) {
      return __awaiter(this, void 0, void 0, function () {
          var _loop_1;
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0:
                      _loop_1 = function () {
                          var action;
                          return __generator(this, function (_a) {
                              switch (_a.label) {
                                  case 0: return [4 /*yield*/, take(actionType)];
                                  case 1:
                                      action = _a.sent();
                                      return [4 /*yield*/, safeBox(function () { return handler(action); })];
                                  case 2:
                                      _a.sent();
                                      return [2 /*return*/];
                              }
                          });
                      };
                      _a.label = 1;
                  case 1:
                      return [5 /*yield**/, _loop_1()];
                  case 2:
                      _a.sent();
                      return [3 /*break*/, 1];
                  case 3: return [2 /*return*/];
              }
          });
      });
  });

  exports.createSugar = createSugar;
  exports.all = all;
  exports.put = put;
  exports.select = select;
  exports.take = take;
  exports.takeEvery = takeEvery;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
