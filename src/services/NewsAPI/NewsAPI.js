if (_TEST_DATA_) {
    var debugHeadlinesData = require('./debugHeadlinesData.json'),
        debugEverythingData = require('./debugHeadlinesData.json');
}

if (_TEST_DATA_) {
    var debugData = (callback, callbackError, result) => {
        setTimeout(() => {
            callback(null, result);
        }
        , 1000);
        // callbackError(null, error);
    }
}

// API data.
const NEWS_API_URL = process.env.NEWS_API_URL,
    NEWS_API_KEY = process.env.NEWS_API_KEY;

export const getHeadlines = (callback, callbackError, country = "us", page = 1, pageSize = 10) => {
    // Test data
    if (_TEST_DATA_) {
        debugData(callback, callbackError, debugHeadlinesData);
        return;
    }
    else {
        const url = NEWS_API_URL + 
        `top-headlines?` +
        `country=${country}&` +
        `page=${page}&` +
        `pageSize=${pageSize}&` +
        `apiKey=${NEWS_API_KEY}`;
        const request = new Request(url);

        fetch(request)
        .then(res => res.json())
        .then(
            (result) => {
                callback(request, result)
            },
            (error) => {
                callbackError(request, error)
            }
        );
    }
}

export const getEverything = (callback, callbackError, q="*", page = 1, pageSize = 10) => {
    // Test data
    if (_TEST_DATA_) {
        debugData(callback, callbackError, debugEverythingData);
        return;
    }
    else {
        // Set search everything if request empty.
        if (q === "") {
            q = "*";
        }
    
        const url = NEWS_API_URL + 
        `everything?` +
        `q=${q}&` +
        `sortBy=publishedAt&` +
        `page=${page}&` +
        `pageSize=${pageSize}&` +
        `apiKey=${NEWS_API_KEY}`;
        const request = new Request(url);

        fetch(request)
        .then(res => res.json())
        .then(
            (result) => {
                callback(request, result)
            },
            (error) => {
                callbackError(request, error)
            }
        );
    }
}