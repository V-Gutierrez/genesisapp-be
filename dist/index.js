;(() => {
  'use strict'
  var e = {
      988: (e, t, s) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = new (s(524).PrismaClient)()
        t.default = i
      },
      835: function (e, t, s) {
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
        const n = r(s(632)),
          o = s(590),
          a = r(s(988)),
          u = r(s(448)),
          d = r(s(29)),
          c = r(s(766)),
          l = r(s(344))
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
            return i(this, void 0, void 0, function* () {
              this.app.post('/api/auth', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    const { jwt: s } = e.cookies
                    s &&
                      l.default.verify(e.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (e) => {
                        if (!e) return t.sendStatus(204)
                        t.clearCookie('jwt', {
                          httpOnly: !0,
                          secure: c.default,
                          sameSite: c.default ? 'none' : void 0,
                        })
                      })
                    const i = u.default.validateSchema(u.default.LOGIN_SCHEMA, e.body)
                    if (i) return t.status(400).json({ error: i })
                    const { email: r, password: d } = e.body,
                      f = yield a.default.user.findFirst({
                        where: { email: r },
                        select: { name: !0, password: !0, email: !0, id: !0, role: !0, active: !0 },
                      })
                    if (!f) return t.sendStatus(404)
                    if (!f.active) return t.status(403).json({ error: 'User is not activated' })
                    if (yield n.default.comparePassword(d, f.password)) {
                      const e = l.default.sign(
                          { email: f.email, role: f.role, id: f.id, name: f.name },
                          process.env.ACCESS_TOKEN_SECRET,
                          { expiresIn: '12h' },
                        ),
                        s = l.default.sign(
                          { email: f.email, role: f.role, id: f.id, name: f.name },
                          process.env.REFRESH_TOKEN_SECRET,
                          { expiresIn: '30d' },
                        )
                      return (
                        yield a.default.userRefreshTokens.upsert({
                          where: { userId: f.id },
                          update: { token: s },
                          create: { userId: f.id, token: s },
                        }),
                        t.setHeader('Access-Control-Allow-Credentials', 'true'),
                        t.cookie('jwt', e, {
                          httpOnly: !0,
                          maxAge: 2592e6,
                          secure: c.default,
                          sameSite: c.default ? 'none' : void 0,
                        }),
                        t.status(200).json({ userLoggedIn: !0 })
                      )
                    }
                    return t.status(401).json({ error: o.Errors.NO_AUTH })
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
                    const { jwt: s } = e.cookies
                    l.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                      i(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie('jwt', {
                              httpOnly: !0,
                              secure: c.default,
                              sameSite: c.default ? 'none' : void 0,
                            }),
                            t.sendStatus(403)
                          )
                        const r = yield a.default.user.findFirst({
                          where: { email: s.email },
                          select: { id: !0, email: !0, role: !0, UserRefreshTokens: !0 },
                        })
                        if (!r)
                          return (
                            t.clearCookie('jwt', {
                              httpOnly: !0,
                              secure: c.default,
                              sameSite: c.default ? 'none' : void 0,
                            }),
                            t.sendStatus(403)
                          )
                        const { UserRefreshTokens: n, id: o } = r,
                          [{ token: u }] = n
                        l.default.verify(u, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          i(this, void 0, void 0, function* () {
                            if (e)
                              return (
                                yield a.default.userRefreshTokens.delete({ where: { userId: o } }),
                                t.clearCookie('jwt', {
                                  httpOnly: !0,
                                  secure: c.default,
                                  sameSite: c.default ? 'none' : void 0,
                                }),
                                t.sendStatus(403)
                              )
                            const s = l.default.sign(
                              { email: r.email, role: r.role },
                              process.env.ACCESS_TOKEN_SECRET,
                              { expiresIn: '12h' },
                            )
                            t.cookie('jwt', s, {
                              httpOnly: !0,
                              maxAge: 2592e6,
                              secure: c.default,
                              sameSite: c.default ? 'none' : void 0,
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
          activateNewUser() {
            return i(this, void 0, void 0, function* () {
              this.app.post('/api/auth/activate', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    if (!e.headers.authorization) return t.sendStatus(401)
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
                  try {
                    const s = u.default.validateSchema(u.default.RESET_PASSWORD, e.body)
                    if (s) return t.status(400).json({ error: s })
                    const { email: i } = e.body,
                      r = yield a.default.user.findFirst({
                        where: { email: i },
                        select: { email: !0, active: !0 },
                      })
                    if (!r || !r.active)
                      return t.status(200).json({ message: 'Reset password email sent' })
                    const n = l.default.sign(
                      { email: i },
                      process.env.PASSWORD_RESET_TOKEN_SECRET,
                      { expiresIn: '24h' },
                    )
                    if (c.default) {
                      const e = new d.default()
                      yield e.send(
                        e.TEMPLATES.resetPassword.config(i, {
                          resetPasswordUrl: `${process.env.FRONT_BASE_URL}/reset-password?token=${n}`,
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
            return i(this, void 0, void 0, function* () {
              this.app.put('/api/auth/reset-password', (e, t) =>
                i(this, void 0, void 0, function* () {
                  const s = e.headers.authorization
                  try {
                    if (u.default.validateSchema(u.default.NEW_PASSWORD, e.body) || !s)
                      return t.sendStatus(400)
                    const { password: r } = e.body
                    l.default.verify(s, process.env.PASSWORD_RESET_TOKEN_SECRET, (e, s) =>
                      i(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield a.default.user.update({
                              where: { email: s.email },
                              data: { password: yield n.default.hashPassword(r) },
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
            return i(this, void 0, void 0, function* () {
              this.app.delete('/api/auth', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    const { jwt: s } = e.cookies,
                      i = yield a.default.user.findFirst({
                        where: { UserRefreshTokens: { some: { token: s } } },
                      })
                    return i
                      ? (yield a.default.userRefreshTokens.delete({ where: { userId: i.id } }),
                        t.clearCookie('jwt', {
                          httpOnly: !0,
                          secure: c.default,
                          sameSite: c.default ? 'none' : void 0,
                        }),
                        t.sendStatus(204))
                      : (t.clearCookie('jwt', {
                          httpOnly: !0,
                          secure: c.default,
                          sameSite: c.default ? 'none' : void 0,
                        }),
                        t.sendStatus(204))
                  } catch (e) {
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
          getUserInformation() {
            return i(this, void 0, void 0, function* () {
              this.app.get('/api/auth/me', (e, t) =>
                i(this, void 0, void 0, function* () {
                  const { jwt: s } = e.cookies
                  l.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) => {
                    if (e) return t.sendStatus(401)
                    const { email: i, role: r, id: n, name: o } = s
                    return t.status(200).json({ email: i, role: r, id: n, name: o })
                  })
                }),
              )
            })
          }
        }
      },
      488: function (e, t, s) {
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
          o = r(s(710)),
          a = r(s(582)),
          u = r(s(766)),
          d = r(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.Logger(),
              this.app.use(n.default.json()),
              this.app.use((0, o.default)()),
              this.app.use(n.default.urlencoded({ extended: !1 }))
          }
          CORS() {
            const e = u.default ? [] : ['http://localhost:3000', 'http://192.168.0.56:3000']
            this.app.use(
              (0, a.default)({ credentials: !0, origin: [process.env.FRONT_BASE_URL, ...e] }),
            )
          }
          Logger() {
            this.app.use((e, t, s) => {
              s(),
                console.log(
                  `${e.method} ${e.url} --- Origin: ${e.headers.origin} - ${t.statusCode} : ${t.statusMessage}`,
                )
            })
          }
          static JWT(e) {
            e.use((e, t, s) =>
              i(this, void 0, void 0, function* () {
                try {
                  const { jwt: i } = e.cookies
                  d.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e) => {
                    if (e) return t.sendStatus(403)
                    s()
                  })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static IsAdmin(e) {
            e.use((e, t, s) =>
              i(this, void 0, void 0, function* () {
                try {
                  const { jwt: i } = e.cookies
                  d.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, i) =>
                    e ? t.sendStatus(403) : 'ADMIN' !== i.role ? t.sendStatus(401) : void s(),
                  )
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      116: function (e, t, s) {
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
        const n = r(s(988)),
          o = r(s(448)),
          a = r(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.getDevotionals()
          }
          getDevotionals() {
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
          createDevotional() {
            this.app.post('/api/devotionals', (e, t) =>
              i(this, void 0, void 0, function* () {
                try {
                  const { jwt: s } = e.cookies,
                    r = o.default.validateSchema(o.default.DEVOTIONAL_CREATION, e.body)
                  if (r) return t.status(400).json({ error: r })
                  const { body: u, title: d } = e.body
                  a.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                    i(this, void 0, void 0, function* () {
                      if (e) return t.sendStatus(403)
                      if ('ADMIN' !== s.role) return t.sendStatus(401)
                      const i = yield n.default.devotional.create({
                        data: { body: u, title: d, userId: s.id },
                      })
                      return t.status(201).json(i)
                    }),
                  )
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      334: function (e, t, s) {
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
        const n = r(s(988))
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
      785: function (e, t, s) {
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
        const n = s(590),
          o = r(s(632)),
          a = r(s(488)),
          u = r(s(988)),
          d = r(s(448)),
          c = r(s(29)),
          l = r(s(766)),
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
            return i(this, void 0, void 0, function* () {
              this.app.post('/api/users', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    const s = d.default.validateSchema(d.default.SIGNUP_SCHEMA, e.body)
                    if (s) return t.status(400).json({ error: s })
                    const { email: i, name: r, password: a, phone: h, birthdate: p } = e.body,
                      v = yield u.default.user.create({
                        data: {
                          email: i,
                          name: r,
                          birthdate: new Date(p).toISOString(),
                          password: yield o.default.hashPassword(a),
                          phone: h,
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
                      _ = f.default.sign({ id: v.id }, process.env.ACTIVATION_TOKEN_SECRET, {
                        expiresIn: '30d',
                      })
                    if (l.default) {
                      const e = new c.default()
                      yield e.send(
                        e.TEMPLATES.confirmationEmail.config(v.email, {
                          userFirstName: v.name.split(' ')[0],
                          activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${_}`,
                        }),
                      )
                    } else console.log('Activation token for ', i, ' : ', _)
                    t.status(201).json({ message: n.Success.USER_CREATED, user: v })
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
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = i(s(835)),
          n = i(s(116)),
          o = i(s(334)),
          a = i(s(488)),
          u = i(s(785))
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
      632: function (e, t, s) {
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
            NO_AUTH: 'Usuário ou senha inválido',
          }),
          (t.Success = {
            USER_CREATED: 'Usuário criado com sucesso. Verifique seu email para ativar sua conta',
          })
      },
      448: function (e, t, s) {
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
        class d {
          static validateSchema(e, t) {
            const { error: s } = u.default.validate(t, e, { abortEarly: !1, convert: !1 })
            if (!s || !s.details) return
            const i = s.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return a.mergeAll(i)
          }
        }
        ;(d.SIGNUP_SCHEMA = u.default.object().keys({
          email: u.default.string().email().required(),
          name: u.default.string().required(),
          phone: u.default
            .string()
            .regex(/^\+[0-9]{2}\s[0-9]{1,2}\s[0-9]{1,2}\s[0-9]{4}\-[0-9]{4}/)
            .required(),
          password: u.default
            .string()
            .min(8)
            .regex(/[a-z]/)
            .regex(/[A-Z]/)
            .regex(/[0-9]/)
            .regex(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/)
            .required(),
          birthdate: u.default.string().required(),
        })),
          (d.LOGIN_SCHEMA = u.default
            .object()
            .keys({
              email: u.default.string().email().required(),
              password: u.default.string().required(),
            })),
          (d.RESET_PASSWORD = u.default
            .object()
            .keys({ email: u.default.string().email().required() })),
          (d.NEW_PASSWORD = u.default.object().keys({
            password: u.default
              .string()
              .min(8)
              .regex(/[a-z]/)
              .regex(/[A-Z]/)
              .regex(/[0-9]/)
              .regex(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/)
              .required(),
          })),
          (d.DEVOTIONAL_CREATION = u.default
            .object()
            .keys({ body: u.default.string().required(), title: u.default.string().required() })),
          (t.default = d)
      },
      29: function (e, t, s) {
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
                  from: { email: 'suportegenesischurch@gmail.com', name: 'Genesis Church' },
                  subject: 'Seja bem vindo à Genesis Church',
                  templateId: 'd-20dab053877c41cdb7feeda798233024',
                  dynamicTemplateData: t,
                }),
              },
              resetPassword: {
                config: (e, t) => ({
                  to: e,
                  from: { email: 'suportegenesischurch@gmail.com', name: 'Genesis Church' },
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
                yield n.default.send(t), console.log('Sendgrid Service - 200')
              } catch (e) {
                throw new Error('Error in Sendgrid flow')
              }
            })
          }
        }
      },
      607: function (e, t, s) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = i(s(618)),
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
  })(607)
})()
