import Text from "@/components/text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases from "react-native-purchases";

import { logEvent } from "@/services/analyticsHelper";

export default function SubscribeScreen() {
  const router = useRouter();

  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const offerings = await Purchases.getOfferings();

        console.log("Offerings:", offerings);

        if (offerings.current) {
          const availablePackages: any[] = [];

          if (offerings.current.monthly)
            availablePackages.push(offerings.current.monthly);

          if (offerings.current.annual)
            availablePackages.push(offerings.current.annual);

          setPackages(availablePackages);

          if (availablePackages.length > 0)
            setSelectedPackage(availablePackages[0]);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os planos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const saveProStatus = async (status: boolean) => {
    try {
      await AsyncStorage.setItem("@user_is_pro", JSON.stringify(status));
    } catch (e) {
      console.error("Erro ao salvar status Pro", e);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      setLoading(true);

      await logEvent("purchase_started", {
        source: "subscribe_screen",
        plan: selectedPackage.packageType === "MONTHLY" ? "monthly" : "annual",
        package: selectedPackage.identifier,
      });

      const purchase = await Purchases.purchasePackage(selectedPackage);

      if (purchase.customerInfo.entitlements.active["Story Box Pro"]) {
        await logEvent("purchase_successful", {
          source: "subscribe_screen",
          plan:
            selectedPackage.packageType === "MONTHLY" ? "monthly" : "annual",
          package: selectedPackage.identifier,
        });

        await saveProStatus(true);
        Alert.alert("Success", "Subscription activated!");

        router.back();
      }
    } catch (error: any) {
      if (error.userCancelled) {
        await logEvent("purchase_cancelled", {
          source: "subscribe_screen",
          plan:
            selectedPackage?.packageType === "MONTHLY" ? "monthly" : "annual",
          package: selectedPackage?.identifier,
          reason: "apple_sheet_closed",
        });
      } else {
        Alert.alert("Error", "An error occurred during purchase.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPackage = (item: any) => {
    const isSelected = selectedPackage?.identifier === item.identifier;
    const isMonthly = item.packageType === "MONTHLY";

    return (
      <TouchableOpacity
        key={item.identifier}
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => setSelectedPackage(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text
            title={item.packageType === "MONTHLY" ? "Monthly" : "Yearly"}
            fontFamily="bold"
            fontSize={22}
            color="#111827"
          />
        </View>

        <Text
          fontFamily="regular"
          fontSize={15}
          color="#4B5563"
          style={{ marginTop: 8 }}
          title={
            isMonthly
              ? "• Unlock all story chapters\n• Ad-free experience\n• Billed monthly"
              : "• Everything in Monthly\n• Best value for long stories\n• Billed annually"
          }
        />

        <View style={styles.priceRow}>
          <Text
            fontFamily="bold"
            fontSize={20}
            color={isSelected ? "#5C81F5" : "#111827"}
            title={item.product.priceString}
          />
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Text
                title="Selected"
                fontSize={12}
                color="#fff"
                fontFamily="bold"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Usando ScrollView nativo ao invés de FlatList */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 64,
          paddingBottom: 24, // Sem necessidade de 220px, pois o footer não é mais absoluto
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          title="Magic World Pro"
          fontFamily="bold"
          fontSize={32}
          color="#111827"
          style={{ marginBottom: 8 }}
        />
        <Text
          title="Unlock all chapters and exclusive content."
          fontFamily="regular"
          fontSize={16}
          color="#6B7280"
          style={{ marginBottom: 24 }}
        />

        {loading && packages.length === 0 ? (
          <ActivityIndicator
            size="large"
            color="#5C81F5"
            style={{ marginTop: 40 }}
          />
        ) : (
          <View style={{ gap: 16 }}>
            {packages.map((pkg) => renderPackage(pkg))}
          </View>
        )}
      </ScrollView>

      {/* Footer reposicionado na base usando o Flex do container principal */}
      {!loading && packages.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handlePurchase}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                title="Subscribe Now"
                fontFamily="bold"
                fontSize={18}
                color="#fff"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              await logEvent("purchase_cancelled", {
                source: "subscribe_screen",
                reason: "maybe_later",
              });
              router.back();
            }}
            style={{ marginTop: 16 }}
          >
            <Text
              title="Maybe Later"
              fontFamily="regular"
              fontSize={16}
              color="#6B7280"
              style={{ textAlign: "center" }}
            />
          </TouchableOpacity>

          <View style={styles.legalLinksRow}>
            <TouchableOpacity onPress={() => router.push("/(privacy-policy)")}>
              <Text
                title="Privacy Policy"
                fontSize={14}
                fontFamily="regular"
                color="#9CA3AF"
                style={{ textDecorationLine: "underline" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedCard: {
    borderColor: "#5C81F5",
    backgroundColor: "#EFF4FF", // Um azul um pouco mais claro e limpo para o selected no light theme
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  selectedBadge: {
    backgroundColor: "#5C81F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40, // Espaço para a Home Indicator do iOS
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  subscribeButton: {
    backgroundColor: "#5C81F5",
    borderRadius: 16,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5C81F5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  legalLinksRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
