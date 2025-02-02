const drawButton = document.getElementById('drawButton');
const resetButton = document.getElementById('resetButton');
const resultItemsDiv = document.getElementById('resultItems');
const totalDrawCountSpan = document.getElementById('totalDrawCount');
const bcGroupCountSpan = document.getElementById('bcGroupCount');
const a1GroupCountSpan = document.getElementById('a1GroupCount');
const totalCostSpan = document.getElementById('totalCost');
const drawHistoryUl = document.getElementById('drawHistory');
const groupHistoryUl = document.getElementById('groupHistory');

let totalDrawCount = 0;
let bcGroupCount = 0;
let a1GroupCount = 0;
let totalCost = 0;
let drawHistory = [];
let groupHistory = {};

// アイテムデータ
const items = {
  A1: [
        "SP許褚", "SP張宝", "SP張梁", "SP龐徳", "伊籍", "王異", "王双", "王平", "黄蓋", "黄月英", "黄忠", "夏侯惇", "夏侯淵", "華雄", "華佗", "郭嘉", "楽進", "甘寧", "関興", "顔良", "許攸", "許褚", "厳顔", "公孫瓚", "高順", "高覽", "麹義", "左慈", "司馬徽", "周瑜", "祝融", "諸葛恪", "徐晃", "徐庶", "小喬", "鍾会", "曹純", "曹植", "曹仁", "曹丕", "孫堅", "孫策", "大喬", "張春華", "張昭", "張譲", "張郃", "陳グン", "陳到", "程普", "程昱", "田豊", "董卓", "董白", "馬忠", "馬超", "馬騰", "文醜", "法正", "孟獲", "李儒", "陸抗", "呂蒙", "呂玲綺", "于吉", "于禁", "兀突骨", "朶思大王", "沮授", "甄氏", "荀攸", "荀彧", "蔡琰", "蔡邕", "袁術", "袁紹", "貂蝉", "鄒氏", "鄧艾", "龐德"
    ],
    A2: [
      "曹操", "諸葛亮", "劉備", "SP郭嘉", "SP関羽", "SP皇甫嵩", "SP朱儁", "SP周瑜", "SP諸葛亮", "SP曹真", "SP馬超", "SP劉曄", "SP呂蒙", "SP荀彧", "SP袁紹", "王元姬", "関羽", "関銀屏", "周泰", "太史慈", "張角", "張飛", "張苞", "典韋", "満寵", "陸遜", "呂布", "姜維", "趙雲", "魏延"
    ],
    A3: ["孫権"],
    B: [
        "逢紀", "王朗", "黄権", "郭図", "郭淮", "郭汜", "管亥", "簡雍", "関平", "韓遂", "韓当", "紀靈", "胡車児", "顧雍", "孔融", "皇甫嵩", "沙摩柯", "朱桓", "朱儁", "周倉", "諸葛瑾", "徐盛", "鍾繇", "審配", "曹洪", "曹彰", "曹真", "丁奉", "張燕", "張繍", "張任", "張宝", "張梁", "張魯", "張曼成", "陳武", "陳琳", "董允", "董襲", "馬鉄", "馬良", "馬謖", "費禕", "文聘", "歩練師", "楊脩", "李厳", "李典", "李傕", "劉表", "劉封", "劉曄", "呂範", "廖化", "潘璋", "盧植", "糜竺", "臧霸", "蔣欽"
    ],
    C: [
         "王允", "何進", "夏侯恩", "華歆", "卞喜", "虞翻", "向寵", "車胃", "朱然", "諸葛瞻", "全琮", "宋憲", "曹休", "孫乾", "孫皓", "丁原", "董昭", "陶謙", "費詩", "歩騭", "毛玠", "劉禅", "劉巴", "劉繇", "呂虔", "傅士仁", "潘鳳", "潘濬", "糜芳", "呉懿", "鄧芝", "閱沢"
    ]
};


const probabilities = {
    A1: 4.7135136 / 80,
    A2: 0.8675676 / 30,
    A3: 0.0189188,
    B: 36.00 / 59,
    C: 58.40 / 32
};


function getRandomItem(group) {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
      if (group === "A1"){
        cumulativeProbability = probabilities.A1 * items.A1.length
        if(random <= cumulativeProbability){
            const randomIndex = Math.floor(Math.random() * items.A1.length);
            return {item:items.A1[randomIndex], group:"A1"};
        }
    }else if(group === "A2"){
        cumulativeProbability = probabilities.A2 * items.A2.length
         if(random <= cumulativeProbability){
            const randomIndex = Math.floor(Math.random() * items.A2.length);
            return {item:items.A2[randomIndex], group:"A2"};
        }
    }else if(group === "A3"){
        cumulativeProbability = probabilities.A3
         if(random <= cumulativeProbability){
            const randomIndex = Math.floor(Math.random() * items.A3.length);
           return {item:items.A3[randomIndex],group:"A3"};
        }
    }else if(group === "B"){
        cumulativeProbability = probabilities.B * items.B.length
         if(random <= cumulativeProbability){
             const randomIndex = Math.floor(Math.random() * items.B.length);
            return {item:items.B[randomIndex],group:"B"};
        }
    }else if(group === "C"){
         cumulativeProbability = probabilities.C * items.C.length
        if(random <= cumulativeProbability){
             const randomIndex = Math.floor(Math.random() * items.C.length);
            return {item:items.C[randomIndex], group:"C"};
        }
    }
    return null;
}

function drawGacha() {
    let results = [];
    for (let i = 0; i < 5; i++) {
        let drawnItem = null;
        totalDrawCount++;
        let isRedraw = false;

    if(a1GroupCount === 5){
        while(!drawnItem || drawnItem.group === "A1" || drawnItem.group === "B" || drawnItem.group === "C"){
           const group = Math.random() < (probabilities.A2*items.A2.length + probabilities.A3) ? "A2" : "A3" ;
          drawnItem = getRandomItem(group);
          if (drawnItem && (drawnItem.group === "A2"|| drawnItem.group === "A3")){
            a1GroupCount = 0;
           }
        }
    }else if(totalDrawCount % 5 === 0){
        while(!drawnItem || drawnItem.group === "C"){
            const group = Math.random() < (probabilities.A1*items.A1.length + probabilities.A2*items.A2.length + probabilities.A3) ? (Math.random() < (probabilities.A1*items.A1.length) ? "A1" : (Math.random() < (probabilities.A2*items.A2.length) ? "A2" : "A3" )) : "B";
          drawnItem = getRandomItem(group)
        }

        }else if(bcGroupCount === 29){
        while(!drawnItem || drawnItem.group === "B" || drawnItem.group === "C"){
           const group = Math.random() < (probabilities.A1*items.A1.length) ? "A1" : (Math.random() < (probabilities.A2*items.A2.length) ? "A2" : "A3" );
          drawnItem = getRandomItem(group);
            if (drawnItem && (drawnItem.group === "A1"|| drawnItem.group === "A2"|| drawnItem.group === "A3")){
            bcGroupCount = 0;
           }
        }
        }else{
            drawnItem = getRandomItem(Math.random() < (probabilities.A1*items.A1.length + probabilities.A2*items.A2.length + probabilities.A3) ? (Math.random() < (probabilities.A1*items.A1.length) ? "A1" : (Math.random() < (probabilities.A2*items.A2.length) ? "A2" : "A3" )) : (Math.random() < (probabilities.B*items.B.length) ? "B": "C"));
             if(drawnItem.group === "B" || drawnItem.group === "C"){
                  bcGroupCount++
             }
            if(drawnItem.group === "A1"){
                 a1GroupCount++
            }
    }
        results.push(drawnItem);
    }
    return results;
}


function updateDisplay() {
    resultItemsDiv.innerHTML = '';
    const results = drawGacha();

    results.forEach(result => {
        if(result) {
            const itemSpan = document.createElement('span');
            itemSpan.textContent = result.item;
            itemSpan.classList.add(`item-${result.group.toLowerCase()}`);
            resultItemsDiv.appendChild(itemSpan);

            // グループ別履歴
            if (!groupHistory[result.group]) {
                groupHistory[result.group] = {};
            }
            if (!groupHistory[result.group][result.item]) {
                groupHistory[result.group][result.item] = 0;
            }
            groupHistory[result.group][result.item]++;
        }
    });


    totalDrawCountSpan.textContent = totalDrawCount;
    bcGroupCountSpan.textContent = bcGroupCount;
    a1GroupCountSpan.textContent = a1GroupCount;

    // 金額加算
     totalCost += 948;
    totalCostSpan.textContent = totalCost;
      // 履歴の追加
    drawHistory.push(`抽選${totalDrawCount}回目: ${results.map(res => res ? res.item : '再抽選').join(', ')}`);
    if (drawHistory.length > 30) {
        drawHistory.shift(); // 30個以上なら古いものを削除
    }
    drawHistoryUl.innerHTML = drawHistory.map(entry => `<li>${entry}</li>`).join('');

    groupHistoryUl.innerHTML = '';
    for (const group in groupHistory) {
        for (const item in groupHistory[group]) {
            const listItem = document.createElement('li');
            listItem.textContent = `${group}グループ: ${item} × ${groupHistory[group][item]}`;
             groupHistoryUl.appendChild(listItem);
         }
    }
}

function resetGame() {
     totalDrawCount = 0;
     bcGroupCount = 0;
     a1GroupCount = 0;
     totalCost = 0;
     drawHistory = [];
     groupHistory = {};
    totalDrawCountSpan.textContent = 0;
    bcGroupCountSpan.textContent = 0;
    a1GroupCountSpan.textContent = 0;
    totalCostSpan.textContent = 0;
    drawHistoryUl.innerHTML = '';
    groupHistoryUl.innerHTML = '';
    resultItemsDiv.innerHTML = '';
}


drawButton.addEventListener('click', updateDisplay);
resetButton.addEventListener('click', resetGame);