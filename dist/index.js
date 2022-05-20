;(() => {
  'use strict'
  var e = {
      221: (e, t, s) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = new (s(524).PrismaClient)()
        t.default = i
      },
      189: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (r, n) {
                function o(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          r =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = r(s(139))
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
              resetPassword: {
                config: (e, t) => ({
                  to: e,
                  from: 'suportegenesischurch@gmail.com',
                  subject: 'Alteração de senha',
                  templateId: 'd-03325789ee6f4014858e14ac7cde78e1',
                  dynamicTemplateData: t,
                }),
              },
            }),
              n.default.setApiKey(process.env.SENDGRID_API_KEY)
          }
          send(e) {
            return i(this, void 0, void 0, function* () {
              const t = e
              try {
                yield n.default.send(t), console.log('Sendgrid Service 200')
              } catch (e) {
                throw (console.error(e), new Error('Error in Sendgrid flow'))
              }
            })
          }
        }
      },
      765: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (r, n) {
                function o(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          r =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = r(s(349)),
          o = r(s(506)),
          a = r(s(221)),
          u = r(s(721)),
          d = r(s(189)),
          c = r(s(668)),
          l = r(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.activateNewUser(),
              this.resetPassword(),
              this.authenticate(),
              this.refreshToken(),
              this.logout()
          }
          authenticate() {
            return i(this, void 0, void 0, function* () {
              this.app.post('/api/auth', (e, t) =>
                i(this, void 0, void 0, function* () {
                  if (e.cookies.jwt)
                    l.default.verify(e.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (e) => {
                      e || t.sendStatus(204)
                    })
                  else
                    try {
                      const s = o.default
                          .object()
                          .keys({
                            email: o.default.string().email().required(),
                            password: o.default.string().required(),
                          }),
                        i = u.default.validateSchema(s, e.body)
                      if (i) return t.status(400).json({ error: i })
                      const { email: r, password: d } = e.body,
                        f = yield a.default.user.findFirst({
                          where: { email: r },
                          select: { password: !0, email: !0, id: !0, role: !0, active: !0 },
                        })
                      if (!f) return t.sendStatus(404)
                      if (!(yield n.default.comparePassword(d, f.password)) || !f.active)
                        return t.sendStatus(401)
                      {
                        const e = l.default.sign(
                            { email: f.email, role: f.role },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: '12h' },
                          ),
                          s = l.default.sign(
                            { email: f.email, role: f.role },
                            process.env.REFRESH_TOKEN_SECRET,
                            { expiresIn: '30d' },
                          )
                        yield a.default.userRefreshTokens.upsert({
                          where: { userId: f.id },
                          update: { token: s },
                          create: { userId: f.id, token: s },
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
            return i(this, void 0, void 0, function* () {
              this.app.get('/api/auth', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    const s = o.default.object().keys({ jwt: o.default.required() })
                    if (u.default.validateSchema(s, e.cookies)) return t.sendStatus(401)
                    const { jwt: r } = e.cookies
                    l.default.verify(r, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                      i(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                            t.sendStatus(403)
                          )
                        const r = yield a.default.user.findFirst({
                          where: { email: s.email },
                          select: { id: !0, email: !0, role: !0, UserRefreshTokens: !0 },
                        })
                        if (!r)
                          return (
                            t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                            t.sendStatus(403)
                          )
                        const { UserRefreshTokens: n, id: o } = r,
                          [{ token: u }] = n
                        l.default.verify(u, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          i(this, void 0, void 0, function* () {
                            if (e)
                              return (
                                yield a.default.userRefreshTokens.delete({ where: { userId: o } }),
                                t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                                t.sendStatus(403)
                              )
                            const s = l.default.sign(
                              { email: r.email, role: r.role },
                              process.env.ACCESS_TOKEN_SECRET,
                              { expiresIn: '12h' },
                            )
                            t.cookie('jwt', s, { httpOnly: !0, maxAge: 2592e6, secure: c.default }),
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
            return i(this, void 0, void 0, function* () {
              this.app.post('/api/auth/activate', (e, t) =>
                i(this, void 0, void 0, function* () {
                  if (!e.headers.authorization) return t.sendStatus(401)
                  try {
                    const { authorization: s } = e.headers
                    l.default.verify(s, process.env.ACTIVATION_TOKEN_SECRET, (e, s) =>
                      i(this, void 0, void 0, function* () {
                        if (e) return t.sendStatus(401)
                        yield a.default.user.update({ where: { id: s.id }, data: { active: !0 } })
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
          resetPassword() {
            return i(this, void 0, void 0, function* () {
              this.app.post('/api/auth/reset-password', (e, t) =>
                i(this, void 0, void 0, function* () {
                  e.headers.authorization
                  const s = o.default
                      .object()
                      .keys({ email: o.default.string().email().required() }),
                    i = u.default.validateSchema(s, e.body)
                  if (i) return t.status(400).json({ error: i })
                  try {
                    const { email: s } = e.body,
                      i = l.default.sign({ email: s }, process.env.PASSWORD_RESET_TOKEN_SECRET, {
                        expiresIn: '24h',
                      }),
                      r = new d.default()
                    yield r.send(
                      r.TEMPLATES.resetPassword.config(s, {
                        resetPasswordUrl: `${process.env.FRONTEND_URL}/reset-password/${i}`,
                      }),
                    ),
                      t.status(200).json({ message: 'Reset password email sent' })
                  } catch (e) {
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
          setNewPassword() {
            return i(this, void 0, void 0, function* () {
              this.app.put('/api/auth/reset-password', (e, t) =>
                i(this, void 0, void 0, function* () {
                  const s = e.headers.authorization,
                    r = o.default.object().keys({ email: o.default.string().email().required() }),
                    d = u.default.validateSchema(r, e.body)
                  if (d || !s) return t.sendStatus(400)
                  try {
                    const { email: r, password: o } = e.body
                    l.default.verify(s, process.env.PASSWORD_RESET_TOKEN_SECRET, (e, s) =>
                      i(this, void 0, void 0, function* () {
                        if (d || s.email !== r) return t.sendStatus(401)
                        yield a.default.user.update({
                          where: { email: r },
                          data: { password: yield n.default.hashPassword(o) },
                        })
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
            return i(this, void 0, void 0, function* () {
              this.app.delete('/api/auth', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    const s = o.default.object().keys({ jwt: o.default.required() })
                    if (u.default.validateSchema(s, e.cookies)) return t.sendStatus(204)
                    const { jwt: i } = e.cookies,
                      r = yield a.default.user.findFirst({
                        where: { UserRefreshTokens: { some: { token: i } } },
                      })
                    return r
                      ? (yield a.default.userRefreshTokens.delete({ where: { userId: r.id } }),
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
      717: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (r, n) {
                function o(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          r =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = r(s(860)),
          o = r(s(506)),
          a = r(s(721)),
          u = r(s(710)),
          d = r(s(582)),
          c = r(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.Logger(),
              this.app.use(n.default.json()),
              this.app.use((0, u.default)()),
              this.app.use(n.default.urlencoded({ extended: !1 }))
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
            this.app.use((e, t, s) => {
              console.log(`${e.method} ${e.url} --- Origin: ${e.headers.origin}`), s()
            })
          }
          static JWT(e) {
            e.use((e, t, s) =>
              i(this, void 0, void 0, function* () {
                try {
                  const i = o.default.object().keys({ jwt: o.default.required() })
                  if (a.default.validateSchema(i, e.cookies)) return t.sendStatus(401)
                  const { jwt: r } = e.cookies
                  c.default.verify(r, process.env.ACCESS_TOKEN_SECRET, (e, i) => {
                    if (e) return t.sendStatus(403)
                    s()
                  })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      226: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (r, n) {
                function o(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          r =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = r(s(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.get()
          }
          get() {
            this.app.get('/api/devotionals', (e, t) =>
              i(this, void 0, void 0, function* () {
                try {
                  const e = yield n.default.devotional.findMany()
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      157: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (r, n) {
                function o(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          r =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = r(s(221))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.getGrowthGroups()
          }
          getGrowthGroups() {
            return i(this, void 0, void 0, function* () {
              this.app.get('/api/growthgroups', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    const e = yield n.default.growthGroup.findMany()
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
      575: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (r, n) {
                function o(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(o, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          r =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = r(s(349)),
          o = r(s(506)),
          a = r(s(717)),
          u = r(s(221)),
          d = r(s(721)),
          c = r(s(189)),
          l = r(s(668)),
          f = r(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.signUp(), a.default.JWT(this.app), this.get()
          }
          get() {
            return i(this, void 0, void 0, function* () {
              this.app.get('/api/users/:id', (e, t) =>
                i(this, void 0, void 0, function* () {
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
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
          signUp() {
            return i(this, void 0, void 0, function* () {
              this.app.post('/api/users', (e, t) =>
                i(this, void 0, void 0, function* () {
                  const s = o.default
                      .object()
                      .keys({
                        email: o.default.string().email().required(),
                        name: o.default.string().required(),
                        phone: o.default.string().required().min(8).max(14),
                        password: o.default.string().min(8),
                        birthdate: o.default.string().required(),
                      }),
                    i = d.default.validateSchema(s, e.body)
                  try {
                    if (i) t.status(400).json({ error: i })
                    else {
                      const { email: s, name: i, password: r, phone: o, birthdate: a } = e.body,
                        d = yield u.default.user.create({
                          data: {
                            email: s,
                            name: i,
                            birthdate: new Date(a).toISOString(),
                            password: yield n.default.hashPassword(r),
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
                        h = f.default.sign({ id: d.id }, process.env.ACTIVATION_TOKEN_SECRET, {
                          expiresIn: '30d',
                        })
                      if (l.default) {
                        const e = new c.default()
                        yield e.send(
                          e.TEMPLATES.confirmationEmail.config(d.email, {
                            userFirstName: d.name.split(' ')[0],
                            activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${h}`,
                          }),
                        )
                      }
                      t.status(201).json({ message: 'User created', user: d })
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
      536: function (e, t, s) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = i(s(765)),
          n = i(s(226)),
          o = i(s(157)),
          a = i(s(717)),
          u = i(s(575))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new a.default(this.app),
              new r.default(this.app),
              new o.default(this.app),
              new n.default(this.app),
              new u.default(this.app)
          }
        }
      },
      349: function (e, t, s) {
        var i =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, i) {
                  void 0 === i && (i = s)
                  var r = Object.getOwnPropertyDescriptor(t, s)
                  ;(r && !('get' in r ? !t.__esModule : r.writable || r.configurable)) ||
                    (r = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, i, r)
                }
              : function (e, t, s, i) {
                  void 0 === i && (i = s), (e[i] = t[s])
                }),
          r =
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
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && i(t, e, s)
              return r(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const o = n(s(96))
        t.default = class {
          static hashPassword(e) {
            return o.hash(e, process.env.BCRYPTSALT)
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
        var i =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, i) {
                  void 0 === i && (i = s)
                  var r = Object.getOwnPropertyDescriptor(t, s)
                  ;(r && !('get' in r ? !t.__esModule : r.writable || r.configurable)) ||
                    (r = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, i, r)
                }
              : function (e, t, s, i) {
                  void 0 === i && (i = s), (e[i] = t[s])
                }),
          r =
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
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && i(t, e, s)
              return r(t, e), t
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = n(s(634)),
          u = o(s(506))
        t.default = class {
          static validateSchema(e, t) {
            const { error: s } = u.default.validate(t, e, { abortEarly: !1, convert: !1 })
            if (!s || !s.details) return
            const i = s.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return a.mergeAll(i)
          }
        }
      },
      920: function (e, t, s) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = i(s(536)),
          n = i(s(860))
        new (class {
          constructor(e = (0, n.default)()) {
            ;(this.app = e), this.app.listen(process.env.PORT || 5e3, () => new r.default(e))
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
  !(function s(i) {
    var r = t[i]
    if (void 0 !== r) return r.exports
    var n = (t[i] = { exports: {} })
    return e[i].call(n.exports, n, n.exports, s), n.exports
  })(920)
})()
