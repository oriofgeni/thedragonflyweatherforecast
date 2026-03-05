const bgVideo = document.querySelector('.bg');
const cursor = document.querySelector('.dragonfly_cursor');
let currentClass = "";

const sounds = {
    'state-1': document.getElementById('sound1'),
    'state-2': document.getElementById('sound2'),
    'state-3': document.getElementById('sound3')
};

document.addEventListener('mousedown', (event) => {

    Object.values(sounds).forEach(s => {
        s.play().catch(e => console.log("Audio play blocked:", e));
        s.volume = 0; 
    });

    const rect = bgVideo.getBoundingClientRect();
    const relativeY = event.clientY - rect.top;
    const yPercent = relativeY / rect.height;
    
    let initialState = "";
    if (yPercent <= 0.33) initialState = 'state-1';
    else if (yPercent <= 0.66) initialState = 'state-2';
    else initialState = 'state-3';

    document.body.classList.remove('state-1', 'state-2', 'state-3');
    document.body.classList.add(initialState);
    currentClass = initialState; 
    updateAudioVolumes(initialState);
    
}, { once: true });

let lastMouseX = 0;
let lastMouseY = 0;

window.addEventListener('mousemove', (event) => {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
    createDrop(event.clientX, event.clientY);

    updateStateBasedOnMousePosition(event.clientY);
});

window.addEventListener('scroll', () => {

    updateStateBasedOnMousePosition(lastMouseY);
});

function updateStateBasedOnMousePosition(mouseY) {
    const rect = bgVideo.getBoundingClientRect();
    const relativeY = mouseY - rect.top;
    const yPercent = relativeY / rect.height;

    if (yPercent >= 0 && yPercent <= 1) {
        let newState = "";
        if (yPercent <= 0.33) newState = 'state-1';
        else if (yPercent <= 0.66) newState = 'state-2';
        else newState = 'state-3';

        if (currentClass !== newState) {
            document.body.classList.remove('state-1', 'state-2', 'state-3');
            document.body.classList.add(newState);
            currentClass = newState;
            updateAudioVolumes(newState);
        }
    }
}

function updateAudioVolumes(activeState) {
    for (let state in sounds) {
        
        if (sounds[state]) {
            sounds[state].volume = (state === activeState) ? 1 : 0;
        }
    }
}

function createDrop(x, y) {
    const drop = document.createElement('div');
    drop.className = 'drop';
    const colors = ['#f9fbfc', '#05dbf2', '#048abf', '#467b8d'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    drop.style.left = x + 'px';
    drop.style.top = y + 'px';
    drop.style.background = randomColor;
    document.body.appendChild(drop);
    setTimeout(() => { drop.remove(); }, 500);
}

let scrollSpeed = 0;
const edgeSize = 150; 
const maxSpeed = 10;  

window.addEventListener('mousemove', (e) => {
    const viewportHeight = window.innerHeight;
    const mouseY = e.clientY;

    if (mouseY < edgeSize) {
       
        scrollSpeed = -((edgeSize - mouseY) / edgeSize) * maxSpeed;
    } else if (mouseY > viewportHeight - edgeSize) {
       
        scrollSpeed = ((mouseY - (viewportHeight - edgeSize)) / edgeSize) * maxSpeed;
    } else {
       
        scrollSpeed = 0;
    }
});

function autoScroll() {
    if (scrollSpeed !== 0) {
        window.scrollBy(0, scrollSpeed);
    }
    requestAnimationFrame(autoScroll);
}

autoScroll();

const proverbImg = document.getElementById('proverb-overlay');
const triggers = document.querySelectorAll('.roundsunny, .roundcloudy, .roundrainy');

triggers.forEach(circle => {
    circle.addEventListener('mouseenter', () => {
        proverbImg.classList.add('show-proverb');
    });

    circle.addEventListener('mouseleave', () => {
        proverbImg.classList.remove('show-proverb');
    });
});