package com.rian.fieldlog;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Modern back handling (Android 13+ / API 33+)
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView wv = getBridge().getWebView();
                if (wv != null) {
                    wv.evaluateJavascript(
                        "if(typeof _handleBackButton==='function'){_handleBackButton();}",
                        null
                    );
                }
            }
        });

        WebView wv = getBridge().getWebView();
        if (wv != null) {
            // Allow audio/video playback without a user gesture (needed for
            // Gemini TTS which plays audio after async fetch — the original
            // tap context is lost by the time the blob is ready).
            wv.getSettings().setMediaPlaybackRequiresUserGesture(false);

            // Expose native exit to JS — Capacitor App plugin doesn't work with remote URLs
            wv.addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void exitApp() {
                    runOnUiThread(() -> finishAffinity());
                }
            }, "RianNative");

            // Grant WebView permission requests (microphone, camera) —
            // required when loading from a remote URL (GitHub Pages)
            wv.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    runOnUiThread(() -> request.grant(request.getResources()));
                }
            });
        }
    }
}
