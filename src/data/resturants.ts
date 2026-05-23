import { Restaurant } from "../types/types";

const resturants: Restaurant[] = [
  {
    id: "1",
    name: "Swapnil's Signature Cafe",
    cuisine: "Coffee • Pastries",
    rating: 4.9,
    deliveryTime: "15-25 min",
    deliveryFee: 1.99,
    image: "☕",
    items: [
      {
        id: "c1",
        name: "Classic Cappuccino",
        price: 4.99,
        description: "Rich espresso topped with frothy milk",
      },
      {
        id: "c2",
        name: "Iced Caramel Macchiato",
        price: 5.99,
        description: "Chilled espresso with caramel and vanilla",
      },
      {
        id: "c3",
        name: "Butter Croissant",
        price: 3.49,
        description: "Flaky, buttery, freshly baked pastry",
      },
    ],
  },
  {
    id: "2",
    name: "The Cake Studio",
    cuisine: "Bakery • Desserts",
    rating: 4.8,
    deliveryTime: "30-45 min",
    deliveryFee: 2.99,
    image: "🍰",
    items: [
      {
        id: "b1",
        name: "Dark Chocolate Truffle",
        price: 18.99,
        description: "Half kg premium Belgian chocolate cake",
      },
      {
        id: "b2",
        name: "Red Velvet Slice",
        price: 6.99,
        description: "Soft sponge with cream cheese frosting",
      },
      {
        id: "b3",
        name: "Vanilla Cupcake",
        price: 3.99,
        description: "Classic vanilla with buttercream topping",
      },
    ],
  },
  {
    id: "3",
    name: "Chai & Chats",
    cuisine: "Tea • Snacks",
    rating: 4.6,
    deliveryTime: "15-20 min",
    deliveryFee: 0.99,
    image: "🍵",
    items: [
      {
        id: "t1",
        name: "Masala Chai",
        price: 2.49,
        description: "Authentic Indian tea infused with spices",
      },
      {
        id: "t2",
        name: "Green Tea",
        price: 2.99,
        description: "Organic soothing green tea leaves",
      },
      {
        id: "t3",
        name: "Samosa (2 pcs)",
        price: 3.49,
        description: "Crispy pastry filled with spiced potatoes",
      },
      {
        id: "t4",
        name: "Bun Maska",
        price: 1.99,
        description: "Soft bun layered with sweet butter",
      },
    ],
  },
  {
    id: "4",
    name: "Bakehouse Cookies",
    cuisine: "Cookies • Snacks",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: 1.49,
    image: "🍪",
    items: [
      {
        id: "k1",
        name: "Choco Chip Cookie",
        price: 2.99,
        description: "Large, chewy cookie with chocolate chunks",
      },
      {
        id: "k2",
        name: "Oatmeal Raisin",
        price: 2.49,
        description: "Healthy and soft oatmeal baked goodness",
      },
    ],
  },
];

export default resturants;