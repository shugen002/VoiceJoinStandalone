# 哔哩哔哩与观众连麦第三方独立客户端

快可以出货了

## 介绍

与观众连麦功能出来很久了，可没有见到任何的第三方工具让不使用直播姬的用户可以用上这个功能，于是就按照声网(agora.io)的开发文档，加上一点Electron和Vue整出了这个东西

### 功能和未来

- [x] 登录，包括可能需要的验证码

- [x] 链接对应房间弹幕流

- [x] 模拟BiliBili Link 当前版本开播，让观众端显示与观众连麦按钮

- [x] 切换与观众连麦功能开关

- [x] 设置连麦规则

- [x] 手动拉取连麦等待列表

- [X] 自动更新连麦等待列表

- [x] 与观众连麦

- [x] 处理观众掉线或挂断

- [x] 设置音频输入输出设备 (暂不支持动态切换，暂不提供持续保存)

- [ ] 更好的接线台UI

- [x] 去除vuex的依赖（感觉没啥用

- [ ] 菜单下方显示当前通话人。


### 开发
Clone this repository, install dependencies and run using either `dev`, `debug` or `build` command.

```bash
# Clone this repository
git clone https://github.com/shugen002/VoiceJoinStandalone

# change directory to cloned path
cd VoiceJoinStandalone

# Install dependencies
npm install

# Run in `debug` mode, to debug app using VSCODE
npm run debug

# Run in `dev` mode
npm run dev

# Build installer for this app
npm run build
```
