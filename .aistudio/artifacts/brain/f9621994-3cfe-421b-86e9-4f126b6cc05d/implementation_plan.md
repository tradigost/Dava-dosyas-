# Kompakt Numaralı Dosya Geçişi ve Navigasyon Arayüzü Uygulama Planı

Bu plan, zarf içerisindeki delil ve sorgu tutanakları arasında geçiş yapılırken butonların ekrandan taşmasını ve başlıkların kesilmesini önlemek amacıyla, kullanıcının seçtiği **"Numaralı kompakt butonlar + İleri/Geri okları"** ve **"Kısa etiketler (Belge 1, Belge 2) ile aktif belge başlığı"** mimarisini hayata geçirmeyi hedefler.

---

## 1. Tespit Edilen Problem (Mevcut Durum)
- Kullanıcının ilettiği ekran görüntüsünde görüldüğü üzere, dosyalar tam başlıklarıyla (`Dosya 1: Şaft Enkazı Kriminal Raporu & Kopan Çelik Halat`, `Dosya 2: Şaft Telsiz Panik ve Alarm Ses Bandı`, `Dosya 3: Polis & İş Güvenliği...`) tek bir yatay satırda yan yana dizildiğinde ekran sınırını aşmakta, 3. dosya `Dosya 3: P...` şeklinde kesilmekte ve sağa doğru taşma oluşturmaktadır.
- Zarf içindeki dosya sayısı 3 ve üzerine çıktığında mobil veya dar pencerelerde navigasyon ergonomisi bozulmaktadır.

---

## 2. Tasarlanacak Yeni Arayüz Çözümü

### A. Kompakt Numaralı Butonlar ve İleri/Geri Ok Navigasyonu
- **Önceki / Sonraki Butonları (`<ChevronLeft />`, `<ChevronRight />`)**:
  - Zarftaki belgeler arasında klavye veya tek dokunuşla sıralı geçiş yapmayı sağlayan ergonomik ok butonları.
  - İlk belgede "Önceki", son belgede "Sonraki" butonu `disabled` ve şık opaklık durumuna geçecek.
- **Kısa Etiketli Buton Grubu (`Belge 1`, `Belge 2`, `Belge 3`, ...)**:
  - Uzun başlıklar yerine standart ve kompakt `Belge 1`, `Belge 2`, `Belge 3` veya dosya türü ikonlu kompakt pill/tab yapısı kullanılacak.
  - İlgili dosyanın kategorisine göre mini bir ikon eklenecek:
    - 📄 Resmi Belge / Olay Yeri Zabtı
    - 🎙️ Ses Kaydı / Telsiz Bandı
    - ⚖️ Polis Sorgu Tutanağı
    - 🔬 Toksikoloji / Kriminalistik
  - Seçili olan buton parlak amber temasıyla vurgulanacak.

### B. Aktif Belge Başlık ve Özet Bilgi Çubuğu
- Numaralı buton grubunun hemen altında, seçili olan belgenin tam başlığını ve türünü gösteren özel bir başlık şeridi yer alacak:
  - **Sayaç**: `[2 / 3]` formatında aktif belge sırası.
  - **Kategori Rozeti**: `POLİS SORGUSU`, `SES KAYDI`, `KRİMİNAL RAPOR`, vb.
  - **Tam Başlık**: Hiçbir kesilmeye uğramadan, okunaklı ve net bir şekilde gösterilen dosya ismi.
  - **Hızlı Geçiş İpucu**: "Sonraki Belgeye Geç →" butonu ile akıcı inceleme akışı.

---

## 3. Değişiklik Yapılacak Dosyalar

1. **`src/components/PlayerInboxView.tsx`**:
   - `displayedEvidenceList` üzerindeki mevcut yatay taşmalı dosya butonları kaldırılacak.
   - Yeni kompakt navigasyon çubuğu eklenecek:
     - `currentIndex` hesabı ve `handlePrevEvidence` / `handleNextEvidence` fonksiyonları.
     - `<ChevronLeft />`, kompakt numaralı `Belge {index + 1}` butonları ve `<ChevronRight />`.
     - Seçili belgenin tam başlığını taşıyan `ActiveEvidenceHeaderBar` bileşeni.
   - Ekran genişliği ne olursa olsun (mobil, tablet, masaüstü) hiçbir buton ekrandan taşmayacak.

---

## 4. Doğrulama ve Test Adımları
- Farklı ekran genişliklerinde (375px mobil, 768px tablet, 1440px masaüstü) taşma ve kesilme olmaksızın test edilmesi.
- Zarf 1, Zarf 2 ve Zarf 3'teki 3'er ve 4'er belgeli tüm senaryolarda `Belge 1`, `Belge 2`, `Belge 3` geçişlerinin ve ileri/geri oklarının kusursuz çalıştığının doğrulanması.
- `lint_applet` (`tsc --noEmit`) ve `compile_applet` ile sıfır hata doğrulaması.
