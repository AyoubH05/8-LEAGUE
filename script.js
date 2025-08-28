const teams = [
    "تشيلسي", "أرسنال", "مانشستر سيتي", "ليفربول", 
    "توتنهام", "أستون فيلا", "مانشستر يونايتد", "نيوكاسل"
];

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

let matches = [];
let matchesCount = 0;

function populateStandings() {
    const standingsBody = document.getElementById('standings-body');
    standingsBody.innerHTML = '';

    const sortedStandings = [...standings].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const diffA = a.goalsFor - a.goalsAgainst;
        const diffB = b.goalsFor - b.goalsAgainst;
        if (diffB !== diffA) return diffB - diffA;
        return b.goalsFor - a.goalsFor;
    });

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

function generateRandomMatches() {
    matches = [];
    const availableTeams = [...teams];
    for (let i = availableTeams.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableTeams[i], availableTeams[j]] = [availableTeams[j], availableTeams[i]];
    }

    for (let i = 0; i < availableTeams.length; i += 2) {
        const team1 = availableTeams[i];
        const team2 = availableTeams[i + 1];
        if (team1 && team2 && team1 !== team2) {
            const matchDate = new Date();
            matchDate.setDate(matchDate.getDate() + matches.length * 7);
            matches.push({ team1, team2, date: matchDate, score1: null, score2: null });
        }
    }

    matchesCount = matches.length;
    updateMatchesCount();
    displayMatches();
    updateRound();
}

function displayMatches() {
    const matchesList = document.getElementById('matches-list');
    matchesList.innerHTML = '';

    matches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';

        const dateStr = match.date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

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

function updateMatchesCount() {
    document.getElementById('matches-count').textContent = matches.filter(m => m.score1 === null).length;
}

function addResult(team1, team2) {
    const match = matches.find(m => m.team1 === team1 && m.team2 === team2);
    if (!match) return;

    const score1 = prompt(`أدخل أهداف ${team1}:`, match.score1 ?? 0);
    const score2 = prompt(`أدخل أهداف ${team2}:`, match.score2 ?? 0);

    match.score1 = parseInt(score1);
    match.score2 = parseInt(score2);

    updateStandings(match.team1, match.team2, match.score1, match.score2);
    displayMatches();
    updateMatchesCount();
    updateRound();
}

function updateStandings(team1, team2, score1, score2) {
    const t1 = standings.find(t => t.team === team1);
    const t2 = standings.find(t => t.team === team2);

    if (!t1 || !t2) return;

    t1.played++; t2.played++;
    t1.goalsFor += score1; t1.goalsAgainst += score2;
    t2.goalsFor += score2; t2.goalsAgainst += score1;

    if (score1 > score2) { t1.won++; t2.lost++; t1.points += 3; }
    else if (score1 < score2) { t2.won++; t1.lost++; t2.points += 3; }
    else { t1.drawn++; t2.drawn++; t1.points++; t2.points++; }

    populateStandings();
}

function updateRound() {
    const playedMatches = matches.filter(m => m.score1 !== null).length;
    document.getElementById('current-round').textContent = Math.ceil((playedMatches / 4) + 1);
}

document.addEventListener('DOMContentLoaded', function() {
    populateStandings();
    generateRandomMatches();

    document.getElementById('generate-btn').addEventListener('click', generateRandomMatches);
    document.getElementById('simulate-btn').addEventListener('click', () => {
        matches.forEach(match => {
            if(match.score1 === null) {
                match.score1 = Math.floor(Math.random() * 5);
                match.score2 = Math.floor(Math.random() * 5);
                updateStandings(match.team1, match.team2, match.score1, match.score2);
            }
        });
        displayMatches();
        updateMatchesCount();
        updateRound();
    });
});
