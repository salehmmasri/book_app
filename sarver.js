'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const { Console } = require('console');
const { url } = require('inspector');
const server = express();
server.set('view engine', 'ejs');
const PORT = process.env.PORT;
server.use(express.static('./public'));
// server.use(express.static('./views'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.get('/hello', (req, res) => {
    res.render('pages/index');
});
server.get('/search', (req, res) => {
    res.render('pages/searches/new');
});
server.post('/search', (req, res) => {
    let text = req.body.text;
    let choose = req.body.form1;
    if (choose == 'Author') {
        let url1 = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${text}`
        superagent.get(url1)
            .then(data => {
                console.log(data.body);
                let books = data.body.items.map(val =>{
                    let book = new Book(val);
                    return book;
                })
                console.log(books);
                res.render('pages/searches/show', { booksData: books });
            });
    } else {
        let url2 = `https://www.googleapis.com/books/v1/volumes?q=intitle:${text}`
        superagent.get(url2)
            .then(data => {
                console.log(data.body);
                let books = data.body.items.map(val =>{
                    let book = new Book(val);
                    return book;
                })
                res.render('pages/searches/show', { booksData: books });
            });
    }
});
function Book(book) {
    this.img_url = book.volumeInfo.imageLinks.thumbnail;
    this.title = book.volumeInfo.title;
    this.author = book.volumeInfo.authors;
    this.description = book.volumeInfo.description;
}
server.listen(PORT, () => {
    console.log(`listening onPORT ${PORT}`);
})