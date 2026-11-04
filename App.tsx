import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const hasRequestedPermission = useRef(false);

  useEffect(() => {
    if (
      permission &&
      !permission.granted &&
      permission.canAskAgain &&
      !hasRequestedPermission.current
    ) {
      hasRequestedPermission.current = true;
      void requestPermission();
    }
  }, [permission, requestPermission]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {permission?.granted ? (
        <CameraView style={StyleSheet.absoluteFill} facing="back" />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            {permission?.canAskAgain === false
              ? '请在系统设置中允许此应用访问摄像头'
              : '正在等待摄像头权限…'}
          </Text>
          {permission?.canAskAgain === false ? null : permission ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => void requestPermission()}
              style={styles.button}
            >
              <Text style={styles.buttonText}>允许访问摄像头</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
