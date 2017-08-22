'use strict';

var
    puppeteer = require('puppeteer'),
    defaults = require('../defaults');

exports = module.exports = {

    parser: require('./parser/'),

    query_id: async (_hashtag) => {
        try {
            // Get Query ID
            let query_id;

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setRequestInterceptionEnabled(true);
            page.on('request', (request) => {
                if (/\.(png|jpg|jpeg|gif|webp)$/i.test(request.url)) {
                    request.abort();
                } else if (request.url.startsWith(defaults.URL_INSTAGRAM_GRAPHQL_QUERY)) {
                    query_id = request.url.split('=')[1].split('&')[0];
                } else {
                    request.continue();
                }
            });
            await page.goto(defaults.URL_INSTAGRAM_EXPLORE_TAGS + _hashtag);

            // Click on 'more images'
            await page.click('._1cr2e._epyes');

            browser.close();

            return query_id;

        } catch (error) {
            return error;
        }
    }

};