import React, { useEffect } from "react";
import {
  requireNativeComponent,
  View,
  useWindowDimensions,
  StyleSheet,
  UIManager,
} from "react-native";

// 1. Tenta carregar o componente nativo e loga o resultado
console.log(
  "[JS-INIT] Tentando carregar requireNativeComponent('UnityView')...",
);
const NativeUnityView = requireNativeComponent<any>("UnityView");
console.log("[JS-INIT] NativeUnityView carregado:", !!NativeUnityView);

export function UnityView(props: any) {
  useEffect(() => {
    console.log(
      "[UnityView Wrapper] Montou! Repassando props para o nativo:",
      Object.keys(props),
    );

    return () => {
      console.log(
        "[UnityView Wrapper] Desmontou! A view nativa foi destruída.",
      );
    };
  }, []);

  if (!NativeUnityView) {
    console.error(
      "ERRO GRAVE: Módulo nativo do Unity não foi encontrado pelo UIManager.",
    );
    return <View style={{ flex: 1, backgroundColor: "red" }} />;
  }

  return <NativeUnityView {...props} />;
}

export default function RunnerCatScreen() {
  const { width, height } = useWindowDimensions();

  // 2. Monitora as dimensões da tela. Se for 0x0, a tela fica preta!
  useEffect(() => {
    console.log(
      `[RunnerCatScreen] Dimensões atualizadas -> Largura: ${width}, Altura: ${height}`,
    );
  }, [width, height]);

  // 3. Monitora se a tela principal montou corretamente
  useEffect(() => {
    console.log("[RunnerCatScreen] Tela principal montada na hierarquia.");
  }, []);

  const handleUnityMessage = (event: any) => {
    // Dependendo de como a biblioteca nativa envia o evento, o payload pode estar em event.nativeEvent
    console.log("[MENSAGEM DA UNITY] ->", event?.nativeEvent || event);
  };

  return (
    <View style={styles.container}>
      {/* Adicionei uma view colorida atrás da UnityView para depuração. 
          Se você ver AZUL, a UnityView está transparente ou não renderizou o jogo. 
          Se você ver VERMELHO (container), a UnityView está com tamanho zero. */}
      <View style={{ width: width, height: height, backgroundColor: "blue" }}>
        <UnityView
          style={{
            flex: 1, // Usar flex 1 garante que ele preencha a view pai (azul)
            width: width,
            height: height,
          }}
          onUnityMessage={handleUnityMessage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red", // Fundo vermelho para identificar se o container pai está colapsado
    justifyContent: "center",
    alignItems: "center",
  },
});
