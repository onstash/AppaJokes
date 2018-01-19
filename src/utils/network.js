import { NetInfo } from "react-native";

export const fetchConnectionInfo = () => {
  return NetInfo.getConnectionInfo().then(
    ({ type: connectionType, effectiveType: effectiveConnectionType }) => {
      if (connectionType === "unknown" || connectionType === "none") {
        return { connectionType: "UNKNOWN" };
      }
      if (connectionType === "wifi") {
        return { connectionType: connectionType.toUpperCase() };
      }
      if (
        effectiveConnectionType &&
        typeof effectiveConnectionType === "string"
      ) {
        return { connectionType: effectiveConnectionType.toUpperCase() };
      }
      return { connectionType: "ERROR" };
    }
  );
};
