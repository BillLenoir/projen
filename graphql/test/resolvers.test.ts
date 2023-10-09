import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { describe, expect, test } from '@jest/globals';
import { typeDefs } from '../src/data/typeDefs';
import { filterCheck, resolvers } from '../src/resolvers';
import { Filter, Sort } from '../src/resolvers-types';


const testServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const testQuery = `query FindGames($cursor: String!) {
    findGames(cursor: $cursor) {
      totalCount
      gameNumber
      firstCursor
      prevCursor
      nextCursor
      lastCursor
      games {
        cursor
        game {
          description
          gamefortrade
          gameown
          gameprevowned
          gamewanttobuy
          id
          publisher
          thumbnail
          title
          yearpublished
        }
      }
    }
  }
`;

const cursor = 'eyAiaSI6IDE5NTM1MywgImwiOiA1MCwgInMiOiAiSUQiLCAiZiI6ICJPV04iIH0g';

const testResponse = await testServer.executeOperation({
  query: testQuery,
  variables: { cursor: cursor },
});

test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});

// const gameOwn = {
//   id: 6022,
//   title: '13: The Colonies in Revolt',
//   yearpublished: 1985,
//   thumbnail:
//       'https://cf.geekdo-images.com/zf4IZ_IaCBIepZUOME2hCg__thumb/img/sxYC_bX6hzaHEcver6vvjMCSBVM=/fit-in/200x150/filters:strip_icc()/pic7211233.png',
//   publisher: 'Tactical Studies Rules (TSR)',
//   description:
//       '13: The Colonies in Revolt, a Strategic level board-wargame published in 1985 by TSR in their wargaming magazine &quot;Strategy &amp; Tactics&quot; issue#104, is a simulation of the American Revolutionary War from late 1775 (the siege of Boston and the two Canadian expeditions) through the end of 1781. The British player must try to stop the revolt by trying to control half a continent.<br/><br/>Included are a 16 page rulebook, 22&quot;x34&quot; map, 200 counters, and various player charts and tables.<br/><br/>The British player wins in one of two ways. If the year is 1775 or 1776, the British player requires control of a limited number of objectives (Canada, Boston, New York, Philadelphia, Charleston, and one area of operations). If the game continues to 1781, the British player must control New England, the Middle Colonies, the South, and either Canada or the Western Territories. If the British do not attain these objectives, the American player wins.<br/><br/>',
//   gameown: true,
//   gamewanttobuy: false,
//   gameprevowned: false,
//   gamefortrade: false,
// };

// const gameWantToBuy = {
//   id: 4087,
//   title: '1812: The Campaign of Napoleon in Russia',
//   yearpublished: 1972,
//   thumbnail:
//       'https://cf.geekdo-images.com/qRrDR81cvGHkPq3FfQTMHA__thumb/img/5mcf4RuzY5yFQTqEfYtMdssvofA=/fit-in/200x150/filters:strip_icc()/pic262312.jpg',
//   publisher: 'SPI (Simulations Publications, Inc.)',
//   description:
//       'Two versions are included, using separate maps covering most of Russia. The strategic game is area driven, while the tactical version covers the game scope but using hex mechanics.<br/><br/>There is an earlier version of the box that is NOT plastic, it is a completely cardboard box. Many of the early SPI games came in these cardboard boxes until someone bright decided that the plastic ones would be cheaper and more easily manipulated for advertising.<br/><br/>400 Counters<br/><br/>',
//   gameown: false,
//   gamewanttobuy: true,
//   gameprevowned: false,
//   gamefortrade: false,
// };

// const gamePrevOwned = {
//   id: 22407,
//   title: '1066: End of the Dark Ages',
//   yearpublished: 2006,
//   thumbnail:
//       'https://cf.geekdo-images.com/OWNEO-hMms4oKCAxMgo3Tg__thumb/img/V8Wb82lBX27u02oKZ8PrvWSEAaw=/fit-in/200x150/filters:strip_icc()/pic772997.jpg',
//   publisher: 'Decision Games (I)',
//   description:
//       "1066: End of the Dark Ages is a wargame of intermediate complexity, designed by Joseph Miranda, simulating the historic struggle to gain control of Britain during that crucial year of the 11th century.<br/><br/>That struggle saw the Anglo-Saxons, under King Harold, defeat the Vikings, only to in turn be defeated by the Normans from France led by Duke William. His victory eventually led to the establishment of the modern British nation. 1066: End of the Dark Ages can be played by two, three or four, each representing a different side: Anglo-Saxons, Normans, Vikings and Britons (the latter representing an amalgamation of the various peoples then indigenous to the island).<br/><br/>Each of the 12 game turns represent a calendar month. Each fully iconic, large-size, unit represents roughly 1,000 to 5,000 fighting men or key individual leaders along with their elite 'household' troops. Each square on the 34x22&quot; map represents 40 miles across, with all of England, Wales and southern Scotland, as well as the north coast of France, depicted on it.<br/><br/>Each player has a variety of military and political instruments with which he can attempt to gain control of Britain. Every tactic and stratagem available historically to the would-be kings of England &ndash; from diplomacy through treachery, the laws of fealty and homage, vassalage, appeals to the Pope, assassination, pillage, shield walls, fortification, heavenly omens, gold, spies, rebellion, navies and, of course, savage warfare &ndash; are again in play here.<br/><br/>The game contains one scenario, with adaptive rules that allow it to be played by two, three or four opponents. The rules contain approximately 14,000 words, which will allow experienced players to get through a complete game in about four to six hours.<br/><br/>",
//   gameown: false,
//   gamewanttobuy: false,
//   gameprevowned: true,
//   gamefortrade: false,
// };

// const gameForTrade = {
//   id: 10533,
//   title: 'Central Command: Superpower Confrontation in the Straits of Hormuz',
//   yearpublished: 1984,
//   thumbnail:
//       'https://cf.geekdo-images.com/SqpKvpCwv7UxEvRGd4rD5A__thumb/img/ei99jmp72xXFX_zLdVCOjKSGBwY=/fit-in/200x150/filters:strip_icc()/pic44338.jpg',
//   publisher: 'Tactical Studies Rules (TSR)',
//   description:
//       'The Central Command Game simulates potential warfare between the US and the Soviet Union over the critical area of the Strait of Hormuz sometime during the late 1980s.<br/><br/>The game concentrates on an hypothetical land and air campaign for possession of airfield and port facilities in Iran that could dominate the critical outlet for Western oil supplies from the Persian Gulf. It is assumed that other forces may be involved in combat elsewhere in Iran at the same time, limiting ground and air unit participation around the Strait to the forces included in this game. These off-board forces are assumed to be engaged in naval, naval/air, offensive counterair, or deep interdictional operations beyond the limited time frame of the game.<br/><br/>',
//   gameown: false,
//   gamewanttobuy: false,
//   gameprevowned: false,
//   gamefortrade: true,
// };

// const sortKeys = Object
//   .keys(Sort)
//   .filter((value) => isNaN(Number(value)));
// console.log(sortKeys.length);

// const filterKeys = Object
//   .keys(Filter)
//   .filter((value) => isNaN(Number(value)));
// console.log(filterKeys.length);

// sendGamesQuery('eyAiaSI6IDE5NTM1MywgImwiOiA1MCwgInMiOiAiSUQiLCAiZiI6ICJPV04iIH0g');

// test('Filters game list to return only those games I own', () => {

// });
// for (let i = 0; i < sortKeys.length; i++) {
//   for (let j = 0; j < filterKeys.length; j++) {
//     console.log(`Sort: ${sortKeys[i]} => Filter: ${filterKeys[j]}`);
//   }
// }