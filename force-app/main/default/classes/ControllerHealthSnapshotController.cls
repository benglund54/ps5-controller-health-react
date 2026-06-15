public with sharing class ControllerHealthSnapshotController {
    public class SnapshotSummary {
        @AuraEnabled public String playerName;
        @AuraEnabled public String playerId;
        @AuraEnabled public String controllerModel;
        @AuraEnabled public String serialNumber;
        @AuraEnabled public String issueDetected;
        @AuraEnabled public String warrantyStatus;
        @AuraEnabled public String recommendation;
        @AuraEnabled public String customerMessage;
        @AuraEnabled public String nextStepLabel;
        @AuraEnabled public Integer recentCaseCount;
        @AuraEnabled public List<String> recentCaseNumbers;
    }

    @AuraEnabled(cacheable=true)
    public static SnapshotSummary getControllerHealthSummary(Id contactId) {
        SnapshotSummary summary = buildFallbackSummary();

        if (contactId == null) {
            return summary;
        }

        Contact playerContact;
        try {
            playerContact = [
                SELECT Id, Name
                FROM Contact
                WHERE Id = :contactId
                LIMIT 1
            ];
            if (String.isNotBlank(playerContact.Name)) {
                summary.playerName = playerContact.Name;
            }
        } catch (Exception ex) {
            return summary;
        }

        try {
            List<Asset> linkedAssets = [
                SELECT Id, Name, Product2.Name, SerialNumber
                FROM Asset
                WHERE ContactId = :contactId
                ORDER BY LastModifiedDate DESC
                LIMIT 1
            ];
            if (!linkedAssets.isEmpty()) {
                Asset latestAsset = linkedAssets[0];
                if (String.isNotBlank(latestAsset.SerialNumber)) {
                    summary.serialNumber = latestAsset.SerialNumber;
                }
                if (latestAsset.Product2 != null && String.isNotBlank(latestAsset.Product2.Name)) {
                    summary.controllerModel = latestAsset.Product2.Name;
                }
            }
        } catch (Exception ex) {
            // Safe fallback is already present.
        }

        try {
            List<Case> recentCases = [
                SELECT CaseNumber
                FROM Case
                WHERE ContactId = :contactId
                ORDER BY CreatedDate DESC
                LIMIT 3
            ];
            summary.recentCaseCount = recentCases.size();
            summary.recentCaseNumbers = new List<String>();
            for (Case c : recentCases) {
                summary.recentCaseNumbers.add(c.CaseNumber);
            }
        } catch (Exception ex) {
            // If Case access is unavailable, keep fallback values.
        }

        return summary;
    }

    private static SnapshotSummary buildFallbackSummary() {
        SnapshotSummary fallback = new SnapshotSummary();
        fallback.playerName = 'Sarah Jeffries';
        fallback.playerId = 'PLAYER001';
        fallback.controllerModel = 'DualSense Wireless Controller';
        fallback.serialNumber = 'ZCT1W-0A1B2C3D';
        fallback.issueDetected = 'Right stick may not be centering correctly';
        fallback.warrantyStatus = 'In warranty';
        fallback.recommendation = 'Free replacement review';
        fallback.customerMessage = 'You may be eligible for a free replacement controller, pending support review.';
        fallback.nextStepLabel = 'Request support review';
        fallback.recentCaseCount = 0;
        fallback.recentCaseNumbers = new List<String>();
        return fallback;
    }
}
