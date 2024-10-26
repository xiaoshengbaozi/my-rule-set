const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
    type: 'collection', // type: 'subscription' 或 'collection'
    name: 'singbox', // subscription name
    platform: 'sing-box', // target platform
    produceType: 'internal' // 'internal' produces an Array, otherwise produces a String( JSON.parse('JSON String') )
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['✅ 自动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['🔯 自建节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /自建/i))
  }
  if (['🇭🇰 香港节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|hk|hongkong|kong kong|🇭🇰/i))
  }
  if (['🇹🇼 台湾节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /台|TW|tw|Taiwan|taiwan|🇹🇼/i))
  }
  if (['🇯🇵 日本节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日本|JP|jp|Japan|japan|🇯🇵/i))
  }
  if (['🇰🇷 韩国节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /韩|KR|kr|Korea|korea|🇰🇷/i))
  }
  if (['🇸🇬 狮城节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /新|SG|sg|Singapore|singapore|🇸🇬/i))
  }
  if (['🇺🇲 美国节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|us||US|unitedstates|united states|🇺🇸/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}  