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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/ui/select";
import {languages} from "@/lib/constants";
import {BiLoaderAlt} from "react-icons/bi";
import {BsFillCheckCircleFill} from "react-icons/bs";
import {CreateTaskSchema} from "@/lib/validation";
import z from "zod";
import {useRouter} from "next/navigation";


type FileWithHash = {
    file: File,
    hash: string;
    url?: string;
    progress: number;
    state: 'wait' | 'uploading' | 'success' | 'error';
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
            spark.append(e.target?.result as ArrayBuffer);
            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                resolve(spark.end());
            }
        }
        fileReader.onerror = () => {
            reject("read file error");
        };
        loadNext();
    })
}


const HomePage: Page = props => {
    const [uploadType, setUploadType] = useState('FILE');
    const {toast} = useToast();
    const [files, setFiles] = useState<FileWithHash[]>([]);
    const [language, setLanguage] = useState<string>("中文");

    const [uploadLoading, setUploadLoading] = useState(false);

    const router = useRouter();

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
            'application/pdf': ['.pdf']
        },
        maxSize: 1024 * 1024 * 20,
        onDropAccepted: async acceptFiles => {
            const fileWithMd5Array: FileWithHash[] = await Promise.all(acceptFiles.map(async file => {
                return {
                    file,
                    hash: await calcFileHash(file),
                    progress: 0,
                    state: 'wait'
                };
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
                variant: 'destructive',
                title: '上传失败',
                description
            });
        }
    });
    const [pdfUrls, setPdfUrls] = useState<string>();

    const summaryMutation = trpc.task.create.useMutation({
        onSuccess: data => {
            console.log(data)
            if (data) {
                router.push(`/task/${data}`);
            }
        },
        onError: error => {
            toast({
                variant: 'destructive',
                title: '总结失败',
                description: error.message
            })
        }
    });
    const genUploadUrlMutation = trpc.task.upload.useMutation();


    const removeFile = (hash: string) => {
        setFiles(files.filter(it => it.hash !== hash));
    };

    const startSummary = async () => {
        try {
            setUploadLoading(true);
            let summaryParam: z.infer<typeof CreateTaskSchema> = {
                language,
            }
            if (uploadType === 'FILE') {
                if (!files.length) {
                    toast({
                        title: '请选择要上传的文件',
                    });
                    return
                }
                const allUploaded = files.every(file => file.state === 'success');
                if (!allUploaded) {
                    const hashUrls = await genUploadUrlMutation.mutateAsync(new Set(files.map(it => it.hash)));
                    setFiles(files.map(file => {
                        const hashUrl = hashUrls.find(it => it.hash === file.hash);
                        if (hashUrl) {
                            file.url = hashUrl.url;
                        }
                        return file;
                    }));
                    await Promise.all(files.map(file => {
                        return new Promise((resolve, reject) => {
                            if (file.url) {
                                const xhr = new XMLHttpRequest()
                                xhr.upload.addEventListener("progress", (event) => {
                                    if (event.lengthComputable) {
                                        setFiles((files) => {
                                            const newFiles = [...files];
                                            const currentFile = newFiles.find(it => it.hash === file.hash);
                                            if (currentFile) {
                                                currentFile.progress = Math.round((event.loaded * 100) / event.total);
                                            }
                                            return newFiles
                                        });
                                    }
                                });
                                xhr.upload.onloadstart = e => {
                                    setFiles((files) => {
                                        const newFiles = [...files];
                                        const currentFile = newFiles.find(it => it.hash === file.hash);
                                        if (currentFile) {
                                            currentFile.state = 'uploading';
                                        }
                                        return newFiles;
                                    });
                                };
                                xhr.upload.onerror = e => {
                                    setFiles((files) => {
                                        const newFiles = [...files];
                                        const currentFile = newFiles.find(it => it.hash === file.hash);
                                        if (currentFile) {
                                            currentFile.state = 'error';
                                        }
                                        return newFiles;
                                    });
                                    reject("upload error");
                                };
                                xhr.upload.onload = e => {
                                    setFiles((files) => {
                                        const newFiles = [...files];
                                        const currentFile = newFiles.find(it => it.hash === file.hash);
                                        if (currentFile) {
                                            currentFile.state = 'success';
                                        }
                                        return newFiles;
                                    });
                                    resolve(null);
                                }
                                xhr.open("PUT", file.url, true);
                                xhr.setRequestHeader("Content-Type", file.file.type);
                                xhr.send(file.file);
                            } else {
                                setFiles((files) => {
                                    const newFiles = [...files];
                                    const currentFile = newFiles.find(it => it.hash === file.hash);
                                    if (currentFile) {
                                        currentFile.state = 'uploading';
                                    }
                                    return newFiles;
                                });
                                const timeout = setTimeout(() => {
                                    setFiles((files) => {
                                        const newFiles = [...files];
                                        const currentFile = newFiles.find(it => it.hash === file.hash);
                                        if (currentFile) {
                                            currentFile.progress = 100;
                                            currentFile.state = 'success';
                                        }
                                        return newFiles;
                                    });
                                    clearTimeout(timeout);
                                    resolve(null);
                                }, 500)
                            }
                        })
                    }))
                }
                summaryParam.pdfHashes = files.map(file => file.hash);
            } else {
                if (!pdfUrls?.trim().length) {
                    toast({
                        title: '请输入PDF下载链接',
                    });
                    return;
                }
                summaryParam.pdfUrls = pdfUrls?.split("\n");
            }
            summaryMutation.mutate(summaryParam);
        } finally {
            setUploadLoading(false);
        }
    }


    return (
        <PageLayout>
            <div className={'space-y-6 flex flex-col items-center w-full'}>
                <Tabs value={uploadType} onValueChange={setUploadType} className={'w-1/2 text-center'}>
                    <TabsList>
                        {uploadTypes.map(it => {
                            return <TabsTrigger key={it.value} value={it.value}>{it.label}</TabsTrigger>
                        })}
                    </TabsList>
                    <TabsContent value={'FILE'} asChild>
                        <div className={`space-y-4`}>
                            <div  {...getRootProps()}
                                  className={`h-36  p-4 bg-white border  rounded-2xl flex flex-col justify-center items-center cursor-pointer space-y-2`}>
                                <input {...getInputProps()} />
                                <div className={'w-10 h-10 border rounded-lg flex justify-center items-center'}>
                                    <AiOutlineCloudUpload className={'w-6 h-6 text-primary'}/>
                                </div>
                                <p className={'text-sm text-gray-600 font-medium'}>点击或拖拽文件到此处上传</p>
                                <p className={'text-xs text-gray-500 font-normal'}>请选择20M以内的PDF文件进行上传</p>
                            </div>
                            {files.length ? <div className={'space-y-2'}>{
                                files.map(({file, hash, progress, state}) => {
                                    return <div className={'border rounded-xl p-4 flex space-x-3'} key={hash}>
                                        <Image src={pdfIcon} alt={'pdf'} className={'w-10 h-10 '}/>
                                        <div className={'flex-grow space-y-2.5 text-left overflow-hidden'}>
                                            <div>
                                                <div
                                                    className={'text-sm text-gray-700 font-medium flex justify-between items-center'}>
                                                    <span>{file.name}</span>
                                                    {
                                                        state === 'wait' ? <FiTrash2
                                                            className={'w-4 h-4 cursor-pointer hover:opacity-70 flex-shrink-0'}
                                                            onClick={() => removeFile(hash)}/> : null
                                                    }
                                                    {
                                                        state === 'uploading' ? <BiLoaderAlt
                                                            className={'w-4 h-4 animate-spin flex-shrink-0'}
                                                            onClick={() => removeFile(hash)}/> : null
                                                    }
                                                    {
                                                        state === 'success' ? <BsFillCheckCircleFill
                                                            className={'w-4 h-4 fill-primary   flex-shrink-0'}
                                                            onClick={() => removeFile(hash)}/> : null
                                                    }
                                                </div>
                                                <div className={'text-sm text-gray-600 font-normal leading-5'}>{
                                                    filesize(file.size, {standard: "jedec"}) as string
                                                }</div>
                                            </div>
                                            {
                                                state === 'uploading' ?
                                                    <div className={'flex items-center space-x-3'}>
                                                        <Progress className={'h-2'} value={progress}/>
                                                        <span
                                                            className={'text-sm font-medium text-gray-700'}>{progress}%</span>
                                                    </div> : null
                                            }
                                        </div>
                                    </div>;
                                })
                            }</div> : null
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value={'URL'} asChild>
                        <div className={`w-full`}>
                            <Textarea className={'h-36 resize-none'} placeholder={'请输入PDF下载链接，每行一个'}
                                      value={pdfUrls}
                                      onChange={e => setPdfUrls(e.target.value)}/>
                        </div>
                    </TabsContent>
                </Tabs>
                <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择输出语言"/>
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map(language => {
                            return <SelectItem value={language.value}
                                               key={language.value}>{language.label}</SelectItem>
                        })}
                    </SelectContent>
                </Select>
                <div className={'text-center'}>
                    <Button onClick={startSummary}
                            loading={uploadLoading || summaryMutation.isLoading}>开始总结</Button>
                </div>
            </div>
        </PageLayout>
    )

};


export default HomePage;