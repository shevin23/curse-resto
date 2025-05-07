
# Database Schema for The Undead Buffet API

## Tables and Relationships

### Room
- `id` (UUID) - Primary key
- `name` (string) - Name of the room
- `description` (text) - Description of the room
- `image_url` (string) - URL to the room image
- `created_at` (datetime) - Creation timestamp
- `updated_at` (datetime) - Last update timestamp

### MenuItem
- `id` (UUID) - Primary key
- `room_id` (UUID) - Foreign key referencing Room
- `name` (string) - Default name of the menu item
- `name_mummy` (string) - Egyptian style name for mummies
- `name_zombie` (string) - Brain-related name for zombies
- `description` (text) - Description of the menu item
- `price` (decimal) - Price of the menu item
- `curse_level` (integer) - Spice or decay rating (1-5)
- `image_url` (string, nullable) - URL to the menu item image
- `created_at` (datetime) - Creation timestamp
- `updated_at` (datetime) - Last update timestamp

### Ingredient
- `id` (UUID) - Primary key
- `name` (string) - Name of the ingredient
- `description` (text, nullable) - Description of the ingredient
- `created_at` (datetime) - Creation timestamp
- `updated_at` (datetime) - Last update timestamp

### MenuItemIngredient (Join table)
- `menu_item_id` (UUID) - Foreign key referencing MenuItem
- `ingredient_id` (UUID) - Foreign key referencing Ingredient
- Primary key is the combination of (menu_item_id, ingredient_id)

### Order
- `id` (UUID) - Primary key
- `status` (string, enum) - Order status (preparing, summoning, delivering, completed)
- `identity` (string) - Customer identity (zombie or mummy)
- `customer_name` (string) - Customer name
- `customer_email` (string) - Customer email
- `special_requests` (text, nullable) - Special requests
- `total_amount` (decimal) - Total order amount
- `created_at` (datetime) - Creation timestamp
- `updated_at` (datetime) - Last update timestamp

### OrderItem
- `id` (UUID) - Primary key
- `order_id` (UUID) - Foreign key referencing Order
- `menu_item_id` (UUID) - Foreign key referencing MenuItem
- `name` (string) - Name of the menu item at time of order
- `price` (decimal) - Price at time of order
- `quantity` (integer) - Quantity ordered
- `created_at` (datetime) - Creation timestamp
- `updated_at` (datetime) - Last update timestamp

## Relationships

1. **Room to MenuItem**: One-to-Many
   - A Room has many MenuItems
   - A MenuItem belongs to one Room

2. **MenuItem to Ingredient**: Many-to-Many (through MenuItemIngredient)
   - A MenuItem has many Ingredients
   - An Ingredient can be used in many MenuItems

3. **Order to OrderItem**: One-to-Many
   - An Order has many OrderItems
   - An OrderItem belongs to one Order

4. **MenuItem to OrderItem**: One-to-Many
   - A MenuItem can be referenced by many OrderItems
   - An OrderItem references one MenuItem

## Symfony API Platform Endpoints

Based on this schema, the following API endpoints will be available:

- `GET /api/rooms` - List all rooms
- `GET /api/rooms/{id}` - Get a specific room
- `GET /api/menu_items` - List all menu items
- `GET /api/menu_items?roomId={roomId}` - List menu items for a specific room
- `GET /api/menu_items/{id}` - Get a specific menu item
- `GET /api/ingredients` - List all ingredients
- `GET /api/orders` - List all orders
- `GET /api/orders/{id}` - Get a specific order
- `POST /api/orders` - Create a new order
- `PATCH /api/orders/{id}` - Update an order (e.g., change status)
- `GET /api/order_items` - List all order items
- `GET /api/order_items?orderId={orderId}` - List items for a specific order
