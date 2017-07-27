$( document ).ready(function() {
	var setup ={
		year: 1969,
		genre: 'Hip-Hop'
	}

	var slider = $('input.time'),
		help = $('.help'),
		flag = $('.flag')


	var rangeSlider = function(){
		slider.on('change', function(){
			setup.year = slider.val()
			$('#year').text(year)
		})
	}
	rangeSlider()

	//event handling for help tooltip
	
	help.on('click', function(){
		$('.start').toggleClass('hidden')
	})
 
	flag.on('click', function(){
		$('.mood').toggleClass('hide')
	})

	$('.mood li').on('click', function(){
		$('.mood i').removeClass('clicked')
		$(this).find('i').addClass('clicked')
		setup.genre = $(this).text()

	})
	jQuery('#vmap').vectorMap({
		map: 'world_en',
		selectedColor: '#ffcccc',
		color: '#fdfcc4',
		enableZoom: true,
		showTooltip: true,
		onRegionClick : function (element, code, region){
			//Grab the info about the country
			var country = region.replace(' ','_')
			setup.country = country
			//Making request to discogs api
			$.ajax({
				type: 'POST',
				url: '/discover',
				data: setup,
				dataType: 'json',
				success: function(data){

			    	console.log(data)

				}
			});
		},
	});

});