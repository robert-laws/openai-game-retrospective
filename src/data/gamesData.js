const ASSET_BASE = `${import.meta.env.BASE_URL}assets/thumbnails/`;

export const gamesData = [
  {
    id: 'super-mario-world',
    title: 'Super Mario World',
    year: 1990,
    platform: 'SNES',
    description:
      'Nintendo expanded 2D platforming into a massive, tightly designed map with hidden exits, precision movement, and Yoshi riding mechanics.',
    funFact: 'Its overworld route system inspired progression maps in many later platformers.',
    thumbnail: `${ASSET_BASE}super-mario-world.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=B_r9N3D5Kss',
    embedTrailer: true
  },
  {
    id: 'zelda-link-to-the-past',
    title: 'The Legend of Zelda: A Link to the Past',
    year: 1991,
    platform: 'SNES',
    description:
      'A foundational action-adventure with elegant dungeon design, puzzle cadence, and the iconic dual-world structure.',
    funFact: 'Many modern Zelda staples, like the Master Sword setup, were formalized here.',
    thumbnail: `${ASSET_BASE}zelda-lttp.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=V8RkqQ8fQs4',
    embedTrailer: true
  },
  {
    id: 'sonic-the-hedgehog',
    title: 'Sonic the Hedgehog',
    year: 1991,
    platform: 'Sega Genesis',
    description:
      'High-speed level flow and mascot-first style gave Sega a defining identity in the early console wars.',
    funFact: 'Green Hill Zone remains one of the most recognized opening stages in game history.',
    thumbnail: `${ASSET_BASE}sonic-hedgehog.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=ZGdQwCwA8Do',
    embedTrailer: false
  },
  {
    id: 'street-fighter-ii',
    title: 'Street Fighter II',
    year: 1991,
    platform: 'Arcade / SNES',
    description:
      'Defined the one-on-one fighting template with unique characters, special moves, and competitive depth.',
    funFact: 'Arcade operators reported major revenue spikes after installing SFII cabinets.',
    thumbnail: `${ASSET_BASE}street-fighter-ii.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=Y2h5nQ4xG7o',
    embedTrailer: false
  },
  {
    id: 'chrono-trigger',
    title: 'Chrono Trigger',
    year: 1995,
    platform: 'SNES',
    description:
      'A landmark RPG featuring visible encounters, combo tech attacks, and meaningful branching endings.',
    funFact: 'Its "Dream Team" included key creators from Dragon Quest and Final Fantasy.',
    thumbnail: `${ASSET_BASE}chrono-trigger.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=Ff8w5W4x6mM',
    embedTrailer: false
  },
  {
    id: 'final-fantasy-vii',
    title: 'Final Fantasy VII',
    year: 1997,
    platform: 'PlayStation',
    description:
      'A cinematic RPG breakthrough that helped define the CD era with pre-rendered scenes and big narrative stakes.',
    funFact: 'Its global launch momentum made JRPGs mainstream in many Western markets.',
    thumbnail: `${ASSET_BASE}final-fantasy-vii.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=QDz9A4ByHIQ',
    embedTrailer: false
  },
  {
    id: 'metal-gear-solid',
    title: 'Metal Gear Solid',
    year: 1998,
    platform: 'PlayStation',
    description:
      'Stealth-action design met cinematic presentation, voice acting, and experimental fourth-wall moments.',
    funFact: "The Psycho Mantis fight is still cited as one of gaming's boldest meta encounters.",
    thumbnail: `${ASSET_BASE}metal-gear-solid.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=MeYbHWQrM9A',
    embedTrailer: false
  },
  {
    id: 'doom',
    title: 'Doom',
    year: 1993,
    platform: 'PC',
    description:
      'Fast first-person action, moddable content, and networked deathmatch shaped the future of shooters.',
    funFact: 'Its shareware distribution model accelerated player-to-player discovery before modern app stores.',
    thumbnail: `${ASSET_BASE}doom.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=BSsfjHCFosw',
    embedTrailer: true
  },
  {
    id: 'half-life',
    title: 'Half-Life',
    year: 1998,
    platform: 'PC',
    description:
      'Merged narrative pacing and action without traditional cutaway cutscenes, raising FPS storytelling standards.',
    funFact: 'Its modding scene produced Counter-Strike, one of the biggest multiplayer franchises ever.',
    thumbnail: `${ASSET_BASE}half-life.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=5Wavn29LMRs',
    embedTrailer: false
  },
  {
    id: 'super-metroid',
    title: 'Super Metroid',
    year: 1994,
    platform: 'SNES',
    description:
      'Atmospheric exploration, layered world traversal, and ability-driven map design became genre canon.',
    funFact: 'The term "Metroidvania" later captured design DNA this game helped define.',
    thumbnail: `${ASSET_BASE}super-metroid.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=nYQfWbQ3M5k',
    embedTrailer: false
  },
  {
    id: 'pokemon-red-blue',
    title: 'Pokemon Red & Blue',
    year: 1996,
    platform: 'Game Boy',
    description:
      'Portable creature collection plus link-cable trading created one of the strongest social gameplay loops of the decade.',
    funFact: 'Version exclusives nudged real-world player collaboration long before live-service design.',
    thumbnail: `${ASSET_BASE}pokemon-red-blue.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=JuYeHPFR3f0',
    embedTrailer: false
  },
  {
    id: 'starcraft',
    title: 'StarCraft',
    year: 1998,
    platform: 'PC',
    description:
      'Three asymmetric factions with tight balance set a benchmark for competitive real-time strategy.',
    funFact: 'Its Korean esports ecosystem became a blueprint for modern competitive gaming.',
    thumbnail: `${ASSET_BASE}starcraft.svg`,
    trailerUrl: 'https://www.youtube.com/watch?v=-00uQzXyujI',
    embedTrailer: false
  }
];
