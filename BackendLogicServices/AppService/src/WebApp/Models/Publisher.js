const ServerError = require('./ServerError.js');

class PublisherPostBody {
    constructor (body) {
        this.name = body.name;

        if (this.name == null || this.name.length < 4) {
            throw new ServerError("First name is missing", 400);
        }
    }

    get Name () {
        return this.name;
    }
}

class PublisherPutBody extends PublisherPostBody {
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

class PublisherResponse {
    constructor(publisher) {
        this.name = publisher.name;
        this.id = publisher.id;
    }
}

class PublisherDetailsResponse {
    constructor(publishers) {
        const publisherMap = new Map();
        publishers.forEach(publisher => {
            if (!publisherMap.has(publisher.publisher_id)) {
                publisherMap.set(publisher.publisher_id, {
                    id: publisher.publisher_id,
                    name: publisher.publisher_name,
                    books: []
                });
            }

            const mappedPublisher = publisherMap.get(publisher.publisher_id);

            mappedPublisher.books.push({
                author: {
                    id: publisher.author_id,
                    firstName: publisher.author_first_name,
                    lastName: publisher.author_last_name,
                },
                id: publisher.book_id,
                name: publisher.book_name,
                price: publisher.price
            });

            publisherMap.set(publisher.publisher_id, mappedPublisher);
        });

        const publisherMapEntry = publisherMap.values().next().value;

        this.id = publisherMapEntry.id;
        this.name = publisherMapEntry.name;
        this.books = publisherMapEntry.books;
    }
}

module.exports =  {
    PublisherPostBody,
    PublisherPutBody,
    PublisherResponse,
    PublisherDetailsResponse
}