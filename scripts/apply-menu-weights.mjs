/**
 * One-off: merge PDF tech-card weights into public/menu.json.
 * Run: node scripts/apply-menu-weights.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const menuPath = path.join(root, 'public', 'menu.json')

/** @type {Record<string, string>} key = `${sectionId}|${name}` */
const WEIGHTS = {
  // grill — весовые стейки и семга без фиксированного веса в PDF
  'grill|Beef tenderloin medallions': '260',
  'grill|Chicken breast shashlik': '230/54',
  'grill|Beef lyulya-kebab': '230/34',
  'grill|Lamb lyulya-kebab': '170/34',
  'grill|Farmer chicken Tapaka': '630/5',
  'grill|Grilled meat platter': '690/80/60/50/50/68',
  'grill|Argentine langoustines, 5 pcs': '216/32',
  'grill|Tuna steak with eggplant mousse': '200',
  'grill|Dorado': '420',
  'grill|Seafood assortment': '663/54',
  'grill|GRUT burger with beef and cheddar': '350',
  "grill|Farmer's lamb burger": '366',

  'garniry|Seasonal vegetables': '250',
  'garniry|Baby potatoes': '150',
  'garniry|Potato wedges': '150',
  'garniry|Fried potatoes with mushrooms and onions': '220',
  'garniry|Mashed potatoes': '150',
  'garniry|Mashed potatoes with spinach': '150',
  'garniry|French fries': '150',
  'garniry|Quinoa': '150',
  'garniry|Boiled rice': '150',

  'pasta|Fettuccine with seafood in cream sauce': '300',
  'pasta|Tagliatelle carbonara': '300',

  'myaso_ptica|Pozharsky cutlet with mashed potatoes and spinach': '170/156/10',
  'myaso_ptica|Chicken Kiev with potato pie': '210/74',
  'myaso_ptica|Beef stroganoff with mashed potatoes': '260',
  'myaso_ptica|Veal cheeks in red wine sauce with choice of side': '329',
  'myaso_ptica|Lamb schnitzel with tomatoes and eggplant in sweet and sour sauce': '305/16',

  'ryba_moreprodukty|Pike and zander cutlets with mashed potatoes and dill sauce': '360',
  'ryba_moreprodukty|Mussels in Bavarian sauce': '430/58/29',

  'sousy|Sweet chili': '50',
  'sousy|Ketchup': '50',
  'sousy|Ranch': '50',
  'sousy|BBQ sauce': '50',
  'sousy|Tkemali': '50',
  'sousy|Honey lime': '50',
  'sousy|Tomato': '50',
  "sousy|Jack Daniel's": '50',
  'sousy|Cheese': '50',
  'sousy|Oyster': '50',
  'sousy|Narsharab': '50',
  'sousy|Satsebeli': '50',
  'sousy|Cream mushroom': '50',
  'sousy|Pepper': '50',

  'deserty|Berry millefeuille with mango-passion fruit sauce': '185',
  'deserty|Chocolate fondant with vanilla ice cream': '130',
  'deserty|Honey cake with berries GRUT style': '102',
  'deserty|New York cheesecake with berry sauce': '100/40',
  'deserty|Spiced carrot cake with cheese cream and pecan': '120',
  'deserty|Ice cream (Vanilla dream / Belgian chocolate / Strawberry / Pistachio)': '50',
  'deserty|Sorbet (Passion fruit-mango / Raspberry-strawberry)': '50',
  'deserty|Fruit platter': '1250',

  'k_pivu|Beer set «Two comrades»': '1100',
  "k_pivu|Chicken wings in Jack Daniel's sauce": '381',
  'k_pivu|Beef jerky': '60',
  'k_pivu|Karasau chips': '60',

  'zacuski|Bruschetta with avocado and sun-dried tomatoes': '62',
  'zacuski|Bruschetta with chicken pâté and chokeberry sauce': '80',
  'zacuski|Bruschetta with lightly salted salmon and feta': '82',
  'zacuski|Bruschetta with bresaola, burrata and cherry tomatoes': '75',
  'zacuski|Bruschetta with roast beef and Munich sauce': '77',
  'zacuski|Giant marinated olives': '160',
  'zacuski|Chicken pâté with cranberry confit': '130/55/20',
  'zacuski|Burrata with tomato and eggplant': '195/1',
  'zacuski|Eggplant in oyster sauce with sesame and herbs': '294',
  'zacuski|Fried suluguni cheese with tkemali sauce': '196',
  'zacuski|Spring rolls with shrimp, 5 pcs': '148/25/11',
  'zacuski|Herring with baby potatoes and Borodinsky bread': '281',
  'zacuski|Tuna tartare': '200/20/4',
  'zacuski|Wagyu beef tartare': '134',
  'zacuski|Shrimp tempura with wasabi sauce': '182',

  'zacuski_kompaniya|Bruschetta assortment, 5 pcs': '82/77/62/80/75',
  'zacuski_kompaniya|Pickles assortment': '430',
  'zacuski_kompaniya|Cheese assortment': '180/80',
  'zacuski_kompaniya|Fish assortment': '120',
  'zacuski_kompaniya|Meat assortment': '335',

  'salaty|Achichuk salad': '228',
  'salaty|Fresh vegetable salad': '290',
  'salaty|Greek salad': '352',
  'salaty|Quinoa salad with roasted vegetables and herb sauce': '235',
  'salaty|Green salad with burrata': '125/155/7/10',
  'salaty|Salad with salmon and mini mozzarella': '134',
  'salaty|Olivier with lightly salted salmon and shrimp': '231/14/10/5',
  'salaty|Niçoise with tuna': '172/55/25',
  'salaty|Caesar with shrimp': '246',
  'salaty|Caesar with chicken': '246',
  'salaty|Salad with chicken liver and mushrooms': '203',
  'salaty|Salad with tongue and eggplant': '267',

  'supy|Pumpkin cream soup with burrata': '350',
  'supy|Tom yum with seafood': '571',
  'supy|Chicken soup with homemade noodles': '332',
  'supy|Borscht with veal': '401',

  'hleb|Ciabatta': '50',
  'hleb|French roll': '50',
  'hleb|Scandinavian roll': '50',
  'hleb|Borodinsky bread': '50',
  'hleb|Bread basket': '158',

  'detskoe|Vegetable salad': '150',
  'detskoe|Macaroni and cheese': '100',
  'detskoe|Steamed cutlets': '230',
  'detskoe|Chicken soup': '230',
  'detskoe|Mini burger with beef': '150',
  'detskoe|Caesar with chicken (kids)': '150',
  'detskoe|Mini burger with chicken': '150',
  'detskoe|Nuggets': '150',
  'detskoe|Fruit mix': '215',
  'detskoe|Cheese sticks': '150',
}

const data = JSON.parse(fs.readFileSync(menuPath, 'utf8'))
let n = 0
for (const dish of data.dishes) {
  const key = `${dish.sectionId}|${dish.name}`
  const w = WEIGHTS[key]
  if (w) {
    dish.weight = w
    n++
  }
}
fs.writeFileSync(menuPath, `${JSON.stringify(data, null, 2)}\n`)
console.log(`Updated ${n} dishes with weight in ${menuPath}`)
