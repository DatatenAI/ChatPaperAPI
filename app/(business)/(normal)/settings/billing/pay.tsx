'use client';
import React, {FC, ReactElement, useState} from 'react';
import {PayMethodEnum} from "@/lib/constants";
import {Button} from "@/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/ui/dialog";
import {QRCode} from "react-qrcode-logo";
import {useToast} from "@/ui/use-toast";
import {trpc} from "@/lib/trpc";
import type {CreditGood} from '@prisma/client'
import {FaAlipay} from "@react-icons/all-files/fa/FaAlipay";
import {RiCheckboxBlankCircleLine} from "@react-icons/all-files/ri/RiCheckboxBlankCircleLine";
import {RiCheckboxCircleFill,} from "@react-icons/all-files/ri/RiCheckboxCircleFill";
import {RiWechatPayFill} from "@react-icons/all-files/ri/RiWechatPayFill";
import {cn} from "@/lib/cn";
import PayHistoryTable from "./pay-history-table";
import {ImStack} from "@react-icons/all-files/im/ImStack";

const PayMethods: Record<PayMethodEnum, {
    label: string;
    pic: string;
    icon: ReactElement;
}> = {
    ALIPAY: {
        label: '支付宝支付',
        pic: '/alipay.svg',
        icon: <FaAlipay className={'fill-[#009FE8]'}/>,
    },
    WEPAY: {
        label: '微信支付',
        pic: '/wepay.svg',
        icon: <RiWechatPayFill className={'fill-[#1AAD19]'}/>,
    }
}

const CreditGoodItem: FC<{
    good: CreditGood;
    checked: boolean;
    onClick: (good: CreditGood) => void
}> = ({good, checked, onClick}) => {
    return (
        <div key={good.id.toString()} onClick={() => onClick(good)}
             className={cn('group rounded-xl ring-1 ring-gray-200 cursor-pointer p-4 flex  gap-1 items-start', {
                 'ring-2 ring-primary bg-primary-50 is-checked': checked,
             })}>
            <div className="flex flex-row gap-4 items-start justify-start flex-1 ">
                <div
                    className="bg-primary-100 rounded-full border-solid border-primary-50 border-4 shrink-0 w-8 h-8 p-1">
                    <ImStack className={'w-4 h-4 text-primary'}/>
                </div>
                <div className="flex flex-col text-sm flex-1 ">
                    <div className="flex flex-row gap-1 items-start justify-start shrink-0 ">
                        <div
                            className="text-gray-700 group-[.is-checked]:text-primary-800 text-sm font-medium "
                        >{good.name}</div>
                        <div
                            className="text-gray-600 group-[.is-checked]:text-primary-700 font-normal leading-5">
                            ¥{(Number(good.price) / 100).toFixed(2)}
                        </div>
                    </div>

                    <div
                        className="text-gray-600 group-[.is-checked]:text-primary-700 font-normal"
                    >包含{good.credits.toString()}点数
                    </div>
                </div>
            </div>
            {
                checked ?
                    <RiCheckboxCircleFill className={'fill-primary w-4 h-4 shrink-0'}/> :
                    <RiCheckboxBlankCircleLine className={'fill-gray-300 w-4 h-4 shrink-0'}/>
            }

        </div>
    );
};

const Pay: FC<{
    goods: CreditGood[]
}> = props => {

    const [payData, setPayData] = useState<{
        url: string;
        payNo: string;
    } | undefined>();

    const [checkedGood, setCheckedGood] = useState<CreditGood>();

    const {toast} = useToast();

    const [payMethod, setPayMethod] = useState<PayMethodEnum>();

    const rechargeMutation = trpc.account.recharge.useMutation({
        onSuccess: (data) => {
            setPayData(data);
            setShowDialog(true);
        }
    });
    const checkPayQuery = trpc.account.checkPayResult.useQuery(payData?.payNo, {
        enabled: false,
    });

    const [showDialog, setShowDialog] = useState(false);

    const recharge = () => {
        if (!checkedGood) {
            toast({
                title: '请选择套餐',
            });
            return
        }
        if (!payMethod) {
            toast({
                title: '请选择支付方式',
            });
            return;
        }
        rechargeMutation.mutate({
            method: payMethod,
            goodId: checkedGood.id,
        });
    };

    const checkPay = async () => {
        const {data} = await checkPayQuery.refetch();
        if (!data) {
            toast({
                title: '查询失败，请重试',
            });
            return;
        }
        switch (data) {
            case 'SUCCESS':
                toast({
                    title: '支付成功',
                });
                setPayData(undefined);
                setShowDialog(false);
                return;
            case 'PAYING':
                toast({
                    title: '正在支付中，请稍后查询',
                })
                break;
            case 'FAILED':
                toast({
                    title: '支付失败',
                })
        }
    }

    return (
        <div className={'space-y-6'}>
            <div className={'space-y-4'}>
                <h2 className={'font-semibold'}>购买点数</h2>
                <div className={'flex flex-col gap-3 max-w-lg'}>
                    {props.goods.map(good => {
                        return <CreditGoodItem key={good.id.toString()} good={good}
                                               checked={good.id === checkedGood?.id}
                                               onClick={setCheckedGood}/>
                    })}
                </div>
                <ul className={'flex gap-3'}>
                    {
                        Object.entries(PayMethods).map(([key, value]) => {
                            return <li onClick={() => setPayMethod(key as PayMethodEnum)}
                                       className={cn('ring-1 ring-gray-300 py-1.5 px-3 text-sm rounded-lg cursor-pointer inline-flex gap-2 items-center', {
                                           'ring-2 ring-primary bg-primary-50 ': payMethod === key
                                       })}
                                       key={key}>
                                {React.cloneElement(value.icon, {
                                    ...value.icon.props,
                                    className: cn("w-8 h-8", value.icon.props.className)
                                })}
                                <span>{value.label}</span>
                            </li>
                        })
                    }
                </ul>
                <Button onClick={recharge} loading={rechargeMutation.isLoading}>发起支付</Button>
            </div>
            <div className={'space-y-4'}>
                <h2 className={'font-semibold'}>充值记录</h2>
                <PayHistoryTable/>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-[425px] sm:rounded-2xl gap-6 justify-center">
                    <DialogHeader>
                        <DialogTitle className={'text-center'}>扫码支付</DialogTitle>
                    </DialogHeader>
                    {
                        payMethod ?
                            <QRCode logoPadding={5} eyeRadius={50} ecLevel={'H'} removeQrCodeBehindLogo size={200}
                                    logoImage={PayMethods[payMethod].pic} logoWidth={60} qrStyle={'dots'}
                                    value={payData?.url}/> : null
                    }
                    <Button onClick={checkPay} loading={checkPayQuery.isFetching}>已完成支付</Button>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default Pay;