set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "posts" (
  "postId" serial primary key not null,
  "fileId" integer not null,
  "userId" integer not null,
  "createdAt" timestamptz default now() not null,
  "title" text not null,
  "description" text
);

create table "files" (
  "fileId" serial primary key not null,
  "filePath" text not null,
  "thumbnailPath" text not null,
  "filePropsSound" text,
  "filePropsName" text,
  "filePropsLayerCount" integer
);

create table "users" (
  "userId" serial unique primary key not null,
  "hashedPassword" text not null,
  "username" text unique not null,
  "createdAt" timestamptz default now() not null
);

create table "tags" (
  "tagName" text primary key not null
);

create table "taggings" (
  "tagName" text not null,
  "postId" integer not null
);

alter table "posts"
  add foreign key ("fileId") references "files" ("fileId");

alter table "posts"
  add foreign key ("userId") references "users" ("userId");

alter table "taggings"
  add foreign key ("tagName") references "tags" ("tagName");

alter table "taggings"
  add foreign key ("postId") references "posts" ("postId");
