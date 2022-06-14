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
1	1	51c5f45c-d517-4d15-8b3e-6acdb0ec6587.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/51c5f45c-d517-4d15-8b3e-6acdb0ec6587.png	ぺこら困り＠プラウ	5	189
2	2	421d6158-e74d-4814-b200-096ac4508ef9.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/421d6158-e74d-4814-b200-096ac4508ef9.png	イオ@照れ	1	216
3	3	df1944cd-855f-4a4b-9e9a-c96c461ec92b.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/df1944cd-855f-4a4b-9e9a-c96c461ec92b.png	Symbol Art	5	34
4	4	c7aed3d4-4faa-4d45-bd5a-860579222dcb.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/c7aed3d4-4faa-4d45-bd5a-860579222dcb.png	？？？ @LanXwar	8	78
5	5	f9428dc1-44fb-4785-a11a-50bd0b49f421.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/f9428dc1-44fb-4785-a11a-50bd0b49f421.png	sexycast	9	93
6	6	e379960f-4b89-4f72-a203-dcf260f560be.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/e379960f-4b89-4f72-a203-dcf260f560be.png	@Pikaboi 2021-02-21	11	78
7	7	8bdd08d2-d8c0-4d9a-8854-56a9c5f81560.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/8bdd08d2-d8c0-4d9a-8854-56a9c5f81560.png	拡大鳥@あきしゃけ	3	66
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.posts ("postId", "userId", "createdAt", title, description) FROM stdin;
1	1	2022-06-14 18:42:20.374977+00	aaaa peko!!!	A lil shy rabbit
2	1	2022-06-14 18:42:52.205963+00	best girl Io	You're making me blush, boss!
3	2	2022-06-14 18:43:10.203077+00	MAN	
4	2	2022-06-14 18:43:23.205271+00	???	huh???
5	2	2022-06-14 18:43:47.217741+00	Hot Single CASTs	Why yes, I do play CAST.
6	3	2022-06-14 18:44:23.278728+00	Rappy my Beloved	My one and only rappy.. kyu kyu~
7	3	2022-06-14 18:44:41.775871+00	Rappy Stare...	jiiiiiiii~~~
\.


--
-- Data for Name: taggings; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.taggings ("tagName", "postId") FROM stdin;
hololive	1
peko	1
pso2	2
npc	2
io	2
???	4
casts	5
pso2	5
meme	5
pso2	6
rappy	6
meme	6
rappy	7
pso2	7
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.tags ("tagName") FROM stdin;
hololive
peko
pso2
npc
io
???
casts
meme
rappy
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.users ("userId", username, "hashedPassword", "createdAt") FROM stdin;
1	anonymous	$argon2i$v=19$m=4096,t=3,p=1$koSwLtIHUf9hk9zmJ3UlCA$NJ1Ge0pAiV17LFmcGqXvqnDwncDeWI7goShu0sGENZA	2022-06-14 18:34:31.774704+00
2	baba	$argon2i$v=19$m=4096,t=3,p=1$XH3OwuRstOZ8qcziYvR0mg$mJHl4VzRpXLk62Srk44tg9ULZ/29H/NXrxbRShR+T6c	2022-06-14 18:42:57.455559+00
3	rappy	$argon2i$v=19$m=4096,t=3,p=1$oKSZv0DITx0yYzFqZXYF2w$n2CpgbW49im3iq8Kt11mRLT+6zddnF1J8XK14w6g+aw	2022-06-14 18:43:56.258695+00
\.


--
-- Name: files_fileId_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."files_fileId_seq"', 7, true);


--
-- Name: posts_postId_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."posts_postId_seq"', 7, true);


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

