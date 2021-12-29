'use strict'

const formattedJson = require("./formatedData.json");
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })
var geojsonExtent = require('geojson-extent');


  
  
async function run() {
	//   // Let's start by indexing some data
	//   await client.index({
	//     index: 'geo_cities_point',
	//     body: {
	//       character: 'Ned Stark',
	//       quote: 'Winter is coming.'
	//     }
	//   })

	//   await client.index({
	//     index: 'geo_cities_point',
	//     body: {
	//       character: 'Daenerys Targaryen',
	//       quote: 'I am the blood of the dragon.'
	//     }
	//   })

	//   await client.index({
	//     index: 'geo_cities_point',
	//     // here we are forcing an index refresh,
	//     // otherwise we will not get any result
	//     // in the consequent search
	//     refresh: true,
	//     body: {
	//       character: 'Tyrion Lannister',
	//       quote: 'A mind needs books like a sword needs a whetstone.'
	//     }
	//   })

	// Let's search!

	
		console.log("nest_city_point index status: ", geojsonExtent({ type: 'Point', coordinates: [ 14.42618833,
			50.07472389] }))
	const addressDatapark = formattedJson.loc_park;
	const addressDataschool = formattedJson.loc_school;
	const addressDatagrocery = formattedJson.loc_grocery;
	const addressDatamedical = formattedJson.loc_medical;
	const addressDatarestaurant = formattedJson.loc_restaurant;

	// distance between city points and schools

	for (let i = 0; i < addressDatarestaurant.length; i++) {
		const { body } = await client.search({
			index: 'geo_city_point',
			body: {
				"query": {
					"bool": {
						"must": {
							"match_all": {}
						},
						"filter": {
							"geo_shape": {
								"location": {
									"shape": {
										"type": "circle",
										"radius": "95km",
										"coordinates": [Number(addressDatarestaurant[i].lon), Number(addressDatarestaurant[i].lat)]
									},
									"relation": "within"
								}
							}
						}
					}
				}
			}
		});

		console.log(body.hits.hits)
	}

	// const { body } = await client.search({
	// 	index: 'geo_city_point',
	// 	body: {
	// 		"query": {
	// 			"bool": {
	// 				"must": {
	// 					"match_all": {}
	// 				},
	// 				"filter": {
	// 					"geo_shape": {
	// 						"location": {
	// 							"shape": {
	// 								"type": "circle",
	// 								"radius": "95km",
	// 								"coordinates": [15.75, 50.25]
	// 							},
	// 							"relation": "within"
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// });

	// console.log(body.hits.hits)
}

run().catch(console.log)
