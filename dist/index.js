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
              return new (r || (r = Promise))(function (i, n) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? i(e.value)
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
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), r(81)
        const n = i(r(349)),
          o = i(r(506)),
          a = i(r(221)),
          u = i(r(721)),
          l = i(r(668)),
          d = i(r(344))
        t.default = class {
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
                    const { email: i, password: c } = e.body,
                      f = yield a.default.user.findFirst({
                        where: { email: i },
                        select: { password: !0, email: !0, id: !0, role: !0 },
                      })
                    if (!f) return t.sendStatus(401)
                    if (!(yield n.default.comparePassword(c, f.password))) return t.sendStatus(401)
                    {
                      const e = d.default.sign(
                          { email: f.email, role: f.role },
                          process.env.ACCESS_TOKEN_SECRET,
                          { expiresIn: '12h' },
                        ),
                        r = d.default.sign(
                          { email: f.email, role: f.role },
                          process.env.REFRESH_TOKEN_SECRET,
                          { expiresIn: '30d' },
                        )
                      yield a.default.userRefreshTokens.upsert({
                        where: { userId: f.id },
                        update: { token: r },
                        create: { userId: f.id, token: r },
                      }),
                        t.cookie('jwt', r, { httpOnly: !0, maxAge: 2592e6, secure: l.default }),
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
            return s(this, void 0, void 0, function* () {
              this.app.get('/api/auth', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const r = o.default.object().keys({ jwt: o.default.required() })
                    if (u.default.validateSchema(r, e.cookies)) return t.sendStatus(401)
                    const { jwt: s } = e.cookies,
                      i = yield a.default.user.findFirst({
                        where: { UserRefreshTokens: { some: { token: s } } },
                      })
                    if (!i) return t.sendStatus(403)
                    d.default.verify(s, process.env.REFRESH_TOKEN_SECRET, (e, r) => {
                      if (e || i.email !== r.email) return t.sendStatus(403)
                      const s = d.default.sign(
                        { email: i.email },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '12h' },
                      )
                      t.json({ accessToken: s })
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
            return s(this, void 0, void 0, function* () {
              this.app.delete('/api/auth', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const r = o.default.object().keys({ jwt: o.default.required() })
                    if (u.default.validateSchema(r, e.cookies)) return t.sendStatus(204)
                    const { jwt: s } = e.cookies,
                      i = yield a.default.user.findFirst({
                        where: { UserRefreshTokens: { some: { token: s } } },
                      })
                    return i
                      ? (yield a.default.userRefreshTokens.delete({ where: { userId: i.id } }),
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
      717: function (e, t, r) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), r(81)
        const i = s(r(860)),
          n = s(r(710)),
          o = s(r(582)),
          a = s(r(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.Logger(),
              this.app.use(i.default.json()),
              this.app.use((0, n.default)()),
              this.app.use(i.default.urlencoded({ extended: !1 }))
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
            this.app.use((e, t, r) => {
              console.log(`${e.method} ${e.url} --- Origin: ${e.headers.origin}`), r()
            })
          }
          static JWT(e) {
            e.use((e, t, r) => {
              const s = e.headers.authorization
              if (!s) return t.sendStatus(401)
              const i = s
              a.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, s) => {
                if (e) return t.sendStatus(403)
                r()
              })
            })
          }
        }
      },
      226: function (e, t, r) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, r, s) {
              return new (r || (r = Promise))(function (i, n) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? i(e.value)
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
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(r(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.get()
          }
          get() {
            this.app.get('/api/devotionals', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const e = yield n.default.devotional.findMany()
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
      96: function (e, t, r) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, r, s) {
              return new (r || (r = Promise))(function (i, n) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? i(e.value)
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
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(r(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.getGrowthGroups()
          }
          getGrowthGroups() {
            return s(this, void 0, void 0, function* () {
              this.app.get('/api/growthgroups', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const e = yield n.default.growthGroup.findMany()
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
      575: function (e, t, r) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, r, s) {
              return new (r || (r = Promise))(function (i, n) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? i(e.value)
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
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(r(349)),
          o = i(r(506)),
          a = i(r(717)),
          u = i(r(221)),
          l = i(r(721))
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
                    console.log('🚀 ~ file: index.ts ~ line 40 ~ Users ~ this.app.get ~ error', e),
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
                    s = l.default.validateSchema(r, e.body)
                  try {
                    if (s) t.status(400).json({ error: s })
                    else {
                      const { email: r, name: s, password: i, phone: o, birthdate: a } = e.body
                      yield u.default.user.create({
                        data: {
                          email: r,
                          name: s,
                          birthdate: new Date(a).toISOString(),
                          password: yield n.default.hashPassword(i),
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
      536: function (e, t, r) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = s(r(226)),
          n = s(r(96)),
          o = s(r(717)),
          a = s(r(575)),
          u = s(r(765))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new o.default(this.app),
              new u.default(this.app),
              new n.default(this.app),
              new i.default(this.app),
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
                  var i = Object.getOwnPropertyDescriptor(t, r)
                  ;(i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      },
                    }),
                    Object.defineProperty(e, s, i)
                }
              : function (e, t, r, s) {
                  void 0 === s && (s = r), (e[s] = t[r])
                }),
          i =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t })
                }
              : function (e, t) {
                  e.default = t
                }),
          n =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var r in e)
                  'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && s(t, e, r)
              return i(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(r(802))
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
                  var i = Object.getOwnPropertyDescriptor(t, r)
                  ;(i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      },
                    }),
                    Object.defineProperty(e, s, i)
                }
              : function (e, t, r, s) {
                  void 0 === s && (s = r), (e[s] = t[r])
                }),
          i =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t })
                }
              : function (e, t) {
                  e.default = t
                }),
          n =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var r in e)
                  'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && s(t, e, r)
              return i(t, e), t
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = n(r(634)),
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
        const i = s(r(536)),
          n = s(r(860))
        new (class {
          constructor(e = (0, n.default)()) {
            ;(this.app = e), this.app.listen(process.env.PORT || 5e3, () => new i.default(e))
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
  !(function r(s) {
    var i = t[s]
    if (void 0 !== i) return i.exports
    var n = (t[s] = { exports: {} })
    return e[s].call(n.exports, n, n.exports, r), n.exports
  })(920)
})()
