# h265web.js-wasm-decoder

> #### [h265web.js播放器 - https://github.com/numberwolf/h265web.js](https://github.com/numberwolf/h265web.js) 底层解码API    
> #### 可以直接用于自定义开发H.265播放器

| Demo | 媒资信息 |
| ---- | ---- |
| <img src="assets/demo-wasm.png" width="300"> | Input #0, hevc, from `'res/video40_265_moov.hevc'`:<br>&nbsp;&nbsp;Duration: N/A, bitrate: N/A<br>&nbsp;&nbsp;&nbsp;&nbsp;Stream #0:0: `Video: hevc (Main), yuv420p(tv), 1280x720, 25 fps, 25 tbr, 1200k tbn, 25 tbc` |

## 目录

- [0、说明](#0说明)

	- [当前能力](#当前能力)

	- [当前版本token](#当前版本的token)

	- [联系我](#联系我)


- [1、快捷方式使用 - 完整Demo](#1快捷方式使用)

- [2、解码SDK使用文档](#2解码sdk使用文档)

	- [文件说明](#文件说明)

	- [安装](#安装)

	- [H.265/HEVC 数据解析器使用 - 分割帧](#h265数据解析器使用)

	- [H.265/HEVC 解码器使用](#h265解码器使用)

- [3、其它](#3其它)

	- [捐赠](#捐赠)
	
	- [FFmpeg转码H.265/HEVC编码的265测试文件](#ffmpeg转码h265编码的265测试文件)



### 0、说明 ###

#### 当前能力 ####

* 能力

|  能力 | 是否支持 | 其他 |
| ---- | ---- |  ----  |
| HEVC/H.265 Nalu解析 | 是 |  ----  | ---- |
| HEVC/H.265 帧解码 | 是 | ---- | ---- |


* 协议

|  协议 | 是否支持 | 说明 |
| ---- | ---- | ---- |
| HEVC/H.265 点播 | 是 | ---- |
| HEVC/H.265 点播 | 是 | ---- |

<br>

#### 当前版本的token ####

```javascript
token = "base64:QXV0aG9yOmNoYW5neWFubG9uZ3xudW1iZXJ3b2xmLEdpdGh1YjpodHRwczovL2dpdGh1Yi5jb20vbnVtYmVyd29sZixFbWFpbDpwb3JzY2hlZ3QyM0Bmb3htYWlsLmNvbSxRUTo1MzEzNjU4NzIsSG9tZVBhZ2U6aHR0cDovL3h2aWRlby52aWRlbyxEaXNjb3JkOm51bWJlcndvbGYjODY5NCx3ZWNoYXI6bnVtYmVyd29sZjExLEJlaWppbmcsV29ya0luOkJhaWR1";
```

<br>

#### 联系我 ####

* Github: https://github.com/numberwolf
* Email(porschegt23@foxmail.com)
* QQ: 531365872
* Discord:numberwolf#8694
* 微信:numberwolf11

<br>

## 1、快捷方式使用 ##

* 1）使用流程也可以直接看 [`example.js`](example.js) 和 [`example.html`](example.html) 的Demo使用

* 2）自己直接运行Demo

	* 将以下文件拷贝到http服务器下同目录访问即可

		* [example.html](example.html)
		* [example-dist.js](example-dist.js)
		* [missile-dec.wasm](missile-dec.wasm)

* 3）或者自己编译Demo

	* 编译
		```bash
		npm start
		```

	* 访问 
		* [http://127.0.0.1:8000/example.html](http://127.0.0.1:8000/example.html) 即可

<br>

## 2、播放器SDK使用文档 ##

### 文件说明 ###

* 核心文件

|  文件 | 必要 | 说明 | 其他 |
| ---- | ---- |  ----  |  ---- |
| [index.js](index.js) | 是 |  SDK入口文件  | ---- |
| [decoder.js](decoder.js) | 是 |  H.265解码能力  | ---- |
| [missile-dec.wasm](missile-dec.wasm) | 是 |  解码WASM  | ---- |
| [raw-parser.js](raw-parser.js) | 是 | 解析265流并分割Nalu |  ----  |
| [package.json](package.json) | 否 | ---- |  ----  |
| [package-lock.js](package-lock.js) | 否 | ---- |  ----  |

<br>

* Sdk使用示例Demo文件

|  文件 |  说明 | 其他 |
| ---- |   ----  |  ---- |
| [example.html](example.html) | 示例Html  | ---- |
| [example.js](example.js) | 示例API使用方法JS文件  | ---- |
| [example-dist.js](example-dist.js) | 直接编译好的可以直接使用的js文件  | 与wasm放同一个目录 |
| [render-yuv420p.js](render-yuv420p.js) | 渲染`YUV420P` |  这个最好自己写 这里只是一个demo |


<br>

### 安装 ###

* 将`核心文件`拷贝到你项目下同一目录

	* [index.js](index.js)
	* [decoder.js](decoder.js)
	* [missile-dec.wasm](missile-dec.wasm)
	* [raw-parser.js](raw-parser.js)

* 在你的工程文件引入 [index.js](index.js)

<br>

### H265数据解析器使用 ###

* 1）引入文件

	```javascript
	import MissileEngineDecoder from './index';
	```

* 2）新建H265数据解析器

	```javascript
	var rawParserObj = new MissileEngineDecoder.CRawParser();
	```

* 3）将H265的字节流数据`喂给解析器`

	##### 输入数据 `Uint8Array` 类型

	```javascript
	// Uint8Array chunk
	rawParserObj.appendStreamRet(chunk);
	```

* 4）从`解析器吐出` 一帧H265 数据

	##### 返回数据 `Uint8Array` 类型 (失败为`false`)

	```javascript
	let nalBuf = rawParserObj.nextNalu(); // nal
    if (nalBuf != false) {
    	// todo
    }
	```

* 5）完整示例代码

	```javascript
	import MissileEngineDecoder from './index';
	var url265 = "res/video40_265_moov.hevc";
	var rawParserObj = new MissileEngineDecoder.CRawParser();
    fetch(url265).then(function(response) {
        let pump = function(reader) {
            return reader.read().then(function(result) {
                if (result.done) {
                    // todo
                }
                let chunk = result.value;
                rawParserObj.appendStreamRet(chunk);
                return pump(reader);
            });
        }
        return pump(response.body.getReader());
    })
    .catch(function(error) {
        console.log(error);
    });
    for(var i = 0; i < 100; i++) {
	    let nalBuf = rawParserObj.nextNalu(); // nal
	    if (nalBuf != false) {
	    	// todo
	    }
	}
	```



<br>

### H265解码器使用 ###

* 1）引入文件

	```javascript
	import MissileEngineDecoder from './index';
	```

* 2）新建H265解码器

	```javascript
	var token = "base64:QXV0aG9yOmNoYW5neWFubG9uZ3xudW1iZXJ3b2xmLEdpdGh1YjpodHRwczovL2dpdGh1Yi5jb20vbnVtYmVyd29sZixFbWFpbDpwb3JzY2hlZ3QyM0Bmb3htYWlsLmNvbSxRUTo1MzEzNjU4NzIsSG9tZVBhZ2U6aHR0cDovL3h2aWRlby52aWRlbyxEaXNjb3JkOm51bWJlcndvbGYjODY5NCx3ZWNoYXI6bnVtYmVyd29sZjExLEJlaWppbmcsV29ya0luOkJhaWR1";
	var version = '100.1.0';
	var decoderMod = null;
	decoderMod = new MissileEngineDecoder.CMissileDecoder(token, version);
	```

* 3）解码器绑定回调事件 - 获取解码结果数据

	* 初始化成功回调 `decoderMod.initFinish = xxx`
	* 绑定解码成功事件 `decoderMod.bindCallback(callback)`

		##### a）解码成功事件函数原型
		```javascript
		function(
			y, u, v, 
			stride_y, stride_u, stride_v, 
			width, height, pts,
			pix_name
		) {
			// @TODO
		}
		```

		#### b）解码回调数据说明
		* y, u, v 
			* 说明：解码最终YUV数据 `Uint8Array` 类型
		* stride_y, stride_u, stride_v 
			* 说明：解码stride长度 `int` 类型
		* width, height, pts 
			* 说明：解码图像 长、宽、时间戳（用户传入一致）
		* pix_name 
			* 说明：解码YUV格式

	* 代码如下

		```javascript
		// 解码器初始化成功事件
		decoderMod.initFinish = () => {
			console.log("init Finshed");

			// 解码结果回调
			let bind_ret = decoderMod.bindCallback(function(
				y, u, v, 
				stride_y, stride_u, stride_v, 
				width, height, pts,
				pix_name) {

				console.log("======> One Frame ");
				console.log("======> ======> width, height, pts", width, height, pts);
				console.log("======> ======> pix_name", pix_name);
				console.log("======> ======> Y ", stride_y, y);
				console.log("======> ======> U ", stride_u, u);
				console.log("======> ======> V ", stride_v, v);
			});

			// todo
		};
		```

* 4）解码器初始化

	> 初始化成功后，会调用 `decoderMod.initFinish`

	```javascript
	decoderMod.initDecoder();
	```

* 5）解码一帧数据 - 解码结果最终会通过 `decoderMod.bindCallback(callback)` 回调回来

	* `Uint8Array` nalBuf 一帧265数据
	* `float32` pts 时间戳毫秒数据

	```javascript
	decoderMod.decodeNalu(nalBuf, pts);
	```

<br>

## 3、其它 ##

### 捐赠 ###

|  微信 | 支付宝 | PayPal |
|  ---- | ----  | ---- |
| <img src="assets/donate/wechat.JPG" height="500"> | <img src="assets/donate/alipay.JPG" height="500"> | TODO |

<br>


### FFmpeg转码H265编码的265测试文件 ###

* 用`ffmpeg`转码一个测试 `H.265/HEVC的` Demo文件

	```shell
	ffmpeg -i input265.mp4 -vcodec libx265 -an -vtag hev1 -y video40_265_moov.h265
	```




