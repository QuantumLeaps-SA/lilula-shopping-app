plugins {
    id("com.android.application")
}

android {
    namespace = "za.co.lilulabeverages.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "za.co.lilulabeverages.app"
        minSdk = 23
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
        release {
            // This first workflow produces a release-variant APK without a private
            // release signing key. Use the debug APK for initial device testing.
            // Configure a privately stored keystore before distributing a release build.
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
