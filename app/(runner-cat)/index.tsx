import React, { useEffect } from "react";
import { requireNativeComponent, View, StyleSheet } from "react-native";

const NativeUnityView = requireNativeComponent("UnityView");

export function UnityView(props) {
  if (!NativeUnityView) return null;
  return <NativeUnityView {...props} />;
}

export default function RunnerCatScreen() {
  const handleUnityMessage = (event) => {
    console.log("[MENSAGEM DA UNITY] ->", event?.nativeEvent || event);
  };

  return (
    // Fundo vermelho para debug
    <View>
      <UnityView
        style={StyleSheet.absoluteFillObject} // Força a view do Unity a preencher tudo
        onUnityMessage={handleUnityMessage}
      />
    </View>
  );
}
