var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var async = require('async');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var cl_time = [];
var cl_title = [];
var cl_link=[];
var ind_time = [];
var ind_title = [];
var ind_link=[];
var ind_employer=[];
var ind_location = [];
var dice_time = [];
var dice_title = [];
var dice_link=[];


 async.parallel([
    function(callback){
      request('http://sandiego.craigslist.org/search/web?query=html&sort=date&search_distance=50&postal=92054'
, function(error, response, body){
          if(!error){
              var $ = cheerio.load(body);
                     $('time').each(function(){
                       var data =$(this);
                       cl_time.push(data.text());
                     })
                     $('#titletextonly').each(function(){
                     var data = $(this);
                     cl_title.push(data.text());
                     })
                     $('.row').each(function(){
                       var data=$(this);
                       cl_link.push('http://sandiego.craigslist.org'+ data.children('a').attr('href'));
                     })
          //           console.log(cl_link);
          }
            })//end of request
            console.log('1complete');
    },//end callback
    function(callback){

           request('http://www.indeed.com/jobs?sort=date&q=html&l=San+Diego%2C+CA&radius=50&limit=50', function(error, response, body){
               if(!error){

                   var $ = cheerio.load(body);
                   $('.jobtitle a').each(function(){
                     var data =$(this);
                     ind_title.push(data.text());
                   //  console.log(data.text());
                     })
                     $('.jobtitle a').each(function(){
                       var data =$(this);
                       ind_link.push("http://www.indeed.com" + data.attr('href'));

                     })

//                     console.log(ind_link);
                       $('.date').each(function(){
                         var data =$(this);
                         ind_time.push(data.text());
                       })
               }
              }
            )
            console.log('2complete');

    },
    function(callback){
      request('https://www.dice.com/jobs/sort-date-q-html-limit-30-l-Carlsbad%2C_CA-radius-100-jobs.html', function(error, response, body){
          if(!error){

              var $ = cheerio.load(body);
 //console.log(body);


                 $('#search-results-control ').children('.col-md-9' ).children('#serp').children('.serp-result-content').each(function(){
                   var data =$(this);
                   dice_title.push(data.children('h3').children('a').attr('title'));
                   })


 console.log(dice_title);

 $('#search-results-control ').children('.col-md-9' ).children('#serp').children('.serp-result-content').each(function(){
   var data =$(this);
   dice_link.push(data.children('h3').children('a').attr('href'));
   })

 console.log(dice_link);

 $('.posted').each(function(){
   var data =$(this);
   dice_time.push(data.text());
   })

 dice_time = dice_time.splice(0, (dice_time.length/2));

 console.log(dice_time);
// console.log(dice_time);
          }
        })
         console.log('3complete'); }



])





app.get('/scrape', function (req, res){
  console.log(dice_time);
if (cl_title.length>1 && cl_time.length>1 && ind_time.length>1 && dice_time.length > 1 ){
  res.render('pages/index', {
    cl_title:cl_title,
    cl_time:cl_time,
    cl_link:cl_link,
    ind_title:ind_title,
    ind_time:ind_time,
    ind_link:ind_link,
    dice_time:dice_time,
    dice_title:dice_title,
    dice_link:dice_link

  }
)
}
}
)

app.listen('8081')

console.log('Magic happens on port 8081');
exports = module.exports = app;
