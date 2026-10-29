// __mocks__/react-native.js
// Mock léger de React Native pour les tests Jest (environnement Node)
module.exports = {
    Platform: { OS: 'ios', select: (obj) => obj.ios ?? obj.default },
    StyleSheet: { create: (s) => s, flatten: (s) => s },
    Dimensions: { get: () => ({ width: 375, height: 812 }) },
    Alert: { alert: jest.fn() },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    ScrollView: 'ScrollView',
    Image: 'Image',
};
