require('./home/index.scss');

var $ = require('jquery');

$.get('home/info',function(res){
    console.log(res);
});