const { chromium, devices } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 12'] });
  const page = await context.newPage();

  const projectUrl = 'http://localhost:3000/projects/category/commercial-lighting/riverside-commercial-retrofit';
  const newsUrl = 'http://localhost:3000/news-hub/how-to-know-if-your-home-needs-rewiring';
  const aboutUrl = 'http://localhost:3000/about';

  const result = {
    mobile: {},
    desktop: {},
    news: {},
    about: {}
  };

  await page.goto(projectUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const mobileChecks = await page.evaluate(() => {
    const section = document.querySelector('#timeline');
    const firstNode = section?.querySelector('[data-timeline-node="0"]');
    const firstCard = firstNode?.closest('.group')?.querySelector('.rounded-2xl');
    const track = firstNode?.parentElement?.querySelector('.bg-electric-cyan\\/20');
    const nodeRect = firstNode?.getBoundingClientRect();
    const cardRect = firstCard?.getBoundingClientRect();

    return {
      hasSection: !!section,
      hasFirstNode: !!firstNode,
      hasTrackBaseline: !!track,
      nodeLeft: nodeRect?.left ?? null,
      cardLeft: cardRect?.left ?? null,
      cardRightOfNode: !!(nodeRect && cardRect && cardRect.left > nodeRect.left + 20)
    };
  });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75));
  await page.waitForTimeout(400);

  const mobileScrollCheck = await page.evaluate(() => {
    const animatedFill = document.querySelector('#timeline [data-timeline-node="0"]')
      ?.parentElement
      ?.querySelector('.bg-electric-cyan');
    const style = animatedFill ? getComputedStyle(animatedFill) : null;
    const h = style?.height || '';
    return {
      fillVisible: !!animatedFill,
      fillHeight: h,
      fillHeightNonZero: h !== '0px' && h !== ''
    };
  });

  result.mobile = { ...mobileChecks, ...mobileScrollCheck };

  const desktopContext = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(projectUrl, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(500);

  result.desktop = await desktopPage.evaluate(() => {
    const section = document.querySelector('#timeline');
    const row = section?.querySelector('.group');
    const labelDesktop = row?.querySelector('.hidden.md\\:block');
    const nodeCol = row?.querySelector('[data-timeline-node="0"]')?.closest('.relative');
    const card = row?.querySelector('.rounded-2xl');
    const labelRect = labelDesktop?.getBoundingClientRect();
    const nodeRect = nodeCol?.getBoundingClientRect();
    const cardRect = card?.getBoundingClientRect();

    return {
      hasSection: !!section,
      hasDesktopLabel: !!labelDesktop,
      hasNodeColumn: !!nodeCol,
      hasCard: !!card,
      phaseNodeCardOrder: !!(labelRect && nodeRect && cardRect && labelRect.left < nodeRect.left && nodeRect.left < cardRect.left)
    };
  });

  await desktopPage.goto(newsUrl, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(400);
  await desktopPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
  await desktopPage.waitForTimeout(400);

  result.news = await desktopPage.evaluate(() => {
    const section = document.querySelector('#timeline');
    const node = section?.querySelector('[data-timeline-node]');
    const fill = node?.parentElement?.querySelector('.bg-electric-cyan');
    const fillStyle = fill ? getComputedStyle(fill) : null;
    return {
      hasSection: !!section,
      hasNode: !!node,
      hasAnimatedConnector: !!fill,
      connectorHeight: fillStyle?.height || '',
      connectorNonZero: !!fillStyle && fillStyle.height !== '0px'
    };
  });

  await desktopPage.goto(aboutUrl, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(400);
  await desktopPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
  await desktopPage.waitForTimeout(400);

  result.about = await desktopPage.evaluate(() => {
    const section = document.querySelector('#timeline');
    const node = section?.querySelector('[data-timeline-node]');
    const fill = node?.parentElement?.querySelector('.bg-electric-cyan');
    const fillStyle = fill ? getComputedStyle(fill) : null;
    return {
      hasSection: !!section,
      hasNode: !!node,
      hasAnimatedConnector: !!fill,
      connectorHeight: fillStyle?.height || '',
      connectorNonZero: !!fillStyle && fillStyle.height !== '0px'
    };
  });

  await desktopContext.close();
  await context.close();
  await browser.close();

  console.log(JSON.stringify(result, null, 2));
})();

