> # This repository has been archived. View [arks-moe/symbols](https://github.com/arks-moe/symbols) for a more up-to-date/usable version. 

# Symbol Art Vault

## A web application for [_Phantasy Star Online 2_](https://ngs.pso2.com) players who want to share their _Symbol Arts_ online. ✨

Within _PSO2_, players can chat using special images known as _Symbol Arts_. These files are stored as `.sar` files within the game's `symbolarts` folder in the user's `Documents/SEGA/PSO2~` directory. However, all `.sar` files are not named, and due to the special file format, they don't have native previews that make them easy to manage and share. This application aims to tackle the difficult sharability of _Symbol Arts_ and give people a way to see Symbol Arts before downloading them and viewing them in-game.

Demo credentials are available [here](docs/demo-credentials.md).

Need some `.sar` files to test the app? Download some [from this repo!](https://github.com/joseph-bravo/symbol-arts)

# 📷 Preview

![Catalog Preview](https://user-images.githubusercontent.com/78003700/174192142-2c235232-ba3a-4151-949b-38851dbe16a4.gif)
![Upload Form Preview](https://user-images.githubusercontent.com/78003700/174192609-2b7a9e1a-5abd-4914-87e2-378b14d2e127.gif)


---

# ⚙️ Technologies Used

Languages: HTML5 (Pug template engine), CSS, JavaScript (ES6)

## ⚒️ Development Tools

- **Webpack** 
  - JavaScript - **Babel**
  - CSS - **PostCSS** with **Auto Prefixer**

## 💻 Front-End

- UI Framework - **React**
  - `react-router`
  - `react-lazy-load-image-component`
- CSS Framework - **Tailwind CSS**
- Component Library - **DaisyUI**
- `.sar` Rendering - **PixiJS**
  - Sprites and Sounds indexing and files by [@malulleybovo](https://github.com/malulleybovo/SymbolArtEditorOnline) sourced from [malulleybovo/SymbolArtEditorOnline](https://github.com/malulleybovo/SymbolArtEditorOnline)
- `.sar` Parsing - Algorithm by [@HybridEidolon](https://github.com/HybridEidolon) within [HybridEidolon/saredit](https://github.com/HybridEidolon/saredit)

## ⌨️ Back-End

- Server Runtime - **Express (Node.js)**
  - OpenGraph Meta Tag Rendering - `pug`
- Database - **PostgreSQL** with **node-postgres**
- File Storage - **AWS S3** via `multer` and `multer-s3`
- Authentication - **JWT**, `argon2`

## 📚 Etc.

- `yup`
- `lodash`

# ⛅ Feature List

- User can upload a `.sar` file and create a post.
- User can view all posts with preview and download the attached `.sar` file.
- User can view a single post and navigate to it via URL.
- User can search for posts by Title, Description, Tags, and Username
- User can view details of posts in link embeds (OpenGraph Meta Tags)
- User can create, login, and sign out of an account.
- User can view posts of any other user.

# 🔮 Stretch Features

- Production Deployment to enable use by the public.
  - Twitter App Authentication.
  - Admin Dashboard to enable content moderation.


# 🪛 System Requirements

- Node (v18 or higher)
- NPM (v8.9.0 or higher)
- PostgreSQL (v14 or higher)

# 🧑‍💻 Development Setup

- Run `cp .env.example .env` for environmental variables.
- Ensure a PostgreSQL Database is available and put its connection URL into `.env`.
- Replace AWS `.env` variable values with corresponding target S3 Bucket and IAM user keys.
- Change `TOKEN_SECRET` to something secure.
- Run `npm i` to install dependencies.
- Run `npm run db:import` to initialize database tables (⚠️ THIS DROPS THE CURRENT PUBLIC SCHEMA!!!).
- Run `npm run dev` to spin up a development server.
- Start developing! 📝

## Deployment

- Run `npm run build` and `npm start` to build and run the production server.

## Helper Scripts

- `npm run db:save` to create a `savestate.sql`
- `npm run db:load` to drop current public schema and load from `savestate.sql`

> #### Note: The current save state in the repo only applies to the demo's S3 bucket. You won't be able to use this.

---

*ⒸSEGA PHANTASY STAR ONLINE 2 http://pso2.com.*

*All rights to the copyrighted works (images, data, audios, texts, etc.) used in PSO2 are owned by SEGA Corporation.*

*All other trademarks, logos and copyrights are property of their respective owners*
