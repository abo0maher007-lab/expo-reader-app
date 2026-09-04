import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

// كود HTML المدمج لضمان العمل بدون مشاكل مسارات الملفات المحليّة
const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>قارئ النصوص الذكي</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Amiri&family=Cairo:wght@400;700&family=Almarai:wght@400;700&family=Tajawal:wght@400;700&family=Noto+Naskh+Arabic&family=Alexandria:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;600&family=Readex+Pro:wght@400;600&family=Vazirmatn:wght@400;700&family=El+Messiri:wght@400;700&family=Marhey:wght@400;700&family=Reem+Kufi&family=Lalezar&family=Kufam&family=Markazi+Text&family=Changa:wght@400;700&family=Baloo+Bhaijaan+2:wght@400;700&family=Lemonada:wght@400;700&family=Aref+Ruqaa&family=Mada:wght@400;700&family=Harmattan&family=Scheherazade+New&family=Lateef&family=Rakkas&family=Katibeh&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0f172a;
            --glass-bg: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.15);
            --accent-color: #38bdf8;
            --text-color: #f1f5f9;
        }
        * { box-sizing: border-box; scroll-behavior: auto !important; -webkit-tap-highlight-color: transparent; }
        body {
            font-family: 'Cairo', sans-serif;
            background: radial-gradient(circle at top left, #1e293b, #0f172a);
            color: var(--text-color);
            margin: 0;
            padding: 15px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-x: hidden;
            user-select: none;
        }
        .container { width: 100%; max-width: 900px; position: relative; }
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            width: 100%;
        }
        #input-section { padding: 25px; text-align: center; }
        textarea {
            width: 100%; height: 220px; background: rgba(0,0,0,0.3);
            border: 1px solid var(--glass-border); border-radius: 15px;
            color: white; padding: 15px; font-size: 16px; margin: 15px 0;
            resize: none; outline: none; font-family: inherit;
        }
        .btn-start {
            background: var(--accent-color); color: #000; border: none;
            padding: 15px 40px; border-radius: 12px; font-weight: bold;
            font-size: 18px; cursor: pointer; transition: 0.3s; width: 100%;
        }
        #reader-section { display: none; flex-direction: column; gap: 15px; width: 100%; }
        .toolbar-container {
            position: sticky; top: 10px; z-index: 1000;
            width: 100%; transition: transform 0.4s ease, opacity 0.3s ease;
        }
        .toolbar-container.hide-up { transform: translateY(-100px); opacity: 0; pointer-events: none; }
        .toolbar { padding: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: center; }
        .tool-group { display: flex; align-items: center; gap: 6px; }
        select, .btn-tool {
            background: rgba(255,255,255,0.1); border: 1px solid var(--glass-border);
            color: white; padding: 8px 10px; border-radius: 8px; cursor: pointer;
            font-family: 'Cairo', sans-serif; font-size: 13px;
        }
        select option { background: #1e293b; }
        .speed-controls {
            display: none; position: fixed; top: 15px; left: 50%;
            transform: translateX(-50%); background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(10px); padding: 5px 15px; border-radius: 30px;
            border: 1px solid var(--glass-border); z-index: 10000;
            align-items: center; gap: 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .speed-badge { font-size: 13px; font-weight: bold; color: var(--accent-color); min-width: 40px; text-align: center; font-family: monospace; }
        .side-controls {
            display: none; position: fixed; top: 15px; left: 15px;
            flex-direction: column; gap: 10px; z-index: 9999;
        }
        .side-btn {
            width: 40px; height: 40px; background: rgba(15, 23, 42, 0.9);
            border: 1px solid var(--glass-border); border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
        }
        .side-btn svg { width: 20px; height: 20px; fill: white; }
        #article-display {
            padding: 40px 20px; line-height: 1.9; min-height: 100vh;
            width: 100%; word-wrap: break-word; overflow-wrap: break-word;
            white-space: pre-wrap; position: relative;
        }
        .touch-indicator {
            position: fixed; width: 80px; height: 80px;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%);
            border-radius: 50%; pointer-events: none;
            transform: translate(-50%, -50%) scale(0);
            transition: transform 0.2s ease-out; z-index: 99999;
        }
        .touch-active .touch-indicator { transform: translate(-50%, -50%) scale(1.5); }
        .speed-hint {
            position: fixed; bottom: 20px; right: 20px;
            background: var(--accent-color); color: #000;
            padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 12px;
            opacity: 0; transition: 0.3s; pointer-events: none; z-index: 10000;
        }
        .touch-active .speed-hint { opacity: 1; transform: translateY(-5px); }
        body.focus-mode { padding: 0; background: #0f172a; }
        body.focus-mode .toolbar-container, body.focus-mode #input-section { display: none !important; }
        body.focus-mode .side-controls, body.focus-mode .speed-controls { display: flex; }
        body.focus-mode .container { max-width: 100%; padding: 60px 15px; }
        body.focus-mode .glass-card { border: none; box-shadow: none; background: transparent; }
        .hidden { display: none !important; }
    </style>
</head>
<body>
    <div id="touchVisual" class="touch-indicator"></div>
    <div id="speedHint" class="speed-hint">تسريع Turbo >></div>
    <div class="speed-controls" id="speedPanel">
        <button class="btn-tool" onclick="adjustSpeed(-0.1)">−</button>
        <div class="speed-badge" id="speedLabel">1.0x</div>
        <button class="btn-tool" onclick="adjustSpeed(0.1)">+</button>
    </div>
    <div class="side-controls">
        <div class="side-btn" onclick="toggleFocusMode()"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></div>
        <div class="side-btn" id="scrollBtn" onclick="toggleAutoScroll()">
            <svg id="playIcon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <svg id="pauseIcon" style="display:none;" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </div>
    </div>
    <div class="container">
        <div id="input-section" class="glass-card">
            <h2 style="color: var(--accent-color); margin-top: 0;">قارئ النصوص الذكي</h2>
            <p style="font-size: 14px; opacity: 0.8;">تحكم بالخطوط والتمرير التلقائي الذكي</p>
            <textarea id="text-input" placeholder="ألصق النص هنا..."></textarea>
            <button class="btn-start" onclick="startReading()">ابدأ القراءة</button>
        </div>
        <div id="reader-section">
            <div class="toolbar-container" id="toolbarParent">
                <div class="toolbar glass-card">
                    <div class="tool-group">
                        <select id="live-font-select" onchange="updateStyle()">
                            <option value="'Cairo', sans-serif">Cairo</option>
                            <option value="'Amiri', serif">Amiri</option>
                            <option value="'Tajawal', sans-serif">Tajawal</option>
                            <option value="'Almarai', sans-serif">Almarai</option>
                            <option value="'Readex Pro', sans-serif">Readex Pro</option>
                        </select>
                    </div>
                    <div class="tool-group">
                        <button class="btn-tool" onclick="changeFontSize(2)">+A</button>
                        <button class="btn-tool" onclick="changeFontSize(-2)">-A</button>
                    </div>
                    <div class="tool-group">
                        <button class="btn-tool" onclick="toggleFocusMode()">🔲 معاينة</button>
                        <button class="btn-tool" onclick="goBack()">إغلاق</button>
                    </div>
                </div>
            </div>
            <div id="capture-area">
                <div id="article-display" class="glass-card"></div>
            </div>
        </div>
    </div>
    <script>
        let currentSize = 22;
        let lastScrollTop = 0;
        let isScrolling = false;
        let scrollAnimationId = null;
        let currentScrollY = 0;
        let scrollSpeed = 1.0; 
        let isTouching = false;
        let boostMultiplier = 1.0;

        const toolbarContainer = document.getElementById('toolbarParent');
        const articleDisplay = document.getElementById('article-display');
        const touchVisual = document.getElementById('touchVisual');

        function handleStart(e) {
            if (!isScrolling) return;
            isTouching = true;
            document.body.classList.add('touch-active');
            updatePointerPos(e);
        }
        function handleEnd() {
            isTouching = false;
            document.body.classList.remove('touch-active');
        }
        function updatePointerPos(e) {
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            touchVisual.style.left = x + 'px';
            touchVisual.style.top = y + 'px';
        }

        articleDisplay.addEventListener('mousedown', handleStart);
        window.addEventListener('mouseup', handleEnd);
        articleDisplay.addEventListener('touchstart', handleStart);
        window.addEventListener('touchend', handleEnd);
        window.addEventListener('mousemove', (e) => isTouching && updatePointerPos(e));
        window.addEventListener('touchmove', (e) => isTouching && updatePointerPos(e));

        function smoothScrollStep() {
            if (!isScrolling) return;
            if (isTouching) {
                boostMultiplier = Math.min(boostMultiplier + 0.15, 5.0);
            } else {
                boostMultiplier = Math.max(boostMultiplier - 0.1, 1.0);
            }
            currentScrollY += (scrollSpeed * 0.7 * boostMultiplier);
            window.scrollTo(0, currentScrollY);
            if (Math.abs(window.pageYOffset - currentScrollY) > 15) {
                currentScrollY = window.pageYOffset;
            }
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2) {
                stopScroll();
                return;
            }
            scrollAnimationId = requestAnimationFrame(smoothScrollStep);
        }

        function startReading() {
            const text = document.getElementById('text-input').value;
            if (!text.trim()) return alert("يرجى إضافة نص");
            document.getElementById('input-section').classList.add('hidden');
            document.getElementById('reader-section').style.display = 'flex';
            articleDisplay.innerText = text;
            updateStyle();
        }

        function updateStyle() {
            articleDisplay.style.fontFamily = document.getElementById('live-font-select').value;
            articleDisplay.style.fontSize = currentSize + 'px';
        }

        function changeFontSize(amt) {
            currentSize += amt;
            if (currentSize < 12) currentSize = 12;
            updateStyle();
        }

        function adjustSpeed(delta) {
            scrollSpeed = Math.max(0.1, Math.min(8.0, scrollSpeed + delta));
            document.getElementById('speedLabel').innerText = scrollSpeed.toFixed(1) + 'x';
        }

        function toggleAutoScroll() {
            if (!isScrolling) {
                isScrolling = true;
                currentScrollY = window.pageYOffset;
                document.getElementById('playIcon').style.display = "none";
                document.getElementById('pauseIcon').style.display = "block";
                scrollAnimationId = requestAnimationFrame(smoothScrollStep);
            } else {
                stopScroll();
            }
        }

        function stopScroll() {
            isScrolling = false;
            cancelAnimationFrame(scrollAnimationId);
            document.getElementById('playIcon').style.display = "block";
            document.getElementById('pauseIcon').style.display = "none";
        }

        function toggleFocusMode() {
            const isFocus = document.body.classList.toggle('focus-mode');
            if (!isFocus) stopScroll();
            window.scrollTo(0, 0);
            currentScrollY = 0;
        }

        function goBack() {
            stopScroll();
            document.body.classList.remove('focus-mode');
            document.getElementById('reader-section').style.display = 'none';
            document.getElementById('input-section').classList.remove('hidden');
        }
    </script>
</body>
</html>
`;

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <WebView
        originWhitelist={['*']}
        source={{ html: HTML_CONTENT }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        scalesPageToFit={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
