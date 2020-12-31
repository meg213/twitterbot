const request = require('request');
const cheerio = require('cheerio');

// const rp = require('request-promise');
// const $ = require('cheerio');
// const url = 'http://www.scifiideas.com/planet-generator/';

// rp(url)
//   .then(function(html){
//   	var $ = cheerio.load(html);
//   	var allItems = $("#blog").children();
//   	var items = [];
//   	allItems.each(function(index){
//   		items.push($("#blog").children().eq(index).children())
//   	})
//     //success!
//     console.log($('single_page', html));
//   })
//   .catch(function(err){
//     //handle error
//   });



request('http://www.scifiideas.com/planet-generator/', (error, response, html) => {
	if (!error && response.statusCode == 200){
	      const $ = cheerio.load(html);
          const name = $('.single_page');
          const output = (name.find('p')[2]);

          //console.log(output);
          console.log(output.children[1].data);
          console.log(output.children[5].data);
          console.log(output.children[9].data);

       
	}

    }
);
