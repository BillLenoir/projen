import {
  App,
  Stack,
  StackProps,
  aws_lambda_nodejs as nodejs,
} from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    new nodejs.NodejsFunction(this, "MyFunction", {
      entry: "./graphql/src/index.ts", // accepts .js, .jsx, .cjs, .mjs, .ts, .tsx, .cts and .mts files
      handler: "myExportedFunc", // defaults to 'handler'
      runtime: Runtime.NODEJS_18_X,
      bundling: {
        format: nodejs.OutputFormat.ESM, // ECMAScript module output format, defaults to OutputFormat.CJS (OutputFormat.ESM requires Node.js 14.x)
        //minify: true, // minify code, defaults to false
        sourceMap: true, // include source map, defaults to false
        //target: "es2020", // target environment for the generated JavaScript code
      },
    });

    // define resources here...
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, "projen-dev", { env: devEnv });
// new MyStack(app, 'projen-prod', { env: prodEnv });

app.synth();
