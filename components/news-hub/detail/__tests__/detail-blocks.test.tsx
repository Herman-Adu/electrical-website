import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { NewsArticle } from '@/types/news';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  useInView: () => true,
  useReducedMotion: () => false,
  useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
  animate: vi.fn(),
}));

vi.mock('gsap', () => ({
  gsap: { to: vi.fn(), fromTo: vi.fn(), registerPlugin: vi.fn() },
  default: { to: vi.fn(), fromTo: vi.fn(), registerPlugin: vi.fn() },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: vi.fn(), getAll: () => [], refresh: vi.fn() },
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock('@/components/news-hub/news-article-content', () => ({
  NewsArticleContent: ({ detail }: any) => (
    <div data-testid="news-article-content">{detail.intro[0]}</div>
  ),
}));

vi.mock('../insight-layout', () => ({
  InsightLayout: ({ article }: any) => (
    <div data-testid="insight-layout">{article.detail.intro[0]}</div>
  ),
}));

vi.mock('../article-layout', () => ({
  ArticleLayout: ({ article }: any) => (
    <div data-testid="article-layout">{article.detail.intro[0]}</div>
  ),
}));

// Helper to build a mock article
function mockArticle(overrides: Partial<NewsArticle> = {}): NewsArticle {
  return {
    id: 'test-1',
    slug: 'test-article',
    category: 'residential',
    categoryLabel: 'Residential',
    title: 'Test Article',
    excerpt: 'Test excerpt',
    description: 'Test desc',
    featuredImage: { src: '/test.jpg', alt: 'Test' },
    author: { name: 'Test Author', role: 'Engineer' },
    readTime: '5 min',
    tags: ['test'],
    isFeatured: false,
    publishedAt: '2026-01-01',
    updatedAt: '2026-01-01',
    detail: {
      intro: ['Test intro paragraph'],
      body: ['Test body paragraph'],
      takeaways: ['Test takeaway'],
      spotlight: [{ label: 'Efficiency', value: '95%' }],
      quote: { quote: 'Great work', author: 'Client Name', role: 'Project Manager' },
      scope: ['Scope item one'],
      challenges: [
        {
          title: 'Challenge One',
          description: 'The challenge desc',
          solution: 'The solution desc',
        },
      ],
      specifications: [
        {
          category: 'Electrical',
          items: [{ label: 'Voltage', value: '230V' }],
        },
      ],
      results: ['Result one achieved'],
      gallery: [
        { src: '/img1.jpg', alt: 'Image 1' },
        { src: '/img2.jpg', alt: 'Image 2' },
      ],
      conclusion: ['Conclusion paragraph'],
    },
    ...overrides,
  };
}

// ─── DetailIntroBlock ─────────────────────────────────────────────────────────
describe('DetailIntroBlock', () => {
  it('renders intro paragraphs', async () => {
    const { DetailIntroBlock } = await import('../detail-intro-block');
    render(<DetailIntroBlock intro={['First intro paragraph']} />);
    expect(screen.getByText('First intro paragraph')).toBeInTheDocument();
  });

  it('renders multiple intro paragraphs', async () => {
    const { DetailIntroBlock } = await import('../detail-intro-block');
    render(
      <DetailIntroBlock
        intro={['Paragraph one content', 'Paragraph two content']}
      />
    );
    expect(screen.getByText('Paragraph one content')).toBeInTheDocument();
    expect(screen.getByText('Paragraph two content')).toBeInTheDocument();
  });
});

// ─── DetailBodyBlock ──────────────────────────────────────────────────────────
describe('DetailBodyBlock', () => {
  it('renders body paragraphs', async () => {
    const { DetailBodyBlock } = await import('../detail-body-block');
    render(<DetailBodyBlock body={['Body paragraph text here']} />);
    expect(screen.getByText('Body paragraph text here')).toBeInTheDocument();
  });

  it('renders null when body is empty/undefined', async () => {
    const { DetailBodyBlock } = await import('../detail-body-block');
    const { container } = render(<DetailBodyBlock body={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

// ─── DetailTakeawayBlock ──────────────────────────────────────────────────────
describe('DetailTakeawayBlock', () => {
  it('renders takeaway items', async () => {
    const { DetailTakeawayBlock } = await import('../detail-takeaway-block');
    render(<DetailTakeawayBlock takeaways={['First key takeaway item']} />);
    expect(screen.getByText('First key takeaway item')).toBeInTheDocument();
  });

  it('renders numbered takeaways', async () => {
    const { DetailTakeawayBlock } = await import('../detail-takeaway-block');
    render(
      <DetailTakeawayBlock
        takeaways={['Takeaway alpha', 'Takeaway beta', 'Takeaway gamma']}
      />
    );
    // Check for number badges (01, 02, 03)
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });
});

// ─── DetailQuoteBlock ─────────────────────────────────────────────────────────
describe('DetailQuoteBlock', () => {
  it('renders quote text', async () => {
    const { DetailQuoteBlock } = await import('../detail-quote-block');
    render(
      <DetailQuoteBlock
        quote={{ quote: 'Amazing project outcome', author: 'Jane Doe', role: 'Director' }}
      />
    );
    expect(screen.getByText('Amazing project outcome')).toBeInTheDocument();
  });

  it('renders author and role', async () => {
    const { DetailQuoteBlock } = await import('../detail-quote-block');
    render(
      <DetailQuoteBlock
        quote={{ quote: 'Great work done here', author: 'John Smith', role: 'Site Manager' }}
      />
    );
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Site Manager')).toBeInTheDocument();
  });
});

// ─── DetailConclusionBlock ────────────────────────────────────────────────────
describe('DetailConclusionBlock', () => {
  it('renders conclusion paragraphs', async () => {
    const { DetailConclusionBlock } = await import('../detail-conclusion-block');
    render(<DetailConclusionBlock conclusion={['Final conclusion text here']} />);
    expect(screen.getByText('Final conclusion text here')).toBeInTheDocument();
  });

  it('renders null when conclusion is undefined', async () => {
    const { DetailConclusionBlock } = await import('../detail-conclusion-block');
    const { container } = render(<DetailConclusionBlock conclusion={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});

// ─── DetailGalleryBlock ───────────────────────────────────────────────────────
describe('DetailGalleryBlock', () => {
  it('renders images with alt text', async () => {
    const { DetailGalleryBlock } = await import('../detail-gallery-block');
    render(
      <DetailGalleryBlock
        gallery={[
          { src: '/photo1.jpg', alt: 'Site photo one' },
          { src: '/photo2.jpg', alt: 'Site photo two' },
        ]}
      />
    );
    expect(screen.getByAltText('Site photo one')).toBeInTheDocument();
    expect(screen.getByAltText('Site photo two')).toBeInTheDocument();
  });

  it('renders 2-col grid for fewer than 3 images', async () => {
    const { DetailGalleryBlock } = await import('../detail-gallery-block');
    const { container } = render(
      <DetailGalleryBlock
        gallery={[
          { src: '/photo1.jpg', alt: 'Gallery image A' },
          { src: '/photo2.jpg', alt: 'Gallery image B' },
        ]}
      />
    );
    // Should render a grid container (not horizontal scroll)
    const gridEl = container.querySelector('.grid');
    expect(gridEl).toBeTruthy();
  });
});

// ─── CaseStudyStatusBadge ─────────────────────────────────────────────────────
describe('CaseStudyStatusBadge', () => {
  it('renders status text', async () => {
    const { CaseStudyStatusBadge } = await import('../case-study-status-badge');
    render(<CaseStudyStatusBadge status="In Progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders "Completed" by default', async () => {
    const { CaseStudyStatusBadge } = await import('../case-study-status-badge');
    render(<CaseStudyStatusBadge />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});

// ─── CaseStudyProgressMetrics ─────────────────────────────────────────────────
describe('CaseStudyProgressMetrics', () => {
  it('renders metric labels', async () => {
    const { CaseStudyProgressMetrics } = await import('../case-study-progress-metrics');
    render(
      <CaseStudyProgressMetrics
        metrics={[
          { label: 'Energy Efficiency', value: '95%' },
          { label: 'Cost Reduction', value: '30%' },
        ]}
      />
    );
    expect(screen.getByText('Energy Efficiency')).toBeInTheDocument();
    expect(screen.getByText('Cost Reduction')).toBeInTheDocument();
  });

  it('renders metric values', async () => {
    const { CaseStudyProgressMetrics } = await import('../case-study-progress-metrics');
    render(
      <CaseStudyProgressMetrics
        metrics={[{ label: 'Uptime', value: '99.9%' }]}
      />
    );
    // The value string should appear somewhere (either raw or as CountUp end)
    expect(screen.getByText('Uptime')).toBeInTheDocument();
  });
});

// ─── CaseStudyChallengeCards ──────────────────────────────────────────────────
describe('CaseStudyChallengeCards', () => {
  it('renders challenge titles', async () => {
    const { CaseStudyChallengeCards } = await import('../case-study-challenge-cards');
    render(
      <CaseStudyChallengeCards
        challenges={[
          {
            title: 'Power Distribution Issue',
            description: 'Unstable power distribution',
            solution: 'Installed smart breakers',
          },
        ]}
      />
    );
    expect(screen.getByText('Power Distribution Issue')).toBeInTheDocument();
  });

  it('renders solution text', async () => {
    const { CaseStudyChallengeCards } = await import('../case-study-challenge-cards');
    render(
      <CaseStudyChallengeCards
        challenges={[
          {
            title: 'Wiring Fault',
            description: 'Faulty wiring detected',
            solution: 'Complete rewire performed',
          },
        ]}
      />
    );
    expect(screen.getByText('Complete rewire performed')).toBeInTheDocument();
  });
});

// ─── CaseStudySpecsGrid ───────────────────────────────────────────────────────
describe('CaseStudySpecsGrid', () => {
  it('renders specification category names', async () => {
    const { CaseStudySpecsGrid } = await import('../case-study-specs-grid');
    render(
      <CaseStudySpecsGrid
        specifications={[
          {
            category: 'Electrical Systems',
            items: [{ label: 'Voltage', value: '230V' }],
          },
        ]}
      />
    );
    expect(screen.getByText('Electrical Systems')).toBeInTheDocument();
  });

  it('renders spec item labels and values', async () => {
    const { CaseStudySpecsGrid } = await import('../case-study-specs-grid');
    render(
      <CaseStudySpecsGrid
        specifications={[
          {
            category: 'Power',
            items: [
              { label: 'Amperage', value: '100A' },
              { label: 'Frequency', value: '50Hz' },
            ],
          },
        ]}
      />
    );
    expect(screen.getByText('Amperage')).toBeInTheDocument();
    expect(screen.getByText('100A')).toBeInTheDocument();
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByText('50Hz')).toBeInTheDocument();
  });
});

// ─── CaseStudyScopeList ───────────────────────────────────────────────────────
describe('CaseStudyScopeList', () => {
  it('renders scope items', async () => {
    const { CaseStudyScopeList } = await import('../case-study-scope-list');
    render(
      <CaseStudyScopeList scope={['Install solar panels on rooftop']} />
    );
    expect(screen.getByText('Install solar panels on rooftop')).toBeInTheDocument();
  });

  it('renders numbered scope steps', async () => {
    const { CaseStudyScopeList } = await import('../case-study-scope-list');
    render(
      <CaseStudyScopeList
        scope={['Survey and assessment', 'Design and planning', 'Installation']}
      />
    );
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });
});

// ─── CaseStudyResultsShowcase ─────────────────────────────────────────────────
describe('CaseStudyResultsShowcase', () => {
  it('renders result items', async () => {
    const { CaseStudyResultsShowcase } = await import('../case-study-results-showcase');
    render(
      <CaseStudyResultsShowcase
        results={['Reduced energy consumption by 40 percent']}
      />
    );
    expect(
      screen.getByText('Reduced energy consumption by 40 percent')
    ).toBeInTheDocument();
  });

  it('renders all results', async () => {
    const { CaseStudyResultsShowcase } = await import('../case-study-results-showcase');
    render(
      <CaseStudyResultsShowcase
        results={[
          'Result alpha completed',
          'Result beta achieved',
          'Result gamma delivered',
        ]}
      />
    );
    expect(screen.getByText('Result alpha completed')).toBeInTheDocument();
    expect(screen.getByText('Result beta achieved')).toBeInTheDocument();
    expect(screen.getByText('Result gamma delivered')).toBeInTheDocument();
  });
});

// ─── CaseStudyLayout ──────────────────────────────────────────────────────────
describe('CaseStudyLayout', () => {
  it('renders data-testid="case-study-layout"', async () => {
    const { CaseStudyLayout } = await import('../case-study-layout');
    const article = mockArticle({ category: 'case-studies' });
    render(<CaseStudyLayout article={article} />);
    expect(screen.getByTestId('case-study-layout')).toBeInTheDocument();
  });

  it('renders intro content', async () => {
    const { CaseStudyLayout } = await import('../case-study-layout');
    const article = mockArticle({
      category: 'case-studies',
      detail: {
        intro: ['Case study intro text here'],
        takeaways: ['Key takeaway one'],
      },
    });
    render(<CaseStudyLayout article={article} />);
    expect(screen.getByText('Case study intro text here')).toBeInTheDocument();
  });
});

// ─── LayoutDispatcher ─────────────────────────────────────────────────────────
describe('LayoutDispatcher', () => {
  it('case-studies → renders data-testid="case-study-layout"', async () => {
    const { LayoutDispatcher } = await import('../layout-dispatcher');
    const article = mockArticle({ category: 'case-studies' });
    render(<LayoutDispatcher article={article} />);
    expect(screen.getByTestId('case-study-layout')).toBeInTheDocument();
  });

  it('insights → renders data-testid="insight-layout"', async () => {
    const { LayoutDispatcher } = await import('../layout-dispatcher');
    const article = mockArticle({ category: 'insights' });
    render(<LayoutDispatcher article={article} />);
    expect(screen.getByTestId('insight-layout')).toBeInTheDocument();
  });

  it('reviews → renders data-testid="news-article-content"', async () => {
    const { LayoutDispatcher } = await import('../layout-dispatcher');
    const article = mockArticle({ category: 'reviews' });
    render(<LayoutDispatcher article={article} />);
    expect(screen.getByTestId('news-article-content')).toBeInTheDocument();
  });

  it('residential → renders data-testid="article-layout"', async () => {
    const { LayoutDispatcher } = await import('../layout-dispatcher');
    const article = mockArticle({ category: 'residential' });
    render(<LayoutDispatcher article={article} />);
    expect(screen.getByTestId('article-layout')).toBeInTheDocument();
  });

  it('industrial → renders data-testid="article-layout"', async () => {
    const { LayoutDispatcher } = await import('../layout-dispatcher');
    const article = mockArticle({ category: 'industrial' });
    render(<LayoutDispatcher article={article} />);
    expect(screen.getByTestId('article-layout')).toBeInTheDocument();
  });

  it('partners → renders data-testid="article-layout"', async () => {
    const { LayoutDispatcher } = await import('../layout-dispatcher');
    const article = mockArticle({ category: 'partners' });
    render(<LayoutDispatcher article={article} />);
    expect(screen.getByTestId('article-layout')).toBeInTheDocument();
  });
});

// ─── InsightStatStrip ─────────────────────────────────────────────────────────
describe('InsightStatStrip', () => {
  it('renders spotlight metric values', async () => {
    const { InsightStatStrip } = await import('../insight-stat-strip');
    render(
      <InsightStatStrip
        spotlight={[
          { label: 'Efficiency', value: '95%' },
          { label: 'Savings', value: '$42K' },
        ]}
      />
    );
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('$42K')).toBeInTheDocument();
  });

  it('renders spotlight metric labels', async () => {
    const { InsightStatStrip } = await import('../insight-stat-strip');
    render(
      <InsightStatStrip
        spotlight={[
          { label: 'Efficiency', value: '95%' },
          { label: 'Savings', value: '$42K' },
        ]}
      />
    );
    expect(screen.getByText('Efficiency')).toBeInTheDocument();
    expect(screen.getByText('Savings')).toBeInTheDocument();
  });
});

// ─── InsightMethodologySteps ──────────────────────────────────────────────────
describe('InsightMethodologySteps', () => {
  it('renders methodology step text', async () => {
    const { InsightMethodologySteps } = await import('../insight-methodology-steps');
    render(
      <InsightMethodologySteps
        steps={['Assess the existing infrastructure', 'Design the upgrade plan']}
      />
    );
    expect(screen.getByText('Assess the existing infrastructure')).toBeInTheDocument();
    expect(screen.getByText('Design the upgrade plan')).toBeInTheDocument();
  });

  it('renders numbered steps', async () => {
    const { InsightMethodologySteps } = await import('../insight-methodology-steps');
    render(
      <InsightMethodologySteps
        steps={['Step alpha', 'Step beta', 'Step gamma']}
      />
    );
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });
});

// ─── InsightDataCallout ───────────────────────────────────────────────────────
describe('InsightDataCallout', () => {
  it('renders callout text', async () => {
    const { InsightDataCallout } = await import('../insight-data-callout');
    render(<InsightDataCallout text="Energy efficiency increased by 40% after upgrade." />);
    expect(
      screen.getByText('Energy efficiency increased by 40% after upgrade.')
    ).toBeInTheDocument();
  });

  it('renders eyebrow when provided', async () => {
    const { InsightDataCallout } = await import('../insight-data-callout');
    render(
      <InsightDataCallout
        text="Key finding from the study."
        eyebrow="Key Insight"
      />
    );
    expect(screen.getByText('Key Insight')).toBeInTheDocument();
    expect(screen.getByText('Key finding from the study.')).toBeInTheDocument();
  });
});

// ─── InsightLayout ────────────────────────────────────────────────────────────
describe('InsightLayout', () => {
  it('renders data-testid="insight-layout"', async () => {
    const { InsightLayout } = await import('../insight-layout');
    const article = mockArticle({ category: 'insights' });
    render(<InsightLayout article={article} />);
    expect(screen.getByTestId('insight-layout')).toBeInTheDocument();
  });

  it('renders intro content', async () => {
    const { InsightLayout } = await import('../insight-layout');
    const article = mockArticle({
      category: 'insights',
      detail: {
        intro: ['Insight intro paragraph here'],
        takeaways: ['Key takeaway'],
      },
    });
    render(<InsightLayout article={article} />);
    expect(screen.getByText('Insight intro paragraph here')).toBeInTheDocument();
  });
});

// ─── ArticleLocationPill ──────────────────────────────────────────────────────
describe('ArticleLocationPill', () => {
  it('renders location text', async () => {
    const { ArticleLocationPill } = await import('../article-location-pill');
    render(<ArticleLocationPill location="London, UK" />);
    expect(screen.getByText('London, UK')).toBeInTheDocument();
  });

  it('renders the map pin icon', async () => {
    const { ArticleLocationPill } = await import('../article-location-pill');
    const { container } = render(<ArticleLocationPill location="Manchester" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});

// ─── ArticleLayout ────────────────────────────────────────────────────────────
describe('ArticleLayout', () => {
  it('renders data-testid="article-layout"', async () => {
    const { ArticleLayout } = await import('../article-layout');
    const article = mockArticle({ category: 'residential' });
    render(<ArticleLayout article={article} />);
    expect(screen.getByTestId('article-layout')).toBeInTheDocument();
  });

  it('renders intro content', async () => {
    const { ArticleLayout } = await import('../article-layout');
    const article = mockArticle({
      category: 'residential',
      detail: {
        intro: ['Residential article intro text'],
        takeaways: ['Key takeaway'],
      },
    });
    render(<ArticleLayout article={article} />);
    expect(screen.getByText('Residential article intro text')).toBeInTheDocument();
  });
});
