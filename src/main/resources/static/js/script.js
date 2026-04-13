let globalPlaybackRate = 1.0;
let activeAnimations = [];
let numberAnimFrame = null;

// --- Управление фонами (Стиль) ---
const backgrounds = ['bg-leopard', 'bg-tiger', 'bg-linen', 'bg-space'];
let currentBgIndex = 0;
function cycleBackground() {
    document.body.classList.remove(backgrounds[currentBgIndex]);
    currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
    document.body.classList.add(backgrounds[currentBgIndex]);
}

// --- Управление обзором (Панорамирование и Зум) ---
let currentZoom = 1.0;
let currentPanX = 0;
let isDraggingView = false;
let startDragX = 0;
let startPanX = 0;

function updateView() {
    document.getElementById('simulation-container').style.transform = `scale(${currentZoom}) translateX(${currentPanX}px)`;
}

function setZoom(val) {
    currentZoom = parseFloat(val);
    document.getElementById('zoomScale').value = currentZoom;
    updateView();
}

function changeZoom(delta) {
    let newVal = currentZoom + delta;
    newVal = Math.max(0.4, Math.min(2.0, newVal));
    setZoom(newVal);
}

function resetView() {
    currentZoom = 1.0;
    currentPanX = 0;
    document.getElementById('zoomScale').value = 1.0;
    updateView();
}

// Перетаскивание мышью
document.body.addEventListener('mousedown', (e) => {
    if (e.target.closest('.control-panel') || e.target.closest('.zoom-panel') || e.target.closest('.bg-switcher')) return;
    e.preventDefault();
    isDraggingView = true;
    startDragX = e.clientX;
    startPanX = currentPanX;
    document.body.style.cursor = 'grabbing';
    document.getElementById('simulation-container').classList.add('dragging');
});

window.addEventListener('mousemove', (e) => {
    if (!isDraggingView) return;
    const deltaX = (e.clientX - startDragX) / currentZoom;
    let newPan = startPanX + deltaX;
    const maxPan = window.innerWidth * 0.15;
    const minPan = -window.innerWidth * 0.6;
    currentPanX = Math.max(minPan, Math.min(maxPan, newPan));
    updateView();
});

window.addEventListener('mouseup', () => {
    isDraggingView = false;
    document.body.style.cursor = 'grab';
    document.getElementById('simulation-container').classList.remove('dragging');
});
window.addEventListener('mouseleave', () => {
    isDraggingView = false;
    document.body.style.cursor = 'grab';
    document.getElementById('simulation-container').classList.remove('dragging');
});

const TARGET_LEFT_PX = 'calc(50vw - 64px)';
const EPICENTER_PX = 'calc(50vw - 44px)';

// --- Эпичные спецэффекты ---
function createImpactEffect() {
    const container = document.getElementById('simulation-container');
    const startLeft = EPICENTER_PX;
    const startTop = 'calc(50vh + 45px)';

    const flash = document.createElement('div');
    flash.className = 'impact-flash';
    flash.style.left = startLeft;
    flash.style.top = startTop;
    container.appendChild(flash);

    const flashAnim = flash.animate([
        { opacity: 1, transform: 'translate(-50%, -50%) scale(0.2)' },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(1.5)' }
    ], { duration: 400, easing: 'ease-out' });
    flashAnim.playbackRate = globalPlaybackRate;
    flashAnim.onfinish = () => flash.remove();

    for (let w = 0; w < 2; w++) {
        const wave = document.createElement('div');
        wave.className = 'shockwave';
        wave.style.left = startLeft;
        wave.style.top = startTop;
        container.appendChild(wave);

        const waveAnim = wave.animate([
            { width: '0px', height: '0px', opacity: 1, borderWidth: '8px' },
            { width: w === 0 ? '250px' : '150px', height: w === 0 ? '250px' : '150px', opacity: 0, borderWidth: '1px' }
        ], { duration: 600 + (w*200), easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)', delay: w * 50 });
        waveAnim.playbackRate = globalPlaybackRate;
        activeAnimations.push(waveAnim);
        waveAnim.onfinish = () => wave.remove();
    }

    for(let i=0; i < 40; i++) {
        const spark = document.createElement('div');
        spark.className = 'particle';
        const size = Math.random() * 6 + 2;
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';

        const colors = ['#ffffff', '#ffea8c', '#ffaa00', '#ff3300'];
        spark.style.background = colors[Math.floor(Math.random() * colors.length)];
        spark.style.boxShadow = `0 0 ${size*2}px ${spark.style.background}`;
        spark.style.left = startLeft;
        spark.style.top = startTop;
        container.appendChild(spark);

        const angle = (Math.random() * 180 - 90) * (Math.PI / 180);
        const velocity = Math.random() * 300 + 100;
        const tx = -Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const drop = Math.random() * 150 + 50;

        const sparkAnim = spark.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx*0.5}px, ${ty*0.5 - drop*0.2}px) scale(0.8)`, opacity: 0.9, offset: 0.5 },
            { transform: `translate(${tx}px, ${ty + drop}px) scale(0)`, opacity: 0 }
        ], { duration: 800 + Math.random()*800, easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)' });
        sparkAnim.playbackRate = globalPlaybackRate;
        activeAnimations.push(sparkAnim);
        sparkAnim.onfinish = () => spark.remove();
    }
}

// --- Отрисовка стильной шкалы ---
function drawScale() {
    const svg = document.getElementById('scale-container');
    if (!svg) return;
    svg.innerHTML = '';

    const vh = window.innerHeight;
    const R = vh * 0.5 + 40;
    const cx = vh / 2;
    const cy = 0;

    for(let angle = 0; angle <= 60; angle += 5) {
        const rad = angle * (Math.PI / 180);
        const isMajor = angle % 10 === 0;

        const x1 = cx + (R + (isMajor ? 10 : 5)) * Math.sin(rad);
        const y1 = cy + (R + (isMajor ? 10 : 5)) * Math.cos(rad);
        const x2 = cx + R * Math.sin(rad);
        const y2 = cy + R * Math.cos(rad);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("class", isMajor ? "scale-line-major" : "scale-line");
        svg.appendChild(line);

        if (isMajor) {
            const tx = cx + (R + 25) * Math.sin(rad);
            const ty = cy + (R + 25) * Math.cos(rad);
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", tx);
            text.setAttribute("y", ty);
            text.setAttribute("class", "scale-text");
            text.textContent = angle + "°";
            svg.appendChild(text);
        }
    }
    svg.setAttribute("viewBox", `0 0 ${vh} ${vh}`);
}

window.addEventListener('resize', drawScale);

// --- Управление временем (Slow Motion) ---
function updateTimeScale(val) {
    globalPlaybackRate = parseFloat(val);
    document.getElementById('timeVal').innerText = globalPlaybackRate.toFixed(1) + 'x';

    activeAnimations.forEach(anim => {
        if(anim.playState !== 'finished' && anim.playState !== 'idle') {
            anim.playbackRate = globalPlaybackRate;
        }
    });
}

// --- Сброс визуальной части ---
function resetSimulationVisuals() {
    activeAnimations.forEach(anim => anim.cancel());
    activeAnimations = [];
    document.querySelectorAll('.particle, .shockwave, .impact-flash').forEach(el => el.remove());

    if (numberAnimFrame) {
        cancelAnimationFrame(numberAnimFrame);
        numberAnimFrame = null;
    }

    document.getElementById('launcher').style.transform = '';
    document.getElementById('flash').style.opacity = '0';
    document.getElementById('bullet').style.opacity = '0';
    document.getElementById('bullet').style.left = 'calc(8vw + 200px)';
    document.getElementById('bullet').style.top = 'calc(50vh + 30px)';
    document.getElementById('bullet').style.transform = '';
    document.getElementById('pendulum').style.transform = 'rotate(0deg)';

    // Кнопка "Выстрел" теперь типа submit, но на всякий случай включаем её визуально
    const fireBtn = document.getElementById('fireBtn');
    if(fireBtn) {
        fireBtn.disabled = false;
        fireBtn.innerText = "Выстрел";
    }
}

// --- Анимация бегущих цифр ---
function animateValue(id, start, end, duration) {
    if (numberAnimFrame) cancelAnimationFrame(numberAnimFrame);
    const obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = (start + (end - start) * easeOut).toFixed(2);

        obj.innerHTML = `${currentVal} <span>м/с</span>`;

        if (progress < 1) {
            numberAnimFrame = window.requestAnimationFrame(step);
        }
    };
    numberAnimFrame = window.requestAnimationFrame(step);
}

function playAnim(element, keyframes, options) {
    const anim = element.animate(keyframes, options);
    anim.playbackRate = globalPlaybackRate;
    activeAnimations.push(anim);
    return anim;
}

// --- Анимация физики (Теперь вызывается автоматически после загрузки) ---
function triggerPhysicsAnimation(heightCm, resultVelocity) {
    resetSimulationVisuals(); // Очищаем всё перед стартом

    const launcher = document.getElementById('launcher');
    const flash = document.getElementById('flash');
    const bullet = document.getElementById('bullet');
    const pendulum = document.getElementById('pendulum');
    const button = document.getElementById('fireBtn');

    if(button) {
        button.disabled = true;
        button.innerText = "В процессе...";
    }

    const L_cm = 100;
    const effectiveHeight = Math.min(heightCm, L_cm - 1);
    const radians = Math.acos(1 - (effectiveHeight / L_cm));

    let angleDeg = -(radians * (180 / Math.PI));
    angleDeg = Math.max(angleDeg, -75);

    playAnim(launcher, [
        { transform: 'translateY(-50%) translateX(0)' },
        { transform: 'translateY(-50%) translateX(-25px)', offset: 0.1 },
        { transform: 'translateY(-50%) translateX(0)' }
    ], { duration: 500, easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)' });

    playAnim(flash, [
        { opacity: 1, transform: 'scale(1.5)' },
        { opacity: 0, transform: 'scale(0.5)' }
    ], { duration: 150, easing: 'ease-out' });

    const bulletFly = playAnim(bullet, [
        { left: 'calc(8vw + 200px)', top: 'calc(50vh + 30px)', opacity: 1, transform: 'rotate(0deg)' },
        { left: TARGET_LEFT_PX, top: 'calc(50vh + 45px)', opacity: 1, transform: 'rotate(0deg)' }
    ], { duration: 200, easing: 'linear', fill: 'forwards' });

    bulletFly.onfinish = () => {
        createImpactEffect();

        playAnim(bullet, [
            { left: TARGET_LEFT_PX, top: 'calc(50vh + 45px)', transform: 'rotate(0deg)', opacity: 1 },
            { left: `calc(${TARGET_LEFT_PX} - 20px)`, top: '100vh', transform: 'rotate(-45deg)', opacity: 0 }
        ], { duration: 700, easing: 'ease-in', fill: 'forwards' });

        const frames = 150;
        const duration = 6000;
        const keyframes = [];

        const freq = 5 * Math.PI;
        const damp = 3.5;
        const peakTime = Math.atan(freq / damp) / freq;
        const normFactor = 1 / (Math.exp(-damp * peakTime) * Math.sin(freq * peakTime));

        for (let i = 0; i <= frames; i++) {
            let t = i / frames;
            let currentAngle = angleDeg * normFactor * Math.exp(-damp * t) * Math.sin(freq * t);
            if (i === frames) currentAngle = 0;
            keyframes.push({ transform: `rotate(${currentAngle}deg)` });
        }

        playAnim(pendulum, keyframes, {
            duration: duration,
            easing: 'linear',
            fill: 'forwards'
        });

        setTimeout(() => {
            const targetVelocity = parseFloat(resultVelocity);
            animateValue("velocity-result", 0, targetVelocity, 300 / globalPlaybackRate);

            if(button) {
                button.disabled = false;
                button.innerText = "Выстрел";
            }
        }, 500 / globalPlaybackRate);
    };
}

// --- АВТОЗАПУСК АНИМАЦИИ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ---
// Так как страница обновляется после ответа от сервера, скрипт должен сам понять,
// что нужно проиграть анимацию.
window.addEventListener('DOMContentLoaded', () => {
    drawScale(); // Рисуем шкалу

    const resultElement = document.getElementById('velocity-result');
    if (resultElement) {
        // Достаем текст, убираем неразрывные пробелы и буквы
        const resultText = resultElement.innerText.replace(/[^\d.]/g, '');
        const velocity = parseFloat(resultText);

        // Если сервер вернул скорость больше 0 (значит был выстрел)
        if (!isNaN(velocity) && velocity > 0) {
            const heightInput = document.getElementById('height');
            const heightCm = heightInput ? parseFloat(heightInput.value) : 15;

            // Запускаем анимацию!
            triggerPhysicsAnimation(heightCm, velocity);
        }
    }

    // Блокируем кнопку перед отправкой формы, чтобы избежать двойного клика
    const form = document.querySelector('form');
    if(form) {
        form.addEventListener('submit', (e) => {
            const btn = document.getElementById('fireBtn');
            if(btn) {
                btn.disabled = true;
                btn.innerText = "Считаем...";
            }
        });
    }
});