# Symbol Art Vault

## A web application for [_Phantasy Star Online 2_](https://ngs.pso2.com) players who want to share their _Symbol Arts_ online.

Within _PSO2_, players can chat using special images known as _Symbol Arts_. These files are stored as `.sar` files within the game's `symbolarts` folder in the user's `Documents/SEGA/PSO2~` directory. However, all `.sar` files are not named, and due to the special file format, they don't have native previews that make them easy to manage and share. This application aims to tackle the difficult sharability of _Symbol Arts_ and give people a way to see Symbol Arts before downloading them and viewing them in-game.

---

## [Open the live app demo!](https://symbol-art-vault.herokuapp.com/)

> ### This live app demo is intended for portfolio demonstration. All data is reset on a consistent schedule; your posts won't stick around.

---

## Preview

> # [TODO]

---

## Technologies Used

Languages: HTML5 (Pug template engine), CSS, JavaScript (ES6)

### Development Tools

- **Webpack** 
  - JavaScript - **Babel**
  - CSS - **PostCSS** with **Auto Prefixer**

### Front-End

- UI Framework - **React**
  - `react-router`
  - `react-lazy-load-image-component`
- CSS Framework - **Tailwind CSS**
- Component Library - **DaisyUI**
- `.sar` Rendering - **PixiJS**
  - Sprites and Sounds indexing and files by [@malulleybovo](https://github.com/malulleybovo/SymbolArtEditorOnline) sourced from [malulleybovo/SymbolArtEditorOnline](https://github.com/malulleybovo/SymbolArtEditorOnline)
- `.sar` Parsing - Algorithm by [@HybridEidolon](https://github.com/HybridEidolon) within [HybridEidolon/saredit](https://github.com/HybridEidolon/saredit)

### Back-End

- Server Runtime - **Express (Node.js)**
  - OpenGraph Meta Tag Rendering - `pug`
- Database - **PostgreSQL** with **node-postgres**
- File Storage - **AWS S3** via `multer` and `multer-s3`
- Authentication - **JWT**, `argon2`

### Etc.

- `yup`
- `lodash`

---

## Feature List

- User can upload a `.sar` file and create a post.
- User can view all posts with preview and download the attached `.sar` file.
- User can view a single post and navigate to it via URL.
- User can search for posts by Title, Description, Tags, and Username
- User can view details of posts in link embeds (OpenGraph Meta Tags)
- User can create, login, and sign out of an account.
- User can view posts of any other user.

## Stretch Features

- Production Deployment to enable use by the public.
  - Twitter App Authentication.
  - Admin Dashboard to enable content moderation.

--- 

## System Requirements

- Node (v18 or higher)
- NPM (v8.9.0 or higher)
- PostgreSQL (v14 or higher)

## Development

> # [TODO]

---




*ⒸSEGA PHANTASY STAR ONLINE 2 http://pso2.com.*

*All rights to the copyrighted works (images, data, audios, texts, etc.) used in PSO2 are owned by SEGA Corporation.*

*All other trademarks, logos and copyrights are property of their respective owners*
