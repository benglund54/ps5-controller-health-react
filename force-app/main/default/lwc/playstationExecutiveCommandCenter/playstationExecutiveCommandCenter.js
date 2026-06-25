import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import psLogoUrl from '@salesforce/resourceUrl/playstationLogo';

const DEFAULT_TITLE      = 'PlayStation Agentic Lifecycle Command Center';
const DEFAULT_SUBTITLE   = 'Turning player signals into trusted actions, measurable outcomes, and executive decisions.';
const DEFAULT_CONTEXT    = 'Sony QBR | July 7 London';
const DEFAULT_METADATA   = 'Executive View \u2022 Last Refreshed: Today';
const DEFAULT_BADGES_CSV = 'Data Cloud,Agentforce,Tableau,Slack,Service Cloud,OMS';
const DEFAULT_PANEL      = 'opportunities';

// PlayStation primary palette
const PS_BLUE   = '#2F6DB4';
const PS_TEAL   = '#00AB9F';
const PS_YELLOW = '#F3C43A';
const PS_RED    = '#DE0024';
const PS_BLACK  = '#000000';

// Badge icon + accent color per capability
// Tableau gold — #ECBD37 for border/accent/icon-tile; #8A6500 for pill fill (white text legible)
const TABLEAU_GOLD = '#ECBD37';
const TABLEAU_DARK = '#8A6500';

const BADGE_THEME_MAP = {
    'data cloud':      { icon: 'utility:data_cloud',  bg: PS_BLUE,       iconTile: PS_BLUE       },
    'agentforce':      { icon: 'utility:agent_astro', bg: PS_TEAL,       iconTile: PS_TEAL       },
    // Keep 'tableau / pulse' as alias — covers any Lightning page still storing the old CSV value
    'tableau':         { icon: 'utility:tableau', bg: TABLEAU_GOLD, iconTile: TABLEAU_GOLD, pillBg: TABLEAU_DARK, textColor: '#ffffff' },
    'tableau / pulse': { icon: 'utility:tableau', bg: TABLEAU_GOLD, iconTile: TABLEAU_GOLD, pillBg: TABLEAU_DARK, textColor: '#ffffff' },
    'slack':           { icon: 'utility:slack',       bg: PS_RED,        iconTile: PS_RED        },
    'service cloud':   { icon: 'utility:heart',       bg: PS_BLUE,       iconTile: PS_BLUE       },
    'oms':             { icon: 'utility:orders',      bg: PS_TEAL,       iconTile: PS_TEAL       },
};

// Per-card trend text color on dark background
const KPI_TREND_COLORS = {
    players:       PS_TEAL,
    opportunities: PS_TEAL,
    value:         PS_YELLOW,
    decisions:     PS_RED,
    readiness:     PS_BLUE,
};

// KPI card icon backgrounds + subtle card tint — PS palette
const KPI_THEMES = {
    players:       { bg: PS_BLUE,   accent: PS_BLUE,   tintClass: 'pecc-kpi_blue'   },
    opportunities: { bg: PS_TEAL,   accent: PS_TEAL,   tintClass: 'pecc-kpi_teal'   },
    value:         { bg: PS_BLACK,  accent: PS_YELLOW,  tintClass: 'pecc-kpi_yellow' },
    decisions:     { bg: PS_RED,    accent: PS_RED,    tintClass: 'pecc-kpi_red'    },
    readiness:     { bg: PS_BLUE,   accent: PS_BLUE,   tintClass: 'pecc-kpi_blue'   },
};

const DEFAULT_KPIS = [
    {
        id: 'players', label: 'Players Analyzed', value: '124.8M',
        trend: '+12% coverage', desc: 'Unified player population available for lifecycle intelligence.',
        icon: 'utility:groups', isTopValue: false,
    },
    {
        id: 'opportunities', label: 'Agentic Opportunities', value: '8.7M',
        trend: '8.7M ranked', desc: 'Players with a ranked recommendation ready for action.',
        icon: 'utility:agent_astro', isTopValue: false,
    },
    {
        id: 'value', label: 'Value at Stake', value: '$186M',
        trend: '$186M modeled', desc: 'Modeled retention, adoption, service, and commerce impact.',
        icon: 'utility:trending', isTopValue: true,
    },
    {
        id: 'decisions', label: 'High-Priority Decisions', value: '5',
        trend: '5 pending', desc: 'Executive decisions required to move from insight to action.',
        icon: 'utility:approval', isTopValue: false,
    },
    {
        id: 'readiness', label: 'AI / Data Readiness', value: '68%',
        trend: '68% ready', desc: 'Current readiness across data, identity, AI, and orchestration.',
        icon: 'utility:data_cloud', isTopValue: false,
    },
];

// Lifecycle dot colors — PlayStation palette
const STATUS_STYLES = {
    'stable':    { dot: PS_BLUE,   badgeClass: 'pecc-status pecc-status_stable'    },
    'growth':    { dot: PS_TEAL,   badgeClass: 'pecc-status pecc-status_growth'    },
    'at risk':   { dot: PS_YELLOW, badgeClass: 'pecc-status pecc-status_risk'      },
    'watchlist': { dot: PS_RED,    badgeClass: 'pecc-status pecc-status_watchlist' },
    'low':       { dot: '#6B7280', badgeClass: 'pecc-status pecc-status_low'       },
};

const DEFAULT_LIFECYCLE = [
    {
        id: 'activation', label: 'Activation', status: 'Stable',
        description: 'Player onboarding and first-value moments.',
        detail: { count: '2.1M new accounts', owner: 'PSN / Platform', action: 'Guide onboarding to first-value moments' },
    },
    {
        id: 'engagement', label: 'Engagement', status: 'Growth',
        description: 'Streaming, gameplay, content affinity, and player behavior signals.',
        detail: { count: '18.4M active players', owner: 'PSN / Marketing', action: 'Surface personalized game and content discovery' },
    },
    {
        id: 'subscription', label: 'Subscription Value', status: 'At Risk',
        description: 'PS Plus tier value, renewal readiness, benefit adoption, and Premium streaming.',
        detail: { count: '12-month members in renewal window', owner: 'PSN / Subscriptions', action: 'Run benefit-led PS Plus renewal value journey' },
    },
    {
        id: 'commerce', label: 'Commerce', status: 'Growth',
        description: 'Wishlist, preorder, IP merchandise, wallet, and purchase intent.',
        detail: { count: '4.5M wishlist / preorder intent', owner: 'PS Store / Commerce', action: 'Convert Wolverine wishlist and expand Spider-Man IP commerce' },
    },
    {
        id: 'care', label: 'Care', status: 'Watchlist',
        description: 'Controller telemetry, warranty eligibility, proactive support, and Service Cloud case creation.',
        detail: { count: '1.5M controller signals', owner: 'CX / Service', action: 'Trigger proactive care and warranty replacement before cases open' },
    },
    {
        id: 'retention', label: 'Retention', status: 'Stable',
        description: 'Renewal risk, churn prevention, lifecycle orchestration, and benefit-led messaging.',
        detail: { count: '6.2M renewal opportunities', owner: 'PSN / Subscriptions', action: 'Orchestrate renewal journeys 60 days out' },
    },
    {
        id: 'winback', label: 'Win Back', status: 'Low',
        description: 'Lapsed player recovery and targeted re-engagement.',
        detail: { count: '890K lapsed players', owner: 'Marketing', action: 'Re-engage lapsed players with targeted offers' },
    },
];

const SEGMENTS_LIST_TARGET_URL = '/lightning/o/MarketSegment/list?filterName=All_MarketSegments';

const LIFECYCLE_SUGGESTED_TARGETS = {
    activation: {
        suggestedTargetLabel: 'New Accounts / First Session Streaming Prompt',
        suggestedTargetType: 'Data Cloud Segment or Calculated Insight',
        suggestedTargetDescription: 'New PlayStation accounts that have not completed first-session streaming or onboarding prompts.',
        futureSegmentName: 'PS New Accounts - First Session Streaming Prompt',
        targetUrl: SEGMENTS_LIST_TARGET_URL,
    },
    engagement: {
        suggestedTargetLabel: 'Active / High-Engagement Players',
        suggestedTargetType: 'Data Cloud Segment or Data Explorer View',
        suggestedTargetDescription: 'Active players with recent gameplay, title affinity, and strong engagement signals.',
        futureSegmentName: 'PS Active High Engagement Players',
        targetUrl: SEGMENTS_LIST_TARGET_URL,
    },
    subscription: {
        suggestedTargetLabel: 'PS Plus 12-Month Members in Renewal Window',
        suggestedTargetType: 'Data Cloud Segment',
        suggestedTargetDescription: '12-month PS Plus members approaching renewal, scored for benefit adoption and Premium streaming value.',
        futureSegmentName: 'PS Plus 12-Month Members - Renewal Window',
        targetUrl: SEGMENTS_LIST_TARGET_URL,
    },
    commerce: {
        suggestedTargetLabel: 'Wolverine Wishlist & IP Commerce Cohort',
        suggestedTargetType: 'Data Cloud Segment or Calculated Insight',
        suggestedTargetDescription: 'Players with declared Wolverine wishlist intent or high-affinity Spider-Man / Miles Morales IP commerce signals.',
        futureSegmentName: 'PS Wishlist - Wolverine & IP Commerce Cohort',
        targetUrl: SEGMENTS_LIST_TARGET_URL,
    },
    care: {
        suggestedTargetLabel: 'Controller Health & Warranty Watchlist',
        suggestedTargetType: 'Service Console Queue or Data Cloud Segment',
        suggestedTargetDescription: 'Players with controller telemetry signals and active warranty eligibility for proactive care and replacement.',
        futureSegmentName: 'PS Controller Health & Warranty Watchlist',
        targetUrl: SEGMENTS_LIST_TARGET_URL,
    },
    retention: {
        suggestedTargetLabel: 'Renewal Opportunities 60 Days Out',
        suggestedTargetType: 'Data Cloud Segment or Marketing Cloud Journey Audience',
        suggestedTargetDescription: 'Players approaching renewal with churn risk, engagement changes, or underused subscription benefits.',
        futureSegmentName: 'PS Renewal Opportunities - 60 Days Out',
        targetUrl: SEGMENTS_LIST_TARGET_URL,
    },
    winback: {
        suggestedTargetLabel: 'Lapsed Player Re-Engagement Audience',
        suggestedTargetType: 'Data Cloud Segment or Marketing Cloud Journey Audience',
        suggestedTargetDescription: 'Lapsed players eligible for win-back messaging, trial offers, or reactivation campaigns.',
        futureSegmentName: 'PS Lapsed Player Re-Engagement Audience',
        targetUrl: SEGMENTS_LIST_TARGET_URL,
    },
};

const DEFAULT_READINESS = [
    { id: 'identity',  label: 'Player identity',                      shortLabel: 'Player ID',   pct: 82, status: 'Strong'                   },
    { id: 'streams',   label: 'Data Cloud streams',                   shortLabel: 'Data Cloud',  pct: 74, status: 'In progress'              },
    { id: 'zerocopy',  label: 'Zero-copy / Snowflake',                shortLabel: 'Snowflake',   pct: 66, status: 'Needs alignment'          },
    { id: 'mapping',   label: 'Data model mapping',                   shortLabel: 'Data Model',  pct: 71, status: 'In progress'              },
    { id: 'graphs',    label: 'Data Graphs',                          shortLabel: 'Data Graphs', pct: 59, status: 'Needs buildout'           },
    { id: 'knowledge', label: 'Knowledge grounding',                  shortLabel: 'Knowledge',   pct: 62, status: 'Needs content owners'     },
    { id: 'oms',       label: 'OMS / fulfillment',                    shortLabel: 'OMS',         pct: 49, status: 'Needs arch path'          },
    { id: 'slack',     label: 'Slack Enterprise AI',                  shortLabel: 'Slack AI',    pct: 42, status: 'Needs sponsor'            },
];

// Target Cohort Funnel — fat centered bars with inline text
const FUNNEL_STAGES = [
    { id:'f1', label:'All Active Players',   count:'124.8M', wrapStyle:`width:100%;background:${PS_BLUE};`,   textStyle:'color:#ffffff;' },
    { id:'f2', label:'PS Plus Subscribers',  count:'58.2M',  wrapStyle:`width:78%;background:${PS_BLUE};`,    textStyle:'color:#ffffff;' },
    { id:'f3', label:'Premium Subscribers',  count:'19.8M',  wrapStyle:`width:57%;background:${PS_TEAL};`,    textStyle:'color:#ffffff;' },
    { id:'f4', label:'High Engagement',      count:'12.4M',  wrapStyle:`width:44%;background:${PS_TEAL};`,    textStyle:'color:#ffffff;' },
    { id:'f5', label:'Low Cloud Streaming',  count:'4.3M',   wrapStyle:`width:32%;background:${PS_YELLOW};`,  textStyle:'color:#181818;' },
    { id:'f6', label:'Actionable Cohort',    count:'2.1M',   wrapStyle:`width:22%;background:${PS_RED};`,     textStyle:'color:#ffffff;' },
];

// Radar chart legend items — kept for backward compat but legend is now rendered inside SVG as text labels
const RADAR_LEGEND = [
    { id:'sub',        label:'Sub. Signals',  pct:'92%', icon:'utility:data_cloud'          },
    { id:'game',       label:'Gameplay',       pct:'84%', icon:'utility:activity'            },
    { id:'mktg',       label:'Marketing',      pct:'77%', icon:'utility:announcement'        },
    { id:'commerce',   label:'Commerce',       pct:'71%', icon:'utility:orders'              },
    { id:'service',    label:'Service',         pct:'68%', icon:'utility:service_appointment' },
    { id:'controller', label:'Controller',      pct:'54%', icon:'utility:broadcast'           },
    { id:'oms',        label:'OMS',            pct:'49%', icon:'utility:package'             },
];

// Radar axis tooltip data — displayed on dot hover/focus
const RADAR_POINTS_DATA = [
    { id:'sub',        label:'Subscription Signals',  pct:'92%', color:'#2F6DB4',
      meaning:'PS Plus tier, renewal, entitlement, and plan usage signals are highly available.',
      source:'PSN subscription systems / Data Cloud',
      implication:'Ready for subscription value and retention use cases.' },
    { id:'game',       label:'Gameplay Signals',       pct:'84%', color:'#2F6DB4',
      meaning:'Playtime, title affinity, session recency, and content engagement are well covered.',
      source:'Gameplay telemetry / engagement data',
      implication:'Ready for personalization and cloud streaming activation.' },
    { id:'mktg',       label:'Marketing Engagement',   pct:'77%', color:'#00AB9F',
      meaning:'Campaign engagement, channel preference, and journey response data are available.',
      source:'Marketing Cloud / engagement systems',
      implication:'Supports journey orchestration and suppression logic.' },
    { id:'commerce',   label:'Commerce Signals',       pct:'71%', color:'#00AB9F',
      meaning:'Purchase, browse, cart, and product affinity signals are partially connected.',
      source:'PlayStation Store / commerce systems',
      implication:'Supports accessory and bundle recommendations.' },
    { id:'service',    label:'Service Signals',         pct:'68%', color:'#DE0024',
      meaning:'Cases, chats, support searches, and CSAT signals are available.',
      source:'Service Cloud / support systems',
      implication:'Supports proactive care and service personalization.' },
    { id:'controller', label:'Controller Telemetry',   pct:'54%', color:'#DE0024',
      meaning:'Device health, drift, disconnect, firmware, and controller usage signals need more alignment.',
      source:'Controller telemetry / Snowflake / device data',
      implication:'Needed for proactive controller health at scale.' },
    { id:'oms',        label:'OMS / Fulfillment',       pct:'49%', color:'#F3C43A',
      meaning:'Replacement, upgrade, and fulfillment visibility requires architecture alignment.',
      source:'OMS / fulfillment systems',
      implication:'Needed to close the loop from recommendation to execution.' },
];

// Bubble map data — coords relative to viewBox 280x210, plot area x=45–265, y=10–165
// X=Readiness(0–100)→x=45+(r/100)*220, Y=Value($0–$80M)→y=165-(v/80)*155, r=size by reach
const BUBBLE_MAP_DATA = [
    { id:'renewal',    label:'PS Plus Renewal Value Journey',          value:'$74M',  readiness:82, players:'12-month members',     owner:'PSN / Subscriptions', action:'Approve renewal value pilot', color:'#2F6DB4', fillRgba:'rgba(47,109,180,0.75)',  borderColor:'#2F6DB4',  cx:225, cy:22,  r:20, labelText:'$74M',  labelFill:'#ffffff' },
    { id:'wishlist',   label:'Wolverine Wishlist-to-Purchase',         value:'$39M',  readiness:70, players:'4.5M wishlisters',     owner:'PS Store / Commerce', action:'Approve wishlist pilot',      color:'#00AB9F', fillRgba:'rgba(0,171,159,0.8)',    borderColor:'#00AB9F',  cx:199, cy:89,  r:15, labelText:'$39M',  labelFill:'#ffffff' },
    { id:'controller', label:'Proactive Controller Health Outreach',   value:'$28M',  readiness:74, players:'1.5M',                 owner:'CX / Service',         action:'Approve proactive care',      color:'#DE0024', fillRgba:'rgba(222,0,36,0.75)',    borderColor:'#DE0024',  cx:208, cy:111, r:11, labelText:'',      labelFill:'#ffffff' },
    { id:'spiderman',  label:'Spider-Man IP Commerce Expansion',       value:'$22M',  readiness:65, players:'High-affinity players',owner:'Retail / Commerce',    action:'Expand IP commerce',          color:'#F3C43A', fillRgba:'rgba(243,196,58,0.85)',  borderColor:'#c9930d',  cx:188, cy:122, r:10, labelText:'',      labelFill:'#7a5400' },
    { id:'oms',        label:'OMS-Enabled Replacement & Fulfillment',  value:'$23M',  readiness:49, players:'Replacement cohort',   owner:'OMS / Fulfillment',    action:'Validate OMS path',           color:'#DE0024', fillRgba:'rgba(222,0,36,0.55)',    borderColor:'#DE0024',  cx:153, cy:120, r:10, labelText:'',      labelFill:'#ffffff' },
];

const READINESS_NEXT_STEPS = [
    { id: 'ns1', text: 'Confirm player and telemetry data access' },
    { id: 'ns2', text: 'Validate Snowflake / zero-copy architecture' },
    { id: 'ns3', text: 'Prioritize PS Plus renewal and Wolverine wishlist POC scope' },
    { id: 'ns4', text: 'Confirm controller warranty, replacement, and OMS fulfillment path' },
    { id: 'ns5', text: 'Align on Slack Enterprise AI decision path' },
    { id: 'ns6', text: 'Define holdout, measurement, and business value reporting' },
    { id: 'ns7', text: 'Confirm owners for PSN, Commerce, CX, OMS, MuleSoft, and Slack' },
];

function parseJsonArray(json, fallback) {
    if (!json) return fallback;
    try {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) { /* fall through */ }
    return fallback;
}

function enrichKpi(kpi, activePanel) {
    const t           = KPI_THEMES[kpi.id] || KPI_THEMES.players;
    const trendColor  = KPI_TREND_COLORS[kpi.id] || PS_TEAL;
    const isActive    = kpi.id === activePanel;
    let cardClass = 'pecc-kpi-card';
    if (t.tintClass)    cardClass += ` ${t.tintClass}`;
    if (isActive)       cardClass += ' pecc-kpi-card_active';
    if (kpi.isTopValue) cardClass += ' pecc-kpi-card_top';
    return {
        ...kpi,
        cardClass,
        isSelected:     isActive,
        iconBgStyle:    `background:${t.bg};`,
        iconColorStyle: '--sds-c-icon-color-foreground-default:#ffffff;--sds-c-icon-color-foreground:#ffffff;',
        accentStyle:    `background:${t.accent};`,
        trendStyle:     `color:${trendColor};`,
        ariaLabel:      `${kpi.label}: ${kpi.value}. ${kpi.desc}`,
    };
}

// Simplified — popover is rendered as a fixed overlay at root level
function enrichStage(stage) {
    const s = STATUS_STYLES[(stage.status || '').toLowerCase()] || STATUS_STYLES.low;
    return {
        ...stage,
        dotClass:         'pecc-dot',
        dotStyle:         `background:${s.dot};`,
        statusBadgeClass: s.badgeClass,
        ariaLabel:        `${stage.label}: ${stage.status}. ${stage.detail.count}`,
    };
}

function enrichReadiness(item) {
    const pct = item.pct || 0;
    // PlayStation color tiers:
    // 75+ Strong  → Teal
    // 65-74 In Progress → Blue
    // 55-64 Needs work → Yellow
    // <55 Critical → Red
    const fillColor = pct >= 75 ? PS_TEAL
                    : pct >= 65 ? PS_BLUE
                    : pct >= 55 ? PS_YELLOW
                    : PS_RED;
    const statusClass = pct >= 75
        ? 'pecc-rcap-status pecc-rcap-status_strong'
        : pct >= 65
        ? 'pecc-rcap-status pecc-rcap-status_progress'
        : 'pecc-rcap-status pecc-rcap-status_needs';
    return {
        ...item,
        fillStyle:    `width:${pct}%;background:${fillColor};`,
        barFillStyle: `height:${pct}%;background:${fillColor};`,
        statusClass,
        shortLabel: item.shortLabel || item.label,
    };
}

const POPOVER_WIDTH   = 248;
const POPOVER_OFFSET_Y = 12;

export default class PlaystationExecutiveCommandCenter extends NavigationMixin(LightningElement) {
    // ── Public API ──
    @api title               = DEFAULT_TITLE;
    @api subtitle            = DEFAULT_SUBTITLE;
    @api contextLabel        = DEFAULT_CONTEXT;
    @api metadataLabel       = DEFAULT_METADATA;
    @api badgeCsv            = DEFAULT_BADGES_CSV;
    @api activePanelDefault  = DEFAULT_PANEL;
    @api kpiJson             = '';
    @api lifecycleJson       = '';
    @api playerBreakdownJson = '';
    @api readinessJson       = '';

    _showBadges = true;
    @api get showBadges() { return this._showBadges; }
    set showBadges(v)     { this._showBadges = v !== false && v !== 'false'; }

    // ── Reactive state ──
    @track _activePanel    = DEFAULT_PANEL;
    @track _popoverStageId = null;
    @track _popoverLeft    = 0;
    @track _popoverTop     = 0;
    _popoverHideTimer      = null;
    _isHoveringPopover     = false;
    @track _bubbleTip      = { visible: false };
    @track _radarTip       = { visible: false };

    connectedCallback() {
        if (this.activePanelDefault) this._activePanel = this.activePanelDefault;
    }

    disconnectedCallback() {
        this._clearPopoverHideTimer();
    }

    // ── Logo ──
    get psLogoUrl() { return psLogoUrl; }

    // ── Header getters ──
    get resolvedTitle()    { return this.title         || DEFAULT_TITLE;    }
    get resolvedSubtitle() { return this.subtitle      || DEFAULT_SUBTITLE; }
    get resolvedContext()  { return this.contextLabel  || DEFAULT_CONTEXT;  }
    get resolvedMetadata() { return this.metadataLabel || DEFAULT_METADATA; }

    get resolvedBadges() {
        const csv = this.badgeCsv || DEFAULT_BADGES_CSV;
        return csv.split(',').map((b, i) => {
            // Normalize legacy "Tableau / Pulse" label to "Tableau" regardless of page config
            const raw       = b.trim();
            const label     = raw.toLowerCase() === 'tableau / pulse' ? 'Tableau' : raw;
            const theme     = BADGE_THEME_MAP[label.toLowerCase()];
            const bg        = theme ? theme.bg                        : '#5C5C5C';
            const iconTile  = theme ? (theme.iconTile  || theme.bg)   : '#5C5C5C';
            const icon      = theme ? theme.icon                      : 'utility:check';
            // pillBg/textColor allow per-badge full background overrides (e.g. Tableau yellow)
            const pillBg    = theme ? (theme.pillBg    || null)        : null;
            const textColor = theme ? (theme.textColor || '#ffffff')   : '#ffffff';
            const bgStyle   = pillBg ? `background:${pillBg};` : '';
            return {
                id:            `badge-${i}`,
                label,
                icon,
                iconTileStyle: `background:${iconTile};`,
                badgeStyle:    `border-color:${bg};color:${textColor};${bgStyle}`,
            };
        });
    }

    // ── KPI getters ──
    get resolvedActivePanel() {
        return this._activePanel || this.activePanelDefault || DEFAULT_PANEL;
    }

    get enrichedKpis() {
        return parseJsonArray(this.kpiJson, DEFAULT_KPIS).map(k => enrichKpi(k, this.resolvedActivePanel));
    }

    // ── Lifecycle getters ──
    get enrichedStages() {
        return parseJsonArray(this.lifecycleJson, DEFAULT_LIFECYCLE).map(s => enrichStage(s));
    }

    // ── Fixed-position popover ──
    get hasPopover() { return this._popoverStageId !== null; }

    get activePopoverStage() {
        const id = this._popoverStageId;
        if (!id) return null;
        const stages = parseJsonArray(this.lifecycleJson, DEFAULT_LIFECYCLE);
        const stage  = stages.find(s => s.id === id);
        if (!stage) return null;
        const s = STATUS_STYLES[(stage.status || '').toLowerCase()] || STATUS_STYLES.low;
        return {
            ...stage,
            ...LIFECYCLE_SUGGESTED_TARGETS[id],
            statusBadgeClass: s.badgeClass,
            viewDetailsAriaLabel: `View details for ${stage.label}`,
        };
    }

    get popoverStyle() {
        return `left:${this._popoverLeft}px;top:${this._popoverTop}px;`;
    }

    _showPopoverForDot(id, dotEl) {
        this._clearPopoverHideTimer();
        this._isHoveringPopover = false;
        const rect = dotEl.getBoundingClientRect();
        const vw   = window.innerWidth;
        let left   = Math.round(rect.left + rect.width / 2 - POPOVER_WIDTH / 2);
        if (left < 8)                       left = 8;
        if (left + POPOVER_WIDTH > vw - 8)  left = vw - 8 - POPOVER_WIDTH;
        this._popoverLeft    = left;
        this._popoverTop     = Math.round(rect.bottom + POPOVER_OFFSET_Y);
        this._popoverStageId = id;
    }

    _clearPopoverHideTimer() {
        if (this._popoverHideTimer) {
            window.clearTimeout(this._popoverHideTimer);
            this._popoverHideTimer = null;
        }
    }

    _schedulePopoverHide(delayMs = 180) {
        this._clearPopoverHideTimer();
        this._popoverHideTimer = window.setTimeout(() => {
            if (this._isHoveringPopover) return;
            this._popoverStageId = null;
            this._popoverHideTimer = null;
        }, delayMs);
    }

    // ── Detail panel booleans ──
    get isPanelPlayers()       { return this.resolvedActivePanel === 'players';       }
    get isPanelOpportunities() { return this.resolvedActivePanel === 'opportunities'; }
    get isPanelValue()         { return this.resolvedActivePanel === 'value';         }
    get isPanelDecisions()     { return this.resolvedActivePanel === 'decisions';     }
    get isPanelReadiness()     { return this.resolvedActivePanel === 'readiness';     }

    get isInlinePanel() {
        const p = this.resolvedActivePanel;
        return p === 'players' || p === 'readiness';
    }

    get activePanelMeta() {
        const map = {
            players:       { label: 'Player Universe Breakdown',       icon: 'utility:groups',     theme: 'blue'   },
            opportunities: { label: 'Ranked Agentic Opportunities',    icon: 'utility:agent_astro', theme: 'teal'   },
            value:         { label: 'Business Value Scorecard',        icon: 'utility:trending',   theme: 'green'  },
            decisions:     { label: 'Recommended Executive Decisions', icon: 'utility:approval',   theme: 'red'    },
            readiness:     { label: 'Data \u0026 AI Readiness',        icon: 'utility:data_cloud', theme: 'blue'   },
        };
        return map[this.resolvedActivePanel] || map.opportunities;
    }

    get detailHeaderIconClass() {
        return `pecc-detail-icon pecc-detail-icon_${this.activePanelMeta.theme}`;
    }

    // ── Players panel ──
    get funnelStages()       { return FUNNEL_STAGES; }
    get radarLegendItems()   { return RADAR_LEGEND; } // kept for backward compat

    get bubbleMapItems() {
        return BUBBLE_MAP_DATA.map(b => ({
            ...b,
            circleStyle: `fill:${b.fillRgba};stroke:${b.borderColor};stroke-width:1.5;`,
            ariaLabel:   `${b.label}: ${b.value}, readiness ${b.readiness}`,
        }));
    }

    get bubbleTip() {
        if (!this._bubbleTip || !this._bubbleTip.visible) return { visible: false };
        const d = this._bubbleTip.data;
        const hdrColor = d.color === '#F3C43A' ? '#181818' : '#ffffff';
        return {
            visible:     true,
            data:        d,
            style:       this._bubbleTip.style,
            headerStyle: `background:${d.color};color:${hdrColor};`,
        };
    }

    get radarTip() {
        if (!this._radarTip || !this._radarTip.visible) return { visible: false };
        const d = this._radarTip.data;
        // Yellow dot → dark text for contrast
        const hdrColor = d.color === '#F3C43A' ? '#181818' : '#ffffff';
        return {
            visible:     true,
            data:        d,
            style:       this._radarTip.style,
            headerStyle: `background:${d.color};color:${hdrColor};`,
        };
    }

    // ── Readiness panel ──
    get enrichedReadiness() {
        return parseJsonArray(this.readinessJson, DEFAULT_READINESS).map(enrichReadiness);
    }

    get readinessNextSteps()    { return READINESS_NEXT_STEPS; }
    get overallReadinessPct()   { return '68%'; }
    get overallReadinessStyle() { return `width:68%;background:${PS_YELLOW};`; }

    // ── Event handlers ──
    handleKpiClick(evt) {
        const id = evt.currentTarget.dataset.id;
        this._activePanel = id;
        this.dispatchEvent(new CustomEvent('snapshotselect', { detail: { panelId: id }, bubbles: true, composed: true }));
    }

    handleStageClick(evt) {
        const id    = evt.currentTarget.dataset.id;
        const stage = DEFAULT_LIFECYCLE.find(s => s.id === id);
        this.dispatchEvent(new CustomEvent('stageselect', { detail: stage || { id }, bubbles: true, composed: true }));
    }

    handleStageHover(evt) {
        const id  = evt.currentTarget.dataset.id;
        const dot = evt.currentTarget.querySelector('.pecc-dot');
        if (dot) this._showPopoverForDot(id, dot);
    }

    handleStageLeave() { this._schedulePopoverHide(); }

    handleStageFocus(evt) {
        const id = evt.currentTarget.dataset.id;
        this._showPopoverForDot(id, evt.currentTarget);
    }

    handleStageBlur() { this._schedulePopoverHide(200); }

    handlePopoverMouseEnter() {
        this._isHoveringPopover = true;
        this._clearPopoverHideTimer();
    }

    handlePopoverMouseLeave() {
        this._isHoveringPopover = false;
        this._schedulePopoverHide();
    }

    handlePopoverFocusIn() {
        this._isHoveringPopover = true;
        this._clearPopoverHideTimer();
    }

    handlePopoverFocusOut() {
        this._isHoveringPopover = false;
        this._schedulePopoverHide(200);
    }

    handlePopoverKeydown(evt) {
        if (evt.key === 'Escape') {
            this._clearPopoverHideTimer();
            this._isHoveringPopover = false;
            this._popoverStageId = null;
            evt.stopPropagation();
        }
    }

    handleLifecycleStageDetailClick() {
        const stage = this.activePopoverStage;
        if (!stage) return;
        const targetUrl = stage.targetUrl || SEGMENTS_LIST_TARGET_URL;
        this.dispatchEvent(new CustomEvent('lifecyclestagedetail', {
            detail: {
                stageId: stage.id,
                label: stage.label,
                status: stage.status,
                opportunityCount: stage.detail?.count,
                owner: stage.detail?.owner,
                action: stage.detail?.action,
                suggestedTargetLabel: stage.suggestedTargetLabel,
                suggestedTargetType: stage.suggestedTargetType,
                suggestedTargetDescription: stage.suggestedTargetDescription,
                targetUrl,
            },
            bubbles: true,
            composed: true,
        }));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: { url: targetUrl },
        });
    }

    // ── Radar tooltip handlers — delegated to the <svg> element ──
    // Using delegation avoids the LWC SVG rendering bug where multiple sibling
    // SVG elements with identical per-element event handler bindings cause LWC
    // to only adopt the first element into its virtual DOM.
    handleRadarMouseOver(evt) {
        // mouseover bubbles — walk up to the nearest [data-radar-id] ancestor
        const el = evt.target && evt.target.closest ? evt.target.closest('[data-radar-id]') : null;
        if (!el) { this._radarTip = { visible: false }; return; }
        const id   = el.dataset.radarId;
        const data = RADAR_POINTS_DATA.find(p => p.id === id);
        if (data) this._placeRadarTip(data, el);
        else      this._radarTip = { visible: false };
    }

    handleRadarMouseLeave() { this._radarTip = { visible: false }; }

    // focusin bubbles (unlike focus) so it works with delegation on <svg>
    handleRadarFocusIn(evt) {
        const el = evt.target && evt.target.closest ? evt.target.closest('[data-radar-id]') : null;
        if (!el) return;
        const id   = el.dataset.radarId;
        const data = RADAR_POINTS_DATA.find(p => p.id === id);
        if (data) this._placeRadarTip(data, el);
    }

    handleRadarFocusOut() { this._radarTip = { visible: false }; }

    _placeRadarTip(data, el) {
        const rect = el.getBoundingClientRect();
        const tipW = 200;
        let x = Math.round(rect.left + rect.width / 2);
        let y = Math.round(rect.top - 6);
        if (x + tipW / 2 > window.innerWidth - 8)  x = window.innerWidth - tipW / 2 - 8;
        if (x - tipW / 2 < 8)                       x = tipW / 2 + 8;
        this._radarTip = {
            visible: true,
            data,
            style: `position:fixed;top:${y}px;left:${x}px;transform:translate(-50%,-100%);z-index:9002;width:${tipW}px;`,
        };
    }

    // ── Bubble tooltip handlers ──
    handleBubbleEnter(evt) {
        const id   = evt.currentTarget.dataset.bubbleId;
        const data = BUBBLE_MAP_DATA.find(b => b.id === id);
        if (data) this._placeBubbleTip(data, evt.currentTarget);
    }

    handleBubbleLeave()    { this._bubbleTip = { visible: false }; }
    handleBubbleFocus(evt) { this.handleBubbleEnter(evt); }
    handleBubbleBlur()     { this._bubbleTip = { visible: false }; }

    _placeBubbleTip(data, el) {
        const rect = el.getBoundingClientRect();
        const tipW = 188;
        let x = Math.round(rect.left + rect.width / 2);
        let y = Math.round(rect.top - 6);
        if (x + tipW / 2 > window.innerWidth - 8)  x = window.innerWidth - tipW / 2 - 8;
        if (x - tipW / 2 < 8)                       x = tipW / 2 + 8;
        this._bubbleTip = {
            visible: true,
            data,
            style: `position:fixed;top:${y}px;left:${x}px;transform:translate(-50%,-100%);z-index:9001;width:${tipW}px;`,
        };
    }

    handleDetailAction(evt) {
        const action = evt.currentTarget.dataset.action;
        this.dispatchEvent(new CustomEvent('detailaction', {
            detail: { panelId: this.resolvedActivePanel, action },
            bubbles: true, composed: true,
        }));
    }
}
