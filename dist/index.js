;(() => {
  'use strict'
  var e = {
      988: (e, t, s) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = new (s(524).PrismaClient)()
        t.default = i
      },
      315: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.TIMEZONE = void 0),
          (t.TIMEZONE = 'America/Sao_Paulo')
      },
      835: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const o = s(590),
          a = n(s(632)),
          r = n(s(20)),
          u = n(s(988)),
          d = n(s(448)),
          c = n(s(29)),
          l = n(s(686)),
          f = n(s(766)),
          h = n(s(344))
        t.default = class {
          static authenticate(e) {
            return i(this, void 0, void 0, function* () {
              e.post('/api/auth', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    const { [r.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                    s &&
                      h.default.verify(e.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (e) => {
                        e &&
                          t.clearCookie(
                            r.default.AuthCookieDefaultOptions.name,
                            r.default.AuthCookieDefaultOptions.config,
                          )
                      })
                    const i = d.default.validateSchema(d.default.LOGIN_SCHEMA, e.body)
                    if (i) return t.status(400).json({ message: i })
                    const { email: n, password: c } = e.body,
                      f = yield l.default.getUserByEmail(n)
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
                        s = h.default.sign(e, process.env.ACCESS_TOKEN_SECRET, {
                          expiresIn: '12h',
                        }),
                        i = h.default.sign(e, process.env.REFRESH_TOKEN_SECRET, {
                          expiresIn: '30d',
                        })
                      return (
                        yield u.default.userRefreshTokens.upsert({
                          where: { userId: f.id },
                          update: { token: i },
                          create: { userId: f.id, token: i },
                        }),
                        t.cookie(
                          r.default.AuthCookieDefaultOptions.name,
                          s,
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
            return i(this, void 0, void 0, function* () {
              e.get('/api/auth', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    const { [r.default.AuthCookieDefaultOptions.name]: s } = e.cookies
                    h.default.verify(s, process.env.ACCESS_TOKEN_SECRET, (e, s) =>
                      i(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie(
                              r.default.AuthCookieDefaultOptions.name,
                              r.default.AuthCookieDefaultOptions.config,
                            ),
                            t.status(403).json({ message: o.Errors.NO_AUTH })
                          )
                        const n = yield l.default.getUserByDecodedEmail(s.email)
                        if (!n)
                          return (
                            t.clearCookie('jwt', {
                              httpOnly: !0,
                              secure: f.default,
                              sameSite: f.default ? 'none' : void 0,
                            }),
                            t.status(403).json({ message: o.Errors.NO_AUTH })
                          )
                        const { UserRefreshTokens: a, id: d } = n,
                          [{ token: c }] = a
                        h.default.verify(c, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          i(this, void 0, void 0, function* () {
                            if (e)
                              return (
                                yield u.default.userRefreshTokens.delete({ where: { userId: d } }),
                                t.clearCookie(
                                  r.default.AuthCookieDefaultOptions.name,
                                  r.default.AuthCookieDefaultOptions.config,
                                ),
                                t.status(403).json({ message: o.Errors.NO_AUTH })
                              )
                            const s = h.default.sign(
                              { email: n.email, role: n.role, id: n.id, region: n.region },
                              process.env.ACCESS_TOKEN_SECRET,
                              { expiresIn: '12h' },
                            )
                            t.cookie(
                              r.default.AuthCookieDefaultOptions.name,
                              s,
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
            return i(this, void 0, void 0, function* () {
              e.post('/api/auth/activate', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    if (!e.headers.authorization)
                      return t.status(401).json({ message: o.Errors.NO_AUTH })
                    const { authorization: s } = e.headers
                    h.default.verify(s, process.env.ACTIVATION_TOKEN_SECRET, (e, s) =>
                      i(this, void 0, void 0, function* () {
                        return e
                          ? t.status(401).json({ message: o.Errors.NO_AUTH })
                          : (yield l.default.activateUserById(s.id),
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
            return i(this, void 0, void 0, function* () {
              e.post('/api/auth/reset-password', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    const s = d.default.validateSchema(d.default.RESET_PASSWORD, e.body)
                    if (s) return t.status(400).json({ message: s })
                    const { email: i } = e.body,
                      n = yield l.default.getUserByEmail(i)
                    if (!n || !n.active)
                      return t.status(200).json({ message: o.Success.RESET_EMAIL_SEND })
                    const a = h.default.sign(
                      { email: i },
                      process.env.PASSWORD_RESET_TOKEN_SECRET,
                      { expiresIn: '24h' },
                    )
                    if (f.default) {
                      const e = new c.default()
                      yield e.send(
                        e.TEMPLATES.resetPassword.config(i, {
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
            return i(this, void 0, void 0, function* () {
              e.put('/api/auth/reset-password', (e, t) =>
                i(this, void 0, void 0, function* () {
                  const s = e.headers.authorization
                  try {
                    const n = d.default.validateSchema(d.default.NEW_PASSWORD, e.body)
                    if (n || !s) return t.status(400).json({ message: o.Errors.NO_AUTH, error: n })
                    const { password: a } = e.body
                    h.default.verify(s, process.env.PASSWORD_RESET_TOKEN_SECRET, (e, s) =>
                      i(this, void 0, void 0, function* () {
                        return e
                          ? t.status(401).json({ message: o.Errors.NO_AUTH })
                          : (yield l.default.setUserPasswordByEmail(s.email, a),
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
            return i(this, void 0, void 0, function* () {
              e.delete('/api/auth', (e, t) =>
                i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
              e.get('/api/auth/me', (e, t) =>
                i(this, void 0, void 0, function* () {
                  var s
                  try {
                    const {
                      email: i,
                      role: n,
                      id: o,
                      name: a,
                    } = null !== (s = e.cookies.user) && void 0 !== s ? s : {}
                    return t.status(200).json({ email: i, role: n, id: o, name: a })
                  } catch (e) {
                    return t.sendStatus(500)
                  }
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
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(590)
        s(81)
        const a = n(s(860)),
          r = n(s(20)),
          u = n(s(710)),
          d = n(s(582)),
          c = n(s(766)),
          l = n(s(344)),
          f = n(s(470)),
          h = n(s(738)),
          v = s(549)
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
            e.use((e, t, s) =>
              i(this, void 0, void 0, function* () {
                try {
                  const { [r.default.AuthCookieDefaultOptions.name]: t } = e.cookies
                  l.default.verify(t, process.env.ACCESS_TOKEN_SECRET, (t, i) => {
                    ;(e.cookies.user = t ? null : i), s()
                  })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static JWT(e) {
            e.use((e, t, s) =>
              i(this, void 0, void 0, function* () {
                try {
                  const { [r.default.AuthCookieDefaultOptions.name]: i } = e.cookies
                  l.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e) => {
                    if (e) return t.status(403).json({ message: o.Errors.NO_AUTH })
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
                  const { [r.default.AuthCookieDefaultOptions.name]: i } = e.cookies
                  l.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, i) =>
                    e
                      ? t.status(403).json({ message: o.Errors.NO_AUTH })
                      : 'ADMIN' !== i.role
                      ? t.status(401).json({ message: o.Errors.NO_AUTH })
                      : void s(),
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
      116: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(362)),
          a = n(s(721)),
          r = n(s(832)),
          u = n(s(488)),
          d = n(s(448)),
          c = s(465),
          l = s(315),
          f = s(590),
          h = s(628)
        t.default = class {
          static getDevotionals(e) {
            e.get('/api/devotionals', (e, t) =>
              i(this, void 0, void 0, function* () {
                var s
                const { region: i } = null !== (s = e.cookies.user) && void 0 !== s ? s : {}
                try {
                  const e = yield o.default.getReleasedDevotionals(i)
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getDevotionalBySlug(e) {
            e.get('/api/devotionals/:slug', (e, t) =>
              i(this, void 0, void 0, function* () {
                var s
                try {
                  const { slug: i } = e.params,
                    { id: n, region: a } = null !== (s = e.cookies.user) && void 0 !== s ? s : {},
                    r = yield o.default.getBySlug(i, a)
                  return r
                    ? (yield o.default.view(r.id, n), t.status(200).json(r))
                    : t.status(404).json({ message: f.Errors.RESOURCE_NOT_FOUND })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getDevotionalsAsAdmin(e) {
            e.get('/api/all-devotionals', (e, t) =>
              i(this, void 0, void 0, function* () {
                var s
                const { region: i } = null !== (s = e.cookies.user) && void 0 !== s ? s : {}
                try {
                  const e = yield o.default.getAll(i)
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static createDevotional(e) {
            e.post('/api/devotionals', u.default.SingleFileUpload('coverImage'), (e, t) =>
              i(this, void 0, void 0, function* () {
                var s
                try {
                  const i = d.default.validateSchema(d.default.DEVOTIONAL_CREATION, e.body)
                  if (i) return t.status(400).json({ message: i })
                  if (!e.file) return t.status(400).json({ message: 'coverImage is missing' })
                  const { body: n, title: u, scheduledTo: f, author: v } = e.body,
                    { file: p } = e,
                    { region: _ } = null !== (s = e.cookies.user) && void 0 !== s ? s : {},
                    {
                      url: g,
                      thumbnailUrl: m,
                      fileId: E,
                    } = yield r.default.uploadFile(
                      p.buffer,
                      a.default.generateSlug(u),
                      h.ImageKitFolders.Devotionals,
                    ),
                    y = yield o.default.create({
                      body: n,
                      title: u,
                      scheduledTo: (0, c.zonedTimeToUtc)(new Date(f), l.TIMEZONE),
                      author: v,
                      slug: a.default.generateSlug(u),
                      coverImage: g,
                      coverThumbnail: m,
                      assetId: E,
                      region: _,
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
              i(this, void 0, void 0, function* () {
                try {
                  const { id: s } = e.params,
                    i = yield o.default.deleteById(s)
                  yield r.default.delete(i.assetId),
                    t.status(200).json({ message: f.Success.RESOURCE_DELETED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static like(e) {
            e.post('/api/devotionals/:id/like', (e, t) =>
              i(this, void 0, void 0, function* () {
                var s
                try {
                  const { id: i } = e.params,
                    { id: n } = null !== (s = e.cookies.user) && void 0 !== s ? s : {}
                  yield o.default.like(i, n),
                    t.status(201).json({ status: f.Success.RESOURCE_CREATED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      489: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(44)),
          a = n(s(448)),
          r = n(s(488)),
          u = n(s(721)),
          d = n(s(832)),
          c = s(628),
          l = s(315),
          f = s(465),
          h = s(590)
        t.default = class {
          static getEvents(e) {
            e.get('/api/events', (e, t) =>
              i(this, void 0, void 0, function* () {
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
              i(this, void 0, void 0, function* () {
                try {
                  const { id: s } = e.params,
                    i = yield o.default.getEventById(s)
                  t.status(200).json(i)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static createEvent(e) {
            e.post('/api/events', r.default.SingleFileUpload('coverImage'), (e, t) =>
              i(this, void 0, void 0, function* () {
                try {
                  const s = a.default.validateSchema(a.default.EVENTS_CREATION, e.body)
                  if (s) return t.status(400).json({ message: s })
                  if (!e.file) return t.status(400).json({ message: 'coverImage is missing' })
                  const {
                      title: i,
                      subscriptionsScheduledTo: n,
                      subscriptionsDueDate: r,
                      eventDate: h,
                      maxSlots: v,
                      description: p,
                    } = e.body,
                    { file: _ } = e,
                    {
                      url: g,
                      thumbnailUrl: m,
                      fileId: E,
                    } = yield d.default.uploadFile(
                      _.buffer,
                      u.default.generateSlug(i),
                      c.ImageKitFolders.Events,
                    ),
                    y = yield o.default.create({
                      title: i,
                      subscriptionsScheduledTo: (0, f.zonedTimeToUtc)(new Date(n), l.TIMEZONE),
                      subscriptionsDueDate: (0, f.zonedTimeToUtc)(new Date(r), l.TIMEZONE),
                      eventDate: (0, f.zonedTimeToUtc)(new Date(h), l.TIMEZONE),
                      description: p,
                      maxSlots: Number(v),
                      coverImage: g,
                      coverThumbnail: m,
                      assetId: E,
                    })
                  return t.status(201).json(y)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteEvent(e) {
            e.delete('/api/events/:id', (e, t) =>
              i(this, void 0, void 0, function* () {
                try {
                  const { id: s } = e.params,
                    i = yield o.default.deleteById(s)
                  yield d.default.delete(i.assetId),
                    t.status(200).json({ message: h.Success.RESOURCE_DELETED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getEventsAsAdmin(e) {
            e.get('/api/all-events', (e, t) =>
              i(this, void 0, void 0, function* () {
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
              i(this, void 0, void 0, function* () {
                try {
                  const s = a.default.validateSchema(a.default.EVENTS_SUBSCRIPTION, e.body)
                  if (s) return t.status(400).json({ message: s })
                  const { id: i } = e.params,
                    { userName: n, userEmail: r, userPhone: u } = e.body
                  yield o.default.subscribeUserToEvent(
                    { userName: n, userEmail: r, userPhone: u },
                    i,
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
              i(this, void 0, void 0, function* () {
                try {
                  const { id: s } = e.params
                  yield o.default.removeSubscriptionById(s),
                    t.status(200).json({ message: h.Success.RESOURCE_DELETED })
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
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(882))
        t.default = class {
          static getGrowthGroups(e) {
            return i(this, void 0, void 0, function* () {
              e.get('/api/growthgroups', (e, t) =>
                i(this, void 0, void 0, function* () {
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
      539: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(230))
        t.default = class {
          static getGooglePhotosAlbumPhotos(e) {
            e.get('/api/integrations/googlephotos', (e, t) =>
              i(this, void 0, void 0, function* () {
                try {
                  const { albumUrl: s } = e.query,
                    i = yield o.default.fetchImagesByAlbumUrl(s)
                  return t.status(200).json(i)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      145: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(721)),
          a = s(628),
          r = n(s(832)),
          u = n(s(488)),
          d = n(s(168)),
          c = n(s(448)),
          l = s(465),
          f = s(315),
          h = s(590)
        t.default = class {
          static createNews(e) {
            e.post('/api/news', u.default.SingleFileUpload('coverImage'), (e, t) =>
              i(this, void 0, void 0, function* () {
                try {
                  const s = c.default.validateSchema(c.default.NEWS_CREATION, e.body)
                  if (s) return t.status(400).json({ message: s })
                  if (!e.file) return t.status(400).json({ message: 'coverImage is missing' })
                  const { body: i, title: n, scheduledTo: u, highlightText: h } = e.body,
                    { file: v } = e,
                    {
                      url: p,
                      thumbnailUrl: _,
                      fileId: g,
                    } = yield r.default.uploadFile(
                      v.buffer,
                      o.default.generateSlug(n),
                      a.ImageKitFolders.News,
                    ),
                    m = yield d.default.create({
                      body: i,
                      title: n,
                      scheduledTo: (0, l.zonedTimeToUtc)(new Date(u), f.TIMEZONE),
                      coverImage: p,
                      coverThumbnail: _,
                      slug: o.default.generateSlug(n),
                      assetId: g,
                      highlightText: h,
                    })
                  return t.status(201).json(m)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static deleteNews(e) {
            e.delete('/api/news/:id', (e, t) =>
              i(this, void 0, void 0, function* () {
                try {
                  const { id: s } = e.params,
                    i = yield d.default.deleteById(s)
                  yield r.default.delete(i.assetId),
                    t.status(200).json({ message: h.Success.RESOURCE_DELETED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getNewsAsAdmin(e) {
            e.get('/api/all-news', (e, t) =>
              i(this, void 0, void 0, function* () {
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
              i(this, void 0, void 0, function* () {
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
              i(this, void 0, void 0, function* () {
                var s
                try {
                  const { slug: i } = e.params,
                    { id: n } = null !== (s = e.cookies.user) && void 0 !== s ? s : {},
                    o = yield d.default.getBySlug(i)
                  return o
                    ? (yield d.default.view(o.id, n), t.status(200).json(o))
                    : t.status(404).json({ message: h.Errors.RESOURCE_NOT_FOUND })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static like(e) {
            e.post('/api/news/:id/like', (e, t) =>
              i(this, void 0, void 0, function* () {
                var s
                try {
                  const { id: i } = e.params,
                    { id: n } = null !== (s = e.cookies.user) && void 0 !== s ? s : {}
                  yield d.default.like(i, n),
                    t.status(201).json({ message: h.Success.RESOURCE_CREATED })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      673: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(454))
        t.default = class {
          static getStats(e) {
            e.get('/api/stats', (e, t) =>
              i(this, void 0, void 0, function* () {
                try {
                  const {
                    devotionals: e,
                    activeUsers: s,
                    growthGroups: i,
                    news: n,
                    ongoingEvents: a,
                  } = yield o.default.getStats()
                  return t
                    .status(200)
                    .json({
                      activeUsers: s,
                      devotionals: e,
                      growthGroups: i,
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
      785: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const o = s(590),
          a = n(s(632)),
          r = n(s(721)),
          u = n(s(448)),
          d = n(s(29)),
          c = n(s(686)),
          l = n(s(344))
        t.default = class {
          static get(e) {
            return i(this, void 0, void 0, function* () {
              e.get('/api/users/:id', (e, t) =>
                i(this, void 0, void 0, function* () {
                  const { id: s } = e.params
                  try {
                    if (s) {
                      const e = yield c.default.getUserById(s)
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
            return i(this, void 0, void 0, function* () {
              e.post('/api/users', (e, t) =>
                i(this, void 0, void 0, function* () {
                  try {
                    const s = u.default.validateSchema(u.default.SIGNUP_SCHEMA, e.body)
                    if (s) return t.status(400).json({ message: s })
                    const { email: i, name: n, password: f, phone: h, birthdate: v } = e.body,
                      p = yield c.default.create({
                        email: r.default.sanitizeEmail(i),
                        name: n,
                        birthdate: new Date(v).toISOString(),
                        password: yield a.default.hashPassword(f),
                        phone: h,
                      }),
                      _ = l.default.sign({ id: p.id }, process.env.ACTIVATION_TOKEN_SECRET, {
                        expiresIn: '30d',
                      }),
                      g = new d.default()
                    yield g.send(
                      g.TEMPLATES.confirmationEmail.config(p.email, {
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
            return i(this, void 0, void 0, function* () {
              e.get('/api/users', (e, t) =>
                i(this, void 0, void 0, function* () {
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
      632: function (e, t, s) {
        var i =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, i) {
                  void 0 === i && (i = s)
                  var n = Object.getOwnPropertyDescriptor(t, s)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, i, n)
                }
              : function (e, t, s, i) {
                  void 0 === i && (i = s), (e[i] = t[s])
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
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && i(t, e, s)
              return n(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const a = o(s(96))
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
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(s(766))
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
      766: (e, t, s) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81), (t.default = !0)
      },
      721: function (e, t, s) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(s(113))
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
      448: function (e, t, s) {
        var i =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, i) {
                  void 0 === i && (i = s)
                  var n = Object.getOwnPropertyDescriptor(t, s)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, i, n)
                }
              : function (e, t, s, i) {
                  void 0 === i && (i = s), (e[i] = t[s])
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
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && i(t, e, s)
              return n(t, e), t
            },
          a =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = o(s(634)),
          u = a(s(506))
        class d {
          static validateSchema(e, t) {
            const { error: s } = u.default.validate(t, e, { abortEarly: !1, convert: !1 })
            if (!s || !s.details) return
            const i = s.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
            return r.mergeAll(i)
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
      362: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(988)),
          a = s(285),
          r = s(465),
          u = s(315)
        t.default = new (class {
          getReleasedDevotionals(e) {
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
              return o.default.devotional.findMany({
                where: { region: e },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          create(e) {
            return i(this, void 0, void 0, function* () {
              const t = (0, a.readingTime)(e.body, 120).minutes
              return o.default.devotional.create({
                data: Object.assign(Object.assign({}, e), { readingTimeInMinutes: t }),
              })
            })
          }
          deleteById(e) {
            return i(this, void 0, void 0, function* () {
              return o.default.devotional.delete({ where: { id: e } })
            })
          }
          like(e, t) {
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
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
      44: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(315),
          a = n(s(988)),
          r = s(465),
          u = s(146)
        t.default = new (class {
          getAll() {
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
              try {
                const t =
                    (0, u.isAfter)(new Date(e.eventDate), new Date(e.subscriptionsDueDate)) &&
                    (0, u.isAfter)(new Date(e.eventDate), new Date(e.subscriptionsScheduledTo)),
                  s = (0, u.isAfter)(
                    new Date(e.subscriptionsDueDate),
                    new Date(e.subscriptionsScheduledTo),
                  )
                if (s && t) return a.default.events.create({ data: e })
                throw new Error(
                  `Cannot create event because of: isEventDateTheLaterDate : ${t}, isSubscriptionDueDateLaterThanSubscriptionScheduledDate: ${s}`,
                )
              } catch (e) {
                return console.log(e), null
              }
            })
          }
          deleteById(e) {
            return i(this, void 0, void 0, function* () {
              return a.default.events.delete({ where: { id: e } })
            })
          }
          getEventById(e) {
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
              const s = yield this.getEventById(t)
              if (!s) throw new Error(`No available event found for ${t}`)
              const { maxSlots: i } = s,
                { EventsSubscriptions: n } = s._count
              n < i &&
                (yield a.default.eventsSubscriptions.create({
                  data: Object.assign(Object.assign({}, e), { Event: { connect: { id: t } } }),
                }))
            })
          }
          removeSubscriptionById(e) {
            return i(this, void 0, void 0, function* () {
              yield a.default.eventsSubscriptions.delete({ where: { id: e } })
            })
          }
        })()
      },
      882: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(988))
        t.default = new (class {
          getAll() {
            return i(this, void 0, void 0, function* () {
              return o.default.growthGroup.findMany()
            })
          }
        })()
      },
      168: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(988)),
          a = s(315),
          r = s(465)
        t.default = new (class {
          create(e) {
            return i(this, void 0, void 0, function* () {
              return o.default.news.create({ data: e })
            })
          }
          deleteById(e) {
            return i(this, void 0, void 0, function* () {
              return o.default.news.delete({ where: { id: e } })
            })
          }
          getBySlug(e) {
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
              return o.default.news.findMany({
                where: { scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(), a.TIMEZONE) } },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getAll() {
            return i(this, void 0, void 0, function* () {
              return o.default.news.findMany({ orderBy: { scheduledTo: 'desc' } })
            })
          }
          like(e, t) {
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
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
      454: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(988)),
          a = s(315),
          r = s(465)
        t.default = new (class {
          getStats() {
            return i(this, void 0, void 0, function* () {
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
                [t, s, i, n, u] = yield Promise.all(e)
              return { activeUsers: t, devotionals: s, growthGroups: i, news: n, ongoingEvents: u }
            })
          }
        })()
      },
      686: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(s(632)),
          a = n(s(988))
        t.default = new (class {
          getUserById(e) {
            return i(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { id: e },
                select: { id: !0, email: !0, name: !0, createdAt: !0, birthdate: !0 },
              })
            })
          }
          getAll() {
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
              return a.default.user.create({
                data: e,
                select: { id: !0, email: !0, name: !0, createdAt: !0, phone: !0, password: !1 },
              })
            })
          }
          getUserByEmail(e) {
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { email: e },
                select: { id: !0, email: !0, role: !0, region: !0, UserRefreshTokens: !0 },
              })
            })
          }
          activateUserById(e) {
            return i(this, void 0, void 0, function* () {
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
            return i(this, void 0, void 0, function* () {
              yield a.default.user.update({
                where: { email: e },
                data: { password: yield o.default.hashPassword(t) },
              })
            })
          }
        })()
      },
      894: function (e, t, s) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(s(835)),
          o = i(s(116)),
          a = i(s(334)),
          r = i(s(539)),
          u = i(s(488)),
          d = i(s(145)),
          c = i(s(673)),
          l = i(s(785)),
          f = i(s(489))
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
      230: function (e, t, s) {
        var i =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, s, i) {
                  void 0 === i && (i = s)
                  var n = Object.getOwnPropertyDescriptor(t, s)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[s]
                      },
                    }),
                    Object.defineProperty(e, i, n)
                }
              : function (e, t, s, i) {
                  void 0 === i && (i = s), (e[i] = t[s])
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
                for (var s in e)
                  'default' !== s && Object.prototype.hasOwnProperty.call(e, s) && i(t, e, s)
              return n(t, e), t
            },
          a =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = o(s(142))
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
      832: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const o = n(s(386))
        class a {
          static InitializeInstance() {
            return i(this, void 0, void 0, function* () {
              return new o.default({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: process.env.IMAGEKIT_PROJECT_URL,
              })
            })
          }
          static uploadFile(e, t, s) {
            return i(this, void 0, void 0, function* () {
              try {
                return (yield a.InitializeInstance()).upload({ file: e, fileName: t, folder: s })
              } catch (e) {
                throw new Error('Error in ImageKitService')
              }
            })
          }
          static delete(e) {
            return i(this, void 0, void 0, function* () {
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
      29: function (e, t, s) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, s, i) {
              return new (s || (s = Promise))(function (n, o) {
                function a(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function r(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t)
                          })).then(a, r)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), s(81)
        const o = n(s(139))
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
            return i(this, void 0, void 0, function* () {
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
        var s, i
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.Region = t.ImageKitFolders = void 0),
          ((i = t.ImageKitFolders || (t.ImageKitFolders = {})).Devotionals = 'devotionals'),
          (i.News = 'news'),
          (i.Events = 'events'),
          ((s = t.Region || (t.Region = {})).AEP = 'AEP'),
          (s.FEC = 'FEC')
      },
      607: function (e, t, s) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(s(894)),
          o = i(s(860))
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
  !(function s(i) {
    var n = t[i]
    if (void 0 !== n) return n.exports
    var o = (t[i] = { exports: {} })
    return e[i].call(o.exports, o, o.exports, s), o.exports
  })(607)
})()
