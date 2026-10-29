// ============================================================
//  Écran : Connexion (Authentification & RBAC)
//  Mode Sombre & Mode Clair
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHouseStore } from '../src/store/useHouseStore';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { Spacing, FontSize, FontWeight, Radii, Shadows } from '../src/constants/theme';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { SmartIcon } from '../src/components/SmartIcon';

export default function LoginScreen() {
    const router = useRouter();
    const { colors } = useAppTheme();
    const login = useHouseStore((s) => s.login);
    const isLoggedIn = useHouseStore((s) => s.isLoggedIn);
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            router.replace('/');
        }
    }, [isLoggedIn, router]);

    if (isLoggedIn) {
        return null;
    }

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await login(username.trim(), password.trim());
            router.back();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Identifiants incorrects.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.kav}
            >
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    {/* Bouton fermer */}
                    <TouchableOpacity
                        style={[styles.closeBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                        onPress={() => router.back()}
                    >
                        <SmartIcon name="cross" size={14} color={colors.textSub} />
                    </TouchableOpacity>

                    {/* Entête */}
                    <View style={styles.hero}>
                        <View
                            style={[
                                styles.heroIconBox,
                                { backgroundColor: colors.primaryDim, borderColor: `${colors.primary}44` },
                            ]}
                        >
                            <SmartIcon name="home" size={38} color={colors.primary} />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>Connexion</Text>
                        <Text style={[styles.subtitle, { color: colors.textSub }]}>
                            Authentification sécurisée & gestion des privilèges (RBAC)
                        </Text>
                    </View>

                    {/* Formulaire */}
                    <View style={styles.form}>
                        <Text style={[styles.label, { color: colors.textSub }]}>Identifiant</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.surfaceBorder,
                                    color: colors.text,
                                },
                            ]}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="admin"
                            placeholderTextColor={colors.textDisabled}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                        />

                        <Text style={[styles.label, { color: colors.textSub }]}>Mot de passe</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.inputPassword,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: colors.surfaceBorder,
                                        color: colors.text,
                                    },
                                ]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor={colors.textDisabled}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />
                            <TouchableOpacity
                                style={styles.eyeBtn}
                                onPress={() => setShowPassword((v) => !v)}
                            >
                                <SmartIcon
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={18}
                                    color={colors.textSub}
                                />
                            </TouchableOpacity>
                        </View>

                        {error && (
                            <View style={[styles.errorBanner, { backgroundColor: colors.dangerDim, flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
                                <SmartIcon name="alert" size={15} color={colors.danger} />
                                <Text style={[styles.errorText, { color: colors.danger, flex: 1 }]}>{error}</Text>
                            </View>
                        )}

                        <PrimaryButton
                            label={loading ? 'Connexion en cours…' : 'Se connecter'}
                            onPress={handleLogin}
                            loading={loading}
                        />

                        <Text style={[styles.hint, { color: colors.textSub }]}>
                            Comptes de démo : <Text style={[styles.hintBold, { color: colors.primary }]}>admin / admin123</Text> ou <Text style={[styles.hintBold, { color: colors.primary }]}>famille / user123</Text>
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
    },
    closeBtn: {
        alignSelf: 'flex-end',
        width: 36,
        height: 36,
        borderRadius: Radii.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginBottom: Spacing.lg,
    },
    closeIcon: { fontSize: 16 },
    hero: { alignItems: 'center', marginBottom: Spacing.xxl },
    heroIconBox: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: FontSize.xxxl,
        fontWeight: FontWeight.extrabold,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: FontSize.sm,
        textAlign: 'center',
        lineHeight: 20,
    },
    form: { gap: Spacing.sm },
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        marginBottom: 2,
    },
    input: {
        borderRadius: Radii.lg,
        borderWidth: 1,
        height: 52,
        paddingHorizontal: Spacing.md,
        fontSize: FontSize.md,
        ...Shadows.card,
    },
    passwordWrapper: {
        position: 'relative',
    },
    inputPassword: {
        paddingRight: 52,
    },
    eyeBtn: {
        position: 'absolute',
        right: 14,
        top: 14,
    },
    eyeIcon: { fontSize: 20 },
    errorBanner: {
        borderRadius: Radii.lg,
        padding: Spacing.md,
    },
    errorText: {
        fontSize: FontSize.sm,
    },
    hint: {
        fontSize: FontSize.xs,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    hintBold: {
        fontFamily: 'monospace',
    },
});
