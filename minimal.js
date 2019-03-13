const Crawler = require("simplecrawler");
const cheerio = require('cheerio');
const fs = require('fs');

const saveObjectIntoFile = (fileName, data) => fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

const sites = [
  "https://www.mercadolibre.com.ar",
  "https://www.infobae.com"
];

sites.forEach(site => {
  const crawler = new Crawler(site);

  crawler.downloadUnsupported = false;
  crawler.decodeResponses = true;

  crawler.discoverResources = function(buffer, queueItem) {
    const $ = cheerio.load(buffer.toString("utf8"));

    return $("a[href]").map(function () {
      return $(this).attr("href");
    }).get();
  };

  crawler.on("fetchcomplete", function(queueItem, responseBuffer) {
    console.log(queueItem.url);
    saveObjectIntoFile("./scraped/"+new Date().getTime()+".html", responseBuffer);
  });

  /*
    // If lambda exec time is reaching over 15 minutes, freeze queue for continue on another execution
    if(minutes > 15) {
      crawler.queue.freeze("mysavedqueue.json", function () {
        process.exit();
      });
    }
  */

  crawler.start();
});
