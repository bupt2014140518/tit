$(document).ready(function(){
	var audio;
	$('#pause').hide();
	$('img.cover').attr('src','img/white.jpg');

    //Initialize Function
	function initAudio(element) {
		var src = element.attr('src');
		var cover = element.attr('cover');
		var song = element.text();
		//Creat Audio Object
		audio = new Audio();
		audio.src = src;
		if (!audio.currentTime) {
			$('#duration').html('0:00');
		}

		$('#audio-info').text(song);

		//Insert Cover
		$('img.cover').attr('src', 'img/' + cover);

		$('#playlist li').removeClass('active');
		element.addClass('active');
		var currentVolume = $('#volume').attr('value');
		audio.volume = currentVolume;

		//Play the playlist inOrder
		audio.addEventListener('ended', function (e) {
			$('#next').click();
		});
	}

	//Play Button
	$('#play').click(function(){
		if(!audio){
			return;
		}
		audio.play();
		$('#play').hide();
		$('#pause').show();
		$('#duration').fadeIn(400);
		showDuration();
	});

   //Pause Button
	$('#pause').click(function(){
		if(!audio){
			return;
		}
		audio.pause();
		$('#pause').hide();
		$('#play').show();
	});

    //Stop Button
	$('#stop').click(function(){
		if(!audio){
			return;
		}
		audio.pause();
		audio.currentTime = 0;
		$('#pause').hide();
		$('#play').show();
		$('#duration').fadeOut(400);
	});

   //Next Button
	$('#next').click(function(){
		if(!audio){
			return;
		}
		audio.pause();
		var next = $('#playlist li.active').next();
		if(next.length == 0){
			next = $('#playlist li:first-child');
		}
		initAudio(next);
		$('#play').click();
	});

   //Prev Button
	$('#prev').click(function(){
		if(!audio){
			return;
		}
		audio.pause();
		var prev = $('#playlist li.active').prev();
		if(prev.length == 0){
			prev = $('#playlist li:last-child');
		}
		initAudio(prev);
		$('#play').click();
	});

   //Click A Song
	$('#playlist li').click(function(){
		if(!audio){
			return;
		}
		audio.pause();
		initAudio($(this));
		audio.play();
		$('#play').hide();
		$('#pause').show();
		$('#duration').fadeIn(400);
		showDuration();
	});

   //Volume Control
	$('#volume').change(function(){
		if(!audio){
			return;
		}
		audio.volume = parseFloat(this.value / 10);
		//console.log(this.value);
	});

	//Progress Control
	$('#progressbar').click(function(ev){
		adjustPorgress(this,ev);
	});

	function adjustPorgress(dom,ev){
		var event = window.event || ev;
		var progressX = event.clientX - dom.getBoundingClientRect().left;
		console.log(dom.getBoundingClientRect().left)
		console.log(event.clientX);
		audio.currentTime = parseInt(progressX/240*audio.duration);
	}

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
			//$('#progress').css('width', value + '%');
			//播放进度条
			var progressValue = audio.currentTime/audio.duration*240;
			$('#progress').css('width',parseInt(progressValue) + 'px');
		});
	}

    //Drop Audio files
	$('#container').on({
		dragleave:function(e){
			e.stopPropagation(); //拖离
			e.preventDefault();
		},
		drop:function(e){  //拖后放
			e.stopPropagation();
			e.preventDefault();
			var files = e.originalEvent.dataTransfer.files;
			for (var i = files.length - 1; i >= 0; i--) {
				var file = files[i];
				var name = file.name;
				addSong(file,name);
			}
			if(files.length !== 0){

				console.log('hello');
			}
		},
		dragenter:function(e){
			e.stopPropagation();  //拖进
			e.preventDefault();
		},
		dragover:function(e){
			//拖来拖去
			e.stopPropagation();
			e.preventDefault();
		}
	});

	//Add songs
	function addSong(file,name){
		var song = [];
		if(file.type == "audio/mp3"){
			//var song = file.name; 需要在外面把name传进来，否则会被覆盖
			//console.log(song);
			// read file
			var reader = new FileReader();
			reader.onload = function (event) {
				src = event.target.result;
				// add song li to ul
				var item = "<li cover='cover.jpg' src='"+ src +"'>"+ name +"</li>";
				console.log(item);
				$('#playlist').append(item);
				//Initialize Audio
				initAudio($('#playlist li:first-child'));
			};
			reader.readAsDataURL(file);
		}
	}

});
