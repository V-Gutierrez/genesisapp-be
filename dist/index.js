;(() => {
  'use strict'
  var e = {
      988: (e, t, i) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = new (i(524).PrismaClient)()
        t.default = n
      },
      315: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.TIMEZONE = void 0),
          (t.TIMEZONE = 'America/Sao_Paulo')
      },
      835: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const o = i(590),
          a = s(i(632)),
          r = s(i(20)),
          u = s(i(988)),
          d = s(i(448)),
          c = s(i(29)),
          l = s(i(686)),
          f = s(i(766)),
          h = s(i(344))
        t.default = class {
          static authenticate(e) {
            return n(this, void 0, void 0, function* () {
              e.post('/api/auth', (e, t) =>
                n(this, void 0, void 0, function* () {
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
                    const n = d.default.validateSchema(d.default.LOGIN_SCHEMA, e.body)
                    if (n) return t.status(400).json({ message: n })
                    const { email: s, password: c } = e.body,
                      f = yield l.default.getUserByEmail(s)
                    if (!f) return t.status(404).json({ message: o.Errors.USER_NOT_FOUND })
                    if (!f.active) return t.status(403).json({ message: o.Errors.USER_NOT_ACTIVE })
                    if (yield a.default.comparePassword(c, f.password)) {
                      const e = {
                          email: f.email,
                          role: f.role,
                          id: f.id,
                          name: f.name,
                          region: f.region,
                        },
                        i = h.default.sign(e, process.env.ACCESS_TOKEN_SECRET, {
                          expiresIn: '12h',
                        }),
                        n = h.default.sign(e, process.env.REFRESH_TOKEN_SECRET, {
                          expiresIn: '30d',
                        })
                      return (
                        yield u.default.userRefreshTokens.upsert({
                          where: { userId: f.id },
                          update: { token: n },
                          create: { userId: f.id, token: n },
                        }),
                        t.cookie(
                          r.default.AuthCookieDefaultOptions.name,
                          i,
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
            return n(this, void 0, void 0, function* () {
              e.get('/api/auth', (e, t) =>
                n(this, void 0, void 0, function* () {
                  try {
                    const { [r.default.AuthCookieDefaultOptions.name]: i } = e.cookies
                    h.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, i) =>
                      n(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie(
                              r.default.AuthCookieDefaultOptions.name,
                              r.default.AuthCookieDefaultOptions.config,
                            ),
                            t.status(403).json({ message: o.Errors.NO_AUTH })
                          )
                        const s = yield l.default.getUserByDecodedEmail(i.email)
                        if (!s)
                          return (
                            t.clearCookie('jwt', {
                              httpOnly: !0,
                              secure: f.default,
                              sameSite: f.default ? 'none' : void 0,
                            }),
                            t.status(403).json({ message: o.Errors.NO_AUTH })
                          )
                        const { UserRefreshTokens: a, id: d } = s,
                          [{ token: c }] = a
                        h.default.verify(c, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          n(this, void 0, void 0, function* () {
                            if (e)
                              return (
                                yield u.default.userRefreshTokens.delete({ where: { userId: d } }),
                                t.clearCookie(
                                  r.default.AuthCookieDefaultOptions.name,
                                  r.default.AuthCookieDefaultOptions.config,
                                ),
                                t.status(403).json({ message: o.Errors.NO_AUTH })
                              )
                            const i = h.default.sign(
                              { email: s.email, role: s.role, id: s.id, region: s.region },
                              process.env.ACCESS_TOKEN_SECRET,
                              { expiresIn: '12h' },
                            )
                            t.cookie(
                              r.default.AuthCookieDefaultOptions.name,
                              i,
                              r.default.AuthCookieDefaultOptions.config,
                            ),
                              t.status(200).json({ message: o.Success.LOGIN })
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
            return n(this, void 0, void 0, function* () {
              e.post('/api/auth/activate', (e, t) =>
                n(this, void 0, void 0, function* () {
                  try {
                    if (!e.headers.authorization)
                      return t.status(401).json({ message: o.Errors.NO_AUTH })
                    const { authorization: i } = e.headers
                    h.default.verify(i, process.env.ACTIVATION_TOKEN_SECRET, (e, i) =>
                      n(this, void 0, void 0, function* () {
                        return e
                          ? t.status(401).json({ message: o.Errors.NO_AUTH })
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
            return n(this, void 0, void 0, function* () {
              e.post('/api/auth/reset-password', (e, t) =>
                n(this, void 0, void 0, function* () {
                  try {
                    const i = d.default.validateSchema(d.default.RESET_PASSWORD, e.body)
                    if (i) return t.status(400).json({ message: i })
                    const { email: n } = e.body,
                      s = yield l.default.getUserByEmail(n)
                    if (!s || !s.active)
                      return t.status(200).json({ message: o.Success.RESET_EMAIL_SEND })
                    const a = h.default.sign(
                      { email: n },
                      process.env.PASSWORD_RESET_TOKEN_SECRET,
                      { expiresIn: '24h' },
                    )
                    if (f.default) {
                      const e = new c.default()
                      yield e.send(
                        e.TEMPLATES.resetPassword.config(n, {
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
            return n(this, void 0, void 0, function* () {
              e.put('/api/auth/reset-password', (e, t) =>
                n(this, void 0, void 0, function* () {
                  const i = e.headers.authorization
                  try {
                    const s = d.default.validateSchema(d.default.NEW_PASSWORD, e.body)
                    if (s || !i) return t.status(400).json({ message: o.Errors.NO_AUTH, error: s })
                    const { password: a } = e.body
                    h.default.verify(i, process.env.PASSWORD_RESET_TOKEN_SECRET, (e, i) =>
                      n(this, void 0, void 0, function* () {
                        return e
                          ? t.status(401).json({ message: o.Errors.NO_AUTH })
                          : (yield l.default.setUserPasswordByEmail(i.email, a),
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
            return n(this, void 0, void 0, function* () {
              e.delete('/api/auth', (e, t) =>
                n(this, void 0, void 0, function* () {
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
            return n(this, void 0, void 0, function* () {
              e.get('/api/auth/me', (e, t) =>
                n(this, void 0, void 0, function* () {
                  var i
                  try {
                    const {
                      email: n,
                      role: s,
                      id: o,
                      name: a,
                      region: r,
                    } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                    return t.status(200).json({ email: n, role: s, id: o, name: a, region: r })
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = i(590)
        i(81)
        const a = s(i(860)),
          r = s(i(20)),
          u = s(i(710)),
          d = s(i(582)),
          c = s(i(766)),
          l = s(i(344)),
          f = s(i(470)),
          h = s(i(738)),
          v = i(549)
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.app.use(a.default.json()),
              this.app.use((0, u.default)()),
              this.app.use(a.default.urlencoded({ extended: !1 })),
              this.app.use((0, f.default)('short')),
              this.TrebbleDocs(this.app),
              this.UserContext(this.app)
          }
          CORS() {
            const e = c.default ? [] : ['http://localhost:3000', 'http://192.168.0.56:3000']
            this.app.use(
              (0, d.default)({ credentials: !0, origin: [process.env.FRONT_BASE_URL, ...e] }),
            )
          }
          TrebbleDocs(e) {
            c.default &&
              (0, v.useTreblle)(e, {
                apiKey: process.env.TREBBLE_DOCS_API,
                projectId: process.env.TREBBLE_DOCS_PID,
              })
          }
          UserContext(e) {
            e.use((e, t, i) =>
              n(this, void 0, void 0, function* () {
                try {
                  const { [r.default.AuthCookieDefaultOptions.name]: t } = e.cookies
                  l.default.verify(t, process.env.ACCESS_TOKEN_SECRET, (t, n) => {
                    ;(e.cookies.user = t ? null : n), i()
                  })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static JWT(e) {
            e.use((e, t, i) =>
              n(this, void 0, void 0, function* () {
                try {
                  const { [r.default.AuthCookieDefaultOptions.name]: n } = e.cookies
                  l.default.verify(n, process.env.ACCESS_TOKEN_SECRET, (e) => {
                    if (e) return t.status(403).json({ message: o.Errors.NO_AUTH })
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
              n(this, void 0, void 0, function* () {
                try {
                  const { [r.default.AuthCookieDefaultOptions.name]: n } = e.cookies
                  l.default.verify(n, process.env.ACCESS_TOKEN_SECRET, (e, n) =>
                    e
                      ? t.status(403).json({ message: o.Errors.NO_AUTH })
                      : 'ADMIN' !== n.role
                      ? t.status(401).json({ message: o.Errors.NO_AUTH })
                      : void i(),
                  )
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static SingleFileUpload(e) {
            return (0, h.default)({ limits: { fileSize: 2e6 } }).single(e)
          }
        }
      },
      116: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(362)),
          a = s(i(721)),
          r = s(i(832)),
          u = s(i(488)),
          d = s(i(448)),
          c = i(465),
          l = i(315),
          f = i(590),
          h = i(628)
        t.default = class {
          static getDevotionals(e) {
            e.get('/api/devotionals', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                const { region: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                try {
                  const e = yield o.default.getReleasedDevotionals(n)
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getDevotionalBySlug(e) {
            e.get('/api/devotionals/:slug', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                try {
                  const { slug: n } = e.params,
                    { id: s, region: a } = null !== (i = e.cookies.user) && void 0 !== i ? i : {},
                    r = yield o.default.getBySlug(n, a)
                  return r
                    ? (yield o.default.view(r.id, s), t.status(200).json(r))
                    : t.status(404).json({ message: f.Errors.RESOURCE_NOT_FOUND })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getDevotionalsAsAdmin(e) {
            e.get('/api/all-devotionals', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                const { region: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                try {
                  const e = yield o.default.getAll(n)
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static createDevotional(e) {
            e.post('/api/devotionals', u.default.SingleFileUpload('coverImage'), (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                try {
                  const n = d.default.validateSchema(d.default.DEVOTIONAL_CREATION, e.body)
                  if (n) return t.status(400).json({ message: n })
                  if (!e.file) return t.status(400).json({ message: 'coverImage is missing' })
                  const { body: s, title: u, scheduledTo: f, author: v } = e.body,
                    { file: p } = e,
                    { region: g } = null !== (i = e.cookies.user) && void 0 !== i ? i : {},
                    {
                      url: _,
                      thumbnailUrl: m,
                      fileId: E,
                    } = yield r.default.uploadFile(
                      p.buffer,
                      a.default.generateSlug(u),
                      h.ImageKitFolders.Devotionals,
                    ),
                    y = yield o.default.create({
                      body: s,
                      title: u,
                      scheduledTo: (0, c.zonedTimeToUtc)(new Date(f), l.TIMEZONE),
                      author: v,
                      slug: a.default.generateSlug(u),
                      coverImage: _,
                      coverThumbnail: m,
                      assetId: E,
                      region: g,
                    })
                  return t.status(201).json(y)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteDevotional(e) {
            e.delete('/api/devotionals/:id', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const { id: i } = e.params,
                    n = yield o.default.deleteById(i)
                  yield r.default.delete(n.assetId),
                    t.status(200).json({ message: f.Success.RESOURCE_DELETED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static like(e) {
            e.post('/api/devotionals/:id/like', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                try {
                  const { id: n } = e.params,
                    { id: s } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                  yield o.default.like(n, s),
                    t.status(201).json({ status: f.Success.RESOURCE_CREATED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      489: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(44)),
          a = s(i(448)),
          r = s(i(488)),
          u = s(i(721)),
          d = s(i(832)),
          c = i(628),
          l = i(315),
          f = i(465),
          h = i(590)
        t.default = class {
          static getEvents(e) {
            e.get('/api/events', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                const { region: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                try {
                  const e = yield o.default.getReleasedEvents(n)
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getEventById(e) {
            e.get('/api/events/:id', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                const { region: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                try {
                  const { id: i } = e.params,
                    s = yield o.default.getEventById(i, n)
                  t.status(200).json(s)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static createEvent(e) {
            e.post('/api/events', r.default.SingleFileUpload('coverImage'), (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                try {
                  const n = a.default.validateSchema(a.default.EVENTS_CREATION, e.body)
                  if (n) return t.status(400).json({ message: n })
                  if (!e.file) return t.status(400).json({ message: 'coverImage is missing' })
                  const { region: s } = null !== (i = e.cookies.user) && void 0 !== i ? i : {},
                    {
                      title: r,
                      subscriptionsScheduledTo: h,
                      subscriptionsDueDate: v,
                      eventDate: p,
                      maxSlots: g,
                      description: _,
                    } = e.body,
                    { file: m } = e,
                    {
                      url: E,
                      thumbnailUrl: y,
                      fileId: w,
                    } = yield d.default.uploadFile(
                      m.buffer,
                      u.default.generateSlug(r),
                      c.ImageKitFolders.Events,
                    ),
                    S = yield o.default.create({
                      title: r,
                      subscriptionsScheduledTo: (0, f.zonedTimeToUtc)(new Date(h), l.TIMEZONE),
                      subscriptionsDueDate: (0, f.zonedTimeToUtc)(new Date(v), l.TIMEZONE),
                      eventDate: (0, f.zonedTimeToUtc)(new Date(p), l.TIMEZONE),
                      description: _,
                      maxSlots: Number(g),
                      coverImage: E,
                      coverThumbnail: y,
                      assetId: w,
                      region: s,
                    })
                  return t.status(201).json(S)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteEvent(e) {
            e.delete('/api/events/:id', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const { id: i } = e.params,
                    n = yield o.default.deleteById(i)
                  yield d.default.delete(n.assetId),
                    t.status(200).json({ message: h.Success.RESOURCE_DELETED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getEventsAsAdmin(e) {
            e.get('/api/all-events', (e, t) =>
              n(this, void 0, void 0, function* () {
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
              n(this, void 0, void 0, function* () {
                var i
                try {
                  const n = a.default.validateSchema(a.default.EVENTS_SUBSCRIPTION, e.body)
                  if (n) return t.status(400).json({ message: n })
                  const { id: s } = e.params,
                    { userName: r, userEmail: u, userPhone: d } = e.body,
                    { region: c } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                  yield o.default.subscribeUserToEvent(
                    { userName: r, userEmail: u, userPhone: d },
                    s,
                    c,
                  ),
                    t.status(201).json({ message: h.Success.SUBSCRIPTION_CREATED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteSubscription(e) {
            e.delete('/api/events/subscriptions/:id', (e, t) =>
              n(this, void 0, void 0, function* () {
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(882))
        t.default = class {
          static getGrowthGroups(e) {
            return n(this, void 0, void 0, function* () {
              e.get('/api/growthgroups', (e, t) =>
                n(this, void 0, void 0, function* () {
                  var i
                  const { region: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                  try {
                    const e = yield o.default.getAll(n)
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(230))
        t.default = class {
          static getGooglePhotosAlbumPhotos(e) {
            e.get('/api/integrations/googlephotos', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const { albumUrl: i } = e.query,
                    n = yield o.default.fetchImagesByAlbumUrl(i)
                  return t.status(200).json(n)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      145: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(721)),
          a = i(628),
          r = s(i(832)),
          u = s(i(488)),
          d = s(i(168)),
          c = s(i(448)),
          l = i(465),
          f = i(315),
          h = i(590)
        t.default = class {
          static createNews(e) {
            e.post('/api/news', u.default.SingleFileUpload('coverImage'), (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                try {
                  const n = c.default.validateSchema(c.default.NEWS_CREATION, e.body)
                  if (n) return t.status(400).json({ message: n })
                  if (!e.file) return t.status(400).json({ message: 'coverImage is missing' })
                  const { body: s, title: u, scheduledTo: h, highlightText: v } = e.body,
                    { file: p } = e,
                    { region: g } = null !== (i = e.cookies.user) && void 0 !== i ? i : {},
                    {
                      url: _,
                      thumbnailUrl: m,
                      fileId: E,
                    } = yield r.default.uploadFile(
                      p.buffer,
                      o.default.generateSlug(u),
                      a.ImageKitFolders.News,
                    ),
                    y = yield d.default.create({
                      body: s,
                      title: u,
                      scheduledTo: (0, l.zonedTimeToUtc)(new Date(h), f.TIMEZONE),
                      coverImage: _,
                      coverThumbnail: m,
                      slug: o.default.generateSlug(u),
                      assetId: E,
                      highlightText: v,
                      region: g,
                    })
                  return t.status(201).json(y)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteNews(e) {
            e.delete('/api/news/:id', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const { id: i } = e.params,
                    n = yield d.default.deleteById(i)
                  yield r.default.delete(n.assetId),
                    t.status(200).json({ message: h.Success.RESOURCE_DELETED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getNewsAsAdmin(e) {
            e.get('/api/all-news', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                const { region: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                try {
                  const e = yield d.default.getAll(n)
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getNews(e) {
            e.get('/api/news', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                const { region: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                try {
                  const e = yield d.default.getReleasedNews(n)
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getNewsBySlug(e) {
            e.get('/api/news/:slug', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                try {
                  const { slug: n } = e.params,
                    { id: s, region: o } = null !== (i = e.cookies.user) && void 0 !== i ? i : {},
                    a = yield d.default.getBySlug(n, o)
                  return a
                    ? (yield d.default.view(a.id, s), t.status(200).json(a))
                    : t.status(404).json({ message: h.Errors.RESOURCE_NOT_FOUND })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static like(e) {
            e.post('/api/news/:id/like', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                try {
                  const { id: n } = e.params,
                    { id: s } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                  yield d.default.like(n, s),
                    t.status(201).json({ message: h.Success.RESOURCE_CREATED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      599: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(131))
        t.default = class {
          static getRegions(e) {
            e.get('/api/regions', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const e = yield o.default.fetchAll()
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      673: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(454))
        t.default = class {
          static getStats(e) {
            e.get('/api/stats', (e, t) =>
              n(this, void 0, void 0, function* () {
                var i
                const { region: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                try {
                  const {
                    devotionals: e,
                    activeUsers: i,
                    growthGroups: s,
                    news: a,
                    ongoingEvents: r,
                  } = yield o.default.getStats(n)
                  return t
                    .status(200)
                    .json({
                      activeUsers: i,
                      devotionals: e,
                      growthGroups: s,
                      news: a,
                      ongoingEvents: r,
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const o = i(590),
          a = s(i(632)),
          r = s(i(721)),
          u = s(i(448)),
          d = s(i(29)),
          c = s(i(686)),
          l = s(i(344))
        t.default = class {
          static get(e) {
            return n(this, void 0, void 0, function* () {
              e.get('/api/users/:id', (e, t) =>
                n(this, void 0, void 0, function* () {
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
            return n(this, void 0, void 0, function* () {
              e.post('/api/users', (e, t) =>
                n(this, void 0, void 0, function* () {
                  try {
                    const i = u.default.validateSchema(u.default.SIGNUP_SCHEMA, e.body)
                    if (i) return t.status(400).json({ message: i })
                    const {
                        email: n,
                        name: s,
                        password: f,
                        phone: h,
                        birthdate: v,
                        region: p,
                      } = e.body,
                      g = yield c.default.create({
                        email: r.default.sanitizeEmail(n),
                        name: s,
                        birthdate: new Date(v).toISOString(),
                        password: yield a.default.hashPassword(f),
                        phone: h,
                        region: p,
                      }),
                      _ = l.default.sign({ id: g.id }, process.env.ACTIVATION_TOKEN_SECRET, {
                        expiresIn: '30d',
                      }),
                      m = new d.default()
                    yield m.send(
                      m.TEMPLATES.confirmationEmail.config(g.email, {
                        userFirstName: r.default.getUserFirstName(g.name),
                        activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${_}`,
                      }),
                    ),
                      t.status(201).json({ message: o.Success.USER_CREATED, user: g })
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
            return n(this, void 0, void 0, function* () {
              e.get('/api/users', (e, t) =>
                n(this, void 0, void 0, function* () {
                  var i
                  const { region: n } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                  try {
                    const e = yield c.default.getAll(n)
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
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, n) {
                  void 0 === n && (n = i)
                  var s = Object.getOwnPropertyDescriptor(t, i)
                  ;(s && !('get' in s ? !t.__esModule : s.writable || s.configurable)) ||
                    (s = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, n, s)
                }
              : function (e, t, i, n) {
                  void 0 === n && (n = i), (e[n] = t[i])
                }),
          s =
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
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && n(t, e, i)
              return s(t, e), t
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
        var n =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = n(i(766))
        class o {}
        ;(t.default = o),
          (o.AuthCookieDefaultOptions = {
            name: 'jwt',
            config: {
              httpOnly: !0,
              secure: s.default,
              sameSite: s.default ? 'none' : void 0,
              maxAge: 2592e6,
            },
          })
      },
      766: (e, t, i) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81), (t.default = !0)
      },
      721: function (e, t, i) {
        var n =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = n(i(113))
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
            s.default.createHash('md5', { outputLength: 16 }).update(e).digest('hex')),
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
            NO_AUTH: 'Credenciais inválidas',
            RESOURCE_NOT_FOUND: 'Recurso não encontrado',
          }),
          (t.Success = {
            USER_CREATED: 'Usuário criado com sucesso. Verifique seu email para ativar sua conta',
            RESET_EMAIL_SEND: 'Email de redefinição de senha enviado com sucesso',
            NEW_PASSWORD_SET: 'Nova senha configurada com sucesso',
            USER_ACTIVATED: 'Usuário ativado com sucesso',
            RESOURCE_CREATED: 'Recurso criado',
            RESOURCE_DELETED: 'Recurso deletado',
            LOGOUT: 'Usuário deslogado com sucesso',
            SUBSCRIPTION_CREATED: 'Inscrição realizada',
            LOGIN: 'Usuário logado com sucesso',
          })
      },
      448: function (e, t, i) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, n) {
                  void 0 === n && (n = i)
                  var s = Object.getOwnPropertyDescriptor(t, i)
                  ;(s && !('get' in s ? !t.__esModule : s.writable || s.configurable)) ||
                    (s = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, n, s)
                }
              : function (e, t, i, n) {
                  void 0 === n && (n = i), (e[n] = t[i])
                }),
          s =
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
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && n(t, e, i)
              return s(t, e), t
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
            const n = i.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return r.mergeAll(n)
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
          region: u.default.string().required(),
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(988)),
          a = i(285),
          r = i(465),
          u = i(315)
        t.default = new (class {
          getReleasedDevotionals(e) {
            return n(this, void 0, void 0, function* () {
              return o.default.devotional.findMany({
                where: {
                  scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(), u.TIMEZONE) },
                  region: e,
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getBySlug(e, t) {
            return n(this, void 0, void 0, function* () {
              return o.default.devotional.findFirst({
                where: {
                  slug: e,
                  scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(Date.now()), u.TIMEZONE) },
                  region: t,
                },
                orderBy: { scheduledTo: 'desc' },
                include: { DevotionalLikes: !0, DevotionalViews: !0 },
              })
            })
          }
          getById(e, t) {
            return n(this, void 0, void 0, function* () {
              return o.default.devotional.findFirst({
                where: {
                  id: e,
                  scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(Date.now()), u.TIMEZONE) },
                  region: t,
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getAll(e) {
            return n(this, void 0, void 0, function* () {
              return o.default.devotional.findMany({
                where: { region: e },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          create(e) {
            return n(this, void 0, void 0, function* () {
              const t = (0, a.readingTime)(e.body, 120).minutes
              return o.default.devotional.create({
                data: Object.assign(Object.assign({}, e), { readingTimeInMinutes: t }),
              })
            })
          }
          deleteById(e) {
            return n(this, void 0, void 0, function* () {
              return o.default.devotional.delete({ where: { id: e } })
            })
          }
          like(e, t) {
            return n(this, void 0, void 0, function* () {
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
            return n(this, void 0, void 0, function* () {
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = i(315),
          a = s(i(988)),
          r = i(465),
          u = i(146)
        t.default = new (class {
          getAll() {
            return n(this, void 0, void 0, function* () {
              return a.default.events.findMany({
                orderBy: { subscriptionsScheduledTo: 'desc' },
                include: {
                  _count: { select: { EventsSubscriptions: !0 } },
                  EventsSubscriptions: !0,
                },
              })
            })
          }
          getReleasedEvents(e) {
            return n(this, void 0, void 0, function* () {
              return a.default.events.findMany({
                where: {
                  subscriptionsScheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE) },
                  eventDate: { gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE) },
                  subscriptionsDueDate: { gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE) },
                  region: e,
                },
                include: { _count: { select: { EventsSubscriptions: !0 } } },
                orderBy: { subscriptionsScheduledTo: 'desc' },
              })
            })
          }
          create(e) {
            return n(this, void 0, void 0, function* () {
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
            return n(this, void 0, void 0, function* () {
              return a.default.events.delete({ where: { id: e } })
            })
          }
          getEventById(e, t) {
            return n(this, void 0, void 0, function* () {
              return a.default.events.findFirst({
                where: {
                  id: e,
                  eventDate: { gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE) },
                  subscriptionsDueDate: { gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE) },
                  region: t,
                },
                include: { _count: { select: { EventsSubscriptions: !0 } } },
              })
            })
          }
          subscribeUserToEvent(e, t, i) {
            return n(this, void 0, void 0, function* () {
              const n = yield this.getEventById(t, i)
              if (!n) throw new Error(`No available event found for ${t}`)
              const { maxSlots: s } = n,
                { EventsSubscriptions: o } = n._count
              o < s &&
                (yield a.default.eventsSubscriptions.create({
                  data: Object.assign(Object.assign({}, e), { Event: { connect: { id: t } } }),
                }))
            })
          }
          removeSubscriptionById(e) {
            return n(this, void 0, void 0, function* () {
              yield a.default.eventsSubscriptions.delete({ where: { id: e } })
            })
          }
        })()
      },
      882: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(988))
        t.default = new (class {
          getAll(e) {
            return n(this, void 0, void 0, function* () {
              return o.default.growthGroup.findMany({ where: { region: e } })
            })
          }
        })()
      },
      168: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(988)),
          a = i(315),
          r = i(465)
        t.default = new (class {
          create(e) {
            return n(this, void 0, void 0, function* () {
              return o.default.news.create({ data: e })
            })
          }
          deleteById(e) {
            return n(this, void 0, void 0, function* () {
              return o.default.news.delete({ where: { id: e } })
            })
          }
          getBySlug(e, t) {
            return n(this, void 0, void 0, function* () {
              return o.default.news.findFirst({
                where: {
                  slug: e,
                  scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(Date.now()), a.TIMEZONE) },
                  region: t,
                },
                orderBy: { scheduledTo: 'desc' },
                include: { NewsLikes: !0, NewsViews: !0 },
              })
            })
          }
          getReleasedNews(e) {
            return n(this, void 0, void 0, function* () {
              return o.default.news.findMany({
                where: {
                  scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(), a.TIMEZONE) },
                  region: e,
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getAll(e) {
            return n(this, void 0, void 0, function* () {
              return o.default.news.findMany({
                orderBy: { scheduledTo: 'desc' },
                where: { region: e },
              })
            })
          }
          like(e, t) {
            return n(this, void 0, void 0, function* () {
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
            return n(this, void 0, void 0, function* () {
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
      131: function (e, t, i) {
        var n =
          (this && this.__awaiter) ||
          function (e, t, i, n) {
            return new (i || (i = Promise))(function (s, o) {
              function a(e) {
                try {
                  u(n.next(e))
                } catch (e) {
                  o(e)
                }
              }
              function r(e) {
                try {
                  u(n.throw(e))
                } catch (e) {
                  o(e)
                }
              }
              function u(e) {
                var t
                e.done
                  ? s(e.value)
                  : ((t = e.value),
                    t instanceof i
                      ? t
                      : new i(function (e) {
                          e(t)
                        })).then(a, r)
              }
              u((n = n.apply(e, t || [])).next())
            })
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(524)
        t.default = new (class {
          translateRegion(e) {
            return e === s.Region.AEP
              ? 'Buenos Aires'
              : e === s.Region.FEC
              ? 'Feira de Santana'
              : '-'
          }
          fetchAll() {
            return n(this, void 0, void 0, function* () {
              return Object.entries(s.Region).map(([e, t]) => ({
                regionKey: e,
                regionTitle: this.translateRegion(t),
              }))
            })
          }
        })()
      },
      454: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(988)),
          a = i(315),
          r = i(465)
        t.default = new (class {
          getStats(e) {
            return n(this, void 0, void 0, function* () {
              const t = [
                  o.default.user.count({ where: { active: !0 } }),
                  o.default.devotional.count({ where: { region: e } }),
                  o.default.growthGroup.count({ where: { region: e } }),
                  o.default.news.count({ where: { region: e } }),
                  o.default.events.count({
                    where: {
                      subscriptionsScheduledTo: {
                        lte: (0, r.zonedTimeToUtc)(new Date(), a.TIMEZONE),
                      },
                      eventDate: { gte: (0, r.zonedTimeToUtc)(new Date(), a.TIMEZONE) },
                      subscriptionsDueDate: { gte: (0, r.zonedTimeToUtc)(new Date(), a.TIMEZONE) },
                      region: e,
                    },
                  }),
                ],
                [i, n, s, u, d] = yield Promise.all(t)
              return { activeUsers: i, devotionals: n, growthGroups: s, news: u, ongoingEvents: d }
            })
          }
        })()
      },
      686: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(i(632)),
          a = s(i(988))
        t.default = new (class {
          getUserById(e) {
            return n(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { id: e },
                select: { id: !0, email: !0, name: !0, createdAt: !0, birthdate: !0 },
              })
            })
          }
          getAll(e) {
            return n(this, void 0, void 0, function* () {
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
                where: { region: e },
              })
            })
          }
          create(e) {
            return n(this, void 0, void 0, function* () {
              return a.default.user.create({
                data: e,
                select: { id: !0, email: !0, name: !0, createdAt: !0, phone: !0, password: !1 },
              })
            })
          }
          getUserByEmail(e) {
            return n(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { email: e },
                select: {
                  name: !0,
                  password: !0,
                  email: !0,
                  id: !0,
                  role: !0,
                  active: !0,
                  region: !0,
                },
              })
            })
          }
          getUserByDecodedEmail(e) {
            return n(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { email: e },
                select: { id: !0, email: !0, role: !0, region: !0, UserRefreshTokens: !0 },
              })
            })
          }
          activateUserById(e) {
            return n(this, void 0, void 0, function* () {
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
            return n(this, void 0, void 0, function* () {
              yield a.default.user.update({
                where: { email: e },
                data: { password: yield o.default.hashPassword(t) },
              })
            })
          }
        })()
      },
      894: function (e, t, i) {
        var n =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = n(i(835)),
          o = n(i(116)),
          a = n(i(334)),
          r = n(i(539)),
          u = n(i(488)),
          d = n(i(145)),
          c = n(i(673)),
          l = n(i(785)),
          f = n(i(489)),
          h = n(i(599))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new u.default(this.app),
              s.default.authenticate(this.app),
              s.default.refreshToken(this.app),
              s.default.activateNewUser(this.app),
              s.default.resetPassword(this.app),
              s.default.setNewPassword(this.app),
              s.default.logout(this.app),
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
              h.default.getRegions(this.app),
              u.default.JWT(this.app),
              s.default.getUserInformation(this.app),
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
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, n) {
                  void 0 === n && (n = i)
                  var s = Object.getOwnPropertyDescriptor(t, i)
                  ;(s && !('get' in s ? !t.__esModule : s.writable || s.configurable)) ||
                    (s = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, n, s)
                }
              : function (e, t, i, n) {
                  void 0 === n && (n = i), (e[n] = t[i])
                }),
          s =
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
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && n(t, e, i)
              return s(t, e), t
            },
          a =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const o = s(i(386))
        class a {
          static InitializeInstance() {
            return n(this, void 0, void 0, function* () {
              return new o.default({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: process.env.IMAGEKIT_PROJECT_URL,
              })
            })
          }
          static uploadFile(e, t, i) {
            return n(this, void 0, void 0, function* () {
              try {
                return (yield a.InitializeInstance()).upload({ file: e, fileName: t, folder: i })
              } catch (e) {
                throw new Error('Error in ImageKitService')
              }
            })
          }
          static delete(e) {
            return n(this, void 0, void 0, function* () {
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof i
                        ? t
                        : new i(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const o = s(i(139))
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
            return n(this, void 0, void 0, function* () {
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
        var i, n
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.Region = t.ImageKitFolders = void 0),
          ((n = t.ImageKitFolders || (t.ImageKitFolders = {})).Devotionals = 'devotionals'),
          (n.News = 'news'),
          (n.Events = 'events'),
          ((i = t.Region || (t.Region = {})).AEP = 'AEP'),
          (i.FEC = 'FEC')
      },
      607: function (e, t, i) {
        var n =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = n(i(894)),
          o = n(i(860))
        new (class {
          constructor(e = (0, o.default)()) {
            ;(this.app = e), this.app.listen(process.env.PORT || 5e3, () => new s.default(e))
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
  !(function i(n) {
    var s = t[n]
    if (void 0 !== s) return s.exports
    var o = (t[n] = { exports: {} })
    return e[n].call(o.exports, o, o.exports, i), o.exports
  })(607)
})()
