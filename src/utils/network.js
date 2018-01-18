import { NetInfo } from "react-native";

export const fetchConnectionInfo = () => {
  return NetInfo.getConnectionInfo().then(
    ({ type: connectionType, effectiveConnectionType }) => {
      if (connectionType === "unknown" || connectionType === "none") {
        return { connectionType: "UNKNOWN" };
      }
      if (connectionType === "wifi") {
        return { connectionType: connectionType.toUpperCase() };
      }
      return { connectionType: effectiveConnectionType.toUpperCase() };
    }
  );
};
