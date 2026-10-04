/* =========================================================
   轨道播报舱 · ORBITAL NEWS POD
   外太空 + 桌面 + 玻璃罐小苗 + 太空播报机器人 + 圆环新闻版块
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------------------------------------------------------
     一、新闻版块内容
     --------------------------------------------------------- */
  /* 圆环上的展示顺序按数组顺序排列；
     img = 该版块卡片使用的图片（加载失败会自动回落到矢量插画） */
  const CATS = [
    {
      k: 'fin', name: '财经脉搏', en: 'MARKET PULSE',
      img: 'https://imgs.699pic.com/images/501/073/982.jpg!list1x.v2',
      a: '#155f4e', b: '#062a24', accent: '#8df0c4',
      items: [
        { t: '亚洲市场早盘普涨，新能源板块领跑', s: '轨道财经 · 07:30' },
        { t: '太空制造公司完成 C 轮 4.2 亿美元融资', s: '轨道财经 · 07:36' },
        { t: '咖啡期货小幅回落，宇航员的早晨便宜了 0.3%', s: '商品市场 · 07:41' }
      ],
      quip: '投资有风险，但今天咖啡便宜了——这算稳赚。干杯。'
    },
    {
      k: 'sport', name: '体育赛场', en: 'SPORTS ARENA',
      img: 'https://x0.ifengimg.com/ucms/2022_20/B8D938458CB35D7B553D858B8EBEDD229AEF6B09_size1298_w2560_h1706.jpg',
      a: '#7a4a12', b: '#2a1608', accent: '#ffca7a',
      items: [
        { t: '火星低重力马拉松落幕，冠军用时 6 小时 12 分', s: '星际体育 · 07:48' },
        { t: '世界杯预选赛爆冷，加时赛读秒绝杀', s: '赛场快讯 · 07:53' },
        { t: '空间站乒乓球赛：球不落地，因为它根本不落', s: '舱内赛事组 · 08:01' }
      ],
      quip: '在太空打乒乓球，考验的不是手感，是耐心。裁判也很辛苦。'
    },
    {
      k: 'culture', name: '文化娱乐', en: 'CULTURE & SCREEN',
      img: 'https://ts1.tc.mm.bing.net/th/id/R-C.a2d4235bbe69d7aaaec7239cb227a069?rik=HM7xT0pBGju03w&riu=http%3a%2f%2fwww.sh-act.org%2fupload%2f2018-10-22%2fa2d4235bbe69d7aaaec7239cb227a069.jpg&ehk=5GrjT7RBf28GzRn81NbOUcGo0gViEJN4%2bSZ4u6M4p1k%3d&risl=&pid=ImgRaw&r=0',
      a: '#5a2a86', b: '#1d0f38', accent: '#ffb8f0',
      items: [
        { t: '纪录片《地球的一天》上线，8K 视角看 24 小时流转', s: '影讯 · 08:06' },
        { t: '老唱片在真空里被重新聆听——这次是真的安静', s: '文化观察 · 08:12' },
        { t: '独立乐队发布新专辑《轨道回声》，采样自太阳风', s: '音乐现场 · 08:20' }
      ],
      quip: '音乐大概是唯一不受引力影响的东西。听完记得把耳机分给旁边那个人。'
    },
    {
      k: 'weather', name: '天气与轨道', en: 'ORBIT WEATHER',
      img: 'https://ts1.tc.mm.bing.net/th/id/R-C.2d64e945ffb7bf2db734196813da2c7b?rik=Wn8RtbDUxiFmLA&riu=http%3a%2f%2fpicview.iituku.com%2fcontent%2fimg%2f202407%2f24%2f1920x1080_1a06f2434bc54acc.png%2fwh860.jpg&ehk=pXXss7Es3Mxn0P3xhi6VGXX0PueWzBxAviVNvpdnTMc%3d&risl=&pid=ImgRaw&r=0',
      a: '#1d5f96', b: '#0b2440', accent: '#bfe6ff',
      items: [
        { t: '舱外温度 −121°C，太阳活动平静，适合出舱作业', s: '轨道气象台 · 08:25' },
        { t: '未来 24 小时无流星雨，但有三颗卫星过境可见', s: '轨道气象台 · 08:28' },
        { t: '北半球进入秋季，云带正在缓慢南移', s: '地面观测 · 08:33' }
      ],
      quip: '今天适合出舱，记得戴手套——太空可不讲人情。'
    },
    {
      k: 'life', name: '生活贴士', en: 'LIFE ON BOARD',
      img: 'https://static.shuomingshu.cn/images/2024/06/17/2169189_40ad7b6c7ef64ecc8ff160de8a4cc098~noop_dmamw5b0dva.jpg',
      a: '#8a5a1e', b: '#3a2410', accent: '#ffd79a',
      items: [
        { t: '失重睡眠小技巧：把自己“挂”起来最舒服', s: '舱内生活 · 08:40' },
        { t: '每天 2 升水，舱里那株小苗也需要一小杯', s: '健康提示 · 08:44' },
        { t: '给家人发一条消息，比任何维生素都管用', s: '心理支持组 · 08:50' }
      ],
      quip: '还有，那株小苗今天也在等你。顺手浇一下，它会记住的。'
    },
    {
      k: 'earth', name: '地球快讯', en: 'EARTH ONLINE',
      img: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.N0_ASGyGTyKpsOwxK6dcNAHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      a: '#1e56b8', b: '#0a1f47', accent: '#7fd2ff',
      items: [
        { t: '“地球在线”今日信号满格，全球同步晨间问候', s: '轨道通讯社 · 06:10' },
        { t: '南太平洋上空的极光带向南延伸了 300 公里', s: '极地观测站 · 06:24' },
        { t: '今日地球自转快了 0.0012 秒，别急，早餐还赶得上', s: '时间管理局（笑） · 06:31' }
      ],
      quip: '顺便说一句：如果今天谁说自己有点晕，可能是地球转太快——更可能是他昨晚值了夜班。'
    },
    {
      k: 'world', name: '国际要闻', en: 'WORLD DESK',
      img: 'https://img95.699pic.com/photo/60043/9855.jpg_wh860.jpg',
      a: '#16648f', b: '#0a2540', accent: '#8df0c4',
      items: [
        { t: '多国联合气候观测网新增 12 颗低轨卫星', s: '全球连线 · 06:40' },
        { t: '跨洋海底光缆完成第七次抢修，网络恢复满速', s: '国际电讯 · 06:52' },
        { t: '“太空垃圾清理公约”进入第二轮磋商', s: '环形山观察 · 07:05' }
      ],
      quip: '外交有时候像调天线：角度对了，噪音就变成音乐。各位早安。'
    },
    {
      k: 'tech', name: '科技前沿', en: 'TECH FRONTIER',
      img: 'https://img-blog.csdnimg.cn/direct/5a16cd8bb11244808350ef428041104d.png',
      a: '#1a3f8f', b: '#0a1436', accent: '#9df3ff',
      items: [
        { t: '新一代固态电池在轨测试通过，2000 次循环仍保持 92% 容量', s: '材料实验室 · 07:12' },
        { t: '开源模型在 8 张消费级显卡上跑通万亿参数推理', s: '算法周报 · 07:18' },
        { t: '志愿者用脑机接口打出一行 42 个字的句子', s: '神经接口组 · 07:26' }
      ],
      quip: '技术宅的浪漫，就是把“再等等”变成“已经好了”。'
    }
  ];

  /* ---------------------------------------------------------
     二、每个版块的“图片”背景（矢量插画）
     --------------------------------------------------------- */
  const ART = {
    earth: (c) => `
      <defs>
        <linearGradient id="a-earth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${c.a}"/><stop offset=".62" stop-color="${c.b}"/><stop offset="1" stop-color="#060d1e"/>
        </linearGradient>
        <radialGradient id="a-earth-g" cx=".34" cy=".28" r=".9">
          <stop offset="0" stop-color="#b6eaff"/><stop offset=".45" stop-color="#3d8fd8"/><stop offset="1" stop-color="#0c2452"/>
        </radialGradient>
      </defs>
      <rect width="178" height="128" fill="url(#a-earth)"/>
      <g fill="#e8f7ff" opacity=".8">
        <circle cx="20" cy="20" r="1"/><circle cx="47" cy="10" r=".8"/><circle cx="150" cy="16" r="1.1"/>
        <circle cx="166" cy="42" r=".8"/><circle cx="14" cy="52" r=".7"/><circle cx="120" cy="24" r=".7"/>
      </g>
      <ellipse cx="96" cy="92" rx="88" ry="30" fill="none" stroke="rgba(190,232,255,.30)" stroke-width="1" transform="rotate(-14 96 92)"/>
      <circle cx="100" cy="80" r="42" fill="url(#a-earth-g)"/>
      <path d="M83 58c8-7 20-5 24 3 3 6-2 13-11 13-9 1-17-8-13-16z" fill="#6fdca0" opacity=".85"/>
      <path d="M118 92c9-4 20 2 20 11 0 8-9 13-17 9-8-4-11-16-3-20z" fill="#6fdca0" opacity=".72"/>
      <path d="M72 90c6-3 13 1 13 8 0 6-7 10-12 6-6-4-6-11-1-14z" fill="#5fd08c" opacity=".7"/>
      <path d="M58 84a42 42 0 0 1 84 0" fill="rgba(255,255,255,.09)"/>
      <circle cx="100" cy="80" r="42" fill="none" stroke="rgba(214,244,255,.55)" stroke-width="1"/>
      <ellipse cx="100" cy="124" rx="72" ry="12" fill="rgba(120,200,255,.20)"/>`,

    world: (c) => `
      <defs>
        <linearGradient id="a-world" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/>
        </linearGradient>
      </defs>
      <rect width="178" height="128" fill="url(#a-world)"/>
      <g fill="none" stroke="rgba(198,236,255,.48)" stroke-width="1">
        <circle cx="89" cy="72" r="42" fill="rgba(8,34,72,.40)"/>
        <ellipse cx="89" cy="72" rx="16" ry="42"/>
        <ellipse cx="89" cy="72" rx="31" ry="42"/>
        <ellipse cx="89" cy="72" rx="42" ry="14"/>
        <ellipse cx="89" cy="72" rx="42" ry="29"/>
        <path d="M47 72h84"/>
      </g>
      <g fill="none" stroke="#8df0c4" stroke-width="1.3" stroke-dasharray="3 4" opacity=".9">
        <path d="M56 44q34-30 68-4"/><path d="M132 100q-32 24-64 2"/>
      </g>
      <g fill="#c9ffe6">
        <circle cx="56" cy="44" r="3"/><circle cx="124" cy="40" r="3"/>
        <circle cx="68" cy="102" r="3"/><circle cx="132" cy="100" r="3"/>
      </g>
      <ellipse cx="89" cy="126" rx="74" ry="12" fill="rgba(60,190,220,.16)"/>`,

    tech: (c) => `
      <defs>
        <linearGradient id="a-tech" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/>
        </linearGradient>
        <linearGradient id="a-tech-chip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#a9f4ff"/><stop offset="1" stop-color="#2b86c8"/>
        </linearGradient>
      </defs>
      <rect width="178" height="128" fill="url(#a-tech)"/>
      <g stroke="rgba(160,235,255,.55)" stroke-width="1.4" fill="none" opacity=".85">
        <path d="M0 34h40v16h26"/><path d="M0 98h26l16-18h30"/>
        <path d="M178 30h-38v22h-28"/><path d="M178 102h-50v-16h-18"/>
        <path d="M96 0v16"/><path d="M82 128v-14"/>
      </g>
      <g fill="#a9f0ff">
        <circle cx="40" cy="50" r="2.4"/><circle cx="26" cy="98" r="2.4"/>
        <circle cx="140" cy="52" r="2.4"/><circle cx="128" cy="86" r="2.4"/>
      </g>
      <g transform="translate(89,64)">
        <g stroke="rgba(224,250,255,.85)" stroke-width="2" stroke-linecap="round">
          <path d="M-26 -14h-12"/><path d="M-26 0h-12"/><path d="M-26 14h-12"/>
          <path d="M26 -14h12"/><path d="M26 0h12"/><path d="M26 14h12"/>
          <path d="M-14 -26v-12"/><path d="M0 -26v-12"/><path d="M14 -26v-12"/>
          <path d="M-14 26v12"/><path d="M0 26v12"/><path d="M14 26v12"/>
        </g>
        <rect x="-26" y="-26" width="52" height="52" rx="11" fill="url(#a-tech-chip)"/>
        <rect x="-26" y="-26" width="52" height="52" rx="11" fill="none" stroke="rgba(255,255,255,.65)"/>
        <rect x="-14" y="-14" width="28" height="28" rx="7" fill="rgba(6,20,40,.78)"/>
        <path d="M-8 3l6 6 13-15" fill="none" stroke="#eafcff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`,

    fin: (c) => `
      <defs>
        <linearGradient id="a-fin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/>
        </linearGradient>
        <linearGradient id="a-fin-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(141,240,196,.55)"/><stop offset="1" stop-color="rgba(141,240,196,0)"/>
        </linearGradient>
      </defs>
      <rect width="178" height="128" fill="url(#a-fin)"/>
      <g fill="rgba(255,255,255,.11)">
        <rect x="20" y="70" width="16" height="42" rx="4"/>
        <rect x="46" y="56" width="16" height="56" rx="4"/>
        <rect x="72" y="76" width="16" height="36" rx="4"/>
        <rect x="98" y="46" width="16" height="66" rx="4"/>
        <rect x="124" y="34" width="16" height="78" rx="4"/>
      </g>
      <path d="M28 64 L54 50 L80 70 L106 42 L132 30 L132 112 L28 112 Z" fill="url(#a-fin-area)"/>
      <path d="M28 64 L54 50 L80 70 L106 42 L132 30" fill="none" stroke="#8df0c4" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="132" cy="30" r="3.8" fill="#d9fff0"/>
      <circle cx="132" cy="30" r="8" fill="none" stroke="rgba(217,255,240,.35)"/>
      <path d="M14 112h150" stroke="rgba(255,255,255,.22)"/>`,

    sport: (c) => `
      <defs>
        <linearGradient id="a-sport" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/>
        </linearGradient>
      </defs>
      <rect width="178" height="128" fill="url(#a-sport)"/>
      <g fill="none" stroke="rgba(255,224,180,.30)" stroke-width="1.4">
        <ellipse cx="89" cy="122" rx="94" ry="46"/>
        <ellipse cx="89" cy="122" rx="58" ry="26"/>
        <path d="M-6 122h190"/>
      </g>
      <g stroke="rgba(255,255,255,.22)" stroke-width="7" stroke-linecap="round">
        <path d="M16 44h30"/><path d="M10 60h24"/><path d="M26 30h18"/>
      </g>
      <circle cx="108" cy="60" r="29" fill="#f6faff"/>
      <circle cx="108" cy="60" r="29" fill="none" stroke="rgba(10,26,50,.35)"/>
      <path d="M108 31c7 9 10 19 10 29s-3 20-10 29" fill="none" stroke="rgba(10,26,50,.30)" stroke-width="1.6"/>
      <path d="M79 60h58" fill="none" stroke="rgba(10,26,50,.22)" stroke-width="1.6"/>
      <path d="M94 43l14 10-5 16h-18l-5-16z" fill="#ffca7a"/>
      <path d="M94 43l14 10-5 16h-18l-5-16z" fill="none" stroke="rgba(10,26,50,.35)"/>`,

    culture: (c) => `
      <defs>
        <linearGradient id="a-cul" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/>
        </linearGradient>
        <linearGradient id="a-cul-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(255,214,240,.55)"/><stop offset="1" stop-color="rgba(255,214,240,0)"/>
        </linearGradient>
        <linearGradient id="a-cul-beam2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(180,205,255,.50)"/><stop offset="1" stop-color="rgba(180,205,255,0)"/>
        </linearGradient>
      </defs>
      <rect width="178" height="128" fill="url(#a-cul)"/>
      <path d="M40 8h16l26 120H30z" fill="url(#a-cul-beam)"/>
      <path d="M138 8h-16l-26 120h52z" fill="url(#a-cul-beam2)"/>
      <g fill="#ffe2a8">
        <circle cx="40" cy="10" r="4.5"/><circle cx="138" cy="10" r="4.5"/>
        <circle cx="74" cy="94" r="8.5"/><circle cx="116" cy="82" r="8.5"/>
        <rect x="79" y="52" width="4.4" height="42" rx="2"/>
        <rect x="121" y="40" width="4.4" height="42" rx="2"/>
        <path d="M79 52l46-12v11l-46 12z"/>
      </g>
      <g fill="rgba(8,14,30,.6)"><rect x="0" y="118" width="178" height="10"/></g>
      <g fill="rgba(255,255,255,.30)">
        <rect x="6" y="120" width="6" height="6" rx="1.5"/><rect x="24" y="120" width="6" height="6" rx="1.5"/>
        <rect x="42" y="120" width="6" height="6" rx="1.5"/><rect x="60" y="120" width="6" height="6" rx="1.5"/>
        <rect x="78" y="120" width="6" height="6" rx="1.5"/><rect x="96" y="120" width="6" height="6" rx="1.5"/>
        <rect x="114" y="120" width="6" height="6" rx="1.5"/><rect x="132" y="120" width="6" height="6" rx="1.5"/>
        <rect x="150" y="120" width="6" height="6" rx="1.5"/>
      </g>`,

    weather: (c) => `
      <defs>
        <linearGradient id="a-wt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/>
        </linearGradient>
      </defs>
      <rect width="178" height="128" fill="url(#a-wt)"/>
      <g fill="#e8f7ff" opacity=".75">
        <circle cx="24" cy="96" r=".9"/><circle cx="156" cy="26" r="1"/><circle cx="140" cy="108" r=".8"/>
      </g>
      <circle cx="132" cy="34" r="17" fill="#ffe6a8" opacity=".85"/>
      <circle cx="132" cy="34" r="26" fill="rgba(255,230,168,.16)"/>
      <g>
        <rect x="66" y="52" width="46" height="26" rx="7" fill="#dceaf8"/>
        <rect x="66" y="52" width="46" height="26" rx="7" fill="none" stroke="rgba(20,50,90,.4)"/>
        <rect x="20" y="46" width="42" height="16" rx="3" fill="#7fd2ff" opacity=".9"/>
        <rect x="116" y="58" width="42" height="16" rx="3" fill="#7fd2ff" opacity=".9"/>
        <g stroke="rgba(10,30,60,.5)" stroke-width="1">
          <path d="M34 46v16M48 46v16"/><path d="M130 58v16M144 58v16"/>
        </g>
        <path d="M89 52v-8" stroke="#dceaf8" stroke-width="2.4"/>
        <circle cx="89" cy="40" r="4" fill="#eaf7ff"/>
      </g>
      <g fill="rgba(255,255,255,.85)">
        <path d="M40 96c0-7 6-12 13-11 3-6 10-8 15-4 6-3 13 1 13 8 0 6-5 10-11 10H48c-5 0-8-1-8-3z" opacity=".55"/>
        <path d="M92 108c0-5 4-9 10-8 2-5 8-6 12-3 5-2 10 1 10 6 0 5-4 8-8 8h-24z" opacity=".35"/>
      </g>`,

    life: (c) => `
      <defs>
        <linearGradient id="a-life" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/>
        </linearGradient>
        <linearGradient id="a-life-mug" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff3e0"/><stop offset="1" stop-color="#e2b96f"/>
        </linearGradient>
      </defs>
      <rect width="178" height="128" fill="url(#a-life)"/>
      <circle cx="140" cy="28" r="16" fill="#ffe6a8" opacity=".65"/>
      <g fill="none" stroke="rgba(255,235,205,.55)" stroke-width="2" stroke-linecap="round">
        <path d="M62 62c-6-8 6-12 0-20"/><path d="M78 58c-6-9 6-13 0-22"/>
      </g>
      <path d="M52 74h52v26a16 16 0 0 1-16 16H68a16 16 0 0 1-16-16z" fill="url(#a-life-mug)"/>
      <path d="M104 82h10a11 11 0 0 1 0 22h-10" fill="none" stroke="url(#a-life-mug)" stroke-width="7"/>
      <ellipse cx="78" cy="74" rx="26" ry="7" fill="#8a5a2a" opacity=".55"/>
      <ellipse cx="78" cy="74" rx="26" ry="7" fill="none" stroke="rgba(255,255,255,.5)"/>
      <g><path d="M22 118c0-14 10-24 24-24-1 14-10 23-24 24z" fill="#6fdca0" opacity=".85"/>
      <path d="M46 118c0-10 8-18 18-18 0 10-8 18-18 18z" fill="#4fc98c" opacity=".8"/>
      <path d="M34 118v-14" stroke="#3fa878" stroke-width="3" stroke-linecap="round"/></g>
      <path d="M0 118h178" stroke="rgba(255,225,180,.22)"/>`
  };

  function cardArt(cat) {
    return `<svg viewBox="0 0 178 128" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${ART[cat.k](cat)}</svg>`;
  }

  /* ---------------------------------------------------------
     三、星空
     --------------------------------------------------------- */
  const canvas = $('#starfield');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  let stars = [], shots = [];

  function resizeStars() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const n = Math.round(W * H / 8600);
    stars = Array.from({ length: n }, () => {
      const warm = Math.random();
      return {
        x: Math.random() * W,
        y: Math.random() * H * 0.94,
        r: Math.random() * 1.25 + 0.28,
        a: Math.random() * 0.62 + 0.28,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.022 + 0.004,
        c: warm > 0.9 ? '255,222,180' : warm > 0.74 ? '180,232,255' : '255,255,255'
      };
    });
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.tw += s.sp;
      const tw = 0.62 + 0.38 * Math.sin(s.tw);
      const a = s.a * tw;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.r > 1.15) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.c},${(a * 0.14).toFixed(3)})`;
        ctx.arc(s.x, s.y, s.r * 4.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // 流星
    if (Math.random() < 0.0022 && shots.length < 2) {
      shots.push({
        x: Math.random() * W * 0.7 + W * 0.25,
        y: Math.random() * H * 0.36,
        vx: -(3.4 + Math.random() * 2.4),
        vy: 1.7 + Math.random() * 1.2,
        life: 1
      });
    }
    for (let i = shots.length - 1; i >= 0; i--) {
      const m = shots[i];
      m.x += m.vx; m.y += m.vy; m.life -= 0.012;
      if (m.life <= 0) { shots.splice(i, 1); continue; }
      const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 16, m.y - m.vy * 16);
      g.addColorStop(0, `rgba(230,248,255,${(0.85 * m.life).toFixed(3)})`);
      g.addColorStop(1, 'rgba(230,248,255,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 16, m.y - m.vy * 16);
      ctx.stroke();
    }
  }

  /* ---------------------------------------------------------
     四、圆环新闻版块
     --------------------------------------------------------- */
  const stage = $('#ringStage');
  const dotsWrap = $('#ringDots');
  const N = CATS.length;
  const R = 460;          // 圆环半径
  const STEP = 20;        // 每格角度
  const MAXA = 68;        // 可见角度上限
  const TILT = 0.28;      // 俯视倾斜
  const ROT = 0.72;       // 卡片切向旋转比例

  let offset = 0, target = 0, velocity = 0, dragging = false, lastX = 0, moved = 0;
  let lastInteract = Date.now();
  let ringDirty = true;

  const attr = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

  const cards = CATS.map((cat, i) => {
    const el = document.createElement('article');
    el.className = 'card';
    el.dataset.i = String(i);
    el.innerHTML =
      `<div class="card__bg">` +
        `${cardArt(cat)}` +
        `<img class="card__photo" src="${attr(cat.img)}" alt="" referrerpolicy="no-referrer" decoding="async">` +
      `</div>` +
      `<div class="card__tint" style="background:${cat.accent}"></div>` +
      `<div class="card__shade"></div>` +
      `<div class="card__glow"></div>` +
      `<span class="card__dot" style="color:${cat.accent};background:${cat.accent}"></span>` +
      `<span class="card__idx">${String(i + 1).padStart(2, '0')}</span>` +
      `<div class="card__text"><h3>${cat.name}</h3><p>${cat.en}</p></div>` +
      `<span class="card__tag">当前版块</span>`;
    // 图片加载成功后淡入；若被图床拦截或断网，则移除图片，露出底层的矢量插画
    const photo = el.querySelector('.card__photo');
    if (photo) {
      const onOk = () => photo.classList.add('is-ready');
      const onBad = () => photo.remove();
      photo.addEventListener('load', onOk);
      photo.addEventListener('error', onBad);
      if (photo.complete && photo.naturalWidth > 0) onOk();
    }
    el.addEventListener('click', () => {
      if (moved > 6) return;
      const u = shortestU(i);
      if (Math.abs(u) < 0.5) { play(cat); }
      else { target = offset + u; lastInteract = Date.now(); ringDirty = true; }
    });
    stage.appendChild(el);
    return el;
  });

  const dots = CATS.map(() => {
    const d = document.createElement('i');
    dotsWrap.appendChild(d);
    return d;
  });

  function shortestU(i) {
    let u = (((i - offset) % N) + N) % N;
    if (u > N / 2) u -= N;
    return u;
  }

  function updateRing() {
    for (let i = 0; i < N; i++) {
      const el = cards[i];
      let u = (((i - offset) % N) + N) % N;
      if (u > N / 2) u -= N;
      const th = u * STEP;
      const rad = th * Math.PI / 180;
      const x = R * Math.sin(rad);
      const z = R * Math.cos(rad);
      const y = TILT * z;
      const abs = Math.abs(th);
      const t = clamp((abs - 50) / (MAXA - 50), 0, 1);
      const op = abs > MAXA ? 0 : 1 - t * 0.86;
      el.style.transform =
        `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateY(${(th * ROT).toFixed(2)}deg)`;
      el.style.opacity = op.toFixed(3);
      el.style.zIndex = String(Math.round(2000 - z));
      el.style.pointerEvents = op < 0.25 ? 'none' : 'auto';
      el.classList.toggle('is-active', Math.abs(u) < 0.5);
    }
    const active = ((Math.round(offset) % N) + N) % N;
    dots.forEach((d, i) => d.classList.toggle('on', i === active));
    if (active !== updateRing.lastActive) {
      updateRing.lastActive = active;
      previewCategory(CATS[active]);
    }
  }

  // 拖动 / 滚轮 / 键盘
  const ring = $('#ring');
  ring.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.ring__play')) return;
    dragging = true; moved = 0; lastX = e.clientX; velocity = 0;
    ring.setPointerCapture(e.pointerId);
    ring.style.cursor = 'grabbing';
  });
  ring.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    const d = -dx / 150;
    offset += d; target = offset;
    velocity = d;
    lastInteract = Date.now();
    ringDirty = true;
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    ring.style.cursor = '';
    target = Math.round(offset + clamp(velocity * 9, -2.4, 2.4));
    velocity = 0;
    lastInteract = Date.now();
    ringDirty = true;
  }
  ring.addEventListener('pointerup', endDrag);
  ring.addEventListener('pointercancel', endDrag);
  let wheelTimer = 0;
  ring.addEventListener('wheel', (e) => {
    e.preventDefault();
    const d = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) / 300;
    target += clamp(d, -1.4, 1.4);
    lastInteract = Date.now();
    ringDirty = true;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => {
      target = Math.round(target);
      lastInteract = Date.now();
      ringDirty = true;
    }, 200);
  }, { passive: false });
  ring.tabIndex = 0;
  ring.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { target = Math.round(target) + 1; lastInteract = Date.now(); }
    if (e.key === 'ArrowLeft') { target = Math.round(target) - 1; lastInteract = Date.now(); }
    if (e.key === 'Enter') play(CATS[((Math.round(offset) % N) + N) % N]);
  });

  /* ---------------------------------------------------------
     五、机器人播报
     --------------------------------------------------------- */
  const robot = $('#robot');
  const holoCat = $('#holoCat');
  const holoLine = $('#holoLine');
  const holoMeta = $('#holoMeta');
  const holoTag = $('#holoTag');

  // 机器人图片：默认 ./assets/podcast-bot.png；
  // 若页面被单独放在别的目录，第一次加载失败时自动换一条常见路径再试
  const botPhoto = $('.bot__photo');
  if (botPhoto) {
    botPhoto.addEventListener('error', () => {
      const alt = './orbital-news-pod/assets/podcast-bot.png';
      if (botPhoto.dataset.retried || botPhoto.getAttribute('src') === alt) return;
      botPhoto.dataset.retried = '1';
      botPhoto.src = alt;
    });
  }

  // 浇水壶 / 小植株：优先用 assets 里的图片，找不到就自动退回内置矢量图
  const PROP_FILES = {
    canPhoto: ['shuihu-cut.png', 'shuihu-cut.jpg', 'shuihu.png', 'shuihu.jpg', 'shuihu.jpeg', 'shuihu.webp', 'shuihu.jpd'],
    jarPhoto: ['zhizhu-cut.png', 'zhizhu-cut.jpg', 'zhizhu.png', 'zhizhu.jpg', 'zhizhu.jpeg', 'zhizhu.webp', 'zhizhu.jpd']
  };
  Object.keys(PROP_FILES).forEach((id) => {
    const img = $('#' + id);
    if (!img) return;
    const wrap = img.closest ? img.closest('.can, .jar') : null;
    const files = PROP_FILES[id];
    let i = 0;
    const tryNext = () => {
      if (i >= files.length) { if (img.remove) img.remove(); return; }
      img.src = './assets/' + files[i++];
    };
    img.addEventListener('load', () => { if (wrap && wrap.classList) wrap.classList.add('has-photo'); });
    img.addEventListener('error', tryNext);
    tryNext();
  });

  let speakId = 0;
  let speaking = false;

  function resetTags() {
    cards.forEach((c) => { $('.card__tag', c).textContent = '当前版块'; });
  }

  function typeLine(text, speed) {
    const myId = speakId;
    holoLine.textContent = '';
    return new Promise((resolve) => {
      let i = 0;
      const tick = () => {
        if (myId !== speakId) return resolve(false);
        holoLine.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(tick, speed || 34);
        else resolve(true);
      };
      tick();
    });
  }

  function previewCategory(cat) {
    if (speaking) return;
    holoCat.textContent = cat.name;
    holoTag.textContent = 'READY';
    holoLine.textContent = `${cat.name}：${cat.items[0].t}`;
    holoMeta.textContent = '点击中央卡片或“播报”开始';
  }

  async function play(cat) {
    speakId++;
    const myId = speakId;
    resetTags();
    const idx = CATS.indexOf(cat);
    const liveTag = idx >= 0 ? $('.card__tag', cards[idx]) : null;
    if (liveTag) liveTag.textContent = '正在播报';
    speaking = true;
    robot.classList.add('is-speaking');
    holoCat.textContent = cat.name;
    holoTag.textContent = 'ON AIR';
    sfxTune();

    const seq = cat.items.map((it) => ({ ...it, quip: false }))
      .concat([{ t: cat.quip, s: '播报员附言 · 私人频道', quip: true }]);

    for (const item of seq) {
      if (myId !== speakId) return;
      const ok = await typeLine(item.t, item.quip ? 40 : 30);
      if (!ok || myId !== speakId) return;
      holoMeta.textContent = item.s;
      sfxBlip(item.quip);
      await sleep(item.quip ? 3400 : 2300);
    }
    if (myId !== speakId) return;
    speaking = false;
    if (liveTag) liveTag.textContent = '当前版块';
    robot.classList.remove('is-speaking');
    holoTag.textContent = 'STANDBY';
    holoMeta.textContent = '播报结束 · 下一段等待唤醒';
  }

  $('#playBtn').addEventListener('click', () => {
    play(CATS[((Math.round(offset) % N) + N) % N]);
  });

  /* ---------------------------------------------------------
     六、浇水与小苗
     --------------------------------------------------------- */
  const jar = $('#jar');
  const jarArt = $('#jarArt');
  const jarTag = $('#jarTag');
  const can = $('#can');
  const waterLayer = $('#waterLayer');
  const toastEl = $('#toast');

  let moisture = 42;
  let stage_ = 0;
  let watering = false;
  let toastTimer = 0;

  const WATER_LINES = [
    '补水完成。你看，它把叶子抬起来了——这是植物的“谢谢”。',
    '长得不错。要我说，这株小苗比大多数实习生都稳定。',
    '已经完全喝饱了。再多就要被淹——关心也要有分寸，对人也一样。'
  ];

  function setWater() {
    const h = 26 + moisture * 0.42;
    const rect = $('.jr-water', jarArt);
    rect.setAttribute('height', h.toFixed(1));
    rect.setAttribute('y', (256 - h).toFixed(1));
    rect.setAttribute('opacity', moisture > 50 ? '0.95' : '0.55');
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  function dropFly(fromX, fromY, toX, toY, delay) {
    const d = document.createElement('span');
    d.className = 'drop';
    const size = 5 + Math.random() * 5;
    d.style.width = size + 'px';
    d.style.height = (size * 1.35) + 'px';
    d.style.left = fromX + 'px';
    d.style.top = fromY + 'px';
    waterLayer.appendChild(d);
    const midX = fromX + (toX - fromX) * 0.55 + (Math.random() * 18 - 9);
    const midY = fromY + (toY - fromY) * 0.45;
    const anim = d.animate([
      { transform: 'translate(0,0) scale(.6)', opacity: 0 },
      { transform: `translate(${midX - fromX}px,${midY - fromY}px) scale(1)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${toX - fromX}px,${toY - fromY}px) scale(.8)`, opacity: 1 }
    ], { duration: 620 + Math.random() * 160, delay, easing: 'cubic-bezier(.4,.1,.7,1)', fill: 'forwards' });
    anim.onfinish = () => {
      d.remove();
      const s = document.createElement('span');
      s.className = 'splash';
      s.style.left = toX + 'px';
      s.style.top = toY + 'px';
      waterLayer.appendChild(s);
      setTimeout(() => s.remove(), 700);
    };
  }

  function water() {
    if (watering) return;
    watering = true;
    lastInteract = Date.now();
    // 抬升高度：让水壶大约有一半壶身高出植株顶部
    // offsetHeight 不受 transform 影响，取的是真实布局高度
    const canH = can.offsetHeight || can.getBoundingClientRect().height;
    const jarH = jar.offsetHeight || jar.getBoundingClientRect().height;
    const lift = Math.max(24, jarH - canH * 0.5);
    can.style.setProperty('--pour-lift', lift.toFixed(1) + 'px');
    can.classList.add('is-pouring');
    jar.classList.add('is-watering');
    sfxWater();

    // 等壶身抬起、向右倾倒到位后再取点：
    // getBoundingClientRect 会带上 transform，所以拿到的是倾斜后的真实位置
    setTimeout(() => {
      const canRect = can.getBoundingClientRect();
      const jr = jar.getBoundingClientRect();
      const appRect = $('#app').getBoundingClientRect();
      const fromX = canRect.left + canRect.width * 0.80 - appRect.left;
      const fromY = canRect.top + canRect.height * 0.10 - appRect.top;
      const toX = jr.left + jr.width * 0.5 - appRect.left;
      const toY = jr.top + jr.height * 0.62 - appRect.top;
      for (let i = 0; i < 9; i++) {
        dropFly(fromX, fromY, toX + (Math.random() * 18 - 9), toY, i * 85);
      }
    }, 200);

    setTimeout(() => {
      moisture = clamp(moisture + 18, 0, 96);
      const newStage = clamp(Math.round((moisture - 42) / 18), 0, 3);
      const grew = newStage > stage_;
      stage_ = newStage;
      jarArt.dataset.stage = String(stage_);
      setWater();
      jarTag.textContent = `小苗 · 湿润度 ${moisture}%`;
      jar.classList.add('show-tag');
      setTimeout(() => jar.classList.remove('show-tag'), 3600);
      toast(grew ? `小苗长高了一点 · 湿润度 ${moisture}%` : `土壤湿润度 ${moisture}%`);

      // 让机器人说一句
      const line = moisture >= 96 ? WATER_LINES[2] : WATER_LINES[clamp(stage_ - 1, 0, 2)];
      speakId++;
      resetTags();
      const myId = speakId;
      speaking = true;
      robot.classList.add('is-speaking');
      holoCat.textContent = '生活贴士';
      holoTag.textContent = 'ON AIR';
      typeLine(line, 42).then((ok) => {
        if (!ok || myId !== speakId) return;
        holoMeta.textContent = '播报员附言 · 私人频道';
        setTimeout(() => {
          if (myId !== speakId) return;
          speaking = false;
          robot.classList.remove('is-speaking');
          holoTag.textContent = 'STANDBY';
        }, 2800);
      });
    }, 950);

    setTimeout(() => {
      can.classList.remove('is-pouring');
      jar.classList.remove('is-watering');
      watering = false;
    }, 1500);
  }

  can.addEventListener('click', water);
  jar.addEventListener('click', water);

  /* ---------------------------------------------------------
     七、音效（默认关闭）
     --------------------------------------------------------- */
  const soundBtn = $('#soundBtn');
  const soundLabel = $('#soundLabel');
  let soundOn = false;
  let actx = null;

  function audio() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      actx = new AC();
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }

  function tone(freq, dur, type, gain, delay) {
    if (!soundOn) return;
    const ac = audio(); if (!ac) return;
    const t0 = ac.currentTime + (delay || 0);
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.05, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(ac.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.04);
  }

  function noiseBurst(dur, from, to, gain) {
    if (!soundOn) return;
    const ac = audio(); if (!ac) return;
    const n = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(1, n, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ac.createBufferSource(); src.buffer = buf;
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(from, ac.currentTime);
    bp.frequency.exponentialRampToValueAtTime(to, ac.currentTime + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(gain || 0.16, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    src.connect(bp); bp.connect(g); g.connect(ac.destination);
    src.start();
  }

  function sfxBlip(deep) {
    if (!soundOn) return;
    tone(deep ? 520 : 880, 0.09, 'triangle', 0.05, 0);
    tone(deep ? 780 : 1320, 0.07, 'triangle', 0.035, 0.07);
  }
  function sfxTune() {
    [660, 880, 1180].forEach((f, i) => tone(f, 0.08, 'square', 0.028, i * 0.09));
  }
  function sfxWater() {
    noiseBurst(1.25, 2400, 700, 0.14);
    tone(300, 0.5, 'sine', 0.02, 0.1);
  }

  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    soundLabel.textContent = soundOn ? '静音' : '音效';
    if (soundOn) { audio(); sfxBlip(); toast('播报音效已开启'); }
    else toast('播报音效已关闭');
  });

  /* ---------------------------------------------------------
     八、全屏 & 时钟
     --------------------------------------------------------- */
  $('#fsBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen && document.exitFullscreen();
    }
  });

  const clockUTC = $('#clockUTC');
  const clockLocal = $('#clockLocal');
  const dateLocal = $('#dateLocal');
  const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  function tickClock() {
    const now = new Date();
    const p = (n) => String(n).padStart(2, '0');
    clockUTC.textContent = `${p(now.getUTCHours())}:${p(now.getUTCMinutes())}`;
    clockLocal.textContent = `${p(now.getHours())}:${p(now.getMinutes())}`;
    dateLocal.textContent = `${now.getMonth() + 1}月${now.getDate()}日 ${WEEK[now.getDay()]}`;
  }
  tickClock();
  setInterval(tickClock, 10000);

  /* ---------------------------------------------------------
     九、主循环
     --------------------------------------------------------- */
  let prev = performance.now();
  function loop(t) {
    const dt = Math.min(0.05, (t - prev) / 1000);
    prev = t;

    drawStars(t);

    // 阻尼跟随 + 吸附
    const d = target - offset;
    if (Math.abs(d) > 0.0015) {
      offset += d * Math.min(1, dt * 7.5);
      ringDirty = true;
    } else if (Math.abs(d) > 0) {
      offset = target;
      ringDirty = true;
    }
    if (ringDirty) { updateRing(); ringDirty = false; }

    // 空闲轮巡
    if (!dragging && !speaking && Date.now() - lastInteract > 14000) {
      target = Math.round(target) + 1;
      lastInteract = Date.now() - 4000;
      ringDirty = true;
    }

    requestAnimationFrame(loop);
  }

  /* ---------------------------------------------------------
     十、启动
     --------------------------------------------------------- */
  function start() {
    resizeStars();
    setWater();
    updateRing();
    requestAnimationFrame(loop);
    setTimeout(() => previewCategory(CATS[0]), 600);
    jar.classList.add('show-tag');
    setTimeout(() => jar.classList.remove('show-tag'), 5200);

    // 视差
    const earth = $('.earth');
    const orbit = $('.orbit-line');
    $('#app').addEventListener('pointermove', (e) => {
      const r = $('#app').getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      if (earth) earth.style.transform = `translate3d(${(-nx * 20).toFixed(1)}px,${(-ny * 10).toFixed(1)}px,0)`;
      if (orbit) orbit.style.transform = `rotate(-7deg) translate3d(${(-nx * 14).toFixed(1)}px,0,0)`;
    });

    // 开场提示
    setTimeout(() => toast('拖动圆环切换版块 · 点击中央卡片开始播报'), 2600);
  }

  let rt = 0;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { resizeStars(); ringDirty = true; }, 160);
  });

  start();
})();
