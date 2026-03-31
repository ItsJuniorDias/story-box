import { StyleSheet, View, Text, NativeModules } from "react-native";
// Importe o pacote com o nome que está no package.json do módulo

import UnityModule from "unity";

export default function CatRunnerScreen() {
  console.log(UnityModule.hello(), "unity module"); // Verifique se o módulo está sendo importado corretamente

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu App com Unity</Text>

      {/* A sua View nativa do iOS renderizada aqui */}
      <Text>{}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
  },
  unityContainer: {
    width: "100%",
    flex: 1, // Faz a Unity ocupar o resto da tela
  },
});
