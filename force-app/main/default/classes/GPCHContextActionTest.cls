@IsTest(SeeAllData=true)
private class GPCHContextActionTest {
    @IsTest
    static void testExpectedPersonaPathsFromSeedPlayers() {
        List<GetPlayerControllerHealthContextAction.Request> reqs =
            new List<GetPlayerControllerHealthContextAction.Request>();
        reqs.add(buildRequest('PLAYER001'));
        reqs.add(buildRequest('PLAYER002'));
        reqs.add(buildRequest('PLAYER003'));
        reqs.add(buildRequest('PLAYER004'));

        List<GetPlayerControllerHealthContextAction.Response> results =
            GetPlayerControllerHealthContextAction.getPlayerControllerHealthContext(reqs);

        System.assertEquals(4, results.size(), 'One response per request is expected.');

        Map<String, GetPlayerControllerHealthContextAction.Response> byPlayerId =
            new Map<String, GetPlayerControllerHealthContextAction.Response>();
        for (GetPlayerControllerHealthContextAction.Response row : results) {
            byPlayerId.put(row.player_id, row);
            System.assertEquals(true, row.preview_only, 'All responses must be preview-only.');
            System.assertNotEquals(null, row.player_safe_message, 'Safe message should always be present.');
            System.assert(
                row.player_safe_message.contains('Demo status only'),
                'Safe message should explicitly indicate demo-only semantics.'
            );
            System.assertNotEquals(null, row.recommended_path, 'Recommended path should always be present.');
        }

        System.assertEquals('INCLUDED_REPLACEMENT', byPlayerId.get('PLAYER001').recommended_path);
        System.assertEquals('PERSONALIZED_UPGRADE', byPlayerId.get('PLAYER002').recommended_path);
        System.assertEquals('FIRMWARE_TROUBLESHOOTING', byPlayerId.get('PLAYER003').recommended_path);
        System.assertEquals('STICK_MODULE_PATH', byPlayerId.get('PLAYER004').recommended_path);
    }

    @IsTest
    static void testUnknownAndBlankPlayerHandling() {
        List<GetPlayerControllerHealthContextAction.Request> reqs =
            new List<GetPlayerControllerHealthContextAction.Request>();
        reqs.add(buildRequest('PLAYER_NOT_FOUND'));
        reqs.add(buildRequest(''));

        List<GetPlayerControllerHealthContextAction.Response> results =
            GetPlayerControllerHealthContextAction.getPlayerControllerHealthContext(reqs);

        System.assertEquals(2, results.size());
        System.assertEquals('PLAYER_NOT_FOUND', results[0].player_id);
        System.assertEquals('FIRMWARE_TROUBLESHOOTING', results[0].recommended_path);
        System.assertEquals(false, results[0].has_recent_case);
        System.assertEquals(true, results[0].preview_only);

        System.assertEquals(null, results[1].player_id, 'Blank input should normalize to null output player_id.');
        System.assertEquals('FIRMWARE_TROUBLESHOOTING', results[1].recommended_path);
        System.assertEquals(false, results[1].has_recent_case);
        System.assertEquals(true, results[1].preview_only);
    }

    @IsTest
    static void testRecommendationPrecedenceWithoutEntitlementOrFirmware() {
        GetPlayerControllerHealthContextAction.RecommendationDecision noEntitlementOutWarranty =
            GetPlayerControllerHealthContextAction.deriveRecommendationDecision(
                false,
                null,
                new Set<String>(),
                'OUT_OF_WARRANTY',
                'CFI-ZCT1W',
                'DualSense Wireless Controller'
            );
        System.assertEquals('PERSONALIZED_UPGRADE', noEntitlementOutWarranty.recommendedPath);

        GetPlayerControllerHealthContextAction.RecommendationDecision noFirmwareNoEntitlementUnknownWarranty =
            GetPlayerControllerHealthContextAction.deriveRecommendationDecision(
                false,
                null,
                new Set<String>(),
                null,
                null,
                null
            );
        System.assertEquals('FIRMWARE_TROUBLESHOOTING', noFirmwareNoEntitlementUnknownWarranty.recommendedPath);
    }

    @IsTest
    static void testRecommendationPrecedenceOrdering() {
        // Firmware update available must win over all other signals.
        GetPlayerControllerHealthContextAction.RecommendationDecision firmwareWins =
            GetPlayerControllerHealthContextAction.deriveRecommendationDecision(
                true,
                'DISCOUNTED_UPGRADE',
                new Set<String>{'DISCOUNTED_UPGRADE', 'FREE_REPLACEMENT'},
                'OUT_OF_WARRANTY',
                'CFI-ZCP1',
                'DualSense Edge Wireless Controller'
            );
        System.assertEquals('FIRMWARE_TROUBLESHOOTING', firmwareWins.recommendedPath);

        // Module replacement must win over free replacement and discounted upgrade.
        GetPlayerControllerHealthContextAction.RecommendationDecision moduleWins =
            GetPlayerControllerHealthContextAction.deriveRecommendationDecision(
                false,
                'MODULE_REPLACEMENT',
                new Set<String>{'MODULE_REPLACEMENT', 'FREE_REPLACEMENT', 'DISCOUNTED_UPGRADE'},
                'IN_WARRANTY',
                'CFI-ZCT1W',
                'DualSense Wireless Controller'
            );
        System.assertEquals('STICK_MODULE_PATH', moduleWins.recommendedPath);
    }

    private static GetPlayerControllerHealthContextAction.Request buildRequest(String playerId) {
        GetPlayerControllerHealthContextAction.Request req =
            new GetPlayerControllerHealthContextAction.Request();
        req.player_id = playerId;
        return req;
    }
}
