PGDMP  #        
            |         	   musikkpro    16.1    16.1 3    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    17124 	   musikkpro    DATABASE     �   CREATE DATABASE musikkpro WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE musikkpro;
                musikk    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            �            1259    17220    admins    TABLE     �   CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);
    DROP TABLE public.admins;
       public         heap    musikk    false    4            �            1259    17219    admins_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.admins_id_seq;
       public          musikk    false    4    226            �           0    0    admins_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;
          public          musikk    false    225            �            1259    17176 	   deletions    TABLE     �   CREATE TABLE public.deletions (
    id integer NOT NULL,
    user_id integer,
    reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.deletions;
       public         heap    musikk    false    4            �            1259    17175    deletions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.deletions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.deletions_id_seq;
       public          musikk    false    220    4            �           0    0    deletions_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.deletions_id_seq OWNED BY public.deletions.id;
          public          musikk    false    219            �            1259    17137    products    TABLE     �   CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255),
    description text,
    images_name character varying(255),
    price numeric(10,2),
    image_url text,
    category character varying(255)
);
    DROP TABLE public.products;
       public         heap    musikk    false    4            �            1259    17136    products_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.products_id_seq;
       public          musikk    false    216    4            �           0    0    products_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
          public          musikk    false    215            �            1259    17209    reviews    TABLE     �   CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id integer,
    user_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.reviews;
       public         heap    musikk    false    4            �            1259    17208    reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.reviews_id_seq;
       public          musikk    false    224    4            �           0    0    reviews_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;
          public          musikk    false    223            �            1259    17191    shopping_cart    TABLE     �   CREATE TABLE public.shopping_cart (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    quantity integer DEFAULT 1
);
 !   DROP TABLE public.shopping_cart;
       public         heap    musikk    false    4            �            1259    17190    shopping_cart_id_seq    SEQUENCE     �   CREATE SEQUENCE public.shopping_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.shopping_cart_id_seq;
       public          musikk    false    222    4            �           0    0    shopping_cart_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.shopping_cart_id_seq OWNED BY public.shopping_cart.id;
          public          musikk    false    221            �            1259    17173    users_id_seq    SEQUENCE     u   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          musikk    false    4            �            1259    17161    users    TABLE     �  CREATE TABLE public.users (
    id bigint DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    name character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    password character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    city character varying(255),
    country character varying(255),
    zcode character varying(20),
    telephone character varying(20)
);
    DROP TABLE public.users;
       public         heap    postgres    false    218    4            �           0    0    TABLE users    ACL     +   GRANT ALL ON TABLE public.users TO musikk;
          public          postgres    false    217            <           2604    17223 	   admins id    DEFAULT     f   ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);
 8   ALTER TABLE public.admins ALTER COLUMN id DROP DEFAULT;
       public          musikk    false    226    225    226            6           2604    17179    deletions id    DEFAULT     l   ALTER TABLE ONLY public.deletions ALTER COLUMN id SET DEFAULT nextval('public.deletions_id_seq'::regclass);
 ;   ALTER TABLE public.deletions ALTER COLUMN id DROP DEFAULT;
       public          musikk    false    220    219    220            3           2604    17140    products id    DEFAULT     j   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          musikk    false    215    216    216            :           2604    17212 
   reviews id    DEFAULT     h   ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);
 9   ALTER TABLE public.reviews ALTER COLUMN id DROP DEFAULT;
       public          musikk    false    224    223    224            8           2604    17194    shopping_cart id    DEFAULT     t   ALTER TABLE ONLY public.shopping_cart ALTER COLUMN id SET DEFAULT nextval('public.shopping_cart_id_seq'::regclass);
 ?   ALTER TABLE public.shopping_cart ALTER COLUMN id DROP DEFAULT;
       public          musikk    false    222    221    222            �          0    17220    admins 
   TABLE DATA           8   COPY public.admins (id, username, password) FROM stdin;
    public          musikk    false    226   �7       �          0    17176 	   deletions 
   TABLE DATA           D   COPY public.deletions (id, user_id, reason, created_at) FROM stdin;
    public          musikk    false    220   8       �          0    17137    products 
   TABLE DATA           b   COPY public.products (id, name, description, images_name, price, image_url, category) FROM stdin;
    public          musikk    false    216   K8       �          0    17209    reviews 
   TABLE DATA           W   COPY public.reviews (id, product_id, user_id, rating, comment, created_at) FROM stdin;
    public          musikk    false    224   =;       �          0    17191    shopping_cart 
   TABLE DATA           J   COPY public.shopping_cart (id, user_id, product_id, quantity) FROM stdin;
    public          musikk    false    222   Z;       �          0    17161    users 
   TABLE DATA           g   COPY public.users (id, name, email, password, created_at, city, country, zcode, telephone) FROM stdin;
    public          postgres    false    217   w;       �           0    0    admins_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.admins_id_seq', 10, true);
          public          musikk    false    225            �           0    0    deletions_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.deletions_id_seq', 102, true);
          public          musikk    false    219            �           0    0    products_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.products_id_seq', 33, true);
          public          musikk    false    215            �           0    0    reviews_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);
          public          musikk    false    223            �           0    0    shopping_cart_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.shopping_cart_id_seq', 1, false);
          public          musikk    false    221            �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 55, true);
          public          musikk    false    218            J           2606    17227    admins admins_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_pkey;
       public            musikk    false    226            D           2606    17184    deletions deletions_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.deletions
    ADD CONSTRAINT deletions_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.deletions DROP CONSTRAINT deletions_pkey;
       public            musikk    false    220            >           2606    17144    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            musikk    false    216            H           2606    17217    reviews reviews_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_pkey;
       public            musikk    false    224            F           2606    17197     shopping_cart shopping_cart_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT shopping_cart_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.shopping_cart DROP CONSTRAINT shopping_cart_pkey;
       public            musikk    false    222            @           2606    17170    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    217            B           2606    17168    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    217            K           2606    17185     deletions deletions_user_id_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.deletions
    ADD CONSTRAINT deletions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 J   ALTER TABLE ONLY public.deletions DROP CONSTRAINT deletions_user_id_fkey;
       public          musikk    false    220    4674    217            L           2606    17203 +   shopping_cart shopping_cart_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT shopping_cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 U   ALTER TABLE ONLY public.shopping_cart DROP CONSTRAINT shopping_cart_product_id_fkey;
       public          musikk    false    216    222    4670            M           2606    17198 (   shopping_cart shopping_cart_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT shopping_cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 R   ALTER TABLE ONLY public.shopping_cart DROP CONSTRAINT shopping_cart_user_id_fkey;
       public          musikk    false    4674    217    222            �   Y   x�34�L,v�M���K���T1JR14P��	3�5��*v	64J�ԋ4���
��u+/�
�0�q�/2�	�
6�JKw����� ��      �   /   x�340������4202�50�54V00�24�25ҳ0������ �b      �   �  x�uTKo7>ӿb�)�+���N[ p��J{�e�Ɍ��������Ev v%j��pښ�R�ou�S��_޷MCw>�N�A���8t�!&��Y{ꢏ��+Ľ�k�1d�E�&��.[v$ޕ3��f��̴�ռ�i��3>W��[����
=��t�"q���Q�~ ��u��PHyހa�HJ��]`b�+��[�6�������Ϳ�$�J�w�a�W�黺L!撴#�!�����@�=�6��C.��n��&a��CG<�z/�L�l5Y��[�Jo��v����=�{��V�?�Q:�b-B.)�rq��I�jB���u Y��B���uޟ҄�J[�9.�8�EӉ��L�������g�l��ae(��3�-Z�bdup�
	�]'}�5\�����S�n�uL�dI��>���k>i�c�?�m�t>�%��K���>~�`�W$u��u��a�J��tM��K��L�&ʹ�؋����Wx���>q)G[�s{�1���X�n#	���ub.(�H#JwB�5����m�B����4�?�m���Ms���%�)k��@GiXfڣ
�O��W��K�`�$y����J�2�x�cc�i���e��F9>��%+wL[\5(�=q�����Y.�7�Jӷ(�5l ��O�Σ��>�g������BET�4a~y���%�":��Dk,ӳs����qI%aj�=�dz��B�gl�V�V��mg�כ������:      �      x������ � �      �      x������ � �      �   �   x�35����pH�K���T1JR14P	�w3J.�7�(-(
��0��I-���4��4pN�0�vI�*q�Ό,��,*	�3�4202�50�54Q04�20�26ճ41�t/��-.IL���/JO�435��61711!�=... ��#�     