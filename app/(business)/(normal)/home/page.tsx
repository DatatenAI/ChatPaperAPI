'use client';
import React, {useState} from 'react';
import {Page} from "@/types";
import PageLayout from "@/app/(business)/(normal)/page-layout";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {useDropzone} from 'react-dropzone'
import pdfIcon from "@/public/pdf.png";
import Image from "next/image";
import {FiTrash2} from "react-icons/fi";
import {Progress} from "@/ui/progress";
import {filesize} from "filesize";
import {Button} from "@/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/ui/tabs";
import {useToast} from "@/ui/use-toast";
import SparkMD5 from "spark-md5";
import {Textarea} from "@/ui/textarea";
import {trpc} from "@/lib/trpc";


type FileWithHash = {
    file: File,
    hash: string;
}

const uploadTypes = [
    {value: 'FILE', label: '文件上传'},
    {value: 'URL', label: 'URL上传'},
];

const calcFileHash = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        const chunkSize = 2097152;
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        const loadNext = () => {
            const start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            fileReader.readAsArrayBuffer(file.slice(start, end));
        }
        fileReader.onload = e => {
            console.log('read chunk nr', currentChunk + 1, 'of', chunks);
            spark.append(e.target?.result as ArrayBuffer);
            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                console.log('finished loading');
                console.info('computed hash', spark.end());
                resolve(spark.end());
            }
        }
        fileReader.onerror = () => {
            console.warn('oops, something went wrong.');
            reject("read file error");
        };

        loadNext();
    })
}

const HomePage: Page = props => {
    const [uploadType, setUploadType] = useState('FILE');
    const {toast} = useToast();
    const [files, setFiles] = useState<FileWithHash[]>([]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
            'application/pdf': ['.pdf']
        },
        maxSize: 1024 * 1024 * 20,
        onDropAccepted: async acceptFiles => {
            const fileWithMd5Array = await Promise.all(acceptFiles.map(async file => {
                return {
                    file,
                    hash: await calcFileHash(file),
                }
            }));
            const filterRepeatFiles = fileWithMd5Array.filter(file => {
                return files.findIndex(it => it.hash === file.hash) < 0;
            });
            setFiles([...files, ...filterRepeatFiles]);
        },
        onDropRejected: (fileRejections) => {
            const error = fileRejections[0].errors[0];
            let description;
            switch (error.code) {
                case 'file-invalid-type':
                    description = '请选择pdf文件进行上传';
                    break
                case 'file-too-small':
                    description = '选择文件太小';
                    break;
                case 'file-too-large':
                    description = `请选择20M以下的文件`;
                    break;
                case 'too-many-files':
                    description = `文件数量超限`;
                    break;
            }
            toast({
                title: '上传失败',
                description
            });
        }
    });
    const [pdfUrls, setPdfUrls] = useState<string>();

    const summaryMutation = trpc.task.create.useMutation({
        onSuccess:()=>{

        }
    })

    const removeFile = (hash: string) => {
        setFiles(files.filter(it => it.hash !== hash));
    };

    const startSummary = () => {
        if (!pdfUrls?.trim().length) {
            toast({
                title: '请输入PDF下载链接',
            });
            return;
        }

    }


    return (
        <PageLayout>
            <div className={'space-y-6 text-center'}>
                <Tabs value={uploadType} onValueChange={setUploadType}>
                    <TabsList>
                        {uploadTypes.map(it => {
                            return <TabsTrigger key={it.value} value={it.value}>{it.label}</TabsTrigger>
                        })}
                    </TabsList>
                    <TabsContent value={'FILE'} asChild>
                        <div className={`w-1/2 mx-auto space-y-4`}>
                            <div  {...getRootProps()}
                                  className={`h-36 p-4 bg-white border  rounded-2xl flex flex-col justify-center items-center cursor-pointer space-y-2`}>
                                <input {...getInputProps()} />
                                <div className={'w-10 h-10 border rounded-lg flex justify-center items-center'}>
                                    <AiOutlineCloudUpload className={'w-6 h-6 text-primary'}/>
                                </div>
                                <p className={'text-sm text-gray-600 font-medium'}>点击或拖拽文件到此处上传</p>
                                <p className={'text-xs text-gray-500 font-normal'}>请选择20M以内的PDF文件进行上传</p>
                            </div>
                            <div className={'space-y-2'}>{
                                files.map(({file, hash}) => {
                                    return <div className={'border rounded-xl p-4 flex space-x-3'} key={hash}>
                                        <Image src={pdfIcon} alt={'pdf'} className={'w-10 h-10 '}/>
                                        <div className={'flex-grow space-y-2.5 text-left'}>
                                            <div>
                                                <div
                                                    className={'text-sm text-gray-700 font-medium flex justify-between items-center'}>
                                                    <span>{file.name}</span>
                                                    <FiTrash2 className={'w-4 h-4 cursor-pointer hover:opacity-70'}
                                                              onClick={() => removeFile(hash)}/>
                                                </div>
                                                <div className={'text-sm text-gray-600 font-normal leading-5'}>{
                                                    filesize(file.size, {standard: "jedec"}) as string
                                                }</div>
                                            </div>
                                            <div className={'flex items-center space-x-3'}>
                                                <Progress className={'h-2'} value={0}/>
                                                <span className={'text-sm font-medium text-gray-700'}>100%</span>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }</div>
                        </div>
                    </TabsContent>
                    <TabsContent value={'URL'} asChild>
                        <div className={`w-1/2 mx-auto`}>
                            <Textarea className={'h-36 resize-none'} placeholder={'请输入PDF下载链接，每行一个'} value={pdfUrls}
                                      onChange={e => setPdfUrls(e.target.value)}/>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className={'text-center'}>
                    <Button onClick={startSummary}>开始总结</Button>
                </div>
            </div>
        </PageLayout>
    )

};


export default HomePage;