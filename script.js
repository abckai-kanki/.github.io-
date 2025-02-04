const RARITIES = {
    STAR7: { rate: 0.000189188, color: '#FFD700' },
    STAR6: { rate: 0.008675676 / 30, color: '#C0C0C0' },
    STAR5: { rate: 0.047135136 / 80, color: '#FFA500' },
    STAR4: { rate: 0.36 / 59, color: '#FFC0CB' },
    STAR3: { rate: 0.5840 / 32, color: '#87CEEB' },
};

const ITEMS = {
    STAR7: ['孫権'],
    STAR6: ['曹操', '諸葛亮', '劉備', 'SP郭嘉', 'SP関羽', 'SP皇甫嵩', 'SP朱儁', 'SP周瑜', 'SP諸葛亮', 'SP曹真', 'SP馬超', 'SP劉曄', 'SP呂蒙', 'SP荀彧', 'SP袁紹', '王元姬', '関羽', '関銀屏', '周泰', '太史慈', '張角', '張飛', '張苞', '典韋', '満寵', '陸遜', '呂布', '姜維', '趙雲', '魏延'],
    STAR5: ['SP許褚', 'SP張宝', 'SP張梁', 'SP龐徳', '伊籍', '王異', '王双', '王平', '黄蓋', '黄月英', '黄忠', '夏侯惇', '夏侯淵', '華雄', '華佗', '郭嘉', '楽進', '甘寧', '関興', '顔良', '許攸', '許褚', '厳顔', '公孫瓚', '高順', '高覽', '麹義', '左慈', '司馬徽', '周瑜', '祝融', '諸葛恪', '徐晃', '徐庶', '小喬', '鍾会', '曹純', '曹植', '曹仁', '曹丕', '孫堅', '孫策', '大喬', '張春華', '張昭', '張譲', '張郃', '陳グン', '陳到', '程普', '程昱', '田豊', '董卓', '董白', '馬忠', '馬超', '馬騰', '文醜', '法正', '孟獲', '李儒', '陸抗', '呂蒙', '呂玲綺', '于吉', '于禁', '兀突骨', '朶思大王', '沮授', '甄氏', '荀攸', '荀彧', '蔡琰', '蔡邕', '袁術', '袁紹', '貂蝉', '鄒氏', '鄧艾', '龐德'],
    STAR4: ['逢紀', '王朗', '黄権', '郭図', '郭淮', '郭汜', '管亥', '簡雍', '関平', '韓遂', '韓当', '紀靈', '胡車児', '顧雍', '孔融', '皇甫嵩', '沙摩柯', '朱桓', '朱儁', '周倉', '諸葛瑾', '徐盛', '鍾繇', '審配', '曹洪', '曹彰', '曹真', '丁奉', '張燕', '張繍', '張任', '張宝', '張梁', '張魯', '張曼成', '陳武', '陳琳', '董允', '董襲', '馬鉄', '馬良', '馬謖', '費禕', '文聘', '歩練師', '楊脩', '李厳', '李典', '李傕', '劉表', '劉封', '劉曄', '呂範', '廖化', '潘璋', '盧植', '糜竺', '臧霸', '蔣欽'],
    STAR3: ['王允', '何進', '夏侯恩', '華歆', '卞喜', '虞翻', '向寵', '車胃', '朱然', '諸葛瞻', '全琮', '宋憲', '曹休', '孫乾', '孫皓', '丁原', '董昭', '陶謙', '費詩', '歩騭', '毛玠', '劉禅', '劉巴', '劉繇', '呂虔', '傅士仁', '潘鳳', '潘濬', '糜芳', '呉懿', '鄧芝', '閱沢'],
};


let history = [];
let currentResults = [];
let highRarityHistory = [];
let totalSpent = 0;
let rarityStats = {};
let nextDrawGuarantee = 0; // 次の抽選に適用する確定レア度
let guaranteeRewrite = false; // 次の星5が当選した場合に書き換えを行うフラグ
let totalDrawCount = 0; // 総抽選回数

const root = document.getElementById('root');

const drawFromRarity = (minRarity) => {
    let rand = Math.random();
    let totalRate = 0;
    let rates = [];

    if (minRarity <= 7) rates.push({ rarity: 7, rate: RARITIES.STAR7.rate });
    if (minRarity <= 6) rates.push({ rarity: 6, rate: RARITIES.STAR6.rate * 30 });
    if (minRarity <= 5) rates.push({ rarity: 5, rate: RARITIES.STAR5.rate * 80 });
    if (minRarity <= 4) rates.push({ rarity: 4, rate: RARITIES.STAR4.rate * 59 });
    if (minRarity <= 3) rates.push({ rarity: 3, rate: RARITIES.STAR3.rate * 32 });

    const totalRates = rates.reduce((sum, { rate }) => sum + rate, 0);
    rand = rand * totalRates;

    for (const { rarity, rate } of rates) {
        totalRate += rate;
        if (rand < totalRate) {
            const itemList = {
                7: ITEMS.STAR7,
                6: ITEMS.STAR6,
                5: ITEMS.STAR5,
                4: ITEMS.STAR4,
                3: ITEMS.STAR3
            }[rarity];

            const itemIndex = Math.floor(Math.random() * itemList.length);
            return {
                name: itemList[itemIndex],
                rarity: rarity,
                color: RARITIES[`STAR${rarity}`].color
            };
        }
    }

    return {
        name: ITEMS.STAR3[0],
        rarity: 3,
        color: RARITIES.STAR3.color
    };
};

const checkGuarantees = () => {
    let guarantees = [];
    
    if (highRarityHistory.length >= 5 && 
        highRarityHistory.slice(-5).every(item => item.rarity === 5)) {
          guaranteeRewrite = true;
    }
    
    if (history.length >= 29 && 
        history.slice(-29).every(item => item.rarity < 5)) {
      guarantees.push(5);
    }
     return  guarantees.length > 0 ? Math.max(...guarantees) : 0;
}



const drawOne = (drawIndex, isMultiDraw) => {
    let minRarity = 3; // 初期値は星3以上
    let result;
    
    // 確定レア度があれば適用し、リセット
    if(nextDrawGuarantee > 0){
      minRarity = nextDrawGuarantee;
      nextDrawGuarantee = 0;
    } else if (drawIndex % 5 === 4) {
       minRarity = 4; // 5連の5回目は星4以上確定
    }
    
    result = drawFromRarity(minRarity);

    if(guaranteeRewrite && result.rarity === 5) {
        guaranteeRewrite = false;
        const newResult = drawFromRarity(6);
        
        //結果書き換え
        result.name = newResult.name;
        result.rarity = newResult.rarity;
        result.color = newResult.color;
    }
    
    if (result.rarity >= 5) {
        highRarityHistory.push(result);
    }
    
    rarityStats[result.name] = (rarityStats[result.name] || 0) + 1;
    
    history.push(result);
      if(history.length > 200) {
          history = history.slice(-200);
    }
     
    // 抽選後の確定判定
      if(isMultiDraw) {
         const nextGuarantee = checkGuarantees();
          if(nextGuarantee > 0) {
            nextDrawGuarantee = nextGuarantee;
          }
      }
    return result;
};

const draw = (times) => {
    const newResults = [];
    for (let i = 0; i < times; i++) {
      newResults.push(drawOne(i, times > 1));
        totalDrawCount++; // 総抽選回数をインクリメント
    }
    
    currentResults = newResults;
    
    totalSpent += (times === 1 ? 198 : 948);
    render();
};

const reset = () => {
    history = [];
    currentResults = [];
    highRarityHistory = [];
    totalSpent = 0;
    rarityStats = {};
    nextDrawGuarantee = 0;
    guaranteeRewrite = false;
    totalDrawCount = 0;
    render();
};

const displayHistory = () => history.slice(-30);

const star5PlusStats = () => {
    return Object.entries(rarityStats)
      .filter(([name]) => 
        ITEMS.STAR7.includes(name) || 
        ITEMS.STAR6.includes(name) || 
        ITEMS.STAR5.includes(name)
      )
      .sort((a, b) => {
        const aRarity = ITEMS.STAR7.includes(a[0]) ? 7 : 
                       ITEMS.STAR6.includes(a[0]) ? 6 : 5;
        const bRarity = ITEMS.STAR7.includes(b[0]) ? 7 : 
                       ITEMS.STAR6.includes(b[0]) ? 6 : 5;
        return bRarity - aRarity || b[1] - a[1];
      });
  };


const render = () => {
    root.innerHTML = `
        <div class="card">
            <div class="button-container">
                <button onclick="draw(1)" class="w-24">1回登用</button>
                <button onclick="draw(5)" class="w-24">5回登用</button>
                <button onclick="reset()" class="w-24 outline">リセット</button>
            </div>

            ${currentResults.length > 0 ? `
                <div class="result-container">
                    <h3>今回の結果</h3>
                    <div class="result-items">
                        ${currentResults.map((result, index) => `
                            <span key="${index}" style="color: ${result.color}">
                                ${index + 1}: ${result.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="history-container">
                <h3>履歴（直近30回）</h3>
                <div class="history-items">
                    ${displayHistory().map((result, index) => `
                        <span key="${index}" style="color: ${result.color}">${result.name}</span>
                    `).join('')}
                </div>
            </div>

            <div class="stats-container">
                <h3>統計情報</h3>
                <p>総抽選回数: ${totalDrawCount}回</p>
                <p>消費金額: ${totalSpent}金</p>
            </div>

          <div class="stats-container">
              <h3>★5以上の獲得履歴</h3>
              <div class="stats-items">
                ${star5PlusStats().map(([name, count]) => `
                    <div key="${name}">
                      <span style="color: ${
                          ITEMS.STAR7.includes(name) ? RARITIES.STAR7.color :
                          ITEMS.STAR6.includes(name) ? RARITIES.STAR6.color :
                          RARITIES.STAR5.color
                      }">${name}</span>
                    <span>${count}回</span>
                    </div>
                `).join('')}
              </div>
            </div>
        </div>
    `;
};

render();