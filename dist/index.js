;(() => {
  'use strict'
  var e = {
      7481: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(7285),
          r = n(5465),
          a = n(5142),
          u = s(n(9))
        t.default = new (class {
          getReleasedDevotionals(e) {
            return i(this, void 0, void 0, function* () {
              return u.default.devotional.findMany({
                where: {
                  scheduledTo: {
                    lte: (0, r.zonedTimeToUtc)(new Date(), a.TIMEZONE),
                  },
                  region: e,
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getBySlug(e, t) {
            return i(this, void 0, void 0, function* () {
              return u.default.devotional.findFirst({
                where: {
                  slug: e,
                  scheduledTo: {
                    lte: (0, r.zonedTimeToUtc)(
                      new Date(Date.now()),
                      a.TIMEZONE,
                    ),
                  },
                  region: t,
                },
                orderBy: { scheduledTo: 'desc' },
                include: { DevotionalLikes: !0, DevotionalViews: !0 },
              })
            })
          }
          getById(e, t) {
            return i(this, void 0, void 0, function* () {
              return u.default.devotional.findFirst({
                where: {
                  id: e,
                  scheduledTo: {
                    lte: (0, r.zonedTimeToUtc)(
                      new Date(Date.now()),
                      a.TIMEZONE,
                    ),
                  },
                  region: t,
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getAll(e) {
            return i(this, void 0, void 0, function* () {
              return u.default.devotional.findMany({
                where: { region: e },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          create(e) {
            return i(this, void 0, void 0, function* () {
              const t = (0, o.readingTime)(e.body, 120).minutes
              return u.default.devotional.create({
                data: Object.assign(Object.assign({}, e), {
                  readingTimeInMinutes: t,
                }),
              })
            })
          }
          deleteById(e) {
            return i(this, void 0, void 0, function* () {
              return u.default.devotional.delete({ where: { id: e } })
            })
          }
          like(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                ;(yield u.default.devotionalLikes.findFirst({
                  where: { userId: t, devotionalId: e },
                }))
                  ? yield u.default.devotionalLikes.delete({
                      where: {
                        userId_devotionalId: { devotionalId: e, userId: t },
                      },
                    })
                  : yield u.default.devotionalLikes.create({
                      data: { devotionalId: e, userId: t },
                    })
              } catch (e) {
                console.log(e)
              }
            })
          }
          view(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                if (!t) return
                yield u.default.devotionalViews.upsert({
                  create: { devotionalId: e, userId: t },
                  where: {
                    userId_devotionalId: { devotionalId: e, userId: t },
                  },
                  update: { devotionalId: e, userId: t },
                })
              } catch (e) {
                console.log(e)
              }
            })
          }
        })()
      },
      7536: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(n(9644)),
          r = n(5465),
          a = n(5142),
          u = n(8318),
          d = s(n(7481)),
          l = n(2397),
          c = s(n(327)),
          f = s(n(2013))
        t.default = class {
          static getDevotionals(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              const { region: i } =
                null !== (n = e.cookies.user) && void 0 !== n ? n : {}
              try {
                const e = yield d.default.getReleasedDevotionals(i)
                t.status(200).json(e)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static getDevotionalBySlug(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              try {
                const { slug: i } = e.params,
                  { id: s, region: o } =
                    null !== (n = e.cookies.user) && void 0 !== n ? n : {},
                  r = yield d.default.getBySlug(i, o)
                return r
                  ? (yield d.default.view(r.id, s), t.status(200).json(r))
                  : t.status(404).json({ message: l.Errors.RESOURCE_NOT_FOUND })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static getDevotionalsAsAdmin(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              const { region: i } =
                null !== (n = e.cookies.user) && void 0 !== n ? n : {}
              try {
                const e = yield d.default.getAll(i)
                t.status(200).json(e)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static createDevotional(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              try {
                const i = f.default.validateSchema(
                  f.default.DEVOTIONAL_CREATION,
                  e.body,
                )
                if (i) return t.status(400).json({ message: i })
                if (!e.file)
                  return t
                    .status(400)
                    .json({ message: 'coverImage is missing' })
                const { body: s, title: l, scheduledTo: h, author: v } = e.body,
                  { file: p } = e,
                  { region: _ } =
                    null !== (n = e.cookies.user) && void 0 !== n ? n : {},
                  {
                    url: g,
                    thumbnailUrl: m,
                    fileId: y,
                  } = yield o.default.uploadFile(
                    p.buffer,
                    c.default.generateSlug(l),
                    u.ImageKitFolders.Devotionals,
                  ),
                  E = yield d.default.create({
                    body: s,
                    title: l,
                    scheduledTo: (0, r.zonedTimeToUtc)(new Date(h), a.TIMEZONE),
                    author: v,
                    slug: c.default.generateSlug(l),
                    coverImage: g,
                    coverThumbnail: m,
                    assetId: y,
                    region: _,
                  })
                return t.status(201).json(E)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static deleteDevotional(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const { id: n } = e.params,
                  i = yield d.default.deleteById(n)
                yield o.default.delete(i.assetId),
                  t.status(200).json({ message: l.Success.RESOURCE_DELETED })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static like(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              try {
                const { id: i } = e.params,
                  { id: s } =
                    null !== (n = e.cookies.user) && void 0 !== n ? n : {}
                yield d.default.like(i, s),
                  t.status(201).json({ status: l.Success.RESOURCE_CREATED })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
        }
      },
      8236: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(4042)),
          o = n(6860),
          r = i(n(7536)),
          a = (0, o.Router)()
        a.route('/devotionals').get(r.default.getDevotionals),
          a.route('/devotionals/:slug').get(r.default.getDevotionalBySlug),
          a
            .route('/admin/devotionals')
            .get(
              s.default.Authentication,
              s.default.AdminPermissioner,
              r.default.getDevotionalsAsAdmin,
            ),
          a
            .route('/admin/devotionals')
            .post(
              s.default.Authentication,
              s.default.AdminPermissioner,
              s.default.SingleFileUpload,
              r.default.createDevotional,
            ),
          a
            .route('/admin/devotionals/:id')
            .delete(
              s.default.Authentication,
              s.default.AdminPermissioner,
              r.default.deleteDevotional,
            ),
          a
            .route('/devotionals/:id/like')
            .put(s.default.Authentication, r.default.like),
          (t.default = a)
      },
      8312: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(5142),
          r = n(5465),
          a = n(4146),
          u = s(n(9))
        t.default = new (class {
          getAll() {
            return i(this, void 0, void 0, function* () {
              return u.default.events.findMany({
                orderBy: { subscriptionsScheduledTo: 'desc' },
                include: {
                  _count: { select: { EventsSubscriptions: !0 } },
                  EventsSubscriptions: !0,
                },
              })
            })
          }
          getReleasedEvents(e) {
            return i(this, void 0, void 0, function* () {
              return u.default.events.findMany({
                where: {
                  subscriptionsScheduledTo: {
                    lte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE),
                  },
                  eventDate: {
                    gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE),
                  },
                  subscriptionsDueDate: {
                    gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE),
                  },
                  region: e,
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
                    (0, a.isAfter)(
                      new Date(e.eventDate),
                      new Date(e.subscriptionsDueDate),
                    ) &&
                    (0, a.isAfter)(
                      new Date(e.eventDate),
                      new Date(e.subscriptionsScheduledTo),
                    ),
                  n = (0, a.isAfter)(
                    new Date(e.subscriptionsDueDate),
                    new Date(e.subscriptionsScheduledTo),
                  )
                if (n && t) return u.default.events.create({ data: e })
                throw new Error(
                  `Cannot create event because of: isEventDateTheLaterDate : ${t}, isSubscriptionDueDateLaterThanSubscriptionScheduledDate: ${n}`,
                )
              } catch (e) {
                console.log(e)
              }
            })
          }
          deleteById(e) {
            return i(this, void 0, void 0, function* () {
              return u.default.events.delete({ where: { id: e } })
            })
          }
          getEventById(e, t) {
            return i(this, void 0, void 0, function* () {
              return u.default.events.findFirst({
                where: {
                  id: e,
                  eventDate: {
                    gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE),
                  },
                  subscriptionsDueDate: {
                    gte: (0, r.zonedTimeToUtc)(new Date(), o.TIMEZONE),
                  },
                  region: t,
                },
                include: { _count: { select: { EventsSubscriptions: !0 } } },
              })
            })
          }
          subscribeUserToEvent(e, t, n) {
            return i(this, void 0, void 0, function* () {
              const i = yield this.getEventById(t, n)
              if (!i) throw new Error(`No available event found for ${t}`)
              const { maxSlots: s } = i,
                { EventsSubscriptions: o } = i._count
              o < s &&
                (yield u.default.eventsSubscriptions.create({
                  data: Object.assign(Object.assign({}, e), {
                    Event: { connect: { id: t } },
                  }),
                }))
            })
          }
          removeSubscriptionById(e) {
            return i(this, void 0, void 0, function* () {
              yield u.default.eventsSubscriptions.delete({ where: { id: e } })
            })
          }
        })()
      },
      6115: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(n(9644)),
          r = n(8318),
          a = n(5142),
          u = n(5465),
          d = s(n(8312)),
          l = s(n(327)),
          c = n(2397),
          f = s(n(2013))
        t.default = class {
          static getEvents(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              const { region: i } =
                null !== (n = e.cookies.user) && void 0 !== n ? n : {}
              try {
                const e = yield d.default.getReleasedEvents(i)
                t.status(200).json(e)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static getEventById(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              const { region: i } =
                null !== (n = e.cookies.user) && void 0 !== n ? n : {}
              try {
                const { id: n } = e.params,
                  s = yield d.default.getEventById(n, i)
                t.status(200).json(s)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static createEvent(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              try {
                const i = f.default.validateSchema(
                  f.default.EVENTS_CREATION,
                  e.body,
                )
                if (i) return t.status(400).json({ message: i })
                if (!e.file)
                  return t
                    .status(400)
                    .json({ message: 'coverImage is missing' })
                const { region: s } =
                    null !== (n = e.cookies.user) && void 0 !== n ? n : {},
                  {
                    title: c,
                    subscriptionsScheduledTo: h,
                    subscriptionsDueDate: v,
                    eventDate: p,
                    maxSlots: _,
                    description: g,
                  } = e.body,
                  { file: m } = e,
                  {
                    url: y,
                    thumbnailUrl: E,
                    fileId: w,
                  } = yield o.default.uploadFile(
                    m.buffer,
                    l.default.generateSlug(c),
                    r.ImageKitFolders.Events,
                  ),
                  S = yield d.default.create({
                    title: c,
                    subscriptionsScheduledTo: (0, u.zonedTimeToUtc)(
                      new Date(h),
                      a.TIMEZONE,
                    ),
                    subscriptionsDueDate: (0, u.zonedTimeToUtc)(
                      new Date(v),
                      a.TIMEZONE,
                    ),
                    eventDate: (0, u.zonedTimeToUtc)(new Date(p), a.TIMEZONE),
                    description: g,
                    maxSlots: Number(_),
                    coverImage: y,
                    coverThumbnail: E,
                    assetId: w,
                    region: s,
                  })
                return t.status(201).json(S)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static deleteEvent(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const { id: n } = e.params,
                  i = yield d.default.deleteById(n)
                yield o.default.delete(i.assetId),
                  t.status(200).json({ message: c.Success.RESOURCE_DELETED })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static getEventsAsAdmin(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const e = yield d.default.getAll()
                t.status(200).json(e)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static subscribeToEvent(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              try {
                const i = f.default.validateSchema(
                  f.default.EVENTS_SUBSCRIPTION,
                  e.body,
                )
                if (i) return t.status(400).json({ message: i })
                const { eventId: s } = e.params,
                  { userName: o, userEmail: r, userPhone: a } = e.body,
                  { region: u } =
                    null !== (n = e.cookies.user) && void 0 !== n ? n : {}
                yield d.default.subscribeUserToEvent(
                  { userName: o, userEmail: r, userPhone: a },
                  s,
                  u,
                ),
                  t
                    .status(201)
                    .json({ message: c.Success.SUBSCRIPTION_CREATED })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static deleteSubscription(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const { id: n } = e.params
                yield d.default.removeSubscriptionById(n),
                  t.status(200).json({ message: c.Success.RESOURCE_DELETED })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
        }
      },
      7335: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(6115)),
          o = n(6860),
          r = i(n(4042)),
          a = (0, o.Router)()
        a.route('/events').get(s.default.getEvents),
          a.route('/events/:id').get(s.default.getEventById),
          a
            .route('/admin/events')
            .post(
              r.default.Authentication,
              r.default.AdminPermissioner,
              r.default.SingleFileUpload('coverImage'),
              s.default.createEvent,
            ),
          a
            .route('/admin/events')
            .get(
              r.default.Authentication,
              r.default.AdminPermissioner,
              r.default.SingleFileUpload('coverImage'),
              s.default.getEventsAsAdmin,
            ),
          a
            .route('/admin/events/:id')
            .delete(
              r.default.Authentication,
              r.default.AdminPermissioner,
              s.default.deleteEvent,
            ),
          a
            .route('/events/:eventId/subscriptions')
            .post(s.default.subscribeToEvent),
          a
            .route('/admin/subscriptions/:id')
            .delete(
              r.default.Authentication,
              r.default.AdminPermissioner,
              s.default.deleteSubscription,
            ),
          (t.default = a)
      },
      5621: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(n(9))
        t.default = new (class {
          getAll(e) {
            return i(this, void 0, void 0, function* () {
              return o.default.growthGroup.findMany({ where: { region: e } })
            })
          }
        })()
      },
      6522: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(n(5621))
        t.default = class {
          static getGrowthGroups(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              const { region: i } =
                null !== (n = e.cookies.user) && void 0 !== n ? n : {}
              try {
                const e = yield o.default.getAll(i)
                t.status(200).json(e)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
        }
      },
      6954: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(6522)),
          o = (0, n(6860).Router)()
        o.route('/growthgroups').get(s.default.getGrowthGroups), (t.default = o)
      },
      2703: function (e, t, n) {
        var i =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, i) {
                  void 0 === i && (i = n)
                  var s = Object.getOwnPropertyDescriptor(t, n)
                  ;(s &&
                    !('get' in s
                      ? !t.__esModule
                      : s.writable || s.configurable)) ||
                    (s = {
                      enumerable: !0,
                      get: function () {
                        return t[n]
                      },
                    }),
                    Object.defineProperty(e, i, s)
                }
              : function (e, t, n, i) {
                  void 0 === i && (i = n), (e[i] = t[n])
                }),
          s =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', {
                    enumerable: !0,
                    value: t,
                  })
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
                for (var n in e)
                  'default' !== n &&
                    Object.prototype.hasOwnProperty.call(e, n) &&
                    i(t, e, n)
              return s(t, e), t
            },
          r =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = o(n(3142))
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
            return r(this, void 0, void 0, function* () {
              try {
                const t = yield a.fetchImageUrls(e)
                return this.parseImageOptmizations(t)
              } catch (e) {
                throw new Error('Error in Google Photos Scrapper flow')
              }
            })
          }
        })()
      },
      4064: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(n(2703))
        t.default = class {
          static getGooglePhotosAlbumPhotos(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const { albumUrl: n } = e.query,
                  i = yield o.default.fetchImagesByAlbumUrl(n)
                return t.status(200).json(i)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
        }
      },
      7402: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(4064)),
          o = (0, n(6860).Router)()
        o.route('/googlephotos').get(s.default.getGooglePhotosAlbumPhotos),
          (t.default = o)
      },
      5305: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(n(9)),
          r = n(5142),
          a = n(5465)
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
          getBySlug(e, t) {
            return i(this, void 0, void 0, function* () {
              return o.default.news.findFirst({
                where: {
                  slug: e,
                  scheduledTo: {
                    lte: (0, a.zonedTimeToUtc)(
                      new Date(Date.now()),
                      r.TIMEZONE,
                    ),
                  },
                  region: t,
                },
                orderBy: { scheduledTo: 'desc' },
                include: { NewsLikes: !0, NewsViews: !0 },
              })
            })
          }
          getReleasedNews(e) {
            return i(this, void 0, void 0, function* () {
              return o.default.news.findMany({
                where: {
                  scheduledTo: {
                    lte: (0, a.zonedTimeToUtc)(new Date(), r.TIMEZONE),
                  },
                  region: e,
                },
                orderBy: { scheduledTo: 'desc' },
              })
            })
          }
          getAll(e) {
            return i(this, void 0, void 0, function* () {
              return o.default.news.findMany({
                orderBy: { scheduledTo: 'desc' },
                where: { region: e },
              })
            })
          }
          like(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                ;(yield o.default.newsLikes.findFirst({
                  where: { userId: t, newsId: e },
                }))
                  ? yield o.default.newsLikes.delete({
                      where: { userId_newsId: { newsId: e, userId: t } },
                    })
                  : yield o.default.newsLikes.create({
                      data: { newsId: e, userId: t },
                    })
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
      395: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = n(8318),
          r = s(n(9644)),
          a = n(5465),
          u = n(5142),
          d = s(n(5305)),
          l = s(n(327)),
          c = n(2397),
          f = s(n(2013))
        t.default = class {
          static createNews(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              try {
                const i = f.default.validateSchema(
                  f.default.NEWS_CREATION,
                  e.body,
                )
                if (i) return t.status(400).json({ message: i })
                if (!e.file)
                  return t
                    .status(400)
                    .json({ message: 'coverImage is missing' })
                const {
                    body: s,
                    title: c,
                    scheduledTo: h,
                    highlightText: v,
                  } = e.body,
                  { file: p } = e,
                  { region: _ } =
                    null !== (n = e.cookies.user) && void 0 !== n ? n : {},
                  {
                    url: g,
                    thumbnailUrl: m,
                    fileId: y,
                  } = yield r.default.uploadFile(
                    p.buffer,
                    l.default.generateSlug(c),
                    o.ImageKitFolders.News,
                  ),
                  E = yield d.default.create({
                    body: s,
                    title: c,
                    scheduledTo: (0, a.zonedTimeToUtc)(new Date(h), u.TIMEZONE),
                    coverImage: g,
                    coverThumbnail: m,
                    slug: l.default.generateSlug(c),
                    assetId: y,
                    highlightText: v,
                    region: _,
                  })
                return t.status(201).json(E)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static deleteNews(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const { id: n } = e.params,
                  i = yield d.default.deleteById(n)
                yield r.default.delete(i.assetId),
                  t.status(200).json({ message: c.Success.RESOURCE_DELETED })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static getNewsAsAdmin(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              const { region: i } =
                null !== (n = e.cookies.user) && void 0 !== n ? n : {}
              try {
                const e = yield d.default.getAll(i)
                t.status(200).json(e)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static getNews(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              const { region: i } =
                null !== (n = e.cookies.user) && void 0 !== n ? n : {}
              try {
                const e = yield d.default.getReleasedNews(i)
                t.status(200).json(e)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static getNewsBySlug(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              try {
                const { slug: i } = e.params,
                  { id: s, region: o } =
                    null !== (n = e.cookies.user) && void 0 !== n ? n : {},
                  r = yield d.default.getBySlug(i, o)
                return r
                  ? (yield d.default.view(r.id, s), t.status(200).json(r))
                  : t.status(404).json({ message: c.Errors.RESOURCE_NOT_FOUND })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static like(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              try {
                const { id: i } = e.params,
                  { id: s } =
                    null !== (n = e.cookies.user) && void 0 !== n ? n : {}
                yield d.default.like(i, s),
                  t.status(201).json({ message: c.Success.RESOURCE_CREATED })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
        }
      },
      2339: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(395)),
          o = n(6860),
          r = i(n(4042)),
          a = (0, o.Router)()
        a.route('/news').get(s.default.getNews),
          a
            .route('/admin/news')
            .post(
              r.default.Authentication,
              r.default.AdminPermissioner,
              r.default.SingleFileUpload('coverImage'),
              s.default.createNews,
            ),
          a
            .route('/news/:id')
            .delete(
              r.default.Authentication,
              r.default.AdminPermissioner,
              s.default.deleteNews,
            ),
          a
            .route('/admin/news')
            .get(
              r.default.Authentication,
              r.default.AdminPermissioner,
              s.default.getNewsAsAdmin,
            ),
          a.route('/news/:slug').get(s.default.getNewsBySlug),
          a
            .route('/news/:id/like')
            .post(r.default.Authentication, s.default.like),
          (t.default = a)
      },
      1393: function (e, t, n) {
        var i =
          (this && this.__awaiter) ||
          function (e, t, n, i) {
            return new (n || (n = Promise))(function (s, o) {
              function r(e) {
                try {
                  u(i.next(e))
                } catch (e) {
                  o(e)
                }
              }
              function a(e) {
                try {
                  u(i.throw(e))
                } catch (e) {
                  o(e)
                }
              }
              function u(e) {
                var t
                e.done
                  ? s(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t)
                        })).then(r, a)
              }
              u((i = i.apply(e, t || [])).next())
            })
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = n(3524)
        t.default = new (class {
          translateRegion(e) {
            return e === s.Region.AEP
              ? 'Buenos Aires'
              : e === s.Region.FEC
              ? 'Feira de Santana'
              : '-'
          }
          fetchAll() {
            return i(this, void 0, void 0, function* () {
              return Object.entries(s.Region).map(([e, t]) => ({
                regionKey: e,
                regionTitle: this.translateRegion(t),
              }))
            })
          }
        })()
      },
      9505: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(n(1393))
        t.default = class {
          static getRegions(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const e = yield o.default.fetchAll()
                t.status(200).json(e)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
        }
      },
      8072: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(9505)),
          o = (0, n(6860).Router)()
        o.route('/regions').get(s.default.getRegions), (t.default = o)
      },
      7765: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(n(9)),
          r = n(5142),
          a = n(5465)
        t.default = new (class {
          getStats(e) {
            return i(this, void 0, void 0, function* () {
              const t = [
                  o.default.user.count({ where: { active: !0 } }),
                  o.default.devotional.count({ where: { region: e } }),
                  o.default.growthGroup.count({ where: { region: e } }),
                  o.default.news.count({ where: { region: e } }),
                  o.default.events.count({
                    where: {
                      subscriptionsScheduledTo: {
                        lte: (0, a.zonedTimeToUtc)(new Date(), r.TIMEZONE),
                      },
                      eventDate: {
                        gte: (0, a.zonedTimeToUtc)(new Date(), r.TIMEZONE),
                      },
                      subscriptionsDueDate: {
                        gte: (0, a.zonedTimeToUtc)(new Date(), r.TIMEZONE),
                      },
                      region: e,
                    },
                  }),
                ],
                [n, i, s, u, d] = yield Promise.all(t)
              return {
                activeUsers: n,
                devotionals: i,
                growthGroups: s,
                news: u,
                ongoingEvents: d,
              }
            })
          }
        })()
      },
      2197: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(n(7765))
        t.default = class {
          static getStats(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              const { region: i } =
                null !== (n = e.cookies.user) && void 0 !== n ? n : {}
              try {
                const {
                  devotionals: e,
                  activeUsers: n,
                  growthGroups: s,
                  news: r,
                  ongoingEvents: a,
                } = yield o.default.getStats(i)
                return t
                  .status(200)
                  .json({
                    activeUsers: n,
                    devotionals: e,
                    growthGroups: s,
                    news: r,
                    ongoingEvents: a,
                  })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
        }
      },
      3815: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(4042)),
          o = i(n(2197)),
          r = (0, n(6860).Router)()
        r
          .route('/stats')
          .get(
            s.default.Authentication,
            s.default.AdminPermissioner,
            o.default.getStats,
          ),
          (t.default = r)
      },
      6163: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const o = s(n(1514)),
          r = s(n(9))
        t.default = new (class {
          getUserById(e) {
            return i(this, void 0, void 0, function* () {
              return r.default.user.findFirst({
                where: { id: e },
                select: {
                  id: !0,
                  email: !0,
                  name: !0,
                  createdAt: !0,
                  birthdate: !0,
                },
              })
            })
          }
          getAll(e) {
            return i(this, void 0, void 0, function* () {
              return r.default.user.findMany({
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
            return i(this, void 0, void 0, function* () {
              return r.default.user.create({
                data: e,
                select: {
                  id: !0,
                  email: !0,
                  name: !0,
                  createdAt: !0,
                  phone: !0,
                  password: !1,
                },
              })
            })
          }
          getUserByEmail(e) {
            return i(this, void 0, void 0, function* () {
              return r.default.user.findFirst({
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
              return r.default.user.findFirst({
                where: { email: e },
                select: {
                  id: !0,
                  email: !0,
                  role: !0,
                  region: !0,
                  UserRefreshTokens: !0,
                },
              })
            })
          }
          activateUserById(e) {
            return i(this, void 0, void 0, function* () {
              yield r.default.user.update({
                where: { id: e },
                data: { active: !0 },
              })
            })
          }
          getActiveUserByEmail(e) {
            return r.default.user.findFirst({
              where: { email: e },
              select: { email: !0, active: !0 },
            })
          }
          setUserPasswordByEmail(e, t) {
            return i(this, void 0, void 0, function* () {
              yield r.default.user.update({
                where: { email: e },
                data: { password: yield o.default.hashPassword(t) },
              })
            })
          }
        })()
      },
      4556: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), n(1081)
        const o = s(n(4981)),
          r = s(n(9344)),
          a = s(n(6163)),
          u = s(n(1514)),
          d = s(n(327)),
          l = n(2397),
          c = s(n(2013))
        t.default = class {
          static get(e, t) {
            return i(this, void 0, void 0, function* () {
              const { id: n } = e.params
              try {
                if (n) {
                  const e = yield a.default.getUserById(n)
                  e || t.status(404).json({ message: l.Errors.USER_NOT_FOUND }),
                    e && t.status(200).json(e)
                } else t.status(401).json({ message: l.Errors.INVALID_OR_MISSING_ID })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static signUp(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const n = c.default.validateSchema(
                  c.default.SIGNUP_SCHEMA,
                  e.body,
                )
                if (n) return t.status(400).json({ message: n })
                const {
                    email: i,
                    name: s,
                    password: f,
                    phone: h,
                    birthdate: v,
                    region: p,
                  } = e.body,
                  _ = yield a.default.create({
                    email: d.default.sanitizeEmail(i),
                    name: s,
                    birthdate: new Date(v).toISOString(),
                    password: yield u.default.hashPassword(f),
                    phone: h,
                    region: p,
                  }),
                  g = r.default.sign(
                    { id: _.id },
                    process.env.ACTIVATION_TOKEN_SECRET,
                    { expiresIn: '30d' },
                  ),
                  m = new o.default()
                yield m.send(
                  m.TEMPLATES.confirmationEmail.config(_.email, {
                    userFirstName: d.default.getUserFirstName(_.name),
                    activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${g}`,
                  }),
                ),
                  t
                    .status(201)
                    .json({ message: l.Success.USER_CREATED, user: _ })
              } catch (e) {
                'P2002' === e.code
                  ? t
                      .status(409)
                      .json({ message: l.Errors.USER_ALREADY_EXISTS })
                  : t
                      .status(500)
                      .json({ message: l.Errors.INTERNAL_SERVER_ERROR })
              }
            })
          }
          static getAllUsersAsAdmin(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              const { region: i } =
                null !== (n = e.cookies.user) && void 0 !== n ? n : {}
              try {
                const e = yield a.default.getAll(i)
                t.status(200).json(e)
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
        }
      },
      6064: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(4042)),
          o = i(n(4556)),
          r = (0, n(6860).Router)()
        r.route('/users/:id').get(s.default.Authentication, o.default.get),
          r.route('/users').post(o.default.signUp),
          r
            .route('/admin/users/')
            .get(
              s.default.Authentication,
              s.default.AdminPermissioner,
              o.default.getAllUsersAsAdmin,
            ),
          (t.default = r)
      },
      5142: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.TIMEZONE = void 0),
          (t.TIMEZONE = 'America/Sao_Paulo')
      },
      1514: function (e, t, n) {
        var i =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, i) {
                  void 0 === i && (i = n)
                  var s = Object.getOwnPropertyDescriptor(t, n)
                  ;(s &&
                    !('get' in s
                      ? !t.__esModule
                      : s.writable || s.configurable)) ||
                    (s = {
                      enumerable: !0,
                      get: function () {
                        return t[n]
                      },
                    }),
                    Object.defineProperty(e, i, s)
                }
              : function (e, t, n, i) {
                  void 0 === i && (i = n), (e[i] = t[n])
                }),
          s =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', {
                    enumerable: !0,
                    value: t,
                  })
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
                for (var n in e)
                  'default' !== n &&
                    Object.prototype.hasOwnProperty.call(e, n) &&
                    i(t, e, n)
              return s(t, e), t
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), n(1081)
        const r = o(n(7096))
        t.default = class {
          static hashPassword(e) {
            return r.hash(e, process.env.BCRYPTSALT)
          }
          static comparePassword(e, t) {
            return r.compare(e, t)
          }
        }
      },
      9105: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(5204))
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
      5204: (e, t, n) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          n(1081),
          (t.default = !0)
      },
      327: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(6113))
        class o {}
        ;(o.generateSlug = (e) =>
          e
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .toLowerCase()),
          (o.sanitizeUserPhone = (e) =>
            e.replace(/\s/gi, '').replace('-', '').trim()),
          (o.sanitizeEmail = (e) =>
            e.replace(/\s/gi, '').trim().toLocaleLowerCase()),
          (o.getUserFirstName = (e) => e.split(' ')[0]),
          (o.generateHashFromString = (e) =>
            s.default
              .createHash('md5', { outputLength: 16 })
              .update(e)
              .digest('hex')),
          (t.default = o)
      },
      2397: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.Success = t.Errors = void 0),
          (t.Errors = {
            INVALID_OR_MISSING_ID: 'É necessário enviar um ID para a busca',
            USER_NOT_FOUND: 'Usuário não encontrado',
            USER_NOT_ACTIVE: 'Usuário não ativado',
            USER_ALREADY_EXISTS:
              'Este usuário já existe. Você esqueceu sua senha?',
            INTERNAL_SERVER_ERROR:
              'Houve um problema. Se este erro persistir contate o suporte',
            NO_AUTH: 'Credenciais inválidas',
            RESOURCE_NOT_FOUND: 'Recurso não encontrado',
          }),
          (t.Success = {
            USER_CREATED:
              'Usuário criado com sucesso. Verifique seu email para ativar sua conta',
            RESET_EMAIL_SEND:
              'Email de redefinição de senha enviado com sucesso',
            NEW_PASSWORD_SET: 'Nova senha configurada com sucesso',
            USER_ACTIVATED: 'Usuário ativado com sucesso',
            RESOURCE_CREATED: 'Recurso criado',
            RESOURCE_DELETED: 'Recurso deletado',
            LOGOUT: 'Usuário deslogado com sucesso',
            SUBSCRIPTION_CREATED: 'Inscrição realizada',
            LOGIN: 'Usuário logado com sucesso',
            HEALTHCHECK: 'OK!!',
          })
      },
      2013: function (e, t, n) {
        var i =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, i) {
                  void 0 === i && (i = n)
                  var s = Object.getOwnPropertyDescriptor(t, n)
                  ;(s &&
                    !('get' in s
                      ? !t.__esModule
                      : s.writable || s.configurable)) ||
                    (s = {
                      enumerable: !0,
                      get: function () {
                        return t[n]
                      },
                    }),
                    Object.defineProperty(e, i, s)
                }
              : function (e, t, n, i) {
                  void 0 === i && (i = n), (e[i] = t[n])
                }),
          s =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', {
                    enumerable: !0,
                    value: t,
                  })
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
                for (var n in e)
                  'default' !== n &&
                    Object.prototype.hasOwnProperty.call(e, n) &&
                    i(t, e, n)
              return s(t, e), t
            },
          r =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const a = o(n(9634)),
          u = r(n(8506))
        class d {
          static validateSchema(e, t) {
            const { error: n } = u.default.validate(t, e, {
              abortEarly: !1,
              convert: !1,
            })
            if (!n || !n.details) return
            const i = n.details.map(({ message: e, path: t }) => ({
              [t.join('.')]: e,
            }))
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
      4042: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), n(1081)
        const o = s(n(6985)),
          r = s(n(6860)),
          a = s(n(9710)),
          u = s(n(3582)),
          d = s(n(9344)),
          l = s(n(9470)),
          c = s(n(1738)),
          f = n(9549),
          h = s(n(9105)),
          v = s(n(5204)),
          p = n(2397)
        t.default = class {
          constructor(e) {
            ;(this.app = e),
              this.CORS(),
              this.rateLimiter(),
              this.app.use(r.default.json()),
              this.app.use((0, a.default)()),
              this.app.use(r.default.urlencoded({ extended: !1 })),
              this.app.use((0, l.default)('short')),
              this.TrebbleDocs(this.app),
              this.UserContext(this.app)
          }
          CORS() {
            const e = v.default
              ? []
              : ['http://localhost:3000', 'http://192.168.0.56:3000']
            this.app.use(
              (0, u.default)({
                credentials: !0,
                origin: [process.env.FRONT_BASE_URL, ...e],
              }),
            )
          }
          TrebbleDocs(e) {
            v.default &&
              (0, f.useTreblle)(e, {
                apiKey: process.env.TREBBLE_DOCS_API,
                projectId: process.env.TREBBLE_DOCS_PID,
              })
          }
          UserContext(e) {
            e.use((e, t, n) =>
              i(this, void 0, void 0, function* () {
                try {
                  const { [h.default.AuthCookieDefaultOptions.name]: t } =
                    e.cookies
                  d.default.verify(
                    t,
                    process.env.ACCESS_TOKEN_SECRET,
                    (t, i) => {
                      ;(e.cookies.user = t ? null : i), n()
                    },
                  )
                } catch (e) {
                  t.sendStatus(500)
                }
              }),
            )
          }
          rateLimiter() {
            const e = (0, o.default)({
              windowMs: 6e5,
              max: 200,
              standardHeaders: !0,
              legacyHeaders: !1,
            })
            this.app.use(e)
          }
          static Authentication(e, t, n) {
            try {
              const { [h.default.AuthCookieDefaultOptions.name]: i } = e.cookies
              d.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e) => {
                if (e) return t.status(403).json({ message: p.Errors.NO_AUTH })
                n()
              })
            } catch (e) {
              t.sendStatus(500)
            }
          }
          static AdminPermissioner(e, t, n) {
            try {
              const { [h.default.AuthCookieDefaultOptions.name]: i } = e.cookies
              d.default.verify(i, process.env.ACCESS_TOKEN_SECRET, (e, i) =>
                e
                  ? t.status(403).json({ message: p.Errors.NO_AUTH })
                  : 'ADMIN' !== i.role
                  ? t.status(401).json({ message: p.Errors.NO_AUTH })
                  : void n(),
              )
            } catch (e) {
              t.sendStatus(500)
            }
          }
          static SingleFileUpload(e) {
            return (0, c.default)({ limits: { fileSize: 2e6 } }).single(e)
          }
        }
      },
      160: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.ApplicationRouter = void 0)
        const s = i(n(8236)),
          o = i(n(7335)),
          r = i(n(2339)),
          a = i(n(8072)),
          u = i(n(7402)),
          d = i(n(3815)),
          l = i(n(6064)),
          c = i(n(4042)),
          f = i(n(755)),
          h = i(n(6954)),
          v = n(2397)
        t.ApplicationRouter = class {
          constructor(e) {
            ;(this.app = e),
              new c.default(this.app),
              this.app.use('/api/', s.default),
              this.app.use('/api/', o.default),
              this.app.use('/api/', h.default),
              this.app.use('/api/', r.default),
              this.app.use('/api/', a.default),
              this.app.use('/api/', d.default),
              this.app.use('/api/', l.default),
              this.app.use('/api/', f.default),
              this.app.use('/api/integrations/', u.default),
              this.healthCheck(),
              this.handleNotFound(),
              console.log('[ApplicationRouter] Routes loaded')
          }
          handleNotFound() {
            this.app.use('*', (e, t) => {
              t.status(404).json({ message: v.Errors.RESOURCE_NOT_FOUND })
            })
          }
          healthCheck() {
            this.app.use('/api/healthcheck', (e, t) => {
              t.status(200).json({ message: v.Success.HEALTHCHECK })
            })
          }
        }
      },
      7958: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = n(160),
          o = i(n(6860))
        new (class {
          constructor(e) {
            ;(this.app = e),
              this.setProxyTrust(),
              this.initializeRouter(),
              this.app.listen(process.env.PORT || 8080, () => {
                console.info(
                  '[Server] Server initialized on port:',
                  process.env.PORT || 8080,
                )
              })
          }
          initializeRouter() {
            new s.ApplicationRouter(this.app)
          }
          setProxyTrust() {
            this.app.set('trust proxy', !0)
          }
        })((0, o.default)())
      },
      9: (e, t, n) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
        const i = new (n(3524).PrismaClient)()
        t.default = i
      },
      5877: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), n(1081)
        const o = s(n(4981)),
          r = s(n(9344)),
          a = s(n(6163)),
          u = s(n(1514)),
          d = s(n(9105)),
          l = s(n(5204)),
          c = n(2397),
          f = s(n(2013)),
          h = s(n(9))
        t.default = class {
          static authenticate(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const { [d.default.AuthCookieDefaultOptions.name]: n } =
                  e.cookies
                n &&
                  r.default.verify(
                    e.cookies.jwt,
                    process.env.ACCESS_TOKEN_SECRET,
                    (e) => {
                      e &&
                        t.clearCookie(
                          d.default.AuthCookieDefaultOptions.name,
                          d.default.AuthCookieDefaultOptions.config,
                        )
                    },
                  )
                const i = f.default.validateSchema(
                  f.default.LOGIN_SCHEMA,
                  e.body,
                )
                if (i) return t.status(400).json({ message: i })
                const { email: s, password: o } = e.body,
                  l = yield a.default.getUserByEmail(s)
                if (!l)
                  return t
                    .status(404)
                    .json({ message: c.Errors.USER_NOT_FOUND })
                if (!l.active)
                  return t
                    .status(403)
                    .json({ message: c.Errors.USER_NOT_ACTIVE })
                if (yield u.default.comparePassword(o, l.password)) {
                  const e = {
                      email: l.email,
                      role: l.role,
                      id: l.id,
                      name: l.name,
                      region: l.region,
                    },
                    n = r.default.sign(e, process.env.ACCESS_TOKEN_SECRET, {
                      expiresIn: '12h',
                    }),
                    i = r.default.sign(e, process.env.REFRESH_TOKEN_SECRET, {
                      expiresIn: '30d',
                    })
                  return (
                    yield h.default.userRefreshTokens.upsert({
                      where: { userId: l.id },
                      update: { token: i },
                      create: { userId: l.id, token: i },
                    }),
                    t.cookie(
                      d.default.AuthCookieDefaultOptions.name,
                      n,
                      d.default.AuthCookieDefaultOptions.config,
                    ),
                    t.status(200).json({ userLoggedIn: !0 })
                  )
                }
                return t.status(401).json({ message: c.Errors.NO_AUTH })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static refreshToken(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const { [d.default.AuthCookieDefaultOptions.name]: n } =
                  e.cookies
                r.default.verify(n, process.env.ACCESS_TOKEN_SECRET, (e, n) =>
                  i(this, void 0, void 0, function* () {
                    if (e)
                      return (
                        t.clearCookie(
                          d.default.AuthCookieDefaultOptions.name,
                          d.default.AuthCookieDefaultOptions.config,
                        ),
                        t.status(403).json({ message: c.Errors.NO_AUTH })
                      )
                    const s = yield a.default.getUserByDecodedEmail(n.email)
                    if (!s)
                      return (
                        t.clearCookie('jwt', {
                          httpOnly: !0,
                          secure: l.default,
                          sameSite: l.default ? 'none' : void 0,
                        }),
                        t.status(403).json({ message: c.Errors.NO_AUTH })
                      )
                    const { UserRefreshTokens: o, id: u } = s,
                      [{ token: f }] = o
                    r.default.verify(f, process.env.REFRESH_TOKEN_SECRET, (e) =>
                      i(this, void 0, void 0, function* () {
                        if (e)
                          return (
                            yield h.default.userRefreshTokens.delete({
                              where: { userId: u },
                            }),
                            t.clearCookie(
                              d.default.AuthCookieDefaultOptions.name,
                              d.default.AuthCookieDefaultOptions.config,
                            ),
                            t.status(403).json({ message: c.Errors.NO_AUTH })
                          )
                        const n = r.default.sign(
                          {
                            email: s.email,
                            role: s.role,
                            id: s.id,
                            region: s.region,
                          },
                          process.env.ACCESS_TOKEN_SECRET,
                          { expiresIn: '12h' },
                        )
                        t.cookie(
                          d.default.AuthCookieDefaultOptions.name,
                          n,
                          d.default.AuthCookieDefaultOptions.config,
                        ),
                          t.status(200).json({ message: c.Success.LOGIN })
                      }),
                    )
                  }),
                )
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static activateNewUser(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                if (!e.headers.authorization)
                  return t.status(401).json({ message: c.Errors.NO_AUTH })
                const { authorization: n } = e.headers
                r.default.verify(
                  n,
                  process.env.ACTIVATION_TOKEN_SECRET,
                  (e, n) =>
                    i(this, void 0, void 0, function* () {
                      return e
                        ? t.status(401).json({ message: c.Errors.NO_AUTH })
                        : (yield a.default.activateUserById(n.id),
                          t
                            .status(200)
                            .json({ message: c.Success.USER_ACTIVATED }))
                    }),
                )
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static resetPassword(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                const n = f.default.validateSchema(
                  f.default.RESET_PASSWORD,
                  e.body,
                )
                if (n) return t.status(400).json({ message: n })
                const { email: i } = e.body,
                  s = yield a.default.getUserByEmail(i)
                if (!s || !s.active)
                  return t
                    .status(200)
                    .json({ message: c.Success.RESET_EMAIL_SEND })
                const u = r.default.sign(
                  { email: i },
                  process.env.PASSWORD_RESET_TOKEN_SECRET,
                  { expiresIn: '24h' },
                )
                if (l.default) {
                  const e = new o.default()
                  yield e.send(
                    e.TEMPLATES.resetPassword.config(i, {
                      resetPasswordUrl: `${process.env.FRONT_BASE_URL}/reset-password?token=${u}`,
                    }),
                  )
                }
                return t
                  .status(200)
                  .json({ message: c.Success.RESET_EMAIL_SEND })
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static setNewPassword(e, t) {
            return i(this, void 0, void 0, function* () {
              const n = e.headers.authorization
              try {
                const s = f.default.validateSchema(
                  f.default.NEW_PASSWORD,
                  e.body,
                )
                if (s || !n)
                  return t
                    .status(400)
                    .json({ message: c.Errors.NO_AUTH, error: s })
                const { password: o } = e.body
                r.default.verify(
                  n,
                  process.env.PASSWORD_RESET_TOKEN_SECRET,
                  (e, n) =>
                    i(this, void 0, void 0, function* () {
                      return e
                        ? t.status(401).json({ message: c.Errors.NO_AUTH })
                        : (yield a.default.setUserPasswordByEmail(n.email, o),
                          t
                            .status(200)
                            .json({ message: c.Success.NEW_PASSWORD_SET }))
                    }),
                )
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static logout(e, t) {
            return i(this, void 0, void 0, function* () {
              try {
                return (
                  t.clearCookie(
                    d.default.AuthCookieDefaultOptions.name,
                    d.default.AuthCookieDefaultOptions.config,
                  ),
                  t.status(200).json({ message: c.Success.LOGOUT })
                )
              } catch (e) {
                t.sendStatus(500)
              }
            })
          }
          static getUserInformation(e, t) {
            var n
            return i(this, void 0, void 0, function* () {
              try {
                const {
                  email: i,
                  role: s,
                  id: o,
                  name: r,
                  region: a,
                } = null !== (n = e.cookies.user) && void 0 !== n ? n : {}
                return t
                  .status(200)
                  .json({ email: i, role: s, id: o, name: r, region: a })
              } catch (e) {
                return t.sendStatus(500)
              }
            })
          }
        }
      },
      755: function (e, t, n) {
        var i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const s = i(n(4042)),
          o = i(n(5877)),
          r = (0, n(6860).Router)()
        r.route('/auth').post(o.default.authenticate),
          r
            .route('/auth')
            .get(s.default.Authentication, o.default.refreshToken),
          r.route('/auth/activate').post(o.default.activateNewUser),
          r.route('/auth/reset-password').post(o.default.resetPassword),
          r.route('/auth/reset-password').put(o.default.setNewPassword),
          r
            .route('/auth/logout')
            .delete(s.default.Authentication, o.default.logout),
          r
            .route('/auth/me')
            .get(s.default.Authentication, o.default.getUserInformation),
          (t.default = r)
      },
      9644: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), n(1081)
        const o = s(n(3386))
        class r {
          static InitializeInstance() {
            return i(this, void 0, void 0, function* () {
              return new o.default({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: process.env.IMAGEKIT_PROJECT_URL,
              })
            })
          }
          static uploadFile(e, t, n) {
            return i(this, void 0, void 0, function* () {
              try {
                return (yield r.InitializeInstance()).upload({
                  file: e,
                  fileName: t,
                  folder: n,
                })
              } catch (e) {
                throw new Error('Error in ImageKitService')
              }
            })
          }
          static delete(e) {
            return i(this, void 0, void 0, function* () {
              try {
                const t = yield r.InitializeInstance()
                yield t.deleteFile(e)
              } catch (e) {
                throw new Error('Error in ImageKitService')
              }
            })
          }
        }
        t.default = r
      },
      4981: function (e, t, n) {
        var i =
            (this && this.__awaiter) ||
            function (e, t, n, i) {
              return new (n || (n = Promise))(function (s, o) {
                function r(e) {
                  try {
                    u(i.next(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function a(e) {
                  try {
                    u(i.throw(e))
                  } catch (e) {
                    o(e)
                  }
                }
                function u(e) {
                  var t
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(r, a)
                }
                u((i = i.apply(e, t || [])).next())
              })
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), n(1081)
        const o = s(n(2139))
        t.default = class {
          constructor() {
            ;(this.TEMPLATES = {
              confirmationEmail: {
                config: (e, t) => ({
                  to: e,
                  from: {
                    email: 'suportegenesischurch@gmail.com',
                    name: 'Genesis Church',
                  },
                  subject: 'Seja bem vindo à Genesis Church',
                  templateId: 'd-20dab053877c41cdb7feeda798233024',
                  dynamicTemplateData: t,
                }),
              },
              resetPassword: {
                config: (e, t) => ({
                  to: e,
                  from: {
                    email: 'suportegenesischurch@gmail.com',
                    name: 'Genesis Church',
                  },
                  subject: 'Alteração de senha',
                  templateId: 'd-03325789ee6f4014858e14ac7cde78e1',
                  dynamicTemplateData: t,
                }),
              },
              anniversary: {
                config: (e) => ({
                  templateId: 'd-b5cc420efe514a31bef0e658747cf56d',
                  from: {
                    email: 'suportegenesischurch@gmail.com',
                    name: 'Genesis Church',
                  },
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
      8318: (e, t) => {
        var n, i
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.Region = t.ImageKitFolders = void 0),
          ((i = t.ImageKitFolders || (t.ImageKitFolders = {})).Devotionals =
            'devotionals'),
          (i.News = 'news'),
          (i.Events = 'events'),
          ((n = t.Region || (t.Region = {})).AEP = 'AEP'),
          (n.FEC = 'FEC')
      },
      3524: (e) => {
        e.exports = require('@prisma/client')
      },
      2139: (e) => {
        e.exports = require('@sendgrid/mail')
      },
      7096: (e) => {
        e.exports = require('bcrypt')
      },
      9710: (e) => {
        e.exports = require('cookie-parser')
      },
      3582: (e) => {
        e.exports = require('cors')
      },
      4146: (e) => {
        e.exports = require('date-fns')
      },
      5465: (e) => {
        e.exports = require('date-fns-tz')
      },
      1081: (e) => {
        e.exports = require('dotenv/config')
      },
      6860: (e) => {
        e.exports = require('express')
      },
      6985: (e) => {
        e.exports = require('express-rate-limit')
      },
      3142: (e) => {
        e.exports = require('google-photos-album-image-url-fetch')
      },
      3386: (e) => {
        e.exports = require('imagekit')
      },
      8506: (e) => {
        e.exports = require('joi')
      },
      9344: (e) => {
        e.exports = require('jsonwebtoken')
      },
      9470: (e) => {
        e.exports = require('morgan')
      },
      1738: (e) => {
        e.exports = require('multer')
      },
      9634: (e) => {
        e.exports = require('ramda')
      },
      7285: (e) => {
        e.exports = require('reading-time-estimator')
      },
      9549: (e) => {
        e.exports = require('treblle')
      },
      6113: (e) => {
        e.exports = require('crypto')
      },
    },
    t = {}
  !(function n(i) {
    var s = t[i]
    if (void 0 !== s) return s.exports
    var o = (t[i] = { exports: {} })
    return e[i].call(o.exports, o, o.exports, n), o.exports
  })(7958)
})()
