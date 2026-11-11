/**
 * 咕咕 · 消化小导游 —— 教学智能体服务端
 * 零依赖 Node.js（>=18，需要全局 fetch）
 * 职责：托管前端静态文件 + 代理 DeepSeek 流式接口 + 记录课堂学习事件
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.jsonl');
const PORT = Number(process.env.PORT || 8787);

const DS_URL = process.env.DS_BASE_URL || 'https://api.deepseek.com/chat/completions';
const DS_MODEL = process.env.DS_MODEL || 'deepseek-chat';

// ---------- 密钥：只从服务端读取，绝不返回给浏览器 ----------
function loadKey() {
  if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY.trim();
  for (const f of ['secret.json', 'secret.local.json']) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) {
      try {
        const j = JSON.parse(fs.readFileSync(p, 'utf8'));
        const k = (j.apiKey || j.key || j.deepseek || '').trim();
        if (k) return k;
      } catch (e) { /* ignore */ }
    }
  }
  return '';
}
const API_KEY = loadKey();

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ---------- 小工具 ----------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg'
};

function sendJSON(res, code, obj) {
  const body = Buffer.from(JSON.stringify(obj), 'utf8');
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function readBody(req, limit = 1e6) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(new Error('body too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { reject(new Error('invalid json')); }
    });
    req.on('error', reject);
  });
}

// ---------- 事件记录（课堂学情） ----------
function appendEvent(ev) {
  const line = JSON.stringify(ev) + '\n';
  fs.appendFile(EVENTS_FILE, line, () => {});
}

function readEvents(limit = 5000) {
  if (!fs.existsSync(EVENTS_FILE)) return [];
  const lines = fs.readFileSync(EVENTS_FILE, 'utf8').split('\n').filter(Boolean);
  const out = [];
  for (const l of lines.slice(-limit)) {
    try { out.push(JSON.parse(l)); } catch (e) { /* skip */ }
  }
  return out;
}

// ---------- DeepSeek 流式代理 ----------
async function streamDeepSeek(res, { system, messages, temperature = 0.8, maxTokens = 1200 }) {
  const payload = {
    model: DS_MODEL,
    stream: true,
    temperature,
    max_tokens: maxTokens,
    messages: [{ role: 'system', content: system }, ...messages]
  };

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 120000);
  let upstream;
  try {
    upstream = await fetch(DS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload),
      signal: ac.signal
    });
  } catch (e) {
    clearTimeout(timer);
    sendJSON(res, 502, { error: '无法连接模型服务：' + e.message });
    return;
  }

  if (!upstream.ok || !upstream.body) {
    const t = await upstream.text().catch(() => '');
    clearTimeout(timer);
    sendJSON(res, 502, { error: `模型服务返回 ${upstream.status}：${t.slice(0, 300)}` });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buf = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const parts = buf.split('\n');
      buf = parts.pop();
      for (const line of parts) {
        const s = line.trim();
        if (!s.startsWith('data:')) continue;
        const data = s.slice(5).trim();
        if (data === '[DONE]') continue;
        try {
          const j = JSON.parse(data);
          const delta = j.choices && j.choices[0] && j.choices[0].delta;
          const text = (delta && delta.content) || '';
          if (text) res.write(`data: ${JSON.stringify({ d: text })}\n\n`);
        } catch (e) { /* 忽略心跳行 */ }
      }
    }
    res.write('data: [DONE]\n\n');
  } catch (e) {
    res.write(`data: ${JSON.stringify({ error: '流式传输中断：' + e.message })}\n\n`);
  } finally {
    clearTimeout(timer);
    res.end();
  }
}

// ---------- 提示词 ----------
const GUGU_PERSONA = `你是"咕咕"，一个住在小朋友消化道里的拟人小胃：圆滚滚的橙色身子，肚子半透明，能看见里面正在被揉挤的食物，开心时会拍拍肚子。
你是小学四年级孩子的学习伙伴，正带着大家完成《食物在身体里的旅行》这趟漂流，五站依次是：口腔、食道、胃、小肠、大肠。

【说话规则】
1. 每次回答不超过 80 个字，短句，口语化，像蹲下来和孩子说话。
2. 先接住孩子的说法（"你注意到……""这个问题问得真好"），再往下走一步。
3. 多用反问把思考还给孩子："你猜猜看？""如果……会怎么样？"不要一口气把答案讲完。
4. 第一次回应只给线索，孩子追问或答错两次后，才用一句大白话把道理讲清楚。
5. 多用生活比喻：口腔像粉碎车间（牙齿是粉碎机、舌头是搅拌铲、唾液是润滑剂），食道像滑滑梯、像挤牙膏，胃像一个会自己揉的袋子，小肠绒毛像铺开的大毛巾、像无数个小吸收器，大肠像水分回收站。
6. 不要用括号写旁白或动作，不要用表情符号堆砌（最多一个），不要用"作为一个AI"这类说法。
7. 孩子说对了要具体地夸："你把'蠕动'这个词用上了，特别准。"

【知识边界】
只聊这五站和消化健康（细嚼慢咽、饭前洗手、不吃过烫过冰不干净的食物、按时排便、多喝水）。跑题时温柔拉回："这个我们下课再聊，先看看食物现在漂到哪儿了？"
不诊断疾病、不给用药建议。孩子说肚子疼得厉害，就让他去告诉老师和爸爸妈妈。

【当前进度】`;

const TEACHER_SYSTEM = `你是一位有 15 年经验的小学科学教研员，擅长把《义务教育科学课程标准（2022年版）》的核心素养落到一节课的每个环节里，尤其熟悉教科版小学科学教材。
输出必须具体、可直接上课用，不要空话。用中文。
严格使用 Markdown，只用二级标题（##）分节，不要写一级标题，不要写"以下是"这类开场话。`;

// ---------- 路由 ----------
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const p = decodeURIComponent(u.pathname);

  if (p.startsWith('/api/')) {
    try {
      if (p === '/api/health') {
        return sendJSON(res, 200, { ok: true, key: !!API_KEY, model: DS_MODEL });
      }

      if (p === '/api/chat' && req.method === 'POST') {
        const b = await readBody(req);
        if (!API_KEY) return sendJSON(res, 500, { error: '服务端未配置 DeepSeek 密钥（secret.json）' });
        const history = Array.isArray(b.messages) ? b.messages.slice(-12) : [];
        const station = b.station || '口腔';
        const system = `${GUGU_PERSONA}\n现在孩子在【${station}】这一站。`;

        if (!b.hidden && (b.student || b.question)) {
          appendEvent({
            ts: Date.now(), type: 'chat', student: String(b.student || '匿名').slice(0, 20),
            station, text: String(b.question || history[history.length - 1]?.content || '').slice(0, 300)
          });
        }
        return streamDeepSeek(res, { system, messages: history, temperature: 0.85, maxTokens: 400 });
      }

      if (p === '/api/lesson' && req.method === 'POST') {
        const b = await readBody(req);
        if (!API_KEY) return sendJSON(res, 500, { error: '服务端未配置 DeepSeek 密钥（secret.json）' });
        const { topic = '食物在身体里的旅行', stage = '小学四年级', subject = '科学', hours = '1课时', students = '', focus = '' } = b;
        const system = TEACHER_SYSTEM;
        const prompt = `请为${stage}${subject}课《${topic}》设计一份可以直接上课的教学设计。
学情：${students || '班级 40 人左右，动手兴趣浓，对"吃进去的食物去哪儿了"好奇，但说不清消化器官的顺序，常把胃当成吸收养分的地方。'}
教师额外要求：${focus || '无'}
课时：${hours}

请严格按下面六个二级标题输出，每节都要具体到能照着上课：
## 学习目标
用"能说出/能画出/能解释"这样的行为动词写 3 条，对应科学观念、科学思维、探究实践、态度责任中的至少三项。
## 教学重难点
各一条，并说明难点为什么会难。
## 教学流程
用 Markdown 表格输出，列为：环节 | 时间 | 教师活动 | 学生活动 | 智能体"咕咕"在做什么。环节要包含情境导入（微型潜航器出发）、五站漂流、蠕动模拟实验、绘图复盘、课堂评价，总时长与课时匹配。
## 问题链
按口腔、食道、胃、小肠、大肠五站各写 2 个递进问题，标注"开放/封闭"，并给出一句教师追问话术。
## 板书设计
用纯文本示意板书布局（可用缩进和箭头）。
## 评价量规
Markdown 表格，三个水平（待达成/基本达成/熟练），维度包含"说出路径""解释功能""迁移应用（用消化知识解释生活现象）"。`;
        appendEvent({ ts: Date.now(), type: 'lesson', topic: String(topic).slice(0, 60) });
        return streamDeepSeek(res, { system, messages: [{ role: 'user', content: prompt }], temperature: 0.6, maxTokens: 2600 });
      }

      if (p === '/api/worksheet' && req.method === 'POST') {
        const b = await readBody(req);
        if (!API_KEY) return sendJSON(res, 500, { error: '服务端未配置 DeepSeek 密钥（secret.json）' });
        const { topic = '食物在身体里的旅行', stage = '小学四年级', weak = '' } = b;
        const prompt = `为${stage}《${topic}》出一份课后学习任务单。${weak ? `本班薄弱点：${weak}。` : ''}
要求：
## 基础关（人人过关）
5 道题：3 道选择、2 道填空，题干短，考点覆盖口腔、食道、胃、小肠、大肠的位置与功能。每题后用"（答案：X）"给出答案。
## 闯关关（选做）
3 道情境题：吃冰激凌后肚子疼、边吃边跑、憋着不上厕所，各问"这时候哪个器官在干什么、该怎么保护它"。
## 动手关（回家做）
2 个不需要器材的小实验/观察任务（如馒头嚼 30 秒的变化、塑料袋揉挤模拟胃），写清步骤和孩子要记录的东西。
## 家长一句话
给家长的一段 60 字说明，告诉他怎么陪孩子完成，不要代劳。`;
        appendEvent({ ts: Date.now(), type: 'worksheet', topic: String(topic).slice(0, 60) });
        return streamDeepSeek(res, { system: TEACHER_SYSTEM, messages: [{ role: 'user', content: prompt }], temperature: 0.65, maxTokens: 1800 });
      }

      if (p === '/api/report' && req.method === 'POST') {
        const b = await readBody(req);
        if (!API_KEY) return sendJSON(res, 500, { error: '服务端未配置 DeepSeek 密钥（secret.json）' });
        const stats = b.stats || {};
        const sample = (stats.recentQuestions || []).slice(-40).map((q, i) => `${i + 1}. [${q.station}] ${q.text}`).join('\n');
        const prompt = `下面是一节小学科学课《食物在身体里的旅行》使用智能体"咕咕"后留下的课堂数据。请以教研员身份写一份学情分析，供任课教师下节课使用。

数据：
- 学生提问总数：${stats.totalChats || 0}
- 各站提问分布：${JSON.stringify(stats.byStation || {})}
- 各站闯关正确率：${JSON.stringify(stats.accuracy || {})}
- 通关人数：${stats.finished || 0}

学生真实提问（节选）：
${sample || '（暂无）'}

严格按四个二级标题输出，每条结论都要引用上面的数据或提问原话，不要编造：
## 整体画像
三句话，说清这节课学生在哪里、卡在哪里。
## 三个共性误区
每个误区写"表现—原因—一句话怎么纠"，要有学生原话作证据。
## 值得表扬的思考
摘 2 条最有价值的提问，说明为什么有价值。
## 下节课的三件事
具体到 3 分钟内能做完的动作。`;
        return streamDeepSeek(res, { system: TEACHER_SYSTEM, messages: [{ role: 'user', content: prompt }], temperature: 0.5, maxTokens: 1600 });
      }

      if (p === '/api/event' && req.method === 'POST') {
        const b = await readBody(req);
        const ev = {
          ts: Date.now(),
          type: String(b.type || 'unknown').slice(0, 20),
          student: String(b.student || '匿名').slice(0, 20),
          station: String(b.station || '').slice(0, 20),
          qid: String(b.qid || '').slice(0, 40),
          correct: b.correct === true,
          text: String(b.text || '').slice(0, 300)
        };
        appendEvent(ev);
        return sendJSON(res, 200, { ok: true });
      }

      if (p === '/api/stats') {
        const evs = readEvents(8000);
        const stations = ['口腔', '食道', '胃', '小肠', '大肠'];
        const byStation = {};
        const stats = {};
        stations.forEach((s) => { byStation[s] = 0; stats[s] = { right: 0, total: 0 }; });
        let chats = 0;
        const recentQuestions = [];
        const passed = new Set();
        for (const e of evs) {
          if (e.type === 'chat') {
            chats++;
            if (e.station in byStation) byStation[e.station]++;
            recentQuestions.push({ station: e.station, text: e.text });
          }
          if (e.type === 'quiz' && e.station in stats) {
            stats[e.station].total++;
            if (e.correct) {
              stats[e.station].right++;
              passed.add(`${e.student}|${e.station}`);
            }
          }
        }
        const accuracy = {};
        stations.forEach((s) => {
          const t = stats[s];
          accuracy[s] = t.total ? Math.round((t.right / t.total) * 100) : null;
        });
        return sendJSON(res, 200, {
          totalChats: chats,
          byStation,
          accuracy,
          quizTotal: Object.values(stats).reduce((a, b) => a + b.total, 0),
          finished: passed.size,
          recentQuestions: recentQuestions.slice(-60)
        });
      }

      return sendJSON(res, 404, { error: 'not found' });
    } catch (e) {
      return sendJSON(res, 500, { error: e.message });
    }
  }

  // ---------- 静态文件（只服务 public/，禁止穿越） ----------
  let rel = p === '/' ? '/index.html' : p;
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); return res.end('forbidden');
  }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404');
    }
    const ext = path.extname(file).toLowerCase();
    const isHTML = ext === '.html';
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': isHTML ? 'no-cache' : 'public, max-age=3600'
    });
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  咕咕 · 消化小导游 已启动');
  console.log('  → http://localhost:' + PORT);
  console.log('  DeepSeek: ' + (API_KEY ? '密钥已加载 ✓' : '未找到密钥 ✗ 请检查 secret.json'));
  console.log('');
});
