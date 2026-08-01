(() => {
  const config = window.STYLIST_AI_SITE || {};
  const project = config.project || {};

  const byId = (id) => document.getElementById(id);
  const setText = (id, text) => { const el = byId(id); if (el && text) el.textContent = text; };
  setText("projectSummary", project.summary);
  setText("courseText", project.course);
  setText("periodText", project.period);
  setText("footerPeriod", project.period);
  setText("institutionText", project.institution);
  setText("departmentText", project.department);
  setText("year", new Date().getFullYear());

  const teamGrid = byId("teamGrid");
  (config.team || []).forEach((member) => {
    const article = document.createElement("article");
    article.className = "team-card reveal";
    const avatar = member.photo
      ? `<div class="team-avatar"><img src="${member.photo}" alt="${member.name} fotoğrafı" loading="lazy"></div>`
      : `<div class="team-avatar" aria-label="${member.name} için fotoğraf yer tutucusu">${member.initials}</div>`;
    const linkedin = member.linkedin
      ? `<a class="team-link" href="${member.linkedin}" target="_blank" rel="noreferrer">LinkedIn ↗</a>`
      : `<span class="team-link" aria-label="LinkedIn bağlantısı henüz eklenmedi">LinkedIn eklenecek</span>`;
    article.innerHTML = `${avatar}<h3>${member.name}</h3><p>${member.bio}</p>${linkedin}`;
    teamGrid?.appendChild(article);
  });

  if (project.advisor) {
    setText("advisorName", project.advisor);
    setText("advisorNote", `${project.institution} · ${project.department}`);
  }

  const emailButton = byId("emailButton");
  if (project.contactEmail && emailButton) {
    emailButton.href = `mailto:${project.contactEmail}`;
    emailButton.textContent = project.contactEmail;
    emailButton.classList.remove("disabled");
    emailButton.removeAttribute("aria-disabled");
    setText("contactText", "Proje hakkında sorularınız ve iş birliği önerileriniz için takımımıza ulaşabilirsiniz.");
  } else {
    emailButton?.addEventListener("click", (event) => event.preventDefault());
  }

  const githubButton = byId("githubButton");
  if (project.githubUrl && githubButton) {
    githubButton.href = project.githubUrl;
    githubButton.classList.remove("hidden");
  }

  const menuButton = document.querySelector(".menu-button");
  const nav = byId("main-nav");
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    nav?.classList.toggle("open", !open);
  });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
  }));

  const mockupImage = byId("mockupImage");
  const mockupTitle = byId("mockupTitle");
  const mockupDescription = byId("mockupDescription");
  document.querySelectorAll(".mockup-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".mockup-tab").forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      const image = tab.dataset.image;
      const title = tab.dataset.title || "Uygulama ekranı";
      if (mockupImage && image) {
        mockupImage.style.opacity = "0";
        window.setTimeout(() => {
          mockupImage.src = `assets/mockups/${image}.webp`;
          mockupImage.alt = `Stylist AI ${title.toLocaleLowerCase("tr-TR")} ekran taslağı`;
          mockupImage.style.opacity = "1";
        }, 130);
      }
      if (mockupTitle) mockupTitle.textContent = title;
      if (mockupDescription) mockupDescription.textContent = tab.dataset.description || "";
    });
  });
  if (mockupImage) mockupImage.style.transition = "opacity .18s ease";

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .12 })
    : null;
  document.querySelectorAll(".reveal").forEach((el) => revealObserver ? revealObserver.observe(el) : el.classList.add("visible"));
})();
