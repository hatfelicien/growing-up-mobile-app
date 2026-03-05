# 📱 Build APK with Expo EAS

## Setup Complete ✅

I've configured your project for EAS Build:
- Created `eas.json` configuration
- Updated `app.json` with package details

## Build APK - Step by Step

### Step 1: Create EAS Project

Run this command and follow the prompts:

```bash
eas build:configure
```

When prompted:
- "Would you like to automatically create an EAS project?" → **Yes**

### Step 2: Build APK

```bash
eas build --platform android --profile preview
```

This will:
1. Upload your code to Expo servers
2. Build the APK in the cloud
3. Give you a download link when done

**Build time:** ~10-15 minutes

### Step 3: Download APK

After build completes:
1. You'll get a download link in the terminal
2. Or visit: https://expo.dev/accounts/hatbero/projects/growing-up-expo/builds
3. Download the APK file

### Step 4: Install on Android Device

1. Transfer APK to your Android phone
2. Open the APK file
3. Allow "Install from unknown sources" if prompted
4. Install the app

## Build Profiles

### Preview Build (Recommended for Testing)
```bash
eas build --platform android --profile preview
```
- Creates APK file
- Easy to share and install
- Good for testing

### Production Build (For Play Store)
```bash
eas build --platform android --profile production
```
- Creates AAB file (Android App Bundle)
- Required for Google Play Store
- Optimized and smaller size

## Troubleshooting

### If build fails:

1. **Check your Expo account:**
   ```bash
   eas whoami
   ```

2. **Login again if needed:**
   ```bash
   eas login
   ```

3. **Clear cache and retry:**
   ```bash
   eas build --platform android --profile preview --clear-cache
   ```

### Common Issues:

**"Project not configured"**
- Run: `eas build:configure`
- Select "Yes" to create project

**"Invalid credentials"**
- Run: `eas login`
- Enter your Expo credentials

**"Build failed"**
- Check the build logs on expo.dev
- Usually dependency or configuration issues

## View Build Status

Visit: https://expo.dev/accounts/hatbero/projects/growing-up-expo/builds

You can:
- See all your builds
- Download APK files
- View build logs
- Cancel running builds

## Quick Commands

```bash
# Build APK (preview)
eas build -p android --profile preview

# Build AAB (production)
eas build -p android --profile production

# Check build status
eas build:list

# View project info
eas project:info
```

## App Details

- **App Name:** Growing Up
- **Package:** com.growingup.app
- **Version:** 1.0.0
- **Platform:** Android

## Next Steps

1. Run: `eas build --platform android --profile preview`
2. Wait for build to complete (~10-15 min)
3. Download APK from the link provided
4. Install on Android device
5. Test all features

**Your app is ready to build! 🚀**
