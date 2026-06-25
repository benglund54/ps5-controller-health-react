import { LightningElement, api } from 'lwc';

const DEFAULT_TITLE = 'Lifecycle Health';

// Status → visual theme
const STATUS_THEME = {
    'healthy':   { bg: '#e8f5e9', border: '#a5d6a7', icon: '#2e7d32', badge: 'lhm-badge lhm-badge_green',  card: 'lhm-stage' },
    'growth':    { bg: '#e8f5e9', border: '#a5d6a7', icon: '#2e7d32', badge: 'lhm-badge lhm-badge_green',  card: 'lhm-stage' },
    'at risk':   { bg: '#fff8e6', border: '#f5d46a', icon: '#9a6c00', badge: 'lhm-badge lhm-badge_gold',   card: 'lhm-stage lhm-stage_risk' },
    'watchlist': { bg: '#fdecea', border: '#f5c6c2', icon: '#c62828', badge: 'lhm-badge lhm-badge_red',    card: 'lhm-stage lhm-stage_watch' },
    'stable':    { bg: '#e3f2fd', border: '#90caf9', icon: '#1565c0', badge: 'lhm-badge lhm-badge_blue',   card: 'lhm-stage' },
    'low':       { bg: '#f3f3f3', border: '#d8dde6', icon: '#706e6b', badge: 'lhm-badge lhm-badge_neutral',card: 'lhm-stage' },
};

const DEFAULT_STAGES = [
    {
        id: 'activation',
        name: 'Activation',
        status: 'Stable',
        trend: 'steady',
        opportunityCount: '2.1M new accounts',
        owner: 'PSN / Platform',
        recommendedAction: 'Guide onboarding to first-value moments',
        icon: 'utility:play',
    },
    {
        id: 'engagement',
        name: 'Engagement',
        status: 'Growth',
        trend: 'up',
        opportunityCount: '18.4M active players',
        owner: 'PSN / Marketing',
        recommendedAction: 'Surface personalized game and content discovery',
        icon: 'utility:graph',
    },
    {
        id: 'subscription',
        name: 'Subscription Value',
        status: 'At Risk',
        trend: 'down',
        opportunityCount: '12-month members in renewal window',
        owner: 'PSN / Subscriptions',
        recommendedAction: 'Run benefit-led PS Plus renewal value journey',
        icon: 'utility:shield',
    },
    {
        id: 'commerce',
        name: 'Commerce',
        status: 'Growth',
        trend: 'up',
        opportunityCount: '4.5M wishlist / preorder intent',
        owner: 'PS Store / Commerce',
        recommendedAction: 'Convert Wolverine wishlist and expand Spider-Man IP commerce',
        icon: 'utility:cart',
    },
    {
        id: 'care',
        name: 'Care',
        status: 'Watchlist',
        trend: 'risk',
        opportunityCount: '1.5M controller signals',
        owner: 'CX / Service',
        recommendedAction: 'Trigger proactive care and warranty replacement before cases open',
        icon: 'utility:heart',
    },
    {
        id: 'retention',
        name: 'Retention',
        status: 'Stable',
        trend: 'steady',
        opportunityCount: '6.2M renewal opportunities',
        owner: 'PSN / Subscriptions',
        recommendedAction: 'Orchestrate renewal journeys 60 days out',
        icon: 'utility:broadcast',
    },
    {
        id: 'winback',
        name: 'Win Back',
        status: 'Low',
        trend: 'low',
        opportunityCount: '890K lapsed players',
        owner: 'Marketing',
        recommendedAction: 'Re-engage lapsed players with targeted offers',
        icon: 'utility:target',
    },
];

function themeForStatus(status) {
    const key = (status || '').toLowerCase();
    return STATUS_THEME[key] || STATUS_THEME['stable'];
}

function enrichStage(stage) {
    const t = themeForStatus(stage.status);
    return {
        ...stage,
        iconBgStyle:    `background:${t.bg};border:1px solid ${t.border};`,
        iconColorStyle: `--sds-c-icon-color-foreground-default:${t.icon};`,
        statusClass:    t.badge,
        cardClass:      t.card,
        ariaLabel:      `${stage.name}: ${stage.status}. ${stage.opportunityCount}. Owner: ${stage.owner}.`,
    };
}

export default class LifecycleHealthMap extends LightningElement {
    @api sectionTitle  = DEFAULT_TITLE;
    @api lifecycleJson = '';

    get resolvedTitle() {
        return this.sectionTitle || DEFAULT_TITLE;
    }

    get resolvedStages() {
        if (this.lifecycleJson) {
            try {
                const parsed = JSON.parse(this.lifecycleJson);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch (e) { /* fall through */ }
        }
        return DEFAULT_STAGES;
    }

    get enrichedStages() {
        return this.resolvedStages.map(enrichStage);
    }

    get stageCount() {
        return this.enrichedStages.length;
    }

    handleStageClick(evt) {
        const id = evt.currentTarget.dataset.id;
        const stage = this.resolvedStages.find(s => s.id === id);
        this.dispatchEvent(new CustomEvent('stageselect', {
            detail: stage || { id },
            bubbles: true,
            composed: true,
        }));
    }
}
