"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Image, Film, Check } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { cn } from "@/lib/utils";

/**
 * File Upload Component
 * Drag-and-drop or click to upload files to Firebase Storage.
 */

interface FileUploadProps {
    teamId: string;
    folder?: string; // subfolder within /submissions/{teamId}/
    accept?: string; // e.g., ".pdf,.png,.jpg"
    maxSizeMB?: number;
    onUpload: (url: string, fileName: string) => void;
    className?: string;
}

export function FileUpload({
    teamId,
    folder = "evidence",
    accept = ".pdf,.png,.jpg,.jpeg",
    maxSizeMB = 5,
    onUpload,
    className
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File too large. Max size is ${maxSizeMB}MB.`);
            return;
        }

        // Validate type
        const ext = file.name.split('.').pop()?.toLowerCase();
        const allowed = accept.split(',').map(a => a.replace('.', '').trim());
        if (ext && !allowed.includes(ext)) {
            setError(`Invalid file type. Allowed: ${accept}`);
            return;
        }

        setError("");
        setUploading(true);
        setProgress(0);

        try {
            const storageRef = ref(storage, `submissions/${teamId}/${folder}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(prog);
                },
                (err) => {
                    setError("Upload failed. Please try again.");
                    setUploading(false);
                    console.error(err);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setUploadedFile({ name: file.name, url });
                    setUploading(false);
                    onUpload(url, file.name);
                }
            );
        } catch (err) {
            setError("Upload failed. Please try again.");
            setUploading(false);
        }
    }, [teamId, folder, accept, maxSizeMB, onUpload]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const removeFile = () => {
        setUploadedFile(null);
        setProgress(0);
    };

    const getFileIcon = (name: string) => {
        const ext = name.split('.').pop()?.toLowerCase();
        if (['png', 'jpg', 'jpeg', 'gif'].includes(ext || '')) return Image;
        if (['mp4', 'mov', 'avi'].includes(ext || '')) return Film;
        return FileText;
    };

    if (uploadedFile) {
        const FileIcon = getFileIcon(uploadedFile.name);
        return (
            <div className={cn("p-4 bg-bg-tertiary border border-accent/30 rounded-sm", className)}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-accent/20 flex items-center justify-center text-accent">
                        <FileIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{uploadedFile.name}</p>
                        <p className="text-xs text-accent flex items-center gap-1">
                            <Check size={12} /> Uploaded
                        </p>
                    </div>
                    <button
                        onClick={removeFile}
                        className="p-1 text-text-muted hover:text-red-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
                "relative p-6 border-2 border-dashed rounded-sm cursor-pointer transition-all",
                isDragging ? "border-accent bg-accent/5" : "border-stroke-divider hover:border-text-muted",
                uploading && "pointer-events-none opacity-70",
                className
            )}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
            />

            <div className="flex flex-col items-center text-center">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                    isDragging ? "bg-accent/20 text-accent" : "bg-bg-tertiary text-text-muted"
                )}>
                    <Upload size={24} />
                </div>

                {uploading ? (
                    <>
                        <p className="text-sm text-white mb-2">Uploading...</p>
                        <div className="w-full max-w-[200px] h-1 bg-bg-tertiary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-text-muted mt-1">{Math.round(progress)}%</p>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-white mb-1">
                            {isDragging ? "Drop file here" : "Drag & drop or click to upload"}
                        </p>
                        <p className="text-xs text-text-muted">
                            {accept.replace(/\./g, '').toUpperCase()} • Max {maxSizeMB}MB
                        </p>
                    </>
                )}

                {error && (
                    <p className="text-xs text-red-400 mt-2">{error}</p>
                )}
            </div>
        </div>
    );
}
