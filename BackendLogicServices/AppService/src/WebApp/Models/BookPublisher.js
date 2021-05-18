const ServerError = require('./ServerError.js');

class BookPublisherPostBody {
    constructor (body) {
        this.price = body.price;
        this.publisherId = body.publisherId;

        if (this.price == null || this.price < 1) {
            throw new ServerError("Price is missing", 400);
        }
    
        if (this.publisherId == null) {
            throw new ServerError("Publisher ID is missing", 400);
        }
    }

    get Price () {
        return this.price;
    }

    get PublisherId () {
        return this.publisherId;
    }
}

class BookPublisherBody extends BookPublisherPostBody {
    constructor (body, bookId) {
        super(body);
        this.bookId = parseInt(bookId);

        if (!this.bookId || this.bookId < 1) {
            throw new ServerError("BookId should be a positive integer", 400);
        }
    }

    get BookId () {
        return this.bookId;
    }
}

class BookPublisherResponse {
    constructor(bookPublisher) {
        this.price = bookPublisher.price;
        this.bookId = bookPublisher.book_id;
        this.priceId = bookPublisher.price_id;
    }
}

module.exports =  {
    BookPublisherPostBody,
    BookPublisherBody,
    BookPublisherResponse
}