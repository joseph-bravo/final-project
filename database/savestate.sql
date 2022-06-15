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
-- Name: posts; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.posts (
    "postId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    description text,
    "fileObjectKey" text NOT NULL,
    "fileThumbnailUrl" text NOT NULL,
    "filePropsName" text NOT NULL,
    "filePropsSound" integer NOT NULL,
    "filePropsLayerCount" integer NOT NULL
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
-- Name: posts postId; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.posts ALTER COLUMN "postId" SET DEFAULT nextval('public."posts_postId_seq"'::regclass);


--
-- Name: users userId; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users ALTER COLUMN "userId" SET DEFAULT nextval('public."users_userId_seq"'::regclass);


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.posts ("postId", "userId", "createdAt", title, description, "fileObjectKey", "fileThumbnailUrl", "filePropsName", "filePropsSound", "filePropsLayerCount") FROM stdin;
1	1	2022-06-14 23:39:06.629002+00	ARKS Trash Magazine	The Finest of News!	d0dbcbba-4d05-4af8-b1b5-1254cb31ce46.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/e8a0dbb2-9b5e-45fb-aed3-b40ab6d3d1b3.png	Mikuma Arks Trash	11	195
2	1	2022-06-14 23:39:18.908157+00	ayo???		107dc3e0-204a-4e25-b331-07ef4227931a.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/bdf1f28b-9bd0-4495-9127-b35b09190e53.png	Untitled	8	26
3	2	2022-06-14 23:39:54.862271+00	You Have No Luck	Nice try...	545b4b0f-e13e-432a-b83f-379b1a39faca.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/eed24dd3-8495-4ee4-bb5f-a3caba313244.png	ドゥモニとラボバトル	2	225
4	2	2022-06-14 23:40:09.377691+00	Peko Nervous	aaaaa!!	16fcf45f-2a9d-498f-b57a-b4fa75b1b235.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/9a4af496-94e0-4a9b-8bce-8c213345e473.png	ぺこら困り＠プラウ	5	189
5	3	2022-06-14 23:40:41.480297+00	Rappy Stare	jiiiiii~~~	4d6692a9-be57-42b4-8540-1b21e9c94ff4.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/42ed6abb-5817-4bd5-a217-28e901762646.png	拡大鳥@あきしゃけ	3	66
6	3	2022-06-14 23:40:53.958472+00	Rappy Scam		1462c44a-bb9f-4b54-a48c-4cde45a4548c.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/461ec892-ca1b-43f3-998a-5de5ea74f8e3.png	Oh your rich?	0	47
7	3	2022-06-14 23:41:19.43717+00	Rappy My Beloved	My one and only~	56b022d6-00e7-4990-8480-df1c8b48d365.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/b697c1b3-b6e9-4003-ad1f-8deea946642a.png	@Pikaboi 2021-02-21	11	78
8	2	2022-06-14 23:41:44.621738+00	???	???	72c44ec3-8aa8-441e-bba2-46002ac9fd25.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/d2283cc0-bac1-4728-b10c-0553af7c291b.png	？？？ @LanXwar	8	78
9	2	2022-06-14 23:42:13.555041+00	Tired Quna	Too much work...	cd01f7b8-2b14-4984-b10c-2d9c7f97b574.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/46257140-4936-4533-8188-61046dc4e680.png	クーナ(床)@しゃけ	5	208
10	1	2022-06-14 23:42:38.364919+00	shrimp	yeaaaa!	b40c089f-a220-4534-b67c-b11e72a2c1f2.sar	https://symbol-art-vault.s3.us-west-1.amazonaws.com/15f6d619-13bd-43c9-826d-a7ebbdb9e8ce.png	Untitled	11	208
\.


--
-- Data for Name: taggings; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.taggings ("tagName", "postId") FROM stdin;
pso2	1
arkstrash	1
emoji	2
dudu	3
pso2	3
affix	3
hololive	4
vtuber	4
rappy	5
rappy	6
meme	7
rappy	7
???	8
quna	9
npc	9
pso2	9
oracle	9
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.tags ("tagName") FROM stdin;
pso2
arkstrash
emoji
dudu
affix
hololive
vtuber
rappy
meme
???
quna
npc
oracle
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.users ("userId", username, "hashedPassword", "createdAt") FROM stdin;
1	anonymous	$argon2i$v=19$m=4096,t=3,p=1$koSwLtIHUf9hk9zmJ3UlCA$NJ1Ge0pAiV17LFmcGqXvqnDwncDeWI7goShu0sGENZA	2022-06-14 23:38:25.354135+00
2	bababooey	$argon2i$v=19$m=4096,t=3,p=1$tKjMT/3RJFjOdLo8PTDwQQ$aqWA/Efa8eEp6DiUygegfscPTmmtxX4WkDKSU/4NJyo	2022-06-14 23:39:25.531539+00
3	rappy	$argon2i$v=19$m=4096,t=3,p=1$sg86EjTzLvB4cekH4Y2jAw$7PFwED9LiLVFlS03KaeSWGVAs6DxEWnqRGt3JQuPhxY	2022-06-14 23:40:21.115004+00
\.


--
-- Name: posts_postId_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."posts_postId_seq"', 10, true);


--
-- Name: users_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."users_userId_seq"', 3, true);


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
-- Name: posts posts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users("userId") ON DELETE CASCADE;


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

