import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
// import { Colors } from "@/constants/theme"; // Optional: You can remove this if relying on local theme logic below
import Text from "@/components/text";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";

const games = [
  {
    id: "endless-runner",
    title: "Space Runner",
    emoji: "🚀",
    color: "#FF9F0A",
    route: "/(endless-runner)",
    description: "Navigate through asteroids.",
  },
  // {
  //   id: "runner-kart",
  //   title: "Runner Kart",
  //   emoji: "🏎️",
  //   color: "#FF375F",
  //   route: "/(runner-kart)",
  //   description: "Race your way to victory.",
  // },
  {
    id: "quiz",
    title: "Quiz Master",
    emoji: "❓",
    color: "#30D158",
    route: "/(quiz)",
    description: "Test your knowledge.",
  },
  {
    id: "memory-game",
    title: "Memory Match",
    emoji: "🧠",
    color: "#0A84FF",
    route: "/(memory-game)",
    description: "Train your brain.",
  },
  {
    id: "platformer-adventure",
    title: "Knight's Quest",
    emoji: "🗡️",
    color: "#BF5AF2",
    route: "/(platformer-adventure)",
    description: "Magical platforming adventure.",
  },
];

export default function GamesHub() {
  const router = useRouter();

  const handleGamePress = (game) => {
    if (game.id === "platformer-adventure") {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_LEFT,
      ).then(() => {
        console.log("Screen locked to landscape left");
      });
    }
    router.push(game.route);
  };

  return (
    <>
      {/* 4. Update Status Bar */}
      <StatusBar style={"dark"} />

      <View style={[styles.mainContainer, { backgroundColor: "#F8F9FA" }]}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text
              fontFamily="bold"
              fontSize={34}
              color="#000000"
              title="Arcade"
              style={{ letterSpacing: -0.5 }}
            />
            <Text
              fontFamily="regular"
              fontSize={17}
              color="#8E8E93"
              title="Premium Games Collection"
              style={{ marginTop: 4 }}
            />
          </View>

          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[
                styles.card,
                {
                  backgroundColor: "#FFFFFF",
                  // Hide shadow in dark mode (iOS style preference)
                  shadowOpacity: 0.05,
                },
              ]}
              onPress={() => handleGamePress(game)}
              activeOpacity={0.7}
            >
              {/* Icon Container */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: game.color + "33" }, // 20% opacity
                ]}
              >
                <Text fontFamily="bold" fontSize={32} title={game.emoji} />
              </View>

              {/* Info */}
              <View style={styles.info}>
                <Text
                  fontFamily="bold"
                  fontSize={17}
                  color="#000000"
                  title={game.title}
                  style={{ marginBottom: 2 }}
                />
                <Text
                  fontFamily="regular"
                  fontSize={15}
                  color="#8E8E93"
                  title={game.description}
                  numberOfLines={2}
                  style={{ lineHeight: 20 }}
                />
              </View>

              {/* Chevron */}
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Default light background (can be overridden by theme)
    // Background color is now handled inline via theme object
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },

    shadowRadius: 8,
    elevation: 2,
    borderCurve: "continuous",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderCurve: "continuous",
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
});
