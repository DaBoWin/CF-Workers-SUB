
// 部署完成后在网址后面加上这个，获取自建节点和机场聚合节点，/?token=auto或/auto或

let mytoken = 'auto'; //可以随便取，或者uuid生成，https://1024tools.com/uuid
let BotToken =''; //可以为空，或者@BotFather中输入/start，/newbot，并关注机器人
let ChatID =''; //可以为空，或者@userinfobot中获取，/start
let TG = 0; //小白勿动， 开发者专用，1 为推送所有的访问信息，0 为不推送订阅转换后端的访问信息与异常访问
let FileName = 'CF-Workers-SUB';
let SUBUpdateTime = 6; //自定义订阅更新时间，单位小时
let total = 99;//TB
let timestamp = 4102329600000;//2099-12-31

//节点链接 + 订阅链接
let MainData = `
vmess://ew0KICAidiI6ICIyIiwNCiAgInBzIjogIm9yYS1zZy12bS1iMHpyZnJwYiIsDQogICJhZGQiOiAib3Jhc2cuZWN1cC5ueWMubW4iLA0KICAicG9ydCI6ICI0NDMiLA0KICAiaWQiOiAiMmUyMzUyNTgtNTYxYS00ZjE5LTkwZTAtMzM2ZjgwYWM5MzQ1IiwNCiAgImFpZCI6ICIwIiwNCiAgInNjeSI6ICJhdXRvIiwNCiAgIm5ldCI6ICJ3cyIsDQogICJ0eXBlIjogIm5vbmUiLA0KICAiaG9zdCI6ICJvcmFzZy5lY3VwLm55Yy5tbiIsDQogICJwYXRoIjogIi8/ZWQ9MjA0OCIsDQogICJ0bHMiOiAidGxzIiwNCiAgInNuaSI6ICJvcmFzZy5lY3VwLm55Yy5tbiIsDQogICJhbHBuIjogIiIsDQogICJmcCI6ICIiDQp9
`

let urls = [];
let subconverter = "subapi-loadbalancing.pages.dev"; //在线订阅转换后端，目前使用CM的订阅转换功能。支持自建psub 可自行搭建https://github.com/bulianglin/psub
let subconfig = "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_MultiCountry.ini"; //订阅配置文件

let subproxyUrl = `
https://yu.qqyy.qzz.io/yuu
`;
let encodedData = '';
let lastDebugInfo = [];

export default {
	async fetch (request,env) {
		const userAgentHeader = request.headers.get('User-Agent');
		const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
		const url = new URL(request.url);
		const token = url.searchParams.get('token');
		mytoken = env.TOKEN || mytoken;
		BotToken = env.TGTOKEN || BotToken;
		ChatID = env.TGID || ChatID; 
		TG =  env.TG || TG; 
		subconverter = env.SUBAPI || subconverter;
		subconfig = env.SUBCONFIG || subconfig;
		FileName = env.SUBNAME || FileName;
		MainData = env.LINK || MainData;
		if(env.LINKSUB) urls = await ADD(env.LINKSUB);
		subproxyUrl = env.SUBPROXYURL || subproxyUrl;

		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0); 
		const timeTemp = Math.ceil(currentDate.getTime() / 1000);
		const fakeToken = await MD5MD5(`${mytoken}${timeTemp}`);
		//console.log(`${fakeUserID}\n${fakeHostName}`); // 打印fakeID

		let UD = Math.floor(((timestamp - Date.now())/timestamp * total * 1099511627776 )/2);
		total = total * 1099511627776 ;
		let expire= Math.floor(timestamp / 1000) ;
		SUBUpdateTime = env.SUBUPTIME || SUBUpdateTime;

		// 获取优选IP端口订阅数据
		lastDebugInfo = [];
		encodedData = await fetchMultipleSubscriptions(subproxyUrl);

		if (url.pathname === "/debug") {
			let decoded = '';
			try {
				decoded = encodedData ? base64Decode(encodedData.trim()) : '';
			} catch (e) {
				decoded = '';
			}
			const lines = decoded ? normalizeLines(decoded) : [];
			const ipPortList = decoded ? parseIPPort(lines.join('\n')) : [];
			let 重新汇总所有链接_调试 = await ADD(MainData + '\n' + (urls && urls.length ? urls.join('\n') : ''));
			let 调试替换结果 = [];
			const additionalName = "@bestvpschat";
			for (let x of 重新汇总所有链接_调试) {
				if (!x.toLowerCase().startsWith('http')) {
					const newLinks = getEncodedNewLinks(x, additionalName);
					if (newLinks && newLinks.length) {
						for (const n of newLinks) {
							调试替换结果.push(n);
						}
					}
				}
			}

			const ipListPreview = ipPortList.slice(0, 100).map((x, i) => `${i+1}. ${x.ip}:${x.port}${x.name ? ' #' + x.name : ''}`).join('\n');
			const replacePreview = 调试替换结果.slice(0, 100).join('\n');
			const sourceDebug = lastDebugInfo && lastDebugInfo.length ? lastDebugInfo.map((d, i) => `${i+1}. URL: ${d.url}\n   ok=${d.ok} status=${d.status} length=${d.length}${d.ct ? ` ct=${d.ct}` : ''}${d.base64!==undefined ? ` base64=${d.base64}` : ''}${d.error ? `\n   error=${d.error}` : ''}${d.sample ? `\n   sample=${d.sample}` : ''}`).join('\n\n') : '无';
			const html = `<!doctype html><html><head><meta charset="utf-8"><title>CF-Workers-SUB Debug</title><style>body{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;padding:16px;line-height:1.4} pre{background:#f6f8fa;padding:12px;overflow:auto;border-radius:6px} h2{margin-top:24px}</style></head><body>
			<h1>Debug</h1>
			<div>SUBPROXYURL 源: <pre>${(subproxyUrl || '').toString().replace(/</g,'&lt;')}</pre></div>
			<div>抓取结果（解码后）行数: ${lines.length}</div>
			<h2>源抓取状态</h2>
			<pre>${sourceDebug}</pre>
			<h2>解析到的 IPv4:端口 (前100条)</h2>
			<pre>${ipListPreview || '无'}</pre>
			<h2>替换结果 (前100条)</h2>
			<div>总计: ${调试替换结果.length}</div>
			<pre>${replacePreview || '无'}</pre>
			</body></html>`;
			return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
		}

		let 重新汇总所有链接 = await ADD(MainData + '\n' + urls.join('\n'));
		let 自建节点 ="";
		let 订阅链接 ="";
		for (let x of 重新汇总所有链接) {
			if (x.toLowerCase().startsWith('http')) {
				订阅链接 += x + '\n';
			} else {
				//这里裂变所有可替换节点的优选IP和端口
				const additionalName = "@bestvpschat"; // 你想要增加的名称
				const newLinks = getEncodedNewLinks(x, additionalName);

				if (newLinks.length > 0) {
				   newLinks.forEach(newLink => {
					自建节点 += newLink + '\n';
				   });
				} else {
				   自建节点 += x + '\n';
				}
				
				//自建节点 += x + '\n';
			}
		}
		MainData = 自建节点;
		urls = await ADD(订阅链接);

		if ( !(token == mytoken || token == fakeToken || url.pathname == ("/"+ mytoken) || url.pathname.includes("/"+ mytoken + "?")) ) {
			if ( TG == 1 && url.pathname !== "/" && url.pathname !== "/favicon.ico" ) await sendMessage(`#异常访问 ${FileName}`, request.headers.get('CF-Connecting-IP'), `UA: ${userAgent}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
			const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
			if (envKey) {
				const URLs = await ADD(env[envKey]);
				const URL = URLs[Math.floor(Math.random() * URLs.length)];
				return envKey === 'URL302' ? Response.redirect(URL, 302) : fetch(new Request(URL, request));
			}
			return new Response(await nginx(), { 
				status: 200 ,
				headers: {
					'Content-Type': 'text/html; charset=UTF-8',
				},
			});
		} else {
			await sendMessage(`#获取订阅 ${FileName}`, request.headers.get('CF-Connecting-IP'), `UA: ${userAgentHeader}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
			let 订阅格式 = 'base64';
			if (userAgent.includes('null') || userAgent.includes('subconverter') || userAgent.includes('nekobox') || userAgent.includes(('CF-Workers-SUB').toLowerCase())){
				订阅格式 = 'base64';
			} else if (userAgent.includes('clash') || ( url.searchParams.has('clash') && !userAgent.includes('subconverter'))){
				订阅格式 = 'clash';
			} else if (userAgent.includes('sing-box') || userAgent.includes('singbox') || ( (url.searchParams.has('sb') || url.searchParams.has('singbox')) && !userAgent.includes('subconverter'))){
				订阅格式 = 'singbox';
			}

			let subconverterUrl ;
			let 订阅转换URL = `${url.origin}/${await MD5MD5(fakeToken)}?token=${fakeToken}`;
			//console.log(订阅转换URL);
			let req_data = MainData;
			// 创建一个AbortController对象，用于控制fetch请求的取消
			const controller = new AbortController();
	
			const timeout = setTimeout(() => {
				controller.abort(); // 取消所有请求
			}, 2000); // 2秒后触发
	

			let 追加UA = 'v2rayn';
			if (url.searchParams.has('clash')){
				追加UA = 'clash';
			} else if(url.searchParams.has('singbox')){
				追加UA = 'singbox';
			}
			
			try {
				const responses = await Promise.allSettled(urls.map(url =>
					fetch(url, {
						method: 'get',
						headers: {
							'Accept': 'text/html,application/xhtml+xml,application/xml;',
							'User-Agent': `${追加UA} cmliu/CF-Workers-SUB ${userAgentHeader}`
						},
						signal: controller.signal // 将AbortController的信号量添加到fetch请求中，以便于需要时可以取消请求
					}).then(response => {
						if (response.ok) {
							return response.text().then(content => {
								// 这里可以顺便做内容检查
								if (content.includes('dns') && content.includes('proxies') && content.includes('proxy-groups')) {
									//console.log("clashsub: " + url);
									订阅转换URL += "|" + url;
								} else if (content.includes('dns') && content.includes('outbounds') && content.includes('inbounds')){
									//console.log("singboxsub: " + url);
									订阅转换URL += "|" + url;
								} else {
									//console.log("未识别" + url);
									return content; // 保证链式调用中的下一个then可以接收到文本内容
								}
								//console.log(content);
							});
						} else {
							return ""; // 如果response.ok为false，返回空字符串
						}
					})
				));	
			
				for (const response of responses) {
					if (response.status === 'fulfilled' && response.value) {
						const content = response.value;
						req_data += base64Decode(content) + '\n';
					}
				}
			
			} catch (error) {
				//console.error(error);
			} finally {
				// 无论成功或失败，最后都清除设置的超时定时器
				clearTimeout(timeout);
			}

			//修复中文错误
			const utf8Encoder = new TextEncoder();
			const encodedData = utf8Encoder.encode(req_data);
			const text = String.fromCharCode.apply(null, encodedData);
			
			//去重
			const uniqueLines = new Set(text.split('\n'));
			const result = [...uniqueLines].join('\n');
			console.log(result);
			
			const base64Data = btoa(result);

			if (订阅格式 == 'base64' || token == fakeToken){
				return new Response(base64Data ,{
					headers: { 
						"content-type": "text/plain; charset=utf-8",
						"Profile-Update-Interval": `${SUBUpdateTime}`,
						"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
					}
				});
			} else if (订阅格式 == 'clash'){
				subconverterUrl = `https://${subconverter}/sub?target=clash&url=${encodeURIComponent(订阅转换URL)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
			} else if (订阅格式 == 'singbox'){
				subconverterUrl = `https://${subconverter}/sub?target=singbox&url=${encodeURIComponent(订阅转换URL)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
			}
			console.log(订阅转换URL);
			try {
				const subconverterResponse = await fetch(subconverterUrl);
				
				if (!subconverterResponse.ok) {
					return new Response(base64Data ,{
						headers: { 
							"content-type": "text/plain; charset=utf-8",
							"Profile-Update-Interval": `${SUBUpdateTime}`,
							"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
						}
					});
					//throw new Error(`Error fetching subconverterUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
				}
				let subconverterContent = await subconverterResponse.text();
				if (订阅格式 == 'clash') subconverterContent =await clashFix(subconverterContent);
				return new Response(subconverterContent, {
					headers: { 
						"Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
						"content-type": "text/plain; charset=utf-8",
						"Profile-Update-Interval": `${SUBUpdateTime}`,
						"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,

					},
				});
			} catch (error) {
				return new Response(base64Data ,{
					headers: { 
						"content-type": "text/plain; charset=utf-8",
						"Profile-Update-Interval": `${SUBUpdateTime}`,
						"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
					}
				});
			}
		}
	}
};

async function ADD(envadd) {
	var addtext = envadd.replace(/[	"'|\r\n]+/g, ',').replace(/,+/g, ',');  // 将空格、双引号、单引号和换行符替换为逗号
	//console.log(addtext);
	if (addtext.charAt(0) == ',') addtext = addtext.slice(1);
	if (addtext.charAt(addtext.length -1) == ',') addtext = addtext.slice(0, addtext.length - 1);
	const add = addtext.split(',');
	//console.log(add);
	return add ;
}

async function nginx() {
	const text = `
	<!DOCTYPE html>
	<html>
	<head>
	<title>Welcome to nginx!</title>
	<style>
		body {
			width: 35em;
			margin: 0 auto;
			font-family: Tahoma, Verdana, Arial, sans-serif;
		}
	</style>
	</head>
	<body>
	<h1>Welcome to nginx!</h1>
	<p>If you see this page, the nginx web server is successfully installed and
	working. Further configuration is required.</p>
	
	<p>For online documentation and support please refer to
	<a href="http://nginx.org/">nginx.org</a>.<br/>
	Commercial support is available at
	<a href="http://nginx.com/">nginx.com</a>.</p>
	
	<p><em>Thank you for using nginx.</em></p>
	</body>
	</html>
	`
	return text ;
}

async function sendMessage(type, ip, add_data = "") {
	if ( BotToken !== '' && ChatID !== ''){
		let msg = "";
		const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
		if (response.status == 200) {
			const ipInfo = await response.json();
			msg = `${type}\nIP: ${ip}\n国家: ${ipInfo.country}\n<tg-spoiler>城市: ${ipInfo.city}\n组织: ${ipInfo.org}\nASN: ${ipInfo.as}\n${add_data}`;
		} else {
			msg = `${type}\nIP: ${ip}\n<tg-spoiler>${add_data}`;
		}
	
		let url = "https://api.telegram.org/bot"+ BotToken +"/sendMessage?chat_id=" + ChatID + "&parse_mode=HTML&text=" + encodeURIComponent(msg);
		return fetch(url, {
			method: 'get',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'Accept-Encoding': 'gzip, deflate, br',
				'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
			}
		});
	}
}

function base64Decode(str) {
	const bytes = new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)));
	const decoder = new TextDecoder('utf-8');
	return decoder.decode(bytes);
}

async function MD5MD5(text) {
	const encoder = new TextEncoder();
  
	const firstPass = await crypto.subtle.digest('MD5', encoder.encode(text));
	const firstPassArray = Array.from(new Uint8Array(firstPass));
	const firstHex = firstPassArray.map(b => b.toString(16).padStart(2, '0')).join('');

	const secondPass = await crypto.subtle.digest('MD5', encoder.encode(firstHex.slice(7, 27)));
	const secondPassArray = Array.from(new Uint8Array(secondPass));
	const secondHex = secondPassArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
	return secondHex.toLowerCase();
}

async function fetchSubscription(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        return text;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function fetchSubscriptionDebug(url) {
    const info = { url, ok: false, status: 0, ct: '', length: 0, base64: undefined, sample: '', error: '' };
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain, text/*, */*;q=0.1',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'User-Agent': 'CF-Workers-SUB Debug/1.0'
            }
        });
        info.status = response.status;
        info.ct = response.headers.get('content-type') || '';
        const text = await response.text();
        info.length = text.length;
        info.ok = response.ok;
        try { info.base64 = isBase64(text); } catch (e) { info.base64 = false; }
        info.sample = text.slice(0, 200).replace(/\n/g, ' ');
        return { info, text };
    } catch (error) {
        info.error = String(error && error.message ? error.message : error);
        return { info, text: '' };
    }
}

async function fetchMultipleSubscriptions(urls) {
    try {
        const urlArray = urls.split('\n').slice(0, 10);
        const results = await Promise.all(urlArray.map(async (url) => {
            const trimmedUrl = url.trim(); // 去除可能存在的多余空格
            if (trimmedUrl) {
                const { info, text } = await fetchSubscriptionDebug(trimmedUrl);
                (lastDebugInfo || (lastDebugInfo = [])).push(info);
                if (!info.ok || !text) return '';
                let decodedResult = text;
                if (isBase64(text)) {
                    decodedResult = base64Decode(text);
                }
                const tokens = normalizeLines(decodedResult);
                return base64Encode(tokens.slice(0, 100).join('\n'));
            }
            return ''; // 返回空字符串以确保结果数组长度一致
        }));
        return results.join('\n'); // 将所有结果拼接成一个字符串
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function clashFix(content) {
	if(content.includes('wireguard') && !content.includes('remote-dns-resolve')){
		let lines;
		if (content.includes('\r\n')){
			lines = content.split('\r\n');
		} else {
			lines = content.split('\n');
		}
	
		let result = "";
		for (let line of lines) {
			if (line.includes('type: wireguard')) {
				const 备改内容 = `, mtu: 1280, udp: true`;
				const 正确内容 = `, mtu: 1280, remote-dns-resolve: true, udp: true`;
				result += line.replace(new RegExp(备改内容, 'g'), 正确内容) + '\n';
			} else {
				result += line + '\n';
			}
		}

		content = result;
	}
	return content;
}

// 判断字符串是否为Base64编码
function isBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}

// Base64编码函数
function base64Encode(str) {
    try {
        return btoa(str);
    } catch (error) {
        console.error('There has been a problem with your Base64 encoding operation:', error);
    }
}


// 规范化订阅内容为逐行的 IP:端口[#名称]
function normalizeLines(text) {
    if (!text) return [];
    // 统一换行符，然后按空白/逗号切分，过滤空条目
    const tokens = text.replace(/\r/g, '\n').split(/[\s,]+/).filter(Boolean);
    // 仅保留包含 ":<port>" 的候选
    const candidates = tokens.filter(t => /:\d+/.test(t));
    return candidates;
}

// 解析IP、端口和名称信息
function parseIPPort(data) {
    const lines = data.split('\n');
    const ipPortList = lines.map(line => {
        let match = line.match(/@([^:]+):(\d+)(#(.*))?/);
	if (!match) {
            // 尝试匹配纯 IP:端口 格式
            match = line.match(/([^:]+):(\d+)(#(.*))?/);
        }
        if (match) {
		if (isValidIPv4(match[1])) {
			const lastHashIndex = line.lastIndexOf('#');
            		let name = lastHashIndex !== -1 ? line.substring(lastHashIndex + 1) : '';
            		return { ip: match[1], port: match[2], name };
		}
        }
        return null;
    }).filter(entry => entry !== null); // 过滤掉无效的条目
    return ipPortList;
}

function isValidIPv4(ip) {
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Pattern.test(ip);
}

// 替换vmess链接中的IP和端口，并在原有ps标签基础上增加新的名称
function replaceVmessIPPort(template, ip, port, newName) {
    // 使用正则表达式获取ps标签的值
    const psMatch = template.match(/"ps":\s*"(.*?)"/);
    const originalName = psMatch ? decodeURIComponent(psMatch[1]) : '';
    const finalName = originalName ? `${originalName}|${newName}` : newName;
    
    const replacedTemplate = template
        .replace(/"add":\s*".*?"/, `"add": "${ip}"`)
        .replace(/"port":\s*"\d+"/, `"port": "${port}"`)
        .replace(/"ps":\s*".*?"/, `"ps": "${finalName}"`);

    return replacedTemplate;
}

// 替换vless链接中的IP和端口，并在原有名称基础上增加新的名称
function replaceVlessIPPort(template, ip, port, newName) {
    const originalNameMatch = template.match(/#(.*)$/);
    const originalName = originalNameMatch ? decodeURIComponent(originalNameMatch[1]) : '';
    const finalName = originalName ? `${originalName}|${newName}` : newName;
    return template.replace(/@[^:]+:\d+/, `@${ip}:${port}`).replace(/#.*$/, `#${finalName}`);
}

// 获取encodedNewLinks的方法
function getEncodedNewLinks(templateLink, additionalName) {
    const newLinks = [];

    // 判断是vmess还是vless链接
    const isVmess = templateLink.startsWith("vmess://");
    const isVless = templateLink.startsWith("vless://");

    // 去掉前缀
    if (isVmess) {
        templateLink = templateLink.slice(8);
    } else if (isVless) {
        templateLink = templateLink.slice(8);
    }

    // 判断templateLink是否为Base64编码并进行解码（仅针对vmess）
    if (isVmess && isBase64(templateLink)) {
        templateLink = base64Decode(templateLink);
    }

    if (encodedData) {
        const decodedData = base64Decode(encodedData.trim());
        if (decodedData) {
            const ipPortList = parseIPPort(decodedData);
            ipPortList.forEach(({ ip, port, name }) => {
                const finalName = name ? `${name}|${additionalName}` : additionalName;
                let newLink;
                if (isVmess) {
                    newLink = replaceVmessIPPort(templateLink, ip, port, finalName);
                    const encodedNewLink = base64Encode(newLink);
                    newLinks.push(`vmess://${encodedNewLink}`);
                } else if (isVless) {
                    newLink = replaceVlessIPPort(templateLink, ip, port, finalName);
                    newLinks.push(`vless://${newLink}`);
                }
            });
        }
    }

    return newLinks;
}
