set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "posts" (
  "postId" serial primary key not null,
  "fileId" integer not null,
  "userId" integer not null,
  "createdAt" timestamptz not null default now(),
  "title" text not null,
  "description" text
);

create table "files" (
  "fileId" serial primary key not null,
  "fileObjectKey" text not null,
  "previewImagePath" text not null,
  "filePropsName" text,
  "filePropsSound" integer,
  "filePropsLayerCount" integer
);

create table "users" (
  "userId" serial unique primary key not null,
  "username" text unique not null,
  "hashedPassword" text unique not null,
  "createdAt" timestamptz not null default now()
);

create table "tags" (
  "tagName" text primary key not null
);

create table "taggings" (
  "tagName" text not null,
  "postId" integer not null
);

alter table "posts"
  add foreign key ("fileId") references "files" ("fileId") on delete cascade;

alter table "posts"
  add foreign key ("userId") references "users" ("userId");

alter table "taggings"
  add foreign key ("tagName") references "tags" ("tagName") on delete cascade;

alter table "taggings"
  add foreign key ("postId") references "posts" ("postId") on delete cascade;
