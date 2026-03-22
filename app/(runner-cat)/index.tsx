import {
  requireNativeComponent,
  View,
  useWindowDimensions,
  StyleSheet,
  UIManager,
} from "react-native";

const NativeUnityView = requireNativeComponent<any>("UnityView");

export function UnityView(props: any) {
  if (!NativeUnityView) {
    console.error(
      "ERRO GRAVE: Módulo nativo do Unity não foi encontrado pelo UIManager.",
    );
    return <View style={{ flex: 1, backgroundColor: "red" }} />;
  }

  return <NativeUnityView {...props} />;
}

export default function RunnerCatScreen() {
  // Esse hook escuta mudanças de orientação automaticamente
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <UnityView
        style={{
          width: width,
          height: height,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Fundo preto evita flashes brancos na rotação
  },
});
