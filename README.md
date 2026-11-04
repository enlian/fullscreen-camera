# 横屏全屏摄像头预览

这是一个使用 Expo 和 React Native 编写的简单摄像头预览应用。应用以横屏显示摄像头实时画面，不拍照、不录像，也不请求麦克风权限。

## 功能

- 横屏全屏显示后置广角主摄的实时画面
- 摄像头预览期间将屏幕亮度调至最低，离开前台时恢复原亮度
- 摄像头预览期间保持屏幕常亮
- 应用进入后台时停止摄像头预览，返回前台后恢复
- 首次启动时请求摄像头权限
- 未授权时显示提示，可再次请求权限
- 隐藏系统状态栏

## 环境要求

- Node.js
- npm
- Expo Go（在 iPhone 或 Android 手机上安装）

## 安装和运行

在终端进入项目目录，安装依赖并启动 Expo：

```powershell
cd D:\Code\fullscreen-camera
npm install
npx expo start
```

使用手机上的 Expo Go 扫描终端或浏览器中显示的二维码。首次打开时，请允许应用访问摄像头。

## Expo CLI 登录

一般本地开发可以直接启动。如果 Expo 提示需要登录，在同一个 PowerShell 终端运行：

```powershell
$env:BROWSER="none"; npx expo login
```

将终端输出的新登录链接复制到浏览器中完成登录；保持终端开启，直到登录流程结束。然后验证登录状态并重新启动项目：

```powershell
npx expo whoami
npx expo start
```

登录链接是临时凭证，请勿分享给他人。

## 检查代码

```powershell
npx expo lint
npx tsc --noEmit
```
