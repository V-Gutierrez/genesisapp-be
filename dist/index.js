;(() => {
  'use strict'
  var e = {
      988: (e, t, i) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = new (i(524).PrismaClient)()
        t.default = n
      },
      835: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const s = i(590),
          a = o(i(632)),
          r = o(i(20)),
          u = o(i(988)),
          d = o(i(448)),
          l = o(i(29)),
          c = o(i(686)),
          f = o(i(766)),
          h = o(i(344))
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
                    if (n) return t.status(400).json({ error: n })
                    const { email: o, password: l } = e.body,
                      f = yield c.default.getUserByEmail(o)
                    if (!f) return t.sendStatus(404)
                    if (!f.active) return t.status(403).json({ error: s.Errors.USER_NOT_ACTIVE })
                    if (yield a.default.comparePassword(l, f.password)) {
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
                    return t.status(401).json({ error: s.Errors.NO_AUTH })
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
                            t.sendStatus(403)
                          )
                        const o = yield c.default.getUserByDecodedEmail(i.email)
                        if (!o)
                          return (
                            t.clearCookie('jwt', {
                              httpOnly: !0,
                              secure: f.default,
                              sameSite: f.default ? 'none' : void 0,
                            }),
                            t.sendStatus(403)
                          )
                        const { UserRefreshTokens: s, id: a } = o,
                          [{ token: d }] = s
                        h.default.verify(d, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          n(this, void 0, void 0, function* () {
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
                              { email: o.email, role: o.role },
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
            return n(this, void 0, void 0, function* () {
              e.post('/api/auth/activate', (e, t) =>
                n(this, void 0, void 0, function* () {
                  try {
                    if (!e.headers.authorization) return t.sendStatus(401)
                    const { authorization: i } = e.headers
                    h.default.verify(i, process.env.ACTIVATION_TOKEN_SECRET, (e, i) =>
                      n(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield c.default.activateUserById(i.id), t.sendStatus(204))
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
                    if (i) return t.status(400).json({ error: i })
                    const { email: n } = e.body,
                      o = yield c.default.getUserByEmail(n)
                    if (!o || !o.active)
                      return t.status(200).json({ message: s.Success.RESET_EMAIL_SEND })
                    const a = h.default.sign(
                      { email: n },
                      process.env.PASSWORD_RESET_TOKEN_SECRET,
                      { expiresIn: '24h' },
                    )
                    if (f.default) {
                      const e = new l.default()
                      yield e.send(
                        e.TEMPLATES.resetPassword.config(n, {
                          resetPasswordUrl: `${process.env.FRONT_BASE_URL}/reset-password?token=${a}`,
                        }),
                      )
                    }
                    return t.status(200).json({ message: s.Success.RESET_EMAIL_SEND })
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
                    if (d.default.validateSchema(d.default.NEW_PASSWORD, e.body) || !i)
                      return t.sendStatus(400)
                    const { password: o } = e.body
                    h.default.verify(i, process.env.PASSWORD_RESET_TOKEN_SECRET, (e, i) =>
                      n(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield c.default.setUserPasswordByEmail(i.email, o),
                            t.status(200).json({ message: s.Success.NEW_PASSWORD_SET }))
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
                      t.sendStatus(204)
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
                  try {
                    const { email: i, role: n, id: o, name: s } = e.cookies.user
                    return t.status(200).json({ email: i, role: n, id: o, name: s })
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
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const s = o(i(860)),
          a = o(i(20)),
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
              this.app.use(s.default.json()),
              this.app.use((0, r.default)()),
              this.app.use(s.default.urlencoded({ extended: !1 })),
              this.app.use((0, c.default)('short')),
              this.UserContext(this.app)
          }
          CORS() {
            const e = d.default ? [] : ['http://localhost:3000', 'http://192.168.0.56:3000']
            this.app.use(
              (0, u.default)({ credentials: !0, origin: [process.env.FRONT_BASE_URL, ...e] }),
            )
          }
          UserContext(e) {
            e.use((e, t, i) =>
              n(this, void 0, void 0, function* () {
                try {
                  const { [a.default.AuthCookieDefaultOptions.name]: t } = e.cookies
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
                  const { [a.default.AuthCookieDefaultOptions.name]: n } = e.cookies
                  l.default.verify(n, process.env.ACCESS_TOKEN_SECRET, (e) => {
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
              n(this, void 0, void 0, function* () {
                try {
                  const { [a.default.AuthCookieDefaultOptions.name]: n } = e.cookies
                  l.default.verify(n, process.env.ACCESS_TOKEN_SECRET, (e, n) =>
                    e ? t.sendStatus(403) : 'ADMIN' !== n.role ? t.sendStatus(401) : void i(),
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = o(i(362)),
          a = o(i(721)),
          r = o(i(832)),
          u = o(i(488)),
          d = o(i(448)),
          l = i(465),
          c = i(628)
        t.default = class {
          static getDevotionals(e) {
            e.get('/api/devotionals', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const e = yield s.default.getReleasedDevotionals()
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
                    { id: o } = null !== (i = e.cookies.user) && void 0 !== i ? i : {},
                    a = yield s.default.getBySlug(n)
                  return a
                    ? (yield s.default.view(a.id, o), t.status(200).json(a))
                    : t.sendStatus(404)
                } catch (e) {
                  console.log('🚀 ~ file: index.ts ~ line 38 ~ Devotionals ~ app.get ~ error', e),
                    t.sendStatus(500)
                }
              }),
            )
          }
          static getDevotionalsAsAdmin(e) {
            e.get('/api/all-devotionals', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const e = yield s.default.getAll()
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
                try {
                  const i = d.default.validateSchema(d.default.DEVOTIONAL_CREATION, e.body)
                  if (i) return t.status(400).json({ error: i })
                  if (!e.file) return t.status(400).json({ error: 'coverImage is missing' })
                  const { body: n, title: o, scheduledTo: u, author: f } = e.body,
                    { file: h } = e,
                    {
                      url: v,
                      thumbnailUrl: p,
                      fileId: _,
                    } = yield r.default.uploadFile(
                      h.buffer,
                      a.default.generateSlug(o),
                      c.ImageKitFolders.Devotionals,
                    ),
                    y = yield s.default.create({
                      body: n,
                      title: o,
                      scheduledTo: (0, l.zonedTimeToUtc)(new Date(u), 'America/Sao_Paulo'),
                      author: f,
                      slug: a.default.generateSlug(o),
                      coverImage: v,
                      coverThumbnail: p,
                      assetId: _,
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
                    n = yield s.default.deleteById(i)
                  yield r.default.delete(n.assetId), t.sendStatus(204)
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
                    { id: o } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                  yield s.default.like(n, o), t.sendStatus(204)
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
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = o(i(882))
        t.default = class {
          static getGrowthGroups(e) {
            return n(this, void 0, void 0, function* () {
              e.get('/api/growthgroups', (e, t) =>
                n(this, void 0, void 0, function* () {
                  try {
                    const e = yield s.default.getAll()
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
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = o(i(230))
        t.default = class {
          static getGooglePhotosAlbumPhotos(e) {
            e.get('/api/integrations/googlephotos', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const { albumUrl: i } = e.query,
                    n = yield s.default.fetchImagesByAlbumUrl(i)
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
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = o(i(721)),
          a = i(628),
          r = o(i(832)),
          u = o(i(488)),
          d = o(i(168)),
          l = o(i(448)),
          c = i(465)
        t.default = class {
          static createNews(e) {
            e.post('/api/news', u.default.SingleFileUpload('coverImage'), (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const i = l.default.validateSchema(l.default.NEWS_CREATION, e.body)
                  if (i) return t.status(400).json({ error: i })
                  if (!e.file) return t.status(400).json({ error: 'coverImage is missing' })
                  const { body: n, title: o, scheduledTo: u, highlightText: f } = e.body,
                    { file: h } = e,
                    {
                      url: v,
                      thumbnailUrl: p,
                      fileId: _,
                    } = yield r.default.uploadFile(
                      h.buffer,
                      s.default.generateSlug(o),
                      a.ImageKitFolders.News,
                    ),
                    y = yield d.default.create({
                      body: n,
                      title: o,
                      scheduledTo: (0, c.zonedTimeToUtc)(new Date(u), 'America/Sao_Paulo'),
                      coverImage: v,
                      coverThumbnail: p,
                      slug: s.default.generateSlug(o),
                      assetId: _,
                      highlightText: f,
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
                  yield r.default.delete(n.assetId), t.sendStatus(204)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static getNewsAsAdmin(e) {
            e.get('/api/all-news', (e, t) =>
              n(this, void 0, void 0, function* () {
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
              n(this, void 0, void 0, function* () {
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
              n(this, void 0, void 0, function* () {
                var i
                try {
                  const { slug: n } = e.params,
                    { id: o } = null !== (i = e.cookies.user) && void 0 !== i ? i : {},
                    s = yield d.default.getBySlug(n)
                  return s
                    ? (yield d.default.view(s.id, o), t.status(200).json(s))
                    : t.sendStatus(404)
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
                    { id: o } = null !== (i = e.cookies.user) && void 0 !== i ? i : {}
                  yield d.default.like(n, o), t.sendStatus(204)
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
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = o(i(454))
        t.default = class {
          static getStats(e) {
            e.get('/api/stats', (e, t) =>
              n(this, void 0, void 0, function* () {
                try {
                  const {
                    devotionals: e,
                    activeUsers: i,
                    growthGroups: n,
                    news: o,
                  } = yield s.default.getStats()
                  return t
                    .status(200)
                    .json({ activeUsers: i, devotionals: e, growthGroups: n, news: o })
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
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const s = i(590),
          a = o(i(632)),
          r = o(i(721)),
          u = o(i(448)),
          d = o(i(29)),
          l = o(i(686)),
          c = o(i(344))
        t.default = class {
          static get(e) {
            return n(this, void 0, void 0, function* () {
              e.get('/api/users/:id', (e, t) =>
                n(this, void 0, void 0, function* () {
                  const { id: i } = e.params
                  try {
                    if (i) {
                      const e = yield l.default.getUserById(i)
                      e || t.status(404).json({ error: s.Errors.USER_NOT_FOUND }),
                        e && t.status(200).json(e)
                    } else t.status(401).json({ error: s.Errors.INVALID_OR_MISSING_ID })
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
                    if (i) return t.status(400).json({ error: i })
                    const { email: n, name: o, password: f, phone: h, birthdate: v } = e.body,
                      p = yield l.default.create({
                        email: r.default.sanitizeEmail(n),
                        name: o,
                        birthdate: new Date(v).toISOString(),
                        password: yield a.default.hashPassword(f),
                        phone: h,
                      }),
                      _ = c.default.sign({ id: p.id }, process.env.ACTIVATION_TOKEN_SECRET, {
                        expiresIn: '30d',
                      }),
                      y = new d.default()
                    yield y.send(
                      y.TEMPLATES.confirmationEmail.config(p.email, {
                        userFirstName: r.default.getUserFirstName(p.name),
                        activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${_}`,
                      }),
                    ),
                      t.status(201).json({ message: s.Success.USER_CREATED, user: p })
                  } catch (e) {
                    'P2002' === e.code
                      ? t.status(409).json({ error: s.Errors.USER_ALREADY_EXISTS })
                      : t.status(500).json({ error: s.Errors.INTERNAL_SERVER_ERROR })
                  }
                }),
              )
            })
          }
          static getAllUsersAsAdmin(e) {
            return n(this, void 0, void 0, function* () {
              e.get('/api/users', (e, t) =>
                n(this, void 0, void 0, function* () {
                  try {
                    const e = yield l.default.getAll()
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
                  var o = Object.getOwnPropertyDescriptor(t, i)
                  ;(o && !('get' in o ? !t.__esModule : o.writable || o.configurable)) ||
                    (o = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, n, o)
                }
              : function (e, t, i, n) {
                  void 0 === n && (n = i), (e[n] = t[i])
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
          s =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && n(t, e, i)
              return o(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const a = s(i(96))
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
        const o = n(i(766))
        class s {}
        ;(t.default = s),
          (s.AuthCookieDefaultOptions = {
            name: 'jwt',
            config: {
              httpOnly: !0,
              secure: o.default,
              sameSite: o.default ? 'none' : void 0,
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
        const o = n(i(113))
        class s {}
        ;(s.generateSlug = (e) =>
          e
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .toLowerCase()),
          (s.sanitizeUserPhone = (e) => e.replace(/\s/gi, '').replace('-', '').trim()),
          (s.sanitizeEmail = (e) => e.replace(/\s/gi, '').trim().toLocaleLowerCase()),
          (s.getUserFirstName = (e) => e.split(' ')[0]),
          (s.generateHashFromString = (e) =>
            o.default.createHash('md5', { outputLength: 16 }).update(e).digest('hex')),
          (t.default = s)
      },
      590: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.Success = t.Errors = void 0),
          (t.Errors = {
            INVALID_OR_MISSING_ID: 'É necessário enviar um ID para a busca',
            USER_NOT_FOUND: 'Usuário não encontrado',
            USER_NOT_ACTIVE: 'Usuário não ativado',
            USER_ALREADY_EXISTS: 'Este usuário já existe. Você esqueceu sua senha?',
            INTERNAL_SERVER_ERROR: 'Houve um problema. Se este erro persistis contate o suporte',
            NO_AUTH: 'Usuário ou senha inválido',
          }),
          (t.Success = {
            USER_CREATED: 'Usuário criado com sucesso. Verifique seu email para ativar sua conta',
            RESET_EMAIL_SEND: 'Email de redefinição de senha enviado com sucesso',
            NEW_PASSWORD_SET: 'Nova senha configurada com sucesso',
          })
      },
      448: function (e, t, i) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, n) {
                  void 0 === n && (n = i)
                  var o = Object.getOwnPropertyDescriptor(t, i)
                  ;(o && !('get' in o ? !t.__esModule : o.writable || o.configurable)) ||
                    (o = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, n, o)
                }
              : function (e, t, i, n) {
                  void 0 === n && (n = i), (e[n] = t[i])
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
          s =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && n(t, e, i)
              return o(t, e), t
            },
          a =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = s(i(634)),
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
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = o(i(988)),
          a = i(285),
          r = i(465)
        t.default = new (class {
          getReleasedDevotionals() {
            return n(this, void 0, void 0, function* () {
              return s.default.devotional.findMany({
                where: {
                  scheduledTo: { lte: (0, r.zonedTimeToUtc)(new Date(), 'America/Sao_Paulo') },
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getBySlug(e) {
            return n(this, void 0, void 0, function* () {
              return s.default.devotional.findFirst({
                where: {
                  slug: e,
                  scheduledTo: {
                    lte: (0, r.zonedTimeToUtc)(new Date(Date.now()), 'America/Sao_Paulo'),
                  },
                },
                orderBy: { scheduledTo: 'desc' },
                include: { DevotionalLikes: !0, DevotionalViews: !0 },
              })
            })
          }
          getById(e) {
            return n(this, void 0, void 0, function* () {
              return s.default.devotional.findFirst({
                where: {
                  id: e,
                  scheduledTo: {
                    lte: (0, r.zonedTimeToUtc)(new Date(Date.now()), 'America/Sao_Paulo'),
                  },
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getAll() {
            return n(this, void 0, void 0, function* () {
              return s.default.devotional.findMany({ orderBy: { scheduledTo: 'desc' } })
            })
          }
          create(e) {
            return n(this, void 0, void 0, function* () {
              const t = (0, a.readingTime)(e.body, 200).minutes
              return s.default.devotional.create({
                data: Object.assign(Object.assign({}, e), { readingTimeInMinutes: t }),
              })
            })
          }
          deleteById(e) {
            return n(this, void 0, void 0, function* () {
              return (
                yield s.default.devotionalLikes.deleteMany({ where: { devotionalId: e } }),
                yield s.default.devotionalViews.deleteMany({ where: { devotionalId: e } }),
                s.default.devotional.delete({ where: { id: e } })
              )
            })
          }
          like(e, t) {
            return n(this, void 0, void 0, function* () {
              try {
                if (
                  !(yield s.default.devotionalLikes.findFirst({
                    where: { userId: t, devotionalId: e },
                  }))
                )
                  return s.default.devotionalLikes.create({ data: { devotionalId: e, userId: t } })
                yield s.default.devotionalLikes.delete({
                  where: { userId_devotionalId: { devotionalId: e, userId: t } },
                })
              } catch (e) {
                console.log(e)
              }
            })
          }
          view(e, t) {
            return n(this, void 0, void 0, function* () {
              try {
                if (!t) return
                return s.default.devotionalViews.upsert({
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
      882: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = o(i(988))
        t.default = new (class {
          getAll() {
            return n(this, void 0, void 0, function* () {
              return s.default.growthGroup.findMany()
            })
          }
        })()
      },
      168: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = o(i(988)),
          a = i(465)
        t.default = new (class {
          create(e) {
            return n(this, void 0, void 0, function* () {
              return s.default.news.create({ data: e })
            })
          }
          deleteById(e) {
            return n(this, void 0, void 0, function* () {
              return (
                yield s.default.newsLikes.deleteMany({ where: { newsId: e } }),
                yield s.default.newsViews.deleteMany({ where: { newsId: e } }),
                s.default.news.delete({ where: { id: e } })
              )
            })
          }
          getBySlug(e) {
            return n(this, void 0, void 0, function* () {
              return s.default.news.findFirst({
                where: {
                  slug: e,
                  scheduledTo: {
                    lte: (0, a.zonedTimeToUtc)(new Date(Date.now()), 'America/Sao_Paulo'),
                  },
                },
                orderBy: { scheduledTo: 'desc' },
                include: { NewsLikes: !0, NewsViews: !0 },
              })
            })
          }
          getReleasedNews() {
            return n(this, void 0, void 0, function* () {
              return s.default.news.findMany({
                where: {
                  scheduledTo: { lte: (0, a.zonedTimeToUtc)(new Date(), 'America/Sao_Paulo') },
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getAll() {
            return n(this, void 0, void 0, function* () {
              return s.default.news.findMany({ orderBy: { scheduledTo: 'desc' } })
            })
          }
          like(e, t) {
            return n(this, void 0, void 0, function* () {
              try {
                const i = yield s.default.newsLikes.findFirst({ where: { userId: t } })
                if (
                  (console.log('🚀 ~ file: index.ts ~ line 78 ~ NewsModel ~ like ~ like', i),
                  !(null == i ? void 0 : i.userId))
                )
                  return s.default.newsLikes.create({ data: { newsId: e, userId: t } })
                yield s.default.newsLikes.delete({
                  where: { userId_newsId: { newsId: e, userId: t } },
                })
              } catch (e) {
                console.log(e)
              }
            })
          }
          view(e, t) {
            return n(this, void 0, void 0, function* () {
              try {
                if (!t) return
                return s.default.newsViews.upsert({
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
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = o(i(988))
        t.default = new (class {
          getStats() {
            return n(this, void 0, void 0, function* () {
              const e = [
                  s.default.user.count({ where: { active: !0 } }),
                  s.default.devotional.count(),
                  s.default.growthGroup.count(),
                  s.default.news.count(),
                ],
                [t, i, n, o] = yield Promise.all(e)
              return { activeUsers: t, devotionals: i, growthGroups: n, news: o }
            })
          }
        })()
      },
      686: function (e, t, i) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = o(i(632)),
          a = o(i(988))
        t.default = new (class {
          getUserById(e) {
            return n(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { id: e },
                select: { id: !0, email: !0, name: !0, createdAt: !0, birthdate: !0 },
              })
            })
          }
          getAll() {
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
                select: { name: !0, password: !0, email: !0, id: !0, role: !0, active: !0 },
              })
            })
          }
          getUserByDecodedEmail(e) {
            return n(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { email: e },
                select: { id: !0, email: !0, role: !0, UserRefreshTokens: !0 },
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
                data: { password: yield s.default.hashPassword(t) },
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
        const o = n(i(835)),
          s = n(i(116)),
          a = n(i(334)),
          r = n(i(539)),
          u = n(i(488)),
          d = n(i(145)),
          l = n(i(673)),
          c = n(i(785))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new u.default(this.app),
              o.default.authenticate(this.app),
              o.default.refreshToken(this.app),
              o.default.activateNewUser(this.app),
              o.default.resetPassword(this.app),
              o.default.setNewPassword(this.app),
              o.default.logout(this.app),
              a.default.getGrowthGroups(this.app),
              s.default.getDevotionals(this.app),
              s.default.getDevotionalBySlug(this.app),
              d.default.getNews(this.app),
              d.default.getNewsBySlug(this.app),
              d.default.like(this.app),
              c.default.signUp(this.app),
              r.default.getGooglePhotosAlbumPhotos(this.app),
              u.default.JWT(this.app),
              o.default.getUserInformation(this.app),
              c.default.get(this.app),
              s.default.like(this.app),
              u.default.IsAdmin(this.app),
              d.default.createNews(this.app),
              d.default.deleteNews(this.app),
              d.default.getNewsAsAdmin(this.app),
              c.default.getAllUsersAsAdmin(this.app),
              s.default.createDevotional(this.app),
              s.default.getDevotionalsAsAdmin(this.app),
              s.default.deleteDevotional(this.app),
              l.default.getStats(this.app)
          }
        }
      },
      230: function (e, t, i) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, n) {
                  void 0 === n && (n = i)
                  var o = Object.getOwnPropertyDescriptor(t, i)
                  ;(o && !('get' in o ? !t.__esModule : o.writable || o.configurable)) ||
                    (o = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, n, o)
                }
              : function (e, t, i, n) {
                  void 0 === n && (n = i), (e[n] = t[i])
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
          s =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && n(t, e, i)
              return o(t, e), t
            },
          a =
            (this && this.__awaiter) ||
            function (e, t, i, n) {
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const r = s(i(142))
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
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const s = o(i(386))
        class a {
          static InitializeInstance() {
            return n(this, void 0, void 0, function* () {
              return new s.default({
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
              return new (i || (i = Promise))(function (o, s) {
                function a(e) {
                  try {
                    u(n.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(n.throw(e))
                  } catch (e) {
                    s(e)
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
                          })).then(a, r)
                }
                u((n = n.apply(e, t || [])).next())
              })
            },
          o =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const s = o(i(139))
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
              s.default.setApiKey(process.env.SENDGRID_API_KEY)
          }
          send(e) {
            return n(this, void 0, void 0, function* () {
              const t = e
              try {
                yield s.default.send(t)
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
          (i.News = 'news')
      },
      607: function (e, t, i) {
        var n =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(i(894)),
          s = n(i(860))
        new (class {
          constructor(e = (0, s.default)()) {
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
      113: (e) => {
        e.exports = require('crypto')
      },
    },
    t = {}
  !(function i(n) {
    var o = t[n]
    if (void 0 !== o) return o.exports
    var s = (t[n] = { exports: {} })
    return e[n].call(s.exports, s, s.exports, i), s.exports
  })(607)
})()
