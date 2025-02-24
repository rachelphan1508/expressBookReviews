const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }

}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(req.body);
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({data:password}, "access", {expiresIn: 3600});
    req.session.authorization = {accessToken,username};
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization['username']
    const review = req.body.review
    const book_reviews = books[isbn]['reviews']
    book_reviews[username] = review

    return res.status(200).json({message: books[isbn]});

});


// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization['username']
    delete books[isbn]['reviews'][username]
    return res.status(200).json({message: books[isbn]});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;