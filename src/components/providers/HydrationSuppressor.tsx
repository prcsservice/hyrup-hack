"use client";

import Script from "next/script";

/**
 * HydrationSuppressor - Patches console.error BEFORE React hydrates
 * to suppress browser extension-induced hydration warnings.
 * 
 * Uses `beforeInteractive` to ensure script runs before hydration.
 */
export function HydrationSuppressor() {
    return (
        <Script
            id="hydration-suppressor"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                    (function() {
                        var originalError = console.error;
                        console.error = function() {
                            var args = Array.prototype.slice.call(arguments);
                            var message = args.join(' ');
                            // Suppress hydration errors caused by browser extensions
                            if (
                                message.indexOf('bis_skin_checked') !== -1 ||
                                message.indexOf('Extra attributes from the server') !== -1 ||
                                (message.indexOf('A tree hydrated') !== -1 && message.indexOf('hidden') !== -1)
                            ) {
                                return;
                            }
                            originalError.apply(console, args);
                        };
                    })();
                `,
            }}
        />
    );
}
