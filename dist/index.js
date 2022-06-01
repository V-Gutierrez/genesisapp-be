;(() => {
  'use strict'
  var e = {
      988: (e, t, s) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = new (s(524).PrismaClient)()
        t.default = o
      },
      835: function (e, t, s) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, s, o) {
              return new (s || (s = Promise))(function (i, n) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
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
                          })).then(a, r)
                }
                u((o = o.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = i(s(632)),
          a = i(s(20)),
          r = s(590),
          u = i(s(988)),
          d = i(s(448)),
          c = i(s(29)),
          l = i(s(766)),
          f = i(s(344))
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
            return o(this, void 0, void 0, function* () {
              this.app.post('/api/auth', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const { [a.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                    s &&
                      f.default.verify(e.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (e) => {
                        if (!e) return t.sendStatus(204)
                        t.clearCookie(
                          a.default.AuthCookieDefaultOptions.name,
                          a.default.AuthCookieDefaultOptions.config,
                        )
                      })
                    const o = d.default.validateSchema(d.default.LOGIN_SCHEMA, e.body)
                    if (o) return t.status(400).json({ error: o })
                    const { email: i, password: c } = e.body,
                      l = yield u.default.user.findFirst({
                        where: { email: i },
                        select: { name: !0, password: !0, email: !0, id: !0, role: !0, active: !0 },
                      })
                    if (!l) return t.sendStatus(404)
                    if (!l.active) return t.status(403).json({ error: 'User is not activated' })
                    if (yield n.default.comparePassword(c, l.password)) {
                      const e = f.default.sign(
                          { email: l.email, role: l.role, id: l.id, name: l.name },
                          process.env.ACCESS_TOKEN_SECRET,
                          { expiresIn: '12h' },
                        ),
                        s = f.default.sign(
                          { email: l.email, role: l.role, id: l.id, name: l.name },
                          process.env.REFRESH_TOKEN_SECRET,
                          { expiresIn: '30d' },
                        )
                      return (
                        yield u.default.userRefreshTokens.upsert({
                          where: { userId: l.id },
                          update: { token: s },
                          create: { userId: l.id, token: s },
                        }),
                        t.setHeader('Access-Control-Allow-Credentials', 'true'),
                        t.cookie(
                          a.default.AuthCookieDefaultOptions.name,
                          e,
                          a.default.AuthCookieDefaultOptions.config,
                        ),
                        t.status(200).json({ userLoggedIn: !0 })
                      )
                    }
                    return t.status(401).json({ error: r.Errors.NO_AUTH })
                  } catch (e) {
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
          refreshToken() {
            return o(this, void 0, void 0, function* () {
              this.app.get('/api/auth', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const { [a.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                    f.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                      o(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie(
                              a.default.AuthCookieDefaultOptions.name,
                              a.default.AuthCookieDefaultOptions.config,
                            ),
                            t.sendStatus(403)
                          )
                        const i = yield u.default.user.findFirst({
                          where: { email: s.email },
                          select: { id: !0, email: !0, role: !0, UserRefreshTokens: !0 },
                        })
                        if (!i)
                          return (
                            t.clearCookie('jwt', {
                              httpOnly: !0,
                              secure: l.default,
                              sameSite: l.default ? 'none' : void 0,
                            }),
                            t.sendStatus(403)
                          )
                        const { UserRefreshTokens: n, id: r } = i,
                          [{ token: d }] = n
                        f.default.verify(d, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          o(this, void 0, void 0, function* () {
                            if (e)
                              return (
                                yield u.default.userRefreshTokens.delete({ where: { userId: r } }),
                                t.clearCookie(
                                  a.default.AuthCookieDefaultOptions.name,
                                  a.default.AuthCookieDefaultOptions.config,
                                ),
                                t.sendStatus(403)
                              )
                            const s = f.default.sign(
                              { email: i.email, role: i.role },
                              process.env.ACCESS_TOKEN_SECRET,
                              { expiresIn: '12h' },
                            )
                            t.cookie(
                              a.default.AuthCookieDefaultOptions.name,
                              s,
                              a.default.AuthCookieDefaultOptions.config,
                            ),
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
            return o(this, void 0, void 0, function* () {
              this.app.post('/api/auth/activate', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    if (!e.headers.authorization) return t.sendStatus(401)
                    const { authorization: s } = e.headers
                    f.default.verify(s, process.env.ACTIVATION_TOKEN_SECRET, (e, s) =>
                      o(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield u.default.user.update({
                              where: { id: s.id },
                              data: { active: !0 },
                            }),
                            t.sendStatus(204))
                      }),
                    )
                  } catch (e) {
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
          resetPassword() {
            return o(this, void 0, void 0, function* () {
              this.app.post('/api/auth/reset-password', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const s = d.default.validateSchema(d.default.RESET_PASSWORD, e.body)
                    if (s) return t.status(400).json({ error: s })
                    const { email: o } = e.body,
                      i = yield u.default.user.findFirst({
                        where: { email: o },
                        select: { email: !0, active: !0 },
                      })
                    if (!i || !i.active)
                      return t.status(200).json({ message: 'Reset password email sent' })
                    const n = f.default.sign(
                      { email: o },
                      process.env.PASSWORD_RESET_TOKEN_SECRET,
                      { expiresIn: '24h' },
                    )
                    if (l.default) {
                      const e = new c.default()
                      yield e.send(
                        e.TEMPLATES.resetPassword.config(o, {
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
            return o(this, void 0, void 0, function* () {
              this.app.put('/api/auth/reset-password', (e, t) =>
                o(this, void 0, void 0, function* () {
                  const s = e.headers.authorization
                  try {
                    if (d.default.validateSchema(d.default.NEW_PASSWORD, e.body) || !s)
                      return t.sendStatus(400)
                    const { password: i } = e.body
                    f.default.verify(s, process.env.PASSWORD_RESET_TOKEN_SECRET, (e, s) =>
                      o(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield u.default.user.update({
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
            return o(this, void 0, void 0, function* () {
              this.app.delete('/api/auth', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const { [a.default.AuthCookieDefaultOptions.name]: s } = e.cookies,
                      o = yield u.default.user.findFirst({
                        where: { UserRefreshTokens: { some: { token: s } } },
                      })
                    return o
                      ? (yield u.default.userRefreshTokens.delete({ where: { userId: o.id } }),
                        t.clearCookie(
                          a.default.AuthCookieDefaultOptions.name,
                          a.default.AuthCookieDefaultOptions.config,
                        ),
                        t.sendStatus(204))
                      : (t.clearCookie(
                          a.default.AuthCookieDefaultOptions.name,
                          a.default.AuthCookieDefaultOptions.config,
                        ),
                        t.sendStatus(204))
                  } catch (e) {
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
          getUserInformation() {
            return o(this, void 0, void 0, function* () {
              this.app.get('/api/auth/me', (e, t) =>
                o(this, void 0, void 0, function* () {
                  const { [a.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                  if (!s) return t.sendStatus(400)
                  f.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) => {
                    if (e) return t.sendStatus(401)
                    const { email: o, role: i, id: n, name: a } = s
                    return t.status(200).json({ email: o, role: i, id: n, name: a })
                  })
                }),
              )
            })
          }
        }
      },
      488: function (e, t, s) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, s, o) {
              return new (s || (s = Promise))(function (i, n) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
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
                          })).then(a, r)
                }
                u((o = o.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = i(s(860)),
          a = i(s(20)),
          r = i(s(710)),
          u = i(s(582)),
          d = i(s(766)),
          c = i(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.Logger(),
              this.app.use(n.default.json()),
              this.app.use((0, r.default)()),
              this.app.use(n.default.urlencoded({ extended: !1 }))
          }
          CORS() {
            const e = d.default ? [] : ['http://localhost:3000', 'http://192.168.0.56:3000']
            this.app.use(
              (0, u.default)({ credentials: !0, origin: [process.env.FRONT_BASE_URL, ...e] }),
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
              o(this, void 0, void 0, function* () {
                try {
                  const { [a.default.AuthCookieDefaultOptions.name]: o } = e.cookies
                  c.default.verify(o, process.env.ACCESS_TOKEN_SECRET, (e) => {
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
              o(this, void 0, void 0, function* () {
                try {
                  const { [a.default.AuthCookieDefaultOptions.name]: o } = e.cookies
                  c.default.verify(o, process.env.ACCESS_TOKEN_SECRET, (e, o) =>
                    e ? t.sendStatus(403) : 'ADMIN' !== o.role ? t.sendStatus(401) : void s(),
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
        var o =
            (this && this.__awaiter) ||
            function (e, t, s, o) {
              return new (s || (s = Promise))(function (i, n) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
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
                          })).then(a, r)
                }
                u((o = o.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(s(20)),
          a = i(s(488)),
          r = i(s(988)),
          u = i(s(448)),
          d = i(s(344)),
          c = s(465)
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.getDevotionals(),
              this.getDevotionalBySlug(),
              a.default.IsAdmin(this.app),
              this.createDevotional(),
              this.getDevotionalsAsAdmin(),
              this.deleteDevocional()
          }
          getDevotionals() {
            this.app.get('/api/devotionals', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const e = yield r.default.devotional.findMany({
                    where: {
                      scheduledTo: {
                        lte: (0, c.zonedTimeToUtc)(new Date(Date.now()), 'America/Sao_Paulo'),
                      },
                    },
                    orderBy: { scheduledTo: 'desc' },
                    include: { author: { select: { name: !0 } } },
                  })
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          getDevotionalBySlug() {
            this.app.get('/api/devotionals/:slug', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const { slug: s } = e.params,
                    o = yield r.default.devotional.findFirst({
                      where: {
                        slug: s,
                        scheduledTo: {
                          lte: (0, c.zonedTimeToUtc)(new Date(Date.now()), 'America/Sao_Paulo'),
                        },
                      },
                      orderBy: { scheduledTo: 'desc' },
                      include: { author: { select: { name: !0 } } },
                    })
                  if (!o) return t.sendStatus(404)
                  t.status(200).json(o)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          getDevotionalsAsAdmin() {
            this.app.get('/api/all-devotionals', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const e = yield r.default.devotional.findMany({
                    orderBy: { scheduledTo: 'desc' },
                    include: { author: { select: { name: !0 } } },
                  })
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          createDevotional() {
            this.app.post('/api/devotionals', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const { [n.default.AuthCookieDefaultOptions.name]: s } = e.cookies,
                    i = u.default.validateSchema(u.default.DEVOTIONAL_CREATION, e.body)
                  if (i) return t.status(400).json({ error: i })
                  const { body: a, title: c, scheduledTo: l } = e.body
                  d.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                    o(this, void 0, void 0, function* () {
                      if (e) return t.sendStatus(403)
                      const o = yield r.default.devotional.create({
                        data: {
                          body: a,
                          title: c,
                          scheduledTo: new Date(l),
                          userId: s.id,
                          slug: c.replace(/\s+/g, '-').toLowerCase(),
                        },
                      })
                      return t.status(201).json(o)
                    }),
                  )
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          deleteDevocional() {
            this.app.delete('/api/devotionals/:id', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const { id: s } = e.params
                  yield r.default.devotional.delete({ where: { id: s } }), t.sendStatus(204)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      334: function (e, t, s) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, s, o) {
              return new (s || (s = Promise))(function (i, n) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
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
                          })).then(a, r)
                }
                u((o = o.apply(e, t || [])).next())
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
            return o(this, void 0, void 0, function* () {
              this.app.get('/api/growthgroups', (e, t) =>
                o(this, void 0, void 0, function* () {
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
      673: function (e, t, s) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, s, o) {
              return new (s || (s = Promise))(function (i, n) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
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
                          })).then(a, r)
                }
                u((o = o.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(s(488)),
          a = i(s(988)),
          r = s(465)
        t.default = class {
          constructor(e) {
            ;(this.app = e), n.default.IsAdmin(this.app), this.getStats()
          }
          getStats() {
            this.app.get('/api/stats', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const e = yield a.default.user.count({ where: { active: !0 } }),
                    s = yield a.default.devotional.count({
                      where: {
                        scheduledTo: {
                          gte: (0, r.zonedTimeToUtc)(new Date(Date.now()), 'America/Sao_Paulo'),
                        },
                      },
                    }),
                    o = yield a.default.growthGroup.count()
                  return t.status(200).json({ activeUsers: e, devotionals: s, groups: o })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      785: function (e, t, s) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, s, o) {
              return new (s || (s = Promise))(function (i, n) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
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
                          })).then(a, r)
                }
                u((o = o.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const n = s(590),
          a = i(s(632)),
          r = i(s(488)),
          u = i(s(988)),
          d = i(s(448)),
          c = i(s(29)),
          l = i(s(766)),
          f = i(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e), this.signUp(), r.default.JWT(this.app), this.get()
          }
          get() {
            return o(this, void 0, void 0, function* () {
              this.app.get('/api/users/:id', (e, t) =>
                o(this, void 0, void 0, function* () {
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
            return o(this, void 0, void 0, function* () {
              this.app.post('/api/users', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const s = d.default.validateSchema(d.default.SIGNUP_SCHEMA, e.body)
                    if (s) return t.status(400).json({ error: s })
                    const { email: o, name: i, password: r, phone: h, birthdate: p } = e.body,
                      v = yield u.default.user.create({
                        data: {
                          email: o,
                          name: i,
                          birthdate: new Date(p).toISOString(),
                          password: yield a.default.hashPassword(r),
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
                    } else console.log('Activation token for ', o, ' : ', _)
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
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = o(s(835)),
          n = o(s(116)),
          a = o(s(334)),
          r = o(s(488)),
          u = o(s(673)),
          d = o(s(785))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new r.default(this.app),
              new i.default(this.app),
              new a.default(this.app),
              new n.default(this.app),
              new d.default(this.app),
              new u.default(this.app)
          }
        }
      },
      632: function (e, t, s) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, o) {
                  void 0 === o && (o = s)
                  var i = Object.getOwnPropertyDescriptor(t, s)
                  ;(i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, o, i)
                }
              : function (e, t, s, o) {
                  void 0 === o && (o = s), (e[o] = t[s])
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
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && o(t, e, s)
              return i(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const a = n(s(96))
        t.default = class {
          static hashPassword(e) {
            return a.hash(e, process.env.BCRYPTSALT)
          }
          static comparePassword(e, t) {
            return a.compare(e, t)
          }
        }
      },
      20: function (e, t, s) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = o(s(766))
        class n {}
        ;(t.default = n),
          (n.AuthCookieDefaultOptions = {
            name: '100038189377123',
            config: {
              httpOnly: !0,
              secure: i.default,
              sameSite: i.default ? 'none' : void 0,
              maxAge: 2592e6,
            },
          })
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
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, o) {
                  void 0 === o && (o = s)
                  var i = Object.getOwnPropertyDescriptor(t, s)
                  ;(i && !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, o, i)
                }
              : function (e, t, s, o) {
                  void 0 === o && (o = s), (e[o] = t[s])
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
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && o(t, e, s)
              return i(t, e), t
            },
          a =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = n(s(634)),
          u = a(s(506))
        class d {
          static validateSchema(e, t) {
            const { error: s } = u.default.validate(t, e, { abortEarly: !1, convert: !1 })
            if (!s || !s.details) return
            const o = s.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return r.mergeAll(o)
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
            .keys({
              body: u.default.string().required(),
              title: u.default.string().required(),
              scheduledTo: u.default.string().required(),
            })),
          (t.default = d)
      },
      29: function (e, t, s) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, s, o) {
              return new (s || (s = Promise))(function (i, n) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    n(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
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
                          })).then(a, r)
                }
                u((o = o.apply(e, t || [])).next())
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
            return o(this, void 0, void 0, function* () {
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
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = o(s(618)),
          n = o(s(860))
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
      465: (e) => {
        e.exports = require('date-fns-tz')
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
  !(function s(o) {
    var i = t[o]
    if (void 0 !== i) return i.exports
    var n = (t[o] = { exports: {} })
    return e[o].call(n.exports, n, n.exports, s), n.exports
  })(607)
})()
