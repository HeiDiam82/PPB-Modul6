import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import {
  BACKEND_URL,
  MQTT_BROKER_URL,
  MQTT_TOPIC,
} from "../services/config.js";
import { tokens } from "../theme/tokens.js";

const { color, space, radius, shadow } = tokens;

function InfoRow({ icon, label, value, mono = false, isLast = false }) {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <View style={styles.infoLabelWrap}>
        <Ionicons name={icon} size={18} color={color.text2} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text
        style={[styles.infoValue, mono && styles.monoText]}
        numberOfLines={2}
      >
        {value || "-"}
      </Text>
    </View>
  );
}

export function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Farrel Adhi Pratama");
  const [nim, setNim] = useState("21120124130096");
  const [group, setGroup] = useState("Kelompok 26");
  const [program, setProgram] = useState("Teknik Komputer - UNDIP");
  const reducedMotion = useReducedMotion();
  const avatarScale = useSharedValue(1);

  const appName = Constants.expoConfig?.name ?? "LiveTemp";
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const avatarAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const handleToggleEdit = () => {
    if (!reducedMotion) {
      avatarScale.value = withSequence(
        withSpring(1.08, { damping: 12, stiffness: 260 }),
        withSpring(1, { damping: 14, stiffness: 220 })
      );
    }
    setIsEditing((prev) => !prev);
  };

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <ScrollView
      style={styles.safe}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View
        entering={
          reducedMotion
            ? FadeIn.duration(150)
            : FadeInDown.duration(tokens.motion.entering)
        }
        layout={reducedMotion ? undefined : LinearTransition.duration(200)}
        style={styles.card}
      >
        <View style={styles.profileHeader}>
          <Animated.View style={[styles.avatar, avatarAnimStyle]}>
            <Text style={styles.avatarText}>{initials || "LT"}</Text>
          </Animated.View>
          <View style={styles.profileMeta}>
            <Text style={styles.profileName}>{name || "Pengguna"}</Text>
            <Text style={styles.profileSub}>{nim || "-"}</Text>
            <View style={styles.badge}>
              <Ionicons name="people-outline" size={14} color={color.primary} />
              <Text style={styles.badgeText}>{group || "-"}</Text>
            </View>
          </View>
          <Pressable
            onPress={handleToggleEdit}
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={isEditing ? "Simpan profil" : "Edit profil"}
            hitSlop={8}
          >
            <Ionicons
              name={isEditing ? "checkmark" : "create-outline"}
              size={18}
              color={color.primary}
            />
            <Text style={styles.editButtonText}>
              {isEditing ? "Selesai" : "Edit"}
            </Text>
          </Pressable>
        </View>

        {isEditing ? (
          <Animated.View
            key="edit-form"
            entering={reducedMotion ? undefined : FadeIn.duration(180)}
            exiting={reducedMotion ? undefined : FadeOut.duration(120)}
            style={styles.form}
          >
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Masukkan nama"
                placeholderTextColor={color.text3}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>NIM</Text>
              <TextInput
                style={styles.input}
                value={nim}
                onChangeText={setNim}
                placeholder="Masukkan NIM"
                placeholderTextColor={color.text3}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Kelompok</Text>
              <TextInput
                style={styles.input}
                value={group}
                onChangeText={setGroup}
                placeholder="Masukkan kelompok"
                placeholderTextColor={color.text3}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Program Studi</Text>
              <TextInput
                style={styles.input}
                value={program}
                onChangeText={setProgram}
                placeholder="Masukkan program studi"
                placeholderTextColor={color.text3}
              />
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            key="info-list"
            entering={reducedMotion ? undefined : FadeIn.duration(180)}
            exiting={reducedMotion ? undefined : FadeOut.duration(120)}
            style={styles.infoList}
          >
            <InfoRow icon="person-outline" label="Nama" value={name} />
            <InfoRow icon="card-outline" label="NIM" value={nim} mono />
            <InfoRow icon="people-outline" label="Kelompok" value={group} />
            <InfoRow
              icon="school-outline"
              label="Program Studi"
              value={program}
              isLast
            />
          </Animated.View>
        )}
      </Animated.View>

      <Animated.View
        entering={
          reducedMotion
            ? FadeIn.duration(150)
            : FadeInDown.delay(90).duration(tokens.motion.entering)
        }
        style={styles.card}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informasi Aplikasi & IoT</Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>v{appVersion}</Text>
          </View>
        </View>
        <View style={styles.infoList}>
          <InfoRow icon="apps-outline" label="Aplikasi" value={appName} />
          <InfoRow
            icon="server-outline"
            label="Backend URL"
            value={BACKEND_URL}
            mono
          />
          <InfoRow
            icon="cloud-outline"
            label="MQTT Broker"
            value={MQTT_BROKER_URL}
            mono
          />
          <InfoRow
            icon="radio-outline"
            label="MQTT Topic"
            value={MQTT_TOPIC}
            mono
            isLast
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.bg,
  },
  container: {
    padding: space.lg,
    paddingBottom: 32,
    gap: space.lg,
    backgroundColor: color.bg,
  },
  card: {
    backgroundColor: color.surface,
    padding: space.xl,
    borderRadius: radius.card,
    borderCurve: "continuous",
    gap: space.lg,
    borderWidth: 1,
    borderColor: color.border,
    boxShadow: shadow.card,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: color.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: color.onPrimary,
    fontFamily: "monospace",
  },
  profileMeta: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: tokens.type.title,
    fontWeight: "700",
    color: color.text,
    letterSpacing: -0.3,
  },
  profileSub: {
    fontSize: 13,
    color: color.text2,
    fontVariant: ["tabular-nums"],
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    borderWidth: 1,
    borderColor: color.border,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: color.primary,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface2,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.primary,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  form: {
    gap: space.md,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: color.text2,
  },
  input: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.input,
    paddingVertical: 10,
    paddingHorizontal: space.md,
    fontSize: 15,
    color: color.text,
    backgroundColor: color.bg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: tokens.type.section,
    fontWeight: "700",
    color: color.text,
  },
  versionPill: {
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    borderWidth: 1,
    borderColor: color.border,
  },
  versionText: {
    fontSize: 12,
    fontWeight: "600",
    color: color.text2,
    fontVariant: ["tabular-nums"],
  },
  infoList: {
    borderTopWidth: 1,
    borderTopColor: color.border,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  infoLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: color.text2,
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600",
    color: color.text,
  },
  monoText: {
    fontFamily: "monospace",
    fontSize: 12,
  },
});

