;(() => {
  'use strict'
  var e = {
      221: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = new (r(524).PrismaClient)()
        t.default = n
      },
      765: function (e, t, r) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, i) {
                function o(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = s(r(349)),
          o = s(r(506)),
          a = s(r(221)),
          u = s(r(721)),
          c = s(r(142)),
          d = s(r(668)),
          l = s(r(344))
        c.default.config(),
          (t.default = class {
            constructor(e) {
              ;(this.app = e), this.authenticate(), this.refreshToken(), this.logout()
            }
            authenticate() {
              return n(this, void 0, void 0, function* () {
                this.app.post('/api/auth', (e, t) =>
                  n(this, void 0, void 0, function* () {
                    try {
                      const r = o.default
                          .object()
                          .keys({
                            email: o.default.string().email().required(),
                            password: o.default.string().required(),
                          }),
                        n = u.default.validateSchema(r, e.body)
                      if (n) return t.status(400).json({ error: n })
                      const { email: s, password: c } = e.body,
                        f = yield a.default.user.findFirst({
                          where: { email: s },
                          select: { password: !0, email: !0, id: !0, role: !0 },
                        })
                      if (!f) return t.sendStatus(401)
                      if (!(yield i.default.comparePassword(c, f.password)))
                        return t.sendStatus(401)
                      {
                        const e = l.default.sign(
                            { email: f.email, role: f.role },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: '12h' },
                          ),
                          r = l.default.sign(
                            { email: f.email, role: f.role },
                            process.env.REFRESH_TOKEN_SECRET,
                            { expiresIn: '30d' },
                          )
                        yield a.default.userRefreshTokens.upsert({
                          where: { userId: f.id },
                          update: { token: r },
                          create: { userId: f.id, token: r },
                        }),
                          t.cookie('jwt', r, { httpOnly: !0, maxAge: 2592e6, secure: d.default }),
                          t.status(200).json({ userLoggedIn: !0, accessToken: e })
                      }
                    } catch (e) {
                      t.sendStatus(500)
                    }
                  }),
                )
              })
            }
            refreshToken() {
              return n(this, void 0, void 0, function* () {
                this.app.get('/api/auth', (e, t) =>
                  n(this, void 0, void 0, function* () {
                    try {
                      const r = o.default.object().keys({ jwt: o.default.required() })
                      if (u.default.validateSchema(r, e.cookies)) return t.sendStatus(401)
                      const { jwt: n } = e.cookies,
                        s = yield a.default.user.findFirst({
                          where: { UserRefreshTokens: { some: { token: n } } },
                          select: { email: !0, role: !0 },
                        })
                      if (!s) return t.sendStatus(403)
                      l.default.verify(n, process.env.REFRESH_TOKEN_SECRET, (e, r) => {
                        if (e || s.email !== r.email || s.role !== r.role) return t.sendStatus(403)
                        const n = l.default.sign(
                          { email: s.email, role: s.role },
                          process.env.ACCESS_TOKEN_SECRET,
                          { expiresIn: '12h' },
                        )
                        t.json({ accessToken: n })
                      })
                    } catch (e) {
                      t.sendStatus(500)
                    }
                  }),
                )
              })
            }
            logout() {
              return n(this, void 0, void 0, function* () {
                this.app.delete('/api/auth', (e, t) =>
                  n(this, void 0, void 0, function* () {
                    try {
                      const r = o.default.object().keys({ jwt: o.default.required() })
                      if (u.default.validateSchema(r, e.cookies)) return t.sendStatus(204)
                      const { jwt: n } = e.cookies,
                        s = yield a.default.user.findFirst({
                          where: { UserRefreshTokens: { some: { token: n } } },
                        })
                      return s
                        ? (yield a.default.userRefreshTokens.delete({ where: { userId: s.id } }),
                          t.clearCookie('jwt', { httpOnly: !0, secure: d.default }),
                          t.sendStatus(204))
                        : (t.clearCookie('jwt', { httpOnly: !0, secure: d.default }),
                          t.sendStatus(204))
                    } catch (e) {
                      t.sendStatus(500)
                    }
                  }),
                )
              })
            }
          })
      },
      717: function (e, t, r) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, i) {
                function o(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), r(81)
        const i = s(r(860)),
          o = s(r(506)),
          a = s(r(721)),
          u = s(r(710)),
          c = s(r(582)),
          d = s(r(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.Logger(),
              this.app.use(i.default.json()),
              this.app.use((0, u.default)()),
              this.app.use(i.default.urlencoded({ extended: !1 }))
          }
          CORS() {
            this.app.use(
              (0, c.default)({
                origin: [
                  'http://localhost:3000',
                  'http://192.168.0.56:3000/',
                  'https://genesisproject-six.vercel.app',
                ],
              }),
            )
          }
          Logger() {
            this.app.use((e, t, r) => {
              console.log(`${e.method} ${e.url} --- Origin: ${e.headers.origin}`), r()
            })
          }
          static JWT(e) {
            e.use((e, t, r) =>
              n(this, void 0, void 0, function* () {
                try {
                  const n = o.default.object().keys({ jwt: o.default.required() })
                  if (a.default.validateSchema(n, e.cookies)) return t.sendStatus(401)
                  const { jwt: s } = e.cookies
                  d.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, n) => {
                    if (
                      (console.log(
                        '🚀 ~ file: index.ts ~ line 54 ~ Middlewares ~ jwt.verify ~ err',
                        e,
                      ),
                      e)
                    )
                      return t.sendStatus(403)
                    r()
                  })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      226: function (e, t, r) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, i) {
                function o(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = s(r(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.get()
          }
          get() {
            this.app.get('/api/devotionals', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const e = yield i.default.devotional.findMany()
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      96: function (e, t, r) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, i) {
                function o(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = s(r(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.getGrowthGroups()
          }
          getGrowthGroups() {
            return n(this, void 0, void 0, function* () {
              this.app.get('/api/growthgroups', (e, t) =>
                n(this, void 0, void 0, function* () {
                  try {
                    const e = yield i.default.growthGroup.findMany()
                    t.status(200).json(e)
                  } catch (e) {
                    t.sendStatus(500).json(null)
                  }
                }),
              )
            })
          }
        }
      },
      575: function (e, t, r) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, i) {
                function o(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = s(r(349)),
          o = s(r(506)),
          a = s(r(717)),
          u = s(r(221)),
          c = s(r(721))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.signUp(), a.default.JWT(this.app), this.get()
          }
          get() {
            return n(this, void 0, void 0, function* () {
              this.app.get('/api/users/:id', (e, t) =>
                n(this, void 0, void 0, function* () {
                  const { id: r } = e.params
                  try {
                    if (r) {
                      const e = yield u.default.user.findFirst({
                        where: { id: r },
                        select: { id: !0, email: !0, name: !0, createdAt: !0, birthdate: !0 },
                      })
                      e || t.status(404).json({ error: 'User not found' }),
                        e && t.status(200).json(e)
                    } else t.status(401).json({ error: 'Invalid or missing ID' })
                  } catch (e) {
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
          signUp() {
            return n(this, void 0, void 0, function* () {
              this.app.post('/api/users', (e, t) =>
                n(this, void 0, void 0, function* () {
                  const r = o.default
                      .object()
                      .keys({
                        email: o.default.string().email().required(),
                        name: o.default.string().required(),
                        phone: o.default.string().required().min(8).max(14),
                        password: o.default.string().min(8),
                        birthdate: o.default.string().required(),
                      }),
                    n = c.default.validateSchema(r, e.body)
                  try {
                    if (n) t.status(400).json({ error: n })
                    else {
                      const { email: r, name: n, password: s, phone: o, birthdate: a } = e.body,
                        c = yield u.default.user.create({
                          data: {
                            email: r,
                            name: n,
                            birthdate: new Date(a).toISOString(),
                            password: yield i.default.hashPassword(s),
                            phone: o,
                          },
                          select: { id: !0, email: !0, name: !0, createdAt: !0, phone: !0 },
                        })
                      t.status(201).json({ message: 'User created', user: c })
                    }
                  } catch (e) {
                    'P2002' === e.code
                      ? t.status(409).json({ error: 'User already exists' })
                      : t.status(500).json({ error: 'Internal server error' })
                  }
                }),
              )
            })
          }
        }
      },
      536: function (e, t, r) {
        var n =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = n(r(226)),
          i = n(r(96)),
          o = n(r(717)),
          a = n(r(575)),
          u = n(r(765))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new o.default(this.app),
              new u.default(this.app),
              new i.default(this.app),
              new s.default(this.app),
              new a.default(this.app)
          }
        }
      },
      349: function (e, t, r) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, n) {
                  void 0 === n && (n = r)
                  var s = Object.getOwnPropertyDescriptor(t, r)
                  ;(s && !('get' in s ? !t.__esModule : s.writable || s.configurable)) ||
                    (s = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      },
                    }),
                    Object.defineProperty(e, n, s)
                }
              : function (e, t, r, n) {
                  void 0 === n && (n = r), (e[n] = t[r])
                }),
          s =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t })
                }
              : function (e, t) {
                  e.default = t
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var r in e)
                  'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r)
              return s(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = i(r(802))
        t.default = class {
          static hashPassword(e) {
            return o.hash(e, 10)
          }
          static comparePassword(e, t) {
            return o.compare(e, t)
          }
        }
      },
      668: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), r(81), (t.default = !0)
      },
      721: function (e, t, r) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, n) {
                  void 0 === n && (n = r)
                  var s = Object.getOwnPropertyDescriptor(t, r)
                  ;(s && !('get' in s ? !t.__esModule : s.writable || s.configurable)) ||
                    (s = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      },
                    }),
                    Object.defineProperty(e, n, s)
                }
              : function (e, t, r, n) {
                  void 0 === n && (n = r), (e[n] = t[r])
                }),
          s =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t })
                }
              : function (e, t) {
                  e.default = t
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var r in e)
                  'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r)
              return s(t, e), t
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = i(r(634)),
          u = o(r(506))
        t.default = class {
          static validateSchema(e, t) {
            const { error: r } = u.default.validate(t, e, { abortEarly: !1, convert: !1 })
            if (!r || !r.details) return
            const n = r.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return a.mergeAll(n)
          }
        }
      },
      920: function (e, t, r) {
        var n =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = n(r(536)),
          i = n(r(860))
        new (class {
          constructor(e = (0, i.default)()) {
            ;(this.app = e), this.app.listen(process.env.PORT || 5e3, () => new s.default(e))
          }
        })()
      },
      524: (e) => {
        e.exports = require('@prisma/client')
      },
      802: (e) => {
        e.exports = require('bcrypt')
      },
      710: (e) => {
        e.exports = require('cookie-parser')
      },
      582: (e) => {
        e.exports = require('cors')
      },
      142: (e) => {
        e.exports = require('dotenv')
      },
      81: (e) => {
        e.exports = require('dotenv/config')
      },
      860: (e) => {
        e.exports = require('express')
      },
      506: (e) => {
        e.exports = require('joi')
      },
      344: (e) => {
        e.exports = require('jsonwebtoken')
      },
      634: (e) => {
        e.exports = require('ramda')
      },
    },
    t = {}
  !(function r(n) {
    var s = t[n]
    if (void 0 !== s) return s.exports
    var i = (t[n] = { exports: {} })
    return e[n].call(i.exports, i, i.exports, r), i.exports
  })(920)
})()
