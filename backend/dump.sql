--
-- PostgreSQL database dump
--

\restrict 89VestsuxGhD57s23heBoVezTPEqk113JrfS64vbzI0WNB38o71cLhzCkIt9kyp

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

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

ALTER TABLE IF EXISTS ONLY public.user_settings DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_scores DROP CONSTRAINT IF EXISTS user_scores_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_scores DROP CONSTRAINT IF EXISTS user_scores_mock_test_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_responses DROP CONSTRAINT IF EXISTS user_responses_question_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_responses DROP CONSTRAINT IF EXISTS user_responses_attempt_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_attempt_details DROP CONSTRAINT IF EXISTS user_attempt_details_user_score_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_attempt_details DROP CONSTRAINT IF EXISTS user_attempt_details_question_id_fkey;
ALTER TABLE IF EXISTS ONLY public.test_section_links DROP CONSTRAINT IF EXISTS test_section_links_section_id_fkey;
ALTER TABLE IF EXISTS ONLY public.test_section_links DROP CONSTRAINT IF EXISTS test_section_links_mock_test_id_fkey;
ALTER TABLE IF EXISTS ONLY public.test_attempts DROP CONSTRAINT IF EXISTS test_attempts_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.test_attempts DROP CONSTRAINT IF EXISTS test_attempts_mock_test_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_mock_test_id_fkey;
ALTER TABLE IF EXISTS ONLY public.question_flags DROP CONSTRAINT IF EXISTS question_flags_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.question_flags DROP CONSTRAINT IF EXISTS question_flags_question_id_fkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.mcq_questions DROP CONSTRAINT IF EXISTS mcq_questions_section_id_fkey;
ALTER TABLE IF EXISTS ONLY public.history_questions DROP CONSTRAINT IF EXISTS history_questions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.history_questions DROP CONSTRAINT IF EXISTS history_questions_question_id_fkey;
ALTER TABLE IF EXISTS ONLY public.discussions DROP CONSTRAINT IF EXISTS discussions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.discussions DROP CONSTRAINT IF EXISTS discussions_mock_test_id_fkey;
ALTER TABLE IF EXISTS ONLY public.challenge_questions DROP CONSTRAINT IF EXISTS challenge_questions_question_id_fkey;
ALTER TABLE IF EXISTS ONLY public.challenge_questions DROP CONSTRAINT IF EXISTS challenge_questions_challenge_id_fkey;
ALTER TABLE IF EXISTS ONLY public.challenge_participants DROP CONSTRAINT IF EXISTS challenge_participants_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.challenge_participants DROP CONSTRAINT IF EXISTS challenge_participants_challenge_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bookmarks DROP CONSTRAINT IF EXISTS bookmarks_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bookmarks DROP CONSTRAINT IF EXISTS bookmarks_mock_test_id_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key9;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key8;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key7;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key6;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key5;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key4;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key3;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key2;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key17;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key16;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key15;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key14;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key13;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key12;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key11;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key10;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key1;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.user_settings DROP CONSTRAINT IF EXISTS user_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.user_scores DROP CONSTRAINT IF EXISTS user_scores_pkey;
ALTER TABLE IF EXISTS ONLY public.user_responses DROP CONSTRAINT IF EXISTS user_responses_pkey;
ALTER TABLE IF EXISTS ONLY public.user_attempt_details DROP CONSTRAINT IF EXISTS user_attempt_details_pkey;
ALTER TABLE IF EXISTS ONLY public.test_section_links DROP CONSTRAINT IF EXISTS test_section_links_pkey;
ALTER TABLE IF EXISTS ONLY public.test_attempts DROP CONSTRAINT IF EXISTS test_attempts_pkey;
ALTER TABLE IF EXISTS ONLY public.streams DROP CONSTRAINT IF EXISTS streams_pkey;
ALTER TABLE IF EXISTS ONLY public.sections DROP CONSTRAINT IF EXISTS sections_pkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.question_flags DROP CONSTRAINT IF EXISTS question_flags_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.mock_tests DROP CONSTRAINT IF EXISTS mock_tests_pkey;
ALTER TABLE IF EXISTS ONLY public.mcq_questions DROP CONSTRAINT IF EXISTS mcq_questions_pkey;
ALTER TABLE IF EXISTS ONLY public.history_questions DROP CONSTRAINT IF EXISTS history_questions_pkey;
ALTER TABLE IF EXISTS ONLY public.discussions DROP CONSTRAINT IF EXISTS discussions_pkey;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_pkey;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key9;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key8;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key7;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key6;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key5;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key4;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key3;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key2;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key17;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key16;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key15;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key14;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key13;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key12;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key11;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key10;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key1;
ALTER TABLE IF EXISTS ONLY public.daily_challenges DROP CONSTRAINT IF EXISTS daily_challenges_date_key;
ALTER TABLE IF EXISTS ONLY public.challenges DROP CONSTRAINT IF EXISTS challenges_pkey;
ALTER TABLE IF EXISTS ONLY public.challenge_questions DROP CONSTRAINT IF EXISTS challenge_questions_pkey;
ALTER TABLE IF EXISTS ONLY public.challenge_participants DROP CONSTRAINT IF EXISTS challenge_participants_pkey;
ALTER TABLE IF EXISTS ONLY public.bookmarks DROP CONSTRAINT IF EXISTS bookmarks_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.user_settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.user_scores ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.user_responses ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.user_attempt_details ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.test_attempts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.streams ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sections ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.reviews ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.question_flags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.notifications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mock_tests ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mcq_questions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.history_questions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.discussions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.daily_challenges ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.challenges ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.challenge_participants ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.bookmarks ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.user_settings_id_seq;
DROP TABLE IF EXISTS public.user_settings;
DROP SEQUENCE IF EXISTS public.user_scores_id_seq;
DROP TABLE IF EXISTS public.user_scores;
DROP SEQUENCE IF EXISTS public.user_responses_id_seq;
DROP TABLE IF EXISTS public.user_responses;
DROP SEQUENCE IF EXISTS public.user_attempt_details_id_seq;
DROP TABLE IF EXISTS public.user_attempt_details;
DROP TABLE IF EXISTS public.test_section_links;
DROP SEQUENCE IF EXISTS public.test_attempts_id_seq;
DROP TABLE IF EXISTS public.test_attempts;
DROP SEQUENCE IF EXISTS public.streams_id_seq;
DROP TABLE IF EXISTS public.streams;
DROP SEQUENCE IF EXISTS public.sections_id_seq;
DROP TABLE IF EXISTS public.sections;
DROP SEQUENCE IF EXISTS public.reviews_id_seq;
DROP TABLE IF EXISTS public.reviews;
DROP SEQUENCE IF EXISTS public.question_flags_id_seq;
DROP TABLE IF EXISTS public.question_flags;
DROP SEQUENCE IF EXISTS public.notifications_id_seq;
DROP TABLE IF EXISTS public.notifications;
DROP SEQUENCE IF EXISTS public.mock_tests_id_seq;
DROP TABLE IF EXISTS public.mock_tests;
DROP SEQUENCE IF EXISTS public.mcq_questions_id_seq;
DROP TABLE IF EXISTS public.mcq_questions;
DROP SEQUENCE IF EXISTS public.history_questions_id_seq;
DROP TABLE IF EXISTS public.history_questions;
DROP SEQUENCE IF EXISTS public.discussions_id_seq;
DROP TABLE IF EXISTS public.discussions;
DROP SEQUENCE IF EXISTS public.daily_challenges_id_seq;
DROP TABLE IF EXISTS public.daily_challenges;
DROP SEQUENCE IF EXISTS public.challenges_id_seq;
DROP TABLE IF EXISTS public.challenges;
DROP TABLE IF EXISTS public.challenge_questions;
DROP SEQUENCE IF EXISTS public.challenge_participants_id_seq;
DROP TABLE IF EXISTS public.challenge_participants;
DROP SEQUENCE IF EXISTS public.bookmarks_id_seq;
DROP TABLE IF EXISTS public.bookmarks;
DROP TYPE IF EXISTS public.question_status_enum;
DROP TYPE IF EXISTS public.oauth_provider_enum;
DROP TYPE IF EXISTS public.enum_users_oauth_provider;
DROP TYPE IF EXISTS public.enum_user_scores_status;
DROP TYPE IF EXISTS public.enum_user_scores_mode;
DROP TYPE IF EXISTS public.enum_user_attempt_details_status;
DROP TYPE IF EXISTS public.enum_mcq_questions_status;
--
-- Name: enum_mcq_questions_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_mcq_questions_status AS ENUM (
    'approved',
    'pending',
    'rejected'
);


--
-- Name: enum_user_attempt_details_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_user_attempt_details_status AS ENUM (
    'correct',
    'incorrect',
    'unanswered',
    'flagged'
);


--
-- Name: enum_user_scores_mode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_user_scores_mode AS ENUM (
    'practice',
    'ranked',
    'daily_challenge',
    'challenge'
);


--
-- Name: enum_user_scores_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_user_scores_status AS ENUM (
    'in_progress',
    'completed'
);


--
-- Name: enum_users_oauth_provider; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_oauth_provider AS ENUM (
    'local',
    'google'
);


--
-- Name: oauth_provider_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.oauth_provider_enum AS ENUM (
    'local',
    'google'
);


--
-- Name: question_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.question_status_enum AS ENUM (
    'approved',
    'hidden'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookmarks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    mock_test_id integer NOT NULL
);


--
-- Name: bookmarks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookmarks_id_seq OWNED BY public.bookmarks.id;


--
-- Name: challenge_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.challenge_participants (
    id integer NOT NULL,
    challenge_id integer NOT NULL,
    user_id integer NOT NULL,
    score double precision NOT NULL,
    elapsed_time integer NOT NULL,
    attempted_at timestamp with time zone
);


--
-- Name: challenge_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.challenge_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: challenge_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.challenge_participants_id_seq OWNED BY public.challenge_participants.id;


--
-- Name: challenge_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.challenge_questions (
    challenge_id integer NOT NULL,
    question_id integer NOT NULL
);


--
-- Name: challenges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.challenges (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    date date NOT NULL,
    total_questions integer DEFAULT 10 NOT NULL,
    time_limit integer DEFAULT 600 NOT NULL,
    subject_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: challenges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.challenges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: challenges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.challenges_id_seq OWNED BY public.challenges.id;


--
-- Name: daily_challenges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_challenges (
    id integer NOT NULL,
    date date NOT NULL,
    question_ids json NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: daily_challenges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.daily_challenges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: daily_challenges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.daily_challenges_id_seq OWNED BY public.daily_challenges.id;


--
-- Name: discussions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discussions (
    id integer NOT NULL,
    mock_test_id integer NOT NULL,
    message json NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: discussions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discussions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: discussions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.discussions_id_seq OWNED BY public.discussions.id;


--
-- Name: history_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.history_questions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    question_id integer NOT NULL,
    test_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: history_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.history_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: history_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.history_questions_id_seq OWNED BY public.history_questions.id;


--
-- Name: mcq_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mcq_questions (
    id integer NOT NULL,
    section_id integer NOT NULL,
    question character varying(255) NOT NULL,
    options json NOT NULL,
    answer character varying(255) NOT NULL,
    status public.enum_mcq_questions_status DEFAULT 'approved'::public.enum_mcq_questions_status NOT NULL
);


--
-- Name: mcq_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mcq_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mcq_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mcq_questions_id_seq OWNED BY public.mcq_questions.id;


--
-- Name: mock_tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mock_tests (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    time_limit integer NOT NULL,
    question_count integer NOT NULL
);


--
-- Name: mock_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mock_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mock_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mock_tests_id_seq OWNED BY public.mock_tests.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    actor_id integer,
    message character varying(255) NOT NULL,
    type character varying(255) DEFAULT 'info'::character varying NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: question_flags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question_flags (
    id integer NOT NULL,
    question_id integer NOT NULL,
    user_id integer NOT NULL,
    reason text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: question_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.question_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: question_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.question_flags_id_seq OWNED BY public.question_flags.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    mock_test_id integer NOT NULL,
    review text,
    rating double precision,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    question_weight double precision NOT NULL,
    marks_per_question double precision NOT NULL,
    negative_marking double precision NOT NULL
);


--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- Name: streams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.streams (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: streams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.streams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.streams_id_seq OWNED BY public.streams.id;


--
-- Name: test_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_attempts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    mock_test_id integer NOT NULL,
    question_ids jsonb NOT NULL,
    started_at timestamp with time zone NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    submitted_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: COLUMN test_attempts.question_ids; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.test_attempts.question_ids IS 'JSON object mapping section_id to array of question_ids';


--
-- Name: test_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.test_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.test_attempts_id_seq OWNED BY public.test_attempts.id;


--
-- Name: test_section_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_section_links (
    mock_test_id integer NOT NULL,
    section_id integer NOT NULL
);


--
-- Name: user_attempt_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_attempt_details (
    id integer NOT NULL,
    user_score_id integer NOT NULL,
    question_id integer NOT NULL,
    selected_option integer,
    status public.enum_user_attempt_details_status NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: user_attempt_details_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_attempt_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_attempt_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_attempt_details_id_seq OWNED BY public.user_attempt_details.id;


--
-- Name: user_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_responses (
    id integer NOT NULL,
    attempt_id integer NOT NULL,
    question_id integer NOT NULL,
    answer integer,
    is_flagged boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: COLUMN user_responses.answer; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_responses.answer IS 'Selected option number (1, 2, 3, 4) or null if not answered';


--
-- Name: user_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_responses_id_seq OWNED BY public.user_responses.id;


--
-- Name: user_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_scores (
    id integer NOT NULL,
    user_id integer NOT NULL,
    mock_test_id integer NOT NULL,
    score integer NOT NULL,
    question_count integer DEFAULT 0 NOT NULL,
    full_marks integer DEFAULT 0 NOT NULL,
    time_limit integer DEFAULT 0 NOT NULL,
    section_scores jsonb DEFAULT '{}'::jsonb,
    unanswered_questions integer DEFAULT 0 NOT NULL,
    elapsed_time integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone NOT NULL,
    mode public.enum_user_scores_mode DEFAULT 'practice'::public.enum_user_scores_mode NOT NULL,
    status public.enum_user_scores_status DEFAULT 'completed'::public.enum_user_scores_status NOT NULL
);


--
-- Name: user_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_scores_id_seq OWNED BY public.user_scores.id;


--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_settings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: user_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_settings_id_seq OWNED BY public.user_settings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    number character varying(255),
    bio character varying(255),
    avatar character varying(255),
    blob_name character varying(255),
    oauth_provider public.enum_users_oauth_provider DEFAULT 'local'::public.enum_users_oauth_provider NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookmarks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks ALTER COLUMN id SET DEFAULT nextval('public.bookmarks_id_seq'::regclass);


--
-- Name: challenge_participants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenge_participants ALTER COLUMN id SET DEFAULT nextval('public.challenge_participants_id_seq'::regclass);


--
-- Name: challenges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenges ALTER COLUMN id SET DEFAULT nextval('public.challenges_id_seq'::regclass);


--
-- Name: daily_challenges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges ALTER COLUMN id SET DEFAULT nextval('public.daily_challenges_id_seq'::regclass);


--
-- Name: discussions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussions ALTER COLUMN id SET DEFAULT nextval('public.discussions_id_seq'::regclass);


--
-- Name: history_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.history_questions ALTER COLUMN id SET DEFAULT nextval('public.history_questions_id_seq'::regclass);


--
-- Name: mcq_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mcq_questions ALTER COLUMN id SET DEFAULT nextval('public.mcq_questions_id_seq'::regclass);


--
-- Name: mock_tests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mock_tests ALTER COLUMN id SET DEFAULT nextval('public.mock_tests_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: question_flags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_flags ALTER COLUMN id SET DEFAULT nextval('public.question_flags_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- Name: streams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.streams ALTER COLUMN id SET DEFAULT nextval('public.streams_id_seq'::regclass);


--
-- Name: test_attempts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_attempts ALTER COLUMN id SET DEFAULT nextval('public.test_attempts_id_seq'::regclass);


--
-- Name: user_attempt_details id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_attempt_details ALTER COLUMN id SET DEFAULT nextval('public.user_attempt_details_id_seq'::regclass);


--
-- Name: user_responses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_responses ALTER COLUMN id SET DEFAULT nextval('public.user_responses_id_seq'::regclass);


--
-- Name: user_scores id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_scores ALTER COLUMN id SET DEFAULT nextval('public.user_scores_id_seq'::regclass);


--
-- Name: user_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings ALTER COLUMN id SET DEFAULT nextval('public.user_settings_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bookmarks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookmarks (id, user_id, mock_test_id) FROM stdin;
25	1	1
42	19	1
\.


--
-- Data for Name: challenge_participants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.challenge_participants (id, challenge_id, user_id, score, elapsed_time, attempted_at) FROM stdin;
4	3	19	0	18	2026-03-22 09:32:44.913+00
\.


--
-- Data for Name: challenge_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.challenge_questions (challenge_id, question_id) FROM stdin;
1	101
1	99
1	111
1	107
1	100
1	110
1	102
1	106
1	109
1	108
2	109
2	111
2	110
2	103
2	99
2	108
2	100
2	106
2	101
2	102
3	101
3	105
3	103
3	108
3	111
3	104
3	110
3	109
3	99
3	102
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.challenges (id, title, date, total_questions, time_limit, subject_id, created_at, updated_at) FROM stdin;
1	Daily Challenge - Main - 2026-02-20	2026-02-20	10	600	1	2026-02-20 17:55:18.836+00	2026-02-20 17:55:18.836+00
2	Daily Challenge - Main - 2026-02-21	2026-02-21	10	600	1	2026-02-21 07:53:56.709+00	2026-02-21 07:53:56.709+00
3	Daily Challenge - Main - 2026-03-22	2026-03-22	10	600	1	2026-03-22 09:13:24.841+00	2026-03-22 09:13:24.841+00
\.


--
-- Data for Name: daily_challenges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.daily_challenges (id, date, question_ids, created_at) FROM stdin;
\.


--
-- Data for Name: discussions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discussions (id, mock_test_id, message, user_id, created_at) FROM stdin;
975	1	{"text":"hey","mentions":[]}	19	2025-09-05 07:16:06.677+00
981	1	{"text":"hey","mentions":[]}	19	2026-01-08 05:18:18.379+00
\.


--
-- Data for Name: history_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.history_questions (id, user_id, question_id, test_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mcq_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mcq_questions (id, section_id, question, options, answer, status) FROM stdin;
177	1	Solve for x: x-√(x-1) = √(x-2)	{"1": "1/3", "2": "3", "3": "1/2", "4": "2"}	2	approved
1	1	Which of the following is the smallest unit of length?	{"1": "millimeter", "2": "micrometer", "3": "nanometer", "4": "angstrom unit"}	4	approved
2	1	Which of the following elements does not belong to alkali metals?	{"1": "Na", "2": "Li", "3": "Mg", "4": "K"}	3	approved
3	1	Methyl orange gives ____ colour with base.	{"1": "red", "2": "pink", "3": "orange", "4": "yellow"}	4	approved
4	1	Which of the following is common alcohol (wine)?	{"1": "methyl alcohol", "2": "ethyl alcohol", "3": "propyl alcohol", "4": "butyl alcohol"}	2	approved
5	1	Cobalt oxide is added to ordinary glass to make _______ glass.	{"1": "black", "2": "red", "3": "hard", "4": "blue"}	4	approved
6	1	What should be the amount of sugar to make a saturated solution of sugar in 500gm water at 25°C, if solubility of sugar at that temp. is 20.	{"1": "20", "2": "25", "3": "100", "4": "200"}	3	approved
7	1	The element with atomic no. 24 is:	{"1": "Iron", "2": "Cadmium", "3": "Chromium", "4": "Copper"}	3	approved
8	1	What is the molecular formula for bleaching powder?	{"1": "CaCl2", "2": "CaOCl2", "3": "CuSO4", "4": "MgCl2"}	2	approved
9	1	Glycerol is an example of _______.	{"1": "monohydric alcohol", "2": "dihydric alcohol", "3": "trihydric alcohol", "4": "aldehyde"}	3	approved
10	1	Which of the following metal has highest boiling point?	{"1": "Aluminium", "2": "Silver", "3": "Copper", "4": "Gold"}	1	approved
11	1	Amphibian of plant kingdom is:	{"1": "Algae", "2": "Fungi", "3": "Gymnosperm", "4": "Bryophyta"}	4	approved
12	1	The largest animal cell is _______.	{"1": "Ostrich egg", "2": "RBC", "3": "WBC", "4": "Neuron"}	1	approved
13	1	Nucleolus is present in _______.	{"1": "cytoplasm", "2": "nucleoplasm", "3": "cell membrane", "4": "plastid"}	2	approved
14	1	Which of the following planet spins most slowly?	{"1": "Venus", "2": "Earth", "3": "Mars", "4": "Jupiter"}	1	approved
15	1	Which of the following does not belong to phylum coelenterata?	{"1": "Hydra", "2": "Volvox", "3": "Obelia", "4": "both b and c"}	4	approved
16	1	The animal in which both male and female sex organ are present in a single individual is called:	{"1": "sexual", "2": "asexual", "3": "hermaphrodite", "4": "monosexual"}	3	approved
17	1	The scientific name of "pea" is:	{"1": "Allium sativum", "2": "Rosa indica", "3": "Pisum sativum", "4": "Magnifera indica"}	3	approved
18	1	Crossing over starts in _______.	{"1": "Diplotene", "2": "Zygotene", "3": "Leptotene", "4": "Pachytene"}	1	approved
19	1	What is the gametophyte of fern plant?	{"1": "Thallus", "2": "Inducicum", "3": "Flowers", "4": "Prothallus"}	4	approved
20	1	Bloods are made with _______ tissues.	{"1": "epithelial", "2": "connective", "3": "muscular", "4": "nervous"}	2	approved
21	1	If 36 men can finish a piece of work in 20 days. How many men should be added so that the work can be finished in 4/5 of the time?	{"1": "12", "2": "9", "3": "8", "4": "4"}	2	approved
22	1	A rectangular sheet of paper 30 cm × 16 cm can be formed into two right circular cylinders in two ways, thus the ratio of volume between the cylinder equals to:	{"1": "1:5", "2": "2:5", "3": "3:5", "4": "none"}	4	approved
23	1	Find the least number by which 3920 should be multiplied so that the result is a complete square?	{"1": "5", "2": "28", "3": "25", "4": "20"}	2	approved
24	1	The market price of an article is 25% above its selling price and cost price is 30% less than market price. Then the discount percent is:	{"1": "5%", "2": "15%", "3": "20%", "4": "25%"}	3	approved
25	1	If U = {set of all triangles} A = {set of Δ with at least one angle different from 60°}, then A = _______.	{"1": "Isosceles triangle", "2": "Scalene triangle", "3": "Equilateral triangle", "4": "none"}	2	approved
26	1	At what rate percent per annum will a sum of money double itself in 20 years?	{"1": "10%", "2": "7%", "3": "12%", "4": "5%"}	1	approved
27	1	Which of the following is the smallest unit of length?	{"1": "millimeter", "2": "micrometer", "3": "nanometer", "4": "angstrom unit"}	4	approved
28	1	Which of the following elements does not belong to alkali metals?	{"1": "Na", "2": "Li", "3": "Mg", "4": "K"}	3	approved
29	1	Methyl orange gives ____ colour with base.	{"1": "red", "2": "pink", "3": "orange", "4": "yellow"}	4	approved
30	1	Which of the following is common alcohol (wine)?	{"1": "methyl alcohol", "2": "ethyl alcohol", "3": "propyl alcohol", "4": "butyl alcohol"}	2	approved
31	1	Cobalt oxide is added to ordinary glass to make _______ glass.	{"1": "black", "2": "red", "3": "hard", "4": "blue"}	4	approved
32	1	If θ = 22.5° then 2Sinθ.Cosθ = ?	{"1": "Cos²θ - Sin²θ", "2": "1", "3": "0", "4": "none of the above"}	3	approved
33	1	If (1/m) + (1/(m+3)) = a, then what will be the value of m³ + (a-3)?	{"1": "a", "2": "1", "3": "a(a-3)", "4": "none of the above"}	3	approved
34	1	What must be added to (2a + 5b) to get the same result as (b + 2c) subtracted from (4a + b)?	{"1": "2a - 3b", "2": "3a - 4b", "3": "7a - 2b", "4": "2a - 5b - 2c"}	4	approved
35	1	If n = 4n + m and m = -1, then n = ?	{"1": "2n + m", "2": "1", "3": "0", "4": "none of the above"}	3	approved
36	1	If the ratio of two numbers is 5:6 and their product is 120. Find the numbers.	{"1": "10, 12", "2": "12, 10", "3": "20, 6", "4": "40, 3"}	1	approved
37	1	If (a + b + c) = 6 and (ab + bc + ca) = 11, then a³ + b³ + c³ – 3abc is equal to:	{"1": "15", "2": "16", "3": "17", "4": "none"}	2	approved
38	1	A father's age was four times his son's age in 2042 and two times his son's age in 2060. Find the year of birth of the son?	{"1": "2040", "2": "2038", "3": "2035", "4": "2033"}	2	approved
39	1	If the length of the side of a square is reduced by 20%, then the area will be decreased by:	{"1": "36%", "2": "44%", "3": "15%", "4": "20%"}	1	approved
40	1	If a number is chosen at random from the set of natural numbers less than 30, what is the probability that a prime number is picked?	{"1": "10/29", "2": "12/29", "3": "1/29", "4": "0"}	2	approved
41	1	A group of 7 students have their weights in Kg as follows: 5, 12, 16, 5, 8, 12, 5. What is their modal weight?	{"1": "5 Kg", "2": "12 Kg", "3": "15 Kg", "4": "8 Kg"}	1	approved
42	1	In the adjoining figure, below, "O" is the center of the circle, then find ∠ADC if ∠AOB = 100°.	{"1": "50°", "2": "25°", "3": "75°", "4": "200°"}	1	approved
43	1	An isosceles triangle with AB = AC = 10 cm and BC = 12 cm is inscribed in a circle. Find the radius of the circle?	{"1": "6.25 cm", "2": "6.35 cm", "3": "12.5 cm", "4": "10 cm"}	1	approved
44	1	The area of the following geometrical figure is equal to ____ cm².	{"1": "120", "2": "40", "3": "42", "4": "50"}	2	approved
92	1	I am used to _______ late night.	{"1": "read", "2": "reading", "3": "reads", "4": "red"}	2	approved
45	1	What is the radius of a circle if its area and circumference are equal in magnitude?	{"1": "7 unit", "2": "5 unit", "3": "22/7 unit", "4": "2 unit"}	3	approved
46	1	Heart is a muscular organ made of _______ muscles.	{"1": "voluntary", "2": "cardiac", "3": "involuntary", "4": "skeletal"}	2	approved
47	1	Which one of these is not an appropriate method of waste disposal?	{"1": "sanitary landfill", "2": "incineration", "3": "dumping", "4": "piling up at roadside"}	4	approved
48	1	Which one of these is caused by an organism called "Bordetella Pertusis"?	{"1": "tetanus", "2": "whooping cough", "3": "diphtheria", "4": "poliomyelitis"}	2	approved
49	1	One of the objectives of first aid treatment is to _______.	{"1": "save the life of an injured person", "2": "cure a patient", "3": "both of the above", "4": "none of the above"}	1	approved
50	1	Function of vitamin "K" is to _______.	{"1": "improve vision", "2": "blood clotting", "3": "increase blood cell", "4": "improve muscles"}	2	approved
51	1	What is the percentage of water in a normal body weight?	{"1": "60-70", "2": "75-80", "3": "80-90", "4": "85-95"}	1	approved
52	1	Which one of these is not a communicable disease?	{"1": "TB", "2": "Common cold", "3": "Cancer", "4": "Cholera"}	3	approved
53	1	_______ is not a nutrient.	{"1": "Protein", "2": "Medicine", "3": "Vitamin", "4": "Minerals"}	2	approved
54	1	Safe motherhood is not affected by _____.	{"1": "age", "2": "smoking", "3": "weather", "4": "food intake"}	3	approved
55	1	DPT is vaccinated to a child _______ times.	{"1": "1", "2": "2", "3": "3", "4": "4"}	3	approved
56	1	Norplant is a _______.	{"1": "pills", "2": "permanent method of family planning", "3": "Depo-Provera injection", "4": "temporary method of family planning implanted in a mid-arm of a woman"}	4	approved
57	1	Most of the diseases of a community in Nepal can be controlled by _______.	{"1": "improving community environment", "2": "providing clean drinking water", "3": "raising the income level", "4": "providing health services"}	2	approved
58	1	Goiter occurs due to the deficiency of ____.	{"1": "iron", "2": "vitamin", "3": "calcium", "4": "iodine"}	4	approved
59	1	Norplant is a _______.	{"1": "pills", "2": "permanent method of family planning", "3": "Depo-Provera injection", "4": "temporary method of family planning implanted in a mid arm of a woman"}	2	approved
60	1	Most of the disease of a community in Nepal can be controlled by _______.	{"1": "improving community environment", "2": "providing clean drinking water", "3": "raising the income level", "4": "providing health services"}	2	approved
61	1	Goiter occurs due to the deficiency of ____.	{"1": "iron", "2": "vitamin", "3": "calcium", "4": "iodine"}	4	approved
62	1	Full form of AIDS is _______.	{"1": "Acute Immune Deficiency Syndrome", "2": "Acquired Immuno Deficiency Syndrome", "3": "Acquired Immune Deficient Syndrome", "4": "Acquired Immune Deficiency Symptoms"}	2	approved
63	1	Syphilis is caused by _______.	{"1": "Treponema pallidum", "2": "Brodetlla pertusis", "3": "Entamoeba hystolytica", "4": "Corynebacterium diphtheria"}	1	approved
64	1	The most appropriate age group to become pregnant for a woman is _______.	{"1": "15-20 years", "2": "20-25 years", "3": "25-35 years", "4": "35-40 years"}	3	approved
65	1	Which of these is not a female reproductive organ?	{"1": "uterus", "2": "fallopian tube", "3": "scrotum", "4": "cervix"}	3	approved
66	1	Family health is not affected by _______.	{"1": "literacy", "2": "household size", "3": "cultural environment", "4": "geographic environment"}	4	approved
67	1	Which of these is not a micro-organism?	{"1": "virus", "2": "cell", "3": "bacteria", "4": "fungus"}	2	approved
68	1	Nepali people need _______ caloric food on an average a day.	{"1": "2000", "2": "2250", "3": "2500", "4": "2750"}	3	approved
69	1	Human body has _______ pieces of bones.	{"1": "204", "2": "206", "3": "208", "4": "210"}	2	approved
70	1	Cause of population change is _______.	{"1": "birth rate", "2": "immigration", "3": "death rate", "4": "all of above"}	4	approved
71	1	Purification of milk is called _______.	{"1": "sterilization", "2": "pasteurization", "3": "distillation", "4": "filtration"}	2	approved
72	1	Child mortality rate in Nepal is high due to _______.	{"1": "fever", "2": "acute respiratory infection", "3": "tetanus", "4": "all of the above"}	4	approved
73	1	Which of these is not a viral disease?	{"1": "poliomyelitis", "2": "measles", "3": "leprosy", "4": "hepatitis"}	3	approved
74	1	Suman speaks ______ English.	{"1": "fluent", "2": "fluently", "3": "fluency", "4": "flowing"}	2	approved
75	1	He is sitting ____ the table ____ the bench.	{"1": "on, on", "2": "at, on", "3": "at, at", "4": "on, at"}	2	approved
76	1	She is junior ______ me.	{"1": "to", "2": "than", "3": "with", "4": "by"}	1	approved
77	1	They ______ him to cut wood.	{"1": "got", "2": "made", "3": "had", "4": "make"}	3	approved
78	1	The letter was written ______ red ink.	{"1": "in", "2": "with", "3": "on", "4": "by"}	1	approved
79	1	The teacher said to me, "You can do if you try".	{"1": "The teacher told me that she could do if I tried.", "2": "The teacher told me that I could do if I tried.", "3": "The teacher told me that you can do if you try.", "4": "The teacher told me that I can do if I try."}	2	approved
80	1	Their _______ based on facts.	{"1": "information is", "2": "informations are", "3": "information are", "4": "informations is"}	1	approved
81	1	You'd better _______ a doctor.	{"1": "seen", "2": "to see", "3": "see", "4": "seeing"}	3	approved
82	1	I have been teaching English ______ 1999.	{"1": "for", "2": "since", "3": "from", "4": "to"}	2	approved
83	1	The correct spelling is _______.	{"1": "karnel", "2": "colonel", "3": "colonell", "4": "kornel"}	2	approved
84	1	She does not _______ money.	{"1": "has", "2": "have", "3": "had", "4": "gets"}	2	approved
85	1	One of the girls _______ gone out.	{"1": "have", "2": "are", "3": "has", "4": "is"}	3	approved
86	1	The hotter it is, _______ I feel.	{"1": "more miserable", "2": "the more miserable", "3": "the much miserable", "4": "the most miserable"}	2	approved
87	1	Antonym of brave is:	{"1": "coward", "2": "army officer", "3": "greedy", "4": "policeman"}	1	approved
88	1	I am _______ to take revenge.	{"1": "good enough", "2": "enough good", "3": "experienced good", "4": "enough better"}	1	approved
89	1	Had I been born in the USA, I _______ a car.	{"1": "had purchased", "2": "will have purchased", "3": "would purchase", "4": "would have purchased"}	4	approved
90	1	He was not _______ Indian.	{"1": "a", "2": "an", "3": "the", "4": "no article"}	2	approved
91	1	Let us go home, _______?	{"1": "shall we", "2": "will we", "3": "will you", "4": "shall I"}	1	approved
93	1	She is _______ NCC officer.	{"1": "a", "2": "the", "3": "no article", "4": "an"}	4	approved
94	1	The driver is good _______ driving.	{"1": "at", "2": "in", "3": "for", "4": "on"}	1	approved
95	1	She had never _______ by an insect.	{"1": "been stung", "2": "been stunged", "3": "was stung", "4": "been stunged"}	1	approved
96	1	I saw him _______.	{"1": "played", "2": "had played", "3": "play", "4": "to play"}	3	approved
97	1	You will pass the final exam _______ you study hard.	{"1": "because of", "2": "so that", "3": "provided that", "4": "as though"}	3	approved
98	1	In 2020, she ______ in the same school.	{"1": "will be working", "2": "will work", "3": "will have worked", "4": "will be work"}	1	approved
99	1	Astronomical unit (AU) is distance between Earth and Sun. 1 AU =	{"1": "1.496 x 10^8 Km", "2": "9.46 x 10^12 Km", "3": "3.084 x 10^13 Km", "4": "None"}	1	approved
100	1	The magnitude of the sum of the two vectors is equal to the difference of their magnitudes. What is the angle between the vectors?	{"1": "0°", "2": "45°", "3": "90°", "4": "180°"}	4	approved
101	1	A particle is moving on a straight line path with constant acceleration directed along the direction of instantaneous velocity. Which of the following statement is true?	{"1": "Particle may reverse the direction of motion.", "2": "Distance covered = magnitude of displacement.", "3": "Average velocity is less than average speed.", "4": "Average velocity = instantaneous velocity."}	2	approved
102	1	A ball is projected from the top of a tower at an angle 60° with the vertical. What happens to the vertical component of its velocity?	{"1": "Increases continuously.", "2": "Decreases continuously.", "3": "Remains unchanged.", "4": "First decreases and then increases."}	2	approved
119	1	Which of the following expression at pressure represents Charles' law?	{"1": "V α 1/T", "2": "V α 1/T²", "3": "V α T", "4": "V = d"}	3	approved
103	1	A particle moving along a circular path due to a centripetal force having constant magnitude is an example of motion with:	{"1": "Constant speed and velocity.", "2": "Variable speed and velocity.", "3": "Variable speed and constant velocity.", "4": "Constant speed and variable velocity."}	4	approved
104	1	A rod of mass M and length L is lying on a horizontal table. The work done in making it stand on one end will be:	{"1": "MgL", "2": "MgL/2", "3": "MgL/4", "4": "2MgL"}	2	approved
105	1	A body weighs:	{"1": "Very slightly greater at night", "2": "Very slightly less at night.", "3": "Exactly equal at day & night.", "4": "Zero at night."}	2	approved
106	1	Two vessels have different base area. They are filled with water to the same height. If the amount of water in one be 4 times that in the other, then the ratio of pressure on their bottom will be:	{"1": "16:1", "2": "8:1", "3": "4:1", "4": "1:1"}	4	approved
107	1	The speed of light in air is 3 x 10^8 m/s. What will be its speed in diamond whose refractive index is 2.4?	{"1": "3 x 10^8 m/s", "2": "330 m/s", "3": "1.25 x 10^8 m/s", "4": "224 x 10^8 m/s"}	3	approved
108	1	Critical angle for water is:	{"1": "24°", "2": "49°", "3": "42°", "4": "35°"}	3	approved
109	1	The pressure of H2 gas at a gas thermometer is 80cm at 0°C, 110cm at 100°C. At what temperature will it record 95cm pressure?	{"1": "50°C", "2": "75°C", "3": "95°C", "4": "150°C"}	2	approved
110	1	Heat required to raise the temperature of a body through 1°C is known as:	{"1": "Specific heat capacity", "2": "Water equivalent", "3": "Molar specification", "4": "Thermal capacity"}	4	approved
111	1	The diameter of a wire is reduced to half. Now the resistance changes by factor:	{"1": "2", "2": "4", "3": "8", "4": "16"}	4	approved
129	1	A patient is generally advised to consume more meat, lentils, milk and egg when he/she suffers from:	{"1": "Rickets", "2": "Kwashiorkor", "3": "Anaemia", "4": "Scurvy"}	2	approved
130	1	Tetanus disease is:	{"1": "Viral", "2": "Bacterial", "3": "Fungal", "4": "None"}	2	approved
131	1	Kind of epithelium in inner lining of blood vessels?	{"1": "Cuboidal epithelium", "2": "Columnar", "3": "Ciliated columnar", "4": "Squamous epithelium"}	4	approved
132	1	Which part of brain is involved in regulating body temperature?	{"1": "Medulla oblongata", "2": "Cerebrum", "3": "Cerebellum", "4": "Hypothalamus"}	4	approved
133	1	Antibiotic was coined by:	{"1": "Pasteur", "2": "Edward Jenner", "3": "Fleming", "4": "Salman Waksman"}	4	approved
134	1	Not a feature of Annelida?	{"1": "Closed circulatory system", "2": "Segmentation", "3": "Pseudocoelom", "4": "Ventral nerve cord"}	3	approved
135	1	Evolutionary history of organism is:	{"1": "Phylogeny", "2": "Ancestry", "3": "Paleontology", "4": "Ontogeny"}	1	approved
136	1	HIV that caused AIDS first starts destroying:	{"1": "B-Lymphocytes", "2": "Platelets", "3": "Leucocytes", "4": "Helper T-cells"}	4	approved
137	1	Blood calcium level is lowered by deficiency of:	{"1": "Parathormone", "2": "Calcitonin", "3": "Thyroxine", "4": "Both b and c"}	1	approved
138	1	1st healthy mammal to be cloned is:	{"1": "Molly sheep", "2": "Dolly sheep", "3": "Polly sheep", "4": "Monkey"}	2	approved
139	1	Ribosome can also be called:	{"1": "Microsome", "2": "Oxyosome", "3": "Dictyosome", "4": "Ribonucleotide"}	1	approved
140	1	The first transgenic crop is:	{"1": "Tobacco", "2": "Wheat", "3": "Tomato", "4": "Maize"}	1	approved
141	1	Tobacco mosaic virus is:	{"1": "Rod shaped", "2": "Brick shaped", "3": "Spherical", "4": "None"}	1	approved
142	1	Bacterial DNA is identified as:	{"1": "DNA only", "2": "DNA with histone", "3": "DNA without histone", "4": "DNA and RNA"}	3	approved
143	1	Which is sensitive to SO2 pollution?	{"1": "Lichens", "2": "Algae", "3": "Mosses", "4": "Gymnosperms"}	1	approved
144	1	Cause of motility in male gamete is:	{"1": "Phototaxis", "2": "Chemotaxis", "3": "Thermotaxis", "4": "Thermotropism"}	2	approved
145	1	Milk is purified by:	{"1": "Fermentation", "2": "Pasteurisation", "3": "Preservation", "4": "Sterilisation"}	2	approved
146	1	Pollution can bring change in:	{"1": "Abiotic environment", "2": "Biotic environment", "3": "Both a and b", "4": "Animals"}	3	approved
147	1	BOD is:	{"1": "Biological oxygen deficit", "2": "Biosphere oxygen demand", "3": "Biological oxygen demand", "4": "None"}	3	approved
148	1	Which part of cinchona is used as a drug?	{"1": "Bark", "2": "Leaf", "3": "Pericarp", "4": "Endosperm"}	1	approved
149	1	Set A is a proper subset of B if:	{"1": "A-B ⊂ A", "2": "B-A ⊂ B", "3": "A ⊂ B", "4": "A ⊄ B"}	3	approved
150	1	If A and B are two sets containing 10 and 20 distinct elements respectively, then the minimum number of elements in A∪B is:	{"1": "30", "2": "50", "3": "40", "4": "80"}	1	approved
151	1	The value of |sin²θ-cos²θ|:	{"1": "2", "2": "-1", "3": "π", "4": "0"}	1	approved
152	1	The sum of the series Sn = 1² + 2² + 3² + .....n² is:	{"1": "n(n+1)", "2": "n(n+1)(2n+1)/6", "3": "n(n+1)/2", "4": "(n+1)²/2"}	2	approved
153	1	If 6, 18, 24, 162 .....are in G.S. then common ratio r is:	{"1": "12", "2": "9", "3": "3", "4": "7"}	3	approved
154	1	If 2Sin²θ + √3Cosθ + 1 = 0, then θ =	{"1": "150°", "2": "120°", "3": "180°", "4": "90°"}	1	approved
155	1	Let F→R be defined by f(x) = Sin X and g→R be defined by g(x) = x², then g∘f(x) =	{"1": "Sin²x", "2": "2Sinx", "3": "Sinx²", "4": "2Cosx"}	1	approved
156	1	If Cosθ + Secθ = 2, then the value of Sec⁷θ + Cos⁵θ =	{"1": "2", "2": "1", "3": "1/2", "4": "√3"}	2	approved
157	1	If 4 Sin⁻¹x + Cos⁻¹x = π then the value of x is:	{"1": "1", "2": "√3/2", "3": "1/√2", "4": "1/2"}	4	approved
158	1	Find dy/dx, If x = at², y = 2at.	{"1": "t", "2": "t/2", "3": "2/t", "4": "1/t²"}	3	approved
159	1	Find the derivative of e^(2x+3)	{"1": "2e^(2x)", "2": "2e^(2x+3)", "3": "2e^2", "4": "2e^(2x+6)"}	2	approved
114	1	The waste material present in an ore is called:	{"1": "Flux", "2": "Alloy", "3": "Gangue", "4": "Slag"}	3	approved
160	1	For parallel or anti-parallel vectors θ is:	{"1": "0° or 90°", "2": "90° or 180°", "3": "0° or 180°", "4": "180° or 360°"}	3	approved
161	1	If a⃗ = i⃗ + j⃗ - k⃗ and b⃗, c⃗ are any two vectors. Find the angle between two.	{"1": "π/3", "2": "π/4", "3": "π/2", "4": "none"}	4	approved
162	1	For what value of k, 3x² - 4kxy + 5y² = 0 represents a pair of co-incident lines?	{"1": "±2/√15", "2": "±3/√15", "3": "±5/√15", "4": "±4/√15"}	1	approved
163	1	The lines are real and distinct if:	{"1": "h² > ab", "2": "h² < ab", "3": "h² = ab", "4": "none"}	1	approved
164	1	The value of k for which the equation 2x² - 7xy + 3y² - 5x - 5y + k = 0 represents a pair of straight lines?	{"1": "4", "2": "-3", "3": "2", "4": "6"}	1	approved
120	1	Solid CO2 is an example of:	{"1": "Ionic crystal", "2": "Covalent crystal", "3": "Metallic crystal", "4": "Molecular crystal"}	4	approved
165	1	If ax + by + c₁ = 0 and ax + by + c₂ = 0 are two parallel lines, then distance between them is:	{"1": "|c₁-c₂|/√(a²+b²)", "2": "|c₁-c₂|/√a²+b²", "3": "|c₁-c₂|/√(a+b)", "4": "none"}	1	approved
166	1	The equation of tangent to circle x² + y² + 4x - 6y - 13 = 0 at point (3,4) is:	{"1": "3x + 4y = 17", "2": "2x - 7y = 9", "3": "5x + y = 19", "4": "5x + 3y = 1"}	1	approved
167	1	The straight line (x + y + 1) + λ(2x - y - 1) = 0 is perpendicular to the line 2x + 3y - 8 = 0, then λ =	{"1": "7", "2": "-5", "3": "1", "4": "3"}	2	approved
168	1	If a polygon has same number of diagonals as its sides, it is a:	{"1": "pentagon", "2": "Hexagon", "3": "Heptagon", "4": "Octagon"}	3	approved
169	1	A certain pump can drain a fuel 375 gallon tank in 15 minutes. At this rate, how many more minutes would it take to drain a full 600 gallon tank?	{"1": "24", "2": "18", "3": "15", "4": "9"}	4	approved
170	1	From 1985 to 1990, the berry production of bush x increased by 20%. From 1990 to 1995, it increased by 30%. What was percentage increased in berry production over the entire 10 years 1985 to 1995?	{"1": "50%", "2": "53%", "3": "56%", "4": "60%"}	3	approved
171	1	If f(x) = x + 2 and g(x) = x³, then f∘g(1) is:	{"1": "2", "2": "3", "3": "1", "4": "4"}	2	approved
172	1	A business man marked the selling price of an article 20% above the cost price. If he sells the article at 10% discount on marked price, find the profit percentage?	{"1": "8%", "2": "12%", "3": "10%", "4": "14%"}	1	approved
173	1	A women is 6 years younger to her husband and he is 5 times as old as his daughter. If daughter was 7 years old two years back, what is the age of woman?	{"1": "39 years", "2": "45 years", "3": "50 years", "4": "35 years"}	1	approved
174	1	∫7x³/² dx is:	{"1": "14x^(5/2) + c", "2": "14/5x^(5/2) + c", "3": "5/14x^(5/2) + c", "4": "7/2x^(5/2) + c"}	2	approved
175	1	∫dx/x√(x²-1) is:	{"1": "log(√(x²-1)) + c", "2": "2x + c", "3": "2√(x²-1)", "4": "2x² + c"}	1	approved
176	1	In a building with 10 floors, the number of rooms in each floor is R. If each room has C chairs, total chairs in building is:	{"1": "10R + C", "2": "10R + 10C", "3": "10RC", "4": "10/RC"}	3	approved
178	1	Area of triangle with sides x = 0, y = 0 and 4x + 5y = 20 is:	{"1": "20", "2": "10", "3": "5", "4": "1"}	2	approved
179	1	His pocket has been picked. It means:	{"1": "Picked his been his pocket", "2": "They have his pocket picked.", "3": "Someone has picked his pocket.", "4": "Picking has been done to his pocket."}	3	approved
180	1	More serious from the parent's point of view than the increasing expenditure on children's education is finding a good school. The more serious thing is:	{"1": "The parent's point of view", "2": "finding a good school", "3": "Children's education", "4": "increasing education"}	2	approved
181	1	Here's my report ----- it at last.	{"1": "I finish", "2": "I finished", "3": "I've finished", "4": "I'm finished"}	3	approved
182	1	Your parents are very upset with you and you are regretting over the wrong doing.	{"1": "I wish they would understand me", "2": "I wish I could tell them the truth", "3": "I wish I hadn't disobeyed them", "4": "I wish they were happy"}	3	approved
183	1	He gave up ............	{"1": "Smoke", "2": "to smoke", "3": "Smoking", "4": "to smoke"}	3	approved
184	1	The professor and psychologist......... come.	{"1": "has", "2": "have", "3": "has", "4": "was"}	2	approved
185	1	Where's Robert? ........ a shower?	{"1": "Does he have", "2": "Has he", "3": "Has he got", "4": "Is he having"}	4	approved
186	1	An Englishman killed his mother for trying to save an Indian's life. The person trying to save the Indian's life..........	{"1": "was an English woman", "2": "was saved", "3": "was Killed", "4": "was an Indian"}	1	approved
187	1	I didn't use to smoke in the past but these days I'm used to.......	{"1": "Smoke", "2": "smokes", "3": "Smoked", "4": "smoking"}	4	approved
188	1	Indirect speech of: She said. "Good bye, my friend."	{"1": "She told her friends good bye.", "2": "She bade good bye to her friends.", "3": "She shouted good bye to her friends.", "4": "She shouted good bye to her friends."}	2	approved
189	1	Fate smiles...... him in all his ventures.	{"1": "upon", "2": "at", "3": "with", "4": "for"}	1	approved
190	1	The downfall of this dictatorial regime is ...	{"1": "imminent", "2": "eminent", "3": "urgent", "4": "optional"}	1	approved
191	1	Unexpected change in somebody's fortune is called:	{"1": "Vicissitude", "2": "Verisimilitude", "3": "Fortunate", "4": "Catastrophe"}	1	approved
192	1	It's time to take tea. It means .............	{"1": "tea should be taken", "2": "tea is to be taken", "3": "it's time for tea to be taken", "4": "tea should be taken now"}	4	approved
193	1	When I looked round the door, the baby ......... quietly.	{"1": "is sleeping", "2": "slept", "3": "was sleeping", "4": "were sleeping"}	3	approved
194	1	......... a party next Friday. We've sent out the invitations.	{"1": "We had", "2": "We have", "3": "We'll have", "4": "We are having"}	4	approved
195	1	By 2020, I..... Bachelor's in science.	{"1": "complete", "2": "am completing", "3": "will complete", "4": "will have completed"}	4	approved
196	1	Julia was out of breath because .........	{"1": "she had been running", "2": "She did run", "3": "she's been running", "4": "she's run"}	1	approved
197	1	This house is ...of the two.	{"1": "the best", "2": "the better that", "3": "the better", "4": "better"}	3	approved
198	1	At this time tomorrow....... Over the Pacific Ocean.	{"1": "we flying", "2": "we'll fly", "3": "we'll be flying", "4": "we to fly"}	3	approved
199	1	What is the brain of a computer?	{"1": "RAM", "2": "CPU", "3": "Hard Disk", "4": "Monitor"}	2	approved
112	1	Who discovered electron?	{"1": "Thomson", "2": "Goldstein", "3": "Rutherford", "4": "Chadwick"}	1	approved
113	1	Which of the following is called red planet?	{"1": "Venus", "2": "Mercury", "3": "Mars", "4": "Jupiter"}	3	approved
115	1	Vapour density of a gas is 22. Its molecular weight will be:	{"1": "33", "2": "22", "3": "44", "4": "11"}	3	approved
116	1	If 30g of Mg and 30g of O2 are reacted, then the residual mixture contains:	{"1": "40g MgO + 20g O2", "2": "45g MgO + 15g O2", "3": "50g MgO + 10g O2", "4": "60g MgO only"}	3	approved
117	1	Which of the following set of quantum number is not possible?	{"1": "n = 2, l = 1, m = 0, s = +1/2", "2": "n = 2, l = 2, m = +1, s = -1/2", "3": "n = 2, l = 1, m = -1, s = +1/2", "4": "n = 2, l = 1, m = 0, s = -1/2"}	2	approved
118	1	Radioactivity was discovered by:	{"1": "Henry Becquerel", "2": "Rutherford", "3": "J.J Thompson", "4": "Madam Curie"}	1	approved
121	1	Which bond has maximum M.P. and B.P?	{"1": "Ionic", "2": "Covalent", "3": "CO-ordinate covalent", "4": "Hydrogen bond"}	1	approved
122	1	The atomic no. of an element is 38. In which block does it lie?	{"1": "s-block", "2": "p-block", "3": "d-block", "4": "f-block"}	1	approved
123	1	During fermentation of glucose the enzyme used is:	{"1": "Zymase", "2": "Lipase", "3": "Invertase", "4": "Amylase"}	1	approved
124	1	What is the empirical formula of a hydrocarbon containing 75% carbon?	{"1": "C2H4", "2": "CH4", "3": "C3H9", "4": "C2H6"}	2	approved
125	1	Example of amphoteric oxide is:	{"1": "SO2", "2": "Na2O", "3": "ZnO", "4": "NO"}	3	approved
126	1	Colour pigments can be separated by:	{"1": "Filtration", "2": "Distillation", "3": "Chromatography", "4": "Sublimation"}	3	approved
127	1	Which one is manufactured from sea weeds?	{"1": "F2", "2": "I2", "3": "Cl2", "4": "Br2"}	2	approved
128	1	The gas used in welding of iron or steel is:	{"1": "Methane", "2": "Ethane", "3": "Ethylene", "4": "Acetylene"}	4	approved
200	1	Which planet is known as the Red Planet?	{"1": "Earth", "2": "Mars", "3": "Jupiter", "4": "Venus"}	2	approved
201	1	Who wrote the national anthem of India?	{"1": "Rabindranath Tagore", "2": "Mahatma Gandhi", "3": "Jawaharlal Nehru", "4": "Subhash Chandra Bose"}	1	approved
202	1	What is the capital city of Nepal?	{"1": "Pokhara", "2": "Kathmandu", "3": "Lalitpur", "4": "Bhaktapur"}	2	approved
203	1	Which gas is essential for us to breathe?	{"1": "Carbon Dioxide", "2": "Hydrogen", "3": "Oxygen", "4": "Nitrogen"}	3	approved
204	1	Who was the first man to walk on the Moon?	{"1": "Neil Armstrong", "2": "Yuri Gagarin", "3": "Buzz Aldrin", "4": "Michael Collins"}	1	approved
205	1	What is the largest mammal in the world?	{"1": "Elephant", "2": "Blue Whale", "3": "Giraffe", "4": "Hippopotamus"}	2	approved
206	1	In which continent is the Sahara Desert located?	{"1": "Asia", "2": "Africa", "3": "Australia", "4": "South America"}	2	approved
207	1	Who is the current Secretary-General of the United Nations (as of 2024)?	{"1": "Ban Ki-moon", "2": "Antonio Guterres", "3": "Kofi Annan", "4": "Tedros Adhanom"}	2	approved
208	1	Which country is known as the Land of the Rising Sun?	{"1": "China", "2": "Nepal", "3": "Japan", "4": "Thailand"}	3	approved
209	1	What is the smallest prime number?	{"1": "0", "2": "1", "3": "2", "4": "3"}	3	approved
210	1	Which organ purifies our blood?	{"1": "Lungs", "2": "Heart", "3": "Kidney", "4": "Liver"}	3	approved
211	1	What is the boiling point of water in Celsius?	{"1": "100", "2": "0", "3": "50", "4": "120"}	1	approved
212	1	Which festival is known as the festival of lights?	{"1": "Holi", "2": "Diwali", "3": "Eid", "4": "Christmas"}	2	approved
213	1	Who discovered gravity?	{"1": "Einstein", "2": "Galileo", "3": "Newton", "4": "Faraday"}	3	approved
214	1	How many continents are there?	{"1": "5", "2": "6", "3": "7", "4": "8"}	3	approved
215	1	Which bird is known for its mimicry of human speech?	{"1": "Crow", "2": "Sparrow", "3": "Parrot", "4": "Peacock"}	3	approved
216	1	Which metal is liquid at room temperature?	{"1": "Iron", "2": "Mercury", "3": "Gold", "4": "Silver"}	2	approved
217	1	What color do you get when you mix red and blue?	{"1": "Green", "2": "Purple", "3": "Brown", "4": "Pink"}	2	approved
218	1	Which vitamin is known as the sunshine vitamin?	{"1": "Vitamin A", "2": "Vitamin C", "3": "Vitamin D", "4": "Vitamin B"}	3	approved
219	1	Which is the largest ocean in the world?	{"1": "Atlantic Ocean", "2": "Indian Ocean", "3": "Arctic Ocean", "4": "Pacific Ocean"}	4	approved
\.


--
-- Data for Name: mock_tests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mock_tests (id, title, time_limit, question_count) FROM stdin;
1	Digital Logic	10	10
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, actor_id, message, type, meta, is_read, created_at) FROM stdin;
2	1	69	You were mentioned by Bijay Rauniyar in the discussion of "Digital Logic"	discussion	{"stream_id": 1, "mock_test_id": 1}	f	2025-09-03 17:45:01.537+00
3	19	72	You were mentioned by Bijay Rauniyar in the discussion of "Digital Logic"	discussion	{"stream_id": 1, "mock_test_id": 1}	t	2025-09-05 06:39:16.507+00
4	19	72	You were mentioned by Bijay Rauniyar in the discussion of "Digital Logic"	discussion	{"stream_id": 1, "mock_test_id": 1}	t	2025-12-20 16:04:55.262+00
5	19	72	You were mentioned by Bijay Rauniyar in the discussion of "Digital Logic"	discussion	{"stream_id": 1, "mock_test_id": 1}	t	2025-12-20 16:05:05.306+00
\.


--
-- Data for Name: question_flags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.question_flags (id, question_id, user_id, reason, created_at) FROM stdin;
1	1	19	test	2025-12-27 17:33:24.378+00
2	2	19	test	2025-12-27 17:34:03.857+00
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, user_id, mock_test_id, review, rating, created_at) FROM stdin;
21	1	1	Good.	2	2025-05-27 17:50:02.683377+00
22	2	1	Decent mock test.	1.5	2025-05-27 17:50:02.683377+00
25	3	1	This mock test had a great range of questions, and it helped me identify some weaknesses.	1	2025-05-27 17:50:02.683377+00
31	19	1	This was an excellent mock test! It covered all the key topics comprehensively and included a mix of easy, medium, and difficult questions. The explanations for each answer were detailed and extremely helpful, making it a valuable resource for my exam preparation.	4.5	2025-05-27 17:50:02.683377+00
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sections (id, name, question_weight, marks_per_question, negative_marking) FROM stdin;
1	Main	1	1	0
\.


--
-- Data for Name: streams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.streams (id, name) FROM stdin;
1	BCA
2	+2 Entrance
\.


--
-- Data for Name: test_attempts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.test_attempts (id, user_id, mock_test_id, question_ids, started_at, expires_at, submitted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: test_section_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.test_section_links (mock_test_id, section_id) FROM stdin;
1	1
\.


--
-- Data for Name: user_attempt_details; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_attempt_details (id, user_score_id, question_id, selected_option, status, created_at) FROM stdin;
14	1337	100	\N	unanswered	2026-01-15 17:14:05.344+00
15	1337	101	1	incorrect	2026-01-15 17:14:05.344+00
16	1337	102	\N	unanswered	2026-01-15 17:14:05.344+00
17	1337	103	\N	unanswered	2026-01-15 17:14:05.344+00
18	1337	104	\N	unanswered	2026-01-15 17:14:05.344+00
19	1337	105	\N	unanswered	2026-01-15 17:14:05.344+00
20	1337	108	\N	unanswered	2026-01-15 17:14:05.344+00
21	1337	109	\N	unanswered	2026-01-15 17:14:05.344+00
22	1337	110	\N	unanswered	2026-01-15 17:14:05.344+00
23	1337	111	2	incorrect	2026-01-15 17:14:05.344+00
\.


--
-- Data for Name: user_responses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_responses (id, attempt_id, question_id, answer, is_flagged, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_scores; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_scores (id, user_id, mock_test_id, score, question_count, full_marks, time_limit, section_scores, unanswered_questions, elapsed_time, created_at, mode, status) FROM stdin;
682	1	1	0	10	10	10	{"1": {"99": 3, "102": null, "103": null, "104": null, "105": null, "106": null, "107": null, "108": null, "109": null, "110": null}}	9	7	2026-02-20 02:07:57.110341+00	practice	completed
687	19	1	7	10	10	10	{}	0	219	2026-02-20 01:01:09.415673+00	practice	completed
688	19	1	1	10	10	10	{}	0	432	2026-02-20 00:39:21.810082+00	ranked	completed
689	2	1	8	10	10	10	{}	0	482	2026-02-20 06:29:46.396814+00	practice	completed
690	1	1	8	10	10	10	{}	0	271	2026-02-20 15:33:48.686556+00	practice	completed
691	4	1	10	10	10	10	{}	0	219	2026-02-19 19:38:34.545621+00	practice	completed
692	1	1	2	10	10	10	{}	0	471	2026-02-20 02:34:05.85421+00	ranked	completed
693	19	1	9	10	10	10	{}	0	366	2026-02-19 19:15:47.423547+00	ranked	completed
694	4	1	8	10	10	10	{}	0	273	2026-02-19 19:29:15.757972+00	practice	completed
695	2	1	8	10	10	10	{}	0	534	2026-02-20 02:15:14.131905+00	practice	completed
696	2	1	2	10	10	10	{}	0	441	2026-02-20 08:48:39.817213+00	ranked	completed
697	1	1	5	10	10	10	{}	0	222	2026-02-20 03:34:06.580816+00	practice	completed
703	3	1	2	10	10	10	{}	0	458	2026-02-19 21:03:34.145131+00	practice	completed
704	19	1	3	10	10	10	{}	0	531	2026-02-19 23:04:57.334996+00	practice	completed
710	19	1	7	10	10	10	{}	0	587	2026-02-19 20:51:17.138147+00	practice	completed
711	3	1	5	10	10	10	{}	0	544	2026-02-20 00:37:22.191099+00	practice	completed
712	2	1	5	10	10	10	{}	0	326	2026-02-20 18:01:56.418296+00	practice	completed
713	4	1	4	10	10	10	{}	0	430	2026-02-20 06:06:10.232447+00	ranked	completed
714	2	1	5	10	10	10	{}	0	247	2026-02-20 14:17:19.308784+00	practice	completed
715	1	1	2	10	10	10	{}	0	536	2026-02-19 21:25:48.469352+00	ranked	completed
716	1	1	8	10	10	10	{}	0	493	2026-02-20 03:35:43.225633+00	ranked	completed
717	19	1	7	10	10	10	{}	0	315	2026-02-19 22:36:48.319388+00	ranked	completed
718	1	1	7	10	10	10	{}	0	338	2026-02-20 07:38:43.384274+00	ranked	completed
719	4	1	2	10	10	10	{}	0	589	2026-02-20 07:00:54.889665+00	ranked	completed
720	1	1	10	10	10	10	{}	0	271	2026-02-20 04:45:36.075804+00	ranked	completed
721	19	1	7	10	10	10	{}	0	459	2026-02-19 23:47:19.701935+00	ranked	completed
722	2	1	10	10	10	10	{}	0	337	2026-02-19 22:57:03.453561+00	practice	completed
723	3	1	2	10	10	10	{}	0	304	2026-02-20 08:22:46.903537+00	practice	completed
724	19	1	8	10	10	10	{}	0	437	2026-02-20 13:35:36.303154+00	practice	completed
725	3	1	2	10	10	10	{}	0	298	2026-02-20 02:11:04.901631+00	ranked	completed
726	4	1	4	10	10	10	{}	0	395	2026-02-19 19:13:15.268928+00	practice	completed
727	4	1	9	10	10	10	{}	0	214	2026-02-20 05:55:36.267614+00	practice	completed
728	19	1	8	10	10	10	{}	0	399	2026-02-20 03:28:25.353444+00	practice	completed
729	3	1	4	10	10	10	{}	0	599	2026-02-20 15:56:42.582808+00	practice	completed
730	19	1	6	10	10	10	{}	0	384	2026-02-20 16:15:38.661391+00	ranked	completed
731	2	1	9	10	10	10	{}	0	240	2026-02-20 11:53:11.501112+00	practice	completed
732	2	1	8	10	10	10	{}	0	352	2026-02-19 20:50:48.910545+00	ranked	completed
733	3	1	8	10	10	10	{}	0	430	2026-02-20 12:59:56.997508+00	ranked	completed
734	4	1	9	10	10	10	{}	0	249	2026-02-20 01:22:03.614766+00	practice	completed
735	3	1	3	10	10	10	{}	0	283	2026-02-19 22:54:11.607753+00	ranked	completed
736	19	1	6	10	10	10	{}	0	417	2026-02-20 04:08:41.893398+00	practice	completed
737	4	1	9	10	10	10	{}	0	394	2026-02-20 03:45:14.648495+00	practice	completed
738	19	1	7	10	10	10	{}	0	422	2026-02-20 06:03:47.865684+00	ranked	completed
739	4	1	9	10	10	10	{}	0	488	2026-02-20 06:06:36.036425+00	ranked	completed
740	4	1	6	10	10	10	{}	0	246	2026-02-19 21:30:19.361673+00	ranked	completed
741	4	1	5	10	10	10	{}	0	430	2026-02-20 03:45:55.240991+00	ranked	completed
742	4	1	4	10	10	10	{}	0	476	2026-02-20 04:10:04.936724+00	ranked	completed
743	19	1	9	10	10	10	{}	0	565	2026-02-20 03:16:38.312222+00	practice	completed
744	19	1	3	10	10	10	{}	0	329	2026-02-19 18:55:59.01762+00	practice	completed
745	19	1	6	10	10	10	{}	0	267	2026-02-20 07:05:52.928523+00	ranked	completed
746	4	1	9	10	10	10	{}	0	242	2026-02-20 08:52:59.764351+00	ranked	completed
747	2	1	10	10	10	10	{}	0	592	2026-02-20 17:46:42.194687+00	practice	completed
748	2	1	2	10	10	10	{}	0	402	2026-02-20 13:38:20.935716+00	ranked	completed
749	1	1	3	10	10	10	{}	0	432	2026-02-19 23:58:18.851701+00	practice	completed
750	19	1	7	10	10	10	{}	0	288	2026-02-20 17:07:33.368273+00	ranked	completed
751	2	1	5	10	10	10	{}	0	507	2026-02-20 06:13:42.255267+00	practice	completed
752	3	1	3	10	10	10	{}	0	430	2026-02-20 00:14:04.717763+00	ranked	completed
753	3	1	4	10	10	10	{}	0	238	2026-02-19 23:25:34.113873+00	ranked	completed
754	3	1	9	10	10	10	{}	0	369	2026-02-20 00:56:48.259929+00	ranked	completed
755	1	1	2	10	10	10	{}	0	507	2026-02-20 06:24:05.464286+00	ranked	completed
756	4	1	4	10	10	10	{}	0	472	2026-02-20 09:19:44.337082+00	practice	completed
757	1	1	7	10	10	10	{}	0	406	2026-02-20 01:54:21.223227+00	practice	completed
758	2	1	1	10	10	10	{}	0	463	2026-02-20 10:08:55.350451+00	ranked	completed
759	4	1	9	10	10	10	{}	0	353	2026-02-20 07:00:10.067808+00	ranked	completed
760	4	1	2	10	10	10	{}	0	426	2026-02-20 15:31:36.439641+00	ranked	completed
761	19	1	3	10	10	10	{}	0	265	2026-02-20 08:39:08.318076+00	ranked	completed
762	4	1	8	10	10	10	{}	0	552	2026-02-19 23:33:30.42612+00	ranked	completed
763	3	1	1	10	10	10	{}	0	480	2026-02-20 06:03:49.717146+00	ranked	completed
764	2	1	6	10	10	10	{}	0	327	2026-02-19 18:48:31.933141+00	practice	completed
765	2	1	10	10	10	10	{}	0	432	2026-02-19 21:43:56.936392+00	ranked	completed
766	2	1	4	10	10	10	{}	0	386	2026-02-20 15:28:30.970501+00	practice	completed
767	19	1	6	10	10	10	{}	0	579	2026-02-19 18:44:49.601013+00	practice	completed
768	4	1	1	10	10	10	{}	0	269	2026-02-19 19:43:49.339281+00	ranked	completed
769	19	1	8	10	10	10	{}	0	474	2026-02-19 21:07:42.641045+00	ranked	completed
770	3	1	10	10	10	10	{}	0	429	2026-02-19 19:37:00.135928+00	practice	completed
771	3	1	3	10	10	10	{}	0	473	2026-02-20 01:23:03.600247+00	ranked	completed
772	4	1	3	10	10	10	{}	0	253	2026-02-20 16:01:12.675782+00	ranked	completed
773	1	1	6	10	10	10	{}	0	228	2026-02-20 12:55:38.948825+00	practice	completed
774	19	1	2	10	10	10	{}	0	514	2026-02-20 12:32:59.575735+00	ranked	completed
775	1	1	9	10	10	10	{}	0	259	2026-02-20 13:03:34.98683+00	ranked	completed
776	1	1	3	10	10	10	{}	0	309	2026-02-20 03:04:04.830553+00	practice	completed
777	3	1	10	10	10	10	{}	0	395	2026-02-20 17:27:51.029429+00	ranked	completed
778	19	1	10	10	10	10	{}	0	228	2026-02-20 18:03:51.386895+00	ranked	completed
779	1	1	6	10	10	10	{}	0	497	2026-02-20 04:53:29.827049+00	ranked	completed
780	3	1	2	10	10	10	{}	0	367	2026-02-20 03:19:22.407196+00	practice	completed
781	3	1	4	10	10	10	{}	0	276	2026-02-20 03:49:24.086729+00	ranked	completed
782	4	1	1	10	10	10	{}	0	436	2026-02-20 16:43:01.533901+00	practice	completed
783	19	1	7	10	10	10	{}	0	332	2026-02-19 23:13:16.311319+00	practice	completed
784	4	1	9	10	10	10	{}	0	531	2026-02-20 03:28:44.90939+00	practice	completed
785	1	1	7	10	10	10	{}	0	584	2026-02-20 10:26:38.941859+00	ranked	completed
786	4	1	1	10	10	10	{}	0	593	2026-02-20 09:48:27.471784+00	practice	completed
787	3	1	5	10	10	10	{}	0	451	2026-02-20 05:01:23.498635+00	ranked	completed
788	1	1	9	10	10	10	{}	0	443	2026-02-20 16:20:25.551208+00	practice	completed
789	19	1	2	10	10	10	{}	0	319	2026-02-19 22:46:43.122531+00	practice	completed
790	19	1	9	10	10	10	{}	0	220	2026-02-20 17:21:37.227497+00	ranked	completed
791	19	1	6	10	10	10	{}	0	442	2026-02-20 15:08:59.839319+00	practice	completed
792	19	1	7	10	10	10	{}	0	570	2026-02-20 04:44:52.58856+00	practice	completed
793	3	1	2	10	10	10	{}	0	424	2026-02-20 15:23:25.815053+00	ranked	completed
794	2	1	7	10	10	10	{}	0	475	2026-02-19 19:33:46.820956+00	ranked	completed
795	3	1	6	10	10	10	{}	0	478	2026-02-20 17:11:23.58332+00	practice	completed
796	1	1	3	10	10	10	{}	0	430	2026-02-20 03:29:38.545619+00	practice	completed
797	19	1	7	10	10	10	{}	0	580	2026-02-20 01:09:35.4264+00	practice	completed
798	2	1	7	10	10	10	{}	0	362	2026-02-20 12:21:08.962297+00	ranked	completed
799	3	1	4	10	10	10	{}	0	360	2026-02-20 01:02:35.666797+00	ranked	completed
800	4	1	6	10	10	10	{}	0	376	2026-02-20 04:16:10.122454+00	practice	completed
801	2	1	6	10	10	10	{}	0	578	2026-02-20 06:09:52.828992+00	practice	completed
802	2	1	8	10	10	10	{}	0	515	2026-02-19 20:54:35.490188+00	ranked	completed
803	19	1	7	10	10	10	{}	0	520	2026-02-19 21:36:21.108951+00	practice	completed
804	2	1	7	10	10	10	{}	0	216	2026-02-20 06:38:05.056472+00	practice	completed
805	2	1	6	10	10	10	{}	0	595	2026-02-19 22:49:18.728229+00	practice	completed
806	4	1	7	10	10	10	{}	0	295	2026-02-20 12:26:52.363676+00	practice	completed
807	19	1	9	10	10	10	{}	0	487	2026-02-20 12:18:40.598417+00	practice	completed
808	19	1	5	10	10	10	{}	0	521	2026-02-20 11:44:19.980816+00	practice	completed
809	4	1	5	10	10	10	{}	0	462	2026-02-20 07:25:21.618452+00	practice	completed
810	19	1	5	10	10	10	{}	0	461	2026-02-20 04:49:52.980636+00	practice	completed
811	2	1	3	10	10	10	{}	0	419	2026-02-20 03:04:21.124558+00	ranked	completed
812	1	1	4	10	10	10	{}	0	532	2026-02-20 05:55:44.979463+00	ranked	completed
813	2	1	2	10	10	10	{}	0	396	2026-02-19 21:17:11.277456+00	practice	completed
814	19	1	1	10	10	10	{}	0	442	2026-02-20 08:08:17.283034+00	practice	completed
815	19	1	8	10	10	10	{}	0	343	2026-02-20 03:01:46.535755+00	ranked	completed
816	1	1	8	10	10	10	{}	0	219	2026-02-19 18:55:31.949722+00	practice	completed
817	3	1	9	10	10	10	{}	0	350	2026-02-19 19:05:35.113678+00	practice	completed
818	19	1	2	10	10	10	{}	0	417	2026-02-19 19:04:10.631843+00	ranked	completed
819	3	1	5	10	10	10	{}	0	315	2026-02-20 09:12:36.456043+00	practice	completed
820	2	1	3	10	10	10	{}	0	208	2026-02-20 07:04:28.985822+00	ranked	completed
821	19	1	8	10	10	10	{}	0	287	2026-02-20 08:28:10.53365+00	practice	completed
822	2	1	2	10	10	10	{}	0	398	2026-02-20 04:12:47.481092+00	ranked	completed
823	4	1	6	10	10	10	{}	0	600	2026-02-20 10:24:25.147048+00	ranked	completed
824	4	1	2	10	10	10	{}	0	576	2026-02-20 07:08:17.762598+00	practice	completed
825	4	1	3	10	10	10	{}	0	361	2026-02-20 09:09:10.523119+00	practice	completed
826	4	1	6	10	10	10	{}	0	396	2026-02-19 22:36:50.815398+00	practice	completed
827	1	1	2	10	10	10	{}	0	333	2026-02-20 01:51:45.490719+00	ranked	completed
828	19	1	7	10	10	10	{}	0	244	2026-02-20 01:47:04.929106+00	ranked	completed
829	3	1	7	10	10	10	{}	0	586	2026-02-20 08:18:44.902454+00	practice	completed
830	19	1	9	10	10	10	{}	0	473	2026-02-20 02:43:44.212401+00	practice	completed
831	2	1	6	10	10	10	{}	0	295	2026-02-20 00:44:40.772361+00	practice	completed
832	4	1	6	10	10	10	{}	0	443	2026-02-20 06:02:39.153115+00	ranked	completed
833	2	1	8	10	10	10	{}	0	451	2026-02-19 20:02:03.931421+00	practice	completed
834	1	1	3	10	10	10	{}	0	353	2026-02-20 18:02:57.149079+00	practice	completed
835	1	1	8	10	10	10	{}	0	340	2026-02-20 04:16:37.097975+00	ranked	completed
836	3	1	6	10	10	10	{}	0	532	2026-02-20 11:50:39.021673+00	practice	completed
698	3	1	2	10	10	10	{}	0	352	2026-02-20 10:12:46.461036+00	ranked	completed
699	3	1	3	10	10	10	{}	0	457	2026-02-20 10:26:44.616261+00	ranked	completed
700	2	1	7	10	10	10	{}	0	357	2026-02-20 00:12:41.417195+00	ranked	completed
701	3	1	5	10	10	10	{}	0	306	2026-02-19 22:05:13.751767+00	ranked	completed
702	4	1	5	10	10	10	{}	0	386	2026-02-20 16:55:07.609595+00	practice	completed
705	3	1	4	10	10	10	{}	0	580	2026-02-20 16:49:55.939306+00	ranked	completed
706	4	1	8	10	10	10	{}	0	562	2026-02-20 06:01:14.944239+00	ranked	completed
707	3	1	6	10	10	10	{}	0	579	2026-02-20 04:55:30.215802+00	ranked	completed
708	4	1	10	10	10	10	{}	0	340	2026-02-19 22:09:52.12189+00	ranked	completed
709	19	1	8	10	10	10	{}	0	322	2026-02-20 13:38:38.376499+00	ranked	completed
1337	1	1	0	10	0	10	{"1": {"100": null, "101": 1, "102": null, "103": null, "104": null, "105": null, "108": null, "109": null, "110": null, "111": 2}}	8	24	2026-02-20 09:27:07.101902+00	ranked	completed
\.


--
-- Data for Name: user_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_settings (id, user_id, settings, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, number, bio, avatar, blob_name, oauth_provider, verified, created_at, updated_at) FROM stdin;
2	Ram Acharya	ram.acharya@example.com	$2a$10$sNW67ojdyWR5V.G/WAWn2euwYyjbLatQqwpCvZhXHwPKx0wFZpMT2	\N	\N	\N	\N	local	t	2025-05-06 13:06:38.009659+00	2025-05-06 13:06:38.009659+00
3	Gita Sharma	gita.sharma@example.com	$2a$10$sNW67ojdyWR5V.G/WAWn2euwYyjbLatQqwpCvZhXHwPKx0wFZpMT2	\N	\N	\N	\N	local	t	2025-05-06 13:06:38.009659+00	2025-05-06 13:06:38.009659+00
4	Hari Thapa	hari.thapa@example.com	$2a$10$sNW67ojdyWR5V.G/WAWn2euwYyjbLatQqwpCvZhXHwPKx0wFZpMT2	\N	\N	\N	\N	local	t	2025-05-06 13:06:38.009659+00	2025-05-06 13:06:38.009659+00
19	Pabitra Khadka	pabitra.khadka@example.com	$2a$10$sNW67ojdyWR5V.G/WAWn2euwYyjbLatQqwpCvZhXHwPKx0wFZpMT2	\N	Full-time student, part-time procrastinator 😅✏️\r\nLearning today, leading tomorrow 🎓🚀	https://mocksewa.blob.core.windows.net/profile-pics/users/1747570690510-wallpaper.webp	users/1747570690510-wallpaper.webp	local	t	2025-05-06 13:06:38.009659+00	2025-05-18 18:45:14.651+00
1	Sita Koirala	sita.koirala@example.com	$2a$10$sNW67ojdyWR5V.G/WAWn2euwYyjbLatQqwpCvZhXHwPKx0wFZpMT2	\N	I am a aspirant yoo	https://mocksewa.blob.core.windows.net/profile-pics/users/1748633715763-wallpaper.webp	users/1748633715763-wallpaper.webp	local	t	2025-05-06 13:06:38.009659+00	2025-05-30 19:35:15.897+00
\.


--
-- Name: bookmarks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookmarks_id_seq', 42, true);


--
-- Name: challenge_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.challenge_participants_id_seq', 4, true);


--
-- Name: challenges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.challenges_id_seq', 3, true);


--
-- Name: daily_challenges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.daily_challenges_id_seq', 1, false);


--
-- Name: discussions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.discussions_id_seq', 981, true);


--
-- Name: history_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.history_questions_id_seq', 1, false);


--
-- Name: mcq_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mcq_questions_id_seq', 219, true);


--
-- Name: mock_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mock_tests_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 5, true);


--
-- Name: question_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.question_flags_id_seq', 2, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 32, true);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sections_id_seq', 1, false);


--
-- Name: streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.streams_id_seq', 2, true);


--
-- Name: test_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.test_attempts_id_seq', 1, false);


--
-- Name: user_attempt_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_attempt_details_id_seq', 23, true);


--
-- Name: user_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_responses_id_seq', 1, false);


--
-- Name: user_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_scores_id_seq', 1337, true);


--
-- Name: user_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_settings_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 72, true);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: challenge_participants challenge_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenge_participants
    ADD CONSTRAINT challenge_participants_pkey PRIMARY KEY (id);


--
-- Name: challenge_questions challenge_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenge_questions
    ADD CONSTRAINT challenge_questions_pkey PRIMARY KEY (challenge_id, question_id);


--
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- Name: daily_challenges daily_challenges_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key1 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key10 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key11 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key12 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key13 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key14 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key15 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key16 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key17 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key2 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key3 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key4 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key5 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key6 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key7 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key8 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_date_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_date_key9 UNIQUE (date);


--
-- Name: daily_challenges daily_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_pkey PRIMARY KEY (id);


--
-- Name: discussions discussions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussions
    ADD CONSTRAINT discussions_pkey PRIMARY KEY (id);


--
-- Name: history_questions history_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.history_questions
    ADD CONSTRAINT history_questions_pkey PRIMARY KEY (id);


--
-- Name: mcq_questions mcq_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mcq_questions
    ADD CONSTRAINT mcq_questions_pkey PRIMARY KEY (id);


--
-- Name: mock_tests mock_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mock_tests
    ADD CONSTRAINT mock_tests_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: question_flags question_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_flags
    ADD CONSTRAINT question_flags_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: streams streams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT streams_pkey PRIMARY KEY (id);


--
-- Name: test_attempts test_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_attempts
    ADD CONSTRAINT test_attempts_pkey PRIMARY KEY (id);


--
-- Name: test_section_links test_section_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_section_links
    ADD CONSTRAINT test_section_links_pkey PRIMARY KEY (mock_test_id, section_id);


--
-- Name: user_attempt_details user_attempt_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_attempt_details
    ADD CONSTRAINT user_attempt_details_pkey PRIMARY KEY (id);


--
-- Name: user_responses user_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_responses
    ADD CONSTRAINT user_responses_pkey PRIMARY KEY (id);


--
-- Name: user_scores user_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_scores
    ADD CONSTRAINT user_scores_pkey PRIMARY KEY (id);


--
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bookmarks bookmarks_mock_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_mock_test_id_fkey FOREIGN KEY (mock_test_id) REFERENCES public.mock_tests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: challenge_participants challenge_participants_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenge_participants
    ADD CONSTRAINT challenge_participants_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: challenge_participants challenge_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenge_participants
    ADD CONSTRAINT challenge_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: challenge_questions challenge_questions_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenge_questions
    ADD CONSTRAINT challenge_questions_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: challenge_questions challenge_questions_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenge_questions
    ADD CONSTRAINT challenge_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.mcq_questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: discussions discussions_mock_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussions
    ADD CONSTRAINT discussions_mock_test_id_fkey FOREIGN KEY (mock_test_id) REFERENCES public.mock_tests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: discussions discussions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussions
    ADD CONSTRAINT discussions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: history_questions history_questions_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.history_questions
    ADD CONSTRAINT history_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.mcq_questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: history_questions history_questions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.history_questions
    ADD CONSTRAINT history_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mcq_questions mcq_questions_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mcq_questions
    ADD CONSTRAINT mcq_questions_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: question_flags question_flags_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_flags
    ADD CONSTRAINT question_flags_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.mcq_questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: question_flags question_flags_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_flags
    ADD CONSTRAINT question_flags_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_mock_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_mock_test_id_fkey FOREIGN KEY (mock_test_id) REFERENCES public.mock_tests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_attempts test_attempts_mock_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_attempts
    ADD CONSTRAINT test_attempts_mock_test_id_fkey FOREIGN KEY (mock_test_id) REFERENCES public.mock_tests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_attempts test_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_attempts
    ADD CONSTRAINT test_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_section_links test_section_links_mock_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_section_links
    ADD CONSTRAINT test_section_links_mock_test_id_fkey FOREIGN KEY (mock_test_id) REFERENCES public.mock_tests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_section_links test_section_links_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_section_links
    ADD CONSTRAINT test_section_links_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_attempt_details user_attempt_details_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_attempt_details
    ADD CONSTRAINT user_attempt_details_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.mcq_questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_attempt_details user_attempt_details_user_score_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_attempt_details
    ADD CONSTRAINT user_attempt_details_user_score_id_fkey FOREIGN KEY (user_score_id) REFERENCES public.user_scores(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_responses user_responses_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_responses
    ADD CONSTRAINT user_responses_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.test_attempts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_responses user_responses_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_responses
    ADD CONSTRAINT user_responses_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.mcq_questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_scores user_scores_mock_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_scores
    ADD CONSTRAINT user_scores_mock_test_id_fkey FOREIGN KEY (mock_test_id) REFERENCES public.mock_tests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_scores user_scores_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_scores
    ADD CONSTRAINT user_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_settings user_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 89VestsuxGhD57s23heBoVezTPEqk113JrfS64vbzI0WNB38o71cLhzCkIt9kyp

