import { CameraView, useCameraPermissions } from 'expo-camera';
import { getBrightnessAsync, setBrightnessAsync } from 'expo-brightness';
import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  AppState,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function ManageScreenBrightness() {
  useEffect(() => {
    let originalBrightness: number | null = null;
    let isCancelled = false;

    const setMinimumBrightness = async () => {
      const brightness = await getBrightnessAsync();
      if (isCancelled) {
        return;
      }

      originalBrightness = brightness;
      await setBrightnessAsync(0);
    };

    const brightnessTask = setMinimumBrightness();
    void brightnessTask.catch((error: unknown) => {
      console.error('Failed to set minimum screen brightness.', error);
    });

    return () => {
      isCancelled = true;

      const restoreBrightness = async () => {
        if (originalBrightness !== null) {
          await setBrightnessAsync(originalBrightness);
        }
      };

      void brightnessTask
        .then(restoreBrightness, restoreBrightness)
        .catch((error: unknown) => {
          console.error('Failed to restore screen brightness.', error);
        });
    };
  }, []);

  return null;
}

function KeepScreenAwake() {
  useKeepAwake();
  return null;
}

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isAppActive, setIsAppActive] = useState(true);
  const hasRequestedPermission = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      setIsAppActive(state === 'active');
    });

    return () => subscription.remove();
  }, []);

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
        <>
          {isAppActive ? <ManageScreenBrightness /> : null}
          {isAppActive ? <KeepScreenAwake /> : null}
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            active={isAppActive}
            selectedLens="AVCaptureDeviceTypeBuiltInWideAngleCamera"
          />
        </>
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
