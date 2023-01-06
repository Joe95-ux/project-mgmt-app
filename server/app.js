require("dotenv").config();
const express = require("express");
const colors = require("colors");
const {graphqlHTTP} = require("express-graphql");
const schema = require("./schema/schema");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000

const app = express();
// connect database
connectDB();

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'

}))

app.listen(port, function () {
    console.log(`Server has started sucessfully on port ${port}`);
  });