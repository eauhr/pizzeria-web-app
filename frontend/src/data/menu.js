import margherita from "@/assets/images/margherita.webp";
import pasta from "@/assets/images/pasta.webp";
import cannelloni from "@/assets/images/cann.webp";

export const menuCategories = [
  {
    id: "pizza",
    name: "Pizza",
    items: [
      { name: "Margherita", desc: "San Marzano tomato, fior di latte, fresh basil, EVOO", price: "7.11" },
      { name: "Diavola", desc: "tomato, mozzarella, spicy salami, chilli", price: "8.79" },
      { name: "Quattro Formaggi", desc: "mozzarella, gorgonzola, parmigiano, taleggio", price: "9.05" },
      { name: "Prosciutto e Rucola", desc: "tomato, mozzarella, prosciutto crudo, rocket", price: "10.69" },
      { name: "Frutti di Mare", desc: "tomato, mozzarella, prawns, calamari, mussels", price: "9.20" },
      { name: "Tartufo", desc: "mozzarella, mushroom, truffle cream, parmigiano", price: "8.69" },
    ],
  },
  {
    id: "pasta",
    name: "Pasta & Risotto",
    items: [
      { name: "Spaghetti Vongole", desc: "clams, white wine, garlic, parsley, chilli", price: "8.69" },
      { name: "Tagliatelle al Ragù", desc: "slow-cooked beef ragù, parmigiano", price: "9.50" },
      { name: "Linguine ai Frutti di Mare", desc: "prawns, calamari, mussels, tomato", price: "9.51" },
      { name: "Cannelloni al Forno", desc: "baked pasta, ricotta, spinach, tomato, béchamel", price: "8.50" },
      { name: "Risotto ai Funghi Porcini", desc: "carnaroli rice, porcini, parmesan", price: "7.25" },
    ],
  },
  {
    id: "antipasti",
    name: "Antipasti",
    items: [
      { name: "Tagliere Misto", desc: "cured meats, cheeses, olives, grissini", price: "6.11" },
      { name: "Bruschetta Classica", desc: "grilled bread, tomato, basil, garlic", price: "4.59" },
      { name: "Calamari Fritti", desc: "fried calamari, lemon, aioli", price: "7.99" },
      { name: "Polpo Grigliato", desc: "grilled octopus, potato, olives, parsley", price: "8.25" },
    ],
  },
  {
    id: "wine",
    name: "Wine",
    items: [
      { name: "Chianti DOCG", desc: "Tuscany, 0.75l - bottle", price: "32.00" },
      { name: "Primitivo di Puglia", desc: "Puglia, 0.75l - bottle", price: "28.00" },
      { name: "Tiramisù", desc: "mascarpone, espresso, cocoa", price: "7.50" },
      { name: "Panna Cotta", desc: "vanilla cream, berry coulis", price: "6.50" },
    ],
  },
];

export const specialties = [
  { name: "Margherita", desc: "The classic. San Marzano, fior di latte, basil.", price: "7.11", img: margherita },
  { name: "Linguine ai Frutti di Mare", desc: "Prawns, calamari, mussels, tomato.", price: "9.51", img: pasta },
  { name: "Cannelloni al Forno", desc: "Baked, ricotta, spinach, béchamel.", price: "8.50", img: cannelloni }, 
];

export const featuredMenu = {
  pizza: [
    { name: "Margherita", desc: "San Marzano tomato, mozzarella", price: "7.11" },
    { name: "Quattro Formaggi", desc: "Tomato sauce, four cheeses", price: "9.05" },
    { name: "Diavolo", desc: "Tomato, mozzarella, spicy salami, chili, garlic", price: "8.79" },
  ],
  pasta: [
    { name: "Spaghetti alla Carbonara", desc: "Cream, ham, egg, parmesan", price: "8.44" },
    { name: "Tagliatelle al Salmone", desc: "Salmon, mushroom, garlic, cream, tomato", price: "10.79" },
    { name: "Lasagne al Forno", desc: "Beef ragù, béchamel, gouda", price: "9.31" },
  ],
  wine: [
    { name: "Castra Rubra Rosé", desc: "750ml · 8.7% vol", price: "19.94" },
    { name: "Santa Cristina Rosato", desc: "750ml · 8.7% vol", price: "34.26" },
  ],
};
