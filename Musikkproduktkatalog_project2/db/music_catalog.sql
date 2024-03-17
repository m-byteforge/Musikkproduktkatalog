PGDMP  (    1                |            music_catalog    16.1    16.1 4    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    17330    music_catalog    DATABASE     �   CREATE DATABASE music_catalog WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE music_catalog;
                postgres    false            �            1255    17385    transfer_to_deletion_table()    FUNCTION     +  CREATE FUNCTION public.transfer_to_deletion_table() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO deletion (username, email, city, country, zip_code, telephone)
    VALUES (OLD.username, OLD.email, OLD.city, OLD.country, OLD.zip_code, OLD.telephone);
    RETURN OLD;
END;
$$;
 3   DROP FUNCTION public.transfer_to_deletion_table();
       public          postgres    false            �            1259    17414    admins    TABLE     8  CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    isadmin boolean DEFAULT false NOT NULL,
    role character varying(255) DEFAULT 'admin'::character varying NOT NULL
);
    DROP TABLE public.admins;
       public         heap    postgres    false            �            1259    17413    admins_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.admins_id_seq;
       public          postgres    false    226            �           0    0    admins_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;
          public          postgres    false    225            �            1259    17376    deletion    TABLE     g  CREATE TABLE public.deletion (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    city character varying(255),
    country character varying(255),
    zip_code character varying(20),
    telephone character varying(20),
    deleted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.deletion;
       public         heap    postgres    false            �            1259    17375    deletion_id_seq    SEQUENCE     �   CREATE SEQUENCE public.deletion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.deletion_id_seq;
       public          postgres    false    222            �           0    0    deletion_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.deletion_id_seq OWNED BY public.deletion.id;
          public          postgres    false    221            �            1259    17402 	   deletions    TABLE     �   CREATE TABLE public.deletions (
    id integer NOT NULL,
    user_id integer,
    admin_id integer,
    username character varying(255),
    email character varying(255),
    deleted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.deletions;
       public         heap    postgres    false            �            1259    17401    deletions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.deletions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.deletions_id_seq;
       public          postgres    false    224            �           0    0    deletions_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.deletions_id_seq OWNED BY public.deletions.id;
          public          postgres    false    223            �            1259    17332    products    TABLE     �   CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    images_name character varying(255),
    price numeric(10,2) NOT NULL,
    user_id integer
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    17331    products_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.products_id_seq;
       public          postgres    false    216            �           0    0    products_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
          public          postgres    false    215            �            1259    17351    reviews    TABLE     *  CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    rating integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);
    DROP TABLE public.reviews;
       public         heap    postgres    false            �            1259    17350    reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.reviews_id_seq;
       public          postgres    false    220            �           0    0    reviews_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;
          public          postgres    false    219            �            1259    17341    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    city character varying(50),
    country character varying(50),
    zip_code character varying(20),
    telephone character varying(20),
    email character varying(100),
    role character varying(255) DEFAULT 'user'::character varying
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    17340    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    218            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    217            =           2604    17417 	   admins id    DEFAULT     f   ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);
 8   ALTER TABLE public.admins ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    225    226            9           2604    17379    deletion id    DEFAULT     j   ALTER TABLE ONLY public.deletion ALTER COLUMN id SET DEFAULT nextval('public.deletion_id_seq'::regclass);
 :   ALTER TABLE public.deletion ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            ;           2604    17405    deletions id    DEFAULT     l   ALTER TABLE ONLY public.deletions ALTER COLUMN id SET DEFAULT nextval('public.deletions_id_seq'::regclass);
 ;   ALTER TABLE public.deletions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            4           2604    17335    products id    DEFAULT     j   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            7           2604    17354 
   reviews id    DEFAULT     h   ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);
 9   ALTER TABLE public.reviews ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            5           2604    17344    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            �          0    17414    admins 
   TABLE DATA           N   COPY public.admins (id, username, password, email, isadmin, role) FROM stdin;
    public          postgres    false    226   <       �          0    17376    deletion 
   TABLE DATA           g   COPY public.deletion (id, username, email, city, country, zip_code, telephone, deleted_at) FROM stdin;
    public          postgres    false    222   =       �          0    17402 	   deletions 
   TABLE DATA           W   COPY public.deletions (id, user_id, admin_id, username, email, deleted_at) FROM stdin;
    public          postgres    false    224   c=       �          0    17332    products 
   TABLE DATA           V   COPY public.products (id, name, description, images_name, price, user_id) FROM stdin;
    public          postgres    false    216   �=       �          0    17351    reviews 
   TABLE DATA           W   COPY public.reviews (id, user_id, product_id, rating, comment, created_at) FROM stdin;
    public          postgres    false    220   T?       �          0    17341    users 
   TABLE DATA           h   COPY public.users (id, username, password, city, country, zip_code, telephone, email, role) FROM stdin;
    public          postgres    false    218   q?       �           0    0    admins_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.admins_id_seq', 8, true);
          public          postgres    false    225            �           0    0    deletion_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.deletion_id_seq', 27, true);
          public          postgres    false    221            �           0    0    deletions_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.deletions_id_seq', 1, false);
          public          postgres    false    223            �           0    0    products_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.products_id_seq', 376, true);
          public          postgres    false    215            �           0    0    reviews_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);
          public          postgres    false    219                        0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 54, true);
          public          postgres    false    217            P           2606    17423    admins admins_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_pkey;
       public            postgres    false    226            L           2606    17384    deletion deletion_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.deletion
    ADD CONSTRAINT deletion_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.deletion DROP CONSTRAINT deletion_pkey;
       public            postgres    false    222            N           2606    17410    deletions deletions_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.deletions
    ADD CONSTRAINT deletions_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.deletions DROP CONSTRAINT deletions_pkey;
       public            postgres    false    224            B           2606    17339    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    216            J           2606    17360    reviews reviews_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_pkey;
       public            postgres    false    220            D           2606    17374    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    218            F           2606    17347    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    218            H           2606    17349    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    218            S           2620    17386    users delete_user_trigger    TRIGGER     �   CREATE TRIGGER delete_user_trigger AFTER DELETE ON public.users FOR EACH ROW EXECUTE FUNCTION public.transfer_to_deletion_table();
 2   DROP TRIGGER delete_user_trigger ON public.users;
       public          postgres    false    218    227            Q           2606    17366    reviews reviews_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 I   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_product_id_fkey;
       public          postgres    false    4674    216    220            R           2606    17361    reviews reviews_user_id_fkey    FK CONSTRAINT     {   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 F   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_user_id_fkey;
       public          postgres    false    218    220    4678            �   �   x�m��n�0  �syεԁ�&
f�"Ja���JWu�Ny��\�d�|�6�l٦v��O$����	w�iQ�:~�ep�>J�Dh�,�+�P�)�z�x�(ЂC�Ngk�4�|�]GZ�����"��4��_�X�"O�w���gK�E=[{(�|	�0�b��{K2zY�(:�[E��v��"\Mv�f���e"n�')j�M�в��}P�      �   P   x�32�����Lr�M���K���t/��-.IL���/JO�4G��id`d�k`�kh�``fe`neh�gdnbjd����� `<�      �      x������ � �      �   �  x�m��n1E��Wp��1��s��mv�U6�D;L5�"�F?��.7;�F�9�d�X�{��U�b.p��k���n�l̖��R��R�b�;	���]�Z�E?�z<��"81m��-f���z>i��0��[��f5o`��>lȳ%�6��'�(���h�A��)ez��(s.��K��/�Z��B`�{�/^$��c� �#$��!��ؚv�n�����k�[������R�$
k&�Z$�+����Q�c(Cr�l�'�a��=[FpT(��.0p촛s��_l3����^�.[��A�UZ��4��NVK��RщR�����I��y��֭�h�{��X�9��|�^�h技@<�(�.�Z��Ay�꒜t�a̖/���N�x��xw1���"�c�b;��,��a���Vr�20�@�IW�+ �]��>NF����<      �      x������ � �      �   �  x�u�ْ�0���s�5��NwQkn �E	�">��L��t�d9I%U����< x�7~�6����2��s��#?]Fx�Mw�6��iN̤�:�=���S��K���,�@�
�^��O3Q�f=�n��rn��_;�)a'���V5�G3���&s�	5�료�(aO�5(N�S��,��% ���!�/ �O��l붸�l�����+���A���%��'J*R�ּ��8gd"�sk�/��K�Ғ?;8�FA=AE}�2���vP_��xcԫ���%.�����bs�����y��-����G�02)�
����O�$�OR����eU}q�0�h�J�O:�,1k'.�W��{@�s�S.e4M�T
��O(��L��K�{�GKi^H�GTY��2=�ӭlDn����ڡm���y�S�I�9NbV��@�pVء+,n��PG�<�W��Z�7��Ǹ6�z4�y�,s;oD��v���Ȃ��Ow3���(bW����t�ü�`T�����~Ѭ�}��\�^)Ҫ+gПg�̲��I<���o�\o�8i���ٌ�?v���[X5�|2���J7#�z��l�Q��޴�fkhw4�'Fʧ���_'\���jJ� K�J���|�~q�^�7�=+     