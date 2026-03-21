import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import Text from "@/components/text";
import { Colors } from "@/constants/theme";
import { Container, ModernCategoryCard } from "./styles";

const categories = [
  { id: "1", title: "adventure", icon: "map" },
  { id: "2", title: "romance", icon: "heart-broken" },
  { id: "3", title: "fantasy", icon: "star" },
  { id: "4", title: "mystery", icon: "search" },
  { id: "5", title: "future", icon: "rocket" },
];

export default function CategoriesScreen() {
  const renderCategory = ({ item }: { item: (typeof categories)[0] }) => (
    <ModernCategoryCard
      key={item.id}
      onPress={() => router.push(`/(categories-detail)?category=${item.title}`)}
    >
      {/* Ícone com a cor primária para dar destaque no card de fundo claro */}
      <MaterialIcons
        name={item.icon as any}
        size={36}
        color={Colors.light.tint || "#5C81F5"}
      />
      <Text
        title={item.title}
        fontFamily="bold"
        fontSize={16}
        color={Colors.light.text} // Texto principal escuro
        style={{
          marginTop: 12,
          textAlign: "center",
          textTransform: "capitalize",
        }} // Capitalize para ficar "Adventure" ao invés de "adventure"
      />
    </ModernCategoryCard>
  );

  return (
    <Container
      style={{ flex: 1, backgroundColor: "#F8F9FA" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentHeader}>
        <Pressable
          style={styles.backButtonWrapper}
          onPress={() => router.back()}
        >
          <GlassView
            style={styles.buttonBack}
            isInteractive
            glassEffectStyle="light" // Alterado para light para melhor contraste no tema claro
          >
            <FontAwesome6
              name="chevron-left"
              size={22}
              color={Colors.light.text} // Ícone do botão de voltar escuro
            />
          </GlassView>
        </Pressable>

        <Text
          fontFamily="bold"
          fontSize={24}
          color={Colors.light.text} // Título da página escuro
          title="Categories"
        />

        <View style={{ width: 48 }} />
      </View>

      {/* LISTA DE CATEGORIAS EM DUAS COLUNAS */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
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
  backButtonWrapper: {
    // top: 16,
    // left: 24,
  },
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
    backgroundColor: "rgba(0, 0, 0, 0.05)", // Um fundo leve e semitransparente caso o GlassView precise de mais definição no claro
  },
});
