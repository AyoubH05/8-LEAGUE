// قائمة الفرق
const teams = [
    "تشيلسي", "أرسنال", "مانشستر سيتي", "ليفربول", 
    "توتنهام", "أستون فيلا", "مانشستر يونايتد", "نيوكاسل"
];

// بيانات الترتيب الأولية
let standings = [
    { team: "تشيلسي", played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 8, goalsAgainst: 2, points: 9 },
    { team: "أرسنال", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 3, points: 7 },
    { team: "مانشستر سيتي", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 7, goalsAgainst: 5, points: 7 },
    { team: "ليفربول", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 6, goalsAgainst: 4, points: 6 },
    { team: "توتنهام", played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 5, goalsAgainst: 4, points: 5 },
    { team: "أستون فيلا", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 4, points: 4 },
    { team: "مانشستر يونايتد", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 5, points: 3 },
    { team: "نيوكاسل", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 2, goalsAgainst: 6, points: 1 }
];

// مصفوفة لتخزين المباريات
let matches = [];
let matchesCount = 0;

// دالة لملء جدول الترتيب
function populateStandings() {
    const standingsBody = document.getElementById('standings-body');
    standingsBody.innerHTML = '';
    
    // ترتيب الفرق حسب النقاط
    const sortedStandings = [...standings].sort((a, b) => b.points - a.points);
    
    sortedStandings.forEach((teamData, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="pos">${index + 1}</td>
            <td>${teamData.team}</td>
            <td>${teamData.played}</td>
            <td>${teamData.won}</td>
            <td>${teamData.drawn}</td>
            <td>${teamData.lost}</td>
            <td>${teamData.goalsFor}</td>
            <td>${teamData.goalsAgainst}</td>
            <td>${teamData.points}</td>
        `;
        
        standingsBody.appendChild(row);
    });
}

// دالة لتوليد مباريات عشوائية
function generateRandomMatches() {
    matches = []; // إعادة تعيين المباريات
    
    // إنشاء نسخة من قائمة الفرق لتجنب التكرار
    const availableTeams = [...teams];
    
    // تأكد من أن عدد الفرق زوجي
    if (availableTeams.length % 2 !== 0) {
        availableTeams.push("فريق إضافي"); // إضافة فريق إضافي إذا كان العدد فرديًا
    }
    
    // خلط الفرق عشوائيًا
    for (let i = availableTeams.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableTeams[i], availableTeams[j]] = [availableTeams[j], availableTeams[i]];
    }
    
    // إنشاء 4 مباريات (8 فرق مقسمة إلى 4 مباريات)
    for (let i = 0; i < availableTeams.length; i += 2) {
        const team1 = availableTeams[i];
        const team2 = availableTeams[i + 1];
        
        // تأكد من وجود فريقين مختلفين
        if (team1 && team2 && team1 !== team2) {
            const matchDate = new Date();
            matchDate.setDate(matchDate.getDate() + Math.floor(Math.random() * 7)); // تاريخ عشوائي خلال الأسبوع
            
            matches.push({
                team1: team1,
                team2: team2,
                date: matchDate,
                score1: null,
                score2: null
            });
        }
    }
    
    matchesCount = matches.length;
    updateMatchesCount();
    displayMatches();
}

// دالة لعرض المباريات
function displayMatches() {
    const matchesList = document.getElementById('matches-list');
    matchesList.innerHTML = '';
    
    matches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        
        const dateStr = match.date.toLocaleDateString('ar-EG', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        matchItem.innerHTML = `
            <div class="match-teams">
                <div>${match.team1} vs ${match.team2}</div>
                <div class="match-date">${dateStr}</div>
            </div>
            <div class="match-result">${match.score1 !== null ? `${match.score1} - ${match.score2}` : 'لم تلعب بعد'}</div>
            <div class="match-actions">
                <button class="icon-btn" onclick="addResult('${match.team1}', '${match.team2}')" title="إضافة النتيجة">
                    <i class="fas fa-futbol"></i>
                </button>
            </div>
        `;
        
        matchesList.appendChild(matchItem);
    });
}

// دالة لتحديث عداد المباريات
function updateMatchesCount() {
    document.getElementById('matches-count').textContent = matchesCount;
}

// دالة لإضافة نتيجة مباراة
function addResult(team1, team2) {
    const match = matches.find(m => m.team1 === team1 && m.team2 === team2);
    
    if (match) {
        // إنشاء نتيجة عشوائية
        match.score1 = Math.floor(Math.random() * 5);
        match.score2 = Math.floor(Math.random() * 5);
        
        // تحديث جدول الترتيب
        updateStandings(match.team1, match.team2, match.score1, match.score2);
        
        // إعادة عرض المباريات
        displayMatches();
        
        alert(`تم إضافة نتيجة المباراة: ${match.team1} ${match.score1} - ${match.score2} ${match.team2}`);
    }
}

// دالة لتحديث جدول الترتيب بناءً على النتيجة
function updateStandings(team1, team2, score1, score2) {
    const team1Data = standings.find(t => t.team === team1);
    const team2Data = standings.find(t => t.team === team2);
    
    if (team1Data && team2Data) {
        // تحديث عدد المباريات
        team1Data.played++;
        team2Data.played++;
        
        // تحديث الأهداف
        team1Data.goalsFor += score1;
        team1Data.goalsAgainst += score2;
        team2Data.goalsFor += score2;
        team2Data.goalsAgainst += score1;
        
        // تحديد النتيجة وتحديث النقاط
        if (score1 > score2) {
            team1Data.won++;
            team2Data.lost++;
            team1Data.points += 3;
        } else if (score1 < score2) {
            team1Data.lost++;
            team2Data.won++;
            team2Data.points += 3;
        } else {
            team1Data.drawn++;
            team2Data.drawn++;
            team1Data.points += 1;
            team2Data.points += 1;
        }
        
        // إعادة ترتيب وعرض الجدول
        populateStandings();
    }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    populateStandings();
    generateRandomMatches();
    
    // إضافة event listener لزر التوليد
    document.getElementById('generate-btn').addEventListener('click', generateRandomMatches);
});
