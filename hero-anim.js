/* ============================================
   HERO TITLE ANIMATION & PARALLAX
   首屏标题/副标题进场动画与多图层视差
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const subtitle = document.getElementById('hero-subtitle');
  const title = document.getElementById('hero-title');
  const desc = document.getElementById('hero-desc');
  const badges = document.getElementById('hero-badges');
  const heroBg = document.getElementById('hero-bg');
  const heroSection = document.getElementById('hero');

  if (title) title.classList.add('in-view');
  if (subtitle) {
    setTimeout(() => {
      subtitle.classList.add('in-view');
    }, 100);
  }
  if (desc) {
    setTimeout(() => {
      desc.classList.add('in-view');
    }, 200);
  }
  if (badges) {
    setTimeout(() => {
      badges.classList.add('in-view');
    }, 300);
  }

  // 检查是否支持 hover，避免移动端过度损耗性能
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Parallax Variables
  let scrollY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetScrollY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  // Lerp 函数，用于平滑过渡
  const lerp = (start, end, factor) => start + (end - start) * factor;

  // 监听滚动 (可以配合 Lenis 或者原生 scroll)
  function onScroll() {
    targetScrollY = window.scrollY;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // 监听鼠标
  if (isDesktop && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // 将鼠标位置转换为 -1 到 1 的范围
      targetMouseX = (e.clientX - centerX) / centerX;
      targetMouseY = (e.clientY - centerY) / centerY;
    });
    
    heroSection.addEventListener('mouseleave', () => {
      targetMouseX = 0;
      targetMouseY = 0;
    });
  }

  // 页面可见性 — 隐藏时暂停循环
  let rafId = null;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden && !rafId) {
      rafId = requestAnimationFrame(loop);
    }
  });

  // 动画循环
  function loop() {
    // 平滑插值计算当前值
    scrollY = lerp(scrollY, targetScrollY, 0.1);
    mouseX = lerp(mouseX, targetMouseX, 0.05);
    mouseY = lerp(mouseY, targetMouseY, 0.05);

    if (heroBg) {
      // Keep the portrait clean: no blur, no scale, only a restrained drift.
      const mouseParallaxX = mouseX * -6;
      const mouseParallaxY = mouseY * -4;

      heroBg.style.transform = `translate3d(${mouseParallaxX}px, ${mouseParallaxY}px, 0)`;
      heroBg.style.filter = 'saturate(0.78) contrast(0.96) brightness(0.72)';
    }

    rafId = requestAnimationFrame(loop);
  }

  // 启动循环
  requestAnimationFrame(loop);
});
