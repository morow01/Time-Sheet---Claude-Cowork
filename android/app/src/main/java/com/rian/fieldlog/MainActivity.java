package com.rian.fieldlog;

import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        // Dispatch to our JS handler instead of default WebView history.back()
        WebView wv = getBridge().getWebView();
        if (wv != null) {
            wv.evaluateJavascript(
                "if(typeof _handleBackButton==='function'){_handleBackButton();}",
                null
            );
        } else {
            super.onBackPressed();
        }
    }
}
