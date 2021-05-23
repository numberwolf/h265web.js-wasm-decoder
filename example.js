/**
 * @author changyanlong
 * @email porschegt23@foxmail.com
 * @qq 531365872
 * @wechat numberwolf11
 * @github github.com/numberwolf
 */

import MissileEngineDecoder from './index';
import RenderEngine420P from './render-yuv420p';

var token = "base64:QXV0aG9yOmNoYW5neWFubG9uZ3xudW1iZXJ3b2xmLEdpdGh1YjpodHRwczovL2dpdGh1Yi5jb20vbnVtYmVyd29sZixFbWFpbDpwb3JzY2hlZ3QyM0Bmb3htYWlsLmNvbSxRUTo1MzEzNjU4NzIsSG9tZVBhZ2U6aHR0cDovL3h2aWRlby52aWRlbyxEaXNjb3JkOm51bWJlcndvbGYjODY5NCx3ZWNoYXI6bnVtYmVyd29sZjExLEJlaWppbmcsV29ya0luOkJhaWR1";
var version = '100.2.0';
var url265 = "res/video40_265_moov_30s.hevc";
var url265_2 = "res/spreedmovie.hevc";

var networkInterval = null;
var networkInterval2 = null;

var timerFeed = null;
var timerFeed2 = null;

var rawParserObj = null;
var rawParserObj2 = null;

var decoderMod = null;
var decoderMod2 = null;

var canvas = document.querySelector('#canvas');
var canvas2 = document.querySelector('#canvas2');

var start1btn = document.querySelector('#start1-btn');
var start2btn = document.querySelector('#start2-btn');

var release1btn = document.querySelector('#release1-btn');
var release2btn = document.querySelector('#release2-btn');

var yuv = RenderEngine420P.setupCanvas(canvas, {
    preserveDrawingBuffer: false
});

var yuv2 = RenderEngine420P.setupCanvas(canvas2, {
    preserveDrawingBuffer: false
});

start1btn.onclick = () => {
	var main = () => {
		rawParserObj = new MissileEngineDecoder.CRawParser();
		var fileStart = 0;
		var startFetch = false;
		networkInterval = window.setInterval(() => {
		    if (!startFetch) {
		        startFetch = true;
		        fetch(url265).then(function(response) {
		            let pump = function(reader) {
		                return reader.read().then(function(result) {
		                    if (result.done) {
		                        window.clearInterval(networkInterval);
		                        return;
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
		    }
		}, 1);

		var ptsIdx = 0;
		timerFeed = window.setInterval(() => {
		    let nalBuf = rawParserObj.nextNalu(); // nal
		    if (nalBuf != false) {
		    	decoderMod.decodeNalu(nalBuf, ptsIdx);
		    	ptsIdx++;
		    }
		}, 2);
	};


	// 1
	decoderMod = new MissileEngineDecoder.CMissileDecoder(token, version);
	release1btn.onclick = () => {
		if (networkInterval !== null) {
			window.clearInterval(networkInterval);
			networkInterval = null;
		}

		if (timerFeed !== null) {
			window.clearInterval(timerFeed);
			timerFeed = null;
		}

		rawParserObj.release();
		rawParserObj = null;

		decoderMod.release();
		decoderMod = null;
	};
	// 2
	decoderMod.initFinish = () => {
		console.log("init Finshed");
		let bind_ret = decoderMod.bindCallback(function(
			y, u, v, 
			stride_y, stride_u, stride_v, 
			width, height, pts,
			pix_name) {

			// console.log("======> One Frame ");
			// console.log("======> ======> width, height, pts", width, height, pts);
			// console.log("======> ======> pix_name", pix_name);
			// console.log("======> ======> Y ", stride_y, y);
			// console.log("======> ======> U ", stride_u, u);
			// console.log("======> ======> V ", stride_v, v);

			RenderEngine420P.renderFrame(
	            yuv,
	            y, u, v,
	            stride_y, height);
		});
		console.log("bind ret ", bind_ret);

		main();
	};
	// 3
	decoderMod.initDecoder();
};


/*
 * Second decoder
 */
start2btn.onclick = () => {
	var main2 = () => {
		rawParserObj2 = new MissileEngineDecoder.CRawParser();
		var fileStart = 0;
		var startFetch = false;
		networkInterval2 = window.setInterval(() => {
		    if (!startFetch) {
		        startFetch = true;
		        fetch(url265_2).then(function(response) {
		            let pump = function(reader) {
		                return reader.read().then(function(result) {
		                    if (result.done) {
		                        window.clearInterval(networkInterval2);
		                        return;
		                    }
		                    let chunk = result.value;
		                    rawParserObj2.appendStreamRet(chunk);
		                    return pump(reader);
		                });
		            }
		            return pump(response.body.getReader());
		        })
		        .catch(function(error) {
		            console.log(error);
		        });
		    }
		}, 1);

		var ptsIdx = 0;
		timerFeed2 = window.setInterval(() => {
		    let nalBuf = rawParserObj2.nextNalu(); // nal
		    if (nalBuf != false) {
		    	decoderMod2.decodeNalu(nalBuf, ptsIdx);
		    	ptsIdx++;
		    }
		}, 2);
	};

	// 1
	decoderMod2 = new MissileEngineDecoder.CMissileDecoder(token, version);
	release2btn.onclick = () => {
		if (networkInterval2 !== null) {
			window.clearInterval(networkInterval2);
			networkInterval2 = null;
		}

		if (timerFeed2 !== null) {
			window.clearInterval(timerFeed2);
			timerFeed2 = null;
		}

		rawParserObj2.release();
		rawParserObj2 = null;

		decoderMod2.release();
		decoderMod2 = null;
	};
	// 2
	decoderMod2.initFinish = () => {
		console.log("init second Finshed");
		let bind_ret = decoderMod2.bindCallback(function(
			y, u, v, 
			stride_y, stride_u, stride_v, 
			width, height, pts,
			pix_name) {

			// console.log("======> One Frame in Second");
			// console.log("======> ======> width, height, pts", width, height, pts);
			// console.log("======> ======> pix_name", pix_name);
			// console.log("======> ======> Y ", stride_y, y);
			// console.log("======> ======> U ", stride_u, u);
			// console.log("======> ======> V ", stride_v, v);

			RenderEngine420P.renderFrame(
	            yuv2,
	            y, u, v,
	            stride_y, height);
		});
		console.log("bind second ret ", bind_ret);
		main2();
	};
	// 3
	decoderMod2.initDecoder();
};









