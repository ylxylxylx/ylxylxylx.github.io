---
title: "解决git报错fatal: unable to access ‘https://github.com/xxx/xxx.git/‘: OpenSSL SSL_read: Connection"
date: "2025-04-22"
categories: "Git"
summary: "在使用 Git 进行代码管理的过程中，我们经常会遇到各种问题，其中之一就是在执行 git clone 或 git pull 等操作时出现以下报错："
---



在使用 Git 进行代码管理的过程中，我们经常会遇到各种问题，其中之一就是在执行 git clone 或 git pull 等操作时出现以下报错：

```c
fatal: unable to access 'https://github.com/.../.git': Recv failure:OpenSSL SSL_read: Connection
```
这个错误通常是由于 **网络连接问题** 或 **代理设置不正确**导致的。在实际使用中，这个问题可能会让开发者感到困扰，但通过一些简单的操作，通常可以快速解决。

在本文中，我将结合个人使用经验，分享两种有效的解决方法，帮助你快速定位并解决这个问题。

# 问题原因分析
 1. **网络连接问题：**
	- 本地网络不稳定，或者防火墙、公司网络策略限制了对 GitHub 的访问。
	- DNS 配置错误，导致无法正确解析 `github.com`。
2. 代理设置问题：
	- 配置了不正确的代理，或者代理服务不可用。
	- 代理服务器与 GitHub 的连接中断。
3. SSL/TLS 配置问题：
	- Git 或 OpenSSL 版本较旧，不支持 GitHub 所需的加密协议。

# 解决方法
## 方法一：取消代理设置
这是最常见的解决方法之一。如果你的网络环境不需要代理，但 Git 配置中存在代理设置，可能会导致连接问题。

### 操作步骤：
1. **取消 Git 的代理设置：**
	在终端中执行以下命令，清除全局的 HTTP 和 HTTPS 代理设置：

	```
	git config --global --unset http.proxy
	git config --global --unset https.proxy
	```

2. **验证代理是否清除：**
	执行以下命令，检查是否还有代理配置：
	```
	git config --global -l | grep proxy
	```
	如果没有输出，说明代理设置已成功清除。

3. **重试 Git 操作：**
再次执行 `git clone` 或 `git pull`，检查问题是否解决。

## 方法二：设置正确的系统代理
如果你的网络环境需要代理访问外部网络，那么取消代理设置可能无法解决问题。这时，你需要确保 Git 使用了正确的代理设置。

### 操作步骤：
1. **设置 Git 使用本地代理：**
	假设你的代理服务器运行在本地，端口为 10809，可以通过以下命令设置 Git 使用该代理：
	```
	git config --global http.proxy http://127.0.0.1:10809
	git config --global https.proxy http://127.0.0.1:10809
	```

2. **验证代理设置是否成功：**
	执行以下命令，检查代理配置是否生效：
	```
	git config --global -l
	```
	
	输出中应该包含类似以下内容：

	```
	http.proxy=http://127.0.0.1:10809
	https.proxy=http://127.0.0.1:10809
	```

3. **重试 Git 操作：**
	再次执行 `git clone` 或 `git pull`，检查问题是否解决。
## 其他可能的解决方案
1. ### 检查网络连接
	- 确保你可以正常访问 https://github.com。
	- 尝试使用其他网络环境（如手机热点）进行测试。
2.  ### 更新 Git 和 OpenSSL
	- 旧版本的 Git 或 OpenSSL 可能不支持最新的 TLS 协议。
	- 更新 Git 和 OpenSSL 到最新版本，确保兼容性。
3. ### 使用 SSH 替代 HTTPS
	- 如果 HTTPS 连接始终失败，可以尝试使用 SSH 协议：
	1. 生成 SSH 密钥对：
		```
		ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
		```
	
	2. 将公钥添加到 GitHub 的 SSH 设置中。
	3. 使用 SSH 地址克隆仓库：
		```
		git clone git@github.com:username/repository.git
		```

4. ### 禁用 SSL 验证（临时解决方案）
	- **不推荐**，仅用于测试：
		```
		git config --global http.sslVerify false
		```
