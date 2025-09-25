# Mobile RPG Starter (Neopets-like)

A simple Expo React Native starter with Home / Explore / Games tabs, a pet profile, coins, and level unlocks. State is persisted with AsyncStorage.

## Prereqs
- Node 18+
- Expo CLI (installed automatically via npm scripts)
- Optional: Xcode (iOS), Android Studio (Android)

## Run
```bash
npm run web     # open in browser
npm run ios     # iOS simulator (requires Xcode)
npm run android # Android emulator (requires Android Studio)
```
Then open the shown URL (usually http://localhost:19006). You can also use the Expo Go app to scan the QR code.

## Key files
- app/_layout.tsx: wraps navigation + GameProvider
- store/GameStore.tsx: coins, pet, unlocks, persistence
- app/(tabs)/index.tsx: Home (pet, coins, rename, actions)
- app/(tabs)/explore.tsx: Unlock next level with coins
- app/(tabs)/games.tsx: Placeholder mini-game that grants coins

## Reset progress
Delete the app data or call `reset()` from GameStore (temporary dev helper).
