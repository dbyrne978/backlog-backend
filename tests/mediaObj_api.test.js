const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const MediaObj = require('../models/mediaObj')

const initialMediaObjArr = [
  {
    title: '13 Sentinels',
    medium: 'Video Game',
    date: new Date(),
    progress: false,
  },
  {
    title: 'John Wick',
    medium: 'Movie',
    date: new Date(),
    progress: false,
  },
]

beforeEach(async () => {
  await MediaObj.deleteMany({})
  let mediaObj = new MediaObj(initialMediaObjArr[0])
  await mediaObj.save()
  mediaObj = new MediaObj(initialMediaObjArr[1])
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

  expect(response.body).toHaveLength(initialMediaObjArr.length)
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

  const response = await api.get('/api/mediaObjArr')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialMediaObjArr.length + 1)
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

  const response = await api.get('/api/mediaObjArr')

  expect(response.body).toHaveLength(initialMediaObjArr.length)
})