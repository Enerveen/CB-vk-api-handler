const getVkScriptCode = (domains: string, count: string) => `
var i = 0;
var result = [];
var domainsArray = "${domains}".split(',');
while (i < domainsArray.length) {
    result.push(API.wall.get({"count": "${count}", "domain": domainsArray[i]}));
    i = i + 1;
};
return result;
`

export default getVkScriptCode