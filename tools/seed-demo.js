/* 生成一份"一节课"的演示数据，用于学情页演示与视频录制 */
const BASE = 'http://127.0.0.1:8787';

const Q = {
  口腔: ['馒头嚼久了为什么会变甜', '舌头上那些小疙瘩是什么', '不嚼碎直接吞会怎么样', '口水为什么会突然变多', '牙齿为什么会掉', '为什么吃东西尝不出味道'],
  食道: ['躺着喝水怎么也能咽下去', '食道有多长呀', '东西卡在食道里怎么办', '食道会不会把食物磨碎'],
  胃: ['肚子咕咕叫是胃在说话吗', '胃为什么不会把自己消化掉', '吃太多胃会撑破吗', '胃里的酸是从哪儿来的'],
  小肠: ['小肠五米长怎么装进肚子里', '绒毛长什么样子', '营养怎么跑到手上去的', '为什么小肠不会把食物漏出去'],
  大肠: ['拉肚子的时候大肠发生了什么', '憋着不上厕所有什么不好', '大便为什么是褐色的', '大肠会不会也消化食物']
};

const ACC = { 口腔: 0.89, 食道: 0.64, 胃: 0.78, 小肠: 0.61, 大肠: 0.83 };
const N = { 口腔: 13, 食道: 12, 胃: 9, 小肠: 8, 大肠: 4 };

async function post(body) {
  await fetch(BASE + '/api/event', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
}

const STUDENTS = ['小雨', '李思远', '陈一诺', '王一涵', '赵沐辰', '周听听', '徐小满'];

(async () => {
  // 提问
  for (const st of Object.keys(Q)) {
    for (let i = 0; i < N[st]; i++) {
      await post({
        type: 'chat', station: st,
        student: STUDENTS[Math.floor(Math.random() * STUDENTS.length)],
        text: Q[st][i % Q[st].length]
      });
    }
  }
  // 闯关
  for (const st of Object.keys(ACC)) {
    const times = 8;
    for (let i = 0; i < times; i++) {
      await post({
        type: 'quiz', station: st, qid: 'q' + i,
        student: STUDENTS[i % STUDENTS.length],
        correct: Math.random() < ACC[st]
      });
    }
  }
  console.log('seeded');
})();
