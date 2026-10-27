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
      // ZARF 2
      {
        id: 'ev-2-1',
        envelope: 2,
        title: 'Adli Tıp Toksikoloji Raporu: Digitalis Zehirlenmesi',
        category: 'toxicology',
        roleAccess: ['forensics', 'cryptology'],
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
        title: 'Banu Ulusoy’un Çantasındaki Aşk Mektupları',
        category: 'interrogation',
        roleAccess: ['profiler', 'field', 'archive'],
        summary: 'Banu’nun olay gecesi kaçırdığı çantada çalıntı hançer değil; Hikmet’in genç ortağıyla yaşadığı gizli ilişkinin mektupları bulundu.',
        fullReport: 'Emniyet Kriminal İnceleme Tutanağı:\nŞüpheli Banu Ulusoy’un Bebek’teki galerisinde ele geçirilen siyah deri çantada yapılan aramada:\n- Zümrüt hançer veya ziynet eşyası BULUNMAMIŞTIR.\n- Çantada, Banu Ulusoy ile İzmirli bir antikacı arasında 2024 yılına ait el yazısı aşk mektupları ve otel rezervasyon dökümleri bulunmuştur.\n- Banu ifadesinde: "Hikmet mektupları öğrenirse beni tek kuruşsuz sokağa atacaktı. Kasada sakladığı mektupları geri almak için odaya girdim ama Hikmet çoktan fenalaşmıştı!" demiştir.',
        keyDeduction: 'Banu cinayet değil, şantaj ve itibarını kurtarma amacıyla hareket etmiştir (Yanıltıcı Şüpheli).',
        mediaType: 'text',
        metadata: {
          date: '19 Ekim 2026',
          caseRef: 'SORGU-BANU',
          confidentiality: 'GİZLİ',
        }
      },
      // ZARF 3
      {
        id: 'ev-3-1',
        envelope: 3,
        title: 'Restorasyon Atölyesi ve Gizli Sahtecilik Defteri',
        category: 'document',
        roleAccess: ['cryptology', 'archive', 'forensics'],
        summary: 'Yadigar Çelik’in atölyesindeki gizli dolapta, zümrüt hançerin sahte bir replikası ve digitalis saflaştırma cam tüpleri bulundu!',
        fullReport: 'Kriminalistik Arama El Koyma Tutanağı:\nYalı müştemilatındaki restorasyon laboratuvarında yapılan detaylı aramada:\n1. 18. yüzyıl zümrüt hançerin aslına uygun yapılmış reçine-zirkon replikası.\n2. Bir Alman kimya firmasından sipariş edilmiş saf digitalis tohumu faturası.\n3. Yadigar Çelik’in İsviçre UBS bankasında açılmış gizli hesabı: Hesaba son 3 yılda 2.4 Milyon Euro "Sanat Danışmanlığı" adı altında transfer edilmiştir.\n4. Hikmet Ulusoy’un ölmeden 2 saat önce yazdığı ve kasaya koyduğu not: "Yadigar, müzayedeye koyduğun hançerin sahte olduğunu anladım. Yarın sabah savcılıktasın."',
        keyDeduction: 'Katil Yadigar Çelik’tir! Hikmet sahteciliği çözünce ifşa olmamak için tansiyon çayına digitalis katmış ve suçu oğluna/eşine yıkmak için kasanın kapısını açık bırakmıştır.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Delil Fotoğrafı #3: Yadigar’ın gizli defteri ve reçine replika taslağı',
        metadata: {
          date: '20 Ekim 2026',
          caseRef: 'KRM-YADIGAR',
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
        title: 'Zarf 3 Soruşturma Sorusu: Gerçek Failin Motifi',
        instructions: 'Gizli restorasyon defteri ve İsviçre hesap hareketleri cinayetin asıl sebebini nasıl aydınlatır?',
        question: 'Yadigar Çelik’i Hikmet Ulusoy’u öldürmeye iten asıl sebep nedir?',
        options: [
          { id: 'q3-1', text: 'Hikmet Ulusoy’un sahte antika ticaretini çözmesi ve onu savcılığa vermekle tehdit etmesi.', isCorrect: true },
          { id: 'q3-2', text: 'Banu Ulusoy ile evlenmek istemesi.', isCorrect: false },
          { id: 'q3-3', text: 'Tarık Ulusoy’un borçlarını ödemek istemesi.', isCorrect: false }
        ],
        explanation: 'Yadigar, 2.4 Milyon Euro’luk sahte eser vurgununun ortaya çıkmasını engellemek için Hikmet’i zehirlemiştir.'
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
      verdictSummary: 'Dedektiflerin ortak titiz çalışması sonucu katilin 30 yıllık emektar Yadigar Çelik olduğu kanıtlandı. Yadigar sorguda suçunu itiraf etti; çalıntı zümrüt hançer atölyenin zeminindeki gizli bölmede ele geçirildi.',
      confessionAudioTranscript: 'İtiraf Ses Kaydı: "30 yılımı verdim o yalıya... Hikmet her eseri milyonlara satarken bana maaşlı köle gibi davrandı. Hançeri İsviçreli alıcıya satmıştım. Anlayınca beni hapse atmakla tehdit etti. Başka çarem yoktu!"'
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
        id: 'ev-2-2-1',
        envelope: 2,
        title: 'Kimyasal Toksin Analizi & Dikiş İğnesi İzleri',
        category: 'toxicology',
        roleAccess: ['forensics', 'ballistics'],
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
        id: 'ev-2-3-1',
        envelope: 3,
        title: 'Londra Kaçış Planı ve Gülfem’in İtiraf Mektubu',
        category: 'document',
        roleAccess: ['archive', 'profiler', 'cryptology'],
        summary: 'Altan’ın çantasında tiyatronun kasasını boşaltma planı; Gülfem’in çekmecesinde ise balmumu ve zehir tüpü bulundu.',
        fullReport: 'Emniyet Mali Şube ve Arama Tutanağı:\n1. Altan Saygın’ın bavulunda tiyatronun resmi banka hesaplarından Londra’ya transfer edilmiş 8 Milyon TL’lik dekont bulunmuştur.\n2. Gülfem Saygın’ın dikiş atölyesindeki gizli iplik kutusunda toksin tüpü ve balmumu eriticisi ele geçirilmiştir.\n3. Aynadaki ruj yazısı: Gülfem, şüpheleri Melis’e yıkmak için Melis’in kuliste bıraktığı ruju kullanarak aynaya tehdit yazmıştır.',
        keyDeduction: 'Gülfem Saygın, hem tiyatronun servetini korumak hem de kendisini terk eden kocasını sahne kostümünde cezalandırmak için komployu kurmuştur.',
        mediaType: 'text',
        metadata: {
          date: '25 Ekim 2026',
          caseRef: 'MALİ-GULFEM',
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
        instructions: 'Makyaj aynasındaki rujlu tehdit yazısının gerçek amacı nedir?',
        question: 'Gülfem Saygın aynaya Melis’in rujuyla yazı yazarak ne amaçlamıştır?',
        options: [
          { id: 'q3-1', text: 'Şüpheleri genç sevgili Melis Haznedar’ın üzerine çekip olaya bir aşk kavgası süsü vermek.', isCorrect: true },
          { id: 'q3-2', text: 'Caner’in rolü kapmasını sağlamak.', isCorrect: false },
          { id: 'q3-3', text: 'Tiyatro binasını sigortadan tahsil etmek.', isCorrect: false }
        ],
        explanation: 'Gülfem, şüpheleri Melis’e yönlendirmek için onun rujunu kullanmıştır.'
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
      verdictSummary: 'Dedektif masasının ortak kararıyla fail Gülfem Saygın yakalandı. Altan hastanede panzehirle kurtarıldı; Gülfem Saygın suçunu itiraf ederek tiyatronun sermayesini korumak için bunu yaptığını belirtti.',
      confessionAudioTranscript: 'İtiraf Tutanağı: "15 yılımı bu sahneye verdim. O nankör adam genç bir kadınla Londra’ya kaçıp tiyatromuzu batıracaktı. Onu öldürmek istemedim, sadece o uçağa binmesini engellemek ve sahnesini sonlandırmak istedim."'
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
        roleAccess: ['cryptology', 'profiler', 'archive'],
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
        id: 'ev-3-2-1',
        envelope: 2,
        title: 'Laboratuvar Asit Envanteri ve Spektrometre Eşleşmesi',
        category: 'toxicology',
        roleAccess: ['forensics', 'cryptology'],
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
        id: 'ev-3-3-1',
        envelope: 3,
        title: 'Berna Tezcan’ın Gizli Patent Başvurusu ve Bilgisayar Kayıtları',
        category: 'document',
        roleAccess: ['archive', 'cryptology', 'field'],
        summary: 'Berna’nın cinayetten 3 saat önce Türk Patent Enstitüsü’ne tek başına 50 Milyon Dolarlık lityum patenti başvurduğu belgelendi!',
        fullReport: 'Siber Suçlar ve Mali İnceleme Raporu:\n1. Berna Tezcan’ın dizüstü bilgisayarında yapılan adli bilişim incelemesinde:\n- Olay günü saat 19:15’te Erdem Soydan’ın adını patent ortaklığından silerek tek isimle başvuru yaptığı tespit edilmiştir.\n- Bilgisayar arama geçmişinde: "Çelik asansör halatı kopma süresi", "Florosülfonik asit metal aşınma hızı" aramaları bulunmuştur.\n2. Hasan Karaca’nın rüşvet çantası: Hasan Karaca madenin kapanmasını önlemek için Erdem’e para teklif etmiş ancak cinayet sabotajından tamamen habersizdir.',
        keyDeduction: 'Fail Berna Tezcan’dır. Patentin tek sahibi olmak ve Erdem’in madeni kapatarak lityum çıkarımını engellemesini önlemek için sabotajı planlamıştır.',
        mediaType: 'text',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'SİBER-PATENT',
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
        title: 'Zarf 3 Soruşturma Sorusu: Sabotajın Gerçek Nedeni',
        instructions: 'Siber suçlar ve patent inceleme dökümüne göre cinayetin motifi nedir?',
        question: 'Berna Tezcan’ı meslektaşı Erdem’i ortadan kaldırmaya iten asıl neden nedir?',
        options: [
          { id: 'q3-1', text: '50 Milyon Dolarlık lityum patentini tek başına almak ve Erdem’in madeni mühürletmesini önlemek.', isCorrect: true },
          { id: 'q3-2', text: 'Murat Çetin ile madenden kaçak kömür satmak.', isCorrect: false },
          { id: 'q3-3', text: 'Hasan Karaca’nın şirketini satın almak.', isCorrect: false }
        ],
        explanation: 'Berna, cinayetten hemen önce Erdem’in adını patent başvurusundan silmiş ve aramalar yapmıştır.'
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
      confessionAudioTranscript: 'İtiraf Bandı: "O lityum rezervini 10 yıllık emeğimle buldum! Erdem gibi bir bürokratın bir çevre raporuyla hayatımın çalışmasını yok etmesine izin veremezdim. O maden kapatılsaydı patent hükümsüz kalacaktı!"'
    }
  }
];
