/**
 * Created by chenli on 8/10/16.
 */
var request = require('supertest');
var expect = require('chai').expect;
var config = require('../host_config');
var endpoint = config.host['google_book'];

describe('Test Google Book API', function () {


    describe('Google book API-Volume API', function () {
        this.timeout(10000);
        request = request(endpoint + '/volumes');
        var id;

        it('Scenario 1: Search books with a keyword - API', function (done) {

            request
                .get('?q=API')
                .expect(200, done)
        });

        it('Scenario 2: Search books with two parameters (q=API and maxResults=2)', function (done) {

            var q = 'api';
            var maxResults = 2;
            request
                .get('/')
                .query({
                    q: q,
                    maxResults: maxResults
                })
                .expect(200)
                .expect(function (res) {
                    id = res.body.items[0].id;
                    var selfLinkLength = res.body.items[0].selfLink.split('/').length;
                    var selfLinkId = res.body.items[0].selfLink.split('/')[selfLinkLength - 1];
                    expect(res.body.items[0].volumeInfo.title).to.contains('API');
                    expect(res.body.items.length).to.be.at.most(maxResults);
                    expect(selfLinkId).to.equals(id);
                    expect(res.body).to.include.keys('kind', 'totalItems', 'items');

                })
                .end(function (err, res) {
                    done(err);

                })
        });

        it('Scenario 3: Retrieves a Volume resource based on ID, the ID in request URL is from Scenario 2', function (done) {
            this.timeout(10000);
            console.log(id);

            request
                .get('/' + id)
                .expect(200)
                .expect(function (res) {

                    expect(res.body.id).to.equal(id);
                })
                .end(done)

        });
    });
});
