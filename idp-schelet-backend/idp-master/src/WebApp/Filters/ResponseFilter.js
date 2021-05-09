const setResponseDetails = (res, statusCode, responseObject, entityUrl = undefined) => {
    
    res.status(statusCode);

    if (entityUrl) {
        res.location(`${entityUrl}/${responseObject.id}`);
    }

    if (responseObject) {
        res.json({
            response: responseObject
        });
    } else {
        res.end();
    }
}

module.exports = {
    setResponseDetails
}