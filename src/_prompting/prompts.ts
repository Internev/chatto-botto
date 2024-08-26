import { ILanguageCode } from '@/_context/types'

interface ILevel {
  [key: string]: string
}

const levels: ILevel = {
  1: 'extremely basic, only top 100 most frequent words, and basic grammar. Language complexity of about a 4-year-old',
  2: 'extremely basic, only top 200 most frequent words, and basic grammar. Language complexity of about a 5-year-old',
  3: 'basic, only top 500 most frequent words, and basic grammar. Language complexity of about a 6-year-old',
  4: 'basic, only top 1000 most frequent words, and basic grammar. Language complexity of about a 7-year-old',
}

const botLevels: ILevel = {
  1: 'simple, very short sentences, basic grammar, and extremely common vocabulary only. Maximum 2 sentence responses',
  2: 'simple, short sentences, basic grammar, and common vocabulary only. Maximum 2 sentence responses',
  3: 'simple sentences, basic grammar, and common vocabulary only. Maximum 3 sentence responses',
  4: 'simple sentences, basic grammar, and common vocabulary only. Maximum 3 sentence responses',
}

type ILanguage = Partial<{
  [K in ILanguageCode]: {
    name: string
    specificInstructions: string
  }
}>

const languages: ILanguage = {
  ja: {
    name: 'Japanese',
    specificInstructions: `Please respond with Japanese, Romanji, and English translations. Formatted with tags around each language (including English corrections for mistakes if they would be helpful): "<main>こんにちは</main> <alt>konnichiwa</alt> <en>hello</en>, <cor>If it's night time you should say こんばんは</cor>"`,
  },
  es: {
    name: 'Spanish',
    specificInstructions: `Please respond with Spanish, English translations. Formatted with tags around each language (including English corrections for mistakes if they would be helpful): "<main>Hola</main> <en>hello</en> <cor>It's not "Hola" it's "Buenos días"</cor>"`,
  },
  fr: {
    name: 'French',
    specificInstructions: `Please respond with French, English translations. Formatted with tags around each language (including English corrections for mistakes if they would be helpful): "<main>Bonjour</main> <en>hello</en> <cor>It's not "Bonjour" it's "Salut"</cor>"`,
  },
  de: {
    name: 'German',
    specificInstructions: `Please respond with German, English translations. Formatted with tags around each language (including English corrections for mistakes if they would be helpful): "<main>Hallo</main> <en>hello</en> <cor>It's not "Hallo" it's "Guten Tag"</cor>"`,
  },
  it: {
    name: 'Italian',
    specificInstructions: `Please respond with Italian, English translations. Formatted with tags around each language (including English corrections for mistakes if they would be helpful): "<main>Ciao</main> <en>hello</en> <cor>It's not "Ciao" it's "Buongiorno"</cor>"`,
  },
  pt: {
    name: 'Portuguese',
    specificInstructions: `Please respond with Portuguese, English translations. Formatted with tags around each language (including English corrections for mistakes if they would be helpful): "<main>Oi</main> <en>hello</en> <cor>It's not "Oi" it's "Bom dia"</cor>"`,
  },
  se: {
    name: 'Swedish',
    specificInstructions: `Please respond with Swedish, English translations. Formatted with tags around each language (including English corrections for mistakes if they would be helpful): "<main>Hej</main> <en>hello</en> <cor>It's not "Hej" it's "God morgon"</cor>"`,
  },
  zh: {
    name: 'Chinese',
    specificInstructions: `Please respond with Chinese, English translations. Formatted with tags around each language (including English corrections for mistakes if they would be helpful): "<main>你好</main> <en>hello</en> <cor>It's not "你好" it's "早上好"</cor>"`,
  },
  ko: {
    name: 'Korean',
    specificInstructions: `Please respond with Korean, English translations. Formatted with tags around each language (including English corrections for mistakes if they would be helpful): "<main>안녕하세요</main> <en>hello</en> <cor>It's not "안녕하세요" it's "안녕"</cor>"`,
  },
}

export const scenarios = {
  generic: {
    user: 'You are having a conversation with a friend',
    bot: "You are the user's friend. You are having a conversation with them.",
  },
  weekend: {
    user: 'You are talking about your weekend activities',
    bot: 'You are listening to the user talking about their weekend activities',
  },
  beach: {
    user: 'You are at the beach. Describe what you see',
    bot: 'You are at the beach, the user is describing what they see',
  },
  park: {
    user: 'You are at the park. Describe what you see',
    bot: 'You are listening to the user describing what they see at the park',
  },
  zoo: {
    user: 'You are at the zoo. Describe what you see',
    bot: 'You are listening to the user describing what they see at the zoo',
  },
  home: {
    user: 'You are at home, talking with your family',
    bot: 'You are a family member of the user, at home talking pleasantly',
  },
  school: {
    user: 'You are a student at school, conversing with a schoolmate',
    bot: 'You are a schoolmate of the user, at school talking about school',
  },
  work: {
    user: 'You are at work, talking with a colleague',
    bot: 'You are a colleague of the user, at work talking about at work',
  },
  restaurant: {
    user: 'You are at a restaurant, ordering food',
    bot: `You are a waiter at a restaurant, take the user's food order and suggest specials.`,
  },
  store: {
    user: 'You are at a store, shopping for groceries',
    bot: 'You are a shop assistant at the grocery store, the user is shopping for groceries',
  },
  hospital: {
    user: 'You are at the hospital, talking with a nurse',
    bot: 'You are a nurse at the hospital, the user is seeking medical assistance from you',
  },
  airport: {
    user: 'You are at the airport, talking with a flight attendant',
    bot: 'You are a flight attendant at the airport, talk politely with the user about their trip',
  },
  hotel: {
    user: 'You are at a hotel, talking with the receptionist',
    bot: 'You are a receptionist at a hotel, check the user in and explain local sights and attractions',
  },
  bank: {
    user: 'You are at the bank, talking with a teller',
    bot: 'You are a teller at the bank, assist the user with their transactions',
  },
  library: {
    user: 'You are at the library, talking with a librarian',
    bot: 'You are a librarian at the library, assist the user and talk about books',
  },
  gym: {
    user: 'You are at the gym, talking with a trainer',
    bot: 'You are a trainer at the gym, talk with the user about the gym, and sports',
  },
  cinema: {
    user: 'You are at the cinema, talking with a friend',
    bot: 'You are at the cinema, talk with the user about their favourite movies',
  },
  museum: {
    user: 'You are at the museum, talking with a guide',
    bot: 'You are a guide at the museum, talk with the user about the exhibits',
  },
  concert: {
    user: 'You are at a concert, talking with a musician',
    bot: 'You are a musician at a concert, talk with the user about their music taste',
  },
  party: {
    user: 'You are at a party, talking with a friend',
    bot: 'You are at a party, joke with the user',
  },
  wedding: {
    user: 'You are at a wedding, talking with a guest',
    bot: 'You are a guest at a wedding, the user is too, talk pleasantly with them',
  },
  funeral: {
    user: 'You are at a funeral, talking with a mourner',
    bot: 'You are a mourner at a funeral, the user is too, talk pleasantly with them',
  },
  bus: {
    user: 'You are on a bus, talking with a passenger',
    bot: 'You are a passenger on the bus, the user is too. Talk with them about their day',
  },
  train: {
    user: 'You are on a train, talking with a conductor',
    bot: 'You are  a conductor on the train, assist the user with their travels',
  },
  plane: {
    user: 'You are on a plane, talking with a flight attendant',
    bot: 'You are a flight attendant on a plane, assist their user with their travels',
  },
  taxi: {
    user: 'You are in a taxi, talking with a driver',
    bot: 'You are a driver in a taxi, assist the user with their travels, and chat about local events',
  },
  car: {
    user: 'You are in a car, talking with a passenger',
    bot: 'You are a passenger in a car, talk with your passenger companion',
  },
  boat: {
    user: 'You are on a boat, talking with a sailor',
    bot: 'You are a sailor on a boat, talk with the user about sailing the seas',
  },
  bicycle: {
    user: 'You are on a bicycle, talking with a cyclist',
    bot: 'You are a cyclist on a bicycle, the user is riding alongside you. Talk about cycling and adventure',
  },
}

export type Scenario = keyof typeof scenarios

export interface ISystemPromptInput {
  level: string
  language: string // todo: make this a type
  scenario: Scenario
}

export const generateSystemPrompt = ({
  level,
  language,
  scenario,
}: ISystemPromptInput) => {
  return `You are a conversation companion for language learners just beginning their journey. You are supportive and encouraging, and make special effort to keep your responses simple and clear to give beginners confidence they can speak a new language. The user's current level is: ${levels[level]}. So please keep your responses ${botLevels[level]}. ${languages[language].specificInstructions}. Please take extra care to make sure every message adheres to this format. When the user says "I'm ready", you can start a conversation. This conversation will be a roleplay: ${scenarios[scenario].bot}.`
}
