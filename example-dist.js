(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function e(t, r, n) {
  function i(a, s) {
    if (!r[a]) {
      if (!t[a]) {
        var f = "function" == typeof require && require;
        if (!s && f) return f(a, !0);
        if (o) return o(a, !0);
        var u = new Error("Cannot find module '" + a + "'");
        throw u.code = "MODULE_NOT_FOUND", u;
      }

      var c = r[a] = {
        exports: {}
      };
      t[a][0].call(c.exports, function (e) {
        return i(t[a][1][e] || e);
      }, c, c.exports, e, t, r, n);
    }

    return r[a].exports;
  }

  for (var o = "function" == typeof require && require, a = 0; a < n.length; a++) {
    i(n[a]);
  }

  return i;
}({
  1: [function (e, t, r) {
    "use strict";

    var n = r;
    n.bignum = e("bn.js"), n.define = e("./asn1/api").define, n.base = e("./asn1/base"), n.constants = e("./asn1/constants"), n.decoders = e("./asn1/decoders"), n.encoders = e("./asn1/encoders");
  }, {
    "./asn1/api": 2,
    "./asn1/base": 4,
    "./asn1/constants": 8,
    "./asn1/decoders": 10,
    "./asn1/encoders": 13,
    "bn.js": 15
  }],
  2: [function (e, t, r) {
    "use strict";

    var n = e("./encoders"),
        i = e("./decoders"),
        o = e("inherits");

    function a(e, t) {
      this.name = e, this.body = t, this.decoders = {}, this.encoders = {};
    }

    r.define = function (e, t) {
      return new a(e, t);
    }, a.prototype._createNamed = function (e) {
      var t = this.name;

      function r(e) {
        this._initNamed(e, t);
      }

      return o(r, e), r.prototype._initNamed = function (t, r) {
        e.call(this, t, r);
      }, new r(this);
    }, a.prototype._getDecoder = function (e) {
      return e = e || "der", this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(i[e])), this.decoders[e];
    }, a.prototype.decode = function (e, t, r) {
      return this._getDecoder(t).decode(e, r);
    }, a.prototype._getEncoder = function (e) {
      return e = e || "der", this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(n[e])), this.encoders[e];
    }, a.prototype.encode = function (e, t, r) {
      return this._getEncoder(t).encode(e, r);
    };
  }, {
    "./decoders": 10,
    "./encoders": 13,
    inherits: 135
  }],
  3: [function (e, t, r) {
    "use strict";

    var n = e("inherits"),
        i = e("../base/reporter").Reporter,
        o = e("safer-buffer").Buffer;

    function a(e, t) {
      i.call(this, t), o.isBuffer(e) ? (this.base = e, this.offset = 0, this.length = e.length) : this.error("Input not Buffer");
    }

    function s(e, t) {
      if (Array.isArray(e)) this.length = 0, this.value = e.map(function (e) {
        return s.isEncoderBuffer(e) || (e = new s(e, t)), this.length += e.length, e;
      }, this);else if ("number" == typeof e) {
        if (!(0 <= e && e <= 255)) return t.error("non-byte EncoderBuffer value");
        this.value = e, this.length = 1;
      } else if ("string" == typeof e) this.value = e, this.length = o.byteLength(e);else {
        if (!o.isBuffer(e)) return t.error("Unsupported type: " + _typeof(e));
        this.value = e, this.length = e.length;
      }
    }

    n(a, i), r.DecoderBuffer = a, a.isDecoderBuffer = function (e) {
      if (e instanceof a) return !0;
      return "object" == _typeof(e) && o.isBuffer(e.base) && "DecoderBuffer" === e.constructor.name && "number" == typeof e.offset && "number" == typeof e.length && "function" == typeof e.save && "function" == typeof e.restore && "function" == typeof e.isEmpty && "function" == typeof e.readUInt8 && "function" == typeof e.skip && "function" == typeof e.raw;
    }, a.prototype.save = function () {
      return {
        offset: this.offset,
        reporter: i.prototype.save.call(this)
      };
    }, a.prototype.restore = function (e) {
      var t = new a(this.base);
      return t.offset = e.offset, t.length = this.offset, this.offset = e.offset, i.prototype.restore.call(this, e.reporter), t;
    }, a.prototype.isEmpty = function () {
      return this.offset === this.length;
    }, a.prototype.readUInt8 = function (e) {
      return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun");
    }, a.prototype.skip = function (e, t) {
      if (!(this.offset + e <= this.length)) return this.error(t || "DecoderBuffer overrun");
      var r = new a(this.base);
      return r._reporterState = this._reporterState, r.offset = this.offset, r.length = this.offset + e, this.offset += e, r;
    }, a.prototype.raw = function (e) {
      return this.base.slice(e ? e.offset : this.offset, this.length);
    }, r.EncoderBuffer = s, s.isEncoderBuffer = function (e) {
      if (e instanceof s) return !0;
      return "object" == _typeof(e) && "EncoderBuffer" === e.constructor.name && "number" == typeof e.length && "function" == typeof e.join;
    }, s.prototype.join = function (e, t) {
      return e || (e = o.alloc(this.length)), t || (t = 0), 0 === this.length || (Array.isArray(this.value) ? this.value.forEach(function (r) {
        r.join(e, t), t += r.length;
      }) : ("number" == typeof this.value ? e[t] = this.value : "string" == typeof this.value ? e.write(this.value, t) : o.isBuffer(this.value) && this.value.copy(e, t), t += this.length)), e;
    };
  }, {
    "../base/reporter": 6,
    inherits: 135,
    "safer-buffer": 183
  }],
  4: [function (e, t, r) {
    "use strict";

    var n = r;
    n.Reporter = e("./reporter").Reporter, n.DecoderBuffer = e("./buffer").DecoderBuffer, n.EncoderBuffer = e("./buffer").EncoderBuffer, n.Node = e("./node");
  }, {
    "./buffer": 3,
    "./node": 5,
    "./reporter": 6
  }],
  5: [function (e, t, r) {
    "use strict";

    var n = e("../base/reporter").Reporter,
        i = e("../base/buffer").EncoderBuffer,
        o = e("../base/buffer").DecoderBuffer,
        a = e("minimalistic-assert"),
        s = ["seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr"],
        f = ["key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains"].concat(s);

    function u(e, t, r) {
      var n = {};
      this._baseState = n, n.name = r, n.enc = e, n.parent = t || null, n.children = null, n.tag = null, n.args = null, n.reverseArgs = null, n.choice = null, n.optional = !1, n.any = !1, n.obj = !1, n.use = null, n.useDecoder = null, n.key = null, n["default"] = null, n.explicit = null, n.implicit = null, n.contains = null, n.parent || (n.children = [], this._wrap());
    }

    t.exports = u;
    var c = ["enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains"];
    u.prototype.clone = function () {
      var e = this._baseState,
          t = {};
      c.forEach(function (r) {
        t[r] = e[r];
      });
      var r = new this.constructor(t.parent);
      return r._baseState = t, r;
    }, u.prototype._wrap = function () {
      var e = this._baseState;
      f.forEach(function (t) {
        this[t] = function () {
          var r = new this.constructor(this);
          return e.children.push(r), r[t].apply(r, arguments);
        };
      }, this);
    }, u.prototype._init = function (e) {
      var t = this._baseState;
      a(null === t.parent), e.call(this), t.children = t.children.filter(function (e) {
        return e._baseState.parent === this;
      }, this), a.equal(t.children.length, 1, "Root node can have only one child");
    }, u.prototype._useArgs = function (e) {
      var t = this._baseState,
          r = e.filter(function (e) {
        return e instanceof this.constructor;
      }, this);
      e = e.filter(function (e) {
        return !(e instanceof this.constructor);
      }, this), 0 !== r.length && (a(null === t.children), t.children = r, r.forEach(function (e) {
        e._baseState.parent = this;
      }, this)), 0 !== e.length && (a(null === t.args), t.args = e, t.reverseArgs = e.map(function (e) {
        if ("object" != _typeof(e) || e.constructor !== Object) return e;
        var t = {};
        return Object.keys(e).forEach(function (r) {
          r == (0 | r) && (r |= 0);
          var n = e[r];
          t[n] = r;
        }), t;
      }));
    }, ["_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool"].forEach(function (e) {
      u.prototype[e] = function () {
        var t = this._baseState;
        throw new Error(e + " not implemented for encoding: " + t.enc);
      };
    }), s.forEach(function (e) {
      u.prototype[e] = function () {
        var t = this._baseState,
            r = Array.prototype.slice.call(arguments);
        return a(null === t.tag), t.tag = e, this._useArgs(r), this;
      };
    }), u.prototype.use = function (e) {
      a(e);
      var t = this._baseState;
      return a(null === t.use), t.use = e, this;
    }, u.prototype.optional = function () {
      return this._baseState.optional = !0, this;
    }, u.prototype.def = function (e) {
      var t = this._baseState;
      return a(null === t["default"]), t["default"] = e, t.optional = !0, this;
    }, u.prototype.explicit = function (e) {
      var t = this._baseState;
      return a(null === t.explicit && null === t.implicit), t.explicit = e, this;
    }, u.prototype.implicit = function (e) {
      var t = this._baseState;
      return a(null === t.explicit && null === t.implicit), t.implicit = e, this;
    }, u.prototype.obj = function () {
      var e = this._baseState,
          t = Array.prototype.slice.call(arguments);
      return e.obj = !0, 0 !== t.length && this._useArgs(t), this;
    }, u.prototype.key = function (e) {
      var t = this._baseState;
      return a(null === t.key), t.key = e, this;
    }, u.prototype.any = function () {
      return this._baseState.any = !0, this;
    }, u.prototype.choice = function (e) {
      var t = this._baseState;
      return a(null === t.choice), t.choice = e, this._useArgs(Object.keys(e).map(function (t) {
        return e[t];
      })), this;
    }, u.prototype.contains = function (e) {
      var t = this._baseState;
      return a(null === t.use), t.contains = e, this;
    }, u.prototype._decode = function (e, t) {
      var r = this._baseState;
      if (null === r.parent) return e.wrapResult(r.children[0]._decode(e, t));
      var n,
          i = r["default"],
          a = !0,
          s = null;

      if (null !== r.key && (s = e.enterKey(r.key)), r.optional) {
        var _n = null;

        if (null !== r.explicit ? _n = r.explicit : null !== r.implicit ? _n = r.implicit : null !== r.tag && (_n = r.tag), null !== _n || r.any) {
          if (a = this._peekTag(e, _n, r.any), e.isError(a)) return a;
        } else {
          var _n2 = e.save();

          try {
            null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t), a = !0;
          } catch (e) {
            a = !1;
          }

          e.restore(_n2);
        }
      }

      if (r.obj && a && (n = e.enterObject()), a) {
        if (null !== r.explicit) {
          var _t2 = this._decodeTag(e, r.explicit);

          if (e.isError(_t2)) return _t2;
          e = _t2;
        }

        var _n3 = e.offset;

        if (null === r.use && null === r.choice) {
          var _t3;

          r.any && (_t3 = e.save());

          var _n4 = this._decodeTag(e, null !== r.implicit ? r.implicit : r.tag, r.any);

          if (e.isError(_n4)) return _n4;
          r.any ? i = e.raw(_t3) : e = _n4;
        }

        if (t && t.track && null !== r.tag && t.track(e.path(), _n3, e.length, "tagged"), t && t.track && null !== r.tag && t.track(e.path(), e.offset, e.length, "content"), r.any || (i = null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t)), e.isError(i)) return i;

        if (r.any || null !== r.choice || null === r.children || r.children.forEach(function (r) {
          r._decode(e, t);
        }), r.contains && ("octstr" === r.tag || "bitstr" === r.tag)) {
          var _n5 = new o(i);

          i = this._getUse(r.contains, e._reporterState.obj)._decode(_n5, t);
        }
      }

      return r.obj && a && (i = e.leaveObject(n)), null === r.key || null === i && !0 !== a ? null !== s && e.exitKey(s) : e.leaveKey(s, r.key, i), i;
    }, u.prototype._decodeGeneric = function (e, t, r) {
      var n = this._baseState;
      return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, n.args[0], r) : /str$/.test(e) ? this._decodeStr(t, e, r) : "objid" === e && n.args ? this._decodeObjid(t, n.args[0], n.args[1], r) : "objid" === e ? this._decodeObjid(t, null, null, r) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, r) : "null_" === e ? this._decodeNull(t, r) : "bool" === e ? this._decodeBool(t, r) : "objDesc" === e ? this._decodeStr(t, e, r) : "int" === e || "enum" === e ? this._decodeInt(t, n.args && n.args[0], r) : null !== n.use ? this._getUse(n.use, t._reporterState.obj)._decode(t, r) : t.error("unknown tag: " + e);
    }, u.prototype._getUse = function (e, t) {
      var r = this._baseState;
      return r.useDecoder = this._use(e, t), a(null === r.useDecoder._baseState.parent), r.useDecoder = r.useDecoder._baseState.children[0], r.implicit !== r.useDecoder._baseState.implicit && (r.useDecoder = r.useDecoder.clone(), r.useDecoder._baseState.implicit = r.implicit), r.useDecoder;
    }, u.prototype._decodeChoice = function (e, t) {
      var r = this._baseState;
      var n = null,
          i = !1;
      return Object.keys(r.choice).some(function (o) {
        var a = e.save(),
            s = r.choice[o];

        try {
          var _r2 = s._decode(e, t);

          if (e.isError(_r2)) return !1;
          n = {
            type: o,
            value: _r2
          }, i = !0;
        } catch (t) {
          return e.restore(a), !1;
        }

        return !0;
      }, this), i ? n : e.error("Choice not matched");
    }, u.prototype._createEncoderBuffer = function (e) {
      return new i(e, this.reporter);
    }, u.prototype._encode = function (e, t, r) {
      var n = this._baseState;
      if (null !== n["default"] && n["default"] === e) return;

      var i = this._encodeValue(e, t, r);

      return void 0 === i || this._skipDefault(i, t, r) ? void 0 : i;
    }, u.prototype._encodeValue = function (e, t, r) {
      var i = this._baseState;
      if (null === i.parent) return i.children[0]._encode(e, t || new n());
      var o = null;

      if (this.reporter = t, i.optional && void 0 === e) {
        if (null === i["default"]) return;
        e = i["default"];
      }

      var a = null,
          s = !1;
      if (i.any) o = this._createEncoderBuffer(e);else if (i.choice) o = this._encodeChoice(e, t);else if (i.contains) a = this._getUse(i.contains, r)._encode(e, t), s = !0;else if (i.children) a = i.children.map(function (r) {
        if ("null_" === r._baseState.tag) return r._encode(null, t, e);
        if (null === r._baseState.key) return t.error("Child should have a key");
        var n = t.enterKey(r._baseState.key);
        if ("object" != _typeof(e)) return t.error("Child expected, but input is not object");

        var i = r._encode(e[r._baseState.key], t, e);

        return t.leaveKey(n), i;
      }, this).filter(function (e) {
        return e;
      }), a = this._createEncoderBuffer(a);else if ("seqof" === i.tag || "setof" === i.tag) {
        if (!i.args || 1 !== i.args.length) return t.error("Too many args for : " + i.tag);
        if (!Array.isArray(e)) return t.error("seqof/setof, but data is not Array");

        var _r3 = this.clone();

        _r3._baseState.implicit = null, a = this._createEncoderBuffer(e.map(function (r) {
          var n = this._baseState;
          return this._getUse(n.args[0], e)._encode(r, t);
        }, _r3));
      } else null !== i.use ? o = this._getUse(i.use, r)._encode(e, t) : (a = this._encodePrimitive(i.tag, e), s = !0);

      if (!i.any && null === i.choice) {
        var _e2 = null !== i.implicit ? i.implicit : i.tag,
            _r4 = null === i.implicit ? "universal" : "context";

        null === _e2 ? null === i.use && t.error("Tag could be omitted only for .use()") : null === i.use && (o = this._encodeComposite(_e2, s, _r4, a));
      }

      return null !== i.explicit && (o = this._encodeComposite(i.explicit, !1, "context", o)), o;
    }, u.prototype._encodeChoice = function (e, t) {
      var r = this._baseState,
          n = r.choice[e.type];
      return n || a(!1, e.type + " not found in " + JSON.stringify(Object.keys(r.choice))), n._encode(e.value, t);
    }, u.prototype._encodePrimitive = function (e, t) {
      var r = this._baseState;
      if (/str$/.test(e)) return this._encodeStr(t, e);
      if ("objid" === e && r.args) return this._encodeObjid(t, r.reverseArgs[0], r.args[1]);
      if ("objid" === e) return this._encodeObjid(t, null, null);
      if ("gentime" === e || "utctime" === e) return this._encodeTime(t, e);
      if ("null_" === e) return this._encodeNull();
      if ("int" === e || "enum" === e) return this._encodeInt(t, r.args && r.reverseArgs[0]);
      if ("bool" === e) return this._encodeBool(t);
      if ("objDesc" === e) return this._encodeStr(t, e);
      throw new Error("Unsupported tag: " + e);
    }, u.prototype._isNumstr = function (e) {
      return /^[0-9 ]*$/.test(e);
    }, u.prototype._isPrintstr = function (e) {
      return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(e);
    };
  }, {
    "../base/buffer": 3,
    "../base/reporter": 6,
    "minimalistic-assert": 141
  }],
  6: [function (e, t, r) {
    "use strict";

    var n = e("inherits");

    function i(e) {
      this._reporterState = {
        obj: null,
        path: [],
        options: e || {},
        errors: []
      };
    }

    function o(e, t) {
      this.path = e, this.rethrow(t);
    }

    r.Reporter = i, i.prototype.isError = function (e) {
      return e instanceof o;
    }, i.prototype.save = function () {
      var e = this._reporterState;
      return {
        obj: e.obj,
        pathLen: e.path.length
      };
    }, i.prototype.restore = function (e) {
      var t = this._reporterState;
      t.obj = e.obj, t.path = t.path.slice(0, e.pathLen);
    }, i.prototype.enterKey = function (e) {
      return this._reporterState.path.push(e);
    }, i.prototype.exitKey = function (e) {
      var t = this._reporterState;
      t.path = t.path.slice(0, e - 1);
    }, i.prototype.leaveKey = function (e, t, r) {
      var n = this._reporterState;
      this.exitKey(e), null !== n.obj && (n.obj[t] = r);
    }, i.prototype.path = function () {
      return this._reporterState.path.join("/");
    }, i.prototype.enterObject = function () {
      var e = this._reporterState,
          t = e.obj;
      return e.obj = {}, t;
    }, i.prototype.leaveObject = function (e) {
      var t = this._reporterState,
          r = t.obj;
      return t.obj = e, r;
    }, i.prototype.error = function (e) {
      var t;
      var r = this._reporterState,
          n = e instanceof o;
      if (t = n ? e : new o(r.path.map(function (e) {
        return "[" + JSON.stringify(e) + "]";
      }).join(""), e.message || e, e.stack), !r.options.partial) throw t;
      return n || r.errors.push(t), t;
    }, i.prototype.wrapResult = function (e) {
      var t = this._reporterState;
      return t.options.partial ? {
        result: this.isError(e) ? null : e,
        errors: t.errors
      } : e;
    }, n(o, Error), o.prototype.rethrow = function (e) {
      if (this.message = e + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, o), !this.stack) try {
        throw new Error(this.message);
      } catch (e) {
        this.stack = e.stack;
      }
      return this;
    };
  }, {
    inherits: 135
  }],
  7: [function (e, t, r) {
    "use strict";

    function n(e) {
      var t = {};
      return Object.keys(e).forEach(function (r) {
        (0 | r) == r && (r |= 0);
        var n = e[r];
        t[n] = r;
      }), t;
    }

    r.tagClass = {
      0: "universal",
      1: "application",
      2: "context",
      3: "private"
    }, r.tagClassByName = n(r.tagClass), r.tag = {
      0: "end",
      1: "bool",
      2: "int",
      3: "bitstr",
      4: "octstr",
      5: "null_",
      6: "objid",
      7: "objDesc",
      8: "external",
      9: "real",
      10: "enum",
      11: "embed",
      12: "utf8str",
      13: "relativeOid",
      16: "seq",
      17: "set",
      18: "numstr",
      19: "printstr",
      20: "t61str",
      21: "videostr",
      22: "ia5str",
      23: "utctime",
      24: "gentime",
      25: "graphstr",
      26: "iso646str",
      27: "genstr",
      28: "unistr",
      29: "charstr",
      30: "bmpstr"
    }, r.tagByName = n(r.tag);
  }, {}],
  8: [function (e, t, r) {
    "use strict";

    var n = r;
    n._reverse = function (e) {
      var t = {};
      return Object.keys(e).forEach(function (r) {
        (0 | r) == r && (r |= 0);
        var n = e[r];
        t[n] = r;
      }), t;
    }, n.der = e("./der");
  }, {
    "./der": 7
  }],
  9: [function (e, t, r) {
    "use strict";

    var n = e("inherits"),
        i = e("bn.js"),
        o = e("../base/buffer").DecoderBuffer,
        a = e("../base/node"),
        s = e("../constants/der");

    function f(e) {
      this.enc = "der", this.name = e.name, this.entity = e, this.tree = new u(), this.tree._init(e.body);
    }

    function u(e) {
      a.call(this, "der", e);
    }

    function c(e, t) {
      var r = e.readUInt8(t);
      if (e.isError(r)) return r;
      var n = s.tagClass[r >> 6],
          i = 0 == (32 & r);

      if (31 == (31 & r)) {
        var _n6 = r;

        for (r = 0; 128 == (128 & _n6);) {
          if (_n6 = e.readUInt8(t), e.isError(_n6)) return _n6;
          r <<= 7, r |= 127 & _n6;
        }
      } else r &= 31;

      return {
        cls: n,
        primitive: i,
        tag: r,
        tagStr: s.tag[r]
      };
    }

    function h(e, t, r) {
      var n = e.readUInt8(r);
      if (e.isError(n)) return n;
      if (!t && 128 === n) return null;
      if (0 == (128 & n)) return n;
      var i = 127 & n;
      if (i > 4) return e.error("length octect is too long");
      n = 0;

      for (var _t4 = 0; _t4 < i; _t4++) {
        n <<= 8;

        var _t5 = e.readUInt8(r);

        if (e.isError(_t5)) return _t5;
        n |= _t5;
      }

      return n;
    }

    t.exports = f, f.prototype.decode = function (e, t) {
      return o.isDecoderBuffer(e) || (e = new o(e, t)), this.tree._decode(e, t);
    }, n(u, a), u.prototype._peekTag = function (e, t, r) {
      if (e.isEmpty()) return !1;
      var n = e.save(),
          i = c(e, 'Failed to peek tag: "' + t + '"');
      return e.isError(i) ? i : (e.restore(n), i.tag === t || i.tagStr === t || i.tagStr + "of" === t || r);
    }, u.prototype._decodeTag = function (e, t, r) {
      var n = c(e, 'Failed to decode tag of "' + t + '"');
      if (e.isError(n)) return n;
      var i = h(e, n.primitive, 'Failed to get length of "' + t + '"');
      if (e.isError(i)) return i;
      if (!r && n.tag !== t && n.tagStr !== t && n.tagStr + "of" !== t) return e.error('Failed to match tag: "' + t + '"');
      if (n.primitive || null !== i) return e.skip(i, 'Failed to match body of: "' + t + '"');

      var o = e.save(),
          a = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"');

      return e.isError(a) ? a : (i = e.offset - o.offset, e.restore(o), e.skip(i, 'Failed to match body of: "' + t + '"'));
    }, u.prototype._skipUntilEnd = function (e, t) {
      for (;;) {
        var _r5 = c(e, t);

        if (e.isError(_r5)) return _r5;

        var _n7 = h(e, _r5.primitive, t);

        if (e.isError(_n7)) return _n7;

        var _i = void 0;

        if (_i = _r5.primitive || null !== _n7 ? e.skip(_n7) : this._skipUntilEnd(e, t), e.isError(_i)) return _i;
        if ("end" === _r5.tagStr) break;
      }
    }, u.prototype._decodeList = function (e, t, r, n) {
      var i = [];

      for (; !e.isEmpty();) {
        var _t6 = this._peekTag(e, "end");

        if (e.isError(_t6)) return _t6;

        var _o = r.decode(e, "der", n);

        if (e.isError(_o) && _t6) break;
        i.push(_o);
      }

      return i;
    }, u.prototype._decodeStr = function (e, t) {
      if ("bitstr" === t) {
        var _t7 = e.readUInt8();

        return e.isError(_t7) ? _t7 : {
          unused: _t7,
          data: e.raw()
        };
      }

      if ("bmpstr" === t) {
        var _t8 = e.raw();

        if (_t8.length % 2 == 1) return e.error("Decoding of string type: bmpstr length mismatch");
        var _r6 = "";

        for (var _e3 = 0; _e3 < _t8.length / 2; _e3++) {
          _r6 += String.fromCharCode(_t8.readUInt16BE(2 * _e3));
        }

        return _r6;
      }

      if ("numstr" === t) {
        var _t9 = e.raw().toString("ascii");

        return this._isNumstr(_t9) ? _t9 : e.error("Decoding of string type: numstr unsupported characters");
      }

      if ("octstr" === t) return e.raw();
      if ("objDesc" === t) return e.raw();

      if ("printstr" === t) {
        var _t10 = e.raw().toString("ascii");

        return this._isPrintstr(_t10) ? _t10 : e.error("Decoding of string type: printstr unsupported characters");
      }

      return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported");
    }, u.prototype._decodeObjid = function (e, t, r) {
      var n;
      var i = [];
      var o = 0,
          a = 0;

      for (; !e.isEmpty();) {
        a = e.readUInt8(), o <<= 7, o |= 127 & a, 0 == (128 & a) && (i.push(o), o = 0);
      }

      128 & a && i.push(o);
      var s = i[0] / 40 | 0,
          f = i[0] % 40;

      if (n = r ? i : [s, f].concat(i.slice(1)), t) {
        var _e4 = t[n.join(" ")];
        void 0 === _e4 && (_e4 = t[n.join(".")]), void 0 !== _e4 && (n = _e4);
      }

      return n;
    }, u.prototype._decodeTime = function (e, t) {
      var r = e.raw().toString();
      var n, i, o, a, s, f;
      if ("gentime" === t) n = 0 | r.slice(0, 4), i = 0 | r.slice(4, 6), o = 0 | r.slice(6, 8), a = 0 | r.slice(8, 10), s = 0 | r.slice(10, 12), f = 0 | r.slice(12, 14);else {
        if ("utctime" !== t) return e.error("Decoding " + t + " time is not supported yet");
        n = 0 | r.slice(0, 2), i = 0 | r.slice(2, 4), o = 0 | r.slice(4, 6), a = 0 | r.slice(6, 8), s = 0 | r.slice(8, 10), f = 0 | r.slice(10, 12), n = n < 70 ? 2e3 + n : 1900 + n;
      }
      return Date.UTC(n, i - 1, o, a, s, f, 0);
    }, u.prototype._decodeNull = function () {
      return null;
    }, u.prototype._decodeBool = function (e) {
      var t = e.readUInt8();
      return e.isError(t) ? t : 0 !== t;
    }, u.prototype._decodeInt = function (e, t) {
      var r = e.raw();
      var n = new i(r);
      return t && (n = t[n.toString(10)] || n), n;
    }, u.prototype._use = function (e, t) {
      return "function" == typeof e && (e = e(t)), e._getDecoder("der").tree;
    };
  }, {
    "../base/buffer": 3,
    "../base/node": 5,
    "../constants/der": 7,
    "bn.js": 15,
    inherits: 135
  }],
  10: [function (e, t, r) {
    "use strict";

    var n = r;
    n.der = e("./der"), n.pem = e("./pem");
  }, {
    "./der": 9,
    "./pem": 11
  }],
  11: [function (e, t, r) {
    "use strict";

    var n = e("inherits"),
        i = e("safer-buffer").Buffer,
        o = e("./der");

    function a(e) {
      o.call(this, e), this.enc = "pem";
    }

    n(a, o), t.exports = a, a.prototype.decode = function (e, t) {
      var r = e.toString().split(/[\r\n]+/g),
          n = t.label.toUpperCase(),
          a = /^-----(BEGIN|END) ([^-]+)-----$/;
      var s = -1,
          f = -1;

      for (var _e5 = 0; _e5 < r.length; _e5++) {
        var _t11 = r[_e5].match(a);

        if (null !== _t11 && _t11[2] === n) {
          if (-1 !== s) {
            if ("END" !== _t11[1]) break;
            f = _e5;
            break;
          }

          if ("BEGIN" !== _t11[1]) break;
          s = _e5;
        }
      }

      if (-1 === s || -1 === f) throw new Error("PEM section not found for: " + n);
      var u = r.slice(s + 1, f).join("");
      u.replace(/[^a-z0-9+/=]+/gi, "");
      var c = i.from(u, "base64");
      return o.prototype.decode.call(this, c, t);
    };
  }, {
    "./der": 9,
    inherits: 135,
    "safer-buffer": 183
  }],
  12: [function (e, t, r) {
    "use strict";

    var n = e("inherits"),
        i = e("safer-buffer").Buffer,
        o = e("../base/node"),
        a = e("../constants/der");

    function s(e) {
      this.enc = "der", this.name = e.name, this.entity = e, this.tree = new f(), this.tree._init(e.body);
    }

    function f(e) {
      o.call(this, "der", e);
    }

    function u(e) {
      return e < 10 ? "0" + e : e;
    }

    t.exports = s, s.prototype.encode = function (e, t) {
      return this.tree._encode(e, t).join();
    }, n(f, o), f.prototype._encodeComposite = function (e, t, r, n) {
      var o = function (e, t, r, n) {
        var i;
        "seqof" === e ? e = "seq" : "setof" === e && (e = "set");
        if (a.tagByName.hasOwnProperty(e)) i = a.tagByName[e];else {
          if ("number" != typeof e || (0 | e) !== e) return n.error("Unknown tag: " + e);
          i = e;
        }
        if (i >= 31) return n.error("Multi-octet tag encoding unsupported");
        t || (i |= 32);
        return i |= a.tagClassByName[r || "universal"] << 6, i;
      }(e, t, r, this.reporter);

      if (n.length < 128) {
        var _e6 = i.alloc(2);

        return _e6[0] = o, _e6[1] = n.length, this._createEncoderBuffer([_e6, n]);
      }

      var s = 1;

      for (var _e7 = n.length; _e7 >= 256; _e7 >>= 8) {
        s++;
      }

      var f = i.alloc(2 + s);
      f[0] = o, f[1] = 128 | s;

      for (var _e8 = 1 + s, _t12 = n.length; _t12 > 0; _e8--, _t12 >>= 8) {
        f[_e8] = 255 & _t12;
      }

      return this._createEncoderBuffer([f, n]);
    }, f.prototype._encodeStr = function (e, t) {
      if ("bitstr" === t) return this._createEncoderBuffer([0 | e.unused, e.data]);

      if ("bmpstr" === t) {
        var _t13 = i.alloc(2 * e.length);

        for (var _r7 = 0; _r7 < e.length; _r7++) {
          _t13.writeUInt16BE(e.charCodeAt(_r7), 2 * _r7);
        }

        return this._createEncoderBuffer(_t13);
      }

      return "numstr" === t ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === t ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(t) || "objDesc" === t ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + t + " unsupported");
    }, f.prototype._encodeObjid = function (e, t, r) {
      if ("string" == typeof e) {
        if (!t) return this.reporter.error("string objid given, but no values map found");
        if (!t.hasOwnProperty(e)) return this.reporter.error("objid not found in values map");
        e = t[e].split(/[\s.]+/g);

        for (var _t14 = 0; _t14 < e.length; _t14++) {
          e[_t14] |= 0;
        }
      } else if (Array.isArray(e)) {
        e = e.slice();

        for (var _t15 = 0; _t15 < e.length; _t15++) {
          e[_t15] |= 0;
        }
      }

      if (!Array.isArray(e)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));

      if (!r) {
        if (e[1] >= 40) return this.reporter.error("Second objid identifier OOB");
        e.splice(0, 2, 40 * e[0] + e[1]);
      }

      var n = 0;

      for (var _t16 = 0; _t16 < e.length; _t16++) {
        var _r8 = e[_t16];

        for (n++; _r8 >= 128; _r8 >>= 7) {
          n++;
        }
      }

      var o = i.alloc(n);
      var a = o.length - 1;

      for (var _t17 = e.length - 1; _t17 >= 0; _t17--) {
        var _r9 = e[_t17];

        for (o[a--] = 127 & _r9; (_r9 >>= 7) > 0;) {
          o[a--] = 128 | 127 & _r9;
        }
      }

      return this._createEncoderBuffer(o);
    }, f.prototype._encodeTime = function (e, t) {
      var r;
      var n = new Date(e);
      return "gentime" === t ? r = [u(n.getUTCFullYear()), u(n.getUTCMonth() + 1), u(n.getUTCDate()), u(n.getUTCHours()), u(n.getUTCMinutes()), u(n.getUTCSeconds()), "Z"].join("") : "utctime" === t ? r = [u(n.getUTCFullYear() % 100), u(n.getUTCMonth() + 1), u(n.getUTCDate()), u(n.getUTCHours()), u(n.getUTCMinutes()), u(n.getUTCSeconds()), "Z"].join("") : this.reporter.error("Encoding " + t + " time is not supported yet"), this._encodeStr(r, "octstr");
    }, f.prototype._encodeNull = function () {
      return this._createEncoderBuffer("");
    }, f.prototype._encodeInt = function (e, t) {
      if ("string" == typeof e) {
        if (!t) return this.reporter.error("String int or enum given, but no values map");
        if (!t.hasOwnProperty(e)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
        e = t[e];
      }

      if ("number" != typeof e && !i.isBuffer(e)) {
        var _t18 = e.toArray();

        !e.sign && 128 & _t18[0] && _t18.unshift(0), e = i.from(_t18);
      }

      if (i.isBuffer(e)) {
        var _t19 = e.length;
        0 === e.length && _t19++;

        var _r10 = i.alloc(_t19);

        return e.copy(_r10), 0 === e.length && (_r10[0] = 0), this._createEncoderBuffer(_r10);
      }

      if (e < 128) return this._createEncoderBuffer(e);
      if (e < 256) return this._createEncoderBuffer([0, e]);
      var r = 1;

      for (var _t20 = e; _t20 >= 256; _t20 >>= 8) {
        r++;
      }

      var n = new Array(r);

      for (var _t21 = n.length - 1; _t21 >= 0; _t21--) {
        n[_t21] = 255 & e, e >>= 8;
      }

      return 128 & n[0] && n.unshift(0), this._createEncoderBuffer(i.from(n));
    }, f.prototype._encodeBool = function (e) {
      return this._createEncoderBuffer(e ? 255 : 0);
    }, f.prototype._use = function (e, t) {
      return "function" == typeof e && (e = e(t)), e._getEncoder("der").tree;
    }, f.prototype._skipDefault = function (e, t, r) {
      var n = this._baseState;
      var i;
      if (null === n["default"]) return !1;
      var o = e.join();
      if (void 0 === n.defaultBuffer && (n.defaultBuffer = this._encodeValue(n["default"], t, r).join()), o.length !== n.defaultBuffer.length) return !1;

      for (i = 0; i < o.length; i++) {
        if (o[i] !== n.defaultBuffer[i]) return !1;
      }

      return !0;
    };
  }, {
    "../base/node": 5,
    "../constants/der": 7,
    inherits: 135,
    "safer-buffer": 183
  }],
  13: [function (e, t, r) {
    "use strict";

    var n = r;
    n.der = e("./der"), n.pem = e("./pem");
  }, {
    "./der": 12,
    "./pem": 14
  }],
  14: [function (e, t, r) {
    "use strict";

    var n = e("inherits"),
        i = e("./der");

    function o(e) {
      i.call(this, e), this.enc = "pem";
    }

    n(o, i), t.exports = o, o.prototype.encode = function (e, t) {
      var r = i.prototype.encode.call(this, e).toString("base64"),
          n = ["-----BEGIN " + t.label + "-----"];

      for (var _e9 = 0; _e9 < r.length; _e9 += 64) {
        n.push(r.slice(_e9, _e9 + 64));
      }

      return n.push("-----END " + t.label + "-----"), n.join("\n");
    };
  }, {
    "./der": 12,
    inherits: 135
  }],
  15: [function (e, t, r) {
    !function (t, r) {
      "use strict";

      function n(e, t) {
        if (!e) throw new Error(t || "Assertion failed");
      }

      function i(e, t) {
        e.super_ = t;

        var r = function r() {};

        r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
      }

      function o(e, t, r) {
        if (o.isBN(e)) return e;
        this.negative = 0, this.words = null, this.length = 0, this.red = null, null !== e && ("le" !== t && "be" !== t || (r = t, t = 10), this._init(e || 0, t || 10, r || "be"));
      }

      var a;
      "object" == _typeof(t) ? t.exports = o : r.BN = o, o.BN = o, o.wordSize = 26;

      try {
        a = e("buffer").Buffer;
      } catch (e) {}

      function s(e, t, r) {
        for (var n = 0, i = Math.min(e.length, r), o = t; o < i; o++) {
          var a = e.charCodeAt(o) - 48;
          n <<= 4, n |= a >= 49 && a <= 54 ? a - 49 + 10 : a >= 17 && a <= 22 ? a - 17 + 10 : 15 & a;
        }

        return n;
      }

      function f(e, t, r, n) {
        for (var i = 0, o = Math.min(e.length, r), a = t; a < o; a++) {
          var s = e.charCodeAt(a) - 48;
          i *= n, i += s >= 49 ? s - 49 + 10 : s >= 17 ? s - 17 + 10 : s;
        }

        return i;
      }

      o.isBN = function (e) {
        return e instanceof o || null !== e && "object" == _typeof(e) && e.constructor.wordSize === o.wordSize && Array.isArray(e.words);
      }, o.max = function (e, t) {
        return e.cmp(t) > 0 ? e : t;
      }, o.min = function (e, t) {
        return e.cmp(t) < 0 ? e : t;
      }, o.prototype._init = function (e, t, r) {
        if ("number" == typeof e) return this._initNumber(e, t, r);
        if ("object" == _typeof(e)) return this._initArray(e, t, r);
        "hex" === t && (t = 16), n(t === (0 | t) && t >= 2 && t <= 36);
        var i = 0;
        "-" === (e = e.toString().replace(/\s+/g, ""))[0] && i++, 16 === t ? this._parseHex(e, i) : this._parseBase(e, t, i), "-" === e[0] && (this.negative = 1), this.strip(), "le" === r && this._initArray(this.toArray(), t, r);
      }, o.prototype._initNumber = function (e, t, r) {
        e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [67108863 & e], this.length = 1) : e < 4503599627370496 ? (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2) : (n(e < 9007199254740992), this.words = [67108863 & e, e / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), t, r);
      }, o.prototype._initArray = function (e, t, r) {
        if (n("number" == typeof e.length), e.length <= 0) return this.words = [0], this.length = 1, this;
        this.length = Math.ceil(e.length / 3), this.words = new Array(this.length);

        for (var i = 0; i < this.length; i++) {
          this.words[i] = 0;
        }

        var o,
            a,
            s = 0;
        if ("be" === r) for (i = e.length - 1, o = 0; i >= 0; i -= 3) {
          a = e[i] | e[i - 1] << 8 | e[i - 2] << 16, this.words[o] |= a << s & 67108863, this.words[o + 1] = a >>> 26 - s & 67108863, (s += 24) >= 26 && (s -= 26, o++);
        } else if ("le" === r) for (i = 0, o = 0; i < e.length; i += 3) {
          a = e[i] | e[i + 1] << 8 | e[i + 2] << 16, this.words[o] |= a << s & 67108863, this.words[o + 1] = a >>> 26 - s & 67108863, (s += 24) >= 26 && (s -= 26, o++);
        }
        return this.strip();
      }, o.prototype._parseHex = function (e, t) {
        this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length);

        for (var r = 0; r < this.length; r++) {
          this.words[r] = 0;
        }

        var n,
            i,
            o = 0;

        for (r = e.length - 6, n = 0; r >= t; r -= 6) {
          i = s(e, r, r + 6), this.words[n] |= i << o & 67108863, this.words[n + 1] |= i >>> 26 - o & 4194303, (o += 24) >= 26 && (o -= 26, n++);
        }

        r + 6 !== t && (i = s(e, t, r + 6), this.words[n] |= i << o & 67108863, this.words[n + 1] |= i >>> 26 - o & 4194303), this.strip();
      }, o.prototype._parseBase = function (e, t, r) {
        this.words = [0], this.length = 1;

        for (var n = 0, i = 1; i <= 67108863; i *= t) {
          n++;
        }

        n--, i = i / t | 0;

        for (var o = e.length - r, a = o % n, s = Math.min(o, o - a) + r, u = 0, c = r; c < s; c += n) {
          u = f(e, c, c + n, t), this.imuln(i), this.words[0] + u < 67108864 ? this.words[0] += u : this._iaddn(u);
        }

        if (0 !== a) {
          var h = 1;

          for (u = f(e, c, e.length, t), c = 0; c < a; c++) {
            h *= t;
          }

          this.imuln(h), this.words[0] + u < 67108864 ? this.words[0] += u : this._iaddn(u);
        }
      }, o.prototype.copy = function (e) {
        e.words = new Array(this.length);

        for (var t = 0; t < this.length; t++) {
          e.words[t] = this.words[t];
        }

        e.length = this.length, e.negative = this.negative, e.red = this.red;
      }, o.prototype.clone = function () {
        var e = new o(null);
        return this.copy(e), e;
      }, o.prototype._expand = function (e) {
        for (; this.length < e;) {
          this.words[this.length++] = 0;
        }

        return this;
      }, o.prototype.strip = function () {
        for (; this.length > 1 && 0 === this.words[this.length - 1];) {
          this.length--;
        }

        return this._normSign();
      }, o.prototype._normSign = function () {
        return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this;
      }, o.prototype.inspect = function () {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      };
      var u = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],
          c = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          h = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];

      function d(e, t, r) {
        r.negative = t.negative ^ e.negative;
        var n = e.length + t.length | 0;
        r.length = n, n = n - 1 | 0;
        var i = 0 | e.words[0],
            o = 0 | t.words[0],
            a = i * o,
            s = 67108863 & a,
            f = a / 67108864 | 0;
        r.words[0] = s;

        for (var u = 1; u < n; u++) {
          for (var c = f >>> 26, h = 67108863 & f, d = Math.min(u, t.length - 1), l = Math.max(0, u - e.length + 1); l <= d; l++) {
            var p = u - l | 0;
            c += (a = (i = 0 | e.words[p]) * (o = 0 | t.words[l]) + h) / 67108864 | 0, h = 67108863 & a;
          }

          r.words[u] = 0 | h, f = 0 | c;
        }

        return 0 !== f ? r.words[u] = 0 | f : r.length--, r.strip();
      }

      o.prototype.toString = function (e, t) {
        var r;

        if (t = 0 | t || 1, 16 === (e = e || 10) || "hex" === e) {
          r = "";

          for (var i = 0, o = 0, a = 0; a < this.length; a++) {
            var s = this.words[a],
                f = (16777215 & (s << i | o)).toString(16);
            r = 0 !== (o = s >>> 24 - i & 16777215) || a !== this.length - 1 ? u[6 - f.length] + f + r : f + r, (i += 2) >= 26 && (i -= 26, a--);
          }

          for (0 !== o && (r = o.toString(16) + r); r.length % t != 0;) {
            r = "0" + r;
          }

          return 0 !== this.negative && (r = "-" + r), r;
        }

        if (e === (0 | e) && e >= 2 && e <= 36) {
          var d = c[e],
              l = h[e];
          r = "";
          var p = this.clone();

          for (p.negative = 0; !p.isZero();) {
            var b = p.modn(l).toString(e);
            r = (p = p.idivn(l)).isZero() ? b + r : u[d - b.length] + b + r;
          }

          for (this.isZero() && (r = "0" + r); r.length % t != 0;) {
            r = "0" + r;
          }

          return 0 !== this.negative && (r = "-" + r), r;
        }

        n(!1, "Base should be between 2 and 36");
      }, o.prototype.toNumber = function () {
        var e = this.words[0];
        return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && n(!1, "Number can only safely store up to 53 bits"), 0 !== this.negative ? -e : e;
      }, o.prototype.toJSON = function () {
        return this.toString(16);
      }, o.prototype.toBuffer = function (e, t) {
        return n(void 0 !== a), this.toArrayLike(a, e, t);
      }, o.prototype.toArray = function (e, t) {
        return this.toArrayLike(Array, e, t);
      }, o.prototype.toArrayLike = function (e, t, r) {
        var i = this.byteLength(),
            o = r || Math.max(1, i);
        n(i <= o, "byte array longer than desired length"), n(o > 0, "Requested array length <= 0"), this.strip();
        var a,
            s,
            f = "le" === t,
            u = new e(o),
            c = this.clone();

        if (f) {
          for (s = 0; !c.isZero(); s++) {
            a = c.andln(255), c.iushrn(8), u[s] = a;
          }

          for (; s < o; s++) {
            u[s] = 0;
          }
        } else {
          for (s = 0; s < o - i; s++) {
            u[s] = 0;
          }

          for (s = 0; !c.isZero(); s++) {
            a = c.andln(255), c.iushrn(8), u[o - s - 1] = a;
          }
        }

        return u;
      }, Math.clz32 ? o.prototype._countBits = function (e) {
        return 32 - Math.clz32(e);
      } : o.prototype._countBits = function (e) {
        var t = e,
            r = 0;
        return t >= 4096 && (r += 13, t >>>= 13), t >= 64 && (r += 7, t >>>= 7), t >= 8 && (r += 4, t >>>= 4), t >= 2 && (r += 2, t >>>= 2), r + t;
      }, o.prototype._zeroBits = function (e) {
        if (0 === e) return 26;
        var t = e,
            r = 0;
        return 0 == (8191 & t) && (r += 13, t >>>= 13), 0 == (127 & t) && (r += 7, t >>>= 7), 0 == (15 & t) && (r += 4, t >>>= 4), 0 == (3 & t) && (r += 2, t >>>= 2), 0 == (1 & t) && r++, r;
      }, o.prototype.bitLength = function () {
        var e = this.words[this.length - 1],
            t = this._countBits(e);

        return 26 * (this.length - 1) + t;
      }, o.prototype.zeroBits = function () {
        if (this.isZero()) return 0;

        for (var e = 0, t = 0; t < this.length; t++) {
          var r = this._zeroBits(this.words[t]);

          if (e += r, 26 !== r) break;
        }

        return e;
      }, o.prototype.byteLength = function () {
        return Math.ceil(this.bitLength() / 8);
      }, o.prototype.toTwos = function (e) {
        return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone();
      }, o.prototype.fromTwos = function (e) {
        return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone();
      }, o.prototype.isNeg = function () {
        return 0 !== this.negative;
      }, o.prototype.neg = function () {
        return this.clone().ineg();
      }, o.prototype.ineg = function () {
        return this.isZero() || (this.negative ^= 1), this;
      }, o.prototype.iuor = function (e) {
        for (; this.length < e.length;) {
          this.words[this.length++] = 0;
        }

        for (var t = 0; t < e.length; t++) {
          this.words[t] = this.words[t] | e.words[t];
        }

        return this.strip();
      }, o.prototype.ior = function (e) {
        return n(0 == (this.negative | e.negative)), this.iuor(e);
      }, o.prototype.or = function (e) {
        return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this);
      }, o.prototype.uor = function (e) {
        return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this);
      }, o.prototype.iuand = function (e) {
        var t;
        t = this.length > e.length ? e : this;

        for (var r = 0; r < t.length; r++) {
          this.words[r] = this.words[r] & e.words[r];
        }

        return this.length = t.length, this.strip();
      }, o.prototype.iand = function (e) {
        return n(0 == (this.negative | e.negative)), this.iuand(e);
      }, o.prototype.and = function (e) {
        return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this);
      }, o.prototype.uand = function (e) {
        return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this);
      }, o.prototype.iuxor = function (e) {
        var t, r;
        this.length > e.length ? (t = this, r = e) : (t = e, r = this);

        for (var n = 0; n < r.length; n++) {
          this.words[n] = t.words[n] ^ r.words[n];
        }

        if (this !== t) for (; n < t.length; n++) {
          this.words[n] = t.words[n];
        }
        return this.length = t.length, this.strip();
      }, o.prototype.ixor = function (e) {
        return n(0 == (this.negative | e.negative)), this.iuxor(e);
      }, o.prototype.xor = function (e) {
        return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this);
      }, o.prototype.uxor = function (e) {
        return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this);
      }, o.prototype.inotn = function (e) {
        n("number" == typeof e && e >= 0);
        var t = 0 | Math.ceil(e / 26),
            r = e % 26;
        this._expand(t), r > 0 && t--;

        for (var i = 0; i < t; i++) {
          this.words[i] = 67108863 & ~this.words[i];
        }

        return r > 0 && (this.words[i] = ~this.words[i] & 67108863 >> 26 - r), this.strip();
      }, o.prototype.notn = function (e) {
        return this.clone().inotn(e);
      }, o.prototype.setn = function (e, t) {
        n("number" == typeof e && e >= 0);
        var r = e / 26 | 0,
            i = e % 26;
        return this._expand(r + 1), this.words[r] = t ? this.words[r] | 1 << i : this.words[r] & ~(1 << i), this.strip();
      }, o.prototype.iadd = function (e) {
        var t, r, n;
        if (0 !== this.negative && 0 === e.negative) return this.negative = 0, t = this.isub(e), this.negative ^= 1, this._normSign();
        if (0 === this.negative && 0 !== e.negative) return e.negative = 0, t = this.isub(e), e.negative = 1, t._normSign();
        this.length > e.length ? (r = this, n = e) : (r = e, n = this);

        for (var i = 0, o = 0; o < n.length; o++) {
          t = (0 | r.words[o]) + (0 | n.words[o]) + i, this.words[o] = 67108863 & t, i = t >>> 26;
        }

        for (; 0 !== i && o < r.length; o++) {
          t = (0 | r.words[o]) + i, this.words[o] = 67108863 & t, i = t >>> 26;
        }

        if (this.length = r.length, 0 !== i) this.words[this.length] = i, this.length++;else if (r !== this) for (; o < r.length; o++) {
          this.words[o] = r.words[o];
        }
        return this;
      }, o.prototype.add = function (e) {
        var t;
        return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this);
      }, o.prototype.isub = function (e) {
        if (0 !== e.negative) {
          e.negative = 0;
          var t = this.iadd(e);
          return e.negative = 1, t._normSign();
        }

        if (0 !== this.negative) return this.negative = 0, this.iadd(e), this.negative = 1, this._normSign();
        var r,
            n,
            i = this.cmp(e);
        if (0 === i) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
        i > 0 ? (r = this, n = e) : (r = e, n = this);

        for (var o = 0, a = 0; a < n.length; a++) {
          o = (t = (0 | r.words[a]) - (0 | n.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        }

        for (; 0 !== o && a < r.length; a++) {
          o = (t = (0 | r.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        }

        if (0 === o && a < r.length && r !== this) for (; a < r.length; a++) {
          this.words[a] = r.words[a];
        }
        return this.length = Math.max(this.length, a), r !== this && (this.negative = 1), this.strip();
      }, o.prototype.sub = function (e) {
        return this.clone().isub(e);
      };

      var l = function l(e, t, r) {
        var n,
            i,
            o,
            a = e.words,
            s = t.words,
            f = r.words,
            u = 0,
            c = 0 | a[0],
            h = 8191 & c,
            d = c >>> 13,
            l = 0 | a[1],
            p = 8191 & l,
            b = l >>> 13,
            m = 0 | a[2],
            y = 8191 & m,
            g = m >>> 13,
            v = 0 | a[3],
            w = 8191 & v,
            _ = v >>> 13,
            E = 0 | a[4],
            M = 8191 & E,
            S = E >>> 13,
            k = 0 | a[5],
            A = 8191 & k,
            x = k >>> 13,
            R = 0 | a[6],
            I = 8191 & R,
            B = R >>> 13,
            T = 0 | a[7],
            j = 8191 & T,
            D = T >>> 13,
            P = 0 | a[8],
            O = 8191 & P,
            C = P >>> 13,
            L = 0 | a[9],
            N = 8191 & L,
            U = L >>> 13,
            q = 0 | s[0],
            z = 8191 & q,
            F = q >>> 13,
            H = 0 | s[1],
            K = 8191 & H,
            W = H >>> 13,
            V = 0 | s[2],
            X = 8191 & V,
            G = V >>> 13,
            Z = 0 | s[3],
            Y = 8191 & Z,
            J = Z >>> 13,
            $ = 0 | s[4],
            Q = 8191 & $,
            ee = $ >>> 13,
            te = 0 | s[5],
            re = 8191 & te,
            ne = te >>> 13,
            ie = 0 | s[6],
            oe = 8191 & ie,
            ae = ie >>> 13,
            se = 0 | s[7],
            fe = 8191 & se,
            ue = se >>> 13,
            ce = 0 | s[8],
            he = 8191 & ce,
            de = ce >>> 13,
            le = 0 | s[9],
            pe = 8191 & le,
            be = le >>> 13;

        r.negative = e.negative ^ t.negative, r.length = 19;
        var me = (u + (n = Math.imul(h, z)) | 0) + ((8191 & (i = (i = Math.imul(h, F)) + Math.imul(d, z) | 0)) << 13) | 0;
        u = ((o = Math.imul(d, F)) + (i >>> 13) | 0) + (me >>> 26) | 0, me &= 67108863, n = Math.imul(p, z), i = (i = Math.imul(p, F)) + Math.imul(b, z) | 0, o = Math.imul(b, F);
        var ye = (u + (n = n + Math.imul(h, K) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, W) | 0) + Math.imul(d, K) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, W) | 0) + (i >>> 13) | 0) + (ye >>> 26) | 0, ye &= 67108863, n = Math.imul(y, z), i = (i = Math.imul(y, F)) + Math.imul(g, z) | 0, o = Math.imul(g, F), n = n + Math.imul(p, K) | 0, i = (i = i + Math.imul(p, W) | 0) + Math.imul(b, K) | 0, o = o + Math.imul(b, W) | 0;
        var ge = (u + (n = n + Math.imul(h, X) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, G) | 0) + Math.imul(d, X) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, G) | 0) + (i >>> 13) | 0) + (ge >>> 26) | 0, ge &= 67108863, n = Math.imul(w, z), i = (i = Math.imul(w, F)) + Math.imul(_, z) | 0, o = Math.imul(_, F), n = n + Math.imul(y, K) | 0, i = (i = i + Math.imul(y, W) | 0) + Math.imul(g, K) | 0, o = o + Math.imul(g, W) | 0, n = n + Math.imul(p, X) | 0, i = (i = i + Math.imul(p, G) | 0) + Math.imul(b, X) | 0, o = o + Math.imul(b, G) | 0;
        var ve = (u + (n = n + Math.imul(h, Y) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, J) | 0) + Math.imul(d, Y) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, J) | 0) + (i >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, n = Math.imul(M, z), i = (i = Math.imul(M, F)) + Math.imul(S, z) | 0, o = Math.imul(S, F), n = n + Math.imul(w, K) | 0, i = (i = i + Math.imul(w, W) | 0) + Math.imul(_, K) | 0, o = o + Math.imul(_, W) | 0, n = n + Math.imul(y, X) | 0, i = (i = i + Math.imul(y, G) | 0) + Math.imul(g, X) | 0, o = o + Math.imul(g, G) | 0, n = n + Math.imul(p, Y) | 0, i = (i = i + Math.imul(p, J) | 0) + Math.imul(b, Y) | 0, o = o + Math.imul(b, J) | 0;
        var we = (u + (n = n + Math.imul(h, Q) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, ee) | 0) + Math.imul(d, Q) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ee) | 0) + (i >>> 13) | 0) + (we >>> 26) | 0, we &= 67108863, n = Math.imul(A, z), i = (i = Math.imul(A, F)) + Math.imul(x, z) | 0, o = Math.imul(x, F), n = n + Math.imul(M, K) | 0, i = (i = i + Math.imul(M, W) | 0) + Math.imul(S, K) | 0, o = o + Math.imul(S, W) | 0, n = n + Math.imul(w, X) | 0, i = (i = i + Math.imul(w, G) | 0) + Math.imul(_, X) | 0, o = o + Math.imul(_, G) | 0, n = n + Math.imul(y, Y) | 0, i = (i = i + Math.imul(y, J) | 0) + Math.imul(g, Y) | 0, o = o + Math.imul(g, J) | 0, n = n + Math.imul(p, Q) | 0, i = (i = i + Math.imul(p, ee) | 0) + Math.imul(b, Q) | 0, o = o + Math.imul(b, ee) | 0;

        var _e = (u + (n = n + Math.imul(h, re) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, ne) | 0) + Math.imul(d, re) | 0)) << 13) | 0;

        u = ((o = o + Math.imul(d, ne) | 0) + (i >>> 13) | 0) + (_e >>> 26) | 0, _e &= 67108863, n = Math.imul(I, z), i = (i = Math.imul(I, F)) + Math.imul(B, z) | 0, o = Math.imul(B, F), n = n + Math.imul(A, K) | 0, i = (i = i + Math.imul(A, W) | 0) + Math.imul(x, K) | 0, o = o + Math.imul(x, W) | 0, n = n + Math.imul(M, X) | 0, i = (i = i + Math.imul(M, G) | 0) + Math.imul(S, X) | 0, o = o + Math.imul(S, G) | 0, n = n + Math.imul(w, Y) | 0, i = (i = i + Math.imul(w, J) | 0) + Math.imul(_, Y) | 0, o = o + Math.imul(_, J) | 0, n = n + Math.imul(y, Q) | 0, i = (i = i + Math.imul(y, ee) | 0) + Math.imul(g, Q) | 0, o = o + Math.imul(g, ee) | 0, n = n + Math.imul(p, re) | 0, i = (i = i + Math.imul(p, ne) | 0) + Math.imul(b, re) | 0, o = o + Math.imul(b, ne) | 0;
        var Ee = (u + (n = n + Math.imul(h, oe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, ae) | 0) + Math.imul(d, oe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ae) | 0) + (i >>> 13) | 0) + (Ee >>> 26) | 0, Ee &= 67108863, n = Math.imul(j, z), i = (i = Math.imul(j, F)) + Math.imul(D, z) | 0, o = Math.imul(D, F), n = n + Math.imul(I, K) | 0, i = (i = i + Math.imul(I, W) | 0) + Math.imul(B, K) | 0, o = o + Math.imul(B, W) | 0, n = n + Math.imul(A, X) | 0, i = (i = i + Math.imul(A, G) | 0) + Math.imul(x, X) | 0, o = o + Math.imul(x, G) | 0, n = n + Math.imul(M, Y) | 0, i = (i = i + Math.imul(M, J) | 0) + Math.imul(S, Y) | 0, o = o + Math.imul(S, J) | 0, n = n + Math.imul(w, Q) | 0, i = (i = i + Math.imul(w, ee) | 0) + Math.imul(_, Q) | 0, o = o + Math.imul(_, ee) | 0, n = n + Math.imul(y, re) | 0, i = (i = i + Math.imul(y, ne) | 0) + Math.imul(g, re) | 0, o = o + Math.imul(g, ne) | 0, n = n + Math.imul(p, oe) | 0, i = (i = i + Math.imul(p, ae) | 0) + Math.imul(b, oe) | 0, o = o + Math.imul(b, ae) | 0;
        var Me = (u + (n = n + Math.imul(h, fe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, ue) | 0) + Math.imul(d, fe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ue) | 0) + (i >>> 13) | 0) + (Me >>> 26) | 0, Me &= 67108863, n = Math.imul(O, z), i = (i = Math.imul(O, F)) + Math.imul(C, z) | 0, o = Math.imul(C, F), n = n + Math.imul(j, K) | 0, i = (i = i + Math.imul(j, W) | 0) + Math.imul(D, K) | 0, o = o + Math.imul(D, W) | 0, n = n + Math.imul(I, X) | 0, i = (i = i + Math.imul(I, G) | 0) + Math.imul(B, X) | 0, o = o + Math.imul(B, G) | 0, n = n + Math.imul(A, Y) | 0, i = (i = i + Math.imul(A, J) | 0) + Math.imul(x, Y) | 0, o = o + Math.imul(x, J) | 0, n = n + Math.imul(M, Q) | 0, i = (i = i + Math.imul(M, ee) | 0) + Math.imul(S, Q) | 0, o = o + Math.imul(S, ee) | 0, n = n + Math.imul(w, re) | 0, i = (i = i + Math.imul(w, ne) | 0) + Math.imul(_, re) | 0, o = o + Math.imul(_, ne) | 0, n = n + Math.imul(y, oe) | 0, i = (i = i + Math.imul(y, ae) | 0) + Math.imul(g, oe) | 0, o = o + Math.imul(g, ae) | 0, n = n + Math.imul(p, fe) | 0, i = (i = i + Math.imul(p, ue) | 0) + Math.imul(b, fe) | 0, o = o + Math.imul(b, ue) | 0;
        var Se = (u + (n = n + Math.imul(h, he) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, de) | 0) + Math.imul(d, he) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, de) | 0) + (i >>> 13) | 0) + (Se >>> 26) | 0, Se &= 67108863, n = Math.imul(N, z), i = (i = Math.imul(N, F)) + Math.imul(U, z) | 0, o = Math.imul(U, F), n = n + Math.imul(O, K) | 0, i = (i = i + Math.imul(O, W) | 0) + Math.imul(C, K) | 0, o = o + Math.imul(C, W) | 0, n = n + Math.imul(j, X) | 0, i = (i = i + Math.imul(j, G) | 0) + Math.imul(D, X) | 0, o = o + Math.imul(D, G) | 0, n = n + Math.imul(I, Y) | 0, i = (i = i + Math.imul(I, J) | 0) + Math.imul(B, Y) | 0, o = o + Math.imul(B, J) | 0, n = n + Math.imul(A, Q) | 0, i = (i = i + Math.imul(A, ee) | 0) + Math.imul(x, Q) | 0, o = o + Math.imul(x, ee) | 0, n = n + Math.imul(M, re) | 0, i = (i = i + Math.imul(M, ne) | 0) + Math.imul(S, re) | 0, o = o + Math.imul(S, ne) | 0, n = n + Math.imul(w, oe) | 0, i = (i = i + Math.imul(w, ae) | 0) + Math.imul(_, oe) | 0, o = o + Math.imul(_, ae) | 0, n = n + Math.imul(y, fe) | 0, i = (i = i + Math.imul(y, ue) | 0) + Math.imul(g, fe) | 0, o = o + Math.imul(g, ue) | 0, n = n + Math.imul(p, he) | 0, i = (i = i + Math.imul(p, de) | 0) + Math.imul(b, he) | 0, o = o + Math.imul(b, de) | 0;
        var ke = (u + (n = n + Math.imul(h, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, be) | 0) + Math.imul(d, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, be) | 0) + (i >>> 13) | 0) + (ke >>> 26) | 0, ke &= 67108863, n = Math.imul(N, K), i = (i = Math.imul(N, W)) + Math.imul(U, K) | 0, o = Math.imul(U, W), n = n + Math.imul(O, X) | 0, i = (i = i + Math.imul(O, G) | 0) + Math.imul(C, X) | 0, o = o + Math.imul(C, G) | 0, n = n + Math.imul(j, Y) | 0, i = (i = i + Math.imul(j, J) | 0) + Math.imul(D, Y) | 0, o = o + Math.imul(D, J) | 0, n = n + Math.imul(I, Q) | 0, i = (i = i + Math.imul(I, ee) | 0) + Math.imul(B, Q) | 0, o = o + Math.imul(B, ee) | 0, n = n + Math.imul(A, re) | 0, i = (i = i + Math.imul(A, ne) | 0) + Math.imul(x, re) | 0, o = o + Math.imul(x, ne) | 0, n = n + Math.imul(M, oe) | 0, i = (i = i + Math.imul(M, ae) | 0) + Math.imul(S, oe) | 0, o = o + Math.imul(S, ae) | 0, n = n + Math.imul(w, fe) | 0, i = (i = i + Math.imul(w, ue) | 0) + Math.imul(_, fe) | 0, o = o + Math.imul(_, ue) | 0, n = n + Math.imul(y, he) | 0, i = (i = i + Math.imul(y, de) | 0) + Math.imul(g, he) | 0, o = o + Math.imul(g, de) | 0;
        var Ae = (u + (n = n + Math.imul(p, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(p, be) | 0) + Math.imul(b, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(b, be) | 0) + (i >>> 13) | 0) + (Ae >>> 26) | 0, Ae &= 67108863, n = Math.imul(N, X), i = (i = Math.imul(N, G)) + Math.imul(U, X) | 0, o = Math.imul(U, G), n = n + Math.imul(O, Y) | 0, i = (i = i + Math.imul(O, J) | 0) + Math.imul(C, Y) | 0, o = o + Math.imul(C, J) | 0, n = n + Math.imul(j, Q) | 0, i = (i = i + Math.imul(j, ee) | 0) + Math.imul(D, Q) | 0, o = o + Math.imul(D, ee) | 0, n = n + Math.imul(I, re) | 0, i = (i = i + Math.imul(I, ne) | 0) + Math.imul(B, re) | 0, o = o + Math.imul(B, ne) | 0, n = n + Math.imul(A, oe) | 0, i = (i = i + Math.imul(A, ae) | 0) + Math.imul(x, oe) | 0, o = o + Math.imul(x, ae) | 0, n = n + Math.imul(M, fe) | 0, i = (i = i + Math.imul(M, ue) | 0) + Math.imul(S, fe) | 0, o = o + Math.imul(S, ue) | 0, n = n + Math.imul(w, he) | 0, i = (i = i + Math.imul(w, de) | 0) + Math.imul(_, he) | 0, o = o + Math.imul(_, de) | 0;
        var xe = (u + (n = n + Math.imul(y, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(y, be) | 0) + Math.imul(g, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(g, be) | 0) + (i >>> 13) | 0) + (xe >>> 26) | 0, xe &= 67108863, n = Math.imul(N, Y), i = (i = Math.imul(N, J)) + Math.imul(U, Y) | 0, o = Math.imul(U, J), n = n + Math.imul(O, Q) | 0, i = (i = i + Math.imul(O, ee) | 0) + Math.imul(C, Q) | 0, o = o + Math.imul(C, ee) | 0, n = n + Math.imul(j, re) | 0, i = (i = i + Math.imul(j, ne) | 0) + Math.imul(D, re) | 0, o = o + Math.imul(D, ne) | 0, n = n + Math.imul(I, oe) | 0, i = (i = i + Math.imul(I, ae) | 0) + Math.imul(B, oe) | 0, o = o + Math.imul(B, ae) | 0, n = n + Math.imul(A, fe) | 0, i = (i = i + Math.imul(A, ue) | 0) + Math.imul(x, fe) | 0, o = o + Math.imul(x, ue) | 0, n = n + Math.imul(M, he) | 0, i = (i = i + Math.imul(M, de) | 0) + Math.imul(S, he) | 0, o = o + Math.imul(S, de) | 0;
        var Re = (u + (n = n + Math.imul(w, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(w, be) | 0) + Math.imul(_, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(_, be) | 0) + (i >>> 13) | 0) + (Re >>> 26) | 0, Re &= 67108863, n = Math.imul(N, Q), i = (i = Math.imul(N, ee)) + Math.imul(U, Q) | 0, o = Math.imul(U, ee), n = n + Math.imul(O, re) | 0, i = (i = i + Math.imul(O, ne) | 0) + Math.imul(C, re) | 0, o = o + Math.imul(C, ne) | 0, n = n + Math.imul(j, oe) | 0, i = (i = i + Math.imul(j, ae) | 0) + Math.imul(D, oe) | 0, o = o + Math.imul(D, ae) | 0, n = n + Math.imul(I, fe) | 0, i = (i = i + Math.imul(I, ue) | 0) + Math.imul(B, fe) | 0, o = o + Math.imul(B, ue) | 0, n = n + Math.imul(A, he) | 0, i = (i = i + Math.imul(A, de) | 0) + Math.imul(x, he) | 0, o = o + Math.imul(x, de) | 0;
        var Ie = (u + (n = n + Math.imul(M, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(M, be) | 0) + Math.imul(S, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(S, be) | 0) + (i >>> 13) | 0) + (Ie >>> 26) | 0, Ie &= 67108863, n = Math.imul(N, re), i = (i = Math.imul(N, ne)) + Math.imul(U, re) | 0, o = Math.imul(U, ne), n = n + Math.imul(O, oe) | 0, i = (i = i + Math.imul(O, ae) | 0) + Math.imul(C, oe) | 0, o = o + Math.imul(C, ae) | 0, n = n + Math.imul(j, fe) | 0, i = (i = i + Math.imul(j, ue) | 0) + Math.imul(D, fe) | 0, o = o + Math.imul(D, ue) | 0, n = n + Math.imul(I, he) | 0, i = (i = i + Math.imul(I, de) | 0) + Math.imul(B, he) | 0, o = o + Math.imul(B, de) | 0;
        var Be = (u + (n = n + Math.imul(A, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(A, be) | 0) + Math.imul(x, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(x, be) | 0) + (i >>> 13) | 0) + (Be >>> 26) | 0, Be &= 67108863, n = Math.imul(N, oe), i = (i = Math.imul(N, ae)) + Math.imul(U, oe) | 0, o = Math.imul(U, ae), n = n + Math.imul(O, fe) | 0, i = (i = i + Math.imul(O, ue) | 0) + Math.imul(C, fe) | 0, o = o + Math.imul(C, ue) | 0, n = n + Math.imul(j, he) | 0, i = (i = i + Math.imul(j, de) | 0) + Math.imul(D, he) | 0, o = o + Math.imul(D, de) | 0;
        var Te = (u + (n = n + Math.imul(I, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(I, be) | 0) + Math.imul(B, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(B, be) | 0) + (i >>> 13) | 0) + (Te >>> 26) | 0, Te &= 67108863, n = Math.imul(N, fe), i = (i = Math.imul(N, ue)) + Math.imul(U, fe) | 0, o = Math.imul(U, ue), n = n + Math.imul(O, he) | 0, i = (i = i + Math.imul(O, de) | 0) + Math.imul(C, he) | 0, o = o + Math.imul(C, de) | 0;
        var je = (u + (n = n + Math.imul(j, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(j, be) | 0) + Math.imul(D, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(D, be) | 0) + (i >>> 13) | 0) + (je >>> 26) | 0, je &= 67108863, n = Math.imul(N, he), i = (i = Math.imul(N, de)) + Math.imul(U, he) | 0, o = Math.imul(U, de);
        var De = (u + (n = n + Math.imul(O, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(O, be) | 0) + Math.imul(C, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(C, be) | 0) + (i >>> 13) | 0) + (De >>> 26) | 0, De &= 67108863;
        var Pe = (u + (n = Math.imul(N, pe)) | 0) + ((8191 & (i = (i = Math.imul(N, be)) + Math.imul(U, pe) | 0)) << 13) | 0;
        return u = ((o = Math.imul(U, be)) + (i >>> 13) | 0) + (Pe >>> 26) | 0, Pe &= 67108863, f[0] = me, f[1] = ye, f[2] = ge, f[3] = ve, f[4] = we, f[5] = _e, f[6] = Ee, f[7] = Me, f[8] = Se, f[9] = ke, f[10] = Ae, f[11] = xe, f[12] = Re, f[13] = Ie, f[14] = Be, f[15] = Te, f[16] = je, f[17] = De, f[18] = Pe, 0 !== u && (f[19] = u, r.length++), r;
      };

      function p(e, t, r) {
        return new b().mulp(e, t, r);
      }

      function b(e, t) {
        this.x = e, this.y = t;
      }

      Math.imul || (l = d), o.prototype.mulTo = function (e, t) {
        var r = this.length + e.length;
        return 10 === this.length && 10 === e.length ? l(this, e, t) : r < 63 ? d(this, e, t) : r < 1024 ? function (e, t, r) {
          r.negative = t.negative ^ e.negative, r.length = e.length + t.length;

          for (var n = 0, i = 0, o = 0; o < r.length - 1; o++) {
            var a = i;
            i = 0;

            for (var s = 67108863 & n, f = Math.min(o, t.length - 1), u = Math.max(0, o - e.length + 1); u <= f; u++) {
              var c = o - u,
                  h = (0 | e.words[c]) * (0 | t.words[u]),
                  d = 67108863 & h;
              s = 67108863 & (d = d + s | 0), i += (a = (a = a + (h / 67108864 | 0) | 0) + (d >>> 26) | 0) >>> 26, a &= 67108863;
            }

            r.words[o] = s, n = a, a = i;
          }

          return 0 !== n ? r.words[o] = n : r.length--, r.strip();
        }(this, e, t) : p(this, e, t);
      }, b.prototype.makeRBT = function (e) {
        for (var t = new Array(e), r = o.prototype._countBits(e) - 1, n = 0; n < e; n++) {
          t[n] = this.revBin(n, r, e);
        }

        return t;
      }, b.prototype.revBin = function (e, t, r) {
        if (0 === e || e === r - 1) return e;

        for (var n = 0, i = 0; i < t; i++) {
          n |= (1 & e) << t - i - 1, e >>= 1;
        }

        return n;
      }, b.prototype.permute = function (e, t, r, n, i, o) {
        for (var a = 0; a < o; a++) {
          n[a] = t[e[a]], i[a] = r[e[a]];
        }
      }, b.prototype.transform = function (e, t, r, n, i, o) {
        this.permute(o, e, t, r, n, i);

        for (var a = 1; a < i; a <<= 1) {
          for (var s = a << 1, f = Math.cos(2 * Math.PI / s), u = Math.sin(2 * Math.PI / s), c = 0; c < i; c += s) {
            for (var h = f, d = u, l = 0; l < a; l++) {
              var p = r[c + l],
                  b = n[c + l],
                  m = r[c + l + a],
                  y = n[c + l + a],
                  g = h * m - d * y;
              y = h * y + d * m, m = g, r[c + l] = p + m, n[c + l] = b + y, r[c + l + a] = p - m, n[c + l + a] = b - y, l !== s && (g = f * h - u * d, d = f * d + u * h, h = g);
            }
          }
        }
      }, b.prototype.guessLen13b = function (e, t) {
        var r = 1 | Math.max(t, e),
            n = 1 & r,
            i = 0;

        for (r = r / 2 | 0; r; r >>>= 1) {
          i++;
        }

        return 1 << i + 1 + n;
      }, b.prototype.conjugate = function (e, t, r) {
        if (!(r <= 1)) for (var n = 0; n < r / 2; n++) {
          var i = e[n];
          e[n] = e[r - n - 1], e[r - n - 1] = i, i = t[n], t[n] = -t[r - n - 1], t[r - n - 1] = -i;
        }
      }, b.prototype.normalize13b = function (e, t) {
        for (var r = 0, n = 0; n < t / 2; n++) {
          var i = 8192 * Math.round(e[2 * n + 1] / t) + Math.round(e[2 * n] / t) + r;
          e[n] = 67108863 & i, r = i < 67108864 ? 0 : i / 67108864 | 0;
        }

        return e;
      }, b.prototype.convert13b = function (e, t, r, i) {
        for (var o = 0, a = 0; a < t; a++) {
          o += 0 | e[a], r[2 * a] = 8191 & o, o >>>= 13, r[2 * a + 1] = 8191 & o, o >>>= 13;
        }

        for (a = 2 * t; a < i; ++a) {
          r[a] = 0;
        }

        n(0 === o), n(0 == (-8192 & o));
      }, b.prototype.stub = function (e) {
        for (var t = new Array(e), r = 0; r < e; r++) {
          t[r] = 0;
        }

        return t;
      }, b.prototype.mulp = function (e, t, r) {
        var n = 2 * this.guessLen13b(e.length, t.length),
            i = this.makeRBT(n),
            o = this.stub(n),
            a = new Array(n),
            s = new Array(n),
            f = new Array(n),
            u = new Array(n),
            c = new Array(n),
            h = new Array(n),
            d = r.words;
        d.length = n, this.convert13b(e.words, e.length, a, n), this.convert13b(t.words, t.length, u, n), this.transform(a, o, s, f, n, i), this.transform(u, o, c, h, n, i);

        for (var l = 0; l < n; l++) {
          var p = s[l] * c[l] - f[l] * h[l];
          f[l] = s[l] * h[l] + f[l] * c[l], s[l] = p;
        }

        return this.conjugate(s, f, n), this.transform(s, f, d, o, n, i), this.conjugate(d, o, n), this.normalize13b(d, n), r.negative = e.negative ^ t.negative, r.length = e.length + t.length, r.strip();
      }, o.prototype.mul = function (e) {
        var t = new o(null);
        return t.words = new Array(this.length + e.length), this.mulTo(e, t);
      }, o.prototype.mulf = function (e) {
        var t = new o(null);
        return t.words = new Array(this.length + e.length), p(this, e, t);
      }, o.prototype.imul = function (e) {
        return this.clone().mulTo(e, this);
      }, o.prototype.imuln = function (e) {
        n("number" == typeof e), n(e < 67108864);

        for (var t = 0, r = 0; r < this.length; r++) {
          var i = (0 | this.words[r]) * e,
              o = (67108863 & i) + (67108863 & t);
          t >>= 26, t += i / 67108864 | 0, t += o >>> 26, this.words[r] = 67108863 & o;
        }

        return 0 !== t && (this.words[r] = t, this.length++), this;
      }, o.prototype.muln = function (e) {
        return this.clone().imuln(e);
      }, o.prototype.sqr = function () {
        return this.mul(this);
      }, o.prototype.isqr = function () {
        return this.imul(this.clone());
      }, o.prototype.pow = function (e) {
        var t = function (e) {
          for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) {
            var n = r / 26 | 0,
                i = r % 26;
            t[r] = (e.words[n] & 1 << i) >>> i;
          }

          return t;
        }(e);

        if (0 === t.length) return new o(1);

        for (var r = this, n = 0; n < t.length && 0 === t[n]; n++, r = r.sqr()) {
          ;
        }

        if (++n < t.length) for (var i = r.sqr(); n < t.length; n++, i = i.sqr()) {
          0 !== t[n] && (r = r.mul(i));
        }
        return r;
      }, o.prototype.iushln = function (e) {
        n("number" == typeof e && e >= 0);
        var t,
            r = e % 26,
            i = (e - r) / 26,
            o = 67108863 >>> 26 - r << 26 - r;

        if (0 !== r) {
          var a = 0;

          for (t = 0; t < this.length; t++) {
            var s = this.words[t] & o,
                f = (0 | this.words[t]) - s << r;
            this.words[t] = f | a, a = s >>> 26 - r;
          }

          a && (this.words[t] = a, this.length++);
        }

        if (0 !== i) {
          for (t = this.length - 1; t >= 0; t--) {
            this.words[t + i] = this.words[t];
          }

          for (t = 0; t < i; t++) {
            this.words[t] = 0;
          }

          this.length += i;
        }

        return this.strip();
      }, o.prototype.ishln = function (e) {
        return n(0 === this.negative), this.iushln(e);
      }, o.prototype.iushrn = function (e, t, r) {
        var i;
        n("number" == typeof e && e >= 0), i = t ? (t - t % 26) / 26 : 0;
        var o = e % 26,
            a = Math.min((e - o) / 26, this.length),
            s = 67108863 ^ 67108863 >>> o << o,
            f = r;

        if (i -= a, i = Math.max(0, i), f) {
          for (var u = 0; u < a; u++) {
            f.words[u] = this.words[u];
          }

          f.length = a;
        }

        if (0 === a) ;else if (this.length > a) for (this.length -= a, u = 0; u < this.length; u++) {
          this.words[u] = this.words[u + a];
        } else this.words[0] = 0, this.length = 1;
        var c = 0;

        for (u = this.length - 1; u >= 0 && (0 !== c || u >= i); u--) {
          var h = 0 | this.words[u];
          this.words[u] = c << 26 - o | h >>> o, c = h & s;
        }

        return f && 0 !== c && (f.words[f.length++] = c), 0 === this.length && (this.words[0] = 0, this.length = 1), this.strip();
      }, o.prototype.ishrn = function (e, t, r) {
        return n(0 === this.negative), this.iushrn(e, t, r);
      }, o.prototype.shln = function (e) {
        return this.clone().ishln(e);
      }, o.prototype.ushln = function (e) {
        return this.clone().iushln(e);
      }, o.prototype.shrn = function (e) {
        return this.clone().ishrn(e);
      }, o.prototype.ushrn = function (e) {
        return this.clone().iushrn(e);
      }, o.prototype.testn = function (e) {
        n("number" == typeof e && e >= 0);
        var t = e % 26,
            r = (e - t) / 26,
            i = 1 << t;
        return !(this.length <= r) && !!(this.words[r] & i);
      }, o.prototype.imaskn = function (e) {
        n("number" == typeof e && e >= 0);
        var t = e % 26,
            r = (e - t) / 26;
        if (n(0 === this.negative, "imaskn works only with positive numbers"), this.length <= r) return this;

        if (0 !== t && r++, this.length = Math.min(r, this.length), 0 !== t) {
          var i = 67108863 ^ 67108863 >>> t << t;
          this.words[this.length - 1] &= i;
        }

        return this.strip();
      }, o.prototype.maskn = function (e) {
        return this.clone().imaskn(e);
      }, o.prototype.iaddn = function (e) {
        return n("number" == typeof e), n(e < 67108864), e < 0 ? this.isubn(-e) : 0 !== this.negative ? 1 === this.length && (0 | this.words[0]) < e ? (this.words[0] = e - (0 | this.words[0]), this.negative = 0, this) : (this.negative = 0, this.isubn(e), this.negative = 1, this) : this._iaddn(e);
      }, o.prototype._iaddn = function (e) {
        this.words[0] += e;

        for (var t = 0; t < this.length && this.words[t] >= 67108864; t++) {
          this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
        }

        return this.length = Math.max(this.length, t + 1), this;
      }, o.prototype.isubn = function (e) {
        if (n("number" == typeof e), n(e < 67108864), e < 0) return this.iaddn(-e);
        if (0 !== this.negative) return this.negative = 0, this.iaddn(e), this.negative = 1, this;
        if (this.words[0] -= e, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1;else for (var t = 0; t < this.length && this.words[t] < 0; t++) {
          this.words[t] += 67108864, this.words[t + 1] -= 1;
        }
        return this.strip();
      }, o.prototype.addn = function (e) {
        return this.clone().iaddn(e);
      }, o.prototype.subn = function (e) {
        return this.clone().isubn(e);
      }, o.prototype.iabs = function () {
        return this.negative = 0, this;
      }, o.prototype.abs = function () {
        return this.clone().iabs();
      }, o.prototype._ishlnsubmul = function (e, t, r) {
        var i,
            o,
            a = e.length + r;

        this._expand(a);

        var s = 0;

        for (i = 0; i < e.length; i++) {
          o = (0 | this.words[i + r]) + s;
          var f = (0 | e.words[i]) * t;
          s = ((o -= 67108863 & f) >> 26) - (f / 67108864 | 0), this.words[i + r] = 67108863 & o;
        }

        for (; i < this.length - r; i++) {
          s = (o = (0 | this.words[i + r]) + s) >> 26, this.words[i + r] = 67108863 & o;
        }

        if (0 === s) return this.strip();

        for (n(-1 === s), s = 0, i = 0; i < this.length; i++) {
          s = (o = -(0 | this.words[i]) + s) >> 26, this.words[i] = 67108863 & o;
        }

        return this.negative = 1, this.strip();
      }, o.prototype._wordDiv = function (e, t) {
        var r = (this.length, e.length),
            n = this.clone(),
            i = e,
            a = 0 | i.words[i.length - 1];
        0 !== (r = 26 - this._countBits(a)) && (i = i.ushln(r), n.iushln(r), a = 0 | i.words[i.length - 1]);
        var s,
            f = n.length - i.length;

        if ("mod" !== t) {
          (s = new o(null)).length = f + 1, s.words = new Array(s.length);

          for (var u = 0; u < s.length; u++) {
            s.words[u] = 0;
          }
        }

        var c = n.clone()._ishlnsubmul(i, 1, f);

        0 === c.negative && (n = c, s && (s.words[f] = 1));

        for (var h = f - 1; h >= 0; h--) {
          var d = 67108864 * (0 | n.words[i.length + h]) + (0 | n.words[i.length + h - 1]);

          for (d = Math.min(d / a | 0, 67108863), n._ishlnsubmul(i, d, h); 0 !== n.negative;) {
            d--, n.negative = 0, n._ishlnsubmul(i, 1, h), n.isZero() || (n.negative ^= 1);
          }

          s && (s.words[h] = d);
        }

        return s && s.strip(), n.strip(), "div" !== t && 0 !== r && n.iushrn(r), {
          div: s || null,
          mod: n
        };
      }, o.prototype.divmod = function (e, t, r) {
        return n(!e.isZero()), this.isZero() ? {
          div: new o(0),
          mod: new o(0)
        } : 0 !== this.negative && 0 === e.negative ? (s = this.neg().divmod(e, t), "mod" !== t && (i = s.div.neg()), "div" !== t && (a = s.mod.neg(), r && 0 !== a.negative && a.iadd(e)), {
          div: i,
          mod: a
        }) : 0 === this.negative && 0 !== e.negative ? (s = this.divmod(e.neg(), t), "mod" !== t && (i = s.div.neg()), {
          div: i,
          mod: s.mod
        }) : 0 != (this.negative & e.negative) ? (s = this.neg().divmod(e.neg(), t), "div" !== t && (a = s.mod.neg(), r && 0 !== a.negative && a.isub(e)), {
          div: s.div,
          mod: a
        }) : e.length > this.length || this.cmp(e) < 0 ? {
          div: new o(0),
          mod: this
        } : 1 === e.length ? "div" === t ? {
          div: this.divn(e.words[0]),
          mod: null
        } : "mod" === t ? {
          div: null,
          mod: new o(this.modn(e.words[0]))
        } : {
          div: this.divn(e.words[0]),
          mod: new o(this.modn(e.words[0]))
        } : this._wordDiv(e, t);
        var i, a, s;
      }, o.prototype.div = function (e) {
        return this.divmod(e, "div", !1).div;
      }, o.prototype.mod = function (e) {
        return this.divmod(e, "mod", !1).mod;
      }, o.prototype.umod = function (e) {
        return this.divmod(e, "mod", !0).mod;
      }, o.prototype.divRound = function (e) {
        var t = this.divmod(e);
        if (t.mod.isZero()) return t.div;
        var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod,
            n = e.ushrn(1),
            i = e.andln(1),
            o = r.cmp(n);
        return o < 0 || 1 === i && 0 === o ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1);
      }, o.prototype.modn = function (e) {
        n(e <= 67108863);

        for (var t = (1 << 26) % e, r = 0, i = this.length - 1; i >= 0; i--) {
          r = (t * r + (0 | this.words[i])) % e;
        }

        return r;
      }, o.prototype.idivn = function (e) {
        n(e <= 67108863);

        for (var t = 0, r = this.length - 1; r >= 0; r--) {
          var i = (0 | this.words[r]) + 67108864 * t;
          this.words[r] = i / e | 0, t = i % e;
        }

        return this.strip();
      }, o.prototype.divn = function (e) {
        return this.clone().idivn(e);
      }, o.prototype.egcd = function (e) {
        n(0 === e.negative), n(!e.isZero());
        var t = this,
            r = e.clone();
        t = 0 !== t.negative ? t.umod(e) : t.clone();

        for (var i = new o(1), a = new o(0), s = new o(0), f = new o(1), u = 0; t.isEven() && r.isEven();) {
          t.iushrn(1), r.iushrn(1), ++u;
        }

        for (var c = r.clone(), h = t.clone(); !t.isZero();) {
          for (var d = 0, l = 1; 0 == (t.words[0] & l) && d < 26; ++d, l <<= 1) {
            ;
          }

          if (d > 0) for (t.iushrn(d); d-- > 0;) {
            (i.isOdd() || a.isOdd()) && (i.iadd(c), a.isub(h)), i.iushrn(1), a.iushrn(1);
          }

          for (var p = 0, b = 1; 0 == (r.words[0] & b) && p < 26; ++p, b <<= 1) {
            ;
          }

          if (p > 0) for (r.iushrn(p); p-- > 0;) {
            (s.isOdd() || f.isOdd()) && (s.iadd(c), f.isub(h)), s.iushrn(1), f.iushrn(1);
          }
          t.cmp(r) >= 0 ? (t.isub(r), i.isub(s), a.isub(f)) : (r.isub(t), s.isub(i), f.isub(a));
        }

        return {
          a: s,
          b: f,
          gcd: r.iushln(u)
        };
      }, o.prototype._invmp = function (e) {
        n(0 === e.negative), n(!e.isZero());
        var t = this,
            r = e.clone();
        t = 0 !== t.negative ? t.umod(e) : t.clone();

        for (var i, a = new o(1), s = new o(0), f = r.clone(); t.cmpn(1) > 0 && r.cmpn(1) > 0;) {
          for (var u = 0, c = 1; 0 == (t.words[0] & c) && u < 26; ++u, c <<= 1) {
            ;
          }

          if (u > 0) for (t.iushrn(u); u-- > 0;) {
            a.isOdd() && a.iadd(f), a.iushrn(1);
          }

          for (var h = 0, d = 1; 0 == (r.words[0] & d) && h < 26; ++h, d <<= 1) {
            ;
          }

          if (h > 0) for (r.iushrn(h); h-- > 0;) {
            s.isOdd() && s.iadd(f), s.iushrn(1);
          }
          t.cmp(r) >= 0 ? (t.isub(r), a.isub(s)) : (r.isub(t), s.isub(a));
        }

        return (i = 0 === t.cmpn(1) ? a : s).cmpn(0) < 0 && i.iadd(e), i;
      }, o.prototype.gcd = function (e) {
        if (this.isZero()) return e.abs();
        if (e.isZero()) return this.abs();
        var t = this.clone(),
            r = e.clone();
        t.negative = 0, r.negative = 0;

        for (var n = 0; t.isEven() && r.isEven(); n++) {
          t.iushrn(1), r.iushrn(1);
        }

        for (;;) {
          for (; t.isEven();) {
            t.iushrn(1);
          }

          for (; r.isEven();) {
            r.iushrn(1);
          }

          var i = t.cmp(r);

          if (i < 0) {
            var o = t;
            t = r, r = o;
          } else if (0 === i || 0 === r.cmpn(1)) break;

          t.isub(r);
        }

        return r.iushln(n);
      }, o.prototype.invm = function (e) {
        return this.egcd(e).a.umod(e);
      }, o.prototype.isEven = function () {
        return 0 == (1 & this.words[0]);
      }, o.prototype.isOdd = function () {
        return 1 == (1 & this.words[0]);
      }, o.prototype.andln = function (e) {
        return this.words[0] & e;
      }, o.prototype.bincn = function (e) {
        n("number" == typeof e);
        var t = e % 26,
            r = (e - t) / 26,
            i = 1 << t;
        if (this.length <= r) return this._expand(r + 1), this.words[r] |= i, this;

        for (var o = i, a = r; 0 !== o && a < this.length; a++) {
          var s = 0 | this.words[a];
          o = (s += o) >>> 26, s &= 67108863, this.words[a] = s;
        }

        return 0 !== o && (this.words[a] = o, this.length++), this;
      }, o.prototype.isZero = function () {
        return 1 === this.length && 0 === this.words[0];
      }, o.prototype.cmpn = function (e) {
        var t,
            r = e < 0;
        if (0 !== this.negative && !r) return -1;
        if (0 === this.negative && r) return 1;
        if (this.strip(), this.length > 1) t = 1;else {
          r && (e = -e), n(e <= 67108863, "Number is too big");
          var i = 0 | this.words[0];
          t = i === e ? 0 : i < e ? -1 : 1;
        }
        return 0 !== this.negative ? 0 | -t : t;
      }, o.prototype.cmp = function (e) {
        if (0 !== this.negative && 0 === e.negative) return -1;
        if (0 === this.negative && 0 !== e.negative) return 1;
        var t = this.ucmp(e);
        return 0 !== this.negative ? 0 | -t : t;
      }, o.prototype.ucmp = function (e) {
        if (this.length > e.length) return 1;
        if (this.length < e.length) return -1;

        for (var t = 0, r = this.length - 1; r >= 0; r--) {
          var n = 0 | this.words[r],
              i = 0 | e.words[r];

          if (n !== i) {
            n < i ? t = -1 : n > i && (t = 1);
            break;
          }
        }

        return t;
      }, o.prototype.gtn = function (e) {
        return 1 === this.cmpn(e);
      }, o.prototype.gt = function (e) {
        return 1 === this.cmp(e);
      }, o.prototype.gten = function (e) {
        return this.cmpn(e) >= 0;
      }, o.prototype.gte = function (e) {
        return this.cmp(e) >= 0;
      }, o.prototype.ltn = function (e) {
        return -1 === this.cmpn(e);
      }, o.prototype.lt = function (e) {
        return -1 === this.cmp(e);
      }, o.prototype.lten = function (e) {
        return this.cmpn(e) <= 0;
      }, o.prototype.lte = function (e) {
        return this.cmp(e) <= 0;
      }, o.prototype.eqn = function (e) {
        return 0 === this.cmpn(e);
      }, o.prototype.eq = function (e) {
        return 0 === this.cmp(e);
      }, o.red = function (e) {
        return new E(e);
      }, o.prototype.toRed = function (e) {
        return n(!this.red, "Already a number in reduction context"), n(0 === this.negative, "red works only with positives"), e.convertTo(this)._forceRed(e);
      }, o.prototype.fromRed = function () {
        return n(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
      }, o.prototype._forceRed = function (e) {
        return this.red = e, this;
      }, o.prototype.forceRed = function (e) {
        return n(!this.red, "Already a number in reduction context"), this._forceRed(e);
      }, o.prototype.redAdd = function (e) {
        return n(this.red, "redAdd works only with red numbers"), this.red.add(this, e);
      }, o.prototype.redIAdd = function (e) {
        return n(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e);
      }, o.prototype.redSub = function (e) {
        return n(this.red, "redSub works only with red numbers"), this.red.sub(this, e);
      }, o.prototype.redISub = function (e) {
        return n(this.red, "redISub works only with red numbers"), this.red.isub(this, e);
      }, o.prototype.redShl = function (e) {
        return n(this.red, "redShl works only with red numbers"), this.red.shl(this, e);
      }, o.prototype.redMul = function (e) {
        return n(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.mul(this, e);
      }, o.prototype.redIMul = function (e) {
        return n(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.imul(this, e);
      }, o.prototype.redSqr = function () {
        return n(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
      }, o.prototype.redISqr = function () {
        return n(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
      }, o.prototype.redSqrt = function () {
        return n(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
      }, o.prototype.redInvm = function () {
        return n(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
      }, o.prototype.redNeg = function () {
        return n(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
      }, o.prototype.redPow = function (e) {
        return n(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e);
      };
      var m = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };

      function y(e, t) {
        this.name = e, this.p = new o(t, 16), this.n = this.p.bitLength(), this.k = new o(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
      }

      function g() {
        y.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
      }

      function v() {
        y.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
      }

      function w() {
        y.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
      }

      function _() {
        y.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
      }

      function E(e) {
        if ("string" == typeof e) {
          var t = o._prime(e);

          this.m = t.p, this.prime = t;
        } else n(e.gtn(1), "modulus must be greater than 1"), this.m = e, this.prime = null;
      }

      function M(e) {
        E.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new o(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
      }

      y.prototype._tmp = function () {
        var e = new o(null);
        return e.words = new Array(Math.ceil(this.n / 13)), e;
      }, y.prototype.ireduce = function (e) {
        var t,
            r = e;

        do {
          this.split(r, this.tmp), t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength();
        } while (t > this.n);

        var n = t < this.n ? -1 : r.ucmp(this.p);
        return 0 === n ? (r.words[0] = 0, r.length = 1) : n > 0 ? r.isub(this.p) : void 0 !== r.strip ? r.strip() : r._strip(), r;
      }, y.prototype.split = function (e, t) {
        e.iushrn(this.n, 0, t);
      }, y.prototype.imulK = function (e) {
        return e.imul(this.k);
      }, i(g, y), g.prototype.split = function (e, t) {
        for (var r = Math.min(e.length, 9), n = 0; n < r; n++) {
          t.words[n] = e.words[n];
        }

        if (t.length = r, e.length <= 9) return e.words[0] = 0, void (e.length = 1);
        var i = e.words[9];

        for (t.words[t.length++] = 4194303 & i, n = 10; n < e.length; n++) {
          var o = 0 | e.words[n];
          e.words[n - 10] = (4194303 & o) << 4 | i >>> 22, i = o;
        }

        i >>>= 22, e.words[n - 10] = i, 0 === i && e.length > 10 ? e.length -= 10 : e.length -= 9;
      }, g.prototype.imulK = function (e) {
        e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2;

        for (var t = 0, r = 0; r < e.length; r++) {
          var n = 0 | e.words[r];
          t += 977 * n, e.words[r] = 67108863 & t, t = 64 * n + (t / 67108864 | 0);
        }

        return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), e;
      }, i(v, y), i(w, y), i(_, y), _.prototype.imulK = function (e) {
        for (var t = 0, r = 0; r < e.length; r++) {
          var n = 19 * (0 | e.words[r]) + t,
              i = 67108863 & n;
          n >>>= 26, e.words[r] = i, t = n;
        }

        return 0 !== t && (e.words[e.length++] = t), e;
      }, o._prime = function (e) {
        if (m[e]) return m[e];
        var t;
        if ("k256" === e) t = new g();else if ("p224" === e) t = new v();else if ("p192" === e) t = new w();else {
          if ("p25519" !== e) throw new Error("Unknown prime " + e);
          t = new _();
        }
        return m[e] = t, t;
      }, E.prototype._verify1 = function (e) {
        n(0 === e.negative, "red works only with positives"), n(e.red, "red works only with red numbers");
      }, E.prototype._verify2 = function (e, t) {
        n(0 == (e.negative | t.negative), "red works only with positives"), n(e.red && e.red === t.red, "red works only with red numbers");
      }, E.prototype.imod = function (e) {
        return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.umod(this.m)._forceRed(this);
      }, E.prototype.neg = function (e) {
        return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);
      }, E.prototype.add = function (e, t) {
        this._verify2(e, t);

        var r = e.add(t);
        return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this);
      }, E.prototype.iadd = function (e, t) {
        this._verify2(e, t);

        var r = e.iadd(t);
        return r.cmp(this.m) >= 0 && r.isub(this.m), r;
      }, E.prototype.sub = function (e, t) {
        this._verify2(e, t);

        var r = e.sub(t);
        return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this);
      }, E.prototype.isub = function (e, t) {
        this._verify2(e, t);

        var r = e.isub(t);
        return r.cmpn(0) < 0 && r.iadd(this.m), r;
      }, E.prototype.shl = function (e, t) {
        return this._verify1(e), this.imod(e.ushln(t));
      }, E.prototype.imul = function (e, t) {
        return this._verify2(e, t), this.imod(e.imul(t));
      }, E.prototype.mul = function (e, t) {
        return this._verify2(e, t), this.imod(e.mul(t));
      }, E.prototype.isqr = function (e) {
        return this.imul(e, e.clone());
      }, E.prototype.sqr = function (e) {
        return this.mul(e, e);
      }, E.prototype.sqrt = function (e) {
        if (e.isZero()) return e.clone();
        var t = this.m.andln(3);

        if (n(t % 2 == 1), 3 === t) {
          var r = this.m.add(new o(1)).iushrn(2);
          return this.pow(e, r);
        }

        for (var i = this.m.subn(1), a = 0; !i.isZero() && 0 === i.andln(1);) {
          a++, i.iushrn(1);
        }

        n(!i.isZero());
        var s = new o(1).toRed(this),
            f = s.redNeg(),
            u = this.m.subn(1).iushrn(1),
            c = this.m.bitLength();

        for (c = new o(2 * c * c).toRed(this); 0 !== this.pow(c, u).cmp(f);) {
          c.redIAdd(f);
        }

        for (var h = this.pow(c, i), d = this.pow(e, i.addn(1).iushrn(1)), l = this.pow(e, i), p = a; 0 !== l.cmp(s);) {
          for (var b = l, m = 0; 0 !== b.cmp(s); m++) {
            b = b.redSqr();
          }

          n(m < p);
          var y = this.pow(h, new o(1).iushln(p - m - 1));
          d = d.redMul(y), h = y.redSqr(), l = l.redMul(h), p = m;
        }

        return d;
      }, E.prototype.invm = function (e) {
        var t = e._invmp(this.m);

        return 0 !== t.negative ? (t.negative = 0, this.imod(t).redNeg()) : this.imod(t);
      }, E.prototype.pow = function (e, t) {
        if (t.isZero()) return new o(1).toRed(this);
        if (0 === t.cmpn(1)) return e.clone();
        var r = new Array(16);
        r[0] = new o(1).toRed(this), r[1] = e;

        for (var n = 2; n < r.length; n++) {
          r[n] = this.mul(r[n - 1], e);
        }

        var i = r[0],
            a = 0,
            s = 0,
            f = t.bitLength() % 26;

        for (0 === f && (f = 26), n = t.length - 1; n >= 0; n--) {
          for (var u = t.words[n], c = f - 1; c >= 0; c--) {
            var h = u >> c & 1;
            i !== r[0] && (i = this.sqr(i)), 0 !== h || 0 !== a ? (a <<= 1, a |= h, (4 === ++s || 0 === n && 0 === c) && (i = this.mul(i, r[a]), s = 0, a = 0)) : s = 0;
          }

          f = 26;
        }

        return i;
      }, E.prototype.convertTo = function (e) {
        var t = e.umod(this.m);
        return t === e ? t.clone() : t;
      }, E.prototype.convertFrom = function (e) {
        var t = e.clone();
        return t.red = null, t;
      }, o.mont = function (e) {
        return new M(e);
      }, i(M, E), M.prototype.convertTo = function (e) {
        return this.imod(e.ushln(this.shift));
      }, M.prototype.convertFrom = function (e) {
        var t = this.imod(e.mul(this.rinv));
        return t.red = null, t;
      }, M.prototype.imul = function (e, t) {
        if (e.isZero() || t.isZero()) return e.words[0] = 0, e.length = 1, e;
        var r = e.imul(t),
            n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
            i = r.isub(n).iushrn(this.shift),
            o = i;
        return i.cmp(this.m) >= 0 ? o = i.isub(this.m) : i.cmpn(0) < 0 && (o = i.iadd(this.m)), o._forceRed(this);
      }, M.prototype.mul = function (e, t) {
        if (e.isZero() || t.isZero()) return new o(0)._forceRed(this);
        var r = e.mul(t),
            n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
            i = r.isub(n).iushrn(this.shift),
            a = i;
        return i.cmp(this.m) >= 0 ? a = i.isub(this.m) : i.cmpn(0) < 0 && (a = i.iadd(this.m)), a._forceRed(this);
      }, M.prototype.invm = function (e) {
        return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);
      };
    }(void 0 === t || t, this);
  }, {
    buffer: 19
  }],
  16: [function (e, t, r) {
    "use strict";

    r.byteLength = function (e) {
      var t = u(e),
          r = t[0],
          n = t[1];
      return 3 * (r + n) / 4 - n;
    }, r.toByteArray = function (e) {
      var t,
          r,
          n = u(e),
          a = n[0],
          s = n[1],
          f = new o(function (e, t, r) {
        return 3 * (t + r) / 4 - r;
      }(0, a, s)),
          c = 0,
          h = s > 0 ? a - 4 : a;

      for (r = 0; r < h; r += 4) {
        t = i[e.charCodeAt(r)] << 18 | i[e.charCodeAt(r + 1)] << 12 | i[e.charCodeAt(r + 2)] << 6 | i[e.charCodeAt(r + 3)], f[c++] = t >> 16 & 255, f[c++] = t >> 8 & 255, f[c++] = 255 & t;
      }

      2 === s && (t = i[e.charCodeAt(r)] << 2 | i[e.charCodeAt(r + 1)] >> 4, f[c++] = 255 & t);
      1 === s && (t = i[e.charCodeAt(r)] << 10 | i[e.charCodeAt(r + 1)] << 4 | i[e.charCodeAt(r + 2)] >> 2, f[c++] = t >> 8 & 255, f[c++] = 255 & t);
      return f;
    }, r.fromByteArray = function (e) {
      for (var t, r = e.length, i = r % 3, o = [], a = 0, s = r - i; a < s; a += 16383) {
        o.push(c(e, a, a + 16383 > s ? s : a + 16383));
      }

      1 === i ? (t = e[r - 1], o.push(n[t >> 2] + n[t << 4 & 63] + "==")) : 2 === i && (t = (e[r - 2] << 8) + e[r - 1], o.push(n[t >> 10] + n[t >> 4 & 63] + n[t << 2 & 63] + "="));
      return o.join("");
    };

    for (var n = [], i = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, f = a.length; s < f; ++s) {
      n[s] = a[s], i[a.charCodeAt(s)] = s;
    }

    function u(e) {
      var t = e.length;
      if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var r = e.indexOf("=");
      return -1 === r && (r = t), [r, r === t ? 0 : 4 - r % 4];
    }

    function c(e, t, r) {
      for (var i, o, a = [], s = t; s < r; s += 3) {
        i = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2]), a.push(n[(o = i) >> 18 & 63] + n[o >> 12 & 63] + n[o >> 6 & 63] + n[63 & o]);
      }

      return a.join("");
    }

    i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63;
  }, {}],
  17: [function (e, t, r) {
    !function (t, r) {
      "use strict";

      function n(e, t) {
        if (!e) throw new Error(t || "Assertion failed");
      }

      function i(e, t) {
        e.super_ = t;

        var r = function r() {};

        r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
      }

      function o(e, t, r) {
        if (o.isBN(e)) return e;
        this.negative = 0, this.words = null, this.length = 0, this.red = null, null !== e && ("le" !== t && "be" !== t || (r = t, t = 10), this._init(e || 0, t || 10, r || "be"));
      }

      var a;
      "object" == _typeof(t) ? t.exports = o : r.BN = o, o.BN = o, o.wordSize = 26;

      try {
        a = e("buffer").Buffer;
      } catch (e) {}

      function s(e, t, r) {
        for (var i = 0, o = Math.min(e.length, r), a = 0, s = t; s < o; s++) {
          var f,
              u = e.charCodeAt(s) - 48;
          i <<= 4, i |= f = u >= 49 && u <= 54 ? u - 49 + 10 : u >= 17 && u <= 22 ? u - 17 + 10 : u, a |= f;
        }

        return n(!(240 & a), "Invalid character in " + e), i;
      }

      function f(e, t, r, i) {
        for (var o = 0, a = 0, s = Math.min(e.length, r), f = t; f < s; f++) {
          var u = e.charCodeAt(f) - 48;
          o *= i, a = u >= 49 ? u - 49 + 10 : u >= 17 ? u - 17 + 10 : u, n(u >= 0 && a < i, "Invalid character"), o += a;
        }

        return o;
      }

      function u(e, t) {
        e.words = t.words, e.length = t.length, e.negative = t.negative, e.red = t.red;
      }

      if (o.isBN = function (e) {
        return e instanceof o || null !== e && "object" == _typeof(e) && e.constructor.wordSize === o.wordSize && Array.isArray(e.words);
      }, o.max = function (e, t) {
        return e.cmp(t) > 0 ? e : t;
      }, o.min = function (e, t) {
        return e.cmp(t) < 0 ? e : t;
      }, o.prototype._init = function (e, t, r) {
        if ("number" == typeof e) return this._initNumber(e, t, r);
        if ("object" == _typeof(e)) return this._initArray(e, t, r);
        "hex" === t && (t = 16), n(t === (0 | t) && t >= 2 && t <= 36);
        var i = 0;
        "-" === (e = e.toString().replace(/\s+/g, ""))[0] && i++, 16 === t ? this._parseHex(e, i) : this._parseBase(e, t, i), "-" === e[0] && (this.negative = 1), this._strip(), "le" === r && this._initArray(this.toArray(), t, r);
      }, o.prototype._initNumber = function (e, t, r) {
        e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [67108863 & e], this.length = 1) : e < 4503599627370496 ? (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2) : (n(e < 9007199254740992), this.words = [67108863 & e, e / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), t, r);
      }, o.prototype._initArray = function (e, t, r) {
        if (n("number" == typeof e.length), e.length <= 0) return this.words = [0], this.length = 1, this;
        this.length = Math.ceil(e.length / 3), this.words = new Array(this.length);

        for (var i = 0; i < this.length; i++) {
          this.words[i] = 0;
        }

        var o,
            a,
            s = 0;
        if ("be" === r) for (i = e.length - 1, o = 0; i >= 0; i -= 3) {
          a = e[i] | e[i - 1] << 8 | e[i - 2] << 16, this.words[o] |= a << s & 67108863, this.words[o + 1] = a >>> 26 - s & 67108863, (s += 24) >= 26 && (s -= 26, o++);
        } else if ("le" === r) for (i = 0, o = 0; i < e.length; i += 3) {
          a = e[i] | e[i + 1] << 8 | e[i + 2] << 16, this.words[o] |= a << s & 67108863, this.words[o + 1] = a >>> 26 - s & 67108863, (s += 24) >= 26 && (s -= 26, o++);
        }
        return this._strip();
      }, o.prototype._parseHex = function (e, t) {
        this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length);

        for (var r = 0; r < this.length; r++) {
          this.words[r] = 0;
        }

        var n,
            i,
            o = 0;

        for (r = e.length - 6, n = 0; r >= t; r -= 6) {
          i = s(e, r, r + 6), this.words[n] |= i << o & 67108863, this.words[n + 1] |= i >>> 26 - o & 4194303, (o += 24) >= 26 && (o -= 26, n++);
        }

        r + 6 !== t && (i = s(e, t, r + 6), this.words[n] |= i << o & 67108863, this.words[n + 1] |= i >>> 26 - o & 4194303), this._strip();
      }, o.prototype._parseBase = function (e, t, r) {
        this.words = [0], this.length = 1;

        for (var n = 0, i = 1; i <= 67108863; i *= t) {
          n++;
        }

        n--, i = i / t | 0;

        for (var o = e.length - r, a = o % n, s = Math.min(o, o - a) + r, u = 0, c = r; c < s; c += n) {
          u = f(e, c, c + n, t), this.imuln(i), this.words[0] + u < 67108864 ? this.words[0] += u : this._iaddn(u);
        }

        if (0 !== a) {
          var h = 1;

          for (u = f(e, c, e.length, t), c = 0; c < a; c++) {
            h *= t;
          }

          this.imuln(h), this.words[0] + u < 67108864 ? this.words[0] += u : this._iaddn(u);
        }
      }, o.prototype.copy = function (e) {
        e.words = new Array(this.length);

        for (var t = 0; t < this.length; t++) {
          e.words[t] = this.words[t];
        }

        e.length = this.length, e.negative = this.negative, e.red = this.red;
      }, o.prototype._move = function (e) {
        u(e, this);
      }, o.prototype.clone = function () {
        var e = new o(null);
        return this.copy(e), e;
      }, o.prototype._expand = function (e) {
        for (; this.length < e;) {
          this.words[this.length++] = 0;
        }

        return this;
      }, o.prototype._strip = function () {
        for (; this.length > 1 && 0 === this.words[this.length - 1];) {
          this.length--;
        }

        return this._normSign();
      }, o.prototype._normSign = function () {
        return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this;
      }, "undefined" != typeof Symbol && "function" == typeof Symbol["for"]) try {
        o.prototype[Symbol["for"]("nodejs.util.inspect.custom")] = c;
      } catch (e) {
        o.prototype.inspect = c;
      } else o.prototype.inspect = c;

      function c() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      }

      var h = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],
          d = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          l = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
      o.prototype.toString = function (e, t) {
        var r;

        if (t = 0 | t || 1, 16 === (e = e || 10) || "hex" === e) {
          r = "";

          for (var i = 0, o = 0, a = 0; a < this.length; a++) {
            var s = this.words[a],
                f = (16777215 & (s << i | o)).toString(16);
            r = 0 !== (o = s >>> 24 - i & 16777215) || a !== this.length - 1 ? h[6 - f.length] + f + r : f + r, (i += 2) >= 26 && (i -= 26, a--);
          }

          for (0 !== o && (r = o.toString(16) + r); r.length % t != 0;) {
            r = "0" + r;
          }

          return 0 !== this.negative && (r = "-" + r), r;
        }

        if (e === (0 | e) && e >= 2 && e <= 36) {
          var u = d[e],
              c = l[e];
          r = "";
          var p = this.clone();

          for (p.negative = 0; !p.isZero();) {
            var b = p.modrn(c).toString(e);
            r = (p = p.idivn(c)).isZero() ? b + r : h[u - b.length] + b + r;
          }

          for (this.isZero() && (r = "0" + r); r.length % t != 0;) {
            r = "0" + r;
          }

          return 0 !== this.negative && (r = "-" + r), r;
        }

        n(!1, "Base should be between 2 and 36");
      }, o.prototype.toNumber = function () {
        var e = this.words[0];
        return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && n(!1, "Number can only safely store up to 53 bits"), 0 !== this.negative ? -e : e;
      }, o.prototype.toJSON = function () {
        return this.toString(16, 2);
      }, a && (o.prototype.toBuffer = function (e, t) {
        return this.toArrayLike(a, e, t);
      }), o.prototype.toArray = function (e, t) {
        return this.toArrayLike(Array, e, t);
      };

      function p(e, t, r) {
        r.negative = t.negative ^ e.negative;
        var n = e.length + t.length | 0;
        r.length = n, n = n - 1 | 0;
        var i = 0 | e.words[0],
            o = 0 | t.words[0],
            a = i * o,
            s = 67108863 & a,
            f = a / 67108864 | 0;
        r.words[0] = s;

        for (var u = 1; u < n; u++) {
          for (var c = f >>> 26, h = 67108863 & f, d = Math.min(u, t.length - 1), l = Math.max(0, u - e.length + 1); l <= d; l++) {
            var p = u - l | 0;
            c += (a = (i = 0 | e.words[p]) * (o = 0 | t.words[l]) + h) / 67108864 | 0, h = 67108863 & a;
          }

          r.words[u] = 0 | h, f = 0 | c;
        }

        return 0 !== f ? r.words[u] = 0 | f : r.length--, r._strip();
      }

      o.prototype.toArrayLike = function (e, t, r) {
        this._strip();

        var i = this.byteLength(),
            o = r || Math.max(1, i);
        n(i <= o, "byte array longer than desired length"), n(o > 0, "Requested array length <= 0");

        var a = function (e, t) {
          return e.allocUnsafe ? e.allocUnsafe(t) : new e(t);
        }(e, o);

        return this["_toArrayLike" + ("le" === t ? "LE" : "BE")](a, i), a;
      }, o.prototype._toArrayLikeLE = function (e, t) {
        for (var r = 0, n = 0, i = 0, o = 0; i < this.length; i++) {
          var a = this.words[i] << o | n;
          e[r++] = 255 & a, r < e.length && (e[r++] = a >> 8 & 255), r < e.length && (e[r++] = a >> 16 & 255), 6 === o ? (r < e.length && (e[r++] = a >> 24 & 255), n = 0, o = 0) : (n = a >>> 24, o += 2);
        }

        if (r < e.length) for (e[r++] = n; r < e.length;) {
          e[r++] = 0;
        }
      }, o.prototype._toArrayLikeBE = function (e, t) {
        for (var r = e.length - 1, n = 0, i = 0, o = 0; i < this.length; i++) {
          var a = this.words[i] << o | n;
          e[r--] = 255 & a, r >= 0 && (e[r--] = a >> 8 & 255), r >= 0 && (e[r--] = a >> 16 & 255), 6 === o ? (r >= 0 && (e[r--] = a >> 24 & 255), n = 0, o = 0) : (n = a >>> 24, o += 2);
        }

        if (r >= 0) for (e[r--] = n; r >= 0;) {
          e[r--] = 0;
        }
      }, Math.clz32 ? o.prototype._countBits = function (e) {
        return 32 - Math.clz32(e);
      } : o.prototype._countBits = function (e) {
        var t = e,
            r = 0;
        return t >= 4096 && (r += 13, t >>>= 13), t >= 64 && (r += 7, t >>>= 7), t >= 8 && (r += 4, t >>>= 4), t >= 2 && (r += 2, t >>>= 2), r + t;
      }, o.prototype._zeroBits = function (e) {
        if (0 === e) return 26;
        var t = e,
            r = 0;
        return 0 == (8191 & t) && (r += 13, t >>>= 13), 0 == (127 & t) && (r += 7, t >>>= 7), 0 == (15 & t) && (r += 4, t >>>= 4), 0 == (3 & t) && (r += 2, t >>>= 2), 0 == (1 & t) && r++, r;
      }, o.prototype.bitLength = function () {
        var e = this.words[this.length - 1],
            t = this._countBits(e);

        return 26 * (this.length - 1) + t;
      }, o.prototype.zeroBits = function () {
        if (this.isZero()) return 0;

        for (var e = 0, t = 0; t < this.length; t++) {
          var r = this._zeroBits(this.words[t]);

          if (e += r, 26 !== r) break;
        }

        return e;
      }, o.prototype.byteLength = function () {
        return Math.ceil(this.bitLength() / 8);
      }, o.prototype.toTwos = function (e) {
        return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone();
      }, o.prototype.fromTwos = function (e) {
        return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone();
      }, o.prototype.isNeg = function () {
        return 0 !== this.negative;
      }, o.prototype.neg = function () {
        return this.clone().ineg();
      }, o.prototype.ineg = function () {
        return this.isZero() || (this.negative ^= 1), this;
      }, o.prototype.iuor = function (e) {
        for (; this.length < e.length;) {
          this.words[this.length++] = 0;
        }

        for (var t = 0; t < e.length; t++) {
          this.words[t] = this.words[t] | e.words[t];
        }

        return this._strip();
      }, o.prototype.ior = function (e) {
        return n(0 == (this.negative | e.negative)), this.iuor(e);
      }, o.prototype.or = function (e) {
        return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this);
      }, o.prototype.uor = function (e) {
        return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this);
      }, o.prototype.iuand = function (e) {
        var t;
        t = this.length > e.length ? e : this;

        for (var r = 0; r < t.length; r++) {
          this.words[r] = this.words[r] & e.words[r];
        }

        return this.length = t.length, this._strip();
      }, o.prototype.iand = function (e) {
        return n(0 == (this.negative | e.negative)), this.iuand(e);
      }, o.prototype.and = function (e) {
        return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this);
      }, o.prototype.uand = function (e) {
        return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this);
      }, o.prototype.iuxor = function (e) {
        var t, r;
        this.length > e.length ? (t = this, r = e) : (t = e, r = this);

        for (var n = 0; n < r.length; n++) {
          this.words[n] = t.words[n] ^ r.words[n];
        }

        if (this !== t) for (; n < t.length; n++) {
          this.words[n] = t.words[n];
        }
        return this.length = t.length, this._strip();
      }, o.prototype.ixor = function (e) {
        return n(0 == (this.negative | e.negative)), this.iuxor(e);
      }, o.prototype.xor = function (e) {
        return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this);
      }, o.prototype.uxor = function (e) {
        return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this);
      }, o.prototype.inotn = function (e) {
        n("number" == typeof e && e >= 0);
        var t = 0 | Math.ceil(e / 26),
            r = e % 26;
        this._expand(t), r > 0 && t--;

        for (var i = 0; i < t; i++) {
          this.words[i] = 67108863 & ~this.words[i];
        }

        return r > 0 && (this.words[i] = ~this.words[i] & 67108863 >> 26 - r), this._strip();
      }, o.prototype.notn = function (e) {
        return this.clone().inotn(e);
      }, o.prototype.setn = function (e, t) {
        n("number" == typeof e && e >= 0);
        var r = e / 26 | 0,
            i = e % 26;
        return this._expand(r + 1), this.words[r] = t ? this.words[r] | 1 << i : this.words[r] & ~(1 << i), this._strip();
      }, o.prototype.iadd = function (e) {
        var t, r, n;
        if (0 !== this.negative && 0 === e.negative) return this.negative = 0, t = this.isub(e), this.negative ^= 1, this._normSign();
        if (0 === this.negative && 0 !== e.negative) return e.negative = 0, t = this.isub(e), e.negative = 1, t._normSign();
        this.length > e.length ? (r = this, n = e) : (r = e, n = this);

        for (var i = 0, o = 0; o < n.length; o++) {
          t = (0 | r.words[o]) + (0 | n.words[o]) + i, this.words[o] = 67108863 & t, i = t >>> 26;
        }

        for (; 0 !== i && o < r.length; o++) {
          t = (0 | r.words[o]) + i, this.words[o] = 67108863 & t, i = t >>> 26;
        }

        if (this.length = r.length, 0 !== i) this.words[this.length] = i, this.length++;else if (r !== this) for (; o < r.length; o++) {
          this.words[o] = r.words[o];
        }
        return this;
      }, o.prototype.add = function (e) {
        var t;
        return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this);
      }, o.prototype.isub = function (e) {
        if (0 !== e.negative) {
          e.negative = 0;
          var t = this.iadd(e);
          return e.negative = 1, t._normSign();
        }

        if (0 !== this.negative) return this.negative = 0, this.iadd(e), this.negative = 1, this._normSign();
        var r,
            n,
            i = this.cmp(e);
        if (0 === i) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
        i > 0 ? (r = this, n = e) : (r = e, n = this);

        for (var o = 0, a = 0; a < n.length; a++) {
          o = (t = (0 | r.words[a]) - (0 | n.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        }

        for (; 0 !== o && a < r.length; a++) {
          o = (t = (0 | r.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        }

        if (0 === o && a < r.length && r !== this) for (; a < r.length; a++) {
          this.words[a] = r.words[a];
        }
        return this.length = Math.max(this.length, a), r !== this && (this.negative = 1), this._strip();
      }, o.prototype.sub = function (e) {
        return this.clone().isub(e);
      };

      var b = function b(e, t, r) {
        var n,
            i,
            o,
            a = e.words,
            s = t.words,
            f = r.words,
            u = 0,
            c = 0 | a[0],
            h = 8191 & c,
            d = c >>> 13,
            l = 0 | a[1],
            p = 8191 & l,
            b = l >>> 13,
            m = 0 | a[2],
            y = 8191 & m,
            g = m >>> 13,
            v = 0 | a[3],
            w = 8191 & v,
            _ = v >>> 13,
            E = 0 | a[4],
            M = 8191 & E,
            S = E >>> 13,
            k = 0 | a[5],
            A = 8191 & k,
            x = k >>> 13,
            R = 0 | a[6],
            I = 8191 & R,
            B = R >>> 13,
            T = 0 | a[7],
            j = 8191 & T,
            D = T >>> 13,
            P = 0 | a[8],
            O = 8191 & P,
            C = P >>> 13,
            L = 0 | a[9],
            N = 8191 & L,
            U = L >>> 13,
            q = 0 | s[0],
            z = 8191 & q,
            F = q >>> 13,
            H = 0 | s[1],
            K = 8191 & H,
            W = H >>> 13,
            V = 0 | s[2],
            X = 8191 & V,
            G = V >>> 13,
            Z = 0 | s[3],
            Y = 8191 & Z,
            J = Z >>> 13,
            $ = 0 | s[4],
            Q = 8191 & $,
            ee = $ >>> 13,
            te = 0 | s[5],
            re = 8191 & te,
            ne = te >>> 13,
            ie = 0 | s[6],
            oe = 8191 & ie,
            ae = ie >>> 13,
            se = 0 | s[7],
            fe = 8191 & se,
            ue = se >>> 13,
            ce = 0 | s[8],
            he = 8191 & ce,
            de = ce >>> 13,
            le = 0 | s[9],
            pe = 8191 & le,
            be = le >>> 13;

        r.negative = e.negative ^ t.negative, r.length = 19;
        var me = (u + (n = Math.imul(h, z)) | 0) + ((8191 & (i = (i = Math.imul(h, F)) + Math.imul(d, z) | 0)) << 13) | 0;
        u = ((o = Math.imul(d, F)) + (i >>> 13) | 0) + (me >>> 26) | 0, me &= 67108863, n = Math.imul(p, z), i = (i = Math.imul(p, F)) + Math.imul(b, z) | 0, o = Math.imul(b, F);
        var ye = (u + (n = n + Math.imul(h, K) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, W) | 0) + Math.imul(d, K) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, W) | 0) + (i >>> 13) | 0) + (ye >>> 26) | 0, ye &= 67108863, n = Math.imul(y, z), i = (i = Math.imul(y, F)) + Math.imul(g, z) | 0, o = Math.imul(g, F), n = n + Math.imul(p, K) | 0, i = (i = i + Math.imul(p, W) | 0) + Math.imul(b, K) | 0, o = o + Math.imul(b, W) | 0;
        var ge = (u + (n = n + Math.imul(h, X) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, G) | 0) + Math.imul(d, X) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, G) | 0) + (i >>> 13) | 0) + (ge >>> 26) | 0, ge &= 67108863, n = Math.imul(w, z), i = (i = Math.imul(w, F)) + Math.imul(_, z) | 0, o = Math.imul(_, F), n = n + Math.imul(y, K) | 0, i = (i = i + Math.imul(y, W) | 0) + Math.imul(g, K) | 0, o = o + Math.imul(g, W) | 0, n = n + Math.imul(p, X) | 0, i = (i = i + Math.imul(p, G) | 0) + Math.imul(b, X) | 0, o = o + Math.imul(b, G) | 0;
        var ve = (u + (n = n + Math.imul(h, Y) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, J) | 0) + Math.imul(d, Y) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, J) | 0) + (i >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, n = Math.imul(M, z), i = (i = Math.imul(M, F)) + Math.imul(S, z) | 0, o = Math.imul(S, F), n = n + Math.imul(w, K) | 0, i = (i = i + Math.imul(w, W) | 0) + Math.imul(_, K) | 0, o = o + Math.imul(_, W) | 0, n = n + Math.imul(y, X) | 0, i = (i = i + Math.imul(y, G) | 0) + Math.imul(g, X) | 0, o = o + Math.imul(g, G) | 0, n = n + Math.imul(p, Y) | 0, i = (i = i + Math.imul(p, J) | 0) + Math.imul(b, Y) | 0, o = o + Math.imul(b, J) | 0;
        var we = (u + (n = n + Math.imul(h, Q) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, ee) | 0) + Math.imul(d, Q) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ee) | 0) + (i >>> 13) | 0) + (we >>> 26) | 0, we &= 67108863, n = Math.imul(A, z), i = (i = Math.imul(A, F)) + Math.imul(x, z) | 0, o = Math.imul(x, F), n = n + Math.imul(M, K) | 0, i = (i = i + Math.imul(M, W) | 0) + Math.imul(S, K) | 0, o = o + Math.imul(S, W) | 0, n = n + Math.imul(w, X) | 0, i = (i = i + Math.imul(w, G) | 0) + Math.imul(_, X) | 0, o = o + Math.imul(_, G) | 0, n = n + Math.imul(y, Y) | 0, i = (i = i + Math.imul(y, J) | 0) + Math.imul(g, Y) | 0, o = o + Math.imul(g, J) | 0, n = n + Math.imul(p, Q) | 0, i = (i = i + Math.imul(p, ee) | 0) + Math.imul(b, Q) | 0, o = o + Math.imul(b, ee) | 0;

        var _e = (u + (n = n + Math.imul(h, re) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, ne) | 0) + Math.imul(d, re) | 0)) << 13) | 0;

        u = ((o = o + Math.imul(d, ne) | 0) + (i >>> 13) | 0) + (_e >>> 26) | 0, _e &= 67108863, n = Math.imul(I, z), i = (i = Math.imul(I, F)) + Math.imul(B, z) | 0, o = Math.imul(B, F), n = n + Math.imul(A, K) | 0, i = (i = i + Math.imul(A, W) | 0) + Math.imul(x, K) | 0, o = o + Math.imul(x, W) | 0, n = n + Math.imul(M, X) | 0, i = (i = i + Math.imul(M, G) | 0) + Math.imul(S, X) | 0, o = o + Math.imul(S, G) | 0, n = n + Math.imul(w, Y) | 0, i = (i = i + Math.imul(w, J) | 0) + Math.imul(_, Y) | 0, o = o + Math.imul(_, J) | 0, n = n + Math.imul(y, Q) | 0, i = (i = i + Math.imul(y, ee) | 0) + Math.imul(g, Q) | 0, o = o + Math.imul(g, ee) | 0, n = n + Math.imul(p, re) | 0, i = (i = i + Math.imul(p, ne) | 0) + Math.imul(b, re) | 0, o = o + Math.imul(b, ne) | 0;
        var Ee = (u + (n = n + Math.imul(h, oe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, ae) | 0) + Math.imul(d, oe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ae) | 0) + (i >>> 13) | 0) + (Ee >>> 26) | 0, Ee &= 67108863, n = Math.imul(j, z), i = (i = Math.imul(j, F)) + Math.imul(D, z) | 0, o = Math.imul(D, F), n = n + Math.imul(I, K) | 0, i = (i = i + Math.imul(I, W) | 0) + Math.imul(B, K) | 0, o = o + Math.imul(B, W) | 0, n = n + Math.imul(A, X) | 0, i = (i = i + Math.imul(A, G) | 0) + Math.imul(x, X) | 0, o = o + Math.imul(x, G) | 0, n = n + Math.imul(M, Y) | 0, i = (i = i + Math.imul(M, J) | 0) + Math.imul(S, Y) | 0, o = o + Math.imul(S, J) | 0, n = n + Math.imul(w, Q) | 0, i = (i = i + Math.imul(w, ee) | 0) + Math.imul(_, Q) | 0, o = o + Math.imul(_, ee) | 0, n = n + Math.imul(y, re) | 0, i = (i = i + Math.imul(y, ne) | 0) + Math.imul(g, re) | 0, o = o + Math.imul(g, ne) | 0, n = n + Math.imul(p, oe) | 0, i = (i = i + Math.imul(p, ae) | 0) + Math.imul(b, oe) | 0, o = o + Math.imul(b, ae) | 0;
        var Me = (u + (n = n + Math.imul(h, fe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, ue) | 0) + Math.imul(d, fe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ue) | 0) + (i >>> 13) | 0) + (Me >>> 26) | 0, Me &= 67108863, n = Math.imul(O, z), i = (i = Math.imul(O, F)) + Math.imul(C, z) | 0, o = Math.imul(C, F), n = n + Math.imul(j, K) | 0, i = (i = i + Math.imul(j, W) | 0) + Math.imul(D, K) | 0, o = o + Math.imul(D, W) | 0, n = n + Math.imul(I, X) | 0, i = (i = i + Math.imul(I, G) | 0) + Math.imul(B, X) | 0, o = o + Math.imul(B, G) | 0, n = n + Math.imul(A, Y) | 0, i = (i = i + Math.imul(A, J) | 0) + Math.imul(x, Y) | 0, o = o + Math.imul(x, J) | 0, n = n + Math.imul(M, Q) | 0, i = (i = i + Math.imul(M, ee) | 0) + Math.imul(S, Q) | 0, o = o + Math.imul(S, ee) | 0, n = n + Math.imul(w, re) | 0, i = (i = i + Math.imul(w, ne) | 0) + Math.imul(_, re) | 0, o = o + Math.imul(_, ne) | 0, n = n + Math.imul(y, oe) | 0, i = (i = i + Math.imul(y, ae) | 0) + Math.imul(g, oe) | 0, o = o + Math.imul(g, ae) | 0, n = n + Math.imul(p, fe) | 0, i = (i = i + Math.imul(p, ue) | 0) + Math.imul(b, fe) | 0, o = o + Math.imul(b, ue) | 0;
        var Se = (u + (n = n + Math.imul(h, he) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, de) | 0) + Math.imul(d, he) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, de) | 0) + (i >>> 13) | 0) + (Se >>> 26) | 0, Se &= 67108863, n = Math.imul(N, z), i = (i = Math.imul(N, F)) + Math.imul(U, z) | 0, o = Math.imul(U, F), n = n + Math.imul(O, K) | 0, i = (i = i + Math.imul(O, W) | 0) + Math.imul(C, K) | 0, o = o + Math.imul(C, W) | 0, n = n + Math.imul(j, X) | 0, i = (i = i + Math.imul(j, G) | 0) + Math.imul(D, X) | 0, o = o + Math.imul(D, G) | 0, n = n + Math.imul(I, Y) | 0, i = (i = i + Math.imul(I, J) | 0) + Math.imul(B, Y) | 0, o = o + Math.imul(B, J) | 0, n = n + Math.imul(A, Q) | 0, i = (i = i + Math.imul(A, ee) | 0) + Math.imul(x, Q) | 0, o = o + Math.imul(x, ee) | 0, n = n + Math.imul(M, re) | 0, i = (i = i + Math.imul(M, ne) | 0) + Math.imul(S, re) | 0, o = o + Math.imul(S, ne) | 0, n = n + Math.imul(w, oe) | 0, i = (i = i + Math.imul(w, ae) | 0) + Math.imul(_, oe) | 0, o = o + Math.imul(_, ae) | 0, n = n + Math.imul(y, fe) | 0, i = (i = i + Math.imul(y, ue) | 0) + Math.imul(g, fe) | 0, o = o + Math.imul(g, ue) | 0, n = n + Math.imul(p, he) | 0, i = (i = i + Math.imul(p, de) | 0) + Math.imul(b, he) | 0, o = o + Math.imul(b, de) | 0;
        var ke = (u + (n = n + Math.imul(h, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, be) | 0) + Math.imul(d, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, be) | 0) + (i >>> 13) | 0) + (ke >>> 26) | 0, ke &= 67108863, n = Math.imul(N, K), i = (i = Math.imul(N, W)) + Math.imul(U, K) | 0, o = Math.imul(U, W), n = n + Math.imul(O, X) | 0, i = (i = i + Math.imul(O, G) | 0) + Math.imul(C, X) | 0, o = o + Math.imul(C, G) | 0, n = n + Math.imul(j, Y) | 0, i = (i = i + Math.imul(j, J) | 0) + Math.imul(D, Y) | 0, o = o + Math.imul(D, J) | 0, n = n + Math.imul(I, Q) | 0, i = (i = i + Math.imul(I, ee) | 0) + Math.imul(B, Q) | 0, o = o + Math.imul(B, ee) | 0, n = n + Math.imul(A, re) | 0, i = (i = i + Math.imul(A, ne) | 0) + Math.imul(x, re) | 0, o = o + Math.imul(x, ne) | 0, n = n + Math.imul(M, oe) | 0, i = (i = i + Math.imul(M, ae) | 0) + Math.imul(S, oe) | 0, o = o + Math.imul(S, ae) | 0, n = n + Math.imul(w, fe) | 0, i = (i = i + Math.imul(w, ue) | 0) + Math.imul(_, fe) | 0, o = o + Math.imul(_, ue) | 0, n = n + Math.imul(y, he) | 0, i = (i = i + Math.imul(y, de) | 0) + Math.imul(g, he) | 0, o = o + Math.imul(g, de) | 0;
        var Ae = (u + (n = n + Math.imul(p, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(p, be) | 0) + Math.imul(b, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(b, be) | 0) + (i >>> 13) | 0) + (Ae >>> 26) | 0, Ae &= 67108863, n = Math.imul(N, X), i = (i = Math.imul(N, G)) + Math.imul(U, X) | 0, o = Math.imul(U, G), n = n + Math.imul(O, Y) | 0, i = (i = i + Math.imul(O, J) | 0) + Math.imul(C, Y) | 0, o = o + Math.imul(C, J) | 0, n = n + Math.imul(j, Q) | 0, i = (i = i + Math.imul(j, ee) | 0) + Math.imul(D, Q) | 0, o = o + Math.imul(D, ee) | 0, n = n + Math.imul(I, re) | 0, i = (i = i + Math.imul(I, ne) | 0) + Math.imul(B, re) | 0, o = o + Math.imul(B, ne) | 0, n = n + Math.imul(A, oe) | 0, i = (i = i + Math.imul(A, ae) | 0) + Math.imul(x, oe) | 0, o = o + Math.imul(x, ae) | 0, n = n + Math.imul(M, fe) | 0, i = (i = i + Math.imul(M, ue) | 0) + Math.imul(S, fe) | 0, o = o + Math.imul(S, ue) | 0, n = n + Math.imul(w, he) | 0, i = (i = i + Math.imul(w, de) | 0) + Math.imul(_, he) | 0, o = o + Math.imul(_, de) | 0;
        var xe = (u + (n = n + Math.imul(y, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(y, be) | 0) + Math.imul(g, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(g, be) | 0) + (i >>> 13) | 0) + (xe >>> 26) | 0, xe &= 67108863, n = Math.imul(N, Y), i = (i = Math.imul(N, J)) + Math.imul(U, Y) | 0, o = Math.imul(U, J), n = n + Math.imul(O, Q) | 0, i = (i = i + Math.imul(O, ee) | 0) + Math.imul(C, Q) | 0, o = o + Math.imul(C, ee) | 0, n = n + Math.imul(j, re) | 0, i = (i = i + Math.imul(j, ne) | 0) + Math.imul(D, re) | 0, o = o + Math.imul(D, ne) | 0, n = n + Math.imul(I, oe) | 0, i = (i = i + Math.imul(I, ae) | 0) + Math.imul(B, oe) | 0, o = o + Math.imul(B, ae) | 0, n = n + Math.imul(A, fe) | 0, i = (i = i + Math.imul(A, ue) | 0) + Math.imul(x, fe) | 0, o = o + Math.imul(x, ue) | 0, n = n + Math.imul(M, he) | 0, i = (i = i + Math.imul(M, de) | 0) + Math.imul(S, he) | 0, o = o + Math.imul(S, de) | 0;
        var Re = (u + (n = n + Math.imul(w, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(w, be) | 0) + Math.imul(_, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(_, be) | 0) + (i >>> 13) | 0) + (Re >>> 26) | 0, Re &= 67108863, n = Math.imul(N, Q), i = (i = Math.imul(N, ee)) + Math.imul(U, Q) | 0, o = Math.imul(U, ee), n = n + Math.imul(O, re) | 0, i = (i = i + Math.imul(O, ne) | 0) + Math.imul(C, re) | 0, o = o + Math.imul(C, ne) | 0, n = n + Math.imul(j, oe) | 0, i = (i = i + Math.imul(j, ae) | 0) + Math.imul(D, oe) | 0, o = o + Math.imul(D, ae) | 0, n = n + Math.imul(I, fe) | 0, i = (i = i + Math.imul(I, ue) | 0) + Math.imul(B, fe) | 0, o = o + Math.imul(B, ue) | 0, n = n + Math.imul(A, he) | 0, i = (i = i + Math.imul(A, de) | 0) + Math.imul(x, he) | 0, o = o + Math.imul(x, de) | 0;
        var Ie = (u + (n = n + Math.imul(M, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(M, be) | 0) + Math.imul(S, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(S, be) | 0) + (i >>> 13) | 0) + (Ie >>> 26) | 0, Ie &= 67108863, n = Math.imul(N, re), i = (i = Math.imul(N, ne)) + Math.imul(U, re) | 0, o = Math.imul(U, ne), n = n + Math.imul(O, oe) | 0, i = (i = i + Math.imul(O, ae) | 0) + Math.imul(C, oe) | 0, o = o + Math.imul(C, ae) | 0, n = n + Math.imul(j, fe) | 0, i = (i = i + Math.imul(j, ue) | 0) + Math.imul(D, fe) | 0, o = o + Math.imul(D, ue) | 0, n = n + Math.imul(I, he) | 0, i = (i = i + Math.imul(I, de) | 0) + Math.imul(B, he) | 0, o = o + Math.imul(B, de) | 0;
        var Be = (u + (n = n + Math.imul(A, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(A, be) | 0) + Math.imul(x, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(x, be) | 0) + (i >>> 13) | 0) + (Be >>> 26) | 0, Be &= 67108863, n = Math.imul(N, oe), i = (i = Math.imul(N, ae)) + Math.imul(U, oe) | 0, o = Math.imul(U, ae), n = n + Math.imul(O, fe) | 0, i = (i = i + Math.imul(O, ue) | 0) + Math.imul(C, fe) | 0, o = o + Math.imul(C, ue) | 0, n = n + Math.imul(j, he) | 0, i = (i = i + Math.imul(j, de) | 0) + Math.imul(D, he) | 0, o = o + Math.imul(D, de) | 0;
        var Te = (u + (n = n + Math.imul(I, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(I, be) | 0) + Math.imul(B, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(B, be) | 0) + (i >>> 13) | 0) + (Te >>> 26) | 0, Te &= 67108863, n = Math.imul(N, fe), i = (i = Math.imul(N, ue)) + Math.imul(U, fe) | 0, o = Math.imul(U, ue), n = n + Math.imul(O, he) | 0, i = (i = i + Math.imul(O, de) | 0) + Math.imul(C, he) | 0, o = o + Math.imul(C, de) | 0;
        var je = (u + (n = n + Math.imul(j, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(j, be) | 0) + Math.imul(D, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(D, be) | 0) + (i >>> 13) | 0) + (je >>> 26) | 0, je &= 67108863, n = Math.imul(N, he), i = (i = Math.imul(N, de)) + Math.imul(U, he) | 0, o = Math.imul(U, de);
        var De = (u + (n = n + Math.imul(O, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(O, be) | 0) + Math.imul(C, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(C, be) | 0) + (i >>> 13) | 0) + (De >>> 26) | 0, De &= 67108863;
        var Pe = (u + (n = Math.imul(N, pe)) | 0) + ((8191 & (i = (i = Math.imul(N, be)) + Math.imul(U, pe) | 0)) << 13) | 0;
        return u = ((o = Math.imul(U, be)) + (i >>> 13) | 0) + (Pe >>> 26) | 0, Pe &= 67108863, f[0] = me, f[1] = ye, f[2] = ge, f[3] = ve, f[4] = we, f[5] = _e, f[6] = Ee, f[7] = Me, f[8] = Se, f[9] = ke, f[10] = Ae, f[11] = xe, f[12] = Re, f[13] = Ie, f[14] = Be, f[15] = Te, f[16] = je, f[17] = De, f[18] = Pe, 0 !== u && (f[19] = u, r.length++), r;
      };

      function m(e, t, r) {
        r.negative = t.negative ^ e.negative, r.length = e.length + t.length;

        for (var n = 0, i = 0, o = 0; o < r.length - 1; o++) {
          var a = i;
          i = 0;

          for (var s = 67108863 & n, f = Math.min(o, t.length - 1), u = Math.max(0, o - e.length + 1); u <= f; u++) {
            var c = o - u,
                h = (0 | e.words[c]) * (0 | t.words[u]),
                d = 67108863 & h;
            s = 67108863 & (d = d + s | 0), i += (a = (a = a + (h / 67108864 | 0) | 0) + (d >>> 26) | 0) >>> 26, a &= 67108863;
          }

          r.words[o] = s, n = a, a = i;
        }

        return 0 !== n ? r.words[o] = n : r.length--, r._strip();
      }

      function y(e, t, r) {
        return m(e, t, r);
      }

      function g(e, t) {
        this.x = e, this.y = t;
      }

      Math.imul || (b = p), o.prototype.mulTo = function (e, t) {
        var r = this.length + e.length;
        return 10 === this.length && 10 === e.length ? b(this, e, t) : r < 63 ? p(this, e, t) : r < 1024 ? m(this, e, t) : y(this, e, t);
      }, g.prototype.makeRBT = function (e) {
        for (var t = new Array(e), r = o.prototype._countBits(e) - 1, n = 0; n < e; n++) {
          t[n] = this.revBin(n, r, e);
        }

        return t;
      }, g.prototype.revBin = function (e, t, r) {
        if (0 === e || e === r - 1) return e;

        for (var n = 0, i = 0; i < t; i++) {
          n |= (1 & e) << t - i - 1, e >>= 1;
        }

        return n;
      }, g.prototype.permute = function (e, t, r, n, i, o) {
        for (var a = 0; a < o; a++) {
          n[a] = t[e[a]], i[a] = r[e[a]];
        }
      }, g.prototype.transform = function (e, t, r, n, i, o) {
        this.permute(o, e, t, r, n, i);

        for (var a = 1; a < i; a <<= 1) {
          for (var s = a << 1, f = Math.cos(2 * Math.PI / s), u = Math.sin(2 * Math.PI / s), c = 0; c < i; c += s) {
            for (var h = f, d = u, l = 0; l < a; l++) {
              var p = r[c + l],
                  b = n[c + l],
                  m = r[c + l + a],
                  y = n[c + l + a],
                  g = h * m - d * y;
              y = h * y + d * m, m = g, r[c + l] = p + m, n[c + l] = b + y, r[c + l + a] = p - m, n[c + l + a] = b - y, l !== s && (g = f * h - u * d, d = f * d + u * h, h = g);
            }
          }
        }
      }, g.prototype.guessLen13b = function (e, t) {
        var r = 1 | Math.max(t, e),
            n = 1 & r,
            i = 0;

        for (r = r / 2 | 0; r; r >>>= 1) {
          i++;
        }

        return 1 << i + 1 + n;
      }, g.prototype.conjugate = function (e, t, r) {
        if (!(r <= 1)) for (var n = 0; n < r / 2; n++) {
          var i = e[n];
          e[n] = e[r - n - 1], e[r - n - 1] = i, i = t[n], t[n] = -t[r - n - 1], t[r - n - 1] = -i;
        }
      }, g.prototype.normalize13b = function (e, t) {
        for (var r = 0, n = 0; n < t / 2; n++) {
          var i = 8192 * Math.round(e[2 * n + 1] / t) + Math.round(e[2 * n] / t) + r;
          e[n] = 67108863 & i, r = i < 67108864 ? 0 : i / 67108864 | 0;
        }

        return e;
      }, g.prototype.convert13b = function (e, t, r, i) {
        for (var o = 0, a = 0; a < t; a++) {
          o += 0 | e[a], r[2 * a] = 8191 & o, o >>>= 13, r[2 * a + 1] = 8191 & o, o >>>= 13;
        }

        for (a = 2 * t; a < i; ++a) {
          r[a] = 0;
        }

        n(0 === o), n(0 == (-8192 & o));
      }, g.prototype.stub = function (e) {
        for (var t = new Array(e), r = 0; r < e; r++) {
          t[r] = 0;
        }

        return t;
      }, g.prototype.mulp = function (e, t, r) {
        var n = 2 * this.guessLen13b(e.length, t.length),
            i = this.makeRBT(n),
            o = this.stub(n),
            a = new Array(n),
            s = new Array(n),
            f = new Array(n),
            u = new Array(n),
            c = new Array(n),
            h = new Array(n),
            d = r.words;
        d.length = n, this.convert13b(e.words, e.length, a, n), this.convert13b(t.words, t.length, u, n), this.transform(a, o, s, f, n, i), this.transform(u, o, c, h, n, i);

        for (var l = 0; l < n; l++) {
          var p = s[l] * c[l] - f[l] * h[l];
          f[l] = s[l] * h[l] + f[l] * c[l], s[l] = p;
        }

        return this.conjugate(s, f, n), this.transform(s, f, d, o, n, i), this.conjugate(d, o, n), this.normalize13b(d, n), r.negative = e.negative ^ t.negative, r.length = e.length + t.length, r._strip();
      }, o.prototype.mul = function (e) {
        var t = new o(null);
        return t.words = new Array(this.length + e.length), this.mulTo(e, t);
      }, o.prototype.mulf = function (e) {
        var t = new o(null);
        return t.words = new Array(this.length + e.length), y(this, e, t);
      }, o.prototype.imul = function (e) {
        return this.clone().mulTo(e, this);
      }, o.prototype.imuln = function (e) {
        var t = e < 0;
        t && (e = -e), n("number" == typeof e), n(e < 67108864);

        for (var r = 0, i = 0; i < this.length; i++) {
          var o = (0 | this.words[i]) * e,
              a = (67108863 & o) + (67108863 & r);
          r >>= 26, r += o / 67108864 | 0, r += a >>> 26, this.words[i] = 67108863 & a;
        }

        return 0 !== r && (this.words[i] = r, this.length++), t ? this.ineg() : this;
      }, o.prototype.muln = function (e) {
        return this.clone().imuln(e);
      }, o.prototype.sqr = function () {
        return this.mul(this);
      }, o.prototype.isqr = function () {
        return this.imul(this.clone());
      }, o.prototype.pow = function (e) {
        var t = function (e) {
          for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) {
            var n = r / 26 | 0,
                i = r % 26;
            t[r] = e.words[n] >>> i & 1;
          }

          return t;
        }(e);

        if (0 === t.length) return new o(1);

        for (var r = this, n = 0; n < t.length && 0 === t[n]; n++, r = r.sqr()) {
          ;
        }

        if (++n < t.length) for (var i = r.sqr(); n < t.length; n++, i = i.sqr()) {
          0 !== t[n] && (r = r.mul(i));
        }
        return r;
      }, o.prototype.iushln = function (e) {
        n("number" == typeof e && e >= 0);
        var t,
            r = e % 26,
            i = (e - r) / 26,
            o = 67108863 >>> 26 - r << 26 - r;

        if (0 !== r) {
          var a = 0;

          for (t = 0; t < this.length; t++) {
            var s = this.words[t] & o,
                f = (0 | this.words[t]) - s << r;
            this.words[t] = f | a, a = s >>> 26 - r;
          }

          a && (this.words[t] = a, this.length++);
        }

        if (0 !== i) {
          for (t = this.length - 1; t >= 0; t--) {
            this.words[t + i] = this.words[t];
          }

          for (t = 0; t < i; t++) {
            this.words[t] = 0;
          }

          this.length += i;
        }

        return this._strip();
      }, o.prototype.ishln = function (e) {
        return n(0 === this.negative), this.iushln(e);
      }, o.prototype.iushrn = function (e, t, r) {
        var i;
        n("number" == typeof e && e >= 0), i = t ? (t - t % 26) / 26 : 0;
        var o = e % 26,
            a = Math.min((e - o) / 26, this.length),
            s = 67108863 ^ 67108863 >>> o << o,
            f = r;

        if (i -= a, i = Math.max(0, i), f) {
          for (var u = 0; u < a; u++) {
            f.words[u] = this.words[u];
          }

          f.length = a;
        }

        if (0 === a) ;else if (this.length > a) for (this.length -= a, u = 0; u < this.length; u++) {
          this.words[u] = this.words[u + a];
        } else this.words[0] = 0, this.length = 1;
        var c = 0;

        for (u = this.length - 1; u >= 0 && (0 !== c || u >= i); u--) {
          var h = 0 | this.words[u];
          this.words[u] = c << 26 - o | h >>> o, c = h & s;
        }

        return f && 0 !== c && (f.words[f.length++] = c), 0 === this.length && (this.words[0] = 0, this.length = 1), this._strip();
      }, o.prototype.ishrn = function (e, t, r) {
        return n(0 === this.negative), this.iushrn(e, t, r);
      }, o.prototype.shln = function (e) {
        return this.clone().ishln(e);
      }, o.prototype.ushln = function (e) {
        return this.clone().iushln(e);
      }, o.prototype.shrn = function (e) {
        return this.clone().ishrn(e);
      }, o.prototype.ushrn = function (e) {
        return this.clone().iushrn(e);
      }, o.prototype.testn = function (e) {
        n("number" == typeof e && e >= 0);
        var t = e % 26,
            r = (e - t) / 26,
            i = 1 << t;
        return !(this.length <= r) && !!(this.words[r] & i);
      }, o.prototype.imaskn = function (e) {
        n("number" == typeof e && e >= 0);
        var t = e % 26,
            r = (e - t) / 26;
        if (n(0 === this.negative, "imaskn works only with positive numbers"), this.length <= r) return this;

        if (0 !== t && r++, this.length = Math.min(r, this.length), 0 !== t) {
          var i = 67108863 ^ 67108863 >>> t << t;
          this.words[this.length - 1] &= i;
        }

        return this._strip();
      }, o.prototype.maskn = function (e) {
        return this.clone().imaskn(e);
      }, o.prototype.iaddn = function (e) {
        return n("number" == typeof e), n(e < 67108864), e < 0 ? this.isubn(-e) : 0 !== this.negative ? 1 === this.length && (0 | this.words[0]) <= e ? (this.words[0] = e - (0 | this.words[0]), this.negative = 0, this) : (this.negative = 0, this.isubn(e), this.negative = 1, this) : this._iaddn(e);
      }, o.prototype._iaddn = function (e) {
        this.words[0] += e;

        for (var t = 0; t < this.length && this.words[t] >= 67108864; t++) {
          this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
        }

        return this.length = Math.max(this.length, t + 1), this;
      }, o.prototype.isubn = function (e) {
        if (n("number" == typeof e), n(e < 67108864), e < 0) return this.iaddn(-e);
        if (0 !== this.negative) return this.negative = 0, this.iaddn(e), this.negative = 1, this;
        if (this.words[0] -= e, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1;else for (var t = 0; t < this.length && this.words[t] < 0; t++) {
          this.words[t] += 67108864, this.words[t + 1] -= 1;
        }
        return this._strip();
      }, o.prototype.addn = function (e) {
        return this.clone().iaddn(e);
      }, o.prototype.subn = function (e) {
        return this.clone().isubn(e);
      }, o.prototype.iabs = function () {
        return this.negative = 0, this;
      }, o.prototype.abs = function () {
        return this.clone().iabs();
      }, o.prototype._ishlnsubmul = function (e, t, r) {
        var i,
            o,
            a = e.length + r;

        this._expand(a);

        var s = 0;

        for (i = 0; i < e.length; i++) {
          o = (0 | this.words[i + r]) + s;
          var f = (0 | e.words[i]) * t;
          s = ((o -= 67108863 & f) >> 26) - (f / 67108864 | 0), this.words[i + r] = 67108863 & o;
        }

        for (; i < this.length - r; i++) {
          s = (o = (0 | this.words[i + r]) + s) >> 26, this.words[i + r] = 67108863 & o;
        }

        if (0 === s) return this._strip();

        for (n(-1 === s), s = 0, i = 0; i < this.length; i++) {
          s = (o = -(0 | this.words[i]) + s) >> 26, this.words[i] = 67108863 & o;
        }

        return this.negative = 1, this._strip();
      }, o.prototype._wordDiv = function (e, t) {
        var r = (this.length, e.length),
            n = this.clone(),
            i = e,
            a = 0 | i.words[i.length - 1];
        0 !== (r = 26 - this._countBits(a)) && (i = i.ushln(r), n.iushln(r), a = 0 | i.words[i.length - 1]);
        var s,
            f = n.length - i.length;

        if ("mod" !== t) {
          (s = new o(null)).length = f + 1, s.words = new Array(s.length);

          for (var u = 0; u < s.length; u++) {
            s.words[u] = 0;
          }
        }

        var c = n.clone()._ishlnsubmul(i, 1, f);

        0 === c.negative && (n = c, s && (s.words[f] = 1));

        for (var h = f - 1; h >= 0; h--) {
          var d = 67108864 * (0 | n.words[i.length + h]) + (0 | n.words[i.length + h - 1]);

          for (d = Math.min(d / a | 0, 67108863), n._ishlnsubmul(i, d, h); 0 !== n.negative;) {
            d--, n.negative = 0, n._ishlnsubmul(i, 1, h), n.isZero() || (n.negative ^= 1);
          }

          s && (s.words[h] = d);
        }

        return s && s._strip(), n._strip(), "div" !== t && 0 !== r && n.iushrn(r), {
          div: s || null,
          mod: n
        };
      }, o.prototype.divmod = function (e, t, r) {
        return n(!e.isZero()), this.isZero() ? {
          div: new o(0),
          mod: new o(0)
        } : 0 !== this.negative && 0 === e.negative ? (s = this.neg().divmod(e, t), "mod" !== t && (i = s.div.neg()), "div" !== t && (a = s.mod.neg(), r && 0 !== a.negative && a.iadd(e)), {
          div: i,
          mod: a
        }) : 0 === this.negative && 0 !== e.negative ? (s = this.divmod(e.neg(), t), "mod" !== t && (i = s.div.neg()), {
          div: i,
          mod: s.mod
        }) : 0 != (this.negative & e.negative) ? (s = this.neg().divmod(e.neg(), t), "div" !== t && (a = s.mod.neg(), r && 0 !== a.negative && a.isub(e)), {
          div: s.div,
          mod: a
        }) : e.length > this.length || this.cmp(e) < 0 ? {
          div: new o(0),
          mod: this
        } : 1 === e.length ? "div" === t ? {
          div: this.divn(e.words[0]),
          mod: null
        } : "mod" === t ? {
          div: null,
          mod: new o(this.modrn(e.words[0]))
        } : {
          div: this.divn(e.words[0]),
          mod: new o(this.modrn(e.words[0]))
        } : this._wordDiv(e, t);
        var i, a, s;
      }, o.prototype.div = function (e) {
        return this.divmod(e, "div", !1).div;
      }, o.prototype.mod = function (e) {
        return this.divmod(e, "mod", !1).mod;
      }, o.prototype.umod = function (e) {
        return this.divmod(e, "mod", !0).mod;
      }, o.prototype.divRound = function (e) {
        var t = this.divmod(e);
        if (t.mod.isZero()) return t.div;
        var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod,
            n = e.ushrn(1),
            i = e.andln(1),
            o = r.cmp(n);
        return o < 0 || 1 === i && 0 === o ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1);
      }, o.prototype.modrn = function (e) {
        var t = e < 0;
        t && (e = -e), n(e <= 67108863);

        for (var r = (1 << 26) % e, i = 0, o = this.length - 1; o >= 0; o--) {
          i = (r * i + (0 | this.words[o])) % e;
        }

        return t ? -i : i;
      }, o.prototype.modn = function (e) {
        return this.modrn(e);
      }, o.prototype.idivn = function (e) {
        var t = e < 0;
        t && (e = -e), n(e <= 67108863);

        for (var r = 0, i = this.length - 1; i >= 0; i--) {
          var o = (0 | this.words[i]) + 67108864 * r;
          this.words[i] = o / e | 0, r = o % e;
        }

        return this._strip(), t ? this.ineg() : this;
      }, o.prototype.divn = function (e) {
        return this.clone().idivn(e);
      }, o.prototype.egcd = function (e) {
        n(0 === e.negative), n(!e.isZero());
        var t = this,
            r = e.clone();
        t = 0 !== t.negative ? t.umod(e) : t.clone();

        for (var i = new o(1), a = new o(0), s = new o(0), f = new o(1), u = 0; t.isEven() && r.isEven();) {
          t.iushrn(1), r.iushrn(1), ++u;
        }

        for (var c = r.clone(), h = t.clone(); !t.isZero();) {
          for (var d = 0, l = 1; 0 == (t.words[0] & l) && d < 26; ++d, l <<= 1) {
            ;
          }

          if (d > 0) for (t.iushrn(d); d-- > 0;) {
            (i.isOdd() || a.isOdd()) && (i.iadd(c), a.isub(h)), i.iushrn(1), a.iushrn(1);
          }

          for (var p = 0, b = 1; 0 == (r.words[0] & b) && p < 26; ++p, b <<= 1) {
            ;
          }

          if (p > 0) for (r.iushrn(p); p-- > 0;) {
            (s.isOdd() || f.isOdd()) && (s.iadd(c), f.isub(h)), s.iushrn(1), f.iushrn(1);
          }
          t.cmp(r) >= 0 ? (t.isub(r), i.isub(s), a.isub(f)) : (r.isub(t), s.isub(i), f.isub(a));
        }

        return {
          a: s,
          b: f,
          gcd: r.iushln(u)
        };
      }, o.prototype._invmp = function (e) {
        n(0 === e.negative), n(!e.isZero());
        var t = this,
            r = e.clone();
        t = 0 !== t.negative ? t.umod(e) : t.clone();

        for (var i, a = new o(1), s = new o(0), f = r.clone(); t.cmpn(1) > 0 && r.cmpn(1) > 0;) {
          for (var u = 0, c = 1; 0 == (t.words[0] & c) && u < 26; ++u, c <<= 1) {
            ;
          }

          if (u > 0) for (t.iushrn(u); u-- > 0;) {
            a.isOdd() && a.iadd(f), a.iushrn(1);
          }

          for (var h = 0, d = 1; 0 == (r.words[0] & d) && h < 26; ++h, d <<= 1) {
            ;
          }

          if (h > 0) for (r.iushrn(h); h-- > 0;) {
            s.isOdd() && s.iadd(f), s.iushrn(1);
          }
          t.cmp(r) >= 0 ? (t.isub(r), a.isub(s)) : (r.isub(t), s.isub(a));
        }

        return (i = 0 === t.cmpn(1) ? a : s).cmpn(0) < 0 && i.iadd(e), i;
      }, o.prototype.gcd = function (e) {
        if (this.isZero()) return e.abs();
        if (e.isZero()) return this.abs();
        var t = this.clone(),
            r = e.clone();
        t.negative = 0, r.negative = 0;

        for (var n = 0; t.isEven() && r.isEven(); n++) {
          t.iushrn(1), r.iushrn(1);
        }

        for (;;) {
          for (; t.isEven();) {
            t.iushrn(1);
          }

          for (; r.isEven();) {
            r.iushrn(1);
          }

          var i = t.cmp(r);

          if (i < 0) {
            var o = t;
            t = r, r = o;
          } else if (0 === i || 0 === r.cmpn(1)) break;

          t.isub(r);
        }

        return r.iushln(n);
      }, o.prototype.invm = function (e) {
        return this.egcd(e).a.umod(e);
      }, o.prototype.isEven = function () {
        return 0 == (1 & this.words[0]);
      }, o.prototype.isOdd = function () {
        return 1 == (1 & this.words[0]);
      }, o.prototype.andln = function (e) {
        return this.words[0] & e;
      }, o.prototype.bincn = function (e) {
        n("number" == typeof e);
        var t = e % 26,
            r = (e - t) / 26,
            i = 1 << t;
        if (this.length <= r) return this._expand(r + 1), this.words[r] |= i, this;

        for (var o = i, a = r; 0 !== o && a < this.length; a++) {
          var s = 0 | this.words[a];
          o = (s += o) >>> 26, s &= 67108863, this.words[a] = s;
        }

        return 0 !== o && (this.words[a] = o, this.length++), this;
      }, o.prototype.isZero = function () {
        return 1 === this.length && 0 === this.words[0];
      }, o.prototype.cmpn = function (e) {
        var t,
            r = e < 0;
        if (0 !== this.negative && !r) return -1;
        if (0 === this.negative && r) return 1;
        if (this._strip(), this.length > 1) t = 1;else {
          r && (e = -e), n(e <= 67108863, "Number is too big");
          var i = 0 | this.words[0];
          t = i === e ? 0 : i < e ? -1 : 1;
        }
        return 0 !== this.negative ? 0 | -t : t;
      }, o.prototype.cmp = function (e) {
        if (0 !== this.negative && 0 === e.negative) return -1;
        if (0 === this.negative && 0 !== e.negative) return 1;
        var t = this.ucmp(e);
        return 0 !== this.negative ? 0 | -t : t;
      }, o.prototype.ucmp = function (e) {
        if (this.length > e.length) return 1;
        if (this.length < e.length) return -1;

        for (var t = 0, r = this.length - 1; r >= 0; r--) {
          var n = 0 | this.words[r],
              i = 0 | e.words[r];

          if (n !== i) {
            n < i ? t = -1 : n > i && (t = 1);
            break;
          }
        }

        return t;
      }, o.prototype.gtn = function (e) {
        return 1 === this.cmpn(e);
      }, o.prototype.gt = function (e) {
        return 1 === this.cmp(e);
      }, o.prototype.gten = function (e) {
        return this.cmpn(e) >= 0;
      }, o.prototype.gte = function (e) {
        return this.cmp(e) >= 0;
      }, o.prototype.ltn = function (e) {
        return -1 === this.cmpn(e);
      }, o.prototype.lt = function (e) {
        return -1 === this.cmp(e);
      }, o.prototype.lten = function (e) {
        return this.cmpn(e) <= 0;
      }, o.prototype.lte = function (e) {
        return this.cmp(e) <= 0;
      }, o.prototype.eqn = function (e) {
        return 0 === this.cmpn(e);
      }, o.prototype.eq = function (e) {
        return 0 === this.cmp(e);
      }, o.red = function (e) {
        return new k(e);
      }, o.prototype.toRed = function (e) {
        return n(!this.red, "Already a number in reduction context"), n(0 === this.negative, "red works only with positives"), e.convertTo(this)._forceRed(e);
      }, o.prototype.fromRed = function () {
        return n(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
      }, o.prototype._forceRed = function (e) {
        return this.red = e, this;
      }, o.prototype.forceRed = function (e) {
        return n(!this.red, "Already a number in reduction context"), this._forceRed(e);
      }, o.prototype.redAdd = function (e) {
        return n(this.red, "redAdd works only with red numbers"), this.red.add(this, e);
      }, o.prototype.redIAdd = function (e) {
        return n(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e);
      }, o.prototype.redSub = function (e) {
        return n(this.red, "redSub works only with red numbers"), this.red.sub(this, e);
      }, o.prototype.redISub = function (e) {
        return n(this.red, "redISub works only with red numbers"), this.red.isub(this, e);
      }, o.prototype.redShl = function (e) {
        return n(this.red, "redShl works only with red numbers"), this.red.shl(this, e);
      }, o.prototype.redMul = function (e) {
        return n(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.mul(this, e);
      }, o.prototype.redIMul = function (e) {
        return n(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.imul(this, e);
      }, o.prototype.redSqr = function () {
        return n(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
      }, o.prototype.redISqr = function () {
        return n(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
      }, o.prototype.redSqrt = function () {
        return n(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
      }, o.prototype.redInvm = function () {
        return n(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
      }, o.prototype.redNeg = function () {
        return n(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
      }, o.prototype.redPow = function (e) {
        return n(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e);
      };
      var v = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };

      function w(e, t) {
        this.name = e, this.p = new o(t, 16), this.n = this.p.bitLength(), this.k = new o(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
      }

      function _() {
        w.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
      }

      function E() {
        w.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
      }

      function M() {
        w.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
      }

      function S() {
        w.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
      }

      function k(e) {
        if ("string" == typeof e) {
          var t = o._prime(e);

          this.m = t.p, this.prime = t;
        } else n(e.gtn(1), "modulus must be greater than 1"), this.m = e, this.prime = null;
      }

      function A(e) {
        k.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new o(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
      }

      w.prototype._tmp = function () {
        var e = new o(null);
        return e.words = new Array(Math.ceil(this.n / 13)), e;
      }, w.prototype.ireduce = function (e) {
        var t,
            r = e;

        do {
          this.split(r, this.tmp), t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength();
        } while (t > this.n);

        var n = t < this.n ? -1 : r.ucmp(this.p);
        return 0 === n ? (r.words[0] = 0, r.length = 1) : n > 0 ? r.isub(this.p) : void 0 !== r.strip ? r.strip() : r._strip(), r;
      }, w.prototype.split = function (e, t) {
        e.iushrn(this.n, 0, t);
      }, w.prototype.imulK = function (e) {
        return e.imul(this.k);
      }, i(_, w), _.prototype.split = function (e, t) {
        for (var r = Math.min(e.length, 9), n = 0; n < r; n++) {
          t.words[n] = e.words[n];
        }

        if (t.length = r, e.length <= 9) return e.words[0] = 0, void (e.length = 1);
        var i = e.words[9];

        for (t.words[t.length++] = 4194303 & i, n = 10; n < e.length; n++) {
          var o = 0 | e.words[n];
          e.words[n - 10] = (4194303 & o) << 4 | i >>> 22, i = o;
        }

        i >>>= 22, e.words[n - 10] = i, 0 === i && e.length > 10 ? e.length -= 10 : e.length -= 9;
      }, _.prototype.imulK = function (e) {
        e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2;

        for (var t = 0, r = 0; r < e.length; r++) {
          var n = 0 | e.words[r];
          t += 977 * n, e.words[r] = 67108863 & t, t = 64 * n + (t / 67108864 | 0);
        }

        return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), e;
      }, i(E, w), i(M, w), i(S, w), S.prototype.imulK = function (e) {
        for (var t = 0, r = 0; r < e.length; r++) {
          var n = 19 * (0 | e.words[r]) + t,
              i = 67108863 & n;
          n >>>= 26, e.words[r] = i, t = n;
        }

        return 0 !== t && (e.words[e.length++] = t), e;
      }, o._prime = function (e) {
        if (v[e]) return v[e];
        var t;
        if ("k256" === e) t = new _();else if ("p224" === e) t = new E();else if ("p192" === e) t = new M();else {
          if ("p25519" !== e) throw new Error("Unknown prime " + e);
          t = new S();
        }
        return v[e] = t, t;
      }, k.prototype._verify1 = function (e) {
        n(0 === e.negative, "red works only with positives"), n(e.red, "red works only with red numbers");
      }, k.prototype._verify2 = function (e, t) {
        n(0 == (e.negative | t.negative), "red works only with positives"), n(e.red && e.red === t.red, "red works only with red numbers");
      }, k.prototype.imod = function (e) {
        return this.prime ? this.prime.ireduce(e)._forceRed(this) : (u(e, e.umod(this.m)._forceRed(this)), e);
      }, k.prototype.neg = function (e) {
        return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);
      }, k.prototype.add = function (e, t) {
        this._verify2(e, t);

        var r = e.add(t);
        return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this);
      }, k.prototype.iadd = function (e, t) {
        this._verify2(e, t);

        var r = e.iadd(t);
        return r.cmp(this.m) >= 0 && r.isub(this.m), r;
      }, k.prototype.sub = function (e, t) {
        this._verify2(e, t);

        var r = e.sub(t);
        return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this);
      }, k.prototype.isub = function (e, t) {
        this._verify2(e, t);

        var r = e.isub(t);
        return r.cmpn(0) < 0 && r.iadd(this.m), r;
      }, k.prototype.shl = function (e, t) {
        return this._verify1(e), this.imod(e.ushln(t));
      }, k.prototype.imul = function (e, t) {
        return this._verify2(e, t), this.imod(e.imul(t));
      }, k.prototype.mul = function (e, t) {
        return this._verify2(e, t), this.imod(e.mul(t));
      }, k.prototype.isqr = function (e) {
        return this.imul(e, e.clone());
      }, k.prototype.sqr = function (e) {
        return this.mul(e, e);
      }, k.prototype.sqrt = function (e) {
        if (e.isZero()) return e.clone();
        var t = this.m.andln(3);

        if (n(t % 2 == 1), 3 === t) {
          var r = this.m.add(new o(1)).iushrn(2);
          return this.pow(e, r);
        }

        for (var i = this.m.subn(1), a = 0; !i.isZero() && 0 === i.andln(1);) {
          a++, i.iushrn(1);
        }

        n(!i.isZero());
        var s = new o(1).toRed(this),
            f = s.redNeg(),
            u = this.m.subn(1).iushrn(1),
            c = this.m.bitLength();

        for (c = new o(2 * c * c).toRed(this); 0 !== this.pow(c, u).cmp(f);) {
          c.redIAdd(f);
        }

        for (var h = this.pow(c, i), d = this.pow(e, i.addn(1).iushrn(1)), l = this.pow(e, i), p = a; 0 !== l.cmp(s);) {
          for (var b = l, m = 0; 0 !== b.cmp(s); m++) {
            b = b.redSqr();
          }

          n(m < p);
          var y = this.pow(h, new o(1).iushln(p - m - 1));
          d = d.redMul(y), h = y.redSqr(), l = l.redMul(h), p = m;
        }

        return d;
      }, k.prototype.invm = function (e) {
        var t = e._invmp(this.m);

        return 0 !== t.negative ? (t.negative = 0, this.imod(t).redNeg()) : this.imod(t);
      }, k.prototype.pow = function (e, t) {
        if (t.isZero()) return new o(1).toRed(this);
        if (0 === t.cmpn(1)) return e.clone();
        var r = new Array(16);
        r[0] = new o(1).toRed(this), r[1] = e;

        for (var n = 2; n < r.length; n++) {
          r[n] = this.mul(r[n - 1], e);
        }

        var i = r[0],
            a = 0,
            s = 0,
            f = t.bitLength() % 26;

        for (0 === f && (f = 26), n = t.length - 1; n >= 0; n--) {
          for (var u = t.words[n], c = f - 1; c >= 0; c--) {
            var h = u >> c & 1;
            i !== r[0] && (i = this.sqr(i)), 0 !== h || 0 !== a ? (a <<= 1, a |= h, (4 === ++s || 0 === n && 0 === c) && (i = this.mul(i, r[a]), s = 0, a = 0)) : s = 0;
          }

          f = 26;
        }

        return i;
      }, k.prototype.convertTo = function (e) {
        var t = e.umod(this.m);
        return t === e ? t.clone() : t;
      }, k.prototype.convertFrom = function (e) {
        var t = e.clone();
        return t.red = null, t;
      }, o.mont = function (e) {
        return new A(e);
      }, i(A, k), A.prototype.convertTo = function (e) {
        return this.imod(e.ushln(this.shift));
      }, A.prototype.convertFrom = function (e) {
        var t = this.imod(e.mul(this.rinv));
        return t.red = null, t;
      }, A.prototype.imul = function (e, t) {
        if (e.isZero() || t.isZero()) return e.words[0] = 0, e.length = 1, e;
        var r = e.imul(t),
            n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
            i = r.isub(n).iushrn(this.shift),
            o = i;
        return i.cmp(this.m) >= 0 ? o = i.isub(this.m) : i.cmpn(0) < 0 && (o = i.iadd(this.m)), o._forceRed(this);
      }, A.prototype.mul = function (e, t) {
        if (e.isZero() || t.isZero()) return new o(0)._forceRed(this);
        var r = e.mul(t),
            n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
            i = r.isub(n).iushrn(this.shift),
            a = i;
        return i.cmp(this.m) >= 0 ? a = i.isub(this.m) : i.cmpn(0) < 0 && (a = i.iadd(this.m)), a._forceRed(this);
      }, A.prototype.invm = function (e) {
        return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);
      };
    }(void 0 === t || t, this);
  }, {
    buffer: 19
  }],
  18: [function (e, t, r) {
    var n;

    function i(e) {
      this.rand = e;
    }

    if (t.exports = function (e) {
      return n || (n = new i(null)), n.generate(e);
    }, t.exports.Rand = i, i.prototype.generate = function (e) {
      return this._rand(e);
    }, i.prototype._rand = function (e) {
      if (this.rand.getBytes) return this.rand.getBytes(e);

      for (var t = new Uint8Array(e), r = 0; r < t.length; r++) {
        t[r] = this.rand.getByte();
      }

      return t;
    }, "object" == (typeof self === "undefined" ? "undefined" : _typeof(self))) self.crypto && self.crypto.getRandomValues ? i.prototype._rand = function (e) {
      var t = new Uint8Array(e);
      return self.crypto.getRandomValues(t), t;
    } : self.msCrypto && self.msCrypto.getRandomValues ? i.prototype._rand = function (e) {
      var t = new Uint8Array(e);
      return self.msCrypto.getRandomValues(t), t;
    } : "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && (i.prototype._rand = function () {
      throw new Error("Not implemented yet");
    });else try {
      var o = e("crypto");
      if ("function" != typeof o.randomBytes) throw new Error("Not supported");

      i.prototype._rand = function (e) {
        return o.randomBytes(e);
      };
    } catch (e) {}
  }, {
    crypto: 19
  }],
  19: [function (e, t, r) {}, {}],
  20: [function (e, t, r) {
    var n = e("safe-buffer").Buffer;

    function i(e) {
      n.isBuffer(e) || (e = n.from(e));

      for (var t = e.length / 4 | 0, r = new Array(t), i = 0; i < t; i++) {
        r[i] = e.readUInt32BE(4 * i);
      }

      return r;
    }

    function o(e) {
      for (; 0 < e.length; e++) {
        e[0] = 0;
      }
    }

    function a(e, t, r, n, i) {
      for (var o, a, s, f, u = r[0], c = r[1], h = r[2], d = r[3], l = e[0] ^ t[0], p = e[1] ^ t[1], b = e[2] ^ t[2], m = e[3] ^ t[3], y = 4, g = 1; g < i; g++) {
        o = u[l >>> 24] ^ c[p >>> 16 & 255] ^ h[b >>> 8 & 255] ^ d[255 & m] ^ t[y++], a = u[p >>> 24] ^ c[b >>> 16 & 255] ^ h[m >>> 8 & 255] ^ d[255 & l] ^ t[y++], s = u[b >>> 24] ^ c[m >>> 16 & 255] ^ h[l >>> 8 & 255] ^ d[255 & p] ^ t[y++], f = u[m >>> 24] ^ c[l >>> 16 & 255] ^ h[p >>> 8 & 255] ^ d[255 & b] ^ t[y++], l = o, p = a, b = s, m = f;
      }

      return o = (n[l >>> 24] << 24 | n[p >>> 16 & 255] << 16 | n[b >>> 8 & 255] << 8 | n[255 & m]) ^ t[y++], a = (n[p >>> 24] << 24 | n[b >>> 16 & 255] << 16 | n[m >>> 8 & 255] << 8 | n[255 & l]) ^ t[y++], s = (n[b >>> 24] << 24 | n[m >>> 16 & 255] << 16 | n[l >>> 8 & 255] << 8 | n[255 & p]) ^ t[y++], f = (n[m >>> 24] << 24 | n[l >>> 16 & 255] << 16 | n[p >>> 8 & 255] << 8 | n[255 & b]) ^ t[y++], [o >>>= 0, a >>>= 0, s >>>= 0, f >>>= 0];
    }

    var s = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
        f = function () {
      for (var e = new Array(256), t = 0; t < 256; t++) {
        e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
      }

      for (var r = [], n = [], i = [[], [], [], []], o = [[], [], [], []], a = 0, s = 0, f = 0; f < 256; ++f) {
        var u = s ^ s << 1 ^ s << 2 ^ s << 3 ^ s << 4;
        u = u >>> 8 ^ 255 & u ^ 99, r[a] = u, n[u] = a;
        var c = e[a],
            h = e[c],
            d = e[h],
            l = 257 * e[u] ^ 16843008 * u;
        i[0][a] = l << 24 | l >>> 8, i[1][a] = l << 16 | l >>> 16, i[2][a] = l << 8 | l >>> 24, i[3][a] = l, l = 16843009 * d ^ 65537 * h ^ 257 * c ^ 16843008 * a, o[0][u] = l << 24 | l >>> 8, o[1][u] = l << 16 | l >>> 16, o[2][u] = l << 8 | l >>> 24, o[3][u] = l, 0 === a ? a = s = 1 : (a = c ^ e[e[e[d ^ c]]], s ^= e[e[s]]);
      }

      return {
        SBOX: r,
        INV_SBOX: n,
        SUB_MIX: i,
        INV_SUB_MIX: o
      };
    }();

    function u(e) {
      this._key = i(e), this._reset();
    }

    u.blockSize = 16, u.keySize = 32, u.prototype.blockSize = u.blockSize, u.prototype.keySize = u.keySize, u.prototype._reset = function () {
      for (var e = this._key, t = e.length, r = t + 6, n = 4 * (r + 1), i = [], o = 0; o < t; o++) {
        i[o] = e[o];
      }

      for (o = t; o < n; o++) {
        var a = i[o - 1];
        o % t == 0 ? (a = a << 8 | a >>> 24, a = f.SBOX[a >>> 24] << 24 | f.SBOX[a >>> 16 & 255] << 16 | f.SBOX[a >>> 8 & 255] << 8 | f.SBOX[255 & a], a ^= s[o / t | 0] << 24) : t > 6 && o % t == 4 && (a = f.SBOX[a >>> 24] << 24 | f.SBOX[a >>> 16 & 255] << 16 | f.SBOX[a >>> 8 & 255] << 8 | f.SBOX[255 & a]), i[o] = i[o - t] ^ a;
      }

      for (var u = [], c = 0; c < n; c++) {
        var h = n - c,
            d = i[h - (c % 4 ? 0 : 4)];
        u[c] = c < 4 || h <= 4 ? d : f.INV_SUB_MIX[0][f.SBOX[d >>> 24]] ^ f.INV_SUB_MIX[1][f.SBOX[d >>> 16 & 255]] ^ f.INV_SUB_MIX[2][f.SBOX[d >>> 8 & 255]] ^ f.INV_SUB_MIX[3][f.SBOX[255 & d]];
      }

      this._nRounds = r, this._keySchedule = i, this._invKeySchedule = u;
    }, u.prototype.encryptBlockRaw = function (e) {
      return a(e = i(e), this._keySchedule, f.SUB_MIX, f.SBOX, this._nRounds);
    }, u.prototype.encryptBlock = function (e) {
      var t = this.encryptBlockRaw(e),
          r = n.allocUnsafe(16);
      return r.writeUInt32BE(t[0], 0), r.writeUInt32BE(t[1], 4), r.writeUInt32BE(t[2], 8), r.writeUInt32BE(t[3], 12), r;
    }, u.prototype.decryptBlock = function (e) {
      var t = (e = i(e))[1];
      e[1] = e[3], e[3] = t;
      var r = a(e, this._invKeySchedule, f.INV_SUB_MIX, f.INV_SBOX, this._nRounds),
          o = n.allocUnsafe(16);
      return o.writeUInt32BE(r[0], 0), o.writeUInt32BE(r[3], 4), o.writeUInt32BE(r[2], 8), o.writeUInt32BE(r[1], 12), o;
    }, u.prototype.scrub = function () {
      o(this._keySchedule), o(this._invKeySchedule), o(this._key);
    }, t.exports.AES = u;
  }, {
    "safe-buffer": 182
  }],
  21: [function (e, t, r) {
    var n = e("./aes"),
        i = e("safe-buffer").Buffer,
        o = e("cipher-base"),
        a = e("inherits"),
        s = e("./ghash"),
        f = e("buffer-xor"),
        u = e("./incr32");

    function c(e, t, r, a) {
      o.call(this);
      var f = i.alloc(4, 0);
      this._cipher = new n.AES(t);

      var c = this._cipher.encryptBlock(f);

      this._ghash = new s(c), r = function (e, t, r) {
        if (12 === t.length) return e._finID = i.concat([t, i.from([0, 0, 0, 1])]), i.concat([t, i.from([0, 0, 0, 2])]);
        var n = new s(r),
            o = t.length,
            a = o % 16;
        n.update(t), a && (a = 16 - a, n.update(i.alloc(a, 0))), n.update(i.alloc(8, 0));
        var f = 8 * o,
            c = i.alloc(8);
        c.writeUIntBE(f, 0, 8), n.update(c), e._finID = n.state;
        var h = i.from(e._finID);
        return u(h), h;
      }(this, r, c), this._prev = i.from(r), this._cache = i.allocUnsafe(0), this._secCache = i.allocUnsafe(0), this._decrypt = a, this._alen = 0, this._len = 0, this._mode = e, this._authTag = null, this._called = !1;
    }

    a(c, o), c.prototype._update = function (e) {
      if (!this._called && this._alen) {
        var t = 16 - this._alen % 16;
        t < 16 && (t = i.alloc(t, 0), this._ghash.update(t));
      }

      this._called = !0;

      var r = this._mode.encrypt(this, e);

      return this._decrypt ? this._ghash.update(e) : this._ghash.update(r), this._len += e.length, r;
    }, c.prototype._final = function () {
      if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
      var e = f(this._ghash["final"](8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
      if (this._decrypt && function (e, t) {
        var r = 0;
        e.length !== t.length && r++;

        for (var n = Math.min(e.length, t.length), i = 0; i < n; ++i) {
          r += e[i] ^ t[i];
        }

        return r;
      }(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
      this._authTag = e, this._cipher.scrub();
    }, c.prototype.getAuthTag = function () {
      if (this._decrypt || !i.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
      return this._authTag;
    }, c.prototype.setAuthTag = function (e) {
      if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
      this._authTag = e;
    }, c.prototype.setAAD = function (e) {
      if (this._called) throw new Error("Attempting to set AAD in unsupported state");
      this._ghash.update(e), this._alen += e.length;
    }, t.exports = c;
  }, {
    "./aes": 20,
    "./ghash": 25,
    "./incr32": 26,
    "buffer-xor": 64,
    "cipher-base": 66,
    inherits: 135,
    "safe-buffer": 182
  }],
  22: [function (e, t, r) {
    var n = e("./encrypter"),
        i = e("./decrypter"),
        o = e("./modes/list.json");
    r.createCipher = r.Cipher = n.createCipher, r.createCipheriv = r.Cipheriv = n.createCipheriv, r.createDecipher = r.Decipher = i.createDecipher, r.createDecipheriv = r.Decipheriv = i.createDecipheriv, r.listCiphers = r.getCiphers = function () {
      return Object.keys(o);
    };
  }, {
    "./decrypter": 23,
    "./encrypter": 24,
    "./modes/list.json": 34
  }],
  23: [function (e, t, r) {
    var n = e("./authCipher"),
        i = e("safe-buffer").Buffer,
        o = e("./modes"),
        a = e("./streamCipher"),
        s = e("cipher-base"),
        f = e("./aes"),
        u = e("evp_bytestokey");

    function c(e, t, r) {
      s.call(this), this._cache = new h(), this._last = void 0, this._cipher = new f.AES(t), this._prev = i.from(r), this._mode = e, this._autopadding = !0;
    }

    function h() {
      this.cache = i.allocUnsafe(0);
    }

    function d(e, t, r) {
      var s = o[e.toLowerCase()];
      if (!s) throw new TypeError("invalid suite type");
      if ("string" == typeof r && (r = i.from(r)), "GCM" !== s.mode && r.length !== s.iv) throw new TypeError("invalid iv length " + r.length);
      if ("string" == typeof t && (t = i.from(t)), t.length !== s.key / 8) throw new TypeError("invalid key length " + t.length);
      return "stream" === s.type ? new a(s.module, t, r, !0) : "auth" === s.type ? new n(s.module, t, r, !0) : new c(s.module, t, r);
    }

    e("inherits")(c, s), c.prototype._update = function (e) {
      var t, r;

      this._cache.add(e);

      for (var n = []; t = this._cache.get(this._autopadding);) {
        r = this._mode.decrypt(this, t), n.push(r);
      }

      return i.concat(n);
    }, c.prototype._final = function () {
      var e = this._cache.flush();

      if (this._autopadding) return function (e) {
        var t = e[15];
        if (t < 1 || t > 16) throw new Error("unable to decrypt data");
        var r = -1;

        for (; ++r < t;) {
          if (e[r + (16 - t)] !== t) throw new Error("unable to decrypt data");
        }

        if (16 === t) return;
        return e.slice(0, 16 - t);
      }(this._mode.decrypt(this, e));
      if (e) throw new Error("data not multiple of block length");
    }, c.prototype.setAutoPadding = function (e) {
      return this._autopadding = !!e, this;
    }, h.prototype.add = function (e) {
      this.cache = i.concat([this.cache, e]);
    }, h.prototype.get = function (e) {
      var t;

      if (e) {
        if (this.cache.length > 16) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t;
      } else if (this.cache.length >= 16) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t;

      return null;
    }, h.prototype.flush = function () {
      if (this.cache.length) return this.cache;
    }, r.createDecipher = function (e, t) {
      var r = o[e.toLowerCase()];
      if (!r) throw new TypeError("invalid suite type");
      var n = u(t, !1, r.key, r.iv);
      return d(e, n.key, n.iv);
    }, r.createDecipheriv = d;
  }, {
    "./aes": 20,
    "./authCipher": 21,
    "./modes": 33,
    "./streamCipher": 36,
    "cipher-base": 66,
    evp_bytestokey: 104,
    inherits: 135,
    "safe-buffer": 182
  }],
  24: [function (e, t, r) {
    var n = e("./modes"),
        i = e("./authCipher"),
        o = e("safe-buffer").Buffer,
        a = e("./streamCipher"),
        s = e("cipher-base"),
        f = e("./aes"),
        u = e("evp_bytestokey");

    function c(e, t, r) {
      s.call(this), this._cache = new d(), this._cipher = new f.AES(t), this._prev = o.from(r), this._mode = e, this._autopadding = !0;
    }

    e("inherits")(c, s), c.prototype._update = function (e) {
      var t, r;

      this._cache.add(e);

      for (var n = []; t = this._cache.get();) {
        r = this._mode.encrypt(this, t), n.push(r);
      }

      return o.concat(n);
    };
    var h = o.alloc(16, 16);

    function d() {
      this.cache = o.allocUnsafe(0);
    }

    function l(e, t, r) {
      var s = n[e.toLowerCase()];
      if (!s) throw new TypeError("invalid suite type");
      if ("string" == typeof t && (t = o.from(t)), t.length !== s.key / 8) throw new TypeError("invalid key length " + t.length);
      if ("string" == typeof r && (r = o.from(r)), "GCM" !== s.mode && r.length !== s.iv) throw new TypeError("invalid iv length " + r.length);
      return "stream" === s.type ? new a(s.module, t, r) : "auth" === s.type ? new i(s.module, t, r) : new c(s.module, t, r);
    }

    c.prototype._final = function () {
      var e = this._cache.flush();

      if (this._autopadding) return e = this._mode.encrypt(this, e), this._cipher.scrub(), e;
      if (!e.equals(h)) throw this._cipher.scrub(), new Error("data not multiple of block length");
    }, c.prototype.setAutoPadding = function (e) {
      return this._autopadding = !!e, this;
    }, d.prototype.add = function (e) {
      this.cache = o.concat([this.cache, e]);
    }, d.prototype.get = function () {
      if (this.cache.length > 15) {
        var e = this.cache.slice(0, 16);
        return this.cache = this.cache.slice(16), e;
      }

      return null;
    }, d.prototype.flush = function () {
      for (var e = 16 - this.cache.length, t = o.allocUnsafe(e), r = -1; ++r < e;) {
        t.writeUInt8(e, r);
      }

      return o.concat([this.cache, t]);
    }, r.createCipheriv = l, r.createCipher = function (e, t) {
      var r = n[e.toLowerCase()];
      if (!r) throw new TypeError("invalid suite type");
      var i = u(t, !1, r.key, r.iv);
      return l(e, i.key, i.iv);
    };
  }, {
    "./aes": 20,
    "./authCipher": 21,
    "./modes": 33,
    "./streamCipher": 36,
    "cipher-base": 66,
    evp_bytestokey: 104,
    inherits: 135,
    "safe-buffer": 182
  }],
  25: [function (e, t, r) {
    var n = e("safe-buffer").Buffer,
        i = n.alloc(16, 0);

    function o(e) {
      var t = n.allocUnsafe(16);
      return t.writeUInt32BE(e[0] >>> 0, 0), t.writeUInt32BE(e[1] >>> 0, 4), t.writeUInt32BE(e[2] >>> 0, 8), t.writeUInt32BE(e[3] >>> 0, 12), t;
    }

    function a(e) {
      this.h = e, this.state = n.alloc(16, 0), this.cache = n.allocUnsafe(0);
    }

    a.prototype.ghash = function (e) {
      for (var t = -1; ++t < e.length;) {
        this.state[t] ^= e[t];
      }

      this._multiply();
    }, a.prototype._multiply = function () {
      for (var e, t, r, n = [(e = this.h).readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12)], i = [0, 0, 0, 0], a = -1; ++a < 128;) {
        for (0 != (this.state[~~(a / 8)] & 1 << 7 - a % 8) && (i[0] ^= n[0], i[1] ^= n[1], i[2] ^= n[2], i[3] ^= n[3]), r = 0 != (1 & n[3]), t = 3; t > 0; t--) {
          n[t] = n[t] >>> 1 | (1 & n[t - 1]) << 31;
        }

        n[0] = n[0] >>> 1, r && (n[0] = n[0] ^ 225 << 24);
      }

      this.state = o(i);
    }, a.prototype.update = function (e) {
      var t;

      for (this.cache = n.concat([this.cache, e]); this.cache.length >= 16;) {
        t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(t);
      }
    }, a.prototype["final"] = function (e, t) {
      return this.cache.length && this.ghash(n.concat([this.cache, i], 16)), this.ghash(o([0, e, 0, t])), this.state;
    }, t.exports = a;
  }, {
    "safe-buffer": 182
  }],
  26: [function (e, t, r) {
    t.exports = function (e) {
      for (var t, r = e.length; r--;) {
        if (255 !== (t = e.readUInt8(r))) {
          t++, e.writeUInt8(t, r);
          break;
        }

        e.writeUInt8(0, r);
      }
    };
  }, {}],
  27: [function (e, t, r) {
    var n = e("buffer-xor");
    r.encrypt = function (e, t) {
      var r = n(t, e._prev);
      return e._prev = e._cipher.encryptBlock(r), e._prev;
    }, r.decrypt = function (e, t) {
      var r = e._prev;
      e._prev = t;

      var i = e._cipher.decryptBlock(t);

      return n(i, r);
    };
  }, {
    "buffer-xor": 64
  }],
  28: [function (e, t, r) {
    var n = e("safe-buffer").Buffer,
        i = e("buffer-xor");

    function o(e, t, r) {
      var o = t.length,
          a = i(t, e._cache);
      return e._cache = e._cache.slice(o), e._prev = n.concat([e._prev, r ? t : a]), a;
    }

    r.encrypt = function (e, t, r) {
      for (var i, a = n.allocUnsafe(0); t.length;) {
        if (0 === e._cache.length && (e._cache = e._cipher.encryptBlock(e._prev), e._prev = n.allocUnsafe(0)), !(e._cache.length <= t.length)) {
          a = n.concat([a, o(e, t, r)]);
          break;
        }

        i = e._cache.length, a = n.concat([a, o(e, t.slice(0, i), r)]), t = t.slice(i);
      }

      return a;
    };
  }, {
    "buffer-xor": 64,
    "safe-buffer": 182
  }],
  29: [function (e, t, r) {
    var n = e("safe-buffer").Buffer;

    function i(e, t, r) {
      for (var n, i, a = -1, s = 0; ++a < 8;) {
        n = t & 1 << 7 - a ? 128 : 0, s += (128 & (i = e._cipher.encryptBlock(e._prev)[0] ^ n)) >> a % 8, e._prev = o(e._prev, r ? n : i);
      }

      return s;
    }

    function o(e, t) {
      var r = e.length,
          i = -1,
          o = n.allocUnsafe(e.length);

      for (e = n.concat([e, n.from([t])]); ++i < r;) {
        o[i] = e[i] << 1 | e[i + 1] >> 7;
      }

      return o;
    }

    r.encrypt = function (e, t, r) {
      for (var o = t.length, a = n.allocUnsafe(o), s = -1; ++s < o;) {
        a[s] = i(e, t[s], r);
      }

      return a;
    };
  }, {
    "safe-buffer": 182
  }],
  30: [function (e, t, r) {
    var n = e("safe-buffer").Buffer;

    function i(e, t, r) {
      var i = e._cipher.encryptBlock(e._prev)[0] ^ t;
      return e._prev = n.concat([e._prev.slice(1), n.from([r ? t : i])]), i;
    }

    r.encrypt = function (e, t, r) {
      for (var o = t.length, a = n.allocUnsafe(o), s = -1; ++s < o;) {
        a[s] = i(e, t[s], r);
      }

      return a;
    };
  }, {
    "safe-buffer": 182
  }],
  31: [function (e, t, r) {
    var n = e("buffer-xor"),
        i = e("safe-buffer").Buffer,
        o = e("../incr32");

    function a(e) {
      var t = e._cipher.encryptBlockRaw(e._prev);

      return o(e._prev), t;
    }

    r.encrypt = function (e, t) {
      var r = Math.ceil(t.length / 16),
          o = e._cache.length;
      e._cache = i.concat([e._cache, i.allocUnsafe(16 * r)]);

      for (var s = 0; s < r; s++) {
        var f = a(e),
            u = o + 16 * s;
        e._cache.writeUInt32BE(f[0], u + 0), e._cache.writeUInt32BE(f[1], u + 4), e._cache.writeUInt32BE(f[2], u + 8), e._cache.writeUInt32BE(f[3], u + 12);
      }

      var c = e._cache.slice(0, t.length);

      return e._cache = e._cache.slice(t.length), n(t, c);
    };
  }, {
    "../incr32": 26,
    "buffer-xor": 64,
    "safe-buffer": 182
  }],
  32: [function (e, t, r) {
    r.encrypt = function (e, t) {
      return e._cipher.encryptBlock(t);
    }, r.decrypt = function (e, t) {
      return e._cipher.decryptBlock(t);
    };
  }, {}],
  33: [function (e, t, r) {
    var n = {
      ECB: e("./ecb"),
      CBC: e("./cbc"),
      CFB: e("./cfb"),
      CFB8: e("./cfb8"),
      CFB1: e("./cfb1"),
      OFB: e("./ofb"),
      CTR: e("./ctr"),
      GCM: e("./ctr")
    },
        i = e("./list.json");

    for (var o in i) {
      i[o].module = n[i[o].mode];
    }

    t.exports = i;
  }, {
    "./cbc": 27,
    "./cfb": 28,
    "./cfb1": 29,
    "./cfb8": 30,
    "./ctr": 31,
    "./ecb": 32,
    "./list.json": 34,
    "./ofb": 35
  }],
  34: [function (e, t, r) {
    t.exports = {
      "aes-128-ecb": {
        cipher: "AES",
        key: 128,
        iv: 0,
        mode: "ECB",
        type: "block"
      },
      "aes-192-ecb": {
        cipher: "AES",
        key: 192,
        iv: 0,
        mode: "ECB",
        type: "block"
      },
      "aes-256-ecb": {
        cipher: "AES",
        key: 256,
        iv: 0,
        mode: "ECB",
        type: "block"
      },
      "aes-128-cbc": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      "aes-192-cbc": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      "aes-256-cbc": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      aes128: {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      aes192: {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      aes256: {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      "aes-128-cfb": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CFB",
        type: "stream"
      },
      "aes-192-cfb": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CFB",
        type: "stream"
      },
      "aes-256-cfb": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CFB",
        type: "stream"
      },
      "aes-128-cfb8": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CFB8",
        type: "stream"
      },
      "aes-192-cfb8": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CFB8",
        type: "stream"
      },
      "aes-256-cfb8": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CFB8",
        type: "stream"
      },
      "aes-128-cfb1": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CFB1",
        type: "stream"
      },
      "aes-192-cfb1": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CFB1",
        type: "stream"
      },
      "aes-256-cfb1": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CFB1",
        type: "stream"
      },
      "aes-128-ofb": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "OFB",
        type: "stream"
      },
      "aes-192-ofb": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "OFB",
        type: "stream"
      },
      "aes-256-ofb": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "OFB",
        type: "stream"
      },
      "aes-128-ctr": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CTR",
        type: "stream"
      },
      "aes-192-ctr": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CTR",
        type: "stream"
      },
      "aes-256-ctr": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CTR",
        type: "stream"
      },
      "aes-128-gcm": {
        cipher: "AES",
        key: 128,
        iv: 12,
        mode: "GCM",
        type: "auth"
      },
      "aes-192-gcm": {
        cipher: "AES",
        key: 192,
        iv: 12,
        mode: "GCM",
        type: "auth"
      },
      "aes-256-gcm": {
        cipher: "AES",
        key: 256,
        iv: 12,
        mode: "GCM",
        type: "auth"
      }
    };
  }, {}],
  35: [function (e, t, r) {
    (function (t) {
      var n = e("buffer-xor");

      function i(e) {
        return e._prev = e._cipher.encryptBlock(e._prev), e._prev;
      }

      r.encrypt = function (e, r) {
        for (; e._cache.length < r.length;) {
          e._cache = t.concat([e._cache, i(e)]);
        }

        var o = e._cache.slice(0, r.length);

        return e._cache = e._cache.slice(r.length), n(r, o);
      };
    }).call(this, e("buffer").Buffer);
  }, {
    buffer: 65,
    "buffer-xor": 64
  }],
  36: [function (e, t, r) {
    var n = e("./aes"),
        i = e("safe-buffer").Buffer,
        o = e("cipher-base");

    function a(e, t, r, a) {
      o.call(this), this._cipher = new n.AES(t), this._prev = i.from(r), this._cache = i.allocUnsafe(0), this._secCache = i.allocUnsafe(0), this._decrypt = a, this._mode = e;
    }

    e("inherits")(a, o), a.prototype._update = function (e) {
      return this._mode.encrypt(this, e, this._decrypt);
    }, a.prototype._final = function () {
      this._cipher.scrub();
    }, t.exports = a;
  }, {
    "./aes": 20,
    "cipher-base": 66,
    inherits: 135,
    "safe-buffer": 182
  }],
  37: [function (e, t, r) {
    var n = e("browserify-des"),
        i = e("browserify-aes/browser"),
        o = e("browserify-aes/modes"),
        a = e("browserify-des/modes"),
        s = e("evp_bytestokey");

    function f(e, t, r) {
      if (e = e.toLowerCase(), o[e]) return i.createCipheriv(e, t, r);
      if (a[e]) return new n({
        key: t,
        iv: r,
        mode: e
      });
      throw new TypeError("invalid suite type");
    }

    function u(e, t, r) {
      if (e = e.toLowerCase(), o[e]) return i.createDecipheriv(e, t, r);
      if (a[e]) return new n({
        key: t,
        iv: r,
        mode: e,
        decrypt: !0
      });
      throw new TypeError("invalid suite type");
    }

    r.createCipher = r.Cipher = function (e, t) {
      var r, n;
      if (e = e.toLowerCase(), o[e]) r = o[e].key, n = o[e].iv;else {
        if (!a[e]) throw new TypeError("invalid suite type");
        r = 8 * a[e].key, n = a[e].iv;
      }
      var i = s(t, !1, r, n);
      return f(e, i.key, i.iv);
    }, r.createCipheriv = r.Cipheriv = f, r.createDecipher = r.Decipher = function (e, t) {
      var r, n;
      if (e = e.toLowerCase(), o[e]) r = o[e].key, n = o[e].iv;else {
        if (!a[e]) throw new TypeError("invalid suite type");
        r = 8 * a[e].key, n = a[e].iv;
      }
      var i = s(t, !1, r, n);
      return u(e, i.key, i.iv);
    }, r.createDecipheriv = r.Decipheriv = u, r.listCiphers = r.getCiphers = function () {
      return Object.keys(a).concat(i.getCiphers());
    };
  }, {
    "browserify-aes/browser": 22,
    "browserify-aes/modes": 33,
    "browserify-des": 38,
    "browserify-des/modes": 39,
    evp_bytestokey: 104
  }],
  38: [function (e, t, r) {
    var n = e("cipher-base"),
        i = e("des.js"),
        o = e("inherits"),
        a = e("safe-buffer").Buffer,
        s = {
      "des-ede3-cbc": i.CBC.instantiate(i.EDE),
      "des-ede3": i.EDE,
      "des-ede-cbc": i.CBC.instantiate(i.EDE),
      "des-ede": i.EDE,
      "des-cbc": i.CBC.instantiate(i.DES),
      "des-ecb": i.DES
    };

    function f(e) {
      n.call(this);
      var t,
          r = e.mode.toLowerCase(),
          i = s[r];
      t = e.decrypt ? "decrypt" : "encrypt";
      var o = e.key;
      a.isBuffer(o) || (o = a.from(o)), "des-ede" !== r && "des-ede-cbc" !== r || (o = a.concat([o, o.slice(0, 8)]));
      var f = e.iv;
      a.isBuffer(f) || (f = a.from(f)), this._des = i.create({
        key: o,
        iv: f,
        type: t
      });
    }

    s.des = s["des-cbc"], s.des3 = s["des-ede3-cbc"], t.exports = f, o(f, n), f.prototype._update = function (e) {
      return a.from(this._des.update(e));
    }, f.prototype._final = function () {
      return a.from(this._des["final"]());
    };
  }, {
    "cipher-base": 66,
    "des.js": 75,
    inherits: 135,
    "safe-buffer": 182
  }],
  39: [function (e, t, r) {
    r["des-ecb"] = {
      key: 8,
      iv: 0
    }, r["des-cbc"] = r.des = {
      key: 8,
      iv: 8
    }, r["des-ede3-cbc"] = r.des3 = {
      key: 24,
      iv: 8
    }, r["des-ede3"] = {
      key: 24,
      iv: 0
    }, r["des-ede-cbc"] = {
      key: 16,
      iv: 8
    }, r["des-ede"] = {
      key: 16,
      iv: 0
    };
  }, {}],
  40: [function (e, t, r) {
    (function (r) {
      var n = e("bn.js"),
          i = e("randombytes");

      function o(e, t) {
        var i = function (e) {
          var t = a(e);
          return {
            blinder: t.toRed(n.mont(e.modulus)).redPow(new n(e.publicExponent)).fromRed(),
            unblinder: t.invm(e.modulus)
          };
        }(t),
            o = t.modulus.byteLength(),
            s = (n.mont(t.modulus), new n(e).mul(i.blinder).umod(t.modulus)),
            f = s.toRed(n.mont(t.prime1)),
            u = s.toRed(n.mont(t.prime2)),
            c = t.coefficient,
            h = t.prime1,
            d = t.prime2,
            l = f.redPow(t.exponent1),
            p = u.redPow(t.exponent2);

        l = l.fromRed(), p = p.fromRed();
        var b = l.isub(p).imul(c).umod(h);
        return b.imul(d), p.iadd(b), new r(p.imul(i.unblinder).umod(t.modulus).toArray(!1, o));
      }

      function a(e) {
        for (var t = e.modulus.byteLength(), r = new n(i(t)); r.cmp(e.modulus) >= 0 || !r.umod(e.prime1) || !r.umod(e.prime2);) {
          r = new n(i(t));
        }

        return r;
      }

      t.exports = o, o.getr = a;
    }).call(this, e("buffer").Buffer);
  }, {
    "bn.js": 41,
    buffer: 65,
    randombytes: 164
  }],
  41: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, {
    buffer: 19,
    dup: 15
  }],
  42: [function (e, t, r) {
    t.exports = e("./browser/algorithms.json");
  }, {
    "./browser/algorithms.json": 43
  }],
  43: [function (e, t, r) {
    t.exports = {
      sha224WithRSAEncryption: {
        sign: "rsa",
        hash: "sha224",
        id: "302d300d06096086480165030402040500041c"
      },
      "RSA-SHA224": {
        sign: "ecdsa/rsa",
        hash: "sha224",
        id: "302d300d06096086480165030402040500041c"
      },
      sha256WithRSAEncryption: {
        sign: "rsa",
        hash: "sha256",
        id: "3031300d060960864801650304020105000420"
      },
      "RSA-SHA256": {
        sign: "ecdsa/rsa",
        hash: "sha256",
        id: "3031300d060960864801650304020105000420"
      },
      sha384WithRSAEncryption: {
        sign: "rsa",
        hash: "sha384",
        id: "3041300d060960864801650304020205000430"
      },
      "RSA-SHA384": {
        sign: "ecdsa/rsa",
        hash: "sha384",
        id: "3041300d060960864801650304020205000430"
      },
      sha512WithRSAEncryption: {
        sign: "rsa",
        hash: "sha512",
        id: "3051300d060960864801650304020305000440"
      },
      "RSA-SHA512": {
        sign: "ecdsa/rsa",
        hash: "sha512",
        id: "3051300d060960864801650304020305000440"
      },
      "RSA-SHA1": {
        sign: "rsa",
        hash: "sha1",
        id: "3021300906052b0e03021a05000414"
      },
      "ecdsa-with-SHA1": {
        sign: "ecdsa",
        hash: "sha1",
        id: ""
      },
      sha256: {
        sign: "ecdsa",
        hash: "sha256",
        id: ""
      },
      sha224: {
        sign: "ecdsa",
        hash: "sha224",
        id: ""
      },
      sha384: {
        sign: "ecdsa",
        hash: "sha384",
        id: ""
      },
      sha512: {
        sign: "ecdsa",
        hash: "sha512",
        id: ""
      },
      "DSA-SHA": {
        sign: "dsa",
        hash: "sha1",
        id: ""
      },
      "DSA-SHA1": {
        sign: "dsa",
        hash: "sha1",
        id: ""
      },
      DSA: {
        sign: "dsa",
        hash: "sha1",
        id: ""
      },
      "DSA-WITH-SHA224": {
        sign: "dsa",
        hash: "sha224",
        id: ""
      },
      "DSA-SHA224": {
        sign: "dsa",
        hash: "sha224",
        id: ""
      },
      "DSA-WITH-SHA256": {
        sign: "dsa",
        hash: "sha256",
        id: ""
      },
      "DSA-SHA256": {
        sign: "dsa",
        hash: "sha256",
        id: ""
      },
      "DSA-WITH-SHA384": {
        sign: "dsa",
        hash: "sha384",
        id: ""
      },
      "DSA-SHA384": {
        sign: "dsa",
        hash: "sha384",
        id: ""
      },
      "DSA-WITH-SHA512": {
        sign: "dsa",
        hash: "sha512",
        id: ""
      },
      "DSA-SHA512": {
        sign: "dsa",
        hash: "sha512",
        id: ""
      },
      "DSA-RIPEMD160": {
        sign: "dsa",
        hash: "rmd160",
        id: ""
      },
      ripemd160WithRSA: {
        sign: "rsa",
        hash: "rmd160",
        id: "3021300906052b2403020105000414"
      },
      "RSA-RIPEMD160": {
        sign: "rsa",
        hash: "rmd160",
        id: "3021300906052b2403020105000414"
      },
      md5WithRSAEncryption: {
        sign: "rsa",
        hash: "md5",
        id: "3020300c06082a864886f70d020505000410"
      },
      "RSA-MD5": {
        sign: "rsa",
        hash: "md5",
        id: "3020300c06082a864886f70d020505000410"
      }
    };
  }, {}],
  44: [function (e, t, r) {
    t.exports = {
      "1.3.132.0.10": "secp256k1",
      "1.3.132.0.33": "p224",
      "1.2.840.10045.3.1.1": "p192",
      "1.2.840.10045.3.1.7": "p256",
      "1.3.132.0.34": "p384",
      "1.3.132.0.35": "p521"
    };
  }, {}],
  45: [function (e, t, r) {
    var n = e("safe-buffer").Buffer,
        i = e("create-hash"),
        o = e("readable-stream"),
        a = e("inherits"),
        s = e("./sign"),
        f = e("./verify"),
        u = e("./algorithms.json");

    function c(e) {
      o.Writable.call(this);
      var t = u[e];
      if (!t) throw new Error("Unknown message digest");
      this._hashType = t.hash, this._hash = i(t.hash), this._tag = t.id, this._signType = t.sign;
    }

    function h(e) {
      o.Writable.call(this);
      var t = u[e];
      if (!t) throw new Error("Unknown message digest");
      this._hash = i(t.hash), this._tag = t.id, this._signType = t.sign;
    }

    function d(e) {
      return new c(e);
    }

    function l(e) {
      return new h(e);
    }

    Object.keys(u).forEach(function (e) {
      u[e].id = n.from(u[e].id, "hex"), u[e.toLowerCase()] = u[e];
    }), a(c, o.Writable), c.prototype._write = function (e, t, r) {
      this._hash.update(e), r();
    }, c.prototype.update = function (e, t) {
      return "string" == typeof e && (e = n.from(e, t)), this._hash.update(e), this;
    }, c.prototype.sign = function (e, t) {
      this.end();

      var r = this._hash.digest(),
          n = s(r, e, this._hashType, this._signType, this._tag);

      return t ? n.toString(t) : n;
    }, a(h, o.Writable), h.prototype._write = function (e, t, r) {
      this._hash.update(e), r();
    }, h.prototype.update = function (e, t) {
      return "string" == typeof e && (e = n.from(e, t)), this._hash.update(e), this;
    }, h.prototype.verify = function (e, t, r) {
      "string" == typeof t && (t = n.from(t, r)), this.end();

      var i = this._hash.digest();

      return f(t, i, e, this._signType, this._tag);
    }, t.exports = {
      Sign: d,
      Verify: l,
      createSign: d,
      createVerify: l
    };
  }, {
    "./algorithms.json": 43,
    "./sign": 46,
    "./verify": 47,
    "create-hash": 70,
    inherits: 135,
    "readable-stream": 62,
    "safe-buffer": 182
  }],
  46: [function (e, t, r) {
    var n = e("safe-buffer").Buffer,
        i = e("create-hmac"),
        o = e("browserify-rsa"),
        a = e("elliptic").ec,
        s = e("bn.js"),
        f = e("parse-asn1"),
        u = e("./curves.json");

    function c(e, t, r, o) {
      if ((e = n.from(e.toArray())).length < t.byteLength()) {
        var a = n.alloc(t.byteLength() - e.length);
        e = n.concat([a, e]);
      }

      var s = r.length,
          f = function (e, t) {
        e = (e = h(e, t)).mod(t);
        var r = n.from(e.toArray());

        if (r.length < t.byteLength()) {
          var i = n.alloc(t.byteLength() - r.length);
          r = n.concat([i, r]);
        }

        return r;
      }(r, t),
          u = n.alloc(s);

      u.fill(1);
      var c = n.alloc(s);
      return c = i(o, c).update(u).update(n.from([0])).update(e).update(f).digest(), u = i(o, c).update(u).digest(), {
        k: c = i(o, c).update(u).update(n.from([1])).update(e).update(f).digest(),
        v: u = i(o, c).update(u).digest()
      };
    }

    function h(e, t) {
      var r = new s(e),
          n = (e.length << 3) - t.bitLength();
      return n > 0 && r.ishrn(n), r;
    }

    function d(e, t, r) {
      var o, a;

      do {
        for (o = n.alloc(0); 8 * o.length < e.bitLength();) {
          t.v = i(r, t.k).update(t.v).digest(), o = n.concat([o, t.v]);
        }

        a = h(o, e), t.k = i(r, t.k).update(t.v).update(n.from([0])).digest(), t.v = i(r, t.k).update(t.v).digest();
      } while (-1 !== a.cmp(e));

      return a;
    }

    function l(e, t, r, n) {
      return e.toRed(s.mont(r)).redPow(t).fromRed().mod(n);
    }

    t.exports = function (e, t, r, i, p) {
      var b = f(t);

      if (b.curve) {
        if ("ecdsa" !== i && "ecdsa/rsa" !== i) throw new Error("wrong private key type");
        return function (e, t) {
          var r = u[t.curve.join(".")];
          if (!r) throw new Error("unknown curve " + t.curve.join("."));
          var i = new a(r).keyFromPrivate(t.privateKey).sign(e);
          return n.from(i.toDER());
        }(e, b);
      }

      if ("dsa" === b.type) {
        if ("dsa" !== i) throw new Error("wrong private key type");
        return function (e, t, r) {
          var i,
              o = t.params.priv_key,
              a = t.params.p,
              f = t.params.q,
              u = t.params.g,
              p = new s(0),
              b = h(e, f).mod(f),
              m = !1,
              y = c(o, f, e, r);

          for (; !1 === m;) {
            i = d(f, y, r), p = l(u, i, a, f), 0 === (m = i.invm(f).imul(b.add(o.mul(p))).mod(f)).cmpn(0) && (m = !1, p = new s(0));
          }

          return function (e, t) {
            e = e.toArray(), t = t.toArray(), 128 & e[0] && (e = [0].concat(e));
            128 & t[0] && (t = [0].concat(t));
            var r = [48, e.length + t.length + 4, 2, e.length];
            return r = r.concat(e, [2, t.length], t), n.from(r);
          }(p, m);
        }(e, b, r);
      }

      if ("rsa" !== i && "ecdsa/rsa" !== i) throw new Error("wrong private key type");
      e = n.concat([p, e]);

      for (var m = b.modulus.byteLength(), y = [0, 1]; e.length + y.length + 1 < m;) {
        y.push(255);
      }

      y.push(0);

      for (var g = -1; ++g < e.length;) {
        y.push(e[g]);
      }

      return o(y, b);
    }, t.exports.getKey = c, t.exports.makeKey = d;
  }, {
    "./curves.json": 44,
    "bn.js": 17,
    "browserify-rsa": 40,
    "create-hmac": 72,
    elliptic: 86,
    "parse-asn1": 147,
    "safe-buffer": 182
  }],
  47: [function (e, t, r) {
    var n = e("safe-buffer").Buffer,
        i = e("bn.js"),
        o = e("elliptic").ec,
        a = e("parse-asn1"),
        s = e("./curves.json");

    function f(e, t) {
      if (e.cmpn(0) <= 0) throw new Error("invalid sig");
      if (e.cmp(t) >= t) throw new Error("invalid sig");
    }

    t.exports = function (e, t, r, u, c) {
      var h = a(r);

      if ("ec" === h.type) {
        if ("ecdsa" !== u && "ecdsa/rsa" !== u) throw new Error("wrong public key type");
        return function (e, t, r) {
          var n = s[r.data.algorithm.curve.join(".")];
          if (!n) throw new Error("unknown curve " + r.data.algorithm.curve.join("."));
          var i = new o(n),
              a = r.data.subjectPrivateKey.data;
          return i.verify(t, e, a);
        }(e, t, h);
      }

      if ("dsa" === h.type) {
        if ("dsa" !== u) throw new Error("wrong public key type");
        return function (e, t, r) {
          var n = r.data.p,
              o = r.data.q,
              s = r.data.g,
              u = r.data.pub_key,
              c = a.signature.decode(e, "der"),
              h = c.s,
              d = c.r;
          f(h, o), f(d, o);
          var l = i.mont(n),
              p = h.invm(o);
          return 0 === s.toRed(l).redPow(new i(t).mul(p).mod(o)).fromRed().mul(u.toRed(l).redPow(d.mul(p).mod(o)).fromRed()).mod(n).mod(o).cmp(d);
        }(e, t, h);
      }

      if ("rsa" !== u && "ecdsa/rsa" !== u) throw new Error("wrong public key type");
      t = n.concat([c, t]);

      for (var d = h.modulus.byteLength(), l = [1], p = 0; t.length + l.length + 2 < d;) {
        l.push(255), p++;
      }

      l.push(0);

      for (var b = -1; ++b < t.length;) {
        l.push(t[b]);
      }

      l = n.from(l);
      var m = i.mont(h.modulus);
      e = (e = new i(e).toRed(m)).redPow(new i(h.publicExponent)), e = n.from(e.fromRed().toArray());
      var y = p < 8 ? 1 : 0;

      for (d = Math.min(e.length, l.length), e.length !== l.length && (y = 1), b = -1; ++b < d;) {
        y |= e[b] ^ l[b];
      }

      return 0 === y;
    };
  }, {
    "./curves.json": 44,
    "bn.js": 17,
    elliptic: 86,
    "parse-asn1": 147,
    "safe-buffer": 182
  }],
  48: [function (e, t, r) {
    "use strict";

    var n = {};

    function i(e, t, r) {
      r || (r = Error);

      var i = function (e) {
        var r, n;

        function i(r, n, i) {
          return e.call(this, function (e, r, n) {
            return "string" == typeof t ? t : t(e, r, n);
          }(r, n, i)) || this;
        }

        return n = e, (r = i).prototype = Object.create(n.prototype), r.prototype.constructor = r, r.__proto__ = n, i;
      }(r);

      i.prototype.name = r.name, i.prototype.code = e, n[e] = i;
    }

    function o(e, t) {
      if (Array.isArray(e)) {
        var r = e.length;
        return e = e.map(function (e) {
          return String(e);
        }), r > 2 ? "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(", "), ", or ") + e[r - 1] : 2 === r ? "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]) : "of ".concat(t, " ").concat(e[0]);
      }

      return "of ".concat(t, " ").concat(String(e));
    }

    i("ERR_INVALID_OPT_VALUE", function (e, t) {
      return 'The value "' + t + '" is invalid for option "' + e + '"';
    }, TypeError), i("ERR_INVALID_ARG_TYPE", function (e, t, r) {
      var n, i, a, s;
      if ("string" == typeof t && (i = "not ", t.substr(!a || a < 0 ? 0 : +a, i.length) === i) ? (n = "must not be", t = t.replace(/^not /, "")) : n = "must be", function (e, t, r) {
        return (void 0 === r || r > e.length) && (r = e.length), e.substring(r - t.length, r) === t;
      }(e, " argument")) s = "The ".concat(e, " ").concat(n, " ").concat(o(t, "type"));else {
        var f = function (e, t, r) {
          return "number" != typeof r && (r = 0), !(r + t.length > e.length) && -1 !== e.indexOf(t, r);
        }(e, ".") ? "property" : "argument";
        s = 'The "'.concat(e, '" ').concat(f, " ").concat(n, " ").concat(o(t, "type"));
      }
      return s += ". Received type ".concat(_typeof(r));
    }, TypeError), i("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), i("ERR_METHOD_NOT_IMPLEMENTED", function (e) {
      return "The " + e + " method is not implemented";
    }), i("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), i("ERR_STREAM_DESTROYED", function (e) {
      return "Cannot call " + e + " after a stream was destroyed";
    }), i("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), i("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), i("ERR_STREAM_WRITE_AFTER_END", "write after end"), i("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), i("ERR_UNKNOWN_ENCODING", function (e) {
      return "Unknown encoding: " + e;
    }, TypeError), i("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), t.exports.codes = n;
  }, {}],
  49: [function (e, t, r) {
    (function (r) {
      "use strict";

      var n = Object.keys || function (e) {
        var t = [];

        for (var r in e) {
          t.push(r);
        }

        return t;
      };

      t.exports = u;
      var i = e("./_stream_readable"),
          o = e("./_stream_writable");
      e("inherits")(u, i);

      for (var a = n(o.prototype), s = 0; s < a.length; s++) {
        var f = a[s];
        u.prototype[f] || (u.prototype[f] = o.prototype[f]);
      }

      function u(e) {
        if (!(this instanceof u)) return new u(e);
        i.call(this, e), o.call(this, e), this.allowHalfOpen = !0, e && (!1 === e.readable && (this.readable = !1), !1 === e.writable && (this.writable = !1), !1 === e.allowHalfOpen && (this.allowHalfOpen = !1, this.once("end", c)));
      }

      function c() {
        this._writableState.ended || r.nextTick(h, this);
      }

      function h(e) {
        e.end();
      }

      Object.defineProperty(u.prototype, "writableHighWaterMark", {
        enumerable: !1,
        get: function get() {
          return this._writableState.highWaterMark;
        }
      }), Object.defineProperty(u.prototype, "writableBuffer", {
        enumerable: !1,
        get: function get() {
          return this._writableState && this._writableState.getBuffer();
        }
      }), Object.defineProperty(u.prototype, "writableLength", {
        enumerable: !1,
        get: function get() {
          return this._writableState.length;
        }
      }), Object.defineProperty(u.prototype, "destroyed", {
        enumerable: !1,
        get: function get() {
          return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed;
        },
        set: function set(e) {
          void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e);
        }
      });
    }).call(this, e("_process"));
  }, {
    "./_stream_readable": 51,
    "./_stream_writable": 53,
    _process: 156,
    inherits: 135
  }],
  50: [function (e, t, r) {
    "use strict";

    t.exports = i;
    var n = e("./_stream_transform");

    function i(e) {
      if (!(this instanceof i)) return new i(e);
      n.call(this, e);
    }

    e("inherits")(i, n), i.prototype._transform = function (e, t, r) {
      r(null, e);
    };
  }, {
    "./_stream_transform": 52,
    inherits: 135
  }],
  51: [function (e, t, r) {
    (function (r, n) {
      "use strict";

      var i;
      t.exports = k, k.ReadableState = S;
      e("events").EventEmitter;

      var o = function o(e, t) {
        return e.listeners(t).length;
      },
          a = e("./internal/streams/stream"),
          s = e("buffer").Buffer,
          f = n.Uint8Array || function () {};

      var u,
          c = e("util");
      u = c && c.debuglog ? c.debuglog("stream") : function () {};
      var h,
          d,
          l,
          p = e("./internal/streams/buffer_list"),
          b = e("./internal/streams/destroy"),
          m = e("./internal/streams/state").getHighWaterMark,
          y = e("../errors").codes,
          g = y.ERR_INVALID_ARG_TYPE,
          v = y.ERR_STREAM_PUSH_AFTER_EOF,
          w = y.ERR_METHOD_NOT_IMPLEMENTED,
          _ = y.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
      e("inherits")(k, a);
      var E = b.errorOrDestroy,
          M = ["error", "close", "destroy", "pause", "resume"];

      function S(t, r, n) {
        i = i || e("./_stream_duplex"), t = t || {}, "boolean" != typeof n && (n = r instanceof i), this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.readableObjectMode), this.highWaterMark = m(this, t, "readableHighWaterMark", n), this.buffer = new p(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = !1 !== t.emitClose, this.autoDestroy = !!t.autoDestroy, this.destroyed = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (h || (h = e("string_decoder/").StringDecoder), this.decoder = new h(t.encoding), this.encoding = t.encoding);
      }

      function k(t) {
        if (i = i || e("./_stream_duplex"), !(this instanceof k)) return new k(t);
        var r = this instanceof i;
        this._readableState = new S(t, this, r), this.readable = !0, t && ("function" == typeof t.read && (this._read = t.read), "function" == typeof t.destroy && (this._destroy = t.destroy)), a.call(this);
      }

      function A(e, t, r, n, i) {
        u("readableAddChunk", t);
        var o,
            a = e._readableState;
        if (null === t) a.reading = !1, function (e, t) {
          if (u("onEofChunk"), t.ended) return;

          if (t.decoder) {
            var r = t.decoder.end();
            r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
          }

          t.ended = !0, t.sync ? I(e) : (t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, B(e)));
        }(e, a);else if (i || (o = function (e, t) {
          var r;
          n = t, s.isBuffer(n) || n instanceof f || "string" == typeof t || void 0 === t || e.objectMode || (r = new g("chunk", ["string", "Buffer", "Uint8Array"], t));
          var n;
          return r;
        }(a, t)), o) E(e, o);else if (a.objectMode || t && t.length > 0) {
          if ("string" == typeof t || a.objectMode || Object.getPrototypeOf(t) === s.prototype || (t = function (e) {
            return s.from(e);
          }(t)), n) a.endEmitted ? E(e, new _()) : x(e, a, t, !0);else if (a.ended) E(e, new v());else {
            if (a.destroyed) return !1;
            a.reading = !1, a.decoder && !r ? (t = a.decoder.write(t), a.objectMode || 0 !== t.length ? x(e, a, t, !1) : T(e, a)) : x(e, a, t, !1);
          }
        } else n || (a.reading = !1, T(e, a));
        return !a.ended && (a.length < a.highWaterMark || 0 === a.length);
      }

      function x(e, t, r, n) {
        t.flowing && 0 === t.length && !t.sync ? (t.awaitDrain = 0, e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length, n ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && I(e)), T(e, t);
      }

      Object.defineProperty(k.prototype, "destroyed", {
        enumerable: !1,
        get: function get() {
          return void 0 !== this._readableState && this._readableState.destroyed;
        },
        set: function set(e) {
          this._readableState && (this._readableState.destroyed = e);
        }
      }), k.prototype.destroy = b.destroy, k.prototype._undestroy = b.undestroy, k.prototype._destroy = function (e, t) {
        t(e);
      }, k.prototype.push = function (e, t) {
        var r,
            n = this._readableState;
        return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = s.from(e, t), t = ""), r = !0), A(this, e, t, !1, r);
      }, k.prototype.unshift = function (e) {
        return A(this, e, null, !0, !1);
      }, k.prototype.isPaused = function () {
        return !1 === this._readableState.flowing;
      }, k.prototype.setEncoding = function (t) {
        h || (h = e("string_decoder/").StringDecoder);
        var r = new h(t);
        this._readableState.decoder = r, this._readableState.encoding = this._readableState.decoder.encoding;

        for (var n = this._readableState.buffer.head, i = ""; null !== n;) {
          i += r.write(n.data), n = n.next;
        }

        return this._readableState.buffer.clear(), "" !== i && this._readableState.buffer.push(i), this._readableState.length = i.length, this;
      };

      function R(e, t) {
        return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function (e) {
          return e >= 1073741824 ? e = 1073741824 : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
        }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
      }

      function I(e) {
        var t = e._readableState;
        u("emitReadable", t.needReadable, t.emittedReadable), t.needReadable = !1, t.emittedReadable || (u("emitReadable", t.flowing), t.emittedReadable = !0, r.nextTick(B, e));
      }

      function B(e) {
        var t = e._readableState;
        u("emitReadable_", t.destroyed, t.length, t.ended), t.destroyed || !t.length && !t.ended || (e.emit("readable"), t.emittedReadable = !1), t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark, C(e);
      }

      function T(e, t) {
        t.readingMore || (t.readingMore = !0, r.nextTick(j, e, t));
      }

      function j(e, t) {
        for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length);) {
          var r = t.length;
          if (u("maybeReadMore read 0"), e.read(0), r === t.length) break;
        }

        t.readingMore = !1;
      }

      function D(e) {
        var t = e._readableState;
        t.readableListening = e.listenerCount("readable") > 0, t.resumeScheduled && !t.paused ? t.flowing = !0 : e.listenerCount("data") > 0 && e.resume();
      }

      function P(e) {
        u("readable nexttick read 0"), e.read(0);
      }

      function O(e, t) {
        u("resume", t.reading), t.reading || e.read(0), t.resumeScheduled = !1, e.emit("resume"), C(e), t.flowing && !t.reading && e.read(0);
      }

      function C(e) {
        var t = e._readableState;

        for (u("flow", t.flowing); t.flowing && null !== e.read();) {
          ;
        }
      }

      function L(e, t) {
        return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length), t.buffer.clear()) : r = t.buffer.consume(e, t.decoder), r);
        var r;
      }

      function N(e) {
        var t = e._readableState;
        u("endReadable", t.endEmitted), t.endEmitted || (t.ended = !0, r.nextTick(U, t, e));
      }

      function U(e, t) {
        if (u("endReadableNT", e.endEmitted, e.length), !e.endEmitted && 0 === e.length && (e.endEmitted = !0, t.readable = !1, t.emit("end"), e.autoDestroy)) {
          var r = t._writableState;
          (!r || r.autoDestroy && r.finished) && t.destroy();
        }
      }

      function q(e, t) {
        for (var r = 0, n = e.length; r < n; r++) {
          if (e[r] === t) return r;
        }

        return -1;
      }

      k.prototype.read = function (e) {
        u("read", e), e = parseInt(e, 10);
        var t = this._readableState,
            r = e;
        if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : t.length > 0) || t.ended)) return u("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? N(this) : I(this), null;
        if (0 === (e = R(e, t)) && t.ended) return 0 === t.length && N(this), null;
        var n,
            i = t.needReadable;
        return u("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && u("length less than watermark", i = !0), t.ended || t.reading ? u("reading or ended", i = !1) : i && (u("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = R(r, t))), null === (n = e > 0 ? L(e, t) : null) ? (t.needReadable = t.length <= t.highWaterMark, e = 0) : (t.length -= e, t.awaitDrain = 0), 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && N(this)), null !== n && this.emit("data", n), n;
      }, k.prototype._read = function (e) {
        E(this, new w("_read()"));
      }, k.prototype.pipe = function (e, t) {
        var n = this,
            i = this._readableState;

        switch (i.pipesCount) {
          case 0:
            i.pipes = e;
            break;

          case 1:
            i.pipes = [i.pipes, e];
            break;

          default:
            i.pipes.push(e);
        }

        i.pipesCount += 1, u("pipe count=%d opts=%j", i.pipesCount, t);
        var a = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? f : m;

        function s(t, r) {
          u("onunpipe"), t === n && r && !1 === r.hasUnpiped && (r.hasUnpiped = !0, u("cleanup"), e.removeListener("close", p), e.removeListener("finish", b), e.removeListener("drain", c), e.removeListener("error", l), e.removeListener("unpipe", s), n.removeListener("end", f), n.removeListener("end", m), n.removeListener("data", d), h = !0, !i.awaitDrain || e._writableState && !e._writableState.needDrain || c());
        }

        function f() {
          u("onend"), e.end();
        }

        i.endEmitted ? r.nextTick(a) : n.once("end", a), e.on("unpipe", s);

        var c = function (e) {
          return function () {
            var t = e._readableState;
            u("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && o(e, "data") && (t.flowing = !0, C(e));
          };
        }(n);

        e.on("drain", c);
        var h = !1;

        function d(t) {
          u("ondata");
          var r = e.write(t);
          u("dest.write", r), !1 === r && ((1 === i.pipesCount && i.pipes === e || i.pipesCount > 1 && -1 !== q(i.pipes, e)) && !h && (u("false write response, pause", i.awaitDrain), i.awaitDrain++), n.pause());
        }

        function l(t) {
          u("onerror", t), m(), e.removeListener("error", l), 0 === o(e, "error") && E(e, t);
        }

        function p() {
          e.removeListener("finish", b), m();
        }

        function b() {
          u("onfinish"), e.removeListener("close", p), m();
        }

        function m() {
          u("unpipe"), n.unpipe(e);
        }

        return n.on("data", d), function (e, t, r) {
          if ("function" == typeof e.prependListener) return e.prependListener(t, r);
          e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r);
        }(e, "error", l), e.once("close", p), e.once("finish", b), e.emit("pipe", n), i.flowing || (u("pipe resume"), n.resume()), e;
      }, k.prototype.unpipe = function (e) {
        var t = this._readableState,
            r = {
          hasUnpiped: !1
        };
        if (0 === t.pipesCount) return this;
        if (1 === t.pipesCount) return e && e !== t.pipes || (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r)), this;

        if (!e) {
          var n = t.pipes,
              i = t.pipesCount;
          t.pipes = null, t.pipesCount = 0, t.flowing = !1;

          for (var o = 0; o < i; o++) {
            n[o].emit("unpipe", this, {
              hasUnpiped: !1
            });
          }

          return this;
        }

        var a = q(t.pipes, e);
        return -1 === a || (t.pipes.splice(a, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r)), this;
      }, k.prototype.on = function (e, t) {
        var n = a.prototype.on.call(this, e, t),
            i = this._readableState;
        return "data" === e ? (i.readableListening = this.listenerCount("readable") > 0, !1 !== i.flowing && this.resume()) : "readable" === e && (i.endEmitted || i.readableListening || (i.readableListening = i.needReadable = !0, i.flowing = !1, i.emittedReadable = !1, u("on readable", i.length, i.reading), i.length ? I(this) : i.reading || r.nextTick(P, this))), n;
      }, k.prototype.addListener = k.prototype.on, k.prototype.removeListener = function (e, t) {
        var n = a.prototype.removeListener.call(this, e, t);
        return "readable" === e && r.nextTick(D, this), n;
      }, k.prototype.removeAllListeners = function (e) {
        var t = a.prototype.removeAllListeners.apply(this, arguments);
        return "readable" !== e && void 0 !== e || r.nextTick(D, this), t;
      }, k.prototype.resume = function () {
        var e = this._readableState;
        return e.flowing || (u("resume"), e.flowing = !e.readableListening, function (e, t) {
          t.resumeScheduled || (t.resumeScheduled = !0, r.nextTick(O, e, t));
        }(this, e)), e.paused = !1, this;
      }, k.prototype.pause = function () {
        return u("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (u("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
      }, k.prototype.wrap = function (e) {
        var t = this,
            r = this._readableState,
            n = !1;

        for (var i in e.on("end", function () {
          if (u("wrapped end"), r.decoder && !r.ended) {
            var e = r.decoder.end();
            e && e.length && t.push(e);
          }

          t.push(null);
        }), e.on("data", function (i) {
          (u("wrapped data"), r.decoder && (i = r.decoder.write(i)), r.objectMode && null == i) || (r.objectMode || i && i.length) && (t.push(i) || (n = !0, e.pause()));
        }), e) {
          void 0 === this[i] && "function" == typeof e[i] && (this[i] = function (t) {
            return function () {
              return e[t].apply(e, arguments);
            };
          }(i));
        }

        for (var o = 0; o < M.length; o++) {
          e.on(M[o], this.emit.bind(this, M[o]));
        }

        return this._read = function (t) {
          u("wrapped _read", t), n && (n = !1, e.resume());
        }, this;
      }, "function" == typeof Symbol && (k.prototype[Symbol.asyncIterator] = function () {
        return void 0 === d && (d = e("./internal/streams/async_iterator")), d(this);
      }), Object.defineProperty(k.prototype, "readableHighWaterMark", {
        enumerable: !1,
        get: function get() {
          return this._readableState.highWaterMark;
        }
      }), Object.defineProperty(k.prototype, "readableBuffer", {
        enumerable: !1,
        get: function get() {
          return this._readableState && this._readableState.buffer;
        }
      }), Object.defineProperty(k.prototype, "readableFlowing", {
        enumerable: !1,
        get: function get() {
          return this._readableState.flowing;
        },
        set: function set(e) {
          this._readableState && (this._readableState.flowing = e);
        }
      }), k._fromList = L, Object.defineProperty(k.prototype, "readableLength", {
        enumerable: !1,
        get: function get() {
          return this._readableState.length;
        }
      }), "function" == typeof Symbol && (k.from = function (t, r) {
        return void 0 === l && (l = e("./internal/streams/from")), l(k, t, r);
      });
    }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {
    "../errors": 48,
    "./_stream_duplex": 49,
    "./internal/streams/async_iterator": 54,
    "./internal/streams/buffer_list": 55,
    "./internal/streams/destroy": 56,
    "./internal/streams/from": 58,
    "./internal/streams/state": 60,
    "./internal/streams/stream": 61,
    _process: 156,
    buffer: 65,
    events: 103,
    inherits: 135,
    "string_decoder/": 193,
    util: 19
  }],
  52: [function (e, t, r) {
    "use strict";

    t.exports = c;
    var n = e("../errors").codes,
        i = n.ERR_METHOD_NOT_IMPLEMENTED,
        o = n.ERR_MULTIPLE_CALLBACK,
        a = n.ERR_TRANSFORM_ALREADY_TRANSFORMING,
        s = n.ERR_TRANSFORM_WITH_LENGTH_0,
        f = e("./_stream_duplex");

    function u(e, t) {
      var r = this._transformState;
      r.transforming = !1;
      var n = r.writecb;
      if (null === n) return this.emit("error", new o());
      r.writechunk = null, r.writecb = null, null != t && this.push(t), n(e);
      var i = this._readableState;
      i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
    }

    function c(e) {
      if (!(this instanceof c)) return new c(e);
      f.call(this, e), this._transformState = {
        afterTransform: u.bind(this),
        needTransform: !1,
        transforming: !1,
        writecb: null,
        writechunk: null,
        writeencoding: null
      }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", h);
    }

    function h() {
      var e = this;
      "function" != typeof this._flush || this._readableState.destroyed ? d(this, null, null) : this._flush(function (t, r) {
        d(e, t, r);
      });
    }

    function d(e, t, r) {
      if (t) return e.emit("error", t);
      if (null != r && e.push(r), e._writableState.length) throw new s();
      if (e._transformState.transforming) throw new a();
      return e.push(null);
    }

    e("inherits")(c, f), c.prototype.push = function (e, t) {
      return this._transformState.needTransform = !1, f.prototype.push.call(this, e, t);
    }, c.prototype._transform = function (e, t, r) {
      r(new i("_transform()"));
    }, c.prototype._write = function (e, t, r) {
      var n = this._transformState;

      if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
        var i = this._readableState;
        (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
      }
    }, c.prototype._read = function (e) {
      var t = this._transformState;
      null === t.writechunk || t.transforming ? t.needTransform = !0 : (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform));
    }, c.prototype._destroy = function (e, t) {
      f.prototype._destroy.call(this, e, function (e) {
        t(e);
      });
    };
  }, {
    "../errors": 48,
    "./_stream_duplex": 49,
    inherits: 135
  }],
  53: [function (e, t, r) {
    (function (r, n) {
      "use strict";

      function i(e) {
        var t = this;
        this.next = null, this.entry = null, this.finish = function () {
          !function (e, t, r) {
            var n = e.entry;
            e.entry = null;

            for (; n;) {
              var i = n.callback;
              t.pendingcb--, i(r), n = n.next;
            }

            t.corkedRequestsFree.next = e;
          }(t, e);
        };
      }

      var o;
      t.exports = k, k.WritableState = S;

      var a = {
        deprecate: e("util-deprecate")
      },
          s = e("./internal/streams/stream"),
          f = e("buffer").Buffer,
          u = n.Uint8Array || function () {};

      var c,
          h = e("./internal/streams/destroy"),
          d = e("./internal/streams/state").getHighWaterMark,
          l = e("../errors").codes,
          p = l.ERR_INVALID_ARG_TYPE,
          b = l.ERR_METHOD_NOT_IMPLEMENTED,
          m = l.ERR_MULTIPLE_CALLBACK,
          y = l.ERR_STREAM_CANNOT_PIPE,
          g = l.ERR_STREAM_DESTROYED,
          v = l.ERR_STREAM_NULL_VALUES,
          w = l.ERR_STREAM_WRITE_AFTER_END,
          _ = l.ERR_UNKNOWN_ENCODING,
          E = h.errorOrDestroy;

      function M() {}

      function S(t, n, a) {
        o = o || e("./_stream_duplex"), t = t || {}, "boolean" != typeof a && (a = n instanceof o), this.objectMode = !!t.objectMode, a && (this.objectMode = this.objectMode || !!t.writableObjectMode), this.highWaterMark = d(this, t, "writableHighWaterMark", a), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
        var s = !1 === t.decodeStrings;
        this.decodeStrings = !s, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
          !function (e, t) {
            var n = e._writableState,
                i = n.sync,
                o = n.writecb;
            if ("function" != typeof o) throw new m();
            if (function (e) {
              e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
            }(n), t) !function (e, t, n, i, o) {
              --t.pendingcb, n ? (r.nextTick(o, i), r.nextTick(T, e, t), e._writableState.errorEmitted = !0, E(e, i)) : (o(i), e._writableState.errorEmitted = !0, E(e, i), T(e, t));
            }(e, n, i, t, o);else {
              var a = I(n) || e.destroyed;
              a || n.corked || n.bufferProcessing || !n.bufferedRequest || R(e, n), i ? r.nextTick(x, e, n, a, o) : x(e, n, a, o);
            }
          }(n, e);
        }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !1 !== t.emitClose, this.autoDestroy = !!t.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new i(this);
      }

      function k(t) {
        var r = this instanceof (o = o || e("./_stream_duplex"));
        if (!r && !c.call(k, this)) return new k(t);
        this._writableState = new S(t, this, r), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), "function" == typeof t["final"] && (this._final = t["final"])), s.call(this);
      }

      function A(e, t, r, n, i, o, a) {
        t.writelen = n, t.writecb = a, t.writing = !0, t.sync = !0, t.destroyed ? t.onwrite(new g("write")) : r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1;
      }

      function x(e, t, r, n) {
        r || function (e, t) {
          0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
        }(e, t), t.pendingcb--, n(), T(e, t);
      }

      function R(e, t) {
        t.bufferProcessing = !0;
        var r = t.bufferedRequest;

        if (e._writev && r && r.next) {
          var n = t.bufferedRequestCount,
              o = new Array(n),
              a = t.corkedRequestsFree;
          a.entry = r;

          for (var s = 0, f = !0; r;) {
            o[s] = r, r.isBuf || (f = !1), r = r.next, s += 1;
          }

          o.allBuffers = f, A(e, t, !0, t.length, o, "", a.finish), t.pendingcb++, t.lastBufferedRequest = null, a.next ? (t.corkedRequestsFree = a.next, a.next = null) : t.corkedRequestsFree = new i(t), t.bufferedRequestCount = 0;
        } else {
          for (; r;) {
            var u = r.chunk,
                c = r.encoding,
                h = r.callback;
            if (A(e, t, !1, t.objectMode ? 1 : u.length, u, c, h), r = r.next, t.bufferedRequestCount--, t.writing) break;
          }

          null === r && (t.lastBufferedRequest = null);
        }

        t.bufferedRequest = r, t.bufferProcessing = !1;
      }

      function I(e) {
        return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
      }

      function B(e, t) {
        e._final(function (r) {
          t.pendingcb--, r && E(e, r), t.prefinished = !0, e.emit("prefinish"), T(e, t);
        });
      }

      function T(e, t) {
        var n = I(t);

        if (n && (function (e, t) {
          t.prefinished || t.finalCalled || ("function" != typeof e._final || t.destroyed ? (t.prefinished = !0, e.emit("prefinish")) : (t.pendingcb++, t.finalCalled = !0, r.nextTick(B, e, t)));
        }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"), t.autoDestroy))) {
          var i = e._readableState;
          (!i || i.autoDestroy && i.endEmitted) && e.destroy();
        }

        return n;
      }

      e("inherits")(k, s), S.prototype.getBuffer = function () {
        for (var e = this.bufferedRequest, t = []; e;) {
          t.push(e), e = e.next;
        }

        return t;
      }, function () {
        try {
          Object.defineProperty(S.prototype, "buffer", {
            get: a.deprecate(function () {
              return this.getBuffer();
            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
          });
        } catch (e) {}
      }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (c = Function.prototype[Symbol.hasInstance], Object.defineProperty(k, Symbol.hasInstance, {
        value: function value(e) {
          return !!c.call(this, e) || this === k && e && e._writableState instanceof S;
        }
      })) : c = function c(e) {
        return e instanceof this;
      }, k.prototype.pipe = function () {
        E(this, new y());
      }, k.prototype.write = function (e, t, n) {
        var i,
            o = this._writableState,
            a = !1,
            s = !o.objectMode && (i = e, f.isBuffer(i) || i instanceof u);
        return s && !f.isBuffer(e) && (e = function (e) {
          return f.from(e);
        }(e)), "function" == typeof t && (n = t, t = null), s ? t = "buffer" : t || (t = o.defaultEncoding), "function" != typeof n && (n = M), o.ending ? function (e, t) {
          var n = new w();
          E(e, n), r.nextTick(t, n);
        }(this, n) : (s || function (e, t, n, i) {
          var o;
          return null === n ? o = new v() : "string" == typeof n || t.objectMode || (o = new p("chunk", ["string", "Buffer"], n)), !o || (E(e, o), r.nextTick(i, o), !1);
        }(this, o, e, n)) && (o.pendingcb++, a = function (e, t, r, n, i, o) {
          if (!r) {
            var a = function (e, t, r) {
              e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = f.from(t, r));
              return t;
            }(t, n, i);

            n !== a && (r = !0, i = "buffer", n = a);
          }

          var s = t.objectMode ? 1 : n.length;
          t.length += s;
          var u = t.length < t.highWaterMark;
          u || (t.needDrain = !0);

          if (t.writing || t.corked) {
            var c = t.lastBufferedRequest;
            t.lastBufferedRequest = {
              chunk: n,
              encoding: i,
              isBuf: r,
              callback: o,
              next: null
            }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
          } else A(e, t, !1, s, n, i, o);

          return u;
        }(this, o, s, e, t, n)), a;
      }, k.prototype.cork = function () {
        this._writableState.corked++;
      }, k.prototype.uncork = function () {
        var e = this._writableState;
        e.corked && (e.corked--, e.writing || e.corked || e.bufferProcessing || !e.bufferedRequest || R(this, e));
      }, k.prototype.setDefaultEncoding = function (e) {
        if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new _(e);
        return this._writableState.defaultEncoding = e, this;
      }, Object.defineProperty(k.prototype, "writableBuffer", {
        enumerable: !1,
        get: function get() {
          return this._writableState && this._writableState.getBuffer();
        }
      }), Object.defineProperty(k.prototype, "writableHighWaterMark", {
        enumerable: !1,
        get: function get() {
          return this._writableState.highWaterMark;
        }
      }), k.prototype._write = function (e, t, r) {
        r(new b("_write()"));
      }, k.prototype._writev = null, k.prototype.end = function (e, t, n) {
        var i = this._writableState;
        return "function" == typeof e ? (n = e, e = null, t = null) : "function" == typeof t && (n = t, t = null), null != e && this.write(e, t), i.corked && (i.corked = 1, this.uncork()), i.ending || function (e, t, n) {
          t.ending = !0, T(e, t), n && (t.finished ? r.nextTick(n) : e.once("finish", n));
          t.ended = !0, e.writable = !1;
        }(this, i, n), this;
      }, Object.defineProperty(k.prototype, "writableLength", {
        enumerable: !1,
        get: function get() {
          return this._writableState.length;
        }
      }), Object.defineProperty(k.prototype, "destroyed", {
        enumerable: !1,
        get: function get() {
          return void 0 !== this._writableState && this._writableState.destroyed;
        },
        set: function set(e) {
          this._writableState && (this._writableState.destroyed = e);
        }
      }), k.prototype.destroy = h.destroy, k.prototype._undestroy = h.undestroy, k.prototype._destroy = function (e, t) {
        t(e);
      };
    }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {
    "../errors": 48,
    "./_stream_duplex": 49,
    "./internal/streams/destroy": 56,
    "./internal/streams/state": 60,
    "./internal/streams/stream": 61,
    _process: 156,
    buffer: 65,
    inherits: 135,
    "util-deprecate": 195
  }],
  54: [function (e, t, r) {
    (function (r) {
      "use strict";

      var n;

      function i(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e;
      }

      var o = e("./end-of-stream"),
          a = Symbol("lastResolve"),
          s = Symbol("lastReject"),
          f = Symbol("error"),
          u = Symbol("ended"),
          c = Symbol("lastPromise"),
          h = Symbol("handlePromise"),
          d = Symbol("stream");

      function l(e, t) {
        return {
          value: e,
          done: t
        };
      }

      function p(e) {
        var t = e[a];

        if (null !== t) {
          var r = e[d].read();
          null !== r && (e[c] = null, e[a] = null, e[s] = null, t(l(r, !1)));
        }
      }

      function b(e) {
        r.nextTick(p, e);
      }

      var m = Object.getPrototypeOf(function () {}),
          y = Object.setPrototypeOf((i(n = {
        get stream() {
          return this[d];
        },

        next: function next() {
          var e = this,
              t = this[f];
          if (null !== t) return Promise.reject(t);
          if (this[u]) return Promise.resolve(l(void 0, !0));
          if (this[d].destroyed) return new Promise(function (t, n) {
            r.nextTick(function () {
              e[f] ? n(e[f]) : t(l(void 0, !0));
            });
          });
          var n,
              i = this[c];
          if (i) n = new Promise(function (e, t) {
            return function (r, n) {
              e.then(function () {
                t[u] ? r(l(void 0, !0)) : t[h](r, n);
              }, n);
            };
          }(i, this));else {
            var o = this[d].read();
            if (null !== o) return Promise.resolve(l(o, !1));
            n = new Promise(this[h]);
          }
          return this[c] = n, n;
        }
      }, Symbol.asyncIterator, function () {
        return this;
      }), i(n, "return", function () {
        var e = this;
        return new Promise(function (t, r) {
          e[d].destroy(null, function (e) {
            e ? r(e) : t(l(void 0, !0));
          });
        });
      }), n), m);

      t.exports = function (e) {
        var t,
            r = Object.create(y, (i(t = {}, d, {
          value: e,
          writable: !0
        }), i(t, a, {
          value: null,
          writable: !0
        }), i(t, s, {
          value: null,
          writable: !0
        }), i(t, f, {
          value: null,
          writable: !0
        }), i(t, u, {
          value: e._readableState.endEmitted,
          writable: !0
        }), i(t, h, {
          value: function value(e, t) {
            var n = r[d].read();
            n ? (r[c] = null, r[a] = null, r[s] = null, e(l(n, !1))) : (r[a] = e, r[s] = t);
          },
          writable: !0
        }), t));
        return r[c] = null, o(e, function (e) {
          if (e && "ERR_STREAM_PREMATURE_CLOSE" !== e.code) {
            var t = r[s];
            return null !== t && (r[c] = null, r[a] = null, r[s] = null, t(e)), void (r[f] = e);
          }

          var n = r[a];
          null !== n && (r[c] = null, r[a] = null, r[s] = null, n(l(void 0, !0))), r[u] = !0;
        }), e.on("readable", b.bind(null, r)), r;
      };
    }).call(this, e("_process"));
  }, {
    "./end-of-stream": 57,
    _process: 156
  }],
  55: [function (e, t, r) {
    "use strict";

    function n(e, t) {
      var r = Object.keys(e);

      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })), r.push.apply(r, n);
      }

      return r;
    }

    function i(e, t, r) {
      return t in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[t] = r, e;
    }

    function o(e, t) {
      for (var r = 0; r < t.length; r++) {
        var n = t[r];
        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
      }
    }

    var a = e("buffer").Buffer,
        s = e("util").inspect,
        f = s && s.custom || "inspect";

    t.exports = function () {
      function e() {
        !function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, e), this.head = null, this.tail = null, this.length = 0;
      }

      var t, r, u;
      return t = e, (r = [{
        key: "push",
        value: function value(e) {
          var t = {
            data: e,
            next: null
          };
          this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
        }
      }, {
        key: "unshift",
        value: function value(e) {
          var t = {
            data: e,
            next: this.head
          };
          0 === this.length && (this.tail = t), this.head = t, ++this.length;
        }
      }, {
        key: "shift",
        value: function value() {
          if (0 !== this.length) {
            var e = this.head.data;
            return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
          }
        }
      }, {
        key: "clear",
        value: function value() {
          this.head = this.tail = null, this.length = 0;
        }
      }, {
        key: "join",
        value: function value(e) {
          if (0 === this.length) return "";

          for (var t = this.head, r = "" + t.data; t = t.next;) {
            r += e + t.data;
          }

          return r;
        }
      }, {
        key: "concat",
        value: function value(e) {
          if (0 === this.length) return a.alloc(0);

          for (var t, r, n, i = a.allocUnsafe(e >>> 0), o = this.head, s = 0; o;) {
            t = o.data, r = i, n = s, a.prototype.copy.call(t, r, n), s += o.data.length, o = o.next;
          }

          return i;
        }
      }, {
        key: "consume",
        value: function value(e, t) {
          var r;
          return e < this.head.data.length ? (r = this.head.data.slice(0, e), this.head.data = this.head.data.slice(e)) : r = e === this.head.data.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e), r;
        }
      }, {
        key: "first",
        value: function value() {
          return this.head.data;
        }
      }, {
        key: "_getString",
        value: function value(e) {
          var t = this.head,
              r = 1,
              n = t.data;

          for (e -= n.length; t = t.next;) {
            var i = t.data,
                o = e > i.length ? i.length : e;

            if (o === i.length ? n += i : n += i.slice(0, e), 0 == (e -= o)) {
              o === i.length ? (++r, t.next ? this.head = t.next : this.head = this.tail = null) : (this.head = t, t.data = i.slice(o));
              break;
            }

            ++r;
          }

          return this.length -= r, n;
        }
      }, {
        key: "_getBuffer",
        value: function value(e) {
          var t = a.allocUnsafe(e),
              r = this.head,
              n = 1;

          for (r.data.copy(t), e -= r.data.length; r = r.next;) {
            var i = r.data,
                o = e > i.length ? i.length : e;

            if (i.copy(t, t.length - e, 0, o), 0 == (e -= o)) {
              o === i.length ? (++n, r.next ? this.head = r.next : this.head = this.tail = null) : (this.head = r, r.data = i.slice(o));
              break;
            }

            ++n;
          }

          return this.length -= n, t;
        }
      }, {
        key: f,
        value: function value(e, t) {
          return s(this, function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2 ? n(Object(r), !0).forEach(function (t) {
                i(e, t, r[t]);
              }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
            }

            return e;
          }({}, t, {
            depth: 0,
            customInspect: !1
          }));
        }
      }]) && o(t.prototype, r), u && o(t, u), e;
    }();
  }, {
    buffer: 65,
    util: 19
  }],
  56: [function (e, t, r) {
    (function (e) {
      "use strict";

      function r(e, t) {
        i(e, t), n(e);
      }

      function n(e) {
        e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close");
      }

      function i(e, t) {
        e.emit("error", t);
      }

      t.exports = {
        destroy: function destroy(t, o) {
          var a = this,
              s = this._readableState && this._readableState.destroyed,
              f = this._writableState && this._writableState.destroyed;
          return s || f ? (o ? o(t) : t && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, e.nextTick(i, this, t)) : e.nextTick(i, this, t)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(t || null, function (t) {
            !o && t ? a._writableState ? a._writableState.errorEmitted ? e.nextTick(n, a) : (a._writableState.errorEmitted = !0, e.nextTick(r, a, t)) : e.nextTick(r, a, t) : o ? (e.nextTick(n, a), o(t)) : e.nextTick(n, a);
          }), this);
        },
        undestroy: function undestroy() {
          this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
        },
        errorOrDestroy: function errorOrDestroy(e, t) {
          var r = e._readableState,
              n = e._writableState;
          r && r.autoDestroy || n && n.autoDestroy ? e.destroy(t) : e.emit("error", t);
        }
      };
    }).call(this, e("_process"));
  }, {
    _process: 156
  }],
  57: [function (e, t, r) {
    "use strict";

    var n = e("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;

    function i() {}

    t.exports = function e(t, r, o) {
      if ("function" == typeof r) return e(t, null, r);
      r || (r = {}), o = function (e) {
        var t = !1;
        return function () {
          if (!t) {
            t = !0;

            for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++) {
              n[i] = arguments[i];
            }

            e.apply(this, n);
          }
        };
      }(o || i);

      var a = r.readable || !1 !== r.readable && t.readable,
          s = r.writable || !1 !== r.writable && t.writable,
          f = function f() {
        t.writable || c();
      },
          u = t._writableState && t._writableState.finished,
          c = function c() {
        s = !1, u = !0, a || o.call(t);
      },
          h = t._readableState && t._readableState.endEmitted,
          d = function d() {
        a = !1, h = !0, s || o.call(t);
      },
          l = function l(e) {
        o.call(t, e);
      },
          p = function p() {
        var e;
        return a && !h ? (t._readableState && t._readableState.ended || (e = new n()), o.call(t, e)) : s && !u ? (t._writableState && t._writableState.ended || (e = new n()), o.call(t, e)) : void 0;
      },
          b = function b() {
        t.req.on("finish", c);
      };

      return !function (e) {
        return e.setHeader && "function" == typeof e.abort;
      }(t) ? s && !t._writableState && (t.on("end", f), t.on("close", f)) : (t.on("complete", c), t.on("abort", p), t.req ? b() : t.on("request", b)), t.on("end", d), t.on("finish", c), !1 !== r.error && t.on("error", l), t.on("close", p), function () {
        t.removeListener("complete", c), t.removeListener("abort", p), t.removeListener("request", b), t.req && t.req.removeListener("finish", c), t.removeListener("end", f), t.removeListener("close", f), t.removeListener("finish", c), t.removeListener("end", d), t.removeListener("error", l), t.removeListener("close", p);
      };
    };
  }, {
    "../../../errors": 48
  }],
  58: [function (e, t, r) {
    t.exports = function () {
      throw new Error("Readable.from is not available in the browser");
    };
  }, {}],
  59: [function (e, t, r) {
    "use strict";

    var n;
    var i = e("../../../errors").codes,
        o = i.ERR_MISSING_ARGS,
        a = i.ERR_STREAM_DESTROYED;

    function s(e) {
      if (e) throw e;
    }

    function f(t, r, i, o) {
      o = function (e) {
        var t = !1;
        return function () {
          t || (t = !0, e.apply(void 0, arguments));
        };
      }(o);

      var s = !1;
      t.on("close", function () {
        s = !0;
      }), void 0 === n && (n = e("./end-of-stream")), n(t, {
        readable: r,
        writable: i
      }, function (e) {
        if (e) return o(e);
        s = !0, o();
      });
      var f = !1;
      return function (e) {
        if (!s && !f) return f = !0, function (e) {
          return e.setHeader && "function" == typeof e.abort;
        }(t) ? t.abort() : "function" == typeof t.destroy ? t.destroy() : void o(e || new a("pipe"));
      };
    }

    function u(e) {
      e();
    }

    function c(e, t) {
      return e.pipe(t);
    }

    function h(e) {
      return e.length ? "function" != typeof e[e.length - 1] ? s : e.pop() : s;
    }

    t.exports = function () {
      for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) {
        t[r] = arguments[r];
      }

      var n,
          i = h(t);
      if (Array.isArray(t[0]) && (t = t[0]), t.length < 2) throw new o("streams");
      var a = t.map(function (e, r) {
        var o = r < t.length - 1;
        return f(e, o, r > 0, function (e) {
          n || (n = e), e && a.forEach(u), o || (a.forEach(u), i(n));
        });
      });
      return t.reduce(c);
    };
  }, {
    "../../../errors": 48,
    "./end-of-stream": 57
  }],
  60: [function (e, t, r) {
    "use strict";

    var n = e("../../../errors").codes.ERR_INVALID_OPT_VALUE;
    t.exports = {
      getHighWaterMark: function getHighWaterMark(e, t, r, i) {
        var o = function (e, t, r) {
          return null != e.highWaterMark ? e.highWaterMark : t ? e[r] : null;
        }(t, i, r);

        if (null != o) {
          if (!isFinite(o) || Math.floor(o) !== o || o < 0) throw new n(i ? r : "highWaterMark", o);
          return Math.floor(o);
        }

        return e.objectMode ? 16 : 16384;
      }
    };
  }, {
    "../../../errors": 48
  }],
  61: [function (e, t, r) {
    t.exports = e("events").EventEmitter;
  }, {
    events: 103
  }],
  62: [function (e, t, r) {
    (r = t.exports = e("./lib/_stream_readable.js")).Stream = r, r.Readable = r, r.Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js"), r.finished = e("./lib/internal/streams/end-of-stream.js"), r.pipeline = e("./lib/internal/streams/pipeline.js");
  }, {
    "./lib/_stream_duplex.js": 49,
    "./lib/_stream_passthrough.js": 50,
    "./lib/_stream_readable.js": 51,
    "./lib/_stream_transform.js": 52,
    "./lib/_stream_writable.js": 53,
    "./lib/internal/streams/end-of-stream.js": 57,
    "./lib/internal/streams/pipeline.js": 59
  }],
  63: [function (e, t, r) {
    arguments[4][19][0].apply(r, arguments);
  }, {
    dup: 19
  }],
  64: [function (e, t, r) {
    (function (e) {
      t.exports = function (t, r) {
        for (var n = Math.min(t.length, r.length), i = new e(n), o = 0; o < n; ++o) {
          i[o] = t[o] ^ r[o];
        }

        return i;
      };
    }).call(this, e("buffer").Buffer);
  }, {
    buffer: 65
  }],
  65: [function (e, t, r) {
    (function (t) {
      /*!
       * The buffer module from node.js, for the browser.
       *
       * @author   Feross Aboukhadijeh <https://feross.org>
       * @license  MIT
       */
      "use strict";

      var n = e("base64-js"),
          i = e("ieee754");
      r.Buffer = t, r.SlowBuffer = function (e) {
        +e != e && (e = 0);
        return t.alloc(+e);
      }, r.INSPECT_MAX_BYTES = 50;

      function o(e) {
        if (e > 2147483647) throw new RangeError('The value "' + e + '" is invalid for option "size"');
        var r = new Uint8Array(e);
        return r.__proto__ = t.prototype, r;
      }

      function t(e, t, r) {
        if ("number" == typeof e) {
          if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number');
          return f(e);
        }

        return a(e, t, r);
      }

      function a(e, r, n) {
        if ("string" == typeof e) return function (e, r) {
          "string" == typeof r && "" !== r || (r = "utf8");
          if (!t.isEncoding(r)) throw new TypeError("Unknown encoding: " + r);
          var n = 0 | h(e, r),
              i = o(n),
              a = i.write(e, r);
          a !== n && (i = i.slice(0, a));
          return i;
        }(e, r);
        if (ArrayBuffer.isView(e)) return u(e);
        if (null == e) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + _typeof(e));
        if (N(e, ArrayBuffer) || e && N(e.buffer, ArrayBuffer)) return function (e, r, n) {
          if (r < 0 || e.byteLength < r) throw new RangeError('"offset" is outside of buffer bounds');
          if (e.byteLength < r + (n || 0)) throw new RangeError('"length" is outside of buffer bounds');
          var i;
          i = void 0 === r && void 0 === n ? new Uint8Array(e) : void 0 === n ? new Uint8Array(e, r) : new Uint8Array(e, r, n);
          return i.__proto__ = t.prototype, i;
        }(e, r, n);
        if ("number" == typeof e) throw new TypeError('The "value" argument must not be of type number. Received type number');
        var i = e.valueOf && e.valueOf();
        if (null != i && i !== e) return t.from(i, r, n);

        var a = function (e) {
          if (t.isBuffer(e)) {
            var r = 0 | c(e.length),
                n = o(r);
            return 0 === n.length || e.copy(n, 0, 0, r), n;
          }

          if (void 0 !== e.length) return "number" != typeof e.length || U(e.length) ? o(0) : u(e);
          if ("Buffer" === e.type && Array.isArray(e.data)) return u(e.data);
        }(e);

        if (a) return a;
        if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return t.from(e[Symbol.toPrimitive]("string"), r, n);
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + _typeof(e));
      }

      function s(e) {
        if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');
        if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"');
      }

      function f(e) {
        return s(e), o(e < 0 ? 0 : 0 | c(e));
      }

      function u(e) {
        for (var t = e.length < 0 ? 0 : 0 | c(e.length), r = o(t), n = 0; n < t; n += 1) {
          r[n] = 255 & e[n];
        }

        return r;
      }

      function c(e) {
        if (e >= 2147483647) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + 2147483647..toString(16) + " bytes");
        return 0 | e;
      }

      function h(e, r) {
        if (t.isBuffer(e)) return e.length;
        if (ArrayBuffer.isView(e) || N(e, ArrayBuffer)) return e.byteLength;
        if ("string" != typeof e) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + _typeof(e));
        var n = e.length,
            i = arguments.length > 2 && !0 === arguments[2];
        if (!i && 0 === n) return 0;

        for (var o = !1;;) {
          switch (r) {
            case "ascii":
            case "latin1":
            case "binary":
              return n;

            case "utf8":
            case "utf-8":
              return O(e).length;

            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return 2 * n;

            case "hex":
              return n >>> 1;

            case "base64":
              return C(e).length;

            default:
              if (o) return i ? -1 : O(e).length;
              r = ("" + r).toLowerCase(), o = !0;
          }
        }
      }

      function d(e, t, r) {
        var n = !1;
        if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
        if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
        if ((r >>>= 0) <= (t >>>= 0)) return "";

        for (e || (e = "utf8");;) {
          switch (e) {
            case "hex":
              return A(this, t, r);

            case "utf8":
            case "utf-8":
              return M(this, t, r);

            case "ascii":
              return S(this, t, r);

            case "latin1":
            case "binary":
              return k(this, t, r);

            case "base64":
              return E(this, t, r);

            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return x(this, t, r);

            default:
              if (n) throw new TypeError("Unknown encoding: " + e);
              e = (e + "").toLowerCase(), n = !0;
          }
        }
      }

      function l(e, t, r) {
        var n = e[t];
        e[t] = e[r], e[r] = n;
      }

      function p(e, r, n, i, o) {
        if (0 === e.length) return -1;

        if ("string" == typeof n ? (i = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), U(n = +n) && (n = o ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
          if (o) return -1;
          n = e.length - 1;
        } else if (n < 0) {
          if (!o) return -1;
          n = 0;
        }

        if ("string" == typeof r && (r = t.from(r, i)), t.isBuffer(r)) return 0 === r.length ? -1 : b(e, r, n, i, o);
        if ("number" == typeof r) return r &= 255, "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, r, n) : Uint8Array.prototype.lastIndexOf.call(e, r, n) : b(e, [r], n, i, o);
        throw new TypeError("val must be string, number or Buffer");
      }

      function b(e, t, r, n, i) {
        var o,
            a = 1,
            s = e.length,
            f = t.length;

        if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
          if (e.length < 2 || t.length < 2) return -1;
          a = 2, s /= 2, f /= 2, r /= 2;
        }

        function u(e, t) {
          return 1 === a ? e[t] : e.readUInt16BE(t * a);
        }

        if (i) {
          var c = -1;

          for (o = r; o < s; o++) {
            if (u(e, o) === u(t, -1 === c ? 0 : o - c)) {
              if (-1 === c && (c = o), o - c + 1 === f) return c * a;
            } else -1 !== c && (o -= o - c), c = -1;
          }
        } else for (r + f > s && (r = s - f), o = r; o >= 0; o--) {
          for (var h = !0, d = 0; d < f; d++) {
            if (u(e, o + d) !== u(t, d)) {
              h = !1;
              break;
            }
          }

          if (h) return o;
        }

        return -1;
      }

      function m(e, t, r, n) {
        r = Number(r) || 0;
        var i = e.length - r;
        n ? (n = Number(n)) > i && (n = i) : n = i;
        var o = t.length;
        n > o / 2 && (n = o / 2);

        for (var a = 0; a < n; ++a) {
          var s = parseInt(t.substr(2 * a, 2), 16);
          if (U(s)) return a;
          e[r + a] = s;
        }

        return a;
      }

      function y(e, t, r, n) {
        return L(O(t, e.length - r), e, r, n);
      }

      function g(e, t, r, n) {
        return L(function (e) {
          for (var t = [], r = 0; r < e.length; ++r) {
            t.push(255 & e.charCodeAt(r));
          }

          return t;
        }(t), e, r, n);
      }

      function v(e, t, r, n) {
        return g(e, t, r, n);
      }

      function w(e, t, r, n) {
        return L(C(t), e, r, n);
      }

      function _(e, t, r, n) {
        return L(function (e, t) {
          for (var r, n, i, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) {
            r = e.charCodeAt(a), n = r >> 8, i = r % 256, o.push(i), o.push(n);
          }

          return o;
        }(t, e.length - r), e, r, n);
      }

      function E(e, t, r) {
        return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r));
      }

      function M(e, t, r) {
        r = Math.min(e.length, r);

        for (var n = [], i = t; i < r;) {
          var o,
              a,
              s,
              f,
              u = e[i],
              c = null,
              h = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
          if (i + h <= r) switch (h) {
            case 1:
              u < 128 && (c = u);
              break;

            case 2:
              128 == (192 & (o = e[i + 1])) && (f = (31 & u) << 6 | 63 & o) > 127 && (c = f);
              break;

            case 3:
              o = e[i + 1], a = e[i + 2], 128 == (192 & o) && 128 == (192 & a) && (f = (15 & u) << 12 | (63 & o) << 6 | 63 & a) > 2047 && (f < 55296 || f > 57343) && (c = f);
              break;

            case 4:
              o = e[i + 1], a = e[i + 2], s = e[i + 3], 128 == (192 & o) && 128 == (192 & a) && 128 == (192 & s) && (f = (15 & u) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s) > 65535 && f < 1114112 && (c = f);
          }
          null === c ? (c = 65533, h = 1) : c > 65535 && (c -= 65536, n.push(c >>> 10 & 1023 | 55296), c = 56320 | 1023 & c), n.push(c), i += h;
        }

        return function (e) {
          var t = e.length;
          if (t <= 4096) return String.fromCharCode.apply(String, e);
          var r = "",
              n = 0;

          for (; n < t;) {
            r += String.fromCharCode.apply(String, e.slice(n, n += 4096));
          }

          return r;
        }(n);
      }

      r.kMaxLength = 2147483647, t.TYPED_ARRAY_SUPPORT = function () {
        try {
          var e = new Uint8Array(1);
          return e.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function foo() {
              return 42;
            }
          }, 42 === e.foo();
        } catch (e) {
          return !1;
        }
      }(), t.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(t.prototype, "parent", {
        enumerable: !0,
        get: function get() {
          if (t.isBuffer(this)) return this.buffer;
        }
      }), Object.defineProperty(t.prototype, "offset", {
        enumerable: !0,
        get: function get() {
          if (t.isBuffer(this)) return this.byteOffset;
        }
      }), "undefined" != typeof Symbol && null != Symbol.species && t[Symbol.species] === t && Object.defineProperty(t, Symbol.species, {
        value: null,
        configurable: !0,
        enumerable: !1,
        writable: !1
      }), t.poolSize = 8192, t.from = function (e, t, r) {
        return a(e, t, r);
      }, t.prototype.__proto__ = Uint8Array.prototype, t.__proto__ = Uint8Array, t.alloc = function (e, t, r) {
        return function (e, t, r) {
          return s(e), e <= 0 ? o(e) : void 0 !== t ? "string" == typeof r ? o(e).fill(t, r) : o(e).fill(t) : o(e);
        }(e, t, r);
      }, t.allocUnsafe = function (e) {
        return f(e);
      }, t.allocUnsafeSlow = function (e) {
        return f(e);
      }, t.isBuffer = function (e) {
        return null != e && !0 === e._isBuffer && e !== t.prototype;
      }, t.compare = function (e, r) {
        if (N(e, Uint8Array) && (e = t.from(e, e.offset, e.byteLength)), N(r, Uint8Array) && (r = t.from(r, r.offset, r.byteLength)), !t.isBuffer(e) || !t.isBuffer(r)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        if (e === r) return 0;

        for (var n = e.length, i = r.length, o = 0, a = Math.min(n, i); o < a; ++o) {
          if (e[o] !== r[o]) {
            n = e[o], i = r[o];
            break;
          }
        }

        return n < i ? -1 : i < n ? 1 : 0;
      }, t.isEncoding = function (e) {
        switch (String(e).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return !0;

          default:
            return !1;
        }
      }, t.concat = function (e, r) {
        if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (0 === e.length) return t.alloc(0);
        var n;
        if (void 0 === r) for (r = 0, n = 0; n < e.length; ++n) {
          r += e[n].length;
        }
        var i = t.allocUnsafe(r),
            o = 0;

        for (n = 0; n < e.length; ++n) {
          var a = e[n];
          if (N(a, Uint8Array) && (a = t.from(a)), !t.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');
          a.copy(i, o), o += a.length;
        }

        return i;
      }, t.byteLength = h, t.prototype._isBuffer = !0, t.prototype.swap16 = function () {
        var e = this.length;
        if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");

        for (var t = 0; t < e; t += 2) {
          l(this, t, t + 1);
        }

        return this;
      }, t.prototype.swap32 = function () {
        var e = this.length;
        if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");

        for (var t = 0; t < e; t += 4) {
          l(this, t, t + 3), l(this, t + 1, t + 2);
        }

        return this;
      }, t.prototype.swap64 = function () {
        var e = this.length;
        if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");

        for (var t = 0; t < e; t += 8) {
          l(this, t, t + 7), l(this, t + 1, t + 6), l(this, t + 2, t + 5), l(this, t + 3, t + 4);
        }

        return this;
      }, t.prototype.toString = function () {
        var e = this.length;
        return 0 === e ? "" : 0 === arguments.length ? M(this, 0, e) : d.apply(this, arguments);
      }, t.prototype.toLocaleString = t.prototype.toString, t.prototype.equals = function (e) {
        if (!t.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
        return this === e || 0 === t.compare(this, e);
      }, t.prototype.inspect = function () {
        var e = "",
            t = r.INSPECT_MAX_BYTES;
        return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
      }, t.prototype.compare = function (e, r, n, i, o) {
        if (N(e, Uint8Array) && (e = t.from(e, e.offset, e.byteLength)), !t.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + _typeof(e));
        if (void 0 === r && (r = 0), void 0 === n && (n = e ? e.length : 0), void 0 === i && (i = 0), void 0 === o && (o = this.length), r < 0 || n > e.length || i < 0 || o > this.length) throw new RangeError("out of range index");
        if (i >= o && r >= n) return 0;
        if (i >= o) return -1;
        if (r >= n) return 1;
        if (this === e) return 0;

        for (var a = (o >>>= 0) - (i >>>= 0), s = (n >>>= 0) - (r >>>= 0), f = Math.min(a, s), u = this.slice(i, o), c = e.slice(r, n), h = 0; h < f; ++h) {
          if (u[h] !== c[h]) {
            a = u[h], s = c[h];
            break;
          }
        }

        return a < s ? -1 : s < a ? 1 : 0;
      }, t.prototype.includes = function (e, t, r) {
        return -1 !== this.indexOf(e, t, r);
      }, t.prototype.indexOf = function (e, t, r) {
        return p(this, e, t, r, !0);
      }, t.prototype.lastIndexOf = function (e, t, r) {
        return p(this, e, t, r, !1);
      }, t.prototype.write = function (e, t, r, n) {
        if (void 0 === t) n = "utf8", r = this.length, t = 0;else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;else {
          if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
          t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
        }
        var i = this.length - t;
        if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        n || (n = "utf8");

        for (var o = !1;;) {
          switch (n) {
            case "hex":
              return m(this, e, t, r);

            case "utf8":
            case "utf-8":
              return y(this, e, t, r);

            case "ascii":
              return g(this, e, t, r);

            case "latin1":
            case "binary":
              return v(this, e, t, r);

            case "base64":
              return w(this, e, t, r);

            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return _(this, e, t, r);

            default:
              if (o) throw new TypeError("Unknown encoding: " + n);
              n = ("" + n).toLowerCase(), o = !0;
          }
        }
      }, t.prototype.toJSON = function () {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };

      function S(e, t, r) {
        var n = "";
        r = Math.min(e.length, r);

        for (var i = t; i < r; ++i) {
          n += String.fromCharCode(127 & e[i]);
        }

        return n;
      }

      function k(e, t, r) {
        var n = "";
        r = Math.min(e.length, r);

        for (var i = t; i < r; ++i) {
          n += String.fromCharCode(e[i]);
        }

        return n;
      }

      function A(e, t, r) {
        var n = e.length;
        (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);

        for (var i = "", o = t; o < r; ++o) {
          i += P(e[o]);
        }

        return i;
      }

      function x(e, t, r) {
        for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) {
          i += String.fromCharCode(n[o] + 256 * n[o + 1]);
        }

        return i;
      }

      function R(e, t, r) {
        if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
        if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
      }

      function I(e, r, n, i, o, a) {
        if (!t.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (r > o || r < a) throw new RangeError('"value" argument is out of bounds');
        if (n + i > e.length) throw new RangeError("Index out of range");
      }

      function B(e, t, r, n, i, o) {
        if (r + n > e.length) throw new RangeError("Index out of range");
        if (r < 0) throw new RangeError("Index out of range");
      }

      function T(e, t, r, n, o) {
        return t = +t, r >>>= 0, o || B(e, 0, r, 4), i.write(e, t, r, n, 23, 4), r + 4;
      }

      function j(e, t, r, n, o) {
        return t = +t, r >>>= 0, o || B(e, 0, r, 8), i.write(e, t, r, n, 52, 8), r + 8;
      }

      t.prototype.slice = function (e, r) {
        var n = this.length;
        (e = ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), (r = void 0 === r ? n : ~~r) < 0 ? (r += n) < 0 && (r = 0) : r > n && (r = n), r < e && (r = e);
        var i = this.subarray(e, r);
        return i.__proto__ = t.prototype, i;
      }, t.prototype.readUIntLE = function (e, t, r) {
        e >>>= 0, t >>>= 0, r || R(e, t, this.length);

        for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) {
          n += this[e + o] * i;
        }

        return n;
      }, t.prototype.readUIntBE = function (e, t, r) {
        e >>>= 0, t >>>= 0, r || R(e, t, this.length);

        for (var n = this[e + --t], i = 1; t > 0 && (i *= 256);) {
          n += this[e + --t] * i;
        }

        return n;
      }, t.prototype.readUInt8 = function (e, t) {
        return e >>>= 0, t || R(e, 1, this.length), this[e];
      }, t.prototype.readUInt16LE = function (e, t) {
        return e >>>= 0, t || R(e, 2, this.length), this[e] | this[e + 1] << 8;
      }, t.prototype.readUInt16BE = function (e, t) {
        return e >>>= 0, t || R(e, 2, this.length), this[e] << 8 | this[e + 1];
      }, t.prototype.readUInt32LE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
      }, t.prototype.readUInt32BE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
      }, t.prototype.readIntLE = function (e, t, r) {
        e >>>= 0, t >>>= 0, r || R(e, t, this.length);

        for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) {
          n += this[e + o] * i;
        }

        return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)), n;
      }, t.prototype.readIntBE = function (e, t, r) {
        e >>>= 0, t >>>= 0, r || R(e, t, this.length);

        for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256);) {
          o += this[e + --n] * i;
        }

        return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o;
      }, t.prototype.readInt8 = function (e, t) {
        return e >>>= 0, t || R(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
      }, t.prototype.readInt16LE = function (e, t) {
        e >>>= 0, t || R(e, 2, this.length);
        var r = this[e] | this[e + 1] << 8;
        return 32768 & r ? 4294901760 | r : r;
      }, t.prototype.readInt16BE = function (e, t) {
        e >>>= 0, t || R(e, 2, this.length);
        var r = this[e + 1] | this[e] << 8;
        return 32768 & r ? 4294901760 | r : r;
      }, t.prototype.readInt32LE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
      }, t.prototype.readInt32BE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
      }, t.prototype.readFloatLE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), i.read(this, e, !0, 23, 4);
      }, t.prototype.readFloatBE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), i.read(this, e, !1, 23, 4);
      }, t.prototype.readDoubleLE = function (e, t) {
        return e >>>= 0, t || R(e, 8, this.length), i.read(this, e, !0, 52, 8);
      }, t.prototype.readDoubleBE = function (e, t) {
        return e >>>= 0, t || R(e, 8, this.length), i.read(this, e, !1, 52, 8);
      }, t.prototype.writeUIntLE = function (e, t, r, n) {
        (e = +e, t >>>= 0, r >>>= 0, n) || I(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
        var i = 1,
            o = 0;

        for (this[t] = 255 & e; ++o < r && (i *= 256);) {
          this[t + o] = e / i & 255;
        }

        return t + r;
      }, t.prototype.writeUIntBE = function (e, t, r, n) {
        (e = +e, t >>>= 0, r >>>= 0, n) || I(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
        var i = r - 1,
            o = 1;

        for (this[t + i] = 255 & e; --i >= 0 && (o *= 256);) {
          this[t + i] = e / o & 255;
        }

        return t + r;
      }, t.prototype.writeUInt8 = function (e, t, r) {
        return e = +e, t >>>= 0, r || I(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1;
      }, t.prototype.writeUInt16LE = function (e, t, r) {
        return e = +e, t >>>= 0, r || I(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2;
      }, t.prototype.writeUInt16BE = function (e, t, r) {
        return e = +e, t >>>= 0, r || I(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2;
      }, t.prototype.writeUInt32LE = function (e, t, r) {
        return e = +e, t >>>= 0, r || I(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4;
      }, t.prototype.writeUInt32BE = function (e, t, r) {
        return e = +e, t >>>= 0, r || I(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
      }, t.prototype.writeIntLE = function (e, t, r, n) {
        if (e = +e, t >>>= 0, !n) {
          var i = Math.pow(2, 8 * r - 1);
          I(this, e, t, r, i - 1, -i);
        }

        var o = 0,
            a = 1,
            s = 0;

        for (this[t] = 255 & e; ++o < r && (a *= 256);) {
          e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;
        }

        return t + r;
      }, t.prototype.writeIntBE = function (e, t, r, n) {
        if (e = +e, t >>>= 0, !n) {
          var i = Math.pow(2, 8 * r - 1);
          I(this, e, t, r, i - 1, -i);
        }

        var o = r - 1,
            a = 1,
            s = 0;

        for (this[t + o] = 255 & e; --o >= 0 && (a *= 256);) {
          e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;
        }

        return t + r;
      }, t.prototype.writeInt8 = function (e, t, r) {
        return e = +e, t >>>= 0, r || I(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;
      }, t.prototype.writeInt16LE = function (e, t, r) {
        return e = +e, t >>>= 0, r || I(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2;
      }, t.prototype.writeInt16BE = function (e, t, r) {
        return e = +e, t >>>= 0, r || I(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2;
      }, t.prototype.writeInt32LE = function (e, t, r) {
        return e = +e, t >>>= 0, r || I(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
      }, t.prototype.writeInt32BE = function (e, t, r) {
        return e = +e, t >>>= 0, r || I(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
      }, t.prototype.writeFloatLE = function (e, t, r) {
        return T(this, e, t, !0, r);
      }, t.prototype.writeFloatBE = function (e, t, r) {
        return T(this, e, t, !1, r);
      }, t.prototype.writeDoubleLE = function (e, t, r) {
        return j(this, e, t, !0, r);
      }, t.prototype.writeDoubleBE = function (e, t, r) {
        return j(this, e, t, !1, r);
      }, t.prototype.copy = function (e, r, n, i) {
        if (!t.isBuffer(e)) throw new TypeError("argument should be a Buffer");
        if (n || (n = 0), i || 0 === i || (i = this.length), r >= e.length && (r = e.length), r || (r = 0), i > 0 && i < n && (i = n), i === n) return 0;
        if (0 === e.length || 0 === this.length) return 0;
        if (r < 0) throw new RangeError("targetStart out of bounds");
        if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
        if (i < 0) throw new RangeError("sourceEnd out of bounds");
        i > this.length && (i = this.length), e.length - r < i - n && (i = e.length - r + n);
        var o = i - n;
        if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(r, n, i);else if (this === e && n < r && r < i) for (var a = o - 1; a >= 0; --a) {
          e[a + r] = this[a + n];
        } else Uint8Array.prototype.set.call(e, this.subarray(n, i), r);
        return o;
      }, t.prototype.fill = function (e, r, n, i) {
        if ("string" == typeof e) {
          if ("string" == typeof r ? (i = r, r = 0, n = this.length) : "string" == typeof n && (i = n, n = this.length), void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
          if ("string" == typeof i && !t.isEncoding(i)) throw new TypeError("Unknown encoding: " + i);

          if (1 === e.length) {
            var o = e.charCodeAt(0);
            ("utf8" === i && o < 128 || "latin1" === i) && (e = o);
          }
        } else "number" == typeof e && (e &= 255);

        if (r < 0 || this.length < r || this.length < n) throw new RangeError("Out of range index");
        if (n <= r) return this;
        var a;
        if (r >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0), "number" == typeof e) for (a = r; a < n; ++a) {
          this[a] = e;
        } else {
          var s = t.isBuffer(e) ? e : t.from(e, i),
              f = s.length;
          if (0 === f) throw new TypeError('The value "' + e + '" is invalid for argument "value"');

          for (a = 0; a < n - r; ++a) {
            this[a + r] = s[a % f];
          }
        }
        return this;
      };
      var D = /[^+/0-9A-Za-z-_]/g;

      function P(e) {
        return e < 16 ? "0" + e.toString(16) : e.toString(16);
      }

      function O(e, t) {
        var r;
        t = t || 1 / 0;

        for (var n = e.length, i = null, o = [], a = 0; a < n; ++a) {
          if ((r = e.charCodeAt(a)) > 55295 && r < 57344) {
            if (!i) {
              if (r > 56319) {
                (t -= 3) > -1 && o.push(239, 191, 189);
                continue;
              }

              if (a + 1 === n) {
                (t -= 3) > -1 && o.push(239, 191, 189);
                continue;
              }

              i = r;
              continue;
            }

            if (r < 56320) {
              (t -= 3) > -1 && o.push(239, 191, 189), i = r;
              continue;
            }

            r = 65536 + (i - 55296 << 10 | r - 56320);
          } else i && (t -= 3) > -1 && o.push(239, 191, 189);

          if (i = null, r < 128) {
            if ((t -= 1) < 0) break;
            o.push(r);
          } else if (r < 2048) {
            if ((t -= 2) < 0) break;
            o.push(r >> 6 | 192, 63 & r | 128);
          } else if (r < 65536) {
            if ((t -= 3) < 0) break;
            o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
          } else {
            if (!(r < 1114112)) throw new Error("Invalid code point");
            if ((t -= 4) < 0) break;
            o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
          }
        }

        return o;
      }

      function C(e) {
        return n.toByteArray(function (e) {
          if ((e = (e = e.split("=")[0]).trim().replace(D, "")).length < 2) return "";

          for (; e.length % 4 != 0;) {
            e += "=";
          }

          return e;
        }(e));
      }

      function L(e, t, r, n) {
        for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) {
          t[i + r] = e[i];
        }

        return i;
      }

      function N(e, t) {
        return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name;
      }

      function U(e) {
        return e != e;
      }
    }).call(this, e("buffer").Buffer);
  }, {
    "base64-js": 16,
    buffer: 65,
    ieee754: 134
  }],
  66: [function (e, t, r) {
    var n = e("safe-buffer").Buffer,
        i = e("stream").Transform,
        o = e("string_decoder").StringDecoder;

    function a(e) {
      i.call(this), this.hashMode = "string" == typeof e, this.hashMode ? this[e] = this._finalOrDigest : this["final"] = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
    }

    e("inherits")(a, i), a.prototype.update = function (e, t, r) {
      "string" == typeof e && (e = n.from(e, t));

      var i = this._update(e);

      return this.hashMode ? this : (r && (i = this._toString(i, r)), i);
    }, a.prototype.setAutoPadding = function () {}, a.prototype.getAuthTag = function () {
      throw new Error("trying to get auth tag in unsupported state");
    }, a.prototype.setAuthTag = function () {
      throw new Error("trying to set auth tag in unsupported state");
    }, a.prototype.setAAD = function () {
      throw new Error("trying to set aad in unsupported state");
    }, a.prototype._transform = function (e, t, r) {
      var n;

      try {
        this.hashMode ? this._update(e) : this.push(this._update(e));
      } catch (e) {
        n = e;
      } finally {
        r(n);
      }
    }, a.prototype._flush = function (e) {
      var t;

      try {
        this.push(this.__final());
      } catch (e) {
        t = e;
      }

      e(t);
    }, a.prototype._finalOrDigest = function (e) {
      var t = this.__final() || n.alloc(0);
      return e && (t = this._toString(t, e, !0)), t;
    }, a.prototype._toString = function (e, t, r) {
      if (this._decoder || (this._decoder = new o(t), this._encoding = t), this._encoding !== t) throw new Error("can't switch encodings");

      var n = this._decoder.write(e);

      return r && (n += this._decoder.end()), n;
    }, t.exports = a;
  }, {
    inherits: 135,
    "safe-buffer": 182,
    stream: 192,
    string_decoder: 193
  }],
  67: [function (e, t, r) {
    (function (e) {
      function t(e) {
        return Object.prototype.toString.call(e);
      }

      r.isArray = function (e) {
        return Array.isArray ? Array.isArray(e) : "[object Array]" === t(e);
      }, r.isBoolean = function (e) {
        return "boolean" == typeof e;
      }, r.isNull = function (e) {
        return null === e;
      }, r.isNullOrUndefined = function (e) {
        return null == e;
      }, r.isNumber = function (e) {
        return "number" == typeof e;
      }, r.isString = function (e) {
        return "string" == typeof e;
      }, r.isSymbol = function (e) {
        return "symbol" == _typeof(e);
      }, r.isUndefined = function (e) {
        return void 0 === e;
      }, r.isRegExp = function (e) {
        return "[object RegExp]" === t(e);
      }, r.isObject = function (e) {
        return "object" == _typeof(e) && null !== e;
      }, r.isDate = function (e) {
        return "[object Date]" === t(e);
      }, r.isError = function (e) {
        return "[object Error]" === t(e) || e instanceof Error;
      }, r.isFunction = function (e) {
        return "function" == typeof e;
      }, r.isPrimitive = function (e) {
        return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == _typeof(e) || void 0 === e;
      }, r.isBuffer = e.isBuffer;
    }).call(this, {
      isBuffer: e("../../is-buffer/index.js")
    });
  }, {
    "../../is-buffer/index.js": 136
  }],
  68: [function (e, t, r) {
    (function (r) {
      var n = e("elliptic"),
          i = e("bn.js");

      t.exports = function (e) {
        return new a(e);
      };

      var o = {
        secp256k1: {
          name: "secp256k1",
          byteLength: 32
        },
        secp224r1: {
          name: "p224",
          byteLength: 28
        },
        prime256v1: {
          name: "p256",
          byteLength: 32
        },
        prime192v1: {
          name: "p192",
          byteLength: 24
        },
        ed25519: {
          name: "ed25519",
          byteLength: 32
        },
        secp384r1: {
          name: "p384",
          byteLength: 48
        },
        secp521r1: {
          name: "p521",
          byteLength: 66
        }
      };

      function a(e) {
        this.curveType = o[e], this.curveType || (this.curveType = {
          name: e
        }), this.curve = new n.ec(this.curveType.name), this.keys = void 0;
      }

      function s(e, t, n) {
        Array.isArray(e) || (e = e.toArray());
        var i = new r(e);

        if (n && i.length < n) {
          var o = new r(n - i.length);
          o.fill(0), i = r.concat([o, i]);
        }

        return t ? i.toString(t) : i;
      }

      o.p224 = o.secp224r1, o.p256 = o.secp256r1 = o.prime256v1, o.p192 = o.secp192r1 = o.prime192v1, o.p384 = o.secp384r1, o.p521 = o.secp521r1, a.prototype.generateKeys = function (e, t) {
        return this.keys = this.curve.genKeyPair(), this.getPublicKey(e, t);
      }, a.prototype.computeSecret = function (e, t, n) {
        return t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), s(this.curve.keyFromPublic(e).getPublic().mul(this.keys.getPrivate()).getX(), n, this.curveType.byteLength);
      }, a.prototype.getPublicKey = function (e, t) {
        var r = this.keys.getPublic("compressed" === t, !0);
        return "hybrid" === t && (r[r.length - 1] % 2 ? r[0] = 7 : r[0] = 6), s(r, e);
      }, a.prototype.getPrivateKey = function (e) {
        return s(this.keys.getPrivate(), e);
      }, a.prototype.setPublicKey = function (e, t) {
        return t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this.keys._importPublic(e), this;
      }, a.prototype.setPrivateKey = function (e, t) {
        t = t || "utf8", r.isBuffer(e) || (e = new r(e, t));
        var n = new i(e);
        return n = n.toString(16), this.keys = this.curve.genKeyPair(), this.keys._importPrivate(n), this;
      };
    }).call(this, e("buffer").Buffer);
  }, {
    "bn.js": 69,
    buffer: 65,
    elliptic: 86
  }],
  69: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, {
    buffer: 19,
    dup: 15
  }],
  70: [function (e, t, r) {
    "use strict";

    var n = e("inherits"),
        i = e("md5.js"),
        o = e("ripemd160"),
        a = e("sha.js"),
        s = e("cipher-base");

    function f(e) {
      s.call(this, "digest"), this._hash = e;
    }

    n(f, s), f.prototype._update = function (e) {
      this._hash.update(e);
    }, f.prototype._final = function () {
      return this._hash.digest();
    }, t.exports = function (e) {
      return "md5" === (e = e.toLowerCase()) ? new i() : "rmd160" === e || "ripemd160" === e ? new o() : new f(a(e));
    };
  }, {
    "cipher-base": 66,
    inherits: 135,
    "md5.js": 138,
    ripemd160: 181,
    "sha.js": 185
  }],
  71: [function (e, t, r) {
    var n = e("md5.js");

    t.exports = function (e) {
      return new n().update(e).digest();
    };
  }, {
    "md5.js": 138
  }],
  72: [function (e, t, r) {
    "use strict";

    var n = e("inherits"),
        i = e("./legacy"),
        o = e("cipher-base"),
        a = e("safe-buffer").Buffer,
        s = e("create-hash/md5"),
        f = e("ripemd160"),
        u = e("sha.js"),
        c = a.alloc(128);

    function h(e, t) {
      o.call(this, "digest"), "string" == typeof t && (t = a.from(t));
      var r = "sha512" === e || "sha384" === e ? 128 : 64;
      (this._alg = e, this._key = t, t.length > r) ? t = ("rmd160" === e ? new f() : u(e)).update(t).digest() : t.length < r && (t = a.concat([t, c], r));

      for (var n = this._ipad = a.allocUnsafe(r), i = this._opad = a.allocUnsafe(r), s = 0; s < r; s++) {
        n[s] = 54 ^ t[s], i[s] = 92 ^ t[s];
      }

      this._hash = "rmd160" === e ? new f() : u(e), this._hash.update(n);
    }

    n(h, o), h.prototype._update = function (e) {
      this._hash.update(e);
    }, h.prototype._final = function () {
      var e = this._hash.digest();

      return ("rmd160" === this._alg ? new f() : u(this._alg)).update(this._opad).update(e).digest();
    }, t.exports = function (e, t) {
      return "rmd160" === (e = e.toLowerCase()) || "ripemd160" === e ? new h("rmd160", t) : "md5" === e ? new i(s, t) : new h(e, t);
    };
  }, {
    "./legacy": 73,
    "cipher-base": 66,
    "create-hash/md5": 71,
    inherits: 135,
    ripemd160: 181,
    "safe-buffer": 182,
    "sha.js": 185
  }],
  73: [function (e, t, r) {
    "use strict";

    var n = e("inherits"),
        i = e("safe-buffer").Buffer,
        o = e("cipher-base"),
        a = i.alloc(128);

    function s(e, t) {
      o.call(this, "digest"), "string" == typeof t && (t = i.from(t)), this._alg = e, this._key = t, t.length > 64 ? t = e(t) : t.length < 64 && (t = i.concat([t, a], 64));

      for (var r = this._ipad = i.allocUnsafe(64), n = this._opad = i.allocUnsafe(64), s = 0; s < 64; s++) {
        r[s] = 54 ^ t[s], n[s] = 92 ^ t[s];
      }

      this._hash = [r];
    }

    n(s, o), s.prototype._update = function (e) {
      this._hash.push(e);
    }, s.prototype._final = function () {
      var e = this._alg(i.concat(this._hash));

      return this._alg(i.concat([this._opad, e]));
    }, t.exports = s;
  }, {
    "cipher-base": 66,
    inherits: 135,
    "safe-buffer": 182
  }],
  74: [function (e, t, r) {
    "use strict";

    r.randomBytes = r.rng = r.pseudoRandomBytes = r.prng = e("randombytes"), r.createHash = r.Hash = e("create-hash"), r.createHmac = r.Hmac = e("create-hmac");
    var n = e("browserify-sign/algos"),
        i = Object.keys(n),
        o = ["sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160"].concat(i);

    r.getHashes = function () {
      return o;
    };

    var a = e("pbkdf2");
    r.pbkdf2 = a.pbkdf2, r.pbkdf2Sync = a.pbkdf2Sync;
    var s = e("browserify-cipher");
    r.Cipher = s.Cipher, r.createCipher = s.createCipher, r.Cipheriv = s.Cipheriv, r.createCipheriv = s.createCipheriv, r.Decipher = s.Decipher, r.createDecipher = s.createDecipher, r.Decipheriv = s.Decipheriv, r.createDecipheriv = s.createDecipheriv, r.getCiphers = s.getCiphers, r.listCiphers = s.listCiphers;
    var f = e("diffie-hellman");
    r.DiffieHellmanGroup = f.DiffieHellmanGroup, r.createDiffieHellmanGroup = f.createDiffieHellmanGroup, r.getDiffieHellman = f.getDiffieHellman, r.createDiffieHellman = f.createDiffieHellman, r.DiffieHellman = f.DiffieHellman;
    var u = e("browserify-sign");
    r.createSign = u.createSign, r.Sign = u.Sign, r.createVerify = u.createVerify, r.Verify = u.Verify, r.createECDH = e("create-ecdh");
    var c = e("public-encrypt");
    r.publicEncrypt = c.publicEncrypt, r.privateEncrypt = c.privateEncrypt, r.publicDecrypt = c.publicDecrypt, r.privateDecrypt = c.privateDecrypt;
    var h = e("randomfill");
    r.randomFill = h.randomFill, r.randomFillSync = h.randomFillSync, r.createCredentials = function () {
      throw new Error(["sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify"].join("\n"));
    }, r.constants = {
      DH_CHECK_P_NOT_SAFE_PRIME: 2,
      DH_CHECK_P_NOT_PRIME: 1,
      DH_UNABLE_TO_CHECK_GENERATOR: 4,
      DH_NOT_SUITABLE_GENERATOR: 8,
      NPN_ENABLED: 1,
      ALPN_ENABLED: 1,
      RSA_PKCS1_PADDING: 1,
      RSA_SSLV23_PADDING: 2,
      RSA_NO_PADDING: 3,
      RSA_PKCS1_OAEP_PADDING: 4,
      RSA_X931_PADDING: 5,
      RSA_PKCS1_PSS_PADDING: 6,
      POINT_CONVERSION_COMPRESSED: 2,
      POINT_CONVERSION_UNCOMPRESSED: 4,
      POINT_CONVERSION_HYBRID: 6
    };
  }, {
    "browserify-cipher": 37,
    "browserify-sign": 45,
    "browserify-sign/algos": 42,
    "create-ecdh": 68,
    "create-hash": 70,
    "create-hmac": 72,
    "diffie-hellman": 81,
    pbkdf2: 149,
    "public-encrypt": 157,
    randombytes: 164,
    randomfill: 165
  }],
  75: [function (e, t, r) {
    "use strict";

    r.utils = e("./des/utils"), r.Cipher = e("./des/cipher"), r.DES = e("./des/des"), r.CBC = e("./des/cbc"), r.EDE = e("./des/ede");
  }, {
    "./des/cbc": 76,
    "./des/cipher": 77,
    "./des/des": 78,
    "./des/ede": 79,
    "./des/utils": 80
  }],
  76: [function (e, t, r) {
    "use strict";

    var n = e("minimalistic-assert"),
        i = e("inherits"),
        o = {};

    function a(e) {
      n.equal(e.length, 8, "Invalid IV length"), this.iv = new Array(8);

      for (var t = 0; t < this.iv.length; t++) {
        this.iv[t] = e[t];
      }
    }

    r.instantiate = function (e) {
      function t(t) {
        e.call(this, t), this._cbcInit();
      }

      i(t, e);

      for (var r = Object.keys(o), n = 0; n < r.length; n++) {
        var a = r[n];
        t.prototype[a] = o[a];
      }

      return t.create = function (e) {
        return new t(e);
      }, t;
    }, o._cbcInit = function () {
      var e = new a(this.options.iv);
      this._cbcState = e;
    }, o._update = function (e, t, r, n) {
      var i = this._cbcState,
          o = this.constructor.super_.prototype,
          a = i.iv;

      if ("encrypt" === this.type) {
        for (var s = 0; s < this.blockSize; s++) {
          a[s] ^= e[t + s];
        }

        o._update.call(this, a, 0, r, n);

        for (s = 0; s < this.blockSize; s++) {
          a[s] = r[n + s];
        }
      } else {
        o._update.call(this, e, t, r, n);

        for (s = 0; s < this.blockSize; s++) {
          r[n + s] ^= a[s];
        }

        for (s = 0; s < this.blockSize; s++) {
          a[s] = e[t + s];
        }
      }
    };
  }, {
    inherits: 135,
    "minimalistic-assert": 141
  }],
  77: [function (e, t, r) {
    "use strict";

    var n = e("minimalistic-assert");

    function i(e) {
      this.options = e, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0;
    }

    t.exports = i, i.prototype._init = function () {}, i.prototype.update = function (e) {
      return 0 === e.length ? [] : "decrypt" === this.type ? this._updateDecrypt(e) : this._updateEncrypt(e);
    }, i.prototype._buffer = function (e, t) {
      for (var r = Math.min(this.buffer.length - this.bufferOff, e.length - t), n = 0; n < r; n++) {
        this.buffer[this.bufferOff + n] = e[t + n];
      }

      return this.bufferOff += r, r;
    }, i.prototype._flushBuffer = function (e, t) {
      return this._update(this.buffer, 0, e, t), this.bufferOff = 0, this.blockSize;
    }, i.prototype._updateEncrypt = function (e) {
      var t = 0,
          r = 0,
          n = (this.bufferOff + e.length) / this.blockSize | 0,
          i = new Array(n * this.blockSize);
      0 !== this.bufferOff && (t += this._buffer(e, t), this.bufferOff === this.buffer.length && (r += this._flushBuffer(i, r)));

      for (var o = e.length - (e.length - t) % this.blockSize; t < o; t += this.blockSize) {
        this._update(e, t, i, r), r += this.blockSize;
      }

      for (; t < e.length; t++, this.bufferOff++) {
        this.buffer[this.bufferOff] = e[t];
      }

      return i;
    }, i.prototype._updateDecrypt = function (e) {
      for (var t = 0, r = 0, n = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, i = new Array(n * this.blockSize); n > 0; n--) {
        t += this._buffer(e, t), r += this._flushBuffer(i, r);
      }

      return t += this._buffer(e, t), i;
    }, i.prototype["final"] = function (e) {
      var t, r;
      return e && (t = this.update(e)), r = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt(), t ? t.concat(r) : r;
    }, i.prototype._pad = function (e, t) {
      if (0 === t) return !1;

      for (; t < e.length;) {
        e[t++] = 0;
      }

      return !0;
    }, i.prototype._finalEncrypt = function () {
      if (!this._pad(this.buffer, this.bufferOff)) return [];
      var e = new Array(this.blockSize);
      return this._update(this.buffer, 0, e, 0), e;
    }, i.prototype._unpad = function (e) {
      return e;
    }, i.prototype._finalDecrypt = function () {
      n.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
      var e = new Array(this.blockSize);
      return this._flushBuffer(e, 0), this._unpad(e);
    };
  }, {
    "minimalistic-assert": 141
  }],
  78: [function (e, t, r) {
    "use strict";

    var n = e("minimalistic-assert"),
        i = e("inherits"),
        o = e("./utils"),
        a = e("./cipher");

    function s() {
      this.tmp = new Array(2), this.keys = null;
    }

    function f(e) {
      a.call(this, e);
      var t = new s();
      this._desState = t, this.deriveKeys(t, e.key);
    }

    i(f, a), t.exports = f, f.create = function (e) {
      return new f(e);
    };
    var u = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
    f.prototype.deriveKeys = function (e, t) {
      e.keys = new Array(32), n.equal(t.length, this.blockSize, "Invalid key length");
      var r = o.readUInt32BE(t, 0),
          i = o.readUInt32BE(t, 4);
      o.pc1(r, i, e.tmp, 0), r = e.tmp[0], i = e.tmp[1];

      for (var a = 0; a < e.keys.length; a += 2) {
        var s = u[a >>> 1];
        r = o.r28shl(r, s), i = o.r28shl(i, s), o.pc2(r, i, e.keys, a);
      }
    }, f.prototype._update = function (e, t, r, n) {
      var i = this._desState,
          a = o.readUInt32BE(e, t),
          s = o.readUInt32BE(e, t + 4);
      o.ip(a, s, i.tmp, 0), a = i.tmp[0], s = i.tmp[1], "encrypt" === this.type ? this._encrypt(i, a, s, i.tmp, 0) : this._decrypt(i, a, s, i.tmp, 0), a = i.tmp[0], s = i.tmp[1], o.writeUInt32BE(r, a, n), o.writeUInt32BE(r, s, n + 4);
    }, f.prototype._pad = function (e, t) {
      for (var r = e.length - t, n = t; n < e.length; n++) {
        e[n] = r;
      }

      return !0;
    }, f.prototype._unpad = function (e) {
      for (var t = e[e.length - 1], r = e.length - t; r < e.length; r++) {
        n.equal(e[r], t);
      }

      return e.slice(0, e.length - t);
    }, f.prototype._encrypt = function (e, t, r, n, i) {
      for (var a = t, s = r, f = 0; f < e.keys.length; f += 2) {
        var u = e.keys[f],
            c = e.keys[f + 1];
        o.expand(s, e.tmp, 0), u ^= e.tmp[0], c ^= e.tmp[1];
        var h = o.substitute(u, c),
            d = s;
        s = (a ^ o.permute(h)) >>> 0, a = d;
      }

      o.rip(s, a, n, i);
    }, f.prototype._decrypt = function (e, t, r, n, i) {
      for (var a = r, s = t, f = e.keys.length - 2; f >= 0; f -= 2) {
        var u = e.keys[f],
            c = e.keys[f + 1];
        o.expand(a, e.tmp, 0), u ^= e.tmp[0], c ^= e.tmp[1];
        var h = o.substitute(u, c),
            d = a;
        a = (s ^ o.permute(h)) >>> 0, s = d;
      }

      o.rip(a, s, n, i);
    };
  }, {
    "./cipher": 77,
    "./utils": 80,
    inherits: 135,
    "minimalistic-assert": 141
  }],
  79: [function (e, t, r) {
    "use strict";

    var n = e("minimalistic-assert"),
        i = e("inherits"),
        o = e("./cipher"),
        a = e("./des");

    function s(e, t) {
      n.equal(t.length, 24, "Invalid key length");
      var r = t.slice(0, 8),
          i = t.slice(8, 16),
          o = t.slice(16, 24);
      this.ciphers = "encrypt" === e ? [a.create({
        type: "encrypt",
        key: r
      }), a.create({
        type: "decrypt",
        key: i
      }), a.create({
        type: "encrypt",
        key: o
      })] : [a.create({
        type: "decrypt",
        key: o
      }), a.create({
        type: "encrypt",
        key: i
      }), a.create({
        type: "decrypt",
        key: r
      })];
    }

    function f(e) {
      o.call(this, e);
      var t = new s(this.type, this.options.key);
      this._edeState = t;
    }

    i(f, o), t.exports = f, f.create = function (e) {
      return new f(e);
    }, f.prototype._update = function (e, t, r, n) {
      var i = this._edeState;
      i.ciphers[0]._update(e, t, r, n), i.ciphers[1]._update(r, n, r, n), i.ciphers[2]._update(r, n, r, n);
    }, f.prototype._pad = a.prototype._pad, f.prototype._unpad = a.prototype._unpad;
  }, {
    "./cipher": 77,
    "./des": 78,
    inherits: 135,
    "minimalistic-assert": 141
  }],
  80: [function (e, t, r) {
    "use strict";

    r.readUInt32BE = function (e, t) {
      return (e[0 + t] << 24 | e[1 + t] << 16 | e[2 + t] << 8 | e[3 + t]) >>> 0;
    }, r.writeUInt32BE = function (e, t, r) {
      e[0 + r] = t >>> 24, e[1 + r] = t >>> 16 & 255, e[2 + r] = t >>> 8 & 255, e[3 + r] = 255 & t;
    }, r.ip = function (e, t, r, n) {
      for (var i = 0, o = 0, a = 6; a >= 0; a -= 2) {
        for (var s = 0; s <= 24; s += 8) {
          i <<= 1, i |= t >>> s + a & 1;
        }

        for (s = 0; s <= 24; s += 8) {
          i <<= 1, i |= e >>> s + a & 1;
        }
      }

      for (a = 6; a >= 0; a -= 2) {
        for (s = 1; s <= 25; s += 8) {
          o <<= 1, o |= t >>> s + a & 1;
        }

        for (s = 1; s <= 25; s += 8) {
          o <<= 1, o |= e >>> s + a & 1;
        }
      }

      r[n + 0] = i >>> 0, r[n + 1] = o >>> 0;
    }, r.rip = function (e, t, r, n) {
      for (var i = 0, o = 0, a = 0; a < 4; a++) {
        for (var s = 24; s >= 0; s -= 8) {
          i <<= 1, i |= t >>> s + a & 1, i <<= 1, i |= e >>> s + a & 1;
        }
      }

      for (a = 4; a < 8; a++) {
        for (s = 24; s >= 0; s -= 8) {
          o <<= 1, o |= t >>> s + a & 1, o <<= 1, o |= e >>> s + a & 1;
        }
      }

      r[n + 0] = i >>> 0, r[n + 1] = o >>> 0;
    }, r.pc1 = function (e, t, r, n) {
      for (var i = 0, o = 0, a = 7; a >= 5; a--) {
        for (var s = 0; s <= 24; s += 8) {
          i <<= 1, i |= t >> s + a & 1;
        }

        for (s = 0; s <= 24; s += 8) {
          i <<= 1, i |= e >> s + a & 1;
        }
      }

      for (s = 0; s <= 24; s += 8) {
        i <<= 1, i |= t >> s + a & 1;
      }

      for (a = 1; a <= 3; a++) {
        for (s = 0; s <= 24; s += 8) {
          o <<= 1, o |= t >> s + a & 1;
        }

        for (s = 0; s <= 24; s += 8) {
          o <<= 1, o |= e >> s + a & 1;
        }
      }

      for (s = 0; s <= 24; s += 8) {
        o <<= 1, o |= e >> s + a & 1;
      }

      r[n + 0] = i >>> 0, r[n + 1] = o >>> 0;
    }, r.r28shl = function (e, t) {
      return e << t & 268435455 | e >>> 28 - t;
    };
    var n = [14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24];
    r.pc2 = function (e, t, r, i) {
      for (var o = 0, a = 0, s = n.length >>> 1, f = 0; f < s; f++) {
        o <<= 1, o |= e >>> n[f] & 1;
      }

      for (f = s; f < n.length; f++) {
        a <<= 1, a |= t >>> n[f] & 1;
      }

      r[i + 0] = o >>> 0, r[i + 1] = a >>> 0;
    }, r.expand = function (e, t, r) {
      var n = 0,
          i = 0;
      n = (1 & e) << 5 | e >>> 27;

      for (var o = 23; o >= 15; o -= 4) {
        n <<= 6, n |= e >>> o & 63;
      }

      for (o = 11; o >= 3; o -= 4) {
        i |= e >>> o & 63, i <<= 6;
      }

      i |= (31 & e) << 1 | e >>> 31, t[r + 0] = n >>> 0, t[r + 1] = i >>> 0;
    };
    var i = [14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11];

    r.substitute = function (e, t) {
      for (var r = 0, n = 0; n < 4; n++) {
        r <<= 4, r |= i[64 * n + (e >>> 18 - 6 * n & 63)];
      }

      for (n = 0; n < 4; n++) {
        r <<= 4, r |= i[256 + 64 * n + (t >>> 18 - 6 * n & 63)];
      }

      return r >>> 0;
    };

    var o = [16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7];
    r.permute = function (e) {
      for (var t = 0, r = 0; r < o.length; r++) {
        t <<= 1, t |= e >>> o[r] & 1;
      }

      return t >>> 0;
    }, r.padSplit = function (e, t, r) {
      for (var n = e.toString(2); n.length < t;) {
        n = "0" + n;
      }

      for (var i = [], o = 0; o < t; o += r) {
        i.push(n.slice(o, o + r));
      }

      return i.join(" ");
    };
  }, {}],
  81: [function (e, t, r) {
    (function (t) {
      var n = e("./lib/generatePrime"),
          i = e("./lib/primes.json"),
          o = e("./lib/dh");
      var a = {
        binary: !0,
        hex: !0,
        base64: !0
      };
      r.DiffieHellmanGroup = r.createDiffieHellmanGroup = r.getDiffieHellman = function (e) {
        var r = new t(i[e].prime, "hex"),
            n = new t(i[e].gen, "hex");
        return new o(r, n);
      }, r.createDiffieHellman = r.DiffieHellman = function e(r, i, s, f) {
        return t.isBuffer(i) || void 0 === a[i] ? e(r, "binary", i, s) : (i = i || "binary", f = f || "binary", s = s || new t([2]), t.isBuffer(s) || (s = new t(s, f)), "number" == typeof r ? new o(n(r, s), s, !0) : (t.isBuffer(r) || (r = new t(r, i)), new o(r, s, !0)));
      };
    }).call(this, e("buffer").Buffer);
  }, {
    "./lib/dh": 82,
    "./lib/generatePrime": 83,
    "./lib/primes.json": 84,
    buffer: 65
  }],
  82: [function (e, t, r) {
    (function (r) {
      var n = e("bn.js"),
          i = new (e("miller-rabin"))(),
          o = new n(24),
          a = new n(11),
          s = new n(10),
          f = new n(3),
          u = new n(7),
          c = e("./generatePrime"),
          h = e("randombytes");

      function d(e, t) {
        return t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this._pub = new n(e), this;
      }

      function l(e, t) {
        return t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this._priv = new n(e), this;
      }

      t.exports = b;
      var p = {};

      function b(e, t, r) {
        this.setGenerator(t), this.__prime = new n(e), this._prime = n.mont(this.__prime), this._primeLen = e.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, r ? (this.setPublicKey = d, this.setPrivateKey = l) : this._primeCode = 8;
      }

      function m(e, t) {
        var n = new r(e.toArray());
        return t ? n.toString(t) : n;
      }

      Object.defineProperty(b.prototype, "verifyError", {
        enumerable: !0,
        get: function get() {
          return "number" != typeof this._primeCode && (this._primeCode = function (e, t) {
            var r = t.toString("hex"),
                n = [r, e.toString(16)].join("_");
            if (n in p) return p[n];
            var h,
                d = 0;
            if (e.isEven() || !c.simpleSieve || !c.fermatTest(e) || !i.test(e)) return d += 1, d += "02" === r || "05" === r ? 8 : 4, p[n] = d, d;

            switch (i.test(e.shrn(1)) || (d += 2), r) {
              case "02":
                e.mod(o).cmp(a) && (d += 8);
                break;

              case "05":
                (h = e.mod(s)).cmp(f) && h.cmp(u) && (d += 8);
                break;

              default:
                d += 4;
            }

            return p[n] = d, d;
          }(this.__prime, this.__gen)), this._primeCode;
        }
      }), b.prototype.generateKeys = function () {
        return this._priv || (this._priv = new n(h(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey();
      }, b.prototype.computeSecret = function (e) {
        var t = (e = (e = new n(e)).toRed(this._prime)).redPow(this._priv).fromRed(),
            i = new r(t.toArray()),
            o = this.getPrime();

        if (i.length < o.length) {
          var a = new r(o.length - i.length);
          a.fill(0), i = r.concat([a, i]);
        }

        return i;
      }, b.prototype.getPublicKey = function (e) {
        return m(this._pub, e);
      }, b.prototype.getPrivateKey = function (e) {
        return m(this._priv, e);
      }, b.prototype.getPrime = function (e) {
        return m(this.__prime, e);
      }, b.prototype.getGenerator = function (e) {
        return m(this._gen, e);
      }, b.prototype.setGenerator = function (e, t) {
        return t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this.__gen = e, this._gen = new n(e), this;
      };
    }).call(this, e("buffer").Buffer);
  }, {
    "./generatePrime": 83,
    "bn.js": 85,
    buffer: 65,
    "miller-rabin": 139,
    randombytes: 164
  }],
  83: [function (e, t, r) {
    var n = e("randombytes");
    t.exports = g, g.simpleSieve = m, g.fermatTest = y;
    var i = e("bn.js"),
        o = new i(24),
        a = new (e("miller-rabin"))(),
        s = new i(1),
        f = new i(2),
        u = new i(5),
        c = (new i(16), new i(8), new i(10)),
        h = new i(3),
        d = (new i(7), new i(11)),
        l = new i(4),
        p = (new i(12), null);

    function b() {
      if (null !== p) return p;
      var e = [];
      e[0] = 2;

      for (var t = 1, r = 3; r < 1048576; r += 2) {
        for (var n = Math.ceil(Math.sqrt(r)), i = 0; i < t && e[i] <= n && r % e[i] != 0; i++) {
          ;
        }

        t !== i && e[i] <= n || (e[t++] = r);
      }

      return p = e, e;
    }

    function m(e) {
      for (var t = b(), r = 0; r < t.length; r++) {
        if (0 === e.modn(t[r])) return 0 === e.cmpn(t[r]);
      }

      return !0;
    }

    function y(e) {
      var t = i.mont(e);
      return 0 === f.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1);
    }

    function g(e, t) {
      if (e < 16) return new i(2 === t || 5 === t ? [140, 123] : [140, 39]);
      var r, p;

      for (t = new i(t);;) {
        for (r = new i(n(Math.ceil(e / 8))); r.bitLength() > e;) {
          r.ishrn(1);
        }

        if (r.isEven() && r.iadd(s), r.testn(1) || r.iadd(f), t.cmp(f)) {
          if (!t.cmp(u)) for (; r.mod(c).cmp(h);) {
            r.iadd(l);
          }
        } else for (; r.mod(o).cmp(d);) {
          r.iadd(l);
        }

        if (m(p = r.shrn(1)) && m(r) && y(p) && y(r) && a.test(p) && a.test(r)) return r;
      }
    }
  }, {
    "bn.js": 85,
    "miller-rabin": 139,
    randombytes: 164
  }],
  84: [function (e, t, r) {
    t.exports = {
      modp1: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
      },
      modp2: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
      },
      modp5: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
      },
      modp14: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
      },
      modp15: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
      },
      modp16: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
      },
      modp17: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
      },
      modp18: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
      }
    };
  }, {}],
  85: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, {
    buffer: 19,
    dup: 15
  }],
  86: [function (e, t, r) {
    "use strict";

    var n = r;
    n.version = e("../package.json").version, n.utils = e("./elliptic/utils"), n.rand = e("brorand"), n.curve = e("./elliptic/curve"), n.curves = e("./elliptic/curves"), n.ec = e("./elliptic/ec"), n.eddsa = e("./elliptic/eddsa");
  }, {
    "../package.json": 102,
    "./elliptic/curve": 89,
    "./elliptic/curves": 92,
    "./elliptic/ec": 93,
    "./elliptic/eddsa": 96,
    "./elliptic/utils": 100,
    brorand: 18
  }],
  87: [function (e, t, r) {
    "use strict";

    var n = e("bn.js"),
        i = e("../utils"),
        o = i.getNAF,
        a = i.getJSF,
        s = i.assert;

    function f(e, t) {
      this.type = e, this.p = new n(t.p, 16), this.red = t.prime ? n.red(t.prime) : n.mont(this.p), this.zero = new n(0).toRed(this.red), this.one = new n(1).toRed(this.red), this.two = new n(2).toRed(this.red), this.n = t.n && new n(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
      var r = this.n && this.p.div(this.n);
      !r || r.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));
    }

    function u(e, t) {
      this.curve = e, this.type = t, this.precomputed = null;
    }

    t.exports = f, f.prototype.point = function () {
      throw new Error("Not implemented");
    }, f.prototype.validate = function () {
      throw new Error("Not implemented");
    }, f.prototype._fixedNafMul = function (e, t) {
      s(e.precomputed);

      var r = e._getDoubles(),
          n = o(t, 1, this._bitLength),
          i = (1 << r.step + 1) - (r.step % 2 == 0 ? 2 : 1);

      i /= 3;

      for (var a = [], f = 0; f < n.length; f += r.step) {
        var u = 0;

        for (t = f + r.step - 1; t >= f; t--) {
          u = (u << 1) + n[t];
        }

        a.push(u);
      }

      for (var c = this.jpoint(null, null, null), h = this.jpoint(null, null, null), d = i; d > 0; d--) {
        for (f = 0; f < a.length; f++) {
          (u = a[f]) === d ? h = h.mixedAdd(r.points[f]) : u === -d && (h = h.mixedAdd(r.points[f].neg()));
        }

        c = c.add(h);
      }

      return c.toP();
    }, f.prototype._wnafMul = function (e, t) {
      var r = 4,
          n = e._getNAFPoints(r);

      r = n.wnd;

      for (var i = n.points, a = o(t, r, this._bitLength), f = this.jpoint(null, null, null), u = a.length - 1; u >= 0; u--) {
        for (t = 0; u >= 0 && 0 === a[u]; u--) {
          t++;
        }

        if (u >= 0 && t++, f = f.dblp(t), u < 0) break;
        var c = a[u];
        s(0 !== c), f = "affine" === e.type ? c > 0 ? f.mixedAdd(i[c - 1 >> 1]) : f.mixedAdd(i[-c - 1 >> 1].neg()) : c > 0 ? f.add(i[c - 1 >> 1]) : f.add(i[-c - 1 >> 1].neg());
      }

      return "affine" === e.type ? f.toP() : f;
    }, f.prototype._wnafMulAdd = function (e, t, r, n, i) {
      for (var s = this._wnafT1, f = this._wnafT2, u = this._wnafT3, c = 0, h = 0; h < n; h++) {
        var d = (k = t[h])._getNAFPoints(e);

        s[h] = d.wnd, f[h] = d.points;
      }

      for (h = n - 1; h >= 1; h -= 2) {
        var l = h - 1,
            p = h;

        if (1 === s[l] && 1 === s[p]) {
          var b = [t[l], null, null, t[p]];
          0 === t[l].y.cmp(t[p].y) ? (b[1] = t[l].add(t[p]), b[2] = t[l].toJ().mixedAdd(t[p].neg())) : 0 === t[l].y.cmp(t[p].y.redNeg()) ? (b[1] = t[l].toJ().mixedAdd(t[p]), b[2] = t[l].add(t[p].neg())) : (b[1] = t[l].toJ().mixedAdd(t[p]), b[2] = t[l].toJ().mixedAdd(t[p].neg()));
          var m = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
              y = a(r[l], r[p]);
          c = Math.max(y[0].length, c), u[l] = new Array(c), u[p] = new Array(c);

          for (var g = 0; g < c; g++) {
            var v = 0 | y[0][g],
                w = 0 | y[1][g];
            u[l][g] = m[3 * (v + 1) + (w + 1)], u[p][g] = 0, f[l] = b;
          }
        } else u[l] = o(r[l], s[l], this._bitLength), u[p] = o(r[p], s[p], this._bitLength), c = Math.max(u[l].length, c), c = Math.max(u[p].length, c);
      }

      var _ = this.jpoint(null, null, null),
          E = this._wnafT4;

      for (h = c; h >= 0; h--) {
        for (var M = 0; h >= 0;) {
          var S = !0;

          for (g = 0; g < n; g++) {
            E[g] = 0 | u[g][h], 0 !== E[g] && (S = !1);
          }

          if (!S) break;
          M++, h--;
        }

        if (h >= 0 && M++, _ = _.dblp(M), h < 0) break;

        for (g = 0; g < n; g++) {
          var k,
              A = E[g];
          0 !== A && (A > 0 ? k = f[g][A - 1 >> 1] : A < 0 && (k = f[g][-A - 1 >> 1].neg()), _ = "affine" === k.type ? _.mixedAdd(k) : _.add(k));
        }
      }

      for (h = 0; h < n; h++) {
        f[h] = null;
      }

      return i ? _ : _.toP();
    }, f.BasePoint = u, u.prototype.eq = function () {
      throw new Error("Not implemented");
    }, u.prototype.validate = function () {
      return this.curve.validate(this);
    }, f.prototype.decodePoint = function (e, t) {
      e = i.toArray(e, t);
      var r = this.p.byteLength();
      if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * r) return 6 === e[0] ? s(e[e.length - 1] % 2 == 0) : 7 === e[0] && s(e[e.length - 1] % 2 == 1), this.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r));
      if ((2 === e[0] || 3 === e[0]) && e.length - 1 === r) return this.pointFromX(e.slice(1, 1 + r), 3 === e[0]);
      throw new Error("Unknown point format");
    }, u.prototype.encodeCompressed = function (e) {
      return this.encode(e, !0);
    }, u.prototype._encode = function (e) {
      var t = this.curve.p.byteLength(),
          r = this.getX().toArray("be", t);
      return e ? [this.getY().isEven() ? 2 : 3].concat(r) : [4].concat(r, this.getY().toArray("be", t));
    }, u.prototype.encode = function (e, t) {
      return i.encode(this._encode(t), e);
    }, u.prototype.precompute = function (e) {
      if (this.precomputed) return this;
      var t = {
        doubles: null,
        naf: null,
        beta: null
      };
      return t.naf = this._getNAFPoints(8), t.doubles = this._getDoubles(4, e), t.beta = this._getBeta(), this.precomputed = t, this;
    }, u.prototype._hasDoubles = function (e) {
      if (!this.precomputed) return !1;
      var t = this.precomputed.doubles;
      return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step);
    }, u.prototype._getDoubles = function (e, t) {
      if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;

      for (var r = [this], n = this, i = 0; i < t; i += e) {
        for (var o = 0; o < e; o++) {
          n = n.dbl();
        }

        r.push(n);
      }

      return {
        step: e,
        points: r
      };
    }, u.prototype._getNAFPoints = function (e) {
      if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;

      for (var t = [this], r = (1 << e) - 1, n = 1 === r ? null : this.dbl(), i = 1; i < r; i++) {
        t[i] = t[i - 1].add(n);
      }

      return {
        wnd: e,
        points: t
      };
    }, u.prototype._getBeta = function () {
      return null;
    }, u.prototype.dblp = function (e) {
      for (var t = this, r = 0; r < e; r++) {
        t = t.dbl();
      }

      return t;
    };
  }, {
    "../utils": 100,
    "bn.js": 101
  }],
  88: [function (e, t, r) {
    "use strict";

    var n = e("../utils"),
        i = e("bn.js"),
        o = e("inherits"),
        a = e("./base"),
        s = n.assert;

    function f(e) {
      this.twisted = 1 != (0 | e.a), this.mOneA = this.twisted && -1 == (0 | e.a), this.extended = this.mOneA, a.call(this, "edwards", e), this.a = new i(e.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new i(e.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new i(e.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), s(!this.twisted || 0 === this.c.fromRed().cmpn(1)), this.oneC = 1 == (0 | e.c);
    }

    function u(e, t, r, n, o) {
      a.BasePoint.call(this, e, "projective"), null === t && null === r && null === n ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new i(t, 16), this.y = new i(r, 16), this.z = n ? new i(n, 16) : this.curve.one, this.t = o && new i(o, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
    }

    o(f, a), t.exports = f, f.prototype._mulA = function (e) {
      return this.mOneA ? e.redNeg() : this.a.redMul(e);
    }, f.prototype._mulC = function (e) {
      return this.oneC ? e : this.c.redMul(e);
    }, f.prototype.jpoint = function (e, t, r, n) {
      return this.point(e, t, r, n);
    }, f.prototype.pointFromX = function (e, t) {
      (e = new i(e, 16)).red || (e = e.toRed(this.red));
      var r = e.redSqr(),
          n = this.c2.redSub(this.a.redMul(r)),
          o = this.one.redSub(this.c2.redMul(this.d).redMul(r)),
          a = n.redMul(o.redInvm()),
          s = a.redSqrt();
      if (0 !== s.redSqr().redSub(a).cmp(this.zero)) throw new Error("invalid point");
      var f = s.fromRed().isOdd();
      return (t && !f || !t && f) && (s = s.redNeg()), this.point(e, s);
    }, f.prototype.pointFromY = function (e, t) {
      (e = new i(e, 16)).red || (e = e.toRed(this.red));
      var r = e.redSqr(),
          n = r.redSub(this.c2),
          o = r.redMul(this.d).redMul(this.c2).redSub(this.a),
          a = n.redMul(o.redInvm());

      if (0 === a.cmp(this.zero)) {
        if (t) throw new Error("invalid point");
        return this.point(this.zero, e);
      }

      var s = a.redSqrt();
      if (0 !== s.redSqr().redSub(a).cmp(this.zero)) throw new Error("invalid point");
      return s.fromRed().isOdd() !== t && (s = s.redNeg()), this.point(s, e);
    }, f.prototype.validate = function (e) {
      if (e.isInfinity()) return !0;
      e.normalize();
      var t = e.x.redSqr(),
          r = e.y.redSqr(),
          n = t.redMul(this.a).redAdd(r),
          i = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r)));
      return 0 === n.cmp(i);
    }, o(u, a.BasePoint), f.prototype.pointFromJSON = function (e) {
      return u.fromJSON(this, e);
    }, f.prototype.point = function (e, t, r, n) {
      return new u(this, e, t, r, n);
    }, u.fromJSON = function (e, t) {
      return new u(e, t[0], t[1], t[2]);
    }, u.prototype.inspect = function () {
      return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    }, u.prototype.isInfinity = function () {
      return 0 === this.x.cmpn(0) && (0 === this.y.cmp(this.z) || this.zOne && 0 === this.y.cmp(this.curve.c));
    }, u.prototype._extDbl = function () {
      var e = this.x.redSqr(),
          t = this.y.redSqr(),
          r = this.z.redSqr();
      r = r.redIAdd(r);

      var n = this.curve._mulA(e),
          i = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t),
          o = n.redAdd(t),
          a = o.redSub(r),
          s = n.redSub(t),
          f = i.redMul(a),
          u = o.redMul(s),
          c = i.redMul(s),
          h = a.redMul(o);

      return this.curve.point(f, u, h, c);
    }, u.prototype._projDbl = function () {
      var e,
          t,
          r,
          n = this.x.redAdd(this.y).redSqr(),
          i = this.x.redSqr(),
          o = this.y.redSqr();

      if (this.curve.twisted) {
        var a = (u = this.curve._mulA(i)).redAdd(o);

        if (this.zOne) e = n.redSub(i).redSub(o).redMul(a.redSub(this.curve.two)), t = a.redMul(u.redSub(o)), r = a.redSqr().redSub(a).redSub(a);else {
          var s = this.z.redSqr(),
              f = a.redSub(s).redISub(s);
          e = n.redSub(i).redISub(o).redMul(f), t = a.redMul(u.redSub(o)), r = a.redMul(f);
        }
      } else {
        var u = i.redAdd(o);
        s = this.curve._mulC(this.z).redSqr(), f = u.redSub(s).redSub(s);
        e = this.curve._mulC(n.redISub(u)).redMul(f), t = this.curve._mulC(u).redMul(i.redISub(o)), r = u.redMul(f);
      }

      return this.curve.point(e, t, r);
    }, u.prototype.dbl = function () {
      return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
    }, u.prototype._extAdd = function (e) {
      var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)),
          r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),
          n = this.t.redMul(this.curve.dd).redMul(e.t),
          i = this.z.redMul(e.z.redAdd(e.z)),
          o = r.redSub(t),
          a = i.redSub(n),
          s = i.redAdd(n),
          f = r.redAdd(t),
          u = o.redMul(a),
          c = s.redMul(f),
          h = o.redMul(f),
          d = a.redMul(s);
      return this.curve.point(u, c, d, h);
    }, u.prototype._projAdd = function (e) {
      var t,
          r,
          n = this.z.redMul(e.z),
          i = n.redSqr(),
          o = this.x.redMul(e.x),
          a = this.y.redMul(e.y),
          s = this.curve.d.redMul(o).redMul(a),
          f = i.redSub(s),
          u = i.redAdd(s),
          c = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(o).redISub(a),
          h = n.redMul(f).redMul(c);
      return this.curve.twisted ? (t = n.redMul(u).redMul(a.redSub(this.curve._mulA(o))), r = f.redMul(u)) : (t = n.redMul(u).redMul(a.redSub(o)), r = this.curve._mulC(f).redMul(u)), this.curve.point(h, t, r);
    }, u.prototype.add = function (e) {
      return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e);
    }, u.prototype.mul = function (e) {
      return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e);
    }, u.prototype.mulAdd = function (e, t, r) {
      return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !1);
    }, u.prototype.jmulAdd = function (e, t, r) {
      return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !0);
    }, u.prototype.normalize = function () {
      if (this.zOne) return this;
      var e = this.z.redInvm();
      return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this;
    }, u.prototype.neg = function () {
      return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
    }, u.prototype.getX = function () {
      return this.normalize(), this.x.fromRed();
    }, u.prototype.getY = function () {
      return this.normalize(), this.y.fromRed();
    }, u.prototype.eq = function (e) {
      return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY());
    }, u.prototype.eqXToP = function (e) {
      var t = e.toRed(this.curve.red).redMul(this.z);
      if (0 === this.x.cmp(t)) return !0;

      for (var r = e.clone(), n = this.curve.redN.redMul(this.z);;) {
        if (r.iadd(this.curve.n), r.cmp(this.curve.p) >= 0) return !1;
        if (t.redIAdd(n), 0 === this.x.cmp(t)) return !0;
      }
    }, u.prototype.toP = u.prototype.normalize, u.prototype.mixedAdd = u.prototype.add;
  }, {
    "../utils": 100,
    "./base": 87,
    "bn.js": 101,
    inherits: 135
  }],
  89: [function (e, t, r) {
    "use strict";

    var n = r;
    n.base = e("./base"), n["short"] = e("./short"), n.mont = e("./mont"), n.edwards = e("./edwards");
  }, {
    "./base": 87,
    "./edwards": 88,
    "./mont": 90,
    "./short": 91
  }],
  90: [function (e, t, r) {
    "use strict";

    var n = e("bn.js"),
        i = e("inherits"),
        o = e("./base"),
        a = e("../utils");

    function s(e) {
      o.call(this, "mont", e), this.a = new n(e.a, 16).toRed(this.red), this.b = new n(e.b, 16).toRed(this.red), this.i4 = new n(4).toRed(this.red).redInvm(), this.two = new n(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two));
    }

    function f(e, t, r) {
      o.BasePoint.call(this, e, "projective"), null === t && null === r ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new n(t, 16), this.z = new n(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)));
    }

    i(s, o), t.exports = s, s.prototype.validate = function (e) {
      var t = e.normalize().x,
          r = t.redSqr(),
          n = r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t);
      return 0 === n.redSqrt().redSqr().cmp(n);
    }, i(f, o.BasePoint), s.prototype.decodePoint = function (e, t) {
      return this.point(a.toArray(e, t), 1);
    }, s.prototype.point = function (e, t) {
      return new f(this, e, t);
    }, s.prototype.pointFromJSON = function (e) {
      return f.fromJSON(this, e);
    }, f.prototype.precompute = function () {}, f.prototype._encode = function () {
      return this.getX().toArray("be", this.curve.p.byteLength());
    }, f.fromJSON = function (e, t) {
      return new f(e, t[0], t[1] || e.one);
    }, f.prototype.inspect = function () {
      return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    }, f.prototype.isInfinity = function () {
      return 0 === this.z.cmpn(0);
    }, f.prototype.dbl = function () {
      var e = this.x.redAdd(this.z).redSqr(),
          t = this.x.redSub(this.z).redSqr(),
          r = e.redSub(t),
          n = e.redMul(t),
          i = r.redMul(t.redAdd(this.curve.a24.redMul(r)));
      return this.curve.point(n, i);
    }, f.prototype.add = function () {
      throw new Error("Not supported on Montgomery curve");
    }, f.prototype.diffAdd = function (e, t) {
      var r = this.x.redAdd(this.z),
          n = this.x.redSub(this.z),
          i = e.x.redAdd(e.z),
          o = e.x.redSub(e.z).redMul(r),
          a = i.redMul(n),
          s = t.z.redMul(o.redAdd(a).redSqr()),
          f = t.x.redMul(o.redISub(a).redSqr());
      return this.curve.point(s, f);
    }, f.prototype.mul = function (e) {
      for (var t = e.clone(), r = this, n = this.curve.point(null, null), i = []; 0 !== t.cmpn(0); t.iushrn(1)) {
        i.push(t.andln(1));
      }

      for (var o = i.length - 1; o >= 0; o--) {
        0 === i[o] ? (r = r.diffAdd(n, this), n = n.dbl()) : (n = r.diffAdd(n, this), r = r.dbl());
      }

      return n;
    }, f.prototype.mulAdd = function () {
      throw new Error("Not supported on Montgomery curve");
    }, f.prototype.jumlAdd = function () {
      throw new Error("Not supported on Montgomery curve");
    }, f.prototype.eq = function (e) {
      return 0 === this.getX().cmp(e.getX());
    }, f.prototype.normalize = function () {
      return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this;
    }, f.prototype.getX = function () {
      return this.normalize(), this.x.fromRed();
    };
  }, {
    "../utils": 100,
    "./base": 87,
    "bn.js": 101,
    inherits: 135
  }],
  91: [function (e, t, r) {
    "use strict";

    var n = e("../utils"),
        i = e("bn.js"),
        o = e("inherits"),
        a = e("./base"),
        s = n.assert;

    function f(e) {
      a.call(this, "short", e), this.a = new i(e.a, 16).toRed(this.red), this.b = new i(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
    }

    function u(e, t, r, n) {
      a.BasePoint.call(this, e, "affine"), null === t && null === r ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new i(t, 16), this.y = new i(r, 16), n && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);
    }

    function c(e, t, r, n) {
      a.BasePoint.call(this, e, "jacobian"), null === t && null === r && null === n ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new i(0)) : (this.x = new i(t, 16), this.y = new i(r, 16), this.z = new i(n, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
    }

    o(f, a), t.exports = f, f.prototype._getEndomorphism = function (e) {
      if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
        var t, r;
        if (e.beta) t = new i(e.beta, 16).toRed(this.red);else {
          var n = this._getEndoRoots(this.p);

          t = (t = n[0].cmp(n[1]) < 0 ? n[0] : n[1]).toRed(this.red);
        }
        if (e.lambda) r = new i(e.lambda, 16);else {
          var o = this._getEndoRoots(this.n);

          0 === this.g.mul(o[0]).x.cmp(this.g.x.redMul(t)) ? r = o[0] : (r = o[1], s(0 === this.g.mul(r).x.cmp(this.g.x.redMul(t))));
        }
        return {
          beta: t,
          lambda: r,
          basis: e.basis ? e.basis.map(function (e) {
            return {
              a: new i(e.a, 16),
              b: new i(e.b, 16)
            };
          }) : this._getEndoBasis(r)
        };
      }
    }, f.prototype._getEndoRoots = function (e) {
      var t = e === this.p ? this.red : i.mont(e),
          r = new i(2).toRed(t).redInvm(),
          n = r.redNeg(),
          o = new i(3).toRed(t).redNeg().redSqrt().redMul(r);
      return [n.redAdd(o).fromRed(), n.redSub(o).fromRed()];
    }, f.prototype._getEndoBasis = function (e) {
      for (var t, r, n, o, a, s, f, u, c, h = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), d = e, l = this.n.clone(), p = new i(1), b = new i(0), m = new i(0), y = new i(1), g = 0; 0 !== d.cmpn(0);) {
        var v = l.div(d);
        u = l.sub(v.mul(d)), c = m.sub(v.mul(p));
        var w = y.sub(v.mul(b));
        if (!n && u.cmp(h) < 0) t = f.neg(), r = p, n = u.neg(), o = c;else if (n && 2 == ++g) break;
        f = u, l = d, d = u, m = p, p = c, y = b, b = w;
      }

      a = u.neg(), s = c;

      var _ = n.sqr().add(o.sqr());

      return a.sqr().add(s.sqr()).cmp(_) >= 0 && (a = t, s = r), n.negative && (n = n.neg(), o = o.neg()), a.negative && (a = a.neg(), s = s.neg()), [{
        a: n,
        b: o
      }, {
        a: a,
        b: s
      }];
    }, f.prototype._endoSplit = function (e) {
      var t = this.endo.basis,
          r = t[0],
          n = t[1],
          i = n.b.mul(e).divRound(this.n),
          o = r.b.neg().mul(e).divRound(this.n),
          a = i.mul(r.a),
          s = o.mul(n.a),
          f = i.mul(r.b),
          u = o.mul(n.b);
      return {
        k1: e.sub(a).sub(s),
        k2: f.add(u).neg()
      };
    }, f.prototype.pointFromX = function (e, t) {
      (e = new i(e, 16)).red || (e = e.toRed(this.red));
      var r = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b),
          n = r.redSqrt();
      if (0 !== n.redSqr().redSub(r).cmp(this.zero)) throw new Error("invalid point");
      var o = n.fromRed().isOdd();
      return (t && !o || !t && o) && (n = n.redNeg()), this.point(e, n);
    }, f.prototype.validate = function (e) {
      if (e.inf) return !0;
      var t = e.x,
          r = e.y,
          n = this.a.redMul(t),
          i = t.redSqr().redMul(t).redIAdd(n).redIAdd(this.b);
      return 0 === r.redSqr().redISub(i).cmpn(0);
    }, f.prototype._endoWnafMulAdd = function (e, t, r) {
      for (var n = this._endoWnafT1, i = this._endoWnafT2, o = 0; o < e.length; o++) {
        var a = this._endoSplit(t[o]),
            s = e[o],
            f = s._getBeta();

        a.k1.negative && (a.k1.ineg(), s = s.neg(!0)), a.k2.negative && (a.k2.ineg(), f = f.neg(!0)), n[2 * o] = s, n[2 * o + 1] = f, i[2 * o] = a.k1, i[2 * o + 1] = a.k2;
      }

      for (var u = this._wnafMulAdd(1, n, i, 2 * o, r), c = 0; c < 2 * o; c++) {
        n[c] = null, i[c] = null;
      }

      return u;
    }, o(u, a.BasePoint), f.prototype.point = function (e, t, r) {
      return new u(this, e, t, r);
    }, f.prototype.pointFromJSON = function (e, t) {
      return u.fromJSON(this, e, t);
    }, u.prototype._getBeta = function () {
      if (this.curve.endo) {
        var e = this.precomputed;
        if (e && e.beta) return e.beta;
        var t = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);

        if (e) {
          var r = this.curve,
              n = function n(e) {
            return r.point(e.x.redMul(r.endo.beta), e.y);
          };

          e.beta = t, t.precomputed = {
            beta: null,
            naf: e.naf && {
              wnd: e.naf.wnd,
              points: e.naf.points.map(n)
            },
            doubles: e.doubles && {
              step: e.doubles.step,
              points: e.doubles.points.map(n)
            }
          };
        }

        return t;
      }
    }, u.prototype.toJSON = function () {
      return this.precomputed ? [this.x, this.y, this.precomputed && {
        doubles: this.precomputed.doubles && {
          step: this.precomputed.doubles.step,
          points: this.precomputed.doubles.points.slice(1)
        },
        naf: this.precomputed.naf && {
          wnd: this.precomputed.naf.wnd,
          points: this.precomputed.naf.points.slice(1)
        }
      }] : [this.x, this.y];
    }, u.fromJSON = function (e, t, r) {
      "string" == typeof t && (t = JSON.parse(t));
      var n = e.point(t[0], t[1], r);
      if (!t[2]) return n;

      function i(t) {
        return e.point(t[0], t[1], r);
      }

      var o = t[2];
      return n.precomputed = {
        beta: null,
        doubles: o.doubles && {
          step: o.doubles.step,
          points: [n].concat(o.doubles.points.map(i))
        },
        naf: o.naf && {
          wnd: o.naf.wnd,
          points: [n].concat(o.naf.points.map(i))
        }
      }, n;
    }, u.prototype.inspect = function () {
      return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
    }, u.prototype.isInfinity = function () {
      return this.inf;
    }, u.prototype.add = function (e) {
      if (this.inf) return e;
      if (e.inf) return this;
      if (this.eq(e)) return this.dbl();
      if (this.neg().eq(e)) return this.curve.point(null, null);
      if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
      var t = this.y.redSub(e.y);
      0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
      var r = t.redSqr().redISub(this.x).redISub(e.x),
          n = t.redMul(this.x.redSub(r)).redISub(this.y);
      return this.curve.point(r, n);
    }, u.prototype.dbl = function () {
      if (this.inf) return this;
      var e = this.y.redAdd(this.y);
      if (0 === e.cmpn(0)) return this.curve.point(null, null);
      var t = this.curve.a,
          r = this.x.redSqr(),
          n = e.redInvm(),
          i = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(n),
          o = i.redSqr().redISub(this.x.redAdd(this.x)),
          a = i.redMul(this.x.redSub(o)).redISub(this.y);
      return this.curve.point(o, a);
    }, u.prototype.getX = function () {
      return this.x.fromRed();
    }, u.prototype.getY = function () {
      return this.y.fromRed();
    }, u.prototype.mul = function (e) {
      return e = new i(e, 16), this.isInfinity() ? this : this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e);
    }, u.prototype.mulAdd = function (e, t, r) {
      var n = [this, t],
          i = [e, r];
      return this.curve.endo ? this.curve._endoWnafMulAdd(n, i) : this.curve._wnafMulAdd(1, n, i, 2);
    }, u.prototype.jmulAdd = function (e, t, r) {
      var n = [this, t],
          i = [e, r];
      return this.curve.endo ? this.curve._endoWnafMulAdd(n, i, !0) : this.curve._wnafMulAdd(1, n, i, 2, !0);
    }, u.prototype.eq = function (e) {
      return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y));
    }, u.prototype.neg = function (e) {
      if (this.inf) return this;
      var t = this.curve.point(this.x, this.y.redNeg());

      if (e && this.precomputed) {
        var r = this.precomputed,
            n = function n(e) {
          return e.neg();
        };

        t.precomputed = {
          naf: r.naf && {
            wnd: r.naf.wnd,
            points: r.naf.points.map(n)
          },
          doubles: r.doubles && {
            step: r.doubles.step,
            points: r.doubles.points.map(n)
          }
        };
      }

      return t;
    }, u.prototype.toJ = function () {
      return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one);
    }, o(c, a.BasePoint), f.prototype.jpoint = function (e, t, r) {
      return new c(this, e, t, r);
    }, c.prototype.toP = function () {
      if (this.isInfinity()) return this.curve.point(null, null);
      var e = this.z.redInvm(),
          t = e.redSqr(),
          r = this.x.redMul(t),
          n = this.y.redMul(t).redMul(e);
      return this.curve.point(r, n);
    }, c.prototype.neg = function () {
      return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
    }, c.prototype.add = function (e) {
      if (this.isInfinity()) return e;
      if (e.isInfinity()) return this;
      var t = e.z.redSqr(),
          r = this.z.redSqr(),
          n = this.x.redMul(t),
          i = e.x.redMul(r),
          o = this.y.redMul(t.redMul(e.z)),
          a = e.y.redMul(r.redMul(this.z)),
          s = n.redSub(i),
          f = o.redSub(a);
      if (0 === s.cmpn(0)) return 0 !== f.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
      var u = s.redSqr(),
          c = u.redMul(s),
          h = n.redMul(u),
          d = f.redSqr().redIAdd(c).redISub(h).redISub(h),
          l = f.redMul(h.redISub(d)).redISub(o.redMul(c)),
          p = this.z.redMul(e.z).redMul(s);
      return this.curve.jpoint(d, l, p);
    }, c.prototype.mixedAdd = function (e) {
      if (this.isInfinity()) return e.toJ();
      if (e.isInfinity()) return this;
      var t = this.z.redSqr(),
          r = this.x,
          n = e.x.redMul(t),
          i = this.y,
          o = e.y.redMul(t).redMul(this.z),
          a = r.redSub(n),
          s = i.redSub(o);
      if (0 === a.cmpn(0)) return 0 !== s.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
      var f = a.redSqr(),
          u = f.redMul(a),
          c = r.redMul(f),
          h = s.redSqr().redIAdd(u).redISub(c).redISub(c),
          d = s.redMul(c.redISub(h)).redISub(i.redMul(u)),
          l = this.z.redMul(a);
      return this.curve.jpoint(h, d, l);
    }, c.prototype.dblp = function (e) {
      if (0 === e) return this;
      if (this.isInfinity()) return this;
      if (!e) return this.dbl();

      if (this.curve.zeroA || this.curve.threeA) {
        for (var t = this, r = 0; r < e; r++) {
          t = t.dbl();
        }

        return t;
      }

      var n = this.curve.a,
          i = this.curve.tinv,
          o = this.x,
          a = this.y,
          s = this.z,
          f = s.redSqr().redSqr(),
          u = a.redAdd(a);

      for (r = 0; r < e; r++) {
        var c = o.redSqr(),
            h = u.redSqr(),
            d = h.redSqr(),
            l = c.redAdd(c).redIAdd(c).redIAdd(n.redMul(f)),
            p = o.redMul(h),
            b = l.redSqr().redISub(p.redAdd(p)),
            m = p.redISub(b),
            y = l.redMul(m);
        y = y.redIAdd(y).redISub(d);
        var g = u.redMul(s);
        r + 1 < e && (f = f.redMul(d)), o = b, s = g, u = y;
      }

      return this.curve.jpoint(o, u.redMul(i), s);
    }, c.prototype.dbl = function () {
      return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
    }, c.prototype._zeroDbl = function () {
      var e, t, r;

      if (this.zOne) {
        var n = this.x.redSqr(),
            i = this.y.redSqr(),
            o = i.redSqr(),
            a = this.x.redAdd(i).redSqr().redISub(n).redISub(o);
        a = a.redIAdd(a);
        var s = n.redAdd(n).redIAdd(n),
            f = s.redSqr().redISub(a).redISub(a),
            u = o.redIAdd(o);
        u = (u = u.redIAdd(u)).redIAdd(u), e = f, t = s.redMul(a.redISub(f)).redISub(u), r = this.y.redAdd(this.y);
      } else {
        var c = this.x.redSqr(),
            h = this.y.redSqr(),
            d = h.redSqr(),
            l = this.x.redAdd(h).redSqr().redISub(c).redISub(d);
        l = l.redIAdd(l);
        var p = c.redAdd(c).redIAdd(c),
            b = p.redSqr(),
            m = d.redIAdd(d);
        m = (m = m.redIAdd(m)).redIAdd(m), e = b.redISub(l).redISub(l), t = p.redMul(l.redISub(e)).redISub(m), r = (r = this.y.redMul(this.z)).redIAdd(r);
      }

      return this.curve.jpoint(e, t, r);
    }, c.prototype._threeDbl = function () {
      var e, t, r;

      if (this.zOne) {
        var n = this.x.redSqr(),
            i = this.y.redSqr(),
            o = i.redSqr(),
            a = this.x.redAdd(i).redSqr().redISub(n).redISub(o);
        a = a.redIAdd(a);
        var s = n.redAdd(n).redIAdd(n).redIAdd(this.curve.a),
            f = s.redSqr().redISub(a).redISub(a);
        e = f;
        var u = o.redIAdd(o);
        u = (u = u.redIAdd(u)).redIAdd(u), t = s.redMul(a.redISub(f)).redISub(u), r = this.y.redAdd(this.y);
      } else {
        var c = this.z.redSqr(),
            h = this.y.redSqr(),
            d = this.x.redMul(h),
            l = this.x.redSub(c).redMul(this.x.redAdd(c));
        l = l.redAdd(l).redIAdd(l);
        var p = d.redIAdd(d),
            b = (p = p.redIAdd(p)).redAdd(p);
        e = l.redSqr().redISub(b), r = this.y.redAdd(this.z).redSqr().redISub(h).redISub(c);
        var m = h.redSqr();
        m = (m = (m = m.redIAdd(m)).redIAdd(m)).redIAdd(m), t = l.redMul(p.redISub(e)).redISub(m);
      }

      return this.curve.jpoint(e, t, r);
    }, c.prototype._dbl = function () {
      var e = this.curve.a,
          t = this.x,
          r = this.y,
          n = this.z,
          i = n.redSqr().redSqr(),
          o = t.redSqr(),
          a = r.redSqr(),
          s = o.redAdd(o).redIAdd(o).redIAdd(e.redMul(i)),
          f = t.redAdd(t),
          u = (f = f.redIAdd(f)).redMul(a),
          c = s.redSqr().redISub(u.redAdd(u)),
          h = u.redISub(c),
          d = a.redSqr();
      d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
      var l = s.redMul(h).redISub(d),
          p = r.redAdd(r).redMul(n);
      return this.curve.jpoint(c, l, p);
    }, c.prototype.trpl = function () {
      if (!this.curve.zeroA) return this.dbl().add(this);
      var e = this.x.redSqr(),
          t = this.y.redSqr(),
          r = this.z.redSqr(),
          n = t.redSqr(),
          i = e.redAdd(e).redIAdd(e),
          o = i.redSqr(),
          a = this.x.redAdd(t).redSqr().redISub(e).redISub(n),
          s = (a = (a = (a = a.redIAdd(a)).redAdd(a).redIAdd(a)).redISub(o)).redSqr(),
          f = n.redIAdd(n);
      f = (f = (f = f.redIAdd(f)).redIAdd(f)).redIAdd(f);
      var u = i.redIAdd(a).redSqr().redISub(o).redISub(s).redISub(f),
          c = t.redMul(u);
      c = (c = c.redIAdd(c)).redIAdd(c);
      var h = this.x.redMul(s).redISub(c);
      h = (h = h.redIAdd(h)).redIAdd(h);
      var d = this.y.redMul(u.redMul(f.redISub(u)).redISub(a.redMul(s)));
      d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
      var l = this.z.redAdd(a).redSqr().redISub(r).redISub(s);
      return this.curve.jpoint(h, d, l);
    }, c.prototype.mul = function (e, t) {
      return e = new i(e, t), this.curve._wnafMul(this, e);
    }, c.prototype.eq = function (e) {
      if ("affine" === e.type) return this.eq(e.toJ());
      if (this === e) return !0;
      var t = this.z.redSqr(),
          r = e.z.redSqr();
      if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1;
      var n = t.redMul(this.z),
          i = r.redMul(e.z);
      return 0 === this.y.redMul(i).redISub(e.y.redMul(n)).cmpn(0);
    }, c.prototype.eqXToP = function (e) {
      var t = this.z.redSqr(),
          r = e.toRed(this.curve.red).redMul(t);
      if (0 === this.x.cmp(r)) return !0;

      for (var n = e.clone(), i = this.curve.redN.redMul(t);;) {
        if (n.iadd(this.curve.n), n.cmp(this.curve.p) >= 0) return !1;
        if (r.redIAdd(i), 0 === this.x.cmp(r)) return !0;
      }
    }, c.prototype.inspect = function () {
      return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
    }, c.prototype.isInfinity = function () {
      return 0 === this.z.cmpn(0);
    };
  }, {
    "../utils": 100,
    "./base": 87,
    "bn.js": 101,
    inherits: 135
  }],
  92: [function (e, t, r) {
    "use strict";

    var n,
        i = r,
        o = e("hash.js"),
        a = e("./curve"),
        s = e("./utils").assert;

    function f(e) {
      "short" === e.type ? this.curve = new a["short"](e) : "edwards" === e.type ? this.curve = new a.edwards(e) : this.curve = new a.mont(e), this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash, s(this.g.validate(), "Invalid curve"), s(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
    }

    function u(e, t) {
      Object.defineProperty(i, e, {
        configurable: !0,
        enumerable: !0,
        get: function get() {
          var r = new f(t);
          return Object.defineProperty(i, e, {
            configurable: !0,
            enumerable: !0,
            value: r
          }), r;
        }
      });
    }

    i.PresetCurve = f, u("p192", {
      type: "short",
      prime: "p192",
      p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
      b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
      n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
      hash: o.sha256,
      gRed: !1,
      g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]
    }), u("p224", {
      type: "short",
      prime: "p224",
      p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
      b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
      n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
      hash: o.sha256,
      gRed: !1,
      g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]
    }), u("p256", {
      type: "short",
      prime: null,
      p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
      a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
      b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
      n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
      hash: o.sha256,
      gRed: !1,
      g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]
    }), u("p384", {
      type: "short",
      prime: null,
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
      a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
      b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
      n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
      hash: o.sha384,
      gRed: !1,
      g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"]
    }), u("p521", {
      type: "short",
      prime: null,
      p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
      a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
      b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
      n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
      hash: o.sha512,
      gRed: !1,
      g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"]
    }), u("curve25519", {
      type: "mont",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "76d06",
      b: "1",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: o.sha256,
      gRed: !1,
      g: ["9"]
    }), u("ed25519", {
      type: "edwards",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "-1",
      c: "1",
      d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: o.sha256,
      gRed: !1,
      g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"]
    });

    try {
      n = e("./precomputed/secp256k1");
    } catch (e) {
      n = void 0;
    }

    u("secp256k1", {
      type: "short",
      prime: "k256",
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
      a: "0",
      b: "7",
      n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
      h: "1",
      hash: o.sha256,
      beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
      lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
      basis: [{
        a: "3086d221a7d46bcde86c90e49284eb15",
        b: "-e4437ed6010e88286f547fa90abfe4c3"
      }, {
        a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
        b: "3086d221a7d46bcde86c90e49284eb15"
      }],
      gRed: !1,
      g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", n]
    });
  }, {
    "./curve": 89,
    "./precomputed/secp256k1": 99,
    "./utils": 100,
    "hash.js": 121
  }],
  93: [function (e, t, r) {
    "use strict";

    var n = e("bn.js"),
        i = e("hmac-drbg"),
        o = e("../utils"),
        a = e("../curves"),
        s = e("brorand"),
        f = o.assert,
        u = e("./key"),
        c = e("./signature");

    function h(e) {
      if (!(this instanceof h)) return new h(e);
      "string" == typeof e && (f(a.hasOwnProperty(e), "Unknown curve " + e), e = a[e]), e instanceof a.PresetCurve && (e = {
        curve: e
      }), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), this.hash = e.hash || e.curve.hash;
    }

    t.exports = h, h.prototype.keyPair = function (e) {
      return new u(this, e);
    }, h.prototype.keyFromPrivate = function (e, t) {
      return u.fromPrivate(this, e, t);
    }, h.prototype.keyFromPublic = function (e, t) {
      return u.fromPublic(this, e, t);
    }, h.prototype.genKeyPair = function (e) {
      e || (e = {});

      for (var t = new i({
        hash: this.hash,
        pers: e.pers,
        persEnc: e.persEnc || "utf8",
        entropy: e.entropy || s(this.hash.hmacStrength),
        entropyEnc: e.entropy && e.entropyEnc || "utf8",
        nonce: this.n.toArray()
      }), r = this.n.byteLength(), o = this.n.sub(new n(2));;) {
        var a = new n(t.generate(r));
        if (!(a.cmp(o) > 0)) return a.iaddn(1), this.keyFromPrivate(a);
      }
    }, h.prototype._truncateToN = function (e, t) {
      var r = 8 * e.byteLength() - this.n.bitLength();
      return r > 0 && (e = e.ushrn(r)), !t && e.cmp(this.n) >= 0 ? e.sub(this.n) : e;
    }, h.prototype.sign = function (e, t, r, o) {
      "object" == _typeof(r) && (o = r, r = null), o || (o = {}), t = this.keyFromPrivate(t, r), e = this._truncateToN(new n(e, 16));

      for (var a = this.n.byteLength(), s = t.getPrivate().toArray("be", a), f = e.toArray("be", a), u = new i({
        hash: this.hash,
        entropy: s,
        nonce: f,
        pers: o.pers,
        persEnc: o.persEnc || "utf8"
      }), h = this.n.sub(new n(1)), d = 0;; d++) {
        var l = o.k ? o.k(d) : new n(u.generate(this.n.byteLength()));

        if (!((l = this._truncateToN(l, !0)).cmpn(1) <= 0 || l.cmp(h) >= 0)) {
          var p = this.g.mul(l);

          if (!p.isInfinity()) {
            var b = p.getX(),
                m = b.umod(this.n);

            if (0 !== m.cmpn(0)) {
              var y = l.invm(this.n).mul(m.mul(t.getPrivate()).iadd(e));

              if (0 !== (y = y.umod(this.n)).cmpn(0)) {
                var g = (p.getY().isOdd() ? 1 : 0) | (0 !== b.cmp(m) ? 2 : 0);
                return o.canonical && y.cmp(this.nh) > 0 && (y = this.n.sub(y), g ^= 1), new c({
                  r: m,
                  s: y,
                  recoveryParam: g
                });
              }
            }
          }
        }
      }
    }, h.prototype.verify = function (e, t, r, i) {
      e = this._truncateToN(new n(e, 16)), r = this.keyFromPublic(r, i);
      var o = (t = new c(t, "hex")).r,
          a = t.s;
      if (o.cmpn(1) < 0 || o.cmp(this.n) >= 0) return !1;
      if (a.cmpn(1) < 0 || a.cmp(this.n) >= 0) return !1;
      var s,
          f = a.invm(this.n),
          u = f.mul(e).umod(this.n),
          h = f.mul(o).umod(this.n);
      return this.curve._maxwellTrick ? !(s = this.g.jmulAdd(u, r.getPublic(), h)).isInfinity() && s.eqXToP(o) : !(s = this.g.mulAdd(u, r.getPublic(), h)).isInfinity() && 0 === s.getX().umod(this.n).cmp(o);
    }, h.prototype.recoverPubKey = function (e, t, r, i) {
      f((3 & r) === r, "The recovery param is more than two bits"), t = new c(t, i);
      var o = this.n,
          a = new n(e),
          s = t.r,
          u = t.s,
          h = 1 & r,
          d = r >> 1;
      if (s.cmp(this.curve.p.umod(this.curve.n)) >= 0 && d) throw new Error("Unable to find sencond key candinate");
      s = d ? this.curve.pointFromX(s.add(this.curve.n), h) : this.curve.pointFromX(s, h);
      var l = t.r.invm(o),
          p = o.sub(a).mul(l).umod(o),
          b = u.mul(l).umod(o);
      return this.g.mulAdd(p, s, b);
    }, h.prototype.getKeyRecoveryParam = function (e, t, r, n) {
      if (null !== (t = new c(t, n)).recoveryParam) return t.recoveryParam;

      for (var i = 0; i < 4; i++) {
        var o;

        try {
          o = this.recoverPubKey(e, t, i);
        } catch (e) {
          continue;
        }

        if (o.eq(r)) return i;
      }

      throw new Error("Unable to find valid recovery factor");
    };
  }, {
    "../curves": 92,
    "../utils": 100,
    "./key": 94,
    "./signature": 95,
    "bn.js": 101,
    brorand: 18,
    "hmac-drbg": 133
  }],
  94: [function (e, t, r) {
    "use strict";

    var n = e("bn.js"),
        i = e("../utils").assert;

    function o(e, t) {
      this.ec = e, this.priv = null, this.pub = null, t.priv && this._importPrivate(t.priv, t.privEnc), t.pub && this._importPublic(t.pub, t.pubEnc);
    }

    t.exports = o, o.fromPublic = function (e, t, r) {
      return t instanceof o ? t : new o(e, {
        pub: t,
        pubEnc: r
      });
    }, o.fromPrivate = function (e, t, r) {
      return t instanceof o ? t : new o(e, {
        priv: t,
        privEnc: r
      });
    }, o.prototype.validate = function () {
      var e = this.getPublic();
      return e.isInfinity() ? {
        result: !1,
        reason: "Invalid public key"
      } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {
        result: !0,
        reason: null
      } : {
        result: !1,
        reason: "Public key * N != O"
      } : {
        result: !1,
        reason: "Public key is not a point"
      };
    }, o.prototype.getPublic = function (e, t) {
      return "string" == typeof e && (t = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), t ? this.pub.encode(t, e) : this.pub;
    }, o.prototype.getPrivate = function (e) {
      return "hex" === e ? this.priv.toString(16, 2) : this.priv;
    }, o.prototype._importPrivate = function (e, t) {
      this.priv = new n(e, t || 16), this.priv = this.priv.umod(this.ec.curve.n);
    }, o.prototype._importPublic = function (e, t) {
      if (e.x || e.y) return "mont" === this.ec.curve.type ? i(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || i(e.x && e.y, "Need both x and y coordinate"), void (this.pub = this.ec.curve.point(e.x, e.y));
      this.pub = this.ec.curve.decodePoint(e, t);
    }, o.prototype.derive = function (e) {
      return e.mul(this.priv).getX();
    }, o.prototype.sign = function (e, t, r) {
      return this.ec.sign(e, this, t, r);
    }, o.prototype.verify = function (e, t) {
      return this.ec.verify(e, t, this);
    }, o.prototype.inspect = function () {
      return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
    };
  }, {
    "../utils": 100,
    "bn.js": 101
  }],
  95: [function (e, t, r) {
    "use strict";

    var n = e("bn.js"),
        i = e("../utils"),
        o = i.assert;

    function a(e, t) {
      if (e instanceof a) return e;
      this._importDER(e, t) || (o(e.r && e.s, "Signature without r or s"), this.r = new n(e.r, 16), this.s = new n(e.s, 16), void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam);
    }

    function s() {
      this.place = 0;
    }

    function f(e, t) {
      var r = e[t.place++];
      if (!(128 & r)) return r;
      var n = 15 & r;
      if (0 === n || n > 4) return !1;

      for (var i = 0, o = 0, a = t.place; o < n; o++, a++) {
        i <<= 8, i |= e[a], i >>>= 0;
      }

      return !(i <= 127) && (t.place = a, i);
    }

    function u(e) {
      for (var t = 0, r = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < r;) {
        t++;
      }

      return 0 === t ? e : e.slice(t);
    }

    function c(e, t) {
      if (t < 128) e.push(t);else {
        var r = 1 + (Math.log(t) / Math.LN2 >>> 3);

        for (e.push(128 | r); --r;) {
          e.push(t >>> (r << 3) & 255);
        }

        e.push(t);
      }
    }

    t.exports = a, a.prototype._importDER = function (e, t) {
      e = i.toArray(e, t);
      var r = new s();
      if (48 !== e[r.place++]) return !1;
      var o = f(e, r);
      if (!1 === o) return !1;
      if (o + r.place !== e.length) return !1;
      if (2 !== e[r.place++]) return !1;
      var a = f(e, r);
      if (!1 === a) return !1;
      var u = e.slice(r.place, a + r.place);
      if (r.place += a, 2 !== e[r.place++]) return !1;
      var c = f(e, r);
      if (!1 === c) return !1;
      if (e.length !== c + r.place) return !1;
      var h = e.slice(r.place, c + r.place);

      if (0 === u[0]) {
        if (!(128 & u[1])) return !1;
        u = u.slice(1);
      }

      if (0 === h[0]) {
        if (!(128 & h[1])) return !1;
        h = h.slice(1);
      }

      return this.r = new n(u), this.s = new n(h), this.recoveryParam = null, !0;
    }, a.prototype.toDER = function (e) {
      var t = this.r.toArray(),
          r = this.s.toArray();

      for (128 & t[0] && (t = [0].concat(t)), 128 & r[0] && (r = [0].concat(r)), t = u(t), r = u(r); !(r[0] || 128 & r[1]);) {
        r = r.slice(1);
      }

      var n = [2];
      c(n, t.length), (n = n.concat(t)).push(2), c(n, r.length);
      var o = n.concat(r),
          a = [48];
      return c(a, o.length), a = a.concat(o), i.encode(a, e);
    };
  }, {
    "../utils": 100,
    "bn.js": 101
  }],
  96: [function (e, t, r) {
    "use strict";

    var n = e("hash.js"),
        i = e("../curves"),
        o = e("../utils"),
        a = o.assert,
        s = o.parseBytes,
        f = e("./key"),
        u = e("./signature");

    function c(e) {
      if (a("ed25519" === e, "only tested with ed25519 so far"), !(this instanceof c)) return new c(e);
      e = i[e].curve;
      this.curve = e, this.g = e.g, this.g.precompute(e.n.bitLength() + 1), this.pointClass = e.point().constructor, this.encodingLength = Math.ceil(e.n.bitLength() / 8), this.hash = n.sha512;
    }

    t.exports = c, c.prototype.sign = function (e, t) {
      e = s(e);
      var r = this.keyFromSecret(t),
          n = this.hashInt(r.messagePrefix(), e),
          i = this.g.mul(n),
          o = this.encodePoint(i),
          a = this.hashInt(o, r.pubBytes(), e).mul(r.priv()),
          f = n.add(a).umod(this.curve.n);
      return this.makeSignature({
        R: i,
        S: f,
        Rencoded: o
      });
    }, c.prototype.verify = function (e, t, r) {
      e = s(e), t = this.makeSignature(t);
      var n = this.keyFromPublic(r),
          i = this.hashInt(t.Rencoded(), n.pubBytes(), e),
          o = this.g.mul(t.S());
      return t.R().add(n.pub().mul(i)).eq(o);
    }, c.prototype.hashInt = function () {
      for (var e = this.hash(), t = 0; t < arguments.length; t++) {
        e.update(arguments[t]);
      }

      return o.intFromLE(e.digest()).umod(this.curve.n);
    }, c.prototype.keyFromPublic = function (e) {
      return f.fromPublic(this, e);
    }, c.prototype.keyFromSecret = function (e) {
      return f.fromSecret(this, e);
    }, c.prototype.makeSignature = function (e) {
      return e instanceof u ? e : new u(this, e);
    }, c.prototype.encodePoint = function (e) {
      var t = e.getY().toArray("le", this.encodingLength);
      return t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0, t;
    }, c.prototype.decodePoint = function (e) {
      var t = (e = o.parseBytes(e)).length - 1,
          r = e.slice(0, t).concat(-129 & e[t]),
          n = 0 != (128 & e[t]),
          i = o.intFromLE(r);
      return this.curve.pointFromY(i, n);
    }, c.prototype.encodeInt = function (e) {
      return e.toArray("le", this.encodingLength);
    }, c.prototype.decodeInt = function (e) {
      return o.intFromLE(e);
    }, c.prototype.isPoint = function (e) {
      return e instanceof this.pointClass;
    };
  }, {
    "../curves": 92,
    "../utils": 100,
    "./key": 97,
    "./signature": 98,
    "hash.js": 121
  }],
  97: [function (e, t, r) {
    "use strict";

    var n = e("../utils"),
        i = n.assert,
        o = n.parseBytes,
        a = n.cachedProperty;

    function s(e, t) {
      this.eddsa = e, this._secret = o(t.secret), e.isPoint(t.pub) ? this._pub = t.pub : this._pubBytes = o(t.pub);
    }

    s.fromPublic = function (e, t) {
      return t instanceof s ? t : new s(e, {
        pub: t
      });
    }, s.fromSecret = function (e, t) {
      return t instanceof s ? t : new s(e, {
        secret: t
      });
    }, s.prototype.secret = function () {
      return this._secret;
    }, a(s, "pubBytes", function () {
      return this.eddsa.encodePoint(this.pub());
    }), a(s, "pub", function () {
      return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
    }), a(s, "privBytes", function () {
      var e = this.eddsa,
          t = this.hash(),
          r = e.encodingLength - 1,
          n = t.slice(0, e.encodingLength);
      return n[0] &= 248, n[r] &= 127, n[r] |= 64, n;
    }), a(s, "priv", function () {
      return this.eddsa.decodeInt(this.privBytes());
    }), a(s, "hash", function () {
      return this.eddsa.hash().update(this.secret()).digest();
    }), a(s, "messagePrefix", function () {
      return this.hash().slice(this.eddsa.encodingLength);
    }), s.prototype.sign = function (e) {
      return i(this._secret, "KeyPair can only verify"), this.eddsa.sign(e, this);
    }, s.prototype.verify = function (e, t) {
      return this.eddsa.verify(e, t, this);
    }, s.prototype.getSecret = function (e) {
      return i(this._secret, "KeyPair is public only"), n.encode(this.secret(), e);
    }, s.prototype.getPublic = function (e) {
      return n.encode(this.pubBytes(), e);
    }, t.exports = s;
  }, {
    "../utils": 100
  }],
  98: [function (e, t, r) {
    "use strict";

    var n = e("bn.js"),
        i = e("../utils"),
        o = i.assert,
        a = i.cachedProperty,
        s = i.parseBytes;

    function f(e, t) {
      this.eddsa = e, "object" != _typeof(t) && (t = s(t)), Array.isArray(t) && (t = {
        R: t.slice(0, e.encodingLength),
        S: t.slice(e.encodingLength)
      }), o(t.R && t.S, "Signature without R or S"), e.isPoint(t.R) && (this._R = t.R), t.S instanceof n && (this._S = t.S), this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded, this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded;
    }

    a(f, "S", function () {
      return this.eddsa.decodeInt(this.Sencoded());
    }), a(f, "R", function () {
      return this.eddsa.decodePoint(this.Rencoded());
    }), a(f, "Rencoded", function () {
      return this.eddsa.encodePoint(this.R());
    }), a(f, "Sencoded", function () {
      return this.eddsa.encodeInt(this.S());
    }), f.prototype.toBytes = function () {
      return this.Rencoded().concat(this.Sencoded());
    }, f.prototype.toHex = function () {
      return i.encode(this.toBytes(), "hex").toUpperCase();
    }, t.exports = f;
  }, {
    "../utils": 100,
    "bn.js": 101
  }],
  99: [function (e, t, r) {
    t.exports = {
      doubles: {
        step: 4,
        points: [["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"], ["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"], ["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"], ["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"], ["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"], ["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"], ["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"], ["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"], ["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"], ["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"], ["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"], ["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"], ["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"], ["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"], ["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"], ["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"], ["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"], ["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"], ["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"], ["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"], ["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"], ["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"], ["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"], ["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"], ["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"], ["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"], ["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"], ["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"], ["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"], ["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"], ["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"], ["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"], ["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"], ["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"], ["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"], ["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"], ["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"], ["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"], ["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"], ["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"], ["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"], ["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"], ["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"], ["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"], ["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"], ["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"], ["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"], ["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"], ["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"], ["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"], ["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"], ["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"], ["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"], ["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"], ["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"], ["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"], ["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"], ["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"], ["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"], ["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"], ["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"], ["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"], ["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"], ["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"], ["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]]
      },
      naf: {
        wnd: 7,
        points: [["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"], ["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"], ["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"], ["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"], ["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"], ["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"], ["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"], ["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"], ["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"], ["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"], ["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"], ["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"], ["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"], ["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"], ["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"], ["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"], ["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"], ["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"], ["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"], ["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"], ["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"], ["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"], ["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"], ["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"], ["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"], ["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"], ["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"], ["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"], ["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"], ["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"], ["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"], ["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"], ["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"], ["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"], ["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"], ["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"], ["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"], ["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"], ["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"], ["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"], ["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"], ["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"], ["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"], ["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"], ["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"], ["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"], ["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"], ["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"], ["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"], ["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"], ["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"], ["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"], ["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"], ["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"], ["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"], ["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"], ["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"], ["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"], ["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"], ["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"], ["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"], ["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"], ["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"], ["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"], ["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"], ["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"], ["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"], ["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"], ["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"], ["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"], ["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"], ["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"], ["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"], ["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"], ["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"], ["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"], ["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"], ["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"], ["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"], ["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"], ["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"], ["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"], ["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"], ["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"], ["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"], ["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"], ["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"], ["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"], ["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"], ["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"], ["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"], ["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"], ["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"], ["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"], ["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"], ["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"], ["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"], ["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"], ["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"], ["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"], ["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"], ["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"], ["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"], ["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"], ["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"], ["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"], ["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"], ["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"], ["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"], ["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"], ["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"], ["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"], ["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"], ["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"], ["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"], ["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"], ["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"], ["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"], ["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"], ["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"], ["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"], ["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"], ["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"], ["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"], ["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"], ["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"], ["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]]
      }
    };
  }, {}],
  100: [function (e, t, r) {
    "use strict";

    var n = r,
        i = e("bn.js"),
        o = e("minimalistic-assert"),
        a = e("minimalistic-crypto-utils");
    n.assert = o, n.toArray = a.toArray, n.zero2 = a.zero2, n.toHex = a.toHex, n.encode = a.encode, n.getNAF = function (e, t, r) {
      var n = new Array(Math.max(e.bitLength(), r) + 1);
      n.fill(0);

      for (var i = 1 << t + 1, o = e.clone(), a = 0; a < n.length; a++) {
        var s,
            f = o.andln(i - 1);
        o.isOdd() ? (s = f > (i >> 1) - 1 ? (i >> 1) - f : f, o.isubn(s)) : s = 0, n[a] = s, o.iushrn(1);
      }

      return n;
    }, n.getJSF = function (e, t) {
      var r = [[], []];
      e = e.clone(), t = t.clone();

      for (var n = 0, i = 0; e.cmpn(-n) > 0 || t.cmpn(-i) > 0;) {
        var o,
            a,
            s,
            f = e.andln(3) + n & 3,
            u = t.andln(3) + i & 3;
        if (3 === f && (f = -1), 3 === u && (u = -1), 0 == (1 & f)) o = 0;else o = 3 !== (s = e.andln(7) + n & 7) && 5 !== s || 2 !== u ? f : -f;
        if (r[0].push(o), 0 == (1 & u)) a = 0;else a = 3 !== (s = t.andln(7) + i & 7) && 5 !== s || 2 !== f ? u : -u;
        r[1].push(a), 2 * n === o + 1 && (n = 1 - n), 2 * i === a + 1 && (i = 1 - i), e.iushrn(1), t.iushrn(1);
      }

      return r;
    }, n.cachedProperty = function (e, t, r) {
      var n = "_" + t;

      e.prototype[t] = function () {
        return void 0 !== this[n] ? this[n] : this[n] = r.call(this);
      };
    }, n.parseBytes = function (e) {
      return "string" == typeof e ? n.toArray(e, "hex") : e;
    }, n.intFromLE = function (e) {
      return new i(e, "hex", "le");
    };
  }, {
    "bn.js": 101,
    "minimalistic-assert": 141,
    "minimalistic-crypto-utils": 142
  }],
  101: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, {
    buffer: 19,
    dup: 15
  }],
  102: [function (e, t, r) {
    t.exports = {
      _args: [["elliptic@6.5.3", "/Users/numberwolf/Documents/webroot/VideoMissile/h265web.js-wasm-decoder"]],
      _from: "elliptic@6.5.3",
      _id: "elliptic@6.5.3",
      _inBundle: !1,
      _integrity: "sha512-IMqzv5wNQf+E6aHeIqATs0tOLeOTwj1QKbRcS3jBbYkl5oLAserA8yJTT7/VyHUYG91PRmPyeQDObKLPpeS4dw==",
      _location: "/elliptic",
      _phantomChildren: {},
      _requested: {
        type: "version",
        registry: !0,
        raw: "elliptic@6.5.3",
        name: "elliptic",
        escapedName: "elliptic",
        rawSpec: "6.5.3",
        saveSpec: null,
        fetchSpec: "6.5.3"
      },
      _requiredBy: ["/browserify-sign", "/create-ecdh"],
      _resolved: "https://registry.npmjs.org/elliptic/-/elliptic-6.5.3.tgz",
      _spec: "6.5.3",
      _where: "/Users/numberwolf/Documents/webroot/VideoMissile/h265web.js-wasm-decoder",
      author: {
        name: "Fedor Indutny",
        email: "fedor@indutny.com"
      },
      bugs: {
        url: "https://github.com/indutny/elliptic/issues"
      },
      dependencies: {
        "bn.js": "^4.4.0",
        brorand: "^1.0.1",
        "hash.js": "^1.0.0",
        "hmac-drbg": "^1.0.0",
        inherits: "^2.0.1",
        "minimalistic-assert": "^1.0.0",
        "minimalistic-crypto-utils": "^1.0.0"
      },
      description: "EC cryptography",
      devDependencies: {
        brfs: "^1.4.3",
        coveralls: "^3.0.8",
        grunt: "^1.0.4",
        "grunt-browserify": "^5.0.0",
        "grunt-cli": "^1.2.0",
        "grunt-contrib-connect": "^1.0.0",
        "grunt-contrib-copy": "^1.0.0",
        "grunt-contrib-uglify": "^1.0.1",
        "grunt-mocha-istanbul": "^3.0.1",
        "grunt-saucelabs": "^9.0.1",
        istanbul: "^0.4.2",
        jscs: "^3.0.7",
        jshint: "^2.10.3",
        mocha: "^6.2.2"
      },
      files: ["lib"],
      homepage: "https://github.com/indutny/elliptic",
      keywords: ["EC", "Elliptic", "curve", "Cryptography"],
      license: "MIT",
      main: "lib/elliptic.js",
      name: "elliptic",
      repository: {
        type: "git",
        url: "git+ssh://git@github.com/indutny/elliptic.git"
      },
      scripts: {
        jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
        jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
        lint: "npm run jscs && npm run jshint",
        test: "npm run lint && npm run unit",
        unit: "istanbul test _mocha --reporter=spec test/index.js",
        version: "grunt dist && git add dist/"
      },
      version: "6.5.3"
    };
  }, {}],
  103: [function (e, t, r) {
    var n = Object.create || function (e) {
      var t = function t() {};

      return t.prototype = e, new t();
    },
        i = Object.keys || function (e) {
      var t = [];

      for (var r in e) {
        Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
      }

      return r;
    },
        o = Function.prototype.bind || function (e) {
      var t = this;
      return function () {
        return t.apply(e, arguments);
      };
    };

    function a() {
      this._events && Object.prototype.hasOwnProperty.call(this, "_events") || (this._events = n(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    }

    t.exports = a, a.EventEmitter = a, a.prototype._events = void 0, a.prototype._maxListeners = void 0;
    var s,
        f = 10;

    try {
      var u = {};
      Object.defineProperty && Object.defineProperty(u, "x", {
        value: 0
      }), s = 0 === u.x;
    } catch (e) {
      s = !1;
    }

    function c(e) {
      return void 0 === e._maxListeners ? a.defaultMaxListeners : e._maxListeners;
    }

    function h(e, t, r) {
      if (t) e.call(r);else for (var n = e.length, i = _(e, n), o = 0; o < n; ++o) {
        i[o].call(r);
      }
    }

    function d(e, t, r, n) {
      if (t) e.call(r, n);else for (var i = e.length, o = _(e, i), a = 0; a < i; ++a) {
        o[a].call(r, n);
      }
    }

    function l(e, t, r, n, i) {
      if (t) e.call(r, n, i);else for (var o = e.length, a = _(e, o), s = 0; s < o; ++s) {
        a[s].call(r, n, i);
      }
    }

    function p(e, t, r, n, i, o) {
      if (t) e.call(r, n, i, o);else for (var a = e.length, s = _(e, a), f = 0; f < a; ++f) {
        s[f].call(r, n, i, o);
      }
    }

    function b(e, t, r, n) {
      if (t) e.apply(r, n);else for (var i = e.length, o = _(e, i), a = 0; a < i; ++a) {
        o[a].apply(r, n);
      }
    }

    function m(e, t, r, i) {
      var o, a, s;
      if ("function" != typeof r) throw new TypeError('"listener" argument must be a function');

      if ((a = e._events) ? (a.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), a = e._events), s = a[t]) : (a = e._events = n(null), e._eventsCount = 0), s) {
        if ("function" == typeof s ? s = a[t] = i ? [r, s] : [s, r] : i ? s.unshift(r) : s.push(r), !s.warned && (o = c(e)) && o > 0 && s.length > o) {
          s.warned = !0;
          var f = new Error("Possible EventEmitter memory leak detected. " + s.length + ' "' + String(t) + '" listeners added. Use emitter.setMaxListeners() to increase limit.');
          f.name = "MaxListenersExceededWarning", f.emitter = e, f.type = t, f.count = s.length, "object" == (typeof console === "undefined" ? "undefined" : _typeof(console)) && console.warn && console.warn("%s: %s", f.name, f.message);
        }
      } else s = a[t] = r, ++e._eventsCount;

      return e;
    }

    function y() {
      if (!this.fired) switch (this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length) {
        case 0:
          return this.listener.call(this.target);

        case 1:
          return this.listener.call(this.target, arguments[0]);

        case 2:
          return this.listener.call(this.target, arguments[0], arguments[1]);

        case 3:
          return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);

        default:
          for (var e = new Array(arguments.length), t = 0; t < e.length; ++t) {
            e[t] = arguments[t];
          }

          this.listener.apply(this.target, e);
      }
    }

    function g(e, t, r) {
      var n = {
        fired: !1,
        wrapFn: void 0,
        target: e,
        type: t,
        listener: r
      },
          i = o.call(y, n);
      return i.listener = r, n.wrapFn = i, i;
    }

    function v(e, t, r) {
      var n = e._events;
      if (!n) return [];
      var i = n[t];
      return i ? "function" == typeof i ? r ? [i.listener || i] : [i] : r ? function (e) {
        for (var t = new Array(e.length), r = 0; r < t.length; ++r) {
          t[r] = e[r].listener || e[r];
        }

        return t;
      }(i) : _(i, i.length) : [];
    }

    function w(e) {
      var t = this._events;

      if (t) {
        var r = t[e];
        if ("function" == typeof r) return 1;
        if (r) return r.length;
      }

      return 0;
    }

    function _(e, t) {
      for (var r = new Array(t), n = 0; n < t; ++n) {
        r[n] = e[n];
      }

      return r;
    }

    s ? Object.defineProperty(a, "defaultMaxListeners", {
      enumerable: !0,
      get: function get() {
        return f;
      },
      set: function set(e) {
        if ("number" != typeof e || e < 0 || e != e) throw new TypeError('"defaultMaxListeners" must be a positive number');
        f = e;
      }
    }) : a.defaultMaxListeners = f, a.prototype.setMaxListeners = function (e) {
      if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError('"n" argument must be a positive number');
      return this._maxListeners = e, this;
    }, a.prototype.getMaxListeners = function () {
      return c(this);
    }, a.prototype.emit = function (e) {
      var t,
          r,
          n,
          i,
          o,
          a,
          s = "error" === e;
      if (a = this._events) s = s && null == a.error;else if (!s) return !1;

      if (s) {
        if (arguments.length > 1 && (t = arguments[1]), t instanceof Error) throw t;
        var f = new Error('Unhandled "error" event. (' + t + ")");
        throw f.context = t, f;
      }

      if (!(r = a[e])) return !1;
      var u = "function" == typeof r;

      switch (n = arguments.length) {
        case 1:
          h(r, u, this);
          break;

        case 2:
          d(r, u, this, arguments[1]);
          break;

        case 3:
          l(r, u, this, arguments[1], arguments[2]);
          break;

        case 4:
          p(r, u, this, arguments[1], arguments[2], arguments[3]);
          break;

        default:
          for (i = new Array(n - 1), o = 1; o < n; o++) {
            i[o - 1] = arguments[o];
          }

          b(r, u, this, i);
      }

      return !0;
    }, a.prototype.addListener = function (e, t) {
      return m(this, e, t, !1);
    }, a.prototype.on = a.prototype.addListener, a.prototype.prependListener = function (e, t) {
      return m(this, e, t, !0);
    }, a.prototype.once = function (e, t) {
      if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
      return this.on(e, g(this, e, t)), this;
    }, a.prototype.prependOnceListener = function (e, t) {
      if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
      return this.prependListener(e, g(this, e, t)), this;
    }, a.prototype.removeListener = function (e, t) {
      var r, i, o, a, s;
      if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
      if (!(i = this._events)) return this;
      if (!(r = i[e])) return this;
      if (r === t || r.listener === t) 0 == --this._eventsCount ? this._events = n(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, r.listener || t));else if ("function" != typeof r) {
        for (o = -1, a = r.length - 1; a >= 0; a--) {
          if (r[a] === t || r[a].listener === t) {
            s = r[a].listener, o = a;
            break;
          }
        }

        if (o < 0) return this;
        0 === o ? r.shift() : function (e, t) {
          for (var r = t, n = r + 1, i = e.length; n < i; r += 1, n += 1) {
            e[r] = e[n];
          }

          e.pop();
        }(r, o), 1 === r.length && (i[e] = r[0]), i.removeListener && this.emit("removeListener", e, s || t);
      }
      return this;
    }, a.prototype.removeAllListeners = function (e) {
      var t, r, o;
      if (!(r = this._events)) return this;
      if (!r.removeListener) return 0 === arguments.length ? (this._events = n(null), this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = n(null) : delete r[e]), this;

      if (0 === arguments.length) {
        var a,
            s = i(r);

        for (o = 0; o < s.length; ++o) {
          "removeListener" !== (a = s[o]) && this.removeAllListeners(a);
        }

        return this.removeAllListeners("removeListener"), this._events = n(null), this._eventsCount = 0, this;
      }

      if ("function" == typeof (t = r[e])) this.removeListener(e, t);else if (t) for (o = t.length - 1; o >= 0; o--) {
        this.removeListener(e, t[o]);
      }
      return this;
    }, a.prototype.listeners = function (e) {
      return v(this, e, !0);
    }, a.prototype.rawListeners = function (e) {
      return v(this, e, !1);
    }, a.listenerCount = function (e, t) {
      return "function" == typeof e.listenerCount ? e.listenerCount(t) : w.call(e, t);
    }, a.prototype.listenerCount = w, a.prototype.eventNames = function () {
      return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
    };
  }, {}],
  104: [function (e, t, r) {
    var n = e("safe-buffer").Buffer,
        i = e("md5.js");

    t.exports = function (e, t, r, o) {
      if (n.isBuffer(e) || (e = n.from(e, "binary")), t && (n.isBuffer(t) || (t = n.from(t, "binary")), 8 !== t.length)) throw new RangeError("salt should be Buffer with 8 byte length");

      for (var a = r / 8, s = n.alloc(a), f = n.alloc(o || 0), u = n.alloc(0); a > 0 || o > 0;) {
        var c = new i();
        c.update(u), c.update(e), t && c.update(t), u = c.digest();
        var h = 0;

        if (a > 0) {
          var d = s.length - a;
          h = Math.min(a, u.length), u.copy(s, d, 0, h), a -= h;
        }

        if (h < u.length && o > 0) {
          var l = f.length - o,
              p = Math.min(o, u.length - h);
          u.copy(f, l, h, h + p), o -= p;
        }
      }

      return u.fill(0), {
        key: s,
        iv: f
      };
    };
  }, {
    "md5.js": 138,
    "safe-buffer": 182
  }],
  105: [function (e, t, r) {
    "use strict";

    var n = e("safe-buffer").Buffer,
        i = e("readable-stream").Transform;

    function o(e) {
      i.call(this), this._block = n.allocUnsafe(e), this._blockSize = e, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
    }

    e("inherits")(o, i), o.prototype._transform = function (e, t, r) {
      var n = null;

      try {
        this.update(e, t);
      } catch (e) {
        n = e;
      }

      r(n);
    }, o.prototype._flush = function (e) {
      var t = null;

      try {
        this.push(this.digest());
      } catch (e) {
        t = e;
      }

      e(t);
    }, o.prototype.update = function (e, t) {
      if (function (e, t) {
        if (!n.isBuffer(e) && "string" != typeof e) throw new TypeError(t + " must be a string or a buffer");
      }(e, "Data"), this._finalized) throw new Error("Digest already called");
      n.isBuffer(e) || (e = n.from(e, t));

      for (var r = this._block, i = 0; this._blockOffset + e.length - i >= this._blockSize;) {
        for (var o = this._blockOffset; o < this._blockSize;) {
          r[o++] = e[i++];
        }

        this._update(), this._blockOffset = 0;
      }

      for (; i < e.length;) {
        r[this._blockOffset++] = e[i++];
      }

      for (var a = 0, s = 8 * e.length; s > 0; ++a) {
        this._length[a] += s, (s = this._length[a] / 4294967296 | 0) > 0 && (this._length[a] -= 4294967296 * s);
      }

      return this;
    }, o.prototype._update = function () {
      throw new Error("_update is not implemented");
    }, o.prototype.digest = function (e) {
      if (this._finalized) throw new Error("Digest already called");
      this._finalized = !0;

      var t = this._digest();

      void 0 !== e && (t = t.toString(e)), this._block.fill(0), this._blockOffset = 0;

      for (var r = 0; r < 4; ++r) {
        this._length[r] = 0;
      }

      return t;
    }, o.prototype._digest = function () {
      throw new Error("_digest is not implemented");
    }, t.exports = o;
  }, {
    inherits: 135,
    "readable-stream": 120,
    "safe-buffer": 182
  }],
  106: [function (e, t, r) {
    arguments[4][48][0].apply(r, arguments);
  }, {
    dup: 48
  }],
  107: [function (e, t, r) {
    arguments[4][49][0].apply(r, arguments);
  }, {
    "./_stream_readable": 109,
    "./_stream_writable": 111,
    _process: 156,
    dup: 49,
    inherits: 135
  }],
  108: [function (e, t, r) {
    arguments[4][50][0].apply(r, arguments);
  }, {
    "./_stream_transform": 110,
    dup: 50,
    inherits: 135
  }],
  109: [function (e, t, r) {
    arguments[4][51][0].apply(r, arguments);
  }, {
    "../errors": 106,
    "./_stream_duplex": 107,
    "./internal/streams/async_iterator": 112,
    "./internal/streams/buffer_list": 113,
    "./internal/streams/destroy": 114,
    "./internal/streams/from": 116,
    "./internal/streams/state": 118,
    "./internal/streams/stream": 119,
    _process: 156,
    buffer: 65,
    dup: 51,
    events: 103,
    inherits: 135,
    "string_decoder/": 193,
    util: 19
  }],
  110: [function (e, t, r) {
    arguments[4][52][0].apply(r, arguments);
  }, {
    "../errors": 106,
    "./_stream_duplex": 107,
    dup: 52,
    inherits: 135
  }],
  111: [function (e, t, r) {
    arguments[4][53][0].apply(r, arguments);
  }, {
    "../errors": 106,
    "./_stream_duplex": 107,
    "./internal/streams/destroy": 114,
    "./internal/streams/state": 118,
    "./internal/streams/stream": 119,
    _process: 156,
    buffer: 65,
    dup: 53,
    inherits: 135,
    "util-deprecate": 195
  }],
  112: [function (e, t, r) {
    arguments[4][54][0].apply(r, arguments);
  }, {
    "./end-of-stream": 115,
    _process: 156,
    dup: 54
  }],
  113: [function (e, t, r) {
    arguments[4][55][0].apply(r, arguments);
  }, {
    buffer: 65,
    dup: 55,
    util: 19
  }],
  114: [function (e, t, r) {
    arguments[4][56][0].apply(r, arguments);
  }, {
    _process: 156,
    dup: 56
  }],
  115: [function (e, t, r) {
    arguments[4][57][0].apply(r, arguments);
  }, {
    "../../../errors": 106,
    dup: 57
  }],
  116: [function (e, t, r) {
    arguments[4][58][0].apply(r, arguments);
  }, {
    dup: 58
  }],
  117: [function (e, t, r) {
    arguments[4][59][0].apply(r, arguments);
  }, {
    "../../../errors": 106,
    "./end-of-stream": 115,
    dup: 59
  }],
  118: [function (e, t, r) {
    arguments[4][60][0].apply(r, arguments);
  }, {
    "../../../errors": 106,
    dup: 60
  }],
  119: [function (e, t, r) {
    arguments[4][61][0].apply(r, arguments);
  }, {
    dup: 61,
    events: 103
  }],
  120: [function (e, t, r) {
    arguments[4][62][0].apply(r, arguments);
  }, {
    "./lib/_stream_duplex.js": 107,
    "./lib/_stream_passthrough.js": 108,
    "./lib/_stream_readable.js": 109,
    "./lib/_stream_transform.js": 110,
    "./lib/_stream_writable.js": 111,
    "./lib/internal/streams/end-of-stream.js": 115,
    "./lib/internal/streams/pipeline.js": 117,
    dup: 62
  }],
  121: [function (e, t, r) {
    var n = r;
    n.utils = e("./hash/utils"), n.common = e("./hash/common"), n.sha = e("./hash/sha"), n.ripemd = e("./hash/ripemd"), n.hmac = e("./hash/hmac"), n.sha1 = n.sha.sha1, n.sha256 = n.sha.sha256, n.sha224 = n.sha.sha224, n.sha384 = n.sha.sha384, n.sha512 = n.sha.sha512, n.ripemd160 = n.ripemd.ripemd160;
  }, {
    "./hash/common": 122,
    "./hash/hmac": 123,
    "./hash/ripemd": 124,
    "./hash/sha": 125,
    "./hash/utils": 132
  }],
  122: [function (e, t, r) {
    "use strict";

    var n = e("./utils"),
        i = e("minimalistic-assert");

    function o() {
      this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
    }

    r.BlockHash = o, o.prototype.update = function (e, t) {
      if (e = n.toArray(e, t), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
        var r = (e = this.pending).length % this._delta8;
        this.pending = e.slice(e.length - r, e.length), 0 === this.pending.length && (this.pending = null), e = n.join32(e, 0, e.length - r, this.endian);

        for (var i = 0; i < e.length; i += this._delta32) {
          this._update(e, i, i + this._delta32);
        }
      }

      return this;
    }, o.prototype.digest = function (e) {
      return this.update(this._pad()), i(null === this.pending), this._digest(e);
    }, o.prototype._pad = function () {
      var e = this.pendingTotal,
          t = this._delta8,
          r = t - (e + this.padLength) % t,
          n = new Array(r + this.padLength);
      n[0] = 128;

      for (var i = 1; i < r; i++) {
        n[i] = 0;
      }

      if (e <<= 3, "big" === this.endian) {
        for (var o = 8; o < this.padLength; o++) {
          n[i++] = 0;
        }

        n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = e >>> 24 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 8 & 255, n[i++] = 255 & e;
      } else for (n[i++] = 255 & e, n[i++] = e >>> 8 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 24 & 255, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0, o = 8; o < this.padLength; o++) {
        n[i++] = 0;
      }

      return n;
    };
  }, {
    "./utils": 132,
    "minimalistic-assert": 141
  }],
  123: [function (e, t, r) {
    "use strict";

    var n = e("./utils"),
        i = e("minimalistic-assert");

    function o(e, t, r) {
      if (!(this instanceof o)) return new o(e, t, r);
      this.Hash = e, this.blockSize = e.blockSize / 8, this.outSize = e.outSize / 8, this.inner = null, this.outer = null, this._init(n.toArray(t, r));
    }

    t.exports = o, o.prototype._init = function (e) {
      e.length > this.blockSize && (e = new this.Hash().update(e).digest()), i(e.length <= this.blockSize);

      for (var t = e.length; t < this.blockSize; t++) {
        e.push(0);
      }

      for (t = 0; t < e.length; t++) {
        e[t] ^= 54;
      }

      for (this.inner = new this.Hash().update(e), t = 0; t < e.length; t++) {
        e[t] ^= 106;
      }

      this.outer = new this.Hash().update(e);
    }, o.prototype.update = function (e, t) {
      return this.inner.update(e, t), this;
    }, o.prototype.digest = function (e) {
      return this.outer.update(this.inner.digest()), this.outer.digest(e);
    };
  }, {
    "./utils": 132,
    "minimalistic-assert": 141
  }],
  124: [function (e, t, r) {
    "use strict";

    var n = e("./utils"),
        i = e("./common"),
        o = n.rotl32,
        a = n.sum32,
        s = n.sum32_3,
        f = n.sum32_4,
        u = i.BlockHash;

    function c() {
      if (!(this instanceof c)) return new c();
      u.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
    }

    function h(e, t, r, n) {
      return e <= 15 ? t ^ r ^ n : e <= 31 ? t & r | ~t & n : e <= 47 ? (t | ~r) ^ n : e <= 63 ? t & n | r & ~n : t ^ (r | ~n);
    }

    function d(e) {
      return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838;
    }

    function l(e) {
      return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0;
    }

    n.inherits(c, u), r.ripemd160 = c, c.blockSize = 512, c.outSize = 160, c.hmacStrength = 192, c.padLength = 64, c.prototype._update = function (e, t) {
      for (var r = this.h[0], n = this.h[1], i = this.h[2], u = this.h[3], c = this.h[4], g = r, v = n, w = i, _ = u, E = c, M = 0; M < 80; M++) {
        var S = a(o(f(r, h(M, n, i, u), e[p[M] + t], d(M)), m[M]), c);
        r = c, c = u, u = o(i, 10), i = n, n = S, S = a(o(f(g, h(79 - M, v, w, _), e[b[M] + t], l(M)), y[M]), E), g = E, E = _, _ = o(w, 10), w = v, v = S;
      }

      S = s(this.h[1], i, _), this.h[1] = s(this.h[2], u, E), this.h[2] = s(this.h[3], c, g), this.h[3] = s(this.h[4], r, v), this.h[4] = s(this.h[0], n, w), this.h[0] = S;
    }, c.prototype._digest = function (e) {
      return "hex" === e ? n.toHex32(this.h, "little") : n.split32(this.h, "little");
    };
    var p = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
        b = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
        m = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
        y = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];
  }, {
    "./common": 122,
    "./utils": 132
  }],
  125: [function (e, t, r) {
    "use strict";

    r.sha1 = e("./sha/1"), r.sha224 = e("./sha/224"), r.sha256 = e("./sha/256"), r.sha384 = e("./sha/384"), r.sha512 = e("./sha/512");
  }, {
    "./sha/1": 126,
    "./sha/224": 127,
    "./sha/256": 128,
    "./sha/384": 129,
    "./sha/512": 130
  }],
  126: [function (e, t, r) {
    "use strict";

    var n = e("../utils"),
        i = e("../common"),
        o = e("./common"),
        a = n.rotl32,
        s = n.sum32,
        f = n.sum32_5,
        u = o.ft_1,
        c = i.BlockHash,
        h = [1518500249, 1859775393, 2400959708, 3395469782];

    function d() {
      if (!(this instanceof d)) return new d();
      c.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.W = new Array(80);
    }

    n.inherits(d, c), t.exports = d, d.blockSize = 512, d.outSize = 160, d.hmacStrength = 80, d.padLength = 64, d.prototype._update = function (e, t) {
      for (var r = this.W, n = 0; n < 16; n++) {
        r[n] = e[t + n];
      }

      for (; n < r.length; n++) {
        r[n] = a(r[n - 3] ^ r[n - 8] ^ r[n - 14] ^ r[n - 16], 1);
      }

      var i = this.h[0],
          o = this.h[1],
          c = this.h[2],
          d = this.h[3],
          l = this.h[4];

      for (n = 0; n < r.length; n++) {
        var p = ~~(n / 20),
            b = f(a(i, 5), u(p, o, c, d), l, r[n], h[p]);
        l = d, d = c, c = a(o, 30), o = i, i = b;
      }

      this.h[0] = s(this.h[0], i), this.h[1] = s(this.h[1], o), this.h[2] = s(this.h[2], c), this.h[3] = s(this.h[3], d), this.h[4] = s(this.h[4], l);
    }, d.prototype._digest = function (e) {
      return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big");
    };
  }, {
    "../common": 122,
    "../utils": 132,
    "./common": 131
  }],
  127: [function (e, t, r) {
    "use strict";

    var n = e("../utils"),
        i = e("./256");

    function o() {
      if (!(this instanceof o)) return new o();
      i.call(this), this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428];
    }

    n.inherits(o, i), t.exports = o, o.blockSize = 512, o.outSize = 224, o.hmacStrength = 192, o.padLength = 64, o.prototype._digest = function (e) {
      return "hex" === e ? n.toHex32(this.h.slice(0, 7), "big") : n.split32(this.h.slice(0, 7), "big");
    };
  }, {
    "../utils": 132,
    "./256": 128
  }],
  128: [function (e, t, r) {
    "use strict";

    var n = e("../utils"),
        i = e("../common"),
        o = e("./common"),
        a = e("minimalistic-assert"),
        s = n.sum32,
        f = n.sum32_4,
        u = n.sum32_5,
        c = o.ch32,
        h = o.maj32,
        d = o.s0_256,
        l = o.s1_256,
        p = o.g0_256,
        b = o.g1_256,
        m = i.BlockHash,
        y = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];

    function g() {
      if (!(this instanceof g)) return new g();
      m.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = y, this.W = new Array(64);
    }

    n.inherits(g, m), t.exports = g, g.blockSize = 512, g.outSize = 256, g.hmacStrength = 192, g.padLength = 64, g.prototype._update = function (e, t) {
      for (var r = this.W, n = 0; n < 16; n++) {
        r[n] = e[t + n];
      }

      for (; n < r.length; n++) {
        r[n] = f(b(r[n - 2]), r[n - 7], p(r[n - 15]), r[n - 16]);
      }

      var i = this.h[0],
          o = this.h[1],
          m = this.h[2],
          y = this.h[3],
          g = this.h[4],
          v = this.h[5],
          w = this.h[6],
          _ = this.h[7];

      for (a(this.k.length === r.length), n = 0; n < r.length; n++) {
        var E = u(_, l(g), c(g, v, w), this.k[n], r[n]),
            M = s(d(i), h(i, o, m));
        _ = w, w = v, v = g, g = s(y, E), y = m, m = o, o = i, i = s(E, M);
      }

      this.h[0] = s(this.h[0], i), this.h[1] = s(this.h[1], o), this.h[2] = s(this.h[2], m), this.h[3] = s(this.h[3], y), this.h[4] = s(this.h[4], g), this.h[5] = s(this.h[5], v), this.h[6] = s(this.h[6], w), this.h[7] = s(this.h[7], _);
    }, g.prototype._digest = function (e) {
      return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big");
    };
  }, {
    "../common": 122,
    "../utils": 132,
    "./common": 131,
    "minimalistic-assert": 141
  }],
  129: [function (e, t, r) {
    "use strict";

    var n = e("../utils"),
        i = e("./512");

    function o() {
      if (!(this instanceof o)) return new o();
      i.call(this), this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428];
    }

    n.inherits(o, i), t.exports = o, o.blockSize = 1024, o.outSize = 384, o.hmacStrength = 192, o.padLength = 128, o.prototype._digest = function (e) {
      return "hex" === e ? n.toHex32(this.h.slice(0, 12), "big") : n.split32(this.h.slice(0, 12), "big");
    };
  }, {
    "../utils": 132,
    "./512": 130
  }],
  130: [function (e, t, r) {
    "use strict";

    var n = e("../utils"),
        i = e("../common"),
        o = e("minimalistic-assert"),
        a = n.rotr64_hi,
        s = n.rotr64_lo,
        f = n.shr64_hi,
        u = n.shr64_lo,
        c = n.sum64,
        h = n.sum64_hi,
        d = n.sum64_lo,
        l = n.sum64_4_hi,
        p = n.sum64_4_lo,
        b = n.sum64_5_hi,
        m = n.sum64_5_lo,
        y = i.BlockHash,
        g = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];

    function v() {
      if (!(this instanceof v)) return new v();
      y.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = g, this.W = new Array(160);
    }

    function w(e, t, r, n, i) {
      var o = e & r ^ ~e & i;
      return o < 0 && (o += 4294967296), o;
    }

    function _(e, t, r, n, i, o) {
      var a = t & n ^ ~t & o;
      return a < 0 && (a += 4294967296), a;
    }

    function E(e, t, r, n, i) {
      var o = e & r ^ e & i ^ r & i;
      return o < 0 && (o += 4294967296), o;
    }

    function M(e, t, r, n, i, o) {
      var a = t & n ^ t & o ^ n & o;
      return a < 0 && (a += 4294967296), a;
    }

    function S(e, t) {
      var r = a(e, t, 28) ^ a(t, e, 2) ^ a(t, e, 7);
      return r < 0 && (r += 4294967296), r;
    }

    function k(e, t) {
      var r = s(e, t, 28) ^ s(t, e, 2) ^ s(t, e, 7);
      return r < 0 && (r += 4294967296), r;
    }

    function A(e, t) {
      var r = a(e, t, 14) ^ a(e, t, 18) ^ a(t, e, 9);
      return r < 0 && (r += 4294967296), r;
    }

    function x(e, t) {
      var r = s(e, t, 14) ^ s(e, t, 18) ^ s(t, e, 9);
      return r < 0 && (r += 4294967296), r;
    }

    function R(e, t) {
      var r = a(e, t, 1) ^ a(e, t, 8) ^ f(e, t, 7);
      return r < 0 && (r += 4294967296), r;
    }

    function I(e, t) {
      var r = s(e, t, 1) ^ s(e, t, 8) ^ u(e, t, 7);
      return r < 0 && (r += 4294967296), r;
    }

    function B(e, t) {
      var r = a(e, t, 19) ^ a(t, e, 29) ^ f(e, t, 6);
      return r < 0 && (r += 4294967296), r;
    }

    function T(e, t) {
      var r = s(e, t, 19) ^ s(t, e, 29) ^ u(e, t, 6);
      return r < 0 && (r += 4294967296), r;
    }

    n.inherits(v, y), t.exports = v, v.blockSize = 1024, v.outSize = 512, v.hmacStrength = 192, v.padLength = 128, v.prototype._prepareBlock = function (e, t) {
      for (var r = this.W, n = 0; n < 32; n++) {
        r[n] = e[t + n];
      }

      for (; n < r.length; n += 2) {
        var i = B(r[n - 4], r[n - 3]),
            o = T(r[n - 4], r[n - 3]),
            a = r[n - 14],
            s = r[n - 13],
            f = R(r[n - 30], r[n - 29]),
            u = I(r[n - 30], r[n - 29]),
            c = r[n - 32],
            h = r[n - 31];
        r[n] = l(i, o, a, s, f, u, c, h), r[n + 1] = p(i, o, a, s, f, u, c, h);
      }
    }, v.prototype._update = function (e, t) {
      this._prepareBlock(e, t);

      var r = this.W,
          n = this.h[0],
          i = this.h[1],
          a = this.h[2],
          s = this.h[3],
          f = this.h[4],
          u = this.h[5],
          l = this.h[6],
          p = this.h[7],
          y = this.h[8],
          g = this.h[9],
          v = this.h[10],
          R = this.h[11],
          I = this.h[12],
          B = this.h[13],
          T = this.h[14],
          j = this.h[15];
      o(this.k.length === r.length);

      for (var D = 0; D < r.length; D += 2) {
        var P = T,
            O = j,
            C = A(y, g),
            L = x(y, g),
            N = w(y, g, v, R, I),
            U = _(y, g, v, R, I, B),
            q = this.k[D],
            z = this.k[D + 1],
            F = r[D],
            H = r[D + 1],
            K = b(P, O, C, L, N, U, q, z, F, H),
            W = m(P, O, C, L, N, U, q, z, F, H);

        P = S(n, i), O = k(n, i), C = E(n, i, a, s, f), L = M(n, i, a, s, f, u);
        var V = h(P, O, C, L),
            X = d(P, O, C, L);
        T = I, j = B, I = v, B = R, v = y, R = g, y = h(l, p, K, W), g = d(p, p, K, W), l = f, p = u, f = a, u = s, a = n, s = i, n = h(K, W, V, X), i = d(K, W, V, X);
      }

      c(this.h, 0, n, i), c(this.h, 2, a, s), c(this.h, 4, f, u), c(this.h, 6, l, p), c(this.h, 8, y, g), c(this.h, 10, v, R), c(this.h, 12, I, B), c(this.h, 14, T, j);
    }, v.prototype._digest = function (e) {
      return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big");
    };
  }, {
    "../common": 122,
    "../utils": 132,
    "minimalistic-assert": 141
  }],
  131: [function (e, t, r) {
    "use strict";

    var n = e("../utils").rotr32;

    function i(e, t, r) {
      return e & t ^ ~e & r;
    }

    function o(e, t, r) {
      return e & t ^ e & r ^ t & r;
    }

    function a(e, t, r) {
      return e ^ t ^ r;
    }

    r.ft_1 = function (e, t, r, n) {
      return 0 === e ? i(t, r, n) : 1 === e || 3 === e ? a(t, r, n) : 2 === e ? o(t, r, n) : void 0;
    }, r.ch32 = i, r.maj32 = o, r.p32 = a, r.s0_256 = function (e) {
      return n(e, 2) ^ n(e, 13) ^ n(e, 22);
    }, r.s1_256 = function (e) {
      return n(e, 6) ^ n(e, 11) ^ n(e, 25);
    }, r.g0_256 = function (e) {
      return n(e, 7) ^ n(e, 18) ^ e >>> 3;
    }, r.g1_256 = function (e) {
      return n(e, 17) ^ n(e, 19) ^ e >>> 10;
    };
  }, {
    "../utils": 132
  }],
  132: [function (e, t, r) {
    "use strict";

    var n = e("minimalistic-assert"),
        i = e("inherits");

    function o(e, t) {
      return 55296 == (64512 & e.charCodeAt(t)) && !(t < 0 || t + 1 >= e.length) && 56320 == (64512 & e.charCodeAt(t + 1));
    }

    function a(e) {
      return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0;
    }

    function s(e) {
      return 1 === e.length ? "0" + e : e;
    }

    function f(e) {
      return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e;
    }

    r.inherits = i, r.toArray = function (e, t) {
      if (Array.isArray(e)) return e.slice();
      if (!e) return [];
      var r = [];
      if ("string" == typeof e) {
        if (t) {
          if ("hex" === t) for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), i = 0; i < e.length; i += 2) {
            r.push(parseInt(e[i] + e[i + 1], 16));
          }
        } else for (var n = 0, i = 0; i < e.length; i++) {
          var a = e.charCodeAt(i);
          a < 128 ? r[n++] = a : a < 2048 ? (r[n++] = a >> 6 | 192, r[n++] = 63 & a | 128) : o(e, i) ? (a = 65536 + ((1023 & a) << 10) + (1023 & e.charCodeAt(++i)), r[n++] = a >> 18 | 240, r[n++] = a >> 12 & 63 | 128, r[n++] = a >> 6 & 63 | 128, r[n++] = 63 & a | 128) : (r[n++] = a >> 12 | 224, r[n++] = a >> 6 & 63 | 128, r[n++] = 63 & a | 128);
        }
      } else for (i = 0; i < e.length; i++) {
        r[i] = 0 | e[i];
      }
      return r;
    }, r.toHex = function (e) {
      for (var t = "", r = 0; r < e.length; r++) {
        t += s(e[r].toString(16));
      }

      return t;
    }, r.htonl = a, r.toHex32 = function (e, t) {
      for (var r = "", n = 0; n < e.length; n++) {
        var i = e[n];
        "little" === t && (i = a(i)), r += f(i.toString(16));
      }

      return r;
    }, r.zero2 = s, r.zero8 = f, r.join32 = function (e, t, r, i) {
      var o = r - t;
      n(o % 4 == 0);

      for (var a = new Array(o / 4), s = 0, f = t; s < a.length; s++, f += 4) {
        var u;
        u = "big" === i ? e[f] << 24 | e[f + 1] << 16 | e[f + 2] << 8 | e[f + 3] : e[f + 3] << 24 | e[f + 2] << 16 | e[f + 1] << 8 | e[f], a[s] = u >>> 0;
      }

      return a;
    }, r.split32 = function (e, t) {
      for (var r = new Array(4 * e.length), n = 0, i = 0; n < e.length; n++, i += 4) {
        var o = e[n];
        "big" === t ? (r[i] = o >>> 24, r[i + 1] = o >>> 16 & 255, r[i + 2] = o >>> 8 & 255, r[i + 3] = 255 & o) : (r[i + 3] = o >>> 24, r[i + 2] = o >>> 16 & 255, r[i + 1] = o >>> 8 & 255, r[i] = 255 & o);
      }

      return r;
    }, r.rotr32 = function (e, t) {
      return e >>> t | e << 32 - t;
    }, r.rotl32 = function (e, t) {
      return e << t | e >>> 32 - t;
    }, r.sum32 = function (e, t) {
      return e + t >>> 0;
    }, r.sum32_3 = function (e, t, r) {
      return e + t + r >>> 0;
    }, r.sum32_4 = function (e, t, r, n) {
      return e + t + r + n >>> 0;
    }, r.sum32_5 = function (e, t, r, n, i) {
      return e + t + r + n + i >>> 0;
    }, r.sum64 = function (e, t, r, n) {
      var i = e[t],
          o = n + e[t + 1] >>> 0,
          a = (o < n ? 1 : 0) + r + i;
      e[t] = a >>> 0, e[t + 1] = o;
    }, r.sum64_hi = function (e, t, r, n) {
      return (t + n >>> 0 < t ? 1 : 0) + e + r >>> 0;
    }, r.sum64_lo = function (e, t, r, n) {
      return t + n >>> 0;
    }, r.sum64_4_hi = function (e, t, r, n, i, o, a, s) {
      var f = 0,
          u = t;
      return f += (u = u + n >>> 0) < t ? 1 : 0, f += (u = u + o >>> 0) < o ? 1 : 0, e + r + i + a + (f += (u = u + s >>> 0) < s ? 1 : 0) >>> 0;
    }, r.sum64_4_lo = function (e, t, r, n, i, o, a, s) {
      return t + n + o + s >>> 0;
    }, r.sum64_5_hi = function (e, t, r, n, i, o, a, s, f, u) {
      var c = 0,
          h = t;
      return c += (h = h + n >>> 0) < t ? 1 : 0, c += (h = h + o >>> 0) < o ? 1 : 0, c += (h = h + s >>> 0) < s ? 1 : 0, e + r + i + a + f + (c += (h = h + u >>> 0) < u ? 1 : 0) >>> 0;
    }, r.sum64_5_lo = function (e, t, r, n, i, o, a, s, f, u) {
      return t + n + o + s + u >>> 0;
    }, r.rotr64_hi = function (e, t, r) {
      return (t << 32 - r | e >>> r) >>> 0;
    }, r.rotr64_lo = function (e, t, r) {
      return (e << 32 - r | t >>> r) >>> 0;
    }, r.shr64_hi = function (e, t, r) {
      return e >>> r;
    }, r.shr64_lo = function (e, t, r) {
      return (e << 32 - r | t >>> r) >>> 0;
    };
  }, {
    inherits: 135,
    "minimalistic-assert": 141
  }],
  133: [function (e, t, r) {
    "use strict";

    var n = e("hash.js"),
        i = e("minimalistic-crypto-utils"),
        o = e("minimalistic-assert");

    function a(e) {
      if (!(this instanceof a)) return new a(e);
      this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, this.minEntropy = e.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
      var t = i.toArray(e.entropy, e.entropyEnc || "hex"),
          r = i.toArray(e.nonce, e.nonceEnc || "hex"),
          n = i.toArray(e.pers, e.persEnc || "hex");
      o(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t, r, n);
    }

    t.exports = a, a.prototype._init = function (e, t, r) {
      var n = e.concat(t).concat(r);
      this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);

      for (var i = 0; i < this.V.length; i++) {
        this.K[i] = 0, this.V[i] = 1;
      }

      this._update(n), this._reseed = 1, this.reseedInterval = 281474976710656;
    }, a.prototype._hmac = function () {
      return new n.hmac(this.hash, this.K);
    }, a.prototype._update = function (e) {
      var t = this._hmac().update(this.V).update([0]);

      e && (t = t.update(e)), this.K = t.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([1]).update(e).digest(), this.V = this._hmac().update(this.V).digest());
    }, a.prototype.reseed = function (e, t, r, n) {
      "string" != typeof t && (n = r, r = t, t = null), e = i.toArray(e, t), r = i.toArray(r, n), o(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(e.concat(r || [])), this._reseed = 1;
    }, a.prototype.generate = function (e, t, r, n) {
      if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
      "string" != typeof t && (n = r, r = t, t = null), r && (r = i.toArray(r, n || "hex"), this._update(r));

      for (var o = []; o.length < e;) {
        this.V = this._hmac().update(this.V).digest(), o = o.concat(this.V);
      }

      var a = o.slice(0, e);
      return this._update(r), this._reseed++, i.encode(a, t);
    };
  }, {
    "hash.js": 121,
    "minimalistic-assert": 141,
    "minimalistic-crypto-utils": 142
  }],
  134: [function (e, t, r) {
    r.read = function (e, t, r, n, i) {
      var o,
          a,
          s = 8 * i - n - 1,
          f = (1 << s) - 1,
          u = f >> 1,
          c = -7,
          h = r ? i - 1 : 0,
          d = r ? -1 : 1,
          l = e[t + h];

      for (h += d, o = l & (1 << -c) - 1, l >>= -c, c += s; c > 0; o = 256 * o + e[t + h], h += d, c -= 8) {
        ;
      }

      for (a = o & (1 << -c) - 1, o >>= -c, c += n; c > 0; a = 256 * a + e[t + h], h += d, c -= 8) {
        ;
      }

      if (0 === o) o = 1 - u;else {
        if (o === f) return a ? NaN : 1 / 0 * (l ? -1 : 1);
        a += Math.pow(2, n), o -= u;
      }
      return (l ? -1 : 1) * a * Math.pow(2, o - n);
    }, r.write = function (e, t, r, n, i, o) {
      var a,
          s,
          f,
          u = 8 * o - i - 1,
          c = (1 << u) - 1,
          h = c >> 1,
          d = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
          l = n ? 0 : o - 1,
          p = n ? 1 : -1,
          b = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;

      for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = c) : (a = Math.floor(Math.log(t) / Math.LN2), t * (f = Math.pow(2, -a)) < 1 && (a--, f *= 2), (t += a + h >= 1 ? d / f : d * Math.pow(2, 1 - h)) * f >= 2 && (a++, f /= 2), a + h >= c ? (s = 0, a = c) : a + h >= 1 ? (s = (t * f - 1) * Math.pow(2, i), a += h) : (s = t * Math.pow(2, h - 1) * Math.pow(2, i), a = 0)); i >= 8; e[r + l] = 255 & s, l += p, s /= 256, i -= 8) {
        ;
      }

      for (a = a << i | s, u += i; u > 0; e[r + l] = 255 & a, l += p, a /= 256, u -= 8) {
        ;
      }

      e[r + l - p] |= 128 * b;
    };
  }, {}],
  135: [function (e, t, r) {
    "function" == typeof Object.create ? t.exports = function (e, t) {
      t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }));
    } : t.exports = function (e, t) {
      if (t) {
        e.super_ = t;

        var r = function r() {};

        r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
      }
    };
  }, {}],
  136: [function (e, t, r) {
    function n(e) {
      return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
    }
    /*!
     * Determine if an object is a Buffer
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */


    t.exports = function (e) {
      return null != e && (n(e) || function (e) {
        return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0));
      }(e) || !!e._isBuffer);
    };
  }, {}],
  137: [function (e, t, r) {
    var n = {}.toString;

    t.exports = Array.isArray || function (e) {
      return "[object Array]" == n.call(e);
    };
  }, {}],
  138: [function (e, t, r) {
    "use strict";

    var n = e("inherits"),
        i = e("hash-base"),
        o = e("safe-buffer").Buffer,
        a = new Array(16);

    function s() {
      i.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
    }

    function f(e, t) {
      return e << t | e >>> 32 - t;
    }

    function u(e, t, r, n, i, o, a) {
      return f(e + (t & r | ~t & n) + i + o | 0, a) + t | 0;
    }

    function c(e, t, r, n, i, o, a) {
      return f(e + (t & n | r & ~n) + i + o | 0, a) + t | 0;
    }

    function h(e, t, r, n, i, o, a) {
      return f(e + (t ^ r ^ n) + i + o | 0, a) + t | 0;
    }

    function d(e, t, r, n, i, o, a) {
      return f(e + (r ^ (t | ~n)) + i + o | 0, a) + t | 0;
    }

    n(s, i), s.prototype._update = function () {
      for (var e = a, t = 0; t < 16; ++t) {
        e[t] = this._block.readInt32LE(4 * t);
      }

      var r = this._a,
          n = this._b,
          i = this._c,
          o = this._d;
      r = u(r, n, i, o, e[0], 3614090360, 7), o = u(o, r, n, i, e[1], 3905402710, 12), i = u(i, o, r, n, e[2], 606105819, 17), n = u(n, i, o, r, e[3], 3250441966, 22), r = u(r, n, i, o, e[4], 4118548399, 7), o = u(o, r, n, i, e[5], 1200080426, 12), i = u(i, o, r, n, e[6], 2821735955, 17), n = u(n, i, o, r, e[7], 4249261313, 22), r = u(r, n, i, o, e[8], 1770035416, 7), o = u(o, r, n, i, e[9], 2336552879, 12), i = u(i, o, r, n, e[10], 4294925233, 17), n = u(n, i, o, r, e[11], 2304563134, 22), r = u(r, n, i, o, e[12], 1804603682, 7), o = u(o, r, n, i, e[13], 4254626195, 12), i = u(i, o, r, n, e[14], 2792965006, 17), r = c(r, n = u(n, i, o, r, e[15], 1236535329, 22), i, o, e[1], 4129170786, 5), o = c(o, r, n, i, e[6], 3225465664, 9), i = c(i, o, r, n, e[11], 643717713, 14), n = c(n, i, o, r, e[0], 3921069994, 20), r = c(r, n, i, o, e[5], 3593408605, 5), o = c(o, r, n, i, e[10], 38016083, 9), i = c(i, o, r, n, e[15], 3634488961, 14), n = c(n, i, o, r, e[4], 3889429448, 20), r = c(r, n, i, o, e[9], 568446438, 5), o = c(o, r, n, i, e[14], 3275163606, 9), i = c(i, o, r, n, e[3], 4107603335, 14), n = c(n, i, o, r, e[8], 1163531501, 20), r = c(r, n, i, o, e[13], 2850285829, 5), o = c(o, r, n, i, e[2], 4243563512, 9), i = c(i, o, r, n, e[7], 1735328473, 14), r = h(r, n = c(n, i, o, r, e[12], 2368359562, 20), i, o, e[5], 4294588738, 4), o = h(o, r, n, i, e[8], 2272392833, 11), i = h(i, o, r, n, e[11], 1839030562, 16), n = h(n, i, o, r, e[14], 4259657740, 23), r = h(r, n, i, o, e[1], 2763975236, 4), o = h(o, r, n, i, e[4], 1272893353, 11), i = h(i, o, r, n, e[7], 4139469664, 16), n = h(n, i, o, r, e[10], 3200236656, 23), r = h(r, n, i, o, e[13], 681279174, 4), o = h(o, r, n, i, e[0], 3936430074, 11), i = h(i, o, r, n, e[3], 3572445317, 16), n = h(n, i, o, r, e[6], 76029189, 23), r = h(r, n, i, o, e[9], 3654602809, 4), o = h(o, r, n, i, e[12], 3873151461, 11), i = h(i, o, r, n, e[15], 530742520, 16), r = d(r, n = h(n, i, o, r, e[2], 3299628645, 23), i, o, e[0], 4096336452, 6), o = d(o, r, n, i, e[7], 1126891415, 10), i = d(i, o, r, n, e[14], 2878612391, 15), n = d(n, i, o, r, e[5], 4237533241, 21), r = d(r, n, i, o, e[12], 1700485571, 6), o = d(o, r, n, i, e[3], 2399980690, 10), i = d(i, o, r, n, e[10], 4293915773, 15), n = d(n, i, o, r, e[1], 2240044497, 21), r = d(r, n, i, o, e[8], 1873313359, 6), o = d(o, r, n, i, e[15], 4264355552, 10), i = d(i, o, r, n, e[6], 2734768916, 15), n = d(n, i, o, r, e[13], 1309151649, 21), r = d(r, n, i, o, e[4], 4149444226, 6), o = d(o, r, n, i, e[11], 3174756917, 10), i = d(i, o, r, n, e[2], 718787259, 15), n = d(n, i, o, r, e[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + n | 0, this._c = this._c + i | 0, this._d = this._d + o | 0;
    }, s.prototype._digest = function () {
      this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
      var e = o.allocUnsafe(16);
      return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e;
    }, t.exports = s;
  }, {
    "hash-base": 105,
    inherits: 135,
    "safe-buffer": 182
  }],
  139: [function (e, t, r) {
    var n = e("bn.js"),
        i = e("brorand");

    function o(e) {
      this.rand = e || new i.Rand();
    }

    t.exports = o, o.create = function (e) {
      return new o(e);
    }, o.prototype._randbelow = function (e) {
      var t = e.bitLength(),
          r = Math.ceil(t / 8);

      do {
        var i = new n(this.rand.generate(r));
      } while (i.cmp(e) >= 0);

      return i;
    }, o.prototype._randrange = function (e, t) {
      var r = t.sub(e);
      return e.add(this._randbelow(r));
    }, o.prototype.test = function (e, t, r) {
      var i = e.bitLength(),
          o = n.mont(e),
          a = new n(1).toRed(o);
      t || (t = Math.max(1, i / 48 | 0));

      for (var s = e.subn(1), f = 0; !s.testn(f); f++) {
        ;
      }

      for (var u = e.shrn(f), c = s.toRed(o); t > 0; t--) {
        var h = this._randrange(new n(2), s);

        r && r(h);
        var d = h.toRed(o).redPow(u);

        if (0 !== d.cmp(a) && 0 !== d.cmp(c)) {
          for (var l = 1; l < f; l++) {
            if (0 === (d = d.redSqr()).cmp(a)) return !1;
            if (0 === d.cmp(c)) break;
          }

          if (l === f) return !1;
        }
      }

      return !0;
    }, o.prototype.getDivisor = function (e, t) {
      var r = e.bitLength(),
          i = n.mont(e),
          o = new n(1).toRed(i);
      t || (t = Math.max(1, r / 48 | 0));

      for (var a = e.subn(1), s = 0; !a.testn(s); s++) {
        ;
      }

      for (var f = e.shrn(s), u = a.toRed(i); t > 0; t--) {
        var c = this._randrange(new n(2), a),
            h = e.gcd(c);

        if (0 !== h.cmpn(1)) return h;
        var d = c.toRed(i).redPow(f);

        if (0 !== d.cmp(o) && 0 !== d.cmp(u)) {
          for (var l = 1; l < s; l++) {
            if (0 === (d = d.redSqr()).cmp(o)) return d.fromRed().subn(1).gcd(e);
            if (0 === d.cmp(u)) break;
          }

          if (l === s) return (d = d.redSqr()).fromRed().subn(1).gcd(e);
        }
      }

      return !1;
    };
  }, {
    "bn.js": 140,
    brorand: 18
  }],
  140: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, {
    buffer: 19,
    dup: 15
  }],
  141: [function (e, t, r) {
    function n(e, t) {
      if (!e) throw new Error(t || "Assertion failed");
    }

    t.exports = n, n.equal = function (e, t, r) {
      if (e != t) throw new Error(r || "Assertion failed: " + e + " != " + t);
    };
  }, {}],
  142: [function (e, t, r) {
    "use strict";

    var n = r;

    function i(e) {
      return 1 === e.length ? "0" + e : e;
    }

    function o(e) {
      for (var t = "", r = 0; r < e.length; r++) {
        t += i(e[r].toString(16));
      }

      return t;
    }

    n.toArray = function (e, t) {
      if (Array.isArray(e)) return e.slice();
      if (!e) return [];
      var r = [];

      if ("string" != typeof e) {
        for (var n = 0; n < e.length; n++) {
          r[n] = 0 | e[n];
        }

        return r;
      }

      if ("hex" === t) {
        (e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);

        for (n = 0; n < e.length; n += 2) {
          r.push(parseInt(e[n] + e[n + 1], 16));
        }
      } else for (n = 0; n < e.length; n++) {
        var i = e.charCodeAt(n),
            o = i >> 8,
            a = 255 & i;
        o ? r.push(o, a) : r.push(a);
      }

      return r;
    }, n.zero2 = i, n.toHex = o, n.encode = function (e, t) {
      return "hex" === t ? o(e) : e;
    };
  }, {}],
  143: [function (e, t, r) {
    t.exports = {
      "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
      "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
      "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
      "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
      "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
      "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
      "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
      "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
      "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
      "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
      "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
      "2.16.840.1.101.3.4.1.44": "aes-256-cfb"
    };
  }, {}],
  144: [function (e, t, r) {
    "use strict";

    var n = e("asn1.js");
    r.certificate = e("./certificate");
    var i = n.define("RSAPrivateKey", function () {
      this.seq().obj(this.key("version")["int"](), this.key("modulus")["int"](), this.key("publicExponent")["int"](), this.key("privateExponent")["int"](), this.key("prime1")["int"](), this.key("prime2")["int"](), this.key("exponent1")["int"](), this.key("exponent2")["int"](), this.key("coefficient")["int"]());
    });
    r.RSAPrivateKey = i;
    var o = n.define("RSAPublicKey", function () {
      this.seq().obj(this.key("modulus")["int"](), this.key("publicExponent")["int"]());
    });
    r.RSAPublicKey = o;
    var a = n.define("SubjectPublicKeyInfo", function () {
      this.seq().obj(this.key("algorithm").use(s), this.key("subjectPublicKey").bitstr());
    });
    r.PublicKey = a;
    var s = n.define("AlgorithmIdentifier", function () {
      this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p")["int"](), this.key("q")["int"](), this.key("g")["int"]()).optional());
    }),
        f = n.define("PrivateKeyInfo", function () {
      this.seq().obj(this.key("version")["int"](), this.key("algorithm").use(s), this.key("subjectPrivateKey").octstr());
    });
    r.PrivateKey = f;
    var u = n.define("EncryptedPrivateKeyInfo", function () {
      this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters")["int"]())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr());
    });
    r.EncryptedPrivateKey = u;
    var c = n.define("DSAPrivateKey", function () {
      this.seq().obj(this.key("version")["int"](), this.key("p")["int"](), this.key("q")["int"](), this.key("g")["int"](), this.key("pub_key")["int"](), this.key("priv_key")["int"]());
    });
    r.DSAPrivateKey = c, r.DSAparam = n.define("DSAparam", function () {
      this["int"]();
    });
    var h = n.define("ECPrivateKey", function () {
      this.seq().obj(this.key("version")["int"](), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(d), this.key("publicKey").optional().explicit(1).bitstr());
    });
    r.ECPrivateKey = h;
    var d = n.define("ECParameters", function () {
      this.choice({
        namedCurve: this.objid()
      });
    });
    r.signature = n.define("signature", function () {
      this.seq().obj(this.key("r")["int"](), this.key("s")["int"]());
    });
  }, {
    "./certificate": 145,
    "asn1.js": 1
  }],
  145: [function (e, t, r) {
    "use strict";

    var n = e("asn1.js"),
        i = n.define("Time", function () {
      this.choice({
        utcTime: this.utctime(),
        generalTime: this.gentime()
      });
    }),
        o = n.define("AttributeTypeValue", function () {
      this.seq().obj(this.key("type").objid(), this.key("value").any());
    }),
        a = n.define("AlgorithmIdentifier", function () {
      this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional(), this.key("curve").objid().optional());
    }),
        s = n.define("SubjectPublicKeyInfo", function () {
      this.seq().obj(this.key("algorithm").use(a), this.key("subjectPublicKey").bitstr());
    }),
        f = n.define("RelativeDistinguishedName", function () {
      this.setof(o);
    }),
        u = n.define("RDNSequence", function () {
      this.seqof(f);
    }),
        c = n.define("Name", function () {
      this.choice({
        rdnSequence: this.use(u)
      });
    }),
        h = n.define("Validity", function () {
      this.seq().obj(this.key("notBefore").use(i), this.key("notAfter").use(i));
    }),
        d = n.define("Extension", function () {
      this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr());
    }),
        l = n.define("TBSCertificate", function () {
      this.seq().obj(this.key("version").explicit(0)["int"]().optional(), this.key("serialNumber")["int"](), this.key("signature").use(a), this.key("issuer").use(c), this.key("validity").use(h), this.key("subject").use(c), this.key("subjectPublicKeyInfo").use(s), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(d).optional());
    }),
        p = n.define("X509Certificate", function () {
      this.seq().obj(this.key("tbsCertificate").use(l), this.key("signatureAlgorithm").use(a), this.key("signatureValue").bitstr());
    });
    t.exports = p;
  }, {
    "asn1.js": 1
  }],
  146: [function (e, t, r) {
    var n = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r+/=]+)[\n\r]+/m,
        i = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m,
        o = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r+/=]+)-----END \1-----$/m,
        a = e("evp_bytestokey"),
        s = e("browserify-aes"),
        f = e("safe-buffer").Buffer;

    t.exports = function (e, t) {
      var r,
          u = e.toString(),
          c = u.match(n);

      if (c) {
        var h = "aes" + c[1],
            d = f.from(c[2], "hex"),
            l = f.from(c[3].replace(/[\r\n]/g, ""), "base64"),
            p = a(t, d.slice(0, 8), parseInt(c[1], 10)).key,
            b = [],
            m = s.createDecipheriv(h, p, d);
        b.push(m.update(l)), b.push(m["final"]()), r = f.concat(b);
      } else {
        var y = u.match(o);
        r = f.from(y[2].replace(/[\r\n]/g, ""), "base64");
      }

      return {
        tag: u.match(i)[1],
        data: r
      };
    };
  }, {
    "browserify-aes": 22,
    evp_bytestokey: 104,
    "safe-buffer": 182
  }],
  147: [function (e, t, r) {
    var n = e("./asn1"),
        i = e("./aesid.json"),
        o = e("./fixProc"),
        a = e("browserify-aes"),
        s = e("pbkdf2"),
        f = e("safe-buffer").Buffer;

    function u(e) {
      var t;
      "object" != _typeof(e) || f.isBuffer(e) || (t = e.passphrase, e = e.key), "string" == typeof e && (e = f.from(e));
      var r,
          u,
          c = o(e, t),
          h = c.tag,
          d = c.data;

      switch (h) {
        case "CERTIFICATE":
          u = n.certificate.decode(d, "der").tbsCertificate.subjectPublicKeyInfo;

        case "PUBLIC KEY":
          switch (u || (u = n.PublicKey.decode(d, "der")), r = u.algorithm.algorithm.join(".")) {
            case "1.2.840.113549.1.1.1":
              return n.RSAPublicKey.decode(u.subjectPublicKey.data, "der");

            case "1.2.840.10045.2.1":
              return u.subjectPrivateKey = u.subjectPublicKey, {
                type: "ec",
                data: u
              };

            case "1.2.840.10040.4.1":
              return u.algorithm.params.pub_key = n.DSAparam.decode(u.subjectPublicKey.data, "der"), {
                type: "dsa",
                data: u.algorithm.params
              };

            default:
              throw new Error("unknown key id " + r);
          }

        case "ENCRYPTED PRIVATE KEY":
          d = function (e, t) {
            var r = e.algorithm.decrypt.kde.kdeparams.salt,
                n = parseInt(e.algorithm.decrypt.kde.kdeparams.iters.toString(), 10),
                o = i[e.algorithm.decrypt.cipher.algo.join(".")],
                u = e.algorithm.decrypt.cipher.iv,
                c = e.subjectPrivateKey,
                h = parseInt(o.split("-")[1], 10) / 8,
                d = s.pbkdf2Sync(t, r, n, h, "sha1"),
                l = a.createDecipheriv(o, d, u),
                p = [];
            return p.push(l.update(c)), p.push(l["final"]()), f.concat(p);
          }(d = n.EncryptedPrivateKey.decode(d, "der"), t);

        case "PRIVATE KEY":
          switch (r = (u = n.PrivateKey.decode(d, "der")).algorithm.algorithm.join(".")) {
            case "1.2.840.113549.1.1.1":
              return n.RSAPrivateKey.decode(u.subjectPrivateKey, "der");

            case "1.2.840.10045.2.1":
              return {
                curve: u.algorithm.curve,
                privateKey: n.ECPrivateKey.decode(u.subjectPrivateKey, "der").privateKey
              };

            case "1.2.840.10040.4.1":
              return u.algorithm.params.priv_key = n.DSAparam.decode(u.subjectPrivateKey, "der"), {
                type: "dsa",
                params: u.algorithm.params
              };

            default:
              throw new Error("unknown key id " + r);
          }

        case "RSA PUBLIC KEY":
          return n.RSAPublicKey.decode(d, "der");

        case "RSA PRIVATE KEY":
          return n.RSAPrivateKey.decode(d, "der");

        case "DSA PRIVATE KEY":
          return {
            type: "dsa",
            params: n.DSAPrivateKey.decode(d, "der")
          };

        case "EC PRIVATE KEY":
          return {
            curve: (d = n.ECPrivateKey.decode(d, "der")).parameters.value,
            privateKey: d.privateKey
          };

        default:
          throw new Error("unknown key type " + h);
      }
    }

    t.exports = u, u.signature = n.signature;
  }, {
    "./aesid.json": 143,
    "./asn1": 144,
    "./fixProc": 146,
    "browserify-aes": 22,
    pbkdf2: 149,
    "safe-buffer": 182
  }],
  148: [function (e, t, r) {
    (function (e) {
      function t(e, t) {
        for (var r = 0, n = e.length - 1; n >= 0; n--) {
          var i = e[n];
          "." === i ? e.splice(n, 1) : ".." === i ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
        }

        if (t) for (; r--; r) {
          e.unshift("..");
        }
        return e;
      }

      function n(e, t) {
        if (e.filter) return e.filter(t);

        for (var r = [], n = 0; n < e.length; n++) {
          t(e[n], n, e) && r.push(e[n]);
        }

        return r;
      }

      r.resolve = function () {
        for (var r = "", i = !1, o = arguments.length - 1; o >= -1 && !i; o--) {
          var a = o >= 0 ? arguments[o] : e.cwd();
          if ("string" != typeof a) throw new TypeError("Arguments to path.resolve must be strings");
          a && (r = a + "/" + r, i = "/" === a.charAt(0));
        }

        return (i ? "/" : "") + (r = t(n(r.split("/"), function (e) {
          return !!e;
        }), !i).join("/")) || ".";
      }, r.normalize = function (e) {
        var o = r.isAbsolute(e),
            a = "/" === i(e, -1);
        return (e = t(n(e.split("/"), function (e) {
          return !!e;
        }), !o).join("/")) || o || (e = "."), e && a && (e += "/"), (o ? "/" : "") + e;
      }, r.isAbsolute = function (e) {
        return "/" === e.charAt(0);
      }, r.join = function () {
        var e = Array.prototype.slice.call(arguments, 0);
        return r.normalize(n(e, function (e, t) {
          if ("string" != typeof e) throw new TypeError("Arguments to path.join must be strings");
          return e;
        }).join("/"));
      }, r.relative = function (e, t) {
        function n(e) {
          for (var t = 0; t < e.length && "" === e[t]; t++) {
            ;
          }

          for (var r = e.length - 1; r >= 0 && "" === e[r]; r--) {
            ;
          }

          return t > r ? [] : e.slice(t, r - t + 1);
        }

        e = r.resolve(e).substr(1), t = r.resolve(t).substr(1);

        for (var i = n(e.split("/")), o = n(t.split("/")), a = Math.min(i.length, o.length), s = a, f = 0; f < a; f++) {
          if (i[f] !== o[f]) {
            s = f;
            break;
          }
        }

        var u = [];

        for (f = s; f < i.length; f++) {
          u.push("..");
        }

        return (u = u.concat(o.slice(s))).join("/");
      }, r.sep = "/", r.delimiter = ":", r.dirname = function (e) {
        if ("string" != typeof e && (e += ""), 0 === e.length) return ".";

        for (var t = e.charCodeAt(0), r = 47 === t, n = -1, i = !0, o = e.length - 1; o >= 1; --o) {
          if (47 === (t = e.charCodeAt(o))) {
            if (!i) {
              n = o;
              break;
            }
          } else i = !1;
        }

        return -1 === n ? r ? "/" : "." : r && 1 === n ? "/" : e.slice(0, n);
      }, r.basename = function (e, t) {
        var r = function (e) {
          "string" != typeof e && (e += "");
          var t,
              r = 0,
              n = -1,
              i = !0;

          for (t = e.length - 1; t >= 0; --t) {
            if (47 === e.charCodeAt(t)) {
              if (!i) {
                r = t + 1;
                break;
              }
            } else -1 === n && (i = !1, n = t + 1);
          }

          return -1 === n ? "" : e.slice(r, n);
        }(e);

        return t && r.substr(-1 * t.length) === t && (r = r.substr(0, r.length - t.length)), r;
      }, r.extname = function (e) {
        "string" != typeof e && (e += "");

        for (var t = -1, r = 0, n = -1, i = !0, o = 0, a = e.length - 1; a >= 0; --a) {
          var s = e.charCodeAt(a);
          if (47 !== s) -1 === n && (i = !1, n = a + 1), 46 === s ? -1 === t ? t = a : 1 !== o && (o = 1) : -1 !== t && (o = -1);else if (!i) {
            r = a + 1;
            break;
          }
        }

        return -1 === t || -1 === n || 0 === o || 1 === o && t === n - 1 && t === r + 1 ? "" : e.slice(t, n);
      };
      var i = "b" === "ab".substr(-1) ? function (e, t, r) {
        return e.substr(t, r);
      } : function (e, t, r) {
        return t < 0 && (t = e.length + t), e.substr(t, r);
      };
    }).call(this, e("_process"));
  }, {
    _process: 156
  }],
  149: [function (e, t, r) {
    r.pbkdf2 = e("./lib/async"), r.pbkdf2Sync = e("./lib/sync");
  }, {
    "./lib/async": 150,
    "./lib/sync": 153
  }],
  150: [function (e, t, r) {
    (function (r, n) {
      var i,
          o = e("safe-buffer").Buffer,
          a = e("./precondition"),
          s = e("./default-encoding"),
          f = e("./sync"),
          u = e("./to-buffer"),
          c = n.crypto && n.crypto.subtle,
          h = {
        sha: "SHA-1",
        "sha-1": "SHA-1",
        sha1: "SHA-1",
        sha256: "SHA-256",
        "sha-256": "SHA-256",
        sha384: "SHA-384",
        "sha-384": "SHA-384",
        "sha-512": "SHA-512",
        sha512: "SHA-512"
      },
          d = [];

      function l(e, t, r, n, i) {
        return c.importKey("raw", e, {
          name: "PBKDF2"
        }, !1, ["deriveBits"]).then(function (e) {
          return c.deriveBits({
            name: "PBKDF2",
            salt: t,
            iterations: r,
            hash: {
              name: i
            }
          }, e, n << 3);
        }).then(function (e) {
          return o.from(e);
        });
      }

      t.exports = function (e, t, p, b, m, y) {
        "function" == typeof m && (y = m, m = void 0);
        var g = h[(m = m || "sha1").toLowerCase()];
        if (!g || "function" != typeof n.Promise) return r.nextTick(function () {
          var r;

          try {
            r = f(e, t, p, b, m);
          } catch (e) {
            return y(e);
          }

          y(null, r);
        });
        if (a(p, b), e = u(e, s, "Password"), t = u(t, s, "Salt"), "function" != typeof y) throw new Error("No callback provided to pbkdf2");
        !function (e, t) {
          e.then(function (e) {
            r.nextTick(function () {
              t(null, e);
            });
          }, function (e) {
            r.nextTick(function () {
              t(e);
            });
          });
        }(function (e) {
          if (n.process && !n.process.browser) return Promise.resolve(!1);
          if (!c || !c.importKey || !c.deriveBits) return Promise.resolve(!1);
          if (void 0 !== d[e]) return d[e];
          var t = l(i = i || o.alloc(8), i, 10, 128, e).then(function () {
            return !0;
          })["catch"](function () {
            return !1;
          });
          return d[e] = t, t;
        }(g).then(function (r) {
          return r ? l(e, t, p, b, g) : f(e, t, p, b, m);
        }), y);
      };
    }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {
    "./default-encoding": 151,
    "./precondition": 152,
    "./sync": 153,
    "./to-buffer": 154,
    _process: 156,
    "safe-buffer": 182
  }],
  151: [function (e, t, r) {
    (function (e) {
      var r;
      if (e.browser) r = "utf-8";else if (e.version) {
        r = parseInt(e.version.split(".")[0].slice(1), 10) >= 6 ? "utf-8" : "binary";
      } else r = "utf-8";
      t.exports = r;
    }).call(this, e("_process"));
  }, {
    _process: 156
  }],
  152: [function (e, t, r) {
    var n = Math.pow(2, 30) - 1;

    t.exports = function (e, t) {
      if ("number" != typeof e) throw new TypeError("Iterations not a number");
      if (e < 0) throw new TypeError("Bad iterations");
      if ("number" != typeof t) throw new TypeError("Key length not a number");
      if (t < 0 || t > n || t != t) throw new TypeError("Bad key length");
    };
  }, {}],
  153: [function (e, t, r) {
    var n = e("create-hash/md5"),
        i = e("ripemd160"),
        o = e("sha.js"),
        a = e("safe-buffer").Buffer,
        s = e("./precondition"),
        f = e("./default-encoding"),
        u = e("./to-buffer"),
        c = a.alloc(128),
        h = {
      md5: 16,
      sha1: 20,
      sha224: 28,
      sha256: 32,
      sha384: 48,
      sha512: 64,
      rmd160: 20,
      ripemd160: 20
    };

    function d(e, t, r) {
      var s = function (e) {
        function t(t) {
          return o(e).update(t).digest();
        }

        return "rmd160" === e || "ripemd160" === e ? function (e) {
          return new i().update(e).digest();
        } : "md5" === e ? n : t;
      }(e),
          f = "sha512" === e || "sha384" === e ? 128 : 64;

      t.length > f ? t = s(t) : t.length < f && (t = a.concat([t, c], f));

      for (var u = a.allocUnsafe(f + h[e]), d = a.allocUnsafe(f + h[e]), l = 0; l < f; l++) {
        u[l] = 54 ^ t[l], d[l] = 92 ^ t[l];
      }

      var p = a.allocUnsafe(f + r + 4);
      u.copy(p, 0, 0, f), this.ipad1 = p, this.ipad2 = u, this.opad = d, this.alg = e, this.blocksize = f, this.hash = s, this.size = h[e];
    }

    d.prototype.run = function (e, t) {
      return e.copy(t, this.blocksize), this.hash(t).copy(this.opad, this.blocksize), this.hash(this.opad);
    }, t.exports = function (e, t, r, n, i) {
      s(r, n);
      var o = new d(i = i || "sha1", e = u(e, f, "Password"), (t = u(t, f, "Salt")).length),
          c = a.allocUnsafe(n),
          l = a.allocUnsafe(t.length + 4);
      t.copy(l, 0, 0, t.length);

      for (var p = 0, b = h[i], m = Math.ceil(n / b), y = 1; y <= m; y++) {
        l.writeUInt32BE(y, t.length);

        for (var g = o.run(l, o.ipad1), v = g, w = 1; w < r; w++) {
          v = o.run(v, o.ipad2);

          for (var _ = 0; _ < b; _++) {
            g[_] ^= v[_];
          }
        }

        g.copy(c, p), p += b;
      }

      return c;
    };
  }, {
    "./default-encoding": 151,
    "./precondition": 152,
    "./to-buffer": 154,
    "create-hash/md5": 71,
    ripemd160: 181,
    "safe-buffer": 182,
    "sha.js": 185
  }],
  154: [function (e, t, r) {
    var n = e("safe-buffer").Buffer;

    t.exports = function (e, t, r) {
      if (n.isBuffer(e)) return e;
      if ("string" == typeof e) return n.from(e, t);
      if (ArrayBuffer.isView(e)) return n.from(e.buffer);
      throw new TypeError(r + " must be a string, a Buffer, a typed array or a DataView");
    };
  }, {
    "safe-buffer": 182
  }],
  155: [function (e, t, r) {
    (function (e) {
      "use strict";

      void 0 === e || !e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = {
        nextTick: function nextTick(t, r, n, i) {
          if ("function" != typeof t) throw new TypeError('"callback" argument must be a function');
          var o,
              a,
              s = arguments.length;

          switch (s) {
            case 0:
            case 1:
              return e.nextTick(t);

            case 2:
              return e.nextTick(function () {
                t.call(null, r);
              });

            case 3:
              return e.nextTick(function () {
                t.call(null, r, n);
              });

            case 4:
              return e.nextTick(function () {
                t.call(null, r, n, i);
              });

            default:
              for (o = new Array(s - 1), a = 0; a < o.length;) {
                o[a++] = arguments[a];
              }

              return e.nextTick(function () {
                t.apply(null, o);
              });
          }
        }
      } : t.exports = e;
    }).call(this, e("_process"));
  }, {
    _process: 156
  }],
  156: [function (e, t, r) {
    var n,
        i,
        o = t.exports = {};

    function a() {
      throw new Error("setTimeout has not been defined");
    }

    function s() {
      throw new Error("clearTimeout has not been defined");
    }

    function f(e) {
      if (n === setTimeout) return setTimeout(e, 0);
      if ((n === a || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);

      try {
        return n(e, 0);
      } catch (t) {
        try {
          return n.call(null, e, 0);
        } catch (t) {
          return n.call(this, e, 0);
        }
      }
    }

    !function () {
      try {
        n = "function" == typeof setTimeout ? setTimeout : a;
      } catch (e) {
        n = a;
      }

      try {
        i = "function" == typeof clearTimeout ? clearTimeout : s;
      } catch (e) {
        i = s;
      }
    }();
    var u,
        c = [],
        h = !1,
        d = -1;

    function l() {
      h && u && (h = !1, u.length ? c = u.concat(c) : d = -1, c.length && p());
    }

    function p() {
      if (!h) {
        var e = f(l);
        h = !0;

        for (var t = c.length; t;) {
          for (u = c, c = []; ++d < t;) {
            u && u[d].run();
          }

          d = -1, t = c.length;
        }

        u = null, h = !1, function (e) {
          if (i === clearTimeout) return clearTimeout(e);
          if ((i === s || !i) && clearTimeout) return i = clearTimeout, clearTimeout(e);

          try {
            i(e);
          } catch (t) {
            try {
              return i.call(null, e);
            } catch (t) {
              return i.call(this, e);
            }
          }
        }(e);
      }
    }

    function b(e, t) {
      this.fun = e, this.array = t;
    }

    function m() {}

    o.nextTick = function (e) {
      var t = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) {
        t[r - 1] = arguments[r];
      }
      c.push(new b(e, t)), 1 !== c.length || h || f(p);
    }, b.prototype.run = function () {
      this.fun.apply(null, this.array);
    }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = m, o.addListener = m, o.once = m, o.off = m, o.removeListener = m, o.removeAllListeners = m, o.emit = m, o.prependListener = m, o.prependOnceListener = m, o.listeners = function (e) {
      return [];
    }, o.binding = function (e) {
      throw new Error("process.binding is not supported");
    }, o.cwd = function () {
      return "/";
    }, o.chdir = function (e) {
      throw new Error("process.chdir is not supported");
    }, o.umask = function () {
      return 0;
    };
  }, {}],
  157: [function (e, t, r) {
    r.publicEncrypt = e("./publicEncrypt"), r.privateDecrypt = e("./privateDecrypt"), r.privateEncrypt = function (e, t) {
      return r.publicEncrypt(e, t, !0);
    }, r.publicDecrypt = function (e, t) {
      return r.privateDecrypt(e, t, !0);
    };
  }, {
    "./privateDecrypt": 160,
    "./publicEncrypt": 161
  }],
  158: [function (e, t, r) {
    var n = e("create-hash"),
        i = e("safe-buffer").Buffer;

    function o(e) {
      var t = i.allocUnsafe(4);
      return t.writeUInt32BE(e, 0), t;
    }

    t.exports = function (e, t) {
      for (var r, a = i.alloc(0), s = 0; a.length < t;) {
        r = o(s++), a = i.concat([a, n("sha1").update(e).update(r).digest()]);
      }

      return a.slice(0, t);
    };
  }, {
    "create-hash": 70,
    "safe-buffer": 182
  }],
  159: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, {
    buffer: 19,
    dup: 15
  }],
  160: [function (e, t, r) {
    var n = e("parse-asn1"),
        i = e("./mgf"),
        o = e("./xor"),
        a = e("bn.js"),
        s = e("browserify-rsa"),
        f = e("create-hash"),
        u = e("./withPublic"),
        c = e("safe-buffer").Buffer;

    t.exports = function (e, t, r) {
      var h;
      h = e.padding ? e.padding : r ? 1 : 4;
      var d,
          l = n(e),
          p = l.modulus.byteLength();
      if (t.length > p || new a(t).cmp(l.modulus) >= 0) throw new Error("decryption error");
      d = r ? u(new a(t), l) : s(t, l);
      var b = c.alloc(p - d.length);
      if (d = c.concat([b, d], p), 4 === h) return function (e, t) {
        var r = e.modulus.byteLength(),
            n = f("sha1").update(c.alloc(0)).digest(),
            a = n.length;
        if (0 !== t[0]) throw new Error("decryption error");
        var s = t.slice(1, a + 1),
            u = t.slice(a + 1),
            h = o(s, i(u, a)),
            d = o(u, i(h, r - a - 1));
        if (function (e, t) {
          e = c.from(e), t = c.from(t);
          var r = 0,
              n = e.length;
          e.length !== t.length && (r++, n = Math.min(e.length, t.length));
          var i = -1;

          for (; ++i < n;) {
            r += e[i] ^ t[i];
          }

          return r;
        }(n, d.slice(0, a))) throw new Error("decryption error");
        var l = a;

        for (; 0 === d[l];) {
          l++;
        }

        if (1 !== d[l++]) throw new Error("decryption error");
        return d.slice(l);
      }(l, d);
      if (1 === h) return function (e, t, r) {
        var n = t.slice(0, 2),
            i = 2,
            o = 0;

        for (; 0 !== t[i++];) {
          if (i >= t.length) {
            o++;
            break;
          }
        }

        var a = t.slice(2, i - 1);
        ("0002" !== n.toString("hex") && !r || "0001" !== n.toString("hex") && r) && o++;
        a.length < 8 && o++;
        if (o) throw new Error("decryption error");
        return t.slice(i);
      }(0, d, r);
      if (3 === h) return d;
      throw new Error("unknown padding");
    };
  }, {
    "./mgf": 158,
    "./withPublic": 162,
    "./xor": 163,
    "bn.js": 159,
    "browserify-rsa": 40,
    "create-hash": 70,
    "parse-asn1": 147,
    "safe-buffer": 182
  }],
  161: [function (e, t, r) {
    var n = e("parse-asn1"),
        i = e("randombytes"),
        o = e("create-hash"),
        a = e("./mgf"),
        s = e("./xor"),
        f = e("bn.js"),
        u = e("./withPublic"),
        c = e("browserify-rsa"),
        h = e("safe-buffer").Buffer;

    t.exports = function (e, t, r) {
      var d;
      d = e.padding ? e.padding : r ? 1 : 4;
      var l,
          p = n(e);
      if (4 === d) l = function (e, t) {
        var r = e.modulus.byteLength(),
            n = t.length,
            u = o("sha1").update(h.alloc(0)).digest(),
            c = u.length,
            d = 2 * c;
        if (n > r - d - 2) throw new Error("message too long");
        var l = h.alloc(r - n - d - 2),
            p = r - c - 1,
            b = i(c),
            m = s(h.concat([u, l, h.alloc(1, 1), t], p), a(b, p)),
            y = s(b, a(m, c));
        return new f(h.concat([h.alloc(1), y, m], r));
      }(p, t);else if (1 === d) l = function (e, t, r) {
        var n,
            o = t.length,
            a = e.modulus.byteLength();
        if (o > a - 11) throw new Error("message too long");
        n = r ? h.alloc(a - o - 3, 255) : function (e) {
          var t,
              r = h.allocUnsafe(e),
              n = 0,
              o = i(2 * e),
              a = 0;

          for (; n < e;) {
            a === o.length && (o = i(2 * e), a = 0), (t = o[a++]) && (r[n++] = t);
          }

          return r;
        }(a - o - 3);
        return new f(h.concat([h.from([0, r ? 1 : 2]), n, h.alloc(1), t], a));
      }(p, t, r);else {
        if (3 !== d) throw new Error("unknown padding");
        if ((l = new f(t)).cmp(p.modulus) >= 0) throw new Error("data too long for modulus");
      }
      return r ? c(l, p) : u(l, p);
    };
  }, {
    "./mgf": 158,
    "./withPublic": 162,
    "./xor": 163,
    "bn.js": 159,
    "browserify-rsa": 40,
    "create-hash": 70,
    "parse-asn1": 147,
    randombytes: 164,
    "safe-buffer": 182
  }],
  162: [function (e, t, r) {
    var n = e("bn.js"),
        i = e("safe-buffer").Buffer;

    t.exports = function (e, t) {
      return i.from(e.toRed(n.mont(t.modulus)).redPow(new n(t.publicExponent)).fromRed().toArray());
    };
  }, {
    "bn.js": 159,
    "safe-buffer": 182
  }],
  163: [function (e, t, r) {
    t.exports = function (e, t) {
      for (var r = e.length, n = -1; ++n < r;) {
        e[n] ^= t[n];
      }

      return e;
    };
  }, {}],
  164: [function (e, t, r) {
    (function (r, n) {
      "use strict";

      var i = e("safe-buffer").Buffer,
          o = n.crypto || n.msCrypto;
      o && o.getRandomValues ? t.exports = function (e, t) {
        if (e > 4294967295) throw new RangeError("requested too many random bytes");
        var n = i.allocUnsafe(e);
        if (e > 0) if (e > 65536) for (var a = 0; a < e; a += 65536) {
          o.getRandomValues(n.slice(a, a + 65536));
        } else o.getRandomValues(n);
        if ("function" == typeof t) return r.nextTick(function () {
          t(null, n);
        });
        return n;
      } : t.exports = function () {
        throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
      };
    }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {
    _process: 156,
    "safe-buffer": 182
  }],
  165: [function (e, t, r) {
    (function (t, n) {
      "use strict";

      function i() {
        throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");
      }

      var o = e("safe-buffer"),
          a = e("randombytes"),
          s = o.Buffer,
          f = o.kMaxLength,
          u = n.crypto || n.msCrypto,
          c = Math.pow(2, 32) - 1;

      function h(e, t) {
        if ("number" != typeof e || e != e) throw new TypeError("offset must be a number");
        if (e > c || e < 0) throw new TypeError("offset must be a uint32");
        if (e > f || e > t) throw new RangeError("offset out of range");
      }

      function d(e, t, r) {
        if ("number" != typeof e || e != e) throw new TypeError("size must be a number");
        if (e > c || e < 0) throw new TypeError("size must be a uint32");
        if (e + t > r || e > f) throw new RangeError("buffer too small");
      }

      function l(e, r, n, i) {
        if (t.browser) {
          var o = e.buffer,
              s = new Uint8Array(o, r, n);
          return u.getRandomValues(s), i ? void t.nextTick(function () {
            i(null, e);
          }) : e;
        }

        if (!i) return a(n).copy(e, r), e;
        a(n, function (t, n) {
          if (t) return i(t);
          n.copy(e, r), i(null, e);
        });
      }

      u && u.getRandomValues || !t.browser ? (r.randomFill = function (e, t, r, i) {
        if (!(s.isBuffer(e) || e instanceof n.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
        if ("function" == typeof t) i = t, t = 0, r = e.length;else if ("function" == typeof r) i = r, r = e.length - t;else if ("function" != typeof i) throw new TypeError('"cb" argument must be a function');
        return h(t, e.length), d(r, t, e.length), l(e, t, r, i);
      }, r.randomFillSync = function (e, t, r) {
        void 0 === t && (t = 0);
        if (!(s.isBuffer(e) || e instanceof n.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
        h(t, e.length), void 0 === r && (r = e.length - t);
        return d(r, t, e.length), l(e, t, r);
      }) : (r.randomFill = i, r.randomFillSync = i);
    }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {
    _process: 156,
    randombytes: 164,
    "safe-buffer": 182
  }],
  166: [function (e, t, r) {
    t.exports = e("./lib/_stream_duplex.js");
  }, {
    "./lib/_stream_duplex.js": 167
  }],
  167: [function (e, t, r) {
    "use strict";

    var n = e("process-nextick-args"),
        i = Object.keys || function (e) {
      var t = [];

      for (var r in e) {
        t.push(r);
      }

      return t;
    };

    t.exports = h;
    var o = Object.create(e("core-util-is"));
    o.inherits = e("inherits");
    var a = e("./_stream_readable"),
        s = e("./_stream_writable");
    o.inherits(h, a);

    for (var f = i(s.prototype), u = 0; u < f.length; u++) {
      var c = f[u];
      h.prototype[c] || (h.prototype[c] = s.prototype[c]);
    }

    function h(e) {
      if (!(this instanceof h)) return new h(e);
      a.call(this, e), s.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", d);
    }

    function d() {
      this.allowHalfOpen || this._writableState.ended || n.nextTick(l, this);
    }

    function l(e) {
      e.end();
    }

    Object.defineProperty(h.prototype, "writableHighWaterMark", {
      enumerable: !1,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    }), Object.defineProperty(h.prototype, "destroyed", {
      get: function get() {
        return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function set(e) {
        void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e);
      }
    }), h.prototype._destroy = function (e, t) {
      this.push(null), this.end(), n.nextTick(t, e);
    };
  }, {
    "./_stream_readable": 169,
    "./_stream_writable": 171,
    "core-util-is": 67,
    inherits: 135,
    "process-nextick-args": 155
  }],
  168: [function (e, t, r) {
    "use strict";

    t.exports = o;
    var n = e("./_stream_transform"),
        i = Object.create(e("core-util-is"));

    function o(e) {
      if (!(this instanceof o)) return new o(e);
      n.call(this, e);
    }

    i.inherits = e("inherits"), i.inherits(o, n), o.prototype._transform = function (e, t, r) {
      r(null, e);
    };
  }, {
    "./_stream_transform": 170,
    "core-util-is": 67,
    inherits: 135
  }],
  169: [function (e, t, r) {
    (function (r, n) {
      "use strict";

      var i = e("process-nextick-args");
      t.exports = v;
      var o,
          a = e("isarray");
      v.ReadableState = g;
      e("events").EventEmitter;

      var s = function s(e, t) {
        return e.listeners(t).length;
      },
          f = e("./internal/streams/stream"),
          u = e("safe-buffer").Buffer,
          c = n.Uint8Array || function () {};

      var h = Object.create(e("core-util-is"));
      h.inherits = e("inherits");
      var d = e("util"),
          l = void 0;
      l = d && d.debuglog ? d.debuglog("stream") : function () {};
      var p,
          b = e("./internal/streams/BufferList"),
          m = e("./internal/streams/destroy");
      h.inherits(v, f);
      var y = ["error", "close", "destroy", "pause", "resume"];

      function g(t, r) {
        t = t || {};
        var n = r instanceof (o = o || e("./_stream_duplex"));
        this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.readableObjectMode);
        var i = t.highWaterMark,
            a = t.readableHighWaterMark,
            s = this.objectMode ? 16 : 16384;
        this.highWaterMark = i || 0 === i ? i : n && (a || 0 === a) ? a : s, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new b(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (p || (p = e("string_decoder/").StringDecoder), this.decoder = new p(t.encoding), this.encoding = t.encoding);
      }

      function v(t) {
        if (o = o || e("./_stream_duplex"), !(this instanceof v)) return new v(t);
        this._readableState = new g(t, this), this.readable = !0, t && ("function" == typeof t.read && (this._read = t.read), "function" == typeof t.destroy && (this._destroy = t.destroy)), f.call(this);
      }

      function w(e, t, r, n, i) {
        var o,
            a = e._readableState;
        null === t ? (a.reading = !1, function (e, t) {
          if (t.ended) return;

          if (t.decoder) {
            var r = t.decoder.end();
            r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
          }

          t.ended = !0, M(e);
        }(e, a)) : (i || (o = function (e, t) {
          var r;
          n = t, u.isBuffer(n) || n instanceof c || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));
          var n;
          return r;
        }(a, t)), o ? e.emit("error", o) : a.objectMode || t && t.length > 0 ? ("string" == typeof t || a.objectMode || Object.getPrototypeOf(t) === u.prototype || (t = function (e) {
          return u.from(e);
        }(t)), n ? a.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : _(e, a, t, !0) : a.ended ? e.emit("error", new Error("stream.push() after EOF")) : (a.reading = !1, a.decoder && !r ? (t = a.decoder.write(t), a.objectMode || 0 !== t.length ? _(e, a, t, !1) : k(e, a)) : _(e, a, t, !1))) : n || (a.reading = !1));
        return function (e) {
          return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);
        }(a);
      }

      function _(e, t, r, n) {
        t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, n ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && M(e)), k(e, t);
      }

      Object.defineProperty(v.prototype, "destroyed", {
        get: function get() {
          return void 0 !== this._readableState && this._readableState.destroyed;
        },
        set: function set(e) {
          this._readableState && (this._readableState.destroyed = e);
        }
      }), v.prototype.destroy = m.destroy, v.prototype._undestroy = m.undestroy, v.prototype._destroy = function (e, t) {
        this.push(null), t(e);
      }, v.prototype.push = function (e, t) {
        var r,
            n = this._readableState;
        return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = u.from(e, t), t = ""), r = !0), w(this, e, t, !1, r);
      }, v.prototype.unshift = function (e) {
        return w(this, e, null, !0, !1);
      }, v.prototype.isPaused = function () {
        return !1 === this._readableState.flowing;
      }, v.prototype.setEncoding = function (t) {
        return p || (p = e("string_decoder/").StringDecoder), this._readableState.decoder = new p(t), this._readableState.encoding = t, this;
      };

      function E(e, t) {
        return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function (e) {
          return e >= 8388608 ? e = 8388608 : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
        }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
      }

      function M(e) {
        var t = e._readableState;
        t.needReadable = !1, t.emittedReadable || (l("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? i.nextTick(S, e) : S(e));
      }

      function S(e) {
        l("emit readable"), e.emit("readable"), I(e);
      }

      function k(e, t) {
        t.readingMore || (t.readingMore = !0, i.nextTick(A, e, t));
      }

      function A(e, t) {
        for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (l("maybeReadMore read 0"), e.read(0), r !== t.length);) {
          r = t.length;
        }

        t.readingMore = !1;
      }

      function x(e) {
        l("readable nexttick read 0"), e.read(0);
      }

      function R(e, t) {
        t.reading || (l("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), I(e), t.flowing && !t.reading && e.read(0);
      }

      function I(e) {
        var t = e._readableState;

        for (l("flow", t.flowing); t.flowing && null !== e.read();) {
          ;
        }
      }

      function B(e, t) {
        return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : r = function (e, t, r) {
          var n;
          e < t.head.data.length ? (n = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : n = e === t.head.data.length ? t.shift() : r ? function (e, t) {
            var r = t.head,
                n = 1,
                i = r.data;
            e -= i.length;

            for (; r = r.next;) {
              var o = r.data,
                  a = e > o.length ? o.length : e;

              if (a === o.length ? i += o : i += o.slice(0, e), 0 === (e -= a)) {
                a === o.length ? (++n, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = o.slice(a));
                break;
              }

              ++n;
            }

            return t.length -= n, i;
          }(e, t) : function (e, t) {
            var r = u.allocUnsafe(e),
                n = t.head,
                i = 1;
            n.data.copy(r), e -= n.data.length;

            for (; n = n.next;) {
              var o = n.data,
                  a = e > o.length ? o.length : e;

              if (o.copy(r, r.length - e, 0, a), 0 === (e -= a)) {
                a === o.length ? (++i, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, n.data = o.slice(a));
                break;
              }

              ++i;
            }

            return t.length -= i, r;
          }(e, t);
          return n;
        }(e, t.buffer, t.decoder), r);
        var r;
      }

      function T(e) {
        var t = e._readableState;
        if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
        t.endEmitted || (t.ended = !0, i.nextTick(j, t, e));
      }

      function j(e, t) {
        e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"));
      }

      function D(e, t) {
        for (var r = 0, n = e.length; r < n; r++) {
          if (e[r] === t) return r;
        }

        return -1;
      }

      v.prototype.read = function (e) {
        l("read", e), e = parseInt(e, 10);
        var t = this._readableState,
            r = e;
        if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return l("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? T(this) : M(this), null;
        if (0 === (e = E(e, t)) && t.ended) return 0 === t.length && T(this), null;
        var n,
            i = t.needReadable;
        return l("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && l("length less than watermark", i = !0), t.ended || t.reading ? l("reading or ended", i = !1) : i && (l("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = E(r, t))), null === (n = e > 0 ? B(e, t) : null) ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && T(this)), null !== n && this.emit("data", n), n;
      }, v.prototype._read = function (e) {
        this.emit("error", new Error("_read() is not implemented"));
      }, v.prototype.pipe = function (e, t) {
        var n = this,
            o = this._readableState;

        switch (o.pipesCount) {
          case 0:
            o.pipes = e;
            break;

          case 1:
            o.pipes = [o.pipes, e];
            break;

          default:
            o.pipes.push(e);
        }

        o.pipesCount += 1, l("pipe count=%d opts=%j", o.pipesCount, t);
        var f = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? c : v;

        function u(t, r) {
          l("onunpipe"), t === n && r && !1 === r.hasUnpiped && (r.hasUnpiped = !0, l("cleanup"), e.removeListener("close", y), e.removeListener("finish", g), e.removeListener("drain", h), e.removeListener("error", m), e.removeListener("unpipe", u), n.removeListener("end", c), n.removeListener("end", v), n.removeListener("data", b), d = !0, !o.awaitDrain || e._writableState && !e._writableState.needDrain || h());
        }

        function c() {
          l("onend"), e.end();
        }

        o.endEmitted ? i.nextTick(f) : n.once("end", f), e.on("unpipe", u);

        var h = function (e) {
          return function () {
            var t = e._readableState;
            l("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && s(e, "data") && (t.flowing = !0, I(e));
          };
        }(n);

        e.on("drain", h);
        var d = !1;
        var p = !1;

        function b(t) {
          l("ondata"), p = !1, !1 !== e.write(t) || p || ((1 === o.pipesCount && o.pipes === e || o.pipesCount > 1 && -1 !== D(o.pipes, e)) && !d && (l("false write response, pause", n._readableState.awaitDrain), n._readableState.awaitDrain++, p = !0), n.pause());
        }

        function m(t) {
          l("onerror", t), v(), e.removeListener("error", m), 0 === s(e, "error") && e.emit("error", t);
        }

        function y() {
          e.removeListener("finish", g), v();
        }

        function g() {
          l("onfinish"), e.removeListener("close", y), v();
        }

        function v() {
          l("unpipe"), n.unpipe(e);
        }

        return n.on("data", b), function (e, t, r) {
          if ("function" == typeof e.prependListener) return e.prependListener(t, r);
          e._events && e._events[t] ? a(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r);
        }(e, "error", m), e.once("close", y), e.once("finish", g), e.emit("pipe", n), o.flowing || (l("pipe resume"), n.resume()), e;
      }, v.prototype.unpipe = function (e) {
        var t = this._readableState,
            r = {
          hasUnpiped: !1
        };
        if (0 === t.pipesCount) return this;
        if (1 === t.pipesCount) return e && e !== t.pipes || (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r)), this;

        if (!e) {
          var n = t.pipes,
              i = t.pipesCount;
          t.pipes = null, t.pipesCount = 0, t.flowing = !1;

          for (var o = 0; o < i; o++) {
            n[o].emit("unpipe", this, r);
          }

          return this;
        }

        var a = D(t.pipes, e);
        return -1 === a || (t.pipes.splice(a, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r)), this;
      }, v.prototype.on = function (e, t) {
        var r = f.prototype.on.call(this, e, t);
        if ("data" === e) !1 !== this._readableState.flowing && this.resume();else if ("readable" === e) {
          var n = this._readableState;
          n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0, n.emittedReadable = !1, n.reading ? n.length && M(this) : i.nextTick(x, this));
        }
        return r;
      }, v.prototype.addListener = v.prototype.on, v.prototype.resume = function () {
        var e = this._readableState;
        return e.flowing || (l("resume"), e.flowing = !0, function (e, t) {
          t.resumeScheduled || (t.resumeScheduled = !0, i.nextTick(R, e, t));
        }(this, e)), this;
      }, v.prototype.pause = function () {
        return l("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (l("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
      }, v.prototype.wrap = function (e) {
        var t = this,
            r = this._readableState,
            n = !1;

        for (var i in e.on("end", function () {
          if (l("wrapped end"), r.decoder && !r.ended) {
            var e = r.decoder.end();
            e && e.length && t.push(e);
          }

          t.push(null);
        }), e.on("data", function (i) {
          (l("wrapped data"), r.decoder && (i = r.decoder.write(i)), r.objectMode && null == i) || (r.objectMode || i && i.length) && (t.push(i) || (n = !0, e.pause()));
        }), e) {
          void 0 === this[i] && "function" == typeof e[i] && (this[i] = function (t) {
            return function () {
              return e[t].apply(e, arguments);
            };
          }(i));
        }

        for (var o = 0; o < y.length; o++) {
          e.on(y[o], this.emit.bind(this, y[o]));
        }

        return this._read = function (t) {
          l("wrapped _read", t), n && (n = !1, e.resume());
        }, this;
      }, Object.defineProperty(v.prototype, "readableHighWaterMark", {
        enumerable: !1,
        get: function get() {
          return this._readableState.highWaterMark;
        }
      }), v._fromList = B;
    }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {
    "./_stream_duplex": 167,
    "./internal/streams/BufferList": 172,
    "./internal/streams/destroy": 173,
    "./internal/streams/stream": 174,
    _process: 156,
    "core-util-is": 67,
    events: 103,
    inherits: 135,
    isarray: 137,
    "process-nextick-args": 155,
    "safe-buffer": 175,
    "string_decoder/": 176,
    util: 19
  }],
  170: [function (e, t, r) {
    "use strict";

    t.exports = a;
    var n = e("./_stream_duplex"),
        i = Object.create(e("core-util-is"));

    function o(e, t) {
      var r = this._transformState;
      r.transforming = !1;
      var n = r.writecb;
      if (!n) return this.emit("error", new Error("write callback called multiple times"));
      r.writechunk = null, r.writecb = null, null != t && this.push(t), n(e);
      var i = this._readableState;
      i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
    }

    function a(e) {
      if (!(this instanceof a)) return new a(e);
      n.call(this, e), this._transformState = {
        afterTransform: o.bind(this),
        needTransform: !1,
        transforming: !1,
        writecb: null,
        writechunk: null,
        writeencoding: null
      }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", s);
    }

    function s() {
      var e = this;
      "function" == typeof this._flush ? this._flush(function (t, r) {
        f(e, t, r);
      }) : f(this, null, null);
    }

    function f(e, t, r) {
      if (t) return e.emit("error", t);
      if (null != r && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return e.push(null);
    }

    i.inherits = e("inherits"), i.inherits(a, n), a.prototype.push = function (e, t) {
      return this._transformState.needTransform = !1, n.prototype.push.call(this, e, t);
    }, a.prototype._transform = function (e, t, r) {
      throw new Error("_transform() is not implemented");
    }, a.prototype._write = function (e, t, r) {
      var n = this._transformState;

      if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
        var i = this._readableState;
        (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
      }
    }, a.prototype._read = function (e) {
      var t = this._transformState;
      null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0;
    }, a.prototype._destroy = function (e, t) {
      var r = this;

      n.prototype._destroy.call(this, e, function (e) {
        t(e), r.emit("close");
      });
    };
  }, {
    "./_stream_duplex": 167,
    "core-util-is": 67,
    inherits: 135
  }],
  171: [function (e, t, r) {
    (function (r, n, i) {
      "use strict";

      var o = e("process-nextick-args");

      function a(e) {
        var t = this;
        this.next = null, this.entry = null, this.finish = function () {
          !function (e, t, r) {
            var n = e.entry;
            e.entry = null;

            for (; n;) {
              var i = n.callback;
              t.pendingcb--, i(r), n = n.next;
            }

            t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
          }(t, e);
        };
      }

      t.exports = g;
      var s,
          f = !r.browser && ["v0.10", "v0.9."].indexOf(r.version.slice(0, 5)) > -1 ? i : o.nextTick;
      g.WritableState = y;
      var u = Object.create(e("core-util-is"));
      u.inherits = e("inherits");

      var c = {
        deprecate: e("util-deprecate")
      },
          h = e("./internal/streams/stream"),
          d = e("safe-buffer").Buffer,
          l = n.Uint8Array || function () {};

      var p,
          b = e("./internal/streams/destroy");

      function m() {}

      function y(t, r) {
        s = s || e("./_stream_duplex"), t = t || {};
        var n = r instanceof s;
        this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.writableObjectMode);
        var i = t.highWaterMark,
            u = t.writableHighWaterMark,
            c = this.objectMode ? 16 : 16384;
        this.highWaterMark = i || 0 === i ? i : n && (u || 0 === u) ? u : c, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
        var h = !1 === t.decodeStrings;
        this.decodeStrings = !h, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
          !function (e, t) {
            var r = e._writableState,
                n = r.sync,
                i = r.writecb;
            if (function (e) {
              e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
            }(r), t) !function (e, t, r, n, i) {
              --t.pendingcb, r ? (o.nextTick(i, n), o.nextTick(S, e, t), e._writableState.errorEmitted = !0, e.emit("error", n)) : (i(n), e._writableState.errorEmitted = !0, e.emit("error", n), S(e, t));
            }(e, r, n, t, i);else {
              var a = E(r);
              a || r.corked || r.bufferProcessing || !r.bufferedRequest || _(e, r), n ? f(w, e, r, a, i) : w(e, r, a, i);
            }
          }(r, e);
        }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new a(this);
      }

      function g(t) {
        if (s = s || e("./_stream_duplex"), !(p.call(g, this) || this instanceof s)) return new g(t);
        this._writableState = new y(t, this), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), "function" == typeof t["final"] && (this._final = t["final"])), h.call(this);
      }

      function v(e, t, r, n, i, o, a) {
        t.writelen = n, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1;
      }

      function w(e, t, r, n) {
        r || function (e, t) {
          0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
        }(e, t), t.pendingcb--, n(), S(e, t);
      }

      function _(e, t) {
        t.bufferProcessing = !0;
        var r = t.bufferedRequest;

        if (e._writev && r && r.next) {
          var n = t.bufferedRequestCount,
              i = new Array(n),
              o = t.corkedRequestsFree;
          o.entry = r;

          for (var s = 0, f = !0; r;) {
            i[s] = r, r.isBuf || (f = !1), r = r.next, s += 1;
          }

          i.allBuffers = f, v(e, t, !0, t.length, i, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree = o.next, o.next = null) : t.corkedRequestsFree = new a(t), t.bufferedRequestCount = 0;
        } else {
          for (; r;) {
            var u = r.chunk,
                c = r.encoding,
                h = r.callback;
            if (v(e, t, !1, t.objectMode ? 1 : u.length, u, c, h), r = r.next, t.bufferedRequestCount--, t.writing) break;
          }

          null === r && (t.lastBufferedRequest = null);
        }

        t.bufferedRequest = r, t.bufferProcessing = !1;
      }

      function E(e) {
        return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
      }

      function M(e, t) {
        e._final(function (r) {
          t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), S(e, t);
        });
      }

      function S(e, t) {
        var r = E(t);
        return r && (!function (e, t) {
          t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++, t.finalCalled = !0, o.nextTick(M, e, t)) : (t.prefinished = !0, e.emit("prefinish")));
        }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), r;
      }

      u.inherits(g, h), y.prototype.getBuffer = function () {
        for (var e = this.bufferedRequest, t = []; e;) {
          t.push(e), e = e.next;
        }

        return t;
      }, function () {
        try {
          Object.defineProperty(y.prototype, "buffer", {
            get: c.deprecate(function () {
              return this.getBuffer();
            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
          });
        } catch (e) {}
      }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (p = Function.prototype[Symbol.hasInstance], Object.defineProperty(g, Symbol.hasInstance, {
        value: function value(e) {
          return !!p.call(this, e) || this === g && e && e._writableState instanceof y;
        }
      })) : p = function p(e) {
        return e instanceof this;
      }, g.prototype.pipe = function () {
        this.emit("error", new Error("Cannot pipe, not readable"));
      }, g.prototype.write = function (e, t, r) {
        var n,
            i = this._writableState,
            a = !1,
            s = !i.objectMode && (n = e, d.isBuffer(n) || n instanceof l);
        return s && !d.isBuffer(e) && (e = function (e) {
          return d.from(e);
        }(e)), "function" == typeof t && (r = t, t = null), s ? t = "buffer" : t || (t = i.defaultEncoding), "function" != typeof r && (r = m), i.ended ? function (e, t) {
          var r = new Error("write after end");
          e.emit("error", r), o.nextTick(t, r);
        }(this, r) : (s || function (e, t, r, n) {
          var i = !0,
              a = !1;
          return null === r ? a = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (a = new TypeError("Invalid non-string/buffer chunk")), a && (e.emit("error", a), o.nextTick(n, a), i = !1), i;
        }(this, i, e, r)) && (i.pendingcb++, a = function (e, t, r, n, i, o) {
          if (!r) {
            var a = function (e, t, r) {
              e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = d.from(t, r));
              return t;
            }(t, n, i);

            n !== a && (r = !0, i = "buffer", n = a);
          }

          var s = t.objectMode ? 1 : n.length;
          t.length += s;
          var f = t.length < t.highWaterMark;
          f || (t.needDrain = !0);

          if (t.writing || t.corked) {
            var u = t.lastBufferedRequest;
            t.lastBufferedRequest = {
              chunk: n,
              encoding: i,
              isBuf: r,
              callback: o,
              next: null
            }, u ? u.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
          } else v(e, t, !1, s, n, i, o);

          return f;
        }(this, i, s, e, t, r)), a;
      }, g.prototype.cork = function () {
        this._writableState.corked++;
      }, g.prototype.uncork = function () {
        var e = this._writableState;
        e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || _(this, e));
      }, g.prototype.setDefaultEncoding = function (e) {
        if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);
        return this._writableState.defaultEncoding = e, this;
      }, Object.defineProperty(g.prototype, "writableHighWaterMark", {
        enumerable: !1,
        get: function get() {
          return this._writableState.highWaterMark;
        }
      }), g.prototype._write = function (e, t, r) {
        r(new Error("_write() is not implemented"));
      }, g.prototype._writev = null, g.prototype.end = function (e, t, r) {
        var n = this._writableState;
        "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), n.ending || n.finished || function (e, t, r) {
          t.ending = !0, S(e, t), r && (t.finished ? o.nextTick(r) : e.once("finish", r));
          t.ended = !0, e.writable = !1;
        }(this, n, r);
      }, Object.defineProperty(g.prototype, "destroyed", {
        get: function get() {
          return void 0 !== this._writableState && this._writableState.destroyed;
        },
        set: function set(e) {
          this._writableState && (this._writableState.destroyed = e);
        }
      }), g.prototype.destroy = b.destroy, g.prototype._undestroy = b.undestroy, g.prototype._destroy = function (e, t) {
        this.end(), t(e);
      };
    }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("timers").setImmediate);
  }, {
    "./_stream_duplex": 167,
    "./internal/streams/destroy": 173,
    "./internal/streams/stream": 174,
    _process: 156,
    "core-util-is": 67,
    inherits: 135,
    "process-nextick-args": 155,
    "safe-buffer": 175,
    timers: 194,
    "util-deprecate": 195
  }],
  172: [function (e, t, r) {
    "use strict";

    var n = e("safe-buffer").Buffer,
        i = e("util");
    t.exports = function () {
      function e() {
        !function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, e), this.head = null, this.tail = null, this.length = 0;
      }

      return e.prototype.push = function (e) {
        var t = {
          data: e,
          next: null
        };
        this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
      }, e.prototype.unshift = function (e) {
        var t = {
          data: e,
          next: this.head
        };
        0 === this.length && (this.tail = t), this.head = t, ++this.length;
      }, e.prototype.shift = function () {
        if (0 !== this.length) {
          var e = this.head.data;
          return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
        }
      }, e.prototype.clear = function () {
        this.head = this.tail = null, this.length = 0;
      }, e.prototype.join = function (e) {
        if (0 === this.length) return "";

        for (var t = this.head, r = "" + t.data; t = t.next;) {
          r += e + t.data;
        }

        return r;
      }, e.prototype.concat = function (e) {
        if (0 === this.length) return n.alloc(0);
        if (1 === this.length) return this.head.data;

        for (var t, r, i, o = n.allocUnsafe(e >>> 0), a = this.head, s = 0; a;) {
          t = a.data, r = o, i = s, t.copy(r, i), s += a.data.length, a = a.next;
        }

        return o;
      }, e;
    }(), i && i.inspect && i.inspect.custom && (t.exports.prototype[i.inspect.custom] = function () {
      var e = i.inspect({
        length: this.length
      });
      return this.constructor.name + " " + e;
    });
  }, {
    "safe-buffer": 175,
    util: 19
  }],
  173: [function (e, t, r) {
    "use strict";

    var n = e("process-nextick-args");

    function i(e, t) {
      e.emit("error", t);
    }

    t.exports = {
      destroy: function destroy(e, t) {
        var r = this,
            o = this._readableState && this._readableState.destroyed,
            a = this._writableState && this._writableState.destroyed;
        return o || a ? (t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || n.nextTick(i, this, e), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) {
          !t && e ? (n.nextTick(i, r, e), r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e);
        }), this);
      },
      undestroy: function undestroy() {
        this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
      }
    };
  }, {
    "process-nextick-args": 155
  }],
  174: [function (e, t, r) {
    arguments[4][61][0].apply(r, arguments);
  }, {
    dup: 61,
    events: 103
  }],
  175: [function (e, t, r) {
    var n = e("buffer"),
        i = n.Buffer;

    function o(e, t) {
      for (var r in e) {
        t[r] = e[r];
      }
    }

    function a(e, t, r) {
      return i(e, t, r);
    }

    i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (o(n, r), r.Buffer = a), o(i, a), a.from = function (e, t, r) {
      if ("number" == typeof e) throw new TypeError("Argument must not be a number");
      return i(e, t, r);
    }, a.alloc = function (e, t, r) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      var n = i(e);
      return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), n;
    }, a.allocUnsafe = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return i(e);
    }, a.allocUnsafeSlow = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return n.SlowBuffer(e);
    };
  }, {
    buffer: 65
  }],
  176: [function (e, t, r) {
    "use strict";

    var n = e("safe-buffer").Buffer,
        i = n.isEncoding || function (e) {
      switch ((e = "" + e) && e.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return !0;

        default:
          return !1;
      }
    };

    function o(e) {
      var t;

      switch (this.encoding = function (e) {
        var t = function (e) {
          if (!e) return "utf8";

          for (var t;;) {
            switch (e) {
              case "utf8":
              case "utf-8":
                return "utf8";

              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return "utf16le";

              case "latin1":
              case "binary":
                return "latin1";

              case "base64":
              case "ascii":
              case "hex":
                return e;

              default:
                if (t) return;
                e = ("" + e).toLowerCase(), t = !0;
            }
          }
        }(e);

        if ("string" != typeof t && (n.isEncoding === i || !i(e))) throw new Error("Unknown encoding: " + e);
        return t || e;
      }(e), this.encoding) {
        case "utf16le":
          this.text = f, this.end = u, t = 4;
          break;

        case "utf8":
          this.fillLast = s, t = 4;
          break;

        case "base64":
          this.text = c, this.end = h, t = 3;
          break;

        default:
          return this.write = d, void (this.end = l);
      }

      this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(t);
    }

    function a(e) {
      return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
    }

    function s(e) {
      var t = this.lastTotal - this.lastNeed,
          r = function (e, t, r) {
        if (128 != (192 & t[0])) return e.lastNeed = 0, "�";

        if (e.lastNeed > 1 && t.length > 1) {
          if (128 != (192 & t[1])) return e.lastNeed = 1, "�";
          if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, "�";
        }
      }(this, e);

      return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void (this.lastNeed -= e.length));
    }

    function f(e, t) {
      if ((e.length - t) % 2 == 0) {
        var r = e.toString("utf16le", t);

        if (r) {
          var n = r.charCodeAt(r.length - 1);
          if (n >= 55296 && n <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1);
        }

        return r;
      }

      return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1);
    }

    function u(e) {
      var t = e && e.length ? this.write(e) : "";

      if (this.lastNeed) {
        var r = this.lastTotal - this.lastNeed;
        return t + this.lastChar.toString("utf16le", 0, r);
      }

      return t;
    }

    function c(e, t) {
      var r = (e.length - t) % 3;
      return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r));
    }

    function h(e) {
      var t = e && e.length ? this.write(e) : "";
      return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
    }

    function d(e) {
      return e.toString(this.encoding);
    }

    function l(e) {
      return e && e.length ? this.write(e) : "";
    }

    r.StringDecoder = o, o.prototype.write = function (e) {
      if (0 === e.length) return "";
      var t, r;

      if (this.lastNeed) {
        if (void 0 === (t = this.fillLast(e))) return "";
        r = this.lastNeed, this.lastNeed = 0;
      } else r = 0;

      return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "";
    }, o.prototype.end = function (e) {
      var t = e && e.length ? this.write(e) : "";
      return this.lastNeed ? t + "�" : t;
    }, o.prototype.text = function (e, t) {
      var r = function (e, t, r) {
        var n = t.length - 1;
        if (n < r) return 0;
        var i = a(t[n]);
        if (i >= 0) return i > 0 && (e.lastNeed = i - 1), i;
        if (--n < r || -2 === i) return 0;
        if ((i = a(t[n])) >= 0) return i > 0 && (e.lastNeed = i - 2), i;
        if (--n < r || -2 === i) return 0;
        if ((i = a(t[n])) >= 0) return i > 0 && (2 === i ? i = 0 : e.lastNeed = i - 3), i;
        return 0;
      }(this, e, t);

      if (!this.lastNeed) return e.toString("utf8", t);
      this.lastTotal = r;
      var n = e.length - (r - this.lastNeed);
      return e.copy(this.lastChar, 0, n), e.toString("utf8", t, n);
    }, o.prototype.fillLast = function (e) {
      if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
      e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
    };
  }, {
    "safe-buffer": 175
  }],
  177: [function (e, t, r) {
    t.exports = e("./readable").PassThrough;
  }, {
    "./readable": 178
  }],
  178: [function (e, t, r) {
    (r = t.exports = e("./lib/_stream_readable.js")).Stream = r, r.Readable = r, r.Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js");
  }, {
    "./lib/_stream_duplex.js": 167,
    "./lib/_stream_passthrough.js": 168,
    "./lib/_stream_readable.js": 169,
    "./lib/_stream_transform.js": 170,
    "./lib/_stream_writable.js": 171
  }],
  179: [function (e, t, r) {
    t.exports = e("./readable").Transform;
  }, {
    "./readable": 178
  }],
  180: [function (e, t, r) {
    t.exports = e("./lib/_stream_writable.js");
  }, {
    "./lib/_stream_writable.js": 171
  }],
  181: [function (e, t, r) {
    "use strict";

    var n = e("buffer").Buffer,
        i = e("inherits"),
        o = e("hash-base"),
        a = new Array(16),
        s = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
        f = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
        u = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
        c = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11],
        h = [0, 1518500249, 1859775393, 2400959708, 2840853838],
        d = [1352829926, 1548603684, 1836072691, 2053994217, 0];

    function l() {
      o.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
    }

    function p(e, t) {
      return e << t | e >>> 32 - t;
    }

    function b(e, t, r, n, i, o, a, s) {
      return p(e + (t ^ r ^ n) + o + a | 0, s) + i | 0;
    }

    function m(e, t, r, n, i, o, a, s) {
      return p(e + (t & r | ~t & n) + o + a | 0, s) + i | 0;
    }

    function y(e, t, r, n, i, o, a, s) {
      return p(e + ((t | ~r) ^ n) + o + a | 0, s) + i | 0;
    }

    function g(e, t, r, n, i, o, a, s) {
      return p(e + (t & n | r & ~n) + o + a | 0, s) + i | 0;
    }

    function v(e, t, r, n, i, o, a, s) {
      return p(e + (t ^ (r | ~n)) + o + a | 0, s) + i | 0;
    }

    i(l, o), l.prototype._update = function () {
      for (var e = a, t = 0; t < 16; ++t) {
        e[t] = this._block.readInt32LE(4 * t);
      }

      for (var r = 0 | this._a, n = 0 | this._b, i = 0 | this._c, o = 0 | this._d, l = 0 | this._e, w = 0 | this._a, _ = 0 | this._b, E = 0 | this._c, M = 0 | this._d, S = 0 | this._e, k = 0; k < 80; k += 1) {
        var A, x;
        k < 16 ? (A = b(r, n, i, o, l, e[s[k]], h[0], u[k]), x = v(w, _, E, M, S, e[f[k]], d[0], c[k])) : k < 32 ? (A = m(r, n, i, o, l, e[s[k]], h[1], u[k]), x = g(w, _, E, M, S, e[f[k]], d[1], c[k])) : k < 48 ? (A = y(r, n, i, o, l, e[s[k]], h[2], u[k]), x = y(w, _, E, M, S, e[f[k]], d[2], c[k])) : k < 64 ? (A = g(r, n, i, o, l, e[s[k]], h[3], u[k]), x = m(w, _, E, M, S, e[f[k]], d[3], c[k])) : (A = v(r, n, i, o, l, e[s[k]], h[4], u[k]), x = b(w, _, E, M, S, e[f[k]], d[4], c[k])), r = l, l = o, o = p(i, 10), i = n, n = A, w = S, S = M, M = p(E, 10), E = _, _ = x;
      }

      var R = this._b + i + M | 0;
      this._b = this._c + o + S | 0, this._c = this._d + l + w | 0, this._d = this._e + r + _ | 0, this._e = this._a + n + E | 0, this._a = R;
    }, l.prototype._digest = function () {
      this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
      var e = n.alloc ? n.alloc(20) : new n(20);
      return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e.writeInt32LE(this._e, 16), e;
    }, t.exports = l;
  }, {
    buffer: 65,
    "hash-base": 105,
    inherits: 135
  }],
  182: [function (e, t, r) {
    /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
    var n = e("buffer"),
        i = n.Buffer;

    function o(e, t) {
      for (var r in e) {
        t[r] = e[r];
      }
    }

    function a(e, t, r) {
      return i(e, t, r);
    }

    i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (o(n, r), r.Buffer = a), a.prototype = Object.create(i.prototype), o(i, a), a.from = function (e, t, r) {
      if ("number" == typeof e) throw new TypeError("Argument must not be a number");
      return i(e, t, r);
    }, a.alloc = function (e, t, r) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      var n = i(e);
      return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), n;
    }, a.allocUnsafe = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return i(e);
    }, a.allocUnsafeSlow = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return n.SlowBuffer(e);
    };
  }, {
    buffer: 65
  }],
  183: [function (e, t, r) {
    (function (r) {
      "use strict";

      var n,
          i = e("buffer"),
          o = i.Buffer,
          a = {};

      for (n in i) {
        i.hasOwnProperty(n) && "SlowBuffer" !== n && "Buffer" !== n && (a[n] = i[n]);
      }

      var s = a.Buffer = {};

      for (n in o) {
        o.hasOwnProperty(n) && "allocUnsafe" !== n && "allocUnsafeSlow" !== n && (s[n] = o[n]);
      }

      if (a.Buffer.prototype = o.prototype, s.from && s.from !== Uint8Array.from || (s.from = function (e, t, r) {
        if ("number" == typeof e) throw new TypeError('The "value" argument must not be of type number. Received type ' + _typeof(e));
        if (e && void 0 === e.length) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + _typeof(e));
        return o(e, t, r);
      }), s.alloc || (s.alloc = function (e, t, r) {
        if ("number" != typeof e) throw new TypeError('The "size" argument must be of type number. Received type ' + _typeof(e));
        if (e < 0 || e >= 2 * (1 << 30)) throw new RangeError('The value "' + e + '" is invalid for option "size"');
        var n = o(e);
        return t && 0 !== t.length ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), n;
      }), !a.kStringMaxLength) try {
        a.kStringMaxLength = r.binding("buffer").kStringMaxLength;
      } catch (e) {}
      a.constants || (a.constants = {
        MAX_LENGTH: a.kMaxLength
      }, a.kStringMaxLength && (a.constants.MAX_STRING_LENGTH = a.kStringMaxLength)), t.exports = a;
    }).call(this, e("_process"));
  }, {
    _process: 156,
    buffer: 65
  }],
  184: [function (e, t, r) {
    var n = e("safe-buffer").Buffer;

    function i(e, t) {
      this._block = n.alloc(e), this._finalSize = t, this._blockSize = e, this._len = 0;
    }

    i.prototype.update = function (e, t) {
      "string" == typeof e && (t = t || "utf8", e = n.from(e, t));

      for (var r = this._block, i = this._blockSize, o = e.length, a = this._len, s = 0; s < o;) {
        for (var f = a % i, u = Math.min(o - s, i - f), c = 0; c < u; c++) {
          r[f + c] = e[s + c];
        }

        s += u, (a += u) % i == 0 && this._update(r);
      }

      return this._len += o, this;
    }, i.prototype.digest = function (e) {
      var t = this._len % this._blockSize;
      this._block[t] = 128, this._block.fill(0, t + 1), t >= this._finalSize && (this._update(this._block), this._block.fill(0));
      var r = 8 * this._len;
      if (r <= 4294967295) this._block.writeUInt32BE(r, this._blockSize - 4);else {
        var n = (4294967295 & r) >>> 0,
            i = (r - n) / 4294967296;
        this._block.writeUInt32BE(i, this._blockSize - 8), this._block.writeUInt32BE(n, this._blockSize - 4);
      }

      this._update(this._block);

      var o = this._hash();

      return e ? o.toString(e) : o;
    }, i.prototype._update = function () {
      throw new Error("_update must be implemented by subclass");
    }, t.exports = i;
  }, {
    "safe-buffer": 182
  }],
  185: [function (e, t, r) {
    (r = t.exports = function (e) {
      e = e.toLowerCase();
      var t = r[e];
      if (!t) throw new Error(e + " is not supported (we accept pull requests)");
      return new t();
    }).sha = e("./sha"), r.sha1 = e("./sha1"), r.sha224 = e("./sha224"), r.sha256 = e("./sha256"), r.sha384 = e("./sha384"), r.sha512 = e("./sha512");
  }, {
    "./sha": 186,
    "./sha1": 187,
    "./sha224": 188,
    "./sha256": 189,
    "./sha384": 190,
    "./sha512": 191
  }],
  186: [function (e, t, r) {
    var n = e("inherits"),
        i = e("./hash"),
        o = e("safe-buffer").Buffer,
        a = [1518500249, 1859775393, -1894007588, -899497514],
        s = new Array(80);

    function f() {
      this.init(), this._w = s, i.call(this, 64, 56);
    }

    function u(e) {
      return e << 30 | e >>> 2;
    }

    function c(e, t, r, n) {
      return 0 === e ? t & r | ~t & n : 2 === e ? t & r | t & n | r & n : t ^ r ^ n;
    }

    n(f, i), f.prototype.init = function () {
      return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
    }, f.prototype._update = function (e) {
      for (var t, r = this._w, n = 0 | this._a, i = 0 | this._b, o = 0 | this._c, s = 0 | this._d, f = 0 | this._e, h = 0; h < 16; ++h) {
        r[h] = e.readInt32BE(4 * h);
      }

      for (; h < 80; ++h) {
        r[h] = r[h - 3] ^ r[h - 8] ^ r[h - 14] ^ r[h - 16];
      }

      for (var d = 0; d < 80; ++d) {
        var l = ~~(d / 20),
            p = 0 | ((t = n) << 5 | t >>> 27) + c(l, i, o, s) + f + r[d] + a[l];
        f = s, s = o, o = u(i), i = n, n = p;
      }

      this._a = n + this._a | 0, this._b = i + this._b | 0, this._c = o + this._c | 0, this._d = s + this._d | 0, this._e = f + this._e | 0;
    }, f.prototype._hash = function () {
      var e = o.allocUnsafe(20);
      return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e;
    }, t.exports = f;
  }, {
    "./hash": 184,
    inherits: 135,
    "safe-buffer": 182
  }],
  187: [function (e, t, r) {
    var n = e("inherits"),
        i = e("./hash"),
        o = e("safe-buffer").Buffer,
        a = [1518500249, 1859775393, -1894007588, -899497514],
        s = new Array(80);

    function f() {
      this.init(), this._w = s, i.call(this, 64, 56);
    }

    function u(e) {
      return e << 5 | e >>> 27;
    }

    function c(e) {
      return e << 30 | e >>> 2;
    }

    function h(e, t, r, n) {
      return 0 === e ? t & r | ~t & n : 2 === e ? t & r | t & n | r & n : t ^ r ^ n;
    }

    n(f, i), f.prototype.init = function () {
      return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
    }, f.prototype._update = function (e) {
      for (var t, r = this._w, n = 0 | this._a, i = 0 | this._b, o = 0 | this._c, s = 0 | this._d, f = 0 | this._e, d = 0; d < 16; ++d) {
        r[d] = e.readInt32BE(4 * d);
      }

      for (; d < 80; ++d) {
        r[d] = (t = r[d - 3] ^ r[d - 8] ^ r[d - 14] ^ r[d - 16]) << 1 | t >>> 31;
      }

      for (var l = 0; l < 80; ++l) {
        var p = ~~(l / 20),
            b = u(n) + h(p, i, o, s) + f + r[l] + a[p] | 0;
        f = s, s = o, o = c(i), i = n, n = b;
      }

      this._a = n + this._a | 0, this._b = i + this._b | 0, this._c = o + this._c | 0, this._d = s + this._d | 0, this._e = f + this._e | 0;
    }, f.prototype._hash = function () {
      var e = o.allocUnsafe(20);
      return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e;
    }, t.exports = f;
  }, {
    "./hash": 184,
    inherits: 135,
    "safe-buffer": 182
  }],
  188: [function (e, t, r) {
    var n = e("inherits"),
        i = e("./sha256"),
        o = e("./hash"),
        a = e("safe-buffer").Buffer,
        s = new Array(64);

    function f() {
      this.init(), this._w = s, o.call(this, 64, 56);
    }

    n(f, i), f.prototype.init = function () {
      return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
    }, f.prototype._hash = function () {
      var e = a.allocUnsafe(28);
      return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e;
    }, t.exports = f;
  }, {
    "./hash": 184,
    "./sha256": 189,
    inherits: 135,
    "safe-buffer": 182
  }],
  189: [function (e, t, r) {
    var n = e("inherits"),
        i = e("./hash"),
        o = e("safe-buffer").Buffer,
        a = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
        s = new Array(64);

    function f() {
      this.init(), this._w = s, i.call(this, 64, 56);
    }

    function u(e, t, r) {
      return r ^ e & (t ^ r);
    }

    function c(e, t, r) {
      return e & t | r & (e | t);
    }

    function h(e) {
      return (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^ (e >>> 22 | e << 10);
    }

    function d(e) {
      return (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
    }

    function l(e) {
      return (e >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3;
    }

    n(f, i), f.prototype.init = function () {
      return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
    }, f.prototype._update = function (e) {
      for (var t, r = this._w, n = 0 | this._a, i = 0 | this._b, o = 0 | this._c, s = 0 | this._d, f = 0 | this._e, p = 0 | this._f, b = 0 | this._g, m = 0 | this._h, y = 0; y < 16; ++y) {
        r[y] = e.readInt32BE(4 * y);
      }

      for (; y < 64; ++y) {
        r[y] = 0 | (((t = r[y - 2]) >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10) + r[y - 7] + l(r[y - 15]) + r[y - 16];
      }

      for (var g = 0; g < 64; ++g) {
        var v = m + d(f) + u(f, p, b) + a[g] + r[g] | 0,
            w = h(n) + c(n, i, o) | 0;
        m = b, b = p, p = f, f = s + v | 0, s = o, o = i, i = n, n = v + w | 0;
      }

      this._a = n + this._a | 0, this._b = i + this._b | 0, this._c = o + this._c | 0, this._d = s + this._d | 0, this._e = f + this._e | 0, this._f = p + this._f | 0, this._g = b + this._g | 0, this._h = m + this._h | 0;
    }, f.prototype._hash = function () {
      var e = o.allocUnsafe(32);
      return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e.writeInt32BE(this._h, 28), e;
    }, t.exports = f;
  }, {
    "./hash": 184,
    inherits: 135,
    "safe-buffer": 182
  }],
  190: [function (e, t, r) {
    var n = e("inherits"),
        i = e("./sha512"),
        o = e("./hash"),
        a = e("safe-buffer").Buffer,
        s = new Array(160);

    function f() {
      this.init(), this._w = s, o.call(this, 128, 112);
    }

    n(f, i), f.prototype.init = function () {
      return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
    }, f.prototype._hash = function () {
      var e = a.allocUnsafe(48);

      function t(t, r, n) {
        e.writeInt32BE(t, n), e.writeInt32BE(r, n + 4);
      }

      return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), e;
    }, t.exports = f;
  }, {
    "./hash": 184,
    "./sha512": 191,
    inherits: 135,
    "safe-buffer": 182
  }],
  191: [function (e, t, r) {
    var n = e("inherits"),
        i = e("./hash"),
        o = e("safe-buffer").Buffer,
        a = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591],
        s = new Array(160);

    function f() {
      this.init(), this._w = s, i.call(this, 128, 112);
    }

    function u(e, t, r) {
      return r ^ e & (t ^ r);
    }

    function c(e, t, r) {
      return e & t | r & (e | t);
    }

    function h(e, t) {
      return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25);
    }

    function d(e, t) {
      return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23);
    }

    function l(e, t) {
      return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ e >>> 7;
    }

    function p(e, t) {
      return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ (e >>> 7 | t << 25);
    }

    function b(e, t) {
      return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ e >>> 6;
    }

    function m(e, t) {
      return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ (e >>> 6 | t << 26);
    }

    function y(e, t) {
      return e >>> 0 < t >>> 0 ? 1 : 0;
    }

    n(f, i), f.prototype.init = function () {
      return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
    }, f.prototype._update = function (e) {
      for (var t = this._w, r = 0 | this._ah, n = 0 | this._bh, i = 0 | this._ch, o = 0 | this._dh, s = 0 | this._eh, f = 0 | this._fh, g = 0 | this._gh, v = 0 | this._hh, w = 0 | this._al, _ = 0 | this._bl, E = 0 | this._cl, M = 0 | this._dl, S = 0 | this._el, k = 0 | this._fl, A = 0 | this._gl, x = 0 | this._hl, R = 0; R < 32; R += 2) {
        t[R] = e.readInt32BE(4 * R), t[R + 1] = e.readInt32BE(4 * R + 4);
      }

      for (; R < 160; R += 2) {
        var I = t[R - 30],
            B = t[R - 30 + 1],
            T = l(I, B),
            j = p(B, I),
            D = b(I = t[R - 4], B = t[R - 4 + 1]),
            P = m(B, I),
            O = t[R - 14],
            C = t[R - 14 + 1],
            L = t[R - 32],
            N = t[R - 32 + 1],
            U = j + C | 0,
            q = T + O + y(U, j) | 0;
        q = (q = q + D + y(U = U + P | 0, P) | 0) + L + y(U = U + N | 0, N) | 0, t[R] = q, t[R + 1] = U;
      }

      for (var z = 0; z < 160; z += 2) {
        q = t[z], U = t[z + 1];
        var F = c(r, n, i),
            H = c(w, _, E),
            K = h(r, w),
            W = h(w, r),
            V = d(s, S),
            X = d(S, s),
            G = a[z],
            Z = a[z + 1],
            Y = u(s, f, g),
            J = u(S, k, A),
            $ = x + X | 0,
            Q = v + V + y($, x) | 0;
        Q = (Q = (Q = Q + Y + y($ = $ + J | 0, J) | 0) + G + y($ = $ + Z | 0, Z) | 0) + q + y($ = $ + U | 0, U) | 0;
        var ee = W + H | 0,
            te = K + F + y(ee, W) | 0;
        v = g, x = A, g = f, A = k, f = s, k = S, s = o + Q + y(S = M + $ | 0, M) | 0, o = i, M = E, i = n, E = _, n = r, _ = w, r = Q + te + y(w = $ + ee | 0, $) | 0;
      }

      this._al = this._al + w | 0, this._bl = this._bl + _ | 0, this._cl = this._cl + E | 0, this._dl = this._dl + M | 0, this._el = this._el + S | 0, this._fl = this._fl + k | 0, this._gl = this._gl + A | 0, this._hl = this._hl + x | 0, this._ah = this._ah + r + y(this._al, w) | 0, this._bh = this._bh + n + y(this._bl, _) | 0, this._ch = this._ch + i + y(this._cl, E) | 0, this._dh = this._dh + o + y(this._dl, M) | 0, this._eh = this._eh + s + y(this._el, S) | 0, this._fh = this._fh + f + y(this._fl, k) | 0, this._gh = this._gh + g + y(this._gl, A) | 0, this._hh = this._hh + v + y(this._hl, x) | 0;
    }, f.prototype._hash = function () {
      var e = o.allocUnsafe(64);

      function t(t, r, n) {
        e.writeInt32BE(t, n), e.writeInt32BE(r, n + 4);
      }

      return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), t(this._gh, this._gl, 48), t(this._hh, this._hl, 56), e;
    }, t.exports = f;
  }, {
    "./hash": 184,
    inherits: 135,
    "safe-buffer": 182
  }],
  192: [function (e, t, r) {
    t.exports = i;
    var n = e("events").EventEmitter;

    function i() {
      n.call(this);
    }

    e("inherits")(i, n), i.Readable = e("readable-stream/readable.js"), i.Writable = e("readable-stream/writable.js"), i.Duplex = e("readable-stream/duplex.js"), i.Transform = e("readable-stream/transform.js"), i.PassThrough = e("readable-stream/passthrough.js"), i.Stream = i, i.prototype.pipe = function (e, t) {
      var r = this;

      function i(t) {
        e.writable && !1 === e.write(t) && r.pause && r.pause();
      }

      function o() {
        r.readable && r.resume && r.resume();
      }

      r.on("data", i), e.on("drain", o), e._isStdio || t && !1 === t.end || (r.on("end", s), r.on("close", f));
      var a = !1;

      function s() {
        a || (a = !0, e.end());
      }

      function f() {
        a || (a = !0, "function" == typeof e.destroy && e.destroy());
      }

      function u(e) {
        if (c(), 0 === n.listenerCount(this, "error")) throw e;
      }

      function c() {
        r.removeListener("data", i), e.removeListener("drain", o), r.removeListener("end", s), r.removeListener("close", f), r.removeListener("error", u), e.removeListener("error", u), r.removeListener("end", c), r.removeListener("close", c), e.removeListener("close", c);
      }

      return r.on("error", u), e.on("error", u), r.on("end", c), r.on("close", c), e.on("close", c), e.emit("pipe", r), e;
    };
  }, {
    events: 103,
    inherits: 135,
    "readable-stream/duplex.js": 166,
    "readable-stream/passthrough.js": 177,
    "readable-stream/readable.js": 178,
    "readable-stream/transform.js": 179,
    "readable-stream/writable.js": 180
  }],
  193: [function (e, t, r) {
    arguments[4][176][0].apply(r, arguments);
  }, {
    dup: 176,
    "safe-buffer": 182
  }],
  194: [function (e, t, r) {
    (function (t, n) {
      var i = e("process/browser.js").nextTick,
          o = Function.prototype.apply,
          a = Array.prototype.slice,
          s = {},
          f = 0;

      function u(e, t) {
        this._id = e, this._clearFn = t;
      }

      r.setTimeout = function () {
        return new u(o.call(setTimeout, window, arguments), clearTimeout);
      }, r.setInterval = function () {
        return new u(o.call(setInterval, window, arguments), clearInterval);
      }, r.clearTimeout = r.clearInterval = function (e) {
        e.close();
      }, u.prototype.unref = u.prototype.ref = function () {}, u.prototype.close = function () {
        this._clearFn.call(window, this._id);
      }, r.enroll = function (e, t) {
        clearTimeout(e._idleTimeoutId), e._idleTimeout = t;
      }, r.unenroll = function (e) {
        clearTimeout(e._idleTimeoutId), e._idleTimeout = -1;
      }, r._unrefActive = r.active = function (e) {
        clearTimeout(e._idleTimeoutId);
        var t = e._idleTimeout;
        t >= 0 && (e._idleTimeoutId = setTimeout(function () {
          e._onTimeout && e._onTimeout();
        }, t));
      }, r.setImmediate = "function" == typeof t ? t : function (e) {
        var t = f++,
            n = !(arguments.length < 2) && a.call(arguments, 1);
        return s[t] = !0, i(function () {
          s[t] && (n ? e.apply(null, n) : e.call(null), r.clearImmediate(t));
        }), t;
      }, r.clearImmediate = "function" == typeof n ? n : function (e) {
        delete s[e];
      };
    }).call(this, e("timers").setImmediate, e("timers").clearImmediate);
  }, {
    "process/browser.js": 156,
    timers: 194
  }],
  195: [function (e, t, r) {
    (function (e) {
      function r(t) {
        try {
          if (!e.localStorage) return !1;
        } catch (e) {
          return !1;
        }

        var r = e.localStorage[t];
        return null != r && "true" === String(r).toLowerCase();
      }

      t.exports = function (e, t) {
        if (r("noDeprecation")) return e;
        var n = !1;
        return function () {
          if (!n) {
            if (r("throwDeprecation")) throw new Error(t);
            r("traceDeprecation") ? console.trace(t) : console.warn(t), n = !0;
          }

          return e.apply(this, arguments);
        };
      };
    }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {}],
  196: [function (e, t, r) {
    (function (t) {
      "use strict";

      function r(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
        }
      }

      var n = e("./missile-dec.js");
      e("./static-mem.js");

      n.onRuntimeInitialized = function () {
        t.STATIC_MEM_wasmDecoderState = 1, t.STATIC_MEM_wasmDecoderState;
      };

      var i = function () {
        function e(r, n) {
          !function (e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }(this, e);
          t.STATICE_MEM_playerCount += 1, this.playerIndex = t.STATICE_MEM_playerCount, this._token = r, this._version = n, this._decoder = null, this._pix_format = "", this.initFinish = null;
        }

        var i, o, a;
        return i = e, (o = [{
          key: "_afterInitDecoderRegistPlayer",
          value: function value() {
            this._decoder = n.cwrap("registerPlayer", "number", ["string", "string"])(this._token, this._version);
          }
        }, {
          key: "initDecoder",
          value: function value() {
            var e = this,
                r = window.setInterval(function () {
              if (t.STATICE_MEM_playerIndexPtr === e.playerIndex) if (t.STATICE_MEM_playerIndexPtr, e.playerIndex, window.WebAssembly) t.STATIC_MEM_wasmDecoderState, 1 == t.STATIC_MEM_wasmDecoderState && (e._afterInitDecoderRegistPlayer(), e.initFinish && e.initFinish(), t.STATICE_MEM_playerIndexPtr += 1, window.clearInterval(r), r = null);else {
                var n = "unsupport WASM!";
                /iPhone|iPad/.test(window.navigator.userAgent) && (n += " ios:min-version 11"), alert(n), alert("Please check your browers, it not support wasm! See:https://www.caniuse.com/#search=wasm"), t.STATICE_MEM_playerIndexPtr += 1, window.clearInterval(r), r = null;
              }
            }, 500);
          }
        }, {
          key: "bindCallback",
          value: function value(e) {
            var t = this,
                r = n.addFunction(function (r, i, o, a, s, f, u, c, h, d, l) {
              var p = n.HEAPU8.subarray(r, r + a * c),
                  b = n.HEAPU8.subarray(i, i + s * c / 2),
                  m = n.HEAPU8.subarray(o, o + f * c / 2),
                  y = new Uint8Array(p),
                  g = new Uint8Array(b),
                  v = new Uint8Array(m);

              if ("" === t._pix_format || t._pix_format.length <= 0) {
                for (var w = n.HEAPU8.subarray(l, l + d), _ = "", E = 0; E < w.length; E++) {
                  _ += String.fromCharCode(w[E]);
                }

                t._pix_format = _;
              }

              e(y, g, v, a, s, f, u, c, h, t._pix_format);
            });
            return n.cwrap("setCodecType", "number", ["number", "number", "number"])(this._decoder, 0, r), n.cwrap("initMissile", "number", ["number"])(this._decoder), n.cwrap("initializeDecoder", "number", ["number"])(this._decoder);
          }
        }, {
          key: "release",
          value: function value() {
            n.cwrap("release", "number", ["number"])(this._decoder);
          }
        }, {
          key: "decodeNalu",
          value: function value(e, t) {
            var r = n._malloc(e.length);

            n.HEAP8.set(e, r);
            var i = parseInt(1e3 * t),
                o = n.cwrap("decodeCodecContext", "number", ["number", "number", "number", "number"])(this._decoder, r, e.length, i);
            return n._free(r), o;
          }
        }]) && r(i.prototype, o), a && r(i, a), e;
      }();

      t.MissileDecoderModule = i;
    }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {
    "./missile-dec.js": 197,
    "./static-mem.js": 198
  }],
  197: [function (e, t, r) {
    (function (r, n, i) {
      "use strict";

      function o(e) {
        return (o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
          return _typeof(e);
        } : function (e) {
          return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
        })(e);
      }

      var a,
          s = void 0 !== s ? s : {},
          f = {};

      for (a in s) {
        s.hasOwnProperty(a) && (f[a] = s[a]);
      }

      var u = [],
          c = "./this.program",
          h = !1,
          d = !1,
          l = !1,
          p = !1,
          b = !1;
      h = "object" === ("undefined" == typeof window ? "undefined" : o(window)), d = "function" == typeof importScripts, p = "object" === (void 0 === r ? "undefined" : o(r)) && "object" === o(r.versions) && "string" == typeof r.versions.node, l = p && !h && !d, b = !h && !l && !d;
      var m,
          y,
          g,
          v,
          w = "";

      function _(e) {
        return s.locateFile ? s.locateFile(e, w) : w + e;
      }

      l ? (w = i + "/", m = function m(t, r) {
        var n;
        return g || (g = e("fs")), v || (v = e("path")), t = v.normalize(t), n = g.readFileSync(t), r ? n : n.toString();
      }, y = function y(e) {
        var t = m(e, !0);
        return t.buffer || (t = new Uint8Array(t)), C(t.buffer), t;
      }, r.argv.length > 1 && (c = r.argv[1].replace(/\\/g, "/")), u = r.argv.slice(2), void 0 !== t && (t.exports = s), r.on("uncaughtException", function (e) {
        if (!(e instanceof Er)) throw e;
      }), r.on("unhandledRejection", Te), s.inspect = function () {
        return "[Emscripten Module object]";
      }) : b ? ("undefined" != typeof read && (m = function m(e) {
        return read(e);
      }), y = function y(e) {
        var t;
        return "function" == typeof readbuffer ? new Uint8Array(readbuffer(e)) : (C("object" === o(t = read(e, "binary"))), t);
      }, "undefined" != typeof scriptArgs ? u = scriptArgs : void 0 !== arguments && (u = arguments), "function" == typeof quit && function (e) {
        quit(e);
      }, "undefined" != typeof print && ("undefined" == typeof console && (console = {}), console.log = print, console.warn = console.error = "undefined" != typeof printErr ? printErr : print)) : (h || d) && (d ? w = self.location.href : document.currentScript && (w = document.currentScript.src), w = 0 !== w.indexOf("blob:") ? w.substr(0, w.lastIndexOf("/") + 1) : "", m = function m(e) {
        var t = new XMLHttpRequest();
        return t.open("GET", e, !1), t.send(null), t.responseText;
      }, d && (y = function y(e) {
        var t = new XMLHttpRequest();
        return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
      }), function (e, t, r) {
        var n = new XMLHttpRequest();
        n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = function () {
          200 == n.status || 0 == n.status && n.response ? t(n.response) : r();
        }, n.onerror = r, n.send(null);
      });
      var E = s.print || console.log.bind(console),
          M = s.printErr || console.warn.bind(console);

      for (a in f) {
        f.hasOwnProperty(a) && (s[a] = f[a]);
      }

      function S(e) {
        var t = te[se >> 2],
            r = t + e + 15 & -16;
        return r > mt() && Te(), te[se >> 2] = r, t;
      }

      f = null, s.arguments && (u = s.arguments), s.thisProgram && (c = s.thisProgram), s.quit && s.quit;
      var k = {
        "f64-rem": function f64Rem(e, t) {
          return e % t;
        },
        "debugger": function _debugger() {}
      },
          A = 1,
          x = new Array(14);

      function R(e, t) {
        for (var r = 0; r < 14; r++) {
          if (!x[r]) return x[r] = e, A + r;
        }

        throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
      }

      var I,
          B,
          T,
          j = 0,
          D = function D() {
        return j;
      };

      s.wasmBinary && (I = s.wasmBinary), s.noExitRuntime && (B = s.noExitRuntime), "object" !== ("undefined" == typeof WebAssembly ? "undefined" : o(WebAssembly)) && M("no native wasm support detected");
      var P = new WebAssembly.Table({
        initial: 1040,
        maximum: 1040,
        element: "anyfunc"
      }),
          O = !1;

      function C(e, t) {
        e || Te("Assertion failed: " + t);
      }

      function L(e) {
        var t = s["_" + e];
        return C(t, "Cannot call unknown function " + e + ", make sure it is exported"), t;
      }

      function N(e, t, r, n, i) {
        var o = {
          string: function string(e) {
            var t = 0;

            if (null != e && 0 !== e) {
              var r = 1 + (e.length << 2);
              W(e, t = gr(r), r);
            }

            return t;
          },
          array: function array(e) {
            var t = gr(e.length);
            return G(e, t), t;
          }
        };
        var a = L(e),
            s = [],
            f = 0;
        if (n) for (var u = 0; u < n.length; u++) {
          var c = o[r[u]];
          c ? (0 === f && (f = wr()), s[u] = c(n[u])) : s[u] = n[u];
        }
        var h = a.apply(null, s);
        return h = function (e) {
          return "string" === t ? H(e) : "boolean" === t ? Boolean(e) : e;
        }(h), 0 !== f && vr(f), h;
      }

      function U(e, t, r, n) {
        var i = (r = r || []).every(function (e) {
          return "number" === e;
        });
        return "string" !== t && i && !n ? L(e) : function () {
          return N(e, t, r, arguments);
        };
      }

      function q(e) {
        return pe ? yr(e) : S(e);
      }

      var z = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;

      function F(e, t, r) {
        for (var n = t + r, i = t; e[i] && !(i >= n);) {
          ++i;
        }

        if (i - t > 16 && e.subarray && z) return z.decode(e.subarray(t, i));

        for (var o = ""; t < i;) {
          var a = e[t++];

          if (128 & a) {
            var s = 63 & e[t++];

            if (192 != (224 & a)) {
              var f = 63 & e[t++];
              if ((a = 224 == (240 & a) ? (15 & a) << 12 | s << 6 | f : (7 & a) << 18 | s << 12 | f << 6 | 63 & e[t++]) < 65536) o += String.fromCharCode(a);else {
                var u = a - 65536;
                o += String.fromCharCode(55296 | u >> 10, 56320 | 1023 & u);
              }
            } else o += String.fromCharCode((31 & a) << 6 | s);
          } else o += String.fromCharCode(a);
        }

        return o;
      }

      function H(e, t) {
        return e ? F($, e, t) : "";
      }

      function K(e, t, r, n) {
        if (!(n > 0)) return 0;

        for (var i = r, o = r + n - 1, a = 0; a < e.length; ++a) {
          var s = e.charCodeAt(a);
          if (s >= 55296 && s <= 57343) s = 65536 + ((1023 & s) << 10) | 1023 & e.charCodeAt(++a);

          if (s <= 127) {
            if (r >= o) break;
            t[r++] = s;
          } else if (s <= 2047) {
            if (r + 1 >= o) break;
            t[r++] = 192 | s >> 6, t[r++] = 128 | 63 & s;
          } else if (s <= 65535) {
            if (r + 2 >= o) break;
            t[r++] = 224 | s >> 12, t[r++] = 128 | s >> 6 & 63, t[r++] = 128 | 63 & s;
          } else {
            if (r + 3 >= o) break;
            t[r++] = 240 | s >> 18, t[r++] = 128 | s >> 12 & 63, t[r++] = 128 | s >> 6 & 63, t[r++] = 128 | 63 & s;
          }
        }

        return t[r] = 0, r - i;
      }

      function W(e, t, r) {
        return K(e, $, t, r);
      }

      function V(e) {
        for (var t = 0, r = 0; r < e.length; ++r) {
          var n = e.charCodeAt(r);
          n >= 55296 && n <= 57343 && (n = 65536 + ((1023 & n) << 10) | 1023 & e.charCodeAt(++r)), n <= 127 ? ++t : t += n <= 2047 ? 2 : n <= 65535 ? 3 : 4;
        }

        return t;
      }

      "undefined" != typeof TextDecoder && new TextDecoder("utf-16le");

      function X(e) {
        var t = V(e) + 1,
            r = yr(t);
        return r && K(e, J, r, t), r;
      }

      function G(e, t) {
        J.set(e, t);
      }

      function Z(e, t, r) {
        for (var n = 0; n < e.length; ++n) {
          J[t++ >> 0] = e.charCodeAt(n);
        }

        r || (J[t >> 0] = 0);
      }

      var Y,
          J,
          $,
          Q,
          ee,
          te,
          re,
          ne = 65536;

      function ie(e, t) {
        return e % t > 0 && (e += t - e % t), e;
      }

      function oe(e) {
        Y = e, s.HEAP8 = J = new Int8Array(e), s.HEAP16 = Q = new Int16Array(e), s.HEAP32 = te = new Int32Array(e), s.HEAPU8 = $ = new Uint8Array(e), s.HEAPU16 = ee = new Uint16Array(e), s.HEAPU32 = re = new Uint32Array(e), s.HEAPF32 = new Float32Array(e), s.HEAPF64 = new Float64Array(e);
      }

      var ae = 5376976,
          se = 133872,
          fe = s.TOTAL_MEMORY || 536870912;

      function ue(e) {
        for (; e.length > 0;) {
          var t = e.shift();

          if ("function" != typeof t) {
            var r = t.func;
            "number" == typeof r ? void 0 === t.arg ? s.dynCall_v(r) : s.dynCall_vi(r, t.arg) : r(void 0 === t.arg ? null : t.arg);
          } else t();
        }
      }

      (T = s.wasmMemory ? s.wasmMemory : new WebAssembly.Memory({
        initial: fe / ne
      })) && (Y = T.buffer), fe = Y.byteLength, oe(Y), te[se >> 2] = ae;
      var ce = [],
          he = [],
          de = [],
          le = [],
          pe = !1;

      function be() {
        if (s.preRun) for ("function" == typeof s.preRun && (s.preRun = [s.preRun]); s.preRun.length;) {
          ve(s.preRun.shift());
        }
        ue(ce);
      }

      function me() {
        pe = !0, s.noFSInit || et.init.initialized || et.init(), Ge.init(), ue(he);
      }

      function ye() {
        et.ignorePermissions = !1, ue(de);
      }

      function ge() {
        if (s.postRun) for ("function" == typeof s.postRun && (s.postRun = [s.postRun]); s.postRun.length;) {
          we(s.postRun.shift());
        }
        ue(le);
      }

      function ve(e) {
        ce.unshift(e);
      }

      function we(e) {
        le.unshift(e);
      }

      var _e = Math.abs,
          Ee = Math.ceil,
          Me = Math.floor,
          Se = Math.min,
          ke = Math.trunc,
          Ae = 0,
          xe = null,
          Re = null;

      function Ie(e) {
        Ae++, s.monitorRunDependencies && s.monitorRunDependencies(Ae);
      }

      function Be(e) {
        if (Ae--, s.monitorRunDependencies && s.monitorRunDependencies(Ae), 0 == Ae && (null !== xe && (clearInterval(xe), xe = null), Re)) {
          var t = Re;
          Re = null, t();
        }
      }

      function Te(e) {
        throw s.onAbort && s.onAbort(e), E(e += ""), M(e), O = !0, 1, "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.";
      }

      s.preloadedImages = {}, s.preloadedAudios = {};
      var je = "data:application/octet-stream;base64,";

      function De(e) {
        return String.prototype.startsWith ? e.startsWith(je) : 0 === e.indexOf(je);
      }

      var Pe,
          Oe,
          Ce = "missile-dec.wasm";

      function Le() {
        try {
          if (I) return new Uint8Array(I);
          if (y) return y(Ce);
          throw "both async and sync fetching of the wasm failed";
        } catch (e) {
          Te(e);
        }
      }

      function Ne() {
        return I || !h && !d || "function" != typeof fetch ? new Promise(function (e, t) {
          e(Le());
        }) : fetch(Ce, {
          credentials: "same-origin"
        }).then(function (e) {
          if (!e.ok) throw "failed to load wasm binary file at '" + Ce + "'";
          return e.arrayBuffer();
        })["catch"](function () {
          return Le();
        });
      }

      function Ue() {
        var e = {
          env: dr,
          wasi_unstable: dr,
          global: {
            NaN: NaN,
            Infinity: 1 / 0
          },
          "global.Math": Math,
          asm2wasm: k
        };

        function t(e, t) {
          var r = e.exports;
          s.asm = r, Be();
        }

        function r(e) {
          t(e.instance);
        }

        function n(t) {
          return Ne().then(function (t) {
            return WebAssembly.instantiate(t, e);
          }).then(t, function (e) {
            M("failed to asynchronously prepare wasm: " + e), Te(e);
          });
        }

        if (Ie(), s.instantiateWasm) try {
          return s.instantiateWasm(e, t);
        } catch (e) {
          return M("Module.instantiateWasm callback failed with error: " + e), !1;
        }
        return function () {
          if (I || "function" != typeof WebAssembly.instantiateStreaming || De(Ce) || "function" != typeof fetch) return n(r);
          fetch(Ce, {
            credentials: "same-origin"
          }).then(function (t) {
            return WebAssembly.instantiateStreaming(t, e).then(r, function (e) {
              M("wasm streaming compile failed: " + e), M("falling back to ArrayBuffer instantiation"), n(r);
            });
          });
        }(), {};
      }

      function qe(e) {
        return e.replace(/\b__Z[\w\d_]+/g, function (e) {
          return e === e ? e : e + " [" + e + "]";
        });
      }

      function ze() {
        var e = new Error();

        if (!e.stack) {
          try {
            throw new Error(0);
          } catch (t) {
            e = t;
          }

          if (!e.stack) return "(no stack trace available)";
        }

        return e.stack.toString();
      }

      function Fe() {
        var e = ze();
        return s.extraStackTrace && (e += "\n" + s.extraStackTrace()), qe(e);
      }

      De(Ce) || (Ce = _(Ce)), s.asm = Ue, he.push({
        func: function func() {
          br();
        }
      });
      var He = {};

      function Ke(e) {
        var t, r;
        Ke.called ? (r = te[e >> 2], t = te[r >> 2]) : (Ke.called = !0, He.USER = "web_user", He.LOGNAME = "web_user", He.PATH = "/", He.PWD = "/", He.HOME = "/home/web_user", He.LANG = ("object" === ("undefined" == typeof navigator ? "undefined" : o(navigator)) && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", He._ = c, t = q(1024), r = q(256), te[r >> 2] = t, te[e >> 2] = r);
        var n = [],
            i = 0;

        for (var a in He) {
          if ("string" == typeof He[a]) {
            var s = a + "=" + He[a];
            n.push(s), i += s.length;
          }
        }

        if (i > 1024) throw new Error("Environment size exceeded TOTAL_ENV_SIZE!");

        for (var f = 0; f < n.length; f++) {
          Z(s = n[f], t), te[r + 4 * f >> 2] = t, t += s.length + 1;
        }

        te[r + 4 * n.length >> 2] = 0;
      }

      function We(e) {
        return s.___errno_location && (te[s.___errno_location() >> 2] = e), e;
      }

      var Ve = {
        splitPath: function splitPath(e) {
          return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(e).slice(1);
        },
        normalizeArray: function normalizeArray(e, t) {
          for (var r = 0, n = e.length - 1; n >= 0; n--) {
            var i = e[n];
            "." === i ? e.splice(n, 1) : ".." === i ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
          }

          if (t) for (; r; r--) {
            e.unshift("..");
          }
          return e;
        },
        normalize: function normalize(e) {
          var t = "/" === e.charAt(0),
              r = "/" === e.substr(-1);
          return (e = Ve.normalizeArray(e.split("/").filter(function (e) {
            return !!e;
          }), !t).join("/")) || t || (e = "."), e && r && (e += "/"), (t ? "/" : "") + e;
        },
        dirname: function dirname(e) {
          var t = Ve.splitPath(e),
              r = t[0],
              n = t[1];
          return r || n ? (n && (n = n.substr(0, n.length - 1)), r + n) : ".";
        },
        basename: function basename(e) {
          if ("/" === e) return "/";
          var t = e.lastIndexOf("/");
          return -1 === t ? e : e.substr(t + 1);
        },
        extname: function extname(e) {
          return Ve.splitPath(e)[3];
        },
        join: function join() {
          var e = Array.prototype.slice.call(arguments, 0);
          return Ve.normalize(e.join("/"));
        },
        join2: function join2(e, t) {
          return Ve.normalize(e + "/" + t);
        }
      },
          Xe = {
        resolve: function resolve() {
          for (var e = "", t = !1, r = arguments.length - 1; r >= -1 && !t; r--) {
            var n = r >= 0 ? arguments[r] : et.cwd();
            if ("string" != typeof n) throw new TypeError("Arguments to path.resolve must be strings");
            if (!n) return "";
            e = n + "/" + e, t = "/" === n.charAt(0);
          }

          return (t ? "/" : "") + (e = Ve.normalizeArray(e.split("/").filter(function (e) {
            return !!e;
          }), !t).join("/")) || ".";
        },
        relative: function relative(e, t) {
          function r(e) {
            for (var t = 0; t < e.length && "" === e[t]; t++) {
              ;
            }

            for (var r = e.length - 1; r >= 0 && "" === e[r]; r--) {
              ;
            }

            return t > r ? [] : e.slice(t, r - t + 1);
          }

          e = Xe.resolve(e).substr(1), t = Xe.resolve(t).substr(1);

          for (var n = r(e.split("/")), i = r(t.split("/")), o = Math.min(n.length, i.length), a = o, s = 0; s < o; s++) {
            if (n[s] !== i[s]) {
              a = s;
              break;
            }
          }

          var f = [];

          for (s = a; s < n.length; s++) {
            f.push("..");
          }

          return (f = f.concat(i.slice(a))).join("/");
        }
      },
          Ge = {
        ttys: [],
        init: function init() {},
        shutdown: function shutdown() {},
        register: function register(e, t) {
          Ge.ttys[e] = {
            input: [],
            output: [],
            ops: t
          }, et.registerDevice(e, Ge.stream_ops);
        },
        stream_ops: {
          open: function open(e) {
            var t = Ge.ttys[e.node.rdev];
            if (!t) throw new et.ErrnoError(43);
            e.tty = t, e.seekable = !1;
          },
          close: function close(e) {
            e.tty.ops.flush(e.tty);
          },
          flush: function flush(e) {
            e.tty.ops.flush(e.tty);
          },
          read: function read(e, t, r, n, i) {
            if (!e.tty || !e.tty.ops.get_char) throw new et.ErrnoError(60);

            for (var o = 0, a = 0; a < n; a++) {
              var s;

              try {
                s = e.tty.ops.get_char(e.tty);
              } catch (e) {
                throw new et.ErrnoError(29);
              }

              if (void 0 === s && 0 === o) throw new et.ErrnoError(6);
              if (null == s) break;
              o++, t[r + a] = s;
            }

            return o && (e.node.timestamp = Date.now()), o;
          },
          write: function write(e, t, r, n, i) {
            if (!e.tty || !e.tty.ops.put_char) throw new et.ErrnoError(60);

            try {
              for (var o = 0; o < n; o++) {
                e.tty.ops.put_char(e.tty, t[r + o]);
              }
            } catch (e) {
              throw new et.ErrnoError(29);
            }

            return n && (e.node.timestamp = Date.now()), o;
          }
        },
        default_tty_ops: {
          get_char: function get_char(e) {
            if (!e.input.length) {
              var t = null;

              if (l) {
                var i = n.alloc ? n.alloc(256) : new n(256),
                    o = 0;

                try {
                  o = Ct.readSync(r.stdin.fd, i, 0, 256, null);
                } catch (e) {
                  if (-1 == e.toString().indexOf("EOF")) throw e;
                  o = 0;
                }

                t = o > 0 ? i.slice(0, o).toString("utf-8") : null;
              } else "undefined" != typeof window && "function" == typeof window.prompt ? null !== (t = window.prompt("Input: ")) && (t += "\n") : "function" == typeof readline && null !== (t = readline()) && (t += "\n");

              if (!t) return null;
              e.input = Nt(t, !0);
            }

            return e.input.shift();
          },
          put_char: function put_char(e, t) {
            null === t || 10 === t ? (E(F(e.output, 0)), e.output = []) : 0 != t && e.output.push(t);
          },
          flush: function flush(e) {
            e.output && e.output.length > 0 && (E(F(e.output, 0)), e.output = []);
          }
        },
        default_tty1_ops: {
          put_char: function put_char(e, t) {
            null === t || 10 === t ? (M(F(e.output, 0)), e.output = []) : 0 != t && e.output.push(t);
          },
          flush: function flush(e) {
            e.output && e.output.length > 0 && (M(F(e.output, 0)), e.output = []);
          }
        }
      },
          Ze = {
        ops_table: null,
        mount: function mount(e) {
          return Ze.createNode(null, "/", 16895, 0);
        },
        createNode: function createNode(e, t, r, n) {
          if (et.isBlkdev(r) || et.isFIFO(r)) throw new et.ErrnoError(63);
          Ze.ops_table || (Ze.ops_table = {
            dir: {
              node: {
                getattr: Ze.node_ops.getattr,
                setattr: Ze.node_ops.setattr,
                lookup: Ze.node_ops.lookup,
                mknod: Ze.node_ops.mknod,
                rename: Ze.node_ops.rename,
                unlink: Ze.node_ops.unlink,
                rmdir: Ze.node_ops.rmdir,
                readdir: Ze.node_ops.readdir,
                symlink: Ze.node_ops.symlink
              },
              stream: {
                llseek: Ze.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: Ze.node_ops.getattr,
                setattr: Ze.node_ops.setattr
              },
              stream: {
                llseek: Ze.stream_ops.llseek,
                read: Ze.stream_ops.read,
                write: Ze.stream_ops.write,
                allocate: Ze.stream_ops.allocate,
                mmap: Ze.stream_ops.mmap,
                msync: Ze.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: Ze.node_ops.getattr,
                setattr: Ze.node_ops.setattr,
                readlink: Ze.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: Ze.node_ops.getattr,
                setattr: Ze.node_ops.setattr
              },
              stream: et.chrdev_stream_ops
            }
          });
          var i = et.createNode(e, t, r, n);
          return et.isDir(i.mode) ? (i.node_ops = Ze.ops_table.dir.node, i.stream_ops = Ze.ops_table.dir.stream, i.contents = {}) : et.isFile(i.mode) ? (i.node_ops = Ze.ops_table.file.node, i.stream_ops = Ze.ops_table.file.stream, i.usedBytes = 0, i.contents = null) : et.isLink(i.mode) ? (i.node_ops = Ze.ops_table.link.node, i.stream_ops = Ze.ops_table.link.stream) : et.isChrdev(i.mode) && (i.node_ops = Ze.ops_table.chrdev.node, i.stream_ops = Ze.ops_table.chrdev.stream), i.timestamp = Date.now(), e && (e.contents[t] = i), i;
        },
        getFileDataAsRegularArray: function getFileDataAsRegularArray(e) {
          if (e.contents && e.contents.subarray) {
            for (var t = [], r = 0; r < e.usedBytes; ++r) {
              t.push(e.contents[r]);
            }

            return t;
          }

          return e.contents;
        },
        getFileDataAsTypedArray: function getFileDataAsTypedArray(e) {
          return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array();
        },
        expandFileStorage: function expandFileStorage(e, t) {
          var r = e.contents ? e.contents.length : 0;

          if (!(r >= t)) {
            t = Math.max(t, r * (r < 1048576 ? 2 : 1.125) | 0), 0 != r && (t = Math.max(t, 256));
            var n = e.contents;
            e.contents = new Uint8Array(t), e.usedBytes > 0 && e.contents.set(n.subarray(0, e.usedBytes), 0);
          }
        },
        resizeFileStorage: function resizeFileStorage(e, t) {
          if (e.usedBytes != t) {
            if (0 == t) return e.contents = null, void (e.usedBytes = 0);

            if (!e.contents || e.contents.subarray) {
              var r = e.contents;
              return e.contents = new Uint8Array(new ArrayBuffer(t)), r && e.contents.set(r.subarray(0, Math.min(t, e.usedBytes))), void (e.usedBytes = t);
            }

            if (e.contents || (e.contents = []), e.contents.length > t) e.contents.length = t;else for (; e.contents.length < t;) {
              e.contents.push(0);
            }
            e.usedBytes = t;
          }
        },
        node_ops: {
          getattr: function getattr(e) {
            var t = {};
            return t.dev = et.isChrdev(e.mode) ? e.id : 1, t.ino = e.id, t.mode = e.mode, t.nlink = 1, t.uid = 0, t.gid = 0, t.rdev = e.rdev, et.isDir(e.mode) ? t.size = 4096 : et.isFile(e.mode) ? t.size = e.usedBytes : et.isLink(e.mode) ? t.size = e.link.length : t.size = 0, t.atime = new Date(e.timestamp), t.mtime = new Date(e.timestamp), t.ctime = new Date(e.timestamp), t.blksize = 4096, t.blocks = Math.ceil(t.size / t.blksize), t;
          },
          setattr: function setattr(e, t) {
            void 0 !== t.mode && (e.mode = t.mode), void 0 !== t.timestamp && (e.timestamp = t.timestamp), void 0 !== t.size && Ze.resizeFileStorage(e, t.size);
          },
          lookup: function lookup(e, t) {
            throw et.genericErrors[44];
          },
          mknod: function mknod(e, t, r, n) {
            return Ze.createNode(e, t, r, n);
          },
          rename: function rename(e, t, r) {
            if (et.isDir(e.mode)) {
              var n;

              try {
                n = et.lookupNode(t, r);
              } catch (e) {}

              if (n) for (var i in n.contents) {
                throw new et.ErrnoError(55);
              }
            }

            delete e.parent.contents[e.name], e.name = r, t.contents[r] = e, e.parent = t;
          },
          unlink: function unlink(e, t) {
            delete e.contents[t];
          },
          rmdir: function rmdir(e, t) {
            var r = et.lookupNode(e, t);

            for (var n in r.contents) {
              throw new et.ErrnoError(55);
            }

            delete e.contents[t];
          },
          readdir: function readdir(e) {
            var t = [".", ".."];

            for (var r in e.contents) {
              e.contents.hasOwnProperty(r) && t.push(r);
            }

            return t;
          },
          symlink: function symlink(e, t, r) {
            var n = Ze.createNode(e, t, 41471, 0);
            return n.link = r, n;
          },
          readlink: function readlink(e) {
            if (!et.isLink(e.mode)) throw new et.ErrnoError(28);
            return e.link;
          }
        },
        stream_ops: {
          read: function read(e, t, r, n, i) {
            var o = e.node.contents;
            if (i >= e.node.usedBytes) return 0;
            var a = Math.min(e.node.usedBytes - i, n);
            if (a > 8 && o.subarray) t.set(o.subarray(i, i + a), r);else for (var s = 0; s < a; s++) {
              t[r + s] = o[i + s];
            }
            return a;
          },
          write: function write(e, t, r, n, i, o) {
            if (!1, !n) return 0;
            var a = e.node;

            if (a.timestamp = Date.now(), t.subarray && (!a.contents || a.contents.subarray)) {
              if (0 === a.usedBytes && 0 === i) return a.contents = new Uint8Array(t.subarray(r, r + n)), a.usedBytes = n, n;
              if (i + n <= a.usedBytes) return a.contents.set(t.subarray(r, r + n), i), n;
            }

            if (Ze.expandFileStorage(a, i + n), a.contents.subarray && t.subarray) a.contents.set(t.subarray(r, r + n), i);else for (var s = 0; s < n; s++) {
              a.contents[i + s] = t[r + s];
            }
            return a.usedBytes = Math.max(a.usedBytes, i + n), n;
          },
          llseek: function llseek(e, t, r) {
            var n = t;
            if (1 === r ? n += e.position : 2 === r && et.isFile(e.node.mode) && (n += e.node.usedBytes), n < 0) throw new et.ErrnoError(28);
            return n;
          },
          allocate: function allocate(e, t, r) {
            Ze.expandFileStorage(e.node, t + r), e.node.usedBytes = Math.max(e.node.usedBytes, t + r);
          },
          mmap: function mmap(e, t, r, n, i, o, a) {
            if (!et.isFile(e.node.mode)) throw new et.ErrnoError(43);
            var s,
                f,
                u = e.node.contents;

            if (2 & a || u.buffer !== t && u.buffer !== t.buffer) {
              (i > 0 || i + n < e.node.usedBytes) && (u = u.subarray ? u.subarray(i, i + n) : Array.prototype.slice.call(u, i, i + n)), f = !0;
              var c = t.buffer == J.buffer;
              if (!(s = yr(n))) throw new et.ErrnoError(48);
              (c ? J : t).set(u, s);
            } else f = !1, s = u.byteOffset;

            return {
              ptr: s,
              allocated: f
            };
          },
          msync: function msync(e, t, r, n, i) {
            if (!et.isFile(e.node.mode)) throw new et.ErrnoError(43);
            if (2 & i) return 0;
            Ze.stream_ops.write(e, t, 0, n, r, !1);
            return 0;
          }
        }
      },
          Ye = {
        dbs: {},
        indexedDB: function (e) {
          function t() {
            return e.apply(this, arguments);
          }

          return t.toString = function () {
            return e.toString();
          }, t;
        }(function () {
          if ("undefined" != typeof indexedDB) return indexedDB;
          var e = null;
          return "object" === ("undefined" == typeof window ? "undefined" : o(window)) && (e = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), C(e, "IDBFS used, but indexedDB not supported"), e;
        }),
        DB_VERSION: 21,
        DB_STORE_NAME: "FILE_DATA",
        mount: function mount(e) {
          return Ze.mount.apply(null, arguments);
        },
        syncfs: function syncfs(e, t, r) {
          Ye.getLocalSet(e, function (n, i) {
            if (n) return r(n);
            Ye.getRemoteSet(e, function (e, n) {
              if (e) return r(e);
              var o = t ? n : i,
                  a = t ? i : n;
              Ye.reconcile(o, a, r);
            });
          });
        },
        getDB: function getDB(e, t) {
          var r,
              n = Ye.dbs[e];
          if (n) return t(null, n);

          try {
            r = Ye.indexedDB().open(e, Ye.DB_VERSION);
          } catch (e) {
            return t(e);
          }

          if (!r) return t("Unable to connect to IndexedDB");
          r.onupgradeneeded = function (e) {
            var t,
                r = e.target.result,
                n = e.target.transaction;
            (t = r.objectStoreNames.contains(Ye.DB_STORE_NAME) ? n.objectStore(Ye.DB_STORE_NAME) : r.createObjectStore(Ye.DB_STORE_NAME)).indexNames.contains("timestamp") || t.createIndex("timestamp", "timestamp", {
              unique: !1
            });
          }, r.onsuccess = function () {
            n = r.result, Ye.dbs[e] = n, t(null, n);
          }, r.onerror = function (e) {
            t(this.error), e.preventDefault();
          };
        },
        getLocalSet: function getLocalSet(e, t) {
          var r = {};

          function n(e) {
            return "." !== e && ".." !== e;
          }

          function i(e) {
            return function (t) {
              return Ve.join2(e, t);
            };
          }

          for (var o = et.readdir(e.mountpoint).filter(n).map(i(e.mountpoint)); o.length;) {
            var a,
                s = o.pop();

            try {
              a = et.stat(s);
            } catch (e) {
              return t(e);
            }

            et.isDir(a.mode) && o.push.apply(o, et.readdir(s).filter(n).map(i(s))), r[s] = {
              timestamp: a.mtime
            };
          }

          return t(null, {
            type: "local",
            entries: r
          });
        },
        getRemoteSet: function getRemoteSet(e, t) {
          var r = {};
          Ye.getDB(e.mountpoint, function (e, n) {
            if (e) return t(e);

            try {
              var i = n.transaction([Ye.DB_STORE_NAME], "readonly");
              i.onerror = function (e) {
                t(this.error), e.preventDefault();
              }, i.objectStore(Ye.DB_STORE_NAME).index("timestamp").openKeyCursor().onsuccess = function (e) {
                var i = e.target.result;
                if (!i) return t(null, {
                  type: "remote",
                  db: n,
                  entries: r
                });
                r[i.primaryKey] = {
                  timestamp: i.key
                }, i["continue"]();
              };
            } catch (e) {
              return t(e);
            }
          });
        },
        loadLocalEntry: function loadLocalEntry(e, t) {
          var r, n;

          try {
            n = et.lookupPath(e).node, r = et.stat(e);
          } catch (e) {
            return t(e);
          }

          return et.isDir(r.mode) ? t(null, {
            timestamp: r.mtime,
            mode: r.mode
          }) : et.isFile(r.mode) ? (n.contents = Ze.getFileDataAsTypedArray(n), t(null, {
            timestamp: r.mtime,
            mode: r.mode,
            contents: n.contents
          })) : t(new Error("node type not supported"));
        },
        storeLocalEntry: function storeLocalEntry(e, t, r) {
          try {
            if (et.isDir(t.mode)) et.mkdir(e, t.mode);else {
              if (!et.isFile(t.mode)) return r(new Error("node type not supported"));
              et.writeFile(e, t.contents, {
                canOwn: !0
              });
            }
            et.chmod(e, t.mode), et.utime(e, t.timestamp, t.timestamp);
          } catch (e) {
            return r(e);
          }

          r(null);
        },
        removeLocalEntry: function removeLocalEntry(e, t) {
          try {
            et.lookupPath(e);
            var r = et.stat(e);
            et.isDir(r.mode) ? et.rmdir(e) : et.isFile(r.mode) && et.unlink(e);
          } catch (e) {
            return t(e);
          }

          t(null);
        },
        loadRemoteEntry: function loadRemoteEntry(e, t, r) {
          var n = e.get(t);
          n.onsuccess = function (e) {
            r(null, e.target.result);
          }, n.onerror = function (e) {
            r(this.error), e.preventDefault();
          };
        },
        storeRemoteEntry: function storeRemoteEntry(e, t, r, n) {
          var i = e.put(r, t);
          i.onsuccess = function () {
            n(null);
          }, i.onerror = function (e) {
            n(this.error), e.preventDefault();
          };
        },
        removeRemoteEntry: function removeRemoteEntry(e, t, r) {
          var n = e["delete"](t);
          n.onsuccess = function () {
            r(null);
          }, n.onerror = function (e) {
            r(this.error), e.preventDefault();
          };
        },
        reconcile: function reconcile(e, t, r) {
          var n = 0,
              i = [];
          Object.keys(e.entries).forEach(function (r) {
            var o = e.entries[r],
                a = t.entries[r];
            (!a || o.timestamp > a.timestamp) && (i.push(r), n++);
          });
          var o = [];
          if (Object.keys(t.entries).forEach(function (r) {
            t.entries[r];
            e.entries[r] || (o.push(r), n++);
          }), !n) return r(null);
          var a = !1,
              s = ("remote" === e.type ? e.db : t.db).transaction([Ye.DB_STORE_NAME], "readwrite"),
              f = s.objectStore(Ye.DB_STORE_NAME);

          function u(e) {
            if (e && !a) return a = !0, r(e);
          }

          s.onerror = function (e) {
            u(this.error), e.preventDefault();
          }, s.oncomplete = function (e) {
            a || r(null);
          }, i.sort().forEach(function (e) {
            "local" === t.type ? Ye.loadRemoteEntry(f, e, function (t, r) {
              if (t) return u(t);
              Ye.storeLocalEntry(e, r, u);
            }) : Ye.loadLocalEntry(e, function (t, r) {
              if (t) return u(t);
              Ye.storeRemoteEntry(f, e, r, u);
            });
          }), o.sort().reverse().forEach(function (e) {
            "local" === t.type ? Ye.removeLocalEntry(e, u) : Ye.removeRemoteEntry(f, e, u);
          });
        }
      },
          Je = {
        EPERM: 63,
        ENOENT: 44,
        ESRCH: 71,
        EINTR: 27,
        EIO: 29,
        ENXIO: 60,
        E2BIG: 1,
        ENOEXEC: 45,
        EBADF: 8,
        ECHILD: 12,
        EAGAIN: 6,
        EWOULDBLOCK: 6,
        ENOMEM: 48,
        EACCES: 2,
        EFAULT: 21,
        ENOTBLK: 105,
        EBUSY: 10,
        EEXIST: 20,
        EXDEV: 75,
        ENODEV: 43,
        ENOTDIR: 54,
        EISDIR: 31,
        EINVAL: 28,
        ENFILE: 41,
        EMFILE: 33,
        ENOTTY: 59,
        ETXTBSY: 74,
        EFBIG: 22,
        ENOSPC: 51,
        ESPIPE: 70,
        EROFS: 69,
        EMLINK: 34,
        EPIPE: 64,
        EDOM: 18,
        ERANGE: 68,
        ENOMSG: 49,
        EIDRM: 24,
        ECHRNG: 106,
        EL2NSYNC: 156,
        EL3HLT: 107,
        EL3RST: 108,
        ELNRNG: 109,
        EUNATCH: 110,
        ENOCSI: 111,
        EL2HLT: 112,
        EDEADLK: 16,
        ENOLCK: 46,
        EBADE: 113,
        EBADR: 114,
        EXFULL: 115,
        ENOANO: 104,
        EBADRQC: 103,
        EBADSLT: 102,
        EDEADLOCK: 16,
        EBFONT: 101,
        ENOSTR: 100,
        ENODATA: 116,
        ETIME: 117,
        ENOSR: 118,
        ENONET: 119,
        ENOPKG: 120,
        EREMOTE: 121,
        ENOLINK: 47,
        EADV: 122,
        ESRMNT: 123,
        ECOMM: 124,
        EPROTO: 65,
        EMULTIHOP: 36,
        EDOTDOT: 125,
        EBADMSG: 9,
        ENOTUNIQ: 126,
        EBADFD: 127,
        EREMCHG: 128,
        ELIBACC: 129,
        ELIBBAD: 130,
        ELIBSCN: 131,
        ELIBMAX: 132,
        ELIBEXEC: 133,
        ENOSYS: 52,
        ENOTEMPTY: 55,
        ENAMETOOLONG: 37,
        ELOOP: 32,
        EOPNOTSUPP: 138,
        EPFNOSUPPORT: 139,
        ECONNRESET: 15,
        ENOBUFS: 42,
        EAFNOSUPPORT: 5,
        EPROTOTYPE: 67,
        ENOTSOCK: 57,
        ENOPROTOOPT: 50,
        ESHUTDOWN: 140,
        ECONNREFUSED: 14,
        EADDRINUSE: 3,
        ECONNABORTED: 13,
        ENETUNREACH: 40,
        ENETDOWN: 38,
        ETIMEDOUT: 73,
        EHOSTDOWN: 142,
        EHOSTUNREACH: 23,
        EINPROGRESS: 26,
        EALREADY: 7,
        EDESTADDRREQ: 17,
        EMSGSIZE: 35,
        EPROTONOSUPPORT: 66,
        ESOCKTNOSUPPORT: 137,
        EADDRNOTAVAIL: 4,
        ENETRESET: 39,
        EISCONN: 30,
        ENOTCONN: 53,
        ETOOMANYREFS: 141,
        EUSERS: 136,
        EDQUOT: 19,
        ESTALE: 72,
        ENOTSUP: 138,
        ENOMEDIUM: 148,
        EILSEQ: 25,
        EOVERFLOW: 61,
        ECANCELED: 11,
        ENOTRECOVERABLE: 56,
        EOWNERDEAD: 62,
        ESTRPIPE: 135
      },
          $e = {
        isWindows: !1,
        staticInit: function staticInit() {
          $e.isWindows = !!r.platform.match(/^win/);
          var e = r.binding("constants");
          e.fs && (e = e.fs), $e.flagsForNodeMap = {
            1024: e.O_APPEND,
            64: e.O_CREAT,
            128: e.O_EXCL,
            0: e.O_RDONLY,
            2: e.O_RDWR,
            4096: e.O_SYNC,
            512: e.O_TRUNC,
            1: e.O_WRONLY
          };
        },
        bufferFrom: function bufferFrom(e) {
          return n.alloc ? n.from(e) : new n(e);
        },
        convertNodeCode: function convertNodeCode(e) {
          var t = e.code;
          return C(t in Je), Je[t];
        },
        mount: function mount(e) {
          return C(p), $e.createNode(null, "/", $e.getMode(e.opts.root), 0);
        },
        createNode: function createNode(e, t, r, n) {
          if (!et.isDir(r) && !et.isFile(r) && !et.isLink(r)) throw new et.ErrnoError(28);
          var i = et.createNode(e, t, r);
          return i.node_ops = $e.node_ops, i.stream_ops = $e.stream_ops, i;
        },
        getMode: function getMode(e) {
          var t;

          try {
            t = Ct.lstatSync(e), $e.isWindows && (t.mode = t.mode | (292 & t.mode) >> 2);
          } catch (e) {
            if (!e.code) throw e;
            throw new et.ErrnoError($e.convertNodeCode(e));
          }

          return t.mode;
        },
        realPath: function realPath(e) {
          for (var t = []; e.parent !== e;) {
            t.push(e.name), e = e.parent;
          }

          return t.push(e.mount.opts.root), t.reverse(), Ve.join.apply(null, t);
        },
        flagsForNode: function flagsForNode(e) {
          e &= -2097153, e &= -2049, e &= -32769, e &= -524289;
          var t = 0;

          for (var r in $e.flagsForNodeMap) {
            e & r && (t |= $e.flagsForNodeMap[r], e ^= r);
          }

          if (e) throw new et.ErrnoError(28);
          return t;
        },
        node_ops: {
          getattr: function getattr(e) {
            var t,
                r = $e.realPath(e);

            try {
              t = Ct.lstatSync(r);
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }

            return $e.isWindows && !t.blksize && (t.blksize = 4096), $e.isWindows && !t.blocks && (t.blocks = (t.size + t.blksize - 1) / t.blksize | 0), {
              dev: t.dev,
              ino: t.ino,
              mode: t.mode,
              nlink: t.nlink,
              uid: t.uid,
              gid: t.gid,
              rdev: t.rdev,
              size: t.size,
              atime: t.atime,
              mtime: t.mtime,
              ctime: t.ctime,
              blksize: t.blksize,
              blocks: t.blocks
            };
          },
          setattr: function setattr(e, t) {
            var r = $e.realPath(e);

            try {
              if (void 0 !== t.mode && (Ct.chmodSync(r, t.mode), e.mode = t.mode), void 0 !== t.timestamp) {
                var n = new Date(t.timestamp);
                Ct.utimesSync(r, n, n);
              }

              void 0 !== t.size && Ct.truncateSync(r, t.size);
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          },
          lookup: function lookup(e, t) {
            var r = Ve.join2($e.realPath(e), t),
                n = $e.getMode(r);
            return $e.createNode(e, t, n);
          },
          mknod: function mknod(e, t, r, n) {
            var i = $e.createNode(e, t, r, n),
                o = $e.realPath(i);

            try {
              et.isDir(i.mode) ? Ct.mkdirSync(o, i.mode) : Ct.writeFileSync(o, "", {
                mode: i.mode
              });
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }

            return i;
          },
          rename: function rename(e, t, r) {
            var n = $e.realPath(e),
                i = Ve.join2($e.realPath(t), r);

            try {
              Ct.renameSync(n, i);
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          },
          unlink: function unlink(e, t) {
            var r = Ve.join2($e.realPath(e), t);

            try {
              Ct.unlinkSync(r);
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          },
          rmdir: function rmdir(e, t) {
            var r = Ve.join2($e.realPath(e), t);

            try {
              Ct.rmdirSync(r);
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          },
          readdir: function readdir(e) {
            var t = $e.realPath(e);

            try {
              return Ct.readdirSync(t);
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          },
          symlink: function symlink(e, t, r) {
            var n = Ve.join2($e.realPath(e), t);

            try {
              Ct.symlinkSync(r, n);
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          },
          readlink: function readlink(e) {
            var t = $e.realPath(e);

            try {
              return t = Ct.readlinkSync(t), t = Lt.relative(Lt.resolve(e.mount.opts.root), t);
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          }
        },
        stream_ops: {
          open: function open(e) {
            var t = $e.realPath(e.node);

            try {
              et.isFile(e.node.mode) && (e.nfd = Ct.openSync(t, $e.flagsForNode(e.flags)));
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          },
          close: function close(e) {
            try {
              et.isFile(e.node.mode) && e.nfd && Ct.closeSync(e.nfd);
            } catch (e) {
              if (!e.code) throw e;
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          },
          read: function read(e, t, r, n, i) {
            if (0 === n) return 0;

            try {
              return Ct.readSync(e.nfd, $e.bufferFrom(t.buffer), r, n, i);
            } catch (e) {
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          },
          write: function write(e, t, r, n, i) {
            try {
              return Ct.writeSync(e.nfd, $e.bufferFrom(t.buffer), r, n, i);
            } catch (e) {
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
          },
          llseek: function llseek(e, t, r) {
            var n = t;
            if (1 === r) n += e.position;else if (2 === r && et.isFile(e.node.mode)) try {
              n += Ct.fstatSync(e.nfd).size;
            } catch (e) {
              throw new et.ErrnoError($e.convertNodeCode(e));
            }
            if (n < 0) throw new et.ErrnoError(28);
            return n;
          }
        }
      },
          Qe = {
        DIR_MODE: 16895,
        FILE_MODE: 33279,
        reader: null,
        mount: function mount(e) {
          C(d), Qe.reader || (Qe.reader = new FileReaderSync());
          var t = Qe.createNode(null, "/", Qe.DIR_MODE, 0),
              r = {};

          function n(e) {
            for (var n = e.split("/"), i = t, o = 0; o < n.length - 1; o++) {
              var a = n.slice(0, o + 1).join("/");
              r[a] || (r[a] = Qe.createNode(i, n[o], Qe.DIR_MODE, 0)), i = r[a];
            }

            return i;
          }

          function i(e) {
            var t = e.split("/");
            return t[t.length - 1];
          }

          return Array.prototype.forEach.call(e.opts.files || [], function (e) {
            Qe.createNode(n(e.name), i(e.name), Qe.FILE_MODE, 0, e, e.lastModifiedDate);
          }), (e.opts.blobs || []).forEach(function (e) {
            Qe.createNode(n(e.name), i(e.name), Qe.FILE_MODE, 0, e.data);
          }), (e.opts.packages || []).forEach(function (e) {
            e.metadata.files.forEach(function (t) {
              var r = t.filename.substr(1);
              Qe.createNode(n(r), i(r), Qe.FILE_MODE, 0, e.blob.slice(t.start, t.end));
            });
          }), t;
        },
        createNode: function createNode(e, t, r, n, i, o) {
          var a = et.createNode(e, t, r);
          return a.mode = r, a.node_ops = Qe.node_ops, a.stream_ops = Qe.stream_ops, a.timestamp = (o || new Date()).getTime(), C(Qe.FILE_MODE !== Qe.DIR_MODE), r === Qe.FILE_MODE ? (a.size = i.size, a.contents = i) : (a.size = 4096, a.contents = {}), e && (e.contents[t] = a), a;
        },
        node_ops: {
          getattr: function getattr(e) {
            return {
              dev: 1,
              ino: void 0,
              mode: e.mode,
              nlink: 1,
              uid: 0,
              gid: 0,
              rdev: void 0,
              size: e.size,
              atime: new Date(e.timestamp),
              mtime: new Date(e.timestamp),
              ctime: new Date(e.timestamp),
              blksize: 4096,
              blocks: Math.ceil(e.size / 4096)
            };
          },
          setattr: function setattr(e, t) {
            void 0 !== t.mode && (e.mode = t.mode), void 0 !== t.timestamp && (e.timestamp = t.timestamp);
          },
          lookup: function lookup(e, t) {
            throw new et.ErrnoError(44);
          },
          mknod: function mknod(e, t, r, n) {
            throw new et.ErrnoError(63);
          },
          rename: function rename(e, t, r) {
            throw new et.ErrnoError(63);
          },
          unlink: function unlink(e, t) {
            throw new et.ErrnoError(63);
          },
          rmdir: function rmdir(e, t) {
            throw new et.ErrnoError(63);
          },
          readdir: function readdir(e) {
            var t = [".", ".."];

            for (var r in e.contents) {
              e.contents.hasOwnProperty(r) && t.push(r);
            }

            return t;
          },
          symlink: function symlink(e, t, r) {
            throw new et.ErrnoError(63);
          },
          readlink: function readlink(e) {
            throw new et.ErrnoError(63);
          }
        },
        stream_ops: {
          read: function read(e, t, r, n, i) {
            if (i >= e.node.size) return 0;
            var o = e.node.contents.slice(i, i + n),
                a = Qe.reader.readAsArrayBuffer(o);
            return t.set(new Uint8Array(a), r), o.size;
          },
          write: function write(e, t, r, n, i) {
            throw new et.ErrnoError(29);
          },
          llseek: function llseek(e, t, r) {
            var n = t;
            if (1 === r ? n += e.position : 2 === r && et.isFile(e.node.mode) && (n += e.node.size), n < 0) throw new et.ErrnoError(28);
            return n;
          }
        }
      },
          et = {
        root: null,
        mounts: [],
        devices: {},
        streams: [],
        nextInode: 1,
        nameTable: null,
        currentPath: "/",
        initialized: !1,
        ignorePermissions: !0,
        trackingDelegate: {},
        tracking: {
          openFlags: {
            READ: 1,
            WRITE: 2
          }
        },
        ErrnoError: null,
        genericErrors: {},
        filesystems: null,
        syncFSRequests: 0,
        handleFSError: function handleFSError(e) {
          if (!(e instanceof et.ErrnoError)) throw e + " : " + Fe();
          return We(e.errno);
        },
        lookupPath: function lookupPath(e, t) {
          if (t = t || {}, !(e = Xe.resolve(et.cwd(), e))) return {
            path: "",
            node: null
          };
          var r = {
            follow_mount: !0,
            recurse_count: 0
          };

          for (var n in r) {
            void 0 === t[n] && (t[n] = r[n]);
          }

          if (t.recurse_count > 8) throw new et.ErrnoError(32);

          for (var i = Ve.normalizeArray(e.split("/").filter(function (e) {
            return !!e;
          }), !1), o = et.root, a = "/", s = 0; s < i.length; s++) {
            var f = s === i.length - 1;
            if (f && t.parent) break;
            if (o = et.lookupNode(o, i[s]), a = Ve.join2(a, i[s]), et.isMountpoint(o) && (!f || f && t.follow_mount) && (o = o.mounted.root), !f || t.follow) for (var u = 0; et.isLink(o.mode);) {
              var c = et.readlink(a);
              if (a = Xe.resolve(Ve.dirname(a), c), o = et.lookupPath(a, {
                recurse_count: t.recurse_count
              }).node, u++ > 40) throw new et.ErrnoError(32);
            }
          }

          return {
            path: a,
            node: o
          };
        },
        getPath: function getPath(e) {
          for (var t;;) {
            if (et.isRoot(e)) {
              var r = e.mount.mountpoint;
              return t ? "/" !== r[r.length - 1] ? r + "/" + t : r + t : r;
            }

            t = t ? e.name + "/" + t : e.name, e = e.parent;
          }
        },
        hashName: function hashName(e, t) {
          for (var r = 0, n = 0; n < t.length; n++) {
            r = (r << 5) - r + t.charCodeAt(n) | 0;
          }

          return (e + r >>> 0) % et.nameTable.length;
        },
        hashAddNode: function hashAddNode(e) {
          var t = et.hashName(e.parent.id, e.name);
          e.name_next = et.nameTable[t], et.nameTable[t] = e;
        },
        hashRemoveNode: function hashRemoveNode(e) {
          var t = et.hashName(e.parent.id, e.name);
          if (et.nameTable[t] === e) et.nameTable[t] = e.name_next;else for (var r = et.nameTable[t]; r;) {
            if (r.name_next === e) {
              r.name_next = e.name_next;
              break;
            }

            r = r.name_next;
          }
        },
        lookupNode: function lookupNode(e, t) {
          var r = et.mayLookup(e);
          if (r) throw new et.ErrnoError(r, e);

          for (var n = et.hashName(e.id, t), i = et.nameTable[n]; i; i = i.name_next) {
            var o = i.name;
            if (i.parent.id === e.id && o === t) return i;
          }

          return et.lookup(e, t);
        },
        createNode: function createNode(e, t, r, n) {
          if (!et.FSNode) {
            et.FSNode = function (e, t, r, n) {
              e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = et.nextInode++, this.name = t, this.mode = r, this.node_ops = {}, this.stream_ops = {}, this.rdev = n;
            }, et.FSNode.prototype = {};
            Object.defineProperties(et.FSNode.prototype, {
              read: {
                get: function get() {
                  return 365 == (365 & this.mode);
                },
                set: function set(e) {
                  e ? this.mode |= 365 : this.mode &= -366;
                }
              },
              write: {
                get: function get() {
                  return 146 == (146 & this.mode);
                },
                set: function set(e) {
                  e ? this.mode |= 146 : this.mode &= -147;
                }
              },
              isFolder: {
                get: function get() {
                  return et.isDir(this.mode);
                }
              },
              isDevice: {
                get: function get() {
                  return et.isChrdev(this.mode);
                }
              }
            });
          }

          var i = new et.FSNode(e, t, r, n);
          return et.hashAddNode(i), i;
        },
        destroyNode: function destroyNode(e) {
          et.hashRemoveNode(e);
        },
        isRoot: function isRoot(e) {
          return e === e.parent;
        },
        isMountpoint: function isMountpoint(e) {
          return !!e.mounted;
        },
        isFile: function isFile(e) {
          return 32768 == (61440 & e);
        },
        isDir: function isDir(e) {
          return 16384 == (61440 & e);
        },
        isLink: function isLink(e) {
          return 40960 == (61440 & e);
        },
        isChrdev: function isChrdev(e) {
          return 8192 == (61440 & e);
        },
        isBlkdev: function isBlkdev(e) {
          return 24576 == (61440 & e);
        },
        isFIFO: function isFIFO(e) {
          return 4096 == (61440 & e);
        },
        isSocket: function isSocket(e) {
          return 49152 == (49152 & e);
        },
        flagModes: {
          r: 0,
          rs: 1052672,
          "r+": 2,
          w: 577,
          wx: 705,
          xw: 705,
          "w+": 578,
          "wx+": 706,
          "xw+": 706,
          a: 1089,
          ax: 1217,
          xa: 1217,
          "a+": 1090,
          "ax+": 1218,
          "xa+": 1218
        },
        modeStringToFlags: function modeStringToFlags(e) {
          var t = et.flagModes[e];
          if (void 0 === t) throw new Error("Unknown file open mode: " + e);
          return t;
        },
        flagsToPermissionString: function flagsToPermissionString(e) {
          var t = ["r", "w", "rw"][3 & e];
          return 512 & e && (t += "w"), t;
        },
        nodePermissions: function nodePermissions(e, t) {
          return et.ignorePermissions || (-1 === t.indexOf("r") || 292 & e.mode) && (-1 === t.indexOf("w") || 146 & e.mode) && (-1 === t.indexOf("x") || 73 & e.mode) ? 0 : 2;
        },
        mayLookup: function mayLookup(e) {
          var t = et.nodePermissions(e, "x");
          return t || (e.node_ops.lookup ? 0 : 2);
        },
        mayCreate: function mayCreate(e, t) {
          try {
            et.lookupNode(e, t);
            return 20;
          } catch (e) {}

          return et.nodePermissions(e, "wx");
        },
        mayDelete: function mayDelete(e, t, r) {
          var n;

          try {
            n = et.lookupNode(e, t);
          } catch (e) {
            return e.errno;
          }

          var i = et.nodePermissions(e, "wx");
          if (i) return i;

          if (r) {
            if (!et.isDir(n.mode)) return 54;
            if (et.isRoot(n) || et.getPath(n) === et.cwd()) return 10;
          } else if (et.isDir(n.mode)) return 31;

          return 0;
        },
        mayOpen: function mayOpen(e, t) {
          return e ? et.isLink(e.mode) ? 32 : et.isDir(e.mode) && ("r" !== et.flagsToPermissionString(t) || 512 & t) ? 31 : et.nodePermissions(e, et.flagsToPermissionString(t)) : 44;
        },
        MAX_OPEN_FDS: 4096,
        nextfd: function nextfd(e, t) {
          e = e || 0, t = t || et.MAX_OPEN_FDS;

          for (var r = e; r <= t; r++) {
            if (!et.streams[r]) return r;
          }

          throw new et.ErrnoError(33);
        },
        getStream: function getStream(e) {
          return et.streams[e];
        },
        createStream: function createStream(e, t, r) {
          et.FSStream || (et.FSStream = function () {}, et.FSStream.prototype = {}, Object.defineProperties(et.FSStream.prototype, {
            object: {
              get: function get() {
                return this.node;
              },
              set: function set(e) {
                this.node = e;
              }
            },
            isRead: {
              get: function get() {
                return 1 != (2097155 & this.flags);
              }
            },
            isWrite: {
              get: function get() {
                return 0 != (2097155 & this.flags);
              }
            },
            isAppend: {
              get: function get() {
                return 1024 & this.flags;
              }
            }
          }));
          var n = new et.FSStream();

          for (var i in e) {
            n[i] = e[i];
          }

          e = n;
          var o = et.nextfd(t, r);
          return e.fd = o, et.streams[o] = e, e;
        },
        closeStream: function closeStream(e) {
          et.streams[e] = null;
        },
        chrdev_stream_ops: {
          open: function open(e) {
            var t = et.getDevice(e.node.rdev);
            e.stream_ops = t.stream_ops, e.stream_ops.open && e.stream_ops.open(e);
          },
          llseek: function llseek() {
            throw new et.ErrnoError(70);
          }
        },
        major: function major(e) {
          return e >> 8;
        },
        minor: function minor(e) {
          return 255 & e;
        },
        makedev: function makedev(e, t) {
          return e << 8 | t;
        },
        registerDevice: function registerDevice(e, t) {
          et.devices[e] = {
            stream_ops: t
          };
        },
        getDevice: function getDevice(e) {
          return et.devices[e];
        },
        getMounts: function getMounts(e) {
          for (var t = [], r = [e]; r.length;) {
            var n = r.pop();
            t.push(n), r.push.apply(r, n.mounts);
          }

          return t;
        },
        syncfs: function syncfs(e, t) {
          "function" == typeof e && (t = e, e = !1), et.syncFSRequests++, et.syncFSRequests > 1 && et.syncFSRequests;
          var r = et.getMounts(et.root.mount),
              n = 0;

          function i(e) {
            return et.syncFSRequests--, t(e);
          }

          function o(e) {
            if (e) return o.errored ? void 0 : (o.errored = !0, i(e));
            ++n >= r.length && i(null);
          }

          r.forEach(function (t) {
            if (!t.type.syncfs) return o(null);
            t.type.syncfs(t, e, o);
          });
        },
        mount: function mount(e, t, r) {
          var n,
              i = "/" === r,
              o = !r;
          if (i && et.root) throw new et.ErrnoError(10);

          if (!i && !o) {
            var a = et.lookupPath(r, {
              follow_mount: !1
            });
            if (r = a.path, n = a.node, et.isMountpoint(n)) throw new et.ErrnoError(10);
            if (!et.isDir(n.mode)) throw new et.ErrnoError(54);
          }

          var s = {
            type: e,
            opts: t,
            mountpoint: r,
            mounts: []
          },
              f = e.mount(s);
          return f.mount = s, s.root = f, i ? et.root = f : n && (n.mounted = s, n.mount && n.mount.mounts.push(s)), f;
        },
        unmount: function unmount(e) {
          var t = et.lookupPath(e, {
            follow_mount: !1
          });
          if (!et.isMountpoint(t.node)) throw new et.ErrnoError(28);
          var r = t.node,
              n = r.mounted,
              i = et.getMounts(n);
          Object.keys(et.nameTable).forEach(function (e) {
            for (var t = et.nameTable[e]; t;) {
              var r = t.name_next;
              -1 !== i.indexOf(t.mount) && et.destroyNode(t), t = r;
            }
          }), r.mounted = null;
          var o = r.mount.mounts.indexOf(n);
          r.mount.mounts.splice(o, 1);
        },
        lookup: function lookup(e, t) {
          return e.node_ops.lookup(e, t);
        },
        mknod: function mknod(e, t, r) {
          var n = et.lookupPath(e, {
            parent: !0
          }).node,
              i = Ve.basename(e);
          if (!i || "." === i || ".." === i) throw new et.ErrnoError(28);
          var o = et.mayCreate(n, i);
          if (o) throw new et.ErrnoError(o);
          if (!n.node_ops.mknod) throw new et.ErrnoError(63);
          return n.node_ops.mknod(n, i, t, r);
        },
        create: function create(e, t) {
          return t = void 0 !== t ? t : 438, t &= 4095, t |= 32768, et.mknod(e, t, 0);
        },
        mkdir: function mkdir(e, t) {
          return t = void 0 !== t ? t : 511, t &= 1023, t |= 16384, et.mknod(e, t, 0);
        },
        mkdirTree: function mkdirTree(e, t) {
          for (var r = e.split("/"), n = "", i = 0; i < r.length; ++i) {
            if (r[i]) {
              n += "/" + r[i];

              try {
                et.mkdir(n, t);
              } catch (e) {
                if (20 != e.errno) throw e;
              }
            }
          }
        },
        mkdev: function mkdev(e, t, r) {
          return void 0 === r && (r = t, t = 438), t |= 8192, et.mknod(e, t, r);
        },
        symlink: function symlink(e, t) {
          if (!Xe.resolve(e)) throw new et.ErrnoError(44);
          var r = et.lookupPath(t, {
            parent: !0
          }).node;
          if (!r) throw new et.ErrnoError(44);
          var n = Ve.basename(t),
              i = et.mayCreate(r, n);
          if (i) throw new et.ErrnoError(i);
          if (!r.node_ops.symlink) throw new et.ErrnoError(63);
          return r.node_ops.symlink(r, n, e);
        },
        rename: function rename(e, t) {
          var r,
              n,
              i = Ve.dirname(e),
              o = Ve.dirname(t),
              a = Ve.basename(e),
              s = Ve.basename(t);

          try {
            r = et.lookupPath(e, {
              parent: !0
            }).node, n = et.lookupPath(t, {
              parent: !0
            }).node;
          } catch (e) {
            throw new et.ErrnoError(10);
          }

          if (!r || !n) throw new et.ErrnoError(44);
          if (r.mount !== n.mount) throw new et.ErrnoError(75);
          var f,
              u = et.lookupNode(r, a),
              c = Xe.relative(e, o);
          if ("." !== c.charAt(0)) throw new et.ErrnoError(28);
          if ("." !== (c = Xe.relative(t, i)).charAt(0)) throw new et.ErrnoError(55);

          try {
            f = et.lookupNode(n, s);
          } catch (e) {}

          if (u !== f) {
            var h = et.isDir(u.mode),
                d = et.mayDelete(r, a, h);
            if (d) throw new et.ErrnoError(d);
            if (d = f ? et.mayDelete(n, s, h) : et.mayCreate(n, s)) throw new et.ErrnoError(d);
            if (!r.node_ops.rename) throw new et.ErrnoError(63);
            if (et.isMountpoint(u) || f && et.isMountpoint(f)) throw new et.ErrnoError(10);
            if (n !== r && (d = et.nodePermissions(r, "w"))) throw new et.ErrnoError(d);

            try {
              et.trackingDelegate.willMovePath && et.trackingDelegate.willMovePath(e, t);
            } catch (e) {
              e.message;
            }

            et.hashRemoveNode(u);

            try {
              r.node_ops.rename(u, n, s);
            } catch (e) {
              throw e;
            } finally {
              et.hashAddNode(u);
            }

            try {
              et.trackingDelegate.onMovePath && et.trackingDelegate.onMovePath(e, t);
            } catch (e) {
              e.message;
            }
          }
        },
        rmdir: function rmdir(e) {
          var t = et.lookupPath(e, {
            parent: !0
          }).node,
              r = Ve.basename(e),
              n = et.lookupNode(t, r),
              i = et.mayDelete(t, r, !0);
          if (i) throw new et.ErrnoError(i);
          if (!t.node_ops.rmdir) throw new et.ErrnoError(63);
          if (et.isMountpoint(n)) throw new et.ErrnoError(10);

          try {
            et.trackingDelegate.willDeletePath && et.trackingDelegate.willDeletePath(e);
          } catch (e) {
            e.message;
          }

          t.node_ops.rmdir(t, r), et.destroyNode(n);

          try {
            et.trackingDelegate.onDeletePath && et.trackingDelegate.onDeletePath(e);
          } catch (e) {
            e.message;
          }
        },
        readdir: function readdir(e) {
          var t = et.lookupPath(e, {
            follow: !0
          }).node;
          if (!t.node_ops.readdir) throw new et.ErrnoError(54);
          return t.node_ops.readdir(t);
        },
        unlink: function unlink(e) {
          var t = et.lookupPath(e, {
            parent: !0
          }).node,
              r = Ve.basename(e),
              n = et.lookupNode(t, r),
              i = et.mayDelete(t, r, !1);
          if (i) throw new et.ErrnoError(i);
          if (!t.node_ops.unlink) throw new et.ErrnoError(63);
          if (et.isMountpoint(n)) throw new et.ErrnoError(10);

          try {
            et.trackingDelegate.willDeletePath && et.trackingDelegate.willDeletePath(e);
          } catch (e) {
            e.message;
          }

          t.node_ops.unlink(t, r), et.destroyNode(n);

          try {
            et.trackingDelegate.onDeletePath && et.trackingDelegate.onDeletePath(e);
          } catch (e) {
            e.message;
          }
        },
        readlink: function readlink(e) {
          var t = et.lookupPath(e).node;
          if (!t) throw new et.ErrnoError(44);
          if (!t.node_ops.readlink) throw new et.ErrnoError(28);
          return Xe.resolve(et.getPath(t.parent), t.node_ops.readlink(t));
        },
        stat: function stat(e, t) {
          var r = et.lookupPath(e, {
            follow: !t
          }).node;
          if (!r) throw new et.ErrnoError(44);
          if (!r.node_ops.getattr) throw new et.ErrnoError(63);
          return r.node_ops.getattr(r);
        },
        lstat: function lstat(e) {
          return et.stat(e, !0);
        },
        chmod: function chmod(e, t, r) {
          var n;
          "string" == typeof e ? n = et.lookupPath(e, {
            follow: !r
          }).node : n = e;
          if (!n.node_ops.setattr) throw new et.ErrnoError(63);
          n.node_ops.setattr(n, {
            mode: 4095 & t | -4096 & n.mode,
            timestamp: Date.now()
          });
        },
        lchmod: function lchmod(e, t) {
          et.chmod(e, t, !0);
        },
        fchmod: function fchmod(e, t) {
          var r = et.getStream(e);
          if (!r) throw new et.ErrnoError(8);
          et.chmod(r.node, t);
        },
        chown: function chown(e, t, r, n) {
          var i;
          "string" == typeof e ? i = et.lookupPath(e, {
            follow: !n
          }).node : i = e;
          if (!i.node_ops.setattr) throw new et.ErrnoError(63);
          i.node_ops.setattr(i, {
            timestamp: Date.now()
          });
        },
        lchown: function lchown(e, t, r) {
          et.chown(e, t, r, !0);
        },
        fchown: function fchown(e, t, r) {
          var n = et.getStream(e);
          if (!n) throw new et.ErrnoError(8);
          et.chown(n.node, t, r);
        },
        truncate: function truncate(e, t) {
          if (t < 0) throw new et.ErrnoError(28);
          var r;
          "string" == typeof e ? r = et.lookupPath(e, {
            follow: !0
          }).node : r = e;
          if (!r.node_ops.setattr) throw new et.ErrnoError(63);
          if (et.isDir(r.mode)) throw new et.ErrnoError(31);
          if (!et.isFile(r.mode)) throw new et.ErrnoError(28);
          var n = et.nodePermissions(r, "w");
          if (n) throw new et.ErrnoError(n);
          r.node_ops.setattr(r, {
            size: t,
            timestamp: Date.now()
          });
        },
        ftruncate: function ftruncate(e, t) {
          var r = et.getStream(e);
          if (!r) throw new et.ErrnoError(8);
          if (0 == (2097155 & r.flags)) throw new et.ErrnoError(28);
          et.truncate(r.node, t);
        },
        utime: function utime(e, t, r) {
          var n = et.lookupPath(e, {
            follow: !0
          }).node;
          n.node_ops.setattr(n, {
            timestamp: Math.max(t, r)
          });
        },
        open: function open(e, t, r, n, i) {
          if ("" === e) throw new et.ErrnoError(44);
          var a;
          if (r = void 0 === r ? 438 : r, r = 64 & (t = "string" == typeof t ? et.modeStringToFlags(t) : t) ? 4095 & r | 32768 : 0, "object" === o(e)) a = e;else {
            e = Ve.normalize(e);

            try {
              a = et.lookupPath(e, {
                follow: !(131072 & t)
              }).node;
            } catch (e) {}
          }
          var f = !1;
          if (64 & t) if (a) {
            if (128 & t) throw new et.ErrnoError(20);
          } else a = et.mknod(e, r, 0), f = !0;
          if (!a) throw new et.ErrnoError(44);
          if (et.isChrdev(a.mode) && (t &= -513), 65536 & t && !et.isDir(a.mode)) throw new et.ErrnoError(54);

          if (!f) {
            var u = et.mayOpen(a, t);
            if (u) throw new et.ErrnoError(u);
          }

          512 & t && et.truncate(a, 0), t &= -641;
          var c = et.createStream({
            node: a,
            path: et.getPath(a),
            flags: t,
            seekable: !0,
            position: 0,
            stream_ops: a.stream_ops,
            ungotten: [],
            error: !1
          }, n, i);
          c.stream_ops.open && c.stream_ops.open(c), !s.logReadFiles || 1 & t || (et.readFiles || (et.readFiles = {}), e in et.readFiles || (et.readFiles[e] = 1));

          try {
            if (et.trackingDelegate.onOpenFile) {
              var h = 0;
              1 != (2097155 & t) && (h |= et.tracking.openFlags.READ), 0 != (2097155 & t) && (h |= et.tracking.openFlags.WRITE), et.trackingDelegate.onOpenFile(e, h);
            }
          } catch (e) {
            e.message;
          }

          return c;
        },
        close: function close(e) {
          if (et.isClosed(e)) throw new et.ErrnoError(8);
          e.getdents && (e.getdents = null);

          try {
            e.stream_ops.close && e.stream_ops.close(e);
          } catch (e) {
            throw e;
          } finally {
            et.closeStream(e.fd);
          }

          e.fd = null;
        },
        isClosed: function isClosed(e) {
          return null === e.fd;
        },
        llseek: function llseek(e, t, r) {
          if (et.isClosed(e)) throw new et.ErrnoError(8);
          if (!e.seekable || !e.stream_ops.llseek) throw new et.ErrnoError(70);
          if (0 != r && 1 != r && 2 != r) throw new et.ErrnoError(28);
          return e.position = e.stream_ops.llseek(e, t, r), e.ungotten = [], e.position;
        },
        read: function read(e, t, r, n, i) {
          if (n < 0 || i < 0) throw new et.ErrnoError(28);
          if (et.isClosed(e)) throw new et.ErrnoError(8);
          if (1 == (2097155 & e.flags)) throw new et.ErrnoError(8);
          if (et.isDir(e.node.mode)) throw new et.ErrnoError(31);
          if (!e.stream_ops.read) throw new et.ErrnoError(28);
          var o = void 0 !== i;

          if (o) {
            if (!e.seekable) throw new et.ErrnoError(70);
          } else i = e.position;

          var a = e.stream_ops.read(e, t, r, n, i);
          return o || (e.position += a), a;
        },
        write: function write(e, t, r, n, i, o) {
          if (n < 0 || i < 0) throw new et.ErrnoError(28);
          if (et.isClosed(e)) throw new et.ErrnoError(8);
          if (0 == (2097155 & e.flags)) throw new et.ErrnoError(8);
          if (et.isDir(e.node.mode)) throw new et.ErrnoError(31);
          if (!e.stream_ops.write) throw new et.ErrnoError(28);
          1024 & e.flags && et.llseek(e, 0, 2);
          var a = void 0 !== i;

          if (a) {
            if (!e.seekable) throw new et.ErrnoError(70);
          } else i = e.position;

          var s = e.stream_ops.write(e, t, r, n, i, o);
          a || (e.position += s);

          try {
            e.path && et.trackingDelegate.onWriteToFile && et.trackingDelegate.onWriteToFile(e.path);
          } catch (t) {
            e.path, t.message;
          }

          return s;
        },
        allocate: function allocate(e, t, r) {
          if (et.isClosed(e)) throw new et.ErrnoError(8);
          if (t < 0 || r <= 0) throw new et.ErrnoError(28);
          if (0 == (2097155 & e.flags)) throw new et.ErrnoError(8);
          if (!et.isFile(e.node.mode) && !et.isDir(e.node.mode)) throw new et.ErrnoError(43);
          if (!e.stream_ops.allocate) throw new et.ErrnoError(138);
          e.stream_ops.allocate(e, t, r);
        },
        mmap: function mmap(e, t, r, n, i, o, a) {
          if (0 != (2 & o) && 0 == (2 & a) && 2 != (2097155 & e.flags)) throw new et.ErrnoError(2);
          if (1 == (2097155 & e.flags)) throw new et.ErrnoError(2);
          if (!e.stream_ops.mmap) throw new et.ErrnoError(43);
          return e.stream_ops.mmap(e, t, r, n, i, o, a);
        },
        msync: function msync(e, t, r, n, i) {
          return e && e.stream_ops.msync ? e.stream_ops.msync(e, t, r, n, i) : 0;
        },
        munmap: function munmap(e) {
          return 0;
        },
        ioctl: function ioctl(e, t, r) {
          if (!e.stream_ops.ioctl) throw new et.ErrnoError(59);
          return e.stream_ops.ioctl(e, t, r);
        },
        readFile: function readFile(e, t) {
          if ((t = t || {}).flags = t.flags || "r", t.encoding = t.encoding || "binary", "utf8" !== t.encoding && "binary" !== t.encoding) throw new Error('Invalid encoding type "' + t.encoding + '"');
          var r,
              n = et.open(e, t.flags),
              i = et.stat(e).size,
              o = new Uint8Array(i);
          return et.read(n, o, 0, i, 0), "utf8" === t.encoding ? r = F(o, 0) : "binary" === t.encoding && (r = o), et.close(n), r;
        },
        writeFile: function writeFile(e, t, r) {
          (r = r || {}).flags = r.flags || "w";
          var n = et.open(e, r.flags, r.mode);

          if ("string" == typeof t) {
            var i = new Uint8Array(V(t) + 1),
                o = K(t, i, 0, i.length);
            et.write(n, i, 0, o, void 0, r.canOwn);
          } else {
            if (!ArrayBuffer.isView(t)) throw new Error("Unsupported data type");
            et.write(n, t, 0, t.byteLength, void 0, r.canOwn);
          }

          et.close(n);
        },
        cwd: function cwd() {
          return et.currentPath;
        },
        chdir: function chdir(e) {
          var t = et.lookupPath(e, {
            follow: !0
          });
          if (null === t.node) throw new et.ErrnoError(44);
          if (!et.isDir(t.node.mode)) throw new et.ErrnoError(54);
          var r = et.nodePermissions(t.node, "x");
          if (r) throw new et.ErrnoError(r);
          et.currentPath = t.path;
        },
        createDefaultDirectories: function createDefaultDirectories() {
          et.mkdir("/tmp"), et.mkdir("/home"), et.mkdir("/home/web_user");
        },
        createDefaultDevices: function createDefaultDevices() {
          var t;

          if (et.mkdir("/dev"), et.registerDevice(et.makedev(1, 3), {
            read: function read() {
              return 0;
            },
            write: function write(e, t, r, n, i) {
              return n;
            }
          }), et.mkdev("/dev/null", et.makedev(1, 3)), Ge.register(et.makedev(5, 0), Ge.default_tty_ops), Ge.register(et.makedev(6, 0), Ge.default_tty1_ops), et.mkdev("/dev/tty", et.makedev(5, 0)), et.mkdev("/dev/tty1", et.makedev(6, 0)), "object" === ("undefined" == typeof crypto ? "undefined" : o(crypto)) && "function" == typeof crypto.getRandomValues) {
            var r = new Uint8Array(1);

            t = function t() {
              return crypto.getRandomValues(r), r[0];
            };
          } else if (l) try {
            var n = e("crypto");

            t = function t() {
              return n.randomBytes(1)[0];
            };
          } catch (e) {}

          t || (t = function t() {
            Te("random_device");
          }), et.createDevice("/dev", "random", t), et.createDevice("/dev", "urandom", t), et.mkdir("/dev/shm"), et.mkdir("/dev/shm/tmp");
        },
        createSpecialDirectories: function createSpecialDirectories() {
          et.mkdir("/proc"), et.mkdir("/proc/self"), et.mkdir("/proc/self/fd"), et.mount({
            mount: function mount() {
              var e = et.createNode("/proc/self", "fd", 16895, 73);
              return e.node_ops = {
                lookup: function lookup(e, t) {
                  var r = +t,
                      n = et.getStream(r);
                  if (!n) throw new et.ErrnoError(8);
                  var i = {
                    parent: null,
                    mount: {
                      mountpoint: "fake"
                    },
                    node_ops: {
                      readlink: function readlink() {
                        return n.path;
                      }
                    }
                  };
                  return i.parent = i, i;
                }
              }, e;
            }
          }, {}, "/proc/self/fd");
        },
        createStandardStreams: function createStandardStreams() {
          s.stdin ? et.createDevice("/dev", "stdin", s.stdin) : et.symlink("/dev/tty", "/dev/stdin"), s.stdout ? et.createDevice("/dev", "stdout", null, s.stdout) : et.symlink("/dev/tty", "/dev/stdout"), s.stderr ? et.createDevice("/dev", "stderr", null, s.stderr) : et.symlink("/dev/tty1", "/dev/stderr");
          et.open("/dev/stdin", "r"), et.open("/dev/stdout", "w"), et.open("/dev/stderr", "w");
        },
        ensureErrnoError: function ensureErrnoError() {
          et.ErrnoError || (et.ErrnoError = function (e, t) {
            this.node = t, this.setErrno = function (e) {
              this.errno = e;
            }, this.setErrno(e), this.message = "FS error";
          }, et.ErrnoError.prototype = new Error(), et.ErrnoError.prototype.constructor = et.ErrnoError, [44].forEach(function (e) {
            et.genericErrors[e] = new et.ErrnoError(e), et.genericErrors[e].stack = "<generic error, no stack>";
          }));
        },
        staticInit: function staticInit() {
          et.ensureErrnoError(), et.nameTable = new Array(4096), et.mount(Ze, {}, "/"), et.createDefaultDirectories(), et.createDefaultDevices(), et.createSpecialDirectories(), et.filesystems = {
            MEMFS: Ze,
            IDBFS: Ye,
            NODEFS: $e,
            WORKERFS: Qe
          };
        },
        init: function init(e, t, r) {
          et.init.initialized = !0, et.ensureErrnoError(), s.stdin = e || s.stdin, s.stdout = t || s.stdout, s.stderr = r || s.stderr, et.createStandardStreams();
        },
        quit: function quit() {
          et.init.initialized = !1;
          var e = s._fflush;
          e && e(0);

          for (var t = 0; t < et.streams.length; t++) {
            var r = et.streams[t];
            r && et.close(r);
          }
        },
        getMode: function getMode(e, t) {
          var r = 0;
          return e && (r |= 365), t && (r |= 146), r;
        },
        joinPath: function joinPath(e, t) {
          var r = Ve.join.apply(null, e);
          return t && "/" == r[0] && (r = r.substr(1)), r;
        },
        absolutePath: function absolutePath(e, t) {
          return Xe.resolve(t, e);
        },
        standardizePath: function standardizePath(e) {
          return Ve.normalize(e);
        },
        findObject: function findObject(e, t) {
          var r = et.analyzePath(e, t);
          return r.exists ? r.object : (We(r.error), null);
        },
        analyzePath: function analyzePath(e, t) {
          try {
            e = (n = et.lookupPath(e, {
              follow: !t
            })).path;
          } catch (e) {}

          var r = {
            isRoot: !1,
            exists: !1,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: !1,
            parentPath: null,
            parentObject: null
          };

          try {
            var n = et.lookupPath(e, {
              parent: !0
            });
            r.parentExists = !0, r.parentPath = n.path, r.parentObject = n.node, r.name = Ve.basename(e), n = et.lookupPath(e, {
              follow: !t
            }), r.exists = !0, r.path = n.path, r.object = n.node, r.name = n.node.name, r.isRoot = "/" === n.path;
          } catch (e) {
            r.error = e.errno;
          }

          return r;
        },
        createFolder: function createFolder(e, t, r, n) {
          var i = Ve.join2("string" == typeof e ? e : et.getPath(e), t),
              o = et.getMode(r, n);
          return et.mkdir(i, o);
        },
        createPath: function createPath(e, t, r, n) {
          e = "string" == typeof e ? e : et.getPath(e);

          for (var i = t.split("/").reverse(); i.length;) {
            var o = i.pop();

            if (o) {
              var a = Ve.join2(e, o);

              try {
                et.mkdir(a);
              } catch (e) {}

              e = a;
            }
          }

          return a;
        },
        createFile: function createFile(e, t, r, n, i) {
          var o = Ve.join2("string" == typeof e ? e : et.getPath(e), t),
              a = et.getMode(n, i);
          return et.create(o, a);
        },
        createDataFile: function createDataFile(e, t, r, n, i, o) {
          var a = t ? Ve.join2("string" == typeof e ? e : et.getPath(e), t) : e,
              s = et.getMode(n, i),
              f = et.create(a, s);

          if (r) {
            if ("string" == typeof r) {
              for (var u = new Array(r.length), c = 0, h = r.length; c < h; ++c) {
                u[c] = r.charCodeAt(c);
              }

              r = u;
            }

            et.chmod(f, 146 | s);
            var d = et.open(f, "w");
            et.write(d, r, 0, r.length, 0, o), et.close(d), et.chmod(f, s);
          }

          return f;
        },
        createDevice: function createDevice(e, t, r, n) {
          var i = Ve.join2("string" == typeof e ? e : et.getPath(e), t),
              o = et.getMode(!!r, !!n);
          et.createDevice.major || (et.createDevice.major = 64);
          var a = et.makedev(et.createDevice.major++, 0);
          return et.registerDevice(a, {
            open: function open(e) {
              e.seekable = !1;
            },
            close: function close(e) {
              n && n.buffer && n.buffer.length && n(10);
            },
            read: function read(e, t, n, i, o) {
              for (var a = 0, s = 0; s < i; s++) {
                var f;

                try {
                  f = r();
                } catch (e) {
                  throw new et.ErrnoError(29);
                }

                if (void 0 === f && 0 === a) throw new et.ErrnoError(6);
                if (null == f) break;
                a++, t[n + s] = f;
              }

              return a && (e.node.timestamp = Date.now()), a;
            },
            write: function write(e, t, r, i, o) {
              for (var a = 0; a < i; a++) {
                try {
                  n(t[r + a]);
                } catch (e) {
                  throw new et.ErrnoError(29);
                }
              }

              return i && (e.node.timestamp = Date.now()), a;
            }
          }), et.mkdev(i, o, a);
        },
        createLink: function createLink(e, t, r, n, i) {
          var o = Ve.join2("string" == typeof e ? e : et.getPath(e), t);
          return et.symlink(r, o);
        },
        forceLoadFile: function forceLoadFile(e) {
          if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
          var t = !0;
          if ("undefined" != typeof XMLHttpRequest) throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          if (!m) throw new Error("Cannot load without read() or XMLHttpRequest.");

          try {
            e.contents = Nt(m(e.url), !0), e.usedBytes = e.contents.length;
          } catch (e) {
            t = !1;
          }

          return t || We(29), t;
        },
        createLazyFile: function createLazyFile(e, t, r, n, i) {
          function o() {
            this.lengthKnown = !1, this.chunks = [];
          }

          if (o.prototype.get = function (e) {
            if (!(e > this.length - 1 || e < 0)) {
              var t = e % this.chunkSize,
                  r = e / this.chunkSize | 0;
              return this.getter(r)[t];
            }
          }, o.prototype.setDataGetter = function (e) {
            this.getter = e;
          }, o.prototype.cacheLength = function () {
            var e = new XMLHttpRequest();
            if (e.open("HEAD", r, !1), e.send(null), !(e.status >= 200 && e.status < 300 || 304 === e.status)) throw new Error("Couldn't load " + r + ". Status: " + e.status);
            var t,
                n = Number(e.getResponseHeader("Content-length")),
                i = (t = e.getResponseHeader("Accept-Ranges")) && "bytes" === t,
                o = (t = e.getResponseHeader("Content-Encoding")) && "gzip" === t,
                a = 1048576;
            i || (a = n);
            var s = this;
            s.setDataGetter(function (e) {
              var t = e * a,
                  i = (e + 1) * a - 1;
              if (i = Math.min(i, n - 1), void 0 === s.chunks[e] && (s.chunks[e] = function (e, t) {
                if (e > t) throw new Error("invalid range (" + e + ", " + t + ") or no bytes requested!");
                if (t > n - 1) throw new Error("only " + n + " bytes available! programmer error!");
                var i = new XMLHttpRequest();
                if (i.open("GET", r, !1), n !== a && i.setRequestHeader("Range", "bytes=" + e + "-" + t), "undefined" != typeof Uint8Array && (i.responseType = "arraybuffer"), i.overrideMimeType && i.overrideMimeType("text/plain; charset=x-user-defined"), i.send(null), !(i.status >= 200 && i.status < 300 || 304 === i.status)) throw new Error("Couldn't load " + r + ". Status: " + i.status);
                return void 0 !== i.response ? new Uint8Array(i.response || []) : Nt(i.responseText || "", !0);
              }(t, i)), void 0 === s.chunks[e]) throw new Error("doXHR failed!");
              return s.chunks[e];
            }), !o && n || (a = n = 1, n = this.getter(0).length, a = n), this._length = n, this._chunkSize = a, this.lengthKnown = !0;
          }, "undefined" != typeof XMLHttpRequest) {
            if (!d) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var a = new o();
            Object.defineProperties(a, {
              length: {
                get: function get() {
                  return this.lengthKnown || this.cacheLength(), this._length;
                }
              },
              chunkSize: {
                get: function get() {
                  return this.lengthKnown || this.cacheLength(), this._chunkSize;
                }
              }
            });
            var s = {
              isDevice: !1,
              contents: a
            };
          } else s = {
            isDevice: !1,
            url: r
          };

          var f = et.createFile(e, t, s, n, i);
          s.contents ? f.contents = s.contents : s.url && (f.contents = null, f.url = s.url), Object.defineProperties(f, {
            usedBytes: {
              get: function get() {
                return this.contents.length;
              }
            }
          });
          var u = {};
          return Object.keys(f.stream_ops).forEach(function (e) {
            var t = f.stream_ops[e];

            u[e] = function () {
              if (!et.forceLoadFile(f)) throw new et.ErrnoError(29);
              return t.apply(null, arguments);
            };
          }), u.read = function (e, t, r, n, i) {
            if (!et.forceLoadFile(f)) throw new et.ErrnoError(29);
            var o = e.node.contents;
            if (i >= o.length) return 0;
            var a = Math.min(o.length - i, n);
            if (o.slice) for (var s = 0; s < a; s++) {
              t[r + s] = o[i + s];
            } else for (s = 0; s < a; s++) {
              t[r + s] = o.get(i + s);
            }
            return a;
          }, f.stream_ops = u, f;
        },
        createPreloadedFile: function createPreloadedFile(e, t, r, n, i, o, a, f, u, c) {
          Browser.init();
          var h = t ? Xe.resolve(Ve.join2(e, t)) : e;

          function d(r) {
            function d(r) {
              c && c(), f || et.createDataFile(e, t, r, n, i, u), o && o(), Be();
            }

            var l = !1;
            s.preloadPlugins.forEach(function (e) {
              l || e.canHandle(h) && (e.handle(r, h, d, function () {
                a && a(), Be();
              }), l = !0);
            }), l || d(r);
          }

          Ie(), "string" == typeof r ? Browser.asyncLoad(r, function (e) {
            d(e);
          }, a) : d(r);
        },
        indexedDB: function indexedDB() {
          return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        },
        DB_NAME: function DB_NAME() {
          return "EM_FS_" + window.location.pathname;
        },
        DB_VERSION: 20,
        DB_STORE_NAME: "FILE_DATA",
        saveFilesToDB: function saveFilesToDB(e, t, r) {
          t = t || function () {}, r = r || function () {};
          var n = et.indexedDB();

          try {
            var i = n.open(et.DB_NAME(), et.DB_VERSION);
          } catch (e) {
            return r(e);
          }

          i.onupgradeneeded = function () {
            i.result.createObjectStore(et.DB_STORE_NAME);
          }, i.onsuccess = function () {
            var n = i.result.transaction([et.DB_STORE_NAME], "readwrite"),
                o = n.objectStore(et.DB_STORE_NAME),
                a = 0,
                s = 0,
                f = e.length;

            function u() {
              0 == s ? t() : r();
            }

            e.forEach(function (e) {
              var t = o.put(et.analyzePath(e).object.contents, e);
              t.onsuccess = function () {
                ++a + s == f && u();
              }, t.onerror = function () {
                s++, a + s == f && u();
              };
            }), n.onerror = r;
          }, i.onerror = r;
        },
        loadFilesFromDB: function loadFilesFromDB(e, t, r) {
          t = t || function () {}, r = r || function () {};
          var n = et.indexedDB();

          try {
            var i = n.open(et.DB_NAME(), et.DB_VERSION);
          } catch (e) {
            return r(e);
          }

          i.onupgradeneeded = r, i.onsuccess = function () {
            var n = i.result;

            try {
              var o = n.transaction([et.DB_STORE_NAME], "readonly");
            } catch (e) {
              return void r(e);
            }

            var a = o.objectStore(et.DB_STORE_NAME),
                s = 0,
                f = 0,
                u = e.length;

            function c() {
              0 == f ? t() : r();
            }

            e.forEach(function (e) {
              var t = a.get(e);
              t.onsuccess = function () {
                et.analyzePath(e).exists && et.unlink(e), et.createDataFile(Ve.dirname(e), Ve.basename(e), t.result, !0, !0, !0), ++s + f == u && c();
              }, t.onerror = function () {
                f++, s + f == u && c();
              };
            }), o.onerror = r;
          }, i.onerror = r;
        }
      },
          tt = {
        DEFAULT_POLLMASK: 5,
        mappings: {},
        umask: 511,
        calculateAt: function calculateAt(e, t) {
          if ("/" !== t[0]) {
            var r;
            if (-100 === e) r = et.cwd();else {
              var n = et.getStream(e);
              if (!n) throw new et.ErrnoError(8);
              r = n.path;
            }
            t = Ve.join2(r, t);
          }

          return t;
        },
        doStat: function doStat(e, t, r) {
          try {
            var n = e(t);
          } catch (e) {
            if (e && e.node && Ve.normalize(t) !== Ve.normalize(et.getPath(e.node))) return -54;
            throw e;
          }

          return te[r >> 2] = n.dev, te[r + 4 >> 2] = 0, te[r + 8 >> 2] = n.ino, te[r + 12 >> 2] = n.mode, te[r + 16 >> 2] = n.nlink, te[r + 20 >> 2] = n.uid, te[r + 24 >> 2] = n.gid, te[r + 28 >> 2] = n.rdev, te[r + 32 >> 2] = 0, Oe = [n.size >>> 0, (Pe = n.size, +_e(Pe) >= 1 ? Pe > 0 ? (0 | Se(+Me(Pe / 4294967296), 4294967295)) >>> 0 : ~~+Ee((Pe - +(~~Pe >>> 0)) / 4294967296) >>> 0 : 0)], te[r + 40 >> 2] = Oe[0], te[r + 44 >> 2] = Oe[1], te[r + 48 >> 2] = 4096, te[r + 52 >> 2] = n.blocks, te[r + 56 >> 2] = n.atime.getTime() / 1e3 | 0, te[r + 60 >> 2] = 0, te[r + 64 >> 2] = n.mtime.getTime() / 1e3 | 0, te[r + 68 >> 2] = 0, te[r + 72 >> 2] = n.ctime.getTime() / 1e3 | 0, te[r + 76 >> 2] = 0, Oe = [n.ino >>> 0, (Pe = n.ino, +_e(Pe) >= 1 ? Pe > 0 ? (0 | Se(+Me(Pe / 4294967296), 4294967295)) >>> 0 : ~~+Ee((Pe - +(~~Pe >>> 0)) / 4294967296) >>> 0 : 0)], te[r + 80 >> 2] = Oe[0], te[r + 84 >> 2] = Oe[1], 0;
        },
        doMsync: function doMsync(e, t, r, n) {
          var i = new Uint8Array($.subarray(e, e + r));
          et.msync(t, i, 0, r, n);
        },
        doMkdir: function doMkdir(e, t) {
          return "/" === (e = Ve.normalize(e))[e.length - 1] && (e = e.substr(0, e.length - 1)), et.mkdir(e, t, 0), 0;
        },
        doMknod: function doMknod(e, t, r) {
          switch (61440 & t) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
              break;

            default:
              return -28;
          }

          return et.mknod(e, t, r), 0;
        },
        doReadlink: function doReadlink(e, t, r) {
          if (r <= 0) return -28;
          var n = et.readlink(e),
              i = Math.min(r, V(n)),
              o = J[t + i];
          return W(n, t, r + 1), J[t + i] = o, i;
        },
        doAccess: function doAccess(e, t) {
          if (-8 & t) return -28;
          var r;
          if (!(r = et.lookupPath(e, {
            follow: !0
          }).node)) return -44;
          var n = "";
          return 4 & t && (n += "r"), 2 & t && (n += "w"), 1 & t && (n += "x"), n && et.nodePermissions(r, n) ? -2 : 0;
        },
        doDup: function doDup(e, t, r) {
          var n = et.getStream(r);
          return n && et.close(n), et.open(e, t, 0, r, r).fd;
        },
        doReadv: function doReadv(e, t, r, n) {
          for (var i = 0, o = 0; o < r; o++) {
            var a = te[t + 8 * o >> 2],
                s = te[t + (8 * o + 4) >> 2],
                f = et.read(e, J, a, s, n);
            if (f < 0) return -1;
            if (i += f, f < s) break;
          }

          return i;
        },
        doWritev: function doWritev(e, t, r, n) {
          for (var i = 0, o = 0; o < r; o++) {
            var a = te[t + 8 * o >> 2],
                s = te[t + (8 * o + 4) >> 2],
                f = et.write(e, J, a, s, n);
            if (f < 0) return -1;
            i += f;
          }

          return i;
        },
        varargs: 0,
        get: function get(e) {
          return tt.varargs += 4, te[tt.varargs - 4 >> 2];
        },
        getStr: function getStr() {
          return H(tt.get());
        },
        getStreamFromFD: function getStreamFromFD(e) {
          void 0 === e && (e = tt.get());
          var t = et.getStream(e);
          if (!t) throw new et.ErrnoError(8);
          return t;
        },
        get64: function get64() {
          var e = tt.get();
          tt.get();
          return e;
        },
        getZero: function getZero() {
          tt.get();
        }
      };

      function rt(e, t) {
        tt.varargs = t;

        try {
          var r = tt.getStreamFromFD();

          switch (tt.get()) {
            case 0:
              return (n = tt.get()) < 0 ? -28 : et.open(r.path, r.flags, 0, n).fd;

            case 1:
            case 2:
              return 0;

            case 3:
              return r.flags;

            case 4:
              var n = tt.get();
              return r.flags |= n, 0;

            case 12:
              n = tt.get();
              return Q[n + 0 >> 1] = 2, 0;

            case 13:
            case 14:
              return 0;

            case 16:
            case 8:
              return -28;

            case 9:
              return We(28), -1;

            default:
              return -28;
          }
        } catch (e) {
          return void 0 !== et && e instanceof et.ErrnoError || Te(e), -e.errno;
        }
      }

      function nt(e, t) {
        tt.varargs = t;

        try {
          var r = tt.getStreamFromFD(),
              n = tt.get(),
              i = tt.get();
          return et.read(r, J, n, i);
        } catch (e) {
          return void 0 !== et && e instanceof et.ErrnoError || Te(e), -e.errno;
        }
      }

      function it(e, t) {
        tt.varargs = t;

        try {
          var r = tt.getStr(),
              n = tt.get(),
              i = tt.get();
          return et.open(r, n, i).fd;
        } catch (e) {
          return void 0 !== et && e instanceof et.ErrnoError || Te(e), -e.errno;
        }
      }

      function ot(e) {
        try {
          var t = tt.getStreamFromFD(e);
          return et.close(t), 0;
        } catch (e) {
          return void 0 !== et && e instanceof et.ErrnoError || Te(e), e.errno;
        }
      }

      function at() {
        return ot.apply(null, arguments);
      }

      function st(e, t) {
        try {
          var r = tt.getStreamFromFD(e),
              n = r.tty ? 2 : et.isDir(r.mode) ? 3 : et.isLink(r.mode) ? 7 : 4;
          return J[t >> 0] = n, 0;
        } catch (e) {
          return void 0 !== et && e instanceof et.ErrnoError || Te(e), e.errno;
        }
      }

      function ft() {
        return st.apply(null, arguments);
      }

      function ut(e, t, r, n, i) {
        try {
          var o = tt.getStreamFromFD(e),
              a = 4294967296 * r + (t >>> 0);
          return a <= -9007199254740992 || a >= 9007199254740992 ? -61 : (et.llseek(o, a, n), Oe = [o.position >>> 0, (Pe = o.position, +_e(Pe) >= 1 ? Pe > 0 ? (0 | Se(+Me(Pe / 4294967296), 4294967295)) >>> 0 : ~~+Ee((Pe - +(~~Pe >>> 0)) / 4294967296) >>> 0 : 0)], te[i >> 2] = Oe[0], te[i + 4 >> 2] = Oe[1], o.getdents && 0 === a && 0 === n && (o.getdents = null), 0);
        } catch (e) {
          return void 0 !== et && e instanceof et.ErrnoError || Te(e), e.errno;
        }
      }

      function ct() {
        return ut.apply(null, arguments);
      }

      function ht(e, t, r, n) {
        try {
          var i = tt.getStreamFromFD(e),
              o = tt.doWritev(i, t, r);
          return te[n >> 2] = o, 0;
        } catch (e) {
          return void 0 !== et && e instanceof et.ErrnoError || Te(e), e.errno;
        }
      }

      function dt() {
        return ht.apply(null, arguments);
      }

      function lt(e) {
        delete wt.xhrs[e - 1];
      }

      function pt() {
        Te();
      }

      function bt() {
        return void 0 === bt.start && (bt.start = Date.now()), 1e3 * (Date.now() - bt.start) | 0;
      }

      function mt() {
        return J.length;
      }

      function yt() {
        return !d;
      }

      function gt(e) {
        try {
          return T.grow(e - Y.byteLength + 65535 >> 16), oe(T.buffer), 1;
        } catch (e) {}
      }

      function vt(e) {
        var t = mt();
        if (e > 2147418112) return !1;

        for (var r = Math.max(t, 16777216); r < e;) {
          r = r <= 536870912 ? ie(2 * r, 65536) : Math.min(ie((3 * r + 2147483648) / 4, 65536), 2147418112);
        }

        return !!gt(r);
      }

      var wt = {
        xhrs: [],
        setu64: function setu64(e, t) {
          re[e >> 2] = t, re[e + 4 >> 2] = t / 4294967296 | 0;
        },
        openDatabase: function openDatabase(e, t, r, n) {
          try {
            var i = indexedDB.open(e, t);
          } catch (e) {
            return n(e);
          }

          i.onupgradeneeded = function (e) {
            var t = e.target.result;
            t.objectStoreNames.contains("FILES") && t.deleteObjectStore("FILES"), t.createObjectStore("FILES");
          }, i.onsuccess = function (e) {
            r(e.target.result);
          }, i.onerror = function (e) {
            n(e);
          };
        },
        staticInit: function staticInit() {
          var e = "undefined" == typeof ENVIRONMENT_IS_FETCH_WORKER;
          wt.openDatabase("emscripten_filesystem", 1, function (t) {
            wt.dbInstance = t, e && Be();
          }, function () {
            wt.dbInstance = !1, e && Be();
          }), "undefined" != typeof ENVIRONMENT_IS_FETCH_WORKER && ENVIRONMENT_IS_FETCH_WORKER || Ie();
        }
      };

      function _t(e, t, r, n, i) {
        var o = re[e + 8 >> 2];

        if (o) {
          var a = H(o),
              s = e + 112,
              f = H(s);
          f || (f = "GET");
          re[s + 32 >> 2];

          var u = re[s + 52 >> 2],
              c = re[s + 56 >> 2],
              h = !!re[s + 60 >> 2],
              d = (re[s + 64 >> 2], re[s + 68 >> 2]),
              l = re[s + 72 >> 2],
              p = re[s + 76 >> 2],
              b = re[s + 80 >> 2],
              m = re[s + 84 >> 2],
              y = re[s + 88 >> 2],
              g = !!(1 & u),
              v = !!(2 & u),
              w = !!(64 & u),
              _ = d ? H(d) : void 0,
              E = l ? H(l) : void 0,
              M = b ? H(b) : void 0,
              S = new XMLHttpRequest();

          if (S.withCredentials = h, S.open(f, a, !w, _, E), w || (S.timeout = c), S.url_ = a, C(!v, "streaming uses moz-chunked-arraybuffer which is no longer supported; TODO: rewrite using fetch()"), S.responseType = "arraybuffer", b && S.overrideMimeType(M), p) for (;;) {
            var k = re[p >> 2];
            if (!k) break;
            var A = re[p + 4 >> 2];
            if (!A) break;
            p += 8;
            var x = H(k),
                R = H(A);
            S.setRequestHeader(x, R);
          }
          wt.xhrs.push(S);
          var I = wt.xhrs.length;
          re[e + 0 >> 2] = I;
          var B = m && y ? $.slice(m, m + y) : null;
          S.onload = function (n) {
            var i = S.response ? S.response.byteLength : 0,
                o = 0,
                a = 0;
            g && !v && (o = yr(a = i), $.set(new Uint8Array(S.response), o)), re[e + 12 >> 2] = o, wt.setu64(e + 16, a), wt.setu64(e + 24, 0), i && wt.setu64(e + 32, i), ee[e + 40 >> 1] = S.readyState, 4 === S.readyState && 0 === S.status && (S.status = i > 0 ? 200 : 404), ee[e + 42 >> 1] = S.status, S.statusText && W(S.statusText, e + 44, 64), S.status >= 200 && S.status < 300 ? t && t(e, S, n) : r && r(e, S, n);
          }, S.onerror = function (t) {
            var n = S.status;
            4 === S.readyState && 0 === n && (n = 404), re[e + 12 >> 2] = 0, wt.setu64(e + 16, 0), wt.setu64(e + 24, 0), wt.setu64(e + 32, 0), ee[e + 40 >> 1] = S.readyState, ee[e + 42 >> 1] = n, r && r(e, S, t);
          }, S.ontimeout = function (t) {
            r && r(e, S, t);
          }, S.onprogress = function (t) {
            var r = g && v && S.response ? S.response.byteLength : 0,
                i = 0;
            g && v && (i = yr(r), $.set(new Uint8Array(S.response), i)), re[e + 12 >> 2] = i, wt.setu64(e + 16, r), wt.setu64(e + 24, t.loaded - r), wt.setu64(e + 32, t.total), ee[e + 40 >> 1] = S.readyState, S.readyState >= 3 && 0 === S.status && t.loaded > 0 && (S.status = 200), ee[e + 42 >> 1] = S.status, S.statusText && W(S.statusText, e + 44, 64), n && n(e, S, t);
          }, S.onreadystatechange = function (t) {
            ee[e + 40 >> 1] = S.readyState, S.readyState >= 2 && (ee[e + 42 >> 1] = S.status), i && i(e, S, t);
          };

          try {
            S.send(B);
          } catch (t) {
            r && r(e, S, t);
          }
        } else r(e, 0, "no url specified!");
      }

      function Et(e, t, r, n, i) {
        if (e) {
          var o = re[t + 112 + 64 >> 2];
          o || (o = re[t + 8 >> 2]);
          var a = H(o);

          try {
            var s = e.transaction(["FILES"], "readwrite").objectStore("FILES").put(r, a);
            s.onsuccess = function (e) {
              ee[t + 40 >> 1] = 4, ee[t + 42 >> 1] = 200, W("OK", t + 44, 64), n(t, 0, a);
            }, s.onerror = function (e) {
              ee[t + 40 >> 1] = 4, ee[t + 42 >> 1] = 413, W("Payload Too Large", t + 44, 64), i(t, 0, e);
            };
          } catch (e) {
            i(t, 0, e);
          }
        } else i(t, 0, "IndexedDB not available!");
      }

      function Mt(e, t, r, n) {
        if (e) {
          var i = re[t + 112 + 64 >> 2];
          i || (i = re[t + 8 >> 2]);
          var o = H(i);

          try {
            var a = e.transaction(["FILES"], "readonly").objectStore("FILES").get(o);
            a.onsuccess = function (e) {
              if (e.target.result) {
                var i = e.target.result,
                    o = i.byteLength || i.length,
                    a = yr(o);
                $.set(new Uint8Array(i), a), re[t + 12 >> 2] = a, wt.setu64(t + 16, o), wt.setu64(t + 24, 0), wt.setu64(t + 32, o), ee[t + 40 >> 1] = 4, ee[t + 42 >> 1] = 200, W("OK", t + 44, 64), r(t, 0, i);
              } else ee[t + 40 >> 1] = 4, ee[t + 42 >> 1] = 404, W("Not Found", t + 44, 64), n(t, 0, "no data");
            }, a.onerror = function (e) {
              ee[t + 40 >> 1] = 4, ee[t + 42 >> 1] = 404, W("Not Found", t + 44, 64), n(t, 0, e);
            };
          } catch (e) {
            n(t, 0, e);
          }
        } else n(t, 0, "IndexedDB not available!");
      }

      function St(e, t, r, n) {
        if (e) {
          var i = re[t + 112 + 64 >> 2];
          i || (i = re[t + 8 >> 2]);
          var o = H(i);

          try {
            var a = e.transaction(["FILES"], "readwrite").objectStore("FILES")["delete"](o);
            a.onsuccess = function (e) {
              var n = e.target.result;
              re[t + 12 >> 2] = 0, wt.setu64(t + 16, 0), wt.setu64(t + 24, 0), wt.setu64(t + 32, 0), ee[t + 40 >> 1] = 4, ee[t + 42 >> 1] = 200, W("OK", t + 44, 64), r(t, 0, n);
            }, a.onerror = function (e) {
              ee[t + 40 >> 1] = 4, ee[t + 42 >> 1] = 404, W("Not Found", t + 44, 64), n(t, 0, e);
            };
          } catch (e) {
            n(t, 0, e);
          }
        } else n(t, 0, "IndexedDB not available!");
      }

      function kt(e, t, r, n, i) {
        void 0 !== B && (B = !0);

        var o = e + 112,
            a = H(o),
            s = re[o + 36 >> 2],
            f = re[o + 40 >> 2],
            u = re[o + 44 >> 2],
            c = re[o + 48 >> 2],
            h = re[o + 52 >> 2],
            d = !!(4 & h),
            l = !!(32 & h),
            p = !!(16 & h),
            b = function b(e, r, n) {
          s ? _r(s, e) : t && t(e);
        },
            m = function m(e, t, r) {
          u ? _r(u, e) : n && n(e);
        },
            y = function y(e, t, n) {
          f ? _r(f, e) : r && r(e);
        },
            g = function g(e, t, r) {
          c ? _r(c, e) : i && i(e);
        },
            v = function v(e, r, n) {
          Et(wt.dbInstance, e, r.response, function (e, r, n) {
            s ? _r(s, e) : t && t(e);
          }, function (e, r, n) {
            s ? _r(s, e) : t && t(e);
          });
        };

        if ("EM_IDB_STORE" === a) {
          var w = re[o + 84 >> 2];
          Et(wt.dbInstance, e, $.slice(w, w + re[o + 88 >> 2]), b, y);
        } else if ("EM_IDB_DELETE" === a) St(wt.dbInstance, e, b, y);else if (p) {
          if (l) return 0;

          _t(e, d ? v : b, y, m, g);
        } else Mt(wt.dbInstance, e, b, l ? y : d ? function (e, t, r) {
          _t(e, v, y, m, g);
        } : function (e, t, r) {
          _t(e, b, y, m, g);
        });

        return e;
      }

      var At = _e;

      function xt(e) {
        return 0 === e ? 0 : (e = H(e), He.hasOwnProperty(e) ? (xt.ret && mr(xt.ret), xt.ret = X(He[e]), xt.ret) : 0);
      }

      function Rt(e) {
        var t = Date.now();
        return te[e >> 2] = t / 1e3 | 0, te[e + 4 >> 2] = t % 1e3 * 1e3 | 0, 0;
      }

      W("GMT", 133968, 4);

      function It(e) {
        return Math.pow(2, e);
      }

      function Bt(e) {
        return It(e);
      }

      function Tt(e) {
        var t = jt,
            r = t.LLVM_SAVEDSTACKS[e];
        t.LLVM_SAVEDSTACKS.splice(e, 1), vr(r);
      }

      function jt() {
        var e = jt;
        return e.LLVM_SAVEDSTACKS || (e.LLVM_SAVEDSTACKS = []), e.LLVM_SAVEDSTACKS.push(wr()), e.LLVM_SAVEDSTACKS.length - 1;
      }

      var Dt = ke;

      function Pt(e, t, r) {
        $.set($.subarray(t, t + r), e);
      }

      function Ot(e) {
        var t = Date.now() / 1e3 | 0;
        return e && (te[e >> 2] = t), t;
      }

      if (et.staticInit(), p) {
        var Ct = e("fs"),
            Lt = e("path");
        $e.staticInit();
      }

      function Nt(e, t, r) {
        var n = r > 0 ? r : V(e) + 1,
            i = new Array(n),
            o = K(e, i, 0, i.length);
        return t && (i.length = o), i;
      }

      function Ut(e, t) {
        return x[e](t);
      }

      function qt(e, t, r) {
        return x[e](t, r);
      }

      function zt(e, t, r, n) {
        return x[e](t, r, n);
      }

      function Ft(e, t) {
        return x[e](t);
      }

      function Ht(e, t, r, n, i, o, a) {
        return x[e](t, r, n, i, o, a);
      }

      function Kt(e, t, r) {
        return x[e](t, r);
      }

      function Wt(e, t, r, n) {
        return x[e](t, r, n);
      }

      function Vt(e, t, r, n, i) {
        return x[e](t, r, n, i);
      }

      function Xt(e, t, r, n, i, o) {
        return x[e](t, r, n, i, o);
      }

      function Gt(e, t, r, n, i, o, a) {
        return x[e](t, r, n, i, o, a);
      }

      function Zt(e, t, r, n) {
        return x[e](t, r, n);
      }

      function Yt(e) {
        x[e]();
      }

      function Jt(e, t) {
        x[e](t);
      }

      function $t(e, t, r) {
        x[e](t, r);
      }

      function Qt(e, t, r, n) {
        x[e](t, r, n);
      }

      function er(e, t, r, n, i) {
        x[e](t, r, n, i);
      }

      function tr(e, t, r, n, i, o) {
        x[e](t, r, n, i, o);
      }

      function rr(e, t, r, n, i, o, a) {
        x[e](t, r, n, i, o, a);
      }

      function nr(e, t, r, n, i, o, a, s) {
        x[e](t, r, n, i, o, a, s);
      }

      function ir(e, t, r, n, i, o, a, s, f) {
        x[e](t, r, n, i, o, a, s, f);
      }

      function or(e, t, r, n, i, o, a, s, f, u, c, h) {
        x[e](t, r, n, i, o, a, s, f, u, c, h);
      }

      function ar(e, t, r, n, i, o, a, s, f, u) {
        x[e](t, r, n, i, o, a, s, f, u);
      }

      function sr(e, t, r, n, i, o, a, s, f, u, c) {
        x[e](t, r, n, i, o, a, s, f, u, c);
      }

      function fr(e, t, r, n, i, o, a, s, f, u, c, h) {
        x[e](t, r, n, i, o, a, s, f, u, c, h);
      }

      function ur(e, t, r, n, i, o, a, s, f, u, c, h, d) {
        x[e](t, r, n, i, o, a, s, f, u, c, h, d);
      }

      function cr(e, t, r, n, i, o, a, s, f, u, c, h, d, l, p) {
        x[e](t, r, n, i, o, a, s, f, u, c, h, d, l, p);
      }

      wt.staticInit();
      var hr = {},
          dr = {
        Z: Ke,
        E: rt,
        Y: nt,
        X: it,
        D: at,
        W: ft,
        F: ct,
        V: dt,
        U: lt,
        __memory_base: 1024,
        __table_base: 0,
        b: pt,
        T: bt,
        S: mt,
        R: yt,
        Q: Pt,
        P: vt,
        O: kt,
        N: At,
        B: xt,
        C: Rt,
        M: Bt,
        L: Tt,
        K: jt,
        J: Dt,
        I: Ot,
        a: Te,
        H: D,
        A: Ut,
        p: qt,
        i: zt,
        h: Ft,
        g: Ht,
        f: Kt,
        e: Wt,
        d: Vt,
        c: Xt,
        z: Gt,
        G: Zt,
        y: Yt,
        x: Jt,
        w: $t,
        v: Qt,
        u: er,
        t: tr,
        s: rr,
        r: nr,
        q: ir,
        o: or,
        n: ar,
        m: sr,
        l: fr,
        k: ur,
        j: cr,
        memory: T,
        table: P
      },
          lr = s.asm(hr, dr, Y);
      s.asm = lr;

      var pr,
          br = s.___emscripten_environ_constructor = function () {
        return s.asm._.apply(null, arguments);
      },
          mr = (s.___errno_location = function () {
        return s.asm.$.apply(null, arguments);
      }, s._closeVideo = function () {
        return s.asm.aa.apply(null, arguments);
      }, s._decodeCodecContext = function () {
        return s.asm.ba.apply(null, arguments);
      }, s._exitMissile = function () {
        return s.asm.ca.apply(null, arguments);
      }, s._free = function () {
        return s.asm.da.apply(null, arguments);
      }),
          yr = (s._initMissile = function () {
        return s.asm.ea.apply(null, arguments);
      }, s._initializeDecoder = function () {
        return s.asm.fa.apply(null, arguments);
      }, s._malloc = function () {
        return s.asm.ga.apply(null, arguments);
      }),
          gr = (s._registerPlayer = function () {
        return s.asm.ha.apply(null, arguments);
      }, s._release = function () {
        return s.asm.ia.apply(null, arguments);
      }, s._setCodecType = function () {
        return s.asm.ja.apply(null, arguments);
      }, s.stackAlloc = function () {
        return s.asm.ma.apply(null, arguments);
      }),
          vr = s.stackRestore = function () {
        return s.asm.na.apply(null, arguments);
      },
          wr = s.stackSave = function () {
        return s.asm.oa.apply(null, arguments);
      },
          _r = (s.dynCall_v = function () {
        return s.asm.ka.apply(null, arguments);
      }, s.dynCall_vi = function () {
        return s.asm.la.apply(null, arguments);
      });

      function Er(e) {
        this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e;
      }

      function Mr(e) {
        function t() {
          pr || (pr = !0, O || (me(), ye(), s.onRuntimeInitialized && s.onRuntimeInitialized(), ge()));
        }

        e = e || u, Ae > 0 || (be(), Ae > 0 || (s.setStatus ? (s.setStatus("Running..."), setTimeout(function () {
          setTimeout(function () {
            s.setStatus("");
          }, 1), t();
        }, 1)) : t()));
      }

      if (s.asm = lr, s.ccall = N, s.cwrap = U, s.addFunction = R, Re = function e() {
        pr || Mr(), pr || (Re = e);
      }, s.run = Mr, s.preInit) for ("function" == typeof s.preInit && (s.preInit = [s.preInit]); s.preInit.length > 0;) {
        s.preInit.pop()();
      }
      B = !0, Mr(), t.exports = s;
    }).call(this, e("_process"), e("buffer").Buffer, "/src");
  }, {
    _process: 156,
    buffer: 65,
    crypto: 74,
    fs: 63,
    path: 148
  }],
  198: [function (e, t, r) {
    (function (e) {
      "use strict";

      e.STATIC_MEM_wasmDecoderState = -1, e.STATICE_MEM_playerCount = -1, e.STATICE_MEM_playerIndexPtr = 0;
    }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {}]
}, {}, [196]);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
"use strict";

var _index = _interopRequireDefault(require("./index"));

var _renderYuv420p = _interopRequireDefault(require("./render-yuv420p"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @author changyanlong
 * @email porschegt23@foxmail.com
 * @qq 531365872
 * @wechat numberwolf11
 * @github github.com/numberwolf
 */
var token = "base64:QXV0aG9yOmNoYW5neWFubG9uZ3xudW1iZXJ3b2xmLEdpdGh1YjpodHRwczovL2dpdGh1Yi5jb20vbnVtYmVyd29sZixFbWFpbDpwb3JzY2hlZ3QyM0Bmb3htYWlsLmNvbSxRUTo1MzEzNjU4NzIsSG9tZVBhZ2U6aHR0cDovL3h2aWRlby52aWRlbyxEaXNjb3JkOm51bWJlcndvbGYjODY5NCx3ZWNoYXI6bnVtYmVyd29sZjExLEJlaWppbmcsV29ya0luOkJhaWR1";
var version = '100.2.0';
var url265 = "res/video40_265_moov_30s.hevc";
var url265_2 = "res/spreedmovie.hevc";
var networkInterval = null;
var networkInterval2 = null;
var timerFeed = null;
var timerFeed2 = null;
var rawParserObj = null;
var rawParserObj2 = null;
var decoderMod = null;
var decoderMod2 = null;
var canvas = document.querySelector('#canvas');
var canvas2 = document.querySelector('#canvas2');
var start1btn = document.querySelector('#start1-btn');
var start2btn = document.querySelector('#start2-btn');
var release1btn = document.querySelector('#release1-btn');
var release2btn = document.querySelector('#release2-btn');

var yuv = _renderYuv420p["default"].setupCanvas(canvas, {
  preserveDrawingBuffer: false
});

var yuv2 = _renderYuv420p["default"].setupCanvas(canvas2, {
  preserveDrawingBuffer: false
});

start1btn.onclick = function () {
  var main = function main() {
    rawParserObj = new _index["default"].CRawParser();
    var fileStart = 0;
    var startFetch = false;
    networkInterval = window.setInterval(function () {
      if (!startFetch) {
        startFetch = true;
        fetch(url265).then(function (response) {
          var pump = function pump(reader) {
            return reader.read().then(function (result) {
              if (result.done) {
                window.clearInterval(networkInterval);
                return;
              }

              var chunk = result.value;
              rawParserObj.appendStreamRet(chunk);
              return pump(reader);
            });
          };

          return pump(response.body.getReader());
        })["catch"](function (error) {
          console.log(error);
        });
      }
    }, 1);
    var ptsIdx = 0;
    timerFeed = window.setInterval(function () {
      var nalBuf = rawParserObj.nextNalu(); // nal

      if (nalBuf != false) {
        decoderMod.decodeNalu(nalBuf, ptsIdx);
        ptsIdx++;
      }
    }, 2);
  }; // 1


  decoderMod = new _index["default"].CMissileDecoder(token, version);

  release1btn.onclick = function () {
    if (networkInterval !== null) {
      window.clearInterval(networkInterval);
      networkInterval = null;
    }

    if (timerFeed !== null) {
      window.clearInterval(timerFeed);
      timerFeed = null;
    }

    rawParserObj.release();
    rawParserObj = null;
    decoderMod.release();
    decoderMod = null;
  }; // 2


  decoderMod.initFinish = function () {
    console.log("init Finshed");
    var bind_ret = decoderMod.bindCallback(function (y, u, v, stride_y, stride_u, stride_v, width, height, pts, pix_name) {
      // console.log("======> One Frame ");
      // console.log("======> ======> width, height, pts", width, height, pts);
      // console.log("======> ======> pix_name", pix_name);
      // console.log("======> ======> Y ", stride_y, y);
      // console.log("======> ======> U ", stride_u, u);
      // console.log("======> ======> V ", stride_v, v);
      _renderYuv420p["default"].renderFrame(yuv, y, u, v, stride_y, height);
    });
    console.log("bind ret ", bind_ret);
    main();
  }; // 3


  decoderMod.initDecoder();
};
/*
 * Second decoder
 */


start2btn.onclick = function () {
  var main2 = function main2() {
    rawParserObj2 = new _index["default"].CRawParser();
    var fileStart = 0;
    var startFetch = false;
    networkInterval2 = window.setInterval(function () {
      if (!startFetch) {
        startFetch = true;
        fetch(url265_2).then(function (response) {
          var pump = function pump(reader) {
            return reader.read().then(function (result) {
              if (result.done) {
                window.clearInterval(networkInterval2);
                return;
              }

              var chunk = result.value;
              rawParserObj2.appendStreamRet(chunk);
              return pump(reader);
            });
          };

          return pump(response.body.getReader());
        })["catch"](function (error) {
          console.log(error);
        });
      }
    }, 1);
    var ptsIdx = 0;
    timerFeed2 = window.setInterval(function () {
      var nalBuf = rawParserObj2.nextNalu(); // nal

      if (nalBuf != false) {
        decoderMod2.decodeNalu(nalBuf, ptsIdx);
        ptsIdx++;
      }
    }, 2);
  }; // 1


  decoderMod2 = new _index["default"].CMissileDecoder(token, version);

  release2btn.onclick = function () {
    if (networkInterval2 !== null) {
      window.clearInterval(networkInterval2);
      networkInterval2 = null;
    }

    if (timerFeed2 !== null) {
      window.clearInterval(timerFeed2);
      timerFeed2 = null;
    }

    rawParserObj2.release();
    rawParserObj2 = null;
    decoderMod2.release();
    decoderMod2 = null;
  }; // 2


  decoderMod2.initFinish = function () {
    console.log("init second Finshed");
    var bind_ret = decoderMod2.bindCallback(function (y, u, v, stride_y, stride_u, stride_v, width, height, pts, pix_name) {
      // console.log("======> One Frame in Second");
      // console.log("======> ======> width, height, pts", width, height, pts);
      // console.log("======> ======> pix_name", pix_name);
      // console.log("======> ======> Y ", stride_y, y);
      // console.log("======> ======> U ", stride_u, u);
      // console.log("======> ======> V ", stride_v, v);
      _renderYuv420p["default"].renderFrame(yuv2, y, u, v, stride_y, height);
    });
    console.log("bind second ret ", bind_ret);
    main2();
  }; // 3


  decoderMod2.initDecoder();
};

},{"./index":3,"./render-yuv420p":5}],3:[function(require,module,exports){
(function (global){
"use strict";

/**
 * @author changyanlong
 * @email porschegt23@foxmail.com
 * @qq 531365872
 * @wechat numberwolf11
 * @github github.com/numberwolf
 */
require('./decoder');

require('./raw-parser');

module.exports = {
  CMissileDecoder: global.MissileDecoderModule,
  CRawParser: global.RawParserModule
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./decoder":1,"./raw-parser":4}],4:[function(require,module,exports){
(function (global){
"use strict";

!function t(e, r, n) {
  function i(a, u) {
    if (!r[a]) {
      if (!e[a]) {
        var l = "function" == typeof require && require;
        if (!u && l) return l(a, !0);
        if (s) return s(a, !0);
        var f = new Error("Cannot find module '" + a + "'");
        throw f.code = "MODULE_NOT_FOUND", f;
      }

      var h = r[a] = {
        exports: {}
      };
      e[a][0].call(h.exports, function (t) {
        return i(e[a][1][t] || t);
      }, h, h.exports, t, e, r, n);
    }

    return r[a].exports;
  }

  for (var s = "function" == typeof require && require, a = 0; a < n.length; a++) {
    i(n[a]);
  }

  return i;
}({
  1: [function (t, e, r) {
    (function (t) {
      "use strict";

      function e(t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
        }
      }

      var r = function () {
        function t() {
          !function (t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
          }(this, t), this.frameList = null, this.stream = null;
        }

        var r, n, i;
        return r = t, (n = [{
          key: "release",
          value: function value() {
            null !== this.frameList && (this.frameList.length = 0), this.stream = null;
          }
        }, {
          key: "pushFrameRet",
          value: function value(t) {
            return !(!t || null == t || null == t || (this.frameList && null != this.frameList && null != this.frameList || (this.frameList = []), this.frameList.push(t), 0));
          }
        }, {
          key: "nextFrame",
          value: function value() {
            return !this.frameList && null == this.frameList || null == this.frameList && this.frameList.length < 1 ? null : this.frameList.shift();
          }
        }, {
          key: "clearFrameRet",
          value: function value() {
            this.frameList = null;
          }
        }, {
          key: "setStreamRet",
          value: function value(t) {
            this.stream = t;
          }
        }, {
          key: "getStreamRet",
          value: function value() {
            return this.stream;
          }
        }, {
          key: "appendStreamRet",
          value: function value(t) {
            if (!t || void 0 === t || null == t) return !1;
            if (!this.stream || void 0 === this.stream || null == this.stream) return this.stream = t, !0;
            var e = this.stream.length,
                r = t.length,
                n = new Uint8Array(e + r);
            return n.set(this.stream, 0), n.set(t, e), this.stream = n, !0;
          }
        }, {
          key: "subBuf",
          value: function value(t, e) {
            var r = new Uint8Array(this.stream.subarray(t, e + 1));
            return this.stream = new Uint8Array(this.stream.subarray(e + 1)), r;
          }
        }, {
          key: "nextNalu",
          value: function value() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
            if (null == this.stream || this.stream.length <= 4) return !1;

            for (var e = -1, r = 0; r < this.stream.length; r++) {
              if (r + 5 >= this.stream.length) return -1 != e && this.subBuf(e, this.stream.length - 1);

              if (0 == this.stream[r] && 0 == this.stream[r + 1] && 1 == this.stream[r + 2] || 0 == this.stream[r] && 0 == this.stream[r + 1] && 0 == this.stream[r + 2] && 1 == this.stream[r + 3]) {
                var n = r;
                if (r += 3, -1 == e) e = n;else {
                  if (t <= 1) return this.subBuf(e, n - 1);
                  t -= 1;
                }
              }
            }

            return !1;
          }
        }]) && e(r.prototype, n), i && e(r, i), t;
      }();

      t.RawParserModule = r;
    }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {}]
}, {}, [1]);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
"use strict";

/**
 * @author changyanlong
 * @email porschegt23@foxmail.com
 * @qq 531365872
 * @wechat numberwolf11
 * @github github.com/numberwolf
 */
function Texture(gl) {
  this.gl = gl;
  this.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

Texture.prototype.bind = function (n, program, name) {
  var gl = this.gl;
  gl.activeTexture([gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2][n]);
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.uniform1i(gl.getUniformLocation(program, name), n);
};

Texture.prototype.fill = function (width, height, data) {
  var gl = this.gl;
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
};

function setupCanvas(canvas, options) {
  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return gl;
  var program = gl.createProgram();
  var vertexShaderSource = ["attribute highp vec4 aVertexPosition;", "attribute vec2 aTextureCoord;", "varying highp vec2 vTextureCoord;", "void main(void) {", " gl_Position = aVertexPosition;", " vTextureCoord = aTextureCoord;", "}"].join("\n");
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  var fragmentShaderSource = ["precision highp float;", "varying lowp vec2 vTextureCoord;", "uniform sampler2D YTexture;", "uniform sampler2D UTexture;", "uniform sampler2D VTexture;", "const mat4 YUV2RGB = mat4", "(", " 1.1643828125, 0, 1.59602734375, -.87078515625,", " 1.1643828125, -.39176171875, -.81296875, .52959375,", " 1.1643828125, 2.017234375, 0, -1.081390625,", " 0, 0, 0, 1", ");", "void main(void) {", " gl_FragColor = vec4( texture2D(YTexture, vTextureCoord).x, texture2D(UTexture, vTextureCoord).x, texture2D(VTexture, vTextureCoord).x, 1) * YUV2RGB;", "}"].join("\n");
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("Shader link failed.");
  }

  var vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
  var textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
  gl.enableVertexAttribArray(textureCoordAttribute);
  var verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.y = new Texture(gl);
  gl.u = new Texture(gl);
  gl.v = new Texture(gl);
  gl.y.bind(0, program, "YTexture");
  gl.u.bind(1, program, "UTexture");
  gl.v.bind(2, program, "VTexture");
  return gl;
} // function renderFrame(gl, videoFrame, width, height, uOffset, vOffset) {
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//     gl.clearColor(0.0, 0.0, 0.0, 0.0);
//     gl.clear(gl.COLOR_BUFFER_BIT);
//     gl.y.fill(width, height,
//         videoFrame.subarray(0, uOffset));
//     gl.u.fill(width >> 1, height >> 1,
//         videoFrame.subarray(uOffset, uOffset + vOffset));
//     gl.v.fill(width >> 1, height >> 1,
//         videoFrame.subarray(uOffset + vOffset, videoFrame.length));
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
// }


function renderFrame(gl, videoFrameY, videoFrameB, videoFrameR, width, height) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.y.fill(width, height, videoFrameY);
  gl.u.fill(width >> 1, height >> 1, videoFrameB);
  gl.v.fill(width >> 1, height >> 1, videoFrameR);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
/* Player controls Start Here */


function fullscreen() {
  var node = document.getElementById('vidPlayerComp');
  var canvas = document.getElementById('canvas');
  var childrens = node.children;
  var fullScreen;

  if (document.webkitIsFullScreen == false || document['isFullScreen'] == false || screen.height - 50 > window.innerHeight && screen.width == window.innerWidth) {
    (node.webkitRequestFullScreen || node.requestFullScreen || node.mozRequestFullScreen || node.msRequestFullscreen).call(node);
    fullScreen = true;
  } else {
    //(document.webkitCancelFullScreen()||document.cancelFullScreen()||document.mozCancelFullScreen()||document.msExitFullscreen());
    (document.webkitCancelFullScreen || document['cancelFullScreen'] || document['mozCancelFullScreen'] || document['msExitFullscreen']).call(document);
    fullScreen = false;
  }

  var innerWidth = screen.width;
  var innerHeight = screen.height;

  if (fullScreen) {
    node.setAttribute('style', 'width:' + innerWidth + 'px;' + 'height:' + innerHeight + 'px;' + 'margin-top:0px;margin-left:0px;top:0px;left:0px;background-color:black;border:2px solid rgba(17, 48, 69, 0.9);max-width:' + innerWidth + 'px;');
  } else {
    node.setAttribute('style', '');
  }

  for (var i = 0, len = node.children.length; i < len; i++) {
    if (fullScreen) {
      node.children[i].setAttribute('style', 'width:' + innerWidth + 'px;' + 'height:25px;');
    } else {
      node.children[i].setAttribute('style', '');
    }

    if (i === 1) {
      if (fullScreen) {
        node.children[i].setAttribute('style', 'height:' + (innerHeight - 54) + 'px;' + 'width:' + innerWidth + 'px');
        canvas.style.width = innerWidth + 'px';
        canvas.style.height = innerHeight - 54 + 'px';
      } else {
        node.children[i].setAttribute('style', '');
        canvas.setAttribute('style', '');
      }
    }
  }
}

module.exports = {
  renderFrame: renderFrame,
  setupCanvas: setupCanvas
};
/* Player controls Ends Here */

},{}]},{},[2]);
