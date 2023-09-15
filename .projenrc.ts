/**
 * Start with the command:
 *    npx projen new awscdk-app-ts --no-git
 * Then (with this file in place) run the command:
 *    npx projen
 */
import { awscdk, web, typescript } from "projen";

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  name: "projen_test",
  projenrcTs: true,
  prettier: true,

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

new web.ReactTypeScriptProject({
  defaultReleaseBranch: "main",
  parent: project,
  outdir: "webui",
  name: "projen_test",
  projenrcTs: true,
  prettier: true,

  // deps: [],                /* Runtime dependencies of this module. */
  deps: ["urql", "graphql"],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    "@babel/plugin-proposal-private-property-in-object",
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
});

const graphqlProject = new typescript.TypeScriptAppProject({
  defaultReleaseBranch: "main",
  name: "graphql",
  projenrcTs: true,
  parent: project,
  outdir: "graphql",
  tsconfig: {
    compilerOptions: {
      lib: ["es2021"],
      target: "es2021",
      module: "Node16",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    },
    include: ["src/**/*.ts", "src/**/*.mts"],
  },

  // deps: [],                /* Runtime dependencies of this module. */
  deps: ["@apollo/server", "graphql"],

  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    "@graphql-codegen/cli",
    "@graphql-codegen/typescript-resolvers",
    "@graphql-codegen/typescript",
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
});

const packageJson = graphqlProject.tryFindObjectFile("package.json");

// Use dot notation to address inside the object
packageJson?.addOverride("type", "module");

project.synth();
