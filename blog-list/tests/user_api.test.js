const mongoose = require("mongoose");
const User = require("../models/user");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const bcrypt = require("bcrypt");

describe("user are not created when", () => {
    beforeEach(async() => {
        await User.deleteMany({});

        const hashed = await bcrypt.hash("admin", 10);
        const user = new User({
            username: "admin", name: "superuser", password: hashed
        });

        await user.save();
    })

    test("username is not provided", async() => {
        const user = {name: "adk", password: "pass123"};

        await api
            .post("/api/users")
            .send(user)
            .expect(500)

        const currentUsers = await api.get("/api/users");
        expect(currentUsers.body).toHaveLength(1);
    })

    test("password is not provided", async() => {
        const user = {name: "adk", username: "pass123"};

        await api
            .post("/api/users")
            .send(user)
            .expect(500)

        const currentUsers = await api.get("/api/users");
        expect(currentUsers.body).toHaveLength(1);
    })

    test("username is not unique", async() => {
        const user = {username: "admin", password: "admin"};

        await api
            .post("/api/users")
            .send(user)
            .expect(400)
            .expect("Content-Type", /application\/json/)
    
        const currentUsers = await api.get("/api/users");
        expect(currentUsers.body).toHaveLength(1);
        
    })

    test("password length must be greater than 3", async() => {
        const user = {username: "admina", password: "ad"};

        await api
        .post("/api/users")
        .send(user)
        .expect(400)
        .expect("Content-Type", /application\/json/)

        const currentUsers = await api.get("/api/users");
        expect(currentUsers.body).toHaveLength(1);

    })
})

afterAll(() => {
    mongoose.connection.close()
})