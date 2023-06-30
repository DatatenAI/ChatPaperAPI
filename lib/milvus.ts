import {MilvusClient} from '@zilliz/milvus2-sdk-node';

const milvusClient = new MilvusClient(process.env.MILVUS_ADDRESS);



export default milvusClient;