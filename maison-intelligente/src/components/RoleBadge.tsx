// ============================================================
//  Composant : RoleBadge & Sélecteur RBAC
//  Permet de visualiser et switcher rapidement le rôle utilisateur (Soutenance)
//  Design Vectoriel Exclusif (SmartIcon) — Zéro Emoji
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { Spacing, Radii, FontSize, FontWeight, Shadows } from '../constants/theme';
import { SmartIcon, type SmartIconName } from './SmartIcon';
import type { UserRole } from '../types/house';

const ROLES: { id: UserRole; label: string; icon: SmartIconName; desc: string }[] = [
    { id: 'admin', label: 'Administrateur', icon: 'admin', desc: 'Accès illimité (portes, garage, paramètres)' },
    { id: 'member', label: 'Membre Famille', icon: 'user', desc: 'Gestion lumières, thermomètre, garage' },
    { id: 'guest', label: 'Invité', icon: 'guest', desc: 'Lecture seule & lumières autorisées' },
];

export const RoleBadge: React.FC = () => {
    const { colors } = useAppTheme();
    const user = useHouseStore((s) => s.user);
    const switchRole = useHouseStore((s) => s.switchRole);
    const [modalVisible, setModalVisible] = useState(false);

    if (!user) return null;

    const currentRole = ROLES.find((r) => r.id === user.role) ?? ROLES[0];

    const handleSelectRole = (role: UserRole) => {
        switchRole(role);
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.badge,
                    {
                        backgroundColor: colors.surfaceAlt,
                        borderColor: colors.surfaceBorder,
                    },
                ]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <SmartIcon name={currentRole.icon} size={15} color={colors.primary} />
                <Text style={[styles.label, { color: colors.text }]}>{currentRole.label}</Text>
                <Text style={[styles.arrow, { color: colors.textSub }]}>▾</Text>
            </TouchableOpacity>

            {/* Modal de sélection de profil RBAC */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.surfaceBorder,
                            },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Sélection du Profil (RBAC)</Text>
                            <Text style={[styles.modalSubtitle, { color: colors.textSub }]}>
                                Démonstration des permissions en soutenance L3 GL
                            </Text>
                        </View>

                        {ROLES.map((item) => {
                            const isSelected = user.role === item.id;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.roleItem,
                                        {
                                            backgroundColor: isSelected ? colors.primaryDim : colors.surfaceAlt,
                                            borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                                        },
                                    ]}
                                    onPress={() => handleSelectRole(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.iconWrap, { backgroundColor: isSelected ? colors.primary : colors.surfaceBorder }]}>
                                        <SmartIcon
                                            name={item.icon}
                                            size={18}
                                            color={isSelected ? '#FFFFFF' : colors.text}
                                        />
                                    </View>
                                    <View style={styles.roleTextWrap}>
                                        <Text style={[styles.roleLabel, { color: colors.text }]}>{item.label}</Text>
                                        <Text style={[styles.roleDesc, { color: colors.textSub }]}>{item.desc}</Text>
                                    </View>
                                    {isSelected && <SmartIcon name="check" size={16} color={colors.primary} />}
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity
                            style={[styles.closeBtn, { backgroundColor: colors.surfaceAlt }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={[styles.closeBtnText, { color: colors.text }]}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
        borderRadius: Radii.full,
        borderWidth: 1,
    },
    label: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
    arrow: {
        fontSize: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    modalContent: {
        width: '100%',
        maxWidth: 380,
        borderRadius: Radii.xl,
        borderWidth: 1,
        padding: Spacing.lg,
        ...Shadows.card,
    },
    modalHeader: {
        marginBottom: Spacing.md,
    },
    modalTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    modalSubtitle: {
        fontSize: FontSize.xs,
        marginTop: 4,
    },
    roleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radii.md,
        borderWidth: 1,
        marginBottom: Spacing.sm,
        gap: Spacing.sm,
    },
    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleTextWrap: {
        flex: 1,
    },
    roleLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    roleDesc: {
        fontSize: 11,
        marginTop: 2,
    },
    checkMark: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeBtn: {
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderRadius: Radii.md,
        marginTop: Spacing.xs,
    },
    closeBtnText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
    },
});
