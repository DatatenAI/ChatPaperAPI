'use client';
import React, {FC} from 'react';
import {SpecialZoomLevel, Viewer, Worker} from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';
import {zoomPlugin} from '@react-pdf-viewer/zoom';
// @ts-ignore
import PdfWorker from "pdfjs-dist/build/pdf.worker.entry";

const PdfViewer: FC<{
    pdfUrl: string;
}> = props => {
    const zoomPluginInstance = zoomPlugin({
        enableShortcuts: false,
    })
    return (
        <div>
            <Worker workerUrl={PdfWorker}>
                <Viewer enableSmoothScroll defaultScale={SpecialZoomLevel.PageFit} plugins={[zoomPluginInstance]} fileUrl={props.pdfUrl}/>
            </Worker>
        </div>
    );
};


export default PdfViewer;