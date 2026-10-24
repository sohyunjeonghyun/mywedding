/**
 * Modern Minimal Wedding Invitation - Script
 */

(function () {
  'use strict';

  // ── Helpers ──
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[d.getDay()];
    return { year, month, day, dayName, date: d };
  }

  function formatTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h < 12 ? '오전' : '오후';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${period} ${hour12}시${m > 0 ? ' ' + m + '분' : ''}`;
  }

  // ── Image Loading ──
  function loadImagesFromFolder(folder, maxAttempts = 50) {
    return new Promise(resolve => {
        const images = [];
        let current = 1;
        let consecutiveFails = 0;

        function tryNext() {
            if (current > maxAttempts || consecutiveFails >= 3) {
                resolve(images);
                return;
            }
            const img = new Image();
            const path = `images/${folder}/${current}.jpg`;
            img.onload = function() {
                images.push(path);
                consecutiveFails = 0;
                current++;
                tryNext();
            };
            img.onerror = function() {
                consecutiveFails++;
                current++;
                tryNext();
            };
            img.src = path;
        }

        tryNext();
    });
  }

  // ── Toast ──
  let toastTimer = null;
  function showToast(message) {
    let toast = $('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    clearTimeout(toastTimer);
    toast.classList.remove('show');
    requestAnimationFrame(() => {
      toast.classList.add('show');
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
    });
  }

  // ── Copy to clipboard ──
  async function copyToClipboard(text, successMsg) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMsg || '복사되었습니다');
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(successMsg || '복사되었습니다');
    }
  }

  // ── Curtain / Intro Overlay ──
  function initCurtain(c, dateInfo, timeText) {
    const overlay = $('#curtain-overlay');
    if (!overlay) return;

    if (!c.useCurtain) {
      // 커튼 사용하지 않음 - 즉시 제거
      overlay.remove();
      return;
    }

    // 커튼 표시
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // 커튼 내용 채우기
    const names = $('.curtain-names', overlay);
    const date = $('.curtain-date', overlay);
    if (names) names.textContent = `${c.groom.nameEn} & ${c.bride.nameEn}`;
    if (date) date.textContent = `${dateInfo.year}. ${String(dateInfo.month).padStart(2, '0')}. ${String(dateInfo.day).padStart(2, '0')}`;

    // 열기 버튼
    const btn = $('#curtain-open-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        overlay.classList.add('fade-out');
        document.body.style.overflow = '';
        overlay.addEventListener('transitionend', () => {
          overlay.remove();
        }, { once: true });
      });
    }
  }

  // ── Build Page ──
  async function init() {
    if (typeof CONFIG === 'undefined') return;

    const c = CONFIG;
    const dateInfo = formatDate(c.wedding.date);
    const timeText = formatTime(c.wedding.time);

    // Handle curtain overlay
    initCurtain(c, dateInfo, timeText);

    // Build non-image sections immediately
    buildHero(c, dateInfo, timeText);
    buildInvitation(c, dateInfo, timeText);
    buildCountdown(c, dateInfo);
    buildStoryText(c);
    buildLocation(c);
    buildInfo(c);
    buildRsvp(c);
    buildAccount(c);
    initScrollAnimations();
    initModal();

    // Show loading state for image-dependent sections
    showLoadingState();

    // Load images asynchronously
    const [storyImages, galleryImages] = await Promise.all([
      loadImagesFromFolder('story'),
      loadImagesFromFolder('gallery')
    ]);

    // Render image-dependent sections
    buildStoryImages(storyImages);
    buildGallery(galleryImages);

    // Remove loading state
    hideLoadingState();

    // Re-observe newly added elements for scroll animations
    reobserveAnimations();
  }

  // ── Loading State ──
  function showLoadingState() {
    const storyImagesEl = $('.story-images');
    const galleryGrid = $('.gallery-grid');
    if (storyImagesEl) storyImagesEl.classList.add('loading');
    if (galleryGrid) galleryGrid.classList.add('loading');
  }

  function hideLoadingState() {
    const storyImagesEl = $('.story-images');
    const galleryGrid = $('.gallery-grid');
    if (storyImagesEl) storyImagesEl.classList.remove('loading');
    if (galleryGrid) galleryGrid.classList.remove('loading');
  }

  // ── Hero ──
  function buildHero(c, dateInfo, timeText) {
    const heroImg = $('.hero-image');
    if (heroImg) {
      heroImg.src = 'images/hero/1.jpg';
      heroImg.alt = `${c.groom.name} & ${c.bride.name}`;
    }

    const heroNames = $('.hero-names');
    if (heroNames) {
      heroNames.innerHTML = `${c.groom.nameEn}<span class="ampersand">&</span>${c.bride.nameEn}`;
    }

    const heroDate = $('.hero-date');
    if (heroDate) {
      heroDate.textContent = `${dateInfo.year}. ${String(dateInfo.month).padStart(2, '0')}. ${String(dateInfo.day).padStart(2, '0')}. ${dateInfo.dayName}요일 ${timeText}`;
    }

    const heroVenue = $('.hero-venue');
    if (heroVenue) {
      heroVenue.textContent = c.wedding.venue;
    }
  }

  // ── Invitation ──
  function buildInvitation(c, dateInfo, timeText) {
    const msg = $('.invitation-message');
    if (msg) {
      msg.textContent = c.invitation.message;
    }

    const parents = $('.invitation-parents');
    if (parents) {
      function parentLine(side) {
        const fatherName = side.father;
        const motherName = side.mother;
        const fatherDec = side.fatherDeceased ? ' class="deceased"' : '';
        const motherDec = side.motherDeceased ? ' class="deceased"' : '';
        return `<span${fatherDec}>${fatherName}</span> <span class="dot"></span> <span${motherDec}>${motherName}</span><span style="color:#999;margin-left:4px">의 ${side === c.groom ? '아들' : '딸'}</span> <strong>${side.name}</strong>`;
      }
      parents.innerHTML = `
        <div class="parent-line">${parentLine(c.groom)}</div>
        <div class="parent-line">${parentLine(c.bride)}</div>
      `;
    }
  }

  // ── Countdown ──
  function buildCountdown(c, dateInfo) {
    const [h, m] = c.wedding.time.split(':').map(Number);
    const weddingDate = new Date(dateInfo.date);
    weddingDate.setHours(h, m, 0, 0);

    function update() {
      const now = new Date();
      const diff = weddingDate - now;

      const daysEl = $('#cd-days');
      const hoursEl = $('#cd-hours');
      const minsEl = $('#cd-mins');
      const secsEl = $('#cd-secs');
      const ddayEl = $('.countdown-dday');

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '0';
        if (minsEl) minsEl.textContent = '0';
        if (secsEl) secsEl.textContent = '0';
        if (ddayEl) ddayEl.textContent = '결혼식 당일입니다';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours;
      if (minsEl) minsEl.textContent = mins;
      if (secsEl) secsEl.textContent = secs;

      if (ddayEl) {
        ddayEl.textContent = `결혼식까지 D-${days}`;
      }
    }

    update();
    setInterval(update, 1000);

    // Calendar buttons
    const gcalBtn = $('#btn-gcal');
    const icalBtn = $('#btn-ical');

    if (gcalBtn) {
      gcalBtn.addEventListener('click', () => {
        const start = formatGoogleDate(weddingDate);
        const end = formatGoogleDate(new Date(weddingDate.getTime() + 2 * 60 * 60 * 1000));
        const title = encodeURIComponent(`${c.groom.name} ♥ ${c.bride.name} 결혼식`);
        const location = encodeURIComponent(`${c.wedding.venue} ${c.wedding.address}`);
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&location=${location}`;
        window.open(url, '_blank');
      });
    }

    if (icalBtn) {
      icalBtn.addEventListener('click', () => {
        const start = formatICSDate(weddingDate);
        const end = formatICSDate(new Date(weddingDate.getTime() + 2 * 60 * 60 * 1000));
        const ics = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Wedding//Invitation//KO',
          'BEGIN:VEVENT',
          `DTSTART:${start}`,
          `DTEND:${end}`,
          `SUMMARY:${c.groom.name} ♥ ${c.bride.name} 결혼식`,
          `LOCATION:${c.wedding.venue} ${c.wedding.address}`,
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'wedding.ics';
        link.click();
        URL.revokeObjectURL(link.href);
      });
    }
  }

  function formatGoogleDate(d) {
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  function formatICSDate(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  }

  // ── Story (text only, rendered immediately) ──
  function buildStoryText(c) {
    const title = $('#story-title');
    if (title) title.textContent = c.story.title;

    const content = $('.story-content');
    if (content) content.textContent = c.story.content;
  }

  // ── Story Images (rendered after auto-detection) ──
  function buildStoryImages(storyImages) {
    const container = $('.story-images');
    if (!container) return;

    if (storyImages.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = storyImages.map((src, i) =>
      `<div class="story-image-item">
        <img src="${src}" alt="Our story ${i + 1}" loading="lazy">
      </div>`
    ).join('');
  }

  // ── Gallery (rendered after auto-detection) ──
  let galleryAllImages = [];

  function buildGallery(images) {
    const grid = $('.gallery-grid');
    if (!grid) return;

    galleryAllImages = images;

    if (images.length === 0) {
      // Hide entire gallery section if no images found
      const gallerySection = grid.closest('.gallery');
      if (gallerySection) gallerySection.style.display = 'none';
      return;
    }

    const initialCount = 6;

    function renderImages(count) {
      grid.innerHTML = images.slice(0, count).map((src, i) =>
        `<div class="gallery-item" data-index="${i}">
          <img src="${src}" alt="Gallery photo ${i + 1}" loading="lazy">
        </div>`
      ).join('');

      $$('.gallery-item', grid).forEach(item => {
        item.addEventListener('click', () => {
          openModal(images, parseInt(item.dataset.index));
        });
      });
    }

    renderImages(Math.min(initialCount, images.length));

    const moreBtn = $('.btn-gallery-more');
    if (moreBtn) {
      if (images.length <= initialCount) {
        moreBtn.parentElement.style.display = 'none';
      } else {
        let expanded = false;
        moreBtn.addEventListener('click', () => {
          if (!expanded) {
            renderImages(images.length);
            moreBtn.textContent = '접기';
            expanded = true;
          } else {
            renderImages(initialCount);
            moreBtn.textContent = '더보기';
            expanded = false;
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    }
  }

  // ── Photo Modal ──
  let currentModalImages = [];
  let currentModalIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function initModal() {
    const overlay = $('.modal-overlay');
    if (!overlay) return;

    const closeBtn = $('.modal-close');
    const prevBtn = $('.modal-prev');
    const nextBtn = $('.modal-next');
    const swipeArea = $('.modal-swipe-area');

    closeBtn?.addEventListener('click', closeModal);
    prevBtn?.addEventListener('click', () => navigateModal(-1));
    nextBtn?.addEventListener('click', () => navigateModal(1));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === swipeArea) closeModal();
    });

    // Swipe
    swipeArea?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    swipeArea?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        navigateModal(diff > 0 ? 1 : -1);
      }
    }, { passive: true });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateModal(-1);
      if (e.key === 'ArrowRight') navigateModal(1);
    });
  }

  function openModal(images, index) {
    currentModalImages = images;
    currentModalIndex = index;

    const overlay = $('.modal-overlay');
    if (!overlay) return;

    updateModalImage();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = $('.modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateModal(dir) {
    currentModalIndex += dir;
    if (currentModalIndex < 0) currentModalIndex = currentModalImages.length - 1;
    if (currentModalIndex >= currentModalImages.length) currentModalIndex = 0;
    updateModalImage();
  }

  function updateModalImage() {
    const img = $('.modal-image');
    const counter = $('.modal-counter');
    if (img) {
      img.src = currentModalImages[currentModalIndex];
      img.alt = `Photo ${currentModalIndex + 1}`;
    }
    if (counter) {
      counter.textContent = `${currentModalIndex + 1} / ${currentModalImages.length}`;
    }
  }

  // ── Location ──
  function buildLocation(c) {
    const venueName = $('.location-venue-name');
    const venueHall = $('.location-venue-hall');
    const address = $('.location-address');
    const tel = $('.location-tel');
    const mapImg = $('.location-map-image img');

    if (venueName) venueName.textContent = c.wedding.venue;
    if (venueHall) venueHall.textContent = c.wedding.hall;
    if (address) address.textContent = c.wedding.address;
    if (tel && c.wedding.tel) {
      tel.innerHTML = `<a href="tel:${c.wedding.tel}">${c.wedding.tel}</a>`;
    }
    if (mapImg) {
      mapImg.src = 'images/location/1.jpg';
      mapImg.alt = `${c.wedding.venue} 약도`;
    }

    // Copy address
    const copyBtn = $('#btn-copy-address');
    copyBtn?.addEventListener('click', () => {
      copyToClipboard(c.wedding.address, '주소가 복사되었습니다');
    });

    // Map / navi links
    const links = c.wedding.mapLinks || {};
    const kakaoLink = $('#link-kakao-map');
    const kakaoNaviLink = $('#link-kakao-navi');
    const naverLink = $('#link-naver-map');
    const tmapLink = $('#link-tmap');
    if (kakaoLink && links.kakao) kakaoLink.href = links.kakao;
    if (kakaoNaviLink) kakaoNaviLink.href = links.kakaoNavi || links.kakao || '#';
    if (naverLink && links.naver) naverLink.href = links.naver;
    if (tmapLink) {
      tmapLink.href = links.tmap || `tmap://search?name=${encodeURIComponent(c.wedding.address)}`;
      tmapLink.removeAttribute('target');
    }

    // 대중교통 이용안내 (아코디언)
    buildAccordionList($('#transit-list'), c.wedding.transit);
  }

  // ── Accordion (한 번에 하나만 펼쳐짐, 처음에는 모두 닫힘) ──
  function buildAccordionList(list, items) {
    if (!list) return;
    if (!items || items.length === 0) {
      list.style.display = 'none';
      return;
    }

    list.innerHTML = '';
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'info-item';

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'info-item-toggle';
      toggle.setAttribute('aria-expanded', 'false');

      const label = document.createElement('span');
      label.textContent = item.title;
      toggle.appendChild(label);
      toggle.insertAdjacentHTML('beforeend',
        '<svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>');

      const body = document.createElement('div');
      body.className = 'info-item-body';
      const text = document.createElement('p');
      text.textContent = item.content;
      body.appendChild(text);

      toggle.addEventListener('click', () => {
        const willOpen = !el.classList.contains('open');
        $$('.info-item', list).forEach(other => {
          other.classList.remove('open');
          $('.info-item-toggle', other).setAttribute('aria-expanded', 'false');
        });
        if (willOpen) {
          el.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });

      el.appendChild(toggle);
      el.appendChild(body);
      list.appendChild(el);
    });
  }

  // ── Info (안내사항 펼침 메뉴) ──
  function buildInfo(c) {
    const block = $('#info-block');
    if (!block) return;

    if (!c.info || !c.info.items || c.info.items.length === 0) {
      block.style.display = 'none';
      return;
    }

    const titleEl = $('.section-title', block);
    const msgEl = $('.info-message', block);
    const list = $('.info-list', block);

    if (titleEl) titleEl.textContent = c.info.title || '안내사항';
    if (msgEl) {
      if (c.info.message && c.info.message.trim()) {
        msgEl.textContent = c.info.message;
      } else {
        msgEl.style.display = 'none';
      }
    }

    buildAccordionList(list, c.info.items);
  }

  // ── RSVP (참석여부) ──
  function buildRsvp(c) {
    const section = $('#rsvp-section');
    const overlay = $('#rsvp-overlay');
    if (!section) return;

    const r = c.rsvp;
    if (!r || r.enabled === false) {
      section.style.display = 'none';
      if (overlay) overlay.remove();
      return;
    }

    $('.section-title', section).textContent = r.title || '참석여부';
    $('.rsvp-message', section).textContent = r.message || '';
    const openBtn = $('#rsvp-open-btn');
    const btnText = r.buttonText || '참석의사 전달하기';
    openBtn.textContent = btnText;

    // 하단 고정 배너: 본문의 참석여부 버튼이 화면에 보일 때(중복 방지)와 입력창이 열려 있을 때만 숨김
    const banner = $('#rsvp-banner');
    const bannerBtn = $('#rsvp-banner-btn');
    let sectionVisible = false;
    let modalOpen = false;
    function syncBanner() {
      if (banner) banner.classList.toggle('hide', sectionVisible || modalOpen);
    }
    if (banner && r.banner !== false) {
      bannerBtn.textContent = btnText;
      bannerBtn.addEventListener('click', () => openRsvp());
      document.body.classList.add('has-rsvp-banner');
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          sectionVisible = entries[0].isIntersecting;
          syncBanner();
        }, { threshold: 0.6 }).observe(openBtn);
      }
      syncBanner();
    } else if (banner) {
      banner.remove();
    }

    const form = $('#rsvp-form');
    const errorEl = $('#rsvp-error');
    const submitBtn = $('#rsvp-submit');
    const attendOnly = $$('.rsvp-attend-only', form);

    function openRsvp() {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modalOpen = true;
      syncBanner();
    }
    function closeRsvp() {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      modalOpen = false;
      syncBanner();
    }

    openBtn.addEventListener('click', openRsvp);
    $('#rsvp-close').addEventListener('click', closeRsvp);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeRsvp(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeRsvp();
    });

    // 불참이면 인원/식사 항목 숨김
    function syncAttend() {
      const attend = form.elements['attend'].value;
      attendOnly.forEach(el => { el.style.display = attend === '불참' ? 'none' : ''; });
    }
    $$('input[name="attend"]', form).forEach(i => i.addEventListener('change', syncAttend));
    syncAttend();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.textContent = '';

      const side = form.elements['side'].value;
      const attend = form.elements['attend'].value;
      const name = form.elements['name'].value.trim();
      if (!side) { errorEl.textContent = '신랑측 / 신부측을 선택해 주세요.'; return; }
      if (!attend) { errorEl.textContent = '참석 여부를 선택해 주세요.'; return; }
      if (!name) { errorEl.textContent = '성함을 입력해 주세요.'; form.elements['name'].focus(); return; }

      const attending = attend === '참석';
      const data = {
        side,
        attend,
        name,
        count: attending ? form.elements['count'].value : '0',
        meal: attending ? form.elements['meal'].value : '-',
        memo: form.elements['memo'].value.trim(),
        submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
      };

      function done() {
        showToast('참석 의사가 전달되었습니다. 감사합니다');
        form.reset();
        syncAttend();
        closeRsvp();
      }

      // 1) 구글 시트(Apps Script)로 전송
      if (r.endpoint) {
        submitBtn.disabled = true;
        submitBtn.textContent = '전달 중...';
        try {
          await fetch(r.endpoint, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(data)
          });
          done();
        } catch (err) {
          errorEl.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = '전달하기';
        }
        return;
      }

      // 2) 문자 메시지로 전달
      const phone = (r.phone && (side === '신랑측' ? r.phone.groom : r.phone.bride)) || '';
      if (phone) {
        const lines = [
          `[참석여부] ${side} ${name}`,
          `참석: ${attend}`,
          attending ? `인원: ${data.count}명 / ${data.meal}` : null,
          data.memo ? `전달사항: ${data.memo}` : null
        ].filter(Boolean);
        window.location.href = `sms:${phone}?&body=${encodeURIComponent(lines.join('\n'))}`;
        closeRsvp();
        return;
      }

      errorEl.textContent = '참석 응답 접수가 아직 설정되지 않았습니다.';
    });
  }

  // ── Account ──
  function buildAccount(c) {
    const commentEl = $('.account-comment');
    if (commentEl) {
      if (c.accounts.comment && c.accounts.comment.trim()) {
        commentEl.textContent = c.accounts.comment;
      } else {
        commentEl.style.display = 'none';
      }
    }

    buildAccountGroup('groom', c.accounts.groom, `신랑측 계좌번호`);
    buildAccountGroup('bride', c.accounts.bride, `신부측 계좌번호`);
  }

  function buildAccountGroup(side, accounts, label) {
    const group = $(`#account-${side}`);
    if (!group) return;

    const toggle = $('.account-group-toggle', group);
    const list = $('.account-list', group);

    if (toggle) {
      const labelEl = toggle.querySelector('.toggle-label');
      if (labelEl) labelEl.textContent = label;

      toggle.addEventListener('click', () => {
        const willOpen = !group.classList.contains('open');
        $$('.account-group').forEach(g => g.classList.remove('open'));
        if (willOpen) group.classList.add('open');
      });
    }

    if (list) {
      list.innerHTML = accounts.map(acc =>
        `<div class="account-item">
          <div class="account-info">
            <div class="account-role">${acc.role}</div>
            <div class="account-detail">
              <span class="account-name">${acc.name}</span>
              ${acc.bank} ${acc.number}
            </div>
          </div>
          <button class="btn-copy-account" data-copy="${acc.bank} ${acc.number} ${acc.name}">복사</button>
        </div>`
      ).join('');

      $$('.btn-copy-account', list).forEach(btn => {
        btn.addEventListener('click', () => {
          copyToClipboard(btn.dataset.copy, '계좌번호가 복사되었습니다');
        });
      });
    }
  }

  // ── Scroll Animations ──
  let scrollObserver = null;

  function initScrollAnimations() {
    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    $$('.fade-in').forEach(el => scrollObserver.observe(el));
  }

  function reobserveAnimations() {
    if (!scrollObserver) return;
    $$('.fade-in:not(.visible)').forEach(el => scrollObserver.observe(el));
  }

  // ── Init ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
