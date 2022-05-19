;(() => {
  'use strict'
  var e = {
      221: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = new (r(524).PrismaClient)()
        t.default = s
      },
      765: function (e, t, r) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, r, s) {
              return new (r || (r = Promise))(function (n, i) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = n(r(349)),
          o = n(r(506)),
          a = n(r(221)),
          u = n(r(721)),
          d = n(r(142)),
          c = n(r(668)),
          l = n(r(344))
        d.default.config(),
          (t.default = class {
            constructor(e) {
              ;(this.app = e), this.authenticate(), this.refreshToken(), this.logout()
            }
            authenticate() {
              return s(this, void 0, void 0, function* () {
                this.app.post('/api/auth', (e, t) =>
                  s(this, void 0, void 0, function* () {
                    try {
                      const r = o.default
                          .object()
                          .keys({
                            email: o.default.string().email().required(),
                            password: o.default.string().required(),
                          }),
                        s = u.default.validateSchema(r, e.body)
                      if (s) return t.status(400).json({ error: s })
                      const { email: n, password: d } = e.body,
                        f = yield a.default.user.findFirst({
                          where: { email: n },
                          select: { password: !0, email: !0, id: !0, role: !0 },
                        })
                      if (!f) return t.sendStatus(401)
                      if (!(yield i.default.comparePassword(d, f.password)))
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
                          t.cookie('jwt', e, { httpOnly: !0, maxAge: 2592e6, secure: c.default }),
                          t.status(200).json({ userLoggedIn: !0 })
                      }
                    } catch (e) {
                      t.sendStatus(500)
                    }
                  }),
                )
              })
            }
            refreshToken() {
              return s(this, void 0, void 0, function* () {
                this.app.get('/api/auth', (e, t) =>
                  s(this, void 0, void 0, function* () {
                    try {
                      const r = o.default.object().keys({ jwt: o.default.required() })
                      if (u.default.validateSchema(r, e.cookies)) return t.sendStatus(401)
                      const { jwt: n } = e.cookies
                      l.default.verify(n, process.env.ACCESS_TOKEN_SECRET, (e, r) =>
                        s(this, void 0, void 0, function* () {
                          if (e) return t.sendStatus(403)
                          const n = yield a.default.user.findFirst({
                            where: { email: r.email },
                            select: { id: !0, email: !0, role: !0, UserRefreshTokens: !0 },
                          })
                          if (!n) return t.sendStatus(403)
                          const { UserRefreshTokens: i, id: o } = n,
                            [{ token: u }] = i
                          l.default.verify(u, process.env.REFRESH_TOKEN_SECRET, (e) =>
                            s(this, void 0, void 0, function* () {
                              if (e)
                                return (
                                  yield a.default.userRefreshTokens.delete({
                                    where: { userId: o },
                                  }),
                                  t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                                  t.sendStatus(403)
                                )
                              const r = l.default.sign(
                                { email: n.email, role: n.role },
                                process.env.ACCESS_TOKEN_SECRET,
                                { expiresIn: '12h' },
                              )
                              t.cookie('jwt', r, {
                                httpOnly: !0,
                                maxAge: 2592e6,
                                secure: c.default,
                              }),
                                t.status(200).json({ userLoggedIn: !0 })
                            }),
                          )
                        }),
                      )
                    } catch (e) {
                      t.sendStatus(500)
                    }
                  }),
                )
              })
            }
            logout() {
              return s(this, void 0, void 0, function* () {
                this.app.delete('/api/auth', (e, t) =>
                  s(this, void 0, void 0, function* () {
                    try {
                      const r = o.default.object().keys({ jwt: o.default.required() })
                      if (u.default.validateSchema(r, e.cookies)) return t.sendStatus(204)
                      const { jwt: s } = e.cookies,
                        n = yield a.default.user.findFirst({
                          where: { UserRefreshTokens: { some: { token: s } } },
                        })
                      return n
                        ? (yield a.default.userRefreshTokens.delete({ where: { userId: n.id } }),
                          t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                          t.sendStatus(204))
                        : (t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
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
        var s =
            (this && this.__awaiter) ||
            function (e, t, r, s) {
              return new (r || (r = Promise))(function (n, i) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), r(81)
        const i = n(r(860)),
          o = n(r(506)),
          a = n(r(721)),
          u = n(r(710)),
          d = n(r(582)),
          c = n(r(344))
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
              (0, d.default)({
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
              s(this, void 0, void 0, function* () {
                try {
                  const s = o.default.object().keys({ jwt: o.default.required() })
                  if (a.default.validateSchema(s, e.cookies)) return t.sendStatus(401)
                  const { jwt: n } = e.cookies
                  c.default.verify(n, process.env.ACCESS_TOKEN_SECRET, (e, s) => {
                    if (e) return t.sendStatus(403)
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
        var s =
            (this && this.__awaiter) ||
            function (e, t, r, s) {
              return new (r || (r = Promise))(function (n, i) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = n(r(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.get()
          }
          get() {
            this.app.get('/api/devotionals', (e, t) =>
              s(this, void 0, void 0, function* () {
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
        var s =
            (this && this.__awaiter) ||
            function (e, t, r, s) {
              return new (r || (r = Promise))(function (n, i) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = n(r(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.getGrowthGroups()
          }
          getGrowthGroups() {
            return s(this, void 0, void 0, function* () {
              this.app.get('/api/growthgroups', (e, t) =>
                s(this, void 0, void 0, function* () {
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
        var s =
            (this && this.__awaiter) ||
            function (e, t, r, s) {
              return new (r || (r = Promise))(function (n, i) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = n(r(349)),
          o = n(r(506)),
          a = n(r(717)),
          u = n(r(221)),
          d = n(r(721))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.signUp(), a.default.JWT(this.app), this.get()
          }
          get() {
            return s(this, void 0, void 0, function* () {
              this.app.get('/api/users/:id', (e, t) =>
                s(this, void 0, void 0, function* () {
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
            return s(this, void 0, void 0, function* () {
              this.app.post('/api/users', (e, t) =>
                s(this, void 0, void 0, function* () {
                  const r = o.default
                      .object()
                      .keys({
                        email: o.default.string().email().required(),
                        name: o.default.string().required(),
                        phone: o.default.string().required().min(8).max(14),
                        password: o.default.string().min(8),
                        birthdate: o.default.string().required(),
                      }),
                    s = d.default.validateSchema(r, e.body)
                  try {
                    if (s) t.status(400).json({ error: s })
                    else {
                      const { email: r, name: s, password: n, phone: o, birthdate: a } = e.body,
                        d = yield u.default.user.create({
                          data: {
                            email: r,
                            name: s,
                            birthdate: new Date(a).toISOString(),
                            password: yield i.default.hashPassword(n),
                            phone: o,
                          },
                          select: { id: !0, email: !0, name: !0, createdAt: !0, phone: !0 },
                        })
                      t.status(201).json({ message: 'User created', user: d })
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
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = s(r(226)),
          i = s(r(96)),
          o = s(r(717)),
          a = s(r(575)),
          u = s(r(765))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new o.default(this.app),
              new u.default(this.app),
              new i.default(this.app),
              new n.default(this.app),
              new a.default(this.app)
          }
        }
      },
      349: function (e, t, r) {
        var s =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, s) {
                  void 0 === s && (s = r)
                  var n = Object.getOwnPropertyDescriptor(t, r)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      },
                    }),
                    Object.defineProperty(e, s, n)
                }
              : function (e, t, r, s) {
                  void 0 === s && (s = r), (e[s] = t[r])
                }),
          n =
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
                  'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && s(t, e, r)
              return n(t, e), t
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
        var s =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, s) {
                  void 0 === s && (s = r)
                  var n = Object.getOwnPropertyDescriptor(t, r)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      },
                    }),
                    Object.defineProperty(e, s, n)
                }
              : function (e, t, r, s) {
                  void 0 === s && (s = r), (e[s] = t[r])
                }),
          n =
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
                  'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && s(t, e, r)
              return n(t, e), t
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
            const s = r.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return a.mergeAll(s)
          }
        }
      },
      920: function (e, t, r) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = s(r(536)),
          i = s(r(860))
        new (class {
          constructor(e = (0, i.default)()) {
            ;(this.app = e), this.app.listen(process.env.PORT || 5e3, () => new n.default(e))
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
  !(function r(s) {
    var n = t[s]
    if (void 0 !== n) return n.exports
    var i = (t[s] = { exports: {} })
    return e[s].call(i.exports, i, i.exports, r), i.exports
  })(920)
})()
