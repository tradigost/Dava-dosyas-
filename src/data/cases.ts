/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseScenario, RoleInfo, RoleType } from '../types';

export const ROLES: Record<RoleType, RoleInfo> = {
  forensics: {
    type: 'forensics',
    title: 'Adli Tıp Uzmanı',
    badge: '🔬 OTOPSİ & TOKSİKOLOJİ',
    color: 'emerald',
    shortDesc: 'Otopsi bulguları, kimyasal spektrumlar, biyolojik ve toksik numune analizleri.',
    iconName: 'Activity',
  },
  cryptology: {
    type: 'cryptology',
    title: 'Kriptoloji Uzmanı',
    badge: '💻 ŞİFRE & SES DEŞİFRE',
    color: 'cyan',
    shortDesc: 'Şifreli donanımlar, kilitli terminaller, gizli ses kayıtları ve telekom kayıtları.',
    iconName: 'Terminal',
  },
  profiler: {
    type: 'profiler',
    title: 'Profilleme Uzmanı',
    badge: '🧠 DAVRANIŞ & SORGU',
    color: 'amber',
    shortDesc: 'Şüpheli ifadeleri, psikolojik çelişkiler, alibi açıkları ve motivasyon haritaları.',
    iconName: 'Fingerprint',
  },
  field: {
    type: 'field',
    title: 'Saha Ajanı',
    badge: '🕵️ FİZİKİ TAKİP & PTS',
    color: 'blue',
    shortDesc: 'Olay yeri çevre kameraları, görgü tanıkları ve güvenlik protokolü kayıtları.',
    iconName: 'MapPin',
  },
  ballistics: {
    type: 'ballistics',
    title: 'Kriminalistik Uzmanı',
    badge: '🔍 PARMAK İZİ & İZ İNCELEME',
    color: 'rose',
    shortDesc: 'Mikroskobik lif analizleri, ayakkabı izleri, araç lastik desenleri ve yüzey izleri.',
    iconName: 'Search',
  },
  archive: {
    type: 'archive',
    title: 'Emniyet Arşiv Uzmanı',
    badge: '📜 MALİ İSTİHBARAT & SABIKA',
    color: 'purple',
    shortDesc: 'Banka transferleri, şirket bilançoları, eski sabıka kayıtları ve dava geçmişleri.',
    iconName: 'FileText',
  },
};

export const CASE_SCENARIOS: CaseScenario[] = [
  {
    id: 'son-kadeh',
    title: 'Son Kadeh: Müzayede Cinayeti',
    subtitle: 'Kandilli Yalı Müzayedesi Ardından Şüpheli Zehirlenme',
    difficulty: 'Zor',
    estimatedMinutes: 25,
    minPlayers: 2,
    maxPlayers: 6,
    bannerTag: '2-6 KİŞİLİK ASİMETRİK VAKA (2 KİŞİ İLE OYNANABİLİR)',
    synopsis: 
      'Türkiye’nin en varlıklı antikacısı ve sanat koleksiyoneri Turgut Soylu (58), Kandilli’deki yalısının çalışma odasında, elinde bir kadeh kristal viskiyle cansız bulundu. Masada kırık bir bardak, cebinde yırtık bir müzayede kataloğu ve kasada şifrelenmiş bir ses kaydı var. Görünüşte ani kalp krizi veya kadehteki zehir gibi dursa da, asimetrik deliller gizli bir planı açığa çıkarıyor.',
    victim: {
      name: 'Turgut Soylu',
      age: 58,
      title: 'Koleksiyoner, Soylu Müzayede A.Ş. Kurucusu',
      timeOfDeath: '14 Ekim Cumartesi, 23:45 civarı',
      locationOfBody: 'Kandilli Yalısı, 2. Kat Kütüphane & Çalışma Odası',
      causeInitial: 'Akut solunum yetmezliği ve siyanid türevi kardiyak blokaj',
    },
    suspects: [
      {
        id: 'selin-soylu',
        name: 'Selin Soylu',
        title: 'Kurbanın Eşi (Sanat Galericisi)',
        age: 36,
        relation: 'Eşi (6 yıllık evli, boşanma arifesinde)',
        description: 'Nişantaşı’nda lüks bir sanat galerisi işletiyor. Turgut Soylu ile son 6 aydır şiddetli geçimsizlik yaşıyordu ve boşanma davasında 40 Milyon TL tazminat talep etmişti.',
        alibi: 'Cinayet gecesi 21:30 ile 01:00 arası Bebek’teki galerisinde yeni sergi hazırlığında olduğunu, asistanı Leyla’nın buna şahitlik edeceğini iddia ediyor.',
        suspiciousQuotes: [
          '"Turgut çok paronoyaktı ama şifreleri asla bir kağıda yazmazdı; bana hep benim için sanatın başladığı o büyülü yıldır şifrem derdi. En hayran olduğu tabloyu bilmeyen yoktur."',
          '"Evlilik sözleşmemiz vardı ama son vasiyetinde bana pay bırakıp bırakmadığını bilmiyordum. Ölümüne sevinmedim ama yalan söyleyemem, rahatladım."',
          '"Çalışma odasındaki kasayı sadece Turgut açabilirdi. İçinde ortak hesap dökümlerimiz vardı."'
        ],
        motiveHypothesis: 'Boşanma protokolündeki kısıtlamaları aşıp tüm mirasa ve değerli antikalara tek başına sahip olma arzusu.',
        initialSuspicion: 65,
        photoPlaceholder: {
          initials: 'SS',
          tint: 'from-amber-950 to-stone-900',
          silhouetteStyle: 'bg-amber-900/30 border-amber-600/40 text-amber-300'
        }
      },
      {
        id: 'cemil-vural',
        name: 'Cemil Vural',
        title: 'Kurbanın Eski Ortağı (Müzayede Direktörü)',
        age: 48,
        relation: 'İş Ortağı & Müzayede Şefi (15 yıllık ortaklık)',
        description: 'Soylu Müzayedecilik şirketinin operasyonel ortağı. Son müzayedede satışa sunulan 19. yüzyıl tablolarında sahtecilik yapıldığı iddiasıyla Turgut Soylu tarafından denetime tabi tutulmuştu.',
        alibi: 'Akşam 20:00’de şirketten çıkıp evine gittiğini, gece boyu evde uyuduğunu ve villaya kesinlikle uğramadığını ilk ifadesinde belirtti.',
        suspiciousQuotes: [
          '"Turgut’la tartıştık ama cinayetle ilgim yok. Sahte tablo dedikodularını bana yıkarak şirketten hissemi ucuza kapatmak istiyordu."',
          '"Ayakkabımdaki balçık mı? Sahilde yürüyüş yapmıştım. Gece villaya gitmedim dedim ya!"',
          '"Tamam itiraf ediyorum! 22:30’da villaya gittim, bağırdık çağırdık ama ben 22:50’de çıkarken Turgut masasında viskisini yudumluyordu! Hatta kapıdan çıkarken Dr. Kerem’in arabasını gördüm!"'
        ],
        motiveHypothesis: '12 Milyon TL’lik sahte eser usulsüzlüğünün ifşa edilmesini ve cezaevine girmeyi engellemek.',
        initialSuspicion: 75,
        photoPlaceholder: {
          initials: 'CV',
          tint: 'from-blue-950 to-slate-900',
          silhouetteStyle: 'bg-blue-900/30 border-blue-600/40 text-blue-300'
        }
      },
      {
        id: 'dr-kerem',
        name: 'Dr. Kerem Akman',
        title: 'Özel Hekim & Kardiyolog',
        age: 42,
        relation: 'Kurbanın 8 yıllık kişisel hekimi',
        description: 'Turgut Soylu’nun kalp ritim bozukluğunu tedavi eden özel doktoru. Aynı zamanda Turgut Soylu’nun fonladığı Özel Akman Kardiyoloji Enstitüsü’nün başhekimi.',
        alibi: 'Akşam 20:45’te kurbana rutin akşam vitamin ve magnezyum kapsülünü bizzat içirip 21:00’de villadan ayrıldığını, gece boyu Kadıköy’deki nöbetçi kliniğinde ameliyat evraklarıyla ilgilendiğini iddia ediyor.',
        suspiciousQuotes: [
          '"Turgut Bey’e saat 20:45’te her zamanki kardiyo-vitamin destek kapsülünü verdim. Kendi ellerimle bir bardak ılık suyla içirdim."',
          '"Ben 21:00’de villadan çıktım. Gece 23:45’teki ölüm saatinde Kadıköy polikliniğimde yalnızdım, kamera arızalıydı."',
          '"Turgut benim sadece hastam değil, hamimdi. Kliniğin bütçe açığı vardı ama aramızda para konusu sorun olmazdı."'
        ],
        motiveHypothesis: 'Klinik hesaplarından zimmete geçirdiği 25 Milyon TL’nin ertesi sabah savcılığa bildirilecek olması ve hapis cezası tehlikesi.',
        initialSuspicion: 50,
        isCulprit: true,
        photoPlaceholder: {
          initials: 'KA',
          tint: 'from-emerald-950 to-zinc-900',
          silhouetteStyle: 'bg-emerald-900/30 border-emerald-600/40 text-emerald-300'
        }
      }
    ],
    evidence: [
      // ZARF 1 EVIDENCE
      {
        id: 'ev-101',
        envelope: 1,
        title: 'Otopsi Ön Raporu: Kanda Zehir & Mide Kapsülü',
        category: 'autopsy',
        roleAccess: ['forensics', 'field'],
        summary: 'Kurbanın kanında siyanid türevi toksin bulundu. Ancak viski kadehindeki zehir seviyesi sıfıra yakınken, midede erimesi 3 saat süren polimer kaplamalı bir gastro-kapsül tespit edildi!',
        fullReport: 
          'İSTANBUL ADLİ TIP KURUMU MORG İHTİSAS DAİRESİ\n' +
          'Otopsi No: 2026/8941 - Maktul: Turgut Soylu (58)\n\n' +
          '1. Dış Muayene: Dudaklarda ve tırnak diplerinde siyanotik morarma. Travma veya cebir izi yok.\n' +
          '2. Toksikolojik Tarama: Kanda ölümcül dozda potasyum siyanid bileşiği tespit edildi.\n' +
          '3. Kadeh İncelemesi: Masada kırılan kristal viski kadehi yıkandığında sadece İskoç malt viskisi kalıntısı alındı. Zehir viskiye damlatılmamış!\n' +
          '4. MİDE İÇERİĞİ: Midede, asit dirençli Metakrilat polimeri ile kaplanmış gastro-dirençli bir kapsül kalıntısı bulundu. Bu tip kaplamalar mide asidinde değil, ince bağırsak alkali ortamında 180 dakika (3 saat) gecikmeyle açılır!\n' +
          '5. Ölüm saati 23:45 olduğuna göre, kurban zehirli kapsülü tam olarak saat 20:30 - 20:50 aralığında yutmuştur!\n' +
          '6. CEP BULGUSU: Kurbanın yelek cebinde yırtık bir müzayede kataloğu sayfası bulundu: "1889 - Yıldızlı Gece (Vincent van Gogh) - Efsanevi Başyapıt".',
        keyDeduction: 'Zehir viskide değil! Katil, kurbana saat 20:45 civarında 3 saat gecikmeli özel bir kapsül içirmiştir.',
        hasInteractiveTool: 'toxicology',
        interactiveToolTitle: 'Toksikoloji Reaktif Analizörü',
        interactiveToolSubtitle: 'Kadeh sıvısı, mide sıvısı ve polimer kapsül numunelerini test tüplerinde test edin.',
        metadata: {
          date: '15 Ekim 03:15',
          caseRef: 'ATK-2026-TOX',
          confidentiality: 'ADLİ TIP RAPORU'
        }
      },
      {
        id: 'ev-102',
        envelope: 1,
        title: 'Kurbanın Kilitli Samsung Telefonu & Çelik Kasa',
        category: 'cipher',
        roleAccess: ['cryptology', 'archive'],
        summary: 'Kurbanın çalışma odasındaki gömme çelik kasa ve kişisel telefonu 4 haneli PIN şifresiyle kilitli. Yanlış denemede veriler kendini siliyor!',
        fullReport: 
          'SİBER SUÇLAR VE KRİPTOLOJİ ŞUBE MÜDÜRLÜĞÜ\n' +
          'Donanım İnceleme Tutanağı - Referans: KRY-449\n\n' +
          'Olay yerinde ele geçirilen Turgut Soylu’ya ait kasa dijital paneli ve Samsung Knox şifreli akıllı telefon:\n' +
          '- 4 Haneli Sayısal PIN koruması devrede.\n' +
          '- Kripto Terminali üzerinden brute-force yapılamıyor; sistem donanımsal zaman kilidine sahip.\n' +
          '- Maktulün şifre oluşturma algoritması hakkında profilleme notlarına ve olay yeri bulgularına başvurulmalıdır.\n' +
          '- Kasa içinde bir ses kayıt cihazı ve bir gizli vasiyetname dosyası bulunduğu manyetik taramayla belirlendi.',
        keyDeduction: 'Kasanın ve telefonun 4 haneli PIN kodu kurbanın hayatındaki bir kilit yıla dayanıyor.',
        hasInteractiveTool: 'terminal',
        interactiveToolTitle: 'Kripto Şifre Kırıcı Terminali',
        interactiveToolSubtitle: '4 Haneli PIN kodunu girerek kasanın ses kaydını deşifre edin.',
        metadata: {
          date: '15 Ekim 02:40',
          caseRef: 'KRY-2026-PIN',
          confidentiality: 'TEKNİK DEŞİFRE'
        }
      },
      {
        id: 'ev-103',
        envelope: 1,
        title: 'Şüpheli İlk İfadeleri ve Sorgu Tutanakları',
        category: 'interrogation',
        roleAccess: ['profiler', 'ballistics'],
        summary: 'Eş Selin Soylu, Ortak Cemil Vural ve Özel Doktor Kerem Akman ile yapılan ilk resmi sorgu zabıtları.',
        fullReport: 
          'ASAYİŞ ŞUBE CİNAYET BÜRO - İLK MÜLAKAT TUTANAĞI\n' +
          'Sorgu Amiri: Başkomiser Tahsin\n\n' +
          '1. SELİN SOYLU (EŞ):\n' +
          '"Turgut inanılmaz derecede şüpheci bir adamdı. Telefonunun ve çalışma odasındaki kasanın şifresini kimseye söylemezdi. Ama bana bir keresinde gülerek dedi ki: \'Ben şifremi asla unutmam, çünkü benim için dünyada gerçek sanatın ve ruhun başladığı o büyülü yıldır şifrem\'. Koleksiyonundaki tabloları canından çok severdi. En büyük hayranlığı Vincent van Gogh’un başyapıtınaydı."\n\n' +
          '2. CEMİL VURAL (ORTAK):\n' +
          '"Gece villaya asla gitmedim. Turgut beni sahte tabloyla suçladı ama kanıtı yoktu. Gece 21:00’de Kadıköy sahilinde tek başıma yürüyordum."\n\n' +
          '3. DR. KEREM AKMAN (ÖZEL HEKİM):\n' +
          '"Turgut Bey’in kalp ritmi çok düzensizdi. Akşam tam 20:45’te villadaydım. Kendi elimle hazırladığım magnezyum-kardiyo vitamin kapsülünü suyla içirdim. 21:00’de kapıdan çıkıp kliniğime geçtim. Ayrılırken gayet neşeliydi."',
        keyDeduction: 'Selin’in ifadesi kasanın şifresini veriyor: Van Gogh’un en ünlü tablosu (Yıldızlı Gece) 1889 yılında yapılmıştır! Kasa şifresi: 1889.',
        hasInteractiveTool: 'profiler-highlighter',
        interactiveToolTitle: 'İfade Çelişki & Profil Analizörü',
        interactiveToolSubtitle: 'İfadelerdeki şüpheli cümleleri ve ipuçlarını işaretleyin.',
        metadata: {
          date: '15 Ekim 01:20',
          caseRef: 'SRG-2026-01',
          confidentiality: 'GİZLİ'
        }
      },

      // ZARF 2 EVIDENCE
      {
        id: 'ev-201',
        envelope: 2,
        title: 'Kapsül Spektrometresi: LOT-884-K Seri Baskısı',
        category: 'toxicology',
        roleAccess: ['forensics', 'archive'],
        summary: 'Midedeki kapsül kabuğunun nano-baskı taramasında özel bir parti numarası bulundu: LOT-884-K. Bu kapsüller piyasada satılmıyor!',
        fullReport: 
          'KRİMİNAL LABORATUVAR - ELEKTRON MİKROSKOBU VE KİMYA RAPORU\n\n' +
          'Maktulün midesinden çıkarılan gecikmeli salınımlı kapsül kabuğunun yüzeyi elektron mikroskobu ile tarandı:\n' +
          '1. Kaplama Malzemesi: Polimetakrilat bazlı mide asidine dirençli (enterik) kaplama.\n' +
          '2. Mikro-Gravür Kodu: Kapsül gövdesinde lazerle işlenmiş mikro kod okundu: "LOT-884-K".\n' +
          '3. Özellik: Bu enterik kapsül kabukları yalnızca kardiyoloji ve onkoloji araştırma laboratuvarları tarafından özel izinle temin edilebilir. Reçetesiz ya da eczane satışı yoktur.\n' +
          '4. Zehrin Zerk Edilme Yöntemi: Kapsülün orijinal içeriği mikron cerrahi iğnesiyle boşaltılmış, yerine potasyum siyanür tozu doldurulup üzeri tekrar parafinle mühürlenmiştir.',
        keyDeduction: 'Katil tıp veya farmakoloji eğitimi almış biri. LOT-884-K serili kapsüle ancak özel bir tıp merkezi erişebilir.',
        metadata: {
          date: '15 Ekim 05:45',
          caseRef: 'KRM-2026-LOT',
          confidentiality: 'ADLİ TIP RAPORU'
        }
      },
      {
        id: 'ev-202',
        envelope: 2,
        title: 'Kasadan Çıkan Gizli Ses Kaydı (Turgut-Kayit-01.wav)',
        category: 'audio',
        roleAccess: ['cryptology', 'profiler'],
        summary: '1889 şifresi girilerek açılan kasadaki dijital diktafondan maktulün cinayetten bir gece önceki kaydı çıktı.',
        fullReport: 
          'DİJİTAL FORENSİK SES ANALİZİ\n' +
          'Ses Kaydı Dosyası: Turgut-Kayit-01.wav (Süre: 42 sn)\n' +
          'Tarih Damgası: 13 Ekim Cuma, 22:15\n\n' +
          'DEŞİFRE METNİ:\n' +
          '"(Nefes nefese) ...Artık bu maskeli baloya son verme vakti geldi. Cemil’in müzayededeki sahte tablolarını belgeledim, yarın yönetim kurulunda yüzüne çarpacağım. Ama asıl ihanet Kerem’den geldi... Yıllardır oğlum gibi büyüttüğüm, kliniğine 25 milyon TL aktardığım Dr. Kerem Akman... Teftiş kurulu raporu önümde; paraları İsviçre üzerinden kumar ve borsa hesaplarına aktarmış. Dün beni tehdit etti. \'Kalp sağlığınız çok hassas Turgut Bey, bir yanlış teşhis hayatınıza mal olabilir\' dedi... Yarın sabah ilk işim savcı Bey’e gitmek olacak."',
        keyDeduction: 'Dr. Kerem Akman’ın 25 Milyon TL zimmet suçu kurban tarafından tespit edilmişti ve ertesi gün savcılığa verilecekti!',
        metadata: {
          date: '15 Ekim 06:10',
          caseRef: 'SES-2026-01',
          confidentiality: 'TEKNİK DEŞİFRE'
        }
      },
      {
        id: 'ev-203',
        envelope: 2,
        title: 'Cemil Vural’ın İkinci Sorgusu ve Ayakkabı İncelemesi',
        category: 'interrogation',
        roleAccess: ['profiler', 'field'],
        summary: 'Cemil Vural köşeye sıkışınca gece villaya gittiğini itiraf etti ancak çıktığı anda villanın önünde Dr. Kerem’in siyah sedanını gördüğünü söyledi!',
        fullReport: 
          'EMNİYET MÜDÜRLÜĞÜ 2. SORGU PROTOKOLÜ\n' +
          'Şüpheli: Cemil Vural (Ortak)\n\n' +
          '"Tamam, yalan söylediğimi kabul ediyorum! Gece 22:30’da villaya gittim. Turgut çalışma odasındaydı. Sahte tablolar yüzünden birbirimize girdik. Bana \'Yarın hem sen hem de o sahtekar Kerem hapsi boylayacaksınız\' diye bağırdı.\n' +
          'Ona dokunmadım bile! Masadaki viskisinden bir yudum aldı ve bana \'Defol evimden\' dedi. 22:50’de kapıdan fırladım.\n' +
          'Yalı bahçesinden çıkarken sokağın köşesinde Dr. Kerem’in 34 KA 881 plakalı siyah sedan arabasını farları sönük vaziyette beklerken gördüm! Yemin ederim Turgut ben çıkarken sapasağlamdı!"',
        keyDeduction: 'Dr. Kerem 21:00’de Kadıköy’e gittiğini iddia etmişti ama 22:50’de yalının kapısında aracıyla pusuya yatmıştı!',
        metadata: {
          date: '15 Ekim 06:40',
          caseRef: 'SRG-2026-02',
          confidentiality: 'GİZLİ'
        }
      },

      // ZARF 3 EVIDENCE
      {
        id: 'ev-301',
        envelope: 3,
        title: 'Farmakoloji Enstitüsü Teslim Tutanağı: LOT-884-K',
        category: 'document',
        roleAccess: ['forensics', 'cryptology'],
        summary: 'Sağlık Bakanlığı İlaç Takip Sistemi sorgusu: LOT-884-K enterik kapsül stoğu doğrudan Dr. Kerem Akman adına faturalandırılmış!',
        fullReport: 
          'T.C. SAĞLIK BAKANLIĞI İLAÇ TAKİP SİSTEMİ (İTS) RESMİ YAZISI\n' +
          'Evrak No: 2026-TR-884\n\n' +
          'Adli Tıp Kurumu’nun talebi üzerine "LOT-884-K" seri numaralı Polimetakrilat enterik kapsül bazının sevkiyat kayıtları incelenmiştir:\n' +
          '- Üretici: Sanovel Araştırma Laboratuvarı\n' +
          '- Teslim Alan Kurum: Özel Akman Kardiyoloji Enstitüsü\n' +
          '- Teslim Alan Yetkili: Bizzat Dr. Kerem Akman (Islak imzalı teslimat tutanağı ekte mevcuttur)\n' +
          '- Teslim Tarihi: 24 Eylül 2026\n' +
          '- Miktar: 50 adet boş enterik kapsül kiti.\n' +
          '- Laboratuvar Sayımı: Enstitü ecza dolabında yapılan kontrolde 49 adet kapsül bulunmuş, 1 ADET KAPSÜLÜN EKSİK olduğu tespit edilmiştir!',
        keyDeduction: 'Cinayette kullanılan siyanürlü kapsülün boş kiti Dr. Kerem Akman’ın kendi kliniğindeki kasadan alınmıştır!',
        metadata: {
          date: '15 Ekim 08:20',
          caseRef: 'SB-2026-ITS',
          confidentiality: 'ÇOK GİZLİ'
        }
      },
      {
        id: 'ev-302',
        envelope: 3,
        title: 'Dr. Kerem Akman’ın Araç GPS & Şehir PTS Kamera Kayıtları',
        category: 'gps',
        roleAccess: ['field', 'cryptology'],
        summary: 'Dr. Kerem’in 34 KA 881 plakalı aracının GPS izi Kadıköy alibisini tamamen çökertti. Saat 23:35’te yalı sokağındaydı!',
        fullReport: 
          'İSTANBUL EMNİYET MÜDÜRLÜĞÜ TRAFİK KONTROL VE PTS KAYITLARI\n' +
          'Araç: 34 KA 881 (Siyah BMW 520d - Dr. Kerem Akman adına kayıtlı)\n\n' +
          'ZAMAN ÇİZELGESİ VE TELEMETRİ:\n' +
          '1. 20:25: Araç Kandilli Yalı Caddesi’ne giriş yaptı.\n' +
          '2. 20:45: Kurbana kapsülün içirildiği an.\n' +
          '3. 21:05: Araç Kandilli’den çıkış yaptı.\n' +
          '4. 21:40 - 22:15: Kadıköy Bağdat Caddesi’nde kısa süre duraklama.\n' +
          '5. 22:40: Araç TEKRAR Kandilli Yalı Caddesi yönüne döndü!\n' +
          '6. 22:48: Yalı sokağının 100 metre ilerisindeki korulukta park halinde beklemeye başladı (Cemil Vural’ın gördüğü an!).\n' +
          '7. 23:45: Kurbanın midesindeki 180 dakikalık kapsülün açıldığı ve ölümün gerçekleştiği saat.\n' +
          '8. 23:52: Villadan ambulans ve polis sirenleri duyulunca araç hızla olay yerinden uzaklaştı.',
        keyDeduction: 'Dr. Kerem cinayeti uzaktan zaman ayarlı kapsülle işlemiş ve kurbanın tam 3 saat sonra ölümünü gözlemlemek için sokağa geri dönmüştür!',
        metadata: {
          date: '15 Ekim 08:50',
          caseRef: 'PTS-2026-GPS',
          confidentiality: 'ÇOK GİZLİ'
        }
      },
      {
        id: 'ev-303',
        envelope: 3,
        title: 'Mali Suçlar MASAK Raporu: 25 Milyon TL Zimmet',
        category: 'banking',
        roleAccess: ['archive', 'profiler'],
        summary: 'MASAK incelemesi: Dr. Kerem Akman’ın kliniğe bağışlanan fonları kripto para cüzdanlarına aktardığı ve batık borçları olduğu belgelendi.',
        fullReport: 
          'MALİ SUÇLARI ARAŞTIRMA KURULU (MASAK) GİZLİ RAPORU\n' +
          'Konu: Kerem Akman ve Akman Kardiyoloji Vakfı Hesap Hareketleri\n\n' +
          '1. Maktul Turgut Soylu’nun vakfa aktardığı 25.000.000 TL nakit bağışın, Dr. Kerem Akman tarafından off-shore hesaplara ve kaldıraçlı kripto borsalarına yönlendirildiği tespit edilmiştir.\n' +
          '2. Tüm fonlar kaybedilmiş, kliniğe haciz tebligatları gelmeye başlamıştır.\n' +
          '3. Maktul Turgut Soylu, ölümünden 2 gün önce bağımsız bir denetim şirketi tutarak açığı ortaya çıkarmış ve pazartesi sabahı (cinayetten 36 saat sonra) Cumhuriyet Başsavcılığı’na suç duyurusunda bulunacağını Kerem’e bildirmiştir.\n' +
          '4. Dr. Kerem Akman için bu suç duyurusu ömür boyu meslekten men ve 15 yıl hapis cezası anlamına geliyordu.',
        keyDeduction: 'Cinayetin asıl ve inkar edilemez sebebi: 25 Milyon TL zimmetin ifşa edilmesini ve hapse girmeyi önlemek.',
        metadata: {
          date: '15 Ekim 09:10',
          caseRef: 'MSK-2026-99',
          confidentiality: 'GİZLİ'
        }
      }
    ],
    gates: {
      1: {
        envelope: 1,
        title: 'Zarf 1 Doğrulama Sorusu: Cinayet Metodu ve Kasa Şifresi',
        instructions: 'Adli Tıp, Kriptoloji ve Profilleme uzmanları buldukları ipuçlarını masada birleştirmelidir. Doğru yanıt verilmeden Zarf 2 açılamaz!',
        question: 'Kurban Turgut Soylu’ya zehir hangi yolla verilmiştir ve çalışma odasındaki kasanın 4 haneli PIN şifresi nedir?',
        options: [
          {
            id: 'opt-1',
            text: 'Masadaki viski kadehine damlatılan sıvı siyanür ile; Kasa şifresi: 1988 (Evlilik yılı)',
            isCorrect: false,
          },
          {
            id: 'opt-2',
            text: 'Saat 20:45’te içirilen 3 saat gecikmeli enterik mide kapsülü ile; Kasa şifresi: 1889 (Yıldızlı Gece tablosu)',
            isCorrect: true,
          },
          {
            id: 'opt-3',
            text: 'Cemil’in 22:30’da getirdiği puroya emdirilen gaz ile; Kasa şifresi: 2026',
            isCorrect: false,
          },
          {
            id: 'opt-4',
            text: 'Selin’in galeriden getirdiği antika su bardağı ile; Kasa şifresi: 1881',
            isCorrect: false,
          }
        ],
        explanation: 'Harika dedektiflik! Adli Tıp viskide değil 3 saat gecikmeli midedeki polimer kapsülde zehir buldu. Profilleme uzmanı kurbanın en sevdiği van Gogh tablosunu şifre yaptığını, Adli Tıp ise kurbanın cebinde "1889 - Yıldızlı Gece" kataloğu olduğunu tespit etti. 1889 PIN kodu kasayı ve Zarf 2’yi açtı!',
        hintByRole: {
          forensics: 'Cebindeki katalog sayfasına ve midedeki kapsülün 180 dakikalık polimer kaplamasına dikkat edin.',
          profiler: 'Selin maktulün en sevdiği tablonun yapılış yılını şifre yaptığını söylemişti.',
          cryptology: 'Terminal 4 haneli bir yıl kodu bekliyor; van Gogh’un başyapıtı 1889’dur.'
        }
      },
      2: {
        envelope: 2,
        title: 'Zarf 2 Doğrulama Sorusu: Şüpheli Alibisi ve Tıbbi Formül',
        instructions: 'Elektron mikroskobu ve ses kaydı bulgularını değerlendirin. Şüphelilerin ifadelerindeki ölümcül çelişkiyi teşhis edin.',
        question: 'Zarf 2 kanıtlarına göre, ifadesinde "Gece boyu Kadıköy’deydim" diyen ve kapsül formülüyle doğrudan bağı olan şüpheli kimdir?',
        options: [
          {
            id: 'opt-21',
            text: 'Cemil Vural - Çünkü ayakkabısında çamur izi vardı ve sahte tablo borcu vardı.',
            isCorrect: false,
          },
          {
            id: 'opt-22',
            text: 'Dr. Kerem Akman - Çünkü kapsüldeki LOT-884-K kardiyoloji kliniklerine özeldir ve Cemil onu yalı önünde aracıyla görmüştür.',
            isCorrect: true,
          },
          {
            id: 'opt-23',
            text: 'Selin Soylu - Çünkü galerideki kasasında benzer polimer kapsüller bulunmuştur.',
            isCorrect: false,
          }
        ],
        explanation: 'Kesinlikle doğru! Zarf 2’deki LOT-884-K seri numarası özel klinik bağlantısını, Cemil’in itirafı ise Dr. Kerem’in siyah sedan arabasıyla yalı önünde beklediğini ortaya koydu. Zarf 3 açıldı!',
        hintByRole: {
          forensics: 'LOT-884-K kapsülü piyasada satılmıyor, yalnızca kardiyoloji/onkoloji klinikleri alabilir.',
          profiler: 'Cemil, Dr. Kerem’i yalı kapısında farları sönük beklerken gördüğünü itiraf etti.',
          cryptology: 'Kasadan çıkan ses kaydında Turgut, Kerem’in zimmet suçu ve tehdidinden bahsediyordu.'
        }
      },
      3: {
        envelope: 3,
        title: 'Zarf 3: Dosya Kapanışına Geçiş',
        instructions: 'Tüm deliller toplandı. Şimdi her oyuncu kendi ekranından gizlice Katil Adayını, Cinayet Sebebini ve Kilit Kanıtı seçecektir!',
        question: 'Masanızdaki dedektifler son karar ve oylama aşamasına hazır mı?',
        options: [
          {
            id: 'opt-ready',
            text: 'Evet, tüm uzmanlıklar delilleri birleştirdi. Bireysel suçlama oturumunu başlat!',
            isCorrect: true,
          }
        ],
        explanation: 'Nihai suçlama ve mahkeme aşamasına geçiliyor. Her dedektif kendi telefonundan kararını kilitlemelidir!',
        hintByRole: {
          forensics: 'LOT-884-K teslim fişi ve kapsül kiti sayımındaki eksik parça katili işaret ediyor.',
          cryptology: 'PTS ve GPS kayıtları saat 23:45’te villanın hemen yanındaki bekleyişi kanıtlıyor.',
          profiler: 'MASAK’ın 25 milyonluk zimmet raporu şüphe götürmez ana motiftir.'
        }
      }
    },
    solution: {
      culpritId: 'dr-kerem',
      culpritName: 'Dr. Kerem Akman',
      motiveTitle: '25 Milyon TL Zimmet Suçunun İfşa Edilmesini Engellemek',
      keyEvidenceTitle: 'LOT-884-K Enterik Mide Kapsülü ve Araç GPS / PTS Kayıtları',
      verdictSummary: 
        'Katil, kurbanın en güvendiği kişi olan özel hekimi Dr. Kerem Akman’dır! Dr. Kerem, klinikten zimmetine geçirdiği 25 Milyon TL’nin savcılığa gideceğini öğrenince kusursuz bir cinayet planladı. Saat 20:45’te kurbana rutin vitamin adı altında 180 dakika gecikmeli Polimetakrilat kapsül (LOT-884-K) içirdi. Siyanürün viski kadehine değil, 3 saat sonra kurbanın midesinde erimesini sağladı. Böylece ölüm anında (23:45) kendisinin çok uzakta olacağını düşünüyordu. Ancak hem kurbana bıraktığı van Gogh katalog şifresi, hem Cemil’in onu kapıda görmesi, hem de GPS telemetrisi cinayeti çözdü.',
      fullChronology: [
        {
          time: '24 Eylül',
          action: 'Dr. Kerem, kliniği adına Sanovel firmasından 50 adet LOT-884-K boş gecikmeli kapsül kiti teslim aldı.',
          proof: 'Sağlık Bakanlığı İTS Teslim Tutanağı'
        },
        {
          time: '13 Ekim 22:15',
          action: 'Turgut Soylu 25 milyonluk zimmeti ve tehditleri kasasındaki ses kayıt cihazına kaydetti.',
          proof: '1889 Şifresiyle Açılan Ses Kaydı (Turgut-Kayit-01.wav)'
        },
        {
          time: '14 Ekim 20:45',
          action: 'Dr. Kerem villaya gelerek kurbana su ile siyanür doldurulmuş gecikmeli kapsülü içirdi.',
          proof: 'İlk Sorgu Tutanağı & Otopsi Toksikoloji Raporu'
        },
        {
          time: '14 Ekim 22:48',
          action: 'Cemil yalıdan çıkarken Dr. Kerem aracıyla pusuda kurbanın ölüm saatini uzaktan takip etti.',
          proof: 'Araç İçi GPS ve Şehir PTS Kamera Kayıtları'
        },
        {
          time: '14 Ekim 23:45',
          action: 'Enterik kapsül midede açılarak kurbanı saniyeler içinde zehirledi; kadeh masaya düşüp kırıldı.',
          proof: 'Adli Tıp Otopsi İhtisas Raporu'
        }
      ],
      confessionAudioTranscript: 
        '"(Sorgu Odası Kaydı - 15 Ekim 11:20)\n' +
        'Başkomiser: Kerem Bey, LOT-884-K kapsülleri ve GPS telemetriniz masada. Ne diyeceksiniz?\n' +
        'Dr. Kerem: (Derin bir iç çeker, gözlüklerini çıkarır) ...Her şeyi hesaplamıştım. Asit dirençli polimer 180 dakikadan önce asla açılmazdı. Turgut öldüğünde ben Kadıköy’de hastalarımla olacaktım... Ama o lanet Cemil... Ve o Van Gogh şifresi... Turgut beni hapse attıracaktı, anlıyor musunuz?! Bütün kariyerim, hayatım bitecekti! Masadaki viskiyi döktüm ki herkes kadehten zehirlendi sansın... Kaybettim."'
    }
  },
  {
    id: 'kayip-mirasci',
    title: 'Kayıp Mirasçı Vakası: Boğaz Yalısı',
    subtitle: 'Kısa Süreli Dedektiflik (2–4 Kişi İçin Uygun)',
    difficulty: 'Kolay',
    estimatedMinutes: 15,
    minPlayers: 2,
    maxPlayers: 4,
    bannerTag: 'HIZLI VAKA (MİN 2 KİŞİ)',
    synopsis: 'Boğaziçi’ndeki tarihi yalıda miras paylaşımı öncesi kaybolan orijinal vasiyetname ve şüpheli kasa hırsızlığı vakası. Adli tıp ve kriptoloji uzmanlarının 2 kişiyle de çözebileceği hızlı dedektiflik vakası.',
    victim: {
      name: 'Ragıp Paşazade',
      age: 72,
      title: 'Emekli Diplomat',
      timeOfDeath: 'Hırsızlık & Sahtecilik Vakası (Hayati tehlike yok)',
      locationOfBody: 'Yeniköy Yalısı Çalışma Odası',
      causeInitial: 'Kasa zorlama ve sahte evrak değişimi',
    },
    suspects: [
      {
        id: 'murat-pasa',
        name: 'Murat Paşazade',
        title: 'Büyük Oğul',
        age: 46,
        relation: 'Oğlu',
        description: 'Borsada yüksek borçları olan ve vasiyetnameyi değiştirmekle itham edilen büyük mirasçı.',
        alibi: 'Olay gecesi kulüpteydi.',
        suspiciousQuotes: ['"Babam zaten her şeyi bana bırakacaktı."'],
        motiveHypothesis: 'Miras payını büyütmek.',
        initialSuspicion: 70,
        photoPlaceholder: {
          initials: 'MP',
          tint: 'from-amber-950 to-stone-900',
          silhouetteStyle: 'bg-amber-900/30 border-amber-600/40 text-amber-300'
        }
      },
      {
        id: 'avukat-can',
        name: 'Avukat Can Sezgin',
        title: 'Aile Avukatı',
        age: 52,
        relation: 'Hukuk Müşaviri',
        description: 'Vasiyetnamenin orijinal nüshasını saklamakla yükümlü noter tasdikli avukat.',
        alibi: 'Ofisindeydi.',
        suspiciousQuotes: ['"Mühürler kırılmamıştı, anahtar bendeydi."'],
        motiveHypothesis: 'Yurt dışı transfer komisyonu.',
        initialSuspicion: 55,
        isCulprit: true,
        photoPlaceholder: {
          initials: 'CS',
          tint: 'from-slate-950 to-zinc-900',
          silhouetteStyle: 'bg-slate-900/30 border-slate-600/40 text-slate-300'
        }
      }
    ],
    evidence: [
      {
        id: 'ev-miras-1',
        envelope: 1,
        title: 'Kasa İncelemesi: Morötesi Mürekkep İzi',
        category: 'document',
        roleAccess: ['forensics', 'cryptology'],
        summary: 'Kasanın kolunda UV ışık altında özel noter mühür mürekkebi izi bulundu.',
        fullReport: 'Kasa açılırken kullanılan kopyalanmış anahtar üzerinde sadece noterliklerde kullanılan florasan parmak izi saptandı.',
        keyDeduction: 'Hırsızlığı noter mühür mürekkebine erişimi olan Avukat Can Sezgin yapmıştır.',
        metadata: {
          date: '10 Ekim 14:00',
          caseRef: 'MIR-01',
          confidentiality: 'GİZLİ'
        }
      }
    ],
    gates: {
      1: {
        envelope: 1,
        title: 'Vasiyetname Doğrulama',
        instructions: 'Anahtar üzerindeki UV mürekkebin kaynağını belirleyin.',
        question: 'Kasadaki UV mürekkep kime işaret etmektedir?',
        options: [
          { id: 'o1', text: 'Avukat Can Sezgin (Noterlik mürekkebi)', isCorrect: true },
          { id: 'o2', text: 'Murat Paşazade (Kulüp pulu)', isCorrect: false },
        ],
        explanation: 'Doğru! UV mürekkep doğrudan noter evrak mühürlerinden bulaşmıştır.',
        hintByRole: {
          forensics: 'UV spektroskopisi noter mühür maddesini teyit etti.'
        }
      },
      2: {
        envelope: 2,
        title: '2. Aşama',
        instructions: 'Sonuç değerlendirmesi',
        question: 'Vasiyetnameyi kim kaçırmıştır?',
        options: [
          { id: 'o21', text: 'Avukat Can Sezgin', isCorrect: true }
        ],
        explanation: 'Tamamlandı.',
        hintByRole: {}
      },
      3: {
        envelope: 3,
        title: 'Karar',
        instructions: 'Karar aşaması',
        question: 'Suçlamaya hazır mısınız?',
        options: [
          { id: 'o31', text: 'Hazırız', isCorrect: true }
        ],
        explanation: 'Hazır.',
        hintByRole: {}
      }
    },
    solution: {
      culpritId: 'avukat-can',
      culpritName: 'Avukat Can Sezgin',
      motiveTitle: 'Yurt Dışı Fon Komisyonu ve Sahte Vasiyetname',
      keyEvidenceTitle: 'Noter UV Mühür Mürekkebi İzi',
      verdictSummary: 'Avukat Can Sezgin, orijinal vasiyetnameyi değiştirerek mirasın %30’unu kendine komisyon olarak bağlatmak istemiştir.',
      fullChronology: [
        { time: '14:00', action: 'Kasa açıldı.', proof: 'UV İzleri' }
      ],
      confessionAudioTranscript: 'İtiraf ediyorum, borçlarım vardı.'
    }
  }
];
