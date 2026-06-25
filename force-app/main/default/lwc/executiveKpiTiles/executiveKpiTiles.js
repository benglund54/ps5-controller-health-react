import { LightningElement, api } from 'lwc';

const DEFAULT_SECTION_TITLE = 'Executive Decision Snapshot';

const TILE_THEMES = {
    purple: { bg: '#f3f0ff', border: '#d4c7f7', icon: '#7b5ea7' },
    gold:   { bg: '#fff8e6', border: '#f5d46a', icon: '#9a6c00' },
    green:  { bg: '#e8f5e9', border: '#a5d6a7', icon: '#2e7d32' },
    red:    { bg: '#fdecea', border: '#f5c6c2', icon: '#c62828' },
    teal:   { bg: '#e0f7fa', border: '#80deea', icon: '#00695c' },
    blue:   { bg: '#e3f2fd', border: '#90caf9', icon: '#1565c0' },
};

function themeStyles(themeKey) {
    const t = TILE_THEMES[themeKey] || TILE_THEMES.purple;
    return {
        iconBgStyle:    `background:${t.bg};border:1px solid ${t.border};`,
        iconColorStyle: `--sds-c-icon-color-foreground-default:${t.icon};`,
    };
}

const DEFAULT_TILES = [
    {
        id: 'players',
        label: 'Players Analyzed',
        value: '124.8M',
        trend: '+12% coverage',
        trendDir: 'up',
        explanation: 'Unified player population available for lifecycle intelligence.',
        icon: 'utility:groups',
        theme: 'blue',
        highlighted: false,
    },
    {
        id: 'opportunities',
        label: 'Agentic Opportunities',
        value: '8.7M',
        trend: '8.7M ranked',
        trendDir: 'up',
        explanation: 'Players with a ranked recommendation ready for action.',
        icon: 'utility:einstein',
        theme: 'purple',
        highlighted: false,
    },
    {
        id: 'value',
        label: 'Value at Stake',
        value: '$186M',
        trend: '$186M modeled',
        trendDir: 'neutral',
        explanation: 'Modeled retention, adoption, service, and commerce impact.',
        icon: 'utility:money',
        theme: 'gold',
        highlighted: true,
    },
    {
        id: 'decisions',
        label: 'High-Priority Decisions',
        value: '5',
        trend: '5 pending',
        trendDir: 'neutral',
        explanation: 'Executive decisions required to move from insight to action.',
        icon: 'utility:priority',
        theme: 'red',
        highlighted: false,
    },
    {
        id: 'readiness',
        label: 'AI / Data Readiness',
        value: '68%',
        trend: '68% ready',
        trendDir: 'up',
        explanation: 'Current readiness across data, identity, AI, and orchestration.',
        icon: 'utility:database',
        theme: 'teal',
        highlighted: false,
    },
];

function trendClass(dir) {
    if (dir === 'up')   return 'kpi-tile__trend kpi-tile__trend_up';
    if (dir === 'down') return 'kpi-tile__trend kpi-tile__trend_down';
    return 'kpi-tile__trend kpi-tile__trend_neutral';
}

function trendIcon(dir) {
    if (dir === 'up')   return 'utility:arrowup';
    if (dir === 'down') return 'utility:arrowdown';
    return 'utility:info';
}

function trendAriaLabel(dir, trend) {
    return `Trend: ${trend || ''}`;
}

function enrichTile(tile) {
    const { iconBgStyle, iconColorStyle } = themeStyles(tile.theme);
    return {
        ...tile,
        iconBgStyle,
        iconColorStyle,
        trendClass:     trendClass(tile.trendDir),
        trendIcon:      trendIcon(tile.trendDir),
        trendAriaLabel: trendAriaLabel(tile.trendDir, tile.trend),
        innerClass:     tile.highlighted ? 'kpi-tile__inner kpi-tile__inner_highlighted' : 'kpi-tile__inner',
    };
}

export default class ExecutiveKpiTiles extends LightningElement {
    @api sectionTitle = DEFAULT_SECTION_TITLE;
    @api kpiJson      = '';

    _showTrends = true;
    @api
    get showTrends() { return this._showTrends; }
    set showTrends(v) { this._showTrends = v !== false && v !== 'false'; }

    get resolvedSectionTitle() {
        return this.sectionTitle || DEFAULT_SECTION_TITLE;
    }

    get resolvedTiles() {
        if (this.kpiJson) {
            try {
                const parsed = JSON.parse(this.kpiJson);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map(enrichTile);
                }
            } catch (e) {
                // Invalid JSON — fall through to defaults
            }
        }
        return DEFAULT_TILES.map(enrichTile);
    }
}
