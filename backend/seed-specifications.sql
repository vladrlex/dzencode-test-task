UPDATE products SET specification = CASE type
  WHEN 'Processors' THEN ELT(1 + (id MOD 4),
    'Socket AM4, 65W',
    'Socket AM5, 105W, 6-Core',
    'Socket LGA1700, 125W TDP, 14-Core/20-Thread',
    'Intel Core, Socket LGA1200')
  WHEN 'Televisions' THEN ELT(1 + (id MOD 4),
    '55 inch, 4K',
    '65 inch, 8K Neo QLED, 120Hz',
    '43 inch, Full HD Smart TV',
    '75 inch, OLED, Dolby Vision, HDMI 2.1')
  WHEN 'Mice' THEN ELT(1 + (id MOD 3),
    'Wireless, 16000 DPI',
    'USB, RGB, 6 buttons',
    'Bluetooth, ergonomic, rechargeable')
  WHEN 'Smartphones' THEN ELT(1 + (id MOD 3),
    '128GB, 6.1 inch OLED',
    '256GB, Dual SIM, 5G',
    '64GB, 90Hz display')
  WHEN 'Webcams' THEN ELT(1 + (id MOD 2),
    '1080p, USB',
    '4K, autofocus, built-in mic')
  WHEN 'Power Supplies' THEN ELT(1 + (id MOD 3),
    '650W, 80+ Bronze',
    '750W, 80+ Gold, Modular',
    '1000W, 80+ Platinum, Fully Modular')
  WHEN 'Motherboards' THEN ELT(1 + (id MOD 3),
    'Intel X58, ATX',
    'Socket AM5, mATX, DDR5',
    'Socket LGA1700, ATX, WiFi 6E')
  WHEN 'SSDs' THEN ELT(1 + (id MOD 3),
    '1TB, NVMe M.2',
    '512GB, SATA III',
    '2TB, PCIe 4.0, NVMe')
  WHEN 'Routers' THEN ELT(1 + (id MOD 3),
    'Wi-Fi 6, Dual-band',
    'AX6000, Mesh support',
    '4G LTE, Dual-band, 4 antennas')
  WHEN 'Graphics Cards' THEN ELT(1 + (id MOD 3),
    'PCIe 4.0, 8GB',
    '12GB GDDR6X, PCIe 4.0',
    '24GB GDDR6X, PCIe 5.0, RTX')
  WHEN 'Keyboards' THEN ELT(1 + (id MOD 3),
    'Mechanical, RGB, USB',
    'Wireless, low-profile, Bluetooth',
    'TKL, Hot-swappable switches')
  WHEN 'Laptops' THEN ELT(1 + (id MOD 3),
    '15.6 inch, 16GB RAM, 512GB SSD',
    '13.3 inch, 8GB RAM, 256GB SSD',
    '17.3 inch, 32GB RAM, 1TB SSD, RTX 4060')
  WHEN 'Monitors' THEN ELT(1 + (id MOD 3),
    '27 inch, 4K, IPS',
    '24 inch, Full HD, 144Hz',
    '34 inch, Ultrawide, Curved, 165Hz')
  WHEN 'Headsets' THEN ELT(1 + (id MOD 3),
    'Wireless, Noise-cancelling',
    '7.1 Surround, USB, RGB',
    'Bluetooth, 30h battery')
  WHEN 'Tablets' THEN ELT(1 + (id MOD 3),
    '10.9 inch, 64GB, WiFi',
    '12.9 inch, 256GB, Cellular, Stylus support',
    '8 inch, 32GB, Kids Edition')
  ELSE specification
END
WHERE specification = 'Standard specification' OR specification IS NULL;
