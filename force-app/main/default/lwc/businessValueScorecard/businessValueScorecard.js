import { LightningElement, api } from 'lwc';

const DEFAULT_TITLE = 'Business Value Scorecard';

// Dark icon tiles — white glyph on colored square
const METRIC_THEMES = {
    purple: { accent: '#2F6DB4', bg: '#2F6DB4' },
    blue:   { accent: '#2F6DB4', bg: '#2F6DB4' },
    green:  { accent: '#00AB9F', bg: '#00AB9F' },
    orange: { accent: '#F3C43A', bg: '#F3C43A' },
    teal:   { accent: '#00AB9F', bg: '#00AB9F' },
    gold:   { accent: '#F3C43A', bg: '#F3C43A' },
    slate:  { accent: '#000000', bg: '#000000' },
    red:    { accent: '#DE0024', bg: '#DE0024' },
};

const CONF_BADGE = {
    'high':   'bvs-conf bvs-conf_high',
    'medium': 'bvs-conf bvs-conf_medium',
    'low':    'bvs-conf bvs-conf_low',
};

const DEFAULT_METRICS = [
    {
        id: 'renewal',
        outcomeName: 'PS Plus Renewal Value Journey',
        opportunity: '12-month members in renewal window',
        expectedImpact: '+2–4 pts renewal lift',
        confidence: 'High',
        owner: 'PSN / Subscriptions',
        icon: 'utility:shield',
        theme: 'purple',
    },
    {
        id: 'wishlist',
        outcomeName: 'Wolverine Wishlist Conversion',
        opportunity: '4.5M declared-intent wishlisters',
        expectedImpact: '+3–6% wishlist conversion',
        confidence: 'High',
        owner: 'PS Store / Commerce',
        icon: 'utility:cart',
        theme: 'blue',
    },
    {
        id: 'streaming',
        outcomeName: 'Premium Streaming Adoption',
        opportunity: 'Premium members underusing cloud streaming',
        expectedImpact: '+8–12% adoption lift',
        confidence: 'High',
        owner: 'PSN / Subscriptions',
        icon: 'utility:desktop_console',
        theme: 'teal',
    },
    {
        id: 'deflection',
        outcomeName: 'Controller Health Deflection',
        opportunity: '1.5M controller signal players',
        expectedImpact: '15–25% reduction in inbound contacts',
        confidence: 'Medium',
        owner: 'CX / Service',
        icon: 'utility:heart',
        theme: 'orange',
    },
    {
        id: 'fulfillment',
        outcomeName: 'OMS Fulfillment Speed',
        opportunity: 'OMS-enabled replacement path',
        expectedImpact: '30–40% faster replacement resolution',
        confidence: 'Medium',
        owner: 'OMS / Fulfillment',
        icon: 'utility:orders',
        theme: 'gold',
    },
    {
        id: 'productivity',
        outcomeName: 'Slack Operator Productivity',
        opportunity: 'Lifecycle command center operations',
        expectedImpact: '14–15 hours saved per week',
        confidence: 'Medium',
        owner: 'Operations',
        icon: 'utility:announcement',
        theme: 'slate',
    },
];

function themeStyles(themeKey) {
    const t = METRIC_THEMES[themeKey] || METRIC_THEMES.slate;
    return {
        accentStyle:    `background:${t.accent};`,
        iconBgStyle:    `background:${t.bg};`,
        iconColorStyle: '--sds-c-icon-color-foreground-default:#ffffff;--sds-c-icon-color-foreground:#ffffff;',
    };
}

function confClass(conf) {
    const key = (conf || '').toLowerCase();
    return CONF_BADGE[key] || CONF_BADGE['medium'];
}

function enrichMetric(metric) {
    const { accentStyle, iconBgStyle, iconColorStyle } = themeStyles(metric.theme);
    return {
        ...metric,
        accentStyle,
        iconBgStyle,
        iconColorStyle,
        confClass: confClass(metric.confidence),
    };
}

const SUMMARY_CARDS = [
    {
        id: 'srenewal',
        value: '$74M',
        label: 'Renewal Value',
        explanation: 'Benefit-led renewal journey for 12-month PS Plus members',
        owner: 'PSN / Subscriptions',
        theme: 'purple',
    },
    {
        id: 'swishlist',
        value: '$39M',
        label: 'Wishlist Conversion',
        explanation: 'Wolverine wishlist intent activated to preorder or purchase',
        owner: 'PS Store / Commerce',
        theme: 'blue',
    },
    {
        id: 'sdeflect',
        value: '15–25%',
        label: 'Controller Deflection',
        explanation: 'Proactive controller care prevents inbound contacts before they open',
        owner: 'CX / Service',
        theme: 'orange',
    },
    {
        id: 'sfulfill',
        value: '30–40%',
        label: 'Faster Fulfillment',
        explanation: 'OMS-enabled warranty replacement and upgrade resolution time',
        owner: 'OMS / Fulfillment',
        theme: 'gold',
    },
];

function enrichSummaryCard(card) {
    const t = METRIC_THEMES[card.theme] || METRIC_THEMES.slate;
    return {
        ...card,
        accentStyle:  `background:${t.accent};`,
        iconBgStyle:  `background:${t.bg};`,
        valueStyle:   `color:${t.accent};`,
    };
}

export default class BusinessValueScorecard extends LightningElement {
    @api sectionTitle  = DEFAULT_TITLE;
    @api scorecardJson = '';
    @api variant       = 'summary';

    get isSummary() { return this.variant !== 'detail'; }
    get isDetail()  { return this.variant === 'detail'; }
    get summaryCards() { return SUMMARY_CARDS.map(enrichSummaryCard); }

    get resolvedTitle() {
        return this.sectionTitle || DEFAULT_TITLE;
    }

    get resolvedMetrics() {
        if (this.scorecardJson) {
            try {
                const parsed = JSON.parse(this.scorecardJson);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch (e) { /* fall through */ }
        }
        return DEFAULT_METRICS;
    }

    get enrichedMetrics() {
        return this.resolvedMetrics.map(enrichMetric);
    }
}
