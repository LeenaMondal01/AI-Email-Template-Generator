import React, { useState } from 'react'; // <--- ADD useState here
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Copy } from 'lucide-react';

const ViewHtmlDialog = ({openDialog,htmlCode,closeDialog}) => {
    const [copied, setCopied] = useState(false); // New state to track if copied

    const CopyCode = () => {
        navigator.clipboard.writeText(htmlCode);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle asChild>
                        <div className='flex items-center justify-between'>
                            <h2>HTML Email Template</h2>
                            <div
                                className='p-2 bg-gray-100 rounded-full h-9 w-9 cursor-pointer mr-5 flex items-center justify-center'
                                onClick={CopyCode}
                                title={copied ? 'Copied!' : 'Copy to clipboard'}
                            >
                                {copied ? (
                                    <span className='text-xs font-bold text-green-600'>Copied!</span>
                                ) : (
                                    <Copy className='h-5 w-5 text-gray-700' />
                                )}
                            </div>
                        </div>
                    </DialogTitle>

                    <DialogDescription asChild>
                        <div className='max-h-[400px] overflow-auto bg-black text-white rounded-lg p-5'>
                            <pre className='whitespace-pre-wrap break-all'>
                                <code>
                                    {htmlCode}
                                </code>
                            </pre>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ViewHtmlDialog;