// Usage: node --env-file=.env.local scripts/generate-stories.mjs
// Uses Gemini to write stories + Imagen 4 for illustrations for all creatures below.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY. Add it to .env.local and run:')
  console.error('  node --env-file=.env.local scripts/generate-stories.mjs')
  process.exit(1)
}

const STORIES_DIR = join(process.cwd(), 'content/stories')
const IMAGES_DIR = join(process.cwd(), 'public/images/stories')
mkdirSync(IMAGES_DIR, { recursive: true })

// ---------------------------------------------------------------------------
// 100 new creatures
// ---------------------------------------------------------------------------
const CREATURES = [
  // North America
  { slug: 'jersey-devil', name: 'Jersey Devil', region: 'North America', regionSlug: 'north-america', category: 'Demon', dangerRating: 4, brief: 'The bat-winged, goat-headed monster of the New Jersey Pine Barrens, born as the cursed 13th child of Mother Leeds in 1735' },
  { slug: 'wampus-cat', name: 'Wampus Cat', region: 'North America', regionSlug: 'north-america', category: 'Shapeshifter', dangerRating: 3, brief: 'Appalachian shape-shifting creature, half woman half mountain lion, born from a Cherokee woman cursed for spying on sacred male rituals' },
  { slug: 'piasa', name: 'Piasa', region: 'North America', regionSlug: 'north-america', category: 'Ancient Beast', dangerRating: 5, brief: 'The bird that devours men of the Illini people — an enormous dragon-painted on Mississippi River bluffs, which hunted warriors until a chief defeated it with a trap of poison arrows' },
  { slug: 'hidebehind', name: 'Hidebehind', region: 'North America', regionSlug: 'north-america', category: 'Unknown Entity', dangerRating: 4, brief: 'American logging folklore creature that always hides behind trees — when you turn around, it has already moved behind the next one, and loggers who walked into forests and never returned met it' },
  { slug: 'bigfoot', name: 'Bigfoot', region: 'North America', regionSlug: 'north-america', category: 'Unknown Beast', dangerRating: 2, brief: 'The most documented unknown creature in North America — enormous, bipedal, covered in dark hair, leaving footprints across the Pacific Northwest for centuries before European contact' },
  { slug: 'flying-head', name: 'Flying Head', region: 'North America', regionSlug: 'north-america', category: 'Ancient Evil', dangerRating: 5, brief: 'The Great Head of Iroquois legend — a giant disembodied head covered in tangled hair with enormous jaws, driven by insatiable hunger, sweeping across the sky devouring everything' },
  { slug: 'ahuizotl', name: 'Ahuizotl', region: 'North America', regionSlug: 'north-america', category: 'Water Demon', dangerRating: 4, brief: 'The Aztec water dog — a smooth-skinned creature with a hand on the end of its tail used to drag people into lakes, specifically targeting their eyes, teeth, and nails as offerings to rain gods' },
  { slug: 'ijiraq', name: 'Ijiraq', region: 'North America', regionSlug: 'north-america', category: 'Shapeshifter', dangerRating: 4, brief: 'Inuit shapeshifter that steals children and hides them in inaccessible places — it has no fixed form, cannot be seen directly, and leaves no tracks' },
  { slug: 'champ', name: 'Champ', region: 'North America', regionSlug: 'north-america', category: 'Water Beast', dangerRating: 3, brief: 'The lake monster of Lake Champlain — documented by the Abenaki and Iroquois nations long before European contact, now with over 300 eyewitness accounts across two centuries' },
  { slug: 'nagual', name: 'Nagual', region: 'North America', regionSlug: 'north-america', category: 'Shapeshifter', dangerRating: 4, brief: 'Mesoamerican sorcerers who transform into jaguars, wolves, or eagles to harm enemies at night — a tradition stretching from Aztec culture through modern Mexican and Guatemalan communities' },

  // Latin America
  { slug: 'ciguapa', name: 'Ciguapa', region: 'Latin America', regionSlug: 'latin-america', category: 'Forest Spirit', dangerRating: 3, brief: 'Dominican supernatural women with backwards feet who roam the mountains at night, their beauty impossible to resist, luring men to follow them into the forest never to return' },
  { slug: 'encantado', name: 'Encantado', region: 'Latin America', regionSlug: 'latin-america', category: 'Shapeshifter', dangerRating: 3, brief: 'Brazilian pink river dolphins who transform into charming humans, attend parties, seduce people, and return to the Amazon — sometimes taking victims with them to the underwater city of Encante' },
  { slug: 'pishtaco', name: 'Pishtaco', region: 'Latin America', regionSlug: 'latin-america', category: 'Vampire', dangerRating: 4, brief: 'Andean pale-skinned beings who extract human fat from sleeping victims — the fat is believed to be sold to foreign powers or used to lubricate church bells and machinery' },
  { slug: 'candileja', name: 'Candileja', region: 'Latin America', regionSlug: 'latin-america', category: 'Fire Ghost', dangerRating: 3, brief: 'Colombian legend of a sinful woman condemned to wander as a roaming ball of fire — she sets fields and forests ablaze and drives animals mad, appearing especially on stormy nights in the countryside' },
  { slug: 'alux', name: 'Alux', region: 'Latin America', regionSlug: 'latin-america', category: 'Nature Spirit', dangerRating: 2, brief: 'Small Maya supernatural beings who protect cornfields and forests — harmless if a farmer builds them a small house and makes offerings, but viciously mischievous if forgotten or disrespected' },
  { slug: 'peuchen', name: 'Peuchen', region: 'Latin America', regionSlug: 'latin-america', category: 'Vampire', dangerRating: 4, brief: 'Chilean creature that flies and takes the form of a giant serpent or bat — it paralyzes victims with its gaze and drains their blood completely, leaving them as hollow husks in the morning' },
  { slug: 'minhocao', name: 'Minhocão', region: 'Latin America', regionSlug: 'latin-america', category: 'Ancient Beast', dangerRating: 4, brief: 'The great worm of the Brazilian interior — an earthworm-like creature of enormous size that collapses roads, devours livestock, and upends river banks, last reported in the 1870s with no explanation' },
  { slug: 'madremonte', name: 'Madremonte', region: 'Latin America', regionSlug: 'latin-america', category: 'Forest Spirit', dangerRating: 3, brief: 'The Mother of the Mountain in Colombian folklore — a powerful female spirit who sends fevers, confusion, and gets hunters lost for days when they damage the forests she protects' },
  { slug: 'cipactli', name: 'Cipactli', region: 'Latin America', regionSlug: 'latin-america', category: 'Primordial Monster', dangerRating: 5, brief: 'The Aztec primordial sea monster from whose body the earth was made — a crocodilian creature with mouths at every joint, still hungry beneath the world, requiring blood sacrifice to stay still' },
  { slug: 'anhanga', name: 'Anhangá', region: 'Latin America', regionSlug: 'latin-america', category: 'Forest Spirit', dangerRating: 3, brief: 'Guardian spirit of the Brazilian Amazon that protects animals by driving mad any hunter who kills excessively — it mimics animal cries to lead overhunters astray until they are truly lost' },

  // Western Europe
  { slug: 'will-o-wisp', name: "Will-o'-the-Wisp", region: 'Western Europe', regionSlug: 'western-europe', category: 'Light Spirit', dangerRating: 3, brief: "Mysterious lights over marshes that lure travelers from safe paths — documented across Britain, France, and Germany for centuries, associated with the souls of the unbaptized dead" },
  { slug: 'redcap', name: 'Redcap', region: 'Western Europe', regionSlug: 'western-europe', category: 'Goblin', dangerRating: 5, brief: "Scottish border goblin that lives in ruined castles and murders travelers to dye its cap with their blood — if the cap dries out, it dies, so it kills constantly, faster than any horse" },
  { slug: 'erlking', name: 'Erlking', region: 'Western Europe', regionSlug: 'western-europe', category: 'Death Spirit', dangerRating: 5, brief: 'The Germanic king of the elves who appears to dying children, visible only to them — a father rides desperately through the night as his son describes the beautiful figure beckoning him' },
  { slug: 'jenny-greenteeth', name: 'Jenny Greenteeth', region: 'Western Europe', regionSlug: 'western-europe', category: 'Water Hag', dangerRating: 4, brief: 'Lancashire water hag who lurks beneath the green algae on still pools — children drawn to the bright surface find a hand reaching up, and the Lancashire warning has kept children away from ponds for centuries' },
  { slug: 'alp', name: 'The Alp', region: 'Western Europe', regionSlug: 'western-europe', category: 'Nightmare Demon', dangerRating: 3, brief: 'Germanic nightmare creature that rides sleeping people as a horse — it enters as a moth or mist through any opening, sits on the chest causing sleep paralysis, and is impossible to stop with locks' },
  { slug: 'loup-garou', name: 'Loup-garou', region: 'Western Europe', regionSlug: 'western-europe', category: 'Shapeshifter', dangerRating: 4, brief: "France's werewolf — a man cursed by a broken Lenten vow or a pact with the devil to transform for a hundred days, able to pass the curse by drawing another person's blood before transformation ends" },
  { slug: 'strix', name: 'Strix', region: 'Western Europe', regionSlug: 'western-europe', category: 'Vampire Witch', dangerRating: 4, brief: 'The Roman screech owl that feeds on infants — ancient writers recorded it as a real creature in the forests of Italy whose night-cry announced death, later merging with witch traditions' },
  { slug: 'kraken', name: 'Kraken', region: 'Western Europe', regionSlug: 'western-europe', category: 'Sea Monster', dangerRating: 5, brief: "Norway's island-sized sea monster first formally described in 1752 — so vast that sailors who anchored on its back built fires before it dived, creating whirlpools that consumed entire fleets" },
  { slug: 'huldra', name: 'Huldra', region: 'Western Europe', regionSlug: 'western-europe', category: 'Forest Seductress', dangerRating: 3, brief: 'Scandinavian forest spirit who appears as a beautiful woman with a hidden cow tail — she lures men into the forest and they return years later, aged, unable to explain what happened' },
  { slug: 'draugen', name: 'Draugen', region: 'Western Europe', regionSlug: 'western-europe', category: 'Sea Ghost', dangerRating: 5, brief: "Norwegian ghost of every man drowned at sea, sailing half a boat with a tangled seaweed beard — fishermen who see it clearly before a voyage do not return from that voyage" },

  // Eastern Europe
  { slug: 'mora', name: 'Mora', region: 'Eastern Europe', regionSlug: 'eastern-europe', category: 'Nightmare Spirit', dangerRating: 3, brief: 'South Slavic spirit of nightmares that visits sleepers as a moth, strand of hair, or wisp of mist — sits on the chest causing sleep paralysis, waking nightmares, and illness over time' },
  { slug: 'strzyga', name: 'Strzyga', region: 'Eastern Europe', regionSlug: 'eastern-europe', category: 'Vampire', dangerRating: 5, brief: 'Polish creature born with two souls and two hearts — when the body dies, one soul leaves but one remains, driving the corpse to drain vitality from its surviving family members one by one' },
  { slug: 'domovoi', name: 'Domovoi', region: 'Eastern Europe', regionSlug: 'eastern-europe', category: 'Household Spirit', dangerRating: 2, brief: 'The Slavic household spirit who lives behind the stove — he protects the home when treated with respect but when neglected he tangles hair, pinches sleepers, and strangles livestock' },
  { slug: 'poludnitsa', name: 'Poludnitsa', region: 'Eastern Europe', regionSlug: 'eastern-europe', category: 'Field Demon', dangerRating: 4, brief: "Lady Midday of Russian tradition — a whirlwind that becomes a woman at noon during harvest, asking unanswerable questions until the laborer's neck snaps from the sustained impossible conversation" },
  { slug: 'chort', name: 'Chort', region: 'Eastern Europe', regionSlug: 'eastern-europe', category: 'Devil', dangerRating: 4, brief: 'The Russian lesser devil — smaller than Satan but more present in daily life, appearing at crossroads and in dark forests, making small destructive pacts and causing mischief that accumulates into ruin' },
  { slug: 'upir', name: 'Upír', region: 'Eastern Europe', regionSlug: 'eastern-europe', category: 'Vampire', dangerRating: 5, brief: 'The original Slavic vampire — a corpse that rises to drain blood from its family, beginning with the nearest relative, and which can only be destroyed by staking through the mouth to pin the soul inside' },
  { slug: 'dvorovoi', name: 'Dvorovoi', region: 'Eastern Europe', regionSlug: 'eastern-europe', category: 'Yard Spirit', dangerRating: 2, brief: "Russian spirit of the yard and outbuildings — he dislikes animals whose coloring differs from his own appearance, tormenting them until they waste away, and new livestock must be introduced carefully" },
  { slug: 'gamayun', name: 'Gamayun', region: 'Eastern Europe', regionSlug: 'eastern-europe', category: 'Prophetic Bird', dangerRating: 3, brief: 'Russian mythological bird with a woman\'s head who knows all things past and future — to hear her voice is to receive prophecy, but she only speaks of grief and ruin, never of rescue' },
  { slug: 'blud', name: 'Blud', region: 'Eastern Europe', regionSlug: 'eastern-europe', category: 'Forest Spirit', dangerRating: 2, brief: "Russian spirit of confusion that leads travelers in circles in forests — unlike the Leshy it cannot be bargained with or tricked, only endured until dawn when it loses its power" },
  { slug: 'alkonost', name: 'Alkonost', region: 'Eastern Europe', regionSlug: 'eastern-europe', category: 'Sorrow Bird', dangerRating: 3, brief: "Russian paradise bird with a woman's face whose song of sorrow is so beautiful that listeners forget everything they know and lose all will to continue living — they simply stop" },

  // Middle East / North Africa
  { slug: 'al', name: 'Al', region: 'Middle East & North Africa', regionSlug: 'middle-east-north-africa', category: 'Birth Demon', dangerRating: 5, brief: 'Armenian and Iranian demon with iron teeth and copper claws who attacks women in childbirth — it steals the liver from mother or newborn, and must be prevented by keeping iron and iron-bladed tools nearby during labor' },
  { slug: 'qareen', name: 'Qareen', region: 'Middle East & North Africa', regionSlug: 'middle-east-north-africa', category: 'Shadow Spirit', dangerRating: 3, brief: "Each person's invisible djinn double in Islamic belief — a companion from birth who knows every secret and whispers temptations throughout life, the voice you hear suggesting things you know you should not do" },
  { slug: 'nasnas', name: 'Nasnas', region: 'Middle East & North Africa', regionSlug: 'middle-east-north-africa', category: 'Half-Human', dangerRating: 3, brief: 'Arabic creature with exactly half a human body — one eye, one arm, one leg, half a face — descended from the Shiqq demon, found in deserts, it causes illness in those who touch it' },
  { slug: 'roc', name: 'Roc', region: 'Middle East & North Africa', regionSlug: 'middle-east-north-africa', category: 'Giant Bird', dangerRating: 5, brief: "The Persian and Arabic bird so vast its wingspan casts island-sized shadows — described by Marco Polo, Sinbad, and Arab geographers as a real creature of the Indian Ocean that fed its young on elephants" },
  { slug: 'bahamut', name: 'Bahamut', region: 'Middle East & North Africa', regionSlug: 'middle-east-north-africa', category: 'Cosmic Beast', dangerRating: 5, brief: 'The cosmic fish of Islamic cosmology so inconceivably vast that the entire created world is a ring thrown into an endless desert beside it — it holds everything below, motionless, since the beginning' },
  { slug: 'div', name: 'Div', region: 'Middle East & North Africa', regionSlug: 'middle-east-north-africa', category: 'Ancient Demon', dangerRating: 5, brief: 'The great demons of Persian mythology who ruled the world before humanity — enormous shapeshifters who cause drought, plague, and madness, still active in the unseen world parallel to ours' },
  { slug: 'daeva', name: 'Daeva', region: 'Middle East & North Africa', regionSlug: 'middle-east-north-africa', category: 'Evil Spirit', dangerRating: 4, brief: 'Zoroastrian evil spirits who embody specific vices — the Daeva of wrath, of hunger, of grief — invisible but detectable by the specific forms of suffering they cause in the people they attach to' },
  { slug: 'manticore', name: 'Manticore', region: 'Middle East & North Africa', regionSlug: 'middle-east-north-africa', category: 'Ancient Beast', dangerRating: 5, brief: "The Persian man-eater with a human face, lion's body, and scorpion tail — recorded by Greek historians as a real creature of the Persian interior that leaves no trace of its victims, not even bones" },
  { slug: 'simurgh', name: 'Simurgh', region: 'Middle East & North Africa', regionSlug: 'middle-east-north-africa', category: 'Divine Bird', dangerRating: 3, brief: 'The Persian world-eagle who has witnessed three destructions of the world — ancient beyond reckoning, its feathers cure any wound, but it acts on its own vast understanding, not human requests' },
  { slug: 'jann', name: 'Jann', region: 'Middle East & North Africa', regionSlug: 'middle-east-north-africa', category: 'Desert Djinn', dangerRating: 3, brief: "The shapeshifting djinn of the desert who inhabit animals and take bestial forms — the whirlwind rising from empty sand, the ostrich that runs too fast, the serpent with too much intelligence in its eyes" },

  // East Asia
  { slug: 'tengu', name: 'Tengu', region: 'East Asia', regionSlug: 'east-asia', category: 'Mountain Demon', dangerRating: 4, brief: 'Japanese mountain spirits with beaks or long noses who abduct arrogant priests and monks, returning them months later speaking backwards — they teach swordsmanship only to those they find worthy' },
  { slug: 'nue', name: 'Nue', region: 'East Asia', regionSlug: 'east-asia', category: 'Chimera', dangerRating: 4, brief: "Japanese chimera with a monkey's head, tanuki's body, tiger's legs, and a snake for a tail — its cry caused the Emperor of Japan to fall into mysterious illness until an archer shot it from the night sky" },
  { slug: 'futakuchi-onna', name: 'Futakuchi-onna', region: 'East Asia', regionSlug: 'east-asia', category: 'Cursed Human', dangerRating: 3, brief: "Japanese woman with a second mouth at the back of her skull — the second mouth speaks and demands food with its own will, the result of a miser's curse or a woman who starved her stepchild" },
  { slug: 'baku', name: 'Baku', region: 'East Asia', regionSlug: 'east-asia', category: 'Dream Eater', dangerRating: 2, brief: 'Japanese chimera made of leftover parts from the creation of the world — called upon before sleep it consumes nightmares, but an overhungry Baku will eat good dreams, hopes, and ambitions as well' },
  { slug: 'zashiki-warashi', name: 'Zashiki-warashi', region: 'East Asia', regionSlug: 'east-asia', category: 'Child Spirit', dangerRating: 3, brief: 'Japanese child ghost who haunts wealthy houses, bringing luck — but the day it leaves, the household begins to die. Every member, one by one, within the year following the departure' },
  { slug: 'jorogumo', name: 'Jorogumo', region: 'East Asia', regionSlug: 'east-asia', category: 'Spider Demon', dangerRating: 4, brief: 'Japanese spider who grows for four hundred years until she gains supernatural power and takes the form of a beautiful woman — she wraps her victims in silk while playing the biwa to distract them' },
  { slug: 'enenra', name: 'Enenra', region: 'East Asia', regionSlug: 'east-asia', category: 'Smoke Demon', dangerRating: 3, brief: "Japanese spirit made entirely of smoke that emerges from bonfires and campfires — it can only be seen by people of pure heart, and what it does to those who cannot see it is never described" },
  { slug: 'yamata-no-orochi', name: 'Yamata no Orochi', region: 'East Asia', regionSlug: 'east-asia', category: 'Dragon', dangerRating: 5, brief: "The eight-headed, eight-tailed Japanese serpent so vast its body was covered in trees and moss — it demanded a maiden tribute each year for eight years until the god Susanoo defeated it with sake and a sword" },
  { slug: 'okiku', name: 'Okiku', region: 'East Asia', regionSlug: 'east-asia', category: 'Vengeful Ghost', dangerRating: 4, brief: 'The Japanese servant murdered and thrown in a well for breaking a plate — she counts the plates every night, reaching nine and then screaming, and anyone who hears the full count goes mad' },
  { slug: 'wanyudo', name: 'Wanyudo', region: 'East Asia', regionSlug: 'east-asia', category: 'Hell Guardian', dangerRating: 5, brief: 'The burning ox-cart wheel of Japanese folklore with a tormented human face in its hub — a cruel lord condemned to roll through hell for eternity, now stealing the souls of anyone who sees it pass' },

  // South Asia
  { slug: 'brahmaparusha', name: 'Brahmaparusha', region: 'South Asia', regionSlug: 'south-asia', category: 'Undead Demon', dangerRating: 5, brief: 'Indian spirit who dances wearing human intestines as a garland and drinks blood from a skull — it haunts cremation grounds and attacks at night, specifically targeting those who wander alone after dark' },
  { slug: 'pishacha', name: 'Pishacha', region: 'South Asia', regionSlug: 'south-asia', category: 'Flesh Eater', dangerRating: 4, brief: 'Sanskrit demons who haunt charnel grounds and consume human flesh — they possess the living, producing madness and wasting illness, and are among the most difficult entities to exorcise' },
  { slug: 'bhuta', name: 'Bhuta', region: 'South Asia', regionSlug: 'south-asia', category: 'Ghost', dangerRating: 3, brief: 'Indian ghost of those who died violently or without proper funeral rites — they hover above the ground because they cannot touch the earth, causing illness in the living until their grievance is addressed' },
  { slug: 'mohini', name: 'Mohini', region: 'South Asia', regionSlug: 'south-asia', category: 'Enchantress', dangerRating: 4, brief: "Hindu divine enchantress who appears to men at crossroads and forest paths — her beauty causes them to follow her until they waste away completely, used even by the gods to distract demons at crucial moments" },
  { slug: 'masan', name: 'Masan', region: 'South Asia', regionSlug: 'south-asia', category: 'Cremation Spirit', dangerRating: 3, brief: 'Indian spirit that haunts cremation grounds in the form of a playing child — when a passerby approaches to help, the Masan leaps onto them and the person dies of sudden overwhelming fright' },
  { slug: 'nale-ba', name: 'Nale Ba', region: 'South Asia', regionSlug: 'south-asia', category: 'Door Ghost', dangerRating: 4, brief: "Ghost from Karnataka that knocks on doors at night in the voice of a beloved relative — those who open the door die by morning. The warning 'Nale Ba — come tomorrow' was written on doorways across the region" },
  { slug: 'asura', name: 'Asura', region: 'South Asia', regionSlug: 'south-asia', category: 'Demon Class', dangerRating: 4, brief: 'The great demon-gods of Hindu cosmology who wage eternal war against the devas — once divine, fallen through pride, now rulers of the underworld with power rivaling the gods themselves' },
  { slug: 'yaksha', name: 'Yaksha', region: 'South Asia', regionSlug: 'south-asia', category: 'Nature Spirit', dangerRating: 3, brief: "Nature spirits who guard treasures hidden in the earth and roots of ancient trees — they protect their places absolutely and can cause prolonged mysterious illness in those who disturb them" },
  { slug: 'nagini', name: 'Nagini', region: 'South Asia', regionSlug: 'south-asia', category: 'Serpent Spirit', dangerRating: 3, brief: "Female Naga who take human form near sacred pools and rivers — they are protectors of water and will curse those who pollute or disrespect their waters with wasting illnesses that no medicine can treat" },
  { slug: 'gandabherunda', name: 'Gandabherunda', region: 'South Asia', regionSlug: 'south-asia', category: 'Mythic Bird', dangerRating: 4, brief: "The two-headed bird of Karnataka mythology with immense supernatural power — it carries elephants in each beak and each talon, and its cry is so powerful it can shatter stone at great distances" },

  // Southeast Asia
  { slug: 'lang-suir', name: 'Langsuir', region: 'Southeast Asia', regionSlug: 'southeast-asia', category: 'Flying Vampire', dangerRating: 4, brief: 'Malay vampire born of grief at a stillborn child — she flies as an owl and feeds through a hole in the back of her neck. If the hole is stuffed with her own hair, she becomes human again' },
  { slug: 'tianak', name: 'Tianak', region: 'Southeast Asia', regionSlug: 'southeast-asia', category: 'Demon Child', dangerRating: 4, brief: 'Filipino and Malay forest demon that mimics a crying infant to lure travelers — when picked up, it shows its true face and attacks, and those who survive describe encountering an impossibly ancient face in an infant body' },
  { slug: 'sigbin', name: 'Sigbin', region: 'Southeast Asia', regionSlug: 'southeast-asia', category: 'Familiar Beast', dangerRating: 3, brief: 'Filipino creature that walks backwards with its head between its hind legs — kept in jars by wealthy families for luck and used by witches to steal the hearts of victims, leaving them hollowed' },
  { slug: 'leyak', name: 'Leyak', region: 'Southeast Asia', regionSlug: 'southeast-asia', category: 'Sorcerer', dangerRating: 5, brief: "Balinese practitioners of black magic who detach their own heads at night — the flying head seeks blood in Bali's forests, hunting especially pregnant women in the hours before dawn" },
  { slug: 'nang-tani', name: 'Nang Tani', region: 'Southeast Asia', regionSlug: 'southeast-asia', category: 'Tree Spirit', dangerRating: 2, brief: 'Thai female spirit who inhabits wild banana trees — she appears as a beautiful woman in green to men who have wronged women, and leaves those who approach with respect entirely unharmed' },
  { slug: 'jenglot', name: 'Jenglot', region: 'Southeast Asia', regionSlug: 'southeast-asia', category: 'Parasitic Entity', dangerRating: 3, brief: "Indonesian tiny humanoid creature with long hair and claws found buried or hidden in walls — kept by shamans who feed it blood for power, it grants what it promises but demands increasingly more" },
  { slug: 'hantu-raya', name: 'Hantu Raya', region: 'Southeast Asia', regionSlug: 'southeast-asia', category: 'Great Spirit', dangerRating: 4, brief: "The Great Ghost of Malay tradition, so powerful that binding it may kill the binder — it serves its master with total capability while slowly, imperceptibly draining the vitality of the family" },
  { slug: 'buso', name: 'Buso', region: 'Southeast Asia', regionSlug: 'southeast-asia', category: 'Death Spirit', dangerRating: 5, brief: "Mindanao death spirits who cluster wherever someone is dying — they carry away what they can from the dying and the house, and they linger in places of chronic illness, waiting for the moment to fully arrive" },
  { slug: 'pelesit', name: 'Pelesit', region: 'Southeast Asia', regionSlug: 'southeast-asia', category: 'Familiar Spirit', dangerRating: 3, brief: 'Malay cricket familiar obtained through a terrible ritual involving a dead infant — it enters an enemy and causes madness, the victim raving about cats before death, while the owner feigns innocence' },
  { slug: 'tiyanak', name: 'Tiyanak', region: 'Southeast Asia', regionSlug: 'southeast-asia', category: 'Forest Demon', dangerRating: 3, brief: "Philippine forest demon that guides travelers deeper into the jungle by crying like an infant — when they are too disoriented to find the way back, it stops crying and they finally see what followed them" },

  // Sub-Saharan Africa
  { slug: 'inkanyamba', name: 'Inkanyamba', region: 'Sub-Saharan Africa', regionSlug: 'sub-saharan-africa', category: 'Storm Serpent', dangerRating: 5, brief: "Zulu giant serpent who lives in mountain waterfalls and creates tornadoes when it travels to find a mate — its frustration produces storms that have destroyed entire communities in its search" },
  { slug: 'kongamato', name: 'Kongamato', region: 'Sub-Saharan Africa', regionSlug: 'sub-saharan-africa', category: 'Flying Beast', dangerRating: 4, brief: 'The Zambian and Congolese creature that overturns river canoes — when shown illustrations of pterosaurs, witnesses in multiple unconnected communities identified it without hesitation and without prompting' },
  { slug: 'mamlambo', name: 'Mamlambo', region: 'Sub-Saharan Africa', regionSlug: 'sub-saharan-africa', category: 'River God', dangerRating: 5, brief: 'Zulu river spirit described as half-horse, half-fish with luminous eyes — it drains victims of blood and brains near the water and leaves the empty bodies, which are mistaken for drownings' },
  { slug: 'dingonek', name: 'Dingonek', region: 'Sub-Saharan Africa', regionSlug: 'sub-saharan-africa', category: 'Water Beast', dangerRating: 4, brief: "Central African lake creature with a walrus face, spotted scales, and a scorpion's tail — a British hunter's companion was reportedly killed by one in 1907, and natives refuse to approach certain lakes" },
  { slug: 'chemosit', name: 'Chemosit', region: 'Sub-Saharan Africa', regionSlug: 'sub-saharan-africa', category: 'Night Terror', dangerRating: 5, brief: "Kenyan creature called the Nandi Bear — it walks on one leg to lure the curious, then attacks, leaving victims with the top of the skull removed. British colonial officers filed formal reports on it" },
  { slug: 'aziza', name: 'Aziza', region: 'Sub-Saharan Africa', regionSlug: 'sub-saharan-africa', category: 'Forest Spirit', dangerRating: 2, brief: "Benin and Fon tiny forest spirits who gave humanity fire and the knowledge of herbs — they are encountered only by hunters who treat the forest with proper respect, and only they can find them" },
  { slug: 'rompo', name: 'Rompo', region: 'Sub-Saharan Africa', regionSlug: 'sub-saharan-africa', category: 'Scavenger Beast', dangerRating: 3, brief: "Medieval Arabic and African accounts describe a creature with a rabbit's head, human ears, bear's front legs, and badger hindquarters that feeds exclusively on human corpses and makes a humming sound" },
  { slug: 'nyaminyami', name: 'Nyaminyami', region: 'Sub-Saharan Africa', regionSlug: 'sub-saharan-africa', category: 'River God', dangerRating: 4, brief: "The Zambezi River god who lives at Kariba Gorge — when the Kariba Dam was built separating him from his wife, he sent floods and earthquakes to destroy the construction, and continues to do so" },
  { slug: 'eloko', name: 'Eloko', region: 'Sub-Saharan Africa', regionSlug: 'sub-saharan-africa', category: 'Forest Dwarf', dangerRating: 5, brief: 'Congo forest dwarves covered in grass instead of skin who guard the deepest forest resources — they carry bells whose sound entrances anyone who hears it, drawing victims helplessly to be consumed' },
  { slug: 'agogwe', name: 'Agogwe', region: 'Sub-Saharan Africa', regionSlug: 'sub-saharan-africa', category: 'Unknown Being', dangerRating: 2, brief: 'Small reddish-haired upright creatures of East Africa — reported by British officers in 1900, native hunters for centuries before that, and villagers to the present day, always just beyond clear view' },

  // Oceania
  { slug: 'muldjewangk', name: 'Muldjewangk', region: 'Oceania', regionSlug: 'oceania', category: 'River Monster', dangerRating: 4, brief: "Monster of the Murray River in South Australia — Aboriginal communities warned European settlers not to take steamboats onto the river; those who ignored the warning were seized from the deck" },
  { slug: 'patupaiarehe', name: 'Patupaiarehe', region: 'Oceania', regionSlug: 'oceania', category: 'Fairy People', dangerRating: 3, brief: "Māori supernatural people who are pale-skinned with reddish hair — they live in misty forest heights, play hauntingly beautiful flutes at night, and take humans back to their realm, from which no one returns" },
  { slug: 'whowie', name: 'Whowie', region: 'Oceania', regionSlug: 'oceania', category: 'Ancient Beast', dangerRating: 5, brief: "Australian Aboriginal giant six-legged lizard with a frog's head that ate entire communities — lured into a gorge and burned by the ancestor spirits, but some accounts say it survived in the deepest river country" },
  { slug: 'burrunjor', name: 'Burrunjor', region: 'Oceania', regionSlug: 'oceania', category: 'Living Fossil', dangerRating: 4, brief: "Large bipedal creature of Australia's Northern Territory — described in Aboriginal stories and reported by cattlemen since the 1950s, leaving three-toed footprints that suggest something that should not exist" },
  { slug: 'tiddalik', name: 'Tiddalik', region: 'Oceania', regionSlug: 'oceania', category: 'Ancient Frog', dangerRating: 4, brief: "The great frog of Aboriginal Australian legend who woke from sleep and drank all the water in the world — every living thing faced death until the eel made it laugh and the water returned in a flood" },
  { slug: 'quinkin', name: 'Quinkin', region: 'Oceania', regionSlug: 'oceania', category: 'Rock Spirit', dangerRating: 4, brief: 'Queensland Aboriginal spirits that hide in rock crevices waiting to seize and consume people — depicted in rock art ten thousand years old, and still recognized and actively feared in Cape York communities' },
  { slug: 'min-min', name: 'Min Min Light', region: 'Oceania', regionSlug: 'oceania', category: 'Phantom Light', dangerRating: 3, brief: "Mysterious lights that follow travelers in the Australian outback — they match your speed, maintain their distance, and those who chase them are found days later disoriented, having walked in circles they cannot explain" },
  { slug: 'kakamora', name: 'Kakamora', region: 'Oceania', regionSlug: 'oceania', category: 'Warrior Spirits', dangerRating: 4, brief: 'Small fierce supernatural warriors of the Solomon Islands who live in large hollows and attack travelers with long sharp nails — they are fast, they are many, and the forests where they live have no safe paths' },
  { slug: 'hine-nui-te-po', name: 'Hine-nui-te-pō', region: 'Oceania', regionSlug: 'oceania', category: 'Death Goddess', dangerRating: 5, brief: "Māori goddess of death who waits at the horizon where sky meets earth — when the hero Māui tried to crawl through her sleeping body to steal immortality for humanity, she woke and crushed him, ending the attempt forever" },
  { slug: 'yowie', name: 'Yowie', region: 'Oceania', regionSlug: 'oceania', category: 'Unknown Beast', dangerRating: 3, brief: "Australia's great hairy man — described in Aboriginal traditions long before Europeans arrived, reported by settlers, and seen by modern witnesses across every state, always just beyond clear identification" },
]

// ---------------------------------------------------------------------------
// Prompt for story generation
// ---------------------------------------------------------------------------
const STYLE_EXAMPLE = `
Here is an example of the writing style to match exactly:

"She smells of frangipani first — that sweet, almost sickening floral scent that drifts through the warm night air before she is visible. In Malaysia and Indonesia, the Pontianak is announced by her fragrance, and those who have grown up with the stories know that when frangipani appears in the air at night near a banana tree, with no obvious source, the appropriate response is to go inside immediately and not look toward the garden.

The Pontianak is the spirit of a woman who died in childbirth, or sometimes a stillborn infant's mother taken by grief. She died at the most liminal of moments — between two lives, neither fully completed — and this incompleteness defines her existence. She appears as a beautiful woman in a white dress, long black hair loose around her face, drifting near banana trees and bodies of standing water. The beauty is a warning system, not an attraction, for those who know the folklore. The white dress is already wet."
`

function buildStoryPrompt(creature) {
  return `You are writing horror folklore content for a website about supernatural creatures from world mythology.

Write a story/article about the ${creature.name} from ${creature.region} folklore. Key facts: ${creature.brief}.

STYLE REQUIREMENTS:
- Literary, atmospheric prose — not a Wikipedia article, not a listicle
- 4-5 paragraphs, approximately 400-500 words total
- Begin with a specific concrete image, scene, or sensory detail that draws the reader in
- Weave in genuine historical and cultural context
- Explain what makes this creature specifically dangerous or significant
- Where relevant, mention protective measures or countermeasures from the tradition
- No headings, no bullet points — flowing prose paragraphs only
- Tone: like a very good horror non-fiction writer documenting real folklore

${STYLE_EXAMPLE}

Also generate the following frontmatter fields as a JSON object on the FIRST LINE of your response (before the story text), formatted exactly like this:
{"teaser": "one vivid sentence, max 20 words, capturing the creature's essence"}

Then write the story text after a blank line. Do not include any other JSON or markdown formatting.`
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------
async function generateStoryText(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 1024 },
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Text API ${res.status}: ${t.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function generateImage(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1, aspectRatio: '3:4' },
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Image API ${res.status}: ${t.slice(0, 200)}`)
  }
  const data = await res.json()
  const b64 = data.predictions?.[0]?.bytesBase64Encoded
  if (!b64) throw new Error('No image data')
  return Buffer.from(b64, 'base64')
}

function buildImagePrompt(creature) {
  return (
    `Detailed pen and ink illustration of ${creature.name}, a ${creature.category} from ${creature.region} folklore. ` +
    `${creature.brief.slice(0, 120)}. ` +
    `Medieval bestiary manuscript style. Fine black ink linework, cross-hatching, stippling. ` +
    `Monochrome, no color. Aged yellowed parchment paper texture background. ` +
    `Like an illustration from an 18th century naturalist's monster compendium. High detail.`
  )
}

function parseStoryOutput(raw) {
  const lines = raw.trim().split('\n')
  let teaser = ''
  let bodyStart = 0

  // First non-empty line should be JSON
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    try {
      const json = JSON.parse(line)
      teaser = json.teaser ?? ''
      bodyStart = i + 1
      break
    } catch {
      // Not JSON — treat whole output as body
      break
    }
  }

  const body = lines.slice(bodyStart).join('\n').trim()
  return { teaser, body }
}

function buildMarkdown(creature, teaser, body) {
  const fm = [
    '---',
    `title: "${creature.name}"`,
    `creature: "${creature.name}"`,
    `region: "${creature.region}"`,
    `regionSlug: "${creature.regionSlug}"`,
    `category: "${creature.category}"`,
    `dangerRating: ${creature.dangerRating}`,
    `teaser: "${teaser.replace(/"/g, "'")}"`,
    `image: "/images/stories/${creature.slug}.png"`,
    '---',
    '',
    body,
  ].join('\n')
  return fm
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------
let success = 0
let fail = 0

for (const creature of CREATURES) {
  const mdPath = join(STORIES_DIR, `${creature.slug}.md`)
  const imgPath = join(IMAGES_DIR, `${creature.slug}.png`)

  if (existsSync(mdPath) && existsSync(imgPath)) {
    console.log(`skip ${creature.slug} (already exists)`)
    continue
  }

  process.stdout.write(`${creature.slug}... `)

  try {
    // Generate story text
    let teaser = creature.brief.slice(0, 100)
    let body = ''

    if (!existsSync(mdPath)) {
      const raw = await generateStoryText(buildStoryPrompt(creature))
      const parsed = parseStoryOutput(raw)
      teaser = parsed.teaser || teaser
      body = parsed.body
      writeFileSync(mdPath, buildMarkdown(creature, teaser, body))
    }

    // Generate image
    if (!existsSync(imgPath)) {
      const imgBuf = await generateImage(buildImagePrompt(creature))
      writeFileSync(imgPath, imgBuf)
    }

    process.stdout.write('✓\n')
    success++
  } catch (err) {
    process.stdout.write(`✗ ${err.message}\n`)
    fail++
  }

  // Rate limit: stagger requests
  await new Promise(r => setTimeout(r, 2500))
}

console.log(`\nDone: ${success} generated, ${fail} failed.`)
