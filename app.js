// Copyright 2018, Google LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// require nodeJS http module
const https = require("https");
const fs = require('fs');
var url = 'https://data.lass-net.org/data/last-all-airbox.json';
var data;
var obj;

const express = require('express');

const app = express();

// [START hello_world]
// index
app.get('/', (req, res) => {
	res.status(200).send('Hello, world!');
	console.log('there\'s someone in index page!');
});
// End index

// second
app.get('/3*2', (req, res) => {
	res.send('here is 32');
	console.log('there\'s someone in 3*2 page!');
});
// End second

app.get('/json', (req, res) => {
	//res.setHeader('Content-Type', 'application/json');
	//res.send(data);

	// Get From HTTP
	https.get(url, function(response) {
		data = '';
		// response event 'data' 當 data 陸續接收的時候，用一個變數累加它。
		response.on('data', function(chunk) {
			data += chunk;
		});
		// response event 'end' 當接收 data 結束的時候。
		response.on('end', function() {
			// 將 JSON parse 成物件
			data = JSON.parse(data);
			data = data.feeds; // Seperate feeds from all data
			data.forEach(function(element, index, arr) {
				delete element.ver_app;
				delete element.app;
				delete element.ver_format;
				//console.log(element);
				//console.log('\n');
			}, function() {
				//console.log('complete');
			});
			//delete data


			// 對 data 做處理，寫你的 code !!
			/* 儲存成 JSON
			 * fs.writeFile 使用 File System 的 writeFile 方法做儲存
			 * 傳入三個參數（ 存檔名, 資料, 格式 ）
			 */
			fs.writeFile('save.json', JSON.stringify( data ), function(err){});
		});
	}).on('error', function(e){ // http get 錯誤時
		  console.log(e);
	});

	res.setHeader('Content-Type', 'application/json');
	res.send(data);
	console.log(data);
	console.log('Json Page browsed.');
	//console.log(data.feeds[0].SiteName);
});



if (module === require.main) {
  // [START server]
  // Start the server
	const server = app.listen(process.env.PORT || 8080, () => {
		const port = server.address().port;
		console.log(`App listening on port ${port}`);
	});
  // [END server]
}

module.exports = app;
