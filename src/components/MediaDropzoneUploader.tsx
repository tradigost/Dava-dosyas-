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
        return 'Kamera / CCTV Videosu (.mp4)';
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
        message: `✓ Firebase Storage'a yüklendi (${Math.round(result.sizeBytes / 1024)} KB)`,
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

  // Helper for YouTube embed preview
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

  return (
    <div className="sm:col-span-3 bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
          {mediaType === 'audio' && <Headphones className="w-4 h-4 text-amber-400" />}
          {mediaType === 'image' && <ImageIcon className="w-4 h-4 text-cyan-400" />}
          {mediaType === 'video' && <Video className="w-4 h-4 text-rose-400" />}
          <span>{title || `${getMediaTypeName()} Yükleme & Bağlantı Stüdyosu`}</span>
        </label>
        <span className="text-[10px] text-zinc-400 font-mono shrink-0">
          {isFirebaseStorageUrl
            ? '☁️ Firebase Storage'
            : isDataUrl
            ? '⚠️ Eski Base64'
            : mediaUrl
            ? '🔗 URL Bağlantısı'
            : '⚪ Medya Eklenmedi'}
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center transition-all ${
          isUploading
            ? 'border-amber-500/70 bg-amber-950/20 cursor-wait'
            : isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01] cursor-pointer'
            : 'border-zinc-700/80 hover:border-amber-500/60 bg-zinc-900/50 hover:bg-zinc-900/80 cursor-pointer'
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

        <div className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-amber-400 mb-2">
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <UploadCloud className="w-5 h-5" />
          )}
        </div>

        {isUploading ? (
          <div className="w-full max-w-xs space-y-1.5">
            <p className="text-xs font-bold text-amber-300">
              Firebase Storage&apos;a Yükleniyor... %{uploadProgress}
            </p>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
              <div
                className="h-full bg-amber-500 transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold text-zinc-200">
              {getMediaTypeName()} dosyasını buraya sürükleyip bırakın
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              veya cihazınızdan dosya seçmek için <span className="text-amber-400 underline">tıklayın</span>
            </p>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">
              {mediaType === 'audio' && 'Desteklenen formatlar: .mp3, .wav, .ogg, .m4a (Maks. 25 MB)'}
              {mediaType === 'image' && 'Desteklenen formatlar: .jpg, .png, .webp (Otomatik sıkıştırılır · Maks. 25 MB)'}
              {mediaType === 'video' && 'Desteklenen formatlar: .mp4, .webm (Maks. 25 MB veya harici URL)'}
            </p>
          </>
        )}
      </div>

      {/* Upload Feedback Status */}
      {uploadStatus.message && (
        <div
          className={`p-2 rounded-lg text-[11px] font-mono flex items-start gap-2 border ${
            uploadStatus.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : uploadStatus.type === 'warning'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          )}
          <span>{uploadStatus.message}</span>
        </div>
      )}

      {/* Direct URL Input Fallback */}
      <div>
        <label className="block text-zinc-400 mb-1 text-[11px] font-medium">
          Veya Doğrudan İnternet / YouTube / Storage Bağlantısı Yapıştırın:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => onUpdateUrl(e.target.value)}
            placeholder={
              mediaType === 'audio'
                ? 'https://.../kayit.mp3 veya /cases/vaka1/...'
                : mediaType === 'image'
                ? 'https://.../delil.webp veya /cases/vaka1/...'
                : 'https://youtube.com/watch?v=... veya https://.../video.mp4'
            }
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-100 font-mono text-xs focus:outline-none focus:border-amber-400"
          />
          {mediaUrl && (
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                onUpdateUrl('');
                setUploadStatus({ type: 'idle', message: '' });
              }}
              className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-600/50 text-rose-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
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
          <label className="block text-zinc-400 mb-1 text-[11px]">
            Medya Alt Açıklaması / Başlığı:
          </label>
          <input
            type="text"
            value={mediaCaption}
            onChange={(e) => onUpdateCaption(e.target.value)}
            placeholder={
              mediaType === 'audio'
                ? 'örn: 112 Acil İhbar ve Telsiz Dinleme Bandı'
                : mediaType === 'image'
                ? 'örn: Maktulün Çalışma Masası ve Kırık Kadeh'
                : 'örn: Güvenlik Kamerası 23:45 Koridor Kaydı'
            }
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-100 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>
      )}

      {/* Live Preview in Editor */}
      {mediaUrl && (
        <div className="pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
              🔍 Canlı Önizleme (Editör Testi)
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              Dedektifler oyunda bu medyayı görecek/dinleyecek
            </span>
          </div>

          {/* Audio Player Preview */}
          {mediaType === 'audio' && (
            <div className="p-3 bg-zinc-900 rounded-xl border border-amber-600/30 flex flex-col gap-2">
              <audio src={mediaUrl} controls className="w-full accent-amber-500 rounded h-9" />
              {mediaCaption && (
                <span className="text-xs text-zinc-300 italic">🎙️ {mediaCaption}</span>
              )}
            </div>
          )}

          {/* Image Preview */}
          {mediaType === 'image' && (
            <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col items-center">
              <img
                src={mediaUrl}
                alt={mediaCaption || 'Delil Görseli'}
                className="max-h-48 rounded-lg object-contain border border-zinc-800"
                onError={() => {
                  setUploadStatus({
                    type: 'error',
                    message: 'Görsel yüklenemedi. Lütfen geçerli bir görsel URL veya dosyası seçin.',
                  });
                }}
              />
              {mediaCaption && (
                <span className="text-xs text-zinc-400 italic mt-1.5">📸 {mediaCaption}</span>
              )}
            </div>
          )}

          {/* Video Preview */}
          {mediaType === 'video' && (
            <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800">
              {embedUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-black">
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
                  className="w-full max-h-52 rounded-lg bg-black object-contain border border-zinc-800"
                />
              )}
              {mediaCaption && (
                <span className="text-xs text-zinc-400 italic mt-1.5 block">🎥 {mediaCaption}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
