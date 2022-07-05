const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }];

beforeEach(async() => {
    await Blog.deleteMany({})
    let blog = new Blog(initialBlogs[0]);
    await blog.save();

    blog = new Blog(initialBlogs[1]);
    await blog.save();
})

test("request for the blogs return correct number of blogs", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(initialBlogs.length);
})

test("unique identifier of blog post is id", async () => {
    const response = await api.get("/api/blogs");
    const singleBlog = response.body[0];
    expect(singleBlog.id).toBeDefined();
})

test("a new blog post can be created", async() => {
    const blog = {      
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    };

    await api
        .post("/api/blogs")
        .send(blog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(initialBlogs.length + 1);
})

test("like property defaults to 0 if not given", async() => {
    const blog = {      
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    }

    const saved = await api.post("/api/blogs").send(blog);
    expect(saved.body.likes).toBeDefined();
})

afterAll(() => {
    mongoose.connection.close()
})