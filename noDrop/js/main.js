var audio;
$('#pause').hide();

//Initialize Audio
initAudio($('#playlist li:first-child'));

//Initialize Function
function initAudio(element){
	var song = element.text();
	var cover = element.attr('cover');
	//Creat Audio Object
	audio = new Audio('media/' + song);

	if(!audio.currentTime){
		$('#duration').html('0:00');
	}

	$('#audio-info').text(song);

	//Insert Cover
	$('img.cover').attr('src','img/' + cover);

	$('#playlist li').removeClass('active');
	element.addClass('active');
	var currentVolume = $('#volume').attr('value');
	audio.volume = currentVolume;
}

//Play Button
$('#play').click(function(){
	audio.play();
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	showDuration();	
});

//Pause Button
$('#pause').click(function(){
	audio.pause();
	$('#pause').hide();
	$('#play').show();
});

//Stop Button
$('#stop').click(function(){
	audio.pause();
	audio.currentTime = 0;
	$('#pause').hide();
	$('#play').show();
	$('#duration').fadeOut(400);
});

//Next Button
$('#next').click(function(){
	audio.pause();
	var next = $('#playlist li.active').next();
	if(next.length == 0){
		next = $('#playlist li:first-child');
	}
	initAudio(next);
	audio.play();
	showDuration();
});

//Prev Button
$('#prev').click(function(){
	audio.pause();
	var prev = $('#playlist li.active').prev();
	if(prev.length == 0){
		prev = $('#playlist li:last-child');
	}
	initAudio(prev);
	audio.play();
	showDuration();
});

//Click A Song
$('#playlist li').click(function() {
	audio.pause();
	initAudio($(this));
	audio.play();
	showDuration();
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	showDuration();
});

//Volume Control
$('#volume').change(function(){
	audio.volume = parseFloat(this.value / 10);
	console.log(this.value);
});

//Time Duration
function showDuration () {
	$(audio).bind('timeupdate',function(){
		//Gert Hours & Minutes
		var s = parseInt(audio.currentTime % 60);
		var m = parseInt(audio.currentTime / 60) % 60;
		//Add 0 if less than 10
		if(s < 10){
			s = '0' + s;
		}
		$('#duration').html(m + ':' + s);
		var value = 0;
		if(audio.currentTime > 0){
			value = Math.floor((100 / audio.duration) * audio.currentTime);
		}
		$('#progress').css('width', value + '%');
	});
}
