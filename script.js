(function () {
  "use strict";

  // ==========================================================================
  // 1. STATIC FLASHCARD DECK (FRONTEND FUNDAMENTALS - 12 MEANINGFUL CARDS)
  // ==========================================================================
  const DEFAULT_DECK = [
    {
      id: "card-1",
      topic: "HTML5 & Semantics",
      question:
        "What is the primary architectural purpose of semantic HTML elements like <header>, <main>, and <article>?",
      answer:
        "Semantic elements communicate structural meaning to both browsers and assistive technologies (like screen readers), establishing accessibility landmarks, improving document outline, and aiding search engine indexing without relying solely on generic <div> tags.",
      explanation:
        "Example: Assistive devices let users jump directly to landmark regions such as <main> via keyboard shortcuts.",
    },
    {
      id: "card-2",
      topic: "CSS 3D Transforms",
      question:
        "Which CSS properties are required to enable a true 3D flipping card effect without clipping backface content?",
      answer:
        "The parent stage requires 'perspective: [value]' to establish depth, the flipping element needs 'transform-style: preserve-3d', and card faces need 'backface-visibility: hidden' so the reverse side remains invisible during rotation.",
      explanation:
        "Without 'preserve-3d', transformed child elements are flattened into the 2D plane of their immediate parent.",
    },
    {
      id: "card-3",
      topic: "JavaScript Engine",
      question:
        "What is the difference between synchronous execution and the JavaScript Microtask Queue?",
      answer:
        "Synchronous code runs directly on the Call Stack. When promises resolve (.then / async await) or queueMicrotask runs, their callbacks enter the high-priority Microtask Queue, which executes completely immediately after the current stack frame empties—before Macrotasks (setTimeout) or browser rendering.",
      explanation:
        "Order of execution: Call Stack -> Microtask Queue (Promises) -> Animation Frame Callbacks -> Task Queue (setTimeout).",
    },
    {
      id: "card-4",
      topic: "CSS Layout",
      question:
        "When should you choose CSS Grid over CSS Flexbox in modern responsive design?",
      answer:
        "Choose Flexbox for 1-dimensional content-driven layouts (arranging elements in a single row OR column). Choose CSS Grid for 2-dimensional layout-driven structures where precise alignment across both columns AND rows is required simultaneously.",
      explanation:
        "Rule of thumb: Flexbox is content-first (items push spacing); Grid is container-first (tracks dictate positioning).",
    },
    {
      id: "card-5",
      topic: "Accessibility (a11y)",
      question:
        "Why should interactive controls never communicate state or validation using color alone?",
      answer:
        "Users with color-vision deficiencies (protanopia, deuteranopia, tritanopia) or those using high-contrast/monochrome screens cannot perceive color shifts. States must always be accompanied by secondary non-color indicators such as icons, distinct shapes, text labels, or ARIA attributes.",
      explanation:
        "WCAG 2.2 Success Criterion 1.4.1 (Use of Color) strictly mandates non-color visual differentiators.",
    },
    {
      id: "card-6",
      topic: "DOM & Events",
      question:
        "What is Event Delegation and how does it optimize browser memory?",
      answer:
        "Event Delegation attaches a single event listener to a common ancestor element rather than dozens of listeners to individual child nodes. By leveraging event bubbling (e.target), it minimizes memory overhead and automatically handles dynamically inserted children.",
      explanation:
        "Useful for large grids or lists: 1 listener on the <ul> handles clicks on 1,000 child <li> elements.",
    },
    {
      id: "card-7",
      topic: "Browser Rendering",
      question:
        "What triggers a 'Reflow' (Layout) versus a 'Repaint', and why does it matter for performance?",
      answer:
        "Reflow calculates geometric node coordinates when dimensional properties change (width, height, margin, fontSize). Repaint updates visual pixels (color, background, visibility). Reflows are computationally expensive and should be minimized by animating transforms and opacity instead.",
      explanation:
        "CSS 'transform' and 'opacity' bypass layout and paint recalculations, running entirely on the GPU compositor thread.",
    },
    {
      id: "card-8",
      topic: "Web Storage",
      question:
        "What are the fundamental architectural differences between localStorage, sessionStorage, and Cookies?",
      answer:
        "localStorage persists indefinitely until cleared explicitly; sessionStorage clears immediately upon tab/window closure; Cookies are sent with every HTTP network request, have a 4KB capacity limit, and can be configured with security flags (HttpOnly, Secure, SameSite).",
      explanation:
        "Never store sensitive cryptographic keys or authentication JWTs in localStorage due to Cross-Site Scripting (XSS) risks.",
    },
    {
      id: "card-9",
      topic: "JavaScript Scoping",
      question:
        "What is a Closure in JavaScript and what is a practical everyday use case?",
      answer:
        "A closure is the combination of a function bundled together with references to its surrounding lexical state (lexical environment). Even when executed outside its original scope, the inner function retains access to its parent variables.",
      explanation:
        "Common use cases include data privacy (private state variables), function factories, and memoization caches.",
    },
    {
      id: "card-10",
      topic: "Responsive Design",
      question:
        "What is the CSS clamp() function and how does it enable fluid typography?",
      answer:
        "clamp(min, preferred, max) accepts three parameters to create responsive fluid values without media query steps. For example, 'font-size: clamp(1rem, 2.5vw, 2.5rem)' scales smoothly with the viewport width while preventing text from shrinking below 1rem or growing beyond 2.5rem.",
      explanation:
        "Formula: clamp(minimum_boundary, viewport_relative_scaler, maximum_boundary).",
    },
    {
      id: "card-11",
      topic: "Performance & UX",
      question:
        "What does the 'prefers-reduced-motion' media query accomplish and how should it be respected?",
      answer:
        "It detects if the user has requested the operating system to minimize non-essential motion. To prevent vestibular motion sickness, applications must disable rapid parallax, aggressive 3D rotations, and auto-scrolling when this query matches.",
      explanation:
        "CSS implementation: @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition-duration: 0.01ms !important; } }",
    },
    {
      id: "card-12",
      topic: "REST & Networking",
      question:
        "What is an Idempotent HTTP method and which standard methods qualify?",
      answer:
        "An HTTP method is idempotent if making identical requests multiple times produces the exact same server state as making a single request. GET, HEAD, PUT, and DELETE are idempotent. POST is non-idempotent because repeated submissions can create duplicate records.",
      explanation:
        "Example: Retrying a failed PUT request is safe; retrying a payment POST request might charge a customer twice.",
    },
  ];

  // ==========================================================================
  // 2. APPLICATION STATE
  // ==========================================================================
  const STORAGE_KEY_PROGRESS = "flashcard_studio_ratings_v1";
  const STORAGE_KEY_THEME = "flashcard_studio_theme_v1";

  let deck = [...DEFAULT_DECK]; // Working deck (may be shuffled or review-only)
  let currentIndex = 0;
  let isFlipped = false;
  let isReviewMode = false;
  let isTransitioning = false;
  let ratings = {}; // { [cardId]: "known" | "review" }

  // ==========================================================================
  // 3. DOM ELEMENT REFERENCES
  // ==========================================================================
  const flashcardStage = document.getElementById("flashcard-stage");
  const flashcardInner = document.getElementById("flashcard-inner");
  const cardPositionFront = document.getElementById("card-position-front");
  const cardPositionBack = document.getElementById("card-position-back");
  const cardTopicFront = document.getElementById("card-topic-front");
  const cardTopicBack = document.getElementById("card-topic-back");
  const cardQuestionText = document.getElementById("card-question-text");
  const cardAnswerText = document.getElementById("card-answer-text");
  const cardExplanationText = document.getElementById("card-explanation-text");
  const cardStatusBadgeFront = document.getElementById(
    "card-status-badge-front",
  );
  const cardStatusBadgeBack = document.getElementById("card-status-badge-back");

  // Controls
  const prevCardBtn = document.getElementById("prev-card-btn");
  const nextCardBtn = document.getElementById("next-card-btn");
  const flipCardBtn = document.getElementById("flip-card-btn");
  const flipBtnLabel = document.getElementById("flip-btn-label");
  const flipBackBtn = document.getElementById("flip-back-btn");
  const rateKnownBtn = document.getElementById("rate-known-btn");
  const rateReviewBtn = document.getElementById("rate-review-btn");
  const shuffleDeckBtn = document.getElementById("shuffle-deck-btn");
  const restartDeckBtn = document.getElementById("restart-deck-btn");
  const studyReviewModeBtn = document.getElementById("study-review-mode-btn");
  const exitReviewModeBtn = document.getElementById("exit-review-mode-btn");
  const modeBanner = document.getElementById("mode-banner");
  const modeBannerCount = document.getElementById("mode-banner-count");
  const navReviewCount = document.getElementById("nav-review-count");

  // Metrics & Progress Elements
  const studyProgressBar = document.getElementById("study-progress-bar");
  const studyProgressFill = document.getElementById("study-progress-fill");
  const sessionProgressText = document.getElementById("session-progress-text");
  const statTotalCards = document.getElementById("stat-total-cards");
  const statKnownCards = document.getElementById("stat-known-cards");
  const statKnownPct = document.getElementById("stat-known-pct");
  const statReviewCards = document.getElementById("stat-review-cards");
  const statReviewSubtext = document.getElementById("stat-review-subtext");
  const breakdownRated = document.getElementById("breakdown-rated");
  const breakdownRatedPct = document.getElementById("breakdown-rated-pct");
  const breakdownKnown = document.getElementById("breakdown-known");
  const breakdownReview = document.getElementById("breakdown-review");
  const breakdownUnrated = document.getElementById("breakdown-unrated");
  const navMatrixContainer = document.getElementById("nav-matrix-container");
  const a11yAnnouncer = document.getElementById("a11y-announcer");

  // Modals and Utility
  const completionModal = document.getElementById("completion-modal");
  const modalStatKnown = document.getElementById("modal-stat-known");
  const modalStatReview = document.getElementById("modal-stat-review");
  const modalStudyReviewBtn = document.getElementById("modal-study-review-btn");
  const modalRestartBtn = document.getElementById("modal-restart-btn");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const ctaResetBtn = document.getElementById("cta-reset-btn");

  // Theme & Mobile
  const themeToggle = document.getElementById("theme-toggle");
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");

  // ==========================================================================
  // 4. STORAGE & PERSISTENCE
  // ==========================================================================
  function loadPersistedState() {
    try {
      const savedRatings = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (savedRatings) {
        ratings = JSON.parse(savedRatings) || {};
      }
    } catch (e) {
      console.warn("Storage unavailable or malformed:", e);
      ratings = {};
    }
  }

  function savePersistedState() {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(ratings));
    } catch (e) {
      console.warn("Failed to save to localStorage:", e);
    }
  }

  // ==========================================================================
  // 5. CORE CARD RENDERING & FLIP LOGIC
  // ==========================================================================
  function updateCardStatusBadges(status) {
    const badges = [cardStatusBadgeFront, cardStatusBadgeBack];
    badges.forEach((badge) => {
      if (!badge) return;
      badge.classList.remove("badge-known", "badge-review");
      if (status === "known") {
        badge.textContent = "Mastered";
        badge.classList.add("badge-known");
      } else if (status === "review") {
        badge.textContent = "Review Needed";
        badge.classList.add("badge-review");
      } else {
        badge.textContent = "Unrated";
      }
    });
  }

  function renderCurrentCard(announce = false) {
    if (!deck || deck.length === 0) {
      cardQuestionText.textContent = "No cards available in this study view.";
      cardAnswerText.textContent = "Switch back to the full deck to continue.";
      cardExplanationText.textContent = "";
      cardTopicFront.textContent = "Empty";
      cardTopicBack.textContent = "Empty";
      cardPositionFront.textContent = "0 of 0";
      cardPositionBack.textContent = "0 of 0";
      return;
    }

    // Clamp index safely
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= deck.length) currentIndex = deck.length - 1;

    const card = deck[currentIndex];

    // Reset flip state when loading new card
    isFlipped = false;
    flashcardStage.classList.remove("is-flipped");
    flipBtnLabel.textContent = "Reveal Answer";

    // Render card content using plain text
    cardQuestionText.textContent = card.question;
    cardAnswerText.textContent = card.answer;
    cardExplanationText.textContent =
      card.explanation || "No additional explanation available.";
    cardTopicFront.textContent = card.topic || "General";
    cardTopicBack.textContent = `${card.topic} — Answer`;

    const posText = `Card ${currentIndex + 1} of ${deck.length}`;
    cardPositionFront.textContent = posText;
    cardPositionBack.textContent = posText;

    // Render status badges
    const status = ratings[card.id];
    updateCardStatusBadges(status);

    // Update Nav Matrix
    updateNavMatrixHighlight();

    if (announce && a11yAnnouncer) {
      a11yAnnouncer.textContent = `Showing ${posText}. Question: ${card.question}`;
    }
  }

  function toggleFlip() {
    if (isTransitioning) return;
    isTransitioning = true;
    isFlipped = !isFlipped;

    // Reset tilt taaki flip bilkul clean aur seedha 180 degree ghoome
    resetCardTilt();

    // Actual 3D Flip class toggle
    flashcardStage.classList.toggle("is-flipped", isFlipped);
    flipBtnLabel.textContent = isFlipped ? "Show Question" : "Reveal Answer";

    setTimeout(() => {
      isTransitioning = false;
    }, 650);

    if (a11yAnnouncer) {
      if (isFlipped) {
        a11yAnnouncer.textContent = `Answer revealed: ${deck[currentIndex].answer}`;
      } else {
        a11yAnnouncer.textContent = `Returned to question: ${deck[currentIndex].question}`;
      }
    }
  }

  function trigger3DTransition(animType) {
    const allAnims = [
      "anim-next",
      "anim-prev",
      "anim-shuffle",
      "anim-rate-known",
      "anim-rate-review",
      "anim-jump",
    ];
    flashcardStage.classList.remove(...allAnims);

    void flashcardStage.offsetWidth; // Force reflow
    flashcardStage.classList.add(animType);

    setTimeout(() => {
      flashcardStage.classList.remove(animType);
    }, 500);
  }

  function nextCard() {
    if (isTransitioning) return;
    if (currentIndex < deck.length - 1) {
      trigger3DTransition("anim-next");
      currentIndex++;
      renderCurrentCard(true);
    } else {
      checkDeckCompletion();
    }
  }

  function prevCard() {
    if (isTransitioning) return;
    if (currentIndex > 0) {
      trigger3DTransition("anim-prev");
      currentIndex--;
      renderCurrentCard(true);
    }
  }

  // ==========================================================================
  // 5B. SMOOTH 3D MOUSE PARALLAX (NON-CONFLICTING)
  // ==========================================================================
  let tiltRAF = null;
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;
  let isHoveringCard = false;

  function updateCardTilt() {
    currentRotX += (targetRotX - currentRotX) * 0.12;
    currentRotY += (targetRotY - currentRotY) * 0.12;

    flashcardStage.style.setProperty(
      "--tilt-x",
      `${currentRotX.toFixed(2)}deg`,
    );
    flashcardStage.style.setProperty(
      "--tilt-y",
      `${currentRotY.toFixed(2)}deg`,
    );

    if (
      isHoveringCard ||
      Math.abs(targetRotX - currentRotX) > 0.05 ||
      Math.abs(targetRotY - currentRotY) > 0.05
    ) {
      tiltRAF = requestAnimationFrame(updateCardTilt);
    } else {
      tiltRAF = null;
    }
  }

  function resetCardTilt() {
    targetRotX = 0;
    targetRotY = 0;
    if (!tiltRAF) {
      tiltRAF = requestAnimationFrame(updateCardTilt);
    }
  }

  flashcardStage.addEventListener("mouseenter", () => {
    isHoveringCard = true;
    if (!tiltRAF) tiltRAF = requestAnimationFrame(updateCardTilt);
  });

  flashcardStage.addEventListener("mousemove", (e) => {
    if (isTransitioning) return;
    const rect = flashcardStage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Controlled tilt limits (max 8deg X, 10deg Y) to prevent edge clipping
    targetRotX = -normY * 8;
    targetRotY = normX * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    flashcardStage.querySelectorAll(".card-glare").forEach((glare) => {
      glare.style.setProperty("--glare-x", `${glareX}%`);
      glare.style.setProperty("--glare-y", `${glareY}%`);
    });

    if (!tiltRAF) tiltRAF = requestAnimationFrame(updateCardTilt);
  });

  flashcardStage.addEventListener("mouseleave", () => {
    isHoveringCard = false;
    resetCardTilt();
  });

  // Mobile Touch tilt support
  flashcardStage.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches[0]) {
        const rect = flashcardStage.getBoundingClientRect();
        const t = e.touches[0];
        const x = t.clientX - rect.left;
        const y = t.clientY - rect.top;
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          const normX = (x / rect.width) * 2 - 1;
          const normY = (y / rect.height) * 2 - 1;
          targetRotX = -normY * 8;
          targetRotY = normX * 10;
          if (!tiltRAF) tiltRAF = requestAnimationFrame(updateCardTilt);
        }
      }
    },
    { passive: true },
  );

  flashcardStage.addEventListener("touchend", () => {
    resetCardTilt();
  });

  // ==========================================================================
  // 6. METRICS & PROGRESS TRACKING
  // ==========================================================================
  function rateCurrentCard(rating) {
    if (!deck || deck.length === 0) return;
    const cardId = deck[currentIndex].id;
    ratings[cardId] = rating;
    savePersistedState();
    updateCardStatusBadges(rating);
    updateMetrics();
    updateNavMatrixHighlight();

    // Trigger visual feedback animation based on mastery rating
    trigger3DTransition(
      rating === "known" ? "anim-rate-known" : "anim-rate-review",
    );

    if (a11yAnnouncer) {
      const ratingLabel = rating === "known" ? "Know It" : "Review Again";
      a11yAnnouncer.textContent = `Card marked as ${ratingLabel}.`;
    }

    // Auto-advance to next card if available with smooth transition
    if (currentIndex < deck.length - 1) {
      setTimeout(() => {
        nextCard();
      }, 320);
    } else {
      checkDeckCompletion();
    }
  }

  function updateMetrics() {
    const totalCards = DEFAULT_DECK.length;
    let knownCount = 0;
    let reviewCount = 0;

    DEFAULT_DECK.forEach((card) => {
      if (ratings[card.id] === "known") knownCount++;
      if (ratings[card.id] === "review") reviewCount++;
    });

    const ratedCount = knownCount + reviewCount;
    const unratedCount = totalCards - ratedCount;
    const knownPct = Math.round((knownCount / totalCards) * 100) || 0;
    const completionPct = Math.round((ratedCount / totalCards) * 100) || 0;

    // Overview Section stats
    statTotalCards.textContent = totalCards;
    statKnownCards.textContent = knownCount;
    statKnownPct.textContent = `${knownPct}% of deck mastered`;
    statReviewCards.textContent = reviewCount;
    if (statReviewSubtext) {
      statReviewSubtext.textContent =
        reviewCount === 1
          ? "1 card needs review"
          : `${reviewCount} cards need review`;
    }

    // Progress bar
    studyProgressBar.setAttribute("aria-valuenow", completionPct);
    studyProgressFill.style.width = `${completionPct}%`;
    sessionProgressText.textContent = `${completionPct}% (${ratedCount} of ${totalCards} rated)`;

    // Breakdown section stats
    breakdownRated.textContent = `${ratedCount} / ${totalCards}`;
    breakdownRatedPct.textContent = `${completionPct}% evaluated`;
    breakdownKnown.textContent = knownCount;
    breakdownReview.textContent = reviewCount;
    breakdownUnrated.textContent = unratedCount;

    // Review mode button counters
    navReviewCount.textContent = reviewCount;
    modeBannerCount.textContent = reviewCount;

    // Spaced Repetition (Leitner System) Box Counters
    const box1El = document.getElementById("leitner-box-1-count");
    const box2El = document.getElementById("leitner-box-2-count");
    const box3El = document.getElementById("leitner-box-3-count");

    if (box1El && box2El && box3El) {
      box1El.textContent = `${reviewCount + unratedCount} cards`;
      box2El.textContent = `${Math.ceil(knownCount * 0.4)} cards`;
      box3El.textContent = `${Math.floor(knownCount * 0.6)} cards`;
    }

    if (reviewCount === 0 && isReviewMode) {
      exitReviewMode();
    }
  }

  function checkDeckCompletion() {
    let ratedCount = 0;
    let knownCount = 0;
    let reviewCount = 0;

    DEFAULT_DECK.forEach((card) => {
      if (ratings[card.id] === "known") {
        ratedCount++;
        knownCount++;
      }
      if (ratings[card.id] === "review") {
        ratedCount++;
        reviewCount++;
      }
    });

    // If all cards have been rated, show congratulatory modal
    if (ratedCount === DEFAULT_DECK.length) {
      modalStatKnown.textContent = knownCount;
      modalStatReview.textContent = reviewCount;
      completionModal.classList.add("open");
      modalCloseBtn.focus();
    }
  }

  // ==========================================================================
  // 7. CARD NAVIGATOR GRID
  // ==========================================================================
  function populateNavMatrix() {
    navMatrixContainer.innerHTML = "";

    deck.forEach((card, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-cell-btn";
      btn.setAttribute("data-index", idx);
      btn.setAttribute("aria-label", `Go to card ${idx + 1}: ${card.question}`);

      const status = ratings[card.id];
      if (status === "known") btn.classList.add("known");
      if (status === "review") btn.classList.add("review");
      if (idx === currentIndex) btn.classList.add("current");

      let dotHtml = "";
      if (status === "known")
        dotHtml =
          '<span class="nav-cell-status-dot dot-known" aria-hidden="true"></span>';
      if (status === "review")
        dotHtml =
          '<span class="nav-cell-status-dot dot-review" aria-hidden="true"></span>';

      btn.innerHTML = `<span>${idx + 1}</span>${dotHtml}`;

      btn.addEventListener("click", () => {
        if (currentIndex !== idx) {
          trigger3DTransition("anim-jump");
        }
        currentIndex = idx;
        renderCurrentCard(true);
        const stage = document.getElementById("study-workspace");
        if (stage) stage.scrollIntoView({ behavior: "smooth" });
      });

      navMatrixContainer.appendChild(btn);
    });
  }

  function updateNavMatrixHighlight() {
    const cells = navMatrixContainer.querySelectorAll(".nav-cell-btn");
    cells.forEach((btn, idx) => {
      btn.classList.remove("current", "known", "review");

      if (idx === currentIndex) {
        btn.classList.add("current");
        btn.setAttribute("aria-current", "true");
      } else {
        btn.removeAttribute("aria-current");
      }

      if (deck[idx]) {
        const cardId = deck[idx].id;
        const status = ratings[cardId];
        if (status === "known") btn.classList.add("known");
        if (status === "review") btn.classList.add("review");

        // Refresh status dot
        const existingDot = btn.querySelector(".nav-cell-status-dot");
        if (existingDot) existingDot.remove();

        if (status === "known") {
          btn.insertAdjacentHTML(
            "beforeend",
            '<span class="nav-cell-status-dot dot-known" aria-hidden="true"></span>',
          );
        } else if (status === "review") {
          btn.insertAdjacentHTML(
            "beforeend",
            '<span class="nav-cell-status-dot dot-review" aria-hidden="true"></span>',
          );
        }
      }
    });
  }

  // ==========================================================================
  // 8. DECK MODES (SHUFFLE, REVIEW MODE, RESTART)
  // ==========================================================================
  function shuffleDeck() {
    // Trigger 3D riffle shuffle animation
    trigger3DTransition("anim-shuffle");

    // Fisher-Yates non-destructive shuffle
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    deck = shuffled;
    currentIndex = 0;
    renderCurrentCard(true);
    populateNavMatrix();

    if (a11yAnnouncer) {
      a11yAnnouncer.textContent = "Deck order shuffled successfully.";
    }
  }

  function enterReviewMode() {
    const reviewOnly = DEFAULT_DECK.filter((c) => ratings[c.id] === "review");
    if (reviewOnly.length === 0) {
      alertBox("No cards currently require review. Great job!");
      return;
    }

    isReviewMode = true;
    deck = reviewOnly;
    currentIndex = 0;
    modeBanner.classList.add("active");
    renderCurrentCard(true);
    populateNavMatrix();
    updateMetrics();

    const stage = document.getElementById("study-workspace");
    if (stage) stage.scrollIntoView({ behavior: "smooth" });
  }

  function exitReviewMode() {
    isReviewMode = false;
    deck = [...DEFAULT_DECK];
    currentIndex = 0;
    modeBanner.classList.remove("active");
    renderCurrentCard(true);
    populateNavMatrix();
    updateMetrics();
  }

  function restartSession() {
    if (Object.keys(ratings).length > 0) {
      const confirmed = confirmModal(
        "Restart Study Session?",
        "This will reset all your 'Know It' and 'Review Again' ratings and restore the full deck order.",
      );
      if (!confirmed) return;
    }

    ratings = {};
    savePersistedState();
    exitReviewMode();
    updateMetrics();
    renderCurrentCard(true);
    populateNavMatrix();

    if (a11yAnnouncer) {
      a11yAnnouncer.textContent = "Study session reset. All ratings cleared.";
    }
  }

  // Accessible in-app confirm dialog substitute (avoids alert/confirm)
  function confirmModal(title, msg) {
    // Safe clear for this prototype with accessible notification
    return window.confirm ? window.confirm(`${title}\n\n${msg}`) : true;
  }

  function alertBox(msg) {
    if (a11yAnnouncer) a11yAnnouncer.textContent = msg;
    // Non-blocking banner announcement
    const banner = document.getElementById("mode-banner");
    if (banner) {
      banner.classList.add("active");
      setTimeout(() => {
        if (!isReviewMode) banner.classList.remove("active");
      }, 4000);
    }
  }

  // ==========================================================================
  // 9. EVENT LISTENERS & USER INPUT
  // ==========================================================================

  // Card Click Flip
  flashcardStage.addEventListener("click", (e) => {
    // Prevent flipping if user clicked specific back button
    if (e.target.closest("#flip-back-btn")) return;
    toggleFlip();
  });

  flipBackBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFlip();
  });

  flipCardBtn.addEventListener("click", toggleFlip);
  nextCardBtn.addEventListener("click", nextCard);
  prevCardBtn.addEventListener("click", prevCard);

  rateKnownBtn.addEventListener("click", () => rateCurrentCard("known"));
  rateReviewBtn.addEventListener("click", () => rateCurrentCard("review"));

  shuffleDeckBtn.addEventListener("click", shuffleDeck);
  restartDeckBtn.addEventListener("click", restartSession);
  ctaResetBtn.addEventListener("click", restartSession);

  studyReviewModeBtn.addEventListener("click", enterReviewMode);
  exitReviewModeBtn.addEventListener("click", exitReviewMode);

  // Completion Modal Actions
  modalStudyReviewBtn.addEventListener("click", () => {
    completionModal.classList.remove("open");
    enterReviewMode();
  });
  modalRestartBtn.addEventListener("click", () => {
    completionModal.classList.remove("open");
    restartSession();
  });
  modalCloseBtn.addEventListener("click", () => {
    completionModal.classList.remove("open");
  });

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    // Ignore shortcuts when user is focused inside an input/textarea
    if (
      ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
    ) {
      return;
    }

    // Escape Key: close modals & drawers
    if (e.key === "Escape") {
      if (completionModal.classList.contains("open")) {
        completionModal.classList.remove("open");
        flashcardStage.focus();
      }
      if (mobileDrawer.classList.contains("open")) {
        mobileDrawer.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.focus();
      }
      return;
    }

    // Left Arrow: Previous Card
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevCard();
      return;
    }

    // Right Arrow: Next Card
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextCard();
      return;
    }

    // Space or Enter on the card or generally: Flip Card
    if (e.key === " " || e.key === "Enter") {
      // If a button is focused, allow standard button click
      if (document.activeElement.tagName === "BUTTON") return;
      e.preventDefault();
      toggleFlip();
      return;
    }

    // 'K' key: Rate Known
    if (e.key === "k" || e.key === "K") {
      e.preventDefault();
      rateCurrentCard("known");
      return;
    }

    // 'R' key: Rate Review
    if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      rateCurrentCard("review");
      return;
    }
  });

  // Accordion Interactions (FAQ)
  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      const targetId = trigger.getAttribute("aria-controls");
      const panel = document.getElementById(targetId);

      trigger.setAttribute("aria-expanded", !isExpanded);
      if (panel) {
        if (isExpanded) {
          panel.setAttribute("hidden", "");
        } else {
          panel.removeAttribute("hidden");
        }
      }
    });
  });

  // Mobile Menu Drawer
  mobileToggle.addEventListener("click", () => {
    const isExp = mobileToggle.getAttribute("aria-expanded") === "true";
    mobileToggle.setAttribute("aria-expanded", !isExp);
    mobileDrawer.classList.toggle("open");
  });

  mobileDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileDrawer.classList.remove("open");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Theme Management
  function initTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
      } else if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch (e) {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, next);
    } catch (e) {
      console.warn("Storage failed:", e);
    }
  }

  themeToggle.addEventListener("click", toggleTheme);
  initTheme();

  // Dynamic Year
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ==========================================================================
  // 9B. SMART NAVBAR HIDE ON SCROLL DOWN / SHOW ON SCROLL UP
  // ==========================================================================
  const siteHeader = document.getElementById("site-header");
  let lastScrollY =
    window.pageYOffset || document.documentElement.scrollTop || 0;
  let scrollThreshold = 10;

  function handleNavbarScroll(currentScrollY) {
    if (!siteHeader) return;

    // Visual shadow and blur when scrolled past top
    if (currentScrollY > 20) {
      siteHeader.classList.add("nav-scrolled");
    } else {
      siteHeader.classList.remove("nav-scrolled");
    }

    // Always show near the very top of page
    if (currentScrollY <= 80) {
      siteHeader.classList.remove("nav-hidden");
      lastScrollY = currentScrollY;
      return;
    }

    // Check scroll direction delta
    const delta = currentScrollY - lastScrollY;

    if (Math.abs(delta) > scrollThreshold) {
      if (delta > 0 && currentScrollY > 120) {
        // Scrolling down -> hide navbar
        siteHeader.classList.add("nav-hidden");
      } else if (delta < 0) {
        // Scrolling up -> reveal navbar
        siteHeader.classList.remove("nav-hidden");
      }
      lastScrollY = currentScrollY;
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      const currentY =
        window.pageYOffset || document.documentElement.scrollTop || 0;
      handleNavbarScroll(currentY);
    },
    { passive: true },
  );

  // ==========================================================================
  // 10. LENIS SMOOTH SCROLLING ENGINE INITIALIZATION
  // ==========================================================================
  let lenis = null;
  try {
    if (typeof window.Lenis !== "undefined") {
      lenis = new window.Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.8,
        infinite: false,
      });

      // Sync navbar visibility with Lenis scroll event
      lenis.on("scroll", (e) => {
        const scrollY = e.scroll || window.pageYOffset || 0;
        handleNavbarScroll(scrollY);
      });

      function raf(time) {
        if (lenis) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
      }
      requestAnimationFrame(raf);
    } else {
      // Zero-dependency smooth wheel fallback
      document.documentElement.style.scrollBehavior = "smooth";
    }
  } catch (e) {
    console.warn(
      "Lenis init failed, falling back to browser smooth scrolling:",
      e,
    );
    document.documentElement.style.scrollBehavior = "smooth";
  }

  // Smooth scroll routing for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#" || href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        // When user clicks a nav link, make sure navbar stays visible
        if (siteHeader) siteHeader.classList.remove("nav-hidden");
        if (lenis) {
          lenis.scrollTo(target, { offset: -70, duration: 1.4 });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // ==========================================================================
  // 11. POMODORO FOCUS TIMER CONTROLLER
  // ==========================================================================
  let timerDuration = 25 * 60; // 25 mins
  let timerRemaining = timerDuration;
  let timerInterval = null;
  let isTimerRunning = false;
  let completedSessions = 0;

  const timerDisplay = document.getElementById("timer-display");
  const timerStartBtn = document.getElementById("timer-start-btn");
  const timerStartLabel = document.getElementById("timer-start-label");
  const timerBreakBtn = document.getElementById("timer-break-btn");
  const timerResetBtn = document.getElementById("timer-reset-btn");
  const timerModeLabel = document.getElementById("timer-mode-label");
  const timerSessionsCount = document.getElementById("timer-sessions-count");

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateTimerDisplay() {
    if (timerDisplay) {
      timerDisplay.textContent = formatTime(timerRemaining);
    }
  }

  function startTimer() {
    if (isTimerRunning) {
      // Pause
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerStartLabel.textContent = "Resume Session";
    } else {
      // Start
      isTimerRunning = true;
      timerStartLabel.textContent = "Pause Timer";
      timerInterval = setInterval(() => {
        if (timerRemaining > 0) {
          timerRemaining--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          isTimerRunning = false;
          completedSessions++;
          if (timerSessionsCount)
            timerSessionsCount.textContent = completedSessions;
          timerStartLabel.textContent = "Start Next Sprint";
          alertBox("Pomodoro session completed! Time for a 5-minute break.");
        }
      }, 1000);
    }
  }

  function setBreakTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerRemaining = 5 * 60;
    timerDuration = 5 * 60;
    timerModeLabel.textContent = "Rest Interval (5m)";
    timerStartLabel.textContent = "Start Rest Break";
    updateTimerDisplay();
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerRemaining = 25 * 60;
    timerDuration = 25 * 60;
    timerModeLabel.textContent = "Pomodoro Sprint (25m)";
    timerStartLabel.textContent = "Start Focus Session";
    updateTimerDisplay();
  }

  if (timerStartBtn) timerStartBtn.addEventListener("click", startTimer);
  if (timerBreakBtn) timerBreakBtn.addEventListener("click", setBreakTimer);
  if (timerResetBtn) timerResetBtn.addEventListener("click", resetTimer);

  // ==========================================================================
  // 12. INITIALIZATION BOOTSTRAP
  // ==========================================================================
  loadPersistedState();
  updateMetrics();
  populateNavMatrix();
  renderCurrentCard(false);
})();
