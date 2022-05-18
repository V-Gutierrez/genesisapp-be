;(() => {
  'use strict'
  var e = {
      221: (e, t, s) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = new (s(524).PrismaClient)()
        t.default = n
      },
      765: function (e, t, s) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, s, n) {
              return new (s || (s = Promise))(function (i, r) {
                function o(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? i(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = i(s(349)),
          o = i(s(506)),
          a = i(s(221)),
          u = i(s(721)),
          l = i(s(142)),
          c = i(s(668)),
          d = i(s(344))
        l.default.config(),
          (t.default = class {
            constructor(e) {
              ;(this.app = e), this.authenticate(), this.refreshToken(), this.logout()
            }
            authenticate() {
              return n(this, void 0, void 0, function* () {
                this.app.post('/api/auth', (e, t) =>
                  n(this, void 0, void 0, function* () {
                    try {
                      const s = o.default
                          .object()
                          .keys({
                            email: o.default.string().email().required(),
                            password: o.default.string().required(),
                          }),
                        n = u.default.validateSchema(s, e.body)
                      if (n) return t.status(400).json({ error: n })
                      const { email: i, password: f } = e.body,
                        p = yield a.default.user.findFirst({
                          where: { email: i },
                          select: { password: !0, email: !0, id: !0, role: !0 },
                        })
                      if (!p) return t.sendStatus(401)
                      if (!(yield r.default.comparePassword(f, p.password)))
                        return t.sendStatus(401)
                      {
                        const e = d.default.sign(
                          { email: p.email, role: p.role },
                          process.env.ACCESS_TOKEN_SECRET,
                          { expiresIn: '12h' },
                        )
                        console.log(
                          '🚀 ~ file: index.ts ~ line 54 ~ Authentication ~ this.app.post ~ process.env.ACCESS_TOKEN_SECRET',
                          process.env.ACCESS_TOKEN_SECRET,
                        ),
                          console.log(
                            '🚀 ~ file: index.ts ~ line 60 ~ Authentication ~ this.app.post ~ process.env.REFRESH_TOKEN_SECRET',
                            process.env.REFRESH_TOKEN_SECRET,
                          ),
                          l.default.config(),
                          console.log(
                            '🚀 ~ file: index.ts ~ line 60 ~ Authentication ~ this.app.post ~ process.env.REFRESH_TOKEN_SECRET',
                            process.env.REFRESH_TOKEN_SECRET,
                          ),
                          l.default.config()
                        const s = d.default.sign(
                          { email: p.email, role: p.role },
                          process.env.REFRESH_TOKEN_SECRET,
                          { expiresIn: '30d' },
                        )
                        yield a.default.userRefreshTokens.upsert({
                          where: { userId: p.id },
                          update: { token: s },
                          create: { userId: p.id, token: s },
                        }),
                          t.cookie('jwt', s, { httpOnly: !0, maxAge: 2592e6, secure: c.default }),
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
              return n(this, void 0, void 0, function* () {
                this.app.get('/api/auth', (e, t) =>
                  n(this, void 0, void 0, function* () {
                    try {
                      const s = o.default.object().keys({ jwt: o.default.required() })
                      if (u.default.validateSchema(s, e.cookies)) return t.sendStatus(401)
                      const { jwt: n } = e.cookies,
                        i = yield a.default.user.findFirst({
                          where: { UserRefreshTokens: { some: { token: n } } },
                        })
                      if (!i) return t.sendStatus(403)
                      d.default.verify(n, process.env.REFRESH_TOKEN_SECRET, (e, s) => {
                        if (e || i.email !== s.email) return t.sendStatus(403)
                        const n = d.default.sign(
                          { email: i.email },
                          process.env.ACCESS_TOKEN_SECRET,
                          { expiresIn: '12h' },
                        )
                        t.json({ accessToken: n })
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
              return n(this, void 0, void 0, function* () {
                this.app.delete('/api/auth', (e, t) =>
                  n(this, void 0, void 0, function* () {
                    try {
                      const s = o.default.object().keys({ jwt: o.default.required() })
                      if (u.default.validateSchema(s, e.cookies)) return t.sendStatus(204)
                      const { jwt: n } = e.cookies,
                        i = yield a.default.user.findFirst({
                          where: { UserRefreshTokens: { some: { token: n } } },
                        })
                      return i
                        ? (yield a.default.userRefreshTokens.delete({ where: { userId: i.id } }),
                          t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                          t.sendStatus(204))
                        : (t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
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
          })
      },
      717: function (e, t, s) {
        var n =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const i = n(s(860)),
          r = n(s(710)),
          o = n(s(582)),
          a = n(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.Logger(),
              this.app.use(i.default.json()),
              this.app.use((0, r.default)()),
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
            this.app.use((e, t, s) => {
              console.log(`${e.method} ${e.url} --- Origin: ${e.headers.origin}`), s()
            })
          }
          static JWT(e) {
            e.use((e, t, s) => {
              const n = e.headers.authorization
              if (!n) return t.sendStatus(401)
              const i = n
              a.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, n) => {
                if (e) return t.sendStatus(403)
                s()
              })
            })
          }
        }
      },
      226: function (e, t, s) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, s, n) {
              return new (s || (s = Promise))(function (i, r) {
                function o(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? i(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = i(s(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.get()
          }
          get() {
            this.app.get('/api/devotionals', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const e = yield r.default.devotional.findMany()
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, s, n) {
              return new (s || (s = Promise))(function (i, r) {
                function o(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? i(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = i(s(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.getGrowthGroups()
          }
          getGrowthGroups() {
            return n(this, void 0, void 0, function* () {
              this.app.get('/api/growthgroups', (e, t) =>
                n(this, void 0, void 0, function* () {
                  try {
                    const e = yield r.default.growthGroup.findMany()
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, s, n) {
              return new (s || (s = Promise))(function (i, r) {
                function o(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? i(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = i(s(349)),
          o = i(s(506)),
          a = i(s(717)),
          u = i(s(221)),
          l = i(s(721))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.signUp(), a.default.JWT(this.app), this.get()
          }
          get() {
            return n(this, void 0, void 0, function* () {
              this.app.get('/api/users/:id', (e, t) =>
                n(this, void 0, void 0, function* () {
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
            return n(this, void 0, void 0, function* () {
              this.app.post('/api/users', (e, t) =>
                n(this, void 0, void 0, function* () {
                  const s = o.default
                      .object()
                      .keys({
                        email: o.default.string().email().required(),
                        name: o.default.string().required(),
                        phone: o.default.string().required().min(8).max(14),
                        password: o.default.string().min(8),
                        birthdate: o.default.string().required(),
                      }),
                    n = l.default.validateSchema(s, e.body)
                  try {
                    if (n) t.status(400).json({ error: n })
                    else {
                      const { email: s, name: n, password: i, phone: o, birthdate: a } = e.body
                      yield u.default.user.create({
                        data: {
                          email: s,
                          name: n,
                          birthdate: new Date(a).toISOString(),
                          password: yield r.default.hashPassword(i),
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
        var n =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = n(s(226)),
          r = n(s(96)),
          o = n(s(717)),
          a = n(s(575)),
          u = n(s(765))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new o.default(this.app),
              new u.default(this.app),
              new r.default(this.app),
              new i.default(this.app),
              new a.default(this.app)
          }
        }
      },
      349: function (e, t, s) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, n) {
                  void 0 === n && (n = s)
                  var i = Object.getOwnPropertyDescriptor(t, s)
                  ;(i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, n, i)
                }
              : function (e, t, s, n) {
                  void 0 === n && (n = s), (e[n] = t[s])
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
          r =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && n(t, e, s)
              return i(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = r(s(802))
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
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, n) {
                  void 0 === n && (n = s)
                  var i = Object.getOwnPropertyDescriptor(t, s)
                  ;(i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, n, i)
                }
              : function (e, t, s, n) {
                  void 0 === n && (n = s), (e[n] = t[s])
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
          r =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && n(t, e, s)
              return i(t, e), t
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = r(s(634)),
          u = o(s(506))
        t.default = class {
          static validateSchema(e, t) {
            const { error: s } = u.default.validate(t, e, { abortEarly: !1, convert: !1 })
            if (!s || !s.details) return
            const n = s.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return a.mergeAll(n)
          }
        }
      },
      920: function (e, t, s) {
        var n =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = n(s(536)),
          r = n(s(860))
        new (class {
          constructor(e = (0, r.default)()) {
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
  !(function s(n) {
    var i = t[n]
    if (void 0 !== i) return i.exports
    var r = (t[n] = { exports: {} })
    return e[n].call(r.exports, r, r.exports, s), r.exports
  })(920)
})()
