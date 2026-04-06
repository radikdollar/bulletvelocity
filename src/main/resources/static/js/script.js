let globalPlaybackRate = 1.0;
let activeAnimations = [];
let numberAnimFrame = null; // Переменная для контроля анимации чисел

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

// Перетаскивание мышью (Движение камеры вправо/влево)
document.body.addEventListener('mousedown', (e) => {
    if (e.target.closest('.control-panel') || e.target.closest('.zoom-panel') || e.target.closest('.bg-switcher')) return;

    e.preventDefault(); // Предотвращаем случайное выделение текста

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

    // Ограничение перемещения камеры
    // maxPan: сдвиг вправо (камера смотрит влево) - не даем уйти за пушку
    const maxPan = window.innerWidth * 0.15;
    // minPan: сдвиг влево (камера смотрит вправо) - оставляем запас для обзора маятника
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

// --- ИСПРАВЛЕНИЕ: Координаты точного попадания пули в мишень ---
// Левый край блока (ширина 80px) находится на 50vw - 40px
// Мишень (-4px) находится на 50vw - 44px
// Чтобы правый край пули (ширина 20px) коснулся мишени, пуля должна остановиться на (50vw - 44px) - 20px = 50vw - 64px
const TARGET_LEFT_PX = 'calc(50vw - 64px)';
const EPICENTER_PX = 'calc(50vw - 44px)'; // Эпицентр взрыва прямо на металлической пластине

// --- Эпичные спецэффекты ---
function createImpactEffect() {
    const container = document.getElementById('simulation-container');
    const startLeft = EPICENTER_PX;
    const startTop = 'calc(50vh + 45px)';

    // 0. Ослепительная вспышка (Glow)
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

    // 1. Двойная ударная волна
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

    // 2. Эпичные искры (Имитация разлета и гравитации)
    for(let i=0; i < 40; i++) {
        const spark = document.createElement('div');
        spark.className = 'particle';
        const size = Math.random() * 6 + 2;
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';

        // Температурные цвета искр
        const colors = ['#ffffff', '#ffea8c', '#ffaa00', '#ff3300'];
        spark.style.background = colors[Math.floor(Math.random() * colors.length)];
        spark.style.boxShadow = `0 0 ${size*2}px ${spark.style.background}`;
        spark.style.left = startLeft;
        spark.style.top = startTop;
        container.appendChild(spark);

        // Разлет (мощный конус преимущественно назад и вверх/вниз)
        const angle = (Math.random() * 180 - 90) * (Math.PI / 180);
        const velocity = Math.random() * 300 + 100; // Увеличенная скорость
        const tx = -Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        // Физика гравитации (опускание к концу анимации)
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

// --- Отрисовка стильной шкалы (Транспортира) ---
function drawScale() {
    const svg = document.getElementById('scale-container');
    svg.innerHTML = '';

    // Маятник крепится по центру сверху (50%, 0)
    // Радиус маятника - 50vh.
    const vh = window.innerHeight;
    const R = vh * 0.5 + 40; // 50vh нить + 40px половина блока
    const cx = vh / 2; // Центр SVG по X (ширина SVG 100vh)
    const cy = 0;      // Центр по Y

    // Рисуем дугу (только правую часть от 0 до 60 градусов)
    for(let angle = 0; angle <= 60; angle += 5) {
        const rad = angle * (Math.PI / 180);
        const isMajor = angle % 10 === 0;

        // Маятник отклоняется вправо
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

    // Настройка viewBox, чтобы центр был правильным
    svg.setAttribute("viewBox", `0 0 ${vh} ${vh}`);
}

// Вызываем при загрузке и при изменении размера окна
window.addEventListener('load', drawScale);
window.addEventListener('resize', drawScale);

// --- Управление временем (Slow Motion) ---
function updateTimeScale(val) {
    globalPlaybackRate = parseFloat(val);
    document.getElementById('timeVal').innerText = globalPlaybackRate.toFixed(1) + 'x';

    // Применяем скорость ко всем активным анимациям "на лету"
    activeAnimations.forEach(anim => {
        if(anim.playState !== 'finished' && anim.playState !== 'idle') {
            anim.playbackRate = globalPlaybackRate;
        }
    });
}

// --- Сброс симуляции ---
function resetSimulation() {
    // Отменяем все анимации
    activeAnimations.forEach(anim => anim.cancel());
    activeAnimations = [];

    // ПРИНУДИТЕЛЬНАЯ ОЧИСТКА: Удаляем зависшие спецэффекты из DOM, если анимация была прервана сбросом
    document.querySelectorAll('.particle, .shockwave, .impact-flash').forEach(el => el.remove());

    // Останавливаем бегущие цифры, если они еще работают
    if (numberAnimFrame) {
        cancelAnimationFrame(numberAnimFrame);
        numberAnimFrame = null;
    }

    // Возвращаем элементы на исходные позиции (Точно 0 градусов)
    document.getElementById('launcher').style.transform = '';
    document.getElementById('flash').style.opacity = '0';
    document.getElementById('bullet').style.opacity = '0';
    document.getElementById('bullet').style.left = 'calc(8vw + 200px)';
    document.getElementById('bullet').style.top = 'calc(50vh + 30px)';
    document.getElementById('bullet').style.transform = '';
    document.getElementById('pendulum').style.transform = 'rotate(0deg)';

    // Сброс UI
    document.getElementById('velocity-result').innerHTML = '0.00 <span>м/с</span>';
    document.getElementById('fireBtn').disabled = false;
    document.getElementById('fireBtn').innerText = "Выстрел";
}

// --- Анимация бегущих цифр ---
function animateValue(id, start, end, duration) {
    if (numberAnimFrame) cancelAnimationFrame(numberAnimFrame);
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Формула плавного замедления (easeOutExpo)
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = (start + (end - start) * easeOut).toFixed(2);

        obj.innerHTML = `${currentVal} <span>м/с</span>`;

        if (progress < 1) {
            numberAnimFrame = window.requestAnimationFrame(step);
        }
    };
    numberAnimFrame = window.requestAnimationFrame(step);
}

// Вспомогательная функция для запуска анимаций с учетом времени
function playAnim(element, keyframes, options) {
    const anim = element.animate(keyframes, options);
    anim.playbackRate = globalPlaybackRate;
    activeAnimations.push(anim);
    return anim;
}

// --- Основной расчет ---
async function performExperiment() {
    resetSimulation(); // Очищаем перед новым выстрелом

    const bulletMass = parseFloat(document.getElementById('bulletMass').value);
    const pendulumMass = parseFloat(document.getElementById('pendulumMass').value);
    const heightCm = parseFloat(document.getElementById('height').value);

    if(!bulletMass || !pendulumMass || !heightCm) {
        alert("Пожалуйста, заполните все параметры!");
        return;
    }

    const button = document.getElementById('fireBtn');
    button.disabled = true;
    button.innerText = "В процессе...";

    let formattedVelocity = "0.00";

    try {
        // Пытаемся вызвать API (если сервер Spring Boot включен)
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bulletMass, pendulumMass, height: heightCm })
        });

        if (response.ok) {
            const data = await response.json();
            formattedVelocity = data.formattedVelocity;
        } else {
            throw new Error("Server error");
        }
    } catch (error) {
        // ЛОКАЛЬНЫЙ ФОЛЛБЕК (Расчет прямо в JS, если API недоступно)
        console.log("Сервер недоступен. Используется локальный расчет.");
        const g = 9.81;
        const h_m = heightCm / 100; // см в метры
        const m_kg = bulletMass / 1000; // г в кг

        // v = sqrt(2gh) - макс. скорость маятника
        const v_pendulum = Math.sqrt(2 * g * h_m);
        // Закон сохранения импульса: m * v0 = (m + M) * v_pendulum
        const v0 = ((m_kg + pendulumMass) * v_pendulum) / m_kg;
        formattedVelocity = v0.toFixed(2);
    }

    triggerPhysicsAnimation(heightCm, formattedVelocity);
}

// --- Анимация физики ---
function triggerPhysicsAnimation(heightCm, resultVelocity) {
    const launcher = document.getElementById('launcher');
    const flash = document.getElementById('flash');
    const bullet = document.getElementById('bullet');
    const pendulum = document.getElementById('pendulum');
    const velocityResult = document.getElementById('velocity-result');
    const button = document.getElementById('fireBtn');

    // РАСЧЕТ УГЛА ОТКЛОНЕНИЯ
    const L_cm = 100; // Визуальная длина
    const effectiveHeight = Math.min(heightCm, L_cm - 1);
    const radians = Math.acos(1 - (effectiveHeight / L_cm));

    let angleDeg = -(radians * (180 / Math.PI));
    angleDeg = Math.max(angleDeg, -75); // Визуальный лимит угла

    // Отдача пистолета
    playAnim(launcher, [
        { transform: 'translateY(-50%) translateX(0)' },
        { transform: 'translateY(-50%) translateX(-25px)', offset: 0.1 },
        { transform: 'translateY(-50%) translateX(0)' }
    ], { duration: 500, easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)' });

    // Вспышка
    playAnim(flash, [
        { opacity: 1, transform: 'scale(1.5)' },
        { opacity: 0, transform: 'scale(0.5)' }
    ], { duration: 150, easing: 'ease-out' });

    // Полет пули (Точно к левому краю пластины)
    const bulletFly = playAnim(bullet, [
        { left: 'calc(8vw + 200px)', top: 'calc(50vh + 30px)', opacity: 1, transform: 'rotate(0deg)' },
        { left: TARGET_LEFT_PX, top: 'calc(50vh + 45px)', opacity: 1, transform: 'rotate(0deg)' }
    ], { duration: 200, easing: 'linear', fill: 'forwards' });

    // После точного попадания пули в маятник
    bulletFly.onfinish = () => {
        // Запуск эпичного спецэффекта
        createImpactEffect();

        // Падение пули (отскок от пластины)
        playAnim(bullet, [
            { left: TARGET_LEFT_PX, top: 'calc(50vh + 45px)', transform: 'rotate(0deg)', opacity: 1 },
            { left: `calc(${TARGET_LEFT_PX} - 20px)`, top: '100vh', transform: 'rotate(-45deg)', opacity: 0 }
        ], { duration: 700, easing: 'ease-in', fill: 'forwards' });

        // ИСПРАВЛЕНИЕ МАТЕМАТИКИ МАЯТНИКА (Всегда встает на 0)
        const frames = 150;
        const duration = 6000;
        const keyframes = [];

        // Делаем частоту кратной числу ПИ, чтобы последний кадр синусоиды идеально совпадал с нулем
        const freq = 5 * Math.PI;
        const damp = 3.5;

        // Точный расчет пика для нормализации
        const peakTime = Math.atan(freq / damp) / freq;
        const normFactor = 1 / (Math.exp(-damp * peakTime) * Math.sin(freq * peakTime));

        for (let i = 0; i <= frames; i++) {
            let t = i / frames;
            let currentAngle = angleDeg * normFactor * Math.exp(-damp * t) * Math.sin(freq * t);

            // Жесткое обнуление на последнем кадре анимации
            if (i === frames) {
                currentAngle = 0;
            }

            keyframes.push({ transform: `rotate(${currentAngle}deg)` });
        }

        playAnim(pendulum, keyframes, {
            duration: duration,
            easing: 'linear',
            fill: 'forwards'
        });

        // Выводим результат
        setTimeout(() => {
            const targetVelocity = parseFloat(resultVelocity);
            animateValue("velocity-result", 0, targetVelocity, 300 / globalPlaybackRate);

            button.disabled = false;
            button.innerText = "Выстрел";
        }, 500 / globalPlaybackRate);
    };
}