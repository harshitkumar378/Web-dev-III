# Inventory and Data Management System

## Table of Contents

1. [About the Project](#1-about-the-project)
2. [Technology Stack](#2-technology-stack)
3. [Features](#3-features)
4. [Project Structure](#4-project-structure)
5. [Setup and Run](#5-setup-and-run)
6. [Environment Variables](#6-environment-variables)
7. [Sample Data](#7-sample-data)
8. [Product Schema](#8-product-schema)
9. [API Endpoints](#9-api-endpoints)
10. [Query Parameters for Get All Products](#10-query-parameters-for-get-all-products)
11. [Example Requests and Responses](#11-example-requests-and-responses)
12. [Validation and Error Handling](#12-validation-and-error-handling)
13. [How the Aggregation Reports Work](#13-how-the-aggregation-reports-work)
14. [Testing in Postman](#14-testing-in-postman)
15. [Concepts Covered](#15-concepts-covered)

---

## 1. About the Project

This is a REST API backend for a store or warehouse. It manages a product catalogue and stores everything in MongoDB.

With this API we can:

- add, view, update and delete products
- search, filter, sort and paginate the product list
- increase stock (restock) or decrease stock (sale) safely
- get a low-stock report
- get a category-wise inventory summary

---

## 2. Technology Stack

| Technology | Use |
|---|---|
| Node.js | Runs JavaScript on the server |
| Express.js | Routes and middleware |
| MongoDB | Database that stores the products |
| Mongoose | Schema, validation and queries |
| dotenv | Loads settings from the `.env` file |

Only these four are used, as the assignment requires.

---

## 3. Features

- [x] Product schema with field-level validation
- [x] Create product
- [x] Get all products with filtering, sorting and pagination
- [x] Get single product by ID
- [x] Update product details
- [x] Stock adjustment (restock and sale)
- [x] Delete product
- [x] Low-stock alert report (aggregation)
- [x] Category-wise inventory summary (aggregation)
- [x] Input validation middleware
- [x] Centralized error handling
- [x] Environment variables with dotenv

---

## 4. Project Structure

```
Assignment_3/
├── .env                          # PORT and MONGO_URI
├── package.json                  # project details and packages
├── sampleProducts.json           # 12 sample products
├── index.js                      # starts Express
├── config/
│   └── db.js                     # connects to MongoDB
├── models/
│   └── product.js                # schema and validation
├── controllers/
│   └── productController.js      # logic of every API
├── routes/
│   └── productRoutes.js          # list of URLs
└── middlewares/
    ├── validateProduct.js        # checks input before the controller
    └── errorHandler.js           # handles all errors in one place
```

| File | What it does |
|---|---|
| `index.js` | Reads `.env`, connects the database, loads routes, starts the server |
| `config/db.js` | MongoDB connection function |
| `models/product.js` | Fields and rules of a product |
| `controllers/productController.js` | CRUD, filtering, stock update and reports |
| `routes/productRoutes.js` | Connects each URL to a controller function |
| `middlewares/validateProduct.js` | Stops wrong input with a 400 error |
| `middlewares/errorHandler.js` | Sends a clean message for every error |

---

## 5. Setup and Run

**Requirements:** Node.js, MongoDB Community Server (running) and Postman for testing.

**Step 1.** Open the `Assignment_3` folder in VS Code.

**Step 2.** Open the terminal (Terminal > New Terminal) and install the packages:

```
npm install
```

**Step 3.** Make sure MongoDB is running. If MongoDB Compass can connect, it is running.

**Step 4.** Start the server:

```
node index.js
```

**Step 5.** You should see:

```
Server is running on PORT 5000
Mongodb Connected
```

To stop the server press `Ctrl + C`. After changing any file, stop the server and run `node index.js` again.

---

## 6. Environment Variables

Create a file named `.env` in the main folder:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/inventoryDB
```

| Variable | Meaning |
|---|---|
| `PORT` | Port number of the server |
| `MONGO_URI` | Address of the MongoDB database (`inventoryDB`) |

---

## 7. Sample Data

The file `sampleProducts.json` has 12 products in 5 categories (Electronics, Apparel, Furniture, Stationery, Groceries). 4 of them are low-stock items.

**Import using MongoDB Compass:**

1. Connect to `mongodb://127.0.0.1:27017`.
2. Open database `inventoryDB` and collection `products`. Create them if they do not exist.
3. Click **Add Data**, then **Import JSON or CSV file**.
4. Choose `sampleProducts.json`, keep the type as JSON and click **Import**.
5. You should see 12 documents.

Import only once. A second import fails because every SKU must be unique.

---

## 8. Product Schema

| Field | Type | Rules |
|---|---|---|
| `name` | String | required, extra spaces removed |
| `sku` | String | required, unique, saved in UPPERCASE |
| `category` | String | required |
| `price` | Number | required, minimum 0 |
| `quantity` | Number | required, minimum 0, whole number only |
| `reorderLevel` | Number | default 10, minimum 0 |
| `supplier` | String | optional |
| `createdAt` | Date | added automatically |
| `updatedAt` | Date | added automatically |
| `stockValue` | Number | **virtual field** = `price x quantity`, not stored in the database |

---

## 9. API Endpoints

Base URL: `http://localhost:5000/api/products`

| Method | URL | Purpose | Success Response |
|---|---|---|---|
| POST | `/api/products` | Create a product | 201 and the product |
| GET | `/api/products` | List products (filter, sort, pagination) | 200 and `total, page, totalPages, count, products` |
| GET | `/api/products/low-stock` | Products with quantity <= reorderLevel | 200 and `count, lowStockItems` |
| GET | `/api/products/summary` | Category-wise inventory summary | 200 and `categories, summary` |
| GET | `/api/products/:id` | Get one product | 200 and the product |
| PUT | `/api/products/:id` | Update product details | 200 and the updated product |
| PATCH | `/api/products/:id/stock` | Restock or sale | 200 and `message, product` |
| DELETE | `/api/products/:id` | Delete a product | 200 and `message, id` |

> **Note:** `/low-stock` and `/summary` are written **before** `/:id` in the routes file. Otherwise Express would treat the words "low-stock" and "summary" as an id.

---

## 10. Query Parameters for Get All Products

`GET /api/products`

| Parameter | Example | Meaning |
|---|---|---|
| `page` | `page=2` | Page number (default 1) |
| `limit` | `limit=5` | Products per page (default 10) |
| `category` | `category=Electronics` | Only this category (write it exactly as saved) |
| `supplier` | `supplier=boAt` | Only this supplier (write it exactly as saved) |
| `search` | `search=pen` | Part of the product name (capital/small letters ignored) |
| `minPrice` | `minPrice=500` | Price greater than or equal to this |
| `maxPrice` | `maxPrice=5000` | Price less than or equal to this |
| `sort` | `sort=price` or `sort=-price` | Low to high, or high to low with `-` |

We can combine them:

```
GET /api/products?category=Electronics&minPrice=1000&sort=-price&page=1&limit=5
```

Pagination formula: `skip = (page - 1) x limit` and `totalPages = ceil(total / limit)`.

---

## 11. Example Requests and Responses

### Create a product

`POST /api/products`

```json
{
  "name": "Gel Pen Pack of 15",
  "sku": "STNY-PN-713",
  "category": "Stationery",
  "price": 120,
  "quantity": 40,
  "reorderLevel": 20,
  "supplier": "Cello Pens"
}
```

Response (201 Created): the saved product with `_id`, `createdAt`, `updatedAt`, `stockValue` (4800) and `id`.

### Update a product

`PUT /api/products/<id>`. Send only the fields we want to change:

```json
{ "price": 140, "quantity": 60 }
```

Response (200): the updated product. `stockValue` becomes 8400.

### Adjust stock

`PATCH /api/products/<id>/stock`

```json
{ "change": 10 }
```

- A positive number is a **restock** (adds to the quantity).
- A negative number is a **sale** (removes from the quantity).
- If a sale is bigger than the available stock, the API returns an error and the quantity stays the same.

Response:

```json
{
  "message": "Stock updated",
  "product": { "...": "updated product" }
}
```

### Delete a product

`DELETE /api/products/<id>`

```json
{
  "message": "Product deleted",
  "id": "<id>"
}
```

### Get all products

`GET /api/products`

```json
{
  "total": 12,
  "page": 1,
  "totalPages": 2,
  "count": 10,
  "products": [ "..." ]
}
```

### Low-stock report

`GET /api/products/low-stock`

```json
{
  "count": 4,
  "lowStockItems": [ "..." ]
}
```

### Category summary

`GET /api/products/summary`

```json
{
  "categories": 5,
  "summary": [
    {
      "_id": "Electronics",
      "totalItems": 4,
      "totalQuantity": 88,
      "totalStockValue": 448062,
      "avgPrice": 5636.5
    }
  ]
}
```

(The numbers depend on the data in your database.)

---

## 12. Validation and Error Handling

**Validation middleware** (`validateProduct.js`) runs before the controller:

| Route | Check |
|---|---|
| POST | `name`, `sku`, `category` are required. `price` and `quantity` must be numbers. |
| PATCH stock | `change` must be a whole number and not 0. |

**Error handler** (`errorHandler.js`) is the one place where errors are turned into messages:

| Situation | Status | Message |
|---|---|---|
| Missing or wrong input (middleware) | 400 | for example `price is required and must be a number` |
| Schema rule broken (negative price, decimal quantity) | 400 | `product validation failed: ...` with the reason |
| Same SKU used twice | 400 | `SKU already exists` |
| Invalid product id (for example `abc`) | 400 | `Invalid product id` |
| Sale bigger than stock | 400 | `Not enough stock. Available quantity: N` |
| Broken JSON in the body | 400 | `Invalid JSON in request body` |
| Product not found | 404 | `Product not found` |
| Wrong URL | 404 | `Route not found` |
| Any other error | 500 | `Server error` |

Every controller uses `try/catch` and passes the error to the error handler with `next(err)`.

---

## 13. How the Aggregation Reports Work

An aggregation pipeline is a list of stages. The output of one stage goes into the next stage.

### Low-stock report

| Stage | What it does |
|---|---|
| `$match` with `$expr` | Keeps only products where `quantity <= reorderLevel` |
| `$sort` | Puts the lowest quantity first |
| `$project` | Chooses the fields to show and adds `stockValue` using `$multiply` |

### Category summary

| Stage | What it does |
|---|---|
| `$group` | Makes one result per category. Uses `$sum` for items, quantity and stock value, and `$avg` for the average price |
| `$sort` | Puts the highest stock value first |

### Stock update

The stock API finds the product, adds `change` to the quantity and checks the new quantity. If it would be below 0, it sends an error and does not save. So the stock never goes negative.

---

## 14. Testing in Postman

Keep the server running. For POST, PUT and PATCH select **Body**, then **raw**, then **JSON**.

| # | Request | Expected result |
|---|---|---|
| 1 | `GET /api/products` | total 12, page 1, totalPages 2, count 10 |
| 2 | `GET /api/products?page=2` | count 2 |
| 3 | `GET /api/products?category=Electronics&sort=-price` | Electronics only, costliest first |
| 4 | `POST /api/products` with the Gel Pen body | 201 Created, stockValue 4800 |
| 5 | Copy the `_id` from step 4 | used in steps 6 to 9 |
| 6 | `GET /api/products/<id>` | that one product |
| 7 | `PUT /api/products/<id>` with `{ "price": 140, "quantity": 60 }` | stockValue 8400 |
| 8 | `PATCH /api/products/<id>/stock` with `{ "change": -5 }` | "Stock updated", quantity 55 |
| 9 | `DELETE /api/products/<id>` | "Product deleted" |
| 10 | `GET /api/products/low-stock` | count 4 |
| 11 | `GET /api/products/summary` | categories 5 |

**Error tests:**

| Request | Expected result |
|---|---|
| POST the same SKU again | 400, `SKU already exists` |
| `GET /api/products/abc` | 400, `Invalid product id` |
| PATCH with `{ "change": -1000 }` | 400, `Not enough stock` |
| POST with `"price": -5` | 400, `product validation failed` |
| `GET` with a valid id that is not in the database | 404, `Product not found` |

---

## 15. Concepts Covered

Mongoose schema design, field-level validation, virtual fields, RESTful CRUD, query parameters, filtering, sorting, pagination, aggregation pipelines, middleware, centralized error handling and dotenv configuration.
