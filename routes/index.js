var express = require('express');
var router = express.Router();
var request = require('request');





/* GET home page. */
router.get('/radioo', function(req, res, next) {
	album_info = {
		album_photo: '#',
		title: '',
		uri: '#',
		resource_url: '#',
		song_info: false,
		video_info: {
			is_video: false,
			video_url: '#',
			fb_link: '#',
			lowest_price: 0
		}
	}

	res.render('index',album_info);
});


var options = {
	headers: {'user-agent': 'node.js'}
}

router.post('/discover', function(req, res, next) {
	var setup = req.body,
		token = 'PrwFREBcgmJxCDHzelVWgSObSBOxvvgtGPXiBFeI',
		api_search = 'https://api.discogs.com/database/search?'



	request(`${api_search}genre=${setup.genre}&country=${setup.country}&year=${setup.year}&token=${token}`, options , function (error, response, body) {
		console.log(response.statusCode)
		if (!error && response.statusCode == 200) {

			var albums_collection = JSON.parse(response.body)

			var item = Math.floor(Math.random()*albums_collection.results.length);
			var thumb = albums_collection.results.length !== 0 ? albums_collection.results[item].thumb : '/img/nopreview.jpeg'
			var title = albums_collection.results.length !== 0 ? albums_collection.results[item].title : 'no matches found'
			var uri = albums_collection.results.length !== 0 ? `https://www.discogs.com/${albums_collection.results[item].uri}` : '#'
			var resource_url = albums_collection.results.length !== 0 ? albums_collection.results[item].resource_url : null

			album_info = {
				album_photo: thumb,
				title: title,
				uri: uri,
				resource_url: resource_url,
				song_info: true,
				video_info: {}
			}


			if(album_info.resource_url){
				request(`${resource_url}`, options , function (error, response, body) {
					if (!error && response.statusCode == 200) {

						var random_album_data = JSON.parse(response.body)
						var lowest_price = random_album_data.lowest_price ? `${Math.round(random_album_data.lowest_price)}$` : '$'
						
						if(random_album_data.videos){
							var ytb_url = random_album_data.videos[0].uri
							var iframe_url = ytb_url.replace('watch?v=','embed/') + '?autoplay=1';
							var fb_url = `https://www.facebook.com/sharer/sharer.php?u=${ytb_url}`;
							album_info.video_info ={
								is_video: true,
								video_url: iframe_url,
								fb_link: fb_url,
								lowest_price: lowest_price
							}
							res.send(album_info)
						}else{
							album_info.video_info ={
								is_video: false,
								video_url: '#',
								fb_link: '#',
								lowest_price: lowest_price
							}
							res.send(album_info)

						}

					}
				})
			}else{
				album_info = {
					album_photo: '#',
					title: '',
					uri: '#',
					resource_url: '#',
					song_info: false,
					video_info: {
						is_video: false,
						video_url: '#',
						fb_link: '#',
						lowest_price: 0
					}
				}
				
				
				/*res.send({
					album_info: album_info
				})*/
				res.render('users',{album_info})
			}

			/*res.send(album_info)*/
			/*res.render('index',{album_info})*/



		}
	})
});
module.exports = router;

