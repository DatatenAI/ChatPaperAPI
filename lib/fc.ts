import {Config} from '@alicloud/openapi-client';
import FC, {InvokeFunctionHeaders, InvokeFunctionRequest} from '@alicloud/fc-open20210406';
import {RuntimeOptions} from '@alicloud/tea-util';

const config = new Config({
    endpoint: process.env.FUNCTION_ENDPOINT,
    accessKeyId: process.env.FUNCTION_ACCESS_KEY_ID,
    accessKeySecret: process.env.FUNCTION_ACCESS_KEY_SECRET,
});

const fc = new FC(config)
const invokeFunctionHeaders = new InvokeFunctionHeaders({
    xFcInvocationType: "async",
});
const runtime = new RuntimeOptions({});
export const summary = async (pdfHash: string, language: string) => {
    const params = {
        pdfHash,
        language
    };
    if (process.env.NODE_ENV === 'development') {
        await fetch(process.env.FUNCTION_ENDPOINT, {
            body: new URLSearchParams(params),
        })
    } else {
        const res = await fc.invokeFunctionWithOptions('chatpaper', 'summary-task', new InvokeFunctionRequest({
            body: Buffer.from(JSON.stringify({
                pdfHash,
                language
            })),
            qualifier: 'production',
        }), invokeFunctionHeaders, runtime);

    }


}