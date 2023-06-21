'use client';
import React, {FC, useState} from 'react';
import {PayMethodEnum, PayMethods} from "@/lib/constants";
import {Button} from "@/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/ui/dialog";
import {QRCode} from "react-qrcode-logo";
import {useToast} from "@/ui/use-toast";
import {trpc} from "@/lib/trpc";

const Pay: FC = props => {
    const [payUrl, setPayUrl] = useState<string>('');

    const {toast} = useToast();

    const [payMethod, setPayMethod] = useState<PayMethodEnum>();

    const rechargeMutation = trpc.account.recharge.useMutation({
        onSuccess: (data) => {
            setPayUrl(data);
            setShowDialog(true);
        }
    });
    const [showDialog, setShowDialog] = useState(false);
    const recharge = () => {
        if (payMethod) {
            rechargeMutation.mutate({
                method: payMethod,
            });
        } else {
            toast({
                title: '请选择支付方式',
            })
        }
    }

    return (
        <>
            <div className={'space-y-4'}>
                <h2 className={'text-lg font-semibold leading-none'}>充值点数</h2>
                <ul className={'flex'}>
                    <li className={'border rounded-xl p-4'}>
                        <p>基础版</p>
                    </li>
                    <li>
                        <p>基础版</p>
                    </li>
                    <li>
                        <p>基础版</p>
                    </li>
                </ul>
                <ul className={'flex gap-4'}>
                    {
                        Object.entries(PayMethods).map(([key, value]) => {
                            return <li onClick={() => setPayMethod(key as PayMethodEnum)}
                                       className={`border ${payMethod === key ? 'border-primary' : ''} py-2 px-4 rounded cursor-pointer`}
                                       key={key}>{
                                value.label
                            }</li>
                        })
                    }
                </ul>
                <Button onClick={recharge} loading={rechargeMutation.isLoading}>去付款</Button>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-[425px] sm:rounded-2xl gap-6 justify-center">
                    <DialogHeader>
                        <DialogTitle className={'text-center'}>扫码支付</DialogTitle>
                    </DialogHeader>
                    {
                        payMethod ?
                            <QRCode logoPadding={5} eyeRadius={50} ecLevel={'H'} removeQrCodeBehindLogo size={200}
                                    logoImage={PayMethods[payMethod].icon} logoWidth={60} qrStyle={'dots'}
                                    value={payUrl}/> : null
                    }
                    <Button>已完成支付</Button>
                </DialogContent>
            </Dialog>

        </>
    );
};

export default Pay;