import { WeddingInvitationConfig } from './types';

export const sampleWeddingConfig: WeddingInvitationConfig = {
  groom: {
    japaneseFirstName: '陽介',
    japaneseLastName: '片岡',
    romanFirstName: 'YOUSUKE',
    romanLastName: 'KATAOKA',
    birthDate: '1993年1月1日',
    bloodType: 'O',
    introduction: `1993年1月1日　東京都生まれ
O型　システムエンジニア
ドライブしたり友達とわいわい過ごす事が大好きです

遠方からお越しいただく方も多く
本当に申し訳ない気持ちでいっぱいです
それでもこうして集まっていただけることが
何よりも嬉しく　心強い限りです
当日　皆様にお会いできることを
心より楽しみにしております`,
    profileImage: '/img/groom-placeholder.jpg',
  },
  bride: {
    japaneseFirstName: '美咲',
    japaneseLastName: '湯浅',
    romanFirstName: 'MISAKI',
    romanLastName: 'YUASA',
    birthDate: '1994年4月13日',
    bloodType: 'A',
    introduction: `1994年4月13日　広島県生まれ
A型　ハーレーダビッドソン営業

バイクや映画・音楽を愛し
家族でキャンプを楽しむ時間がとても大切です

遠方からお越しいただく方も多く
心よりお詫び申し上げます
それでも大切な皆様と
同じ時間を共に過ごせることを
この上ない喜びと感じております
当日　皆様にお会いできることを
心より楽しみにしております`,
    profileImage: '/img/bride-placeholder.jpg',
  },
  greetingMessage: `皆様にはご健勝のことと
お慶び申し上げます
このたび　私たちは
結婚式を挙げることになりました
つきましては　親しい皆様の末永い
お力添えをいただきたく
心ばかりの小宴をもうけたいと存じます
おいそがしい中と存じますが
ご列席くださいますよう
お願い申し上げます`,
  ceremony: {
    type: 'ceremony',
    date: '2026.05.01',
    weekday: 'Fri',
    time: '10:00',
    venue: {
      name: 'THE SODOH HIGASHIYAMA KYOTO',
      address: `〒605-0824
京都府京都市東山区下河原通八坂塔ノ前上る南町409`,
      phone: '075-541-3333',
      website: 'https://www.thesodoh.com/wedding/access/',
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12239.113619231508!2d135.778927!3d34.999121!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108c55c3db09f%3A0xa2609c6915c96084!2z44K2IOOCveOCpuODieOCpiDmnbHlsbEg5Lqs6YO9IOODluODqeOCpOODgOODq-OCteODreODsw!5e1!3m2!1sja!2sjp!4v1771037557111!5m2!1sja!2sjp',
    },
  },
  reception: {
    type: 'reception',
    date: '2026.05.01',
    weekday: 'Fri',
    time: '10:00',
    venue: {
      name: 'YASAKA',
      address: `〒605-0824
京都府京都市東山区下河原通八坂塔ノ前上る南町409`,
      phone: '075-541-3333',
      website: 'https://www.thesodoh.com/wedding/access/',
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12239.113619231508!2d135.778927!3d34.999121!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108c55c3db09f%3A0xa2609c6915c96084!2z44K2IOOCveOCpuODieOCpiDmnbHlsbEg5Lqs6YO9IOODluODqeOCpOODgOODq-OCteODreODsw!5e1!3m2!1sja!2sjp!4v1771037557111!5m2!1sja!2sjp',
    },
  },
  rsvpDeadline: '2026年3月30日',
  rsvpDeadlineDate: '2026.03.30',
};
