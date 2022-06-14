--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3 (Ubuntu 14.3-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: files; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.files (
    "fileId" integer NOT NULL,
    "postId" integer NOT NULL,
    "fileObjectKey" text NOT NULL,
    "previewImagePath" text NOT NULL,
    "filePropsName" text,
    "filePropsSound" integer,
    "filePropsLayerCount" integer
);


ALTER TABLE public.files OWNER TO dev;

--
-- Name: files_fileId_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public."files_fileId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."files_fileId_seq" OWNER TO dev;

--
-- Name: files_fileId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public."files_fileId_seq" OWNED BY public.files."fileId";


--
-- Name: posts; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.posts (
    "postId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    description text
);


ALTER TABLE public.posts OWNER TO dev;

--
-- Name: posts_postId_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public."posts_postId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."posts_postId_seq" OWNER TO dev;

--
-- Name: posts_postId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public."posts_postId_seq" OWNED BY public.posts."postId";


--
-- Name: taggings; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.taggings (
    "tagName" text NOT NULL,
    "postId" integer NOT NULL
);


ALTER TABLE public.taggings OWNER TO dev;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.tags (
    "tagName" text NOT NULL
);


ALTER TABLE public.tags OWNER TO dev;

--
-- Name: users; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.users (
    "userId" integer NOT NULL,
    username text NOT NULL,
    "hashedPassword" text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO dev;

--
-- Name: users_userId_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public."users_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."users_userId_seq" OWNER TO dev;

--
-- Name: users_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public."users_userId_seq" OWNED BY public.users."userId";


--
-- Name: files fileId; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.files ALTER COLUMN "fileId" SET DEFAULT nextval('public."files_fileId_seq"'::regclass);


--
-- Name: posts postId; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.posts ALTER COLUMN "postId" SET DEFAULT nextval('public."posts_postId_seq"'::regclass);


--
-- Name: users userId; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users ALTER COLUMN "userId" SET DEFAULT nextval('public."users_userId_seq"'::regclass);


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.files ("fileId", "postId", "fileObjectKey", "previewImagePath", "filePropsName", "filePropsSound", "filePropsLayerCount") FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.posts ("postId", "userId", "createdAt", title, description) FROM stdin;
\.


--
-- Data for Name: taggings; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.taggings ("tagName", "postId") FROM stdin;
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.tags ("tagName") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.users ("userId", username, "hashedPassword", "createdAt") FROM stdin;
1	anonymous	fakepassword	2022-06-14 18:30:05.662215+00
3	username	$argon2i$v=19$m=4096,t=3,p=1$koSwLtIHUf9hk9zmJ3UlCA$NJ1Ge0pAiV17LFmcGqXvqnDwncDeWI7goShu0sGENZA	2022-06-14 18:33:57.579215+00
\.


--
-- Name: files_fileId_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."files_fileId_seq"', 1, false);


--
-- Name: posts_postId_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."posts_postId_seq"', 1, false);


--
-- Name: users_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."users_userId_seq"', 3, true);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY ("fileId");


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY ("postId");


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY ("tagName");


--
-- Name: users users_hashedPassword_key; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_hashedPassword_key" UNIQUE ("hashedPassword");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("userId");


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: files files_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "files_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts("postId") ON DELETE CASCADE;


--
-- Name: posts posts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users("userId");


--
-- Name: taggings taggings_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.taggings
    ADD CONSTRAINT "taggings_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts("postId") ON DELETE CASCADE;


--
-- Name: taggings taggings_tagName_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.taggings
    ADD CONSTRAINT "taggings_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES public.tags("tagName") ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

