// const xlsxParser = require("xlsx-parse-json");
const elasticsearch = require("@elastic/elasticsearch");
// const jsonfile = require("jsonfile");
// var inputFile = require("./cities.json");
// const data = require("./data.json");
// xlsxj = require("xlsx-to-json-lc");
const street = require("./street.json");

var client = new elasticsearch.Client({
	node: "http://localhost:9200",
});

// xlsxj(
// 	{
// 		input: "data-om.xlsx",
// 		output: "data-xlsx.json",
// 		lowerCaseHeaders: true, //converts excel header rows into lowercase as json keys
// 	},
// 	function (err, result) {
// 		if (err) {
// 			console.error(err);
// 		} else {
// 			console.log(result);
// 		}
// 	}
// );

// const FormattJson = () => {
// 	let copiedData = { ...data };
// 	Object.keys(data).map((key) => {
// 		data[key].map((d) => {
// 			d.geometry = {
// 				type: "Point",
// 				coordinates: [Number(d.lon), Number(d.lat)],
// 			};
// 		});
// 	});
// 	return copiedData;
// };

// let formattedJson = FormattJson();
// console.log(FormattJson());
// jsonfile.writeFile("./formatedData.json", formattedJson, {
// 	spaces: 2,
// });

const addrsData = street.loc_street;

var bulkArr = [];
(async () => {
	try {
		const response = await client.indices.create({
			index: "street_city_point",
			body: {
				mappings: {
				
					properties: {
						location: {
							type: "geo_shape",
							strategy : "recursive",	
						},
						streetName: {
							type: "text",
						
							
						},
						streetId: {
							type: "integer",
						},
						city_area: {
							type: "integer",
							
						},
						postal_code:{
							type:"integer",
							
								
						}
					},
				
			
		},
	},
		});
		console.log("street_city_point index status: ", response);
	} catch (e) {
		console.log("An error occurred while indexing street_city_point", e);
	}

	console.log("Loading street Data ----- ");
	try {
		let j = 1;

		for (let i in addrsData) {
			bulkArr.push(
				{
					index: { _index: "street_city_point", _id: j++ },
				},
				{
					streetName: addrsData[i].street,
					location: {
						"type": "linestring",
						"coordinates": addrsData[i].geometry.coordinates
					},
					streetId: addrsData[i].street_id,
					city_area: addrsData[i].city_area_id,
					postal_code:addrsData[i].postal_code,
				}
			);
		}

		const resp = client.bulk({
			index: "street_city_point",
			body: bulkArr,
		});
		console.log(resp);
	} catch (e) {
		console.log("Exception => " + e);
	}
})();

(async () => { })();

// // park
// var bulkArr = [];
// (async () => {
// 	try {
// 		const response = await client.indices.create({
// 			index: "geo_city_park",
// 			body: {
// 				mappings: {
// 					properties: {
// 						location: {
// 							type: "geo_shape",
// 							"strategy": "recursive"
// 						},
// 						name: {
// 							type: "text",
// 						},
// 						objectId: {
// 							type: "text",
// 						},
// 						GNIS: {
// 							type: "text",
// 						},
// 					},
// 				},
// 			},
// 		});
// 		console.log("geo_city_park index status: ", response);
// 	} catch (e) {
// 		console.log("An error occurred while indexing geo_city_park", e);
// 	}
// 	console.log("Loading Cities Data ----- ");
// 	try {
// 		let j = 1;

// 		for (let i in addrsDatapark) {
// 			bulkArr.push(
// 				{
// 					index: { _index: "geo_city_park", _id: j++ },
// 				},
// 				{
// 					name: addrsDatapark[i].park,
// 					location: {
// 						"type": "point",
// 						"coordinates": addrsDatapark[i].geometry.coordinates
// 					},
// 					objectId: addrsDatapark[i].park_id,
// 					GNIS: addrsDatapark[i].area,
// 				}
// 			);
// 		}

// 		const resp = client.bulk({
// 			index: "geo_city_park",
// 			body: bulkArr,
// 		});
// 		console.log(resp);
// 	} catch (e) {
// 		console.log("Exception => " + e);
// 	}
// })();

// (async () => { })();


// //medical 

// var bulkArr = [];
// (async () => {
// 	try {
// 		const response = await client.indices.create({
// 			index: "geo_city_medical",
// 			body: {
// 				mappings: {
// 					properties: {
// 						location: {
// 							"type": "geo_shape",
// 							"strategy": "recursive"
// 						},
// 						name: {
// 							type: "text",
// 						},
// 						objectId: {
// 							type: "text",
// 						},
// 						GNIS: {
// 							type: "text",
// 						},
// 					},
// 				},
// 			},
// 		});
// 		console.log("geo_city_medical index status: ", response);
// 	} catch (e) {
// 		console.log("An error occurred while indexing geo_city_medical", e);
// 	}
// 	console.log("Loading Cities Data ----- ");
// 	try {
// 		let j = 1;

// 		for (let i in addrsDatamedical) {
// 			bulkArr.push(
// 				{
// 					index: { _index: "geo_city_medical", _id: j++ },
// 				},
// 				{
// 					name: addrsDatamedical[i].street,
// 					location: {
// 						"type": "point",
// 						"coordinates": addrsDatamedical[i].geometry.coordinates,
// 					},
// 					objectId: addrsDatamedical[i].address_id,
// 					GNIS: addrsDatamedical[i].house_number,
// 				}
// 			);
// 		}

// 		const resp = client.bulk({
// 			index: "geo_city_medical",
// 			body: bulkArr,
// 		});
// 		console.log(resp);
// 	} catch (e) {
// 		console.log("Exception => " + e);
// 	}
// })();

// (async () => { })();

// //restaurant 

// var bulkArr = [];
// (async () => {
// 	try {
// 		const response = await client.indices.create({
// 			index: "geo_city_restaurant",
// 			body: {
// 				mappings: {
// 					properties: {
// 						location: {
// 							type: "geo_shape",
// 							"strategy": "recursive"
// 						},
// 						name: {
// 							type: "text",
// 						},
// 						objectId: {
// 							type: "text",
// 						},
// 						GNIS: {
// 							type: "text",
// 						},
// 					},
// 				},
// 			},
// 		});
// 		console.log("geo_city_restaurant index status: ", response);
// 	} catch (e) {
// 		console.log("An error occurred while indexing geo_city_restaurant", e);
// 	}
// 	console.log("Loading Cities Data ----- ");
// 	try {
// 		let j = 1;

// 		for (let i in addrsDatarestaurant) {
// 			bulkArr.push(
// 				{
// 					index: { _index: "geo_city_restaurant", _id: j++ },
// 				},
// 				{
// 					name: addrsDatarestaurant[i].street,
// 					location: {
// 						"type": "point",
// 						"coordinates": addrsDatarestaurant[i].geometry.coordinates
// 					},
// 					objectId: addrsDatarestaurant[i].address_id,
// 					GNIS: addrsDatarestaurant[i].house_number,
// 				}
// 			);
// 		}

// 		const resp = client.bulk({
// 			index: "geo_city_restaurant",
// 			body: bulkArr,
// 		});
// 		console.log(resp);
// 	} catch (e) {
// 		console.log("Exception => " + e);
// 	}
// })();

// (async () => { })();

// //school

// var bulkArr = [];
// (async () => {
// 	try {
// 		const response = await client.indices.create({
// 			index: "geo_city_school",
// 			body: {
// 				mappings: {
// 					properties: {
// 						location: {
// 							type: "geo_shape",
// 							"strategy": "recursive"
// 						},
// 						name: {
// 							type: "text",
// 						},
// 						objectId: {
// 							type: "text",
// 						},
// 						GNIS: {
// 							type: "text",
// 						},
// 					},
// 				},
// 			},
// 		});
// 		console.log("geo_city_school index status: ", response);
// 	} catch (e) {
// 		console.log("An error occurred while indexing geo_city_school", e);
// 	}
// 	console.log("Loading Cities Data ----- ");
// 	try {
// 		let j = 1;

// 		for (let i in addrsDataschool) {
// 			bulkArr.push(
// 				{
// 					index: { _index: "geo_city_school", _id: j++ },
// 				},
// 				{
// 					name: addrsDataschool[i].street,
// 					location: {
// 						"type": "point",
// 						"coordinates": addrsDataschool[i].geometry.coordinates
// 					},
// 					objectId: addrsDataschool[i].address_id,
// 					GNIS: addrsDataschool[i].house_number,
// 				}
// 			);
// 		}

// 		const resp = client.bulk({
// 			index: "geo_city_school",
// 			body: bulkArr,
// 		});
// 		console.log(resp);
// 	} catch (e) {
// 		console.log("Exception => " + e);
// 	}
// })();

// (async () => { })();

// //grocery

// var bulkArr = [];
// (async () => {
// 	try {
// 		const response = await client.indices.create({
// 			index: "geo_city_grocery",
// 			body: {
// 				mappings: {
// 					properties: {
// 						location: {
// 							type: "geo_shape",
// 							"strategy": "recursive"
// 						},
// 						name: {
// 							type: "text",
// 						},
// 						objectId: {
// 							type: "text",
// 						},
// 						GNIS: {
// 							type: "text",
// 						},
// 					},
// 				},
// 			},
// 		});
// 		console.log("geo_city_Grocery index status: ", response);
// 	} catch (e) {
// 		console.log("An error occurred while indexing geo_city_Grocery", e);
// 	}
// 	console.log("Loading Cities Data ----- ");
// 	try {
// 		let j = 1;

// 		for (let i in addrsDatagrocery) {
// 			bulkArr.push(
// 				{
// 					index: { _index: "geo_city_grocery", _id: j++ },
// 				},
// 				{
// 					name: addrsDatagrocery[i].street,
// 					location: {
// 						"type": "point",
// 						"coordinates": addrsDatagrocery[i].geometry.coordinates
// 					},
// 					objectId: addrsDatagrocery[i].address_id,
// 					GNIS: addrsDatagrocery[i].house_number,
// 				}
// 			);
// 		}

// 		const resp = client.bulk({
// 			index: "geo_city_grocery",
// 			body: bulkArr,
// 		});
// 		console.log(resp);
// 	} catch (e) {
// 		console.log("Exception => " + e);
// 	}
// })();

// (async () => { })();

