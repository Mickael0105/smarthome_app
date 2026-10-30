// ============================================================
//  Écran : Connexion AM'NAY (Authentification & RBAC)
//  Style iOS 18 premium — Mode Sombre & Mode Clair
// ============================================================

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useHouseStore } from '../src/store/useHouseStore';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { Spacing, FontSize, FontWeight, Radii, Shadows } from '../src/constants/theme';
import { SmartIcon } from '../src/components/SmartIcon';
import { Haptics } from '../src/utils/haptics';

// ─── Comptes de démo ──────────────────────────────────────────
const DEMO_ACCOUNTS = [
    {
        label: 'Admin',
        username: 'admin',
        password: 'admin123',
        icon: 'admin' as const,
        color: '#6366F1',
        desc: 'Contrôle total',
        welcome: 'Bienvenue, Administrateur 👑\nVous avez un accès complet à AM\'NAY.',
    },
    {
        label: 'Famille',
        username: 'famille',
        password: 'famille123',
        icon: 'home' as const,
        color: '#10B981',
        desc: 'Accès limité',
        welcome: 'Bienvenue dans votre maison 🏠\nProfitez de votre habitat connecté.',
    },
    {
        label: 'Invité',
        username: 'invite',
        password: 'invite123',
        icon: 'eye' as const,
        color: '#F59E0B',
        desc: 'Lecture seule',
        welcome: 'Bienvenue, Invité 👋\nVous êtes en mode consultation.',
    },
];

export default function LoginScreen() {
    const router = useRouter();
    const { colors, isDark } = useAppTheme();
    const login = useHouseStore((s) => s.login);
    const isLoggedIn = useHouseStore((s) => s.isLoggedIn);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // ✅ FIX : Redirection dans useEffect, jamais pendant le rendu
    useEffect(() => {
        if (isLoggedIn) {
            router.replace('/(tabs)');
        }
    }, [isLoggedIn, router]);

    if (isLoggedIn) return null;

    const showWelcome = (welcomeMsg: string) => {
        Haptics.success();
        Alert.alert(
            '🏠 AM\'NAY',
            welcomeMsg,
            [{ text: 'Entrer', style: 'default' }],
        );
    };

    const handleLogin = async (u?: string, p?: string, welcomeMsg?: string) => {
        const user = u ?? username.trim();
        const pass = p ?? password.trim();

        if (!user || !pass) {
            setError('Veuillez remplir tous les champs.');
            Haptics.warning();
            return;
        }
        setError(null);
        setLoading(true);
        Haptics.light();
        try {
            await login(user, pass);
            const msg = welcomeMsg ?? `Bienvenue, ${user} !\nVous êtes connecté à AM'NAY.`;
            showWelcome(msg);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Identifiants incorrects.';
            setError(msg);
            Haptics.warning();
            setLoading(false);
        }
    };

    const handleDemoTap = (account: typeof DEMO_ACCOUNTS[0]) => {
        Haptics.light();
        handleLogin(account.username, account.password, account.welcome);
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.kav}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Logo AM'NAY ── */}
                    <View style={styles.hero}>
                        <View style={[styles.logoWrapper, { borderColor: `${colors.primary}44` }]}>
                            <Image
                                source={require('../assets/amnay-logo.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={[styles.appName, { color: colors.text }]}>AM'NAY</Text>
                        <Text style={[styles.subtitle, { color: colors.textSub }]}>
                            Habitat Intelligent & Sécurisé
                        </Text>
                    </View>

                    {/* ── Connexion rapide (cartes démo) ── */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSub }]}>
                            Connexion rapide
                        </Text>
                        <View style={styles.demoRow}>
                            {DEMO_ACCOUNTS.map((acc) => (
                                <TouchableOpacity
                                    key={acc.username}
                                    style={[
                                        styles.demoCard,
                                        {
                                            backgroundColor: colors.surface,
                                            borderColor: colors.surfaceBorder,
                                        },
                                        Shadows.card,
                                    ]}
                                    onPress={() => handleDemoTap(acc)}
                                    activeOpacity={0.75}
                                >
                                    <View style={[styles.demoIconWrap, { backgroundColor: `${acc.color}22` }]}>
                                        <SmartIcon name={acc.icon} size={20} color={acc.color} />
                                    </View>
                                    <Text style={[styles.demoLabel, { color: colors.text }]}>{acc.label}</Text>
                                    <Text style={[styles.demoDesc, { color: colors.textSub }]}>{acc.desc}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* ── Séparateur ── */}
                    <View style={styles.separator}>
                        <View style={[styles.sepLine, { backgroundColor: colors.surfaceBorder }]} />
                        <Text style={[styles.sepText, { color: colors.textSub }]}>ou</Text>
                        <View style={[styles.sepLine, { backgroundColor: colors.surfaceBorder }]} />
                    </View>

                    {/* ── Formulaire manuel ── */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSub }]}>
                            Connexion manuelle
                        </Text>

                        {/* Identifiant */}
                        <View style={styles.fieldGroup}>
                            <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                                <SmartIcon name="admin" size={17} color={colors.textSub} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="Identifiant"
                                    placeholderTextColor={colors.textDisabled}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                />
                            </View>
                        </View>

                        {/* Mot de passe */}
                        <View style={styles.fieldGroup}>
                            <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                                <SmartIcon name="security" size={17} color={colors.textSub} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Mot de passe"
                                    placeholderTextColor={colors.textDisabled}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    onSubmitEditing={() => handleLogin()}
                                />
                                <TouchableOpacity onPress={() => { setShowPassword((v) => !v); Haptics.light(); }}>
                                    <SmartIcon
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={17}
                                        color={colors.textSub}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Erreur */}
                        {error && (
                            <View style={[styles.errorBanner, { backgroundColor: colors.dangerDim }]}>
                                <SmartIcon name="alert" size={15} color={colors.danger} />
                                <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                            </View>
                        )}

                        {/* Bouton connexion */}
                        <TouchableOpacity
                            style={[
                                styles.loginBtn,
                                { backgroundColor: loading ? colors.primaryDim : colors.primary },
                                Shadows.button,
                            ]}
                            onPress={() => handleLogin()}
                            activeOpacity={0.85}
                            disabled={loading}
                        >
                            <SmartIcon name="check" size={18} color="#fff" />
                            <Text style={styles.loginBtnText}>
                                {loading ? 'Connexion…' : 'Se connecter'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── Note de sécurité ── */}
                    <View style={[styles.securityNote, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                        <SmartIcon name="security" size={14} color={colors.textSub} />
                        <Text style={[styles.securityText, { color: colors.textSub }]}>
                            Système RBAC — les accès sont limités selon votre rôle
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    kav: { flex: 1 },
    scroll: {
        flexGrow: 1,
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },

    // Hero / Logo
    hero: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    logoWrapper: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        overflow: 'hidden',
        marginBottom: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 110,
        height: 110,
    },
    appName: {
        fontSize: 32,
        fontWeight: FontWeight.extrabold,
        marginBottom: 4,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: FontSize.sm,
        textAlign: 'center',
        letterSpacing: 0.3,
    },

    // Section
    section: { marginBottom: Spacing.lg },
    sectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: Spacing.sm,
    },

    // Cartes démo
    demoRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    demoCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        borderRadius: Radii.xl,
        borderWidth: 1,
        gap: 4,
    },
    demoIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    demoLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    demoDesc: {
        fontSize: 10,
        textAlign: 'center',
    },

    // Séparateur
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginVertical: Spacing.lg,
    },
    sepLine: { flex: 1, height: 1 },
    sepText: { fontSize: FontSize.xs },

    // Champs formulaire
    fieldGroup: { marginBottom: Spacing.sm },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Radii.lg,
        borderWidth: 1,
        paddingHorizontal: Spacing.md,
        height: 52,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: FontSize.md,
        height: '100%',
    },

    // Erreur
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        borderRadius: Radii.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    errorText: { fontSize: FontSize.sm, flex: 1 },

    // Bouton connexion
    loginBtn: {
        flexDirection: 'row',
        height: 54,
        borderRadius: Radii.xl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    loginBtnText: {
        color: '#fff',
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },

    // Note sécurité
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        padding: Spacing.md,
        borderRadius: Radii.lg,
        borderWidth: 1,
        marginTop: Spacing.sm,
    },
    securityText: {
        fontSize: FontSize.xs,
        flex: 1,
    },
});
