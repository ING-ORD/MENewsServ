// var needle = require('needle');
// var tress = require('tress');


// var URL = 'https://72.ru';
// var result = [];

// var q = tress(function(url, callback){

//     needle.get(url, function(err, res){
//         if (err) throw err;

//         callback(); 
//     });
// });

// q.drain = function(){
//     require('fs').writeFileSync('./data.json', JSON.stringify(results, null, 4));
// }

// q.push(URL);

// needle.get(URL, function(err, res){
//     if (err) throw err;
//     console.log(res.body);
//     console.log(res.statusCode);
// });
var tress = require('tress');
var needle = require('needle');
var domjs = require('domjs');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

var URL = 'https://72.ru';
var results = [];

var q = tress(function(url, callback){
    needle.get(url, function(err, res){
        if (err) throw err;

        // парсим DOM
        var $ = cheerio.load(res.body);

        // console.log(res.body);
        //информация о новости
        // console.log($('h3.BRen>a').attr('href'),"\n");
        var old = 0;
        console.log( $('h3[data-vr-headline].BRen a').length );
        $('h3[data-vr-headline].BRen>a').each(function() {
            if(){
                
                console.log("URL: "+URL+$(this).attr("href"));
            }
        });

        console.log( $("picture>img").length );
        $("picture>img").each(function(){
            if(i!=0){
                console.log($(this).attr("data-src"));
                i = 0;
            }
            i++;
            
        });

        console.log( $('h3.BRen').length );
        $('h3.BRen').each(function(){
            if(i!=0){
                console.log($(this).text().split(" ").slice(0,10).join(" ")+"...");
                i = 0;
            }
            i++;
        });
        
        // console.log($('h3.BRen').text());

        // if($('.b_infopost').contents().eq(2).text().trim().slice(0, -1) === 'Алексей Козлов'){
        //     results.push({
        //         title: $('h1').text(),
        //         date: $('.b_infopost>.date').text(),
        //         href: url,
        //         size: $('.newsbody').text().length
        //     });
        // }

        //список новостей
        // $('.b_rewiev p>a').each(function() {
        //     q.push($(this).attr('href'));
        // });

        //паджинатор
        // $('.bpr_next>a').each(function() {
        //     // не забываем привести относительный адрес ссылки к абсолютному
        //     q.push(resolve(URL, $(this).attr('href')));
        // });

        callback();
    });
}, 10); // запускаем 10 параллельных потоков

q.drain = function(){
    fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
}

q.push(URL);