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
              return new (s || (s = Promise))(function (i, a) {
                function n(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    a(e)
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
                          })).then(n, r)
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
        const a = i(s(632)),
          n = i(s(20)),
          r = s(590),
          u = i(s(988)),
          d = i(s(448)),
          c = i(s(29)),
          l = i(s(766)),
          f = i(s(344))
        t.default = class {
          static authenticate(e) {
            return o(this, void 0, void 0, function* () {
              e.post('/api/auth', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const { [n.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                    s &&
                      f.default.verify(e.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (e) => {
                        if (!e) return t.sendStatus(204)
                        t.clearCookie(
                          n.default.AuthCookieDefaultOptions.name,
                          n.default.AuthCookieDefaultOptions.config,
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
                    if (yield a.default.comparePassword(c, l.password)) {
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
                          n.default.AuthCookieDefaultOptions.name,
                          e,
                          n.default.AuthCookieDefaultOptions.config,
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
          static refreshToken(e) {
            return o(this, void 0, void 0, function* () {
              e.get('/api/auth', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const { [n.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                    f.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                      o(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie(
                              n.default.AuthCookieDefaultOptions.name,
                              n.default.AuthCookieDefaultOptions.config,
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
                        const { UserRefreshTokens: a, id: r } = i,
                          [{ token: d }] = a
                        f.default.verify(d, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          o(this, void 0, void 0, function* () {
                            if (e)
                              return (
                                yield u.default.userRefreshTokens.delete({ where: { userId: r } }),
                                t.clearCookie(
                                  n.default.AuthCookieDefaultOptions.name,
                                  n.default.AuthCookieDefaultOptions.config,
                                ),
                                t.sendStatus(403)
                              )
                            const s = f.default.sign(
                              { email: i.email, role: i.role },
                              process.env.ACCESS_TOKEN_SECRET,
                              { expiresIn: '12h' },
                            )
                            t.cookie(
                              n.default.AuthCookieDefaultOptions.name,
                              s,
                              n.default.AuthCookieDefaultOptions.config,
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
          static activateNewUser(e) {
            return o(this, void 0, void 0, function* () {
              e.post('/api/auth/activate', (e, t) =>
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
          static resetPassword(e) {
            return o(this, void 0, void 0, function* () {
              e.post('/api/auth/reset-password', (e, t) =>
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
                    const a = f.default.sign(
                      { email: o },
                      process.env.PASSWORD_RESET_TOKEN_SECRET,
                      { expiresIn: '24h' },
                    )
                    if (l.default) {
                      const e = new c.default()
                      yield e.send(
                        e.TEMPLATES.resetPassword.config(o, {
                          resetPasswordUrl: `${process.env.FRONT_BASE_URL}/reset-password?token=${a}`,
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
          static setNewPassword(e) {
            return o(this, void 0, void 0, function* () {
              e.put('/api/auth/reset-password', (e, t) =>
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
                              data: { password: yield a.default.hashPassword(i) },
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
          static logout(e) {
            return o(this, void 0, void 0, function* () {
              e.delete('/api/auth', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const { [n.default.AuthCookieDefaultOptions.name]: s } = e.cookies,
                      o = yield u.default.user.findFirst({
                        where: { UserRefreshTokens: { some: { token: s } } },
                      })
                    return o
                      ? (yield u.default.userRefreshTokens.delete({ where: { userId: o.id } }),
                        t.clearCookie(
                          n.default.AuthCookieDefaultOptions.name,
                          n.default.AuthCookieDefaultOptions.config,
                        ),
                        t.sendStatus(204))
                      : (t.clearCookie(
                          n.default.AuthCookieDefaultOptions.name,
                          n.default.AuthCookieDefaultOptions.config,
                        ),
                        t.sendStatus(204))
                  } catch (e) {
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
          static getUserInformation(e) {
            return o(this, void 0, void 0, function* () {
              e.get('/api/auth/me', (e, t) =>
                o(this, void 0, void 0, function* () {
                  const { [n.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                  if (!s) return t.sendStatus(400)
                  f.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) => {
                    if (e) return t.sendStatus(401)
                    const { email: o, role: i, id: a, name: n } = s
                    return t.status(200).json({ email: o, role: i, id: a, name: n })
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
              return new (s || (s = Promise))(function (i, a) {
                function n(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    a(e)
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
                          })).then(n, r)
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
        const a = i(s(860)),
          n = i(s(20)),
          r = i(s(710)),
          u = i(s(582)),
          d = i(s(766)),
          c = i(s(344))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.Logger(),
              this.app.use(a.default.json()),
              this.app.use((0, r.default)()),
              this.app.use(a.default.urlencoded({ extended: !1 }))
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
                  const { [n.default.AuthCookieDefaultOptions.name]: o } = e.cookies
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
                  const { [n.default.AuthCookieDefaultOptions.name]: o } = e.cookies
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
              return new (s || (s = Promise))(function (i, a) {
                function n(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    a(e)
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
                          })).then(n, r)
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
        const a = i(s(20)),
          n = i(s(988)),
          r = i(s(448)),
          u = i(s(344)),
          d = s(465)
        t.default = class {
          static getDevotionals(e) {
            e.get('/api/devotionals', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const e = yield n.default.devotional.findMany({
                    where: {
                      scheduledTo: { lte: (0, d.zonedTimeToUtc)(new Date(), 'America/Sao_Paulo') },
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
          static getDevotionalBySlug(e) {
            e.get('/api/devotionals/:slug', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const { slug: s } = e.params,
                    o = yield n.default.devotional.findFirst({
                      where: {
                        slug: s,
                        scheduledTo: {
                          lte: (0, d.zonedTimeToUtc)(new Date(Date.now()), 'America/Sao_Paulo'),
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
          static getDevotionalsAsAdmin(e) {
            e.get('/api/all-devotionals', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const e = yield n.default.devotional.findMany({
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
          static createDevotional(e) {
            e.post('/api/devotionals', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const { [a.default.AuthCookieDefaultOptions.name]: s } = e.cookies,
                    i = r.default.validateSchema(r.default.DEVOTIONAL_CREATION, e.body)
                  if (i) return t.status(400).json({ error: i })
                  const { body: c, title: l, scheduledTo: f } = e.body
                  u.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                    o(this, void 0, void 0, function* () {
                      if (e) return t.sendStatus(403)
                      const o = yield n.default.devotional.create({
                        data: {
                          body: c,
                          title: l,
                          scheduledTo: (0, d.zonedTimeToUtc)(new Date(f), 'America/Sao_Paulo'),
                          userId: s.id,
                          slug: l.replace(/\s+/g, '-').toLowerCase(),
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
          static deleteDevocional(e) {
            e.delete('/api/devotionals/:id', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const { id: s } = e.params
                  yield n.default.devotional.delete({ where: { id: s } }), t.sendStatus(204)
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
              return new (s || (s = Promise))(function (i, a) {
                function n(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    a(e)
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
                          })).then(n, r)
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
        const a = i(s(988))
        t.default = class {
          static getGrowthGroups(e) {
            return o(this, void 0, void 0, function* () {
              e.get('/api/growthgroups', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const e = yield a.default.growthGroup.findMany()
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
              return new (s || (s = Promise))(function (i, a) {
                function n(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    a(e)
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
                          })).then(n, r)
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
        const a = i(s(988))
        t.default = class {
          static getStats(e) {
            e.get('/api/stats', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const e = yield a.default.user.count({ where: { active: !0 } }),
                    s = yield a.default.devotional.count(),
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
              return new (s || (s = Promise))(function (i, a) {
                function n(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    a(e)
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
                          })).then(n, r)
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
        const a = s(590),
          n = i(s(632)),
          r = i(s(988)),
          u = i(s(448)),
          d = i(s(29)),
          c = i(s(766)),
          l = i(s(344))
        t.default = class {
          static get(e) {
            return o(this, void 0, void 0, function* () {
              e.get('/api/users/:id', (e, t) =>
                o(this, void 0, void 0, function* () {
                  const { id: s } = e.params
                  try {
                    if (s) {
                      const e = yield r.default.user.findFirst({
                        where: { id: s },
                        select: { id: !0, email: !0, name: !0, createdAt: !0, birthdate: !0 },
                      })
                      e || t.status(404).json({ error: a.Errors.USER_NOT_FOUND }),
                        e && t.status(200).json(e)
                    } else t.status(401).json({ error: a.Errors.INVALID_OR_MISSING_ID })
                  } catch (e) {
                    t.sendStatus(500)
                  }
                }),
              )
            })
          }
          static signUp(e) {
            return o(this, void 0, void 0, function* () {
              e.post('/api/users', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const s = u.default.validateSchema(u.default.SIGNUP_SCHEMA, e.body)
                    if (s) return t.status(400).json({ error: s })
                    const { email: o, name: i, password: f, phone: h, birthdate: p } = e.body,
                      v = yield r.default.user.create({
                        data: {
                          email: o,
                          name: i,
                          birthdate: new Date(p).toISOString(),
                          password: yield n.default.hashPassword(f),
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
                      _ = l.default.sign({ id: v.id }, process.env.ACTIVATION_TOKEN_SECRET, {
                        expiresIn: '30d',
                      })
                    if (c.default) {
                      const e = new d.default()
                      yield e.send(
                        e.TEMPLATES.confirmationEmail.config(v.email, {
                          userFirstName: v.name.split(' ')[0],
                          activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${_}`,
                        }),
                      )
                    } else console.log('Activation token for ', o, ' : ', _)
                    t.status(201).json({ message: a.Success.USER_CREATED, user: v })
                  } catch (e) {
                    'P2002' === e.code
                      ? t.status(409).json({ error: a.Errors.USER_ALREADY_EXISTS })
                      : t.status(500).json({ error: a.Errors.INTERNAL_SERVER_ERROR })
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
          a = o(s(116)),
          n = o(s(334)),
          r = o(s(488)),
          u = o(s(673)),
          d = o(s(785))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new r.default(this.app),
              i.default.authenticate(this.app),
              i.default.refreshToken(this.app),
              i.default.activateNewUser(this.app),
              i.default.resetPassword(this.app),
              i.default.setNewPassword(this.app),
              i.default.logout(this.app),
              i.default.getUserInformation(this.app),
              n.default.getGrowthGroups(this.app),
              a.default.getDevotionals(this.app),
              a.default.getDevotionalBySlug(this.app),
              d.default.signUp(this.app),
              r.default.JWT(this.app),
              d.default.get(this.app),
              r.default.IsAdmin(this.app),
              a.default.createDevotional(this.app),
              a.default.getDevotionalsAsAdmin(this.app),
              a.default.deleteDevocional(this.app),
              u.default.getStats(this.app)
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
          a =
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
        const n = a(s(96))
        t.default = class {
          static hashPassword(e) {
            return n.hash(e, process.env.BCRYPTSALT)
          }
          static comparePassword(e, t) {
            return n.compare(e, t)
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
        class a {}
        ;(t.default = a),
          (a.AuthCookieDefaultOptions = {
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
          a =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && o(t, e, s)
              return i(t, e), t
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = a(s(634)),
          u = n(s(506))
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
              return new (s || (s = Promise))(function (i, a) {
                function n(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    a(e)
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
                          })).then(n, r)
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
        const a = i(s(139))
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
              a.default.setApiKey(process.env.SENDGRID_API_KEY)
          }
          send(e) {
            return o(this, void 0, void 0, function* () {
              const t = e
              try {
                yield a.default.send(t), console.log('Sendgrid Service - 200')
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
          a = o(s(860))
        new (class {
          constructor(e = (0, a.default)()) {
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
    var a = (t[o] = { exports: {} })
    return e[o].call(a.exports, a, a.exports, s), a.exports
  })(607)
})()
