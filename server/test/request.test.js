const request = require('supertest')
describe('API test', function() {
  it('respond with json', function(done) {
    request('http://localhost:3000')
      .post('/api/user/signup')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('respond with json', function(done) {
    request('http://localhost:3000')
      .post('/api/user/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('respond with json', function(done) {
    request('http://localhost:3000')
      .post('/api/user/updateUserData')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('respond with json', function(done) {
    request('http://localhost:3000')
      .post('/api/user/updatePwd')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })
})
