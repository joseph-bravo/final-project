set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "posts" (
  "postId" SERIAL PRIMARY KEY NOT NULL,
  "userId" integer NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "title" text NOT NULL,
  "description" text,
  "fileObjectKey" text NOT NULL,
  "fileThumbnailUrl" text NOT NULL,
  "filePropsName" text NOT NULL,
  "filePropsSound" integer NOT NULL,
  "filePropsLayerCount" integer NOT NULL
);

CREATE TABLE "users" (
  "userId" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "username" text UNIQUE NOT NULL,
  "hashedPassword" text UNIQUE NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "tags" (
  "tagName" text PRIMARY KEY NOT NULL
);

CREATE TABLE "taggings" (
  "tagName" text NOT NULL,
  "postId" integer NOT NULL
);

ALTER TABLE "posts" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId") on delete cascade;

ALTER TABLE "taggings" ADD FOREIGN KEY ("tagName") REFERENCES "tags" ("tagName") on delete cascade;

ALTER TABLE "taggings" ADD FOREIGN KEY ("postId") REFERENCES "posts" ("postId") on delete cascade;
