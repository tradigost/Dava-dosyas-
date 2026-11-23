/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseScenario } from '../types';

export const KANDILLI_CASE: CaseScenario = {
  "id": "vaka-kandilli-son-saat-2026",
  "title": "Kandilli'de Son Saat: Sırça Köşk Cinayeti",
  "subtitle": "Gecikmeli Zehir, Kırık Kadeh ve 10 Zarflık Adli Bilişim Soruşturması",
  "bannerTag": "ÖZEL DOSYA • 10 ZARFLI GENİŞLETİLMİŞ SÜRÜM",
  "synopsis": "24 Ekim Cuma gecesi İstanbul Boğazı'nı vuran şiddetli lodos fırtınası sırasında, Horoloji Vakfı Başkanı Haluk Karahan (64), Kandilli'deki Sırça Köşk'ün içeriden elektronik ve mekanik olarak kilitli çalışma odasında ölü bulunur. Masada devrilmiş bir kristal viski kadehi, sönmüş puro ve tam 23:15'te durmuş altın bir cep saati vardır.\n\nOlay gecesi köşkte bulunan beş kişinin de kendi sırları, erişim pencereleri ve çelişkili ifadeleri mevcuttur. 10 zarflık soruşturma; sahte kamera döngülerinden 120 dakika gecikmeli mikrokapsüllere, şifreli kasa loglarından rıhtımdaki gizli buluşmaya uzanan çok katmanlı bir kumpası adım adım çözecektir.",
  "estimatedMinutes": 75,
  "difficulty": "Uzman",
  "minPlayers": 2,
  "maxPlayers": 6,
  "totalEnvelopes": 10,
  "status": "published",
  "createdAt": "2026-10-26T09:39:53.241Z",
  "victim": {
    "name": "Haluk Karahan",
    "age": 64,
    "title": "Horoloji Vakfı Başkanı & Antika Saat Koleksiyoneri",
    "causeInitial": "Akut Solunum ve Kalp Durması (Şüpheli Toksikolojik Bulgular)",
    "timeOfDeath": "24 Ekim Cuma, 23:10 - 23:20 aralığı",
    "locationOfBody": "Kandilli Sırça Köşk, 2. Kat Kilitli Çalışma Odası"
  },
  "suspects": [
    {
      "id": "supheli-1",
      "name": "Doç. Dr. Leyla Karahan",
      "title": "Farmakolog & Biyopolimer Araştırmacısı",
      "age": 38,
      "relation": "Kurbanın İkinci Eşi",
      "description": "Üniversitede kontrollü ilaç salınım sistemleri üzerine çalışan akademisyen. Haluk Karahan ile şiddetli geçimsizlik yaşadığı ve ertesi gün imzalanacak yeni protokolle mirastan çıkarılacağı biliniyor.",
      "alibi": "21:00'den itibaren 1. kattaki kış bahçesinde olduğunu, 22:30-23:15 arasında baş ağrısı nedeniyle yatak odasında dinlendiğini beyan etti.",
      "suspiciousQuotes": [
        "\"Haluk'un kalbi zaten zayıftı, kullandığı ritim ilaçlarını sık sık karıştırırdı.\"",
        "\"Laboratuvarımdaki test kapsüllerine köşkten kimsenin erişimi yoktu.\""
      ],
      "motiveHypothesis": "Yeni evlilik sözleşmesiyle mirastan çıkarılma tehlikesi ve araştırma fonlarının kesilmesi.",
      "initialSuspicion": 75,
      "photoPlaceholder": {
        "initials": "LK",
        "tint": "from-amber-950 to-stone-900",
        "silhouetteStyle": "bg-amber-900/30 border-amber-600/40 text-amber-300"
      },
      "photoUrl": "/cases/vaka5/supheli-1.jpg"
    },
    {
      "id": "supheli-2",
      "name": "Kerem Soylu",
      "title": "Kıdemli Saat Restoratörü & Baş Küratör",
      "age": 41,
      "relation": "Kurbanın 15 Yıllık Sağ Kolu ve Uzmanı",
      "description": "Sırça Köşk'ün bodrum katındaki restorasyon atölyesini yöneten, mekanik ve kimyasal yüzey temizliği uzmanı. Vakıf envanterindeki bazı nadide saatlerin replikalarıyla değiştirildiği şüphesiyle gündemdeydi.",
      "alibi": "21:30 - 23:30 saatleri arasında bodrum kattaki restorasyon atölyesinde mekanizma temizlediğini ve yukarı hiç çıkmadığını iddia etti.",
      "suspiciousQuotes": [
        "\"Haluk Bey saat 21:15'te bana özel karafından bir kadeh ikram etti ama içmeden çıktım.\"",
        "\"Porselen ilaç kutusuna elimi bile sürmedim, atölyemden de ayrılmadım.\""
      ],
      "motiveHypothesis": "3.2 milyon Euro değerindeki 'Breguet No. 160' saatinin orijinalini satıp yerine replika koyduğunun fark edilmesi.",
      "initialSuspicion": 75,
      "photoPlaceholder": {
        "initials": "KS",
        "tint": "from-blue-950 to-slate-900",
        "silhouetteStyle": "bg-blue-900/30 border-blue-600/40 text-blue-300"
      },
      "photoUrl": "/cases/vaka5/supheli-2.jpg"
    },
    {
      "id": "supheli-3",
      "name": "Cihan Karahan",
      "title": "Finans ve Kripto Varlık Yöneticisi",
      "age": 34,
      "relation": "Kurbanın İlk Eşinden Oğlu",
      "description": "Yüksek riskli türev piyasalarda işlem yapan ve babasıyla sürekli para krizi yaşayan finansçı. Saat 21:22 - 21:29 aralığında babasının odasında sert bir tartışma yaşadığı duyuldu.",
      "alibi": "21:32'de köşkten ayrıldığını, 22:00 - 23:30 arasında Bebek'teki bir barda arkadaşlarıyla olduğunu ve 23:40'ta köşke döndüğünü söyledi.",
      "suspiciousQuotes": [
        "\"Babamla tartıştığımız doğru ama saat 21:32'de köşkten arabamla çıktım, PTS kayıtlarına bakın!\"",
        "\"Oda kilitlendikten sonra Bebek'teydim, zehri benim vermem imkansız.\""
      ],
      "motiveHypothesis": "Vadesi 25 Ekim'de dolacak 18 milyon TL'lik tefeci borcunu kapatmak için mirasa ve soğuk cüzdana ulaşmak.",
      "initialSuspicion": 65,
      "photoPlaceholder": {
        "initials": "CK",
        "tint": "from-emerald-950 to-zinc-900",
        "silhouetteStyle": "bg-emerald-900/30 border-emerald-600/40 text-emerald-300"
      },
      "photoUrl": "/cases/vaka5/supheli-3.jpg"
    },
    {
      "id": "supheli-4",
      "name": "Sarp Demir",
      "title": "Müzayede Evi Direktörü & Eksper",
      "age": 49,
      "relation": "Kurbanın Eski İş Ortağı",
      "description": "Cenevre ve İstanbul arasında çalışan ünlü müzayede direktörü. Haluk Karahan'ın Cumartesi sabahı açıklayacağı 'Kara Liste' ekspertiz raporuyla ticari itibarı tamamen bitecekti.",
      "alibi": "Köşkün 1. katındaki misafir odasında 22:00'den itibaren Cenevre ile görüntülü toplantıda olduğunu beyan etti.",
      "suspiciousQuotes": [
        "\"Haluk'un çalışma odasına akşam hiç çıkmadım, kapısı biyometrik kilitliydi.\"",
        "\"Rıhtıma yanaşan tekne mi? Fırtınada kimse Boğaz'a açılamaz.\""
      ],
      "motiveHypothesis": "Haluk Karahan'ın Cumartesi sabahı savcılığa vereceği kaçak antika ekspertiz dosyasını engellemek.",
      "initialSuspicion": 65,
      "photoPlaceholder": {
        "initials": "SD",
        "tint": "from-purple-950 to-neutral-900",
        "silhouetteStyle": "bg-purple-900/30 border-purple-600/40 text-purple-300"
      },
      "photoUrl": "/cases/vaka5/supheli-4.jpg"
    },
    {
      "id": "supheli-5",
      "name": "Nevzat Çelik",
      "title": "Köşk Güvenlik ve Sistem Sorumlusu (Emekli Başkomiser)",
      "age": 56,
      "relation": "Kurbanın 10 Yıllık Özel Güvenlik Müdürü",
      "description": "Köşkün tüm CCTV, akıllı kilit ve alarm protokollerini yöneten isim. Haluk Karahan'ın elinde Nevzat'ın geçmişte üstünü örttüğü bir dosyaya dair kayıtlar bulunduğu iddia ediliyor.",
      "alibi": "Gece boyunca giriş katındaki güvenlik odasında ekranları izlediğini, 22:45'te lodos nedeniyle rıhtım sensörlerinde voltaj düşümü yaşandığını söyledi.",
      "suspiciousQuotes": [
        "\"Kamera kayıtlarında hiçbir müdahale yok, koridordan kimse geçmedi.\"",
        "\"Biyometrik kilit ve NVR sunucu logları dışarıdan değiştirilemez.\""
      ],
      "motiveHypothesis": "Haluk Karahan'ın elindeki şantaj kayıtlarını yok etmek ve içeriden yüklü miktarda ödeme almak.",
      "initialSuspicion": 55,
      "photoPlaceholder": {
        "initials": "NÇ",
        "tint": "from-rose-950 to-stone-900",
        "silhouetteStyle": "bg-rose-900/30 border-rose-600/40 text-rose-300"
      },
      "photoUrl": "/cases/vaka5/supheli-5.jpg"
    }
  ],
  "evidence": [
    {
      "id": "ev-101",
      "envelope": 1,
      "title": "Olay Yeri İnceleme ve Kilitli Oda Tutanağı",
      "category": "crime_scene",
      "roleAccess": [
        "field",
        "ballistics",
        "forensics",
        "profiler"
      ],
      "summary": "Çalışma odası masası üzerindeki devrilmiş viski kadehi, sönmüş puro, 23:15'te durmuş cep saati ve kilitli kapı raporu.",
      "fullReport": "OLAY YERİ İNCELEME RAPORU:\n1. DELİL #1 (Devrilmiş Kristal Viski Kadehi): Masanın sağ üst kısmında devrilmiş vaziyette, içinde 4 ml sıvı kalıntısı mevcut.\n2. DELİL #2 (Pirinç Küllük ve Küba Purosu): Cohiba Behike puro %40'ı içildikten sonra sönmüş; küllük kenarında beyazımsı kristalize mikro-partiküller var.\n3. DELİL #3 (18. Yüzyıl Altın Cep Saati): Kurbanın masasının yanında balans çarkı kırılmış ve akrep/yelkovan tam 23:15'te durmuş.\n4. KAPI DURUMU: Oda kapısı içeriden 'Deadbolt' emniyet mandalı ile kilitliydi; saat 23:45'te Nevzat Çelik tarafından koçbaşıyla kırılarak açıldı.",
      "keyDeduction": "Ölüm veya yere yığılma anı cep saatinin durduğu 23:15 olarak görünmektedir; ancak oda kapısı 21:30'dan beri içeriden kilitlidir.",
      "metadata": {
        "date": "25 Ekim 00:15",
        "caseRef": "OYİ-2026-101",
        "confidentiality": "OLAY YERİ TUTANAĞI"
      },
      "mediaType": "image",
      "mediaUrl": "/cases/vaka5/olay-yeri-kosk.jpg",
      "mediaCaption": "Olay Yeri Fotoğrafı: Kilitli çalışma odası, porselen çay kutusu ve boş cep saati yuvası"
    },
    {
      "id": "ev-102",
      "envelope": 1,
      "title": "Ön Otopsi ve Mide Muhtevası Bulgusu",
      "category": "autopsy",
      "roleAccess": [
        "forensics",
        "profiler"
      ],
      "summary": "Kurbanın ölüm saati 23:10 - 23:20 aralığı olarak belirlendi; viskide zehir yok, midede gecikmeli polimer kabukları saptandı.",
      "fullReport": "ADLİ TIP KURUMU ÖN OTOPSİ RAPORU:\n- Karaciğer sıcaklığı ve göz içi potasyum değerleri, ölümün 24 Ekim saat 23:10 ile 23:20 arasında gerçekleştiğini doğrulamaktadır.\n- Dudak ve tırnak yataklarında siyanoz ve akciğer ödemi mevcuttur.\n- Mide muhtevasında sindirilmemiş alkol ve mide asidinde kontrollü çözünen 'Eudragit-E100' bazlı gecikmeli salınım mikrokapsül kabukları bulunmuştur.\n- Viski kadehindeki sıvıda ise serbest halde zehir BULUNMAMIŞTIR.",
      "keyDeduction": "Zehir viski kadehinde değil; mideye girdikten belirli bir süre sonra çözünen bir mikrokapsül aracılığıyla alınmıştır.",
      "metadata": {
        "date": "25 Ekim 02:30",
        "caseRef": "ATK-2026-102",
        "confidentiality": "ADLİ TIP GİZLİ"
      }
    },
    {
      "id": "ev-103",
      "envelope": 1,
      "title": "Akıllı Kilit ve Koridor Erişim Logları",
      "category": "digital_logs",
      "roleAccess": [
        "cryptology",
        "archive",
        "forensics",
        "profiler"
      ],
      "summary": "Çalışma odası biyometrik kilidinin 20:00 - 23:45 arası açılma ve kapanma kayıtları.",
      "fullReport": "SİRÇA KÖŞK AKILLI BİNA SİSTEMİ (KNX-SEC) LOG DÖKÜMÜ:\n- 20:45:10 -> Giriş: Haluk Karahan (Parmak İzi Doğrulandı)\n- 20:52:00 -> Giriş: Sarp Demir (Zil + İçeriden Onay) | Çıkış: 21:01:15\n- 21:05:22 -> Giriş: Kerem Soylu (Zil + İçeriden Onay) | Çıkış: 21:18:04\n- 21:22:15 -> Giriş: Cihan Karahan (Zil + İçeriden Onay) | Çıkış: 21:29:50\n- 21:30:05 -> İçeriden 'Tam Kilit (Deadbolt)' aktif edildi.\n- 21:30:05 - 23:45:12 -> ANA KAPI HİÇ AÇILMADI.",
      "keyDeduction": "Odanın ana kapısından 21:30'dan sonra kimse girmemiştir; ancak 20:52-21:30 arasında odaya üç farklı şüpheli (Sarp, Kerem, Cihan) girip çıkmıştır.",
      "metadata": {
        "date": "25 Ekim 01:00",
        "caseRef": "SİB-2026-103",
        "confidentiality": "DİJİTAL DELİL"
      }
    },
    {
      "id": "ev-201",
      "envelope": 2,
      "title": "İleri Toksikoloji: Akonitin (Kurtboğan) ve Polimer Kinetiği",
      "category": "toxicology",
      "roleAccess": [
        "forensics",
        "profiler"
      ],
      "summary": "Kanda 4.8 mg/L Akonitin alkaloidi ve alkollü ortamda yaklaşık 120 dakika sonra yırtılan PLGA 50:50 kaplama saptandı.",
      "fullReport": "KİMYASAL ANALİZ VE FARMAKOKİNETİK RAPORU:\n1. Kan plazmasında 4.8 mg/L düzeyinde saf 'Aconitine' (Kurtboğan nörotoksini) tespit edilmiştir.\n2. Midede bulunan 'PLGA 50:50' hidrofobik kaplama, 37°C sıcaklıkta ve alkollü ortamda tam 115 ila 125 dakika (yaklaşık 2 saat) sonra yırtılarak zehri tek seferde salmaktadır.\n3. Ölüm 23:15 civarı gerçekleştiğine göre kurban zehirli kapsülü 21:10 ile 21:25 aralığında yutmuştur.",
      "keyDeduction": "120 dakikalık gecikme süresi nedeniyle kapsül saat 21:10 - 21:25 aralığında yutulmuş ya da bu pencereden önce ilaç kutusuna yerleştirilmiştir.",
      "metadata": {
        "date": "25 Ekim 03:40",
        "caseRef": "ATK-2026-201",
        "confidentiality": "LABORATUVAR RAPORU"
      }
    },
    {
      "id": "ev-202",
      "envelope": 2,
      "title": "Şüpheli İlk İfade Çapraz Sorgu Tutanakları",
      "category": "interrogation",
      "roleAccess": [
        "profiler",
        "archive",
        "forensics"
      ],
      "summary": "Şüphelilerin 20:50 - 21:30 arasındaki oda ziyaretleri ve porselen ilaç kutusu hakkındaki çelişkili beyanları.",
      "fullReport": "EMNİYET SORGU TUTANAĞI ÖZETİ:\n- Doç. Dr. Leyla Karahan: \"Haluk akşam 21:00'den sonra çalışma odasındaki porselen kutudan günlük CoQ10 vitamin kapsülünü içer. O kutuya hafta içi herkesin girip çıktığı çalışma odasından erişilebilir.\"\n- Sarp Demir: \"20:52'de odasına sadece saat kataloğunu bırakmak için uğradım, 21:01'de çıktım. Vitamin kutusuna bakmadım.\"\n- Kerem Soylu: \"21:05'te odaya çıktım. Bana 1978 Macallan viskisinden doldurdu, kendisi de bir kadeh aldı ve yanındaki kutudan vitaminini yuttu. 21:18'de ayrıldım.\"\n- Cihan Karahan: \"21:22'de içeri girdiğimde babam kadehini yudumluyordu, purosunu yeni yakmıştı. Tartıştık ve 21:29'da çıktım.\"",
      "keyDeduction": "Vitamin kutusuna Sarp (20:52), Kerem (21:05) ve Cihan (21:22) doğrudan erişebilmiştir; Leyla ise köşkte yaşamakta ve aynı biyopolimer kapsülleri bilmektedir.",
      "metadata": {
        "date": "25 Ekim 04:10",
        "caseRef": "SRG-2026-202",
        "confidentiality": "SORGU TUTANAĞI"
      }
    },
    {
      "id": "ev-301",
      "envelope": 3,
      "title": "Daktiloskopi: Porselen Kutu Parmak İzi Eşleşmesi",
      "category": "dactyloscopy",
      "roleAccess": [
        "ballistics",
        "forensics",
        "profiler"
      ],
      "summary": "Porselen vitamin kutusunun dış yüzeyi silinmiş; alt kaidesinde Kerem Soylu'ya, yan kenarında ise Sarp Demir'e ait parmak izi saptandı.",
      "fullReport": "KRİMİNAL DAKTİLOSKOPİ RAPORU:\n1. Çalışma masası üzerindeki porselen vitamin kutusunun dış kapağı mikrofiber bezle silinmiştir.\n2. Ancak Siyan Floresan yöntemiyle kutunun alt kaidesinde ve iç blister kenarında Kerem Soylu'ya ait (%99.98 uyum) başparmak izi, kutunun yan tutma yerinde ise Sarp Demir'e ait net izler tespit edilmiştir.\n3. Ayrıca kutu üzerinde Cihan Karahan'ın daha eski tarihten kalma avuç içi izi de mevcuttur.",
      "keyDeduction": "Porselen kutuda birden fazla şüphelinin izi bulunması, kutunun yalnızca tek bir kişi tarafından ellenmediğini göstermektedir.",
      "metadata": {
        "date": "25 Ekim 05:00",
        "caseRef": "KRM-2026-301",
        "confidentiality": "KRİMİNAL LABORATUVAR"
      }
    },
    {
      "id": "ev-302",
      "envelope": 3,
      "title": "Küllükteki Kristal Partiküllerin Spektrometrik Analizi",
      "category": "chemistry",
      "roleAccess": [
        "ballistics",
        "forensics",
        "profiler"
      ],
      "summary": "Pirinç küllükteki beyaz partiküllerin 'Seryum Oksit' ve 'Moebius 9010' sentetik saat yağı olduğu belirlendi.",
      "fullReport": "GC-MS (GAZ KROMATOGRAFİSİ) ANALİZ RAPORU:\n- Olay yerindeki küllükte (Delil #2) bulunan beyazımsı tozların puro külü olmadığı; antika saat kadranlarını parlatmakta kullanılan 'Seryum Oksit (CeO2)' ve İsviçre menşeli 'Moebius 9010' sentetik saat yağı damlacıkları olduğu saptanmıştır.\n- Bu karışım köşkte saat restorasyonu ve ekspertizi yapan uzmanların çalışma malzemeleri arasında yer almaktadır.",
      "keyDeduction": "Olay yerindeki puro ve küllüğe saat restorasyonu/ekspertiziyle ilgilenen birinin ellerinden bulaşan madde geçmiştir.",
      "metadata": {
        "date": "25 Ekim 05:30",
        "caseRef": "KRM-2026-302",
        "confidentiality": "KİMYASAL ANALİZ"
      }
    },
    {
      "id": "ev-401",
      "envelope": 4,
      "title": "Boğaz Rıhtımı Gece Görüş CCTV Kaydı (CAM-04)",
      "category": "surveillance",
      "roleAccess": [
        "field",
        "cryptology",
        "forensics",
        "profiler"
      ],
      "summary": "CAM-04 kamerasının SD kartından saat 22:48:12'de siyah yağmurluklu ve alüminyum çantalı bir şahsın rıhtıma çıktığı kurtarıldı.",
      "fullReport": "SAHA İSTİHBARAT VE CCTV İNCELEME RAPORU:\n- Güvenlik Müdürü Nevzat Çelik '22:45'te rıhtım kamerası voltaj düşümü yüzünden kapandı' demişti.\n- Ancak kameranın dahili SD kart önbelleğinden kurtarılan 22:48:12 tarihli CAM-04 karesinde; siyah su geçirmez yağmurluklu (1.78 - 1.82 m boylarında) bir şahsın elinde darbeye dayanıklı alüminyum bir saat taşıma çantasıyla (Pelican Case) rıhtım kapısından dışarı çıktığı görülmektedir.\n- Rıhtım kapısı şifresi Haluk Karahan, Nevzat Çelik ve alt kat bakım personeli tarafından bilinmektedir.",
      "keyDeduction": "Nevzat Çelik'in arıza dediği 22:48'de, alüminyum çantalı biri rıhtım kapısından çıkmıştır. Nevzat'ın bu durumu gizleyip gizlemediği araştırılmaktadır.",
      "metadata": {
        "date": "25 Ekim 06:15",
        "caseRef": "SAHA-2026-401",
        "confidentiality": "GÖRÜNTÜ İNCELEME"
      }
    },
    {
      "id": "ev-402",
      "envelope": 4,
      "title": "PTS (Plaka Tanıma Sistemi) ve Sahil Güvenlik Radar Kayıtları",
      "category": "traffic_radar",
      "roleAccess": [
        "field",
        "archive",
        "profiler"
      ],
      "summary": "Cihan Karahan 21:32'de köşkten ayrılmış; 22:46'da ise Sarp Demir'in şirketine ait Zodyak bot rıhtıma yanaşmıştır.",
      "fullReport": "İSTANBUL EMNİYETİ PTS VE SAHİL GÜVENLİK VTS RAPORU:\n1. Cihan Karahan'a ait 34 CK 911 plakalı araç: Saat 21:32'de Kandilli'den çıkış yapmış, 21:54 - 23:35 arası Bebek Vale otoparkında sabit kalmıştır. (Ancak Cihan'ın 21:22 - 21:29 aralığında, yani 120 dk gecikmeli kapsül penceresi içinde odada bulunduğu unutulmamalıdır!)\n2. Sahil Güvenlik VTS Radarı: Saat 22:46'da AIS vericisi kapalı 6 metrelik bir Zodyak botun köşk rıhtımına yanaşıp 22:51'de Kuruçeşme'ye uzaklaştığı tespit edilmiştir.\n3. Bot, müzayedeci Sarp Demir'in ortağı olduğu 'Chronos Denizcilik' adına kayıtlıdır.",
      "keyDeduction": "Cihan 22:48'de rıhtımda değildir ama 21:22-21:29'da odadaydı. 22:48'deki bot Sarp Demir'in şirketine aittir ve köşkteki biriyle teslimat yapmıştır.",
      "metadata": {
        "date": "25 Ekim 06:45",
        "caseRef": "PTS-2026-402",
        "confidentiality": "SAHA İSTİHBARAT"
      }
    },
    {
      "id": "ev-501",
      "envelope": 5,
      "title": "NVR Sunucu Logları ve Sahte Döngü (Loop) Kodu",
      "category": "cyber_forensics",
      "roleAccess": [
        "cryptology",
        "field",
        "forensics",
        "profiler"
      ],
      "summary": "Saat 22:40 - 22:55 arası kameralara sahte döngü scripti yüklenmiş; işlem yerel IP 192.168.1.44 ve 'N_CELIK_ADMIN' yetkisiyle yapılmıştır.",
      "fullReport": "ADLİ BİLİŞİM NVR İNCELEMESİ:\n- Güvenlik sunucusunda 22:40:00 - 22:55:00 arasında CAM-02 ve CAM-04 kameralarına 'rtsp_loop_inject.sh' betiğiyle önceki 15 dakikanın görüntüsü yansıtılmıştır.\n- Betik yerel ağdaki 192.168.1.44 IP'li terminalden tetiklenmiş, ancak sistemde 'N_CELIK_ADMIN' yönetici oturum anahtarı kullanılmıştır.\n- Bu oturum anahtarının köşk güvenlik odasından mı yoksa ağdaki bir terminal üzerinden kopyalanarak mı kullanıldığı henüz netleşmemiştir.",
      "keyDeduction": "Kamera döngüsü 192.168.1.44 IP'sinden başlatılmıştır ancak Nevzat Çelik'in yönetici kimliği kullanıldığı için Güvenlik Müdürü üzerindeki şüphe de sürmektedir.",
      "metadata": {
        "date": "25 Ekim 07:30",
        "caseRef": "SİB-2026-501",
        "confidentiality": "ADLİ BİLİŞİM"
      }
    },
    {
      "id": "ev-502",
      "envelope": 5,
      "title": "Köşk İçi Wi-Fi DHCP Tablosu ve Access Point Sinyalleri",
      "category": "network_logs",
      "roleAccess": [
        "cryptology",
        "archive",
        "profiler"
      ],
      "summary": "192.168.1.44 IP'sinin bodrum atölyeye ait olduğu ve ağdaki kayıtsız bir mobil cihazın 22:47'de rıhtımda, 23:18'de 2. katta sinyal verdiği görüldü.",
      "fullReport": "AĞ TOPOLOJİSİ VE RSSI SİNYAL RAPORU:\n- 192.168.1.25 -> Leyla_MacBook (1. Kat Yatak Odası - 22:00-23:30 arası bağlı, ancak telefon hattı 22:45'te Sarp ile kısa görüşme yaptı)\n- 192.168.1.38 -> Sarp_iPadPro (1. Kat Misafir Odası - 22:42-22:53 arası Zoom kamera/mikrofon kapalı)\n- 192.168.1.44 -> Atelier_PC (Bodrum Kat Saat Restorasyon Atölyesi)\n- ÖNEMLİ BULGU: Ağda 'Service_Device_04' adıyla görünen bir cihaz, saat 22:47'de Rıhtım AP'sine, saat 23:18'de ise 2. Kat Çalışma Odası AP'sine (-38 dBm çok yakın mesafe) bağlanmıştır.",
      "keyDeduction": "Kamera döngüsü bodrum atölyedeki bilgisayardan tetiklenmiş, ardından bir cihaz 22:47'de rıhtıma ve 23:18'de 2. kat odası yakınına gitmiştir. Sarp, Leyla ve Nevzat'ın hareketleri de hâlâ çelişkilidir.",
      "metadata": {
        "date": "25 Ekim 08:00",
        "caseRef": "SİB-2026-502",
        "confidentiality": "AĞ ANALİZİ"
      }
    },
    {
      "id": "ev-601",
      "envelope": 6,
      "title": "Üniversite Biyopolimer Laboratuvarı Envanter ve Geçiş Kaydı",
      "category": "lab_audit",
      "roleAccess": [
        "archive",
        "forensics",
        "profiler"
      ],
      "summary": "Leyla Karahan'ın laboratuvarından 6 adet boş PLGA kapsülü eksilmiş; 18 Ekim'de terazi kalibrasyonu için Kerem Soylu'nun da laboratuvara girdiği görülmüştür.",
      "fullReport": "BOĞAZİÇİ BİYOMEDİKAL ENSTİTÜSÜ DENETİM RAPORU:\n1. Doç. Dr. Leyla Karahan'ın '120 Dakika Gecikmeli Salınım' projesine ait kilitli dolaptan 18 Ekim Cuma günü 6 adet test kapsülünün eksildiği saptanmıştır.\n2. Kayıtlara göre 18 Ekim saat 16:30'da Leyla Karahan laboratuvara 'mikro-terazi kalibrasyonu' için Kerem Soylu'yu getirmiş, sonra dekanlık toplantısına inerek Kerem'i 25 dakika yalnız bırakmıştır.\n3. Ancak denetim notunda, kilitli dolabın anahtarının yalnızca Leyla Karahan'da olduğu ve dolapta zorlama bulunmadığı belirtilmiştir.",
      "keyDeduction": "Kapsüller Leyla'nın kilitli dolabından çıkmıştır; ya Leyla kapsülleri bizzat çıkarmıştır ya da Kerem kalibrasyon sırasında anahtara veya yedek tüpe ulaşmıştır.",
      "metadata": {
        "date": "25 Ekim 08:45",
        "caseRef": "ARŞ-2026-601",
        "confidentiality": "KURUMSAL DENETİM"
      }
    },
    {
      "id": "ev-602",
      "envelope": 6,
      "title": "Psikolojik Profilleme ve Suç Mahalli Sahneleme (Staging) Analizi",
      "category": "profiling",
      "roleAccess": [
        "profiler",
        "forensics"
      ],
      "summary": "Masadaki cep saati düşerek değil, ince uçlu bir saatçi cımbızıyla (Dumont No.5) kasten 23:15'e sabitlenip bozulmuştur.",
      "fullReport": "DAVRANIŞ BİLİMLERİ BİRİMİ RAPORU:\n1. SUÇ MAHALLİ SAHNELEMESİ: Masadaki cep saatinin (Delil #3) 23:15'te durması kaza değildir. Balans çarkındaki kırık, ince uçlu bir saatçi cımbızıyla (Dumont No.5) mekanizmanın kasten sıkıştırılmasıyla oluşturulmuştur.\n2. AMAÇ: Fail, ölüm saatini kesin olarak 23:15'e sabitleyip o dakikada odanın kilitli olduğunu öne sürmek istemiştir.\n3. MİKRO-İFADE: Kerem vitamin kutusu sorulduğunda sağ başparmağını gizlemiş; Sarp ise 22:45 Zodyak sorusunda ses tonunu yükseltmiştir.",
      "keyDeduction": "Cep saati profesyonel bir saatçi veya eksper cımbızıyla 23:15'e sabitlenmiştir. Ancak kapı 21:30'dan beri kilitliyse 23:18'de odaya nasıl girilmiştir?",
      "metadata": {
        "date": "25 Ekim 09:15",
        "caseRef": "PRF-2026-602",
        "confidentiality": "PROFİLLEME RAPORU"
      }
    },
    {
      "id": "ev-701",
      "envelope": 7,
      "title": "Mimari Kroki ve Gizli 'Monşarj' (Evrak Asansörü) Şaftı",
      "category": "architecture",
      "roleAccess": [
        "field",
        "ballistics",
        "profiler"
      ],
      "summary": "1890 tarihli mimari planda bodrum atölyeden 2. kat çalışma odasına çıkan 55x65 cm'lik gizli monşarj şaftı ve içinde yağmurluk lifleri bulundu.",
      "fullReport": "MİMARİ VE KRİMİNAL İNCELEME RAPORU:\n- 1890 tarihli orijinal Osmanlı mimari planlarında, bodrum kattaki saat atölyesi ile 2. kat çalışma odasının ahşap lambri duvarı arasında, değerli saatlerin taşınması için yapılmış 55x65 cm boyutlarında gizli bir 'Monşarj' (servis/evrak asansörü) şaftı bulunmuştur.\n- Çalışma odasındaki gizli lambri kapak içeriden sürgülü değildir; şaft içindeki mekanik dişliyle açılmaktadır.\n- Şaftın iç yüzeyinde siyah yağmurluktan kopan poliüretan membran lifleri ve Moebius 9010 saat yağı izleri tespit edilmiştir.",
      "keyDeduction": "Katil ana kapıyı hiç açmadan, bodrumdaki atölyeden gizli monşarj şaftıyla 23:18'de kilitli çalışma odasına girmiştir!",
      "metadata": {
        "date": "25 Ekim 10:00",
        "caseRef": "OYİ-2026-701",
        "confidentiality": "MİMARİ DELİL"
      },
      "mediaType": "image",
      "mediaUrl": "/cases/vaka5/monsarj-saft.jpg",
      "mediaCaption": "Kriminal Fotoğraf: Ceviz lambri arkasındaki gizli monşarj evrak asansörü şaftı"
    },
    {
      "id": "ev-702",
      "envelope": 7,
      "title": "Çalışma Odası Duvar Kasası ve Eksilen 'Breguet No. 160' Kaydı",
      "category": "safe_inspection",
      "roleAccess": [
        "ballistics",
        "archive",
        "forensics"
      ],
      "summary": "Çalışma odasındaki duvar kasasının saat 21:12 ve 23:19 açılış kayıtları ile ölüm sonrası parmak izi basımı bulgusu.",
      "fullReport": "KASA VE ENVANTER İNCELEME TUTANAĞI:\n1. Çalışma odasındaki zırhlı saat kasasının dahili hafızası iki açılış kaydetmiştir:\n   - 1. Açılış (Saat 21:12): Haluk Karahan tarafından açılmıştır.\n   - 2. Açılış (Saat 23:19): Kurbanın sağ işaret parmağı (post-mortem / ölüm sonrası biyometrik temas) kullanılarak kasa tekrar açılmış ve içindeki 'SAHTE REPLİKA EKSPERTİZ DOSYASI' ile 'Breguet No. 160' mekanizması alınmıştır.\n2. Kurbanın sağ işaret parmağı ucunda ölüm sonrası ekimoz ve tırnak kenarında lateks eldiven pudrası saptanmıştır.",
      "keyDeduction": "Katil 23:18'de monşarj şaftından odaya girdiğinde Haluk Karahan ölmüştü; fail cesedin parmağını kasaya bastırarak sahte replika ekspertiz dosyasını almıştır.",
      "metadata": {
        "date": "25 Ekim 10:30",
        "caseRef": "KRM-2026-702",
        "confidentiality": "KRİMİNAL RAPOR"
      }
    },
    {
      "id": "ev-801",
      "envelope": 8,
      "title": "Şifreli Ses Kayıt Cihazı: Saat 21:08 Kayıt Dökümü",
      "category": "cryptology_audio",
      "roleAccess": [
        "cryptology",
        "profiler",
        "forensics"
      ],
      "summary": "Haluk Karahan'ın masasındaki şifreli ses kayıt cihazında saat 21:08'de sahte Breguet No. 160 ekspertizi üzerine sert bir konuşma bulundu.",
      "fullReport": "KRİPTOLOJİ VE SES ANALİZ LABORATUVARI (DOSYA: REC_2410_2106.WAV):\n[Şifre, cep saati seri numarası '1794' ile çözüldü]\n- 21:06:12 | Haluk Karahan: \"Otur Kerem. İsviçre'den gelen metalürji raporu elimde. Kasadaki Breguet No. 160'ın sonradan işlenmiş CNC replika olduğunu tespit ettim!\"\n- 21:07:45 | Kerem Soylu: \"Haluk Bey, ben Sarp'ın getirdiği katalogla karşılaştırdım, bana da sürpriz oldu...\"\n- 21:08:30 | Haluk Karahan: \"Yarın sabah 09:00'da ekspertiz dosyasını savcılığa ve vakıf kuruluna sunuyorum; Sarp da sen de hesap vereceksiniz. Tansiyonum yükseldi, şu ilaç kutumu uzatır mısın, birazdan Cihan da gelecek.\"\n- 21:09:15 | [Porselen kutu kapağının açılma ve kristal kadeh sesi].",
      "keyDeduction": "Haluk, Breguet No. 160 replika skandalını savcılığa vereceğini söylemiş ve tam o anda tansiyon ilacı sandığı porselen kutudan kapsülü almıştır.",
      "metadata": {
        "date": "25 Ekim 11:15",
        "caseRef": "KRP-2026-801",
        "confidentiality": "SES DEŞİFRE TUTANAĞI"
      }
    },
    {
      "id": "ev-802",
      "envelope": 8,
      "title": "MASAK Kripto Transferi ve Paravan Şirket İncelemesi",
      "category": "financial_intelligence",
      "roleAccess": [
        "archive",
        "cryptology",
        "profiler"
      ],
      "summary": "Sarp Demir'in Zürih şirketi üzerinden 22:52'de 850.000 USDT kripto ödemesi onaylandı; ayrıca botanik ekstre alımı saptandı.",
      "fullReport": "MASAK (MALİ SUÇLARI ARAŞTIRMA KURULU) RAPORU:\n1. Sarp Demir'in Zürih'teki paravan şirketi 'Helvetia Horology AG' üzerinden 24 Ekim gecesi saat 22:52'de (rıhtımdaki bot buluşmasından 4 dakika sonra) donanım cüzdanına 850.000 USDT aktarılmıştır.\n2. 12 Ekim'de 'Horolojik Deri Koruyucu' açıklamasıyla Rize'den Endemik Aconitum (Kurtboğan) ekstresi satın alındığı; faturanın Vakıf Restorasyon bütçesinden kesildiği saptanmıştır.\n3. Öte yandan, Nevzat Çelik'in hesabına da geçen ay Zürih kaynaklı 150.000 Euro danışmanlık ödemesi girdiği tespit edilmiştir.",
      "keyDeduction": "Sarp Demir 22:52'de büyük kripto ödemesini onaylamıştır; ancak Nevzat'ın Zürih ödemesi ve Leyla'nın laboratuvar kapsülleri hâlâ birden fazla suç ortağı ihtimalini açık bırakmaktadır.",
      "metadata": {
        "date": "25 Ekim 11:45",
        "caseRef": "MSK-2026-802",
        "confidentiality": "MASAK GİZLİ"
      }
    },
    {
      "id": "ev-901",
      "envelope": 9,
      "title": "Restorasyon Atölyesi Ultrasonik Yıkama Tankı ve Eldiven DNA'sı",
      "category": "forensic_trace",
      "roleAccess": [
        "ballistics",
        "forensics",
        "field"
      ],
      "summary": "Atölye yıkama tankında Akonitin + PLGA kalıntısı, bacada CAM-04'teki yağmurluk ve üzerinde hem Kerem'in DNA'sı hem kurbanın parmak sürüntüsü olan eldiven bulundu.",
      "fullReport": "KRİMİNAL LABORATUVAR KESİN EŞLEŞTİRME RAPORU:\n1. Bodrum kattaki atölyede bulunan ultrasonik parça yıkama tankının gider filtresinde Aconitine kristalleri ve PLGA polimer kaplama artıkları tespit edilmiştir.\n2. Atölye havalandırma bacasında, üzerinde Boğaz suyu damlaları bulunan siyah su geçirmez yağmurluk (CAM-04'teki kıyafet) ve bir çift pudralı lateks eldiven ele geçirilmiştir.\n3. Eldivenin iç yüzeyindeki epitel DNA'sı Kerem Soylu ile; dış yüzeyindeki deri sürüntüsü ise kurban Haluk Karahan'ın sağ işaret parmağı ile %100 eşleşmiştir.\n4. Leyla Karahan'ın yatak odası ve eşyalarında toksine rastlanmamış; Nevzat Çelik'in ise Zürih ödemesini rıhtım kapısı şifresini paylaşmak için aldığı ancak cinayet anından habersiz olduğu anlaşılmıştır.",
      "keyDeduction": "Zehir hazırlama tankı, CAM-04 yağmurluğu ve cesedin parmağını kasaya bastıran eldivendeki çift taraflı DNA eşleşmesi fiziksel faili kesinleştirmektedir.",
      "metadata": {
        "date": "25 Ekim 12:10",
        "caseRef": "KRM-2026-901",
        "confidentiality": "KESİN DELİL RAPORU"
      }
    },
    {
      "id": "ev-902",
      "envelope": 9,
      "title": "Sarp Demir'in Kuruçeşme'de Yakalanması ve Şifreli Mesaj Dökümü",
      "category": "digital_forensics",
      "roleAccess": [
        "profiler",
        "archive",
        "cryptology"
      ],
      "summary": "Kuruçeşme'de alüminyum çanta ve orijinal Breguet No. 160 ile yakalanan Sarp Demir'in 'ATÖLYE-K' kullanıcısıyla mesajları çözüldü.",
      "fullReport": "OPERASYON VE DİJİTAL İNCELEME TUTANAĞI:\n- Kuruçeşme Marina'da durdurulan Sarp Demir'in elindeki Pelican çantada orijinal 'Breguet No. 160' saati ve kasadaki savcılık ihbar dosyası bulunmuştur.\n- Sarp'ın telefonundaki Signal yazışmalarında 'ATÖLYE-K' kullanıcısı ile kayıtlar:\n  * [21:16] ATÖLYE-K: \"120 dk kapsül verildi. 23:15'te işlem tamam.\"\n  * [22:42] ATÖLYE-K: \"NVR döngüsü devrede. Rıhtıma yanaş, çantayı veriyorum.\"\n  * [23:22] ATÖLYE-K: \"Monşarj şaftından çıktım, parmak iziyle kasadaki dosyayı aldım. Cep saatini 23:15'e kırdım.\"",
      "keyDeduction": "Zehri bizzat hazırlayıp içiren ve monşarj şaftıyla odaya girip saati kıran katil Kerem Soylu; çalıntı saati satın alan suç ortağı ise Sarp Demir'dir.",
      "metadata": {
        "date": "25 Ekim 12:30",
        "caseRef": "OPR-2026-902",
        "confidentiality": "SAVCILIK DOSYASI"
      }
    },
    {
      "id": "ev-1001",
      "envelope": 10,
      "title": "Cumhuriyet Başsavcılığı Nihai İddianame Özeti",
      "category": "indictment",
      "roleAccess": [
        "forensics",
        "cryptology",
        "profiler",
        "field",
        "ballistics",
        "archive"
      ],
      "summary": "10 zarftaki tüm uzmanlık bulgularını birleştiren son soruşturma özeti.",
      "fullReport": "CUMHURİYET BAŞSAVCILIĞI SORUŞTURMA ÖZETİ:\nMasadaki uzmanların 9 zarf boyunca topladığı adli tıp, kriptoloji, kriminalistik, saha, profilleme ve arşiv delilleri tamamlanmıştır. Nihai suçlama oylamasında asıl faili, cinayet motifini ve kilit kanıtı işaretleyin.",
      "keyDeduction": "Tüm maddi ve dijital kanıtlar birleştirilmiştir; nihai karar masadaki dedektiflerindir.",
      "metadata": {
        "date": "25 Ekim 13:00",
        "caseRef": "SAV-2026-1001",
        "confidentiality": "NİHAİ DOSYA"
      }
    }
  ],
  "gates": {
    "1": {
      "envelope": 1,
      "title": "Zarf 1 Kapı Sorusu: Kilitli Oda ve İlk Bulgu",
      "instructions": "Olay yeri inceleme, ön otopsi ve akıllı kilit loglarını birleştirerek ilk çelişkiyi çözün.",
      "question": "Haluk Karahan'ın 23:15'te öldüğü ve odanın 21:30'dan itibaren içeriden kilitli olduğu bilindiğine göre, ön otopsideki en kritik bulgu nedir?",
      "options": [
        {
          "id": "g1-opt-1",
          "text": "Zehir viski kadehinde serbest halde değildir; midede gecikmeli salınım (Eudragit-E100) mikrokapsül kabukları bulunmuştur.",
          "isCorrect": true
        },
        {
          "id": "g1-opt-2",
          "text": "Kurban saat 23:15'te balkon kapısından giren biri tarafından enjektörle zehirlenip kapı dışarıdan kilitlenmiştir.",
          "isCorrect": false
        },
        {
          "id": "g1-opt-3",
          "text": "Ölüm doğal kalp krizidir; viski kadehindeki kehribar renkli sıvıda yüksek dozda uyku ilacı saptanmıştır.",
          "isCorrect": false
        }
      ],
      "explanation": "Viski kadehinde zehir yoktur; kurban odaya kilitlenmeden önce gecikmeli çözünen bir kapsül yutmuştur.",
      "hintByRole": {
        "field": "Cep saati 23:15'i gösteriyor ve kapı içeriden kilitli.",
        "forensics": "Mide muhtevasında Eudragit-E100 gecikmeli kapsül kabukları var."
      }
    },
    "2": {
      "envelope": 2,
      "title": "Zarf 2 Kapı Sorusu: Zehrin Yutulma Saati",
      "instructions": "İleri toksikoloji (PLGA 120 dk kinetiği) ile şüpheli ifadelerini çaprazlayın.",
      "question": "PLGA 50:50 kaplamalı Akonitin zehri yaklaşık 120 dakika sonra açılıp 23:15'te ölüme yol açtığına göre, kurban kapsülü hangi aralıkta yutmuştur?",
      "options": [
        {
          "id": "g2-opt-1",
          "text": "Saat 21:10 - 21:25 aralığında çalışma odasında bulunduğu sırada, porselen kutudaki akşam vitamini sanarak.",
          "isCorrect": true
        },
        {
          "id": "g2-opt-2",
          "text": "Saat 22:30 sularında yatak odasından gelen bitki çayının içinde erimiş halde içerek.",
          "isCorrect": false
        },
        {
          "id": "g2-opt-3",
          "text": "Saat 19:00'da akşam yemeği sırasında çorbasına karıştırılmış sıvı halde tüketerek.",
          "isCorrect": false
        }
      ],
      "explanation": "23:15'ten 120 dakika geriye gidildiğinde 21:10 - 21:25 aralığına ulaşılır.",
      "hintByRole": {
        "forensics": "PLGA kaplama 115-125 dakika (2 saat) sonra yırtılıyor.",
        "profiler": "21:05 - 21:29 aralığında odaya giren isimleri kontrol edin."
      }
    },
    "3": {
      "envelope": 3,
      "title": "Zarf 3 Kapı Sorusu: Parmak İzi ve Küllükteki İz",
      "instructions": "Porselen kutu parmak izi analizi ile küllükteki kimyasal raporu birleştirin.",
      "question": "Porselen kutunun iç blisterindeki 14 noktalı parmak izi ile küllükteki 'Seryum Oksit + Moebius 9010' kalıntısı neyi gösterir?",
      "options": [
        {
          "id": "g3-opt-1",
          "text": "İç blisterde Kerem Soylu'nun izi, yan kenarda Sarp Demir'in izi ve küllükte saat atölyesi yağı bulunduğunu.",
          "isCorrect": true
        },
        {
          "id": "g3-opt-2",
          "text": "Porselen kutuya yalnızca Leyla Karahan'ın eldivenle dokunduğunu ve küllükte ilaç tozu olduğunu.",
          "isCorrect": false
        },
        {
          "id": "g3-opt-3",
          "text": "Güvenlik müdürü Nevzat Çelik'in silah temizleme yağının puro külüne karıştığını.",
          "isCorrect": false
        }
      ],
      "explanation": "İç blisterde Kerem'in, yan kenarda Sarp'ın izi ve küllükte saat yağı kalıntısı saptanmıştır.",
      "hintByRole": {
        "ballistics": "Blister izi Kerem'e, yan kenar Sarp'a ait; küllükte Moebius 9010 saat yağı var."
      }
    },
    "4": {
      "envelope": 4,
      "title": "Zarf 4 Kapı Sorusu: Gece 22:48 Rıhtım Kamerası",
      "instructions": "CAM-04 CCTV karesi ile PTS ve Sahil Güvenlik VTS radar kayıtlarını inceleyin.",
      "question": "Saat 22:48:12'de CAM-04 kamerasında alüminyum çantayla görüntülenen kişi rıhtımda hangi araçla buluşmuştur?",
      "options": [
        {
          "id": "g4-opt-1",
          "text": "AIS vericisi kapalı yanaşan ve Sarp Demir'in ortak olduğu 'Chronos Denizcilik' şirketine kayıtlı Zodyak botla.",
          "isCorrect": true
        },
        {
          "id": "g4-opt-2",
          "text": "Cihan Karahan'ın kullandığı ve Bebek'ten Kandilli'ye geri dönen 34 CK 911 plakalı otomobille.",
          "isCorrect": false
        },
        {
          "id": "g4-opt-3",
          "text": "Fırtına nedeniyle rıhtıma sığınan Sahil Güvenlik devriye botuyla.",
          "isCorrect": false
        }
      ],
      "explanation": "Rıhtıma yanaşan Zodyak bot Sarp Demir'in şirketine aittir.",
      "hintByRole": {
        "field": "CAM-04 saati 22:48:12; VTS radarı Chronos Denizcilik botunu gösteriyor."
      }
    },
    "5": {
      "envelope": 5,
      "title": "Zarf 5 Kapı Sorusu: Sahte Kamera Döngüsü ve IP Takibi",
      "instructions": "NVR sunucu logları ile Wi-Fi Access Point sinyal verilerini çaprazlayın.",
      "question": "Saat 22:40'ta kameralara sahte döngü (loop) yükleyen 192.168.1.44 IP'li bilgisayar ve sinyal hareketi neyi ortaya koyar?",
      "options": [
        {
          "id": "g5-opt-1",
          "text": "Döngü bodrum atölyedeki bilgisayardan tetiklenmiş, kayıtsız bir mobil cihaz ise 22:47'de rıhtımda ve 23:18'de 2. katta sinyal vermiştir.",
          "isCorrect": true
        },
        {
          "id": "g5-opt-2",
          "text": "Döngü Leyla Karahan'ın yatak odasındaki MacBook'tan yüklenmiş, cihaz 23:18'de kış bahçesine inmiştir.",
          "isCorrect": false
        },
        {
          "id": "g5-opt-3",
          "text": "Nevzat Çelik güvenlik odasındaki kendi terminalinden döngüyü başlatıp doğrudan rıhtıma yürümüştür.",
          "isCorrect": false
        }
      ],
      "explanation": "192.168.1.44 bodrum atölye bilgisayarıdır; kayıtsız cihaz 22:47'de rıhtıma, 23:18'de 2. kata çıkmıştır.",
      "hintByRole": {
        "cryptology": "192.168.1.44 bodrum atölyeye ait; Service_Device_04 rıhtım ve 2. katta sinyal vermiş."
      }
    },
    "6": {
      "envelope": 6,
      "title": "Zarf 6 Kapı Sorusu: Kapsüller ve Cep Saati Sahnelemesi",
      "instructions": "Biyomedikal Enstitüsü geçiş kayıtları ile Profilleme raporunu birleştirin.",
      "question": "Laboratuvar denetimi ve suç mahalli sahneleme (staging) raporu birlikte neyi kanıtlamaktadır?",
      "options": [
        {
          "id": "g6-opt-1",
          "text": "Kapsüller Leyla'nın laboratuvarından eksilmiştir (Kerem 18 Ekim'de oradaydı); masadaki cep saati ise Dumont No.5 cımbızla 23:15'e sabitlenmiştir.",
          "isCorrect": true
        },
        {
          "id": "g6-opt-2",
          "text": "Kapsüller eczaneden sahte reçeteyle alınmış; cep saati ise kurban yere düşerken masaya çarparak kırılmıştır.",
          "isCorrect": false
        },
        {
          "id": "g6-opt-3",
          "text": "Sarp Demir kapsülleri Cenevre'den getirmiş, cep saatini de Cihan Karahan 21:25'te durdurmuştur.",
          "isCorrect": false
        }
      ],
      "explanation": "18 Ekim'de Kerem terazi kalibrasyonu için laboratuvara girmiş, cep saati ise Dumont No.5 saatçi cımbızıyla durdurulmuştur.",
      "hintByRole": {
        "archive": "18 Ekim ziyaretçi defterinde Kerem'in girişi var.",
        "profiler": "Cep saati saatçi cımbızıyla kasten 23:15'te sıkıştırılmış."
      }
    },
    "7": {
      "envelope": 7,
      "title": "Zarf 7 Kapı Sorusu: Kilitli Odaya Giriş Sırrı",
      "instructions": "Mimari kroki ve zırhlı duvar kasası loglarını inceleyin.",
      "question": "Çalışma odasının ana kapısı içeriden sürgülü olduğu halde, fail 23:18'de odaya nasıl girip kasayı açmıştır?",
      "options": [
        {
          "id": "g7-opt-1",
          "text": "Bodrum atölyeden odaya çıkan gizli 'Monşarj' evrak asansörü şaftını kullanmış ve ölmüş olan Haluk Bey'in parmağını kasa sensörüne bastırmıştır.",
          "isCorrect": true
        },
        {
          "id": "g7-opt-2",
          "text": "Dış cepheden halatla tırmanıp pencereyi elmasla kesmiş ve kasayı güvenlik şifresini kırarak açmıştır.",
          "isCorrect": false
        },
        {
          "id": "g7-opt-3",
          "text": "Kurban ölmeden hemen önce kasayı kendi isteğiyle açıp dosyaları havalandırma boşluğuna atmıştır.",
          "isCorrect": false
        }
      ],
      "explanation": "Bodrum atölyeden çıkan gizli monşarj şaftı ve kurbanın parmağındaki post-mortem ekimoz kilidi açıklamaktadır.",
      "hintByRole": {
        "ballistics": "Parmak ucunda ölüm sonrası ekimoz ve eldiven pudrası var.",
        "field": "1890 planında 55x65 cm gizli monşarj şaftı görülüyor."
      }
    },
    "8": {
      "envelope": 8,
      "title": "Zarf 8 Kapı Sorusu: Ses Kaydı ve Para İzi",
      "instructions": "Şifreli ses kaydı (REC_2410_2106.WAV) ile MASAK blokzincir raporunu birleştirin.",
      "question": "Saat 21:08 ses kaydına ve MASAK raporuna göre Haluk Karahan'ın öldürülme nedeni ve kripto ödeme zamanlaması nedir?",
      "options": [
        {
          "id": "g8-opt-1",
          "text": "Haluk Bey, Breguet No. 160'ın CNC replika olduğunu çözüp savcılığa gideceğini bildirmiştir; ödeme ise rıhtım teslimatından 4 dakika sonra (22:52) onaylanmıştır.",
          "isCorrect": true
        },
        {
          "id": "g8-opt-2",
          "text": "Cihan Karahan'ın tefeci borçları nedeniyle tartışma çıkmış; ödeme ise cinayetten üç gün önce yapılmıştır.",
          "isCorrect": false
        },
        {
          "id": "g8-opt-3",
          "text": "Leyla Karahan'ın boşanma tazminatı talebi reddedilmiş; 850.000 USDT ise vakıf hesabına yatırılmıştır.",
          "isCorrect": false
        }
      ],
      "explanation": "Replika Breguet skandalı 21:08 kaydında ortaya çıkmış, 850.000 USDT ise 22:52'de transfer edilmiştir.",
      "hintByRole": {
        "archive": "MASAK 22:52'de 850.000 USDT transferi ve Rize Akonitin alımını gösteriyor.",
        "cryptology": "1794 şifreli ses kaydında Breguet No. 160 tartışması var."
      }
    },
    "9": {
      "envelope": 9,
      "title": "Zarf 9 Kapı Sorusu: Kesin Fiziksel Kanıt ve Operasyon",
      "instructions": "Atölye yıkama tankı raporu ile Kuruçeşme Marina baskın tutanağını doğrulayın.",
      "question": "Zarf 9'daki laboratuvar ve dijital baskın bulguları suçun fiziksel failini nasıl kesinleştirmektedir?",
      "options": [
        {
          "id": "g9-opt-1",
          "text": "Atölye tankında Akonitin + PLGA, bacada yağmurluk + çift DNA'lı eldiven bulunmuş; Sarp'ın telefonunda ise 'ATÖLYE-K' yazışmaları çözülmüştür.",
          "isCorrect": true
        },
        {
          "id": "g9-opt-2",
          "text": "Leyla Karahan'ın yatak odasında zehir kapsülleri ve Sarp Demir'in Zodyak botunun yedek anahtarı ele geçirilmiştir.",
          "isCorrect": false
        },
        {
          "id": "g9-opt-3",
          "text": "Nevzat Çelik'in güvenlik odasında ultrasonik tank ve kurbanın çalınan orijinal Breguet saati bulunmuştur.",
          "isCorrect": false
        }
      ],
      "explanation": "Ultrasonik tanktaki zehir kalıntısı, çift taraflı DNA eşleşmesi ve Sarp'ın Signal yazışmaları zinciri kapatmıştır.",
      "hintByRole": {
        "ballistics": "Eldivende hem Kerem'in DNA'sı hem kurbanın parmak sürüntüsü var."
      }
    },
    "10": {
      "envelope": 10,
      "title": "Zarf 10: Nihai Karar ve Suçlama Oturumu",
      "instructions": "10 zarftaki tüm deliller incelendi. Bireysel suçlama oylamasını başlatın.",
      "question": "Masadaki tüm dedektifler asıl katili, motifi ve kilit delili işaretlemeye hazır mı?",
      "options": [
        {
          "id": "g10-opt-ready",
          "text": "Evet, tüm bulguları birleştirdik; nihai suçlama oylamasına geç!",
          "isCorrect": true
        }
      ],
      "explanation": "Bireysel suçlama ve mahkeme hükmü ekranına geçiliyor...",
      "hintByRole": {}
    }
  },
  "solution": {
    "culpritId": "supheli-2",
    "culpritName": "Kerem Soylu",
    "motiveTitle": "3.2 Milyon Euro'luk 'Breguet No. 160' Vurgunu ve Sahte Replika Skandalının Örtbas Edilmesi",
    "keyEvidenceTitle": "Restorasyon Atölyesi Ultrasonik Yıkama Tankı ve Eldiven DNA'sı",
    "verdictSummary": "Katil, Horoloji Vakfı Baş Restoratörü Kerem Soylu'dur; Sarp Demir ise çalıntı saati satın alan suç ortağıdır. Leyla'nın laboratuvar kapsülleri, Cihan'ın 21:22 oda ziyareti ve Nevzat'ın Zürih ödemesi soruşturma boyunca güçlü açık kapılar oluştursa da; 192.168.1.44 atölye bilgisayarından kamera döngüsü yükleyen, bodrum monşarj şaftıyla kilitli odaya giren, ultrasonik tankta Akonitin hazırlayan ve eldiven DNA'sıyla kasayı açan fail Kerem Soylu'dur.",
    "fullChronology": [
      {
        "time": "12 - 18 Ekim 2026",
        "action": "Kerem Soylu vakıf bütçesinden Aconitine ekstresi temin etti ve terazi kalibrasyonu bahanesiyle girdiği Leyla Karahan'ın laboratuvarından 120 dk gecikmeli PLGA kapsüllerini aldı.",
        "proof": "MASAK Kaydı (ev-802) ve Enstitü Ziyaretçi Defteri (ev-601)"
      },
      {
        "time": "24 Ekim, 21:05 - 21:18",
        "action": "Haluk Karahan, Breguet No. 160'ın CNC replika olduğunu anlayıp sabah savcılığa gideceğini söyleyince Kerem porselen kutudaki vitamin yerine gecikmeli zehir kapsülünü verdi.",
        "proof": "Şifreli Ses Kaydı (ev-801) ve Daktiloskopi Raporu (ev-301)"
      },
      {
        "time": "Saat 21:30",
        "action": "Cihan Karahan'la tartışan Haluk Karahan odayı içeriden 'Deadbolt' ile kilitledi.",
        "proof": "Akıllı Kilit Logları (ev-103)"
      },
      {
        "time": "Saat 22:40 - 22:52",
        "action": "Kerem, atölyedeki 192.168.1.44 IP'li bilgisayardan kameralara 15 dakikalık sahte döngü yükledi; siyah yağmurlukla rıhtıma çıkıp orijinal saati Sarp Demir'e teslim etti ve 850.000 USDT aldı.",
        "proof": "CAM-04 Kaydı (ev-401), NVR Logu (ev-501) ve MASAK (ev-802)"
      },
      {
        "time": "Saat 23:12 - 23:22",
        "action": "120 dk dolunca Haluk Karahan hayatını kaybetti. Kerem gizli monşarj şaftından kilitli odaya çıktı, kurbanın parmağıyla kasadan ekspertiz dosyasını aldı ve cep saatini Dumont No.5 cımbızla 23:15'e kırdı.",
        "proof": "Monşarj Raporu (ev-701), Kasa Logu (ev-702) ve Eldiven DNA'sı (ev-901)"
      }
    ],
    "confessionAudioTranscript": "\"(İstanbul Cinayet Büro - 25 Ekim 14:20)\nBaşkomiser: Kerem, atölyendeki ultrasonik tankta Kurtboğan kristalleri, bacada CAM-04 yağmurluğun, eldivende çift DNA eşleşmen ve Sarp'ın Signal yazışmaları masada.\nKerem Soylu: Yıllarca bodrumda milyon dolarlık saatlere hayat verdim ama Haluk Bey bana hep bir hizmetçi gibi davrandı. İsviçre'den metalürji raporu gelince her şey bitecekti. Leyla Hanım'ın laboratuvarından aldığım 120 dakikalık kapsülü ilacının yerine koydum. Kapıyı kendi eliyle kilitledi; saat 23:18'de monşarj şaftından yukarı çıktığımda cep saatini 23:15'e sabitleyip kusursuz bir kilitli oda kurgusu bırakmak istemiştim...\"",
    "confessionLetter": "[ADLİ EMANET KASASI - KEREM SOYLU'NUN İTİRAF METNİ]\n\n\"15 yıl boyunca Sırça Köşk'ün bodrum katında Haluk Karahan'ın koleksiyonunu ayağa kaldırdım. O, 3.2 milyon Euro'luk Breguet No. 160 ile övünürken bana hep bir zanaatkâr işçisi muamelesi yaptı.\n\nSarp Demir bana Cenevre'deki alıcıyı getirdiğinde kusursuz bir CNC replika ürettim ve gerçeğini değiştirdim. Ama Haluk metalürji raporunu getirtip 21:08'de savcılığa gideceğini söyledi. Leyla Hanım'ın laboratuvarında terazi kalibrasyonu yaparken aldığım 120 dakika gecikmeli PLGA kapsülünü Aconitine ile doldurmuştum; porselen kutudaki vitamininin yerine koydum.\n\nSaat 21:30'da kapıyı içeriden kilitlediğinde tuzağa düşmüştü. 22:40'ta atölye bilgisayarından kameraları döngüye alıp rıhtımda Sarp'a saati teslim ettim. 23:18'de ise yalnızca ikimizin bildiği gizli monşarj şaftından yukarı çıktım; ölmüş parmağıyla kasadaki ekspertiz dosyasını aldım ve cep saatini Dumont cımbızla 23:15'te kırdım. Leyla'nın kapsülleri, Cihan'ın 21:22'deki kavgası ve Nevzat'ın Zürih ödemesi varken kimsenin bodrumdaki sessiz restoratörden şüphelenmeyeceğini düşünmüştüm.\""
  }
};
