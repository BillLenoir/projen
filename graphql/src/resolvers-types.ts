import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum Filter {
  Own = 'OWN',
  Prevown = 'PREVOWN',
  Trade = 'TRADE',
  Want = 'WANT'
}

export type Game = {
  __typename?: 'Game';
  description?: Maybe<Scalars['String']['output']>;
  gamefortrade?: Maybe<Scalars['Boolean']['output']>;
  gameown?: Maybe<Scalars['Boolean']['output']>;
  gameprevowned?: Maybe<Scalars['Boolean']['output']>;
  gamewanttobuy?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['Int']['output'];
  publisher?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  yearpublished?: Maybe<Scalars['Int']['output']>;
};

export type GameConnection = {
  __typename?: 'GameConnection';
  firstCursor?: Maybe<Scalars['String']['output']>;
  gameNumber: Scalars['Int']['output'];
  games?: Maybe<Array<Maybe<GameNode>>>;
  lastCursor?: Maybe<Scalars['String']['output']>;
  nextCursor?: Maybe<Scalars['String']['output']>;
  prevCursor?: Maybe<Scalars['String']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type GameNode = {
  __typename?: 'GameNode';
  cursor: Scalars['String']['output'];
  game: Game;
};

export type ListSize = {
  __typename?: 'ListSize';
  gameCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  findGames?: Maybe<GameConnection>;
  game?: Maybe<Game>;
};


export type QueryFindGamesArgs = {
  cursor: Scalars['String']['input'];
};


export type QueryGameArgs = {
  title: Scalars['String']['input'];
};

export enum Sort {
  Id = 'ID',
  Title = 'TITLE',
  Yearpublished = 'YEARPUBLISHED'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Filter: Filter;
  Game: ResolverTypeWrapper<Game>;
  GameConnection: ResolverTypeWrapper<GameConnection>;
  GameNode: ResolverTypeWrapper<GameNode>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  ListSize: ResolverTypeWrapper<ListSize>;
  Query: ResolverTypeWrapper<{}>;
  Sort: Sort;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Game: Game;
  GameConnection: GameConnection;
  GameNode: GameNode;
  Int: Scalars['Int']['output'];
  ListSize: ListSize;
  Query: {};
  String: Scalars['String']['output'];
}>;

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gamefortrade?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  gameown?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  gameprevowned?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  gamewanttobuy?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  publisher?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  yearpublished?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GameConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameConnection'] = ResolversParentTypes['GameConnection']> = ResolversObject<{
  firstCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gameNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  games?: Resolver<Maybe<Array<Maybe<ResolversTypes['GameNode']>>>, ParentType, ContextType>;
  lastCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nextCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prevCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GameNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameNode'] = ResolversParentTypes['GameNode']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListSizeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListSize'] = ResolversParentTypes['ListSize']> = ResolversObject<{
  gameCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  findGames?: Resolver<Maybe<ResolversTypes['GameConnection']>, ParentType, ContextType, RequireFields<QueryFindGamesArgs, 'cursor'>>;
  game?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<QueryGameArgs, 'title'>>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Game?: GameResolvers<ContextType>;
  GameConnection?: GameConnectionResolvers<ContextType>;
  GameNode?: GameNodeResolvers<ContextType>;
  ListSize?: ListSizeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

