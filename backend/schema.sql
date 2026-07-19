CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`username`, `password_hash`) VALUES
  ('admin', '$2b$10$TE2KbeG0rNnZb0yUlfOUg.O3WrojpuRE6lqPaoM1I8ZhxkHcyxoe6');

CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `date` DATETIME NOT NULL,
  `description` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `serialNumber` INT NOT NULL,
  `isNew` TINYINT(1) NOT NULL DEFAULT 1,
  `photo` VARCHAR(255) NULL,
  `title` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `specification` TEXT NULL,
  `supplier` VARCHAR(255) NULL,
  `guarantee_start` DATETIME NULL,
  `guarantee_end` DATETIME NULL,
  `order_id` INT NOT NULL,
  `date` DATETIME NOT NULL,
  CONSTRAINT `fk_products_orders`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 
CREATE TABLE `prices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `value` DECIMAL(10, 2) NOT NULL,
  `symbol` VARCHAR(10) NOT NULL,
  `isDefault` TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT `fk_prices_products`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 