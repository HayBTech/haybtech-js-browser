/**
 * HayBTech.js - Official Browser SDK
 * 
 * SECURITY WARNING: Never use your Secret Key (sk_...) in client-side code.
 * This SDK only accepts Public Keys (pk_...).
 */
(function(window) {
    'use strict';

    var HayBTech = function(publicKey) {
        // Trim whitespace to avoid common copy-paste errors
        var key = typeof publicKey === 'string' ? publicKey.trim() : publicKey;

        if (!key) {
            console.error("[HayBTech] Clé publique manquante.");
            throw new Error("Missing Public Key");
        }

        if (typeof key !== 'string') {
            console.error("[HayBTech] La clé publique doit être une chaîne.");
            throw new Error("Invalid Public Key Type");
        }

        if (key.indexOf('sk_') === 0) {
            console.error("[HayBTech] Sécurité : Vous utilisez une Clé Secrète côté client ! Utilisez uniquement la Clé Publique (pk_...).");
            throw new Error("Security Error: Secret Key exposed");
        }

        if (key.indexOf('pk_') !== 0) {
            console.error("[HayBTech] Clé publique invalide — format attendu : pk_live_... ou pk_test_...");
            throw new Error("Invalid Public Key Format");
        }
        this.publicKey = key;
    };

    HayBTech.prototype.redirectToCheckout = function(options) {
        if (!options.paymentUrl) {
            console.error("[HayBTech] paymentUrl is required.");
            return;
        }

        // We can optionally wrap the URL or add tracking params here
        window.location.href = options.paymentUrl;
    };

    /**
     * Helper to open checkout in a popup.
     */
    HayBTech.prototype.openPopup = function(options) {
        var url = options.paymentUrl;
        var width = 500;
        var height = 700;
        var left = (window.innerWidth / 2) - (width / 2);
        var top = (window.innerHeight / 2) - (height / 2);

        var popup = window.open(
            url, 
            'HayBTech Checkout', 
            'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left
        );

        // Listen for messages if the checkout sends them
        window.addEventListener('message', function(event) {
            // Security: Verify origin
            if (!event.origin.includes('haybtech.com')) return;
            
            if (event.data.status === 'success') {
                options.onSuccess && options.onSuccess(event.data);
                popup.close();
            }
        });

        return popup;
    };

    window.HayBTech = HayBTech;

})(window);
