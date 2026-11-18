---
name: masadaki-dava-design
description: Masadaki Dava oyununun sade, fiziksel belge odaklı UI/UX tasarım sistemi ve arayüz kuralları. Her ekran yenilemesinde, yeni bileşen tasarımında ve Aider görev kartlarında bu kurallara uyulur.
---

# Masadaki Dava — Sade Belge Odaklı Tasarım Sistemi

## 1. Temel Tasarım Felsefesi
Fiziksel bir kutu/masa dava oyununda oyuncu masaya konulan belgeleri **sırayla, tek tek** inceler. Arayüz bir "kontrol paneli (dashboard)" değil, **sakin bir okuma ve çıkarım masası** olmalıdır.

- **Tek Odak (One Focus per View):** Her ekranda kullanıcının yapacağı tek bir ana iş vardır. Yan paneller, aynı anda açık duran çoklu araçlar ve kalabalık rozetler gizlenir veya akışın dışına alınır.
- **Sıralı Belge Akışı (Linear Document Flow):** Belgeler karmaşık ızgaralar veya sekmeler yerine **Belge 1 → Belge 2 → Belge 3** şeklinde sırayla ilerler.
- **Tek Elle Kullanım (Thumb-Zone First):** Mobilde kullanıcının ekranın dört bir yanına dokunması engellenir. Ana ilerleme butonları (`Önceki`, `Sonraki`, `Devam Et`) ekranın **alt bölgesinde**, başparmağın kolayca ulaştığı sabit bir alanda yer alır.
- **Sakin Hiyerarşi:** Bilgi yoğunluğu azaltılır; boşluk (whitespace) ve net tipografi, kutucuk ve çerçeve kalabalığının yerini alır.

---

## 2. Renk Paleti & Yüzeyler (Kağıt Üzerine Daktilo Çıktısı)
Oyuncu ekrana baktığında **fiziksel bir arşiv klasöründen çıkarılmış, daktiloyla yazılmış kağıt sayfaları** görür:

- **Masa / Dosya Zemini (Background):** `#ebe5d8` (sıcak manila/arşiv dosya tonu)
- **Kağıt Sayfa (Printed Sheet):** `#faf6ed` — ince kağıt kenarlığı (`border-[#d6cdbc]`) ve hafif fiziksel sayfa gölgesi (`shadow-[0_2px_12px_rgba(31,28,24,0.07)]`).
- **Aktif / Seçili Sayfa:** `#fffdf8` — belirgin mürekkep kenarlığı (`border-[#1f1c18]`).
- **Mürekkep Hiyerarşisi:**
  - Ana daktilo mürekkebi: `#1f1c18`
  - İkincil mürekkep / meta: `#575046`
  - Silik tarih / belge numarası: `#7c7265`
- **Vurgu Renkleri (Kısıtlı Kullanım):**
  - **Ana Aksiyon (Mürekkep Siyahı):** `#1f1c18` (hover `#36312b`), üzerinde `#faf6ed` yazı.
  - **Resmi Damga / Mühür Kırmızısı:** `#8b1e1e` (yalnızca seçili damga, kilitli zarf, suçlama veya kritik uyarı).
  - **Onay / Hazır:** `#276749` (küçük mürekkep onayı).

---

## 3. Tipografi & Okuma Kuralları
- **Daktilo Karakteri:** `font-typewriter` (`JetBrains Mono`, `Courier New`, `monospace`) — başlıklar, belge numaraları, meta satırları ve resmi ifadelerde daktilo çıktısı hissi verir.
- **Okuma Metni:** Rahat satır yüksekliği (`leading-relaxed`, `1.65–1.75`), mobilde en az `14px–16px`, maksimum satır genişliği `max-w-2xl`.
- **Fiziksel Sayfa Hissi:** Keskin veya çok hafif yuvarlatılmış köşeler (`rounded-sm` veya `rounded`) — modern plastik "uygulama kartı" (`rounded-3xl`) yerine gerçek A4/dosya kağıdı hissi.

---

## 4. Ekran Bazlı Düzen Kuralları

### A. Lobi (`LobbyView`)
- **3 Net Adım:** (1) Dava Seç → (2) Oyuncu Sayısı / İsimler → (3) Masaya Otur (Başlat).
- Online Oda / Giriş / Admin gibi ikincil aksiyonlar üst barda sade ikon/metin olarak durur, ana akışı boğmaz.
- Dava kartlarında yalnızca başlık, kısa 1-2 cümle özet, süre/oyuncu bilgisi ve puan gösterilir; fazla etiket yığılmaz.

### B. Belge İnceleme (`PlayerInboxView`)
- **Üst Bar (Minimal):** Sadece `Zarf X` başlığı, ilerleme sayacı (`Belge 2 / 5`) ve tek bir sade `Tüm Belgeler` çekmecesi butonu (isteyen listeden atlayabilsin diye, ama ekranı kaplamadan).
- **Orta Alan (Tek Belge):** Sadece aktif belgenin içeriği (tür etiketi, başlık, metin, varsa ses/görsel medya). Kart içinde kart (nested card) kullanımından kaçınılır.
- **Alt Çubuk (Sabit Başparmak Alanı):**
  - Sol: `← Önceki` (ikincil, sakin buton)
  - Sağ: `Sonraki Belge →` (veya son belgedeyse `Sonraki Zarfa Geç` / `Suçlamaya Geç` birincil amber buton)

### C. Zarf Geçişi (`EnvelopeGateModal`) & Suçlama (`AccusationPhase`)
- Tek bir net soru/onay, geniş butonlar, gereksiz alt açıklamalar olmadan sade akış.

---

## 5. Geliştirme & Aider İş Akışı Kuralları
1. **İş Mantığını Koru:** Firebase bağlantıları, `gameRules.ts`, rol filtrelemeleri ve `soundManager` çağrıları korunur; yalnızca sunum (JSX/Tailwind) sadeleştirilir.
2. **Önce Token / Ortak Stil, Sonra Ekran:** Değişiklikler ekran ekran (Lobi → Brifing → Belge İnceleme → Suçlama) yapılır.
3. **Doğrulama:** Her ekran değişikliğinden sonra `npm run lint` ve `npm run build` çalıştırılır.
