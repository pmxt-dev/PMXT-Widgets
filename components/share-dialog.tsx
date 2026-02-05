'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { toast } from 'sonner'

interface ShareDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    url?: string
}

export function ShareDialog({ open, onOpenChange, url = typeof window !== 'undefined' ? window.location.href : '' }: ShareDialogProps) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[486px] bg-black border-none text-white p-0 gap-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] rounded-[2px]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 h-[64px] border-b border-white/10">
                    <span className="text-[14px] font-medium font-mono text-white">Share</span>
                    <DialogPrimitive.Close className="text-white hover:opacity-70 transition-opacity p-1">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </DialogPrimitive.Close>
                </div>

                {/* Content */}
                <div className="flex items-center justify-between px-10 py-[44px]">
                    <div className="flex items-center gap-[40px]">
                        {/* Facebook */}
                        <a href="#" className="hover:opacity-70 transition-opacity">
                            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a href="#" className="hover:opacity-70 transition-opacity">
                            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>

                        {/* X */}
                        <a href="#" className="hover:opacity-70 transition-opacity">
                            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>

                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity"
                    >
                        <span className="text-[14px] font-medium font-mono">Copy link</span>
                        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" className="w-5 h-6">
                            <rect x="1" y="5" width="14" height="14" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M7 1L21 1V21H18" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
