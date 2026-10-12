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

## Before public distribution

- Test on real phones: forms, images, WhatsApp links and navigation.
- Create a private release keystore, back it up, and never commit it or its passwords.
- Add release signing to `app/build.gradle.kts` using GitHub Actions secrets, then build a signed
  release APK. Keep the same application ID and signing key for every update.

## Notes

- The app needs an internet connection. It has no offline mode, push notifications or payments.
- External links, including WhatsApp and phone numbers, open in the matching Android app.
