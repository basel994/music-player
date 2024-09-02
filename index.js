// Basic variables
let playState = false;
let trackIndex = 0;
let randomTrackIndex = 0;
let default_shuffle = false;

const prev = document.querySelector(".prev");
const playPause = document.querySelector(".playPause");
const next = document.querySelector(".next");
const repeat = document.querySelector(".repeat");
const shuffle = document.querySelector(".shuffle");

let default_option = "no_repeat";
let option_index = 0;
let updateTimer;
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-time");
let seek_slider = document.querySelector(".track-slider");
let vol_slider = document.querySelector(".vol-slider");
let vol_up = document.querySelector(".fa-volume-up");
let vol_down = document.querySelector(".fa-volume-down");

const repeat_options = [
    {
        option:"repeat_all",
        src: "./assests/icons/repeat.png",
    },
    {
        option: "repeat_one",
        src: "./assests/icons/repeat_track.png",
    },
    {
        option: "no_repeat",
        src: "./assests/icons/no_repeat.png",
    }
];
let uploaded_files = [];
let random_indexes = [];
let currentTrack = document.createElement("audio");
// .................. END Basic variables...................



// Welcome is the first content displayed.
// This section is for hiding the welcome and showing the music.
const welcome = document.querySelector(".welcome-container");
const start = document.querySelector(".start");
const music = document.querySelector(".music");
start.addEventListener("click", () =>{
    welcome.classList.toggle("welcome-container-hide");
    music.classList.toggle("music-show");
});
// .................. END Welcome section...................



// Upload files and start music section 
const upload_tracks = document.querySelector(".upload-tracks");
const fileInput = document.querySelector(".file-input");
const error = document.querySelector(".error");
const music_player = document.querySelector(".music-player");

// Function to verify that the uploaded file is an audio file
const isMusicFile = (file) => {
    const musicMimeTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/wma',
        'audio/aac',
        'audio/flac',
        'audio/m4a',
        // Add more MIME types for other music formats if needed
    ];

    return musicMimeTypes.includes(file.type);
}
// .................. END function...................



// EventListener for handling uploaded user files
fileInput.addEventListener("change", () => {
    let new_files = Array.from(fileInput.files);
    let check_audio = new Array(new_files.length).fill(false);
    if(new_files.length > 0){
        new_files.map((f,i) => {
            if(isMusicFile(f)){
                check_audio[i] = true;
            }
            else{
                check_audio[i] = false;
            }
        });


        if(check_audio.every(e=> e !== false)){
            uploaded_files = uploaded_files.concat(new_files);
            random_indexes = generateUniqueRandomNumbers(0, uploaded_files.length-1);
            const tracksParentDiv = document.querySelector(".tracks");
            const tracksDiv = document.querySelector(".tracks-list");
            if(tracksDiv !== null){
            tracksParentDiv.removeChild(tracksDiv);
            }
            const newTracksDiv = document.createElement("div");
            newTracksDiv.classList.add("tracks-list");
            tracksParentDiv.appendChild(newTracksDiv);
            error.classList.remove("error-show");
            const no_music_img = document.querySelector(".no-music");
            const no_music_header = document.querySelector(".no-music-header");
            if(no_music_img){
                upload_tracks.removeChild(no_music_img);
            }
            if(no_music_header) {
                upload_tracks.removeChild(no_music_header);
            }

            upload_tracks.classList.add("hide-upload-tracks");
            music_player.classList.add("show-music-player");
            playSelectedTracks();
            const empty = document.querySelector(".empty");
            if(empty) {
                tracksParentDiv.removeChild(empty);
            }
            uploaded_files.map((track,i) => {
               const divElement = document.createElement("div");
               divElement.classList.add("track");
               divElement.classList.add(`is-play${i}`);
               divElement.textContent = track.name;
               newTracksDiv.appendChild(divElement);
               divElement.addEventListener("click", () => {
                document.querySelector(`.is-play${trackIndex}`).classList.remove("track_play");
                if(default_shuffle){
                    randomTrackIndex=random_indexes.indexOf(i);
                    playSelectedTracks();
                }
                else{
                    trackIndex=i;
                    playSelectedTracks();
                }
                });
            });
        }
    else{
        error.classList.add("error-show");
        setTimeout(() => {
            error.classList.remove("error-show");
        },3000);

    }
    }
});
// .................. END EventListener...................
// .................. END Upload files section...................



// Toggle side menu
const toggle = document.querySelector(".toggle");
const grid = document.querySelector(".grid-container");
const toggleMenu = () => {
    toggle.classList.toggle("toggle-hide");
    grid.classList.toggle("grid-container-show");
}
// .................. END Toggle side menu...................



// Functions for generating array of random tracks indexes
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateUniqueRandomNumbers(min, max) {
    let numbers = [];
    for (let i = min; i <= max; i++) {
        numbers.push(i);
    }

    let shuffledNumbers = shuffleArray(numbers);
    return shuffledNumbers;
}


// .................. END Generating random indexes...................

currentTrack.load();
playPause.addEventListener("click", () => {
    playState = !playState;
    if(playState){
        currentTrack.play();
        document.querySelector(".left-note").classList.add("show-note");
        document.querySelector(".right-note").classList.add("show-note");
        playPause.classList.remove("fa-play-circle");
        playPause.classList.add("fa-pause-circle");
        curr_time.classList.remove("current-time-pause");
        console.log(currentTrack.currentTime);
    }
    else{
        currentTrack.pause();
        document.querySelector(".left-note").classList.remove("show-note");
        document.querySelector(".right-note").classList.remove("show-note");
        playPause.classList.remove("fa-pause-circle");
        playPause.classList.add("fa-play-circle");
        curr_time.classList.add("current-time-pause");
        console.log(currentTrack.currentTime);
    }
});


next.addEventListener("click", async() => {
    if(default_shuffle){
        if(randomTrackIndex+1 < random_indexes.length){
        document.querySelector(`.is-play${trackIndex}`).classList.remove("track_play");
        document.querySelector(".left-note").classList.remove("show-note");
        document.querySelector(".right-note").classList.remove("show-note");
        playState = false;
        randomTrackIndex++;
        trackIndex = random_indexes[randomTrackIndex];
        playSelectedTracks();
        }
    }
    else{
    if(trackIndex+1 < uploaded_files.length){
        document.querySelector(`.is-play${trackIndex}`).classList.remove("track_play");
        document.querySelector(".left-note").classList.remove("show-note");
        document.querySelector(".right-note").classList.remove("show-note");
        playState = false;
    trackIndex++;
    playSelectedTracks();
    }
}
});


prev.addEventListener("click", async() =>{
    if(default_shuffle){
        if(randomTrackIndex > 0){
        document.querySelector(`.is-play${trackIndex}`).classList.remove("track_play");
        document.querySelector(".left-note").classList.remove("show-note");
        document.querySelector(".right-note").classList.remove("show-note");
        playState = false;
        randomTrackIndex--;
        trackIndex = random_indexes[randomTrackIndex];
        playSelectedTracks();
        }
    }
    else{
    if(trackIndex > 0){
        document.querySelector(`.is-play${trackIndex}`).classList.remove("track_play");
        document.querySelector(".left-note").classList.remove("show-note");
        document.querySelector(".right-note").classList.remove("show-note");
        playState = false;
    trackIndex--;
    playSelectedTracks();
    }
}
});



currentTrack.addEventListener('ended', async function() {
    playPause.classList.remove("fa-pause-circle");
    playPause.classList.add("fa-play-circle");
    document.querySelector(".left-note").classList.remove("show-note");
    document.querySelector(".right-note").classList.remove("show-note");
    playState = false;
    document.querySelector(`.is-play${trackIndex}`).classList.remove("track_play");
    if(default_shuffle?trackIndex!=random_indexes[random_indexes.length-1]:trackIndex+1 < uploaded_files.length){
        if(default_option==="repeat_one"){
            playSelectedTracks();
        }
        else{
            if(default_shuffle){
                randomTrackIndex++;
            }
            else{trackIndex++;}
            playSelectedTracks();
        }
    }
    else{
        if(default_option==="repeat_all"){
            if(default_shuffle){
                randomTrackIndex=0;
            }
            else{trackIndex=0;}
            playSelectedTracks();
        }
        else if(default_option==="no_repeat"){
            currentTrack.pause();
            playState = false;
        }
        else if(default_option==="repeat_one"){
            playSelectedTracks();
        }
}
});

repeat.addEventListener("click", () => {
repeat.setAttribute("src",repeat_options[option_index].src);
default_option = repeat_options[option_index].option;
if(option_index+1 < repeat_options.length){
    option_index++;
}
else{
    option_index = 0;
}
});
shuffle.addEventListener("click", async() => {
default_shuffle = !default_shuffle;
document.querySelector(`.is-play${trackIndex}`).classList.remove("track_play");
if(default_shuffle){
    shuffle.setAttribute("src","./assests/icons/shuffle.png");
    playSelectedTracks();
}
else{
    shuffle.setAttribute("src","./assests/icons/no_shuffle.png");
    trackIndex=0;
    playSelectedTracks();
}
})
const resetValues = () => {
    curr_time.textContent = "00:00";
    curr_time.classList.remove("current-time-pause");
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
    currentTrack.pause();
  }

  const seekTo = () => {
    // Calculate the seek position by the
    // percentage of the seek slider 
    // and get the relative duration to the track
    let seekto = currentTrack.duration * (seek_slider.value / 100);
   
    // Set the current track position to the calculated seek position
    currentTrack.currentTime = seekto;
  }

  const setVolume = () => {
    currentTrack.volume = vol_slider.value / 100;
  }

  seek_slider.addEventListener("click", seekTo);
  vol_slider.addEventListener("change", setVolume);
  vol_down.addEventListener("click", () => {
    vol_slider.value = 0;
    setVolume();
  });
  vol_up.addEventListener("click", () => {
    vol_slider.value = 100;
    setVolume();
  })
  const elapsedTime = document.querySelector('.elapsed-time');
  const seekUpdate = () => {
    let seekPosition = 0;
   
    // Check if the current track duration is a legible number
    if (!isNaN(currentTrack.duration)) {
      seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);
      seek_slider.value = seekPosition;
   
      // Calculate the time left and the total duration
      let currentMinutes = Math.floor(currentTrack.currentTime / 60);
      let currentSeconds = Math.floor(currentTrack.currentTime - currentMinutes * 60);
      let durationMinutes = Math.floor(currentTrack.duration / 60);
      let durationSeconds = Math.floor(currentTrack.duration - durationMinutes * 60);
   
      // Add a zero to the single digit time values
      if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
      if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
      if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
      if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
   
      // Display the updated duration
      curr_time.textContent = currentMinutes + ":" + currentSeconds;
      total_duration.textContent = durationMinutes + ":" + durationSeconds;
      elapsedTime.style.width = seekPosition + '%';
    }
  }
const playSelectedTracks = async() => {
        clearInterval(updateTimer);
        resetValues();
        if(default_shuffle){
            trackIndex=random_indexes[randomTrackIndex];
        }
            currentTrack.src = URL.createObjectURL(uploaded_files[trackIndex]);
            currentTrack.addEventListener('loadedmetadata', async function() {
                await currentTrack.play();
                document.querySelector(`.is-play${trackIndex}`).classList.add("track_play");
                document.querySelector(".left-note").classList.add("show-note");
                document.querySelector(".right-note").classList.add("show-note");
                setVolume();
                playState = true;
                updateTimer = setInterval(seekUpdate, 1000);
                playPause.classList.remove("fa-play-circle");
                playPause.classList.add("fa-pause-circle");
                const information = document.querySelector(".information");
                information.textContent = `playing ${default_shuffle?randomTrackIndex+1:trackIndex + 1} of ${uploaded_files.length}`;

                let jsmediatags = window.jsmediatags;
                jsmediatags.read(uploaded_files[trackIndex], {
                    onSuccess: function(tag) {
                        console.log('Metadata:', tag.tags);
                        console.log('Title:', tag.tags.title);
                        console.log('Artist:', tag.tags.artist);
                        console.log('Album:', tag.tags.album);
                        console.log('Genre:', tag.tags.genre);
                        
                        // Retrieve album artwork
                        if (tag.tags.picture) {
                            const picture = tag.tags.picture;
                            const base64String = btoa(String.fromCharCode.apply(null, picture.data));
                            const imageUrl = `data:${picture.format};base64,${base64String}`;
            
                            // Display album image in an <img> element with id 'albumImage'
                            document.querySelector('.cover-image').setAttribute('src', imageUrl);
                        }
                        else {
                            document.querySelector('.cover-image').setAttribute("src","./assests/images/track_img.jpg");
                        }

            
                        // Update your UI with the extracted metadata
                        document.querySelector('.track-name').textContent = tag.tags.title || 'Unknown Title';
                        document.querySelector('.track-artist').textContent = tag.tags.artist || 'Unknown Artist';
                    },
                    onError: function(error) {
                        console.error('Error reading tags:', error);
                    }
                });
            });



        if(default_shuffle?randomTrackIndex+1 < random_indexes.length:trackIndex+1 < uploaded_files.length){
            next.removeAttribute("disabled");
            next.classList.remove("disabled");
        }
        else{
            next.setAttribute("disabled","");
            next.classList.add("disabled");
        }
        if(default_shuffle?randomTrackIndex>0:trackIndex > 0){
            prev.removeAttribute("disabled");
            prev.classList.remove("disabled");
        }
        else{
            prev.setAttribute("disabled","");
            prev.classList.add("disabled");
        }




        playPause.classList.add("fa-play-circle");

}