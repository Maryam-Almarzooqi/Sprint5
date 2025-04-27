
// script.js
let currentStep = 1;
let selectedTechnique = '';
let mainTime = 0;

// Utility to call backend
async function postToBackend(endpoint, data) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log(`Success: ${endpoint}`, result);
    } catch (error) {
        console.error(`Error calling ${endpoint}:`, error);
    }
}

// Clock
function showTime() {
    document.getElementById('currentTime').innerHTML = new Date().toUTCString();
}
showTime();
setInterval(showTime, 1000);

// Step control
function showStep(step) {
    document.querySelectorAll('.step, #final-step, #reward-step').forEach(s => s.classList.remove('active'));
    if (step === 4) document.getElementById('final-step').classList.add('active');
    else if (step === 5) document.getElementById('reward-step').classList.add('active');
    else document.getElementById(`step-${step}`).classList.add('active');
}

function nextStep() {
    if (!validateStep(currentStep)) return;
    currentStep++;
    showStep(currentStep);
}

function prevStep() {
    if (currentStep > 1 && currentStep < 4) {
        currentStep--;
        showStep(currentStep);
    }
}

// Theme setting
function setTheme(theme) {
    const root = document.documentElement;
    switch (theme) {
        case 'light':
            root.style.setProperty('--background', '#f4f9ff');
            root.style.setProperty('--card-background', '#ffffff');
            root.style.setProperty('--task-background', '#e3f2fd');
            root.style.setProperty('--text-color', '#111');
            break;
        case 'dark':
            root.style.setProperty('--background', '#1e1e2f');
            root.style.setProperty('--card-background', '#2e2e3e');
            root.style.setProperty('--task-background', '#444');
            root.style.setProperty('--text-color', '#fff');
            break;
        case 'cool':
            root.style.setProperty('--background', '#e6f0f3');
            root.style.setProperty('--card-background', '#ffffff');
            root.style.setProperty('--task-background', '#dbe9f1');
            root.style.setProperty('--text-color', '#333');
            break;
    }
    postToBackend('/api/setTheme', { theme });
}

// Technique selection
function handleTechniqueChange() {
    const technique = document.getElementById('technique').value;
    const timeInput = document.getElementById('set-time-input');
    selectedTechnique = technique;
    if (technique === 'pomodoro') {
        timeInput.value = 25;
        timeInput.disabled = true;
    } else {
        timeInput.value = '';
        timeInput.disabled = false;
    }
    postToBackend('/api/selectTechnique', { technique });
}

// Task adding
function addTask() {
    const input = document.getElementById('input-task');
    const task = input.value.trim();
    if (task) {
        const list = document.getElementById('todo-list');
        const item = document.createElement('div');
        item.className = 'todo-item';
        item.innerHTML = `<span>${task}</span><button class="remove-btn" onclick="this.parentElement.remove()">Remove</button>`;
        list.appendChild(item);
        input.value = '';
        postToBackend('/api/addTask', { task });
    }
}

// Step validation
function validateStep(step) {
    if (step === 2) {
        const technique = document.getElementById('technique').value;
        const timeValue = document.getElementById('set-time-input').value;
        const time = parseInt(timeValue, 10);
        if (!technique || (!document.getElementById('set-time-input').disabled && (time <= 0 || isNaN(time)))) {
            document.getElementById('error-step-2').innerText = 'Please select a technique and enter valid time.';
            return false;
        }
        document.getElementById('error-step-2').innerText = '';
    }
    if (step === 3) {
        const list = document.getElementById('todo-list');
        if (list.children.length === 0) {
            document.getElementById('error-step-3').innerText = 'Please add at least one task.';
            return false;
        }
        document.getElementById('error-step-3').innerText = '';
    }
    return true;
}

// Game start
function startGame() {
    if (!validateStep(3)) return;

    const technique = document.getElementById('technique').value;
    mainTime = technique === 'pomodoro' ? 25 : parseInt(document.getElementById('set-time-input').value);
    let timerSeconds = mainTime * 60;
    const progressBar = document.getElementById('progress-bar');
    const countdownEl = document.getElementById('countdown');
    const activeList = document.getElementById('active-task-list');
    const originalTasks = document.getElementById('todo-list').cloneNode(true);

    activeList.innerHTML = originalTasks.innerHTML;
    showStep(4);

    postToBackend('/api/startGame', { technique, time: mainTime });

    function startCountdown(duration, onComplete) {
        let timeLeft = duration;
        const interval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            countdownEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            progressBar.style.width = `${(timeLeft / duration) * 100}%`;
            if (timeLeft-- <= 0) {
                clearInterval(interval);
                onComplete();
            }
        }, 1000);
        return interval;
    }

    Array.from(activeList.querySelectorAll('.remove-btn')).forEach(btn => {
        btn.textContent = '✔️';
        btn.onclick = function () {
            this.parentElement.remove();
            if (!activeList.children.length) {
                document.querySelector('#final-step h3').style.display = 'none';
                clearInterval(timerInterval);
                if (technique === 'pomodoro') startBreak();
                else showReward();
            }
        };
    });

    let timerInterval = startCountdown(timerSeconds, () => {
        if (technique === 'pomodoro') startBreak();
        else showReward();
    });

    function startBreak() {
        document.getElementById('timer-label').textContent = "🧘 Break Time:";
        startCountdown(5 * 60, showReward);
    }
}

// Reward screen
function showReward() {
    const rewards = [
        "🍫 Eat a chocolate",
        "📺 Watch an episode",
        "🎮 Play a game",
        "🎧 Listen to music",
        "📱 Scroll social media"
    ];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    document.getElementById('reward-text').textContent = reward;
    showStep(5);

    postToBackend('/api/rewardEarned', { reward });
}

// Initial theme
window.onload = () => setTheme('dark');
