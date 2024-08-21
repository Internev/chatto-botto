export interface ILanguage {
  main: string
  alt?: string
}

export interface ILanguageSetup {
  [key: string]: ILanguage
}

export const languages: ILanguageSetup = {
  Japanese: {
    main: 'ja',
    alt: 'ro',
  },
  Spanish: {
    main: 'es',
  },
  French: {
    main: 'fr',
  },
  German: {
    main: 'de',
  },
  Italian: {
    main: 'it',
  },
  Portuguese: {
    main: 'pt',
  },
  Hungarian: {
    main: 'hu',
  },
  Chinese: {
    main: 'zh',
  },
  Korean: {
    main: 'ko',
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
