// __mocks__/expo.js
// Mock générique pour tous les packages Expo (expo-constants, expo-font, etc.)
module.exports = {
    default: {},
    useFonts: () => [true, null],
    preventAutoHideAsync: jest.fn(() => Promise.resolve()),
    hideAsync: jest.fn(() => Promise.resolve()),
};
