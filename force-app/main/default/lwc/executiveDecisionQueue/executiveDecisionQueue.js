import { LightningElement, api } from 'lwc';

const DEFAULT_TITLE = 'Recommended Executive Decisions';

const RANK_COLORS = ['#2e7d32', '#1565c0', '#e65100', '#7b5ea7', '#9a6c00'];

const STATUS_BADGE = {
    'ready for approval':        'edq-status edq-status_ready',
    'needs data owner':          'edq-status edq-status_needs',
    'needs architecture alignment': 'edq-status edq-status_needs',
    'needs business owner':      'edq-status edq-status_needs',
    'needs executive sponsor':   'edq-status edq-status_sponsor',
};

const CTA_STYLE = {
    'ready for approval':        'edq-cta edq-cta_primary',
    'needs data owner':          'edq-cta edq-cta_secondary',
    'needs architecture alignment': 'edq-cta edq-cta_secondary',
    'needs business owner':      'edq-cta edq-cta_secondary',
    'needs executive sponsor':   'edq-cta edq-cta_secondary',
};

const DEFAULT_DECISIONS = [
    {
        id: 'renewal-pilot',
        rank: 1,
        title: 'Approve PS Plus Renewal Value Pilot',
        whyItMatters: 'Launch a benefit-led renewal journey for eligible 12-month PS Plus members.',
        owner: 'PSN / Subscriptions',
        ask: 'Approve the POC scope, surfaces, measurement approach, and owner.',
        expectedOutcome: 'Renewal lift, improved Premium value perception, and cleaner lifecycle measurement.',
        status: 'Ready for Approval',
        ctaLabel: 'Approve Pilot',
    },
    {
        id: 'wishlist-pilot',
        rank: 2,
        title: 'Approve Wolverine Wishlist-to-Purchase Pilot',
        whyItMatters: 'Use Wolverine wishlist as a declared intent signal and activate through email or PS5 Store banner.',
        owner: 'PS Store / Commerce',
        ask: 'Approve wishlist journey, default message, channel scope, and holdout.',
        expectedOutcome: 'Higher wishlist-to-purchase conversion and incremental revenue.',
        status: 'Ready for Approval',
        ctaLabel: 'Approve Pilot',
    },
    {
        id: 'controller-health',
        rank: 3,
        title: 'Prioritize Proactive Controller Health Use Case',
        whyItMatters: 'Use controller telemetry, warranty status, and player context to recommend a free replacement for eligible players.',
        owner: 'CX / Service',
        ask: 'Approve CX treatment, warranty fulfillment path, and Service Cloud case workflow.',
        expectedOutcome: 'Reduced inbound contacts, faster resolution, improved CSAT, and better hardware trust.',
        status: 'Ready for Approval',
        ctaLabel: 'Approve Care Plan',
    },
    {
        id: 'oms-path',
        rank: 4,
        title: 'Validate OMS Path for Replacement and Upgrade Flows',
        whyItMatters: 'Confirm OMS architecture for controller replacements, accessories, and IP merchandise orders.',
        owner: 'OMS / Fulfillment + IT / Data',
        ask: 'Confirm OMS path, order visibility, fulfillment status, and Service Cloud integration.',
        expectedOutcome: 'Faster replacement resolution, better order visibility, and scalable fulfillment operations.',
        status: 'Needs Architecture Alignment',
        ctaLabel: 'Validate OMS Path',
    },
    {
        id: 'slack-ai',
        rank: 5,
        title: 'Enable Slack Enterprise AI',
        whyItMatters: 'Unlock Slack command center, AI briefing, and operator coordination for lifecycle operations.',
        owner: 'Operations + IT / Data',
        ask: 'Confirm Slack Enterprise AI licensing and executive sponsorship under the current SELA.',
        expectedOutcome: 'Faster operator coordination, fewer status meetings, and faster decisions.',
        status: 'Needs Executive Sponsor',
        ctaLabel: 'Review Slack AI Path',
    },
];

function statusClass(status) {
    const key = (status || '').toLowerCase();
    return STATUS_BADGE[key] || 'edq-status edq-status_needs';
}

function ctaClass(status) {
    const key = (status || '').toLowerCase();
    return CTA_STYLE[key] || 'edq-cta edq-cta_secondary';
}

const READY_STATUSES = new Set(['ready for approval']);

function enrichDecision(decision, idx) {
    const color = RANK_COLORS[idx] || '#706e6b';
    const isReady = READY_STATUSES.has((decision.status || '').toLowerCase());
    return {
        ...decision,
        numBgStyle:     `background:${color};`,
        statusClass:    statusClass(decision.status),
        ctaClass:       ctaClass(decision.status),
        cardClass:      idx === 0 ? 'edq-decision edq-decision_first' : 'edq-decision',
        summaryRowClass: isReady ? 'edq-summary-row edq-summary-row_ready' : 'edq-summary-row',
        ctaAriaLabel:   `${decision.ctaLabel}: ${decision.title}`,
    };
}

export default class ExecutiveDecisionQueue extends LightningElement {
    @api sectionTitle = DEFAULT_TITLE;
    @api decisionJson = '';
    @api variant      = 'summary';

    get isSummary() { return this.variant !== 'detail'; }
    get isDetail()  { return this.variant === 'detail'; }

    get resolvedTitle() {
        return this.sectionTitle || DEFAULT_TITLE;
    }

    get resolvedDecisions() {
        if (this.decisionJson) {
            try {
                const parsed = JSON.parse(this.decisionJson);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch (e) { /* fall through */ }
        }
        return DEFAULT_DECISIONS;
    }

    get enrichedDecisions() {
        return this.resolvedDecisions.map(enrichDecision);
    }

    get pendingCount() {
        return this.enrichedDecisions.length;
    }

    handleDecisionSelect(evt) {
        const id = evt.currentTarget.dataset.id;
        const decision = this.resolvedDecisions.find(d => d.id === id);
        this.dispatchEvent(new CustomEvent('decisionselect', {
            detail: decision || { id },
            bubbles: true,
            composed: true,
        }));
    }

    handleDecisionAction(evt) {
        evt.stopPropagation();
        const id = evt.currentTarget.dataset.id;
        const decision = this.resolvedDecisions.find(d => d.id === id);
        this.dispatchEvent(new CustomEvent('decisionaction', {
            detail: decision || { id },
            bubbles: true,
            composed: true,
        }));
    }
}
