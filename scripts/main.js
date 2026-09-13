const modal = document.querySelector("#game-modal");
const frame = document.querySelector("#game-frame");
const modalTitle = document.querySelector("#game-modal-title");
const closeButton = document.querySelector("#close-game");
const openButton = document.querySelector("#open-game");
const fullscreenButton = document.querySelector("#fullscreen-game");

function closeGame() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    frame.src = "about:blank";
}

document.querySelectorAll(".game-launcher").forEach((launcher) => {
    launcher.addEventListener("click", () => {
        const gameUrl = launcher.dataset.gameUrl;
        modalTitle.textContent = launcher.dataset.gameName;
        frame.src = gameUrl;
        openButton.onclick = () => window.open(gameUrl, "_blank", "noopener,noreferrer");
        fullscreenButton.onclick = () => {
            if (frame.requestFullscreen) {
                frame.requestFullscreen();
            }
        };
        modal.hidden = false;
        document.body.classList.add("modal-open");
        closeButton.focus();
    });
});

closeButton.addEventListener("click", closeGame);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeGame();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
        closeGame();
    }
});