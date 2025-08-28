// قائمة الفرق
const teams = [
    "تشيلسي", "أرسنال", "مانشستر سيتي", "ليفربول", 
    "توتنهام", "أستون فيلا", "مانشستر يونايتد", "نيوكاسل"
];

// بيانات الترتيب الأولية
let standings = [
    { team: "تشيلسي", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: "أرسنال", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: "مانشستر سيتي", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: "ليفربول", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: "توتنهام", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: "أستون فيلا", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: "مانشستر يونايتد", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: "نيوكاسل", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }
];

// مصفوفة لتخزين المباريات
let matches = [];
let matchesCount = 0;
let currentMatchIndex = null;

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    populateStandings();
    displayMatches();
    updateStatistics();
    
    // إضافة event listener لزر التوليد
    document.getElementById('generate-btn').addEventListener('click', generateRandomMatches);
    
    // إضافة event listener لنافذة النتائج
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('submit-result').addEventListener('click', submitResult);
    
    // أزرار أخرى
    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('reset-btn').addEventListener('click', resetData);
    
    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('result-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
});

// دالة لتحميل البيانات من localStorage
function loadData() {
    const savedStandings = localStorage.getItem('standings');
    const savedMatches = localStorage.getItem('matches');
    
    if (savedStandings) {
        standings = JSON.parse(savedStandings);
    }
    
    if (savedMatches) {
        matches = JSON.parse(savedMatches);
        matchesCount = matches.length;
        updateMatchesCount();
    }
}

// دالة لحفظ البيانات في localStorage
function saveData() {
    localStorage.setItem('standings', JSON.stringify(standings));
    localStorage.setItem('matches', JSON.stringify(matches));
}

// دالة لملء جدول الترتيب
function populateStandings() {
    const standingsBody = document.getElementById('standings-body');
    standingsBody.innerHTML = '';
    
    // ترتيب الفرق حسب النقاط
    const sortedStandings = [...standings].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
    });
    
    sortedStandings.forEach((teamData, index) => {
        const row = document.createElement('tr');
        const goalDifference = teamData.goalsFor - teamData.goalsAgainst;
        const goalDiffSign = goalDifference > 0 ? '+' : '';
        
        row.innerHTML = `
            <td class="pos">${index + 1}</td>
            <td>${teamData.team}</td>
            <td>${teamData.played}</td>
            <td>${teamData.won}</td>
            <td>${teamData.drawn}</td>
            <td>${teamData.lost}</td>
            <td>${teamData.goalsFor}</td>
            <td>${teamData.goalsAgainst}</td>
            <td>${goalDiffSign}${goalDifference}</td>
            <td>${teamData.points}</td>
        `;
        
        standingsBody.appendChild(row);
    });
}

// دالة لتوليد مباريات عشوائية
function generateRandomMatches() {
    matches = [];
    
    // إنشاء نسخة من قائمة الفرق لتجنب التكرار
    const availableTeams = [...teams];
    
    // خلط الفرق عشوائيًا
    for (let i = availableTeams.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableTeams[i], availableTeams[j]] = [availableTeams[j], availableTeams[i]];
    }
    
    // إنشاء 4 مباريات (8 فرق مقسمة إلى 4 مباريات)
    for (let i = 0; i < availableTeams.length; i += 2) {
        const team1 = availableTeams[i];
        const team2 = availableTeams[i + 1];
        
        if (team1 && team2 && team1 !== team2) {
            const matchDate = new Date();
            matchDate.setDate(matchDate.getDate() + Math.floor(Math.random() * 7));
            
            matches.push({
                team1: team1,
                team2: team2,
                date: matchDate,
                score1: null,
                score2: null,
                played: false
            });
        }
    }
    
    matchesCount = matches.length;
    updateMatchesCount();
    displayMatches();
    saveData();
    showNotification('تم إنشاء المباريات الجديدة بنجاح');
}

// دالة لعرض المباريات
function displayMatches() {
    const matchesList = document.getElementById('matches-list');
    
    if (matches.length === 0) {
        matchesList.innerHTML = `
            <div class="no-matches">
                <i class="fas fa-futbol" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>لا توجد مباريات، انقر على "توليد مباريات جديدة" لبدء الدوري</p>
            </div>
        `;
        return;
    }
    
    matchesList.innerHTML = '';
    
    matches.forEach((match, index) => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        
        const dateStr = match.date.toLocaleDateString('ar-EG', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        
        const result = match.played ? 
            `${match.score1} - ${match.score2}` : 
            'لم تلعب بعد';
        
        matchItem.innerHTML = `
            <div class="match-teams">
                <div>${match.team1} vs ${match.team2}</div>
                <div class="match-date">${dateStr}</div>
            </div>
            <div class="match-result">${result}</div>
            <div class="match-actions">
                ${!match.played ? `
                    <button class="icon-btn" onclick="openResultModal(${index})">
                        <i class="fas fa-futbol"></i>
                        إضافة النتيجة
                    </button>
                ` : `
                    <button class="icon-btn" onclick="openResultModal(${index})">
                        <i class="fas fa-edit"></i>
                        تعديل النتيجة
                    </button>
                `}
            </div>
        `;
        
        matchesList.appendChild(matchItem);
    });
}

// دالة لتحديث عداد المباريات
function updateMatchesCount() {
    document.getElementById('matches-count').textContent = matchesCount;
}

// دالة لفتح نافذة إدخال النتائج
function openResultModal(index) {
    currentMatchIndex = index;
    const match = matches[index];
    document.getElementById('match-teams').textContent = `${match.team1} vs ${match.team2}`;
    
    if (match.played) {
        document.getElementById('score1-input').value = match.score1;
        document.getElementById('score2-input').value = match.score2;
    } else {
        document.getElementById('score1-input').value = '';
        document.getElementById('score2-input').value = '';
    }
    
    document.getElementById('result-modal').style.display = 'flex';
}

// دالة لإغلاق نافذة النتائج
function closeModal() {
    document.getElementById('result-modal').style.display = 'none';
}

// دالة لإرسال النتيجة
function submitResult() {
    const score1 = parseInt(document.getElementById('score1-input').value);
    const score2 = parseInt(document.getElementById('score2-input').value);
    
    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
        showNotification('الرجاء إدخال نتائج صحيحة', true);
        return;
    }
    
    const match = matches[currentMatchIndex];
    const wasPlayed = match.played;
    
    // إذا كانت المباراة لعبت من قبل، نرجع النتائج القديمة
    if (wasPlayed) {
        revertStandings(match.team1, match.team2, match.score1, match.score2);
    }
    
    // تحديث نتيجة المباراة
    match.score1 = score1;
    match.score2 = score2;
    match.played = true;
    
    // تحديث الترتيب
    updateStandings(match.team1, match.team2, score1, score2);
    
    // إعادة عرض المباريات والترتيب
    displayMatches();
    populateStandings();
    updateStatistics();
    saveData();
    closeModal();
    
    showNotification(wasPlayed ? 'تم تعديل نتيجة المباراة بنجاح' : 'تم إضافة نتيجة المباراة بنجاح');
}

// دالة لترجيع النتائج القديمة من الترتيب
function revertStandings(team1, team2, score1, score2) {
    const team1Data = standings.find(t => t.team === team1);
    const team2Data = standings.find(t => t.team === team2);
    
    if (team1Data && team2Data) {
        // ترجيع عدد المباريات
        team1Data.played--;
        team2Data.played--;
        
        // ترجيع الأهداف
        team1Data.goalsFor -= score1;
        team1Data.goalsAgainst -= score2;
        team2Data.goalsFor -= score2;
        team2Data.goalsAgainst -= score1;
        
        // ترجيع النقاط والنتائج
        if (score1 > score2) {
            team1Data.won--;
            team2Data.lost--;
            team1Data.points -= 3;
        } else if (score1 < score2) {
            team1Data.lost--;
            team2Data.won--;
            team2Data.points -= 3;
        } else {
            team1Data.drawn--;
            team2Data.drawn--;
            team1Data.points -= 1;
            team2Data.points -= 1;
        }
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
    }
}

// دالة لتحديث الإحصائيات
function updateStatistics() {
    const statsContainer = document.getElementById('stats-container');
    
    if (standings.length === 0) {
        statsContainer.innerHTML = '<p>لا توجد إحصائيات متاحة</p>';
        return;
    }
    
    // حساب الإحصائيات
    const totalMatches = standings.reduce((sum, team) => sum + team.played, 0) / 2;
    const totalGoals = standings.reduce((sum, team) => sum + team.goalsFor, 0);
    const avgGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : 0;
    
    // العثور على الفريق الأفضل هجومياً ودفاعياً
    const bestAttack = [...standings].sort((a, b) => b.goalsFor - a.goalsFor)[0];
    const bestDefense = [...standings].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">عدد المباريات</div>
            <div class="stat-value">${totalMatches}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">متوسط الأهداف</div>
            <div class="stat-value">${avgGoals}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">أفضل هجوم</div>
            <div class="stat-value">${bestAttack ? bestAttack.team : '-'}</div>
            <div class="stat-label">${bestAttack ? bestAttack.goalsFor : 0} هدف</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">أفضل دفاع</div>
            <div class="stat-value">${bestDefense ? bestDefense.team : '-'}</div>
            <div class="stat-label">${bestDefense ? bestDefense.goalsAgainst : 0} هدف</div>
        </div>
    `;
}

// دالة لعرض الإشعارات
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = message;
    
    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// دالة لتصدير البيانات
function exportData() {
    const dataStr = JSON.stringify({
        standings: standings,
        matches: matches
    }, null, 2);
    
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'دوري-الكتروني-بيانات.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('تم تصدير البيانات بنجاح');
}

// دالة مسح كل البيانات
function resetData() {
    if (confirm('هل أنت متأكد من أنك تريد مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
        localStorage.removeItem('standings');
        localStorage.removeItem('matches');
        
        // إعادة تعيين البيانات
        standings = standings.map(team => ({
            ...team,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0
        }));
        
        matches = [];
        matchesCount = 0;
        
        updateMatchesCount();
        populateStandings();
        displayMatches();
        updateStatistics();
        
        showNotification('تم مسح جميع البيانات بنجاح');
    }
}
