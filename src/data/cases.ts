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
      'Türkiye’nin en köklü antikacısı Hikmet Ulusoy (62), Kandilli’deki tarihi yalısının çalışma odasında, elinde yarım kalmış fincanıyla cansız bulundu. Çelik kasadaki 18. yüzyıl zümrüt hançer kayıp; ancak şömine külleri, kesilen kamera şalteri ve yalıya gece giren dört farklı isim arasında her şüphelinin sakladığı ayrı bir suç var.',
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
        relation: 'Eşi (5 yıllık evli, çekişmeli boşanma aşamasında)',
        description:
          'Zarif, mesafeli ve hesapçı. Hikmet Bey’in evlilik sözleşmesini devreye sokup tüm koleksiyonu vakfa ve oğluna devredeceğini öğrenmişti. Olay gecesi 23:25’te arka sahil kapısından elinde siyah büyük bir deri çantayla çıkarken görüldü.',
        alibi: 'Saat 22:30’dan 00:30’a kadar Bebek’teki sanat galerisinde müzayede kataloğu hazırladığını iddia ediyor.',
        suspiciousQuotes: [
          '"O gece yalıya hiç uğramadım, bekçi beni karanlıkta başka biriyle karıştırmış olmalı."',
          '"Kasa şifresini bilmiyordum; Hikmet özel evraklarını benden bile saklardı."',
          '"Hikmet’in kalp ilaçlarını düzenli alıp almadığını doktoru Selim Bey takip ederdi."'
        ],
        motiveHypothesis: '40 Milyon TL’lik boşanma hakkını kaybetmemek ve galerisindeki sahte sertifikaları kasadan almak.',
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
        title: 'Maktulün Oğlu (İflas Eşiğindeki Girişimci)',
        age: 36,
        relation: 'Öz Oğlu (Babasıyla sert maddi anlaşmazlık içinde)',
        description:
          'Tefecilere 15 Milyon TL borçlanmış durumda. Olay gecesi 22:30’da ön kapıdan yalıya girdi; babasıyla tartıştıktan sonra 23:05’te evden ayrıldığını söylese de aracının PTS kaydı 23:28’e kadar Kandilli sahil yolunda bekliyor görünüyor.',
        alibi: 'Saat 23:05’te yalıdan çıkıp doğrudan Etiler’deki evine döndüğünü iddia ediyor.',
        suspiciousQuotes: [
          '"Babam masadaki fincanı üzerime fırlatınca ceketim ıslandı, 23:05’te çıkıp gittim."',
          '"Çıkarken merdivende Yadigar Usta elinde taze demlikle yukarı çıkıyordu."',
          '"Sahil yolunda biraz hava almak için arabada oturdum, eve tekrar girmedim."'
        ],
        motiveHypothesis: 'Tefeci borçlarını kapatmak için hançeri ele geçirmek ve tek varis olarak mirasa konmak.',
        initialSuspicion: 75,
        photoPlaceholder: {
          initials: 'TU',
          tint: 'from-blue-950 to-slate-900',
          silhouetteStyle: 'bg-blue-900/30 border-blue-600/40 text-blue-300'
        }
      },
      {
        id: 'dr-selim-koray',
        name: 'Dr. Selim Koray',
        title: 'Özel Kardiyolog & Vakıf Sağlık Danışmanı',
        age: 49,
        relation: 'Maktulün 8 Yıllık Özel Doktoru',
        description:
          'Hikmet’in kalp ritim ilaçlarını (digoksin/digitalis türevleri) bizzat düzenleyen hekim. Hikmet Bey’in kurduğu tıp vakfının klinik deney fonlarında usulsüzlük yaptığına dair denetim başlatılacağını öğrenmişti.',
        alibi: 'Olay gecesi 22:00’den sonra Anadolu Hisarı’ndaki evinden hiç çıkmadığını beyan ediyor.',
        suspiciousQuotes: [
          '"Hikmet’in kalp değerleri zaten sınırdaydı; yüksek doz digitalis her zaman cinayet olmayabilir."',
          '"Vakıf fonlarıyla ilgili denetim sadece rutin bir prosedürdü, aramızda husumet yoktu."',
          '"O gece yalıya gitmedim; telefon baz sinyalim boğaz hattından yansımış olabilir."'
        ],
        motiveHypothesis: 'Klinik deney usulsüzlüğünü gizlemek ve yüksek doz kalp ilacıyla doğal ölüm süsü vermek.',
        initialSuspicion: 65,
        photoPlaceholder: {
          initials: 'SK',
          tint: 'from-purple-950 to-slate-900',
          silhouetteStyle: 'bg-purple-900/30 border-purple-600/40 text-purple-300'
        }
      },
      {
        id: 'yadigar-celik',
        name: 'Yadigar Çelik',
        title: '30 Yıllık Restoratör & Yalı Kâhyası',
        age: 57,
        relation: 'Baş Restoratör & Yalı Sorumlusu',
        description:
          'Yalıda Hikmet Bey ile birlikte yaşlanmış, antika restorasyonu konusunda usta bir isim. Dışarıdan sarsılmaz bir sadakat sergilese de atölyesinde son dönemde nadir eserlerin birebir replikalarını ürettiği şüphesi doğdu.',
        alibi: 'Saat 23:10’da tansiyon çayını yukarı bıraktıktan sonra müştemilata çekilip 23:52’ye kadar uyuduğunu belirtiyor.',
        suspiciousQuotes: [
          '"30 yılımı bu yalıya verdim; Hikmet Bey benim velinimetimdi."',
          '"Saat 23:52’de kontrol için odaya girdiğimde kasa açıktı, hançer yoktu."',
          '"O gece yalıya benden habersiz giren çıkan çok kişi vardı; ben sadece çayını bıraktım."'
        ],
        motiveHypothesis: 'Sahte antika replika vurgununun savcılığa bildirilmesini önlemek.',
        initialSuspicion: 55,
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
        summary: 'Maktul çalışma masasında yığılmış; kırık fincanda melisa çayı kalıntısı, açık kasada boş hançer kutusu ve şöminede yanmış kağıt artığı bulundu.',
        fullReport: 'TC Emniyet Kriminal Şube Olay Yeri Zabtı:\nMaktul Hikmet Ulusoy, Kandilli Yalısı 2. kat çalışma odasında 23:40 sularında ölü bulunmuştur. Masanın sağında antika porselen fincan kırılmış vaziyettedir; zemine yayılan sıvı melisa çayıdır. Dudaklarda morarma ve tırnak diplerinde siyanoz mevcuttur. Zorlama veya boğuşma izi yoktur. Gömme kasa şifreyle açılmış, 18. yüzyıl zümrüt hançer kutusu boştur. Şömine külleri içinde henüz tamamen kül olmamış, üzerinde mühür ve envanter kodu bulunan küçük bir kâğıt parçası muhafaza altına alınmıştır.',
        keyDeduction: 'Zehirli madde fincandaki çayla alınmış, kasa ise şifreyi bilen veya doğrudan erişimi olan biri tarafından açılmıştır.',
        mediaType: 'image',
        mediaUrl: '/cases/vaka1/olay-yeri.png',
        mediaCaption: 'Olay Yeri Fotoğrafı #1: Çalışma masası, kırık porselen fincan ve açık kasa',
        narrationUrl: '/cases/vaka1/ev-1-1.mp3',
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
        summary: 'Yalı kâhyası Yadigar Çelik tarafından 23:52’de yapılan acil çağrı. Kasa yakından incelenmeden kayıp hançerin adını söylemesi dikkat çekiyor.',
        fullReport: '112 Acil Çağrı Kaydı Çözüm Tutanağı (Ses Dosyası #A-01):\nSaat 23:52:14\nOperatör: 112 Acil, buyrun?\nYadigar: (Nefes nefese) Ambulans gönderin hemen! Kandilli, Ulusoy Yalısı... Hikmet Bey nefes almıyor, masasında yığıldı kaldı!\nOperatör: Sakin olun efendim, nabız kontrolü yapabiliyor musunuz?\nYadigar: Nabız yok, elleri buz gibi... Aman Allahım kasayı açmışlar, zümrüt hançeri çalmışlar!\nOperatör: Ekipler yönlendirildi, lütfen olay yerine ve kasaya dokunmayın.',
        keyDeduction: 'Yadigar olay yerine henüz ilk giren kişi olarak kasanın içindeki kayıp eseri hemen fark etmiştir.',
        mediaType: 'audio',
        mediaUrl: '/cases/vaka1/112-ihbar.mp3',
        mediaCaption: '112 Acil Çağrı Bandı: Yadigar Çelik’in ihbar kaydı',
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
        summary: 'Bekçi Niyazi’nin ifadesi: Tarık 22:30’da girdi, sahil kamerası 23:00’te kesildi, Banu ise 23:25’te siyah çantayla arka kapıdan taksiye bindi.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ ASAYİŞ ŞUBE CİNAYET BÜRO\nTANIK İFADE VE SORGU TUTANAĞI\n\nİfade Veren: Niyazi Kalkan (54, Kandilli Yalısı Güvenlik Amiri)\nTarih: 19 Ekim 2026 - Saat 01:15\n\nCEVAP: "Saat 22:30’da Tarık Bey ön bahçe kapısından girdi, tartışma sesleri 22:50’ye kadar sürdü. Saat 23:00’te sahil ve müştemilat kameraları birden kesildi; o şalter kutusu müştemilat koridorunda ve anahtarı yalnızca Yadigar Usta ile Hikmet Bey’in çalışma odasındaki yedek anahtarlıkta durur. Saat 23:25’te kulübenin yan penceresinden baktığımda Banu Hanım’ın arka sahil kapısından elinde siyah büyük bir deri çantayla çıkıp bekleyen taksiye bindiğini gördüm. Ayrıca 23:02 sularında sahil iskelesi tarafındaki çalılıklardan koyu renk paltolu, elinde doktor çantasına benzer bir çanta taşıyan bir adamın geçtiğini de hayal meyal seçtim."',
        keyDeduction: 'Kamera kesintisi saat 23:00’te yapılmıştır. Aynı gece 23:00-23:25 aralığında Tarık, Banu, Yadigar ve doktor çantalı bir şahıs yalı çevresinde bulunmuştur.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka1/ev-1-3.mp3',
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
        title: 'Adli Tıp Toksikoloji Raporu: Digitalis & Kapsül Kalıntısı',
        category: 'toxicology',
        roleAccess: ['forensics', 'cryptology', 'profiler', 'field'],
        summary: 'Maktulün kanında ve kırık fincanda 4.8 mg/L saflaştırılmış Digitalis tespit edildi. Etki süresi 20-30 dakika olup acı tat melisa çayıyla gizlenmiş.',
        fullReport: 'Adli Tıp Kurumu Toksikoloji İhtisas Dairesi Raporu:\nMaktulün mide içeriğinde ve masadaki kırık fincanda 4.8 mg/L oranında Digoksin/Digitalis glikozidi tespit edilmiştir. Bu doz normal tedavi dozunun 10 katı olup oral alımdan 20-30 dakika sonra ventriküler fibrilasyona yol açar. Zehrin keskin acı tadı yoğun aromatik melisa çayı ile maskelenmiştir. Laboratuvar analizine göre kullanılan bileşen, piyasada satılan standart kalp haplarının ezilmiş hali değildir; doğrudan bitki tohumundan veya saf laboratuvar stokundan ekstrakte edilmiş yüksek saflıkta sıvı/kristal formdur.',
        keyDeduction: 'Zehir standart ezilmiş kalp hapı değil, saflaştırılmış ekstrakt formundadır ve ölümden 20-30 dakika önce (23:10-23:20 aralığında) içilmiştir.',
        mediaType: 'image',
        mediaUrl: '/cases/vaka1/toksikoloji-cay.png',
        mediaCaption: 'Adli Toksikoloji Kanıtı: Kırık fincan örneği ve melisa çayı kalıntısı',
        narrationUrl: '/cases/vaka1/ev-2-1.mp3',
        metadata: {
          date: '19 Ekim 2026',
          caseRef: 'TOX-408',
          confidentiality: 'ADLİ TIP RAPORU',
        }
      },
      {
        id: 'ev-2-2',
        envelope: 2,
        title: 'HTS, PTS ve Sorgu Tutanağı: Banu Ulusoy & Dr. Selim Koray',
        category: 'interrogation',
        roleAccess: ['profiler', 'field', 'archive', 'forensics'],
        summary: 'HTS kayıtları Banu’nun 23:20’de yalıda, Dr. Selim’in ise 22:58’de Kandilli baz istasyonunda olduğunu kanıtladı. İki şüpheli de alibilerini değiştirmek zorunda kaldı.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ CİNAYET BÜRO AMİRLİĞİ\nÇAPRAZ SORGU TUTANAĞI\n\n1. Şüpheli Banu Ulusoy:\nBebek’te olduğunu iddia etmesine rağmen HTS ve taksi plaka kayıtları 23:15-23:25 arası Kandilli Yalısı’nda olduğunu ortaya koyunca ifadesini değiştirdi: "Tamam, 23:20’de yukarı çıktım! Hikmet koltukta nefes almakta zorlanıyordu. Kasa açıktı değil, şifreyi girip bana ait sahte ekspertiz dosyalarını ve evlilik öncesi mektuplarımı siyah çantama koydum. Hançer o an kutusunda duruyordu!"\n\n2. Şüpheli Dr. Selim Koray:\nBaz istasyonu kaydı 22:55-23:15 arası Kandilli sahil hattında çıkınca kabul etti: "23:00’te arka bahçe kapısından gizlice girdim çünkü Hikmet beni vakıf denetimi için çağırmıştı. Tansiyonunu ölçüp tartışmadan sonra 23:08’de ayrıldım. Çayına dokunmadım, ben çıktığımda yaşıyordu."',
        keyDeduction: 'Hem Banu hem Dr. Selim olay saatinde yalıda bulunduklarını gizlemişlerdir; ikisinin de odaya ve ilaç/kasa bilgilerine erişimi vardır.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka1/ev-2-2.mp3',
        metadata: {
          date: '19 Ekim 2026',
          caseRef: 'SORGU-HTS-02',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-2-3',
        envelope: 2,
        title: 'Cinayet Büro Çapraz Sorgu & PTS Kaydı: Tarık Ulusoy',
        category: 'interrogation',
        roleAccess: ['profiler', 'archive', 'field', 'forensics', 'cryptology'],
        summary: 'Tarık’ın ceketindeki çay lekesi ilk tartışmadan kalma temiz çay çıktı; ancak aracının PTS kaydı 23:28’e kadar yalı sokağında beklediğini gösteriyor.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ CİNAYET BÜRO\nÇAPRAZ SORGU TUTANAĞI\n\nŞüpheli: Tarık Ulusoy (36)\nSORU: 23:05’te evden ayrıldığınızı söylediniz ama Kandilli Sahil PTS kamerası aracınızı saat 23:28’de çıkış yaparken kaydetmiş. Ayrıca ceketinizdeki çay lekesi ne zaman oluştu?\nCEVAP: "22:50’de tartışırken babam ilk fincanı üzerime fırlattı, ben 23:05’te kapıdan çıktım; merdivende Yadigar elinde taze demlikle yukarı çıkıyordu! Sonra sahildeki tefeci kuryesiyle buluşmak için sokakta arabada 20 dakika bekledim. İçeri bir daha girmedim!"\n\nKriminal Not: Tarık’ın ceketindeki leke melisa çayı olup zehir konsantrasyonu saptanmamıştır. Ancak kasa şifresinin Tarık tarafından da bilindiği ve 23:05-23:28 arası yalıya tekrar girme ihtimali soruşturma dosyasında açık tutulmuştur.',
        keyDeduction: 'İlk fincan temizdir; ölümcül zehir 23:05’ten sonra verilen ikinci çayla ya da 23:10-23:25 arasında odada bulunan şüphelilerden biri tarafından verilmiştir.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka1/ev-2-3.mp3',
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
        title: 'Restorasyon Atölyesi, Şömine Külleri & Vakıf Arşivi Raporu',
        category: 'document',
        roleAccess: ['cryptology', 'archive', 'forensics', 'profiler', 'field'],
        summary: 'Atölyede reçine hançer replikası, bitkisel çay kavanozunda digitalis izi, Alman botanik faturası ve şöminede "HNC-18-REPLİKA" kodlu yanmış ekspertiz kağıdı bulundu.',
        fullReport: 'Kriminalistik Arama ve Mali İstihbarat Özeti:\n1. Yadigar Çelik’in kilitli atölye dolabında maktulün içtiği "Tansiyon Bitki Çayı" kavanozunun dibinde yüksek saflıkta Digitalis kristali ve 4 ay önce bir Alman botanik firmasından "tahta kurdu verniği katkısı" adıyla alınmış Digitalis purpurea tohumu faturası bulundu.\n2. Atölye tezgâhının altında zümrüt hançerin reçine-zirkon replikası ele geçirildi; orijinal hançerin 2 hafta önce Zürih’e kargolandığı ve Yadigar’ın Zürih hesabına 2.4 Milyon Euro yattığı saptandı.\n3. Şömine küllerinden kurtarılan yanmış ekspertiz notunda yalnızca şu satır okunabildi: "...Kasa kodu 1964... HNC-18-REPLİKA tespiti kesinleşti, pazartesi savcılık..."\n4. Öte yandan, Dr. Selim’in vakıf laboratuvarında da saf digoksin stokunun kayıp olduğu ve Banu’nun çantasında 3 adet sahte tablo ekspertiz belgesi çıktığı not edildi.',
        keyDeduction: 'Atölyedeki çay kavanozu, saflaştırılmış tohum faturası, reçine hançer replikası ve şöminedeki ekspertiz kodu birbirini tamamlamaktadır; diğer şüphelilerin de kendi gizli suçları nedeniyle paniklediği görülmektedir.',
        mediaType: 'image',
        mediaUrl: '/cases/vaka1/atolye-hancer.png',
        mediaCaption: 'Delil Fotoğrafı #3: Atölyedeki reçine hançer replikası ve tansiyon çayı kavanozu',
        narrationUrl: '/cases/vaka1/ev-3-1.mp3',
        metadata: {
          date: '20 Ekim 2026',
          caseRef: 'KRM-YADIGAR',
          confidentiality: 'ÇOK GİZLİ',
        }
      },
      {
        id: 'ev-3-2',
        envelope: 3,
        title: 'Cinayet Büro Son Çapraz Sorgu: Yadigar Çelik',
        category: 'interrogation',
        roleAccess: ['profiler', 'forensics', 'archive'],
        summary: 'Yadigar Çelik; botanik faturasını cila malzemesi, İsviçre hesabını ise restorasyon primi diyerek savundu ve diğer üç şüphelinin saat 23:00-23:25 arası yalıda oluşunu öne sürdü.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ CİNAYET BÜRO AMİRLİĞİ\nSON ÇAPRAZ SORGU TUTANAĞI\n\nŞüpheli: Yadigar Çelik (57)\nCEVAP: "O reçine hançer Hikmet Bey’in müze sergisi için bizzat yaptırdığı bir kopyaydı! Digitalis tohumunu ceviz kütüphanedeki tahta kurtları için cila karışımı diye aldım; çay kavanozuna nasıl karıştı bilmiyorum! Ben saat 23:10’da çayı bırakıp müştemilata indim. Benden önce saat 23:00’te Dr. Selim gizlice odaya girmiş; digoksinin uzmanı bir kalp doktoru dururken neden bana bakıyorsunuz? Üstelik 23:20’de Banu Hanım kasayı açıp kaçtı, Tarık Bey de 23:28’e kadar sokağın başında bekledi. Herkesin yalıda olduğu bir gecede suçu 30 yıllık emektara yıkamazsınız!"',
        keyDeduction: 'Dört şüphelinin de saat 23:00-23:28 penceresinde yalıya erişimi ve güçlü motifi vardır; ancak saflaştırılmış tohum ekstraksiyonu faturası + çay kavanozundaki kalıntı + 23:10 çay servisi + şalter anahtarı + sahte replika hançer kesişimi incelenmelidir.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka1/ev-3-2.mp3',
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
        title: 'Zarf 1 Doğrulama Sorusu: Olay Yeri ve Kamera Zamanlaması',
        instructions: 'Zarf 1 belgelerini birleştirerek olay gecesi zaman çizelgesindeki kritik tespiti seçin.',
        question: 'Olay yeri tutanağı ve Bekçi Niyazi’nin ifadesi birlikte değerlendirildiğinde saat 23:00 itibarıyla ne gerçekleşmiştir?',
        options: [
          { id: 'q1-1', text: 'Zorla giriş olmadan şifreli kasa açılmış, sahil kameraları şalterden kesilmiş ve fincandaki çayla zehirlenme yaşanmıştır.', isCorrect: true },
          { id: 'q1-2', text: 'Dışarıdan giren silahlı soyguncular güvenlik kulübesinin elektrik hattını kesip maktulü darp etmiştir.', isCorrect: false },
          { id: 'q1-3', text: 'Kasa şifresi kırılmış ve zehirli madde saat 22:30’dan önce kapı koluna sürülerek etki göstermiştir.', isCorrect: false }
        ],
        explanation: 'Zorlama izi yoktur; kasa şifreyle açılmış, sahil kamerası şalterden kesilmiş ve zehir fincandaki çayla alınmıştır.'
      },
      2: {
        envelope: 2,
        title: 'Zarf 2 Doğrulama Sorusu: Zehir Formu ve Alibi Çelişkileri',
        instructions: 'Toksikoloji raporu ile HTS/PTS sorgularını birlikte analiz edin.',
        question: 'Adli tıp raporuna ve sorgu tutanaklarına göre zehrin niteliği ve veriliş aralığı hakkında hangisi doğrudur?',
        options: [
          { id: 'q2-1', text: 'Zehir standart hap değil saflaştırılmış ekstraktır; Tarık’ın ceketindeki ilk çay temizdir ve ölümcül çay 23:05 sonrasında içilmiştir.', isCorrect: true },
          { id: 'q2-2', text: 'Dr. Selim’in yazdığı standart kalp hapları maktul tarafından yanlışlıkla yüksek dozda yutulmuştur.', isCorrect: false },
          { id: 'q2-3', text: 'Zehir 22:50’deki tartışma sırasında dökülen ilk fincandaki çayın içinde tespit edilmiştir.', isCorrect: false }
        ],
        explanation: 'İlk fincan temizdir ve zehir ezilmiş hap değil, 23:05 sonrasında servis edilen içecekte kullanılan saflaştırılmış ekstrakttır.'
      },
      3: {
        envelope: 3,
        title: 'Zarf 3 Doğrulama Sorusu: Şömine Notu ve Atölye Bulguları',
        instructions: 'Atölye araması ve şömine külleri raporundaki teknik bağlantıyı doğrulayın.',
        question: 'Atölyede ele geçirilen bulgular ile şömine küllerinden kurtarılan yanmış ekspertiz notu arasındaki bağ nedir?',
        options: [
          { id: 'q3-1', text: 'Maktul kasadaki hançerin sahte replika olduğunu tespit edip savcılık notu hazırlamış, atölyedeki çay kavanozunda ise zehir kalıntısı çıkmıştır.', isCorrect: true },
          { id: 'q3-2', text: 'Şöminede yakılan belge Dr. Selim’in vakıf bütçesine ait imzalı rüşvet sözleşmesidir.', isCorrect: false },
          { id: 'q3-3', text: 'Atölyede bulunan reçine hançer, Tarık’ın tefecilere rehin bırakmak için yaptırdığı kopyadır.', isCorrect: false }
        ],
        explanation: 'Şöminedeki yanmış ekspertiz notu sahte hançer replikasına işaret etmekte, çay kavanozu ise saflaştırılmış digitalisi doğrulamaktadır.'
      }
    },
    solution: {
      culpritId: 'yadigar-celik',
      culpritName: 'Yadigar Çelik',
      motiveTitle: 'Milyonluk Sahte Antika Vurgununun İfşa Olmasını Önlemek',
      keyEvidenceTitle: 'Restorasyon Atölyesi, Şömine Külleri & Vakıf Arşivi Raporu',
      fullChronology: [
        { time: '21:00', action: 'Hikmet Ulusoy, kasadaki hançerin reçine replika olduğunu mikroskopla tespit eder ve pazartesi savcılığa başvuracağını belirten ekspertiz notunu hazırlar.', proof: 'Şömineden kurtarılan yanmış ekspertiz kodu' },
        { time: '22:30 - 23:05', action: 'Tarık Ulusoy babasıyla tartışır; ceketine zehirsiz ilk çay sıçrar. 23:05’te evden çıkar ama tefeci kuryesi için 23:28’e kadar sokakta bekler.', proof: 'PTS kaydı & Tarık’ın ceket analizi' },
        { time: '23:00 - 23:08', action: 'Yadigar müştemilattaki şalterden sahil kamerasını keser. Aynı dakikalarda Dr. Selim arka kapıdan gizlice girip vakıf denetimi için Hikmet’le görüşür ve 23:08’de ayrılır.', proof: 'HTS kaydı & Bekçi Niyazi ifadesi' },
        { time: '23:10', action: 'Yadigar, tansiyon çayı kavanozundaki saflaştırılmış digitalis ile hazırladığı ikinci taze çayı Hikmet’e sunar.', proof: 'Toksikoloji Raporu & Alman tohum faturası' },
        { time: '23:20 - 23:25', action: 'Banu Ulusoy gizlice yukarı çıkıp kasadaki sahte sertifikalarını ve mektuplarını siyah çantasına alır; yarı baygın Hikmet’i görüp taksiyle kaçar.', proof: 'HTS kaydı & Banu çapraz sorgusu' },
        { time: '23:40 - 23:52', action: 'Hikmet ölür. Yadigar replika hançeri atölyeye saklar, ekspertiz notunu şöminede yakar ve 23:52’de 112’yi arar.', proof: 'Atölye araması & 112 Ses Kaydı' }
      ],
      verdictSummary: 'Katil Yadigar Çelik’tir. Banu sahte sertifikalarını almak için kasayı açmış, Tarık borçları yüzünden sokakta beklemiş, Dr. Selim vakıf usulsüzlüğü nedeniyle yalıya gizlice uğramıştı; ancak saflaştırılmış digitalisi çay kavanozuna koyup 23:10’da servis eden ve hançerin orijinalini Zürih’e satan kişi Yadigar’dır.',
      confessionAudioTranscript: 'İtiraf Ses Kaydı: "30 yılımı verdim o yalıya... Herkes kendi günahı yüzünden panik halindeydi, ben de bunu kullandım. Gerçek hançeri Zürih’e göndermiştim; Hikmet replikayı anlayınca başka çarem kalmadı."',
      confessionLetter: `[ADLİ EMANET KASASI - YADİGAR ÇELİK'İN İTİRAF METNİ]

"Evet, Hikmet'i ben zehirledim. 30 yıl boyunca onun kırdığı, sattığı her eseri ben onardım ama kazancın kırıntısını bile bana layık görmedi.

İki hafta önce orijinal zümrüt hançeri Zürih'teki alıcıya gönderip kasaya kendi ürettiğim kusursuz reçine replikayı koydum. Ama Hikmet cuma akşamı büyüteçle replikayı fark etti ve pazartesi savcılığa gideceğini söyleyerek ekspertiz notunu masasına koydu.

O gece şans bana yardım etti: Tarık içeride kavga ediyordu, Dr. Selim arka kapıdan gizlice gelmişti, Banu Hanım da kendi sahte sertifikalarının peşindeydi. Saat 23:00'te şalteri indirdim, 23:10'da Alman tohumlarından saflaştırdığım digitalisi tansiyon çayına katıp yukarı bıraktım. Banu Hanım kendi evraklarını alıp kaçtıktan sonra replika hançeri atölyeye sakladım ve ekspertiz notunu şömineye attım. Herkesin yalıda olduğu o gecede kimse benden şüphelenmez sanmıştım."`
    }
  },

  // =========================================================================
  // VAKA 2: KULİSİN GİZEMLİ PERDESİ
  // =========================================================================
  {
    id: 'kulisin-gizemli-perdesi',
    title: 'Kulisin Gizemli Perdesi',
    subtitle: 'Prömiyer Gecesinde Başrol Oyuncusuna Suikast ve Sahne Arkası İhaneti',
    difficulty: 'Orta',
    estimatedMinutes: 30,
    minPlayers: 1,
    maxPlayers: 6,
    totalEnvelopes: 3,
    bannerTag: 'TİYATRO NOIR · SES KAYITLI & SAHNE ARKASI',
    synopsis:
      'Kadıköy Şehir Tiyatrosu’nda sezonun büyük prömiyeri oynanırken, başrol oyuncusu ve yönetmen Altan Saygın (44), ikinci perde başlamadan hemen önce kulisteki soyunma odasında ölü bulundu. Kral Lear kostümünün yakasındaki antika broşta ölümcül nörotoksin saptandı. Aynadaki ruj yazısı, kayıp sahne anahtarı ve Londra’ya kaçırılan milyonluk fonun gölgesinde kulisteki dört isim birbirini suçluyor.',
    victim: {
      name: 'Altan Saygın',
      age: 44,
      title: 'Devlet Tiyatrosu Başrol Oyuncusu & Sanat Yönetmeni',
      timeOfDeath: '24 Ekim Cuma, 21:12 suları',
      locationOfBody: 'Kadıköy Sahnesi, Başrol Soyunma Odası',
      causeInitial: 'Nörotoksin kaynaklı akut solunum felci ve kardiyak arrest',
    },
    suspects: [
      {
        id: 'melis-haznedar',
        name: 'Melis Haznedar',
        title: 'Genç Kadın Başrol (Eski Sevgili)',
        age: 29,
        relation: 'Eski Sevgili & Sahne Partneri',
        description:
          'Altan ile 1 yıl süren gizli bir ilişki yaşamış, ancak Altan’ın onu yeni sezonda kadro dışı bırakıp özel yazışmalarını ifşa etmekle tehdit ettiğini öğrenmişti. Perde arasında elinde terzi makasıyla Altan’ın odasından çıkarken görüldü.',
        alibi: 'Saat 20:50’de odadan çıkıp doğrudan fuayeye indiğini, odaya bir daha dönmediğini iddia ediyor.',
        suspiciousQuotes: [
          '"Odasına girdim ve bana aldığı ipek atkıyı gözünün önünde makasla kestim ama zehirle alakam yok!"',
          '"Bordo mat rujum üç gün önce makyaj masasında kaybolmuştu, aynaya o yazıyı ben yazmadım."',
          '"Saat 21:05 civarı tuvalet koridorundaydım, kimseyi görmedim."'
        ],
        motiveHypothesis: 'Kariyerini ve itibarını kurtarmak için şantajcı eski partnerini susturmak.',
        initialSuspicion: 70,
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
        relation: '20 Yıllık Konservatuvar Arkadaşı & Yedek Başrol',
        description:
          '20 yıldır Altan’ın gölgesinde kalan kıskanç bir oyuncu. Prömiyer gecesi Altan’ın odasının önünde tartışırken görüldü; dolabında parçalanmış yedek pelerin ve sahne arkası ortak anahtar seti bulundu.',
        alibi: 'Kapı içeriden kilitli olduğu için odaya hiç giremediğini, kendi odasında ses açtığını iddia ediyor.',
        suspiciousQuotes: [
          '"Yedek pelerini sinirden parçaladım, evet! Sahneye çıkamasın istedim ama kapı kilitliydi!"',
          '"Eski bir aktör olarak sahne malzemeleri dolabının anahtarı bende de vardı ama zehir kullanmadım."',
          '"Altan ölünce ikinci perdede rolü benim devralacağım doğru, ama bunu ben planlamadım."'
        ],
        motiveHypothesis: '20 yıllık gölgeden çıkıp prömiyer başrolünü devralmak ve Altan’dan intikam almak.',
        initialSuspicion: 75,
        photoPlaceholder: {
          initials: 'CE',
          tint: 'from-zinc-950 to-neutral-900',
          silhouetteStyle: 'bg-zinc-800 border-zinc-600 text-zinc-300'
        }
      },
      {
        id: 'orhan-karahan',
        name: 'Orhan Karahan',
        title: 'Tiyatro Yapımcısı & Mali Ortak',
        age: 53,
        relation: 'Tiyatro Ortaklarından & Prodüksiyon Finansörü',
        description:
          'Altan’ın tiyatro kasasından 8 Milyon TL’lik devlet desteğini Londra’ya kaçıracağını öğrenince iflasın eşiğine geldi. İki hafta önce Altan adına 12 Milyon TL’lik "Başrol Hayati Risk Sigortası" poliçesi yaptırdığı ortaya çıktı.',
        alibi: 'Perde arasında VIP locada kültür bakanlığı temsilcilerini ağırladığını söylüyor.',
        suspiciousQuotes: [
          '"O sigorta poliçesi turne sözleşmesi için zorunluydu, cinayetle ilgisi yok!"',
          '"Saat 21:02’de kulis koridorundan sadece muhasebe evrakı almak için geçtim."',
          '"Altan Londra’ya kaçsaydı tiyatro da ben de hacizle biterdik, ama ben iş insanıyım, katil değil."'
        ],
        motiveHypothesis: '8 Milyon TL’lik kaçışı durdurmak ve 12 Milyon TL’lik sigorta tazminatıyla tiyatroyu kurtarmak.',
        initialSuspicion: 65,
        photoPlaceholder: {
          initials: 'OK',
          tint: 'from-blue-950 to-slate-900',
          silhouetteStyle: 'bg-blue-900/30 border-blue-600/40 text-blue-300'
        }
      },
      {
        id: 'gulfem-saygin',
        name: 'Gülfem Saygın',
        title: 'Baş Kostüm Tasarımcısı & Altan’ın Resmi Eşi',
        age: 46,
        relation: 'Eşi (15 Yıllık Evli & Tiyatronun Baş Kostümcüsü)',
        description:
          'Tiyatronun tüm kostüm ve aksesuarlarını yöneten deneyimli tasarımcı. Altan’ın hem evliliğini hem de tiyatronun bütün birikimini Londra’ya kaçıracağını öğrenmişti.',
        alibi: 'Saat 20:55’te broşu takıp çıktıktan sonra dikiş atölyesinde figüran şapkalarını onardığını belirtiyor.',
        suspiciousQuotes: [
          '"Altan’ın kostümlerini 15 yıldır ben dikerim; broşunu yakasına her zamanki gibi 20:55’te ben taktım."',
          '"Atölyemdeki arı balmumu, tarihi kadife yakaları sertleştirmek için kullandığım mesleki malzemedir."',
          '"O gece odasına benden sonra kimin girdiğini bilmiyorum; koridor anahtarı kuliste herkeste var."'
        ],
        motiveHypothesis: 'Tiyatronun sermayesini ve 15 yıllık emeğini Londra’ya kaçıran eşini sahnede durdurmak.',
        initialSuspicion: 55,
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
        title: 'Soyunma Odası Olay Yeri Raporu & Aynadaki Ruj Yazısı',
        category: 'document',
        roleAccess: ['forensics', 'profiler', 'ballistics', 'field'],
        summary: 'Altan Saygın makyaj koltuğunda ölü bulundu. Kral broşunun iğnesinde jel tortusu var; aynada ise "GURURUN SONUN OLACAK" yazılı.',
        fullReport: 'Kadıköy İlçe Emniyet Olay Yeri İnceleme Raporu:\n24 Ekim saat 21:15’te sahne amirinin ihbarıyla odaya girilmiştir. Altan Saygın Kral Lear kostümü içinde koltuğa yığılmış ve solunum durması sonucu hayatını kaybetmiştir. Yaka broşunun boyna bakan iğne ucunda mikroskobik reçine/jel kalıntısı görülmüştür. Makyaj aynasında bordo mat rujla yazılmış "GURURUN SONUN OLACAK" ibaresi mevcuttur. Kritik bulgu: Aynadaki su buharı ve ruj yağının dağılımı, yazının sıcak su ısıtıcısı açıkken yani Altan yere yığıldıktan hemen sonra (21:05-21:12 arası) yazıldığını göstermektedir.',
        keyDeduction: 'Ölüm broş iğnesindeki toksinle gerçekleşmiştir; aynadaki ruj yazısı ise Altan kostümü giydikten sonra, hedef şaşırtmak için sonradan yazılmış olabilir.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Olay Yeri Fotoğrafı: Makyaj aynasındaki ruj yazısı ve kral kostümü',
        narrationUrl: '/cases/vaka2/ev-2-1-1.mp3',
        metadata: {
          date: '24 Ekim 2026',
          caseRef: 'TYT-01',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-2-1-2',
        envelope: 1,
        title: 'Sahne Arkası İnterkom Ses Kaydı',
        category: 'audio',
        roleAccess: ['cryptology', 'profiler', 'archive'],
        summary: 'Perde arasında interkom telsizine takılan sesler: 20:52’de Caner ile tartışma ve 20:56’da odada sakin bir konuşma.',
        fullReport: 'Ses Kaydı Analizi #T-02:\n[20:52 - Koridor]: Caner (kapı dışından): "Bunu yapamazsın Altan, bu rol benim hakkımdı!"\nAltan (içeriden kapıyı kilitleyerek): "Haddini bil Caner. Londra biletlerim hazır, yarın bu tiyatroda ne sen kalacaksın ne diğerleri!"\n[20:56 - Oda İçi]: Altan kilidi açtıktan sonra Kadın Sesi (soğukkanlı): "Bu kostüm sana çok yakışacak Altan... Son sahnende herkes seni konuşacak."\n[21:02 - Koridor]: Ayak sesleri ve yapımcı Orhan’ın sesi: "Altan, imza evrakını masana bıraktım, Londra işini unut!"',
        keyDeduction: 'Odaya 20:50-21:05 arasında birden fazla şüpheli erişmiştir; kapı 20:55 sonrası açık kalmıştır.',
        mediaType: 'audio',
        mediaUrl: '/cases/vaka2/interkom-kaydi.mp3',
        mediaCaption: 'İnterkom Telsiz Bandı: 20:52 - 21:02 kulis kayıtları',
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
        summary: 'Sahne Amiri Rıza’nın zaman çizelgesi: 20:45 Melis, 20:52 Caner, 20:55 Gülfem, 21:02 Orhan kulis koridorunda görüldü.',
        fullReport: 'T.C. KADIKÖY İLÇE EMNİYET MÜDÜRLÜĞÜ\nTANIK İFADE TUTANAĞI\n\nTanık: Rıza Kurtuluş (51, Baş Sahne Amiri)\nCEVAP: "20:45’te Melis Hanım elinde makasla ağlayarak odaya daldı, 20:50’de çıktı. 20:52’de Caner kapıyı yumrukladı ama Altan içeriden sürgülemişti. 20:55’te Gülfem Hanım dikiş sepetiyle geldi, Altan kapıyı ona açtı; Gülfem Hanım broşu yakasına takıp 21:00’de çıktı. 21:02’de yapımcı Orhan Bey elinde bir dosya ile koridordan Altan’ın kapısına yürüdü. Saat 21:06 civarı ise tuvalet kapısı tarafından Melis Hanım’ın tekrar bu koridora doğru baktığını gördüm. 21:15’te anons için girdiğimde Altan cansız yatıyordu."',
        keyDeduction: 'Dört şüphelinin de 20:45-21:08 arasında soyunma odasına ve koridora fiili erişimi vardır.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka2/ev-2-1-3.mp3',
        metadata: {
          date: '24 Ekim 2026',
          caseRef: 'SORGU-AMİR-01',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-2-2-1',
        envelope: 2,
        title: 'Mikroskobik Toksin Analizi: 37.2°C Balmumu Kapsülü',
        category: 'toxicology',
        roleAccess: ['forensics', 'ballistics', 'profiler', 'field'],
        summary: 'Broş iğnesine mikro kanallar açılıp 37.2°C vücut ısısında 10-12 dakikada eriyen özel arı balmumu kapsülü yerleştirilmiş.',
        fullReport: 'Kriminal Kimya ve Lif İhtisas Raporu:\nBroş iğnesindeki kurar-türevi nörotoksin, iğne gövdesine mikroskop altında açılan 0.3 mm’lik kanallara doldurulmuş ve doğal arı balmumu-reçine karışımıyla mühürlenmiştir. Deneysel simülasyona göre boyun derisi 37.2 derece sıcaklığa ulaştığında balmumu tam 10-12 dakika içinde eriyerek toksini serbest bırakmaktadır. Altan’ın ölüm saati 21:12 olduğuna göre broş boyna yaklaşık 20:58-21:02 aralığında temas etmiştir. Ayrıca broş klipsinin arka yüzeyinde sol el başparmak kavrama izi saptanmıştır.',
        keyDeduction: 'Broşun hazırlanması mikro-terzilik ve arı balmumu bilgisi gerektirir; temas ise 20:58-21:02 aralığında başlamıştır.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Mikroskop Fotoğrafı: Broş iğnesindeki mikro-kanallı balmumu kapsülü',
        narrationUrl: '/cases/vaka2/ev-2-2-1.mp3',
        metadata: {
          date: '25 Ekim 2026',
          caseRef: 'KRM-TOX-02',
          confidentiality: 'ADLİ TIP RAPORU',
        }
      },
      {
        id: 'ev-2-2-2',
        envelope: 2,
        title: 'Sorgu Tutanağı: Caner Ertekin & Yapımcı Orhan Karahan',
        category: 'interrogation',
        roleAccess: ['profiler', 'field', 'archive', 'forensics'],
        summary: 'Caner’in dolabında parçalanmış pelerin ve yedek kulis anahtarı; Orhan’ın odasında ise Altan adına yapılmış 12 Milyon TL’lik sigorta poliçesi bulundu.',
        fullReport: 'T.C. KADIKÖY ASAYİŞ ŞUBE CİNAYET MASASI\nÇAPRAZ SORGU TUTANAĞI\n\n1. Caner Ertekin (47):\nDolabında parçalanmış yedek pelerin ve tüm kulis odalarını açan yedek anahtar bulundu. Caner: "Anahtarı kostümün yedeklerini kesmek için aldım, broşa dokunmadım!" dedi. İfadesinde makyaj masası suyuna uyku ilacı karıştırmayı düşündüğünü ancak vazgeçtiğini söyledi.\n\n2. Orhan Karahan (53):\nTiyatronun kasasından 8 Milyon TL kaçırıldığını doğrulayan banka ekstreleri ve Altan’ın ölümü halinde yapımcıya 12 Milyon TL ödeyen sigorta poliçesi ele geçirildi. Orhan: "21:02’de sadece fesih protokolü imzalatmak için kapıdan baktım, Altan broşunu yeni takmıştı, yalnızdı" dedi.',
        keyDeduction: 'Caner’de tüm odaları açan anahtar ve sahne sabotajı motifi, Orhan’da ise 12 Milyon TL’lik sigorta tazminatı ve 21:02 oda erişimi vardır.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka2/ev-2-2-2.mp3',
        metadata: {
          date: '25 Ekim 2026',
          caseRef: 'SORGU-CANER-ORHAN',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-2-2-3',
        envelope: 2,
        title: 'Sorgu Tutanağı & Ruj Ekspertizi: Melis Haznedar',
        category: 'interrogation',
        roleAccess: ['profiler', 'field', 'archive', 'forensics', 'cryptology'],
        summary: 'Aynadaki ruj Melis’e ait çıktı; Melis 21:06’da tekrar koridorda görüldüğünü kabul etmek zorunda kaldı ancak yazıyı kendisinin yazmadığını savundu.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ CİNAYET BÜRO\nŞÜPHELİ SORGU ZAPTI\n\nŞüpheli: Melis Haznedar (29)\nSORU: 20:50’de ayrıldığınızı söylediniz ama sahne amiri sizi 21:06’da tekrar koridorda görmüş. Aynadaki bordo mat ruj da sizin markanızla eşleşti!\nCEVAP: "21:06’da unuttuğum telefonumu almak için koridora döndüm ama odaya girmedim! Atkıyı makasla kestiğimi inkâr etmiyorum. O ruju üç gün önce kuliste kaybetmiştim! Aynadaki yazıya dikkatli bakın, harflerin eğimi benim el yazım değil!"\n\nKriminal Not: Aynadaki ruj yazısı sol eğimli baskı izi taşımaktadır; rujun dış kılıfında ise silinmiş parmak izi mevcuttur.',
        keyDeduction: 'Melis saat 21:06’da koridorda bulunmuştur ve ruj kendisine aittir; ancak ruj yazısının el eğimi solak bir kullanıma işaret etmektedir.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka2/ev-2-2-3.mp3',
        metadata: {
          date: '25 Ekim 2026',
          caseRef: 'SORGU-MELIS-02',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-2-3-1',
        envelope: 3,
        title: 'Mali Şube, Dikiş Atölyesi & El Yazısı Kriminal Raporu',
        category: 'document',
        roleAccess: ['archive', 'profiler', 'cryptology', 'forensics', 'field'],
        summary: 'Gülfem’in kilitli iplik kutusunda 37.2°C özel balmumu eriticisi ve broş mikro-delme aparatı; şüpheliler arasında el baskınlık analizi tamamlandı.',
        fullReport: 'Emniyet Mali Şube ve Kriminal Ekspertiz Raporu:\n1. Altan’ın valizinde 8 Milyon TL’lik Londra transfer dekontu ve ertesi sabah 06:30 uçuş bileti bulundu.\n2. Gülfem Saygın’ın kilitli iplik kutusunda iğne mikro-delme ucu ile aynı erime derecesine (37.2°C) ayarlı balmumu karışımı ve eser miktarda nörotoksin kalıntısı tespit edildi.\n3. Kriminal El Analizi: Aynadaki "GURURUN SONUN OLACAK" yazısı solak bir el tarafından hızlıca yazılmıştır. Şüphelilerden Melis sağlak, Orhan sağlak, Caner ise her iki elini kullanan (ambidextrous) bir oyuncudur; Gülfem ise doğuştan solaktır.',
        keyDeduction: 'Atölyedeki mikro-delme aparatı ve 37.2°C özel balmumu karışımı broş düzeneğiyle eşleşmektedir; aynadaki yazı ise solak bir el tarafından Altan’ın çöküşü sırasında yazılmıştır.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka2/ev-2-3-1.mp3',
        metadata: {
          date: '25 Ekim 2026',
          caseRef: 'MALİ-GULFEM',
          confidentiality: 'ÇOK GİZLİ',
        }
      },
      {
        id: 'ev-2-3-2',
        envelope: 3,
        title: 'Son Çapraz Sorgu: Gülfem Saygın',
        category: 'interrogation',
        roleAccess: ['forensics', 'profiler', 'archive'],
        summary: 'Gülfem Saygın balmumu ve mikro-uçları tarihi kostüm restorasyonuna bağladı; Melis’in 21:06 koridor dönüşünü ve Orhan’ın 12 Milyon TL’lik sigortasını öne sürdü.',
        fullReport: 'T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ CİNAYET BÜRO\nSON ÇAPRAZ SORGU ZAPTI\n\nŞüpheli: Gülfem Saygın (46)\nCEVAP: "Tarihi kostümlerin yakasını sertleştirmek için balmumu ve ince iğne uçları kullanmam kadar doğal ne var? Zehir bulaşığı varsa bile Caner’de yedek anahtar vardı, atölyeme de girebilirdi! Caner iki elini de kullanabilen bir aktör değil mi? Ya da 12 Milyon TL sigorta tazminatı alacak olan Orhan Karahan’a, 21:06’da koridorda yakalanan ve aynada kendi ruju çıkan Melis’e neden aynı sertlikte bakmıyorsunuz? Ben 20:55’te broşu taktım ve çıktım!"',
        keyDeduction: 'Gülfem suçu Orhan’ın sigorta poliçesine, Caner’in anahtarına ve Melis’in rujuna yöneltmektedir; ancak 20:55’te broşu bizzat takması, 10-12 dakikalık erime penceresi (ölüm 21:12) ve özel 37.2°C balmumu karışımı kritik zamanlamayı oluşturmaktadır.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka2/ev-2-3-2.mp3',
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
        title: 'Zarf 1 Doğrulama Sorusu: Olay Yeri ve Zamanlama',
        instructions: 'Zarf 1 belgelerindeki ölüm sebebi ve ayna yazısı zamanlamasını değerlendirin.',
        question: 'Olay yeri raporuna göre zehrin bulaşma yolu ve aynadaki ruj yazısının zamanı hakkında hangisi doğrudur?',
        options: [
          { id: 'q1-1', text: 'Toksin broş iğnesinden boyun derisine geçmiştir; aynadaki yazı ise Altan yere yığıldıktan hemen sonra (21:05-21:12) yazılmıştır.', isCorrect: true },
          { id: 'q1-2', text: 'Toksin makyaj masası suyuna karıştırılmıştır; aynadaki yazı ise Altan odaya girmeden saat 20:45’te yazılmıştır.', isCorrect: false },
          { id: 'q1-3', text: 'Toksin sahne perdesindeki tozdan solunmuştur; aynadaki yazıyı Altan son nefesinde kendisi yazmıştır.', isCorrect: false }
        ],
        explanation: 'Su buharı analizi ruj yazısının 21:05-21:12 arasında sonradan yazıldığını, toksinin ise broş iğnesiyle verildiğini göstermektedir.'
      },
      2: {
        envelope: 2,
        title: 'Zarf 2 Doğrulama Sorusu: Termal Kapsül Penceresi',
        instructions: 'Mikroskobik toksin raporundaki erime süresini ölüm saatiyle (21:12) eşleştirin.',
        question: 'Broştaki 37.2°C balmumu kapsülünün 10-12 dakikalık erime süresi broşun ne zaman takıldığını gösterir?',
        options: [
          { id: 'q2-1', text: 'Broş saat 20:58-21:02 aralığında yakaya takılmış ve tam ikinci perde başlangıcında toksini serbest bırakmıştır.', isCorrect: true },
          { id: 'q2-2', text: 'Broş birinci perdeden önce saat 19:30’da takılmış ve oyun boyunca etkisiz kalmıştır.', isCorrect: false },
          { id: 'q2-3', text: 'Kapsül oda sıcaklığında kendiliğinden erimiş, broş yakaya takılmadan önce buharlaşmıştır.', isCorrect: false }
        ],
        explanation: '37.2°C vücut ısısında 10-12 dakikada eriyen kapsül, 20:58-21:02 temas başlangıcıyla 21:12 ölüm saatini birebir açıklar.'
      },
      3: {
        envelope: 3,
        title: 'Zarf 3 Doğrulama Sorusu: Teknik Düzenek ve Şaşırtmaca',
        instructions: 'Zarf 3’teki atölye ve el yazısı analizini birleştirin.',
        question: 'Kriminal raporlar aynadaki ruj yazısı ve mikro-kanallı broş düzeneği hakkında hangi sonucu ortaya koymuştur?',
        options: [
          { id: 'q3-1', text: '37.2°C özel balmumu karışımı ve mikro-delme ucu dikiş atölyesinde bulunmuş, aynadaki yazı ise hedef saptırmak için sol elle yazılmıştır.', isCorrect: true },
          { id: 'q3-2', text: '12 Milyon TL’lik sigorta poliçesi broş iğnesinin Orhan Karahan tarafından üretildiğini kesinleştirmiştir.', isCorrect: false },
          { id: 'q3-3', text: 'Melis Haznedar’ın sağ eliyle yazdığı tehdit notu, yedek pelerin kesimiyle aynı anda gerçekleşmiştir.', isCorrect: false }
        ],
        explanation: 'Mikro-delme aparatı ve 37.2°C özel balmumu Gülfem’in kilitli kutusundan çıkmış, sol el yazısı ise Melis’in rujuyla hedef şaşırtmak için yazılmıştır.'
      }
    },
    solution: {
      culpritId: 'gulfem-saygin',
      culpritName: 'Gülfem Saygın',
      motiveTitle: 'Tiyatronun Milyonluk Fonlarını Kurtarmak & İhanet İntikamı',
      keyEvidenceTitle: 'Mali Şube, Dikiş Atölyesi & El Yazısı Kriminal Raporu',
      fullChronology: [
        { time: '19:30', action: 'Gülfem Saygın, dikiş atölyesindeki mikro-delme ucuyla broş iğnesini işler ve 37.2°C’de eriyen özel balmumu kapsülünü yerleştirir.', proof: 'Dikiş Atölyesi Arama Raporu' },
        { time: '20:45 - 20:52', action: 'Melis atkıyı kesip çıkar; Caner kapıyı yumruklar ama Altan kapıyı kilitler.', proof: 'Sahne Amiri & İnterkom Kaydı' },
        { time: '20:55 - 21:00', action: 'Gülfem odaya girer ve zehirli broşu bizzat Altan’ın yakasına takar.', proof: 'Sahne Amiri İfadesi & Termal Kapsül Penceresi' },
        { time: '21:02 - 21:06', action: 'Orhan evrak bırakıp çıkar, Melis telefonunu almak için koridora döner.', proof: 'Sahne Amiri & Orhan Sorgusu' },
        { time: '21:08 - 21:12', action: 'Balmumu erir, Altan koltuğa yığılır ve ölür. Gülfem hızlıca odaya girip Melis’in rujuyla sol eliyle aynaya tehdit yazarak suçu dağıtır.', proof: 'Buharlı Ayna Analizi & Adli Tıp Raporu' }
      ],
      verdictSummary: 'Katil Gülfem Saygın’dır. Caner yedek anahtarla kostüm kesmiş, Melis koridora dönmüş, Orhan 12 Milyon TL sigorta poliçesi yaptırmıştı; ancak 37.2°C özel balmumlu mikro-kanallı broşu 20:55’te takan ve sonradan sol eliyle ruj yazısı yazan fail Gülfem’dir.',
      confessionAudioTranscript: 'İtiraf Tutanağı: "15 yılımı bu sahneye verdim. Orhan da Caner de Melis de ondan nefret ediyordu; ama tiyatroyu ve emeğimi Londra’ya kaçırmasını sadece ben durdurabilirdim."',
      confessionLetter: `[ADLİ EMANET KASASI - GÜLFEM SAYGIN'IN İTİRAF MEKTUBU]

"15 yıl boyunca Kadıköy Şehir Tiyatrosu'nun her perdesini, her kostümünü ellerimle kurdum. Altan ise tiyatronun 8 Milyon TL'lik fonunu gizlice Londra'ya aktarıp yarın sabah tek başına kaçacaktı.

Atölyemde broş iğnesine mikro kanallar açıp 37.2 derecede eriyen arı balmumuyla toksini mühürledim. Saat 20:55'te broşu yakasına bizzat taktım; 10-12 dakika içinde vücut ısısıyla eriyeceğini biliyordum. Altan yere yığılınca Melis'in makyaj masasında unuttuğu ruju alıp sol elimle aynaya tehdit yazdım. Orhan'ın sigorta poliçesi, Caner'in yedek anahtarı ve Melis'in koridordaki kavgası arasında gerçeği kimse göremez sanmıştım."`
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
      'Zonguldak kırsalındaki Karaca Madencilik ve Jeokimya Tesisi’nde bağımsız güvenlik denetçisi Erdem Soydan (39), -200 metre kotundaki araştırma şaftında asansör kabininin çakılması sonucu hayatını kaybetti. Çelik halatın özel asitle eritildiği, fren dişlisine ise kurşun takoz çakıldığı ortaya çıktı. 50 Milyon Dolarlık lityum patenti ve maden kapatma raporu gölgesinde tesisteki dört kritik isim şüpheli konumunda.',
    victim: {
      name: 'Erdem Soydan',
      age: 39,
      title: 'Bağımsız Maden Denetçisi & Metalurji Başmühendisi',
      timeOfDeath: '26 Ekim Pazar, 22:10 suları',
      locationOfBody: 'Karaca Maden Ocağı, -200 Metre Şaft Tabanı',
      causeInitial: 'Yüksekten düşmeye bağlı çoklu travma ve kabin ezilmesi',
    },
    suspects: [
      {
        id: 'hasan-karaca',
        name: 'Hasan Karaca',
        title: 'Maden ve Tesis Sahibi (İş İnsanı)',
        age: 52,
        relation: 'İşletme Sahibi & Denetlenen Taraf',
        description:
          'Madenin kapatılmasını önlemek için Erdem’e 3 Milyon TL rüşvet teklif edip reddedilmişti. Makam arabasının bagajında Erdem’in evrak çantası, muhasebesinde ise bakım mühendisi Kemal’e yapılmış kayıt dışı ödemeler bulundu.',
        alibi: 'Olay saatinde idari binadaki odasında bilanço incelediğini iddia ediyor.',
        suspiciousQuotes: [
          '"Rüşvet teklif ettim çünkü maden kapanırsa 400 işçi ve ben batardık; ama cinayet işlemedim!"',
          '"Arabamdaki çantayı Erdem odamda unutmuştu, ertesi gün iade edecektim."',
          '"Madenimi patlatsam ağırlaştırılmış müebbet alırım ve tesis mühürlenir; akıl kârı değil!"'
        ],
        motiveHypothesis: 'Madenin mühürlenmesini engellemek ve kapatma raporunu yok etmek.',
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
        title: 'Vardiya Amiri & Şaft Çalışanı',
        age: 31,
        relation: 'Gece Vardiyası Şaft Sorumlusu',
        description:
          'Geçen yıl şaft ihmalinden kardeşini kaybetmiş öfkeli bir işçi. Olaydan önce asansör makine dairesinde görüldü; tulumunda mazot lekesinin yanı sıra iş güvenliği atölyesine ait metal/kurşun talaşı da tespit edildi.',
        alibi: 'Makine dairesine jeneratörden mazot çekmek için girdiğini, asansöre dokunmadığını iddia ediyor.',
        suspiciousQuotes: [
          '"Makine dairesine kaçak mazot için girdim, inkâr etmiyorum; ama halata asit dökmedim!"',
          '"Tulumumdaki metal talaşı gündüz vardiya onarımından kalma, takoz çakmadım."',
          '"Gece 21:18 civarı Berna Hanım’ı elinde korumalı numune çantasıyla kule yolunda gördüm."'
        ],
        motiveHypothesis: 'Kardeşinin ölümünün intikamını almak ve ihmalkâr tesisi sabotajla durdurmak.',
        initialSuspicion: 70,
        photoPlaceholder: {
          initials: 'MÇ',
          tint: 'from-blue-950 to-slate-900',
          silhouetteStyle: 'bg-blue-900/30 border-blue-600/40 text-blue-300'
        }
      },
      {
        id: 'kemal-aksoy',
        name: 'Kemal Aksoy',
        title: 'Şaft Bakım & İş Güvenliği Başmühendisi',
        age: 44,
        relation: 'Asansör Bakım Sorumlusu & Teknik Amir',
        description:
          'Asansörün mekanik fren dişlilerine ve kurşun denge takozlarına doğrudan erişimi olan başmühendis. Halat bakım raporunu 2 gün önce sahte imzaladığı ve patron Hasan Karaca’dan gizli prim aldığı belirlendi.',
        alibi: 'Saat 21:00’den sonra şantiye dışındaki lojmanda uyuduğunu iddia ediyor.',
        suspiciousQuotes: [
          '"Bakım raporunu Hasan Bey’in baskısıyla erken imzaladım, halatta mekanik sorun yoktu!"',
          '"Kurşun takozlar bakım atölyesinde açıkta durur, gece vardiyasındaki herkes alabilirdi."',
          '"Ben mekanikçiyim, o özel kimyasal asidi nereden bulup süreceğim?"'
        ],
        motiveHypothesis: 'Sahte güvenlik onayının denetçi tarafından savcılığa verilmesini engellemek.',
        initialSuspicion: 65,
        photoPlaceholder: {
          initials: 'KA',
          tint: 'from-emerald-950 to-slate-900',
          silhouetteStyle: 'bg-emerald-900/30 border-emerald-600/40 text-emerald-300'
        }
      },
      {
        id: 'berna-tezcan',
        name: 'Dr. Berna Tezcan',
        title: 'Tesis Baş Jeoloğu & Kimya Laboratuvar Şefi',
        age: 37,
        relation: 'Erdem’in Eski Üniversite Ortağı',
        description:
          'Tesiste 50 Milyon Dolarlık lityum rezervi keşfetmişti. Erdem’in çevre raporu nedeniyle madeni kapatıp lityum sahasını kamu korumasına devredeceğini öğrenince olay günü patent ortaklığından Erdem’in adını sildi.',
        alibi: 'Saat 21:00’den itibaren kimya laboratuvarında gece vardiyası lityum testi yaptığını belirtiyor.',
        suspiciousQuotes: [
          '"Erdem projeye aylardır katkı sunmadığı için adını patentten çıkardım; cinayet sebebi değil!"',
          '"Asit korozyonu aramalarım maden kuyu borularındaki paslanma simülasyonu içindi."',
          '"Laboratuvara kartla giriş yapabilen başka yetkililer de var; kumpas kuruluyor."'
        ],
        motiveHypothesis: '50 Milyon Dolarlık lityum patentini tek başına sahiplenmek ve saha kapanışını önlemek.',
        initialSuspicion: 60,
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
        summary: '40 tonluk çelik halat mekanik yorgunluktan değil, güçlü bir asit karışımıyla kasten eritilerek koparılmış; acil fren ise kurşun takozla kilitlenmiş.',
        fullReport: 'Kriminalistik Olay Yeri Zabtı:\n26 Ekim saat 22:10’da -200 kotuna çakılan servis asansöründe yapılan incelemede:\n- Çelik taşıyıcı halatın kopma noktasında kimyasal erime ve yeşilimsi korozyon köpüğü tespit edilmiştir.\n- 40 tonluk halat liflerinin kopma seviyesine inmesi için derişik asidin en az 35-45 dakika önce uygulanmış olması gerekmektedir.\n- Kabin fren dişlisinin arasına bakım atölyesi standardında döküm kurşun takoz çakılarak acil fren devre dışı bırakılmıştır.',
        keyDeduction: 'Sabotaj hem kimyasal erime süresi (21:15-21:30 uygulaması) hem de fren mekanizması takozu içeren iki aşamalı bir plandır.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Kriminal Fotoğraf: Asitle eritilmiş çelik taşıyıcı kablo',
        narrationUrl: '/cases/vaka3/ev-3-1-1.mp3',
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
        summary: 'Asansör düşmeden 25 saniye önceki telsiz anonsunda Erdem Soydan frenin sıkıştığını ve kapatma raporunun çantasından alındığını söylüyor.',
        fullReport: 'Telsiz Kayıt Bandı #M-03 (Saat 22:09:40):\nErdem Soydan: "Merkez! Şaft kabini kayıyor, acil durdurma tutmuyor!"\nMerkez Operatörü: "Erdem Bey manuel freni çekin!"\nErdem Soydan: "Fren dişlisi takozla kilitlenmiş! Eğer çıkamazsam... kapatma raporumu ve numune dosyasını çantamdan..." (Şiddetli gürültü ve hat kesintisi)\nSaat 22:10:05 - Çarpma sesi.',
        keyDeduction: 'Erdem son anlarında çantasındaki kapatma raporuna ve numune dosyasına işaret etmektedir.',
        mediaType: 'audio',
        mediaUrl: '/cases/vaka3/saft-telsiz.mp3',
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
        title: 'Tanık ve Güvenlik Kamera Özeti: Baş Teknisyen Celal Demir',
        category: 'interrogation',
        roleAccess: ['field', 'forensics', 'profiler', 'archive'],
        summary: 'Kule kamerasının kör noktasından saat 21:20’de sarı yağmurluklu ve mavi nitril eldivenli bir şahıs geçmiş; saat 21:40’ta ise Murat makine dairesinde görülmüş.',
        fullReport: 'T.C. ZONGULDAK İL EMNİYET MÜDÜRLÜĞÜ\nTANIK VE KAMERA ÖZET ZAPTI\n\nTanık: Celal Demir (58, Şaft Baş Teknisyeni)\nCEVAP: "Kule kapısı yanındaki kamera kör noktayı tam görmüyor ama saat 21:20’de üzerinde standart sarı saha yağmurluğu, başında baret ve elinde mavi nitril eldiven olan birinin kule basamaklarına yöneldiğini gördüm. Karanlıkta yüzünü ve boyunu seçemedim; yağmurluk da eldiven de tesiste laboratuvardan bakım ekibine kadar herkeste var. Saat 21:40’ta ise vardiya amiri Murat’ı makine dairesi kapısından elinde bidonla çıkarken gördüm."',
        keyDeduction: 'Saat 21:20’deki şahıs herkesin kullandığı sarı yağmurluk ve mavi eldiven giyerek kimliğini gizlemiştir; saat 21:40’ta ise Murat makine dairesindeydi.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka3/ev-3-1-3.mp3',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'SORGU-TEKNİK-01',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-3-2-1',
        envelope: 2,
        title: 'Asit Spektrometre Analizi & Kartlı Giriş Logları',
        category: 'toxicology',
        roleAccess: ['forensics', 'cryptology', 'profiler', 'field'],
        summary: 'Halattaki asit özel florosülfonik katalizör karışımı çıktı; ancak laboratuvar dış kapısına gece Murat, Kemal ve Berna’nın kartlarıyla erişim izni bulunuyor.',
        fullReport: 'Adli Kimya ve Erişim Kontrol Raporu:\n1. Halat üzerindeki korozyon kalıntısı yalnızca bu tesiste lityum zenginleştirme deneyleri için ithal edilen florosülfonik asit karışımıdır.\n2. Kimya laboratuvarının ana koridor kapısına vardiya amiri Murat, bakım mühendisi Kemal ve laboratuvar şefi Berna’nın giriş kartları tanımlıdır. Ancak asidin saklandığı iç çelik kasa yalnızca biyometrik parmak izi ile açılmaktadır.\n3. Kasa açılış logları siber incelemeye gönderilmiştir.',
        keyDeduction: 'Asit sıradan bir depo asidi değil özel florosülfonik karışımdır; dış kapıya üç kişinin erişimi olsa da iç kasa biyometrik kilide sahiptir.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
        mediaCaption: 'Laboratuvar Analiz Raporu: Florosülfonik asit izotop eşleşmesi',
        narrationUrl: '/cases/vaka3/ev-3-2-1.mp3',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'KIMYA-771',
          confidentiality: 'ADLİ TIP RAPORU',
        }
      },
      {
        id: 'ev-3-2-2',
        envelope: 2,
        title: 'Sorgu Tutanağı: Murat Çetin & Kemal Aksoy',
        category: 'interrogation',
        roleAccess: ['profiler', 'field', 'archive', 'forensics'],
        summary: 'Murat’ın tulumunda mazotla birlikte kurşun talaşı çıkarken, Kemal’in 2 gün önce sahte halat bakım raporu imzaladığı ve Hasan’dan gizli prim aldığı belirlendi.',
        fullReport: 'T.C. ZONGULDAK ASAYİŞ ŞUBE\nÇAPRAZ SORGU TUTANAĞI\n\n1. Murat Çetin (31):\nTulumunda mazot ve kurşun talaşı bulundu. Murat: "Öğlen kaynak atölyesinde boru tamiri yaptım, talaş oradan! Gece 21:40’ta makine dairesine sadece jeneratörden mazot çekmeye girdim; ama 21:18 civarı Berna Hanım’ı elinde korumalı çantayla kule yolunda gördüm" dedi.\n\n2. Kemal Aksoy (44):\nBakım mühendisi Kemal’in 2 gün önce şaft halatına sahte "Kusursuz" onayı verdiği ve Hasan Karaca’dan 450 bin TL gizli ödeme aldığı çıktı. Kemal: "Olay gecesi lojmandaydım" dese de lojman bekçisi Kemal’in aracının 21:30’da saha dışından geri döndüğünü bildirdi.',
        keyDeduction: 'Murat’ın tulumundaki kurşun talaşı ve makine dairesi varlığı, Kemal’in ise sahte bakım onayı ve lojman alibisindeki açık şüpheyi üçlü arasında güçlü tutmaktadır.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka3/ev-3-2-2.mp3',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'SORGU-MURAT-KEMAL',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-3-2-3',
        envelope: 2,
        title: 'Cumhuriyet Savcılığı Sorgu Tutanağı: Hasan Karaca',
        category: 'interrogation',
        roleAccess: ['profiler', 'archive', 'field', 'cryptology', 'forensics'],
        summary: 'Bagajında Erdem’in evrak çantası çıkan Hasan Karaca rüşvet ve sahte bakım primi verdiğini kabul etti; ancak cinayet sabotajını reddetti.',
        fullReport: 'T.C. ZONGULDAK CUMHURİYET BAŞSAVCILIĞI\nŞÜPHELİ SORGU TUTANAĞI\n\nŞüpheli: Hasan Karaca (52)\nCEVAP: "Sayın Savcım, maden kapanmasın diye Erdem’e 3 Milyon TL teklif ettim, Kemal’e de bakım işlerini hızlandırsın diye prim verdim. Erdem’in evrak çantasını da içindeki kapatma taslağını incelemek için akşam 18:30’da bagajıma aldım. Ama şaftı düşürmedim! Maden savcılık tarafından mühürlendi, ağırlaştırılmış müebbet alacağım bir cinayeti kendi tesisimde neden işleyeyim? Asıl kavga lityum patentinde; dün akşam Berna ile Erdem birbirine girdi!"',
        keyDeduction: 'Hasan Karaca rüşveti ve çantayı almayı kabul etmiştir; ancak sabotaj tekniği ve özel asit erişimi henüz netleşmemiştir.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka3/ev-3-2-3.mp3',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'SORGU-HASAN-02',
          confidentiality: 'GİZLİ',
        }
      },
      {
        id: 'ev-3-3-1',
        envelope: 3,
        title: 'Biyometrik Kasa Logu & Siber Bilişim Raporu',
        category: 'document',
        roleAccess: ['archive', 'cryptology', 'field', 'forensics', 'profiler'],
        summary: 'Biyometrik asit kasası saat 21:08’de yalnızca Berna Tezcan’ın parmak iziyle açılmış; aynı gün saat 19:15’te patentten Erdem’in adı silinmiş ve halat aşınma süresi aratılmış.',
        fullReport: 'Siber Suçlar ve Güvenlik Logu Raporu:\n1. Laboratuvar iç çelik kasasının elektronik denetim loguna göre kasa olay gecesi saat 21:08:12’de Berna Tezcan’ın parmak iziyle açılmış ve 21:10’da kapanmıştır. Başka hiçbir kart veya parmak izi kaydı yoktur.\n2. Berna’nın bilgisayarında saat 19:15’te Türk Patent Enstitüsü portalından 50 Milyon Dolarlık lityum patent başvurusu güncellenerek Erdem Soydan’ın ismi silinmiştir.\n3. Arama geçmişinde saat 19:40’ta "40 tonluk çelik halat florosülfonik asit kopma süresi" sorgusu ve laboratuvar yıkama lavabosunda sarı saha yağmurluğu cebine düşmüş kurşun takoz sürtünme izi saptanmıştır.',
        keyDeduction: '21:08 biyometrik kasa açılışı, 19:15 patent silme işlemi, 19:40 halat aşınma araması ve 21:20 yağmurluklu kule geçişi aynı zaman penceresinde kesişmektedir.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka3/ev-3-3-1.mp3',
        metadata: {
          date: '27 Ekim 2026',
          caseRef: 'SİBER-PATENT',
          confidentiality: 'ÇOK GİZLİ',
        }
      },
      {
        id: 'ev-3-3-2',
        envelope: 3,
        title: 'Son Çapraz Sorgu: Dr. Berna Tezcan',
        category: 'interrogation',
        roleAccess: ['forensics', 'profiler', 'archive'],
        summary: 'Berna Tezcan kasa açılışını rutin lityum deneyi, aramayı kuyu borusu korozyonu olarak savundu; Hasan’ın çantasını, Kemal’in sahte raporunu ve Murat’ın kurşun talaşını işaret etti.',
        fullReport: 'T.C. ZONGULDAK EMNİYET MÜDÜRLÜĞÜ CİNAYET BÜRO\nSON ÇAPRAZ SORGU TUTANAĞI\n\nŞüpheli: Dr. Berna Tezcan (37)\nCEVAP: "Kasayı 21:08’de gece lityum numunesi için açtım, bu benim rutin işim! Patentten Erdem’i sildim çünkü Hasan Karaca’dan rüşvet alacağından şüphelendim! Korozyon araması kuyu boruları içindi. Bütün şüpheyi üzerime yıkıyorsunuz ama düşünün: Kurşun takozu frene çakan kişi ben olsam tulumumda kurşun talaşı çıkardı; talaş Murat Çetin’de çıktı! Sahte bakım onayını imzalayan Kemal Aksoy, Erdem’in çantasını bagajına saklayan ise Hasan Karaca! Ben bilim insanıyım!"',
        keyDeduction: 'Dört şüphelinin de tesis içinde güçlü motifi ve fiziki şüphe izi vardır; ancak biyometrik asit kasasını 21:08’de açan tek kişi ve 21:20’de kuleye çıkan sarı yağmurluklu figür penceresi incelenmelidir.',
        mediaType: 'text',
        narrationUrl: '/cases/vaka3/ev-3-3-2.mp3',
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
        title: 'Zarf 1 Doğrulama Sorusu: Sabotajın Yapısı ve Zamanlaması',
        instructions: 'Zarf 1 kriminal ve tanık raporlarını birleştirin.',
        question: 'Kriminal rapora göre asansör sabotajı nasıl gerçekleştirilmiştir ve uygulama zamanı neye işaret eder?',
        options: [
          { id: 'q1-1', text: 'Fren kurşun takozla kilitlenmiş, halata ise kopmadan 35-45 dakika önce (21:15-21:30 arası) derişik asit sürülmüştür.', isCorrect: true },
          { id: 'q1-2', text: 'Asansör motoru uzaktan kumandayla yakılmış ve halat saat 22:08’de mekanik olarak kesilmiştir.', isCorrect: false },
          { id: 'q1-3', text: 'Kabine aşırı yük yüklenmiş ve güvenlik kilidi saat 21:40’ta Murat tarafından sökülmüştür.', isCorrect: false }
        ],
        explanation: '40 tonluk çelik halatın asitle erimesi 35-45 dakikalık bir kimyasal etki penceresi (21:15-21:30) gerektirir.'
      },
      2: {
        envelope: 2,
        title: 'Zarf 2 Doğrulama Sorusu: Kimyasal Erişim Kısıtı',
        instructions: 'Asit spektrometre ve erişim kontrol raporunu inceleyin.',
        question: 'Halatı eriten özel florosülfonik asidin temini hakkında erişim kontrol raporu neyi göstermektedir?',
        options: [
          { id: 'q2-1', text: 'Dış laboratuvar kapısına üç kişinin kartı tanımlı olsa da asidin bulunduğu iç kasa yalnızca biyometrik parmak iziyle açılmaktadır.', isCorrect: true },
          { id: 'q2-2', text: 'Söz konusu asit maden işçilerinin ortak soyunma odasındaki açık dolaptan herkesçe alınabilmektedir.', isCorrect: false },
          { id: 'q2-3', text: 'Asit iki gün önce Kemal Aksoy’un lojmanındaki bakım sandığından getirilmiştir.', isCorrect: false }
        ],
        explanation: 'Dış kapı kartları birden fazla kişide olsa da özel asidin saklandığı iç kasa biyometrik kilide sahiptir.'
      },
      3: {
        envelope: 3,
        title: 'Zarf 3 Doğrulama Sorusu: Biyometrik Log ve Dijital İzler',
        instructions: 'Zarf 3’teki biyometrik kasa logunu ve siber incelemeyi birleştirin.',
        question: 'Siber ve kasa denetim logları 21:20’deki kule sabotajı ile nasıl örtüşmektedir?',
        options: [
          { id: 'q3-1', text: '19:15’te patentten Erdem’in adı silinmiş, 19:40’ta halat kopma süresi aratılmış ve 21:08’de asit kasası biyometrik izle açılmıştır.', isCorrect: true },
          { id: 'q3-2', text: 'Hasan Karaca saat 21:08’de kendi kartıyla asit kasasını açıp Evrak Çantası dosyalarını silmiştir.', isCorrect: false },
          { id: 'q3-3', text: 'Kemal Aksoy 21:30’da lojmandan dönüp bilgisayar üzerinden sahte bakım raporunu düzenlemiştir.', isCorrect: false }
        ],
        explanation: '19:15 patent değişikliği, 19:40 halat aşınma araması ve 21:08 biyometrik kasa açılışı sabotaj saatinden hemen önceki zinciri kurar.'
      }
    },
    solution: {
      culpritId: 'berna-tezcan',
      culpritName: 'Dr. Berna Tezcan',
      motiveTitle: '50 Milyon Dolarlık Lityum Patentini Tek Başına Sahiplenmek',
      keyEvidenceTitle: 'Biyometrik Kasa Logu & Siber Bilişim Raporu',
      fullChronology: [
        { time: '17:00', action: 'Erdem Soydan, madenin kapatılacağını ve lityum sahasının kamu korumasına devredileceğini Berna’ya bildirir.', proof: 'Erdem’in çalışma günlüğü' },
        { time: '19:15 - 19:40', action: 'Berna patent başvurusundan Erdem’in adını siler ve çelik halatın florosülfonik asitle kopma süresini aratır.', proof: 'Siber Bilişim Raporu' },
        { time: '21:08', action: 'Berna biyometrik parmak iziyle iç kasayı açıp florosülfonik asidi alır.', proof: 'Biyometrik Kasa Denetim Logu' },
        { time: '21:18 - 21:25', action: 'Berna kimliğini gizlemek için standart sarı yağmurluk ve mavi nitril eldivenle kuleye çıkar, halata asit sürer ve bakım atölyesinden aldığı kurşun takozu frene çakar.', proof: 'Kule Tanığı & Yıkama Lavabosu İzi' },
        { time: '22:10', action: 'Erdem’in bindiği kabinin halatı kopar ve -200 kotuna çakılır.', proof: 'Şaft Telsiz Bandı' }
      ],
      verdictSummary: 'Sabotajın faili Dr. Berna Tezcan’dır. Hasan Karaca rüşvet ve çanta gizlemekten, Kemal Aksoy sahte bakım onayından, Murat Çetin ise yakıt hırsızlığından şüphe çekmiş ve açık kapı yaratmıştır; ancak biyometrik kasayı 21:08’de açıp 19:40’ta halat aşınma süresini aratan fail Berna Tezcan’dır.',
      confessionAudioTranscript: 'İtiraf Bandı: "10 yıllık emeğimi tek bir kapatma raporuyla çöpe atacaktı. Tesisin herkesi şüphelendiren kaosu içinde kimse laboratuvar şefinin kuleye çıkacağını tahmin edemezdi."',
      confessionLetter: `[ADLİ EMANET KASASI - DR. BERNA TEZCAN'IN İTİRAF MEKTUBU]

"10 yılımı yerin 200 metre altındaki zehirli çamurda Türkiye'nin en saf lityum rezervini bulmaya adadım. 50 Milyon Dolarlık patent tam hazırdı ki Erdem saat 17:00'de gelip madeni mühürleyeceğini ve sahanın kamulaştırılacağını söyledi.

19:15'te patentten adını sildim, 19:40'ta çelik halatın florosülfonik asitle erime süresini hesapladım. 21:08'de kasadan asidi alıp herkesin giydiği sarı yağmurluğu geçirdim; kimse beyaz önlüklü bir bilim insanını kulede beklemezdi. Hasan'ın rüşveti, Kemal'in sahte bakım imzası ve Murat'ın makine dairesindeki mazot hırsızlığı herkesin dikkatini dağıtacaktı. Ama biyometrik kasa logunu ve siber geçmişi hesaba katamadım."`
    }
  }
];
