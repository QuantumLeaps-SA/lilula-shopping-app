# Lilula Beverages Android app

A lightweight Android WebView wrapper around the live Lilula Beverages shop. It shows the website
you deploy from this repository, so shop changes appear in the app without rebuilding it.

The website address is the `HOME_URL` line in
`app/src/main/java/za/co/lilulabeverages/app/MainActivity.java`. Change that one line if the site
lives at a different address, then rebuild.

## Build the APK on GitHub

1. Push this repository to GitHub.
2. Open the **Actions** tab and run **Build Lilula Beverages Android APK**.
3. When it finishes, open the run and download the `lilula-beverages-android-debug-apk` artifact.
4. Unzip it and install `app-debug.apk` on an Android phone.

It builds with Java 17, Gradle 8.9 and Android Gradle Plugin 8.7.3. The artifact is kept for 14 days.

## App icon

The launcher icon is the peacock emblem on a near-black background: an adaptive icon in
`app/src/main/res/mipmap-anydpi-v26/` with PNG fallbacks in `mipmap-*dpi/`. The background colour is
in `res/values/ic_launcher_background.xml`.

## Publish to Google Play

Google Play needs a signed release bundle (`.aab`), not the debug APK.

1. On a computer, create an upload key once (keep the file and passwords somewhere safe, and never
   commit them):
   `keytool -genkeypair -v -keystore lilula-upload.jks -alias lilula -keyalg RSA -keysize 2048 -validity 10000`
2. Turn the key file into text: `base64 -w0 lilula-upload.jks` (Mac: `base64 -i lilula-upload.jks`).
3. In GitHub, open Settings, then Secrets and variables, then Actions, and add four repository secrets:
   `KEYSTORE_BASE64` (the text from step 2), `KEYSTORE_PASSWORD`, `KEY_ALIAS` (`lilula` above) and
   `KEY_PASSWORD`.
4. Run **Build Lilula Beverages Google Play bundle** from the Actions tab and download
   `lilula-beverages-play-release-aab`.
5. Upload `app-release.aab` in Play Console. Each run raises the version code automatically.

Choose Play App Signing when Play Console asks. Google then holds the final app signing key and your
file is only the upload key.

## Notes

- The app needs an internet connection. It has no offline mode, push notifications or payments.
- External links, including WhatsApp and phone numbers, open in the matching Android app.
