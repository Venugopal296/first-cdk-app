import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {
  ICdkTsApiGatewayStackProps,
  IValidators,
} from '../../bin/stack-config-types';
import { LambdaApiFunction } from '../../src/api/rest/lambda';

export class OpenSecureApi extends Construct {
  constructor(scope: Construct, id: string, props: ICdkTsApiGatewayStackProps) {
    super(scope, id);

    const resolver = new LambdaApiFunction(this, 'create-lambda-api', {
      lambdaName: props.lambda.name,
      lambdaDesc: props.lambda.desc,
      lambdaMemory: props.lambda.memory,
      lambdaTimeout: props.lambda.timeout,
    });

    const integration = new apigateway.LambdaIntegration(resolver.handler);

    //API Gateway REST API
    const api = new apigateway.RestApi(this, props.api.name, {
      restApiName: props.api.name,
      description: props.api.desc,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Request Validator
    const createValidator = (input: IValidators) =>
      new apigateway.RequestValidator(this, input.requestValidatorName, {
        restApi: api,
        requestValidatorName: input.requestValidatorName,
        validateRequestBody: input.validateRequestBody,
        validateRequestParameters: input.validateRequestParameters,
      });

    const bodyValidator = createValidator(props.validators.bodyValidator);
    const paramValidator = createValidator(props.validators.paramValidator);
    const bodyAndParamValidator = createValidator(
      props.validators.bodyAndParamValidator
    );

    // API Gateway Model
    const model = new apigateway.Model(this, 'Model', {
      restApi: api,
      modelName: props.api.modelName,
      schema: {
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          name: { type: apigateway.JsonSchemaType.STRING },
        },
        required: ['name'],
      },
    });

    //Root Resource
    const rootResource = api.root.addResource(props.api.rootResource);

    // Open API Gateway Methods
    const openResource = rootResource.addResource('open');

    ['GET', 'POST', 'PUT', 'DELETE'].forEach((method) => {
      openResource.addMethod(method, integration, {
        operationName: `${method} Open Resource`,
      });
    });

    // Secure Resource and Methods
    const secureResource = rootResource.addResource('secure');
    const paramResource = secureResource.addResource('{param}');

    secureResource.addMethod('GET', integration, {
      operationName: 'Get Secure Resource',
      apiKeyRequired: true,
    });

    secureResource.addMethod('POST', integration, {
      operationName: 'Post Secure Resource',
      requestValidator: bodyValidator,
      requestModels: {
        'application/json': model,
      },
      apiKeyRequired: true,
    });

    ['GET', 'DELETE'].forEach((method) => {
      paramResource.addMethod(method, integration, {
        apiKeyRequired: true,
        operationName: `${method} Secure Param Resource`,
        requestValidator: paramValidator,
        requestParameters: {
          'method.request.path.param': true,
        },
      });
    });

    paramResource.addMethod('PATCH', integration, {
      operationName: 'Patch Secure Param Resource',
      requestValidator: bodyAndParamValidator,
      requestModels: {
        'application/json': model,
      },
      requestParameters: {
        'method.request.path.param': true,
      },
      apiKeyRequired: true,
    });

    //API usage plan
    const usagePlan = api.addUsagePlan('UsagePlan', {
      name: props.usageplan.name,
      description: props.usageplan.desc,
      apiStages: [{ api, stage: api.deploymentStage }],
      throttle: {
        burstLimit: props.usageplan.burstLimit,
        rateLimit: props.usageplan.burstLimit,
      },
      quota: {
        limit: props.usageplan.limit,
        period: apigateway.Period.DAY,
      },
    });

    //API Key
    const apiKey = api.addApiKey('ApiKey', {
      apiKeyName: props.apiKey.name,
      description: props.apiKey.desc,
    });

    usagePlan.addApiKey(apiKey);
  }
}
