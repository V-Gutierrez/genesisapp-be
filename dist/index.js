;(() => {
  'use strict'
  var e = {
      221: (e, t, s) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = new (s(524).PrismaClient)()
        t.default = r
      },
      765: function (e, t, s) {
        var r =
            (this && this.__awaiter) ||
            function (e, t, s, r) {
              return new (s || (s = Promise))(function (n, i) {
                function o(e) {
                  try {
                    u(r.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(r.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((r = r.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const i = n(s(349)),
          o = n(s(506)),
          a = n(s(221)),
          u = n(s(721)),
          l = n(s(668)),
          c = n(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.authenticate(), this.refreshToken(), this.logout()
          }
          authenticate() {
            return r(this, void 0, void 0, function* () {
              this.app.post('/api/auth', (e, t) =>
                r(this, void 0, void 0, function* () {
                  try {
                    const s = o.default
                        .object()
                        .keys({
                          email: o.default.string().email().required(),
                          password: o.default.string().required(),
                        }),
                      r = u.default.validateSchema(s, e.body)
                    if (r) return t.status(400).json({ error: r })
                    const { email: n, password: d } = e.body,
                      f = yield a.default.user.findFirst({
                        where: { email: n },
                        select: { password: !0, email: !0, id: !0, role: !0 },
                      })
                    if (!f) return t.sendStatus(401)
                    if (!(yield i.default.comparePassword(d, f.password))) return t.sendStatus(401)
                    {
                      const e = c.default.sign(
                        { email: f.email, role: f.role },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '12h' },
                      )
                      console.log(
                        '🚀 ~ file: index.ts ~ line 54 ~ Authentication ~ this.app.post ~ process.env.ACCESS_TOKEN_SECRET',
                        process.env.ACCESS_TOKEN_SECRET,
                      )
                      const s = c.default.sign(
                        { email: f.email, role: f.role },
                        process.env.REFRESH_TOKEN_SECRET,
                        { expiresIn: '30d' },
                      )
                      console.log(
                        '🚀 ~ file: index.ts ~ line 60 ~ Authentication ~ this.app.post ~ process.env.REFRESH_TOKEN_SECRET',
                        process.env.REFRESH_TOKEN_SECRET,
                      ),
                        yield a.default.userRefreshTokens.upsert({
                          where: { userId: f.id },
                          update: { token: s },
                          create: { userId: f.id, token: s },
                        }),
                        t.cookie('jwt', s, { httpOnly: !0, maxAge: 2592e6, secure: l.default }),
                        t.status(200).json({ userLoggedIn: !0, accessToken: e })
                    }
                  } catch (e) {
                    console.log(
                      '🚀 ~ file: index.ts ~ line 78 ~ Authentication ~ this.app.post ~ error',
                      e,
                    ),
                      t.sendStatus(500)
                  }
                }),
              )
            })
          }
          refreshToken() {
            return r(this, void 0, void 0, function* () {
              this.app.get('/api/auth', (e, t) =>
                r(this, void 0, void 0, function* () {
                  try {
                    const s = o.default.object().keys({ jwt: o.default.required() })
                    if (u.default.validateSchema(s, e.cookies)) return t.sendStatus(401)
                    const { jwt: r } = e.cookies,
                      n = yield a.default.user.findFirst({
                        where: { UserRefreshTokens: { some: { token: r } } },
                      })
                    if (!n) return t.sendStatus(403)
                    c.default.verify(r, process.env.REFRESH_TOKEN_SECRET, (e, s) => {
                      if (e || n.email !== s.email) return t.sendStatus(403)
                      const r = c.default.sign(
                        { email: n.email },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '12h' },
                      )
                      t.json({ accessToken: r })
                    })
                  } catch (e) {
                    console.log(
                      '🚀 ~ file: index.ts ~ line 112 ~ Authentication ~ this.app.get ~ error',
                      e,
                    ),
                      t.sendStatus(500)
                  }
                }),
              )
            })
          }
          logout() {
            return r(this, void 0, void 0, function* () {
              this.app.delete('/api/auth', (e, t) =>
                r(this, void 0, void 0, function* () {
                  try {
                    const s = o.default.object().keys({ jwt: o.default.required() })
                    if (u.default.validateSchema(s, e.cookies)) return t.sendStatus(204)
                    const { jwt: r } = e.cookies,
                      n = yield a.default.user.findFirst({
                        where: { UserRefreshTokens: { some: { token: r } } },
                      })
                    return n
                      ? (yield a.default.userRefreshTokens.delete({ where: { userId: n.id } }),
                        t.clearCookie('jwt', { httpOnly: !0, secure: l.default }),
                        t.sendStatus(204))
                      : (t.clearCookie('jwt', { httpOnly: !0, secure: l.default }),
                        t.sendStatus(204))
                  } catch (e) {
                    console.log(
                      '🚀 ~ file: index.ts ~ line 150 ~ Authentication ~ this.app.delete ~ error',
                      e,
                    ),
                      t.sendStatus(500)
                  }
                }),
              )
            })
          }
        }
      },
      717: function (e, t, s) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = r(s(860)),
          i = r(s(710)),
          o = r(s(582)),
          a = r(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.Logger(),
              this.app.use(n.default.json()),
              this.app.use((0, i.default)()),
              this.app.use(n.default.urlencoded({ extended: !1 }))
          }
          CORS() {
            this.app.use(
              (0, o.default)({
                origin: [
                  'http://localhost:3000',
                  'http://192.168.0.56:3000/',
                  'https://genesisproject-six.vercel.app',
                ],
              }),
            )
          }
          Logger() {
            this.app.use((e, t, s) => {
              console.log(`${e.method} ${e.url} --- Origin: ${e.headers.origin}`), s()
            })
          }
          static JWT(e) {
            e.use((e, t, s) => {
              const r = e.headers.authorization
              if (!r) return t.sendStatus(401)
              const n = r
              a.default.verify(n, process.env.ACCESS_TOKEN_SECRET, (e, r) => {
                if (e) return t.sendStatus(403)
                s()
              })
            })
          }
        }
      },
      226: function (e, t, s) {
        var r =
            (this && this.__awaiter) ||
            function (e, t, s, r) {
              return new (s || (s = Promise))(function (n, i) {
                function o(e) {
                  try {
                    u(r.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(r.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((r = r.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = n(s(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.get()
          }
          get() {
            this.app.get('/api/devotionals', (e, t) =>
              r(this, void 0, void 0, function* () {
                try {
                  const e = yield i.default.devotional.findMany()
                  t.status(200).json(e)
                } catch (e) {
                  console.log(
                    '🚀 ~ file: index.ts ~ line 18 ~ Devotionals ~ this.app.get ~ error',
                    e,
                  ),
                    t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      96: function (e, t, s) {
        var r =
            (this && this.__awaiter) ||
            function (e, t, s, r) {
              return new (s || (s = Promise))(function (n, i) {
                function o(e) {
                  try {
                    u(r.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(r.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((r = r.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = n(s(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.getGrowthGroups()
          }
          getGrowthGroups() {
            return r(this, void 0, void 0, function* () {
              this.app.get('/api/growthgroups', (e, t) =>
                r(this, void 0, void 0, function* () {
                  try {
                    const e = yield i.default.growthGroup.findMany()
                    t.status(200).json(e)
                  } catch (e) {
                    console.log(
                      '🚀 ~ file: index.ts ~ line 18 ~ GrowthGroups ~ this.app.get ~ error',
                      e,
                    ),
                      t.sendStatus(500).json(null)
                  }
                }),
              )
            })
          }
        }
      },
      575: function (e, t, s) {
        var r =
            (this && this.__awaiter) ||
            function (e, t, s, r) {
              return new (s || (s = Promise))(function (n, i) {
                function o(e) {
                  try {
                    u(r.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function a(e) {
                  try {
                    u(r.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((r = r.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = n(s(349)),
          o = n(s(506)),
          a = n(s(717)),
          u = n(s(221)),
          l = n(s(721))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.signUp(), a.default.JWT(this.app), this.get()
          }
          get() {
            return r(this, void 0, void 0, function* () {
              this.app.get('/api/users/:id', (e, t) =>
                r(this, void 0, void 0, function* () {
                  const { id: s } = e.params
                  try {
                    if (s) {
                      const e = yield u.default.user.findFirst({
                        where: { id: s },
                        select: { id: !0, email: !0, name: !0, createdAt: !0, birthdate: !0 },
                      })
                      e || t.status(404).json({ error: 'User not found' }),
                        e && t.status(200).json(e)
                    } else t.status(401).json({ error: 'Invalid or missing ID' })
                  } catch (e) {
                    console.log('🚀 ~ file: index.ts ~ line 40 ~ Users ~ this.app.get ~ error', e),
                      t.sendStatus(500)
                  }
                }),
              )
            })
          }
          signUp() {
            return r(this, void 0, void 0, function* () {
              this.app.post('/api/users', (e, t) =>
                r(this, void 0, void 0, function* () {
                  const s = o.default
                      .object()
                      .keys({
                        email: o.default.string().email().required(),
                        name: o.default.string().required(),
                        phone: o.default.string().required().min(8).max(14),
                        password: o.default.string().min(8),
                        birthdate: o.default.string().required(),
                      }),
                    r = l.default.validateSchema(s, e.body)
                  try {
                    if (r) t.status(400).json({ error: r })
                    else {
                      const { email: s, name: r, password: n, phone: o, birthdate: a } = e.body
                      yield u.default.user.create({
                        data: {
                          email: s,
                          name: r,
                          birthdate: new Date(a).toISOString(),
                          password: yield i.default.hashPassword(n),
                          phone: o,
                        },
                      }),
                        t.status(201).json({ message: 'User created' })
                    }
                  } catch (e) {
                    console.log('🚀 ~ file: index.ts ~ line 78 ~ Users ~ this.app.post ~ error', e),
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
      536: function (e, t, s) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = r(s(226)),
          i = r(s(96)),
          o = r(s(717)),
          a = r(s(575)),
          u = r(s(765))
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
      349: function (e, t, s) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, r) {
                  void 0 === r && (r = s)
                  var n = Object.getOwnPropertyDescriptor(t, s)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, r, n)
                }
              : function (e, t, s, r) {
                  void 0 === r && (r = s), (e[r] = t[s])
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
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && r(t, e, s)
              return n(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = i(s(802))
        t.default = class {
          static hashPassword(e) {
            return o.hash(e, 10)
          }
          static comparePassword(e, t) {
            return o.compare(e, t)
          }
        }
      },
      668: (e, t, s) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81), (t.default = !0)
      },
      721: function (e, t, s) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, r) {
                  void 0 === r && (r = s)
                  var n = Object.getOwnPropertyDescriptor(t, s)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, r, n)
                }
              : function (e, t, s, r) {
                  void 0 === r && (r = s), (e[r] = t[s])
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
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && r(t, e, s)
              return n(t, e), t
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = i(s(634)),
          u = o(s(506))
        t.default = class {
          static validateSchema(e, t) {
            const { error: s } = u.default.validate(t, e, { abortEarly: !1, convert: !1 })
            if (!s || !s.details) return
            const r = s.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return a.mergeAll(r)
          }
        }
      },
      920: function (e, t, s) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = r(s(536)),
          i = r(s(860))
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
  !(function s(r) {
    var n = t[r]
    if (void 0 !== n) return n.exports
    var i = (t[r] = { exports: {} })
    return e[r].call(i.exports, i, i.exports, s), i.exports
  })(920)
})()
