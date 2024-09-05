import { ILanguageCode } from '@/_context/types'
import { VoiceId } from '@aws-sdk/client-polly'

interface IVoice {
  gender: 'Female' | 'Male'
  id: VoiceId
  languageCode: string
  languageName: string
  name: string
  supportedEngines: 'neural' | 'standard' | ('neural' | 'standard')[]
}

export interface ILanguage {
  name: string
  main: ILanguageCode
  alt?: ILanguageCode
  voices: IVoice[]
}

export interface ILanguageSetup {
  [key: string]: ILanguage
}

export const languages: ILanguageSetup = {
  Japanese: {
    name: 'Japanese',
    main: 'ja',
    alt: 'ro',
    voices: [
      {
        gender: 'Female',
        id: 'Kazuha',
        languageCode: 'ja-JP',
        languageName: 'Japanese',
        name: 'Kazuha',
        supportedEngines: ['neural'],
      },
      {
        gender: 'Female',
        id: 'Tomoko',
        languageCode: 'ja-JP',
        languageName: 'Japanese',
        name: 'Tomoko',
        supportedEngines: ['neural'],
      },
      {
        gender: 'Male',
        id: 'Takumi',
        languageCode: 'ja-JP',
        languageName: 'Japanese',
        name: 'Takumi',
        supportedEngines: ['neural', 'standard'],
      },
    ],
  },
  Spanish: {
    name: 'Spanish',
    main: 'es',
    voices: [
      {
        gender: 'Female',
        id: 'Lucia',
        languageCode: 'es-ES',
        languageName: 'Castilian Spanish',
        name: 'Lucia',
        supportedEngines: ['neural', 'standard'],
      },
      {
        gender: 'Male',
        id: 'Sergio',
        languageCode: 'es-ES',
        languageName: 'Castilian Spanish',
        name: 'Sergio',
        supportedEngines: ['neural'],
      },
      {
        gender: 'Female',
        id: 'Mia',
        languageCode: 'es-MX',
        languageName: 'Mexican Spanish',
        name: 'Mia',
        supportedEngines: ['neural', 'standard'],
      },
      {
        gender: 'Male',
        id: 'Andres',
        languageCode: 'es-MX',
        languageName: 'Mexican Spanish',
        name: 'Andrés',
        supportedEngines: ['neural'],
      },
    ],
  },
  French: {
    name: 'French',
    main: 'fr',
    voices: [
      {
        gender: 'Female',
        id: 'Lea',
        languageCode: 'fr-FR',
        languageName: 'French',
        name: 'Léa',
        supportedEngines: ['neural', 'standard'],
      },
      {
        gender: 'Male',
        id: 'Remi',
        languageCode: 'fr-FR',
        languageName: 'French',
        name: 'Rémi',
        supportedEngines: ['neural'],
      },
    ],
  },
  German: {
    name: 'German',
    main: 'de',
    voices: [
      {
        gender: 'Female',
        id: 'Vicki',
        languageCode: 'de-DE',
        languageName: 'German',
        name: 'Vicki',
        supportedEngines: ['neural', 'standard'],
      },
      {
        gender: 'Male',
        id: 'Daniel',
        languageCode: 'de-DE',
        languageName: 'German',
        name: 'Daniel',
        supportedEngines: ['neural'],
      },
    ],
  },
  Italian: {
    name: 'Italian',
    main: 'it',
    voices: [
      {
        gender: 'Female',
        id: 'Bianca',
        languageCode: 'it-IT',
        languageName: 'Italian',
        name: 'Bianca',
        supportedEngines: ['neural', 'standard'],
      },
      {
        gender: 'Male',
        id: 'Adriano',
        languageCode: 'it-IT',
        languageName: 'Italian',
        name: 'Adriano',
        supportedEngines: ['neural'],
      },
    ],
  },
  Portuguese: {
    name: 'Portuguese',
    main: 'pt',
    voices: [
      {
        gender: 'Female',
        id: 'Vitoria',
        languageCode: 'pt-BR',
        languageName: 'Brazilian Portuguese',
        name: 'Vitória',
        supportedEngines: ['neural', 'standard'],
      },
      {
        gender: 'Female',
        id: 'Camila',
        languageCode: 'pt-BR',
        languageName: 'Brazilian Portuguese',
        name: 'Camila',
        supportedEngines: ['neural', 'standard'],
      },
      {
        gender: 'Male',
        id: 'Thiago',
        languageCode: 'pt-BR',
        languageName: 'Brazilian Portuguese',
        name: 'Thiago',
        supportedEngines: ['neural'],
      },
      {
        gender: 'Female',
        id: 'Ines',
        languageCode: 'pt-PT',
        languageName: 'Portuguese',
        name: 'Inês',
        supportedEngines: ['neural', 'standard'],
      },
    ],
  },
  Swedish: {
    name: 'Swedish',
    main: 'sv',
    voices: [
      {
        gender: 'Female',
        id: 'Elin',
        languageCode: 'sv-SE',
        languageName: 'Swedish',
        name: 'Elin',
        supportedEngines: ['neural'],
      },
    ],
  },
  Chinese: {
    name: 'Chinese',
    main: 'zh',
    voices: [
      {
        gender: 'Female',
        id: 'Zhiyu',
        languageCode: 'cmn-CN',
        languageName: 'Chinese Mandarin',
        name: 'Zhiyu',
        supportedEngines: ['neural', 'standard'],
      },
      {
        gender: 'Female',
        id: 'Hiujin',
        languageCode: 'yue-CN',
        languageName: 'Cantonese',
        name: 'Hiujin',
        supportedEngines: ['neural'],
      },
    ],
  },
  Korean: {
    name: 'Korean',
    main: 'ko',
    voices: [
      {
        gender: 'Female',
        id: 'Seoyeon',
        languageCode: 'ko-KR',
        languageName: 'Korean',
        name: 'Seoyeon',
        supportedEngines: ['neural', 'standard'],
      },
    ],
  },
  // Dutch: {
  //   main: 'nl',
  // },
  // Russian: {
  //   main: 'ru',
  // },
  // Arabic: {
  //   main: 'ar',
  // },
  // Hindi: {
  //   main: 'hi',
  // },
  // Bengali: {
  //   main: 'bn',
  // },
  // Punjabi: {
  //   main: 'pa',
  // },

  // Turkish: {
  //   main: 'tr',
  // },
}

export const languageOptions = Object.keys(languages)
