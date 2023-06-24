import {MilvusClient} from '@zilliz/milvus2-sdk-node';

const milvusClient = new MilvusClient({
    address: process.env.MILVUS_ADDRESS,
    username: process.env.MILVUS_USER,
    password: process.env.MILVUS_PASSWORD
});


export default milvusClient;