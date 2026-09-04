import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>قارئ النصوص الذكي</title>
    <style>
        :root {
            --bg-color: #0f172a;
            --glass-bg: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.15);
            --accent-color: #38bdf8;
            --text-color: #f1f5f9;
        }
        * { box-sizing: border-box; }
        body {
            font-family: sans-serif;
            background: #0f172a;
            color: var(--text-color);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .container { width: 100%; max-width: 900px; }
        .glass-card {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 20px;
            width: 100%;
        }
        textarea {
            width: 100%; height: 200px; background: rgba(0,0,0,0.3);
            border: 1px solid var(--glass-border); border-radius: 15px;
            color: white; padding: 15px; font-size: 16px; margin: 15px 0;
        }
        .btn-start {
            background: var(--accent-color); color: #000; border: none;
            padding: 15px 30px; border-radius: 12px; font-weight: bold;
            font-size: 18px; cursor: pointer; width: 100%;
        }
        #reader-section { display: none; }
        #article-display { padding: 20px; line-height: 1.8; font-size: 20px; word-break: break-word; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="container">
        <div id="input-section" class="glass-card">
            <h2 style="color: var(--accent-color); text-align: center;">قارئ النصوص الاحترافي</h2>
            <textarea id="text-input" placeholder="ألصق مقالك هنا..."></textarea>
            <button class="btn-start" onclick="startReading()">ابدأ القراءة</button>
        </div>
        <div id="reader-section">
            <button class="btn-start" onclick="goBack()" style="margin-bottom: 15px; background: #ef4444; color: white;">إغلاق والعودة</button>
            <div id="article-display" class="glass-card"></div>
        </div>
    </div>
    <script>
        function startReading() {
            const text = document.getElementById('text-input').value;
            if (!text.trim()) return alert("يرجى إضافة نص أولاً");
            document.getElementById('input-section').style.display = 'none';
            document.getElementById('reader-section').style.display = 'block';
            document.getElementById('article-display').innerText = text;
        }
        function goBack() {
            document.getElementById('reader-section').style.display = 'none';
            document.getElementById('input-section').style.display = 'block';
        }
    </script>
</body>
</html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <WebView
        style={styles.webview}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
