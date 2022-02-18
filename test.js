process.env.NODE_ENV = "test";
const _app = require("./app");
const app = require("supertest")(_app);

// what is Unit testing
//the smallest parts of an application are called units, testing of those units to check whether it is fit or for use is called unit testing. We need to make sure that the function itself, separate from everything around, should do what it is intended to do.

// in the context of unit testing, testing the interactions between two units is called interation testing. Scenarios like function under test calling another function with some context. We should still mock the outside resources but need to tset those integration links.

// the two major testing frameworks for node are mocha and chai

var { assert, expect } = require("chai");
// assert helps to determine the status of the test, whether it passes or fails

describe("Basic Mocha String Test", function () {
  //describe is a function which holds the collection of tests. it takes two parameters, first one is the meaningful name to functionality under test and second one is the function which contains one or multiple tests. We can have a nested describe as well
  it("should return the number of characters in a string", function () {
    assert.equal("Hello".length, 5);
  });
  //it is a function again which is actually a test itself, and takes two parameters, the first parameter is the name of the test and the second parameter is the function that holds the body of the test, and it what we are ultimately trying to prove to be right or wrong

  it("should return the first character of the string", function () {
    assert.equal("Hello".charAt(0), "H");
  });
});

describe("Testing Ping Route", function () {
  it("should return a 200 response code upon a GET request", async () => {
    const response = await app.get("/ping");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
  });
});

describe("Testing GET /api/posts", function () {
  it("should return a 200 repsonse code upon a successful GET request with a single parameter", async () => {
    const response = await app.get("/posts?tags=tech");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
    expect(response.body.posts).to.be.an('array')
  });

  it('should be able to handle multiple tags parameters', async() => {
    const response = await app.get('/posts?tags=tech,science');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body.posts).to.be.an('array');
    expect(response.body.posts.length).to.equal(49)
  })
});

describe('Testing GET /api/posts invalid parameters', function () {
  it('should return a 400 with invalid tags parameters', async () => {
    const response = await app.get('/posts?tags=');
    expect(response.status).to.equal(400);
    expect(response.body).to.be.an('object');
    expect(response.body.error).to.equal('Tags parameter is required')
  })

  it('should return a 400 with invalid sortBy parameters', async () => {
    const response = await app.get('/posts?tags=tech&sortBy=liking');
    expect(response.status).to.equal(400);
    expect(response.body).to.be.an('object');
    expect(response.body.error).to.equal('sortBy parameter is invalid')
  })

  it('should return a 400 with invalid direction parameters', async () => {
    const response = await app.get('/posts?tags=tech&sortBy=likes&direction=up');
    expect(response.status).to.equal(400);
    expect(response.body).to.be.an('object');
    expect(response.body.error).to.equal('direction parameter is invalid')
  })
})

