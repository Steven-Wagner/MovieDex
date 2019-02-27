const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('app', () => {
    it('/movie get request with no params responds with a list of movies', () => {
        return request(app)
            .get('/movie')
            .expect(200)
            .set('Authorization', 'Bearer a06c558e-3a21-11e9-b210-d663bd873d93')
            .then(res => {
                expect(res.body).to.be.an('array')
            })
    })
    it('Return unauthorized', () => {
        return request(app)
            .get('/movie')
            .expect(401)
            .set('Authorization', 'Bearer b06c558e-3a21-11e9-b210-d663bd873d93')
            .then(res => {
                expect(res.body).to.eql({error: 'Unauthorized'})
            })
    })
    it('title query responds with only movies that include query', () => {
        return request(app)
            .get('/movie')
            .query({title: 'Bugs'})
            .expect(200)
            .set('Authorization', 'Bearer a06c558e-3a21-11e9-b210-d663bd873d93')
            .then(res => {
                let i = 0;
                let titlesCorrect = true;

                while (i < res.body.length -1 && titlesCorrect) {
                    if (!res.body[i]['film_title'].toLowerCase().includes('bugs')){
                        titlesCorrect = false
                    }
                    i++
                }
                expect(titlesCorrect).to.be.true;
            })
    })
    it('avg_vote query responds with only movies that are >=', () => {
        return request(app)
            .get('/movie')
            .query({avg_vote: '5'})
            .expect(200)
            .set('Authorization', 'Bearer a06c558e-3a21-11e9-b210-d663bd873d93')
            .then(res => {
                let i = 0;
                let titlesCorrect = true;

                while (i < res.body.length -1 && titlesCorrect) {
                    if (parseFloat(!res.body[i]['avg-vote']) < 5) {
                        titlesCorrect = false
                    }
                    i++
                }
                expect(titlesCorrect).to.be.true;
            })
    })
    it('all movies have the same country', () => {
        return request(app)
            .get('/movie')
            .query({country: 'United States'})
            .expect(200)
            .set('Authorization', 'Bearer a06c558e-3a21-11e9-b210-d663bd873d93')
            .then(res => {
                let i = 0;
                let titlesCorrect = true;

                while (i < res.body.length -1 && titlesCorrect) {
                    if (!res.body[i]['country'] === 'United States') {
                        titlesCorrect = false
                    }
                    i++
                }
                expect(titlesCorrect).to.be.true;
            })
    })
    it('/returns empty when country query is only partial', () => {
        return request(app)
            .get('/movie')
            .query({country: 'United'})
            .expect(200)
            .set('Authorization', 'Bearer a06c558e-3a21-11e9-b210-d663bd873d93')
            .then(res => {
                expect(res.body).to.be.an('array').to.have.length(0);
            })
    })
})