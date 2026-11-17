import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { tokens } from "../theme/tokens.js";

const { color, space, radius } = tokens;

export function SplashScreen({ onFinish, duration = 2200 }) {
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!reducedMotion) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 900 }),
          withTiming(1, { duration: 900 })
        ),
        -1,
        true
      );
    }

    const timer = setTimeout(() => {
      onFinish?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish, pulse, reducedMotion]);

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Animated.View
        entering={reducedMotion ? undefined : FadeIn.duration(400)}
        style={styles.centerContent}
      >
        <View style={styles.logoWrapper}>
          <Animated.View style={[styles.halo, haloStyle]} />
          <View style={styles.logoBadge}>
            <Ionicons name="thermometer-outline" size={44} color={color.onPrimary} />
          </View>
        </View>

        <Animated.Text
          entering={reducedMotion ? undefined : FadeInDown.delay(120).duration(360)}
          style={styles.title}
        >
          LiveTemp
        </Animated.Text>

        <Animated.Text
          entering={reducedMotion ? undefined : FadeInDown.delay(220).duration(360)}
          style={styles.subtitle}
        >
          IoT Temperature Monitoring
        </Animated.Text>
      </Animated.View>

      <Animated.View
        entering={reducedMotion ? undefined : FadeIn.delay(300).duration(360)}
        style={styles.footer}
      >
        <ActivityIndicator size="small" color={color.primary} />
        <Text style={styles.footerText}>Menyiapkan aplikasi...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: space.xxl * 2,
    paddingHorizontal: space.xl,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.lg,
  },
  halo: {
    position: "absolute",
    width: 112,
    height: 112,
    borderRadius: radius.pill,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: color.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: color.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: -0.8,
    color: color.text,
  },
  subtitle: {
    marginTop: space.sm,
    fontSize: 14,
    fontWeight: "500",
    color: color.text2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.border,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
    color: color.text2,
  },
});

