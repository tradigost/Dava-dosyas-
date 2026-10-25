# Sadeleştirilmiş Dedektif Arayüzü (Ultra-Minimalist Oyun Ekranı) - Tamamlandı

## 1. Genel Bakış ve Yapılanlar
Kullanıcı tercihleri doğrultusunda, oyun başladığında ekrandaki tüm görsel kalabalık, çoklu butonlar, sekmeler ve laboratuvar mini-araçları kaldırılarak gerçek bir polis tahkikat dosyası sadeliğine kavuşturuldu.

---

## 2. Uygulanan Değişiklikler

1. **Üst Çubuk Sadeleştirmesi (`PlayerSimulatorBar.tsx`)**:
   - Üst kısımdaki simülatör telefon değiştirme butonları, ses açma/kapama, okunmamış bildirim sayaçları ve oda kodları oyun ekranından kaldırıldı.
   - Yalnızca tek satırda:
     - Sol tarafta dedektif adı ve rolü (`Dr. Selim · Adli Tıp & Kripto`).
     - Sağ tarafta zarf bilgisi (`Zarf 1 / 3`) ve sade bir `Ortak Pano` butonu bırakıldı.

2. **Diğer Dedektif Dosyaları Sekmesinin Kaldırılması**:
   - `Sizin Dosyalarınız` ve `Diğer Dedektifteki Dosyalar` sekmeleri tamamen kaldırıldı.
   - Her oyuncunun ekranı %100 kendi gizli uzmanlık dosyasına odaklandı. Masadaki oyuncular asimetrik bilgileri ekrandan değil, gerçek hayatta sözlü olarak birbirleriyle konuşmaktadır.

3. **Belge ve Delil Kartı Sadeleştirmesi (`PlayerInboxView.tsx`)**:
   - Karmaşık laboratuvar mini-araçları, reaktif butonları ve terminal pencereleri delil kartının içinden temizlendi.
   - Kart doğrudan resmi bir tahkikat tutanağı formuna dönüştürüldü:
     - Dosya Başlığı ve Gizlilik Kaşesi.
     - Özet Bulgu kutusu.
     - Daktilo formatında Resmi Rapor Metni.
     - 💡 Uzmanlık Çıkarımı.
     - **Tek ve Net Birincil Buton**: `[ 📌 Bu Bulguyu Ortak Panoya Yansıt ]`.

4. **Zarf İlerleme ve Kapı Butonu**:
   - Sayfa altındaki Zarf Doğrulama alanı sade, tek satırlık zarif bir buton haline getirildi (`Zarf 2 Doğrulama Sorusunu Çöz & İlerle`).
