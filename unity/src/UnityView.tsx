import { requireNativeComponent } from "react-native";
import * as React from "react";

import { UnityViewProps } from "./Unity.types";

const UnityViewNative = requireNativeComponent<UnityViewProps>("UnityView");

export default function UnityView(props: UnityViewProps) {
  return <UnityViewNative {...props} />;
}
