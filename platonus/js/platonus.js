(function () {
  const avatarUrl = "assets/user-avatar.png";

  function initUserDropdown() {
    const wrap = document.querySelector(".user-avatar-wrap");
    const dropdown = document.querySelector(".user-dropdown");
    if (!wrap || !dropdown) return;

    wrap.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
    });

    dropdown.addEventListener("click", (e) => e.stopPropagation());

    wrap.querySelectorAll("img[data-avatar]").forEach((img) => {
      img.src = avatarUrl;
    });
  }

  function initFlyoutMenu() {
    const trigger = document.getElementById("sidebarDashboard");
    const flyout = document.getElementById("flyoutMenu");
    const overlay = document.getElementById("flyoutOverlay");
    const closeBtn = document.getElementById("flyoutClose");

    if (!trigger || !flyout) return;

    function open() {
      flyout.classList.add("open");
      overlay?.classList.add("open");
      trigger.classList.add("active");
    }

    function close() {
      flyout.classList.remove("open");
      overlay?.classList.remove("open");
      trigger.classList.remove("active");
    }

    trigger.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);
    overlay?.addEventListener("click", close);

    document.querySelectorAll(".flyout-menu__list a:not([href])").forEach((a) => {
      a.addEventListener("click", (e) => e.preventDefault());
    });
  }

  function initBannerClose() {
    const banner = document.getElementById("appBanner");
    const closeBtn = document.getElementById("bannerClose");
    closeBtn?.addEventListener("click", () => banner?.classList.add("hidden"));
  }

  function setAvatars() {
    document.querySelectorAll("img[data-avatar]").forEach((el) => {
      el.src = avatarUrl;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setAvatars();
    initUserDropdown();
    initFlyoutMenu();
    initBannerClose();

    if (document.getElementById("journalTableRoot") && window.PlatonusJournal) {
      PlatonusJournal.renderJournalTable(document.getElementById("journalTableRoot"));
    }
  });
})();
