package za.co.lilulabeverages.app;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends Activity {
    // The live website the app shows. Change this one line if the site moves to another address.
    private static final String HOME_URL = "https://lilula-beverages-shop.vercel.app/";
    private static final String HOME_HOST = Uri.parse(HOME_URL).getHost();

    private WebView webView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefresh;
    private View offlineView;
    private OnBackInvokedCallback backCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(15, 15, 15));

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(15, 15, 15));
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setLoadsImagesAutomatically(true);
        webView.getSettings().setMediaPlaybackRequiresUserGesture(true);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme() == null ? "" : uri.getScheme();
                String host = uri.getHost() == null ? "" : uri.getHost();

                if ("https".equalsIgnoreCase(scheme) &&
                    (host.equalsIgnoreCase(HOME_HOST) ||
                     host.equalsIgnoreCase("www." + HOME_HOST))) {
                    return false;
                }

                // Open external websites and app links (such as WhatsApp) outside the app.
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    startActivity(intent);
                } catch (Exception ignored) {
                    // Keep the app stable if no installed app can handle the link.
                }
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                // Only a failed page load (not a missing image) shows the offline screen.
                if (request.isForMainFrame()) {
                    showOffline();
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                swipeRefresh.setRefreshing(false);
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                progressBar.setVisibility(newProgress >= 100 ? View.GONE : View.VISIBLE);
            }
        });

        // Pull down at the top of a page to reload it.
        swipeRefresh = new SwipeRefreshLayout(this);
        swipeRefresh.setColorSchemeColors(Color.rgb(194, 155, 75));
        swipeRefresh.setProgressBackgroundColorSchemeColor(Color.rgb(30, 30, 30));
        swipeRefresh.setOnRefreshListener(() -> webView.reload());
        swipeRefresh.setOnChildScrollUpCallback((parent, child) -> webView.getScrollY() > 0);
        swipeRefresh.addView(webView, new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setProgressTintList(android.content.res.ColorStateList.valueOf(Color.rgb(194, 155, 75)));
        progressBar.setIndeterminateTintList(android.content.res.ColorStateList.valueOf(Color.rgb(194, 155, 75)));

        offlineView = buildOfflineView();
        offlineView.setVisibility(View.GONE);

        root.addView(swipeRefresh, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));

        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, dp(3), Gravity.TOP);
        root.addView(progressBar, progressParams);

        root.addView(offlineView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));

        setContentView(root);
        if (Build.VERSION.SDK_INT >= 30) {
            applyEdgeToEdgeInsets(root);
        }
        if (Build.VERSION.SDK_INT >= 33) {
            registerBackHandler();
        }

        if (savedInstanceState == null) {
            webView.loadUrl(HOME_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    // Shown instead of the browser's error page when the site cannot be reached.
    private View buildOfflineView() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setGravity(Gravity.CENTER);
        box.setBackgroundColor(Color.rgb(15, 15, 15));
        box.setPadding(dp(32), dp(32), dp(32), dp(32));
        box.setClickable(true); // keeps taps from reaching the page underneath

        TextView title = new TextView(this);
        title.setText("You're offline");
        title.setTextColor(Color.rgb(194, 155, 75));
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 26);
        title.setGravity(Gravity.CENTER);

        TextView message = new TextView(this);
        message.setText("Lilula Beverages needs an internet connection. Check your connection, then try again.");
        message.setTextColor(Color.rgb(220, 220, 220));
        message.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        message.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams messageParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        messageParams.topMargin = dp(12);

        Button retry = new Button(this);
        retry.setText("Try again");
        retry.setOnClickListener(v -> retryLoad());
        LinearLayout.LayoutParams retryParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        retryParams.topMargin = dp(24);

        box.addView(title);
        box.addView(message, messageParams);
        box.addView(retry, retryParams);
        return box;
    }

    private void showOffline() {
        swipeRefresh.setRefreshing(false);
        offlineView.setVisibility(View.VISIBLE);
    }

    private void retryLoad() {
        offlineView.setVisibility(View.GONE);
        if (webView.getUrl() == null) {
            webView.loadUrl(HOME_URL);
        } else {
            webView.reload();
        }
    }

    // Android 15+ draws apps edge to edge: keep the page clear of the status bar, the
    // navigation bar, display cutouts and the on-screen keyboard.
    @TargetApi(30)
    private void applyEdgeToEdgeInsets(FrameLayout root) {
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            Insets bars = insets.getInsets(
                WindowInsets.Type.systemBars()
                    | WindowInsets.Type.displayCutout()
                    | WindowInsets.Type.ime());
            v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            return WindowInsets.CONSUMED;
        });
    }

    // Apps targeting Android 16 no longer get onBackPressed(), so the back gesture is
    // handled here: go back in the page history, then close the app.
    @TargetApi(33)
    private void registerBackHandler() {
        backCallback = this::goBackOrFinish;
        getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
            OnBackInvokedDispatcher.PRIORITY_DEFAULT, backCallback);
    }

    private void goBackOrFinish() {
        if (webView != null && webView.canGoBack()) {
            offlineView.setVisibility(View.GONE);
            webView.goBack();
        } else {
            finish();
        }
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) webView.saveState(outState);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        goBackOrFinish();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
