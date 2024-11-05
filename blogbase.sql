--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2024-10-14 12:42:16

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
-- TOC entry 217 (class 1259 OID 16409)
-- Name: blogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blogs (
    blog_id integer NOT NULL,
    date_created timestamp without time zone,
    content text,
    creator_user_id integer NOT NULL,
    creator_name character varying(255),
    title character varying(255)
);


ALTER TABLE public.blogs OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16408)
-- Name: blogs_blog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blogs_blog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blogs_blog_id_seq OWNER TO postgres;

--
-- TOC entry 3339 (class 0 OID 0)
-- Dependencies: 216
-- Name: blogs_blog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blogs_blog_id_seq OWNED BY public.blogs.blog_id;


--
-- TOC entry 218 (class 1259 OID 16417)
-- Name: blogs_creator_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blogs_creator_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blogs_creator_user_id_seq OWNER TO postgres;

--
-- TOC entry 3340 (class 0 OID 0)
-- Dependencies: 218
-- Name: blogs_creator_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blogs_creator_user_id_seq OWNED BY public.blogs.creator_user_id;


--
-- TOC entry 215 (class 1259 OID 16400)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    password character varying(255),
    name character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16399)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 3341 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3180 (class 2604 OID 16412)
-- Name: blogs blog_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs ALTER COLUMN blog_id SET DEFAULT nextval('public.blogs_blog_id_seq'::regclass);


--
-- TOC entry 3181 (class 2604 OID 16418)
-- Name: blogs creator_user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs ALTER COLUMN creator_user_id SET DEFAULT nextval('public.blogs_creator_user_id_seq'::regclass);


--
-- TOC entry 3179 (class 2604 OID 16403)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3332 (class 0 OID 16409)
-- Dependencies: 217
-- Data for Name: blogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blogs (blog_id, date_created, content, creator_user_id, creator_name, title) FROM stdin;
1	2024-10-01 00:00:00	This is an example of a blog post. If I had the time I would go into depth about how transformers revenge of the fallen is a cinematic masterpiece with strong pagan references to the lion king.	1	\N	First Post
2	2024-10-03 00:00:00	The Matrix Revolutions is the worst out of all four movies.	2	\N	Boo Matrix
3	2024-10-06 00:00:00	Why are stars so far away?	3	\N	Stars are too far
4	2024-10-07 00:00:00	Just a reminder, the fourth matrix movie still sucks.	2	\N	Matrix Reminder
5	2024-10-09 00:00:00	Is anyone ready to hear my revenge of the fallen theory yet???	1	\N	Second Post
\.


--
-- TOC entry 3330 (class 0 OID 16400)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, password, name) FROM stdin;
1	password	root
2	ampersandblue	Ryan
3	redhat	William
\.


--
-- TOC entry 3342 (class 0 OID 0)
-- Dependencies: 216
-- Name: blogs_blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blogs_blog_id_seq', 1, false);


--
-- TOC entry 3343 (class 0 OID 0)
-- Dependencies: 218
-- Name: blogs_creator_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blogs_creator_user_id_seq', 1, false);


--
-- TOC entry 3344 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- TOC entry 3185 (class 2606 OID 16416)
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (blog_id);


--
-- TOC entry 3183 (class 2606 OID 16407)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3186 (class 2606 OID 16425)
-- Name: blogs foreign key user id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT "foreign key user id" FOREIGN KEY (creator_user_id) REFERENCES public.users(user_id) NOT VALID;


-- Completed on 2024-10-14 12:42:16

--
-- PostgreSQL database dump complete
--

