## AI‑Powered Pantry & Recipe Optimizer

A cross‑platform mobile app that lets you track your pantry, scan barcodes to auto‑identify products, and get recipe suggestions based on what you already have. Runs with free/open APIs and works offline for pantry data.

### Features
- **Pantry management**: Add, update, and remove items. Data is stored locally with AsyncStorage for offline access.
- **Barcode scanning**: Use the device camera to scan barcodes and auto‑lookup product details via OpenFoodFacts.
- **Recipe discovery**: Fetch recipes matching your pantry ingredients using TheMealDB free API; view full details and instructions.
- **Authentication (optional)**: Anonymous sign‑in by default; can be switched to Firebase Authentication if env vars are provided.
- **Cross‑platform**: Built with Expo/React Native for Web, Android, and iOS.

### Tech Stack
- **Frontend**: Expo + React Native
- **Navigation**: `@react-navigation/native`, `@react-navigation/native-stack`
- **Device APIs**: `expo-barcode-scanner` for camera & barcode
- **State & Storage**: React Context + `@react-native-async-storage/async-storage`
- **Networking**: `axios`
- **Backend (optional)**: Firebase Authentication (no DB required for core features)
- **External APIs (free)**:
  - **OpenFoodFacts**: Product lookup by barcode (no API key)
  - **TheMealDB**: Recipe search and details (no API key for v1 endpoints)

### How It Works
- **Auth flow** (`src/contexts/AuthContext.js`)
  - Default: anonymous local session stored in AsyncStorage.
  - Optional: If Firebase env vars are present, uses Firebase Auth; otherwise no‑ops seamlessly.
- **Pantry flow** (`src/contexts/PantryContext.js`)
  - Pantry items are persisted in AsyncStorage; exposes add/update/remove.
- **Scan flow** (`src/screens/ScanScreen.js`)
  - Requests camera permission, scans barcode, hits OpenFoodFacts, and adds the item (fallback to generic item if not found).
- **Recipes flow** (`src/screens/RecipesScreen.js`)
  - Collects your pantry item names and queries TheMealDB’s filter endpoint. Selecting a recipe loads full details.

### Benefits
- **Save time and money**: Quickly see what you can cook without extra shopping.
- **Reduce food waste**: Plan meals based on ingredients you already have.
- **Privacy‑friendly**: Pantry lives on your device; no proprietary backend required.
- **Hackathon‑ready**: Uses free tiers/APIs and runs on device or web with minimal setup.

### Prerequisites
- Node.js 18+ and npm
- Optional for native builds: Android Studio (Android) and Xcode (iOS/macOS)
- Optional for quick device testing: Expo Go app on your phone

### Getting Started
1) Clone and install

```bash
cd pantry-ai
npm install
```

2) Run on Web (quickest)

```bash
npm run web
```
- Opens Expo dev server for Web. Note that camera access for barcode scanning on web may be limited by browser/HTTPS constraints; best tested on device.

3) Run on a device with Expo Go (recommended for camera)

```bash
npx expo start
```
- Scan the QR code with the Expo Go app (Android/iOS). This avoids native build setup and enables camera scanning.

4) Run native builds (requires platform toolchains)

```bash
npm run android   # builds and runs an Android app (dev build)
npm run ios       # builds and runs an iOS app (requires macOS)
```

### Optional: Firebase Authentication
If you want Firebase Auth instead of local anonymous sessions, provide these environment variables before starting the app. With Expo, prefix public vars with `EXPO_PUBLIC_`.

```bash
export EXPO_PUBLIC_FIREBASE_API_KEY=your_key
export EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
export EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
export EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
export EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
export EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
# Optional: use emulator during dev
export FIREBASE_USE_EMULATOR=1
```

- If these are not set, the app automatically uses anonymous local auth and still works fully for pantry and recipes.

### Project Structure
```
pantry-ai/
  App.js                     # Providers + navigation root
  index.js                   # Entry; registers App and gesture-handler
  app.json                   # Expo config & permissions
  src/
    contexts/
      AuthContext.js         # Optional Firebase/local auth
      PantryContext.js       # Pantry state persisted in AsyncStorage
    navigation/
      Tabs.js                # Stack navigation across screens
    screens/
      SignInScreen.js        # Anonymous sign-in
      PantryScreen.js        # Pantry CRUD and quick actions
      ScanScreen.js          # Barcode scanning and product lookup
      RecipesScreen.js       # Recipe list + details
      ProfileScreen.js       # Sign-out and basic profile
    services/
      api.js                 # OpenFoodFacts + TheMealDB helpers
      firebase.js            # Safe, optional Firebase init
  assets/                    # App icons/splash
  package.json               # Scripts and dependencies
```

### Notes on Free APIs & Limits
- **OpenFoodFacts** and **TheMealDB** are public/free services; be respectful of rate limits and usage policies. Consider caching results on device.

### Troubleshooting
- If navigation or gestures misbehave, ensure `react-native-gesture-handler` is installed and imported at the top of `index.js` (already done here).
- If barcode scanning doesn’t work on web, test with Expo Go on a device. Some browsers require HTTPS and may limit camera features.
- For native builds, install platform SDKs and accept Android licenses/Xcode prompts as needed.

### License
For demo and educational use. Replace or extend as needed for production deployments.