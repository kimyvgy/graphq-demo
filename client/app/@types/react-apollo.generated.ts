import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Author = {
  __typename?: 'Author';
  name: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  username: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  author: Author;
  hashId: Scalars['String'];
  previewContent?: Maybe<Scalars['String']>;
  previewImage?: Maybe<Scalars['String']>;
  publishedAt?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  voteStatus: VoteStatus;
};

export type Query = {
  __typename?: 'Query';
  newestPosts: Array<Maybe<Post>>;
};

export const VoteStatus = {
  DOWN: 'DOWN',
  NONE: 'NONE',
  UP: 'UP'
} as const;

export type VoteStatus = typeof VoteStatus[keyof typeof VoteStatus];