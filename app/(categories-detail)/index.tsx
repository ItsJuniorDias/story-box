import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlassView } from "expo-glass-effect";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import Text from "@/components/text";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import { useStoriesStore } from "@/store/useStoriesStore";
import { doc, increment, updateDoc } from "firebase/firestore";
import { Container, Gradient, ImageCard, ModernCategoryCard } from "./styles";

export default function CategoryDetailsScreen() {
  const params = useLocalSearchParams<{
    category: string;
    storyId: string;
    currentIndex: string;
  }>();

  const categoryName = params.category;
  const allStories = useStoriesStore((state) => state.stories);

  const [stories, setStories] = useState<typeof allStories>([]);
  const [isPro, setIsPro] = useState(false);

  /* =========================
     VERIFICA SE USUÁRIO É PRO
  ========================== */
  useEffect(() => {
    AsyncStorage.getItem("@user_is_pro").then((value) => {
      setIsPro(value === "true");
    });
  }, []);

  useEffect(() => {
    const targetCategory = categoryName ?? params.storyId;
    const filtered = allStories.filter(
      (s) => (s as any).category === targetCategory,
    );

    setStories(filtered);
  }, [categoryName, params.storyId, allStories]);

  const incrementStoryViews = async (storyId: string) => {
    const storyRef = doc(db, "stories", storyId);

    await updateDoc(storyRef, {
      views: increment(1),
    });

    useStoriesStore.setState((state) => ({
      stories: state.stories.map((story) =>
        story.id === storyId
          ? { ...story, views: (story.views ?? 0) + 1 }
          : story,
      ),
    }));
  };

  /* =========================
     RENDER DO CARD
  ========================== */
  const renderStory = ({ item }: { item: (typeof allStories)[0] }) => {
    const isPremium = item.isPro === true;
    const isLocked = isPremium && !isPro;

    return (
      <ModernCategoryCard
        onPress={async () => {
          if (isLocked) {
            router.push("/(subscribe)");
            return;
          }

          await incrementStoryViews(item.id);

          router.push({
            pathname: `/(storie)`,
            params: {
              title: item.title,
              storie: item.chapter[0].storie,
              thumbnail: item.chapter[0].thumbnail,
              storyId: item.id,
              currentIndex: 0,
            },
          });
        }}
      >
        {/* BADGE PREMIUM */}
        {isPremium && (
          <View style={styles.premiumBadge}>
            <FontAwesome6 name="crown" size={10} color="#FFD700" />

            <Text
              title="PREMIUM"
              fontFamily="bold"
              fontSize={11}
              color="#FFFFFF"
              style={{ marginLeft: 6 }}
            />
          </View>
        )}

        <ImageCard source={{ uri: item.thumbnail }}>
          {/* Mantivemos o Gradient escuro para o texto sempre ficar legível sobre qualquer imagem */}
          <Gradient
            colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
          >
            <Text
              title={item.title}
              fontFamily="bold"
              fontSize={16}
              color="#FFFFFF" // Branco contrastando com o gradient preto
              style={{ textAlign: "center", marginTop: 8 }}
            />

            {isLocked && (
              <Text
                title="Exclusivo para membros"
                fontFamily="regular"
                fontSize={12}
                color="#FFD700" // Amarelo/Dourado destaca bem em fundos escuros
                style={{ textAlign: "center", marginTop: 4 }}
              />
            )}
          </Gradient>
        </ImageCard>
      </ModernCategoryCard>
    );
  };

  return (
    <Container>
      {/* HEADER */}
      <View style={styles.contentHeader}>
        <Pressable
          style={styles.backButtonWrapper}
          onPress={() => router.back()}
        >
          <GlassView
            style={styles.buttonBack}
            isInteractive
            glassEffectStyle="light" // Alterado para light
          >
            <FontAwesome6
              name="chevron-left"
              size={22}
              color={Colors.light.text} // Ícone escuro
            />
          </GlassView>
        </Pressable>

        <Text
          fontFamily="bold"
          fontSize={24}
          color={Colors.light.text} // Título da categoria escuro
          style={{ textTransform: "capitalize" }} // Capitaliza a primeira letra da categoria
          title={categoryName || params.storyId}
        />

        <View style={{ width: 48 }} />
      </View>

      {/* LISTA */}
      <FlatList
        data={stories}
        renderItem={renderStory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
          marginHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  backButtonWrapper: {},
  contentHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  buttonBack: {
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 48,
    backgroundColor: "rgba(0, 0, 0, 0.05)", // Fundo sutil para garantir visibilidade do botão no tema claro
  },

  /* =========================
     BADGE PREMIUM
  ========================== */
  premiumBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(17, 24, 39, 0.85)", // Um cinza bem escuro com leve transparência para dar um ar mais premium
  },
});
