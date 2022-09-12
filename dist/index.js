;(() => {
  'use strict'
  var e = {
      988: (e, t, i) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = new (i(524).PrismaClient)()
        t.default = s
      },
      315: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.TIMEZONE = void 0),
          (t.TIMEZONE = 'America/Sao_Paulo')
      },
      835: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = i(590),
          a = n(i(632)),
          r = n(i(20)),
          u = n(i(988)),
          d = n(i(448)),
          c = n(i(29)),
          l = n(i(686)),
          f = n(i(766)),
          h = n(i(344))
        t.default = class {
          static authenticate(e) {
            return s(this, void 0, void 0, function* () {
              e.post('/api/auth', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const { [r.default.AuthCookieDefaultOptions.name]: i } = e.cookies
                    i &&
                      h.default.verify(e.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (e) => {
                        e &&
                          t.clearCookie(
                            r.default.AuthCookieDefaultOptions.name,
                            r.default.AuthCookieDefaultOptions.config,
                          )
                      })
                    const s = d.default.validateSchema(d.default.LOGIN_SCHEMA, e.body)
                    if (s) return t.status(400).json({ message: s })
                    const { email: n, password: c } = e.body,
                      f = yield l.default.getUserByEmail(n)
                    if (!f) return t.sendStatus(404)
                    if (!f.active) return t.status(403).json({ message: o.Errors.USER_NOT_ACTIVE })
                    if (yield a.default.comparePassword(c, f.password)) {
                      const e = h.default.sign(
                          { email: f.email, role: f.role, id: f.id, name: f.name },
                          process.env.ACCESS_TOKEN_SECRET,
                          { expiresIn: '12h' },
                        ),
                        i = h.default.sign(
                          { email: f.email, role: f.role, id: f.id, name: f.name },
                          process.env.REFRESH_TOKEN_SECRET,
                          { expiresIn: '30d' },
                        )
                      return (
                        yield u.default.userRefreshTokens.upsert({
                          where: { userId: f.id },
                          update: { token: i },
                          create: { userId: f.id, token: i },
                        }),
                        t.cookie(
                          r.default.AuthCookieDefaultOptions.name,
                          e,
                          r.default.AuthCookieDefaultOptions.config,
                        ),
                        t.status(200).json({ userLoggedIn: !0 })
                      )
                    }
                    return t.status(401).json({ message: o.Errors.NO_AUTH })
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
                    const { [r.default.AuthCookieDefaultOptions.name]: i } = e.cookies
                    h.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, i) =>
                      s(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie(
                              r.default.AuthCookieDefaultOptions.name,
                              r.default.AuthCookieDefaultOptions.config,
                            ),
                            t.sendStatus(403)
                          )
                        const n = yield l.default.getUserByDecodedEmail(i.email)
                        if (!n)
                          return (
                            t.clearCookie('jwt', {
                              httpOnly: !0,
                              secure: f.default,
                              sameSite: f.default ? 'none' : void 0,
                            }),
                            t.sendStatus(403)
                          )
                        const { UserRefreshTokens: o, id: a } = n,
                          [{ token: d }] = o
                        h.default.verify(d, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          s(this, void 0, void 0, function* () {
                            if (e)
                              return (
                                yield u.default.userRefreshTokens.delete({ where: { userId: a } }),
                                t.clearCookie(
                                  r.default.AuthCookieDefaultOptions.name,
                                  r.default.AuthCookieDefaultOptions.config,
                                ),
                                t.sendStatus(403)
                              )
                            const i = h.default.sign(
                              { email: n.email, role: n.role },
                              process.env.ACCESS_TOKEN_SECRET,
                              { expiresIn: '12h' },
                            )
                            t.cookie(
                              r.default.AuthCookieDefaultOptions.name,
                              i,
                              r.default.AuthCookieDefaultOptions.config,
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
                    h.default.verify(i, process.env.ACTIVATION_TOKEN_SECRET, (e, i) =>
                      s(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield l.default.activateUserById(i.id),
                            t.status(200).json({ message: o.Success.USER_ACTIVATED }))
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
                    if (i) return t.status(400).json({ message: i })
                    const { email: s } = e.body,
                      n = yield l.default.getUserByEmail(s)
                    if (!n || !n.active)
                      return t.status(200).json({ message: o.Success.RESET_EMAIL_SEND })
                    const a = h.default.sign(
                      { email: s },
                      process.env.PASSWORD_RESET_TOKEN_SECRET,
                      { expiresIn: '24h' },
                    )
                    if (f.default) {
                      const e = new c.default()
                      yield e.send(
                        e.TEMPLATES.resetPassword.config(s, {
                          resetPasswordUrl: `${process.env.FRONT_BASE_URL}/reset-password?token=${a}`,
                        }),
                      )
                    }
                    return t.status(200).json({ message: o.Success.RESET_EMAIL_SEND })
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
                    const { password: n } = e.body
                    h.default.verify(i, process.env.PASSWORD_RESET_TOKEN_SECRET, (e, i) =>
                      s(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield l.default.setUserPasswordByEmail(i.email, n),
                            t.status(200).json({ message: o.Success.NEW_PASSWORD_SET }))
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
                    return (
                      t.clearCookie(
                        r.default.AuthCookieDefaultOptions.name,
                        r.default.AuthCookieDefaultOptions.config,
                      ),
                      t.status(200).json({ message: o.Success.LOGOUT })
                    )
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
                  var i
                  try {
                    const {
                      email: s,
                      role: n,
                      id: o,
                      name: a,
                    } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                    return t.status(200).json({ email: s, role: n, id: o, name: a })
                  } catch (e) {
                    return t.sendStatus(500)
                  }
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
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(860)),
          a = n(i(20)),
          r = n(i(710)),
          u = n(i(582)),
          d = n(i(766)),
          c = n(i(344)),
          l = n(i(470)),
          f = n(i(738)),
          { useTreblle: h } = i(549)
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.app.use(o.default.json()),
              this.app.use((0, r.default)()),
              this.app.use(o.default.urlencoded({ extended: !1 })),
              this.app.use((0, l.default)('short')),
              this.TrebbleDocs(this.app),
              this.UserContext(this.app)
          }
          CORS() {
            const e = d.default ? [] : ['http://localhost:3000', 'http://192.168.0.56:3000']
            this.app.use(
              (0, u.default)({ credentials: !0, origin: [process.env.FRONT_BASE_URL, ...e] }),
            )
          }
          TrebbleDocs(e) {
            d.default &&
              h(e, {
                apiKey: process.env.TREBBLE_DOCS_API,
                projectId: process.env.TREBBLE_DOCS_PID,
              })
          }
          UserContext(e) {
            e.use((e, t, i) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { [a.default.AuthCookieDefaultOptions.name]: t } = e.cookies
                  c.default.verify(t, process.env.ACCESS_TOKEN_SECRET, (t, s) => {
                    ;(e.cookies.user = t ? null : s), i()
                  })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static JWT(e) {
            e.use((e, t, i) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { [a.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                  c.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e) => {
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
                  const { [a.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                  c.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                    e ? t.sendStatus(403) : 'ADMIN' !== s.role ? t.sendStatus(401) : void i(),
                  )
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static SingleFileUpload(e) {
            return (0, f.default)({ limits: { fileSize: 2e6 } }).single(e)
          }
        }
      },
      116: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(362)),
          a = n(i(721)),
          r = n(i(832)),
          u = n(i(488)),
          d = n(i(448)),
          c = i(465),
          l = i(315),
          f = i(628),
          h = i(590)
        t.default = class {
          static getDevotionals(e) {
            e.get('/api/devotionals', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const e = yield o.default.getReleasedDevotionals()
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
                var i
                try {
                  const { slug: s } = e.params,
                    { id: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {},
                    a = yield o.default.getBySlug(s)
                  return a
                    ? (yield o.default.view(a.id, n), t.status(200).json(a))
                    : t.sendStatus(404)
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
                  const e = yield o.default.getAll()
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static createDevotional(e) {
            e.post('/api/devotionals', u.default.SingleFileUpload('coverImage'), (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const i = d.default.validateSchema(d.default.DEVOTIONAL_CREATION, e.body)
                  if (i) return t.status(400).json({ message: i })
                  if (!e.file) return t.status(400).json({ message: 'coverImage is missing' })
                  const { body: s, title: n, scheduledTo: u, author: h } = e.body,
                    { file: v } = e,
                    {
                      url: p,
                      thumbnailUrl: _,
                      fileId: m,
                    } = yield r.default.uploadFile(
                      v.buffer,
                      a.default.generateSlug(n),
                      f.ImageKitFolders.Devotionals,
                    ),
                    g = yield o.default.create({
                      body: s,
                      title: n,
                      scheduledTo: (0, c.zonedTimeToUtc)(new Date(u), l.TIMEZONE),
                      author: h,
                      slug: a.default.generateSlug(n),
                      coverImage: p,
                      coverThumbnail: _,
                      assetId: m,
                    })
                  return t.status(201).json(g)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteDevotional(e) {
            e.delete('/api/devotionals/:id', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { id: i } = e.params,
                    s = yield o.default.deleteById(i)
                  yield r.default.delete(s.assetId),
                    t.status(200).json({ message: h.Success.RESOURCE_DELETED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static like(e) {
            e.post('/api/devotionals/:id/like', (e, t) =>
              s(this, void 0, void 0, function* () {
                var i
                try {
                  const { id: s } = e.params,
                    { id: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                  yield o.default.like(s, n),
                    t.status(201).json({ status: h.Success.RESOURCE_CREATED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      489: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(44)),
          a = n(i(448)),
          r = n(i(488)),
          u = n(i(721)),
          d = n(i(832)),
          c = i(628),
          l = i(315),
          f = i(465),
          h = i(590)
        t.default = class {
          static getEvents(e) {
            e.get('/api/events', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const e = yield o.default.getReleasedEvents()
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getEventById(e) {
            e.get('/api/events/:id', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { id: i } = e.params,
                    s = yield o.default.getEventById(i)
                  t.status(200).json(s)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static createEvent(e) {
            e.post('/api/events', r.default.SingleFileUpload('coverImage'), (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const i = a.default.validateSchema(a.default.EVENTS_CREATION, e.body)
                  if (i) return t.status(400).json({ message: i })
                  if (!e.file) return t.status(400).json({ message: 'coverImage is missing' })
                  const {
                      title: s,
                      subscriptionsScheduledTo: n,
                      subscriptionsDueDate: r,
                      eventDate: h,
                      maxSlots: v,
                      description: p,
                    } = e.body,
                    { file: _ } = e,
                    {
                      url: m,
                      thumbnailUrl: g,
                      fileId: y,
                    } = yield d.default.uploadFile(
                      _.buffer,
                      u.default.generateSlug(s),
                      c.ImageKitFolders.Events,
                    ),
                    E = yield o.default.create({
                      title: s,
                      subscriptionsScheduledTo: (0, f.zonedTimeToUtc)(new Date(n), l.TIMEZONE),
                      subscriptionsDueDate: (0, f.zonedTimeToUtc)(new Date(r), l.TIMEZONE),
                      eventDate: (0, f.zonedTimeToUtc)(new Date(h), l.TIMEZONE),
                      description: p,
                      maxSlots: Number(v),
                      coverImage: m,
                      coverThumbnail: g,
                      assetId: y,
                    })
                  return t.status(201).json(E)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteEvent(e) {
            e.delete('/api/events/:id', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { id: i } = e.params,
                    s = yield o.default.deleteById(i)
                  yield d.default.delete(s.assetId),
                    t.status(200).json({ message: h.Success.RESOURCE_DELETED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getEventsAsAdmin(e) {
            e.get('/api/all-events', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const e = yield o.default.getAll()
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static subscribeToEvent(e) {
            e.post('/api/events/subscriptions/:id', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const i = a.default.validateSchema(a.default.EVENTS_SUBSCRIPTION, e.body)
                  if (i) return t.status(400).json({ message: i })
                  const { id: s } = e.params,
                    { userName: n, userEmail: r, userPhone: u } = e.body
                  yield o.default.subscribeUserToEvent(
                    { userName: n, userEmail: r, userPhone: u },
                    s,
                  ),
                    t.sendStatus(201)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteSubscription(e) {
            e.delete('/api/events/subscriptions/:id', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { id: i } = e.params
                  yield o.default.removeSubscriptionById(i),
                    t.status(200).json({ message: h.Success.RESOURCE_DELETED })
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
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(882))
        t.default = class {
          static getGrowthGroups(e) {
            return s(this, void 0, void 0, function* () {
              e.get('/api/growthgroups', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const e = yield o.default.getAll()
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
      539: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(230))
        t.default = class {
          static getGooglePhotosAlbumPhotos(e) {
            e.get('/api/integrations/googlephotos', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { albumUrl: i } = e.query,
                    s = yield o.default.fetchImagesByAlbumUrl(i)
                  return t.status(200).json(s)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      145: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(721)),
          a = i(628),
          r = n(i(832)),
          u = n(i(488)),
          d = n(i(168)),
          c = n(i(448)),
          l = i(465),
          f = i(315),
          h = i(590)
        t.default = class {
          static createNews(e) {
            e.post('/api/news', u.default.SingleFileUpload('coverImage'), (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const i = c.default.validateSchema(c.default.NEWS_CREATION, e.body)
                  if (i) return t.status(400).json({ message: i })
                  if (!e.file) return t.status(400).json({ message: 'coverImage is missing' })
                  const { body: s, title: n, scheduledTo: u, highlightText: h } = e.body,
                    { file: v } = e,
                    {
                      url: p,
                      thumbnailUrl: _,
                      fileId: m,
                    } = yield r.default.uploadFile(
                      v.buffer,
                      o.default.generateSlug(n),
                      a.ImageKitFolders.News,
                    ),
                    g = yield d.default.create({
                      body: s,
                      title: n,
                      scheduledTo: (0, l.zonedTimeToUtc)(new Date(u), f.TIMEZONE),
                      coverImage: p,
                      coverThumbnail: _,
                      slug: o.default.generateSlug(n),
                      assetId: m,
                      highlightText: h,
                    })
                  return t.status(201).json(g)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteNews(e) {
            e.delete('/api/news/:id', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const { id: i } = e.params,
                    s = yield d.default.deleteById(i)
                  yield r.default.delete(s.assetId),
                    t.status(200).json({ message: h.Success.RESOURCE_DELETED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getNewsAsAdmin(e) {
            e.get('/api/all-news', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const e = yield d.default.getAll()
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getNews(e) {
            e.get('/api/news', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const e = yield d.default.getReleasedNews()
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getNewsBySlug(e) {
            e.get('/api/news/:slug', (e, t) =>
              s(this, void 0, void 0, function* () {
                var i
                try {
                  const { slug: s } = e.params,
                    { id: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {},
                    o = yield d.default.getBySlug(s)
                  return o
                    ? (yield d.default.view(o.id, n), t.status(200).json(o))
                    : t.sendStatus(404)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static like(e) {
            e.post('/api/news/:id/like', (e, t) =>
              s(this, void 0, void 0, function* () {
                var i
                try {
                  const { id: s } = e.params,
                    { id: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                  yield d.default.like(s, n),
                    t.status(201).json({ message: h.Success.RESOURCE_CREATED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      673: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(454))
        t.default = class {
          static getStats(e) {
            e.get('/api/stats', (e, t) =>
              s(this, void 0, void 0, function* () {
                try {
                  const {
                    devotionals: e,
                    activeUsers: i,
                    growthGroups: s,
                    news: n,
                    ongoingEvents: a,
                  } = yield o.default.getStats()
                  return t
                    .status(200)
                    .json({
                      activeUsers: i,
                      devotionals: e,
                      growthGroups: s,
                      news: n,
                      ongoingEvents: a,
                    })
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
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = i(590),
          a = n(i(632)),
          r = n(i(721)),
          u = n(i(448)),
          d = n(i(29)),
          c = n(i(686)),
          l = n(i(344))
        t.default = class {
          static get(e) {
            return s(this, void 0, void 0, function* () {
              e.get('/api/users/:id', (e, t) =>
                s(this, void 0, void 0, function* () {
                  const { id: i } = e.params
                  try {
                    if (i) {
                      const e = yield c.default.getUserById(i)
                      e || t.status(404).json({ message: o.Errors.USER_NOT_FOUND }),
                        e && t.status(200).json(e)
                    } else t.status(401).json({ message: o.Errors.INVALID_OR_MISSING_ID })
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
                    if (i) return t.status(400).json({ message: i })
                    const { email: s, name: n, password: f, phone: h, birthdate: v } = e.body,
                      p = yield c.default.create({
                        email: r.default.sanitizeEmail(s),
                        name: n,
                        birthdate: new Date(v).toISOString(),
                        password: yield a.default.hashPassword(f),
                        phone: h,
                      }),
                      _ = l.default.sign({ id: p.id }, process.env.ACTIVATION_TOKEN_SECRET, {
                        expiresIn: '30d',
                      }),
                      m = new d.default()
                    yield m.send(
                      m.TEMPLATES.confirmationEmail.config(p.email, {
                        userFirstName: r.default.getUserFirstName(p.name),
                        activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${_}`,
                      }),
                    ),
                      t.status(201).json({ message: o.Success.USER_CREATED, user: p })
                  } catch (e) {
                    'P2002' === e.code
                      ? t.status(409).json({ message: o.Errors.USER_ALREADY_EXISTS })
                      : t.status(500).json({ message: o.Errors.INTERNAL_SERVER_ERROR })
                  }
                }),
              )
            })
          }
          static getAllUsersAsAdmin(e) {
            return s(this, void 0, void 0, function* () {
              e.get('/api/users', (e, t) =>
                s(this, void 0, void 0, function* () {
                  try {
                    const e = yield c.default.getAll()
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
      632: function (e, t, i) {
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
          o =
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
        const a = o(i(96))
        t.default = class {
          static hashPassword(e) {
            return a.hash(e, process.env.BCRYPTSALT)
          }
          static comparePassword(e, t) {
            return a.compare(e, t)
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
        const n = s(i(766))
        class o {}
        ;(t.default = o),
          (o.AuthCookieDefaultOptions = {
            name: 'jwt',
            config: {
              httpOnly: !0,
              secure: n.default,
              sameSite: n.default ? 'none' : void 0,
              maxAge: 2592e6,
            },
          })
      },
      766: (e, t, i) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81), (t.default = !0)
      },
      721: function (e, t, i) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = s(i(113))
        class o {}
        ;(o.generateSlug = (e) =>
          e
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .toLowerCase()),
          (o.sanitizeUserPhone = (e) => e.replace(/\s/gi, '').replace('-', '').trim()),
          (o.sanitizeEmail = (e) => e.replace(/\s/gi, '').trim().toLocaleLowerCase()),
          (o.getUserFirstName = (e) => e.split(' ')[0]),
          (o.generateHashFromString = (e) =>
            n.default.createHash('md5', { outputLength: 16 }).update(e).digest('hex')),
          (t.default = o)
      },
      590: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.Success = t.Errors = void 0),
          (t.Errors = {
            INVALID_OR_MISSING_ID: 'É necessário enviar um ID para a busca',
            USER_NOT_FOUND: 'Usuário não encontrado',
            USER_NOT_ACTIVE: 'Usuário não ativado',
            USER_ALREADY_EXISTS: 'Este usuário já existe. Você esqueceu sua senha?',
            INTERNAL_SERVER_ERROR: 'Houve um problema. Se este erro persistir contate o suporte',
            NO_AUTH: 'Usuário ou senha inválido',
          }),
          (t.Success = {
            USER_CREATED: 'Usuário criado com sucesso. Verifique seu email para ativar sua conta',
            RESET_EMAIL_SEND: 'Email de redefinição de senha enviado com sucesso',
            NEW_PASSWORD_SET: 'Nova senha configurada com sucesso',
            USER_ACTIVATED: 'Usuário ativado com sucesso',
            RESOURCE_CREATED: 'Recurso criado',
            RESOURCE_DELETED: 'Recurso deletado',
            LOGOUT: 'Usuário deslogado com sucesso',
          })
      },
      448: function (e, t, i) {
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
          o =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && s(t, e, i)
              return n(t, e), t
            },
          a =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = o(i(634)),
          u = a(i(506))
        class d {
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
          (d.EVENTS_CREATION = u.default
            .object()
            .keys({
              title: u.default.string().required(),
              maxSlots: u.default.string().required(),
              subscriptionsScheduledTo: u.default.string().required(),
              subscriptionsDueDate: u.default.string().required(),
              eventDate: u.default.string().required(),
              description: u.default.string().required(),
            })),
          (d.EVENTS_SUBSCRIPTION = u.default
            .object()
            .keys({
              userName: u.default.string().required(),
              userEmail: u.default.string().required(),
              userPhone: u.default.string().required(),
            })),
          (d.NEWS_CREATION = u.default
            .object()
            .keys({
              title: u.default.string().required(),
              body: u.default.string().required(),
              highlightText: u.default.string().required(),
              scheduledTo: u.default.string().required(),
            })),
          (t.default = d)
      },
      362: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(988)),
          a = i(285),
          r = i(465),
          u = i(315)
        t.default = new (class {
          getReleasedDevotionals() {
            return s(this, void 0, void 0, function* () {
              return o.default.devotional.findMany({
                where: { scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(), u.TIMEZONE) } },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getBySlug(e) {
            return s(this, void 0, void 0, function* () {
              return o.default.devotional.findFirst({
                where: {
                  slug: e,
                  scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(Date.now()), u.TIMEZONE) },
                },
                orderBy: { scheduledTo: 'desc' },
                include: { DevotionalLikes: !0, DevotionalViews: !0 },
              })
            })
          }
          getById(e) {
            return s(this, void 0, void 0, function* () {
              return o.default.devotional.findFirst({
                where: {
                  id: e,
                  scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(Date.now()), u.TIMEZONE) },
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getAll() {
            return s(this, void 0, void 0, function* () {
              return o.default.devotional.findMany({ orderBy: { scheduledTo: 'desc' } })
            })
          }
          create(e) {
            return s(this, void 0, void 0, function* () {
              const t = (0, a.readingTime)(e.body, 120).minutes
              return o.default.devotional.create({
                data: Object.assign(Object.assign({}, e), { readingTimeInMinutes: t }),
              })
            })
          }
          deleteById(e) {
            return s(this, void 0, void 0, function* () {
              return o.default.devotional.delete({ where: { id: e } })
            })
          }
          like(e, t) {
            return s(this, void 0, void 0, function* () {
              try {
                ;(yield o.default.devotionalLikes.findFirst({
                  where: { userId: t, devotionalId: e },
                }))
                  ? yield o.default.devotionalLikes.delete({
                      where: { userId_devotionalId: { devotionalId: e, userId: t } },
                    })
                  : yield o.default.devotionalLikes.create({ data: { devotionalId: e, userId: t } })
              } catch (e) {
                console.log(e)
              }
            })
          }
          view(e, t) {
            return s(this, void 0, void 0, function* () {
              try {
                if (!t) return
                yield o.default.devotionalViews.upsert({
                  create: { devotionalId: e, userId: t },
                  where: { userId_devotionalId: { devotionalId: e, userId: t } },
                  update: { devotionalId: e, userId: t },
                })
              } catch (e) {
                console.log(e)
              }
            })
          }
        })()
      },
      44: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = i(315),
          a = n(i(988)),
          r = i(465),
          u = i(146)
        t.default = new (class {
          getAll() {
            return s(this, void 0, void 0, function* () {
              return a.default.events.findMany({
                orderBy: { subscriptionsScheduledTo: 'desc' },
                include: {
                  _count: { select: { EventsSubscriptions: !0 } },
                  EventsSubscriptions: !0,
                },
              })
            })
          }
          getReleasedEvents() {
            return s(this, void 0, void 0, function* () {
              return a.default.events.findMany({
                where: {
                  subscriptionsScheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE) },
                  eventDate: { gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE) },
                  subscriptionsDueDate: { gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE) },
                },
                include: { _count: { select: { EventsSubscriptions: !0 } } },
                orderBy: { subscriptionsScheduledTo: 'desc' },
              })
            })
          }
          create(e) {
            return s(this, void 0, void 0, function* () {
              try {
                const t =
                    (0, u.isAfter)(new Date(e.eventDate), new Date(e.subscriptionsDueDate)) &&
                    (0, u.isAfter)(new Date(e.eventDate), new Date(e.subscriptionsScheduledTo)),
                  i = (0, u.isAfter)(
                    new Date(e.subscriptionsDueDate),
                    new Date(e.subscriptionsScheduledTo),
                  )
                if (i && t) return a.default.events.create({ data: e })
                throw new Error(
                  `Cannot create event because of: isEventDateTheLaterDate : ${t}, isSubscriptionDueDateLaterThanSubscriptionScheduledDate: ${i}`,
                )
              } catch (e) {
                return console.log(e), null
              }
            })
          }
          deleteById(e) {
            return s(this, void 0, void 0, function* () {
              return a.default.events.delete({ where: { id: e } })
            })
          }
          getEventById(e) {
            return s(this, void 0, void 0, function* () {
              return a.default.events.findFirst({
                where: {
                  id: e,
                  eventDate: { gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE) },
                  subscriptionsDueDate: { gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE) },
                },
                include: { _count: { select: { EventsSubscriptions: !0 } } },
              })
            })
          }
          subscribeUserToEvent(e, t) {
            return s(this, void 0, void 0, function* () {
              const i = yield this.getEventById(t)
              if (!i) throw new Error(`No available event found for ${t}`)
              const { maxSlots: s } = i,
                { EventsSubscriptions: n } = i._count
              n < s &&
                (yield a.default.eventsSubscriptions.create({
                  data: Object.assign(Object.assign({}, e), { Event: { connect: { id: t } } }),
                }))
            })
          }
          removeSubscriptionById(e) {
            return s(this, void 0, void 0, function* () {
              yield a.default.eventsSubscriptions.delete({ where: { id: e } })
            })
          }
        })()
      },
      882: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(988))
        t.default = new (class {
          getAll() {
            return s(this, void 0, void 0, function* () {
              return o.default.growthGroup.findMany()
            })
          }
        })()
      },
      168: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(988)),
          a = i(315),
          r = i(465)
        t.default = new (class {
          create(e) {
            return s(this, void 0, void 0, function* () {
              return o.default.news.create({ data: e })
            })
          }
          deleteById(e) {
            return s(this, void 0, void 0, function* () {
              return o.default.news.delete({ where: { id: e } })
            })
          }
          getBySlug(e) {
            return s(this, void 0, void 0, function* () {
              return o.default.news.findFirst({
                where: {
                  slug: e,
                  scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(Date.now()), a.TIMEZONE) },
                },
                orderBy: { scheduledTo: 'desc' },
                include: { NewsLikes: !0, NewsViews: !0 },
              })
            })
          }
          getReleasedNews() {
            return s(this, void 0, void 0, function* () {
              return o.default.news.findMany({
                where: { scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(), a.TIMEZONE) } },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getAll() {
            return s(this, void 0, void 0, function* () {
              return o.default.news.findMany({ orderBy: { scheduledTo: 'desc' } })
            })
          }
          like(e, t) {
            return s(this, void 0, void 0, function* () {
              try {
                ;(yield o.default.newsLikes.findFirst({ where: { userId: t, newsId: e } }))
                  ? yield o.default.newsLikes.delete({
                      where: { userId_newsId: { newsId: e, userId: t } },
                    })
                  : yield o.default.newsLikes.create({ data: { newsId: e, userId: t } })
              } catch (e) {
                console.log(e)
              }
            })
          }
          view(e, t) {
            return s(this, void 0, void 0, function* () {
              try {
                if (!t) return
                yield o.default.newsViews.upsert({
                  create: { newsId: e, userId: t },
                  where: { userId_newsId: { newsId: e, userId: t } },
                  update: { newsId: e, userId: t },
                })
              } catch (e) {
                console.log(e)
              }
            })
          }
        })()
      },
      454: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(988)),
          a = i(315),
          r = i(465)
        t.default = new (class {
          getStats() {
            return s(this, void 0, void 0, function* () {
              const e = [
                  o.default.user.count({ where: { active: !0 } }),
                  o.default.devotional.count(),
                  o.default.growthGroup.count(),
                  o.default.news.count(),
                  o.default.events.count({
                    where: {
                      subscriptionsScheduledTo: {
                        lte: (0, r.zonedTimeToUtc)(new Date(), a.TIMEZONE),
                      },
                      eventDate: { gte: (0, r.zonedTimeToUtc)(new Date(), a.TIMEZONE) },
                      subscriptionsDueDate: { gte: (0, r.zonedTimeToUtc)(new Date(), a.TIMEZONE) },
                    },
                  }),
                ],
                [t, i, s, n, u] = yield Promise.all(e)
              return { activeUsers: t, devotionals: i, growthGroups: s, news: n, ongoingEvents: u }
            })
          }
        })()
      },
      686: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(632)),
          a = n(i(988))
        t.default = new (class {
          getUserById(e) {
            return s(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { id: e },
                select: { id: !0, email: !0, name: !0, createdAt: !0, birthdate: !0 },
              })
            })
          }
          getAll() {
            return s(this, void 0, void 0, function* () {
              return a.default.user.findMany({
                select: {
                  id: !0,
                  email: !0,
                  name: !0,
                  createdAt: !0,
                  birthdate: !0,
                  phone: !0,
                  active: !0,
                },
              })
            })
          }
          create(e) {
            return s(this, void 0, void 0, function* () {
              return a.default.user.create({
                data: e,
                select: { id: !0, email: !0, name: !0, createdAt: !0, phone: !0, password: !1 },
              })
            })
          }
          getUserByEmail(e) {
            return s(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { email: e },
                select: { name: !0, password: !0, email: !0, id: !0, role: !0, active: !0 },
              })
            })
          }
          getUserByDecodedEmail(e) {
            return s(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { email: e },
                select: { id: !0, email: !0, role: !0, UserRefreshTokens: !0 },
              })
            })
          }
          activateUserById(e) {
            return s(this, void 0, void 0, function* () {
              yield a.default.user.update({ where: { id: e }, data: { active: !0 } })
            })
          }
          getActiveUserByEmail(e) {
            return a.default.user.findFirst({
              where: { email: e },
              select: { email: !0, active: !0 },
            })
          }
          setUserPasswordByEmail(e, t) {
            return s(this, void 0, void 0, function* () {
              yield a.default.user.update({
                where: { email: e },
                data: { password: yield o.default.hashPassword(t) },
              })
            })
          }
        })()
      },
      894: function (e, t, i) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = s(i(835)),
          o = s(i(116)),
          a = s(i(334)),
          r = s(i(539)),
          u = s(i(488)),
          d = s(i(145)),
          c = s(i(673)),
          l = s(i(785)),
          f = s(i(489))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new u.default(this.app),
              n.default.authenticate(this.app),
              n.default.refreshToken(this.app),
              n.default.activateNewUser(this.app),
              n.default.resetPassword(this.app),
              n.default.setNewPassword(this.app),
              n.default.logout(this.app),
              a.default.getGrowthGroups(this.app),
              o.default.getDevotionals(this.app),
              o.default.getDevotionalBySlug(this.app),
              d.default.getNews(this.app),
              d.default.getNewsBySlug(this.app),
              d.default.like(this.app),
              l.default.signUp(this.app),
              f.default.subscribeToEvent(this.app),
              f.default.getEvents(this.app),
              f.default.getEventById(this.app),
              r.default.getGooglePhotosAlbumPhotos(this.app),
              u.default.JWT(this.app),
              n.default.getUserInformation(this.app),
              l.default.get(this.app),
              o.default.like(this.app),
              u.default.IsAdmin(this.app),
              f.default.getEventsAsAdmin(this.app),
              f.default.createEvent(this.app),
              f.default.deleteEvent(this.app),
              f.default.deleteSubscription(this.app),
              d.default.createNews(this.app),
              d.default.deleteNews(this.app),
              d.default.getNewsAsAdmin(this.app),
              l.default.getAllUsersAsAdmin(this.app),
              o.default.createDevotional(this.app),
              o.default.getDevotionalsAsAdmin(this.app),
              o.default.deleteDevotional(this.app),
              c.default.getStats(this.app)
          }
        }
      },
      230: function (e, t, i) {
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
          o =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && s(t, e, i)
              return n(t, e), t
            },
          a =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
                }
                u((s = s.apply(e, t || [])).next())
              })
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = o(i(142))
        t.default = new (class {
          parseImageOptmizations(e) {
            return e.map((e) =>
              Object.assign(Object.assign({}, e), {
                smartCropped: `${e.url}=p`,
                thumbnail: `${e.url}=s400-p`,
                minimalThumbnail: `${e.url}=s100-p`,
                highQuality: `${e.url}=s3920`,
              }),
            )
          }
          fetchImagesByAlbumUrl(e) {
            return a(this, void 0, void 0, function* () {
              try {
                const t = yield r.fetchImageUrls(e)
                return this.parseImageOptmizations(t)
              } catch (e) {
                throw new Error('Error in Google Photos Scrapper flow')
              }
            })
          }
        })()
      },
      832: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(386))
        class a {
          static InitializeInstance() {
            return s(this, void 0, void 0, function* () {
              return new o.default({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: process.env.IMAGEKIT_PROJECT_URL,
              })
            })
          }
          static uploadFile(e, t, i) {
            return s(this, void 0, void 0, function* () {
              try {
                return (yield a.InitializeInstance()).upload({ file: e, fileName: t, folder: i })
              } catch (e) {
                throw new Error('Error in ImageKitService')
              }
            })
          }
          static delete(e) {
            return s(this, void 0, void 0, function* () {
              try {
                const t = yield a.InitializeInstance()
                yield t.deleteFile(e)
              } catch (e) {
                throw new Error('Error in ImageKitService')
              }
            })
          }
        }
        t.default = a
      },
      29: function (e, t, i) {
        var s =
            (this && this.__awaiter) ||
            function (e, t, i, s) {
              return new (i || (i = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(s.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(s.throw(e))
                  } catch (e) {
                    o(e)
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
                          })).then(a, r)
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
        const o = n(i(139))
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
              anniversary: {
                config: (e) => ({
                  templateId: 'd-b5cc420efe514a31bef0e658747cf56d',
                  from: { email: 'suportegenesischurch@gmail.com', name: 'Genesis Church' },
                  to: e,
                }),
              },
            }),
              o.default.setApiKey(process.env.SENDGRID_API_KEY)
          }
          send(e) {
            return s(this, void 0, void 0, function* () {
              const t = e
              try {
                yield o.default.send(t)
              } catch (e) {
                throw new Error('Error in Sendgrid flow')
              }
            })
          }
        }
      },
      628: (e, t) => {
        var i
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.ImageKitFolders = void 0),
          ((i = t.ImageKitFolders || (t.ImageKitFolders = {})).Devotionals = 'devotionals'),
          (i.News = 'news'),
          (i.Events = 'events')
      },
      607: function (e, t, i) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = s(i(894)),
          o = s(i(860))
        new (class {
          constructor(e = (0, o.default)()) {
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
      146: (e) => {
        e.exports = require('date-fns')
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
      142: (e) => {
        e.exports = require('google-photos-album-image-url-fetch')
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
      285: (e) => {
        e.exports = require('reading-time-estimator')
      },
      549: (e) => {
        e.exports = require('treblle')
      },
      113: (e) => {
        e.exports = require('crypto')
      },
    },
    t = {}
  !(function i(s) {
    var n = t[s]
    if (void 0 !== n) return n.exports
    var o = (t[s] = { exports: {} })
    return e[s].call(o.exports, o, o.exports, i), o.exports
  })(607)
})()
