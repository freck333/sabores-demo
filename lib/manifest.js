(function () {
  "use strict";
  window.__BRAND__ = {
    name: "Sabores",
    tagline: "Cocina de temporada, hecha a mano",
    year: "2026",

    menu: [
      {
        id: "m-1",
        name: "Tataki de atún",
        desc: "Sésamo tostado, cítricos de temporada, aceite de oliva virgen.",
        price: "220",
        photo: "assets/img/dish-3.jpg",
        big: true
      },
      {
        id: "m-2",
        name: "Pasta al salmón",
        desc: "Pasta fresca hecha en casa, salmón curado, eneldo.",
        price: "195",
        photo: "assets/img/dish-2.jpg"
      },
      {
        id: "m-3",
        name: "Truffle burger",
        desc: "Carne madurada, trufa negra, queso curado, pan brioche.",
        price: "210",
        photo: "assets/img/dish-1.jpg"
      },
      {
        id: "m-4",
        name: "Crêpe de chocolate",
        desc: "Chocolate 70%, pistacho, azúcar glas.",
        price: "95",
        photo: "assets/img/dish-4.jpg"
      }
    ],

    values: [
      { label: "Ingredientes de temporada" },
      { label: "Proveedores locales" },
      { label: "Hecho a mano cada día" },
      { label: "Sin atajos" }
    ],

    testimonials: [
      {
        quote: "Un sitio pequeño con la seriedad de una cocina grande. Volvemos cada mes.",
        author: "Marta R.",
        photo: "assets/img/interior.jpg"
      },
      {
        quote: "La carta cambia con las estaciones y se nota. Nada está ahí por relleno.",
        author: "Daniel O.",
        photo: "assets/img/chef-hands.jpg"
      },
      {
        quote: "Reservamos para una ocasión especial y terminamos yendo cada quincena.",
        author: "Lucía F.",
        photo: "assets/img/ingredients.jpg"
      }
    ],

    hours: [
      { day: "Martes – Viernes", time: "13:00 – 16:00 · 20:00 – 23:30" },
      { day: "Sábado", time: "13:00 – 23:30" },
      { day: "Domingo", time: "13:00 – 17:00" },
      { day: "Lunes", time: "Cerrado" }
    ],

    contact: {
      email: "hola@sabores-demo.com",
      phone: "+52 55 1234 5678",
      address: "Av. Álvaro Obregón 123, Col. Roma Norte, Ciudad de México"
    },

    social: [
      { label: "Instagram", url: "#" },
      { label: "Facebook", url: "#" }
    ]
  };
})();
