const ServerError = require('./ServerError.js');
const { AuthorResponse } = require('./Author.js');

class BookPostBody {
    constructor (body) {
        this.name = body.name;
        this.authorId = body.authorId;

        if (this.name == null || this.name.length < 4) {
            throw new ServerError("First name is missing", 400);
        }
    
        if (this.authorId == null) {
            throw new ServerError("Book ID is missing", 400);
        }
    }

    get Name () {
        return this.name;
    }

    get AuthorId () {
        return this.authorId;
    }
}

class BookPutBody extends BookPostBody {
    constructor (body, id) {
        super(body);
        this.id = parseInt(id);

        if (!this.id || this.id < 1) {
            throw new ServerError("Id should be a positive integer", 400);
        }
    }

    get Id () {
        return this.id;
    }
}

class BookResponse {
    constructor(book) {
        this.name = book.name;
        this.authorId = book.authorId;
        this.id = book.id;
    }
}

class BookDetailsResponse {
    constructor(books) {
        const bookMap = new Map();
        books.forEach(book => {
            if (!bookMap.has(book.book_id)) {
                bookMap.set(book.book_id, {
                    id: book.book_id,
                    name: book.book_name,
                    author: {
                        id: book.author_id,
                        firstName: book.author_first_name,
                        lastName: book.author_last_name,
                    },
                    publishers: []
                });
            }

            const mappedBook = bookMap.get(book.book_id);

            mappedBook.publishers.push({
                id: book.publisher_id,
                name: book.publisher_name,
                price: book.price
            });

            bookMap.set(book.book_id, mappedBook);
        });

        const bookMapEntry = bookMap.values().next().value;

        this.id = bookMapEntry.id;
        this.name = bookMapEntry.name;
        this.author = new AuthorResponse(bookMapEntry.author);
        this.publishers = bookMapEntry.publishers;
    }
}

module.exports =  {
    BookPostBody,
    BookPutBody,
    BookResponse,
    BookDetailsResponse
}