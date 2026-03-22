# 🔧 Fix EAS Build Error

## The Issue
The project needs to be created on Expo first.

## Solution - 2 Options

### Option 1: Use Expo Website (Easiest)

1. Go to: https://expo.dev
2. Login with your account (hatbero)
3. Click "Create a Project"
4. Name: `growing-up-expo`
5. Copy the Project ID shown
6. Run this command with your Project ID:
   ```bash
   eas init --id YOUR_PROJECT_ID_HERE
   ```
7. Then build:
   ```bash
   eas build --platform android --profile preview
   ```

### Option 2: Use Command Line

Run these commands one by one:

```bash
# Step 1: Create project (answer 'y' when prompted)
eas project:init

# Step 2: Build APK
eas build --platform android --profile preview
```

## If You Get "stdin not readable" Error

Open a new PowerShell window and run:
```powershell
$env:CI = $false
eas project:init
```

Then answer 'y' when prompted.

## Alternative: Build Without EAS

If EAS continues to have issues, you can use Expo's classic build:

```bash
expo build:android -t apk
```

This uses the older build system but works reliably.

## Quick Fix

Try this single command:
```bash
npx eas-cli project:init && npx eas-cli build -p android --profile preview
```

This will:
1. Create the project
2. Start the build
3. All in one command

Let me know which option works for you!
