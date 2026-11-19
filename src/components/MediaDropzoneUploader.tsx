/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Headphones,
  Image as ImageIcon,
  Video,
  Loader2,
} from 'lucide-react';
import { soundManager } from '../utils/audioEffects';
import { uploadCaseMedia } from '../services/firebase';

interface MediaDropzoneUploaderProps {
  mediaType: 'text' | 'audio' | 'image' | 'video';
  mediaUrl: string;
  mediaCaption?: string;
  onUpdateUrl: (url: string) => void;
  onUpdateCaption?: (caption: string) => void;
  caseId?: string;
  evidenceId?: string;
  uploadKind?: 'media' | 'narration';
  title?: string;
  hideCaption?: boolean;
}

export const MediaDropzoneUploader: React.FC<MediaDropzoneUploaderProps> = ({
  mediaType,
  mediaUrl,
  mediaCaption = '',
  onUpdateUrl,
  onUpdateCaption,
  caseId,
  evidenceId,
  uploadKind = 'media',
  title,
  hideCaption = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'idle' | 'success' | 'warning' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (mediaType === 'text') return null;

  const getAcceptedExtensions = () => {
    switch (mediaType) {
      case 'audio':
        return 'audio/*,.mp3,.wav,.ogg,.m4a';
      case 'image':
        return 'image/*,.png,.jpg,.jpeg,.webp,.gif';
      case 'video':
        return 'video/*,.mp4,.webm';
      default:
        return '*/*';
    }
  };

  const getMediaTypeName = () => {
    switch (mediaType) {
      case 'audio':
        return 'Ses Dosyası (.mp3, .wav)';
      case 'image':
        return 'Olay Yeri Görseli (.png, .jpg)';
      case 'video':
        return 'Kamera Videosu (.mp4)';
      default:
        return 'Medya Dosyası';
    }
  };

  const handleFileProcess = async (file: File) => {
    if (isUploading) return;
    soundManager.playKeyClick();
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus({ type: 'idle', message: '' });

    if (!hideCaption && !mediaCaption && onUpdateCaption) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      onUpdateCaption(cleanName);
    }

    try {
      const result = await uploadCaseMedia({
        caseId: caseId || 'genel',
        evidenceId: evidenceId || 'delil',
        kind: uploadKind || 'media',
        file,
        onProgress: (percent) => setUploadProgress(percent),
      });
      onUpdateUrl(result.url);
      soundManager.playSuccessSound();
      setUploadStatus({
        type: 'success',
        message: `Firebase Storage'a yüklendi (${Math.round(result.sizeBytes / 1024)} KB)`,
      });
    } catch (err: any) {
      soundManager.playErrorSound();
      setUploadStatus({
        type: 'error',
        message: err?.message || 'Medya yüklenirken bir hata oluştu.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!isUploading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleManualFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUploading && e.target.files && e.target.files.length > 0) {
      void handleFileProcess(e.target.files[0]);
    }
    e.target.value = '';
  };

  const getEmbedVideoUrl = (url: string) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return '';
  };

  const embedUrl = mediaType === 'video' ? getEmbedVideoUrl(mediaUrl) : '';
  const isDataUrl = mediaUrl.startsWith('data:');
  const isFirebaseStorageUrl =
    mediaUrl.includes('firebasestorage.googleapis.com') || mediaUrl.includes('firebasestorage.app');

  const sourceLabel = isFirebaseStorageUrl
    ? 'Storage'
    : isDataUrl
    ? 'Eski Base64'
    : mediaUrl
    ? 'URL'
    : 'Boş';

  return (
    <div className="sm:col-span-3 bg-[#f4efe4] border border-[#d6cdbc] rounded-sm p-3.5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-typewriter font-bold text-[#1f1c18] flex items-center gap-1.5">
          {mediaType === 'audio' && <Headphones className="w-3.5 h-3.5 text-[#575046]" />}
          {mediaType === 'image' && <ImageIcon className="w-3.5 h-3.5 text-[#575046]" />}
          {mediaType === 'video' && <Video className="w-3.5 h-3.5 text-[#575046]" />}
          <span>{title || `${getMediaTypeName()} Yükleme`}</span>
        </label>
        <span
          className={`text-[10px] font-typewriter px-1.5 py-0.5 border rounded-sm shrink-0 ${
            isFirebaseStorageUrl
              ? 'border-[#276749] text-[#276749] bg-[#fffdf8]'
              : isDataUrl
              ? 'border-[#8b1e1e] text-[#8b1e1e] bg-[#fffdf8]'
              : 'border-[#c8bfae] text-[#575046] bg-[#faf6ed]'
          }`}
        >
          {sourceLabel}
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border border-dashed rounded-sm p-4 flex flex-col items-center justify-center text-center transition-colors ${
          isUploading
            ? 'border-[#1f1c18] bg-[#fffdf8] cursor-wait'
            : isDragging
            ? 'border-[#1f1c18] bg-[#fffdf8] cursor-pointer'
            : 'border-[#b5aa96] hover:border-[#1f1c18] bg-[#fffdf8] cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedExtensions()}
          onChange={handleManualFileInput}
          disabled={isUploading}
          className="hidden"
        />

        <div className="w-8 h-8 rounded-sm bg-[#faf6ed] border border-[#c8bfae] flex items-center justify-center text-[#1f1c18] mb-2">
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
        </div>

        {isUploading ? (
          <div className="w-full max-w-xs space-y-1.5">
            <p className="text-xs font-typewriter font-bold text-[#1f1c18]">
              Storage&apos;a Yükleniyor... %{uploadProgress}
            </p>
            <div className="w-full h-1.5 bg-[#e5dec9] rounded-sm overflow-hidden">
              <div
                className="h-full bg-[#1f1c18] transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs font-medium text-[#1f1c18]">
              {getMediaTypeName()} dosyasını sürükleyin veya <span className="underline">seçin</span>
            </p>
            <p className="text-[10px] text-[#7c7265] font-typewriter mt-1">
              {mediaType === 'audio' && '.mp3, .wav, .ogg, .m4a (Maks. 25 MB)'}
              {mediaType === 'image' && '.jpg, .png, .webp (Otomatik sıkıştırılır · Maks. 25 MB)'}
              {mediaType === 'video' && '.mp4, .webm (Maks. 25 MB) veya URL'}
            </p>
          </>
        )}
      </div>

      {/* Upload Feedback Status */}
      {uploadStatus.message && (
        <div
          className={`p-2.5 rounded-sm text-[11px] font-typewriter flex items-start gap-2 border bg-[#fffdf8] ${
            uploadStatus.type === 'success'
              ? 'border-[#276749] text-[#276749]'
              : uploadStatus.type === 'warning'
              ? 'border-[#c8bfae] text-[#575046]'
              : 'border-[#8b1e1e] text-[#8b1e1e]'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          )}
          <span>{uploadStatus.message}</span>
        </div>
      )}

      {/* Direct URL Input Fallback */}
      <div>
        <label className="block text-[#575046] mb-1 text-[11px] font-typewriter">
          Veya Medya URL Bağlantısı
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => onUpdateUrl(e.target.value)}
            placeholder={
              mediaType === 'audio'
                ? 'https://.../kayit.mp3'
                : mediaType === 'image'
                ? 'https://.../delil.webp'
                : 'https://youtube.com/watch?v=... veya https://.../video.mp4'
            }
            className="flex-1 bg-[#fffdf8] border border-[#c8bfae] rounded-sm px-3 py-1.5 text-[#1f1c18] font-typewriter text-xs focus:outline-none focus:border-[#1f1c18]"
          />
          {mediaUrl && (
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                onUpdateUrl('');
                setUploadStatus({ type: 'idle', message: '' });
              }}
              className="px-2.5 py-1.5 bg-[#fffdf8] hover:bg-[#8b1e1e] border border-[#8b1e1e] text-[#8b1e1e] hover:text-[#faf6ed] rounded-sm text-xs font-typewriter flex items-center gap-1 cursor-pointer transition-colors"
              title="Medyayı Temizle"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Temizle</span>
            </button>
          )}
        </div>
      </div>

      {/* Media Caption */}
      {!hideCaption && onUpdateCaption && (
        <div>
          <label className="block text-[#575046] mb-1 text-[11px] font-typewriter">
            Alt Açıklama / Başlık
          </label>
          <input
            type="text"
            value={mediaCaption}
            onChange={(e) => onUpdateCaption(e.target.value)}
            placeholder={
              mediaType === 'audio'
                ? '112 Acil İhbar Bandı'
                : mediaType === 'image'
                ? 'Çalışma Masası ve Kırık Kadeh'
                : 'Güvenlik Kamerası Koridor Kaydı'
            }
            className="w-full bg-[#fffdf8] border border-[#c8bfae] rounded-sm px-3 py-1.5 text-[#1f1c18] text-xs font-typewriter focus:outline-none focus:border-[#1f1c18]"
          />
        </div>
      )}

      {/* Live Preview */}
      {mediaUrl && (
        <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm p-2.5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-typewriter text-[#7c7265] uppercase tracking-wider">
            <span>Önizleme</span>
            <span>Oyuncu görünümü</span>
          </div>

          {mediaType === 'audio' && (
            <div className="space-y-1.5">
              <audio src={mediaUrl} controls className="w-full h-9" />
              {mediaCaption && (
                <p className="text-xs text-[#575046] italic">{mediaCaption}</p>
              )}
            </div>
          )}

          {mediaType === 'image' && (
            <div className="flex flex-col items-center gap-1.5">
              <img
                src={mediaUrl}
                alt={mediaCaption || 'Delil Görseli'}
                className="max-h-48 rounded-sm object-contain border border-[#d6cdbc]"
                onError={() => {
                  setUploadStatus({
                    type: 'error',
                    message: 'Görsel yüklenemedi. Lütfen geçerli bir görsel URL veya dosyası seçin.',
                  });
                }}
              />
              {mediaCaption && (
                <span className="text-xs text-[#575046] italic">{mediaCaption}</span>
              )}
            </div>
          )}

          {mediaType === 'video' && (
            <div className="space-y-1.5">
              {embedUrl ? (
                <div className="relative aspect-video rounded-sm overflow-hidden border border-[#d6cdbc] bg-[#1f1c18]">
                  <iframe
                    src={embedUrl}
                    title="Video Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  src={mediaUrl}
                  controls
                  className="w-full max-h-52 rounded-sm bg-[#1f1c18] object-contain border border-[#d6cdbc]"
                />
              )}
              {mediaCaption && (
                <span className="text-xs text-[#575046] italic block">{mediaCaption}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
