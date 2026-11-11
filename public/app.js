/* =========================================================
   咕咕 · 呼吸小导师 —— 前端逻辑（原生 JS，无构建）
   ========================================================= */
'use strict';

/* ---------------- 站点数据 ---------------- */
const STATIONS = [
  {
    no: 1, name: '口腔', alias: '食物的粉碎车间', img: 'assets/st-mouth.webp',
    desc: '牙齿把食物咬碎、磨细，舌头不停翻动搅拌，唾液把食物润湿、粘成团，还开始分解少量淀粉。食物在这里大约待 1 分钟，变成温热的食团才被咽下去。',
    quick: ['为什么馒头越嚼越甜？', '舌头除了尝味道还做什么？', '不嚼碎直接吞会怎么样？'],
    quiz: [
      {
        q: '食物在口腔里，主要发生了哪些变化？',
        opts: ['被磨碎、被唾液润湿，还开始分解少量淀粉', '只是被唾液泡软，别的没变', '被完全消化成养分', '直接被吸收进血液'],
        ans: 0,
        ok: '对！磨碎、润湿、分解一点点淀粉，三件事同时在嘴里发生，后面每一站都在接着做。',
        no: '想一想：牙齿、舌头、唾液各自在忙什么？三件事合起来是什么？'
      },
      {
        q: '馒头嚼久了会变甜，是因为——',
        opts: ['唾液把一部分淀粉分解成了有甜味的糖', '馒头里本来就加了糖', '舌头自己产生了甜味', '胃里的胃液跑上来了'],
        ans: 0,
        ok: '抓住了！这就是"消化从嘴里就开始"的证据。',
        no: '唾液里有一种东西专门对付淀粉，它把淀粉变成了什么？'
      }
    ]
  },
  {
    no: 2, name: '食道', alias: '食物的滑滑梯', img: 'assets/st-esophagus.webp',
    desc: '食道是一根大约 25 厘米长的管子，内壁光滑。它不会自己把食物"倒"下去，是管壁的肌肉一节一节收缩，像挤牙膏一样把食团往胃里推。食物经过食道只要 5 到 10 秒。',
    quick: ['躺着为什么也能咽下去？', '食道有多长？', '食物会不会卡在食道里？'],
    quiz: [
      {
        q: '食物在食道里，是靠什么前进的？',
        opts: ['管壁肌肉一节一节收缩挤压', '地球引力，自己掉下去', '胃在里面往回"吸"', '舌头一直往里推'],
        ans: 0,
        ok: '对！这叫蠕动。所以躺着、甚至倒立着，也能把食物送进胃。',
        no: '把食物放进软管，用手指从上面一点点往下挤——是谁在推它？'
      },
      {
        q: '食物从食道到胃，大约需要——',
        opts: ['5 到 10 秒', '1 分钟', '1 小时', '半天'],
        ans: 0,
        ok: '正确！整趟旅行里，食道这一段是最快的。',
        no: '这一站叫"滑滑梯"，滑滑梯是快还是慢？'
      }
    ]
  },
  {
    no: 3, name: '胃', alias: '食物的搅拌工厂', img: 'assets/st-stomach.webp',
    desc: '胃是一个有弹性的大袋子。它一边暂时储存食物，一边靠胃壁肌肉不停收缩、揉挤，把食物和胃液搅在一起，磨成糊状的"食糜"。食物在这里要待 1 到 2 小时。',
    quick: ['肚子咕咕叫是胃在干什么？', '胃为什么不会把自己消化掉？', '吃太多胃会撑坏吗？'],
    quiz: [
      {
        q: '用手反复揉挤装着馒头和水的塑料袋，这个动作模拟的是——',
        opts: ['胃的搅拌和初步消化', '小肠的吸收', '大肠的排便', '口腔的咀嚼'],
        ans: 0,
        ok: '对了！胃壁就像你的手，不停揉挤，把食物变成食糜。',
        no: '这节课里哪个器官是"袋子"形状，还会自己动？'
      },
      {
        q: '食物在胃里最后会变成什么样？',
        opts: ['糊状的食糜', '干净的养分', '成形的粪便', '和刚吃进去时一样'],
        ans: 0,
        ok: '没错，从"块"变成"糊"，下一站才好吸收。',
        no: '想想那个被反复揉挤的塑料袋，里面的馒头最后成了什么样子？'
      }
    ]
  },
  {
    no: 4, name: '小肠', alias: '吸收的主战场', img: 'assets/st-small.webp',
    desc: '小肠有 5 米多长，盘在肚子里。内壁长满绒毛，把吸收面积放大了几十倍，像无数个"小吸收器"。养分从这里进入血液，被送到全身。食物在小肠要停留 1 到 6 小时。',
    quick: ['小肠为什么这么长？', '绒毛长什么样子？', '吃进去的营养怎么跑到手上？'],
    quiz: [
      {
        q: '小肠最重要的作用是——',
        opts: ['完成消化，并吸收养分', '把食物送到胃里', '暂时储存食物', '吸收水分、形成粪便'],
        ans: 0,
        ok: '对！"主战场"这个词，就是留给小肠的。',
        no: '养分最后是从哪个器官进入血液的？'
      },
      {
        q: '小肠内壁的绒毛，最大的好处是——',
        opts: ['大大增加吸收面积', '让食物走得更快', '把食物磨得更碎', '分泌胃液'],
        ans: 0,
        ok: '正确！摊开来面积大得吓人，所以吸收得又快又彻底。',
        no: '一块毛巾和一根光滑的管子，哪个能"擦"到更多地方？'
      }
    ]
  },
  {
    no: 5, name: '大肠', alias: '水分的回收站', img: 'assets/st-large.webp',
    desc: '大肠上接小肠、下通肛门。它把残渣里剩下的水、无机盐和一部分维生素再吸收回来，残渣慢慢变干，形成粪便储存起来，最后经肛门排出体外。这一段要 12 到 36 小时。',
    quick: ['为什么会拉肚子？', '便秘是怎么回事？', '大便为什么是褐色的？'],
    quiz: [
      {
        q: '大肠主要吸收的是——',
        opts: ['少量水分、无机盐和部分维生素', '大部分养分', '蛋白质', '空气'],
        ans: 0,
        ok: '对，大肠是"回收站"，捡的是水和无机盐。',
        no: '小肠已经把养分拿走了，剩下的残渣里还有什么值得回收？'
      },
      {
        q: '食物从进嘴到排出体外，整趟旅行大约要——',
        opts: ['15 到 45 小时', '5 分钟', '1 小时', '3 天'],
        ans: 0,
        ok: '正确！所以你今天吃的饭，可能明天、后天才会"离开"。',
        no: '大肠一段就要 12 到 36 小时，再加上前面几站呢？'
      }
    ]
  }
];

const KEY_BADGE = 'huhu.badges.v1';

/* ---------------- 状态 ---------------- */
const state = {
  station: 0,
  messages: [],
  busy: false,
  tts: false,
  markdown: '',
  badges: new Set(JSON.parse(localStorage.getItem(KEY_BADGE) || '[]'))
};

/* ---------------- 工具 ---------------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 2200);
}

/* ---------------- 极简 Markdown ---------------- */
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
}

function md(src) {
  const lines = String(src).replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  let list = null;

  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };

  while (i < lines.length) {
    let line = lines[i];

    if (!line.trim()) { closeList(); i++; continue; }

    // 代码块（板书示意、路线图都用它保持对齐）
    if (/^```/.test(line.trim())) {
      closeList();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) { buf.push(lines[i]); i++; }
      i++;
      out.push('<pre>' + esc(buf.join('\n')) + '</pre>');
      continue;
    }

    // 表格
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      closeList();
      const head = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        rows.push(lines[i].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim()));
        i++;
      }
      out.push('<table><thead><tr>' + head.map((h) => `<th>${inline(h)}</th>`).join('') + '</tr></thead><tbody>');
      rows.forEach((r) => {
        out.push('<tr>' + head.map((_, k) => `<td>${inline(r[k] || '')}</td>`).join('') + '</tr>');
      });
      out.push('</tbody></table>');
      continue;
    }

    // 标题
    let m = line.match(/^(#{1,4})\s+(.*)$/);
    if (m) {
      closeList();
      const lv = Math.min(m[1].length + 1, 4);
      out.push(`<h${lv}>${inline(m[2])}</h${lv}>`);
      i++;
      continue;
    }

    if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) { closeList(); out.push('<hr>'); i++; continue; }

    // 列表
    m = line.match(/^\s*([-*+]|\d+\.)\s+(.*)$/);
    if (m) {
      const ordered = /\d/.test(m[1]);
      const tag = ordered ? 'ol' : 'ul';
      if (list !== tag) { closeList(); out.push(`<${tag}>`); list = tag; }
      out.push(`<li>${inline(m[2])}</li>`);
      i++;
      continue;
    }

    // 段落
    closeList();
    out.push(`<p>${inline(line)}</p>`);
    i++;
  }
  closeList();
  return out.join('\n');
}

/* ---------------- SSE 流式 ---------------- */
async function stream(url, body, onDelta) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok || !res.body) {
    let msg = '请求失败（' + res.status + '）';
    try { const j = await res.json(); if (j.error) msg = j.error; } catch (e) { /* ignore */ }
    throw new Error(msg);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder('utf-8');
  let buf = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split('\n\n');
    buf = parts.pop();
    for (const p of parts) {
      const line = p.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      let j = null;
      try { j = JSON.parse(data); } catch (e) { continue; }
      if (j.error) throw new Error(j.error);
      if (j.d) onDelta(j.d);
    }
  }
}

function logEvent(ev) {
  fetch('/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ev)
  }).catch(() => {});
}

/* ---------------- 语音朗读 ---------------- */
function speak(text) {
  if (!state.tts || !window.speechSynthesis) return;
  const clean = String(text).replace(/[*#`>_|]/g, '').trim();
  if (!clean) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'zh-CN';
  u.rate = 1.03;
  u.pitch = 1.18;
  const vs = window.speechSynthesis.getVoices().filter((v) => /zh|Chinese/i.test(v.lang));
  if (vs.length) u.voice = vs.find((v) => /Xiaoxiao|Huihui|Tingting|Yunxi/i.test(v.name)) || vs[0];
  window.speechSynthesis.speak(u);
}

/* ---------------- 对话渲染 ---------------- */
function bubbleEl(role, text) {
  const wrap = document.createElement('div');
  wrap.className = 'msg' + (role === 'user' ? ' me' : '');
  const ava = document.createElement('div');
  ava.className = 'ava';
  if (role === 'user') {
    ava.textContent = '我';
  } else {
    const img = document.createElement('img');
    img.src = 'assets/mascot.webp';
    img.alt = '咕咕';
    ava.appendChild(img);
  }
  const b = document.createElement('div');
  b.className = 'bubble';
  if (role === 'assistant') {
    const n = document.createElement('span');
    n.className = 'name';
    n.textContent = '咕咕';
    b.appendChild(n);
  }
  b.appendChild(document.createTextNode(text || ''));
  wrap.append(ava, b);
  return wrap;
}

function scrollChat() {
  const el = $('#chat');
  el.scrollTop = el.scrollHeight;
}

function pushMsg(role, text) {
  state.messages.push({ role, content: text });
  const el = bubbleEl(role, text);
  $('#chat').appendChild(el);
  scrollChat();
  return el;
}

function hello() {
  const s = STATIONS[state.station];
  const text = `嗨，我是咕咕！现在我们在第 ${s.no} 站——${s.name}。大家都叫它"${s.alias}"。你猜猜，食物到了这儿会变成什么样？`;
  $('#chat').innerHTML = '';
  state.messages = [];
  pushMsg('assistant', text);
  speak(text);
}

/* ---------------- 发送 ---------------- */
async function send(text, opts = {}) {
  text = (text || '').trim();
  if (!text || state.busy) return;

  const input = $('#input');
  input.value = '';
  input.style.height = 'auto';

  if (opts.hidden) state.messages.push({ role: 'user', content: text });
  else pushMsg('user', text);
  state.busy = true;
  $('#sendBtn').disabled = true;
  $$('#quick button').forEach((b) => (b.disabled = true));

  // 打字指示
  const holder = document.createElement('div');
  holder.className = 'msg';
  holder.innerHTML = `<div class="ava"><img src="assets/mascot.webp" alt=""></div>
    <div class="bubble"><span class="name">咕咕</span><span class="typing"><i></i><i></i><i></i></span></div>`;
  $('#chat').appendChild(holder);
  scrollChat();

  const bubble = holder.querySelector('.bubble');
  let acc = '';
  let started = false;
  let textNode = null;

  try {
    await stream('/api/chat', {
      messages: state.messages.slice(-12),
      station: STATIONS[state.station].name,
      question: text,
      hidden: !!opts.hidden
    }, (d) => {
      if (!started) {
        started = true;
        bubble.innerHTML = '<span class="name">咕咕</span>';
        textNode = document.createTextNode('');
        bubble.appendChild(textNode);
      }
      acc += d;
      textNode.nodeValue = acc;
      scrollChat();
    });
    if (!acc) {
      bubble.innerHTML = '<span class="name">咕咕</span>嗯……我这边有点没听清，你再问一次好不好？';
    } else {
      state.messages.push({ role: 'assistant', content: acc });
      speak(acc);
    }
  } catch (e) {
    bubble.innerHTML = `<span class="name">咕咕</span>哎呀，我的小气流卡住了：${esc(e.message)}`;
  } finally {
    state.busy = false;
    $('#sendBtn').disabled = false;
    $$('#quick button').forEach((b) => (b.disabled = false));
    scrollChat();
  }
}

/* ---------------- 站点渲染 ---------------- */
function renderStations() {
  const box = $('#stations');
  box.innerHTML = '';
  STATIONS.forEach((s, i) => {
    const done = state.badges.has(s.name);
    const el = document.createElement('div');
    el.className = 'station' + (i === state.station ? ' on' : '') + (done ? ' done' : '');
    el.innerHTML = `
      <div class="st-num">${done ? '✓' : s.no}</div>
      <div class="st-body">
        <div class="st-name">${s.name}<em>${s.alias}</em></div>
        <div class="st-desc">${s.desc.slice(0, 26)}…</div>
      </div>
      <div class="st-thumb"><img src="${s.img}" alt=""></div>`;
    el.onclick = () => selectStation(i);
    box.appendChild(el);
  });
}

function selectStation(i) {
  const changed = i !== state.station;
  state.station = i;
  const s = STATIONS[i];

  $('#chatStation').textContent = `第 ${s.no} 站 · ${s.name}`;
  $('#exName').innerHTML = `${s.name} <small>${s.alias}</small>`;
  $('#exDesc').textContent = s.desc;
  $('#exImg').src = s.img;
  $('#quizBtn').textContent = `开始闯关 · 第 ${s.no} 关`;

  $('#quick').innerHTML = '';
  s.quick.forEach((q) => {
    const b = document.createElement('button');
    b.textContent = q;
    b.onclick = () => send(q);
    $('#quick').appendChild(b);
  });

  renderStations();
  renderProgress();
  if (changed) hello();
}

function renderProgress() {
  const n = state.badges.size;
  $('#progText').textContent = `${n} / 5 站`;
  $('#progBar').style.width = (n / 5) * 100 + '%';
  $('#progStars').textContent = '★'.repeat(n) + '☆'.repeat(5 - n);
  $('#starChip').textContent = '★ ' + (n * 2);
}

/* ---------------- 闯关 ---------------- */
let quizCtx = null;

function openQuiz() {
  const s = STATIONS[state.station];
  const doneCount = s.quiz.filter((q) => state.badges.has(s.name)).length;
  const q = s.quiz[Math.min(doneCount, s.quiz.length - 1)];
  quizCtx = { station: s, q, answered: false };

  $('#qStation').textContent = `第 ${s.no} 关 · ${s.name}`;
  $('#qText').textContent = q.q;
  const box = $('#qOpts');
  box.innerHTML = '';
  const fb = $('#qFb');
  fb.className = 'feedback';
  fb.innerHTML = '';

  q.opts.forEach((o, k) => {
    const b = document.createElement('button');
    b.className = 'opt';
    b.innerHTML = `<span class="tag">${'ABCD'[k]}</span><span>${esc(o)}</span>`;
    b.onclick = () => answer(k, b);
    box.appendChild(b);
  });

  $('#modal').classList.add('on');
}

function answer(k, btn) {
  const { station, q } = quizCtx;
  const fb = $('#qFb');
  const right = k === q.ans;

  if (right) {
    btn.classList.add('right');
    $$('#qOpts .opt').forEach((b) => (b.disabled = true));
    fb.className = 'feedback on ok';
    fb.innerHTML = `<b>答对啦！</b>${esc(q.ok)}`;
    logEvent({ type: 'quiz', station: station.name, qid: q.q.slice(0, 20), correct: true });
    if (!state.badges.has(station.name)) {
      state.badges.add(station.name);
      localStorage.setItem(KEY_BADGE, JSON.stringify([...state.badges]));
      renderStations();
      renderProgress();
      setTimeout(() => toast(`解锁「${station.name}」徽章 · 星星 +2`), 260);
    }
    // 让咕咕顺着这道题继续聊（隐藏的上下文，不占用学生的气泡）
    setTimeout(() => {
      $('#modal').classList.remove('on');
      send(`（我在第${station.no}关答对了：${q.q} 我选的是"${q.opts[q.ans]}"）`, { hidden: true });
    }, 1500);
  } else {
    btn.classList.add('wrong');
    btn.disabled = true;
    fb.className = 'feedback on no';
    fb.innerHTML = `<b>再想想</b>${esc(q.no)}`;
    logEvent({ type: 'quiz', station: station.name, qid: q.q.slice(0, 20), correct: false });
  }
}

/* ---------------- 备课台 ---------------- */
let doc = { title: '教学设计', md: '' };

function setDoc(title, markdown) {
  doc = { title, md: markdown };
  $('#docTitle').textContent = title;
  $('#lessonDoc').innerHTML = markdown ? md(markdown) : '';
}

async function generate(kind) {
  const payload = {
    topic: $('#fTopic').value.trim() || '食物在身体里的旅行',
    stage: $('#fStage').value,
    subject: $('#fSubject').value,
    hours: $('#fHours').value,
    students: $('#fStudents').value.trim(),
    focus: $('#fFocus').value.trim()
  };

  const btn = kind === 'lesson' ? $('#genLesson') : $('#genSheet');
  const other = kind === 'lesson' ? $('#genSheet') : $('#genLesson');
  btn.disabled = other.disabled = true;
  btn.textContent = '生成中…';

  const title = kind === 'lesson' ? '教学设计' : '课后学习任务单';
  const docEl = $('#lessonDoc');
  docEl.innerHTML = `<div class="empty"><img src="assets/mascot.webp" alt=""><b>正在想……</b><span>咕咕在翻课标、想问题链，文字会一个字一个字冒出来。</span></div>`;

  let acc = '';
  let tick = 0;
  try {
    await stream(kind === 'lesson' ? '/api/lesson' : '/api/worksheet', payload, (d) => {
      acc += d;
      tick++;
      if (tick % 3 === 0) {
        docEl.innerHTML = md(acc);
        docEl.scrollTop = docEl.scrollHeight;
      }
    });
    setDoc(title, acc);
    docEl.scrollTop = 0;
    toast(title + ' 生成完成');
  } catch (e) {
    docEl.innerHTML = `<div class="empty"><img src="assets/mascot-wave.webp" alt=""><b>没生成出来</b><span>${esc(e.message)}</span></div>`;
  } finally {
    btn.disabled = other.disabled = false;
    btn.textContent = kind === 'lesson' ? '生成教学设计' : '生成课后任务单';
  }
}

/* ---------------- 学情 ---------------- */
let lastStats = null;

function demoStats() {
  return {
    totalChats: 46,
    byStation: { 口腔: 13, 食道: 12, 胃: 9, 小肠: 8, 大肠: 4 },
    accuracy: { 口腔: 89, 食道: 64, 胃: 78, 小肠: 61, 大肠: 83 },
    quizTotal: 36, finished: 24,
    recentQuestions: [
      { station: '食道', text: '为什么躺着也能把水咽下去呀' },
      { station: '小肠', text: '小肠五米长，怎么可能装进肚子里' },
      { station: '口腔', text: '馒头嚼久了为什么会变甜' },
      { station: '胃', text: '肚子咕咕叫是胃在说话吗' },
      { station: '大肠', text: '拉肚子的时候大肠发生了什么' }
    ],
    demo: true
  };
}

function renderStats(s) {
  lastStats = s;
  const accs = Object.values(s.accuracy || {}).filter((v) => v !== null);
  const overall = accs.length ? Math.round(accs.reduce((a, b) => a + b, 0) / accs.length) : null;

  $('#sChats').innerHTML = `${s.totalChats || 0}<small>次</small>`;
  $('#sQuiz').innerHTML = `${s.quizTotal || 0}<small>次</small>`;
  $('#sFin').innerHTML = `${s.finished || 0}<small>站</small>`;
  $('#sAcc').innerHTML = overall === null ? '—' : `${overall}<small>%</small>`;
  $('#dataBadge').textContent = s.demo ? '演示数据' : '实时';
  $('#dataBadge').className = 'chip ' + (s.demo ? 'sun' : 'mint');

  const box = $('#accList');
  box.innerHTML = '';
  Object.keys(s.accuracy || {}).forEach((k) => {
    const v = s.accuracy[k];
    const row = document.createElement('div');
    row.className = 'acc-row';
    row.innerHTML = `<span class="nm">${k}</span>
      <span class="track"><i class="${v !== null && v < 70 ? 'low' : ''}" style="width:${v === null ? 0 : v}%"></i></span>
      <span class="pct">${v === null ? '—' : v + '%'}</span>`;
    box.appendChild(row);
  });

  const qs = (s.recentQuestions || []).slice(-6).reverse();
  $('#qList').innerHTML = qs.length
    ? qs.map((q) => `<div>· <span style="color:#2f8fe0">[${esc(q.station)}]</span> ${esc(q.text)}</div>`).join('')
    : '<div>还没有学生提问，先去课堂聊两句。</div>';
}

function reportStarter(s) {
  const accs = Object.entries(s.accuracy || {}).filter(([, v]) => v !== null);
  const sorted = accs.slice().sort((a, b) => a[1] - b[1]);
  const busiest = Object.entries(s.byStation || {}).sort((a, b) => b[1] - a[1])[0];
  const lines = [];

  lines.push('## 数据先说三句话');
  lines.push('');
  lines.push(`- 这节课学生一共向咕咕提了 **${s.totalChats || 0}** 个问题，完成 **${s.quizTotal || 0}** 次闯关，**${s.finished || 0}** 人次拿到站点徽章。`);
  if (busiest && busiest[1]) {
    lines.push(`- 提问最集中的是 **${busiest[0]}**（${busiest[1]} 个问题），说明这里最"卡"。`);
  }
  if (sorted.length >= 2) {
    lines.push(`- 正确率最高的是 **${sorted[sorted.length - 1][0]}**（${sorted[sorted.length - 1][1]}%），最低的是 **${sorted[0][0]}**（${sorted[0][1]}%），下一次可以先补这一站。`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('**点右上角「生成分析报告」**，我会结合上面的数据和学生的原话，写出共性误区、值得表扬的思考，以及下节课可以直接做的三件事。');

  return lines.join('\n');
}

async function loadStats() {
  try {
    const r = await fetch('/api/stats');
    const s = await r.json();
    if (!s.totalChats && !s.quizTotal) {
      renderStats(demoStats());
      return s;
    }
    renderStats(s);
    // 有真实数据时，右侧先给一份"本地小结"，避免大片留白
    const el = $('#reportDoc');
    if (el.querySelector('.empty')) el.innerHTML = md(reportStarter(s));
    return s;
  } catch (e) {
    renderStats(demoStats());
    return demoStats();
  }
}

async function genReport() {
  const s = lastStats || (await loadStats());
  const btn = $('#genReport');
  btn.disabled = true;
  const old = btn.textContent;
  btn.textContent = '分析中…';

  const el = $('#reportDoc');
  el.innerHTML = `<div class="empty"><img src="assets/mascot.webp" alt=""><b>正在读这节课的数据……</b></div>`;

  let acc = '';
  let tick = 0;
  try {
    await stream('/api/report', { stats: s }, (d) => {
      acc += d;
      tick++;
      if (tick % 3 === 0) {
        el.innerHTML = md(acc);
        el.scrollTop = el.scrollHeight;
      }
    });
    el.innerHTML = md(acc);
    el.scrollTop = 0;
  } catch (e) {
    el.innerHTML = `<div class="empty"><img src="assets/mascot-wave.webp" alt=""><b>报告没生成出来</b><span>${esc(e.message)}</span></div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = old;
  }
}

/* ---------------- 食道蠕动实验室 ---------------- */
const lab = { v: 4, prev: 4, auto: false, rate: 5, last: 0, trips: 0, t1: false, t2: false, done: false };

function paintLab(v) {
  const p = Math.max(0, Math.min(1, v / 100));
  const tube = document.getElementById('labTube');
  if (!tube) return;

  // 食团沿食道下滑（y: 118 → 326）
  const y = 118 + p * 194;
  document.getElementById('labFood').setAttribute('cy', y.toFixed(1));

  // 收缩波跟着食团走：三圈管壁逐级收窄
  const moving = Math.abs(v - lab.prev) > 0.12;
  const sq = document.getElementById('labSqueeze');
  sq.setAttribute('transform', `translate(0,${y.toFixed(1)})`);
  sq.setAttribute('opacity', moving ? '1' : '0.3');

  const pinch = moving ? 0.68 : 0.96;
  const dx = (1 - pinch) * 26;
  document.getElementById('labWallL').setAttribute('transform', `translate(${dx.toFixed(1)},0)`);
  document.getElementById('labWallR').setAttribute('transform', `translate(${(-dx).toFixed(1)},0)`);

  // 推进箭头
  document.getElementById('labArrow').setAttribute('opacity', moving ? '1' : '0');

  // 数据面板
  const pos = document.getElementById('hPos');
  if (pos) {
    pos.textContent = p < 0.12 ? '刚咽下' : p < 0.80 ? '食道中段' : p < 0.995 ? '快到胃' : '已进胃';
    const wall = document.getElementById('hWall');
    wall.textContent = moving ? '收缩 · 推' : '舒张 · 等';
    wall.className = moving ? 'in' : '';
    document.getElementById('hTime').textContent = (p * 8).toFixed(1) + ' 秒';
  }

  // 到胃：记一次完整通过
  if (p >= 0.995 && !lab.done) {
    lab.done = true;
    lab.trips++;
    const chip = document.getElementById('tripChip');
    if (chip) chip.textContent = `送达胃 ${lab.trips} 次`;
    if (lab.t2) {
      lab.t2 = false;
      toast('一次吞咽大约 8 秒 —— 食道是全程最快的一站');
    }
    if (lab.auto) setTimeout(() => { lab.done = false; setLab(2); }, 1100);
  }
  if (p < 0.9) lab.done = false;

  lab.prev = v;
}

function setLab(v, fromSlider) {
  lab.v = Math.max(0, Math.min(100, v));
  if (fromSlider) {
    lab.auto = false;
    const b = document.getElementById('autoBtn');
    b.textContent = '开始自动蠕动';
    b.classList.remove('mint');
    b.classList.add('primary');
    if (!lab.t1) {
      lab.t1 = true;
      document.getElementById('task1').classList.add('done');
      document.getElementById('task1').querySelector('i').textContent = '✓';
    }
  }
  const sl = document.getElementById('esoSlider');
  if (sl && Math.abs(Number(sl.value) - lab.v) > 0.5) sl.value = lab.v;
  const dv = document.getElementById('esoVal');
  if (dv) dv.textContent = lab.v < 12 ? '刚咽下' : lab.v > 88 ? '快到胃' : '推送中';
  paintLab(lab.v);
}

function labLoop(ts) {
  if (!lab.auto) return;
  if (!lab.last) lab.last = ts;
  const dt = Math.min(0.1, (ts - lab.last) / 1000);
  lab.last = ts;
  // 频率越高，推进越快：5 次/分 ≈ 10 秒走完
  setLab(lab.v + dt * lab.rate * 2, false);
  if (lab.v >= 100) return;
  requestAnimationFrame(labLoop);
}

function initLab() {
  const sl = document.getElementById('esoSlider');
  if (!sl) return;
  paintLab(lab.v);

  sl.addEventListener('input', () => setLab(Number(sl.value), true));

  document.getElementById('autoBtn').onclick = (e) => {
    lab.auto = !lab.auto;
    lab.last = 0;
    if (lab.auto) {
      if (lab.v > 88) setLab(2);
      e.currentTarget.textContent = '暂停自动蠕动';
      e.currentTarget.classList.remove('primary');
      e.currentTarget.classList.add('mint');
      if (!lab.t2) lab.t2 = true;
      requestAnimationFrame(labLoop);
    } else {
      e.currentTarget.textContent = '开始自动蠕动';
      e.currentTarget.classList.remove('mint');
      e.currentTarget.classList.add('primary');
    }
  };

  document.getElementById('rateSlider').addEventListener('input', (e) => {
    lab.rate = Number(e.target.value);
    document.getElementById('rateVal').textContent = lab.rate + ' 次/分';
  });

  document.getElementById('resetLab').onclick = () => {
    lab.auto = false;
    lab.trips = 0;
    lab.done = false;
    document.getElementById('tripChip').textContent = '送达胃 0 次';
    const b = document.getElementById('autoBtn');
    b.textContent = '开始自动蠕动';
    b.classList.remove('mint');
    b.classList.add('primary');
    setLab(4);
  };

  document.getElementById('askLab').onclick = () => {
    document.getElementById('task3').classList.add('done');
    document.getElementById('task3').querySelector('i').textContent = '✓';
    switchView('class');
    selectStation(1);
    setTimeout(() => {
      send('我在实验室里看到，食物没有手推，是管壁一节一节挤着往下走的。如果食道不蠕动，食物还能到胃里吗？');
    }, 300);
  };
}

/* ---------------- 初始化 ---------------- */
function switchView(name) {
  $$('.nav button').forEach((b) => b.classList.toggle('on', b.dataset.view === name));
  $$('.view').forEach((v) => v.classList.toggle('on', v.id === 'view-' + name));
  if (name === 'report') loadStats();
  if (name === 'lab') requestAnimationFrame(() => paintLab(lab.v));
}

function init() {
  // 导航
  $$('.nav button').forEach((b) => (b.onclick = () => switchView(b.dataset.view)));

  // 站点
  selectStation(0);
  renderProgress();

  // 输入
  const input = $('#input');
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input.value);
    }
  });
  $('#sendBtn').onclick = () => send(input.value);
  $('#resetBtn').onclick = () => { hello(); toast('对话已重新开始'); };

  // 朗读
  $('#ttsBtn').onclick = (e) => {
    state.tts = !state.tts;
    e.currentTarget.classList.toggle('on', state.tts);
    if (!state.tts && window.speechSynthesis) window.speechSynthesis.cancel();
    toast(state.tts ? '已打开朗读' : '已关闭朗读');
  };

  // 闯关
  $('#quizBtn').onclick = openQuiz;
  $('#modalClose').onclick = () => $('#modal').classList.remove('on');
  $('#modal').onclick = (e) => { if (e.target.id === 'modal') $('#modal').classList.remove('on'); };
  $('#askBtn').onclick = () => send(STATIONS[state.station].quick[0]);

  // 备课
  $('#genLesson').onclick = () => generate('lesson');
  $('#genSheet').onclick = () => generate('sheet');
  $('#copyDoc').onclick = async () => {
    if (!doc.md) return toast('还没有内容');
    try { await navigator.clipboard.writeText(doc.md); toast('已复制全文'); }
    catch (e) { toast('复制失败，请手动选择文本'); }
  };
  $('#dlDoc').onclick = () => {
    if (!doc.md) return toast('还没有内容');
    const blob = new Blob([`# ${doc.title}\n\n${doc.md}`], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `咕咕-${doc.title}-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // 学情
  $('#genReport').onclick = genReport;
  $('#refreshStats').onclick = async () => { await loadStats(); toast('数据已刷新'); };

  initLab();

  // 健康检查
  fetch('/api/health').then((r) => r.json()).then((j) => {
    const dot = $('#apiDot');
    const txt = $('#apiText');
    if (j.ok && j.key) { dot.classList.add('ok'); txt.textContent = 'DeepSeek 已连接'; }
    else { dot.classList.add('bad'); txt.textContent = '未配置密钥'; }
  }).catch(() => {
    $('#apiDot').classList.add('bad');
    $('#apiText').textContent = '服务未响应';
  });

  hello();
}

document.addEventListener('DOMContentLoaded', init);
