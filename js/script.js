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

// Fetch data from Google Sheets and populate the lists
async function fetchData(sheetId, elementId) {
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const query = encodeURIComponent('Select *');
    const response = await fetch(`${base}&tq=${query}`);
    const text = await response.text();
    const jsonData = JSON.parse(text.substring(47).slice(0, -2));
    const rows = jsonData.table.rows;
    const listElement = document.getElementById(elementId);

    rows.forEach(row => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${row.c[0].v}</h3>
            <p>${row.c[1].v}</p>
        `;
        listElement.appendChild(card);
    });
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
    fetchData('YOUR_TEAM_SHEET_ID', 'teams-list');
    fetchData('YOUR_TOURNAMENT_SHEET_ID', 'tournaments-list');
    fetchData('YOUR_LEAGUE_SHEET_ID', 'leagues-list');
    fetchData('YOUR_NEWS_SHEET_ID', 'news-list');
});
