const fs = require('fs/promises');
const path = require("path");
const crypto = require('crypto');
ALLINPAY_PRIVATE_KEY = `
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC+HeyzWmjz8GZonQ4uVEbiA0kEg3ChfJsTung/xJ+SsOf+ORT6ptjQgVkDFBCjXvJRnu0CrOdw3apeq9fXfvC5uwgnYm9HqcFGS76JDKCaQbM0BkTDLMZRojzRaqIaKqV56b1hbH6ZfvfeUG93u6JuXFBnMK2aiQJXHiUQAC8/GeGNNWF/NDzHLst7JaT8KSkf+oEubmq1LY0EwyaF619A49mS9gmESwGEuRUfYUKJQQ4utudZ7TZIAwAMhLitloGHJjXxbjphOWihA8vVNkvrnHkcX2Xnd5/1Z/nzsnXk4ZATA6cOBg4ewU3s03LDUIUTupRQR6KIOgWacia7kzoVAgMBAAECggEABMIqUYGQIkLrHUUzvKnJWGYtUVqaMBXhVR4UB8Hmcz0loVxRD8ZV+OoJOKWA68Xi73NjNUTvSgjnob+lWF8fVqwSvoGdOBWh9nN2N7yZgc2RLFqCesFyeUqZQRiX1BXV1yD9kiRYCtl9tL0d/R4005RQmDSaCRsoHtbB+2OLIIYnOILMUvsqAvRUVvcO43hRiz9zAw1aNnsjzcM8ej2HX3AJsMC3UerDyVyTYYRXeMPEMNchdtUpHJEiqrwmPiHXvFrjOR8AZYm/fIpjnWAaX3b4xhBgB/zVcYJwkUP5UCFqojZwB5fvqy0cxmUQoKuixjLsvn1mU0YUdIhT16IlwQKBgQDxpPfG2CcAkepkb35IjIf7h3ZH5hgP1kY0cp8Vlg57++tu8E1EZ0DoxI5L2xBaE1SiNtjg3DYVFPG7ZXCl0pm1mg0rbIP5MxrYHOjIXvslVLQYJQUjiPPZ6H1umaKmgWYCXkkQbDanN2uLHQAo+GPev5r1b0foyAe2+UAHW00QBQKBgQDJaU3cVrSkmP34jpU6b3Dzm2D24FcyrwpdRJ83dn6h4hCI5I9Ekos1mmUJ97sjfStgEIcMlVcAd9qbz0SdFfeQH0D0qysLkLr9nPB8wwHp8oRAV8ctqO1c6ZyNKqMmZ6/EsvLxP9uwtIsx9KE9WURyBTOAfEMSIo8NdGMER1tu0QKBgQCZD42C/ld2HPcDNzweaCWaRWu+jxier3M4tYHfAnWaQzAVzVCkC2MqDZa0pcXtyGDLf0JQ7Cu1ntafhNmdr5B9X18IKmxN5PkT+vvYL5GVS9nnkUt3/r+3P3R0IgzMuxoKVf6h0Gmt8YTFUVFQokVgSq202RALeuioFalg/4wIoQKBgQCjPqSK2APl/NKsKPSuvjBwYhl/P2mtfM4LtljN3U7Z6p64NXghfh0yvwbxw0Z8hzEm1X6AJnKzwHEBJEdagrl6qLo/FJT49L96Wz9X/76HXbbvZ7XaPjbUvcvTZyGBOTzvUpMyEi3/1PWU8c/WJ4ogWDLcCttZ0YTcxN6UUzm6YQKBgGMbYEN4NhxutHzGXEcU4+KbXsWJbK5TjKgNA1zZhtIIVp69XhqmFA+eo6zDVTUuffIWwO9TyomeEJwuOV8wagc5FJD8yFctPL2i2Cc9pnrZypXzNKAx14tsRf+I2yi1HIT9th9q+WRI9fnQnheWeLGrFgCdy0i/ZLypmNEPsROE
-----END PRIVATE KEY-----
`;
const md5 = str => {
    const md5hash = crypto.createHash("md5");
    md5hash.update(str);
    return md5hash.digest("base64");
};

const rsaSign = (str) => {
    const sign = crypto.createSign('SHA1');
    sign.update(str, 'utf-8');
    return sign.sign(ALLINPAY_PRIVATE_KEY, 'base64')
}

console.log(rsaSign("appid=00274964&body=%E5%85%85%E5%80%BC%E7%82%B9%E6%95%B0&cusid=56236104816XXFY&notify_url=https%3A%2F%2Fhzj.carmela.tech%2Fapi%2F&paytype=W01&randomstr=Y6URbQ&reqsn=CMR0W6eRtY_ByQZ4SBsc&signtype=RSA&trxamt=1&version=11"))