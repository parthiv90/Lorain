const products = [
  // Men's Clothing
  {
    id: 1,
    name: "Men's Classic Fit T-Shirt",
    category: "men",
    price: 1899,
    image: "https://images.pexels.com/photos/8084769/pexels-photo-8084769.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "A comfortable, classic fit t-shirt made from 100% cotton.",
    rating: 4.5,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Gray"]
  },
  {
    id: 16,
    name: "Men's trench coat",
    category: "men",
    price: 7500,
    image: "https://images.pexels.com/photos/30033786/pexels-photo-30033786/free-photo-of-fashionable-man-in-urban-park-setting.png?auto=compress&cs=tinysrgb&w=2000",
    description: "A trench coat specifically made for a stylist guy.",
    rating: 4.5,
    inStock: true,
    sizes: ["30x32", "32x32", "34x32", "36x32", "38x32"],
    colors: ["Khaki", "Navy", "Olive", "Gray"]
  },

  {
    id: 2,
    name: "Men's Slim Fit Jeans",
    category: "men",
    price: 3799,
    image: "https://www.urbanofashion.com/cdn/shop/files/epsrustsprcrs-mgrey-1.png?v=1727020356&w=2500",
    description: "Stylish slim fit jeans with a modern look and comfortable stretch fabric.",
    rating: 4.3,
    inStock: true,
    sizes: ["30x32", "32x32", "34x32", "36x32", "38x32"],
    colors: ["Blue", "Black", "Gray"]
  },
  {
    id: 3,
    name: "Men's Casual Button-Down Shirt",
    category: "men",
    price: 2999,
    image: "https://images.pexels.com/photos/31202820/pexels-photo-31202820/free-photo-of-stylish-man-in-white-shirt-and-brown-hat-posing-outdoors.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "A versatile button-down shirt perfect for casual or semi-formal occasions.",
    rating: 4.7,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Light Blue", "Pink"]
  },
  {
    id: 4,
    name: "Men's Hooded Sweatshirt",
    category: "men",
    price: 2599,
    image: "https://images.pexels.com/photos/6150582/pexels-photo-6150582.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "A warm and comfortable hooded sweatshirt for casual wear.",
    rating: 4.2,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "Navy", "Green"]
  },
  {
    id: 5,
    name: "Men's Formal Blazer",
    category: "men",
    price: 6799,
    image: "https://images.pexels.com/photos/10141160/pexels-photo-10141160.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "An elegant formal blazer for professional and special occasions.",
    rating: 4.8,
    inStock: true,
    sizes: ["38R", "40R", "42R", "44R", "46R"],
    colors: ["Navy", "Black", "Gray"]
  },
  {
    id: 6,
    name: "Men's Athletic Shorts",
    category: "men",
    price: 2299,
    image: "https://plus.unsplash.com/premium_photo-1676736884513-f3deee925987?w=2000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEzfHxtZW4ncyUyMGF0aGxldGljJTIwc2hvcnRzfGVufDB8fDB8fHww",
    description: "Lightweight athletic shorts perfect for workouts and casual wear.",
    rating: 4.4,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Blue", "Red"]
  },
  {
    id: 13,
    name: "Men's Leather Jacket",
    category: "men",
    price: 8999,
    image: "https://buffalojackson.com/cdn/shop/files/bridger-leather-puffy-jacket-black-lifestyle-3_2000x.jpg?v=1698331239&w=2000",
    description: "Premium leather jacket with a classic design, perfect for cool weather.",
    rating: 4.9,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Brown", "Tan"]
  },

  {
    id: 14,
    name: "Men's Polo T-shirt",
    category: "men",
    price: 2499,
    image: "https://images.pexels.com/photos/29311748/pexels-photo-29311748/free-photo-of-trendy-young-man-in-sunglasses-and-polo-shirt-outdoors.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "Classic polo shirt made from breathable cotton piqué fabric.",
    rating: 4.6,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "White", "Black", "Green", "Red"]
  },
  {
    id: 16,
    name: "Men's Loafer",
    category: "men",
    price: 8990,
    image: "https://www.septiemelargeur.fr/cdn/shop/files/7L-Mocassins-classicmoc-Noir-2-2.jpg?v=1720015971&width=1200&w=2000",
    description: "Versatile black leather loafer suitable for casual and semi-formal occasions.",
    rating: 4.5,
    inStock: true,
    sizes: ["30x32", "32x32", "34x32", "36x32", "38x32"],
    colors: ["Khaki", "Navy", "Olive", "Gray"]
  },

  {
    id: 15,
    name: "Men's Winter Coat",
    category: "men",
    price: 7499,
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    description: "Insulated winter coat with water-resistant exterior and warm lining.",
    rating: 4.7,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Olive"]
  },
  {
    id: 16,
    name: "Men's Chino Pants",
    category: "men",
    price: 3499,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    description: "Versatile chino pants suitable for casual and semi-formal occasions.",
    rating: 4.5,
    inStock: true,
    sizes: ["30x32", "32x32", "34x32", "36x32", "38x32"],
    colors: ["Khaki", "Navy", "Olive", "Gray"]
  },

  // Women's Clothing
  {
    id: 7,
    name: "Women's Casual Blouse",
    category: "women",
    price: 2499,
    image: "https://images.pexels.com/photos/7680629/pexels-photo-7680629.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "A stylish and comfortable blouse for everyday wear.",
    rating: 4.6,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Pink", "Blue"]
  },
  {
    id: 8,
    name: "Women's Skinny Jeans",
    category: "women",
    price: 4199,
    image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    description: "Classic skinny jeans with a flattering fit and stretch fabric.",
    rating: 4.5,
    inStock: true,
    sizes: ["24", "26", "28", "30", "32"],
    colors: ["Blue", "Black", "Gray", "White"]
  },
  {
    id: 9,
    name: "Women's Summer Dress",
    category: "women",
    price: 4499,
    image: "https://images.pexels.com/photos/2878761/pexels-photo-2878761.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "A light and flowy summer dress perfect for warm weather.",
    rating: 4.7,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral", "Blue", "Red", "Yellow"]
  },
  {
    id: 12,
    name: "Women's Trench Coat",
    category: "women",
    price: 8999,
    image: "https://images.pexels.com/photos/20428985/pexels-photo-20428985/free-photo-of-model-in-a-beige-coat-over-a-turtleneck-and-black-jeans-standing-on-the-steps.jpeg?auto=compress&cs=tinysrgb&w=2000&lazy=load",
    description: "A tailored trench coat perfect for everyday occasions.",
    rating: 4.8,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray", "White"]
  },
  {
    id: 10,
    name: "Women's Cardigan Sweater",
    category: "women",
    price: 2999,
    image: "https://images.pexels.com/photos/8989555/pexels-photo-8989555.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "A cozy cardigan sweater for layering in any season.",
    rating: 4.4,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Gray", "Beige", "Black", "Navy"]
  },
  {
    id: 11,
    name: "Women's Yoga Pants",
    category: "women",
    price: 2799,
    image: "https://images.pexels.com/photos/4151448/pexels-photo-4151448.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "Comfortable and stretchy yoga pants for workouts or casual wear.",
    rating: 4.3,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy", "Purple"]
  },
  {
    id: 12,
    name: "Women's Formal Blazer",
    category: "women",
    price: 5999,
    image: "https://images.pexels.com/photos/29432659/pexels-photo-29432659/free-photo-of-elegant-woman-posing-in-modern-interior-design.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "A tailored blazer perfect for professional settings and formal occasions.",
    rating: 4.8,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray", "White"]
  },
  {
    id: 17,
    name: "Women's Maxi Dress",
    category: "women",
    price: 4299,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    description: "Elegant floor-length maxi dress perfect for special occasions.",
    rating: 4.8,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy", "Emerald"]
  },
  {
    id: 18,
    name: "Women's Leather Handbag",
    category: "women",
    price: 5499,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    description: "Premium leather handbag with multiple compartments and elegant design.",
    rating: 4.9,
    inStock: true,
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan", "Red"]
  },
  {
    id: 19,
    name: "Women's Winter Coat",
    category: "women",
    price: 6999,
    image: "https://images.pexels.com/photos/1381565/pexels-photo-1381565.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "Warm and stylish winter coat with faux fur trim and insulated lining.",
    rating: 4.7,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Camel", "Red"]
  },
  {
    id: 20,
    name: "Women's Ankle Boots",
    category: "women",
    price: 4799,
    image: "https://images.pexels.com/photos/5713311/pexels-photo-5713311.jpeg?auto=compress&cs=tinysrgb&w=2000",
    description: "Stylish ankle boots with comfortable heel and durable construction.",
    rating: 4.6,
    inStock: true,
    sizes: ["5", "6", "7", "8", "9", "10"],
    colors: ["Black", "Brown", "Tan"]
  }
];

export default products; 