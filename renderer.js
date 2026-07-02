const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

const video = document.getElementById('main-video');
const playBtn = document.getElementById('btn-play-pause');
const stopBtn = document.getElementById('btn-stop');
const seekBar = document.getElementById('seek-bar');
const timeDisplay = document.getElementById('time-display');
const volSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('btn-mute');
const subOverlay = document.getElementById('subtitle-overlay');
const subBtn = document.getElementById('btn-sub-toggle');
const subModal = document.getElementById('sub-settings');
const fsBtn = document.getElementById('btn-fullscreen');
const dropZone = document.getElementById('drop-zone');

let subtitles = [];
let subEnabled = true;
let subOffset = 0;

document.ondragover = (e) => {
    e.preventDefault();
};

document.ondrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.mp4')) {
        loadVideo(file.path);
    }
};

document.getElementById('btn-open').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mp4';
    input.onchange = (e) => {
        if (e.target.files[0]) loadVideo(e.target.files[0].path);
    };
    input.click();
};

function loadVideo(filePath) {
    video.src = `file://${filePath}`;
    dropZone.style.display = 'none';
    video.play();
    playBtn.innerText = '||';
    
    const srtPath = filePath.substring(0, filePath.lastIndexOf(".")) + ".srt";
    if (fs.existsSync(srtPath)) {
        const data = fs.readFileSync(srtPath, 'utf8');
        parseSRT(data);
    } else {
        subtitles = [];
        subOverlay.innerHTML = '';
    }
}

function parseSRT(data) {
    subtitles = [];
    const sections = data.split(/\r?\n\r?\n/);
    for (let section of sections) {
        const lines = section.split(/\r?\n/);
        if (lines.length >= 3) {
            const timeMatch = lines[1].match(/(\d+:\d+:\d+,\d+) --> (\d+:\d+:\d+,\d+)/);
            if (timeMatch) {
                subtitles.push({
                    start: srtToSeconds(timeMatch[1]),
                    end: srtToSeconds(timeMatch[2]),
                    text: lines.slice(2).join('<br>')
                });
            }
        }
    }
}

function srtToSeconds(timeStr) {
    const parts = timeStr.replace(',', '.').split(':');
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
}

video.ontimeupdate = () => {
    const cur = video.currentTime;
    const dur = video.duration || 0;
    seekBar.value = (cur / dur) * 100 || 0;
    timeDisplay.innerText = `${formatTime(cur)} / ${formatTime(dur)}`;
    
    if (subEnabled && subtitles.length > 0) {
        const active = subtitles.find(s => (cur + subOffset) >= s.start && (cur + subOffset) <= s.end);
        subOverlay.innerHTML = active ? active.text : '';
    } else {
        subOverlay.innerHTML = '';
    }
};

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

playBtn.onclick = () => {
    if (video.paused) {
        video.play();
        playBtn.innerText = '||';
    } else {
        video.pause();
        playBtn.innerText = '▶';
    }
};

stopBtn.onclick = () => {
    video.pause();
    video.currentTime = 0;
    playBtn.innerText = '▶';
};

document.getElementById('btn-prev-frame').onclick = () => video.currentTime -= 1/30;
document.getElementById('btn-next-frame').onclick = () => video.currentTime += 1/30;

seekBar.oninput = () => {
    video.currentTime = (seekBar.value / 100) * video.duration;
};

volSlider.oninput = () => {
    video.volume = volSlider.value;
    muteBtn.innerText = video.volume === 0 ? '🔇' : '🔊';
};

muteBtn.onclick = () => {
    video.muted = !video.muted;
    muteBtn.innerText = video.muted ? '🔇' : '🔊';
};

fsBtn.onclick = toggleFullscreen;
video.ondblclick = toggleFullscreen;

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.getElementById('video-screen').requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

subBtn.onclick = () => subModal.style.display = 'block';
document.getElementById('btn-close-subs').onclick = () => subModal.style.display = 'none';

const subSize = document.getElementById('sub-size');
const subColor = document.getElementById('sub-color');
const subPos = document.getElementById('sub-pos');
const subBG = document.getElementById('sub-bg-opacity');
const subDelayInput = document.getElementById('sub-delay');

function updateSubStyles() {
    subOverlay.style.fontSize = `${subSize.value}px`;
    subOverlay.style.color = subColor.value;
    subOverlay.style.background = `rgba(0,0,0,${subBG.value})`;
    subOffset = parseFloat(subDelayInput.value) || 0;
    
    subOverlay.style.top = 'auto';
    subOverlay.style.bottom = 'auto';
    if(subPos.value === 'top') {
        subOverlay.style.top = '10%';
    } else if(subPos.value === 'middle') {
        subOverlay.style.top = '50%';
        subOverlay.style.transform = 'translateY(-50%)';
    } else {
        subOverlay.style.bottom = '10%';
        subOverlay.style.transform = 'none';
    }
}

[subSize, subColor, subPos, subBG, subDelayInput].forEach(el => el.oninput = updateSubStyles);
updateSubStyles();