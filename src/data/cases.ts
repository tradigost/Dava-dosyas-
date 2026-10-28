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
  // =========================================================================
  // VAKA 1: BOĞAZ'DA KAYIP KOLEKSİYON
  // =========================================================================
  {
    id: 'bogazda-kayip-koleksiyon',
    title: 'Boğaz’da Kayıp Koleksiyon',
    subtitle: 'Kandilli Yalısı Müzayedesi Ardından Şüpheli Zehirlenme ve Hırsızlık',
    difficulty: 'Zor',
    estimatedMinutes: 35,
    minPlayers: 1,
    maxPlayers: 6,
    totalEnvelopes: 3,
    bannerTag: 'KATMANLI NOIR POLİSİYE · SES & GÖRSEL KANITLI',
    synopsis: 
      'Türkiye’nin en köklü antikacısı Hikmet Ulusoy (62), Kandilli’deki tarihi yalısının çalışma odasında, elinde yarım kalmış fincanıyla cansız bulundu. Yalının çelik kasasındaki paha biçilmez 18. yüzyıl zümrüt hançeri kayıp! Şüphelilerin her biri kendi gizli borçları, aşk mektupları ve husumetleri yüzünden panik içinde yalan söylüyor. Ancak adli tıp ve ses kayıtları gerçeği fısıldıyor.',
    victim: {
      name: 'Hikmet Ulusoy',
      age: 62,
      title: 'Antika Koleksiyoneri & Ulusoy Müzayede Kurucusu',
      timeOfDeath: '18 Ekim Cumartesi, 23:40 suları',
      locationOfBody: 'Kandilli Yalısı, 2. Kat Çalışma Odası & Kütüphane',
      causeInitial: 'Akut kardiyak blokaj ve digitalis (yüksükotu) zehirlenmesi',
    },
    suspects: [
      {
        id: 'banu-ulusoy',
        name: 'Banu Ulusoy',
        title: 'Maktulün İkinci Eşi (Sanat Galerisi Küratörü)',
        age: 34,
        relation: 'Eşi (5 yıllık evli, boşanma protokolü imzalamak üzere)',
        description: 'Zarif, mesafeli ve hırslı. Hikmet Bey’in tüm mirasını ilk evliliğinden olan oğluna devredeceğini öğrenmişti. Olay gecesi arka kapıdan panikle çıkarken elinde siyah bir deri çantayla görüldü.',
        alibi: 'Olay gecesi 22:30 ile 00:30 arası Bebek’teki galerisinde sergi kataloğu hazırladığını iddia ediyor.',
        suspiciousQuotes: [
          '"Hikmet bana güvenmezdi ama evlilik sözleşmesini iptal etmeyi kabul etmişti."',
          '"Çantamda ne mi vardı? Hikmet’in mücevherleri değil! Yıllar önce yaptığım ve evliliğimi bitirebilecek özel mektuplarım vardı."',
          '"Kasayı açacak şifreyi bana asla söylemezdi. Şifreyi yalnızca Yadigar Usta bilirdi."'
        ],
        motiveHypothesis: '40 Milyon TL değerindeki boşanma tazminatını garantiye almak ve kasadaki gizli belgeleri yok etmek.',
        initialSuspicion: 70,
        photoPlaceholder: {
          initials: 'BU',
          tint: 'from-amber-950 to-stone-900',
          silhouetteStyle: 'bg-amber-900/30 border-amber-600/40 text-amber-300'
        }
      },
      {
        id: 'tarik-ulusoy',
        name: 'Tarık Ulusoy',
        title: 'Maktulün Oğlu (İflas Eşindeki Girişimci)',
        age: 36,
        relation: 'Öz Oğlu (Babasıyla 2 yıldır görüşmüyordu)',
        description: 'Borsada ve gayrimenkul yatırımlarında tefecilere 15 Milyon TL borçlanmış durumda. Babasının kasasındaki zümrüt hançeri satıp borcunu kapatmak için olay gecesi yalıya gizlice geldiği güvenlik kamerasına takıldı.',
        alibi: 'Yalıya sadece babasıyla konuşmaya geldiğini, babasını yerde hareketsiz görünce korkup kaçtığını iddia ediyor.',
        suspiciousQuotes: [
          '"Babam beni hep başarısız bir çocuk olarak gördü. Yalının kapısına kadar gittim, tartıştık ama ben çıktığımda nefes alıyordu!"',
          '"Ceketimdeki kahve lekesi mi? Babam sinirlenip fincanı fırlattı, üzerime sıçradı!"',
          '"Yadigar Usta’ya sorun, babamın ilaçlarını her akşam o hazırlardı!"'
        ],
        motiveHypothesis: 'Tefeci borçlarını ödemek için zümrüt hançeri çalmak ve babasından kalacak tek varis olmak.',
        initialSuspicion: 80,
        photoPlaceholder: {
          initials: 'TU',
          tint: 'from-blue-950 to-slate-900',
          silhouetteStyle: 'bg-blue-900/30 border-blue-600/40 text-blue-300'
        }
      },
      {
        id: 'yadigar-celik',
        name: 'Yadigar Çelik',
        title: '30 Yıllık Restoratör & Yalı Kâhyası',
        age: 57,
        relation: 'Sadık Çalışan & Antika Restorasyon Uzmanı',
        description: 'Yalıda Hikmet Bey ile birlikte büyümüş, antika restorasyonu konusunda usta bir isim. Dışarıdan kusursuz bir sadakat sergilese de, son 5 yıldır müzedeki orijinal antika eserleri gizlice satıp yerlerine kopyalarını koyduğu tespit edildi.',
        alibi: 'Olay gecesi 23:00’te Hikmet Bey’in tansiyon çayını masasına bıraktıktan sonra müştemilata çekilip uyuduğunu belirtti.',
        suspiciousQuotes: [
          '"Hikmet Bey bana babamdan daha yakındı. 30 yılımı bu yalıya verdim."',
          '"Kasadaki hançer mi? O hançer son müzayedenin gözbebeğiydi ama Hikmet Bey son günlerde eserin sahte olduğundan şüpheleniyordu."',
          '"Ben kimseye zarar veremem, ellerim sadece sanatı onarmayı bilir."'
        ],
        motiveHypothesis: 'Sahte eser yolsuzluğunun anlaşılmasını ve hapse girmeyi önlemek, çalıntı zümrüt hançeri kaçırmak.',
        initialSuspicion: 45,
        photoPlaceholder: {
          initials: 'YÇ',
          tint: 'from-emerald-950 to-teal-900',
          silhouetteStyle: 'bg-emerald-900/30 border-emerald-600/40 text-emerald-300'
        }
      }
    ],
    evidence: [
      // ZARF 1
      {
        id: 'ev-1-1',
        envelope: 1,
        title: 'Olay Yeri İnceleme Tutanağı & Kırık Fincan',
        category: 'autopsy',
        roleAccess: ['forensics', 'ballistics', 'profiler', 'field'],
        summary: 'Maktul çalışma masasında yığılmış; elindeki porselen fincan kırılmış, dökülen sıvı kahverengi bitki çayı kalıntısı içeriyor.',
        fullReport: 'TC Emniyet Kriminal Şube Olay Yeri Zabtı:\nMaktul Hikmet Ulusoy, Kandilli Yalısı çalışma odasında 23:40 sularında ölü bulunmuştur. Masada antika porselen fincan kırılmış vaziyettedir. Maktulün dudaklarında morarma ve tırnak diplerinde siyanoz gözlemlenmiştir. Zorlama veya boğuşma izi yoktur. Çalışma odasındaki gizli gömme kasanın kapağı açık ve içerisindeki zümrüt işlemeli Osmanlı hançeri kutusu boştur.',
        keyDeduction: 'Olay yeri bir zorlama veya fiziki darp içermiyor; zehir doğrudan içeceğe katılmış.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Olay Yeri Fotoğrafı #1: Çalışma masası üzerindeki kırık fincan ve açık kasa',
        metadata: {
          date: '18 Ekim 2026',
          caseRef: 'KND-01',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-1-2',
        envelope: 1,
        title: '112 İhbarı ve Telsiz Ses Kaydı',
        category: 'audio',
        roleAccess: ['cryptology', 'profiler', 'forensics', 'archive'],
        summary: 'Yalı kâhyası Yadigar Çelik tarafından 23:52’de yapılan panik dolu acil çağrı ve devriye anonsu.',
        fullReport: '112 Acil Çağrı Kaydı Çözüm Tutanağı (Ses Dosyası #A-01):\nSaat 23:52:14\nOperatör: 112 Acil, buyrun?\nYadigar: (Nefes nefese, panik sesi) Ambulans gönderin hemen! Kandilli, Ulusoy Yalısı... Beyefendi nefes almıyor, masasında yığıldı kaldı!\nOperatör: Sakin olun efendim, nabız kontrolü yapabiliyor musunuz?\nYadigar: (Arka planda fincan porselen kırılma sesi veya cam sürtünmesi duyuluyor) Nabız yok... Eller buz gibi... Aman Allahım kasayı da açmışlar!\nOperatör: Ekipler yönlendirildi, lütfen olay yerine dokunmayın.',
        keyDeduction: 'Yadigar 112’yi ararken arka planda kasa çekmecesi veya cam sesi duyulmaktadır; olay anında odadadır.',
        mediaType: 'audio',
        mediaUrl: '',
        mediaCaption: '112 Acil Çağrı Bandı: Yadigar Çelik’in ihbar anı',
        metadata: {
          date: '18 Ekim 2026',
          caseRef: 'SES-KND-01',
          confidentiality: 'ÇOK GİZLİ',
        }
      },
      {
        id: 'ev-1-3',
        envelope: 1,
        title: 'Polis Sorgu Tutanağı: Yalı Güvenlik Amiri Bekçi Niyazi',
        category: 'interrogation',
        roleAccess: ['field', 'profiler', 'archive', 'forensics'],
        summary: 'Gece nöbetindeki güvenlik amirinin resmi ifadesi: Tarık Bey’in 22:30’da arka kapıdan girişi, Banu Hanım’ın 23:25’teki panik kaçışı.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ ASAYİŞ ŞUBE CİNAYET BÜRO\nTANIK İFADE VE SORGU TUTANAĞI\n\nİfade Veren: Niyazi Kalkan (54, Kandilli Yalısı Güvenlik Amiri)\nSorgulayan: Komiser Murat Kaya / Sicil: 41829\nTarih: 19 Ekim 2026 - Saat 01:15\n\nSORU: Olay gecesi yalıya kimler giriş çıkış yaptı? Bahçe kameralarında neden kesinti var?\nCEVAP: "Efendim, saat 22:30 civarı maktulün oğlu Tarık Bey bahçe demir kapısından hızla girdi. Çok gergindi, selam vermeden çalışma odasına yöneldi. Saat 23:15 gibi yukarıdan bağırma sesleri geldi; Hikmet Bey bağırıyordu. Saat 23:25’te ise Banu Hanım arka sahil kapısından elinde siyah büyük bir deri çantayla adeta koşarak çıktı. Yoldan geçen sarı bir taksiyi durdurup bindi. Kamera kesintisine gelince; müştemilattaki ana şalterden sahil kamerası saat 23:00’te kapatılmış. Şaltere yalnızca Yadigar Usta’nın atölye anahtarıyla girilebiliyor."',
        keyDeduction: 'Tarık saat 22:30’da yalıdadır; Banu ise saat 23:25’te siyah çantayla kaçmıştır. Sahil kamerası şalteri ise saat 23:00’te içeriden kapatılmıştır.',
        mediaType: 'text',
        metadata: {
          date: '19 Ekim 2026',
          caseRef: 'SORGU-GÜV-01',
          confidentiality: 'GİZLİ',
        }
      },
      // ZARF 2
      {
        id: 'ev-2-1',
        envelope: 2,
        title: 'Adli Tıp Toksikoloji Raporu: Digitalis Zehirlenmesi',
        category: 'toxicology',
        roleAccess: ['forensics', 'cryptology', 'profiler', 'field'],
        summary: 'Maktulün kanında ve kırık fincan kalıntısında ölümcül dozda saf yüksükotu (Digitalis purpurea) glikozidi tespit edildi.',
        fullReport: 'Adli Tıp Kurumu Toksikoloji İhtisas Dairesi Raporu:\nMaktulün mide içeriğinde ve kırık fincanda 4.8 mg/L oranında Digoksin/Digitalis tespit edilmiştir. Bu oran normal kalp hastası terapisinin 10 katı olup 20-30 dakika içinde ventriküler fibrilasyon ve kalp durmasına neden olur. Zehrin tadı aromatik melisa çayıyla ustalıkla gizlenmiştir. Yüksükotu glikozitleri yalnızca profesyonel biyokimya laboratuvarlarında veya ileri düzey botanik restorasyon atölyelerinde saflaştırılabilir.',
        keyDeduction: 'Zehir ani tesir etmemiş, 23:10-23:20 sularında içilen çaya katılmıştır.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Adli Toksikoloji Spektrometre Grafiği: Digitalis pik konsantrasyonu',
        metadata: {
          date: '19 Ekim 2026',
          caseRef: 'TOX-408',
          confidentiality: 'ADLİ TIP RAPORU',
        }
      },
      {
        id: 'ev-2-2',
        envelope: 2,
        title: 'Cinayet Büro Sorgu Tutanağı: Şüpheli Banu Ulusoy',
        category: 'interrogation',
        roleAccess: ['profiler', 'field', 'archive', 'forensics'],
        summary: 'Banu Ulusoy’un Bebek’teki galeride gözaltına alınışı, çantadaki aşk mektupları ve Hikmet’in fenalaşma anına dair ifadesi.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ CİNAYET BÜRO AMİRLİĞİ\nŞÜPHELİ SORGULAMA VE İFADE TUTANAĞI\n\nŞüpheli: Banu Ulusoy (34, Sanat Galerisi Küratörü)\nSorgulayan: Başkomiser Hakan Erdem / Avukat huzurunda\nTarih: 19 Ekim 2026 - Saat 04:30\n\nSORU: Olay gecesi yalıdan neden panik halinde kaçtınız? Çantanızda hançer mi vardı?\nCEVAP: "Yemin ederim hançere dokunmadım! Hikmet ile boşanma aşamasındaydık. Yıllar önce İzmir’deki eski ortağımla olan özel aşk mektuplarımı ele geçirmişti. Mektupları çalışma odasındaki kasada kilitli tutuyor ve beni tek kuruş tazminatsız kapıya koymakla tehdit ediyordu. Saat 23:20 sularında yukarı çıktım. Hikmet koltuğunda tuhaf nefes alıyordu, göğsünü tutuyordu. Bana \'Çay... çayda bir şey var\' diye mırıldandı. O panikle kasadaki gizli çekmeceyi açıp sadece kendi mektuplarımı aldım ve korkudan kaçtım! Kasada hançer duruyordu, ben almadım! O çayı Hikmet’e her gece Yadigar getirirdi!"\n\nAdli Psikolog Notu: Şüpheli sadakatsizlik ifşasından paniklemiş durumda. Çantada hançer bulunamadı, yalnızca mektuplar ve otel kayıtları mevcuttur. Cinayet kastı taşımıyor.',
        keyDeduction: 'Banu hançeri çalmamış, yalnızca şantaj mektuplarını kaçırmıştır. Hikmet’in son sözü çayı Yadigar’ın getirdiğini işaret etmektedir.',
        mediaType: 'text',
        metadata: {
          date: '19 Ekim 2026',
          caseRef: 'SORGU-BANU-02',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-2-3',
        envelope: 2,
        title: 'Cinayet Büro Çapraz Sorgu Tutanağı: Şüpheli Tarık Ulusoy',
        category: 'interrogation',
        roleAccess: ['profiler', 'archive', 'field', 'forensics', 'cryptology'],
        summary: 'Maktulün oğlu Tarık’ın 15 Milyon TL tefeci borcu, ceketindeki çay lekesi ve babasıyla 22:45’teki kavga itirafı.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ ASAYİŞ ŞUBE CİNAYET BÜRO\nÇAPRAZ SORGU VE İFADE TUTANAĞI\n\nŞüpheli: Tarık Ulusoy (36, Girişimci / Maktulün Oğlu)\nSorgulayan: Komiser Selim Arıkan\nTarih: 19 Ekim 2026 - Saat 06:15\n\nSORU: Üzerinizdeki gri ceketin kolundaki kahverengi leke kriminalde melisa çayı çıktı. Tefecilere 15 Milyon TL borcunuz var. Kasadaki hançeri siz mi çaldınız?\nCEVAP: "Evet, batmış durumdayım! Tefeciler kapımdaydı. Babamdan hançeri tefecilere rehin vermek için istedim. Babam suratıma tükürdü, \'Sana zırnık yok, sahtekâr Yadigar bile senden daha evlat\' dedi. Tartıştık, masadaki fincanı bana fırlattı, çay koluma döküldü. Saat 23:05’te ben odadan çıktım. O sırada merdivende Yadigar elinde taze bir demlikle yukarı çıkıyordu! \'Beyefendiye tansiyon otu yaptım Tarık Bey\' dedi. Babam ben çıktığımda dipdiriydi, bağırmaya devam ediyordu. Ben katil değilim!"\n\nKriminal Laboratuvar Notu: Tarık’ın ceketindeki çay lekesinde zehir konsantrasyonu YOKTUR. Zehir, Tarık odadan çıktıktan sonra Yadigar’ın getirdiği ikinci taze fincana katılmıştır.',
        keyDeduction: 'Tarık babasıyla kavga etmiş ancak ceketindeki çayda zehir yoktur; zehirli fincan Tarık ayrıldıktan sonra Yadigar tarafından servis edilmiştir.',
        mediaType: 'text',
        metadata: {
          date: '19 Ekim 2026',
          caseRef: 'SORGU-TARIK-02',
          confidentiality: 'GİZLİ',
        }
      },
      // ZARF 3
      {
        id: 'ev-3-1',
        envelope: 3,
        title: 'Restorasyon Atölyesi ve Gizli Sahtecilik Defteri',
        category: 'document',
        roleAccess: ['cryptology', 'archive', 'forensics', 'profiler', 'field'],
        summary: 'Yadigar Çelik’in atölyesindeki gizli dolapta, zümrüt hançerin sahte bir replikası ve digitalis saflaştırma cam tüpleri bulundu!',
        fullReport: 'Kriminalistik Arama El Koyma Tutanağı:\nYalı müştemilatındaki restorasyon laboratuvarında yapılan detaylı aramada:\n1. 18. yüzyıl zümrüt hançerin aslına uygun yapılmış reçine-zirkon replikası.\n2. Bir Alman kimya firmasından sipariş edilmiş saf digitalis tohumu faturası.\n3. Yadigar Çelik’in İsviçre UBS bankasında açılmış gizli hesabı: Hesaba son 3 yılda 2.4 Milyon Euro "Sanat Danışmanlığı" adı altında transfer edilmiştir.\n4. Hikmet Ulusoy’un ölmeden 2 saat önce yazdığı ve kasaya koyduğu not: "Yadigar, müzayedeye koyduğun hançerin sahte olduğunu anladım. Yarın sabah savcılıktasın."',
        keyDeduction: 'Atölyede bulunan replika hançer taslağı ve digitalis faturası, Hikmet Bey ile Yadigar arasındaki gerginliği teyit ediyor. Ancak Banu’nun kasadaki parmak izleri ve Tarık’ın tefeci borcu da masada duruyor.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Delil Fotoğrafı #3: Yadigar’ın gizli defteri ve reçine replika taslağı',
        metadata: {
          date: '20 Ekim 2026',
          caseRef: 'KRM-YADIGAR',
          confidentiality: 'ÇOK GİZLİ',
        }
      },
      {
        id: 'ev-3-2',
        envelope: 3,
        title: 'Cinayet Büro Çapraz Sorgu Tutanağı: Şüpheli Yadigar Çelik',
        category: 'interrogation',
        roleAccess: ['profiler', 'forensics', 'archive'],
        summary: 'Yadigar Çelik’in atölyesindeki kimyasal maddeler, İsviçre hesapları ve çalışma odasındaki fincan servis anına dair savunması.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ CİNAYET BÜRO AMİRLİĞİ\nÇAPRAZ SORGU VE SAVUNMA TUTANAĞI\n\nŞüpheli: Yadigar Çelik (57, Restorasyon Uzmanı & Yalı Kâhyası)\nSorgulayan: Başkomiser Hakan Erdem & Kriminal Heyet\nTarih: 20 Ekim 2026 - Saat 11:45\n\nSORU: İsviçre UBS hesabınızdaki 2.4 Milyon Euro ve atölyenizdeki replika reçine hançer hakkında ne diyeceksiniz? Maktulün "Yarın sabah savcılıktasın" notu atölye çöpünüzde bulundu!\nCEVAP: "Bana iftira atıyorsunuz! Ben 30 yılımı bu aileye adadım! İsviçre hesabındaki para, Hikmet Bey’in uluslararası müzayedelerde sattığımız Osmanlı mobilyaları için bana ödediği restorasyon primleridir. Atölyemdeki reçine replika ise Hikmet Bey\'in bizzat verdiği talimattır; müzayede öncesi vitrin güvenliği için sahte maket hazırlanmasını o istedi! Digitalis tohumu faturasına gelince... O bitki özü, 18. yüzyıl ceviz kütüphanelerin tahta kurtlarını yok etmek için hazırladığım eski Venedik cila karışımıdır.\nEvet, saat 23:10\'da taze tansiyon çayı demini yukarı götürdüm. Ama içeri girdiğimde Hikmet Bey masasında tek başına değildi! Tarık Bey öfkeyle kasayı yumrukluyor, babasına \'Bu hançeri bana vermezsen tefeciler beni de seni de kurşunlar\' diye bağırıyordu. Ben fincanı bırakıp hemen çıktım. Ardından saat 23:20\'de Banu Hanım\'ın yukarı koştuğunu kendi gözlerimle gördüm! Banu Hanım kasanın içine gömülmüştü, Hikmet Bey koltuğunda kıvranırken Banu elindeki siyah çantayı doldurup arka sahil kapısından fırladı!\nNeden beni suçluyorsunuz? Hikmet Bey\'in ölümüyle 15 milyon borcu olan öz oğlu kurtuldu, 40 milyonluk mirasa konacak ikinci eşi kurtuldu! Ben ise işimi ve 30 yıllık ekmek kapımı kaybettim! Asıl katili kasayı soyan aile üyelerinde arayın!"',
        keyDeduction: 'Yadigar suçlamaları şiddetle reddederek digitalis tohumlarının ahşap koruyucu olduğunu iddia etmiş; cinayeti kasanın etrafında görülen Tarık ve Banu’nun üzerine atmıştır. Olay odasındaki hareketlilik üç şüphelinin de parmak izlerini barındırmaktadır.',
        mediaType: 'text',
        metadata: {
          date: '20 Ekim 2026',
          caseRef: 'SES-SORGU-02',
          confidentiality: 'ÇOK GİZLİ',
        }
      }
    ],
    gates: {
      1: {
        envelope: 1,
        title: 'Zarf 1 Soruşturma Sorusu: Olay Yeri Dinamiği',
        instructions: 'Zarf 1’deki bulgulara dayanarak aşağıdaki soruyu yanıtlayın.',
        question: 'Olay yerinde kurbanın çalışma masasında bulunan kırık fincan ve 112 ses kaydı neyi kanıtlamaktadır?',
        options: [
          { id: 'q1-1', text: 'Zehir maktulün fincanındaki çaya katılmış ve odada fiziki boğuşma yaşanmamıştır.', isCorrect: true },
          { id: 'q1-2', text: 'Maktul dışarıdan gelen bir kurşunla vurulmuştur.', isCorrect: false },
          { id: 'q1-3', text: 'Olay yerine kapı kırılarak zorla girilmiştir.', isCorrect: false }
        ],
        explanation: 'Fincandaki zehir ve boğuşma izi olmaması, cinayetin yalı içinden biri tarafından sinsice işlendiğini gösterir.'
      },
      2: {
        envelope: 2,
        title: 'Zarf 2 Soruşturma Sorusu: Zehrin Niteliği',
        instructions: 'Toksikoloji raporuna göre kurbanı öldüren zehrin kaynağı nedir?',
        question: 'Toksikoloji raporunda tespit edilen Digitalis glikozidi kurbana ne şekilde verilmiştir?',
        options: [
          { id: 'q2-1', text: 'Yatmadan önce içtiği melisa ve tansiyon bitki çayına yüksek dozda karıştırılarak.', isCorrect: true },
          { id: 'q2-2', text: 'Hançerin keskin ucuna sürülerek yaralama yoluyla.', isCorrect: false },
          { id: 'q2-3', text: 'Havalandırma kanalından gaz halinde püskürtülerek.', isCorrect: false }
        ],
        explanation: 'Digitalis, tansiyon çayı aromasıyla gizlenerek içirilmiştir.'
      },
      3: {
        envelope: 3,
        title: 'Zarf 3 Soruşturma Sorusu: Delil İnceleme Tespiti',
        instructions: 'Restorasyon atölyesinde ele geçirilen fatura ve kimyasal bulguları değerlendirin.',
        question: 'Restorasyon atölyesinde bulunan faturaya göre Digitalis tohumları hangi amaçla temin edilmiş ve nasıl gizlenmiştir?',
        options: [
          { id: 'q3-1', text: 'Alman kimya firmasından sipariş edilip atölyedeki tansiyon bitki çayı kavanozuna saflaştırılarak gizlenmiştir.', isCorrect: true },
          { id: 'q3-2', text: 'Müzayededen satın alınan tarihi hançerin kılıfını cilalamak amacıyla kullanılmıştır.', isCorrect: false },
          { id: 'q3-3', text: 'Bahçedeki yabani otları kurutmak için sipariş edilmiştir.', isCorrect: false }
        ],
        explanation: 'Digitalis tohumları atölyede kimyasal olarak saflaştırılmış ve tansiyon çayı kavanozuna katılmıştır.'
      }
    },
    solution: {
      culpritId: 'yadigar-celik',
      culpritName: 'Yadigar Çelik',
      motiveTitle: 'Milyonluk Sahte Antika Vurgununun İfşa Olmasını Önlemek',
      keyEvidenceTitle: 'Restorasyon Atölyesindeki Digitalis Faturası & Maktulün İhbar Notu',
      fullChronology: [
        { time: '21:00', action: 'Hikmet Ulusoy, müzayedeye girecek hançerin sahte replika olduğunu test kitleriyle anlar.', proof: 'Maktulün kasaya bıraktığı not' },
        { time: '22:30', action: 'Tarık Ulusoy yalıya gelip babasıyla para tartışması yaşar, borç senedi alıp çıkar.', proof: 'Güvenlik kamerası & Tarık ifadesi' },
        { time: '23:10', action: 'Yadigar Çelik, tansiyon çayına ölümcül dozda Digitalis ekleyerek çalışma odasına servis eder.', proof: 'Adli Tıp Toksikoloji Raporu' },
        { time: '23:40', action: 'Hikmet Bey fenalaşır, fincan elinden düşüp kırılır. Yadigar odaya girip gerçek hançeri alarak kasayı açık bırakır.', proof: 'Olay yeri inceleme tutanağı' },
        { time: '23:52', action: 'Yadigar Çelik 112’yi arayarak suçu hırsızlara ve aile üyelerine yıkmaya çalışır.', proof: '112 Ses Kaydı Tutanağı' }
      ],
      verdictSummary: 'Dedektiflerin ortak titiz çalışması sonucu katilin 30 yıllık emektar Yadigar Çelik olduğu kanıtlandı. Yadigar mahkemede suçunu itiraf etti; çalıntı zümrüt hançer atölyenin zeminindeki gizli bölmede ele geçirildi.',
      confessionAudioTranscript: 'İtiraf Ses Kaydı: "30 yılımı verdim o yalıya... Hikmet her eseri milyonlara satarken bana maaşlı köle gibi davrandı. Hançeri İsviçreli alıcıya satmıştım. Anlayınca beni hapse atmakla tehdit etti. Başka çarem yoktu!"',
      confessionLetter: `[ADLİ EMANET KASASI - YADİGAR ÇELİK'İN RESMİ CİNAYET VE İTİRAF METNİ]

"Evet... Hikmet'i ben öldürdüm. Ve eğer bugün yakalanmasaydım, zerre pişmanlık duymayacaktım.

30 koca yılımı o Kandilli Yalısı'nın bodrumundaki rutubetli restorasyon atölyesinde çürüttüm. Hikmet Ulusoy benim ellerimle tamir ettiğim, eksik minelerini tamamladığım her antika vazodan, tablodan, kılıçtan milyonlarca dolar kazandı. Kendisi Boğaz'ın en lüks davetlerinde boy gösterirken, bana yıllarca asgari ücretin bir tık üzerinde bir maaşı reva gördü. Çocuklarımın okul masrafı için yalvardığımda yüzüme kapıyı kapattı.

Ben de 5 yıl önce kendi hakkımı almaya karar verdim. Zürih'teki zengin koleksiyonerlerle gizli bir hat kurdum. Müzayedeye çıkacak en nadide eserlerin kusursuz replikalarını atölyemde yaptım; orijinallerini İsviçre'ye gönderip 2.4 Milyon Euro kazandım. Son büyük vurgunum 18. yüzyıl zümrüt hançeriydi. Sentetik reçine ve zirkonla öyle bir replika hazırladım ki çıplak gözle ayırt etmek imkansızdı. Gerçek hançeri atölyemin tabanındaki gizli mermer kapağın altına gömdüm.

Ama Hikmet o lanet büyüteç mikroskobunu getirmiş. Cuma gecesi 21:00'de beni odasına çağırdı. Masada hançer duruyordu. Yüzüme tükürürcesine, 'Yadigar, 30 yıldır beslediğim yılan meğer senmişsin! Reçineyi fark ettim. Yarın sabah savcılıkta olacaksın, hayatının sonuna kadar o zindanda çürüyeceksin' dedi. 

O an beynim karardı. Zindana giremezdim. Atölyemdeki Alman digitalis tohumlarını saf alkolle damıtıp renksiz bir glikozit solüsyonu hazırladım. Her akşam ona hazırladığım melisa tansiyon çayının içine 20 damla damlattım. Fincanı masasına bıraktım. Çayı yudumladıktan 20 dakika sonra kalbi teklemeye başladı. O fenalaşırken kasayı açtım, Hikmet'in benim aleyhime yazdığı ihbar notunu aldım. Tam o esnada kapı çalınınca kasayı bilerek açık bıraktım ki mirasa aç oğlu Tarık veya kasadaki aşk mektuplarını kovalayan ikinci karısı Banu kurban seçilsin.

Hançeri atölyenin zeminine saklamıştım. Beni yakaladınız ama en azından Hikmet Ulusoy denen o kibirli bezirgânın benden çaldığı hayatın hesabını sormuş oldum."`
    }
  },

  // =========================================================================
  // VAKA 2: KULİSİN GİZEMLİ PERDESİ
  // =========================================================================
  {
    id: 'kulisin-gizemli-perdesi',
    title: 'Kulisin Gizemli Perdesi',
    subtitle: 'Prömiyer Gecesinde Başrol Oyuncusuna Şantaj ve Gizemli Sabotaj',
    difficulty: 'Orta',
    estimatedMinutes: 30,
    minPlayers: 1,
    maxPlayers: 6,
    totalEnvelopes: 3,
    bannerTag: 'TİYATRO NOIR · SES KAYITLI & SAHNE ARKASI',
    synopsis: 
      'Kadıköy Şehir Tiyatrosu’nda sezonun en büyük oyunu kapalı gişe oynanırken, ayakta alkışlanan ünlü başrol Altan Saygın (44), ikinci perdenin hemen başında kulisteki soyunma odasında baygın ve nefessiz bulundu. Tarihi kadife kostümünün yakasındaki antika broşta felç edici nörotoksin izi tespit edildi. Sahne arkasındaki herkesin birbirine husumeti, bastırılmış kıskançlıkları ve şantaj sırları var!',
    victim: {
      name: 'Altan Saygın',
      age: 44,
      title: 'Devlet Tiyatrosu Başrol Oyuncusu & Yönetmen',
      timeOfDeath: '24 Ekim Cuma, 21:15 civarı',
      locationOfBody: 'Kadıköy Sahnesi, Başrol Soyunma Odası',
      causeInitial: 'Solunum kaslarında geçici felç ve nörotoksik şok',
    },
    suspects: [
      {
        id: 'melis-haznedar',
        name: 'Melis Haznedar',
        title: 'Genç Kadın Başrol (Eski Sevgilisi)',
        age: 29,
        relation: 'Eski Sevgili & Sahne Partneri',
        description: 'Yeteneğiyle parlayan genç oyuncu. Altan ile 1 yıl süren gizli bir ilişki yaşamış, ancak Altan’ın onu yeni sezonda kadro dışı bırakmakla tehdit ettiğini öğrenmişti. Olaydan 10 dakika önce elinde sahne makasıyla ağlayarak odadan çıkarken görüldü.',
        alibi: 'Perde arasında fuayede yönetmen yardımcısıyla sonraki sahneyi çalıştığını iddia ediyor.',
        suspiciousQuotes: [
          '"Altan hayatımdaki en kibirli adamdı. Beni kariyerimle tehdit etti."',
          '"Odasına girdim evet! Bana aldığı sahte pırlanta kolyeyi yüzüne fırlattım, makasla kostümümü değil onun hediye ettiği atkıyı kestim!"',
          '"Altan’ın kostümünü Gülfem Hanım’dan başkası elleyemezdi, dolabın anahtarı yalnızca ondaydı."'
        ],
        motiveHypothesis: 'Kariyerini kurtarmak ve kendisini tehdit eden narsist partnerinden intikam almak.',
        initialSuspicion: 65,
        photoPlaceholder: {
          initials: 'MH',
          tint: 'from-rose-950 to-pink-900',
          silhouetteStyle: 'bg-rose-900/30 border-rose-600/40 text-rose-300'
        }
      },
      {
        id: 'caner-ertekin',
        name: 'Caner Ertekin',
        title: 'Müzmin Yedek Oyuncu (Understudy)',
        age: 47,
        relation: '20 Yıllık Konservatuvar Arkadaşı & Yedek Oyuncu',
        description: 'Tüm metinleri ezbere bilen ancak 20 yıldır Altan’ın gölgesinde kalan kıskanç bir oyuncu. Olay gecesi Altan’ın soyunma odasının önünde şüpheli hareketler yaparken güvenlik görevlisi tarafından uyarıldı.',
        alibi: 'Kendi odasında ses egzersizi yaptığını iddia ediyor.',
        suspiciousQuotes: [
          '"Ben Altan’dan daha iyi bir Kral Lear oynardım! Bunu bütün konservatuvar biliyordu."',
          '"Odasına kostümün fermuarını bozmak için girmek istedim, yalan söylemeyeceğim! Sahneye çıkamasın da sıra bana gelsin istedim ama kapı kilitliydi!"',
          '"Ben zehirden anlamam. Ben tiyatrocuyum, katil değilim."'
        ],
        motiveHypothesis: 'Başrolü kapıp hayatının fırsatını yakalamak için Altan’ı saf dışı bırakmak.',
        initialSuspicion: 75,
        photoPlaceholder: {
          initials: 'CE',
          tint: 'from-zinc-950 to-neutral-900',
          silhouetteStyle: 'bg-zinc-800 border-zinc-600 text-zinc-300'
        }
      },
      {
        id: 'gulfem-saygin',
        name: 'Gülfem Saygın',
        title: 'Tiyatro Kostüm Tasarımcısı & Altan’ın Resmi Eşi',
        age: 46,
        relation: 'Eşi (15 Yıllık Evli & Tiyatronun Baş Kostümcüsü)',
        description: 'Asil, mesafeli ve tiyatronun tüm görsel dünyasını yöneten kadın. Altan’ın genç oyuncularla sayısız ilişkisini bilmesine rağmen tiyatronun marka değeri için susuyordu. Ancak Altan’ın tiyatronun telif haklarını ve kasadaki 8 Milyon TL’yi Londra’ya kaçıracağını öğrendi.',
        alibi: 'Olay anında dikiş atölyesinde figüranların yırtılan şapkalarını diktiğini söyledi.',
        suspiciousQuotes: [
          '"Altan’ın kostümlerini 15 yıldır ben dikerim. Her iğnesi, her astarı benim elimden geçer."',
          '"Boşanmak mı istiyordu? Boşanabilirdi ama tiyatronun adını lekelemesine izin veremezdim."',
          '"Broş mu? O broş antika bir sahne aksesuarıydı. Her oyundan önce ben parlatırdım."'
        ],
        motiveHypothesis: 'Tiyatronun sermayesini ve teliflerini korumak, Altan’ın kaçış planını engellemek.',
        initialSuspicion: 50,
        photoPlaceholder: {
          initials: 'GS',
          tint: 'from-amber-950 to-orange-900',
          silhouetteStyle: 'bg-amber-900/30 border-amber-600/40 text-amber-300'
        }
      }
    ],
    evidence: [
      {
        id: 'ev-2-1-1',
        envelope: 1,
        title: 'Soyunma Odası Olay Yeri Raporu & Broş İğnesi',
        category: 'document',
        roleAccess: ['forensics', 'profiler', 'ballistics', 'field'],
        summary: 'Altan Saygın makyaj koltuğunda baygın bulundu; yakasındaki kral broşunun arka iğnesinde reçinemsi bir kimyasal kalıntı var.',
        fullReport: 'Kadıköy İlçe Emniyet Olay Yeri İnceleme Raporu:\n24 Ekim 21:15’te sahne amirinin ihbarı üzerine odaya girilmiştir. Altan Saygın makyaj koltuğunda bilinci kapalı vaziyettedir. Nabız zayıf, solunum baskılanmıştır. Aynada rujla yazılmış "GURURUN SONUN OLACAK" yazısı mevcuttur. Odada Altan’ın Kral Lear kostümünün yakasındaki metal broş incelenmiş, iğne ucunda deriye temas eden kurar-türevi mikroskobik jel tortusu tespit edilmiştir.',
        keyDeduction: 'Zehir broş iğnesi aracılığıyla boyun damarına zerk edilmiştir; kostümü tasarlayan veya giydiren kişi şüphelidir.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Olay Yeri Fotoğrafı: Makyaj aynasındaki ruj yazısı ve kral kostümü',
        metadata: {
          date: '24 Ekim 2026',
          caseRef: 'TYT-01',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-2-1-2',
        envelope: 1,
        title: 'Sahne Arkası Gizli Ses Kaydı',
        category: 'audio',
        roleAccess: ['cryptology', 'profiler', 'archive'],
        summary: 'Oyundan 20 dakika önce kulis koridorundaki interkom telsizine takılan fısıltılı konuşma.',
        fullReport: 'Ses Kaydı Analizi #T-02 (20:55 civarı):\nErkek Sesi (Caner): "Bunu yapamazsın Altan, bu rol benim hakkımdı!"\nAltan: "Haddini bil Caner. Sen anca benim repliklerimi ezberleyen bir gölgesin. Londra biletlerim hazır, yarın bu tiyatroda ne sen kalacaksın ne Gülfem!"\nKadın Sesi (Fısıltı): "Demek her şeyi bırakıp gidiyorsun Altan... Bu kostüm sana çok yakışacak, son sahnende unutulmaz olacaksın..."',
        keyDeduction: 'Fısıltıyla konuşan kadın sesi soğukkanlıdır ve Altan’ın kostümüne atıfta bulunmaktadır.',
        mediaType: 'audio',
        mediaUrl: '',
        mediaCaption: 'İnterkom Telsiz Bandı: 20:55 kulis tartışması',
        metadata: {
          date: '24 Ekim 2026',
          caseRef: 'SES-TYT-02',
          confidentiality: 'ÇOK GİZLİ',
        }
      },
      {
        id: 'ev-2-1-3',
        envelope: 1,
        title: 'Polis Sorgu Tutanağı: Sahne Amiri Rıza Kurtuluş',
        category: 'interrogation',
        roleAccess: ['field', 'profiler', 'archive', 'forensics'],
        summary: 'Sahne Amiri Rıza’nın resmi ifadesi: 20:45 ile 21:15 arası odaya girenler, Melis’in makasla çıkışı ve Gülfem’in broşu takışı.',
        fullReport: 'T.C. KADIKÖY İLÇE EMNİYET MÜDÜRLÜĞÜ ASAYİŞ BÜRO\nTANIK İFADE VE SORGU TUTANAĞI\n\nTanık: Rıza Kurtuluş (51, Kadıköy Şehir Tiyatrosu Baş Sahne Amiri)\nSorgulayan: Komiser Selim Çetin / Sicil: 33819\nTarih: 24 Ekim 2026 - Saat 22:30\n\nSORU: Perde arasında Altan Saygın’ın odasına kimler girdi çıktı? Kronolojik sırayla anlatın.\nCEVAP: "Efendim, birinci perde 20:40’ta bitti. 20:45’te Melis Hanım ağlayarak elinde terzi makasıyla Altan’ın odasına daldı. İçeride bağrıştılar. 20:50’de Melis Hanım gözyaşları içinde kapıyı çarpıp fuayeye koştu. Hemen peşinden Caner koridorda belirdi; kapıyı yumrukladı, \'Altan konuşacağız\' dedi ama Altan kapıyı açmadı. Saat 20:55’te ise Altan’ın resmi eşi ve kostümcümüz Gülfem Hanım geldi. Elinde ahşap dikiş sepeti ve Kral Lear’ın kadife pelerini vardı. Odaya girdi. Yaklaşık 8 dakika kaldılar. Çıkarken Gülfem Hanım’a \'Kostüm hazır mı?\' diye sordum. Bana gayet sakin bir sesle, \'Broşunu yakasına bizzat taktım Rıza, bu gece son kez parlayacak\' dedi. 21:10’da anons için odaya girdiğimde Altan koltukta mosmor kesilmiş, nefes alamıyordu!"',
        keyDeduction: 'Gülfem Saygın, olaydan hemen önce 20:55’te Altan’ın odasına girmiş ve broşu yakasına bizzat kendisi takmıştır.',
        mediaType: 'text',
        metadata: {
          date: '24 Ekim 2026',
          caseRef: 'SORGU-AMİR-01',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-2-2-1',
        envelope: 2,
        title: 'Kimyasal Toksin Analizi & Dikiş İğnesi İzleri',
        category: 'toxicology',
        roleAccess: ['forensics', 'ballistics', 'profiler', 'field'],
        summary: 'Broş iğnesine mikroskobik balmumu kapsülü yerleştirilmiş; vücut ısısıyla eriyen kapsül zehri kana zerk etmiş.',
        fullReport: 'Kriminal Kimya ve Lif İhtisas Raporu:\nBroş iğnesi üzerindeki kimyasal incelemede güney Amerika kökenli kobra-toksin/kurar analoğu tespit edilmiştir. İğnenin gövdesine mikro-kanallar açılmış ve balmumu ile mühürlenmiştir. Oyuncu kostümü giyip boyun sıcaklığı 36.5 dereceye ulaştığında balmumu 10 dakika içinde eriyip zehri serbest bırakmıştır. Bu düzenek yalnızca usta bir terzi veya kostüm tasarımcısı tarafından mikroskop altında hazırlanabilir.',
        keyDeduction: 'Cinayet teşebbüsü tesadüf değildir; kostüm tasarımcısının doğrudan uzmanlığıdır.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Mikroskop Fotoğrafı: Broş iğnesindeki mikro-kanallı balmumu kapsülü',
        metadata: {
          date: '25 Ekim 2026',
          caseRef: 'KRM-TOX-02',
          confidentiality: 'ADLİ TIP RAPORU',
        }
      },
      {
        id: 'ev-2-2-2',
        envelope: 2,
        title: 'Asayiş Şube Sorgu Tutanağı: Şüpheli Caner Ertekin',
        category: 'interrogation',
        roleAccess: ['profiler', 'field', 'archive', 'forensics'],
        summary: 'Caner’in kulis dolabında parçalanmış pelerin bulundu; ancak zehirli broşa dokunmadığına dair çapraz sorgusu.',
        fullReport: 'T.C. KADIKÖY ASAYİŞ ŞUBE CİNAYET MASASI\nŞÜPHELİ ÇAPRAZ SORGU TUTANAĞI\n\nŞüpheli: Caner Ertekin (47, Yedek Oyuncu)\nSorgulayan: Başkomiser Hakan Erdem\nTarih: 25 Ekim 2026 - Saat 02:45\n\nSORU: Kulis dolabınızda Kral Lear’ın yedek pelerini makasla parçalanmış bulundu. Altan’ın odasını neden yumrukladınız?\nCEVAP: "Altan’dan nefret ettiğimi inkâr etmeyeceğim. 20 yıldır onun gölgesinde figüran gibi yaşadım. Dün akşam Londra biletlerini gördüm, tiyatroyu batırıp kaçacağını duydum. Yedek kostümünü makasla kestim; tek amacım ikinci perdeye çıkamasın, oyun iptal olsun veya bana yalvarsınlar idi. Ama Altan’ın odasına giremedim bile, kapı içeriden kilitliydi! Yemin ederim zehirden zerre anlamam. O antika broşu Altan’ın yakasına takan kişi Gülfem Hanım’dı! Hatta dikiş kutusundan cımbızla çıkardı, elleri buz gibiydi!"\n\nAdli Tıp Notu: Caner’in parmaklarında ve eşyalarında toksin kalıntısına rastlanmamıştır. Yalnızca kumaş lifleri mevcuttur.',
        keyDeduction: 'Caner yedek pelerini öfkeyle yırtmış ancak broşa zehir yerleştiren kişi değildir (Yanıltıcı Şüpheli).',
        mediaType: 'text',
        metadata: {
          date: '25 Ekim 2026',
          caseRef: 'SORGU-CANER-02',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-2-2-3',
        envelope: 2,
        title: 'Cinayet Büro Çapraz Sorgu Tutanağı: Şüpheli Melis Haznedar',
        category: 'interrogation',
        roleAccess: ['profiler', 'field', 'archive', 'forensics', 'cryptology'],
        summary: 'Melis Haznedar’ın elindeki terzi makası, aynadaki ruj yazısı ve Altan’ın şantajına dair ifadesi.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ CİNAYET BÜRO AMİRLİĞİ\nŞÜPHELİ SORGU VE İFADE ZAPTI\n\nŞüpheli: Melis Haznedar (29, Tiyatro Oyuncusu / Sahne Partneri)\nSorgulayan: Komiser Selim Çetin\nTarih: 25 Ekim 2026 - Saat 04:15\n\nSORU: Olaydan 20 dakika önce elinizde terzi makasıyla Altan’ın odasından ağlayarak çıktınız. Aynadaki kırmızı ruj da sizin çantanızdaki tonla birebir aynı. Ne yaptınız o odada?\nCEVAP: "Altan bana hayatı zehir etti! Bir yıldır süren gizli ilişkimizi bitirmek istedim. Bana \'Benden ayrılırsan seni bu sezon kadro dışı bırakırım, hiçbir sahnede rol bulamazsın\' diye şantaj yaptı. Çıldırdım! Kulis masasından terzi makasını kaptım, odasına daldım. Bana aldığı sahte pırlantalı ipek atkıyı gözünün önünde lime lime kestim! Altan’a tek bir fiziki temasım olmadı. Aynadaki ruj yazısına gelince... O ruj benim mat bordo rujum, evet. Ama ben o ruju 3 gün önce kulis makyaj masasında unuttum, herkesin erişebileceği yerdeydi! Ben odaya girdiğimde aynada o yazı yoktu. Biri benim rujumu alıp beni suçlu göstermek için aynaya o yazıyı yazmış!"\n\nKriminal Ekspertiz: Aynadaki ruj yazısının bastırılma açısı ve el yazısı solak bir şahsa aittir. Melis Haznedar sağ elini kullanmaktadır; Gülfem Saygın ise solaktır!',
        keyDeduction: 'Melis atkıyı kesmiş ancak zehirlememiştir. Aynadaki ruj yazısı Melis’in rujunu kullanan solak biri (Gülfem) tarafından hedef saptırmak için yazılmıştır.',
        mediaType: 'text',
        metadata: {
          date: '25 Ekim 2026',
          caseRef: 'SORGU-MELIS-02',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-2-3-1',
        envelope: 3,
        title: 'Londra Kaçış Planı ve Mali Şube Arama Raporu',
        category: 'document',
        roleAccess: ['archive', 'profiler', 'cryptology', 'forensics', 'field'],
        summary: 'Altan’ın çantasında tiyatronun kasasını boşaltma planı; Gülfem’in çekmecesinde ise balmumu ve zehir tüpü bulundu.',
        fullReport: 'Emniyet Mali Şube ve Arama Tutanağı:\n1. Altan Saygın’ın bavulunda tiyatronun resmi banka hesaplarından Londra’ya transfer edilmiş 8 Milyon TL’lik dekont bulunmuştur.\n2. Gülfem Saygın’ın dikiş atölyesindeki gizli iplik kutusunda toksin tüpü ve balmumu eriticisi ele geçirilmiştir.\n3. Aynadaki ruj yazısı: Gülfem, şüpheleri Melis’e yıkmak için Melis’in kuliste bıraktığı ruju kullanarak aynaya tehdit yazmıştır.',
        keyDeduction: 'Gülfem’in atölyesindeki balmumu eriticisi ve Altan’ın Londra kaçış dekontları kuvvetli bir motife işaret ediyor. Ancak Melis’in makasla tehdidi ve Caner’in yedek pelerini parçalayarak sahneye çıkma çabası şüpheleri üç aktör arasında diri tutuyor.',
        mediaType: 'text',
        metadata: {
          date: '25 Ekim 2026',
          caseRef: 'MALİ-GULFEM',
          confidentiality: 'ÇOK GİZLİ',
        }
      },
      {
        id: 'ev-2-3-2',
        envelope: 3,
        title: 'Cinayet Büro Çapraz Sorgu Tutanağı: Gülfem Saygın',
        category: 'interrogation',
        roleAccess: ['forensics', 'profiler', 'archive'],
        summary: 'Gülfem Saygın’ın dikiş atölyesindeki balmumu eriticisi, antika broş montajı ve sol el yazısı kriminal analizine dair çapraz sorgusu.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ CİNAYET BÜRO AMİRLİĞİ\nÇAPRAZ SORGU VE SAVUNMA ZAPTI\n\nŞüpheli: Gülfem Saygın (46, Tiyatro Baş Kostüm Tasarımcısı & Maktul Eşi)\nSorgulayan: Başkomiser Hakan Erdem / Baro Avukatı Eşliğinde\nTarih: 25 Ekim 2026 - Saat 10:15\n\nSORU: Dikiş kutunuzdaki balmumu eriticisi ve broş iğnesinin kilidindeki sol başparmak iziniz tespit edildi. Aynadaki yazıyı da sol elini kullanan birinin yazdığı raporda yazıyor. Ne diyeceksiniz?\nCEVAP: "Saçmalamayı kesin! Dikiş atölyemdeki balmumu, 200 yıllık tarihi kadife yakaları sertleştirmek ve nakış ipliklerini mumlamak için kullandığım mesleki bir malzemedir. Zehirle hiçbir alakası yoktur! Broş iğnesindeki parmak izime gelince; o kostümün baş tasarımcısı benim! Broşu Altan\'ın yakasına 20:55\'te ben taktım, tabii ki parmak izim çıkacak! Altan telaşlıydı, aynada saçını düzeltiyordu.\nSolak olmam beni katil yapmaz! Aynadaki tehdit yazısını Melis\'in yazdığı gün gibi aşikar. Masada Melis\'in unuttuğu bordo ruju gördüm. Melis\'in elinde devasa terzi makasıyla Altan\'ın odasından çıktığını bütün kulis gördü! Altan onu yeni sezonda kadro dışı bırakacaktı, Melis intikam yemini etmişti!\nAyrıca Caner\'i de sorguladınız mı? Caner 20 yıldır Altan\'ın yedeği olmaktan çıldırmış durumdaydı. Kostüm odasında Altan\'ın yedek pelerinini parçalarken suçüstü yakalandı, dolabında kas gevşetici ilaçlar bulundu! Caner sahneye çıkabilmek için Altan\'ın içeceğine zehir katmış olabilir. Beni 15 yıllık kocamı sahnede öldürmeye çalışmakla suçlayamazsınız; ben tiyatronun onurunu korudum!"',
        keyDeduction: 'Gülfem Saygın balmumu ve broş delillerini mesleki gerekçelerle açıklamış; aynadaki ruj yazısını ve zehirlemeyi Melis ile Caner’in üzerine atmıştır. Olay gecesi üç şüphelinin de kulisteki hareketleri ve sahnede yer alma motifi kafa karıştırmaktadır.',
        mediaType: 'text',
        metadata: {
          date: '25 Ekim 2026',
          caseRef: 'SES-GULFEM-03',
          confidentiality: 'ÇOK GİZLİ',
        }
      }
    ],
    gates: {
      1: {
        envelope: 1,
        title: 'Zarf 1 Soruşturma Sorusu: Suç Aletinin Tespiti',
        instructions: 'Zarf 1 bulgularına dayanarak aşağıdaki soruyu yanıtlayın.',
        question: 'Altan Saygın’ın bilincini kaybetmesine neden olan toksin vücuduna nasıl girmiştir?',
        options: [
          { id: 'q1-1', text: 'Kostümün yakasındaki antika broş iğnesi vasıtasıyla boyun bölgesinden.', isCorrect: true },
          { id: 'q1-2', text: 'Makyaj masasında içtiği maden suyuna zehir katılarak.', isCorrect: false },
          { id: 'q1-3', text: 'Sahne ışıklarından sızan kimyasal gaz ile.', isCorrect: false }
        ],
        explanation: 'Broş iğnesindeki kimyasal jel kalıntısı deriye temas ederek zehirlemiştir.'
      },
      2: {
        envelope: 2,
        title: 'Zarf 2 Soruşturma Sorusu: Kimyasal Düzeneğin Niteliği',
        instructions: 'Zarf 2’deki kriminal mikroskop raporunu analiz edin.',
        question: 'Broş üzerindeki balmumu kapsülü düzeneği hangi özel uzmanlığı gerektirmektedir?',
        options: [
          { id: 'q2-1', text: 'Kumaş, dikiş iğneleri ve kostüm detaylarına hakim ileri düzey terzilik ve kostüm tasarımı.', isCorrect: true },
          { id: 'q2-2', text: 'Patlayıcı ve balistik bomba uzmanlığı.', isCorrect: false },
          { id: 'q2-3', text: 'Tiyatro ses ve ışık teknisyenliği.', isCorrect: false }
        ],
        explanation: 'İğneye mikro-kanallar açıp balmumuyla mühürlemek kostüm ustasının el becerisidir.'
      },
      3: {
        envelope: 3,
        title: 'Zarf 3 Soruşturma Sorusu: Aynadaki Sahte İpucu',
        instructions: 'Makyaj aynasındaki rujlu tehdit yazısının kriminal ekspertizini değerlendirin.',
        question: 'Kulis aynasındaki rujlu tehdit yazısı ve el yazısı kriminal analizi neyi ortaya çıkarmıştır?',
        options: [
          { id: 'q3-1', text: 'Yazının solak bir şahıs tarafından ve Melis’in masada unuttuğu rujla hedef saptırmak amacıyla yazıldığını.', isCorrect: true },
          { id: 'q3-2', text: 'Yazının Altan’ın kendi el yazısıyla intihar notu olarak yazıldığını.', isCorrect: false },
          { id: 'q3-3', text: 'Yazının tiyatro müdürü Caner tarafından bir şaka amacıyla yazıldığını.', isCorrect: false }
        ],
        explanation: 'Kriminal analiz rujun Melis’in unuttuğu ruj olduğunu ve yazının solak bir fail tarafından hedef şaşırtmak için yazıldığını kanıtlamıştır.'
      }
    },
    solution: {
      culpritId: 'gulfem-saygin',
      culpritName: 'Gülfem Saygın',
      motiveTitle: 'Tiyatronun Milyonluk Fonlarını Kurtarmak & İhanet İntikamı',
      keyEvidenceTitle: 'Dikiş Kutusundaki Balmumu Eriticisi & Mikro-Kanallı Broş',
      fullChronology: [
        { time: '19:30', action: 'Gülfem Saygın, dikiş atölyesinde Kral Lear kostümünün broşuna vücut ısısıyla eriyen balmumu kapsülünü yerleştirir.', proof: 'Kriminal Lif ve Toksin Raporu' },
        { time: '20:45', action: 'Melis, Altan’ın odasına gidip tartışır ve hediyeleri parçalayıp çıkar.', proof: 'Tanık ifadeleri' },
        { time: '20:55', action: 'Gülfem odaya girip Altan ile son kez konuşur, ardından Melis’in masada unuttuğu rujla aynaya yanıltıcı tehdit yazar.', proof: 'İnterkom ses kaydı & Kriminal rapor' },
        { time: '21:05', action: 'Altan kostümü giyer, 10 dakika içinde vücut ısısı zehri serbest bırakır ve Altan yere yığılır.', proof: 'Adli Tıp Raporu' },
        { time: '21:15', action: 'Sahne amiri Altan’ı bulur ve perde indirilir.', proof: 'Polis ihbar zabtı' }
      ],
      verdictSummary: 'Dedektif masasının ortak kararıyla fail Gülfem Saygın yakalandı. Altan hastanede panzehirle kurtarıldı; Gülfem Saygın mahkemede suçunu itiraf ederek tiyatronun sermayesini korumak için bunu yaptığını belirtti.',
      confessionAudioTranscript: 'İtiraf Tutanağı: "15 yılımı bu sahneye verdim. O nankör adam genç bir kadınla Londra’ya kaçıp tiyatromuzu batıracaktı. Onu öldürmek istemedim, sadece o uçağa binmesini engellemek ve sahnesini sonlandırmak istedim."',
      confessionLetter: `[ADLİ EMANET KASASI - GÜLFEM SAYGIN'IN GİZLİ MEKTUBU VE İTİRAFI]

"Altan... Eğer bu satırları okuyorsan, hastane odasındaki panzehir seni hayata döndürmüş demektir. Ama bil ki sahnendeki o parlak ışıklar artık söndü.

Biz bu Kadıköy Şehir Tiyatrosu'nu 15 yıl önce iki kırık bavulla kurduk. Sen sahneye çıktın, alkışları topladın; ben bodrum katında parmaklarım delinene kadar kostüm diktim, bilet kestim, tiyatronun kuruşunu hesapladım. Ama sen narsist bir canavara dönüştün. Son iki yıldır tiyatronun kasasından 8 Milyon TL'lik devlet desteğini ve telif fonlarını sahte paravan hesaplarla Londra'ya kaçırdığını dekontlarıyla buldum. Beni bir çöp gibi bir kenara atıp, kızın yaşındaki Melis ile Londra'ya kaçacaktın.

Tiyatromuzun senin açgözlülüğün yüzünden batmasına izin veremezdim. Seni öldürmek istemedim Altan. Ölüm senin için fazla kolay bir kaçış olurdu. Seni sahnende, en büyük rolünde diz çöktürmek istedim.

Dikiş atölyesinde Kral Lear kostümünün antika broş iğnesine mikroskop altında mikro-kanallar açtım. Güney Amerika yerlilerinin kullandığı felç edici kurar jelini iğnenin içine zerk ettim; ağzını da tam 37.2 derece vücut ısısında eriyen doğal arı balmumuyla mühürledim. Broşu yakana saat 20:55'te bizzat takarken gözlerinin içine baktım. 'Bu gece son kez parlayacaksın' dedim. Vücudun ısındıkça balmumu eriyecek, toksin derine sızacak ve tam ikinci perdenin başlangıcında seni felç edecekti. Uçağa asla yetişemeyecektin.

Makyaj masasında Melis'in unuttuğu bordo ruju görünce sol elimle aynaya o tehdit mesajını yazdım. Herkesin bunu bir yasak aşk kavgası sanmasını, Melis'in elindeki makasla suçlu ilan edilmesini planlamıştım. Caner'in de rol hırsıyla ortalıkta dolaşması işime geldi.

Ben bir katil değilim; ben hayatımı ve tiyatromu bir sahtekâra karşı koruyan bir kadınım. Perde kapandı Altan."`
    }
  },

  // =========================================================================
  // VAKA 3: KARANLIK VADİ LABORATUVARI
  // =========================================================================
  {
    id: 'karanlik-vadi-laboratuvari',
    title: 'Karanlık Vadi Laboratuvarı',
    subtitle: 'Özel Maden ve Kimya Tesisinde Şüpheli Asansör Sabotajı',
    difficulty: 'Orta',
    estimatedMinutes: 30,
    minPlayers: 1,
    maxPlayers: 6,
    totalEnvelopes: 3,
    bannerTag: 'SANAYİ CASUSLUĞU · TELSİZ ALARMI & ASİT SABOTAJI',
    synopsis: 
      'Zonguldak kırsalındaki Karaca Madencilik ve Jeokimya Araştırma Tesisi’nde, bağımsız güvenlik denetçisi ve başmühendis Erdem Soydan (39), eksi 200 metre kotundaki araştırma şaftında asansör kabininin düşmesi sonucu şüpheli şekilde hayatını kaybetti. İlk başta kaza dense de çelik halatların asitle eritildiği ortaya çıktı. Tesiste milyon dolarlık lityum batarya patenti üzerinde gizli bir casusluk savaşı yaşanmaktadır.',
    victim: {
      name: 'Erdem Soydan',
      age: 39,
      title: 'Bağımsız Maden Denetçisi & Metalurji Başmühendisi',
      timeOfDeath: '26 Ekim Pazar, 22:10 suları',
      locationOfBody: 'Karaca Maden Ocağı, -200 Metre Şaft Tabanı',
      causeInitial: 'Yüksekten düşmeye bağlı çoklu travma ve şaft kabini ezilmesi',
    },
    suspects: [
      {
        id: 'hasan-karaca',
        name: 'Hasan Karaca',
        title: 'Maden ve Tesis Sahibi (İş İnsanı)',
        age: 52,
        relation: 'İşletme Sahibi & Denetlenen Taraf',
        description: 'Sert, otoriter ve madenin kapatılmasını önlemek için her yolu deneyen biri. Erdem Soydan’a denetim raporunu olumlu yazması için 3 Milyon TL rüşvet teklif etmiş, reddedilince tehdit etmişti. Arabasında Erdem’in evrak çantası bulundu.',
        alibi: 'Olay anında idari binada muhasebecisiyle bilanço incelediğini söyledi.',
        suspiciousQuotes: [
          '"Erdem çok dik kafalıydı. Madeni kapatırsa 400 işçi aç kalırdı, bunu ona anlattım."',
          '"Arabamdaki çanta mı? Erdem odamda unuttu, yarın iade edecektim!"',
          '"Ben deli miyim kendi tesisimin asansörünü patlatayım? Maden 6 ay mühürlendi, asıl zararı ben gördüm!"'
        ],
        motiveHypothesis: 'Madenin kapatılmasını ve iflas etmeyi engellemek için denetçiyi susturmak.',
        initialSuspicion: 75,
        photoPlaceholder: {
          initials: 'HK',
          tint: 'from-amber-950 to-stone-900',
          silhouetteStyle: 'bg-amber-900/30 border-amber-600/40 text-amber-300'
        }
      },
      {
        id: 'murat-cetin',
        name: 'Murat Çetin',
        title: 'Vardiya Amiri & Maden İşçisi',
        age: 31,
        relation: 'Şaft Sorumlusu & Saha Çalışanı',
        description: 'Geçen yıl madendeki ihmal yüzünden kardeşini kaybetmiş öfkeli bir işçi. Olay saatinde asit ve kimyasal deposunun anahtarı üzerindeydi ve asansör makine dairesinden çıkarken görüldü.',
        alibi: 'Şaft lambalarını tamir ettiğini iddia ediyor.',
        suspiciousQuotes: [
          '"Hasan Karaca gibiler işçinin canını hiçe sayar. Erdem Bey doğru bir adamdı, madeni kapatacaktı."',
          '"Asit deposuna kaçak lamba yakıtı almak için girdim, inkâr etmiyorum. Ama asansör halatına dokunmadım!"',
          '"Berna Hanım’ın laboratuvardan geç saatte elinde sarı bidonla çıktığını gördüm, ona neden sormuyorsunuz?"'
        ],
        motiveHypothesis: 'İhmalleri protesto etmek ve tesisi sabotajla durdurmak.',
        initialSuspicion: 65,
        photoPlaceholder: {
          initials: 'MÇ',
          tint: 'from-blue-950 to-slate-900',
          silhouetteStyle: 'bg-blue-900/30 border-blue-600/40 text-blue-300'
        }
      },
      {
        id: 'berna-tezcan',
        name: 'Berna Tezcan',
        title: 'Tesis Baş Jeoloğu & Kimya Laboratuvar Şefi',
        age: 37,
        relation: 'Erdem’in Üniversiteden Eski Laboratuvar Ortağı',
        description: 'Sessiz, bilimsel kariyerine odaklı bir araştırmacı. Tesisin derin katmanlarında devasa bir lityum rezervi keşfetmiş ve patenti Erdem ile ortak tescillemek üzereydi. Ancak Erdem’in madeni çevreye zehir saçtığı için kapatma kararı aldığını ve patentin kamuya devredileceğini öğrendi.',
        alibi: 'Olay gecesi 21:00’den itibaren laboratuvarda spektrometre testleri yaptığını belirtti.',
        suspiciousQuotes: [
          '"Erdem ile 10 yıldır bilimsel araştırmalar yapıyorduk. O benim meslektaşımdı."',
          '"Lityum patenti 50 Milyon Dolar değerinde. Erdem bu madeni kapatırsa bütün araştırmamız çöpe gidecekti."',
          '"Laboratuvarımdaki asitler kilit altındadır. Anahtar yalnızca bende ve vardiya amirinde bulunur."'
        ],
        motiveHypothesis: '50 Milyon Dolarlık lityum batarya patentini tek başına ele geçirmek ve patentin iptalini engellemek.',
        initialSuspicion: 55,
        photoPlaceholder: {
          initials: 'BT',
          tint: 'from-purple-950 to-indigo-900',
          silhouetteStyle: 'bg-purple-900/30 border-purple-600/40 text-purple-300'
        }
      }
    ],
    evidence: [
      {
        id: 'ev-3-1-1',
        envelope: 1,
        title: 'Şaft Enkazı Kriminal Raporu & Kopan Çelik Halat',
        category: 'document',
        roleAccess: ['forensics', 'ballistics', 'field', 'profiler'],
        summary: 'Asansör halatının mekanik yorgunluktan değil; sülfürik-hidroklorik asit karışımıyla kasten eritilerek koparıldığı belirlendi.',
        fullReport: 'Kriminalistik Olay Yeri Zabtı:\n26 Ekim saat 22:10’da -200 kotuna çakılan servis asansöründe yapılan incelemede:\n- Çelik taşıyıcı halatın kopma noktasında kimyasal erime ve yeşilimsi korozyon köpüğü tespit edilmiştir.\n- Olay bir mekanik aşınma değil, yüksek saflıkta derişik asit tatbikiyle gerçekleşmiş bir sabotajdır.\n- Kabin fren blokaj mekanizmasının arasına kasten kurşun takoz sıkıştırılarak acil fren devre dışı bırakılmıştır.',
        keyDeduction: 'Sabotajcı kimya bilgisine ve maden fren sisteminin teknik detaylarına tam hakimdir.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Kriminal Fotoğraf: Asitle eritilmiş çelik taşıyıcı kablo',
        metadata: {
          date: '26 Ekim 2026',
          caseRef: 'SAB-01',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-3-1-2',
        envelope: 1,
        title: 'Şaft Telsiz Panik ve Alarm Ses Bandı',
        category: 'audio',
        roleAccess: ['cryptology', 'profiler', 'archive', 'forensics'],
        summary: 'Asansör düşmeden 25 saniye önceki telsiz anonsu ve Erdem Soydan’ın son sözleri.',
        fullReport: 'Telsiz Kayıt Bandı #M-03 (Saat 22:09:40):\nErdem Soydan: "Merkez! Şaft kabini kayıyor, acil durdurma devreye girmiyor! Biri kabloları kurcalamış!"\nMerkez Operatörü: "Erdem Bey freni manuel çekin!"\nErdem Soydan: "Manuel fren sıkışmış! Berna... Berna’nın raporundaki veriler doğruydu, maden değil laboratuvar..." (Şiddetli gürültü ve telsiz paraziti)\nSaat 22:10:05 - Çarpma sesi ve hat kesintisi.',
        keyDeduction: 'Erdem son anlarında laboratuvar verilerine ve Berna’ya dikkat çekmektedir.',
        mediaType: 'audio',
        mediaUrl: '',
        mediaCaption: 'Şaft Telsiz Kaydı: Erdem Soydan’ın acil durum anonsu',
        metadata: {
          date: '26 Ekim 2026',
          caseRef: 'SES-MADEN-03',
          confidentiality: 'ÇOK GİZLİ',
        }
      },
      {
        id: 'ev-3-1-3',
        envelope: 1,
        title: 'Polis & İş Güvenliği Sorgu Tutanağı: Baş Teknisyen Celal Demir',
        category: 'interrogation',
        roleAccess: ['field', 'forensics', 'profiler', 'archive'],
        summary: 'Şaft Baş Teknisyeni Celal Usta’nın ifadesi: Kurşun takoz sabotajı ve saat 21:15’te kulede görülen beyaz önlüklü kişi.',
        fullReport: 'T.C. ZONGULDAK İL EMNİYET MÜDÜRLÜĞÜ ASAYİŞ ŞUBE\nTANIK İFADE VE TEKNİK TESPİT ZAPTI\n\nTanık: Celal Demir (58, Baş Maden Şaft Teknisyeni)\nSorgulayan: Komiser Orhan Yıldız / Sicil: 29014\nTarih: 27 Ekim 2026 - Saat 01:30\n\nSORU: Düşen asansörün halatları ve acil fren tertibatı en son ne zaman kontrol edildi? Sabotaj izi var mı?\nCEVAP: "Komiserim, o asansör 40 tonluk çelik halat taşır; bakımı iki gün önce yapıldı, sapasağlamdı! Halatın koptuğu yere mikroskopla baktık; çelik sanki tereyağı gibi köpürerek erimiş. Bu sıradan bir pas veya aşınma değil, yüksek dereceli kimyasal asit erimesi! Dahası, acil fren disklerinin arasına döküm kurşun bir takoz çakılmış. Fren tırnakları diski tutamasın diye bilerek sıkıştırılmış. Saat 21:15 sularında motor dairesinden inerken kule basamaklarında üzerinde beyaz laboratuvar önlüğü ve mavi nitril eldiven olan birinin hızla idari binaya doğru yürüdüğünü gördüm. Gece karanlığında yüzünü seçemedim ama maden işçisi değildi; işçiler sarı tulum giyer, önlük yalnızca kimya laboratuvarındakilerde vardır!"',
        keyDeduction: 'Sabotajcı acil freni kurşun takozla kilitlemiş ve halata asit sürmüştür. Şüpheli saat 21:15’te kulede görülen beyaz önlüklü kişidir (Berna Tezcan).',
        mediaType: 'text',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'SORGU-TEKNİK-01',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-3-2-1',
        envelope: 2,
        title: 'Laboratuvar Asit Envanteri ve Spektrometre Eşleşmesi',
        category: 'toxicology',
        roleAccess: ['forensics', 'cryptology', 'profiler', 'field'],
        summary: 'Halattaki asidin yalnızca Berna Tezcan’ın özel jeokimya projesinde kullanılan florosülfonik asit formülü olduğu kanıtlandı.',
        fullReport: 'Adli Kimya İhtisas Raporu:\nÇelik halat üzerindeki korozyon kalıntısı gaz kromatografisiyle analiz edilmiştir. Kullanılan asit sıradan bir sanayi asidi olmayıp, yalnızca Berna Tezcan’ın lityum zenginleştirme deneylerinde kullandığı özel florosülfürik katalizör karışımıdır. Bu kimyasal tesiste yalnızca Berna’nın parmak iziyle açılan özel çelik kasasında saklanmaktadır.',
        keyDeduction: 'Kimyasal doğrudan Berna Tezcan’ın kilitli laboratuvar kasasından alınmıştır.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Laboratuvar Analiz Raporu: Florosülfonik asit izotop eşleşmesi',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'KIMYA-771',
          confidentiality: 'ADLİ TIP RAPORU',
        }
      },
      {
        id: 'ev-3-2-2',
        envelope: 2,
        title: 'Asayiş ve Şantiye Karakolu Sorgu Tutanağı: Şüpheli Murat Çetin',
        category: 'interrogation',
        roleAccess: ['profiler', 'field', 'archive', 'forensics'],
        summary: 'Murat Çetin olay saatinde asansör makine dairesinde görülmüştü; ancak jeneratörden mazot çaldığını itiraf etti.',
        fullReport: 'T.C. ZONGULDAK ASAYİŞ VE ŞANTİYE KARAKOLU\nŞÜPHELİ ÇAPRAZ SORGU TUTANAĞI\n\nŞüpheli: Murat Çetin (31, Vardiya Amiri)\nSorgulayan: Başkomiser Hakan Erdem\nTarih: 27 Ekim 2026 - Saat 03:20\n\nSORU: Olaydan 40 dakika önce makine dairesinde görüldünüz. Asit deposunun anahtarı üzerinizdeydi. Asansör halatına asidi siz mi döktünüz?\nCEVAP: "Komiserim, Hasan Karaca’dan nefret ederim. Geçen yıl ihmalden kardeşimi göçükte kaybettim. Ama Erdem Soydan doğru dürüst bir mühendisti, madeni kapatmak için rapor yazıyordu. Ben onu niye öldüreyim? Makine dairesine girdiğimi inkâr etmiyorum ama jeneratör deposundan bidonlara kaçak mazot çekiyordum! Asansörün koptuğunu duyunca panikle bidonları atıp kaçtım. Asit deposuna gelince; anahtar bende ama asıl kimyasal anahtarı Berna Hanım’ın parmak iziyle açılan laboratuvar kasasındadır. Hatta dün gece 21:20 civarı laboratuvarın arka kapısından Berna Hanım’ın elinde sarı cam şişeyle çıktığını bizzat gördüm. O kadına bakın!"\n\nKriminal Teyit: Murat’ın tulumunda yalnızca mazot hidrokarbonları tespit edilmiş; florosülfonik asit izine rastlanmamıştır.',
        keyDeduction: 'Murat yakıt hırsızlığı yapmış ancak asit kullanmamıştır (Yanıltıcı Şüpheli). Berna’nın gece 21:20’de asit şişesiyle çıktığını doğrulamıştır.',
        mediaType: 'text',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'SORGU-MURAT-02',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-3-2-3',
        envelope: 2,
        title: 'Cumhuriyet Savcılığı Çapraz Sorgu Tutanağı: Şüpheli Hasan Karaca',
        category: 'interrogation',
        roleAccess: ['profiler', 'archive', 'field', 'cryptology', 'forensics'],
        summary: 'Maden sahibi Hasan Karaca’nın rüşvet itirafı, makam arabasındaki çanta ve iflas korkusu hakkındaki sorgusu.',
        fullReport: 'T.C. ZONGULDAK CUMHURİYET BAŞSAVCILIĞI\nŞÜPHELİ SORGU VE İFADE TUTANAĞI\n\nŞüpheli: Hasan Karaca (52, Karaca Madencilik Tesis Sahibi)\nSorgulayan: Cumhuriyet Savcısı Avni Kaya & Cinayet Büro\nTarih: 27 Ekim 2026 - Saat 05:40\n\nSORU: Maktul Erdem Soydan’ın evrak çantası makam arabanızın bagajında bulundu. Madeni kapatmaması için 3 Milyon TL rüşvet teklif ettiğiniz dekontlarla sabit. Asansörü siz mi sabote ettirdiniz?\nCEVAP: "Sayın Savcım, evet suçluyum; rüşvet teklif ettim, inkâr etmiyorum. Erdem Bey madeni kapatırsa 400 işçi aç kalacaktı, bankalar gırtlağıma çökecekti. Çantayı akşam 18:00’de odamda unuttu, içine para teklif mektubunu koyup düşünsün diye arabamda tuttum. Ama cinayet asla! Ben aptal mıyım kendi madenimin ana şaftını patlatayım? Maden şimdi savcılık kararıyla en az 6 ay mühürlendi! Milyonlarca lira zarar ettim, asıl ben battım! Erdem madeni kapatsa sadece ceza yerdim, cinayet işlesem idamlık olurum. Bana değil, lityum laboratuvarına bakın! Berna Hanım ile Erdem dün akşam lityum patenti yüzünden koridorda birbirine girdi!"\n\nSavcılık Değerlendirmesi: Hasan Karaca rüşvet suçunu ikrar etmiştir ancak sabotaj tekniğine sahip değildir ve madenin kapanması ekonomik olarak en çok kendisine zarar vermiştir.',
        keyDeduction: 'Hasan Karaca rüşvet vermiş ancak asansör sabotajıyla ilgisi yoktur (Yanıltıcı Şüpheli). Asıl çatışmanın patent ortaklığı olduğunu açıklamıştır.',
        mediaType: 'text',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'SORGU-HASAN-02',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-3-3-1',
        envelope: 3,
        title: 'Berna Tezcan’ın Gizli Patent Başvurusu ve Bilgisayar Kayıtları',
        category: 'document',
        roleAccess: ['archive', 'cryptology', 'field', 'forensics', 'profiler'],
        summary: 'Berna’nın cinayetten 3 saat önce Türk Patent Enstitüsü’ne tek başına 50 Milyon Dolarlık lityum patenti başvurduğu belgelendi!',
        fullReport: 'Siber Suçlar ve Mali İnceleme Raporu:\n1. Berna Tezcan’ın dizüstü bilgisayarında yapılan adli bilişim incelemesinde:\n- Olay günü saat 19:15’te Erdem Soydan’ın adını patent ortaklığından silerek tek isimle başvuru yaptığı tespit edilmiştir.\n- Bilgisayar arama geçmişinde: "Çelik asansör halatı kopma süresi", "Florosülfonik asit metal aşınma hızı" aramaları bulunmuştur.\n2. Hasan Karaca’nın rüşvet çantası: Hasan Karaca madenin kapanmasını önlemek için Erdem’e para teklif etmiş ancak cinayet sabotajından tamamen habersizdir.',
        keyDeduction: 'Berna’nın patent başvurusundan Erdem’i silmesi ve bilgisayar arama geçmişi ağır bir şüphe odağı oluşturuyor. Ancak Hasan Karaca’nın bagajındaki rüşvet çantası ve Murat’ın makine dairesindeki şüpheli varlığı dedektifler için sabotajın arkasındaki el konusunda çoklu ihtimalleri canlı tutuyor.',
        mediaType: 'text',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'SİBER-PATENT',
          confidentiality: 'ÇOK GİZLİ',
        }
      },
      {
        id: 'ev-3-3-2',
        envelope: 3,
        title: 'Cinayet Büro Çapraz Sorgu Tutanağı: Dr. Berna Tezcan',
        category: 'interrogation',
        roleAccess: ['forensics', 'profiler', 'archive'],
        summary: 'Berna Tezcan’ın patent başvurusu, laboratuvar kasası açılış logları ve maden kulesindeki adli aramalara dair ifadesi.',
        fullReport: 'T.C. ZONGULDAK EMNİYET MÜDÜRLÜĞÜ CİNAYET VE SİBER SUÇLAR BÜROSU\nÇAPRAZ SORGU VE SAVUNMA TUTANAĞI\n\nŞüpheli: Dr. Berna Tezcan (37, Tesis Baş Jeoloğu & Kimya Laboratuvar Şefi)\nSorgulayan: Başkomiser Hakan Erdem & Bilişim Müfettişi\nTarih: 27 Ekim 2026 - Saat 11:30\n\nSORU: Bilgisayarınızda saat 19:15’te Erdem Soydan’ı 50 Milyon Dolarlık lityum patentinden sildiğiniz, saat 21:30’da florosülfonik asit kasasını parmak izinizle açtığınız ve "çelik asansör halatı asit aşınma süresi" aramalarınız tespit edildi. Açıklamanız nedir?\nCEVAP: "Bana kumpas kuruluyor! Evet, Erdem’in adını patent başvurusundan çıkardım çünkü Erdem aylardır jeokimya analizlerine bir satır katkı sunmadı! Dahası Erdem’in Hasan Karaca ile gizli pazarlıklar yaptığını, madeni kapatmamak karşılığında 3 Milyon TL rüşvet aldığını duydum. Bilimsel bir patente bir rüşvetçinin adını yazamazdım!\nKasayı saat 21:30’da açtığım doğru; çünkü gece vardiyasında lityum numunelerinin saflaştırma reaksiyonunu yürütüyordum. Asit arama geçmişine gelince; Karaca Madencilik’in kuyu borularında asit korozyonu vardı, işletme benden resmi aşınma simülasyonu istemişti. Ben bir bilim insanıyım! Asansör halatına asit sürecek kadar alçalır mıyım?\nMurat Çetin bana iftira atıyor! Murat motor dairesinde kaçak mazot satıyor, kimyasal bidonlarını karıştırıyordu. Hasan Karaca da maden kapanmasın diye Erdem’i susturmak için her şeyi yapacak bir adamdı; Erdem’in evrak çantası Hasan’ın makam arabasının bagajından çıktı! Neden Hasan Karaca ve Murat’ı aklayıp bütün suçu bir kadının bilimsel araştırmasına yıkıyorsunuz?"',
        keyDeduction: 'Berna Tezcan patent ve asit aramalarını akademik gerekçelerle savunmuş, sabotajı ve cinayeti şiddetle reddetmiştir. Şüphe oklarını bagajında maktulün çantası çıkan patron Hasan Karaca ve makine dairesindeki şüpheli teknisyen Murat Çetin’e yöneltmiştir.',
        mediaType: 'text',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'SES-BERNA-03',
          confidentiality: 'ÇOK GİZLİ',
        }
      }
    ],
    gates: {
      1: {
        envelope: 1,
        title: 'Zarf 1 Soruşturma Sorusu: Asansör Kazasının Sebebi',
        instructions: 'Zarf 1 kriminal raporundaki bulguları değerlendirin.',
        question: 'Asansör kabininin düşmesine neden olan ana fiziksel etken nedir?',
        options: [
          { id: 'q1-1', text: 'Çelik taşıyıcı halatın derişik asitle kasten eritilmesi ve fren mekanizmasının takozla kilitlenmesi.', isCorrect: true },
          { id: 'q1-2', text: 'Maden şaftında metan gazı patlaması meydana gelmesi.', isCorrect: false },
          { id: 'q1-3', text: 'Aşırı yük taşınması sonucu motorun yanması.', isCorrect: false }
        ],
        explanation: 'Kriminal inceleme halatın asitle eritildiğini ve acil frenin takozla engellendiğini kanıtlamıştır.'
      },
      2: {
        envelope: 2,
        title: 'Zarf 2 Soruşturma Sorusu: Kimyasalın Menşei',
        instructions: 'Zarf 2’deki spektrometre kimya raporunu inceleyin.',
        question: 'Halatı eriten özel florosülfürik asit tesiste nerede ve kimin sorumluluğunda saklanmaktadır?',
        options: [
          { id: 'q2-1', text: 'Yalnızca Berna Tezcan’ın parmak iziyle açılan özel jeokimya araştırma kasasında.', isCorrect: true },
          { id: 'q2-2', text: 'Maden işçilerinin soyunma odasındaki ortak dolapta.', isCorrect: false },
          { id: 'q2-3', text: 'Hasan Karaca’nın makam odasındaki buzdolabında.', isCorrect: false }
        ],
        explanation: 'Özel asit sadece Berna’nın lityum projesi için ithal edilmiş ve şifreli kasada kilitlidir.'
      },
      3: {
        envelope: 3,
        title: 'Zarf 3 Soruşturma Sorusu: Dijital İnceleme Tespiti',
        instructions: 'Siber suçlar ve patent inceleme dökümündeki arama geçmişini değerlendirin.',
        question: 'Siber suçlar ve patent inceleme raporundaki dijital arama logları hangi kritik bulguyu ortaya çıkarmıştır?',
        options: [
          { id: 'q3-1', text: 'Olay gecesi 50 Milyon Dolarlık lityum patentinden maktulün adının silindiğini ve halat aşınma süresinin aratıldığını.', isCorrect: true },
          { id: 'q3-2', text: 'Madenin tüm hisselerinin yabancı bir şirkete gizlice devredildiğini.', isCorrect: false },
          { id: 'q3-3', text: 'Tesis kasasından 10 Milyon TL nakit çekildiğini.', isCorrect: false }
        ],
        explanation: 'Dijital loglar cinayet öncesinde patentten maktulün çıkarıldığını ve asit aşınma sürelerinin araştırıldığını ortaya koymuştur.'
      }
    },
    solution: {
      culpritId: 'berna-tezcan',
      culpritName: 'Berna Tezcan',
      motiveTitle: '50 Milyon Dolarlık Lityum Patentini Tek Başına Sahiplenmek',
      keyEvidenceTitle: 'Florosülfonik Asit Laboratuvar Kasası & Saat 19:15 Patent Başvurusu',
      fullChronology: [
        { time: '17:00', action: 'Erdem Soydan, madenin çevre raporunu olumsuz kapatacağını ve lityum sahasının kamuya devredileceğini Berna’ya bildirir.', proof: 'Erdem’in çalışma günlüğü' },
        { time: '19:15', action: 'Berna Tezcan, dizüstü bilgisayarından patent başvurusunu güncelleyip Erdem’in adını çıkarır.', proof: 'Siber suçlar raporu' },
        { time: '21:30', action: 'Berna, laboratuvardan aldığı florosülfonik asidi servis asansörünün halatına sürer ve fren takozunu yerleştirir.', proof: 'Kriminal Kimya Raporu' },
        { time: '22:05', action: 'Erdem denetim için kabine biner; asit halatı koparır ve kabin -200 kotuna çakılır.', proof: 'Şaft Telsiz Bandı' },
        { time: '22:30', action: 'Berna laboratuvara dönüp deney yapıyormuş gibi bilgisayar logları oluşturmaya çalışır.', proof: 'Bilişim log analizleri' }
      ],
      verdictSummary: 'Dedektif ekibinin oylaması sonucunda sabotajın faili Berna Tezcan olarak tespit edildi. Hasan Karaca rüşvet suçundan, Berna Tezcan ise planlı cinayet ve sanayi casusluğundan adliyeye sevk edildi.',
      confessionAudioTranscript: 'İtiraf Bandı: "O lityum rezervini 10 yıllık emeğimle buldum! Erdem gibi bir bürokratın bir çevre raporuyla hayatımın çalışmasını yok etmesine izin veremezdim. O maden kapatılsaydı patent hükümsüz kalacaktı!"',
      confessionLetter: `[ADLİ EMANET KASASI - DR. BERNA TEZCAN'IN GİZLİ GÜNLÜK İTİRAFI VE MEKTUBU]

"Beni mahkemenin önüne çıkaracaklar, bana bir 'katil' diyecekler... Ama kimse bilimin ve 10 yıllık uykusuz gecelerin ne demek olduğunu anlamayacak.

Zonguldak'ın bu karanlık vadisinde, yerin 200 metre altındaki zehirli çamurun içinde Türkiye'nin en saf lityum rezervini tek başıma keşfettim. Uluslararası otomotiv devleri ve batarya konsorsiyumları bu patent için 50 Milyon Dolar teklif ediyordu. Hayatımın projesiydi; adımı bilim tarihine yazdıracaktım.

Sonra Erdem geldi. Bürokratik kibriyle, elindeki denetim damgasıyla karşıma dikildi. Cuma akşamı odama girdi, 'Berna, maden çevre kriterlerine uymuyor. Pazartesi sabahı mühür basıyorum. Maden kapanınca lityum sahası da kamu korumasına devredilecek, patentiniz dondurulacak' dedi. 

Yalvardım. '10 yılımı verdim Erdem, iki hafta süre ver filtreleri takalım' dedim. Yüzünde soğuk, acımasız bir bürokrat gülümsemesiyle 'Kural kuraldır Berna, bilimin benim kurallarımın önüne geçemez' dedi ve kapıyı çarptı. Tek bir imzayla benim hayatımı çöpe atacaktı.

Dayanamadım. Saat 19:15'te lityum patent sistemine girip Erdem'in ismini sildim. Saat 21:30'da laboratuvar çelik kasasından florosülfonik asit şişesini ve naylon fırçayı aldım. Servis kulesinin metal basamaklarını tırmandım. Erdem'in saat 22:00'de son denetim için -200 kotuna ineceğini biliyordum. Çelik asansör halatının sürtünme noktasına asidi tabaka halinde sürdüm; 15 dakika içinde çelik liflerin kimyasal olarak gevşeyip ilk sarsıntıda kopacağını hesaplamıştım. Acil frenin devreye girmemesi için de döküm kurşun takozu fren dişlisine çaktım.

Maden sahibi Hasan Karaca'nın arabasındaki çantayı ve Murat'ın makine dairesindeki mazot hırsızlığını biliyordum; suçu onların arasındaki husumete yıkmak mükemmel bir plandı.

Erdem aşağı çakıldığında kalbim sızlamadı değil. Ama o maden kapansaydı ben zaten ruhen ölmüş olacaktım. Ben katil değilim; ben hayatımın emeğini bir bürokratın tek bir kurşun kalem darbesinden korudum."`
    }
  }
];
