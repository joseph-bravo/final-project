set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "posts" (
  "postId" serial primary key not null,
  "fileId" integer not null,
  "userId" integer,
  "createdAt" timestamptz,
  "title" text,
  "description" text
);

create table "files" (
  "fileId" serial primary key not null,
  "filePath" text not null,
  "thumnbnailPath" text not null,
  "filePropsSound" text,
  "filePropsName" text,
  "filePropsLayerCount" integer
);

create table "users" (
  "userId" serial unique primary key not null,
  "hashedPassword" text unique not null,
  "createdAt" timestamptz
);

create table "tags" (
  "tagId" serial primary key not null,
  "name" text
);

create table "taggings" (
  "tagId" integer,
  "postId" integer
);

alter table "posts"
  add foreign key ("fileId") references "files" ("fileId");

alter table "posts"
  add foreign key ("userId") references "users" ("userId");

alter table "taggings"
  add foreign key ("tagId") references "tags" ("tagId");

alter table "taggings"
  add foreign key ("postId") references "posts" ("postId");
