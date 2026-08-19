export const LEAGUE_NAME = 'Monster Maniacs'
export const LEAGUE_SIZE = 12
export const DRAFT_TIME = '8:00 PM ET'

export const TEAMS = [
  'Fat Bastards',
  'ArtistFormerlyKnown',
  'Little Hammers',
  'PIMPs',
  "Slingin' Salamis",
  'Spirtles',
  'The Red Hot Chili Pukas',
  'Yellowbellies',
  'Son of Pubis',
  'Thug Lyfe',
  "Robby's Fire",
  'Skat Pack',
] as const

export type TeamName = (typeof TEAMS)[number]
