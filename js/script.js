// Toggle menu visibility
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('hidden');
}

// Function to load welcome text with animation
const welcomeTextElement = document.getElementById('welcome-text');
if (welcomeTextElement) {
    const texts = ["Hello, Welcome to FCL.ORG", "مرحبًا، مرحبًا بكم في FCL.ORG"];
    let index = 0;
    setInterval(() => {
        welcomeTextElement.innerText = texts[index];
        index = (index + 1) % texts.length;
    }, 3000);
}

// Fetch data from Google Sheets
async function fetchData(sheetId, query) {
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const response = await fetch(`${base}&tq=${query}`);
    const text = await response.text();
    const jsonData = JSON.parse(text.substring(47).slice(0, -2));
    return jsonData.table.rows;
}

async function initialize() {
    const teamsSheetId = '2PACX-1vTljrUytTLqraazPmrhWPhHXa0GIGyC540ED9UZfdaHMtUxvqAisptUUHOBDBSi-nhpfAo1sLgURDEd';
    const ovrSheetId = 'YOUR_OVR_SHEET_ID';
    const tournamentsSheetId = 'YOUR_TOURNAMENT_SHEET_ID';
    const leaguesSheetId = 'YOUR_LEAGUE_SHEET_ID';
    const newsSheetId = 'YOUR_NEWS_SHEET_ID';

    const teamsQuery = encodeURIComponent('Select *');
    const ovrQuery = encodeURIComponent('Select *');
    const tournamentsQuery = encodeURIComponent('Select *');
    const leaguesQuery = encodeURIComponent('Select *');
    const newsQuery = encodeURIComponent('Select *');

    const teamsData = await fetchData(teamsSheetId, teamsQuery);
    const ovrData = await fetchData(ovrSheetId, ovrQuery);
    const tournamentsData = await fetchData(tournamentsSheetId, tournamentsQuery);
    const leaguesData = await fetchData(leaguesSheetId, leaguesQuery);
    const newsData = await fetchData(newsSheetId, newsQuery);

    const playerOvrMap = {};

    ovrData.forEach(row => {
        const playerName = row.c[0].v;
        const playerOvr = row.c[1].v;
        playerOvrMap[playerName] = playerOvr;
    });

    const teamsList = document.getElementById('teams-list');
    const tournamentsList = document.getElementById('tournaments-list');
    const leaguesList = document.getElementById('leagues-list');
    const newsList = document.getElementById('news-list');
    const teams = {};

    teamsData.forEach(row => {
        const teamName = row.c[0].v;
        const playerName = row.c[1].v;
        const playerImage = row.c[2].v;
        const transferListed = row.c[3].v;
        const playerOvr = playerOvrMap[playerName] || 'N/A';

        if (!teams[teamName]) {
            teams[teamName] = [];
        }

        teams[teamName].push({ name: playerName, image: playerImage, ovr: playerOvr, transferListed });
    });

    for (const teamName in teams) {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `<h3>${teamName}</h3>`;

        teams[teamName].forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.innerHTML = `
                <img src="${player.image}" alt="${player.name}">
                <p>${player.name}</p>
                <p>OVR: ${player.ovr}</p>
            `;
            teamCard.appendChild(playerCard);
        });

        if (teamsList) {
            teamsList.appendChild(teamCard);
        }
    }

    tournamentsData.forEach(row => {
        const tournamentCard = document.createElement('div');
        tournamentCard.className = 'tournament-card';
        tournamentCard.innerHTML = `<h3>${row.c[0].v}</h3><p>${row.c[1].v}</p>`;
        if (tournamentsList) {
            tournamentsList.appendChild(tournamentCard);
        }
    });

    leaguesData.forEach(row => {
        const leagueCard = document.createElement('div');
        leagueCard.className = 'league-card';
        leagueCard.innerHTML = `<h3>${row.c[0].v}</h3><p>${row.c[1].v}</p>`;
        if (leaguesList) {
            leaguesList.appendChild(leagueCard);
        }
    });

    newsData.forEach(row => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `<h3>${row.c[0].v}</h3><p>${row.c[1].v}</p>`;
        if (newsList) {
            newsList.appendChild(newsCard);
        }
    });
}

// Initialize the script when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initialize);
