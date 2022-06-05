;(() => {
  'use strict'
  var e = {
      988: (e, t, i) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = new (i(524).PrismaClient)()
        t.default = s
      },
      835: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (o, a) {
                function n(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(n, r)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const a = o(i(632)),
          n = o(i(20)),
          r = i(590),
          u = o(i(988)),
          d = o(i(448)),
          l = o(i(29)),
          c = o(i(766)),
          f = o(i(344))
        t.default = class {
          static authenticate(e) {
            return s(this, void 0, void 0, function* () {
              e.post('/api/auth', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const { [n.default.AuthCookieDefaultOptions.name]: i } = e.cookies
                    i &&
                      f.default.verify(e.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (e) => {
                        if (!e) return t.sendStatus(204)
                        t.clearCookie(
                          n.default.AuthCookieDefaultOptions.name,
                          n.default.AuthCookieDefaultOptions.config,
                        )
                      })
                    const s = d.default.validateSchema(d.default.LOGIN_SCHEMA, e.body)
                    if (s) return t.status(400).json({ error: s })
                    const { email: o, password: l } = e.body,
                      c = yield u.default.user.findFirst({
                        where: { email: o },
                        select: { name: !0, password: !0, email: !0, id: !0, role: !0, active: !0 },
                      })
                    if (!c) return t.sendStatus(404)
                    if (!c.active) return t.status(403).json({ error: 'User is not activated' })
                    if (yield a.default.comparePassword(l, c.password)) {
                      const e = f.default.sign(
                          { email: c.email, role: c.role, id: c.id, name: c.name },
                          process.env.ACCESS_TOKEN_SECRET,
                          { expiresIn: '12h' },
                        ),
                        i = f.default.sign(
                          { email: c.email, role: c.role, id: c.id, name: c.name },
                          process.env.REFRESH_TOKEN_SECRET,
                          { expiresIn: '30d' },
                        )
                      return (
                        yield u.default.userRefreshTokens.upsert({
                          where: { userId: c.id },
                          update: { token: i },
                          create: { userId: c.id, token: i },
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
            return s(this, void 0, void 0, function* () {
              e.get('/api/auth', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const { [n.default.AuthCookieDefaultOptions.name]: i } = e.cookies
                    f.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, i) =>
                      s(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie(
                              n.default.AuthCookieDefaultOptions.name,
                              n.default.AuthCookieDefaultOptions.config,
                            ),
                            t.sendStatus(403)
                          )
                        const o = yield u.default.user.findFirst({
                          where: { email: i.email },
                          select: { id: !0, email: !0, role: !0, UserRefreshTokens: !0 },
                        })
                        if (!o)
                          return (
                            t.clearCookie('jwt', {
                              httpOnly: !0,
                              secure: c.default,
                              sameSite: c.default ? 'none' : void 0,
                            }),
                            t.sendStatus(403)
                          )
                        const { UserRefreshTokens: a, id: r } = o,
                          [{ token: d }] = a
                        f.default.verify(d, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          s(this, void 0, void 0, function* () {
                            if (e)
                              return (
                                yield u.default.userRefreshTokens.delete({ where: { userId: r } }),
                                t.clearCookie(
                                  n.default.AuthCookieDefaultOptions.name,
                                  n.default.AuthCookieDefaultOptions.config,
                                ),
                                t.sendStatus(403)
                              )
                            const i = f.default.sign(
                              { email: o.email, role: o.role },
                              process.env.ACCESS_TOKEN_SECRET,
                              { expiresIn: '12h' },
                            )
                            t.cookie(
                              n.default.AuthCookieDefaultOptions.name,
                              i,
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
            return s(this, void 0, void 0, function* () {
              e.post('/api/auth/activate', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    if (!e.headers.authorization) return t.sendStatus(401)
                    const { authorization: i } = e.headers
                    f.default.verify(i, process.env.ACTIVATION_TOKEN_SECRET, (e, i) =>
                      s(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield u.default.user.update({
                              where: { id: i.id },
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
            return s(this, void 0, void 0, function* () {
              e.post('/api/auth/reset-password', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const i = d.default.validateSchema(d.default.RESET_PASSWORD, e.body)
                    if (i) return t.status(400).json({ error: i })
                    const { email: s } = e.body,
                      o = yield u.default.user.findFirst({
                        where: { email: s },
                        select: { email: !0, active: !0 },
                      })
                    if (!o || !o.active)
                      return t.status(200).json({ message: 'Reset password email sent' })
                    const a = f.default.sign(
                      { email: s },
                      process.env.PASSWORD_RESET_TOKEN_SECRET,
                      { expiresIn: '24h' },
                    )
                    if (c.default) {
                      const e = new l.default()
                      yield e.send(
                        e.TEMPLATES.resetPassword.config(s, {
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
            return s(this, void 0, void 0, function* () {
              e.put('/api/auth/reset-password', (e, t) =>
                s(this, void 0, void 0, function* () {
                  const i = e.headers.authorization
                  try {
                    if (d.default.validateSchema(d.default.NEW_PASSWORD, e.body) || !i)
                      return t.sendStatus(400)
                    const { password: o } = e.body
                    f.default.verify(i, process.env.PASSWORD_RESET_TOKEN_SECRET, (e, i) =>
                      s(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield u.default.user.update({
                              where: { email: i.email },
                              data: { password: yield a.default.hashPassword(o) },
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
            return s(this, void 0, void 0, function* () {
              e.delete('/api/auth', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const { [n.default.AuthCookieDefaultOptions.name]: i } = e.cookies,
                      s = yield u.default.user.findFirst({
                        where: { UserRefreshTokens: { some: { token: i } } },
                      })
                    return s
                      ? (yield u.default.userRefreshTokens.delete({ where: { userId: s.id } }),
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
            return s(this, void 0, void 0, function* () {
              e.get('/api/auth/me', (e, t) =>
                s(this, void 0, void 0, function* () {
                  const { [n.default.AuthCookieDefaultOptions.name]: i } = e.cookies
                  if (!i) return t.sendStatus(400)
                  f.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, i) => {
                    if (e) return t.sendStatus(401)
                    const { email: s, role: o, id: a, name: n } = i
                    return t.status(200).json({ email: s, role: o, id: a, name: n })
                  })
                }),
              )
            })
          }
        }
      },
      488: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (o, a) {
                function n(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(n, r)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const a = o(i(860)),
          n = o(i(20)),
          r = o(i(710)),
          u = o(i(582)),
          d = o(i(766)),
          l = o(i(344)),
          c = o(i(470)),
          f = o(i(738))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.app.use(a.default.json()),
              this.app.use((0, r.default)()),
              this.app.use(a.default.urlencoded({ extended: !1 })),
              this.app.use(
                (0, c.default)(':method :url :status :res[content-length] - :response-time ms'),
              )
          }
          CORS() {
            const e = d.default ? [] : ['http://localhost:3000', 'http://192.168.0.56:3000']
            this.app.use(
              (0, u.default)({ credentials: !0, origin: [process.env.FRONT_BASE_URL, ...e] }),
            )
          }
          static JWT(e) {
            e.use((e, t, i) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { [n.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                  l.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e) => {
                    if (e) return t.sendStatus(403)
                    i()
                  })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static IsAdmin(e) {
            e.use((e, t, i) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { [n.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                  l.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                    e ? t.sendStatus(403) : 'ADMIN' !== s.role ? t.sendStatus(401) : void i(),
                  )
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static SingleFileUpload(e) {
            return (0, f.default)().single(e)
          }
        }
      },
      116: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (o, a) {
                function n(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(n, r)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = o(i(832)),
          n = o(i(488)),
          r = o(i(988)),
          u = o(i(448)),
          d = i(465),
          l = i(496),
          c = i(628)
        t.default = class {
          static getDevotionals(e) {
            e.get('/api/devotionals', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const e = yield r.default.devotional.findMany({
                    where: {
                      scheduledTo: { lte: (0, d.zonedTimeToUtc)(new Date(), 'America/Sao_Paulo') },
                    },
                    orderBy: { scheduledTo: 'desc' },
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
              s(this, void 0, void 0, function* () {
                try {
                  const { slug: i } = e.params,
                    s = yield r.default.devotional.findFirst({
                      where: {
                        slug: i,
                        scheduledTo: {
                          lte: (0, d.zonedTimeToUtc)(new Date(Date.now()), 'America/Sao_Paulo'),
                        },
                      },
                      orderBy: { scheduledTo: 'desc' },
                    })
                  if (!s) return t.sendStatus(404)
                  t.status(200).json(s)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getDevotionalsAsAdmin(e) {
            e.get('/api/all-devotionals', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const e = yield r.default.devotional.findMany({
                    orderBy: { scheduledTo: 'desc' },
                  })
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static createDevotional(e) {
            e.post('/api/devotionals', n.default.SingleFileUpload('coverImage'), (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const i = u.default.validateSchema(u.default.DEVOTIONAL_CREATION, e.body)
                  if (i) return t.status(400).json({ error: i })
                  if (!e.file) return t.status(400).json({ error: 'coverImage is missing' })
                  const { body: s, title: o, scheduledTo: n, author: f } = e.body,
                    { file: h } = e,
                    {
                      url: p,
                      thumbnailUrl: v,
                      fileId: _,
                    } = yield a.default.uploadFile(
                      h.buffer,
                      (0, l.generateSlug)(o),
                      c.ImageKitFolders.Devotionals,
                    ),
                    m = yield r.default.devotional.create({
                      data: {
                        body: s,
                        title: o,
                        scheduledTo: (0, d.zonedTimeToUtc)(new Date(n), 'America/Sao_Paulo'),
                        author: f,
                        slug: (0, l.generateSlug)(o),
                        coverImage: p,
                        coverThumbnail: v,
                        assetId: _,
                      },
                    })
                  return t.status(201).json(m)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteDevocional(e) {
            e.delete('/api/devotionals/:id', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { id: i } = e.params,
                    s = yield r.default.devotional.delete({ where: { id: i } })
                  yield a.default.delete(s.assetId), t.sendStatus(204)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      334: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (o, a) {
                function n(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(n, r)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = o(i(988))
        t.default = class {
          static getGrowthGroups(e) {
            return s(this, void 0, void 0, function* () {
              e.get('/api/growthgroups', (e, t) =>
                s(this, void 0, void 0, function* () {
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
      673: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (o, a) {
                function n(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(n, r)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = o(i(988))
        t.default = class {
          static getStats(e) {
            e.get('/api/stats', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const e = yield a.default.user.count({ where: { active: !0 } }),
                    i = yield a.default.devotional.count(),
                    s = yield a.default.growthGroup.count()
                  return t.status(200).json({ activeUsers: e, devotionals: i, groups: s })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      785: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (o, a) {
                function n(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(n, r)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const a = i(590),
          n = o(i(632)),
          r = o(i(988)),
          u = o(i(448)),
          d = o(i(29)),
          l = o(i(766)),
          c = o(i(344))
        t.default = class {
          static get(e) {
            return s(this, void 0, void 0, function* () {
              e.get('/api/users/:id', (e, t) =>
                s(this, void 0, void 0, function* () {
                  const { id: i } = e.params
                  try {
                    if (i) {
                      const e = yield r.default.user.findFirst({
                        where: { id: i },
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
            return s(this, void 0, void 0, function* () {
              e.post('/api/users', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const i = u.default.validateSchema(u.default.SIGNUP_SCHEMA, e.body)
                    if (i) return t.status(400).json({ error: i })
                    const { email: s, name: o, password: f, phone: h, birthdate: p } = e.body,
                      v = yield r.default.user.create({
                        data: {
                          email: s,
                          name: o,
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
                      _ = c.default.sign({ id: v.id }, process.env.ACTIVATION_TOKEN_SECRET, {
                        expiresIn: '30d',
                      })
                    if (l.default) {
                      const e = new d.default()
                      yield e.send(
                        e.TEMPLATES.confirmationEmail.config(v.email, {
                          userFirstName: v.name.split(' ')[0],
                          activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${_}`,
                        }),
                      )
                    } else console.log('Activation token for ', s, ' : ', _)
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
      618: function (e, t, i) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(835)),
          a = s(i(116)),
          n = s(i(334)),
          r = s(i(488)),
          u = s(i(673)),
          d = s(i(785))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new r.default(this.app),
              o.default.authenticate(this.app),
              o.default.refreshToken(this.app),
              o.default.activateNewUser(this.app),
              o.default.resetPassword(this.app),
              o.default.setNewPassword(this.app),
              o.default.logout(this.app),
              o.default.getUserInformation(this.app),
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
      632: function (e, t, i) {
        var s =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, s) {
                  void 0 === s && (s = i)
                  var o = Object.getOwnPropertyDescriptor(t, i)
                  ;(o && !('get' in o ? !t.__esModule : o.writable || o.configurable)) ||
                    (o = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, s, o)
                }
              : function (e, t, i, s) {
                  void 0 === s && (s = i), (e[s] = t[i])
                }),
          o =
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
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && s(t, e, i)
              return o(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const n = a(i(96))
        t.default = class {
          static hashPassword(e) {
            return n.hash(e, process.env.BCRYPTSALT)
          }
          static comparePassword(e, t) {
            return n.compare(e, t)
          }
        }
      },
      20: function (e, t, i) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(766))
        class a {}
        ;(t.default = a),
          (a.AuthCookieDefaultOptions = {
            name: 'jwt',
            config: {
              httpOnly: !0,
              secure: o.default,
              sameSite: o.default ? 'lax' : void 0,
              maxAge: 2592e6,
            },
          })
      },
      766: (e, t, i) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81), (t.default = !0)
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
      448: function (e, t, i) {
        var s =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, s) {
                  void 0 === s && (s = i)
                  var o = Object.getOwnPropertyDescriptor(t, i)
                  ;(o && !('get' in o ? !t.__esModule : o.writable || o.configurable)) ||
                    (o = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, s, o)
                }
              : function (e, t, i, s) {
                  void 0 === s && (s = i), (e[s] = t[i])
                }),
          o =
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
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && s(t, e, i)
              return o(t, e), t
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = a(i(634)),
          u = n(i(506))
        class d {
          static FILE_UPLOAD(e) {
            return u.default.object().keys({ [e]: u.default.required() })
          }
          static validateSchema(e, t) {
            const { error: i } = u.default.validate(t, e, { abortEarly: !1, convert: !1 })
            if (!i || !i.details) return
            const s = i.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return r.mergeAll(s)
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
              author: u.default.string().required(),
              scheduledTo: u.default.string().required(),
            })),
          (t.default = d)
      },
      496: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.generateSlug = void 0),
          (t.generateSlug = (e) => e.replace(/\s+/g, '-').toLowerCase())
      },
      832: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (o, a) {
                function n(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(n, r)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const a = o(i(386))
        class n {
          static InitializeInstance() {
            return s(this, void 0, void 0, function* () {
              return new a.default({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: process.env.IMAGEKIT_PROJECT_URL,
              })
            })
          }
          static uploadFile(e, t, i) {
            return s(this, void 0, void 0, function* () {
              return (yield n.InitializeInstance()).upload({ file: e, fileName: t, folder: i })
            })
          }
          static delete(e) {
            return s(this, void 0, void 0, function* () {
              const t = yield n.InitializeInstance()
              yield t.deleteFile(e)
            })
          }
        }
        t.default = n
      },
      29: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (o, a) {
                function n(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(n, r)
                }
                u((s = s.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const a = o(i(139))
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
            return s(this, void 0, void 0, function* () {
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
      628: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.ImageKitFolders = void 0),
          ((t.ImageKitFolders || (t.ImageKitFolders = {})).Devotionals = 'devotionals')
      },
      607: function (e, t, i) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(618)),
          a = s(i(860))
        new (class {
          constructor(e = (0, a.default)()) {
            ;(this.app = e), this.app.listen(process.env.PORT || 5e3, () => new o.default(e))
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
      386: (e) => {
        e.exports = require('imagekit')
      },
      506: (e) => {
        e.exports = require('joi')
      },
      344: (e) => {
        e.exports = require('jsonwebtoken')
      },
      470: (e) => {
        e.exports = require('morgan')
      },
      738: (e) => {
        e.exports = require('multer')
      },
      634: (e) => {
        e.exports = require('ramda')
      },
    },
    t = {}
  !(function i(s) {
    var o = t[s]
    if (void 0 !== o) return o.exports
    var a = (t[s] = { exports: {} })
    return e[s].call(a.exports, a, a.exports, i), a.exports
  })(607)
})()
