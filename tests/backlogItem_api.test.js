const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const BacklogItem = require('../models/backlogItem')
const helper = require('./test_helper')

beforeEach(async () => {
  await BacklogItem.deleteMany({})
  let backlogItem = new BacklogItem(helper.initialBacklogItems[0])
  await backlogItem.save()
  backlogItem = new BacklogItem(helper.initialBacklogItems[1])
  await backlogItem.save()
})

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

test('a valid backlogItem can be added', async () => {
  const newBacklogItem = {
    title: 'John Wick 2',
    medium: 'Movie',
    date: new Date(),
    progress: false,
  }

  await api
    .post('/api/backlogItems')
    .send(newBacklogItem)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const resultingBacklogItems = await helper.backlogItemsInDb()
  expect(resultingBacklogItems).toHaveLength(helper.initialBacklogItems.length + 1)

  const titles = resultingBacklogItems.map(r => r.title)
  expect(titles).toContain('John Wick 2')
})

afterAll(() => {
  mongoose.connection.close()
})

test('backlogItem without title is not added', async () => {
  const newBacklogItem = {
    medium: 'Movie',
    date: new Date(),
    progress: false,
  }

  await api
    .post('/api/backlogItems')
    .send(newBacklogItem)
    .expect(400)

  const resultingBacklogItems = await helper.backlogItemsInDb()

  expect(resultingBacklogItems).toHaveLength(helper.initialBacklogItems.length)
})

test('a specific backlogItem can be viewed', async () => {
  const startingBacklogItems = await helper.backlogItemsInDb()

  const backlogItemToView = startingBacklogItems[0]

  const resultingBacklogItem = await api
    .get(`/api/backlogItems/${backlogItemToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedBacklogItemToView = JSON.parse(JSON.stringify(backlogItemToView))

  expect(resultingBacklogItem.body).toEqual(processedBacklogItemToView)
})

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