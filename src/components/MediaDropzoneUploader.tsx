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
  Play, 
  Volume2, 
  ExternalLink,
  FileCode
} from 'lucide-react';
import { soundManager } from '../utils/audioEffects';

interface MediaDropzoneUploaderProps {
  mediaType: 'text' | 'audio' | 'image' | 'video';
  mediaUrl: string;
  mediaCaption: string;
  onUpdateUrl: (url: string) => void;
  onUpdateCaption: (caption: string) => void;
}

export const MediaDropzoneUploader: React.FC<MediaDropzoneUploaderProps> = ({
  mediaType,
  mediaUrl,
  mediaCaption,
  onUpdateUrl,
  onUpdateCaption,
}) => {
  const [isDragging, setIsDragging] = useState(false);
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

  const handleFileProcess = (file: File) => {
    soundManager.playKeyClick();
    const sizeKB = file.size / 1024;
    const sizeMB = sizeKB / 1024;

    // Auto-fill caption if empty
    if (!mediaCaption) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      onUpdateCaption(cleanName);
    }

    // Firestore document limit is 1MB. Safe base64 limit is ~750KB.
    if (sizeKB <= 750) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          onUpdateUrl(dataUrl);
          soundManager.playSuccessSound();
          setUploadStatus({
            type: 'success',
            message: `✓ "${file.name}" belleğe aktarıldı (${sizeKB.toFixed(0)} KB). Firestore'a kaydedilecek.`,
          });
        }
      };
      reader.onerror = () => {
        soundManager.playErrorSound();
        setUploadStatus({
          type: 'error',
          message: 'Dosya okunurken hata oluştu.',
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Large file: can read as data URL but warn user about Firestore limit or allow blob preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          onUpdateUrl(dataUrl);
          setUploadStatus({
            type: 'warning',
            message: `⚠️ Dosya ${sizeMB.toFixed(1)} MB (Firestore'un 1 MB limitini zorlayabilir). Büyük videolar için YouTube veya harici CDN linki yapıştırmanız önerilir.`,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleManualFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
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

  return (
    <div className="sm:col-span-3 bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
          {mediaType === 'audio' && <Headphones className="w-4 h-4 text-amber-400" />}
          {mediaType === 'image' && <ImageIcon className="w-4 h-4 text-cyan-400" />}
          {mediaType === 'video' && <Video className="w-4 h-4 text-rose-400" />}
          <span>{getMediaTypeName()} Yükleme & Bağlantı Stüdyosu</span>
        </label>
        <span className="text-[10px] text-zinc-500 font-mono">
          {isDataUrl ? '📁 Yerel Dosya (Base64)' : mediaUrl ? '🔗 Harici URL' : '⚪ Medya Eklenmedi'}
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-zinc-700/80 hover:border-amber-500/60 bg-zinc-900/50 hover:bg-zinc-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedExtensions()}
          onChange={handleManualFileInput}
          className="hidden"
        />

        <div className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-amber-400 mb-2">
          <UploadCloud className="w-5 h-5 animate-pulse" />
        </div>

        <p className="text-xs font-bold text-zinc-200">
          {getMediaTypeName()} dosyasını buraya sürükleyip bırakın
        </p>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          veya cihazınızdan dosya seçmek için <span className="text-amber-400 underline">tıklayın</span>
        </p>
        <p className="text-[10px] text-zinc-500 font-mono mt-1">
          {mediaType === 'audio' && 'Desteklenen formatlar: .mp3, .wav, .ogg, .m4a (< 750 KB önerilir)'}
          {mediaType === 'image' && 'Desteklenen formatlar: .jpg, .png, .webp (< 750 KB önerilir)'}
          {mediaType === 'video' && 'Desteklenen formatlar: .mp4, .webm (Büyük videolar için URL önerilir)'}
        </p>
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
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          )}
          <span>{uploadStatus.message}</span>
        </div>
      )}

      {/* Direct URL Input Fallback */}
      <div>
        <label className="block text-zinc-400 mb-1 text-[11px] font-medium">
          Veya Doğrudan İnternet / YouTube / CDN Bağlantısı Yapıştırın:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => onUpdateUrl(e.target.value)}
            placeholder={
              mediaType === 'audio'
                ? 'https://example.com/kayit.mp3 veya data:audio/...'
                : mediaType === 'image'
                ? 'https://images.unsplash.com/... veya data:image/...'
                : 'https://youtube.com/watch?v=... veya https://example.com/video.mp4'
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
