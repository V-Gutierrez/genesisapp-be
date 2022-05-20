;(() => {
  'use strict'
  var e = {
      988: (e, t, s) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = new (s(524).PrismaClient)()
        t.default = r
      },
      790: function (e, t, s) {
        var r =
            (this && this.__awaiter) ||
            function (e, t, s, r) {
              return new (s || (s = Promise))(function (i, n) {
                function o(e) {
                  try {
                    u(r.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(r.throw(e))
                  } catch (e) {
                    n(e)
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
                u((r = r.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = i(s(139))
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
            return r(this, void 0, void 0, function* () {
              const t = e
              try {
                yield n.default.send(t), console.log('Sendgrid Service - 200')
              } catch (e) {
                throw new Error('Error in Sendgrid flow')
              }
            })
          }
        }
      },
      835: function (e, t, s) {
        var r =
            (this && this.__awaiter) ||
            function (e, t, s, r) {
              return new (s || (s = Promise))(function (i, n) {
                function o(e) {
                  try {
                    u(r.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(r.throw(e))
                  } catch (e) {
                    n(e)
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
                u((r = r.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = i(s(632)),
          o = i(s(506)),
          a = i(s(988)),
          u = i(s(448)),
          d = i(s(790)),
          c = i(s(766)),
          l = i(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.activateNewUser(),
              this.resetPassword(),
              this.authenticate(),
              this.refreshToken(),
              this.logout(),
              this.setNewPassword(),
              this.getUserInformation()
          }
          authenticate() {
            return r(this, void 0, void 0, function* () {
              this.app.post('/api/auth', (e, t) =>
                r(this, void 0, void 0, function* () {
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
                        r = u.default.validateSchema(s, e.body)
                      if (r) return t.status(400).json({ error: r })
                      const { email: i, password: d } = e.body,
                        f = yield a.default.user.findFirst({
                          where: { email: i },
                          select: { password: !0, email: !0, id: !0, role: !0, active: !0 },
                        })
                      if (!f) return t.sendStatus(404)
                      if (!f.active) return t.status(403).json({ error: 'User is not activated' })
                      if (!(yield n.default.comparePassword(d, f.password)))
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
            return r(this, void 0, void 0, function* () {
              this.app.get('/api/auth', (e, t) =>
                r(this, void 0, void 0, function* () {
                  try {
                    const s = o.default.object().keys({ jwt: o.default.required() })
                    if (u.default.validateSchema(s, e.cookies)) return t.sendStatus(401)
                    const { jwt: i } = e.cookies
                    l.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                      r(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                            t.sendStatus(403)
                          )
                        const i = yield a.default.user.findFirst({
                          where: { email: s.email },
                          select: { id: !0, email: !0, role: !0, UserRefreshTokens: !0 },
                        })
                        if (!i)
                          return (
                            t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                            t.sendStatus(403)
                          )
                        const { UserRefreshTokens: n, id: o } = i,
                          [{ token: u }] = n
                        l.default.verify(u, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          r(this, void 0, void 0, function* () {
                            if (e)
                              return (
                                yield a.default.userRefreshTokens.delete({ where: { userId: o } }),
                                t.clearCookie('jwt', { httpOnly: !0, secure: c.default }),
                                t.sendStatus(403)
                              )
                            const s = l.default.sign(
                              { email: i.email, role: i.role },
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
            return r(this, void 0, void 0, function* () {
              this.app.post('/api/auth/activate', (e, t) =>
                r(this, void 0, void 0, function* () {
                  if (!e.headers.authorization) return t.sendStatus(401)
                  try {
                    const { authorization: s } = e.headers
                    l.default.verify(s, process.env.ACTIVATION_TOKEN_SECRET, (e, s) =>
                      r(this, void 0, void 0, function* () {
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
            return r(this, void 0, void 0, function* () {
              this.app.post('/api/auth/reset-password', (e, t) =>
                r(this, void 0, void 0, function* () {
                  const s = o.default
                      .object()
                      .keys({ email: o.default.string().email().required() }),
                    r = u.default.validateSchema(s, e.body)
                  if (r) return t.status(400).json({ error: r })
                  try {
                    const { email: s } = e.body,
                      r = yield a.default.user.findFirst({
                        where: { email: s },
                        select: { email: !0, active: !0 },
                      })
                    if (!r || !r.active)
                      return t.status(200).json({ message: 'Reset password email sent' })
                    const i = l.default.sign(
                      { email: s },
                      process.env.PASSWORD_RESET_TOKEN_SECRET,
                      { expiresIn: '24h' },
                    )
                    if (c.default) {
                      const e = new d.default()
                      yield e.send(
                        e.TEMPLATES.resetPassword.config(s, {
                          resetPasswordUrl: `${process.env.FRONTEND_URL}/reset-password/${i}`,
                        }),
                      )
                    }
                    t.status(200).json({ message: 'Reset password email sent' })
                  } catch (e) {
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
          setNewPassword() {
            return r(this, void 0, void 0, function* () {
              this.app.put('/api/auth/reset-password', (e, t) =>
                r(this, void 0, void 0, function* () {
                  const s = e.headers.authorization,
                    i = o.default.object().keys({ password: o.default.string().required() })
                  if (u.default.validateSchema(i, e.body) || !s) return t.sendStatus(400)
                  try {
                    const { password: i } = e.body
                    l.default.verify(s, process.env.PASSWORD_RESET_TOKEN_SECRET, (e, s) =>
                      r(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield a.default.user.update({
                              where: { email: s.email },
                              data: { password: yield n.default.hashPassword(i) },
                            }),
                            t.status(200).json({ message: 'New password successfully set' }))
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
            return r(this, void 0, void 0, function* () {
              this.app.delete('/api/auth', (e, t) =>
                r(this, void 0, void 0, function* () {
                  try {
                    const s = o.default.object().keys({ jwt: o.default.required() })
                    if (u.default.validateSchema(s, e.cookies)) return t.sendStatus(204)
                    const { jwt: r } = e.cookies,
                      i = yield a.default.user.findFirst({
                        where: { UserRefreshTokens: { some: { token: r } } },
                      })
                    return i
                      ? (yield a.default.userRefreshTokens.delete({ where: { userId: i.id } }),
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
          getUserInformation() {
            return r(this, void 0, void 0, function* () {
              this.app.get('/api/me', (e, t) =>
                r(this, void 0, void 0, function* () {
                  const s = o.default.object().keys({ jwt: o.default.required() })
                  if (u.default.validateSchema(s, e.cookies)) return t.sendStatus(401)
                  const { jwt: r } = e.cookies
                  l.default.verify(r, process.env.ACCESS_TOKEN_SECRET, (e, s) => {
                    if (e) return t.sendStatus(401)
                    const { email: r, role: i } = s
                    return t.status(200).json({ email: r, role: i })
                  })
                }),
              )
            })
          }
        }
      },
      488: function (e, t, s) {
        var r =
            (this && this.__awaiter) ||
            function (e, t, s, r) {
              return new (s || (s = Promise))(function (i, n) {
                function o(e) {
                  try {
                    u(r.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(r.throw(e))
                  } catch (e) {
                    n(e)
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
                u((r = r.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = i(s(860)),
          o = i(s(506)),
          a = i(s(448)),
          u = i(s(710)),
          d = i(s(582)),
          c = i(s(344))
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
              r(this, void 0, void 0, function* () {
                try {
                  const r = o.default.object().keys({ jwt: o.default.required() })
                  if (a.default.validateSchema(r, e.cookies)) return t.sendStatus(401)
                  const { jwt: i } = e.cookies
                  c.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, r) => {
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
      116: function (e, t, s) {
        var r =
            (this && this.__awaiter) ||
            function (e, t, s, r) {
              return new (s || (s = Promise))(function (i, n) {
                function o(e) {
                  try {
                    u(r.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(r.throw(e))
                  } catch (e) {
                    n(e)
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
                u((r = r.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(s(988))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.get()
          }
          get() {
            this.app.get('/api/devotionals', (e, t) =>
              r(this, void 0, void 0, function* () {
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
      334: function (e, t, s) {
        var r =
            (this && this.__awaiter) ||
            function (e, t, s, r) {
              return new (s || (s = Promise))(function (i, n) {
                function o(e) {
                  try {
                    u(r.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(r.throw(e))
                  } catch (e) {
                    n(e)
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
                u((r = r.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(s(988))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.getGrowthGroups()
          }
          getGrowthGroups() {
            return r(this, void 0, void 0, function* () {
              this.app.get('/api/growthgroups', (e, t) =>
                r(this, void 0, void 0, function* () {
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
      785: function (e, t, s) {
        var r =
            (this && this.__awaiter) ||
            function (e, t, s, r) {
              return new (s || (s = Promise))(function (i, n) {
                function o(e) {
                  try {
                    u(r.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function a(e) {
                  try {
                    u(r.throw(e))
                  } catch (e) {
                    n(e)
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
                u((r = r.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = s(590),
          o = i(s(632)),
          a = i(s(506)),
          u = i(s(488)),
          d = i(s(988)),
          c = i(s(448)),
          l = i(s(790)),
          f = i(s(766)),
          h = i(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.signUp(), u.default.JWT(this.app), this.get()
          }
          get() {
            return r(this, void 0, void 0, function* () {
              this.app.get('/api/users/:id', (e, t) =>
                r(this, void 0, void 0, function* () {
                  const { id: s } = e.params
                  try {
                    if (s) {
                      const e = yield d.default.user.findFirst({
                        where: { id: s },
                        select: { id: !0, email: !0, name: !0, createdAt: !0, birthdate: !0 },
                      })
                      e || t.status(404).json({ error: n.Errors.USER_NOT_FOUND }),
                        e && t.status(200).json(e)
                    } else t.status(401).json({ error: n.Errors.INVALID_OR_MISSING_ID })
                  } catch (e) {
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
                  const s = a.default
                      .object()
                      .keys({
                        email: a.default.string().email().required(),
                        name: a.default.string().required(),
                        phone: a.default.string().required().min(8).max(14),
                        password: a.default.string().min(8),
                        birthdate: a.default.string().required(),
                      }),
                    r = c.default.validateSchema(s, e.body)
                  try {
                    if (r) t.status(400).json({ error: r })
                    else {
                      const { email: s, name: r, password: i, phone: a, birthdate: u } = e.body,
                        c = yield d.default.user.create({
                          data: {
                            email: s,
                            name: r,
                            birthdate: new Date(u).toISOString(),
                            password: yield o.default.hashPassword(i),
                            phone: a,
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
                        p = h.default.sign({ id: c.id }, process.env.ACTIVATION_TOKEN_SECRET, {
                          expiresIn: '30d',
                        })
                      if (f.default) {
                        const e = new l.default()
                        yield e.send(
                          e.TEMPLATES.confirmationEmail.config(c.email, {
                            userFirstName: c.name.split(' ')[0],
                            activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${p}`,
                          }),
                        )
                      }
                      t.status(201).json({ message: n.Success.USER_CREATED, user: c })
                    }
                  } catch (e) {
                    'P2002' === e.code
                      ? t.status(409).json({ error: n.Errors.USER_ALREADY_EXISTS })
                      : t.status(500).json({ error: n.Errors.INTERNAL_SERVER_ERROR })
                  }
                }),
              )
            })
          }
        }
      },
      618: function (e, t, s) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = r(s(835)),
          n = r(s(116)),
          o = r(s(334)),
          a = r(s(488)),
          u = r(s(785))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new a.default(this.app),
              new i.default(this.app),
              new o.default(this.app),
              new n.default(this.app),
              new u.default(this.app)
          }
        }
      },
      632: function (e, t, s) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, r) {
                  void 0 === r && (r = s)
                  var i = Object.getOwnPropertyDescriptor(t, s)
                  ;(i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, r, i)
                }
              : function (e, t, s, r) {
                  void 0 === r && (r = s), (e[r] = t[s])
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
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && r(t, e, s)
              return i(t, e), t
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
      766: (e, t, s) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81), (t.default = !0)
      },
      590: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.Success = t.Errors = void 0),
          (t.Errors = {
            INVALID_OR_MISSING_ID: 'É necessário enviar um ID para a busca',
            USER_NOT_FOUND: 'Usuário não encontrado',
            USER_ALREADY_EXISTS: 'Este usuário já existe. Você esqueceu sua senha?',
            INTERNAL_SERVER_ERROR: 'Houve um problema. Se este erro persistis contate o suporte',
          }),
          (t.Success = {
            USER_CREATED: 'Usuário criado com sucesso. Verifique seu email para ativar sua conta',
          })
      },
      448: function (e, t, s) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, r) {
                  void 0 === r && (r = s)
                  var i = Object.getOwnPropertyDescriptor(t, s)
                  ;(i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, r, i)
                }
              : function (e, t, s, r) {
                  void 0 === r && (r = s), (e[r] = t[s])
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
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && r(t, e, s)
              return i(t, e), t
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
            const r = s.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return a.mergeAll(r)
          }
        }
      },
      607: function (e, t, s) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = r(s(618)),
          n = r(s(860))
        new (class {
          constructor(e = (0, n.default)()) {
            ;(this.app = e), this.app.listen(process.env.PORT || 5e3, () => new i.default(e))
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
  !(function s(r) {
    var i = t[r]
    if (void 0 !== i) return i.exports
    var n = (t[r] = { exports: {} })
    return e[r].call(n.exports, n, n.exports, s), n.exports
  })(607)
})()
