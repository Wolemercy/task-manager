const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, userOneId, setupDatabase, closeMongoose } = require('./fixtures/db')

beforeEach(setupDatabase)

afterAll(closeMongoose)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Wole',
        email: 'wole@gmail.com',
        password: 'Musa123456'
    }).expect(201)

    // Assert that database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    // console.log(response.body)
    expect(response.body).toMatchObject({
        user: {
            name: 'Wole',
            email: 'wole@gmail.com'
        },
        token: user.tokens[0].token
    })

    // Assert plain text password is not stored
    expect(user.password).not.toBe('Musa123456')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // Assert that the new token is saved
    const user = await User.findById(userOneId)
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'Johnathan',
        password: 'Mackerel1234'
    }).expect(400)
})

test('Should get profile for authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for authenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Marcus"
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Marcus')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Philly"
        })
        .expect(400)
})

