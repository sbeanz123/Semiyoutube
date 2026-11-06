/* ========================= ELEMENTS ========================= */

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

const videoCards = document.querySelectorAll(".video-card");
const categoryButtons = document.querySelectorAll(".categories button");
const emptyMsg = document.getElementById("emptyMsg");

const profileBtn = document.querySelector(".profile-btn");
const notificationBtn = document.querySelector(".notification-btn");

const sideItems = document.querySelectorAll(".side-item");

/* ========================= SIDEBAR (show / hide) ========================= */

function setSidebarHidden(hidden) {
    document.body.classList.toggle("sidebar-hidden", hidden);

    if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", String(!hidden));
    }

    try {
        localStorage.setItem("sidebarHidden", hidden ? "1" : "0");
    } catch (err) {
        /* storage not available, ignore */
    }
}

if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
        setSidebarHidden(!document.body.classList.contains("sidebar-hidden"));
    });

    // remember the last state
    try {
        if (localStorage.getItem("sidebarHidden") === "1") {
            setSidebarHidden(true);
        }
    } catch (err) {
        /* storage not available, ignore */
    }
}

/* ========================= FILTERING (search + category) ========================= */

let selectedCategory = "all";

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    videoCards.forEach(card => {
        const title = card.querySelector(".video-info h3").textContent.toLowerCase();
        const channel = card.querySelector(".video-info p").textContent.toLowerCase();
        const categories = (card.dataset.category || "").toLowerCase().split(/\s+/);

        const matchesCategory = selectedCategory === "all" || categories.includes(selectedCategory);
        const matchesSearch = query === "" || title.includes(query) || channel.includes(query);

        const show = matchesCategory && matchesSearch;
        card.style.display = show ? "" : "none";

        if (show) visibleCount++;
    });

    if (emptyMsg) {
        emptyMsg.hidden = visibleCount > 0;
    }
}

function setActiveCategory(name) {
    selectedCategory = name;

    categoryButtons.forEach(btn => {
        btn.classList.toggle("active", btn.textContent.trim().toLowerCase() === name);
    });
}

/* ========================= SEARCH ========================= */

if (searchForm) {
    searchForm.addEventListener("submit", e => {
        e.preventDefault();
        setActiveCategory("all");
        applyFilters();
    });
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        setActiveCategory("all");
        applyFilters();
    });
}

/* ========================= CATEGORY ========================= */

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        searchInput.value = "";
        setActiveCategory(button.textContent.trim().toLowerCase());
        applyFilters();
    });
});

/* ========================= SIDEBAR ACTIVE ========================= */

sideItems.forEach(item => {
    item.addEventListener("click", e => {
        e.preventDefault();

        sideItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
    });
});

/* ========================= SHORTS MENU ========================= */

// the three-dot button sits inside a link, so stop it from navigating
document.querySelectorAll(".short-menu").forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
    });
});

/* ========================= CREATE DROPDOWN ========================= */

const createBtn = document.getElementById("createBtn");
const createMenu = document.getElementById("createMenu");

function setCreateMenu(open) {
    if (!createBtn || !createMenu) return;

    createMenu.classList.toggle("open", open);
    createBtn.setAttribute("aria-expanded", String(open));
}

if (createBtn && createMenu) {
    createBtn.addEventListener("click", e => {
        e.stopPropagation();
        setCreateMenu(!createMenu.classList.contains("open"));
    });

    // close after picking an option
    createMenu.querySelectorAll(".create-item").forEach(item => {
        item.addEventListener("click", () => setCreateMenu(false));
    });

    // close when clicking anywhere else
    document.addEventListener("click", e => {
        if (!createMenu.contains(e.target)) {
            setCreateMenu(false);
        }
    });

    // close with Escape and give focus back to the button
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && createMenu.classList.contains("open")) {
            setCreateMenu(false);
            createBtn.focus();
        }
    });
}

/* ========================= PROFILE ========================= */

if (profileBtn) {
    profileBtn.addEventListener("click", () => {
        alert("Profile Clicked");
    });
}

/* ========================= NOTIFICATIONS ========================= */

if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
        const badge = notificationBtn.querySelector("span");

        if (badge) {
            badge.style.display = "none";
        }

        alert("Notifications Opened");
    });
}

/* ========================= ESC ========================= */

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        searchInput.blur();
    }
});

console.log("YouTube Clone Loaded Successfully ✅");