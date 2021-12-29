const fs = require("fs");

ElasticSearchClient = require('elasticsearchclient');

var serverOptions = {
    hosts:[
        {
            host: 'localhost',
            port: 9200
        }]
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

var qryObj = {
   
  aggs: {
    data_around_city : {
        geo_distance : {
            unit: "mi", 
            field : "location",
            origin : "47.6112, -122.3375",
            ranges : [
                { "to" : 10 },
                {"from" : 10, "to" : 50},
                {"from" : 50, "to" : 100},
                {"from" : 100}
            ]
        }
    }
}
      
}
elasticSearchClient.search('geo_cities_point', '_search', qryObj)
    .on('data', function(data) {
        console.log(JSON.parse(data))

    })
    .on('done', function(){
        // fs.writeFile('./somejson.json',JSON.parse(data), (err) => {
        //     if(err) console.log(err)
        //     if(data) console.log(data)
        // })
        //always returns 0 right now
    })
    .on('error', function(error){
        console.log(error)
    })
   .exec()
// elasticSearchClient.search('geo_cities_point', '_search', qryObj, function(err, data){
//     console.log(JSON.parse(data))
//     fs.writeFile('./somejson.json',JSON.parse(data), (err) => {
//         if(err) console.log(err)
//         if(data) console.log(data)
//     })
//  })