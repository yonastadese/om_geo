var elasticsearch = require("@elastic/elasticsearch");
var client = new elasticsearch.Client({
    node: "http://localhost:9200",
});
var inputFile = require('./small.json');
var bulkArr = [];


client.indices.putMapping({
  index: 'new_points',
  type: 'cities',
  body: {
    properties: {
        "name": {
            "type": "string"
          },
        "location": {
        "type": "geo_point",
      },
      
      "objectId": {
        "type": "text",
    },
    "GNIS": {
        "type": "text",
    },
    "locid":{
        "type":"keyword",
        
            
    }
    }
  }
}, (err, resp, status) => {
    if (err) throw err;
    console.log(resp);
});


function makeBulk(input, callback) {
        let j = 1;
        for (let i in input) {
                bulkArr.push(
                        {index: {_index: 'new_points', _type: 'cities', _id: j++}},
                        {
                                'name': input[i].street,
                                'location': input[i].geometry.coordinates,
                                'objectId': input[i].address_id,
                                'GNIS': input[i].city_id,
                                'locid':input[i].type_id,
                        }
                );
        }
        console.log(bulkArr);
        callback(bulkArr);
}


function indexAll(bulkDocs, callback) {
        client.bulk({
                index: 'new_points',
                type: 'cities',
                body: bulkDocs
        }, function(err, resp, status) {
                if (err) console.log(err);
                callback(resp);
        });
}

makeBulk(inputFile, function(resp) {
        indexAll(resp, function(resp) {
                console.log(resp.items);
        });
});
