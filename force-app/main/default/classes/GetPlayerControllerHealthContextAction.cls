public with sharing class GetPlayerControllerHealthContextAction {
    private static final String PATH_FIRMWARE = 'FIRMWARE_TROUBLESHOOTING';
    private static final String PATH_MODULE = 'STICK_MODULE_PATH';
    private static final String PATH_INCLUDED = 'INCLUDED_REPLACEMENT';
    private static final String PATH_UPGRADE = 'PERSONALIZED_UPGRADE';
    private static final String SAFE_PREVIEW_MESSAGE =
        'Preview context only. Demo status only. No operational actions are executed.';

    public class Request {
        @InvocableVariable(required=true label='player_id')
        public String player_id;
    }

    public class Response {
        @InvocableVariable public String player_id;
        @InvocableVariable public String player_name;
        @InvocableVariable public String psn_handle;
        @InvocableVariable public String loyalty_tier;
        @InvocableVariable public String ps_plus_tier;
        @InvocableVariable public String controller_id;
        @InvocableVariable public String controller_serial;
        @InvocableVariable public String controller_model;
        @InvocableVariable public String controller_product_code;
        @InvocableVariable public String warranty_status;
        @InvocableVariable public Date warranty_expiry_date;
        @InvocableVariable public String firmware_current;
        @InvocableVariable public String firmware_latest;
        @InvocableVariable public Boolean firmware_update_available;
        @InvocableVariable public String primary_entitlement_type;
        @InvocableVariable public String eligible_product_code;
        @InvocableVariable public Decimal promotional_price;
        @InvocableVariable public String entitlement_source;
        @InvocableVariable public Boolean has_recent_case;
        @InvocableVariable public String recommended_path;
        @InvocableVariable public String decision_reason;
        @InvocableVariable public String player_safe_message;
        @InvocableVariable public Boolean preview_only;
    }

    public class RecommendationDecision {
        public String recommendedPath;
        public String decisionReason;
        RecommendationDecision(String recommendedPath, String decisionReason) {
            this.recommendedPath = recommendedPath;
            this.decisionReason = decisionReason;
        }
    }

    @InvocableMethod(label='Get Player Controller Health Context' description='Read-only preview context for PS5 controller health recommendations')
    public static List<Response> getPlayerControllerHealthContext(List<Request> requests) {
        List<Response> outputs = new List<Response>();
        if (requests == null || requests.isEmpty()) {
            return outputs;
        }

        Set<String> requestedPlayerIds = new Set<String>();
        for (Request req : requests) {
            if (req != null && String.isNotBlank(req.player_id)) {
                requestedPlayerIds.add(req.player_id.trim());
            }
        }

        Map<String, Contact> contactByPlayerId = new Map<String, Contact>();
        Map<Id, Contact> contactById = new Map<Id, Contact>();
        if (!requestedPlayerIds.isEmpty()) {
            for (Contact c : [
                SELECT Id, Player_ID__c, FirstName, LastName, PSN_Account_ID__c, PlayStation_Loyalty_Tier__c, PS_Plus_Tier__c
                FROM Contact
                WHERE Player_ID__c IN :requestedPlayerIds
            ]) {
                if (String.isNotBlank(c.Player_ID__c)) {
                    contactByPlayerId.put(c.Player_ID__c, c);
                    contactById.put(c.Id, c);
                }
            }
        }

        Map<String, Asset> assetByPlayerId = new Map<String, Asset>();
        Set<String> controllerExternalIds = new Set<String>();
        Set<String> controllerSerials = new Set<String>();
        if (!contactById.isEmpty()) {
            for (Asset a : [
                SELECT ContactId, External_Controller_ID__c, SerialNumber, Name, Warranty_Status__c, Warranty_Expiry_Date__c, Product2.ProductCode
                FROM Asset
                WHERE ContactId IN :contactById.keySet()
                ORDER BY LastModifiedDate DESC
            ]) {
                Contact linked = contactById.get(a.ContactId);
                if (linked == null || String.isBlank(linked.Player_ID__c) || assetByPlayerId.containsKey(linked.Player_ID__c)) {
                    continue;
                }
                assetByPlayerId.put(linked.Player_ID__c, a);
                if (String.isNotBlank(a.External_Controller_ID__c)) {
                    controllerExternalIds.add(a.External_Controller_ID__c);
                }
                if (String.isNotBlank(a.SerialNumber)) {
                    controllerSerials.add(a.SerialNumber);
                }
            }
        }

        Map<String, Device_Firmware_Status__c> firmwareByPlayerId = new Map<String, Device_Firmware_Status__c>();
        if (!requestedPlayerIds.isEmpty() || !controllerExternalIds.isEmpty()) {
            for (Device_Firmware_Status__c f : [
                SELECT Player_ID__c, External_Controller_ID__c, Controller_Serial_Number__c, Current_Firmware_Version__c, Latest_Firmware_Version__c, Update_Available__c
                FROM Device_Firmware_Status__c
                WHERE Player_ID__c IN :requestedPlayerIds OR External_Controller_ID__c IN :controllerExternalIds
                ORDER BY LastModifiedDate DESC
            ]) {
                if (String.isNotBlank(f.Player_ID__c) && !firmwareByPlayerId.containsKey(f.Player_ID__c)) {
                    firmwareByPlayerId.put(f.Player_ID__c, f);
                }
            }
        }

        Map<String, List<Player_Entitlement__c>> entitlementsByPlayerId = new Map<String, List<Player_Entitlement__c>>();
        if (!requestedPlayerIds.isEmpty()) {
            for (Player_Entitlement__c e : [
                SELECT Player_ID__c, Entitlement_Type__c, Eligible_Product__r.ProductCode, Promotional_Price__c, Entitlement_Source__c, Is_Active__c
                FROM Player_Entitlement__c
                WHERE Player_ID__c IN :requestedPlayerIds AND Is_Active__c = true
                ORDER BY LastModifiedDate DESC
            ]) {
                if (String.isBlank(e.Player_ID__c)) {
                    continue;
                }
                if (!entitlementsByPlayerId.containsKey(e.Player_ID__c)) {
                    entitlementsByPlayerId.put(e.Player_ID__c, new List<Player_Entitlement__c>());
                }
                entitlementsByPlayerId.get(e.Player_ID__c).add(e);
            }
        }

        Map<String, Integer> recentCaseCountByKey = new Map<String, Integer>();
        Set<Id> caseContactIds = new Set<Id>();
        Set<String> caseSerials = new Set<String>();
        for (String playerId : assetByPlayerId.keySet()) {
            Contact c = contactByPlayerId.get(playerId);
            Asset a = assetByPlayerId.get(playerId);
            if (c != null && c.Id != null && String.isNotBlank(a.SerialNumber)) {
                caseContactIds.add(c.Id);
                caseSerials.add(a.SerialNumber);
            }
        }
        if (!caseContactIds.isEmpty() && !caseSerials.isEmpty()) {
            for (AggregateResult ar : [
                SELECT ContactId contactId, Controller_Serial__c serial, COUNT(Id) total
                FROM Case
                WHERE ContactId IN :caseContactIds AND Controller_Serial__c IN :caseSerials
                GROUP BY ContactId, Controller_Serial__c
            ]) {
                Id contactId = (Id) ar.get('contactId');
                String serial = (String) ar.get('serial');
                Integer total = (Integer) ar.get('total');
                recentCaseCountByKey.put(buildCaseKey(contactId, serial), total);
            }
        }

        for (Request req : requests) {
            Response out = new Response();
            out.preview_only = true;
            out.player_safe_message = SAFE_PREVIEW_MESSAGE;

            String normalizedPlayerId = (req == null || String.isBlank(req.player_id)) ? null : req.player_id.trim();
            out.player_id = normalizedPlayerId;

            if (String.isBlank(normalizedPlayerId)) {
                RecommendationDecision emptyDecision = deriveRecommendationDecision(
                    false,
                    null,
                    new Set<String>(),
                    null,
                    null,
                    null
                );
                out.recommended_path = emptyDecision.recommendedPath;
                out.decision_reason = 'No player_id was provided. Returning safe preview fallback.';
                out.has_recent_case = false;
                outputs.add(out);
                continue;
            }

            Contact c = contactByPlayerId.get(normalizedPlayerId);
            Asset a = assetByPlayerId.get(normalizedPlayerId);
            Device_Firmware_Status__c f = firmwareByPlayerId.get(normalizedPlayerId);
            List<Player_Entitlement__c> entitlementRows = entitlementsByPlayerId.containsKey(normalizedPlayerId)
                ? entitlementsByPlayerId.get(normalizedPlayerId)
                : new List<Player_Entitlement__c>();

            if (c != null) {
                out.player_name = (c.FirstName == null ? '' : c.FirstName) + (c.LastName == null ? '' : (String.isBlank(c.FirstName) ? c.LastName : ' ' + c.LastName));
                out.player_name = String.isBlank(out.player_name) ? null : out.player_name;
                out.psn_handle = c.PSN_Account_ID__c;
                out.loyalty_tier = c.PlayStation_Loyalty_Tier__c;
                out.ps_plus_tier = c.PS_Plus_Tier__c;
            }

            if (a != null) {
                out.controller_id = a.External_Controller_ID__c;
                out.controller_serial = a.SerialNumber;
                out.controller_model = a.Name;
                out.controller_product_code = (a.Product2 == null) ? null : a.Product2.ProductCode;
                out.warranty_status = a.Warranty_Status__c;
                out.warranty_expiry_date = a.Warranty_Expiry_Date__c;
            }

            if (f != null) {
                out.firmware_current = f.Current_Firmware_Version__c;
                out.firmware_latest = f.Latest_Firmware_Version__c;
                out.firmware_update_available = f.Update_Available__c;
            } else {
                out.firmware_update_available = false;
            }

            Set<String> entitlementTypes = new Set<String>();
            Player_Entitlement__c primaryEntitlement = choosePrimaryEntitlement(entitlementRows);
            for (Player_Entitlement__c entitlement : entitlementRows) {
                if (String.isNotBlank(entitlement.Entitlement_Type__c)) {
                    entitlementTypes.add(entitlement.Entitlement_Type__c.toUpperCase());
                }
            }
            if (primaryEntitlement != null) {
                out.primary_entitlement_type = primaryEntitlement.Entitlement_Type__c;
                out.eligible_product_code = primaryEntitlement.Eligible_Product__r == null ? null : primaryEntitlement.Eligible_Product__r.ProductCode;
                out.promotional_price = primaryEntitlement.Promotional_Price__c;
                out.entitlement_source = primaryEntitlement.Entitlement_Source__c;
            }

            if (c != null && c.Id != null && String.isNotBlank(out.controller_serial)) {
                Integer recentCount = recentCaseCountByKey.get(buildCaseKey(c.Id, out.controller_serial));
                out.has_recent_case = recentCount != null && recentCount > 0;
            } else {
                out.has_recent_case = false;
            }

            RecommendationDecision decision = deriveRecommendationDecision(
                out.firmware_update_available == true,
                out.primary_entitlement_type,
                entitlementTypes,
                out.warranty_status,
                out.controller_product_code,
                out.controller_model
            );
            out.recommended_path = decision.recommendedPath;

            if (c == null) {
                out.decision_reason = 'No Contact was found for player_id. Returning safe preview fallback recommendation.';
            } else {
                out.decision_reason = decision.decisionReason;
            }

            outputs.add(out);
        }

        return outputs;
    }

    private static String buildCaseKey(Id contactId, String serial) {
        return String.valueOf(contactId) + '|' + String.valueOf(serial);
    }

    private static Integer entitlementRank(String entitlementType) {
        if (String.isBlank(entitlementType)) {
            return 99;
        }
        String normalized = entitlementType.toUpperCase();
        if (normalized.contains('FIRMWARE_ONLY')) {
            return 1;
        }
        if (normalized.contains('MODULE_REPLACEMENT')) {
            return 2;
        }
        if (normalized.contains('FREE_REPLACEMENT')) {
            return 3;
        }
        if (normalized.contains('DISCOUNTED_UPGRADE')) {
            return 4;
        }
        return 90;
    }

    private static Player_Entitlement__c choosePrimaryEntitlement(List<Player_Entitlement__c> entitlements) {
        if (entitlements == null || entitlements.isEmpty()) {
            return null;
        }
        Player_Entitlement__c winner = null;
        Integer bestRank = 999;
        for (Player_Entitlement__c row : entitlements) {
            Integer rank = entitlementRank(row.Entitlement_Type__c);
            if (winner == null || rank < bestRank) {
                winner = row;
                bestRank = rank;
            }
        }
        return winner;
    }

    @TestVisible
    private static RecommendationDecision deriveRecommendationDecision(
        Boolean firmwareUpdateAvailable,
        String primaryEntitlementType,
        Set<String> activeEntitlementTypes,
        String warrantyStatus,
        String controllerProductCode,
        String controllerModel
    ) {
        Set<String> typeSet = activeEntitlementTypes == null ? new Set<String>() : activeEntitlementTypes;
        String primaryType = String.isBlank(primaryEntitlementType) ? '' : primaryEntitlementType.toUpperCase();
        String normalizedWarranty = String.isBlank(warrantyStatus) ? '' : warrantyStatus.toUpperCase();
        String productCode = String.isBlank(controllerProductCode) ? '' : controllerProductCode.toUpperCase();
        String model = String.isBlank(controllerModel) ? '' : controllerModel.toUpperCase();
        Boolean looksLikeEdge = productCode.contains('EDGE') || model.contains('EDGE');

        if (firmwareUpdateAvailable == true || primaryType.contains('FIRMWARE_ONLY')) {
            return new RecommendationDecision(PATH_FIRMWARE, 'Firmware status indicates update-first troubleshooting path.');
        }
        if (containsType(typeSet, 'MODULE_REPLACEMENT')) {
            return new RecommendationDecision(PATH_MODULE, 'Active entitlement includes module replacement eligibility.');
        }
        if (containsType(typeSet, 'FREE_REPLACEMENT')) {
            return new RecommendationDecision(PATH_INCLUDED, 'Active entitlement includes free replacement.');
        }
        if (containsType(typeSet, 'DISCOUNTED_UPGRADE')) {
            return new RecommendationDecision(PATH_UPGRADE, 'Active entitlement includes discounted upgrade.');
        }
        if (normalizedWarranty == 'IN_WARRANTY') {
            return new RecommendationDecision(PATH_INCLUDED, 'Warranty status is in warranty.');
        }
        if (normalizedWarranty == 'OUT_OF_WARRANTY' && looksLikeEdge) {
            return new RecommendationDecision(PATH_MODULE, 'Out-of-warranty Edge controller routes to module replacement path.');
        }
        if (normalizedWarranty == 'OUT_OF_WARRANTY') {
            return new RecommendationDecision(PATH_UPGRADE, 'Out-of-warranty status routes to personalized upgrade.');
        }
        return new RecommendationDecision(PATH_FIRMWARE, 'Additional context is needed; defaulting to safe firmware troubleshooting preview.');
    }

    private static Boolean containsType(Set<String> entitlementTypes, String token) {
        if (entitlementTypes == null || entitlementTypes.isEmpty()) {
            return false;
        }
        for (String t : entitlementTypes) {
            if (String.isNotBlank(t) && t.toUpperCase().contains(token)) {
                return true;
            }
        }
        return false;
    }
}
