

### Music Product Catalog

This repository contains two versions of a Music Product Catalog project developed using Node.js, Express.js, and PostgreSQL.

#### Version 1: Musikkproduktkatalog_project1

- **Overview**: 
  - Developed using Node.js, Express.js, and PostgreSQL.
  - Implements a music product catalog with features such as product listings, user reviews, and user authentication.
  
- **Folder Structure**:
  - `.env`: Environment variables configuration.
  - `public`: Contains static assets like CSS files and images.
  - `routes`: Defines route handlers for different endpoints.
  - `views`: Contains EJS templates for rendering HTML pages.
  - `server.js`: Main entry point of the application.
  - `README.md`: Instructions and overview of the project.

#### Version 2: Musikkproduktkatalog_project2

- **Overview**: 
  - Developed using Node.js, Express.js, and PostgreSQL.
  - Implements a revised version of the music product catalog with enhanced features such as admin functionality and improved user interface.
  
- **Folder Structure**:
  - `.env`: Environment variables configuration.
  - `public`: Contains static assets like CSS files and images.
  - `routes`: Defines route handlers for different endpoints.
  - `views`: Contains EJS templates for rendering HTML pages.
  - `server.js`: Main entry point of the application.
  - `README.md`: Instructions and overview of the project.

#### How to Use:

1. Clone the repository to your local machine.
2. Navigate to the respective project folder (`Musikkproduktkatalog_project1` or `Musikkproduktkatalog_project2`).
3. Install dependencies using `npm install`.
4. Set up the required environment variables in the `.env` file.
5. Start the server using `npm start`.
6. Access the application in your web browser at `http://localhost:4000` (for `Musikkproduktkatalog_project1`) or `http://localhost:3000` (for `Musikkproduktkatalog_project2`).




```
Musikkproduktkatalog
├─ Musikkproduktkatalog_project1
│  ├─ .env
│  ├─ .vscode
│  │  └─ settings.json
│  ├─ db
│  │  └─ musikkpro.sql
│  ├─ dbConfig.js
│  ├─ insert-products.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ passportConfig.js
│  ├─ public
│  │  ├─ app.js
│  │  ├─ images
│  │  │  ├─ 1172543.jpg
│  │  │  ├─ 1172544.jpg
│  │  │  ├─ 1194630.png
│  │  │  ├─ 1194634.png
│  │  │  ├─ 1194635.png
│  │  │  ├─ 1194636.png
│  │  │  ├─ 1194637.png
│  │  │  ├─ 1194638.png
│  │  │  ├─ 1194639.png
│  │  │  ├─ 1194640.png
│  │  │  ├─ 1194641.png
│  │  │  ├─ 1194642.png
│  │  │  ├─ 1194643.png
│  │  │  ├─ 1194644.png
│  │  │  └─ user-128.png
│  │  ├─ index.html
│  │  └─ styles.css
│  ├─ README.md
│  ├─ routes
│  │  ├─ commentController.js
│  │  ├─ productController.js
│  │  ├─ productRoutes.js
│  │  └─ userRoutes.js
│  ├─ server.js
│  └─ views
│     ├─ categories.ejs
│     ├─ checkout.ejs
│     ├─ confirmation.ejs
│     ├─ dashboard.ejs
│     ├─ deleteAccount.ejs
│     ├─ detail.ejs
│     ├─ editProduct.ejs
│     ├─ editProfile.ejs
│     ├─ index.ejs
│     ├─ layout.ejs
│     ├─ login.ejs
│     ├─ register.ejs
│     └─ shoppingcart.ejs
├─ Musikkproduktkatalog_project2
│  ├─ .env
│  ├─ .vscode
│  ├─ auth.js
│  ├─ controllers
│  │  └─ adminController.js
│  ├─ database.js
│  ├─ db
│  │  └─ music_catalog.sql
│  ├─ insert-products.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ passport-config.js
│  ├─ public
│  │  ├─ app.js
│  │  ├─ images
│  │  │  ├─ 1172543.jpg
│  │  │  ├─ 1172544.jpg
│  │  │  ├─ 1194630.png
│  │  │  ├─ 1194634.png
│  │  │  ├─ 1194635.png
│  │  │  ├─ 1194636.png
│  │  │  ├─ 1194637.png
│  │  │  ├─ 1194638.png
│  │  │  ├─ 1194639.png
│  │  │  ├─ 1194640.png
│  │  │  ├─ 1194641.png
│  │  │  ├─ 1194642.png
│  │  │  ├─ 1194643.png
│  │  │  ├─ 1194644.png
│  │  │  ├─ setup.png
│  │  │  └─ user-128.png
│  │  ├─ index.html
│  │  └─ styles.css
│  ├─ README.md
│  ├─ routes
│  │  ├─ adminRoutes.js
│  │  ├─ commentController.js
│  │  ├─ productRoutes.js
│  │  ├─ userController.js
│  │  └─ userRoutes.js
│  ├─ server.js
│  └─ views
│     ├─ admin
│     │  ├─ add_review.ejs
│     │  ├─ dashboard_admin.ejs
│     │  ├─ delete_review.ejs
│     │  ├─ edit_review.ejs
│     │  ├─ login_admin.ejs
│     │  └─ register_admin.ejs
│     ├─ dashboard.ejs
│     ├─ delete_account.ejs
│     ├─ edit_profile.ejs
│     ├─ index.ejs
│     ├─ login.ejs
│     ├─ login_admin.ejs
│     └─ register.ejs
└─ README.md

```