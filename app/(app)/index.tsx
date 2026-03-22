import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from "react-native";

import Text from "@/components/text";
import { Colors } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";

import background_header from "../../assets/images/background-header.png";

import { useRouter } from "expo-router";
import { Button, Container, Content, Gradient } from "./styles";

import { useLikedStore } from "@/store/useLikedStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases from "react-native-purchases";

import { useAdventureProfileStore } from "@/store/useAdventureProfileStore";

const { height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  // Estado para controlar o loading da imagem
  const [isImageLoading, setIsImageLoading] = useState(true);

  const { loadProfile, profile } = useAdventureProfileStore();
  const router = useRouter();

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        // Zoom
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.08,
            duration: 9000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 9000,
            useNativeDriver: true,
          }),
        ]),

        // Parallax vertical
        Animated.sequence([
          Animated.timing(translateYAnim, {
            toValue: -height * 0.04,
            duration: 9000,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 9000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [scaleAnim, translateYAnim]);

  const saveProStatus = async (status: boolean) => {
    try {
      await AsyncStorage.setItem("@user_is_pro", JSON.stringify(status));
    } catch (e) {
      console.error("Erro ao salvar status Pro", e);
    }
  };

  const init = useLikedStore((s) => s.init);

  useEffect(() => {
    init();

    const load = async () => {
      await loadProfile();

      if (!profile) {
        await AsyncStorage.setItem("@adventure_profile_viewed", "true");
      }
    };

    load();

    const iosApiKey = "appl_PkLTpbVDucWPedXmosRFCbOkfDH";

    Purchases.configure({ apiKey: iosApiKey });
  }, []);

  return (
    <>
      <StatusBar style="dark" translucent />

      {/* Loading centralizado na tela toda com texto */}
      {isImageLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.light.text} />
          <Text
            fontFamily="regular"
            fontSize={16}
            color={Colors.light.text}
            title="Loading..."
            style={{ marginTop: 16 }} // Espaçamento entre o spinner e o texto
          />
        </View>
      )}

      <Container>
        {/* A imagem continua renderizando por trás para poder disparar o onLoad */}
        <Animated.Image
          source={background_header}
          resizeMode="cover"
          onLoad={() => setIsImageLoading(false)}
          style={{
            width: "100%",
            height: "80%",
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            opacity: isImageLoading ? 0 : 1, // Fica invisível enquanto carrega
          }}
        />
      </Container>

      {/* O conteúdo principal só é exibido quando o loading acaba */}
      {!isImageLoading && (
        <Gradient
          colors={[
            "transparent",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,1)",
            "rgba(255,255,255,1)",
            "rgba(255,255,255,1)",
          ]}
        >
          <Content>
            <Text
              fontFamily="bold"
              fontSize={28}
              color={Colors.light.text}
              title={`Welcome to Our\nAudiobook Journey`}
            />

            <Text
              fontFamily="regular"
              fontSize={16}
              color={Colors.light.text}
              title={`Turn the page, or rather, press play, and let the adventure begin.`}
            />

            <Button
              onPress={() => router.push("/(profile-adventure)")}
              activeOpacity={0.85}
            >
              <Text
                fontFamily="bold"
                fontSize={18}
                color={Colors.light.background}
                title="Get Started"
              />
            </Button>
          </Content>
        </Gradient>
      )}
    </>
  );
}

// Estilos atualizados para ocupar toda a tela
const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject, // Isso faz a View cobrir 100% da tela (top/bottom/left/right: 0)
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99, // Garante que fique por cima de tudo
    backgroundColor: "#F8F9FA", // Fundo sólido para esconder tudo enquanto carrega
  },
});
