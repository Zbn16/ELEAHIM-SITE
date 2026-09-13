const gameCircles = document.querySelector("#game-circles");
const gameSearch = document.querySelector("#game-search");
const playPanel = document.querySelector("#play-panel");
const gameFrame = document.querySelector("#game-frame");
const playingTitle = document.querySelector("#playing-title");
const newTabButton = document.querySelector("#new-tab");
const fullScreenButton = document.querySelector("#full-screen");
const closeButton = document.querySelector("#close-game");

function closeGame() {
    playPanel.hidden = true;
    gameFrame.src = "about:blank";
}

async function openGame(button) {
    const gameUrl = button.dataset.url;

    playingTitle.textContent = button.dataset.name;
    playPanel.hidden = false;
    gameFrame.src = "about:blank";
    newTabButton.disabled = true;

    try {
        let playableHtml;

        if (button.dataset.type === "flash") {
            playableHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><script src="https://unpkg.com/@ruffle-rs/ruffle"></script></head><body style="margin:0;background:#111;display:grid;place-items:center;min-height:100vh"><object data="${gameUrl}" type="application/x-shockwave-flash" width="100%" height="100%"></object></body></html>`;
        } else {
            const assetBase = `${gameUrl.slice(0, gameUrl.lastIndexOf("/"))}/`;
            const response = await fetch(gameUrl);
            if (!response.ok) {
                throw new Error(`Game returned ${response.status}`);
            }

            const html = await response.text();
            const baseTag = `<base href="${assetBase}">`;
            playableHtml = html.replace(/<head(\s[^>]*)?>/i, (head) => `${head}${baseTag}`);
        }

        const gameBlob = URL.createObjectURL(new Blob([playableHtml], { type: "text/html" }));

        gameFrame.src = gameBlob;
        newTabButton.disabled = false;
        newTabButton.onclick = () => window.open(gameBlob, "_blank", "noopener,noreferrer");
    } catch (error) {
        playingTitle.textContent = `${button.dataset.name} could not load`;
        console.error(error);
    }

    fullScreenButton.onclick = () => {
        if (gameFrame.requestFullscreen) {
            gameFrame.requestFullscreen();
        }
    };
}

function displayName(folderName) {
    const finalFolder = folderName.split("/").pop();
    return finalFolder
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function addGame(folderName, type = "html") {
    const button = document.createElement("button");
    const name = displayName(folderName.replace(/\.swf$/i, ""));
    const path = folderName.split("/").map(encodeURIComponent).join("/");

    button.className = "game-circle";
    button.type = "button";
    button.dataset.name = name;
    button.dataset.type = type;
    button.dataset.url = `https://raw.githubusercontent.com/Zbn16/games/main/${path}${type === "html" ? "/index.html" : ""}`;
    const title = document.createElement("span");
    title.textContent = name;
    button.append(title);
    button.addEventListener("click", () => openGame(button));
    gameCircles.append(button);
}

async function loadGames() {
    try {
        const response = await fetch("https://api.github.com/repos/Zbn16/games/git/trees/main?recursive=1");
        if (!response.ok) {
            throw new Error(`GitHub returned ${response.status}`);
        }

        const tree = await response.json();
        const htmlGames = tree.tree
            .filter((entry) => entry.type === "blob" && /^(.+)\/index\.html$/i.test(entry.path))
            .filter((entry) => !entry.path.toLowerCase().startsWith("legacyflashgames/"))
            .map((entry) => entry.path.replace(/\/index\.html$/i, ""))
            .filter((folderName, index, allFolders) => allFolders.indexOf(folderName) === index)
            .sort((first, second) => first.localeCompare(second));
        const flashGames = tree.tree
            .filter((entry) => entry.type === "blob" && entry.path.toLowerCase().startsWith("legacyflashgames/") && entry.path.toLowerCase().endsWith(".swf"))
            .map((entry) => entry.path)
            .sort((first, second) => first.localeCompare(second));

        htmlGames.forEach((folderName) => addGame(folderName));
        flashGames.forEach((filePath) => addGame(filePath, "flash"));
        gameSearch.addEventListener("input", () => {
            const query = gameSearch.value.trim().toLowerCase();

            gameCircles.querySelectorAll(".game-circle").forEach((button) => {
                const isMatch = button.dataset.name.toLowerCase().includes(query);
                button.hidden = !isMatch;
            });
        });
    } catch (error) {
        console.error(error);
    }
}

loadGames();

closeButton.addEventListener("click", closeGame);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !playPanel.hidden) {
        closeGame();
    }
});
