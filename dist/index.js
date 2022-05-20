;(() => {
  'use strict'
  var e = {
      221: (e, t, i) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = new (i(524).PrismaClient)()
        t.default = s
      },
      189: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, r) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
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
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const r = n(i(139))
        t.default = class {
          constructor() {
            ;(this.TEMPLATES = {
              confirmationEmail: {
                config: (e, t) => ({
                  to: e,
                  from: 'suportegenesischurch@gmail.com',
                  subject: 'Seja bem vindo à Genesis Church',
                  templateId: 'd-20dab053877c41cdb7feeda798233024',
                  dynamicTemplateData: t,
                }),
              },
            }),
              r.default.setApiKey(process.env.SENDGRID_API_KEY)
          }
          send(e) {
            return s(this, void 0, void 0, function* () {
              const t = e
              try {
                yield r.default.send(t), console.log('[SendgridClient]: Email sent successfully', t)
              } catch (e) {
                console.error(e)
              }
            })
          }
        }
      },
      765: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, r) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
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
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const r = n(i(349)),
          o = n(i(506)),
          a = n(i(221)),
          u = n(i(721)),
          c = n(i(668)),
          d = n(i(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.authenticate(),
              this.activateNewUser(),
              this.refreshToken(),
              this.logout()
          }
          authenticate() {
            return s(this, void 0, void 0, function* () {
              this.app.post('/api/auth', (e, t) =>
                s(this, void 0, void 0, function* () {
                  if (e.cookies.jwt)
                    d.default.verify(e.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (e) => {
                      e || t.sendStatus(204)
                    })
                  else
                    try {
                      const i = o.default
                          .object()
                          .keys({
                            email: o.default.string().email().required(),
                            password: o.default.string().required(),
                          }),
                        s = u.default.validateSchema(i, e.body)
                      if (s) return t.status(400).json({ error: s })
                      const { email: n, password: l } = e.body,
                        f = yield a.default.user.findFirst({
                          where: { email: n },
                          select: { password: !0, email: !0, id: !0, role: !0, active: !0 },
                        })
                      if (!f) return t.sendStatus(404)
                      if (!(yield r.default.comparePassword(l, f.password)) || !f.active)
                        return t.sendStatus(401)
                      {
                        const e = d.default.sign(
                            { email: f.email, role: f.role },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: '12h' },
                          ),
                          i = d.default.sign(
                            { email: f.email, role: f.role },
                            process.env.REFRESH_TOKEN_SECRET,
                            { expiresIn: '30d' },
                          )
                        yield a.default.userRefreshTokens.upsert({
                          where: { userId: f.id },
                          update: { token: i },
                          create: { userId: f.id, token: i },
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
                    const i = o.default.object().keys({ jwt: o.default.required() })
                    if (u.default.validateSchema(i, e.cookies)) return t.sendStatus(401)
                    const { jwt: n } = e.cookies
                    d.default.verify(n, process.env.ACCESS_TOKEN_SECRET, (e, i) =>
                      s(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                            t.sendStatus(403)
                          )
                        const n = yield a.default.user.findFirst({
                          where: { email: i.email },
                          select: { id: !0, email: !0, role: !0, UserRefreshTokens: !0 },
                        })
                        if (!n)
                          return (
                            t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                            t.sendStatus(403)
                          )
                        const { UserRefreshTokens: r, id: o } = n,
                          [{ token: u }] = r
                        d.default.verify(u, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          s(this, void 0, void 0, function* () {
                            if (e)
                              return (
                                yield a.default.userRefreshTokens.delete({ where: { userId: o } }),
                                t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                                t.sendStatus(403)
                              )
                            const i = d.default.sign(
                              { email: n.email, role: n.role },
                              process.env.ACCESS_TOKEN_SECRET,
                              { expiresIn: '12h' },
                            )
                            t.cookie('jwt', i, { httpOnly: !0, maxAge: 2592e6, secure: c.default }),
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
          activateNewUser() {
            return s(this, void 0, void 0, function* () {
              this.app.post('/api/auth/activate', (e, t) =>
                s(this, void 0, void 0, function* () {
                  const i = o.default.object().keys({ authorization: o.default.required() })
                  if (u.default.validateSchema(i, e.headers)) return t.sendStatus(401)
                  try {
                    const { authorization: i } = e.headers
                    d.default.verify(i, process.env.ACTIVATION_TOKEN_SECRET, (e, i) =>
                      s(this, void 0, void 0, function* () {
                        if (e) return t.sendStatus(401)
                        yield a.default.user.update({ where: { id: i.id }, data: { active: !0 } })
                      }),
                    ),
                      t.sendStatus(204)
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
                    const i = o.default.object().keys({ jwt: o.default.required() })
                    if (u.default.validateSchema(i, e.cookies)) return t.sendStatus(204)
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
        }
      },
      717: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, r) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
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
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const r = n(i(860)),
          o = n(i(506)),
          a = n(i(721)),
          u = n(i(710)),
          c = n(i(582)),
          d = n(i(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.Logger(),
              this.app.use(r.default.json()),
              this.app.use((0, u.default)()),
              this.app.use(r.default.urlencoded({ extended: !1 }))
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
            this.app.use((e, t, i) => {
              console.log(`${e.method} ${e.url} --- Origin: ${e.headers.origin}`), i()
            })
          }
          static JWT(e) {
            e.use((e, t, i) =>
              s(this, void 0, void 0, function* () {
                try {
                  const s = o.default.object().keys({ jwt: o.default.required() })
                  if (a.default.validateSchema(s, e.cookies)) return t.sendStatus(401)
                  const { jwt: n } = e.cookies
                  d.default.verify(n, process.env.ACCESS_TOKEN_SECRET, (e, s) => {
                    if (e) return t.sendStatus(403)
                    i()
                  })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      226: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, r) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
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
        const r = n(i(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.get()
          }
          get() {
            this.app.get('/api/devotionals', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const e = yield r.default.devotional.findMany()
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      157: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, r) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
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
        const r = n(i(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.getGrowthGroups()
          }
          getGrowthGroups() {
            return s(this, void 0, void 0, function* () {
              this.app.get('/api/growthgroups', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const e = yield r.default.growthGroup.findMany()
                    t.status(200).json(e)
                  } catch (e) {
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
        }
      },
      575: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, r) {
                function o(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function a(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
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
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const r = n(i(349)),
          o = n(i(506)),
          a = n(i(717)),
          u = n(i(221)),
          c = n(i(721)),
          d = n(i(189)),
          l = n(i(668)),
          f = n(i(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.signUp(), a.default.JWT(this.app), this.get()
          }
          get() {
            return s(this, void 0, void 0, function* () {
              this.app.get('/api/users/:id', (e, t) =>
                s(this, void 0, void 0, function* () {
                  const { id: i } = e.params
                  try {
                    if (i) {
                      const e = yield u.default.user.findFirst({
                        where: { id: i },
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
                  const i = o.default
                      .object()
                      .keys({
                        email: o.default.string().email().required(),
                        name: o.default.string().required(),
                        phone: o.default.string().required().min(8).max(14),
                        password: o.default.string().min(8),
                        birthdate: o.default.string().required(),
                      }),
                    s = c.default.validateSchema(i, e.body)
                  try {
                    if (s) t.status(400).json({ error: s })
                    else {
                      const { email: i, name: s, password: n, phone: o, birthdate: a } = e.body,
                        c = yield u.default.user.create({
                          data: {
                            email: i,
                            name: s,
                            birthdate: new Date(a).toISOString(),
                            password: yield r.default.hashPassword(n),
                            phone: o,
                          },
                          select: {
                            id: !0,
                            email: !0,
                            name: !0,
                            createdAt: !0,
                            phone: !0,
                            password: !1,
                          },
                        }),
                        h = f.default.sign({ id: c.id }, process.env.ACTIVATION_TOKEN_SECRET, {
                          expiresIn: '30d',
                        })
                      if (l.default) {
                        const e = new d.default()
                        yield e.send(
                          e.TEMPLATES.confirmationEmail.config(c.email, {
                            userFirstName: c.name.split(' ')[0],
                            activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${h}`,
                          }),
                        )
                      }
                      t.status(201).json({ message: 'User created', user: c })
                    }
                  } catch (e) {
                    console.log(
                      '🚀 ~ file: index.ts ~ line 101 ~ Users ~ this.app.post ~ error',
                      e,
                    ),
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
      536: function (e, t, i) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = s(i(765)),
          r = s(i(226)),
          o = s(i(157)),
          a = s(i(717)),
          u = s(i(575))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new a.default(this.app),
              new n.default(this.app),
              new o.default(this.app),
              new r.default(this.app),
              new u.default(this.app)
          }
        }
      },
      349: function (e, t, i) {
        var s =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, s) {
                  void 0 === s && (s = i)
                  var n = Object.getOwnPropertyDescriptor(t, i)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, s, n)
                }
              : function (e, t, i, s) {
                  void 0 === s && (s = i), (e[s] = t[i])
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
          r =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && s(t, e, i)
              return n(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const o = r(i(96))
        t.default = class {
          static hashPassword(e) {
            return o.hash(e, process.env.BCRYPTSALT)
          }
          static comparePassword(e, t) {
            return o.compare(e, t)
          }
        }
      },
      668: (e, t, i) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81), (t.default = !0)
      },
      721: function (e, t, i) {
        var s =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, s) {
                  void 0 === s && (s = i)
                  var n = Object.getOwnPropertyDescriptor(t, i)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, s, n)
                }
              : function (e, t, i, s) {
                  void 0 === s && (s = i), (e[s] = t[i])
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
          r =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && s(t, e, i)
              return n(t, e), t
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = r(i(634)),
          u = o(i(506))
        t.default = class {
          static validateSchema(e, t) {
            const { error: i } = u.default.validate(t, e, { abortEarly: !1, convert: !1 })
            if (!i || !i.details) return
            const s = i.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return a.mergeAll(s)
          }
        }
      },
      920: function (e, t, i) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = s(i(536)),
          r = s(i(860))
        new (class {
          constructor(e = (0, r.default)()) {
            ;(this.app = e), this.app.listen(process.env.PORT || 5e3, () => new n.default(e))
          }
        })()
      },
      524: (e) => {
        e.exports = require('@prisma/client')
      },
      139: (e) => {
        e.exports = require('@sendgrid/mail')
      },
      96: (e) => {
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
  !(function i(s) {
    var n = t[s]
    if (void 0 !== n) return n.exports
    var r = (t[s] = { exports: {} })
    return e[s].call(r.exports, r, r.exports, i), r.exports
  })(920)
})()
