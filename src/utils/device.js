import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

const isPlatformAndroid = Platform.OS === "android";
const androidAPILevels = {
  27: "Oreo v8.1",
  26: "Oreo v8.0",
  25: "Nougat v7.1 / v7.1.1",
  24: "Nougat v7.0",
  23: "Marshmallow v6.0",
  22: "Lollipop v5.1",
  21: "Lollipop v5.0",
  19: "Kitkat v4.4"
};

const deviceMetadata = {
  platform: Platform.OS,
  uniqueID: DeviceInfo.getUniqueID(),
  manufacturer: DeviceInfo.getManufacturer(),
  brand: DeviceInfo.getBrand(),
  model: DeviceInfo.getModel(),
  deviceID: DeviceInfo.getDeviceId(),
  systemName: DeviceInfo.getSystemName(),
  systemVersion: DeviceInfo.getSystemVersion(),
  bundleID: DeviceInfo.getBundleId(),
  buildVersion: DeviceInfo.getBuildNumber(),
  appVersion: DeviceInfo.getReadableVersion(),
  deviceLocale: DeviceInfo.getDeviceLocale(),
  deviceCountry: DeviceInfo.getDeviceCountry(),
  deviceTimezone: DeviceInfo.getTimezone(),
  androidAPILevel: isPlatformAndroid
    ? androidAPILevels[DeviceInfo.getAPILevel()]
    : null,
  firstInstallTime: isPlatformAndroid
    ? new Date(DeviceInfo.getFirstInstallTime())
    : null,
  lastUpdateTime: isPlatformAndroid
    ? new Date(DeviceInfo.getLastUpdateTime())
    : null,
  deviceCarrier: isPlatformAndroid ? DeviceInfo.getCarrier() : null
};

export default deviceMetadata;
