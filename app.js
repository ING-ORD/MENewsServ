
//Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAT7n0QCCRiCvAgOGJOy-oQjVUdl7BLj9o",
    authDomain: "menews-9b50a.firebaseapp.com",
    databaseURL: "https://menews-9b50a.firebaseio.com",
    projectId: "menews-9b50a",
    storageBucket: "",
    messagingSenderId: "402460413686",
    appId: "1:402460413686:web:ba39c52342d0b13992e6d7"
};
var firebase = require("firebase");
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

//Lib
var tress = require('tress');
var needle = require('needle');
var domjs = require('domjs');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

//Variable initialization
var URL = 'https://72.ru';
var origin = {
    "url":{},
    "imgLink":{},
    "title":{}
};
var id = 1;
var soursID = "source"+id;

//Function initialization
//find el in obj
var elementInObject = function(el, obj) {
    
    for(var key in obj){
        if (el == obj[key]){
            return true;
        }
    }
    return false;
}

//Request website
needle.get(URL, function(err, res){
    if (err) throw err;

    var $ = cheerio.load(res.body);

    for (var i = 0 ; i < $('h3[data-vr-headline].BRen a').length ; i++){
        //find element
        var link = URL+$('h3[data-vr-headline].BRen a').eq(i).attr("href");
        var title = $('h3.BRen').eq(i).text();
        var imgLink = $("picture>img").eq(i).attr("data-src");

        
        if (!(elementInObject(link,origin["url"]) ||
        elementInObject(title, origin["title"]) ||
        elementInObject(imgLink,origin["imgLink"]))){

            origin["url"][i] = link;
            origin["imgLink"][i] = imgLink;
            origin["title"][i] = title;
        }

        
    }
    
    let idAsNews = 0;
    for(let key in origin["url"]){

        let link = origin["url"][key];

        //sub request for disctiption 
        needle.get(link, function (err, res){
            if (err) throw err;
    
            let $ = cheerio.load(res.body);

            let discription = $("p[itemprop = alternativeHeadline]").text()
            let newsID = "news"+idAsNews;

            let link = origin["url"][key];
            let imgLink = origin["imgLink"][key];
            let title = origin["title"][key];


            database.ref("/newsToSourсe/"+ soursID + "/" + newsID).set({
                link,
                imgLink,
                title,
                discription
            });
            idAsNews++;
        });
    }

    // console.log(origin);
    
});



