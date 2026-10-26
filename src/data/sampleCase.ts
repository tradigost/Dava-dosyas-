/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseScenario } from '../types';

export const DEMO_CUSTOM_CASE: CaseScenario = {
  id: 'bogaz-ekspresi',
  title: 'Gece Yarısı Boğaz Ekspresi Cinayeti',
  subtitle: 'Sirkeci Garı 3. Kompartımanda Zehirli Çay Suikastı',
  difficulty: 'Orta',
  estimatedMinutes: 20,
  minPlayers: 2,
  maxPlayers: 6,
  bannerTag: 'YENİ EKLENEN VAKA (ADMİN YÜKLEMESİ)',
  synopsis: 
    'İstanbul Sirkeci Garı’nda hareket saatini bekleyen Boğaz Ekspresi’nin 3. vagonunda, uluslararası lojistik kralı Ferit Soydan (54), kompartımanında elinde porselen çay bardağıyla ölü bulundu. Kapı içeriden kilitliydi ancak kompartımanın havalandırma kapağı aralıktı. Masada dökülmüş adaçayı, cebinde gizemli bir İsviçre emanet fişi ve garda panikle kaçmaya çalışan şüpheliler...',
  victim: {
    name: 'Ferit Soydan',
    age: 54,
    title: 'Soydan Lojistik & Uluslararası Taşımacılık CEO’su',
    timeOfDeath: '24 Ekim Cuma, 23:15 civarı',
    locationOfBody: 'Sirkeci Garı, Boğaz Ekspresi 1. Mevki 3 Nolu Kompartıman',
    causeInitial: 'Nörotoksik kardiyak arrest (Akonitin alkaloid zehirlenmesi)',
  },
  suspects: [
    {
      id: 'av-zerrin',
      name: 'Av. Zerrin Kara',
      title: 'Kurbanın Özel Hukuk Danışmanı',
      age: 41,
      relation: 'Şirket Baş Avukatı (10 yıldır)',
      description: 'Soydan Lojistik’in tüm gizli sözleşmelerini ve uluslararası gümrük davalarını yönetiyordu. Son günlerde şirketin hisse devri anlaşmazlığı yüzünden Ferit Soydan ile aralarında sert gerginlikler yaşandığı biliniyor.',
      alibi: 'Gara sadece müvekkilini yolcu etmek ve son evrakları imzalatmak için saat 22:30’da geldiğini, 22:50’de gardaki kafeteryaya geçip trenin kalkışını beklediğini öne sürüyor.',
      suspiciousQuotes: [
        '"Ferit Bey çok aceleciydi. O gece trende olacağını benden ve mühendis Haluk’tan başka kimse bilmiyordu."',
        '"Çantasındaki vasiyet taslağını ben hazırladım. Ölümünden fayda sağlayacak son insan benim."',
        '"Saat 23:00’te peronda bir tartışma sesi duydum ama trenin içine dönüp bakmadım."'
      ],
      motiveHypothesis: 'Miras sözleşmesine gizlice eklenen %20 hisse payını yürürlüğe sokmak.',
      initialSuspicion: 55,
      photoPlaceholder: {
        initials: 'ZK',
        tint: 'from-amber-950 to-stone-900',
        silhouetteStyle: 'bg-amber-900/30 border-amber-600/40 text-amber-300'
      }
    },
    {
      id: 'muhendis-haluk',
      name: 'Haluk Demir',
      title: 'Lojistik Operasyon & Soğuk Zincir Mühendisi',
      age: 38,
      relation: 'Operasyon Direktörü',
      description: 'Şirketin kimyasal ve soğuk hava taşımacılığı departmanını yönetiyor. Nadir kimyasal bileşenlere ve kuru buz / kriyojenik tüplere doğrudan erişim yetkisi var.',
      alibi: 'Trenin soğutmalı kargo vagonunu teftiş ettiğini, 23:00’te işini bitirip gar çıkışına doğru yürüdüğünü iddia ediyor.',
      suspiciousQuotes: [
        '"Ferit Bey beni hırsızlıkla suçladı! Oysa o limandaki kaçak kimyasal yükleri bizzat kendi onayıyla almıştık."',
        '"Ben vagon kompartımanına asla girmedim. Sadece yük vagonundaydım."',
        '"Çantamda zehir mi varmış? O sadece kuru buz numunesiydi, laboratuvara götürüyordum!"'
      ],
      motiveHypothesis: 'Gümrük kaçakçılığı skandalının faturasını tek başına ödememek ve Ferit’in tehdidini susturmak.',
      initialSuspicion: 80,
      photoPlaceholder: {
        initials: 'HD',
        tint: 'from-blue-950 to-slate-900',
        silhouetteStyle: 'bg-blue-900/30 border-blue-600/40 text-blue-300'
      }
    },
    {
      id: 'rustem-efendi',
      name: 'Rüstem Çelik',
      title: 'TCDD Yataklı Vagon Görevlisi & Kondüktör',
      age: 52,
      relation: 'Kompartıman Servis Sorumlusu',
      description: '25 yıllık TCDD görevlisi. Ferit Soydan’a saat 22:55’te porselen demlikte adaçayı servisi yapan tek kişi.',
      alibi: 'Çayı ikram ettikten sonra 1. vagona geçtiğini, bilet kontrollerini yaptığını beyan ediyor.',
      suspiciousQuotes: [
        '"Beyefendi benden özel adaçayı istedi. Kendi getirdiği bitki kurusunu demliğe koymamı rica etti."',
        '"Ben gariban bir demiryolcuyum, ne anlarım zehirden! Ama peronda avukat hanımın mühendis beye bağırdığını gördüm."'
      ],
      motiveHypothesis: 'Şantaj veya rüşvet karşılığı servise aracılık etmek.',
      initialSuspicion: 40,
      photoPlaceholder: {
        initials: 'RÇ',
        tint: 'from-emerald-950 to-zinc-900',
        silhouetteStyle: 'bg-emerald-900/30 border-emerald-600/40 text-emerald-300'
      }
    }
  ],
  evidence: [
    {
      id: 'ev-exp-101',
      envelope: 1,
      title: 'Kriminal Toksikoloji: Porselen Bardak & Mide Analizi',
      category: 'toxicology',
      roleAccess: ['forensics', 'profiler'],
      summary: 'Kurbanın midesinde ve bardağın dibinde saf "Kurtboğan Otu" (Aconitum napellus) ekstratı saptandı. Zehir doğrudan çaya karıştırılmış!',
      fullReport:
        'İSTANBUL ADLİ TIP KURUMU ZEHİRLENME BÜROSU RAPORU\n' +
        'Numune: Porselen bardak kalıntısı ve kurban kan örneği.\n' +
        '1. Tespit edilen madde: Akonitin (Aconitine alkaloid).\n' +
        '2. Ölüm süresi: Tüketimden sonra yaklaşık 15-20 dakika içinde kalbin ventriküler fibrilasyon ile durması.\n' +
        '3. Bardağın kulpunda ve ağız kısmında maktulün tükürüğü ile birlikte BİLİNMEYEN LATEKS ELDİVEN TALK İZİ tespit edildi.\n' +
        '4. Şekerliğe veya çay süzgecine değil, doğrudan kurbana sunulan porselen kupaya dökülmüştür.',
      keyDeduction: 'Katil çay servisi yapılmadan hemen önce ya da bardağı hazırlarken lateks eldivenle zehri bardağa damlatmıştır.',
      metadata: {
        date: '25 Ekim 01:20',
        caseRef: 'ATK-2026-EXP',
        confidentiality: 'ADLİ TIP RAPORU'
      }
    },
    {
      id: 'ev-exp-102',
      envelope: 1,
      title: 'Kompartıman Krokisi & Havalandırma Paneli İncelemesi',
      category: 'interrogation',
      roleAccess: ['field', 'cryptology'],
      summary: 'Kompartıman kapısı içeriden kilitliydi ancak koridora bakan üst menfez vidası gevşetilmişti.',
      fullReport:
        'OLAY YERİ İNCELEME ŞUBE MÜDÜRLÜĞÜ RAPORU\n' +
        '1. Kompartıman kapısı mekanik sürgüyle içeriden kilitli bulunmuştur.\n' +
        '2. Kapının üstündeki havalandırma menfezinin 2 adet vidası ince uçlu bir aletle çıkarılmış ve pervazda taze metal çizikleri oluşmuştur.\n' +
        '3. Koridor halısında 42 numara kauçuk taban ayakkabı tozu ve kimyasal florokarbon lekesi saptanmıştır.',
      keyDeduction: 'Kapı içeriden kilitli olsa da katil menfezi kullanarak kurban kilitledikten sonra içeriye bir şey ulaştırmış veya doğrudan servis anında müdahale etmiştir.',
      metadata: {
        date: '25 Ekim 01:45',
        caseRef: 'OYI-2026-VGN',
        confidentiality: 'GİZLİ'
      }
    },
    {
      id: 'ev-exp-201',
      envelope: 2,
      title: 'Mühendis Haluk’un Sırt Çantası & Kimyasal Analizi',
      category: 'document',
      roleAccess: ['forensics', 'ballistics'],
      summary: 'Haluk Demir’in gar kapısında durdurulan çantasında boş bir kriyojenik sıvı ampulü ve florokarbon çözücü bulundu.',
      fullReport:
        'KRİMİNAL LABORATUVAR KİMYASAL EKSPERTİZİ\n' +
        '1. Şüpheli Haluk Demir’in gar çıkışında el konulan sırt çantasında 50 ml’lik amber renkli cam flakon bulunmuştur.\n' +
        '2. Flakon iç yüzeyinde yapılan kromatografide Akonitin izleri ve florokarbon gazı kalıntıları eşleşti!\n' +
        '3. Ayakkabısındaki leke ile 3. vagon koridorundaki florokarbon lekesi kimyasal olarak %100 örtüşmektedir.',
      keyDeduction: 'Haluk’un "ben sadece kargo vagonundaydım, yolcu vagonuna hiç girmedim" ifadesi tamamen yalandır!',
      metadata: {
        date: '25 Ekim 02:40',
        caseRef: 'KRM-2026-HLK',
        confidentiality: 'ÇOK GİZLİ'
      }
    },
    {
      id: 'ev-exp-202',
      envelope: 2,
      title: 'Şifreli Telegram Mesajı & Tehdit Dökümü',
      category: 'cipher',
      roleAccess: ['cryptology', 'archive'],
      summary: 'Kurbanın kilitli telefonundan kurtarılan Telegram mesajında Haluk’a gönderilen son ültimatom bulundu.',
      fullReport:
        'SİBER SUÇLAR VE TELEKOMÜNİKASYON RAPORU\n' +
        'Kurban Ferit Soydan’ın telefonundan saat 21:10’da "Demir_H" kullanıcısına gönderilen mesaj:\n' +
        '"Haluk, trende son konuşmamızı yapacağız. Eğer limandaki 8 konteyner kimyasal zehir sevkiyatının sahte evraklarını savcılığa teslim etmezsen, yarın sabah Sofya’ya varmadan tüm polise adını vereceğim. Ya hapis ya itiraf!"\n\n' +
        'Cevap (21:14 Haluk Demir):\n' +
        '"Trende olacağım. İkimizi de yakmana izin vermeyeceğim."',
      keyDeduction: 'Haluk cinayeti örtbas etmek ve ömür boyu hapse girmemek için bu suikastı önceden planlamıştır.',
      metadata: {
        date: '25 Ekim 03:00',
        caseRef: 'SBR-2026-TLG',
        confidentiality: 'TEKNİK DEŞİFRE'
      }
    },
    {
      id: 'ev-exp-301',
      envelope: 3,
      title: 'Sirkeci Garı Peron Güvenlik Kamerası (Saat 22:52)',
      category: 'gps',
      roleAccess: ['field', 'cryptology'],
      summary: 'Kamera kaydı: Haluk Demir’in kondüktör Rüstem çay tepsisini hazırlarken gizlice tepsiyi tezgaha bırakmasını fırsat bilip bardağa damlalıkla müdahale ettiği an!',
      fullReport:
        'EMNİYET KAMERA İNCELEME VE GÖRÜNTÜ İYİLEŞTİRME TUTANAĞI\n' +
        'Kamera: Sirkeci Garı 3. Peron Hizmet Servis Noktası.\n' +
        'Saat 22:52:14: Kondüktör Rüstem demlenen adaçayını porselen bardağa koyup şeker almak için arkasını döndü.\n' +
        'Saat 22:52:28: Haluk Demir koyu renk montu ve lateks eldiveniyle servis masasına yaklaştı, cebinden çıkardığı damlalıkla bardağın içine 3 damla sıvı damlatıp hızla vagonun arka körüğüne yöneldi.\n' +
        'Saat 22:54:10: Rüstem tepsiyi alıp 3 numaralı kompartımana götürdü ve Ferit Soydan’a bizzat teslim etti.',
      keyDeduction: 'Cinayetin fiziksel kanıtı kamera kayıtlarıyla tescillendi. Rüstem suikastın farkında olmadan bardağı servis etmiştir.',
      metadata: {
        date: '25 Ekim 03:30',
        caseRef: 'PTS-2026-SRK',
        confidentiality: 'ÇOK GİZLİ'
      }
    },
    {
      id: 'ev-exp-302',
      envelope: 3,
      title: 'İsviçre Banka Havalesi & Zimmet İtirafı',
      category: 'banking',
      roleAccess: ['archive', 'profiler'],
      summary: 'Haluk Demir’in Zürih hesabına kaçak sevkiyat komisyonu olarak 1.8 Milyon Euro yatırıldığı belgelendi.',
      fullReport:
        'MASAK VE ULUSLARARASI POLİS İSTİHBARATI (INTERPOL)\n' +
        '1. Haluk Demir adına açılmış İsviçre UBS hesabına son 3 ayda 1.800.000 Euro şüpheli fon transferi yapılmıştır.\n' +
        '2. Maktul Ferit Soydan bu paranın kaynağını çözmüş ve tren yolculuğunu uluslararası adli makamlara başvurmak için bir rota olarak seçmişti.',
      keyDeduction: 'Haluk hem kaçak sevkiyattan kazandığı 1.8 Milyon Euro’yu kaybetmemek hem de hapse girmemek için Ferit’i trende susturdu.',
      metadata: {
        date: '25 Ekim 03:45',
        caseRef: 'MSK-2026-EXP',
        confidentiality: 'GİZLİ'
      }
    }
  ],
  gates: {
    1: {
      envelope: 1,
      title: 'Zarf 1 Kapı Sorusu: Toksikolojik Madde Tespiti',
      instructions: 'Toksikoloji ve olay yeri raporundaki kilit bulguyu eşleştirerek bir sonraki zarfa geçin.',
      question: 'Kurbanın porselen bardağında tespit edilen ve doğrudan kardiyak arrest yaratan ölümcül zehir hangisidir?',
      options: [
        {
          id: 'g1-opt-1',
          text: 'Akonitin (Kurtboğan Otu) ekstratı - Çünkü lateks eldiven talk iziyle bardağa doğrudan uygulanmıştır.',
          isCorrect: true
        },
        {
          id: 'g1-opt-2',
          text: 'Potasyum Siyanür - Çünkü kadehin içine şeker gibi karıştırılmıştır.',
          isCorrect: false
        },
        {
          id: 'g1-opt-3',
          text: 'Arsenik Trioksit - Çay yapraklarının içine önceden kurutularak yedirilmiştir.',
          isCorrect: false
        }
      ],
      explanation: 'Harika dedektiflik! Adli tıp analizinde saptanan Akonitin ve lateks eldiven izi şüpheleri profesyonel bir fail üzerine çekti. Zarf 2 açıldı!',
      hintByRole: {
        forensics: 'Kriminal raporda ölüm sebebi Akonitin alkaloid olarak geçiyor.',
        cryptology: 'Bardağın kulpunda lateks eldiven talk tozu bulundu.'
      }
    },
    2: {
      envelope: 2,
      title: 'Zarf 2 Kapı Sorusu: Kimyasal Kanıt & Çelişkili İfade',
      instructions: 'Zarf 2 kanıtlarını değerlendirerek failin alibisini çürüten teknik kanıtı belirleyin.',
      question: 'Hangi şüphelinin "Ben vagon koridoruna hiç girmedim" beyanı kimyasal florokarbon lekesiyle yalanlandı?',
      options: [
        {
          id: 'g2-opt-1',
          text: 'Mühendis Haluk Demir - Çantasındaki flakonda akonitin izi ve ayakkabısında vagon koridoruyla aynı leke saptandı.',
          isCorrect: true
        },
        {
          id: 'g2-opt-2',
          text: 'Av. Zerrin Kara - Kafeteryada otururken masasında zehir şişesi unutmuştu.',
          isCorrect: false
        },
        {
          id: 'g2-opt-3',
          text: 'Kondüktör Rüstem - Lateks eldiveni mutfak çekmecesinde saklamıştı.',
          isCorrect: false
        }
      ],
      explanation: 'Tam isabet! Haluk’un sırt çantasındaki kriyojenik flakon ve koridordaki ayakkabı izi alibisini yerle bir etti. Zarf 3 açıldı!',
      hintByRole: {
        forensics: 'Çantadaki amber flakonda akonitin ve florokarbon tespit edildi.',
        field: 'Haluk’un 42 numara ayakkabı tozu 3. vagon koridorundaki lekeyle eşleşti.'
      }
    },
    3: {
      envelope: 3,
      title: 'Zarf 3: Nihai Suçlama Oturumuna Geçiş',
      instructions: 'Peron kamera kayıtları ve mali MASAK raporu incelendi. Nihai suçlama oylaması başlatılıyor.',
      question: 'Masadaki tüm dedektifler katili, motifi ve kilit delili işaretlemeye hazır mı?',
      options: [
        {
          id: 'g3-opt-ready',
          text: 'Evet, Sirkeci Garı suikastçısı deşifre edildi. Kararları kilitle!',
          isCorrect: true
        }
      ],
      explanation: 'Nihai suçlama oturumu başlıyor! Her dedektif kendi cihazından failini ve kanıtını seçmelidir.',
      hintByRole: {
        field: 'Saat 22:52 kamera kaydında Haluk’un demlenen çay bardağına damlalıkla zehir damlattığı görülüyor.',
        archive: '1.8 Milyon Euro’luk kaçakçılık komisyonu ana motivasyondur.'
      }
    }
  },
  solution: {
    culpritId: 'muhendis-haluk',
    culpritName: 'Haluk Demir (Lojistik Operasyon Mühendisi)',
    motiveTitle: '1.8 Milyon Euro Kaçak Kimyasal Rüşvetini Korumak ve Savcılık İhbarını Engellemek',
    keyEvidenceTitle: 'Saat 22:52 Peron Kamera Kaydı ve Sırt Çantasındaki Akonitin Flakonu',
    verdictSummary:
      'Katil, kurbanın operasyon mühendisi Haluk Demir’dir! Haluk, şirketin soğuk hava zincirini kullanarak limandan kaçak kimyasal madde sokmuş ve 1.8 Milyon Euro rüşvet almıştır. Kurban Ferit Soydan bunu öğrenip trende son konuşmayı yapacağını ve savcılığa gideceğini Telegram’dan bildirince, Haluk suikast planını devreye sokmuştur. Peronda kondüktör Rüstem adaçayını doldurup sırtını döndüğü 14 saniyelik anda, lateks eldivenli eliyle bardağa 3 damla Akonitin zehri damlatmıştır. Kurban kapıyı içeriden kilitleyip çayını yudumladığında dakikalar içinde kalbi durmuştur.',
    fullChronology: [
      {
        time: '24 Ekim 21:10',
        action: 'Ferit Soydan, Haluk’a trende buluşup savcılığa teslim olmasını belirten Telegram mesajı gönderdi.',
        proof: 'Kurbanın Telefonu Siber Raporu'
      },
      {
        time: '24 Ekim 22:30',
        action: 'Haluk çantasına koyduğu akonitin ve florokarbon çözücüsüyle Sirkeci Garı’na geldi.',
        proof: 'Gar Giriş Turnike Kayıtları'
      },
      {
        time: '24 Ekim 22:52',
        action: 'Kondüktör Rüstem şeker almaya giderken Haluk porselen bardağa 3 damla zehir damlattı.',
        proof: '3. Peron Güvenlik Kamerası 22:52:28'
      },
      {
        time: '24 Ekim 22:55',
        action: 'Rüstem tepsiyi 3 nolu kompartımana teslim etti; Ferit kapıyı içeriden sürgüledi.',
        proof: 'Rüstem İfade Tutanağı'
      },
      {
        time: '24 Ekim 23:15',
        action: 'Kurban çayı bitirdikten 20 dakika sonra ventriküler fibrilasyonla yaşamını yitirdi.',
        proof: 'Adli Tıp Toksikoloji & Otopsi Raporu'
      }
    ],
    confessionAudioTranscript:
      '"(Sorgu Masası - 25 Ekim 04:15)\n' +
      'Başkomiser: Haluk, 22:52 kamera görüntüleri ve çantanızdaki akonitin şişesi masada. Ne diyeceksiniz?\n' +
      'Haluk Demir: (Titreyen ellerini yüzüne kapatır) ...Ben... Ben sadece kendimi korumak istedim! Ferit Bey beni bitirecekti! 15 yıl hapis yatamazdım! Bardağa damlattım... Kompartımana hiç girmedim bile, kapıyı kendisi kilitledi. Çayı içti ve bitti... O parayı hak etmiştim ben! Lanet olsun, o kameranın açısını hesaplayamadım..."'
  }
};

/**
 * Clean JSON template with schema instructions for admins to download and fill out
 */
export const SAMPLE_CASE_TEMPLATE: object = {
  "$schema": "https://masadaki-dosya.web.app/schemas/case-v1.json",
  "id": "yeni-vaka-id",
  "title": "Vaka Başlığı (Örn: Boğaz Yalısı Gizemi)",
  "subtitle": "Kısa Alt Başlık (Örn: Şüpheli Zehirlenme Vakası)",
  "difficulty": "Orta",
  "estimatedMinutes": 25,
  "minPlayers": 2,
  "maxPlayers": 6,
  "bannerTag": "YENİ DOSYA",
  "synopsis": "Olayın başlangıç hikayesi, kurbanın bulunma anı ve dedektiflerin masada çözeceği gizemin sürükleyici özeti...",
  "victim": {
    "name": "Kurbanın Adı Soyadı",
    "age": 45,
    "title": "Mesleği ve Toplumsal Konumu",
    "timeOfDeath": "Ölüm Zamanı (Örn: 15 Ekim 22:30)",
    "locationOfBody": "Cesedin Bulunduğu Yer",
    "causeInitial": "İlk Adli Tıp Bulgusu"
  },
  "suspects": [
    {
      "id": "supheli-1",
      "name": "Şüpheli Adı Soyadı",
      "title": "Unvanı / Mesleği",
      "age": 35,
      "relation": "Kurbanla İlişkisi",
      "description": "Şüphelinin geçmişi ve karakteri...",
      "alibi": "Cinayet anındaki mazereti...",
      "suspiciousQuotes": [
        "\"Şüpheli alıntı 1\"",
        "\"Şüpheli alıntı 2\""
      ],
      "motiveHypothesis": "Olası cinayet sebebi...",
      "initialSuspicion": 60,
      "photoPlaceholder": {
        "initials": "ŞA",
        "tint": "from-amber-950 to-stone-900",
        "silhouetteStyle": "bg-amber-900/30 border-amber-600/40 text-amber-300"
      }
    },
    {
      "id": "supheli-2",
      "name": "İkinci Şüpheli Adı",
      "title": "Unvanı / Mesleği",
      "age": 42,
      "relation": "Kurbanla İlişkisi",
      "description": "Şüphelinin geçmişi...",
      "alibi": "Cinayet anındaki mazereti...",
      "suspiciousQuotes": [
        "\"Şüpheli alıntı 1\""
      ],
      "motiveHypothesis": "Olası cinayet sebebi...",
      "initialSuspicion": 75,
      "photoPlaceholder": {
        "initials": "İŞ",
        "tint": "from-blue-950 to-slate-900",
        "silhouetteStyle": "bg-blue-900/30 border-blue-600/40 text-blue-300"
      }
    }
  ],
  "evidence": [
    {
      "id": "ev-101",
      "envelope": 1,
      "title": "Delil Başlığı",
      "category": "autopsy",
      "roleAccess": ["forensics", "profiler"],
      "summary": "Oyuncunun göreceği kısa delil özeti...",
      "fullReport": "Raporun detaylı metni ve teknik veriler...",
      "keyDeduction": "Bu delilden çıkarılması gereken kilit ipucu...",
      "metadata": {
        "date": "15 Ekim 23:00",
        "caseRef": "REF-2026-01",
        "confidentiality": "GİZLİ"
      }
    }
  ],
  "gates": {
    "1": {
      "envelope": 1,
      "title": "Zarf 1 Doğrulama Sorusu",
      "instructions": "Takımın çözmesi gereken aşama...",
      "question": "Zarf 1'i açmak için doğru soru metni?",
      "options": [
        {
          "id": "opt-1",
          "text": "Doğru seçenek açıklaması...",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Yanıltıcı yanlış seçenek...",
          "isCorrect": false
        }
      ],
      "explanation": "Doğru yanıt verildiğinde çıkacak açıklama...",
      "hintByRole": {
        "forensics": "Adli tıp uzmanına özel ipucu...",
        "profiler": "Profil uzmanına özel ipucu..."
      }
    },
    "2": {
      "envelope": 2,
      "title": "Zarf 2 Doğrulama Sorusu",
      "instructions": "Zarf 2'den Zarf 3'e geçiş sorusu...",
      "question": "Zarf 2'yi aşmak için kilit soru?",
      "options": [
        {
          "id": "opt-21",
          "text": "Doğru seçenek...",
          "isCorrect": true
        },
        {
          "id": "opt-22",
          "text": "Yanlış seçenek...",
          "isCorrect": false
        }
      ],
      "explanation": "Zarf 3'e geçiş açıklaması...",
      "hintByRole": {
        "forensics": "İpucu..."
      }
    },
    "3": {
      "envelope": 3,
      "title": "Zarf 3: Son Oylama Girişi",
      "instructions": "Dedektifler suçlama aşamasına geçmeye hazır mı?",
      "question": "Nihai suçlama oturumunu başlatmaya hazır mısınız?",
      "options": [
        {
          "id": "opt-ready",
          "text": "Evet, tüm deliller incelendi!",
          "isCorrect": true
        }
      ],
      "explanation": "Bireysel suçlama ekranına geçiliyor...",
      "hintByRole": {}
    }
  },
  "solution": {
    "culpritId": "supheli-2",
    "culpritName": "İkinci Şüpheli Adı",
    "motiveTitle": "Cinayetin Ana Motifi",
    "keyEvidenceTitle": "Cinayeti Çözen Kilit Kanıt Başlığı",
    "verdictSummary": "Hakimin mahkeme kararı ve olayın çözümü...",
    "fullChronology": [
      {
        "time": "Saat 22:00",
        "action": "Olayın başlangıç adımı...",
        "proof": "Bunu kanıtlayan delil"
      }
    ],
    "confessionAudioTranscript": "\"Katilin sorgu odasındaki itiraf metni...\""
  }
};
