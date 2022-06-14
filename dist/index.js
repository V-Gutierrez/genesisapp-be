;(() => {
  'use strict'
  var e = {
      988: (e, t, i) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = new (i(524).PrismaClient)()
        t.default = o
      },
      835: function (e, t, i) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, i, o) {
              return new (i || (i = Promise))(function (n, s) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    s(e)
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
                u((o = o.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const s = i(590),
          a = n(i(632)),
          r = n(i(20)),
          u = n(i(988)),
          d = n(i(448)),
          c = n(i(29)),
          l = i(686),
          f = n(i(766)),
          h = n(i(344))
        t.default = class {
          static authenticate(e) {
            return o(this, void 0, void 0, function* () {
              e.post('/api/auth', (e, t) =>
                o(this, void 0, void 0, function* () {
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
                    const o = d.default.validateSchema(d.default.LOGIN_SCHEMA, e.body)
                    if (o) return t.status(400).json({ error: o })
                    const { email: n, password: c } = e.body,
                      f = yield l.UserModel.getUserByEmail(n)
                    if (!f) return t.sendStatus(404)
                    if (!f.active) return t.status(403).json({ error: s.Errors.USER_NOT_ACTIVE })
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
                    return t.status(401).json({ error: s.Errors.NO_AUTH })
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
                    const { [r.default.AuthCookieDefaultOptions.name]: i } = e.cookies
                    h.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, i) =>
                      o(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            t.clearCookie(
                              r.default.AuthCookieDefaultOptions.name,
                              r.default.AuthCookieDefaultOptions.config,
                            ),
                            t.sendStatus(403)
                          )
                        const n = yield l.UserModel.getUserByDecodedEmail(i.email)
                        if (!n)
                          return (
                            t.clearCookie('jwt', {
                              httpOnly: !0,
                              secure: f.default,
                              sameSite: f.default ? 'none' : void 0,
                            }),
                            t.sendStatus(403)
                          )
                        const { UserRefreshTokens: s, id: a } = n,
                          [{ token: d }] = s
                        h.default.verify(d, process.env.REFRESH_TOKEN_SECRET, (e) =>
                          o(this, void 0, void 0, function* () {
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
            return o(this, void 0, void 0, function* () {
              e.post('/api/auth/activate', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    if (!e.headers.authorization) return t.sendStatus(401)
                    const { authorization: i } = e.headers
                    h.default.verify(i, process.env.ACTIVATION_TOKEN_SECRET, (e, i) =>
                      o(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield l.UserModel.activateUserById(i.id), t.sendStatus(204))
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
                    const i = d.default.validateSchema(d.default.RESET_PASSWORD, e.body)
                    if (i) return t.status(400).json({ error: i })
                    const { email: o } = e.body,
                      n = yield l.UserModel.getUserByEmail(o)
                    if (!n || !n.active)
                      return t.status(200).json({ message: s.Success.RESET_EMAIL_SEND })
                    const a = h.default.sign(
                      { email: o },
                      process.env.PASSWORD_RESET_TOKEN_SECRET,
                      { expiresIn: '24h' },
                    )
                    if (f.default) {
                      const e = new c.default()
                      yield e.send(
                        e.TEMPLATES.resetPassword.config(o, {
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
            return o(this, void 0, void 0, function* () {
              e.put('/api/auth/reset-password', (e, t) =>
                o(this, void 0, void 0, function* () {
                  const i = e.headers.authorization
                  try {
                    if (d.default.validateSchema(d.default.NEW_PASSWORD, e.body) || !i)
                      return t.sendStatus(400)
                    const { password: n } = e.body
                    h.default.verify(i, process.env.PASSWORD_RESET_TOKEN_SECRET, (e, i) =>
                      o(this, void 0, void 0, function* () {
                        return e
                          ? t.sendStatus(401)
                          : (yield l.UserModel.setUserPasswordByEmail(i.email, n),
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
            return o(this, void 0, void 0, function* () {
              e.delete('/api/auth', (e, t) =>
                o(this, void 0, void 0, function* () {
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
            return o(this, void 0, void 0, function* () {
              e.get('/api/auth/me', (e, t) =>
                o(this, void 0, void 0, function* () {
                  const { [r.default.AuthCookieDefaultOptions.name]: i } = e.cookies
                  if (!i) return t.sendStatus(400)
                  h.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, i) => {
                    if (e) return t.sendStatus(401)
                    const { email: o, role: n, id: s, name: a } = i
                    return t.status(200).json({ email: o, role: n, id: s, name: a })
                  })
                }),
              )
            })
          }
        }
      },
      488: function (e, t, i) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, i, o) {
              return new (i || (i = Promise))(function (n, s) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    s(e)
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
                u((o = o.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const s = n(i(860)),
          a = n(i(20)),
          r = n(i(710)),
          u = n(i(582)),
          d = n(i(766)),
          c = n(i(344)),
          l = n(i(470)),
          f = n(i(738))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.app.use(s.default.json()),
              this.app.use((0, r.default)()),
              this.app.use(s.default.urlencoded({ extended: !1 })),
              this.app.use((0, l.default)('short'))
          }
          CORS() {
            const e = d.default ? [] : ['http://localhost:3000', 'http://192.168.0.56:3000']
            this.app.use(
              (0, u.default)({ credentials: !0, origin: [process.env.FRONT_BASE_URL, ...e] }),
            )
          }
          static JWT(e) {
            e.use((e, t, i) =>
              o(this, void 0, void 0, function* () {
                try {
                  const { [a.default.AuthCookieDefaultOptions.name]: o } = e.cookies
                  c.default.verify(o, process.env.ACCESS_TOKEN_SECRET, (e) => {
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
              o(this, void 0, void 0, function* () {
                try {
                  const { [a.default.AuthCookieDefaultOptions.name]: o } = e.cookies
                  c.default.verify(o, process.env.ACCESS_TOKEN_SECRET, (e, o) =>
                    e ? t.sendStatus(403) : 'ADMIN' !== o.role ? t.sendStatus(401) : void i(),
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
        var o =
            (this && this.__awaiter) ||
            function (e, t, i, o) {
              return new (i || (i = Promise))(function (n, s) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    s(e)
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
                u((o = o.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(362),
          a = n(i(721)),
          r = i(628),
          u = n(i(832)),
          d = n(i(488)),
          c = n(i(448)),
          l = i(465)
        t.default = class {
          static getDevotionals(e) {
            e.get('/api/devotionals', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const e = yield s.DevotionalModel.getReleasedDevotionals()
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
                  const { slug: i } = e.params,
                    o = yield s.DevotionalModel.getBySlug(i)
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
                  const e = yield s.DevotionalModel.getAll()
                  t.status(200).json(e)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          static createDevotional(e) {
            e.post('/api/devotionals', d.default.SingleFileUpload('coverImage'), (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const i = c.default.validateSchema(c.default.DEVOTIONAL_CREATION, e.body)
                  if (i) return t.status(400).json({ error: i })
                  if (!e.file) return t.status(400).json({ error: 'coverImage is missing' })
                  const { body: o, title: n, scheduledTo: d, author: f } = e.body,
                    { file: h } = e,
                    {
                      url: v,
                      thumbnailUrl: p,
                      fileId: _,
                    } = yield u.default.uploadFile(
                      h.buffer,
                      a.default.generateSlug(n),
                      r.ImageKitFolders.Devotionals,
                    ),
                    m = yield s.DevotionalModel.create({
                      body: o,
                      title: n,
                      scheduledTo: (0, l.zonedTimeToUtc)(new Date(d), 'America/Sao_Paulo'),
                      author: f,
                      slug: a.default.generateSlug(n),
                      coverImage: v,
                      coverThumbnail: p,
                      assetId: _,
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
              o(this, void 0, void 0, function* () {
                try {
                  const { id: i } = e.params,
                    o = yield s.DevotionalModel.deleteById(i)
                  yield u.default.delete(o.assetId), t.sendStatus(204)
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      334: function (e, t, i) {
        var o =
          (this && this.__awaiter) ||
          function (e, t, i, o) {
            return new (i || (i = Promise))(function (n, s) {
              function a(e) {
                try {
                  u(o.next(e))
                } catch (e) {
                  s(e)
                }
              }
              function r(e) {
                try {
                  u(o.throw(e))
                } catch (e) {
                  s(e)
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
              u((o = o.apply(e, t || [])).next())
            })
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(882)
        t.default = class {
          static getGrowthGroups(e) {
            return o(this, void 0, void 0, function* () {
              e.get('/api/growthgroups', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const e = yield n.GrowthGroupsModel.getAll()
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
        var o =
          (this && this.__awaiter) ||
          function (e, t, i, o) {
            return new (i || (i = Promise))(function (n, s) {
              function a(e) {
                try {
                  u(o.next(e))
                } catch (e) {
                  s(e)
                }
              }
              function r(e) {
                try {
                  u(o.throw(e))
                } catch (e) {
                  s(e)
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
              u((o = o.apply(e, t || [])).next())
            })
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = i(454)
        t.default = class {
          static getStats(e) {
            e.get('/api/stats', (e, t) =>
              o(this, void 0, void 0, function* () {
                try {
                  const {
                    devotionals: e,
                    activeUsers: i,
                    growthGroups: o,
                  } = yield n.StatsModel.getStats()
                  return t.status(200).json({ activeUsers: i, devotionals: e, growthGroups: o })
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
        }
      },
      785: function (e, t, i) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, i, o) {
              return new (i || (i = Promise))(function (n, s) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    s(e)
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
                u((o = o.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const s = i(590),
          a = n(i(632)),
          r = n(i(721)),
          u = n(i(448)),
          d = n(i(29)),
          c = i(686),
          l = n(i(344))
        t.default = class {
          static get(e) {
            return o(this, void 0, void 0, function* () {
              e.get('/api/users/:id', (e, t) =>
                o(this, void 0, void 0, function* () {
                  const { id: i } = e.params
                  try {
                    if (i) {
                      const e = yield c.UserModel.getUserById(i)
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
            return o(this, void 0, void 0, function* () {
              e.post('/api/users', (e, t) =>
                o(this, void 0, void 0, function* () {
                  try {
                    const i = u.default.validateSchema(u.default.SIGNUP_SCHEMA, e.body)
                    if (i) return t.status(400).json({ error: i })
                    const { email: o, name: n, password: f, phone: h, birthdate: v } = e.body,
                      p = yield c.UserModel.create({
                        email: r.default.sanitizeEmail(o),
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
        }
      },
      618: function (e, t, i) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = o(i(835)),
          s = o(i(116)),
          a = o(i(334)),
          r = o(i(488)),
          u = o(i(673)),
          d = o(i(785))
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              new r.default(this.app),
              n.default.authenticate(this.app),
              n.default.refreshToken(this.app),
              n.default.activateNewUser(this.app),
              n.default.resetPassword(this.app),
              n.default.setNewPassword(this.app),
              n.default.logout(this.app),
              n.default.getUserInformation(this.app),
              a.default.getGrowthGroups(this.app),
              s.default.getDevotionals(this.app),
              s.default.getDevotionalBySlug(this.app),
              d.default.signUp(this.app),
              r.default.JWT(this.app),
              d.default.get(this.app),
              r.default.IsAdmin(this.app),
              s.default.createDevotional(this.app),
              s.default.getDevotionalsAsAdmin(this.app),
              s.default.deleteDevocional(this.app),
              u.default.getStats(this.app)
          }
        }
      },
      632: function (e, t, i) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, o) {
                  void 0 === o && (o = i)
                  var n = Object.getOwnPropertyDescriptor(t, i)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, o, n)
                }
              : function (e, t, i, o) {
                  void 0 === o && (o = i), (e[o] = t[i])
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
          s =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && o(t, e, i)
              return n(t, e), t
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
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = o(i(766))
        class s {}
        ;(t.default = s),
          (s.AuthCookieDefaultOptions = {
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
      721: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        class i {}
        ;(i.generateSlug = (e) =>
          e
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .toLowerCase()),
          (i.sanitizeUserPhone = (e) => e.replace(/\s/gi, '').replace('-', '').trim()),
          (i.sanitizeEmail = (e) => e.replace(/\s/gi, '').trim().toLocaleLowerCase()),
          (i.getUserFirstName = (e) => e.split(' ')[0]),
          (t.default = i)
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
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, i, o) {
                  void 0 === o && (o = i)
                  var n = Object.getOwnPropertyDescriptor(t, i)
                  ;(n && !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[i]
                      },
                    }),
                    Object.defineProperty(e, o, n)
                }
              : function (e, t, i, o) {
                  void 0 === o && (o = i), (e[o] = t[i])
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
          s =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e
              var t = {}
              if (null != e)
                for (var i in e)
                  'default' !== i && Object.prototype.hasOwnProperty.call(e, i) && o(t, e, i)
              return n(t, e), t
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
            const o = i.details.map(({ message: e, path: t }) => ({ [t.join('.')]: e }))
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
              author: u.default.string().required(),
              scheduledTo: u.default.string().required(),
            })),
          (t.default = d)
      },
      362: function (e, t, i) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, i, o) {
              return new (i || (i = Promise))(function (n, s) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    s(e)
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
                u((o = o.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.DevotionalModel = void 0)
        const s = n(i(988)),
          a = i(465)
        t.DevotionalModel = class {
          static getReleasedDevotionals() {
            return o(this, void 0, void 0, function* () {
              return s.default.devotional.findMany({
                where: {
                  scheduledTo: { lte: (0, a.zonedTimeToUtc)(new Date(), 'America/Sao_Paulo') },
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          static getBySlug(e) {
            return o(this, void 0, void 0, function* () {
              return s.default.devotional.findFirst({
                where: {
                  slug: e,
                  scheduledTo: {
                    lte: (0, a.zonedTimeToUtc)(new Date(Date.now()), 'America/Sao_Paulo'),
                  },
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          static getAll() {
            return o(this, void 0, void 0, function* () {
              return s.default.devotional.findMany({ orderBy: { scheduledTo: 'desc' } })
            })
          }
          static create(e) {
            return o(this, void 0, void 0, function* () {
              return s.default.devotional.create({ data: Object.assign({}, e) })
            })
          }
          static deleteById(e) {
            return o(this, void 0, void 0, function* () {
              return s.default.devotional.delete({ where: { id: e } })
            })
          }
        }
      },
      882: function (e, t, i) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, i, o) {
              return new (i || (i = Promise))(function (n, s) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    s(e)
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
                u((o = o.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.GrowthGroupsModel = void 0)
        const s = n(i(988))
        t.GrowthGroupsModel = class {
          static getAll() {
            return o(this, void 0, void 0, function* () {
              return s.default.growthGroup.findMany()
            })
          }
        }
      },
      454: function (e, t, i) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, i, o) {
              return new (i || (i = Promise))(function (n, s) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    s(e)
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
                u((o = o.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.StatsModel = void 0)
        const s = n(i(988))
        t.StatsModel = class {
          static getStats() {
            return o(this, void 0, void 0, function* () {
              const e = [
                  s.default.user.count({ where: { active: !0 } }),
                  s.default.devotional.count(),
                  s.default.growthGroup.count(),
                ],
                [t, i, o] = yield Promise.all(e)
              return { activeUsers: t, devotionals: i, growthGroups: o }
            })
          }
        }
      },
      686: function (e, t, i) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, i, o) {
              return new (i || (i = Promise))(function (n, s) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    s(e)
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
                u((o = o.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.UserModel = void 0)
        const s = n(i(632)),
          a = n(i(988))
        t.UserModel = class {
          static getUserById(e) {
            return o(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { id: e },
                select: { id: !0, email: !0, name: !0, createdAt: !0, birthdate: !0 },
              })
            })
          }
          static create(e) {
            return o(this, void 0, void 0, function* () {
              return a.default.user.create({
                data: Object.assign({}, e),
                select: { id: !0, email: !0, name: !0, createdAt: !0, phone: !0, password: !1 },
              })
            })
          }
          static getUserByEmail(e) {
            return o(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { email: e },
                select: { name: !0, password: !0, email: !0, id: !0, role: !0, active: !0 },
              })
            })
          }
          static getUserByDecodedEmail(e) {
            return o(this, void 0, void 0, function* () {
              return a.default.user.findFirst({
                where: { email: e },
                select: { id: !0, email: !0, role: !0, UserRefreshTokens: !0 },
              })
            })
          }
          static activateUserById(e) {
            return o(this, void 0, void 0, function* () {
              yield a.default.user.update({ where: { id: e }, data: { active: !0 } })
            })
          }
          static getActiveUserByEmail(e) {
            return a.default.user.findFirst({
              where: { email: e },
              select: { email: !0, active: !0 },
            })
          }
          static setUserPasswordByEmail(e, t) {
            return o(this, void 0, void 0, function* () {
              yield a.default.user.update({
                where: { email: e },
                data: { password: yield s.default.hashPassword(t) },
              })
            })
          }
        }
      },
      832: function (e, t, i) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, i, o) {
              return new (i || (i = Promise))(function (n, s) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    s(e)
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
                u((o = o.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const s = n(i(386))
        class a {
          static InitializeInstance() {
            return o(this, void 0, void 0, function* () {
              return new s.default({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: process.env.IMAGEKIT_PROJECT_URL,
              })
            })
          }
          static uploadFile(e, t, i) {
            return o(this, void 0, void 0, function* () {
              return (yield a.InitializeInstance()).upload({ file: e, fileName: t, folder: i })
            })
          }
          static delete(e) {
            return o(this, void 0, void 0, function* () {
              const t = yield a.InitializeInstance()
              yield t.deleteFile(e)
            })
          }
        }
        t.default = a
      },
      29: function (e, t, i) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, i, o) {
              return new (i || (i = Promise))(function (n, s) {
                function a(e) {
                  try {
                    u(o.next(e))
                  } catch (e) {
                    s(e)
                  }
                }
                function r(e) {
                  try {
                    u(o.throw(e))
                  } catch (e) {
                    s(e)
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
                u((o = o.apply(e, t || [])).next())
              })
            },
          n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), i(81)
        const s = n(i(139))
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
                config: (e, t) => ({
                  templateId: 'd-b5cc420efe514a31bef0e658747cf56d',
                  from: { email: 'suportegenesischurch@gmail.com', name: 'Genesis Church' },
                  to: e,
                }),
              },
            }),
              s.default.setApiKey(process.env.SENDGRID_API_KEY)
          }
          send(e) {
            return o(this, void 0, void 0, function* () {
              const t = e
              try {
                yield s.default.send(t), console.log('Sendgrid Service - 200')
              } catch (e) {
                console.log('Error in Sendgrid flow')
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
          (i.ExternalEvents = 'externalevents')
      },
      607: function (e, t, i) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = o(i(618)),
          s = o(i(860))
        new (class {
          constructor(e = (0, s.default)()) {
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
  !(function i(o) {
    var n = t[o]
    if (void 0 !== n) return n.exports
    var s = (t[o] = { exports: {} })
    return e[o].call(s.exports, s, s.exports, i), s.exports
  })(607)
})()
