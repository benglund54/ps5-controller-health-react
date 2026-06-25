import { LightningElement, api } from 'lwc';

const DEFAULT_TITLE   = 'Ranked Agentic Opportunities';
const DEFAULT_MAX     = 6;

// Dark icon tiles — white glyph on colored square
const ICON_THEMES = {
    green:  { bg: '#00AB9F' },
    orange: { bg: '#F3C43A' },
    blue:   { bg: '#2F6DB4' },
    purple: { bg: '#2F6DB4' },
    teal:   { bg: '#00AB9F' },
    gold:   { bg: '#F3C43A' },
    red:    { bg: '#DE0024' },
};

const PRIORITY_CLASS = {
    'high':   'rao-priority rao-priority_high',
    'medium': 'rao-priority rao-priority_medium',
    'low':    'rao-priority rao-priority_low',
};

const CONF_CLASS = {
    'very high': 'rao-conf rao-conf_high',
    'high':      'rao-conf rao-conf_high',
    'medium':    'rao-conf rao-conf_medium',
    'low':       'rao-conf rao-conf_low',
};

// Top-3 ranks get a colored circle
const RANK_COLORS = ['#2e7d32', '#1565c0', '#e65100'];

const DEFAULT_ROWS = [
    {
        id: 'renewal',
        rank: 1,
        opportunity: 'PS Plus Renewal Value Journey',
        valueAtStake: '$74M retention',
        confidence: 'Very High',
        owner: 'PSN / Subscriptions',
        recommendedDecision: 'Approve renewal value pilot',
        priority: 'High',
        description: 'Benefit-led renewal journey for 12-month PS Plus members using scoped surfaces and static tier-based messaging.',
        icon: 'utility:shield',
        theme: 'green',
    },
    {
        id: 'wishlist',
        rank: 2,
        opportunity: 'Wolverine Wishlist-to-Purchase',
        valueAtStake: '$39M conversion',
        confidence: 'High',
        owner: 'PS Store / Commerce',
        recommendedDecision: 'Approve wishlist pilot',
        priority: 'High',
        description: 'Convert declared wishlist intent into a PS5 Store or email activation that drives Wolverine preorder or purchase.',
        icon: 'utility:cart',
        theme: 'blue',
    },
    {
        id: 'controller',
        rank: 3,
        opportunity: 'Proactive Controller Health Outreach',
        valueAtStake: '$28M CX savings',
        confidence: 'High',
        owner: 'CX / Service',
        recommendedDecision: 'Approve proactive care',
        priority: 'High',
        description: 'Use controller telemetry, warranty status, and player context to trigger a proactive service case and replacement order.',
        icon: 'utility:heart',
        theme: 'orange',
    },
    {
        id: 'spiderman',
        rank: 4,
        opportunity: 'Spider-Man IP Commerce Expansion',
        valueAtStake: '$22M revenue',
        confidence: 'Medium',
        owner: 'Retail / Commerce',
        recommendedDecision: 'Expand IP commerce',
        priority: 'Medium',
        description: 'Turn high-affinity gameplay moments into contextual IP merchandise and commerce experiences.',
        icon: 'utility:cart',
        theme: 'gold',
    },
    {
        id: 'slack',
        rank: 5,
        opportunity: 'Slack Command Center for Lifecycle Operations',
        valueAtStake: '$12M productivity',
        confidence: 'Medium',
        owner: 'Operations',
        recommendedDecision: 'Enable Slack Enterprise AI',
        priority: 'Medium',
        description: 'Give operators, agents, and executives a shared command center for lifecycle opportunities and next best actions.',
        icon: 'utility:broadcast',
        theme: 'teal',
    },
    {
        id: 'oms',
        rank: 6,
        opportunity: 'OMS-Enabled Replacement & Fulfillment',
        valueAtStake: '$23M NRR',
        confidence: 'Medium',
        owner: 'OMS / Fulfillment',
        recommendedDecision: 'Validate OMS path',
        priority: 'Medium',
        description: 'Connect proactive service, replacement orders, order visibility, and fulfillment workflows through OMS.',
        icon: 'utility:orders',
        theme: 'purple',
    },
];

function enrichRow(row) {
    const t = ICON_THEMES[row.theme] || ICON_THEMES.blue;
    const rankIdx = row.rank - 1;
    const rankColor = RANK_COLORS[rankIdx] || '#706e6b';
    return {
        ...row,
        iconBgStyle:      `background:${t.bg};`,
        iconColorStyle:   '--sds-c-icon-color-foreground-default:#ffffff;--sds-c-icon-color-foreground:#ffffff;',
        rankCircleStyle:  `background:${rankColor};`,
        rankAriaLabel:    `Rank ${row.rank}`,
        priorityClass:    PRIORITY_CLASS[(row.priority || '').toLowerCase()] || 'rao-priority rao-priority_medium',
        confClass:        CONF_CLASS[(row.confidence || '').toLowerCase()] || 'rao-conf rao-conf_medium',
        rowClass:         rankIdx < 3 ? 'rao-row rao-row_top' : 'rao-row',
        decisionAriaLabel: `Decision for ${row.opportunity}: ${row.recommendedDecision}`,
    };
}

export default class RankedAgenticOpportunities extends LightningElement {
    @api sectionTitle    = DEFAULT_TITLE;
    @api opportunityJson = '';
    @api maxRows         = DEFAULT_MAX;
    @api variant         = 'summary';

    get isSummary() { return this.variant !== 'detail'; }
    get isDetail()  { return this.variant === 'detail'; }

    get resolvedTitle() {
        return this.sectionTitle || DEFAULT_TITLE;
    }

    get resolvedRows() {
        let rows = DEFAULT_ROWS;
        if (this.opportunityJson) {
            try {
                const parsed = JSON.parse(this.opportunityJson);
                if (Array.isArray(parsed) && parsed.length > 0) rows = parsed;
            } catch (e) { /* fall through */ }
        }
        const max = parseInt(this.maxRows, 10) || DEFAULT_MAX;
        return rows.slice(0, max);
    }

    get enrichedRows() {
        return this.resolvedRows.map(enrichRow);
    }

    get rowCount() {
        return this.enrichedRows.length;
    }

    get totalCount() {
        return this.resolvedRows.length;
    }

    get summaryRows() {
        return this.resolvedRows.slice(0, 3).map(enrichRow);
    }

    handleRowClick(evt) {
        const id = evt.currentTarget.dataset.id;
        const row = this.resolvedRows.find(r => r.id === id);
        this.dispatchEvent(new CustomEvent('opportunityselect', {
            detail: row || { id },
            bubbles: true,
            composed: true,
        }));
    }

    handleDecisionClick(evt) {
        evt.stopPropagation();
        const id = evt.currentTarget.dataset.id;
        const row = this.resolvedRows.find(r => r.id === id);
        this.dispatchEvent(new CustomEvent('decisionselect', {
            detail: row || { id },
            bubbles: true,
            composed: true,
        }));
    }
}
