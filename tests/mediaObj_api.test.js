const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const MediaObj = require('../models/mediaObj')
const helper = require('./test_helper')

beforeEach(async () => {
  await MediaObj.deleteMany({})
  let mediaObj = new MediaObj(helper.initialMediaObjArr[0])
  await mediaObj.save()
  mediaObj = new MediaObj(helper.initialMediaObjArr[1])
  await mediaObj.save()
})

test('mediaObjs are returned as json', async () => {
  await api
    .get('/api/mediaObjArr')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('all mediaObjs are returned', async () => {
  const response = await api.get('/api/mediaObjArr')

  expect(response.body).toHaveLength(helper.initialMediaObjArr.length)
})

test('a specific title is within the returned mediaObjs', async () => {
  const response = await api.get('/api/mediaObjArr')

  const titles = response.body.map(r => r.title)
  expect(titles).toContain(
    'John Wick'
  )
})

test('a valid mediaObj can be added', async () => {
  const newMediaObj = {
    title: 'John Wick 2',
    medium: 'Movie',
    date: new Date(),
    progress: false,
  }

  await api
    .post('/api/mediaObjArr')
    .send(newMediaObj)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const resultingMediaObjArr = await helper.mediaObjArrInDb()
  expect(resultingMediaObjArr).toHaveLength(helper.initialMediaObjArr.length + 1)

  const titles = resultingMediaObjArr.map(r => r.title)
  expect(titles).toContain('John Wick 2')
})

afterAll(() => {
  mongoose.connection.close()
})

test('mediaObj without title is not added', async () => {
  const newMediaObj = {
    medium: 'Movie',
    date: new Date(),
    progress: false,
  }

  await api
    .post('/api/mediaObjArr')
    .send(newMediaObj)
    .expect(400)

  const resultingMediaObjArr = await helper.mediaObjArrInDb()

  expect(resultingMediaObjArr).toHaveLength(helper.initialMediaObjArr.length)
})

test('a specific mediaObj can be viewed', async () => {
  const startingMediaObjArr = await helper.mediaObjArrInDb()

  const mediaObjToView = startingMediaObjArr[0]

  const resultingMediaObj = await api
    .get(`/api/mediaObjArr/${mediaObjToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedMediaObjToView = JSON.parse(JSON.stringify(mediaObjToView))

  expect(resultingMediaObj.body).toEqual(processedMediaObjToView)
})

test('a mediaObj can be deleted', async () => {
  const startingMediaObjArr = await helper.mediaObjArrInDb()
  const mediaObjToDelete = startingMediaObjArr[0]

  await api
    .delete(`/api/mediaObjArr/${mediaObjToDelete.id}`)
    .expect(204)

  const resultingMediaObjArr = await helper.mediaObjArrInDb()

  expect(resultingMediaObjArr).toHaveLength(
    helper.initialMediaObjArr.length - 1
  )

  const titles = resultingMediaObjArr.map(r => r.title)

  expect(titles).not.toContain(mediaObjToDelete.title)
})