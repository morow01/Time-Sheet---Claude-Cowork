package com.rian.fieldlog;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private ValueCallback<Uri[]> mFilePathCallback;
    private static final int FILE_CHOOSER_REQUEST_CODE = 100;

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
            // required when loading from a remote URL (GitHub Pages).
            // onShowFileChooser enables <input type="file"> in the WebView.
            wv.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    runOnUiThread(() -> request.grant(request.getResources()));
                }

                @Override
                @SuppressWarnings("deprecation")
                public boolean onShowFileChooser(WebView webView,
                        ValueCallback<Uri[]> filePathCallback,
                        FileChooserParams fileChooserParams) {
                    if (mFilePathCallback != null) {
                        mFilePathCallback.onReceiveValue(null);
                    }
                    mFilePathCallback = filePathCallback;
                    Intent intent = fileChooserParams.createIntent();
                    try {
                        startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE);
                    } catch (Exception e) {
                        mFilePathCallback = null;
                        return false;
                    }
                    return true;
                }
            });
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK) {
                results = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
            }
            if (mFilePathCallback != null) {
                mFilePathCallback.onReceiveValue(results);
                mFilePathCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }
}
