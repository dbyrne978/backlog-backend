const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const BacklogItem = require('../models/backlogItem')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

let userToken = null

beforeEach(async () => {
  await BacklogItem.deleteMany({})
  const backlogItemObjects = helper.initialBacklogItems
    .map(backlogItem => new BacklogItem(backlogItem))
  const promiseArray = backlogItemObjects.map(backlogItem => backlogItem.save())
  await Promise.all(promiseArray)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('testpw', 10)
  const user = new User({ username: 'backlogItemTestUser', passwordHash })
  await user.save()

  await api
    .post('/api/login')
    .send({
      'username': 'backlogItemTestUser',
      'password': 'testpw'
    })
    .expect(res => userToken = res.body.token)
})

describe('when there is initially some backlog items saved', () => {
  test('backlogItems are returned as json', async () => {
    await api
      .get('/api/backlogItems')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all backlogItems are returned', async () => {
    const response = await api.get('/api/backlogItems')

    expect(response.body).toHaveLength(helper.initialBacklogItems.length)
  })

  test('a specific title is within the returned backlogItems', async () => {
    const response = await api.get('/api/backlogItems')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
      'John Wick'
    )
  })
})

describe('viewing a specific backlogItem', () => {
  test('succeeds with valid id', async () => {
    const startingBacklogItems = await helper.backlogItemsInDb()

    const backlogItemToView = startingBacklogItems[0]

    const resultingBacklogItemResp = await api
      .get(`/api/backlogItems/${backlogItemToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBacklogItemToView = JSON.parse(JSON.stringify(backlogItemToView))

    expect(resultingBacklogItemResp.body).toEqual(processedBacklogItemToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/backlogItems/${validNonexistingId}`)
      .expect(404)
  })
})

describe('addition of a new backlog item', () => {
  test('a valid backlogItem can be added', async () => {
    const newBacklogItem = {
      title: 'John Wick 2',
      medium: 'Movie',
      dateCreated: new Date(),
      progress: false
    }

    await api
      .post('/api/backlogItems')
      .set('Authorization', 'Bearer ' + userToken)
      .send(newBacklogItem)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const resultingBacklogItems = await helper.backlogItemsInDb()
    expect(resultingBacklogItems).toHaveLength(helper.initialBacklogItems.length + 1)

    const titles = resultingBacklogItems.map(r => r.title)
    expect(titles).toContain('John Wick 2')
  })

  test('backlogItem without title is not added', async () => {
    const newBacklogItem = {
      medium: 'Movie',
      dateCreated: new Date(),
      progress: false
    }

    await api
      .post('/api/backlogItems')
      .set('Authorization', 'Bearer ' + userToken)
      .send(newBacklogItem)
      .expect(400)

    const resultingBacklogItems = await helper.backlogItemsInDb()

    expect(resultingBacklogItems).toHaveLength(helper.initialBacklogItems.length)
  })

  test('progress defaults to false', async () => {
    const newBacklogItem = {
      title: 'John Wick 2',
      medium: 'Movie',
      dateCreated: new Date(),
    }

    const response = await api
      .post('/api/backlogItems')
      .set('Authorization', 'Bearer ' + userToken)
      .send(newBacklogItem)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.progress).toEqual(false)
  })
})

describe('deletion of a note', () => {
  test('a backlogItem can be deleted', async () => {
    const startingBacklogItems = await helper.backlogItemsInDb()
    const backlogItemToDelete = startingBacklogItems[0]

    await api
      .delete(`/api/backlogItems/${backlogItemToDelete.id}`)
      .expect(204)

    const resultingBacklogItems = await helper.backlogItemsInDb()

    expect(resultingBacklogItems).toHaveLength(
      helper.initialBacklogItems.length - 1
    )

    const titles = resultingBacklogItems.map(r => r.title)

    expect(titles).not.toContain(backlogItemToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})