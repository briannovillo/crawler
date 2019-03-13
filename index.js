const Crawler = require("simplecrawler");
const cheerio = require('cheerio');
const moment = require("moment");
const urlParse = require('url');
const fs = require('fs');

const crawler = new Crawler("https://www.mercadolibre.com.ar");

function log() {
    const time = moment().format("HH:mm:ss");
    const args = Array.from(arguments);

    args.unshift(time);
    console.log.apply(console, args);
}

const getDomain = (url) => urlParse.parse(url).host.split('.')[1];
const saveObjectIntoFile = (fileName, data) => fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

crawler.downloadUnsupported = false;
crawler.decodeResponses = true;

crawler.discoverResources = function(buffer, queueItem) {
  const $ = cheerio.load(buffer.toString("utf8"));

  return $("a[href]").map(function () {
    return $(this).attr("href");
  }).get();
};

crawler.on("crawlstart", function() {
    log("crawlstart");
});

crawler.on("fetchcomplete", function(queueItem, responseBuffer) {
    /*
    For save queue
    if(crawler.queue.length > 50) {
      crawler.queue.freeze("mysavedqueue.json", function () {
        process.exit();
      });
    }
    */

    log("fetchcomplete", queueItem.url);
    saveObjectIntoFile("./scraped/"+new Date().getTime()+".html", responseBuffer);
});

crawler.on("fetch404", function(queueItem, response) {
    log("fetch404", queueItem.url, response.statusCode);
});

crawler.on("fetcherror", function(queueItem, response) {
    log("fetcherror", queueItem.url, response.statusCode);
});

crawler.on("complete", function() {
    log("complete");
});

crawler.start();
