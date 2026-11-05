import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CaseScenario, getScenarioTotalEnvelopes } from '../types';

test('Custom case scenario assembly includes envelopes, confession letter and media items', () => {
  const scenario: CaseScenario = {
    id: 'test-vaka',
    title: 'Boğaz Yalısında Gece',
    subtitle: 'Kandilli Gizemi',
    difficulty: 'Zor',
    estimatedMinutes: 60,
    minPlayers: 2,
    maxPlayers: 6,
    synopsis: 'Boğaz kıyısındaki yalıda gizemli bir olay...',
    victim: {
      name: 'Selim Karadağ',
      age: 52,
      title: 'Holding Sahibi',
      causeInitial: 'Zehirlenme',
      timeOfDeath: '23:45',
      locationOfBody: 'Çalışma Odası',
    },
    totalEnvelopes: 4,
    suspects: [
      {
        id: 'supheli-1',
        name: 'Av. Mert Soyer',
        title: 'Aile Avukatı',
        age: 41,
        relation: 'Hukuk Danışmanı',
        description: 'Soğukkanlı ve mesafeli tavırlar sergiliyor.',
        alibi: 'Olay saatinde bahçede telefonla konuşuyordu.',
        suspiciousQuotes: ['Ben sadece müvekkilimin haklarını korurum.'],
        initialSuspicion: 65,
        photoPlaceholder: { initials: 'MS', tint: 'bg-zinc-800', silhouetteStyle: 'shadow' },
      },
      {
        id: 'supheli-2',
        name: 'Hande Karadağ',
        title: 'Üvey Kızı',
        age: 26,
        relation: 'Mirasçı',
        description: 'Babasının ölüm haberini aldığında ağlamadı.',
        alibi: 'Üst kattaki odasında müzik dinliyordu.',
        suspiciousQuotes: ['Babamın bana hiçbir zaman güvenmediğini biliyorsunuz.'],
        initialSuspicion: 70,
        photoPlaceholder: { initials: 'HK', tint: 'bg-zinc-800', silhouetteStyle: 'shadow' },
      },
    ],
    evidence: [
      {
        id: 'delil-1-1',
        envelope: 1,
        title: '112 Acil İhbar ve Telsiz Dinleme Bandı',
        category: 'audio',
        mediaType: 'audio',
        mediaUrl: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA...',
        mediaCaption: 'Olay gecesi gelen ilk çağrı',
        roleAccess: ['forensics', 'profiler'],
        summary: 'Maktulün bulunduğu andaki panik sesleri.',
        fullReport: 'Resmi zabıt no 112: 23:45 sularında gelen ihbar...',
        keyDeduction: 'Ölüm saati tutarsızlığı.',
      },
      {
        id: 'delil-2-1',
        envelope: 2,
        title: 'Kuzey Bahçesi CCTV Güvenlik Kamerası',
        category: 'document',
        mediaType: 'video',
        mediaUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        mediaCaption: '23:40 sularında kapıdan çıkan şüpheli silüet',
        roleAccess: ['field', 'archive'],
        summary: 'Bahçe kapısında görülen şüpheli araç ve şahıs.',
        fullReport: 'CCTV Kayıt İncelemesi: 23:40:12 saatinde karanlıkta hareket tespit edildi.',
        keyDeduction: 'Katilin bahçe kapısından kaçtığı kanıtlandı.',
      },
    ],
    gates: {},
    solution: {
      culpritId: 'supheli-1',
      culpritName: 'Av. Mert Soyer',
      motiveTitle: 'Miras ve Şirket Hisseleri',
      keyEvidenceTitle: 'Ses kaydındaki arka plan sesleri ve kadeh analizi',
      verdictSummary: 'Avukat Mert, sahte vasiyetnameyi imzalatmak istedi ve zehri kadehe damlattı.',
      confessionLetter: 'Bu mektubu okuyorsanız artık oyun bitti demektir... O gece Selim gerçeği öğrenmişti.',
    },
  };

  assert.equal(getScenarioTotalEnvelopes(scenario), 4);
  assert.equal(scenario.evidence.length, 2);
  assert.equal(scenario.evidence[0].mediaType, 'audio');
  assert.equal(scenario.evidence[1].mediaType, 'video');
  assert.ok(scenario.solution.confessionLetter);
  assert.ok(scenario.solution.confessionLetter.includes('oyun bitti'));
});
