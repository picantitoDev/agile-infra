--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Debian 16.9-1.pgdg120+1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: sgi_db_upao_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO sgi_db_upao_user;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auditoria_producto; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.auditoria_producto (
    id_auditoria integer NOT NULL,
    id_producto integer NOT NULL,
    id_usuario integer NOT NULL,
    accion text NOT NULL,
    campos_modificados jsonb NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.auditoria_producto OWNER TO sgi_db_upao_user;

--
-- Name: auditoria_producto_id_auditoria_seq; Type: SEQUENCE; Schema: public; Owner: sgi_db_upao_user
--

CREATE SEQUENCE public.auditoria_producto_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_producto_id_auditoria_seq OWNER TO sgi_db_upao_user;

--
-- Name: auditoria_producto_id_auditoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sgi_db_upao_user
--

ALTER SEQUENCE public.auditoria_producto_id_auditoria_seq OWNED BY public.auditoria_producto.id_auditoria;


--
-- Name: categoria; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.categoria (
    id_categoria integer NOT NULL,
    nombre character varying(55) NOT NULL,
    estado character varying(10) DEFAULT 'activa'::character varying NOT NULL
);


ALTER TABLE public.categoria OWNER TO sgi_db_upao_user;

--
-- Name: categoria_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE public.categoria ALTER COLUMN id_categoria ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categoria_id_categoria_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cliente; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.cliente (
    id_cliente integer NOT NULL,
    nombre_cliente character varying(100),
    razon_social character varying(100),
    dni_cliente character varying(15),
    ruc_cliente character varying(20),
    direccion_cliente character varying(150),
    correo_cliente character varying(100)
);


ALTER TABLE public.cliente OWNER TO sgi_db_upao_user;

--
-- Name: cliente_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: sgi_db_upao_user
--

CREATE SEQUENCE public.cliente_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cliente_id_cliente_seq OWNER TO sgi_db_upao_user;

--
-- Name: cliente_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sgi_db_upao_user
--

ALTER SEQUENCE public.cliente_id_cliente_seq OWNED BY public.cliente.id_cliente;


--
-- Name: incidencia; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.incidencia (
    id_incidencia integer NOT NULL,
    id_movimiento integer NOT NULL,
    descripcion_general text,
    detalle_productos jsonb,
    fecha_registro timestamp without time zone DEFAULT now(),
    id_orden integer,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.incidencia OWNER TO sgi_db_upao_user;

--
-- Name: incidencia_id_incidencia_seq; Type: SEQUENCE; Schema: public; Owner: sgi_db_upao_user
--

CREATE SEQUENCE public.incidencia_id_incidencia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incidencia_id_incidencia_seq OWNER TO sgi_db_upao_user;

--
-- Name: incidencia_id_incidencia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sgi_db_upao_user
--

ALTER SEQUENCE public.incidencia_id_incidencia_seq OWNED BY public.incidencia.id_incidencia;


--
-- Name: movimiento; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.movimiento (
    id_movimiento integer NOT NULL,
    id_usuario integer NOT NULL,
    tipo character varying(50) NOT NULL,
    fecha timestamp without time zone NOT NULL,
    descripcion text
);


ALTER TABLE public.movimiento OWNER TO sgi_db_upao_user;

--
-- Name: movimiento_ajuste; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.movimiento_ajuste (
    id_movimiento integer NOT NULL,
    tipo_ajuste character varying(255),
    motivo text
);


ALTER TABLE public.movimiento_ajuste OWNER TO sgi_db_upao_user;

--
-- Name: movimiento_entrada; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.movimiento_entrada (
    id_movimiento integer NOT NULL,
    id_proveedor integer,
    total numeric(10,2),
    id_orden integer
);


ALTER TABLE public.movimiento_entrada OWNER TO sgi_db_upao_user;

--
-- Name: movimiento_id_movimiento_seq; Type: SEQUENCE; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE public.movimiento ALTER COLUMN id_movimiento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.movimiento_id_movimiento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: movimiento_venta; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.movimiento_venta (
    id_movimiento integer NOT NULL,
    id_cliente integer,
    total numeric(12,2),
    tipo_comprobante character varying(50),
    serie character varying(10),
    correlativo integer
);


ALTER TABLE public.movimiento_venta OWNER TO sgi_db_upao_user;

--
-- Name: orden_reabastecimiento; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.orden_reabastecimiento (
    id_order integer NOT NULL,
    id_proveedor integer NOT NULL,
    products json,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    estado text DEFAULT 'en_curso'::text NOT NULL,
    id_usuario integer,
    CONSTRAINT orden_reabastecimiento_estado_check CHECK ((estado = ANY (ARRAY['en_curso'::text, 'finalizada'::text, 'cancelada'::text])))
);


ALTER TABLE public.orden_reabastecimiento OWNER TO sgi_db_upao_user;

--
-- Name: orden_reabastecimiento_id_order_seq; Type: SEQUENCE; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE public.orden_reabastecimiento ALTER COLUMN id_order ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.orden_reabastecimiento_id_order_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: producto; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.producto (
    id_producto integer NOT NULL,
    id_proveedor integer NOT NULL,
    id_categoria integer NOT NULL,
    nombre character varying(255) NOT NULL,
    cantidad_minima integer NOT NULL,
    stock integer NOT NULL,
    estado character varying(50),
    precio_unitario numeric(10,2) NOT NULL
);


ALTER TABLE public.producto OWNER TO sgi_db_upao_user;

--
-- Name: producto_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE public.producto ALTER COLUMN id_producto ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.producto_id_producto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: producto_movimiento; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.producto_movimiento (
    id_movimiento integer NOT NULL,
    id_producto integer NOT NULL,
    cantidad integer NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    precio_unitario numeric(10,2) NOT NULL
);


ALTER TABLE public.producto_movimiento OWNER TO sgi_db_upao_user;

--
-- Name: proveedor; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.proveedor (
    id_proveedor integer NOT NULL,
    razon_social character varying(255) NOT NULL,
    ruc character varying(20) NOT NULL,
    numero_telefono character varying(20),
    correo character varying(255),
    direccion character varying(255)
);


ALTER TABLE public.proveedor OWNER TO sgi_db_upao_user;

--
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE public.proveedor ALTER COLUMN id_proveedor ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.proveedor_id_proveedor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: serie_comprobante; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.serie_comprobante (
    tipo_comprobante character varying(20) NOT NULL,
    serie character varying(10),
    ultimo_correlativo integer
);


ALTER TABLE public.serie_comprobante OWNER TO sgi_db_upao_user;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: sgi_db_upao_user
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text,
    rol text NOT NULL,
    reset_token text,
    reset_token_expires timestamp without time zone,
    estado character varying(20) DEFAULT 'Activado'::character varying NOT NULL,
    nivel_acceso character varying(20) DEFAULT 'basico'::character varying NOT NULL
);


ALTER TABLE public.usuarios OWNER TO sgi_db_upao_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sgi_db_upao_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO sgi_db_upao_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sgi_db_upao_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.usuarios.id;


--
-- Name: auditoria_producto id_auditoria; Type: DEFAULT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.auditoria_producto ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditoria_producto_id_auditoria_seq'::regclass);


--
-- Name: cliente id_cliente; Type: DEFAULT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id_cliente SET DEFAULT nextval('public.cliente_id_cliente_seq'::regclass);


--
-- Name: incidencia id_incidencia; Type: DEFAULT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.incidencia ALTER COLUMN id_incidencia SET DEFAULT nextval('public.incidencia_id_incidencia_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: auditoria_producto; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.auditoria_producto (id_auditoria, id_producto, id_usuario, accion, campos_modificados, fecha) FROM stdin;
1	13	1	actualizar	{"stock": {"antes": 130, "despues": 120}}	2025-05-23 18:38:48.469
2	11	1	actualizar	{"stock": {"antes": 10, "despues": 100}, "id_categoria": {"antes": 8, "despues": 7}, "precio_unitario": {"antes": "25.00", "despues": 20}}	2025-05-23 18:45:13.389
3	11	1	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-05-23 18:48:03.499
4	13	1	actualizar	{"stock": {"antes": 120, "despues": 1}}	2025-05-24 19:58:00.523
5	9	1	actualizar	{"stock": {"antes": 135, "despues": 2}}	2025-05-24 19:58:30.584
6	4	1	actualizar	{"stock": {"antes": 116, "despues": 56}}	2025-05-25 09:08:25.68
7	13	5	actualizar	{"stock": {"antes": 21, "despues": 2}}	2025-05-26 12:31:42.532
8	6	1	actualizar	{"stock": {"antes": 35, "despues": 30}, "nombre": {"antes": "Detergente Ariel 900g", "despues": "Detergente Ariel 700g"}}	2025-05-26 12:50:37.863
9	9	1	actualizar	{"stock": {"antes": 92, "despues": 12}}	2025-05-27 12:24:58.48
10	13	1	actualizar	{"stock": {"antes": 102, "despues": 10}, "cantidad_minima": {"antes": 3, "despues": 20}}	2025-06-03 11:12:13.337
11	6	1	actualizar	{"stock": {"antes": 25, "despues": 5}}	2025-06-03 14:06:04.085
12	3	6	actualizar	{"stock": {"antes": 375, "despues": 380}}	2025-06-05 11:48:14.31
13	3	6	actualizar	{"stock": {"antes": 380, "despues": 400}}	2025-06-05 11:48:29.85
14	15	6	actualizar	{"cantidad_minima": {"antes": 10, "despues": 20}}	2025-06-05 11:51:19.76
15	15	6	actualizar	{"stock": {"antes": 10, "despues": 50}}	2025-06-05 11:51:31.849
16	17	6	actualizar	{"precio_unitario": {"antes": "10859284.00", "despues": 108592.84}}	2025-06-05 11:55:14.273
17	17	6	actualizar	{"precio_unitario": {"antes": "108592.84", "despues": 10}}	2025-06-05 11:55:38.58
18	17	6	actualizar	{"precio_unitario": {"antes": "10.00", "despues": 15.4}}	2025-06-05 11:55:53.703
19	18	6	actualizar	{"nombre": {"antes": "https://www.youtube.com/watch?v=AAS72fkaXnA&list=RDgRw_6NTbPSo&index=23", "despues": "Feastables 100g"}}	2025-06-05 12:00:41.367
20	16	6	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-05 12:27:33.963
21	1	6	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-05 12:27:42.781
22	1	6	actualizar	{"stock": {"antes": 1, "despues": 10}}	2025-06-05 12:31:01.266
23	1	6	actualizar	{"stock": {"antes": 10, "despues": 50}}	2025-06-05 12:31:07.487
24	1	6	actualizar	{"nombre": {"antes": "Arroz Añejo La Caserita 10kg", "despues": "Chocolate Snickers 50g"}}	2025-06-05 12:31:11.677
25	4	6	actualizar	{"cantidad_minima": {"antes": 30, "despues": -30}, "precio_unitario": {"antes": "4.00", "despues": -4}}	2025-06-05 21:31:39.059
26	4	6	actualizar	{"precio_unitario": {"antes": "-4.00", "despues": 4}}	2025-06-05 21:31:50.684
27	4	6	actualizar	{"precio_unitario": {"antes": "4.00", "despues": -4}}	2025-06-05 21:35:38.962
28	10	6	actualizar	{"nombre": {"antes": "Fideos Instantáneos Don Vitto 80g", "despues": "Detergente Ariel 700g"}}	2025-06-05 21:37:22.924
29	1	6	actualizar	{"stock": {"antes": 50, "despues": 10}}	2025-06-06 15:22:52.078
30	1	4	actualizar	{"precio_unitario": {"antes": "25.00", "despues": -5}}	2025-06-06 15:46:42.33
31	1	4	actualizar	{"precio_unitario": {"antes": "-5.00", "despues": 25}}	2025-06-06 15:46:55.801
32	1	4	actualizar	{"cantidad_minima": {"antes": 20, "despues": -5}}	2025-06-06 15:49:02.049
33	1	4	actualizar	{"cantidad_minima": {"antes": -5, "despues": 20}}	2025-06-06 15:49:07.642
34	1	4	actualizar	{"stock": {"antes": 0, "despues": 2}}	2025-06-06 16:18:11.893
35	4	4	actualizar	{"nombre": {"antes": "Chocolate Snickers 50g", "despues": "Chocolate Snickers 100g"}}	2025-06-06 16:18:26.536
36	16	4	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-06 16:24:50.073
37	5	4	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-06 16:25:02.713
38	1	4	actualizar	{"stock": {"antes": 0, "despues": 2}}	2025-06-06 16:32:47.214
39	5	4	actualizar	{"stock": {"antes": 20, "despues": 19}}	2025-06-06 18:35:59.546
40	15	4	actualizar	{"stock": {"antes": 50, "despues": 15}}	2025-06-07 01:26:49.52
41	5	4	actualizar	{"stock": {"antes": 19, "despues": 22}}	2025-06-07 01:34:45.954
42	1	4	actualizar	{"stock": {"antes": 0, "despues": 22}}	2025-06-07 01:34:53.416
43	15	4	actualizar	{"stock": {"antes": 15, "despues": 22}}	2025-06-07 01:35:02.312
44	16	1	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-17 22:31:53.356
45	8	1	actualizar	{"precio_unitario": {"antes": "3.20", "despues": -3.2}}	2025-06-18 12:57:11.852
46	2	1	actualizar	{"id_categoria": {"antes": 2, "despues": 1}}	2025-06-18 08:11:55.679
47	14	1	actualizar	{"id_categoria": {"antes": 13, "despues": 1}}	2025-06-18 08:12:13.041
48	4	5	actualizar	{"precio_unitario": {"antes": "-4.00", "despues": 3.99}}	2025-06-18 13:15:55.783
49	6	6	actualizar	{"id_categoria": {"antes": 6, "despues": 1}}	2025-06-18 13:27:42.98
50	9	6	actualizar	{"id_categoria": {"antes": 10, "despues": 1}}	2025-06-18 13:28:36.333
51	8	6	actualizar	{"id_categoria": {"antes": 9, "despues": 1}}	2025-06-18 13:28:52.746
52	13	6	actualizar	{"id_categoria": {"antes": 10, "despues": 2}}	2025-06-18 13:29:03.73
53	19	6	actualizar	{"stock": {"antes": 0, "despues": 10}}	2025-06-20 13:39:02.008
54	19	6	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-20 13:46:03.657
55	19	6	actualizar	{"stock": {"antes": 0, "despues": 10}, "estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-20 13:49:10.639
56	20	6	actualizar	{"stock": {"antes": 0, "despues": 10}, "estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-20 13:49:29.804
57	19	6	actualizar	{"id_categoria": {"antes": 23, "despues": 10}}	2025-06-20 13:52:35.532
58	19	6	actualizar	{"cantidad_minima": {"antes": 10, "despues": -10}}	2025-06-20 14:45:29.118
59	19	6	actualizar	{"cantidad_minima": {"antes": -10, "despues": 11}}	2025-06-20 14:45:40.62
60	19	6	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-20 15:05:34.821
61	16	6	actualizar	{"stock": {"antes": 16, "despues": 9}}	2025-06-20 15:56:50.833
62	5	6	actualizar	{"stock": {"antes": 30, "despues": 15}}	2025-06-20 15:56:57.729
63	19	1	actualizar	{"precio_unitario": {"antes": "10.00", "despues": 11}}	2025-06-20 19:43:17.08
64	20	3	actualizar	{"stock": {"antes": 10, "despues": 1}}	2025-06-21 18:34:36.793
65	15	3	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-25 12:41:43.628
66	16	6	actualizar	{"cantidad_minima": {"antes": 10, "despues": -10}}	2025-06-25 16:27:54.764
67	22	6	actualizar	{"id_categoria": {"antes": 23, "despues": 2}}	2025-06-25 16:37:48.837
68	16	3	actualizar	{"nombre": {"antes": "Arroz Costeño 2kg", "despues": "Cerveza De Malta Y Maiz Dragenburg Sixpack 310 Ml"}}	2025-06-25 17:33:54.188
69	16	3	actualizar	{"nombre": {"antes": "Cerveza De Malta Y Maiz Dragenburg Sixpack 310 Ml", "despues": "Arroz Costeño 2kg"}}	2025-06-25 17:34:28.3
70	16	6	actualizar	{"cantidad_minima": {"antes": -10, "despues": 5}}	2025-06-25 18:04:17.468
71	16	6	actualizar	{"cantidad_minima": {"antes": 5, "despues": 1}}	2025-06-25 18:04:42.714
72	16	6	actualizar	{"cantidad_minima": {"antes": 1, "despues": 9}}	2025-06-25 18:04:52.977
73	16	6	actualizar	{"stock": {"antes": 9, "despues": 2}}	2025-06-25 18:05:03.812
74	22	6	actualizar	{"stock": {"antes": 10, "despues": 100}, "cantidad_minima": {"antes": 10, "despues": 200}}	2025-06-25 18:11:59.76
75	16	6	actualizar	{"stock": {"antes": 2, "despues": 10}}	2025-06-25 18:13:24.964
76	5	6	actualizar	{"cantidad_minima": {"antes": 20, "despues": 30}}	2025-06-25 18:13:33.557
77	13	3	actualizar	{"precio_unitario": {"antes": "123.00", "despues": 2}}	2025-06-25 22:53:26.145
78	8	3	actualizar	{"precio_unitario": {"antes": "-3.20", "despues": 3.2}}	2025-06-25 22:53:35.524
79	18	6	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}, "precio_unitario": {"antes": "15.44", "despues": 8.5}}	2025-06-26 19:45:24.077
80	4	4	actualizar	{"stock": {"antes": 0, "despues": 1}, "cantidad_minima": {"antes": -30, "despues": 0}, "precio_unitario": {"antes": "3.99", "despues": 4}}	2025-06-26 20:12:55.678
81	4	4	actualizar	{"stock": {"antes": 1, "despues": 5}, "cantidad_minima": {"antes": 0, "despues": 1}}	2025-06-26 20:14:06.403
82	19	6	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-26 20:53:00.279
83	1	6	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-26 20:53:06.273
84	10	6	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-26 20:53:10.994
85	17	6	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-26 20:53:15.673
86	11	6	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-26 20:53:19.933
87	12	6	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-26 20:53:25.665
88	20	6	actualizar	{"stock": {"antes": 0, "despues": 10}, "estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-26 20:53:38.707
89	20	6	actualizar	{"id_categoria": {"antes": 23, "despues": 10}}	2025-06-26 21:14:57.521
90	6	4	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-26 21:28:23.517
91	23	6	actualizar	{"nombre": {"antes": "*/*/-/**//*-", "despues": "Chocolate Snickers 100g"}}	2025-06-26 21:37:35.783
92	16	6	actualizar	{"stock": {"antes": 0, "despues": 10}, "nombre": {"antes": "Arroz Costeño 2kg", "despues": "*//*/**-"}}	2025-06-26 21:41:00.336
93	16	6	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-26 21:42:25.145
94	19	6	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-26 21:46:50.935
95	5	1	actualizar	{"cantidad_minima": {"antes": 30, "despues": -30}}	2025-06-26 18:18:30.942
96	5	1	actualizar	{"cantidad_minima": {"antes": -30, "despues": 30}}	2025-06-26 18:38:09.207
97	5	1	actualizar	{"nombre": {"antes": "Atún en Aceite Van Camp’s 170g", "despues": "Atún en Aceite Van Camp’s 170g@#!@#!@3"}}	2025-06-26 18:45:03.259
98	5	1	actualizar	{"nombre": {"antes": "Atún en Aceite Van Camp’s 170g@#!@#!@3", "despues": "Atún en Aceite Van Camp’s 170g"}}	2025-06-26 18:47:48.797
99	5	2	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-27 10:59:43.761
100	5	2	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-27 11:00:14.887
101	5	2	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-27 11:01:57.482
102	19	2	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-27 11:02:14.853
103	25	4	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-27 12:47:09.07
104	20	6	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-27 13:16:07.959
105	26	6	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-27 13:17:03.192
106	26	6	actualizar	{"estado": {"antes": "Desactivado", "despues": "Activado"}}	2025-06-27 13:17:13.178
107	27	6	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-27 13:37:06.566
108	12	1	actualizar	{"estado": {"antes": "Activado", "despues": "Desactivado"}}	2025-06-27 10:18:11.537
109	26	1	actualizar	{"stock": {"antes": 4, "despues": 2}}	2025-06-27 19:15:46.441
110	28	1	actualizar	{"stock": {"antes": 0, "despues": 5}}	2025-06-27 19:34:08.467
111	4	4	actualizar	{"nombre": {"antes": "Chocolate Snickers 100g", "despues": "Leche UHT LAIVE Entera Light Bolsa 900ml"}, "id_categoria": {"antes": 4, "despues": 3}, "precio_unitario": {"antes": "4.00", "despues": 4.5}}	2025-06-30 23:09:46.597
112	23	4	actualizar	{"nombre": {"antes": "Chocolate Snickers 100g", "despues": "Bebida de Almendra SILK Vainilla Caja 946ml"}, "id_categoria": {"antes": 1, "despues": 3}, "precio_unitario": {"antes": "1.00", "despues": 16}}	2025-06-30 23:10:31.038
113	29	4	actualizar	{"nombre": {"antes": "Expo 1", "despues": "Mantequilla GLORIA Pote 390g"}, "id_categoria": {"antes": 8, "despues": 3}, "precio_unitario": {"antes": "22.00", "despues": 16.9}}	2025-06-30 23:12:29.368
114	17	4	actualizar	{"nombre": {"antes": "Pan con pollo", "despues": "Leche sin Lactosa LAIVE UHT Light Caja 946ml Paquete 4un"}, "id_categoria": {"antes": 1, "despues": 3}, "precio_unitario": {"antes": "15.40", "despues": 19.9}}	2025-06-30 23:13:24.654
115	21	4	actualizar	{"nombre": {"antes": "Producto Prueba", "despues": "Harina sin Preparar MOLITALIA Bolsa 180g"}, "precio_unitario": {"antes": "25.00", "despues": 1.2}}	2025-06-30 23:15:31.631
116	21	4	actualizar	{"id_categoria": {"antes": 10, "despues": 26}}	2025-06-30 23:15:48.818
117	13	4	actualizar	{"nombre": {"antes": "Pepsi", "despues": "Canela Molida BELL'S Sobre 15g"}, "id_categoria": {"antes": 2, "despues": 26}, "precio_unitario": {"antes": "2.00", "despues": 1.9}}	2025-06-30 23:16:41.386
118	28	4	actualizar	{"nombre": {"antes": "Cerveza Pilsen Callao LATON", "despues": "Polvo de Hornear BELL'S Bolsa 25g"}, "id_categoria": {"antes": 9, "despues": 26}, "precio_unitario": {"antes": "5.50", "despues": 1.3}}	2025-06-30 23:17:06.955
119	10	4	actualizar	{"nombre": {"antes": "Detergente Ariel 700g", "despues": "Chips Sabor a Chocolate WINTERS Bolsa 200g"}, "id_categoria": {"antes": 1, "despues": 26}, "precio_unitario": {"antes": "1.20", "despues": 9.9}}	2025-06-30 23:17:39.546
120	14	4	actualizar	{"nombre": {"antes": "Gaseosa Coca-Cola 1.5L\\t", "despues": "Maicena DURYEA Caja 500g"}, "id_categoria": {"antes": 1, "despues": 26}, "precio_unitario": {"antes": "7.50", "despues": 10}}	2025-06-30 23:18:26.104
121	24	4	actualizar	{"nombre": {"antes": "Pack (2 Arroz Costeño Graneadito x 750 Gr)", "despues": "Aceite Vegetal Premium PRIMOR Botella 900ml"}, "precio_unitario": {"antes": "1.00", "despues": 9.2}}	2025-06-30 23:19:40.654
122	18	4	actualizar	{"nombre": {"antes": "Feastables 100g", "despues": "Galletas Chocochips LA FLORENCIA 10un"}, "id_categoria": {"antes": 1, "despues": 6}, "precio_unitario": {"antes": "8.50", "despues": 17.9}}	2025-06-30 23:23:37.367
123	9	4	actualizar	{"nombre": {"antes": "Papas Fritas Lay’s 100g", "despues": "Pionono con Manjar NESTLÉ Paquete 12un"}, "id_categoria": {"antes": 1, "despues": 6}, "precio_unitario": {"antes": "2.80", "despues": 18.9}}	2025-06-30 23:24:07.347
124	11	4	actualizar	{"nombre": {"antes": "Pienso para cachorros (gatos) Cambo 1kg", "despues": "Alfajores Artesanales NESTLÉ Bandeja 14un"}, "id_categoria": {"antes": 7, "despues": 6}, "precio_unitario": {"antes": "20.00", "despues": 17.2}}	2025-06-30 23:24:37.422
125	26	4	actualizar	{"id_categoria": {"antes": 1, "despues": 10}}	2025-06-30 23:30:11.772
\.


--
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.categoria (id_categoria, nombre, estado) FROM stdin;
7	Embutidos y Fiambres	activa
8	Carnes, Aves y Pescados	activa
10	Abarrotes	activa
6	Panaderia	activa
24	Categoria Prueba	inactiva
23	a	inactiva
26	Repostería	activa
9	Cervezas, Vinos y Licores	inactiva
25	Carnes 	inactiva
1	Empresariales	activa
2	Bebidas	activa
3	Lácteos	activa
4	Confitería	activa
5	Enlatados	activa
\.


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.cliente (id_cliente, nombre_cliente, razon_social, dni_cliente, ruc_cliente, direccion_cliente, correo_cliente) FROM stdin;
2		Agile S.A		19293949452	Av. Roma - Camino Real 355	supplier@gmail.com
3	Diego		74912210		Av. América Sur 1946, Trujillo 13001	jaratiradodiego@gmail.com
4	Piero		12312312		asd	asd@gmail.com
5	Florencia		74521568		galeno I	galeno@gmail.com
6	Florencia		45211555		galeno I	galeno@gmail.com
7	Florencia		52663245		galeno I	galeno@gmail.com
8	lou		75482156		glano I	galeno@gmail.com
9	Diego		74910000		Av. América Sur 1946, Trujillo 13001	jaratiradodiego@gmail.com
10		distriduvuon		12345678910	nnjnnj	pals@rosca
11	was		12312332		asd	asd@gmail.com
12	Valentino		74459325		Av. Peru Mz L lote 39	avrg2005@hotmail.com
13	Francisco		72832432		Av. Peru Mz L lote 39	correo@correo.com
15	Raul		72556895		Florencia de mora	raulflor@mail.com
16		Gloria		12345785451	Florencia de mora	raulflor@mail.com
17		Gloria		89764859764	Florencia de mora	galeno@gmail.com
1	Piero Alcántara		71076920		Trupal Mz J Lt - 21	piero.dev@outlook.com
18	pedro		12345655		nnjnnj	gabrielleyva307@gmail.com
14	Yolanda		12345678		+{}{}{}{}}{}	gabrielleyva307@gmail.com
19	Fernando Castillo		19098124		Upao	ecastillor@upao.edu.pe
\.


--
-- Data for Name: incidencia; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.incidencia (id_incidencia, id_movimiento, descripcion_general, detalle_productos, fecha_registro, id_orden, fecha) FROM stdin;
25	40	Complicaciones en la Llegada de la Entrada	[{"nombre": "Pepsi", "cantidad": 16, "incidencia": "llego todo", "id_producto": 13}, {"nombre": "Gaseosa Coca-Cola 1.5L\\t", "cantidad": 44, "incidencia": "llego todo", "id_producto": 14}]	2025-06-05 00:09:40.157576	17	2025-06-04 19:09:40.117
26	66	Complicaciones en la Llegada de la Entrada	[{"nombre": "Pan con pollo", "cantidad": 3, "incidencia": "malogrado", "id_producto": 17}]	2025-06-18 03:43:03.887542	25	2025-06-17 22:43:03.871
27	73	Complicaciones en la Llegada de la Entrada	[{"nombre": "Producto Prueba", "cantidad": 20, "incidencia": "LLEGO TODO", "id_producto": 21}]	2025-06-21 00:27:08.19697	28	2025-06-20 19:27:08.184
28	95	Complicaciones en la Llegada de la Entrada	[{"nombre": "Cerveza De Malta Y Maiz Dragenburg Sixpack 310 Ml", "cantidad": 15, "incidencia": "Faltaron 15", "id_producto": 22}]	2025-06-26 23:17:11.829999	42	2025-06-26 18:17:11.811
29	96	Complicaciones en la Llegada de la Entrada	[{"nombre": "Cerveza De Malta Y Maiz Dragenburg Sixpack 310 Ml", "cantidad": 10, "incidencia": "Faltaron 5", "id_producto": 22}]	2025-06-26 23:24:01.156678	42	2025-06-26 18:24:01.143
9	1	Complicaciones en la Llegada de la Entrada	[{"nombre": "Papas Fritas Lay’s 100g", "cantidad": 5, "incidencia": "Faltaron 5 bolsas de papas lays", "id_producto": 9}]	2025-05-25 18:54:29.64811	1	2025-05-25 08:54:29.205
10	4	Complicaciones en la Llegada de la Entrada	[{"nombre": "Papas Fritas Lay’s 100g", "cantidad": 5, "incidencia": "Faltaron 5 bolsas de papas lays", "id_producto": 9}]	2025-05-25 18:56:23.888964	3	2025-05-25 08:56:23.038
11	5	Complicaciones en la Llegada de la Entrada	[{"nombre": "Papas Fritas Lay’s 100g", "cantidad": 3, "incidencia": "Faltaron 2", "id_producto": 9}]	2025-05-25 18:56:46.435258	3	2025-05-25 08:56:46.417
12	10	Complicaciones en la Llegada de la Entrada	[{"nombre": "Pepsi", "cantidad": 90, "incidencia": "Faltaron 10", "id_producto": 13}]	2025-05-26 17:33:12.913287	7	2025-05-26 12:33:12.896
13	11	Complicaciones en la Llegada de la Entrada	[{"nombre": "Pepsi", "cantidad": 5, "incidencia": "Faltaron 5 ", "id_producto": 13}]	2025-05-26 17:41:18.986558	7	2025-05-26 12:41:18.95
14	13	Complicaciones en la Llegada de la Entrada	[{"nombre": "Fideos Instantáneos Don Vitto 80g", "cantidad": 5, "incidencia": "Faltaron 5 unidades de fideos", "id_producto": 10}]	2025-05-26 17:46:14.087882	8	2025-05-26 12:46:14.05
15	14	Complicaciones en la Llegada de la Entrada	[{"nombre": "Fideos Instantáneos Don Vitto 80g", "cantidad": 3, "incidencia": "Quedan 2 unidades pendientes", "id_producto": 10}]	2025-05-26 17:46:40.32246	8	2025-05-26 12:46:40.309
16	19	Complicaciones en la Llegada de la Entrada	[{"nombre": "Papas Fritas Lay’s 100g", "cantidad": 10, "incidencia": "Faltaron 10 bolsas de papas", "id_producto": 9}]	2025-05-27 17:27:23.293572	9	2025-05-27 12:27:23.288
17	22	Complicaciones en la Llegada de la Entrada	[{"nombre": "Papas Fritas Lay’s 100g", "cantidad": 20, "incidencia": "Faltaron 10 bolsas de papas", "id_producto": 9}]	2025-05-28 03:56:41.153517	11	2025-05-27 17:56:36.33
18	24	Complicaciones en la Llegada de la Entrada	[{"nombre": "Papas Fritas Lay’s 100g", "cantidad": 5, "incidencia": "Faltaron 5 bolsas de papas", "id_producto": 9}]	2025-05-29 04:26:43.152156	12	2025-05-28 18:26:41.855
19	25	Complicaciones en la Llegada de la Entrada	[{"nombre": "Papas Fritas Lay’s 100g", "cantidad": 3, "incidencia": "Quedan 2 bolsas restantes", "id_producto": 9}]	2025-05-29 04:27:11.28983	12	2025-05-28 18:27:09.962
20	26	Complicaciones en la Llegada de la Entrada	[{"nombre": "Papas Fritas Lay’s 100g", "cantidad": 2, "incidencia": "Waaa quedan 2", "id_producto": 9}]	2025-05-29 04:28:23.356143	12	2025-05-28 18:28:21.98
21	28	Complicaciones en la Llegada de la Entrada	[{"nombre": "Papas Fritas Lay’s 100g", "cantidad": 10, "incidencia": "Faltaron 10 papas lays", "id_producto": 9}]	2025-05-30 04:40:33.736077	14	2025-05-29 18:40:31.264
22	30	Complicaciones en la Llegada de la Entrada	[{"nombre": "Leche Evaporada Laive 400ml", "cantidad": 50, "incidencia": "Faltaron 50 tarros de leche", "id_producto": 3}]	2025-05-31 01:30:28.933903	15	2025-05-30 20:30:28.92
23	31	Complicaciones en la Llegada de la Entrada	[{"nombre": "Leche Evaporada Laive 400ml", "cantidad": 30, "incidencia": "Faltaron 20 tarros de leche", "id_producto": 3}]	2025-05-31 01:30:49.593932	15	2025-05-30 20:30:49.504
24	33	Complicaciones en la Llegada de la Entrada	[{"nombre": "Gaseosa Coca-Cola 2L", "cantidad": 20, "incidencia": "Faltaron 20", "id_producto": 2}]	2025-05-31 01:32:17.202352	16	2025-05-30 20:32:17.19
30	106	Complicaciones en la Llegada de la Entrada	[{"nombre": "Cerveza De Malta Y Maiz Dragenburg Sixpack 310 Ml", "cantidad": 1, "incidencia": "dfdfdf", "id_producto": 22}]	2025-06-27 00:43:39.044672	43	2025-06-26 19:43:39.033
31	122	Complicaciones en la Llegada de la Entrada	[{"nombre": "Pack (2 Arroz Costeño Graneadito x 750 Gr)", "cantidad": 5, "incidencia": "Faltaron 5", "id_producto": 24}]	2025-06-27 12:43:47.203014	47	2025-06-27 02:43:47.669
\.


--
-- Data for Name: movimiento; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.movimiento (id_movimiento, id_usuario, tipo, fecha, descripcion) FROM stdin;
1	1	Compra	2025-05-25 08:54:29.205	
2	1	Compra	2025-05-25 08:54:52.518	
3	1	Compra	2025-05-25 08:55:26.901	
4	1	Compra	2025-05-25 08:56:23.038	
5	1	Compra	2025-05-25 08:56:46.417	
6	1	Compra	2025-05-25 08:57:02.664	
7	1	Compra	2025-05-25 09:06:20.279	
8	1	Compra	2025-05-25 14:03:56.378	
9	1	Compra	2025-05-25 14:06:00.14	
10	5	Compra	2025-05-26 12:33:12.896	
11	5	Compra	2025-05-26 12:41:18.95	
12	5	Compra	2025-05-26 12:41:44.591	
13	1	Compra	2025-05-26 12:46:14.05	
14	1	Compra	2025-05-26 12:46:40.309	
15	1	Compra	2025-05-26 12:47:53.226	
16	1	Venta	2025-05-27 12:22:53.533	
17	1	Sobrante	2025-05-27 12:24:06.93	Mal conteo
18	1	Merma	2025-05-27 12:24:28.465	Se rompieron
19	1	Compra	2025-05-27 12:27:23.288	
20	1	Compra	2025-05-27 12:28:12.915	
21	1	Compra	2025-05-27 17:54:30.747	
22	1	Compra	2025-05-27 17:56:36.33	
23	1	Compra	2025-05-27 17:57:00.823	
24	1	Compra	2025-05-28 18:26:41.855	
25	1	Compra	2025-05-28 18:27:09.962	
26	1	Compra	2025-05-28 18:28:21.98	
27	1	Compra	2025-05-28 18:28:56.693	
28	1	Compra	2025-05-29 18:40:31.264	
29	1	Compra	2025-05-29 18:41:01.726	
30	1	Compra	2025-05-30 20:30:28.92	
31	1	Compra	2025-05-30 20:30:49.504	
32	1	Compra	2025-05-30 20:31:31.828	
33	1	Compra	2025-05-30 20:32:17.19	
34	1	Compra	2025-05-30 20:32:33.579	
35	1	Compra	2025-06-03 14:07:52.581	
36	1	Venta	2025-06-03 14:10:02.05	ventita
37	1	Compra	2025-06-04 05:46:13.541	
38	1	Compra	2025-06-04 05:53:52.598	
39	1	Compra	2025-06-04 05:56:32.384	
40	3	Compra	2025-06-04 19:09:40.117	
41	6	Venta	2025-06-05 11:41:01.718	
42	6	Compra	2025-06-05 11:44:23.723	
43	4	Venta	2025-06-06 16:16:10.116	
44	4	Venta	2025-06-06 16:17:15.498	
45	4	Venta	2025-06-06 16:32:16.52	
46	4	Venta	2025-06-06 16:33:17.873	
47	4	Venta	2025-06-06 18:35:38.02	
48	6	Venta	2025-06-07 10:54:38.04	Prueba
49	5	Venta	2025-06-07 12:40:40.206	
50	5	Venta	2025-06-07 13:27:47.488	
51	5	Merma	2025-06-07 13:48:43.749	gaaaaaaaaaa, me los comì
52	5	Merma	2025-06-07 13:52:03.412	d
53	5	Sobrante	2025-06-07 14:47:57.423	f
54	5	Sobrante	2025-06-07 15:04:49.143	f
55	5	Compra	2025-06-07 15:40:46.986	
56	6	Venta	2025-06-08 13:51:54.5	
58	1	Venta	2025-03-20 00:00:00	Venta generada automáticamente
59	1	Venta	2025-04-09 00:00:00	Venta generada automáticamente
60	1	Venta	2025-05-06 00:00:00	Venta generada automáticamente
61	1	Venta	2025-06-06 00:00:00	Venta generada automáticamente
62	1	Venta	2025-02-16 00:00:00	Venta generada automáticamente
63	1	Venta	2025-06-11 10:40:35.39	SAS
64	1	Venta	2025-06-11 12:41:02.34	
65	1	Venta	2025-06-13 20:20:35.109	
66	1	Compra	2025-06-17 22:43:03.871	
67	6	Venta	2025-06-20 13:20:53.508	probando
68	6	Venta	2025-06-20 13:46:59.798	
69	6	Venta	2025-06-20 13:47:45.219	
70	6	Sobrante	2025-06-20 15:23:02.868	JIJIJIJI
71	1	Compra	2025-06-20 10:42:36.065	
72	1	Compra	2025-06-20 10:45:01.947	
73	1	Compra	2025-06-20 19:27:08.184	
74	3	Venta	2025-06-21 18:35:40.174	
75	1	Compra	2025-06-24 22:02:44.328	
76	1	Compra	2025-06-24 23:54:47.209	
77	1	Compra	2025-06-25 00:47:23.636	
78	1	Compra	2025-06-25 01:21:47.864	
79	1	Compra	2025-06-25 01:22:02.46	
80	3	Compra	2025-06-25 12:42:07.542	
81	6	Compra	2025-06-25 16:33:22.453	
82	6	Compra	2025-06-25 18:06:34.579	
83	3	Venta	2025-06-25 18:55:12.558	
84	6	Compra	2025-06-25 19:30:11.813	
85	6	Compra	2025-06-25 19:30:49.686	
86	6	Compra	2025-06-25 19:31:28.744	
87	6	Compra	2025-06-25 19:35:39.772	
88	3	Venta	2025-06-25 22:49:33.626	Es una comelona
89	3	Venta	2025-06-25 22:50:13.046	Quiere calculos
90	5	Venta	2025-06-26 09:12:13.896	d
91	5	Venta	2025-06-26 16:55:30.735	
92	5	Venta	2025-06-26 17:01:52.567	
93	5	Venta	2025-06-26 17:09:35.862	
94	5	Venta	2025-06-26 17:11:28.261	
95	1	Compra	2025-06-26 18:17:11.811	
96	1	Compra	2025-06-26 18:24:01.143	
97	5	Merma	2025-06-26 18:59:09.609	me los comí
98	6	Sobrante	2025-06-26 18:59:21.931	prueba
99	5	Sobrante	2025-06-26 18:59:53.082	gaaaaaa
100	2	Sobrante	2025-06-26 19:00:04.205	Se perdieron
101	6	Merma	2025-06-26 19:00:26.766	jijijaja
102	2	Merma	2025-06-26 19:00:31.484	no se
103	3	Sobrante	2025-06-26 19:20:14.935	Test
104	5	Compra	2025-06-26 19:35:34.281	
105	5	Compra	2025-06-26 19:39:33.477	
106	5	Compra	2025-06-26 19:43:39.033	
107	5	Merma	2025-06-26 19:58:16.643	d
108	4	Venta	2025-06-26 20:08:10.218	
109	4	Venta	2025-06-26 20:15:00.51	
110	4	Compra	2025-06-26 20:18:01.201	
111	4	Compra	2025-06-26 20:23:37.611	
112	4	Compra	2025-06-26 20:23:52.289	
113	4	Sobrante	2025-06-26 20:46:14.478	í, ó, ú-*
114	4	Sobrante	2025-06-26 20:49:11.196	registrar sobrante dos veces seguidas
115	4	Sobrante	2025-06-26 20:54:30.255	h
116	4	Merma	2025-06-26 21:30:20.138	h
117	6	Venta	2025-06-26 22:30:24.166	
118	6	Venta	2025-06-26 22:31:06.02	
119	1	Venta	2025-06-27 02:06:02.366	Diavlo
120	1	Venta	2025-06-27 02:15:20.839	
121	1	Venta	2025-06-27 02:23:30.67	
122	1	Compra	2025-06-27 02:43:47.669	
123	1	Compra	2025-06-27 02:44:19.944	
124	1	Compra	2025-06-27 02:48:59.067	
125	1	Compra	2025-06-27 02:55:41.305	
126	1	Sobrante	2025-06-27 02:59:01.723	Se me cayeron al suelo
127	1	Sobrante	2025-06-27 03:02:39.96	El proveedor tal nos regalo 2 aceites
128	1	Venta	2025-06-27 08:12:52.227	
129	1	Merma	2025-06-27 11:08:20.48	se venció
130	1	Merma	2025-06-27 11:08:32.404	se venció
131	4	Sobrante	2025-06-27 12:43:12.217	@.
132	4	Sobrante	2025-06-27 12:47:35.463	NO
133	4	Sobrante	2025-06-27 12:50:45.018	no
134	4	Venta	2025-06-27 12:59:57.361	
135	5	Venta	2025-06-27 13:03:10.908	
136	1	Sobrante	2025-06-27 08:05:17.888	Wa
137	4	Merma	2025-06-27 13:06:41.825	h
138	1	Sobrante	2025-06-27 08:09:44.329	Wa
139	1	Sobrante	2025-06-27 08:18:18.914	asd
140	5	Venta	2025-06-27 16:15:29.081	
141	6	Compra	2025-06-27 16:27:07.289	
142	1	Venta	2025-06-27 19:34:38.147	
\.


--
-- Data for Name: movimiento_ajuste; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.movimiento_ajuste (id_movimiento, tipo_ajuste, motivo) FROM stdin;
17	Sobrante	Ajuste de Inventario
18	Merma	Ingreso de Producto
51	Merma	Ajuste de Inventario
52	Merma	Ajuste de Inventario
53	Sobrante	Ajuste de Inventario
54	Sobrante	Ingreso de Producto
70	Sobrante	Ajuste de Inventario
97	Merma	Ajuste de Inventario
98	Sobrante	Ajuste de Inventario
99	Sobrante	Ingreso de Producto
100	Sobrante	Ajuste de Inventario
101	Merma	Ajuste de Inventario
102	Merma	Ingreso de Producto
103	Sobrante	Ajuste de Inventario
107	Merma	Ajuste de Inventario
113	Sobrante	Ajuste de Inventario
114	Sobrante	Ajuste de Inventario
115	Sobrante	Ingreso de Producto
116	Merma	Ajuste de Inventario
126	Sobrante	Devolución
127	Sobrante	recepcion_no_registrada
129	Merma	productos_vencidos
130	Merma	productos_vencidos
131	Sobrante	error_conteo_fisico
132	Sobrante	recepcion_no_registrada
133	Sobrante	recepcion_no_registrada
136	Sobrante	error_registro_anterior
137	Merma	dano_en_almacen
138	Sobrante	recepcion_no_registrada
139	Sobrante	error_conteo_fisico
\.


--
-- Data for Name: movimiento_entrada; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.movimiento_entrada (id_movimiento, id_proveedor, total, id_orden) FROM stdin;
1	\N	14.00	1
2	\N	2460.00	2
3	\N	14.00	1
4	\N	14.00	3
5	\N	8.40	3
6	\N	8.40	3
7	\N	30.80	4
8	\N	28.00	5
9	\N	316.00	6
10	\N	11070.00	7
11	\N	615.00	7
12	\N	615.00	7
13	\N	6.00	8
14	\N	3.60	8
15	\N	2.40	8
19	\N	40.00	9
20	\N	28.00	9
21	\N	174.00	10
22	\N	188.00	11
23	\N	28.00	11
24	\N	14.00	12
25	\N	8.40	12
26	\N	5.60	12
27	\N	5.60	12
28	\N	118.00	14
29	\N	28.00	14
30	\N	140.00	15
31	\N	84.00	15
32	\N	56.00	15
33	\N	204.00	16
34	\N	120.00	16
35	\N	425.00	18
37	\N	6390.00	17
38	11	1566.00	17
39	11	1566.00	17
40	11	2298.00	17
42	10	160.00	19
55	1	10.00	23
66	1	51.80	25
71	11	500.00	26
72	11	500.00	27
73	11	500.00	28
75	4	-96.00	33
76	4	-64.00	34
77	4	-96.00	35
78	4	-38.40	36
79	4	-25.60	36
80	1	175.00	22
81	2	38.40	24
82	1	6.00	23
84	1	3380.00	38
85	2	3.20	39
86	2	3.20	40
87	2	83.20	41
95	1	253.50	42
96	1	169.00	42
104	1	84.50	42
105	1	16.90	43
106	1	16.90	43
110	10	4.00	32
111	10	52.00	32
112	10	4.00	32
122	1	5.00	47
123	1	4.00	47
124	1	3.00	45
125	1	20.00	49
141	1	6.00	23
\.


--
-- Data for Name: movimiento_venta; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.movimiento_venta (id_movimiento, id_cliente, total, tipo_comprobante, serie, correlativo) FROM stdin;
16	1	117.50	boleta	B001	1
36	1	1400.00	boleta	B001	2
41	3	160.00	boleta	B001	3
43	5	250.00	boleta	B001	4
44	6	-40.00	boleta	B001	5
45	6	50.00	boleta	B001	6
46	7	50.00	boleta	B001	7
47	8	32.00	boleta	B001	8
48	9	63.20	boleta	B001	9
49	10	20.00	factura	F001	1
50	10	70.28	factura	F001	2
56	3	10.00	boleta	B001	10
1	1	236.76	Boleta	B001	1001
2	1	162.01	Boleta	B001	1002
3	1	465.75	Boleta	B001	1003
4	1	438.42	Boleta	B001	1004
5	1	202.62	Boleta	B001	1005
63	4	46.70	boleta	B001	11
64	4	492.00	boleta	B001	12
65	11	575.00	boleta	B001	13
67	3	100.00	boleta	B001	14
68	9	15.00	boleta	B001	15
69	3	100.00	boleta	B001	16
74	12	1.00	boleta	B001	17
83	12	10.00	boleta	B001	18
88	12	79.80	boleta	B001	19
89	13	4920.00	boleta	B001	20
90	14	30.00	boleta	B001	21
91	6	60.00	boleta	B001	22
92	15	6.40	boleta	B001	23
93	16	6.00	factura	F001	3
94	17	16.90	factura	F001	4
108	6	23.94	boleta	B001	24
109	6	20.00	boleta	B001	25
117	6	3.20	boleta	B001	26
118	6	1.00	boleta	B001	27
119	1	127.00	boleta	B001	28
120	1	67.60	boleta	B001	29
121	1	12.80	boleta	B001	30
128	1	33.80	boleta	B001	31
134	6	125.00	boleta	B001	32
135	18	33.80	boleta	B001	33
140	14	5.00	boleta	B001	34
142	19	5.50	boleta	B001	35
\.


--
-- Data for Name: orden_reabastecimiento; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.orden_reabastecimiento (id_order, id_proveedor, products, fecha, estado, id_usuario) FROM stdin;
42	1	[{"id_producto":22,"nombre":"Cerveza De Malta Y Maiz Dragenburg Sixpack 310 Ml","stock":299,"precio_unitario":"16.90","cantidad_minima":200,"estado":"Activado","categoria":"Bebidas","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":30,"ingresado":30}]	2025-06-26 22:41:48.99+00	finalizada	1
45	1	[{"id_producto":23,"nombre":"Chocolate Snickers 100g","stock":10,"precio_unitario":"1.00","cantidad_minima":10,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":3,"ingresado":3}]	2025-06-27 03:04:47.845+00	finalizada	6
49	1	[{"id_producto":11,"nombre":"Pienso para cachorros (gatos) Cambo 1kg","stock":100,"precio_unitario":"20.00","cantidad_minima":50,"estado":"Activado","categoria":"Embutidos y Fiambres","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":1,"ingresado":1}]	2025-06-27 05:03:03.752+00	cancelada	1
52	1	[{"id_producto":26,"nombre":"Arroz Costeño 10kg","stock":4,"precio_unitario":"5.00","cantidad_minima":10,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":30,"ingresado":0}]	2025-06-27 23:38:17.396+00	cancelada	1
2	11	[{"id_producto":13,"nombre":"Pepsi","stock":1,"precio_unitario":"123.00","cantidad_minima":3,"estado":"Activado","categoria":"Snacks","proveedor":"Piero SA","id_proveedor":11,"cantidad":20}]	2025-05-25 23:53:59.599+00	finalizada	1
1	1	[{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":10,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":20}]	2025-05-25 23:53:44.63+00	finalizada	1
50	1	[{"id_producto":23,"nombre":"Chocolate Snickers 100g","stock":12,"precio_unitario":"1.00","cantidad_minima":10,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":30,"ingresado":0}]	2025-06-27 16:59:25.375+00	cancelada	1
46	1	[{"id_producto":15,"nombre":"Mantequilla 100g","stock":57,"precio_unitario":"5.00","cantidad_minima":20,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":1,"ingresado":0}]	2025-06-27 03:06:49.001+00	cancelada	6
43	1	[{"id_producto":22,"nombre":"Cerveza De Malta Y Maiz Dragenburg Sixpack 310 Ml","stock":341,"precio_unitario":"16.90","cantidad_minima":200,"estado":"Activado","categoria":"Bebidas","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":180,"ingresado":2}]	2025-06-27 00:38:16.485+00	cancelada	5
53	1	[{"id_producto":19,"nombre":"Arroz Costeño 1kg","stock":10,"precio_unitario":"11.00","cantidad_minima":11,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":50,"ingresado":0}]	2025-07-01 14:25:39.953+00	en_curso	1
18	9	[{"id_producto":6,"nombre":"Detergente Ariel 700g","stock":5,"precio_unitario":"8.50","cantidad_minima":15,"estado":"Activado","categoria":" Limpieza y cuidado personal","proveedor":"Productos Naturales El Campesino S.A.C","id_proveedor":9,"cantidad":50,"ingresado":50}]	2025-06-04 00:07:28.413+00	finalizada	1
20	1	[]	2025-06-07 11:23:06.465+00	cancelada	1
38	1	[{"id_producto":22,"nombre":"Cerveza De Malta Y Maiz Dragenburg Sixpack 310 Ml","stock":100,"precio_unitario":"16.90","cantidad_minima":200,"estado":"Activado","categoria":"Bebidas","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":200,"ingresado":200}]	2025-06-25 23:57:50.555+00	finalizada	1
32	10	[{"id_producto":4,"nombre":"Chocolate Snickers 100g","stock":36,"precio_unitario":"3.99","cantidad_minima":-30,"estado":"Activado","categoria":"Confitería","proveedor":"Molienda Santa Rosa S.A.C.","id_proveedor":10,"cantidad":15,"ingresado":15}]	2025-06-24 21:46:36.129+00	finalizada	1
40	2	[{"id_producto":5,"nombre":"Atún en Aceite Van Camp’s 170g","stock":28,"precio_unitario":"3.20","cantidad_minima":30,"estado":"Activado","categoria":"Enlatados","proveedor":"Pescados y Mariscos Pacífico S.A.C.","id_proveedor":2,"cantidad":1,"ingresado":1}]	2025-06-26 00:31:11.899+00	finalizada	1
3	1	[{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":20,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":10}]	2025-05-25 23:55:58.522+00	finalizada	1
4	1	[{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":31,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":10}]	2025-05-26 00:05:01.626+00	finalizada	1
5	1	[{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":42,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":10}]	2025-05-26 04:55:15.717+00	finalizada	1
6	1	[{"id_producto":10,"nombre":"Fideos Instantáneos Don Vitto 80g","stock":609,"precio_unitario":"1.20","cantidad_minima":20,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":20},{"id_producto":2,"nombre":"Gaseosa Coca-Cola 2L","stock":824,"precio_unitario":"6.00","cantidad_minima":50,"estado":"Activado","categoria":"Bebidas","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":30},{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":52,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":40}]	2025-05-26 05:04:20.182+00	finalizada	1
7	11	[{"id_producto":13,"nombre":"Pepsi","stock":2,"precio_unitario":"123.00","cantidad_minima":3,"estado":"Activado","categoria":"Snacks","proveedor":"Piero SA","id_proveedor":11,"cantidad":100}]	2025-05-26 22:32:04.133+00	finalizada	1
8	1	[{"id_producto":10,"nombre":"Fideos Instantáneos Don Vitto 80g","stock":629,"precio_unitario":"1.20","cantidad_minima":20,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":10}]	2025-05-26 22:45:49.009+00	finalizada	1
9	1	[{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":12,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":20,"ingresado":0},{"id_producto":10,"nombre":"Fideos Instantáneos Don Vitto 80g","stock":639,"precio_unitario":"1.20","cantidad_minima":20,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":10,"ingresado":0}]	2025-05-27 22:26:06.817+00	finalizada	1
14	1	[{"id_producto":2,"nombre":"Gaseosa Coca-Cola 2L","stock":894,"precio_unitario":"6.00","cantidad_minima":50,"estado":"Activado","categoria":"Bebidas","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":15,"ingresado":15},{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":89,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":20,"ingresado":20}]	2025-05-30 09:40:09.375+00	finalizada	1
10	1	[{"id_producto":10,"nombre":"Fideos Instantáneos Don Vitto 80g","stock":649,"precio_unitario":"1.20","cantidad_minima":20,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":10,"ingresado":10},{"id_producto":2,"nombre":"Gaseosa Coca-Cola 2L","stock":854,"precio_unitario":"6.00","cantidad_minima":50,"estado":"Activado","categoria":"Bebidas","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":20,"ingresado":20},{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":32,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":30,"ingresado":15}]	2025-05-28 08:53:23.612+00	finalizada	1
15	3	[{"id_producto":3,"nombre":"Leche Evaporada Laive 400ml","stock":275,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Lácteos","proveedor":"Lácteos Sierra Blanca S.R.L.","id_proveedor":3,"cantidad":100,"ingresado":100}]	2025-05-31 06:29:59.817+00	finalizada	1
11	1	[{"id_producto":10,"nombre":"Fideos Instantáneos Don Vitto 80g","stock":659,"precio_unitario":"1.20","cantidad_minima":20,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":10,"ingresado":10},{"id_producto":2,"nombre":"Gaseosa Coca-Cola 2L","stock":874,"precio_unitario":"6.00","cantidad_minima":50,"estado":"Activado","categoria":"Bebidas","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":20,"ingresado":20},{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":47,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":30,"ingresado":30}]	2025-05-28 08:56:11.01+00	finalizada	1
41	2	[{"id_producto":5,"nombre":"Atún en Aceite Van Camp’s 170g","stock":29,"precio_unitario":"3.20","cantidad_minima":30,"estado":"Activado","categoria":"Enlatados","proveedor":"Pescados y Mariscos Pacífico S.A.C.","id_proveedor":2,"cantidad":26,"ingresado":26}]	2025-06-26 00:35:15.267+00	finalizada	1
51	1	[{"id_producto":26,"nombre":"Arroz Costeño 10kg","stock":5,"precio_unitario":"5.00","cantidad_minima":10,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":10,"ingresado":0}]	2025-06-27 18:16:53.548+00	cancelada	6
47	1	[{"id_producto":24,"nombre":"Pack (2 Arroz Costeño Graneadito x 750 Gr)","stock":1,"precio_unitario":"1.00","cantidad_minima":10,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":10,"ingresado":9}]	2025-06-27 03:19:22.564+00	cancelada	6
12	1	[{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":77,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":12,"ingresado":12}]	2025-05-29 09:19:21.173+00	finalizada	1
16	1	[{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":109,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":30,"ingresado":30},{"id_producto":2,"nombre":"Gaseosa Coca-Cola 2L","stock":909,"precio_unitario":"6.00","cantidad_minima":50,"estado":"Activado","categoria":"Bebidas","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":40,"ingresado":40}]	2025-05-31 06:32:01.469+00	finalizada	1
26	11	[{"id_producto":21,"nombre":"Producto Prueba","stock":24,"precio_unitario":"25.00","cantidad_minima":12,"estado":"Activado","categoria":"Abarrotes","proveedor":"Piero SA","id_proveedor":11,"cantidad":20,"ingresado":20}]	2025-06-21 01:40:10.834+00	finalizada	1
19	10	[{"id_producto":4,"nombre":"Chocolate Snickers 50g","stock":16,"precio_unitario":"4.00","cantidad_minima":30,"estado":"Activado","categoria":"Confitería","proveedor":"Molienda Santa Rosa S.A.C.","id_proveedor":10,"cantidad":40,"ingresado":40}]	2025-06-05 21:42:17.349+00	finalizada	1
33	4	[{"id_producto":8,"nombre":"Harina de Trigo Blanca Flor 1kg","stock":60,"precio_unitario":"-3.20","cantidad_minima":20,"estado":"Activado","categoria":"Snacks","proveedor":"Frutos del Valle S.A.C.","id_proveedor":4,"cantidad":30,"ingresado":30}]	2025-06-24 21:54:47+00	finalizada	1
27	11	[{"id_producto":21,"nombre":"Producto Prueba","stock":44,"precio_unitario":"25.00","cantidad_minima":12,"estado":"Activado","categoria":"Abarrotes","proveedor":"Piero SA","id_proveedor":11,"cantidad":20,"ingresado":20}]	2025-06-21 01:43:56.424+00	finalizada	1
36	4	[{"id_producto":8,"nombre":"Harina de Trigo Blanca Flor 1kg","stock":140,"precio_unitario":"-3.20","cantidad_minima":20,"estado":"Activado","categoria":"Snacks","proveedor":"Frutos del Valle S.A.C.","id_proveedor":4,"cantidad":20,"ingresado":20}]	2025-06-25 05:47:35.316+00	finalizada	1
34	4	[{"id_producto":8,"nombre":"Harina de Trigo Blanca Flor 1kg","stock":90,"precio_unitario":"-3.20","cantidad_minima":20,"estado":"Activado","categoria":"Snacks","proveedor":"Frutos del Valle S.A.C.","id_proveedor":4,"cantidad":20,"ingresado":20}]	2025-06-25 03:06:37.27+00	finalizada	1
35	4	[{"id_producto":8,"nombre":"Harina de Trigo Blanca Flor 1kg","stock":110,"precio_unitario":"-3.20","cantidad_minima":20,"estado":"Activado","categoria":"Snacks","proveedor":"Frutos del Valle S.A.C.","id_proveedor":4,"cantidad":30,"ingresado":30}]	2025-06-25 04:55:03.982+00	finalizada	1
22	1	[{"id_producto":15,"nombre":"Mantequilla 100g","stock":15,"precio_unitario":"5.00","cantidad_minima":20,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":35,"ingresado":35}]	2025-06-07 11:27:37.651+00	finalizada	1
24	2	[{"id_producto":5,"nombre":"Atún en Aceite Van Camp’s 170g","stock":19,"precio_unitario":"3.20","cantidad_minima":20,"estado":"Activado","categoria":"Enlatados","proveedor":"Pescados y Mariscos Pacífico S.A.C.","id_proveedor":2,"cantidad":12,"ingresado":12}]	2025-06-15 09:45:33.593+00	finalizada	1
13	1	[{"id_producto":10,"nombre":"Fideos Instantáneos Don Vitto 80g","stock":669,"precio_unitario":"1.20","cantidad_minima":20,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":10,"ingresado":0}]	2025-05-30 09:32:16.313+00	cancelada	1
17	11	[{"id_producto":13,"nombre":"Pepsi","stock":10,"precio_unitario":"123.00","cantidad_minima":20,"estado":"Activado","categoria":"Snacks","proveedor":"Piero SA","id_proveedor":11,"cantidad":90,"ingresado":90},{"id_producto":14,"nombre":"Gaseosa Coca-Cola 1.5L\\t","stock":12,"precio_unitario":"7.50","cantidad_minima":7,"estado":"Activado","categoria":"Bebidas","proveedor":"Piero SA","id_proveedor":11,"cantidad":100,"ingresado":100}]	2025-06-03 21:49:08.307+00	cancelada	1
37	4	[{"id_producto":8,"nombre":"Harina de Trigo Blanca Flor 1kg","stock":160,"precio_unitario":"-3.20","cantidad_minima":20,"estado":"Activado","categoria":"Snacks","proveedor":"Frutos del Valle S.A.C.","id_proveedor":4,"cantidad":22,"ingresado":0}]	2025-06-25 06:22:26.58+00	cancelada	1
31	9	[{"id_producto":6,"nombre":"Detergente Ariel 700g","stock":34,"precio_unitario":"8.50","cantidad_minima":15,"estado":"Activado","categoria":"Snacks","proveedor":"Productos Naturales El Campesino S.A.C","id_proveedor":9,"cantidad":25,"ingresado":0}]	2025-06-24 21:44:11.281+00	cancelada	1
30	6	[{"id_producto":7,"nombre":"Jamón de Pavo El Corte 200g","stock":288,"precio_unitario":"7.80","cantidad_minima":20,"estado":"Activado","categoria":"Embutidos y Fiambres","proveedor":"Embutidos La Granja S.A.C.","id_proveedor":6,"cantidad":15,"ingresado":0}]	2025-06-24 12:12:42.743+00	cancelada	1
29	3	[{"id_producto":3,"nombre":"Leche Evaporada Laive 400ml","stock":400,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Lácteos","proveedor":"Lácteos Sierra Blanca S.R.L.","id_proveedor":3,"cantidad":20,"ingresado":0}]	2025-06-24 12:07:07.188+00	cancelada	1
28	11	[{"id_producto":21,"nombre":"Producto Prueba","stock":64,"precio_unitario":"25.00","cantidad_minima":12,"estado":"Activado","categoria":"Abarrotes","proveedor":"Piero SA","id_proveedor":11,"cantidad":20,"ingresado":20}]	2025-06-21 01:46:36.897+00	cancelada	1
25	1	[{"id_producto":17,"nombre":"Pan con pollo","stock":10,"precio_unitario":"15.40","cantidad_minima":10,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":20,"ingresado":3},{"id_producto":9,"nombre":"Papas Fritas Lay’s 100g","stock":143,"precio_unitario":"2.80","cantidad_minima":30,"estado":"Activado","categoria":"Snacks","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":100,"ingresado":2}]	2025-06-18 08:41:27.424+00	cancelada	1
21	1	[{"id_producto":1,"nombre":"Chocolate Snickers 50g","stock":0,"precio_unitario":"25.00","cantidad_minima":20,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":2,"ingresado":0}]	2025-06-07 11:25:53.045+00	cancelada	1
39	2	[{"id_producto":5,"nombre":"Atún en Aceite Van Camp’s 170g","stock":27,"precio_unitario":"3.20","cantidad_minima":30,"estado":"Activado","categoria":"Enlatados","proveedor":"Pescados y Mariscos Pacífico S.A.C.","id_proveedor":2,"cantidad":1,"ingresado":1}]	2025-06-26 00:28:34.042+00	finalizada	1
48	1	[{"id_producto":20,"nombre":"Prueba stock categoria","stock":10,"precio_unitario":"1.00","cantidad_minima":10,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":1,"ingresado":0}]	2025-06-27 04:58:42.628+00	cancelada	1
44	1	[{"id_producto":19,"nombre":"Arroz Costeño 1kg","stock":10,"precio_unitario":"11.00","cantidad_minima":11,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Doradora E.I.R.L.","id_proveedor":1,"cantidad":50,"ingresado":0}]	2025-06-27 02:46:41.347+00	cancelada	6
23	1	[{"id_producto":16,"nombre":"Arroz Costeño 2kg","stock":37,"precio_unitario":"10.00","cantidad_minima":10,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":1,"ingresado":1},{"id_producto":18,"nombre":"Feastables 100g","stock":48,"precio_unitario":"15.44","cantidad_minima":10,"estado":"Activado","categoria":"Abarrotes","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":1,"ingresado":0},{"id_producto":2,"nombre":"Gaseosa Coca-Cola 2L","stock":949,"precio_unitario":"6.00","cantidad_minima":50,"estado":"Activado","categoria":"Bebidas","proveedor":"Agroexportadora Valle Dorado E.I.R.L.","id_proveedor":1,"cantidad":2,"ingresado":2}]	2025-06-08 01:23:35.49+00	cancelada	1
\.


--
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.producto (id_producto, id_proveedor, id_categoria, nombre, cantidad_minima, stock, estado, precio_unitario) FROM stdin;
17	1	3	Leche sin Lactosa LAIVE UHT Light Caja 946ml Paquete 4un	10	13	Activado	19.90
21	11	26	Harina sin Preparar MOLITALIA Bolsa 180g	12	84	Activado	1.20
13	11	26	Canela Molida BELL'S Sobre 15g	20	72	Activado	1.90
28	4	26	Polvo de Hornear BELL'S Bolsa 25g	100	4	Activado	1.30
10	1	26	Chips Sabor a Chocolate WINTERS Bolsa 200g	20	663	Activado	9.90
14	11	26	Maicena DURYEA Caja 500g	7	117	Activado	10.00
24	1	10	Aceite Vegetal Premium PRIMOR Botella 900ml	10	10	Activado	9.20
18	1	6	Galletas Chocochips LA FLORENCIA 10un	10	43	Activado	17.90
9	1	6	Pionono con Manjar NESTLÉ Paquete 12un	30	140	Activado	18.90
11	1	6	Alfajores Artesanales NESTLÉ Bandeja 14un	50	101	Activado	17.20
30	1	6	Panetón GLORIA Bolsa 900g Caja 6un	5	15	Activado	159.00
31	1	6	Pan de Yema LA FLORENCIA Bolsa 310g	5	50	Activado	4.20
32	1	6	Crema Volteada LA FLORENCIA 350g	7	20	Activado	7.90
7	6	7	Jamón de Pavo El Corte 200g	20	288	Activado	7.80
33	1	2	Agua Mineral SAN MATEO Sin Gas Bidón 7L	5	15	Activado	7.00
34	1	2	Agua Mineral SAN MATEO sin Gas Botella 2.5L	6	52	Activado	2.50
26	1	10	Arroz Costeño 10kg	10	2	Activado	5.00
3	3	3	Leche Evaporada Laive 400ml	30	394	Activado	2.80
19	1	10	Arroz Costeño 1kg	11	10	Activado	11.00
5	2	5	Atún en Aceite Van Camp’s 170g	30	56	Desactivado	3.20
15	1	1	Mantequilla 100g	20	57	Activado	5.00
1	1	1	Chocolate Snickers 50g	20	0	Activado	25.00
22	1	2	Cerveza De Malta Y Maiz Dragenburg Sixpack 310 Ml	200	330	Activado	16.90
25	1	2	Gaseosa crush	30	52	Desactivado	2.00
20	1	10	Prueba stock categoria	10	10	Desactivado	1.00
27	1	1	prueba desactivado	10	5	Desactivado	10.00
12	1	5	PRUEBA	123	123	Desactivado	123.00
6	9	1	Detergente Ariel 700g	15	34	Desactivado	8.50
2	1	1	Gaseosa Coca-Cola 2L	50	953	Activado	6.00
16	1	1	*//*/**-	9	10	Desactivado	10.00
4	10	3	Leche UHT LAIVE Entera Light Bolsa 900ml	1	28	Activado	4.50
8	4	1	Harina de Trigo Blanca Flor 1kg	20	160	Activado	3.20
23	1	3	Bebida de Almendra SILK Vainilla Caja 946ml	10	12	Activado	16.00
29	1	3	Mantequilla GLORIA Pote 390g	22	22	Activado	16.90
\.


--
-- Data for Name: producto_movimiento; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.producto_movimiento (id_movimiento, id_producto, cantidad, subtotal, precio_unitario) FROM stdin;
1	9	5	14.00	2.80
2	13	20	2460.00	123.00
3	9	5	14.00	2.80
4	9	5	14.00	2.80
5	9	3	8.40	2.80
6	9	3	8.40	2.80
7	9	11	30.80	2.80
8	9	10	28.00	2.80
9	10	20	24.00	1.20
9	2	30	180.00	6.00
9	9	40	112.00	2.80
10	13	90	11070.00	123.00
11	13	5	615.00	123.00
12	13	5	615.00	123.00
13	10	5	6.00	1.20
14	10	3	3.60	1.20
15	10	2	2.40	1.20
16	6	5	42.50	8.50
16	14	10	75.00	7.50
17	6	5	42.50	8.50
18	6	5	42.50	8.50
19	9	10	28.00	2.80
19	10	10	12.00	1.20
20	9	10	28.00	2.80
21	10	10	12.00	1.20
21	2	20	120.00	6.00
21	9	15	42.00	2.80
22	10	10	12.00	1.20
22	2	20	120.00	6.00
22	9	20	56.00	2.80
23	9	10	28.00	2.80
24	9	5	14.00	2.80
25	9	3	8.40	2.80
26	9	2	5.60	2.80
27	9	2	5.60	2.80
28	2	15	90.00	6.00
28	9	10	28.00	2.80
29	9	10	28.00	2.80
30	3	50	140.00	2.80
31	3	30	84.00	2.80
32	3	20	56.00	2.80
33	9	30	84.00	2.80
33	2	20	120.00	6.00
34	2	20	120.00	6.00
35	6	50	425.00	8.50
36	13	10	1230.00	123.00
36	6	20	170.00	8.50
37	13	50	6150.00	123.00
37	14	32	240.00	7.50
38	13	12	1476.00	123.00
38	14	12	90.00	7.50
39	13	12	1476.00	123.00
39	14	12	90.00	7.50
40	13	16	1968.00	123.00
40	14	44	330.00	7.50
41	4	40	160.00	4.00
42	4	40	160.00	4.00
43	1	10	250.00	25.00
44	4	10	-40.00	-4.00
45	1	2	50.00	25.00
46	1	2	50.00	25.00
47	5	10	32.00	3.20
48	16	10	100.00	10.00
48	5	1	3.20	3.20
48	4	10	-40.00	-4.00
49	16	2	20.00	10.00
50	1	1	25.00	25.00
50	10	1	1.20	1.20
50	16	1	10.00	10.00
50	5	1	3.20	3.20
50	18	2	30.88	15.44
51	17	10	154.00	15.40
52	7	2	15.60	7.80
53	9	4	11.20	2.80
54	14	3	22.50	7.50
55	16	1	10.00	10.00
56	16	1	10.00	10.00
63	16	1	10.00	10.00
63	6	1	8.50	8.50
63	1	1	25.00	25.00
63	5	1	3.20	3.20
64	13	4	492.00	123.00
65	16	20	200.00	10.00
65	1	15	375.00	25.00
66	17	3	46.20	15.40
66	9	2	5.60	2.80
67	19	10	100.00	10.00
68	20	15	15.00	1.00
69	19	10	100.00	10.00
70	5	11	35.20	3.20
71	21	20	500.00	25.00
72	21	20	500.00	25.00
73	21	20	500.00	25.00
74	20	1	1.00	1.00
75	8	30	-96.00	-3.20
76	8	20	-64.00	-3.20
77	8	30	-96.00	-3.20
78	8	12	-38.40	-3.20
79	8	8	-25.60	-3.20
80	15	35	175.00	5.00
81	5	12	38.40	3.20
82	2	1	6.00	6.00
83	16	1	10.00	10.00
84	22	200	3380.00	16.90
85	5	1	3.20	3.20
86	5	1	3.20	3.20
87	5	26	83.20	3.20
88	4	20	79.80	3.99
89	13	40	4920.00	123.00
90	16	3	30.00	10.00
91	16	6	60.00	10.00
92	5	2	6.40	3.20
93	3	1	2.80	2.80
93	5	1	3.20	3.20
94	22	1	16.90	16.90
95	22	15	253.50	16.90
96	22	10	169.00	16.90
97	9	5	14.00	2.80
98	13	10	20.00	2.00
99	22	12	202.80	16.90
100	13	30	60.00	2.00
101	13	10	20.00	2.00
102	4	10	39.90	3.99
103	2	2	12.00	6.00
104	22	5	84.50	16.90
105	22	1	16.90	16.90
106	22	1	16.90	16.90
107	3	5	14.00	2.80
108	4	6	23.94	3.99
109	4	5	20.00	4.00
110	4	1	4.00	4.00
111	4	13	52.00	4.00
112	4	1	4.00	4.00
113	4	4	16.00	4.00
114	4	5	20.00	4.00
115	4	4	16.00	4.00
116	10	5	6.00	1.20
117	5	1	3.20	3.20
118	23	1	1.00	1.00
119	22	5	84.50	16.90
119	18	5	42.50	8.50
120	22	4	67.60	16.90
121	5	4	12.80	3.20
122	24	5	5.00	1.00
123	24	4	4.00	1.00
124	23	3	3.00	1.00
125	11	1	20.00	20.00
126	5	2	6.40	3.20
127	5	2	6.40	3.20
128	22	2	33.80	16.90
129	13	2	4.00	2.00
130	13	2	4.00	2.00
131	5	5	16.00	3.20
132	25	5	10.00	2.00
134	1	5	125.00	25.00
135	22	2	33.80	16.90
136	25	5	10.00	2.00
137	25	10	20.00	2.00
138	25	12	24.00	2.00
139	14	2	15.00	7.50
140	26	1	5.00	5.00
141	2	1	6.00	6.00
142	28	1	5.50	5.50
\.


--
-- Data for Name: proveedor; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.proveedor (id_proveedor, razon_social, ruc, numero_telefono, correo, direccion) FROM stdin;
2	Pescados y Mariscos Pacífico S.A.C.	20659874512	 998123456	mariscospacifico@gmail.com	Av. Huamán 789, Trujillo, Perú
3	Lácteos Sierra Blanca S.R.L.	20451239876	944321789	lacteossierrablanca@gmail.com	Jr. Zela 321, Trujillo, Perú
4	Frutos del Valle S.A.C.	20745123698	987123654	frutosdelvalle@gmail.com	Av. Mansiche 987, Trujillo, Perú
5	Café Altomayo E.I.R.L.	20654789123	934567891	cafealtomayo@gmail.com	Jr. Estete 210, Trujillo, Perú
6	Embutidos La Granja S.A.C.	20874123654	977654321	embutidoslagranja@gmail.com	Av. Miraflores 340, Trujillo, Perú
7	Bebidas Naturales Purísima S.R.L.	20987451236	955741236	bebidaspurisima@gmail.com	Av. Húsares de Junín 142, Trujillo, Perú
8	Aceites y Granos del Sur S.A.C.	20458963214	912345678	aceitesdelosur@gmail.com	Calle San Martín 654, Trujillo, Perú
9	Productos Naturales El Campesino S.A.C	20896547123	 912456789	productoselcampesino@gmail.com	Jr. Pizarro 555, Trujillo, Perú
10	Molienda Santa Rosa S.A.C.	20458965412	900123654	moliendasantarosa@gmail.com	Jr. Diego de Almagro 678, Trujillo, Perú
11	Piero SA	12312312312	953889070	piero_alrod@hotmail.com	Trupal Mz J Lt-14
12	BRAVO SAC	12345678945	12345678953214	helderdias@gmail.com	chimbote
1	Agroexportadora Valle Doradora E.I.R.L.	20548912345	956741258	agrovalledorado@gmail.com	Av. Larco 456, Trujillo, Perú
13	PARA COMPROBAR LO DE LOURDES	11111100000	953889070	agrovalledorado@gmail.com	sas
14	dISTRI	10000000000	956741258	cafealtomayo@gmail.com	Trupal Mz J Lt-14
16	Gloria	12345678910	9567	lourdes@mail	Trupal Mz J Lt-14
17	Ponds	12345678987	9957842516	lourdes@mail	Trupal Mz J Lt-14
15	Lays	10000000052	956741285	cafealtomayo@gmail.com	Galeno I
18	AGILE2 S.A	20155945860	914955604	insosac@insosac.com	Av. Ingieneria Calle Olivo 210
\.


--
-- Data for Name: serie_comprobante; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.serie_comprobante (tipo_comprobante, serie, ultimo_correlativo) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: sgi_db_upao_user
--

COPY public.usuarios (id, username, password, email, rol, reset_token, reset_token_expires, estado, nivel_acceso) FROM stdin;
4	Loubaure	$2b$10$PUSWrVxWBkvg30ufG79pteRPGSS3wejgc4NCel/A/gFgvU9BtJ5fK	lourdesbaure@gmail.com	Admin	\N	\N	Activado	basico
7	Polsito	$2b$10$OcAO4WBx852jOQW0r.Iaa.SvrwVIir9GIra6Bcgs.h5cPX08K6qou	pol@gmail.com	Admin	\N	\N	Desactivado	basico
3	Valcra	$2b$10$GpHebaji.jQ9xnVAg/UEfOw/9q0EJhNiq0.OQE493LbWqM51LVRRS	avrg2005@hotmail.com	Admin	\N	\N	Activado	basico
17	fernando	$2b$10$mmCCU/myziTS42XD1FOsVOtYuz9jzvMJFS3MAR4vKv/9sMvlHqz2.	ecastillor@upao.edu.pe	Admin	ff539e3308862a8a50630a0440e8e6e30c688ad11f30c35dade0ab8e0aa50714	2025-06-29 00:12:13.943	Desactivado	basico
2	MariAlfaro	$2b$10$Q7PwMpbSqIhuEJ9OtyKe2.V3APlqeA2d8zdlaoqmKoVHDY1bX75t2	lissetalfaro07@gmail.com	Admin	\N	\N	Activado	basico
5	gabrielleyva	$2b$10$LO8lDSNR0YVIF7N5t66jauNEhgHYBT3Uv5vqxkePiWiGqUlvXvbSm	gabrielleyva@gmail.com	Usuario	\N	\N	Activado	basico
1	Piero	$2b$10$mGcxgx7dPSas2A8pJ5YMdu7qI0veqikRKksGfxBJjytp34Bi41NTK	piero.dev@outlook.com	Admin	1a7255f7f55f6bc7cc87f100fd06d213be0ba830f27c19825f59398fe18ad438	2025-07-02 03:06:59.382	Activado	superadmin
6	Xinefeth	$2b$10$cBPdowJp.4DejCj8Dnb/B.cdlb4uYp7IoCrq.gDLQzWtJ5nxysxhe	jaratiradodiego@gmail.com	Admin	\N	\N	Activado	basico
\.


--
-- Name: auditoria_producto_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: sgi_db_upao_user
--

SELECT pg_catalog.setval('public.auditoria_producto_id_auditoria_seq', 125, true);


--
-- Name: categoria_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: sgi_db_upao_user
--

SELECT pg_catalog.setval('public.categoria_id_categoria_seq', 26, true);


--
-- Name: cliente_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: sgi_db_upao_user
--

SELECT pg_catalog.setval('public.cliente_id_cliente_seq', 19, true);


--
-- Name: incidencia_id_incidencia_seq; Type: SEQUENCE SET; Schema: public; Owner: sgi_db_upao_user
--

SELECT pg_catalog.setval('public.incidencia_id_incidencia_seq', 31, true);


--
-- Name: movimiento_id_movimiento_seq; Type: SEQUENCE SET; Schema: public; Owner: sgi_db_upao_user
--

SELECT pg_catalog.setval('public.movimiento_id_movimiento_seq', 142, true);


--
-- Name: orden_reabastecimiento_id_order_seq; Type: SEQUENCE SET; Schema: public; Owner: sgi_db_upao_user
--

SELECT pg_catalog.setval('public.orden_reabastecimiento_id_order_seq', 53, true);


--
-- Name: producto_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: sgi_db_upao_user
--

SELECT pg_catalog.setval('public.producto_id_producto_seq', 34, true);


--
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE SET; Schema: public; Owner: sgi_db_upao_user
--

SELECT pg_catalog.setval('public.proveedor_id_proveedor_seq', 18, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sgi_db_upao_user
--

SELECT pg_catalog.setval('public.users_id_seq', 17, true);


--
-- Name: auditoria_producto auditoria_producto_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.auditoria_producto
    ADD CONSTRAINT auditoria_producto_pkey PRIMARY KEY (id_auditoria);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria);


--
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);


--
-- Name: incidencia incidencia_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.incidencia
    ADD CONSTRAINT incidencia_pkey PRIMARY KEY (id_incidencia);


--
-- Name: movimiento_ajuste movimiento_ajuste_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento_ajuste
    ADD CONSTRAINT movimiento_ajuste_pkey PRIMARY KEY (id_movimiento);


--
-- Name: movimiento_entrada movimiento_entrada_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento_entrada
    ADD CONSTRAINT movimiento_entrada_pkey PRIMARY KEY (id_movimiento);


--
-- Name: movimiento movimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento
    ADD CONSTRAINT movimiento_pkey PRIMARY KEY (id_movimiento);


--
-- Name: movimiento_venta movimiento_venta_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento_venta
    ADD CONSTRAINT movimiento_venta_pkey PRIMARY KEY (id_movimiento);


--
-- Name: orden_reabastecimiento orden_reabastecimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.orden_reabastecimiento
    ADD CONSTRAINT orden_reabastecimiento_pkey PRIMARY KEY (id_order);


--
-- Name: producto_movimiento producto_movimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.producto_movimiento
    ADD CONSTRAINT producto_movimiento_pkey PRIMARY KEY (id_movimiento, id_producto);


--
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (id_producto);


--
-- Name: proveedor proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_pkey PRIMARY KEY (id_proveedor);


--
-- Name: serie_comprobante serie_comprobante_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.serie_comprobante
    ADD CONSTRAINT serie_comprobante_pkey PRIMARY KEY (tipo_comprobante);


--
-- Name: usuarios users_email_key; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: usuarios users_pkey; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: usuarios users_username_key; Type: CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: auditoria_producto auditoria_producto_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.auditoria_producto
    ADD CONSTRAINT auditoria_producto_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- Name: auditoria_producto auditoria_producto_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.auditoria_producto
    ADD CONSTRAINT auditoria_producto_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- Name: producto fk_categoria; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria(id_categoria) ON DELETE CASCADE;


--
-- Name: producto_movimiento fk_movimiento; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.producto_movimiento
    ADD CONSTRAINT fk_movimiento FOREIGN KEY (id_movimiento) REFERENCES public.movimiento(id_movimiento) ON DELETE CASCADE;


--
-- Name: movimiento_ajuste fk_movimiento; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento_ajuste
    ADD CONSTRAINT fk_movimiento FOREIGN KEY (id_movimiento) REFERENCES public.movimiento(id_movimiento) ON DELETE CASCADE;


--
-- Name: movimiento_entrada fk_movimiento; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento_entrada
    ADD CONSTRAINT fk_movimiento FOREIGN KEY (id_movimiento) REFERENCES public.movimiento(id_movimiento) ON DELETE CASCADE;


--
-- Name: incidencia fk_movimiento; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.incidencia
    ADD CONSTRAINT fk_movimiento FOREIGN KEY (id_movimiento) REFERENCES public.movimiento(id_movimiento) ON DELETE CASCADE;


--
-- Name: incidencia fk_orden_reabastecimiento; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.incidencia
    ADD CONSTRAINT fk_orden_reabastecimiento FOREIGN KEY (id_orden) REFERENCES public.orden_reabastecimiento(id_order) ON DELETE SET NULL;


--
-- Name: producto_movimiento fk_producto; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.producto_movimiento
    ADD CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto) ON DELETE CASCADE;


--
-- Name: producto fk_proveedor; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_proveedor FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id_proveedor) ON DELETE CASCADE;


--
-- Name: movimiento_entrada fk_proveedor; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento_entrada
    ADD CONSTRAINT fk_proveedor FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id_proveedor) ON DELETE CASCADE;


--
-- Name: orden_reabastecimiento fk_proveedor; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.orden_reabastecimiento
    ADD CONSTRAINT fk_proveedor FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id_proveedor) ON DELETE CASCADE;


--
-- Name: movimiento fk_usuario; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento
    ADD CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: orden_reabastecimiento fk_usuario; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.orden_reabastecimiento
    ADD CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: movimiento_entrada movimiento_entrada_id_orden_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento_entrada
    ADD CONSTRAINT movimiento_entrada_id_orden_fkey FOREIGN KEY (id_orden) REFERENCES public.orden_reabastecimiento(id_order);


--
-- Name: movimiento_venta movimiento_venta_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento_venta
    ADD CONSTRAINT movimiento_venta_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- Name: movimiento_venta movimiento_venta_id_movimiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgi_db_upao_user
--

ALTER TABLE ONLY public.movimiento_venta
    ADD CONSTRAINT movimiento_venta_id_movimiento_fkey FOREIGN KEY (id_movimiento) REFERENCES public.movimiento(id_movimiento);


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO sgi_db_upao_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO sgi_db_upao_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO sgi_db_upao_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO sgi_db_upao_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO sgi_db_upao_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO sgi_db_upao_user;


--
-- PostgreSQL database dump complete
--

